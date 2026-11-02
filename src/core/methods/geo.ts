import type { GeoPositionResult } from '../../types/internal'
import type { VariableLibrary } from '../../data/variable-library'

export function createGeoMethods (VariableLibrary: VariableLibrary) {
  return {
      // 获取地理位置；maximumAge 使模拟器/DevTools 设置的坐标可被复用
      getGeoPosition: function (): Promise<GeoPositionResult | null> {
        const navigatorScope = VariableLibrary?.navigator
        if (!navigatorScope?.geolocation) return Promise.resolve(null)
        return new Promise<GeoPositionResult | null>(function (resolve) {
          navigatorScope.geolocation.getCurrentPosition(
            function (position) { resolve(position) },
            function () { resolve(null) },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
          )
        })
      },
  }
}
