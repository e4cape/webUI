<template>
  <div class="contents">
    <el-row :gutter="10" tag="div" class="m-b-10" v-loading="totalLoading">
      <el-col :span="12">
        <div class="account">
          <p class="title-name">通知类账户</p>
          <div class="account-item">
            <div class="item remain">
              <i class="icon-message"></i>
              <div class="right">
                <p>{{totalSummary.notifyLeft}}</p>
                <p>短信余额（条）</p>
              </div>
            </div>
            <div class="item wait">
              <i class="icon-wait"></i>
              <div class="right">
                <p>{{totalSummary.notifyPendingCount}}</p>
                <p>待发送（条）</p>
              </div>
            </div>
            <div class="item sended">
              <i class="icon-piechart"></i>
              <div class="right">
                <p>{{totalSummary.notifySent}}</p>
                <p>累计发送（条）</p>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="account">
          <p class="title-name">营销类账户</p>
          <div class="account-item">
            <div class="item remain">
              <i class="icon-message"></i>
              <div class="right">
                <p>{{totalSummary.salesLeft}}</p>
                <p>短信余额（条）</p>
              </div>
            </div>
            <div class="item wait">
              <i class="icon-wait"></i>
              <div class="right">
                <p>{{totalSummary.salesPendingCount}}</p>
                <p>待发送（条）</p>
              </div>
            </div>
            <div class="item sended">
              <i class="icon-piechart"></i>
              <div class="right">
                <p>{{totalSummary.salesSent}}</p>
                <p>累计发送（条）</p>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="today-send m-b-10" v-loading="todayLoading">
      <div class="top">
        <p class="title-name">今日发送</p>
        <el-select name="btnGetTodaySummary" v-model="templateType" @change="getTodaySummary">
          <el-option value="" label="全部"></el-option>
          <el-option v-for="(item, index) in TemplateTypes.Types" :key="index" :value="item.key" :label="item.title"></el-option>
        </el-select>
      </div>
      <ul class="send-item">
        <li>
          <p>{{todaySummary.totalCount}}</p>
          <p>发送总数</p>
        </li>
        <li>
          <p>{{todaySummary.successCount}}</p>
          <p>成功数（{{todaySummary.successPercent}}%）</p>
        </li>
        <li>
          <p>{{todaySummary.failedCount}}</p>
          <p>失败数（{{todaySummary.failedPercent}}%）</p>
        </li>
        <li>
          <p>{{todaySummary.unknownCount}}</p>
          <p>未知数</p>
        </li>
      </ul>
    </div>
    <div class="send-summary" v-loading="monthlyLoading">
      <div class="top title m-b-10">
        <p class="title-name">发送统计</p>
        <el-select name="btnSelectTemplateType" v-model="params.templateType" @change="getMonthlySummary">
          <el-option value="" label="全部"></el-option>
          <el-option v-for="(item, index) in TemplateTypes.Types" :key="index" :value="item.key" :label="item.title"></el-option>
        </el-select>
      </div>
      <el-date-picker name="btnMonthlySummary" v-model="params.date" @change="getMonthlySummary" :picker-options="options" type="month" placeholder="选择月" :clearable="false">
      </el-date-picker>
      <v-chart :options="line" style="width: 100%"></v-chart>
    </div>
  </div>
</template>

<script>
import {
  TemplateTypes 
} from '@/enums/message'
import {
  MESSAGE_API_SUMMARY_GETTOTALSUMMARY,
  MESSAGE_API_SUMMARY_GETTODAYSUMMARY,
  MESSAGE_API_SUMMARY_GETMONTHLYSUMMARY
} from '@/apis/message'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'

export default {
  components: {
    'v-chart': ECharts
  },
  data() {
    return {
      TemplateTypes,
      templateType: '',
      totalSummary: {
      },
      todaySummary: {
      },
      monthlySummary: {
      },
      totalLoading: true,
      todayLoading: true,
      monthlyLoading: true,
      params: {
        year: '',
        month: '',
        date: new Date(),
        templateType: ''
      },
      options: {
        disabledDate: time => {
          return time.getTime() > Date.now()
        }
      },
      line: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['数量']
        },
        xAxis: {
          boundaryGap: false,
          data: [],
          axisLine: {
            show: false,
            onZero: false
          }
        },
        yAxis: {
          type: 'value',
          minInterval: 1
        },
        series: [
          {
            name: '数量',
            type: 'line',
            symbolSize: 5,
            data: [],
            itemStyle: {
              normal: {
                color: '#3c94e7',
                lineStyle: {
                  color: '#3c94e7'
                },
                fillStyle: {
                  color: '#3c94e7'
                }
              }
            },
            areaStyle: {
              normal: {
                lineStyle: {
                  color: '#3c94e7'
                }
              }
            }
          }
        ]
      }
    }
  },
  created() {
    this.getTodaySummary()
    this.getTotalSummary()
    this.getMonthlySummary()
  },
  methods: {
    getTotalSummary() {
      this.totalLoading = true
      MESSAGE_API_SUMMARY_GETTOTALSUMMARY('').then(res => {
        this.totalLoading = false
        if (res.data.Code === 'CORRECT') {
          this.totalSummary = res.data.Data
        }
      })
    },
    getTodaySummary() {
      this.todayLoading = true
      MESSAGE_API_SUMMARY_GETTODAYSUMMARY({
        templateType: this.templateType
      }).then(res => {
        this.todayLoading = false
        if (res.data.Code === 'CORRECT') {
          this.todaySummary = res.data.Data
        }
      })
    },
    getMonthlySummary() {
      this.monthlyLoading = true
      this.params.year = this.params.date.getFullYear()
      this.params.month = this.params.date.getMonth() + 1
      MESSAGE_API_SUMMARY_GETMONTHLYSUMMARY(this.params).then(res => {
        this.monthlyLoading = false
        if (res.data.Code === 'CORRECT') {
          this.line.xAxis.data = []
          res.data.Data.forEach((item, index) => {
            this.line.xAxis.data.push(index + 1)
          })
          this.line.series[0].data = res.data.Data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px;
}
p.title-name {
  height: 38px;
  line-height: 38px;
  font-size: 14px;
  font-weight: 700;
  color: #777;
}
.account {
  padding-left: 20px;
  padding-bottom: 20px;
  background-color: #f5f5f5;
  .account-item {
    display: flex;
    .item {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-right: 10px;
      padding: 0 10px;
      width: 240px;
      height: 80px;
      color: #fff;
      &.remain {
        background-color: #cdb658;
      }
      &.wait {
        background-color: #43a6cf;
      }
      &.sended {
        background-color: #3c94e7;
      }
      i {
        // margin-right: 30px;
        font-size: 40px;
      }
      .right {
        p {
          &:first-child {
            padding-bottom: 10px;
            font-size: 16px;
            line-height: 1;
          }
          &:last-child {
            line-height: 1;
          }
        }
      }
    }
  }
}
.today-send {
  padding-left: 20px;
  height: 140px;
  border: 1px solid #e5e5e5;
  color: #333;

  .send-item {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: calc(100% - 38px);
    width: 50%;
    li {
      p {
        text-align: center;
        &:first-child {
          font-size: 24px;
          font-weight: 700;
          line-height: 1;
        }
        &:last-child {
          padding-top: 12px;
          font-size: 14px;
          line-height: 1;
        }
      }
    }
  }
}
.send-summary {
  .title {
    padding-left: 20px;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    background-color: #f5f5f5;
  }
}
</style>
