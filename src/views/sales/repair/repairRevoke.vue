<template>
  <!-- @module Dialog·撤回维修处理 -->
  <el-dialog title="撤回" :visible="visible" @update:visible="$emit('update:visible', $event)" @close="abandonReson = ''">
    <el-form :label-position="'right'" label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="单据编号：">
            <span>{{selections.RepairCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建：">
            <span>{{selections.CreateUser + '&nbsp;&nbsp;&nbsp;'}} {{selections.CreateTime | filterDateMinutes}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="撤回原因：">
          <el-input v-model="abandonReson" placeholder="撤回原因备注" :maxlength="200" name="abandonReson"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        撤回后该单据的操作将回退到上一步，确定撤回？
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="makeAbandon" :loading="$store.getters.is_loading" name="btnMakeAbandon">确 定</el-button>
      <el-button @click="$emit('update:visible', false)" name="btnCancel">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·撤回维修处理 -->
</template>
<script>
import { STOCKING_API_GOODS_REPAIR_ORDER_BASIC_PRESTATE } from '@/apis/stocking.js'
import { GoodsRepairOrderBasicStepState } from '@/enums/stocking.js'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selections: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      abandonReson: '',
    }
  },
  methods: {
    makeAbandon() {
      let step = 0
      switch (this.selections.StepState) {
        case GoodsRepairOrderBasicStepState.Return:
          step = GoodsRepairOrderBasicStepState.Paid
          break
        case GoodsRepairOrderBasicStepState.Paid:
          step = GoodsRepairOrderBasicStepState.Repairing
          break
        case GoodsRepairOrderBasicStepState.Repairing:
          step = GoodsRepairOrderBasicStepState.Wait
          break
        default:
          break
      }
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_GOODS_REPAIR_ORDER_BASIC_PRESTATE({
        RepairId: this.selections.RepairId,
        StepState: step,
        CheckNote: this.abandonReson
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
            type: 'success'
          })
          this.$emit('update:visible', false)
          this.$emit('listenrevokeDialog')
        } 
        this.$store.commit('SET_BTN_LOADING', false)
      })
    }
  }
  
}
</script>
