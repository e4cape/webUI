<template>
  <div class="marketing-effectiveness-analysis">
    <character
      ref="character"
      @onCharacterChange="onCharacterChange"
      style="margin-bottom: 10px"
    ></character>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="con sp">
          <chart-hd>
            <div class="fl bold">
              营销日期
            </div>
            <div class="fl item">
              <el-date-picker
                class="datesp"
                type="daterange"
                @change="onChartTypesChange($event,'chartTime1')"
                name="chartTime1" v-model="chartTime1"
                value-format="yyyy-MM-dd"
                unlink-panels
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions1"
              >
              </el-date-picker>
            </div>
            <span class="fl">
              {{chartTimeDiff1}}天
            </span>
          </chart-hd>
          <ul
            class="clearfix"
            v-loading="loadingLeft"
          >
            <li
              v-for="(item,index) in cardDatas1"
              :key="index"
            >
              <card
                :name="item.name"
                :num="item.num"
              ></card>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="con">
          <chart-hd>
            <div class="fl bold">
              对比日期
            </div>
            <div class="fl item">
              <el-date-picker
                class="datesp"
                type="daterange"
                @change="onChartTypesChange"
                name="chartTime2" v-model="chartTime2"
                value-format="yyyy-MM-dd"
                unlink-panels
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions2"
              >
              </el-date-picker>
            </div>
            <span class="fl">
              {{chartTimeDiff2}}天
            </span>
          </chart-hd>
          <ul
            class="clearfix"
            v-loading="loadingRight"
          >
            <li
              v-for="(item,index) in cardDatas2"
              :key="index"
            >
              <card
                :name="item.name"
                :num="item.num"
              ></card>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import character from './templateCharacter'
import card from './templateCard'
import chartHd from './templateChartHd'
import {
  MEMBERSHIP_API_REPORTMARKETING_GETMARKETINGSTATISTICS 
} from '@/apis/membership'
import dayjs from 'dayjs'

const chartTime1Start = dayjs().startOf('month')
const chartTime1End = dayjs().endOf('month')
const chartTime2Start = dayjs()
  .subtract(1, 'month')
  .startOf('month')
const chartTime2End = dayjs()
  .subtract(1, 'month')
  .endOf('month')

export default {
  data() {
    return {
      loadingLeft: false, // 营销日期loading
      loadingRight: false, // 对比日期loading
      chartTime1: [
        // 营销时间值
        chartTime1Start.format('YYYY-MM-DD'),
        chartTime1End.format('YYYY-MM-DD')
      ],
      chartTime2: [
        // 对比时间值
        chartTime2Start.format('YYYY-MM-DD'),
        chartTime2End.format('YYYY-MM-DD')
      ],
      chartTimeDiff1: chartTime1End.diff(chartTime1Start, 'days') + 1, // 营销天数
      chartTimeDiff2: chartTime2End.diff(chartTime2Start, 'days') + 1, // 对比天数
      pickerOptions1: {
        // 控制营销选择时间范围
        disabledDate: time => {
          return (
            time < dayjs().subtract(100, 'days') ||
            time > dayjs().add(0, 'days')
          )
        }
      },
      pickerOptions2: {
        // 控制对比选择时间范围
        disabledDate: time => {
          return (
            time < dayjs().subtract(100, 'days') ||
            time > dayjs().add(0, 'days')
          )
        }
      },
      // 营销数据
      cardDatas1: [
        {
          name: '发送短信(人)',
          num: ''
        },
        {
          name: '发送短信(次)',
          num: ''
        },
        {
          name: '平均发送短信人次',
          num: ''
        },
        {
          name: '回访人数',
          num: ''
        },
        {
          name: '回访次数',
          num: ''
        },
        {
          name: '平均回访人次',
          num: ''
        },
        {
          name: '本期增长销量',
          num: ''
        },
        {
          name: '本期增长应付金额',
          num: ''
        },
        {
          name: '本期增长实付金额',
          num: ''
        },
        {
          name: '期初会员',
          num: ''
        },
        {
          name: '期末会员',
          num: ''
        },
        {
          name: '本期增加会员',
          num: ''
        },
        {
          name: '期初会员转化率',
          num: ''
        },
        {
          name: '期末会员转化率',
          num: ''
        },
        {
          name: '本期增加转化率',
          num: ''
        }
      ],
      // 对比数据
      cardDatas2: [
        {
          name: '发送短信(人)',
          num: ''
        },
        {
          name: '发送短信(次)',
          num: ''
        },
        {
          name: '平均发送短信人次',
          num: ''
        },
        {
          name: '回访人数',
          num: ''
        },
        {
          name: '回访次数',
          num: ''
        },
        {
          name: '平均回访人次',
          num: ''
        },
        {
          name: '本期增长销量',
          num: ''
        },
        {
          name: '本期增长应付金额',
          num: ''
        },
        {
          name: '本期增长实付金额',
          num: ''
        },
        {
          name: '期初会员',
          num: ''
        },
        {
          name: '期末会员',
          num: ''
        },
        {
          name: '本期增加会员',
          num: ''
        },
        {
          name: '期初会员转化率',
          num: ''
        },
        {
          name: '期末会员转化率',
          num: ''
        },
        {
          name: '本期增加转化率',
          num: ''
        }
      ]
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
      this.getMarketingStatistics(true)
      this.getMarketingStatistics()
    },
    // 角色-公司选择
    onCharacterIdChange(v) {
      this.characterId = v[v.length - 1]
      this.getMarketingStatistics(true)
      this.getMarketingStatistics()
    },
    // 时间选择
    onChartTypesChange(e, v) {
      const chartTimeDiff = dayjs(e[1]).diff(dayjs(e[0]), 'days') + 1
      if (v === 'chartTime1') {
        this.chartTimeDiff1 = chartTimeDiff
        this.getMarketingStatistics(true)
      } else {
        this.chartTimeDiff2 = chartTimeDiff
        this.getMarketingStatistics()
      }
    },
    // 营销效果分析
    getMarketingStatistics(leftIf) {
      let dateStart = []
      let dateEnd = []
      if (leftIf) {
        this.loadingLeft = true
        dateStart = this.chartTime1[0]
        dateEnd = this.chartTime1[1]
      } else {
        this.loadingRight = true
        dateStart = this.chartTime2[0]
        dateEnd = this.chartTime2[1]
      }
      const param = {
        characterId: this.characterId,
        dateStart,
        dateEnd
      }
      MEMBERSHIP_API_REPORTMARKETING_GETMARKETINGSTATISTICS(param).then(res => {
        if (res.data.Code == 'CORRECT') {
          const dataArr = res.data.Data
          const numArr = [
            dataArr.messageMemberCount, // 发送短信(人)
            dataArr.messageSendCount, // 发送短信(次)
            dataArr.messageAverageCount, // 平均发送短信人次
            dataArr.vistMemberCount, // 回访人数
            dataArr.vistCount, // 回访次数
            dataArr.vistAverageCount, // 平均回访人次
            dataArr.salesCount, // 本期增长销量
            dataArr.salesOrderPrice, // 本期增长销售额(应付)
            dataArr.salesActualPrice, // 本期增长销售额(实付)
            dataArr.beginPeriodMemberCount, // 期初会员
            dataArr.endPeriodMemberCount, // 期末会员
            dataArr.increaseMemberCount, // 本期增加会员
            dataArr.beginPeriodConversionRateText, // 期初会员转化率
            dataArr.endPeriodConversionRateText, // 期末会员转化率
            dataArr.increaseConversionRateText // 本期增加转化率
          ]
          for (let i = 0; i < numArr.length; i += 1) {
            if (leftIf) {
              this.cardDatas1[i].num = numArr[i]
            } else {
              this.cardDatas2[i].num = numArr[i]
            }
          }
        }
        if (leftIf) {
          this.loadingLeft = false
        } else {
          this.loadingRight = false
        }
      })
    }
  },
  components: {
    character,
    card,
    chartHd
  }
}
</script>
<style lang="scss" scoped>
.marketing-effectiveness-analysis {
  .datesp {
    position: relative;
    border: 1px solid $white;
    top: 3px;
    /deep/ .el-icon-date {
      position: relative;
      top: -2px;
    }
    /deep/ .el-range-separator {
      position: relative;
      top: -2px;
    }
  }
  .chart-hd {
    background: #e1e1e1;
  }
  .el-row {
    margin: 0 !important;
    .el-col-12 {
      &:first-child {
        padding-left: 0 !important;
      }
      &:last-child {
        padding-right: 0;
      }
    }
  }
  .con {
    background: $bg-color;
    &.sp .chart-hd {
      background: #399fe5;
      color: $white;
    }
    ul {
      padding: 5px 5px 15px;
      li {
        float: left;
        width: 33.333333333%;
        padding: 0 5px;
        margin-top: 10px;
        .card {
          background: $white;
        }
      }
    }
  }
}
</style>