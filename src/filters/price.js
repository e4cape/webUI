// 头字母大写;
const initPrice = (value) => {
  return '￥' + parseFloat(value / 10000).toFixed(2)
}

const initWight = (value) => {
  return parseFloat(value / 10000).toFixed(3) + 'g'
}

const conversion = (value) => {
  return parseFloat(value / 10000).toFixed(2) + '%'
}
export {
  initPrice,
  initWight,
  conversion
}