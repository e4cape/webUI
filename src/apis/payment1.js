import fetch from '@/utilities/fetch'

// 阿里支付授权 - 详情;
export const PAYMENT_API_AUTHORIZER_ISALIAUTHORIZER = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/authorizer/IsAliAuthorizer',
    method: 'get',
    params: parameters
  })
}
// 微信支付授权 - 详情;
export const PAYMENT_API_AUTHORIZER_WECHARTDETAIL = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/authorizer/WechartDetail',
    method: 'get',
    params: parameters
  })
}
// 微信支付授权 - 更新;
export const PAYMENT_API_AUTHORIZER_WECHARTUPDATE = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/authorizer/WechartUpdate',
    method: 'post',
    data: parameters
  })
}
// 微信小程序支付授权 - 更新;
export const PAYMENT_API_AUTHORIZER_WEAPPLETUPDATE = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/authorizer/WeAppletUpdate',
    method: 'post',
    data: parameters
  })
}
// 微信小程序支付授权 - 详情;
export const PAYMENT_API_AUTHORIZER_WEAPPLETPAYDETAIL = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/authorizer/WeAppletPayDetail',
    method: 'get',
    params: parameters
  })
}
// - 检索;
export const PAYMENT_API_AUTHORIZER_GETS = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/authorizer/Gets',
    method: 'get',
    params: parameters
  })
}
// 授权管理 - 加载;
export const PAYMENT_API_AUTHORIZER_GET = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/authorizer/Get',
    method: 'get',
    params: parameters
  })
}
// 根据角色序号 - 加载;
export const PAYMENT_API_AUTHORIZER_REQ = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/authorizer/Req',
    method: 'get',
    params: parameters
  })
}
// - 微信支付授权(确定开通);
export const PAYMENT_API_AUTHORIZER_AUTHORIZEWXPAYUPDATE = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/authorizer/AuthorizeWxPayUpdate',
    method: 'post',
    data: parameters
  })
}
// - 支付宝取消授权;
export const PAYMENT_API_AUTHORIZER_ALIPAYAUTHORIZECANCEL = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/authorizer/AlipayAuthorizeCancel',
    method: 'post',
    data: parameters
  })
}
// - 阿里支付授权;
export const PAYMENT_API_AUTHORIZER_PAYMENTAUTHBYALI = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/authorizer/PaymentAuthByAli',
    method: 'post',
    data: parameters
  })
}
// - 小程序支付授权;
export const PAYMENT_API_AUTHORIZER_PAYMENTAUTHBYWXAPPLET = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/authorizer/PaymentAuthByWxApplet',
    method: 'post',
    data: parameters
  })
}
// - 微信支付;
export const PAYMENT_API_AUTHORIZER_PAYMENTAUTHBYWX = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/authorizer/PaymentAuthByWx',
    method: 'post',
    data: parameters
  })
}
// - ;
export const PAYMENT_API_AUTHORIZER_PAYMENTAUTHORIZERUPDATE = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/authorizer/PaymentAuthorizerUpdate',
    method: 'post',
    data: parameters
  })
}
// - 检索;
export const PAYMENT_API_ORDER_LOG_GETS = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/order_log/Gets',
    method: 'get',
    params: parameters
  })
}
// - 加载;
export const PAYMENT_API_ORDER_LOG_GET = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/order_log/Get',
    method: 'get',
    params: parameters
  })
}
// - 创建;
export const PAYMENT_API_ORDER_LOG_CREATE = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/order_log/Create',
    method: 'post',
    data: parameters
  })
}
// 微信红包 - 检索;
export const PAYMENT_API_RED_PACKET_BASIC_GETS = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/red_packet_basic/Gets',
    method: 'get',
    params: parameters
  })
}
// 微信红包 - 加载;
export const PAYMENT_API_RED_PACKET_BASIC_REQ = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/red_packet_basic/Req',
    method: 'get',
    params: parameters
  })
}
// 微信红包 - 加载;
export const PAYMENT_API_RED_PACKET_BASIC_GET = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/red_packet_basic/Get',
    method: 'get',
    params: parameters
  })
}
// 微信红包 - 普通红包创建;
export const PAYMENT_API_RED_PACKET_BASIC_CREATE = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/red_packet_basic/Create',
    method: 'post',
    data: parameters
  })
}
// 微信红包 - 更新;
export const PAYMENT_API_RED_PACKET_BASIC_UPDATE = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/red_packet_basic/Update',
    method: 'post',
    data: parameters
  })
}
// 微信红包 - 审核(主键行锁);
export const PAYMENT_API_RED_PACKET_BASIC_AUDIT = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/red_packet_basic/Audit',
    method: 'post',
    data: parameters
  })
}
// 微信红包 - 作废(主键行锁);
export const PAYMENT_API_RED_PACKET_BASIC_ABANDON = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/red_packet_basic/Abandon',
    method: 'post',
    data: parameters
  })
}
// 微信红包 - 终止(主键行锁);
export const PAYMENT_API_RED_PACKET_BASIC_TERMINAL = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/red_packet_basic/Terminal',
    method: 'post',
    data: parameters
  })
}
// 红包领取记录 - 检索;
export const PAYMENT_API_RED_PACKET_ITEM_GETS = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/red_packet_item/Gets',
    method: 'get',
    params: parameters
  })
}
// 红包活动记录 - 导出;
export const PAYMENT_API_RED_PACKET_ITEM_ITEMEXPORT = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/red_packet_item/ItemExport',
    method: 'get',
    params: parameters
  })
}
// 红包领取记录 - 加载;
export const PAYMENT_API_RED_PACKET_ITEM_GETANALYSIS = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/red_packet_item/GetAnalysis',
    method: 'get',
    params: parameters
  })
}
// 微信- 重发红包;
export const PAYMENT_API_RED_PACKET_ITEM_RETRY = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/red_packet_item/Retry',
    method: 'post',
    data: parameters
  })
}
// 支付系统定时任务 - 红包领取状态更新服务;
export const PAYMENT_API_SCHEDULER_REDPACKETUPDATESTATUS = (parameters) => {
  return fetch({
    cloud: 'Payment1',
    url: '/scheduler/RedPacketUpdateStatus',
    method: 'get',
    params: parameters
  })
}