<template>
  <el-row>
    <el-row v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <div class="m-10 top-line-search">
        <el-date-picker name="startTime" v-model="startTime" type="month" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
        <span class="to-tip">至</span>
        <el-date-picker name="endTime" v-model="endTime" type="month" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
        <el-button name="btnonSearch" type="primary" class="m-l-10" @click="onSearch">查询</el-button>
        <span class="date-tips">最多选择12个月</span>
      </div>
      <el-row :gutter="10" class="total-panel">
        <el-col :span="6">
          <div class="total qty">
            <div class="number">￥{{$root.toFloat(data.InnTotalPrice) || 0}}</div>
            <div class="name">收入</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total weight">
            <div class="number">￥{{$root.toFloat(data.OutTotalPrice) || 0}}</div>
            <div class="name">支出</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total price">
            <div class="number">￥{{$root.toFloat(data.ProfitPrice) || 0}}</div>
            <div class="name">纯利润</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total cashier">
            <div class="number">{{(data.RepayRate / 100).toFixed(2)}}%</div>
            <div class="name">投资回报率</div>
          </div>
        </el-col>
      </el-row>
      <el-row class="p-10">
        <el-col :span="18" class="tl">
          <el-radio-group name="showType" v-model="showType">
            <el-radio-button label="1">报表</el-radio-button>
            <el-radio-button label="2">趋势图</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="6" class="tr">
          <el-button name="btnDownLoadData" type="primary" @click="ExportVisible = true">导出</el-button>
        </el-col>
      </el-row>
      <el-row class="chart" v-if="showType == 2">
        <ECharts :options="options" autoResize></ECharts>
      </el-row>
      <div class="m-x-10 financeReport" v-else>
        <el-table :data="data.Rows || []" show-summary :summary-method="getSummaries">
          <el-table-column prop="DateTimeName" label="日期" min-width="120" show-overflow-tooltip fixed></el-table-column>
          <el-table-column label="收入">
            <el-table-column prop="InnSaleGoldPrice" label="素金销售" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.InnSaleGoldPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="InnSaleUngoldPrice" label="非素销售" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.InnSaleUngoldPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="InnRepairPrice" label="维修费" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.InnRepairPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="InnOtherPrice" label="其他收入" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.InnOtherPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="InnTotalPrice" label="收入小计" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.InnTotalPrice)}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="支出">
            <el-table-column prop="OutPeriodPrice" label="期初支出" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.OutPeriodPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="OutJunkGoldPrice" label="素金成本" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.OutJunkGoldPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="OutJunkUngoldPrice" label="非素成本" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.OutJunkUngoldPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="OutSalaryPrice" label="工资" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.OutSalaryPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="OutRentPrice" label="房租" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.OutRentPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="OutWaterPrice" label="水电" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.OutWaterPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="OutJumbPrice" label="杂费" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.OutJumbPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="OutOtherPrice" label="其他支出" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.OutOtherPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="OutTotalPrice" label="支出小计" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.OutTotalPrice)}}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="ProfitPrice" label="纯利润" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              ￥{{$root.toFloat(scope.row.ProfitPrice)}}
            </template>
          </el-table-column>
          <el-table-column prop="RepayRate" label="投资回报率" min-width="110" show-overflow-tooltip>
            <template slot-scope="scope">
              {{(scope.row.RepayRate / 100).toFixed(2)}}%
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-row>
    <div class="report-tips">
      <p>备注：</p>
      <p>1、收入项目的“素金销售”＝计价销售的货品实收金额，“非素销售”＝计件销售的货品实收金额。支出项目的“素金成本”和“非素成本”=采购成本。</p>
      <p>2、支出项目的“期初支出”，按年度期初支出资金平摊到每月。</p>
      <p>3、支出项目的“素金成本”和“非素成本”不包含卡券换购的旧货回收。</p>
      <p>4、纯利润＝收入-支出</p>
      <p>5、投资回报率＝纯利润÷支出×100%</p>
    </div>
    <base-export-field-setter
      @submit="downLoadData"
      :title="'导出'"
      :visible.sync="ExportVisible"
      :items="ExportColumns"
      :props="{key: 'FieldEnName', label: 'FieldCnName'}"
    />
  </el-row>
</template>

<script>
import {
  SettleBudgetBillType 
} from '@/enums/stocking'
import {
  STOCKING_API_REPORT_SETTLE_CHARTBYBUDGET,
  STOCKING_API_REPORT_SETTLE_EXPORTCHARTBYBUDGET
} from '@/apis/stocking'
import baseExportFieldSetter from '@/components/baseExportFieldSetter'
import {
  financeLine 
} from '@/datas/echart/line'
import dayjs from 'dayjs'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legendScroll'

export default {
  data() {
    return {
      startTime: '',
      endTime: '',
      data: {
      },
      showType: 1,
      options: {
      },
      pickerOptions: {
        disabledDate(date) {
          return date.getFullYear() < 2016
        }
      },
      ExportVisible: false, // 导出弹窗
    }
  },
  props: {
    ExportColumns: {
      type: Array
    }
  },
  methods: {
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_REPORT_SETTLE_CHARTBYBUDGET({
        SettleBudgetBillType: SettleBudgetBillType.Monthly,
        Date1: this.startTime,
        Date2: this.endTime
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data
          this.initOptions(this.data.Rows || [])
        }
      })
    },
    onSearch() {
      let start = Date.parse(this.startTime)
      let end = Date.parse(this.endTime)
      let flag = false
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      if (!this.startTime) {
        if (month <= 5) {
          this.startTime = new Date(year - 1 + '-' + (month + 7) + '-1') // 月报起始时间
        } else {
          this.startTime = new Date(year + '-' + (month - 5) + '-1') // 月报起始时间
        }
        return this.$message.warning('最多选择12个月')
      }
      if (!this.endTime) {
        this.endTime = new Date(Date.parse(new Date(year + '/' + (month + 1) + '/01')) - 24 * 3600 * 1000)
        return this.$message.warning('最多选择12个月')
      }
      if (end < start) {
        this.$message.warning('结束时间不能小于起始时间')
        flag = true
      }
      console.log(this.startTime, this.endTime)
      if (end - start > 12 * 30 * 24 * 60 * 60 * 1000) {
        this.$message.warning('最多选择12个月')
        flag = true
      }
      if (flag) {
        if (month < 5) {
          this.startTime = new Date(year - 1 + '/' + (month + 7) + '/01') // 月报起始时间
        } else {
          this.startTime = new Date(year + '/' + (month - 4) + '/01') // 月报起始时间
        }
      }
      this.endTime = new Date(Date.parse(new Date(year + '/' + (month + 1) + '/01')) - 24 * 3600 * 1000) // 月报结束时间
      this.startTime = dayjs(this.startTime).format('YYYY-MM-DD')
      this.endTime = dayjs(this.endTime).format('YYYY-MM-DD')
      this.monthParameters = {
        SettleBudgetBillType: SettleBudgetBillType.Monthly,
        Date1: this.startTime,
        Date2: this.endTime
      }
      this.getData()
    },
    initOptions(data) {
      let options = JSON.parse(JSON.stringify(financeLine))
      let xAxis = []
      let seriesData = [[], [], [], []]
      let dates = {
      }
      let dates1 = {
      }
      let dates2 = {
      }
      let dates3 = {
      }
      let startYear = new Date(this.startTime).getFullYear()
      let startMonth = new Date(this.startTime).getMonth() + 1
      let endYear = new Date(this.endTime).getFullYear()
      let endMonth = new Date(this.endTime).getMonth() + 1
      for (let m = startMonth; m <= 12; m++) {
        let date = startYear + '-' + (m < 10 ? '0' + m : m)
        dates[date] = 0
        dates1[date] = 0
        dates2[date] = 0
        dates3[date] = 0
      }
      for (let m = 1; m < endMonth; m++) {
        let date = endYear + '-' + (m < 10 ? '0' + m : m)
        dates[date] = 0
        dates1[date] = 0
        dates2[date] = 0
        dates3[date] = 0
      }
      data.forEach(res => {
        dates[res.Date] = this.$root.toFloat(res.InnTotalPrice)
        dates1[res.Date] = this.$root.toFloat(res.OutTotalPrice)
        dates2[res.Date] = this.$root.toFloat(res.ProfitPrice)
        dates3[res.Date] =
          ((res.RepayRate || 0) < 0 ? '-' : '') +
          (Math.abs(res.RepayRate || 0) / 100).toFixed(2)
      })
      for (let t in dates) {
        xAxis.push(t)
        seriesData[0].push(dates[t])
        seriesData[1].push(dates1[t])
        seriesData[2].push(dates2[t])
        seriesData[3].push(dates3[t])
      }
      options.xAxis.data = xAxis
      options.series[0].data = seriesData[0]
      options.series[1].data = seriesData[1]
      options.series[2].data = seriesData[2]
      options.series[3].data = seriesData[3]
      this.options = options
    },
    downLoadData(fields) {
      this.$store.commit('SET_FULL_LOADING', true)
      STOCKING_API_REPORT_SETTLE_EXPORTCHARTBYBUDGET({
        SettleBudgetBillType: SettleBudgetBillType.Monthly,
        Date1: this.startTime,
        Date2: this.endTime,
        ExportColumns: fields
      }).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          if (this.total > 10000) {
            this.$confirm(
              '数据量较大，导出任务在后台执行，请稍后到“我的下载”去下载',
              '提示',
              {
                confirmButtonText: '关闭',
                showCancelButton: false,
                type: 'warning'
              }
            )
            return false
          }
          window.open(this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data)
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getSummaries(param) {
      const {
        columns, data 
      } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return false
        } else if (index === columns.length - 1) {
          let sum = sums[index - 1] / sums[index - 2]
          sums[index] =
            ((sum || 0) < 0 ? '-' : '') +
            (Math.abs(sum || 0) * 100).toFixed(2) +
            '%'
          return false
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values
            .reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          sums[index] = this.$root.toFloat(sums[index])
        } else {
          sums[index] = 'N/A'
        }
      })

      return sums
    }
  },
  beforeMount() {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1

    if (month <= 5) {
      this.startTime = new Date(year - 1 + '-' + (month + 7) + '-1') // 月报起始时间
    } else {
      this.startTime = new Date(year + '-' + (month - 5) + '-1') // 月报起始时间
    }
    this.endTime = new Date(Date.parse(new Date(year + '/' + (month + 1) + '/01')) - 24 * 3600 * 1000) // 月报结束时间
    this.startTime = dayjs(this.startTime).format('YYYY-MM-DD')
    this.endTime = dayjs(this.endTime).format('YYYY-MM-DD')
  },
  mounted() {
    this.getData()
  },
  watch: {
  },
  components: {
    ECharts,
    baseExportFieldSetter
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/sass/report.scss';
</style>
<style  lang="scss">
.financeReport {
  .el-table {
    .has-gutter {
      :first-child {
        :nth-last-child(2) {
          border-right: none;
        }
      }
    }
    tr {
      :last-child {
        border-right: none;
      }
    }
  }
}
</style>
