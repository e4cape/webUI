<template>
  <!-- @module Dialog·取消审核 -->
  <el-dialog title="取消审核" :visible.sync="visible">
    <el-form :label-position="'right'" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="单据编号：">
            <span>{{data.visitTaskId}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建：">
            <span>{{data.createUser + '&nbsp;&nbsp;&nbsp;' + data.createTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="取消原因：">
          <el-input name="inputCancelReson" v-model="cancelReson" placeholder="取消审核原因备注" :maxlength="50"></el-input>
        </el-form-item>
      </el-row>
      <el-row>取消审核后该单据所产生的库存等业务数据也将回退，确定取消审核？</el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button name="btnMakeCancel" type="primary" @click="makeCancel" :loading="$store.getters.is_loading">确 定</el-button>
      <el-button name="btnCancel" @click="visible = false">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·取消审核 -->
</template>
<script>
import {
  VisitTaskStatus
} from '@/enums/membership'
import {
  MEMBERSHIP_API_VISITTASK_AUDIT
} from '@/apis/membership.js'

export default {
  props: {
    data: {
      default: new Object(),
      type: Object
    },
    cancelDialog: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      visible: this.cancelDialog,
      cancelReson: '',
      success: false
    }
  },
  methods: {
    makeCancel() {
      this.$store.commit('SET_BTN_LOADING', true)
      MEMBERSHIP_API_VISITTASK_AUDIT({
        visitTaskId: this.data.visitTaskId,
        result: VisitTaskStatus.Cancel,
        auditComment: this.cancelReson
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message || '取消成功!',
            type: 'success'
          })
          this.$store.commit('SET_BTN_LOADING', false)
          this.success = true
          this.visible = false
        } else {
          /<[^>]+>/g.test(res.data.Message) && this.$alert(res.data.Message, '错误', {
            dangerouslyUseHTMLString: true
          })
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    }
  },
  watch: {
    visible() {
      this.$emit('listenAllDialog', this.success, 'cancelDialog')
    }
  }
}
</script>
