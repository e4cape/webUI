const task = () => import('@/views/cluster/task/index') // 任务调度

const cache = () => import('@/views/cluster/cache/index') // 缓存
const cacheCheck = () => import('@/views/cluster/cache/check') // 缓存

const basePath = '/cluster'

export default [
  {
    path: `${basePath}/task/index`,
    component: task,
    name: '任务调度'
  },
  {
    path: `${basePath}/cache/index`,
    component: cache,
    name: '缓存'
  },
  {
    path: `${basePath}/cache/check`,
    component: cacheCheck,
    name: '缓存详情',
    meta: {
      parentPath: `${basePath}/cache/index`,
    }
  }
]