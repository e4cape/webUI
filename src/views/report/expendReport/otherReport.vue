<template>
  <div>
    <div class="report-t">
      <h2>消费统计报表</h2>
      <p v-if="form.CheckTime1">{{form.CheckTime1}} 至 {{form.CheckTime2}}</p>
    </div>
    <el-table :data="[summary]" :show-header="false">
      <template v-if="characterType == CharacterType.Lingcb">
        <el-table-column align="center">
          <template>
            提点门店数:
            <span class="text-warning fw-b">{{summary.TotalStoreCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template>
            提点次数合计:
            <span class="text-warning fw-b">{{summary.TotalSettleCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template>
            提点总额:
            <span class="text-danger fw-b">￥{{$root.toFloat(summary.TotalSettlePrice)}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template>
            消费金额合计:
            <span class="text-danger fw-b">￥{{$root.toFloat(summary.TotalCashPrice)}}</span>
          </template>
        </el-table-column>
      </template>
      <template v-if="characterType == CharacterType.Company">
        <el-table-column align="center">
          <template>
            消费单合计:
            <span class="text-warning fw-b">{{summary.TotalSettleCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template>
            消费单金额合计:
            <span class="text-danger fw-b">{{$root.toFloat(summary.TotalSettlePrice,2)}}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-table :data="summary.Details" class="m-t-10" width="calc(100vh - 95px)">
      <template v-if="characterType == CharacterType.Lingcb">
        <el-table-column label="公司编码" prop="CompanyCode" show-overflow-tooltip></el-table-column>
        <el-table-column label="公司名称" prop="CompanyName" show-overflow-tooltip></el-table-column>
      </template>
      <el-table-column prop="StoreCode" label="门店编号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="StoreName" label="门店名称" show-overflow-tooltip></el-table-column>
      <template v-if="characterType == CharacterType.Lingcb">
        <el-table-column label="地区" prop="Address" show-overflow-tooltip></el-table-column>
        <el-table-column label="消费类型" prop="PackageType" :formatter="formatter" show-overflow-tooltip></el-table-column>
        <el-table-column label="提点次数" prop="SettleCount" show-overflow-tooltip></el-table-column>
        <el-table-column :formatter="formatter" label="提点总额" prop="SettlePrice" show-overflow-tooltip></el-table-column>
      </template>
      <template v-if="characterType == CharacterType.Company">
        <el-table-column prop="SettleCount" label="消费单合计" show-overflow-tooltip></el-table-column>
        <el-table-column prop="SettlePrice" label="消费单金额合计" show-overflow-tooltip></el-table-column>
      </template>
      <el-table-column label="操作">
        <template slot-scope="scoped">
          <el-button name="btngetDetail" type="text" @click="getDetail(scoped.row.CharacterId)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="消费统计详情" :visible.sync="detailVisible" @open="init">
      <div class="export-report">
        <el-button name="btnexportReport" @click="exportReport">导出Excel</el-button>
      </div>
      <store-report :summary="detailSummary" :form="detailParams" v-loading="isLoading"></store-report>
      <pagination :total="total" :pg="detailParams.PageIndex" :size="detailParams.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </el-dialog>
  </div>
</template>

<script>
import storeReport from './storeReport.vue'
import pagination from '@/components/pagination.vue'
import {
  ExpendOrderPayingType, StorePackageType
} from '@/enums/marketing.js'
import { CharacterType } from '@/enums/common.js'
import {
  MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYSTORE, 
  MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYSTOREEXPORT
} from '@/apis/marketing.js'
export default {
  components: {
    pagination,
    storeReport
  },
  data() {
    return {
      CharacterType,
      detailVisible: false,
      detailParams: {
        CharacterId: 0,
        CheckTime1: '',
        CheckTime2: '',
        PageIndex: 1,
        PageSize: 10
      },
      detailSummary: {},
      total: 0,
      isLoading: true
    }
  },
  props: {
    summary: {
      type: Object
    },
    form: {
      type: Object
    },
    characterType: [String, Number]
  },
  methods: {
    exportReport() {
      MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYSTOREEXPORT(this.detailParams).then(res => {
        if (res.data.Code === 'CORRECT') {
          window.open(res.data.Data.FilePath)
        }
      })
    },
    getDetail(id) {
      this.detailVisible = true
      this.detailParams.CharacterId = id
      this.detailParams.CheckTime1 = this.form.CheckTime1
      this.detailParams.CheckTime2 = this.form.CheckTime2
    },
    init() {
      this.detailParams.PageIndex = 1
      this.detailParams.PageSize = 10
      this.getData()
    },
    getData() {
      this.isLoading = true
      MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYSTORE(this.detailParams).then(res => {
        this.isLoading = false
        if (res.data.Code === 'CORRECT') {
          this.detailSummary = res.data.Data
          this.total = res.data.Data.Details.length > 0 ? res.data.Data.Details[0].TOTALCOUNT : 0
        }
      })
    },
    currentChange(val) {
      this.detailParams.PageIndex = val
      this.getData()
    },
    sizeChange(val) {
      this.detailParams.PageIndex = 1
      this.detailParams.PageSize = val
      this.getData()
    },
    formatter() {
      let tpr
      switch (arguments[1].property) {
        case 'PackageType':
          tpr = StorePackageType.Types[arguments[2]]
          break
        case 'PayingType':
          tpr = ExpendOrderPayingType.Types[arguments[2]]
          break
        case 'ProductPrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'CouponPrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'RecyclePrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'CashPrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'SettlePrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'CheckTime':
          tpr = this.$options.filters.filterDate(arguments[2])
          break
        default:
          break
      }
      return tpr
    },

  },
}
</script>
