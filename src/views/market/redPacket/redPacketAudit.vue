<template>
  <!-- @module Dialog·审核 -->
  <el-dialog title="审核" :visible.sync="visible">
    <el-form :label-position="'right'" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="ID：">
            <span>{{data.PacketId}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="创建时间：">
            <span>{{data.CreateTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="审核结果：">
        <el-radio-group name="radioGroupAuditType" v-model="auditType">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-radio :label="YNStatus.Yes">审核通过</el-radio>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-radio :label="YNStatus.No">审核作废</el-radio>
            </el-col>
            <el-col :span="16" v-show="auditType === YNStatus.No">
              <el-input v-model="auditReson" placeholder="作废原因备注" :maxlength="20"></el-input>
            </el-col>
          </el-row>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button name="btnAuditPurchase" type="primary" @click="auditPurchase" :loading="$store.getters.is_loading">确 定</el-button>
      <el-button name="btnCancel" @click="visible = false">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·审核 -->
</template>

<script>
import {
  YNStatus
} from '@/enums/common.js'
import {
  PAYMENT_API_RED_PACKET_BASIC_AUDIT,
  PAYMENT_API_RED_PACKET_BASIC_ABANDON
} from '@/apis/payment1.js'

export default {
  props: {
    data: {
      default: new Object(),
      type: Object
    },
    auditDialog: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      YNStatus,
      visible: this.auditDialog,
      auditType: YNStatus.Yes, // 审核状态 1代表通过 3代表不通过
      auditReson: '', // 审核不通过理由
      success: false
    }
  },
  methods: {
    auditPurchase() {
      let apiMethod = PAYMENT_API_RED_PACKET_BASIC_AUDIT
      if (this.auditType === this.YNStatus.No) {
        apiMethod = PAYMENT_API_RED_PACKET_BASIC_ABANDON
        if (!this.auditReson) {
          this.$message.error('请输入作废原因')
          return false
        }
      }
      this.$store.commit('SET_BTN_LOADING', true)
      apiMethod({
        PacketId: this.data.PacketId,
        CheckNote: this.auditReson
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
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
    visible() {
      this.$emit('listenAuditDialog', this.success)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-radio-group {
  line-height: 36px;
}
</style>

