
<template  >
  <!--  @module Dialog·审核  -->
  <el-dialog title="审核" :visible.sync="visible">
    <el-form :label-position="'right'" label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="单据编号：">
            <span>{{data.ReturnCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="创建时间：">
            <span>{{data.CreateTime}}</span>
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
      <el-button
        type="primary"
        @click="auditPurchase"
        :loading="$store.getters.is_loading"
        name="btn-confirm"
      >确 定</el-button>
      <el-button @click="visible = false" name="btn-cancel">取 消</el-button>
    </span>
  </el-dialog>
  <!--  End Dialog·审核  -->
</template>
<script>
import {
  YNStatus 
} from '@/enums/common.js'
import {
  ORDER_API_RETAIL_ORDER_RETURN_AUDIT 
} from '@/apis/order.js'

export default {
  // props: ['data', 'auditDialog'],
  props: {
    data:{
      default(){
        return {}
      },
      type: Object
    },
    auditDialog:{
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
      this.$store.commit('SET_BTN_LOADING', true)
      ORDER_API_RETAIL_ORDER_RETURN_AUDIT({
        ReturnCode: this.data.ReturnCode,
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
<style lang="scss" scoped="true">
.el-radio-group {
  line-height: 36px;
}
</style>