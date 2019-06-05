import fetch from '@/utilities/fetch'

// 砍价活动-(检索);
export const SPREAD_API_BARGAIN_SEARCH = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Bargain/Search/',
  method: 'get',
  params: parameters
})
// 砍价活动订单 - (检索);
export const SPREAD_API_BARGAIN_ORDERLIST = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Bargain/OrderList/',
  method: 'get',
  params: parameters
})
// 砍价活动-(详情);
export const SPREAD_API_BARGAIN_DETAIL = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Bargain/Detail/',
  method: 'get',
  params: parameters
})
// 砍价活动-(创建);
export const SPREAD_API_BARGAIN_CREATE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Bargain/Create/',
  method: 'post',
  data: parameters
})
// 砍价活动-(更新);
export const SPREAD_API_BARGAIN_UPDATE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Bargain/Update/',
  method: 'post',
  data: parameters
})
// 砍价活动-(发布);
export const SPREAD_API_BARGAIN_PUBLISH = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Bargain/Publish/',
  method: 'post',
  data: parameters
})
// 砍价活动-(撤回);
export const SPREAD_API_BARGAIN_REVOKE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Bargain/Revoke/',
  method: 'post',
  data: parameters
})
// 砍价活动-(删除);
export const SPREAD_API_BARGAIN_DELETE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Bargain/Delete/',
  method: 'post',
  data: parameters
})
// 砍价活动明细-(检索);
export const SPREAD_API_BARGAIN_SEARCHITEMS = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Bargain/SearchItems/',
  method: 'get',
  params: parameters
})
// 砍价活动明细-(详情);
export const SPREAD_API_BARGAIN_ITEMDETAIL = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Bargain/ItemDetail/',
  method: 'get',
  params: parameters
})
// 砍价活动明细-(创建);
export const SPREAD_API_BARGAIN_ITEMCREATE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Bargain/ItemCreate/',
  method: 'post',
  data: parameters
})
// 砍价活动明细-(更新);
export const SPREAD_API_BARGAIN_ITEMUPDATE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Bargain/ItemUpdate/',
  method: 'post',
  data: parameters
})
// 砍价活动明细-(删除);
export const SPREAD_API_BARGAIN_ITEMDELETE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Bargain/ItemDelete/',
  method: 'post',
  data: parameters
})
// 砍价活动领取地址-(检索);
export const SPREAD_API_BARGAIN_SEARCHADDRS = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Bargain/SearchAddrs/',
  method: 'get',
  params: parameters
})
// 砍价活动领取地址-(创建);
export const SPREAD_API_BARGAIN_ADDRCREATE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Bargain/AddrCreate/',
  method: 'post',
  data: parameters
})
// 砍价活动领取地址-(删除);
export const SPREAD_API_BARGAIN_ADDRDELETE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Bargain/AddrDelete/',
  method: 'post',
  data: parameters
})
// 砍价活动领取地址-(设为售后);
export const SPREAD_API_BARGAIN_ADDRSETRMATYPE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Bargain/AddrSetRmaType/',
  method: 'post',
  data: parameters
})
// 砍价活动领取地址-(取消售后);
export const SPREAD_API_BARGAIN_ADDRCANCELRMATYPE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Bargain/AddrCancelRmaType/',
  method: 'post',
  data: parameters
})
// 拼团列表(检索);
export const SPREAD_API_COLLAGE_SEARCH = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Collage/Search/',
  method: 'get',
  params: parameters
})
// 拼团列表(详情);
export const SPREAD_API_COLLAGE_DETAIL = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Collage/Detail/',
  method: 'get',
  params: parameters
})
// 拼团活动订单 - (检索);
export const SPREAD_API_COLLAGE_ORDERLIST = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Collage/OrderList/',
  method: 'get',
  params: parameters
})
// 拼团活动 - 创建;
export const SPREAD_API_COLLAGE_CREATE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Collage/Create/',
  method: 'post',
  data: parameters
})
// 拼团活动 - 更新;
export const SPREAD_API_COLLAGE_UPDATE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Collage/Update/',
  method: 'post',
  data: parameters
})
// 拼团活动 - 发布;
export const SPREAD_API_COLLAGE_PUBLISH = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Collage/Publish/',
  method: 'post',
  data: parameters
})
// 拼团活动 - 撤回;
export const SPREAD_API_COLLAGE_REVOKE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Collage/Revoke/',
  method: 'post',
  data: parameters
})
// 拼团活动 - 删除;
export const SPREAD_API_COLLAGE_DELETE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Collage/Delete/',
  method: 'post',
  data: parameters
})
// 拼团明细(检索);
export const SPREAD_API_COLLAGE_SEARCHITEMS = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Collage/SearchItems/',
  method: 'get',
  params: parameters
})
// 拼团明细详情;
export const SPREAD_API_COLLAGE_ITEMDETAIL = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Collage/ItemDetail/',
  method: 'get',
  params: parameters
})
// 拼团明细详情-创建;
export const SPREAD_API_COLLAGE_ITEMCREATE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Collage/ItemCreate/',
  method: 'post',
  data: parameters
})
// 拼团明细 - 更新;
export const SPREAD_API_COLLAGE_ITEMUPDATE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Collage/ItemUpdate/',
  method: 'post',
  data: parameters
})
// 拼团明细 - 删除;
export const SPREAD_API_COLLAGE_ITEMDELETE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Collage/ItemDelete/',
  method: 'post',
  data: parameters
})
// 拼团活动地址 - (检索);
export const SPREAD_API_COLLAGE_SEARCHADDRS = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Collage/SearchAddrs/',
  method: 'get',
  params: parameters
})
// 拼团活动地址 - 创建;
export const SPREAD_API_COLLAGE_ADDRCREATE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Collage/AddrCreate/',
  method: 'post',
  data: parameters
})
// 拼团活动地址 - 删除;
export const SPREAD_API_COLLAGE_ADDRDELETE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Collage/AddrDelete/',
  method: 'post',
  data: parameters
})
// 拼团活动地址 - 设为售后;
export const SPREAD_API_COLLAGE_ADDRSETRMATYPE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Collage/AddrSetRmaType/',
  method: 'post',
  data: parameters
})
// 拼团活动地址 - 取消售后;
export const SPREAD_API_COLLAGE_ADDRCANCELRMATYPE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Collage/AddrCancelRmaType/',
  method: 'post',
  data: parameters
})
// 开团数据 - (检索);
export const SPREAD_API_COLLAGE_QRIES = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Collage/Qries/',
  method: 'get',
  params: parameters
})
// 开团数据导出 - 直接下载(小于等于1W行);
export const SPREAD_API_COLLAGE_EXPORT = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Collage/Export/',
  method: 'post',
  data: parameters
})
// 秒杀活动-(检索);
export const SPREAD_API_SECKILL_SEARCH = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Seckill/Search/',
  method: 'get',
  params: parameters
})
// 秒杀活动订单 - (检索);
export const SPREAD_API_SECKILL_ORDERLIST = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Seckill/OrderList/',
  method: 'get',
  params: parameters
})
// 秒杀活动-(详情);
export const SPREAD_API_SECKILL_DETAIL = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Seckill/Detail/',
  method: 'get',
  params: parameters
})
// 秒杀活动-(创建)-(新 三个页面合一);
export const SPREAD_API_SECKILL_CREATE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Seckill/Create/',
  method: 'post',
  data: parameters
})
// 秒杀活动-(更新)-(新 三个页面合一);
export const SPREAD_API_SECKILL_UPDATE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Seckill/Update/',
  method: 'post',
  data: parameters
})
// 秒杀活动-(发布);
export const SPREAD_API_SECKILL_PUBLISH = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Seckill/Publish/',
  method: 'post',
  data: parameters
})
// 秒杀活动-(撤回);
export const SPREAD_API_SECKILL_REVOKE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Seckill/Revoke/',
  method: 'post',
  data: parameters
})
// 秒杀活动-(删除);
export const SPREAD_API_SECKILL_DELETE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Seckill/Delete/',
  method: 'post',
  data: parameters
})
// 秒杀活动明细-(检索);
export const SPREAD_API_SECKILL_SEARCHITEMS = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Seckill/SearchItems/',
  method: 'get',
  params: parameters
})
// 秒杀活动明细-(详情);
export const SPREAD_API_SECKILL_ITEMDETAIL = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Seckill/ItemDetail/',
  method: 'get',
  params: parameters
})
// 秒杀活动明细-(创建);
export const SPREAD_API_SECKILL_ITEMCREATE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Seckill/ItemCreate/',
  method: 'post',
  data: parameters
})
// 秒杀活动明细-(更新);
export const SPREAD_API_SECKILL_ITEMUPDATE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Seckill/ItemUpdate/',
  method: 'post',
  data: parameters
})
// 秒杀活动明细-(删除);
export const SPREAD_API_SECKILL_ITEMDELETE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Seckill/ItemDelete/',
  method: 'post',
  data: parameters
})
// 秒杀活动领取地址-(检索);
export const SPREAD_API_SECKILL_SEARCHADDRS = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Seckill/SearchAddrs/',
  method: 'get',
  params: parameters
})
// 秒杀活动领取地址-(创建);
export const SPREAD_API_SECKILL_ADDRCREATE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Seckill/AddrCreate/',
  method: 'post',
  data: parameters
})
// 秒杀活动领取地址-(删除);
export const SPREAD_API_SECKILL_ADDRDELETE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Seckill/AddrDelete/',
  method: 'post',
  data: parameters
})
// 秒杀活动领取地址-(设为售后);
export const SPREAD_API_SECKILL_ADDRSETRMATYPE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Seckill/AddrSetRmaType/',
  method: 'post',
  data: parameters
})
// 秒杀活动领取地址-(取消售后);
export const SPREAD_API_SECKILL_ADDRCANCELRMATYPE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Seckill/AddrCancelRmaType/',
  method: 'post',
  data: parameters
})
// 活动商品-(检索);
export const SPREAD_API_SPR_SEARCH = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Spr/Search/',
  method: 'get',
  params: parameters
})
// 活动商品-(详情);
export const SPREAD_API_SPR_DETAIL = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Spr/Detail/',
  method: 'get',
  params: parameters
})
// 活动商品-(创建);
export const SPREAD_API_SPR_CREATE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Spr/Create/',
  method: 'post',
  data: parameters
})
// 活动商品-(更新);
export const SPREAD_API_SPR_UPDATE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Spr/Update/',
  method: 'post',
  data: parameters
})
// 活动商品-(删除);
export const SPREAD_API_SPR_DELETE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Spr/Delete/',
  method: 'post',
  data: parameters
})
// 提货地址-(检索);
export const SPREAD_API_SPR_SEARCHADDRS = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Spr/SearchAddrs/',
  method: 'get',
  params: parameters
})
// 提货地址-(详情);
export const SPREAD_API_SPR_ADDRDETAIL = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Spr/AddrDetail/',
  method: 'get',
  params: parameters
})
// 提货地址-(创建);
export const SPREAD_API_SPR_ADDRCREATE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Spr/AddrCreate/',
  method: 'post',
  data: parameters
})
// 提货地址-(更新);
export const SPREAD_API_SPR_ADDRUPDATE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Spr/AddrUpdate/',
  method: 'post',
  data: parameters
})
// 提货地址-(删除);
export const SPREAD_API_SPR_ADDRDELETE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Spr/AddrDelete/',
  method: 'post',
  data: parameters
})
// 退货设置-(详情);
export const SPREAD_API_SPR_SETTINGDETAIL = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Spr/SettingDetail/',
  method: 'get',
  params: parameters
})
// 退货设置-(更新);
export const SPREAD_API_SPR_SETTINGUPDATE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Spr/SettingUpdate/',
  method: 'post',
  data: parameters
})
// 活动 - 检测小程序状态;
export const SPREAD_API_SPR_GETAPPLETSTATUS = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Spr/GetAppletStatus/',
  method: 'get',
  params: parameters
})
// 活动 - 获取图片;
export const SPREAD_API_SPR_UPDATEIMAGE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Spr/UpdateImage/',
  method: 'get',
  params: parameters
})
// API_SPR_DOWNLOADFILE;
export const SPREAD_API_SPR_DOWNLOADFILE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Spr/DownloadFile/',
  method: 'get',
  params: parameters
})
// 活动分享奖励 - 检索;
export const SPREAD_API_SPRLOG_REWARDLIST = parameters => fetch({
  cloud: 'Spread',
  url: '/api/SprLog/RewardList/',
  method: 'get',
  params: parameters
})
// 活动数据概览 - 检索;
export const SPREAD_API_SPRLOG_TRAFFICLIST = parameters => fetch({
  cloud: 'Spread',
  url: '/api/SprLog/TrafficList/',
  method: 'get',
  params: parameters
})
// 活动订单 - 检索;
export const SPREAD_API_SPRORDER_ORDERLIST = parameters => fetch({
  cloud: 'Spread',
  url: '/api/SprOrder/OrderList/',
  method: 'get',
  params: parameters
})
// 订单管理 - 检索;
export const SPREAD_API_SPRORDER_SEARCH = parameters => fetch({
  cloud: 'Spread',
  url: '/api/SprOrder/Search/',
  method: 'get',
  params: parameters
})
// 订单管理 - 查看原因;
export const SPREAD_API_SPRORDER_SEARCHREASON = parameters => fetch({
  cloud: 'Spread',
  url: '/api/SprOrder/SearchReason/',
  method: 'get',
  params: parameters
})
// 订单管理 - 详情;
export const SPREAD_API_SPRORDER_DETAIL = parameters => fetch({
  cloud: 'Spread',
  url: '/api/SprOrder/Detail/',
  method: 'get',
  params: parameters
})
// 订单管理 - 提货/邮寄;
export const SPREAD_API_SPRORDER_SHIP = parameters => fetch({
  cloud: 'Spread',
  url: '/api/SprOrder/Ship/',
  method: 'post',
  data: parameters
})
// 活动订单导出 - 直接下载(小于等于1W行);
export const SPREAD_API_SPRORDER_EXPORT = parameters => fetch({
  cloud: 'Spread',
  url: '/api/SprOrder/Export/',
  method: 'post',
  data: parameters
})
// 退货单 - 检索;
export const SPREAD_API_SPRORDER_RETURNLIST = parameters => fetch({
  cloud: 'Spread',
  url: '/api/SprOrder/ReturnList/',
  method: 'get',
  params: parameters
})
// 退货单 - 详情;
export const SPREAD_API_SPRORDER_RETURNDETAIL = parameters => fetch({
  cloud: 'Spread',
  url: '/api/SprOrder/ReturnDetail/',
  method: 'get',
  params: parameters
})
// 退货单 - 检查卡券是否已经被使用;
export const SPREAD_API_SPRORDER_CHECKCOUPON = parameters => fetch({
  cloud: 'Spread',
  url: '/api/SprOrder/CheckCoupon/',
  method: 'get',
  params: parameters
})
// 退货单 - 创建;
export const SPREAD_API_SPRORDER_RETURNCREATE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/SprOrder/ReturnCreate/',
  method: 'post',
  data: parameters
})
// 退货单 - 审核通过;
export const SPREAD_API_SPRORDER_RETURNAUDIT = parameters => fetch({
  cloud: 'Spread',
  url: '/api/SprOrder/ReturnAudit/',
  method: 'post',
  data: parameters
})
// 退货单 - 作废;
export const SPREAD_API_SPRORDER_RETURNABANDON = parameters => fetch({
  cloud: 'Spread',
  url: '/api/SprOrder/ReturnAbandon/',
  method: 'post',
  data: parameters
})
// 上传(id类型);
export const SPREAD_API_UPLOAD_FILE = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Upload/File/',
  method: 'post',
  data: parameters
})
// 上传;
export const SPREAD_API_UPLOAD_FILEBASE64 = parameters => fetch({
  cloud: 'Spread',
  url: '/api/Upload/FileBase64/',
  method: 'post',
  data: parameters
})
