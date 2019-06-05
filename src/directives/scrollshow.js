import { setTimeout } from 'timers'

// 设置隐藏函数
var timeout = false
let setRowDisableNone = function(topNum, showRowNum, binding) {
  if (timeout) {
    clearTimeout(timeout)
  }
  timeout = setTimeout(() => {
    binding.value.call(null, topNum, topNum + showRowNum * 2)
  })
}

export default {
  name: 'scrollshow',
  componentUpdated: function(el, binding) {
    setTimeout(() => {
      const selectWrap = el.querySelector('.el-table__body-wrapper') // 主容器
      const selectRow = selectWrap.querySelector('table tr')
      if (!selectRow) {
        return
      }
      const rowHeight = selectRow.clientHeight
      let showRowNum = Math.round(selectWrap.clientHeight / rowHeight)
      selectWrap.animate({ scrollTop: '0px' }) // 修改后滚动条回到顶部
      scrollChange() // 执行一次计算
      selectWrap.addEventListener('scroll', scrollChange)
      function scrollChange() {
        let topNum = Math.round(selectWrap.scrollTop / rowHeight)
        topNum = topNum < 0 ? 0 : topNum
        setRowDisableNone(topNum, showRowNum, binding)
      }
    })
  }
}
