<template>
  <el-dialog :title="title" :visible.sync="visible" width="600px">
    <div class="audit-dialog">
      <div class="hd clearfix">
        <div class="fl">标题：&nbsp;{{auditObj.CourseTitle}}</div>
        <div class="fl">创建：&nbsp;{{auditObj.CreateUser}} {{auditObj.CreateTime | filterDateTime}}</div>
      </div>
      <div class="bd1">
        <div class="fl">审核结果：&nbsp;</div>
        <div class="fl">
          <el-radio name="radioVal1" v-model="radioVal" label="pass">审核通过</el-radio>
          <el-radio name="radioVal2" v-model="radioVal" label="return">
            审核退回
            <el-input name="CheckNote" maxlength="50" v-if="radioVal=='return'" v-model="CheckNote" placeholder="退回原因备注" clearable></el-input>
          </el-radio>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button name="btnConfirm" type="primary" @click="btnConfirm" :loading="$store.getters.is_loading">确 定</el-button>
      <el-button name="btnCancel" @click="visible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  COLLEGE_API_INFRASTCOURSEBASIC_AUDITBYSYSTEM, // 系统审核通过
  COLLEGE_API_INFRASTCOURSEBASIC_REJECTSYSTEM, // 系统审核退回
  COLLEGE_API_INFRASTCOURSEBASIC_AUDITBYCOLLEGE, // 学院审核通过
  COLLEGE_API_INFRASTCOURSEBASIC_REJECTCOLLEGE // 学院审核退回
} from '@/apis/science'
import { InfrastCourseChannelType } from '@/enums/science'

export default {
  props: {
    visibleAuditModal: {
      type: Boolean
    },
    title: {
      type: String,
      default: '审核'
    },
    channelType: {
      // 系统还是学院
      type: Number,
      default: InfrastCourseChannelType.System
    },
    auditObj: {
      type: Object
    }
  },
  data() {
    return {
      visible: this.visibleAuditModal,
      succ: false,
      radioVal: 'pass', // pass-通过 return-退回
      CheckNote: ''
    }
  },
  computed: {
    EnumInfrastCourseChannelType() {
      return InfrastCourseChannelType
    }
  },
  watch: {
    visible() {
      this.$emit('listenVisibleAuditModal', this.succ)
    }
  },
  methods: {
    btnConfirm() {
      this.$store.commit('SET_BTN_LOADING', true)
      const param = {
        CourseId: this.auditObj.CourseId,
        CheckNote: this.CheckNote
      }
      // 系统
      if (this.channelType == InfrastCourseChannelType.System) {
        if (this.radioVal === 'pass') {
          COLLEGE_API_INFRASTCOURSEBASIC_AUDITBYSYSTEM({
            CourseId: this.auditObj.CourseId
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
        } else {
          COLLEGE_API_INFRASTCOURSEBASIC_REJECTSYSTEM(param).then(res => {
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
      // 学院
      if (this.channelType === InfrastCourseChannelType.College) {
        if (this.radioVal === 'pass') {
          COLLEGE_API_INFRASTCOURSEBASIC_AUDITBYCOLLEGE(
            { CourseId: this.auditObj.CourseId }
          ).then(res => {
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
        } else {
          COLLEGE_API_INFRASTCOURSEBASIC_REJECTCOLLEGE(param).then(res => {
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
}
</script>
<style lang="scss" scoped>
.audit-dialog {
  line-height: 32px;
  .hd {
    & > div {
      width: 50%;
    }
  }
  .bd1 {
    label {
      display: block;
      line-height: 32px;
      margin-left: 0;
    }
    .el-input {
      margin-left: 10px;
    }
  }
}
</style>