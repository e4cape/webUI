<template>
  <div class="trade-report">
    <el-form
      :model="form"
      ref="search"
      label-width="120px"
      class="item-lh-26"
      :inline="true"
    >
      <search-panel
        @onSearch="onSearch"
        @onReset="onReset"
      >
        <template slot="simpleSearch">
          <el-form-item prop="SourceType">
            <el-select
              name="selectSourceType"
              v-model="form.SourceType"
              @change="onSimpleSearch"
            >
              <el-option
                label="全部"
                :value="0"
              ></el-option>
              <el-option
                v-for="item in EnumPackOrderBasicSourceType.TypeArray"
                :key="item.KeyId"
                :label="item.Value"
                :value="item.KeyId"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item
            name="datePickerCheckTime"
            label="交易时间："
          >
            <el-date-picker
              v-model="CheckTime"
              @change="dateChange"
              value-format="yyyy-MM-dd"
              type="daterange"
              align="left"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              :clearable="false"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="来源："
            prop="SourceType"
          >
            <el-select
              name="selectSourceType"
              v-model="form.SourceType"
            >
              <el-option
                label="全部"
                :value="0"
              ></el-option>
              <el-option
                v-for="item in EnumPackOrderBasicSourceType.TypeArray"
                :key="item.KeyId"
                :label="item.Value"
                :value="item.KeyId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="交易类型："
            prop="OrderType"
          >
            <el-select
              name="selectOrderType"
              v-model="form.OrderType"
            >
              <el-option
                label="全部"
                :value="0"
              ></el-option>
              <el-option
                v-for="item in EnumPackOrderBasicOrderType.TypeArray"
                :key="item.KeyId"
                :label="item.Value"
                :value="item.KeyId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="交易等级："
            prop="PackId"
          >
            <el-select
              name="selectPack"
              v-model="form.PackId"
            >
              <el-option
                label="全部"
                :value="0"
              ></el-option>
              <el-option
                v-for="item in packArr"
                :key="item.PackId"
                :label="item.PackName"
                :value="item.PackId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="购买时长："
            prop="Years"
          >
            <el-select
              name="selectPack"
              v-model="form.Years"
            >
              <el-option
                label="全部"
                :value="0"
              ></el-option>
              <el-option
                v-for="item in yearArr"
                :key="item.Year"
                :label="item.Year+'年'"
                :value="item.Year"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <div class="total">
      <ul
        class="clearfix"
        v-loading="loadingTop"
      >
        <li
          v-for="(item,index) in cardDataTotal"
          :key="index"
        >
          <card
            :name="item.name"
            :num="item.num"
          ></card>
        </li>
      </ul>
    </div>
    <chart-hd>
      <div class="bold">趋势图</div>
    </chart-hd>
    <div class="p-20">
      <chart
        v-loading="chartLoading"
        :options="chartOptions"
        ref="chartLine"
        auto-resize
        style="width:100%"
      />
    </div>
  </div>
</template>
<script>
import {
  COLLEGE_API_PACKORDERBASIC_SUMMARY, // 交易概况
  COLLEGE_API_PACKORDERBASIC_SUMMARYBYDATE, // 交易趋势
  COLLEGE_API_SETTINGPACK_DROPDOWNLIST, // 套餐-下拉框
  COLLEGE_API_SETTINGPACK_GETYEAR // 购买时长-下拉框
} from '@/apis/science'

import {
  PackOrderBasicSourceType,
  PackOrderBasicOrderType
} from '@/enums/science'

import searchPanel from '@/components/searchPanel'
import character from '@/views/report/statisticsReport/templateCharacter'
import card from '@/views/report/statisticsReport/templateCard'
import chartHd from '@/views/report/statisticsReport/templateChartHd'
import chart from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'

import dayjs from 'dayjs'

const CheckTime1Init = dayjs()
  .subtract(1, 'month')
  .startOf('months')
  .format('YYYY-MM-DD') // 上个月月初
const CheckTime2Init = dayjs()
  .subtract(1, 'month')
  .endOf('months')
  .format('YYYY-MM-DD') // 上个月月底
export default {
  data() {
    return {
      form: {
        SourceType: 0, // 来源类型
        OrderType: 0, // 订单类型
        PackId: 0, // 套餐序号
        Years: 0, // )购买时长
        CheckTime1: CheckTime1Init, // 时间开始
        CheckTime2: CheckTime2Init // 时间结束
      },
      CheckTime: [], // 交易时间
      parameter: {},
      packArr: [], // 等级arr
      yearArr: [], // 时长arr
      loadingTop: false, // 头部总计loading
      pickerOptions: {
        shortcuts: this.$root.datePickerOptions.shortcuts,
        disabledDate: time => {
          return time.getTime() > Date.now()
        }
      },
      // 总计数据
      cardDataTotal: [
        {
          name: '交易次数',
          num: ''
        },
        {
          name: '套餐金额',
          num: ''
        },
        {
          name: '原套餐抵扣',
          num: ''
        },
        {
          name: '应付金额',
          num: ''
        },
        {
          name: '实付金额',
          num: ''
        }
      ],
      // 图表配置项
      chartLoading: false,
      chartOptions: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['交易次数', '套餐金额', '原套餐抵扣', '应付金额', '实付金额']
        },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          containLabel: true
        },
        xAxis: {
          data: [] // 横轴
        },
        yAxis: {},
        series: [
          {
            name: '交易次数',
            type: 'line',
            data: [] // 竖轴值
          },
          {
            name: '套餐金额',
            type: 'line',
            data: [] // 竖轴值
          },
          {
            name: '原套餐抵扣',
            type: 'line',
            data: []
          },
          {
            name: '应付金额',
            type: 'line',
            data: []
          },
          {
            name: '实付金额',
            type: 'line',
            data: []
          }
        ]
      }
    }
  },
  computed: {
    EnumPackOrderBasicSourceType() {
      return PackOrderBasicSourceType
    },
    EnumPackOrderBasicOrderType() {
      return PackOrderBasicOrderType
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 获取交易概况
    summary() {
      this.loadingTop = true
      COLLEGE_API_PACKORDERBASIC_SUMMARY(this.form)
        .then(res => {
          if (res.data.Code == 'CORRECT') {
            const data = res.data.Data
            const totalArr = [
              data.OrderAmt,
              this.$root.toFloat(data.PackPrice),
              this.$root.toFloat(data.SurplusPrice),
              this.$root.toFloat(data.PaidPrice),
              this.$root.toFloat(data.CashPrice)
            ]
            this.cardDataTotal.map((item, i) => {
              item.num = i > 0 ? '¥' + totalArr[i] : totalArr[i]
            })
          } else {
            const totalArr = ['', '', '', '']
            this.cardDataTotal.map((item, i) => {
              item.num = totalArr[i]
            })
          }
          this.loadingTop = false
        })
        .catch(() => {
          this.loadingTop = false
        })
    },
    // 获取交易趋势
    summarybydate() {
      this.chartLoading = true
      /* this.$refs.chartLine.showLoading({
        text: '拼命加载中',
        color: '#007ed5'
      }) */
      COLLEGE_API_PACKORDERBASIC_SUMMARYBYDATE(this.form)
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            const basicArr = res.data.Data
            let diffArr = [],
              start = Date.parse(this.form.CheckTime1),
              end = Date.parse(this.form.CheckTime2)
            for (let d = start; d <= end; d += 24 * 60 * 60 * 1000) {
              diffArr.push({
                OrderAmt: 0,
                OrderTime: new Date(d + 1000 * 60 * 60 * 8)
                  .toJSON()
                  .split('T')[0],
                PackPrice: 0,
                PaidPrice: 0,
                CashPrice: 0,
                SurplusPrice: 0
              })
            }
            let chartDataArrbasic = [...diffArr]
            for (let i = 0; i < diffArr.length; i += 1) {
              for (let j = 0; j < basicArr.length; j += 1) {
                if (diffArr[i].OrderTime == basicArr[j].OrderTime) {
                  chartDataArrbasic[i] = basicArr[j]
                }
              }
            }
            const chartDataArr = chartDataArrbasic.map(item => ({
              OrderAmt: item.OrderAmt,
              OrderTime: item.OrderTime.substr(5),
              PackPrice: this.$root.toFloat(item.PackPrice),
              PaidPrice: this.$root.toFloat(item.PaidPrice),
              CashPrice: this.$root.toFloat(item.CashPrice),
              SurplusPrice: this.$root.toFloat(item.SurplusPrice)
            }))
            // 统计图表
            let xAxisDataArr = [],
              orderAmtArr = [],
              packPriceArr = [],
              surplusPriceArr = [],
              paidPriceArr = [],
              cashPriceArr = []
            for (let i = 0; i < chartDataArr.length; i += 1) {
              xAxisDataArr.push(chartDataArr[i].OrderTime)
              orderAmtArr.push(chartDataArr[i].OrderAmt)
              packPriceArr.push(chartDataArr[i].PackPrice)
              surplusPriceArr.push(chartDataArr[i].SurplusPrice)
              paidPriceArr.push(chartDataArr[i].PaidPrice)
              cashPriceArr.push(chartDataArr[i].CashPrice)
            }
            this.chartOptions.xAxis.data = xAxisDataArr
            this.chartOptions.series[0].data = orderAmtArr
            this.chartOptions.series[1].data = packPriceArr
            this.chartOptions.series[2].data = surplusPriceArr
            this.chartOptions.series[3].data = paidPriceArr
            this.chartOptions.series[4].data = cashPriceArr
          }
          this.chartLoading = false
          // this.$refs.chartLine.hideLoading()
        })
        .catch(() => {
          this.chartLoading = false
        })
    },
    async getData() {
      // 交易等级
      let p1 = new Promise((reso, rej) => {
        COLLEGE_API_SETTINGPACK_DROPDOWNLIST().then(res => {
          if (res.data.Code == 'CORRECT') {
            reso(res.data.Data.Subset)
          } else {
            rej(res.data.Message)
          }
        })
      })
      // 购买时长
      let p2 = new Promise((reso, rej) => {
        COLLEGE_API_SETTINGPACK_GETYEAR().then(res => {
          if (res.data.Code == 'CORRECT') {
            reso(res.data.Data)
          } else {
            rej(res.data.Message)
          }
        })
      })
      await Promise.all([p1, p2]).then(res => {
        if (res) {
          this.packArr = res[0]
          this.yearArr = res[1]
        }
      })
      this.CheckTime = [this.form.CheckTime1, this.form.CheckTime2]
      this.summary()
      this.summarybydate()
    },
    onSimpleSearch(e) {
      this.parameter.status = e
      this.onSearch()
    },
    onSearch() {
      this.getData()
    },
    onReset() {
      this.$refs['search'].resetFields()
      this.form.CheckTime1 = CheckTime1Init
      this.form.CheckTime2 = CheckTime2Init
      this.onSearch()
    },
    dateChange(v) {
      this.form.CheckTime1 = v[0]
      this.form.CheckTime2 = v[1]
    }
  },
  components: {
    character,
    card,
    chartHd,
    chart,
    searchPanel
  }
}
</script>
<style lang="scss" scoped>
.trade-report {
  .total {
    padding: 10px 0;
    ul {
      li {
        float: left;
        width: 19%;
        margin-left: 1.25%;
        background: $bg-color;
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
}
</style>