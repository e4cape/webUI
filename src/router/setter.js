// saas产品设置
const saasSetting = () => import('@/views/setter/saasSetting')
// 修改密码，个人信息，下载
const userConfig = () => import('@/views/setter/userConfig/index')
const download = () => import('@/views/setter/userConfig/download')
const password = () => import('@/views/setter/userConfig/password')
// 门店信息
const storeConfig = () => import('@/views/setter/basic/store')
const companyConfig = () => import('@/views/setter/basic/company')
// 参数设置
const parameter = () => import('@/views/setter/basic/parameter')
// 单号生成规则
const generate = () => import('@/views/setter/basic/generate')
// 货品科目设置
const category = () => import('@/views/setter/basic/category')
// 单据审核规则
const audit = () => import('@/views/setter/basic/audit')
// 部门管理
const department = () => import('@/views/setter/department/index')
// 角色与权限
const power = () => import('@/views/setter/power/index')
const powerDetail = () => import('@/views/setter/power/powerDetail')
const powerEdit = () => import('@/views/setter/power/powerEdit')

// 支付宝支付授权
const alipay = () => import('@/views/setter/onlinePay/alipay')
// 微信支付授权
const wechatpay = () => import('@/views/setter/onlinePay/wechatpay')
// 员工管理
const staff = () => import('@/views/setter/staff/index')
const staffDetail = () => import('@/views/setter/staff/staffDetail')
const staffCreate = () => import('@/views/setter/staff/staffCreate')
const staffEdit = () => import('@/views/setter/staff/staffEdit')
// 门店管理
const store = () => import('@/views/setter/store/index')
const storeCheck = () => import('@/views/setter/store/storeCheck')
const storeCreate = () => import('@/views/setter/store/storeCreate')
const storeEdit = () => import('@/views/setter/store/storeEdit')
// 公司管理
const company = () => import('@/views/setter/company/index')
const companyCheck = () => import('@/views/setter/company/companyCheck')
const companyCreate = () => import('@/views/setter/company/companyCreate')
const companyEdit = () => import('@/views/setter/company/companyEdit')
// 集团管理
const grouplist = () => import('@/views/setter/group/index')
const groupcreate = () => import('@/views/setter/group/groupCreate')
const groupdetail = () => import('@/views/setter/group/groupDetail')
// 微信授权;
const authorise = () => import('@/views/setter/wechat/authorise') // 微信授权
// 微信小程序管理
const wechat = () => import('@/views/setter/applet/wechat') // 小程序
// 金价设置
const goldPrice = () => import('@/views/setter/goldPrice/index')
// 收银台授权
const equipmentlist = () => import('@/views/setter/authorizationManage/index')
const equipmentdetail = () => import('@/views/setter/authorizationManage/equipmentDetail')
const equipmentcreate = () => import('@/views/setter/authorizationManage/equipmentCreate')
// 支付授权
const authorizepaylist = () => import('@/views/setter/authorizationManage/authorizePayList')
// 微信公众号设置
const authorizerlist = () => import('@/views/setter/wxPublic/index')
const replyedit = () => import('@/views/setter/wxPublic/replyEdit')
const menuedit = () => import('@/views/setter/wxPublic/menuEdit')
const rulecreatebysubscribe = () => import('@/views/setter/wxPublic/ruleCreateBySubscribe')
const rulecreatebykeyword = () => import('@/views/setter/wxPublic/ruleCreateByKeyword')
const ruleeditbykeyword = () => import('@/views/setter/wxPublic/ruleEditByKeyword')
const ruleeditbysubscribe = () => import('@/views/setter/wxPublic/ruleEditBySubscribe')

// 微信消息提醒模板
const wxtemplatelist = () => import('@/views/setter/wxPublic/templateList')
const templatelistdetail = () => import('@/views/setter/wxPublic/templateDetail')
const cmptemplatelist = () => import('@/views/setter/wxPublic/companyTemplateList')
const createtemplate = () => import('@/views/setter/wxPublic/createTemplate')
// 营销收益设置
const couponedit = () => import('@/views/setter/wxPublic/couponEdit')
// 平台提点设置
const orderRateedit = () => import('@/views/setter/wxPublic/orderRateEdit')
// 小程序授权
const wxappletauthorlist = () => import('@/views/setter/wxApplet/wxAppletAuthorList')
// 商家小程序
const wxappletstorelist = () => import('@/views/setter/wxApplet/wxAppletStoreList')
const wxappletstoredetail = () => import('@/views/setter/wxApplet/wxAppletStoreDetail')
// 小程序模板
const wxapplettemplatelist = () => import('@/views/setter/wxApplet/wxAppletTemplateList')
// 模板消息管理
const wxappletmsgtemplatelist = () => import('@/views/setter/wxApplet/wxAppletmsgTemplateList')
const wxappletmsgtemplatesetting = () => import('@/views/setter/wxApplet/wxAppletmsgTemplateSetting')

// 质保单管理
const qualist = () => import('@/views/setter/quality/index')

// 质保单模板管理
const tempdetail = () => import('@/views/setter/quality/tempdetail')
const tempedit = () => import('@/views/setter/quality/tempedit')
// 充值管理
const orderlist = () => import('@/views/setter/recharge/orderList')
const orderdetail = () => import('@/views/setter/recharge/orderDetail')
// 充值策略设置
const rechargeedit = () => import('@/views/setter/settingList/rechargeEdit')
// 系统公告
const noticelist = () => import('@/views/setter/settingList/noticeList')
const noticecreate = () => import('@/views/setter/settingList/noticeCreate')
const noticedetail = () => import('@/views/setter/settingList/noticeDetail')
// 权限配置
const rolelist = () => import('@/views/setter/settingList/roleList')
const rolecreate = () => import('@/views/setter/settingList/roleCreate')
const roledetail = () => import('@/views/setter/settingList/roleDetail')
const roleedit = () => import('@/views/setter/settingList/roleEdit')
// 模板打印设置
const templatelist = () => import('@/views/setter/settingList/templateList')

// 系统推送消息
const sysPushMessage = () => import('@/views/setter/wechat/sysPushMessage')

// 仓库设置
const warehouseSetting = () => import('@/views/setter/warehouseSetting/index')

//  来往单位管理;
const partnerManager = () => import('@/views/setter/partner/index')
//  供应商管理;
const supplierManager = () => import('@/views/setter/supplier/index')

// 流程设置
const flowPath = () => import('@/views/setter/flowPath/index')
// 单据自定义模板
const invoicesTemplate = () => import('@/views/setter/invoicesTemplate/index')
// 货品权限设置
const productPower = () => import('@/views/setter/productPower/index')

const basePath = '/setter'

export default [
  {
    path: `${basePath}/saasSetting/`,
    component: saasSetting,
    name: 'saas产品配置'
  },
  {
    path: `${basePath}/settinglist/rechargeedit`,
    component: rechargeedit,
    name: '充值策略设置'
  },
  {
    path: `${basePath}/settinglist/noticelist`,
    component: noticelist,
    name: '系统公告'
  },
  {
    path: `${basePath}/settinglist/noticecreate`,
    component: noticecreate,
    name: '创建系统公告',
    meta: {
      parentPath: `${basePath}/settinglist/noticelist`
    }
  },
  {
    path: `${basePath}/settinglist/noticedetail`,
    component: noticedetail,
    name: '系统公告详情',
    meta: {
      parentPath: `${basePath}/settinglist/noticelist`
    }
  },
  {
    path: `${basePath}/settinglist/noticeedit`,
    component: noticecreate,
    name: '修改系统公告',
    meta: {
      parentPath: `${basePath}/settinglist/noticelist`
    }
  },
  {
    path: `${basePath}/settinglist/rolelist`,
    component: rolelist
  },
  {
    path: `${basePath}/settinglist/rolecreate`,
    component: rolecreate
  },
  {
    path: `${basePath}/settinglist/roledetail`,
    component: roledetail
  },
  {
    path: `${basePath}/settinglist/roleedit`,
    component: roleedit
  },
  {
    path: `${basePath}/settinglist/templatelist`,
    component: templatelist,
    name: '模板管理'

  },
  {
    path: `${basePath}/group/index`,
    component: grouplist,
    name: '集团管理'
  },
  {
    path: `${basePath}/group/create`,
    component: groupcreate,
    name: '集团创建',
    meta: {
      parentPath: `${basePath}/group/index`
    }
  },
  {
    path: `${basePath}/group/edit`,
    component: groupdetail,
    name: '修改集团',
    meta: {
      parentPath: `${basePath}/group/index`
    }
  },
  {
    path: `${basePath}/group/detail`,
    component: groupdetail,
    name: '集团详情',
    meta: {
      parentPath: `${basePath}/group/index`
    }
  },
  {

    path: `${basePath}/recharge/index`,
    component: orderlist,
    name: '充值管理'
  },
  {
    path: `${basePath}/recharge/orderdetail`,
    component: orderdetail,
    name: '充值详情',
    meta: {
      parentPath: `${basePath}/recharge/index`
    }
  },
  {
    path: `${basePath}/wxapplet/wxappletauthorlist`,
    component: wxappletauthorlist,
    name: '小程序授权'
  },
  {
    path: `${basePath}/wxapplet/wxappletstorelist`,
    component: wxappletstorelist,
    name: '商家小程序'
  },
  {
    path: `${basePath}/wxapplet/wxappletstoredetail`,
    component: wxappletstoredetail,
    name: '小程序信息',
    meta: {
      parentPath: `${basePath}/wxapplet/wxappletstorelist`
    }
  },
  {
    path: `${basePath}/wxapplet/wxapplettemplatelist`,
    component: wxapplettemplatelist,
    name: '小程序模板'
  },
  {
    path: `${basePath}/wxapplet/wxappletmsgtemplatelist`,
    component: wxappletmsgtemplatelist,
    name: '模板消息管理'
  },
  {
    path: `${basePath}/wxapplet/wxappletmsgtemplatesetting`,
    component: wxappletmsgtemplatesetting,
    name: '配置模板消息',
    meta: {
      parentPath: `${basePath}/wxapplet/wxappletmsgtemplatelist`
    }
  },
  {
    path: `${basePath}/userConfig/index`,
    component: userConfig,
    name: '个人信息'
  },
  {
    path: `${basePath}/userConfig/password`,
    component: password,
    name: '修改密码'
  },
  {
    path: `${basePath}/userConfig/download`,
    component: download,
    name: '下载列表'

  },
  {
    path: `${basePath}/basic/store`,
    component: storeConfig,
    name: '门店信息'
  },
  {
    path: `${basePath}/basic/company`,
    component: companyConfig,
    name: '公司信息'
  },
  {
    path: `${basePath}/basic/parameter`,
    component: parameter,
    name: '参数设置'
  },
  {
    path: `${basePath}/basic/generate`,
    component: generate,
    name: '单号生成规则'
  },
  {
    path: `${basePath}/basic/category`,
    component: category,
    name: '货品科目设置'
  },
  {
    path: `${basePath}/basic/audit`,
    component: audit,
    name: '单据审核规则'

  },
  // 部门管理
  {
    path: `${basePath}/department/index`,
    component: department,
    name: '部门管理'
  },
  {

    path: `${basePath}/power/index`,
    component: power,
    name: '权限管理'
  },
  {
    path: `${basePath}/power/powerDetail`,
    component: powerDetail,
    name: '查看权限',
    meta: {
      parentPath: `${basePath}/power/index`
    }
  },
  {
    path: `${basePath}/power/powerEdit`,
    component: powerEdit,
    name: '修改权限',
    meta: {
      parentPath: `${basePath}/power/index`
    },
    beforeEnter(to, from, next) {
      to.meta.name = '修改'+to.query.name+'的权限'
      next()
    },
  },
  {
    path: `${basePath}/pay/alipay`,
    component: alipay,
    name: '支付宝支付设置'
  },
  {
    path: `${basePath}/pay/wechatpay`,
    component: wechatpay,
    name: '微信支付设置'

  },
  {
    path: `${basePath}/staff/index`,
    component: staff,
    meta: {
      name: '员工管理'
    }
  },
  {
    path: `${basePath}/staff/staffDetail`,
    component: staffDetail,
    name: '查看员工',
    meta: {
      parentPath: `${basePath}/staff/index`
    }
  },
  {
    path: `${basePath}/staff/staffCreate`,
    component: staffCreate,
    name: '新建员工',
    meta: {
      parentPath: `${basePath}/staff/index`
    }
  },
  {
    path: `${basePath}/staff/staffEdit`,
    component: staffEdit,
    name: '修改员工',
    meta: {
      parentPath: `${basePath}/staff/index`
    }
  },
  {
    path: `${basePath}/store/index`,
    component: store,
    name: '门店管理',
    meta: {
      parentPath: `${basePath}/store/index`
    }
  },
  {
    path: `${basePath}/store/storeCheck`,
    component: storeCheck,
    name: '查看门店',
    meta: {
      parentPath: `${basePath}/store/index`
    }
  },
  {
    path: `${basePath}/store/storeCreate`,
    component: storeCreate,
    name: '新建门店',
    meta: {
      parentPath: `${basePath}/store/index`
    }
  },
  {
    path: `${basePath}/store/storeEdit`,
    component: storeEdit,
    name: '修改门店',
    meta: {
      parentPath: `${basePath}/store/index`
    }

  },
  {
    path: `${basePath}/company/index`,
    component: company,
    name: '公司管理'
  },
  {
    path: `${basePath}/company/companyCheck`,
    component: companyCheck,
    name: '查看公司',
    meta: {
      parentPath: `${basePath}/company/index`
    }
  },
  {
    path: `${basePath}/company/companyCreate`,
    component: companyCreate,
    name: '新建公司',
    meta: {
      parentPath: `${basePath}/company/index`
    }
  },
  {
    path: `${basePath}/company/companyEdit`,
    component: companyEdit,
    name: '修改公司',
    meta: {
      parentPath: `${basePath}/company/index`
    }

  },
  {
    path: `${basePath}/applet/wechat`,
    component: wechat,
    name: '小程序管理'
  },
  {
    name: '金价设置',
    path: `${basePath}/goldPrice/index`,
    component: goldPrice
  },
  {

    path: `${basePath}/wechat/authorise`,
    component: authorise,
    name: '微信授权'
  },
  {
    path: `${basePath}/authorizationmanage/index`,
    component: equipmentlist,
    name: '收银台授权'
  },
  {
    path: `${basePath}/authorizationmanage/equipmentdetail`,
    component: equipmentdetail,
    name: '设备授权详情',
    meta: {
      parentPath: `${basePath}/authorizationmanage/index`
    }
  },
  {
    path: `${basePath}/authorizationmanage/equipmentcreate`,
    component: equipmentcreate,
    name: '新增授权设备',
    meta: {
      parentPath: `${basePath}/authorizationmanage/index`
    }
  },
  {
    path: `${basePath}/authorizationmanage/authorizepaylist`,
    component: authorizepaylist,
    name: '支付授权'
  },
  {
    path: `${basePath}/wxpublic/index`,
    component: authorizerlist,
    name: '微信公众号设置'
  },
  {
    path: `${basePath}/wxpublic/menuedit`,
    component: menuedit,
    name: '微信自定义菜单',
    meta: {
      parentPath: ''
    }
  },
  {
    path: `${basePath}/wxpublic/replyedit`,
    component: replyedit,
    name: '微信自定义回复消息',
    meta: {
      parentPath: ''
    }
  },
  {
    path: `${basePath}/wxpublic/wxtemplatelist`,
    component: wxtemplatelist,
    name: '微信消息提醒模板'
  },
  {
    path: `${basePath}/wxpublic/createtemplate`,
    component: createtemplate,

    beforeEnter(to, from, next) {
      if (to.query.isStore == 'true') {
        to.meta.name = '添加门店消息模板'
      } else {
        to.meta.name = '添加商户消息模板'
      }
      next()
      console.log(11111, to, from, next)
    },
    meta: {
      parentPath: `${basePath}/wxpublic/wxtemplatelist`
    }
  },
  {
    path: `${basePath}/wxpublic/cmptemplatelist`,
    component: cmptemplatelist,
    name: '添加商户消息模板',
    meta: {
      parentPath: `${basePath}/wxpublic/wxtemplatelist`
    }
  },
  {
    path: `${basePath}/wxpublic/templatelistdetail`,
    component: templatelistdetail,
    name: '微信消息提醒模板详情',
    meta: {
      parentPath: `${basePath}/wxpublic/wxtemplatelist`
    }
  },
  {
    path: `${basePath}/wxpublic/couponedit`,
    component: couponedit,
    name: '营销收益设置'
  },
  {
    path: `${basePath}/wxpublic/orderrateedit`,
    component: orderRateedit,
    name: '平台提点设置'
  },
  {
    path: `${basePath}/wxpublic/rulecreatebysubscribe`,
    component: rulecreatebysubscribe,
    name: '添加被关注自动回复消息',
    meta: {
      parentPath: ''
    }
  },
  {
    path: `${basePath}/wxpublic/rulecreatebykeyword`,
    component: rulecreatebykeyword,
    name: '添加关键字自动回复信息',
    meta: {
      parentPath: ''
    }
  },
  {
    path: `${basePath}/wxpublic/ruleeditbykeyword`,
    component: ruleeditbykeyword,
    name: '编辑关键字自动回复信息',
    meta: {
      parentPath: ''
    }
  },
  {
    path: `${basePath}/wxpublic/ruleeditbysubscribe`,
    component: ruleeditbysubscribe,
    name: '编辑被关注自动回复消息',
    meta: {
      parentPath: ''
    }
  },
  {
    path: `${basePath}/quality/index`,
    component: qualist,
    name: '质保单管理'
  },
  {
    path: `${basePath}/quality/tempdetail`,
    component: tempdetail,
    name: '质保单模板管理'
  },
  {
    path: `${basePath}/quality/tempedit`,
    component: tempedit,
    name: '质保单模板修改'

  },
  {
    path: `${basePath}/wechat/syspushmessage`,
    component: sysPushMessage,
    name: '系统推送消息'
  },
  {
    path: `${basePath}/warehousesetting/index`,
    component: warehouseSetting,
    name: '仓库管理'
  },
  {
    path: `${basePath}/supplier/index`,
    component: supplierManager,
    name: '供应商管理'
  },
  {
    path: `${basePath}/partner/index`,
    component: partnerManager,
    name: '往来单位管理'
  },
  {
    path: `${basePath}/flowpath/index`,
    component: flowPath,
    name: '流程设置'
  },
  {
    path: `${basePath}/invoicestemplate/index`,
    component: invoicesTemplate,
    name: '单据自定义模板'
  },
  {
    path: `${basePath}/productpower/index`,
    component: productPower,
    name: '货品权限设置'
  }
]