<template>
  <el-row>
    <div class="panel" v-loading="$store.getters.tb_loading">
      <div class="panel-hd">
        <span class="title">核价({{detail.KindTypeEv}})</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">来源</td>
                <td>{{GoodsQualityOrderBasicQualityType.Types[detail.QualityType]}}</td>
                <td class="tit">来源单号</td>
                <td>{{detail.PreviousCode}}</td>
                <td class="tit">送货单号</td>
                <td>{{detail.ExpressCode}}</td>
              </tr>
              <tr>
                <td class="tit">完成时间</td>
                <td>{{detail.PriceTime | filterDateMinutes}}</td>
                <td class="tit"></td>
                <td></td>
                <td class="tit"></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- <div class="search-query-bar">
          <el-button name="btnBatchPricing" type="primary" @click="batchPricing">批量调价</el-button>
        </div>-->
        <div class="p-x-10">
          <goods-table
            :goodsData="data"
            :option="option"
            :api="updateApi"
            :loading="isLoading"
            :fieldData="fieldData"
            @changeSave="changeSave"
            ref="goodsTable"
          ></goods-table>
          <pagination
            :pg="parameters.PageIndex"
            :size="parameters.PageSize"
            :total="total"
            @currentChange="currentChange"
            @sizeChange="sizeChange"
          ></pagination>
        </div>
      </div>
    </div>
    <el-row style="margin-top: 10px; text-align: left; border: 0;">
      <el-button name="save" type="primary" @click="save" v-if="isSaved" :loading="saveLoading">保存</el-button>
      <el-button name="btnSubmit" type="primary" v-else @click="submit">完成并提交</el-button>
      <el-button name="btnBack" @click="$router.back()">返回</el-button>
    </el-row>
    <el-dialog title="批量调价" :visible.sync="dialogVisible" width="500px">
      <el-form :model="pricingForm" :label-width="'140px'">
        <el-form-item label="XXXXXXXXXX成本：">
          <el-input name="name" v-model="pricingForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="XXXXXXXXXX价格：">
          <el-input name="price" v-model="pricingForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnPricing" type="primary" @click="dialogVisible = false">确定</el-button>
        <el-button name="btnCancel" @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import {
  RetailType,
  AppropType,
  WholesaleType,
  SettingCustomizedFieldType,
  GoodsQualityOrderBasicQualityType,
  GoodsQualityOrderBasicStepState,
  SettingCustomizedFieldOrderType,
  SettingCustomizedFieldLargeType,
  SettingCustomizedFieldSmallType
} from '@/enums/stocking'
import { YNStatus, EnableState } from '@/enums/common'
import {
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GET,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GETS,
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATEPRICE,
  STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS
} from '@/apis/stocking'
import pagination from '@/components/pagination'
import goodsTable from './goodsTable'

export default {
  data() {
    return {
      RetailType,
      AppropType,
      WholesaleType,
      GoodsQualityOrderBasicQualityType,
      GoodsQualityOrderBasicStepState,
      detail: {},
      data: [],
      total: 0,
      parameters: {
        QualityId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      pricingForm: {},
      currentRow: {},
      dialogVisible: false,
      option: {
        OrderType:
          SettingCustomizedFieldOrderType.StockingCloudGoodsQualityOrderBasic3,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        SmallType: SettingCustomizedFieldSmallType.Basic,
        KindTypeEk: 0,
        IsEnable: EnableState.Enable
      },
      isLoading: false,
      isSaved: false,
      saveLoading: false,
      fieldData: [],
      tableData: [],
      updateApi: STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATEPRICE,
      isRet: true
    }
  },
  methods: {
    getDetail() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GET({
        QualityId: this.parameters.QualityId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data || {}
          this.detail.Logs = JSON.parse(this.detail.Logs)
          this.option.KindTypeEk = this.detail.KindTypeEk
          this.getData()
        }
      })
    },
    getData() {
      this.isLoading = true
      STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
          this.getField()
        } else {
          this.isLoading = false
        }
      })
    },
    getField() {
      STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS(this.option).then(res => {
        this.isLoading = false
        if (res.data.Code === 'CORRECT') {
          this.fieldData = res.data.Data.Rows || []
        }
      })
    },
    changeSave(save) {
      this.isSaved = save.isSaved
      this.saveLoading = save.saveLoading
    },
    batchPricing() {
      this.dialogVisible = true
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.getData()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.getData()
    },
    save() {
      let row = this.$refs.goodsTable.currentRow,
        tableData = this.$refs.goodsTable.tableData
      this.isRet = true
      tableData.some(item => {
        if (item.IsRequired == YNStatus.Yes && row[item.FieldEnName] == 0) {
          this.isRet = false
          return this.$message.error(
            `${
              item.FieldType === SettingCustomizedFieldType.SelectOfEnums
                ? '请选择'
                : '请输入'
            }${item.FieldCnName}`
          )
        }
      })
      if (this.isRet) {
        let parameters = { ...row }
        tableData.forEach(item => {
          if (item.Precision > 0) {
            parameters[item.FieldEnName] = this.$root.toInt(
              parameters[item.FieldEnName]
            )
          } else if (
            item.FieldType === SettingCustomizedFieldType.TextOfInteger
          ) {
            parameters[item.FieldEnName] = parseInt(
              parameters[item.FieldEnName]
            )
          }
        })
        this.saveLoading = true
        STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATEPRICE(parameters).then(
          res => {
            this.saveLoading = false
            if (res.data.Code === 'CORRECT') {
              this.isSaved = false
              this.$message.success('保存成功')
            }
          }
        )
      }
    },
    submit() {
      STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH({
        QualityId: this.parameters.QualityId,
        PriceState: GoodsQualityOrderBasicStepState.Finish
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
          this.$router.push('/purchase/pricesProduct/index')
        }
      })
    }
  },
  created() {
    this.parameters.QualityId = parseInt(this.$route.query.id)
    this.getDetail()
  },
  mounted() {},
  components: {
    pagination,
    goodsTable
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/erp/purchase.scss';
.search-query-bar {
  padding: 0 0 10px 10px;
}
</style>
