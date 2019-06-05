import fetch from '@/utilities/fetch'

// 系统用户会话 - 检索;
export const STOCKING_API_DESK_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/desk_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 柜台管理 - 加载;
export const STOCKING_API_DESK_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/desk_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 柜台管理 - 加载默认柜台(仓库);
export const STOCKING_API_DESK_BASIC_GETDEFAULT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/desk_basic/GetDefault',
		method: 'get',
		params: parameters
	})
}
// 柜台管理 - 创建;
export const STOCKING_API_DESK_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/desk_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 柜台管理 - 更新;
export const STOCKING_API_DESK_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/desk_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 柜台管理 - 启用;
export const STOCKING_API_DESK_BASIC_ENABLE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/desk_basic/Enable',
		method: 'post',
		data: parameters
	})
}
// 柜台管理 - 禁用;
export const STOCKING_API_DESK_BASIC_DISABLE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/desk_basic/Disable',
		method: 'post',
		data: parameters
	})
}
// 系统用户会话 - 检索(柜台领货/退货列表);
export const STOCKING_API_DESK_PICKRET_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/desk_pickret_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 柜台领退单 - 加载;
export const STOCKING_API_DESK_PICKRET_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/desk_pickret_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 柜台领退单 - 创建(柜台领货/退货);
export const STOCKING_API_DESK_PICKRET_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/desk_pickret_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 柜台领退单 - 审核(确认领退货);
export const STOCKING_API_DESK_PICKRET_ORDER_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/desk_pickret_order_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 柜台领退单明细 - 检索;
export const STOCKING_API_DESK_PICKRET_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/desk_pickret_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 柜台领退单明细 - 检索(柜台详情 - 领退记录);
export const STOCKING_API_DESK_PICKRET_ORDER_ITEM_REQS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/desk_pickret_order_item/Reqs',
		method: 'get',
		params: parameters
	})
}
// 柜台领退单明细 - 检索(柜台详情-当前货品明细);
export const STOCKING_API_DESK_PICKRET_ORDER_ITEM_GETSGOODSSTOCK = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/desk_pickret_order_item/GetsGoodsStock',
		method: 'get',
		params: parameters
	})
}
// 柜台领退单明细 - 创建(扫码创建);
export const STOCKING_API_DESK_PICKRET_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/desk_pickret_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 柜台领退单明细 - 提单创建(柜台退货单);
export const STOCKING_API_DESK_PICKRET_ORDER_ITEM_SELECTPICKRETCREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/desk_pickret_order_item/SelectPickretCreate',
		method: 'post',
		data: parameters
	})
}
// 柜台领退单明细 - 提单创建(进货入库单);
export const STOCKING_API_DESK_PICKRET_ORDER_ITEM_SELECTINTAKECREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/desk_pickret_order_item/SelectIntakeCreate',
		method: 'post',
		data: parameters
	})
}
// 柜台领退单明细 - 提单创建(调拨入库单);
export const STOCKING_API_DESK_PICKRET_ORDER_ITEM_SELECTALLOTINTAKECREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/desk_pickret_order_item/SelectAllotIntakeCreate',
		method: 'post',
		data: parameters
	})
}
// 柜台领退单明细 - 更新;
export const STOCKING_API_DESK_PICKRET_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/desk_pickret_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 柜台领退单明细 - 删除;
export const STOCKING_API_DESK_PICKRET_ORDER_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/desk_pickret_order_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 成品调拨单货品明细 - 检索;
export const STOCKING_API_GOODS_ALLOT_ORDER_GOODS_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_goods/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品调拨单货品明细 - 结束核对;
export const STOCKING_API_GOODS_ALLOT_ORDER_GOODS_FINISHGETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_goods/FinishGets',
		method: 'get',
		params: parameters
	})
}
// 成品调拨单货品明细 - 创建;
export const STOCKING_API_GOODS_ALLOT_ORDER_GOODS_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_goods/Create',
		method: 'post',
		data: parameters
	})
}
// 成品调拨单货品明细 - 提单创建;
export const STOCKING_API_GOODS_ALLOT_ORDER_GOODS_SELECTINTAKECREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_goods/SelectIntakeCreate',
		method: 'post',
		data: parameters
	})
}
// 成品调拨单货品明细 - 更新(调拨数量);
export const STOCKING_API_GOODS_ALLOT_ORDER_GOODS_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_goods/Update',
		method: 'post',
		data: parameters
	})
}
// 成品调拨单货品明细 - 删除;
export const STOCKING_API_GOODS_ALLOT_ORDER_GOODS_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_goods/Delete',
		method: 'post',
		data: parameters
	})
}
// 成品调拨单货品明细 - 核对(直接更新数量核对);
export const STOCKING_API_GOODS_ALLOT_ORDER_GOODS_CHECKFORID = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_goods/CheckForId',
		method: 'post',
		data: parameters
	})
}
// 成品调拨单货品明细 - 扫码核对;
export const STOCKING_API_GOODS_ALLOT_ORDER_GOODS_CHECKFORCODE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_goods/CheckForCode',
		method: 'post',
		data: parameters
	})
}
// 成品调拨单货品明细 - 重新核对;
export const STOCKING_API_GOODS_ALLOT_ORDER_GOODS_RETURNCHECK = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_goods/ReturnCheck',
		method: 'post',
		data: parameters
	})
}
// 成品调拨入库单 - 检索;
export const STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_intake/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品调拨入库单 - 加载;
export const STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_intake/Get',
		method: 'get',
		params: parameters
	})
}
// 成品调拨入库单 - 加载;
export const STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_REQ = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_intake/Req',
		method: 'get',
		params: parameters
	})
}
// 成品调拨入库单 - 批量收货;
export const STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_RECEIVES = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_intake/Receives',
		method: 'post',
		data: parameters
	})
}
// 成品调拨入库单 - 收货入库;
export const STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_RECEIVE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_intake/Receive',
		method: 'post',
		data: parameters
	})
}
// 成品调拨入库单 - 批量退回;
export const STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_RETURNS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_intake/Returns',
		method: 'post',
		data: parameters
	})
}
// 成品调拨入库单 - 退回;
export const STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_RETURN = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_intake/Return',
		method: 'post',
		data: parameters
	})
}
// 成品调拨出库单 - 检索;
export const STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_outake/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品调拨出库单 - 加载;
export const STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_outake/Get',
		method: 'get',
		params: parameters
	})
}
// 成品调拨出库单 - 创建;
export const STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_outake/Create',
		method: 'post',
		data: parameters
	})
}
// 成品调拨出库单 - 更新;
export const STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_outake/Update',
		method: 'post',
		data: parameters
	})
}
// 成品调拨出库单 - 待审核;
export const STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_outake/Wait',
		method: 'post',
		data: parameters
	})
}
// 成品调拨出库单 - 批量审核;
export const STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_outake/Audits',
		method: 'post',
		data: parameters
	})
}
// 成品调拨出库单 - 审核通过;
export const STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_outake/Audit',
		method: 'post',
		data: parameters
	})
}
// 成品调拨出库单 - 批量审核退回;
export const STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_outake/Rejects',
		method: 'post',
		data: parameters
	})
}
// 成品调拨出库单 - 审核退回;
export const STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_outake/Reject',
		method: 'post',
		data: parameters
	})
}
// 成品调拨出库单 - 作废;
export const STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_outake/Abandon',
		method: 'post',
		data: parameters
	})
}
// 成品调拨单款式明细 - 检索;
export const STOCKING_API_GOODS_ALLOT_ORDER_STYLE_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_style/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品调拨单款式明细 - 查看调拨出库单 (分货调拨);
export const STOCKING_API_GOODS_ALLOT_ORDER_STYLE_REQS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_allot_order_style/Reqs',
		method: 'get',
		params: parameters
	})
}
// 成品到货单 - 检索;
export const STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_arrive_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品到货单 - 加载;
export const STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_arrive_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 成品到货单 - 创建;
export const STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_arrive_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 成品到货单 - 更新;
export const STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_arrive_order_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 成品到货单 - 待审核;
export const STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_arrive_order_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 成品到货单 - 批量审核;
export const STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_arrive_order_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 成品到货单 - 审核;
export const STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_arrive_order_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 成品到货单 - 批量审核退回;
export const STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_arrive_order_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 成品到货单 - 审核退回;
export const STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_arrive_order_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 成品到货单 - 作废;
export const STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_arrive_order_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 成品到货单 - 取消;
export const STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_arrive_order_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 成品到货单明细 - 检索;
export const STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_arrive_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品到货单明细 - 加载;
export const STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_arrive_order_item/Get',
		method: 'get',
		params: parameters
	})
}
// 成品到货单明细 - 创建;
export const STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_arrive_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 成品到货单明细 - 导入(模板导入);
export const STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_TIMPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_arrive_order_item/Timport',
		method: 'post',
		data: parameters
	})
}
// 成品到货单明细 - 导入(智能导入);
export const STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_AIMPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_arrive_order_item/Aimport',
		method: 'post',
		data: parameters
	})
}
// 成品到货单明细 - 更新;
export const STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_arrive_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 成品到货单明细 - 删除;
export const STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_arrive_order_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 成品到货单明细 - 导出货品详情(查询结果);
export const STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_EXPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_arrive_order_item/Export',
		method: 'post',
		data: parameters
	})
}
// 成品资料(条码) - 检索;
export const STOCKING_API_GOODS_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 检索(查价 总部所有货品,包含门店的货品);
export const STOCKING_API_GOODS_BASIC_REQS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_basic/Reqs',
		method: 'get',
		params: parameters
	})
}
// 成品资料(条码) - 加载;
export const STOCKING_API_GOODS_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 成品资料(条码) - 根据条码查询;
export const STOCKING_API_GOODS_BASIC_FIND = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_basic/Find',
		method: 'get',
		params: parameters
	})
}
// 成品盘点单 - 检索;
export const STOCKING_API_GOODS_COUNT_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品盘点单 - 加载;
export const STOCKING_API_GOODS_COUNT_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 成品盘点单 - 创建;
export const STOCKING_API_GOODS_COUNT_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 成品盘点单 - 结束盘点;
export const STOCKING_API_GOODS_COUNT_ORDER_BASIC_FINISH = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_order_basic/Finish',
		method: 'post',
		data: parameters
	})
}
// 成品盘点单 - 取消盘点;
export const STOCKING_API_GOODS_COUNT_ORDER_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_order_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 成品盘点单 - 重新盘点;
export const STOCKING_API_GOODS_COUNT_ORDER_BASIC_RETAKE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_order_basic/Retake',
		method: 'post',
		data: parameters
	})
}
// 成品盘点单位置明细 - 检索;
export const STOCKING_API_GOODS_COUNT_ORDER_DELF_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_order_delf/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品盘点单货品明细 - 检索;
export const STOCKING_API_GOODS_COUNT_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品盘点单货品明细 - 结束盘点(报损);
export const STOCKING_API_GOODS_COUNT_ORDER_ITEM_FINISHLOSSGETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_order_item/FinishLossGets',
		method: 'get',
		params: parameters
	})
}
// 成品盘点单货品明细 - 结束盘点(报溢);
export const STOCKING_API_GOODS_COUNT_ORDER_ITEM_FINISHOVERGETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_order_item/FinishOverGets',
		method: 'get',
		params: parameters
	})
}
// 成品盘点单货品明细 - 创建;
export const STOCKING_API_GOODS_COUNT_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 成品盘点单货品明细 - 更新;
export const STOCKING_API_GOODS_COUNT_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 成品盘点单货品明细 - 盘点贴士列表;
export const STOCKING_API_GOODS_COUNT_ORDER_ITEM_GETSTIPS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_order_item/GetsTips',
		method: 'get',
		params: parameters
	})
}
// 成品盘点单货品明细 - 修正盘点列表;
export const STOCKING_API_GOODS_COUNT_ORDER_ITEM_DIFFQTYLIST = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_order_item/DiffQtyList',
		method: 'get',
		params: parameters
	})
}
// 成品盘点单货品明细 - 修正盘点数量;
export const STOCKING_API_GOODS_COUNT_ORDER_ITEM_SAVEDIFFQTY = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_order_item/SaveDiffQty',
		method: 'post',
		data: parameters
	})
}
// 成品报损单 - 检索;
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品报溢单 - 检索;
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_GETS2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Gets2',
		method: 'get',
		params: parameters
	})
}
// 成品报损单 - 加载;
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 成品报溢单 - 加载;
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_GET2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Get2',
		method: 'get',
		params: parameters
	})
}
// 成品报损单 - 创建(手工创建);
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 成品报溢单 - 创建(手工创建);
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_CREATE2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Create2',
		method: 'post',
		data: parameters
	})
}
// 成品报损单 - 更新(手工更新);
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 成品报溢单 - 更新(手工更新);
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_UPDATE2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Update2',
		method: 'post',
		data: parameters
	})
}
// 成品报损单 - 提交审核(手工创建);
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 成品报溢单 - 提交审核(手工创建);
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_WAIT2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Wait2',
		method: 'post',
		data: parameters
	})
}
// 成品报损单 - 批量审核退回(手工创建);
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 成品报溢单 - 批量审核退回(手工创建);
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_REJECTS2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Rejects2',
		method: 'post',
		data: parameters
	})
}
// 成品报损单 - 审核退回(手工创建,盘点来的变成作废状态, 报损需要改库存, 报溢不需要改库存);
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 成品报溢单 - 审核退回(手工创建,盘点来的变成作废状态, 报损需要改库存, 报溢不需要改库存);
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_REJECT2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Reject2',
		method: 'post',
		data: parameters
	})
}
// 成品报损单 - 作废(手工创建);
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 成品报溢单 - 作废(手工创建);
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_ABANDON2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Abandon2',
		method: 'post',
		data: parameters
	})
}
// 成品报损单 - 批量审核通过(通用);
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 成品报溢单 - 批量审核通过(通用);
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_AUDITS2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Audits2',
		method: 'post',
		data: parameters
	})
}
// 成品报损单 - 审核通过(通用);
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 成品报溢单 - 审核通过(通用);
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_AUDIT2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Audit2',
		method: 'post',
		data: parameters
	})
}
// 成品报损单 - 取消审核(通用);
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 成品报溢单 - 取消审核(通用);
export const STOCKING_API_GOODS_COUNT_REPORT_BASIC_CANCEL2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_basic/Cancel2',
		method: 'post',
		data: parameters
	})
}
// 成品损溢单明细 - 检索;
export const STOCKING_API_GOODS_COUNT_REPORT_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品损溢单明细 - 创建(手工创建);
export const STOCKING_API_GOODS_COUNT_REPORT_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_item/Create',
		method: 'post',
		data: parameters
	})
}
// 成品损溢单明细 - 更新(手工创建);
export const STOCKING_API_GOODS_COUNT_REPORT_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_item/Update',
		method: 'post',
		data: parameters
	})
}
// 成品损溢单明细 - 删除(手工创建);
export const STOCKING_API_GOODS_COUNT_REPORT_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_count_report_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 成品进货入库单 - 检索;
export const STOCKING_API_GOODS_INTAKE_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_intake_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品进货入库单 - 加载;
export const STOCKING_API_GOODS_INTAKE_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_intake_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 成品进货入库单 - 创建;
export const STOCKING_API_GOODS_INTAKE_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_intake_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 成品进货入库单 - 更新;
export const STOCKING_API_GOODS_INTAKE_ORDER_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_intake_order_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 成品进货入库单 - 待审核;
export const STOCKING_API_GOODS_INTAKE_ORDER_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_intake_order_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 成品进货入库单 - 批量审核;
export const STOCKING_API_GOODS_INTAKE_ORDER_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_intake_order_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 成品进货入库单 - 审核;
export const STOCKING_API_GOODS_INTAKE_ORDER_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_intake_order_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 成品进货入库单 - 批量审核退回;
export const STOCKING_API_GOODS_INTAKE_ORDER_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_intake_order_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 成品进货入库单 - 审核退回;
export const STOCKING_API_GOODS_INTAKE_ORDER_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_intake_order_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 成品进货入库单 - 作废;
export const STOCKING_API_GOODS_INTAKE_ORDER_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_intake_order_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 成品进货入库单 - 取消;
export const STOCKING_API_GOODS_INTAKE_ORDER_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_intake_order_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 成品进货入库单明细 - 检索;
export const STOCKING_API_GOODS_INTAKE_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_intake_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品进货入库单明细 - 加载;
export const STOCKING_API_GOODS_INTAKE_ORDER_ITEM_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_intake_order_item/Get',
		method: 'get',
		params: parameters
	})
}
// 成品进货入库单明细 - 创建;
export const STOCKING_API_GOODS_INTAKE_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_intake_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 成品进货入库单明细 - 导入(模板导入);
export const STOCKING_API_GOODS_INTAKE_ORDER_ITEM_TIMPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_intake_order_item/Timport',
		method: 'post',
		data: parameters
	})
}
// 成品进货入库单明细 - 导入(智能导入);
export const STOCKING_API_GOODS_INTAKE_ORDER_ITEM_AIMPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_intake_order_item/Aimport',
		method: 'post',
		data: parameters
	})
}
// 成品进货入库单明细 - 更新;
export const STOCKING_API_GOODS_INTAKE_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_intake_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 成品进货入库单明细 - 删除;
export const STOCKING_API_GOODS_INTAKE_ORDER_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_intake_order_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 成品进货入库单明细 - 导出货品详情(查询结果);
export const STOCKING_API_GOODS_INTAKE_ORDER_ITEM_EXPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_intake_order_item/Export',
		method: 'post',
		data: parameters
	})
}
// 成品批量修改单(货品批量修改单) - 检索;
export const STOCKING_API_GOODS_MODIFY_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_modify_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品批量修改单(货品批量修改单) - 加载;
export const STOCKING_API_GOODS_MODIFY_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_modify_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 成品批量修改单(货品批量修改单) - 创建;
export const STOCKING_API_GOODS_MODIFY_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_modify_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 成品批量修改单(货品批量修改单) - 更新;
export const STOCKING_API_GOODS_MODIFY_ORDER_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_modify_order_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 成品批量修改单(货品批量修改单) - 待审核;
export const STOCKING_API_GOODS_MODIFY_ORDER_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_modify_order_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 成品批量修改单(货品批量修改单) - 批量审核;
export const STOCKING_API_GOODS_MODIFY_ORDER_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_modify_order_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 成品批量修改单(货品批量修改单) - 审核;
export const STOCKING_API_GOODS_MODIFY_ORDER_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_modify_order_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 成品批量修改单(货品批量修改单) - 批量审核退回;
export const STOCKING_API_GOODS_MODIFY_ORDER_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_modify_order_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 成品批量修改单(货品批量修改单) - 审核退回;
export const STOCKING_API_GOODS_MODIFY_ORDER_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_modify_order_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 成品批量修改单(货品批量修改单) - 作废;
export const STOCKING_API_GOODS_MODIFY_ORDER_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_modify_order_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 成品批量修改单明细 - 检索;
export const STOCKING_API_GOODS_MODIFY_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_modify_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品批量修改单明细 - 检索;
export const STOCKING_API_GOODS_MODIFY_ORDER_ITEM_REQS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_modify_order_item/Reqs',
		method: 'get',
		params: parameters
	})
}
// 成品批量修改单明细 - 加载;
export const STOCKING_API_GOODS_MODIFY_ORDER_ITEM_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_modify_order_item/Get',
		method: 'get',
		params: parameters
	})
}
// 成品批量修改单明细 - 加载;
export const STOCKING_API_GOODS_MODIFY_ORDER_ITEM_REQ = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_modify_order_item/Req',
		method: 'get',
		params: parameters
	})
}
// 成品批量修改单明细 - 创建;
export const STOCKING_API_GOODS_MODIFY_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_modify_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 成品批量修改单明细 - 提单创建;
export const STOCKING_API_GOODS_MODIFY_ORDER_ITEM_SELECTINTAKECREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_modify_order_item/SelectIntakeCreate',
		method: 'post',
		data: parameters
	})
}
// 成品批量修改单明细 - 导入;
export const STOCKING_API_GOODS_MODIFY_ORDER_ITEM_IMPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_modify_order_item/Import',
		method: 'post',
		data: parameters
	})
}
// 成品批量修改单明细 - 导出;
export const STOCKING_API_GOODS_MODIFY_ORDER_ITEM_EXPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_modify_order_item/Export',
		method: 'post',
		data: parameters
	})
}
// 成品批量修改单明细 - 更新;
export const STOCKING_API_GOODS_MODIFY_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_modify_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 成品批量修改单明细 - 删除;
export const STOCKING_API_GOODS_MODIFY_ORDER_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_modify_order_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 成品调价单 - 检索;
export const STOCKING_API_GOODS_PRICE_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_price_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品调价单 - 加载;
export const STOCKING_API_GOODS_PRICE_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_price_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 成品调价单 - 创建;
export const STOCKING_API_GOODS_PRICE_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_price_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 成品调价单 - 更新;
export const STOCKING_API_GOODS_PRICE_ORDER_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_price_order_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 成品调价单 - 待审核;
export const STOCKING_API_GOODS_PRICE_ORDER_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_price_order_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 成品调价单 - 批量审核;
export const STOCKING_API_GOODS_PRICE_ORDER_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_price_order_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 成品调价单 - 审核;
export const STOCKING_API_GOODS_PRICE_ORDER_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_price_order_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 成品调价单 - 批量审核退回;
export const STOCKING_API_GOODS_PRICE_ORDER_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_price_order_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 成品调价单 - 审核退回;
export const STOCKING_API_GOODS_PRICE_ORDER_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_price_order_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 成品调价单 - 作废;
export const STOCKING_API_GOODS_PRICE_ORDER_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_price_order_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 成品调价单明细 - 检索(支持调价记录);
export const STOCKING_API_GOODS_PRICE_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_price_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品调价单明细 - 调价记录;
export const STOCKING_API_GOODS_PRICE_ORDER_ITEM_REQS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_price_order_item/Reqs',
		method: 'get',
		params: parameters
	})
}
// 成品调价单明细 - 创建;
export const STOCKING_API_GOODS_PRICE_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_price_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 成品调价单明细 - 提单创建;
export const STOCKING_API_GOODS_PRICE_ORDER_ITEM_SELECTINTAKECREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_price_order_item/SelectIntakeCreate',
		method: 'post',
		data: parameters
	})
}
// 成品调价单明细 - 更新;
export const STOCKING_API_GOODS_PRICE_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_price_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 成品调价单明细 - 删除;
export const STOCKING_API_GOODS_PRICE_ORDER_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_price_order_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 成品调价单明细 - 导出查询结果;
export const STOCKING_API_GOODS_PRICE_ORDER_ITEM_EXPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_price_order_item/Export',
		method: 'post',
		data: parameters
	})
}
// 成品调价单明细 - 导出调价信息;
export const STOCKING_API_GOODS_PRICE_ORDER_ITEM_EXPORTITEM = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_price_order_item/ExportItem',
		method: 'post',
		data: parameters
	})
}
// 成品调价单明细 - 导入调价信息;
export const STOCKING_API_GOODS_PRICE_ORDER_ITEM_IMPORTITEM = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_price_order_item/ImportItem',
		method: 'post',
		data: parameters
	})
}
// 成品标签批量打印单 - 检索;
export const STOCKING_API_GOODS_PRINT_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_print_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品标签批量打印单 - 加载;
export const STOCKING_API_GOODS_PRINT_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_print_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 成品标签批量打印单 - 创建;
export const STOCKING_API_GOODS_PRINT_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_print_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 成品标签批量打印单 - 更新;
export const STOCKING_API_GOODS_PRINT_ORDER_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_print_order_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 成品标签批量打印单 - 批量标记已打印;
export const STOCKING_API_GOODS_PRINT_ORDER_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_print_order_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 成品标签批量打印单 - 标记已打印;
export const STOCKING_API_GOODS_PRINT_ORDER_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_print_order_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 成品标签批量打印单明细 - 检索;
export const STOCKING_API_GOODS_PRINT_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_print_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品标签批量打印单统计 - 检索;
export const STOCKING_API_GOODS_PRINT_ORDER_ITEM_QIRESCOUNT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_print_order_item/QiresCount',
		method: 'get',
		params: parameters
	})
}
// 成品标签批量打印单明细 - 创建;
export const STOCKING_API_GOODS_PRINT_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_print_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 成品标签批量打印单明细 - 更新;
export const STOCKING_API_GOODS_PRINT_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_print_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 成品标签批量打印单明细 - 提单创建(成品进货入库单);
export const STOCKING_API_GOODS_PRINT_ORDER_ITEM_SELECTINTAKECREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_print_order_item/SelectIntakeCreate',
		method: 'post',
		data: parameters
	})
}
// 成品标签批量打印单明细 - 提单创建(成品调价单);
export const STOCKING_API_GOODS_PRINT_ORDER_ITEM_SELECTPRICECREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_print_order_item/SelectPriceCreate',
		method: 'post',
		data: parameters
	})
}
// 成品标签批量打印单明细 - 提单创建(成品修改单);
export const STOCKING_API_GOODS_PRINT_ORDER_ITEM_SELECTMODIFYCREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_print_order_item/SelectModifyCreate',
		method: 'post',
		data: parameters
	})
}
// 成品标签批量打印单明细 - 删除;
export const STOCKING_API_GOODS_PRINT_ORDER_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_print_order_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 成品质检单 - 检索;
export const STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品鉴定送检 - 检索;
export const STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GETS2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_basic/Gets2',
		method: 'get',
		params: parameters
	})
}
// 成品证书录入 - 检索;
export const STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GETS3 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_basic/Gets3',
		method: 'get',
		params: parameters
	})
}
// 成品资料完善 - 检索;
export const STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GETS4 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_basic/Gets4',
		method: 'get',
		params: parameters
	})
}
// 成品资料核价 - 检索;
export const STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GETS5 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_basic/Gets5',
		method: 'get',
		params: parameters
	})
}
// 成品质检单 - 加载;
export const STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 成品质检单 - 提交质检(标记已/未完成, 成品质检、成品鉴定送检、成品证书录入、成品资料完善、成品核价);
export const STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_basic/Finish',
		method: 'post',
		data: parameters
	})
}
// 成品质检单 - 提交质检(标记已/未完成, 成品鉴定送检);
export const STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_basic/Finish2',
		method: 'post',
		data: parameters
	})
}
// 成品质检单 - 提交质检(标记已/未完成, 成品证书录入);
export const STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH3 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_basic/Finish3',
		method: 'post',
		data: parameters
	})
}
// 成品质检单 - 提交质检(标记已/未完成, 成品资料完善);
export const STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH4 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_basic/Finish4',
		method: 'post',
		data: parameters
	})
}
// 成品质检单 - 提交质检(标记已/未完成, 成品核价);
export const STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH5 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_basic/Finish5',
		method: 'post',
		data: parameters
	})
}
// 成品质检单明细 - 检索;
export const STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品质检单明细 - 加载;
export const STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_item/Get',
		method: 'get',
		params: parameters
	})
}
// 成品质检单明细 - 更新(质检);
export const STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATEWEEKQTY = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_item/UpdateWeekQty',
		method: 'post',
		data: parameters
	})
}
// 成品质检单明细 - 更新(送检);
export const STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATESEND = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_item/UpdateSend',
		method: 'post',
		data: parameters
	})
}
// 成品质检单明细 - 更新(证书录入);
export const STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATECERT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_item/UpdateCert',
		method: 'post',
		data: parameters
	})
}
// 成品质检单明细 - 更新(产品资料完善);
export const STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 成品质检单明细 - 删除(产品资料完善);
export const STOCKING_API_GOODS_QUALITY_ORDER_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 成品质检单明细 - 更新(核价);
export const STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATEPRICE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_item/UpdatePrice',
		method: 'post',
		data: parameters
	})
}
// 成品质检单明细 - 导出查询结果;
export const STOCKING_API_GOODS_QUALITY_ORDER_ITEM_EXPORTGETSRESULT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_item/ExportGetsResult',
		method: 'post',
		data: parameters
	})
}
// 成品质检单明细 产品资料完善 - 导出;
export const STOCKING_API_GOODS_QUALITY_ORDER_ITEM_EXPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_item/Export',
		method: 'post',
		data: parameters
	})
}
// 成品质检单明细 产品资料完善 - 导入(模板导入);
export const STOCKING_API_GOODS_QUALITY_ORDER_ITEM_TIMPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_item/Timport',
		method: 'post',
		data: parameters
	})
}
// 成品质检单明细 产品资料完善 - 导入(智能导入);
export const STOCKING_API_GOODS_QUALITY_ORDER_ITEM_AIMPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_quality_order_item/Aimport',
		method: 'post',
		data: parameters
	})
}
// 配货计划单资料 - 检索;
export const STOCKING_API_GOODS_REINF_PLAN_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_reinf_plan_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 配货计划单资料 - 加载;
export const STOCKING_API_GOODS_REINF_PLAN_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_reinf_plan_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 配货计划单资料 - 新建;
export const STOCKING_API_GOODS_REINF_PLAN_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_reinf_plan_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 配货计划单资料 - 编辑;
export const STOCKING_API_GOODS_REINF_PLAN_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_reinf_plan_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 配货计划单资料 - 提交审核;
export const STOCKING_API_GOODS_REINF_PLAN_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_reinf_plan_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 配货计划单资料 - 批量审核;
export const STOCKING_API_GOODS_REINF_PLAN_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_reinf_plan_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 配货计划单资料 - 审核通过;
export const STOCKING_API_GOODS_REINF_PLAN_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_reinf_plan_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 配货计划单资料 - 批量退回;
export const STOCKING_API_GOODS_REINF_PLAN_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_reinf_plan_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 配货计划单资料 - 审核退回;
export const STOCKING_API_GOODS_REINF_PLAN_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_reinf_plan_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 配货计划单资料 - 作废;
export const STOCKING_API_GOODS_REINF_PLAN_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_reinf_plan_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 配货计划单资料 - 取消审核;
export const STOCKING_API_GOODS_REINF_PLAN_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_reinf_plan_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 货计划单明细资料 - 检索;
export const STOCKING_API_GOODS_REINF_PLAN_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_reinf_plan_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 货计划单明细资料 - 新建;
export const STOCKING_API_GOODS_REINF_PLAN_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_reinf_plan_item/Create',
		method: 'post',
		data: parameters
	})
}
// 货计划单明细资料 - 编辑;
export const STOCKING_API_GOODS_REINF_PLAN_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_reinf_plan_item/Update',
		method: 'post',
		data: parameters
	})
}
// 货计划单明细资料 - 删除;
export const STOCKING_API_GOODS_REINF_PLAN_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_reinf_plan_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 配货计划-查看-货品列表 - 导出查询结果;
export const STOCKING_API_GOODS_REINF_PLAN_ITEM_EXPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_reinf_plan_item/Export',
		method: 'post',
		data: parameters
	})
}
// 成品维修单 - 检索;
export const STOCKING_API_GOODS_REPAIR_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_repair_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品维修单 - 加载;
export const STOCKING_API_GOODS_REPAIR_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_repair_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 成品维修单 - 创建;
export const STOCKING_API_GOODS_REPAIR_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_repair_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 成品维修单 - 更新;
export const STOCKING_API_GOODS_REPAIR_ORDER_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_repair_order_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 成品维修单 - 作废;
export const STOCKING_API_GOODS_REPAIR_ORDER_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_repair_order_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 成品维修单 - 维修处理;
export const STOCKING_API_GOODS_REPAIR_ORDER_BASIC_EXCUTEREPAIR = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_repair_order_basic/ExcuteRepair',
		method: 'post',
		data: parameters
	})
}
// 成品维修单 - 完成维修;
export const STOCKING_API_GOODS_REPAIR_ORDER_BASIC_FINISHREPAIR = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_repair_order_basic/FinishRepair',
		method: 'post',
		data: parameters
	})
}
// 成品维修单 - 收款;
export const STOCKING_API_GOODS_REPAIR_ORDER_BASIC_EXCUTEPAID = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_repair_order_basic/ExcutePaid',
		method: 'post',
		data: parameters
	})
}
// 成品维修单 - 返还货品;
export const STOCKING_API_GOODS_REPAIR_ORDER_BASIC_RETURN = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_repair_order_basic/Return',
		method: 'post',
		data: parameters
	})
}
// 成品维修单 - 撤回;
export const STOCKING_API_GOODS_REPAIR_ORDER_BASIC_PRESTATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_repair_order_basic/PreState',
		method: 'post',
		data: parameters
	})
}
// 成品维修单 - 导出;
export const STOCKING_API_GOODS_REPAIR_ORDER_BASIC_EXPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_repair_order_basic/Export',
		method: 'post',
		data: parameters
	})
}
// 成品退货出库单 - 检索;
export const STOCKING_API_GOODS_RETURN_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_return_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品退货出库单 - 加载;
export const STOCKING_API_GOODS_RETURN_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_return_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 成品退货出库单 - 创建;
export const STOCKING_API_GOODS_RETURN_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_return_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 成品退货出库单 - 更新;
export const STOCKING_API_GOODS_RETURN_ORDER_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_return_order_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 成品退货出库单 - 待审核;
export const STOCKING_API_GOODS_RETURN_ORDER_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_return_order_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 成品退货出库单 - 审核;
export const STOCKING_API_GOODS_RETURN_ORDER_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_return_order_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 成品退货出库单 - 批量审核退回;
export const STOCKING_API_GOODS_RETURN_ORDER_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_return_order_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 成品退货出库单 - 审核退回;
export const STOCKING_API_GOODS_RETURN_ORDER_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_return_order_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 成品退货出库单 - 作废;
export const STOCKING_API_GOODS_RETURN_ORDER_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_return_order_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 成品退货出库单 - 取消;
export const STOCKING_API_GOODS_RETURN_ORDER_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_return_order_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 成品退货单明细 - 检索;
export const STOCKING_API_GOODS_RETURN_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_return_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品退货单明细 - 加载;
export const STOCKING_API_GOODS_RETURN_ORDER_ITEM_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_return_order_item/Get',
		method: 'get',
		params: parameters
	})
}
// 成品退货单明细 - 创建;
export const STOCKING_API_GOODS_RETURN_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_return_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 成品退货单明细 - 提单创建;
export const STOCKING_API_GOODS_RETURN_ORDER_ITEM_SELECTINTAKECREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_return_order_item/SelectIntakeCreate',
		method: 'post',
		data: parameters
	})
}
// 成品退货单明细 - 更新;
export const STOCKING_API_GOODS_RETURN_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_return_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 成品退货单明细 - 删除;
export const STOCKING_API_GOODS_RETURN_ORDER_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_return_order_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 成品库存(某门店的柜台) - 检索;
export const STOCKING_API_GOODS_STOCK_DESK_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_stock_desk/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品库存(某门店的柜台) - 检索(弹框, 比如门店仓库报损报溢);
export const STOCKING_API_GOODS_STOCK_DESK_REQS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_stock_desk/Reqs',
		method: 'get',
		params: parameters
	})
}
// 成品库存(某门店的柜台) - 检索(收银台或者零售单);
export const STOCKING_API_GOODS_STOCK_DESK_QRIES = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_stock_desk/Qries',
		method: 'get',
		params: parameters
	})
}
// 成品库存(某门店的柜台) - 加载;
export const STOCKING_API_GOODS_STOCK_DESK_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_stock_desk/Get',
		method: 'get',
		params: parameters
	})
}
// 成品库存变化日志 - 检索;
export const STOCKING_API_GOODS_STOCK_LOG_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_stock_log/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品出入库记录 - 导出查询结果;
export const STOCKING_API_GOODS_STOCK_LOG_EXPORTGETSRESULT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_stock_log/ExportGetsResult',
		method: 'post',
		data: parameters
	})
}
// 成品库存(总部某分仓的货架) - 检索;
export const STOCKING_API_GOODS_STOCK_SHELF_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_stock_shelf/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品库存(总部某分仓的货架) - 检索(弹框, 比如总部货架报损报溢);
export const STOCKING_API_GOODS_STOCK_SHELF_REQS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_stock_shelf/Reqs',
		method: 'get',
		params: parameters
	})
}
// 成品库存(总部某分仓的货架) - 加载;
export const STOCKING_API_GOODS_STOCK_SHELF_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_stock_shelf/Get',
		method: 'get',
		params: parameters
	})
}
// 成品库存(总部分仓或门店库存) - 检索;
export const STOCKING_API_GOODS_STOCK_WAREHOUSE_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_stock_warehouse/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品库存(总部分仓或门店库存) - 检索;（无权限控制）;
export const STOCKING_API_GOODS_STOCK_WAREHOUSE_GETS2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_stock_warehouse/Gets2',
		method: 'get',
		params: parameters
	})
}
// 成品库存(总部分仓或门店库存) - 检索,合计;
export const STOCKING_API_GOODS_STOCK_WAREHOUSE_GETSTOTAL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_stock_warehouse/GetsTotal',
		method: 'get',
		params: parameters
	})
}
// 成品库存(总部分仓或门店库存) - 检索(查价);
export const STOCKING_API_GOODS_STOCK_WAREHOUSE_REQS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_stock_warehouse/Reqs',
		method: 'get',
		params: parameters
	})
}
// 检索(货品信息);
export const STOCKING_API_GOODS_STOCK_WAREHOUSE_GETSFORGOODS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_stock_warehouse/GetsForGoods',
		method: 'get',
		params: parameters
	})
}
// 待出库存的单据;
export const STOCKING_API_GOODS_STOCK_WAREHOUSE_REQOUTWAITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_stock_warehouse/ReqOutwaits',
		method: 'get',
		params: parameters
	})
}
// 成品库存(总部分仓或门店库存) - 配货建议;
export const STOCKING_API_GOODS_STOCK_WAREHOUSE_REINFSUGGESTGETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_stock_warehouse/ReinfSuggestGets',
		method: 'post',
		data: parameters
	})
}
// 成品库存(总部分仓或门店库存) - 配货建议,合计总价;
export const STOCKING_API_GOODS_STOCK_WAREHOUSE_REINFSUGGESTGETSTOTAL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_stock_warehouse/ReinfSuggestGetsTotal',
		method: 'post',
		data: parameters
	})
}
// 成品库存 - 导出查询结果;
export const STOCKING_API_GOODS_STOCK_WAREHOUSE_EXPORTGETSRESULT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_stock_warehouse/ExportGetsResult',
		method: 'post',
		data: parameters
	})
}
// 成品库存 - 导出货品信息;
export const STOCKING_API_GOODS_STOCK_WAREHOUSE_EXPORTGETSGOODS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_stock_warehouse/ExportGetsGoods',
		method: 'post',
		data: parameters
	})
}
// 成品库存 - 导出配货建议;
export const STOCKING_API_GOODS_STOCK_WAREHOUSE_EXPORTREINFSUGGESTGETSRESULT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/goods_stock_warehouse/ExportReinfSuggestGetsResult',
		method: 'post',
		data: parameters
	})
}
// 半成品调拨入库单 - 检索;
export const STOCKING_API_HALF_ALLOT_ORDER_INTAKE_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_intake/Gets',
		method: 'get',
		params: parameters
	})
}
// 半成品调拨入库单 - 加载;
export const STOCKING_API_HALF_ALLOT_ORDER_INTAKE_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_intake/Get',
		method: 'get',
		params: parameters
	})
}
// 半成品调拨入库单 - 加载;
export const STOCKING_API_HALF_ALLOT_ORDER_INTAKE_REQ = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_intake/Req',
		method: 'get',
		params: parameters
	})
}
// 半成品调拨入库单 - 批量收货入库;
export const STOCKING_API_HALF_ALLOT_ORDER_INTAKE_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_intake/Audits',
		method: 'post',
		data: parameters
	})
}
// 半成品调拨入库单 - 收货入库;
export const STOCKING_API_HALF_ALLOT_ORDER_INTAKE_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_intake/Audit',
		method: 'post',
		data: parameters
	})
}
// 半成品调拨入库单 - 批量退回;
export const STOCKING_API_HALF_ALLOT_ORDER_INTAKE_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_intake/Rejects',
		method: 'post',
		data: parameters
	})
}
// 半成品调拨入库单 - 审核退回;
export const STOCKING_API_HALF_ALLOT_ORDER_INTAKE_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_intake/Reject',
		method: 'post',
		data: parameters
	})
}
// 半成品调拨单明细 - 检索;
export const STOCKING_API_HALF_ALLOT_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 半成品调拨单明细 - 创建;
export const STOCKING_API_HALF_ALLOT_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 半成品调拨单明细 - 提单创建;
export const STOCKING_API_HALF_ALLOT_ORDER_ITEM_SELECTINTAKECREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_item/SelectIntakeCreate',
		method: 'post',
		data: parameters
	})
}
// 半成品调拨单明细 - 更新;
export const STOCKING_API_HALF_ALLOT_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 半成品调拨单明细 - 删除;
export const STOCKING_API_HALF_ALLOT_ORDER_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 半成品调拨出库单 - 检索;
export const STOCKING_API_HALF_ALLOT_ORDER_OUTAKE_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_outake/Gets',
		method: 'get',
		params: parameters
	})
}
// 半成品调拨出库单 - 加载;
export const STOCKING_API_HALF_ALLOT_ORDER_OUTAKE_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_outake/Get',
		method: 'get',
		params: parameters
	})
}
// 半成品调拨出库单 - 创建;
export const STOCKING_API_HALF_ALLOT_ORDER_OUTAKE_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_outake/Create',
		method: 'post',
		data: parameters
	})
}
// 半成品调拨出库单 - 更新;
export const STOCKING_API_HALF_ALLOT_ORDER_OUTAKE_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_outake/Update',
		method: 'post',
		data: parameters
	})
}
// 半成品调拨出库单 - 待审核;
export const STOCKING_API_HALF_ALLOT_ORDER_OUTAKE_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_outake/Wait',
		method: 'post',
		data: parameters
	})
}
// 半成品调拨出库单 - 批量审核;
export const STOCKING_API_HALF_ALLOT_ORDER_OUTAKE_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_outake/Audits',
		method: 'post',
		data: parameters
	})
}
// 半成品调拨出库单 - 审核;
export const STOCKING_API_HALF_ALLOT_ORDER_OUTAKE_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_outake/Audit',
		method: 'post',
		data: parameters
	})
}
// 半成品调拨出库单 - 批量审核退回;
export const STOCKING_API_HALF_ALLOT_ORDER_OUTAKE_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_outake/Rejects',
		method: 'post',
		data: parameters
	})
}
// 半成品调拨出库单 - 审核退回;
export const STOCKING_API_HALF_ALLOT_ORDER_OUTAKE_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_outake/Reject',
		method: 'post',
		data: parameters
	})
}
// 半成品调拨出库单 - 作废;
export const STOCKING_API_HALF_ALLOT_ORDER_OUTAKE_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_allot_order_outake/Abandon',
		method: 'post',
		data: parameters
	})
}
// 半成品资料 - 检索;
export const STOCKING_API_HALF_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 半成品资料 - 加载;
export const STOCKING_API_HALF_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 半成品资料 - 创建;
export const STOCKING_API_HALF_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 半成品资料 - 更新;
export const STOCKING_API_HALF_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 半成品资料 - 启用;
export const STOCKING_API_HALF_BASIC_ENABLE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_basic/Enable',
		method: 'post',
		data: parameters
	})
}
// 半成品资料 - 停用;
export const STOCKING_API_HALF_BASIC_DISABLE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_basic/Disable',
		method: 'post',
		data: parameters
	})
}
// 半成品分秤单(半成品转成品单) - 检索;
export const STOCKING_API_HALF_CHANGE_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 半成品分秤单(半成品转成品单) - 加载;
export const STOCKING_API_HALF_CHANGE_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 半成品分秤单(半成品转成品单) - 创建;
export const STOCKING_API_HALF_CHANGE_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 半成品分秤单(半成品转成品单) - 更新;
export const STOCKING_API_HALF_CHANGE_ORDER_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 半成品分秤单(半成品转成品单) - 待审核;
export const STOCKING_API_HALF_CHANGE_ORDER_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 半成品分秤单(半成品转成品单) - 批量审核;
export const STOCKING_API_HALF_CHANGE_ORDER_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 半成品分秤单(半成品转成品单) - 审核;
export const STOCKING_API_HALF_CHANGE_ORDER_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 半成品分秤单(半成品转成品单) - 批量审核退回;
export const STOCKING_API_HALF_CHANGE_ORDER_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 半成品分秤单(半成品转成品单) - 审核退回;
export const STOCKING_API_HALF_CHANGE_ORDER_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 半成品分秤单(半成品转成品单) - 作废;
export const STOCKING_API_HALF_CHANGE_ORDER_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 半成品分秤单(半成品转成品单) - 取消;
export const STOCKING_API_HALF_CHANGE_ORDER_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 半成品分秤单成品明细(半成品转成品单) - 检索;
export const STOCKING_API_HALF_CHANGE_ORDER_GOODS_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_goods/Gets',
		method: 'get',
		params: parameters
	})
}
// 半成品分秤单成品明细(半成品转成品单) - 加载;
export const STOCKING_API_HALF_CHANGE_ORDER_GOODS_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_goods/Get',
		method: 'get',
		params: parameters
	})
}
// 半成品分秤单成品明细(半成品转成品单) - 创建;
export const STOCKING_API_HALF_CHANGE_ORDER_GOODS_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_goods/Create',
		method: 'post',
		data: parameters
	})
}
// 半成品分秤单成品明细(半成品转成品单) - 更新;
export const STOCKING_API_HALF_CHANGE_ORDER_GOODS_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_goods/Update',
		method: 'post',
		data: parameters
	})
}
// 半成品分秤单成品明细(半成品转成品单) - 删除;
export const STOCKING_API_HALF_CHANGE_ORDER_GOODS_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_goods/Delete',
		method: 'post',
		data: parameters
	})
}
// 半成品分秤单成品明细 - 导出货品详情(导出明细列表);
export const STOCKING_API_HALF_CHANGE_ORDER_GOODS_EXPORTGETSRESULT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_goods/ExportGetsResult',
		method: 'post',
		data: parameters
	})
}
// 半成品分秤单成品明细 - 导入(模板导入);
export const STOCKING_API_HALF_CHANGE_ORDER_GOODS_TIMPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_goods/Timport',
		method: 'post',
		data: parameters
	})
}
// 半成品分秤单成品明细 - 导入(智能导入);
export const STOCKING_API_HALF_CHANGE_ORDER_GOODS_AIMPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_goods/Aimport',
		method: 'post',
		data: parameters
	})
}
// 半成品分秤单半成品明细(半成品转成品单) - 检索;
export const STOCKING_API_HALF_CHANGE_ORDER_HALF_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_half/Gets',
		method: 'get',
		params: parameters
	})
}
// 半成品分秤单半成品明细(半成品转成品单) - 创建;
export const STOCKING_API_HALF_CHANGE_ORDER_HALF_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_half/Create',
		method: 'post',
		data: parameters
	})
}
// 半成品分秤单半成品明细(半成品转成品单) - 删除;
export const STOCKING_API_HALF_CHANGE_ORDER_HALF_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_change_order_half/Delete',
		method: 'post',
		data: parameters
	})
}
// 半成品盘点单 - 检索;
export const STOCKING_API_HALF_COUNT_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 半成品盘点单 - 加载;
export const STOCKING_API_HALF_COUNT_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 半成品盘点单 - 创建;
export const STOCKING_API_HALF_COUNT_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 半成品盘点单 - 结束盘点;
export const STOCKING_API_HALF_COUNT_ORDER_BASIC_FINISH = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_order_basic/Finish',
		method: 'post',
		data: parameters
	})
}
// 半成品盘点单 - 取消盘点;
export const STOCKING_API_HALF_COUNT_ORDER_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_order_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 半成品盘点单 - 重新盘点;
export const STOCKING_API_HALF_COUNT_ORDER_BASIC_RETAKE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_order_basic/Retake',
		method: 'post',
		data: parameters
	})
}
// 半成品盘点单位置 - 检索;
export const STOCKING_API_HALF_COUNT_ORDER_DELF_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_order_delf/Gets',
		method: 'get',
		params: parameters
	})
}
// 半成品盘点单明细 - 检索;
export const STOCKING_API_HALF_COUNT_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 半成品盘点单明细 - 结束盘点(报损);
export const STOCKING_API_HALF_COUNT_ORDER_ITEM_FINISHLOSSGETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_order_item/FinishLossGets',
		method: 'get',
		params: parameters
	})
}
// 半成品盘点单明细 - 结束盘点(报溢);
export const STOCKING_API_HALF_COUNT_ORDER_ITEM_FINISHOVERGETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_order_item/FinishOverGets',
		method: 'get',
		params: parameters
	})
}
// 半成品盘点单明细 - 创建;
export const STOCKING_API_HALF_COUNT_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 半成品盘点单明细 - 更新;
export const STOCKING_API_HALF_COUNT_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 半成品报损单 - 检索;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 半成品报溢单 - 检索;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_GETS2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Gets2',
		method: 'get',
		params: parameters
	})
}
// 半成品报损单 - 加载;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 半成品报溢单 - 加载;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_GET2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Get2',
		method: 'get',
		params: parameters
	})
}
// 半成品报损单 - 创建;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 半成品报溢单 - 创建;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_CREATE2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Create2',
		method: 'post',
		data: parameters
	})
}
// 半成品报损单 - 更新;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 半成品报溢单 - 更新;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_UPDATE2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Update2',
		method: 'post',
		data: parameters
	})
}
// 半成品报损单 - 待审核;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 半成品报溢单 - 待审核;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_WAIT2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Wait2',
		method: 'post',
		data: parameters
	})
}
// 半成品报损单 - 批量审核;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 半成品报溢单 - 批量审核;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_AUDITS2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Audits2',
		method: 'post',
		data: parameters
	})
}
// 半成品报损单 - 审核;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 半成品报溢单 - 审核;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_AUDIT2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Audit2',
		method: 'post',
		data: parameters
	})
}
// 半成品报损单 - 批量审核退回;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 半成品报溢单 - 批量审核退回;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_REJECTS2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Rejects2',
		method: 'post',
		data: parameters
	})
}
// 半成品报损单 - 审核退回;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 半成品报溢单 - 审核退回;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_REJECT2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Reject2',
		method: 'post',
		data: parameters
	})
}
// 半成品报损单 - 作废;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 半成品报溢单 - 作废;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_ABANDON2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Abandon2',
		method: 'post',
		data: parameters
	})
}
// 半成品损溢单 - 取消;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 半成品报溢单 - 取消;
export const STOCKING_API_HALF_COUNT_REPORT_BASIC_CANCEL2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_basic/Cancel2',
		method: 'post',
		data: parameters
	})
}
// 半成品损溢单明细 - 检索;
export const STOCKING_API_HALF_COUNT_REPORT_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 半成品损溢单明细 - 创建;
export const STOCKING_API_HALF_COUNT_REPORT_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_item/Create',
		method: 'post',
		data: parameters
	})
}
// 半成品损溢单明细 - 更新;
export const STOCKING_API_HALF_COUNT_REPORT_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_item/Update',
		method: 'post',
		data: parameters
	})
}
// 半成品损溢单明细 - 删除;
export const STOCKING_API_HALF_COUNT_REPORT_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_count_report_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 半成品整包入库单 - 检索;
export const STOCKING_API_HALF_INTAKE_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 半成品质检 - 检索;
export const STOCKING_API_HALF_INTAKE_ORDER_BASIC_GETS1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_basic/Gets1',
		method: 'get',
		params: parameters
	})
}
// 半成品整包入库单 - 加载;
export const STOCKING_API_HALF_INTAKE_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 半成品整包入库单 - 创建;
export const STOCKING_API_HALF_INTAKE_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 半成品整包入库单 - 更新;
export const STOCKING_API_HALF_INTAKE_ORDER_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 半成品整包入库单 - 待审核;
export const STOCKING_API_HALF_INTAKE_ORDER_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 半成品整包入库单 - 批量审核;
export const STOCKING_API_HALF_INTAKE_ORDER_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 半成品整包入库单 - 审核;
export const STOCKING_API_HALF_INTAKE_ORDER_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 半成品整包入库单 - 批量审核退回;
export const STOCKING_API_HALF_INTAKE_ORDER_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 半成品整包入库单 - 审核退回;
export const STOCKING_API_HALF_INTAKE_ORDER_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 半成品整包入库单 - 作废;
export const STOCKING_API_HALF_INTAKE_ORDER_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 半成品整包入库单 - 取消;
export const STOCKING_API_HALF_INTAKE_ORDER_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 半成品整包入库单 - 半成品质检(标记完成质检);
export const STOCKING_API_HALF_INTAKE_ORDER_BASIC_FINISHQUALITY = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_basic/FinishQuality',
		method: 'post',
		data: parameters
	})
}
// 半成品整包入库单 - 半成品质检(标记未完成质检);
export const STOCKING_API_HALF_INTAKE_ORDER_BASIC_WAITQUALITY = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_basic/WaitQuality',
		method: 'post',
		data: parameters
	})
}
// 半成品整包入库单 - 半成品质检(标记取消质检);
export const STOCKING_API_HALF_INTAKE_ORDER_BASIC_CANCELQUALITY = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_basic/CancelQuality',
		method: 'post',
		data: parameters
	})
}
// 半成品整包入库单明细 - 检索;
export const STOCKING_API_HALF_INTAKE_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 半成品整包入库单明细 - 创建;
export const STOCKING_API_HALF_INTAKE_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 半成品整包入库单明细 - 更新;
export const STOCKING_API_HALF_INTAKE_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 半成品整包入库单明细 - 删除;
export const STOCKING_API_HALF_INTAKE_ORDER_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 半成品整包入库单明细 - 半成品质检;
export const STOCKING_API_HALF_INTAKE_ORDER_ITEM_QUALITY = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_item/Quality',
		method: 'post',
		data: parameters
	})
}
// 半成品整包入库单明细(半成品质检) - 导出查询结果;
export const STOCKING_API_HALF_INTAKE_ORDER_ITEM_EXPORTGETSRESULT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_item/ExportGetsResult',
		method: 'post',
		data: parameters
	})
}
// 半成品整包入库单明细 - 导出货品信息;
export const STOCKING_API_HALF_INTAKE_ORDER_ITEM_EXPORTGETSHALF = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_intake_order_item/ExportGetsHalf',
		method: 'post',
		data: parameters
	})
}
// 半成品退货单 - 检索;
export const STOCKING_API_HALF_RETURN_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_return_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 半成品退货单 - 加载;
export const STOCKING_API_HALF_RETURN_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_return_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 半成品退货单 - 创建;
export const STOCKING_API_HALF_RETURN_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_return_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 半成品退货单 - 更新;
export const STOCKING_API_HALF_RETURN_ORDER_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_return_order_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 半成品退货单 - 待审核;
export const STOCKING_API_HALF_RETURN_ORDER_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_return_order_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 半成品退货单 - 批量审核;
export const STOCKING_API_HALF_RETURN_ORDER_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_return_order_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 半成品退货单 - 审核;
export const STOCKING_API_HALF_RETURN_ORDER_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_return_order_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 半成品退货单 - 批量审核退回;
export const STOCKING_API_HALF_RETURN_ORDER_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_return_order_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 半成品退货单 - 审核退回;
export const STOCKING_API_HALF_RETURN_ORDER_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_return_order_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 半成品退货单 - 作废;
export const STOCKING_API_HALF_RETURN_ORDER_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_return_order_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 半成品退货单 - 取消;
export const STOCKING_API_HALF_RETURN_ORDER_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_return_order_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 半成品退货明细 - 检索;
export const STOCKING_API_HALF_RETURN_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_return_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 半成品退货明细 - 加载;
export const STOCKING_API_HALF_RETURN_ORDER_ITEM_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_return_order_item/Get',
		method: 'get',
		params: parameters
	})
}
// 半成品退货明细 - 提单创建;
export const STOCKING_API_HALF_RETURN_ORDER_ITEM_SELECTINTAKECREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_return_order_item/SelectIntakeCreate',
		method: 'post',
		data: parameters
	})
}
// 半成品退货明细 - 创建;
export const STOCKING_API_HALF_RETURN_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_return_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 半成品退货明细 - 更新;
export const STOCKING_API_HALF_RETURN_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_return_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 半成品退货明细 - 删除;
export const STOCKING_API_HALF_RETURN_ORDER_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_return_order_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 半成品退货明细 - 导出货品信息;
export const STOCKING_API_HALF_RETURN_ORDER_ITEM_EXPORTGETSHALF = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_return_order_item/ExportGetsHalf',
		method: 'post',
		data: parameters
	})
}
// 半成品库存变化日志 - 检索;
export const STOCKING_API_HALF_STOCK_LOG_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_stock_log/Gets',
		method: 'get',
		params: parameters
	})
}
// 半成品库存(总部某分仓的货架) - 检索(单个半成品的仓储位置);
export const STOCKING_API_HALF_STOCK_SHELF_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_stock_shelf/Gets',
		method: 'get',
		params: parameters
	})
}
// 半成品库存(总部某分仓的货架) - 弹窗;
export const STOCKING_API_HALF_STOCK_SHELF_REQS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_stock_shelf/Reqs',
		method: 'get',
		params: parameters
	})
}
// 半成品库存(总部分仓) - 检索;
export const STOCKING_API_HALF_STOCK_WAREHOUSE_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_stock_warehouse/Gets',
		method: 'get',
		params: parameters
	})
}
// 半成品库存(总部分仓) - 检索,合计;
export const STOCKING_API_HALF_STOCK_WAREHOUSE_GETSTOTAL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_stock_warehouse/GetsTotal',
		method: 'get',
		params: parameters
	})
}
// 半成品库存(总部分仓) - 导出查询结果;
export const STOCKING_API_HALF_STOCK_WAREHOUSE_EXPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/half_stock_warehouse/Export',
		method: 'post',
		data: parameters
	})
}
// 旧货调拨入库单 - 检索;
export const STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_allot_order_intake/Gets',
		method: 'get',
		params: parameters
	})
}
// 旧货调拨入库单 - 加载;
export const STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_REQ = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_allot_order_intake/Req',
		method: 'get',
		params: parameters
	})
}
// 旧货调拨入库单 - 批量退回;
export const STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_RETURNS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_allot_order_intake/Returns',
		method: 'post',
		data: parameters
	})
}
// 旧货调拨入库单 - 退回;
export const STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_RETURN = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_allot_order_intake/Return',
		method: 'post',
		data: parameters
	})
}
// 旧货调拨入库单 - 收货入库;
export const STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_RECEIVES = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_allot_order_intake/Receives',
		method: 'post',
		data: parameters
	})
}
// 旧货调拨入库单 - 收货入库;
export const STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_RECEIVE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_allot_order_intake/Receive',
		method: 'post',
		data: parameters
	})
}
// 旧货调拨单明细 - 检索;
export const STOCKING_API_JUNK_ALLOT_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_allot_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 旧货调拨单明细 - 创建;
export const STOCKING_API_JUNK_ALLOT_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_allot_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 旧货调拨单明细 - 更新;
export const STOCKING_API_JUNK_ALLOT_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_allot_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 旧货调拨单明细 - 删除;
export const STOCKING_API_JUNK_ALLOT_ORDER_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_allot_order_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 旧货调拨出库单 - 检索;
export const STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_allot_order_outake/Gets',
		method: 'get',
		params: parameters
	})
}
// 旧货调拨出库单 - 加载数据库;
export const STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_allot_order_outake/Get',
		method: 'get',
		params: parameters
	})
}
// 旧货调拨出库单 - 创建;
export const STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_allot_order_outake/Create',
		method: 'post',
		data: parameters
	})
}
// 旧货调拨出库单 - 更新;
export const STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_allot_order_outake/Update',
		method: 'post',
		data: parameters
	})
}
// 旧货调拨出库单 - 提交审核;
export const STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_allot_order_outake/Wait',
		method: 'post',
		data: parameters
	})
}
// 旧货调拨出库单 - 批量审核通过;
export const STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_allot_order_outake/Audits',
		method: 'post',
		data: parameters
	})
}
// 旧货调拨出库单 - 审核通过;
export const STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_allot_order_outake/Audit',
		method: 'post',
		data: parameters
	})
}
// 旧货调拨出库单 - 批量审核退回;
export const STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_allot_order_outake/Rejects',
		method: 'post',
		data: parameters
	})
}
// 旧货调拨出库单 - 审核退回;
export const STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_allot_order_outake/Reject',
		method: 'post',
		data: parameters
	})
}
// 旧货调拨出库单 - 作废;
export const STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_allot_order_outake/Abandon',
		method: 'post',
		data: parameters
	})
}
// 旧货资料 - 加载;
export const STOCKING_API_JUNK_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 旧货转成品 - 检索;
export const STOCKING_API_JUNK_CHANGE_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_change_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 旧货转成品 - 详情;
export const STOCKING_API_JUNK_CHANGE_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_change_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 旧货转成品 - 创建;
export const STOCKING_API_JUNK_CHANGE_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_change_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 旧货转成品 - 更新;
export const STOCKING_API_JUNK_CHANGE_ORDER_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_change_order_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 旧货转成品 - 提交审核;
export const STOCKING_API_JUNK_CHANGE_ORDER_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_change_order_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 旧货转成品 - 批量审核;
export const STOCKING_API_JUNK_CHANGE_ORDER_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_change_order_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 旧货转成品 - 审核通过;
export const STOCKING_API_JUNK_CHANGE_ORDER_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_change_order_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 旧货转成品 - 批量审核退回;
export const STOCKING_API_JUNK_CHANGE_ORDER_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_change_order_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 旧货转成品 - 审核退回;
export const STOCKING_API_JUNK_CHANGE_ORDER_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_change_order_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 旧货转成品 - 作废;
export const STOCKING_API_JUNK_CHANGE_ORDER_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_change_order_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 旧货转成品 - 取消;
export const STOCKING_API_JUNK_CHANGE_ORDER_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_change_order_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 旧货转成品明细 - 检索;
export const STOCKING_API_JUNK_CHANGE_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_change_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 旧货转成品明细 - 加载;
export const STOCKING_API_JUNK_CHANGE_ORDER_ITEM_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_change_order_item/Get',
		method: 'get',
		params: parameters
	})
}
// 旧货转成品明细 - 创建;
export const STOCKING_API_JUNK_CHANGE_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_change_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 旧货转成品明细 - 更新;
export const STOCKING_API_JUNK_CHANGE_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_change_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 旧货转成品明细 - 删除;
export const STOCKING_API_JUNK_CHANGE_ORDER_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_change_order_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 旧货转成品明细 - 导出;
export const STOCKING_API_JUNK_CHANGE_ORDER_ITEM_EXPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_change_order_item/Export',
		method: 'post',
		data: parameters
	})
}
// 旧货位置变化日志 - 检索;
export const STOCKING_API_JUNK_LOG_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_log/Gets',
		method: 'get',
		params: parameters
	})
}
// 旧货其它出库单 - 检索;
export const STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_outake_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 旧货其它出库单 - 加载;
export const STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_outake_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 旧货其它出库单 - 创建;
export const STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_outake_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 旧货其它出库单 - 更新;
export const STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_outake_order_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 旧货其它出库单 - 提交审核;
export const STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_outake_order_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 旧货其它出库单 - 批量审核通过;
export const STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_outake_order_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 旧货其它出库单 - 审核通过;
export const STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_outake_order_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 旧货其它出库单 - 批量审核退回;
export const STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_outake_order_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 旧货其它出库单 - 审核退回;
export const STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_outake_order_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 旧货其它出库单 - 取消;
export const STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_outake_order_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 旧货其它出库单 - 作废;
export const STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_outake_order_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 旧货其它出库单明细 - 检索;
export const STOCKING_API_JUNK_OUTAKE_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_outake_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 旧货其它出库单明细 - 创建;
export const STOCKING_API_JUNK_OUTAKE_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_outake_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 旧货其它出库单明细 - 删除;
export const STOCKING_API_JUNK_OUTAKE_ORDER_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_outake_order_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 旧货打印单 - 检索;
export const STOCKING_API_JUNK_PRINT_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_print_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 旧货打印单 - 加载;
export const STOCKING_API_JUNK_PRINT_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_print_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 旧货打印单 - 创建;
export const STOCKING_API_JUNK_PRINT_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_print_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 旧货打印单 - 更新;
export const STOCKING_API_JUNK_PRINT_ORDER_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_print_order_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 旧货打印单 - 批量标记打印;
export const STOCKING_API_JUNK_PRINT_ORDER_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_print_order_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 旧货打印单 - 标记打印;
export const STOCKING_API_JUNK_PRINT_ORDER_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_print_order_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 旧货打印单明细 - 检索;
export const STOCKING_API_JUNK_PRINT_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_print_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 旧货打印单明细 - 创建;
export const STOCKING_API_JUNK_PRINT_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_print_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 旧货打印单明细 - 更新;
export const STOCKING_API_JUNK_PRINT_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_print_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 旧货打印单明细 - 删除;
export const STOCKING_API_JUNK_PRINT_ORDER_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_print_order_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 旧货轨迹(我的旧货) - 检索(旧货库存);
export const STOCKING_API_JUNK_TRACE_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_trace/Gets',
		method: 'get',
		params: parameters
	})
}
// 旧货轨迹(我的旧货) - 检索(旧货库存)-页面中选择旧货不需要权限;
export const STOCKING_API_JUNK_TRACE_GETS2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_trace/Gets2',
		method: 'get',
		params: parameters
	})
}
// 旧货轨迹(我的旧货) - 检索(统计);
export const STOCKING_API_JUNK_TRACE_GETSTOTAL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_trace/GetsTotal',
		method: 'get',
		params: parameters
	})
}
// 旧货轨迹(我的旧货) - 加载;
export const STOCKING_API_JUNK_TRACE_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_trace/Get',
		method: 'get',
		params: parameters
	})
}
// - 导出;
export const STOCKING_API_JUNK_TRACE_EXPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/junk_trace/Export',
		method: 'post',
		data: parameters
	})
}
// 往来单位资料表 - 检索;
export const STOCKING_API_PARTNER_BALANCE_LOG_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/partner_balance_log/Gets',
		method: 'get',
		params: parameters
	})
}
// 往来单位余额账户 - 充值;
export const STOCKING_API_PARTNER_BALANCE_RECHARGE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/partner_balance/Recharge',
		method: 'post',
		data: parameters
	})
}
// 往来单位余额账户 - 提现;
export const STOCKING_API_PARTNER_BALANCE_CASH = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/partner_balance/Cash',
		method: 'post',
		data: parameters
	})
}
// 往来单位资料表 - 检索;
export const STOCKING_API_PARTNER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/partner_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 往来单位资料表 - 加载;
export const STOCKING_API_PARTNER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/partner_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 往来单位资料表 - 创建;
export const STOCKING_API_PARTNER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/partner_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 往来单位资料表 - 更新;
export const STOCKING_API_PARTNER_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/partner_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 往来单位资料表 - 启用;
export const STOCKING_API_PARTNER_BASIC_ENABLE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/partner_basic/Enable',
		method: 'post',
		data: parameters
	})
}
// 往来单位资料表 - 停用;
export const STOCKING_API_PARTNER_BASIC_DISABLE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/partner_basic/Disable',
		method: 'post',
		data: parameters
	})
}
// 货品标签(9101) 电子标签(9107);
export const STOCKING_API_PRINTING_GOODSBASIC = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/printing/GoodsBasic',
		method: 'get',
		params: parameters
	})
}
// 成品入库单(9201);
export const STOCKING_API_PRINTING_GOODSINTAKE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/printing/GoodsIntake',
		method: 'get',
		params: parameters
	})
}
// 采购退货出库单(9203);
export const STOCKING_API_PRINTING_GOODSRETURN = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/printing/GoodsReturn',
		method: 'get',
		params: parameters
	})
}
// 库存盘点单(9205);
export const STOCKING_API_PRINTING_GOODSCOUNT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/printing/GoodsCount',
		method: 'get',
		params: parameters
	})
}
// 报损单,报溢单(9217,9219);
export const STOCKING_API_PRINTING_GOODSCOUNTREPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/printing/GoodsCountReport',
		method: 'get',
		params: parameters
	})
}
// 成品调价单(9207);
export const STOCKING_API_PRINTING_GOODSPRICE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/printing/GoodsPrice',
		method: 'get',
		params: parameters
	})
}
// 成品调拨单(9237);
export const STOCKING_API_PRINTING_GOODSALLOT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/printing/GoodsAllot',
		method: 'get',
		params: parameters
	})
}
// 配货计划单(9245);
export const STOCKING_API_PRINTING_GOODSREINFPLAN = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/printing/GoodsReinfPlan',
		method: 'get',
		params: parameters
	})
}
// 维修单(9247);
export const STOCKING_API_PRINTING_GOODSREPAIR = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/printing/GoodsRepair',
		method: 'get',
		params: parameters
	})
}
// 应收款单,应付款单(9221,9223);
export const STOCKING_API_PRINTING_SETTLEIOBILLBASIC = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/printing/SettleIOBillBasic',
		method: 'get',
		params: parameters
	})
}
// 已收款单,已付款单(9225,9227);
export const STOCKING_API_PRINTING_SETTLEIOBILLPAID = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/printing/SettleIOBillPaid',
		method: 'get',
		params: parameters
	})
}
// 旧货打印(9243);
export const STOCKING_API_PRINTING_JUNKBASIC = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/printing/JunkBasic',
		method: 'get',
		params: parameters
	})
}
// 旧货出库单(9235);
export const STOCKING_API_PRINTING_JUNKOUTAKE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/printing/JunkOutake',
		method: 'get',
		params: parameters
	})
}
// 旧货转成品库(9233);
export const STOCKING_API_PRINTING_JUNKCHANGE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/printing/JunkChange',
		method: 'get',
		params: parameters
	})
}
// 库存报表 - 库存分析(件数,金重,标签价);
export const STOCKING_API_REPORT_GOODS_STOCK_ANALYSISBYGOODSQTY = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_goods_stock/AnalysisByGoodsQty',
		method: 'get',
		params: parameters
	})
}
// 库存报表 - 库存分析(库存周转,目前只有门店有);
export const STOCKING_API_REPORT_GOODS_STOCK_ANALYSISBYBESTSELL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_goods_stock/AnalysisByBestSell',
		method: 'get',
		params: parameters
	})
}
// 库存报表 - 库存报表(库存看板);
export const STOCKING_API_REPORT_GOODS_STOCK_CHARTBYSTOCKDISTRIBUTION = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_goods_stock/ChartByStockDistribution',
		method: 'get',
		params: parameters
	})
}
// 库存报表 - 库存报表(库存汇总);
export const STOCKING_API_REPORT_GOODS_STOCK_CHARTBYSTOCKSUMMARY = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_goods_stock/ChartByStockSummary',
		method: 'get',
		params: parameters
	})
}
// 库存报表 - 库存报表(库龄,卖完:最后销售时间-入库时间,没有卖完:现在时间-入库时间);
export const STOCKING_API_REPORT_GOODS_STOCK_CHARTBYSTOCKAGE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_goods_stock/ChartByStockAge',
		method: 'get',
		params: parameters
	})
}
// 库存报表 - 导出(库存报表 - 库龄,卖完:最后销售时间-入库时间,没有卖完:现在时间-入库时间);
export const STOCKING_API_REPORT_GOODS_STOCK_EXPORTCHARTBYSTOCKAGE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_goods_stock/ExportChartByStockAge',
		method: 'post',
		data: parameters
	})
}
// 库存报表 - 库存报表(库存周转,目前只有门店有);
export const STOCKING_API_REPORT_GOODS_STOCK_CHARTBYBESTSELL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_goods_stock/ChartByBestSell',
		method: 'get',
		params: parameters
	})
}
// 库存报表 - 导出(库存报表 - 库存周转,目前只有门店有);
export const STOCKING_API_REPORT_GOODS_STOCK_EXPORTCHARTBYBESTSELL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_goods_stock/ExportChartByBestSell',
		method: 'post',
		data: parameters
	})
}
// 数据分析 - 销售分析(销量,销售额-应付和实付,销售金重,毛利分析,毛利率分析,支付方式分析,销售报表中的销售趋势同时也对应了毛利概况中的毛利趋势);
export const STOCKING_API_REPORT_SALE_ANALYSISBYSALEBOARD = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_sale/AnalysisBySaleBoard',
		method: 'get',
		params: parameters
	})
}
// 数据统计 - 利润报表(销量,销售额-应付和实付,销售金重,毛利分析,毛利率分析,支付方式分析,销售报表中的销售趋势同时也对应了毛利概况中的毛利趋势);
export const STOCKING_API_REPORT_SALE_ANALYSISBYSALEBOARD2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_sale/AnalysisBySaleBoard2',
		method: 'get',
		params: parameters
	})
}
// 数据分析 - 利润分析(销量,销售额-应付和实付,销售金重,毛利分析,毛利率分析,支付方式分析,销售报表中的销售趋势同时也对应了毛利概况中的毛利趋势);
export const STOCKING_API_REPORT_SALE_ANALYSISBYSALEBOARD3 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_sale/AnalysisBySaleBoard3',
		method: 'get',
		params: parameters
	})
}
// 首页使用(销量,销售额-应付和实付,销售金重,毛利分析,毛利率分析,支付方式分析,销售报表中的销售趋势同时也对应了毛利概况中的毛利趋势);
export const STOCKING_API_REPORT_SALE_ANALYSISBYSALEBOARD4 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_sale/AnalysisBySaleBoard4',
		method: 'get',
		params: parameters
	})
}
// 统计报表 - 销售报表 - 销售趋势(销量,销售额-应付和实付,销售金重,毛利分析,毛利率分析,支付方式分析,销售报表中的销售趋势同时也对应了毛利概况中的毛利趋势);
export const STOCKING_API_REPORT_SALE_ANALYSISBYSALEBOARD5 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_sale/AnalysisBySaleBoard5',
		method: 'get',
		params: parameters
	})
}
// 销售报表 - 销售报表 - 销售看板 - 销售分布和销售统计;
export const STOCKING_API_REPORT_SALE_CHARTBYSALEBOARD = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_sale/ChartBySaleBoard',
		method: 'get',
		params: parameters
	})
}
// 销售报表 - 销售报表 - 销售看板 - 旧货回收分布和旧货回收统计(统计的用EnumType=6的计算);
export const STOCKING_API_REPORT_SALE_CHARTBYJUNKBOARD = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_sale/ChartByJunkBoard',
		method: 'get',
		params: parameters
	})
}
// 销售报表 - 销售报表 - 销售看板 - 收款分布(API先获取所有支付方式组成table的列,行依次累加);
export const STOCKING_API_REPORT_SALE_CHARTBYCASHIERUSERBOARD = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_sale/ChartByCashierUserBoard',
		method: 'get',
		params: parameters
	})
}
// 数据统计 - 销售报表 - 销售明细;
export const STOCKING_API_REPORT_SALE_CHARTBYSALELIST = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_sale/ChartBySaleList',
		method: 'get',
		params: parameters
	})
}
// 数据统计 - 利润报表 - 毛利明细;
export const STOCKING_API_REPORT_SALE_CHARTBYSALELIST2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_sale/ChartBySaleList2',
		method: 'get',
		params: parameters
	})
}
// 数据统计 - 销售报表 - 销售明细导出;
export const STOCKING_API_REPORT_SALE_EXPORTCHARTBYSALELIST = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_sale/ExportChartBySaleList',
		method: 'post',
		data: parameters
	})
}
// 数据统计 - 利润报表 - 销售明细导出;
export const STOCKING_API_REPORT_SALE_EXPORTCHARTBYSALELIST2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_sale/ExportChartBySaleList2',
		method: 'post',
		data: parameters
	})
}
// 销售报表 - 销售报表 - 销售日报 - 成品销售;
export const STOCKING_API_REPORT_SALE_CHARTBYSALEDAYLYFORSALE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_sale/ChartBySaleDaylyForSale',
		method: 'get',
		params: parameters
	})
}
// 销售报表 - 销售报表 - 销售日报 - 旧货换购,旧货回收;
export const STOCKING_API_REPORT_SALE_CHARTBYSALEDAYLYFORJUNK = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_sale/ChartBySaleDaylyForJunk',
		method: 'get',
		params: parameters
	})
}
// 销售报表 - 销售报表 - 销售汇总 - 成品销售;
export const STOCKING_API_REPORT_SALE_CHARTBYSALESUMMARYFORSALE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_sale/ChartBySaleSummaryForSale',
		method: 'get',
		params: parameters
	})
}
// 销售报表 - 销售报表 - 销售汇总 - 旧货换购和旧货回收;
export const STOCKING_API_REPORT_SALE_CHARTBYSALESUMMARYFORJUNK = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_sale/ChartBySaleSummaryForJunk',
		method: 'get',
		params: parameters
	})
}
// 财务报表 - 财务报表;
export const STOCKING_API_REPORT_SETTLE_CHARTBYBUDGET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_settle/ChartByBudget',
		method: 'get',
		params: parameters
	})
}
// 财务分析;
export const STOCKING_API_REPORT_SETTLE_CHARTBYBUDGET2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_settle/ChartByBudget2',
		method: 'get',
		params: parameters
	})
}
// 财务报表 - 导出财务报表查询结果;
export const STOCKING_API_REPORT_SETTLE_EXPORTCHARTBYBUDGET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/report_settle/ExportChartByBudget',
		method: 'post',
		data: parameters
	})
}
// 智能导入字段对照(数据表与Excel字段对照表) - 检索;
export const STOCKING_API_SETTING_AIIMPORT_FIELD_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_aiimport_field/Gets',
		method: 'get',
		params: parameters
	})
}
// 智能导入模板 - 检索;
export const STOCKING_API_SETTING_AIIMPORT_TEMPLET_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_aiimport_templet/Gets',
		method: 'get',
		params: parameters
	})
}
// 智能导入模板 - 创建;
export const STOCKING_API_SETTING_AIIMPORT_TEMPLET_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_aiimport_templet/Create',
		method: 'post',
		data: parameters
	})
}
// 智能导入模板 - 禁用;
export const STOCKING_API_SETTING_AIIMPORT_TEMPLET_DISABLE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_aiimport_templet/Disable',
		method: 'post',
		data: parameters
	})
}
// 单据自定义字段(单据模板设置) - 检索;
export const STOCKING_API_SETTING_CUSTOMIZED_FIELD_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_customized_field/Gets',
		method: 'get',
		params: parameters
	})
}
// 自定义添加;
export const STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_customized_field/Reqs',
		method: 'get',
		params: parameters
	})
}
// 下载模板文件;
export const STOCKING_API_SETTING_CUSTOMIZED_FIELD_EXPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_customized_field/Export',
		method: 'get',
		params: parameters
	})
}
// 获取Excel的列;
export const STOCKING_API_SETTING_CUSTOMIZED_FIELD_XLSXCOLUMN = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_customized_field/XlsxColumn',
		method: 'post',
		data: parameters
	})
}
// 单据自定义字段(单据模板设置) - 更新;
export const STOCKING_API_SETTING_CUSTOMIZED_FIELD_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_customized_field/Update',
		method: 'post',
		data: parameters
	})
}
// 单据自定义字段(单据模板设置) - 排序;
export const STOCKING_API_SETTING_CUSTOMIZED_FIELD_SORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_customized_field/Sort',
		method: 'post',
		data: parameters
	})
}
// 钻石市场成本设置 - 明细;
export const STOCKING_API_SETTING_DIAMOND_COST_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_diamond_cost/Get',
		method: 'get',
		params: parameters
	})
}
// 钻石市场成本设置 - 检索;
export const STOCKING_API_SETTING_DIAMOND_COST_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_diamond_cost/Gets',
		method: 'get',
		params: parameters
	})
}
// 钻石市场成本设置 - 更新市场成本价;
export const STOCKING_API_SETTING_DIAMOND_COST_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_diamond_cost/Update',
		method: 'post',
		data: parameters
	})
}
// 钻石市场成本自定义字段 - 加载;
export const STOCKING_API_SETTING_DIAMOND_FIELD_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_diamond_field/Get',
		method: 'get',
		params: parameters
	})
}
// 钻石市场成本自定义字段 - 更新;
export const STOCKING_API_SETTING_DIAMOND_FIELD_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_diamond_field/Update',
		method: 'post',
		data: parameters
	})
}
// 分类字典 - 检索;
export const STOCKING_API_SETTING_DICTIONARY_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_dictionary/Gets',
		method: 'get',
		params: parameters
	})
}
// 分类字典 - 创建;
export const STOCKING_API_SETTING_DICTIONARY_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_dictionary/Create',
		method: 'post',
		data: parameters
	})
}
// 分类字典 - 更新;
export const STOCKING_API_SETTING_DICTIONARY_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_dictionary/Update',
		method: 'post',
		data: parameters
	})
}
// 分类字典 - 排序;
export const STOCKING_API_SETTING_DICTIONARY_SORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_dictionary/Sort',
		method: 'post',
		data: parameters
	})
}
// 分类字典 - 禁用;
export const STOCKING_API_SETTING_DICTIONARY_DISABLE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_dictionary/Disable',
		method: 'post',
		data: parameters
	})
}
// 分类字典 - 启用;
export const STOCKING_API_SETTING_DICTIONARY_ENABLE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_dictionary/Enable',
		method: 'post',
		data: parameters
	})
}
// 科目设置 - 检索;
export const STOCKING_API_SETTING_ENUMERATOR_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_enumerator/Gets',
		method: 'get',
		params: parameters
	})
}
// 科目设置 - 加载;
export const STOCKING_API_SETTING_ENUMERATOR_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_enumerator/Get',
		method: 'get',
		params: parameters
	})
}
// 科目设置 - 创建;
export const STOCKING_API_SETTING_ENUMERATOR_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_enumerator/Create',
		method: 'post',
		data: parameters
	})
}
// 科目设置 - 更新(平台用的);
export const STOCKING_API_SETTING_ENUMERATOR_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_enumerator/Update',
		method: 'post',
		data: parameters
	})
}
// 科目设置 - 启用;
export const STOCKING_API_SETTING_ENUMERATOR_ENABLE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_enumerator/Enable',
		method: 'post',
		data: parameters
	})
}
// 科目设置 - 禁用;
export const STOCKING_API_SETTING_ENUMERATOR_DISABLE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_enumerator/Disable',
		method: 'post',
		data: parameters
	})
}
// 科目设置 - 排序;
export const STOCKING_API_SETTING_ENUMERATOR_SORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_enumerator/Sort',
		method: 'post',
		data: parameters
	})
}
// 计算公式 - 检索;
export const STOCKING_API_SETTING_FORMULA_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_formula/Gets',
		method: 'get',
		params: parameters
	})
}
// 计算公式 - 创建;
export const STOCKING_API_SETTING_FORMULA_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_formula/Create',
		method: 'post',
		data: parameters
	})
}
// 计算公式 - 更新;
export const STOCKING_API_SETTING_FORMULA_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_formula/Update',
		method: 'post',
		data: parameters
	})
}
// 计算公式 - 删除;
export const STOCKING_API_SETTING_FORMULA_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_formula/Delete',
		method: 'post',
		data: parameters
	})
}
// 计算公式 - 排序;
export const STOCKING_API_SETTING_FORMULA_SORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_formula/Sort',
		method: 'post',
		data: parameters
	})
}
// 成品入库流程开关设置 - 检索;
export const STOCKING_API_SETTING_GOODS_INTAKE_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_goods_intake/Gets',
		method: 'get',
		params: parameters
	})
}
// 成品入库流程开关设置 - 加载;
export const STOCKING_API_SETTING_GOODS_INTAKE_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_goods_intake/Get',
		method: 'get',
		params: parameters
	})
}
// 成品入库流程开关设置 - 更新;
export const STOCKING_API_SETTING_GOODS_INTAKE_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_goods_intake/Update',
		method: 'post',
		data: parameters
	})
}
// 货品私密数据设置 - 检索;
export const STOCKING_API_SETTING_PRIVATE_FIELD_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_private_field/Gets',
		method: 'get',
		params: parameters
	})
}
// 货品私密数据设置 - 更新;
export const STOCKING_API_SETTING_PRIVATE_FIELD_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/setting_private_field/Update',
		method: 'post',
		data: parameters
	})
}
// 财务日度预算单 - 加载;
export const STOCKING_API_SETTLE_BUDGET_BILL_DAYLY_REQ = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_budget_bill_dayly/Req',
		method: 'get',
		params: parameters
	})
}
// 财务日度预算单 - 加载;
export const STOCKING_API_SETTLE_BUDGET_BILL_DAYLY_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_budget_bill_dayly/Get',
		method: 'get',
		params: parameters
	})
}
// 财务月度预算单 - 加载;
export const STOCKING_API_SETTLE_BUDGET_BILL_MONTHLY_REQ = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_budget_bill_monthly/Req',
		method: 'get',
		params: parameters
	})
}
// 财务月度预算单 - 加载;
export const STOCKING_API_SETTLE_BUDGET_BILL_MONTHLY_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_budget_bill_monthly/Get',
		method: 'get',
		params: parameters
	})
}
// 财务月度预算单 - 更新;
export const STOCKING_API_SETTLE_BUDGET_BILL_MONTHLY_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_budget_bill_monthly/Update',
		method: 'post',
		data: parameters
	})
}
// 财务年度预算单 - 加载;
export const STOCKING_API_SETTLE_BUDGET_BILL_YEARLY_REQ = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_budget_bill_yearly/Req',
		method: 'get',
		params: parameters
	})
}
// 财务年度预算单 - 创建;
export const STOCKING_API_SETTLE_BUDGET_BILL_YEARLY_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_budget_bill_yearly/Create',
		method: 'post',
		data: parameters
	})
}
// 财务年度预算单 - 更新;
export const STOCKING_API_SETTLE_BUDGET_BILL_YEARLY_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_budget_bill_yearly/Update',
		method: 'post',
		data: parameters
	})
}
// 应付款 - 检索;
export const STOCKING_API_SETTLE_IO_BILL_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 应付款 - 加载;
export const STOCKING_API_SETTLE_IO_BILL_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 应付款 - 创建;
export const STOCKING_API_SETTLE_IO_BILL_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 应付款 - 作废;
export const STOCKING_API_SETTLE_IO_BILL_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 应收款 - 检索;
export const STOCKING_API_SETTLE_IO_BILL_BASIC_GETS1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_basic/Gets1',
		method: 'get',
		params: parameters
	})
}
// 应收款 - 加载;
export const STOCKING_API_SETTLE_IO_BILL_BASIC_GET1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_basic/Get1',
		method: 'get',
		params: parameters
	})
}
// 应收款 - 创建;
export const STOCKING_API_SETTLE_IO_BILL_BASIC_CREATE1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_basic/Create1',
		method: 'post',
		data: parameters
	})
}
// 应收款 - 作废;
export const STOCKING_API_SETTLE_IO_BILL_BASIC_ABANDON1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_basic/Abandon1',
		method: 'post',
		data: parameters
	})
}
// 付款单 - 检索;
export const STOCKING_API_SETTLE_IO_BILL_PAID_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_paid/Gets',
		method: 'get',
		params: parameters
	})
}
// 付款单 - 加载;
export const STOCKING_API_SETTLE_IO_BILL_PAID_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_paid/Get',
		method: 'get',
		params: parameters
	})
}
// 付款单 - 加载;
export const STOCKING_API_SETTLE_IO_BILL_PAID_REQ = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_paid/Req',
		method: 'get',
		params: parameters
	})
}
// 付款单 - 创建;
export const STOCKING_API_SETTLE_IO_BILL_PAID_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_paid/Create',
		method: 'post',
		data: parameters
	})
}
// 付款单 - 批量确认;
export const STOCKING_API_SETTLE_IO_BILL_PAID_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_paid/Audits',
		method: 'post',
		data: parameters
	})
}
// 付款单 - 审核;
export const STOCKING_API_SETTLE_IO_BILL_PAID_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_paid/Audit',
		method: 'post',
		data: parameters
	})
}
// 付款单 - 批量作废;
export const STOCKING_API_SETTLE_IO_BILL_PAID_ABANDONS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_paid/Abandons',
		method: 'post',
		data: parameters
	})
}
// 付款单 - 作废;
export const STOCKING_API_SETTLE_IO_BILL_PAID_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_paid/Abandon',
		method: 'post',
		data: parameters
	})
}
// 付款单 - 取消;
export const STOCKING_API_SETTLE_IO_BILL_PAID_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_paid/Cancel',
		method: 'post',
		data: parameters
	})
}
// 收款单 - 检索;
export const STOCKING_API_SETTLE_IO_BILL_PAID_GETS1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_paid/Gets1',
		method: 'get',
		params: parameters
	})
}
// 收款单 - 加载;
export const STOCKING_API_SETTLE_IO_BILL_PAID_GET1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_paid/Get1',
		method: 'get',
		params: parameters
	})
}
// 收款单 - 加载;
export const STOCKING_API_SETTLE_IO_BILL_PAID_REQ1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_paid/Req1',
		method: 'get',
		params: parameters
	})
}
// 收款单 - 创建;
export const STOCKING_API_SETTLE_IO_BILL_PAID_CREATE1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_paid/Create1',
		method: 'post',
		data: parameters
	})
}
// 收款单 - 批量确认;
export const STOCKING_API_SETTLE_IO_BILL_PAID_AUDITS1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_paid/Audits1',
		method: 'post',
		data: parameters
	})
}
// 收款单 - 审核;
export const STOCKING_API_SETTLE_IO_BILL_PAID_AUDIT1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_paid/Audit1',
		method: 'post',
		data: parameters
	})
}
// 收款单 - 批量作废;
export const STOCKING_API_SETTLE_IO_BILL_PAID_ABANDONS1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_paid/Abandons1',
		method: 'post',
		data: parameters
	})
}
// 收款单 - 作废;
export const STOCKING_API_SETTLE_IO_BILL_PAID_ABANDON1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_paid/Abandon1',
		method: 'post',
		data: parameters
	})
}
// 收款单 - 取消;
export const STOCKING_API_SETTLE_IO_BILL_PAID_CANCEL1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_paid/Cancel1',
		method: 'post',
		data: parameters
	})
}
// - 导出;
export const STOCKING_API_SETTLE_IO_BILL_PAID_EXPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_io_bill_paid/Export',
		method: 'post',
		data: parameters
	})
}
// 财务月结单代销明细 - 检索;
export const STOCKING_API_SETTLE_MONTHLY_BILL_AGENT_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_monthly_bill_agent/Gets',
		method: 'get',
		params: parameters
	})
}
// 财务月结单代销明细 - 检索 获取总数;
export const STOCKING_API_SETTLE_MONTHLY_BILL_AGENT_GETSTOTAL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_monthly_bill_agent/GetsTotal',
		method: 'get',
		params: parameters
	})
}
// - 导出;
export const STOCKING_API_SETTLE_MONTHLY_BILL_AGENT_EXPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_monthly_bill_agent/Export',
		method: 'post',
		data: parameters
	})
}
// 财务月结单 - 获取未结账的年份;
export const STOCKING_API_SETTLE_MONTHLY_BILL_BASIC_SETTLEDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_monthly_bill_basic/SettleDate',
		method: 'get',
		params: parameters
	})
}
// 财务月结单 - 检索;
export const STOCKING_API_SETTLE_MONTHLY_BILL_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_monthly_bill_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 财务月结单 - 加载;
export const STOCKING_API_SETTLE_MONTHLY_BILL_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_monthly_bill_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 财务月结单 - 开始结账;
export const STOCKING_API_SETTLE_MONTHLY_BILL_BASIC_SETTLE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_monthly_bill_basic/Settle',
		method: 'post',
		data: parameters
	})
}
// 财务月结单 - 取消结账;
export const STOCKING_API_SETTLE_MONTHLY_BILL_BASIC_CANCLE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_monthly_bill_basic/Cancle',
		method: 'post',
		data: parameters
	})
}
// 财务月结单加盟明细 - 检索;
export const STOCKING_API_SETTLE_MONTHLY_BILL_JOINING_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_monthly_bill_joining/Gets',
		method: 'get',
		params: parameters
	})
}
// 财务月结单加盟明细 - 检索获取总数;
export const STOCKING_API_SETTLE_MONTHLY_BILL_JOINING_GETSTOTAL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_monthly_bill_joining/GetsTotal',
		method: 'get',
		params: parameters
	})
}
// - 导出;
export const STOCKING_API_SETTLE_MONTHLY_BILL_JOINING_EXPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_monthly_bill_joining/Export',
		method: 'post',
		data: parameters
	})
}
// 财务月结单单位明细 - 检索;
export const STOCKING_API_SETTLE_MONTHLY_BILL_UNIT_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/settle_monthly_bill_unit/Gets',
		method: 'get',
		params: parameters
	})
}
// 原料调拨入库单 - 检索;
export const STOCKING_API_STUFF_ALLOT_ORDER_INTAKE_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_allot_order_intake/Gets',
		method: 'get',
		params: parameters
	})
}
// 原料调拨入库单 - 加载;
export const STOCKING_API_STUFF_ALLOT_ORDER_INTAKE_REQ = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_allot_order_intake/Req',
		method: 'get',
		params: parameters
	})
}
// 原料调拨入库单 - 批量收货;
export const STOCKING_API_STUFF_ALLOT_ORDER_INTAKE_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_allot_order_intake/Audits',
		method: 'post',
		data: parameters
	})
}
// 原料调拨入库单 - 收货;
export const STOCKING_API_STUFF_ALLOT_ORDER_INTAKE_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_allot_order_intake/Audit',
		method: 'post',
		data: parameters
	})
}
// 原料调拨入库单 - 批量退货;
export const STOCKING_API_STUFF_ALLOT_ORDER_INTAKE_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_allot_order_intake/Rejects',
		method: 'post',
		data: parameters
	})
}
// 原料调拨入库单 - 退货;
export const STOCKING_API_STUFF_ALLOT_ORDER_INTAKE_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_allot_order_intake/Reject',
		method: 'post',
		data: parameters
	})
}
// 原料调拨单明细 - 检索;
export const STOCKING_API_STUFF_ALLOT_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_allot_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 原料调拨单明细 - 创建;
export const STOCKING_API_STUFF_ALLOT_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_allot_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 原料调拨单明细 - 更新;
export const STOCKING_API_STUFF_ALLOT_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_allot_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 原料调拨单明细 - 删除;
export const STOCKING_API_STUFF_ALLOT_ORDER_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_allot_order_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 原料调拨出库单 - 检索;
export const STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_allot_order_outake/Gets',
		method: 'get',
		params: parameters
	})
}
// 原料调拨出库单 - 加载;
export const STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_allot_order_outake/Get',
		method: 'get',
		params: parameters
	})
}
// 原料调拨出库单 - 创建;
export const STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_allot_order_outake/Create',
		method: 'post',
		data: parameters
	})
}
// 原料调拨出库单 - 更新;
export const STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_allot_order_outake/Update',
		method: 'post',
		data: parameters
	})
}
// 原料调拨出库单 - 待审核;
export const STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_allot_order_outake/Wait',
		method: 'post',
		data: parameters
	})
}
// 原料调拨出库单 - 批量审核;
export const STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_allot_order_outake/Audits',
		method: 'post',
		data: parameters
	})
}
// 原料调拨出库单 - 审核;
export const STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_allot_order_outake/Audit',
		method: 'post',
		data: parameters
	})
}
// 原料调拨出库单 - 批量审核退回;
export const STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_allot_order_outake/Rejects',
		method: 'post',
		data: parameters
	})
}
// 原料调拨出库单 - 审核退回;
export const STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_allot_order_outake/Reject',
		method: 'post',
		data: parameters
	})
}
// 原料调拨出库单 - 作废;
export const STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_allot_order_outake/Abandon',
		method: 'post',
		data: parameters
	})
}
// 原料调拨出库单 - 取消;
export const STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_allot_order_outake/Cancel',
		method: 'post',
		data: parameters
	})
}
// 原料盘点单 - 检索;
export const STOCKING_API_STUFF_COUNT_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 原料盘点单 - 加载;
export const STOCKING_API_STUFF_COUNT_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 原料盘点单 - 创建;
export const STOCKING_API_STUFF_COUNT_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 原料盘点单 - 结束盘点;
export const STOCKING_API_STUFF_COUNT_ORDER_BASIC_FINISH = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_order_basic/Finish',
		method: 'post',
		data: parameters
	})
}
// 原料盘点单 - 取消盘点;
export const STOCKING_API_STUFF_COUNT_ORDER_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_order_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 原料盘点单 - 重新盘点;
export const STOCKING_API_STUFF_COUNT_ORDER_BASIC_RETAKE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_order_basic/Retake',
		method: 'post',
		data: parameters
	})
}
// 原料盘点单位置 - 检索;
export const STOCKING_API_STUFF_COUNT_ORDER_DELF_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_order_delf/Gets',
		method: 'get',
		params: parameters
	})
}
// 原料盘点单明细 - 检索;
export const STOCKING_API_STUFF_COUNT_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 原料盘点单明细 - 结束盘点(报损);
export const STOCKING_API_STUFF_COUNT_ORDER_ITEM_FINISHLOSSGETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_order_item/FinishLossGets',
		method: 'get',
		params: parameters
	})
}
// 原料盘点单明细 - 结束盘点(报溢);
export const STOCKING_API_STUFF_COUNT_ORDER_ITEM_FINISHOVERGETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_order_item/FinishOverGets',
		method: 'get',
		params: parameters
	})
}
// 原料盘点单明细 - 创建;
export const STOCKING_API_STUFF_COUNT_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 原料盘点单明细 - 更新;
export const STOCKING_API_STUFF_COUNT_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 原料报损 - 检索;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 原料报损 - 加载;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 原料报损 - 创建;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 原料报损 - 更新;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 原料报损 - 待审核;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 原料报损 - 批量审核;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 原料报损 - 审核;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 原料报损 - 批量审核退回;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 原料报损 - 审核退回;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 原料报损 - 作废;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 原料报损 - 取消;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 原料报溢 - 检索;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_GETS1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Gets1',
		method: 'get',
		params: parameters
	})
}
// 原料报溢 - 加载;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_GET1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Get1',
		method: 'get',
		params: parameters
	})
}
// 原料报溢 - 创建;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_CREATE1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Create1',
		method: 'post',
		data: parameters
	})
}
// 原料报溢 - 更新;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_UPDATE1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Update1',
		method: 'post',
		data: parameters
	})
}
// 原料报溢 - 待审核;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_WAIT1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Wait1',
		method: 'post',
		data: parameters
	})
}
// 原料报溢 - 批量审核;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_AUDITS1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Audits1',
		method: 'post',
		data: parameters
	})
}
// 原料报溢 - 审核;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_AUDIT1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Audit1',
		method: 'post',
		data: parameters
	})
}
// 原料报溢 - 批量审核退回;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_REJECTS1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Rejects1',
		method: 'post',
		data: parameters
	})
}
// 原料报溢 - 审核退回;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_REJECT1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Reject1',
		method: 'post',
		data: parameters
	})
}
// 原料报溢 - 作废;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_ABANDON1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Abandon1',
		method: 'post',
		data: parameters
	})
}
// 原料报溢 - 取消;
export const STOCKING_API_STUFF_COUNT_REPORT_BASIC_CANCEL1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_basic/Cancel1',
		method: 'post',
		data: parameters
	})
}
// 原料损溢单明细 - 检索;
export const STOCKING_API_STUFF_COUNT_REPORT_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 原料报损单明细 - 创建;
export const STOCKING_API_STUFF_COUNT_REPORT_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_item/Create',
		method: 'post',
		data: parameters
	})
}
// 原料报损单明细 - 更新;
export const STOCKING_API_STUFF_COUNT_REPORT_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_item/Update',
		method: 'post',
		data: parameters
	})
}
// 原料报损单明细 - 删除;
export const STOCKING_API_STUFF_COUNT_REPORT_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 原料报溢单明细 - 创建;
export const STOCKING_API_STUFF_COUNT_REPORT_ITEM_CREATE1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_item/Create1',
		method: 'post',
		data: parameters
	})
}
// 原料报溢单明细 - 更新;
export const STOCKING_API_STUFF_COUNT_REPORT_ITEM_UPDATE1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_item/Update1',
		method: 'post',
		data: parameters
	})
}
// 原料报溢单明细 - 删除;
export const STOCKING_API_STUFF_COUNT_REPORT_ITEM_DELETE1 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_count_report_item/Delete1',
		method: 'post',
		data: parameters
	})
}
// 原料进货入库单 - 检索;
export const STOCKING_API_STUFF_INTAKE_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_intake_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 原料进货入库单 - 加载;
export const STOCKING_API_STUFF_INTAKE_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_intake_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 原料进货入库单 - 创建;
export const STOCKING_API_STUFF_INTAKE_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_intake_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 原料进货入库单 - 更新;
export const STOCKING_API_STUFF_INTAKE_ORDER_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_intake_order_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 原料进货入库单 - 待审核;
export const STOCKING_API_STUFF_INTAKE_ORDER_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_intake_order_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 原料进货入库单 - 批量审核;
export const STOCKING_API_STUFF_INTAKE_ORDER_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_intake_order_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 原料进货入库单 - 审核;
export const STOCKING_API_STUFF_INTAKE_ORDER_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_intake_order_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 原料进货入库单 - 批量审核退回;
export const STOCKING_API_STUFF_INTAKE_ORDER_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_intake_order_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 原料进货入库单 - 审核退回;
export const STOCKING_API_STUFF_INTAKE_ORDER_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_intake_order_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 原料进货入库单 - 作废;
export const STOCKING_API_STUFF_INTAKE_ORDER_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_intake_order_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 原料进货入库单 - 取消;
export const STOCKING_API_STUFF_INTAKE_ORDER_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_intake_order_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 原料进货入库单明细 - 检索;
export const STOCKING_API_STUFF_INTAKE_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_intake_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 原料进货入库单明细 - 加载;
export const STOCKING_API_STUFF_INTAKE_ORDER_ITEM_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_intake_order_item/Get',
		method: 'get',
		params: parameters
	})
}
// 原料进货入库单明细 - 创建;
export const STOCKING_API_STUFF_INTAKE_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_intake_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 原料进货入库单明细 - 更新;
export const STOCKING_API_STUFF_INTAKE_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_intake_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 原料进货入库单明细 - 删除;
export const STOCKING_API_STUFF_INTAKE_ORDER_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_intake_order_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 原料进货入库单明细 - 导出货品信息;
export const STOCKING_API_STUFF_INTAKE_ORDER_ITEM_EXPORTGETSSTUFF = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_intake_order_item/ExportGetsStuff',
		method: 'post',
		data: parameters
	})
}
// 原料订货单资料 - 检索;
export const STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_purchase_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 原料订货单资料 - 加载;
export const STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_purchase_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 原料订货单资料 - 新建;
export const STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_purchase_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 原料订货单资料 - 编辑;
export const STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_purchase_order_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 原料订货单资料 - 提交审核;
export const STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_purchase_order_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 原料订货单资料 - 批量审核;
export const STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_purchase_order_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 原料订货单资料 - 审核通过;
export const STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_purchase_order_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 原料订货单资料 - 批量退回;
export const STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_purchase_order_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 原料订货单资料 - 审核退回;
export const STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_purchase_order_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 原料订货单资料 - 作废;
export const STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_purchase_order_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 原料订货单资料 - 取消审核;
export const STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_purchase_order_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 原料订货单明细资料 - 检索;
export const STOCKING_API_STUFF_PURCHASE_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_purchase_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 原料订货单明细资料 - 创建;
export const STOCKING_API_STUFF_PURCHASE_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_purchase_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 原料订货单明细资料 - 更新;
export const STOCKING_API_STUFF_PURCHASE_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_purchase_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 原料订货单明细资料 - 删除;
export const STOCKING_API_STUFF_PURCHASE_ORDER_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_purchase_order_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 原料退货出库单 - 检索;
export const STOCKING_API_STUFF_RETURN_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_return_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 原料退货出库单 - 加载;
export const STOCKING_API_STUFF_RETURN_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_return_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 原料退货出库单 - 创建;
export const STOCKING_API_STUFF_RETURN_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_return_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 原料退货出库单 - 更新;
export const STOCKING_API_STUFF_RETURN_ORDER_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_return_order_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 原料退货出库单 - 待审核;
export const STOCKING_API_STUFF_RETURN_ORDER_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_return_order_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 原料退货出库单 - 批量审核;
export const STOCKING_API_STUFF_RETURN_ORDER_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_return_order_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 原料退货出库单 - 审核;
export const STOCKING_API_STUFF_RETURN_ORDER_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_return_order_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 原料退货出库单 - 批量审核退回;
export const STOCKING_API_STUFF_RETURN_ORDER_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_return_order_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 原料退货出库单 - 审核退回;
export const STOCKING_API_STUFF_RETURN_ORDER_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_return_order_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 原料退货出库单 - 作废;
export const STOCKING_API_STUFF_RETURN_ORDER_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_return_order_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 原料退货出库单 - 取消;
export const STOCKING_API_STUFF_RETURN_ORDER_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_return_order_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 原料退货出库单明细 - 检索;
export const STOCKING_API_STUFF_RETURN_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_return_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 原料退货出库单明细 - 加载;
export const STOCKING_API_STUFF_RETURN_ORDER_ITEM_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_return_order_item/Get',
		method: 'get',
		params: parameters
	})
}
// 原料退货出库单明细 - 创建;
export const STOCKING_API_STUFF_RETURN_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_return_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 原料退货出库单明细 - 更新;
export const STOCKING_API_STUFF_RETURN_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_return_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 原料退货出库单明细 - 删除;
export const STOCKING_API_STUFF_RETURN_ORDER_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_return_order_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 原料退货出库单明细 - 导出货品信息;
export const STOCKING_API_STUFF_RETURN_ORDER_ITEM_EXPORTGETSSTUFF = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_return_order_item/ExportGetsStuff',
		method: 'post',
		data: parameters
	})
}
// 原料库存日志 - 出入库记录;
export const STOCKING_API_STUFF_STOCK_LOG_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_stock_log/Gets',
		method: 'get',
		params: parameters
	})
}
// 原料库存(总部某分仓的货架) - 检索;
export const STOCKING_API_STUFF_STOCK_SHELF_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_stock_shelf/Gets',
		method: 'get',
		params: parameters
	})
}
// 原料库存(总部分仓) - 检索;
export const STOCKING_API_STUFF_STOCK_WAREHOUSE_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_stock_warehouse/Gets',
		method: 'get',
		params: parameters
	})
}
// 原料库存(总部分仓) - 检索,合计;
export const STOCKING_API_STUFF_STOCK_WAREHOUSE_GETSTOTAL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_stock_warehouse/GetsTotal',
		method: 'get',
		params: parameters
	})
}
// 原料库存(总部分仓) - 导出查询结果;
export const STOCKING_API_STUFF_STOCK_WAREHOUSE_EXPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/stuff_stock_warehouse/Export',
		method: 'post',
		data: parameters
	})
}
// 款式资料 - 检索;
export const STOCKING_API_STYLE_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 款式资料 - 加载;
export const STOCKING_API_STYLE_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 款式资料 - 加载(根据款号);
export const STOCKING_API_STYLE_BASIC_REQ = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_basic/Req',
		method: 'get',
		params: parameters
	})
}
// 款式资料 - 创建;
export const STOCKING_API_STYLE_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 款式资料 - 更新;
export const STOCKING_API_STYLE_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 款式资料 - 上架;
export const STOCKING_API_STYLE_BASIC_DONE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_basic/Done',
		method: 'post',
		data: parameters
	})
}
// 款式资料 - 下架;
export const STOCKING_API_STYLE_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 款式供应商 - 检索;
export const STOCKING_API_STYLE_PARTNER_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_partner/Gets',
		method: 'get',
		params: parameters
	})
}
// 款式供应商 - 删除;
export const STOCKING_API_STYLE_PARTNER_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_partner/Delete',
		method: 'post',
		data: parameters
	})
}
// 门店款式订货单资料 - 检索;
export const STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_purchase_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 门店款式订货单资料 - 加载;
export const STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_purchase_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 门店款式订货单资料 - 新建;
export const STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_purchase_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 门店款式订货单资料 - 编辑;
export const STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_purchase_order_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 门店款式订货单资料 - 待审核(提交审核);
export const STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_purchase_order_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 门店款式订货单资料 - 审核通过;
export const STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_purchase_order_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 门店款式订货单资料 - 批量退回;
export const STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_purchase_order_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 门店款式订货单资料 - 审核退回;
export const STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_purchase_order_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 门店款式订货单资料 - 作废;
export const STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_purchase_order_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 门店款式订货单资料 - 取消审核;
export const STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_purchase_order_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 门店款式订货单明细资料 - 检索;
export const STOCKING_API_STYLE_PURCHASE_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_purchase_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 门店款式订货单明细资料 - 创建;
export const STOCKING_API_STYLE_PURCHASE_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_purchase_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 门店款式订货单明细资料 - 选择需求单创建;
export const STOCKING_API_STYLE_PURCHASE_ORDER_ITEM_SELECTREQUIRECREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_purchase_order_item/SelectRequireCreate',
		method: 'post',
		data: parameters
	})
}
// 门店款式订货单明细资料 - 更新;
export const STOCKING_API_STYLE_PURCHASE_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_purchase_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 门店款式订货单明细资料 - 删除;
export const STOCKING_API_STYLE_PURCHASE_ORDER_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_purchase_order_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 门店款式需求单资料 - 检索;
export const STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_require_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 门店款式需求单资料 - 加载;
export const STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_require_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 门店款式需求单资料 - 创建;
export const STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_require_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 门店款式需求单资料 - 更新;
export const STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_require_order_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 门店款式需求单资料 - 待审核;
export const STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_require_order_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 门店款式需求单资料 - 批量审核;
export const STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_require_order_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 门店款式需求单资料 - 审核;
export const STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_require_order_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 门店款式需求单资料 - 批量审核退回;
export const STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_require_order_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 门店款式需求单资料 - 审核退回;
export const STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_require_order_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 门店款式需求单资料 - 作废;
export const STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_require_order_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 门店款式需求单资料 - 取消;
export const STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_require_order_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 门店款式需求单资料 - 导出;
export const STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_EXPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_require_order_basic/Export',
		method: 'post',
		data: parameters
	})
}
// 门店款式需求单明细 - 检索;
export const STOCKING_API_STYLE_REQUIRE_ORDER_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_require_order_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 门店款式需求单明细 - 创建;
export const STOCKING_API_STYLE_REQUIRE_ORDER_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_require_order_item/Create',
		method: 'post',
		data: parameters
	})
}
// 门店款式需求单明细 - 更新;
export const STOCKING_API_STYLE_REQUIRE_ORDER_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_require_order_item/Update',
		method: 'post',
		data: parameters
	})
}
// 门店款式需求单明细 - 删除;
export const STOCKING_API_STYLE_REQUIRE_ORDER_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_require_order_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 门店分货单 - 检索;
export const STOCKING_API_STYLE_SPLIT_ORDER_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_split_order_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 门店分货单 - 加载(数据库);
export const STOCKING_API_STYLE_SPLIT_ORDER_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_split_order_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 门店分货单 - 创建(数据库事务);
export const STOCKING_API_STYLE_SPLIT_ORDER_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_split_order_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 门店分货单 - 更新;
export const STOCKING_API_STYLE_SPLIT_ORDER_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_split_order_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 门店分货单 - 待审核;
export const STOCKING_API_STYLE_SPLIT_ORDER_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_split_order_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 门店分货单 - 批量审核;
export const STOCKING_API_STYLE_SPLIT_ORDER_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_split_order_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 门店分货单 - 审核;
export const STOCKING_API_STYLE_SPLIT_ORDER_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_split_order_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 门店分货单 - 批量审核退回;
export const STOCKING_API_STYLE_SPLIT_ORDER_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_split_order_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 门店分货单 - 审核退回;
export const STOCKING_API_STYLE_SPLIT_ORDER_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_split_order_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 门店分货单 - 作废;
export const STOCKING_API_STYLE_SPLIT_ORDER_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_split_order_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 门店分货单 - 取消;
export const STOCKING_API_STYLE_SPLIT_ORDER_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_split_order_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 款式门店分货单门店明细 - 检索(门店分货单--货品列表);
export const STOCKING_API_STYLE_SPLIT_ORDER_REQUIRE_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_split_order_require/Gets',
		method: 'get',
		params: parameters
	})
}
// 款式门店分货单门店明细 - 分货;
export const STOCKING_API_STYLE_SPLIT_ORDER_REQUIRE_SPLIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_split_order_require/Split',
		method: 'post',
		data: parameters
	})
}
// 款式门店分货单款式明细 - 检索;
export const STOCKING_API_STYLE_SPLIT_ORDER_STYLE_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_split_order_style/Gets',
		method: 'get',
		params: parameters
	})
}
// 款式门店分货单款式明细 - 创建;
export const STOCKING_API_STYLE_SPLIT_ORDER_STYLE_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_split_order_style/Create',
		method: 'post',
		data: parameters
	})
}
// 款式门店分货单款式明细 - 删除;
export const STOCKING_API_STYLE_SPLIT_ORDER_STYLE_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_split_order_style/Delete',
		method: 'post',
		data: parameters
	})
}
// 款式总库存(总部总库存, 某款式的所有分仓所有门店的总库存) - 检索;
export const STOCKING_API_STYLE_STOCK_COMPANY_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_stock_company/Gets',
		method: 'get',
		params: parameters
	})
}
// 款式库存(总部某分仓的货架库存) - 检索;
export const STOCKING_API_STYLE_STOCK_SHELF_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_stock_shelf/Gets',
		method: 'get',
		params: parameters
	})
}
// 款式库存(总部某分仓的货架库存) - 检索(支持弹窗);
export const STOCKING_API_STYLE_STOCK_SHELF_REQS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_stock_shelf/Reqs',
		method: 'get',
		params: parameters
	})
}
// 款式库存(总部分仓或门店库存) - 检索(支持弹窗);
export const STOCKING_API_STYLE_STOCK_WAREHOUSE_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_stock_warehouse/Gets',
		method: 'get',
		params: parameters
	})
}
// 款式库存(总部分仓或门店库存) - 设置安全库存(总部批量设置);
export const STOCKING_API_STYLE_STOCK_WAREHOUSE_SET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_stock_warehouse/Set',
		method: 'post',
		data: parameters
	})
}
// 款式库存(总部分仓或门店库存) - 设置安全库存(门店单独设置);
export const STOCKING_API_STYLE_STOCK_WAREHOUSE_SETSTORE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/style_stock_warehouse/SetStore',
		method: 'post',
		data: parameters
	})
}
// 仓库管理 - 检索;
export const STOCKING_API_WAREHOUSE_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/warehouse_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 仓库管理 - 加载;
export const STOCKING_API_WAREHOUSE_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/warehouse_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 仓库管理 - 创建;
export const STOCKING_API_WAREHOUSE_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/warehouse_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 仓库管理 - 更新：;
export const STOCKING_API_WAREHOUSE_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/warehouse_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 仓库管理 - 删除：;
export const STOCKING_API_WAREHOUSE_BASIC_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/warehouse_basic/Delete',
		method: 'post',
		data: parameters
	})
}
// 仓库货架 - 检索;
export const STOCKING_API_WAREHOUSE_SHELF_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/warehouse_shelf/Gets',
		method: 'get',
		params: parameters
	})
}
// 仓库货架 - 加载详情;
export const STOCKING_API_WAREHOUSE_SHELF_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/warehouse_shelf/Get',
		method: 'get',
		params: parameters
	})
}
// 仓库货架 - 创建;
export const STOCKING_API_WAREHOUSE_SHELF_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/warehouse_shelf/Create',
		method: 'post',
		data: parameters
	})
}
// 仓库货架 - 更新：;
export const STOCKING_API_WAREHOUSE_SHELF_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/warehouse_shelf/Update',
		method: 'post',
		data: parameters
	})
}
// 仓库货架 - 删除：;
export const STOCKING_API_WAREHOUSE_SHELF_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/warehouse_shelf/Delete',
		method: 'post',
		data: parameters
	})
}
// 委外拆卸结算单 - 检索;
export const STOCKING_API_WEIW_GJUNK_SETTLE_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_settle_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 委外拆卸结算单 - 加载;
export const STOCKING_API_WEIW_GJUNK_SETTLE_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_settle_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 委外拆卸结算单 - 创建;
export const STOCKING_API_WEIW_GJUNK_SETTLE_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_settle_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 委外拆卸结算单 - 更新;
export const STOCKING_API_WEIW_GJUNK_SETTLE_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_settle_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 委外拆卸结算单 - 待审核;
export const STOCKING_API_WEIW_GJUNK_SETTLE_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_settle_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 委外拆卸结算单 - 批量审核;
export const STOCKING_API_WEIW_GJUNK_SETTLE_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_settle_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 委外拆卸结算单 - 审核;
export const STOCKING_API_WEIW_GJUNK_SETTLE_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_settle_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 委外拆卸结算单 - 批量审核退回;
export const STOCKING_API_WEIW_GJUNK_SETTLE_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_settle_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 委外拆卸结算单 - 审核退回;
export const STOCKING_API_WEIW_GJUNK_SETTLE_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_settle_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 委外拆卸结算单 - 作废;
export const STOCKING_API_WEIW_GJUNK_SETTLE_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_settle_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 委外拆卸结算单 - 取消;
export const STOCKING_API_WEIW_GJUNK_SETTLE_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_settle_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 委外拆卸结算单明细 - 检索;
export const STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_settle_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 委外拆卸结算单明细 - 创建;
export const STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_settle_item/Create',
		method: 'post',
		data: parameters
	})
}
// 委外拆卸结算单明细 - 更新;
export const STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_settle_item/Update',
		method: 'post',
		data: parameters
	})
}
// 委外拆卸结算单明细 - 删除;
export const STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_settle_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 委外拆卸结算单明细 - 工费;
export const STOCKING_API_WEIW_GJUNK_SETTLE_ITEM_CRAFTCREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_settle_item/CraftCreate',
		method: 'post',
		data: parameters
	})
}
// 成品委外拆卸单 - 检索;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 旧货委外拆卸单 - 检索;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_GETS2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Gets2',
		method: 'get',
		params: parameters
	})
}
// 成品委外拆卸单 - 加载;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 旧货委外拆卸单 - 加载;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_GET2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Get2',
		method: 'get',
		params: parameters
	})
}
// 成品委外拆卸单 - 创建;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 旧货委外拆卸单 - 创建;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_CREATE2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Create2',
		method: 'post',
		data: parameters
	})
}
// 成品委外拆卸单 - 更新;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 旧货委外拆卸单 - 更新;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_UPDATE2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Update2',
		method: 'post',
		data: parameters
	})
}
// 成品委外拆卸单 - 待审核;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 旧货委外拆卸单 - 待审核;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_WAIT2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Wait2',
		method: 'post',
		data: parameters
	})
}
// 成品委外拆卸单 - 批量审核;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 旧货委外拆卸单 - 批量审核;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_AUDITS2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Audits2',
		method: 'post',
		data: parameters
	})
}
// 成品委外拆卸单 - 审核;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 旧货委外拆卸单 - 审核;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_AUDIT2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Audit2',
		method: 'post',
		data: parameters
	})
}
// 成品委外拆卸单 - 批量审核退回;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 旧货委外拆卸单 - 批量审核退回;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_REJECTS2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Rejects2',
		method: 'post',
		data: parameters
	})
}
// 成品委外拆卸单 - 审核退回;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 旧货委外拆卸单 - 审核退回;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_REJECT2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Reject2',
		method: 'post',
		data: parameters
	})
}
// 成品委外拆卸单 - 作废;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 旧货委外拆卸单 - 作废;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_ABANDON2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Abandon2',
		method: 'post',
		data: parameters
	})
}
// 成品委外拆卸单 - 取消;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 旧货委外拆卸单 - 取消;
export const STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_CANCEL2 = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_basic/Cancel2',
		method: 'post',
		data: parameters
	})
}
// 委外拆卸单明细 - 检索(成品拆卸);
export const STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_GETSBYGOODS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_item/GetsByGoods',
		method: 'get',
		params: parameters
	})
}
// 委外拆卸单明细 - 检索(旧货拆卸);
export const STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_GETSBYJUNK = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_item/GetsByJunk',
		method: 'get',
		params: parameters
	})
}
// 委外拆卸单明细 - 创建;
export const STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_item/Create',
		method: 'post',
		data: parameters
	})
}
// 委外拆卸单明细 - 批量创建;
export const STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_CREATEBATCH = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_item/CreateBatch',
		method: 'post',
		data: parameters
	})
}
// 委外拆卸单明细 - 更新;
export const STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_item/Update',
		method: 'post',
		data: parameters
	})
}
// 委外拆卸单明细 - 删除;
export const STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_gjunk_split_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 委外加工退料入库单 - 检索;
export const STOCKING_API_WEIW_STUFF_RETURN_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_return_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 委外加工退料入库单 - 加载;
export const STOCKING_API_WEIW_STUFF_RETURN_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_return_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 委外加工退料入库单 - 创建;
export const STOCKING_API_WEIW_STUFF_RETURN_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_return_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 委外加工退料入库单 - 更新;
export const STOCKING_API_WEIW_STUFF_RETURN_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_return_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 委外加工退料入库单 - 待审核;
export const STOCKING_API_WEIW_STUFF_RETURN_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_return_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 委外加工退料入库单 - 批量审核;
export const STOCKING_API_WEIW_STUFF_RETURN_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_return_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 委外加工退料入库单 - 审核;
export const STOCKING_API_WEIW_STUFF_RETURN_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_return_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 委外加工退料入库单 - 批量审核退回;
export const STOCKING_API_WEIW_STUFF_RETURN_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_return_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 委外加工退料入库单 - 审核退回;
export const STOCKING_API_WEIW_STUFF_RETURN_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_return_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 委外加工退料入库单 - 作废;
export const STOCKING_API_WEIW_STUFF_RETURN_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_return_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 委外加工退料入库单 - 取消;
export const STOCKING_API_WEIW_STUFF_RETURN_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_return_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 委外加工退料入库单明细 - 检索;
export const STOCKING_API_WEIW_STUFF_RETURN_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_return_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 委外加工退料入库单明细 - 创建;
export const STOCKING_API_WEIW_STUFF_RETURN_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_return_item/Create',
		method: 'post',
		data: parameters
	})
}
// 委外加工退料入库单明细 - 更新;
export const STOCKING_API_WEIW_STUFF_RETURN_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_return_item/Update',
		method: 'post',
		data: parameters
	})
}
// 委外加工退料入库单明细 - 删除;
export const STOCKING_API_WEIW_STUFF_RETURN_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_return_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 委外加工发料出库单 - 检索;
export const STOCKING_API_WEIW_STUFF_SEND_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_send_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 委外加工发料出库单 - 加载;
export const STOCKING_API_WEIW_STUFF_SEND_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_send_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 委外加工发料出库单 - 创建;
export const STOCKING_API_WEIW_STUFF_SEND_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_send_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 委外加工发料出库单 - 更新;
export const STOCKING_API_WEIW_STUFF_SEND_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_send_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 委外加工发料出库单 - 待审核;
export const STOCKING_API_WEIW_STUFF_SEND_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_send_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 委外加工发料出库单 - 批量审核;
export const STOCKING_API_WEIW_STUFF_SEND_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_send_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 委外加工发料出库单 - 审核;
export const STOCKING_API_WEIW_STUFF_SEND_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_send_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 委外加工发料出库单 - 批量审核退回;
export const STOCKING_API_WEIW_STUFF_SEND_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_send_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 委外加工发料出库单 - 审核退回;
export const STOCKING_API_WEIW_STUFF_SEND_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_send_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 委外加工发料出库单 - 作废;
export const STOCKING_API_WEIW_STUFF_SEND_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_send_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 委外加工发料出库单 - 取消;
export const STOCKING_API_WEIW_STUFF_SEND_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_send_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 委外加工发料出库单明细 - 检索;
export const STOCKING_API_WEIW_STUFF_SEND_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_send_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 委外加工发料出库单明细 - 创建;
export const STOCKING_API_WEIW_STUFF_SEND_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_send_item/Create',
		method: 'post',
		data: parameters
	})
}
// 委外加工发料出库单明细 - 更新;
export const STOCKING_API_WEIW_STUFF_SEND_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_send_item/Update',
		method: 'post',
		data: parameters
	})
}
// 委外加工发料出库单明细 - 删除;
export const STOCKING_API_WEIW_STUFF_SEND_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_send_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 委外加工原料结算单 - 检索;
export const STOCKING_API_WEIW_STUFF_SETTLE_BASIC_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_settle_basic/Gets',
		method: 'get',
		params: parameters
	})
}
// 委外加工原料结算单 - 加载;
export const STOCKING_API_WEIW_STUFF_SETTLE_BASIC_GET = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_settle_basic/Get',
		method: 'get',
		params: parameters
	})
}
// 委外加工原料结算单 - 创建;
export const STOCKING_API_WEIW_STUFF_SETTLE_BASIC_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_settle_basic/Create',
		method: 'post',
		data: parameters
	})
}
// 委外加工原料结算单 - 更新;
export const STOCKING_API_WEIW_STUFF_SETTLE_BASIC_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_settle_basic/Update',
		method: 'post',
		data: parameters
	})
}
// 委外加工原料结算单 - 待审核;
export const STOCKING_API_WEIW_STUFF_SETTLE_BASIC_WAIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_settle_basic/Wait',
		method: 'post',
		data: parameters
	})
}
// 委外加工原料结算单 - 批量审核;
export const STOCKING_API_WEIW_STUFF_SETTLE_BASIC_AUDITS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_settle_basic/Audits',
		method: 'post',
		data: parameters
	})
}
// 委外加工原料结算单 - 审核;
export const STOCKING_API_WEIW_STUFF_SETTLE_BASIC_AUDIT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_settle_basic/Audit',
		method: 'post',
		data: parameters
	})
}
// 委外加工原料结算单 - 批量审核退回;
export const STOCKING_API_WEIW_STUFF_SETTLE_BASIC_REJECTS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_settle_basic/Rejects',
		method: 'post',
		data: parameters
	})
}
// 委外加工原料结算单 - 审核退回;
export const STOCKING_API_WEIW_STUFF_SETTLE_BASIC_REJECT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_settle_basic/Reject',
		method: 'post',
		data: parameters
	})
}
// 委外加工原料结算单 - 作废;
export const STOCKING_API_WEIW_STUFF_SETTLE_BASIC_ABANDON = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_settle_basic/Abandon',
		method: 'post',
		data: parameters
	})
}
// 委外加工原料结算单 - 取消;
export const STOCKING_API_WEIW_STUFF_SETTLE_BASIC_CANCEL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_settle_basic/Cancel',
		method: 'post',
		data: parameters
	})
}
// 委外加工原料结算单明细 - 检索;
export const STOCKING_API_WEIW_STUFF_SETTLE_ITEM_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_settle_item/Gets',
		method: 'get',
		params: parameters
	})
}
// 委外加工原料结算单明细 - 创建;
export const STOCKING_API_WEIW_STUFF_SETTLE_ITEM_CREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_settle_item/Create',
		method: 'post',
		data: parameters
	})
}
// 委外加工原料结算单明细 - 更新;
export const STOCKING_API_WEIW_STUFF_SETTLE_ITEM_UPDATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_settle_item/Update',
		method: 'post',
		data: parameters
	})
}
// 委外加工原料结算单明细 - 删除;
export const STOCKING_API_WEIW_STUFF_SETTLE_ITEM_DELETE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_settle_item/Delete',
		method: 'post',
		data: parameters
	})
}
// 委外加工原料结算单明细 - 工费;
export const STOCKING_API_WEIW_STUFF_SETTLE_ITEM_CRAFTCREATE = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_settle_item/CraftCreate',
		method: 'post',
		data: parameters
	})
}
// 委外供应商存料库存变化日志 - 检索;
export const STOCKING_API_WEIW_STUFF_STOCK_LOG_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_stock_log/Gets',
		method: 'get',
		params: parameters
	})
}
// 委外供应商存料库存 - 检索;
export const STOCKING_API_WEIW_STUFF_STOCK_GETS = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_stock/Gets',
		method: 'get',
		params: parameters
	})
}
// 委外供应商存料库存 - 检索,合计;
export const STOCKING_API_WEIW_STUFF_STOCK_GETSTOTAL = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_stock/GetsTotal',
		method: 'get',
		params: parameters
	})
}
// 委外供应商存料库存 - 导出查询结果;
export const STOCKING_API_WEIW_STUFF_STOCK_EXPORT = (parameters) => {
	return fetch({
		cloud: 'Stocking',
		url: '/weiw_stuff_stock/Export',
		method: 'post',
		data: parameters
	})
}