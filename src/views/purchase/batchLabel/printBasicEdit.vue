<template>
  <div>
    <!-- @module Dialog·修改打印单 -->
    <el-dialog :title="title" :visible.sync="visible">
      <el-form label-position="right" label-width="100px" :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="打印原因" prop="ReasonId">
          <el-select name="reasonId" v-model="editForm.ReasonId" :filterable="true" placeholder="请选择">
            <el-option v-for="(item, index) in reasons" :key="index" :label="item.DictValue" :value="item.DictId"></el-option>
          </el-select>
          <span name="reasonDialog" class="icon-set-item" @click="reasonDialog=true">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item label="备注">
          <el-input name="note" type="textarea" v-model="editForm.Note" :maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnEditPrint" type="primary" @click="editPrint" :loading="$store.getters.is_loading">保存</el-button>
        <el-button name="btnVisible" @click="visible = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·新建打印单 -->

    <!-- @module Dialog·新建退货原因 -->
    <dict-manage
      v-if="reasonDialog"
      :visible.sync="reasonDialog"
      :dicts="reasons"
      :dialogTitle="reasonName"
      :dictType="settingDictionaryTypes.JunkPrint"
      @listenDictSave="listenDictSave">
    </dict-manage>
    <!-- End Dialog·新建退货原因  -->
  </div>
</template>

<script>
import {
  STOCKING_API_SETTING_DICTIONARYLIST,
  STOCKING_API_JUNK_JUNKPRINTORDERBASICUPDATE
} from '@/apis/stocking.js'
import {
  SettingDictionaryType 
} from '@/enums/merchant.js'
import dictManage from '@/components/erp/dictManage'

export default {
  props: ['editForm', 'editDialog', 'title'],
  data() {
    return {
      settingDictionaryTypes: SettingDictionaryType,
      rules: {
        ReasonId: [
          {
            type: 'number',
            required: true,
            message: '请选择打印原因',
            trigger: 'change'
          }
        ]
      },
      reasons: [],
      reasonName: '打印原因',
      visible: this.editDialog,
      success: false,
      reasonDialog: false
    }
  },
  methods: {
    getPrintReasonValue(id) {
      let result = ''
      this.reasons.forEach(item => {
        if (item.DictId === id) {
          result = item.DictValue
          return false
        }
      })
      return result
    },
    getPrintReason() {
      STOCKING_API_SETTING_DICTIONARYLIST({
        Type: this.settingDictionaryTypes.JunkPrint
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.reasons = res.data.Data
        }
      })
    },
    listenDictDialog() {
      this.reasonDialog = false
      this.getPrintReason()
    },
    listenDictSave() {
      this.getPrintReason()
    },
    editPrint() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_JUNK_JUNKPRINTORDERBASICUPDATE(
            Object.assign(this.editForm, {
              Reasons: this.getPrintReasonValue(this.editForm.ReasonId)
            })
          ).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.$store.commit('SET_BTN_LOADING', false)
              this.success = true
              this.visible = false
            } else {
              this.$message.error('修改失败')
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        } else {
          this.$message.error('请完善信息！')
        }
      })
    }
  },
  beforeMount() {
    this.getPrintReason()
  },
  mounted() {},
  watch: {
    visible() {
      this.$emit('listenEditDialog', this.editForm, this.success)
    }
  },
  components: {
    dictManage
  }
}
</script>
