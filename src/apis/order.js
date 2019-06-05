import fetch from '@/utilities/fetch'
  
// 零售单的旧货子单商品 - 加载;
export const ORDER_API_RETAIL_ORDER_BACK_PRODUCT_GET = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_back_product/Get',
		method: 'get',
		params: parameters
	})
}
// 零售单 - 检索;
export const ORDER_API_RETAIL_ORDER_MASTER_GETS = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_master/Gets',
		method: 'get',
		params: parameters
	})
}
// 零售单 - 加载;
export const ORDER_API_RETAIL_ORDER_MASTER_GET = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_master/Get',
		method: 'get',
		params: parameters
	})
}
// 零售单 - 统计销售数据;
export const ORDER_API_RETAIL_ORDER_MASTER_SUMMAYBYPERSALE = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_master/SummayByPerSale',
		method: 'get',
		params: parameters
	})
}
// 零售单 - 统计销售(30天)数据;
export const ORDER_API_RETAIL_ORDER_MASTER_SUMMAYSALEBOARD = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_master/SummaySaleBoard',
		method: 'get',
		params: parameters
	})
}
// 零售单 - 创建;
export const ORDER_API_RETAIL_ORDER_MASTER_CREATE = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_master/Create',
		method: 'post',
		data: parameters
	})
}
// 零售单 - 零售单创建(自动审核);
export const ORDER_API_RETAIL_ORDER_MASTER_CREATEBYSELF = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_master/CreateBySelf',
		method: 'post',
		data: parameters
	})
}
// 零售单 - 审核(主键行锁);
export const ORDER_API_RETAIL_ORDER_MASTER_AUDIT = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_master/Audit',
		method: 'post',
		data: parameters
	})
}
// 零售单 - 作废(主键行锁);
export const ORDER_API_RETAIL_ORDER_MASTER_ABANDON = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_master/Abandon',
		method: 'post',
		data: parameters
	})
}
// 零售单 - 取消审核;
export const ORDER_API_RETAIL_ORDER_MASTER_CANCELAUDIT = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_master/CancelAudit',
		method: 'post',
		data: parameters
	})
}
// 零售单的旧货子单 - 收银台销售报表;
export const ORDER_API_RETAIL_ORDER_REPORT_RETAILORDERCASHIERREPORT = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_report/RetailOrderCashierReport',
		method: 'post',
		data: parameters
	})
}
// 零售单的旧货子单 - 汇总(按日期);
export const ORDER_API_RETAIL_ORDER_REPORT_SUMMARYBYDATE = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_report/SummaryByDate',
		method: 'post',
		data: parameters
	})
}
// 零售单的旧货子单 - 明细(按日期)地区只显示不做查询;
export const ORDER_API_RETAIL_ORDER_REPORT_DETAILBYDATE = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_report/DetailByDate',
		method: 'get',
		params: parameters
	})
}
// 零售单的旧货子单 - 汇总(按门店);
export const ORDER_API_RETAIL_ORDER_REPORT_SUMMARYBYSTORE = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_report/SummaryByStore',
		method: 'post',
		data: parameters
	})
}
// 零售单的旧货子单 - 明细(按门店);
export const ORDER_API_RETAIL_ORDER_REPORT_DETAILBYSTORE = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_report/DetailByStore',
		method: 'get',
		params: parameters
	})
}
// 零售单的旧货子单 - 获取会员消费统计数据;
export const ORDER_API_RETAIL_ORDER_REPORT_ORDERSUMMARYBYMEMBER = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_report/OrderSummaryByMember',
		method: 'post',
		data: parameters
	})
}
// 零售单的旧货子单 - 会员收益统计;
export const ORDER_API_RETAIL_ORDER_REPORT_ORDERSUMMARYBYCOUPONPROFIT = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_report/OrderSummaryByCouponProfit',
		method: 'post',
		data: parameters
	})
}
// 零售单的退货子单 - 检索;
export const ORDER_API_RETAIL_ORDER_RETURN_GETS = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_return/Gets',
		method: 'get',
		params: parameters
	})
}
// - 零售单的退货子单(导出);
export const ORDER_API_RETAIL_ORDER_RETURN_RETURNEXPORT = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_return/ReturnExport',
		method: 'get',
		params: parameters
	})
}
// - 售后的退货子单(导出);
export const ORDER_API_RETAIL_ORDER_RETURN_RETURNERPEXPORT = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_return/ReturnERPExport',
		method: 'get',
		params: parameters
	})
}
// 零售单的退货子单 - 加载;
export const ORDER_API_RETAIL_ORDER_RETURN_GET = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_return/Get',
		method: 'get',
		params: parameters
	})
}
// 零售单的退货子单 - 创建;
export const ORDER_API_RETAIL_ORDER_RETURN_CREATE = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_return/Create',
		method: 'post',
		data: parameters
	})
}
// 零售单的退货子单 - 创建(自动审核);
export const ORDER_API_RETAIL_ORDER_RETURN_CREATEBYSELF = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_return/CreateBySelf',
		method: 'post',
		data: parameters
	})
}
// 零售单的退货子单 - 审核(主键行锁);
export const ORDER_API_RETAIL_ORDER_RETURN_AUDIT = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_return/Audit',
		method: 'post',
		data: parameters
	})
}
// 零售单的退货子单 - 作废(主键行锁);
export const ORDER_API_RETAIL_ORDER_RETURN_ABANDON = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_return/Abandon',
		method: 'post',
		data: parameters
	})
}
// 零售单的新品子单 - 检索;
export const ORDER_API_RETAIL_ORDER_SELL_BASIC_GETS = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_sell_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 零售单的新品子单 - 导出;
export const ORDER_API_RETAIL_ORDER_SELL_BASIC_ORDERLISTEXPROT = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_sell_basic/OrderListExprot',
		method: 'get',
		params: parameters
	})
}
// 零售单的新品子单 - 加载;
export const ORDER_API_RETAIL_ORDER_SELL_BASIC_GET = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_sell_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 零售单的新品子单 - 加载(pc端专用);
export const ORDER_API_RETAIL_ORDER_SELL_BASIC_GETBYSTORE = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_sell_basic/GetByStore',
		method: 'get',
		params: parameters
	})
}
// 零售单的新品子单 - 获取最近订单;
export const ORDER_API_RETAIL_ORDER_SELL_BASIC_GETNEARORDERS = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_sell_basic/GetNearOrders',
		method: 'get',
		params: parameters
	})
}
// 零售单的新品子单 - 获取商品是否已售;
export const ORDER_API_RETAIL_ORDER_SELL_BASIC_PRODUCTHASUSED = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/retail_order_sell_basic/ProductHasUsed',
		method: 'post',
		data: parameters
	})
}
// 订单系统定时任务 - 消费单作废;
export const ORDER_API_SCHEDULER_ORDERABANDON = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/scheduler/OrderAbandon',
		method: 'post',
		data: parameters
	})
}
// 营销系统定时任务 - 挂单凌晨作废;
export const ORDER_API_SCHEDULER_ORDERAWAITABANDON = (parameters) => {
	return fetch({
		cloud:'Order',
		url: '/scheduler/OrderAwaitAbandon',
		method: 'post',
		data: parameters
	})
}