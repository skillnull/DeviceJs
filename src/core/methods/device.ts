import type { VariableLibrary } from '../../data/variable-library'

export function createDeviceMethods (VariableLibrary: VariableLibrary) {
  return {
      // 获取横竖屏状态
      getOrientationStatu: function () {
        let orientationStatus = ''
        let orientation = window?.matchMedia("(orientation: portrait)")
        if (orientation?.matches) {
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
        this?.matchInfoMap(_this)
        return _this.device
      },
      // 模拟器：UA 含 Simulator/Emulator，或「移动端 UA + 桌面 platform」如 Chrome 设备模拟
      getIsEmulator() {
        const u = (VariableLibrary?.navigator?.userAgent || '')
        const p = (VariableLibrary?.navigator?.platform || '')
        if (/Simulator|Emulator|Android SDK|sdk_gphone/i.test(u)) return true
        if (/Mobile|Android|iPhone|iPad|IEMobile/i.test(u) && /MacIntel|Win32|Linux x86_64|x86_64/i.test(p)) return true
        return false
      },
      // 设备型号：Galaxy S8、iPhone 12、Pixel 7 等。优先 Client Hints；Chrome 可能返回通用型号，故 Pixel 以 UA Build 为准
      getDeviceModel() {
        const u = VariableLibrary?.navigator?.userAgent || ''
        const nav = VariableLibrary?.navigator
        const map = VariableLibrary?.infoMap?.deviceModelMap || {}
        function resolveName(raw) {
          if (!raw) return ''
          let r = String(raw).trim()
          if (map[r]) return map[r]
          const pixelMatch = r.match(/\b(Pixel\s*\d[^\s]*)/i)
          if (pixelMatch) {
            const p = pixelMatch[1].trim()
            if (map[p]) return map[p]
            const norm = p.replace(/\s+/g, ' ').replace(/([a-z])([0-9])/i, '$1 $2')
            if (map[norm]) return map[norm]
          }
          if (/^Pixel\d/i.test(r)) {
            const withSpace = r.replace(/([a-z])([0-9])/i, '$1 $2')
            if (map[withSpace]) return map[withSpace]
          }
          const upper = r.toUpperCase()
          if (/^SM-/.test(upper)) {
            const keys = Object.keys(map).filter(k => k.startsWith('SM-') && upper.startsWith(k))
            const best = keys.sort((a, b) => b.length - a.length)[0]
            return best ? map[best] : r
          }
          if (/^IPHONE\d/i.test(r)) return map[r] || r
          if (/^IPAD\d/i.test(r)) return map[r] || r
          if (/^Pixel\s/i.test(r)) return map[r] || r
          if (/^[A-Za-z0-9\-]{4,24}$/.test(r)) {
            const codeKeys = Object.keys(map).filter(k => !/^SM-|^iPhone|^iPad|^Pixel|^Xperia|^motorola/i.test(k) && k.length >= 3 && k.length <= 6)
            const found = codeKeys.filter(k => {
              const idx = upper.indexOf(k.toUpperCase())
              return idx !== -1 && (idx === 0 || upper[idx - 1] === '-')
            }).sort((a, b) => b.length - a.length)[0]
            if (found) return map[found]
          }
          return r
        }
        function fromUA() {
          const iphoneId = u.match(/iPhone(\d+[,\d]*)/i)?.[0]
          if (iphoneId) return resolveName(iphoneId)
          if (/iPhone/i.test(u)) return 'iPhone'
          const ipadId = u.match(/iPad(\d+[,\d]*)/i)?.[0]
          if (ipadId) return resolveName(ipadId)
          if (/iPad/i.test(u)) return 'iPad'
          let segment = ''
          const buildMatch = u.match(/;\s*([^;]+)\s*Build\//i)
          if (buildMatch) segment = buildMatch[1].split(';').pop().trim()
          else if (/\bPixel\s*\d/i.test(u)) {
            const m = u.match(/\b(Pixel\s*\d[^\s);]*)/i)
            if (m) segment = m[1].trim()
          }
          const smMatch = segment && segment.match(/SM-[A-Z0-9]+/i)
          if (smMatch) return resolveName(smMatch[0])
          if (/\bPixel\s*\d/i.test(segment)) {
            const m = segment.match(/\b(Pixel\s*\d[^\s;]*)/i)
            if (m) return resolveName(m[1].trim())
          }
          const noSpaces = segment.replace(/\s+/g, '')
          if (noSpaces) {
            const name = resolveName(noSpaces)
            if (name && name !== noSpaces) return name
            if (/HUAWEI|HONOR/i.test(segment)) return segment.split(/\s+/).find(w => /^[A-Z]/i.test(w)) || 'Huawei'
            if (/Pixel/i.test(segment)) return segment.match(/\bPixel\s*\S*/i)?.[0]?.trim() || 'Pixel'
            if (/MI\s|M2102|Redmi|POCO/i.test(u)) return 'Xiaomi'
            if (/OPPO|PCLM|PDSM|CPH/i.test(u)) return 'OPPO'
            if (/vivo|V2\d|PD/i.test(u)) return 'vivo'
            if (/OnePlus|LE21|KB20/i.test(u)) return 'OnePlus'
            if (/Realme|RMX/i.test(u)) return 'Realme'
            return segment.slice(0, 35)
          }
          if (/Android/i.test(u)) return 'Android'
          return ''
        }
        if (nav?.userAgentData?.getHighEntropyValues) {
          return nav.userAgentData.getHighEntropyValues(['model']).then(h => {
            const hint = (h && h.model) ? String(h.model).trim() : ''
            const fromUAResult = fromUA()
            if (hint) {
              const fromHint = resolveName(hint)
              if (fromHint && /^Pixel\s*\d/i.test(fromUAResult) && /^Pixel/i.test(fromHint)) {
                const uaNum = fromUAResult.match(/Pixel\s*(\d+)/)?.[1]
                const hintNum = fromHint.match(/Pixel\s*(\d+)/)?.[1]
                if (uaNum && (!hintNum || uaNum !== hintNum)) return fromUAResult
              }
              if (fromHint) return fromHint
            }
            return fromUAResult
          }).catch(() => fromUA())
        }
        return Promise.resolve(fromUA())
      }
  }
}
