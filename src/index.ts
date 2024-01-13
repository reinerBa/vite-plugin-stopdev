import { Plugin, ViteDevServer } from 'vite'

const PLUGIN_NAME = 'vite-plugin-stopdev'

export type stopdevOptions = {
  stopTime?: number
  beforeStop?: () => void
  afterStop?: () => void
  afterIdle?: number
  afterIdleHours? :number
}

export default (options?: number | stopdevOptions): Plugin => {
  let stopTime = 5000
  if (typeof options === 'number') stopTime = options
  else if (typeof options?.stopTime === 'number') stopTime = options.stopTime

  if (typeof options === 'object' && typeof options.afterIdleHours === 'number' && !isNaN(options.afterIdleHours) && options.afterIdleHours > 0)
    options.afterIdle = 1000 * 60 * 60 * options.afterIdleHours

  const timeoutIdsArray: NodeJS.Timeout[] = []

  return {
    name: PLUGIN_NAME,
    apply: 'serve',
    async configureServer (server: ViteDevServer) {
      if (typeof options === 'object' && typeof options.afterIdle === 'number' && !isNaN(options.afterIdle) && options.afterIdle > 0) {
        stopTime = 1
        timeoutIdsArray.push(setTimeout(() => stopServer(server), options.afterIdle))

        server.middlewares.use((_, __, next) => {
          while (timeoutIdsArray.length > 0) clearTimeout(timeoutIdsArray.pop())
          timeoutIdsArray.push(setTimeout(() => stopServer(server), options.afterIdle))

          next()
        })
      } else stopServer(server)
    }
  }

  function stopServer (server: ViteDevServer): void {
    setTimeout(async () => {
      while (timeoutIdsArray.length > 0) clearTimeout(timeoutIdsArray.pop())
      if (typeof options === 'object' && typeof options.beforeStop === 'function') await options.beforeStop()

      await server.close()

      if (typeof options === 'object' && typeof options.afterStop === 'function') await options.afterStop()

      console.log('Vite development server was stopped by vite-plugin-stopdev')
      setTimeout(process.exit, 1e3)
    }
    , stopTime)
  }
}
