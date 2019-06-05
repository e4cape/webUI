
<template  >
  <!--  @module Dialog·审核  -->
  <el-dialog title="审核" :visible="visible" @update:visible="$emit('update:visible', $event)" @close="auditReson = ''">
    <el-form :label-position="'right'" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="单据编号：">
            <span>{{selectRetail.MasterCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="创建时间：">
            <span>{{selectRetail.OrderTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item label="备注：">
            <el-input v-model="auditReson" placeholder="请输入备注" :maxlength="200" name="auditReson"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="auditPurchase" :loading="$store.getters.is_loading" name="btn-confirm">确 定</el-button>
      <el-button @click="$emit('update:visible', false)" name="btn-cancel">取 消</el-button>
    </span>
  </el-dialog>
  <!--  End Dialog·审核  -->
</template>
<script>
import { YNStatus } from '@/enums/common.js'
import { ORDER_API_RETAIL_ORDER_MASTER_AUDIT } from '@/apis/order.js'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectRetail: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      auditType: YNStatus.Yes, // 审核状态 1代表通过 3代表不通过
      auditReson: '', // 审核不通过理由
    }
  },
  methods: {
    auditPurchase() {
      this.$store.commit('SET_BTN_LOADING', true)
      ORDER_API_RETAIL_ORDER_MASTER_AUDIT({
        MasterCode: this.selectRetail.MasterCode,
        CheckNote: this.auditReson
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
            type: 'success'
          })
          this.$emit('update:visible', false)
          this.$emit('listenAuditDialog')
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    }
  }
}
</script>
<style lang="scss" scoped="true">
.el-radio-group {
  line-height: 36px;
}
</style>