var DeviceInfo = (function () {
    var MethodLibrary = (function () { // 方法库
        return {
            getOS: function () { //获取当前操作系统
                var os;
                if (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1) {
                    os = 'Android';
                } else if (navigator.userAgent.indexOf('iPhone') > -1) {
                    os = 'iOS';
                } else if (navigator.userAgent.indexOf('Windows Phone') > -1) {
                    os = 'WP';
                } else {
                    os = 'Others';
                }
                return os;
            },
            getOSVersion: function () { // 获取操作系统版本
                var OSVision = '1.0';
                var u = navigator.userAgent;
                var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //Android
                var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                if (isAndroid) {
                    OSVision = navigator.userAgent.split(';')[1].match(/\d+\.\d+/g)[0];
                }
                if (isIOS) {
                    OSVision = navigator.userAgent.split(';')[1].match(/(\d+)_(\d+)_?(\d+)?/)[0];
                }
                return OSVision;
            },
            getOrientationStatu: function () { //获取横竖屏状态
                var orientationStatus = ''
                var orientation = window.matchMedia("(orientation: portrait)")
                if (orientation.matches) {
                    orientationStatus = "竖屏"
                } else {
                    orientationStatus = "横屏"
                }
                return orientationStatus
            },
            getDeviceType: function () { //获取设备类型
                var deviceType;
                var sUserAgent = navigator.userAgent.toLowerCase();
                var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
                var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
                var bIsMidp = sUserAgent.match(/midp/i) == "midp";
                var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
                var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
                var bIsAndroid = sUserAgent.match(/android/i) == "android";
                var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
                var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

                if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
                    deviceType = "PC"; //pc
                } else if (bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
                    deviceType = "Phone"; //phone
                } else if (bIsIpad) {
                    deviceType = "ipad"; //ipad
                } else {
                    deviceType = "未知";
                }
                return deviceType;
            },
            getNetwork: function () { // 获取网络状态
                var netWork = navigator && navigator.connection && navigator.connection.effectiveType
                return netWork
            },
            createFingerprint: function (domain) { // 生成浏览器指纹
                var fingerprint
                function bin2hex (s) {
                    var i, l, n, o = ''
                    s += ''
                    for (i = 0, l = s.length; i < l; i++) {
                        n = s.charCodeAt(i)
                            .toString(16)
                        o += n.length < 2 ? '0' + n : n
                    }
                    return o
                }
                var canvas = document.createElement('canvas')
                var ctx = canvas.getContext('2d')
                var txt = domain || window.location.host
                ctx.textBaseline = "top"
                ctx.font = "14px 'Arial'"
                ctx.textBaseline = "tencent"
                ctx.fillStyle = "#f60"
                ctx.fillRect(125, 1, 62, 20)
                ctx.fillStyle = "#069"
                ctx.fillText(txt, 2, 15)
                ctx.fillStyle = "rgba(102, 204, 0, 0.7)"
                ctx.fillText(txt, 4, 17)
                var b64 = canvas.toDataURL().replace("data:image/png;base64,", "")
                var bin = atob(b64)
                var crc = bin2hex(bin.slice(-16, -12))
                fingerprint = crc
                return fingerprint
            }
        }
    })()
    var LogicLibrary = (function () { // 逻辑层
        return {
            DeviceInfoObj: function (params) {
                var info = {
                    deviceType: MethodLibrary.getDeviceType(), // 设备类型
                    OS: MethodLibrary.getOS(), // 操作系统
                    OSVersion: MethodLibrary.getOSVersion(), // 操作系统版本
                    userAgent: navigator.userAgent, // 包含以下属性中所有或一部分的字符串：appCodeName,appName,appVersion,language,platform
                    appVersion: navigator.appVersion, // 浏览器的版本号
                    screenHeight: window.screen.height, // 屏幕高
                    screenWidth: window.screen.width, // 屏幕宽
                    language: navigator.language, // 当前使用的语言-国家
                    netWork: MethodLibrary.getNetwork(), // 联网类型
                    fingerprint: MethodLibrary.createFingerprint(params.domain), // 浏览器指纹
                    orientation: MethodLibrary.getOrientationStatu() // 横竖屏
                }
                if (!params.info || params.info.length == 0) {
                    return info
                } else {
                    var infoTemp = {}
                    for (var i in info) {
                        params.info.forEach(function (item) {
                            if (item.toLowerCase() == i.toLowerCase()) {
                                item = i
                                infoTemp[item] = info[item]
                            }
                        })
                    }
                    return infoTemp
                }
            }
        }
    })()
    return {
        getDeviceInfo: function (params) {
            return LogicLibrary.DeviceInfoObj(params)
        }
    }
})()
