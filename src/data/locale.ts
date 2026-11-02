import type { DeviceLocale } from '../types'

const localeMessages = {
  'zh-CN': {
    unknown: '未知',
    unavailable: '获取失败',
    offline: '离线',
    portrait: '竖屏',
    landscape: '横屏',
    longitude: '经度',
    latitude: '纬度',
    version: '版本',
    engine: '内核',
    weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  },
  'en-US': {
    unknown: 'Unknown',
    unavailable: 'Unavailable',
    offline: 'Offline',
    portrait: 'Portrait',
    landscape: 'Landscape',
    longitude: 'Longitude',
    latitude: 'Latitude',
    version: 'version',
    engine: 'engine',
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  }
} as const

export function getLocaleMessages (locale: DeviceLocale = 'zh-CN') {
  return localeMessages[locale] || localeMessages['zh-CN']
}
