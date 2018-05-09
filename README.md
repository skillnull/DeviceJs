> #### JS获取设备信息

 - deviceType: 设备类型
 - OS: 操作系统
 - OSVersion: 操作系统版本
 - userAgent: 包含以下属性中所有或一部分的字符串：appCodeName,appName,appVersion,language,platform
 - appVersion: 浏览器的版本号
 - screenHeight: 屏幕高
 - screenWidth: 屏幕宽
 - language: 当前使用的语言-国家
 - netWork: 联网类型
 - fingerprint: 浏览器指纹
 - orientation: 横竖屏

 > #### 调用方式：
 ```
    document.write(JSON.stringify(DeviceInfo.getDeviceInfo(
         {
             domain: 'http://www.skillnull.com',
             info: ['deviceType', 'OS', 'language']
         }
     )))
 ```

 > 注：domain是生成浏览器指纹所需的，不传默认使用window.location.host; info为想要获取的信息，不传默认显示全部信息。
