// 分类字典的字典类型;
export const SettingDictionaryDictType = {
  'NeiborBasicCategoryType': 1,
  'Types': {
    '1': '联盟商类型'
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '联盟商类型'}
  ]
}
// 联盟券结算单(按联盟商)的结算单类型;
export const SettleTicketBillBasicBillType = {
  'Shared': 1,
  'Transf': 3,
  'Types': {
    '1': '推广结算单',
    '3': '转化结算单'
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '推广结算单'},
    {'KeyId': '3', 'Value': '转化结算单'}
  ]
}
// 联盟券结算单(按联盟商)的结算单状态;
export const SettleTicketBillBasicState = {
  'Wait': 1,
  'Audit': 3,
  'Paid': 5,
  'Abandon': 7,
  'Types': {
    '1': '待审核',
    '3': '审核通过',
    '5': '已结算',
    '7': '已作废'
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '待审核'},
    {'KeyId': '3', 'Value': '审核通过'},
    {'KeyId': '5', 'Value': '已结算'},
    {'KeyId': '7', 'Value': '已作废'}
  ]
}
// 联盟券的检索类型;
export const TicketBasicQueryType = {
  'Shared': 1,
  'Expire': 3,
  'Newest': 5,
  'Types': {
    '1': '正在推广',
    '3': '过期卡券',
    '5': '今日上新'
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '正在推广'},
    {'KeyId': '3', 'Value': '过期卡券'},
    {'KeyId': '5', 'Value': '今日上新'}
  ]
}
// 联盟券类型;
export const TicketBasicTicketType = {
  'Gift': 1,
  'Sale': 3,
  'Types': {
    '1': '赠送券',
    '3': '销售券'
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '赠送券'},
    {'KeyId': '3', 'Value': '销售券'}
  ]
}
// 联盟券的使用设置;
export const TicketBasicRuleType = {
  'None': 1,
  'Full': 3,
  'Types': {
    '1': '无门槛使用',
    '3': '消费满?使用'
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '无门槛使用'},
    {'KeyId': '3', 'Value': '消费满?使用'}
  ]
}
// 联盟券的面额类型;
export const TicketBasicGiftValType = {
  'Fixed': 1,
  'Random': 3,
  'Types': {
    '1': '固定金额',
    '3': '随机金额'
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '固定金额'},
    {'KeyId': '3', 'Value': '随机金额'}
  ]
}
// 联盟券状态;
export const TicketBasicState = {
  'Wait': 3,
  'Audit': 5,
  'Reject': 7,
  'Abandon': 9,
  'Finish': 11,
  'Types': {
    '3': '待审核',
    '5': '审核通过',
    '7': '审核退回',
    '9': '已作废',
    '11': '已终止'
  },
  'TypeArray': [
    {'KeyId': '3', 'Value': '待审核'},
    {'KeyId': '5', 'Value': '审核通过'},
    {'KeyId': '7', 'Value': '审核退回'},
    {'KeyId': '9', 'Value': '已作废'},
    {'KeyId': '11', 'Value': '已终止'}
  ]
}
// 联盟券绑定的联盟商的奖励类型;
export const TicketNeiborRewaidType = {
  'Fixed': 1,
  'Step': 3,
  'Types': {
    '1': '固定奖励',
    '3': '阶梯奖励'
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '固定奖励'},
    {'KeyId': '3', 'Value': '阶梯奖励'}
  ]
}
// 联盟券绑定的联盟商的转化结算类型;
export const TicketNeiborTransfType = {
  'Transf': 1,
  'Tcoin': 3,
  'Types': {
    '1': '按券奖励',
    '3': '按消费金额'
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '按券奖励'},
    {'KeyId': '3', 'Value': '按消费金额'}
  ]
}
// 联盟券绑定的联盟商的转化结算的按消费金额奖励;
export const TicketNeiborTcoinType = {
  'Bill': 1,
  'Paid': 3,
  'Types': {
    '1': '应付金额',
    '3': '实付金额'
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '应付金额'},
    {'KeyId': '3', 'Value': '实付金额'}
  ]
}
// 联盟券绑定的联盟商的奖励状态;
export const TicketNeiborRewaidState = {
  'Enable': 1,
  'Disable': 3,
  'Types': {
    '1': '已启用',
    '3': '已停用'
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '已启用'},
    {'KeyId': '3', 'Value': '已停用'}
  ]
}
// 联盟券绑定的联盟商的绑定状态;
export const TicketNeiborBindState = {
  'Binded': 1,
  'Unbind': 3,
  'Remove': 5,
  'Types': {
    '1': '已绑定',
    '3': '已解绑',
    '5': '已删除'
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '已绑定'},
    {'KeyId': '3', 'Value': '已解绑'},
    {'KeyId': '5', 'Value': '已删除'}
  ]
}
// 联盟券结算(按联盟商)的检索类型;
export const TicketNeiborSettleQueryType = {
  'NoneOf': 1,
  'PartOf': 3,
  'AllOf': 5,
  'NowOf': 7,
  'TotalOf': 9,
  'Types': {
    '1': '尚未结算',
    '3': '部分结算',
    '5': '全部结算',
    '7': '今日结算',
    '9': '累计结算'
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '尚未结算'},
    {'KeyId': '3', 'Value': '部分结算'},
    {'KeyId': '5', 'Value': '全部结算'},
    {'KeyId': '7', 'Value': '今日结算'},
    {'KeyId': '9', 'Value': '累计结算'}
  ]
}
// 联盟券结算(按联盟商)的结算状态;
export const TicketNeiborSettleState = {
  'NoneOf': 1,
  'SharedOf': 3,
  'TransfOf': 5,
  'AllOf': 7,
  'Types': {
    '1': '尚未结算',
    '3': '已推广结算',
    '5': '已转化结算',
    '7': '全部结算'
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '尚未结算'},
    {'KeyId': '3', 'Value': '已推广结算'},
    {'KeyId': '5', 'Value': '已转化结算'},
    {'KeyId': '7', 'Value': '全部结算'}
  ]
}
// 联盟券结算(按联盟券)的结算状态;
export const TicketSettleState = {
  'NoneOf': 1,
  'PartOf': 3,
  'AllOf': 5,
  'Types': {
    '1': '尚未结算',
    '3': '部分结算',
    '5': '全部结算'
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '尚未结算'},
    {'KeyId': '3', 'Value': '部分结算'},
    {'KeyId': '5', 'Value': '全部结算'}
  ]
}
// 联盟券订单状态;
export const TicketOrderBasicState = {
  'Wait': 1,
  'Audit': 3,
  'Return': 5,
  'Types': {
    '1': '待付款',
    '3': '已成交',
    '5': '已退款'
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '待付款'},
    {'KeyId': '3', 'Value': '已成交'},
    {'KeyId': '5', 'Value': '已退款'}
  ]
}
// 我的消息(联盟商)的消息状态;
export const WalletMsgState = {
  'Wait': 1,
  'Read': 3,
  'Remove': 5,
  'Types': {
    '1': '未读',
    '3': '已读',
    '5': '已删除'
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '未读'},
    {'KeyId': '3', 'Value': '已读'},
    {'KeyId': '5', 'Value': '已删除'}
  ]
}
// 我的领券(会员)的领券状态;
export const WalletTicketState = {
  'Unused': 1,
  'Locked': 3,
  'Transf': 5,
  'Expired': 7,
  'Abandon': 9,
  'Types': {
    '1': '未使用',
    '3': '已锁定',
    '5': '已使用',
    '7': '已过期',
    '9': '已作废'
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '未使用'},
    {'KeyId': '3', 'Value': '已锁定'},
    {'KeyId': '5', 'Value': '已使用'},
    {'KeyId': '7', 'Value': '已过期'},
    {'KeyId': '9', 'Value': '已作废'}
  ]
}