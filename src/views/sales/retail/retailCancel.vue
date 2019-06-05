
<template  >
  <!--  @module Dialog·取消审核  -->
  <el-dialog title="取消审核" :visible="visible" @update:visible="$emit('update:visible', $event)" @close="cancelReson = ''">
    <el-form :label-position="'right'" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="单据编号：">
            <span>{{selectRetail.MasterCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建：">
            <span>{{selectRetail.OrderTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="取消原因：">
          <el-input v-model="cancelReson" placeholder="取消审核原因备注" :maxlength="200" name="cancelReson"></el-input>
        </el-form-item>
      </el-row>
      <el-row>取消审核后该单据所产生的库存等业务数据也将回退，确定取消审核？</el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="makeCancel" :loading="$store.getters.is_loading" name="btn-confirm">确 定</el-button>
      <el-button @click="$emit('update:visible', false)" name="btn-cancel">取 消</el-button>
    </span>
  </el-dialog>
  <!--  End Dialog·取消审核  -->
</template>
<script>
import { ORDER_API_RETAIL_ORDER_MASTER_CANCELAUDIT } from '@/apis/order.js'
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
      cancelReson: '',
    }
  },
  methods: {
    makeCancel() {
      this.$store.commit('SET_BTN_LOADING', true)
      ORDER_API_RETAIL_ORDER_MASTER_CANCELAUDIT({
        MasterCode: this.selectRetail.MasterCode,
        CheckNote: this.cancelReson
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
            type: 'success'
          })
          this.$emit('update:visible', false)
          this.$emit('listenCancelDialog')
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    }
  },
}
</script>