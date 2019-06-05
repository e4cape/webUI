// 会员收益记录
const memberIncome = () => import('@/views/finance/memberIncome/index.vue')
// 我的余额
const balance = () => import('@/views/finance/management/balance.vue')
const rechargelist = () => import('@/views/finance/management/rechargelist.vue')
const freeExpireList = () =>
  import('@/views/finance/management/freeExpireList.vue')
// 消费记录
const expendlist = () => import('@/views/finance/management/expendlist.vue')
// 旅游基金
const tourlist = () => import('@/views/finance/management/tourlist.vue')
const basePath = '/finance'

export default [
  {
    path: `${basePath}/member/incomelist`,
    component: memberIncome,
    name: '会员收益记录'
  },
  {
    path: `${basePath}/management/balance`,
    component: balance,
    name: '账户管理'
  },
  {
    path: `${basePath}/management/rechargelist/:id?`,
    component: rechargelist,
    meta: {
      name: '充值记录',
      parentPath: `${basePath}/management/balance`
    }
  },
  {
    path: `${basePath}/management/expendlist`,
    component: expendlist,
    name: '消费记录'
  },
  {
    path: `${basePath}/management/tourlist`,
    component: tourlist,
    name: '旅游基金'
  },
  {
    path: `${basePath}/management/freeexpirelist/:id?`,
    component: freeExpireList,
    name: '赠送金额记录',
    meta: {
      parentPath: `${basePath}/management/balance`
    }
  }
]
