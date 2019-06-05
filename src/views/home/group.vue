<template>
  <div class="content">
    <el-row :gutter="10">
      <el-col :span="24">
        <div class="panel home-init">
          <div class="panel-hd">
            <span class="title">集团概况</span>
          </div>
          <div class="panel-bd">
            <div class="sale-data pd-between">
              <el-row :gutter="10">
                <el-col>
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <div class="sale_list">
                        <div class="number">{{groupInfo.CompanyCount}}</div>
                        <div class="saleName">商户总数</div>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="sale_list">
                        <div class="number">{{groupInfo.StoreCount}}</div>
                        <div class="saleName">门店总数</div>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div class="panel home-init">
          <div class="panel-hd">
            <span class="title">销售概况</span>
          </div>
          <div class="panel-bd">
            <div class="sale-data pd-between">
              <el-row :gutter="10">
                <el-col style="width: calc(100%);">
                  <el-row :gutter="10">
                    <el-col :span="6">
                      <div class="sale_number">
                        <div class="number">{{summary.SaleNum || 0}}</div>
                        <div class="saleName">销量</div>
                        <div class="sale-footer">
                          <span>销售&nbsp;{{summary.SaleTotalNum || 0}}</span>
                          <span class="vertical">|</span>
                          <span>退货&nbsp;{{summary.ReturnNum || 0}}</span>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="sale_room">
                        <div class="number">{{ $root.toFloat(summary.SaleGoldWeight, 3) || 0 }}g</div>
                        <div class="saleName">销售金重</div>
                        <div class="sale-footer">
                          <span>销售&nbsp;{{ $root.toFloat(summary.GoldWeightNum, 3) || 0 }}g</span>
                          <span class="vertical">|</span>
                          <span>退货&nbsp;{{ $root.toFloat(summary.ReturnGoldWeight, 3) || 0 }}g</span>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="sale_pink">
                        <div class="number">￥{{$root.toFloat(summary.SalePrice) || 0}}</div>
                        <div class="saleName">销售额（应付）</div>
                        <div class="sale-footer">
                          <span>销售&nbsp;￥{{$root.toFloat(summary.SaleTotalPrice) || 0}}</span>
                          <span class="vertical">|</span>
                          <span>退货&nbsp;￥{{$root.toFloat(summary.ReturnPrice) || 0}}</span>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="sale_list">
                        <div class="number">￥{{$root.toFloat(summary.SaleCashPrice) || 0}}</div>
                        <div class="saleName">销售额（实付）</div>
                        <div class="sale-footer">
                          <span>销售&nbsp;￥{{$root.toFloat(summary.SaleTotalCashPrice) || 0}}</span>
                          <span class="vertical">|</span>
                          <span>退货&nbsp;￥{{$root.toFloat(summary.ReturnCashPrice) || 0}}</span>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div class="panel home-init">
          <div class="panel-hd">
            <span class="title">昨日新增</span>
          </div>
          <div class="panel-bd">
            <div class="sale-data pd-between">
              <el-row :gutter="10">
                <el-col style="width: calc(100%);">
                  <el-row :gutter="10">
                    <el-col :span="6">
                      <div class="sale_number">
                        <div class="number">{{summary.TSaleNum}}</div>
                        <div class="saleName">销量</div>
                        <div class="sale-footer">
                          <span>销售&nbsp;{{summary.TSaleTotalNum}}</span>
                          <span class="vertical">|</span>
                          <span>退货&nbsp;{{summary.TReturnNum}}</span>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="sale_room">
                        <div class="number">{{$root.toFloat(summary.TSaleGoldWeight, 3)}}g</div>
                        <div class="saleName">销售金重</div>
                        <div class="sale-footer">
                          <span>销售&nbsp;{{ $root.toFloat(summary.TGoldWeightNum, 3) }}g</span>
                          <span class="vertical">|</span>
                          <span>退货&nbsp;{{ $root.toFloat(summary.TReturnGoldWeight, 3) }}g</span>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="sale_pink">
                        <div class="number">￥{{$root.toFloat(summary.TSalePrice)}}</div>
                        <div class="saleName">应付金额</div>
                        <div class="sale-footer">
                          <span>销售&nbsp;￥{{$root.toFloat(summary.TSaleTotalPrice)}}</span>
                          <span class="vertical">|</span>
                          <span>退货&nbsp;￥{{$root.toFloat(summary.TReturnPrice)}}</span>
                        </div>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <div class="sale_list">
                        <div class="number">￥{{$root.toFloat(summary.TSaleCashPrice)}}</div>
                        <div class="saleName">销售额（实付）</div>
                        <div class="sale-footer">
                          <span>销售&nbsp;￥{{$root.toFloat(summary.TSaleTotalCashPrice)}}</span>
                          <span class="vertical">|</span>
                          <span>退货&nbsp;￥{{$root.toFloat(summary.TReturnCashPrice)}}</span>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div class="panel home-init">
          <div class="panel-hd">
            <span class="title">近30天零售情况</span>
          </div>
          <div class="panel-bd">
            <el-row class="p-10">
              <div class="tr">
                <el-radio-group v-model="selectType">
                  <!-- <el-radio-button label="粉丝"></el-radio-button>
                  <el-radio-button label="会员"></el-radio-button>-->
                  <el-radio-button label="销量"></el-radio-button>
                  <el-radio-button label="销售金重"></el-radio-button>
                  <el-radio-button label="销售额(应付)"></el-radio-button>
                  <el-radio-button label="销售额(实付)"></el-radio-button>
                </el-radio-group>
              </div>
              <div class="home-chart" v-loading="canvasLoading">
                <ECharts :options="chartDatas" autoResize></ECharts>
              </div>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { SaleType } from '@/enums/spread.js'
import { MERCHANT_API_STORE_BASIC_HOME } from '@/apis/merchant.js'
import {
  ORDER_API_RETAIL_ORDER_MASTER_SUMMAYBYPERSALE,
  ORDER_API_RETAIL_ORDER_MASTER_SUMMAYSALEBOARD
} from '@/apis/order.js'

import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legendScroll'

export default {
  components: {
    ECharts
  },
  data() {
    return {
      saleTypes: SaleType,
      groupInfo: {},
      chartDatas: {},
      saletype: true,
      rankings: [],
      selectType: '销量',
      summary: {},
      canvasLoading: false,
      HOME_CHART: {
        color: ['#e66969', '#a1a1a1', '#54aae5', '#e5323e'],
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['销售', '退货', '实销'],
          bottom: '5%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '13%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '销售',
            type: 'bar',
            barWidth: '10%',
            data: []
          },
          {
            name: '退货',
            type: 'bar',
            barWidth: '10%',
            data: []
          },
          {
            name: '实销',
            type: 'bar',
            barWidth: '10%',
            data: []
          }
        ]
      }
    }
  },
  methods: {
    getGroupInfo() {
      MERCHANT_API_STORE_BASIC_HOME().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.groupInfo = res.data.Data
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getSaleBySummary() {
      this.canvasLoading = true
      ORDER_API_RETAIL_ORDER_MASTER_SUMMAYBYPERSALE()
        .then(res => {
          this.canvasLoading = false
          if (res.data.Code === 'CORRECT') {
            this.summary = res.data.Data
          }
        })
        .catch(() => {
          this.canvasLoading = false
        })
    },
    initOptions(data, type) {
      let options = this.HOME_CHART
      let xAxis = []
      let dateArr = []
      let seriesData = [[], [], []]
      let dates = {}
      let dates1 = {} // 销售额分两条统计线
      let dates2 = {} // 销售额分两条统计线
      let start = Date.parse(this.timeSituation[0])
      let end = Date.parse(this.timeSituation[1])

      for (let d = start; d <= end; d += 24 * 60 * 60 * 1000) {
        dateArr.push(new Date(d + 1000 * 60 * 60 * 8).toJSON().split('T')[0])
        dates[new Date(d + 1000 * 60 * 60 * 8).toJSON().split('T')[0]] = 0
        dates1[new Date(d + 1000 * 60 * 60 * 8).toJSON().split('T')[0]] = 0
        dates2[new Date(d + 1000 * 60 * 60 * 8).toJSON().split('T')[0]] = 0
      }

      switch (type) {
        case 1:
          data.forEach(res => {
            dates[res.OrderTime] = res.SaleTotalNum
            dates1[res.OrderTime] = res.ReturnNum
            dates2[res.OrderTime] = res.SaleNum
          })
          break
        case 2:
          data.forEach(res => {
            dates[res.OrderTime] = this.$root.toFloat(res.GoldWeightNum, 3)
            dates1[res.OrderTime] = this.$root.toFloat(res.ReturnGoldWeight, 3)
            dates2[res.OrderTime] = this.$root.toFloat(res.SaleGoldWeight, 3)
          })
          break
        case 3:
          data.forEach(res => {
            dates[res.OrderTime] = this.$root.toFloat(res.SaleTotalPrice)
            dates1[res.OrderTime] = this.$root.toFloat(res.ReturnPrice)
            dates2[res.OrderTime] = this.$root.toFloat(res.SalePrice)
          })
          break
        case 4:
          data.forEach(res => {
            dates[res.OrderTime] = this.$root.toFloat(res.SaleTotalCashPrice)
            dates1[res.OrderTime] = this.$root.toFloat(res.ReturnCashPrice)
            dates2[res.OrderTime] = this.$root.toFloat(res.SaleCashPrice)
          })
          break
        default:
          break
      }

      dateArr.forEach(item => {
        xAxis.push(item.substr(5))
        seriesData[0].push(dates[item])
        seriesData[1].push(dates1[item])
        seriesData[2].push(dates2[item])
      })
      console.log(seriesData)
      options.xAxis.data = xAxis
      options.series[0].data = seriesData[0]
      options.series[1].data = seriesData[1]
      options.series[2].data = seriesData[2]
      this.chartDatas = options
    },
    getSaleNum(type) {
      let date = new Date()
      this.timeSituation = [
        new Date(date - 29 * 24 * 60 * 60 * 1000),
        new Date(date)
      ]
      ORDER_API_RETAIL_ORDER_MASTER_SUMMAYSALEBOARD()
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.initOptions(res.data.Data, type)
          } else {
            this.$message.error(res.data.Message)
          }
          this.canvasLoading = false
        })
        .catch(() => {
          this.canvasLoading = false
        })
    },
  },
  mounted() {
    this.getGroupInfo()
    this.getSaleBySummary()
    this.getSaleNum(1)
  },
  watch: {
    selectType() {
      switch (this.selectType) {
        case '销量':
          this.getSaleNum(1)
          break
        case '销售金重':
          this.getSaleNum(2)
          break
        case '销售额(应付)':
          this.getSaleNum(3)
          break
        case '销售额(实付)':
          this.getSaleNum(4)
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.panel {
  margin-bottom: 10px;
}
.pd-between {
  margin: 0;
}
.home-chart {
  width: 100%;
  .echarts {
    width: 100%;
  }
}
.init-panel {
  min-width: 220px;
}
.rankings {
  text-align: left;
  margin: 0;
  padding-bottom: 10px;
  li {
    font-size: 12px;
    padding: 2px 8px;
    vertical-align: middle;
    .number {
      display: inline-block;
      width: 25px;
      height: 25px;
      line-height: 25px;
      font-style: normal;
      text-align: center;
      background-color: #0094ff;
      border-radius: 4px;
      color: #fff;
      vertical-align: middle;
    }
    span {
      display: inline-block;
      width: calc(100% - 40px);
      margin-left: 5px;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      overflow: hidden;
      vertical-align: middle;
    }
  }
}

/* @module 表格选择数据样式 */
.sale-data {
  .vertical {
    position: relative;
    top: -1px;
    margin: 0 2px;
  }

  .el-row {
    padding: 5px 0;
    border: none;

    .el-col {
      // height: 96px;
      overflow: hidden;

      .sale_room,
      .sale_list,
      .sale_number,
      .init-today,
      .sale_storeAll,
      .sale_pink {
        text-align: center;
        padding: 16px 0;
      }

      & > div {
        border-radius: 2px;
        color: #fff;
        font-size: 12px;
        .number {
          font-size: 16px;
          height: 16px;
          line-height: 18px;
          font-weight: 700;
        }
      }

      .sale_storeAll {
        background-color: #6e869e;
      }
      .sale_list {
        background-color: #54aae5;
      }

      .sale_number {
        background-color: #d8b529;
      }

      .sale_room {
        background-color: #e66969;
      }

      .sale_pink {
        background-color: #b6607f;
      }
    }
  }
}

.home-init {
  border: none;
  margin-bottom: 0px;
  .panel-hd {
    border-top: 1px solid #e5e5e5;
    height: 32px;
    padding: 0;
    .title {
      font-size: 12px;
      font-weight: 900;
      line-height: 32px;
      color: #777;
    }
  }
}
.saleName {
  line-height: 22px;
  height: 22px;
}
/* End 选择数据样式*/
</style>
