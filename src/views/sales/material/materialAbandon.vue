
<template  >
  <!--  @module Dialog·作废  -->
  <el-dialog title="作废" :visible.sync="visible">
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
        <el-form-item label="作废原因：">
          <el-input
            v-model="abandonReson"
            placeholder="作废原因备注"
            :maxlength="200"
            name="abandonReson"
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
        name="btn-confirm"
      >确 定</el-button>
      <el-button @click="visible = false" name="btn-cancel">取 消</el-button>
    </span>
  </el-dialog>
  <!--  End Dialog·作废  -->
</template>
<script>
import {
  ORDER_API_RETAIL_ORDER_RETURN_ABANDON 
} from '@/apis/order.js'

export default {
  // props: ['data', 'abandonDialog'],
  props: {
    data: {
      default() {
        return {}
      },
      type: Object
    },
    abandonDialog: {
      default: false,
      type: Boolean
    },
  },
  data() {
    return {
      visible: this.abandonDialog,
      abandonReson: '',
      success: false
    }
  },
  methods: {
    makeAbandon() {
      this.$store.commit('SET_BTN_LOADING', true)
      ORDER_API_RETAIL_ORDER_RETURN_ABANDON({
        ReturnCode: this.data.ReturnCode,
        CheckNote: this.abandonReson
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