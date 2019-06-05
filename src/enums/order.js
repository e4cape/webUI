// 零售单的事件类型;
export const RetailOrderMasterActionType = {
  'Cart': 1,
  'Retail': 3,
  'Types': {
    '1': '挂单',
    '3': '零售单',
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '挂单' },
    { 'KeyId': '3', 'Value': '零售单' }
  ]
}
// 零售单的终端类型;
export const RetailOrderMasterTerminalType = {
  'Cashier': 1,
  'Wechat': 3,
  'Website': 5,
  'WxApplet': 7,
  'Types': {
    '1': '收银台',
    '3': '微信端',
    '5': 'PC端',
    '7': '小程序',
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '收银台' },
    { 'KeyId': '3', 'Value': '微信端' },
    { 'KeyId': '5', 'Value': 'PC端' },
    { 'KeyId': '7', 'Value': '小程序' }
  ]
}
// 零售单的支付状态;
export const RetailOrderMasterPayState = {
  'NoneOf': 1,
  'PartOf': 3,
  'AllOf': 5,
  'Types': {
    '1': '尚未支付',
    '3': '部分支付',
    '5': '全部支付',
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '尚未支付' },
    { 'KeyId': '3', 'Value': '部分支付' },
    { 'KeyId': '5', 'Value': '全部支付' }
  ]
}
// 零售单状态;
export const RetailOrderMasterState = {
  'Wait': 3,
  'Audit': 5,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '3': '待审核',
    '5': '已审核',
    '9': '已作废',
    '11': '已取消',
  },
  'TypeArray': [
    { 'KeyId': '3', 'Value': '待审核' },
    { 'KeyId': '5', 'Value': '已审核' },
    { 'KeyId': '9', 'Value': '已作废' },
    { 'KeyId': '11', 'Value': '已取消' }
  ]
}
// 零售单的新品子单的退货状态;
export const RetailOrderSellBasicReturnState = {
  'NoneOfRma': 1,
  'ReturnOrder': 3,
  'Types': {
    '1': '未退货',
    '3': '已退货',
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '未退货' },
    { 'KeyId': '3', 'Value': '已退货' }
  ]
}
// 零售单的新品子单的商品来源;
export const RetailOrderSellProductSourceType = {
  'Marketing': 1,
  'Manual': 3,
  'Stocking': 5,
  'Types': {
    '1': '营销商品库',
    '3': '手工补录',
    '5': 'ERP货品库',
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '营销商品库' },
    { 'KeyId': '3', 'Value': '手工补录' },
    { 'KeyId': '5', 'Value': 'ERP货品库' }
  ]
}
// 退货单的来源;
export const RetailOrderReturnSourceType = {
  'Cashier': 1,
  'Manual': 3,
  'Types': {
    '1': '收银台',
    '3': '手工补录',
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '收银台' },
    { 'KeyId': '3', 'Value': '手工补录' }
  ]
}
// 零售单的新品子单类型;
export const RetailOrderSellBasicSellType = {
  'RetailOrder': 1,
  'SpreadOrder': 3,
  'GiftOrder': 5,
  'Types': {
    '1': '零售单',
    '3': '活动订单',
    '5': '礼品订单',
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '零售单' },
    { 'KeyId': '3', 'Value': '活动订单' },
    { 'KeyId': '5', 'Value': '礼品订单' }
  ]
}
// 零售单的新品子单的卡券类型;
export const RetailOrderSellSettleCouponType = {
  'Agrece': 1,
  'Agitate': 3,
  'Gond': 5,
  'Equiv': 7,
  'Types': {
    '1': '鼓励金',
    '3': '置换金',
    '5': '购物金',
    '7': '抵用金',
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '鼓励金' },
    { 'KeyId': '3', 'Value': '置换金' },
    { 'KeyId': '5', 'Value': '购物金' },
    { 'KeyId': '7', 'Value': '抵用金' }
  ]
}
// 零售单的新品子单的支付类型;
export const RetailOrderSellSettlePayingType = {
  'Cash': 1,
  'Card': 3,
  'Types': {
    '1': '现款支付',
    '3': '卡券支付',
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '现款支付' },
    { 'KeyId': '3', 'Value': '卡券支付' }
  ]
}
// 零售单的新品子单的优惠券类型;
export const RetailOrderSellSettleTicketType = {
  'WalletCoupon': 1,
  'CardActivity': 3,
  'QueueReceiveGold': 4,
  'Types': {
    '1': '营销卡券',
    '3': '积分卡券',
    '4': '排队黄金卡券',
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '营销卡券' },
    { 'KeyId': '3', 'Value': '积分卡券' },
    { 'KeyId': '4', 'Value': '排队黄金卡券' }
  ]
}
// 零售单的新品子单的收益类型;
export const RetailOrderSellSettleProfitType = {
  'ProductPrice': 1,
  'CashPrice': 3,
  'Types': {
    '1': '按应付金额赠送',
    '3': '按实付金额赠送',
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '按应付金额赠送' },
    { 'KeyId': '3', 'Value': '按实付金额赠送' }
  ]
}
// 零售单的旧货子单的来源类型;
export const RetailOrderBackProductSourceType = {
  'Coupon': 1,
  'Manual': 3,
  'Types': {
    '1': '卡券换购',
    '3': '手工创建',
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '卡券换购' },
    { 'KeyId': '3', 'Value': '手工创建' }
  ]
}
// 零售单的退货子单状态;
export const RetailOrderReturnState = {
  'Wait': 3,
  'Audit': 5,
  'Abandon': 19,
  'Types': {
    '3': '待审核',
    '5': '审核通过',
    '19': '已作废',
  },
  'TypeArray': [
    { 'KeyId': '3', 'Value': '待审核' },
    { 'KeyId': '5', 'Value': '审核通过' },
    { 'KeyId': '19', 'Value': '已作废' }
  ]
}
// 库存变化类型;
export const StockChangeType = {
  'WaitOut': 1,
  'WaitOutToOut': 3,
  'WaitOutToBack': 5,
  'RmaSaleOrderAuditIn': 7,
  'SaleOrderCancelIn': 9,
  'Types': {
    '1': '待出库',
    '3': '待出库->出库',
    '5': '待出库->入库',
    '7': '入库',
    '9': '入库',
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '待出库' },
    { 'KeyId': '3', 'Value': '待出库->出库' },
    { 'KeyId': '5', 'Value': '待出库->入库' },
    { 'KeyId': '7', 'Value': '入库' },
    { 'KeyId': '9', 'Value': '入库' }
  ]
}
// 系统订单类型;
export const SystemOrderType = {
  'StockingCloudPurchaseOrder': 1,
  'StockingCloudReturnOrder': 3,
  'StockingCloudTakingOrder': 5,
  'StockingCloudPriceOrder': 7,
  'StockingCloudSaleOrder': 9,
  'StockingCloudRmaReturnOrder': 11,
  'StockingCloudDeskOrder1': 13,
  'StockingCloudDeskOrder3': 15,
  'StockingCloudTakingReport1': 17,
  'StockingCloudTakingReport3': 19,
  'StockingCloudFinanceBillBasic1': 21,
  'StockingCloudFinanceBillBasic3': 23,
  'StockingCloudFinanceBillPaid1': 25,
  'StockingCloudFinanceBillPaid3': 27,
  'StockingCloudPrintOrder': 29,
  'StockingCloudModifyOrder': 31,
  'StockingCloudJunkChangeOrder': 33,
  'StockingCloudJunkOutOrder': 35,
  'StockingCloudAppropOrder': 37,
  'StockingCloudJunkInnOrder': 39,
  'StockingCloudJunkModifyOrder': 41,
  'StockingCloudJunkPrintOrder': 43,
  'StockingCloudReinfPlanOrder': 45,
  'StockingCloudRmaRepairOrder': 47,
  'Types': {
    '1': 'ERP的成品采购入库单',
    '3': 'ERP的成品退货出库单',
    '5': 'ERP的盘点单',
    '7': 'ERP的成品调价单',
    '9': 'ERP的零售单',
    '11': 'ERP的售后退货单',
    '13': 'ERP的柜台领货单',
    '15': 'ERP的柜台退货单',
    '17': 'ERP的报损单',
    '19': 'ERP的报溢单',
    '21': 'ERP的应收款单',
    '23': 'ERP的应付款单',
    '25': 'ERP的收款单',
    '27': 'ERP的付款单',
    '29': '打印',
    '31': '批量修改单',
    '33': '旧货转换成品',
    '35': '旧货出库单',
    '37': '成品调拨单',
    '39': '旧货入库单',
    '41': '旧货修改单',
    '43': '旧货打印单',
    '45': '智能配货计划单',
    '47': 'ERP的维修单',
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': 'ERP的成品采购入库单' },
    { 'KeyId': '3', 'Value': 'ERP的成品退货出库单' },
    { 'KeyId': '5', 'Value': 'ERP的盘点单' },
    { 'KeyId': '7', 'Value': 'ERP的成品调价单' },
    { 'KeyId': '9', 'Value': 'ERP的零售单' },
    { 'KeyId': '11', 'Value': 'ERP的售后退货单' },
    { 'KeyId': '13', 'Value': 'ERP的柜台领货单' },
    { 'KeyId': '15', 'Value': 'ERP的柜台退货单' },
    { 'KeyId': '17', 'Value': 'ERP的报损单' },
    { 'KeyId': '19', 'Value': 'ERP的报溢单' },
    { 'KeyId': '21', 'Value': 'ERP的应收款单' },
    { 'KeyId': '23', 'Value': 'ERP的应付款单' },
    { 'KeyId': '25', 'Value': 'ERP的收款单' },
    { 'KeyId': '27', 'Value': 'ERP的付款单' },
    { 'KeyId': '29', 'Value': '打印' },
    { 'KeyId': '31', 'Value': '批量修改单' },
    { 'KeyId': '33', 'Value': '旧货转换成品' },
    { 'KeyId': '35', 'Value': '旧货出库单' },
    { 'KeyId': '37', 'Value': '成品调拨单' },
    { 'KeyId': '39', 'Value': '旧货入库单' },
    { 'KeyId': '41', 'Value': '旧货修改单' },
    { 'KeyId': '43', 'Value': '旧货打印单' },
    { 'KeyId': '45', 'Value': '智能配货计划单' },
    { 'KeyId': '47', 'Value': 'ERP的维修单' }
  ]
}
// 花呗分期手续费承担类型;
export const ChargesType = {
  'Merchant': 1,
  'Customer': 3,
  'Types': {
    '1': '商户承担',
    '3': '客户承担',
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '商户承担' },
    { 'KeyId': '3', 'Value': '客户承担' }
  ]
}
// 积分类型(兑换方式,1积分,2礼金,按位运算));
export const ScoreTypes = {
  'Score': 1,
  'GoldenRice': 2,
  'Types': {
    '1': '积分',
    '2': '礼金',
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '积分' },
    { 'KeyId': '2', 'Value': '礼金' }
  ]
}
// 支付类型 0=实付 ,1=应付 ,2=固定值;
export const GiveTypes = {
  'OrderPrice': 0,
  'ActualPrice': 1,
  'Fixed': 2,
  'Types': {
    '0': '应付',
    '1': '实付',
    '2': '固定值',
  },
  'TypeArray': [
    { 'KeyId': '0', 'Value': '应付' },
    { 'KeyId': '1', 'Value': '实付' },
    { 'KeyId': '2', 'Value': '固定值' }
  ]
}