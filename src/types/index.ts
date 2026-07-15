export type DeviceInfoKey =
  | 'deviceType'
  | 'isEmulator'
  | 'deviceModel'
  | 'OS'
  | 'OSVersion'
  | 'platform'
  | 'screenHeight'
  | 'screenWidth'
  | 'language'
  | 'netWork'
  | 'orientation'
  | 'browserInfo'
  | 'fingerprint'
  | 'userAgent'
  | 'geoPosition'
  | 'date'
  | 'lunarDate'
  | 'week'
  | 'UUID'

export interface DeviceInfoOptions {
  domain?: string
  transferDateToLunar?: string
  info?: DeviceInfoKey[]
}

export interface LunarDateInfo {
  year: string
  month: string
  day: string
  chineseZodiac: string
}

export interface DeviceInfo {
  deviceType?: string
  isEmulator?: boolean
  deviceModel?: string
  OS?: string
  OSVersion?: string
  platform?: string
  screenHeight?: number
  screenWidth?: number
  language?: string
  netWork?: string
  orientation?: string
  browserInfo?: string
  fingerprint?: string
  userAgent?: string
  geoPosition?: string
  date?: string
  lunarDate?: LunarDateInfo
  week?: string
  UUID?: string
}

export interface DeviceApi {
  Info(params?: DeviceInfoOptions): Promise<DeviceInfo>
}
