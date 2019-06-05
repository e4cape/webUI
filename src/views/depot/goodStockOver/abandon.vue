<template>
  <!-- @module Dialog·作废 -->
  <el-dialog title="作废" :visible="visible" @update:visible="$emit('update:visible', $event)" @open="abandonReason = ''">
    <el-form :label-position="'right'" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="单据编号：">
            <span>{{data.ReportCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建：">
            <span>{{data.CreateUser + '&nbsp;&nbsp;&nbsp;'}}{{data.CreateTime | filterDateMinutes}}</span>
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
      <el-button type="primary" @click="abandon" :loading="$store.getters.is_loading" name="btnMakeAbandon">确 定</el-button>
      <el-button @click="$emit('update:visible', false)" name="btnCancel">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·作废 -->
</template>
<script>
import { GoodsCountReportBasicSourceType } from '@/enums/stocking.js'
import {
  STOCKING_API_GOODS_COUNT_REPORT_BASIC_ABANDON2,
  STOCKING_API_GOODS_COUNT_REPORT_BASIC_REJECT2
} from '@/apis/stocking.js'

export default {
  props:{
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      defaul: {}
    }
  },
  data() {
    return {
      abandonReason: '',
    }
  },
  methods: {
    abandon() {
      this.$store.commit('SET_BTN_LOADING', true)
      let api =
        this.data.SourceType ===
        GoodsCountReportBasicSourceType.Manual
          ? STOCKING_API_GOODS_COUNT_REPORT_BASIC_ABANDON2
          : STOCKING_API_GOODS_COUNT_REPORT_BASIC_REJECT2
      api({
        ReportId: this.data.ReportId,
        CheckNote: this.abandonReason
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
            type: 'success'
          })
          this.abandonReason = ''
          this.$emit('listenAbandonDialog')
          this.$emit('update:visible', false)
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    }
  },
}
</script>

