import type { VariableLibrary } from '../../data/variable-library'

export function createEnvironmentMethods (VariableLibrary: VariableLibrary) {
  return {
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
