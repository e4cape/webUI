export const FORM_RULES = {
  SupplierName: [{
    required: true,
    message: '请输入供应商名称',
    trigger: 'blur'
  }],
  PartnerName: [{
    required: true,
    message: '请输入单位名称',
    trigger: 'blur'
  }],
  PartnerType: [{
    required: true,
    message: '请选择单位类型',
    trigger: 'change'
  }],
  SettleType: [{
    required: true,
    message: '请选结算方式',
    trigger: 'change'
  }],
  Taxes: [{ // 验证小数
    validator: (rule, value, callback) => {
      if (value && !/^(0|1|0\.[0-9]{1,4}|1\.0{0,2})$/.test(value)) {
        callback(new Error('税率为0-1的小数'))
      }
      callback()
    },
    trigger: 'change'
  }],
  AccountCode: [{ // 验证银行号码
    validator: (rule, value, callback) => {
      const pomis = /^(998801|998802|622525|622526|435744|435745|483536|528020|526855|622156|622155|356869|531659|622157|627066|627067|627068|627069)\d{10}$/
      if (!pomis.test(value) && value) {
        callback(new Error('请输入正确的银行卡号'))
      }
      callback()
    },
    trigger: 'blur'
  }],
  Mobile: [{ // 验证手机号码
    validator: (rule, value, callback) => {
      const pomis = /^1[34578]\d{9}$/
      if (!pomis.test(value) && value) {
        callback(new Error('请输入正确的手机号码'))
      }
      callback()
    },
    trigger: 'blur'
  }],
  Email: [{ // 验证邮箱号码
    type: 'email',
    message: '请输入正确的邮箱地址',
    trigger: 'blur'
  }],
  QQ: [{ // 验证QQ号码
    validator: (rule, value, callback) => {
      const pomis = /[1-9][0-9]{4,}/
      if (!pomis.test(value) && value) {
        callback(new Error('邮箱号码'))
      }
      callback()
    },
    trigger: 'blur'
  }]
}