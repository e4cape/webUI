import dayjs from 'dayjs'
const ignore = ['1900', '9999']
// 所有日期格式化都省略当前年的数据
// 显示的时间格式化; 精确到时分秒
const filterDateTime = (value, formatter = 'YYYY-MM-DD HH:mm:ss') => {
  value = value && value.split('.')[0]
  if (!value || ignore.indexOf(dayjs(value).format('YYYY')) > -1) {
    return '-'
  }
  if (parseInt(dayjs(value).format('YYYY')) === new Date().getFullYear()) {
    return dayjs(value).format(formatter.replace('YYYY-', ''))
  }
  return dayjs(value).format(formatter)
}
// 显示的时间格式化; 精确到时分
const filterDateMinutes = (value, fomatter = 'YYYY-MM-DD HH:mm') => {
  value = value && value.split('.')[0]
  if (!value || ignore.indexOf(dayjs(value).format('YYYY')) > -1) {
    return '-'
  }
  if (parseInt(dayjs(value).format('YYYY')) === new Date().getFullYear()) {
    return dayjs(value).format(fomatter.replace('YYYY-', ''))
  }
  return dayjs(value).format(fomatter)
}
// 显示的时间格式化; 精确到日
const filterDate = (value, fomatter = 'YYYY-MM-DD') => {
  value = value && value.split('.')[0]
  if (!value || ignore.indexOf(dayjs(value).format('YYYY')) > -1) {
    return '-'
  }
  if (parseInt(dayjs(value).format('YYYY')) === new Date().getFullYear()) {
    return dayjs(value).format(fomatter.replace('YYYY-', ''))
  }
  return dayjs(value).format(fomatter)
}
// 显示的时间格式化; 精确到月
const filterMonth = (value, fomatter = 'YYYY-MM') => {
  value = value && value.split('.')[0]
  if (!value || ignore.indexOf(dayjs(value).format('YYYY')) > -1) {
    return '-'
  }
  if (parseInt(dayjs(value).format('YYYY')) === new Date().getFullYear()) {
    return dayjs(value).format(fomatter.replace('YYYY-', ''))
  }
  return dayjs(value).format(fomatter)
}
// 显示的时间格式化; 精确到年
const filterYear = (value, fomatter = 'YYYY') => {
  value = value && value.split('.')[0]
  if (!value || ignore.indexOf(dayjs(value).format('YYYY')) > -1) {
    return '-'
  }
  return dayjs(value).format(fomatter)
}
// 设置初始化的日期。需要加上年份
const filterAllDate =  (value, fomatter = 'YYYY-MM-DD') => {
  return  dayjs(value).format(fomatter)
}

export {
  filterDateTime,
  filterDateMinutes,
  filterDate,
  filterMonth,
  filterYear,
  filterAllDate
}
