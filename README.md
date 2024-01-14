# vite-plugin-stopdev

[![npm][npm-img]][npm-url]
[![NPM License](https://img.shields.io/npm/l/all-contributors.svg?style=flat)](https://github.com/reinerBa/vite-plugin-stopdev/blob/primary/LICENSE)
[![PR's Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com)  
<a href="https://github.com/reinerBa/vite-plugin-stopdev/actions">
  <img src="https://github.com/reinerBa/vite-plugin-stopdev/actions/workflows/compileAndRuntime.yml/badge.svg" alt="test workflow">
</a>
[![GitHub last commit](https://img.shields.io/github/last-commit/reinerBa/vite-plugin-stopdev.svg?style=flat)]()
[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/)

Stops your (local or CI)-Vite development server after a given time or a given time of inactivity. 
With a callback to use before the dev server is stopped and another to use before the node process is terminated. 
Usefull to run tests on development server with to let the development server run forever. 
Or to prevent your dev server from running for days on your local maschine.

## Install

**node version:** >=12.0.0

**vite version:** >=2.0.0

```bash
# if using npm
npm i vite-plugin-stopdev -D
# if using yarn
yarn add vite-plugin-stopdev -D
```

## Usage

Config plugin in vite.config.ts with a fix time to die or an object with options

```ts
import { defineConfig } from 'vite'
import stopdev from 'vite-plugin-stopdev'
// in commonjs use require ->
// const stopdev = require('vite-plugin-stopdev').default

export default defineConfig({
  plugins: [
    // kills the dev server after 5 secounds
    stopdev()
  ]
})
```

```ts
import { defineConfig } from 'vite'
import stopdev from 'vite-plugin-stopdev'

export default defineConfig({
  plugins: [
    stopdev({
      // kills the dev server after 3 secounds 
      // this property will be ignored when afterIdle is set  
      stopTime: 3000, 
      // kills the dev server after 2 hours without an http request
      afterIdleHours: 2, 
      // afterIdle will be ignored when afterIdleHours is set
      afterIdle: 6000,  
      // will be called with await before the dev server will be stopped
      // a good place to run tests with await 
      beforeStop: () => {
        console.log('goint to stop vite dev server')
      },
      // will be called with await after the dev server was stopped and before the node process will be exited 
      afterStop: () => {
        console.log('stopped vite dev server')
      }
    } as stopdevOptions)
  ]
})
```

## Exported types by Module
  
```ts
type stopdevOptions = {
    stopTime?: number
    beforeStop?: () => void
    afterStop?: () => void
    afterIdle?: number
    afterIdleHours?: number
}
```

## License

MIT

[npm-img]: https://img.shields.io/npm/v/vite-plugin-stopdev.svg
[npm-url]: https://npmjs.com/package/vite-plugin-stopdev
[Vite]: https://vitejs.dev