
// 退款设置;
export const RefundType = {
  Manual: 1,
  Auto: 3,
  Types: {
    '1': '手工退款',
    '3': '自动退款'
  },
  TypeArray: [
    { KeyId: '1', Value: '手工退款' },
    { KeyId: '3', Value: '自动退款' }
  ]
}

// 活动类型;
export const SpreadType = {
  Seckill: 1,
  Collage: 3,
  Bargain: 5,
  Types: {
    '1': '秒杀',
    '3': '拼团',
    '5': '砍价'
  },
  TypeArray: [
    { KeyId: '1', Value: '秒杀' },
    { KeyId: '3', Value: '拼团' },
    { KeyId: '5', Value: '砍价' }
  ]
}

// 提货类型;
export const PickType = {
  Self: 1,
  Other: 3,
  Types: {
    '1': '自提',
    '3': '代提'
  },
  TypeArray: [{ KeyId: '1', Value: '自提' }, { KeyId: '3', Value: '代提' }]
}

// 有效期单位;
export const UnitType = {
  Year: 1,
  Month: 3,
  Day: 5,
  Types: {
    '1': '年',
    '3': '月',
    '5': '天'
  },
  TypeArray: [
    { KeyId: '1', Value: '年' },
    { KeyId: '3', Value: '月' },
    { KeyId: '5', Value: '天' }
  ]
}

// 商品类型;
export const ProductType = {
  Entity: 1,
  Virtual: 3,
  Types: {
    '1': '实物',
    '3': '电子可售卡券'
  },
  TypeArray: [
    { KeyId: '1', Value: '实物' },
    { KeyId: '3', Value: '电子可售卡券' }
  ]
}

// 商品分类;
export const ProductBasicPrimeType = {
  Golded: 1,
  UnGold: 3,
  Other: 5,
  Types: {
    '1': '素金',
    '3': '非素',
    '5': '其它'
  },
  TypeArray: [
    { KeyId: '1', Value: '素金' },
    { KeyId: '3', Value: '非素' },
    { KeyId: '5', Value: '其它' }
  ]
}

// 售后类型;
export const RmaType = {
  None: 1,
  Rma: 3,
  Types: {
    '1': '非售后',
    '3': '售后'
  },
  TypeArray: [{ KeyId: '1', Value: '非售后' }, { KeyId: '3', Value: '售后' }]
}

// 限购类型;
export const LimitType = {
  One: 1,
  None: 3,
  More: 5,
  Types: {
    '1': '限购1次/人',
    '3': '不限',
    '5': '限购N次/人'
  },
  TypeArray: [
    { KeyId: '1', Value: '限购1次/人' },
    { KeyId: '3', Value: '不限' },
    { KeyId: '5', Value: '限购N次/人' }
  ]
}

// 活动状态;
export const CollageBasicState = {
  Deleted: 1,
  Finished: 3,
  Wait: 5,
  Published: 7,
  Types: {
    '1': '已删除',
    '3': '已结束',
    '5': '待发布',
    '7': '已发布'
  },
  TypeArray: [
    { KeyId: '1', Value: '已删除' },
    { KeyId: '3', Value: '已结束' },
    { KeyId: '5', Value: '待发布' },
    { KeyId: '7', Value: '已发布' }
  ]
}

// 我的拼团状态;
export const CollageTeamState = {
  Wait: 1,
  Succeed: 3,
  Failed: 5,
  Types: {
    '1': '待成团',
    '3': '已成团',
    '5': '未成团'
  },
  TypeArray: [
    { KeyId: '1', Value: '待成团' },
    { KeyId: '3', Value: '已成团' },
    { KeyId: '5', Value: '未成团' }
  ]
}

// 未成团订单处理类型;
export const CollageBasicHandleType = {
  Trade: 1,
  Refund: 3,
  Types: {
    '1': '正常交易',
    '3': '退款'
  },
  TypeArray: [{ KeyId: '1', Value: '正常交易' }, { KeyId: '3', Value: '退款' }]
}

// 拼团日志类型;
export const CollageLogType = {
  Fictitious: 1,
  Chief: 3,
  Member: 5,
  Types: {
    '1': '虚拟',
    '3': '团长',
    '5': '成员'
  },
  TypeArray: [
    { KeyId: '1', Value: '虚拟' },
    { KeyId: '3', Value: '团长' },
    { KeyId: '5', Value: '成员' }
  ]
}

// 砍价活动状态;
export const BargainBasicState = {
  Deleted: 1,
  Finished: 3,
  Wait: 5,
  Published: 7,
  Types: {
    '1': '已删除',
    '3': '已结束',
    '5': '待发布',
    '7': '已发布'
  },
  TypeArray: [
    { KeyId: '1', Value: '已删除' },
    { KeyId: '3', Value: '已结束' },
    { KeyId: '5', Value: '待发布' },
    { KeyId: '7', Value: '已发布' }
  ]
}

// 砍价日志类型;
export const BargainLogType = {
  Fictitious: 1,
  Self: 3,
  Help: 5,
  Types: {
    '1': '虚拟',
    '3': '自己砍',
    '5': '他人砍'
  },
  TypeArray: [
    { KeyId: '1', Value: '虚拟' },
    { KeyId: '3', Value: '自己砍' },
    { KeyId: '5', Value: '他人砍' }
  ]
}

// 退货单状态;
export const SpreadReturnOrderBasicState = {
  Wait: 1,
  Audit: 3,
  Abandon: 5,
  Types: {
    '1': '待审核',
    '3': '审核通过',
    '5': '作废'
  },
  TypeArray: [
    { KeyId: '1', Value: '待审核' },
    { KeyId: '3', Value: '审核通过' },
    { KeyId: '5', Value: '作废' }
  ]
}

// 退货方式;
export const ReceiptType = {
  Self: 1,
  Express: 3,
  Types: {
    '1': '客户送至门店',
    '3': '快递至门店'
  },
  TypeArray: [
    { KeyId: '1', Value: '客户送至门店' },
    { KeyId: '3', Value: '快递至门店' }
  ]
}

// 订单状态;
export const SpreadSaleOrderBasicState = {
  Deleted: 1,
  WaitPay: 3,
  Cancel: 5,
  WaitShip: 7,
  Finished: 9,
  Returned: 11,
  Types: {
    '1': '已删除',
    '3': '待付款',
    '5': '已取消',
    '7': '待提货(已支付)',
    '9': '已完成',
    '11': '已退货'
  },
  TypeArray: [
    { KeyId: '1', Value: '已删除' },
    { KeyId: '3', Value: '待付款' },
    { KeyId: '5', Value: '已取消' },
    { KeyId: '7', Value: '待提货(已支付)' },
    { KeyId: '9', Value: '已完成' },
    { KeyId: '11', Value: '已退货' }
  ]
}

// 订单类型;
export const SpreadSaleOrderBasicOrderType = {
  Chief: 3,
  Member: 5,
  Types: {
    '3': '团长',
    '5': '成员'
  },
  TypeArray: [{ KeyId: '3', Value: '团长' }, { KeyId: '5', Value: '成员' }]
}

// 订单的退货状态;
export const SpreadSaleOrderBasicReturnState = {
  None: 1,
  Returnning: 3,
  Returned: 5,
  Types: {
    '1': '未退货',
    '3': '退货中',
    '5': '已退货'
  },
  TypeArray: [
    { KeyId: '1', Value: '未退货' },
    { KeyId: '3', Value: '退货中' },
    { KeyId: '5', Value: '已退货' }
  ]
}

// 收件状态;
export const ReceiptState = {
  Wait: 1,
  Finish: 3,
  Types: {
    '1': '待收件',
    '3': '已收件'
  },
  TypeArray: [{ KeyId: '1', Value: '待收件' }, { KeyId: '3', Value: '已收件' }]
}

// 秒杀活动状态;
export const SeckillBasicState = {
  Deleted: 1,
  Finished: 3,
  Wait: 5,
  Published: 7,
  Types: {
    '1': '已删除',
    '3': '已结束',
    '5': '待发布',
    '7': '已发布'
  },
  TypeArray: [
    { KeyId: '1', Value: '已删除' },
    { KeyId: '3', Value: '已结束' },
    { KeyId: '5', Value: '待发布' },
    { KeyId: '7', Value: '已发布' }
  ]
}

// 秒杀日志类型;
export const SeckillLogType = {
  Fictitious: 1,
  Order: 3,
  Types: {
    '1': '虚拟',
    '3': '订单'
  },
  TypeArray: [{ KeyId: '1', Value: '虚拟' }, { KeyId: '3', Value: '订单' }]
}

// 关联类型;
export const GroupMapType = {
  CreateSelf: 1,
  Relation: 3,
  Types: {
    '1': '自建',
    '3': '关联'
  },
  TypeArray: [{ KeyId: '1', Value: '自建' }, { KeyId: '3', Value: '关联' }]
}

// 应收付款单的应收付类型;
export const FinanceBillBasicBillType = {
  Receipt: 1,
  Paid: 3,
  Types: {
    '1': '应收款单',
    '3': '应付款单'
  },
  TypeArray: [
    { KeyId: '1', Value: '应收款单' },
    { KeyId: '3', Value: '应付款单' }
  ]
}

// 来源类型;
export const OwnerType = {
  Lingcb: 1,
  Company: 3,
  Store: 5,
  Types: {
    '1': '零成本平台管控中心',
    '3': '商户',
    '5': '门店'
  },
  TypeArray: [
    { KeyId: '1', Value: '零成本平台管控中心' },
    { KeyId: '3', Value: '商户' },
    { KeyId: '5', Value: '门店' }
  ]
}

// 启用停用状态;
export const EnableState = {
  Disable: 1,
  Enable: 3,
  Types: {
    '1': '已停用',
    '3': '已启用'
  },
  TypeArray: [{ KeyId: '1', Value: '已停用' }, { KeyId: '3', Value: '已启用' }]
}

// 运行状态;
export const RunningState = {
  Running: 1,
  Pause: 3,
  Types: {
    '1': '运行中',
    '3': '已暂停'
  },
  TypeArray: [{ KeyId: '1', Value: '运行中' }, { KeyId: '3', Value: '已暂停' }]
}

// 支付方式;
export const PaymentType = {
  BankPay: 1,
  AliPay: 3,
  WechatPay: 5,
  UnionPay: 7,
  CashPay: 9,
  CreditPay: 11,
  SysPay: 99,
  Types: {
    '1': '银行转账',
    '3': '支付宝',
    '5': '微信',
    '7': '银联',
    '9': '现金',
    '11': '花呗分期',
    '99': '系统'
  },
  TypeArray: [
    { KeyId: '1', Value: '银行转账' },
    { KeyId: '3', Value: '支付宝' },
    { KeyId: '5', Value: '微信' },
    { KeyId: '7', Value: '银联' },
    { KeyId: '9', Value: '现金' },
    { KeyId: '11', Value: '花呗分期' },
    { KeyId: '99', Value: '系统' }
  ]
}

// 性别类型;
export const SexyType = {
  Male: 1,
  Female: 3,
  Secret: 5,
  Types: {
    '1': '男士',
    '3': '女士',
    '5': '保密'
  },
  TypeArray: [
    { KeyId: '1', Value: '男士' },
    { KeyId: '3', Value: '女士' },
    { KeyId: '5', Value: '保密' }
  ]
}

// 排序类型;
export const MoveType = {
  Prev: 1,
  Next: 3,
  First: 5,
  Last: 7,
  Types: {
    '1': '上移',
    '3': '下移',
    '5': '上移顶部',
    '7': '下移底部'
  },
  TypeArray: [
    { KeyId: '1', Value: '上移' },
    { KeyId: '3', Value: '下移' },
    { KeyId: '5', Value: '上移顶部' },
    { KeyId: '7', Value: '下移底部' }
  ]
}

// 文件上传类型;
export const UploadFileType = {
  PurchaseOrderBasic: 1,
  GoodsBasicIamgeUrl: 3,
  PaymentWechartCert: 99,
  StoreBasicImageUrl: 101,
  SecurityUserImageUrl: 103,
  CompanyBasicImageUrl: 105,
  WechartImageUrl: 107,
  StoreBasicCSWXUrl: 109,
  BusinessUrl: 111,
  GroupBasicImageUrl: 113,
  GoodsTags: 115,
  BannerImageUrl: 117,
  SpreadProductImageUrl: 119,
  SpreadAppletImageUrl: 121,
  PaymentWxAppletCert: 123,
  Types: {
    '1': '采购成品模板导入(excel,临时)',
    '3': '成品图片(image,正式)',
    '99': '微信支付上传路径',
    '101': '门店logo(image,正式)',
    '103': '用户图像(image,正式)',
    '105': '商户logo(image,正式)',
    '107': '微信自定义回复(image,正式)',
    '109': '客服二维码(image,正式)',
    '111': '营业执照',
    '113': '集团logo',
    '115': '电子标签',
    '117': '营销活动Banna',
    '119': '活动商品图片(image,正式)',
    '121': '活动小程序图片',
    '123': '小程序支付上传路径'
  },
  TypeArray: [
    { KeyId: '1', Value: '采购成品模板导入(excel,临时)' },
    { KeyId: '3', Value: '成品图片(image,正式)' },
    { KeyId: '99', Value: '微信支付上传路径' },
    { KeyId: '101', Value: '门店logo(image,正式)' },
    { KeyId: '103', Value: '用户图像(image,正式)' },
    { KeyId: '105', Value: '商户logo(image,正式)' },
    { KeyId: '107', Value: '微信自定义回复(image,正式)' },
    { KeyId: '109', Value: '客服二维码(image,正式)' },
    { KeyId: '111', Value: '营业执照' },
    { KeyId: '113', Value: '集团logo' },
    { KeyId: '115', Value: '电子标签' },
    { KeyId: '117', Value: '营销活动Banna' },
    { KeyId: '119', Value: '活动商品图片(image,正式)' },
    { KeyId: '121', Value: '活动小程序图片' },
    { KeyId: '123', Value: '小程序支付上传路径' }
  ]
}

// 快递类型;
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
  Other: 99,
  Types: {
    '1': '顺丰',
    '3': '申通',
    '5': '中通',
    '7': '圆通',
    '9': '韵达',
    '11': 'EMS',
    '13': '宅急送',
    '15': '德邦',
    '17': '天天快递',
    '19': '百世快递',
    '99': '其它'
  },
  TypeArray: [
    { KeyId: '1', Value: '顺丰' },
    { KeyId: '3', Value: '申通' },
    { KeyId: '5', Value: '中通' },
    { KeyId: '7', Value: '圆通' },
    { KeyId: '9', Value: '韵达' },
    { KeyId: '11', Value: 'EMS' },
    { KeyId: '13', Value: '宅急送' },
    { KeyId: '15', Value: '德邦' },
    { KeyId: '17', Value: '天天快递' },
    { KeyId: '19', Value: '百世快递' },
    { KeyId: '99', Value: '其它' }
  ]
}

// 发货类型;
export const ShippingType = {
  PickedUp: 1,
  Express: 3,
  Types: {
    '1': '自提',
    '3': '快递'
  },
  TypeArray: [{ KeyId: '1', Value: '自提' }, { KeyId: '3', Value: '快递' }]
}

// 微信配置;
export const CompanyBasicWechatSettingType = {
  Company: 1,
  Store: 3,
  Types: {
    '1': '商户总部',
    '3': '门店设置'
  },
  TypeArray: [
    { KeyId: '1', Value: '商户总部' },
    { KeyId: '3', Value: '门店设置' }
  ]
}

// 支付授权;
export const CompanyBasicPaymentSettingType = {
  Company: 1,
  Store: 3,
  Types: {
    '1': '商户总部',
    '3': '门店设置'
  },
  TypeArray: [
    { KeyId: '1', Value: '商户总部' },
    { KeyId: '3', Value: '门店设置' }
  ]
}

// 材质类型;
export const MaterialType = {
  Goldlion: 1,
  Silver: 3,
  HardGold3D: 5,
  Platinum: 7,
  Palladium: 9,
  Diamond: 11,
  KGoldlion: 13,
  Gemstone: 15,
  GoldWithJade: 17,
  PearlStone: 19,
  Wood: 21,
  Fashion: 23,
  Jewelry: 25,
  Jadeite: 27,
  Fitting: 97,
  Other: 99,
  Types: {
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
    '97': '配件',
    '99': '其它'
  },
  TypeArray: [
    { KeyId: '1', Value: '黄金' },
    { KeyId: '3', Value: '银饰' },
    { KeyId: '5', Value: '3D硬金' },
    { KeyId: '7', Value: '铂金' },
    { KeyId: '9', Value: '钯金' },
    { KeyId: '11', Value: '钻石' },
    { KeyId: '13', Value: 'K金' },
    { KeyId: '15', Value: '彩宝' },
    { KeyId: '17', Value: '金镶玉' },
    { KeyId: '19', Value: '珍珠宝石' },
    { KeyId: '21', Value: '天然木饰' },
    { KeyId: '23', Value: '时尚饰品' },
    { KeyId: '25', Value: '珠宝配饰' },
    { KeyId: '27', Value: '翡翠玉石' },
    { KeyId: '97', Value: '配件' },
    { KeyId: '99', Value: '其它' }
  ]
}

// 品类类型;
export const CategoryType = {
  Type01: 1,
  Type03: 3,
  Type05: 5,
  Type07: 7,
  Type09: 9,
  Type11: 11,
  Type13: 13,
  Type15: 15,
  Type17: 17,
  Type19: 19,
  Type21: 21,
  Type23: 23,
  Type25: 25,
  Type27: 27,
  Type29: 29,
  Type31: 31,
  Type33: 33,
  Type35: 35,
  Type37: 37,
  Type39: 39,
  Type41: 41,
  Type43: 43,
  Type45: 45,
  Type47: 47,
  Type49: 49,
  Type51: 51,
  Type53: 53,
  Type55: 55,
  Type57: 57,
  Type59: 59,
  Type61: 61,
  Type63: 63,
  Type65: 65,
  Type67: 67,
  Type99: 99,
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
    { KeyId: '1', Value: '项链' },
    { KeyId: '3', Value: '套链' },
    { KeyId: '5', Value: '吊坠' },
    { KeyId: '7', Value: '头饰' },
    { KeyId: '9', Value: '耳饰' },
    { KeyId: '11', Value: '戒指' },
    { KeyId: '13', Value: '手链' },
    { KeyId: '15', Value: '手镯' },
    { KeyId: '17', Value: '臂镯' },
    { KeyId: '19', Value: '脚链' },
    { KeyId: '21', Value: '胸针' },
    { KeyId: '23', Value: '领夹' },
    { KeyId: '25', Value: '袖扣' },
    { KeyId: '27', Value: '珠串' },
    { KeyId: '29', Value: '珠链' },
    { KeyId: '31', Value: '挂件' },
    { KeyId: '33', Value: '摆件' },
    { KeyId: '35', Value: '金卡' },
    { KeyId: '37', Value: '金条' },
    { KeyId: '39', Value: '金币' },
    { KeyId: '41', Value: '铂金金条' },
    { KeyId: '43', Value: '铂金金币' },
    { KeyId: '45', Value: '银条' },
    { KeyId: '47', Value: '银币' },
    { KeyId: '49', Value: '银卡' },
    { KeyId: '51', Value: '电铸摆件' },
    { KeyId: '53', Value: '耳迫' },
    { KeyId: '55', Value: '配件扣' },
    { KeyId: '57', Value: '鱼钩扣' },
    { KeyId: '59', Value: '弹簧扣' },
    { KeyId: '61', Value: '绳子' },
    { KeyId: '63', Value: '钟表' },
    { KeyId: '65', Value: '挂坠' },
    { KeyId: '67', Value: '情侣对戒' },
    { KeyId: '99', Value: '其它' }
  ]
}

// 成色类型(素金品类);
export const GoldType = {
  Type1005: 1005,
  Type1010: 1010,
  Type1015: 1015,
  Type1105: 1105,
  Type1110: 1110,
  Type1205: 1205,
  Type1210: 1210,
  Type1215: 1215,
  Type1217: 1217,
  Type1219: 1219,
  Type1220: 1220,
  Type1225: 1225,
  Type1305: 1305,
  Type1310: 1310,
  Type1315: 1315,
  Type1320: 1320,
  Type1405: 1405,
  Type1410: 1410,
  Type1412: 1412,
  Type1415: 1415,
  Type1500: 1500,
  Type1505: 1505,
  Type1510: 1510,
  Type1600: 1600,
  Type1605: 1605,
  Type1610: 1610,
  Type1620: 1620,
  Type1625: 1625,
  Type1630: 1630,
  Types: {
    '1005': '足金AU99.9',
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
    '1630': '钯金PD990'
  },
  TypeArray: [
    { KeyId: '1005', Value: '足金AU99.9' },
    { KeyId: '1010', Value: '足金AU99.99' },
    { KeyId: '1015', Value: '足金AU99.999' },
    { KeyId: '1105', Value: '足金AU99.9(3D精品)' },
    { KeyId: '1110', Value: '足金AU99.99(3D精品)' },
    { KeyId: '1205', Value: '足金AU99.9精品' },
    { KeyId: '1210', Value: '足金AU99.99精品' },
    { KeyId: '1215', Value: '足金AU99.999精品' },
    { KeyId: '1217', Value: '金AU990' },
    { KeyId: '1219', Value: '金AU916' },
    { KeyId: '1220', Value: '金AU750' },
    { KeyId: '1225', Value: '金AU585' },
    { KeyId: '1305', Value: '铂金PT999' },
    { KeyId: '1310', Value: '铂金PT990' },
    { KeyId: '1315', Value: '铂金PT950' },
    { KeyId: '1320', Value: '铂金PT900' },
    { KeyId: '1405', Value: '足银Ag99.9' },
    { KeyId: '1410', Value: '足银Ag99.99' },
    { KeyId: '1412', Value: '银Ag990' },
    { KeyId: '1415', Value: '银S925' },
    { KeyId: '1500', Value: '投资金条AU99.9' },
    { KeyId: '1505', Value: '投资金条AU99.99' },
    { KeyId: '1510', Value: '投资金条AU99.999' },
    { KeyId: '1600', Value: '工艺金条AU99.9' },
    { KeyId: '1605', Value: '工艺金条AU99.99' },
    { KeyId: '1610', Value: '工艺金条AU99.999' },
    { KeyId: '1620', Value: '钯金PD900' },
    { KeyId: '1625', Value: '钯金PD950' },
    { KeyId: '1630', Value: '钯金PD990' }
  ]
}

// 净度;
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
    '12': 'P',
    '13': 'FL',
    '14': 'LC'
  },
  TypeArray: [
    { KeyId: '1', Value: 'IF' },
    { KeyId: '2', Value: 'VVS' },
    { KeyId: '3', Value: 'VVS1' },
    { KeyId: '4', Value: 'VVS2' },
    { KeyId: '5', Value: 'VS' },
    { KeyId: '6', Value: 'VS1' },
    { KeyId: '7', Value: 'VS2' },
    { KeyId: '8', Value: 'SI' },
    { KeyId: '9', Value: 'SI1' },
    { KeyId: '10', Value: 'SI2' },
    { KeyId: '11', Value: 'SI3' },
    { KeyId: '12', Value: 'P' },
    { KeyId: '13', Value: 'FL' },
    { KeyId: '14', Value: 'LC' }
  ]
}

// 切工;
export const StoneCut = {
  EX: 1,
  VG: 2,
  G: 3,
  P: 4,
  Types: {
    '1': 'EX',
    '2': 'VG',
    '3': 'G',
    '4': 'P'
  },
  TypeArray: [
    { KeyId: '1', Value: 'EX' },
    { KeyId: '2', Value: 'VG' },
    { KeyId: '3', Value: 'G' },
    { KeyId: '4', Value: 'P' }
  ]
}

// 抛光;
export const StonePolish = {
  EX: 1,
  VG: 2,
  G: 3,
  P: 4,
  Types: {
    '1': 'EX',
    '2': 'VG',
    '3': 'G',
    '4': 'P'
  },
  TypeArray: [
    { KeyId: '1', Value: 'EX' },
    { KeyId: '2', Value: 'VG' },
    { KeyId: '3', Value: 'G' },
    { KeyId: '4', Value: 'P' }
  ]
}

// 对称;
export const StoneSym = {
  EX: 1,
  VG: 2,
  G: 3,
  P: 4,
  Types: {
    '1': 'EX',
    '2': 'VG',
    '3': 'G',
    '4': 'P'
  },
  TypeArray: [
    { KeyId: '1', Value: 'EX' },
    { KeyId: '2', Value: 'VG' },
    { KeyId: '3', Value: 'G' },
    { KeyId: '4', Value: 'P' }
  ]
}

// 货品销售状态;
export const GoodsSaleState = {
  UnSold: 1,
  Sold: 3,
  Types: {
    '1': '未销售',
    '3': '已销售'
  },
  TypeArray: [{ KeyId: '1', Value: '未销售' }, { KeyId: '3', Value: '已销售' }]
}

// 电子标签状态;
export const GoodsTagsState = {
  Delete: 1,
  None: 3,
  Updating: 5,
  Done: 7,
  Fail: 9,
  Types: {
    '1': '已删除',
    '3': '未更新',
    '5': '更新中',
    '7': '更新完成',
    '9': '更新失败'
  },
  TypeArray: [
    { KeyId: '1', Value: '已删除' },
    { KeyId: '3', Value: '未更新' },
    { KeyId: '5', Value: '更新中' },
    { KeyId: '7', Value: '更新完成' },
    { KeyId: '9', Value: '更新失败' }
  ]
}

// 基站在线状态;
export const TagsStationEquipOnlineState = {
  UnReg: 1,
  Online: 3,
  OffLine: 5,
  Types: {
    '1': '未注册',
    '3': '在线',
    '5': '离线'
  },
  TypeArray: [
    { KeyId: '1', Value: '未注册' },
    { KeyId: '3', Value: '在线' },
    { KeyId: '5', Value: '离线' }
  ]
}

// 注册来源;
export const MemberPlatType = {
  WechatUI: 1,
  OtherUI: 99,
  Types: {
    '1': '微信',
    '99': '其它'
  },
  TypeArray: [{ KeyId: '1', Value: '微信' }, { KeyId: '99', Value: '其它' }]
}

// 调价单状态;
export const PriceOrderBasicState = {
  Draft: 1,
  Wait: 3,
  Audit: 5,
  Reject: 7,
  Abandon: 9,
  Types: {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废'
  },
  TypeArray: [
    { KeyId: '1', Value: '草稿' },
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '审核通过' },
    { KeyId: '7', Value: '审核退回' },
    { KeyId: '9', Value: '已作废' }
  ]
}

// 成品采购单的商户端状态;
export const PurchaseOrderBasicPrevState = {
  Draft: 1,
  Wait: 3,
  Audit: 5,
  Reject: 7,
  Abandon: 9,
  Types: {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废'
  },
  TypeArray: [
    { KeyId: '1', Value: '草稿' },
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '审核通过' },
    { KeyId: '7', Value: '审核退回' },
    { KeyId: '9', Value: '已作废' }
  ]
}

// 成品采购单的门店端状态;
export const PurchaseOrderBasicState = {
  Draft: 1,
  Wait: 3,
  Audit: 5,
  Reject: 7,
  Abandon: 9,
  Cancel: 11,
  Types: {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消'
  },
  TypeArray: [
    { KeyId: '1', Value: '草稿' },
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '审核通过' },
    { KeyId: '7', Value: '审核退回' },
    { KeyId: '9', Value: '已作废' },
    { KeyId: '11', Value: '已取消' }
  ]
}

// 成品退货单状态;
export const ReturnOrderBasicState = {
  Draft: 1,
  Wait: 3,
  Audit: 5,
  Reject: 7,
  Abandon: 9,
  Cancel: 11,
  Types: {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消'
  },
  TypeArray: [
    { KeyId: '1', Value: '草稿' },
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '审核通过' },
    { KeyId: '7', Value: '审核退回' },
    { KeyId: '9', Value: '已作废' },
    { KeyId: '11', Value: '已取消' }
  ]
}

// 领货退货单的领退类型;
export const DeskOrderBasicOrderType = {
  Pickup: 1,
  Return: 3,
  Types: {
    '1': '领货',
    '3': '退货'
  },
  TypeArray: [{ KeyId: '1', Value: '领货' }, { KeyId: '3', Value: '退货' }]
}

// 领货退货单状态;
export const DeskOrderBasicState = {
  Draft: 1,
  Audit: 5,
  Types: {
    '1': '草稿',
    '5': '审核通过'
  },
  TypeArray: [{ KeyId: '1', Value: '草稿' }, { KeyId: '5', Value: '审核通过' }]
}

// 盘点单的来源类型;
export const TakingOrderBasicSourceType = {
  Stock: 1,
  Desk: 3,
  Types: {
    '1': '仓库',
    '3': '柜台'
  },
  TypeArray: [{ KeyId: '1', Value: '仓库' }, { KeyId: '3', Value: '柜台' }]
}

// 盘点单状态;
export const TakingOrderBasicState = {
  Taking: 1,
  Finish: 3,
  Cancel: 9,
  Types: {
    '1': '正在盘点',
    '3': '已完成',
    '9': '已取消'
  },
  TypeArray: [
    { KeyId: '1', Value: '正在盘点' },
    { KeyId: '3', Value: '已完成' },
    { KeyId: '9', Value: '已取消' }
  ]
}

// 盘点单的明细状态;
export const TakingOrderItemState = {
  Done: 1,
  Ready: 3,
  Types: {
    '1': '已扫码',
    '3': '未扫码'
  },
  TypeArray: [{ KeyId: '1', Value: '已扫码' }, { KeyId: '3', Value: '未扫码' }]
}

// 损溢单的损溢类型;
export const TakingReportBasicReportType = {
  Loss: 1,
  Over: 3,
  Types: {
    '1': '报损',
    '3': '报溢'
  },
  TypeArray: [{ KeyId: '1', Value: '报损' }, { KeyId: '3', Value: '报溢' }]
}

// 损溢单的来源类型;
export const TakingReportBasicSourceType = {
  Manual: 1,
  Taking: 3,
  Types: {
    '1': '手工创建',
    '3': '盘点'
  },
  TypeArray: [{ KeyId: '1', Value: '手工创建' }, { KeyId: '3', Value: '盘点' }]
}

// 损溢单的状态;
export const TakingReportBasicState = {
  Draft: 1,
  Wait: 3,
  Audit: 5,
  Reject: 7,
  Abandon: 9,
  Cancel: 11,
  Types: {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消'
  },
  TypeArray: [
    { KeyId: '1', Value: '草稿' },
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '审核通过' },
    { KeyId: '7', Value: '审核退回' },
    { KeyId: '9', Value: '已作废' },
    { KeyId: '11', Value: '已取消' }
  ]
}

// 损溢单的位置类型;
export const TakingReportBasicPositionType = {
  Stock: 1,
  Desk: 3,
  Types: {
    '1': '仓库',
    '3': '柜台'
  },
  TypeArray: [{ KeyId: '1', Value: '仓库' }, { KeyId: '3', Value: '柜台' }]
}

// 零售单的终端类型;
export const SaleOrderBasicTerminalType = {
  YXManual: 1,
  Cashier: 3,
  Wechat: 5,
  ERPManual: 7,
  Types: {
    '1': '营销系统',
    '3': '收银台',
    '5': '微信',
    '7': '手工创建'
  },
  TypeArray: [
    { KeyId: '1', Value: '营销系统' },
    { KeyId: '3', Value: '收银台' },
    { KeyId: '5', Value: '微信' },
    { KeyId: '7', Value: '手工创建' }
  ]
}

// 零售单的路线类型;
export const SaleOrderBasicRouteType = {
  StockingCloud: 1,
  MarketingCloud: 3,
  Types: {
    '1': 'ERP系统',
    '3': '营销系统'
  },
  TypeArray: [
    { KeyId: '1', Value: 'ERP系统' },
    { KeyId: '3', Value: '营销系统' }
  ]
}

// 零售单的退货状态;
export const SaleOrderBasicReturnState = {
  No: 1,
  Yes: 3,
  Types: {
    '1': '未退货',
    '3': '已退货'
  },
  TypeArray: [{ KeyId: '1', Value: '未退货' }, { KeyId: '3', Value: '已退货' }]
}

// 零售单状态;
export const SaleOrderBasicState = {
  Wait: 3,
  Audit: 5,
  Abandon: 9,
  Cancel: 11,
  Types: {
    '3': '待审核',
    '5': '已审核',
    '9': '已作废',
    '11': '已取消'
  },
  TypeArray: [
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '已审核' },
    { KeyId: '9', Value: '已作废' },
    { KeyId: '11', Value: '已取消' }
  ]
}

// 售后退货单的终端类型;
export const RmaReturnOrderBasicTerminalType = {
  YXManual: 1,
  Cashier: 3,
  Wechat: 5,
  ERPManual: 7,
  Types: {
    '1': '营销系统',
    '3': '收银台',
    '5': '微信',
    '7': '手工创建'
  },
  TypeArray: [
    { KeyId: '1', Value: '营销系统' },
    { KeyId: '3', Value: '收银台' },
    { KeyId: '5', Value: '微信' },
    { KeyId: '7', Value: '手工创建' }
  ]
}

// 售后维修单的终端类型;
export const RmaRepairOrderBasicTerminalType = {
  StockingCloud: 1,
  Types: {
    '1': 'ERP系统'
  },
  TypeArray: [{ KeyId: '1', Value: 'ERP系统' }]
}

// 售后退货单的路线类型;
export const RmaReturnOrderBasicRouteType = {
  StockingCloud: 1,
  MarketingCloud: 3,
  Types: {
    '1': 'ERP系统',
    '3': '营销系统'
  },
  TypeArray: [
    { KeyId: '1', Value: 'ERP系统' },
    { KeyId: '3', Value: '营销系统' }
  ]
}

// 售后退货单状态;
export const RmaReturnOrderBasicState = {
  Draft: 1,
  Wait: 3,
  Audit: 5,
  Reject: 7,
  Abandon: 9,
  Types: {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废'
  },
  TypeArray: [
    { KeyId: '1', Value: '草稿' },
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '审核通过' },
    { KeyId: '7', Value: '审核退回' },
    { KeyId: '9', Value: '已作废' }
  ]
}

// 标签打印单状态;
export const PrintOrderBasicState = {
  Printing: 1,
  Printed: 3,
  Types: {
    '1': '未打印',
    '3': '已打印'
  },
  TypeArray: [{ KeyId: '1', Value: '未打印' }, { KeyId: '3', Value: '已打印' }]
}

// 付款类型;
export const SaleType = {
  Product: 1,
  Cash: 3,
  Types: {
    '1': '应付',
    '3': '实付'
  },
  TypeArray: [{ KeyId: '1', Value: '应付' }, { KeyId: '3', Value: '实付' }]
}

// 批量修改单状态;
export const ModifyOrderBasicState = {
  Draft: 1,
  Wait: 3,
  Audit: 5,
  Reject: 7,
  Abandon: 9,
  Types: {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废'
  },
  TypeArray: [
    { KeyId: '1', Value: '草稿' },
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '审核通过' },
    { KeyId: '7', Value: '审核退回' },
    { KeyId: '9', Value: '已作废' }
  ]
}

// 成品修改类型;
export const ModifyOrderItemModifyType = {
  Before: 1,
  After: 3,
  Types: {
    '1': '修改前',
    '3': '修改后'
  },
  TypeArray: [{ KeyId: '1', Value: '修改前' }, { KeyId: '3', Value: '修改后' }]
}

// 旧货转换单状态;
export const JunkChangeOrderBasicState = {
  Draft: 1,
  Wait: 3,
  Audit: 5,
  Reject: 7,
  Abandon: 9,
  Cancel: 11,
  Types: {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消'
  },
  TypeArray: [
    { KeyId: '1', Value: '草稿' },
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '审核通过' },
    { KeyId: '7', Value: '审核退回' },
    { KeyId: '9', Value: '已作废' },
    { KeyId: '11', Value: '已取消' }
  ]
}

// 旧货出库单状态;
export const JunkOutOrderBasicState = {
  Draft: 1,
  Wait: 3,
  Audit: 5,
  Reject: 7,
  Abandon: 9,
  Cancel: 11,
  Types: {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消'
  },
  TypeArray: [
    { KeyId: '1', Value: '草稿' },
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '审核通过' },
    { KeyId: '7', Value: '审核退回' },
    { KeyId: '9', Value: '已作废' },
    { KeyId: '11', Value: '已取消' }
  ]
}

// 质保单状态;
export const QualityOrderStatus = {
  Abandon: 1,
  Origin: 3,
  Audit: 5,
  Finish: 7,
  Types: {
    '1': '已作废',
    '3': '未生效',
    '5': '已生效',
    '7': '已回收'
  },
  TypeArray: [
    { KeyId: '1', Value: '已作废' },
    { KeyId: '3', Value: '未生效' },
    { KeyId: '5', Value: '已生效' },
    { KeyId: '7', Value: '已回收' }
  ]
}

// 成品调拨单状态;
export const AppropOrderBasicState = {
  Draft: 1,
  Wait: 3,
  Audit: 5,
  Reject: 7,
  Abandon: 9,
  Types: {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废'
  },
  TypeArray: [
    { KeyId: '1', Value: '草稿' },
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '审核通过' },
    { KeyId: '7', Value: '审核退回' },
    { KeyId: '9', Value: '已作废' }
  ]
}

// 成品调拨收货状态;
export const AppropOrderBasicReceiveType = {
  Wait: 1,
  Received: 3,
  Reject: 5,
  Types: {
    '1': '待收货',
    '3': '已收货',
    '5': '已退回'
  },
  TypeArray: [
    { KeyId: '1', Value: '待收货' },
    { KeyId: '3', Value: '已收货' },
    { KeyId: '5', Value: '已退回' }
  ]
}

// 旧货入库单状态;
export const JunkInnOrderBasicState = {
  Draft: 1,
  Wait: 3,
  Audit: 5,
  Reject: 7,
  Abandon: 9,
  Cancel: 11,
  Types: {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消'
  },
  TypeArray: [
    { KeyId: '1', Value: '草稿' },
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '审核通过' },
    { KeyId: '7', Value: '审核退回' },
    { KeyId: '9', Value: '已作废' },
    { KeyId: '11', Value: '已取消' }
  ]
}

// 旧货修改单状态;
export const JunkModifyOrderBasicState = {
  Draft: 1,
  Wait: 3,
  Audit: 5,
  Reject: 7,
  Abandon: 9,
  Types: {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废'
  },
  TypeArray: [
    { KeyId: '1', Value: '草稿' },
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '审核通过' },
    { KeyId: '7', Value: '审核退回' },
    { KeyId: '9', Value: '已作废' }
  ]
}

// 旧货修改类型;
export const JunkModifyOrderItemModifyType = {
  Before: 1,
  After: 3,
  Types: {
    '1': '修改前',
    '3': '修改后'
  },
  TypeArray: [{ KeyId: '1', Value: '修改前' }, { KeyId: '3', Value: '修改后' }]
}

// 旧货标签打印单状态;
export const JunkPrintOrderBasicState = {
  Printing: 1,
  Printed: 3,
  Types: {
    '1': '未打印',
    '3': '已打印'
  },
  TypeArray: [{ KeyId: '1', Value: '未打印' }, { KeyId: '3', Value: '已打印' }]
}

// 旧货入库单来源类型;
export const JunkInnOrderBasicSourceType = {
  Cashier: 1,
  Erp: 3,
  Types: {
    '1': '收银台',
    '3': 'ERP(手工创建)'
  },
  TypeArray: [
    { KeyId: '1', Value: '收银台' },
    { KeyId: '3', Value: 'ERP(手工创建)' }
  ]
}

// 智能配货计划状态;
export const ReinfPlanBasicState = {
  Draft: 1,
  Wait: 3,
  Audit: 5,
  Reject: 7,
  Abandon: 9,
  Cancel: 11,
  Types: {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已取消'
  },
  TypeArray: [
    { KeyId: '1', Value: '草稿' },
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '审核通过' },
    { KeyId: '7', Value: '审核退回' },
    { KeyId: '9', Value: '已作废' },
    { KeyId: '11', Value: '已取消' }
  ]
}

// 售后维修单状态;
export const RmaRepairOrderBasicState = {
  Wait: 1,
  Repairing: 3,
  Paid: 5,
  Return: 7,
  Finish: 9,
  Abandon: 11,
  Types: {
    '1': '待处理',
    '3': '维修中',
    '5': '待收款',
    '7': '待返还',
    '9': '已完成',
    '11': '已作废'
  },
  TypeArray: [
    { KeyId: '1', Value: '待处理' },
    { KeyId: '3', Value: '维修中' },
    { KeyId: '5', Value: '待收款' },
    { KeyId: '7', Value: '待返还' },
    { KeyId: '9', Value: '已完成' },
    { KeyId: '11', Value: '已作废' }
  ]
}

// 售后维修单操作步骤;
export const RmaRepairOrderBasicCheckType = {
  Create: 1,
  Repairing: 3,
  Repaired: 5,
  Paid: 7,
  Reject: 9,
  Return: 11,
  Types: {
    '1': '新建',
    '3': '维修处理',
    '5': '完成维修',
    '7': '收款',
    '9': '撤回',
    '11': '返还客户'
  },
  TypeArray: [
    { KeyId: '1', Value: '新建' },
    { KeyId: '3', Value: '维修处理' },
    { KeyId: '5', Value: '完成维修' },
    { KeyId: '7', Value: '收款' },
    { KeyId: '9', Value: '撤回' },
    { KeyId: '11', Value: '返还客户' }
  ]
}

// 售后维修单维修地点;
export const RmaRepairOrderBasicRepairPlace = {
  Store: 1,
  Company: 3,
  Factory: 5,
  Types: {
    '1': '门店',
    '3': '总部',
    '5': '工厂'
  },
  TypeArray: [
    { KeyId: '1', Value: '门店' },
    { KeyId: '3', Value: '总部' },
    { KeyId: '5', Value: '工厂' }
  ]
}

// 售后维修单收货状态;
export const RmaRepairOrderBasicReceiveType = {
  Wait: 1,
  Received: 3,
  Reject: 5,
  Types: {
    '1': '待收货',
    '3': '已收货',
    '5': '已退回'
  },
  TypeArray: [
    { KeyId: '1', Value: '待收货' },
    { KeyId: '3', Value: '已收货' },
    { KeyId: '5', Value: '已退回' }
  ]
}

// 授权公众号状态;
export const WxAuthorizerStatus = {
  Unauth: 1,
  Auth: 3,
  Types: {
    '1': '已取消授权',
    '3': '已认证授权'
  },
  TypeArray: [
    { KeyId: '1', Value: '已取消授权' },
    { KeyId: '3', Value: '已认证授权' }
  ]
}

// 微信触发事件;
export const WxEventType = {
  NONEEVENT: 1101,
  SUBSCRIBE: 1103,
  SCANSUBSCRIBE: 1105,
  SCAN: 1107,
  LOCATION: 1109,
  CLICK: 1111,
  VIEW: 1113,
  SCANCODE_PUSH: 1115,
  SCANCODE_WAITMSG: 1117,
  PIC_SYSPHOTO: 1119,
  PIC_PHOTO_OR_ALBUM: 1121,
  PIC_WEIXIN: 1123,
  LOCATION_SELECT: 1125,
  WIFICONNECTED: 1127,
  Types: {
    '1101': '常用事件-普通消息',
    '1103': '常用事件-关注事件',
    '1105': '常用事件-扫描+关注',
    '1107': '常用事件-扫描事件',
    '1109': '常用事件-定位上报事件',
    '1111': '常用事件-各种点击事件',
    '1113': '常用事件-菜单view事件',
    '1115': '常用事件-菜单扫描推送事件',
    '1117': '常用事件-菜单扫描推送waiting事件',
    '1119': '常用事件-菜单相机呼出事件',
    '1121': '常用事件-菜单相机和相册同时呼出事件',
    '1123': '常用事件-菜单相册呼出事件',
    '1125': '常用事件-菜单定位事件',
    '1127': '常用事件-wifi连接事件'
  },
  TypeArray: [
    { KeyId: '1101', Value: '常用事件-普通消息' },
    { KeyId: '1103', Value: '常用事件-关注事件' },
    { KeyId: '1105', Value: '常用事件-扫描+关注' },
    { KeyId: '1107', Value: '常用事件-扫描事件' },
    { KeyId: '1109', Value: '常用事件-定位上报事件' },
    { KeyId: '1111', Value: '常用事件-各种点击事件' },
    { KeyId: '1113', Value: '常用事件-菜单view事件' },
    { KeyId: '1115', Value: '常用事件-菜单扫描推送事件' },
    { KeyId: '1117', Value: '常用事件-菜单扫描推送waiting事件' },
    { KeyId: '1119', Value: '常用事件-菜单相机呼出事件' },
    { KeyId: '1121', Value: '常用事件-菜单相机和相册同时呼出事件' },
    { KeyId: '1123', Value: '常用事件-菜单相册呼出事件' },
    { KeyId: '1125', Value: '常用事件-菜单定位事件' },
    { KeyId: '1127', Value: '常用事件-wifi连接事件' }
  ]
}

// 微信关键词的匹配模式;
export const WxMatchType = {
  AllOf: 1,
  PartOf: 3,
  Types: {
    '1': '完全匹配',
    '3': '部分匹配'
  },
  TypeArray: [
    { KeyId: '1', Value: '完全匹配' },
    { KeyId: '3', Value: '部分匹配' }
  ]
}

// 微信的回复模式;
export const WxModeType = {
  Random: 1,
  AllOf: 3,
  Types: {
    '1': '随机回复',
    '3': '全部回复'
  },
  TypeArray: [
    { KeyId: '1', Value: '随机回复' },
    { KeyId: '3', Value: '全部回复' }
  ]
}

// 微信的回复类型;
export const WxReplyType = {
  Subscribe: 1,
  AutoRpl: 3,
  Keyword: 5,
  Types: {
    '1': '被关注回复',
    '3': '自动回复',
    '5': '关键字回复'
  },
  TypeArray: [
    { KeyId: '1', Value: '被关注回复' },
    { KeyId: '3', Value: '自动回复' },
    { KeyId: '5', Value: '关键字回复' }
  ]
}

// 微信的内容类型;
export const WxNoteType = {
  Text: 1,
  Image: 3,
  Voice: 5,
  Video: 7,
  Music: 9,
  News: 11,
  Types: {
    '1': '文字',
    '3': '图片',
    '5': '语音',
    '7': '视频',
    '9': '音乐',
    '11': '图文'
  },
  TypeArray: [
    { KeyId: '1', Value: '文字' },
    { KeyId: '3', Value: '图片' },
    { KeyId: '5', Value: '语音' },
    { KeyId: '7', Value: '视频' },
    { KeyId: '9', Value: '音乐' },
    { KeyId: '11', Value: '图文' }
  ]
}

// 商户菜单的响应类型;
export const WxMenuType = {
  Type1: 1,
  Type2: 3,
  Type3: 5,
  Type4: 7,
  Type5: 9,
  Types: {
    '1': '跳转的网址',
    '3': '消息关键词',
    '5': '微信扫一扫',
    '7': '小程序菜单',
    '9': '点击事件'
  },
  TypeArray: [
    { KeyId: '1', Value: '跳转的网址' },
    { KeyId: '3', Value: '消息关键词' },
    { KeyId: '5', Value: '微信扫一扫' },
    { KeyId: '7', Value: '小程序菜单' },
    { KeyId: '9', Value: '点击事件' }
  ]
}

// 授权力度;
export const WxAuthorizerType = {
  Group: 1,
  Compony: 3,
  Store: 5,
  Career: 7,
  AppletGroup: 9,
  AppletCompony: 11,
  AppletStore: 13,
  Types: {
    '1': '授权公众号(集团)',
    '3': '授权公众号(商户)',
    '5': '授权公众号(商户)',
    '7': '授权公众号(合伙人)',
    '9': '授权小程序(集团)',
    '11': '授权小程序(商户)',
    '13': '授权小程序(门店)'
  },
  TypeArray: [
    { KeyId: '1', Value: '授权公众号(集团)' },
    { KeyId: '3', Value: '授权公众号(商户)' },
    { KeyId: '5', Value: '授权公众号(商户)' },
    { KeyId: '7', Value: '授权公众号(合伙人)' },
    { KeyId: '9', Value: '授权小程序(集团)' },
    { KeyId: '11', Value: '授权小程序(商户)' },
    { KeyId: '13', Value: '授权小程序(门店)' }
  ]
}

// 事件类型;
export const ClickType = {
  Text: 1,
  Image: 3,
  Types: {
    '1': '文字',
    '3': '图片'
  },
  TypeArray: [{ KeyId: '1', Value: '文字' }, { KeyId: '3', Value: '图片' }]
}

// 小程序消息模板发送类型;
export const TemplateSendType = {
  Success: 1,
  Cancel: 3,
  Send: 5,
  Collage: 7,
  Integral: 9,
  Bargain: 11,
  Types: {
    '1': '订单支付成功通知',
    '3': '订单取消通知',
    '5': '订单发货提醒',
    '7': '拼团结果通知',
    '9': '积分兑换成功通知',
    '11': '砍价进度通知'
  },
  TypeArray: [
    { KeyId: '1', Value: '订单支付成功通知' },
    { KeyId: '3', Value: '订单取消通知' },
    { KeyId: '5', Value: '订单发货提醒' },
    { KeyId: '7', Value: '拼团结果通知' },
    { KeyId: '9', Value: '积分兑换成功通知' },
    { KeyId: '11', Value: '砍价进度通知' }
  ]
}

// 小程序发布代码审核状态;
export const WxAppletStatus = {
  Audit: 0,
  Failed: 1,
  Progress: 2,
  Wait: 3,
  PublishedSuccess: 4,
  PublishedFailed: 5,
  UnKnow: 6,
  Types: {
    '0': '审核成功',
    '1': '审核失败',
    '2': '审核中',
    '3': '待提交',
    '4': '发布成功',
    '5': '发布失败',
    '6': '未知'
  },
  TypeArray: [
    { KeyId: '0', Value: '审核成功' },
    { KeyId: '1', Value: '审核失败' },
    { KeyId: '2', Value: '审核中' },
    { KeyId: '3', Value: '待提交' },
    { KeyId: '4', Value: '发布成功' },
    { KeyId: '5', Value: '发布失败' },
    { KeyId: '6', Value: '未知' }
  ]
}

// 套接字通讯的成功失败类型;
export const SocketTelnetCodeType = {
  Failed: 0,
  Succeed: 1,
  Types: {
    '0': '失败',
    '1': '成功'
  },
  TypeArray: [{ KeyId: '0', Value: '失败' }, { KeyId: '1', Value: '成功' }]
}

// 电子标签的通讯项目;
export const ProjectId = {
  GoodsTags: 1,
  Types: {
    '1': '电子标签'
  },
  TypeArray: [{ KeyId: '1', Value: '电子标签' }]
}

// 电子标签的通讯项目通道类型;
export const GoodsTagsColorType = {
  BlackWhite: 1,
  Red: 2,
  BlackWhite2: 3,
  Red2: 4,
  Types: {
    '1': '黑白，本次图像单通道',
    '2': '红色，本次图像单通道',
    '3': '黑白，本次图像两通道',
    '4': '红色，本次图像两通道'
  },
  TypeArray: [
    { KeyId: '1', Value: '黑白，本次图像单通道' },
    { KeyId: '2', Value: '红色，本次图像单通道' },
    { KeyId: '3', Value: '黑白，本次图像两通道' },
    { KeyId: '4', Value: '红色，本次图像两通道' }
  ]
}

// 电子标签的通讯指令枚举;
export const GoodsTagsTelnetCommand = {
  REFRESH: 0,
  SHUTDOWN: 1,
  REG: 2,
  HR: 3,
  UD: 4,
  RC: 5,
  UC: 6,
  Types: {
    '0': '刷新屏幕',
    '1': '关机',
    '2': '基站注册',
    '3': '基站心跳',
    '4': '下载命令转发',
    '5': '通道接收回复',
    '6': '下载命令更新回复'
  },
  TypeArray: [
    { KeyId: '0', Value: '刷新屏幕' },
    { KeyId: '1', Value: '关机' },
    { KeyId: '2', Value: '基站注册' },
    { KeyId: '3', Value: '基站心跳' },
    { KeyId: '4', Value: '下载命令转发' },
    { KeyId: '5', Value: '通道接收回复' },
    { KeyId: '6', Value: '下载命令更新回复' }
  ]
}

// 消息队列类型;
export const MessageQueueType = {
  CloudGlobalCommonErrorQueue: 0,
  MerchantCloudSecurityDownloadQueue: 1,
  StockingCloudGlobalCommonQueue: 2,
  StockingCloudGoodsTagsSocketReceiptQueue: 3,
  StockingCloudGoodsTagsSocketSenderQueue: 4,
  SpreadCloudGlobalCommonQueue: 5,
  SpreadCloudSprOrderQueue: 6,
  SpreadCloudSendTemplateMessageQueue: 7,
  StockingCloudSaleAndRmaReturnTempQueue: 8,
  Types: {
    '0': '公共错误消息队列',
    '1': '系统设置的附件下载队列',
    '2': 'ERP系统的公共消息队列',
    '3': 'ERP系统的电子标签项目接收指令消息队列',
    '4': 'ERP系统的电子标签项目发送指令消息队列',
    '5': '营销活动通用队列',
    '6': '营销活动订单队列',
    '7': '营销活动模板消息通知队列',
    '8': '临时'
  },
  TypeArray: [
    { KeyId: '0', Value: '公共错误消息队列' },
    { KeyId: '1', Value: '系统设置的附件下载队列' },
    { KeyId: '2', Value: 'ERP系统的公共消息队列' },
    { KeyId: '3', Value: 'ERP系统的电子标签项目接收指令消息队列' },
    { KeyId: '4', Value: 'ERP系统的电子标签项目发送指令消息队列' },
    { KeyId: '5', Value: '营销活动通用队列' },
    { KeyId: '6', Value: '营销活动订单队列' },
    { KeyId: '7', Value: '营销活动模板消息通知队列' },
    { KeyId: '8', Value: '临时' }
  ]
}

// 销售汇总项(销售);
export const SaleOrderCollectType = {
  CreateTime: 1,
  CharacterId: 3,
  DeskIds: 7,
  ClassifyId: 9,
  DeskId: 11,
  MaterialType: 15,
  CategoryType: 17,
  GoldType: 19,
  RetailType: 21,
  FinanceType: 23,
  CashierUserId: 25,
  MainUserId: 27,
  AssistUserId: 29,
  Types: {
    '1': '销售日期',
    '3': '门店',
    '7': '仓库',
    '9': '柜台分组',
    '11': '柜台',
    '15': '材质类型',
    '17': '品类类型',
    '19': '成色',
    '21': '零售方式',
    '23': '货品类别',
    '25': '收银员',
    '27': '主销导购',
    '29': '辅销导购'
  },
  TypeArray: [
    { KeyId: '1', Value: '销售日期' },
    { KeyId: '3', Value: '门店' },
    { KeyId: '7', Value: '仓库' },
    { KeyId: '9', Value: '柜台分组' },
    { KeyId: '11', Value: '柜台' },
    { KeyId: '15', Value: '材质类型' },
    { KeyId: '17', Value: '品类类型' },
    { KeyId: '19', Value: '成色' },
    { KeyId: '21', Value: '零售方式' },
    { KeyId: '23', Value: '货品类别' },
    { KeyId: '25', Value: '收银员' },
    { KeyId: '27', Value: '主销导购' },
    { KeyId: '29', Value: '辅销导购' }
  ]
}

// 销售汇总项(退货);
export const RmaReturnOrderCollectType = {
  CreateTime: 1,
  CharacterId: 3,
  DeskIds: 7,
  ClassifyId: 9,
  DeskId: 11,
  MaterialType: 15,
  CategoryType: 17,
  GoldType: 19,
  RetailType: 21,
  FinanceType: 23,
  CashierUserId: 25,
  MainUserId: 27,
  AssistUserId: 29,
  Types: {
    '1': '退货日期',
    '3': '门店',
    '7': '仓库',
    '9': '柜台分组',
    '11': '柜台',
    '15': '材质类型',
    '17': '品类类型',
    '19': '成色',
    '21': '零售方式',
    '23': '货品类别',
    '25': '收银员',
    '27': '主销人员',
    '29': '辅销人员'
  },
  TypeArray: [
    { KeyId: '1', Value: '退货日期' },
    { KeyId: '3', Value: '门店' },
    { KeyId: '7', Value: '仓库' },
    { KeyId: '9', Value: '柜台分组' },
    { KeyId: '11', Value: '柜台' },
    { KeyId: '15', Value: '材质类型' },
    { KeyId: '17', Value: '品类类型' },
    { KeyId: '19', Value: '成色' },
    { KeyId: '21', Value: '零售方式' },
    { KeyId: '23', Value: '货品类别' },
    { KeyId: '25', Value: '收银员' },
    { KeyId: '27', Value: '主销人员' },
    { KeyId: '29', Value: '辅销人员' }
  ]
}

// 库存汇总项;
export const StockQtyCollectType = {
  CharacterId: 3,
  DeskIds: 5,
  ClassifyId: 7,
  DeskId: 9,
  MaterialType: 13,
  CategoryType: 15,
  GoldType: 17,
  RetailType: 19,
  FinanceType: 21,
  Types: {
    '3': '门店',
    '5': '仓库',
    '7': '柜台分组',
    '9': '柜台',
    '13': '材质类型',
    '15': '品类类型',
    '17': '成色',
    '19': '零售方式',
    '21': '货品类别'
  },
  TypeArray: [
    { KeyId: '3', Value: '门店' },
    { KeyId: '5', Value: '仓库' },
    { KeyId: '7', Value: '柜台分组' },
    { KeyId: '9', Value: '柜台' },
    { KeyId: '13', Value: '材质类型' },
    { KeyId: '15', Value: '品类类型' },
    { KeyId: '17', Value: '成色' },
    { KeyId: '19', Value: '零售方式' },
    { KeyId: '21', Value: '货品类别' }
  ]
}

// 库龄状态;
export const StockQtyTimeStatus = {
  UnSold: 1,
  Solding: 3,
  SoldOut: 5,
  Types: {
    '1': '未销售',
    '3': '销售中',
    '5': '已售馨'
  },
  TypeArray: [
    { KeyId: '1', Value: '未销售' },
    { KeyId: '3', Value: '销售中' },
    { KeyId: '5', Value: '已售馨' }
  ]
}

// 财务报表类型;
export const FinanceBudgetType = {
  Daily: 1,
  Weekly: 3,
  Monthly: 5,
  Quarterly: 7,
  Yearly: 9,
  Types: {
    '1': '收支日报',
    '3': '收支周报',
    '5': '收支月报',
    '7': '收支季报',
    '9': '收支年报'
  },
  TypeArray: [
    { KeyId: '1', Value: '收支日报' },
    { KeyId: '3', Value: '收支周报' },
    { KeyId: '5', Value: '收支月报' },
    { KeyId: '7', Value: '收支季报' },
    { KeyId: '9', Value: '收支年报' }
  ]
}

// 角色类型(枚举);
export const CharacterType = {
  Lingcb: 1001,
  BranchLingcb: 1101,
  Group: 2001,
  Company: 2101,
  Store: 2201,
  Supplier: 3001,
  Provider: 3101,
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
    { KeyId: '1001', Value: '零成本平台管控中心' },
    { KeyId: '1101', Value: '零成本分公司' },
    { KeyId: '2001', Value: '集团总部管控中心' },
    { KeyId: '2101', Value: '商户总部管理中心' },
    { KeyId: '2201', Value: '门店管理中心' },
    { KeyId: '3001', Value: '礼品供应商管理中心' },
    { KeyId: '3101', Value: '供应链供应商管理中心' }
  ]
}

// 门店类型(枚举);
export const SecurityPackBasicMultiType = {
  One: 1,
  More: 3,
  Types: {
    '1': '一号一店',
    '3': '一号多店'
  },
  TypeArray: [
    { KeyId: '1', Value: '一号一店' },
    { KeyId: '3', Value: '一号多店' }
  ]
}

// 套餐类型(枚举, 内外部);
export const SecurityPackType = {
  Inner: 1,
  Outer: 3,
  Types: {
    '1': '内部',
    '3': '外部'
  },
  TypeArray: [{ KeyId: '1', Value: '内部' }, { KeyId: '3', Value: '外部' }]
}

// 系统类型(枚举);
export const SecurityPackSystemType = {
  Inner: 1,
  Outer: 3,
  Types: {
    '1': '内部',
    '3': '外部'
  },
  TypeArray: [{ KeyId: '1', Value: '内部' }, { KeyId: '3', Value: '外部' }]
}

// 营销系统的微信端角色类型;
export const SecurityUserBerthType = {
  Employee: 1,
  Master: 3,
  Administrator: 5,
  Types: {
    '1': '店员',
    '3': '店长',
    '5': '超级管理员'
  },
  TypeArray: [
    { KeyId: '1', Value: '店员' },
    { KeyId: '3', Value: '店长' },
    { KeyId: '5', Value: '超级管理员' }
  ]
}

// 收银台角色类型;
export const SecurityUserCashierType = {
  Employee: 1,
  Cashier: 3,
  Other: 9,
  Types: {
    '1': '导购',
    '3': '收银员',
    '9': '其他'
  },
  TypeArray: [
    { KeyId: '1', Value: '导购' },
    { KeyId: '3', Value: '收银员' },
    { KeyId: '9', Value: '其他' }
  ]
}

// 员工在职状态;
export const SecurityUserVitaState = {
  Try: 1,
  Official: 3,
  Leaved: 5,
  Types: {
    '1': '试用',
    '3': '正式',
    '5': '离职'
  },
  TypeArray: [
    { KeyId: '1', Value: '试用' },
    { KeyId: '3', Value: '正式' },
    { KeyId: '5', Value: '离职' }
  ]
}

// 账户状态;
export const SecurityUserState = {
  Abandon: 1,
  Wait: 3,
  Audit: 5,
  Types: {
    '1': '已作废',
    '3': '待审核',
    '5': '已审核'
  },
  TypeArray: [
    { KeyId: '1', Value: '已作废' },
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '已审核' }
  ]
}

// 登录认证类型(枚举);
export const SecurityRoleAuthType = {
  None: 1,
  Message: 3,
  Types: {
    '1': '不认证',
    '3': '短信'
  },
  TypeArray: [{ KeyId: '1', Value: '不认证' }, { KeyId: '3', Value: '短信' }]
}

// 系统菜单的终端类型;
export const SecurityMenuTerminalType = {
  Web: 1,
  App: 3,
  Types: {
    '1': 'PC端',
    '3': '手机端'
  },
  TypeArray: [{ KeyId: '1', Value: 'PC端' }, { KeyId: '3', Value: '手机端' }]
}

// 系统菜单的子系统类型;
export const SecurityMenuSubsetType = {
  MarketingCloud: 1,
  PerformanceCloud: 3,
  ScoringCloud: 5,
  MessageCloud: 7,
  StockingCloud: 9,
  MembershipCloud: 11,
  SpreadCloud: 13,
  GiftingCloud: 15,
  CollegeCloud: 17,
  SystemSetting: 99,
  Types: {
    '1': '营销系统',
    '3': '薪酬绩效系统',
    '5': '积分卡券系统',
    '7': '短信系统',
    '9': 'ERP系统',
    '11': 'CRM系统',
    '13': '营销活动系统',
    '15': '礼品商城系统',
    '17': '商学院系统',
    '99': '系统设置'
  },
  TypeArray: [
    { KeyId: '1', Value: '营销系统' },
    { KeyId: '3', Value: '薪酬绩效系统' },
    { KeyId: '5', Value: '积分卡券系统' },
    { KeyId: '7', Value: '短信系统' },
    { KeyId: '9', Value: 'ERP系统' },
    { KeyId: '11', Value: 'CRM系统' },
    { KeyId: '13', Value: '营销活动系统' },
    { KeyId: '15', Value: '礼品商城系统' },
    { KeyId: '17', Value: '商学院系统' },
    { KeyId: '99', Value: '系统设置' }
  ]
}

// 文件下载类型;
export const SecurityDownloadState = {
  Wait: 1,
  Done: 3,
  Fail: 5,
  Types: {
    '1': '正在导出',
    '3': '导出完成',
    '5': '导出失败'
  },
  TypeArray: [
    { KeyId: '1', Value: '正在导出' },
    { KeyId: '3', Value: '导出完成' },
    { KeyId: '5', Value: '导出失败' }
  ]
}

// 数据字典类型;
export const SettingDictionaryType = {
  PurchaseOrder: 1,
  PriceOrder: 3,
  FinanceBill1: 5,
  FinanceBill2: 7,
  LabelPrint: 9,
  GoodsModify: 11,
  JunkChange: 13,
  JunkOut: 15,
  Approp: 17,
  JunkPrint: 19,
  JunkModify: 21,
  RmaRepair: 23,
  Types: {
    '1': '采购退货原因',
    '3': '调价原因',
    '5': '收付款账户',
    '7': '收付款方式',
    '9': '标签打印原因',
    '11': '成品修改原因',
    '13': '旧货转成品原因',
    '15': '旧货出库原因',
    '17': '调拨原因',
    '19': '旧货打印原因',
    '21': '旧货修改原因',
    '23': '售后维修项目'
  },
  TypeArray: [
    { KeyId: '1', Value: '采购退货原因' },
    { KeyId: '3', Value: '调价原因' },
    { KeyId: '5', Value: '收付款账户' },
    { KeyId: '7', Value: '收付款方式' },
    { KeyId: '9', Value: '标签打印原因' },
    { KeyId: '11', Value: '成品修改原因' },
    { KeyId: '13', Value: '旧货转成品原因' },
    { KeyId: '15', Value: '旧货出库原因' },
    { KeyId: '17', Value: '调拨原因' },
    { KeyId: '19', Value: '旧货打印原因' },
    { KeyId: '21', Value: '旧货修改原因' },
    { KeyId: '23', Value: '售后维修项目' }
  ]
}

// 货品属性模板的分组类型;
export const SettingAttributeGroupType = {
  Basic: 1,
  Stone1: 3,
  Stone2: 5,
  Types: {
    '1': '基础',
    '3': '主石',
    '5': '副石'
  },
  TypeArray: [
    { KeyId: '1', Value: '基础' },
    { KeyId: '3', Value: '主石' },
    { KeyId: '5', Value: '副石' }
  ]
}

// 货品属性模板的属性类型;
export const SettingAttributeType = {
  TextOfTextual: 1,
  TextOfInteger: 3,
  SelectOfEnums: 5,
  TextOfDecimal: 7,
  TextOfPercent: 9,
  Types: {
    '1': '文本',
    '3': '整型',
    '5': '选项',
    '7': '数字',
    '9': '0-1小数'
  },
  TypeArray: [
    { KeyId: '1', Value: '文本' },
    { KeyId: '3', Value: '整型' },
    { KeyId: '5', Value: '选项' },
    { KeyId: '7', Value: '数字' },
    { KeyId: '9', Value: '0-1小数' }
  ]
}

// 系统公告状态;
export const SettingNoticeStatus = {
  Abandon: 1,
  Origin: 3,
  Audit: 5,
  Reject: 7,
  Types: {
    '1': '已作废',
    '3': '待审核',
    '5': '已审核',
    '7': '已拒绝'
  },
  TypeArray: [
    { KeyId: '1', Value: '已作废' },
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '已审核' },
    { KeyId: '7', Value: '已拒绝' }
  ]
}

// 帮助中心状态;
export const StoreSettingHelpStatus = {
  Abandon: 1,
  Origin: 3,
  Audit: 5,
  Reject: 7,
  Types: {
    '1': '已作废',
    '3': '待审核',
    '5': '已审核',
    '7': '已拒绝'
  },
  TypeArray: [
    { KeyId: '1', Value: '已作废' },
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '已审核' },
    { KeyId: '7', Value: '已拒绝' }
  ]
}

// 零售修改类型;
export const StoreSettingParameterEditType = {
  Unable: 1,
  Limited: 3,
  Unlimited: 5,
  Types: {
    '1': '不允许修改',
    '3': '允许',
    '5': '允许任意修改'
  },
  TypeArray: [
    { KeyId: '1', Value: '不允许修改' },
    { KeyId: '3', Value: '允许' },
    { KeyId: '5', Value: '允许任意修改' }
  ]
}

// 花呗分期手续费;
export const StoreSettingParameterCreditPayType = {
  Merchant: 1,
  Customer: 3,
  Types: {
    '1': '商户承担',
    '3': '客户承担'
  },
  TypeArray: [
    { KeyId: '1', Value: '商户承担' },
    { KeyId: '3', Value: '客户承担' }
  ]
}

// 打赏类型;
export const StoreSettingParameterRewardType = {
  RewardAndScore: 1,
  Reward: 3,
  Score: 5,
  None: 7,
  Types: {
    '1': '启用评分以及打赏',
    '3': '启用打赏',
    '5': '启用评分',
    '7': '均不启用'
  },
  TypeArray: [
    { KeyId: '1', Value: '启用评分以及打赏' },
    { KeyId: '3', Value: '启用打赏' },
    { KeyId: '5', Value: '启用评分' },
    { KeyId: '7', Value: '均不启用' }
  ]
}

// 调拨是否结算(枚举);
export const StoreSettingParameterAppropSettleType = {
  None: 1,
  Settle: 3,
  Types: {
    '1': '不结算',
    '3': '结算'
  },
  TypeArray: [{ KeyId: '1', Value: '不结算' }, { KeyId: '3', Value: '结算' }]
}

// 回收工费类型;
export const StoreSettingGpriceRecallType = {
  PieceOf: 1,
  GramOf: 3,
  Types: {
    '1': '按件',
    '3': '按克'
  },
  TypeArray: [{ KeyId: '1', Value: '按件' }, { KeyId: '3', Value: '按克' }]
}

// 截取方式;
export const SettingTempletItemSplitType = {
  Forward: 1,
  Backward: 3,
  Types: {
    '1': '前',
    '3': '后'
  },
  TypeArray: [{ KeyId: '1', Value: '前' }, { KeyId: '3', Value: '后' }]
}

// 库存类型;
export const StockType = {
  StockOfSummary: 1,
  StockOfSurplus: 3,
  StockOfDesk: 5,
  Types: {
    '1': '仓库总数',
    '3': '仓库结余',
    '5': '柜台库存'
  },
  TypeArray: [
    { KeyId: '1', Value: '仓库总数' },
    { KeyId: '3', Value: '仓库结余' },
    { KeyId: '5', Value: '柜台库存' }
  ]
}

// 库存比较类型;
export const StockCompareType = {
  AvailableQtyThanZero: 1,
  AvailableQtyEqualZero: 3,
  FinanceQtyThanZero: 5,
  FinanceQtyEqualZero: 7,
  Types: {
    '1': '可用库存>0',
    '3': '可用库存=0',
    '5': '账面库存>0',
    '7': '账面库存=0'
  },
  TypeArray: [
    { KeyId: '1', Value: '可用库存>0' },
    { KeyId: '3', Value: '可用库存=0' },
    { KeyId: '5', Value: '账面库存>0' },
    { KeyId: '7', Value: '账面库存=0' }
  ]
}

// 操作类型;
export const StockLogOperationType = {
  PurchaseOrderAudit: 1,
  PurchaseOrderCancel: 3,
  ReturnOrderAudit: 5,
  ReturnOrderCancel: 7,
  TakingReportLossOrderAudit: 9,
  TakingReportLossOrderCancel: 11,
  TakingReportOverOrderAudit: 13,
  TakingReportOverOrderCancel: 15,
  AppropOrderRecieve: 17,
  AppropOrderAudit: 19,
  AppropOrderReturn: 21,
  JunkChangeOrderAudit: 23,
  JunkChangeOrderCancel: 25,
  SaleOrderAudit: 27,
  RmaSaleOrderAudit: 29,
  SaleOrderCancel: 31,
  Types: {
    '1': '采购入库(审核)',
    '3': '采购入库(取消)',
    '5': '成品退货(审核)',
    '7': '成品退货(取消)',
    '9': '报损单(审核)',
    '11': '报损单(取消)',
    '13': '报溢单(审核)',
    '15': '报溢单(取消)',
    '17': '成品调拨(入库)',
    '19': '成品调拨(出库)',
    '21': '成品调拨(核对退回)',
    '23': '旧货转成品库(审核)',
    '25': '旧货转成品库(取消)',
    '27': '零售',
    '29': '售后退货',
    '31': '零售(取消)'
  },
  TypeArray: [
    { KeyId: '1', Value: '采购入库(审核)' },
    { KeyId: '3', Value: '采购入库(取消)' },
    { KeyId: '5', Value: '成品退货(审核)' },
    { KeyId: '7', Value: '成品退货(取消)' },
    { KeyId: '9', Value: '报损单(审核)' },
    { KeyId: '11', Value: '报损单(取消)' },
    { KeyId: '13', Value: '报溢单(审核)' },
    { KeyId: '15', Value: '报溢单(取消)' },
    { KeyId: '17', Value: '成品调拨(入库)' },
    { KeyId: '19', Value: '成品调拨(出库)' },
    { KeyId: '21', Value: '成品调拨(核对退回)' },
    { KeyId: '23', Value: '旧货转成品库(审核)' },
    { KeyId: '25', Value: '旧货转成品库(取消)' },
    { KeyId: '27', Value: '零售' },
    { KeyId: '29', Value: '售后退货' },
    { KeyId: '31', Value: '零售(取消)' }
  ]
}

// 库存变化类型;
export const StockChangeType = {
  WaitOut: 1,
  WaitOutToOut: 3,
  WaitOutToBack: 5,
  RmaSaleOrderAuditIn: 7,
  SaleOrderCancelIn: 9,
  Types: {
    '1': '待出库',
    '3': '待出库->出库',
    '5': '待出库->入库',
    '7': '入库',
    '9': '入库'
  },
  TypeArray: [
    { KeyId: '1', Value: '待出库' },
    { KeyId: '3', Value: '待出库->出库' },
    { KeyId: '5', Value: '待出库->入库' },
    { KeyId: '7', Value: '入库' },
    { KeyId: '9', Value: '入库' }
  ]
}

// 库存周转情况;
export const StockTurnType = {
  HighTurn: 1,
  LowTurn: 3,
  NotTurn: 5,
  Types: {
    '1': '高周转',
    '3': '低周转',
    '5': '未周转'
  },
  TypeArray: [
    { KeyId: '1', Value: '高周转' },
    { KeyId: '3', Value: '低周转' },
    { KeyId: '5', Value: '未周转' }
  ]
}

// 库存周转状态;
export const StockTurnStatus = {
  Effective: 1,
  UnEffective: 3,
  Types: {
    '1': '有效库存',
    '3': '无效库存'
  },
  TypeArray: [
    { KeyId: '1', Value: '有效库存' },
    { KeyId: '3', Value: '无效库存' }
  ]
}

// 模板类型;
export const StoreSettingPrintingType = {
  MarketingCloudElectronicQuality: 1101,
  GiftingCloudGiftExpressOrder: 7101,
  GiftingCloudGiftSaleOrder: 7103,
  StockingCloudGoodsLabel: 9101,
  MarketingCloudPaperQuality: 9105,
  StockingCloudGoodsTags: 9107,
  StockingCloudPurchaseOrder: 9201,
  StockingCloudReturnOrder: 9203,
  StockingCloudTakingOrder: 9205,
  StockingCloudPriceOrder: 9207,
  StockingCloudRmaReturnOrder: 9211,
  StockingCloudTakingReport1: 9217,
  StockingCloudTakingReport3: 9219,
  StockingCloudFinanceBillBasic1: 9221,
  StockingCloudFinanceBillBasic3: 9223,
  StockingCloudFinanceBillPaid1: 9225,
  StockingCloudFinanceBillPaid3: 9227,
  StockingCloudJunkChangeOrder: 9233,
  StockingCloudJunkOutOrder: 9235,
  StockingCloudAppropOrder: 9237,
  StockingCloudJunkPrintOrder: 9243,
  StockingCloudReinfPlanOrder: 9245,
  StockingCloudRmaRepairOrder: 9247,
  StockingCloudSaleMasterOrder: 9249,
  Types: {
    '1101': '电子质保单',
    '7101': '礼品快递单',
    '7103': '礼品订单',
    '9101': '货品标签',
    '9105': '质保单打印模板',
    '9107': '电子标签',
    '9201': '成品采购入库单',
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
    '9237': '成品调拨单',
    '9243': '旧货打印单',
    '9245': '配货计划单',
    '9247': '维修单',
    '9249': '零售单'
  },
  TypeArray: [
    { KeyId: '1101', Value: '电子质保单' },
    { KeyId: '7101', Value: '礼品快递单' },
    { KeyId: '7103', Value: '礼品订单' },
    { KeyId: '9101', Value: '货品标签' },
    { KeyId: '9105', Value: '质保单打印模板' },
    { KeyId: '9107', Value: '电子标签' },
    { KeyId: '9201', Value: '成品采购入库单' },
    { KeyId: '9203', Value: '成品退货单' },
    { KeyId: '9205', Value: '成品盘点单' },
    { KeyId: '9207', Value: '成品调价单' },
    { KeyId: '9211', Value: '售后退货单' },
    { KeyId: '9217', Value: '成品报损单' },
    { KeyId: '9219', Value: '成品报溢单' },
    { KeyId: '9221', Value: '应收款单' },
    { KeyId: '9223', Value: '应付款单' },
    { KeyId: '9225', Value: '收款单' },
    { KeyId: '9227', Value: '付款单' },
    { KeyId: '9233', Value: '旧货转成品库' },
    { KeyId: '9235', Value: '旧货出库单' },
    { KeyId: '9237', Value: '成品调拨单' },
    { KeyId: '9243', Value: '旧货打印单' },
    { KeyId: '9245', Value: '配货计划单' },
    { KeyId: '9247', Value: '维修单' },
    { KeyId: '9249', Value: '零售单' }
  ]
}

// 模板状态;
export const StoreSettingPrintingState = {
  Deleted: 1,
  Normal: 3,
  Designing: 5,
  Types: {
    '1': '已删除',
    '3': '已启用',
    '5': '设计中'
  },
  TypeArray: [
    { KeyId: '1', Value: '已删除' },
    { KeyId: '3', Value: '已启用' },
    { KeyId: '5', Value: '设计中' }
  ]
}

// 打印控制器类型;
export const StoreSettingPrintingControllerType = {
  Viewer: 1,
  Designer: 3,
  Print: 5,
  Types: {
    '1': '预览',
    '3': '设计',
    '5': '打印'
  },
  TypeArray: [
    { KeyId: '1', Value: '预览' },
    { KeyId: '3', Value: '设计' },
    { KeyId: '5', Value: '打印' }
  ]
}

// 销售方式;
export const StoreBasicBusinessType = {
  Retail: 10,
  All: 20,
  Wholesale: 30,
  Types: {
    '10': '零售',
    '20': '零售+批发',
    '30': '批发'
  },
  TypeArray: [
    { KeyId: '10', Value: '零售' },
    { KeyId: '20', Value: '零售+批发' },
    { KeyId: '30', Value: '批发' }
  ]
}

// 主营品类;
export const StoreBasicFlagshipType = {
  Flagship01: 1,
  Flagship02: 2,
  Flagship03: 3,
  Flagship04: 4,
  Flagship05: 5,
  Flagship06: 6,
  Flagship07: 7,
  Types: {
    '1': '黄金',
    '2': '钻石',
    '3': '翡翠',
    '4': '珍珠',
    '5': '琥珀',
    '6': '铂金',
    '7': '其它'
  },
  TypeArray: [
    { KeyId: '1', Value: '黄金' },
    { KeyId: '2', Value: '钻石' },
    { KeyId: '3', Value: '翡翠' },
    { KeyId: '4', Value: '珍珠' },
    { KeyId: '5', Value: '琥珀' },
    { KeyId: '6', Value: '铂金' },
    { KeyId: '7', Value: '其它' }
  ]
}

// 门店状态;
export const StoreBasicState = {
  Close: 1,
  Open: 3,
  Types: {
    '1': '已停业',
    '3': '已开业'
  },
  TypeArray: [{ KeyId: '1', Value: '已停业' }, { KeyId: '3', Value: '已开业' }]
}

// 套餐类型;
export const StorePackageType = {
  Free: 1,
  Try: 3,
  Flow: 5,
  Date: 7,
  Types: {
    '1': '免费开通',
    '3': '试用',
    '5': '按量付费',
    '7': '按期付费'
  },
  TypeArray: [
    { KeyId: '1', Value: '免费开通' },
    { KeyId: '3', Value: '试用' },
    { KeyId: '5', Value: '按量付费' },
    { KeyId: '7', Value: '按期付费' }
  ]
}

// 品类设置的科目类型;
export const StoreSettingCategoryType = {
  CategoryType: 1,
  MaterialType: 3,
  GoldType: 5,
  SeriesType: 7,
  PaymentType: 9,
  Types: {
    '1': '品类',
    '3': '材质',
    '5': '成色',
    '7': '系列',
    '9': '支付方式'
  },
  TypeArray: [
    { KeyId: '1', Value: '品类' },
    { KeyId: '3', Value: '材质' },
    { KeyId: '5', Value: '成色' },
    { KeyId: '7', Value: '系列' },
    { KeyId: '9', Value: '支付方式' }
  ]
}

// 门店设置的领退货验证方式;
export const StoreSettingParameterValidateType = {
  None: 1,
  Password: 3,
  Types: {
    '1': '无需验证',
    '3': '账号密码验证'
  },
  TypeArray: [
    { KeyId: '1', Value: '无需验证' },
    { KeyId: '3', Value: '账号密码验证' }
  ]
}

// 门店设置的零售抹零的单位;
export const StoreSettingParameterIgnoreUnit = {
  Unit1: 1,
  Unit3: 3,
  Unit5: 5,
  Types: {
    '1': '元',
    '3': '角',
    '5': '分'
  },
  TypeArray: [
    { KeyId: '1', Value: '元' },
    { KeyId: '3', Value: '角' },
    { KeyId: '5', Value: '分' }
  ]
}

// 门店设置的零售抹零的舍入;
export const StoreSettingParameterIgnoreType = {
  Type1: 1,
  Type3: 3,
  Type5: 5,
  Types: {
    '1': '只舍不入',
    '3': '只入不舍',
    '5': '四舍五入'
  },
  TypeArray: [
    { KeyId: '1', Value: '只舍不入' },
    { KeyId: '3', Value: '只入不舍' },
    { KeyId: '5', Value: '四舍五入' }
  ]
}

// 门店单号规则与审核的审核模式;
export const StoreSettingGenerateAuditType = {
  Manual: 1,
  Automac: 3,
  Types: {
    '1': '人工审核',
    '3': '自动审核'
  },
  TypeArray: [
    { KeyId: '1', Value: '人工审核' },
    { KeyId: '3', Value: '自动审核' }
  ]
}

// 职位工资状态;
export const StorePositionSalaryState = {
  Draft: 1,
  Wait: 3,
  Audit: 5,
  Reject: 7,
  Abandon: 9,
  Types: {
    '1': '草稿',
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废'
  },
  TypeArray: [
    { KeyId: '1', Value: '草稿' },
    { KeyId: '3', Value: '待审核' },
    { KeyId: '5', Value: '审核通过' },
    { KeyId: '7', Value: '审核退回' },
    { KeyId: '9', Value: '已作废' }
  ]
}

// 销售商品数据来源;
export const StoreSettingParameterGoodsSourceType = {
  MarketingCloud: 1,
  StockingCloud: 9,
  Types: {
    '1': '营销系统',
    '9': 'ERP系统'
  },
  TypeArray: [
    { KeyId: '1', Value: '营销系统' },
    { KeyId: '9', Value: 'ERP系统' }
  ]
}

// 门店系统类型;
export const StoreSystemType = {
  MarketingCloud: 1,
  PerformanceCloud: 3,
  ScoringCloud: 5,
  MessageCloud: 7,
  StockingCloud: 9,
  MembershipCloud: 11,
  SpreadCloud: 13,
  GiftingCloud: 15,
  CollegeCloud: 17,
  Types: {
    '1': '营销系统',
    '3': '薪酬绩效系统',
    '5': '积分卡券系统',
    '7': '短信系统',
    '9': 'ERP系统',
    '11': 'CRM系统',
    '13': '营销活动系统',
    '15': '礼品商城系统',
    '17': '商学院系统'
  },
  TypeArray: [
    { KeyId: '1', Value: '营销系统' },
    { KeyId: '3', Value: '薪酬绩效系统' },
    { KeyId: '5', Value: '积分卡券系统' },
    { KeyId: '7', Value: '短信系统' },
    { KeyId: '9', Value: 'ERP系统' },
    { KeyId: '11', Value: 'CRM系统' },
    { KeyId: '13', Value: '营销活动系统' },
    { KeyId: '15', Value: '礼品商城系统' },
    { KeyId: '17', Value: '商学院系统' }
  ]
}
