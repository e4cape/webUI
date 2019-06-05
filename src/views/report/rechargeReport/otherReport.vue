<template>
  <div>
    <div class="report-t">
      <h2>充值及赠送统计报表</h2>
      <p v-if="form.CheckTime1">{{form.CheckTime1}} 至 {{form.CheckTime2}}</p>
    </div>
    <el-table
      :stripe="true"
      :data="[summary]"
      :show-header="false"
    >
      <el-table-column
        align="center"
        v-if="characterType == CharacterType.Lingcb"
      >
        <template>
          充值商家数：
          <span class="text-warning fw-b">{{summary.TotalStoreCount}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        v-if="characterType == CharacterType.Lingcb"
      >
        <template>
          充值次数合计：
          <span class="text-warning fw-b">{{summary.TotalOrderCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template>
          充值总额：
          <span class="text-danger fw-b">{{$root.toFloat(summary.TotalOrderPrice)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        v-if="characterType == CharacterType.Lingcb"
      >
        <template>
          <p>赠送次数合计：
            <span class="text-warning fw-b">{{summary.SplitFreeCount}}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template>
          <p>赠送总额：
            <span class="text-danger fw-b">{{$root.toFloat(summary.SplitFreePrice)}}</span>
          </p>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      :data="summary.Details"
      class="m-t-10"
    >
      <template v-if="characterType == CharacterType.Lingcb">
        <el-table-column
          label="公司编码"
          prop="CompanyCode"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="公司名称"
          prop="CompanyName"
          show-overflow-tooltip
        ></el-table-column>
      </template>
      <el-table-column
        label="门店编号"
        prop="StoreCode"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="门店名称"
        prop="StoreName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="充值次数"
        prop="SplitCashCount"
        v-if="characterType == CharacterType.Lingcb"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="充值总额"
        prop="SplitCashPrice"
        :formatter="formatter"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="赠送次数"
        prop="SplitFreeCount"
        v-if="characterType == CharacterType.Lingcb"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="赠送总额"
        prop="SplitFreePrice"
        :formatter="formatter"
        show-overflow-tooltip
      > </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scoped">
          <el-button
            name="btngetDetail"
            type="text"
            @click="getDetail(scoped.row.CharacterId)"
          >详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="充值统计详情"
      :visible.sync="detailVisible"
      @open="init"
    >
      <div class="export-report">
        <el-button
          name="btnexportReport"
          @click="exportReport"
        >导出Excel</el-button>
      </div>
      <store-report
        :summary="detailSummary"
        :form="detailParams"
        v-loading="isLoading"
      ></store-report>
      <pagination
        :total="total"
        :pg="detailParams.PageIndex"
        :size="detailParams.PageSize"
        @currentChange="currentChange"
        @sizeChange="sizeChange"
      ></pagination>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/pagination.vue'
import storeReport from './storeReport.vue'
import { BalanceType, PaymentType } from '@/enums/marketing.js'
import { CharacterType } from '@/enums/common.js'
import {
  MARKETING_API_MARKET_REPORT_GETRECHARGESUMMARYBYSTORE,
  MARKETING_API_MARKET_REPORT_GETRECHARGESUMMARYBYSTOREEXPORT
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
        characterId: 0,
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
      MARKETING_API_MARKET_REPORT_GETRECHARGESUMMARYBYSTOREEXPORT(
        this.detailParams
      ).then(res => {
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
      MARKETING_API_MARKET_REPORT_GETRECHARGESUMMARYBYSTORE(this.detailParams)
        .then(res => {
          this.isLoading = false
          if (res.data.Code === 'CORRECT') {
            this.detailSummary = res.data.Data
            this.total =
              res.data.Data.Details && res.data.Data.Details.length > 0
                ? res.data.Data.Details[0].TOTALCOUNT
                : 0
          }
        })
        .catch(() => (this.isLoading = false))
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
        case 'PaymentType':
          tpr = PaymentType.Types[arguments[2]]
          break
        case 'BalanceType':
          tpr = BalanceType.Types[arguments[2]]
          break
        case 'SplitFreePrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'SplitCashPrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        default:
          break
      }
      return tpr
    }
  }
}
</script>