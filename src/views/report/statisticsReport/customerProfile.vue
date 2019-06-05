<template>
  <div class="customer-profile">
    <character ref="character" @onCharacterChange="onCharacterChange" style="margin-bottom: 10px"></character>
    <dl>
      <dt>
        客户概况
      </dt>
      <dd>
        <ul class="clearfix" v-loading="loadingTop1">
          <li v-for="(item,index) in memberSummaryArr" :key="index">
            <card-q :name="item.name" :tip="item.tip" :num="item.num"></card-q>
          </li>
        </ul>
      </dd>
      <dt>
        今日新增
      </dt>
      <dd>
        <ul class="clearfix" v-loading="loadingTop2">
          <li v-for="(item,index) in todayIncreaseArr" :key="index">
            <card-q :name="item.name" :tip="item.tip" :num="item.num"></card-q>
          </li>
        </ul>
      </dd>
    </dl>
    <chart-hd>
      <div class="fl bold">
        近30天增长趋势
      </div>
      <div class="fr">
        <el-radio-group name="chartType" v-model="chartType" @change="onChartTypeChange">
          <el-radio-button label="fansCount">新增粉丝</el-radio-button>
          <el-radio-button label="lostCount">流失粉丝</el-radio-button>
          <el-radio-button label="memberCount">新增会员</el-radio-button>
          <el-radio-button label="changeCount">粉丝转会员</el-radio-button>
        </el-radio-group>
      </div>
    </chart-hd>
    <div class="p-20">
      <chart :options="chartOptions" ref="chartBar" auto-resize style="width:100%" />
    </div>
  </div>
</template>
<script>
import character from './templateCharacter'
import cardQ from './templateCardQ'
import chartHd from './templateChartHd'
import chart from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import {
  MEMBERSHIP_API_REPORT_MEMBERSUMMARY,
  MEMBERSHIP_API_REPORT_TODAYINCREASE,
  MEMBERSHIP_API_REPORT_GROWINGTENDENCY
} from '@/apis/membership'

export default {
  data() {
    return {
      loadingTop1: false, // 客户概况loading
      loadingTop2: false, // 今日新增loading
      memberSummaryArr: [
        // 客户概况
        {
          name: '粉丝总数',
          tip: '已关注微信公众号的用户总数，不包括取消关注的流失粉丝。',
          num: ''
        },
        {
          name: '流失粉丝',
          tip: '取消关注微信公众号的数量',
          num: ''
        },
        {
          name: '粉丝流失率',
          tip: '粉丝流失率 = 流失粉丝 ÷ (粉丝总数 + 流失粉丝)',
          num: ''
        },
        {
          name: '会员总数',
          tip: '系统所有会员，包括粉丝转化的和手工添加的会员',
          num: ''
        },
        {
          name: '粉丝转会员',
          tip: '粉丝中成为会员的数量',
          num: ''
        },
        {
          name: '粉丝转化率',
          tip: '粉丝转化率 = 粉丝转会员 ÷ (粉丝总数 + 流失粉丝)',
          num: ''
        }
      ],
      todayIncreaseArr: [
        // 今日新增
        {
          name: '新增粉丝',
          tip: '今日关注微信公众号的用户总数。',
          num: ''
        },
        {
          name: '流失粉丝',
          tip: '今日取消关注微信公众号的数量',
          num: ''
        },
        {
          name: '粉丝流失率',
          tip: '粉丝流失率 = 今日流失粉丝 ÷ 今日新增粉丝',
          num: ''
        },
        {
          name: '新增会员',
          tip: '今日新增加的会员，包括粉丝转化的和手工添加的会员',
          num: ''
        },
        {
          name: '粉丝转会员',
          tip: '今日粉丝中成为会员的数量',
          num: ''
        },
        {
          name: '粉丝转化率',
          tip: '粉丝转化率 = 今日粉丝转会员 ÷ 今日新增粉丝',
          num: ''
        }
      ],
      growingTendencyArr: [], // 近30天返回数据
      chartType: 'fansCount', // 增长趋势Tab
      chartOptions: {
        // 图表配置项
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
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
            name: '数量',
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#007ed5'
              }
            },
            data: [] // 竖轴值
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
      this.chartType = 'fansCount'
      this.memberSummary()
      this.todayIncrease()
      this.growingTendency()
    },
    // 增长趋势tab切换事件
    onChartTypeChange() {
      let seriesDataArr = []
      for (let i = 0; i < this.growingTendencyArr.length; i += 1) {
        seriesDataArr.push(this.growingTendencyArr[i][this.chartType])
      }
      this.chartOptions.series[0].data = seriesDataArr
    },
    // 客户概况
    memberSummary() {
      this.loadingTop1 = true
      MEMBERSHIP_API_REPORT_MEMBERSUMMARY(this.characterId).then(res => {
        if (res.data.Code === 'CORRECT') {
          const data = res.data.Data
          const dataArr = [
            data.fansCount,
            data.lostCount,
            data.lostRateString,
            data.memberCount,
            data.changeCount,
            data.changeRateString
          ]
          this.memberSummaryArr.map((item, i) => {
            item.num = dataArr[i]
          })
        }
        this.loadingTop1 = false
      })
    },
    // 今日新增
    todayIncrease() {
      this.loadingTop2 = true
      MEMBERSHIP_API_REPORT_TODAYINCREASE(this.characterId).then(res => {
        if (res.data.Code === 'CORRECT') {
          const data = res.data.Data
          const dataArr = [
            data.fansCount,
            data.lostCount,
            data.lostRateString,
            data.memberCount,
            data.changeCount,
            data.changeRateString
          ]
          this.todayIncreaseArr.map((item, i) => {
            item.num = dataArr[i]
          })
        }
        this.loadingTop2 = false
      })
    },
    // 近30天增长趋势
    growingTendency() {
      this.$refs.chartBar.showLoading({
        text: '拼命加载中',
        color: '#007ed5'
      })
      MEMBERSHIP_API_REPORT_GROWINGTENDENCY(this.characterId).then(res => {
        if (res.data.Code === 'CORRECT') {
          const dataArr = res.data.Data
          this.growingTendencyArr = dataArr
          let xAxisDataArr = []
          let seriesDataArr = []
          for (let i = 0; i < dataArr.length; i += 1) {
            xAxisDataArr.push(dataArr[i].dateLabel)
            seriesDataArr.push(dataArr[i][this.chartType])
          }
          this.chartOptions.xAxis.data = xAxisDataArr
          this.chartOptions.series[0].data = seriesDataArr
        }
        this.$refs.chartBar.hideLoading()
      })
    }
  },
  components: {
    character,
    cardQ,
    chartHd,
    chart
  }
}
</script>
<style lang="scss" scoped>

.customer-profile {
  & > dl {
    padding: 10px;
    margin: 0 0 10px;
    background: $bg-color;
    dt {
      width: 80px;
      height: 24px;
      line-height: 24px;
      margin-top: 10px;
      background: #399fe5;
      text-align: center;
      color: $white;
      &:first-child {
        margin-top: 0;
      }
    }
    dd {
      margin: 10px 0 0;
      li {
        float: left;
        width: 16%;
        margin-left: 0.8%;
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
}
.dd {
  color: #c23531;
}
</style>
