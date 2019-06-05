// 应付款
const payment = () => import('@/views/fmis/payment/index')
const paymentCheck = () => import('@/views/fmis/payment/paymentCheck')
const paymentCreate = () => import('@/views/fmis/payment/paymentCreate')
// 付款单
const paymentorder = () => import('@/views/fmis/paymentorder/index')
const paymentorderCheck = () => import('@/views/fmis/paymentorder/paymentorderCheck')
// 应收款
const receipt = () => import('@/views/fmis/receipt/index')
const receiptCheck = () => import('@/views/fmis/receipt/receiptCheck')
const receiptCreate = () => import('@/views/fmis/receipt/receiptCreate')
// 收款单
const receiptorder = () => import('@/views/fmis/receiptorder/index')
const receiptorderCheck = () => import('@/views/fmis/receiptorder/receiptorderCheck')
// 财务预算
const fmisBudget = () => import('@/views/fmis/fmisBudget/index')
// 财务结算
const fmisMonthEnd = () => import('@/views/fmis/fmisMonthEnd/index')
const fmisMonthEndCheck = () => import('@/views/fmis/fmisMonthEnd/fmisMonthEndCheck')

const basePath = '/fmis'

export default [
  {
    path: basePath + '/payment/index',
    component: payment,
    name: '应付款 ',
    meta: {
      parentPath: basePath + '/payment/index'
    }
  },
  {
    path: basePath + '/payment/paymentCreate',
    component: paymentCreate,
    name: '创建应付款单 ',
    meta: {
      parentPath: basePath + '/payment/index'
    }
  },
  {
    path: basePath + '/payment/paymentCheck',
    component: paymentCheck,
    name: '查看应付款单 ',
    meta: {
      parentPath: basePath + '/payment/index'
    }
  },
  {
    // 付款单
    path: basePath + '/paymentorder/index',
    component: paymentorder,
    name: '付款单 ',
    meta: {
      parentPath: basePath + '/paymentorder/index'
    }
  },
  {
    path: basePath + '/paymentorder/paymentorderCheck',
    component: paymentorderCheck,
    name: '查看付款单 ',
    meta: {
      parentPath: basePath + '/paymentorder/index'
    }
  },
  {
    path: basePath + '/receipt/index',
    component: receipt,
    name: '应收款 ',
    meta: {
      parentPath: basePath + '/receipt/index'
    }
  },
  {
    path: basePath + '/receipt/receiptCreate',
    component: receiptCreate,
    name: '创建应收款 ',
    meta: {
      parentPath: basePath + '/receipt/index'
    }
  },
  {
    path: basePath + '/receipt/receiptCheck',
    component: receiptCheck,
    name: '查看应收款 ',
    meta: {
      parentPath: basePath + '/receipt/index'
    }
  },
  {
    path: basePath + '/receiptorder/index',
    component: receiptorder,
    name: '收款单 ',
    meta: {
      parentPath: basePath + '/receiptorder/index'
    }
  },
  {
    path: basePath + '/receiptorder/receiptorderCheck',
    component: receiptorderCheck,
    name: '查看收款单 ',
    meta: {
      parentPath: basePath + '/receiptorder/index'
    }
  },
  {
    path: basePath + '/fmisBudget/index',
    component: fmisBudget,
    name: '财务预算 ',
    meta: {
      parentPath: basePath + '/fmisBudget/index'
    }
  },
  {
    path: basePath + '/fmisMonthEnd/index',
    component: fmisMonthEnd,
    name: '财务月结'
  },
  {
    path: basePath + '/fmisMonthEnd/check',
    component: fmisMonthEndCheck,
    name: '查看财务月结'
  }
]