export const junkRules = { // 规则
  JunkName: [
    {
      type: 'string',
      required: true,
      validator: (rule, value, callback) => {
        if (!value.trim()) {
          callback(new Error('请选择旧货名称'))
        }
        callback()
      },
      trigger: 'change'
    }
  ],
  MaterialType: [
    {
      type: 'number',
      required: true,
      validator: (rule, value, callback) => {
        if (value === 0) {
          callback(new Error('请选择旧货材质'))
        }
        callback()
      },
      trigger: 'change'
    }
  ],
  RecallPrice: [
    {
      required: true,
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入回收金额'))
        } else if (!/^(\d+|\d+.\d+)$/.test(value) && value !== '0') {
          callback(new Error('必须为数字'))
        }
        callback()
      }
    }
  ],
  RecallFee: [
    {
      required: false,
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (!/^(\d+|\d+.\d+)$/.test(value) && value !== '0' && value !== '' && value !== undefined) {
          callback(new Error('必须为数字'))
        }
        callback()
      }
    }
  ],
  GoldWeight: [
    {
      required: false,
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (!/^(\d+|\d+.\d+)$/.test(value) && value !== '0' && value !== '' && value !== undefined) {
          callback(new Error('必须为数字'))
        }
        callback()
      }
    }
  ],
  Weight: [
    {
      required: false,
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (!/^(\d+|\d+.\d+)$/.test(value) && value !== '0' && value !== '' && value !== undefined) {
          callback(new Error('必须为数字'))
        }
        callback()
      }
    }
  ],
  StoneWeight: [
    {
      required: false,
      trigger: 'blur',
      validator: (rule, value, callback) => {
        if (!/^(\d+|\d+.\d+)$/.test(value) && value !== '0' && value !== '' && value !== undefined) {
          callback(new Error('必须为数字'))
        }
        callback()
      }
    }
  ]
}
