<template>
  <!-- @module Dialog·审核 -->
  <el-dialog title="审核" width="600px" :visible.sync="visible">
    <el-form :label-position="'right'" label-width="120px">
      <el-alert v-if="returnType == refundType.Manual" title="当前的退款方式为：手动退款，请退款后再审核，以免忘记退款！" type="warning" show-icon :closable="false"></el-alert>
      <el-alert v-else title="当前的退款方式为：自动退款，审核后会自动从公众号退款给客户！" type="warning" show-icon :closable="false"></el-alert>
      <el-form-item label="退货/退款原因：">
        <span style="word-break:break-all; word-break: break-word; word-wrap: break-word;">{{data.Note}}</span>
      </el-form-item>
      <el-form-item label="应退金额：">
        <span>￥{{data.OrderPrice}}</span>
      </el-form-item>
      <el-form-item label="实退金额：">
        <el-input name="price" v-model="price" style="width:140px;" @keyup.native="price = $root.toFixed(price, 2)"></el-input>
      </el-form-item>
      <el-form-item label="审核结果：">
        <div class="alert">（注意：在审核前，请务必确认已收到客户退回的商品再审核）</div>
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="auditType">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-radio name="Yes" :label="yNStatus.Yes">审核通过</el-radio>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-radio name="No" :label="yNStatus.No">审核作废</el-radio>
            </el-col>
          </el-row>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-input name="auditReson" v-model="auditReson" :placeholder="'请输入原因' + (auditType ===  yNStatus.No ?'（必填）' : '')" :maxlength="200"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button name="btnAuditAdjust" type="primary" @click="auditAdjust" :loading="$store.getters.is_loading">确 定</el-button>
      <el-button name="btnCancel" @click="visible = false">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·审核 -->
</template>

<script>
import {
  RefundType
} from '@/enums/spread'
import { YNStatus } from '@/enums/common'
import {
  SPREAD_API_SPR_SETTINGDETAIL, SPREAD_API_SPRORDER_RETURNAUDIT, SPREAD_API_SPRORDER_RETURNABANDON
} from '@/apis/spread'
export default {
  props: {
    auditDialog: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object
    }
  },
  data () {
    return {
      refundType: RefundType,
      yNStatus: YNStatus,
      visible: this.auditDialog,
      returnType: RefundType.Auto,
      success: false,
      price: '',
      auditType: YNStatus.Yes, // 审核状态 1代表通过 3代表不通过
      auditReson: '' // 审核不通过理由
    }
  },
  methods: {
    auditAdjust () {
      if (!this.auditReson && this.auditType === YNStatus.No) {
        this.$message.error('请输入作废原因')
        return false
      }
      let apiMethod = SPREAD_API_SPRORDER_RETURNAUDIT
      if (this.auditType === YNStatus.No) {
        apiMethod = SPREAD_API_SPRORDER_RETURNABANDON
      }
      this.$store.commit('SET_BTN_LOADING', true)
      apiMethod({
        ReturnId: this.data.ReturnId,
        ReturnPrice: this.price,
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
    },
    getSettingDetail () {
      SPREAD_API_SPR_SETTINGDETAIL().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.returnType = res.data.Data.RefundType
        }
      })
    }
  },
  mounted () {
    this.getSettingDetail()
  },
  watch: {
    visible () {
      this.$emit('listenAuditDialog', this.success)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-radio-group{
  line-height: 36px;
}
.alert {
  color:red;
}
</style>
