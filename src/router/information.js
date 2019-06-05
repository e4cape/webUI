// 数据中心
// 采购报表
// const purchaseReport = () => import('@/views/information/purchaseReport/index')
// const arrivalProduct = () => import('@/views/information/purchaseReport/arrivalProduct')
// const semiProduct = () => import('@/views/information/purchaseReport/semiProduct')
// const inventoryProduct = () => import('@/views/information/purchaseReport/inventoryProduct')
// 库存报表
const inventorReport = () => import('@/views/information/inventorReport/index')
const inventorReportAge = () =>
  import('@/views/information/inventorReport/inventorAge')
const inventorReportBoard = () =>
  import('@/views/information/inventorReport/inventorBoard')
// const inventorReportDetail = () => import('@/views/information/inventorReport/inventorDetail')
const inventorReportStatics = () =>
  import('@/views/information/inventorReport/inventorStatics')
const inventorReportTurn = () =>
  import('@/views/information/inventorReport/inventorTurn')
// 销售报表
const saleReport = () => import('@/views/information/saleReport/index')
const saleReportTrend = () => import('@/views/information/saleReport/saleTrend')
const saleReportBoard = () => import('@/views/information/saleReport/saleBoard')
const saleReportDetail = () =>
  import('@/views/information/saleReport/saleDetail')
const saleReportStatics = () =>
  import('@/views/information/saleReport/saleStatics')
const saleReportDay = () => import('@/views/information/saleReport/saleDay')
// 利润报表
const profitReport = () => import('@/views/information/profitReport/index')
const profitReportDetail = () =>
  import('@/views/information/profitReport/profitDetail')
const profitReportTrend = () =>
  import('@/views/information/profitReport/profitTrend')
// 财务报表
const financeReport = () => import('@/views/information/financeReport/index')
const financeReportDay = () =>
  import('@/views/information/financeReport/financeDay')
const financeReportWeek = () =>
  import('@/views/information/financeReport/financeWeek')
const financeReportMonth = () =>
  import('@/views/information/financeReport/financeMonth')
const financeReportQuarter = () =>
  import('@/views/information/financeReport/financeQuarter')
const financeReportYear = () =>
  import('@/views/information/financeReport/financeYear')
// 进销存报表
// const stockSalesReport = () => import('@/views/information/stockSalesReport/index')
// 数据分析
// 库存分析
const inventorAnalysis = () =>
  import('@/views/information/inventorAnalysis/index')
const inventorAnalysisQuantity = () =>
  import('@/views/information/inventorAnalysis/inventorQuantity')
const inventorAnalysisStuff = () =>
  import('@/views/information/inventorAnalysis/inventorStuff')
const inventorAnalysisTurn = () =>
  import('@/views/information/inventorAnalysis/inventorTurn')
const inventorAnalysisWeight = () =>
  import('@/views/information/inventorAnalysis/inventorWeight')
// const inventorAnalysisRational = () => import('@/views/information/inventorAnalysis/inventorRational')
// 销售分析
const saleAnalysis = () => import('@/views/information/saleAnalysis/index')
const saleAnalysisQuantity = () =>
  import('@/views/information/saleAnalysis/saleQuantity')
const saleAnalysisStuff = () =>
  import('@/views/information/saleAnalysis/saleStuff')
const saleAnalysisPayment = () =>
  import('@/views/information/saleAnalysis/salePayment')
const saleAnalysisWeight = () =>
  import('@/views/information/saleAnalysis/saleWeight')
// 利润分析
const profitAnalysis = () => import('@/views/information/profitAnalysis/index')
const profitAnalysisPortion = () =>
  import('@/views/information/profitAnalysis/profitPortion')
const profitAnalysisTrend = () =>
  import('@/views/information/profitAnalysis/profitTrend')
// 财务分析
const financeAnalysis = () =>
  import('@/views/information/financeAnalysis/index')
const financeInOut = () =>
  import('@/views/information/financeAnalysis/financeInOut')
// 自定义报表

const basePath = '/information'

export default [
  // {
  //   path: `${basePath}/purchaseReport`,
  //   component: purchaseReport,
  //   children: [{
  //     path: '',
  //     redirect: 'arrivalProduct'
  //   }, {
  //     path: 'arrivalProduct',
  //     component: arrivalProduct,
  //     meta: {
  //       parentPath: `${basePath}/purchaseReport`,
  //       name: '采购报表'
  //     }
  //   }, {
  //     path: 'semiProduct',
  //     component: semiProduct,
  //     meta: {
  //       parentPath: `${basePath}/purchaseReport`,
  //       name: '采购报表'
  //     }
  //   }, {
  //     path: 'inventoryProduct',
  //     component: inventoryProduct,
  //     meta: {
  //       parentPath: `${basePath}/purchaseReport`,
  //       name: '采购报表'
  //     }
  //   }]
  // },
  {
    path: `${basePath}/inventorReport`,
    component: inventorReport,
    children: [
      {
        path: '',
        redirect: 'inventorBoard'
      },
      {
        path: 'inventorBoard',
        component: inventorReportBoard,
        meta: {
          parentPath: `${basePath}/inventorReport`,
          name: '库存报表'
        }
      },
      {
        path: 'inventorStatics',
        component: inventorReportStatics,
        meta: {
          parentPath: `${basePath}/inventorReport`,
          name: '库存报表'
        }
      },
      {
        path: 'inventorAge',
        component: inventorReportAge,
        meta: {
          parentPath: `${basePath}/inventorReport`,
          name: '库存报表'
        }
      },
      {
        path: 'inventorTurn',
        component: inventorReportTurn,
        meta: {
          parentPath: `${basePath}/inventorReport`,
          name: '库存报表'
        }
      }
      // {
      //   path: 'inventorDetail',
      //   component: inventorReportDetail,
      //   meta: {
      //     parentPath: `${basePath}/inventorReport`,
      //     name: '库存报表'
      //   }
      // }
    ]
  },
  {
    path: `${basePath}/saleReport`,
    component: saleReport,
    children: [
      {
        path: '',
        redirect: 'saleBoard'
      },
      {
        path: 'saleBoard',
        component: saleReportBoard,
        meta: {
          parentPath: `${basePath}/saleReport`,
          name: '销售报表'
        }
      },
      {
        path: 'saleStatics',
        component: saleReportStatics,
        meta: {
          parentPath: `${basePath}/saleReport`,
          name: '销售报表'
        }
      },
      {
        path: 'saleTrend',
        component: saleReportTrend,
        meta: {
          parentPath: `${basePath}/saleReport`,
          name: '销售报表'
        }
      },
      {
        path: 'saleDay',
        component: saleReportDay,
        meta: {
          parentPath: `${basePath}/saleReport`,
          name: '销售报表'
        }
      },
      {
        path: 'saleDetail',
        component: saleReportDetail,
        meta: {
          parentPath: `${basePath}/saleReport`,
          name: '销售报表'
        }
      }
    ]
  },
  {
    path: `${basePath}/profitReport`,
    component: profitReport,
    children: [
      {
        path: '',
        redirect: 'profitTrend'
      },
      {
        path: 'profitDetail',
        component: profitReportDetail,
        meta: {
          parentPath: `${basePath}/profitReport`,
          name: '利润报表'
        }
      },
      {
        path: 'profitTrend',
        component: profitReportTrend,
        meta: {
          parentPath: `${basePath}/profitReport`,
          name: '利润报表'
        }
      }
    ]
  },
  {
    path: `${basePath}/financeReport`,
    component: financeReport,
    children: [
      {
        path: '',
        redirect: 'financeDay'
      },
      {
        path: 'financeDay',
        component: financeReportDay,
        meta: {
          parentPath: `${basePath}/financeReport`,
          name: '财务报表'
        }
      },
      {
        path: 'financeWeek',
        component: financeReportWeek,
        meta: {
          parentPath: `${basePath}/financeReport`,
          name: '财务报表'
        }
      },
      {
        path: 'financeMonth',
        component: financeReportMonth,
        meta: {
          parentPath: `${basePath}/financeReport`,
          name: '财务报表'
        }
      },
      {
        path: 'financeQuarter',
        component: financeReportQuarter,
        meta: {
          parentPath: `${basePath}/financeReport`,
          name: '财务报表'
        }
      },
      {
        path: 'financeYear',
        component: financeReportYear,
        meta: {
          parentPath: `${basePath}/financeReport`,
          name: '财务报表'
        }
      }
    ]
  },
  // {
  //   path: `${basePath}/stockSalesReport`,
  //   component: stockSalesReport,
  //   name: '进销存报表',
  //   meta: {
  //     parentPath: `${basePath}/stockSalesReport`
  //   }
  // },
  {
    path: `${basePath}/inventorAnalysis`,
    component: inventorAnalysis,
    children: [
      {
        path: '',
        redirect: 'inventorQuantity'
      },
      {
        path: 'inventorQuantity',
        component: inventorAnalysisQuantity,
        meta: {
          parentPath: `${basePath}/inventorAnalysis`,
          name: '库存分析'
        }
      },
      {
        path: 'inventorWeight',
        component: inventorAnalysisWeight,
        meta: {
          parentPath: `${basePath}/inventorAnalysis`,
          name: '库存分析'
        }
      },
      {
        path: 'inventorStuff',
        component: inventorAnalysisStuff,
        meta: {
          parentPath: `${basePath}/inventorAnalysis`,
          name: '库存分析'
        }
      },
      {
        path: 'inventorTurn',
        component: inventorAnalysisTurn,
        meta: {
          parentPath: `${basePath}/inventorAnalysis`,
          name: '库存分析'
        }
      }
      // {
      //   path: 'inventorRational',
      //   component: inventorAnalysisRational,
      //   meta: {
      //     parentPath: `${basePath}/inventorAnalysis`,
      //     name: '库存分析'
      //   }
      // }
    ]
  },
  {
    path: `${basePath}/saleAnalysis`,
    component: saleAnalysis,
    children: [
      {
        path: '',
        redirect: 'saleQuantity'
      },
      {
        path: 'saleQuantity',
        component: saleAnalysisQuantity,
        meta: {
          parentPath: `${basePath}/saleAnalysis`,
          name: '销售分析'
        }
      },
      {
        path: 'saleWeight',
        component: saleAnalysisWeight,
        meta: {
          parentPath: `${basePath}/saleAnalysis`,
          name: '销售分析'
        }
      },
      {
        path: 'saleStuff',
        component: saleAnalysisStuff,
        meta: {
          parentPath: `${basePath}/saleAnalysis`,
          name: '销售分析'
        }
      },
      {
        path: 'salePayment',
        component: saleAnalysisPayment,
        meta: {
          parentPath: `${basePath}/saleAnalysis`,
          name: '销售分析'
        }
      }
    ]
  },
  {
    path: `${basePath}/profitAnalysis`,
    component: profitAnalysis,
    children: [
      {
        path: '',
        redirect: 'profitTrend'
      },
      {
        path: 'profitPortion',
        component: profitAnalysisPortion,
        meta: {
          parentPath: `${basePath}/profitAnalysis`,
          name: '利润分析'
        }
      },
      {
        path: 'profitTrend',
        component: profitAnalysisTrend,
        meta: {
          parentPath: `${basePath}/profitAnalysis`,
          name: '利润分析'
        }
      }
    ]
  },
  {
    path: `${basePath}/financeAnalysis`,
    component: financeAnalysis,
    children: [
      {
        path: '',
        redirect: 'financeInOut'
      },
      {
        path: 'financeInOut',
        component: financeInOut,
        meta: {
          parentPath: `${basePath}/financeAnalysis`,
          name: '财务分析'
        }
      }
    ]
  }
]
