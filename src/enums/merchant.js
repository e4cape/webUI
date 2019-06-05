// 商户基本资料的挂载位置;
export const CompanyBasicMountType = {
  'Company': 1,
  'Store': 3,
  'Types': {
    '1': '商户总部',
    '3': '门店设置',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '商户总部'
    },
    {
      'KeyId': 3,
      'Value': '门店设置'
    }
  ]
}
// 商户基本资料的注册来源类型;
export const CompanyBasicSourceType = {
  'Lcb': 1,
  'Official': 3,
  'Group': 5,
  'Types': {
    '1': '平台创建',
    '3': '官网注册',
    '5': '集团创建',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '平台创建'
    },
    {
      'KeyId': 3,
      'Value': '官网注册'
    },
    {
      'KeyId': 5,
      'Value': '集团创建'
    }
  ]
}
// 集团商户关联表的关联类型;
export const GroupCompanyMapType = {
  'Create': 1,
  'Relation': 3,
  'Types': {
    '1': '自建',
    '3': '关联',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '自建'
    },
    {
      'KeyId': 3,
      'Value': '关联'
    }
  ]
}
// 下载任务的来源类型;
export const SecurityDownloadSourceType = {
  'GoodsStockByGoodsBasic': 1,
  'GoodsStockByResult': 2,
  'GoodsStockQtyLogByResult': 3,
  'GoodsIntakeByGoodsBasic': 4,
  'GoodsStockItemByResult': 5,
  'GoodsStockChartByStockAgeByResult': 6,
  'GoodsStockChartByBestSellByResult': 7,
  'GoodsSaleItemByResult': 8,
  'GoodsProfitItemByResult': 9,
  'SecurityUserByResult': 10,
  'JunkBasicByResult': 11,
  'SettleBudgetByResult': 15,
  'SettleMonthlyByBillPaid': 16,
  'SettleMonthlyByBillAgent': 17,
  'SettleMonthlyByBillJoining': 18,
  'ReinfSuggestByResult': 19,
  'SpreadSaleOrderListByResult': 21,
  'StuffStockByResult': 22,
  'StyleRequireOrderByResult': 23,
  'WeiwStuffStockByResult': 24,
  'HalfStockByResult': 25,
  'GoodsQualityOrderItemByResult': 26,
  'HalfIntakeOrderItemByResult': 27,
  'HalfIntakeOrderItemByHalfBasic': 28,
  'HalfChangeOrderGoodsByResult': 29,
  'HalfReturnOrderItemByHalfBasic': 30,
  'GoodsRepairOrderBasicByResult': 31,
  'GoodsPriceOrderItemByResult': 32,
  'StuffIntakeOrderItemByResult': 33,
  'StuffReturnOrderItemByResult': 34,
  'ReinfSuggestGetsByResult': 35,
  'GoodsReinfPlanItemGetsByResult': 36,
  'Types': {
    '1': '成品库存(货品信息)',
    '2': '成品库存(查询结果)',
    '3': '成品库存出入库日志(查询结果)',
    '4': '成品采购(货品信息)',
    '5': '库存明细(查询结果)',
    '6': '库龄报表(查询结果)',
    '7': '库存周转报表(查询结果)',
    '8': '销售报表(销售明细)',
    '9': '利润报表(利润明细)',
    '10': '员工列表(查询结果)',
    '11': '旧货列表(查询结果)',
    '15': '财务报表',
    '16': '财务月结',
    '17': '财务月结',
    '18': '财务月结',
    '19': '智能配货建议',
    '21': '活动订单列表(查询结果)',
    '22': '原料库存',
    '23': '款式需求单',
    '24': '供应商原料库存',
    '25': '半成品库存',
    '26': '成品质检',
    '27': '半成品质检',
    '28': '半成品整包入库(货品详情)',
    '29': '半成品分秤(货品详情)',
    '30': '半成品退货出库(货品详情)',
    '31': '成品维修单',
    '32': '成品零售调价',
    '33': '原料进货入库(货品详情)',
    '34': '原料退货出库(货品详情)',
    '35': '配货建议',
    '36': '配货计划(货品详情)',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '成品库存(货品信息)'
    },
    {
      'KeyId': 2,
      'Value': '成品库存(查询结果)'
    },
    {
      'KeyId': 3,
      'Value': '成品库存出入库日志(查询结果)'
    },
    {
      'KeyId': 4,
      'Value': '成品采购(货品信息)'
    },
    {
      'KeyId': 5,
      'Value': '库存明细(查询结果)'
    },
    {
      'KeyId': 6,
      'Value': '库龄报表(查询结果)'
    },
    {
      'KeyId': 7,
      'Value': '库存周转报表(查询结果)'
    },
    {
      'KeyId': 8,
      'Value': '销售报表(销售明细)'
    },
    {
      'KeyId': 9,
      'Value': '利润报表(利润明细)'
    },
    {
      'KeyId': 10,
      'Value': '员工列表(查询结果)'
    },
    {
      'KeyId': 11,
      'Value': '旧货列表(查询结果)'
    },
    {
      'KeyId': 15,
      'Value': '财务报表'
    },
    {
      'KeyId': 16,
      'Value': '财务月结'
    },
    {
      'KeyId': 17,
      'Value': '财务月结'
    },
    {
      'KeyId': 18,
      'Value': '财务月结'
    },
    {
      'KeyId': 19,
      'Value': '智能配货建议'
    },
    {
      'KeyId': 21,
      'Value': '活动订单列表(查询结果)'
    },
    {
      'KeyId': 22,
      'Value': '原料库存'
    },
    {
      'KeyId': 23,
      'Value': '款式需求单'
    },
    {
      'KeyId': 24,
      'Value': '供应商原料库存'
    },
    {
      'KeyId': 25,
      'Value': '半成品库存'
    },
    {
      'KeyId': 26,
      'Value': '成品质检'
    },
    {
      'KeyId': 27,
      'Value': '半成品质检'
    },
    {
      'KeyId': 28,
      'Value': '半成品整包入库(货品详情)'
    },
    {
      'KeyId': 29,
      'Value': '半成品分秤(货品详情)'
    },
    {
      'KeyId': 30,
      'Value': '半成品退货出库(货品详情)'
    },
    {
      'KeyId': 31,
      'Value': '成品维修单'
    },
    {
      'KeyId': 32,
      'Value': '成品零售调价'
    },
    {
      'KeyId': 33,
      'Value': '原料进货入库(货品详情)'
    },
    {
      'KeyId': 34,
      'Value': '原料退货出库(货品详情)'
    },
    {
      'KeyId': 35,
      'Value': '配货建议'
    },
    {
      'KeyId': 36,
      'Value': '配货计划(货品详情)'
    }
  ]
}
// 下载任务的下载状态;
export const SecurityDownloadState = {
  'Wait': 1,
  'Done': 3,
  'Fail': 5,
  'Types': {
    '1': '正在导出',
    '3': '导出完成',
    '5': '导出失败',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '正在导出'
    },
    {
      'KeyId': 3,
      'Value': '导出完成'
    },
    {
      'KeyId': 5,
      'Value': '导出失败'
    }
  ]
}
// 系统设置通用的终端类型;
export const SecurityTerminalType = {
  'Web': 1,
  'App': 3,
  'Types': {
    '1': 'PC端',
    '3': 'APP端',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': 'PC端'
    },
    {
      'KeyId': 3,
      'Value': 'APP端'
    }
  ]
}
// 增值服务套餐的门店类型;
export const SecurityPackBasicMultiType = {
  'More': 3,
  'One': 1,
  'Types': {
    '3': '一号多店',
    '1': '一号一店',
  },
  'TypeArray': [{
      'KeyId': 3,
      'Value': '一号多店'
    },
    {
      'KeyId': 1,
      'Value': '一号一店'
    }
  ]
}
// 增值服务套餐的套餐类型;
export const SecurityPackType = {
  'Inner': 1,
  'Outer': 3,
  'Types': {
    '1': '内部',
    '3': '外部',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '内部'
    },
    {
      'KeyId': 3,
      'Value': '外部'
    }
  ]
}
// 增值服务套餐之系统的系统类型;
export const SecurityPackSystemType = {
  'Inner': 1,
  'Outer': 3,
  'Types': {
    '1': '内部',
    '3': '外部',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '内部'
    },
    {
      'KeyId': 3,
      'Value': '外部'
    }
  ]
}
// 角色的登录认证类型;
export const SecurityRoleAuthType = {
  'None': 1,
  'Message': 3,
  'Types': {
    '1': '不认证',
    '3': '短信',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '不认证'
    },
    {
      'KeyId': 3,
      'Value': '短信'
    }
  ]
}
// 用户账号的微信端角色类型;
export const SecurityUserBerthType = {
  'Employee': 1,
  'Master': 3,
  'Administrator': 5,
  'Types': {
    '1': '店员',
    '3': '店长',
    '5': '超级管理员',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '店员'
    },
    {
      'KeyId': 3,
      'Value': '店长'
    },
    {
      'KeyId': 5,
      'Value': '超级管理员'
    }
  ]
}
// 用户账号的收银台角色类型;
export const SecurityUserCashierType = {
  'Employee': 1,
  'Cashier': 3,
  'Other': 9,
  'Types': {
    '1': '导购',
    '3': '收银员',
    '9': '其他',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '导购'
    },
    {
      'KeyId': 3,
      'Value': '收银员'
    },
    {
      'KeyId': 9,
      'Value': '其他'
    }
  ]
}
// 用户账号的在职状态;
export const SecurityUserVitaState = {
  'Try': 1,
  'Official': 3,
  'Leaved': 5,
  'Types': {
    '1': '试用',
    '3': '正式',
    '5': '离职',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '试用'
    },
    {
      'KeyId': 3,
      'Value': '正式'
    },
    {
      'KeyId': 5,
      'Value': '离职'
    }
  ]
}
// 用户账号的账户状态;
export const SecurityUserState = {
  'Abandon': 1,
  'Wait': 3,
  'Audit': 5,
  'Types': {
    '1': '已作废',
    '3': '待审核',
    '5': '已审核',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '已作废'
    },
    {
      'KeyId': 3,
      'Value': '待审核'
    },
    {
      'KeyId': 5,
      'Value': '已审核'
    }
  ]
}
// 门店基本资料的销售方式;
export const StoreBasicBusinessType = {
  'Retail': 10,
  'Wholesale': 30,
  'All': 20,
  'Types': {
    '10': '零售',
    '30': '批发',
    '20': '零售+批发',
  },
  'TypeArray': [{
      'KeyId': 10,
      'Value': '零售'
    },
    {
      'KeyId': 30,
      'Value': '批发'
    },
    {
      'KeyId': 20,
      'Value': '零售+批发'
    }
  ]
}
// 门店基本资料的主营品类;
export const StoreBasicFlagshipType = {
  'Flagship01': 1,
  'Flagship02': 2,
  'Flagship03': 3,
  'Flagship04': 4,
  'Flagship05': 5,
  'Flagship06': 6,
  'Flagship07': 7,
  'Types': {
    '1': '黄金',
    '2': '钻石',
    '3': '翡翠',
    '4': '珍珠',
    '5': '琥珀',
    '6': '铂金',
    '7': '其它',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '黄金'
    },
    {
      'KeyId': 2,
      'Value': '钻石'
    },
    {
      'KeyId': 3,
      'Value': '翡翠'
    },
    {
      'KeyId': 4,
      'Value': '珍珠'
    },
    {
      'KeyId': 5,
      'Value': '琥珀'
    },
    {
      'KeyId': 6,
      'Value': '铂金'
    },
    {
      'KeyId': 7,
      'Value': '其它'
    }
  ]
}
// 门店基本资料的门店状态;
export const StoreBasicState = {
  'Close': 1,
  'Open': 3,
  'Types': {
    '1': '已停业',
    '3': '已开业',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '已停业'
    },
    {
      'KeyId': 3,
      'Value': '已开业'
    }
  ]
}
// 单号规则与审核的单据类型;
export const SettingGenerateType = {
  'StockingCloudGoodsIntakeOrderBasic': 1,
  'StockingCloudGoodsReturnOrderBasic': 3,
  'StockingCloudGoodsCountOrderBasic': 5,
  'StockingCloudGoodsPriceOrderBasic': 7,
  'StockingCloudSaleOrder': 9,
  'StockingCloudRmaReturnOrder': 11,
  'StockingCloudDeskPickretOrderBasic1': 13,
  'StockingCloudDeskPickretOrderBasic3': 15,
  'StockingCloudGoodsCountReportBasic1': 17,
  'StockingCloudGoodsCountReportBasic3': 19,
  'StockingCloudSettleIOBillBasic1': 21,
  'StockingCloudSettleIOBillBasic3': 23,
  'StockingCloudSettleIOBillPaid1': 25,
  'StockingCloudSettleIOBillPaid3': 27,
  'StockingCloudGoodsPrintOrderBasic': 29,
  'StockingCloudGoodsModifyOrderBasic': 31,
  'StockingCloudJunkChangeOrderBasic': 33,
  'StockingCloudJunkOutakeOrderBasic': 35,
  'StockingCloudGoodsAllotOrderOutake': 37,
  'StockingCloudGoodsAllotOrderIntake': 38,
  'StockingCloudJunkInnOrder': 39,
  'StockingCloudJunkModifyOrder': 41,
  'StockingCloudJunkPrintOrderBasic': 43,
  'StockingCloudGoodsReinfPlanBasic': 45,
  'StockingCloudGoodsRepairOrderBasic': 47,
  'StockingCloudJunkAllotOrderOutake': 49,
  'StockingCloudJunkAllotOrderIntake': 51,
  'StockingCloudStuffPurchaseOrderBasic': 53,
  'StockingCloudStylePurchaseOrderBasic': 55,
  'StockingCloudGoodsArriveOrderBasic': 57,
  'StockingCloudHalfIntakeOrderBasic': 59,
  'StockingCloudHalfChangeOrderBasic': 61,
  'StockingCloudStuffIntakeOrderBasic': 63,
  'StockingCloudGoodsQualityOrderBasic': 65,
  'StockingCloudStyleRequireOrderBasic': 67,
  'StockingCloudStyleSplitOrderBasic': 69,
  'StockingCloudSettleMonthlyBillBasic': 71,
  'StockingCloudWeiwGjunkSettleBasic': 73,
  'StockingCloudWeiwGjunkSplitBasic': 75,
  'StockingCloudWeiwStuffReturnBasic': 77,
  'StockingCloudWeiwStuffSendBasic': 79,
  'StockingCloudWeiwStuffSettleBasic': 81,
  'StockingCloudHalfCountOrderBasic': 83,
  'StockingCloudHalfReturnOrderBasic': 85,
  'StockingCloudHalfAllotOrderOutake': 87,
  'StockingCloudHalfAllotOrderIntake': 89,
  'StockingCloudHalfCountReportBasic1': 91,
  'StockingCloudHalfCountReportBasic3': 93,
  'StockingCloudStuffAllotOrderOutake': 95,
  'StockingCloudStuffAllotOrderIntake': 97,
  'StockingCloudStuffCountOrderBasic': 99,
  'StockingCloudStuffCountReportBasic1': 101,
  'StockingCloudStuffCountReportBasic3': 103,
  'StockingCloudStuffReturnOrderBasic': 105,
  'Types': {
    '1': '成品进货入库(ERP的成品采购入库单)',
    '3': '成品退货出库单(ERP的成品退货出库单)',
    '5': '成品盘点单(ERP的盘点单)',
    '7': '成品调价单(ERP的成品调价单)',
    '9': 'ERP的零售单(没用了, 后期删除OrderCloudRetailOrderMaster)',
    '11': 'ERP的售后退货单(没用了, 后期删除OrderCloudRetailOrderReturn)',
    '13': '柜台领货单(ERP的柜台领货单)',
    '15': '柜台退货单(ERP的柜台退货单)',
    '17': '成品报损单(ERP的报损单)',
    '19': '成品报溢单(ERP的报溢单)',
    '21': '应收款单',
    '23': '应付款单',
    '25': '收款单',
    '27': '付款单',
    '29': '成品打印',
    '31': '成品修改单',
    '33': '旧货转换成品',
    '35': '旧货其它出库单',
    '37': '成品调拨出库单',
    '38': '成品调拨入库单',
    '39': '旧货入库单(没用了, 后期删除)',
    '41': '旧货修改单(暂时没用)',
    '43': '旧货打印单',
    '45': '智能配货计划单',
    '47': '成品维修单',
    '49': '旧货调拨出库单',
    '51': '旧货调拨入库单',
    '53': '原料订货单',
    '55': '成品订货单',
    '57': '成品到货单',
    '59': '半成品整包入库单',
    '61': '半成品分秤',
    '63': '原料进货入库单',
    '65': '成品质检单',
    '67': '门店款式需求单',
    '69': '门店分货单',
    '71': '财务月结单',
    '73': '委外拆卸结算单',
    '75': '委外拆卸单',
    '77': '委外加工退料入库单',
    '79': '委外加工发料出库单',
    '81': '委外加工原料结算单',
    '83': '半成品盘点单',
    '85': '半成品退货单',
    '87': '半成品调拨出库单',
    '89': '半成品调拨入库单',
    '91': '半成品报损单',
    '93': '半成品报溢单',
    '95': '原料调拨出库单',
    '97': '原料调拨入库单',
    '99': '原料盘点单',
    '101': '原料报损单',
    '103': '原料报溢单',
    '105': '原料退货出库单',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '成品进货入库(ERP的成品采购入库单)'
    },
    {
      'KeyId': 3,
      'Value': '成品退货出库单(ERP的成品退货出库单)'
    },
    {
      'KeyId': 5,
      'Value': '成品盘点单(ERP的盘点单)'
    },
    {
      'KeyId': 7,
      'Value': '成品调价单(ERP的成品调价单)'
    },
    {
      'KeyId': 9,
      'Value': 'ERP的零售单(没用了, 后期删除OrderCloudRetailOrderMaster)'
    },
    {
      'KeyId': 11,
      'Value': 'ERP的售后退货单(没用了, 后期删除OrderCloudRetailOrderReturn)'
    },
    {
      'KeyId': 13,
      'Value': '柜台领货单(ERP的柜台领货单)'
    },
    {
      'KeyId': 15,
      'Value': '柜台退货单(ERP的柜台退货单)'
    },
    {
      'KeyId': 17,
      'Value': '成品报损单(ERP的报损单)'
    },
    {
      'KeyId': 19,
      'Value': '成品报溢单(ERP的报溢单)'
    },
    {
      'KeyId': 21,
      'Value': '应收款单'
    },
    {
      'KeyId': 23,
      'Value': '应付款单'
    },
    {
      'KeyId': 25,
      'Value': '收款单'
    },
    {
      'KeyId': 27,
      'Value': '付款单'
    },
    {
      'KeyId': 29,
      'Value': '成品打印'
    },
    {
      'KeyId': 31,
      'Value': '成品修改单'
    },
    {
      'KeyId': 33,
      'Value': '旧货转换成品'
    },
    {
      'KeyId': 35,
      'Value': '旧货其它出库单'
    },
    {
      'KeyId': 37,
      'Value': '成品调拨出库单'
    },
    {
      'KeyId': 38,
      'Value': '成品调拨入库单'
    },
    {
      'KeyId': 39,
      'Value': '旧货入库单(没用了, 后期删除)'
    },
    {
      'KeyId': 41,
      'Value': '旧货修改单(暂时没用)'
    },
    {
      'KeyId': 43,
      'Value': '旧货打印单'
    },
    {
      'KeyId': 45,
      'Value': '智能配货计划单'
    },
    {
      'KeyId': 47,
      'Value': '成品维修单'
    },
    {
      'KeyId': 49,
      'Value': '旧货调拨出库单'
    },
    {
      'KeyId': 51,
      'Value': '旧货调拨入库单'
    },
    {
      'KeyId': 53,
      'Value': '原料订货单'
    },
    {
      'KeyId': 55,
      'Value': '成品订货单'
    },
    {
      'KeyId': 57,
      'Value': '成品到货单'
    },
    {
      'KeyId': 59,
      'Value': '半成品整包入库单'
    },
    {
      'KeyId': 61,
      'Value': '半成品分秤'
    },
    {
      'KeyId': 63,
      'Value': '原料进货入库单'
    },
    {
      'KeyId': 65,
      'Value': '成品质检单'
    },
    {
      'KeyId': 67,
      'Value': '门店款式需求单'
    },
    {
      'KeyId': 69,
      'Value': '门店分货单'
    },
    {
      'KeyId': 71,
      'Value': '财务月结单'
    },
    {
      'KeyId': 73,
      'Value': '委外拆卸结算单'
    },
    {
      'KeyId': 75,
      'Value': '委外拆卸单'
    },
    {
      'KeyId': 77,
      'Value': '委外加工退料入库单'
    },
    {
      'KeyId': 79,
      'Value': '委外加工发料出库单'
    },
    {
      'KeyId': 81,
      'Value': '委外加工原料结算单'
    },
    {
      'KeyId': 83,
      'Value': '半成品盘点单'
    },
    {
      'KeyId': 85,
      'Value': '半成品退货单'
    },
    {
      'KeyId': 87,
      'Value': '半成品调拨出库单'
    },
    {
      'KeyId': 89,
      'Value': '半成品调拨入库单'
    },
    {
      'KeyId': 91,
      'Value': '半成品报损单'
    },
    {
      'KeyId': 93,
      'Value': '半成品报溢单'
    },
    {
      'KeyId': 95,
      'Value': '原料调拨出库单'
    },
    {
      'KeyId': 97,
      'Value': '原料调拨入库单'
    },
    {
      'KeyId': 99,
      'Value': '原料盘点单'
    },
    {
      'KeyId': 101,
      'Value': '原料报损单'
    },
    {
      'KeyId': 103,
      'Value': '原料报溢单'
    },
    {
      'KeyId': 105,
      'Value': '原料退货出库单'
    }
  ]
}
// 单号规则与审核的审核模式;
export const SettingGenerateAuditType = {
  'Manual': 1,
  'Automac': 3,
  'Types': {
    '1': '人工审核',
    '3': '自动审核',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '人工审核'
    },
    {
      'KeyId': 3,
      'Value': '自动审核'
    }
  ]
}
// 每日金价的旧货工费回收类型;
export const SettingGpriceRecallType = {
  'PieceOf': 1,
  'GramOf': 3,
  'Types': {
    '1': '按件',
    '3': '按克',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '按件'
    },
    {
      'KeyId': 3,
      'Value': '按克'
    }
  ]
}
// 参数开关设置的领退货验证方式;
export const SettingParameterValidateType = {
  'None': 1,
  'Password': 3,
  'Types': {
    '1': '无需验证',
    '3': '账号密码验证',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '无需验证'
    },
    {
      'KeyId': 3,
      'Value': '账号密码验证'
    }
  ]
}
// 参数开关设置的零售抹零的单位;
export const SettingParameterIgnoreUnit = {
  'Unit1': 1,
  'Unit3': 3,
  'Unit5': 5,
  'Types': {
    '1': '元',
    '3': '角',
    '5': '分',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '元'
    },
    {
      'KeyId': 3,
      'Value': '角'
    },
    {
      'KeyId': 5,
      'Value': '分'
    }
  ]
}
// 参数开关设置的零售抹零的舍入;
export const SettingParameterIgnoreType = {
  'Type1': 1,
  'Type3': 3,
  'Type5': 5,
  'Types': {
    '1': '只舍不入',
    '3': '只入不舍',
    '5': '四舍五入',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '只舍不入'
    },
    {
      'KeyId': 3,
      'Value': '只入不舍'
    },
    {
      'KeyId': 5,
      'Value': '四舍五入'
    }
  ]
}
// 参数开关设置的货品来源类型;
export const SettingParameterGoodsSourceType = {
  'MarketingCloud': 1,
  'StockingCloud': 9,
  'Types': {
    '1': '营销系统',
    '9': 'ERP系统',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '营销系统'
    },
    {
      'KeyId': 9,
      'Value': 'ERP系统'
    }
  ]
}
// 参数开关设置的评分以及打赏类型;
export const SettingParameterRewardType = {
  'RewardAndScore': 1,
  'Reward': 3,
  'Score': 5,
  'None': 7,
  'Types': {
    '1': '启用评分以及打赏',
    '3': '启用打赏',
    '5': '启用评分',
    '7': '均不启用',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '启用评分以及打赏'
    },
    {
      'KeyId': 3,
      'Value': '启用打赏'
    },
    {
      'KeyId': 5,
      'Value': '启用评分'
    },
    {
      'KeyId': 7,
      'Value': '均不启用'
    }
  ]
}
// 参数开关设置的零售修改类型;
export const SettingParameterEditType = {
  'Unable': 1,
  'Limited': 3,
  'Unlimited': 5,
  'Types': {
    '1': '不允许修改',
    '3': '允许',
    '5': '允许任意修改',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '不允许修改'
    },
    {
      'KeyId': 3,
      'Value': '允许'
    },
    {
      'KeyId': 5,
      'Value': '允许任意修改'
    }
  ]
}
// 参数开关设置的调拨是否结算;
export const StoreSettingParameterAppropSettleType = {
  'None': 1,
  'Settle': 3,
  'Types': {
    '1': '不结算',
    '3': '结算',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '不结算'
    },
    {
      'KeyId': 3,
      'Value': '结算'
    }
  ]
}
// 打印模板的模板类型;
export const SettingPrintingType = {
  'MarketingCloudElectronicQuality': 1101,
  'StockingCloudGoodsLabel': 9101,
  'MarketingCloudPaperQuality': 9105,
  'StockingCloudGoodsTags': 9107,
  'StockingCloudGoodsIntakeOrderBasic': 9201,
  'StockingCloudGoodsReturnOrderBasic': 9203,
  'StockingCloudGoodsCountOrderBasic': 9205,
  'StockingCloudGoodsPriceOrderBasic': 9207,
  'OrderCloudRetailOrderReturn': 9211,
  'StockingCloudGoodsCountReportBasic1': 9217,
  'StockingCloudGoodsCountReportBasic3': 9219,
  'StockingCloudSettleIOBillBasic1': 9221,
  'StockingCloudSettleIOBillBasic3': 9223,
  'StockingCloudSettleIOBillPaid1': 9225,
  'StockingCloudSettleIOBillPaid3': 9227,
  'StockingCloudJunkChangeOrderBasic': 9233,
  'StockingCloudJunkOutakeOrderBasic': 9235,
  'StockingCloudGoodsAllotOrderOutake': 9237,
  'StockingCloudJunkPrintOrderBasic': 9243,
  'StockingCloudGoodsReinfPlanBasic': 9245,
  'StockingCloudGoodsRepairOrderBasic': 9247,
  'OrderCloudRetailOrderMaster': 9249,
  'GiftingCloudGiftExpressOrder': 7101,
  'GiftingCloudGiftSaleOrder': 7103,
  'Types': {
    '1101': '电子质保单',
    '9101': '货品标签',
    '9105': '质保单打印模板',
    '9107': '电子标签',
    '9201': '成品进货入库单',
    '9203': '成品退货单',
    '9205': '成品盘点单',
    '9207': '成品调价单',
    '9211': '售后退货单',
    '9217': '成品报损单',
    '9219': '成品报溢单',
    '9221': '应收款单',
    '9223': '应付款单',
    '9225': '收款单',
    '9227': '付款单',
    '9233': '旧货转成品库',
    '9235': '旧货出库单',
    '9237': '成品调拨出库单',
    '9243': '旧货打印单',
    '9245': '配货计划单',
    '9247': '维修单',
    '9249': '零售单',
    '7101': '礼品快递单',
    '7103': '礼品订单',
  },
  'TypeArray': [{
      'KeyId': 1101,
      'Value': '电子质保单'
    },
    {
      'KeyId': 9101,
      'Value': '货品标签'
    },
    {
      'KeyId': 9105,
      'Value': '质保单打印模板'
    },
    {
      'KeyId': 9107,
      'Value': '电子标签'
    },
    {
      'KeyId': 9201,
      'Value': '成品进货入库单'
    },
    {
      'KeyId': 9203,
      'Value': '成品退货单'
    },
    {
      'KeyId': 9205,
      'Value': '成品盘点单'
    },
    {
      'KeyId': 9207,
      'Value': '成品调价单'
    },
    {
      'KeyId': 9211,
      'Value': '售后退货单'
    },
    {
      'KeyId': 9217,
      'Value': '成品报损单'
    },
    {
      'KeyId': 9219,
      'Value': '成品报溢单'
    },
    {
      'KeyId': 9221,
      'Value': '应收款单'
    },
    {
      'KeyId': 9223,
      'Value': '应付款单'
    },
    {
      'KeyId': 9225,
      'Value': '收款单'
    },
    {
      'KeyId': 9227,
      'Value': '付款单'
    },
    {
      'KeyId': 9233,
      'Value': '旧货转成品库'
    },
    {
      'KeyId': 9235,
      'Value': '旧货出库单'
    },
    {
      'KeyId': 9237,
      'Value': '成品调拨出库单'
    },
    {
      'KeyId': 9243,
      'Value': '旧货打印单'
    },
    {
      'KeyId': 9245,
      'Value': '配货计划单'
    },
    {
      'KeyId': 9247,
      'Value': '维修单'
    },
    {
      'KeyId': 9249,
      'Value': '零售单'
    },
    {
      'KeyId': 7101,
      'Value': '礼品快递单'
    },
    {
      'KeyId': 7103,
      'Value': '礼品订单'
    }
  ]
}
// 打印模板状态;
export const SettingPrintingState = {
  'Deleted': 1,
  'Normal': 3,
  'Designing': 5,
  'Types': {
    '1': '已删除',
    '3': '已启用',
    '5': '设计中',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '已删除'
    },
    {
      'KeyId': 3,
      'Value': '已启用'
    },
    {
      'KeyId': 5,
      'Value': '设计中'
    }
  ]
}
// 授权状态;
export const SubscribeState = {
  'Notauthorization': 1,
  'Authorization': 3,
  'Refuse': 5,
  'Types': {
    '1': '待授权',
    '3': '已授权',
    '5': '已拒绝',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '待授权'
    },
    {
      'KeyId': 3,
      'Value': '已授权'
    },
    {
      'KeyId': 5,
      'Value': '已拒绝'
    }
  ]
}