// 支付授权状态;
export const PaymentAuthorizerStatus = {
  'Unauth': 1,
  'Auth': 3,
  'Types': {
    '1': '已取消授权',
    '3': '已认证授权',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '已取消授权'
    },
    {
      'KeyId': 3,
      'Value': '已认证授权'
    }
  ]
}
// 支付方式;
export const PaymentOrderLogPaymentType = {
  'WxPay': 1,
  'AliPay': 3,
  'Types': {
    '1': '微信支付',
    '3': '支付宝',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '微信支付'
    },
    {
      'KeyId': 3,
      'Value': '支付宝'
    }
  ]
}
// 订单类型(来源单据类型);
export const PaymentOrderLogOrderType = {
  'OrderRecharge': 1,
  'OrderExpend': 3,
  'OrderAssess': 5,
  'OrderSMS': 7,
  'Types': {
    '1': '商户充值单',
    '3': '商户消费单',
    '5': '商户打赏单',
    '7': '商户短信单',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '商户充值单'
    },
    {
      'KeyId': 3,
      'Value': '商户消费单'
    },
    {
      'KeyId': 5,
      'Value': '商户打赏单'
    },
    {
      'KeyId': 7,
      'Value': '商户短信单'
    }
  ]
}
// 交易类型;
export const PaymentOrderLogTradeType = {
  'POS': 1,
  'NATIVE': 3,
  'JSAPI': 5,
  'Other': 19,
  'Types': {
    '1': '刷卡支付',
    '3': '扫码支付',
    '5': '公众号支付',
    '19': '其他支付',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '刷卡支付'
    },
    {
      'KeyId': 3,
      'Value': '扫码支付'
    },
    {
      'KeyId': 5,
      'Value': '公众号支付'
    },
    {
      'KeyId': 19,
      'Value': '其他支付'
    }
  ]
}
// 支付状态;
export const PaymentOrderLogPayStatus = {
  'OK': 1,
  'ERROR': 3,
  'Types': {
    '1': '支付成功',
    '3': '支付失败',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '支付成功'
    },
    {
      'KeyId': 3,
      'Value': '支付失败'
    }
  ]
}
// 响应结果的数据格式;
export const ResponseMediaType = {
  'Text': 1,
  'XML': 3,
  'Types': {
    '1': '文本',
    '3': 'XML',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '文本'
    },
    {
      'KeyId': 3,
      'Value': 'XML'
    }
  ]
}
// 通联支付交易类型;
export const AlliTransType = {
  'BankCost': 100100001,
  'ScanCode': 100300001,
  'BankCardRevoke': 200100001,
  'Sign': 900100001,
  'Types': {
    '100100001': '银行卡消费',
    '100300001': '扫码支付',
    '200100001': '银行卡撤销',
    '900100001': '签到',
  },
  'TypeArray': [{
      'KeyId': 100100001,
      'Value': '银行卡消费'
    },
    {
      'KeyId': 100300001,
      'Value': '扫码支付'
    },
    {
      'KeyId': 200100001,
      'Value': '银行卡撤销'
    },
    {
      'KeyId': 900100001,
      'Value': '签到'
    }
  ]
}
// 授权力度(枚举);
export const PaymentAuthorizerType = {
  'Group': 1,
  'Compony': 3,
  'Store': 5,
  'Career': 7,
  'AppletGroup': 9,
  'AppletCompony': 11,
  'AppletStore': 13,
  'Types': {
    '1': '授权公众号(集团)',
    '3': '授权公众号(商户)',
    '5': '授权公众号(门店)',
    '7': '授权公众号(合伙人)',
    '9': '授权小程序(集团)',
    '11': '授权小程序(商户)',
    '13': '授权小程序(门店)',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '授权公众号(集团)'
    },
    {
      'KeyId': 3,
      'Value': '授权公众号(商户)'
    },
    {
      'KeyId': 5,
      'Value': '授权公众号(门店)'
    },
    {
      'KeyId': 7,
      'Value': '授权公众号(合伙人)'
    },
    {
      'KeyId': 9,
      'Value': '授权小程序(集团)'
    },
    {
      'KeyId': 11,
      'Value': '授权小程序(商户)'
    },
    {
      'KeyId': 13,
      'Value': '授权小程序(门店)'
    }
  ]
}
// 红包状态(枚举);
export const PaymentRedPacketStatus = {
  'Error': 1,
  'UnReceive': 3,
  'Receive': 5,
  'Expired': 7,
  'Types': {
    '1': '发送失败',
    '3': '未领取',
    '5': '已领取',
    '7': '已过期',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '发送失败'
    },
    {
      'KeyId': 3,
      'Value': '未领取'
    },
    {
      'KeyId': 5,
      'Value': '已领取'
    },
    {
      'KeyId': 7,
      'Value': '已过期'
    }
  ]
}
// 红包活动状态(枚举);
export const PaymentRedPacketAuditStatus = {
  'Abandon': 1,
  'Origin': 3,
  'Audit': 5,
  'Terminal': 7,
  'Types': {
    '1': '已作废',
    '3': '待审核',
    '5': '已审核',
    '7': '已终止',
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
    },
    {
      'KeyId': 7,
      'Value': '已终止'
    }
  ]
}
// 红包活动触发规则;
export const PaymentRedPacketEventType = {
  'FirstAttention': 1,
  'Buy': 3,
  'Included': 5,
  'Give': 7,
  'Scan': 9,
  'MemberCard': 11,
  'Types': {
    '1': '首次关注公众号',
    '3': '消费成功',
    '5': '参与活动',
    '7': '人情券转赠领取成功后发送',
    '9': '扫码领红包',
    '11': '会员卡领取成功发红包',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '首次关注公众号'
    },
    {
      'KeyId': 3,
      'Value': '消费成功'
    },
    {
      'KeyId': 5,
      'Value': '参与活动'
    },
    {
      'KeyId': 7,
      'Value': '人情券转赠领取成功后发送'
    },
    {
      'KeyId': 9,
      'Value': '扫码领红包'
    },
    {
      'KeyId': 11,
      'Value': '会员卡领取成功发红包'
    }
  ]
}
// 单据来源;
export const PaymentRedPacketOrderSourceType = {
  'Cashier': 1,
  'Wechat': 3,
  'Website': 5,
  'Types': {
    '1': '收银台',
    '3': '微信端',
    '5': 'PC端',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '收银台'
    },
    {
      'KeyId': 3,
      'Value': '微信端'
    },
    {
      'KeyId': 5,
      'Value': 'PC端'
    }
  ]
}
// 消费金额类型;
export const PaymentRedPacketOrderCashType = {
  'Unlimited': 1,
  'CashPrice': 3,
  'Types': {
    '1': '不限',
    '3': '消费满',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '不限'
    },
    {
      'KeyId': 3,
      'Value': '消费满'
    }
  ]
}
// 红包金额类型;
export const PaymentRedPacketPriceType = {
  'Fixed': 1,
  'Random': 3,
  'Types': {
    '1': '固定金额',
    '3': '随机金额',
  },
  'TypeArray': [{
      'KeyId': 1,
      'Value': '固定金额'
    },
    {
      'KeyId': 3,
      'Value': '随机金额'
    }
  ]
}