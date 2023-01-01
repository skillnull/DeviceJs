let proxy = new Proxy({}, {
  get: (target, key, receiver) => {
    return Reflect.get(target, key)
  },
  set: (target, key, value, receiver) => {
    value = value.replace(/\s+/g, "") // 去除空格
    let result = Reflect.set(target, key, value, receiver)
    if (result) {
      Device.Info({
        domain: 'https://www.skillnull.com',
        // transferDateToLunar: '2023/1/3',
        info: value && value.split(',')
      }).then(infoResult => {
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