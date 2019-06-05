// 品类类型
export const CategoryType = {
  TYPE01: 1,
  TYPE03: 3,
  TYPE05: 5,
  TYPE07: 7,
  TYPE09: 9,
  TYPE11: 11,
  TYPE13: 13,
  TYPE15: 15,
  TYPE17: 17,
  TYPE19: 19,
  TYPE21: 21,
  TYPE23: 23,
  TYPE25: 25,
  TYPE27: 27,
  TYPE29: 29,
  TYPE31: 31,
  TYPE33: 33,
  TYPE35: 35,
  TYPE37: 37,
  TYPE39: 39,
  TYPE41: 41,
  TYPE43: 43,
  TYPE45: 45,
  TYPE47: 47,
  TYPE49: 49,
  TYPE51: 51,
  TYPE53: 53,
  TYPE55: 55,
  TYPE57: 57,
  TYPE59: 59,
  TYPE61: 61,
  TYPE63: 63,
  TYPE65: 65,
  TYPE67: 67,
  TYPE99: 99,
  Types: {
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
    '99': '其它'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '项链'
    },
    {
      KeyId: '3',
      Value: '套链'
    },
    {
      KeyId: '5',
      Value: '吊坠'
    },
    {
      KeyId: '7',
      Value: '头饰'
    },
    {
      KeyId: '9',
      Value: '耳饰'
    },
    {
      KeyId: '11',
      Value: '戒指'
    },
    {
      KeyId: '13',
      Value: '手链'
    },
    {
      KeyId: '15',
      Value: '手镯'
    },
    {
      KeyId: '17',
      Value: '臂镯'
    },
    {
      KeyId: '19',
      Value: '脚链'
    },
    {
      KeyId: '21',
      Value: '胸针'
    },
    {
      KeyId: '23',
      Value: '领夹'
    },
    {
      KeyId: '25',
      Value: '袖扣'
    },
    {
      KeyId: '27',
      Value: '珠串'
    },
    {
      KeyId: '29',
      Value: '珠链'
    },
    {
      KeyId: '31',
      Value: '挂件'
    },
    {
      KeyId: '33',
      Value: '摆件'
    },
    {
      KeyId: '35',
      Value: '金卡'
    },
    {
      KeyId: '37',
      Value: '金条'
    },
    {
      KeyId: '39',
      Value: '金币'
    },
    {
      KeyId: '41',
      Value: '铂金金条'
    },
    {
      KeyId: '43',
      Value: '铂金金币'
    },
    {
      KeyId: '45',
      Value: '银条'
    },
    {
      KeyId: '47',
      Value: '银币'
    },
    {
      KeyId: '49',
      Value: '银卡'
    },
    {
      KeyId: '51',
      Value: '电铸摆件'
    },
    {
      KeyId: '53',
      Value: '耳迫'
    },
    {
      KeyId: '55',
      Value: '配件扣'
    },
    {
      KeyId: '57',
      Value: '鱼钩扣'
    },
    {
      KeyId: '59',
      Value: '弹簧扣'
    },
    {
      KeyId: '61',
      Value: '绳子'
    },
    {
      KeyId: '63',
      Value: '钟表'
    },
    {
      KeyId: '65',
      Value: '挂坠'
    },
    {
      KeyId: '67',
      Value: '情侣对戒'
    },
    {
      KeyId: '99',
      Value: '其它'
    }
  ]
}
// 角色类型(公共)
export const CharacterType = {
  LINGCB: 1001,
  BRANCHLINGCB: 1101,
  GROUP: 2001,
  COMPANY: 2101,
  STORE: 2201,
  SUPPLIER: 3001,
  PROVIDER: 3101,
  Types: {
    '1001': '零成本平台管控中心',
    '1101': '零成本分公司',
    '2001': '集团总部管控中心',
    '2101': '商户总部管理中心',
    '2201': '门店管理中心',
    '3001': '礼品供应商管理中心',
    '3101': '供应链供应商管理中心'
  },
  TypeArray: [
    {
      KeyId: '1001',
      Value: '零成本平台管控中心'
    },
    {
      KeyId: '1101',
      Value: '零成本分公司'
    },
    {
      KeyId: '2001',
      Value: '集团总部管控中心'
    },
    {
      KeyId: '2101',
      Value: '商户总部管理中心'
    },
    {
      KeyId: '2201',
      Value: '门店管理中心'
    },
    {
      KeyId: '3001',
      Value: '礼品供应商管理中心'
    },
    {
      KeyId: '3101',
      Value: '供应链供应商管理中心'
    }
  ]
}
// 复核类型(公共)
export const CheckType = {
  AUDIT: 1,
  OUTSTOCK: 3,
  Types: {
    '1': '审核通过',
    '3': '出库'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '审核通过'
    },
    {
      KeyId: '3',
      Value: '出库'
    }
  ]
}
// 发货状态
export const DistribOrderBasicDeliveryXpState = {
  NOTSHIPPED: 1,
  SHIPPED: 3,
  Types: {
    '1': '未发货',
    '3': '已发货'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '未发货'
    },
    {
      KeyId: '3',
      Value: '已发货'
    }
  ]
}
// 订货单状态
export const DistribOrderBasicState = {
  DRAFT: 1,
  PENDINGREVIEW: 3,
  EXAMINATION: 5,
  REVIEWRETURN: 7,
  CANCELLED: 9,
  ABOLISHED: 11,
  Types: {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已取消',
    '11': '已作废'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '草稿'
    },
    {
      KeyId: '3',
      Value: '待审核'
    },
    {
      KeyId: '5',
      Value: '审核通过'
    },
    {
      KeyId: '7',
      Value: '审核退回'
    },
    {
      KeyId: '9',
      Value: '已取消'
    },
    {
      KeyId: '11',
      Value: '已作废'
    }
  ]
}
// 快递类型
export const ExpressType = {
  SF: 1,
  STO: 3,
  ZTO: 5,
  YTO: 7,
  YUNDA: 9,
  EMS: 11,
  ZJS: 13,
  DEPPON: 15,
  TTK: 17,
  BEST: 19,
  OTHER: 21,
  Types: {
    '1': '顺丰',
    '3': '申通',
    '5': '中通',
    '7': '圆通',
    '9': '已取消',
    '11': '韵达',
    '13': '宅急送',
    '15': '德邦',
    '17': '天天快递',
    '19': '百世快递',
    '21': '其它'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '顺丰'
    },
    {
      KeyId: '3',
      Value: '申通'
    },
    {
      KeyId: '5',
      Value: '中通'
    },
    {
      KeyId: '7',
      Value: '圆通'
    },
    {
      KeyId: '9',
      Value: '已取消'
    },
    {
      KeyId: '11',
      Value: '韵达'
    },
    {
      KeyId: '13',
      Value: '宅急送'
    },
    {
      KeyId: '15',
      Value: '德邦'
    },
    {
      KeyId: '17',
      Value: '天天快递'
    },
    {
      KeyId: '19',
      Value: '百世快递'
    },
    {
      KeyId: '21',
      Value: '其它'
    }
  ]
}
// 成色类型
export const GoldType = {
  TYPE1005: 1005,
  TYPE1010: 1010,
  TYPE1015: 1015,
  TYPE1105: 1105,
  TYPE1110: 1110,
  TYPE1205: 1205,
  TYPE1210: 1210,
  TYPE1215: 1215,
  TYPE1217: 1217,
  TYPE1219: 1219,
  TYPE1220: 1220,
  TYPE1225: 1225,
  TYPE1305: 1305,
  TYPE1310: 1310,
  TYPE1315: 1315,
  TYPE1320: 1320,
  TYPE1405: 1405,
  TYPE1410: 1410,
  TYPE1415: 1415,
  TYPE1420: 1420,
  TYPE1425: 1425,
  TYPE1430: 1430,
  TYPE1435: 1435,
  TYPE1440: 1440,
  TYPE1445: 1445,
  TYPE1450: 1450,
  TYPE1455: 1455,
  TYPE1460: 1460,
  TYPE1465: 1465,
  Types: {
    '1005': '足金AU99',
    '1010': '足金AU99.99',
    '1015': '足金AU99.999',
    '1105': '足金AU99.9(3D精品)',
    '1110': '足金AU99.99(3D精品)',
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
    '1415': '银Ag990',
    '1420': '银S925',
    '1425': '投资金条AU99.9',
    '1430': '投资金条AU99.99',
    '1435': '投资金条AU99.999',
    '1440': '工艺金条AU99.9',
    '1445': '工艺金条AU99.99',
    '1450': '工艺金条AU99.999',
    '1455': '钯金PD900',
    '1460': '钯金PD950',
    '0465': '钯金PD990'
  },
  TypeArray: [
    {
      KeyId: '1005',
      Value: '足金AU99'
    },
    {
      KeyId: '1010',
      Value: '足金AU99.99'
    },
    {
      KeyId: '1015',
      Value: '足金AU99.999'
    },
    {
      KeyId: '1105',
      Value: '足金AU99.9(3D精品)'
    },
    {
      KeyId: '1110',
      Value: '足金AU99.99(3D精品)'
    },
    {
      KeyId: '1205',
      Value: '足金AU99.9精品'
    },
    {
      KeyId: '1210',
      Value: '足金AU99.99精品'
    },
    {
      KeyId: '1215',
      Value: '足金AU99.999精品'
    },
    {
      KeyId: '1217',
      Value: '金AU990'
    },
    {
      KeyId: '1219',
      Value: '金AU916'
    },
    {
      KeyId: '1220',
      Value: '金AU750'
    },
    {
      KeyId: '1225',
      Value: '金AU585'
    },
    {
      KeyId: '1305',
      Value: '铂金PT999'
    },
    {
      KeyId: '1310',
      Value: '铂金PT990'
    },
    {
      KeyId: '1315',
      Value: '铂金PT950'
    },
    {
      KeyId: '1320',
      Value: '铂金PT900'
    },
    {
      KeyId: '1405',
      Value: '足银Ag99.9'
    },
    {
      KeyId: '1410',
      Value: '足银Ag99.99'
    },
    {
      KeyId: '1415',
      Value: '银Ag990'
    },
    {
      KeyId: '1420',
      Value: '银S925'
    },
    {
      KeyId: '1425',
      Value: '投资金条AU99.9'
    },
    {
      KeyId: '1430',
      Value: '投资金条AU99.99'
    },
    {
      KeyId: '1435',
      Value: '投资金条AU99.999'
    },
    {
      KeyId: '1440',
      Value: '工艺金条AU99.9'
    },
    {
      KeyId: '1445',
      Value: '工艺金条AU99.99'
    },
    {
      KeyId: '1450',
      Value: '工艺金条AU99.999'
    },
    {
      KeyId: '1455',
      Value: '钯金PD900'
    },
    {
      KeyId: '1460',
      Value: '钯金PD950'
    },
    {
      KeyId: '0465',
      Value: '钯金PD990'
    }
  ]
}
// 材质类型
export const MaterialType = {
  GOLD: 1,
  SILVERWARE: 3,
  DHARDGOLD: 5,
  PLATINUM: 7,
  PALLADIUM: 9,
  DIAMOND: 11,
  JACKPOT: 13,
  GOLDJADE: 15,
  PEARLGEM: 17,
  KGOLD: 19,
  NATURALWOOD: 21,
  FASHION: 23,
  JEWELRY: 25,
  JADEJADE: 27,
  ACCESSORIES: 29,
  OTHER: 31,
  Types: {
    '1': '黄金',
    '3': '银饰',
    '5': '3D硬金',
    '7': '铂金',
    '9': '钯金',
    '11': '钻石',
    '13': '彩宝',
    '15': '金镶玉',
    '17': '珍珠宝石',
    '19': 'K金',
    '21': '天然木饰',
    '23': '时尚饰品',
    '25': '珠宝配饰',
    '27': '翡翠玉石',
    '29': '配件',
    '31': '其它'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '黄金'
    },
    {
      KeyId: '3',
      Value: '银饰'
    },
    {
      KeyId: '5',
      Value: '3D硬金'
    },
    {
      KeyId: '7',
      Value: '铂金'
    },
    {
      KeyId: '9',
      Value: '钯金'
    },
    {
      KeyId: '11',
      Value: '钻石'
    },
    {
      KeyId: '13',
      Value: '彩宝'
    },
    {
      KeyId: '15',
      Value: '金镶玉'
    },
    {
      KeyId: '17',
      Value: '珍珠宝石'
    },
    {
      KeyId: '19',
      Value: 'K金'
    },
    {
      KeyId: '21',
      Value: '天然木饰'
    },
    {
      KeyId: '23',
      Value: '时尚饰品'
    },
    {
      KeyId: '25',
      Value: '珠宝配饰'
    },
    {
      KeyId: '27',
      Value: '翡翠玉石'
    },
    {
      KeyId: '29',
      Value: '配件'
    },
    {
      KeyId: '31',
      Value: '其它'
    }
  ]
}
// 接收对象
export const ObjectType = {
  AUTHCUSTOMER: 1,
  PLATFORM: 3,
  SELECTOBJECT: 5,
  Types: {
    '1': '授权客户',
    '3': '平台所有商家',
    '5': '发布时选择对象'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '授权客户'
    },
    {
      KeyId: '3',
      Value: '平台所有商家'
    },
    {
      KeyId: '5',
      Value: '发布时选择对象'
    }
  ]
}
// 排序类型(3升序，1降序) = ['3','1']
export const OrderFieldType = {
  UP: 3,
  DOWN: 1,
  Types: {
    '3': '升序',
    '1': '降序'
  },
  TypeArray: [
    {
      KeyId: '3',
      Value: '升序'
    },
    {
      KeyId: '1',
      Value: '降序'
    }
  ]
}
// 排序类型 枚举
export const OrderType = {
  NOTHING: 0,
  CREATE: 1,
  RELEASE: 3,
  NEW: 5,
  ORDER: 7,
  WANT: 9,
  LAST: 11,
  Types: {
    '0': '无需排序',
    '1': '创建时间',
    '3': '发布时间',
    '5': '新款时间',
    '7': '下单时间',
    '9': '期望交货时间',
    '11': '最后操作时间'
  },
  TypeArray: [
    {
      KeyId: '0',
      Value: '无需排序'
    },
    {
      KeyId: '1',
      Value: '创建时间'
    },
    {
      KeyId: '3',
      Value: '发布时间'
    },
    {
      KeyId: '5',
      Value: '新款时间'
    },
    {
      KeyId: '7',
      Value: '下单时间'
    },
    {
      KeyId: '9',
      Value: '期望交货时间'
    },
    {
      KeyId: '11',
      Value: '最后操作时间'
    }
  ]
}
// 款式状态
export const PatternBasicState = {
  NOSHELF: 1,
  YESSHELF: 3,
  VIOLATION: 5,
  Types: {
    '1': '未上架',
    '3': '已上架',
    '5': '违规下架'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '未上架'
    },
    {
      KeyId: '3',
      Value: '已上架'
    },
    {
      KeyId: '5',
      Value: '违规下架'
    }
  ]
}
// 模版来源
export const PatternBasicTemplateType = {
  INNER: 1,
  OUTER: 3,
  Types: {
    '1': '内部',
    '3': '外部'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '内部'
    },
    {
      KeyId: '3',
      Value: '外部'
    }
  ]
}
// 消息状态
export const PatternNewestState = {
  DRAFT: 1,
  PENDINGRELEASE: 3,
  TIMEDRELEASE: 5,
  PUBLISHED: 7,
  REVOKED: 9,
  VIOLATION: 11,
  Types: {
    '1': '草稿',
    '3': '待发布',
    '5': '定时发布',
    '7': '已发布',
    '9': '已撤销',
    '11': '违规删除'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '草稿'
    },
    {
      KeyId: '3',
      Value: '待发布'
    },
    {
      KeyId: '5',
      Value: '定时发布'
    },
    {
      KeyId: '7',
      Value: '已发布'
    },
    {
      KeyId: '9',
      Value: '已撤销'
    },
    {
      KeyId: '11',
      Value: '违规删除'
    }
  ]
}
// 栏目类型
export const PatternNewestType = {
  NEWEST: 1,
  HOT: 3,
  Types: {
    '1': '新款发布',
    '3': '畅销推荐'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '新款发布'
    },
    {
      KeyId: '3',
      Value: '畅销推荐'
    }
  ]
}
// 消息发布方式
export const PublishType = {
  NOW_PUBLISH: 1,
  TIMER_PUBLISH: 3,
  Types: {
    '1': '立即发布',
    '3': '定时发布'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '立即发布'
    },
    {
      KeyId: '3',
      Value: '定时发布'
    }
  ]
}
// 消息接收对象
export const ReceiptType = {
  ALL_CUSTOMER: 1,
  AUTH_CUSTOMER: 3,
  Types: {
    '1': '平台所有客户',
    '3': '授权客户'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '平台所有客户'
    },
    {
      KeyId: '3',
      Value: '授权客户'
    }
  ]
}
// 请求端来源
export const RequestSourceType = {
  CONTROLCENTER: 1,
  PROVIDER: 3,
  ORDERING: 5,
  Types: {
    '1': '平台端',
    '3': '供应商端',
    '5': '订货端'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '平台端'
    },
    {
      KeyId: '3',
      Value: '供应商端'
    },
    {
      KeyId: '5',
      Value: '订货端'
    }
  ]
}
// 复核类型(公共)
export const SaleCartSourceType = {
  PATTERN: 1,
  HANDWORK: 3,
  Types: {
    '1': '款式廊',
    '3': '手工创建'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '款式廊'
    },
    {
      KeyId: '3',
      Value: '手工创建'
    }
  ]
}
// 购物车明细状态
export const SaleCartState = {
  NOORDER: 1,
  ORDERPLACED: 3,
  DELETED: 5,
  Types: {
    '1': '未下单',
    '3': '已下单',
    '5': '已删除'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '未下单'
    },
    {
      KeyId: '3',
      Value: '已下单'
    },
    {
      KeyId: '5',
      Value: '已删除'
    }
  ]
}
// 出库情况（配货状态）
export const SaleOrderBasicDistribXpState = {
  NOTSTOCKED: 1,
  PARTIAL: 3,
  ALLDISTRIBUTION: 5,
  Types: {
    '1': '未出库',
    '3': '部分出库',
    '5': '全部出库'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '未出库'
    },
    {
      KeyId: '3',
      Value: '部分出库'
    },
    {
      KeyId: '5',
      Value: '全部出库'
    }
  ]
}
// 来源类型
export const SaleOrderBasicSourceType = {
  MANUALLY: 1,
  PLATFORM: 3,
  Types: {
    '1': '手工创建',
    '3': '平台下单'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '手工创建'
    },
    {
      KeyId: '3',
      Value: '平台下单'
    }
  ]
}
// 订货单状态
export const SaleOrderBasicState = {
  DRAFT: 1,
  PENDINGREVIEW: 3,
  EXAMINATION: 5,
  REVIEWRETURN: 7,
  CANCELLED: 9,
  ABOLISHED: 11,
  Types: {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已取消',
    '11': '已作废'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '草稿'
    },
    {
      KeyId: '3',
      Value: '待审核'
    },
    {
      KeyId: '5',
      Value: '审核通过'
    },
    {
      KeyId: '7',
      Value: '审核退回'
    },
    {
      KeyId: '9',
      Value: '已取消'
    },
    {
      KeyId: '11',
      Value: '已作废'
    }
  ]
}
// 订货单详情状态
export const SaleOrderItemState = {
  NORMAL: 1,
  DELETED: 3,
  Types: {
    '1': '正常',
    '3': '已删除'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '正常'
    },
    {
      KeyId: '3',
      Value: '已删除'
    }
  ]
}
// 款式筛选条件枚举
export const SettingCategoryFilter = {
  PL: 1,
  CS: 3,
  QG: 5,
  Types: {
    '1': '品类',
    '3': '成色',
    '5': '切工'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '品类'
    },
    {
      KeyId: '3',
      Value: '成色'
    },
    {
      KeyId: '5',
      Value: '切工'
    }
  ]
}
// 种类
export const SettingCategoryLargeType = {
  PL1: 1,
  PL3: 3,
  PL5: 5,
  PL7: 7,
  Types: {
    '1': '素金',
    '3': '镶嵌',
    '5': 'K金',
    '7': '其它'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '素金'
    },
    {
      KeyId: '3',
      Value: '镶嵌'
    },
    {
      KeyId: '5',
      Value: 'K金'
    },
    {
      KeyId: '7',
      Value: '其它'
    }
  ]
}
// 发货类型
export const ShippingType = {
  PICKEDUP: 1,
  EXPRESS: 3,
  Types: {
    '1': '自提',
    '3': '快递'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '自提'
    },
    {
      KeyId: '3',
      Value: '快递'
    }
  ]
}
// 净度
export const StoneClarity = {
  IF: 1,
  VVS: 2,
  VVS1: 3,
  VVS2: 4,
  VS: 5,
  VS1: 6,
  VS2: 7,
  SI: 8,
  SI1: 9,
  SI2: 10,
  SI3: 11,
  P: 12,
  FL: 13,
  LC: 14,
  Types: {
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
    '13': 'FL',
    '14': 'LC'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: 'IF'
    },
    {
      KeyId: '2',
      Value: 'VVS'
    },
    {
      KeyId: '3',
      Value: 'VVS1'
    },
    {
      KeyId: '4',
      Value: 'VVS2'
    },
    {
      KeyId: '5',
      Value: 'VS'
    },
    {
      KeyId: '6',
      Value: 'VS1'
    },
    {
      KeyId: '7',
      Value: 'VS2'
    },
    {
      KeyId: '8',
      Value: 'SI'
    },
    {
      KeyId: '9',
      Value: 'SI1'
    },
    {
      KeyId: '10',
      Value: 'SI2'
    },
    {
      KeyId: '11',
      Value: 'SI3'
    },
    {
      KeyId: '13',
      Value: 'FL'
    },
    {
      KeyId: '14',
      Value: 'LC'
    }
  ]
}
// 颜色
export const StoneColor = {
  D: 1,
  E: 2,
  DE: 3,
  F: 4,
  G: 5,
  FG: 6,
  H: 7,
  I: 8,
  J: 9,
  IJ: 10,
  K: 11,
  L: 12,
  KL: 13,
  M: 14,
  N: 15,
  MN: 16,
  Types: {
    '1': 'D',
    '2': 'E',
    '3': 'DE',
    '4': 'F',
    '5': 'G',
    '6': 'FG',
    '7': 'H',
    '8': 'I',
    '9': 'J',
    '10': 'IJ',
    '11': 'K',
    '12': 'L',
    '13': 'KL',
    '14': 'M',
    '15': 'N',
    '16': 'MN'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: 'D'
    },
    {
      KeyId: '2',
      Value: 'E'
    },
    {
      KeyId: '3',
      Value: 'DE'
    },
    {
      KeyId: '4',
      Value: 'F'
    },
    {
      KeyId: '5',
      Value: 'G'
    },
    {
      KeyId: '6',
      Value: 'FG'
    },
    {
      KeyId: '7',
      Value: 'H'
    },
    {
      KeyId: '8',
      Value: 'I'
    },
    {
      KeyId: '9',
      Value: 'J'
    },
    {
      KeyId: '10',
      Value: 'IJ'
    },
    {
      KeyId: '11',
      Value: 'K'
    },
    {
      KeyId: '12',
      Value: 'L'
    },
    {
      KeyId: '13',
      Value: 'KL'
    },
    {
      KeyId: '14',
      Value: 'M'
    },
    {
      KeyId: '15',
      Value: 'N'
    },
    {
      KeyId: '16',
      Value: 'MN'
    }
  ]
}
// 客户类型
export const SubscribeObjectType = {
  MERCHANT: 1,
  STORE: 3,
  Types: {
    '1': '商户',
    '3': '门店'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '商户'
    },
    {
      KeyId: '3',
      Value: '门店'
    }
  ]
}
// 关注状态
export const SubscribeState = {
  NOTAUTHORIZATION: 1,
  AUTHORIZATION: 3,
  REFUSE: 5,
  Types: {
    '1': '待授权',
    '3': '已授权',
    '5': '已拒绝'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '待授权'
    },
    {
      KeyId: '3',
      Value: '已授权'
    },
    {
      KeyId: '5',
      Value: '已拒绝'
    }
  ]
}
// 通用是否标识
export const WhetherType = {
  NO: 1,
  YES: 3,
  Types: {
    '1': '否',
    '3': '是'
  },
  TypeArray: [
    {
      KeyId: '1',
      Value: '否'
    },
    {
      KeyId: '3',
      Value: '是'
    }
  ]
}
// k金成色类型
export const KGoldType = {
  TYPE1219: 1219,
  TYPE1220: 1220,
  TYPE1225: 1225,
  Types: {
    '1219': '金AU916',
    '1220': '金AU750',
    '1225': '金AU585'
  },
  TypeArray: [
    {
      KeyId: '1219',
      Value: '金AU916'
    },
    {
      KeyId: '1220',
      Value: '金AU750'
    },
    {
      KeyId: '1225',
      Value: '金AU585'
    }
  ]
}
