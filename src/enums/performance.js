// 奖金类型;
export const BonusType = {
  'Target': 1,
  'Largar': 3,
  'Types': {
    '1': '目标奖金',
    '3': '个人大单奖',
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '目标奖金'},
    {'KeyId': '3', 'Value': '个人大单奖'}
  ]
}
// 员工在职状态;
export const EmployeeVitaStatus = {
  'Try': 1,
  'Official': 3,
  'Leaved': 5,
  'Types': {
    '1': '试用',
    '3': '正式',
    '5': '离职',
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '试用'},
    {'KeyId': '3', 'Value': '正式'},
    {'KeyId': '5', 'Value': '离职'}
  ]
}
// 员工账户状态;
export const EmployeeUserStatus = {
  'Abandon': 1,
  'Wait': 3,
  'Audit': 5,
  'Types': {
    '1': '已作废',
    '3': '待审核',
    '5': '已审核',
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '已作废'},
    {'KeyId': '3', 'Value': '待审核'},
    {'KeyId': '5', 'Value': '已审核'}
  ]
}
// 零售单的来源类型;
export const SaleOrderBasicSourceType = {
  'MarketingCloud': 1,
  'StockingCloud': 3,
  'Types': {
    '1': '营销系统的消费单',
    '3': 'ERP的手工零售单',
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '营销系统的消费单'},
    {'KeyId': '3', 'Value': 'ERP的手工零售单'}
  ]
}
// 零售单的退货状态;
export const SaleOrderBasicReturnStatus = {
  'No': 1,
  'Yes': 3,
  'Types': {
    '1': '未退货',
    '3': '已退货',
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '未退货'},
    {'KeyId': '3', 'Value': '已退货'}
  ]
}
// 消息队列类型;
export const MessageQueueType = {
  'PerformanceCloudGlobalCommonQueue': 0,
  'StockingCloudSaleAndRmaReturnTempQueue': 1,
  'CancelBySaleEventMessage': 2,
  'MembershipCloudOrderEventQueue': 3,
  'ComponentCloudSendWxTemplateMsgQueue': 4,
  'MarketingCloudQueueReceiveGoldEventQueue': 5,
  'Types': {
    '0': '绩效考核系统的公共消息队列',
    '1': 'ERP零售单同步消息队列',
    '2': 'ERP零售单取消审核同步消息队列',
    '3': 'CRM零售单同步消息队列',
    '4': '微信第三方发送模版消息',
    '5': '营销系统排队取金消息队列',
  },
  'TypeArray': [
    {'KeyId': '0', 'Value': '绩效考核系统的公共消息队列'},
    {'KeyId': '1', 'Value': 'ERP零售单同步消息队列'},
    {'KeyId': '2', 'Value': 'ERP零售单取消审核同步消息队列'},
    {'KeyId': '3', 'Value': 'CRM零售单同步消息队列'},
    {'KeyId': '4', 'Value': '微信第三方发送模版消息'},
    {'KeyId': '5', 'Value': '营销系统排队取金消息队列'}
  ]
}
// 提成大类类型;
export const RatioLargeType = {
  'Guide': 1,
  'Other': 3,
  'Types': {
    '1': '导购提成方案',
    '3': '管理人员提成方案',
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '导购提成方案'},
    {'KeyId': '3', 'Value': '管理人员提成方案'}
  ]
}
// 提成方式类型;
export const RatioPatternType = {
  'Avg': 1,
  'Category': 3,
  'Types': {
    '1': '按导购平均提成金额倍率',
    '3': '按品类销售总额提成',
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '按导购平均提成金额倍率'},
    {'KeyId': '3', 'Value': '按品类销售总额提成'}
  ]
}
// 账户状态;
export const SecurityUserState = {
  'Abandon': 1,
  'Wait': 3,
  'Audit': 5,
  'Types': {
    '1': '已作废',
    '3': '待审核',
    '5': '已审核',
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '已作废'},
    {'KeyId': '3', 'Value': '待审核'},
    {'KeyId': '5', 'Value': '已审核'}
  ]
}
// 系统菜单的终端类型;
export const SecurityMenuTerminalType = {
  'Web': 1,
  'App': 3,
  'Types': {
    '1': 'PC端',
    '3': '手机端',
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': 'PC端'},
    {'KeyId': '3', 'Value': '手机端'}
  ]
}
// 系统菜单的子系统类型;
export const SecurityMenuSubsetType = {
  'MarketingCloud': 1,
  'PerformanceCloud': 3,
  'ScoringCloud': 5,
  'MessageCloud': 7,
  'StockingCloud': 9,
  'MembershipCloud': 11,
  'SpreadCloud': 13,
  'SystemSetting': 99,
  'Types': {
    '1': '营销系统',
    '3': '薪酬绩效系统',
    '5': '积分卡券系统',
    '7': '短信系统',
    '9': 'ERP系统',
    '11': 'SCRM系统',
    '13': '营销活动系统',
    '99': '系统设置',
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '营销系统'},
    {'KeyId': '3', 'Value': '薪酬绩效系统'},
    {'KeyId': '5', 'Value': '积分卡券系统'},
    {'KeyId': '7', 'Value': '短信系统'},
    {'KeyId': '9', 'Value': 'ERP系统'},
    {'KeyId': '11', 'Value': 'SCRM系统'},
    {'KeyId': '13', 'Value': '营销活动系统'},
    {'KeyId': '99', 'Value': '系统设置'}
  ]
}
// 员工角色类型(微信端);
export const SecurityUserBerthType = {
  'Employee': 1,
  'Master': 3,
  'Administrator': 5,
  'Types': {
    '1': '店员',
    '3': '店长',
    '5': '超级管理员',
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '店员'},
    {'KeyId': '3', 'Value': '店长'},
    {'KeyId': '5', 'Value': '超级管理员'}
  ]
}
// 收银台权限;
export const SecurityUserCashierType = {
  'Employee': 1,
  'Cashier': 3,
  'Other': 9,
  'Types': {
    '1': '导购',
    '3': '收银员',
    '9': '其他',
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '导购'},
    {'KeyId': '3', 'Value': '收银员'},
    {'KeyId': '9', 'Value': '其他'}
  ]
}
// 来源类型;
export const SecurityUserFromType = {
  'Provider': 1,
  'Store': 3,
  'Types': {
    '1': '平台',
    '3': '商户',
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '平台'},
    {'KeyId': '3', 'Value': '商户'}
  ]
}
// 员工在职状态;
export const SecurityUserVitaState = {
  'Try': 1,
  'Official': 3,
  'Leaved': 5,
  'Types': {
    '1': '试用',
    '3': '正式',
    '5': '离职',
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '试用'},
    {'KeyId': '3', 'Value': '正式'},
    {'KeyId': '5', 'Value': '离职'}
  ]
}
// 在职状态类型;
export const SettingPromoteOfficialType = {
  'Probation': 1,
  'Official': 3,
  'Types': {
    '1': '试用期',
    '3': '已转正',
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '试用期'},
    {'KeyId': '3', 'Value': '已转正'}
  ]
}
// 贡献率类型;
export const SettingPromoteContribType = {
  'Ratio': 1,
  'Reward': 3,
  'Types': {
    '1': '按比率',
    '3': '按贡献奖/排名',
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '按比率'},
    {'KeyId': '3', 'Value': '按贡献奖/排名'}
  ]
}
// 系统公告状态;
export const SettingNoticeStatus = {
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
    {'KeyId': '1', 'Value': '已作废'},
    {'KeyId': '3', 'Value': '待审核'},
    {'KeyId': '5', 'Value': '已审核'},
    {'KeyId': '7', 'Value': '已拒绝'}
  ]
}
// 品类设置的科目类型;
export const StoreSettingCategoryType = {
  'CategoryType': 1,
  'MaterialType': 3,
  'GoldType': 5,
  'SeriesType': 7,
  'PaymentType': 9,
  'Types': {
    '1': '品类',
    '3': '材质',
    '5': '成色',
    '7': '系列',
    '9': '支付方式',
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '品类'},
    {'KeyId': '3', 'Value': '材质'},
    {'KeyId': '5', 'Value': '成色'},
    {'KeyId': '7', 'Value': '系列'},
    {'KeyId': '9', 'Value': '支付方式'}
  ]
}
// 对赌类型;
export const WagerType = {
  'Pers': 1,
  'Team': 3,
  'Types': {
    '1': '个人对赌个人业绩',
    '3': '个人对赌团队业绩',
  },
  'TypeArray': [
    {'KeyId': '1', 'Value': '个人对赌个人业绩'},
    {'KeyId': '3', 'Value': '个人对赌团队业绩'}
  ]
}