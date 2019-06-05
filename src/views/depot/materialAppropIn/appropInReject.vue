<template>
  <!-- @module Dialog·退回 -->
  <el-dialog title="退回" :visible.sync="visible" @update:visible="$emit('update:visible', $event)" @open="rejectReason = ''" @close="$emit('listenRejectDialog', false)">
    <el-form :label-position="'right'" label-width="100px"  @submit.native.prevent>
      <el-row v-if="data.length === 1">
        <el-col :span="12">
          <el-form-item label="单据编号：">
            <span>{{data[0].OutakeCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发货：">
            <span>{{data[0].SendTime | filterDateMinutes}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="退回原因：">
          <el-input v-model="rejectReason" placeholder="退回原因备注" :maxlength="200" name="rejectReason"></el-input>
        </el-form-item>
      </el-row>
      <!-- <el-row>
        退回后该单据回退到调拨出库的门店，并且不在本店显示，确定退回？
      </el-row> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="makeReject" :loading="$store.getters.is_loading" name="btnMakeReject">确 定</el-button>
      <el-button @click="$emit('update:visible', false)" name="btnCanCel">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·退回 -->
</template>

<script>
import {
  STOCKING_API_STUFF_ALLOT_ORDER_INTAKE_REJECTS,
  STOCKING_API_STUFF_ALLOT_ORDER_INTAKE_REJECT
} from '@/apis/stocking.js'

export default {
  props: {
    visible: {
      type: Boolean,
      default: true
    },
    data: Array
  },
  data() {
    return {
      rejectReason: '',
    }
  },
  methods: {
    makeReject() {
      this.$store.commit('SET_BTN_LOADING', true)
      let result
      if (this.data.length > 1) {
        result = STOCKING_API_STUFF_ALLOT_ORDER_INTAKE_REJECTS({
          Items: this.data.map(item => {
            return { IntakeId: item.IntakeId }
          }),
          CheckNote: this.rejectReason
        })
      } else {
        result = STOCKING_API_STUFF_ALLOT_ORDER_INTAKE_REJECT({
          IntakeId: this.data[0].IntakeId,
          CheckNote: this.rejectReason
        })
      }
      result.then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
            type: 'success'
          })
          this.$emit('update:visible', false)
          this.$emit('listenRejectDialog', true)
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    }
  },
 
}
</script>

