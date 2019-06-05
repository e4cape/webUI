<template>
  <!-- @module Dialog·作废 -->
  <el-dialog title="作废" :visible.sync="visible">
    <el-form :label-position="'right'" @submit.native.prevent label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="单据编号：">
            <span>{{data[0].ReportCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建：">
            <span>{{data[0].CreateUser}}&nbsp;&nbsp;&nbsp;{{data[0].CreateTime|filterDateTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="作废原因：">
          <el-input v-model="abandonReason" placeholder="作废原因备注" :maxlength="200" name="abandonReson"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        作废后该单据所产生的库存等业务数据也将回退，确定作废？
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="makeAbandon" :loading="$store.getters.is_loading" name="btnMakeAbandon">确 定</el-button>
      <el-button @click="visible = false" name="btnCancel">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·作废 -->
</template>
<script>
import {
  STOCKING_API_STUFF_COUNT_REPORT_BASIC_ABANDON1 
} from '@/apis/stocking.js'

export default {
  // props: ['abandonDialog', 'data'],
  props: {
    abandonDialog: {
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
      abandonReason: '',
      success: false,
      visible: this.abandonDialog
    }
  },
  methods: {
    makeAbandon() {
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_STUFF_COUNT_REPORT_BASIC_ABANDON1({
        ReportId: this.data[0].ReportId,
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
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    }
  },
  watch: {
    visible() {
      this.$emit('listenAbandonDialog', 'abandonDialog', this.success)
    }
  }
}
</script>

