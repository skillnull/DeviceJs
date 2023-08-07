"use strict";

var proxy = new Proxy({}, {
  get: function get(target, key, receiver) {
    return Reflect.get(target, key);
  },
  set: function set(target, key, value, receiver) {
    value = value.replace(/\s+/g, ""); // 去除空格
    var result = Reflect.set(target, key, value, receiver);
    if (result) {
      Device.Info({
        domain: 'https://www.skillnull.com',
        // transferDateToLunar: '2023/1/30',
        info: value && value.split(',')
      }).then(function (infoResult) {
        var infoHtml = [];
        for (var i in infoResult) {
          var _value = infoResult[i];
          if (i === 'lunarDate') {
            _value = "".concat(infoResult[i].year, " ").concat(infoResult[i].chineseZodiac, " ").concat(infoResult[i].month).concat(infoResult[i].day);
          }
          infoHtml.push('<li>' + '   <span>' + i + '</span>' + '   <span style="margin:0 1px;">:</span>' + '   <span style="color: red;">' + _value + '</span>' + '</li>');
        }
        document.querySelector('#info_box').innerHTML = '<ul style="margin: 5px;">' + infoHtml.join('') + '</ul>';
      });
    } else {
      throw new ReferenceError('something error');
    }
    return result;
  }
});
var getInfo = function getInfo() {
  proxy.value = document.querySelector('#info_input').value;
};