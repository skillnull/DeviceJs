const Device = (function () {
  const root = typeof self !== 'undefined' ? self : this
  const _window = root || {}
  // 变量库
  const VariableLibrary = {
    navigator: typeof root.navigator != 'undefined' ? root.navigator : {},
    // 信息map
    infoMap: {
      engine: ['WebKit', 'Trident', 'Gecko', 'Presto'],
      browser: ['Safari', 'Chrome', 'Edge', 'IE', 'Firefox', 'Firefox Focus', 'Chromium', 'Opera', 'Vivaldi', 'Yandex', 'Arora', 'Lunascape', 'QupZilla', 'Coc Coc', 'Kindle', 'Iceweasel', 'Konqueror', 'Iceape', 'SeaMonkey', 'Epiphany', '360', '360SE', '360EE', 'UC', 'QQBrowser', 'QQ', 'Baidu', 'Maxthon', 'Sogou', 'LBBROWSER', '2345Explorer', 'TheWorld', 'XiaoMi', 'Quark', 'Qiyu', 'Wechat', , 'WechatWork', 'Taobao', 'Alipay', 'Weibo', 'Douban', 'Suning', 'iQiYi'],
      os: ['Windows', 'Linux', 'Mac OS', 'Android', 'Ubuntu', 'FreeBSD', 'Debian', 'iOS', 'Windows Phone', 'BlackBerry', 'MeeGo', 'Symbian', 'Chrome OS', 'WebOS'],
      device: ['Mobile', 'Tablet', 'iPad']
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
      monthPlusOne: '', // 保存y年m+1月的相关信息
    }
  }
  // 方法库
  const MethodLibrary = (function () {
    return {
      /**
       * 创建loading
       */
      createLoading: function (text, showTimeCount) {
        let count = 1
        let timeCountStr = ''
        if (showTimeCount) {
          timeCountStr =
            '<div id="count_box" style="padding: 5px 10px;' +
            '    border-radius: 50%;' +
            '    color: white;' +
            '    background-color: #28a745;' +
            '    font-size: 16px;' +
            '    font-weight: 300;' +
            '    width: 80px;' +
            '    height: 80px;' +
            '    display: flex;' +
            '    justify-content: center;' +
            '    flex-direction: column;' +
            '    align-items: center;">' +
            '   <div>' + count + 's</div>' +
            '</div>'
        }
        let textStr = ''
        if (text) {
          textStr = '<div style="padding: 5px 10px;border-radius: 3px;color:white;background-color: #28a745;font-size: 16px;font-weight: 300;">' +
            text +
            '</div>'
        }

        let loading = document.createElement('div')
        loading.id = 'create_loading'
        loading.style = 'display: block;' +
          '    position: fixed;' +
          '    top: 0;' +
          '    left: 0;' +
          '    width: 100%;' +
          '    height: 100%;' +
          '    z-index: 9999999999;' +
          '    text-align: center;' +
          '    font-size: 14px;' +
          '    display: flex;' +
          '    flex: 1;' +
          '    justify-content: center;' +
          '    flex-direction: column;' +
          '    align-items: center;' +
          '    background: rgba(0, 0, 0, 0.09);'
        loading.innerHTML =
          timeCountStr +
          '<div class="ball-pulse" style="padding: 15px;">' +
          '    <div></div>' +
          '    <div></div>' +
          '    <div></div>' +
          '</div>' +
          textStr
        document.body.appendChild(loading)

        if (showTimeCount) {
          let countBox = document.getElementById('count_box')
          setInterval(function () {
            count++
            if (countBox) {
              countBox.innerHTML = '<div>' + count + 's</div>'
            }
          }, 1000)
        }
      },
      /**
       * 删除loading
       */
      removeLoading: function () {
        let loading = document.getElementById('create_loading')
        document.body.removeChild(loading)
      },
      // 生成UUID通用唯一标识码
      createUUID: function () {
        let result = []
        let hexDigits = "0123456789abcdef"
        for (let i = 0; i < 36; i++) {
          result[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
        }
        // bits 12-15 of the time_hi_and_version field to 0010
        result[14] = "4"
        // bits 6-7 of the clock_seq_hi_and_reserved to 01
        result[19] = hexDigits.substr((result[19] & 0x3) | 0x8, 1)
        result[8] = result[13] = result[18] = result[23] = "-"
        return result.join("")
      },
      // 获取阳历日期时间
      getDate: function () {
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let hour = date.getHours()
        let minutes = date.getMinutes()
        let seconds = date.getSeconds()
        return `${year}/${month}/${day} ${hour}:${minutes}:${seconds}`
      },
      // 获取当前周几
      getWeek: function () {
        let show_week = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六')
        let time = new Date()
        let day = time.getDay()
        let now_week = show_week[day]
        return now_week
      },
      // 获取匹配库
      getMatchMap: function (u) {
        return {
          // 内核
          'Trident': u.indexOf('Trident') > -1 || u.indexOf('NET CLR') > -1,
          'Presto': u.indexOf('Presto') > -1,
          'WebKit': u.indexOf('AppleWebKit') > -1,
          'Gecko': u.indexOf('Gecko/') > -1,
          // 浏览器
          'Safari': u.indexOf('Safari') > -1,
          'Chrome': u.indexOf('Chrome') > -1 || u.indexOf('CriOS') > -1,
          'IE': u.indexOf('MSIE') > -1 || u.indexOf('Trident') > -1,
          'Edge': u.indexOf('Edge') > -1,
          'Firefox': u.indexOf('Firefox') > -1 || u.indexOf('FxiOS') > -1,
          'Firefox Focus': u.indexOf('Focus') > -1,
          'Chromium': u.indexOf('Chromium') > -1,
          'Opera': u.indexOf('Opera') > -1 || u.indexOf('OPR') > -1,
          'Vivaldi': u.indexOf('Vivaldi') > -1,
          'Yandex': u.indexOf('YaBrowser') > -1,
          'Arora': u.indexOf('Arora') > -1,
          'Lunascape': u.indexOf('Lunascape') > -1,
          'QupZilla': u.indexOf('QupZilla') > -1,
          'Coc Coc': u.indexOf('coc_coc_browser') > -1,
          'Kindle': u.indexOf('Kindle') > -1 || u.indexOf('Silk/') > -1,
          'Iceweasel': u.indexOf('Iceweasel') > -1,
          'Konqueror': u.indexOf('Konqueror') > -1,
          'Iceape': u.indexOf('Iceape') > -1,
          'SeaMonkey': u.indexOf('SeaMonkey') > -1,
          'Epiphany': u.indexOf('Epiphany') > -1,
          '360': u.indexOf('QihooBrowser') > -1 || u.indexOf('QHBrowser') > -1,
          '360EE': u.indexOf('360EE') > -1,
          '360SE': u.indexOf('360SE') > -1,
          'UC': u.indexOf('UC') > -1 || u.indexOf(' UBrowser') > -1,
          'QQBrowser': u.indexOf('QQBrowser') > -1,
          'QQ': u.indexOf('QQ/') > -1,
          'Baidu': u.indexOf('Baidu') > -1 || u.indexOf('BIDUBrowser') > -1,
          'Maxthon': u.indexOf('Maxthon') > -1,
          'Sogou': u.indexOf('MetaSr') > -1 || u.indexOf('Sogou') > -1,
          'LBBROWSER': u.indexOf('LBBROWSER') > -1 || u.indexOf('LieBaoFast') > -1,
          '2345Explorer': u.indexOf('2345Explorer') > -1,
          'TheWorld': u.indexOf('TheWorld') > -1,
          'XiaoMi': u.indexOf('MiuiBrowser') > -1,
          'Quark': u.indexOf('Quark') > -1,
          'Qiyu': u.indexOf('Qiyu') > -1,
          'Wechat': u.indexOf('MicroMessenger') > -1,
          'WechatWork': u.indexOf('wxwork/') > -1,
          'Taobao': u.indexOf('AliApp(TB') > -1,
          'Alipay': u.indexOf('AliApp(AP') > -1,
          'Weibo': u.indexOf('Weibo') > -1,
          'Douban': u.indexOf('com.douban.frodo') > -1,
          'Suning': u.indexOf('SNEBUY-APP') > -1,
          'iQiYi': u.indexOf('IqiyiApp') > -1,
          'DingTalk': u.indexOf('DingTalk') > -1,
          'Vivo': u.indexOf('VivoBrowser') > -1,
          'Huawei': u.indexOf('HuaweiBrowser') > -1 || u.indexOf('HUAWEI/') > -1 || u.indexOf('HONOR') > -1 || u.indexOf('HBPC/') > -1,
          // 系统或平台
          'Windows': u.indexOf('Windows') > -1,
          'Linux': u.indexOf('Linux') > -1 || u.indexOf('X11') > -1,
          'Mac OS': u.indexOf('Macintosh') > -1,
          'Android': u.indexOf('Android') > -1 || u.indexOf('Adr') > -1,
          'Ubuntu': u.indexOf('Ubuntu') > -1,
          'FreeBSD': u.indexOf('FreeBSD') > -1,
          'Debian': u.indexOf('Debian') > -1,
          'Windows Phone': u.indexOf('IEMobile') > -1 || u.indexOf('Windows Phone') > -1,
          'BlackBerry': u.indexOf('BlackBerry') > -1 || u.indexOf('RIM') > -1,
          'MeeGo': u.indexOf('MeeGo') > -1,
          'Symbian': u.indexOf('Symbian') > -1,
          'iOS': u.indexOf('like Mac OS X') > -1,
          'Chrome OS': u.indexOf('CrOS') > -1,
          'WebOS': u.indexOf('hpwOS') > -1,
          // 设备
          'Mobile': u.indexOf('Mobi') > -1 || u.indexOf('iPh') > -1 || u.indexOf('480') > -1,
          'Tablet': u.indexOf('Tablet') > -1 || u.indexOf('Nexus 7') > -1,
          'iPad': u.indexOf('iPad') > -1
        }
      },
      // 在信息map和匹配库中进行匹配
      matchInfoMap: function (_this) {
        let u = VariableLibrary.navigator.userAgent || {}
        let match = MethodLibrary.getMatchMap(u)
        for (let s in VariableLibrary.infoMap) {
          for (let i = 0; i < VariableLibrary.infoMap[s].length; i++) {
            let value = VariableLibrary.infoMap[s][i]
            if (match[value]) {
              _this[s] = value
            }
          }
        }
      },
      // 获取当前操作系统
      getOS: function () {
        let _this = this
        MethodLibrary.matchInfoMap(_this)
        return _this.os
      },
      // 获取操作系统版本
      getOSVersion: function () {
        let _this = this
        let u = VariableLibrary.navigator.userAgent || {}
        _this.osVersion = ''
        // 系统版本信息
        let osVersion = {
          'Windows': function () {
            let v = u.replace(/^.*Windows NT ([\d.]+);.*$/, '$1')
            let oldWindowsVersionMap = {
              '10': '10 || 11',
              '6.3': '8.1',
              '6.2': '8',
              '6.1': '7',
              '6.0': 'Vista',
              '5.2': 'XP 64-Bit',
              '5.1': 'XP',
              '5.0': '2000',
              '4.0': 'NT 4.0',
              '3.5.1': 'NT 3.5.1',
              '3.5': 'NT 3.5',
              '3.1': 'NT 3.1',
            }
            return oldWindowsVersionMap[v] || v
          },
          'Android': function () {
            return u.replace(/^.*Android ([\d.]+);.*$/, '$1')
          },
          'iOS': function () {
            return u.replace(/^.*OS ([\d_]+) like.*$/, '$1').replace(/_/g, '.')
          },
          'Debian': function () {
            return u.replace(/^.*Debian\/([\d.]+).*$/, '$1')
          },
          'Windows Phone': function () {
            return u.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/, '$2')
          },
          'Mac OS': function () {
            return u.replace(/^.*Mac OS X ([\d_]+).*$/, '$1').replace(/_/g, '.')
          },
          'WebOS': function () {
            return u.replace(/^.*hpwOS\/([\d.]+);.*$/, '$1')
          }
        }
        if (osVersion[_this.os]) {
          _this.osVersion = osVersion[_this.os]()
          if (_this.osVersion == u) {
            _this.osVersion = ''
          }
        }
        return _this.osVersion
      },
      // 获取横竖屏状态
      getOrientationStatu: function () {
        let orientationStatus = ''
        let orientation = window.matchMedia("(orientation: portrait)")
        if (orientation.matches) {
          orientationStatus = "竖屏"
        } else {
          orientationStatus = "横屏"
        }
        return orientationStatus
      },
      // 获取设备类型
      getDeviceType: function () {
        let _this = this
        _this.device = 'PC'
        MethodLibrary.matchInfoMap(_this)
        return _this.device
      },
      // 获取网络状态
      getNetwork: function () {
        let netWork = navigator && navigator.connection && navigator.connection.effectiveType
        return netWork
      },
      // 获取当前语言
      getLanguage: function () {
        let _this = this
        _this.language = (function () {
          let language = (VariableLibrary.navigator.browserLanguage || VariableLibrary.navigator.language)
          let arr = language.split('-')
          if (arr[1]) {
            arr[1] = arr[1].toUpperCase()
          }
          return arr.join('_')
        })()
        return _this.language
      },
      // 生成浏览器指纹
      createFingerprint: function (domain) {
        let fingerprint

        function bin2hex (s) {
          let i, l, n, o = ''
          s += ''
          for (i = 0, l = s.length; i < l; i++) {
            n = s.charCodeAt(i).toString(16)
            o += n.length < 2 ? '0' + n : n
          }
          return o
        }

        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        let txt = domain || window.location.host
        ctx.textBaseline = "top"
        ctx.font = "14px 'Arial'"
        ctx.textBaseline = "tencent"
        ctx.fillStyle = "#f60"
        ctx.fillRect(125, 1, 62, 20)
        ctx.fillStyle = "#069"
        ctx.fillText(txt, 2, 15)
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)"
        ctx.fillText(txt, 4, 17)
        let b64 = canvas.toDataURL().replace("data:image/png;base64,", "")
        let bin = atob(b64)
        let crc = bin2hex(bin.slice(-16, -12))
        fingerprint = crc
        return fingerprint
      },
      // 浏览器信息
      getBrowserInfo: function () {
        let _this = this
        MethodLibrary.matchInfoMap(_this)

        let u = VariableLibrary.navigator.userAgent || {}

        let _mime = function (option, value) {
          let mimeTypes = VariableLibrary.navigator.mimeTypes
          for (let key in mimeTypes) {
            if (mimeTypes[key][option] == value) {
              return true
            }
          }
          return false
        }

        let match = MethodLibrary.getMatchMap(u)

        let is360 = false

        if (_window.chrome) {
          let chrome_version = u.replace(/^.*Chrome\/([\d]+).*$/, '$1')
          if (chrome_version > 36 && _window.showModalDialog) {
            is360 = true
          } else if (chrome_version > 45) {
            is360 = _mime("type", "application/vnd.chromium.remoting-viewer")
          }
        }

        if (match['Baidu'] && match['Opera']) {
          match['Baidu'] = false
        }

        if (match['Mobile']) {
          match['Mobile'] = !(u.indexOf('iPad') > -1)
        }

        if (is360) {
          if (_mime("type", "application/gameplugin")) {
            match['360SE'] = true
          } else if (VariableLibrary.navigator && typeof VariableLibrary.navigator['connection']['saveData'] == 'undefined') {
            match['360SE'] = true
          } else {
            match['360EE'] = true
          }
        }

        if (match['IE'] || match['Edge']) {
          let navigator_top = window.screenTop - window.screenY
          switch (navigator_top) {
            case 71: // 无收藏栏,贴边
              break
            case 74: // 无收藏栏,非贴边
              break
            case 99: // 有收藏栏,贴边
              break
            case 102: // 有收藏栏,非贴边
              match['360EE'] = true
              break;
            case 75: // 无收藏栏,贴边
              break
            case 74: // 无收藏栏,非贴边
              break
            case 105: // 有收藏栏,贴边
              break
            case 104: // 有收藏栏,非贴边
              match['360SE'] = true
              break
            default:
              break
          }
        }

        let browerVersionMap = {
          'Safari': function () {
            return u.replace(/^.*Version\/([\d.]+).*$/, '$1')
          },
          'Chrome': function () {
            return u.replace(/^.*Chrome\/([\d.]+).*$/, '$1').replace(/^.*CriOS\/([\d.]+).*$/, '$1')
          },
          'IE': function () {
            return u.replace(/^.*MSIE ([\d.]+).*$/, '$1').replace(/^.*rv:([\d.]+).*$/, '$1')
          },
          'Edge': function () {
            return u.replace(/^.*Edge\/([\d.]+).*$/, '$1')
          },
          'Firefox': function () {
            return u.replace(/^.*Firefox\/([\d.]+).*$/, '$1').replace(/^.*FxiOS\/([\d.]+).*$/, '$1')
          },
          'Firefox Focus': function () {
            return u.replace(/^.*Focus\/([\d.]+).*$/, '$1')
          },
          'Chromium': function () {
            return u.replace(/^.*Chromium\/([\d.]+).*$/, '$1')
          },
          'Opera': function () {
            return u.replace(/^.*Opera\/([\d.]+).*$/, '$1').replace(/^.*OPR\/([\d.]+).*$/, '$1')
          },
          'Vivaldi': function () {
            return u.replace(/^.*Vivaldi\/([\d.]+).*$/, '$1')
          },
          'Yandex': function () {
            return u.replace(/^.*YaBrowser\/([\d.]+).*$/, '$1')
          },
          'Arora': function () {
            return u.replace(/^.*Arora\/([\d.]+).*$/, '$1')
          },
          'Lunascape': function () {
            return u.replace(/^.*Lunascape[\/\s]([\d.]+).*$/, '$1')
          },
          'QupZilla': function () {
            return u.replace(/^.*QupZilla[\/\s]([\d.]+).*$/, '$1')
          },
          'Coc Coc': function () {
            return u.replace(/^.*coc_coc_browser\/([\d.]+).*$/, '$1')
          },
          'Kindle': function () {
            return u.replace(/^.*Version\/([\d.]+).*$/, '$1')
          },
          'Iceweasel': function () {
            return u.replace(/^.*Iceweasel\/([\d.]+).*$/, '$1')
          },
          'Konqueror': function () {
            return u.replace(/^.*Konqueror\/([\d.]+).*$/, '$1')
          },
          'Iceape': function () {
            return u.replace(/^.*Iceape\/([\d.]+).*$/, '$1')
          },
          'SeaMonkey': function () {
            return u.replace(/^.*SeaMonkey\/([\d.]+).*$/, '$1')
          },
          'Epiphany': function () {
            return u.replace(/^.*Epiphany\/([\d.]+).*$/, '$1')
          },
          '360': function () {
            return u.replace(/^.*QihooBrowser\/([\d.]+).*$/, '$1')
          },
          '360SE': function () {
            let hash = {'63': '10.0', '55': '9.1', '45': '8.1', '42': '8.0', '31': '7.0', '21': '6.3'}
            let chrome_version = u.replace(/^.*Chrome\/([\d]+).*$/, '$1')
            return hash[chrome_version] || ''
          },
          '360EE': function () {
            let hash = {'69': '11.0', '63': '9.5', '55': '9.0', '50': '8.7', '30': '7.5'};
            let chrome_version = u.replace(/^.*Chrome\/([\d]+).*$/, '$1')
            return hash[chrome_version] || ''
          },
          'Maxthon': function () {
            return u.replace(/^.*Maxthon\/([\d.]+).*$/, '$1')
          },
          'QQBrowser': function () {
            return u.replace(/^.*QQBrowser\/([\d.]+).*$/, '$1')
          },
          'QQ': function () {
            return u.replace(/^.*QQ\/([\d.]+).*$/, '$1')
          },
          'Baidu': function () {
            return u.replace(/^.*BIDUBrowser[\s\/]([\d.]+).*$/, '$1')
          },
          'UC': function () {
            return u.replace(/^.*UC?Browser\/([\d.]+).*$/, '$1')
          },
          'Sogou': function () {
            return u.replace(/^.*SE ([\d.X]+).*$/, '$1').replace(/^.*SogouMobileBrowser\/([\d.]+).*$/, '$1')
          },
          'Liebao': function () {
            let version = ''
            if (u.indexOf('LieBaoFast') > -1) {
              version = u.replace(/^.*LieBaoFast\/([\d.]+).*$/, '$1');
            }
            let hash = {
              '57': '6.5',
              '49': '6.0',
              '46': '5.9',
              '42': '5.3',
              '39': '5.2',
              '34': '5.0',
              '29': '4.5',
              '21': '4.0'
            };
            let chrome_version = u.replace(/^.*Chrome\/([\d]+).*$/, '$1');
            return version || hash[chrome_version] || '';
          },
          'LBBROWSER': function () {
            let version = ''
            if (u.indexOf('LieBaoFast') > -1) {
              version = u.replace(/^.*LieBaoFast\/([\d.]+).*$/, '$1');
            }
            let hash = {
              '57': '6.5',
              '49': '6.0',
              '46': '5.9',
              '42': '5.3',
              '39': '5.2',
              '34': '5.0',
              '29': '4.5',
              '21': '4.0'
            };
            let chrome_version = u.replace(/^.*Chrome\/([\d]+).*$/, '$1');
            return version || hash[chrome_version] || '';
          },
          '2345Explorer': function () {
            return u.replace(/^.*2345Explorer\/([\d.]+).*$/, '$1')
          },
          '115Browser': function () {
            return u.replace(/^.*115Browser\/([\d.]+).*$/, '$1');
          },
          'TheWorld': function () {
            return u.replace(/^.*TheWorld ([\d.]+).*$/, '$1')
          },
          'XiaoMi': function () {
            return u.replace(/^.*MiuiBrowser\/([\d.]+).*$/, '$1')
          },
          'Vivo': function () {
            return u.replace(/^.*VivoBrowser\/([\d.]+).*$/, '$1');
          },
          'Quark': function () {
            return u.replace(/^.*Quark\/([\d.]+).*$/, '$1')
          },
          'Qiyu': function () {
            return u.replace(/^.*Qiyu\/([\d.]+).*$/, '$1')
          },
          'Wechat': function () {
            return u.replace(/^.*MicroMessenger\/([\d.]+).*$/, '$1')
          },
          'WechatWork': function () {
            return u.replace(/^.*wxwork\/([\d.]+).*$/, '$1');
          },
          'Taobao': function () {
            return u.replace(/^.*AliApp\(TB\/([\d.]+).*$/, '$1')
          },
          'Alipay': function () {
            return u.replace(/^.*AliApp\(AP\/([\d.]+).*$/, '$1')
          },
          'Weibo': function () {
            return u.replace(/^.*weibo__([\d.]+).*$/, '$1')
          },
          'Douban': function () {
            return u.replace(/^.*com.douban.frodo\/([\d.]+).*$/, '$1')
          },
          'Suning': function () {
            return u.replace(/^.*SNEBUY-APP([\d.]+).*$/, '$1')
          },
          'iQiYi': function () {
            return u.replace(/^.*IqiyiVersion\/([\d.]+).*$/, '$1')
          },
          'DingTalk': function () {
            return u.replace(/^.*DingTalk\/([\d.]+).*$/, '$1');
          },
          'Huawei': function () {
            return u.replace(/^.*Version\/([\d.]+).*$/, '$1').replace(/^.*HuaweiBrowser\/([\d.]+).*$/, '$1').replace(/^.*HBPC\/([\d.]+).*$/, '$1');
          }
        }

        _this.browserVersion = ''

        if (browerVersionMap[_this.browser]) {
          _this.browserVersion = browerVersionMap[_this.browser]()
          if (_this.browserVersion == u) {
            _this.browserVersion = ''
          }
        }

        if (_this.browser == 'Chrome' && u.match(/\S+Browser/)) {
          _this.browser = u.match(/\S+Browser/)[0];
          _this.version = u.replace(/^.*Browser\/([\d.]+).*$/, '$1');
        }

        if (_this.browser == 'Edge') {
          if (_this.version > "75") {
            _this.engine = 'Blink'
          } else {
            _this.engine = 'EdgeHTML'
          }
        }

        if (_this.browser == 'Chrome' && parseInt(_this.browserVersion) > 27) {
          _this.engine = 'Blink'
        } else if (match['Chrome'] && _this.engine == 'WebKit' && parseInt(browerVersionMap['Chrome']()) > 27) {
          _this.engine = 'Blink';
        } else if (_this.browser == 'Opera' && parseInt(_this.version) > 12) {
          _this.engine = 'Blink';
        } else if (_this.browser == 'Yandex') {
          _this.engine = 'Blink';
        }

        return _this.browser + '（版本: ' + _this.browserVersion + '&nbsp;&nbsp;内核: ' + _this.engine + '）'
      },
      // 获取地理位置
      getGeoPostion: function () {
        return new Promise((resolve, reject) => {
          if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              // 位置获取成功
              function (position) {
                resolve(position)
              },
              // 位置获取失败
              function (error) {
                resolve({
                  coords: {
                    longitude: '获取失败',
                    latitude: '获取失败'
                  }
                })
              },
              {
                // 是否开启高精度模式，开启高精度模式耗时较长
                enableHighAccuracy: false,
                // 超时时间，单位毫秒。默认为infinity
                timeout: 10000
              }
            )
          } else {
            reject('当前浏览器不支持获取地理位置')
          }
        })
      },
      /* 阳历转阴历
       * @date: <String> 2023/01/01
       */
      toLunarDate: function (date) {
        let now_date = new Date()
        let date_str = date ? date.replaceAll('-', '/') : `${now_date.getFullYear()}/${now_date.getMonth() + 1}/${now_date.getDate()}`

        function transferToLunar (str) {
          let lunar

          let solarYear = new Date(str).getFullYear()
          let solarMonth = new Date(str).getMonth()
          let solarDay = new Date(str).getDate()
          let solarDateObj
          let lunarDateObj, lunarYear, lunarMonth, lunarDay = 1
          let lunarLeap // 农历是否闰月
          let lunarLastDay = 0 // 农历当月最后一天
          let firstLunarMonth = '' // 农历第一个月
          let lunarDayPositionArr = new Array(3)
          let n = 0

          // 阳历当月天数
          let solarMonthLength
          if (solarMonth === 1) {
            solarMonthLength = (((solarYear % 4 === 0) && (solarYear % 100 != 0) || (solarYear % 400 === 0)) ? 29 : 28)
          } else {
            solarMonthLength = (VariableLibrary.lunarLib.solarMonthArr[solarMonth])
          }

          // 判断year年的农历中那个月是闰月,不是闰月返回0
          function whitchMonthLeap (year) {
            return (VariableLibrary.lunarLib.lunarMap[year - 1900] & 0xf)
          }

          // 返回农历year年润月天数
          function leapMonthDays (year) {
            if (whitchMonthLeap(year)) {
              return ((VariableLibrary.lunarLib.lunarMap[year - 1900] & 0x10000) ? 30 : 29)
            } else {
              return (0)
            }
          }

          // 返回农历y年m月的总天数
          function monthDays (y, m) {
            return ((VariableLibrary.lunarLib.lunarMap[y - 1900] & (0x10000 >> m)) ? 30 : 29)
          }

          // 算出当前月第一天的农历日期和当前农历日期下一个月农历的第一天日期
          function calculateLunarFirstDay (objDate) {
            let j, leap = 0, temp = 0
            let baseDate = new Date(1900, 0, 31)
            let offset = (objDate - baseDate) / 86400000
            let dayCycle = offset + 40
            let monthCycle = 14

            for (j = 1900; j < 2050 && offset > 0; j++) {
              // 返回农历j年的总天数
              let sum = 348
              for (let k = 0x8000; k > 0x8; k >>= 1) {
                sum += (VariableLibrary.lunarLib.lunarMap[j - 1900] & k) ? 1 : 0
              }

              temp = (sum + leapMonthDays(j))
              offset -= temp
              monthCycle += 12
            }

            if (offset < 0) {
              offset += temp
              j--
              monthCycle -= 12
            }

            let year = j
            let yearCycle = j - 1864

            // 判断j年的农历中那个月是闰月,不是闰月返回0
            leap = whitchMonthLeap(j)

            let isLeap = false

            for (j = 1; j < 13 && offset > 0; j++) {
              if (leap > 0 && j === (leap + 1) && isLeap === false) { // 闰月
                --j
                isLeap = true
                temp = leapMonthDays(year)
              } else {
                temp = monthDays(year, j)
              }
              if (isLeap === true && j === (leap + 1)) isLeap = false // 解除闰月
              offset -= temp
              if (isLeap === false) monthCycle++
            }

            if (offset === 0 && leap > 0 && j === leap + 1) {
              if (isLeap) {
                isLeap = false
              } else {
                isLeap = true
                --j
                --monthCycle
              }
            }

            if (offset < 0) {
              offset += temp
              --j
              --monthCycle
            }

            let month = j

            let day = offset + 1

            return {
              year,
              month,
              day,
              isLeap,
              yearCycle,
              monthCycle,
              dayCycle
            }
          }

          for (let i = 0; i < solarMonthLength; i++) {
            if (lunarDay > lunarLastDay) {
              // 阳历当月第一天的日期
              solarDateObj = new Date(solarYear, solarMonth, date ? solarDay : new Date().getDate())

              // 农历
              lunarDateObj = calculateLunarFirstDay(solarDateObj)
              lunarYear = lunarDateObj.year; // 农历年
              lunarMonth = lunarDateObj.month; // 农历月
              lunarDay = lunarDateObj.day; // 农历日
              lunarLeap = lunarDateObj.isLeap; // 农历是否闰月
              lunarLastDay = lunarLeap ? leapMonthDays(lunarYear) : monthDays(lunarYear, lunarMonth)

              if (lunarMonth === 12) {
                VariableLibrary.lunarLib.monthPlusOne = lunarLastDay
              }

              if (n === 0) {
                firstLunarMonth = lunarMonth
              } else {
                lunarDayPositionArr[n++] = i - lunarDay + 1
              }
            }
          }


          lunar = {
            lunarYear,
            lunarMonth,
            lunarDay,
            lunarLeap,
            chineseZodiac: VariableLibrary.lunarLib.AnimalsArr[(lunarYear - 4) % 12]
          }

          // 用中文显示农历的日期
          function chineseDay (date) {
            date = Math.floor(date)
            let ChineseDate
            switch (date) {
              case 10:
                ChineseDate = '初十';
                break;
              case 20:
                ChineseDate = '二十';
                break;
              case 30:
                ChineseDate = '三十';
                break;
              default:
                ChineseDate = VariableLibrary.lunarLib.numberToHanzi_2[Math.floor(date / 10)];
                ChineseDate += VariableLibrary.lunarLib.numberToHanzi_1[date % 10];
            }
            return ChineseDate
          }
          
          let lunarYearArr = String(lunar.lunarYear).split('')
          let chineseYear = `${VariableLibrary.lunarLib.chineseYear[lunarYearArr[0]]}${VariableLibrary.lunarLib.chineseYear[lunarYearArr[1]]}${VariableLibrary.lunarLib.chineseYear[lunarYearArr[2]]}${VariableLibrary.lunarLib.chineseYear[lunarYearArr[3]]}`

          return {
            year: `${chineseYear}年`,
            month: `${lunar.isLeap ? '闰' : ''}${VariableLibrary.lunarLib.chineseMonth[lunar.lunarMonth - 1]}月`,
            day: `${chineseDay(lunar.lunarDay)}`,
            chineseZodiac: lunar.chineseZodiac
          }
        }

        return transferToLunar(date_str)
      },
      // 获取操作系统平台
      getPlatform(){
        const platform = VariableLibrary.navigator.userAgentData && VariableLibrary.navigator.userAgentData.platform || VariableLibrary.navigator.platform
        return platform
      }
    }
  })()
  // 逻辑层
  const LogicLibrary = (function () {
    return {
      DeviceInfoObj: function (params) {
        let info = {
          deviceType: MethodLibrary.getDeviceType(), // 设备类型
          OS: MethodLibrary.getOS(), // 操作系统
          OSVersion: MethodLibrary.getOSVersion(), // 操作系统版本
          platform: MethodLibrary.getPlatform(), // 获取操作系统平台
          screenHeight: _window.screen.height, // 屏幕高
          screenWidth: _window.screen.width, // 屏幕宽
          language: MethodLibrary.getLanguage(), // 当前使用的语言-国家
          netWork: MethodLibrary.getNetwork(), // 联网类型
          orientation: MethodLibrary.getOrientationStatu(), // 横竖屏
          browserInfo: MethodLibrary.getBrowserInfo(), // 浏览器信息
          fingerprint: MethodLibrary.createFingerprint(params && params.domain || ''), // 浏览器指纹
          userAgent: VariableLibrary.navigator.userAgent, // 包含 appCodeName,appName,appVersion,language 等
          geoPosition: true, // 获取地理位置
          date: MethodLibrary.getDate(), // 获取阳历日期时间
          lunarDate: MethodLibrary.toLunarDate(params && params.transferDateToLunar || ''), // 获取农历日期时间
          week: MethodLibrary.getWeek(), // 获取周几
          UUID: MethodLibrary.createUUID(), // 生成通用唯一标识
        }

        let resultInfo = {}
        if (!params || !params.info || params.info.length === 0) {
          resultInfo = info
        } else {
          let infoTemp = {}
          for (let i in info) {
            params.info.forEach(function (item) {
              if (item.toLowerCase() === i.toLowerCase()) {
                item = i
                infoTemp[item] = info[item]
              }
            })
          }
          resultInfo = infoTemp
        }

        return new Promise(resolve => {
          if (resultInfo.geoPosition) {
            MethodLibrary.getGeoPostion().then(geoPosition => {
              resultInfo.geoPosition = '经度:' + geoPosition.coords.longitude + '  纬度:' + geoPosition.coords.latitude
              resolve(resultInfo)
            }).catch(err => {
              resultInfo.geoPosition = err
              resolve(resultInfo)
            })
          } else {
            resolve(resultInfo)
          }
        })
      }
    }
  })()
  // 对外暴露方法
  return {
    /**
     * @params:{
     *  domain: <String> 生成浏览器指纹所需，不传默认使用window.location.host;
     *  info: <Array> 想要获取的信息，不传默认显示全部信息
     * }
     *
     * @return: 返回 Promise 对象
     */
    Info: function (params) {
      MethodLibrary.createLoading()
      return new Promise(resolve => {
        LogicLibrary.DeviceInfoObj(params).then(res => {
          MethodLibrary.removeLoading()
          resolve(res)
        })
      })
    }
  }
})();
