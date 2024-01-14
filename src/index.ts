import { Plugin, ViteDevServer } from 'vite'

const PLUGIN_NAME = 'vite-plugin-stopdev'

export interface stopdevOptions {
  stopTime?: number
  beforeStop?: () => void
  afterStop?: () => void
  afterIdle?: number
  afterIdleHours?: number
}

export default (options?: number | stopdevOptions): Plugin => {
  let stopTime = 5000
  let afterIdle = 0
  
  if (typeof options === 'number') stopTime = options
  else if (typeof options?.stopTime === 'number') stopTime = options.stopTime

  if (typeof options === 'object') {
    if (typeof options.afterIdle === 'number' && options.afterIdle > 0) {
      afterIdle = options.afterIdle
      stopTime = 1

      if (typeof options.stopTime === 'number' && options.stopTime > 0) { 
        console.warn('#vite-plugin-stopdev: afterIdle and stopTime shall not be defined both. \n\r\tstopTime will be ignored') 
      }

      if (typeof options.afterIdleHours === 'number' && options.afterIdleHours > 0) { 
        console.warn('#vite-plugin-stopdev: afterIdle and afterIdleHours shall not be defined both. \n\r\tafterIdle will be ignored') 
      }
    }

    if (typeof options.afterIdleHours === 'number' && !isNaN(options.afterIdleHours) && options.afterIdleHours > 0) { 
      afterIdle = 1000 * 60 * 60 * options.afterIdleHours 
    }
  }

  const timeoutIdsArray: NodeJS.Timeout[] = []

  return {
    name: PLUGIN_NAME,
    apply: 'serve',
    async configureServer (server: ViteDevServer) {
      if (afterIdle > 0) {
        timeoutIdsArray.push(setTimeout(() => stopServer(server), afterIdle))

        server.middlewares.use((_, __, next) => {
          while (timeoutIdsArray.length > 0) clearTimeout(timeoutIdsArray.pop())
          timeoutIdsArray.push(setTimeout(() => stopServer(server), afterIdle))

          next()
        })
      } else stopServer(server)
    }
  }

  function stopServer (server: ViteDevServer): void {
    setTimeout(async () => {
      while (timeoutIdsArray.length > 0) clearTimeout(timeoutIdsArray.pop())
      if (typeof options === 'object' && typeof options.beforeStop === 'function') 
        await options.beforeStop()

      await server.close()

      if (typeof options === 'object' && typeof options.afterStop === 'function') 
        await options.afterStop()

      console.log('Vite development server was stopped by vite-plugin-stopdev')
      setTimeout(process.exit, 1e3)
    }
    , stopTime)
  }
}
