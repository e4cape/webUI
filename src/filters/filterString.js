// 头字母大写;
const filterCapitalize = value => {
  if (!value) {
    return ''
  }
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const filterDecimal = (value, fixed) =>
  value
    .replace(/[^\d.]*/g, '')
    .replace(new RegExp(`([0-9]+.[0-9]{${fixed}})[0-9]*`, 'gim'), '$1')

const numFixed = (value, fixed) => {
  // 四舍五入
  if (!isNaN(Number(value))) {
    return Number(value).toFixed(fixed)
  }
  return value
}

let findKey = (value, objs, compare = (a, b) => a === b) => {
  const key = Object.keys(objs).find(k => compare(objs[k], value))
  return (key || '').toLowerCase()
}

export { filterCapitalize, filterDecimal, numFixed, findKey }
