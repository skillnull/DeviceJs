import type { GeoPositionResult } from '../../types/internal'

export function createGeoMethods () {
  return {
      // 获取地理位置；maximumAge 使模拟器/DevTools 设置的坐标可被复用
      getGeoPostion: function (): Promise<GeoPositionResult> {
        var failResult = { coords: { longitude: '获取失败', latitude: '获取失败' } }
        if (!navigator?.geolocation) return Promise.resolve(failResult)
        return new Promise<GeoPositionResult>(function (resolve) {
          navigator.geolocation.getCurrentPosition(
            function (position) { resolve(position) },
            function () { resolve(failResult) },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
          )
        })
      },
  }
}
