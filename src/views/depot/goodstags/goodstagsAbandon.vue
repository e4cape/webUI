<template>
  <!-- @module Dialog·作废 -->
  <el-dialog title="作废" :visible.sync="visible">
    <el-form :label-position="'right'" label-width="100px">
      <el-row>
        您正在进行删除操作，删除后不可恢复！确定删除？
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button name="makeAbandon" type="primary" @click="makeAbandon" :loading="$store.getters.is_loading">确 定</el-button>
      <el-button name="cancel" @click="visible = false">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·作废 -->
</template>
<script>
import {
  STOCKING_API_GOODSTAGS_DELETE 
} from '@/apis/stocking.js'

export default {
  props: ['selections', 'abandonDialog'],
  data() {
    return {
      visible: this.abandonDialog,
      abandonReson: '',
      success: false
    }
  },
  methods: {
    makeAbandon() {
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_GOODSTAGS_DELETE(this.selections[0].TagId).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
            type: 'success'
          })
          this.$store.commit('SET_BTN_LOADING', false)
          this.success = true
          this.visible = false
        } else {
          this.$message.error(res.data.Message)
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    }
  },
  watch: {
    visible() {
      this.$emit('listenAllDialog', 'abandonDialog', this.success)
    }
  }
}
</script>
