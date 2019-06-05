import fetch from '@/utilities/fetch'

const getQueryString = (...args) => {
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
 * 查询粉丝列表
 * @param {Object} parameters -{memberId:'String',storeName:'String',trueName:'String',mobile:'String',vipCardNo:'String',subscrTimeStart:'String',subscrTimeEnd:'String',unsubscrTimeStart:'String',unsubscrTimeEnd:'String',subscrFrom:'String',groupId:'String',levelId:'String',isSubscribe:'String',memberType:'String',appType:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_MEMBER_GETFANSLIST = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Member/GetFansList/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 查询微信会员列表
 * @param {Object} parameters -{memberId:'String',characterId:'String',storeName:'String',aliasName:'String',trueName:'String',mobile:'String',vipCardNo:'String',sexyType:'String',birthdayStart:'String',birthdayEnd:'String',dateOfBirthStartArray:'String',dateOfBirthEndArray:'String',lunarCalendar:'String',provinceId:'String',cityId:'String',townId:'String',subscrTimeStart:'String',subscrTimeEnd:'String',joinTimeStart:'String',joinTimeEnd:'String',memberType:'String',groupId:'String',levelId:'String',status:'String',memberTagId:'String',uniteNote:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_MEMBER_GETWXMEMBERLIST = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Member/GetWXMemberList/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 查询微信会员列表(无权限校验供非CRM系统调用)
 * @param {Object} parameters -{memberId:'String',characterId:'String',storeName:'String',aliasName:'String',trueName:'String',mobile:'String',vipCardNo:'String',sexyType:'String',birthdayStart:'String',birthdayEnd:'String',dateOfBirthStartArray:'String',dateOfBirthEndArray:'String',lunarCalendar:'String',provinceId:'String',cityId:'String',townId:'String',subscrTimeStart:'String',subscrTimeEnd:'String',joinTimeStart:'String',joinTimeEnd:'String',memberType:'String',groupId:'String',levelId:'String',status:'String',memberTagId:'String',uniteNote:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_MEMBER_GETS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Member/Gets/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 查询线下会员列表
 * @param {Object} parameters -{vipCardNo:'String',characterId:'String',storeName:'String',trueName:'String',mobile:'String',historyScoreMin:'String',historyScoreMax:'String',sexyType:'String',levelId:'String',birthdayStart:'String',birthdayEnd:'String',dateOfBirthStartArray:'String',dateOfBirthEndArray:'String',lunarCalendar:'String',joinTimeStart:'String',joinTimeEnd:'String',createTimeStart:'String',createTimeEnd:'String',groupId:'String',memberTagId:'String',upgradeStatus:'String',provinceId:'String',cityId:'String',townId:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_MEMBER_GETMEMBERLIST = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Member/GetMemberList/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取会员信息
 * @param {String} memberId
 */
export const MEMBERSHIP_API_MEMBER_GETMEMBERINFO = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { memberId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/Member/GetMemberInfo/${getQueryString(
      'memberId',
      parameters.memberId
    )}`,
    method: 'post'
  })
}

/**
 * 获取会员标签
 * @param {String} memberId
 */
export const MEMBERSHIP_API_MEMBER_GETMEMBERTAGS = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { memberId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/Member/GetMemberTags/${getQueryString(
      'memberId',
      parameters.memberId
    )}`,
    method: 'post'
  })
}

/**
 * 获取会员基本信息
 * @param {String} memberId
 */
export const MEMBERSHIP_API_MEMBER_GETMEMBERBASICINFO = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { memberId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/Member/GetMemberBasicInfo/${getQueryString(
      'memberId',
      parameters.memberId
    )}`,
    method: 'post'
  })
}

/**
 * 新建线下会员
 * @param {Object} parameters -{vipCardNo:'String',trueName:'String',mobile:'String',aliasName:'String',sexyType:'String',provinceId:'String',cityId:'String',townId:'String',provinceName:'String',cityName:'String',townName:'String',birthday:'String',dateOfBirthArray:'String',lunarCalendar:'Number',joinTime:'String',settingOptionGroupId:'String',settingOptionLevelId:'String',remark:'String',settingMemberTags:'String',historyScore:'String',scoreExpireTime:'String',qQ:'String',email:'String',commemorate:'String',marriageStatus:'String'}
 */
export const MEMBERSHIP_API_MEMBER_CREATEMEMBER = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Member/CreateMember/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 修改会员信息
 * @param {Object} parameters -{memberId:'String',vipCardNo:'String',trueName:'String',mobile:'String',aliasName:'String',sexyType:'String',provinceId:'String',cityId:'String',townId:'String',provinceName:'String',cityName:'String',townName:'String',birthday:'String',dateOfBirthArray:'String',lunarCalendar:'Number',joinTime:'String',settingOptionGroupId:'String',settingOptionLevelId:'String',remark:'String',settingMemberTags:'String',historyScore:'String',scoreExpireTime:'String',qQ:'String',email:'String',commemorate:'String',marriageStatus:'Number'}
 */
export const MEMBERSHIP_API_MEMBER_UPDATEMEMBER = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Member/UpdateMember/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 启用会员
 * @param {String} memberId
 */
export const MEMBERSHIP_API_MEMBER_ENABLEMEMBER = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { memberId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/Member/EnableMember/${getQueryString(
      'memberId',
      parameters.memberId
    )}`,
    method: 'post'
  })
}

/**
 * 停用会员
 * @param {String} memberId
 */
export const MEMBERSHIP_API_MEMBER_DISABLEMEMBER = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { memberId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/Member/DisableMember/${getQueryString(
      'memberId',
      parameters.memberId
    )}`,
    method: 'post'
  })
}

/**
 * 批量设置客户分组
 * @param {Object} parameters -{memberIdList:'String',settingOptionGroupId:'String'}
 */
export const MEMBERSHIP_API_MEMBER_BATCHSETMEMBERGROUP = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Member/BatchSetMemberGroup/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 批量设置客户等级
 * @param {Object} parameters -{memberIdList:'String',settingOptionLevelId:'String'}
 */
export const MEMBERSHIP_API_MEMBER_BATCHSETMEMBERLEVEL = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Member/BatchSetMemberLevel/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 批量设置客户标签
 * @param {Object} parameters -{memberSNList:'String',settingMemberTags:'String'}
 */
export const MEMBERSHIP_API_MEMBER_BATCHSETMEMBERTAGS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Member/BatchSetMemberTags/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 导入线下会员
 * @param {Object} parameters -{fileName:'String'}
 */
export const MEMBERSHIP_API_MEMBER_IMPORTOFFLINEMEMBER = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Member/ImportOfflineMember/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 删除线下会员
 * @param {String} memberId
 */
export const MEMBERSHIP_API_MEMBER_DELETEOFFLINEMEMBER = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { memberId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/Member/DeleteOfflineMember/${getQueryString(
      'memberId',
      parameters.memberId
    )}`,
    method: 'post'
  })
}

/**
 * 批量删除线下会员
 * @param {Object} parameters -}
 */
export const MEMBERSHIP_API_MEMBER_BATCHDELETEOFFLINEMEMBER = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Member/BatchDeleteOfflineMember/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 添加客户进店记录
 * @param {Object} parameters -{memberId:'String',aliasName:'String',trueName:'String',entryTime:'String',stayMinute:'String',goodsMaterial1:'String',goodsMaterialId1:'String',goodsCategory1:'String',goodsCategoryId1:'String',goodsMaterial2:'String',goodsMaterialId2:'String',goodsCategory2:'String',goodsCategoryId2:'String',budgetStart:'String',budgetEnd:'String',goodsPriceStart:'String',goodsPriceEnd:'String',remark:'String'}
 */
export const MEMBERSHIP_API_MEMBERENTERLOG_CREATE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/MemberEnterLog/Create/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 查询会员进店记录列表
 * @param {Object} parameters -{memberId:'String',characterId:'String',trueName:'String',mobile:'String',vipCardNo:'String',nickName:'String',enterStoreTimeStart:'String',enterStoreTimeEnd:'String'}
 */
export const MEMBERSHIP_API_MEMBERENTERLOG_GETMEMBERENTERLOGLIST = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/MemberEnterLog/GetMemberEnterLogList/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 删除客户进店记录
 * @param {String} memberEnterLogId
 */
export const MEMBERSHIP_API_MEMBERENTERLOG_DELETEMEMBERENTERLOG = parameters => {
  parameters =
    typeof parameters === 'object'
      ? parameters
      : { memberEnterLogId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/MemberEnterLog/DeleteMemberEnterLog/${getQueryString(
      'memberEnterLogId',
      parameters.memberEnterLogId
    )}`,
    method: 'post'
  })
}

/**
 *
 */
export const MEMBERSHIP_API_MERCHANTSERVICE_GETALLSTORES = () => {
  return fetch({
    cloud: 'Membership',
    url: `/api/MerchantService/GetAllStores/`,
    method: 'post'
  })
}

/**
 *
 */
export const MEMBERSHIP_API_MERCHANTSERVICE_GETALLSUPPLIERS = () => {
  return fetch({
    cloud: 'Membership',
    url: `/api/MerchantService/GetAllSuppliers/`,
    method: 'post'
  })
}

/**
 * 积分统计,页面上的4个汇总，将返回的数据汇总一下就好了，不再另外提供接口
 * @param {Object} parameters -{timeStart:'String',timeEnd:'String',storeCode:'String',storeName:'String',storeType:'String'}
 */
export const MEMBERSHIP_API_REPORTMEMBERBALANCELOG_COUNTPOINTS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ReportMemberBalanceLog/CountPoints/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 积分对账单,这个页面上的汇总，调用SearchSummary
 * @param {Object} parameters -{timeStart:'String',timeEnd:'String',storeCode:'String',storeName:'String',storeType:'String',logType:'String',scoreType:'String',changeWay:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_REPORTMEMBERBALANCELOG_SEARCH = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ReportMemberBalanceLog/Search/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 积分对账单 汇总，分页和排序不用赋值
 * @param {Object} parameters -{timeStart:'String',timeEnd:'String',storeCode:'String',storeName:'String',storeType:'String',logType:'String',scoreType:'String',changeWay:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_REPORTMEMBERBALANCELOG_SEARCHSUMMARY = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ReportMemberBalanceLog/SearchSummary/`,
    method: 'post',
    data: parameters
  })
}

/**
 *
 * @param {Object} parameters -}
 */
export const MEMBERSHIP_API_SCORERULE_SEARCH = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { characterId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/ScoreRule/Search/${getQueryString(
      'characterId',
      parameters.characterId
    )}`,
    method: 'post'
  })
}

/**
 * 保存赠送规则
 * @param {Object} parameters -{materialType:'Number',scoreTypeItems:'String'}
 */
export const MEMBERSHIP_API_SCORERULE_SAVE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ScoreRule/Save/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取特定日期倍率设定列表
 */
export const MEMBERSHIP_API_SCORERULE_SEARCHBYRATERULES = () => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ScoreRule/SearchByRateRules/`,
    method: 'post'
  })
}

/**
 * 添加特定日期倍率
 * @param {Object} parameters -{dateName:'String',dateStart:'String',dateEnd:'String',scoreRate:'Number',goldenRiceRate:'Number',remark:'String'}
 */
export const MEMBERSHIP_API_SCORERULE_CREATEBYRATERULE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ScoreRule/CreateByRateRule/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 更新特定日期倍率
 * @param {Object} parameters -{rateId:'String',dateName:'String',dateStart:'String',dateEnd:'String',scoreRate:'Number',goldenRiceRate:'Number',remark:'String'}
 */
export const MEMBERSHIP_API_SCORERULE_UPDATEBYRATERULE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ScoreRule/UpdateByRateRule/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 更新特定日期倍率状态
 * @param {Object} parameters -{rateId:'String',state:'Number'}
 */
export const MEMBERSHIP_API_SCORERULE_UPDATESTATUSBYRATERULE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ScoreRule/UpdateStatusByRateRule/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 删除特定日期倍率
 * @param {String} rateId
 */
export const MEMBERSHIP_API_SCORERULE_DELETEBYRATERULE = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { rateId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/ScoreRule/DeleteByRateRule/${getQueryString(
      'rateId',
      parameters.rateId
    )}`,
    method: 'post'
  })
}

/**
 * 创建选项
 * @param {Object} parameters -{optionType:'Number',name:'String'}
 */
export const MEMBERSHIP_API_SETTINGOPTION_CREATESETTINGOPTION = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingOption/CreateSettingOption/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 删除选项
 * @param {String} settingOptionId
 */
export const MEMBERSHIP_API_SETTINGOPTION_DELETESETTINGOPTION = parameters => {
  parameters =
    typeof parameters === 'object'
      ? parameters
      : { settingOptionId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingOption/DeleteSettingOption/${getQueryString(
      'settingOptionId',
      parameters.settingOptionId
    )}`,
    method: 'post'
  })
}

/**
 * 更新选项
 * @param {Object} parameters -{settingOptionId:'String',name:'String'}
 */
export const MEMBERSHIP_API_SETTINGOPTION_UPDATESETTINGOPTION = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingOption/UpdateSettingOption/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取下拉列表选项
 * @param {String} type
 */
export const MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { type: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingOption/GetOptions/${getQueryString(
      'type',
      parameters.type
    )}`,
    method: 'post'
  })
}

/**
 * 获取会员分组列表
 */
export const MEMBERSHIP_API_SETTINGOPTION_GETMEMBERGROUPS = () => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingOption/GetMemberGroups/`,
    method: 'post'
  })
}

/**
 * 获取会员等级列表
 */
export const MEMBERSHIP_API_SETTINGOPTION_GETMEMBERLEVELS = () => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingOption/GetMemberLevels/`,
    method: 'post'
  })
}

/**
 * 选项排序
 * @param {Object} parameters -{settingOptionIdList:'String'}
 */
export const MEMBERSHIP_API_SETTINGOPTION_SORTSETTINGOPTION = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingOption/SortSettingOption/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取客户备注项目列表
 */
export const MEMBERSHIP_API_SETTINGOPTION_GETMEMBERREMARKPROJECTS = () => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingOption/GetMemberRemarkProjects/`,
    method: 'post'
  })
}

/**
 * 保存客户分组
 * @param {Object} parameters -{groups:'String'}
 */
export const MEMBERSHIP_API_SETTINGOPTION_SAVEMEMBERGROUPS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingOption/SaveMemberGroups/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 保存客户等级
 * @param {Object} parameters -{levels:'String'}
 */
export const MEMBERSHIP_API_SETTINGOPTION_SAVEMEMBERLEVELS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingOption/SaveMemberLevels/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 营销效果分析
 * @param {Object} parameters -{characterId:'String',dateStart:'String',dateEnd:'String'}
 */
export const MEMBERSHIP_API_REPORTMARKETING_GETMARKETINGSTATISTICS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ReportMarketing/GetMarketingStatistics/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 进店统计
 * @param {Object} parameters -{characterId:'String',dateStart:'String',dateEnd:'String'}
 */
export const MEMBERSHIP_API_REPORTENTERLOG_GETENTERLOGSTATISTICS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ReportEnterLog/GetEnterLogStatistics/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 达成交易时间分析（首次进店与达成交易相差的时间）
 * @param {Object} parameters -{characterId:'String',dateStart:'String',dateEnd:'String'}
 */
export const MEMBERSHIP_API_REPORTENTERLOG_GETEXPENDTIMESTATISTICS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ReportEnterLog/GetExpendTimeStatistics/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 达成交易金额差值分析（与预算相差的金额）
 * @param {Object} parameters -{characterId:'String',dateStart:'String',dateEnd:'String'}
 */
export const MEMBERSHIP_API_REPORTENTERLOG_GETEXPENDPRICESTATISTICS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ReportEnterLog/GetExpendPriceStatistics/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 达成交易货品类型变化（与意向商品对比）
 * @param {Object} parameters -{characterId:'String',dateStart:'String',dateEnd:'String'}
 */
export const MEMBERSHIP_API_REPORTENTERLOG_GETEXPENDGOODSCATEGORYSTATISTICS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ReportEnterLog/GetExpendGoodsCategoryStatistics/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 创建单据
 * @param {Object} parameters -{settingOptionId:'String',settingOptionName:'String',remark:'String'}
 */
export const MEMBERSHIP_API_DEDUCTORDER_CREATE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/DeductOrder/Create/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 提交审核
 * @param {String} deductCode
 */
export const MEMBERSHIP_API_DEDUCTORDER_SUBMIT = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { deductCode: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/DeductOrder/Submit/${getQueryString(
      'deductCode',
      parameters.deductCode
    )}`,
    method: 'post'
  })
}

/**
 * 作废
 * @param {Object} parameters -{deductCode:'String',checkNote:'String'}
 */
export const MEMBERSHIP_API_DEDUCTORDER_INVALID = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/DeductOrder/Invalid/`,
    method: 'post',
    data: parameters
  })
}

/**
 *
 * @param {Object} parameters -{capacity:'Number',item:'String'}
 */
export const MEMBERSHIP_API_DEDUCTORDER_AUDITRETURN = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/DeductOrder/AuditReturn/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 审核单据
 * @param {Object} parameters -{deductCodes:'String'}
 */
export const MEMBERSHIP_API_DEDUCTORDER_AUDIT = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/DeductOrder/Audit/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 查询单据列表
 * @param {Object} parameters -{characterId:'String',deductCode:'String',createUserId:'String',createTimeStart:'String',createTimeEnd:'String',lastTimeStart:'String',lastTimeEnd:'String',status:'String',settingOptionId:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_DEDUCTORDER_GETDEDUCTORDERLIST = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/DeductOrder/GetDeductOrderList/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取单据明细(包含单据信息和明细列表)
 * @param {Object} parameters -{deductCode:'String',key:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_DEDUCTORDER_GETDEDUCTORDERITEMS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/DeductOrder/GetDeductOrderItems/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 更新单据信息
 * @param {Object} parameters -{deductCode:'String',settingOptionId:'String',settingOptionName:'String',remark:'String'}
 */
export const MEMBERSHIP_API_DEDUCTORDER_UPDATEDEDUCTORDER = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/DeductOrder/UpdateDeductOrder/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 更新扣减单明细(单个赠送，按明细id)
 * @param {Object} parameters -{itemId:'String',goldenRice:'String',score:'String'}
 */
export const MEMBERSHIP_API_DEDUCTORDER_UPDATEDEDUCTORDERITEMS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/DeductOrder/UpdateDeductOrderItems/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 删除扣减单明细
 * @param {String} itemId
 */
export const MEMBERSHIP_API_DEDUCTORDER_DELETEITEM = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { itemId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/DeductOrder/DeleteItem/${getQueryString(
      'itemId',
      parameters.itemId
    )}`,
    method: 'post'
  })
}

/**
 * 批量更新扣减单据明细(统一赠送，按单据编号)
 * @param {Object} parameters -{deductCode:'String',scoreType:'Number',deductQty:'Number'}
 */
export const MEMBERSHIP_API_DEDUCTORDER_BATCHUPDATEDEDUCTORDERITEMS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/DeductOrder/BatchUpdateDeductOrderItems/`,
    method: 'post',
    data: parameters
  })
}

/**
 *
 * @param {Object} parameters -{capacity:'Number',item:'String'}
 */
export const MEMBERSHIP_API_DEDUCTORDER_BATCHIMPORTMEMBER = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/DeductOrder/BatchImportMember/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 导入数据挖掘到扣减单
 * @param {Object} parameters -{deductCode:'String',groupIds:'String',exceptEmptyMobile:'String',subscribeType:'String'}
 */
export const MEMBERSHIP_API_DEDUCTORDER_BATCHIMPORTANALYSIS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/DeductOrder/BatchImportAnalysis/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取材质列表
 */
export const MEMBERSHIP_API_STORESETTINGCATEGORY_GETMATERIALLIST = () => {
  return fetch({
    cloud: 'Membership',
    url: `/api/StoreSettingCategory/GetMaterialList/`,
    method: 'post'
  })
}

/**
 * 获取品类列表
 */
export const MEMBERSHIP_API_STORESETTINGCATEGORY_GETCATEGORYLIST = () => {
  return fetch({
    cloud: 'Membership',
    url: `/api/StoreSettingCategory/GetCategoryList/`,
    method: 'post'
  })
}

/**
 *
 * @param {Object} parameters -{apiKey:'String',exportFields:'String',exportType:'Number',records:'String',apiParameter:'String'}
 */
export const MEMBERSHIP_API_STOREEXPORTER_EXPORTTOFILE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/StoreExporter/ExportToFile/`,
    method: 'post',
    data: parameters
  })
}

/**
 *
 * @param {Object} parameters -{apiKey:'String'}
 */
export const MEMBERSHIP_API_STOREEXPORTER_GETEXPORTFIELDS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/StoreExporter/GetExportFields/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 添加短信接收客户
 * @param {Object} parameters -{messageTaskId:'Number',members:'String'}
 */
export const MEMBERSHIP_API_MESSAGEITEM_ADDMEMBERS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/MessageItem/AddMembers/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 从数据挖掘标签导入
 * @param {Object} parameters -{messageTaskId:'Number',settingTagGroupId:'Number',exceptEmptyMobile:'String',subscribeType:'String'}
 */
export const MEMBERSHIP_API_MESSAGEITEM_ADDMEMBERSFROMTAGGROUP = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/MessageItem/AddMembersFromTagGroup/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 删除客户
 * @param {String} messageItemId
 */
export const MEMBERSHIP_API_MESSAGEITEM_DELETE = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { messageItemId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/MessageItem/Delete/${getQueryString(
      'messageItemId',
      parameters.messageItemId
    )}`,
    method: 'post'
  })
}

/**
 * 查询短信接收客户列表
 * @param {Object} parameters -{messageTaskId:'Number',keyword:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_MESSAGEITEM_GETMESSAGEMEMBERS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/MessageItem/GetMessageMembers/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 查询短信发送记录列表
 * @param {Object} parameters -{templateId:'String',memberId:'String',trueName:'String',mobile:'String',vipCardNo:'String',sendTimeStart:'String',sendTimeEnd:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_MESSAGEITEM_GETMESSAGELOGS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/MessageItem/GetMessageLogs/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取会员兑换记录
 * @param {Object} parameters -{memberId:'String',characterId:'Number',characterType:'Number',extensionData:'String',orderField:'String',orderType:'Number'}
 */
export const MEMBERSHIP_API_GIFTSERVICE_GETMEMBEREXCHANGES = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/GiftService/GetMemberExchanges/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取动态列表
 * @param {Object} parameters -{logType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_MEMBEROPERATELOG_GETMEMBEROPERATELOGS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/MemberOperateLog/GetMemberOperateLogs/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取回访任务列表
 * @param {Object} parameters -{settingOptionId:'String',finishStatus:'String',taskName:'String',createUserId:'String',status:'String',createTimeStart:'String',createTimeEnd:'String',lastTimeStart:'String',lastTimeEnd:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_VISITTASK_SEARCH = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTask/Search/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取当前回访任务
 * @param {String} visitTaskId
 */
export const MEMBERSHIP_API_VISITTASK_GETVISITTASKBYID = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { visitTaskId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTask/GetVisitTaskById/${getQueryString(
      'visitTaskId',
      parameters.visitTaskId
    )}`,
    method: 'post'
  })
}

/**
 * 获取门店店员账户列表
 */
export const MEMBERSHIP_API_VISITTASK_GETSECURITYUSERLIST = () => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTask/GetSecurityUserList/`,
    method: 'post'
  })
}

/**
 * 创建回访任务
 * @param {Object} parameters -{visitTaskId:'Number',taskName:'String',settingOptionId:'String',settingOptionName:'String',visitUserList:'String',markType:'Number',results:'String',remark:'String'}
 */
export const MEMBERSHIP_API_VISITTASK_CREATE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTask/Create/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 从数据挖掘标签分组中快捷创建回访任务
 * @param {Object} parameters -{settingTagGroupId:'String',exceptEmptyMobile:'String',subscribeType:'String',visitTaskId:'Number',taskName:'String',settingOptionId:'String',settingOptionName:'String',visitUserList:'String',markType:'Number',results:'String',remark:'String'}
 */
export const MEMBERSHIP_API_VISITTASK_CREATEWITHTAGGROUP = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTask/CreateWithTagGroup/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 修改基本信息
 * @param {Object} parameters -{visitTaskId:'Number',taskName:'String',settingOptionId:'String',settingOptionName:'String',visitUserList:'String',markType:'Number',results:'String',remark:'String'}
 */
export const MEMBERSHIP_API_VISITTASK_UPDATEBASIC = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTask/UpdateBasic/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 选择待回访的客户
 * @param {Object} parameters -{visitTaskId:'Number',members:'String'}
 */
export const MEMBERSHIP_API_VISITTASK_ADDVISITMEMBERS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTask/AddVisitMembers/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 按标签分组导入
 * @param {Object} parameters -{visitTaskId:'Number',settingTagGroupId:'Number',exceptEmptyMobile:'String',subscribeType:'String'}
 */
export const MEMBERSHIP_API_VISITTASK_ADDVISITMEMBESFROMTAGGROUP = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTask/AddVisitMembesFromTagGroup/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 删除待回访的客户
 * @param {String} visitTaskId
 * @param {String} visitMemberId
 */
export const MEMBERSHIP_API_VISITTASK_DELETEVISITMEMBERS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTask/DeleteVisitMembers/${getQueryString(
      'visitTaskId',
      parameters.visitTaskId,
      'visitMemberId',
      parameters.visitMemberId
    )}`,
    method: 'post'
  })
}

/**
 * 提交审核
 * @param {String} visitTaskId
 */
export const MEMBERSHIP_API_VISITTASK_SUBMITAUDIT = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { visitTaskId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTask/SubmitAudit/${getQueryString(
      'visitTaskId',
      parameters.visitTaskId
    )}`,
    method: 'post'
  })
}

/**
 * 审核/取消审核
 * @param {Object} parameters -{visitTaskId:'Number',result:'Number',auditComment:'String'}
 */
export const MEMBERSHIP_API_VISITTASK_AUDIT = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTask/Audit/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 批量审核
 * @param {Object} parameters -{visitTaskIds:'String',result:'Number',auditComment:'String'}
 */
export const MEMBERSHIP_API_VISITTASK_BATCHAUDIT = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTask/BatchAudit/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 作废
 * @param {String} visitTaskId
 */
export const MEMBERSHIP_API_VISITTASK_INVALID = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { visitTaskId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTask/Invalid/${getQueryString(
      'visitTaskId',
      parameters.visitTaskId
    )}`,
    method: 'post'
  })
}

/**
 * 获取回访任务详情
 * @param {String} visitTaskId
 */
export const MEMBERSHIP_API_VISITTASK_GETDETAIL = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { visitTaskId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTask/GetDetail/${getQueryString(
      'visitTaskId',
      parameters.visitTaskId
    )}`,
    method: 'post'
  })
}

/**
 * 获取回访客户列表
 * @param {Object} parameters -{visitTaskId:'Number',keyword:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_VISITTASK_GETVISITMEMBERLIST = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTask/GetVisitMemberList/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取回访任务执行人
 * @param {String} visitTaskId
 */
export const MEMBERSHIP_API_VISITTASK_GETVISITUSERS = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { visitTaskId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTask/GetVisitUsers/${getQueryString(
      'visitTaskId',
      parameters.visitTaskId
    )}`,
    method: 'post'
  })
}

/**
 * 获取任务统计(待审核、待回访)
 */
export const MEMBERSHIP_API_VISITTASK_GETTASKSTATISTICS = () => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTask/GetTaskStatistics/`,
    method: 'post'
  })
}

/**
 * 获取回访任务结果
 * @param {String} visitTaskId
 */
export const MEMBERSHIP_API_VISITTASK_GETVISITTASKRESULTS = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { visitTaskId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTask/GetVisitTaskResults/${getQueryString(
      'visitTaskId',
      parameters.visitTaskId
    )}`,
    method: 'post'
  })
}

/**
 * 获取会员等级设置
 */
export const MEMBERSHIP_API_SETTINGMEMBERLEVELRULE_GETSETTINGS = () => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingMemberLevelRule/GetSettings/`,
    method: 'post'
  })
}

/**
 * 保存会员等级设置
 * @param {Object} parameters -{memberUpgradeType:'Number',updateType:'Number',settingItems:'String'}
 */
export const MEMBERSHIP_API_SETTINGMEMBERLEVELRULE_SAVESETTINGS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingMemberLevelRule/SaveSettings/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取所有进店记录列表
 * @param {Object} parameters -{memberId:'String',characterId:'String',trueName:'String',mobile:'String',vipCardNo:'String',aliasName:'String',enterStoreTimeStart:'String',enterStoreTimeEnd:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_MEMBERENTERSTORE_SEARCH = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/MemberEnterStore/Search/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 小程序登录获取access_token
 * @param {Object} parameters -{code:'String',appId:'String',companyId:'Number',storeId:'Number',characterId:'Number'}
 */
export const MEMBERSHIP_API_SECURITY_MINIPROGRAMLOGIN = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Security/MiniProgramLogin/`,
    method: 'get',
    params: parameters
  })
}

/**
 * 更新用户信息
 * @param {Object} parameters -{encryptedData:'String',iv:'String',openId:'String',appType:'Number',trueName:'String'}
 */
export const MEMBERSHIP_API_SECURITY_UPDATEUSERINFO = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Security/UpdateUserInfo/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 检查是会员否关注公众号
 * @param {String} memberId
 */
export const MEMBERSHIP_API_SECURITY_HADSUBCRIBED = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { memberId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/Security/HadSubcribed/${getQueryString(
      'memberId',
      parameters.memberId
    )}`,
    method: 'post'
  })
}

/**
 *
 * @param {String} destCharacterId
 * @param {String} parameters -}
 */
export const MEMBERSHIP_API_MOVE_ROLLMEMBERSTORE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Move/RollMemberStore/${getQueryString(
      'destCharacterId',
      parameters.destCharacterId
    )}`,
    method: 'post'
  })
}

/**
 * 创建回访记录
 * @param {Object} parameters -{visitTaskId:'Number',visitMemberId:'String',memberId:'String',settingOptionMethodId:'String',settingOptionMethodName:'String',resultValue:'Number',resultText:'String',content:'String'}
 */
export const MEMBERSHIP_API_VISITLOG_CREATE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitLog/Create/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 创建记录并结束回访
 * @param {Object} parameters -{visitTaskId:'Number',visitMemberId:'String',memberId:'String',settingOptionMethodId:'String',settingOptionMethodName:'String',resultValue:'Number',resultText:'String',content:'String'}
 */
export const MEMBERSHIP_API_VISITLOG_CREATEANDFINISHVISIT = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitLog/CreateAndFinishVisit/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取回访记录列表
 * @param {Object} parameters -{memberId:'String',visitTaskId:'String'}
 */
export const MEMBERSHIP_API_VISITLOG_GETVISITLOGS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitLog/GetVisitLogs/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 删除回访记录
 * @param {String} visitLogId
 */
export const MEMBERSHIP_API_VISITLOG_DELETE = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { visitLogId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitLog/Delete/${getQueryString(
      'visitLogId',
      parameters.visitLogId
    )}`,
    method: 'post'
  })
}

/**
 * 获取回访记录页面客户信息
 * @param {String} memberId
 */
export const MEMBERSHIP_API_VISITLOG_GETVISITLOGMEMBERINFO = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { memberId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitLog/GetVisitLogMemberInfo/${getQueryString(
      'memberId',
      parameters.memberId
    )}`,
    method: 'post'
  })
}

/**
 * 查询回访记录
 * @param {Object} parameters -{memberId:'String',trueName:'String',mobile:'String',vipCardNo:'String',resultText:'String',settingOptionTypeId:'String',settingOptionMethodId:'String',timeStart:'String',timeEnd:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_VISITLOG_SEARCH = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitLog/Search/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 新建会员备注
 * @param {Object} parameters -{memberId:'String',aliasName:'String',trueName:'String',settingOptionId:'String',settingOptionName:'String',content:'String'}
 */
export const MEMBERSHIP_API_MEMBERREMARK_CREATEMEMBERREMARK = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/MemberRemark/CreateMemberRemark/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 查询会员备注列表
 * @param {String} memberId
 */
export const MEMBERSHIP_API_MEMBERREMARK_GETMEMBERREMARKLIST = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { memberId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/MemberRemark/GetMemberRemarkList/${getQueryString(
      'memberId',
      parameters.memberId
    )}`,
    method: 'post'
  })
}

/**
 * 删除客户备注
 * @param {String} memberRemarkId
 */
export const MEMBERSHIP_API_MEMBERREMARK_DELETEMEMBERREMARK = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { memberRemarkId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/MemberRemark/DeleteMemberRemark/${getQueryString(
      'memberRemarkId',
      parameters.memberRemarkId
    )}`,
    method: 'post'
  })
}

/**
 * 获取赠送单列表
 * @param {Object} parameters -{settingOptionId:'String',status:'String',giveId:'String',createUserId:'String',createTimeStart:'String',createTimeEnd:'String',couponId:'String',couponName:'String',lastTimeStart:'String',lastTimeEnd:'String',characterId:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_GIVECOUPON_GETGIVECOUPONLIST = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/GiveCoupon/GetGiveCouponList/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 新建赠送单
 * @param {Object} parameters -{couponId:'String',couponName:'String',settingOptionId:'String',settingOptionName:'String',remark:'String'}
 */
export const MEMBERSHIP_API_GIVECOUPON_CREATE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/GiveCoupon/Create/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取赠送单
 * @param {String} giveId
 */
export const MEMBERSHIP_API_GIVECOUPON_GETGIVECOUPON = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { giveId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/GiveCoupon/GetGiveCoupon/${getQueryString(
      'giveId',
      parameters.giveId
    )}`,
    method: 'post'
  })
}

/**
 * 修改赠送单
 * @param {Object} parameters -{giveId:'String',couponId:'String',couponName:'String',settingOptionId:'String',settingOptionName:'String',remark:'String'}
 */
export const MEMBERSHIP_API_GIVECOUPON_UPDATE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/GiveCoupon/Update/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 作废
 * @param {String} giveId
 */
export const MEMBERSHIP_API_GIVECOUPON_INVALID = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { giveId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/GiveCoupon/Invalid/${getQueryString(
      'giveId',
      parameters.giveId
    )}`,
    method: 'post'
  })
}

/**
 * 审核
 * @param {Object} parameters -{giveId:'String',isPass:'String',checkNote:'String'}
 */
export const MEMBERSHIP_API_GIVECOUPON_AUDIT = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/GiveCoupon/Audit/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 提交审核
 * @param {String} giveId
 */
export const MEMBERSHIP_API_GIVECOUPON_SUBMITAUDIT = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { giveId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/GiveCoupon/SubmitAudit/${getQueryString(
      'giveId',
      parameters.giveId
    )}`,
    method: 'post'
  })
}

/**
 * 添加客户
 * @param {Object} parameters -{giveId:'String',members:'String'}
 */
export const MEMBERSHIP_API_GIVECOUPON_ADDMEMBERS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/GiveCoupon/AddMembers/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 从数据挖掘标签导入
 * @param {Object} parameters -{giveId:'String',settingTagGroupId:'Number',exceptEmptyMobile:'String',subscribeType:'String'}
 */
export const MEMBERSHIP_API_GIVECOUPON_ADDMEMBERSFROMTAGGROUP = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/GiveCoupon/AddMembersFromTagGroup/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 数据挖掘按分组赠送优惠券
 * @param {Object} parameters -{settingTagGroupId:'Number',exceptEmptyMobile:'String',couponId:'String',couponName:'String',settingOptionId:'String',settingOptionName:'String',remark:'String'}
 */
export const MEMBERSHIP_API_GIVECOUPON_CREATECOUPONBYTAGGROUP = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/GiveCoupon/CreateCouponByTagGroup/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 删除客户
 * @param {String} itemId
 */
export const MEMBERSHIP_API_GIVECOUPON_DELETE = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { itemId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/GiveCoupon/Delete/${getQueryString(
      'itemId',
      parameters.itemId
    )}`,
    method: 'post'
  })
}

/**
 * 查询赠送客户列表
 * @param {Object} parameters -{giveId:'String',keyword:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_GIVECOUPON_GETGIVEITEMS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/GiveCoupon/GetGiveItems/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取会员标签设置列表
 */
export const MEMBERSHIP_API_SETTINGMEMBERTAG_GETSETTINGMEMBERTAGS = () => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingMemberTag/GetSettingMemberTags/`,
    method: 'post'
  })
}

/**
 * 新增会员标签(如果已经存在相同名称，则不添加)
 * @param {String} name
 */
export const MEMBERSHIP_API_SETTINGMEMBERTAG_CREATE = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { name: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingMemberTag/Create/${getQueryString(
      'name',
      parameters.name
    )}`,
    method: 'post'
  })
}

/**
 * 删除标签
 * @param {String} settingMemberTagId
 */
export const MEMBERSHIP_API_SETTINGMEMBERTAG_DELETE = parameters => {
  parameters =
    typeof parameters === 'object'
      ? parameters
      : { settingMemberTagId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingMemberTag/Delete/${getQueryString(
      'settingMemberTagId',
      parameters.settingMemberTagId
    )}`,
    method: 'post'
  })
}

/**
 * 更新标签
 * @param {Object} parameters -{settingMemberTagId:'String',name:'String'}
 */
export const MEMBERSHIP_API_SETTINGMEMBERTAG_UPDATE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingMemberTag/Update/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 查询积分变更列表
 * @param {String} id
 */
export const MEMBERSHIP_API_SCORERECORD_GETBALANCELIST = parameters => {
  parameters = typeof parameters === 'object' ? parameters : { id: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/ScoreRecord/GetBalanceList/${getQueryString(
      'id',
      parameters.id
    )}`,
    method: 'post'
  })
}

/**
 * 获取赠送积分记录
 * @param {Object} parameters -{characterId:'String',giveTimeStart:'String',giveTimeEnd:'String',expireTimeStart:'String',expireTimeEnd:'String',orderNo:'String',memberId:'String',mobile:'String',memberName:'String',giveAmtMin:'String',giveAmtMax:'String',alreadyUsedAmtMin:'String',alreadyUsedAmtMax:'String',usableAmtMin:'String',usableAmtMax:'String',expireType:'String',scoreType:'String',status:'String',storeName:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_SCORERECORD_GETGIVESCORE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ScoreRecord/GetGiveScore/`,
    method: 'post',
    data: parameters
  })
}

/**
 *
 */
export const MEMBERSHIP_API_STOREPAYMENTBASE_TESTPAY = () => {
  return fetch({
    cloud: 'Membership',
    url: `/api/StorePaymentBase/TestPay/`,
    method: 'get'
  })
}

/**
 * 获取数据挖掘的客户列表
 * @param {Object} parameters -{settingTagGroupId:'String',exceptEmptyMobile:'String',subscribeType:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_DATAANALYSIS_GETANALYSISMEMBERLIST = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/DataAnalysis/GetAnalysisMemberList/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取选择客户的列表
 * @param {Object} parameters -{settingTagGroupId:'String',memberTypeGroup:'String',groupId:'String',levelId:'String',sexyType:'String',memberTagId:'String',exceptEmptyMobile:'String',keyword:'String',subscribeType:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_DATAANALYSIS_GETMEMBERFORSELECTOR = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/DataAnalysis/GetMemberForSelector/`,
    method: 'post',
    data: parameters
  })
}

/**
 *
 * @param {Object} parameters -}
 */
export const MEMBERSHIP_API_SCRIPTBUILDER_GENERATEALL = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { type: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/ScriptBuilder/GenerateAll/${getQueryString(
      'type',
      parameters.type
    )}`,
    method: 'get'
  })
}

/**
 *
 */
export const MEMBERSHIP_API_SCRIPTBUILDER_GENERATEALLENUM = () => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ScriptBuilder/GenerateAllEnum/`,
    method: 'get'
  })
}

/**
 *
 * @param {Object} parameters -}
 */
export const MEMBERSHIP_API_REPORT_MEMBERSUMMARY = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { characterId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/Report/MemberSummary/${getQueryString(
      'characterId',
      parameters.characterId
    )}`,
    method: 'post'
  })
}

/**
 *
 * @param {Object} parameters -}
 */
export const MEMBERSHIP_API_REPORT_TODAYINCREASE = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { characterId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/Report/TodayIncrease/${getQueryString(
      'characterId',
      parameters.characterId
    )}`,
    method: 'post'
  })
}

/**
 *
 * @param {Object} parameters -}
 */
export const MEMBERSHIP_API_REPORT_GROWINGTENDENCY = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { characterId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/Report/GrowingTendency/${getQueryString(
      'characterId',
      parameters.characterId
    )}`,
    method: 'post'
  })
}

/**
 * 粉丝统计
 * @param {Object} parameters -{memberType:'String',characterId:'String',startTime:'String',endTime:'String'}
 */
export const MEMBERSHIP_API_REPORT_FANSSTATISTICS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Report/FansStatistics/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 会员统计
 * @param {Object} parameters -{memberType:'String',characterId:'String',startTime:'String',endTime:'String'}
 */
export const MEMBERSHIP_API_REPORT_MEMBERSTATISTICS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Report/MemberStatistics/`,
    method: 'post',
    data: parameters
  })
}

/**
 *
 * @param {Object} parameters -}
 */
export const MEMBERSHIP_API_REPORT_GETMEMBERSUBSCRFROMCHART = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { characterId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/Report/GetMemberSubscrFromChart/${getQueryString(
      'characterId',
      parameters.characterId
    )}`,
    method: 'post'
  })
}

/**
 *
 * @param {Object} parameters -}
 */
export const MEMBERSHIP_API_REPORT_GETMEMBERTYPECHART = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { characterId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/Report/GetMemberTypeChart/${getQueryString(
      'characterId',
      parameters.characterId
    )}`,
    method: 'post'
  })
}

/**
 *
 * @param {Object} parameters -}
 */
export const MEMBERSHIP_API_REPORT_GETMEMBERGROUPCHART = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { characterId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/Report/GetMemberGroupChart/${getQueryString(
      'characterId',
      parameters.characterId
    )}`,
    method: 'post'
  })
}

/**
 *
 * @param {Object} parameters -}
 */
export const MEMBERSHIP_API_REPORT_GETMEMBERLEVELCHART = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { characterId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/Report/GetMemberLevelChart/${getQueryString(
      'characterId',
      parameters.characterId
    )}`,
    method: 'post'
  })
}

/**
 * 会员年龄统计
 * @param {Object} parameters -{memberType:'String',characterId:'String',startTime:'String',endTime:'String'}
 */
export const MEMBERSHIP_API_REPORT_GETMEMBERAGECHART = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Report/GetMemberAgeChart/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 客户性别统计
 * @param {Object} parameters -{memberType:'String',characterId:'String',startTime:'String',endTime:'String'}
 */
export const MEMBERSHIP_API_REPORT_GETMEMBERSEXYCHART = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Report/GetMemberSexyChart/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 客户地区(城市)统计
 * @param {Object} parameters -{memberType:'String',characterId:'String',startTime:'String',endTime:'String'}
 */
export const MEMBERSHIP_API_REPORT_GETMEMBERCITYCHART = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Report/GetMemberCityChart/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 客户综合评分统计
 * @param {Object} parameters -{memberType:'String',characterId:'String',startTime:'String',endTime:'String'}
 */
export const MEMBERSHIP_API_REPORT_GETMEMBERSCORECHART = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Report/GetMemberScoreChart/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 客户消费力统计
 * @param {Object} parameters -{characterId:'String',expendDateType:'Number',expendPriceType:'Number'}
 */
export const MEMBERSHIP_API_REPORT_GETMEMBEREXPENDCHART = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Report/GetMemberExpendChart/`,
    method: 'post',
    data: parameters
  })
}

/**
 *
 * @param {Object} parameters -}
 */
export const MEMBERSHIP_API_REPORT_GETMEMBERTAGCHART = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { characterId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/Report/GetMemberTagChart/${getQueryString(
      'characterId',
      parameters.characterId
    )}`,
    method: 'post'
  })
}

/**
 * 客户婚姻状态分析
 * @param {Object} parameters -{memberType:'String',characterId:'String',startTime:'String',endTime:'String'}
 */
export const MEMBERSHIP_API_REPORT_GETMARRIAGECHART = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Report/GetMarriageChart/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 查询
 * @param {Object} parameters -{visitBookId:'String',subject:'String',createUserId:'String',status:'String',settingOptionId:'String',createTimeStart:'String',createTimeEnd:'String',lastTimeStart:'String',lastTimeEnd:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_VISITBOOK_SEARCH = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitBook/Search/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 创建
 * @param {Object} parameters -{visitBookId:'Number',subject:'String',settingOptionId:'String',settingOptionName:'String',content:'String'}
 */
export const MEMBERSHIP_API_VISITBOOK_CREATE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitBook/Create/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取修改界面内容
 * @param {String} visitBookId
 */
export const MEMBERSHIP_API_VISITBOOK_GETCURRENTBOOK = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { visitBookId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitBook/GetCurrentBook/${getQueryString(
      'visitBookId',
      parameters.visitBookId
    )}`,
    method: 'post'
  })
}

/**
 * 修改
 * @param {Object} parameters -{visitBookId:'Number',subject:'String',settingOptionId:'String',settingOptionName:'String',content:'String'}
 */
export const MEMBERSHIP_API_VISITBOOK_UPDATE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitBook/Update/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 停用/启用
 * @param {String} visitBookId
 * @param {String} enable
 */
export const MEMBERSHIP_API_VISITBOOK_SETENABLE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitBook/SetEnable/${getQueryString(
      'visitBookId',
      parameters.visitBookId,
      'enable',
      parameters.enable
    )}`,
    method: 'post'
  })
}

/**
 * 删除
 * @param {String} visitBookId
 */
export const MEMBERSHIP_API_VISITBOOK_DELETE = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { visitBookId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitBook/Delete/${getQueryString(
      'visitBookId',
      parameters.visitBookId
    )}`,
    method: 'post'
  })
}

/**
 * 编辑回访记录页面查询话术列表
 * @param {Object} parameters -{settingOptionId:'String',keyword:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_VISITBOOK_SEARCHFORVISITLOG = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitBook/SearchForVisitLog/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 查询回访任务执行任务列表
 * @param {Object} parameters -{taskName:'String',userId:'String',finishStatus:'String',settingOptionId:'String',createTimeStart:'String',createTimeEnd:'String',lastTimeStart:'String',lastTimeEnd:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_VISITTASKEXCUTION_SEARCHTASKLIST = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTaskExcution/SearchTaskList/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 查询回访人完成进度
 * @param {Object} parameters -{visitTaskId:'String',excutorId:'String'}
 */
export const MEMBERSHIP_API_VISITTASKEXCUTION_SEARCHMEMBERFINISHRATE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTaskExcution/SearchMemberFinishRate/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 查询回访任务执行客户列表
 * @param {Object} parameters -{visitTaskId:'String',excutorId:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_VISITTASKEXCUTION_SEARCHMEMBERLIST = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTaskExcution/SearchMemberList/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 结束回访
 * @param {String} visitMemberId
 */
export const MEMBERSHIP_API_VISITTASKEXCUTION_FINISH = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { visitMemberId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTaskExcution/Finish/${getQueryString(
      'visitMemberId',
      parameters.visitMemberId
    )}`,
    method: 'post'
  })
}

/**
 * 批量结束回访
 * @param {Object} parameters -{visitMemberIdList:'String'}
 */
export const MEMBERSHIP_API_VISITTASKEXCUTION_BATCHFINISH = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/VisitTaskExcution/BatchFinish/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取会员消费记录
 * @param {String} memberId
 */
export const MEMBERSHIP_API_MARKETING_GETMEMBEREXPENDLIST = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { memberId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/Marketing/GetMemberExpendList/${getQueryString(
      'memberId',
      parameters.memberId
    )}`,
    method: 'post'
  })
}

/**
 * 获取会员退货记录
 * @param {String} memberId
 */
export const MEMBERSHIP_API_MARKETING_GETMEMBERRETURNLIST = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { memberId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/Marketing/GetMemberReturnList/${getQueryString(
      'memberId',
      parameters.memberId
    )}`,
    method: 'post'
  })
}

/**
 * 获取会员卡券列表
 * @param {String} memberId
 */
export const MEMBERSHIP_API_MARKETING_GETMEMBERWALLETCOUPONLIST = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { memberId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/Marketing/GetMemberWalletCouponList/${getQueryString(
      'memberId',
      parameters.memberId
    )}`,
    method: 'post'
  })
}

/**
 *
 */
export const MEMBERSHIP_API_UPLOADER_UPLOADTOTEMPASYNC = () => {
  return fetch({
    cloud: 'Membership',
    url: `/api/Uploader/UploadToTempAsync/`,
    method: 'post'
  })
}

/**
 *
 * @param {String} pathType
 */
export const MEMBERSHIP_API_UPLOADER_UPLOADIMAGEASYNC = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { pathType: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/Uploader/UploadImageAsync/${getQueryString(
      'pathType',
      parameters.pathType
    )}`,
    method: 'post'
  })
}

/**
 *
 * @param {String} pathType
 */
export const MEMBERSHIP_API_UPLOADER_UPLOADFILEASYNC = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { pathType: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/Uploader/UploadFileAsync/${getQueryString(
      'pathType',
      parameters.pathType
    )}`,
    method: 'post'
  })
}

/**
 * 获取手工单明细(用于编辑手工单内搜索)
 * @param {Object} parameters -{giveId:'String',key:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_MANUALORDER_GETITEM = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ManualOrder/GetItem/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取手工单列表
 * @param {Object} parameters -{characterId:'String',storeName:'String',giveId:'String',createUserId:'String',createTimeStart:'String',createTimeEnd:'String',lastTimeStart:'String',lastTimeEnd:'String',status:'String',settingOptionId:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_MANUALORDER_GETLIST = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ManualOrder/GetList/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取手工单信息(用于审核/加载单据头信息)
 * @param {String} id
 */
export const MEMBERSHIP_API_MANUALORDER_GETINFO = parameters => {
  parameters = typeof parameters === 'object' ? parameters : { id: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/ManualOrder/GetInfo/${getQueryString('id', parameters.id)}`,
    method: 'post'
  })
}

/**
 * 创建手工单
 * @param {Object} parameters -{settingOptionId:'String',settingOptionName:'String',remark:'String'}
 */
export const MEMBERSHIP_API_MANUALORDER_CREATE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ManualOrder/Create/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 添加手工单明细
 * @param {Object} parameters -{giveId:'String',items:'String'}
 */
export const MEMBERSHIP_API_MANUALORDER_CREATEITEM = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ManualOrder/CreateItem/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 单个/批量导入会员信息到手工单详情列表
 * @param {Object} parameters -{giveId:'String',childs:'String'}
 */
export const MEMBERSHIP_API_MANUALORDER_BATCHIMPORTMEMBER = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ManualOrder/BatchImportMember/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 单个/批量导入数据挖掘到手工单详情列表
 * @param {Object} parameters -{giveId:'String',groupIds:'String',exceptEmptyMobile:'String',subscribeType:'String'}
 */
export const MEMBERSHIP_API_MANUALORDER_BATCHANALYSIS = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ManualOrder/BatchAnalysis/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 更新手工单信息
 * @param {Object} parameters -{giveId:'String',settingOptionId:'String',settingOptionName:'String',remark:'String'}
 */
export const MEMBERSHIP_API_MANUALORDER_UPDATE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ManualOrder/Update/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 单个/批量更新手工单明细
 * @param {Object} parameters -{giveId:'String',items:'String'}
 */
export const MEMBERSHIP_API_MANUALORDER_UPDATEITEM = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ManualOrder/UpdateItem/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 保存提交手工单
 * @param {String} id
 */
export const MEMBERSHIP_API_MANUALORDER_COMMIT = parameters => {
  parameters = typeof parameters === 'object' ? parameters : { id: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/ManualOrder/Commit/${getQueryString('id', parameters.id)}`,
    method: 'post'
  })
}

/**
 * 批量设置积分/礼金(根据单据id)
 * @param {Object} parameters -{giveId:'String',score:'String',days:'String',scoreType:'Number'}
 */
export const MEMBERSHIP_API_MANUALORDER_BATCHUPDATEBYORDERID = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ManualOrder/BatchUpdateByOrderId/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 保存手工单状态(用于审核/审核退回/作废/)
 * @param {Object} parameters -{orderIdCodeList:'String',status:'Number',checkNote:'String'}
 */
export const MEMBERSHIP_API_MANUALORDER_SAVEAUDIT = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ManualOrder/SaveAudit/`,
    method: 'post',
    data: parameters
  })
}

/**
 *
 * @param {Object} parameters -{capacity:'Number',item:'String'}
 */
export const MEMBERSHIP_API_MANUALORDER_CANCELAUDIT = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ManualOrder/CancelAudit/`,
    method: 'post',
    data: parameters
  })
}

/**
 *
 * @param {Object} parameters -{capacity:'Number',item:'String'}
 */
export const MEMBERSHIP_API_MANUALORDER_DELETE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ManualOrder/Delete/`,
    method: 'post',
    data: parameters
  })
}

/**
 *
 * @param {Object} parameters -{capacity:'Number',item:'String'}
 */
export const MEMBERSHIP_API_MANUALORDER_DELETEITEM = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/ManualOrder/DeleteItem/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取所有自定义标签类型
 */
export const MEMBERSHIP_API_SETTINGTAG_GETCUSTOMTAGTYPES = () => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingTag/GetCustomTagTypes/`,
    method: 'post'
  })
}

/**
 * 根据标签类型(自定义)获取标签设置列表
 * @param {String} settingTagType
 */
export const MEMBERSHIP_API_SETTINGTAG_GETCUSTOMSETTINGTAGSBYTAGTYPE = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { settingTagType: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingTag/GetCustomSettingTagsByTagType/${getQueryString(
      'settingTagType',
      parameters.settingTagType
    )}`,
    method: 'post'
  })
}

/**
 * 保存标签（添加或修改）
 * @param {Object} parameters -{settingTagId:'String',tagType:'Number',name:'String',minValue:'String',maxValue:'String'}
 */
export const MEMBERSHIP_API_SETTINGTAG_CREATEORUPDATE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingTag/CreateOrUpdate/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 删除标签
 * @param {String} settingTagId
 */
export const MEMBERSHIP_API_SETTINGTAG_DELETE = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { settingTagId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingTag/Delete/${getQueryString(
      'settingTagId',
      parameters.settingTagId
    )}`,
    method: 'post'
  })
}

/**
 * 获取所有标签类型及标签设置(仅包括数据挖掘的设置)
 */
export const MEMBERSHIP_API_SETTINGTAG_GETALLTAGTYPEWITHSETTINGTAG = () => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingTag/GetAllTagTypeWithSettingTag/`,
    method: 'post'
  })
}

/**
 * 获取门店所有数据分组
 */
export const MEMBERSHIP_API_SETTINGTAGGROUP_GETALL = () => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingTagGroup/GetAll/`,
    method: 'post'
  })
}

/**
 * 获取门店所有分组(包含标签)
 */
export const MEMBERSHIP_API_SETTINGTAGGROUP_GETALLWITHTAGS = () => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingTagGroup/GetAllWithTags/`,
    method: 'post'
  })
}

/**
 * 新增数据分组
 * @param {Object} parameters -{name:'String',settingTagGroupItems:'String'}
 */
export const MEMBERSHIP_API_SETTINGTAGGROUP_CREATE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingTagGroup/Create/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 删除分组
 * @param {String} settingTagGroupId
 */
export const MEMBERSHIP_API_SETTINGTAGGROUP_DELETE = parameters => {
  parameters =
    typeof parameters === 'object'
      ? parameters
      : { settingTagGroupId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingTagGroup/Delete/${getQueryString(
      'settingTagGroupId',
      parameters.settingTagGroupId
    )}`,
    method: 'post'
  })
}

/**
 * 更新数据分组
 * @param {Object} parameters -{settingTagGroupId:'Number',name:'String',settingTagGroupItems:'String'}
 */
export const MEMBERSHIP_API_SETTINGTAGGROUP_UPDATE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingTagGroup/Update/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取数据分组明细
 * @param {String} settingTagGroupId
 */
export const MEMBERSHIP_API_SETTINGTAGGROUP_GETGROUPITEMSBYGROUPID = parameters => {
  parameters =
    typeof parameters === 'object'
      ? parameters
      : { settingTagGroupId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingTagGroup/GetGroupItemsByGroupId/${getQueryString(
      'settingTagGroupId',
      parameters.settingTagGroupId
    )}`,
    method: 'post'
  })
}

/**
 * 新建短信任务
 * @param {Object} parameters -{templateId:'String',templateType:'String',templateName:'String',templateContent:'String',signature:'String',sendType:'String',sendTime:'String',remark:'String'}
 */
export const MEMBERSHIP_API_MESSAGETASK_CREATE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/MessageTask/Create/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 新建短信任务(通过数据挖掘)
 * @param {Object} parameters -{settingTagGroupId:'Number',exceptEmptyMobile:'String',templateId:'String',templateType:'String',templateName:'String',templateContent:'String',signature:'String',sendType:'String',sendTime:'String',remark:'String'}
 */
export const MEMBERSHIP_API_MESSAGETASK_CREATEWITHDATAGROUP = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/MessageTask/CreateWithDataGroup/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取短信任务
 * @param {String} messageTaskId
 */
export const MEMBERSHIP_API_MESSAGETASK_GETMESSAGETASK = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { messageTaskId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/MessageTask/GetMessageTask/${getQueryString(
      'messageTaskId',
      parameters.messageTaskId
    )}`,
    method: 'post'
  })
}

/**
 * 修改短信任务
 * @param {Object} parameters -{messageTaskId:'Number',templateId:'Number',templateType:'Number',templateName:'String',templateContent:'String',signature:'String',sendType:'Number',sendTime:'String',remark:'String'}
 */
export const MEMBERSHIP_API_MESSAGETASK_UPDATE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/MessageTask/Update/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取短信任务列表
 * @param {Object} parameters -{sendType:'String',finishStatus:'String',status:'String',templateId:'String',createTimeStart:'String',createTimeEnd:'String',sendTimeStart:'String',sendTimeEnd:'String',orderField:'String',orderType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MEMBERSHIP_API_MESSAGETASK_GETMESSAGETASKLIST = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/MessageTask/GetMessageTaskList/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 作废
 * @param {String} messageTaskId
 */
export const MEMBERSHIP_API_MESSAGETASK_INVALID = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { messageTaskId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/MessageTask/Invalid/${getQueryString(
      'messageTaskId',
      parameters.messageTaskId
    )}`,
    method: 'post'
  })
}

/**
 * 审核
 * @param {Object} parameters -{messageTaskId:'Number',isPass:'String',checkNote:'String'}
 */
export const MEMBERSHIP_API_MESSAGETASK_AUDIT = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/MessageTask/Audit/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 提交审核
 * @param {String} messageTaskId
 */
export const MEMBERSHIP_API_MESSAGETASK_SUBMITAUDIT = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { messageTaskId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/MessageTask/SubmitAudit/${getQueryString(
      'messageTaskId',
      parameters.messageTaskId
    )}`,
    method: 'post'
  })
}

/**
 * 获取模板下拉列表
 * @param {Object} parameters -{templateType:'String'}
 */
export const MEMBERSHIP_API_MESSAGETASK_GETTEMPLATELIST = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/MessageTask/GetTemplateList/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取所有地区数据
 */
export const MEMBERSHIP_API_SETTINGAREA_GETAREAS = () => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingArea/GetAreas/`,
    method: 'post'
  })
}

/**
 * 获取可升级的会员(升级目标)列表
 * @param {String} memberId
 */
export const MEMBERSHIP_API_MEMBERUPGRADE_GETUPGRADEMEMBERS = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { memberId: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/MemberUpgrade/GetUpgradeMembers/${getQueryString(
      'memberId',
      parameters.memberId
    )}`,
    method: 'post'
  })
}

/**
 * 升级会员
 * @param {Object} parameters -{memberId:'String',toMemberId:'String'}
 */
export const MEMBERSHIP_API_MEMBERUPGRADE_UPGRADE = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/MemberUpgrade/Upgrade/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 查询赠送规则开关
 * @param {String} type
 */
export const MEMBERSHIP_API_SETTINGGLOBAL_SEARCH = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { type: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingGlobal/Search/${getQueryString('type', parameters.type)}`,
    method: 'post'
  })
}

/**
 * 启用配置
 * @param {String} type
 */
export const MEMBERSHIP_API_SETTINGGLOBAL_ENABLED = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { type: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingGlobal/Enabled/${getQueryString(
      'type',
      parameters.type
    )}`,
    method: 'post'
  })
}

/**
 * 禁用配置
 * @param {String} type
 */
export const MEMBERSHIP_API_SETTINGGLOBAL_DISABLE = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { type: parameters }
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingGlobal/Disable/${getQueryString(
      'type',
      parameters.type
    )}`,
    method: 'post'
  })
}

/**
 * 设置活动时间开关
 * @param {Object} parameters -{powerString:'String'}
 */
export const MEMBERSHIP_API_SETTINGGLOBAL_SETACTIVITYPOWER = parameters => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingGlobal/SetActivityPower/`,
    method: 'post',
    data: parameters
  })
}

/**
 * 获取活动开关信息（null/IsOpen=0=>关，not IsOpen=1=>开）
 */
export const MEMBERSHIP_API_SETTINGGLOBAL_GETACTIVITYPOWER = () => {
  return fetch({
    cloud: 'Membership',
    url: `/api/SettingGlobal/GetActivityPower/`,
    method: 'post'
  })
}

/**
 * 公司首页
 */
export const MEMBERSHIP_API_REPORT_GETMEMBERSTATISTICSFORHOME = () => {
  return fetch({ 
      cloud: 'Membership',
      url: `/api/Report/GetMemberStatisticsForHome/`,
      method: 'post'
  })
}
