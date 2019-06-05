<template>
  <!-- @module Dialog·取消审核 -->
  <el-dialog title="取消审核" :visible="visible" @update:visible="$emit('update:visible', $event)">
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
        <el-form-item label="取消原因：">
          <el-input v-model="cancelReason" placeholder="取消审核原因备注" :maxlength="200" name="cancelReason"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        取消审核后该单据所产生的库存等业务数据也将回退，确定取消审核？
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cancel" :loading="$store.getters.is_loading" name="btnMakeCancel">确 定</el-button>
      <el-button @click="$emit('update:visible', false)" name="btnCancel">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·取消审核 -->
</template>
<script>
import { STOCKING_API_GOODS_COUNT_REPORT_BASIC_CANCEL2 } from '@/apis/stocking.js'

export default {
  props: {
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
      cancelReason: '',
    }
  },
  methods: {
    cancel() {
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_GOODS_COUNT_REPORT_BASIC_CANCEL2({
        ReportId: this.data.ReportId,
        CheckNote: this.cancelReason
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
            type: 'success'
          })
          this.cancelReason = ''
          this.$emit('listenCancelDialog')
          this.$emit('update:visible', false)
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    }
  },
}
</script>

