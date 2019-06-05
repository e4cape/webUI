<template>
  <el-dialog title="新建部门" :visible.sync="visible" custom-class="department-dialog">
    <el-form @submit.native.prevent label-width="110px" :rules="rules" :model="form" ref="form">
      <el-row>
        <el-col :span="24">
          <el-form-item label="部门名称：" prop="Department">
            <el-input name="Department" v-model="form.Department" @blur="form.Department=form.Department.trim()"   :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button name="submit" type="primary" :loading="$store.getters.is_loading" @click="submit">确定</el-button>
      <el-button name="cancel" @click="visible =  false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  MERCHANT_API_CHARACTER_DEPART_CREATE 
} from '@/apis/merchant'
export default {
  props:{
    'dialogCreateVisible': {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      form: {
        Department: ''
      },
      visible: this.dialogCreateVisible,
      success: false,
      rules: {
        Department: [ // 必填验证
          {
            required: true, message: '请输入部门名称', trigger: 'blur' 
          },
          {
            min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' 
          }
        ]
      }
    }
  },
  methods: {
    submit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.addDepartment()
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    addDepartment () {
      this.$store.commit('SET_BTN_LOADING', true)
      MERCHANT_API_CHARACTER_DEPART_CREATE({
        Department: this.form.Department
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          this.$store.commit('SET_BTN_LOADING', false)
          this.success = true
          this.visible = false
        } else {
          this.$message.error(res.data.Message)
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    }
  },
  watch: {
    visible: function () {
      this.$emit('listenCreateVisible', this.success)
    }
  }
}
</script>
<style>
.department-dialog.el-dialog--small{
  width: 500px;
}
</style>
