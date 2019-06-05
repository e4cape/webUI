import fetch from '@/utilities/fetch'

// 员工奖金方案 - 加载;
export const KPIS_API_BONUS_BASIC_GET = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/bonus_basic/Get',
    method: 'get',
    params: parameters
  })
}
// 员工奖金方案 - 更新;
export const KPIS_API_BONUS_BASIC_UPDATE = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/bonus_basic/Update',
    method: 'post',
    data: parameters
  })
}
// - 检索;
export const KPIS_API_BONUS_ITEM_GETS = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/bonus_item/Gets',
    method: 'get',
    params: parameters
  })
}
// - 检索;
export const KPIS_API_EMPLOYEE_GETS = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/employee/Gets',
    method: 'get',
    params: parameters
  })
}
// 员工排班;
export const KPIS_API_EMPLOYEE_GETSBYSCHEDULES = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/employee/GetsBySchedules',
    method: 'getsbyschedules',
    data: parameters
  })
}
// - 加载;
export const KPIS_API_EMPLOYEE_GET = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/employee/Get',
    method: 'get',
    params: parameters
  })
}
// - 员工资料(设置提成方案);
export const KPIS_API_EMPLOYEE_UPDATEBYRATIO = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/employee/UpdateByRatio',
    method: 'post',
    data: parameters
  })
}
// - 下拉;
export const KPIS_API_EMPLOYEE_EMPLOYEELIST = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/employee/EmployeeList',
    method: 'get',
    params: parameters
  })
}
// 提成方案(详情);
export const KPIS_API_RATIO_BASIC_GET = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/ratio_basic/Get',
    method: 'get',
    params: parameters
  })
}
// - 更新;
export const KPIS_API_RATIO_BASIC_UPDATE = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/ratio_basic/Update',
    method: 'post',
    data: parameters
  })
}
// 员工提成方案明细 - 检索;
export const KPIS_API_RATIO_ITEM_GETS = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/ratio_item/Gets',
    method: 'get',
    params: parameters
  })
}
// 零售单(员工业绩的业绩明细, 员工业绩的零售单列表);
export const KPIS_API_SALE_ORDER_BASIC_GETS = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/sale_order_basic/Gets',
    method: 'get',
    params: parameters
  })
}
// 员工排班 - 检索;
export const KPIS_API_SCHEDULE_GETS = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/schedule/Gets',
    method: 'get',
    params: parameters
  })
}
// 员工排班 - 加载;
export const KPIS_API_SCHEDULE_GET = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/schedule/Get',
    method: 'get',
    params: parameters
  })
}
// 员工排班 - 更新;
export const KPIS_API_SCHEDULE_UPDATE = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/schedule/Update',
    method: 'post',
    data: parameters
  })
}
// 考勤设置 - 加载(缓存);
export const KPIS_API_SETTING_ATTENDANCE_GET = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/setting_attendance/Get',
    method: 'get',
    params: parameters
  })
}
// 考勤设置 - 更新;
export const KPIS_API_SETTING_ATTENDANCE_UPDATE = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/setting_attendance/Update',
    method: 'post',
    data: parameters
  })
}
// 辅助销售设置 - 加载;
export const KPIS_API_SETTING_GUIDE_RATE_GET = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/setting_guide_rate/Get',
    method: 'get',
    params: parameters
  })
}
// 辅助销售设置 - 更新;
export const KPIS_API_SETTING_GUIDE_RATE_UPDATE = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/setting_guide_rate/Update',
    method: 'post',
    data: parameters
  })
}
// - 检索;
export const KPIS_API_SETTING_POSITION_SALARY_BASIC_GETS = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/setting_position_salary_basic/Gets',
    method: 'get',
    params: parameters
  })
}
// 职位工资(详情);
export const KPIS_API_SETTING_POSITION_SALARY_BASIC_GET = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/setting_position_salary_basic/Get',
    method: 'get',
    params: parameters
  })
}
// 职位工资(创建);
export const KPIS_API_SETTING_POSITION_SALARY_BASIC_CREATE = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/setting_position_salary_basic/Create',
    method: 'post',
    data: parameters
  })
}
// 职位工资(更新);
export const KPIS_API_SETTING_POSITION_SALARY_BASIC_UPDATE = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/setting_position_salary_basic/Update',
    method: 'post',
    data: parameters
  })
}
// - 审核(主键行锁);
export const KPIS_API_SETTING_POSITION_SALARY_BASIC_AUDIT = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/setting_position_salary_basic/Audit',
    method: 'post',
    data: parameters
  })
}
// - 审核退回(主键行锁);
export const KPIS_API_SETTING_POSITION_SALARY_BASIC_REJECT = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/setting_position_salary_basic/Reject',
    method: 'post',
    data: parameters
  })
}
// - 作废(主键行锁);
export const KPIS_API_SETTING_POSITION_SALARY_BASIC_ABANDON = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/setting_position_salary_basic/Abandon',
    method: 'post',
    data: parameters
  })
}
// - 检索;
export const KPIS_API_SETTING_POSITION_SALARY_ITEM_GETS = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/setting_position_salary_item/Gets',
    method: 'get',
    params: parameters
  })
}
// - 职位工资(职位的职级列表, 下拉列表);
export const KPIS_API_SETTING_POSITION_SALARY_ITEM_REQS = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/setting_position_salary_item/Reqs',
    method: 'get',
    params: parameters
  })
}
// 员工业绩(列表) ;
export const KPIS_API_SETTLE_ACHIEVE_GUIDE_BASIC_GETS = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_achieve_guide_basic/Gets',
    method: 'get',
    params: parameters
  })
}
// 员工业绩(详情);
export const KPIS_API_SETTLE_ACHIEVE_GUIDE_BASIC_GET = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_achieve_guide_basic/Get',
    method: 'get',
    params: parameters
  })
}
// - ;
export const KPIS_API_SETTLE_ACHIEVE_GUIDE_BASIC_REQ = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_achieve_guide_basic/Req',
    method: 'get',
    params: parameters
  })
}
// - ;
export const KPIS_API_SETTLE_ACHIEVE_GUIDE_BASIC_CREATE = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_achieve_guide_basic/Create',
    method: 'post',
    data: parameters
  })
}
// - 检索;
export const KPIS_API_SETTLE_ACHIEVE_GUIDE_ITEM_GETS = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_achieve_guide_item/Gets',
    method: 'get',
    params: parameters
  })
}
// - 检索;
export const KPIS_API_SETTLE_ATTENDANCE_BASIC_GETS = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_attendance_basic/Gets',
    method: 'get',
    params: parameters
  })
}
// 员工考勤(详情);
export const KPIS_API_SETTLE_ATTENDANCE_BASIC_GET = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_attendance_basic/Get',
    method: 'get',
    params: parameters
  })
}
// - 创建;
export const KPIS_API_SETTLE_ATTENDANCE_BASIC_CREATE = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_attendance_basic/Create',
    method: 'post',
    data: parameters
  })
}
// - 更新;
export const KPIS_API_SETTLE_ATTENDANCE_BASIC_UPDATE = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_attendance_basic/Update',
    method: 'post',
    data: parameters
  })
}
// - 审核(主键行锁);
export const KPIS_API_SETTLE_ATTENDANCE_BASIC_AUDIT = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_attendance_basic/Audit',
    method: 'post',
    data: parameters
  })
}
// - 员工月度考勤结算单拒绝;
export const KPIS_API_SETTLE_ATTENDANCE_BASIC_REJECT = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_attendance_basic/Reject',
    method: 'post',
    data: parameters
  })
}
// - 作废(主键行锁);
export const KPIS_API_SETTLE_ATTENDANCE_BASIC_ABANDON = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_attendance_basic/Abandon',
    method: 'post',
    data: parameters
  })
}
// - 检索;
export const KPIS_API_SETTLE_ATTENDANCE_ITEM_GETS = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_attendance_item/Gets',
    method: 'get',
    params: parameters
  })
}
// - 加载;
export const KPIS_API_SETTLE_ATTENDANCE_ITEM_GET = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_attendance_item/Get',
    method: 'get',
    params: parameters
  })
}
// - 创建;
export const KPIS_API_SETTLE_BONUS_BASIC_CREATE = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_bonus_basic/Create',
    method: 'post',
    data: parameters
  })
}
// - 检索;
export const KPIS_API_SETTLE_BONUS_ITEM_GETS = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_bonus_item/Gets',
    method: 'get',
    params: parameters
  })
}
// - 加载;
export const KPIS_API_SETTLE_POSITION_SALARY_REQ = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_position_salary/Req',
    method: 'get',
    params: parameters
  })
}
// - 创建;
export const KPIS_API_SETTLE_POSITION_SALARY_CREATE = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_position_salary/Create',
    method: 'post',
    data: parameters
  })
}
// - 检索;
export const KPIS_API_SETTLE_PREPARE_BILL_GETS = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_prepare_bill/Gets',
    method: 'get',
    params: parameters
  })
}
// - 创建;
export const KPIS_API_SETTLE_PREPARE_BILL_CREATE = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_prepare_bill/Create',
    method: 'post',
    data: parameters
  })
}
// - 加载;
export const KPIS_API_SETTLE_RATIO_BASIC_REQ = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_ratio_basic/Req',
    method: 'get',
    params: parameters
  })
}
// - 创建;
export const KPIS_API_SETTLE_RATIO_BASIC_CREATE = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_ratio_basic/Create',
    method: 'post',
    data: parameters
  })
}
// - 检索;
export const KPIS_API_SETTLE_RATIO_ITEM_GETS = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_ratio_item/Gets',
    method: 'get',
    params: parameters
  })
}
// - 检索;
export const KPIS_API_SETTLE_SALARY_BASIC_GETS = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_salary_basic/Gets',
    method: 'get',
    params: parameters
  })
}
// - 加载;
export const KPIS_API_SETTLE_SALARY_BASIC_GET = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_salary_basic/Get',
    method: 'get',
    params: parameters
  })
}
// - 创建;
export const KPIS_API_SETTLE_SALARY_BASIC_CREATE = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_salary_basic/Create',
    method: 'post',
    data: parameters
  })
}
// - 更新;
export const KPIS_API_SETTLE_SALARY_BASIC_UPDATE = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_salary_basic/Update',
    method: 'post',
    data: parameters
  })
}
// - 审核(主键行锁);
export const KPIS_API_SETTLE_SALARY_BASIC_AUDIT = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_salary_basic/Audit',
    method: 'post',
    data: parameters
  })
}
// - 审核退回(主键行锁);
export const KPIS_API_SETTLE_SALARY_BASIC_REJECT = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_salary_basic/Reject',
    method: 'post',
    data: parameters
  })
}
// - 作废(主键行锁);
export const KPIS_API_SETTLE_SALARY_BASIC_ABANDON = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_salary_basic/Abandon',
    method: 'post',
    data: parameters
  })
}
// - 导出报表;
export const KPIS_API_SETTLE_SALARY_BASIC_SALARYEXPORT = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_salary_basic/SalaryExport',
    method: 'post',
    data: parameters
  })
}
// - 检索;
export const KPIS_API_SETTLE_SALARY_ITEM_GETS = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_salary_item/Gets',
    method: 'get',
    params: parameters
  })
}
// - 加载;
export const KPIS_API_SETTLE_SALARY_ITEM_GET = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_salary_item/Get',
    method: 'get',
    params: parameters
  })
}
// - 加载;
export const KPIS_API_SETTLE_SALARY_ITEM_REQ = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_salary_item/Req',
    method: 'get',
    params: parameters
  })
}
// - 导出报表;
export const KPIS_API_SETTLE_SALARY_ITEM_SALARYDETAILEXPORT = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_salary_item/SalaryDetailExport',
    method: 'post',
    data: parameters
  })
}
// - 加载;
export const KPIS_API_SETTLE_WAGER_BASIC_REQ = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_wager_basic/Req',
    method: 'get',
    params: parameters
  })
}
// - };
export const KPIS_API_SETTLE_WAGER_BASIC_CREATE = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/settle_wager_basic/Create',
    method: 'post',
    data: parameters
  })
}
// - 检索;
export const KPIS_API_WAGER_GETS = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/wager/Gets',
    method: 'get',
    params: parameters
  })
}
// - 加载;
export const KPIS_API_WAGER_GET = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/wager/Get',
    method: 'get',
    params: parameters
  })
}
// - 加载;
export const KPIS_API_WAGER_GETBYDEPID = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/wager/GetByDepId',
    method: 'get',
    params: parameters
  })
}
// - 创建;
export const KPIS_API_WAGER_CREATE = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/wager/Create',
    method: 'post',
    data: parameters
  })
}
// - 更新;
export const KPIS_API_WAGER_UPDATE = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/wager/Update',
    method: 'post',
    data: parameters
  })
}
// - 审核(主键行锁);
export const KPIS_API_WAGER_AUDIT = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/wager/Audit',
    method: 'post',
    data: parameters
  })
}
// - 审核退回(主键行锁);
export const KPIS_API_WAGER_REJECT = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/wager/Reject',
    method: 'post',
    data: parameters
  })
}
// - 作废(主键行锁);
export const KPIS_API_WAGER_ABANDON = (parameters) => {
  return fetch({
    cloud: 'Kpis',
    url: '/wager/Abandon',
    method: 'post',
    data: parameters
  })
}