<template>
  <!-- @module Dialog·审核 -->
  <el-dialog title="取消审核" :visible="visible" @update:visible="$emit('update:visible', $event)">
    <el-form :label-position="'right'" @submit.native.prevent label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="单据编号：">
            <span>{{data[0].SplitCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="创建：">
            <span>{{data[0].CreateUser}}&nbsp;&nbsp;&nbsp;{{data[0].CreateTime|filterDateTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="取消原因：">
        <el-input v-model="cancelReson" placeholder="取消审核原因备注" :maxlength="200"></el-input>
      </el-form-item>
      <span>取消审核后该单据所产生的库存等业务数据也将回退，确定取消审核？</span>
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
import { STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_CANCEL } from '@/apis/stocking.js'

export default {
  // props: ['cancelDialog', 'listenCancelDialog', 'data'],
  props: {
    visible: {
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
      auditType: YNStatus.Yes, // 审核状态 1代表通过 3代表不通过
      cancelReson: '' // 审核不通过理由
    }
  },
  methods: {
    auditAdjust() {
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_CANCEL({
        SplitId: this.data[0].SplitId,
        CheckNote: this.cancelReson
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
            type: 'success'
          })
          this.$emit('update:visible', false)
          this.$emit('listenCancelDialog')
        }
      }).catch(() => {
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
