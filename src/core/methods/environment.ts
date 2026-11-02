import type { VariableLibrary } from '../../data/variable-library'
import { getLocaleMessages } from '../../data/locale'
import type { DeviceLocale } from '../../types'

export function createEnvironmentMethods (VariableLibrary: VariableLibrary, runtimeScope: any) {
  return {
      // 当前主题色彩模式
      getColorScheme: function () {
        if (runtimeScope?.matchMedia?.('(prefers-color-scheme: dark)')?.matches) return 'dark'
        if (runtimeScope?.matchMedia?.('(prefers-color-scheme: light)')?.matches) return 'light'
        return ''
      },
      // 设备像素比
      getDevicePixelRatio: function () {
        return runtimeScope?.devicePixelRatio
      },
      // 逻辑处理器核心数
      getHardwareConcurrency: function () {
        return VariableLibrary?.navigator?.hardwareConcurrency
      },
      // 是否支持触摸
      getTouchSupport: function () {
        return !!(VariableLibrary?.navigator?.maxTouchPoints || (runtimeScope && 'ontouchstart' in runtimeScope))
      },
      // Cookie 是否可用
      getCookieEnabled: function () {
        return VariableLibrary?.navigator?.cookieEnabled
      },
      // 时区
      getTimezone: function () {
        return Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      // 获取网络状态
      getNetwork: function (locale?: DeviceLocale) {
        const messages = getLocaleMessages(locale)
        const navigatorScope = VariableLibrary?.navigator as Navigator & { connection?: { effectiveType?: string } }
        if (typeof navigatorScope?.onLine !== 'boolean') return messages.unknown
        if (!navigatorScope.onLine) return messages.offline
        return navigatorScope.connection?.effectiveType || messages.unavailable
      },
      // 获取当前语言
      getLanguage: function () {
        let _this = this
        _this.language = (function () {
          let language = (VariableLibrary?.navigator?.browserLanguage || VariableLibrary?.navigator?.language)
          if (!language) return ''
          let arr = language?.split('-')
          if (arr[1]) {
            arr[1] = arr?.[1]?.toUpperCase()
          }
          return arr?.join('_')
        })()
        return _this.language
      },
  }
}
