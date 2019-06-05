// 内容管理
// -系统培训管理
const sysTraining = () =>
  import('@/views/science/sysTraining/index.vue')
// --文档详情
const sysTrainingDocDetail = () =>
  import('@/views/science/sysTraining/docDetail')
// --视频详情
const sysTrainingVideoDetail = () =>
  import('@/views/science/sysTraining/videoDetail')
// --编辑文档
const sysTrainingDocEdit = () =>
  import('@/views/science/sysTraining/docEdit')
// --编辑视频
const sysTrainingVideoEdit = () =>
  import('@/views/science/sysTraining/videoEdit')
// -珠宝学院管理
const jewelryCollege = () =>
  import('@/views/science/jewelryCollege/index.vue')
// --文档详情
const jewelryCollegeDocDetail = () =>
  import('@/views/science/jewelryCollege/docDetail')
// --视频详情
const jewelryCollegeVideoDetail = () =>
  import('@/views/science/jewelryCollege/videoDetail')
// --编辑文档
const jewelryCollegeDocEdit = () =>
  import('@/views/science/jewelryCollege/docEdit')
// --编辑视频
const jewelryCollegeVideoEdit = () =>
  import('@/views/science/jewelryCollege/videoEdit')

// -专题管理
const topic = () => import('@/views/science/topic/index')
const topicDetail = () =>
  import('@/views/science/topic/detail')
const topicEdit = () => import('@/views/science/topic/edit')

// -方案管理
const plan = () => import('@/views/science/plan/index')
const planDetail = () => import('@/views/science/plan/detail')
const planEdit = () => import('@/views/science/plan/edit')

// -套餐管理
const packages = () => import('@/views/science/packages.vue')

// -分类管理
const categories = () =>
  import('@/views/science/categories')
const college = () =>
  import('@/views/science/categories/college.vue')
const system = () =>
  import('@/views/science/categories/system.vue')

// -视频库
const videoDatabase = () => import('@/views/science/videoDatabase/index.vue')
// --上传视频
const videoUp = () => import('@/views/science/videoDatabase/videoUp.vue')
// --视频库操作日志
const videoLogs = () => import('@/views/science/videoDatabase/videoLogs.vue')

// 页面管理
// -首页管理
const indexManage = () => import('@/views/science/indexManage/index.vue')
// --预览首页
const preview = () => import('@/views/science/indexManage/preview.vue')
// -广告管理
const adManage = () => import('@/views/science/adManage.vue')

// 客户管理
// -门店套餐管理
const shopPackage = () =>
  import('@/views/science/shopPackage/index.vue')
// --交易记录
const tradingRecord = () =>
  import('@/views/science/shopPackage/tradingRecord')
// -订单管理
const orderManagement = () =>
  import('@/views/science/order.vue')

// 统计报表
// -课程报表
const courseReport = () => import('@/views/science/courseReport')
// -专题报表
const topicReport = () => import('@/views/science/topicReport')
// -考试报表
const examinationReport = () =>
  import('@/views/science/examinationReport')
// -科技院交易报表
const tradeReport = () => import('@/views/science/tradeReport')

// 门店端，科技院动态
const dynamic = () => import('@/views/science/dynamic/index.vue')
// 系统培训
const systematicTrain = () =>
  import('@/views/science/systematicTrain/index.vue')
// 查看文章视频
const videoCheck = () => import('@/views/science/learning/videoCheck.vue')
// 考试或者重新考试
const examination = () => import('@/views/science/learning/examination.vue')
// 珠宝学院
const instituteJewelry = () =>
  import('@/views/science/instituteJewelry/index.vue')
// 专题推荐
const lively = () => import('@/views/science/lively/index.vue')
const livelyCheck = () => import('@/views/science/lively/livelyCheck.vue')
// 我的必修课
const requiredCourse = () => import('@/views/science/requiredCourse/index')
// 必修课设置
const reqCourSetting = () =>
  import('@/views/science/requiredSetting/setting.vue')
// 必修课完成情况
const performance = () =>
  import('@/views/science/requiredCourse/performance.vue')
const accordingStaff = () =>
  import('@/views/science/requiredCourse/accordingStaff.vue')
const accordingCourse = () =>
  import('@/views/science/requiredCourse/accordingCourse.vue')
// 考试记录
const testRecords = () => import('@/views/science/testRecords/index.vue')
// 查看试卷
const testCheck = () => import('@/views/science/testRecords/testCheck.vue')

const basePath = '/science'
export default [
  {
    path: `${basePath}/sysTraining/index`,
    component: sysTraining,
    name: '系统培训管理'
  },
  {
    path: `${basePath}/sysTraining/docDetail`,
    component: sysTrainingDocDetail,
    meta: {
      name: '文档详情',
      parentPath: `${basePath}/sysTraining`
    }
  },
  {
    path: `${basePath}/sysTraining/videoDetail`,
    component: sysTrainingVideoDetail,
    meta: {
      name: '视频详情',
      parentPath: `${basePath}/sysTraining`
    }
  },
  {
    path: `${basePath}/sysTraining/docEdit`,
    component: sysTrainingDocEdit,
    meta: {
      name: '编辑文档',
      parentPath: `${basePath}/sysTraining`
    }
  },
  {
    path: `${basePath}/sysTraining/videoEdit`,
    component: sysTrainingVideoEdit,
    meta: {
      name: '编辑视频',
      parentPath: `${basePath}/sysTraining`
    }
  },
  {
    path: `${basePath}/jewelryCollege/index`,
    component: jewelryCollege,
    name: '珠宝学院管理'
  },
  {
    path: `${basePath}/jewelryCollege/docDetail`,
    component: jewelryCollegeDocDetail,
    meta: {
      name: '文档详情',
      parentPath: `${basePath}/jewelryCollege`
    }
  },
  {
    path: `${basePath}/jewelryCollege/videoDetail`,
    component: jewelryCollegeVideoDetail,
    meta: {
      name: '视频详情',
      parentPath: `${basePath}/jewelryCollege`
    }
  },
  {
    path: `${basePath}/jewelryCollege/docEdit`,
    component: jewelryCollegeDocEdit,
    meta: {
      name: '编辑文档',
      parentPath: `${basePath}/jewelryCollege`
    }
  },
  {
    path: `${basePath}/jewelryCollege/videoEdit`,
    component: jewelryCollegeVideoEdit,
    meta: {
      name: '编辑视频',
      parentPath: `${basePath}/jewelryCollege`
    }
  },
  {
    path: `${basePath}/topic/index`,
    component: topic,
    name: '专题管理'
  },
  {
    path: `${basePath}/topic/detail`,
    component: topicDetail,
    name: '专题详情',
    meta: {
      name: '专题详情',
      parentPath: `${basePath}/topic`
    }
  },
  {
    path: `${basePath}/topic/edit`,
    component: topicEdit,
    name: '编辑专题',
    meta: {
      name: '编辑专题',
      parentPath: `${basePath}/topic`
    }
  },
  {
    path: `${basePath}/plan/index`,
    component: plan,
    name: '方案管理'
  },
  {
    path: `${basePath}/plan/detail`,
    component: planDetail,
    name: '方案详情',
    meta: {
      name: '方案详情',
      parentPath: `${basePath}/plan`
    }
  },
  {
    path: `${basePath}/plan/edit`,
    component: planEdit,
    name: '编辑方案',
    meta: {
      name: '编辑方案',
      parentPath: `${basePath}/plan`
    }
  },
  {
    path: `${basePath}/packages`,
    component: packages,
    name: '套餐管理'
  },
  {
    path: `${basePath}/categories`,
    component: categories,
    name: '分类管理',
    children: [
      {
        path: '',
        redirect: 'college'
      },
      {
        path: 'college',
        component: college,
        name: '分类管理-珠宝学院',
        meta: {
          parentPath: `${basePath}/categories/college`
        }
      },
      {
        path: 'system',
        component: system,
        name: '分类管理-系统培训',
        meta: {
          parentPath: `${basePath}/categories/system`
        }
      }
    ]
  },
  {
    path: `${basePath}/videoDatabase/index`,
    component: videoDatabase,
    name: '视频库'
  },
  {
    path: `${basePath}/videoDatabase/videoUp`,
    component: videoUp,
    name: '上传视频'
  },
  {
    path: `${basePath}/videoDatabase/videoLogs`,
    component: videoLogs,
    name: '视频库操作日志'
  },
  {
    path: `${basePath}/indexManage/index`,
    component: indexManage,
    name: '首页管理'
  },
  {
    path: `${basePath}/indexManage/preview`,
    component: preview,
    name: '预览首页',
    meta: {
      parentPath: `${basePath}/indexManage`
    }
  },
  {
    path: `${basePath}/adManage`,
    component: adManage,
    name: '广告管理'
  },
  {
    path: `${basePath}/shopPackage/index`,
    component: shopPackage,
    name: '门店套餐管理'
  },
  {
    path: `${basePath}/shopPackage/tradingRecord`,
    component: tradingRecord,
    name: '门店套餐交易记录',
    meta: {
      parentPath: `${basePath}/shopPackage`
    }
  },
  {
    path: `${basePath}/order`,
    component: orderManagement,
    name: '订单管理'
  },
  {
    path: `${basePath}/courseReport`,
    component: courseReport,
    name: '课程报表'
  },
  {
    path: `${basePath}/topicReport`,
    component: topicReport,
    name: '专题报表'
  },
  {
    path: `${basePath}/examinationReport`,
    component: examinationReport,
    name: '考试报表'
  },

  {
    path: `${basePath}/tradeReport`,
    component: tradeReport,
    name: '科技院交易报表'
  },
  // 门店端
  {
    path: `${basePath}/dynamic/index`,
    component: dynamic,
    name: '科技院动态'
  },
  // 文章，视频学习
  {
    path: `${basePath}/videoCheck`,
    component: videoCheck,
    name: '学习',
    beforeEnter: (to, from, next) => {
      to.meta.name = to.query.name || '课程'
      next()
    },
  },
  // 考试
  {
    path: `${basePath}/examination`,
    component: examination,
    name: '考试'
  },
  {
    path: `${basePath}/systematicTrain/index`,
    component: systematicTrain,
    name: '系统培训'
  },
  {
    path: `${basePath}/instituteJewelry/index`,
    component: instituteJewelry,
    name: '珠宝学院'
  },
  {
    path: `${basePath}/lively/index`,
    component: lively,
    name: '专题推荐'
  },
  {
    path: `${basePath}/lively/livelyCheck`,
    component: livelyCheck,
    name: '专题详情 ',
    meta: {
      parentPath: `${basePath}/lively/index`
    }
  },
  {
    path: `${basePath}/requiredCourse/index`,
    component: requiredCourse,
    name: '我的必修课'
  },
  {
    path: `${basePath}/requiredCourse/setting`,
    component: reqCourSetting,
    name: '必修课设置'
  },
  {
    path: `${basePath}/testRecords/index`,
    component: testRecords,
    name: '考试记录'
  },
  {
    path: `${basePath}/testRecords/testCheck`,
    component: testCheck,
    name: '查看试卷'
  },
  {
    path: `${basePath}/requiredCourse`,
    component: performance,
    children: [
      {
        path: 'accordingStaff',
        component: accordingStaff,
        name: '必修课完成情况',
        meta: {
          parentPath: `${basePath}/requiredCourse/performance`
        }
      },
      {
        path: 'accordingCourse',
        component: accordingCourse,
        name: '必修课完成情况 ',
        meta: {
          parentPath: `${basePath}/requiredCourse/performance`
        }
      }
    ]
  }
]
