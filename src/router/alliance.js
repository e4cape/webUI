const allianceCardManage = () => import('@/views/alliance/allianceCardManage/index') // 联盟券管理
const cardCreate = () => import('@/views/alliance/allianceCardManage/cardCreate') // 新建联盟券
const cardCheck = () => import('@/views/alliance/allianceCardManage/cardCheck/index') // 查看联盟券
const cardDetail = () => import('@/views/alliance/allianceCardManage/cardCheck/cardDetail') // 查看联盟券
const proAndTrans = () => import('@/views/alliance/allianceCardManage/cardCheck/proAndTrans') // 查看联盟券

const bonusSettlement = () => import('@/views/alliance/bonusSettlement/index') // 奖金结算
const cardOrder = () => import('@/views/alliance/cardOrder/index') // 卡卷订单

const affiliateManage = () => import('@/views/alliance/affiliateManage/index') // 联盟商管理
const affCreate = () => import('@/views/alliance/affiliateManage/affCreate') // 联盟商管理
const affDetail = () => import('@/views/alliance/affiliateManage/affDetail') // 联盟商管理

const styleManagement = () => import('@/views/alliance/styleManagement/index') // 样式管理
const union = () => import('@/views/alliance/union/index') // 联盟券统计
const couponDetail = () => import('@/views/alliance/union/couponDetail') // 联盟券统计详情
const detailList = () => import('@/views/alliance/union/detailList') // 联盟券统计结算明细
const statistics = () => import('@/views/alliance/statistics/index') // 联盟商统计
const seeDetail = () => import('@/views/alliance/statistics/seeDetail') // 联盟商统计详情
const settlement = () => import('@/views/alliance/settlement/index') // 结算统计
const usage = () => import('@/views/alliance/usage/index') // 异业联盟使用统计
const useDetail = () => import('@/views/alliance/usage/useDetail') // 异业联盟使用统计详情

const basePath = '/alliance'

export default [
  { 
    path: `${basePath}/allianceCardManage/index`,
    component: allianceCardManage,
    name: '联盟券管理'
  },
  { 
    path: `${basePath}/allianceCardManage/cardCreate`,
    component: cardCreate,
    name: '新建联盟券',
    meta: {
      parentPath: `${basePath}/allianceCardManage/index`
    }
  },
  {
    path: `${basePath}/cardCheck`,
    component: cardCheck,
    children: [
      {
        path: 'cardDetail',
        component: cardDetail,
        name: '卡券信息',
        meta: {
          parentPath: `${basePath}/allianceCardManage/index`
        }
      },
      {
        path: 'proAndTrans',
        component: proAndTrans,
        name: '推广与转化',
        meta: {
          parentPath: `${basePath}/allianceCardManage/index`
        }
      }
    ]
  },
  { 
    path: `${basePath}/bonusSettlement/index`,
    component: bonusSettlement,
    name: '奖金结算'
  },
  { 
    path: `${basePath}/cardOrder/index`,
    component: cardOrder,
    name: '卡卷订单'
  },
  { 
    path: `${basePath}/affiliateManage/index`,
    component: affiliateManage,
    name: '联盟商管理'
  },
  { 
    path: `${basePath}/affiliateManage/affCreate`,
    component: affCreate,
    name: '新增联盟商'
  },
  { 
    path: `${basePath}/affiliateManage/affDetail`,
    component: affDetail,
    name: '联盟商详情'
  },
  { 
    path: `${basePath}/styleManagement/index`,
    component: styleManagement,
    name: '样式管理'
  },
  {
    path: `${basePath}/union/index`,
    component: union,
    name: '联盟券统计'

  },
  {
    path: `${basePath}/union/couponDetail`,
    component: couponDetail,
    name: '联盟券统计详情',
    meta: {
      parentPath: `${basePath}/union/index`
    }
  },
  {
    path: `${basePath}/union/detailList`,
    component: detailList,
    name: '联盟券统计结算明细',
    meta: {
      parentPath: `${basePath}/union/index`
    }
  },
  {
    path: `${basePath}/statistics/index`,
    component: statistics ,
    name: '联盟商统计'
  },
  {
    path: `${basePath}/statistics/seeDetail`,
    component:seeDetail,
    name: '联盟商统计详情',
    meta: {
      parentPath: `${basePath}/statistics/index`
    }
  },
  {
    path: `${basePath}/settlement/index`,
    component: settlement,
    name: '结算统计'
  },
  {

    path: `${basePath}/usage/index`,
    component: usage,
    name: '异业联盟使用统计'

  },
  {

    path: `${basePath}/usage/useDetail`,
    component: useDetail,
    name: '异业联盟使用统计详情',
    meta: {
      parentPath: `${basePath}/usage/index`
    }
  }
]