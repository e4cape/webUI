<template>
  <el-row class="p-10" v-loading="$store.getters.tb_loading">
    <el-form :model="queryForm" label-width="90px" ref="queryForm" :inline="true" class="item-lh-26 p10">
      <el-row class="m-10 top-line-search">
        <el-form-item label="销量统计范围：" prop="createTime">
          <el-date-picker name="createTime" v-model="queryForm.createTime" @change="onSearch" :unlink-panels="true" value-format="yyyy-MM-dd" type="daterange" :picker-options="$root.datePickerOptions" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
      </el-row>
    </el-form>
    <rational-table title="金重分析" :isShow="true" :saleDataPie="turnDataPie" :inventorDataPie="turnDataPie" :settingTagTypes="SettingTagTypes.ReportFigureExpend" :tableData="turnData"></rational-table>
    <rational-table title="主石重分析" :isShow="false" :saleDataPie="turnStatusDataPie" :inventorDataPie="turnStatusDataPie" :settingTagTypes="SettingTagTypes.ReportFigureScore" :tableData="turnStatusData"></rational-table>
    <rational-table title="主石颜色分析" :isShow="false" :saleDataPie="turnStatusDataPie" :inventorDataPie="turnStatusDataPie" :settingTagTypes="SettingTagTypes.ReportFigureScore" :tableData="turnStatusData"></rational-table>
    <rational-table title="主石净度分析" :isShow="false" :saleDataPie="turnStatusDataPie" :inventorDataPie="turnStatusDataPie" :settingTagTypes="SettingTagTypes.ReportFigureScore" :tableData="turnStatusData"></rational-table>
    <rational-table title="标签价分析" :isShow="true" :saleDataPie="turnStatusDataPie" :inventorDataPie="turnStatusDataPie" :settingTagTypes="SettingTagTypes.ReportFigureScore" :tableData="turnStatusData"></rational-table>
  </el-row>
</template>

<script>
let date = new Date()

import {
  FinanceType 
} from '@/enums/merchant'
import {
  SettingTagTypes 
} from '@/enums/membership'
import {
  STOCKING_API_REPORT_STOCKTURNOVERANYSIS
} from '@/apis/stocking'
import rationalTable from './rationalTable.vue'
import {
  pie 
} from '@/datas/echart/pie'

export default {
  data() {
    return {
      SettingTagTypes,
      financeTypes: {
      },
      financeType: '0',
      turnData: [],
      turnStatusData: [],
      turnDataPie: {
      },
      turnStatusDataPie: {
      },
      queryForm: {
        createTime: [
          new Date(Date.parse(date) - 30 * 24 * 60 * 60 * 1000),
          new Date(date)
        ],
      },
    }
  },
  methods: {
    getData() {
      STOCKING_API_REPORT_STOCKTURNOVERANYSIS({
        financeType: this.financeType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          var data1 = []
          var data2 = []
          // 情况
          this.turnData = res.data.Data.StockTurnType
          this.turnData.forEach(item => {
            if (item.Quantity > 0) {
              item.StockTurnType = item.StockTurnType || '空'
              data1.push({
                value: item.Quantity,
                name: item.StockTurnType
              })
            }
          })
          this.turnDataPie = this.initPiedata(res.data.Data.SumTypeCode, data1)
          // 状态
          this.turnStatusData = res.data.Data.StockTurnStatus
          this.turnStatusData.forEach(item => {
            if (item.Quantity > 0) {
              item.StockTurnStatus = item.StockTurnStatus || '空'
              data2.push({
                value: item.Quantity,
                name: item.StockTurnStatus
              })
            }
          })
          this.turnStatusDataPie = this.initPiedata(
            res.data.Data.SumStatusCode,
            data2
          )
        }
      })
    },
    initPiedata(total, data) {
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
        pieData.title.text = '条码总数'
        pieData.title.subtext = total
        pieData.series[0].data = data
      }
      return pieData
    },
    onSearch () {

    },
  },
  beforeMount() {
    this.financeTypes = FinanceType
  },
  mounted() {
    this.getData()
  },
  filters: {
    absolutely (value) {
      return (value * 100).toFixed(2) + '%'
    }
  },
  components: {
    rationalTable,
  }
}
</script>
