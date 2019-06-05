// 账户类型;
export const BalanceType = {
  'ValidCash': 1,
  'ValidFree': 3,
  'ValidGift': 5,
  'ValidTour': 7,
  'Types': {
    '1': '消费账户',
    '3': '赠送账户',
    '5': '礼品账户',
    '7': '旅游基金',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '消费账户'},
    {'KeyId': 3, 'Value': '赠送账户'},
    {'KeyId': 5, 'Value': '礼品账户'},
    {'KeyId': 7, 'Value': '旅游基金'}
  ]
}
// (商户)商户赠送余额账户的消费状态;
export const BalanceFreeExpireExpendStatus = {
  'NoneOf': 3,
  'PartOf': 5,
  'AllOf': 7,
  'Types': {
    '3': '尚未消费',
    '5': '部分消费',
    '7': '全部消费',
  },
  'TypeArray': [
    {'KeyId': 3, 'Value': '尚未消费'},
    {'KeyId': 5, 'Value': '部分消费'},
    {'KeyId': 7, 'Value': '全部消费'}
  ]
}
// 挂单状态;
export const CashierOrderAwaitStatus = {
  'Abandon': 1,
  'Origin': 3,
  'Audit': 5,
  'Types': {
    '1': '已作废',
    '3': '待提交',
    '5': '已提交',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已作废'},
    {'KeyId': 3, 'Value': '待提交'},
    {'KeyId': 5, 'Value': '已提交'}
  ]
}
// LoginType;
export const LoginType = {
  'Normal': 1,
  'Repeat': 2,
  'Force': 3,
  'ForceOther': 4,
  'ForceBoth': 5,
  'Types': {
    '1': '正常登陆',
    '2': '重复登陆',
    '3': '强制当前机器登陆下班',
    '4': '强制其它机器登陆下班',
    '5': '强制其它机器登陆下班 和 强制当前机器登陆下班',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '正常登陆'},
    {'KeyId': 2, 'Value': '重复登陆'},
    {'KeyId': 3, 'Value': '强制当前机器登陆下班'},
    {'KeyId': 4, 'Value': '强制其它机器登陆下班'},
    {'KeyId': 5, 'Value': '强制其它机器登陆下班 和 强制当前机器登陆下班'}
  ]
}
// 授权设备状态;
export const CashierEquipmentStatus = {
  'Abandon': 1,
  'Unauth': 3,
  'Auth': 5,
  'Types': {
    '1': '已作废',
    '3': '待认证',
    '5': '已认证',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已作废'},
    {'KeyId': 3, 'Value': '待认证'},
    {'KeyId': 5, 'Value': '已认证'}
  ]
}
// API返回CODE;
export const CashierApiReturnCode = {
  'Ok': 200,
  'UserOnline': 1001,
  'EquipmentLoged': 1003,
  'RepeatLogin': 1005,
  'Types': {
    '200': '完成',
    '1001': '当前用户已在其它收银机登录',
    '1003': '当前设备已经登录了帐号',
    '1005': '已在当前机器上班，重复登录',
  },
  'TypeArray': [
    {'KeyId': 200, 'Value': '完成'},
    {'KeyId': 1001, 'Value': '当前用户已在其它收银机登录'},
    {'KeyId': 1003, 'Value': '当前设备已经登录了帐号'},
    {'KeyId': 1005, 'Value': '已在当前机器上班，重复登录'}
  ]
}
// 支付方式;
export const PaymentType = {
  'BankPay': 1,
  'AliPay': 3,
  'WechatPay': 5,
  'UnionPay': 7,
  'CashPay': 9,
  'CreditPay': 11,
  'SysPay': 99,
  'Types': {
    '1': '银行转账',
    '3': '支付宝',
    '5': '微信',
    '7': '银联',
    '9': '现金',
    '11': '花呗分期',
    '99': '系统',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '银行转账'},
    {'KeyId': 3, 'Value': '支付宝'},
    {'KeyId': 5, 'Value': '微信'},
    {'KeyId': 7, 'Value': '银联'},
    {'KeyId': 9, 'Value': '现金'},
    {'KeyId': 11, 'Value': '花呗分期'},
    {'KeyId': 99, 'Value': '系统'}
  ]
}
// 支付回调结果;
export const PaymentReturnCodeType = {
  'FAIL': 0,
  'SUCCESS': 1,
  'Types': {
    '0': '回调失败',
    '1': '回调成功',
  },
  'TypeArray': [
    {'KeyId': 0, 'Value': '回调失败'},
    {'KeyId': 1, 'Value': '回调成功'}
  ]
}
// 零售修改类型;
export const StoreSettingParameterEditType = {
  'Unable': 1,
  'Limited': 3,
  'Unlimited': 5,
  'Types': {
    '1': '不允许修改',
    '3': '允许',
    '5': '允许任意修改',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '不允许修改'},
    {'KeyId': 3, 'Value': '允许'},
    {'KeyId': 5, 'Value': '允许任意修改'}
  ]
}
// 部门提成结算单状态;
export const FinanceDeptmentBillStatus = {
  'Abandon': 1,
  'Origin': 3,
  'Audit': 5,
  'Types': {
    '1': '已作废',
    '3': '待审核',
    '5': '已审核',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已作废'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '已审核'}
  ]
}
// 员工提成结算单状态;
export const FinanceEmployeeBillStatus = {
  'Abandon': 1,
  'Origin': 3,
  'Audit': 5,
  'Types': {
    '1': '已作废',
    '3': '待审核',
    '5': '已审核',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已作废'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '已审核'}
  ]
}
// 结算单明细的支付状态(通用);
export const FinancePaidStatus = {
  'Wait': 1,
  'Paid': 3,
  'Error': 5,
  'Types': {
    '1': '未支付',
    '3': '已支付',
    '5': '计算错误',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '未支付'},
    {'KeyId': 3, 'Value': '已支付'},
    {'KeyId': 5, 'Value': '计算错误'}
  ]
}
// 货品状态;
export const GoodsState = {
  'Wait': 1,
  'Audit': 3,
  'Abandon': 5,
  'Types': {
    '1': '待审核',
    '3': '已审核',
    '5': '已作废',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '待审核'},
    {'KeyId': 3, 'Value': '已审核'},
    {'KeyId': 5, 'Value': '已作废'}
  ]
}
// 旧货入库单来源类型;
export const JunkInnOrderBasicSourceType = {
  'Cashier': 1,
  'Erp': 3,
  'Types': {
    '1': '收银台(手工创建)',
    '3': '手工创建',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '收银台(手工创建)'},
    {'KeyId': 3, 'Value': '手工创建'}
  ]
}
// 旧货入库单状态;
export const JunkInnOrderBasicState = {
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
// 材质类型;
export const MaterialType = {
  'Goldlion': 1,
  'AncientGlod': 2,
  'Silver': 3,
  'FiveGlod': 4,
  'HardGold3D': 5,
  'Platinum': 7,
  'Palladium': 9,
  'Diamond': 11,
  'KGoldlion': 13,
  'Gemstone': 15,
  'Zircon': 16,
  'GoldWithJade': 17,
  'GoldInlay': 18,
  'PearlStone': 19,
  'Wood': 21,
  'Fashion': 23,
  'Jewelry': 25,
  'Jadeite': 27,
  'Fitting': 97,
  'Other': 99,
  'Types': {
    '1': '黄金',
    '2': '古法黄金',
    '3': '银饰',
    '4': '5G黄金',
    '5': '3D硬金',
    '7': '铂金',
    '9': '钯金',
    '11': '钻石',
    '13': 'K金',
    '15': '彩宝',
    '16': '锆石',
    '17': '金镶玉',
    '18': '黄金镶嵌',
    '19': '珍珠宝石',
    '21': '天然木饰',
    '23': '时尚饰品',
    '25': '珠宝配饰',
    '27': '翡翠玉石',
    '97': '配件',
    '99': '其它',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '黄金'},
    {'KeyId': 2, 'Value': '古法黄金'},
    {'KeyId': 3, 'Value': '银饰'},
    {'KeyId': 4, 'Value': '5G黄金'},
    {'KeyId': 5, 'Value': '3D硬金'},
    {'KeyId': 7, 'Value': '铂金'},
    {'KeyId': 9, 'Value': '钯金'},
    {'KeyId': 11, 'Value': '钻石'},
    {'KeyId': 13, 'Value': 'K金'},
    {'KeyId': 15, 'Value': '彩宝'},
    {'KeyId': 16, 'Value': '锆石'},
    {'KeyId': 17, 'Value': '金镶玉'},
    {'KeyId': 18, 'Value': '黄金镶嵌'},
    {'KeyId': 19, 'Value': '珍珠宝石'},
    {'KeyId': 21, 'Value': '天然木饰'},
    {'KeyId': 23, 'Value': '时尚饰品'},
    {'KeyId': 25, 'Value': '珠宝配饰'},
    {'KeyId': 27, 'Value': '翡翠玉石'},
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
    '99': '其他',
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
    {'KeyId': 99, 'Value': '其他'}
  ]
}
// 素金品类;
export const GoldType = {
  'Type1005': 1005,
  'Type1010': 1010,
  'Type1015': 1015,
  'Type1105': 1105,
  'Type1110': 1110,
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
  'Types': {
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
    '1630': '钯金PD990',
  },
  'TypeArray': [
    {'KeyId': 1005, 'Value': '足金AU99.9'},
    {'KeyId': 1010, 'Value': '足金AU99.99'},
    {'KeyId': 1015, 'Value': '足金AU99.999'},
    {'KeyId': 1105, 'Value': '足金AU99.9(3D精品)'},
    {'KeyId': 1110, 'Value': '足金AU99.99(3D精品)'},
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
    {'KeyId': 1630, 'Value': '钯金PD990'}
  ]
}
// (运营商)员工/部门余额账户日志的变化类型(枚举);
export const LogBalanceDEChangeType = {
  'RechargeOrder': 1,
  'ExpendOrder': 3,
  'GiftingOrder': 5,
  'ReturnOrder': 7,
  'FinanceDEBill': 9,
  'Types': {
    '1': '充值单提点',
    '3': '消费单提点',
    '5': '礼品单提点',
    '7': '退货单倒扣',
    '9': '结算提现',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '充值单提点'},
    {'KeyId': 3, 'Value': '消费单提点'},
    {'KeyId': 5, 'Value': '礼品单提点'},
    {'KeyId': 7, 'Value': '退货单倒扣'},
    {'KeyId': 9, 'Value': '结算提现'}
  ]
}
// (商户)商户余额账户日志的变化类型(枚举);
export const LogBalanceStoreChangeType = {
  'RechargeOrder': 1101,
  'ReturnOrder': 1103,
  'ExpendOrder': 2101,
  'GiftingOrder': 2103,
  'CancelOrder': 2105,
  'TimeOut': 3101,
  'Withdraw': 3103,
  'Types': {
    '1101': '充值单',
    '1103': '退货单',
    '2101': '消费单',
    '2103': '礼品单',
    '2105': '取消审核',
    '3101': '到期回收',
    '3103': '结算提现',
  },
  'TypeArray': [
    {'KeyId': 1101, 'Value': '充值单'},
    {'KeyId': 1103, 'Value': '退货单'},
    {'KeyId': 2101, 'Value': '消费单'},
    {'KeyId': 2103, 'Value': '礼品单'},
    {'KeyId': 2105, 'Value': '取消审核'},
    {'KeyId': 3101, 'Value': '到期回收'},
    {'KeyId': 3103, 'Value': '结算提现'}
  ]
}
// (终端用户)卡券日志的变化类型;
export const LogWalletCouponChangeType = {
  'Inn': 1,
  'Use': 3,
  'Dec': 5,
  'Types': {
    '1': '定期收益',
    '3': '使用',
    '5': '到期递减',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '定期收益'},
    {'KeyId': 3, 'Value': '使用'},
    {'KeyId': 5, 'Value': '到期递减'}
  ]
}
// 打赏日志状态;
export const LogAssessEmployeeStatus = {
  'Origin': 1,
  'Audit': 3,
  'Types': {
    '1': '未支付',
    '3': '已支付',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '未支付'},
    {'KeyId': 3, 'Value': '已支付'}
  ]
}
// 材质类型(大类);
export const MarproType = {
  'AllClass': 1101,
  'NogdClass': 1103,
  'Types': {
    '1101': '全品类',
    '1103': '非素类',
  },
  'TypeArray': [
    {'KeyId': 1101, 'Value': '全品类'},
    {'KeyId': 1103, 'Value': '非素类'}
  ]
}
// 产品状态;
export const MarproStatus = {
  'Online': 19,
  'Offline': 21,
  'Types': {
    '19': '已上架',
    '21': '已下架',
  },
  'TypeArray': [
    {'KeyId': 19, 'Value': '已上架'},
    {'KeyId': 21, 'Value': '已下架'}
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
    {'KeyId': 12, 'Value': 'P'}
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
// 充值单状态;
export const RechargeOrderStatus = {
  'Abandon': 1,
  'Origin': 3,
  'Audit': 5,
  'Reject': 7,
  'Types': {
    '1': '已作废',
    '3': '待审核',
    '5': '已审核',
    '7': '已拒绝',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已作废'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '已审核'},
    {'KeyId': 7, 'Value': '已拒绝'}
  ]
}
// 充值单的结果状态;
export const RechargeOrderResultStatus = {
  'No': 1,
  'Yes': 3,
  'Types': {
    '1': '未到账',
    '3': '已到账',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '未到账'},
    {'KeyId': 3, 'Value': '已到账'}
  ]
}
// 消费单状态;
export const ExpendOrderStatus = {
  'Abandon': 1,
  'Origin': 3,
  'Audit': 5,
  'Types': {
    '1': '已作废',
    '3': '待审核',
    '5': '已审核',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已作废'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '已审核'}
  ]
}
// 消费单来源;
export const ExpendOrderSourceType = {
  'Mobile': 1,
  'Cashier': 3,
  'PCMakeup': 5,
  'MobileMakeup': 7,
  'Types': {
    '1': '手机提交',
    '3': '收银台提交',
    '5': 'PC补录',
    '7': '手机补录',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '手机提交'},
    {'KeyId': 3, 'Value': '收银台提交'},
    {'KeyId': 5, 'Value': 'PC补录'},
    {'KeyId': 7, 'Value': '手机补录'}
  ]
}
// 消费单的支付类型;
export const ExpendOrderPayingType = {
  'Cash': 1,
  'Card': 3,
  'Types': {
    '1': '现款支付',
    '3': '卡券支付',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '现款支付'},
    {'KeyId': 3, 'Value': '卡券支付'}
  ]
}
// 消费单的时间更新类型;
export const ExpendOrderTimeType = {
  'LastTime': 1,
  'EarningTime': 3,
  'Types': {
    '1': '保养时间',
    '3': '收益时间',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '保养时间'},
    {'KeyId': 3, 'Value': '收益时间'}
  ]
}
// 消费单的排序类型;
export const ExpendOrderOrderByType = {
  'Default': 1,
  'IsPayed': 3,
  'Types': {
    '1': '按默认',
    '3': '未支付',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '按默认'},
    {'KeyId': 3, 'Value': '未支付'}
  ]
}
// 商品来源;
export const ProductSourceType = {
  'Marketing': 1,
  'Manual': 3,
  'ERP': 5,
  'Types': {
    '1': '营销系统',
    '3': '手工创建',
    '5': 'ERP',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '营销系统'},
    {'KeyId': 3, 'Value': '手工创建'},
    {'KeyId': 5, 'Value': 'ERP'}
  ]
}
// 质保单状态;
export const QualityOrderStatus = {
  'Abandon': 1,
  'Origin': 3,
  'Audit': 5,
  'Finish': 7,
  'Types': {
    '1': '已作废',
    '3': '未生效',
    '5': '已生效',
    '7': '已回收',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已作废'},
    {'KeyId': 3, 'Value': '未生效'},
    {'KeyId': 5, 'Value': '已生效'},
    {'KeyId': 7, 'Value': '已回收'}
  ]
}
// 退货单状态;
export const ReturnOrderStatus = {
  'Abandon': 1,
  'Origin': 3,
  'Receipt': 5,
  'Rebate': 7,
  'Finish': 9,
  'Types': {
    '1': '已作废',
    '3': '待审核',
    '5': '待收货',
    '7': '待退款',
    '9': '已完成',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已作废'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '待收货'},
    {'KeyId': 7, 'Value': '待退款'},
    {'KeyId': 9, 'Value': '已完成'}
  ]
}
// 退货单来源;
export const ReturnOrderSourceType = {
  'Mobile': 1,
  'Cashier': 3,
  'PC': 5,
  'Types': {
    '1': '手机',
    '3': '收银台',
    '5': 'PC',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '手机'},
    {'KeyId': 3, 'Value': '收银台'},
    {'KeyId': 5, 'Value': 'PC'}
  ]
}
// (运营商)礼品单状态;
export const GiftingOrderStatus = {
  'Abandon': 1,
  'Origin': 3,
  'Audit': 5,
  'Express': 7,
  'Finish': 9,
  'Delete': 11,
  'Types': {
    '1': '已作废',
    '3': '待审核',
    '5': '待发货',
    '7': '已发货',
    '9': '已完成',
    '11': '已删除',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已作废'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '待发货'},
    {'KeyId': 7, 'Value': '已发货'},
    {'KeyId': 9, 'Value': '已完成'},
    {'KeyId': 11, 'Value': '已删除'}
  ]
}
// (商户自营)礼品单状态;
export const SelfgiftOrderStatus = {
  'Abandon': 1,
  'Origin': 3,
  'Audit': 5,
  'Express': 7,
  'Finish': 9,
  'Delete': 11,
  'Types': {
    '1': '已作废',
    '3': '待审核',
    '5': '待发货',
    '7': '已发货',
    '9': '已完成',
    '11': '已删除',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已作废'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '待发货'},
    {'KeyId': 7, 'Value': '已发货'},
    {'KeyId': 9, 'Value': '已完成'},
    {'KeyId': 11, 'Value': '已删除'}
  ]
}
// 旧货来源类型;
export const JunkBasicSourceType = {
  'CashierCoupons': 3,
  'CashierManual': 5,
  'ERPManual': 7,
  'Types': {
    '3': '收银台(卡券)',
    '5': '收银台(手工创建)',
    '7': '手工创建',
  },
  'TypeArray': [
    {'KeyId': 3, 'Value': '收银台(卡券)'},
    {'KeyId': 5, 'Value': '收银台(手工创建)'},
    {'KeyId': 7, 'Value': '手工创建'}
  ]
}
// 快递类型;
export const ExpressType = {
  'SF': 1001,
  'YT': 1003,
  'ST': 1005,
  'ZT': 1007,
  'YD': 1009,
  'KJ': 1011,
  'BSHT': 1013,
  'TTKD': 1015,
  'DB': 1017,
  'EMS': 1019,
  'Types': {
    '1001': '顺丰',
    '1003': '圆通',
    '1005': '申通',
    '1007': '中通',
    '1009': '韵达',
    '1011': '快捷',
    '1013': '百世汇通',
    '1015': '天天快递',
    '1017': '德邦',
    '1019': 'EMS',
  },
  'TypeArray': [
    {'KeyId': 1001, 'Value': '顺丰'},
    {'KeyId': 1003, 'Value': '圆通'},
    {'KeyId': 1005, 'Value': '申通'},
    {'KeyId': 1007, 'Value': '中通'},
    {'KeyId': 1009, 'Value': '韵达'},
    {'KeyId': 1011, 'Value': '快捷'},
    {'KeyId': 1013, 'Value': '百世汇通'},
    {'KeyId': 1015, 'Value': '天天快递'},
    {'KeyId': 1017, 'Value': '德邦'},
    {'KeyId': 1019, 'Value': 'EMS'}
  ]
}
// 售后处理类型(通用);
export const CommonOrderRmaType = {
  'NoneOfRma': 1,
  'ReturnOrder': 3,
  'Types': {
    '1': '无售后处理',
    '3': '退货单',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '无售后处理'},
    {'KeyId': 3, 'Value': '退货单'}
  ]
}
// (运营商)礼品分类;
export const ProductCategoryType = {
  'Gift': 1,
  'Tour': 3,
  'Types': {
    '1': '礼品',
    '3': '旅游',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '礼品'},
    {'KeyId': 3, 'Value': '旅游'}
  ]
}
// (运营商)礼品状态;
export const ProductStatus = {
  'Abandon': 1,
  'Origin': 3,
  'Audit': 5,
  'Types': {
    '1': '已作废',
    '3': '待上架',
    '5': '已上架',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已作废'},
    {'KeyId': 3, 'Value': '待上架'},
    {'KeyId': 5, 'Value': '已上架'}
  ]
}
// (商户自营)礼品状态;
export const SelfgiftStatus = {
  'Abandon': 1,
  'Origin': 3,
  'Audit': 5,
  'Types': {
    '1': '已作废',
    '3': '待上架',
    '5': '已上架',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已作废'},
    {'KeyId': 3, 'Value': '待上架'},
    {'KeyId': 5, 'Value': '已上架'}
  ]
}
//  零售方式;
export const RetailType = {
  'PieceOf': 1,
  'FeeOfGram': 3,
  'FeeOfPiece': 5,
  'Types': {
    '1': '计件',
    '3': '计价(工费按克)',
    '5': '计件(工费按件)',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '计件'},
    {'KeyId': 3, 'Value': '计价(工费按克)'},
    {'KeyId': 5, 'Value': '计件(工费按件)'}
  ]
}
// 回收工费类型;
export const StoreSettingGpriceRecallType = {
  'PieceOf': 1,
  'GramOf': 3,
  'Types': {
    '1': '按件',
    '3': '按克',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '按件'},
    {'KeyId': 3, 'Value': '按克'}
  ]
}
// 品牌状态;
export const ProductBrandStatus = {
  'Abandon': 1,
  'Origin': 3,
  'Audit': 5,
  'Types': {
    '1': '已作废',
    '3': '待审核',
    '5': '已审核',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已作废'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '已审核'}
  ]
}
// 品牌来源;
export const ProductBrandSourceType = {
  'Store': 1,
  'Station': 3,
  'Types': {
    '1': '门店',
    '3': '平台',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '门店'},
    {'KeyId': 3, 'Value': '平台'}
  ]
}
// 排队领黄状态;
export const QueueReceiveGoldStatus = {
  'Abandon': 1,
  'Origin': 3,
  'NotStart': 4,
  'Start': 5,
  'End': 6,
  'Terminal': 7,
  'Types': {
    '1': '已作废',
    '3': '待审核',
    '4': '未开始',
    '5': '已开始',
    '6': '已结束',
    '7': '已终止',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已作废'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 4, 'Value': '未开始'},
    {'KeyId': 5, 'Value': '已开始'},
    {'KeyId': 6, 'Value': '已结束'},
    {'KeyId': 7, 'Value': '已终止'}
  ]
}
// 活动类型;
export const QueueActivityType = {
  'ActualPrice': 1,
  'OrderPrice': 3,
  'Types': {
    '1': '实付金额',
    '3': '应付金额',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '实付金额'},
    {'KeyId': 3, 'Value': '应付金额'}
  ]
}
// 消费类型;
export const QueueCashType = {
  'NotFullPrice': 1,
  'FullPrice': 3,
  'Types': {
    '1': '不限消费金额',
    '3': '消费金额满',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '不限消费金额'},
    {'KeyId': 3, 'Value': '消费金额满'}
  ]
}
// 折算金价类型;
export const QueueGoldType = {
  'TodayGoldPrice': 1,
  'DiscountGlodPrice': 3,
  'Types': {
    '1': '按今日金价',
    '3': '按领取折算金价',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '按今日金价'},
    {'KeyId': 3, 'Value': '按领取折算金价'}
  ]
}
// 排队取金领取状态;
export const QueueReceiveGoldItemStatus = {
  'NotReceive': 1,
  'Receive': 2,
  'Types': {
    '1': '未领取',
    '2': '已领取',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '未领取'},
    {'KeyId': 2, 'Value': '已领取'}
  ]
}
// 排队取金领取使用状态;
export const QueueReceiveGoldUsedStatus = {
  'Abandon': 1,
  'Origin': 3,
  'Locked': 5,
  'Finish': 7,
  'Expired': 9,
  'Types': {
    '1': '已作废',
    '3': '未使用',
    '5': '已锁定',
    '7': '已使用',
    '9': '已过期',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已作废'},
    {'KeyId': 3, 'Value': '未使用'},
    {'KeyId': 5, 'Value': '已锁定'},
    {'KeyId': 7, 'Value': '已使用'},
    {'KeyId': 9, 'Value': '已过期'}
  ]
}
// 排队取金订单状态;
export const QueueReceiveGoldOrderStatus = {
  'Cancel': 1,
  'Return': 3,
  'Audit': 5,
  'Types': {
    '1': '已取消',
    '3': '已退货',
    '5': '已审核',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已取消'},
    {'KeyId': 3, 'Value': '已退货'},
    {'KeyId': 5, 'Value': '已审核'}
  ]
}
// 快捷操作类型;
export const SettingShortcutType = {
  'SystemDefault': 1,
  'Customized': 3,
  'Types': {
    '1': '系统默认',
    '3': '自定义',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '系统默认'},
    {'KeyId': 3, 'Value': '自定义'}
  ]
}
// 系统公告类型;
export const SettingNoticeType = {
  'All': 1,
  'One': 3,
  'Types': {
    '1': '全部商户',
    '3': '指定商户',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '全部商户'},
    {'KeyId': 3, 'Value': '指定商户'}
  ]
}
// 帮助中心文档状态;
export const SettingHelpStatus = {
  'Abandon': 1,
  'Origin': 3,
  'Audit': 5,
  'Reject': 7,
  'Types': {
    '1': '已作废',
    '3': '待审核',
    '5': '已审核',
    '7': '已拒绝',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已作废'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '已审核'},
    {'KeyId': 7, 'Value': '已拒绝'}
  ]
}
// 商户充值类型;
export const SettingRechargeType = {
  'None': 1,
  'Rate': 3,
  'Step': 5,
  'Else': 9,
  'Types': {
    '1': '无赠送',
    '3': '固定赠送',
    '5': '阶梯赠送',
    '9': '其它',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '无赠送'},
    {'KeyId': 3, 'Value': '固定赠送'},
    {'KeyId': 5, 'Value': '阶梯赠送'},
    {'KeyId': 9, 'Value': '其它'}
  ]
}
// 提成上限设置的提成类型;
export const SettingRateType = {
  'Deptment': 1,
  'Employee': 3,
  'Types': {
    '1': '部门提成',
    '3': '员工提成',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '部门提成'},
    {'KeyId': 3, 'Value': '员工提成'}
  ]
}
// 推送系统消息;
export const SettingMessageType = {
  'MemberCard': 1,
  'QueueUp': 2,
  'QueueReceive': 3,
  'QueueError': 4,
  'Types': {
    '1': '领取会员卡',
    '2': '排队领金开始排队',
    '3': '排队领金领取成功',
    '4': '排队领金领取失败',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '领取会员卡'},
    {'KeyId': 2, 'Value': '排队领金开始排队'},
    {'KeyId': 3, 'Value': '排队领金领取成功'},
    {'KeyId': 4, 'Value': '排队领金领取失败'}
  ]
}
// 销售方式类型;
export const StoreBusinessType = {
  'Retail': 10,
  'All': 20,
  'Wholesale': 30,
  'Types': {
    '10': '零售',
    '20': '零售+批发',
    '30': '批发',
  },
  'TypeArray': [
    {'KeyId': 10, 'Value': '零售'},
    {'KeyId': 20, 'Value': '零售+批发'},
    {'KeyId': 30, 'Value': '批发'}
  ]
}
// 主营品类类型;
export const StoreFlagshipType = {
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
  'TypeArray': [
    {'KeyId': 1, 'Value': '黄金'},
    {'KeyId': 2, 'Value': '钻石'},
    {'KeyId': 3, 'Value': '翡翠'},
    {'KeyId': 4, 'Value': '珍珠'},
    {'KeyId': 5, 'Value': '琥珀'},
    {'KeyId': 6, 'Value': '铂金'},
    {'KeyId': 7, 'Value': '其它'}
  ]
}
// 商户的资料状态;
export const StoreBasicStatus = {
  'Abandon': 1,
  'Origin': 3,
  'Audit': 5,
  'Types': {
    '1': '已作废',
    '3': '待审核',
    '5': '已审核',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已作废'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '已审核'}
  ]
}
// 商户的提成状态;
export const StoreRateStatus = {
  'Origin': 3,
  'Audit': 5,
  'Types': {
    '3': '待审核',
    '5': '已审核',
  },
  'TypeArray': [
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '已审核'}
  ]
}
// (部门与员工提点设置)单据类型;
export const StoreSettingDerateOrderType = {
  'RechargeOrder': 1,
  'GiftingOrder': 3,
  'ExpendOrder': 5,
  'Types': {
    '1': '充值单',
    '3': '礼品单',
    '5': '消费单',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '充值单'},
    {'KeyId': 3, 'Value': '礼品单'},
    {'KeyId': 5, 'Value': '消费单'}
  ]
}
// 售后退货单的终端类型;
export const RmaReturnOrderBasicTerminalType = {
  'YXManual': 1,
  'Cashier': 3,
  'Wechat': 5,
  'ERPManual': 7,
  'Types': {
    '1': '营销系统',
    '3': '收银台',
    '5': '微信',
    '7': 'ERP手工创建',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '营销系统'},
    {'KeyId': 3, 'Value': '收银台'},
    {'KeyId': 5, 'Value': '微信'},
    {'KeyId': 7, 'Value': 'ERP手工创建'}
  ]
}
// 零售单的终端类型;
export const SaleOrderBasicTerminalType = {
  'YXManual': 1,
  'Cashier': 3,
  'Wechat': 5,
  'ERPManual': 7,
  'Types': {
    '1': '营销系统',
    '3': '收银台',
    '5': '微信',
    '7': 'ERP手工创建',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '营销系统'},
    {'KeyId': 3, 'Value': '收银台'},
    {'KeyId': 5, 'Value': '微信'},
    {'KeyId': 7, 'Value': 'ERP手工创建'}
  ]
}
// 商家套餐状态;
export const StorePackageStatus = {
  'NoStart': 1,
  'TakeEffect': 3,
  'Expired': 5,
  'Types': {
    '1': '未开始',
    '3': '生效中',
    '5': '已过期',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '未开始'},
    {'KeyId': 3, 'Value': '生效中'},
    {'KeyId': 5, 'Value': '已过期'}
  ]
}
// 门店系统类型;
export const StoreSystemType = {
  'MarketingCloud': 1,
  'KpissCloud': 3,
  'ScoringCloud': 5,
  'MessageCloud': 7,
  'StockingCloud': 9,
  'MembershipCloud': 11,
  'SpreadCloud': 13,
  'GiftingCloud': 15,
  'CollegeCloud': 17,
  'Types': {
    '1': '营销系统',
    '3': '薪酬绩效系统',
    '5': '积分卡券系统',
    '7': '短信系统',
    '9': 'ERP系统',
    '11': 'CRM系统',
    '13': '营销活动系统',
    '15': '礼品商城系统',
    '17': '商学院',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '营销系统'},
    {'KeyId': 3, 'Value': '薪酬绩效系统'},
    {'KeyId': 5, 'Value': '积分卡券系统'},
    {'KeyId': 7, 'Value': '短信系统'},
    {'KeyId': 9, 'Value': 'ERP系统'},
    {'KeyId': 11, 'Value': 'CRM系统'},
    {'KeyId': 13, 'Value': '营销活动系统'},
    {'KeyId': 15, 'Value': '礼品商城系统'},
    {'KeyId': 17, 'Value': '商学院'}
  ]
}
// 模板类型;
export const StoreSettingPrintingType = {
  'MarketingCloudElectronicQuality': 1101,
  'GiftingCloudGiftExpressOrder': 7101,
  'GiftingCloudGiftSaleOrder': 7103,
  'StockingCloudGoodsLabel': 9101,
  'MarketingCloudPaperQuality': 9105,
  'StockingCloudGoodsTags': 9107,
  'StockingCloudPurchaseOrder': 9201,
  'StockingCloudReturnOrder': 9203,
  'StockingCloudTakingOrder': 9205,
  'StockingCloudPriceOrder': 9207,
  'StockingCloudSaleOrder': 9209,
  'StockingCloudRmaReturnOrder': 9211,
  'StockingCloudTakingReport1': 9217,
  'StockingCloudTakingReport3': 9219,
  'StockingCloudFinanceBillBasic1': 9221,
  'StockingCloudFinanceBillBasic3': 9223,
  'StockingCloudFinanceBillPaid1': 9225,
  'StockingCloudFinanceBillPaid3': 9227,
  'StockingCloudJunkChangeOrder': 9233,
  'StockingCloudJunkOutOrder': 9235,
  'StockingCloudAppropOrder': 9237,
  'StockingCloudJunkInnOrder': 9239,
  'StockingCloudJunkModifyOrder': 9241,
  'StockingCloudJunkPrintOrder': 9243,
  'StockingCloudReinfPlanOrder': 9245,
  'StockingCloudRmaRepairOrder': 9247,
  'StockingCloudSaleMasterOrder': 9249,
  'Types': {
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
    '9209': '零售单',
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
    '9239': '旧货入库单',
    '9241': '旧货修改单',
    '9243': '旧货打印单',
    '9245': '配货计划单',
    '9247': '维修单',
    '9249': '零售大单',
  },
  'TypeArray': [
    {'KeyId': 1101, 'Value': '电子质保单'},
    {'KeyId': 7101, 'Value': '礼品快递单'},
    {'KeyId': 7103, 'Value': '礼品订单'},
    {'KeyId': 9101, 'Value': '货品标签'},
    {'KeyId': 9105, 'Value': '质保单打印模板'},
    {'KeyId': 9107, 'Value': '电子标签'},
    {'KeyId': 9201, 'Value': '成品采购入库单'},
    {'KeyId': 9203, 'Value': '成品退货单'},
    {'KeyId': 9205, 'Value': '成品盘点单'},
    {'KeyId': 9207, 'Value': '成品调价单'},
    {'KeyId': 9209, 'Value': '零售单'},
    {'KeyId': 9211, 'Value': '售后退货单'},
    {'KeyId': 9217, 'Value': '成品报损单'},
    {'KeyId': 9219, 'Value': '成品报溢单'},
    {'KeyId': 9221, 'Value': '应收款单'},
    {'KeyId': 9223, 'Value': '应付款单'},
    {'KeyId': 9225, 'Value': '收款单'},
    {'KeyId': 9227, 'Value': '付款单'},
    {'KeyId': 9233, 'Value': '旧货转成品库'},
    {'KeyId': 9235, 'Value': '旧货出库单'},
    {'KeyId': 9237, 'Value': '成品调拨单'},
    {'KeyId': 9239, 'Value': '旧货入库单'},
    {'KeyId': 9241, 'Value': '旧货修改单'},
    {'KeyId': 9243, 'Value': '旧货打印单'},
    {'KeyId': 9245, 'Value': '配货计划单'},
    {'KeyId': 9247, 'Value': '维修单'},
    {'KeyId': 9249, 'Value': '零售大单'}
  ]
}
// 打赏类型;
export const StoreSettingParameterRewardType = {
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
  'TypeArray': [
    {'KeyId': 1, 'Value': '启用评分以及打赏'},
    {'KeyId': 3, 'Value': '启用打赏'},
    {'KeyId': 5, 'Value': '启用评分'},
    {'KeyId': 7, 'Value': '均不启用'}
  ]
}
// 销售商品数据来源;
export const StoreSettingParameterGoodsSourceType = {
  'MarketingCloud': 1,
  'StockingCloud': 9,
  'Types': {
    '1': '营销系统',
    '9': 'ERP系统',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '营销系统'},
    {'KeyId': 9, 'Value': 'ERP系统'}
  ]
}
// 模板状态;
export const StoreSettingPrintingState = {
  'Deleted': 1,
  'Normal': 3,
  'Designing': 5,
  'Types': {
    '1': '已删除',
    '3': '已启用',
    '5': '设计中',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已删除'},
    {'KeyId': 3, 'Value': '已启用'},
    {'KeyId': 5, 'Value': '设计中'}
  ]
}
// 关联类型;
export const GroupMapType = {
  'CreateSelf': 1,
  'Relation': 3,
  'Types': {
    '1': '自建',
    '3': '关联',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '自建'},
    {'KeyId': 3, 'Value': '关联'}
  ]
}
// 商户注册类型;
export const CompanyBasicSourceType = {
  'Lcb': 1,
  'Official': 3,
  'Group': 5,
  'Types': {
    '1': '平台添加',
    '3': '官网注册',
    '5': '集团添加',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '平台添加'},
    {'KeyId': 3, 'Value': '官网注册'},
    {'KeyId': 5, 'Value': '集团添加'}
  ]
}
// 门店设置的零售抹零的单位;
export const StoreSettingParameterIgnoreUnit = {
  'Unit1': 1,
  'Unit3': 3,
  'Unit5': 5,
  'Types': {
    '1': '元',
    '3': '角',
    '5': '分',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '元'},
    {'KeyId': 3, 'Value': '角'},
    {'KeyId': 5, 'Value': '分'}
  ]
}
// 门店设置的零售抹零的舍入;
export const StoreSettingParameterIgnoreType = {
  'Type1': 1,
  'Type3': 3,
  'Type5': 5,
  'Types': {
    '1': '只舍不入',
    '3': '只入不舍',
    '5': '四舍五入',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '只舍不入'},
    {'KeyId': 3, 'Value': '只入不舍'},
    {'KeyId': 5, 'Value': '四舍五入'}
  ]
}
// 门店单号规则与审核的审核模式;
export const StoreSettingGenerateAuditType = {
  'Manual': 1,
  'Automac': 3,
  'Types': {
    '1': '人工审核',
    '3': '自动审核',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '人工审核'},
    {'KeyId': 3, 'Value': '自动审核'}
  ]
}
// 套餐类型;
export const StorePackageType = {
  'All': 0,
  'Free': 1,
  'Try': 3,
  'Flow': 5,
  'Date': 7,
  'None': 9,
  'Types': {
    '0': '全部',
    '1': '免费开通',
    '3': '试用',
    '5': '按量付费',
    '7': '按期付费',
    '9': '未开通',
  },
  'TypeArray': [
    {'KeyId': 0, 'Value': '全部'},
    {'KeyId': 1, 'Value': '免费开通'},
    {'KeyId': 3, 'Value': '试用'},
    {'KeyId': 5, 'Value': '按量付费'},
    {'KeyId': 7, 'Value': '按期付费'},
    {'KeyId': 9, 'Value': '未开通'}
  ]
}
// 套餐类型;
export const PackageType = {
  'All': 0,
  'Try': 3,
  'Flow': 5,
  'Date': 7,
  'Types': {
    '0': '全部',
    '3': '试用',
    '5': '按量付费',
    '7': '按期付费',
  },
  'TypeArray': [
    {'KeyId': 0, 'Value': '全部'},
    {'KeyId': 3, 'Value': '试用'},
    {'KeyId': 5, 'Value': '按量付费'},
    {'KeyId': 7, 'Value': '按期付费'}
  ]
}
// 卡券类型;
export const CouponType = {
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
    {'KeyId': 1, 'Value': '鼓励金'},
    {'KeyId': 3, 'Value': '置换金'},
    {'KeyId': 5, 'Value': '购物金'},
    {'KeyId': 7, 'Value': '抵用金'}
  ]
}
// 卡券收益状态;
export const WalletCouponProfitStatus = {
  'NoneOf': 3,
  'PartOf': 5,
  'AllOf': 7,
  'Types': {
    '3': '尚未收益',
    '5': '部分收益',
    '7': '全部收益',
  },
  'TypeArray': [
    {'KeyId': 3, 'Value': '尚未收益'},
    {'KeyId': 5, 'Value': '部分收益'},
    {'KeyId': 7, 'Value': '全部收益'}
  ]
}
// 卡券消费状态;
export const WalletCouponExpendStatus = {
  'NoneOf': 3,
  'PartOf': 5,
  'AllOf': 7,
  'Types': {
    '3': '尚未消费',
    '5': '部分消费',
    '7': '全部消费',
  },
  'TypeArray': [
    {'KeyId': 3, 'Value': '尚未消费'},
    {'KeyId': 5, 'Value': '部分消费'},
    {'KeyId': 7, 'Value': '全部消费'}
  ]
}
// 钱包卡券状态;
export const WalletCouponStatus = {
  'Abandon': 1,
  'Origin': 3,
  'Audit': 5,
  'Locked': 7,
  'Finish': 9,
  'Types': {
    '1': '已作废',
    '3': '待审核',
    '5': '已可用',
    '7': '已锁定',
    '9': '已结束',
  },
  'TypeArray': [
    {'KeyId': 1, 'Value': '已作废'},
    {'KeyId': 3, 'Value': '待审核'},
    {'KeyId': 5, 'Value': '已可用'},
    {'KeyId': 7, 'Value': '已锁定'},
    {'KeyId': 9, 'Value': '已结束'}
  ]
}
// 现金券单张状态;
export const WalletEquivXmlCouponStatus = {
  'Origin': 3,
  'Audit': 5,
  'Used': 7,
  'Locked': 8,
  'Finish': 9,
  'Types': {
    '3': '不可用',
    '5': '已可用',
    '7': '已使用',
    '8': '已锁定',
    '9': '已结束',
  },
  'TypeArray': [
    {'KeyId': 3, 'Value': '不可用'},
    {'KeyId': 5, 'Value': '已可用'},
    {'KeyId': 7, 'Value': '已使用'},
    {'KeyId': 8, 'Value': '已锁定'},
    {'KeyId': 9, 'Value': '已结束'}
  ]
}