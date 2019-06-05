import fetch from '@/utilities/fetch'

// 库 - 检索;
// parameters: NULL
// response.data.Data: {"Dbid": "int", "Nick": "String"}
export const CLUSTER_API_CACHEDB_GETS = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Cache/CacheDb/Gets/',
    method: 'get',
    params: parameters
  })
}
// 单键 - 检索;
// parameters: {"Nick": "String", "Key": "String"}
// response.data.Data: {"Key": "String"}
export const CLUSTER_API_CACHEKEY_GETS = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Cache/CacheKey/Gets/',
    method: 'get',
    params: parameters
  })
}
// 单键 - 加载;
// parameters: {"Nick": "String", "Key": "String"}
// response.data.Data: {"Val": "String"}
export const CLUSTER_API_CACHEKEY_GET = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Cache/CacheKey/Get/',
    method: 'get',
    params: parameters
  })
}
// 单键 - 创建/更新;
// parameters: {"Nick": "String", "Key": "String", "Val": "String"}
// response.data.Data: NULL
export const CLUSTER_API_CACHEKEY_SET = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Cache/CacheKey/Set/',
    method: 'post',
    data: parameters
  })
}
// 单键 - 清空;
// parameters: {"Nick": "String", "Key": "String", "Val": "String"}
// response.data.Data: NULL
export const CLUSTER_API_CACHEKEY_CLEAR = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Cache/CacheKey/Clear/',
    method: 'post',
    data: parameters
  })
}
// 单键 - 删除;
// parameters: {"Nick": "String", "Key": "String", "Val": "String"}
// response.data.Data: NULL
export const CLUSTER_API_CACHEKEY_REMOVE = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Cache/CacheKey/Remove/',
    method: 'post',
    data: parameters
  })
}
// 序列 - 检索;
// parameters: {"Nick": "String", "Key": "String"}
// response.data.Data: {"Key": "String"}
export const CLUSTER_API_CACHESEQS_GETS = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Cache/CacheSeqs/Gets/',
    method: 'get',
    params: parameters
  })
}
// 序列 - 加载;
// parameters: {"Nick": "String", "Key": "String"}
// response.data.Data: {"Val": "long"}
export const CLUSTER_API_CACHESEQS_GET = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Cache/CacheSeqs/Get/',
    method: 'get',
    params: parameters
  })
}
// 序列 - 创建;
// parameters: {"Nick": "String", "Key": "String", "Val": "String"}
// response.data.Data: NULL
export const CLUSTER_API_CACHESEQS_CREATE = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Cache/CacheSeqs/Create/',
    method: 'post',
    data: parameters
  })
}
// 序列 - 更新;
// parameters: {"Nick": "String", "Key": "String", "Val": "String"}
// response.data.Data: NULL
export const CLUSTER_API_CACHESEQS_UPDATE = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Cache/CacheSeqs/Update/',
    method: 'post',
    data: parameters
  })
}
// 序列 - 清空;
// parameters: {"Nick": "String", "Key": "String", "Val": "String"}
// response.data.Data: NULL
export const CLUSTER_API_CACHESEQS_CLEAR = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Cache/CacheSeqs/Clear/',
    method: 'post',
    data: parameters
  })
}
// 序列 - 删除;
// parameters: {"Nick": "String", "Key": "String", "Val": "String"}
// response.data.Data: NULL
export const CLUSTER_API_CACHESEQS_REMOVE = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Cache/CacheSeqs/Remove/',
    method: 'post',
    data: parameters
  })
}
// 会话 - 检索;
// parameters: {"Nick": "String", "Key": "String"}
// response.data.Data: {"Key": "String"}
export const CLUSTER_API_CACHESESSION_GETS = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Cache/CacheSession/Gets/',
    method: 'get',
    params: parameters
  })
}
// 会话 - 清空;
// parameters: {"Nick": "String", "Key": "String", "Val": "String"}
// response.data.Data: NULL
export const CLUSTER_API_CACHESESSION_CLEAR = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Cache/CacheSession/Clear/',
    method: 'post',
    data: parameters
  })
}
// 会话 - 删除;
// parameters: {"Nick": "String", "Key": "String", "Val": "String"}
// response.data.Data: NULL
export const CLUSTER_API_CACHESESSION_REMOVE = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Cache/CacheSession/Remove/',
    method: 'post',
    data: parameters
  })
}
// 表行 - 检索;
// parameters: {"Nick": "String", "Key": "String"}
// response.data.Data: {"Key": "String"}
export const CLUSTER_API_CACHETABLE_GETS = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Cache/CacheTable/Gets/',
    method: 'get',
    params: parameters
  })
}
// 表行 - 清空;
// parameters: {"Nick": "String", "Key": "String", "Val": "String"}
// response.data.Data: NULL
export const CLUSTER_API_CACHETABLE_CLEAR = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Cache/CacheTable/Clear/',
    method: 'post',
    data: parameters
  })
}
// 表行 - 重装;
// parameters: {"Nick": "String", "Key": "String", "Val": "String"}
// response.data.Data: NULL
export const CLUSTER_API_CACHETABLE_RELOAD = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Cache/CacheTable/Reload/',
    method: 'post',
    data: parameters
  })
}
// 视图 - 检索;
// parameters: {"Nick": "String", "Key": "String"}
// response.data.Data: {"Key": "String"}
export const CLUSTER_API_CACHEVIEW_GETS = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Cache/CacheView/Gets/',
    method: 'get',
    params: parameters
  })
}
// 视图 - 清空;
// parameters: {"Nick": "String", "Key": "String", "Val": "String"}
// response.data.Data: NULL
export const CLUSTER_API_CACHEVIEW_CLEAR = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Cache/CacheView/Clear/',
    method: 'post',
    data: parameters
  })
}
// 视图 - 删除;
// parameters: {"Nick": "String", "Key": "String", "Val": "String"}
// response.data.Data: NULL
export const CLUSTER_API_CACHEVIEW_REMOVE = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Cache/CacheView/Remove/',
    method: 'post',
    data: parameters
  })
}
// 调度任务 - 检索;
// parameters: {"JobType": "int", "JobName": "String", "State": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"JobId": "long", "JobType": "int", "JobName": "String", "Express": "String", "ApisUri": "String", "Queue": "String", "CreateUser": "String", "CreateTime": "String", "LastBtime": "String", "LastEtime": "String", "RunningState": "int", "State": "int"}
export const CLUSTER_API_QUARTZJOB_GETS = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Quartz/QuartzJob/Gets/',
    method: 'get',
    params: parameters
  })
}
// 调度任务 - 加载;
// parameters: {id: 'long'}
// response.data.Data: {"JobId": "long", "JobType": "int", "JobName": "String", "Descr": "String", "Express": "String", "ApisUri": "String", "Queue": "String"}
export const CLUSTER_API_QUARTZJOB_GET = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Quartz/QuartzJob/Get/',
    method: 'get',
    params: parameters
  })
}
// 调度任务 - 创建;
// parameters: {"JobType": "int", "JobName": "String", "Descr": "String", "Express": "String", "ApisUri": "String", "Queue": "String"}
// response.data.Data: NULL
export const CLUSTER_API_QUARTZJOB_CREATE = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Quartz/QuartzJob/Create/',
    method: 'post',
    data: parameters
  })
}
// 调度任务 - 更新;
// parameters: {"JobId": "long", "JobType": "int", "JobName": "String", "Descr": "String", "Express": "String", "ApisUri": "String", "Queue": "String"}
// response.data.Data: NULL
export const CLUSTER_API_QUARTZJOB_UPDATE = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Quartz/QuartzJob/Update/',
    method: 'post',
    data: parameters
  })
}
// 调度任务 - 暂停;
// parameters: {id: 'long'}
// response.data.Data: NULL
export const CLUSTER_API_QUARTZJOB_PAUSE = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Quartz/QuartzJob/Pause/',
    method: 'post',
    data: parameters
  })
}
// 调度任务 - 重新启动;
// parameters: {id: 'long'}
// response.data.Data: NULL
export const CLUSTER_API_QUARTZJOB_RESUME = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Quartz/QuartzJob/Resume/',
    method: 'post',
    data: parameters
  })
}
// 调度任务 - 删除;
// parameters: {id: 'long'}
// response.data.Data: NULL
export const CLUSTER_API_QUARTZJOB_REMOVE = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Quartz/QuartzJob/Remove/',
    method: 'post',
    data: parameters
  })
}
// 调度器服务 - 启动;
// parameters: NULL
// response.data.Data: NULL
export const CLUSTER_API_QUARTZSCHEDULER_START = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Quartz/QuartzScheduler/Start/',
    method: 'post',
    data: parameters
  })
}
// 调度器服务 - 停止;
// parameters: NULL
// response.data.Data: NULL
export const CLUSTER_API_QUARTZSCHEDULER_STOP = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Quartz/QuartzScheduler/Stop/',
    method: 'post',
    data: parameters
  })
}
// 调度器服务 - 状态;
// parameters: NULL
// response.data.Data: {"EnableState": "int"}
export const CLUSTER_API_QUARTZSCHEDULER_STATE = (parameters) => {
  return fetch({
    cloud: 'Cluster',
    url: '/Quartz/QuartzScheduler/State/',
    method: 'post',
    data: parameters
  })
}