const numReg = /^(?!0(\.0{2})?$)([1-9]\d{0,3}|\d)(\.[0]{2})?$/

export const percentValid = (rule, value, callback) => { // 百分比验证
  const flag = /^(?!(0(\.0{1})?$)|100(\.[1-9])$)([1-9]\d?|\d|100)(\.\d{1})?$/g.test(value)
  if (!flag) {
    callback(new Error('输入有误'))
  } else {
    callback()
  }
}

export const daysValid = (rule, value, callback) => { // 天数验证
  const flag = numReg.test(value)
  if (!flag) {
    callback(new Error('输入有误'))
  } else if (parseInt(value) > 1200) {
    callback(new Error('不能超过 1200 天'))
  } else {
    callback()
  }
}

export const countValid = (rule, value, callback) => { // 卡券张数验证
  const flag = numReg.test(value)
  if (!flag) {
    callback(new Error('输入有误'))
  } else if (parseInt(value) > 5) {
    callback(new Error('不能超过 5 张'))
  } else {
    callback()
  }
}

export const mobileValid = (rule, value, callback) => { // 手机号码
  const pomis = /^1[34578]\d{9}$/
  if (!pomis.test(value) && value) {
    callback(new Error('请输入正确的手机号码'))
  }
  callback()
}
export const pomisValid = (rule, value, callback) => { // 银行卡号
  const pomis = /^(998801|998802|622525|622526|435744|435745|483536|528020|526855|622156|622155|356869|531659|622157|627066|627067|627068|627069)\d{10}$/
  if (!pomis.test(value) && value) {
    callback(new Error('请输入正确的银行卡号'))
  }
  callback()
}
export const qqValid = (rule, value, callback) => { // QQ号码
  const pomis = /[1-9][0-9]{4,}/
  if (!pomis.test(value) && value) {
    callback(new Error('QQ号码'))
  }
  callback()
}

export const integerValid = (rule, value, callback) => {
  if (value && /^[1-9]\d*$/.test(value) && parseInt(value) !== 0) {
    callback()
  } else {
    callback(new Error('请输入正整数'))
  }
  
}

export const twoDecNumValid = (rule, value, callback) => { // 包含两位小数的数字验证
  const flag = /^(?!0(\.0{1,2})?$)(([1-9]\d{0,8})|0)(\.\d{1,2})?$/.test(value)
  if (!flag && value !== '') {
    callback(new Error('输入有误'))
  } else {
    callback()
  }
}

export const threeDecNumValid = (rule, value, callback) => { // 包含三位小数的数字验证
  const flag = /^(?!0(\.0{1,3})?$)(([1-9]\d{0,8})|0)(\.\d{1,3})?$/.test(value)
  if (!flag) {
    callback(new Error('输入有误'))
  } else {
    callback()
  }
}
