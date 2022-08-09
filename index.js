let proxy = new Proxy({}, {
  get: (target, key, receiver) => {
    return Reflect.get(target, key)
  },
  set: (target, key, value, receiver) => {
    value = value.replace(/\s+/g, "") // 去除空格
    var result = Reflect.set(target, key, value, receiver)
    if (result) {
      Device.Info({
        domain: 'http://www.skillnull.com',
        info: value && value.split(',')
      }, (infoResult) => {
        let infoHtml = []
        for (let i in infoResult) {
          infoHtml.push(
            '<li>' +
            '   <span>' + i + '</span>' +
            '   <span style="margin:0 1px;">:</span>' +
            '   <span style="color: red;">' + infoResult[i] + '</span>' +
            '</li>')
        }
        document.querySelector('#info_box').innerHTML = '<ul style="margin: 5px;">' + infoHtml.join('') + '</ul>'
      })
    } else {
      throw new ReferenceError('something error')
    }
    return result
  }
})

const getInfo = () => {
  proxy.value = document.querySelector('#info_input').value
}