<template>
  <div class="content">
    <el-row>
      <div class="select-data">
        <el-dropdown @command="handleCommand">
          <el-button name="handleCommand" type="primary">
            批量操作
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in settingGenerateAuditType.TypeArray" :key="item.KeyId" :command="item.KeyId">{{item.Value}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- @module 数据表格 -->
      <el-table :data="formData" class="fourth" @selection-change="handleSelectionChange" v-loading="fullLoading">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="GenerateType" label="单据名称">
          <template slot-scope="scope">{{String(settingGenerateType.Types[scope.row.GenerateType]).replace(/\([^\)]*\)/g,"")}}</template>
        </el-table-column>
        <el-table-column prop="state" label="审核模式">
          <template slot-scope="scope">
            <el-radio name="AuditType" class="radio" v-for="item in settingGenerateAuditType.TypeArray" :key="item.KeyId" v-model="scope.row.AuditType" :label="item.KeyId">{{item.Value}}</el-radio>
          </template>
        </el-table-column>
      </el-table>
      <!-- End 数据表格 -->
    </el-row>
    <div class="buttons">
      <el-button name="saveData" type="primary" @click="saveData($event)" :loading="$store.getters.is_loading" v-if="formData.length">保存</el-button>
    </div>
  </div>
</template>

<script>
import { CharacterType } from '@/enums/common'
import { SettingGenerateType, SettingGenerateAuditType } from '@/enums/merchant'
import {
  MERCHANT_API_SETTING_GENERATE_GETS,
  MERCHANT_API_SETTING_GENERATE_UPDATE
} from '@/apis/merchant'
export default {
  data () {
    return {
      settingGenerateType: SettingGenerateType,
      selectData: [], // 选中的数据
      formData: [],
      value: '选项1',
      type: '',
      radio: '',
      fullLoading: false,
      settingGenerateAuditType: SettingGenerateAuditType // 接收枚举中的人工审核和自动审核
    }
  },
  methods: {
    saveData (e) {
      e.currentTarget.blur()
      this.$confirm('是否保存参数设置修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_BTN_LOADING', true)
        MERCHANT_API_SETTING_GENERATE_UPDATE({ Items: this.formData })
          .then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
            } else {
              this.$message.error(res.data.Message)
            }
            this.$store.commit('SET_BTN_LOADING', false)
            this.getData()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      })
    },
    getData () {
      // 请求数据
      this.fullLoading = true
      MERCHANT_API_SETTING_GENERATE_GETS({}).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.formData = res.data.Data.Rows.filter(res => {
            if (this.$store.getters.user_session.CharacterType == CharacterType.Company) {
              return (
                res.GenerateType !=
                this.settingGenerateType.StockingCloudGoodsAllotOrderIntake &&
                res.GenerateType !=
                this.settingGenerateType.StockingCloudJunkAllotOrderIntake &&
                res.GenerateType !=
                this.settingGenerateType.StockingCloudHalfAllotOrderIntake &&
                res.GenerateType !=
                this.settingGenerateType.StockingCloudStuffAllotOrderIntake &&
                
                res.GenerateType !=
                this.settingGenerateType.StockingCloudSettleIOBillBasic1 &&
                res.GenerateType !=
                this.settingGenerateType.StockingCloudSettleIOBillBasic3 &&
                (res.GenerateType != this.settingGenerateType.StockingCloudSaleOrder && res.GenerateType != this.settingGenerateType.StockingCloudRmaReturnOrder)
              )
            } else {
              return (
                res.GenerateType !=
                this.settingGenerateType.StockingCloudSettleIOBillBasic1 &&
                res.GenerateType !=
                this.settingGenerateType.StockingCloudSettleIOBillBasic3
              )
            }
          })
          this.formData = this.formData.sort((a, b) => {
            return a.SortId < b.SortId
          })
        } else {
          this.$message.error(res.data.Message)
        }
        this.fullLoading = false
      })
    },
    handleSelectionChange (v) {
      this.selectData = v
    },
    // 批量操作
    handleCommand (type) {
      if (this.selectData.length === 0) {
        this.$message.error('请先选择要操作的项！')
        return
      }
      this.selectData.map(v => {
        v.AuditType = type
        return v
      })
      MERCHANT_API_SETTING_GENERATE_UPDATE({ Items: this.selectData }).then(
        () => this.getData()
      )
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="scss">
.fourth {
  border: none;
  border-top: 1px solid #ddd;
  margin-top: 20px;
}
</style>
