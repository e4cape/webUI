<template>
  <div>
    <!-- @module Dialog·修改成品调价单 -->
    <el-dialog title="修改成品调价单" :visible.sync="visible">
      <el-form
        label-position="right"
        label-width="100px"
        :model="editForm"
        :rules="rules"
        ref="editForm"
      >
        <el-form-item label="调价原因" prop="ReasonTypeDk">
          <el-select
            v-model="editForm.ReasonTypeDk"
            :filterable="true"
            placeholder="全部"
            name="ReasonTypeDk"
            @change="getAdjustReasonValue"
          >
            <el-option
              v-for="(item, index) in adjustReasons"
              :key="index"
              :label="item.Value"
              :value="item.Id"
            ></el-option>
          </el-select>
          <span class="icon-set-item" @click="reasonDialog=true" name="iconSetItem">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="editForm.Note" :maxlength="200" name="note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="editAdjust"
          :loading="$store.getters.is_loading"
          name="btnEditAdjust"
        >确 定</el-button>
        <el-button @click="visible = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·修改成品调价单 -->

    <!-- @module Dialog·新建调价原因 -->
    <dict-manage
      v-if="reasonDialog"
      :dictDialog="reasonDialog"
      :dicts="adjustReasons"
      :dialogTitle="reasonName"
      :dictType="settingDictionaryTypes.PriceOrder"
      @listenDictDialog="listenDictDialog"
      @listenDictSave="listenDictSave"
    ></dict-manage>
    <!-- End Dialog·新建调价原因  -->
  </div>
</template>
<script>
import { STOCKING_API_GOODS_PRICE_ORDER_BASIC_UPDATE } from '@/apis/stocking.js'
import { MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST } from '@/apis/merchant.js'
import { SettingDictionaryDictType } from '@/enums/stocking.js'
import { EnableState } from '@/enums/common.js'

import dictManage from '@/components/erp/dictManage'
export default {
  props: {
    editDialog: {
      type: Boolean,
      default: false
    },
    editForm: {
      type: Object
    }
  },
  data() {
    return {
      settingDictionaryDictTypes: SettingDictionaryDictType,
      visible: this.editDialog,
      success: false,
      rules: {
        ReasonTypeDk: [
          {
            type: 'number',
            required: true,
            message: '请选择调价原因',
            trigger: 'change'
          }
        ]
      },
      reasonDialog: false,
      adjustReasons: [],
      reasonName: '调价原因'
    }
  },
  methods: {
    editAdjust() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_GOODS_PRICE_ORDER_BASIC_UPDATE(this.editForm).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$store.commit('SET_BTN_LOADING', false)
                this.success = true
                this.visible = false
              } else {
                this.$message.error(res.data.Message)
              }
              this.$store.commit('SET_BTN_LOADING', false)
            }
          )
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    getAdjustReason() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: this.settingDictionaryDictTypes
          .GoodsPriceOrderBasicReasonType,
        State: EnableState.Enable
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.adjustReasons = res.data.Data.Rows || []
        }
      })
    },
    getAdjustReasonValue(id) {
      this.editForm.ReasonTypeDv = this.adjustReasons.find(
        item => item.Id === id
      ).Value
    },
    listenDictDialog() {
      this.reasonDialog = false
      this.getAdjustReason()
    },
    listenDictSave() {
      this.getAdjustReason()
    }
  },
  watch: {
    visible() {
      this.$emit('listenEditDialog', this.editForm, this.success)
    }
  },
  mounted() {
    this.getAdjustReason()
  },
  components: {
    dictManage
  }
}
</script>

