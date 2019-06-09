import fetch from '@/utilities/fetch'

// 平台PC端 - 异业联盟使用统计 - 检索;
// parameters: {"UniteNote": "String", "MultiType": "int", "HasTicket": "int", "Orderby": "int", "IsAsced": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"CharacterId": "long", "StoreCode": "String", "StoreName": "String", "MultiType": "int", "HasTicket": "int", "TicketAmt": "int"}
export function ALLIANCE_API_CHARACTERTALLY_GETS(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Character/CharacterTally/Gets/',
    method: 'get',
    params: parameters
  })
}
// 平台PC端 - 异业联盟使用统计 - 导出;
// parameters: {"UniteNote": "String", "MultiType": "int", "HasTicket": "int", "Orderby": "int", "IsAsced": "int"}
// response.data.Data: NULL
export function ALLIANCE_API_CHARACTERTALLY_EXPORT(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Character/CharacterTally/Export/',
    method: 'get',
    params: parameters
  })
}
// 珠宝商PC端 - 卡券订单 - 检索;
// parameters: {"OrderCode": "String", "NeiborName": "String", "TrueName": "String", "AliasName": "String", "Mobile": "String", "TicketCode": "String", "TicketName": "String", "CheckTime1": "String", "CheckTime2": "String", "State": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"OrderId": "long", "OrderCode": "String", "NeiborName": "String", "TrueName": "String", "AliasName": "String", "Mobile": "String", "TicketId": "long", "TicketCode": "String", "TicketName": "String", "Quantity": "int", "Expireb": "String", "Expiree": "String", "ExpireDays": "int", "ValPrice": "long", "BuyPrice": "long", "RulePrice": "long", "PaidNo": "String", "CreateTime": "String", "CheckTime": "String", "State": "int", "Stamp": "String"}
export function ALLIANCE_API_TICKETORDERBASIC_GETS(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Order/TicketOrderBasic/Gets/',
    method: 'get',
    params: parameters
  })
}
// 珠宝商PC端 - 卡券订单 - 详情;
// parameters: {"id": "long"}
// response.data.Data: {"OrderId": "long", "BuyPrice": "long", "ReturnTypeEk": "int", "ReturnTypeEv": "String", "ReturnPrice": "long", "ReturnTime": "String", "ReturnNo": "String", "ReturnNote": "String", "Note": "String", "State": "int", "Stamp": "String"}
export function ALLIANCE_API_TICKETORDERBASIC_GET(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Order/TicketOrderBasic/get/',
    method: 'get',
    params: parameters
  })
}
// 珠宝商PC端 - 联盟券订单 - 退款;
// parameters: {"OrderId": "long", "ReturnTypeEk": "int", "ReturnTypeEv": "String", "ReturnPrice": "long", "ReturnNo": "String", "ReturnNote": "String", "Note": "String"}
// response.data.Data: NULL
export function ALLIANCE_API_TICKETORDERBASIC_REFUND(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Order/TicketOrderBasic/Refund/',
    method: 'post',
    data: parameters
  })
}
// 珠宝商PC端 - 卡券订单 - 导出;
// parameters: {"OrderCode": "String", "NeiborName": "String", "TrueName": "String", "AliasName": "String", "Mobile": "String", "TicketCode": "String", "TicketName": "String", "CheckTime1": "String", "CheckTime2": "String", "State": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: NULL
export function ALLIANCE_API_TICKETORDERBASIC_EXPORT(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Order/TicketOrderBasic/Export/',
    method: 'get',
    params: parameters
  })
}
// 角色计数(按角色) - 同步(定时服务同步联盟券数);
// parameters: NULL
// response.data.Data: NULL
export function ALLIANCE_API_CHARACTERTALLY_SYNC(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Scheduler/CharacterTally/Sync/',
    method: 'get',
    params: parameters
  })
}
// 我的领券(会员) - 刷新(每天凌晨服务, 更新过期卡券);
// parameters: NULL
// response.data.Data: NULL
export function ALLIANCE_API_WALLETTICKET_FRESH(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Wallet/WalletTicket/Fresh/',
    method: 'get',
    params: parameters
  })
}
// 平台PC端 - 联盟券样式 - 检索;
// parameters: {"State": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"StyleId": "long", "ImageUrl": "String"}
export function ALLIANCE_API_SETTINGTICKETSTYLE_GETS(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Setting/SettingTicketStyle/Gets/',
    method: 'get',
    params: parameters
  })
}
// 会员WX端/珠宝商PC端/联盟商APP端 - 所有联盟券样式 - 加载;
// parameters: {id: 'long'}
// response.data.Data: {"StyleId": "long", "ImageUrl": "String"}
export function ALLIANCE_API_SETTINGTICKETSTYLE_REQ(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Setting/SettingTicketStyle/Req/',
    method: 'get',
    params: parameters
  })
}
// 平台PC端 - 联盟券样式 - 创建;
// parameters: {"ImageUrl": "String"}
// response.data.Data: NULL
export function ALLIANCE_API_SETTINGTICKETSTYLE_CREATE(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Setting/SettingTicketStyle/Create/',
    method: 'post',
    data: parameters
  })
}
// 平台PC端 - 联盟券样式 - 删除(多个以逗号分隔);
// parameters: {ids: "String"}
// response.data.Data: NULL
export function ALLIANCE_API_SETTINGTICKETSTYLE_DELETE(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Setting/SettingTicketStyle/Delete/',
    method: 'post',
    data: parameters
  })
}
// 珠宝商PC端 - 奖励结算 - 检索;
// parameters: {"BillCode": "String", "BillType": "int", "ActualDate1": "String", "ActualDate2": "String", "NeiborCode": "String", "NeiborName": "String", "TicketCode": "String", "TicketName": "String", "PaidNo": "String", "CreateTime1": "String", "CreateTime2": "String", "State": "int", "Orderby": "int", "IsAsced": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"BillId": "long", "BillCode": "String", "BillType": "int", "ActualDate": "String", "NeiborCode": "String", "NeiborName": "String", "TicketCode": "String", "TicketName": "String", "BillPrice": "long", "PaidPrice": "long", "Note": "String", "CreateTime": "String", "State": "int"}
export function ALLIANCE_API_SETTLETICKETBILLBASIC_GETS(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Settle/SettleTicketBillBasic/Gets/',
    method: 'get',
    params: parameters
  })
}
// 珠宝商PC端 - 奖励结算 - 详情;
// parameters: {"BillId": "long"}
// response.data.Data: {"BillId": "long", "TicketId": "long", "BillCode": "String", "BillType": "int", "ActualDate": "String", "NeiborCode": "String", "NeiborName": "String", "TicketCode": "String", "TicketName": "String", "BillPrice": "long", "PaidPrice": "long", "Contact": "String", "PaymentTypeEk": "int", "PaymentTypeEv": "String", "BankName": "String", "AccountCode": "String", "Surname": "String", "PaidTime": "String", "PaidNo": "String", "Note": "String", "CreateUser": "String", "CreateTime": "String", "CheckUser": "String", "CheckTime": "String", "CheckNote": "String", "State": "int", "RewaidType": "int", "SharedNote": "String", "TransfNote": "String", "SharedQty": "int", "TransfQty": "int", "ReturnQty": "int", "Rate": "long"}
export function ALLIANCE_API_SETTLETICKETBILLBASIC_GET(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Settle/SettleTicketBillBasic/Get/',
    method: 'get',
    params: parameters
  })
}
// 珠宝商PC端 - 奖励结算 - 创建;
// parameters: {"NeiborIds": "String", "TicketId": "long", "BillType": "int"}
// response.data.Data: NULL
export function ALLIANCE_API_SETTLETICKETBILLBASIC_CREATE(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Settle/SettleTicketBillBasic/Create/',
    method: 'post',
    data: parameters
  })
}
// 珠宝商PC端 - 奖励结算 - 审核通过;
// parameters: {"BillId": "long", "CheckNote": "String"}
// response.data.Data: NULL
export function ALLIANCE_API_SETTLETICKETBILLBASIC_AUDIT(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Settle/SettleTicketBillBasic/Audit/',
    method: 'post',
    data: parameters
  })
}
// 珠宝商PC端 - 奖励结算 - 取消审核;
// parameters: {"BillId": "long", "CheckNote": "String"}
// response.data.Data: NULL
export function ALLIANCE_API_SETTLETICKETBILLBASIC_CANCEL(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Settle/SettleTicketBillBasic/Cancel/',
    method: 'post',
    data: parameters
  })
}
// 珠宝商PC端 - 奖励结算 - 结算;
// parameters: {"BillId": "long", "PaidPrice": "long", "Contact": "String", "PaymentTypeEk": "int", "PaymentTypeEv": "String", "BankName": "String", "AccountCode": "String", "Surname": "String", "PaidTime": "String", "PaidNo": "String", "Note": "String", "CheckNote": "String"}
// response.data.Data: NULL
export function ALLIANCE_API_SETTLETICKETBILLBASIC_PAID(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Settle/SettleTicketBillBasic/Paid/',
    method: 'post',
    data: parameters
  })
}
// 珠宝商PC端 - 奖励结算 - 作废;
// parameters: {"BillId": "long", "CheckNote": "String"}
// response.data.Data: NULL
export function ALLIANCE_API_SETTLETICKETBILLBASIC_ABANDON(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Settle/SettleTicketBillBasic/Abandon/',
    method: 'post',
    data: parameters
  })
}
// 珠宝商PC端 - 奖励结算 - 导出;
// parameters: {"BillCode": "String", "BillType": "int", "ActualDate1": "String", "ActualDate2": "String", "NeiborCode": "String", "NeiborName": "String", "TicketCode": "String", "TicketName": "String", "PaidNo": "String", "CreateTime1": "String", "CreateTime2": "String", "State": "int", "Orderby": "int", "IsAsced": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: NULL
export function ALLIANCE_API_SETTLETICKETBILLBASIC_EXPORT(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Settle/SettleTicketBillBasic/Export/',
    method: 'post',
    data: parameters
  })
}
// 珠宝商PC端 - 联盟券管理 - 列表;
// parameters: {"TicketCode": "String", "TicketName": "String", "TicketType": "int", "State": "int", "IsAsced": "int", "Orderby": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"TicketId": "long", "TicketCode": "String", "TicketName": "String", "TicketType": "int", "RuleType": "int", "RulePrice": "long", "SettleSharedTime": "String", "SettleTransfTime": "String", "Expireb": "String", "Expiree": "String", "PrepareQty": "int", "ActiveDays": "int", "ExpireDays": "int", "CreateTime": "String", "State": "int", "SettleState": "long", "NeiborAmt": "int"}
export function ALLIANCE_API_TICKETBASIC_GETS(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketBasic/Gets/',
    method: 'get',
    params: parameters
  })
}
// 珠宝商PC端 - 联盟券统计 - 列表;
// parameters: {"TicketCode": "String", "TicketName": "String", "IsAsced": "int", "Orderby": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"TicketId": "long", "TicketCode": "String", "TicketName": "String", "SharedBillPrice": "long", "TransfBillPrice": "long", "SettleState": "long", "NeiborAmt": "int", "SharedQty": "int", "UnusedQty": "int", "LockedQty": "int", "TransfQty": "int", "ExpiredQty": "int", "ReturnQty": "int", "Rate": "long"}
export function ALLIANCE_API_TICKETBASIC_LISTBYSTORE(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketBasic/ListByStore/',
    method: 'get',
    params: parameters
  })
}
// 平台PC端 - 联盟券统计 - 列表;
// parameters: {"MultiType": "int", "TicketCode": "String", "TicketName": "String", "UniteNote": "String", "IsAsced": "int", "Orderby": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"TicketId": "long", "StoreCode": "String", "StoreName": "String", "StoreType": "int", "MultiType": "int", "TicketCode": "String", "TicketName": "String", "SharedBillPrice": "long", "TransfBillPrice": "long", "SettleState": "long", "NeiborAmt": "int", "SharedQty": "int", "UnusedQty": "int", "LockedQty": "int", "TransfQty": "int", "ExpiredQty": "int", "ReturnQty": "int", "Rate": "long"}
export function ALLIANCE_API_TICKETBASIC_LISTBYLCB(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketBasic/ListByLcb/',
    method: 'get',
    params: parameters
  })
}
// 珠宝商PC端 - 联盟券管理 - 详情;
// parameters: {"ticketId": "long"}`  `
// response.data.Data: {"TicketId": "long", "TicketCode": "String", "StyleId": "long", "ImageUrl": "String", "TicketName": "String", "TicketType": "int", "RuleType": "int", "RulePrice": "long", "SettleSharedTime": "String", "SettleTransfTime": "String", "Expireb": "String", "Expiree": "String", "PrepareQty": "int", "GiftMaxQty": "int", "GiftPerQty": "int", "GiftValType": "int", "GiftValPrice": "long", "GiftVprices": "String", "SaleValPrice": "long", "SalePrice": "long", "Rates": "String", "Scopes": "String", "ActiveDays": "int", "ExpireDays": "int", "TipsDays": "int", "TicketNote": "String", "Note": "String", "CreateUser": "String", "CreateTime": "String", "State": "int"}
export function ALLIANCE_API_TICKETBASIC_GET(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketBasic/Get/',
    method: 'get',
    params: parameters
  })
}
// 珠宝商PC端 - 联盟券管理 - 创建;
// parameters: {"StyleId": "long", "TicketName": "String", "TicketType": "int", "RuleType": "int", "RulePrice": "long", "Expireb": "String", "Expiree": "String", "PrepareQty": "int", "GiftMaxQty": "int", "GiftPerQty": "int", "GiftValType": "int", "GiftValPrice": "long", "GiftVprices": "String", "SaleValPrice": "long", "SalePrice": "long", "Rates": "String", "Scopes": "String", "ActiveDays": "int", "ExpireDays": "int", "TipsDays": "int", "TicketNote": "String"}
// response.data.Data: NULL
export function ALLIANCE_API_TICKETBASIC_CREATE(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketBasic/Create/',
    method: 'post',
    data: parameters
  })
}
// 珠宝商PC端 - 联盟券管理 - 审核通过;
// parameters: long
// response.data.Data: NULL
export function ALLIANCE_API_TICKETBASIC_AUDIT(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketBasic/Audit/',
    method: 'post',
    data: parameters
  })
}
// 珠宝商PC端 - 联盟券管理 - 作废;
// parameters: {"TicketId": "long", "CheckNote": "String"}
// response.data.Data: NULL
export function ALLIANCE_API_TICKETBASIC_ABANDON(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketBasic/Abandon/',
    method: 'post',
    data: parameters
  })
}
// 珠宝商PC端 - 联盟券管理 - 终止;
// parameters: long
// response.data.Data: NULL
export function ALLIANCE_API_TICKETBASIC_FINISH(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketBasic/Finish/',
    method: 'post',
    data: parameters
  })
}
// 平台PC端 - 联盟券统计 - 导出;
// parameters: {"MultiType": "int", "TicketCode": "String", "TicketName": "String", "UniteNote": "String", "IsAsced": "int", "Orderby": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: NULL
export function ALLIANCE_API_TICKETBASIC_EXPORT1(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketBasic/Export1/',
    method: 'post',
    data: parameters
  })
}
// 珠宝商PC端 - 联盟券统计 - 导出;
// parameters: {"TicketCode": "String", "TicketName": "String", "IsAsced": "int", "Orderby": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: NULL
export function ALLIANCE_API_TICKETBASIC_EXPORT2(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketBasic/Export2/',
    method: 'post',
    data: parameters
  })
}
// 珠宝商PC端 - 联盟券详情 - 联盟商列表;
// parameters: {"TicketId": "long", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"ItemId": "long", "NeiborId": "long", "NeiborCode": "String", "NeiborName": "String", "LastTime": "String", "BindState": "int", "RewaidType": "int", "SharedNote": "String", "TransfNote": "String", "RewaidState": "int"}
export function ALLIANCE_API_TICKETNEIBOR_REQS(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketNeibor/Reqs/',
    method: 'get',
    params: parameters
  })
}
// 珠宝商PC端 - 联盟券统计 - 详情;
// parameters: {"TicketId": "long", "IsAsced": "int", "Orderby": "int"}
// response.data.Data: {"TicketId": "long", "NeiborId": "long", "NeiborCode": "String", "NeiborName": "String", "SharedBillPrice": "long", "SharedPaidPrice": "long", "TransfBillPrice": "long", "TransfPaidPrice": "long", "SettleState": "int", "SharedQty": "int", "UnusedQty": "int", "LockedQty": "int", "TransfQty": "int", "ExpiredQty": "int", "ReturnQty": "int", "Rate": "long"}
export function ALLIANCE_API_TICKETNEIBOR_QRYSBYSTORE(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketNeibor/QrysByStore/',
    method: 'get',
    params: parameters
  })
}
// 管控中心PC端 - 联盟券统计 - 详情;
// parameters: {"TicketId": "long", "NeiborCode": "String", "NeiborName": "String", "IsAsced": "int", "Orderby": "int"}
// response.data.Data: {"TicketId": "long", "NeiborId": "long", "NeiborCode": "String", "NeiborName": "String", "SharedBillPrice": "long", "SharedPaidPrice": "long", "TransfBillPrice": "long", "TransfPaidPrice": "long", "SettleState": "int", "SharedQty": "int", "UnusedQty": "int", "LockedQty": "int", "TransfQty": "int", "ExpiredQty": "int", "ReturnQty": "int", "Rate": "long"}
export function ALLIANCE_API_TICKETNEIBOR_QRYSBYLCB(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketNeibor/QrysByLcb/',
    method: 'get',
    params: parameters
  })
}
// 珠宝商PC端 - 联盟券管理 - 创建结算单列表;
// parameters: {"TicketId": "long", "IsAsced": "int", "Orderby": "int"}
// response.data.Data: {"TicketId": "long", "NeiborId": "long", "NeiborCode": "String", "NeiborName": "String", "SettleState": "int", "SharedQty": "int", "TransfQty": "int", "ReturnQty": "int"}
export function ALLIANCE_API_TICKETNEIBOR_QRYSBYSETTLE(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketNeibor/QrysBySettle/',
    method: 'get',
    params: parameters
  })
}
// 珠宝商PC端 - 联盟券管理 - 创建结算单(三级页);
// parameters: {"TicketId": "long", "NeiborIds": "String"}
// response.data.Data: {"TicketId": "long", "NeiborId": "long", "NeiborCode": "String", "NeiborName": "String", "RewaidType": "int", "SharedNote": "String", "TransfNote": "String", "SharedBillPrice": "long", "SharedPaidPrice": "long", "RetailProductPrice": "long", "RetailPaidPrice": "long", "TransfBillPrice": "long", "TransfPaidPrice": "long", "SharedQty": "int", "TransfQty": "int", "ReturnQty": "int", "Rate": "long"}
export function ALLIANCE_API_TICKETNEIBOR_SEEKS(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketNeibor/Seeks/',
    method: 'get',
    params: parameters
  })
  
}
// 平台PC端 - 联盟商统计;
// parameters: {"NeiborCode": "String", "NeiborName": "String", "TicketCode": "String", "TicketName": "String", "MultiType": "int", "UniteNote": "String", "IsAsced": "int", "Orderby": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"NeiborCode": "String", "NeiborName": "String", "TicketId": "long", "StoreCode": "String", "StoreName": "String", "MultiType": "int", "TicketCode": "String", "TicketName": "String", "SharedPaidPrice": "long", "TransfPaidPrice": "long", "SettleState": "int", "SharedQty": "int", "UnusedQty": "int", "LockedQty": "int", "TransfQty": "int", "ExpiredQty": "int", "ReturnQty": "int", "Rate": "long"}
export function ALLIANCE_API_TICKETNEIBOR_SCHSBYLCB(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketNeibor/SchsByLcb/',
    method: 'get',
    params: parameters
  })
}
// 珠宝商PC端 - 联盟商统计;
// parameters: {"NeiborCode": "String", "NeiborName": "String", "TicketCode": "String", "TicketName": "String", "IsAsced": "int", "Orderby": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"NeiborCode": "String", "NeiborName": "String", "TicketId": "long", "TicketCode": "String", "TicketName": "String", "SharedPaidPrice": "long", "TransfPaidPrice": "long", "SettleState": "int", "SharedQty": "int", "UnusedQty": "int", "LockedQty": "int", "TransfQty": "int", "ExpiredQty": "int", "ReturnQty": "int", "Rate": "long"}
export function ALLIANCE_API_TICKETNEIBOR_SCHSBYSTORE(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketNeibor/SchsByStore/',
    method: 'get',
    params: parameters
  })
}
// 珠宝商PC端 - 联盟券管理 - 绑定联盟商(选择联盟商);
// parameters: {"TicketId": "long", "NeiborMults": "String"}
// response.data.Data: NULL
export function ALLIANCE_API_TICKETNEIBOR_CREATE(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketNeibor/Create/',
    method: 'post',
    data: parameters
  })
}
// 珠宝商PC端 - 联盟券管理 - 绑定联盟商(批量设置奖励);
// parameters: {"TicketId": "long", "ItemIds": "String", "RewaidType": "int", "FixedIsShared": "int", "FixedSharedPrice": "long", "FixedIsTransf": "int", "FixedTransfType": "int", "FixedTransfPrice": "long", "FixedTcoinType": "int", "FixedTcoinRate": "long", "StepIsShared": "int", "StepSharedPrices": "String", "StepIsTransf": "int", "StepTransfType": "int", "StepTransfPrices": "String", "StepTcoinType": "int", "StepTcoinRates": "String", "RewaidState": "int"}
// response.data.Data: NULL
export function ALLIANCE_API_TICKETNEIBOR_SETUP(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketNeibor/Setup/',
    method: 'post',
    data: parameters
  })
}
// 珠宝商PC端 - 联盟券管理 - 绑定联盟商;
// parameters: long
// response.data.Data: NULL
export function ALLIANCE_API_TICKETNEIBOR_BIND(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketNeibor/Bind/',
    method: 'post',
    data: parameters
  })
}
// 珠宝商PC端 - 联盟券管理 - 解绑联盟商;
// parameters: long
// response.data.Data: NULL
export function ALLIANCE_API_TICKETNEIBOR_UNBIND(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketNeibor/Unbind/',
    method: 'post',
    data: parameters
  })
}
// 珠宝商PC端 - 联盟券管理 - 删除;
// parameters: long
// response.data.Data: NULL
export function ALLIANCE_API_TICKETNEIBOR_REMOVE(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketNeibor/Remove/',
    method: 'post',
    data: parameters
  })
}
// 平台PC端 - 联盟券统计详情 - 导出;
// parameters: {"TicketId": "long", "NeiborCode": "String", "NeiborName": "String", "IsAsced": "int", "Orderby": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: NULL
export function ALLIANCE_API_TICKETNEIBOR_EXPORT1(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketNeibor/Export1/',
    method: 'post',
    data: parameters
  })
}
// 平台PC端 - 联盟商统计 - 导出;
// parameters: {"NeiborCode": "String", "NeiborName": "String", "TicketCode": "String", "TicketName": "String", "MultiType": "int", "UniteNote": "String", "IsAsced": "int", "Orderby": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: NULL
export function ALLIANCE_API_TICKETNEIBOR_EXPORT2(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketNeibor/Export2/',
    method: 'post',
    data: parameters
  })
}
// 珠宝商PC端 - 联盟商统计 - 导出;
// parameters: {"NeiborCode": "String", "NeiborName": "String", "TicketCode": "String", "TicketName": "String", "MultiType": "int", "UniteNote": "String", "IsAsced": "int", "Orderby": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: NULL
export function ALLIANCE_API_TICKETNEIBOR_EXPORT3(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Ticket/TicketNeibor/Export3/',
    method: 'post',
    data: parameters
  })
}
// 珠宝商PC端 - 卡券订单 - 卡券详情;
// parameters: {"orderId": "long"}
// response.data.Data: {"TicketId": "long", "TicketCode": "String", "TicketName": "String", "TicketType": "int", "RuleType": "int", "Quantity": "int", "Expireb": "String", "Expiree": "String", "ExpireDays": "int", "TipsDate": "String", "ValPrice": "long", "Scopes": "String", "Rates": "String", "TicketNote": "String"}
export function ALLIANCE_API_WALLETTICKET_GETBYORDERID(parameters) {
  return fetch({
    cloud: 'Alliance',
    url: '/Wallet/WalletTicket/GetByOrderId/',
    method: 'get',
    params: parameters
  })
}