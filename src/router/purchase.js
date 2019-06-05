// 款式列表
const styleManagement = () => import('@/views/purchase/styleManagement/index.vue')
const viewStyles = () => import('@/views/purchase/styleManagement/viewStyles.vue')
const styleEdit = () => import('@/views/purchase/styleManagement/styleEdit.vue')
// 款式总库存
const totalInventory = () => import('@/views/purchase/totalInventory/index.vue')
const viewInventory = () => import('@/views/purchase/totalInventory/viewInventory.vue')
const editInventory = () => import('@/views/purchase/totalInventory/editInventory.vue')
// 款式库存
const styleInventory = () => import('@/views/purchase/styleInventory/index.vue')
// 门店款式需求单
const storeStyleDemList = () => import('@/views/purchase/storeStyleDemList/index.vue')
const viewStyleDemList = () => import('@/views/purchase/storeStyleDemList/viewStyleDemList.vue')
const editStyleDemList = () => import('@/views/purchase/storeStyleDemList/editStyleDemList.vue')
// 门店分货单
const storeDividend = () => import('@/views/purchase/storeDividend/index.vue')
const viewStoreStyleDem = () => import('@/views/purchase/storeDividend/viewStoreStyleDem.vue')
const editStoreStyleDem = () => import('@/views/purchase/storeDividend/editStoreStyleDem.vue')
// 款式订货单
const styleOrderForm = () => import('@/views/purchase/orderManagement/index.vue')
const viewStyleOrder = () => import('@/views/purchase/orderManagement/viewStyleOrder.vue')
const editStyleOrder = () => import('@/views/purchase/orderManagement/editStyleOrder.vue')
// 原料订货单
const rawMaterialOrder = () => import('@/views/purchase/rawMaterialOrder/index.vue')
const viewMaterialOrder = () => import('@/views/purchase/rawMaterialOrder/viewMaterialOrder.vue')
const editMaterialOrder = () => import('@/views/purchase/rawMaterialOrder/editMaterialOrder.vue')
// 配货建议
const distributionAdvice = () => import('@/views/purchase/distributionAdvice/index.vue')
// 配货计划
const distributionPlan = () => import('@/views/purchase/distributionPlan/index.vue')
const viewDistributionPlan = () => import('@/views/purchase/distributionPlan/viewDistributionPlan.vue')
const editDistributionPlan = () => import('@/views/purchase/distributionPlan/editDistributionPlan.vue')
// 批量打印标签
const batchLabel = () => import('@/views/purchase/batchLabel/index.vue')
const batchLabelCheck = () => import('@/views/purchase/batchLabel/batchLabelCheck.vue')
const batchLabelEdit = () => import('@/views/purchase/batchLabel/batchLabelEdit.vue')
const printing = () => import('@/views/purchase/batchLabel/printing.vue')
// 成品到货单
const finishedProductList = () => import('@/views/purchase/finishedProduct/index.vue')
const viewFinishedProductOrder = () => import('@/views/purchase/finishedProduct/viewFinishedProductOrder.vue')
const editFinishedProductOrder = () => import('@/views/purchase/finishedProduct/editFinishedProductOrder.vue')
const arrivalGoodAdd = () => import('@/views/purchase/finishedProduct/arrivalGoodAdd.vue')
const arrivalGoodEdit = () => import('@/views/purchase/finishedProduct/arrivalGoodEdit.vue')
// 成品进货入库
const productStorage = () => import('@/views/purchase/productStorage/index.vue')
const viewProductStorage = () => import('@/views/purchase/productStorage/viewProductStorage.vue')
const editProductStorage = () => import('@/views/purchase/productStorage/editProductStorage.vue')
const purchaseGoodAdd = () => import('@/views/purchase/productStorage/purchaseGoodAdd.vue')
// 成品退货出库
const finishedProductReturn = () => import('@/views/purchase/finishedProductReturn/index.vue')
const viewFinishedProductReturn = () => import('@/views/purchase/finishedProductReturn/viewFinishedProductReturn.vue')
const editFinishedProductReturn = () => import('@/views/purchase/finishedProductReturn/editFinishedProductReturn.vue')
// 批量修改货品
const batchEditGoods = () => import('@/views/purchase/batchEditGoods/index.vue')
const modifyCheck = () => import('@/views/purchase/batchEditGoods/modifyCheck.vue')
const modifyEdit = () => import('@/views/purchase/batchEditGoods/modifyEdit.vue')
// 半成品资料管理
const semiDataManage = () => import('@/views/purchase/semiDataManage/index.vue')
// 半成品整包入库
const semiPackageArrival = () => import('@/views/purchase/semiPackageArrival/index.vue')
const semiArrivalCheck = () => import('@/views/purchase/semiPackageArrival/semiArrivalCheck.vue')
const semiArrivalEdit = () => import('@/views/purchase/semiPackageArrival/semiArrivalEdit.vue')
// 半成品分秤
const pointsBalance = () => import('@/views/purchase/pointsBalance/index.vue')
const pointsBalanceCheck = () => import('@/views/purchase/pointsBalance/pointsBalanceCheck.vue')
const pointsBalanceEdit = () => import('@/views/purchase/pointsBalance/pointsBalanceEdit.vue')
// 半成品退货出库
const semiReturnOutbound = () => import('@/views/purchase/semiReturnOutbound/index.vue')
const returnOutboundCheck = () => import('@/views/purchase/semiReturnOutbound/returnOutboundCheck.vue')
const returnOutboundEdit = () => import('@/views/purchase/semiReturnOutbound/returnOutboundEdit.vue')
// 原料进货入库
const stockInventory = () => import('@/views/purchase/stockInventory/index.vue')
const stockInventoryCheck = () => import('@/views/purchase/stockInventory/stockInventoryCheck.vue')
const stockInventoryEdit = () => import('@/views/purchase/stockInventory/stockInventoryEdit.vue')
// 原料退货出库
const stockRemoval = () => import('@/views/purchase/stockRemoval/index.vue')
const stockRemovalCheck = () => import('@/views/purchase/stockRemoval/stockRemovalCheck.vue')
const stockRemovalEdit = () => import('@/views/purchase/stockRemoval/stockRemovalEdit.vue')
// 成品质检
const inspectionProduct = () => import('@/views/purchase/inspectionProduct/index.vue')
const inspectionCheck = () => import('@/views/purchase/inspectionProduct/inspectionCheck.vue')
const qualityInspection = () => import('@/views/purchase/inspectionProduct/qualityInspection.vue')
// 成品鉴定送检
const censorshipProduct = () => import('@/views/purchase/censorshipProduct/index.vue') 
const censorshipCheck = () => import('@/views/purchase/censorshipProduct/censorshipCheck.vue') 
const censorship = () => import('@/views/purchase/censorshipProduct/censorship.vue') 
// 成品证书录入
const certificateInput = () => import('@/views/purchase/certificateInput/index')
const certificateInputCheck = () => import('@/views/purchase/certificateInput/certificateInputCheck.vue')
const entryCertificate = () => import('@/views/purchase/certificateInput/entryCertificate.vue')
// 成品资料完善
const perfectInformation = () => import('@/views/purchase/perfectInformation/index.vue')
const informationCheck = () => import('@/views/purchase/perfectInformation/informationCheck.vue')
const informationEdit = () => import('@/views/purchase/perfectInformation/informationEdit.vue')
// 成品核价
const pricesProduct = () => import('@/views/purchase/pricesProduct/index.vue')
const corePrices = () => import('@/views/purchase/pricesProduct/corePrices.vue')
const pricesCheck = () => import('@/views/purchase/pricesProduct/pricesCheck.vue')
// 半成品质检
const semifinishedQuality = () => import('@/views/purchase/semifinishedQuality/index.vue')
const semiInspection = () => import('@/views/purchase/semifinishedQuality/semiInspection.vue')
const semifinishedCheck = () => import('@/views/purchase/semifinishedQuality/semifinishedCheck.vue')
const basePath = '/purchase'

export default [
  {
    path: basePath + '/styleManagement/index',
    component: styleManagement,
    name: '款式列表'
  },
  {
    path: basePath + '/styleManagement/viewStyles',
    component: viewStyles,
    meta: {
      parentPath: basePath + '/styleManagement/index',
      name: '查看款式列表'
    }
  },
  {
    path: basePath + '/styleManagement/styleEdit',
    component: styleEdit,
    meta: {
      parentPath: basePath + '/styleManagement/index',
      name: '款式列表'
    }
  },
  {
    path: basePath + '/totalInventory/index',
    component: totalInventory,
    name: '款式总库存'
  },
  {
    path: basePath + '/totalInventory/viewInventory',
    component: viewInventory,
    meta: {
      parentPath: basePath + '/totalInventory/index',
      name: '查看款式总库存'
    }
  },
  {
    path: basePath + '/totalInventory/editInventory',
    component: editInventory,
    meta: {
      parentPath: basePath + '/totalInventory/index',
      name: '设置安全库存'
    }
  },
  {
    path: basePath + '/styleInventory/index',
    component: styleInventory,
    name: '款式库存'
  },
  {
    path: basePath + '/storeStyleDemList/index',
    component: storeStyleDemList,
    name: '门店款式需求单'
  },
  {
    path: basePath + '/storeStyleDemList/viewStyleDemList',
    component: viewStyleDemList,
    meta: {
      parentPath: basePath + '/storeStyleDemList/index',
      name: '查看款式需求单'
    }
  },
  {
    path: basePath + '/storeStyleDemList/editStyleDemList',
    component: editStyleDemList,
    meta: {
      parentPath: basePath + '/storeStyleDemList/index',
      name: '编辑款式需求单'
    }
  },
  {
    path: basePath + '/storeDividend/index',
    component: storeDividend,
    name: '门店分货单'
  },
  {
    path: basePath + '/storeDividend/viewStoreStyleDem',
    component: viewStoreStyleDem,
    meta: {
      parentPath: basePath + '/storeDividend/index',
      name: '查看门店分货单'
    }
  },
  {
    path: basePath + '/storeDividend/editStoreStyleDem',
    component: editStoreStyleDem,
    meta: {
      parentPath: basePath + '/storeDividend/index',
      name: '编辑门店分货单'
    }
  },
  {
    path: basePath + '/orderManagement/index',
    component: styleOrderForm,
    name: '款式订货单'
  },
  {
    path: basePath + '/orderManagement/viewStyleOrder',
    component: viewStyleOrder,
    meta: {
      parentPath: basePath + '/orderManagement/index',
      name: '查看款式订货单'
    }
  },
  {
    path: basePath + '/orderManagement/editStyleOrder',
    component: editStyleOrder,
    meta: {
      parentPath: basePath + '/orderManagement/index',
      name: '编辑款式订货单'
    }
  },
  {
    path: basePath + '/rawMaterialOrder/index',
    component: rawMaterialOrder,
    name: '原料订货单'
  },
  {
    path: basePath + '/rawMaterialOrder/viewMaterialOrder',
    component: viewMaterialOrder,
    meta: {
      parentPath: basePath + '/rawMaterialOrder/index',
      name: '查看原料订货单'
    }
  },
  {
    path: basePath + '/rawMaterialOrder/editMaterialOrder',
    component: editMaterialOrder,
    meta: {
      parentPath: basePath + '/rawMaterialOrder/index',
      name: '编辑原料订货单'
    }
  },
  {
    path: basePath + '/distributionAdvice/index',
    component: distributionAdvice,
    name: '配货建议'
  },
  {
    path: basePath + '/distributionPlan/index',
    component: distributionPlan,
    name: '配货计划'
  },
  {
    path: basePath + '/distributionPlan/viewDistributionPlan',
    component: viewDistributionPlan,
    meta: {
      parentPath: basePath + '/distributionPlan/index',
      name: '查看配货计划'
    }
  },
  {
    path: basePath + '/distributionPlan/editDistributionPlan',
    component: editDistributionPlan,
    meta: {
      parentPath: basePath + '/distributionPlan/index',
      name: '编辑配货计划'
    }
  },
  {
    path: basePath + '/finishedProduct/index',
    component: finishedProductList,
    name: '成品到货单'
  },
  {
    path: basePath + '/finishedProduct/viewFinishedProductOrder',
    component: viewFinishedProductOrder,
    meta: {
      parentPath: basePath + '/finishedProduct/index',
      name: '查看到货单'
    }
  },
  {
    path: basePath + '/finishedProduct/editFinishedProductOrder',
    component: editFinishedProductOrder,
    meta: {
      parentPath: basePath + '/finishedProduct/index',
      name: '编辑到货单'
    }
  },
  {
    path: basePath + '/finishedProduct/arrivalGoodAdd',
    component: arrivalGoodAdd,
    meta: {
      parentPath: basePath + '/finishedProduct/index',
      name: '添加货品'
    },
    beforeEnter(to, from, next) {
      to.meta.parentPath = from.meta.parentPath
      next()
    }
  },
  {
    path: basePath + '/finishedProduct/arrivalGoodEdit',
    component: arrivalGoodEdit,
    meta: {
      parentPath: basePath + '/finishedProduct/index',
      name: '修改货品'
    },
    beforeEnter(to, from, next) {
      to.meta.parentPath = from.meta.parentPath
      next()
    }
  },
  {
    path: basePath + '/productStorage/index',
    component: productStorage,
    name: '成品进货入库'
  },
  {
    path: basePath + '/productStorage/viewProductStorage',
    component: viewProductStorage,
    meta: {
      parentPath: basePath + '/productStorage/index',
      name: '查看成品进货入库'
    }
  },
  {
    path: basePath + '/productStorage/editProductStorage',
    component: editProductStorage,
    meta: {
      parentPath: basePath + '/productStorage/index',
      name: '编辑成品进货入库'
    }
  },
  {
    path: basePath + '/productStorage/purchaseGoodAdd',
    component: purchaseGoodAdd,
    meta: {
      parentPath: basePath + '/productStorage/index',
      name: '添加货品'
    }
  },
  {
    path: basePath + '/finishedProductReturn/index',
    component: finishedProductReturn,
    name: '成品退货出库'
  },
  {
    path: basePath + '/finishedProductReturn/viewFinishedProductReturn',
    component: viewFinishedProductReturn,
    meta: {
      parentPath: basePath + '/finishedProductReturn/index',
      name: '查看成品退货出库'
    }
  },
  {
    path: basePath + '/finishedProductReturn/editFinishedProductReturn',
    component: editFinishedProductReturn,
    meta: {
      parentPath: basePath + '/finishedProductReturn/index',
      name: '编辑成品退货出库'
    }
  },
  {
    path: basePath + '/batchEditGoods/index',
    component: batchEditGoods,
    name: '批量修改货品'
  },
  {
    path: basePath + '/batchEditGoods/modifyCheck',
    component: modifyCheck,
    meta: {
      parentPath: basePath + '/batchEditGoods/index',
      name: '查看货品修改单'
    }
  },
  {
    path: basePath + '/batchEditGoods/modifyEdit',
    component: modifyEdit,
    meta: {
      parentPath: basePath + '/batchEditGoods/index',
      name: '编辑货品修改单'
    }
  },
  // {
  //   path: basePath + '/finishedProduct/batchPrintingLabel',
  //   component: batchPrintingLabel,
  //   name: '批量打印标签'
  // },
  // {
  //   path: basePath + '/finishedProduct/printCheck',
  //   component: printCheck,
  //   name: '查看打印单'
  // },
  // {
  //   path: basePath + '/finishedProduct/printEdit',
  //   component: printEdit,
  //   name: '编辑打印单'
  // },
  {
    path: basePath + '/batchLabel/index',
    component: batchLabel,
    name: '批量打印标签'
  },
  {
    path: basePath + '/batchLabel/batchLabelCheck',
    component: batchLabelCheck,
    meta: {
      parentPath: basePath + '/batchLabel/index',
      name: '查看打印标签'
    }
  },
  {
    path: basePath + '/batchLabel/batchLabelEdit',
    component: batchLabelEdit,
    meta: {
      parentPath: basePath + '/batchLabel/index',
      name: '编辑打印标签'
    }
  },
  {
    path: basePath + '/batchLabel/printing',
    component: printing,
    meta: {
      parentPath: basePath + '/batchLabel/index',
      name: '打印'
    }
  },
  {
    path: basePath + '/semiDataManage/index',
    component: semiDataManage,
    name: '半成品资料管理'
  },
  {
    path: basePath + '/semiPackageArrival/index',
    component: semiPackageArrival,
    name: '半成品整包入库'
  },
  {
    path: basePath + '/semiPackageArrival/semiArrivalCheck',
    component: semiArrivalCheck,
    meta: {
      parentPath: basePath + '/semiPackageArrival/index',
      name: '查看半成品入库单'
    }
  },
  {
    path: basePath + '/semiPackageArrival/semiArrivalEdit',
    component: semiArrivalEdit,
    meta: {
      parentPath: basePath + '/semiPackageArrival/index',
      name: '编辑半成品入库单'
    }
  },
  {
    path: basePath + '/pointsBalance/index',
    component: pointsBalance,
    name: '半成品分秤'
  },
  {
    path: basePath + '/pointsBalance/pointsBalanceCheck',
    component: pointsBalanceCheck,
    meta: {
      parentPath: basePath + '/pointsBalance/index',
      name: '查看分秤单'
    }
  },
  {
    path: basePath + '/pointsBalance/pointsBalanceEdit',
    component: pointsBalanceEdit,
    meta: {
      parentPath: basePath + '/pointsBalance/index',
      name: '编辑分秤单'
    }
  },
  {
    path: basePath + '/semiReturnOutbound/index',
    component: semiReturnOutbound,
    name: '半成品退货出库'
  },
  {
    path: basePath + '/semiReturnOutbound/returnOutboundCheck',
    component: returnOutboundCheck,
    meta: {
      parentPath: basePath + '/semiReturnOutbound/index',
      name: '查看退货出库单'
    }
  },
  {
    path: basePath + '/semiReturnOutbound/returnOutboundEdit',
    component: returnOutboundEdit,
    meta: {
      parentPath: basePath + '/semiReturnOutbound/index',
      name: '编辑退货出库单'
    }
  },
  {
    path: basePath + '/stockInventory/index',
    component: stockInventory,
    name: '原料进货入库'
  },
  {
    path: basePath + '/stockInventory/stockInventoryCheck',
    component: stockInventoryCheck,
    meta: {
      parentPath: basePath + '/stockInventory/index',
      name: '查看进货入库单'
    }
  },
  {
    path: basePath + '/stockInventory/stockInventoryEdit',
    component: stockInventoryEdit,
    meta: {
      parentPath: basePath + '/stockInventory/index',
      name: '编辑进货入库单'
    }
  },
  {
    path: basePath + '/stockRemoval/index',
    component: stockRemoval,
    name: '原料退货出库'
  },
  {
    path: basePath + '/stockRemoval/stockRemovalCheck',
    component: stockRemovalCheck,
    meta: {
      parentPath: basePath + '/stockRemoval/index',
      name: '查看退货出库单'
    }
  },
  {
    path: basePath + '/stockRemoval/stockRemovalEdit',
    component: stockRemovalEdit,
    meta: {
      parentPath: basePath + '/stockRemoval/index',
      name: '编辑退货出库单'
    }
  },
  {
    name: '成品质检',
    path: basePath + '/inspectionProduct/index',
    component: inspectionProduct
  },
  {
    path: basePath + '/inspectionProduct/inspectionCheck',
    component: inspectionCheck,
    meta: {
      parentPath: basePath + '/inspectionProduct/index',
      name: '查看成品质检单'
    }
  },
  {
    path: basePath + '/inspectionProduct/qualityInspection',
    component: qualityInspection,
    meta: {
      parentPath: basePath + '/inspectionProduct/index',
      name: '质检成品'
    }
  },
  {
    name: '成品鉴定送检',
    path: basePath + '/censorshipProduct/index',
    component: censorshipProduct
  },
  {
    path: basePath + '/censorshipProduct/censorshipCheck',
    component: censorshipCheck,
    meta: {
      parentPath: basePath + '/censorshipProduct/index',
      name: '查看鉴定送检单'
    }
  },
  {
    path: basePath + '/censorshipProduct/censorship',
    component: censorship,
    meta: {
      parentPath: basePath + '/censorshipProduct/index',
      name: '送检'
    }
  },
  {
    name: '成品证书录入',
    path: basePath + '/certificateInput/index',
    component: certificateInput
  },
  {
    path: basePath + '/certificateInput/certificateInputCheck',
    component: certificateInputCheck,
    meta: {
      parentPath: basePath + '/certificateInput/index',
      name: '查看证书录入单'
    }
  },
  {
    path: basePath + '/certificateInput/entryCertificate',
    component: entryCertificate,
    meta: {
      parentPath: basePath + '/certificateInput/index',
      name: '录入证书'
    }
  },
  {
    name: '成品资料完善',
    path: basePath + '/perfectInformation/index',
    component: perfectInformation
  },
  {
    path: basePath + '/perfectInformation/informationCheck',
    component: informationCheck,
    meta: {
      parentPath: basePath + '/perfectInformation/index',
      name: '查看资料完善单'
    }
  },
  {
    path: basePath + '/perfectInformation/informationEdit',
    component: informationEdit,
    meta: {
      parentPath: basePath + '/perfectInformation/index',
      name: '完善资料'
    }
  },
  {
    name: '成品核价',
    path: basePath + '/pricesProduct/index',
    component: pricesProduct
  },
  {
    path: basePath + '/pricesProduct/corePrices',
    component: corePrices,
    meta: {
      parentPath: basePath + '/pricesProduct/index',
      name: '核价'
    }
  },
  {
    path: basePath + '/pricesProduct/pricesCheck',
    component: pricesCheck,
    meta: {
      parentPath: basePath + '/pricesProduct/index',
      name: '查看核价单'
    }
  },
  {
    name: '半成品质检',
    path: basePath + '/semifinishedQuality/index',
    component: semifinishedQuality
  },
  {
    path: basePath + '/semifinishedQuality/semiInspection',
    component: semiInspection,
    meta: {
      parentPath: basePath + '/semifinishedQuality/index',
      name: '质检半成品'
    }
  },
  {
    path: basePath + '/semifinishedQuality/semifinishedCheck',
    component: semifinishedCheck,
    meta: {
      parentPath: basePath + '/semifinishedQuality/index',
      name: '查看半成品质检单'
    }
  }
]