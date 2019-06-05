// 是否状态;
export const YNStatus = {
  'Yes': 3,
  'No': 1,
  'Types': {
    '3': '是',
    '1': '否'
  },
  'TypeArray': [{
    'KeyId': '3',
    'Value': '是'
  },
  {
    'KeyId': '1',
    'Value': '否'
  }
  ]
}
// 删除状态;
export const RMState = {
  'Origin': 3,
  'Remove': 1,
  'Types': {
    '3': '未删除',
    '1': '已删除'
  },
  'TypeArray': [{
    'KeyId': '3',
    'Value': '未删除'
  },
  {
    'KeyId': '1',
    'Value': '已删除'
  }
  ]
}
// 明细状态;
export const ItemState = {
  'Valid': 3,
  'Invalid': 1,
  'Types': {
    '3': '有效',
    '1': '无效'
  },
  'TypeArray': [{
    'KeyId': '3',
    'Value': '有效'
  },
  {
    'KeyId': '1',
    'Value': '无效'
  }
  ]
}
// 启用停用状态;
export const EnableState = {
  'Enable': 3,
  'Disable': 1,
  'Types': {
    '3': '已启用',
    '1': '已停用'
  },
  'TypeArray': [{
    'KeyId': '3',
    'Value': '已启用'
  },
  {
    'KeyId': '1',
    'Value': '已停用'
  }
  ]
}
// 拆单类型;
export const SplitType = {
  'Normal': 1,
  'Master': 3,
  'Slave': 5,
  'Types': {
    '1': '未拆单',
    '3': '主单',
    '5': '子单'
  },
  'TypeArray': [{
    'KeyId': '1',
    'Value': '未拆单'
  },
  {
    'KeyId': '3',
    'Value': '主单'
  },
  {
    'KeyId': '5',
    'Value': '子单'
  }
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
    '99': '系统'
  },
  'TypeArray': [{
    'KeyId': '1',
    'Value': '银行转账'
  },
  {
    'KeyId': '3',
    'Value': '支付宝'
  },
  {
    'KeyId': '5',
    'Value': '微信'
  },
  {
    'KeyId': '7',
    'Value': '银联'
  },
  {
    'KeyId': '9',
    'Value': '现金'
  },
  {
    'KeyId': '11',
    'Value': '花呗分期'
  },
  {
    'KeyId': '99',
    'Value': '系统'
  }
  ]
}
// 性别类型;
export const SexyType = {
  'Male': 1,
  'Female': 3,
  'Secret': 5,
  'Types': {
    '1': '男士',
    '3': '女士',
    '5': '保密'
  },
  'TypeArray': [{
    'KeyId': '1',
    'Value': '男士'
  },
  {
    'KeyId': '3',
    'Value': '女士'
  },
  {
    'KeyId': '5',
    'Value': '保密'
  }
  ]
}
// 排序类型;
export const SortType = {
  'Prev': 1,
  'Next': 3,
  'First': 5,
  'Last': 7,
  'Types': {
    '1': '上移',
    '3': '下移',
    '5': '上移顶部',
    '7': '下移底部'
  },
  'TypeArray': [{
    'KeyId': '1',
    'Value': '上移'
  },
  {
    'KeyId': '3',
    'Value': '下移'
  },
  {
    'KeyId': '5',
    'Value': '上移顶部'
  },
  {
    'KeyId': '7',
    'Value': '下移底部'
  }
  ]
}
// 操作类型;
export const OperationType = {
  'Create': 1,
  'Update': 3,
  'Delete': 5,
  'Cancel': 11,
  'Types': {
    '1': '创建',
    '3': '更新',
    '5': '删除',
    '11': '取消',
  },
  'TypeArray': [
    { 'KeyId': 1, 'Value': '创建' },
    { 'KeyId': 3, 'Value': '更新' },
    { 'KeyId': 5, 'Value': '删除' },
    { 'KeyId': 11, 'Value': '取消' }
  ]
}
// 快递类型;
export const ExpressType = {
  'SF': 1,
  'STO': 3,
  'ZTO': 5,
  'YTO': 7,
  'YUNDA': 9,
  'EMS': 11,
  'ZJS': 13,
  'DEPPON': 15,
  'TTK': 17,
  'BEST': 19,
  'Other': 99,
  'Types': {
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
  'TypeArray': [{
    'KeyId': '1',
    'Value': '顺丰'
  },
  {
    'KeyId': '3',
    'Value': '申通'
  },
  {
    'KeyId': '5',
    'Value': '中通'
  },
  {
    'KeyId': '7',
    'Value': '圆通'
  },
  {
    'KeyId': '9',
    'Value': '韵达'
  },
  {
    'KeyId': '11',
    'Value': 'EMS'
  },
  {
    'KeyId': '13',
    'Value': '宅急送'
  },
  {
    'KeyId': '15',
    'Value': '德邦'
  },
  {
    'KeyId': '17',
    'Value': '天天快递'
  },
  {
    'KeyId': '19',
    'Value': '百世快递'
  },
  {
    'KeyId': '99',
    'Value': '其它'
  }
  ]
}
// 发货类型;
export const ShippingType = {
  'PickedUp': 1,
  'Express': 3,
  'Types': {
    '1': '自提',
    '3': '快递'
  },
  'TypeArray': [{
    'KeyId': '1',
    'Value': '自提'
  },
  {
    'KeyId': '3',
    'Value': '快递'
  }
  ]
}
// 进货方式;
export const PurchaseType = {
  'Purchase': 1,
  'WeiwStuff': 3,
  'WeiwGoods': 5,
  'WeiwJunk': 7,
  'Types': {
    '1': '采购',
    '3': '委外加工',
    '5': '成品委外拆卸',
    '7': '旧货委外拆卸'
  },
  'TypeArray': [{
    'KeyId': '1',
    'Value': '采购'
  },
  {
    'KeyId': '3',
    'Value': '委外加工'
  },
  {
    'KeyId': '5',
    'Value': '成品委外拆卸'
  },
  {
    'KeyId': '7',
    'Value': '旧货委外拆卸'
  }
  ]
}
// 终端类型;
export const TerminalType = {
  'Cashier': 1,
  'Wechat': 3,
  'Website': 5,
  'Applet': 7,
  'Types': {
    '1': '收银台',
    '3': '微信端',
    '5': 'PC端',
    '7': '小程序'
  },
  'TypeArray': [{
    'KeyId': '1',
    'Value': '收银台'
  },
  {
    'KeyId': '3',
    'Value': '微信端'
  },
  {
    'KeyId': '5',
    'Value': 'PC端'
  },
  {
    'KeyId': '7',
    'Value': '小程序'
  }
  ]
}
// 原料类型;
export const StuffType = {
  'Gold': 1,
  'Stone': 3,
  'Part': 5,
  'Types': {
    '1': '金料',
    '3': '石料',
    '5': '配件'
  },
  'TypeArray': [{
    'KeyId': '1',
    'Value': '金料'
  },
  {
    'KeyId': '3',
    'Value': '石料'
  },
  {
    'KeyId': '5',
    'Value': '配件'
  }
  ]
}
// 来往单位类型;
export const PartnerType = {
  'Customer': 1,
  'Merchant': 3,
  'Supplier': 5,
  'Franchiser': 7,
  'Logistic': 9,
  'Types': {
    '1': '客户',
    '3': '客商',
    '5': '供应商',
    '7': '加盟商',
    '9': '物流商'
  },
  'TypeArray': [{
    'KeyId': '1',
    'Value': '客户'
  },
  {
    'KeyId': '3',
    'Value': '客商'
  },
  {
    'KeyId': '5',
    'Value': '供应商'
  },
  {
    'KeyId': '7',
    'Value': '加盟商'
  },
  {
    'KeyId': '9',
    'Value': '物流商'
  }
  ]
}
// 门店类型;
export const StoreType = {
  'Direct': 1,
  'Joining': 3,
  'Union': 5,
  'Types': {
    '1': '直营',
    '3': '加盟',
    '5': '联营'
  },
  'TypeArray': [{
    'KeyId': '1',
    'Value': '直营'
  },
  {
    'KeyId': '3',
    'Value': '加盟'
  },
  {
    'KeyId': '5',
    'Value': '联营'
  }
  ]
}
// 花呗分期手续费承担;
export const ChargeType = {
  'Merchant': 1,
  'Customer': 3,
  'Types': {
    '1': '商户承担',
    '3': '客户承担'
  },
  'TypeArray': [{
    'KeyId': '1',
    'Value': '商户承担'
  },
  {
    'KeyId': '3',
    'Value': '客户承担'
  }
  ]
}
// 套餐类型(旧);
export const PackageType = {
  'Free': 1,
  'Try': 3,
  'Flow': 5,
  'Date': 7,
  'Types': {
    '1': '免费开通',
    '3': '试用',
    '5': '按量付费',
    '7': '按期付费'
  },
  'TypeArray': [{
    'KeyId': '1',
    'Value': '免费开通'
  },
  {
    'KeyId': '3',
    'Value': '试用'
  },
  {
    'KeyId': '5',
    'Value': '按量付费'
  },
  {
    'KeyId': '7',
    'Value': '按期付费'
  }
  ]
}
// 角色类型;
export const CharacterType = {
  'Lingcb': 1001,
  'Lbranch': 1101,
  'Group': 2001,
  'Company': 2101,
  'Store': 2201,
  'Supplier': 3001,
  'Types': {
    '1001': '零成本平台',
    '1101': '零成本分公司',
    '2001': '珠宝集团',
    '2101': '珠宝公司',
    '2201': '珠宝门店',
    '3001': '礼品供应商'
  },
  'TypeArray': [{
    'KeyId': '1001',
    'Value': '零成本平台'
  },
  {
    'KeyId': '1101',
    'Value': '零成本分公司'
  },
  {
    'KeyId': '2001',
    'Value': '珠宝集团'
  },
  {
    'KeyId': '2101',
    'Value': '珠宝公司'
  },
  {
    'KeyId': '2201',
    'Value': '珠宝门店'
  },
  {
    'KeyId': '3001',
    'Value': '礼品供应商'
  }
  ]
}
// 微信授权状态;
export const WxAuthorizerStatus = {
  'Unauth': 1,
  'Auth': 3,
  'Types': {
    '1': '已取消授权',
    '3': '已认证授权'
  },
  'TypeArray': [{
    'KeyId': '1',
    'Value': '已取消授权'
  },
  {
    'KeyId': '3',
    'Value': '已认证授权'
  }
  ]
}
// 范围类型;
export const RangeType = {
  'All': 1,
  'Less': 3,
  'Over': 5,
  'Range': 7,
  'Types': {
    1: '全部',
    3: '小于',
    5: '大于',
    7: '范围',
  },
  'TypeArray': [
    { 'KeyId': 1, 'Value': '全部' },
    { 'KeyId': 3, 'Value': '小于' },
    { 'KeyId': 5, 'Value': '大于' },
    { 'KeyId': 7, 'Value': '范围' }
  ]
};
// 视频状态(阿里);
export const VodState = {
  'Uploading': 1,
  'UploadFail': 3,
  'UploadSucc': 5,
  'Transcoding': 7,
  'TranscodeFail': 9,
  'Checking': 11,
  'Blocked': 13,
  'Normal': 15,
  'Types': {
    '1': '上传中',
    '3': '上传失败',
    '5': '上传完成',
    '7': '转码中',
    '9': '转码失败',
    '11': '审核中',
    '13': '屏蔽',
    '15': '正常'
  },
  'TypeArray': [{
    'KeyId': '1',
    'Value': '上传中'
  },
  {
    'KeyId': '3',
    'Value': '上传失败'
  },
  {
    'KeyId': '5',
    'Value': '上传完成'
  },
  {
    'KeyId': '7',
    'Value': '转码中'
  },
  {
    'KeyId': '9',
    'Value': '转码失败'
  },
  {
    'KeyId': '11',
    'Value': '审核中'
  },
  {
    'KeyId': '13',
    'Value': '屏蔽'
  },
  {
    'KeyId': '15',
    'Value': '正常'
  }
  ]
}