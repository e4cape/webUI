<template>
  <!-- @module Dialog·审核 -->
  <el-dialog :title="title" :visible.sync="visible" width="750px" @close="cancelAudit">
    <el-form :label-position="'right'" label-width="100px">
      <el-row v-if="data.length === 1">
        <el-col :span="10">
          <el-form-item label="单据编号：">
            <span :title="data[0].orderNumber" class="orderNumber">{{data[0].orderNumber}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="创建：">
            <span class="orderNumber">{{data[0].CreateUser}} {{data[0].CreateTime | filterDateTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="审核结果：">
        <el-radio-group v-model="returnInfo.auditType" name="auditType">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-radio :label="YNStatus.Yes">审核通过</el-radio>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-radio :label="YNStatus.No" style="padding-top: 10px;">审核退回</el-radio>
            </el-col>
            <el-col :span="16" v-show="returnInfo.auditType === YNStatus.No">
              <el-input v-model="returnInfo.auditReson" @blur="returnInfo.auditReson = returnInfo.auditReson.trim()" placeholder="退回原因备注" :maxlength="200" name="auditReson"></el-input>
            </el-col>
          </el-row>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="auditStockloss" :loading="$store.getters.is_loading" name="btnAuditStockloss">确 定</el-button>
      <el-button @click="cancelAudit" name="btnCancel">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·审核 -->
</template>

<script>
import { YNStatus } from '@/enums/common.js'
export default {
  props: {
    auditDialog: Boolean, data: Array, title: String
  },
  data() {
    return {
      YNStatus,
      visible: this.auditDialog,
      success: false,
      returnInfo: {
        auditType: YNStatus.Yes, // 审核状态 1代表通过 3代表不通过
        auditReson: '' // 审核不通过理由
      }
    }
  },
  methods: {
    auditStockloss() {
      this.$store.commit('SET_BTN_LOADING', true)
      this.$emit('confirmClick', this.returnInfo)
    },
    cancelAudit() {
      this.returnInfo = {
        auditType: YNStatus.Yes,
        auditReson: ''
      }
      this.visible = false
      this.$emit('cancelClick', false)
    },
  },
  watch: {
  }
}
</script>

<style lang="scss" scoped>
.el-radio-group {
  line-height: 36px;
}
.orderNumber {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
