// 礼品兑换报表;
const saleReport = () => import('@/views/gift/saleReport/index')
const saleReportTrend = () => import('@/views/gift/saleReport/saleTrend')
const saleReportDetail = () => import('@/views/gift/saleReport/saleDetail')
// 礼品对账单;
const giftStatement = () => import('@/views/gift/giftStatement/index')
// 礼品账户对账单;
const accountStatement = () => import('@/views/gift/accountStatement/index')
// 珠宝商充值报表-充值统计
const characterJeweller = () => import('@/views/gift/characterJeweller/index')
const topUpStatistics = () => import('@/views/gift/characterJeweller/topUpStatistics')
// 珠宝商充值报表-充值对账单
const rechargeStatement = () => import('@/views/gift/characterJeweller/rechargeStatement')
// 礼品账户账户流水;
const charaAccountStatement = () => import('@/views/gift/charaAccountStatement/index')
// giftManage;
const giftManage = () => import('@/views/gift/giftManage/index')
const onShelvesBatch = () => import('@/views/gift/giftManage/onShelvesBatch')
const chooseFromCloud = () => import('@/views/gift/giftManage/chooseFromCloud')
const giftEdit = () => import('@/views/gift/giftManage/giftEdit')
const selfGiftManage = () => import('@/views/gift/giftManage/selfGiftManage')
const addNewGift = () => import('@/views/gift/giftManage/addNewGift')
const selfGiftEdit = () => import('@/views/gift/giftManage/selfGiftEdit')
const costEffective = () => import('@/views/gift/giftManage/costEffective')
const supplierGiftManage = () => import('@/views/gift/supplierGiftManage/index')
const supplierAddNewGift = () => import('@/views/gift/supplierGiftManage/addNewGift')
const supplierEditGift = () => import('@/views/gift/supplierGiftManage/editGift')
// 礼品订单
const giftOrder = () => import('@/views/gift/giftOrder/index')
const orderCheck = () => import('@/views/gift/giftOrder/orderCheck')
const batchShip = () => import('@/views/gift/giftOrder/batchShip')
// 礼品订单门店
const storeOrder = () => import('@/views/gift/storeOrder/index')
const storeOrderCheck = () => import('@/views/gift/storeOrder/storeOrderCheck')
const storeBatchShip = () => import('@/views/gift/storeOrder/storeBatchShip')
// 礼品品牌;
const brand = () => import('@/views/gift/brand/index')
// 礼品结算单;
const giftSettlement = () => import('@/views/gift/giftSettlement/index')
const settlementCheck = () => import('@/views/gift/giftSettlement/settlementCheck')
// 礼品供应商;
const supplier = () => import('@/views/gift/supplier/index')
const supplierEdit = () => import('@/views/gift/supplier/supplierEdit')
const supplierCheck = () => import('@/views/gift/supplier/supplierCheck')
// 礼品销售报表;
const supplierSaleReport = () => import('@/views/gift/supplierSaleReport/index')
const supplierSaleReportTrend = () => import('@/views/gift/supplierSaleReport/saleTrend')
const supplierSaleReportDetail = () => import('@/views/gift/supplierSaleReport/saleDetail')
// 代理礼品上架规则;
const proxyRule = () => import('@/views/gift/proxyRule/index')
// 礼品类目;
const giftCategory = () => import('@/views/gift/giftCategory/index')
// 礼品动态
const giftDynamics = () => import('@/views/gift/giftDynamics/index')
// 商城广告位管理
const adManagement = () => import('@/views/gift/adManagement/index')
// 商城礼品推荐
const giftRecommend = () => import('@/views/gift/giftRecommend/index')
const mainRecommend = () => import('@/views/gift/giftRecommend/mainRecommend')
const cartRecommend = () => import('@/views/gift/giftRecommend/cartRecommend')
// 商城装修
const storeDecoration = () => import('@/views/gift/storeDecoration/index')
// 礼品市场价设置
const priceRule = () => import('@/views/gift/priceRule/index')
// 商家选货推荐
const pickRecommend = () => import('@/views/gift/pickRecommend/index')
// 礼品账户管理
const giftAccoutManagement = () => import('@/views/gift/giftAccoutManagement/index')
// 珠宝商对账报表
const jewelerReconciliationReport = () => import('@/views/gift/jewelerReconciliationReport/index')

const basePath = '/gift'

export default [
  {
    name: '礼品管理',
    path: `${basePath}/giftManage/index`,
    component: giftManage
  },
  {
    name: '批量上架',
    path: `${basePath}/giftManage/onShelvesBatch`,
    component: onShelvesBatch
  },
  {
    name: '编辑礼品',
    path: `${basePath}/giftManage/giftEdit`,
    component: giftEdit,
    meta: {
      parentPath: `${basePath}/giftManage/index`
    }
  },
  {
    name: '从礼品库选择礼品',
    path: `${basePath}/giftManage/chooseFromCloud`,
    component: chooseFromCloud,
    meta: {
      parentPath: `${basePath}/giftManage/index`
    }
  },
  {
    name: '自营礼品管理',
    path: `${basePath}/giftManage/selfGiftManage`,
    component: selfGiftManage,
    meta: {
      parentPath: `${basePath}/giftManage/index`
    }
  },
  {
    name: '新建礼品',
    path: `${basePath}/giftManage/addNewGift`,
    component: addNewGift,
    meta: {
      parentPath: `${basePath}/giftManage/index`
    }
  },
  {
    name: '编辑自营礼品',
    path: `${basePath}/giftManage/selfGiftEdit`,
    component: selfGiftEdit,
    meta: {
      parentPath: `${basePath}/giftManage/index`
    }
  },
  {
    name: '推荐礼品',
    path: `${basePath}/giftManage/costEffective`,
    component: costEffective,
    meta: {
      parentPath: `${basePath}/giftManage/index`
    }
  },
  {
    name: '礼品管理 ',
    path: `${basePath}/supplierGiftManage/index`,
    component: supplierGiftManage
  },
  {
    name: '新建礼品 ',
    path: `${basePath}/supplierGiftManage/addNewGift`,
    component: supplierAddNewGift,
    meta: {
      parentPath: `${basePath}/supplierGiftManage/index`
    }
  },
  {
    name: '编辑礼品 ',
    path: `${basePath}/supplierGiftManage/editGift`,
    component: supplierEditGift,
    meta: {
      parentPath: `${basePath}/supplierGiftManage/index`
    }
  },
  {
    name: '礼品账户对账单',
    path: `${basePath}/accountStatement/index`,
    component: accountStatement
  },
  {
    path: `${basePath}/characterJeweller`,
    component: characterJeweller,
    children: [
      {
        path: 'topUpStatistics',
        name: '珠宝商充值报表',
        component: topUpStatistics,
        meta: {
          parentPath: `${basePath}/characterJeweller/topUpStatistics`
        }
      },
      {
        path: 'rechargeStatement',
        name: '珠宝商充值报表',
        component: rechargeStatement,
        meta: {
          parentPath: `${basePath}/characterJeweller/topUpStatistics`
        }
      }
    ]
  },
  {
    name: '珠宝商账户流水',
    path: `${basePath}/charaAccountStatement/index`,
    component: charaAccountStatement
  },
  {
    name: '礼品对账单',
    path: `${basePath}/giftStatement/index`,
    component: giftStatement
  },
  {
    path: `${basePath}/saleReport/index`,
    component: saleReport,
    children: [
      {
        path: '',
        redirect: 'saleTrend'
      },
      {
        path: 'saleTrend',
        component: saleReportTrend,
        meta: {
          parentPath: `${basePath}/saleReport/index`,
          name: '礼品兑换报表'
        }
      },
      {
        path: 'saleDetail',
        component: saleReportDetail,
        meta: {
          parentPath: `${basePath}/saleReport/index`,
          name: '礼品兑换报表'
        }
      }
    ]
  },
  {
    name: '礼品品牌',
    path: `${basePath}/brand/index`,
    component: brand
  },
  {
    name: '礼品结算单',
    path: `${basePath}/giftSettlement/index`,
    component: giftSettlement
  },
  {
    name: '查看礼品结算单',
    path: `${basePath}/giftSettlement/settlementCheck`,
    component: settlementCheck,
    meta: {
      parentPath: `${basePath}/giftSettlement/index`
    }
  },
  {
    path: `${basePath}/supplierSaleReport/index`,
    component: supplierSaleReport,
    children: [
      {
        path: '',
        redirect: 'saleTrend'
      },
      {
        path: 'saleTrend',
        component: supplierSaleReportTrend,
        meta: {
          parentPath: `${basePath}/supplierSaleReport/index`,
          name: '销售报表'
        }
      },
      {
        path: 'saleDetail',
        component: supplierSaleReportDetail,
        meta: {
          parentPath: `${basePath}/supplierSaleReport/index`,
          name: '销售报表'
        }
      }
    ]
  },
  {
    name: '代理礼品上架规则',
    path: `${basePath}/proxyRule/index`,
    component: proxyRule
  },
  {
    name: '代理类目',
    path: `${basePath}/giftCategory/index`,
    component: giftCategory
  },
  {
    name: '礼品供应商',
    path: `${basePath}/supplier/index`,
    component: supplier
  },
  {
    name: '新建供应商',
    path: `${basePath}/supplier/supplierEdit`,
    component: supplierEdit,
    meta: {
      parentPath: `${basePath}/supplier/index`
    },
    beforeEnter(to, from, next) {
      if (to.query.id) {
        to.meta.name = '修改供应商'
      } else {
        to.meta.name = '新建供应商'
      }
      next()
    }
  },
  {
    name: '查看供应商',
    path: `${basePath}/supplier/supplierCheck`,
    component: supplierCheck,
    meta: {
      parentPath: `${basePath}/supplier/index`
    }
  },
  {
    name: '礼品订单',
    path: `${basePath}/giftOrder/index`,
    component: giftOrder
  },
  {
    name: '查看订单详情',
    path: `${basePath}/giftOrder/orderCheck`,
    component: orderCheck,
    meta: {
      parentPath: `${basePath}/giftOrder/index`
    }
  },
  {
    name: '商城广告位管理',
    path: `${basePath}/adManagement/index`,
    component: adManagement,
    meta: {
      parentPath: `${basePath}/adManagement/index`
    }
  },
  {
    name: '批量发货',
    path: `${basePath}/giftOrder/batchShip`,
    component: batchShip,
    meta: {
      parentPath: `${basePath}/giftOrder/index`
    }
  },
  {
    name: '礼品订单门店',
    path: `${basePath}/storeOrder/index`,
    component: storeOrder
  },
  {
    name: '门店订单详情',
    path: `${basePath}/storeOrder/storeOrderCheck`,
    component: storeOrderCheck,
    meta: {
      parentPath: `${basePath}/storeOrder/index`
    }
  },
  {
    name: '门店批量发货',
    path: `${basePath}/storeOrder/storeBatchShip`,
    component: storeBatchShip,
    meta: {
      parentPath: `${basePath}/storeOrder/index`
    }
  },
  {
    name: '礼品动态',
    path: `${basePath}/giftDynamics/index`,
    component: giftDynamics
  },
  {
    path: `${basePath}/giftRecommend`,
    component: giftRecommend,
    children: [
      {
        path: '',
        redirect: 'mainRecommend'
      },
      {
        path: 'index',
        redirect: 'mainRecommend'
      },
      {
        path: 'mainRecommend',
        component: mainRecommend,
        meta: {
          parentPath: `${basePath}/giftRecommend/mainRecommend`,
          name: '商城礼品推荐'
        }
      },
      {
        path: 'cartRecommend',
        component: cartRecommend,
        meta: {
          parentPath: `${basePath}/giftRecommend/mainRecommend`,
          name: '商城礼品推荐'
        }
      }
    ]
  },
  {
    name: '商城装修',
    path: `${basePath}/storeDecoration/index`,
    component: storeDecoration
  },
  {
    name: '礼品市场价设置',
    path: `${basePath}/priceRule/index`,
    component: priceRule
  },
  {
    name: '商家选货推荐',
    path: `${basePath}/pickRecommend/index`,
    component: pickRecommend
  },
  {
    name: '礼品账户管理',
    path: `${basePath}/giftAccoutManagement/index`,
    component: giftAccoutManagement
  },
  {
    name: '珠宝商对账报表',
    path: `${basePath}/jewelerReconciliationReport/index`,
    component: jewelerReconciliationReport
  }
]
