<template>
  <el-row class="p-10" v-loading="$store.getters.tb_loading">
    <el-row class="m-10 top-line-search">
      <el-date-picker name="startDate" v-model="startDate" :clearable="false" type="month" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
      <span class="m-x-10" style="font-size: 12px;">至</span>
      <el-date-picker name="endDate" v-model="endDate" :clearable="false" type="month" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
      <el-button name="btngetData" type="primary" @click="getData(true)" class="m-l-20">查询</el-button>
      <span class="date-tips">最多选择12个月</span>
    </el-row>
    <el-row>
      <el-col :span="12">
        <ECharts :options="innPieData" autoResize></ECharts>
        <div class="p-10 tc">收入项目分布</div>
      </el-col>
      <el-col :span="12">
        <el-table :data="innData">
          <el-table-column show-overflow-tooltip prop="InnItemName" label="收入项目">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="InnPrice" label="金额">
            <template slot-scope="scope">
              ￥{{$root.toFloat(scope.row.InnPrice)}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="InnRate" label="占比">
            <template slot-scope="scope">
              <span style="margin-left: 5px">{{ scope.row.InnRate | absolutely}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <ECharts :options="outPieData" autoResize></ECharts>
        <div class="p-10 tc">支出项目分布</div>
      </el-col>
      <el-col :span="12">
        <el-table :data="outData">
          <el-table-column show-overflow-tooltip prop="OutItemName" label="支出项目">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="OutPrice" label="金额">
            <template slot-scope="scope">
              ￥{{$root.toFloat(scope.row.OutPrice)}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="OutRate" label="占比">
            <template slot-scope="scope">
              <span style="margin-left: 5px">{{ scope.row.OutRate | absolutely}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
import {
  STOCKING_API_REPORT_SETTLE_CHARTBYBUDGET 
} from '@/apis/stocking'
import {
  SettleBudgetBillType 
} from '@/enums/stocking'
import dayjs from 'dayjs'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import {
  pie 
} from '@/datas/echart/pie'
export default {
  data() {
    return {
      SettleBudgetBillType,
      startDate: '',
      endDate: '',
      innData: [],
      innPieData: {
      },
      outData: [],
      outPieData: {
      },
      pickerOptions: {
        disabledDate(date) {
          return date.getFullYear() < 2016
        }
      }
    }
  },
  methods: {
    getData(boolean) {
      var time1 = this.startDate
      var time2 = this.endDate

      if (
        Date.parse(this.endDate) - Date.parse(this.startDate) >
        12 * 30 * 24 * 60 * 60 * 1000
      ) {
        this.$message.warning('最多选择12个月')
        return false
      }

      if (Date.parse(this.endDate) - Date.parse(this.startDate) < 0) {
        this.$message.warning('结束时间不能小于起始时间')
        return false
      }

      if (boolean) {
        var date = new Date(time1) // 前一个
        var date2 = new Date(time2) // 后一个
        date = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + '01'
        date2 = date2.getFullYear() + '/' + (date2.getMonth() + 1) + '/' + '01'
        time1 = date
        time2 = date2 // 明细的时间
      }
      time2 = new Date(Date.parse(new Date(time2).getFullYear() + '/' + (new Date(time2).getMonth() + 2) + '/' + '01') - 24 * 3600 * 1000)
      STOCKING_API_REPORT_SETTLE_CHARTBYBUDGET({
        SettleBudgetBillType: 0,
        Date1: dayjs(time1).format('YYYY-MM-DD'),
        Date2: dayjs(time2).format('YYYY-MM-DD')
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          var data1 = [
            { InnItemName: '素金销售' },
            { InnItemName: '非素销售' },
            { InnItemName: '维修费' },
            { InnItemName: '其他收入' },
          ]
          var data2 = [
            { OutItemName: '期初支出' },
            { OutItemName: '素金成本' },
            { OutItemName: '非素成本' },
            { OutItemName: '工资' },
            { OutItemName: '房租' },
            { OutItemName: '水电' },
            { OutItemName: '杂费' },
            { OutItemName: '其他支出' },
          ]
          let pieData1 = [], pieData2 = []
          let resData = res.data.Data.Rows || []
          data1[0].InnPrice = resData[0].InnSaleGoldPrice
          data1[1].InnPrice = resData[0].InnSaleUngoldPrice
          data1[2].InnPrice = resData[0].InnRepairPrice
          data1[3].InnPrice = resData[0].InnOtherPrice

          data1[0].InnRate = resData[0].InnTotalPrice === 0 ? 0 : resData[0].InnSaleGoldPrice / resData[0].InnTotalPrice
          data1[1].InnRate = resData[0].InnTotalPrice === 0 ? 0 : resData[0].InnSaleUngoldPrice / resData[0].InnTotalPrice
          data1[2].InnRate = resData[0].InnTotalPrice === 0 ? 0 : resData[0].InnRepairPrice / resData[0].InnTotalPrice
          data1[3].InnRate = resData[0].InnTotalPrice === 0 ? 0 : resData[0].InnOtherPrice / resData[0].InnTotalPrice

          data2[0].OutPrice = resData[0].OutPeriodPrice
          data2[1].OutPrice = resData[0].OutJunkGoldPrice
          data2[2].OutPrice = resData[0].OutJunkUngoldPrice
          data2[3].OutPrice = resData[0].OutSalaryPrice
          data2[4].OutPrice = resData[0].OutRentPrice
          data2[5].OutPrice = resData[0].OutWaterPrice
          data2[6].OutPrice = resData[0].OutJumbPrice
          data2[7].OutPrice = resData[0].OutOtherPrice

          data2[0].OutRate = resData[0].OutTotalPrice === 0 ? 0 : resData[0].OutPeriodPrice / resData[0].OutTotalPrice
          data2[1].OutRate = resData[0].OutTotalPrice === 0 ? 0 : resData[0].OutJunkGoldPrice / resData[0].OutTotalPrice
          data2[2].OutRate = resData[0].OutTotalPrice === 0 ? 0 : resData[0].OutJunkUngoldPrice / resData[0].OutTotalPrice
          data2[3].OutRate = resData[0].OutTotalPrice === 0 ? 0 : resData[0].OutSalaryPrice / resData[0].OutTotalPrice
          data2[4].OutRate = resData[0].OutTotalPrice === 0 ? 0 : resData[0].OutRentPrice / resData[0].OutTotalPrice
          data2[5].OutRate = resData[0].OutTotalPrice === 0 ? 0 : resData[0].OutWaterPrice / resData[0].OutTotalPrice
          data2[6].OutRate = resData[0].OutTotalPrice === 0 ? 0 : resData[0].OutJumbPrice / resData[0].OutTotalPrice
          data2[7].OutRate = resData[0].OutTotalPrice === 0 ? 0 : resData[0].OutOtherPrice / resData[0].OutTotalPrice
          this.innData = data1
          this.outData = data2
          data1.forEach(item => {
            if (item.InnPrice > 0) {
              pieData1.push({
                name: item.InnItemName,
                value: this.$root.toFloat(item.InnPrice)
              })
            }
          })
          data2.forEach(item => {
            if (item.OutPrice > 0) {
              pieData2.push({
                name: item.OutItemName,
                value: this.$root.toFloat(item.OutPrice)
              })
            }
          })
          this.innPieData = this.initPiedata(
            res.data.Data.InnTotalPrice,
            pieData1,
            1
          )
          this.outPieData = this.initPiedata(
            res.data.Data.OutTotalPrice,
            pieData2,
            2
          )
        }
      })
    },
    initPiedata(total, data, type) {
      // 饼图
      let pieData = JSON.parse(JSON.stringify(pie))
      if (data.length === 0) {
        pieData.title.text = '暂无数据'
        pieData.series[0].data = [
          {
            value: 0,
            name: '暂无数据'
          }
        ]
      } else {
        pieData.title.text = type === 1 ? '总收入' : '总支出'
        pieData.title.subtext = this.$root.toFloat(total)
        pieData.series[0].data = data
      }
      return pieData
    }
  },
  beforeMount() {
    var date = new Date()
    this.startDate = date.getFullYear() + '/' + 1 + '/' + '01'
    this.endDate = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + '01'
    this.startDate = dayjs(this.startDate).format('YYYY-MM-DD')
    this.endDate = dayjs(this.endDate).format('YYYY-MM-DD')
  },
  mounted() {
    this.getData(false)
  },
  filters: {
    absolutely(value) {
      if (value < 0) {
        return 0 + '%'
      } else {
        return (value * 100).toFixed(2) + '%'
      }
    }
  },
  components: {
    ECharts
  }
}
</script>
<style lang="scss" scoped>
.echarts {
  width: 80% !important;
  height: 300px;
  line-height: 250px;
  margin: 0 auto;
}
.date-tips {
    margin-left: 10px;
    line-height: 28px;
    font-size: 12px;
    color: red;
}
</style>
