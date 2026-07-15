export function createIdentityMethods () {
  return {
      // 生成UUID通用唯一标识码
      createUUID: function () {
        let result = []
        let hexDigits = "0123456789abcdef"
        for (let i = 0; i < 36; i++) {
          result[i] = hexDigits?.substr(Math?.floor(Math?.random() * 0x10), 1)
        }
        // bits 12-15 of the time_hi_and_version field to 0010
        result[14] = "4"
        // bits 6-7 of the clock_seq_hi_and_reserved to 01
        result[19] = hexDigits?.substr((result[19] & 0x3) | 0x8, 1)
        result[8] = result[13] = result[18] = result[23] = "-"
        return result?.join("")
      },
  }
}
