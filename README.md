<div align="center">
  <img src="http://skillnull.com/others/images/DeviceJs.png" width="300px" alt="DeviceJS">
</div>
<br>
<div align="center" >
  <a href="http://www.skillnull.com"><img src="http://skillnull.com/others/images/brand/MIT.svg" alt="License MIT"></a>
</div>

> #### CDN

```html
使用 UMD 格式
<script src="https://www.unpkg.com/@skillnull/device-js@2.1.3/dist/device.js"></script>
# or
<script src="https://cdn.jsdelivr.net/npm/@skillnull/device-js@2.1.3/dist/device.js"></script>


使用 ES 格式
<script src="https://www.unpkg.com/@skillnull/device-js@2.1.3/dist/device.es.js" type="module"></script>
# or
<script src="https://cdn.jsdelivr.net/npm/@skillnull/device-js@2.1.3/dist/device.es.js" type="module"></script>
```

> #### 安装

```shell
# NPM or YARN

yarn add @skillnull/device-js

# or with npm

npm install @skillnull/device-js
```

> #### 调用

```js
// 使用 CDN 引用时，无需 import 
import Device from '@skillnull/device-js'

/**
 * @params:{
 *  domain: <String> 生成浏览器指纹所需，不传默认使用window.location.host;
 *  transferDateToLunar: <String> 要被转化为农历的日期，需要同时开启info中的lunarDate选项才生效
 *  info: <Array> 想要获取的信息，不传默认开启全部信息显示
 * }
 *
 * @return: 返回 Promise 对象
 */

Device.Info({
  domain: 'your domain',
  transferDateToLunar: '需要转化为农历的日期。例如： 2023/01/01。',
  info: ['lunarDate']
}).then(data => {
  console.log(data)
})

// 或

Device.Info().then(data => {
  console.log(data)
})
```

> #### INFO 配置项
> - deviceType: 设备类型
> - OS: 操作系统
> - OSVersion: 操作系统版本
> - platform: 操作系统平台
> - screenHeight: 屏幕高
> - screenWidth: 屏幕宽
> - language: 当前使用的语言-国家
> - netWork: 联网类型
> - orientation: 横竖屏
> - browserInfo: 浏览器信息
> - fingerprint: 浏览器指纹
> - userAgent: 包含 appCodeName,appName,appVersion,language,platform 等
> - geoPosition: 地理位置
> - date: 阳历日期时间
> - lunarDate: 阴历日期
> - week: 周几
> - UUID: 通用唯一标识 Universally Unique Identifier

> #### 在线地址: [https://skillnull.com/others/DeviceJs/index.html](https://skillnull.com/others/DeviceJs/index.html)

