// 提审记录
const wxapplereleaselist = () =>
  import('@/views/report/platformReport/wxAppleReleaseList')

// 统计报表
// -客户概况
const customerProfile = () =>
  import('@/views/report/statisticsReport/customerProfile')
// -粉丝统计
const fansStatistics = () =>
  import('@/views/report/statisticsReport/fansStatistics')
// -会员统计
const memberStatistics = () =>
  import('@/views/report/statisticsReport/memberStatistics')
// -客户分布
const customerDistribution = () =>
  import('@/views/report/statisticsReport/customerDistribution')
// -客户画像分析
const customerPortraitAnalysis = () =>
  import('@/views/report/statisticsReport/customerPortraitAnalysis')
// -营销效果分析
const marketingEffectivenessAnalysis = () =>
  import('@/views/report/statisticsReport/marketingEffectivenessAnalysis')
// -进店客户分析
const customerEntryAnalysis = () =>
  import('@/views/report/statisticsReport/customerEntryAnalysis')
// -积分报表
const scoreReport = () => import('@/views/report/statisticsReport/scoreReport')
const theStatistics = () =>
  import('@/views/report/statisticsReport/scoreReport/theStatistics')
const statement = () =>
  import('@/views/report/statisticsReport/scoreReport/statement')

// 优惠券领取统计
const couponReceiveList = () => import('@/views/report/coupon/receiveList.vue')
const couponReceiveDetail = () =>
  import('@/views/report/coupon/receiveDetail.vue')
// 微信会员卡报表
const memberCardList = () => import('@/views/report/coupon/memberCardList.vue')

// 薪酬绩效提成报表
const performanceReportCommission = () =>
  import('@/views/report/performanceReport/commissions')
// 薪酬绩效奖金报表
const performanceReportBonus = () =>
  import('@/views/report/performanceReport/bonus')

// 充值统计
const rechargeReport = () => import('@/views/report/rechargeReport/index.vue')
// 消费统计
const expendReport = () => import('@/views/report/expendReport/index.vue')
// 员工犒赏统计
const assessEmployeeReport = () =>
  import('@/views/report/assessEmployeeReport/index.vue')
// 会员收益统计
const memberIncomeReport = () =>
  import('@/views/report/memberIncomeReport/index.vue')

const basePath = '/report'

export default [
  {
    path: `${basePath}/platformReport/index`,
    component: wxapplereleaselist,
    name: '提审记录'
  },
  {
    path: `${basePath}/statisticsReport/customerProfile`,
    component: customerProfile,
    name: '客户概况'
  },
  {
    path: `${basePath}/statisticsReport/fansStatistics`,
    component: fansStatistics,
    name: '粉丝统计'
  },
  {
    path: `${basePath}/statisticsReport/memberStatistics`,
    component: memberStatistics,
    name: '会员统计'
  },
  {
    path: `${basePath}/statisticsReport/customerDistribution`,
    component: customerDistribution,
    name: '客户分布'
  },
  {
    path: `${basePath}/statisticsReport/customerPortraitAnalysis`,
    component: customerPortraitAnalysis,
    name: '客户画像分析'
  },
  {
    path: `${basePath}/statisticsReport/marketingEffectivenessAnalysis`,
    component: marketingEffectivenessAnalysis,
    name: '营销效果分析'
  },
  {
    path: `${basePath}/statisticsReport/customerEntryAnalysis`,
    component: customerEntryAnalysis,
    name: '进店客户分析'
  },
  {
    path: `${basePath}/statisticsReport/scoreReport`,
    component: scoreReport,
    name: '积分报表',
    children: [
      {
        path: 'theStatistics',
        component: theStatistics,
        name: '积分统计',
        meta: {
          parentPath: `${basePath}/statisticsReport/scoreReport/theStatistics`
        }
      },
      {
        path: 'statement',
        component: statement,
        name: '积分对账单',
        meta: {
          parentPath: `${basePath}/statisticsReport/scoreReport/statement`
        }
      }
    ]
  },
  {
    name: '领取统计',
    path: `${basePath}/coupon/receivelist`,
    component: couponReceiveList
  },
  {
    name: '领取详情',
    path: `${basePath}/coupon/receivedetail/:id`,
    component: couponReceiveDetail,
    meta: {
      parentPath: `${basePath}/coupon/receivelist`
    }
  },
  {
    path: `${basePath}/coupon/membercardlist`,
    component: memberCardList,
    name: '微信会员卡报表'
  },
  {
    path: `${basePath}/performanceReport/index`,
    component: performanceReportCommission
  },
  {
    path: `${basePath}/performanceReport/bonusreport`,
    component: performanceReportBonus
  },
  {
    path: `${basePath}/rechargereport/index`,
    component: rechargeReport,
    name: '充值统计'
  },
  {
    path: `${basePath}/expendreport/index`,
    component: expendReport,
    name: '消费统计'
  },
  {
    path: `${basePath}/assessemployeereport/index`,
    component: assessEmployeeReport,
    name: '员工犒赏统计'
  },
  {
    path: `${basePath}/memberincomereport/index`,
    component: memberIncomeReport,
    name: '会员收益统计'
  }
]
