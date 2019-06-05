import fetch from '@/utilities/fetch'

// 上传文件(OSS);
// parameters: {"File": "MultipartFile", "Root": "String", "Name": "String"}
// response.data.Data: {"Host": "String", "Path": "String"}
export const COMMON_API_FILE_UPLOADTOOSS = (parameters) => {
  return fetch({
    cloud: 'Common',
    url: '/Upload/File/UploadToOss/',
    method: 'post',
    data: parameters
  })
}
// 上传文件(Mount);
// parameters: {"File": "MultipartFile", "Root": "String", "Name": "String"}
// response.data.Data: {"Host": "String", "Path": "String"}
export const COMMON_API_FILE_UPLOADTOMOUNT = (parameters) => {
  return fetch({
    cloud: 'Common',
    url: '/Upload/File/UploadToMount/',
    method: 'post',
    data: parameters
  })
}
// 上传图片(OSS, BASE64);
// parameters: {"Base64Str": "String", "Root": "String"}
// response.data.Data: {"Host": "String", "Path": "String"}
export const COMMON_API_IMAGE_UPLOAD64TOOSS = (parameters) => {
  return fetch({
    cloud: 'Common',
    url: '/Upload/Image/Upload64ToOss/',
    method: 'post',
    data: parameters
  })
}
// 上传图片(OSS, 支持多个, 最多10个);
// parameters: {"Files": "MultipartFile[]", "Root": "String", "Name": "String"}
// response.data.Data: {"Host": "String", "Paths": "List<String>"}
export const COMMON_API_IMAGE_UPLOADTOOSS = (parameters) => {
  return fetch({
    cloud: 'Common',
    url: '/Upload/Image/UploadToOss/',
    method: 'post',
    data: parameters
  })
}
// 上传图片(Mount, 支持多个, 最多10个);
// parameters: {"Files": "MultipartFile[]", "Root": "String", "Name": "String"}
// response.data.Data: {"Host": "String", "Paths": "List<String>"}
export const COMMON_API_IMAGE_UPLOADTOMOUNT = (parameters) => {
  return fetch({
    cloud: 'Common',
    url: '/Upload/Image/UploadToMount/',
    method: 'post',
    data: parameters
  })
}
// 上传视频(Mount);
// parameters: {"File": "MultipartFile", "Root": "String", "Name": "String"}
// response.data.Data: {"Host": "String", "Path": "String"}
export const COMMON_API_VIDEO_UPLOADTOMOUNT = (parameters) => {
  return fetch({
    cloud: 'Common',
    url: '/Upload/Video/UploadToMount/',
    method: 'post',
    data: parameters
  })
}
// 获取(播放凭证);
// parameters: {"VideoId": "String"}
// response.data.Data: {"VedioId": "String", "PlayAuth": "String"}
export const COMMON_API_VOD_PLAY = (parameters) => {
  return fetch({
    cloud: 'Common',
    url: '/Upload/Vod/Play/',
    method: 'get',
    params: parameters
  })
}
// 获取(上传凭证);
// parameters: {"Title": "String", "FileName": "String"}
// response.data.Data: {"UserId": "String", "VideoId": "String", "UploadAuth": "String", "UploadAddress": "String"}
export const COMMON_API_VOD_AUTH = (parameters) => {
  return fetch({
    cloud: 'Common',
    url: '/Upload/Vod/Auth/',
    method: 'get',
    params: parameters
  })
}
// 刷新(上传凭证);
// parameters: {"VideoId": "String"}
// response.data.Data: {"UserId": "String", "VideoId": "String", "UploadAuth": "String", "UploadAddress": "String"}
export const COMMON_API_VOD_REFRESH = (parameters) => {
  return fetch({
    cloud: 'Common',
    url: '/Upload/Vod/Refresh/',
    method: 'get',
    params: parameters
  })
}
// 获取视频信息;
// parameters: {"VideoId": "String"}
// response.data.Data: {"VideoId": "String", "Title": "String", "CoverURL": "String", "Duration": "Float", "Size": "Long", "CreationTime": "String", "State": "int"}
export const COMMON_API_VOD_GET = (parameters) => {
  return fetch({
    cloud: 'Common',
    url: '/Upload/Vod/Get/',
    method: 'get',
    params: parameters
  })
}
// 获取视频(列表);
// parameters: {"Title": "String", "State": "int", "CreateTime1": "String", "CreateTime2": "String", "IsAsced": "int", "PageIndex": "int", "PageSize": "int", "ScrollToken": "String"}
// response.data.Data: {"ScrollToken": "String", "Count": "long", "Subset": "List<VodGetResponse>"}
export const COMMON_API_VOD_GETS = (parameters) => {
  return fetch({
    cloud: 'Common',
    url: '/Upload/Vod/Gets/',
    method: 'get',
    params: parameters
  })
}
// 获取视频(正常状态);
// parameters: {"Title": "String", "CreateTime1": "String", "CreateTime2": "String", "IsAsced": "int", "PageIndex": "int", "PageSize": "int", "ScrollToken": "String"}
// response.data.Data: {"ScrollToken": "String", "Count": "long", "Subset": "List<VodGetResponse>"}
export const COMMON_API_VOD_GETSBYNORMAL = (parameters) => {
  return fetch({
    cloud: 'Common',
    url: '/Upload/Vod/GetsByNormal/',
    method: 'get',
    params: parameters
  })
}
// 删除视频;
// parameters: {"VideoIds": "String"}
// response.data.Data: NULL
export const COMMON_API_VOD_DELETE = (parameters) => {
  return fetch({
    cloud: 'Common',
    url: '/Upload/Vod/Delete/',
    method: 'post',
    data: parameters
  })
}