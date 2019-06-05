export const rules = {
  TrueName: {
    required: true,
    message: '请输入您的姓名',
    trigger: 'change'
  },
  RoleId: {
    required: true,
    message: '请选择角色',
    trigger: 'change'
  },
  DepartmentId: {
    type: 'number',
    required: true,
    message: '请选择部门',
    trigger: 'change'
  },
  OpenId: {
    type: 'number',
    required: true,
    message: '请绑定微信号',
    trigger: 'change'
  },
  LoginId: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
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
  VitaState: {
    required: true,
    message: '请选择在职状态',
    trigger: 'change'
  },
  SignedTime: {
    type: 'date',
    required: true,
    message: '请输入入职日期',
    trigger: 'change'
  },
  OfficialTime: {
    type: 'date',
    required: true,
    message: '请输入转正日期',
    trigger: 'change'
  },
  LeavedTime: {
    type: 'date',
    required: true,
    message: '请输入离职日期',
    trigger: 'change'
  },
  Email: {
    type: 'email',
    message: '请输入正确的邮箱地址',
    trigger: 'blur,change'
  }
}