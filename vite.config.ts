import { ConfigEnv, UserConfigExport, defineConfig } from 'vite'
import stopdev, {stopdevOptions} from './src'

let beforeStopWorks = false
let afterStopWorks = true

const plugins =[
  stopdev({
    afterIdle: 6000, 
    beforeStop: () => {
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
  plugins
}}
