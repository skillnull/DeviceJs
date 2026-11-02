import type { DeviceInfoKey, DeviceInfoOptions } from '../types'
import type { MethodLibrary } from '../core/method-library'
import type { VariableLibrary } from '../data/variable-library'
import { getLocaleMessages } from '../data/locale'

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
      viewportHeight: () => _window?.innerHeight,
      viewportWidth: () => _window?.innerWidth,
      devicePixelRatio: () => _window?.devicePixelRatio,
      hardwareConcurrency: () => MethodLibrary?.getHardwareConcurrency(),
      touchSupport: () => MethodLibrary?.getTouchSupport(),
      cookieEnabled: () => MethodLibrary?.getCookieEnabled(),
      colorScheme: () => MethodLibrary?.getColorScheme(),
      timezone: () => MethodLibrary?.getTimezone(),
      language: () => MethodLibrary?.getLanguage(),
      netWork: (params) => MethodLibrary?.getNetwork(params?.locale),
      orientation: (params) => MethodLibrary?.getOrientationStatus(params?.locale),
      browserInfo: (params) => MethodLibrary?.getBrowserInfo(params?.locale),
      fingerprint: (params) => MethodLibrary?.createFingerprint(params?.domain || ''),
      userAgent: () => VariableLibrary?.navigator?.userAgent,
      geoPosition: () => null,
      date: () => MethodLibrary?.getDate(),
      lunarDate: (params) => MethodLibrary?.toLunarDate(params?.transferDateToLunar || ''),
      week: (params) => MethodLibrary?.getWeek(params?.locale),
      UUID: () => MethodLibrary?.createUUID(),
      isEmulator: () => MethodLibrary?.getIsEmulator(),
      deviceModel: () => MethodLibrary?.getDeviceModel()
    }
    const keys = Object.keys(fields)
    return {
      DeviceInfoObj (params: DeviceInfoOptions = {}) {
        const messages = getLocaleMessages(params.locale)
        const need = !params?.info?.length
          ? keys
          : keys.filter(k => params.info.some(i => (i || '').toLowerCase() === k.toLowerCase()))
        const result: Record<string, any> = {}
        need.forEach(k => { result[k] = fields[k](params) })
        const tasks = []
        if ('geoPosition' in result) {
          tasks.push(MethodLibrary.getGeoPosition()
            .then(geoPosition => {
              result.geoPosition = geoPosition
                ? `${messages.longitude}:${geoPosition.coords.longitude}  ${messages.latitude}:${geoPosition.coords.latitude}`
                : messages.unavailable
            })
            .catch(() => { result.geoPosition = messages.unavailable }))
        }
        if ('deviceModel' in result && result.deviceModel && typeof result.deviceModel.then === 'function') {
          tasks.push(result.deviceModel.then(deviceModel => { result.deviceModel = deviceModel || messages.unknown }))
        } else if ('deviceModel' in result) {
          result.deviceModel = result.deviceModel || messages.unknown
        }
        if (!tasks.length) return Promise.resolve(result)
        return Promise.all(tasks).then(() => result)
      }
    }
  })()
  return LogicLibrary
}

export type LogicLibrary = ReturnType<typeof createLogicLibrary>
