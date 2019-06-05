// 零售单管理
const retailManager = () => import('@/views/sales/retail/index')
const retailBigCheck = () => import('@/views/sales/retail/retailBigCheck')
const retailCreate = () => import('@/views/sales/retail/retailCreate')

// 成品零售调价
const adjustManager = () => import('@/views/sales/adjust/index')
const adjustEdit = () => import('@/views/sales/adjust/adjustEdit')
const adjustCheck = () => import('@/views/sales/adjust/adjustCheck')
// 零售调价记录
const adjustrecord = () => import('@/views/sales/adjustrecord/index')
// 查价
const reference = () => import('@/views/sales/reference/index')
// 钻石市场成本设置
const diamondMarket = () => import('@/views/sales/diamondMarket/index')
// 零售退货单
const material = () => import('@/views/sales/material/index')
const materialCheck = () => import('@/views/sales/material/materialCheck')
// 维修单
const repair = () => import('@/views/sales/repair/index') // 维修单
const repairCreate = () => import('@/views/sales/repair/repairCreate')
const repairCheck = () => import('@/views/sales/repair/repairCheck')

const basePath = '/sales'

export default [
  {
  // 零售单管理
    path: `${basePath}/retail/index`,
    component: retailManager,
    name: '零售单 '
  },
  {
    path: `${basePath}/retail/retailBigCheck`,
    component: retailBigCheck,
    name: '查看零售单 ',
    meta: {
      parentPath: `${basePath}/retail/index`
    }
  },
  {
    path: `${basePath}/retail/retailCreate`,
    component: retailCreate,
    name: '新建零售单 ',
    meta: {
      parentPath: `${basePath}/retail/index`
    }
  },
  {
    // 成品零售调价;
    path: `${basePath}/adjust/index`,
    component: adjustManager,
    name: '成品调价 '
  },
  {
    path: `${basePath}/adjust/adjustEdit`,
    component: adjustEdit,
    name: '编辑调价单 ',
    meta: {
      parentPath: `${basePath}/adjust/index`
    }
  },
  {
    path: `${basePath}/adjust/adjustCheck`,
    component: adjustCheck,
    name: '查看调价单',
    meta: {
      parentPath: `${basePath}/adjust/index`
    }
  },
  {
    // 调价记录;
    path: `${basePath}/adjustrecord/index`,
    component: adjustrecord,
    name: '调价记录'
  },
  // 查价;
  {
    path: `${basePath}/reference/index`,
    component: reference,
    name: '查价'
  },
  // 钻石成本设置;
  {
    path: `${basePath}/diamondMarket/index`,
    component: diamondMarket,
    name: '钻石市场成本设置'
  },
  {
    // 退货单
    path: `${basePath}/material/index`,
    component: material,
    name: '退货单'
  },
  {
    path: `${basePath}/material/materialCheck`,
    component: materialCheck,
    name: '查看退货单',
    meta: {
      parentPath: `${basePath}/material/index`
    }
  },
  {
    // 维修单
    path: `${basePath}/repair/index`,
    component: repair,
    name: '维修单'
  },
  {
    path: `${basePath}/repair/repairCreate`,
    component: repairCreate,
    name: '新建维修单',
    meta: {
      parentPath: `${basePath}/repair/index`
    }
  },
  {
    path: `${basePath}/repair/repairCheck`,
    component: repairCheck,
    name: '查看维修单',
    meta: {
      parentPath: `${basePath}/repair/index`
    }
  }
]
