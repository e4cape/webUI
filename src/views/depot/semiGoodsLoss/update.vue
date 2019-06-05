<template>
  <div>
    <!-- @module Dialog·修改报损单 -->
    <el-dialog title="修改" :visible="visible" @update:visible="$emit('update:visible', $event)">
      <el-form :model="data" label-position="right" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：">
              <el-input type="textarea" :rows="3" v-model="data.Note" :maxlength="200" name="note"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="update" :loading="editLoading" name="btnUpdate">确 定</el-button>
        <el-button @click="$emit('update:visible', false)" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog 修改报损单 -->
  </div>
</template>

<script>
import { STOCKING_API_HALF_COUNT_REPORT_BASIC_UPDATE } from '@/apis/stocking.js'

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
      editLoading: false
    }
  },
  methods: {
    update() {
      this.editLoading = true
      STOCKING_API_HALF_COUNT_REPORT_BASIC_UPDATE({
        ReportId: this.data.ReportId,
        Note: this.data.Note
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
            type: 'success'
          })
          this.$emit('update:visible', false)
          this.$emit('listenEditDialog')
          this.editLoading = false
        }
      })
    }
  }
}
</script>

