<template>
  <div class="contents">
    <div class="m-b-10 p-x-20 p-y-10 store-account" v-loading="totalLoading">
      <div class="item">
        <div class="image">
          <img :src="totalSummary.imageUrl&&DOMAIN_IMAGE + totalSummary.imageUrl" alt="">
        </div>
        <div class="store-info m-l-30">
          <p>ID：{{totalSummary.characterId}}</p>
          <p>名称：{{totalSummary.storeName}}</p>
        </div>
      </div>
      <div class="item">
        <div class="icon">
          <i class="icon-message"></i>
        </div>
        <div class="account-info m-l-30">
          <p>短信余额（条）：{{totalSummary.balance}}</p>
          <p>待发送（条）：{{totalSummary.pendingSendCount}}</p>
          <p>累计发送（条）：{{totalSummary.totalSendCount}}</p>
        </div>
      </div>
    </div>
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
        <el-select name="btnTemplateType" v-model="params.templateType" @change="getMonthlySummary">
          <el-option value="" label="全部"></el-option>
          <el-option v-for="(item, index) in TemplateTypes.Types" :key="index" :value="item.key" :label="item.title"></el-option>
        </el-select>
      </div>
      <el-date-picker name="btnMonthlySummary" v-model="params.date" @change="getMonthlySummary" :picker-options="options" type="month" placeholder="选择月" :clearable="false">
      </el-date-picker>
      <v-chart :options="line" style="width:100%"></v-chart>
    </div>
  </div>
</template>

<script>
import {
  DOMAIN_IMAGE 
} from '@/configs/appSettings'
import {
  TemplateTypes 
} from '@/enums/message'
import {
  MESSAGE_API_STOREBALANCE_GETSTOREACCOUNTSUMMARY,
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
      DOMAIN_IMAGE,
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
          data: []
        },
        yAxis: {
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
      MESSAGE_API_STOREBALANCE_GETSTOREACCOUNTSUMMARY().then(res => {
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
.store-account {
  display: flex;
  border: 1px solid #e5e5e5;
  .item {
    flex: 0.3;
    display: flex;
    align-items: center;
    .image {
      width: 64px;
      height: 64px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .icon {
      position: relative;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background-color: #3c94e7;
      .icon-message {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 40px;
        color: #fff;
      }
    }
    p {
      line-height: 2;
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
