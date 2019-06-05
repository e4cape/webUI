import fetch from '@/utilities/fetch'

const getQueryString = (...args)=> {
   var paras = []
   for (var i = 0; i < args.length; i = i + 2) {
       var val = args[i + 1]
       if (val !== '') {
           paras.push(args[i] + '=' + encodeURIComponent(val))
       }
    }
   if (paras.length) {
    return '?' + paras.join('&')
   }
   return ''
}
/**
* 保存礼品上架规则
* @param {Object} parameters -{rules:'String'}
*/
export const GIFTING_API_RULE_CREATEGIFTRULE = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Rule/CreateGiftRule/`,
       method: 'post',
       data: parameters
   })
}

/**
* 获取礼品上架规则
*/
export const GIFTING_API_RULE_GETGIFTRULE = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Rule/GetGiftRule/`,
       method: 'post'
   })
}

/**
* 保存礼品订单审核规则
* @param {String} rule
*/
export const GIFTING_API_RULE_SAVEORDERAUDITRULE = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{rule:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Rule/SaveOrderAuditRule/${getQueryString('rule',parameters.rule)}`,
       method: 'post'
   })
}

/**
* 获取礼品订单审核规则
*/
export const GIFTING_API_RULE_GETORDERAUDITRULE = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Rule/GetOrderAuditRule/`,
       method: 'post'
   })
}


/**
* 创建类别
* @param {Object} parameters -{parentId:'String',categoryName:'String',imageUrl:'String'}
*/
export const GIFTING_API_CATEGORY_CREATE = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Category/Create/`,
       method: 'post',
       data: parameters
   })
}

/**
* 删除类别
* @param {String} id
*/
export const GIFTING_API_CATEGORY_DELETE = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{id:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Category/Delete/${getQueryString('id',parameters.id)}`,
       method: 'post'
   })
}

/**
* 获取类别信息(用于更新)
* @param {String} id
*/
export const GIFTING_API_CATEGORY_GETBYID = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{id:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Category/GetById/${getQueryString('id',parameters.id)}`,
       method: 'post'
   })
}

/**
* 更新类别保存
* @param {Object} parameters -{categoryId:'Number',categoryName:'String',imageUrl:'String'}
*/
export const GIFTING_API_CATEGORY_SAVEUPDATE = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Category/SaveUpdate/`,
       method: 'post',
       data: parameters
   })
}

/**
* 查询类别列表
*/
export const GIFTING_API_CATEGORY_SEARCH = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Category/Search/`,
       method: 'post'
   })
}

/**
* 查询类别(绑定下拉列表)
*/
export const GIFTING_API_CATEGORY_GETBINDLIST = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Category/GetBindList/`,
       method: 'post'
   })
}


/**
* 
*/
export const GIFTING_API_MERCHANTSERVICE_GETALLSTORES = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/MerchantService/GetAllStores/`,
       method: 'post'
   })
}

/**
* 
*/
export const GIFTING_API_MERCHANTSERVICE_GETALLSUPPLIERS = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/MerchantService/GetAllSuppliers/`,
       method: 'post'
   })
}


/**
* 查询对账单列表
* @param {Object} parameters -{status:'String',orderCode:'String',supplierName:'String',receiveTimeStart:'String',receiveTimeEnd:'String',supplierCode:'String',characterTypeM:'String',storeName:'String',companyName:'String',companyCode:'String',storeCode:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_FINANCEDAILYBILL_SEARCH = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/FinanceDailyBill/Search/`,
       method: 'post',
       data: parameters
   })
}


/**
* 获取所有栏目-如：高性价比 ...；0101-礼品管理也是用这个接口
*/
export const GIFTING_API_PLATFORMRECOMMEND_GETSETTINGS = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/PlatformRecommend/GetSettings/`,
       method: 'post'
   })
}

/**
* 保存自定义栏目
* @param {Object} parameters -{settingOptionId:'String',name:'String'}
*/
export const GIFTING_API_PLATFORMRECOMMEND_SAVECUSTOMCOLUMN = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/PlatformRecommend/SaveCustomColumn/`,
       method: 'post',
       data: parameters
   })
}

/**
* 设置自定义栏目排序
* @param {Object} parameters -{settingOptionIds:'String'}
*/
export const GIFTING_API_PLATFORMRECOMMEND_SETCUSTOMCOLUMNSORT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/PlatformRecommend/SetCustomColumnSort/`,
       method: 'post',
       data: parameters
   })
}

/**
* 移除自定义栏目
* @param {Object} parameters -{settingOptionId:'String'}
*/
export const GIFTING_API_PLATFORMRECOMMEND_DELETECUSTOMCOLUMN = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/PlatformRecommend/DeleteCustomColumn/`,
       method: 'post',
       data: parameters
   })
}

/**
* 添加平台栏目礼品
* @param {Object} parameters -{settingOptionId:'String',giftIds:'String'}
*/
export const GIFTING_API_PLATFORMRECOMMEND_ADDGIFT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/PlatformRecommend/AddGift/`,
       method: 'post',
       data: parameters
   })
}

/**
* 怎么获取，查询，移除，置顶礼物，请看 0103商城礼品推荐 对应的 api
*/
export const GIFTING_API_PLATFORMRECOMMEND_REMARKS = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/PlatformRecommend/Remarks/`,
       method: 'post'
   })
}

/**
* 商家浏览 平台推荐礼品 如高性价比
* @param {Object} parameters -{settingOptionId:'String',unselected:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_PLATFORMRECOMMEND_GETPLATFORMRECOMMENDGIFTSBYSTORE = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/PlatformRecommend/GetPlatformRecommendGiftsByStore/`,
       method: 'post',
       data: parameters
   })
}

/**
* 商家浏览 查询未选择的礼品Id
* @param {String} settingOptionId
*/
export const GIFTING_API_PLATFORMRECOMMEND_GETPLATFORMRECOMMENDGIFTIDSBYSTORE = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{settingOptionId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/PlatformRecommend/GetPlatformRecommendGiftIdsByStore/${getQueryString('settingOptionId',parameters.settingOptionId)}`,
       method: 'post'
   })
}


/**
* 查询账户管理列表
* @param {Object} parameters -{characterType:'String',companyCode:'String',companyName:'String',storeCode:'String',storeName:'String',balanceMin:'String',balanceMax:'String',rechargeMin:'String',rechargeMax:'String',rechargeQtyMin:'String',rechargeQtyMax:'String',rechargeStart:'String',rechargeEnd:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_ACCOUNT_SEARCH = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Account/Search/`,
       method: 'post',
       data: parameters
   })
}

/**
* 查询账户流水
* @param {Object} parameters -{characterId:'Number',storeBalanceLogTypes:'String',createTimeStart:'String',createTimeEnd:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_ACCOUNT_GETACCOUNTITEMS = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Account/GetAccountItems/`,
       method: 'post',
       data: parameters
   })
}


/**
* 审核
* @param {String} monthlyBillId
*/
export const GIFTING_API_FINANCEMONTHLYBILL_AUDIT = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{monthlyBillId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/FinanceMonthlyBill/Audit/${getQueryString('monthlyBillId',parameters.monthlyBillId)}`,
       method: 'post'
   })
}

/**
* 新建结算单
* @param {Object} parameters -{characterId:'Number',billEtimeEnd:'String',remark:'String'}
*/
export const GIFTING_API_FINANCEMONTHLYBILL_CREATEFINANCEMONTHLYBILL = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/FinanceMonthlyBill/CreateFinanceMonthlyBill/`,
       method: 'post',
       data: parameters
   })
}

/**
* 获取结算单信息
* @param {String} monthlyBillId
*/
export const GIFTING_API_FINANCEMONTHLYBILL_GETFINANCEMONTHLYBILL = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{monthlyBillId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/FinanceMonthlyBill/GetFinanceMonthlyBill/${getQueryString('monthlyBillId',parameters.monthlyBillId)}`,
       method: 'post'
   })
}

/**
* 获取结算单明细
* @param {Object} parameters -{monthlyBillId:'Number',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_FINANCEMONTHLYBILL_GETFINANCEMONTHLYBILLDETAILS = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/FinanceMonthlyBill/GetFinanceMonthlyBillDetails/`,
       method: 'post',
       data: parameters
   })
}

/**
* 获取货品批发金额
* @param {Object} parameters -{characterId:'String',dateStart:'String',dateEnd:'String'}
*/
export const GIFTING_API_FINANCEMONTHLYBILL_GETMONTHLYPRICE = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/FinanceMonthlyBill/GetMonthlyPrice/`,
       method: 'post',
       data: parameters
   })
}

/**
* 作废
* @param {String} monthlyBillId
*/
export const GIFTING_API_FINANCEMONTHLYBILL_INVALID = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{monthlyBillId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/FinanceMonthlyBill/Invalid/${getQueryString('monthlyBillId',parameters.monthlyBillId)}`,
       method: 'post'
   })
}

/**
* 查询结算订单列表
* @param {Object} parameters -{status:'String',billCode:'String',supplierCode:'String',supplierName:'String',createTimeStart:'String',createTimeEnd:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_FINANCEMONTHLYBILL_SEARCH = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/FinanceMonthlyBill/Search/`,
       method: 'post',
       data: parameters
   })
}

/**
* 查询结算账期列表
* @param {Object} parameters -{supplierCode:'String',supplierName:'String',lastBillTimeStart:'String',lastBillTimeEnd:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_FINANCEMONTHLYBILL_SEARCHSETTLES = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/FinanceMonthlyBill/SearchSettles/`,
       method: 'post',
       data: parameters
   })
}


/**
* 批量发货
* @param {Object} parameters -{deliveryOrders:'String'}
*/
export const GIFTING_API_GIFTSALEORDERFORC_BATCHDELIVERY = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/GiftSaleOrderForC/BatchDelivery/`,
       method: 'post',
       data: parameters
   })
}

/**
* 发货/重新发货
* @param {Object} parameters -{orderId:'Number',orderCode:'String',expressType:'String',expressCode:'String',expressNote:'String',receiveType:'String'}
*/
export const GIFTING_API_GIFTSALEORDERFORC_DELIVERY = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/GiftSaleOrderForC/Delivery/`,
       method: 'post',
       data: parameters
   })
}

/**
* 礼品兑换明细
* @param {Object} parameters -{orderStatus:'String',giftOrderType:'String',orderCode:'String',giftName:'String',barCode:'String',createTimeStart:'String',createTimeEnd:'String',payTimeStart:'String',payTimeEnd:'String',expressTimeStart:'String',expressTimeEnd:'String',mobile:'String',receiveMobile:'String',supplierId:'String',charactorId:'String',comanyName:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_GIFTSALEORDERFORC_GETEXCHANGEDETAILS = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/GiftSaleOrderForC/GetExchangeDetails/`,
       method: 'post',
       data: parameters
   })
}

/**
* 获取订单详情
* @param {String} orderId
*/
export const GIFTING_API_GIFTSALEORDERFORC_GETORDER = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{orderId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/GiftSaleOrderForC/GetOrder/${getQueryString('orderId',parameters.orderId)}`,
       method: 'post'
   })
}

/**
* 导出订单的接口
* @param {Object} parameters -{giftOrderType:'String',orderCode:'String',expressTimeStart:'String',expressTimeEnd:'String',createTimeStart:'String',createTimeEnd:'String',payTimeStart:'String',payTimeEnd:'String',mobile:'String',receiveMobile:'String',storeId:'String',storeName:'String',supplierId:'String',supplierName:'String',orderStatus:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_GIFTSALEORDERFORC_GETORDERITEMSFOREXPORT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/GiftSaleOrderForC/GetOrderItemsForExport/`,
       method: 'post',
       data: parameters
   })
}

/**
* 查询批量发货的订单
* @param {Object} parameters -{orderIds:'String'}
*/
export const GIFTING_API_GIFTSALEORDERFORC_GETORDERSFORBATCHDELIVERY = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/GiftSaleOrderForC/GetOrdersForBatchDelivery/`,
       method: 'post',
       data: parameters
   })
}

/**
* 导出收货人信息的接口
* @param {Object} parameters -{giftOrderType:'String',orderCode:'String',expressTimeStart:'String',expressTimeEnd:'String',createTimeStart:'String',createTimeEnd:'String',payTimeStart:'String',payTimeEnd:'String',mobile:'String',receiveMobile:'String',storeId:'String',storeName:'String',supplierId:'String',supplierName:'String',orderStatus:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_GIFTSALEORDERFORC_GETRECEIVERINFOFOREXPORT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/GiftSaleOrderForC/GetReceiverInfoForExport/`,
       method: 'post',
       data: parameters
   })
}

/**
* 作废订单
* @param {String} orderId
*/
export const GIFTING_API_GIFTSALEORDERFORC_INVALID = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{orderId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/GiftSaleOrderForC/Invalid/${getQueryString('orderId',parameters.orderId)}`,
       method: 'post'
   })
}

/**
* 查询礼品订单
* @param {Object} parameters -{giftOrderType:'String',orderCode:'String',expressTimeStart:'String',expressTimeEnd:'String',createTimeStart:'String',createTimeEnd:'String',payTimeStart:'String',payTimeEnd:'String',mobile:'String',receiveMobile:'String',storeId:'String',storeName:'String',supplierId:'String',supplierName:'String',orderStatus:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_GIFTSALEORDERFORC_SEARCH = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/GiftSaleOrderForC/Search/`,
       method: 'post',
       data: parameters
   })
}

/**
* 
* @param {String} orderId
*/
export const GIFTING_API_GIFTSALEORDERFORC_AUDIT = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{orderId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/GiftSaleOrderForC/Audit/${getQueryString('orderId',parameters.orderId)}`,
       method: 'post'
   })
}


/**
* 批量发货
* @param {Object} parameters -{deliveryOrders:'String'}
*/
export const GIFTING_API_GIFTSALEORDER_BATCHDELIVERY = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/GiftSaleOrder/BatchDelivery/`,
       method: 'post',
       data: parameters
   })
}

/**
* 发货/重新发货
* @param {Object} parameters -{orderId:'Number',orderCode:'String',expressType:'String',expressCode:'String',expressNote:'String',receiveType:'String'}
*/
export const GIFTING_API_GIFTSALEORDER_DELIVERY = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/GiftSaleOrder/Delivery/`,
       method: 'post',
       data: parameters
   })
}

/**
* 礼品兑换明细
* @param {Object} parameters -{orderStatus:'String',giftOrderType:'String',orderCode:'String',giftName:'String',barCode:'String',createTimeStart:'String',createTimeEnd:'String',payTimeStart:'String',payTimeEnd:'String',expressTimeStart:'String',expressTimeEnd:'String',mobile:'String',receiveMobile:'String',supplierId:'String',charactorId:'String',comanyName:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_GIFTSALEORDER_GETEXCHANGEDETAILS = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/GiftSaleOrder/GetExchangeDetails/`,
       method: 'post',
       data: parameters
   })
}

/**
* 获取订单详情
* @param {String} orderId
*/
export const GIFTING_API_GIFTSALEORDER_GETORDER = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{orderId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/GiftSaleOrder/GetOrder/${getQueryString('orderId',parameters.orderId)}`,
       method: 'post'
   })
}

/**
* 导出订单的接口
* @param {Object} parameters -{giftOrderType:'String',orderCode:'String',expressTimeStart:'String',expressTimeEnd:'String',createTimeStart:'String',createTimeEnd:'String',payTimeStart:'String',payTimeEnd:'String',mobile:'String',receiveMobile:'String',storeId:'String',storeName:'String',supplierId:'String',supplierName:'String',orderStatus:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_GIFTSALEORDER_GETORDERITEMSFOREXPORT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/GiftSaleOrder/GetOrderItemsForExport/`,
       method: 'post',
       data: parameters
   })
}

/**
* 查询批量发货的订单
* @param {Object} parameters -{orderIds:'String'}
*/
export const GIFTING_API_GIFTSALEORDER_GETORDERSFORBATCHDELIVERY = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/GiftSaleOrder/GetOrdersForBatchDelivery/`,
       method: 'post',
       data: parameters
   })
}

/**
* 导出收货人信息的接口
* @param {Object} parameters -{giftOrderType:'String',orderCode:'String',expressTimeStart:'String',expressTimeEnd:'String',createTimeStart:'String',createTimeEnd:'String',payTimeStart:'String',payTimeEnd:'String',mobile:'String',receiveMobile:'String',storeId:'String',storeName:'String',supplierId:'String',supplierName:'String',orderStatus:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_GIFTSALEORDER_GETRECEIVERINFOFOREXPORT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/GiftSaleOrder/GetReceiverInfoForExport/`,
       method: 'post',
       data: parameters
   })
}

/**
* 作废订单
* @param {String} orderId
*/
export const GIFTING_API_GIFTSALEORDER_INVALID = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{orderId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/GiftSaleOrder/Invalid/${getQueryString('orderId',parameters.orderId)}`,
       method: 'post'
   })
}

/**
* 审核订单
* @param {String} orderId
*/
export const GIFTING_API_GIFTSALEORDER_AUDIT = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{orderId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/GiftSaleOrder/Audit/${getQueryString('orderId',parameters.orderId)}`,
       method: 'post'
   })
}

/**
* 查询礼品订单
* @param {Object} parameters -{giftOrderType:'String',orderCode:'String',expressTimeStart:'String',expressTimeEnd:'String',createTimeStart:'String',createTimeEnd:'String',payTimeStart:'String',payTimeEnd:'String',mobile:'String',receiveMobile:'String',storeId:'String',storeName:'String',supplierId:'String',supplierName:'String',orderStatus:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_GIFTSALEORDER_SEARCH = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/GiftSaleOrder/Search/`,
       method: 'post',
       data: parameters
   })
}


/**
* 获取平台相关设置
*/
export const GIFTING_API_PLATFORMSETTING_GETSETTINGS = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/PlatformSetting/GetSettings/`,
       method: 'post'
   })
}

/**
* 添加平台栏目礼品
* @param {Object} parameters -{settingOptionId:'String',giftIds:'String'}
*/
export const GIFTING_API_PLATFORMSETTING_ADDGIFT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/PlatformSetting/AddGift/`,
       method: 'post',
       data: parameters
   })
}

/**
* 移除平台栏目对应的礼品
* @param {Object} parameters -{settingOptionGiftIds:'String'}
*/
export const GIFTING_API_PLATFORMSETTING_REMOVEGIFT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/PlatformSetting/RemoveGift/`,
       method: 'post',
       data: parameters
   })
}

/**
* 置顶平台栏目对应的礼品
* @param {Object} parameters -{settingOptionGiftId:'String'}
*/
export const GIFTING_API_PLATFORMSETTING_SETGIFTTOP = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/PlatformSetting/SetGiftTop/`,
       method: 'post',
       data: parameters
   })
}

/**
* 搜索平台某栏目下待选的礼品
* @param {Object} parameters -{supplierName:'String',settingOptionId:'String',categoryId:'String',barCode:'String',giftName:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_PLATFORMSETTING_SEARCHOPTIONALGIFT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/PlatformSetting/SearchOptionalGift/`,
       method: 'post',
       data: parameters
   })
}

/**
* 获取平台某栏目下的所有已选礼品
* @param {Object} parameters -{settingOptionId:'String'}
*/
export const GIFTING_API_PLATFORMSETTING_GETSETTINGOPTIONGIFT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/PlatformSetting/GetSettingOptionGift/`,
       method: 'post',
       data: parameters
   })
}


/**
* 
* @param {Object} parameters -{apiKey:'String',exportFields:'String',exportType:'Number',records:'String',apiParameter:'String'}
*/
export const GIFTING_API_STOREEXPORTER_EXPORTTOFILE = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreExporter/ExportToFile/`,
       method: 'post',
       data: parameters
   })
}

/**
* 
* @param {Object} parameters -{apiKey:'String'}
*/
export const GIFTING_API_STOREEXPORTER_GETEXPORTFIELDS = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreExporter/GetExportFields/`,
       method: 'post',
       data: parameters
   })
}


/**
* 获取自动上架规则设置
*/
export const GIFTING_API_ONSHELFERULE_GETONSHELFERULE = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/OnShelfeRule/GetOnShelfeRule/`,
       method: 'post'
   })
}

/**
* 自动上架规则设置开关(0=手动,1=自动)
* @param {String} i
*/
export const GIFTING_API_ONSHELFERULE_ONSHELFERULE = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{i:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/OnShelfeRule/OnShelfeRule/${getQueryString('i',parameters.i)}`,
       method: 'post'
   })
}


/**
* 获取礼品详情(用于查看礼品信息)
* @param {String} giftId
*/
export const GIFTING_API_GIFT_GETDETAILBYSTORE = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{giftId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/GetDetailByStore/${getQueryString('giftId',parameters.giftId)}`,
       method: 'post'
   })
}

/**
* 获取礼品信息(用于审核)
* @param {String} storeGiftId
*/
export const GIFTING_API_GIFT_GETAUDITDETAILBYSTORE = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{storeGiftId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/GetAuditDetailByStore/${getQueryString('storeGiftId',parameters.storeGiftId)}`,
       method: 'post'
   })
}

/**
* 查询礼品信息(用于更新礼品信息)
* @param {String} storeGiftId
*/
export const GIFTING_API_GIFT_GETGIFTWITHATTRS = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{storeGiftId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/GetGiftWithAttrs/${getQueryString('storeGiftId',parameters.storeGiftId)}`,
       method: 'post'
   })
}

/**
* 获取礼品库礼品信息
* @param {Object} parameters -{giftName:'String',barCode:'String',categoryId:'String',wholesalePriceMax:'String',wholesalePriceMin:'String',retailPriceMax:'String',retailPriceMin:'String',createTimeStart:'String',createTimeEnd:'String',selected:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_GIFT_SEARCHWAREHOUSE = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/SearchWarehouse/`,
       method: 'post',
       data: parameters
   })
}

/**
* 获取礼品动态信息
* @param {Object} parameters -{giftName:'String',barCode:'String',categoryId:'String',wholesalePriceMax:'String',wholesalePriceMin:'String',retailPriceMax:'String',retailPriceMin:'String',createTimeStart:'String',createTimeEnd:'String',selected:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_GIFT_SEARCHDYNAMIC = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/SearchDynamic/`,
       method: 'post',
       data: parameters
   })
}

/**
* 获取未选择的礼品id集合
* @param {Object} parameters -{giftName:'String',barCode:'String',categoryId:'String',wholesalePriceMax:'String',wholesalePriceMin:'String',retailPriceMax:'String',retailPriceMin:'String',createTimeStart:'String',createTimeEnd:'String',selected:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_GIFT_GETNOTSELECTEDGIFTIDS = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/GetNotSelectedGiftIds/`,
       method: 'post',
       data: parameters
   })
}

/**
* 
* @param {Object} parameters -{capacity:'Number',item:'String'}
*/
export const GIFTING_API_GIFT_GETONSHELFBYAGENT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/GetOnShelfByAgent/`,
       method: 'post',
       data: parameters
   })
}

/**
* 获取礼品自动上架规则设置
* @param {String} giftId
*/
export const GIFTING_API_GIFT_GETGIFTONSHELFSETTINGBYGIFTID = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{giftId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/GetGiftOnShelfSettingByGiftId/${getQueryString('giftId',parameters.giftId)}`,
       method: 'post'
   })
}

/**
* 创建礼品
* @param {Object} parameters -{categoryId1:'Number',categoryId2:'Number',brandId:'String',giftName:'String',mktTitle:'String',scoreType:'Number',goldenRice:'String',score:'String',wholesalePrice:'String',retailPrice:'String',supplyPrice:'String',arrayImageUrls:'String',imageUrl:'String',barCode:'String',description:'String',submitType:'Number',giftAttrs:'String',giftParams:'String'}
*/
export const GIFTING_API_GIFT_CREATEBYSTORE = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/CreateByStore/`,
       method: 'post',
       data: parameters
   })
}

/**
* 更新自营礼品
* @param {Object} parameters -{giftId:'Number',categoryId1:'Number',categoryId2:'Number',brandId:'String',giftName:'String',mktTitle:'String',scoreType:'Number',wholesalePrice:'String',retailPrice:'String',supplyPrice:'String',arrayImageUrls:'String',imageUrl:'String',barCode:'String',description:'String',goldenRice:'String',score:'String',giftAttrs:'String',giftParams:'String',giftSubmitType:'Number'}
*/
export const GIFTING_API_GIFT_SAVEUPDATEBYSTORE = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/SaveUpdateByStore/`,
       method: 'post',
       data: parameters
   })
}

/**
* 更新代理礼品
* @param {Object} parameters -{storeGiftId:'String',giftId:'Number',mktTitle:'String',scoreType:'String',goldenRice:'String',score:'String',giftSubmitType:'String'}
*/
export const GIFTING_API_GIFT_SAVEUPDATEBYAGENT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/SaveUpdateByAgent/`,
       method: 'post',
       data: parameters
   })
}

/**
* 审核礼品保存
* @param {Object} parameters -{giftId:'String',checkNote:'String',status:'String',storeGiftId:'String'}
*/
export const GIFTING_API_GIFT_SAVEAUDIT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/SaveAudit/`,
       method: 'post',
       data: parameters
   })
}

/**
* 取消审核
* @param {String} storeGiftId
*/
export const GIFTING_API_GIFT_CANCELAUDIT = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{storeGiftId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/CancelAudit/${getQueryString('storeGiftId',parameters.storeGiftId)}`,
       method: 'post'
   })
}

/**
* 礼品作废
* @param {String} storeGiftId
*/
export const GIFTING_API_GIFT_NULLIFYBYSTORE = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{storeGiftId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/NullifyByStore/${getQueryString('storeGiftId',parameters.storeGiftId)}`,
       method: 'post'
   })
}

/**
* 代理礼品选择并上架
* @param {Object} parameters -{giftId:'Number',scoreType:'String',goldenRice:'String',score:'String'}
*/
export const GIFTING_API_GIFT_SELECTONSHELF = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/SelectOnShelf/`,
       method: 'post',
       data: parameters
   })
}

/**
* 代理批量操作(0=上架,1=下架,2=移除)
* @param {Object} parameters -{items:'String',operationType:'String'}
*/
export const GIFTING_API_GIFT_BATCHOPERATIONBYAGENT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/BatchOperationByAgent/`,
       method: 'post',
       data: parameters
   })
}

/**
* 自营批量操作(0 上架,1 下架)
* @param {Object} parameters -{storeGiftIds:'String',operationType:'String'}
*/
export const GIFTING_API_GIFT_BATCHOPERATIONBYSTORE = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/BatchOperationByStore/`,
       method: 'post',
       data: parameters
   })
}

/**
* 
* @param {Object} parameters -{capacity:'Number',item:'Number'}
*/
export const GIFTING_API_GIFT_ADDWAREHOUSE = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/AddWarehouse/`,
       method: 'post',
       data: parameters
   })
}

/**
* 批量操作代理礼品(下架/移除)
* @param {Object} parameters -{storeGiftIds:'String',operationType:'String'}
*/
export const GIFTING_API_GIFT_OFFSHELFOPERATIONBYAGENT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/OffShelfOperationByAgent/`,
       method: 'post',
       data: parameters
   })
}

/**
* 查询礼品分页
* @param {Object} parameters -{giftName:'String',barCode:'String',supplierName:'String',categoryId:'String',createTimeStart:'String',createTimeEnd:'String',lastTimeStart:'String',lastTimeEnd:'String',onlineStatus:'String',status:'String',giftType:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_GIFT_SEARCH = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/Search/`,
       method: 'post',
       data: parameters
   })
}

/**
* 获取礼品详情(用于查看礼品信息)
* @param {String} giftId
*/
export const GIFTING_API_GIFT_GIFTDETAILBYSUPPLIER = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{giftId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/GiftDetailBySupplier/${getQueryString('giftId',parameters.giftId)}`,
       method: 'post'
   })
}

/**
* 获取礼品信息(用于审核)
* @param {String} giftId
*/
export const GIFTING_API_GIFT_GETAUDITDETAILBYSUPPLIER = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{giftId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/GetAuditDetailBySupplier/${getQueryString('giftId',parameters.giftId)}`,
       method: 'post'
   })
}

/**
* 获取礼品信息(用于更新)
* @param {String} giftId
*/
export const GIFTING_API_GIFT_GETBYIDBYSUPPLIER = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{giftId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/GetByIdBySupplier/${getQueryString('giftId',parameters.giftId)}`,
       method: 'post'
   })
}

/**
* 创建礼品
* @param {Object} parameters -{categoryId1:'Number',categoryId2:'Number',brandId:'String',giftName:'String',mktTitle:'String',wholesalePrice:'String',retailPrice:'String',arrayImageUrls:'String',imageUrl:'String',barCode:'String',description:'String',submitType:'Number',giftAttrs:'String',giftParams:'String'}
*/
export const GIFTING_API_GIFT_CREATEBYSUPPLIER = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/CreateBySupplier/`,
       method: 'post',
       data: parameters
   })
}

/**
* 更新礼品保存
* @param {Object} parameters -{giftId:'Number',categoryId1:'Number',categoryId2:'Number',brandId:'String',giftName:'String',mktTitle:'String',retailPrice:'Number',wholesalePrice:'String',arrayImageUrls:'String',imageUrl:'String',barCode:'String',description:'String',giftAttrs:'String',giftParams:'String',submitType:'Number'}
*/
export const GIFTING_API_GIFT_SAVEUPDATEBYSUPPLIER = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/SaveUpdateBySupplier/`,
       method: 'post',
       data: parameters
   })
}

/**
* 礼品作废
* @param {String} id
*/
export const GIFTING_API_GIFT_NULLIFYBYSUPPLIER = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{id:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/NullifyBySupplier/${getQueryString('id',parameters.id)}`,
       method: 'post'
   })
}

/**
* 单个/批量上下架
* @param {Object} parameters -{giftIds:'String',operationType:'String'}
*/
export const GIFTING_API_GIFT_ONSHELVESBYSUPPLIER = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/OnShelvesBySupplier/`,
       method: 'post',
       data: parameters
   })
}

/**
* 平台上、下架
* @param {Object} parameters -{giftIds:'String',operationType:'String'}
*/
export const GIFTING_API_GIFT_ONSHELVESBYSTATION = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/OnShelvesByStation/`,
       method: 'post',
       data: parameters
   })
}

/**
* 取消审核
* @param {String} giftId
*/
export const GIFTING_API_GIFT_CANCELAUDITBYSTATION = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{giftId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Gift/CancelAuditByStation/${getQueryString('giftId',parameters.giftId)}`,
       method: 'post'
   })
}


/**
* 创建品牌
* @param {Object} parameters -{code:'String',cNName:'String',eNName:'String',imageUrl:'String'}
*/
export const GIFTING_API_BRAND_CREATE = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Brand/Create/`,
       method: 'post',
       data: parameters
   })
}

/**
* 获取品牌信息(用于更新)
* @param {String} id
*/
export const GIFTING_API_BRAND_GETBYID = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{id:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Brand/GetById/${getQueryString('id',parameters.id)}`,
       method: 'post'
   })
}

/**
* 品牌作废
* @param {Object} parameters -{brandId:'Number',status:'Number'}
*/
export const GIFTING_API_BRAND_NULLIFYGIFT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Brand/NullifyGift/`,
       method: 'post',
       data: parameters
   })
}

/**
* 审核品牌
* @param {Object} parameters -{brandId:'Number',status:'Number'}
*/
export const GIFTING_API_BRAND_SAVEAUDIT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Brand/SaveAudit/`,
       method: 'post',
       data: parameters
   })
}

/**
* 更新品牌
* @param {Object} parameters -{brandId:'Number',code:'String',cNName:'String',eNName:'String',imageUrl:'String'}
*/
export const GIFTING_API_BRAND_SAVEUPDATE = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Brand/SaveUpdate/`,
       method: 'post',
       data: parameters
   })
}

/**
* 分页获取品牌信息
* @param {Object} parameters -{cNName:'String',eNName:'String',status:'String',createTimeStart:'String',createTimeEnd:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_BRAND_SEARCH = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Brand/Search/`,
       method: 'post',
       data: parameters
   })
}

/**
* 获取品牌信息(绑定下拉框)
*/
export const GIFTING_API_BRAND_GETBINDLIST = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Brand/GetBindList/`,
       method: 'post'
   })
}


/**
* 获取首页账户余额统计
*/
export const GIFTING_API_STATISTIC_GETBALANCESTATISTIC = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Statistic/GetBalanceStatistic/`,
       method: 'post'
   })
}

/**
* 获取首页统计信息
*/
export const GIFTING_API_STATISTIC_GETSTATISTICSINFO = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Statistic/GetStatisticsInfo/`,
       method: 'post'
   })
}

/**
* 获取销售报表统计信息
* @param {Object} parameters -{timeStart:'String',timeEnd:'String'}
*/
export const GIFTING_API_STATISTIC_SALESREPORTINFO = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Statistic/SalesReportInfo/`,
       method: 'get',
       params: parameters
   })
}


/**
* 获取充值设置
*/
export const GIFTING_API_ORDERRECHARGE_GETRECHARGESETTING = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/OrderRecharge/GetRechargeSetting/`,
       method: 'post'
   })
}

/**
* 提交充值
* @param {Object} parameters -{price:'Number'}
*/
export const GIFTING_API_ORDERRECHARGE_RECHARGE = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/OrderRecharge/Recharge/`,
       method: 'post',
       data: parameters
   })
}

/**
* 查看订单
* @param {String} orderId
*/
export const GIFTING_API_ORDERRECHARGE_QUERYORDER = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{orderId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/OrderRecharge/QueryOrder/${getQueryString('orderId',parameters.orderId)}`,
       method: 'post'
   })
}

/**
* 充值对账单
* @param {Object} parameters -{storeName:'String',companyName:'String',companyCode:'String',storeCode:'String',status:'String',createTimeStart:'String',createTimeEnd:'String',characterType:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_ORDERRECHARGE_SEARCH = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/OrderRecharge/Search/`,
       method: 'post',
       data: parameters
   })
}

/**
* 查询充值统计列表
* @param {Object} parameters -{createTimeStart:'String',createTimeEnd:'String',storeName:'String',companyName:'String',companyCode:'String',storeCode:'String',status:'String',characterType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_ORDERRECHARGE_GETSTORETOTALLIST = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/OrderRecharge/GetStoreTotalList/`,
       method: 'post',
       data: parameters
   })
}

/**
* 获取充值记录
* @param {Object} parameters -{orderId:'String',createTimeStart:'String',createTimeEnd:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_ORDERRECHARGE_GETRECHARGEITEMS = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/OrderRecharge/GetRechargeItems/`,
       method: 'post',
       data: parameters
   })
}

/**
* 充值统计
* @param {Object} parameters -{createTimeStart:'String',createTimeEnd:'String',storeName:'String',companyName:'String',companyCode:'String',storeCode:'String',status:'String',characterType:'String'}
*/
export const GIFTING_API_ORDERRECHARGE_GETTOTAL = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/OrderRecharge/GetTotal/`,
       method: 'post',
       data: parameters
   })
}


/**
* 创建供应商
* @param {Object} parameters -{accountCode:'String',address:'String',administratorId:'String',bankName:'String',businessLicense:'String',businessUrl:'String',cityId:'Number',cityName:'String',contact:'String',email:'String',imageUrl:'String',introduction:'String',mobile:'String',password:'String',phone:'String',provinceId:'Number',provinceName:'String',qQ:'String',shortName:'String',supplierCode:'String',supplierName:'String',surname:'String',townId:'Number',townName:'String',wechart:'String',packId:'String',taxes:'String'}
*/
export const GIFTING_API_SUPPLIER_CREATE = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Supplier/Create/`,
       method: 'post',
       data: parameters
   })
}

/**
* 供应商停用
* @param {String} id
*/
export const GIFTING_API_SUPPLIER_DISABLE = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{id:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Supplier/Disable/${getQueryString('id',parameters.id)}`,
       method: 'post'
   })
}

/**
* 供应商启用
* @param {String} id
*/
export const GIFTING_API_SUPPLIER_ENABLE = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{id:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Supplier/Enable/${getQueryString('id',parameters.id)}`,
       method: 'post'
   })
}

/**
* 根据id获取供应商信息
* @param {String} supplierId
*/
export const GIFTING_API_SUPPLIER_GETBYID = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{supplierId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Supplier/GetById/${getQueryString('supplierId',parameters.supplierId)}`,
       method: 'post'
   })
}

/**
* 查询供应商列表
* @param {Object} parameters -{supplierCode:'String',supplierName:'String',contact:'String',mobile:'String',phone:'String',area:'String',state:'String',createTime1:'String',createTime2:'String',packId:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_SUPPLIER_SEARCH = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Supplier/Search/`,
       method: 'post',
       data: parameters
   })
}

/**
* 更新
* @param {Object} parameters -{accountCode:'String',address:'String',administratorId:'String',bankName:'String',taxes:'Number',businessLicense:'String',businessUrl:'String',cityId:'String',cityName:'String',contact:'String',email:'String',imageUrl:'String',introduction:'String',mobile:'String',password:'String',phone:'String',provinceId:'String',provinceName:'String',qQ:'String',shortName:'String',supplierCode:'String',supplierId:'Number',supplierName:'String',surname:'String',townId:'Number',townName:'String',wechart:'String',packId:'String'}
*/
export const GIFTING_API_SUPPLIER_UPDATE = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Supplier/Update/`,
       method: 'post',
       data: parameters
   })
}

/**
* 更新密码
* @param {Object} parameters -{originalPassword:'String',newPassword:'String',confirmPassword:'String'}
*/
export const GIFTING_API_SUPPLIER_UPDATEPASSWORD = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Supplier/UpdatePassword/`,
       method: 'post',
       data: parameters
   })
}


/**
* 
*/
export const GIFTING_API_STOREPAYMENTBASE_TESTPAY = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StorePaymentBase/TestPay/`,
       method: 'get'
   })
}


/**
* 是否开启市场价格
*/
export const GIFTING_API_STORECATEGORYPRICE_ISENABLEMARKETPRICERATE = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreCategoryPrice/IsEnableMarketPriceRate/`,
       method: 'post'
   })
}

/**
* 设置是否开启市场价格
* @param {Object} parameters -{enable:'String'}
*/
export const GIFTING_API_STORECATEGORYPRICE_SETENABLEMARKETPRICERATE = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreCategoryPrice/SetEnableMarketPriceRate/`,
       method: 'post',
       data: parameters
   })
}

/**
* 获取市场价详细设置
*/
export const GIFTING_API_STORECATEGORYPRICE_GETSTORECATEGORYPRICES = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreCategoryPrice/GetStoreCategoryPrices/`,
       method: 'post'
   })
}

/**
* 更新市场价设置
* @param {Object} parameters -{items:'String'}
*/
export const GIFTING_API_STORECATEGORYPRICE_UPDATESTORECATEGORYPRICES = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreCategoryPrice/UpdateStoreCategoryPrices/`,
       method: 'post',
       data: parameters
   })
}


/**
* 
* @param {Object} parameters -}
*/
export const GIFTING_API_SCRIPTBUILDER_GENERATEALL = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{type:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/ScriptBuilder/GenerateAll/${getQueryString('type',parameters.type)}`,
       method: 'get'
   })
}

/**
* 
*/
export const GIFTING_API_SCRIPTBUILDER_GENERATEALLENUM = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/ScriptBuilder/GenerateAllEnum/`,
       method: 'get'
   })
}


/**
* 获取广告信息，现在只有固定一条
*/
export const GIFTING_API_ADVBASIC_GETDEFAULTADV = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/AdvBasic/GetDefaultAdv/`,
       method: 'post'
   })
}

/**
* 编辑广告,成功会返还Id
* @param {Object} parameters -{advBasicId:'String',title:'String',imageUrl:'String',timeStart:'String',timeEnd:'String',status:'Number'}
*/
export const GIFTING_API_ADVBASIC_SAVEADV = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/AdvBasic/SaveAdv/`,
       method: 'post',
       data: parameters
   })
}

/**
* 获取某广告下的礼品
* @param {Object} parameters -{advBasicId:'String',supplierName:'String',categoryId:'String',barCode:'String',giftName:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_ADVBASIC_SEARCHADVGIFTS = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/AdvBasic/SearchAdvGifts/`,
       method: 'post',
       data: parameters
   })
}

/**
* 搜索某广告下待选礼品
* @param {Object} parameters -{advBasicId:'String',supplierName:'String',categoryId:'String',barCode:'String',giftName:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_ADVBASIC_SEARCHOPTIONALGIFT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/AdvBasic/SearchOptionalGift/`,
       method: 'post',
       data: parameters
   })
}

/**
* 批量添加某广告下的礼品
* @param {Object} parameters -{advBasicId:'String',giftIds:'String'}
*/
export const GIFTING_API_ADVBASIC_BATCHADDADVGIFT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/AdvBasic/BatchAddAdvGift/`,
       method: 'post',
       data: parameters
   })
}

/**
* 批量移除某广告下的礼品
* @param {Object} parameters -}
*/
export const GIFTING_API_ADVBASIC_BATCHREMOVEADVGIFT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/AdvBasic/BatchRemoveAdvGift/`,
       method: 'post',
       data: parameters
   })
}

/**
* 设置某礼品置顶
* @param {Object} parameters -{advGiftId:'String'}
*/
export const GIFTING_API_ADVBASIC_SETADVGIFTTOP = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/AdvBasic/SetAdvGiftTop/`,
       method: 'post',
       data: parameters
   })
}


/**
* 
*/
export const GIFTING_API_UPLOADER_UPLOADTOTEMPASYNC = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Uploader/UploadToTempAsync/`,
       method: 'post'
   })
}

/**
* 
* @param {String} pathType
*/
export const GIFTING_API_UPLOADER_UPLOADIMAGEASYNC = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{pathType:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Uploader/UploadImageAsync/${getQueryString('pathType',parameters.pathType)}`,
       method: 'post'
   })
}

/**
* 
* @param {String} pathType
*/
export const GIFTING_API_UPLOADER_UPLOADFILEASYNC = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{pathType:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/Uploader/UploadFileAsync/${getQueryString('pathType',parameters.pathType)}`,
       method: 'post'
   })
}


/**
* 获取商城相关设置
*/
export const GIFTING_API_STORESETTING_GETSETTINGS = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreSetting/GetSettings/`,
       method: 'post'
   })
}

/**
* 获取一个商城发现好礼下的分类
*/
export const GIFTING_API_STORESETTING_GETCATEGORIES = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreSetting/GetCategories/`,
       method: 'post'
   })
}

/**
* 设置商城分类标题--发现好礼
* @param {Object} parameters -{settingOptionId:'String',title:'String'}
*/
export const GIFTING_API_STORESETTING_SETCATEGORYTITLE = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreSetting/SetCategoryTitle/`,
       method: 'post',
       data: parameters
   })
}

/**
* 获取待选的商城分类
*/
export const GIFTING_API_STORESETTING_GETOPTIONALCATEGORY = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreSetting/GetOptionalCategory/`,
       method: 'post'
   })
}

/**
* 添加商城待选的分类
* @param {Object} parameters -{giftCategoryIds:'String'}
*/
export const GIFTING_API_STORESETTING_ADDCATEGORY = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreSetting/AddCategory/`,
       method: 'post',
       data: parameters
   })
}

/**
* 移除商城发现好礼下的分类
* @param {String} storeCategoryId
*/
export const GIFTING_API_STORESETTING_DELETECATEGORY = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{storeCategoryId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreSetting/DeleteCategory/${getQueryString('storeCategoryId',parameters.storeCategoryId)}`,
       method: 'post'
   })
}

/**
* 设置商城推荐内容布局
* @param {Object} parameters -{settingOptionId:'String',layout:'Number'}
*/
export const GIFTING_API_STORESETTING_SETRECOMMENDSLAYOUT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreSetting/SetRecommendsLayout/`,
       method: 'post',
       data: parameters
   })
}

/**
* 获取商城自定义栏目
*/
export const GIFTING_API_STORESETTING_GETCUSTOMCOLUMNS = () => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreSetting/GetCustomColumns/`,
       method: 'post'
   })
}

/**
* 保存商城自定义栏目
* @param {Object} parameters -{settingOptionId:'String',name:'String'}
*/
export const GIFTING_API_STORESETTING_SAVECUSTOMCOLUMN = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreSetting/SaveCustomColumn/`,
       method: 'post',
       data: parameters
   })
}

/**
* 设置商城自定义栏目排序
* @param {Object} parameters -{settingOptionIds:'String'}
*/
export const GIFTING_API_STORESETTING_SETCUSTOMCOLUMNSORT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreSetting/SetCustomColumnSort/`,
       method: 'post',
       data: parameters
   })
}

/**
* 移除商城自定义栏目
* @param {Object} parameters -{settingOptionId:'String'}
*/
export const GIFTING_API_STORESETTING_DELETECUSTOMCOLUMN = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreSetting/DeleteCustomColumn/`,
       method: 'post',
       data: parameters
   })
}

/**
* 添加商城自定义栏目礼品
* @param {Object} parameters -{settingOptionId:'String',giftIds:'String'}
*/
export const GIFTING_API_STORESETTING_ADDCUSTOMCOLUMNGIFT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreSetting/AddCustomColumnGift/`,
       method: 'post',
       data: parameters
   })
}

/**
* 添加商城推荐礼品
* @param {Object} parameters -{settingOptionId:'String',giftIds:'String'}
*/
export const GIFTING_API_STORESETTING_ADDRECOMMENDGIFT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreSetting/AddRecommendGift/`,
       method: 'post',
       data: parameters
   })
}

/**
* 移除商城栏目对应的礼品
* @param {Object} parameters -{settingOptionGiftIds:'String'}
*/
export const GIFTING_API_STORESETTING_REMOVEGIFT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreSetting/RemoveGift/`,
       method: 'post',
       data: parameters
   })
}

/**
* 置顶商城栏目对应的礼品
* @param {Object} parameters -{settingOptionGiftId:'String'}
*/
export const GIFTING_API_STORESETTING_SETGIFTTOP = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreSetting/SetGiftTop/`,
       method: 'post',
       data: parameters
   })
}

/**
* 搜索商城某栏目下待选的礼品
* @param {Object} parameters -{settingOptionId:'String',categoryId:'String',barCode:'String',giftName:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_STORESETTING_SEARCHOPTIONALGIFT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreSetting/SearchOptionalGift/`,
       method: 'post',
       data: parameters
   })
}

/**
* 获取某栏目下的所有已选礼品
* @param {String} settingOptionId
*/
export const GIFTING_API_STORESETTING_GETSETTINGOPTIONGIFT = (parameters) => {
   parameters= typeof parameters==='object'?parameters:{settingOptionId:parameters};
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreSetting/GetSettingOptionGift/${getQueryString('settingOptionId',parameters.settingOptionId)}`,
       method: 'post'
   })
}


/**
* 查询门店账期余额
* @param {Object} parameters -{periodStart:'String',periodEnd:'String'}
*/
export const GIFTING_API_STOREBALANCE_GETPERIODBALANCE = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreBalance/GetPeriodBalance/`,
       method: 'post',
       data: parameters
   })
}

/**
* 查询门店对账单列表
* @param {Object} parameters -{periodStart:'String',periodEnd:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_STOREBALANCE_GETPERIODBALANCELOGS = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreBalance/GetPeriodBalanceLogs/`,
       method: 'post',
       data: parameters
   })
}

/**
* 查询账期余额
* @param {Object} parameters -{periodStart:'String',periodEnd:'String',storeName:'String',companyName:'String',companyCode:'String',storeCode:'String',characterType:'String',logType:'String'}
*/
export const GIFTING_API_STOREBALANCE_GETPERIODBALANCEBYSTATION = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreBalance/GetPeriodBalanceByStation/`,
       method: 'post',
       data: parameters
   })
}

/**
* 珠宝商账户流水
* @param {Object} parameters -{characterId:'String',periodStart:'String',periodEnd:'String',storeName:'String',companyName:'String',companyCode:'String',storeCode:'String',characterType:'String',logType:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_STOREBALANCE_GETPERIODBALANCELOGSBYSTATION = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreBalance/GetPeriodBalanceLogsByStation/`,
       method: 'post',
       data: parameters
   })
}

/**
* 珠宝商对账报表
* @param {Object} parameters -{characterId:'String',periodStart:'String',periodEnd:'String',storeName:'String',companyName:'String',companyCode:'String',storeCode:'String',characterType:'String',logType:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
*/
export const GIFTING_API_STOREBALANCE_GETSTORERECONCILIATIONREPORT = (parameters) => {
   return fetch({ 
       cloud: 'Gifting',
       url: `/api/StoreBalance/GetStoreReconciliationReport/`,
       method: 'post',
       data: parameters
   })
}



