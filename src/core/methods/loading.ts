export function createLoadingMethods () {
  return {
      createLoading: function (text?: string, showTimeCount?: boolean) {
        let count = 1
        let timeCountStr = ''
        if (showTimeCount) {
          timeCountStr =
            '<div id="count_box" style="padding: 5px 10px;' +
            '    border-radius: 50%;' +
            '    color: white;' +
            '    background-color: #28a745;' +
            '    font-size: 16px;' +
            '    font-weight: 300;' +
            '    width: 80px;' +
            '    height: 80px;' +
            '    display: flex;' +
            '    justify-content: center;' +
            '    flex-direction: column;' +
            '    align-items: center;">' +
            '   <div>' + count + 's</div>' +
            '</div>'
        }
        let textStr = ''
        if (text) {
          textStr = '<div style="padding: 5px 10px;border-radius: 3px;color:white;background-color: #28a745;font-size: 16px;font-weight: 300;">' +
            text +
            '</div>'
        }

        let loading = document?.createElement('div')
        loading.id = 'create_loading'
        loading.style = 'display: block;' +
          '    position: fixed;' +
          '    top: 0;' +
          '    left: 0;' +
          '    width: 100%;' +
          '    height: 100%;' +
          '    z-index: 9999999999;' +
          '    text-align: center;' +
          '    font-size: 14px;' +
          '    display: flex;' +
          '    flex: 1;' +
          '    justify-content: center;' +
          '    flex-direction: column;' +
          '    align-items: center;' +
          '    background: rgba(0, 0, 0, 0.09);'
        loading.innerHTML =
          timeCountStr +
          '<div class="ball-pulse" style="padding: 15px;">' +
          '    <div></div>' +
          '    <div></div>' +
          '    <div></div>' +
          '</div>' +
          textStr
        document?.body?.appendChild(loading)

        if (showTimeCount) {
          let countBox = document?.getElementById('count_box')
          setInterval(function () {
            count++
            if (countBox) {
              countBox.innerHTML = '<div>' + count + 's</div>'
            }
          }, 1000)
        }
      },
      /**
       * 删除loading
       */
      removeLoading: function () {
        let loading = document?.getElementById('create_loading')
        document?.body?.removeChild(loading)
      },
  }
}
