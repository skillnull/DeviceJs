export type DeviceInfoKey = 'deviceType' | 'isEmulator' | 'deviceModel' | 'OS' | 'OSVersion' | 'platform' | 'screenHeight' | 'screenWidth' | 'viewportHeight' | 'viewportWidth' | 'devicePixelRatio' | 'hardwareConcurrency' | 'touchSupport' | 'cookieEnabled' | 'colorScheme' | 'timezone' | 'language' | 'netWork' | 'orientation' | 'browserInfo' | 'fingerprint' | 'userAgent' | 'geoPosition' | 'date' | 'lunarDate' | 'week' | 'UUID';
export type DeviceLocale = 'zh-CN' | 'en-US';
export interface DeviceInfoOptions {
    /** 生成浏览器指纹时使用的域名，默认为当前页面域名。 */
    domain?: string;
    /** 需要转换为农历的公历日期。 */
    transferDateToLunar?: string;
    /** 需要返回的信息字段，不传时返回全部字段。 */
    info?: DeviceInfoKey[];
    /** 文本结果使用的语言，默认为简体中文。 */
    locale?: DeviceLocale;
    /** 是否在浏览器中显示加载层，默认不显示。 */
    showLoading?: boolean;
}
export interface LunarDateInfo {
    /** 中文农历年份。 */
    year: string;
    /** 中文农历月份。 */
    month: string;
    /** 中文农历日期。 */
    day: string;
    /** 生肖。 */
    chineseZodiac: string;
}
export interface DeviceInfo {
    /** 设备类型。 */
    deviceType?: string;
    /** 是否为模拟器或浏览器设备模拟环境。 */
    isEmulator?: boolean;
    /** 设备型号。 */
    deviceModel?: string;
    /** 操作系统名称。 */
    OS?: string;
    /** 操作系统版本。 */
    OSVersion?: string;
    /** 操作系统平台。 */
    platform?: string;
    /** 物理屏幕高度。 */
    screenHeight?: number;
    /** 物理屏幕宽度。 */
    screenWidth?: number;
    /** 视口高度。 */
    viewportHeight?: number;
    /** 视口宽度。 */
    viewportWidth?: number;
    /** 设备像素比。 */
    devicePixelRatio?: number;
    /** 浏览器可用的逻辑处理器数量。 */
    hardwareConcurrency?: number;
    /** 是否支持触摸输入。 */
    touchSupport?: boolean;
    /** Cookie 是否可用。 */
    cookieEnabled?: boolean;
    /** 当前主题色彩模式。 */
    colorScheme?: string;
    /** 当前时区。 */
    timezone?: string;
    /** 当前语言和地区。 */
    language?: string;
    /** 当前网络状态或网络类型。 */
    netWork?: string;
    /** 当前屏幕方向。 */
    orientation?: string;
    /** 浏览器名称、版本和内核信息。 */
    browserInfo?: string;
    /** 基于 Canvas 生成的浏览器指纹。 */
    fingerprint?: string;
    /** 浏览器 User-Agent。 */
    userAgent?: string;
    /** 当前地理位置或不可用说明。 */
    geoPosition?: string;
    /** 当前公历日期时间。 */
    date?: string;
    /** 农历日期信息。 */
    lunarDate?: LunarDateInfo;
    /** 当前星期。 */
    week?: string;
    /** 随机生成的 UUID。 */
    UUID?: string;
}
export interface DeviceApi {
    /** 获取指定或全部设备信息。 */
    Info(params?: DeviceInfoOptions): Promise<DeviceInfo>;
}
