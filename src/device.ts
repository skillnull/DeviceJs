import type { DeviceApi, DeviceInfo, DeviceInfoOptions } from './types'
import { createMethodLibrary } from './core/method-library'
import { createVariableLibrary } from './data/variable-library'
import { createLogicLibrary } from './logic/device-info'

export type * from './types'

const globalScope = globalThis as any

if (typeof globalScope.window === "undefined" || globalScope.window === null) {
  const jsdom = require("jsdom")
  const {JSDOM} = jsdom
  const DOM = new JSDOM(``)
  globalScope.window = DOM?.window
  globalScope.document = DOM?.window?.document
}

const Device: DeviceApi = (function () {
  const root = typeof self !== 'undefined' ? self : globalScope.window
  const _window = root || {}
  const VariableLibrary = createVariableLibrary(root)
  const MethodLibrary = createMethodLibrary(VariableLibrary, _window)
  const LogicLibrary = createLogicLibrary({ MethodLibrary, VariableLibrary, windowScope: _window })
  // 对外暴露方法
  return {
    /**
     * @params:{
     *  domain: <String> 生成浏览器指纹所需，不传默认使用window.location.host;
     *  info: <Array> 想要获取的信息，不传默认显示全部信息
     * }
     *
     * @return: 返回 Promise 对象
     */
    Info: function (params?: DeviceInfoOptions): Promise<DeviceInfo> {
      MethodLibrary?.createLoading()
      return new Promise(resolve => {
        LogicLibrary?.DeviceInfoObj(params)?.then(res => {
          MethodLibrary?.removeLoading()
          resolve(res as DeviceInfo)
        })
      })
    }
  }
})()

globalScope.window.Device = Device

export default Device
