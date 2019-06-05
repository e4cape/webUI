export default {
  CompanyId: [
    {
      type: 'number',
      required: true,
      message: '请选择归属公司',
      trigger: 'change'
    }
  ],
  CompanyCode: [
    {
      required: true,
      message: '请输入公司编码',
      trigger: 'change'
    }
  ],
  CompanyName: [
    {
      required: true,
      message: '请输入公司名称',
      trigger: 'blur'
    }
  ],
  ShortName: {
    validator: (rule, value, callback) => {
      const reg = /^[\u4e00-\u9fa5]+$/
      const oldValue = value.split('')
      for (let i = 0; i < oldValue.length; i++) {
        if (reg.test(oldValue[i])) {
          oldValue[i] += 'x'
        }
      }
      if (!value) {
        callback('请输入公司简称')
      } else if (oldValue.join('').length > 24) {
        callback('公司简称不得超过12个汉字或者24个字母')
      } else {
        callback()
      }
    },
    trigger: 'change'
  },
  OpenTime: [
    {
      type: 'date',
      required: true,
      message: '请选择开店时间',
      trigger: 'change'
    }
  ],
  LoginId: [
    {
      required: true,
      message: '请输入管理员账号',
      trigger: 'blur'
    }
  ],
  Address: [
    {
      required: true,
      message: '请输入详细地址',
      trigger: 'blur'
    }
  ],
  BusinessLicense: [
    {
      required: true,
      message: '请输入营业执照',
      trigger: 'blur'
    }
  ],
  Phone: [
    {
      required: true,
      message: '请输入公司电话',
      trigger: 'blur'
    }
  ],
  Contact: [
    {
      required: true,
      message: '请输入联系人',
      trigger: 'blur'
    }
  ],
  MountPayment: [
    {
      required: true,
      message: '请选择微信管理'
    }
  ],
  PackId: [
    {
      required: true,
      message: '请选择类型/套餐',
      trigger: 'blur'
    }
  ],
  AdministratorId: [
    {
      required: true,
      message: '请输入管理员账号'
    }
  ],
  MountWechat: [
    {
      required: true,
      message: '请选择微信管理'
    }
  ],
  Mobile: [
    {
      required: true,
      message: '请输入联系人手机',
      trigger: 'blur'
    }
  ],
  Password: [
    {
      required: true,
      message: '请输入初始密码',
      trigger: 'blur'
    },
    {
      min: 5,
      max: 20,
      message: '密码长度为5-20位字符',
      trigger: 'change'
    }
  ],
  WechatSettingType: {
    required: true,
    type: 'number',
    message: '请选择微信管理',
    trigger: 'change'
  },
  PaymentSettingType: {
    required: true,
    type: 'number',
    message: '请选择支付授权',
    trigger: 'change'
  },
  AreaData: [
    {
      validator: (rule, value, callback) => {
        if (!value || !value[0] || !value[0].length) {
          callback('请选择所属地区')
        }
        callback()
      },
      trigger: 'change'
    }
  ],
  FlagshipType: [
    {
      type: 'array',
      required: true,
      message: '请选择主营品类',
      trigger: 'change'
    }
  ]
}
