import type { DeviceApi, DeviceInfo, DeviceInfoOptions } from './types'
import { createMethodLibrary } from './core/method-library'
import { createVariableLibrary } from './data/variable-library'
import { createLogicLibrary } from './logic/device-info'

export type * from './types'

function resolveGlobalScope (): any {
  if (typeof globalThis !== 'undefined') return globalThis
  if (typeof self !== 'undefined') return self
  if (typeof window !== 'undefined') return window
  return {}
}

const globalScope = resolveGlobalScope()

const Device: DeviceApi = (function () {
  const runtimeScope = globalScope.window || globalScope
  const VariableLibrary = createVariableLibrary(runtimeScope)
  const MethodLibrary = createMethodLibrary(VariableLibrary, runtimeScope)
  const LogicLibrary = createLogicLibrary({ MethodLibrary, VariableLibrary, windowScope: runtimeScope })
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
    Info: function (params: DeviceInfoOptions = {}): Promise<DeviceInfo> {
      const loadingElement = params.showLoading ? MethodLibrary.createLoading() : undefined
      const removeLoading = () => MethodLibrary.removeLoading(loadingElement)

      return Promise.resolve()
        .then(() => LogicLibrary.DeviceInfoObj(params))
        .then(
          result => {
            removeLoading()
            return result as DeviceInfo
          },
          error => {
            removeLoading()
            throw error
          }
        )
    }
  }
})()

if (globalScope.window) {
  globalScope.window.Device = Device
}

export default Device
