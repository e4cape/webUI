<template>
  <!-- @module Dialog·审核 -->
  <el-dialog title="审核" :visible.sync="visible">
    <el-form :label-position="'right'" @submit.native.prevent label-width="100px">
      <el-row v-if="data.length === 1">
        <el-col :span="8">
          <el-form-item label="单据编号：">
            <span>{{data[0].OutakeCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="创建：">
            <span>{{data[0].CreateUser}}&nbsp;&nbsp;&nbsp;{{data[0].CreateTime|filterDateTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="审核结果：">
        <el-radio-group v-model="auditType">
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
              <el-input v-model="auditReson" placeholder="退回原因备注" :maxlength="200" name="auditReson"></el-input>
            </el-col>
          </el-row>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="auditReturn" :loading="$store.getters.is_loading" name="btnAuditReturn">确 定</el-button>
      <el-button @click="visible = false" name="btnCancel">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·审核 -->
</template>

<script>
import {
  STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_AUDITS,
  STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_AUDIT,
  STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_REJECTS,
  STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_REJECT
} from '@/apis/stocking.js'
import {
  YNStatus
} from '@/enums/common.js'

export default {
  // props: ['auditDialog', 'data'],
  props: {
    auditDialog: {
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
      YNStatus,
      visible: this.auditDialog,
      success: false,
      auditType: YNStatus.Yes, // 审核状态 1代表通过 3代表不通过
      auditReson: '', // 审核不通过理由
      isOne: false
    }
  },
  methods: {
    auditReturn() {
      let OutakeIds = []
      let OutakeId = ''
      let obj = {}
      if(this.data.length == 1){
        this.isOne = true
        OutakeId = this.data[0].OutakeId
        obj = Object.assign({}, {OutakeId: OutakeId, CheckNote: this.auditReson})
      }else{
        this.data.forEach(item => {
          OutakeIds.push({OutakeId: item.OutakeId})
        })
        obj = Object.assign({}, {Items: OutakeIds, CheckNote: this.auditReson})
      }
      let apiMethod = ''
      // 判断是批量还是单个
      if(this.isOne){
        if (this.auditType === this.YNStatus.No) {
          apiMethod = STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_REJECT
        }else{
          apiMethod = STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_AUDIT
        }
      }else{
        if (this.auditType === this.YNStatus.No) {
          apiMethod = STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_REJECTS
        }else{
          apiMethod = STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_AUDITS
        }
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
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    }
  },
  watch: {
    visible() {
      this.$emit('listenAuditDialog', 'auditDialog', this.success)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-radio-group {
  line-height: 36px;
}
</style>
