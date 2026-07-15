import type { VariableLibrary } from '../../data/variable-library'

export function createDateMethods (VariableLibrary: VariableLibrary) {
  return {
      // 获取阳历日期时间
      getDate: function () {
        let date = new Date()
        let year = date?.getFullYear()
        let month = String(date?.getMonth() + 1).padStart(2, '0')
        let day = String(date?.getDate()).padStart(2, '0')
        let hour = String(date?.getHours()).padStart(2, '0')
        let minutes = String(date?.getMinutes()).padStart(2, '0')
        let seconds = String(date?.getSeconds()).padStart(2, '0')
        return `${year}/${month}/${day} ${hour}:${minutes}:${seconds}`
      },
      // 获取当前周几
      getWeek: function () {
        let show_week = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六')
        let time = new Date()
        let day = time?.getDay()
        let now_week = show_week[day]
        return now_week
      },
      /* 阳历转阴历
       * @date: <String> 2023/01/01
       */
      toLunarDate: function (date) {
        let now_date = new Date()
        let date_str = date ? date?.replaceAll('-', '/') : `${now_date?.getFullYear()}/${now_date?.getMonth() + 1}/${now_date?.getDate()}`

        function transferToLunar(str) {
          let lunar

          let solarYear = new Date(str)?.getFullYear()
          let solarMonth = new Date(str)?.getMonth()
          let solarDay = new Date(str)?.getDate()
          let solarDateObj
          let lunarDateObj, lunarYear, lunarMonth, lunarDay = 1
          let lunarLeap // 农历是否闰月
          let lunarLastDay = 0 // 农历当月最后一天
          let firstLunarMonth = '' // 农历第一个月
          let lunarDayPositionArr = new Array(3)
          let n = 0

          // 阳历当月天数
          let solarMonthLength
          if (solarMonth === 1) {
            solarMonthLength = (((solarYear % 4 === 0) && (solarYear % 100 != 0) || (solarYear % 400 === 0)) ? 29 : 28)
          } else {
            solarMonthLength = (VariableLibrary?.lunarLib?.solarMonthArr[solarMonth])
          }

          // 判断year年的农历中那个月是闰月,不是闰月返回0
          function whitchMonthLeap(year) {
            return (VariableLibrary?.lunarLib?.lunarMap?.[year - 1900] & 0xf)
          }

          // 返回农历year年润月天数
          function leapMonthDays(year) {
            if (whitchMonthLeap(year)) {
              return ((VariableLibrary?.lunarLib?.lunarMap?.[year - 1900] & 0x10000) ? 30 : 29)
            } else {
              return (0)
            }
          }

          // 返回农历y年m月的总天数
          function monthDays(y, m) {
            return ((VariableLibrary?.lunarLib?.lunarMap?.[y - 1900] & (0x10000 >> m)) ? 30 : 29)
          }

          // 算出当前月第一天的农历日期和当前农历日期下一个月农历的第一天日期
          function calculateLunarFirstDay(objDate) {
            let j, leap = 0, temp = 0
            let baseDate = new Date(1900, 0, 31)
            let offset = (objDate.getTime() - baseDate.getTime()) / 86400000
            let dayCycle = offset + 40
            let monthCycle = 14

            for (j = 1900; j < 2050 && offset > 0; j++) {
              // 返回农历j年的总天数
              let sum = 348
              for (let k = 0x8000; k > 0x8; k >>= 1) {
                sum += (VariableLibrary?.lunarLib?.lunarMap[j - 1900] & k) ? 1 : 0
              }

              temp = (sum + leapMonthDays(j))
              offset -= temp
              monthCycle += 12
            }

            if (offset < 0) {
              offset += temp
              j--
              monthCycle -= 12
            }

            let year = j
            let yearCycle = j - 1864

            // 判断j年的农历中那个月是闰月,不是闰月返回0
            leap = whitchMonthLeap(j)

            let isLeap = false

            for (j = 1; j < 13 && offset > 0; j++) {
              if (leap > 0 && j === (leap + 1) && isLeap === false) { // 闰月
                --j
                isLeap = true
                temp = leapMonthDays(year)
              } else {
                temp = monthDays(year, j)
              }
              if (isLeap === true && j === (leap + 1)) isLeap = false // 解除闰月
              offset -= temp
              if (isLeap === false) monthCycle++
            }

            if (offset === 0 && leap > 0 && j === leap + 1) {
              if (isLeap) {
                isLeap = false
              } else {
                isLeap = true
                --j
                --monthCycle
              }
            }

            if (offset < 0) {
              offset += temp
              --j
              --monthCycle
            }

            let month = j

            let day = offset + 1

            return {
              year,
              month,
              day,
              isLeap,
              yearCycle,
              monthCycle,
              dayCycle
            }
          }

          for (let i = 0; i < solarMonthLength; i++) {
            if (lunarDay > lunarLastDay) {
              // 阳历当月第一天的日期
              solarDateObj = new Date(solarYear, solarMonth, date ? solarDay : new Date()?.getDate())

              // 农历
              lunarDateObj = calculateLunarFirstDay(solarDateObj)
              lunarYear = lunarDateObj.year; // 农历年
              lunarMonth = lunarDateObj.month; // 农历月
              lunarDay = lunarDateObj.day; // 农历日
              lunarLeap = lunarDateObj.isLeap; // 农历是否闰月
              lunarLastDay = lunarLeap ? leapMonthDays(lunarYear) : monthDays(lunarYear, lunarMonth)

              if (lunarMonth === 12) {
                VariableLibrary.lunarLib.monthPlusOne = lunarLastDay
              }

              if (n === 0) {
                firstLunarMonth = lunarMonth
              } else {
                lunarDayPositionArr[n++] = i - lunarDay + 1
              }
            }
          }


          lunar = {
            lunarYear,
            lunarMonth,
            lunarDay,
            lunarLeap,
            chineseZodiac: VariableLibrary?.lunarLib?.AnimalsArr[(lunarYear - 4) % 12]
          }

          // 用中文显示农历的日期
          function chineseDay(date) {
            date = Math?.floor(date)
            let ChineseDate
            switch (date) {
              case 10:
                ChineseDate = '初十';
                break;
              case 20:
                ChineseDate = '二十';
                break;
              case 30:
                ChineseDate = '三十';
                break;
              default:
                ChineseDate = VariableLibrary.lunarLib.numberToHanzi_2[Math?.floor(date / 10)];
                ChineseDate += VariableLibrary.lunarLib.numberToHanzi_1[date % 10];
            }
            return ChineseDate
          }

          let lunarYearArr = String(lunar.lunarYear)?.split('')
          let chineseYear = `${VariableLibrary?.lunarLib?.chineseYear[lunarYearArr[0]]}${VariableLibrary?.lunarLib?.chineseYear[lunarYearArr[1]]}${VariableLibrary?.lunarLib?.chineseYear[lunarYearArr[2]]}${VariableLibrary?.lunarLib?.chineseYear[lunarYearArr[3]]}`

          return {
            year: `${chineseYear}年`,
            month: `${lunar.isLeap ? '闰' : ''}${VariableLibrary?.lunarLib?.chineseMonth[lunar.lunarMonth - 1]}月`,
            day: `${chineseDay(lunar.lunarDay)}`,
            chineseZodiac: lunar?.chineseZodiac
          }
        }

        return transferToLunar(date_str)
      },
  }
}
