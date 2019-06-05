<template>
  <div class="member-statistics">
    <chart-hd>
      <div class="fl">
        <character ref="character" @onCharacterChange="onCharacterChange"></character>
      </div>
      <div class="fl item radiogroup">
        <el-radio-group name="chartType" v-model="chartType" @change="onChartTypeChange">
          <el-radio-button label="today">今天</el-radio-button>
          <el-radio-button label="yesterday">昨天</el-radio-button>
          <el-radio-button label="nearlyAweek">近7天</el-radio-button>
          <el-radio-button label="nearlyAmonth">近30天</el-radio-button>
        </el-radio-group>
      </div>
      <div class="fl item daterange">
        <el-date-picker type="daterange" @change="onChartTypesChange" name="chartTime" v-model="chartTime" value-format="yyyy-MM-dd" unlink-panels range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
        </el-date-picker>
      </div>
    </chart-hd>
    <div class="total">
      <ul class="clearfix" v-loading="loadingTop">
        <li v-for="(item,index) in cardDataTotal" :key="index">
          <card :name="item.name" :num="item.num"></card>
        </li>
      </ul>
    </div>
    <chart-hd>
      <div class="bold">
        增长趋势
      </div>
    </chart-hd>
    <div class="p-20">
      <chart :options="chartOptions" ref="chartLine" auto-resize style="width:100%" />
    </div>
  </div>
</template>
<script>
import character from './templateCharacter'
import card from './templateCard'
import chartHd from './templateChartHd'
import chart from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import {
  MEMBERSHIP_API_REPORT_MEMBERSTATISTICS 
} from '@/apis/membership'

import dayjs from 'dayjs'
const todayFormat = dayjs().format('YYYY-MM-DD')
export default {
  data() {
    return {
      loadingTop: false, // 头部总计loading
      chartType: 'nearlyAmonth', // 时间段，默认近30天
      chartTime: [], // date-picker的值
      startTime: dayjs() // 开始时间
        .subtract(29, 'days')
        .format('YYYY-MM-DD'),
      endTime: todayFormat, // 结束时间
      pickerOptions: {
        // 不能选时间
        disabledDate: time => {
          return time.getTime() > Date.now()
        }
      },
      // 总计数据
      cardDataTotal: [
        {
          name: '新增会员',
          num: ''
        },
        {
          name: '粉丝转化',
          num: ''
        },
        {
          name: '手工创建',
          num: ''
        }
      ],
      // 图表配置项
      chartOptions: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['新增会员', '粉丝转化', '手工创建']
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
        yAxis: {
        },
        series: [
          {
            name: '新增会员',
            type: 'line',
            data: [] // 竖轴值
          },
          {
            name: '粉丝转化',
            type: 'line',
            data: []
          },
          {
            name: '手工创建',
            type: 'line',
            data: []
          }
        ]
      }
    }
  },
  computed: {
    characterId() {
      return this.$refs.character.characterIdArr[
        this.$refs.character.characterIdArr.length - 1
      ]
    }
  },
  mounted() {
    this.onCharacterChange()
  },
  methods: {
    // 公司选择,整个渲染
    onCharacterChange() {
      this.chartTime = [this.startTime , this.endTime]
      this.fansStatistics()
    },
    // 时间段切换
    onChartTypeChange(v) {
      switch (v) {
        case 'today':
          this.startTime = todayFormat
          this.endTime = todayFormat
          break
        case 'yesterday':
          this.startTime = dayjs()
            .subtract(1, 'days')
            .format('YYYY-MM-DD')
          this.endTime = dayjs()
            .subtract(1, 'days')
            .format('YYYY-MM-DD')
          break
        case 'nearlyAweek':
          this.startTime = dayjs()
            .subtract(6, 'days')
            .format('YYYY-MM-DD')
          this.endTime = todayFormat
          break
        case 'nearlyAmonth':
          this.startTime = dayjs()
            .subtract(29, 'days')
            .format('YYYY-MM-DD')
          this.endTime = todayFormat
          break
      }
      this.chartTime = [this.startTime , this.endTime]
      this.fansStatistics()
    },
    // 时间选取事件
    onChartTypesChange(v) {
      this.startTime = dayjs(v[0]).format('YYYY-MM-DD')
      this.endTime = dayjs(v[1]).format('YYYY-MM-DD')
      this.chartType = ''
      this.fansStatistics()
    },
    // 粉丝统计相关
    fansStatistics() {
      this.loadingTop = true
      this.$refs.chartLine.showLoading({
        text: '拼命加载中',
        color: '#007ed5'
      })
      const param = {
        characterId: this.characterId,
        startTime: this.startTime,
        endTime: this.endTime
      }
      MEMBERSHIP_API_REPORT_MEMBERSTATISTICS(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          const data = res.data.Data
          const chartDataArr = data.chartData
          // 统计总
          const totalArr = [
            data.totalIncrease,
            data.totalChange,
            data.totalOffline
          ]
          this.cardDataTotal.map((item, i) => {
            item.num = totalArr[i]
          })
          // 统计图表
          let xAxisDataArr = []
          let memberCountArr = []
          let changeCountArr = []
          let offLineCountArr = []
          for (let i = 0; i < chartDataArr.length; i += 1) {
            xAxisDataArr.push(chartDataArr[i].dateLabel)
            memberCountArr.push(chartDataArr[i].memberCount)
            changeCountArr.push(chartDataArr[i].changeCount)
            offLineCountArr.push(chartDataArr[i].offLineCount)
          }
          this.chartOptions.xAxis.data = xAxisDataArr
          this.chartOptions.series[0].data = memberCountArr
          this.chartOptions.series[1].data = changeCountArr
          this.chartOptions.series[2].data = offLineCountArr
        }
        this.loadingTop = false
        this.$refs.chartLine.hideLoading()
      })
    }
  },
  components: {
    character,
    card,
    chartHd,
    chart
  }
}
</script>
<style lang="scss" scoped>
.member-statistics {
  .total {
    padding: 10px 0;
    ul {
      li {
        float: left;
        width: 32.6%;
        margin-left: 1.1%;
        background: $bg-color;
        &:first-child {
          margin-left: 0;
        }
        &:nth-child(2) {
          /deep/ p {
            color: red;
          }
        }
      }
    }
  }
}
</style>