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
        info: value && value.split(',')
      }).then(infoResult => {
        let infoHtml = []
        for (let i in infoResult) {
          let value = infoResult[i]
          if (i === 'lunarDate') {
            value = `${infoResult[i].year} ${infoResult[i].chineseZodiac} ${infoResult[i].month}${infoResult[i].day}`
          }
          infoHtml.push(
            `<li>
                <span>${i}</span>
                <span style="margin:0 1px;">:</span>
                <span style="color: ${value?.includes?.('失败') ? 'orangered' : '#3d8dbc'}">${value}</span>
             </li>`)
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

const fork = () => {
  window.open('https://github.com/skillnull/DeviceJs')
}

const setTopDistance = () => {
  const title = document.querySelector('.title')
  const title_height = title.getBoundingClientRect().height
  const keyTipBox = document.querySelector('.content')
  keyTipBox.style.paddingTop = title_height + 'px'
}

setTopDistance()

window.addEventListener('resize', () => {
  setTopDistance()
})
