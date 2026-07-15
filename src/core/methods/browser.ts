import type { VariableLibrary } from '../../data/variable-library'

export function createBrowserMethods (VariableLibrary: VariableLibrary, _window: any) {
  return {
      // 浏览器信息
      getBrowserInfo: function () {
        let _this = this
        this?.matchInfoMap(_this)

        let u = VariableLibrary?.navigator?.userAgent || {}

        let _mime = function (option, value) {
          let mimeTypes = VariableLibrary?.navigator?.mimeTypes
          for (let key in mimeTypes) {
            if (mimeTypes[key][option] == value) {
              return true
            }
          }
          return false
        }

        let match = this?.getMatchMap(u)

        let is360 = false

        if (_window.chrome) {
          let chrome_version = u?.replace(/^.*Chrome\/([\d]+).*$/, '$1')
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
          match['Mobile'] = !(u?.indexOf('iPad') > -1)
        }

        if (is360) {
          if (_mime("type", "application/gameplugin")) {
            match['360SE'] = true
          } else if (VariableLibrary?.navigator && typeof VariableLibrary?.navigator['connection']['saveData'] == 'undefined') {
            match['360SE'] = true
          } else {
            match['360EE'] = true
          }
        }

        if (match['IE'] || match['Edge']) {
          let navigator_top = window?.screenTop - window?.screenY
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
            return u?.replace(/^.*Version\/([\d.]+).*$/, '$1')
          },
          'Chrome': function () {
            return u?.replace(/^.*Chrome\/([\d.]+).*$/, '$1')?.replace(/^.*CriOS\/([\d.]+).*$/, '$1')
          },
          'IE': function () {
            return u?.replace(/^.*MSIE ([\d.]+).*$/, '$1')?.replace(/^.*rv:([\d.]+).*$/, '$1')
          },
          'Edge': function () {
            return u?.replace(/^.*Edg\/([\d.]+).*$/, '$1')?.replace(/^.*Edge\/([\d.]+).*$/, '$1')
          },
          'Firefox': function () {
            return u?.replace(/^.*Firefox\/([\d.]+).*$/, '$1')?.replace(/^.*FxiOS\/([\d.]+).*$/, '$1')
          },
          'Firefox Focus': function () {
            return u?.replace(/^.*Focus\/([\d.]+).*$/, '$1')
          },
          'Chromium': function () {
            return u?.replace(/^.*Chromium\/([\d.]+).*$/, '$1')
          },
          'Opera': function () {
            return u?.replace(/^.*Opera\/([\d.]+).*$/, '$1')?.replace(/^.*OPR\/([\d.]+).*$/, '$1')
          },
          'Vivaldi': function () {
            return u?.replace(/^.*Vivaldi\/([\d.]+).*$/, '$1')
          },
          'Yandex': function () {
            return u?.replace(/^.*YaBrowser\/([\d.]+).*$/, '$1')
          },
          'Arora': function () {
            return u?.replace(/^.*Arora\/([\d.]+).*$/, '$1')
          },
          'Lunascape': function () {
            return u?.replace(/^.*Lunascape[\/\s]([\d.]+).*$/, '$1')
          },
          'QupZilla': function () {
            return u?.replace(/^.*QupZilla[\/\s]([\d.]+).*$/, '$1')
          },
          'Coc Coc': function () {
            return u?.replace(/^.*coc_coc_browser\/([\d.]+).*$/, '$1')
          },
          'Kindle': function () {
            return u?.replace(/^.*Version\/([\d.]+).*$/, '$1')
          },
          'Iceweasel': function () {
            return u?.replace(/^.*Iceweasel\/([\d.]+).*$/, '$1')
          },
          'Konqueror': function () {
            return u?.replace(/^.*Konqueror\/([\d.]+).*$/, '$1')
          },
          'Iceape': function () {
            return u?.replace(/^.*Iceape\/([\d.]+).*$/, '$1')
          },
          'SeaMonkey': function () {
            return u?.replace(/^.*SeaMonkey\/([\d.]+).*$/, '$1')
          },
          'Epiphany': function () {
            return u?.replace(/^.*Epiphany\/([\d.]+).*$/, '$1')
          },
          '360': function () {
            return u?.replace(/^.*QihooBrowser\/([\d.]+).*$/, '$1')
          },
          '360SE': function () {
            let hash = {'63': '10.0', '55': '9.1', '45': '8.1', '42': '8.0', '31': '7.0', '21': '6.3'}
            let chrome_version = u?.replace(/^.*Chrome\/([\d]+).*$/, '$1')
            return hash[chrome_version] || ''
          },
          '360EE': function () {
            let hash = {'69': '11.0', '63': '9.5', '55': '9.0', '50': '8.7', '30': '7.5'};
            let chrome_version = u?.replace(/^.*Chrome\/([\d]+).*$/, '$1')
            return hash[chrome_version] || ''
          },
          'Maxthon': function () {
            return u?.replace(/^.*Maxthon\/([\d.]+).*$/, '$1')
          },
          'QQBrowser': function () {
            return u?.replace(/^.*QQBrowser\/([\d.]+).*$/, '$1')
          },
          'QQ': function () {
            return u?.replace(/^.*QQ\/([\d.]+).*$/, '$1')
          },
          'Baidu': function () {
            return u?.replace(/^.*BIDUBrowser[\s\/]([\d.]+).*$/, '$1')
          },
          'UC': function () {
            return u?.replace(/^.*UC?Browser\/([\d.]+).*$/, '$1')
          },
          'Sogou': function () {
            return u?.replace(/^.*SE ([\d.X]+).*$/, '$1')?.replace(/^.*SogouMobileBrowser\/([\d.]+).*$/, '$1')
          },
          'Liebao': function () {
            let version = ''
            if (u?.indexOf('LieBaoFast') > -1) {
              version = u?.replace(/^.*LieBaoFast\/([\d.]+).*$/, '$1');
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
            let chrome_version = u?.replace(/^.*Chrome\/([\d]+).*$/, '$1');
            return version || hash[chrome_version] || '';
          },
          'LBBROWSER': function () {
            let version = ''
            if (u?.indexOf('LieBaoFast') > -1) {
              version = u?.replace(/^.*LieBaoFast\/([\d.]+).*$/, '$1');
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
            let chrome_version = u?.replace(/^.*Chrome\/([\d]+).*$/, '$1');
            return version || hash[chrome_version] || '';
          },
          '2345Explorer': function () {
            return u?.replace(/^.*2345Explorer\/([\d.]+).*$/, '$1')
          },
          '115Browser': function () {
            return u?.replace(/^.*115Browser\/([\d.]+).*$/, '$1');
          },
          'TheWorld': function () {
            return u?.replace(/^.*TheWorld ([\d.]+).*$/, '$1')
          },
          'XiaoMi': function () {
            return u?.replace(/^.*MiuiBrowser\/([\d.]+).*$/, '$1')
          },
          'Vivo': function () {
            return u?.replace(/^.*VivoBrowser\/([\d.]+).*$/, '$1');
          },
          'Quark': function () {
            return u?.replace(/^.*Quark\/([\d.]+).*$/, '$1')
          },
          'Qiyu': function () {
            return u?.replace(/^.*Qiyu\/([\d.]+).*$/, '$1')
          },
          'Wechat': function () {
            return u?.replace(/^.*MicroMessenger\/([\d.]+).*$/, '$1')
          },
          'WechatWork': function () {
            return u?.replace(/^.*wxwork\/([\d.]+).*$/, '$1');
          },
          'Taobao': function () {
            return u?.replace(/^.*AliApp\(TB\/([\d.]+).*$/, '$1')
          },
          'Alipay': function () {
            return u?.replace(/^.*AliApp\(AP\/([\d.]+).*$/, '$1')
          },
          'Weibo': function () {
            return u?.replace(/^.*weibo__([\d.]+).*$/, '$1')
          },
          'Douban': function () {
            return u?.replace(/^.*com.douban.frodo\/([\d.]+).*$/, '$1')
          },
          'Suning': function () {
            return u?.replace(/^.*SNEBUY-APP([\d.]+).*$/, '$1')
          },
          'iQiYi': function () {
            return u?.replace(/^.*IqiyiVersion\/([\d.]+).*$/, '$1')
          },
          'DingTalk': function () {
            return u?.replace(/^.*DingTalk\/([\d.]+).*$/, '$1');
          },
          'Huawei': function () {
            return u?.replace(/^.*Version\/([\d.]+).*$/, '$1')?.replace(/^.*HuaweiBrowser\/([\d.]+).*$/, '$1')
              ?.replace(/^.*HBPC\/([\d.]+).*$/, '$1');
          }
        }

        _this.browserVersion = ''

        if (browerVersionMap[_this.browser]) {
          _this.browserVersion = browerVersionMap?.[_this.browser]?.()
          if (_this.browserVersion == u) {
            _this.browserVersion = ''
          }
        }

        if (_this.browser == 'Chrome' && u?.match(/\S+Browser/)) {
          _this.browser = u?.match(/\S+Browser/)[0];
          _this.version = u?.replace(/^.*Browser\/([\d.]+).*$/, '$1');
        }

        if (_this.browser == 'Edge') {
          if (parseInt(_this.browserVersion, 10) > 75) {
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
      // 生成浏览器指纹
      createFingerprint: function (domain) {
        let fingerprint

        function bin2hex(s) {
          let i, l, n, o = ''
          s += ''
          for (i = 0, l = s.length; i < l; i++) {
            n = s.charCodeAt(i)?.toString(16)
            o += n.length < 2 ? '0' + n : n
          }
          return o
        }

        let canvas = document?.createElement('canvas')
        let ctx = canvas?.getContext('2d')
        let txt = domain || window?.location?.host
        ctx.textBaseline = "top"
        ctx.font = "14px 'Arial'"
        ctx.textBaseline = "tencent" as CanvasTextBaseline
        ctx.fillStyle = "#f60"
        ctx.fillRect(125, 1, 62, 20)
        ctx.fillStyle = "#069"
        ctx.fillText(txt, 2, 15)
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)"
        ctx.fillText(txt, 4, 17)
        let b64 = canvas?.toDataURL()?.replace("data:image/png;base64,", "")
        let bin = atob(b64)
        let crc = bin2hex(bin?.slice(-16, -12))
        fingerprint = crc
        return fingerprint
      },
  }
}
