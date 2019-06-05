<template>
  <!-- @module Dialog·审核 -->
  <el-dialog
    title="审核"
    width="600px"
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
  >
    <el-form
      :label-position="'right'"
      label-width="100px"
    >
      <el-row>
        <el-col :span="10">
          <el-form-item label="单据编号：">
            <span>{{data.giveId}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="创建：">
            <span>{{data.createUser + '&nbsp;&nbsp;&nbsp;' + data.createTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="审核结果：">
        <el-radio-group
          name="radioGroupIsPass"
          v-model="isPass"
        >
          <el-row :gutter="10">
            <el-col :span="24">
              <el-radio
                name="radioPass"
                :label="true"
              >审核通过</el-radio>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-radio
                name="radioReturn"
                :label="false"
              >审核退回</el-radio>
            </el-col>
            <el-col
              :span="16"
              v-show="!isPass"
            >
              <el-input
                name="inputCheckNote"
                v-model="checkNote"
                placeholder="退回原因备注"
                :maxlength="200"
              ></el-input>
            </el-col>
          </el-row>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        name="btnAuditGive"
        type="primary"
        @click="auditGive"
        :loading="$store.getters.is_loading"
      >确 定</el-button>
      <el-button
        name="btnOnClose"
        @click="onClose"
      >取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·审核 -->
</template>

<script>
import {
  MEMBERSHIP_API_GIVECOUPON_AUDIT 
} from '@/apis/membership.js'

export default {
  props: ['data', 'visible'],
  data() {
    return {
      isPass: true, // 审核状态 1代表通过 3代表不通过
      checkNote: '', // 审核不通过理由
      success: false
    }
  },
  methods: {
    onClose() {
      this.$emit('update:visible', false)
    },
    auditGive() {
      this.$store.commit('SET_BTN_LOADING', true)
      MEMBERSHIP_API_GIVECOUPON_AUDIT({
        isPass: this.isPass,
        giveId: this.data.giveId,
        checkNote: this.checkNote
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.$store.commit('SET_BTN_LOADING', false)
          this.success = true
          this.$emit('success')
          this.onClose()
        } else {
          this.$message.error(res.data.Message)
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

