<template>
  <el-dialog title="修改部门" :visible.sync="visible" custom-class="department-dialog">
    <el-form @submit.native.prevent label-width="110px" :rules="rules" :model="form" ref="form">
      <el-row>
        <el-col :span="24">
          <el-form-item label="部门名称：" prop="Department">
            <el-input name="Department" v-model="form.Department" @blur="form.Department=form.Department.trim()"  :maxlength="20"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button name="editDepartment" type="primary" :loading="$store.getters.is_loading" @click="editDepartment">确 定</el-button>
      <el-button name="cancel" @click="visible =  false">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  MERCHANT_API_CHARACTER_DEPART_GET,
  MERCHANT_API_CHARACTER_DEPART_UPDATE
} from '@/apis/merchant'
export default {
  props: {
    dialogEditVisible: {
      default: false,
      type: Boolean
    },
    data: {
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      flg: false,
      form: {
        Department: ''
      },
      group: [],
      visible: this.dialogEditVisible,
      success: false,
      rules: {
        Department: [
          // 必填验证
          {
            required: true,
            message: '请输入部门名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    getData() {
      // 初始化信息
      MERCHANT_API_CHARACTER_DEPART_GET({
        DepartmentId: this.data
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.form = res.data.Data
          // this.form.oldDepartment = res.data.Data.Department
        }
      })
    },
    editDepartment() {
      // if (this.form.oldDepartment == this.form.Department) {
      //   this.$message({
      //     message: '请修改部门名称!',
      //     type: 'error'
      //   })
      //   return false
      // }
      // 修改部门信息
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          MERCHANT_API_CHARACTER_DEPART_UPDATE(this.form).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '修改成功',
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
      })
    }
  },
  beforeMount() {
    this.getData()
  },
  watch: {
    visible: function() {
      this.$emit('listenEditVisible', this.success)
    }
  }
}
</script>
