// 柜台领退单的领退类型;
export const DeskPickretOrderBasicPickretType = {
  'Pickup': 1,
  'Return': 3,
  'Types': {
    '1': '领货',
    '3': '退货',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '领货'},
    {'KeyId': 3, 'Value': '退货'}
  ]
}
// 领货退货单状态;
export const DeskPickretOrderBasicState = {
  'Draft': 1,
  'Audit': 5,
  'Types': {
    '1': '草稿',
    '5': '审核通过',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 5, 'Value': '审核通过'}
  ]
}
// 成品调拨入库单状态;
export const GoodsAllotOrderIntakeState = {
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Types': {
    '3': '待收货',
    '5': '已收货',
    '7': '已退回',
  },
  'TypeArray': [
    {'KeyId': 3, 'Value': '待收货'},
    {'KeyId': 5, 'Value': '已收货'},
    {'KeyId': 7, 'Value': '已退回'}
  ]
}
// 成品调拨出库单的调拨类型;
export const GoodsAllotOrderOutakeSourceType = {
  'Split': 1,
  'Other': 3,
  'Types': {
    '1': '分货调拨',
    '3': '其他调拨',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '分货调拨'},
    {'KeyId': 3, 'Value': '其他调拨'}
  ]
}
// 成品调拨出库单的流向类型;
export const GoodsAllotOrderOutakeStreamType = {
  'Warehouse': 1,
  'Warehouse2Store': 3,
  'Store2Warehouse': 5,
  'Store': 7,
  'Types': {
    '1': '分仓之间',
    '3': '分仓往门店',
    '5': '门店往分仓',
    '7': '门店之间',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '分仓之间'},
    {'KeyId': 3, 'Value': '分仓往门店'},
    {'KeyId': 5, 'Value': '门店往分仓'},
    {'KeyId': 7, 'Value': '门店之间'}
  ]
}
// 成品调拨出库单状态;
export const GoodsAllotOrderOutakeState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 成品到货单的入库状态;
export const GoodsArriveOrderBasicIntakeState = {
  'None': 1,
  'Wait': 3,
  'Done': 5,
  'Types': {
    '1': '未入库',
    '3': '待入库',
    '5': '已入库',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '未入库'},
    {'KeyId': 3, 'Value': '待入库'},
    {'KeyId': 5, 'Value': '已入库'}
  ]
}
// 成品到货单的状态;
export const GoodsArriveOrderBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 成品盘点单的对象类型;
export const GoodsCountOrderBasicObjectType = {
  'Company': 1,
  'Store': 3,
  'Types': {
    '1': '总部',
    '3': '门店',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '总部'},
    {'KeyId': 3, 'Value': '门店'}
  ]
}
// 成品盘点单状态;
export const GoodsCountOrderBasicState = {
  'Taking': 1,
  'Finish': 3,
  'Cancel': 9,
  'Types': {
    '1': '正在盘点',
    '3': '已完成',
    '9': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '正在盘点'},
    {'KeyId': 3, 'Value': '已完成'},
    {'KeyId': 9, 'Value': '已取消'}
  ]
}
// 成品损溢单的损溢类型;
export const GoodsCountReportBasicReportType = {
  'Loss': 1,
  'Over': 3,
  'Types': {
    '1': '报损',
    '3': '报溢',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '报损'},
    {'KeyId': 3, 'Value': '报溢'}
  ]
}
// 成品损溢单的来源类型;
export const GoodsCountReportBasicSourceType = {
  'Manual': 1,
  'Taking': 3,
  'Types': {
    '1': '手工创建',
    '3': '盘点',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '手工创建'},
    {'KeyId': 3, 'Value': '盘点'}
  ]
}
// 成品损溢单状态;
export const GoodsCountReportBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 成品进货入库单的入库单类型;
export const GoodsIntakeOrderBasicIntakeType = {
  'Manual': 1,
  'GoodsArriveOrderBasic': 3,
  'HalfChangeOrderBasic': 5,
  'JunkChangeOrderBasic': 7,
  'Types': {
    '1': '手工创建',
    '3': '成品到货单',
    '5': '半成品分秤单',
    '7': '旧货转成品单',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '手工创建'},
    {'KeyId': 3, 'Value': '成品到货单'},
    {'KeyId': 5, 'Value': '半成品分秤单'},
    {'KeyId': 7, 'Value': '旧货转成品单'}
  ]
}
// 成品进货入库单状态;
export const GoodsIntakeOrderBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 成品批量修改单状态;
export const GoodsModifyOrderBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 成品批量修改单的修改类型;
export const GoodsModifyOrderItemType = {
  'Before': 1,
  'After': 3,
  'Types': {
    '1': '修改前',
    '3': '修改后',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '修改前'},
    {'KeyId': 3, 'Value': '修改后'}
  ]
}
// 成品调价单状态;
export const GoodsPriceOrderBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 成品标签批量打印单状态;
export const GoodsPrintOrderBasicState = {
  'Printing': 1,
  'Printed': 3,
  'Types': {
    '1': '未打印',
    '3': '已打印',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '未打印'},
    {'KeyId': 3, 'Value': '已打印'}
  ]
}
// 成品质检单的质检单类型;
export const GoodsQualityOrderBasicQualityType = {
  'GoodsArriveOrderBasic': 3,
  'HalfChangeOrderBasic': 5,
  'JunkChangeOrderBasic': 7,
  'Types': {
    '3': '成品到货单',
    '5': '半成品分秤单',
    '7': '旧货转成品单',
  },
  'TypeArray': [
    {'KeyId': 3, 'Value': '成品到货单'},
    {'KeyId': 5, 'Value': '半成品分秤单'},
    {'KeyId': 7, 'Value': '旧货转成品单'}
  ]
}
// 成品质检单的每步状态;
export const GoodsQualityOrderBasicStepState = {
  'Wait': 1,
  'Finish': 3,
  'None': 5,
  'Types': {
    '1': '未完成',
    '3': '已完成',
    '5': '无',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '未完成'},
    {'KeyId': 3, 'Value': '已完成'},
    {'KeyId': 5, 'Value': '无'}
  ]
}
// 成品质检单的入库状态;
export const GoodsQualityOrderBasicIntakeState = {
  'None': 1,
  'Wait': 3,
  'Done': 5,
  'Types': {
    '1': '未入库',
    '3': '待入库',
    '5': '已入库',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '未入库'},
    {'KeyId': 3, 'Value': '待入库'},
    {'KeyId': 5, 'Value': '已入库'}
  ]
}
// 成品质检单状态;
export const GoodsQualityOrderBasicState = {
  'Audit': 1,
  'Qualitied': 3,
  'Cancel': 5,
  'Types': {
    '1': '待质检',
    '3': '质检完成',
    '5': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '待质检'},
    {'KeyId': 3, 'Value': '质检完成'},
    {'KeyId': 5, 'Value': '已取消'}
  ]
}
// 成品配货计划单状态;
export const GoodsReinfPlanBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 成品维修单的收货状态;
export const GoodsRepairOrderBasicReceiptState = {
  'Wait': 1,
  'Received': 3,
  'Reject': 5,
  'Types': {
    '1': '待收货',
    '3': '已收货',
    '5': '已退回',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '待收货'},
    {'KeyId': 3, 'Value': '已收货'},
    {'KeyId': 5, 'Value': '已退回'}
  ]
}
// 成品维修单的维修地点;
export const GoodsRepairOrderBasicPlaceType = {
  'Store': 1,
  'Company': 3,
  'Factory': 5,
  'Types': {
    '1': '门店',
    '3': '总部',
    '5': '工厂',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '门店'},
    {'KeyId': 3, 'Value': '总部'},
    {'KeyId': 5, 'Value': '工厂'}
  ]
}
// 成品维修单的步骤状态;
export const GoodsRepairOrderBasicStepState = {
  'Wait': 1,
  'Repairing': 3,
  'Paid': 5,
  'Return': 7,
  'Finish': 9,
  'Abandon': 11,
  'Types': {
    '1': '待处理',
    '3': '维修中',
    '5': '待收款',
    '7': '待返还',
    '9': '已完成',
    '11': '已作废',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '待处理'},
    {'KeyId': 3, 'Value': '维修中'},
    {'KeyId': 5, 'Value': '待收款'},
    {'KeyId': 7, 'Value': '待返还'},
    {'KeyId': 9, 'Value': '已完成'},
    {'KeyId': 11, 'Value': '已作废'}
  ]
}
// 成品退货出库单状态;
export const GoodsReturnOrderBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 成品库存变化日志的单据类型;
export const GoodsStockLogOrderType = {
  'GoodsIntakeOrderBasic': 1,
  'GoodsReturnOrderBasic': 3,
  'GoodsCountReportBasic1': 5,
  'GoodsCountReportBasic3': 7,
  'JunkChangeOrderBasic': 9,
  'GoodsAllotOrderOutake': 11,
  'GoodsAllotOrderIntake': 13,
  'RetailOrderMaster': 15,
  'RetailOrderReturn': 17,
  'GoodsCountReport': 19,
  'DeskPickretOrder1': 21,
  'DeskPickretOrder3': 23,
  'WeiwGjunkSplitBasic': 25,
  'Types': {
    '1': '成品进货入库单',
    '3': '成品退货出库单',
    '5': '成品报损单',
    '7': '成品报溢单',
    '9': '旧货转换成品',
    '11': '成品调拨出库单',
    '13': '成品调拨入库单',
    '15': '零售单',
    '17': '售后退货单',
    '19': '成品盘点单',
    '21': '柜台领货单',
    '23': '柜台退货单',
    '25': '委外拆卸单',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '成品进货入库单'},
    {'KeyId': 3, 'Value': '成品退货出库单'},
    {'KeyId': 5, 'Value': '成品报损单'},
    {'KeyId': 7, 'Value': '成品报溢单'},
    {'KeyId': 9, 'Value': '旧货转换成品'},
    {'KeyId': 11, 'Value': '成品调拨出库单'},
    {'KeyId': 13, 'Value': '成品调拨入库单'},
    {'KeyId': 15, 'Value': '零售单'},
    {'KeyId': 17, 'Value': '售后退货单'},
    {'KeyId': 19, 'Value': '成品盘点单'},
    {'KeyId': 21, 'Value': '柜台领货单'},
    {'KeyId': 23, 'Value': '柜台退货单'},
    {'KeyId': 25, 'Value': '委外拆卸单'}
  ]
}
// 成品库存变化日志的事件类型;
export const GoodsStockLogEventType = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 成品库存变化日志的位置类型;
export const GoodsStockLogPositionType = {
  'Warehouse': 1,
  'Shelf': 3,
  'Store': 5,
  'DefaultDesk': 7,
  'Desk': 9,
  'Types': {
    '1': '总部分仓',
    '3': '分仓货架',
    '5': '门店',
    '7': '门店仓库',
    '9': '门店柜台',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '总部分仓'},
    {'KeyId': 3, 'Value': '分仓货架'},
    {'KeyId': 5, 'Value': '门店'},
    {'KeyId': 7, 'Value': '门店仓库'},
    {'KeyId': 9, 'Value': '门店柜台'}
  ]
}
// 成品库存的位置类型;
export const GoodsStockWarehousePositionType = {
  'Warehouse': 1,
  'Store': 3,
  'Types': {
    '1': '总部分仓',
    '3': '门店',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '总部分仓'},
    {'KeyId': 3, 'Value': '门店'}
  ]
}
// 货品类别;
export const FinanceType = {
  'Self': 1,
  'Take': 3,
  'Types': {
    '1': '自营',
    '3': '代销',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '自营'},
    {'KeyId': 3, 'Value': '代销'}
  ]
}
// 货品类型;
export const GoodsType = {
  'Single': 1,
  'Multi': 3,
  'Types': {
    '1': '一码一货',
    '3': '一码多货',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '一码一货'},
    {'KeyId': 3, 'Value': '一码多货'}
  ]
}
// 材质类型;
export const MaterialType = {
  'Goldlion': 1,
  'Silver': 3,
  'HardGold3D': 5,
  'Platinum': 7,
  'Palladium': 9,
  'Diamond': 11,
  'KGoldlion': 13,
  'Gemstone': 15,
  'GoldWithJade': 17,
  'PearlStone': 19,
  'Wood': 21,
  'Fashion': 23,
  'Jewelry': 25,
  'Jadeite': 27,
  'GoldInlay': 18,
  'Zircon': 16,
  'AncientGlod': 2,
  'FiveGlod': 4,
  'Fitting': 97,
  'Other': 99,
  'Types': {
    '1': '黄金',
    '3': '银饰',
    '5': '3D硬金',
    '7': '铂金',
    '9': '钯金',
    '11': '钻石',
    '13': 'K金',
    '15': '彩宝',
    '17': '金镶玉',
    '19': '珍珠宝石',
    '21': '天然木饰',
    '23': '时尚饰品',
    '25': '珠宝配饰',
    '27': '翡翠玉石',
    '18': '黄金镶嵌',
    '16': '锆石',
    '2': '古法黄金',
    '4': '5G黄金',
    '97': '配件',
    '99': '其它',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '黄金'},
    {'KeyId': 3, 'Value': '银饰'},
    {'KeyId': 5, 'Value': '3D硬金'},
    {'KeyId': 7, 'Value': '铂金'},
    {'KeyId': 9, 'Value': '钯金'},
    {'KeyId': 11, 'Value': '钻石'},
    {'KeyId': 13, 'Value': 'K金'},
    {'KeyId': 15, 'Value': '彩宝'},
    {'KeyId': 17, 'Value': '金镶玉'},
    {'KeyId': 19, 'Value': '珍珠宝石'},
    {'KeyId': 21, 'Value': '天然木饰'},
    {'KeyId': 23, 'Value': '时尚饰品'},
    {'KeyId': 25, 'Value': '珠宝配饰'},
    {'KeyId': 27, 'Value': '翡翠玉石'},
    {'KeyId': 18, 'Value': '黄金镶嵌'},
    {'KeyId': 16, 'Value': '锆石'},
    {'KeyId': 2, 'Value': '古法黄金'},
    {'KeyId': 4, 'Value': '5G黄金'},
    {'KeyId': 97, 'Value': '配件'},
    {'KeyId': 99, 'Value': '其它'}
  ]
}
// 品类类型;
export const CategoryType = {
  'Type01': 1,
  'Type03': 3,
  'Type05': 5,
  'Type07': 7,
  'Type09': 9,
  'Type11': 11,
  'Type13': 13,
  'Type15': 15,
  'Type17': 17,
  'Type19': 19,
  'Type21': 21,
  'Type23': 23,
  'Type25': 25,
  'Type27': 27,
  'Type29': 29,
  'Type31': 31,
  'Type33': 33,
  'Type35': 35,
  'Type37': 37,
  'Type39': 39,
  'Type41': 41,
  'Type43': 43,
  'Type45': 45,
  'Type47': 47,
  'Type49': 49,
  'Type51': 51,
  'Type53': 53,
  'Type55': 55,
  'Type57': 57,
  'Type59': 59,
  'Type61': 61,
  'Type63': 63,
  'Type65': 65,
  'Type67': 67,
  'Type69': 69,
  'Type71': 71,
  'Type73': 73,
  'Type99': 99,
  'Types': {
    '1': '项链',
    '3': '套链',
    '5': '吊坠',
    '7': '头饰',
    '9': '耳饰',
    '11': '戒指',
    '13': '手链',
    '15': '手镯',
    '17': '臂镯',
    '19': '脚链',
    '21': '胸针',
    '23': '领夹',
    '25': '袖扣',
    '27': '珠串',
    '29': '珠链',
    '31': '挂件',
    '33': '摆件',
    '35': '金卡',
    '37': '金条',
    '39': '金币',
    '41': '铂金金条',
    '43': '铂金金币',
    '45': '银条',
    '47': '银币',
    '49': '银卡',
    '51': '电铸摆件',
    '53': '耳迫',
    '55': '配件扣',
    '57': '鱼钩扣',
    '59': '弹簧扣',
    '61': '绳子',
    '63': '钟表',
    '65': '挂坠',
    '67': '情侣对戒',
    '69': '童镯',
    '71': '转运珠',
    '73': '饰品',
    '99': '其它',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '项链'},
    {'KeyId': 3, 'Value': '套链'},
    {'KeyId': 5, 'Value': '吊坠'},
    {'KeyId': 7, 'Value': '头饰'},
    {'KeyId': 9, 'Value': '耳饰'},
    {'KeyId': 11, 'Value': '戒指'},
    {'KeyId': 13, 'Value': '手链'},
    {'KeyId': 15, 'Value': '手镯'},
    {'KeyId': 17, 'Value': '臂镯'},
    {'KeyId': 19, 'Value': '脚链'},
    {'KeyId': 21, 'Value': '胸针'},
    {'KeyId': 23, 'Value': '领夹'},
    {'KeyId': 25, 'Value': '袖扣'},
    {'KeyId': 27, 'Value': '珠串'},
    {'KeyId': 29, 'Value': '珠链'},
    {'KeyId': 31, 'Value': '挂件'},
    {'KeyId': 33, 'Value': '摆件'},
    {'KeyId': 35, 'Value': '金卡'},
    {'KeyId': 37, 'Value': '金条'},
    {'KeyId': 39, 'Value': '金币'},
    {'KeyId': 41, 'Value': '铂金金条'},
    {'KeyId': 43, 'Value': '铂金金币'},
    {'KeyId': 45, 'Value': '银条'},
    {'KeyId': 47, 'Value': '银币'},
    {'KeyId': 49, 'Value': '银卡'},
    {'KeyId': 51, 'Value': '电铸摆件'},
    {'KeyId': 53, 'Value': '耳迫'},
    {'KeyId': 55, 'Value': '配件扣'},
    {'KeyId': 57, 'Value': '鱼钩扣'},
    {'KeyId': 59, 'Value': '弹簧扣'},
    {'KeyId': 61, 'Value': '绳子'},
    {'KeyId': 63, 'Value': '钟表'},
    {'KeyId': 65, 'Value': '挂坠'},
    {'KeyId': 67, 'Value': '情侣对戒'},
    {'KeyId': 69, 'Value': '童镯'},
    {'KeyId': 71, 'Value': '转运珠'},
    {'KeyId': 73, 'Value': '饰品'},
    {'KeyId': 99, 'Value': '其它'}
  ]
}
// 成色类型;
export const GoldType = {
  'Type1005': 1005,
  'Type1010': 1010,
  'Type1015': 1015,
  'Type1105': 1105,
  'Type1110': 1110,
  'Type1112': 1112,
  'Type1113': 1113,
  'Type1205': 1205,
  'Type1210': 1210,
  'Type1215': 1215,
  'Type1217': 1217,
  'Type1219': 1219,
  'Type1220': 1220,
  'Type1225': 1225,
  'Type1305': 1305,
  'Type1310': 1310,
  'Type1315': 1315,
  'Type1320': 1320,
  'Type1405': 1405,
  'Type1410': 1410,
  'Type1412': 1412,
  'Type1415': 1415,
  'Type1500': 1500,
  'Type1505': 1505,
  'Type1510': 1510,
  'Type1600': 1600,
  'Type1605': 1605,
  'Type1610': 1610,
  'Type1620': 1620,
  'Type1625': 1625,
  'Type1630': 1630,
  'Type1635': 1635,
  'Types': {
    '1005': '足金AU99.9',
    '1010': '足金AU99.99',
    '1015': '足金AU99.999',
    '1105': '足金AU99.9(3D精品)',
    '1110': '足金AU99.99(3D精品)',
    '1112': '足金AU99.9(3D普品)',
    '1113': '足金AU99.99(3D普品)',
    '1205': '足金AU99.9精品',
    '1210': '足金AU99.99精品',
    '1215': '足金AU99.999精品',
    '1217': '金AU990',
    '1219': '金AU916',
    '1220': '金AU750',
    '1225': '金AU585',
    '1305': '铂金PT999',
    '1310': '铂金PT990',
    '1315': '铂金PT950',
    '1320': '铂金PT900',
    '1405': '足银Ag99.9',
    '1410': '足银Ag99.99',
    '1412': '银Ag990',
    '1415': '银S925',
    '1500': '投资金条AU99.9',
    '1505': '投资金条AU99.99',
    '1510': '投资金条AU99.999',
    '1600': '工艺金条AU99.9',
    '1605': '工艺金条AU99.99',
    '1610': '工艺金条AU99.999',
    '1620': '钯金PD900',
    '1625': '钯金PD950',
    '1630': '钯金PD990',
    '1635': '钯金PD999',
  },
  'TypeArray': [
    {'KeyId': 1005, 'Value': '足金AU99.9'},
    {'KeyId': 1010, 'Value': '足金AU99.99'},
    {'KeyId': 1015, 'Value': '足金AU99.999'},
    {'KeyId': 1105, 'Value': '足金AU99.9(3D精品)'},
    {'KeyId': 1110, 'Value': '足金AU99.99(3D精品)'},
    {'KeyId': 1112, 'Value': '足金AU99.9(3D普品)'},
    {'KeyId': 1113, 'Value': '足金AU99.99(3D普品)'},
    {'KeyId': 1205, 'Value': '足金AU99.9精品'},
    {'KeyId': 1210, 'Value': '足金AU99.99精品'},
    {'KeyId': 1215, 'Value': '足金AU99.999精品'},
    {'KeyId': 1217, 'Value': '金AU990'},
    {'KeyId': 1219, 'Value': '金AU916'},
    {'KeyId': 1220, 'Value': '金AU750'},
    {'KeyId': 1225, 'Value': '金AU585'},
    {'KeyId': 1305, 'Value': '铂金PT999'},
    {'KeyId': 1310, 'Value': '铂金PT990'},
    {'KeyId': 1315, 'Value': '铂金PT950'},
    {'KeyId': 1320, 'Value': '铂金PT900'},
    {'KeyId': 1405, 'Value': '足银Ag99.9'},
    {'KeyId': 1410, 'Value': '足银Ag99.99'},
    {'KeyId': 1412, 'Value': '银Ag990'},
    {'KeyId': 1415, 'Value': '银S925'},
    {'KeyId': 1500, 'Value': '投资金条AU99.9'},
    {'KeyId': 1505, 'Value': '投资金条AU99.99'},
    {'KeyId': 1510, 'Value': '投资金条AU99.999'},
    {'KeyId': 1600, 'Value': '工艺金条AU99.9'},
    {'KeyId': 1605, 'Value': '工艺金条AU99.99'},
    {'KeyId': 1610, 'Value': '工艺金条AU99.999'},
    {'KeyId': 1620, 'Value': '钯金PD900'},
    {'KeyId': 1625, 'Value': '钯金PD950'},
    {'KeyId': 1630, 'Value': '钯金PD990'},
    {'KeyId': 1635, 'Value': '钯金PD999'}
  ]
}
// 工艺类型;
export const ProcessType = {
  'General': 1,
  'Elaborate': 3,
  'Special': 5,
  'Types': {
    '1': '普货',
    '3': '精品',
    '5': '特工',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '普货'},
    {'KeyId': 3, 'Value': '精品'},
    {'KeyId': 5, 'Value': '特工'}
  ]
}
// 价格类型;
export const PriceType = {
  'Official': 1,
  'Special': 3,
  'Types': {
    '1': '正价',
    '3': '特价',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '正价'},
    {'KeyId': 3, 'Value': '特价'}
  ]
}
// 赠品类型;
export const GiftType = {
  'Gift': 1,
  'NonGift': 3,
  'Types': {
    '1': '赠品',
    '3': '非赠品',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '赠品'},
    {'KeyId': 3, 'Value': '非赠品'}
  ]
}
// 工费类型;
export const FeeType = {
  'Low': 1,
  'High': 3,
  'Types': {
    '1': '低工费',
    '3': '高工费',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '低工费'},
    {'KeyId': 3, 'Value': '高工费'}
  ]
}
// 零售方式;
export const RetailType = {
  'PieceOf': 1,
  'FeeOfGram': 3,
  'FeeOfPiece': 5,
  'Types': {
    '1': '计件',
    '3': '计价(工费按克)',
    '5': '计价(工费按件)',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '计件'},
    {'KeyId': 3, 'Value': '计价(工费按克)'},
    {'KeyId': 5, 'Value': '计价(工费按件)'}
  ]
}
// 调拨方式;
export const AppropType = {
  'PieceOf': 1,
  'FeeOfGram': 3,
  'FeeOfPiece': 5,
  'Types': {
    '1': '计件',
    '3': '计价(工费按克)',
    '5': '计价(工费按件)',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '计件'},
    {'KeyId': 3, 'Value': '计价(工费按克)'},
    {'KeyId': 5, 'Value': '计价(工费按件)'}
  ]
}
// 批发方式;
export const WholesaleType = {
  'PieceOf': 1,
  'FeeOfGram': 3,
  'FeeOfPiece': 5,
  'Types': {
    '1': '计件',
    '3': '计价(工费按克)',
    '5': '计价(工费按件)',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '计件'},
    {'KeyId': 3, 'Value': '计价(工费按克)'},
    {'KeyId': 5, 'Value': '计价(工费按件)'}
  ]
}
// 颜色;
export const StoneColor = {
  'D': 1,
  'E': 2,
  'DE': 3,
  'F': 4,
  'G': 5,
  'FG': 6,
  'H': 7,
  'I': 8,
  'J': 9,
  'IJ': 10,
  'K': 11,
  'L': 12,
  'KL': 13,
  'M': 14,
  'N': 15,
  'MN': 16,
  'Types': {
    '1': 'D',
    '2': 'E',
    '3': 'D-E',
    '4': 'F',
    '5': 'G',
    '6': 'F-G',
    '7': 'H',
    '8': 'I',
    '9': 'J',
    '10': 'I-J',
    '11': 'K',
    '12': 'L',
    '13': 'K-L',
    '14': 'M',
    '15': 'N',
    '16': 'M-N',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': 'D'},
    {'KeyId': 2, 'Value': 'E'},
    {'KeyId': 3, 'Value': 'D-E'},
    {'KeyId': 4, 'Value': 'F'},
    {'KeyId': 5, 'Value': 'G'},
    {'KeyId': 6, 'Value': 'F-G'},
    {'KeyId': 7, 'Value': 'H'},
    {'KeyId': 8, 'Value': 'I'},
    {'KeyId': 9, 'Value': 'J'},
    {'KeyId': 10, 'Value': 'I-J'},
    {'KeyId': 11, 'Value': 'K'},
    {'KeyId': 12, 'Value': 'L'},
    {'KeyId': 13, 'Value': 'K-L'},
    {'KeyId': 14, 'Value': 'M'},
    {'KeyId': 15, 'Value': 'N'},
    {'KeyId': 16, 'Value': 'M-N'}
  ]
}
// 净度;
export const StoneClarity = {
  'IF': 1,
  'VVS': 2,
  'VVS1': 3,
  'VVS2': 4,
  'VS': 5,
  'VS1': 6,
  'VS2': 7,
  'SI': 8,
  'SI1': 9,
  'SI2': 10,
  'SI3': 11,
  'P': 12,
  'FL': 13,
  'LC': 14,
  'Types': {
    '1': 'IF',
    '2': 'VVS',
    '3': 'VVS1',
    '4': 'VVS2',
    '5': 'VS',
    '6': 'VS1',
    '7': 'VS2',
    '8': 'SI',
    '9': 'SI1',
    '10': 'SI2',
    '11': 'SI3',
    '12': 'P',
    '13': 'FL',
    '14': 'LC',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': 'IF'},
    {'KeyId': 2, 'Value': 'VVS'},
    {'KeyId': 3, 'Value': 'VVS1'},
    {'KeyId': 4, 'Value': 'VVS2'},
    {'KeyId': 5, 'Value': 'VS'},
    {'KeyId': 6, 'Value': 'VS1'},
    {'KeyId': 7, 'Value': 'VS2'},
    {'KeyId': 8, 'Value': 'SI'},
    {'KeyId': 9, 'Value': 'SI1'},
    {'KeyId': 10, 'Value': 'SI2'},
    {'KeyId': 11, 'Value': 'SI3'},
    {'KeyId': 12, 'Value': 'P'},
    {'KeyId': 13, 'Value': 'FL'},
    {'KeyId': 14, 'Value': 'LC'}
  ]
}
// 切工;
export const StoneCut = {
  'EX': 1,
  'VG': 2,
  'G': 3,
  'P': 4,
  'Types': {
    '1': 'EX',
    '2': 'VG',
    '3': 'G',
    '4': 'P',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': 'EX'},
    {'KeyId': 2, 'Value': 'VG'},
    {'KeyId': 3, 'Value': 'G'},
    {'KeyId': 4, 'Value': 'P'}
  ]
}
// 抛光;
export const StonePolish = {
  'EX': 1,
  'VG': 2,
  'G': 3,
  'P': 4,
  'Types': {
    '1': 'EX',
    '2': 'VG',
    '3': 'G',
    '4': 'P',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': 'EX'},
    {'KeyId': 2, 'Value': 'VG'},
    {'KeyId': 3, 'Value': 'G'},
    {'KeyId': 4, 'Value': 'P'}
  ]
}
// 对称;
export const StoneSym = {
  'EX': 1,
  'VG': 2,
  'G': 3,
  'P': 4,
  'Types': {
    '1': 'EX',
    '2': 'VG',
    '3': 'G',
    '4': 'P',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': 'EX'},
    {'KeyId': 2, 'Value': 'VG'},
    {'KeyId': 3, 'Value': 'G'},
    {'KeyId': 4, 'Value': 'P'}
  ]
}
// 货品状态;
export const GoodsBasicState = {
  'Audit': 3,
  'Abandon': 5,
  'Types': {
    '3': '已审核',
    '5': '已作废',
  },
  'TypeArray': [
    {'KeyId': 3, 'Value': '已审核'},
    {'KeyId': 5, 'Value': '已作废'}
  ]
}
// 半成品调拨入库单状态;
export const HalfAllotOrderIntakeState = {
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Types': {
    '3': '待收货',
    '5': '已收货',
    '7': '已退回',
  },
  'TypeArray': [
    {'KeyId': 3, 'Value': '待收货'},
    {'KeyId': 5, 'Value': '已收货'},
    {'KeyId': 7, 'Value': '已退回'}
  ]
}
// 半成品调拨出库单状态;
export const HalfAllotOrderOutakeState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 半成品分秤单状态;
export const HalfChangeOrderBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 半成品盘点单状态;
export const HalfCountOrderBasicState = {
  'Taking': 1,
  'Finish': 3,
  'Cancel': 9,
  'Types': {
    '1': '正在盘点',
    '3': '已完成',
    '9': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '正在盘点'},
    {'KeyId': 3, 'Value': '已完成'},
    {'KeyId': 9, 'Value': '已取消'}
  ]
}
// 半成品损溢单的损溢类型;
export const HalfCountReportBasicReportType = {
  'Loss': 1,
  'Over': 3,
  'Types': {
    '1': '报损',
    '3': '报溢',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '报损'},
    {'KeyId': 3, 'Value': '报溢'}
  ]
}
// 半成品损溢单的来源类型;
export const HalfCountReportBasicSourceType = {
  'Manual': 1,
  'Taking': 3,
  'Types': {
    '1': '手工创建',
    '3': '盘点',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '手工创建'},
    {'KeyId': 3, 'Value': '盘点'}
  ]
}
// 半成品损溢单状态;
export const HalfCountReportBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 半成品整包入库单的质检状态;
export const HalfIntakeOrderBasicQualityState = {
  'Wait': 1,
  'Finish': 3,
  'Cancel': 5,
  'Types': {
    '1': '未完成',
    '3': '已完成',
    '5': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '未完成'},
    {'KeyId': 3, 'Value': '已完成'},
    {'KeyId': 5, 'Value': '已取消'}
  ]
}
// 半成品整包入库单状态;
export const HalfIntakeOrderBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 半成品退货单状态;
export const HalfReturnOrderBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 半成品库存变化日志的单据类型;
export const HalfStockLogOrderType = {
  'HalfIntakeOrderBasic': 1,
  'HalfReturnOrderBasic': 3,
  'HalfAllotOrderOutake': 5,
  'HalfAllotOrderIntake': 7,
  'HalfCountReportBasic1': 9,
  'HalfCountReportBasic3': 11,
  'HalfChangeOrderBasic': 13,
  'Types': {
    '1': '半成品整包入库单',
    '3': '半成品退货单',
    '5': '半成品调拨出库单',
    '7': '半成品调拨入库单',
    '9': '半成品报损单',
    '11': '半成品报溢单',
    '13': '半成品分秤单',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '半成品整包入库单'},
    {'KeyId': 3, 'Value': '半成品退货单'},
    {'KeyId': 5, 'Value': '半成品调拨出库单'},
    {'KeyId': 7, 'Value': '半成品调拨入库单'},
    {'KeyId': 9, 'Value': '半成品报损单'},
    {'KeyId': 11, 'Value': '半成品报溢单'},
    {'KeyId': 13, 'Value': '半成品分秤单'}
  ]
}
// 半成品库存变化日志的事件类型;
export const HalfStockLogEventType = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 半成品库存变化日志的位置类型;
export const HalfStockLogPositionType = {
  'Warehouse': 1,
  'Shelf': 3,
  'Types': {
    '1': '总部分仓',
    '3': '分仓货架',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '总部分仓'},
    {'KeyId': 3, 'Value': '分仓货架'}
  ]
}
// 旧货调拨入库单状态;
export const JunkAllotOrderIntakeState = {
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Types': {
    '3': '待收货',
    '5': '已收货',
    '7': '已退回',
  },
  'TypeArray': [
    {'KeyId': 3, 'Value': '待收货'},
    {'KeyId': 5, 'Value': '已收货'},
    {'KeyId': 7, 'Value': '已退回'}
  ]
}
// 旧货调拨出库单状态;
export const JunkAllotOrderOutakeState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'}
  ]
}
// 旧货调拨出库单的流向类型;
export const JunkAllotOrderOutakeStreamType = {
  'Warehouse': 1,
  'Warehouse2Store': 3,
  'Store2Warehouse': 5,
  'Store': 7,
  'Types': {
    '1': '分仓之间',
    '3': '分仓往门店',
    '5': '门店往分仓',
    '7': '门店之间',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '分仓之间'},
    {'KeyId': 3, 'Value': '分仓往门店'},
    {'KeyId': 5, 'Value': '门店往分仓'},
    {'KeyId': 7, 'Value': '门店之间'}
  ]
}
// 旧货资料的来源类型;
export const JunkBasicSourceType = {
  'Coupon': 1,
  'Manual': 3,
  'Types': {
    '1': '卡券换购',
    '3': '手工创建',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '卡券换购'},
    {'KeyId': 3, 'Value': '手工创建'}
  ]
}
// 旧货转成品单状态;
export const JunkChangeOrderBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 旧货转成品单旧货明细的加工类型;
export const JunkChangeOrderItemCraftType = {
  'Polish': 1,
  'Craft': 3,
  'Other': 99,
  'Types': {
    '1': '抛光',
    '3': '镶石',
    '99': '其它',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '抛光'},
    {'KeyId': 3, 'Value': '镶石'},
    {'KeyId': 99, 'Value': '其它'}
  ]
}
// 旧货出库单的对象类型;
export const JunkOutakeOrderBasicObjectType = {
  'Company': 1,
  'Store': 3,
  'Types': {
    '1': '总部',
    '3': '门店',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '总部'},
    {'KeyId': 3, 'Value': '门店'}
  ]
}
// 旧货出库单状态;
export const JunkOutakeOrderBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 旧货打印单状态;
export const JunkPrintOrderBasicState = {
  'Printing': 1,
  'Printed': 3,
  'Types': {
    '1': '未打印',
    '3': '已打印',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '未打印'},
    {'KeyId': 3, 'Value': '已打印'}
  ]
}
// 旧货轨迹的转换类型;
export const JunkTraceVaryType = {
  'Changed': 1,
  'Splited': 3,
  'AllotOuted': 5,
  'OtherOuted': 7,
  'Types': {
    '1': '转成品',
    '3': '被拆卸',
    '5': '调拨出库',
    '7': '其它出库',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '转成品'},
    {'KeyId': 3, 'Value': '被拆卸'},
    {'KeyId': 5, 'Value': '调拨出库'},
    {'KeyId': 7, 'Value': '其它出库'}
  ]
}
// 旧货轨迹的出入状态;
export const JunkTraceState = {
  'Storaged': 1,
  'WaitOut': 3,
  'Outed': 5,
  'Cancel': 9,
  'Types': {
    '1': '已入库',
    '3': '待出库',
    '5': '已出库',
    '9': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已入库'},
    {'KeyId': 3, 'Value': '待出库'},
    {'KeyId': 5, 'Value': '已出库'},
    {'KeyId': 9, 'Value': '已取消'}
  ]
}
// 分类字典的字典类型;
export const SettingDictionaryDictType = {
  'GoodsReturnOrderBasicReasonType': 1,
  'GoodsPriceOrderBasicReasonType': 3,
  'SettleIOBillPaidBankType': 5,
  'SettleIOBillPaidPaymentType': 7,
  'GoodsPrintOrderBasicReasonType': 9,
  'GoodsModifyOrderBasicReasonType': 11,
  'JunkChangeOrderBasicReasonType': 13,
  'JunkOutakeOrderBasicReasonType': 15,
  'GoodsAllotOrderOutakeReasonType': 17,
  'JunkPrintOrderBasicReasonType': 19,
  'JunkModifyOrderBasicReasonType': 21,
  'GoodsRepairOrderBasicPrepairType': 23,
  'DeskBasicGroupType': 25,
  'HalfBasicHalfClass': 27,
  'HalfAllotOrderOutakeReasonType': 29,
  'HalfReturnOrderBasicReasonType': 31,
  'JunkAllotOrderOutakeReasonType': 33,
  'SettleIOBillBasicReceiveReasonType': 35,
  'StuffAllotOrderOutakeReasonType': 37,
  'StuffReturnOrderBasicReasonType': 39,
  'WarehouseBasicWarehouseType': 41,
  'WeiwJunkSplitBasicReasonType': 43,
  'WeiwStuffReturnBasicReasonType': 45,
  'WeiwStuffSendBasicReasonType': 47,
  'SettleIOBillBasicPayReasonType': 49,
  'WeiwGoodsSplitBasicReasonType': 51,
  'Types': {
    '1': '成品退货出库单的原因类型',
    '3': '成品调价单的原因类型',
    '5': '财务已收付款单的收款账户',
    '7': '财务已收付款单的收付款方式',
    '9': '成品标签批量打印单的原因类型',
    '11': '成品批量修改单的原因类型',
    '13': '旧货转成品单的原因类型',
    '15': '旧货出库单的原因类型',
    '17': '成品调拨出库单的原因类型',
    '19': '旧货打印单的原因类型',
    '21': '旧货修改单的原因类型',
    '23': '成品维修单的维修项目',
    '25': '柜台资料的柜台分组',
    '27': '半成品资料的半成品分类',
    '29': '半成品调拨出库单的原因类型',
    '31': '半成品退货单的原因类型',
    '33': '旧货调拨出库单的原因类型',
    '35': '财务应收款单的原因类型',
    '37': '原料调拨出库单的原因类型',
    '39': '原料退货出库单的原因类型',
    '41': '仓库资料的仓库类型',
    '43': '旧货委外拆卸单的原因类型',
    '45': '委外加工退料入库单的原因类型',
    '47': '委外加工发料出库单的原因类型',
    '49': '财务应付款单的原因类型',
    '51': '成品委外拆卸单的原因类型',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '成品退货出库单的原因类型'},
    {'KeyId': 3, 'Value': '成品调价单的原因类型'},
    {'KeyId': 5, 'Value': '财务已收付款单的收款账户'},
    {'KeyId': 7, 'Value': '财务已收付款单的收付款方式'},
    {'KeyId': 9, 'Value': '成品标签批量打印单的原因类型'},
    {'KeyId': 11, 'Value': '成品批量修改单的原因类型'},
    {'KeyId': 13, 'Value': '旧货转成品单的原因类型'},
    {'KeyId': 15, 'Value': '旧货出库单的原因类型'},
    {'KeyId': 17, 'Value': '成品调拨出库单的原因类型'},
    {'KeyId': 19, 'Value': '旧货打印单的原因类型'},
    {'KeyId': 21, 'Value': '旧货修改单的原因类型'},
    {'KeyId': 23, 'Value': '成品维修单的维修项目'},
    {'KeyId': 25, 'Value': '柜台资料的柜台分组'},
    {'KeyId': 27, 'Value': '半成品资料的半成品分类'},
    {'KeyId': 29, 'Value': '半成品调拨出库单的原因类型'},
    {'KeyId': 31, 'Value': '半成品退货单的原因类型'},
    {'KeyId': 33, 'Value': '旧货调拨出库单的原因类型'},
    {'KeyId': 35, 'Value': '财务应收款单的原因类型'},
    {'KeyId': 37, 'Value': '原料调拨出库单的原因类型'},
    {'KeyId': 39, 'Value': '原料退货出库单的原因类型'},
    {'KeyId': 41, 'Value': '仓库资料的仓库类型'},
    {'KeyId': 43, 'Value': '旧货委外拆卸单的原因类型'},
    {'KeyId': 45, 'Value': '委外加工退料入库单的原因类型'},
    {'KeyId': 47, 'Value': '委外加工发料出库单的原因类型'},
    {'KeyId': 49, 'Value': '财务应付款单的原因类型'},
    {'KeyId': 51, 'Value': '成品委外拆卸单的原因类型'}
  ]
}
// 科目设置的科目类型;
export const SettingEnumeratorEnumeratorType = {
  'CategoryType': 1,
  'MaterialType': 3,
  'GoldType': 5,
  'SeriesType': 7,
  'PaymentType': 9,
  'KindType': 11,
  'StoneClassType': 13,
  'LargeClassType': 15,
  'SmallClassType': 17,
  'FinanceClassType': 19,
  'PartType': 21,
  'StoneWeight': 23,
  'ProcessType': 25,
  'PriceType': 27,
  'FeeType': 29,
  'Types': {
    '1': '品类',
    '3': '材质',
    '5': '成色',
    '7': '系列',
    '9': '支付方式',
    '11': '货品种类',
    '13': '石类',
    '15': '大类',
    '17': '小类',
    '19': '财务分类',
    '21': '配件',
    '23': '石重范围',
    '25': '工艺类型',
    '27': '价格类型',
    '29': '工费类型',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '品类'},
    {'KeyId': 3, 'Value': '材质'},
    {'KeyId': 5, 'Value': '成色'},
    {'KeyId': 7, 'Value': '系列'},
    {'KeyId': 9, 'Value': '支付方式'},
    {'KeyId': 11, 'Value': '货品种类'},
    {'KeyId': 13, 'Value': '石类'},
    {'KeyId': 15, 'Value': '大类'},
    {'KeyId': 17, 'Value': '小类'},
    {'KeyId': 19, 'Value': '财务分类'},
    {'KeyId': 21, 'Value': '配件'},
    {'KeyId': 23, 'Value': '石重范围'},
    {'KeyId': 25, 'Value': '工艺类型'},
    {'KeyId': 27, 'Value': '价格类型'},
    {'KeyId': 29, 'Value': '工费类型'}
  ]
}
// 智能导入字段对照的截取方式;
export const SettingAiimportFieldSplitType = {
  'Forward': 1,
  'Backward': 3,
  'Types': {
    '1': '前',
    '3': '后',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '前'},
    {'KeyId': 3, 'Value': '后'}
  ]
}
// 智能导入模板的单据类型;
export const SettingAiimportTempletOrderType = {
  'StockingCloudGoodsIntakeOrderBasic': 1,
  'StockingCloudGoodsAllotOrderOutake': 3,
  'StockingCloudStuffPurchaseOrderBasic': 5,
  'StockingCloudStylePurchaseOrderBasic': 7,
  'StockingCloudGoodsArriveOrderBasic': 9,
  'StockingCloudHalfIntakeOrderBasic': 11,
  'StockingCloudHalfChangeOrderBasic': 13,
  'StockingCloudStuffIntakeOrderBasic': 15,
  'Types': {
    '1': '成品进货入库',
    '3': '成品调拨出库单',
    '5': '原料订货单',
    '7': '成品订货单',
    '9': '成品到货单',
    '11': '半成品整包入库单',
    '13': '半成品分秤',
    '15': '原料进货入库单',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '成品进货入库'},
    {'KeyId': 3, 'Value': '成品调拨出库单'},
    {'KeyId': 5, 'Value': '原料订货单'},
    {'KeyId': 7, 'Value': '成品订货单'},
    {'KeyId': 9, 'Value': '成品到货单'},
    {'KeyId': 11, 'Value': '半成品整包入库单'},
    {'KeyId': 13, 'Value': '半成品分秤'},
    {'KeyId': 15, 'Value': '原料进货入库单'}
  ]
}
// 单据自定义字段的单据类型(单据自定义字段/计算公式);
export const SettingCustomizedFieldOrderType = {
  'StockingCloudGoodsIntakeOrderBasic': 1,
  'StockingCloudGoodsArriveOrderBasic': 3,
  'StockingCloudGoodsQualityOrderBasic1': 5,
  'StockingCloudGoodsQualityOrderBasic2': 7,
  'StockingCloudGoodsQualityOrderBasic3': 9,
  'StockingCloudHalfChangeOrderBasic': 11,
  'StockingCloudJunkChangeOrderBasic': 13,
  'Types': {
    '1': '成品进货入库',
    '3': '成品到货单',
    '5': '成品质检',
    '7': '成品资料完善',
    '9': '成品核价',
    '11': '半成品分秤',
    '13': '旧货转成品',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '成品进货入库'},
    {'KeyId': 3, 'Value': '成品到货单'},
    {'KeyId': 5, 'Value': '成品质检'},
    {'KeyId': 7, 'Value': '成品资料完善'},
    {'KeyId': 9, 'Value': '成品核价'},
    {'KeyId': 11, 'Value': '半成品分秤'},
    {'KeyId': 13, 'Value': '旧货转成品'}
  ]
}
// 单据自定义字段的大类类型;
export const SettingCustomizedFieldLargeType = {
  'Order': 1,
  'Goods': 3,
  'Gold': 5,
  'Stone': 7,
  'Part': 9,
  'Types': {
    '1': '单据信息',
    '3': '货品信息',
    '5': '金料信息',
    '7': '石料信息',
    '9': '配件信息',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '单据信息'},
    {'KeyId': 3, 'Value': '货品信息'},
    {'KeyId': 5, 'Value': '金料信息'},
    {'KeyId': 7, 'Value': '石料信息'},
    {'KeyId': 9, 'Value': '配件信息'}
  ]
}
// 单据自定义字段的小类类型(单据自定义字段/货品私密数据设置);
export const SettingCustomizedFieldSmallType = {
  'Basic': 1,
  'MainStone': 3,
  'SlaveStone': 5,
  'Part': 7,
  'Types': {
    '1': '基本信息',
    '3': '主石信息',
    '5': '副石信息',
    '7': '配件信息',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '基本信息'},
    {'KeyId': 3, 'Value': '主石信息'},
    {'KeyId': 5, 'Value': '副石信息'},
    {'KeyId': 7, 'Value': '配件信息'}
  ]
}
// 单据自定义字段的字段类型;
export const SettingCustomizedFieldType = {
  'TextOfTextual': 1,
  'TextOfInteger': 3,
  'SelectOfEnums': 5,
  'TextOfDecimal': 7,
  'TextOfPercent': 9,
  'TextOfDate': 11,
  'Types': {
    '1': '文本',
    '3': '整型',
    '5': '选项',
    '7': '数字',
    '9': '0-1小数',
    '11': '日期',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '文本'},
    {'KeyId': 3, 'Value': '整型'},
    {'KeyId': 5, 'Value': '选项'},
    {'KeyId': 7, 'Value': '数字'},
    {'KeyId': 9, 'Value': '0-1小数'},
    {'KeyId': 11, 'Value': '日期'}
  ]
}
// 单据自定义字段的扩展类型;
export const SettingCustomizedFieldExtenType = {
  'CostPrice': 1,
  'MktPrice': 3,
  'RetailPrice': 5,
  'AppropPrice': 7,
  'WholesalePrice': 9,
  'Types': {
    '1': '成本价',
    '3': '市场价',
    '5': '零售价',
    '7': '调拨价',
    '9': '批发价',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '成本价'},
    {'KeyId': 3, 'Value': '市场价'},
    {'KeyId': 5, 'Value': '零售价'},
    {'KeyId': 7, 'Value': '调拨价'},
    {'KeyId': 9, 'Value': '批发价'}
  ]
}
// 成品入库流程开关设置的单据类型;
export const SettingGoodsIntakeOrderType = {
  'Goods': 1,
  'Half': 3,
  'Junk': 5,
  'Types': {
    '1': '成品入库流程',
    '3': '半成品转成品流程',
    '5': '旧货转成品流程',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '成品入库流程'},
    {'KeyId': 3, 'Value': '半成品转成品流程'},
    {'KeyId': 5, 'Value': '旧货转成品流程'}
  ]
}
// 往来单位资料表的结算方式;
export const PartnerBasicSettleType = {
  'Should': 1,
  'Balance': 3,
  'Types': {
    '1': '按应收应付',
    '3': '按账户余额',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '按应收应付'},
    {'KeyId': 3, 'Value': '按账户余额'}
  ]
}
// 往来单位余额日志的操作类型;
export const PartnerBalanceLogEventType = {
  'Recharge': 1,
  'Cash': 3,
  'GoodsArrive': 5,
  'GoodsIntake': 7,
  'GoodsAllotOutake': 9,
  'GoodsAllotIntake': 11,
  'HalfIntake': 13,
  'HalfReturn': 15,
  'StuffIntake': 17,
  'StuffPurchase': 19,
  'StuffReturn': 21,
  'StylePurchase': 23,
  'JunkAllotIntake': 25,
  'JunkAllotOutake': 27,
  'WeiwStuffSettle': 29,
  'WeiwGjunkSettle': 31,
  'GoodsReturn': 33,
  'Types': {
    '1': '充值',
    '3': '提现',
    '5': '成品到货单',
    '7': '成品进货入库单',
    '9': '成品调拨出库',
    '11': '成品调拨入库',
    '13': '半成品整包入库',
    '15': '半成品退货出库',
    '17': '原料进货入库',
    '19': '原料订货单',
    '21': '原料退货出库',
    '23': '款式订货单',
    '25': '旧货调拨入库',
    '27': '旧货调拨出库',
    '29': '委外加工结算',
    '31': '委外拆卸结算',
    '33': '成品退货出库',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '充值'},
    {'KeyId': 3, 'Value': '提现'},
    {'KeyId': 5, 'Value': '成品到货单'},
    {'KeyId': 7, 'Value': '成品进货入库单'},
    {'KeyId': 9, 'Value': '成品调拨出库'},
    {'KeyId': 11, 'Value': '成品调拨入库'},
    {'KeyId': 13, 'Value': '半成品整包入库'},
    {'KeyId': 15, 'Value': '半成品退货出库'},
    {'KeyId': 17, 'Value': '原料进货入库'},
    {'KeyId': 19, 'Value': '原料订货单'},
    {'KeyId': 21, 'Value': '原料退货出库'},
    {'KeyId': 23, 'Value': '款式订货单'},
    {'KeyId': 25, 'Value': '旧货调拨入库'},
    {'KeyId': 27, 'Value': '旧货调拨出库'},
    {'KeyId': 29, 'Value': '委外加工结算'},
    {'KeyId': 31, 'Value': '委外拆卸结算'},
    {'KeyId': 33, 'Value': '成品退货出库'}
  ]
}
// 财务应收付款单的应收付类型;
export const SettleIOBillBasicBillType = {
  'Receipt': 1,
  'Paid': 3,
  'Types': {
    '1': '应收款单',
    '3': '应付款单',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '应收款单'},
    {'KeyId': 3, 'Value': '应付款单'}
  ]
}
// 财务应收付款单的来源单类型;
export const SettleIOBillBasicPreviousType = {
  'Manual': 1,
  'GoodsIntakeOrder': 3,
  'GoodsReturnOrder': 5,
  'GoodsAllotOrderOutake': 7,
  'GoodsAllotOrderIntake': 9,
  'StylePurchaseOrder': 11,
  'JunkAllotOrderOutake': 13,
  'JunkAllotOrderIntake': 15,
  'WeiwGjunkSettleOrder': 17,
  'WeiwStuffSettleOrder': 19,
  'WeiwGjunkSplitOrder': 21,
  'WeiwStuffSendOrder': 23,
  'StuffPurchaseOrder': 25,
  'GoodsArriveOrder': 27,
  'HalfIntakeOrder': 29,
  'HalfReturnOrder': 31,
  'StuffIntakeOrder': 33,
  'StuffReturnOrder': 35,
  'Types': {
    '1': '手工创建',
    '3': '成品入库单',
    '5': '成品退货单',
    '7': '成品调拨出库单',
    '9': '成品调拨入库单',
    '11': '款式订货单',
    '13': '旧货调拨出库单',
    '15': '旧货调拨入库单',
    '17': '委外拆卸结算单',
    '19': '委外加工结算单',
    '21': '委外拆卸单',
    '23': '委外加工发料',
    '25': '原料订货单',
    '27': '成品到货单',
    '29': '半成品整包入库单',
    '31': '半成品退货单',
    '33': '原料进货入库单',
    '35': '原料退货出库单',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '手工创建'},
    {'KeyId': 3, 'Value': '成品入库单'},
    {'KeyId': 5, 'Value': '成品退货单'},
    {'KeyId': 7, 'Value': '成品调拨出库单'},
    {'KeyId': 9, 'Value': '成品调拨入库单'},
    {'KeyId': 11, 'Value': '款式订货单'},
    {'KeyId': 13, 'Value': '旧货调拨出库单'},
    {'KeyId': 15, 'Value': '旧货调拨入库单'},
    {'KeyId': 17, 'Value': '委外拆卸结算单'},
    {'KeyId': 19, 'Value': '委外加工结算单'},
    {'KeyId': 21, 'Value': '委外拆卸单'},
    {'KeyId': 23, 'Value': '委外加工发料'},
    {'KeyId': 25, 'Value': '原料订货单'},
    {'KeyId': 27, 'Value': '成品到货单'},
    {'KeyId': 29, 'Value': '半成品整包入库单'},
    {'KeyId': 31, 'Value': '半成品退货单'},
    {'KeyId': 33, 'Value': '原料进货入库单'},
    {'KeyId': 35, 'Value': '原料退货出库单'}
  ]
}
// 财务应收付款单的对象类型;
export const SettleIOBillBasicObjectType = {
  'Company': 1,
  'Store': 3,
  'Partner': 5,
  'Member': 7,
  'Types': {
    '1': '总部',
    '3': '门店',
    '5': '往来单位',
    '7': '会员',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '总部'},
    {'KeyId': 3, 'Value': '门店'},
    {'KeyId': 5, 'Value': '往来单位'},
    {'KeyId': 7, 'Value': '会员'}
  ]
}
// 财务应收付款单的已收付款单状态;
export const SettleIOBillBasicPaidState = {
  'None': 1,
  'Part': 3,
  'All': 5,
  'Types': {
    '1': '未',
    '3': '部分',
    '5': '全部',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '未'},
    {'KeyId': 3, 'Value': '部分'},
    {'KeyId': 5, 'Value': '全部'}
  ]
}
// 财务应收付款单状态;
export const SettleIOBillBasicState = {
  'Invalid': 1,
  'Valid': 3,
  'Types': {
    '1': '无效',
    '3': '有效',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '无效'},
    {'KeyId': 3, 'Value': '有效'}
  ]
}
// 财务已收付款单的已收付款类型;
export const SettleIOBillPaidType = {
  'Receipt': 1,
  'Paid': 3,
  'Types': {
    '1': '已收款单',
    '3': '已付款单',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已收款单'},
    {'KeyId': 3, 'Value': '已付款单'}
  ]
}
// 财务已收付款单状态;
export const SettleIOBillPaidState = {
  'Wait': 1,
  'Audit': 3,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '待确认',
    '3': '已确认',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '待确认'},
    {'KeyId': 3, 'Value': '已确认'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 财务月结单代销明细的单据类型;
export const SettleMonthlyBillAgentOrderType = {
  'Sell': 1,
  'Return': 3,
  'Types': {
    '1': '成品零售单',
    '3': '成品退货单',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '成品零售单'},
    {'KeyId': 3, 'Value': '成品退货单'}
  ]
}
// 财务月结单状态;
export const SettleMonthlyBillBasicState = {
  'Wait': 1,
  'Done': 3,
  'Types': {
    '1': '未结账',
    '3': '已结账',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '未结账'},
    {'KeyId': 3, 'Value': '已结账'}
  ]
}
// 财务月结单加盟明细的单据类型;
export const SettleMonthlyBillJoiningOrderType = {
  'Intake': 1,
  'Outake': 3,
  'Types': {
    '1': '成品调拨入库',
    '3': '成品调拨出库',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '成品调拨入库'},
    {'KeyId': 3, 'Value': '成品调拨出库'}
  ]
}
// 财务月结单单位明细的单位类型;
export const SettleMonthlyBillUnitType = {
  'Joining': 1,
  'Agent': 3,
  'Types': {
    '1': '加盟门店',
    '3': '往来单位',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '加盟门店'},
    {'KeyId': 3, 'Value': '往来单位'}
  ]
}
// 原料调拨入库单状态;
export const StuffAllotOrderIntakeState = {
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Types': {
    '3': '待收货',
    '5': '已收货',
    '7': '已退回',
  },
  'TypeArray': [
    {'KeyId': 3, 'Value': '待收货'},
    {'KeyId': 5, 'Value': '已收货'},
    {'KeyId': 7, 'Value': '已退回'}
  ]
}
// 原料调拨出库单状态;
export const StuffAllotOrderOutakeState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 原料盘点单状态;
export const StuffCountOrderBasicState = {
  'Taking': 1,
  'Finish': 3,
  'Cancel': 9,
  'Types': {
    '1': '正在盘点',
    '3': '已完成',
    '9': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '正在盘点'},
    {'KeyId': 3, 'Value': '已完成'},
    {'KeyId': 9, 'Value': '已取消'}
  ]
}
// 原料损溢单的损溢类型;
export const StuffCountReportBasicReportType = {
  'Loss': 1,
  'Over': 3,
  'Types': {
    '1': '报损',
    '3': '报溢',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '报损'},
    {'KeyId': 3, 'Value': '报溢'}
  ]
}
// 原料损溢单的来源类型;
export const StuffCountReportBasicSourceType = {
  'Manual': 1,
  'Taking': 3,
  'Types': {
    '1': '手工创建',
    '3': '盘点',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '手工创建'},
    {'KeyId': 3, 'Value': '盘点'}
  ]
}
// 原料损溢单状态;
export const StuffCountReportBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 原料进货入库单状态;
export const StuffIntakeOrderBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 原料订货单状态;
export const StuffPurchaseOrderBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 原料退货出库单状态;
export const StuffReturnOrderBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 原料库存变化日志的单据类型;
export const StuffStockLogOrderType = {
  'StuffIntakeOrderBasic': 1,
  'StuffReturnOrderBasic': 3,
  'StuffAllotOrderOutake': 5,
  'StuffAllotOrderIntake': 7,
  'StuffCountReportBasic1': 9,
  'StuffCountReportBasic3': 11,
  'WeiwStuffSendBasic': 13,
  'WeiwStuffReturnBasic': 15,
  'Types': {
    '1': '原料进货入库单',
    '3': '原料退货出库单',
    '5': '原料调拨出库单',
    '7': '原料调拨入库单',
    '9': '原料报损单',
    '11': '原料报溢单',
    '13': '委外加工发料出库单',
    '15': '委外加工退料入库单',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '原料进货入库单'},
    {'KeyId': 3, 'Value': '原料退货出库单'},
    {'KeyId': 5, 'Value': '原料调拨出库单'},
    {'KeyId': 7, 'Value': '原料调拨入库单'},
    {'KeyId': 9, 'Value': '原料报损单'},
    {'KeyId': 11, 'Value': '原料报溢单'},
    {'KeyId': 13, 'Value': '委外加工发料出库单'},
    {'KeyId': 15, 'Value': '委外加工退料入库单'}
  ]
}
// 原料库存变化日志的事件类型;
export const StuffStockLogEventType = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 原料库存变化日志的位置类型;
export const StuffStockLogPositionType = {
  'Warehouse': 1,
  'Shelf': 3,
  'Types': {
    '1': '总部分仓',
    '3': '分仓货架',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '总部分仓'},
    {'KeyId': 3, 'Value': '分仓货架'}
  ]
}
// 款式资料的模版来源;
export const StyleBasicTemplateType = {
  'Inner': 1,
  'Outer': 3,
  'Types': {
    '1': '内部',
    '3': '外部',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '内部'},
    {'KeyId': 3, 'Value': '外部'}
  ]
}
// 款式资料状态;
export const StyleBasicState = {
  'Wait': 1,
  'Done': 3,
  'Types': {
    '1': '未上架',
    '3': '已上架',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '未上架'},
    {'KeyId': 3, 'Value': '已上架'}
  ]
}
// 款式供应商的结算方式;
export const StylePartnerSettleType = {
  'PieceOf': 1,
  'FeeOfGram': 3,
  'FeeOfPiece': 5,
  'Types': {
    '1': '计件',
    '3': '计件(工费按克)',
    '5': '计价(工费按件)',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '计件'},
    {'KeyId': 3, 'Value': '计件(工费按克)'},
    {'KeyId': 5, 'Value': '计价(工费按件)'}
  ]
}
// 款式订货单状态;
export const StylePurchaseOrderBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 款式门店需求单的下单状态;
export const StyleRequireOrderBasicPurchaseXpState = {
  'None': 1,
  'Part': 3,
  'All': 5,
  'Types': {
    '1': '未下单',
    '3': '部分下单',
    '5': '全部下单',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '未下单'},
    {'KeyId': 3, 'Value': '部分下单'},
    {'KeyId': 5, 'Value': '全部下单'}
  ]
}
// 款式门店需求单的分货状态;
export const StyleRequireOrderBasicSplitXpState = {
  'None': 1,
  'Part': 3,
  'All': 5,
  'Types': {
    '1': '未分货',
    '3': '部分分货',
    '5': '全部分货',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '未分货'},
    {'KeyId': 3, 'Value': '部分分货'},
    {'KeyId': 5, 'Value': '全部分货'}
  ]
}
// 款式门店需求单状态;
export const StyleRequireOrderBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 款式门店分货单状态;
export const StyleSplitOrderBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 款式门店分货单需求明细的分货状态;
export const StyleSplitOrderRequireSplitXpState = {
  'None': 1,
  'Part': 3,
  'All': 5,
  'Types': {
    '1': '未分货',
    '3': '部分分货',
    '5': '全部分货',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '未分货'},
    {'KeyId': 3, 'Value': '部分分货'},
    {'KeyId': 5, 'Value': '全部分货'}
  ]
}
// 款式库存的位置类型;
export const StyleStockWarehousePositionType = {
  'Warehouse': 1,
  'Store': 3,
  'Types': {
    '1': '总部分仓',
    '3': '门店',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '总部分仓'},
    {'KeyId': 3, 'Value': '门店'}
  ]
}
// 款式库存的安全库存状态;
export const StyleStockWarehouseSafeState = {
  'Normal': 1,
  'Low': 3,
  'High': 5,
  'Types': {
    '1': '正常',
    '3': '库存太低',
    '5': '库存太高',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '正常'},
    {'KeyId': 3, 'Value': '库存太低'},
    {'KeyId': 5, 'Value': '库存太高'}
  ]
}
// 委外拆卸结算单的来源类型;
export const WeiwGjunkSettleBasicSourceType = {
  'Goods': 1,
  'Junk': 3,
  'Types': {
    '1': '成品委外拆卸',
    '3': '旧货委外拆卸',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '成品委外拆卸'},
    {'KeyId': 3, 'Value': '旧货委外拆卸'}
  ]
}
// 委外拆卸结算单状态;
export const WeiwGjunkSettleBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 委外拆卸单的拆卸类型;
export const WeiwGjunkSplitBasicSplitType = {
  'Goods': 1,
  'Junk': 3,
  'Types': {
    '1': '成品',
    '3': '旧货',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '成品'},
    {'KeyId': 3, 'Value': '旧货'}
  ]
}
// 委外拆卸单状态;
export const WeiwGjunkSplitBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 委外加工退料入库单状态;
export const WeiwStuffReturnBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 委外加工发料出库单状态;
export const WeiwStuffSendBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 委外加工原料结算单的来源类型;
export const WeiwStuffSettleBasicSourceType = {
  'GoodsIntakeOrderBasic': 1,
  'GoodsReturnOrderBasic': 3,
  'HalfIntakeOrderBasic': 5,
  'HalfReturnOrderBasic': 7,
  'Types': {
    '1': '成品入库',
    '3': '成品退货',
    '5': '半成品入库',
    '7': '半成品退货',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '成品入库'},
    {'KeyId': 3, 'Value': '成品退货'},
    {'KeyId': 5, 'Value': '半成品入库'},
    {'KeyId': 7, 'Value': '半成品退货'}
  ]
}
// 委外加工原料结算单状态;
export const WeiwStuffSettleBasicState = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 委外供应商存料库存变化日志的单据类型;
export const WeiwStuffStockLogOrderType = {
  'WeiwGjunkSettleBasic': 1,
  'WeiwStuffSettleBasic': 3,
  'WeiwStuffSendBasic': 5,
  'WeiwStuffReturnBasic': 7,
  'StuffIntakeOrderBasic': 9,
  'Types': {
    '1': '委外拆卸结算',
    '3': '委外加工结算',
    '5': '委外加工发料',
    '7': '委外加工退料',
    '9': '原料进货入库',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '委外拆卸结算'},
    {'KeyId': 3, 'Value': '委外加工结算'},
    {'KeyId': 5, 'Value': '委外加工发料'},
    {'KeyId': 7, 'Value': '委外加工退料'},
    {'KeyId': 9, 'Value': '原料进货入库'}
  ]
}
// 委外供应商存料库存变化日志的事件类型;
export const WeiwStuffStockLogEventType = {
  'Draft': 1,
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '草稿'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '审核通过'},
    {'KeyId': 7, 'Value': '审核退回'},
    {'KeyId': 9, 'Value': '已作废'},
    {'KeyId': 11, 'Value': '已取消'}
  ]
}
// 库存比较类型;
export const StockCompareType = {
  'AvailableQtyThanZero': 1,
  'AvailableQtyEqualZero': 3,
  'FinanceQtyThanZero': 5,
  'FinanceQtyEqualZero': 7,
  'Types': {
    '1': '可用库存>0',
    '3': '可用库存=0',
    '5': '账面库存>0',
    '7': '账面库存=0',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '可用库存>0'},
    {'KeyId': 3, 'Value': '可用库存=0'},
    {'KeyId': 5, 'Value': '账面库存>0'},
    {'KeyId': 7, 'Value': '账面库存=0'}
  ]
}
// 成品采购报表汇总项;
export const GoodsIntakeOrderBasicReportItems = {
  'FinanceType': 1,
  'MaterialType': 3,
  'CategoryType': 5,
  'GoldType': 7,
  'LargeClassTypeEk': 9,
  'SmallClassTypeEk': 11,
  'FinanceClassTypeEk': 13,
  'Types': {
    '1': '货品种类',
    '3': '材质',
    '5': '品类',
    '7': '成色',
    '9': '大类',
    '11': '小类',
    '13': '财务分类',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '货品种类'},
    {'KeyId': 3, 'Value': '材质'},
    {'KeyId': 5, 'Value': '品类'},
    {'KeyId': 7, 'Value': '成色'},
    {'KeyId': 9, 'Value': '大类'},
    {'KeyId': 11, 'Value': '小类'},
    {'KeyId': 13, 'Value': '财务分类'}
  ]
}
// 半成品采购报表汇总项;
export const HalfIntakeOrderBasicReportItems = {
  'KindTypeEk': 1,
  'CategoryType': 3,
  'GoldType': 5,
  'Types': {
    '1': '货品种类',
    '3': '品类',
    '5': '成色',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '货品种类'},
    {'KeyId': 3, 'Value': '品类'},
    {'KeyId': 5, 'Value': '成色'}
  ]
}
// 库存报表看板类型;
export const StockBoardType = {
  'Store': 1,
  'Company': 3,
  'Group': 5,
  'Types': {
    '1': '门店',
    '3': '总部',
    '5': '集团',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '门店'},
    {'KeyId': 3, 'Value': '总部'},
    {'KeyId': 5, 'Value': '集团'}
  ]
}
// 库存报表看板位置;
export const StockPositionTypeType = {
  'All': 0,
  'WareHouse': 1,
  'Company': 3,
  'Store': 5,
  'AllStore': 7,
  'GroupTypeDk': 9,
  'UnGroupTypeDk': 11,
  'AllShelf': 13,
  'Types': {
    '0': '所有位置',
    '1': '仓库',
    '3': '公司',
    '5': '门店',
    '7': '所有门店',
    '9': '柜台分组',
    '11': '柜台未分组',
    '13': '所有货架',
  },
  'TypeArray': [
    {'KeyId': 0, 'Value': '所有位置'},
    {'KeyId': 1, 'Value': '仓库'},
    {'KeyId': 3, 'Value': '公司'},
    {'KeyId': 5, 'Value': '门店'},
    {'KeyId': 7, 'Value': '所有门店'},
    {'KeyId': 9, 'Value': '柜台分组'},
    {'KeyId': 11, 'Value': '柜台未分组'},
    {'KeyId': 13, 'Value': '所有货架'}
  ]
}
// 库存汇总项;
export const GoodsStockCollectionReportItems = {
  'PositionType': 1,
  'WarehouseOrStore': 3,
  'DeskId': 5,
  'MaterialType': 7,
  'Brand': 9,
  'CategoryType': 11,
  'GoldType': 13,
  'RetailType': 15,
  'FinanceType': 17,
  'Types': {
    '1': '位置(分组)',
    '3': '仓库/门店',
    '5': '柜台',
    '7': '材质',
    '9': '品牌',
    '11': '品类',
    '13': '成色',
    '15': '销售方式',
    '17': '入库类别',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '位置(分组)'},
    {'KeyId': 3, 'Value': '仓库/门店'},
    {'KeyId': 5, 'Value': '柜台'},
    {'KeyId': 7, 'Value': '材质'},
    {'KeyId': 9, 'Value': '品牌'},
    {'KeyId': 11, 'Value': '品类'},
    {'KeyId': 13, 'Value': '成色'},
    {'KeyId': 15, 'Value': '销售方式'},
    {'KeyId': 17, 'Value': '入库类别'}
  ]
}
// 货品销售状态;
export const GoodsSaleState = {
  'UnSold': 1,
  'Solding': 3,
  'Sold': 5,
  'Types': {
    '1': '未销售',
    '3': '销售中',
    '5': '已售罄',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '未销售'},
    {'KeyId': 3, 'Value': '销售中'},
    {'KeyId': 5, 'Value': '已售罄'}
  ]
}
// 库龄报表位置;
export const ReportStockQtyDuratsPositionType = {
  'ALL': 0,
  'WareHouse': 1,
  'Company': 3,
  'AllShop': 5,
  'Types': {
    '0': '所有位置',
    '1': '仓库',
    '3': '公司',
    '5': '所有门店',
  },
  'TypeArray': [
    {'KeyId': 0, 'Value': '所有位置'},
    {'KeyId': 1, 'Value': '仓库'},
    {'KeyId': 3, 'Value': '公司'},
    {'KeyId': 5, 'Value': '所有门店'}
  ]
}
// 库存周转情况;
export const ReportStockTurnType = {
  'ALL': 0,
  'HighTurn': 1,
  'LowTurn': 3,
  'NotTurn': 5,
  'Types': {
    '0': '所有情况',
    '1': '高周转',
    '3': '低周转',
    '5': '未周转',
  },
  'TypeArray': [
    {'KeyId': 0, 'Value': '所有情况'},
    {'KeyId': 1, 'Value': '高周转'},
    {'KeyId': 3, 'Value': '低周转'},
    {'KeyId': 5, 'Value': '未周转'}
  ]
}
// 库存周转状态;
export const ReportStockTurnStatus = {
  'ALL': 0,
  'Effective': 1,
  'UnEffective': 3,
  'Types': {
    '0': '所有状态 ',
    '1': '有效库存',
    '3': '无效库存',
  },
  'TypeArray': [
    {'KeyId': 0, 'Value': '所有状态 '},
    {'KeyId': 1, 'Value': '有效库存'},
    {'KeyId': 3, 'Value': '无效库存'}
  ]
}
// 财务报表类型;
export const SettleBudgetBillType = {
  'Daily': 1,
  'Weekly': 3,
  'Monthly': 5,
  'Quarterly': 7,
  'Yearly': 9,
  'Types': {
    '1': '收支日报',
    '3': '收支周报',
    '5': '收支月报',
    '7': '收支季报',
    '9': '收支年报',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '收支日报'},
    {'KeyId': 3, 'Value': '收支周报'},
    {'KeyId': 5, 'Value': '收支月报'},
    {'KeyId': 7, 'Value': '收支季报'},
    {'KeyId': 9, 'Value': '收支年报'}
  ]
}