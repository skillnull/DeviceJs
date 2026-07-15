import type { DeviceInfoKey, DeviceInfoOptions } from '../types'
import type { MethodLibrary } from '../core/method-library'
import type { VariableLibrary } from '../data/variable-library'

interface CreateLogicLibraryOptions {
  MethodLibrary: MethodLibrary
  VariableLibrary: VariableLibrary
  windowScope: any
}

export function createLogicLibrary ({ MethodLibrary, VariableLibrary, windowScope: _window }: CreateLogicLibraryOptions) {
  // 逻辑层：按需计算字段
  const LogicLibrary = (function () {
    const fields: Record<DeviceInfoKey, (params?: DeviceInfoOptions) => any> = {
      deviceType: () => MethodLibrary?.getDeviceType(),
      OS: () => MethodLibrary?.getOS(),
      OSVersion: () => MethodLibrary?.getOSVersion(),
      platform: () => MethodLibrary?.getPlatform(),
      screenHeight: () => _window?.screen?.height,
      screenWidth: () => _window?.screen?.width,
      language: () => MethodLibrary?.getLanguage(),
      netWork: () => MethodLibrary?.getNetwork(),
      orientation: () => MethodLibrary?.getOrientationStatu(),
      browserInfo: () => MethodLibrary?.getBrowserInfo(),
      fingerprint: (p) => MethodLibrary?.createFingerprint(p?.domain || ''),
      userAgent: () => VariableLibrary?.navigator?.userAgent,
      geoPosition: () => true,
      date: () => MethodLibrary?.getDate(),
      lunarDate: (p) => MethodLibrary?.toLunarDate(p?.transferDateToLunar || ''),
      week: () => MethodLibrary?.getWeek(),
      UUID: () => MethodLibrary?.createUUID(),
      isEmulator: () => MethodLibrary?.getIsEmulator(),
      deviceModel: () => MethodLibrary?.getDeviceModel()
    }
    const keys = Object.keys(fields)
    return {
      DeviceInfoObj (params) {
        const need = !params?.info?.length
          ? keys
          : keys.filter(k => params.info.some(i => (i || '').toLowerCase() === k.toLowerCase()))
        const result: Record<string, any> = {}
        need.forEach(k => { result[k] = fields[k](params) })
        const tasks = []
        if ('geoPosition' in result) {
          tasks.push(MethodLibrary?.getGeoPostion?.()
            .then(geo => { result.geoPosition = `经度:${geo?.coords?.longitude}  纬度:${geo?.coords?.latitude}` })
            .catch(err => { result.geoPosition = err }))
        }
        if ('deviceModel' in result && result.deviceModel && typeof result.deviceModel.then === 'function') {
          tasks.push(result.deviceModel.then(v => { result.deviceModel = v || '未知' }))
        } else if ('deviceModel' in result) {
          result.deviceModel = result.deviceModel || '未知'
        }
        if (!tasks.length) return Promise.resolve(result)
        return Promise.all(tasks).then(() => result)
      }
    }
  })()
  return LogicLibrary
}

export type LogicLibrary = ReturnType<typeof createLogicLibrary>
