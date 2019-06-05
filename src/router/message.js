// 短信发送;
const messageSend = () => import('@/views/message/messageSend/index')
const messageTaskCreate = () => import('@/views/message/messageSend/taskCreate')
const messageTaskDetail = () => import('@/views/message/messageSend/taskDetail')

// 短信模板;
const messageTemplate = () => import('@/views/message/messageTemplate/index')
const messageTemplateCreate = () => import('@/views/message/messageTemplate/templateCreate')
// 发送记录;
const messageRecord = () => import('@/views/message/messageRecord/index')
// 充值订单;
const paymentOrder = () => import('@/views/message/paymentOrder/index')
// 充值记录;
const messageOrder = () => import('@/views/message/messageOrder/index')
// 系统设置;
const messageSetter = () => import('@/views/message/messageSetter/index')

// 数据统计;
const dataStatistics = () => import('@/views/message/dataStatistics/index')
const statisticsStoreDetail = () => import('@/views/message/dataStatistics/statisticsStoreDetail')
const statisticsSendDetail = () => import('@/views/message/dataStatistics/statisticsSendDetail')

// 老会员管理
const memberManage = () => import('@/views/message/memberManage/index')
const checkMember = () => import('@/views/message/memberManage/checkMember')
const editMember = () => import('@/views/message/memberManage/editMember')
// 签名管理
const signatureManage = () => import('@/views/message/signatureManage/index')
// 短信账户
const messageAccount = () => import('@/views/message/messageAccount/index')
// 短信概况
const messageBasic = () => import('@/views/message/messageBasic/index')

const basePath = '/message'

export default [
  {
    path: `${basePath}/messageSend/index`,
    component: messageSend,
    name: '短信发送'
  }, {
    path: `${basePath}/messageSend/taskCreate`,
    component: messageTaskCreate,
    name: '新建任务',
    mata: {
      parentPath: `${basePath}/messageSend/index`
    }
  }, {
    path: `${basePath}/messageSend/taskDetail`,
    component: messageTaskDetail,
    name: '任务详情',
    mata: {
      parentPath: `${basePath}/messageSend/index`
    }
  }, {
    path: `${basePath}/messageTemplate/index`,
    component: messageTemplate,
    name: '短信模板'
  }, {
    path: `${basePath}/messageTemplate/templateCreate`,
    component: messageTemplateCreate,
    name: '新增模板',
    mata: {
      parentPath: `${basePath}/messageTemplate/index`
    }
  }, {
    name: '数据统计',
    path: `${basePath}/dataStatistics/index`,
    component: dataStatistics
  }, {
    name: '商家充值详情',
    path: `${basePath}/dataStatistics/statisticsStoreDetail`,
    component: statisticsStoreDetail
  }, {
    name: '发送详情',
    path: `${basePath}/dataStatistics/statisticsSendDetail`,
    component: statisticsSendDetail
  },
  { // 老会员管理
    name: '老会员管理',
    path: `${basePath}/memberManage/index`,
    component: memberManage
  },
  {
    name: '老会员详情',
    path: `${basePath}/memberManage/checkMember`,
    component: checkMember,
    meta: {
      parentPath: `${basePath}/memberManage/index`
    }
  },
  {
    name: '编辑老会员资料',
    path: `${basePath}/memberManage/editMember`,
    component: editMember,
    meta: {
      parentPath: `${basePath}/memberManage/index`
    }
  },
  { // 签名管理
    name: '签名管理',
    path: `${basePath}/signatureManage/index`,
    component: signatureManage

  },
  { // 发送记录
    name: '发送记录',
    path: `${basePath}/messageRecord/index`,
    component: messageRecord
  },
  { // 充值订单
    name: '充值订单',
    path: `${basePath}/paymentOrder/index`,
    component: paymentOrder
  },
  { // 充值记录
    path: `${basePath}/messageOrder/index`,
    component: messageOrder,
    meta: {
      name: '充值记录'
    }

  },
  { // 系统设置
    name: '系统设置',
    path: `${basePath}/messageSetter/index`,
    component: messageSetter
  },
  { // 短信账户
    name: '短信账户',
    path: `${basePath}/messageaccount/index`,
    component: messageAccount
  },
  // 短信概况
  {
    name: '短信概况',
    path: `${basePath}/messagebasic/index`,
    component: messageBasic
  }
]
