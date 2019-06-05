// 秒杀
const activitySeckill = () => import('@/views/spread/seckill/index')
const seckillEdit = () => import('@/views/spread/seckill/seckillEdit')
const seckillCheck = () => import('@/views/spread/seckill/seckillCheck')

// 拼团
const activitySpellGroup = () => import('@/views/spread/spellGroup/index')
const spellGroupEdit = () => import('@/views/spread/spellGroup/spellGroupEdit')
const spellGroupCheck = () =>
  import('@/views/spread/spellGroup/spellGroupCheck')

// 砍价
const activityBargain = () => import('@/views/spread/bargain/index')
const bargainEdit = () => import('@/views/spread/bargain/bargainEdit')
const bargainCheck = () => import('@/views/spread/bargain/bargainCheck')
// 活动商品
const goods = () => import('@/views/spread/goods/index')
const goodsCreate = () => import('@/views/spread/goods/goodsCreate')
const goodsCheck = () => import('@/views/spread/goods/goodsCheck')
const goodsEdit = () => import('@/views/spread/goods/goodsEdit')
// 订单管理
const order = () => import('@/views/spread/order/index')
const orderSeckill = () => import('@/views/spread/order/seckill/index')

const orderSpellGroup = () => import('@/views/spread/order/spellGroup/index')
const allOrder = () => import('@/views/spread/order/spellGroup/allOrder')
const groupData = () => import('@/views/spread/order/spellGroup/groupData')

const orderBargain = () => import('@/views/spread/order/bargain/index')

const seckill = () => import('@/views/spread/order/seckill/seckill')
const spellGroup = () => import('@/views/spread/order/spellGroup/spellGroup')

const groupCheck = () => import('@/views/spread/order/spellGroup/groupCheck')
const bargain = () => import('@/views/spread/order/bargain/bargain')
// 售后管理
const afterSales = () => import('@/views/spread/afterSales/index')
// 提货地址
const adress = () => import('@/views/spread/adress/index')

const basePath = '/spread'

export default [
  {
    path: `${basePath}/activitySeckill/index`,
    component: activitySeckill,
    name: '秒杀活动'
  },
  {
    path: `${basePath}/activitySeckill/seckillEdit`,
    component: seckillEdit,
    name: '修改秒杀活动',
    meta: {
      parentPath: `${basePath}/activitySeckill/index`
    },
    beforeEnter: (to, from, next) => {
      if (!to.query.id) {
        to.meta.name = '新建秒杀活动'
      } else {
        to.meta.name = '修改秒杀活动'
      }
      next()
    }
  },
  {
    path: `${basePath}/activitySeckill/seckillCheck`,
    component: seckillCheck,
    name: '查看秒杀活动',
    meta: {
      parentPath: `${basePath}/activitySeckill/index`
    }
  },
  {
    path: `${basePath}/activitySpellGroup/index`,
    component: activitySpellGroup,
    name: '拼团活动'
  },
  {
    path: `${basePath}/activitySpellGroup/spellGroupEdit`,
    component: spellGroupEdit,
    name: '修改拼团活动',
    meta: {
      parentPath: `${basePath}/activitySpellGroup/index`
    },
    beforeEnter: (to, from, next) => {
      if (!to.query.id) {
        to.meta.name = '新建拼团活动'
      } else {
        to.meta.name = '修改拼团活动'
      }
      next()
    }
  },
  {
    path: `${basePath}/activitySpellGroup/spellGroupCheck`,
    component: spellGroupCheck,
    name: '查看拼团活动',
    meta: {
      parentPath: `${basePath}/activitySpellGroup/index`
    }
  },
  {
    path: `${basePath}/activityBargain/index`,
    component: activityBargain,
    name: '砍价活动列'
  },
  {
    path: `${basePath}/activityBargain/bargainEdit`,
    component: bargainEdit,
    name: '修改砍价活动',
    meta: {
      parentPath: `${basePath}/activityBargain/index`
    },
    beforeEnter: (to, from, next) => {
      if (!to.query.id) {
        to.meta.name = '新建砍价活动'
      } else {
        to.meta.name = '修改砍价活动'
      }
      next()
    }
  },
  {
    path: `${basePath}/activityBargain/bargainCheck`,
    component: bargainCheck,
    name: '查看砍价活动',
    meta: {
      parentPath: `${basePath}/activityBargain/index`
    }
  },
  {
    path: `${basePath}/goods/index`,
    component: goods,
    name: '活动商品'
  },
  {
    path: `${basePath}/goods/goodsCreate`,
    component: goodsCreate,
    name: '活动商品新建',
    meta: {
      parentPath: `${basePath}/goods/index`
    }
  },
  {
    path: `${basePath}/goods/goodsCheck`,
    component: goodsCheck,
    name: '活动商品查看',
    meta: {
      parentPath: `${basePath}/goods/index`
    }
  },
  {
    path: `${basePath}/goods/goodsEdit`,
    component: goodsEdit,
    name: '活动商品修改',
    meta: {
      parentPath: `${basePath}/goods/index`
    }
  },
  {
    path: `${basePath}/order`,
    component: order,
    children: [
      {
        path: 'orderSeckill/index',
        component: orderSeckill,
        name: '秒杀订单',
        meta: {
          parentPath: `${basePath}/order/orderSeckill/index`
        }
      },
      {
        path: 'orderSpellGroup/index',
        component: orderSpellGroup,
        name: '拼团订单',
        meta: {
          parentPath: `${basePath}/order/orderSeckill/index`
        }
      },
      {
        path: 'orderBargain/index',
        component: orderBargain,
        name: '砍价订单',
        meta: {
          parentPath: `${basePath}/order/orderSeckill/index`
        }
      }
    ]
  },
  {
    path: `${basePath}/order/seckill`,
    component: seckill,
    name: '秒杀订单处理',
    meta: {
      parentPath: `${basePath}/order/orderSeckill/index`
    }
  },
  {
    path: `${basePath}/order/spellGroup`,
    component: spellGroup,
    children: [
      {
        path: 'allOrder',
        component: allOrder,
        name: '全部订单',
        meta: {
          parentPath: `${basePath}/order/orderSeckill/index`
        }
      },
      {
        path: 'groupData',
        component: groupData,
        name: '开团数据',
        meta: {
          parentPath: `${basePath}/order/orderSeckill/index`
        }
      }
    ]
  },
  {
    path: `${basePath}/order/groupCheck`,
    component: groupCheck,
    name: '开团订单处理',
    meta: {
      parentPath: `${basePath}/order/orderSeckill/index`
    }
  },
  {
    path: `${basePath}/order/bargain`,
    component: bargain,
    name: '砍价订单处理',
    meta: {
      parentPath: `${basePath}/order/orderSeckill/index`
    }
  },
  {
    path: `${basePath}/afterSales/index`,
    component: afterSales,
    name: '售后管理'
  },
  {
    path: `${basePath}/adress/index`,
    component: adress,
    name: '提货地址'
  }
]
