import fetch from '@/utilities/fetch'

// 优惠券 - 检索;
export const SCORING_API_COUPON_BASIC_GETS = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_basic/Gets',
    method: 'get',
    params: parameters
  })
}
// 优惠券 - 检索(红包使用);
export const SCORING_API_COUPON_BASIC_GETSBYREDPACKET = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_basic/GetsByRedPacket',
    method: 'get',
    params: parameters
  })
}
// 优惠券 - 检索(平台端);
export const SCORING_API_COUPON_BASIC_GETSBYPF = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_basic/GetsByPf',
    method: 'get',
    params: parameters
  })
}
// 优惠券 - 加载;
export const SCORING_API_COUPON_BASIC_GET = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_basic/Get',
    method: 'get',
    params: parameters
  })
}
// 优惠券 - 获取员工销售二维码;
export const SCORING_API_COUPON_BASIC_GETSALEQRCODE = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_basic/GetSaleQrcode',
    method: 'get',
    params: parameters
  })
}
// 优惠券 - 创建;
export const SCORING_API_COUPON_BASIC_CREATE = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_basic/Create',
    method: 'post',
    data: parameters
  })
}
// 优惠券 - 作废(主键行锁);
export const SCORING_API_COUPON_BASIC_ABANDON = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_basic/Abandon',
    method: 'post',
    data: parameters
  })
}
// 优惠券 - 作废(主键行锁);
export const SCORING_API_COUPON_BASIC_TERMINAL = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_basic/Terminal',
    method: 'post',
    data: parameters
  })
}
// 优惠券 - 审核(主键行锁);
export const SCORING_API_COUPON_BASIC_AUDIT = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_basic/Audit',
    method: 'post',
    data: parameters
  })
}
// 优惠券销售人员(绑定) - 检索(尽量少使用IFNULL,保证所有值都非null值);
export const SCORING_API_COUPON_EMPLOYEE_GETS = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_employee/Gets',
    method: 'get',
    params: parameters
  })
}
// 奖励统计(导出);
export const SCORING_API_COUPON_EMPLOYEE_REWARDLISTEXPORT = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_employee/RewardListExport',
    method: 'get',
    params: parameters
  })
}
// 赠送记录 - 检索;
export const SCORING_API_COUPON_ITEM_GIVE_RECORD_GETBYOPENID = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_item_give_record/GetByOpenId',
    method: 'get',
    params: parameters
  })
}
// 赠送记录 - 赠送记录创建;
export const SCORING_API_COUPON_ITEM_GIVE_RECORD_CREATE = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_item_give_record/Create',
    method: 'post',
    data: parameters
  })
}
// 赠送记录 - 赠送记录审核;
export const SCORING_API_COUPON_ITEM_GIVE_RECORD_AUDIT = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_item_give_record/Audit',
    method: 'post',
    data: parameters
  })
}
// - 检索;
export const SCORING_API_COUPON_ITEM_RECEIVE_RECORD_GET = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_item_receive_record/Get',
    method: 'get',
    params: parameters
  })
}
// 卡券 - 检索;
export const SCORING_API_COUPON_ITEM_GETS = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_item/Gets',
    method: 'get',
    params: parameters
  })
}
// - 客户领取统计(导出);
export const SCORING_API_COUPON_ITEM_SUMMARYLISTEXPORT = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_item/SummaryListExport',
    method: 'get',
    params: parameters
  })
}
// - 领取统计详情(导出);
export const SCORING_API_COUPON_ITEM_SUMMARYITEMLISTEXPORT = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_item/SummaryItemListExport',
    method: 'get',
    params: parameters
  })
}
// - 零售单的退货子单(导出);
export const SCORING_API_COUPON_ITEM_ITEMLISTEXPORT = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_item/ItemListExport',
    method: 'get',
    params: parameters
  })
}
// 卡券 - 门店统计;
export const SCORING_API_COUPON_ITEM_GETSSUMMARYBYSTORE = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_item/GetsSummaryByStore',
    method: 'get',
    params: parameters
  })
}
// 卡券 - 检索;
export const SCORING_API_COUPON_ITEM_GETSSUMMARYBYMEMBER = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_item/GetsSummaryByMember',
    method: 'get',
    params: parameters
  })
}
// 卡券 - 统计;
export const SCORING_API_COUPON_ITEM_GETANALYSIS = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_item/GetAnalysis',
    method: 'get',
    params: parameters
  })
}
// 卡券 - 卡券列表;
export const SCORING_API_COUPON_ITEM_GETSBYMEMBER = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_item/GetsByMember',
    method: 'get',
    params: parameters
  })
}
// 卡券销售 - 检索;
export const SCORING_API_COUPON_ORDER_GETS = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_order/Gets',
    method: 'get',
    params: parameters
  })
}
// - 订单管理(电子-导出);
export const SCORING_API_COUPON_ORDER_ORDERLISTEXPORT = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_order/OrderListExport',
    method: 'get',
    params: parameters
  })
}
// 订单管理(纸质-导出);
export const SCORING_API_COUPON_ORDER_ORDERLISTEXPORT1 = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_order/OrderListExport1',
    method: 'get',
    params: parameters
  })
}
// 纸质优惠券(导出);
export const SCORING_API_COUPON_ORDER_ORDERLISTEXPORT3 = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_order/OrderListExport3',
    method: 'get',
    params: parameters
  })
}
// 卡券销售 - 统计;
export const SCORING_API_COUPON_ORDER_GETANALYSIS = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_order/GetAnalysis',
    method: 'get',
    params: parameters
  })
}
// 卡券销售 - 卡券退款;
export const SCORING_API_COUPON_ORDER_REFUND = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_order/Refund',
    method: 'post',
    data: parameters
  })
}
// 卡券销售 - 卡券标记销售;
export const SCORING_API_COUPON_ORDER_SIGN = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_order/Sign',
    method: 'post',
    data: parameters
  })
}
// 活动赠送/金额规则 - 检索;
export const SCORING_API_COUPON_RANK_GETS = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_rank/Gets',
    method: 'get',
    params: parameters
  })
}
// 卡券样式 - 检索;
export const SCORING_API_COUPON_SETTING_STYLE_GETS = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_setting_style/Gets',
    method: 'get',
    params: parameters
  })
}
// 卡券样式 - 创建;
export const SCORING_API_COUPON_SETTING_STYLE_CREATE = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_setting_style/Create',
    method: 'post',
    data: parameters
  })
}
// 卡券样式 - 作废(主键行锁);
export const SCORING_API_COUPON_SETTING_STYLE_ABANDON = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_setting_style/Abandon',
    method: 'post',
    data: parameters
  })
}
// - 检索;
export const SCORING_API_COUPON_SETTING_TYPE_GETS = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_setting_type/Gets',
    method: 'get',
    params: parameters
  })
}
// - 加载;
export const SCORING_API_COUPON_SETTING_TYPE_GET = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_setting_type/Get',
    method: 'get',
    params: parameters
  })
}
// - 更新;
export const SCORING_API_COUPON_SETTING_TYPE_UPDATE = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/coupon_setting_type/Update',
    method: 'post',
    data: parameters
  })
}
// 会员卡管理 - 会员卡;
export const SCORING_API_WX_CARD_USERCARDDETAIL = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/wx_card/UserCardDetail',
    method: 'get',
    params: parameters
  })
}
// 会员卡管理 - 创建会员卡;
export const SCORING_API_WX_CARD_CREATEUSERCARD = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/wx_card/CreateUserCard',
    method: 'post',
    data: parameters
  })
}
// 会员卡管理 - 修改会员卡;
export const SCORING_API_WX_CARD_MODIFYUSERCARD = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/wx_card/ModifyUserCard',
    method: 'post',
    data: parameters
  })
}
// 会员卡管理 - 发送卡券投放(扫码);
export const SCORING_API_WX_CARD_SENDWXCARDQRCODE = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/wx_card/SendWxCardQrCode',
    method: 'post',
    data: parameters
  })
}
// 会员卡管理 - 更新会员信息(积分);
export const SCORING_API_WX_CARD_CARDUPDATEUSER = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/wx_card/CardUpdateUser',
    method: 'post',
    data: parameters
  })
}
// 会员卡管理 - 查看单张会员卡概况;
export const SCORING_API_WX_CARD_GETCARDMEMBERCARDDETAIL = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/wx_card/GetCardMemberCardDetail',
    method: 'get',
    params: parameters
  })
}
// 会员卡管理 - 导出单张会员卡概况;
export const SCORING_API_WX_CARD_EPORTCARDMEMBERCARDDETAIL = parameters => {
  return fetch({
    cloud: 'Scoring',
    url: '/wx_card/EportCardMemberCardDetail',
    method: 'get',
    params: parameters
  })
}
