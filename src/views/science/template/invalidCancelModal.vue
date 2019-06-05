<template>
  <el-dialog
    :title="title"
    width="600px"
    :visible.sync="visible"
  >
    <el-form label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="标题：">
            <span>{{invalidCancelObj.CourseTitle}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建：">
            <span>{{invalidCancelObj.CreateUser}} {{invalidCancelObj.CreateTime | filterDateTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item :label="`${title}原因：`">
          <el-input
            v-model="CheckNote"
            :placeholder="`${title}原因备注`"
            maxlength="200"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="">
          <span style="font-size: 12px">{{title}}后该单据所产生的库存等业务数据也将回退，确定{{title}}？</span>
        </el-form-item>
      </el-row>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        name="btnConfirm"
        type="primary"
        @click="btnConfirm"
        :loading="$store.getters.is_loading"
      >确 定</el-button>
      <el-button
        @click="visible = false"
        name="btnCancel"
      >取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  COLLEGE_API_INFRASTCOURSEBASIC_ABANDONSYSTEM, // 系统作废
  COLLEGE_API_INFRASTCOURSEBASIC_CANCELSYSTEM, // 系统取消审核
  COLLEGE_API_INFRASTCOURSEBASIC_ABANDONCOLLEGE, // 学院作废
  COLLEGE_API_INFRASTCOURSEBASIC_CANCELCOLLEGE // 学院取消审核
} from '@/apis/science'

export default {
  props: {
    visibleInvalidCancelModal: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    apiName: {
      // 系统还是学院，作废还是取消审核，调用对应的接口名
      type: String
    },
    invalidCancelObj: {
      type: Object
    }
  },
  data() {
    return {
      visible: this.visibleInvalidCancelModal,
      succ: false,
      CheckNote: '' // 备注
    }
  },
  watch: {
    visible() {
      this.$emit('listenVisibleInvalidCancelModal', this.succ)
    }
  },
  methods: {
    btnConfirm() {
      this.$store.commit('SET_BTN_LOADING', true)
      // 系统作废
      if (this.apiName.includes('ABANDONSYSTEM')) {
        COLLEGE_API_INFRASTCOURSEBASIC_ABANDONSYSTEM({
          CourseId: this.invalidCancelObj.CourseId,
          CheckNote: this.CheckNote
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            this.succ = true
            this.visible = false
          } else {
            this.$message.error(res.data.Message)
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }
      // 系统取消审核
      if (this.apiName.includes('CANCELSYSTEM')) {
        COLLEGE_API_INFRASTCOURSEBASIC_CANCELSYSTEM({
          CourseId: this.invalidCancelObj.CourseId,
          CheckNote: this.CheckNote
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            this.succ = true
            this.visible = false
          } else {
            this.$message.error(res.data.Message)
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }
      // 学院作废
      if (this.apiName.includes('ABANDONCOLLEGE')) {
        COLLEGE_API_INFRASTCOURSEBASIC_ABANDONCOLLEGE({
          CourseId: this.invalidCancelObj.CourseId,
          CheckNote: this.CheckNote
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            this.succ = true
            this.visible = false
          } else {
            this.$message.error(res.data.Message)
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }
      // 学院取消审核
      if (this.apiName.includes('CANCELCOLLEGE')) {
        COLLEGE_API_INFRASTCOURSEBASIC_CANCELCOLLEGE({
          CourseId: this.invalidCancelObj.CourseId,
          CheckNote: this.CheckNote
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            this.succ = true
            this.visible = false
          } else {
            this.$message.error(res.data.Message)
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }
    }
  }
}
</script>
