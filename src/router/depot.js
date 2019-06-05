const basePath = '/depot'

// 成品库存
const goodsInventory = () => import('@/views/depot/goodsInventory/index.vue')

// 成品调拨出库
const goodsAppropOut = () => import('@/views/depot/goodsAppropOut/index.vue')
const goodsAppropOutCheck = () => import('@/views/depot/goodsAppropOut/check.vue')
const goodsAppropOutEdit = () => import('@/views/depot/goodsAppropOut/edit.vue')

// 成品调拨入库
const goodsAppropIn = () => import('@/views/depot/goodsAppropIn/index.vue')
const goodsAppropInCheck = () => import('@/views/depot/goodsAppropIn/appropInCheck.vue')
const goodsAppropInEdit = () => import('@/views/depot/goodsAppropIn/appropInEdit.vue')

// 成品盘点
const goodsTaking = () => import('@/views/depot/goodsTaking/index.vue')
const goodsTakingCheck = () => import('@/views/depot/goodsTaking/takingCheck.vue')
const goodsTakingEdit = () => import('@/views/depot/goodsTaking/takingEdit.vue')

// 成品报损
const goodStockLoss = () => import('@/views/depot/goodStockLoss/index.vue')
const goodStockLossCheck = () => import('@/views/depot/goodStockLoss/check.vue')
const goodStockLossEdit = () => import('@/views/depot/goodStockLoss/edit.vue')

// 成品报溢
const goodStockOver = () => import('@/views/depot/goodStockOver/index.vue')
const goodStockOverCheck = () => import('@/views/depot/goodStockOver/check.vue')
const goodStockOverEdit = () => import('@/views/depot/goodStockOver/edit.vue')

// 柜台管理
const counter = () => import('@/views/depot/counter/index.vue')
const countercCheck = () => import('@/views/depot/counter/counterCheck.vue')
const returnGood = () => import('@/views/depot/counter/return.vue')
const takeGood = () => import('@/views/depot/counter/take.vue')

// 成品出入库记录
const goodsStockRecord = () => import('@/views/depot/goodsStockRecord/index.vue')

// // 电子标签管理
// const goodsTags = () => import('@/views/depot/goodstags/index.vue')
// const goodsTagsUpdateList = () => import('@/views/depot/goodstags/updateList.vue')

// 半成品库存
const semiInventory = () => import('@/views/depot/semiGoodsInventory/index.vue')

// 半成品调拨出库
const semiAppropOut = () => import('@/views/depot/semiGoodsAppropOut/index.vue')
const semiAppropOutCheck = () => import('@/views/depot/semiGoodsAppropOut/check.vue')
const semiAppropOutEdit = () => import('@/views/depot/semiGoodsAppropOut/edit.vue')

// 半成品调拨入库
const semiAppropIn = () => import('@/views/depot/semiGoodsAppropIn/index.vue')
const semiAppropInCheck = () => import('@/views/depot/semiGoodsAppropIn/appropInCheck.vue')

// 半成品盘点
const semiTaking = () => import('@/views/depot/semiGoodsTaking/index.vue')
const semiTakingCheck = () => import('@/views/depot/semiGoodsTaking/takingCheck.vue')
const semiTakingEdit = () => import('@/views/depot/semiGoodsTaking/takingEdit.vue')

// 半成品报损
const semiStockLoss = () => import('@/views/depot/semiGoodsLoss/index.vue')
const semiStockLossCheck = () => import('@/views/depot/semiGoodsLoss/check.vue')
const semiStockLossEdit = () => import('@/views/depot/semiGoodsLoss/edit.vue')

// 半成品报溢
const semiStockOver = () => import('@/views/depot/semiGoodsOver/index.vue')
const semiStockOverCheck = () => import('@/views/depot/semiGoodsOver/check.vue')
const semiStockOverEdit = () => import('@/views/depot/semiGoodsOver/edit.vue')

// 半成品库存
const materialInventory = () => import('@/views/depot/materialInventory/index.vue')

// 原料盘点
const taking = () => import('@/views/depot/taking/index.vue')
const takingCheck = () => import('@/views/depot/taking/check.vue')
const takingEdit = () => import('@/views/depot/taking/edit.vue')

// 原料调拨出库
const materialAppropOut = () => import('@/views/depot/materialAppropOut/index.vue')
const materialAppropOutCheck = () => import('@/views/depot/materialAppropOut/check.vue')
const materialAppropOutEdit = () => import('@/views/depot/materialAppropOut/edit.vue')

// 原料调拨入库
const materialAppropIn = () => import('@/views/depot/materialAppropIn/index.vue')
const materialAppropInCheck = () => import('@/views/depot/materialAppropIn/appropInCheck.vue')

// 原料报损
const stockloss = () => import('@/views/depot/stockloss/index.vue')
const stocklossCheck = () => import('@/views/depot/stockloss/check.vue')
const stocklossEdit = () => import('@/views/depot/stockloss/edit.vue')
// 原料报溢
const stockover = () => import('@/views/depot/stockover/index.vue')
const stockoverCheck = () => import('@/views/depot/stockover/check.vue')
const stockoverEdit = () => import('@/views/depot/stockover/edit.vue')
// 旧货库存
const junkRetrieve = () => import('@/views/depot/junkRetrieve/index')
// 旧货转成品库
const junkChange = () => import('@/views/depot/junkChange/index')
const junkChangeCheck = () => import('@/views/depot/junkChange/check')
const junkChangeEdit = () => import('@/views/depot/junkChange/edit')
const junkChangeAdd = () => import('@/views/depot/junkChange/add')
// 旧货调拨出库
const junkAllotOut = () => import('@/views/depot/junkAllotOut/index')
const junkAllotOutCheck = () => import('@/views/depot/junkAllotOut/check')
const junkAllotOutEdit = () => import('@/views/depot/junkAllotOut/edit')
// 旧货其他出库
const junkOtherOut = () => import('@/views/depot/junkOtherOut/index')
const junkOtherOutCheck = () => import('@/views/depot/junkOtherOut/check')
const junkOtherOutEdit = () => import('@/views/depot/junkOtherOut/edit')
// 旧货调拨入库
const junkAllotInn = () => import('@/views/depot/junkAllotInn/index')
const junkAllotInnCheck = () => import('@/views/depot/junkAllotInn/check')
// 旧货标签打印
const junkPrint = () => import('@/views/depot/junkPrint/index')
const printCheck = () => import('@/views/depot/junkPrint/check')
const printEdit = () => import('@/views/depot/junkPrint/edit')
const printing = () => import('@/views/depot/junkPrint/printing')
// 委外加工发料
const outSSend = () => import('@/views/depot/outSSend/index')
const outSSendCheck = () => import('@/views/depot/outSSend/check')
const outSSendEdit = () => import('@/views/depot/outSSend/edit')
// 委外加工退料入库
const outSReturn = () => import('@/views/depot/outSReturn/index')
const outSReturnCheck = () => import('@/views/depot/outSReturn/check')
const outSReturnEdit = () => import('@/views/depot/outSReturn/edit')
// 成品委外拆卸出库
const outSDismount = () => import('@/views/depot/outSDismount/index')
const outSDismountCheck = () => import('@/views/depot/outSDismount/check')
const outSDismountEdit = () => import('@/views/depot/outSDismount/edit')
// 旧货委外拆卸出库
const oldOutSDismount = () => import('@/views/depot/oldOutSDismount/index')
const oldOutSDismountCheck = () => import('@/views/depot/oldOutSDismount/check')
const oldOutSDismountEdit = () => import('@/views/depot/oldOutSDismount/edit')
// 供应商库存
const supplier = () => import('@/views/depot/supplier/index')
// 委外加工结算
const outSBalance = () => import('@/views/depot/outSBalance/index')
const outSBalanceCheck = () => import('@/views/depot/outSBalance/check')
const outSBalanceEdit = () => import('@/views/depot/outSBalance/edit')
// 委外拆卸结算
const outSDismountBalance = () => import('@/views/depot/outSDismountBalance/index')
const outSDismountBalanceCheck = () => import('@/views/depot/outSDismountBalance/check')
const outSDismountBalanceEdit = () => import('@/views/depot/outSDismountBalance/edit')

export default [
  { // 成品库存
    path: basePath + '/goodsinventory/index',
    component: goodsInventory,
    name: '成品库存'
  },
  { // 成品调拨出库
    path: basePath + '/goodsappropout/index',
    component: goodsAppropOut,
    name: '成品调拨出库'
  },
  {
    path: basePath + '/goodsappropout/check',
    component: goodsAppropOutCheck,
    name: '查看调拨出库单',
    meta: {
      parentPath: basePath + '/goodsappropout/index'
    }
  },
  {
    path: basePath + '/goodsappropout/edit',
    component: goodsAppropOutEdit,
    name: '编辑调拨出库单',
    meta: {
      parentPath: basePath + '/goodsappropout/index'
    }
  },
  { // 成品调拨入库
    path: basePath + '/goodsappropin/index',
    component: goodsAppropIn,
    name: '成品调拨入库'
  },
  {
    path: basePath + '/goodsappropin/check',
    component: goodsAppropInCheck,
    name: '查看调拨入库单',
    meta: {
      parentPath: basePath + '/goodsappropin/index'
    }
  },
  {
    path: basePath + '/goodsappropin/edit',
    component: goodsAppropInEdit,
    name: '货品核对',
    meta: {
      parentPath: basePath + '/goodsappropin/index'
    }
  },
  { // 成品盘点
    path: basePath + '/goodstaking/index',
    component: goodsTaking,
    name: '成品盘点'
  },
  {
    path: basePath + '/goodstaking/check',
    component: goodsTakingCheck,
    name: '查看盘点单',
    meta: {
      parentPath: basePath + '/goodstaking/index'
    }
  },
  {
    path: basePath + '/goodstaking/edit',
    component: goodsTakingEdit,
    name: '编辑成品盘点',
    meta: {
      parentPath: basePath + '/goodstaking/index'
    }
  },
  { // 成品报损
    path: basePath + '/goodstockloss/index',
    component: goodStockLoss,
    name: '成品报损'
  },
  {
    path: basePath + '/goodstockloss/check',
    component: goodStockLossCheck,
    name: '查看报损单',
    meta: {
      parentPath: basePath + '/goodstockloss/index'
    }
  },
  {
    path: basePath + '/goodstockloss/edit',
    component: goodStockLossEdit,
    name: '编辑报损单',
    meta: {
      parentPath: basePath + '/goodstockloss/index'
    }
  },
  { // 成品报溢
    path: basePath + '/goodstockover/index',
    component: goodStockOver,
    name: '成品报溢'
  },
  {
    path: basePath + '/goodstockover/check',
    component: goodStockOverCheck,
    name: '查看报溢单',
    meta: {
      parentPath: basePath + '/goodstockover/index'
    }
  },
  {
    path: basePath + '/goodstockover/edit',
    component: goodStockOverEdit,
    name: '编辑报溢单',
    meta: {
      parentPath: basePath + '/goodstockover/index'
    }
  },
  { // 柜台管理
    path: basePath + '/counter/index',
    component: counter,
    name: '柜台管理'
  },
  {
    path: basePath + '/counter/check',
    component: countercCheck,
    name: '柜台详情',
    meta: {
      parentPath: basePath + '/counter/index'
    }
  },
  { // 成品出入库记录
    path: basePath + '/goodstockrecord/index',
    component: goodsStockRecord,
    name: '成品出入库记录'
  },
  {
    path: basePath + '/counter/return',
    component: returnGood,
    name: '退货',
    meta: {
      parentPath: basePath + '/counter/index'
    }
  },
  {
    path: basePath + '/counter/take',
    component: takeGood,
    name: '领货',
    meta: {
      parentPath: basePath + '/counter/index'
    }
  },
  // { // 电子标签管理
  //   path: basePath + '/goodstags/index',
  //   component: goodsTags,
  //   name: '电子标签管理'
  // },
  // { 
  //   path: basePath + '/goodstags/updatelist',
  //   component: goodsTagsUpdateList,
  //   name: '电子标签更新列表',
  //   meta: {
  //     parentPath: basePath + '/goodstags/updatelist'
  //   }
  // },
  { // 半成品库存
    path: basePath + '/semiinventory/index',
    component: semiInventory,
    name: '半成品库存'
  },
  { // 半成品调拨出库
    path: basePath + '/semiappropout/index',
    component: semiAppropOut,
    name: '半成品调拨出库'
  },
  {
    path: basePath + '/semiappropout/check',
    component: semiAppropOutCheck,
    name: '查看半成品调拨出库单',
    meta: {
      parentPath: basePath + '/semiappropout/index'
    }
  },
  {
    path: basePath + '/semiappropout/edit',
    component: semiAppropOutEdit,
    name: '编辑半成品调拨出库单',
    meta: {
      parentPath: basePath + '/semiappropout/index'
    }
  },
  { // 半成品调拨入库
    path: basePath + '/semiappropin/index',
    component: semiAppropIn,
    name: '半成品调拨入库'
  },
  {
    path: basePath + '/semiappropin/check',
    component: semiAppropInCheck,
    name: '查看半成品调拨入库单',
    meta: {
      parentPath: basePath + '/semiappropin/index'
    }
  },
  { // 半成品盘点
    path: basePath + '/semitaking/index',
    component: semiTaking,
    name: '半成品盘点'
  },
  {
    path: basePath + '/semitaking/check',
    component: semiTakingCheck,
    name: '查看半成品盘点单',
    meta: {
      parentPath: basePath + '/semitaking/index'
    }
  },
  {
    path: basePath + '/semitaking/edit',
    component: semiTakingEdit,
    name: '编辑半成品盘点单',
    meta: {
      parentPath: basePath + '/semitaking/index'
    }
  },
  { // 半成品成品报损
    path: basePath + '/semistockloss/index',
    component: semiStockLoss,
    name: '半成品报损'
  },
  {
    path: basePath + '/semistockloss/check',
    component: semiStockLossCheck,
    name: '查看半成品报损单',
    meta: {
      parentPath: basePath + '/semistockloss/index'
    }
  },
  {
    path: basePath + '/semistockloss/edit',
    component: semiStockLossEdit,
    name: '编辑半成品报损单',
    meta: {
      parentPath: basePath + '/semistockloss/index'
    }
  },
  { // 半成品报溢
    path: basePath + '/semistockover/index',
    component: semiStockOver,
    name: '半成品报溢'
  },
  {
    path: basePath + '/semistockover/check',
    component: semiStockOverCheck,
    name: '查看半成品报溢单',
    meta: {
      parentPath: basePath + '/semistockover/index'
    }
  },
  {
    path: basePath + '/semistockover/edit',
    component: semiStockOverEdit,
    name: '编辑半成品报溢单',
    meta: {
      parentPath: basePath + '/semistockover/index'
    }
  },
  { // 成品库存
    path: basePath + '/materialinventory/index',
    component: materialInventory,
    name: '原料库存'
  },
  { // 原料调拨出库
    path: basePath + '/materialappropout/index',
    component: materialAppropOut,
    name: '原料调拨出库'
  },
  {
    path: basePath + '/materialappropout/check',
    component: materialAppropOutCheck,
    name: '查看原料调拨出库单',
    meta: {
      parentPath: basePath + '/materialappropout/index'
    }
  },
  {
    path: basePath + '/materialappropout/edit',
    component: materialAppropOutEdit,
    name: '编辑原料调拨出库单',
    meta: {
      parentPath: basePath + '/materialappropout/index'
    }
  },
  { // 原料调拨入库
    path: basePath + '/materialappropin/index',
    component: materialAppropIn,
    name: '原料调拨入库'
  },
  {
    path: basePath + '/materialappropin/check',
    component: materialAppropInCheck,
    name: '查看原料调拨入库单',
    meta: {
      parentPath: basePath + '/materialappropin/index'
    }
  },
  {// 原料盘点
    path: basePath + '/taking/index',
    component: taking,
    name: '原料盘点'
  },
  {
    path: basePath + '/taking/check',
    component: takingCheck,
    name: '查看原料盘点单',
    meta: {
      parentPath: basePath + '/taking/index'
    }
  },
  {
    path: basePath + '/taking/edit',
    component: takingEdit,
    name: '编辑原料盘点单',
    meta: {
      parentPath: basePath + '/taking/index'
    }
  },

  {// 原料报损
    path: basePath + '/stockloss/index',
    component: stockloss,
    name: '原料报损'
  },
  {
    path: basePath + '/stockloss/check',
    component: stocklossCheck,
    name: '查看原料报损单',
    meta: {
      parentPath: basePath + '/stockloss/index'
    }
  },
  {
    path: basePath + '/stockloss/edit',
    component: stocklossEdit,
    name: '编辑原料报损单',
    meta: {
      parentPath: basePath + '/stockloss/index'
    }
  },
  {// 原料报溢
    path: basePath + '/stockover/index',
    component: stockover,
    name: '原料报溢'
  },
  {
    path: basePath + '/stockover/check',
    component: stockoverCheck,
    name: '查看原料报溢单',
    meta: {
      parentPath: basePath + '/stockover/index'
    }
  },
  {
    path: basePath + '/stockover/edit',
    component: stockoverEdit,
    name: '编辑原料报溢单',
    meta: {
      parentPath: basePath + '/stockover/index'
    }
  },
  {// 委外加工发料
    path: basePath + '/outSSend/index',
    component: outSSend,
    name: '委外加工发料'
  },
  {
    path: basePath + '/outSSend/check',
    component: outSSendCheck,
    name: '查看委外加工发料单',
    meta: {
      parentPath: basePath + '/outSSend/index'
    }
  },
  {
    path: basePath + '/outSSend/edit',
    component: outSSendEdit,
    name: '编辑委外加工发料单',
    meta: {
      parentPath: basePath + '/outSSend/index'
    }
  },
  {// 委外加工退料入库
    path: basePath + '/outSReturn/index',
    component: outSReturn,
    name: '委外加工退料入库'
  },
  {
    path: basePath + '/outSReturn/check',
    component: outSReturnCheck,
    name: '查看委外加工退料入库单',
    meta: {
      parentPath: basePath + '/outSReturn/index'
    }
  },
  {
    path: basePath + '/outSReturn/edit',
    component: outSReturnEdit,
    name: '编辑委外加工退料入库单',
    meta: {
      parentPath: basePath + '/outSReturn/index'
    }
  },
  {// 成品委外拆卸出库
    path: basePath + '/outSDismount/index',
    component: outSDismount,
    name: '成品委外拆卸出库'
  },
  {
    path: basePath + '/outSDismount/check',
    component: outSDismountCheck,
    name: '查看成品委外拆卸出库',
    meta: {
      parentPath: basePath + '/outSDismount/index'
    }
  },
  {
    path: basePath + '/outSDismount/edit',
    component: outSDismountEdit,
    name: '编辑成品委外拆卸出库',
    meta: {
      parentPath: basePath + '/outSDismount/index'
    }
  },
  {// 旧货委外拆卸出库
    path: basePath + '/oldOutSDismount/index',
    component: oldOutSDismount,
    name: '旧货委外拆卸出库'
  },
  {
    path: basePath + '/oldOutSDismount/check',
    component: oldOutSDismountCheck,
    name: '查看旧货委外拆卸出库',
    meta: {
      parentPath: basePath + '/oldOutSDismount/index'
    }
  },
  {
    path: basePath + '/oldOutSDismount/edit',
    component: oldOutSDismountEdit,
    name: '编辑旧货委外拆卸出库',
    meta: {
      parentPath: basePath + '/oldOutSDismount/index'
    }
  },
  {// 供应商库存
    path: basePath + '/supplier/index',
    component: supplier,
    name: '供应商库存'
  },
  {// 委外加工结算
    path: basePath + '/outSBalance/index',
    component: outSBalance,
    name: '委外加工结算'
  },
  {
    path: basePath + '/outSBalance/edit',
    component: outSBalanceEdit,
    name: '编辑委外加工结算单',
    meta: {
      parentPath: basePath + '/outSBalance/index'
    }
  },
  {
    path: basePath + '/outSBalance/check',
    component: outSBalanceCheck,
    name: '查看委外结算',
    meta: {
      parentPath: basePath + '/outSBalance/index'
    }
  },
  {// 委外拆卸结算
    path: basePath + '/outSDismountBalance/index',
    component: outSDismountBalance,
    name: '委外拆卸结算'
  },
  {
    path: basePath + '/outSDismountBalance/check',
    component: outSDismountBalanceCheck,
    name: '查看委外拆卸结算',
    meta: {
      parentPath: basePath + '/outSDismountBalance/index'
    }
  },
  {
    path: basePath + '/outSDismountBalance/edit',
    component: outSDismountBalanceEdit,
    name: '编辑委外拆卸结算',
    meta: {
      parentPath: basePath + '/outSDismountBalance/index'
    }
  },
  {// 旧货库存
    path: basePath + '/junkRetrieve/index',
    component: junkRetrieve,
    name: '旧货库存'
  },
  {// 旧货转成品库
    path: basePath + '/junkChange/index',
    component: junkChange,
    name: '旧货转成品库'
  },
  {
    path: basePath + '/junkChange/check',
    component: junkChangeCheck,
    name: '查看旧货转成品库',
    meta: {
      parentPath: basePath + '/junkChange/index'
    }
  },
  {
    path: basePath + '/junkChange/edit',
    component: junkChangeEdit,
    name: '编辑旧货转成品库',
    meta: {
      parentPath: basePath + '/junkChange/index'
    }
  },
  {
    path: basePath + '/junkChange/add',
    component: junkChangeAdd,
    name: '修改货品',
    meta: {
      parentPath: basePath + '/junkChange/index'
    }
  },
  {// 旧货标签打印
    path: basePath + '/junkPrint/index',
    component: junkPrint,
    name: '旧货标签打印'
  },
  {
    path: basePath + '/junkPrint/check',
    component: printCheck,
    name: '查看打印单',
    meta: {
      parentPath: basePath + '/junkPrint/index'
    }
  },
  {
    path: basePath + '/junkPrint/edit',
    component: printEdit,
    name: '编辑打印单',
    meta: {
      parentPath: basePath + '/junkPrint/index'
    }
  },
  {
    path: basePath + '/junkPrint/printing',
    component: printing,
    name: '打印',
    meta: {
      parentPath: basePath + '/junkPrint/index'
    }
  },
  {// 旧货调拨出库
    path: basePath + '/junkAllotOut/index',
    component: junkAllotOut,
    name: '旧货调拨出库'
  },
  {
    path: basePath + '/junkAllotOut/check',
    component: junkAllotOutCheck,
    name: '查看旧货调拨出库单',
    meta: {
      parentPath: basePath + '/junkAllotOut/index'
    }
  },
  {
    path: basePath + '/junkAllotOut/edit',
    component: junkAllotOutEdit,
    name: '编辑旧货调拨出库单',
    meta: {
      parentPath: basePath + '/junkAllotOut/index'
    }
  },
  {// 旧货其他出库
    path: basePath + '/junkOtherOut/index',
    component: junkOtherOut,
    name: '旧货其他出库'
  },
  {
    path: basePath + '/junkOtherOut/check',
    component: junkOtherOutCheck,
    name: '查看旧货出库单',
    meta: {
      parentPath: basePath + '/junkOtherOut/index'
    }
  },
  {
    path: basePath + '/junkOtherOut/edit',
    component: junkOtherOutEdit,
    name: '编辑旧货出库单',
    meta: {
      parentPath: basePath + '/junkOtherOut/index'
    }
  },
  {// 旧货调拨入库
    path: basePath + '/junkAllotInn/index',
    component: junkAllotInn,
    name: '旧货调拨入库'
  },
  {
    path: basePath + '/junkAllotInn/check',
    component: junkAllotInnCheck,
    name: '查看旧货调拨入库',
    meta: {
      parentPath: basePath + '/junkAllotInn/index'
    }
  }
]
