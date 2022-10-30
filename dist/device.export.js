"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Device = function () {
  var root = typeof self !== 'undefined' ? self : this;

  var _window = root || {}; // 变量库


  var VariableLibrary = {
    navigator: typeof root.navigator != 'undefined' ? root.navigator : {},
    // 信息map
    infoMap: {
      engine: ['WebKit', 'Trident', 'Gecko', 'Presto'],
      browser: ['Safari', 'Chrome', 'Edge', 'IE', 'Firefox', 'Firefox Focus', 'Chromium', 'Opera', 'Vivaldi', 'Yandex', 'Arora', 'Lunascape', 'QupZilla', 'Coc Coc', 'Kindle', 'Iceweasel', 'Konqueror', 'Iceape', 'SeaMonkey', 'Epiphany', '360', '360SE', '360EE', 'UC', 'QQBrowser', 'QQ', 'Baidu', 'Maxthon', 'Sogou', 'LBBROWSER', '2345Explorer', 'TheWorld', 'XiaoMi', 'Quark', 'Qiyu', 'Wechat',, 'WechatWork', 'Taobao', 'Alipay', 'Weibo', 'Douban', 'Suning', 'iQiYi'],
      os: ['Windows', 'Linux', 'Mac OS', 'Android', 'Ubuntu', 'FreeBSD', 'Debian', 'iOS', 'Windows Phone', 'BlackBerry', 'MeeGo', 'Symbian', 'Chrome OS', 'WebOS'],
      device: ['Mobile', 'Tablet', 'iPad']
    }
  }; // 方法库

  var MethodLibrary = function () {
    return {
      /**
       * 创建loading
       */
      createLoading: function createLoading(text, showTimeCount) {
        var count = 1;
        var timeCountStr = '';

        if (showTimeCount) {
          timeCountStr = '<div id="count_box" style="padding: 5px 10px;' + '    border-radius: 50%;' + '    color: white;' + '    background-color: #28a745;' + '    font-size: 16px;' + '    font-weight: 300;' + '    width: 80px;' + '    height: 80px;' + '    display: flex;' + '    justify-content: center;' + '    flex-direction: column;' + '    align-items: center;">' + '   <div>' + count + 's</div>' + '</div>';
        }

        var textStr = '';

        if (text) {
          textStr = '<div style="padding: 5px 10px;border-radius: 3px;color:white;background-color: #28a745;font-size: 16px;font-weight: 300;">' + text + '</div>';
        }

        var loading = document.createElement('div');
        loading.id = 'create_loading';
        loading.style = 'display: block;' + '    position: fixed;' + '    top: 0;' + '    left: 0;' + '    width: 100%;' + '    height: 100%;' + '    z-index: 9999999999;' + '    text-align: center;' + '    font-size: 14px;' + '    display: flex;' + '    flex: 1;' + '    justify-content: center;' + '    flex-direction: column;' + '    align-items: center;' + '    background: rgba(0, 0, 0, 0.09);';
        loading.innerHTML = timeCountStr + '<div class="ball-pulse" style="padding: 15px;">' + '    <div></div>' + '    <div></div>' + '    <div></div>' + '</div>' + textStr;
        document.body.appendChild(loading);

        if (showTimeCount) {
          var countBox = document.getElementById('count_box');
          setInterval(function () {
            count++;

            if (countBox) {
              countBox.innerHTML = '<div>' + count + 's</div>';
            }
          }, 1000);
        }
      },

      /**
       * 删除loading
       */
      removeLoading: function removeLoading() {
        var loading = document.getElementById('create_loading');
        document.body.removeChild(loading);
      },
      // 生成UUID通用唯一标识码
      createUUID: function createUUID() {
        var result = [];
        var hexDigits = "0123456789abcdef";

        for (var i = 0; i < 36; i++) {
          result[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        } // bits 12-15 of the time_hi_and_version field to 0010


        result[14] = "4"; // bits 6-7 of the clock_seq_hi_and_reserved to 01

        result[19] = hexDigits.substr(result[19] & 0x3 | 0x8, 1);
        result[8] = result[13] = result[18] = result[23] = "-";
        return result.join("");
      },
      // 获取阳历日期时间
      getDate: function getDate() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        return "".concat(year, "/").concat(month, "/").concat(day, " ").concat(hour, ":").concat(minutes, ":").concat(seconds);
      },
      // 获取当前周几
      getWeek: function getWeek() {
        var show_week = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
        var time = new Date();
        var day = time.getDay();
        var now_week = show_week[day];
        return now_week;
      },
      // 获取匹配库
      getMatchMap: function getMatchMap(u) {
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
        };
      },
      // 在信息map和匹配库中进行匹配
      matchInfoMap: function matchInfoMap(_this) {
        var u = VariableLibrary.navigator.userAgent || {};
        var match = MethodLibrary.getMatchMap(u);

        for (var s in VariableLibrary.infoMap) {
          for (var i = 0; i < VariableLibrary.infoMap[s].length; i++) {
            var value = VariableLibrary.infoMap[s][i];

            if (match[value]) {
              _this[s] = value;
            }
          }
        }
      },
      // 获取当前操作系统
      getOS: function getOS() {
        var _this = this;

        MethodLibrary.matchInfoMap(_this);
        return _this.os;
      },
      // 获取操作系统版本
      getOSVersion: function getOSVersion() {
        var _this = this;

        var u = VariableLibrary.navigator.userAgent || {};
        _this.osVersion = ''; // 系统版本信息

        var osVersion = {
          'Windows': function Windows() {
            var v = u.replace(/^.*Windows NT ([\d.]+);.*$/, '$1');
            var oldWindowsVersionMap = {
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
              '3.1': 'NT 3.1'
            };
            return oldWindowsVersionMap[v] || v;
          },
          'Android': function Android() {
            return u.replace(/^.*Android ([\d.]+);.*$/, '$1');
          },
          'iOS': function iOS() {
            return u.replace(/^.*OS ([\d_]+) like.*$/, '$1').replace(/_/g, '.');
          },
          'Debian': function Debian() {
            return u.replace(/^.*Debian\/([\d.]+).*$/, '$1');
          },
          'Windows Phone': function WindowsPhone() {
            return u.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/, '$2');
          },
          'Mac OS': function MacOS() {
            return u.replace(/^.*Mac OS X ([\d_]+).*$/, '$1').replace(/_/g, '.');
          },
          'WebOS': function WebOS() {
            return u.replace(/^.*hpwOS\/([\d.]+);.*$/, '$1');
          }
        };

        if (osVersion[_this.os]) {
          _this.osVersion = osVersion[_this.os]();

          if (_this.osVersion == u) {
            _this.osVersion = '';
          }
        }

        return _this.osVersion;
      },
      // 获取横竖屏状态
      getOrientationStatu: function getOrientationStatu() {
        var orientationStatus = '';
        var orientation = window.matchMedia("(orientation: portrait)");

        if (orientation.matches) {
          orientationStatus = "竖屏";
        } else {
          orientationStatus = "横屏";
        }

        return orientationStatus;
      },
      // 获取设备类型
      getDeviceType: function getDeviceType() {
        var _this = this;

        _this.device = 'PC';
        MethodLibrary.matchInfoMap(_this);
        return _this.device;
      },
      // 获取网络状态
      getNetwork: function getNetwork() {
        var netWork = navigator && navigator.connection && navigator.connection.effectiveType;
        return netWork;
      },
      // 获取当前语言
      getLanguage: function getLanguage() {
        var _this = this;

        _this.language = function () {
          var language = VariableLibrary.navigator.browserLanguage || VariableLibrary.navigator.language;
          var arr = language.split('-');

          if (arr[1]) {
            arr[1] = arr[1].toUpperCase();
          }

          return arr.join('_');
        }();

        return _this.language;
      },
      // 生成浏览器指纹
      createFingerprint: function createFingerprint(domain) {
        var fingerprint;

        function bin2hex(s) {
          var i,
              l,
              n,
              o = '';
          s += '';

          for (i = 0, l = s.length; i < l; i++) {
            n = s.charCodeAt(i).toString(16);
            o += n.length < 2 ? '0' + n : n;
          }

          return o;
        }

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var txt = domain || window.location.host;
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = "tencent";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.fillText(txt, 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText(txt, 4, 17);
        var b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
        var bin = atob(b64);
        var crc = bin2hex(bin.slice(-16, -12));
        fingerprint = crc;
        return fingerprint;
      },
      // 浏览器信息
      getBrowserInfo: function getBrowserInfo() {
        var _this = this;

        MethodLibrary.matchInfoMap(_this);
        var u = VariableLibrary.navigator.userAgent || {};

        var _mime = function _mime(option, value) {
          var mimeTypes = VariableLibrary.navigator.mimeTypes;

          for (var key in mimeTypes) {
            if (mimeTypes[key][option] == value) {
              return true;
            }
          }

          return false;
        };

        var match = MethodLibrary.getMatchMap(u);
        var is360 = false;

        if (_window.chrome) {
          var chrome_version = u.replace(/^.*Chrome\/([\d]+).*$/, '$1');

          if (chrome_version > 36 && _window.showModalDialog) {
            is360 = true;
          } else if (chrome_version > 45) {
            is360 = _mime("type", "application/vnd.chromium.remoting-viewer");
          }
        }

        if (match['Baidu'] && match['Opera']) {
          match['Baidu'] = false;
        }

        if (match['Mobile']) {
          match['Mobile'] = !(u.indexOf('iPad') > -1);
        }

        if (is360) {
          if (_mime("type", "application/gameplugin")) {
            match['360SE'] = true;
          } else if (VariableLibrary.navigator && typeof VariableLibrary.navigator['connection']['saveData'] == 'undefined') {
            match['360SE'] = true;
          } else {
            match['360EE'] = true;
          }
        }

        if (match['IE'] || match['Edge']) {
          var navigator_top = window.screenTop - window.screenY;

          switch (navigator_top) {
            case 71:
              // 无收藏栏,贴边
              break;

            case 74:
              // 无收藏栏,非贴边
              break;

            case 99:
              // 有收藏栏,贴边
              break;

            case 102:
              // 有收藏栏,非贴边
              match['360EE'] = true;
              break;

            case 75:
              // 无收藏栏,贴边
              break;

            case 74:
              // 无收藏栏,非贴边
              break;

            case 105:
              // 有收藏栏,贴边
              break;

            case 104:
              // 有收藏栏,非贴边
              match['360SE'] = true;
              break;

            default:
              break;
          }
        }

        var browerVersionMap = {
          'Safari': function Safari() {
            return u.replace(/^.*Version\/([\d.]+).*$/, '$1');
          },
          'Chrome': function Chrome() {
            return u.replace(/^.*Chrome\/([\d.]+).*$/, '$1').replace(/^.*CriOS\/([\d.]+).*$/, '$1');
          },
          'IE': function IE() {
            return u.replace(/^.*MSIE ([\d.]+).*$/, '$1').replace(/^.*rv:([\d.]+).*$/, '$1');
          },
          'Edge': function Edge() {
            return u.replace(/^.*Edge\/([\d.]+).*$/, '$1');
          },
          'Firefox': function Firefox() {
            return u.replace(/^.*Firefox\/([\d.]+).*$/, '$1').replace(/^.*FxiOS\/([\d.]+).*$/, '$1');
          },
          'Firefox Focus': function FirefoxFocus() {
            return u.replace(/^.*Focus\/([\d.]+).*$/, '$1');
          },
          'Chromium': function Chromium() {
            return u.replace(/^.*Chromium\/([\d.]+).*$/, '$1');
          },
          'Opera': function Opera() {
            return u.replace(/^.*Opera\/([\d.]+).*$/, '$1').replace(/^.*OPR\/([\d.]+).*$/, '$1');
          },
          'Vivaldi': function Vivaldi() {
            return u.replace(/^.*Vivaldi\/([\d.]+).*$/, '$1');
          },
          'Yandex': function Yandex() {
            return u.replace(/^.*YaBrowser\/([\d.]+).*$/, '$1');
          },
          'Arora': function Arora() {
            return u.replace(/^.*Arora\/([\d.]+).*$/, '$1');
          },
          'Lunascape': function Lunascape() {
            return u.replace(/^.*Lunascape[\/\s]([\d.]+).*$/, '$1');
          },
          'QupZilla': function QupZilla() {
            return u.replace(/^.*QupZilla[\/\s]([\d.]+).*$/, '$1');
          },
          'Coc Coc': function CocCoc() {
            return u.replace(/^.*coc_coc_browser\/([\d.]+).*$/, '$1');
          },
          'Kindle': function Kindle() {
            return u.replace(/^.*Version\/([\d.]+).*$/, '$1');
          },
          'Iceweasel': function Iceweasel() {
            return u.replace(/^.*Iceweasel\/([\d.]+).*$/, '$1');
          },
          'Konqueror': function Konqueror() {
            return u.replace(/^.*Konqueror\/([\d.]+).*$/, '$1');
          },
          'Iceape': function Iceape() {
            return u.replace(/^.*Iceape\/([\d.]+).*$/, '$1');
          },
          'SeaMonkey': function SeaMonkey() {
            return u.replace(/^.*SeaMonkey\/([\d.]+).*$/, '$1');
          },
          'Epiphany': function Epiphany() {
            return u.replace(/^.*Epiphany\/([\d.]+).*$/, '$1');
          },
          '360': function _() {
            return u.replace(/^.*QihooBrowser\/([\d.]+).*$/, '$1');
          },
          '360SE': function SE() {
            var hash = {
              '63': '10.0',
              '55': '9.1',
              '45': '8.1',
              '42': '8.0',
              '31': '7.0',
              '21': '6.3'
            };
            var chrome_version = u.replace(/^.*Chrome\/([\d]+).*$/, '$1');
            return hash[chrome_version] || '';
          },
          '360EE': function EE() {
            var hash = {
              '69': '11.0',
              '63': '9.5',
              '55': '9.0',
              '50': '8.7',
              '30': '7.5'
            };
            var chrome_version = u.replace(/^.*Chrome\/([\d]+).*$/, '$1');
            return hash[chrome_version] || '';
          },
          'Maxthon': function Maxthon() {
            return u.replace(/^.*Maxthon\/([\d.]+).*$/, '$1');
          },
          'QQBrowser': function QQBrowser() {
            return u.replace(/^.*QQBrowser\/([\d.]+).*$/, '$1');
          },
          'QQ': function QQ() {
            return u.replace(/^.*QQ\/([\d.]+).*$/, '$1');
          },
          'Baidu': function Baidu() {
            return u.replace(/^.*BIDUBrowser[\s\/]([\d.]+).*$/, '$1');
          },
          'UC': function UC() {
            return u.replace(/^.*UC?Browser\/([\d.]+).*$/, '$1');
          },
          'Sogou': function Sogou() {
            return u.replace(/^.*SE ([\d.X]+).*$/, '$1').replace(/^.*SogouMobileBrowser\/([\d.]+).*$/, '$1');
          },
          'Liebao': function Liebao() {
            var version = '';

            if (u.indexOf('LieBaoFast') > -1) {
              version = u.replace(/^.*LieBaoFast\/([\d.]+).*$/, '$1');
            }

            var hash = {
              '57': '6.5',
              '49': '6.0',
              '46': '5.9',
              '42': '5.3',
              '39': '5.2',
              '34': '5.0',
              '29': '4.5',
              '21': '4.0'
            };
            var chrome_version = u.replace(/^.*Chrome\/([\d]+).*$/, '$1');
            return version || hash[chrome_version] || '';
          },
          'LBBROWSER': function LBBROWSER() {
            var version = '';

            if (u.indexOf('LieBaoFast') > -1) {
              version = u.replace(/^.*LieBaoFast\/([\d.]+).*$/, '$1');
            }

            var hash = {
              '57': '6.5',
              '49': '6.0',
              '46': '5.9',
              '42': '5.3',
              '39': '5.2',
              '34': '5.0',
              '29': '4.5',
              '21': '4.0'
            };
            var chrome_version = u.replace(/^.*Chrome\/([\d]+).*$/, '$1');
            return version || hash[chrome_version] || '';
          },
          '2345Explorer': function Explorer() {
            return u.replace(/^.*2345Explorer\/([\d.]+).*$/, '$1');
          },
          '115Browser': function Browser() {
            return u.replace(/^.*115Browser\/([\d.]+).*$/, '$1');
          },
          'TheWorld': function TheWorld() {
            return u.replace(/^.*TheWorld ([\d.]+).*$/, '$1');
          },
          'XiaoMi': function XiaoMi() {
            return u.replace(/^.*MiuiBrowser\/([\d.]+).*$/, '$1');
          },
          'Vivo': function Vivo() {
            return u.replace(/^.*VivoBrowser\/([\d.]+).*$/, '$1');
          },
          'Quark': function Quark() {
            return u.replace(/^.*Quark\/([\d.]+).*$/, '$1');
          },
          'Qiyu': function Qiyu() {
            return u.replace(/^.*Qiyu\/([\d.]+).*$/, '$1');
          },
          'Wechat': function Wechat() {
            return u.replace(/^.*MicroMessenger\/([\d.]+).*$/, '$1');
          },
          'WechatWork': function WechatWork() {
            return u.replace(/^.*wxwork\/([\d.]+).*$/, '$1');
          },
          'Taobao': function Taobao() {
            return u.replace(/^.*AliApp\(TB\/([\d.]+).*$/, '$1');
          },
          'Alipay': function Alipay() {
            return u.replace(/^.*AliApp\(AP\/([\d.]+).*$/, '$1');
          },
          'Weibo': function Weibo() {
            return u.replace(/^.*weibo__([\d.]+).*$/, '$1');
          },
          'Douban': function Douban() {
            return u.replace(/^.*com.douban.frodo\/([\d.]+).*$/, '$1');
          },
          'Suning': function Suning() {
            return u.replace(/^.*SNEBUY-APP([\d.]+).*$/, '$1');
          },
          'iQiYi': function iQiYi() {
            return u.replace(/^.*IqiyiVersion\/([\d.]+).*$/, '$1');
          },
          'DingTalk': function DingTalk() {
            return u.replace(/^.*DingTalk\/([\d.]+).*$/, '$1');
          },
          'Huawei': function Huawei() {
            return u.replace(/^.*Version\/([\d.]+).*$/, '$1').replace(/^.*HuaweiBrowser\/([\d.]+).*$/, '$1').replace(/^.*HBPC\/([\d.]+).*$/, '$1');
          }
        };
        _this.browserVersion = '';

        if (browerVersionMap[_this.browser]) {
          _this.browserVersion = browerVersionMap[_this.browser]();

          if (_this.browserVersion == u) {
            _this.browserVersion = '';
          }
        }

        if (_this.browser == 'Chrome' && u.match(/\S+Browser/)) {
          _this.browser = u.match(/\S+Browser/)[0];
          _this.version = u.replace(/^.*Browser\/([\d.]+).*$/, '$1');
        }

        if (_this.browser == 'Edge') {
          if (_this.version > "75") {
            _this.engine = 'Blink';
          } else {
            _this.engine = 'EdgeHTML';
          }
        }

        if (_this.browser == 'Chrome' && parseInt(_this.browserVersion) > 27) {
          _this.engine = 'Blink';
        } else if (match['Chrome'] && _this.engine == 'WebKit' && parseInt(browerVersionMap['Chrome']()) > 27) {
          _this.engine = 'Blink';
        } else if (_this.browser == 'Opera' && parseInt(_this.version) > 12) {
          _this.engine = 'Blink';
        } else if (_this.browser == 'Yandex') {
          _this.engine = 'Blink';
        }

        return _this.browser + '（版本: ' + _this.browserVersion + '&nbsp;&nbsp;内核: ' + _this.engine + '）';
      },
      // 获取地理位置
      getGeoPostion: function getGeoPostion() {
        return new Promise(function (resolve, reject) {
          navigator && navigator.geolocation && navigator.geolocation.getCurrentPosition( // 位置获取成功
          function (position) {
            resolve(position);
          }, // 位置获取失败
          function (error) {
            resolve({
              coords: {
                longitude: '获取失败',
                latitude: '获取失败'
              }
            });
          });
        });
      }
    };
  }(); // 逻辑层


  var LogicLibrary = function () {
    return {
      DeviceInfoObj: function DeviceInfoObj(params) {
        var info = {
          deviceType: MethodLibrary.getDeviceType(),
          // 设备类型
          OS: MethodLibrary.getOS(),
          // 操作系统
          OSVersion: MethodLibrary.getOSVersion(),
          // 操作系统版本
          screenHeight: _window.screen.height,
          // 屏幕高
          screenWidth: _window.screen.width,
          // 屏幕宽
          language: MethodLibrary.getLanguage(),
          // 当前使用的语言-国家
          netWork: MethodLibrary.getNetwork(),
          // 联网类型
          orientation: MethodLibrary.getOrientationStatu(),
          // 横竖屏
          browserInfo: MethodLibrary.getBrowserInfo(),
          // 浏览器信息
          fingerprint: MethodLibrary.createFingerprint(params && params.domain || ''),
          // 浏览器指纹
          userAgent: VariableLibrary.navigator.userAgent,
          // 包含 appCodeName,appName,appVersion,language,platform 等
          geoPosition: true,
          // 获取地理位置
          date: MethodLibrary.getDate(),
          // 获取阳历日期时间
          week: MethodLibrary.getWeek(),
          // 获取周几
          UUID: MethodLibrary.createUUID() // 生成通用唯一标识

        };
        var resultInfo = {};

        if (!params || !params.info || params.info.length === 0) {
          resultInfo = info;
        } else {
          (function () {
            var infoTemp = {};

            var _loop = function _loop(i) {
              params.info.forEach(function (item) {
                if (item.toLowerCase() === i.toLowerCase()) {
                  item = i;
                  infoTemp[item] = info[item];
                }
              });
            };

            for (var i in info) {
              _loop(i);
            }

            resultInfo = infoTemp;
          })();
        }

        return new Promise(function (resolve) {
          if (resultInfo.geoPosition) {
            MethodLibrary.getGeoPostion().then(function (geoPosition) {
              resultInfo.geoPosition = '经度:' + geoPosition.coords.longitude + '  纬度:' + geoPosition.coords.latitude;
              resolve(resultInfo);
            });
          } else {
            resolve(resultInfo);
          }
        });
      }
    };
  }(); // 对外暴露方法


  return {
    /**
     * @params:{
     *  domain: <String> 生成浏览器指纹所需，不传默认使用window.location.host;
     *  info: <Array> 想要获取的信息，不传默认显示全部信息
     * }
     *
     * @return: 返回 Promise 对象
     */
    Info: function Info(params) {
      MethodLibrary.createLoading();
      return new Promise(function (resolve) {
        LogicLibrary.DeviceInfoObj(params).then(function (res) {
          MethodLibrary.removeLoading();
          resolve(res);
        });
      });
    }
  };
}();

var _default = Device;
exports["default"] = _default;