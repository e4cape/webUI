export const tcrules = {
  Title: {
    required: true, message: '请输入标题名称', trigger: 'blur' 
  },
  PicUrl: {
    required: true, message: '请上传图片', trigger: 'change' 
  },
  Url: {
    validator: (rule, value, callback) => { // 验证门店编码
      if (value === '') {
        callback(new Error('请输入连接地址'))
      } else {
        const str = /^https:\/\//gi
        if (!str.test(value)) {
          callback(new Error('请输入正确的连接地址'))
        }
        callback()
      }
    },
    required: true,
    trigger: 'blur'
  },
  Description: {
    required: true, message: '请输入描述', trigger: 'blur' 
  }
}
export const rules = {
  RuleTitle: {
    required: true, message: '请输入标题名称', trigger: 'blur' 
  },
  EventType: {
    type: 'number', required: true, message: '请选择触发事件', trigger: 'change'
  },
  Keywords: {
    required: true, message: '输入关键字', trigger: 'blur' 
  },
  MatchType: {
    type: 'number', required: true, message: '请输入内容类型', trigger: 'blur'
  },
  ModeType: {
    type: 'number', required: true, message: '请输入内容类型', trigger: 'blur'
  },
  ReplyType: {
    type: 'number', required: true, message: '请输入内容类型', trigger: 'blur'
  },
  NoteType: {
    type: 'number', required: true, message: '请输入内容类型', trigger: 'blur'
  }
}
export const focusOn = {
  ruleTitle: {
    required: true, message: '请输入标题名称', trigger: 'blur' 
  },
  eventType: {
    type: 'number', required: true, message: '请选择触发事件', trigger: 'change'
  },
  noteType: {
    type: 'number', required: true, message: '请输入内容类型', trigger: 'blur'
  },
  RuleTitle: {
    required: true, message: '请输入标题名称', trigger: 'blur' 
  },
  EventType: {
    type: 'number', required: true, message: '请选择触发事件', trigger: 'change'
  },
  NoteType: {
    type: 'number', required: true, message: '请输入内容类型', trigger: 'blur'
  },
  TextContent: {
    required: true, message: '请输入内容类型', trigger: 'blur' 
  }
}
