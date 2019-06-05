<template>
  <!-- @module Dialog·审核 -->
  <el-dialog title="审核" :visible="visible" @update:visible="$emit('update:visible', $event)" @open="dialogShow" @close="$emit('listenAuditDialog', false)">
    <el-form :label-position="'right'" label-width="100px" @submit.native.prevent>
      <el-row v-if="data.length === 1">
        <el-col :span="8">
          <el-form-item label="单据编号：">
            <span>{{data[0].ReportCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="创建：">
            <span>{{data[0].CreateUser + '&nbsp;&nbsp;&nbsp;'}} {{data[0].CreateTime | filterDateMinutes}}</span>
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
            <el-col :span="8">
              <el-radio :label="YNStatus.No">{{data[0] && data[0].SourceType !== HalfCountReportBasicSourceType.Taking ? '审核退回' : '作废'}}</el-radio>
            </el-col>
            <el-col :span="16" v-show="auditType === YNStatus.No">
              <el-input v-model="auditReason" :placeholder="(data[0] && data[0].SourceType !== HalfCountReportBasicSourceType.Taking ? '退回' : '作废') + '原因备注'" :maxlength="200" name="auditReason"></el-input>
            </el-col>
          </el-row>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="audit" :loading="$store.getters.is_loading" name="btnAudit">确 定</el-button>
      <el-button @click="$emit('update:visible', false)" name="btnCancel">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·审核 -->
</template>

<script>
import { HalfCountReportBasicSourceType } from '@/enums/stocking.js'
import { YNStatus } from '@/enums/common.js'
import {
  STOCKING_API_HALF_COUNT_REPORT_BASIC_AUDITS2,
  STOCKING_API_HALF_COUNT_REPORT_BASIC_AUDIT2,
  STOCKING_API_HALF_COUNT_REPORT_BASIC_REJECTS2,
  STOCKING_API_HALF_COUNT_REPORT_BASIC_REJECT2
} from '@/apis/stocking.js'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      defaul: []
    }
  },
  data() {
    return {
      YNStatus,
      HalfCountReportBasicSourceType,
      auditType: YNStatus.Yes, // 审核状态 1代表通过 3代表不通过
      auditReason: '' // 审核不通过理由
    }
  },
  methods: {
    // 重置表单
    dialogShow() {
      this.auditType = YNStatus.Yes
      this.auditReson = ''
    },
    audit() {
      let result
      if (this.data.length > 1) {
        let param = {
          CheckNote: this.auditReason,
          Items: this.data.map(item => {
            return {
              ReportId: item.ReportId
            }
          })
        }
        result =
          this.auditType === YNStatus.Yes
            ? STOCKING_API_HALF_COUNT_REPORT_BASIC_AUDITS2(param)
            : STOCKING_API_HALF_COUNT_REPORT_BASIC_REJECTS2(param)
      } else {
        let param = {
          CheckNote: this.auditReason,
          ReportId: this.data[0].ReportId
        }
        result =
          this.auditType === YNStatus.Yes
            ? STOCKING_API_HALF_COUNT_REPORT_BASIC_AUDIT2(param)
            : STOCKING_API_HALF_COUNT_REPORT_BASIC_REJECT2(param)
      }
      this.$store.commit('SET_BTN_LOADING', true)
      result
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            this.$emit('listenAuditDialog', true)
            this.$emit('update:visible', false)
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
        .catch(() => {
          this.$emit('update:visible', false)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-radio-group {
  line-height: 36px;
}
</style>
