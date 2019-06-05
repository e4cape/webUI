// 消费单管理
const expendlist = () => import('@/views/order/expend/index.vue')
const expenddetail = () => import('@/views/order/expend/detail.vue')
const expendcreatebymanual = () => import('@/views/order/expend/createbymanual.vue')

// 退货单管理
const orderList = () => import('@/views/order/return/orderList')
const orderdetail = () => import('@/views/order/return/orderDetail.vue')

const basePath = '/order'

export default [
  {
    path: `${basePath}/expend/index`,
    component: expendlist,
    name: '消费单管理'
  },
  {
    path: `${basePath}/expend/detail/:id`,
    component: expenddetail,
    name: '消费单详情',
    meta: {
      parentPath: `${basePath}/expend/index`
    }
  },
  {
    path: `${basePath}/expend/createbymanual`,
    component: expendcreatebymanual,
    name: '补录消费单',
    meta: {
      parentPath: `${basePath}/expend/index`
    }
  },
  {

    path: `${basePath}/return/index`,
    component: orderList,
    name: '退货单管理'
  },
  {
    path: `${basePath}/return/orderdetail`,
    component: orderdetail,
    name: '退货单详情',
    meta: {
      parentPath: `${basePath}/return/index`
    }

  }
]
