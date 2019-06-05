import fetch from '@/utilities/fetch'

// 收货地址 - 检索;
export const MERCHANT_API_CHARACTER_ADDRESS_GETS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/character_address/Gets',
    method: 'get',
    params: parameters
  })
}
// 收货地址 - 加载;
export const MERCHANT_API_CHARACTER_ADDRESS_GET = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/character_address/Get',
    method: 'get',
    params: parameters
  })
}
// 收货地址 - 创建;
export const MERCHANT_API_CHARACTER_ADDRESS_CREATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/character_address/Create',
    method: 'post',
    data: parameters
  })
}
// 收货地址 - 更新;
export const MERCHANT_API_CHARACTER_ADDRESS_UPDATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/character_address/Update',
    method: 'post',
    data: parameters
  })
}
// 收货地址 - 默认;
export const MERCHANT_API_CHARACTER_ADDRESS_DEFAULT = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/character_address/Default',
    method: 'post',
    data: parameters
  })
}
// 收货地址 - 禁用;
export const MERCHANT_API_CHARACTER_ADDRESS_DISABLE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/character_address/Disable',
    method: 'post',
    data: parameters
  })
}
// 部门 - 检索;
export const MERCHANT_API_CHARACTER_DEPART_GETS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/character_depart/Gets',
    method: 'get',
    params: parameters
  })
}
// 部门 - 加载;
export const MERCHANT_API_CHARACTER_DEPART_GET = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/character_depart/Get',
    method: 'get',
    params: parameters
  })
}
// 部门 - 创建;
export const MERCHANT_API_CHARACTER_DEPART_CREATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/character_depart/Create',
    method: 'post',
    data: parameters
  })
}
// 部门 - 更新;
export const MERCHANT_API_CHARACTER_DEPART_UPDATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/character_depart/Update',
    method: 'post',
    data: parameters
  })
}
// 部门 - 启用;
export const MERCHANT_API_CHARACTER_DEPART_ENABLE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/character_depart/Enable',
    method: 'post',
    data: parameters
  })
}
// 部门 - 禁用;
export const MERCHANT_API_CHARACTER_DEPART_DISABLE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/character_depart/Disable',
    method: 'post',
    data: parameters
  })
}
// 职位 - 检索;
export const MERCHANT_API_CHARACTER_POSITION_GETS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/character_position/Gets',
    method: 'get',
    params: parameters
  })
}
// 职位 - 加载;
export const MERCHANT_API_CHARACTER_POSITION_GET = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/character_position/Get',
    method: 'get',
    params: parameters
  })
}
// 商户服务 - 检索;
export const MERCHANT_API_COMPANY_BASIC_GETS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/company_basic/Gets',
    method: 'get',
    params: parameters
  })
}
// 集团加载 - 关联商户列表;
export const MERCHANT_API_COMPANY_BASIC_GETMAPS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/company_basic/GetMaps',
    method: 'get',
    params: parameters
  })
}
// 商户服务 - 加载;
export const MERCHANT_API_COMPANY_BASIC_GET = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/company_basic/Get',
    method: 'get',
    params: parameters
  })
}
// 商户服务 - 加载;
export const MERCHANT_API_COMPANY_BASIC_REQ = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/company_basic/Req',
    method: 'get',
    params: parameters
  })
}
// 设置 - 公司信息;
export const MERCHANT_API_COMPANY_BASIC_DETAIL = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/company_basic/Detail',
    method: 'get',
    params: parameters
  })
}
// 商户服务 - 创建;
export const MERCHANT_API_COMPANY_BASIC_CREATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/company_basic/Create',
    method: 'post',
    data: parameters
  })
}
// 商户服务 - 更新;
export const MERCHANT_API_COMPANY_BASIC_UPDATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/company_basic/Update',
    method: 'post',
    data: parameters
  })
}
// 设置 - 公司信息更新;
export const MERCHANT_API_COMPANY_BASIC_UPDATEINFO = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/company_basic/UpdateInfo',
    method: 'post',
    data: parameters
  })
}
// 商户服务 - 更新Mount;
export const MERCHANT_API_COMPANY_BASIC_UPDATEMOUNT = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/company_basic/UpdateMount',
    method: 'post',
    data: parameters
  })
}
// 商户服务 - 启用;
export const MERCHANT_API_COMPANY_BASIC_ENABLE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/company_basic/Enable',
    method: 'post',
    data: parameters
  })
}
// 商户服务 - 停用;
export const MERCHANT_API_COMPANY_BASIC_DISABLE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/company_basic/Disable',
    method: 'post',
    data: parameters
  })
}
// 下载任务 - 每日定时任务;
export const MERCHANT_API_CRONTAB_DOWNLOADCLEARJOB = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/crontab/DownloadClearJob',
    method: 'get',
    params: parameters
  })
}
// 财务预算 - 每日定时任务;
export const MERCHANT_API_CRONTAB_SETTLEBUDGETBILLDAYLYJOB = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/crontab/SettleBudgetBillDaylyJob',
    method: 'get',
    params: parameters
  })
}
// 商户管理 - 公司列表(下拉);
export const MERCHANT_API_DROPDOWN_COMPANYLIST = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/dropdown/CompanyList',
    method: 'get',
    params: parameters
  })
}
// 门店列表(下拉列表);
export const MERCHANT_API_DROPDOWN_STORELIST = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/dropdown/StoreList',
    method: 'get',
    params: parameters
  })
}
// 科目(下拉列表);
export const MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/dropdown/SettingEnumeratorList',
    method: 'get',
    params: parameters
  })
}
// 词典(下拉列表);
export const MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/dropdown/SettingDictionaryList',
    method: 'get',
    params: parameters
  })
}
// 员工 - 列表(下拉);
export const MERCHANT_API_DROPDOWN_USERLIST = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/dropdown/UserList',
    method: 'get',
    params: parameters
  })
}
// 套餐 - 列表(下拉);
export const MERCHANT_API_DROPDOWN_PACKBASICLIST = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/dropdown/PackBasicList',
    method: 'get',
    params: parameters
  })
}
// 角色 - 下拉;
export const MERCHANT_API_DROPDOWN_ROLELIST = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/dropdown/RoleList',
    method: 'get',
    params: parameters
  })
}
// 部门 - 下拉(总部专用,检索总部下所有门店的部门,不包括总部的部门);
export const MERCHANT_API_DROPDOWN_STOREDEPARTLIST = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/dropdown/StoreDepartList',
    method: 'get',
    params: parameters
  })
}
// 部门 - 下拉;
export const MERCHANT_API_DROPDOWN_DEPARTLIST = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/dropdown/DepartList',
    method: 'get',
    params: parameters
  })
}
// 职位 - 下拉;
export const MERCHANT_API_DROPDOWN_POSITIONLIST = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/dropdown/PositionList',
    method: 'get',
    params: parameters
  })
}
// 打印模板 - 下拉;
export const MERCHANT_API_DROPDOWN_PRINTINGLIST = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/dropdown/PrintingList',
    method: 'get',
    params: parameters
  })
}
// 仓库 - 下拉;
export const MERCHANT_API_DROPDOWN_WAREHOUSEBASICLIST = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/dropdown/WareHouseBasicList',
    method: 'get',
    params: parameters
  })
}
// 货架 - 下拉;
export const MERCHANT_API_DROPDOWN_WAREHOUSESHELFLIST = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/dropdown/WareHouseShelfList',
    method: 'get',
    params: parameters
  })
}
// 往来单位 - 下拉;
export const MERCHANT_API_DROPDOWN_PARTNERBASICLIST = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/dropdown/PartnerBasicList',
    method: 'get',
    params: parameters
  })
}
// 往来单位 - 下拉(带采购状态);
export const MERCHANT_API_DROPDOWN_PARTNERBASICSLIST = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/dropdown/PartnerBasicsList',
    method: 'get',
    params: parameters
  })
}
// 柜台 - 下拉;
export const MERCHANT_API_DROPDOWN_DESKBASICLIST = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/dropdown/DeskBasicList',
    method: 'get',
    params: parameters
  })
}
// 集团服务 - 检索;
export const MERCHANT_API_GROUP_BASIC_GETS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/group_basic/Gets',
    method: 'get',
    params: parameters
  })
}
// 集团服务 - 加载;
export const MERCHANT_API_GROUP_BASIC_GET = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/group_basic/Get',
    method: 'get',
    params: parameters
  })
}
// 集团服务 - 加载;
export const MERCHANT_API_GROUP_BASIC_REQ = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/group_basic/Req',
    method: 'get',
    params: parameters
  })
}
// 设置 - 集团信息;
export const MERCHANT_API_GROUP_BASIC_DETAIL = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/group_basic/Detail',
    method: 'get',
    params: parameters
  })
}
// 集团服务 - 创建;
export const MERCHANT_API_GROUP_BASIC_CREATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/group_basic/Create',
    method: 'post',
    data: parameters
  })
}
// 集团服务 - 更新;
export const MERCHANT_API_GROUP_BASIC_UPDATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/group_basic/Update',
    method: 'post',
    data: parameters
  })
}
// 设置 - 集团信息更新;
export const MERCHANT_API_GROUP_BASIC_UPDATEINFO = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/group_basic/UpdateInfo',
    method: 'post',
    data: parameters
  })
}
// 集团服务 - 启用;
export const MERCHANT_API_GROUP_BASIC_ENABLE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/group_basic/Enable',
    method: 'post',
    data: parameters
  })
}
// 集团服务 - 停用;
export const MERCHANT_API_GROUP_BASIC_DISABLE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/group_basic/Disable',
    method: 'post',
    data: parameters
  })
}
// 集团服务 - 关联商户;
export const MERCHANT_API_GROUP_BASIC_MAPS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/group_basic/Maps',
    method: 'post',
    data: parameters
  })
}
// 集团服务 - 取消关联商户;
export const MERCHANT_API_GROUP_BASIC_CANCELMAPS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/group_basic/CancelMaps',
    method: 'post',
    data: parameters
  })
}
// 官网首页 - 发送短信;
export const MERCHANT_API_OFFICIAL_SENDMESSAGE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/official/SendMessage',
    method: 'post',
    data: parameters
  })
}
// 官网首页 - 注册;
export const MERCHANT_API_OFFICIAL_REGISTER = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/official/Register',
    method: 'post',
    data: parameters
  })
}
// 官网首页 - 联系我们;
export const MERCHANT_API_OFFICIAL_CONTACT = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/official/Contact',
    method: 'post',
    data: parameters
  })
}
// 角色服务 - 加载;
export const MERCHANT_API_SECURITY_CHARACTER_GET = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_character/Get',
    method: 'get',
    params: parameters
  })
}
// 角色服务 - 加载LCB;
export const MERCHANT_API_SECURITY_CHARACTER_GETLCB = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_character/GetLcb',
    method: 'get',
    params: parameters
  })
}
// 角色功能开通追踪服务 - 加载(首页-提示);
export const MERCHANT_API_SECURITY_CHARACTER_TRACE_GET = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_character_trace/Get',
    method: 'get',
    params: parameters
  })
}
// 角色功能开通追踪服务 - 更新;
export const MERCHANT_API_SECURITY_CHARACTER_TRACE_UPDATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_character_trace/Update',
    method: 'post',
    data: parameters
  })
}
// 套餐开通日志 - 检索;
export const MERCHANT_API_SECURITY_CPACK_LOG_GETS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_cpack_log/Gets',
    method: 'get',
    params: parameters
  })
}
// 角色套餐 - 加载;
export const MERCHANT_API_SECURITY_CPACK_GET = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_cpack/Get',
    method: 'get',
    params: parameters
  })
}
// 下载任务 - 检索;
export const MERCHANT_API_SECURITY_DOWNLOAD_GETS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_download/Gets',
    method: 'get',
    params: parameters
  })
}
// 菜单权限 - 检索;
export const MERCHANT_API_SECURITY_MENU_POWER_GETS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_menu_power/Gets',
    method: 'get',
    params: parameters
  })
}
// 获取所有菜单(平台设置 - SaaS产品配置 - 功能配置) - 检索;
export const MERCHANT_API_SECURITY_MENU_GETS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_menu/Gets',
    method: 'get',
    params: parameters
  })
}
// 增值服务套餐 - 检索;
export const MERCHANT_API_SECURITY_PACK_BASIC_GETS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_pack_basic/Gets',
    method: 'get',
    params: parameters
  })
}
// 增值服务套餐 - 加载;
export const MERCHANT_API_SECURITY_PACK_BASIC_GET = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_pack_basic/Get',
    method: 'get',
    params: parameters
  })
}
// 增值服务套餐 - 创建;
export const MERCHANT_API_SECURITY_PACK_BASIC_CREATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_pack_basic/Create',
    method: 'post',
    data: parameters
  })
}
// 增值服务套餐 - 更新;
export const MERCHANT_API_SECURITY_PACK_BASIC_UPDATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_pack_basic/Update',
    method: 'post',
    data: parameters
  })
}
// 增值服务套餐 - 停用;
export const MERCHANT_API_SECURITY_PACK_BASIC_DISABLE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_pack_basic/Disable',
    method: 'post',
    data: parameters
  })
}
// 增值服务套餐 - 默认;
export const MERCHANT_API_SECURITY_PACK_BASIC_DEFAULT = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_pack_basic/Default',
    method: 'post',
    data: parameters
  })
}
// 增值服务套餐 - 排序;
export const MERCHANT_API_SECURITY_PACK_BASIC_SORT = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_pack_basic/Sort',
    method: 'post',
    data: parameters
  })
}
// 增值服务套餐之系统分组菜单(平台设置 - SaaS产品配置(右侧列表)) - 检索;
export const MERCHANT_API_SECURITY_PACK_MENU_REQS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_pack_menu/Reqs',
    method: 'get',
    params: parameters
  })
}
// 我的菜单;
export const MERCHANT_API_SECURITY_PACK_MENU_GETSMYMENU = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_pack_menu/GetsMyMenu',
    method: 'get',
    params: parameters
  })
}
// 增值服务套餐之系统分组菜单 - 创建;
export const MERCHANT_API_SECURITY_PACK_MENU_CREATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_pack_menu/Create',
    method: 'post',
    data: parameters
  })
}
// 增值服务套餐之系统分组 - 创建;
export const MERCHANT_API_SECURITY_PACK_SUB_CREATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_pack_sub/Create',
    method: 'post',
    data: parameters
  })
}
// 增值服务套餐之系统分组 - 更新;
export const MERCHANT_API_SECURITY_PACK_SUB_UPDATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_pack_sub/Update',
    method: 'post',
    data: parameters
  })
}
// 增值服务套餐之系统分组 - 删除;
export const MERCHANT_API_SECURITY_PACK_SUB_DELETE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_pack_sub/Delete',
    method: 'post',
    data: parameters
  })
}
// 增值服务套餐之系统 - 检索;
export const MERCHANT_API_SECURITY_PACK_SYS_GETS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_pack_sys/Gets',
    method: 'get',
    params: parameters
  })
}
// 增值服务套餐之系统 - 加载;
export const MERCHANT_API_SECURITY_PACK_SYS_GET = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_pack_sys/Get',
    method: 'get',
    params: parameters
  })
}
// 增值服务套餐之系统 - 创建;
export const MERCHANT_API_SECURITY_PACK_SYS_CREATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_pack_sys/Create',
    method: 'post',
    data: parameters
  })
}
// 增值服务套餐之系统 - 更新;
export const MERCHANT_API_SECURITY_PACK_SYS_UPDATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_pack_sys/Update',
    method: 'post',
    data: parameters
  })
}
// 增值服务套餐之系统 - 删除;
export const MERCHANT_API_SECURITY_PACK_SYS_DELETE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_pack_sys/Delete',
    method: 'post',
    data: parameters
  })
}
// 增值服务套餐之系统 - 排序;
export const MERCHANT_API_SECURITY_PACK_SYS_SORT = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_pack_sys/Sort',
    method: 'post',
    data: parameters
  })
}
// 快捷菜单 - 检索;
export const MERCHANT_API_SECURITY_QUICK_GETS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_quick/Gets',
    method: 'get',
    params: parameters
  })
}
// 快捷菜单 - 更新;
export const MERCHANT_API_SECURITY_QUICK_UPDATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_quick/Update',
    method: 'post',
    data: parameters
  })
}
// 角色 - 检索;
export const MERCHANT_API_SECURITY_ROLE_GETS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_role/Gets',
    method: 'get',
    params: parameters
  })
}
// 角色 - 加载;
export const MERCHANT_API_SECURITY_ROLE_GET = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_role/Get',
    method: 'get',
    params: parameters
  })
}
// 角色 - 创建;
export const MERCHANT_API_SECURITY_ROLE_CREATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_role/Create',
    method: 'post',
    data: parameters
  })
}
// 角色 - 更新;
export const MERCHANT_API_SECURITY_ROLE_UPDATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_role/Update',
    method: 'post',
    data: parameters
  })
}
// 角色 - 禁用;
export const MERCHANT_API_SECURITY_ROLE_DISABLE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_role/Disable',
    method: 'post',
    data: parameters
  })
}
// 系统用户会话 - 清理(缓存);
export const MERCHANT_API_SECURITY_SESSION_GET = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_session/Get',
    method: 'get',
    params: parameters
  })
}
// 退出登录;
export const MERCHANT_API_SECURITY_SESSION_LOGOUT = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_session/Logout',
    method: 'post',
    data: parameters
  })
}
// 角色皮肤 - 加载;
export const MERCHANT_API_SECURITY_SKIN_GET = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_skin/Get',
    method: 'get',
    params: parameters
  })
}
// 角色皮肤 - 更新;
export const MERCHANT_API_SECURITY_SKIN_UPDATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_skin/Update',
    method: 'post',
    data: parameters
  })
}
// 用户账号服务 - 检索;
export const MERCHANT_API_SECURITY_USER_GETS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/Gets',
    method: 'get',
    params: parameters
  })
}
// 用户账号服务 - 检索(总部专用,检索总部下所有门店的员工,不包括总部的员工);
export const MERCHANT_API_SECURITY_USER_REQS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/Reqs',
    method: 'get',
    params: parameters
  })
}
// 用户账号服务 - 导出;
export const MERCHANT_API_SECURITY_USER_EXPORT = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/Export',
    method: 'post',
    data: parameters
  })
}
// 用户账号服务 - 加载;
export const MERCHANT_API_SECURITY_USER_REQ = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/Req',
    method: 'get',
    params: parameters
  })
}
// 用户账号服务 - 检索;
export const MERCHANT_API_SECURITY_USER_GET = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/Get',
    method: 'get',
    params: parameters
  })
}
// 我的二维码;
export const MERCHANT_API_SECURITY_USER_QRCODE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/QrCode',
    method: 'get',
    params: parameters
  })
}
// 用户账号服务 - 登录;
export const MERCHANT_API_SECURITY_USER_LOGIN = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/Login',
    method: 'post',
    data: parameters
  })
}
// 用户账号服务 - 发送验证码;
export const MERCHANT_API_SECURITY_USER_SEND = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/Send',
    method: 'post',
    data: parameters
  })
}
// 用户账号服务 - 验证;
export const MERCHANT_API_SECURITY_USER_VERIFY = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/Verify',
    method: 'post',
    data: parameters
  })
}
// 用户账号服务 - 创建;
export const MERCHANT_API_SECURITY_USER_CREATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/Create',
    method: 'post',
    data: parameters
  })
}
// 用户账号服务 - 更新;
export const MERCHANT_API_SECURITY_USER_UPDATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/Update',
    method: 'post',
    data: parameters
  })
}
// 用户账号服务 - 审核;
export const MERCHANT_API_SECURITY_USER_AUDIT = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/Audit',
    method: 'post',
    data: parameters
  })
}
// 用户账号服务 - 取消审核;
export const MERCHANT_API_SECURITY_USER_UNAUDIT = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/UnAudit',
    method: 'post',
    data: parameters
  })
}
// 用户账号服务 - 作废;
export const MERCHANT_API_SECURITY_USER_ABANDON = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/Abandon',
    method: 'post',
    data: parameters
  })
}
// 用户账号服务 - 取消作废;
export const MERCHANT_API_SECURITY_USER_UNABANDON = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/UnAbandon',
    method: 'post',
    data: parameters
  })
}
// 用户账号服务 - 转正;
export const MERCHANT_API_SECURITY_USER_OFFICIAL = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/Official',
    method: 'post',
    data: parameters
  })
}
// 用户账号服务 - 离职;
export const MERCHANT_API_SECURITY_USER_LEAVED = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/Leaved',
    method: 'post',
    data: parameters
  })
}
// 用户账号服务 - 小程序退出(App上线后就用不到了);
export const MERCHANT_API_SECURITY_USER_UNBINDAPPLETID = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/UnBindAppletId',
    method: 'post',
    data: parameters
  })
}
// 用户账号服务 - 修改密码(个人);
export const MERCHANT_API_SECURITY_USER_PASSWORD = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/Password',
    method: 'post',
    data: parameters
  })
}
// 用户账号服务 - 修改密码(平台);
export const MERCHANT_API_SECURITY_USER_SETPASSWORDBYPLAT = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/SetPasswordByPlat',
    method: 'post',
    data: parameters
  })
}
// 员工绑定二维码;
export const MERCHANT_API_SECURITY_USER_BINDQRCODE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/BindQrCode',
    method: 'get',
    params: parameters
  })
}
// 员工绑定 - 扫二维码回调;
export const MERCHANT_API_SECURITY_USER_BIND = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/Bind',
    method: 'get',
    params: parameters
  })
}
// 员工解绑 ;
export const MERCHANT_API_SECURITY_USER_UNBIND = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_user/UnBind',
    method: 'post',
    data: parameters
  })
}
// 用户简历 - 加载(个人设置);
export const MERCHANT_API_SECURITY_VITA_GET = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_vita/Get',
    method: 'get',
    params: parameters
  })
}
// 用户简历 - 更新(个人设置);
export const MERCHANT_API_SECURITY_VITA_UPDATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/security_vita/Update',
    method: 'post',
    data: parameters
  })
}
// 单号规则与审核 - 检索;
export const MERCHANT_API_SETTING_GENERATE_GETS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/setting_generate/Gets',
    method: 'get',
    params: parameters
  })
}
// 单号规则与审核 - 加载;
export const MERCHANT_API_SETTING_GENERATE_GET = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/setting_generate/Get',
    method: 'get',
    params: parameters
  })
}
// 单号规则与审核 - 生成ID;
export const MERCHANT_API_SETTING_GENERATE_NEWID = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/setting_generate/NewId',
    method: 'post',
    data: parameters
  })
}
// 单号规则与审核 - 更新;
export const MERCHANT_API_SETTING_GENERATE_UPDATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/setting_generate/Update',
    method: 'post',
    data: parameters
  })
}
// 每日金价 - 检索;
export const MERCHANT_API_SETTING_GPRICE_GETS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/setting_gprice/Gets',
    method: 'get',
    params: parameters
  })
}
// 每日金价 - 加载;
export const MERCHANT_API_SETTING_GPRICE_GET = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/setting_gprice/Get',
    method: 'get',
    params: parameters
  })
}
// 每日金价 - 更新;
export const MERCHANT_API_SETTING_GPRICE_UPDATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/setting_gprice/Update',
    method: 'post',
    data: parameters
  })
}
// 参数开关设置 - 加载;
export const MERCHANT_API_SETTING_PARAMETER_GET = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/setting_parameter/Get',
    method: 'get',
    params: parameters
  })
}
// 不能选择的日期范围(不包含当前时间以后的时间);
export const MERCHANT_API_SETTING_PARAMETER_NOTSETTLEDDATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/setting_parameter/NotSettledDate',
    method: 'get',
    params: parameters
  })
}
// 参数开关设置 - 更新;
export const MERCHANT_API_SETTING_PARAMETER_UPDATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/setting_parameter/Update',
    method: 'post',
    data: parameters
  })
}
// 打印模板 - 检索-- 自定义模板;
export const MERCHANT_API_SETTING_PRINTING_GETS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/setting_printing/Gets',
    method: 'get',
    params: parameters
  })
}
// 打印模板 - 检索-- 系统模板;
export const MERCHANT_API_SETTING_PRINTING_SYSGETS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/setting_printing/SysGets',
    method: 'get',
    params: parameters
  })
}
// 打印模板 - 加载;
export const MERCHANT_API_SETTING_PRINTING_GET = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/setting_printing/Get',
    method: 'get',
    params: parameters
  })
}
// 打印模板 - 创建;
export const MERCHANT_API_SETTING_PRINTING_CREATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/setting_printing/Create',
    method: 'post',
    data: parameters
  })
}
// 打印模板 - 更新;
export const MERCHANT_API_SETTING_PRINTING_UPDATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/setting_printing/Update',
    method: 'post',
    data: parameters
  })
}
// 打印模板 - 复制;
export const MERCHANT_API_SETTING_PRINTING_COPY = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/setting_printing/Copy',
    method: 'post',
    data: parameters
  })
}
// 打印模板 - 默认;
export const MERCHANT_API_SETTING_PRINTING_DEFAULT = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/setting_printing/Default',
    method: 'post',
    data: parameters
  })
}
// 打印模板 - 审核;
export const MERCHANT_API_SETTING_PRINTING_NORMAL = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/setting_printing/Normal',
    method: 'post',
    data: parameters
  })
}
// 打印模板 - 设计中;
export const MERCHANT_API_SETTING_PRINTING_DESIGN = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/setting_printing/Design',
    method: 'post',
    data: parameters
  })
}
// 打印模板 - 删除;
export const MERCHANT_API_SETTING_PRINTING_DELETE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/setting_printing/Delete',
    method: 'post',
    data: parameters
  })
}
// 门店基本资料 - 检索;
export const MERCHANT_API_STORE_BASIC_GETS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/store_basic/Gets',
    method: 'get',
    params: parameters
  })
}
// 门店基本资料 - 门店概况;
export const MERCHANT_API_STORE_BASIC_HOME = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/store_basic/Home',
    method: 'get',
    params: parameters
  })
}
// 门店基本资料 - 加载(门店信息);
export const MERCHANT_API_STORE_BASIC_GET = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/store_basic/Get',
    method: 'get',
    params: parameters
  })
}
// 门店基本资料 - 加载;
export const MERCHANT_API_STORE_BASIC_REQ = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/store_basic/Req',
    method: 'get',
    params: parameters
  })
}
// 首页 - 门店总数;
export const MERCHANT_API_STORE_BASIC_GETCOUNT = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/store_basic/GetCount',
    method: 'get',
    params: parameters
  })
}
// 门店基本资料 - 创建;
export const MERCHANT_API_STORE_BASIC_CREATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/store_basic/Create',
    method: 'post',
    data: parameters
  })
}
// 门店基本资料 - 更新(平台端);
export const MERCHANT_API_STORE_BASIC_UPDATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/store_basic/Update',
    method: 'post',
    data: parameters
  })
}
// 门店基本资料 - 更新(门店端);
export const MERCHANT_API_STORE_BASIC_UPDATEINFO = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/store_basic/UpdateInfo',
    method: 'post',
    data: parameters
  })
}
// 门店基本资料 - 开业;
export const MERCHANT_API_STORE_BASIC_OPEN = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/store_basic/Open',
    method: 'post',
    data: parameters
  })
}
// 门店基本资料 - 停业;
export const MERCHANT_API_STORE_BASIC_CLOSE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/store_basic/Close',
    method: 'post',
    data: parameters
  })
}
// 门店基本资料 - 更新公众号授权状态;
export const MERCHANT_API_STORE_BASIC_WXAUTHORIZERSTATUS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/store_basic/WxAuthorizerStatus',
    method: 'post',
    data: parameters
  })
}
// 门店基本资料 - 更新收银机数量;
export const MERCHANT_API_STORE_BASIC_CASHIERAMOUNT = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/store_basic/CashierAmount',
    method: 'post',
    data: parameters
  })
}
// 礼品供应商服务 - 检索;
export const MERCHANT_API_SUPPLIER_BASIC_GETS = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/supplier_basic/Gets',
    method: 'get',
    params: parameters
  })
}
// 礼品供应商服务 - 加载;
export const MERCHANT_API_SUPPLIER_BASIC_GET = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/supplier_basic/Get',
    method: 'get',
    params: parameters
  })
}
// 礼品供应商服务 - 加载;
export const MERCHANT_API_SUPPLIER_BASIC_REQ = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/supplier_basic/Req',
    method: 'get',
    params: parameters
  })
}
// 礼品供应商服务 - 加载(公司信息);
export const MERCHANT_API_SUPPLIER_BASIC_DETAIL = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/supplier_basic/Detail',
    method: 'get',
    params: parameters
  })
}
// 礼品供应商服务 - 创建;
export const MERCHANT_API_SUPPLIER_BASIC_CREATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/supplier_basic/Create',
    method: 'post',
    data: parameters
  })
}
// 礼品供应商服务 - 更新;
export const MERCHANT_API_SUPPLIER_BASIC_UPDATE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/supplier_basic/Update',
    method: 'post',
    data: parameters
  })
}
// 礼品供应商服务 - 公司信息更新;
export const MERCHANT_API_SUPPLIER_BASIC_UPDATEINFO = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/supplier_basic/UpdateInfo',
    method: 'post',
    data: parameters
  })
}
// 礼品供应商服务 - 启用;
export const MERCHANT_API_SUPPLIER_BASIC_ENABLE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/supplier_basic/Enable',
    method: 'post',
    data: parameters
  })
}
// 礼品供应商服务 - 停用;
export const MERCHANT_API_SUPPLIER_BASIC_DISABLE = parameters => {
  return fetch({
    cloud: 'Merchant',
    url: '/supplier_basic/Disable',
    method: 'post',
    data: parameters
  })
}
