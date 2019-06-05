import fetch from '@/utilities/fetch'

// 管控平台 - 门店套餐管理 - 检索;
// parameters: {"CompanyCode": "String", "CompanyName": "String", "StoreCode": "String", "StoreName": "String", "PackId": "long", "Expiree1": "String", "Expiree2": "String", "Days1": "int", "Days2": "int", "UniteNote": "String", "PackState": "int", "Orderby": "int", "IsAsced": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"CharacterId": "long", "CompanyCode": "String", "CompanyName": "String", "StoreCode": "String", "StoreName": "String", "StoreType": "int", "PackId": "long", "Years": "int", "Expireb": "String", "Expiree": "String", "PerPrice": "long", "DiffPrice": "long", "Days": "int", "CreateTime": "String", "PackState": "int", "PackName": "String"}
export function COLLEGE_API_CHARACTERPACK_GETS(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Character/CharacterPack/Gets/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 门店套餐管理 - 导出门店套餐列表;
// parameters: {"CompanyCode": "String", "CompanyName": "String", "StoreCode": "String", "StoreName": "String", "PackId": "long", "Expiree1": "String", "Expiree2": "String", "Days1": "int", "Days2": "int", "UniteNote": "String", "PackState": "int", "Orderby": "int", "IsAsced": "int"}
// response.data.Data: NULL
export function COLLEGE_API_CHARACTERPACK_EXPORT(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Character/CharacterPack/Export/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 角色的当前套餐 - 加载;
// parameters: {}
// response.data.Data: {"CharacterId": "long", "CompanyCode": "String", "CompanyName": "String", "StoreCode": "String", "StoreName": "String", "StoreType": "int", "PackId": "long", "Years": "int", "Expireb": "String", "Expiree": "String", "PerPrice": "long", "DiffPrice": "long", "Days": "int", "CreateTime": "String", "PackState": "int", "PackName": "String", "SurplusPrice": "long"}
export function COLLEGE_API_CHARACTERPACK_GET(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Character/CharacterPack/Get/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 角色的当前套餐 - 加载;
// parameters: {}
// response.data.Data: {"CharacterId": "long", "CompanyCode": "String", "CompanyName": "String", "StoreCode": "String", "StoreName": "String", "StoreType": "int", "PackId": "long", "Years": "int", "Expireb": "String", "Expiree": "String", "PerPrice": "long", "DiffPrice": "long", "Days": "int", "CreateTime": "String", "PackState": "int", "PackName": "String", "SurplusPrice": "long"}
export function COLLEGE_API_CHARACTERPACK_GETBYSTORE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Character/CharacterPack/GetByStore/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 门店套餐管理 - 加载;
// parameters: {characterId: 'long'}
// response.data.Data: {"CharacterId": "long", "CompanyCode": "String", "CompanyName": "String", "StoreCode": "String", "StoreName": "String", "StoreType": "int", "PackId": "long", "Years": "int", "Expireb": "String", "Expiree": "String", "PerPrice": "long", "DiffPrice": "long", "Days": "int", "CreateTime": "String", "PackState": "int", "PackName": "String", "SurplusPrice": "long"}
export function COLLEGE_API_CHARACTERPACK_GETBYCHARACTER(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Character/CharacterPack/GetByCharacter/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 必修课设置 - 当前培训方案;
// parameters: {}
// response.data.Data: {"SolutionId": "long", "Title": "String", "ImageUrl": "String", "Note": "String"}
export function COLLEGE_API_CHARACTERSOLUTIONBASIC_GET(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Character/CharacterSolutionBasic/Get/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 必修课设置 - 选择(勾选培训方案);
// parameters: {id: 'long'}
// response.data.Data: NULL
export function COLLEGE_API_CHARACTERSOLUTIONBASIC_CHOOSE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Character/CharacterSolutionBasic/Choose/',
    method: 'post',
    data: parameters
  })
}
// 门店端 - 必修课设置 - 列表;
// parameters: {solutionId: 'long'}
// response.data.Data: {"ItemId": "long", "CreateUser": "String", "CreateTime": "String", "IsMine": "int", "CourseId": "long", "CourseType": "int", "CourseTitle": "String", "TotalScore": "int", "PassScore": "int", "IsPaper": "int", "QuesQty": "int", "ExamTime": "int", "LargeName": "String", "SmallName": "String"}
export function COLLEGE_API_CHARACTERSOLUTIONITEM_GETS(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Character/CharacterSolutionItem/Gets/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 我的必修课 - 列表;
// parameters: {"CourseTitle": "String", "State": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"CourseId": "long", "CourseTitle": "String", "ImageUrl": "String", "CourseNote": "String", "CourseType": "int", "TotalScore": "int", "PassScore": "int", "QuesQty": "int", "IsPaper": "int", "UserAmt": "int", "PaperId": "long", "PaperAmt": "int", "State": "int", "Score": "int", "PassState": "int", "PackId": "long", "PackName": "String", "ExamTime": "int"}
export function COLLEGE_API_CHARACTERSOLUTIONITEM_GETSBYMINE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Character/CharacterSolutionItem/GetsByMine/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 必修课完成情况 - 列表(按员工查询);
// parameters: {"CourseTitle": "String", "UserId": "long", "State": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"CourseId": "long", "CourseTitle": "String", "ImageUrl": "String", "CourseNote": "String", "CourseType": "int", "TotalScore": "int", "PassScore": "int", "QuesQty": "int", "IsPaper": "int", "UserAmt": "int", "PaperId": "long", "PaperAmt": "int", "State": "int", "Score": "int", "PassState": "int", "PackId": "long", "PackName": "String", "ExamTime": "int"}
export function COLLEGE_API_CHARACTERSOLUTIONITEM_GETSBYUSER(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Character/CharacterSolutionItem/GetsByUser/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 我的必修课 - 汇总;
// parameters: {"UserId": "long"}
// response.data.Data: {"TotalAmt": "int", "NotYetAmt": "long", "OnGoingAmt": "long", "FinishAmt": "int"}
export function COLLEGE_API_CHARACTERSOLUTIONITEM_SUMMARY(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Character/CharacterSolutionItem/Summary/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 必修课完成情况 - 汇总;
// parameters: {userId: 'long'}
// response.data.Data: {"TotalAmt": "int", "NotYetAmt": "long", "OnGoingAmt": "long", "FinishAmt": "int"}
export function COLLEGE_API_CHARACTERSOLUTIONITEM_SUMMARYBYUSER(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Character/CharacterSolutionItem/SummaryByUser/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 科技院动态 - 未完成课程;
// parameters: {}
// response.data.Data: {"UnfinishAmt": "int"}
export function COLLEGE_API_CHARACTERSOLUTIONITEM_GETUNFINISHAMT(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Character/CharacterSolutionItem/GetUnFinishAmt/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 必修课设置 - 创建(课程);
// parameters: {"CourseIds": "String"}
// response.data.Data: NULL
export function COLLEGE_API_CHARACTERSOLUTIONITEM_CREATE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Character/CharacterSolutionItem/Create/',
    method: 'post',
    data: parameters
  })
}
// 门店端 - 必修课设置 - 删除(自定义课程);
// parameters: {id: 'long'}
// response.data.Data: NULL
export function COLLEGE_API_CHARACTERSOLUTIONITEM_DELETE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Character/CharacterSolutionItem/Delete/',
    method: 'post',
    data: parameters
  })
}
// 门店端 - 必修课设置/培训系统/珠宝学院 - 考试排名;
// parameters: {"CourseId": "long", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"CourseId": "long", "PaperAmt": "int", "LastTime": "String", "TrueName": "String", "Score": "int", "PassState": "int"}
export function COLLEGE_API_EMPLOYEEEXAMBASIC_GETS(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Exam/EmployeeExamBasic/Gets/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 必修课设置 - 查看结果;
// parameters: {"CourseId": "long", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"CourseId": "long", "PaperAmt": "int", "LastTime": "String", "TrueName": "String", "Score": "int", "PassState": "int"}
export function COLLEGE_API_EMPLOYEEEXAMBASIC_GETSRESULT(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Exam/EmployeeExamBasic/GetsResult/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 必修课完成情况 - 按课程查询;
// parameters: {"CourseId": "long", "State": "int", "TrueName": "String", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"PaperAmt": "int", "LastTime": "String", "State": "String", "JobCode": "String", "AliasName": "String", "TrueName": "String", "Department": "String", "Score": "int", "PassState": "int"}
export function COLLEGE_API_EMPLOYEEEXAMBASIC_GETSBYCOURSE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Exam/EmployeeExamBasic/GetsByCourse/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 课程详情 - 统计信息(考试成绩);
// parameters: {id: 'long'}
// response.data.Data: {"CharacterId": "long", "UserId": "long", "CourseId": "long", "PaperId": "long", "PaperAmt": "int", "Score": "int", "PassState": "int", "Expiree": "String", "NowTime": "String"}
export function COLLEGE_API_EMPLOYEEEXAMBASIC_GET(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Exam/EmployeeExamBasic/Get/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 我的必修课 - 学习;
// parameters: {id: 'long'}
// response.data.Data: null
export function COLLEGE_API_EMPLOYEEEXAMBASIC_CREATE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Exam/EmployeeExamBasic/Create/',
    method: 'post',
    data: parameters
  })
}
// 门店端 - 必修课完成情况 - 汇总;
// parameters: {courseId: 'long'}
// response.data.Data: {"TotalAmt": "int", "NotYetAmt": "long", "OnGoingAmt": "long", "FinishAmt": "int"}
export function COLLEGE_API_EMPLOYEEEXAMBASIC_SUMMARY(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Exam/EmployeeExamBasic/Summary/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 考试记录 - 列表;
// parameters: {"CourseTitle": "String", "UserId": "long", "ChannelType": "long", "SmallId": "int", "LargeId": "int", "CreateTime1": "String", "CreateTime2": "String", "PassState": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"PaperId": "long", "AliasName": "String", "TrueName": "String", "ChannelType": "int", "CourseType": "int", "CourseTitle": "String", "SmallName": "String", "LargeName": "String", "MultiScore": "int", "TotalScore": "int", "PassScore": "int", "Score": "int", "PassState": "int", "CreateTime": "String"}
export function COLLEGE_API_EMPLOYEEEXAMPAPER_GETS(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Exam/EmployeeExamPaper/Gets/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 考试报表 - 列表;
// parameters: {"StoreCode": "String", "StoreName": "String", "CourseTitle": "String", "ChannelType": "long", "SmallId": "int", "LargeId": "int", "PassState": "int", "IsAsced": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"StoreCode": "String", "StoreName": "String", "AliasName": "String", "TrueName": "String", "ChannelType": "int", "CourseType": "int", "CourseTitle": "String", "SmallName": "String", "LargeName": "String", "Score": "int", "PassState": "int", "CreateTime": "String"}
export function COLLEGE_API_EMPLOYEEEXAMPAPER_GETSBYREPORT(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Exam/EmployeeExamPaper/GetsByReport/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 考试记录 - 查看考卷(统计);
// parameters: {id: 'long'}
// response.data.Data: {"PaperId": "long", "CharacterId": "long", "UserId": "long", "CourseId": "long", "CompanyCode": "String", "CompanyName": "String", "StoreCode": "String", "StoreName": "String", "StoreType": "int", "JobCode": "String", "AliasName": "String", "TrueName": "String", "Department": "String", "ChannelType": "int", "CourseType": "int", "CourseTitle": "String", "SmallId": "long", "LargeId": "long", "SmallName": "String", "LargeName": "String", "QuesQty": "int", "SingleQty": "int", "MultiQty": "int", "SingleScore": "int", "MultiScore": "int", "TotalScore": "int", "PassScore": "int", "ExamTime": "int", "Expireb": "String", "Expiree": "String", "TakeTime": "int", "RightQty": "int", "WrongQty": "int", "Score": "int", "PassState": "int", "CreateTime": "String", "NowTime": "String"}
export function COLLEGE_API_EMPLOYEEEXAMPAPER_GET(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Exam/EmployeeExamPaper/Get/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 科技院动态 - 正在考试的课程;
// parameters: {id: 'long'}
// response.data.Data: {"PaperId": "long", "CharacterId": "long", "UserId": "long", "CourseId": "long", "CompanyCode": "String", "CompanyName": "String", "StoreCode": "String", "StoreName": "String", "StoreType": "int", "JobCode": "String", "AliasName": "String", "TrueName": "String", "Department": "String", "ChannelType": "int", "CourseType": "int", "CourseTitle": "String", "SmallId": "long", "LargeId": "long", "SmallName": "String", "LargeName": "String", "QuesQty": "int", "SingleQty": "int", "MultiQty": "int", "SingleScore": "int", "MultiScore": "int", "TotalScore": "int", "PassScore": "int", "ExamTime": "int", "Expireb": "String", "Expiree": "String", "TakeTime": "int", "RightQty": "int", "WrongQty": "int", "Score": "int", "PassState": "int", "CreateTime": "String", "NowTime": "String"}
export function COLLEGE_API_EMPLOYEEEXAMPAPER_REQ(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Exam/EmployeeExamPaper/Req/',
    method: 'get',
    params: parameters
  })
}
// 门店端  - 系统培训/珠宝学院/我的必修课 - 考试(重新考试);
// parameters: {id: 'long'}
// response.data.Data: PaperId
export function COLLEGE_API_EMPLOYEEEXAMPAPER_EXAM(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Exam/EmployeeExamPaper/Exam/',
    method: 'post',
    data: parameters
  })
}
// 门店端 - 考试/重新考试 - 交卷;
// parameters: {"PaperId": "long", "Answers": "List<EmployeeExamQuesOptionRequest>"}
// response.data.Data: NULL
export function COLLEGE_API_EMPLOYEEEXAMPAPER_HAND(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Exam/EmployeeExamPaper/Hand/',
    method: 'post',
    data: parameters
  })
}
// 门店端 - 取消考试;
// parameters: {id: 'long'}
// response.data.Data: NULL
export function COLLEGE_API_EMPLOYEEEXAMPAPER_CANCEL(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Exam/EmployeeExamPaper/Cancel/',
    method: 'post',
    data: parameters
  })
}
// 门店端 - 考试记录 - 查看考卷(试题);
// parameters: {id: 'long'}
// response.data.Data: {"QuesId": "String", "PaperId": "long", "QuesNO": "int", "QuesType": "int", "Title": "String", "ImageUrl": "String", "Options": "String", "Answers2": "String", "IsRight": "int", "Stamp": "String"}
export function COLLEGE_API_EMPLOYEEEXAMQUES_GETS(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Exam/EmployeeExamQues/Gets/',
    method: 'get',
    params: parameters
  })
}
// 管控中心 - 系统培训管理 - 列表;
// parameters: {"CourseTitle": "String", "SmallId": "int", "LargeId": "int", "State": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"CourseId": "long", "PackId": "long", "ChannelType": "int", "CourseType": "int", "CourseTitle": "String", "CreateUser": "String", "CreateTime": "String", "State": "int", "IsPaper": "int", "LargeName": "String", "SmallName": "String", "PackName": "String"}
export function COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMLISTBYLCB(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/SystemListByLcb/',
    method: 'get',
    params: parameters
  })
}
// 管控中心 - 珠宝学院管理 - 列表;
// parameters: {"CourseTitle": "String", "SmallId": "int", "LargeId": "int", "State": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"CourseId": "long", "PackId": "long", "ChannelType": "int", "CourseType": "int", "CourseTitle": "String", "CreateUser": "String", "CreateTime": "String", "State": "int", "IsPaper": "int", "LargeName": "String", "SmallName": "String", "PackName": "String"}
export function COLLEGE_API_INFRASTCOURSEBASIC_COLLEGELISTBYLCB(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/CollegeListByLcb/',
    method: 'get',
    params: parameters
  })
}
// 管控中心 - 课程报表 - 列表;
// parameters: {"ChannelType": "int", "CourseType": "int", "CourseTitle": "String", "SmallId": "int", "LargeId": "int", "CreateTime1": "String", "CreateTime2": "String", "Orderby": "int", "IsAsced": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"CourseId": "long", "ChannelType": "int", "CourseType": "int", "CourseTitle": "String", "CreateTime": "String", "LikeAmt": "int", "HitsAmt": "int", "ViewAmt": "int", "ExamAmt": "int", "PassAmt": "int", "PassRank": "long", "LargeName": "String", "SmallName": "String"}
export function COLLEGE_API_INFRASTCOURSEBASIC_REPORTLIST(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/ReportList/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 系统培训 - 列表;
// parameters: {"CourseTitle": "String", "SmallId": "int", "LargeId": "int", "Orderby": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"CourseId": "long", "PackId": "long", "CourseType": "int", "CourseTitle": "String", "ImageUrl": "String", "CourseNote": "String", "CreateTime": "String", "IsPaper": "int", "LargeName": "String", "SmallName": "String", "PackName": "String"}
export function COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMLISTBYSTORE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/SystemListByStore/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 珠宝学院 - 列表;
// parameters: {"CourseTitle": "String", "SmallId": "int", "LargeId": "int", "Orderby": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"CourseId": "long", "PackId": "long", "CourseType": "int", "CourseTitle": "String", "ImageUrl": "String", "CourseNote": "String", "CreateTime": "String", "IsPaper": "int", "LargeName": "String", "SmallName": "String", "PackName": "String"}
export function COLLEGE_API_INFRASTCOURSEBASIC_COLLEGELISTBYSTORE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/CollegeListByStore/',
    method: 'get',
    params: parameters
  })
}
// 管控中心 - 系统培训管理 - 详情;
// parameters: {id: 'long'}
// response.data.Data: {"CourseId": "long", "PackId": "long", "ChannelType": "int", "CourseType": "int", "CourseTitle": "String", "SmallId": "long", "LargeId": "long", "ImageUrl": "String", "VideoCode": "String", "VideoName": "String", "CourseNote": "String", "Content": "String", "CreateUser": "String", "CreateTime": "String", "CheckUser": "String", "CheckNote": "String", "CheckTime": "String", "State": "int", "QuesAmt": "int", "SingleAmt": "int", "MultiAmt": "int", "QuesQty": "int", "SingleQty": "int", "MultiQty": "int", "SingleScore": "int", "MultiScore": "int", "TotalScore": "int", "PassScore": "int", "ExamTime": "int", "IsPaper": "int", "LargeName": "String", "SmallName": "String", "PackName": "String"}
export function COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMDETAIL(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/SystemDetail/',
    method: 'get',
    params: parameters
  })
}
// 管控中心 - 珠宝学院管理 - 详情;
// parameters: {id: 'long'}
// response.data.Data: {"CourseId": "long", "PackId": "long", "ChannelType": "int", "CourseType": "int", "CourseTitle": "String", "SmallId": "long", "LargeId": "long", "ImageUrl": "String", "VideoCode": "String", "VideoName": "String", "CourseNote": "String", "Content": "String", "CreateUser": "String", "CreateTime": "String", "CheckUser": "String", "CheckNote": "String", "CheckTime": "String", "State": "int", "QuesAmt": "int", "SingleAmt": "int", "MultiAmt": "int", "QuesQty": "int", "SingleQty": "int", "MultiQty": "int", "SingleScore": "int", "MultiScore": "int", "TotalScore": "int", "PassScore": "int", "ExamTime": "int", "IsPaper": "int", "LargeName": "String", "SmallName": "String", "PackName": "String"}
export function COLLEGE_API_INFRASTCOURSEBASIC_COLLEGEDETAIL(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/CollegeDetail/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 课程文章, 视频的详情;
// parameters: {id: 'long'}
// response.data.Data: {"CourseId": "long", "CourseType": "int", "ChannelType": "int", "CourseTitle": "String", "ImageUrl": "String", "VideoCode": "String", "VideoName": "String", "CourseNote": "String", "Content": "String", "CreateTime": "String", "MultiAmt": "int", "QuesQty": "int", "TotalScore": "int", "PassScore": "int", "ExamTime": "int", "IsPaper": "int", "LargeName": "String", "SmallName": "String", "PackName": "String", "PackId": "long"}
export function COLLEGE_API_INFRASTCOURSEBASIC_CACHE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/Cache/',
    method: 'get',
    params: parameters
  })
}
// 管控中心 - 系统培训管理 - 新建文档/新建视频;
// parameters: {"PackId": "long", "CourseType": "int", "CourseTitle": "String", "SmallId": "int", "LargeId": "int", "SingleQty": "int", "MultiQty": "int", "SingleScore": "int", "MultiScore": "int", "PassScore": "int", "ExamTime": "int", "IsPaper": "int"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEBASIC_CREATEBYSYSTEM(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/CreateBySystem/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 珠宝学院管理 - 新建文档/新建视频;
// parameters: {"PackId": "long", "CourseType": "int", "CourseTitle": "String", "SmallId": "int", "LargeId": "int", "SingleQty": "int", "MultiQty": "int", "SingleScore": "int", "MultiScore": "int", "PassScore": "int", "ExamTime": "int", "IsPaper": "int"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEBASIC_CREATEBYCOLLEGE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/CreateByCollege/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 系统培训管理 - 更新基本信息;
// parameters: {"CourseId": "long", "PackId": "long", "CourseTitle": "String", "SmallId": "int", "LargeId": "int", "SingleQty": "int", "MultiQty": "int", "SingleScore": "int", "MultiScore": "int", "PassScore": "int", "ExamTime": "int", "IsPaper": "int"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEBASIC_UPDATESYSTEM(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/UpdateSystem/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 珠宝学院管理 - 更新基本信息;
// parameters: {"CourseId": "long", "PackId": "long", "CourseTitle": "String", "SmallId": "int", "LargeId": "int", "SingleQty": "int", "MultiQty": "int", "SingleScore": "int", "MultiScore": "int", "PassScore": "int", "ExamTime": "int", "IsPaper": "int"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEBASIC_UPDATECOLLEGE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/UpdateCollege/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 系统培训管理 - 更新文章内容;
// parameters: {"CourseId": "long", "ImageUrl": "String", "CourseNote": "String", "Content": "String"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEBASIC_MODIFYBYSYSTEMARTICLE(
  parameters
) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/ModifyBySystemArticle/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 系统培训管理 - 更新视频内容;
// parameters: {"CourseId": "long", "ImageUrl": "String", "VideoCode": "String", "VideoName": "String", "CourseNote": "String"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEBASIC_MODIFYBYSYSTEMVIDEO(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/ModifyBySystemVideo/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 珠宝学院管理 - 更新文章内容;
// parameters: {"CourseId": "long", "ImageUrl": "String", "CourseNote": "String", "Content": "String"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEBASIC_MODIFYBYCOLLEGEARTICLE(
  parameters
) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/ModifyByCollegeArticle/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 珠宝学院管理 - 更新视频内容;
// parameters: {"CourseId": "long", "ImageUrl": "String", "VideoCode": "String", "VideoName": "String", "CourseNote": "String"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEBASIC_MODIFYBYCOLLEGEVIDEO(
  parameters
) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/ModifyByCollegeVideo/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 系统培训管理 - 提交审核;
// parameters: {id: 'long'}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEBASIC_SUBMITBYSYSTEM(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/SubmitBySystem/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 珠宝学院管理 - 提交审核;
// parameters: {id: 'long'}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEBASIC_SUBMITBYCOLLEGE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/SubmitByCollege/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 系统培训管理 - 审核通过;
// parameters: {id: 'long'}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEBASIC_AUDITBYSYSTEM(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/AuditBySystem/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 系统培训管理 - 审核通过;
// parameters: {id: 'long'}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEBASIC_AUDITBYCOLLEGE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/AuditByCollege/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 系统培训管理 - 审核退回;
// parameters: {"CourseId": "long", "CheckNote": "String"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEBASIC_REJECTSYSTEM(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/RejectSystem/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 珠宝学院管理 - 审核退回;
// parameters: {"CourseId": "long", "CheckNote": "String"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEBASIC_REJECTCOLLEGE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/RejectCollege/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 系统培训管理 - 取消审核;
// parameters: {"CourseId": "long", "CheckNote": "String"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEBASIC_CANCELSYSTEM(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/CancelSystem/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 珠宝学院管理 - 取消审核;
// parameters: {"CourseId": "long", "CheckNote": "String"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEBASIC_CANCELCOLLEGE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/CancelCollege/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 系统培训管理 - 作废;
// parameters: {"CourseId": "long", "CheckNote": "String"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEBASIC_ABANDONSYSTEM(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/AbandonSystem/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 珠宝学院管理 - 作废;
// parameters: {"CourseId": "long", "CheckNote": "String"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEBASIC_ABANDONCOLLEGE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/AbandonCollege/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 视频库 - 删除视频(批量最多20个);
// parameters: {"VideoCode": "String"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEBASIC_DELETEVIDEO(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseBasic/DeleteVideo/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 系统培训管理 - 查询题库;
// parameters: {"CourseId": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"QuesId": "long", "CourseId": "int", "QuesType": "int", "Title": "String", "ImageUrl": "String", "Options": "String", "Answers": "String"}
export function COLLEGE_API_INFRASTCOURSEQUES_SYSTEMLIST(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseQues/SystemList/',
    method: 'get',
    params: parameters
  })
}
// 管控中心 - 珠宝学院管理 - 查询题库;
// parameters: {"CourseId": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"QuesId": "long", "CourseId": "int", "QuesType": "int", "Title": "String", "ImageUrl": "String", "Options": "String", "Answers": "String"}
export function COLLEGE_API_INFRASTCOURSEQUES_COLLEGELIST(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseQues/CollegeList/',
    method: 'get',
    params: parameters
  })
}
// 管控中心 - 系统培训管理 - 新增题库;
// parameters: {"CourseId": "int", "QuesType": "int", "Title": "String", "ImageUrl": "String", "Options": "List<InfrastCourseQuesOption>"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEQUES_CREATEBYSYSTEM(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseQues/CreateBySystem/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 珠宝学院管理 - 新增题库;
// parameters: {"CourseId": "int", "QuesType": "int", "Title": "String", "ImageUrl": "String", "Options": "List<InfrastCourseQuesOption>"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEQUES_CREATEBYCOLLEGE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseQues/CreateByCollege/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 系统培训管理 - 删除题库;
// parameters: {id: 'long'}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEQUES_DELETEBYSYSTEM(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseQues/DeleteBySystem/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 系统培训管理 - 删除题库;
// parameters: {id: 'long'}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSEQUES_DELETEBYCOLLEGE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseQues/DeleteByCollege/',
    method: 'post',
    data: parameters
  })
}
// 门店端 - 课程 - 点赞;
// parameters: {id: 'long'}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSETALLY_LIKE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseTally/Like/',
    method: 'post',
    data: parameters
  })
}
// 门店端 - 课程 - 点赞数;
// parameters: {id: 'long'}
// response.data.Data: {"CourseId": "long", "LikeAmt": "int"}
export function COLLEGE_API_INFRASTCOURSETALLY_LIKEAMT(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseTally/LikeAmt/',
    method: 'get',
    params: parameters
  })
}
// 管控中心 - 视频日志 - 列表;
// parameters: {"CreateUserId": "long", "CreateTime1": "String", "CreateTime2": "String", "State": "int", "IsAsced": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"LogId": "long", "VideoCode": "String", "VideoName": "String", "VideoSize": "String", "VideoTime": "String", "CreateUserId": "long", "CreateUser": "String", "CreateTime": "String", "State": "int"}
export function COLLEGE_API_INFRASTCOURSEVIDEOLOG_GETS(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseVideoLog/Gets/',
    method: 'get',
    params: parameters
  })
}
// 管控中心 - 视频日志 - 上传;
// parameters: {"VideoCode": "String", "VideoName": "String", "VideoSize": "String", "VideoTime": "String"}
// response.data.Data: null
export function COLLEGE_API_INFRASTCOURSEVIDEOLOG_UPLOAD(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseVideoLog/Upload/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 视频日志 - 取消上传;
// parameters: {"VideoCode": "String"}
// response.data.Data: null
export function COLLEGE_API_INFRASTCOURSEVIDEOLOG_CANCEL(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseVideoLog/Cancel/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 视频日志 - 删除;
// parameters: {"VideoCodes": "String"}
// response.data.Data: null
export function COLLEGE_API_INFRASTCOURSEVIDEOLOG_DELETE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseVideoLog/Delete/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 视频日志 - 上传成功回调;
// parameters: {id: 'long'}
// response.data.Data: null
export function COLLEGE_API_INFRASTCOURSEVIDEOLOG_UPDATE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastCourseVideoLog/Update/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 专题管理 - 列表;
// parameters: {"Title": "String", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"SubjectId": "long", "Title": "String", "ItemQty": "int", "CreateUser": "String", "CreateTime": "String", "State": "int"}
export function COLLEGE_API_INFRASTSUBJECTBASIC_GETS(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastSubjectBasic/Gets/',
    method: 'get',
    params: parameters
  })
}
// 管控中心 - 专题报表 - 列表;
// parameters: {"Title": "String", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"SubjectId": "long", "Title": "String", "ItemQty": "int", "HitsAmt": "int", "ViewAmt": "int", "CreateUser": "String", "CreateTime": "String"}
export function COLLEGE_API_INFRASTSUBJECTBASIC_REPORTLIST(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastSubjectBasic/ReportList/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 专题列表;
// parameters: {"Title": "String", "Orderby": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"SubjectId": "long", "Title": "String", "ImageUrl": "String", "ItemQty": "int", "Note": "String", "CreateTime": "String"}
export function COLLEGE_API_INFRASTSUBJECTBASIC_CACHES(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastSubjectBasic/Caches/',
    method: 'get',
    params: parameters
  })
}
// 管控中心 - 课程专题 - 详情;
// parameters: {id: 'long'}
// response.data.Data: {"SubjectId": "long", "Title": "String", "ImageUrl": "String", "ItemQty": "int", "Note": "String", "CreateTime": "String", "CreateUser": "String"}
export function COLLEGE_API_INFRASTSUBJECTBASIC_GET(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastSubjectBasic/Get/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 课程专题 - 详情;
// parameters: {id: 'long'}
// response.data.Data: {"SubjectId": "long", "Title": "String", "ImageUrl": "String", "ItemQty": "int", "Note": "String", "CreateTime": "String", "CreateUser": "String"}
export function COLLEGE_API_INFRASTSUBJECTBASIC_GETBYSTORE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastSubjectBasic/GetByStore/',
    method: 'get',
    params: parameters
  })
}
// 管控中心 - 课程专题 - 创建;
// parameters: {"Title": "String", "ImageUrl": "String", "Note": "String"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTSUBJECTBASIC_CREATE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastSubjectBasic/Create/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 课程专题 - 编辑;
// parameters: {"SubjectId": "long", "Title": "String", "ImageUrl": "String", "Note": "String"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTSUBJECTBASIC_UPDATE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastSubjectBasic/Update/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 课程专题 - 删除;
// parameters: {id: 'long'}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTSUBJECTBASIC_DELETE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastSubjectBasic/Delete/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 专题管理 - 详情(明细列表);
// parameters: {"SubjectId": "long", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"ItemId": "long", "PackId": "long", "CourseId": "long", "ChannelType": "String", "CourseType": "int", "CourseTitle": "String", "ImageUrl": "String", "IsPaper": "String", "CreateTime": "String", "LargeName": "String", "SmallName": "String", "PackName": "String"}
export function COLLEGE_API_INFRASTSUBJECTITEM_GETS(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastSubjectItem/Gets/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 专题推荐 - 详情(明细列表);
// parameters: {"SubjectId": "long", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"ItemId": "long", "PackId": "long", "CourseId": "long", "ChannelType": "String", "CourseType": "int", "CourseTitle": "String", "ImageUrl": "String", "IsPaper": "String", "CreateTime": "String", "LargeName": "String", "SmallName": "String", "PackName": "String"}
export function COLLEGE_API_INFRASTSUBJECTITEM_CACHES(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastSubjectItem/Caches/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 必修课设置 - 从专题选课(明细列表);
// parameters: {"SubjectId": "long", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"ItemId": "long", "PackId": "long", "CourseId": "long", "ChannelType": "String", "CourseType": "int", "CourseTitle": "String", "ImageUrl": "String", "IsPaper": "String", "CreateTime": "String", "LargeName": "String", "SmallName": "String", "PackName": "String"}
export function COLLEGE_API_INFRASTSUBJECTITEM_ITEMLIST(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastSubjectItem/ItemList/',
    method: 'get',
    params: parameters
  })
}
// 管控中心 - 专题管理 - 添加专题;
// parameters: {"SubjectId": "long", "CourseIds": "String"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTSUBJECTITEM_CREATE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastSubjectItem/Create/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 专题管理 - 删除;
// parameters: {id: 'long'}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTSUBJECTITEM_DELETE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastSubjectItem/Delete/',
    method: 'post',
    data: parameters
  })
}
// 管控中心 - 专题管理 - 排序;
// parameters: {"ItemId": "long", "MoveType": "int"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTSUBJECTITEM_SORT(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Infrast/InfrastSubjectItem/Sort/',
    method: 'post',
    data: parameters
  })
}
// 管控平台 - 订单管理 - 列表;
// parameters: {"OrderCode": "String", "CompanyCode": "String", "CompanyName": "String", "StoreCode": "String", "StoreName": "String", "SourceType": "int", "OrderType": "int", "PackId": "long", "Years": "int", "PaymentType": "int", "PaidState": "int", "UniteNote": "int", "CreateTime1": "String", "CreateTime2": "String", "CheckTime1": "String", "CheckTime2": "String", "State": "int", "JunkPackId": "long", "JunkDays1": "int", "JunkDays2": "int", "JunkPackState": "int", "Orderby": "int", "IsAsced": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"OrderId": "String", "OrderCode": "String", "CharacterId": "long", "CompanyCode": "String", "CompanyName": "String", "StoreCode": "String", "StoreName": "String", "StoreType": "int", "SourceType": "int", "OrderType": "int", "PackId": "long", "PackName": "String", "Years": "int", "Expireb": "String", "Expiree": "String", "PackPrice": "long", "SurplusPrice": "long", "PaidPrice": "long", "CashPrice": "long", "PaymentType": "int", "PaidNO": "String", "PaidState": "int", "CreateUserId": "long", "CreateUser": "String", "CreateTime": "String", "CheckTime": "String", "CheckNote": "String", "State": "int", "JunkPackId": "long", "JunkPackName": "String", "JunkYears": "int", "JunkExpireb": "String", "JunkExpiree": "String", "JunkDays": "int", "JunkPackState": "int"}
export function COLLEGE_API_PACKORDERBASIC_GETS(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Order/PackOrderBasic/Gets/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 门店套餐管理 - 交易记录列表;
// parameters: {"CharacterId": "long", "Orderby": "int", "IsAsced": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"OrderId": "String", "OrderCode": "String", "CharacterId": "long", "CompanyCode": "String", "CompanyName": "String", "StoreCode": "String", "StoreName": "String", "StoreType": "int", "SourceType": "int", "OrderType": "int", "PackId": "long", "PackName": "String", "Years": "int", "Expireb": "String", "Expiree": "String", "PackPrice": "long", "SurplusPrice": "long", "PaidPrice": "long", "CashPrice": "long", "PaymentType": "int", "PaidNO": "String", "PaidState": "int", "CreateUserId": "long", "CreateUser": "String", "CreateTime": "String", "CheckTime": "String", "CheckNote": "String", "State": "int", "JunkPackId": "long", "JunkPackName": "String", "JunkYears": "int", "JunkExpireb": "String", "JunkExpiree": "String", "JunkDays": "int", "JunkPackState": "int"}
export function COLLEGE_API_PACKORDERBASIC_GETSBYCHARACTER(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Order/PackOrderBasic/GetsByCharacter/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 订单管理 - 导出订单列表;
// parameters: {"OrderCode": "String", "CompanyCode": "String", "CompanyName": "String", "StoreCode": "String", "StoreName": "String", "SourceType": "int", "OrderType": "int", "PackId": "long", "Years": "int", "PaymentType": "int", "PaidState": "int", "UniteNote": "int", "CreateTime1": "String", "CreateTime2": "String", "CheckTime1": "String", "CheckTime2": "String", "State": "int", "JunkPackId": "long", "JunkDays1": "int", "JunkDays2": "int", "JunkPackState": "int", "Orderby": "int", "IsAsced": "int", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: NULL
export function COLLEGE_API_PACKORDERBASIC_EXPORT(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Order/PackOrderBasic/Export/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 门店套餐管理 - 详情;
// parameters: {orderId: 'long'}
// response.data.Data: {"OrderId": "long", "OrderCode": "String", "CharacterId": "long", "CompanyCode": "String", "CompanyName": "String", "StoreCode": "String", "StoreName": "String", "StoreType": "int", "SourceType": "int", "OrderType": "int", "PackId": "long", "PackName": "String", "Years": "int", "Expireb": "String", "Expiree": "String", "PerPrice": "long", "DiffPrice": "long", "PackPrice": "long", "SurplusPrice": "long", "PaidPrice": "long", "CashPrice": "long", "PaymentType": "int", "PaidNO": "String", "PaidState": "int", "UniteNote": "String", "Note": "String", "Logs": "String", "CreateUserId": "long", "CreateUser": "String", "CreateTime": "String", "State": "int"}
export function COLLEGE_API_PACKORDERBASIC_GET(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Order/PackOrderBasic/Get/',
    method: 'get',
    params: parameters
  })
}
// 校验(最新订单);
// parameters: {orderId: 'long'}
// response.data.Data: {"IsNewest": "int"}
export function COLLEGE_API_PACKORDERBASIC_CHECK(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Order/PackOrderBasic/Check/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 科技园交易报表 - 报表(交易概况);
// parameters: {"SourceType": "int", "OrderType": "int", "PackId": "long", "Years": "int", "CheckTime1": "String", "CheckTime2": "String"}
// response.data.Data: {"OrderAmt": "int", "PackPrice": "long", "SurplusPrice": "long", "PaidPrice": "long", "CashPrice": "long"}
export function COLLEGE_API_PACKORDERBASIC_SUMMARY(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Order/PackOrderBasic/Summary/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 科技园交易报表 - 报表(交易趋势);
// parameters: {"SourceType": "int", "OrderType": "int", "PackId": "long", "Years": "int", "CheckTime1": "String", "CheckTime2": "String"}
// response.data.Data: {"OrderTime": "String", "OrderAmt": "int", "PackPrice": "long", "SurplusPrice": "long", "PaidPrice": "long", "CashPrice": "long"}
export function COLLEGE_API_PACKORDERBASIC_SUMMARYBYDATE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Order/PackOrderBasic/SummaryByDate/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 门店套餐管理 - 升级;
// parameters: {"CharacterId": "long", "OrderType": "int", "PackId": "long", "Years": "int", "CashPrice": "long", "PaymentType": "int", "PaidNO": "String"}
// response.data.Data: NULL
export function COLLEGE_API_PACKORDERBASIC_PROMOTE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Order/PackOrderBasic/Promote/',
    method: 'post',
    data: parameters
  })
}
// 管控平台 - 门店套餐管理 - 续费;
// parameters: {"CharacterId": "long", "OrderType": "int", "PackId": "long", "Years": "int", "CashPrice": "long", "PaymentType": "int", "PaidNO": "String"}
// response.data.Data: NULL
export function COLLEGE_API_PACKORDERBASIC_RENEW(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Order/PackOrderBasic/Renew/',
    method: 'post',
    data: parameters
  })
}
// 门店端 - 门店套餐管理 - 创建(续费/升级);
// parameters: {"CharacterId": "long", "OrderType": "int", "PackId": "long", "Years": "int", "CashPrice": "long", "PaymentType": "int", "PaidNO": "String"}
// response.data.Data: NULL
export function COLLEGE_API_PACKORDERBASIC_CREATEBYSTORE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Order/PackOrderBasic/CreateByStore/',
    method: 'post',
    data: parameters
  })
}
// 首页 - 科技院套餐升级/续费 - 支付;
// parameters: {orderId: 'long'}
// response.data.Data: {"OrderId": "long", "PaidPrice": "long", "QrCode": "String"}
export function COLLEGE_API_PACKORDERBASIC_CODE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Order/PackOrderBasic/Code/',
    method: 'get',
    params: parameters
  })
}
// 首页 - 科技院套餐升级/续费 - 支付(成功后回调);
// parameters: {"OrderNo": "long", "Code": "String", "Transaction_Id": "String"}
// response.data.Data: NULL
export function COLLEGE_API_PACKORDERBASIC_CALLBACK(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Order/PackOrderBasic/CallBack/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 订单管理 - 审核(支付);
// parameters: {"OrderId": "long", "PaidNO": "String", "CheckNote": "String"}
// response.data.Data: NULL
export function COLLEGE_API_PACKORDERBASIC_AUDIT(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Order/PackOrderBasic/Audit/',
    method: 'post',
    data: parameters
  })
}
// 首页 - 科技院套餐升级/续费 - 检测支付是否完成;
// parameters: {orderId : 'long'}
// response.data.Data: NULL
export function COLLEGE_API_PACKORDERBASIC_CHECKPAY(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Order/PackOrderBasic/CheckPay/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 订单管理 - 取消审核;
// parameters: {"OrderId": "long", "CheckNote": "String"}
// response.data.Data: NULL
export function COLLEGE_API_PACKORDERBASIC_CANCEL(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Order/PackOrderBasic/Cancel/',
    method: 'post',
    data: parameters
  })
}
// 管控平台 - 订单管理 - 作废;
// parameters: {"OrderId": "long", "CheckNote": "String"}
// response.data.Data: NULL
export function COLLEGE_API_PACKORDERBASIC_ABANDON(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Order/PackOrderBasic/Abandon/',
    method: 'post',
    data: parameters
  })
}
// 刷新(每天凌晨服务, 刷新到期天数和套餐状态);
// parameters: {pageSize: 'int'}
// response.data.Data: NULL
export function COLLEGE_API_CHARACTERPACK_FRESH(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Scheduler/CharacterPack/Fresh/',
    method: 'get',
    params: parameters
  })
}
// 员工考试的考卷(每次) - 刷新(定时服务, 刷新考试状态);
// parameters: {"Nothing": "int"}
// response.data.Data: NULL
export function COLLEGE_API_EMPLOYEEEXAMPAPER_FRESH(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Scheduler/EmployeeExamPaper/Fresh/',
    method: 'get',
    params: parameters
  })
}
// 培训课程计数 - 同步(定时服务同步点击次数);
// parameters: {"PageSize": "int"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTCOURSETALLY_SYNC(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Scheduler/InfrastCourseTally/Sync/',
    method: 'get',
    params: parameters
  })
}
// 课程专题 - 同步(定时服务同步点击次数);
// parameters: {"PageSize": "int"}
// response.data.Data: NULL
export function COLLEGE_API_INFRASTSUBJECTBASIC_SYNC(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Scheduler/InfrastSubjectBasic/Sync/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 分类管理 - 列表;
// parameters: {dictType: 'long'}
// response.data.Data: {"DictId": "long", "ParentId": "long", "DictType": "int", "DictName": "String", "SortId": "int", "State": "int"}
export function COLLEGE_API_SETTINGDICTIONARY_GETS(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingDictionary/Gets/',
    method: 'get',
    params: parameters
  })
}
// 珠宝学院(课程分类) - 下拉框;
// parameters: {}
// response.data.Data: {"DictId": "long", "ParentId": "long", "DictName": "String"}
export function COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYCOLLEGE(
  parameters
) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingDictionary/DropDownListByCollege/',
    method: 'get',
    params: parameters
  })
}
// 系统培训(所属系统) - 下拉框;
// parameters: {}
// response.data.Data: {"DictId": "long", "ParentId": "long", "DictName": "String"}
export function COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYSYSTEM(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingDictionary/DropDownListBySystem/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 分类管理 - 详情;
// parameters: {id: 'long'}
// response.data.Data: {"DictId": "long", "ParentId": "long", "DictType": "int", "DictName": "String", "SortId": "int", "State": "int"}
export function COLLEGE_API_SETTINGDICTIONARY_GET(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingDictionary/Get/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 分类管理 - 创建;
// parameters: {"ParentId": "long", "DictType": "int", "DictName": "String"}
// response.data.Data: NULL
export function COLLEGE_API_SETTINGDICTIONARY_CREATE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingDictionary/Create/',
    method: 'post',
    data: parameters
  })
}
// 管控平台 - 分类管理 - 修改;
// parameters: {"DictId": "long", "DictName": "String"}
// response.data.Data: NULL
export function COLLEGE_API_SETTINGDICTIONARY_UPDATE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingDictionary/Update/',
    method: 'post',
    data: parameters
  })
}
// 管控平台 - 分类管理 - 删除;
// parameters: {id: 'long'}
// response.data.Data: NULL
export function COLLEGE_API_SETTINGDICTIONARY_DELETE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingDictionary/Delete/',
    method: 'post',
    data: parameters
  })
}
// 管控平台 - 分类管理 - 排序;
// parameters: {"DictId": "long", "MoveType": "int"}
// response.data.Data: NULL
export function COLLEGE_API_SETTINGDICTIONARY_SORT(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingDictionary/Sort/',
    method: 'post',
    data: parameters
  })
}
// 管控平台 - 套餐管理 - 列表;
// parameters: {}
// response.data.Data: {"PackId": "long", "PackName": "String", "Prices": "String", "Note": "String", "LastUserId": "long", "LastUser": "String", "LastTime": "String"}
export function COLLEGE_API_SETTINGPACK_GETS(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingPack/Gets/',
    method: 'get',
    params: parameters
  })
}
// 套餐管理 - 套餐详情;
// parameters: {packId: 'long'}
// response.data.Data: {"PackId": "long", "PackName": "String", "Prices": "String", "Note": "String", "LastUserId": "long", "LastUser": "String", "LastTime": "String"}
export function COLLEGE_API_SETTINGPACK_GET(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingPack/Get/',
    method: 'get',
    params: parameters
  })
}
// 套餐 - 下拉框;
// parameters: {}
// response.data.Data: {"PackId": "long", "PackName": "String"}
export function COLLEGE_API_SETTINGPACK_DROPDOWNLIST(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingPack/DropDownList/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 套餐管理 - 修改;
// parameters: {"Packs": "List<SettingPackUpdateByItemRequest>"}
// response.data.Data: NULL
export function COLLEGE_API_SETTINGPACK_UPDATE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingPack/Update/',
    method: 'post',
    data: parameters
  })
}
// 购买时长 - 下拉框;
// parameters: NULL
// response.data.Data: {"Year": "int"}
export function COLLEGE_API_SETTINGPACK_GETYEAR(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingPack/GetYear/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 方案管理 - 检索;
// parameters: {"PackId": "long", "Title": "String", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"SolutionId": "long", "PackId": "long", "Title": "String", "ImageUrl": "String", "Target": "String", "Scope": "String", "Days": "int", "ItemQty": "int", "Note": "String", "CreateUserId": "long", "CreateUser": "String", "CreateTime": "String", "State": "int"}
export function COLLEGE_API_SETTINGSOLUTIONBASIC_GETSBYLCB(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingSolutionBasic/GetsByLcb/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 必修课设置 - 其他培训方案列表;
// parameters: {"PackId": "long", "Title": "String", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"SolutionId": "long", "PackId": "long", "Title": "String", "ImageUrl": "String", "Target": "String", "Scope": "String", "Days": "int", "ItemQty": "int", "Note": "String", "CreateUserId": "long", "CreateUser": "String", "CreateTime": "String", "State": "int"}
export function COLLEGE_API_SETTINGSOLUTIONBASIC_GETSBYSTORE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingSolutionBasic/GetsByStore/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 方案管理 - 详情;
// parameters: {id: 'long'}
// response.data.Data: {"SolutionId": "long", "PackId": "long", "Title": "String", "ImageUrl": "String", "Target": "String", "Scope": "String", "Days": "int", "ItemQty": "int", "Note": "String", "CreateUserId": "long", "CreateUser": "String", "CreateTime": "String", "State": "int"}
export function COLLEGE_API_SETTINGSOLUTIONBASIC_GETBYLCB(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingSolutionBasic/GetByLcb/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 必修课设置 - 方案详情;
// parameters: {id: 'long'}
// response.data.Data: {"SolutionId": "long", "PackId": "long", "Title": "String", "ImageUrl": "String", "Target": "String", "Scope": "String", "Days": "int", "ItemQty": "int", "Note": "String", "CreateUserId": "long", "CreateUser": "String", "CreateTime": "String", "State": "int"}
export function COLLEGE_API_SETTINGSOLUTIONBASIC_GETBYSTORE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingSolutionBasic/GetByStore/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 方案管理 - 创建;
// parameters: {"PackId": "long", "Title": "String", "ImageUrl": "String", "Target": "String", "Scope": "String", "Days": "int", "Note": "String"}
// response.data.Data: NULL
export function COLLEGE_API_SETTINGSOLUTIONBASIC_CREATE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingSolutionBasic/Create/',
    method: 'post',
    data: parameters
  })
}
// 管控平台 - 方案管理 - 修改;
// parameters: {"SolutionId": "long", "PackId": "long", "Title": "String", "ImageUrl": "String", "Target": "String", "Scope": "String", "Days": "int", "Note": "String"}
// response.data.Data: NULL
export function COLLEGE_API_SETTINGSOLUTIONBASIC_UPDATE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingSolutionBasic/Update/',
    method: 'post',
    data: parameters
  })
}
// 管控平台 - 方案管理 - 删除;
// parameters: {id: 'long'}
// response.data.Data: NULL
export function COLLEGE_API_SETTINGSOLUTIONBASIC_DELETE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingSolutionBasic/Delete/',
    method: 'post',
    data: parameters
  })
}
// 管控平台 - 方案管理明细 - 检索;
// parameters: {"SolutionId": "long", "InfrastCourseState": "long", "PageIndex": "int", "PageSize": "int"}
// response.data.Data: {"ItemId": "long", "CourseId": "long", "ChannelType": "String", "CourseType": "int", "CourseTitle": "String", "CreateTime": "String", "IsPaper": "int", "SmallName": "String", "LargeName": "String"}
export function COLLEGE_API_SETTINGSOLUTIONITEM_GETSBYLCB(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingSolutionItem/GetsByLcb/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 必修课设置 - 培训方案详情列表;
// parameters: {solutionId: 'long'}
// response.data.Data: {"ItemId": "long", "CourseId": "long", "ChannelType": "String", "CourseType": "int", "CourseTitle": "String", "CreateTime": "String", "IsPaper": "int", "SmallName": "String", "LargeName": "String"}
export function COLLEGE_API_SETTINGSOLUTIONITEM_GETSBYSTORE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingSolutionItem/GetsByStore/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 方案管理明细 - 创建;
// parameters: {"SolutionId": "long", "CourseIds": "String"}
// response.data.Data: NULL
export function COLLEGE_API_SETTINGSOLUTIONITEM_CREATE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingSolutionItem/Create/',
    method: 'post',
    data: parameters
  })
}
// 管控平台 - 方案管理明细 - 删除;
// parameters: {id: 'long'}
// response.data.Data: NULL
export function COLLEGE_API_SETTINGSOLUTIONITEM_DELETE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingSolutionItem/Delete/',
    method: 'post',
    data: parameters
  })
}
// 管控平台 - 方案管理明细 - 排序;
// parameters: {"ItemId": "long", "MoveType": "int"}
// response.data.Data: NULL
export function COLLEGE_API_SETTINGSOLUTIONITEM_SORT(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Setting/SettingSolutionItem/Sort/',
    method: 'post',
    data: parameters
  })
}
// 管控平台 - 广告管理 - 列表;
// parameters: {}
// response.data.Data: {"AdvertId": "long", "LocationType": "int", "OpenType": "int", "ImageUrl": "String", "LinkType": "int", "LinkTitle": "String", "LinkUrl": "String", "LastUserId": "long", "LastUser": "String", "LastTime": "String", "State": "int"}
export function COLLEGE_API_SUSTAINADVERT_GETS(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Sustain/SustainAdvert/Gets/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 科技园动态 - 广告;
// parameters: {}
// response.data.Data: {"AdvertId": "long", "LocationType": "int", "OpenType": "int", "ImageUrl": "String", "LinkType": "int", "LinkTitle": "String", "LinkUrl": "String", "LastUserId": "long", "LastUser": "String", "LastTime": "String", "State": "int"}
export function COLLEGE_API_SUSTAINADVERT_GETSBYSTORE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Sustain/SustainAdvert/GetsByStore/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 广告管理 - 详情;
// parameters: {id: 'long'}
// response.data.Data: {"AdvertId": "long", "LocationType": "int", "OpenType": "int", "ImageUrl": "String", "LinkType": "int", "LinkTitle": "String", "LinkUrl": "String", "LastUserId": "long", "LastUser": "String", "LastTime": "String", "State": "int"}
export function COLLEGE_API_SUSTAINADVERT_GET(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Sustain/SustainAdvert/Get/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 广告管理 - 修改;
// parameters: {"AdvertId": "long", "OpenType": "int", "LinkType": "int", "LinkTitle": "String", "LinkUrl": "String"}
// response.data.Data: NULL
export function COLLEGE_API_SUSTAINADVERT_UPDATE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Sustain/SustainAdvert/Update/',
    method: 'post',
    data: parameters
  })
}
// 管控平台 - 广告管理 - 启用;
// parameters: {id: 'long'}
// response.data.Data: NULL
export function COLLEGE_API_SUSTAINADVERT_ENABLE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Sustain/SustainAdvert/Enable/',
    method: 'post',
    data: parameters
  })
}
// 管控平台 - 广告管理 - 停用;
// parameters: {id: 'long'}
// response.data.Data: NULL
export function COLLEGE_API_SUSTAINADVERT_DISABLE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Sustain/SustainAdvert/Disable/',
    method: 'post',
    data: parameters
  })
}
// 管控平台 - 广告管理 - 修改图片;
// parameters: {"AdvertId": "long", "ImageUrl": "String"}
// response.data.Data: NULL
export function COLLEGE_API_SUSTAINADVERT_UPDATEIMAGE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Sustain/SustainAdvert/UpdateImage/',
    method: 'post',
    data: parameters
  })
}
// 管控平台 - 首页管理 - 列表(专题推荐/系统培训/珠宝学院);
// parameters: {recmtType: 'int'}
// response.data.Data: {"RecmtId": "long", "RecmtType": "int", "SubjectId": "long", "CourseId": "long", "SortId": "int", "CreateUserId": "long", "CreateUser": "String", "CreateTime": "String", "State": "int", "SubjectTitle": "String", "SubjectNote": "String", "SubjectImageUrl": "String", "CourseType": "String", "CourseTitle": "String", "CourseImageUrl": "String", "LargeName": "String", "SmallName": "String"}
export function COLLEGE_API_SUSTAINRECMT_GETS(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Sustain/SustainRecmt/Gets/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 首页管理 - 预览首页-列表(专题推荐/系统培训/珠宝学院);
// parameters: {recmtType: 'int'}
// response.data.Data: {"RecmtId": "long", "RecmtType": "int", "SubjectId": "long", "CourseId": "long", "SortId": "int", "CreateUserId": "long", "CreateUser": "String", "CreateTime": "String", "State": "int", "SubjectTitle": "String", "SubjectNote": "String", "SubjectImageUrl": "String", "CourseType": "String", "CourseTitle": "String", "CourseImageUrl": "String", "LargeName": "String", "SmallName": "String"}
export function COLLEGE_API_SUSTAINRECMT_GETSBYVIEW(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Sustain/SustainRecmt/GetsByView/',
    method: 'get',
    params: parameters
  })
}
// 门店端 - 科技院动态(系统培训/珠宝学院/专题) - 列表;
// parameters: {recmtType: 'int'}
// response.data.Data: {"RecmtId": "long", "RecmtType": "int", "SubjectId": "long", "CourseId": "long", "SortId": "int", "CreateUserId": "long", "CreateUser": "String", "CreateTime": "String", "State": "int", "SubjectTitle": "String", "SubjectNote": "String", "SubjectImageUrl": "String", "CourseType": "String", "CourseTitle": "String", "CourseImageUrl": "String", "LargeName": "String", "SmallName": "String"}
export function COLLEGE_API_SUSTAINRECMT_CACHES(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Sustain/SustainRecmt/Caches/',
    method: 'get',
    params: parameters
  })
}
// 管控平台 - 首页管理 - 添加(专题推荐/系统培训/珠宝学院);
// parameters: {"RecmtType": "int", "SubjectIds": "String", "CourseIds": "String"}
// response.data.Data: NULL
export function COLLEGE_API_SUSTAINRECMT_CREATE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Sustain/SustainRecmt/Create/',
    method: 'post',
    data: parameters
  })
}
// 管控平台 - 首页管理 - 修改(专题推荐/系统培训/珠宝学院);
// parameters: {"RecmtId": "long", "RecmtType": "int", "SubjectId": "long", "CourseId": "long"}
// response.data.Data: NULL
export function COLLEGE_API_SUSTAINRECMT_UPDATE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Sustain/SustainRecmt/Update/',
    method: 'post',
    data: parameters
  })
}
// 管控平台 - 首页管理 - 删除(专题推荐/系统培训/珠宝学院);
// parameters: {id: 'long'}
// response.data.Data: NULL
export function COLLEGE_API_SUSTAINRECMT_DELETE(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Sustain/SustainRecmt/Delete/',
    method: 'post',
    data: parameters
  })
}
// 管控平台 - 首页管理 - 排序;
// parameters: {"RecmtId": "long", "MoveType": "int"}
// response.data.Data: NULL
export function COLLEGE_API_SUSTAINRECMT_SORT(parameters) {
  return fetch({
    cloud: 'College',
    url: '/Sustain/SustainRecmt/Sort/',
    method: 'post',
    data: parameters
  })
}
