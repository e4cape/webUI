<template>
  <!-- @module Dialog·审核 -->
  <el-dialog title="审核" :visible="visible" @update:visible="$emit('update:visible', $event)" @open="dialogShow" @close="$emit('listenAuditDialog', false)">
    <el-form :label-position="'right'" label-width="100px">
      <el-row v-if="data.length === 1">
        <el-col :span="8">
          <el-form-item label="单据编号：">
            <span>{{data[0].OutakeCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="创建：">
            <span>{{data[0].CreateUser + '&nbsp;&nbsp;&nbsp;'}}{{data[0].CreateTime | filterDateMinutes}}</span>
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
              <el-radio :label="YNStatus.No">审核退回</el-radio>
            </el-col>
            <el-col :span="16" v-show="auditType === YNStatus.No">
              <el-input v-model="auditReson" placeholder="退回原因备注" :maxlength="200"></el-input>
            </el-col>
          </el-row>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="auditAdjust" :loading="$store.getters.is_loading" name="btnAuditAdjust">确 定</el-button>
      <el-button @click="$emit('update:visible', false)" name="btnCancel">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·审核 -->
</template>

<script>
import { YNStatus } from '@/enums/common.js'
import {
  STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_AUDITS,
  STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_REJECTS,
  STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_AUDIT,
  STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_REJECT
} from '@/apis/stocking.js'

export default {
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    data: {
      default() {
        return []
      },
      type: Array
    }
  },
  data() {
    return {
      YNStatus,
      auditType: YNStatus.Yes, // 审核状态 1代表通过 3代表不通过
      auditReson: '' // 审核不通过理由
    }
  },
  methods: {
    dialogShow() {
      this.auditType = YNStatus.Yes
      this.auditReson = ''
    },
    auditAdjust() {
      let result
      if (this.data.length > 1) {
        let param = {
          CheckNote: this.auditReson,
          Items: this.data.map(item => {
            return { OutakeId: item.OutakeId }
          })
        }
        if (this.auditType == YNStatus.Yes) {
          result = STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_AUDITS(param)
        } else {
          result = STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_REJECTS(param)
        }
      } else {
        let param = {
          CheckNote: this.auditReson,
          OutakeId: this.data[0].OutakeId
        }
        if (this.auditType == YNStatus.Yes) {
          result = STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_AUDIT(param)
        } else {
          result = STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_REJECT(param)
        }
      }
      result.then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
            type: 'success'
          })
          this.$store.commit('SET_BTN_LOADING', false)
          this.$emit('listenAuditDialog', true)
          this.$emit('update:visible', false)
        }
        this.$store.commit('SET_BTN_LOADING', false)
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
