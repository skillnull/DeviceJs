export function createVariableLibrary (root: any) {
  // 变量库
  const VariableLibrary = {
    navigator: typeof root?.navigator != 'undefined' ? root?.navigator : {},
  // 信息map
  infoMap: {
    engine: ['WebKit', 'Trident', 'Gecko', 'Presto'],
    browser: [
      'Safari',
      'Chrome',
      'Edge',
      'IE',
      'Firefox',
      'Firefox Focus',
      'Chromium',
      'Opera',
      'Vivaldi',
      'Yandex',
      'Arora',
      'Lunascape',
      'QupZilla',
      'Coc Coc',
      'Kindle',
      'Iceweasel',
      'Konqueror',
      'Iceape',
      'SeaMonkey',
      'Epiphany',
      '360',
      '360SE',
      '360EE',
      'UC',
      'QQBrowser',
      'QQ',
      'Baidu',
      'Maxthon',
      'Sogou',
      'LBBROWSER',
      '2345Explorer',
      'TheWorld',
      'XiaoMi',
      'Quark',
      'Qiyu',
      'Wechat',
      'WechatWork',
      'Taobao',
      'Alipay',
      'Weibo',
      'Douban',
      'Suning',
      'iQiYi',
      'Arc',
      'Samsung Browser'
    ],
    os: [
      'Windows',
      'Linux',
      'Mac OS',
      'Android',
      'Ubuntu',
      'FreeBSD',
      'Debian',
      'iOS',
      'Windows Phone',
      'BlackBerry',
      'MeeGo',
      'Symbian',
      'Chrome OS',
      'WebOS',
      'HarmonyOS'
    ],
    device: ['Mobile', 'Tablet', 'iPad'],
    // 设备型号映射：原始标识 -> 展示名。iPhone 具体机型仅当 UA 含 iPhonexx,x 时可解析（Safari 标准 UA 不含）；Pixel 以 UA Build 为准，避免 Client Hints 返回通用型号
    deviceModelMap: {
      // Apple iPhone（UA 中为 iPhone14,2 等）
      'iPhone4,1': 'iPhone 4s', 'iPhone5,1': 'iPhone 5', 'iPhone5,2': 'iPhone 5', 'iPhone5,3': 'iPhone 5c', 'iPhone5,4': 'iPhone 5c',
      'iPhone6,1': 'iPhone 5s', 'iPhone6,2': 'iPhone 5s', 'iPhone7,1': 'iPhone 6 Plus', 'iPhone7,2': 'iPhone 6',
      'iPhone8,1': 'iPhone 6s', 'iPhone8,2': 'iPhone 6s Plus', 'iPhone8,4': 'iPhone SE',
      'iPhone9,1': 'iPhone 7', 'iPhone9,2': 'iPhone 7 Plus', 'iPhone9,3': 'iPhone 7', 'iPhone9,4': 'iPhone 7 Plus',
      'iPhone10,1': 'iPhone 8', 'iPhone10,2': 'iPhone 8 Plus', 'iPhone10,3': 'iPhone X', 'iPhone10,4': 'iPhone 8', 'iPhone10,5': 'iPhone 8 Plus', 'iPhone10,6': 'iPhone X',
      'iPhone11,2': 'iPhone XS', 'iPhone11,4': 'iPhone XS Max', 'iPhone11,6': 'iPhone XS Max', 'iPhone11,8': 'iPhone XR',
      'iPhone12,1': 'iPhone 11', 'iPhone12,3': 'iPhone 11 Pro', 'iPhone12,5': 'iPhone 11 Pro Max',
      'iPhone13,1': 'iPhone 12 mini', 'iPhone13,2': 'iPhone 12', 'iPhone13,3': 'iPhone 12 Pro', 'iPhone13,4': 'iPhone 12 Pro Max',
      'iPhone14,2': 'iPhone 12', 'iPhone14,3': 'iPhone 12 Pro', 'iPhone14,4': 'iPhone 12 mini', 'iPhone14,5': 'iPhone 12 Pro Max',
      'iPhone14,6': 'iPhone SE (3rd)', 'iPhone14,7': 'iPhone 14', 'iPhone14,8': 'iPhone 14 Plus', 'iPhone15,2': 'iPhone 14 Pro', 'iPhone15,3': 'iPhone 14 Pro Max',
      'iPhone15,4': 'iPhone 15', 'iPhone15,5': 'iPhone 15 Plus', 'iPhone16,1': 'iPhone 15 Pro', 'iPhone16,2': 'iPhone 15 Pro Max',
      'iPhone17,1': 'iPhone 16 Pro', 'iPhone17,2': 'iPhone 16 Pro Max', 'iPhone17,3': 'iPhone 16', 'iPhone17,4': 'iPhone 16 Plus',
      'iPhone 14': 'iPhone 14', 'iPhone 15': 'iPhone 15', 'iPhone 16': 'iPhone 16', 'iPhone SE (3rd)': 'iPhone SE (3rd)',
      // Apple iPad
      'iPad2,1': 'iPad 2', 'iPad2,2': 'iPad 2', 'iPad2,3': 'iPad 2', 'iPad2,4': 'iPad 2', 'iPad2,5': 'iPad mini', 'iPad2,6': 'iPad mini', 'iPad2,7': 'iPad mini',
      'iPad3,1': 'iPad 3', 'iPad3,2': 'iPad 3', 'iPad3,3': 'iPad 3', 'iPad3,4': 'iPad 4', 'iPad3,5': 'iPad 4', 'iPad3,6': 'iPad 4',
      'iPad4,1': 'iPad Air', 'iPad4,2': 'iPad Air', 'iPad4,3': 'iPad Air', 'iPad4,4': 'iPad mini 2', 'iPad4,5': 'iPad mini 2', 'iPad4,6': 'iPad mini 2', 'iPad4,7': 'iPad mini 3', 'iPad4,8': 'iPad mini 3', 'iPad4,9': 'iPad mini 3',
      'iPad5,1': 'iPad mini 4', 'iPad5,2': 'iPad mini 4', 'iPad5,3': 'iPad Air 2', 'iPad5,4': 'iPad Air 2', 'iPad6,3': 'iPad Pro 9.7', 'iPad6,4': 'iPad Pro 9.7', 'iPad6,7': 'iPad Pro 12.9', 'iPad6,8': 'iPad Pro 12.9',
      'iPad6,11': 'iPad 5', 'iPad6,12': 'iPad 5', 'iPad7,1': 'iPad Pro 12.9 2', 'iPad7,2': 'iPad Pro 12.9 2', 'iPad7,3': 'iPad Pro 10.5', 'iPad7,4': 'iPad Pro 10.5', 'iPad7,5': 'iPad 6', 'iPad7,6': 'iPad 6',
      'iPad7,11': 'iPad 7', 'iPad7,12': 'iPad 7', 'iPad8,1': 'iPad Pro 11', 'iPad8,2': 'iPad Pro 11', 'iPad8,3': 'iPad Pro 11', 'iPad8,4': 'iPad Pro 11', 'iPad8,5': 'iPad Pro 12.9 3', 'iPad8,6': 'iPad Pro 12.9 3', 'iPad8,7': 'iPad Pro 12.9 3', 'iPad8,8': 'iPad Pro 12.9 3',
      'iPad8,9': 'iPad Pro 11 2', 'iPad8,10': 'iPad Pro 11 2', 'iPad8,11': 'iPad Pro 12.9 4', 'iPad8,12': 'iPad Pro 12.9 4',
      'iPad11,1': 'iPad mini 5', 'iPad11,2': 'iPad mini 5', 'iPad11,3': 'iPad Air 3', 'iPad11,4': 'iPad Air 3', 'iPad11,6': 'iPad 8', 'iPad11,7': 'iPad 8',
      'iPad12,1': 'iPad 9', 'iPad12,2': 'iPad 9', 'iPad13,1': 'iPad Air 4', 'iPad13,2': 'iPad Air 4', 'iPad13,4': 'iPad Pro 11 3', 'iPad13,5': 'iPad Pro 11 3', 'iPad13,6': 'iPad Pro 11 3', 'iPad13,7': 'iPad Pro 11 3', 'iPad13,8': 'iPad Pro 12.9 5', 'iPad13,9': 'iPad Pro 12.9 5', 'iPad13,10': 'iPad Pro 12.9 5', 'iPad13,11': 'iPad Pro 12.9 5',
      'iPad14,1': 'iPad mini 6', 'iPad14,2': 'iPad mini 6', 'iPad14,3': 'iPad Air 5', 'iPad14,4': 'iPad Air 5', 'iPad14,5': 'iPad 10', 'iPad14,6': 'iPad 10',
      'iPad16,1': 'iPad Pro 11 M4', 'iPad16,2': 'iPad Pro 11 M4', 'iPad16,3': 'iPad Pro 13 M4', 'iPad16,4': 'iPad Pro 13 M4',
      // Samsung Galaxy S / S+ / Ultra
      'SM-G950': 'Galaxy S8', 'SM-G955': 'Galaxy S8+', 'SM-G960': 'Galaxy S9', 'SM-G965': 'Galaxy S9+',
      'SM-G970': 'Galaxy S10e', 'SM-G973': 'Galaxy S10', 'SM-G975': 'Galaxy S10+', 'SM-G977': 'Galaxy S10 5G',
      'SM-G980': 'Galaxy S20', 'SM-G981': 'Galaxy S20 5G', 'SM-G986': 'Galaxy S20+', 'SM-G988': 'Galaxy S20 Ultra',
      'SM-G991': 'Galaxy S21', 'SM-G996': 'Galaxy S21+', 'SM-G998': 'Galaxy S21 Ultra',
      'SM-S901': 'Galaxy S22', 'SM-S906': 'Galaxy S22+', 'SM-S908': 'Galaxy S22 Ultra',
      'SM-S911': 'Galaxy S23', 'SM-S916': 'Galaxy S23+', 'SM-S918': 'Galaxy S23 Ultra',
      'SM-S921': 'Galaxy S24', 'SM-S926': 'Galaxy S24+', 'SM-S928': 'Galaxy S24 Ultra',
      'SM-S931': 'Galaxy S25', 'SM-S936': 'Galaxy S25+', 'SM-S938': 'Galaxy S25 Ultra',
      // Samsung Galaxy Note / Z Fold / Z Flip
      'SM-N950': 'Galaxy Note 8', 'SM-N960': 'Galaxy Note 9', 'SM-N970': 'Galaxy Note 10', 'SM-N975': 'Galaxy Note 10+', 'SM-N980': 'Galaxy Note 20', 'SM-N985': 'Galaxy Note 20 Ultra',
      'SM-F900': 'Galaxy Z Fold', 'SM-F916': 'Galaxy Z Fold 2', 'SM-F918': 'Galaxy Z Fold 3', 'SM-F926': 'Galaxy Z Fold 4', 'SM-F936': 'Galaxy Z Fold 4', 'SM-F946': 'Galaxy Z Fold 5', 'SM-F956': 'Galaxy Z Fold 6',
      'SM-F700': 'Galaxy Z Flip', 'SM-F711': 'Galaxy Z Flip 3', 'SM-F721': 'Galaxy Z Flip 4', 'SM-F731': 'Galaxy Z Flip 5', 'SM-F741': 'Galaxy Z Flip 6',
      // Samsung Galaxy A
      'SM-A015': 'Galaxy A01', 'SM-A025': 'Galaxy A02', 'SM-A035': 'Galaxy A03', 'SM-A045': 'Galaxy A04', 'SM-A055': 'Galaxy A05',
      'SM-A105': 'Galaxy A10', 'SM-A115': 'Galaxy A11', 'SM-A125': 'Galaxy A12', 'SM-A135': 'Galaxy A13', 'SM-A145': 'Galaxy A14', 'SM-A155': 'Galaxy A15',
      'SM-A205': 'Galaxy A20', 'SM-A215': 'Galaxy A21', 'SM-A225': 'Galaxy A22', 'SM-A235': 'Galaxy A23', 'SM-A245': 'Galaxy A24', 'SM-A256': 'Galaxy A25',
      'SM-A305': 'Galaxy A30', 'SM-A315': 'Galaxy A31', 'SM-A325': 'Galaxy A32', 'SM-A336': 'Galaxy A33', 'SM-A346': 'Galaxy A34', 'SM-A356': 'Galaxy A35', 'SM-A366': 'Galaxy A36',
      'SM-A505': 'Galaxy A50', 'SM-A515': 'Galaxy A51', 'SM-A525': 'Galaxy A52', 'SM-A536': 'Galaxy A53', 'SM-A546': 'Galaxy A54', 'SM-A556': 'Galaxy A55',
      'SM-A705': 'Galaxy A70', 'SM-A715': 'Galaxy A71', 'SM-A736': 'Galaxy A73', 'SM-A746': 'Galaxy A74',
      // Samsung Galaxy M
      'SM-M015': 'Galaxy M01', 'SM-M105': 'Galaxy M10', 'SM-M115': 'Galaxy M11', 'SM-M125': 'Galaxy M12', 'SM-M135': 'Galaxy M13', 'SM-M145': 'Galaxy M14',
      'SM-M205': 'Galaxy M20', 'SM-M215': 'Galaxy M21', 'SM-M225': 'Galaxy M22', 'SM-M236': 'Galaxy M23', 'SM-M246': 'Galaxy M24',
      'SM-M305': 'Galaxy M30', 'SM-M315': 'Galaxy M31', 'SM-M325': 'Galaxy M32', 'SM-M336': 'Galaxy M33', 'SM-M346': 'Galaxy M34', 'SM-M356': 'Galaxy M35',
      // Google Pixel（含无空格键，兼容 Client Hints / 部分 UA）
      'Pixel': 'Pixel', 'Pixel2': 'Pixel 2', 'Pixel 2': 'Pixel 2', 'Pixel 2 XL': 'Pixel 2 XL', 'Pixel3': 'Pixel 3', 'Pixel 3': 'Pixel 3', 'Pixel 3 XL': 'Pixel 3 XL', 'Pixel 3a': 'Pixel 3a', 'Pixel 3a XL': 'Pixel 3a XL',
      'Pixel4': 'Pixel 4', 'Pixel 4': 'Pixel 4', 'Pixel 4 XL': 'Pixel 4 XL', 'Pixel 4a': 'Pixel 4a', 'Pixel 4a 5G': 'Pixel 4a 5G', 'Pixel5': 'Pixel 5', 'Pixel 5': 'Pixel 5', 'Pixel 5a': 'Pixel 5a',
      'Pixel6': 'Pixel 6', 'Pixel 6': 'Pixel 6', 'Pixel 6 Pro': 'Pixel 6 Pro', 'Pixel 6a': 'Pixel 6a', 'Pixel7': 'Pixel 7', 'Pixel 7': 'Pixel 7', 'Pixel 7 Pro': 'Pixel 7 Pro', 'Pixel 7a': 'Pixel 7a',
      'Pixel8': 'Pixel 8', 'Pixel 8': 'Pixel 8', 'Pixel 8 Pro': 'Pixel 8 Pro', 'Pixel 8a': 'Pixel 8a', 'Pixel9': 'Pixel 9', 'Pixel 9': 'Pixel 9', 'Pixel 9 Pro': 'Pixel 9 Pro', 'Pixel 9 Pro XL': 'Pixel 9 Pro XL',
      // Huawei
      'ELE': 'Huawei P30', 'VOG': 'Huawei P30 Pro', 'MAR': 'Huawei P40', 'ANA': 'Huawei P40 Pro', 'ELS': 'Huawei P40 Pro+',
      'OCE': 'Huawei Mate 20', 'HMA': 'Huawei Mate 20 Pro', 'LYA': 'Huawei Mate 20 X', 'TAS': 'Huawei Mate 30', 'LIO': 'Huawei Mate 30 Pro', 'EVR': 'Huawei Mate 30 Pro 5G',
      'NOH': 'Huawei Mate 40', 'NOP': 'Huawei Mate 40 Pro', 'ALP': 'Huawei Mate 50', 'BAL': 'Huawei Mate 60', 'BRQ': 'Huawei Mate 60 Pro',
      'NOVA': 'Huawei Nova', 'SEA': 'Huawei Nova 5', 'JEF': 'Huawei Nova 7',
      // Xiaomi
      'M2102': 'Redmi Note 10', 'M2010': 'Redmi 9', '2201116': 'Redmi Note 11', '22101316': 'Redmi Note 12', '2312': 'Redmi Note 13',
      'M2007': 'Mi 10', 'M2012': 'Mi 11', '2201123': 'Mi 12', '2211133': 'Mi 13', '2403': 'Mi 14',
      'POCO': 'POCO', 'M2004': 'POCO X2', '22101320': 'POCO F4',
      // OPPO
      'CPH': 'OPPO', 'PDBM00': 'OPPO Find X', 'PCLM10': 'OPPO Reno', 'PDSM00': 'OPPO Reno4', 'PDRM00': 'OPPO Reno3', 'PEGM00': 'OPPO Reno5', 'PFTM10': 'OPPO Reno6', 'PFJM10': 'OPPO Reno7', 'PGJM10': 'OPPO Reno8', 'PHM110': 'OPPO Reno9', 'PJT110': 'OPPO Reno10', 'PJH110': 'OPPO Reno11',
      'PBBM00': 'OPPO Find X2', 'PFFM20': 'OPPO Find X5', 'PGEM10': 'OPPO Find X6', 'PJF110': 'OPPO Find X7',
      'PCHM30': 'OPPO A series', 'PCHT30': 'OPPO A series', 'CPH2': 'OPPO A', 'CPH24': 'OPPO A',
      // vivo
      'V': 'vivo', 'PD': 'vivo', 'V2025': 'vivo Y20', 'V2034': 'vivo Y30', 'V2046': 'vivo Y52s', 'V2055': 'vivo Y73', 'V2111': 'vivo Y76', 'V2202': 'vivo Y77', 'V2227': 'vivo Y78',
      'V2023': 'vivo X50', 'V2047': 'vivo X60', 'V2118': 'vivo X70', 'V2145': 'vivo X80', 'V2229': 'vivo X90', 'V2302': 'vivo X100',
      'V2031': 'vivo S7', 'V2045': 'vivo S9', 'V2121': 'vivo S12', 'V2162': 'vivo S16', 'V2245': 'vivo S18',
      // OnePlus
      'LE': 'OnePlus', 'LE2110': 'OnePlus 9', 'LE2120': 'OnePlus 9 Pro', 'LE2121': 'OnePlus 9R', 'KB2001': 'OnePlus 8T', 'KB2003': 'OnePlus 8T', 'IN2010': 'OnePlus 8', 'IN2020': 'OnePlus 8 Pro',
      'CPH2449': 'OnePlus 12', 'CPH2581': 'OnePlus 12R', 'CPH2611': 'OnePlus 13', 'PJD110': 'OnePlus Nord', 'DN2101': 'OnePlus Nord 2', 'LE2127': 'OnePlus Nord N10',
      // Realme
      'RMX': 'Realme', 'RMX3031': 'Realme 8', 'RMX3081': 'Realme 8 Pro', 'RMX3231': 'Realme 9', 'RMX3630': 'Realme 10', 'RMX3785': 'Realme 11', 'RMX3841': 'Realme 12',
      'RMX2001': 'Realme X50', 'RMX2202': 'Realme 7', 'RMX3261': 'Realme Narzo', 'RMX3663': 'Realme C', 'RMX3710': 'Realme C55',
      // Honor
      'ANY': 'Honor', 'NTN': 'Honor 90', 'MAG': 'Honor Magic', 'FNE': 'Honor 50', 'GNE': 'Honor 60', 'HLE': 'Honor 70', 'PGT': 'Honor 80', 'ALI': 'Honor Magic4', 'LGE': 'Honor Magic5', 'BVL': 'Honor Magic6',
      // Sony
      'Xperia 1': 'Xperia 1', 'Xperia 5': 'Xperia 5', 'Xperia 10': 'Xperia 10', 'J8110': 'Xperia 1', 'J8210': 'Xperia 1 II', 'XQ-AT51': 'Xperia 1 III', 'XQ-CT54': 'Xperia 1 IV', 'XQ-DQ72': 'Xperia 1 V',
      // Motorola
      'moto': 'Moto', 'XT': 'Moto', 'motorola one': 'Moto One', 'motorola edge': 'Moto Edge', 'motorola razr': 'Moto Razr',
      // 其他常见前缀兜底（需最长前缀匹配的放前面已列）
      'SM-A': 'Galaxy A', 'SM-M': 'Galaxy M', 'SM-N': 'Galaxy Note', 'SM-F': 'Galaxy Z', 'SM-G': 'Galaxy S', 'SM-S': 'Galaxy S'
    }
  },
  // 农历相关
  lunarLib: {
    /*
      * 农历1900-2100的润大小信息表
      * 0x代表十六进制，后面的是十六进制数
      * 例：1980年的数据是：0x095b0
         二进制：0000 1001 0101 1011 0000
         | ------------------------------- |
         |  0000 | 1001 0101 1011 | 0000   |
         | ------------------------------- |
         |  1~4  |      5~16     | 17~20   |
         | ------------------------------- |
         1-4: 表示当年有无闰年，有的话，为闰月的月份，没有的话，为0。
         5-16：为除了闰月外的正常月份是大月还是小月，1为30天，0为29天。
         17-20：表示闰月是大月还是小月，仅当存在闰月的情况下有意义。
         表示1980年没有闰月，从1月到12月的天数依次为：30、29、29、30、29、30、29、30、30、29、30、30。
     */
    lunarMap: [
      0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900-1909
      0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1910-1919
      0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920-1929
      0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930-1939
      0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940-1949
      0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950-1959
      0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960-1969
      0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6, // 1970-1979
      0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1980-1989
      0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, // 1990-1999
      0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000-2009
      0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2010-2019
      0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2020-2029
      0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030-2039
      0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0  // 2040-2049
    ],
    // 阳历每个月的天数普通表
    solarMonthArr: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    // 十二生肖
    AnimalsArr: ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"],
    // 数字转汉字表1
    numberToHanzi_1: ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
    // 数字转汉字表2
    numberToHanzi_2: ['初', '十', '廿', '卅'],
    // 中文月份
    chineseMonth: ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'],
    // 中文年份
    chineseYear: ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'],
    monthPlusOne: '' as string | number, // 保存y年m+1月的相关信息
  }
  }
  return VariableLibrary
}

export type VariableLibrary = ReturnType<typeof createVariableLibrary>
