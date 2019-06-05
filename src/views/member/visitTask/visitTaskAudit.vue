<template>
  <!-- @module Dialog·审核 -->
  <el-dialog title="审核" :visible.sync="visible">
    <el-form :label-position="'right'" label-width="100px">
      <el-row v-if="item">
        <el-col :span="8">
          <el-form-item label="任务名称：">
            <span>{{item.taskName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="创建：">
            <span>{{item.createUser + '&nbsp;&nbsp;&nbsp;' + item.createTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="审核结果：">
        <el-col :span="24">
          <el-radio name="radioPass" :label="true" v-model="auditType">审核通过</el-radio>
        </el-col>
        <el-col :span="5">
          <el-radio name="radioReturn" :label="false" v-model="auditType">审核退回</el-radio>
        </el-col>
        <el-col :span="16" v-show="!auditType">
          <el-input name="inputAuditReson" v-model="auditReson" placeholder="退回原因备注" :maxlength="200"></el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button name="btnAuditPurchase" type="primary" @click="auditPurchase" :loading="$store.getters.is_loading">确 定</el-button>
      <el-button name="btnCancel" @click="visible = false">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·审核 -->
</template>

<script>
import {
  YNStatus
} from '@/enums/common.js'
import {
  VisitTaskStatus
} from '@/enums/membership'
import {
  MEMBERSHIP_API_VISITTASK_AUDIT,
  MEMBERSHIP_API_VISITTASK_BATCHAUDIT
} from '@/apis/membership.js'

export default {
  props: {
    data: {
      default: new Array(),
      type: Array
    },
    auditDialog: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      YNStatus,
      visitTaskStatus: VisitTaskStatus,
      visible: this.auditDialog,
      auditType: true, // 审核状态 1代表通过 3代表不通过
      auditReson: '', // 审核不通过理由
      success: false
    }
  },
  computed: {
    item() {
      if (this.data.length === 1) {
        return this.data[0]
      }
      return null
    }
  },
  methods: {
    auditPurchase() {
      this.$store.commit('SET_BTN_LOADING', true)
      let api

      let params = {
        result: this.auditType
          ? this.visitTaskStatus.Pass
          : this.visitTaskStatus.Returned,
        auditComment: this.auditReson
      }
      if (this.item) {
        api = MEMBERSHIP_API_VISITTASK_AUDIT
        params.visitTaskId = this.item.visitTaskId
      } else {
        api = MEMBERSHIP_API_VISITTASK_BATCHAUDIT
        params.visitTaskIds = this.data.map(v => v.visitTaskId)
      }
      api(params).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message || '操作成功!',
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
      this.$emit('listenAllDialog', this.success, 'auditDialog')
    }
  }
}
</script>
<style lang="scss" scoped>
.el-radio-group {
  line-height: 36px;
}
</style>

