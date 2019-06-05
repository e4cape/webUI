<template>
  <!-- @module Dialog·作废 -->
  <el-dialog title="作废" :visible.sync="visible" width="580px">
    <el-form :label-position="'right'" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="单据编号：">
            <span>{{abandonAdjust.PriceCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建：">
            <span>{{abandonAdjust.CreateUser}}&nbsp;&nbsp;&nbsp;{{abandonAdjust.CreateTime | filterDateTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="作废原因：">
          <el-input
            v-model="abandonReason"
            placeholder="作废原因备注"
            :maxlength="200"
            name="abandonReason"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>作废后该单据所产生的库存等业务数据也将回退，确定作废？</el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="makeAbandon"
        :loading="$store.getters.is_loading"
        name="btnMakeAbandon"
      >确 定</el-button>
      <el-button @click="visible = false" name="btnCancel">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·作废 -->
</template>
<script>
import { STOCKING_API_GOODS_PRICE_ORDER_BASIC_ABANDON } from '@/apis/stocking.js'

export default {
  props: {
    abandonDialog: {
      type: Boolean,
      default: false
    },
    abandonAdjust: {
      type: Object
    }
  },
  data() {
    return {
      abandonReason: '',
      success: false,
      visible: this.abandonDialog
    }
  },
  methods: {
    makeAbandon() {
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_GOODS_PRICE_ORDER_BASIC_ABANDON({
        PriceId: this.abandonAdjust.PriceId,
        CheckNote: this.abandonReason
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
      this.$emit('listenAbandonDialog', this.success)
    }
  }
}
</script>
