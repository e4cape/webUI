<template>
  <el-row>
    <div class="m-10 top-line-search">
      <el-select name="TerminalType" v-model="terminalType" placeholder="所有销售来源" @change="queryChange">
        <el-option label="所有销售来源" :value="0"></el-option>
        <el-option v-for="item in terminalTypes.TypeArray" :key="item.KeyId" :label="item.Value" :value="parseInt(item.KeyId)"></el-option>
      </el-select>
      <el-select name="SourceType" v-model="sourceType" placeholder="所有货品来源" @change="queryChange">
        <el-option label="所有货品来源" :value="0"></el-option>
        <el-option v-for="item in retailOrderSellProductSourceTypes.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId"></el-option>
      </el-select>
      <el-date-picker name="time" v-model="time" @change="queryChange" type="daterange" :clearable="false" :unlink-panels="true" value-format="yyyy-MM-dd" placeholder="选择日期范围" :picker-options="$root.datePickerOptions"></el-date-picker>
      <el-button name="btnprintCurrentPage" type="primary" size="mini" @click="printCurrentPage">打印</el-button>
    </div>
    <div id="printId">
      <el-row :gutter="20" class="total-panel">
        <el-col :span="6">
          <div class="total qty">
            <div class="number">{{summary.Quantity || 0}}</div>
            <div class="name">销量</div>
            <div class="more">
              <span>销售&nbsp;{{summary.SaleQty || 0}}</span>
              <span class="line">|</span>
              <span>退货&nbsp;{{summary.ReturnQty || 0}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total weight">
            <div class="number">{{$root.toFloat(summary.GoldWeight, 3) || 0}}g</div>
            <div class="name">销售金重</div>
            <div class="more">
              <span>销售&nbsp;{{$root.toFloat(summary.SaleGoldWeight, 3) || 0}}g</span>
              <span class="line">|</span>
              <span>退货&nbsp;{{$root.toFloat(summary.ReturnGoldWeight, 3) || 0}}g</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total price">
            <div class="number">￥{{$root.toFloat(summary.Price) || 0}}</div>
            <div class="name">销售额（应付）</div>
            <div class="more">
              <span>销售&nbsp;￥{{$root.toFloat(summary.SalePrice) || 0}}</span>
              <span class="line">|</span>
              <span>退货&nbsp;￥{{$root.toFloat(summary.ReturnPrice) || 0}}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total cashier">
            <div class="number">￥{{$root.toFloat(summary.CashPrice) || 0}}</div>
            <div class="name">销售额（实付）</div>
            <div class="more">
              <span>销售&nbsp;￥{{$root.toFloat(summary.SaleCashPrice) || 0}}</span>
              <span class="line">|</span>
              <span>退货&nbsp;￥{{$root.toFloat(summary.ReturnCashPrice) || 0}}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="panel-tag m-10">
      <span>销售趋势</span>
    </div>
    <el-row class="m-20">
      <el-radio-group name="saleType" v-model="saleType">
        <el-radio-button :label="1" name="1">按销售量</el-radio-button>
        <el-radio-button :label="2" name="2">按销售额(应付)</el-radio-button>
        <el-radio-button :label="3" name="3">按销售额(实付)</el-radio-button>
        <el-radio-button :label="4" name="4">按销售金重</el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row id="printChart" class="chart" v-loading="canvasLoading">
      <ECharts :options="options" autoResize></ECharts>
    </el-row>
  </el-row>
</template>

<script>
import {
  CharacterType,
  TerminalType,
} from '@/enums/common'
import {
  RetailOrderSellProductSourceType,
} from '@/enums/order'
import {
  STOCKING_API_REPORT_SALE_ANALYSISBYSALEBOARD5,
} from '@/apis/stocking'
import dayjs from 'dayjs'
import {
  saleBar 
} from '@/datas/echart/bar'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legendScroll'
export default {
  data() {
    return {
      canvasLoading: false,
      characterTypes: {
      },
      retailOrderSellProductSourceTypes: {
      },
      terminalTypes: {
      },
      characterId: '',
      terminalType: 0,
      sourceType: 0,
      saleType: 1,
      time: '',
      summary: {
      }, // 合计
      options: {
      } // echart的参数
    }
  },
  methods: {
    // 合计
    getSaleBySummary(parameter) {
      this.canvasLoading = true
      STOCKING_API_REPORT_SALE_ANALYSISBYSALEBOARD5(parameter).then(res => {
        this.canvasLoading = false
        if (res.data.Code === 'CORRECT') {
          this.summary = res.data.Data
          this.initOptions(res.data.Data.Rows || [])
        }
      }).catch(() => {
        this.canvasLoading = false
      })
    },
    initOptions(data) {
      let options = JSON.parse(JSON.stringify(saleBar))
      let xAxis = []
      let dateArr = []
      let seriesData = [[], [], []]
      let dates = {
      }
      let dates1 = {
      } // 销售额分两条统计线
      let dates2 = {
      } // 实销
      let start = Date.parse(this.time[0])
      let end = Date.parse(this.time[1])
      for (let d = start; d <= end; d += 24 * 60 * 60 * 1000) {
        dateArr.push(new Date(d + 1000 * 60 * 60 * 8).toJSON().split('T')[0])
        dates[new Date(d + 1000 * 60 * 60 * 8).toJSON().split('T')[0]] = 0
        dates1[new Date(d + 1000 * 60 * 60 * 8).toJSON().split('T')[0]] = 0
        dates2[new Date(d + 1000 * 60 * 60 * 8).toJSON().split('T')[0]] = 0
      }
      data.forEach(res => {
        this.summary.SaleQty = (this.summary.SaleQty || 0) + res.SaleQty
        this.summary.ReturnQty = (this.summary.ReturnQty || 0) + res.ReturnQty
        this.summary.SaleGoldWeight = (this.summary.SaleGoldWeight || 0) + res.SaleGoldWeight
        this.summary.ReturnGoldWeight = (this.summary.ReturnGoldWeight || 0) + res.ReturnGoldWeight
        this.summary.SalePrice = (this.summary.SalePrice || 0) + res.SalePrice
        this.summary.ReturnPrice = (this.summary.ReturnPrice || 0) + res.ReturnPrice
        this.summary.SaleCashPrice = (this.summary.SaleCashPrice || 0) + res.SaleCashPrice
        this.summary.ReturnCashPrice = (this.summary.ReturnCashPrice || 0) + res.ReturnCashPrice
        switch (this.saleType) {
          case 1:
            dates[res.EnumTypeName] = res.SaleQty
            dates1[res.EnumTypeName] = res.ReturnQty
            dates2[res.EnumTypeName] = res.Quantity
            break
          case 2:
            dates[res.EnumTypeName] = this.$root.toFloat(res.SalePrice)
            dates1[res.EnumTypeName] = this.$root.toFloat(res.ReturnPrice)
            dates2[res.EnumTypeName] = this.$root.toFloat(res.Price)
            break
          case 3:
            dates[res.EnumTypeName] = this.$root.toFloat(res.SaleCashPrice)
            dates1[res.EnumTypeName] = this.$root.toFloat(res.ReturnCashPrice)
            dates2[res.EnumTypeName] = this.$root.toFloat(res.CashPrice)
            break
          case 4:
            dates[res.EnumTypeName] = this.$root.toFloat(res.SaleGoldWeight, 3)
            dates1[res.EnumTypeName] = this.$root.toFloat(res.ReturnGoldWeight, 3)
            dates2[res.EnumTypeName] = this.$root.toFloat(res.GoldWeight, 3)
            break
          default:
            break
        }
      })
      dateArr.forEach((item) => {
        xAxis.push(item.substr(5))
        seriesData[0].push(dates[item])
        seriesData[1].push(dates1[item])
        seriesData[2].push(dates2[item])
      })
      
      options.xAxis.data = xAxis
      options.series[0].data = seriesData[0]
      options.series[1].data = seriesData[1]
      options.series[2].data = seriesData[2]
      this.options = options
    },
    queryChange() {
      let parameter = {
        BeginTime: this.time[0] || '1900-01-01',
        EndTime	: this.time[1] || '1900-01-01',
        SourceType: this.sourceType,
        TerminalType: this.terminalType,
        ClassifyId: -1,
      }
      this.getSaleBySummary({...parameter, EnumType: 5})
    },
    async printCurrentPage() {
      let url = await document.getElementsByTagName('canvas')[0].toDataURL('image/png')
      let date = new Date()
      var headstr = `<html><head><title></title></head>
        <style type="text/css">
        body{
          overflow: auto;
        }
        .total-panel{
          width: 1055px;
          margin: 10px 0;
          padding: 0 !important;
          margin-left: 0px !important;
        }
        .total-panel .total, .sale-tag {
          border: 1px solid #000;
          color: #000;
        }
        .total-panel .total div , .sale-tag span{
          color: #000;
        }
        .el-table{
          border-bottom: 1px solid #ededed;
          width: 100% !important;
        }
        .twoDaysData {
          width: 1065px;
          margin: 0 !important;
        }
        .twoDaysData .el-col {
          display: block;
          width: 100%;
          padding: 0 !important;
        }
        .el-table__empty-block {
          width: 100% !important;
          text-align: center;
        }
        table {
          width: 100% !important;
        }
        .print-title{
          width: 1065px;
          padding: 20px 0;
          font-size: 16px;
          text-align:center;
        }
        .print-echarts {
          width:1045px;
          margin: 0;
        }
        .print-echarts img {
          width: 100%;
        }
        </style>
        <body>
        <div style="width:1045px; margin: 0;">
          <div style="padding-top: 15px; line-height: 28px; font-size: 18px; text-align:center;">销售趋势</div>
          <div style="font-size: 12px; text-align: center;">销售日期：${new Date(this.time[0]).getFullYear()}年${new Date(this.time[0]).getMonth() +
          1}月${new Date(this.time[0]).getDate()}日 至 ${new Date(this.time[1]).getFullYear()}年${new Date(this.time[1]).getMonth() +
          1}月${new Date(this.time[1]).getDate()}日</div>
          <div style="font-size: 12px; line-height: 24px; text-align:right;">
            打印日期：${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日
          </div>
        </div>
      `
      var footstr = '</body>'
      var printData = document.getElementById('printId').innerHTML
      document.body.innerHTML =
        headstr +
        printData
          .replace(/<colgroup>.*?<\/colgroup>/g, '') +
        `<div class="print-echarts"><image src="${url}"></image></div>` +
        footstr
      setTimeout(() => {
        window.print()
        window.location.reload()
      }, 500)
      
    }
  },
  beforeMount() {
    this.retailOrderSellProductSourceTypes = RetailOrderSellProductSourceType
    this.terminalTypes = TerminalType
    this.characterTypes = CharacterType
    var date = new Date()
    date =
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    this.time = [
      dayjs(new Date(Date.parse(date) - 6 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD'),
      dayjs(date).format('YYYY-MM-DD')
    ] // 统计的时间
  },
  mounted() {
    this.queryChange()
  },
  watch: {
    saleType() {
      this.queryChange()
    }
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

