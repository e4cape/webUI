import fetch from '@/utilities/fetch';

const getQueryString = (...args) => {
  var paras = [];
  for (var i = 0; i < args.length; i = i + 2) {
    var val = args[i + 1];
    if (val !== '') {
      paras.push(args[i] + '=' + encodeURIComponent(val));
    }
  }
  if (paras.length) {
    return '?' + paras.join('&');
  }
  return '';
};
/**
 *
 * @param {Object} parameters -}
 */
export const MESSAGE_API_SCRIPTBUILDER_GENERATEALL = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { type: parameters };
  return fetch({
    cloud: 'Message',
    url: `/api/ScriptBuilder/GenerateAll/${getQueryString(
      'type',
      parameters.type
    )}`,
    method: 'get'
  });
};

/**
 *
 */
export const MESSAGE_API_SCRIPTBUILDER_GENERATEALLENUM = () => {
  return fetch({
    cloud: 'Message',
    url: `/api/ScriptBuilder/GenerateAllEnum/`,
    method: 'get'
  });
};

/**
 * 门店首页统计所有
 */
export const MESSAGE_API_STOREBALANCE_GETSTOREACCOUNTSUMMARY = () => {
  return fetch({
    cloud: 'Message',
    url: `/api/StoreBalance/GetStoreAccountSummary/`,
    method: 'post'
  });
};

/**
 * 获取充值单价、最低购买数
 */
export const MESSAGE_API_SETTINGGLOBAL_GETSTORERECHARGESETTING = () => {
  return fetch({
    cloud: 'Message',
    url: `/api/SettingGlobal/GetStoreRechargeSetting/`,
    method: 'post'
  });
};

/**
 * 删除记录
 * @param {String} id
 */
export const MESSAGE_API_PLATFORMRECHARGE_DELETERECHARGE = parameters => {
  parameters = typeof parameters === 'object' ? parameters : { id: parameters };
  return fetch({
    cloud: 'Message',
    url: `/api/PlatformRecharge/DeleteRecharge/${getQueryString(
      'id',
      parameters.id
    )}`,
    method: 'post'
  });
};

/**
 * 获取平台充值统计
 * @param {Object} parameters -{orderNo:'String',startTime:'String',endTime:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MESSAGE_API_PLATFORMRECHARGE_GETSUMMARY = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/PlatformRecharge/GetSummary/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 保存上传的充值数据
 * @param {String} fileName
 */
export const MESSAGE_API_PLATFORMRECHARGE_SAVEUPLOADRECHARGE = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { fileName: parameters };
  return fetch({
    cloud: 'Message',
    url: `/api/PlatformRecharge/SaveUploadRecharge/${getQueryString(
      'fileName',
      parameters.fileName
    )}`,
    method: 'post'
  });
};

/**
 * 获取平台充值列表
 * @param {Object} parameters -{orderNo:'String',startTime:'String',endTime:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MESSAGE_API_PLATFORMRECHARGE_SEARCHLIST = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/PlatformRecharge/SearchList/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 门店首页按月统计
 * @param {Object} parameters -{templateType:'String',year:'Number',month:'Number'}
 */
export const MESSAGE_API_SUMMARY_GETMONTHLYSUMMARY = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/Summary/GetMonthlySummary/`,
    method: 'post',
    data: parameters
  });
};

/**
 *
 * @param {Object} parameters -}
 */
export const MESSAGE_API_SUMMARY_GETTODAYSUMMARY = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { templateType: parameters };
  return fetch({
    cloud: 'Message',
    url: `/api/Summary/GetTodaySummary/${getQueryString(
      'templateType',
      parameters.templateType
    )}`,
    method: 'post'
  });
};

/**
 *
 * @param {Object} parameters -}
 */
export const MESSAGE_API_SUMMARY_GETTOTALSUMMARY = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { templateType: parameters };
  return fetch({
    cloud: 'Message',
    url: `/api/Summary/GetTotalSummary/${getQueryString(
      'templateType',
      parameters.templateType
    )}`,
    method: 'post'
  });
};

/**
 * 获取变量值
 * @param {String} name
 * @param {String} p
 */
export const MESSAGE_API_VARIABLE_GETVALUE = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/Variable/GetValue/${getQueryString(
      'name',
      parameters.name,
      'p',
      parameters.p
    )}`,
    method: 'post'
  });
};

/**
 * 获取变量列表
 */
export const MESSAGE_API_VARIABLE_GETVARIABLES = () => {
  return fetch({
    cloud: 'Message',
    url: `/api/Variable/GetVariables/`,
    method: 'post'
  });
};

/**
 * 创建短信签名任务
 * @param {Object} parameters -{templateType:'String',signature:'String'}
 */
export const MESSAGE_API_SIGNATURE_CREATE = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/Signature/Create/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 删除签名
 * @param {String} signatureId
 */
export const MESSAGE_API_SIGNATURE_DELETE = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { signatureId: parameters };
  return fetch({
    cloud: 'Message',
    url: `/api/Signature/Delete/${getQueryString(
      'signatureId',
      parameters.signatureId
    )}`,
    method: 'post'
  });
};

/**
 *
 * @param {Object} parameters -}
 */
export const MESSAGE_API_SIGNATURE_GETSIGNATUREOPTIONLIST = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { templateType: parameters };
  return fetch({
    cloud: 'Message',
    url: `/api/Signature/GetSignatureOptionList/${getQueryString(
      'templateType',
      parameters.templateType
    )}`,
    method: 'post'
  });
};

/**
 * 查询短信签名列表
 * @param {Object} parameters -{signatureId:'String',signature:'String',startTime:'String',endTime:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MESSAGE_API_SIGNATURE_SEARCH = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/Signature/Search/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 获取门店充值详情
 * @param {Object} parameters -{characterId:'Number',startTime:'String',endTime:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MESSAGE_API_ORDERRECHARGE_GETSTORERECHARGEDETAILS = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/OrderRecharge/GetStoreRechargeDetails/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 获取门店充值统计
 * @param {Object} parameters -{characterType:'Number',storeAdministratorId:'String',storeName:'String',startTime:'String',endTime:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MESSAGE_API_ORDERRECHARGE_GETSUMMARY = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/OrderRecharge/GetSummary/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 查看订单
 * @param {String} orderId
 */
export const MESSAGE_API_ORDERRECHARGE_QUERYORDER = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { orderId: parameters };
  return fetch({
    cloud: 'Message',
    url: `/api/OrderRecharge/QueryOrder/${getQueryString(
      'orderId',
      parameters.orderId
    )}`,
    method: 'post'
  });
};

/**
 * 提交充值
 * @param {Object} parameters -{count:'String'}
 */
export const MESSAGE_API_ORDERRECHARGE_RECHARGE = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/OrderRecharge/Recharge/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 查询充值单列表
 * @param {Object} parameters -{orderId:'String',storeAdministratorId:'String',storeName:'String',status:'String',startTime:'String',endTime:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MESSAGE_API_ORDERRECHARGE_SEARCHLIST = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/OrderRecharge/SearchList/`,
    method: 'post',
    data: parameters
  });
};

/**
 *
 * @param {Object} parameters -{apiKey:'String',exportFields:'String',exportType:'Number',records:'String',apiParameter:'String'}
 */
export const MESSAGE_API_STOREEXPORTER_EXPORTTOFILE = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/StoreExporter/ExportToFile/`,
    method: 'post',
    data: parameters
  });
};

/**
 *
 * @param {Object} parameters -{apiKey:'String'}
 */
export const MESSAGE_API_STOREEXPORTER_GETEXPORTFIELDS = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/StoreExporter/GetExportFields/`,
    method: 'post',
    data: parameters
  });
};

/**
 *
 */
export const MESSAGE_API_MERCHANTSERVICE_GETALLSTORES = () => {
  return fetch({
    cloud: 'Message',
    url: `/api/MerchantService/GetAllStores/`,
    method: 'post'
  });
};

/**
 *
 */
export const MESSAGE_API_MERCHANTSERVICE_GETALLSUPPLIERS = () => {
  return fetch({
    cloud: 'Message',
    url: `/api/MerchantService/GetAllSuppliers/`,
    method: 'post'
  });
};

/**
 * 获取短信账户设置
 */
export const MESSAGE_API_SETTINGCHANNEL_GETSETTINGCHANNELS = () => {
  return fetch({
    cloud: 'Message',
    url: `/api/SettingChannel/GetSettingChannels/`,
    method: 'post'
  });
};

/**
 * 保存预警设置
 * @param {Object} parameters -{channelId:'Number',warnCount:'String',warnMobile:'String'}
 */
export const MESSAGE_API_SETTINGCHANNEL_SAVEWARN = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/SettingChannel/SaveWarn/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 获取门店列表
 * @param {Object} parameters -{storeName:'String'}
 */
export const MESSAGE_API_STORE_GETSTORELIST = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/Store/GetStoreList/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 获取会员列表
 * @param {Object} parameters -{mobile:'String',name:'String',sexType:'String',month1:'String',day1:'String',month2:'String',day2:'String',province:'String',city:'String',district:'String'}
 */
export const MESSAGE_API_MEMBER_SEARCH = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/Member/Search/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 新增模板
 * @param {Object} parameters -{characterType:'String',templateType:'String',templateName:'String',templateContent:'String',signature:'String',ispId:'String',storeName:'String',characterId:'String'}
 */
export const MESSAGE_API_SETTINGTEMPLATE_CREATETEMPLATE = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/SettingTemplate/CreateTemplate/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 删除短信模板
 * @param {String} id
 */
export const MESSAGE_API_SETTINGTEMPLATE_DELETE = parameters => {
  parameters = typeof parameters === 'object' ? parameters : { id: parameters };
  return fetch({
    cloud: 'Message',
    url: `/api/SettingTemplate/Delete/${getQueryString('id', parameters.id)}`,
    method: 'post'
  });
};

/**
 * 获取模板下拉列表
 * @param {Object} parameters -{templateType:'String'}
 */
export const MESSAGE_API_SETTINGTEMPLATE_GETTEMPLATELIST = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/SettingTemplate/GetTemplateList/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 保存上传的模板数据
 * @param {String} fileName
 */
export const MESSAGE_API_SETTINGTEMPLATE_SAVEUPLOADTEMPLATE = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { fileName: parameters };
  return fetch({
    cloud: 'Message',
    url: `/api/SettingTemplate/SaveUploadTemplate/${getQueryString(
      'fileName',
      parameters.fileName
    )}`,
    method: 'post'
  });
};

/**
 * 查询平台用模板列表
 * @param {Object} parameters -{templateId:'String',templateName:'String',storeName:'String',companyName:'String',templateType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MESSAGE_API_SETTINGTEMPLATE_SEARCHPLATFORMTEMPLATES = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/SettingTemplate/SearchPlatformTemplates/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 查询公司用模板列表
 * @param {Object} parameters -{templateId:'String',templateName:'String',storeName:'String',companyName:'String',templateType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MESSAGE_API_SETTINGTEMPLATE_SEARCHCOMPANYTEMPLATES = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/SettingTemplate/SearchCompanyTemplates/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 查询门店用模板列表
 * @param {Object} parameters -{templateId:'String',templateName:'String',storeName:'String',companyName:'String',templateType:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MESSAGE_API_SETTINGTEMPLATE_SEARCHSTORETEMPLATES = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/SettingTemplate/SearchStoreTemplates/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 更新模板的自动发送设置状态
 * @param {Object} parameters -{templateName:'String',status:'Number'}
 */
export const MESSAGE_API_SETTINGTEMPLATE_UPDATEAUTOSENDSTATUS = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/SettingTemplate/UpdateAutoSendStatus/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 删除会员信息
 * @param {String} membershipId
 */
export const MESSAGE_API_MEMBERSHIP_DELETEMEMBERSHIP = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { membershipId: parameters };
  return fetch({
    cloud: 'Message',
    url: `/api/Membership/DeleteMembership/${getQueryString(
      'membershipId',
      parameters.membershipId
    )}`,
    method: 'post'
  });
};

/**
 * 获取客户详情
 * @param {String} membershipId
 */
export const MESSAGE_API_MEMBERSHIP_GETMEMBERSHIPDETAIL = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { membershipId: parameters };
  return fetch({
    cloud: 'Message',
    url: `/api/Membership/GetMembershipDetail/${getQueryString(
      'membershipId',
      parameters.membershipId
    )}`,
    method: 'post'
  });
};

/**
 * 获取上传老会员的处理结果
 */
export const MESSAGE_API_MEMBERSHIP_GETUPLOADRESULT = () => {
  return fetch({
    cloud: 'Message',
    url: `/api/Membership/GetUploadResult/`,
    method: 'post'
  });
};

/**
 * 保存上传的会员数据
 * @param {String} fileName
 */
export const MESSAGE_API_MEMBERSHIP_SAVEUPLOADMEMBERSHIP = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { fileName: parameters };
  return fetch({
    cloud: 'Message',
    url: `/api/Membership/SaveUploadMembership/${getQueryString(
      'fileName',
      parameters.fileName
    )}`,
    method: 'post'
  });
};

/**
 * 查询老会员列表
 * @param {Object} parameters -{name:'String',sexType:'String',mobile:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MESSAGE_API_MEMBERSHIP_SEARCH = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/Membership/Search/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 修改会员信息
 * @param {Object} parameters -{membershipId:'Number',mobile:'String',name:'String',sexType:'String',birthday:'String',address:'String',goods1:'String',catagory1:'String',buyDate1:'String',goods2:'String',catagory2:'String',buyDate2:'String'}
 */
export const MESSAGE_API_MEMBERSHIP_UPDATEMEMBERSHIP = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/Membership/UpdateMembership/`,
    method: 'post',
    data: parameters
  });
};

/**
 *
 */
export const MESSAGE_API_UPLOADER_UPLOADTOTEMPASYNC = () => {
  return fetch({
    cloud: 'Message',
    url: `/api/Uploader/UploadToTempAsync/`,
    method: 'post'
  });
};

/**
 *
 * @param {String} pathType
 */
export const MESSAGE_API_UPLOADER_UPLOADIMAGEASYNC = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { pathType: parameters };
  return fetch({
    cloud: 'Message',
    url: `/api/Uploader/UploadImageAsync/${getQueryString(
      'pathType',
      parameters.pathType
    )}`,
    method: 'post'
  });
};

/**
 *
 * @param {String} pathType
 */
export const MESSAGE_API_UPLOADER_UPLOADFILEASYNC = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { pathType: parameters };
  return fetch({
    cloud: 'Message',
    url: `/api/Uploader/UploadFileAsync/${getQueryString(
      'pathType',
      parameters.pathType
    )}`,
    method: 'post'
  });
};

/**
 * 审核短信任务
 * @param {Object} parameters -{taskId:'Number',auditStatus:'Number',auditComment:'String'}
 */
export const MESSAGE_API_MESSAGETASK_AUDIT = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/MessageTask/Audit/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 创建短信任务
 * @param {Object} parameters -{sendGroupType:'Number',templateId:'Number',templateName:'String',templateContent:'String',templateType:'Number',sendType:'Number',sendTime:'String',signature:'String',excelFilePath:'String',taskItems:'String'}
 */
export const MESSAGE_API_MESSAGETASK_CREATE = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/MessageTask/Create/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 获取发送对象列表
 * @param {Object} parameters -{taskId:'Number',pageIndex:'Number',pageSize:'Number'}
 */
export const MESSAGE_API_MESSAGETASK_GETTARGETLIST = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/MessageTask/GetTargetList/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 获取任务详情
 * @param {String} taskId
 */
export const MESSAGE_API_MESSAGETASK_GETTASKDETAIL = parameters => {
  parameters =
    typeof parameters === 'object' ? parameters : { taskId: parameters };
  return fetch({
    cloud: 'Message',
    url: `/api/MessageTask/GetTaskDetail/${getQueryString(
      'taskId',
      parameters.taskId
    )}`,
    method: 'post'
  });
};

/**
 * 查询短信任务列表
 * @param {Object} parameters -{templateName:'String',templateType:'String',sendType:'String',auditStatus:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MESSAGE_API_MESSAGETASK_SEARCH = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/MessageTask/Search/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 获取发送门店列表
 * @param {Object} parameters -{storeName:'String',storeAdministratorId:'String',provinceId:'Number',cityId:'Number',townId:'Number',contact:'String',mobile:'String'}
 */
export const MESSAGE_API_MESSAGETASK_SEARCHSTOREINFOLIST = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/MessageTask/SearchStoreInfoList/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 发送记录 - 列表
 * @param {Object} parameters -{characterType:'Number',templateType:'String',storeAdministratorId:'String',storeName:'String',mobile:'String',remark:'String',startTime:'String',endTime:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MESSAGE_API_SENDLOG_SEARCHLIST = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/SendLog/SearchList/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 查询门店发送明细列表
 * @param {Object} parameters -{characterId:'Number',mobile:'String',templateType:'String',startTime:'String',endTime:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MESSAGE_API_SENDLOG_SEARCHSTOREDETAILLIST = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/SendLog/SearchStoreDetailList/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 查询各门店发送统计列表
 * @param {Object} parameters -{characterType:'Number',templateType:'String',storeAdministratorId:'String',storeName:'String',mobile:'String',remark:'String',startTime:'String',endTime:'String',pageIndex:'Number',pageSize:'Number'}
 */
export const MESSAGE_API_SENDLOG_SEARCHSTORETOTALLIST = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/SendLog/SearchStoreTotalList/`,
    method: 'post',
    data: parameters
  });
};

/**
 * 发送记录 - 总计
 * @param {Object} parameters -{templateType:'String',characterId:'String',storeAdministratorId:'String',storeName:'String',startTime:'String',endTime:'String'}
 */
export const MESSAGE_API_SENDLOG_SEARCHTOTAL = parameters => {
  return fetch({
    cloud: 'Message',
    url: `/api/SendLog/SearchTotal/`,
    method: 'post',
    data: parameters
  });
};

/**
 *
 */
export const MESSAGE_API_STOREPAYMENTBASE_TESTPAY = () => {
  return fetch({
    cloud: 'Message',
    url: `/api/StorePaymentBase/TestPay/`,
    method: 'get'
  });
};
