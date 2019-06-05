
<template  >
  <!--  @module Dialog·作废  -->
  <el-dialog title="作废" :visible="visible" @update:visible="$emit('update:visible', $event)" @close="abandonReson = ''">
    <el-form :label-position="'right'" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="单据编号：">
            <span>{{selectRetail.MasterCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建：">
            <!--  selectRetail.CreateUser + '&nbsp;&nbsp;&nbsp;' +   -->
            <span>{{selectRetail.OrderTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="作废原因：">
          <el-input v-model="abandonReson" placeholder="作废原因备注" :maxlength="200" name="abandonReson"></el-input>
        </el-form-item>
      </el-row>
      <el-row>作废后该单据所产生的库存等业务数据也将回退，确定作废？</el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="makeAbandon" :loading="$store.getters.is_loading" name="btn-confirm">确 定</el-button>
      <el-button @click="$emit('update:visible', false)" name="btn-cancel">取 消</el-button>
    </span>
  </el-dialog>
  <!--  End Dialog·作废  -->
</template>
<script>
import { ORDER_API_RETAIL_ORDER_MASTER_ABANDON } from '@/apis/order.js'

export default {
  // props: ['selectRetail', 'abandonDialog'],
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
      abandonReson: '',
    }
  },
  methods: {
    makeAbandon() {
      this.$store.commit('SET_BTN_LOADING', true)
      ORDER_API_RETAIL_ORDER_MASTER_ABANDON({
        MasterCode: this.selectRetail.MasterCode,
        CheckNote: this.abandonReson
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
            type: 'success'
          })
          this.$emit('listenAbandonDialog')
          this.$emit('update:visible', false)
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    }
  }
}
</script>