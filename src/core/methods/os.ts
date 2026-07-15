import type { VariableLibrary } from '../../data/variable-library'

export function createOsMethods (VariableLibrary: VariableLibrary) {
  return {
      // 获取当前操作系统
      getOS: function () {
        let _this = this
        this?.matchInfoMap(_this)
        return _this.os
      },
      // 获取操作系统版本
      getOSVersion: function () {
        let _this = this
        let u = VariableLibrary?.navigator?.userAgent || {}
        _this.osVersion = ''
        // 系统版本信息
        let osVersion = {
          'Windows': function () {
            let v = u?.replace(/^.*Windows NT ([\d.]+);.*$/, '$1')
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
            return u?.replace(/^.*Android ([\d.]+);.*$/, '$1')
          },
          'iOS': function () {
            return u?.replace(/^.*OS ([\d_]+) like.*$/, '$1')?.replace(/_/g, '.')
          },
          'Debian': function () {
            return u?.replace(/^.*Debian\/([\d.]+).*$/, '$1')
          },
          'Windows Phone': function () {
            return u?.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/, '$2')
          },
          'Mac OS': function () {
            return u?.replace(/^.*Mac OS X ([\d_]+).*$/, '$1')?.replace(/_/g, '.')
          },
          'WebOS': function () {
            return u?.replace(/^.*hpwOS\/([\d.]+);.*$/, '$1')
          }
        }
        if (osVersion[_this.os]) {
          _this.osVersion = osVersion?.[_this.os]?.()
          if (_this.osVersion == u) {
            _this.osVersion = ''
          }
        }
        return _this.osVersion
      },
      // 获取操作系统平台
      getPlatform() {
        const platform = VariableLibrary?.navigator?.userAgentData?.platform || VariableLibrary?.navigator?.platform
        return platform
      },
  }
}
