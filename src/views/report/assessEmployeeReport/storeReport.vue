<template>
  <div>
    <div class="report-t">
      <h2>员工犒赏统计报表</h2>
      <p v-if="form.CreateTime1">{{form.CreateTime1}} 至 {{form.CreateTime2}}</p>
    </div>
    <el-table :data="[summary]" :show-header="false" border>
      <el-table-column align="center">
        <template>
          员工数：
          <span class="text-warning fw-b">{{summary.UserAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template>
          被评分总次数：
          <span class="text-warning fw-b">{{summary.StarAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template>
          被犒赏总次数：
          <span class="text-warning fw-b">{{summary.AssessAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template>
          被犒赏金额合计：
          <span class="text-danger fw-b">{{$root.toFloat(summary.AssessPrice)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="summary.Details" class="m-t-10">
      <el-table-column label="序号" prop="UserId" width="50" show-overflow-tooltip fixed></el-table-column>
      <el-table-column label="昵称" prop="AliasName" show-overflow-tooltip></el-table-column>
      <el-table-column label="姓名" prop="TrueName" show-overflow-tooltip></el-table-column>
      <el-table-column label="被评分次数" prop="StarAmt" show-overflow-tooltip></el-table-column>
      <el-table-column label="被犒赏次数" prop="AssessAmt" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" label="被犒赏总额" prop="AssessPrice" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="60" fixed="right">
        <template slot-scope="scoped">
          <el-button name="btngetDetail" type="text" @click="getDetail(scoped.row.UserId)">明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="员工犒赏明细" width="900px" :visible.sync="detailVisible" @open="init" :custom-class="$store.state.themeName" append-to-body>
      <div class="export-report">
        <el-button name="btnexportReport" @click="exportReport">导出报表</el-button>
      </div>
      <user-report :summary="detailSummary" :form="detailParams" v-loading="isLoading"></user-report>
      <pagination :total="total" :pg="detailParams.PageIndex" :size="detailParams.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </el-dialog>
  </div>
</template>
<script>
import userReport from './userReport'
import pagination from '@/components/pagination.vue'
import { CharacterType } from '@/enums/common.js'
import {
  MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYUSER,
  MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYUSEREXPORT
} from '@/apis/marketing.js'
export default {
  components: {
    userReport,
    pagination
  },
  data() {
    return {
      CharacterType,
      detailSummary: {},
      detailParams: {
        UserId: '',
        CreateTime1: '',
        CreateTime2: '',
        PageIndex: 1,
        PageSize: 10
      },
      total: 0,
      detailVisible: false,
      isLoading: true
    }
  },
  props: {
    summary: {
      type: Object
    },
    form: {
      type: Object,
      default: function () {
        return {}
      }
    },
    characterType: [String, Number]
  },
  mounted() {
  },
  methods: {
    exportReport() {
      MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYUSEREXPORT(
        this.detailParams
      ).then(res => {
        if (res.data.Code === 'CORRECT') {
          window.open(res.data.Data.FilePath, '_blank')
        }
      })
    },
    getDetail(id) {
      this.detailVisible = true
      this.detailParams.UserId = id
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
      MARKETING_API_MARKET_REPORT_GETASSESSEMPLOYEESUMMARYBYUSER(
        this.detailParams
      ).then(res => {
        this.isLoading = false
        if (res.data.Code === 'CORRECT') {
          this.detailSummary = res.data.Data
          console.log(res.data.Data.Details)
          this.total = res.data.Data.Details?res.data.Data.Details[0].TOTALCOUNT:0
        }
      }).catch(() => {
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
      let tpr
      switch (arguments[1].property) {
        case 'AssessPrice':
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
