// 角色套餐状态;
export const CharacterPackState = {
  'Unupgrade': 1,
  'Unexpire': 3,
  'Expire': 5,
  'Types': {
    '1': '未升级',
    '3': '未到期',
    '5': '已到期'
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '未升级' },
    { 'KeyId': '3', 'Value': '未到期' },
    { 'KeyId': '5', 'Value': '已到期' }
  ]
}
// 考试状态;
export const EmployeeExamBasicState = {
  'Notyet': 1,
  'Ongoing': 3,
  'Finish': 5,
  'Types': {
    '1': '未开始',
    '3': '进行中',
    '5': '已完成'
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '未开始' },
    { 'KeyId': '3', 'Value': '进行中' },
    { 'KeyId': '5', 'Value': '已完成' }
  ]
}
// 考试结果;
export const EmployeeExamPaperPassState = {
  'Unexam': 1,
  'Unpass': 3,
  'Passed': 5,
  'Cancel': 7,
  'Types': {
    '1': '未考试',
    '3': '不合格',
    '5': '合格',
    '7': '放弃考试'
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '未考试' },
    { 'KeyId': '3', 'Value': '不合格' },
    { 'KeyId': '5', 'Value': '合格' },
    { 'KeyId': '7', 'Value': '放弃考试' }
  ]
}
// 频道类型;
export const InfrastCourseChannelType = {
  'System': 1,
  'College': 3,
  'Types': {
    '1': '系统培训',
    '3': '珠宝学院'
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '系统培训' },
    { 'KeyId': '3', 'Value': '珠宝学院' }
  ]
}
// 课程类型;
export const InfrastCourseType = {
  'Video': 1,
  'Article': 3,
  'Types': {
    '1': '视频',
    '3': '文摘'
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '视频' },
    { 'KeyId': '3', 'Value': '文摘' }
  ]
}
// 课程状态;
export const InfrastCourseState = {
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
    '11': '已取消'
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '草稿' },
    { 'KeyId': '3', 'Value': '待审核' },
    { 'KeyId': '5', 'Value': '审核通过' },
    { 'KeyId': '7', 'Value': '审核退回' },
    { 'KeyId': '9', 'Value': '已作废' },
    { 'KeyId': '11', 'Value': '已取消' }
  ]
}
// 题目类型;
export const InfrastCourseQuesType = {
  'Single': 1,
  'Multi': 3,
  'Types': {
    '1': '单选题',
    '3': '多选题'
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '单选题' },
    { 'KeyId': '3', 'Value': '多选题' }
  ]
}
// 日志状态;
export const InfrastCourseVideoLogState = {
  'Upload': 1,
  'Cancel': 3,
  'Delete': 5,
  'Types': {
    '1': '上传',
    '3': '取消上传',
    '5': '删除'
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '上传' },
    { 'KeyId': '3', 'Value': '取消上传' },
    { 'KeyId': '5', 'Value': '删除' }
  ]
}
// 来源类型;
export const PackOrderBasicSourceType = {
  'Autoed': 1,
  'Manual': 3,
  'Types': {
    '1': '商户',
    '3': '平台创建'
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '商户' },
    { 'KeyId': '3', 'Value': '平台创建' }
  ]
}
// 订单类型;
export const PackOrderBasicOrderType = {
  'First': 1,
  'Renew': 3,
  'Upgrade': 5,
  'Types': {
    '1': '首次购买',
    '3': '续费',
    '5': '升级'
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '首次购买' },
    { 'KeyId': '3', 'Value': '续费' },
    { 'KeyId': '5', 'Value': '升级' }
  ]
}
// 支付状态;
export const PackOrderBasicPaidState = {
  'Waiting': 1,
  'Success': 3,
  'Failed': 5,
  'Cancel': 7,
  'Types': {
    '1': '待支付',
    '3': '支付成功',
    '5': '支付失败',
    '7': '已取消'
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '待支付' },
    { 'KeyId': '3', 'Value': '支付成功' },
    { 'KeyId': '5', 'Value': '支付失败' },
    { 'KeyId': '7', 'Value': '已取消' }
  ]
}
// 订单状态;
export const PackOrderBasicState = {
  'Wait': 3,
  'Audit': 5,
  'Abandon': 9,
  'Cancel': 11,
  'Types': {
    '3': '待审核',
    '5': '已审核',
    '9': '已作废',
    '11': '已取消'
  },
  'TypeArray': [
    { 'KeyId': '3', 'Value': '待审核' },
    { 'KeyId': '5', 'Value': '已审核' },
    { 'KeyId': '9', 'Value': '已作废' },
    { 'KeyId': '11', 'Value': '已取消' }
  ]
}
// 字典类型;
export const SettingDictionaryDictType = {
  'System': 1,
  'College': 3,
  'Types': {
    '1': '系统培训',
    '3': '珠宝学院'
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '系统培训' },
    { 'KeyId': '3', 'Value': '珠宝学院' }
  ]
}
// 广告位置;
export const SustainAdvertLocationType = {
  'LocationType1': 1,
  'LocationType3': 3,
  'Types': {
    '1': 'PC端首页顶部',
    '3': 'APP端首页顶部'
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': 'PC端首页顶部' },
    { 'KeyId': '3', 'Value': 'APP端首页顶部' }
  ]
}
// 打开方式;
export const SustainAdvertOpenType = {
  'Current': 1,
  'New': 3,
  'Dialog': 5,
  'Types': {
    '1': '当前页打开',
    '3': '新标签页',
    '5': '弹出窗口'
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '当前页打开' },
    { 'KeyId': '3', 'Value': '新标签页' },
    { 'KeyId': '5', 'Value': '弹出窗口' }
  ]
}
// 链接类型;
export const SustainAdvertLinkType = {
  'System': 1,
  'College': 3,
  'Subject': 5,
  'Outter': 7,
  'Nothing': 9,
  'Types': {
    '1': '系统培训',
    '3': '珠宝学院',
    '5': '专题推荐',
    '7': '外部链接',
    '9': '无'
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '系统培训' },
    { 'KeyId': '3', 'Value': '珠宝学院' },
    { 'KeyId': '5', 'Value': '专题推荐' },
    { 'KeyId': '7', 'Value': '外部链接' },
    { 'KeyId': '9', 'Value': '无' }
  ]
}
// 推荐类型;
export const SustainRecmtType = {
  'System': 1,
  'College': 3,
  'Subject': 5,
  'Types': {
    '1': '系统培训',
    '3': '珠宝学院',
    '5': '专题推荐'
  },
  'TypeArray': [
    { 'KeyId': '1', 'Value': '系统培训' },
    { 'KeyId': '3', 'Value': '珠宝学院' },
    { 'KeyId': '5', 'Value': '专题推荐' }
  ]
}