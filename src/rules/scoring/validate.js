export const RatesValid = (rule, value, callback) => {
  // 抵扣比率非必填百分比验证
  const reg = /(?!(^0(\.0)?$))^(\d\d?)(\.\d{1})?$|^(100)(\.\0{1})?$/
  if (!reg.test(Number(value)) && value !== '') {
    callback(new Error('请正确输入抵扣比率'))
  } else {
    callback()
  }
}
export const MaxiRateValidator = (rule, value, callback) => {
  // 一位小数验证
  const reg = /(?!(^0(\.0)?$))^(\d\d?)(\.\d{1})?$|^(100)(\.\0{1})?$/
  // console.log(value);
  const flag = reg.test(value)
  if (value === '') {
    callback(new Error('不能为空！'))
  } else if (!flag) {
    callback(new Error('输入有误！'))
  } else {
    callback()
  }
}
export const MustNumber = (rule, value, callback) => {
  // 非零数字验证
  const reg = /^(?!(0[0-9]|^(0\.[0]+)$))[+]?([1-9][0-9]{0,8})$/g
  // console.log(value);
  const flag = reg.test(value)
  // console.log(value)
  if (value === '') {
    callback(new Error('不能为空！'))
  } else if (!flag) {
    callback(new Error('输入有误！'))
  } else {
    callback()
  }
}
export const MustNumberOteher = (rule, value, callback) => {
  // 非零数字验证
  const reg = /^(?!(0[0-9]|^(0\.[0]+)$))[+]?([1-9][0-9]{0,8})$/g
  // console.log(value);
  const flag = reg.test(value)
  console.log(value, 123123)
  if (value === '') {
    callback()
  } else if (!flag) {
    callback(new Error('输入有误！'))
  } else {
    callback()
  }
}

export const MustNumberOrZero = (rule, value, callback) => {
  // 包含零的数字验证
  const reg = /^([1-9]\d{0,8}|[0]{1,1})$/g
  // console.log(value);
  const flag = reg.test(value)
  if (value === '') {
    callback(new Error('不能为空！'))
  } else if (!flag || value > 5) {
    callback(new Error('输入有误！'))
  } else {
    callback()
  }
}

export const twoNumber = (rule, value, callback) => {
  // 非零数字验证
  // const reg = /^(?!(0[0-9]|^(0\.[0]+)$))[+]?([1-9][0-9]{0,8})$/g;
  const reg = /^([1-9]\d{0,8})(\.\d{0,2})?$|^(0)(\.([1-9]\d?)|(\d[1-9]))$/
  // console.log(value);
  const flag = reg.test(value)
  // console.log(value)
  if (value === '') {
    callback(new Error('不能为空！'))
  } else if (!flag) {
    callback(new Error('输入有误！'))
  } else {
    callback()
  }
}
export const twoNumberOther = (rule, value, callback) => {
  // 非零数字验证
  // const reg = /^(?!(0[0-9]|^(0\.[0]+)$))[+]?([1-9][0-9]{0,8})$/g;
  const reg = /^([1-9]\d{0,8})(\.\d{0,2})?$|^(0)(\.([1-9]\d?)|(\d[1-9]))$/
  const flag = reg.test(value)
  if (value === '' || value === null) {
    callback()
  } else if (!flag) {
    callback(new Error('输入有误！'))
  } else {
    callback()
  }
}

// 人情券卡券投放数量验证
export const voucherGiveAmtValid = (rule, value, callback) => {
  const reg = /^(?!(0[0-9]|^(0\.[0]+)$))[+]?([1-9][0-9]{0,8})$/g
  // console.log(value);
  const flag = reg.test(value)
  // console.log(value)
  if (value === '') {
    callback(new Error('不能为空！'))
  } else if (!flag || parseInt(value) < 3) {
    callback(new Error('输入有误！'))
  } else {
    callback()
  }
}

// 通用券卡券投放数量验证
export const giveAmtValid = (rule, value, callback) => {
  const reg = /^(?!(0[0-9]|^(0\.[0]+)$))[+]?([1-9][0-9]{0,8})$/g
  // console.log(value);
  const flag = reg.test(value)
  // console.log(value)
  if (value === '') {
    callback(new Error('不能为空！'))
  } else if (!flag) {
    callback(new Error('输入有误！'))
  } else {
    callback()
  }
}

// 纸质可售卡券投放数量验证
export const unlineAmtValid = (rule, value, callback) => {
  const reg = /^(?!(0[0-9]|^(0\.[0]+)$))[+]?([1-9][0-9]{0,8})$/g
  // console.log(value);
  const flag = reg.test(value)
  // console.log(value)
  if (value === '') {
    callback(new Error('不能为空！'))
  } else if (!flag || parseInt(value) > 20000) {
    callback(new Error('输入有误！'))
  } else {
    callback()
  }
}
