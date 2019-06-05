<template>
  <!-- @module Dialog·审核 -->
  <el-dialog title="审核" :visible.sync="visible" @close="$emit('listenAuditDialog', 'auditDialog', success)">
    <el-form :label-position="'right'" @submit.native.prevent label-width="100px">
      <el-row v-if="data.length > 1">
        <el-col :span="8">
          <el-form-item label="单据编号：">
            <span>{{data[0].ReportCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="创建：">
            <span>{{data[0].CreateUser}}&nbsp;&nbsp;&nbsp;{{data[0].CreateTime|filterDateTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="审核结果：">
        <el-radio-group v-model="auditType" name="auditType">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-radio :label="YNStatus.Yes">审核通过</el-radio>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col v-if="StuffCountReportBasicSourceType.Taking == data[0].SourceType" :span="8">
              <el-radio :label="YNStatus.No">作废</el-radio>
            </el-col>
            <el-col v-else :span="8">
              <el-radio :label="YNStatus.No">审核退回</el-radio>
            </el-col>
            <el-col :span="16" v-show="auditType === YNStatus.No">
              <el-input v-model="auditReson" placeholder="原因备注" :maxlength="200" name="auditReson"></el-input>
            </el-col>
          </el-row>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="auditStockloss" :loading="$store.getters.is_loading" name="btnAuditStockloss">确 定</el-button>
      <el-button @click="visible = false" name="btnCancel">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·审核 -->
</template>

<script>
import {
  YNStatus
} from '@/enums/common.js'
import { StuffCountReportBasicSourceType } from '@/enums/stocking.js'
import {
  STOCKING_API_STUFF_COUNT_REPORT_BASIC_AUDIT1,
  STOCKING_API_STUFF_COUNT_REPORT_BASIC_REJECT1,
} from '@/apis/stocking.js'

export default {
  props: {
    auditDialog: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      YNStatus,
      StuffCountReportBasicSourceType,
      visible: this.auditDialog,
      success: false,
      auditType: YNStatus.Yes, // 审核状态 1代表通过 3代表不通过
      auditReson: '',// 审核不通过理由
    }
  },
  methods: {
    auditStockloss() {
      let ReportId = ''
      let apiMethod = ''
      let obj = {}
      ReportId = this.data[0].ReportId
      obj = Object.assign({}, {ReportId: ReportId, CheckNote: this.auditReson})
      
      // 来源是盘点的没有审核回退而是作废
      if (this.auditType === this.YNStatus.No) {
        apiMethod = STOCKING_API_STUFF_COUNT_REPORT_BASIC_REJECT1
      }else{
        apiMethod = STOCKING_API_STUFF_COUNT_REPORT_BASIC_AUDIT1
      }
      this.$store.commit('SET_BTN_LOADING', true)
      apiMethod(obj).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
            type: 'success'
          })
          this.$store.commit('SET_BTN_LOADING', false)
          this.success = true
          this.visible = false
          this.$emit('listenAuditDialog', 'auditDialog', this.success)
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    }
  },
  mounted(){
    console.log('data', this.data)
  }
}
</script>

<style lang="scss" scoped>
.el-radio-group {
  line-height: 36px;
}
</style>
