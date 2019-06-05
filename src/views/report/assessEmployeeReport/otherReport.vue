<template>
  <div>
    <div class="report-t">
      <h2>商家员工犒赏统计报表</h2>
      <p v-if="form.CreateTime1">{{form.CreateTime1}} 至 {{form.CreateTime2}}</p>
    </div>
    <el-table :stripe="true" :data="[summary]" :show-header="false">
      <el-table-column align="center" v-if="characterType == CharacterType.Lingcb">
        <template>
          门店数：
          <span class="text-warning fw-b">{{summary.StoreAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" v-if="characterType == CharacterType.Company">
        <template>
          被犒赏员工合计：
          <span class="text-warning fw-b">{{summary.EmployeeAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template>
          被犒赏金额合计：
          <span class="text-warning fw-b">{{`￥${$root.toFloat(summary.AssessPrice)}`}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="summary.Details" class="m-t-10">
      <el-table-column label="ID" prop="CharacterId" width="80" fixed></el-table-column>
      <!-- 平台列 -->
      <template v-if="characterType == CharacterType.Lingcb">
        <el-table-column label="公司编码" prop="CompanyCode" show-overflow-tooltip></el-table-column>
        <el-table-column label="公司名称" prop="CompanyName" show-overflow-tooltip></el-table-column>
      </template>
      <el-table-column label="门店编号" prop="EnglishID" show-overflow-tooltip></el-table-column>
      <el-table-column label="门店名称" prop="StoreName" show-overflow-tooltip></el-table-column>
      <el-table-column label="被犒赏员工合计" prop="EmployeeAmt" show-overflow-tooltip></el-table-column>
      <el-table-column label="被犒赏次数" prop="AssessAmt" v-if="characterType == CharacterType.Lingcb" show-overflow-tooltip></el-table-column>
      <el-table-column label="被犒赏金额合计" prop="AssessPrice" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="60" fixed="right">
        <template slot-scope="scope">
          <el-button name="btngetDetail" type="text" @click="getDetail(scope.row.CharacterId)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="员工犒赏详情" width="900px" :visible.sync="detailVisible" @open="init">
      <div class="export-report">
        <el-button name="btnexportReport" @click="exportReport">导出报表</el-button>
      </div>
      <store-report :summary="detailSummary" :form="detailParams" :character-type="characterType" v-loading="isLoading"></store-report>
      <pagination :total="total" :pg="detailParams.PageIndex" :size="detailParams.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </el-dialog>
  </div>
</template>
<script>
import pagination from '@/components/pagination.vue'
import storeReport from './storeReport.vue'
import { CharacterType } from '@/enums/common'
import {
  MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYSTORE,
  MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYSTOREEXPORT
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
        CreateTime1: '',
        CreateTime2: '',
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
      MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYSTOREEXPORT(
        this.detailParams
      ).then(res => {
        if (res.data.Code === 'CORRECT') {
          window.open(res.data.Data.FilePath, '_blank')
        }
      })
    },
    getDetail(id) {
      this.detailVisible = true
      this.detailParams.CharacterId = id
      this.detailParams.CreateTime1 = this.form.CreateTime1
      this.detailParams.CreateTime2 = this.form.CreateTime2
    },
    init() {
      this.detailParams.PageIndex = 1
      this.detailParams.PageSize = 10
      this.getData()
    },
    getData() {
      this.isLoading = true
      MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYSTORE(this.detailParams).then(
        res => {
          this.isLoading = false
          if (res.data.Code === 'CORRECT') {
            this.detailSummary = res.data.Data
            this.total = res.data.Data.StoreAmt || 0
          }
        }
      ).catch(() => {
        this.detailSummary = {}
        this.total = 0
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
      switch (arguments[1].property) {
        case 'AssessPrice':
          return `￥${this.$root.toFloat(arguments[2])}`
        default:
          break
      }
    }
  }
}
</script>