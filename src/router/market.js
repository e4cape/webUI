// 收益赠送设置
const profitsetting = () => import('@/views/market/profit/setting')
// 数据挖掘
// -数据挖掘
const dataMining = () => import('@/views/market/dataMining/index')
// -自定义标签
const customTag = () => import('@/views/market/dataMining/customTag')
// 客户营销
// -短信营销
const smsMarketing = () => import('@/views/market/customerMarketing/smsMarketing')
// -查看短信营销
const smsMarketingLook = () => import('@/views/market/customerMarketing/smsMarketingLook')
// -编辑短信营销
const smsMarketingEdit = () => import('@/views/market/customerMarketing/smsMarketingEdit')
// -营销短信记录
const marketingSmsRecord = () => import('@/views/market/customerMarketing/marketingSmsRecord')
// 优惠券管理
const index = () => import('@/views/market/coupon/index.vue')
const storeList = () => import('@/views/market/coupon/storeList.vue')
const couponCreate = () => import('@/views/market/coupon/couponCreate.vue')
const couponBasic = () => import('@/views/market/coupon/couponBasic.vue')
const couponItem = () => import('@/views/market/coupon/couponItem.vue')
const coupontypelist = () => import('@/views/market/coupon/couponTypeList.vue')
const salecardsCreate = () => import('@/views/market/coupon/saleCardsCreate.vue')
const couponOrderOnlineList = () => import('@/views/market/coupon/couponOrderOnlineList.vue')
const couponOrderUnlineList = () => import('@/views/market/coupon/couponOrderUnlineList.vue')
const cpounRewardStatistics = () => import('@/views/market/coupon/cpounRewardStatistics.vue')

// 商品管理
const productList = () => import('@/views/market/product/index.vue')
const productAdd = () => import('@/views/market/product/add.vue')
const productEdit = () => import('@/views/market/product/edit.vue')
// 营销产品设置
const marketProductSetting = () => import('@/views/market/productSettting/settings.vue')
// 手工赠送优惠券
const giveCoupon = () => import('@/views/market/giveCoupon/index.vue')
const giveCouponEdit = () => import('@/views/market/giveCoupon/giveCouponEdit.vue')
const giveCouponCheck = () => import('@/views/market/giveCoupon/giveCouponCheck.vue')
// 手工赠送
const scoreManual = () => import('@/views/market/score/manual.vue')

const scoreManualView = () => import('@/views/market/score/manualView.vue')
const scoreManualEdit = () => import('@/views/market/score/manualEdit.vue')
// 手工扣减积分/礼金
const abatement = () => import('@/views/market/abatement/index.vue')
const abatementCheck = () => import('@/views/market/abatement/abatementCheck.vue')
const abatementEdit = () => import('@/views/market/abatement/abatementEdit.vue')

// 排队领黄金
const lineUpGold = () => import('@/views/market/lineUpGold/index')
const createLineUpGold = () => import('@/views/market/lineUpGold/create')
const lineUpGoldDetail = () => import('@/views/market/lineUpGold/detail')

// 普通红包
const redPacketList = () => import('@/views/market/redPacket/index.vue')
const redPacketEdit = () => import('@/views/market/redPacket/redPacketEdit.vue')
const redPacketCheck = () => import('@/views/market/redPacket/redPacketCheck.vue')

// 发送记录
const sendLog = () => import('@/views/market/sendLog/index.vue')

// 平台营销产品管理
const mkproductlist = () => import('@/views/market/marketProduct/index')
const mkproductdetail = () => import('@/views/market/marketProduct/productDetail')
const mkproductedit = () => import('@/views/market/marketProduct/productEdit')

const basePath = '/market'
export default [
  {
    path: '/market/profit/setting',
    component: profitsetting,
    name: '收益赠送设置'
  },
  {
    path: '/market/dataMining/index',
    component: dataMining,
    name: '数据挖掘'
  },
  {
    path: '/market/dataMining/customTag',
    component: customTag,
    name: '自定义标签'

  },

  {
    path: `${basePath}/customerMarketing/smsMarketing`,
    component: smsMarketing,
    name: '短信营销'
  },
  {
    path: `${basePath}/customerMarketing/smsMarketingLook`,
    component: smsMarketingLook,
    name: '查看短信营销',
    meta: {
      parentPath: `${basePath}/customerMarketing/smsMarketing`
    }
  },
  {
    path: `${basePath}/customerMarketing/smsMarketingEdit`,
    component: smsMarketingEdit,
    name: '编辑短信营销',
    meta: {
      parentPath: `${basePath}/customerMarketing/smsMarketing`
    }
  },
  {
    path: `${basePath}/customerMarketing/marketingSmsRecord`,
    component: marketingSmsRecord,
    name: '营销短信记录'

  },

  {
    name: '通用券',
    path: `${basePath}/coupon/index`,
    component: index,
    meta: {
      parentPath: ''
    }
  },
  {
    name: '人情券',
    path: `${basePath}/coupon/giftcoupon`,
    component: index
  },
  {
    name: '可售卡券',
    path: `${basePath}/coupon/salecardslist`,
    component: index
  },
  // 平台端
  {
    // name: '商家通用券',
    path: `${basePath}/coupon/storelist/:id([1,2,3])`,
    component: storeList,
    meta: {
      parentPath: `${basePath}/coupon/index`
    },
    beforeEnter(to, from, next) {
      if (to.params.id == 1) {
        to.meta.parentPath = `${basePath}/coupon/index`
        to.meta.name = '商家通用券'
      } else if (to.params.id == 2) {
        to.meta.parentPath = `${basePath}/coupon/giftcoupon`
        to.meta.name = '商家人情券'
      } else {
        to.meta.parentPath = `${basePath}/coupon/salecardslist`
        to.meta.name = '商家可售卡券'
      }
      next()
    }
  },
  {
    name: '新建人情券',
    path: `${basePath}/coupon/giftcouponcreate`,
    component: couponCreate,
    meta: {
      parentPath: `${basePath}/coupon/giftcoupon`
    }
  },
  {
    name: '新建通用券',
    path: `${basePath}/coupon/couponcreate`,
    component: couponCreate,
    meta: {
      parentPath: `${basePath}/coupon/index`
    }
  },
  {
    name: '新增销售卡',
    path: `${basePath}/coupon/salecardsCreate/:id([1,2])`,
    component: salecardsCreate,
    meta: {
      parentPath: `${basePath}/coupon/salecardslist`
    },
    beforeEnter(to, from, next) {
      if (to.params.id == 1) {
        to.meta.name = '添加电子可售卡券'
      } else if (to.params.id == 2) {
        to.meta.name = '添加纸质可售卡券'
      }
      next()
    }
  },
  {
    name: '人情券详情',
    path: `${basePath}/coupon/giftcouponBasic/:id`,
    component: couponBasic,
    meta: {
      parentPath: `${basePath}/coupon/giftcoupon`
    }
  },
  {
    name: '人情券投放与使用',
    path: `${basePath}/coupon/giftcouponItem/:id`,
    component: couponItem,
    meta: {
      parentPath: `${basePath}/coupon/giftcoupon`
    }
  },
  {
    name: '电子可售卡券详情',
    path: `${basePath}/coupon/salecardsonlinebasic/:id`,
    component: couponBasic,
    meta: {
      parentPath: `${basePath}/coupon/salecardslist`
    }
  },
  {
    name: '纸质可售卡券详情',
    path: `${basePath}/coupon/salecardsunlinebasic/:id`,
    component: couponBasic,
    meta: {
      parentPath: `${basePath}/coupon/salecardslist`
    }
  },
  {
    name: '通用券详情',
    path: `${basePath}/coupon/couponBasic/:id`,
    component: couponBasic,
    meta: {
      parentPath: `${basePath}/coupon/index`
    }
  },
  {
    name: '通用券投放与使用',
    path: `${basePath}/coupon/couponItem/:id`,
    component: couponItem,
    meta: {
      parentPath: `${basePath}/coupon/index`
    }
  },
  {
    name: '电子可售卡券使用统计',
    path: `${basePath}/coupon/salecardsonlineitem/:id`,
    component: couponItem,
    meta: {
      parentPath: `${basePath}/coupon/salecardslist`
    }
  },
  {
    name: '纸质可售卡券使用统计',
    path: `${basePath}/coupon/salecardsunlineitem/:id`,
    component: couponItem,
    meta: {
      parentPath: `${basePath}/coupon/salecardslist`
    }
  },
  {
    name: '电子可售卡券销售',
    path: `${basePath}/coupon/couponorderonlinelist/:id`,
    component: couponOrderOnlineList,
    meta: {
      parentPath: `${basePath}/coupon/salecardslist`
    }
  },
  {
    name: '纸质可售卡券销售',
    path: `${basePath}/coupon/couponorderunlinelist/:id`,
    component: couponOrderUnlineList,
    meta: {
      parentPath: `${basePath}/coupon/salecardslist`
    }
  },
  {
    name: '卡券销售-奖励统计',
    path: `${basePath}/coupon/couponrewardstatics/:id`,
    component: cpounRewardStatistics,
    meta: {
      parentPath: `${basePath}/coupon/salecardslist`
    }
  },
  {
    name: '优惠券设置',
    path: `${basePath}/coupon/coupontypelist`,
    component: coupontypelist
  },
  {
    path: `${basePath}/product/index`,
    component: productList,
    meta: {
      name: '商品管理'
    }
  },
  {
    name: '添加商品',
    path: `${basePath}/product/add`,
    component: productAdd,
    meta: {
      parentPath: `${basePath}/product/index`
    }
  },
  {
    name: '修改商品',
    path: `${basePath}/product/edit/:id`,
    component: productEdit,
    meta: {
      parentPath: `${basePath}/product/index`
    }
  },
  {
    name: '手工赠送优惠券',
    path: `${basePath}/giveCoupon/index`,
    component: giveCoupon
  },
  {
    name: '编辑赠送优惠券',
    path: `${basePath}/giveCoupon/giveCouponEdit`,
    component: giveCouponEdit,
    meta: {
      parentPath: `${basePath}/giveCoupon/index`
    }
  },
  {
    name: '查看赠送优惠券',
    path: `${basePath}/giveCoupon/giveCouponCheck`,
    component: giveCouponCheck,
    meta: {
      parentPath: `${basePath}/giveCoupon/index`
    }
  },
  {
    name: '金利来',
    path: `${basePath}/productsetting/setting/:id([1,2,3,4])`,
    component: marketProductSetting
  },
  {
    name: '赠送记录',
    path: `${basePath}/score/log`,
    component: () => import('../views/market/score/log.vue')
  },
  {
    name: '手工赠送',
    path: `${basePath}/score/manual`,
    component: scoreManual
  },
  {
    name: '查看赠送单',
    path: `${basePath}/score/manual/view`,
    component: scoreManualView,
    meta: {
      parentPath: `${basePath}/score/manual`
    }
  },
  {
    name: '编辑赠送单',
    path: `${basePath}/score/manual/edit`,
    component: scoreManualEdit,
    meta: {
      parentPath: `${basePath}/score/manual`
    }
  },
  {
    name: '手工扣减',
    path: `${basePath}/abatement/index`,
    component: abatement
  },
  {
    name: '查看扣减单',
    path: `${basePath}/abatement/abatementCheck`,
    component: abatementCheck,
    meta: {
      parentPath: `${basePath}/abatement/index`
    }
  },
  {
    name: '编辑扣减单',
    path: `${basePath}/abatement/abatementEdit`,
    component: abatementEdit,
    meta: {
      parentPath: `${basePath}/abatement/index`
    }
  },
  {
    name: '赠送规则',
    path: `${basePath}/score/rule`,
    component: () => import('../views/market/score/rule.vue')
  },
  {
    name: '排队取金',
    path: `${basePath}/lineupgold/index`,
    component: lineUpGold
  },
  {
    name: '创建排队取金',
    path: `${basePath}/lineupgold/create`,
    component: createLineUpGold,
    meta: {
      parentPath: `${basePath}/lineupgold/index`
    }
  },
  {
    name: '修改排队取金',
    path: `${basePath}/lineupgold/edit/:id`,
    component: createLineUpGold,
    meta: {
      parentPath: `${basePath}/lineupgold/index`
    }
  },
  {
    name: '排队取金详情',
    path: `${basePath}/lineupgold/detail/:id`,
    component: lineUpGoldDetail,
    meta: {
      parentPath: `${basePath}/lineupgold/index`
    }
  },
  {
    name: '微信红包',
    path: `${basePath}/redPacket/index`,
    component: redPacketList,
    meta: {
      parentPath: `${basePath}/redPacket/index`
    }
  },
  {
    name: '新建微信红包',
    path: `${basePath}/redPacket/redPacketCreate`,
    component: redPacketEdit,
    meta: {
      parentPath: `${basePath}/redPacket/index`
    }
  },
  {
    name: '编辑微信红包',
    path: `${basePath}/redPacket/redPacketEdit`,
    component: redPacketEdit,
    meta: {
      parentPath: `${basePath}/redPacket/index`
    }
  },
  {
    name: '查看微信红包详情',
    path: `${basePath}/redPacket/redPacketCheck`,
    component: redPacketCheck,
    meta: {
      parentPath: `${basePath}/redPacket/index`
    }
  },
  {
    name: '发放记录',
    component: sendLog,
    path: `${basePath}/sendLog/index`
  },
  {
    path: basePath + '/marketproduct/index',
    component: mkproductlist,
    meta: {
      name: '营销产品设置'
    }
  }, 
  {
    path: basePath + '/marketproduct/detail',
    component: mkproductdetail,
    name: '营销产品详情',
    meta: {
      parentPath: basePath + '/marketproduct/index'
    }
  }, 
  {
    path: basePath + '/marketproduct/edit',
    component: mkproductedit,
    name: '修改营销产品',
    meta: {
      parentPath: basePath + '/marketproduct/index'
    }
  },
]