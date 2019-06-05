<template>
  <!-- @module Dialog·取消审核 -->
  <el-dialog
    title="取消审核"
    width="600px"
    :visible.sync="visible"
  >
    <el-form
      :label-position="'right'"
      label-width="100px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="单据编号：">
            <span>{{cancelGiveCoupon.giveId}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建：">
            <span>{{cancelGiveCoupon.createUser + '&nbsp;&nbsp;&nbsp;' + cancelGiveCoupon.createTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="取消原因：">
          <el-input
            name="inputCancelReson"
            v-model="cancelReson"
            placeholder="取消审核原因备注"
            :maxlength="200"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        取消审核后该单据所产生的库存等业务数据也将回退，确定取消审核？
      </el-row>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        name="btnMakeCancel"
        type="primary"
        @click="makeCancel"
        :loading="$store.getters.is_loading"
      >确 定</el-button>
      <el-button
        name="btnCancel"
        @click="visible = false"
      >取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·取消审核 -->
</template>
<script>
import {
  STOCKING_API_PURCHASE_ORDERCANCEL 
} from '@/apis/stocking.js'

export default {
  props: ['cancelGiveCoupon', 'cancelDialog'],
  data() {
    return {
      visible: this.cancelDialog,
      cancelReson: '',
      success: false
    }
  },
  methods: {
    makeCancel() {
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_PURCHASE_ORDERCANCEL({
        PurchaseId: this.cancelGiveCoupon.PurchaseId,
        CheckNote: this.cancelReson
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
          this.$alert(res.data.Message, '错误', {
            dangerouslyUseHTMLString: true
          })
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    }
  },
  watch: {
    visible() {
      this.$emit('listenCancelDialog', this.success)
    }
  }
}
</script>
