<template>
  <el-dialog :title="title" :visible.sync="visible" width="600px">
    <div class="audit-dialog">
      <div class="hd clearfix">
        <div class="fl">单据编号：&nbsp;{{auditInfo.id}}</div>
        <div class="fl">创建：&nbsp;{{auditInfo.name}} {{auditInfo.time}}</div>
      </div>
      <div v-if="title=='审核'" class="bd1">
        <div class="fl">审核结果：&nbsp;</div>
        <div class="fl">
          <el-radio name="radioVal1" v-model="radioVal" label="pass">审核通过</el-radio>
          <el-radio name="radioVal2" v-model="radioVal" label="return">
            审核退回
            <el-input name="returnReason" maxlength="50" v-if="radioVal=='return'" v-model="returnReason" placeholder="退回原因备注" clearable></el-input>
          </el-radio>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button name="btnSubmit" type="primary" @click="submitForm" :loading="$store.getters.is_loading">确 定</el-button>
      <el-button name="btnCancel" @click="visible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  MEMBERSHIP_API_MESSAGETASK_AUDIT
} from '@/apis/membership'
export default {
  props: {
    title: {
      type: String,
      default: '审核'
    },
    visibleAuditModal: {
      type: Boolean
    },
    auditInfo: {
      type: Object
    }
  },
  data() {
    return {
      visible: this.visibleAuditModal,
      radioVal: 'pass',
      returnReason: ''
    }
  },
  watch: {
    visible() {
      this.$emit('listenVisibleAuditModal')
    }
  },
  mounted() {
    this.$store.commit('SET_BTN_LOADING', false)
  },
  methods: {
    submitForm() {
      this.$store.commit('SET_BTN_LOADING', true)
      const param = {
        messageTaskId: this.auditInfo.id,
        isPass: this.radioVal == 'pass',
        checkNote: this.returnReason
      }
      MEMBERSHIP_API_MESSAGETASK_AUDIT(param).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.visible = false
          this.$emit('auditFinish')
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
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