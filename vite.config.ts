import { ConfigEnv, UserConfigExport } from 'vite'
import stopdev, {stopdevOptions} from './src'
import { server } from 'typescript'

let beforeStopWorks = false
let afterStopWorks = true
let port = 5173

const plugins =[
  stopdev({
    afterIdle: 6000, 
    beforeStop: async () => {
      const r = await fetch(`http://localhost:${port}`)
      const text = await r.text()
      console.log(`fetched html: ${text.substring(0, 15)}`)

      console.log('goint to stop vite dev server')
      beforeStopWorks = true   
    },
    afterStop: () => {
      afterStopWorks = true
      console.log('stopped vite dev server')
      if(!beforeStopWorks) throw new Error('before stop was not called!')
    }
  } as stopdevOptions)  
] 

export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  if(mode === 'test') 
  plugins.push({
name: `vite-plugin-stopmanual`,
apply: 'serve',
    async configureServer() {
      setTimeout(() => {
        throw new Error('dev server was not stopped!')
      } , 8e3)
    }
  })
  
  return {
    server: {port},
    plugins
}}
