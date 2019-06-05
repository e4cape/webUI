// 薪酬绩效 -- 员工管理
const employeeList = () => import('@/views/performance/employee/employeeList')
const employeeDetail = () => import('@/views/performance/employee/employeeDetail')
const achievementList = () => import('@/views/performance/employee/achievementList')
const achievementDetail = () => import('@/views/performance/employee/achievementDetail')
const attendanceList = () => import('@/views/performance/employee/attendanceList')
const attendanceDetail = () => import('@/views/performance/employee/attendanceDetail')
const attendanceCreate = () => import('@/views/performance/employee/attendanceCreate')
const salaryList = () => import('@/views/performance/employee/salaryList')
const salaryCreate = () => import('@/views/performance/employee/salaryCreate')
const salaryDetail = () => import('@/views/performance/employee/salaryDetail')
// 薪酬绩效 -- 设置
const postsalaryList = () => import('@/views/performance/setting/postsalaryList')
const postsalaryCreate = () => import('@/views/performance/setting/postsalaryCreate')
const postsalaryEdit = () => import('@/views/performance/setting/postsalaryEdit')
const settingAttendanceDetail = () => import('@/views/performance/setting/attendanceDetail')
const Auxiliary = () => import('@/views/performance/setting/auxiliary')

// 薪酬绩效 -- 排班
const schedulingList = () => import('@/views/performance/scheduling/schedulingList')

// 薪酬绩效 -- 对赌
const wagerList = () => import('@/views/performance/wager/wagerList')
const wagerCreate = () => import('@/views/performance/wager/wagerCreate')
const wagerEdit = () => import('@/views/performance/wager/wagerEdit')

// 薪酬绩效 -- 奖金
const targetBonus = () => import('@/views/performance/bonus/targetBonus')
const ortherBonus = () => import('@/views/performance/bonus/otherBonus')

// 薪酬绩效 -- 提成
const manager = () => import('@/views/performance/commission/manager')
const shopOwner = () => import('@/views/performance/commission/shopOwner')
const steering = () => import('@/views/performance/commission/steering')
const guide = () => import('@/views/performance/commission/guide')
const cashier = () => import('@/views/performance/commission/cashier')
const about = () => import('@/views/performance/commission/about')

const basePath = '/performance'

export default [
  // 薪酬绩效--员工
  {
    path: `${basePath}/employee/employeelist`,
    component: employeeList,
    meta: {
      name: '员工管理'
    }
  },
  {
    name: '员工管理详情',
    path: `${basePath}/employee/employeedetail/:id`,
    component: employeeDetail,
    meta: {
      parentPath: `${basePath}/employee/employeelist`
    }
  },
  {
    name: '绩效管理',
    path: `${basePath}/employee/achievementlist`,
    component: achievementList
  },
  {
    name: '绩效管理详情',
    path: `${basePath}/employee/achievementdetail/:id`,
    component: achievementDetail,
    meta: {
      parentPath: `${basePath}/employee/achievementlist`
    }
  },
  {
    name: '员工考勤',
    path: `${basePath}/employee/attendancelist`,
    component: attendanceList
  },
  {
    name: '新建员工考勤',
    path: `${basePath}/employee/attendancecreate/:id`,
    component: attendanceCreate,
    meta: {
      parentPath: `${basePath}/employee/attendancelist`
    }
  },
  {
    name: '编辑员工考勤',
    path: `${basePath}/employee/attendanceedit/:id`,
    component: attendanceCreate,
    meta: {
      parentPath: `${basePath}/employee/attendancelist`
    }
  },
  {
    name: '员工考勤详情',
    path: `${basePath}/employee/attendancedetail/:id`,
    component: attendanceDetail,
    meta: {
      parentPath: `${basePath}/employee/attendancelist`
    }
  },
  {
    name: '员工工资',
    path: `${basePath}/employee/salarylist`,
    component: salaryList
  },
  {
    name: '生成工资表',
    path: `${basePath}/employee/salarycreate/:id`,
    component: salaryCreate,
    meta: {
      parentPath: `${basePath}/employee/salarylist`
    }
  },
  {
    name: '修改工资表',
    path: `${basePath}/employee/salaryedit/:id`,
    component: salaryCreate,
    meta: {
      parentPath: `${basePath}/employee/salarylist`
    }
  },
  {
    name: '员工工资详情',
    path: `${basePath}/employee/salarydetail/:id`,
    component: salaryDetail,
    meta: {
      parentPath: `${basePath}/employee/salarylist`
    }
  },
  // 薪酬绩效--设置
  {
    name: '职位工资',
    path: `${basePath}/setting/postsalarylist`,
    component: postsalaryList
  },
  {
    name: '新增职位工资',
    path: `${basePath}/setting/postsalarycreate`,
    component: postsalaryCreate,
    meta: {
      parentPath: `${basePath}/setting/postsalarylist`
    }
  },
  {
    name: '编辑职位工资',
    path: `${basePath}/setting/postsalaryedit/:id`,
    component: postsalaryEdit,
    meta: {
      parentPath: `${basePath}/setting/postsalarylist`
    }
  },
  {
    name: '考勤设置',
    path: `${basePath}/setting/attendancedetail`,
    component: settingAttendanceDetail
  },
  {
    name: '辅助设置',
    path: `${basePath}/setting/auxiliary`,
    component: Auxiliary
  },
  // 薪酬绩效--排班
  {
    name: '排班管理',
    path: `${basePath}/scheduling/schedulinglist`,
    component: schedulingList
  },
  // 薪酬绩效--对赌
  {
    name: '业绩对赌',
    path: `${basePath}/wager/wagerlist`,
    component: wagerList
  },
  {
    name: '新增业绩对赌',
    path: `${basePath}/wager/wagercreate`,
    component: wagerCreate,
    meta: {
      parentPath: `${basePath}/wager/wagerlist`
    }
  },
  {
    name: '编辑业绩对赌',
    path: `${basePath}/wager/wageredit/:id`,
    component: wagerEdit,
    meta: {
      parentPath: `${basePath}/wager/wagerlist`
    }
  },
  // 薪酬绩效--奖金
  {
    name: '目标奖金',
    path: `${basePath}/bonus/targetbonus`,
    component: targetBonus
  },
  {
    name: '个人大单奖',
    path: `${basePath}/bonus/otherbonus`,
    component: ortherBonus
  },
  // 薪酬绩效--提成
  {
    name: '经理提成方案',
    path: `${basePath}/commission/manager`,
    component: manager
  },
  {
    name: '店长提成方案',
    path: `${basePath}/commission/shopowner`,
    component: shopOwner
  },
  {
    name: '督导提成方案',
    path: `${basePath}/commission/steering`,
    component: steering
  },
  {
    name: '导购提成方案',
    path: `${basePath}/commission/guide`,
    component: guide
  },
  {
    name: '收银员提成方案',
    path: `${basePath}/commission/cashier`,
    component: cashier
  },
  {
    name: '职位提点测算表',
    path: `${basePath}/commission/about/:position`,
    component: about,
    meta: {
      parentPath: `${basePath}/commission/manager`
    },
    beforeEnter: (to, from, next) => {
      // clg
      if (to.params.position === 'manager') {
        to.meta.parentPath = `${basePath}/commission/manager`
      } else if (to.params.position === 'shopowner') {
        to.meta.parentPath = `${basePath}/commission/shopowner`
      } else if (to.params.position === 'steering') {
        to.meta.parentPath = `${basePath}/commission/steering`
      } else if (to.params.position === 'guide') {
        to.meta.parentPath = `${basePath}/commission/guide`
      } else if (to.params.position === 'cashier') {
        to.meta.parentPath = `${basePath}/commission/cashier`
      }
      next()
    }
  }
]
