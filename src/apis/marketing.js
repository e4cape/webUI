import fetch from '@/utilities/fetch'
  
// 赠送金额记录(列表);
export const MARKETING_API_BALANCE_FREE_EXPIRE_GETS = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/balance_free_expire/Gets',
		method: 'get',
		params: parameters
	})
}
// - 检索;
export const MARKETING_API_BALANCE_STORE_GETSBYCOMPANY = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/balance_store/GetsByCompany',
		method: 'get',
		params: parameters
	})
}
// - 账户余额(详细);
export const MARKETING_API_BALANCE_STORE_GET = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/balance_store/Get',
		method: 'get',
		params: parameters
	})
}
// - 充值警戒值(更新);
export const MARKETING_API_BALANCE_STORE_ALERTUPDATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/balance_store/AlertUpdate',
		method: 'post',
		data: parameters
	})
}
// 收银台授权(列表);
export const MARKETING_API_CASHIER_EQUIPMENT_GETS = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/cashier_equipment/Gets',
		method: 'get',
		params: parameters
	})
}
// 设备服务 详情;
export const MARKETING_API_CASHIER_EQUIPMENT_GET = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/cashier_equipment/Get',
		method: 'get',
		params: parameters
	})
}
// 设备服务 - 创建;
export const MARKETING_API_CASHIER_EQUIPMENT_CREATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/cashier_equipment/Create',
		method: 'post',
		data: parameters
	})
}
// 设备服务 - 取消认证;
export const MARKETING_API_CASHIER_EQUIPMENT_UNAUTH = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/cashier_equipment/UnAuth',
		method: 'post',
		data: parameters
	})
}
// 设备服务 - 作废(主键行锁);
export const MARKETING_API_CASHIER_EQUIPMENT_ABANDON = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/cashier_equipment/Abandon',
		method: 'post',
		data: parameters
	})
}
// 设备服务 - 认证;
export const MARKETING_API_CASHIER_EQUIPMENT_AUTH = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/cashier_equipment/Auth',
		method: 'post',
		data: parameters
	})
}
// 门店余额账户的日志服务 - 检索;
export const MARKETING_API_LOG_BALANCE_STORE_GETS = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/log_balance_store/Gets',
		method: 'get',
		params: parameters
	})
}
// 营销产品(列表)- 检索;
export const MARKETING_API_MARKET_PRODUCT_GETS = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/market_product/Gets',
		method: 'get',
		params: parameters
	})
}
// 营销产品(详细) - 加载;
export const MARKETING_API_MARKET_PRODUCT_GET = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/market_product/Get',
		method: 'get',
		params: parameters
	})
}
// 营销产品(更新) - 更新;
export const MARKETING_API_MARKET_PRODUCT_UPDATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/market_product/Update',
		method: 'post',
		data: parameters
	})
}
// - 营销产品启用;
export const MARKETING_API_MARKET_PRODUCT_ONLINE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/market_product/Online',
		method: 'post',
		data: parameters
	})
}
// - 营销产品停用;
export const MARKETING_API_MARKET_PRODUCT_OFFLINE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/market_product/Offline',
		method: 'post',
		data: parameters
	})
}
// - 充值及赠送统计报表(平台列表);
export const MARKETING_API_MARKET_REPORT_GETRECHARGESUMMARYBYDATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/market_report/GetRechargeSummaryByDate',
		method: 'get',
		params: parameters
	})
}
// - 充值及赠送统计报表门店列表(平台导出);
export const MARKETING_API_MARKET_REPORT_GETRECHARGESUMMARYBYDATEEXPORT = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/market_report/GetRechargeSummaryByDateExport',
		method: 'get',
		params: parameters
	})
}
// - 充值统计(门店列表);
export const MARKETING_API_MARKET_REPORT_GETRECHARGESUMMARYBYSTORE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/market_report/GetRechargeSummaryByStore',
		method: 'get',
		params: parameters
	})
}
// - 充值统计(门店列表导出);
export const MARKETING_API_MARKET_REPORT_GETRECHARGESUMMARYBYSTOREEXPORT = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/market_report/GetRechargeSummaryByStoreExport',
		method: 'get',
		params: parameters
	})
}
// - 消费统计报表(平台列表);
export const MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYDATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/market_report/GetExpendSummaryByDate',
		method: 'get',
		params: parameters
	})
}
// - 消费统计报表(导出);
export const MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYDATEEXPORT = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/market_report/GetExpendSummaryByDateExport',
		method: 'get',
		params: parameters
	})
}
// - 消费统计报表(门店列表);
export const MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYSTORE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/market_report/GetExpendSummaryByStore',
		method: 'get',
		params: parameters
	})
}
// - 消费统计报表(门店列表导出);
export const MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYSTOREEXPORT = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/market_report/GetExpendSummaryByStoreExport',
		method: 'get',
		params: parameters
	})
}
// - 商家员工犒赏统计;
export const MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYDATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/market_report/GetAssessEmployeeSummaryByDate',
		method: 'get',
		params: parameters
	})
}
// - 商家员工犒赏统计(导出);
export const MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYDATEEXPORT = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/market_report/GetAssessEmployeeSummaryByDateExport',
		method: 'get',
		params: parameters
	})
}
// - 员工犒赏统计;
export const MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYSTORE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/market_report/GetAssessEmployeeSummaryByStore',
		method: 'get',
		params: parameters
	})
}
// - 员工犒赏统计(导出);
export const MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYSTOREEXPORT = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/market_report/GetAssessEmployeeSummaryByStoreExport',
		method: 'get',
		params: parameters
	})
}
// - 员工犒赏统计明细(列表);
export const MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYUSER = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/market_report/GetAssessEmployeeSummaryByUser',
		method: 'get',
		params: parameters
	})
}
// - 员工犒赏统计明细(导出);
export const MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYUSEREXPORT = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/market_report/GetAssessEmployeeSummaryByUserExport',
		method: 'get',
		params: parameters
	})
}
// - 会员收益统计(列表);
export const MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYCOUPONPROFIT = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/market_report/GetExpendSummaryByCouponProfit',
		method: 'get',
		params: parameters
	})
}
// - 会员收益统计(导出);
export const MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYCOUPONPROFITEXPORT = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/market_report/GetExpendSummaryByCouponProfitExport',
		method: 'get',
		params: parameters
	})
}
// 质保单(列表) - 检索;
export const MARKETING_API_ORDER_QUALITY_GETS = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/order_quality/Gets',
		method: 'get',
		params: parameters
	})
}
// 导出质保单(列表) - 检索;
export const MARKETING_API_ORDER_QUALITY_QUALITYLISTEXPORT = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/order_quality/QualityListExport',
		method: 'get',
		params: parameters
	})
}
// 质保单(详细) - 加载;
export const MARKETING_API_ORDER_QUALITY_GET = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/order_quality/Get',
		method: 'get',
		params: parameters
	})
}
// - 打印模版选择(列表);
export const MARKETING_API_ORDER_QUALITY_PRINTINGLIST = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/order_quality/PrintingList',
		method: 'get',
		params: parameters
	})
}
// - 生成质保单;
export const MARKETING_API_ORDER_QUALITY_UPLOADIMAGE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/order_quality/UploadImage',
		method: 'post',
		data: parameters
	})
}
// 充值单 - 检索;
export const MARKETING_API_ORDER_RECHARGE_BASIC_GETS = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/order_recharge_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 充值单 - 加载;
export const MARKETING_API_ORDER_RECHARGE_BASIC_GET = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/order_recharge_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 充值单 - 创建;
export const MARKETING_API_ORDER_RECHARGE_BASIC_CREATEBYAGENCY = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/order_recharge_basic/CreateByAgency',
		method: 'post',
		data: parameters
	})
}
// 充值单 - 创建;
export const MARKETING_API_ORDER_RECHARGE_BASIC_CREATEBYSELF = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/order_recharge_basic/CreateBySelf',
		method: 'post',
		data: parameters
	})
}
// 充值单 - 审核(主键行锁);
export const MARKETING_API_ORDER_RECHARGE_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/order_recharge_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 充值单 - 作废(主键行锁);
export const MARKETING_API_ORDER_RECHARGE_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/order_recharge_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 黄金卡券列表 - 检索;
export const MARKETING_API_QUEUE_RECEICE_GOLD_COUPON_GETS = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/queue_receice_gold_coupon/Gets',
		method: 'get',
		params: parameters
	})
}
// 黄金卡券列表 - 加载;
export const MARKETING_API_QUEUE_RECEICE_GOLD_COUPON_GET = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/queue_receice_gold_coupon/Get',
		method: 'get',
		params: parameters
	})
}
// 黄金卡券列表 - 加载;
export const MARKETING_API_QUEUE_RECEICE_GOLD_COUPON_GETBYITEMID = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/queue_receice_gold_coupon/GetByItemId',
		method: 'get',
		params: parameters
	})
}
// -排队使用统计(导出);
export const MARKETING_API_QUEUE_RECEICE_GOLD_COUPON_COUPONLISTEXPORT = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/queue_receice_gold_coupon/CouponListExport',
		method: 'get',
		params: parameters
	})
}
// 排队取金- 检索;
export const MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_GETS = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/queue_receive_gold_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// -排队领取统计(导出);
export const MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_ITEMLISTEXPORT = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/queue_receive_gold_basic/ItemListExport',
		method: 'get',
		params: parameters
	})
}
// -排队取金(导出);
export const MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_LISTEXPORT = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/queue_receive_gold_basic/ListExport',
		method: 'get',
		params: parameters
	})
}
// 排队取金 - 检索;
export const MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_GETSBYMEMBER = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/queue_receive_gold_basic/GetsByMember',
		method: 'get',
		params: parameters
	})
}
// 排队取金(详细);
export const MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_GET = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/queue_receive_gold_basic/Get',
		method: 'get',
		params: parameters
	})
}
// - 创建排队取金;
export const MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/queue_receive_gold_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 修改排队取金 - 更新;
export const MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/queue_receive_gold_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 排队取金 - 审核(主键行锁);
export const MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/queue_receive_gold_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 排队取金(作废)(主键行锁);
export const MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/queue_receive_gold_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 排队取金 - 终止(主键行锁);
export const MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_TERMINAL = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/queue_receive_gold_basic/Terminal',
		method: 'post',
		data: parameters
	})
}
// 排队领取统计(列表);
export const MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_ITEMLIST = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/queue_receive_gold_basic/ItemList',
		method: 'get',
		params: parameters
	})
}
// 贡献者(列表);
export const MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_LOGLIST = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/queue_receive_gold_basic/LogList',
		method: 'get',
		params: parameters
	})
}
// 营销系统定时任务 - 赠送账户回收服务;
export const MARKETING_API_SCHEDULER_SETTLEBALANCEFREEEXPIRE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/scheduler/SettleBalanceFreeExpire',
		method: 'post',
		data: parameters
	})
}
// 营销系统定时任务 - 更新排队领金状态;
export const MARKETING_API_SCHEDULER_SETTLEQUEUERECEIVEGOLD = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/scheduler/SettleQueueReceiveGold',
		method: 'post',
		data: parameters
	})
}
// 营销系统定时任务 - 收益卡券结算更新;
export const MARKETING_API_SCHEDULER_SETTLEWALLETCOUPON = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/scheduler/SettleWalletCoupon',
		method: 'post',
		data: parameters
	})
}
// - 加载;
export const MARKETING_API_SETTING_COUPON_GET = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/setting_coupon/Get',
		method: 'get',
		params: parameters
	})
}
// 营销产品设置(更新) - 更新;
export const MARKETING_API_SETTING_COUPON_UPDATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/setting_coupon/Update',
		method: 'post',
		data: parameters
	})
}
// 系统公告(列表) - 检索;
export const MARKETING_API_SETTING_NOTICE_GETS = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/setting_notice/Gets',
		method: 'get',
		params: parameters
	})
}
// 系统公告 - 加载;
export const MARKETING_API_SETTING_NOTICE_GET = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/setting_notice/Get',
		method: 'get',
		params: parameters
	})
}
// 系统公告- 创建;
export const MARKETING_API_SETTING_NOTICE_CREATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/setting_notice/Create',
		method: 'post',
		data: parameters
	})
}
// 系统公告 - 更新;
export const MARKETING_API_SETTING_NOTICE_UPDATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/setting_notice/Update',
		method: 'post',
		data: parameters
	})
}
// 系统公告 - 审核(主键行锁);
export const MARKETING_API_SETTING_NOTICE_AUDIT = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/setting_notice/Audit',
		method: 'post',
		data: parameters
	})
}
// 系统公告 - 审核退回(主键行锁);
export const MARKETING_API_SETTING_NOTICE_REJECT = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/setting_notice/Reject',
		method: 'post',
		data: parameters
	})
}
// 系统公告 - 作废(主键行锁);
export const MARKETING_API_SETTING_NOTICE_ABANDON = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/setting_notice/Abandon',
		method: 'post',
		data: parameters
	})
}
// 平台提点设置(前端对其提点进行*100操作) - 加载 ;
export const MARKETING_API_SETTING_ORDER_RATE_GET = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/setting_order_rate/Get',
		method: 'get',
		params: parameters
	})
}
// 平台提点设置 - 更新;
export const MARKETING_API_SETTING_ORDER_RATE_UPDATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/setting_order_rate/Update',
		method: 'post',
		data: parameters
	})
}
// - 检索;
export const MARKETING_API_SETTING_RECHARGE_GET = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/setting_recharge/Get',
		method: 'get',
		params: parameters
	})
}
// 充值策略- 充值策略(更新);
export const MARKETING_API_SETTING_RECHARGE_UPDATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/setting_recharge/Update',
		method: 'post',
		data: parameters
	})
}
// 商品管理(列表) - 检索;
export const MARKETING_API_STORE_PRODUCT_BASIC_GETS = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/store_product_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 商品管理 - 加载;
export const MARKETING_API_STORE_PRODUCT_BASIC_GET = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/store_product_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 商品管理 - 创建;
export const MARKETING_API_STORE_PRODUCT_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/store_product_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 商品管理 - 更新;
export const MARKETING_API_STORE_PRODUCT_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/store_product_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 商品管理 - 删除(数据库事务+无行锁);
export const MARKETING_API_STORE_PRODUCT_BASIC_DELETE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/store_product_basic/Delete',
		method: 'post',
		data: parameters
	})
}
// 导出商品模板;
export const MARKETING_API_STORE_PRODUCT_BASIC_DOWNLOADPROTEMPLETEXCEL = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/store_product_basic/DownloadProTempletExcel',
		method: 'get',
		params: parameters
	})
}
// 商品 - 检索商品(订单);
export const MARKETING_API_STORE_PRODUCT_BASIC_GETSBYORDER = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/store_product_basic/GetsByOrder',
		method: 'get',
		params: parameters
	})
}
// 商户营销产品设置 - 加载;
export const MARKETING_API_STORE_SETTING_COUPON_GET = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/store_setting_coupon/Get',
		method: 'get',
		params: parameters
	})
}
// 商户营销产品设置 - 更新;
export const MARKETING_API_STORE_SETTING_COUPON_STORECOUPONUPDATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/store_setting_coupon/StoreCouponUpdate',
		method: 'post',
		data: parameters
	})
}
// 营销产品设置(更新备注) - 更新;
export const MARKETING_API_STORE_SETTING_MARKET_NOTE_COUPONNOTEUPDATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/store_setting_market_note/CouponNoteUpdate',
		method: 'post',
		data: parameters
	})
}
// 收益赠送设置- 加载;
export const MARKETING_API_STORE_SETTING_PROFIT_GET = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/store_setting_profit/Get',
		method: 'get',
		params: parameters
	})
}
// 收益赠送设置 - 更新;
export const MARKETING_API_STORE_SETTING_PROFIT_UPDATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/store_setting_profit/Update',
		method: 'post',
		data: parameters
	})
}
// 质保单模版 - 加载;
export const MARKETING_API_STORE_STAMP_GET = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/store_stamp/Get',
		method: 'get',
		params: parameters
	})
}
// 质保单模版 - 更新;
export const MARKETING_API_STORE_STAMP_UPDATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/store_stamp/Update',
		method: 'post',
		data: parameters
	})
}
// - 检索;
export const MARKETING_API_STORE_SYSTEM_MESSAGE_GETS = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/store_system_message/Gets',
		method: 'get',
		params: parameters
	})
}
// 系统消息推送 - 更新;
export const MARKETING_API_STORE_SYSTEM_MESSAGE_UPDATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/store_system_message/Update',
		method: 'post',
		data: parameters
	})
}
// - 获取二维码;
export const MARKETING_API_UTILITY_GETQRCODE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/utility/GetQrcode',
		method: 'get',
		params: parameters
	})
}
// 会员收益记录(列表);
export const MARKETING_API_WALLET_COUPON_GETS = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wallet_coupon/Gets',
		method: 'get',
		params: parameters
	})
}
// 微信管理 - 微信授权 - 详情;
export const MARKETING_API_WEB_CHAT_ISWXAUTHORIZER = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/IsWxAuthorizer',
		method: 'post',
		data: parameters
	})
}
// 微信管理 - 获取授权序号;
export const MARKETING_API_WEB_CHAT_GETAUTHORIZERID = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/GetAuthorizerId',
		method: 'get',
		params: parameters
	})
}
// 微信管理 - 微信公众号设置(列表);
export const MARKETING_API_WEB_CHAT_AUTHORIZERLIST = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/AuthorizerList',
		method: 'get',
		params: parameters
	})
}
// 微信管理 - 微信公众号设置(删除);
export const MARKETING_API_WEB_CHAT_AUTHORDELETE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/AuthorDelete',
		method: 'post',
		data: parameters
	})
}
// 微信管理 - 微信公众号设置(刷新公众号昵称);
export const MARKETING_API_WEB_CHAT_UPDATENICKNAME = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/UpdateNickName',
		method: 'post',
		data: parameters
	})
}
// 微信管理 - 菜单(列表);
export const MARKETING_API_WEB_CHAT_MENULIST = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/MenuList',
		method: 'get',
		params: parameters
	})
}
// 微信管理 - 菜单(会员卡号);
export const MARKETING_API_WEB_CHAT_GETCARDCODE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/GetCardCode',
		method: 'get',
		params: parameters
	})
}
// 微信管理 - 菜单(详细);
export const MARKETING_API_WEB_CHAT_MENUDETAIL = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/MenuDetail',
		method: 'get',
		params: parameters
	})
}
// 微信管理 - 微信菜单(创建);
export const MARKETING_API_WEB_CHAT_MENUCREATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/MenuCreate',
		method: 'post',
		data: parameters
	})
}
// 微信管理 - 微信菜单(更新);
export const MARKETING_API_WEB_CHAT_MENUUPDATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/MenuUpdate',
		method: 'post',
		data: parameters
	})
}
// 微信管理 - 菜单(删除);
export const MARKETING_API_WEB_CHAT_MENUDETELE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/MenuDetele',
		method: 'post',
		data: parameters
	})
}
// 微信管理 - 菜单(发布);
export const MARKETING_API_WEB_CHAT_MENURELEASE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/MenuRelease',
		method: 'post',
		data: parameters
	})
}
// 微信管理 - 回复消息规则(列表);
export const MARKETING_API_WEB_CHAT_REPLYLIST = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/ReplyList',
		method: 'get',
		params: parameters
	})
}
// 微信管理 - 被关注自动回复(详细);
export const MARKETING_API_WEB_CHAT_RULEBYSUBSCRIBEDETAIL = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/RuleBySubscribeDetail',
		method: 'get',
		params: parameters
	})
}
// 微信管理 - 被关注自动回复(创建);
export const MARKETING_API_WEB_CHAT_RULECREATEBYSUBSCRIBE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/RuleCreateBySubscribe',
		method: 'post',
		data: parameters
	})
}
// 微信管理 - 被关注自动回复(更新);
export const MARKETING_API_WEB_CHAT_RULEUPDATEBYSUBSCRIBE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/RuleUpdateBySubscribe',
		method: 'post',
		data: parameters
	})
}
// 微信管理 - 关键字回复(详细);
export const MARKETING_API_WEB_CHAT_RULEBYKEYWORDDETAIL = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/RuleByKeywordDetail',
		method: 'get',
		params: parameters
	})
}
// 微信管理 - 关键字自动回复(创建);
export const MARKETING_API_WEB_CHAT_RULECREATEBYKEYWORD = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/RuleCreateByKeyword',
		method: 'post',
		data: parameters
	})
}
// 微信管理 - 关键字自动回复(更新);
export const MARKETING_API_WEB_CHAT_RULEUPDATEBYKEYWORD = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/RuleUpdateByKeyword',
		method: 'post',
		data: parameters
	})
}
// 微信管理 - 回复规则(删除);
export const MARKETING_API_WEB_CHAT_RULEDELETE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/RuleDelete',
		method: 'post',
		data: parameters
	})
}
// 微信管理 - 总部模版(列表);
export const MARKETING_API_WEB_CHAT_COMPANYTEMPLATELIST = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/CompanyTemplateList',
		method: 'get',
		params: parameters
	})
}
// 微信管理 - 总部模版(创建);
export const MARKETING_API_WEB_CHAT_CREATECOMPANYTEMPLATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/CreateCompanyTemplate',
		method: 'post',
		data: parameters
	})
}
// 微信管理 - 总部消息模版(详情);
export const MARKETING_API_WEB_CHAT_COMPANYTEMPLATEDETAIL = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/CompanyTemplateDetail',
		method: 'get',
		params: parameters
	})
}
// 微信管理 - 门店消息模版(列表);
export const MARKETING_API_WEB_CHAT_STORETEMPLATELIST = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/StoreTemplateList',
		method: 'get',
		params: parameters
	})
}
// 微信管理 - 门店消息模版(创建);
export const MARKETING_API_WEB_CHAT_CREATESTORETEMPLATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/CreateStoreTemplate',
		method: 'post',
		data: parameters
	})
}
// 微信管理 - 消息模版(详细);
export const MARKETING_API_WEB_CHAT_STORETEMPLATEDETAIL = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/StoreTemplateDetail',
		method: 'get',
		params: parameters
	})
}
// 微信管理 - 消息模版(更新);
export const MARKETING_API_WEB_CHAT_TEMPLATEUPDATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/TemplateUpdate',
		method: 'post',
		data: parameters
	})
}
// 微信管理 - 消息模版(删除);
export const MARKETING_API_WEB_CHAT_TEMPLATEDELETE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/TemplateDelete',
		method: 'post',
		data: parameters
	})
}
// 微信管理 - 查询小程序关联状态;
export const MARKETING_API_WEB_CHAT_GETAUTHORIZERINFO = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/GetAuthorizerInfo',
		method: 'get',
		params: parameters
	})
}
// 微信公众号设置(刷新卡券开通状态);
export const MARKETING_API_WEB_CHAT_UPDATEISOPENCARD = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/UpdateIsOpenCard',
		method: 'get',
		params: parameters
	})
}
// 微信二维码(服务号);
export const MARKETING_API_WEB_CHAT_WECHATBARCODE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/web_chat/WechatBarCode',
		method: 'get',
		params: parameters
	})
}
// 小程序 - 检测关联小程序;
export const MARKETING_API_WX_APPLET_CHECKAPPLET = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/CheckApplet',
		method: 'post',
		data: parameters
	})
}
// 小程序 - 关联小程序;
export const MARKETING_API_WX_APPLET_BINDWXAMPLINK = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/BindWxampLink',
		method: 'post',
		data: parameters
	})
}
// 小程序 - 解除关联小程序;
export const MARKETING_API_WX_APPLET_UNBINDWXAMPLINK = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/UnBindWxampLink',
		method: 'post',
		data: parameters
	})
}
// 小程序 - 查询小程序关联状态;
export const MARKETING_API_WX_APPLET_GETWXAMPLINKSTATUS = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/GetWxampLinkStatus',
		method: 'get',
		params: parameters
	})
}
// 小程序 - 设置服务器域名;
export const MARKETING_API_WX_APPLET_MODIFYDOMAIN = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/ModifyDomain',
		method: 'post',
		data: parameters
	})
}
// 小程序 - 设置业务域名;
export const MARKETING_API_WX_APPLET_SETWEBVIEWDOMAIN = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/SetWebViewDomain',
		method: 'post',
		data: parameters
	})
}
// 小程序 - 获取帐号基本信息;
export const MARKETING_API_WX_APPLET_GETACCOUNTBASICINFO = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/GetAccountBasicInfo',
		method: 'get',
		params: parameters
	})
}
// 小程序 - 绑定微信用户为小程序体验者;
export const MARKETING_API_WX_APPLET_BINDTESTER = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/BindTester',
		method: 'post',
		data: parameters
	})
}
// 小程序 - 解除绑定小程序的体验者;
export const MARKETING_API_WX_APPLET_UNBINDTESTER = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/UnBindTester',
		method: 'post',
		data: parameters
	})
}
// 小程序 - 获取体验者列表;
export const MARKETING_API_WX_APPLET_GETMEMBERBINDERS = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/GetMemberBinders',
		method: 'get',
		params: parameters
	})
}
// 小程序 - 上传代码;
export const MARKETING_API_WX_APPLET_WXACOMMIT = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/WxaCommit',
		method: 'post',
		data: parameters
	})
}
// 小程序 - 小程序体验二维码;
export const MARKETING_API_WX_APPLET_GETQRCODE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/GetQRCode',
		method: 'get',
		params: parameters
	})
}
// 小程序 - 提交代码审核;
export const MARKETING_API_WX_APPLET_SUBMITAUDIT = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/SubmitAudit',
		method: 'post',
		data: parameters
	})
}
// 小程序 - 撤回审核;
export const MARKETING_API_WX_APPLET_UNDOCODEAUDIT = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/UndoCodeAudit',
		method: 'post',
		data: parameters
	})
}
// 小程序 - 发布已通过审核的小程序;
export const MARKETING_API_WX_APPLET_PUBLISHWXAPPLET = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/PublishWxApplet',
		method: 'post',
		data: parameters
	})
}
// 小程序 - 获取代码模版库中的所有小程序代码模版;
export const MARKETING_API_WX_APPLET_GETTEMPLATELIST = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/GetTemplateList',
		method: 'get',
		params: parameters
	})
}
// 小程序 - 获取代码模版库中的最新模版;
export const MARKETING_API_WX_APPLET_GETTEMPLATELATEST = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/GetTemplateLatest',
		method: 'get',
		params: parameters
	})
}
// 小程序 - 删除指定小程序代码模版;
export const MARKETING_API_WX_APPLET_DELETETEMPLATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/DeleteTemplate',
		method: 'post',
		data: parameters
	})
}
// 小程序 - 获取草稿箱内的所有临时代码草稿;
export const MARKETING_API_WX_APPLET_GETTEMPLATEDRAFTLIST = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/GetTemplateDraftList',
		method: 'get',
		params: parameters
	})
}
// 小程序 - 将草稿箱的草稿选为小程序代码模版;
export const MARKETING_API_WX_APPLET_ADDTOTEMPLATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/AddToTemplate',
		method: 'post',
		data: parameters
	})
}
// 小程序 - 商家小程序消息模版列表;
export const MARKETING_API_WX_APPLET_GETWXAPPLETTEMPLATELIST = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/GetWxAppletTemplateList',
		method: 'get',
		params: parameters
	})
}
// 小程序 - 配置模版消息(列表);
export const MARKETING_API_WX_APPLET_WXAPRIVATETEMPLATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/WxaPrivateTemplate',
		method: 'post',
		data: parameters
	})
}
// 小程序 - 配置模版消息(保存);
export const MARKETING_API_WX_APPLET_WXASETPERSONTEMPLATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/WxaSetPersonTemplate',
		method: 'post',
		data: parameters
	})
}
// 小程序 - 删除模版消息;
export const MARKETING_API_WX_APPLET_WXADELPRIVATETEMPLATE = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/WxaDelPrivateTemplate',
		method: 'post',
		data: parameters
	})
}
// 小程序 - 商家小程序列表;
export const MARKETING_API_WX_APPLET_GETWXAPPLETLIST = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/GetWxAppletList',
		method: 'get',
		params: parameters
	})
}
// 小程序 - 提交代码审核日志;
export const MARKETING_API_WX_APPLET_GETLOGWXAPPLETLIST = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/GetLogWxAppletList',
		method: 'get',
		params: parameters
	})
}
// 小程序 - 绑定平台;
export const MARKETING_API_WX_APPLET_BINDOPENACCOUNT = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/BindOpenAccount',
		method: 'post',
		data: parameters
	})
}
// 小程序 - 小程序授权列表;
export const MARKETING_API_WX_APPLET_APPLETLIST = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/AppletList',
		method: 'get',
		params: parameters
	})
}
// 小程序 - 小程序取消授权;
export const MARKETING_API_WX_APPLET_UNBINDAPPLET = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/UnbindApplet',
		method: 'post',
		data: parameters
	})
}
// 小程序 - 小程序授权 - 详情;
export const MARKETING_API_WX_APPLET_ISWXAUTHORIZER = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/IsWxAuthorizer',
		method: 'post',
		data: parameters
	})
}
// 小程序 - 小程序管理 - 我的小程序;
export const MARKETING_API_WX_APPLET_GETACCOUNTBASICINFOBYERP = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/GetAccountBasicInfoByErp',
		method: 'get',
		params: parameters
	})
}
// 小程序 - 小程序管理 - 体验者列表;
export const MARKETING_API_WX_APPLET_GETMEMBERBINDERSBYERP = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/GetMemberBindersByErp',
		method: 'get',
		params: parameters
	})
}
// 小程序 - 小程序管理 - 绑定体验者;
export const MARKETING_API_WX_APPLET_BINDTESTERBYERP = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/BindTesterByErp',
		method: 'post',
		data: parameters
	})
}
// 小程序 - 小程序管理 - 解除绑定小程序的体验者;
export const MARKETING_API_WX_APPLET_UNBINDTESTERBYERP = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/UnBindTesterByErp',
		method: 'post',
		data: parameters
	})
}
// 小程序 - 小程序管理 - 体验二维码;
export const MARKETING_API_WX_APPLET_GETQRCODEBYERP = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/GetQRCodeByErp',
		method: 'get',
		params: parameters
	})
}
// 小程序 - 小程序管理 - 小程序码;
export const MARKETING_API_WX_APPLET_GETAPPLETQRCODEBYERP = (parameters) => {
	return fetch({
		cloud:'Marketing',
		url: '/wx_applet/GetAppletQRCodeByErp',
		method: 'get',
		params: parameters
	})
}