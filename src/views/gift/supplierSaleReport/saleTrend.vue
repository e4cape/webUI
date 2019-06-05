<template>
  <el-row>
    <div class="m-10 top-line-search">
      <el-date-picker name="datetime" type="daterange" @change="getData" v-model="datetime" value-format="yyyy-MM-dd" unlink-panels :clearable="false" placeholder="选择日期范围" :picker-options="$root.datePickerOptions"></el-date-picker>
    </div>
    <el-row :gutter="20" class="total-panel">
      <el-col :span="8">
        <div class="total qty">
          <div class="number">{{summary.orderTotal || 0}}</div>
          <div class="name">订单数量</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="total weight">
          <div class="number">{{summary.giftTotal || 0}}</div>
          <div class="name">礼品数量</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="total cashier">
          <div class="number">{{summary.memberTotal || 0}}</div>
          <div class="name">人数</div>
        </div>
      </el-col>
    </el-row>
    <div class="panel-tag m-10">
      <span>兑换趋势</span>
    </div>
    <el-row class="chart" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <ECharts :options="options" autoResize></ECharts>
    </el-row>
  </el-row>
</template>

<script>
import {
  GIFTING_API_STATISTIC_SALESREPORTINFO 
} from '@/apis/gifting'
import {
  giftSaleBar 
} from '@/datas/echart/bar'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legendScroll'

import dayjs from 'dayjs'

export default {
  data() {
    return {
      datetime: '',
      summary: {
      }, // 合计
      options: {
      } // echart的参数
    }
  },
  methods: {
    // 按销量
    getData(v) {
      this.$store.commit('SET_TB_LOADING', true)
      GIFTING_API_STATISTIC_SALESREPORTINFO({
        timeStart: this.datetime[0],
        timeEnd: this.datetime[1]
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.summary = {
            orderTotal: res.data.Data.orderTotal,
            giftTotal: res.data.Data.giftTotal,
            memberTotal: res.data.Data.memberTotal
          }
          this.initOptions(res.data.Data.items)
        } else {
          this.$message.error(res.data.Message)
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    initOptions(data) {
      let options = JSON.parse(JSON.stringify(giftSaleBar))
      let xAxis = []
      let seriesData = [[], [], []]
      let column = {
      } // 订单数量统计线
      let column1 = {
      } // 礼品数量统计线
      let column2 = {
      } // 人数统计线
      let start = Date.parse(this.datetime[0])
      let end = Date.parse(this.datetime[1])
      for (let d = start; d <= end; d += 24 * 60 * 60 * 1000) {
        let date = new Date(d + 1000 * 60 * 60 * 8).toJSON().split('T')[0]
        column[date] = 0
        column1[date] = 0
        column2[date] = 0
      }
      data.forEach(res => {
        let date = res.dateLabel
        column[date] = res.orderTotal
        column1[date] = res.giftTotal
        column2[date] = res.memberTotal
      })
      for (let t in column) {
        xAxis.push(t.substr(5))
        seriesData[0].push(column[t])
        seriesData[1].push(column1[t])
        seriesData[2].push(column2[t])
      }
      options.xAxis.data = xAxis
      options.series[0].data = seriesData[0]
      options.series[1].data = seriesData[1]
      options.series[2].data = seriesData[2]
      this.options = options
    }
  },
  created() {},
  beforeMount() {
    this.datetime = [
      dayjs()
        .subtract(6, 'days')
        .format('YYYY-MM-DD'),
      dayjs().format('YYYY-MM-DD')
    ] // 统计的时间
  },
  mounted() {
    this.getData()
  },
  watch: {
  },
  components: {
    ECharts
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/sass/report.scss';
.chart .echarts {
  width: 100%;
}
</style>

