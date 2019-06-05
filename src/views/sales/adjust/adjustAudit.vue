<template>
  <!-- @module Dialog·审核 -->
  <el-dialog title="审核" :visible.sync="visible" width="580px">
    <el-form :label-position="'right'" label-width="100px">
      <el-row v-if="data.length === 1">
        <el-col :span="8">
          <el-form-item label="单据编号：">
            <span>{{data.PriceCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="创建：">
            <span>{{data.CreateUser}}&nbsp;&nbsp;&nbsp;{{data.CreateTime | filterDateTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="审核结果：">
        <el-radio-group v-model="auditType" name="auditType">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-radio :label="YNStatus.Yes">审核通过</el-radio>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-radio :label="YNStatus.No">审核退回</el-radio>
            </el-col>
            <el-col :span="16" v-show="auditType === YNStatus.No">
              <el-input
                v-model="auditReson"
                placeholder="退回原因备注"
                :maxlength="200"
                name="auditReson"
              ></el-input>
            </el-col>
          </el-row>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="auditAdjust"
        :loading="$store.getters.is_loading"
        name="btnAuditAdjust"
      >确 定</el-button>
      <el-button @click="visible = false" name="btnCancel">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·审核 -->
</template>

<script>
import { YNStatus } from '@/enums/common.js'
import {
  STOCKING_API_GOODS_PRICE_ORDER_BASIC_AUDIT,
  STOCKING_API_GOODS_PRICE_ORDER_BASIC_REJECT
} from '@/apis/stocking.js'

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
  data() {
    return {
      YNStatus,
      visible: this.auditDialog,
      success: false,
      auditType: YNStatus.Yes, // 审核状态 1代表通过 3代表不通过
      auditReson: '' // 审核不通过理由
    }
  },
  methods: {
    auditAdjust() {
      let apiMethod = STOCKING_API_GOODS_PRICE_ORDER_BASIC_AUDIT
      if (this.auditType === this.YNStatus.No) {
        apiMethod = STOCKING_API_GOODS_PRICE_ORDER_BASIC_REJECT
      }
      this.$store.commit('SET_BTN_LOADING', true)
      apiMethod({
        PriceId: this.data.PriceId,
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
