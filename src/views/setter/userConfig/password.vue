<template>
  <div class="content">
    <el-form ref="form" :model="passwordForm" :rules="formRules" label-width="100px" class="fix-w">
      <el-form-item label="旧密码" prop="Loginpass" label-position="right">
        <el-input name="Loginpass" type="password" v-model="passwordForm.Loginpass" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="Loginpass1">
        <el-input name="Loginpass1" type="password" v-model="passwordForm.Loginpass1" :maxlength="20"></el-input>
        <span style="padding-left: 10px;">5-20位，区分大小写</span>
      </el-form-item>
      <el-form-item label="确认新密码" prop="Loginpass2">
        <el-input name="Loginpass2" type="password" v-model="passwordForm.Loginpass2" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button name="confirm" type="primary" class="fl" @click="isformTrue">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  MERCHANT_API_SECURITY_USER_PASSWORD
} from '@/apis/merchant'
export default {
  data () {
    return {
      passwordForm: { // 修改密码表单
        Loginpass: '',
        Loginpass1: '',
        Loginpass2: ''
      },
      formRules: {
        Loginpass: [
          {
            required: true, message: '旧密码不能为空', trigger: 'change'
          },
          {
            required: true, min: 5, message: '密码最少不能少于5位', trigger: 'blur'
          },
          {
            required: true, max: 20, message: '密码最多不能多于20位', trigger: 'change'
          }
        ],
        Loginpass1: [
          {
            required: true, message: '新密码不能为空', trigger: 'change'
          },
          {
            required: true, min: 5, message: '密码最少不能少于5位', trigger: 'blur'
          },
          {
            required: true, max: 20, message: '密码最多不能多于20位', trigger: 'change'
          }
        ],
        Loginpass2: [
          {
            required: true, message: '确定新密码不能为空', trigger: 'change'
          },
          {
            required: true, min: 5, message: '密码最少不能少于5位', trigger: 'blur'
          },
          {
            required: true, max: 20, message: '密码最多不能多于20位', trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    // 表单验证
    isformTrue () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.passwordModify()
        }
      })
    },
    // 修改密码
    passwordModify () {
      if (this.passwordForm.Loginpass1 !== this.passwordForm.Loginpass2) {
        this.$message.error('两次输入的密码不一致')
      } else {
        MERCHANT_API_SECURITY_USER_PASSWORD(this.passwordForm).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message('修改成功', 'success')
            this.$store.dispatch('ACCESS_TOKEN_LOGOUT').then(() => {
              location.href = this.$root.settings.DOMAIN_LOGIN
            })
          } else {
            this.$message.error(res.data.Message)
          }
        })
      }
    }
  },
}
</script>
