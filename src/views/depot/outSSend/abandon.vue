<template>
  <!-- @module Dialog·作废 -->
  <el-dialog title="作废" :visible.sync="visible" @close="$emit('listenAbandonDialog', 'abandonDialog', success)">
    <el-form :label-position="'right'" @submit.native.prevent label-width="100px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="单据编号：">
            <span>{{data[0].SendCode}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建：">
            <span>{{data[0].CreateUser}}&nbsp;&nbsp;&nbsp;{{data[0].CreateTime|filterDateTime}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="作废原因：">
          <el-input v-model="abandonReson" placeholder="作废原因备注" :maxlength="200" name="abandonReson"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        作废后该单据所产生的库存等业务数据也将回退，确定作废？
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="makeAbandon" :loading="$store.getters.is_loading" name="btnMakeAbandon">确 定</el-button>
      <el-button @click="visible = false" name="btnCancel">取 消</el-button>
    </span>
  </el-dialog>
  <!-- End Dialog·作废 -->
</template>
<script>
import { STOCKING_API_WEIW_STUFF_SEND_BASIC_ABANDON } from '@/apis/stocking.js'
export default {
  // props: ['data', 'abandonDialog'],
  props: {
    abandonDialog: {
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
  data () {
    return {
      visible: this.abandonDialog,
      abandonReson: '',
      success: false
    }
  },
  methods: {
    makeAbandon () {
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_WEIW_STUFF_SEND_BASIC_ABANDON({
        SendId: Number(this.data[0].SendId)||0,
        CheckNote: this.abandonReson
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if(res.data.Code == 'CORRECT'){
          this.visible = false
          this.success = true
        }
      })
    }
  }, 
}
</script>
