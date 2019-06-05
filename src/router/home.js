// 商户
const company = () => import('@/views/home/company')
// 集团
const group = () => import('@/views/home/group')
// 平台
const platform = () => import('@/views/home/platform')
// 供应商
const supplier = () => import('@/views/home/supplier')

const basePath = '/home'

export default [
  {
    path: `${basePath}/company`,
    component: company,
    meta: {
      name: '首页'
    }
  },
  {
    path: `${basePath}/group`,
    component: group,
    meta: {
      name: '首页'
    }
  },
  {
    path: `${basePath}/platform`,
    component: platform,
    meta: {
      name: '首页'
    }
  },
  {
    path: `${basePath}/supplier`,
    component: supplier,
    meta: {
      name: '首页'
    }
  }
]
