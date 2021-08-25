<p align="center">
  <a href="http://www.skillnull.com"><img src="http://skillnull.com/others/images/brand/MIT.svg" alt="License MIT"></a>
</p>

> #### JS获取设备信息

 - deviceType: 设备类型
 - OS: 操作系统
 - OSVersion: 操作系统版本
 - screenHeight: 屏幕高
 - screenWidth: 屏幕宽
 - language: 当前使用的语言-国家
 - netWork: 联网类型
 - orientation: 横竖屏
 - browserInfo: 浏览器信息
 - fingerprint: 浏览器指纹
 - userAgent: 包含 appCodeName,appName,appVersion,language,platform 等
 - groPosition: 地理位置
 - date: 系统时间
 - UUID: 通用唯一标识 Universally Unique Identifier

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
 
 > #### 在线地址:[http://skillnull.com/others/GetDeviceInfo/index.html](http://skillnull.com/others/GetDeviceInfo/index.html)

