
// index;
// 微信会员卡
const memberCardDetail = () => import('@/views/member/card/detail.vue')
const memberCardCreate = () => import('@/views/member/card/create.vue')

// 粉丝列表
const fanlist = () => import('@/views/member/clientManage/fanList')

// 个人信息详情
const viewcustomer = () => import('@/views/member/clientManage/viewCustomer')

// 2、回访任务
const visitTask = () => import('@/views/member/visitTask/index')
const visitTaskCheck = () => import('@/views/member/visitTask/visitTaskCheck')
const visitTaskEdit = () => import('@/views/member/visitTask/visitTaskEdit')

// 3、回访任务执行
const visitTaskExecute = () => import('@/views/member/visitTaskExecute/index')

// 4、回访话术
const visitBook = () => import('@/views/member/visitBook/index')

// 5、回访记录"
const visitRecord = () => import('@/views/member/visitRecord/index')

// 微信会员列表
const wechatmember = () => import('@/views/member/clientManage/weChatMember')

// 线下会员列表
const offlinemember = () => import('@/views/member/clientManage/offlineMember')

// 会员等级设置
const settingMemberLevelRule = () => import('@/views/member/clientManage/SettingMemberLevelRule')

// 客户动态
const customerDynamics = () => import('@/views/member/clientManage/customerDynamics')

// 客户进店记录
const customerEntryRecord = () => import('../views/member/clientManage/customerEntryRecord')

const basePath = '/member'

export default [
  {
    path: `${basePath}/card/detail`,
    component: memberCardDetail,
    name: '微信会员卡'
  }, {

    path: `${basePath}/card/create`,
    component: memberCardCreate,
    name: '创建微信会员卡',
    meta: {
      parentPath: `${basePath}/card/detail`
    }
  },
  {
    path: `${basePath}/card/edit`,
    component: memberCardCreate,
    name: '修改微信会员卡',
    meta: {
      parentPath: `${basePath}/card/detail`
    }
  },
  {
    path: `${basePath}/clientManage/fanlist`,
    component: fanlist,
    name: '粉丝列表'
  },
  {
    path: `${basePath}/clientManage/viewcustomer`,
    component: viewcustomer,
    name: '会员管理',
    meta: {
      parentPath: `${basePath}/clientManage/offlinemember`
    }
  },
  {
    path: `${basePath}/clientManage/wechatmember`,
    component: wechatmember,
    name: '微信会员管理'
  },
  {
    path: `${basePath}/clientManage/offlinemember`,
    component: offlinemember,
    name: '线下会员管理'
  },
  {
    path: `${basePath}/clientManage/memberLevelRule`,
    component: settingMemberLevelRule,
    name: '会员等级设置'
  },
  {
    path: `${basePath}/clientManage/customerDynamics`,
    component: customerDynamics,
    name: '客户动态'
  },
  {
    path: `${basePath}/clientManage/customerEntryRecord`,
    component: customerEntryRecord,
    name: '客户进店记录'
  },
  {

    path: `${basePath}/visitTask/index`,
    component: visitTask,
    name: '回访任务'
  },
  {
    path: `${basePath}/visitTask/visitTaskCheck`,
    component: visitTaskCheck,
    name: '查看回访任务',
    meta: {
      parentPath: `${basePath}/visitTask/index`
    }
  },
  {
    path: `${basePath}/visitTask/visitTaskEdit`,
    component: visitTaskEdit,
    name: '编辑回访任务',
    meta: {
      parentPath: `${basePath}/visitTask/index`
    }

  },
  {
    path: `${basePath}/visitTaskExecute/index`,
    component: visitTaskExecute,
    name: '回访任务执行'

  },
  {
    path: `${basePath}/visitBook/index`,
    component: visitBook,
    name: '回访话术'

  },
  {
    path: `${basePath}/visitRecord/index`,
    component: visitRecord,
    name: '回访记录'

  }
]
