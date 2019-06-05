<template>
  <!-- @module Dialog·取消审核 -->
  <el-dialog title="取消审核" :visible.sync="visible" @close="$emit('listenCancelDialog', 'cancelDialog', success)">
    <el-form :label-position="'right'" @submit.native.prevent label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="单据编号：">
            <span>{{data[0].SendCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建：">
            <span>{{data[0].CreateUser}}&nbsp;&nbsp;&nbsp;{{data[0].CreateTime|filterDateTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="取消原因：">
          <el-input v-model="cancelReson" placeholder="取消审核原因备注" :maxlength="200" name="cancelReson"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        取消审核后该单据所产生的库存等业务数据也将回退，确定取消审核？
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="makeCancel" :loading="$store.getters.is_loading" name="btnMakeCancel">确 定</el-button>
      <el-button @click="visible = false" name="btnCancel">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·取消审核 -->
</template>
<script>
import {
  STOCKING_API_WEIW_STUFF_SEND_BASIC_CANCEL 
} from '@/apis/stocking.js'

export default {
  // props: ['data', 'cancelDialog'],
  props: {
    cancelDialog: {
      default: false,
      type: Boolean
    },
    data: {
      default(){
        return []
      },
      type: Array
    }
  },
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
      STOCKING_API_WEIW_STUFF_SEND_BASIC_CANCEL({
        SendId: this.data[0].SendId,
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
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    }
  }
}
</script>
