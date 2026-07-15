import type { VariableLibrary } from '../../data/variable-library'

export function createEnvironmentMethods (VariableLibrary: VariableLibrary) {
  return {
      // 当前主题色彩模式
      getColorScheme: function () {
        if (window?.matchMedia?.('(prefers-color-scheme: dark)')?.matches) return 'dark'
        if (window?.matchMedia?.('(prefers-color-scheme: light)')?.matches) return 'light'
        return ''
      },
      // 设备像素比
      getDevicePixelRatio: function () {
        return window?.devicePixelRatio
      },
      // 逻辑处理器核心数
      getHardwareConcurrency: function () {
        return VariableLibrary?.navigator?.hardwareConcurrency
      },
      // 是否支持触摸
      getTouchSupport: function () {
        return !!(VariableLibrary?.navigator?.maxTouchPoints || 'ontouchstart' in window)
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
      getNetwork: function () {
        let netWork = (navigator as Navigator & { connection?: { effectiveType?: string } })?.connection?.effectiveType
        let isOnline = navigator?.onLine
        let res = ""
        if (isOnline) {
          res = netWork ? netWork : "网络状态获取失败"
        } else {
          res = "离线"
        }
        return res
      },
      // 获取当前语言
      getLanguage: function () {
        let _this = this
        _this.language = (function () {
          let language = (VariableLibrary?.navigator?.browserLanguage || VariableLibrary?.navigator?.language)
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
