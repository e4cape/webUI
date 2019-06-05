<template>
  <el-row class="p-10" v-loading="$store.getters.tb_loading">
    <el-row class="m-10 top-line-search">
      <el-select name="financeType" v-model="financeType" placeholder="所有类别" @change="getData">
        <el-option label="所有类别" :value="0"></el-option>
        <el-option v-for="(item,index) in financeTypes.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
      </el-select>
    </el-row>
    <el-row>
      <el-col :span="12">
        <ECharts :options="turnDataPie" autoResize></ECharts>
        <div class="p-10 tc">周转情况分布</div>
      </el-col>
      <el-col :span="12">
        <el-table :data="turnData">
          <el-table-column show-overflow-tooltip prop="EnumType" label="周转情况">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="CodeQty" label="条码数量"></el-table-column>
          <el-table-column show-overflow-tooltip prop="PerFinanceQty" label="占比">
            <template slot-scope="scope">
              <span style="margin-left: 5px">{{ scope.row.PerFinanceQty | absolutely}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="tip">
          <p><b>高周转：</b>最近销售日期距今少于半年</p>
          <p><b>低周转：</b>最近销售日期距今超过半年</p>
          <p><b> 未周转：</b>从未销售</p>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <ECharts :options="turnStatusDataPie" autoResize></ECharts>
        <div class="p-10 tc">货品状态分布</div>
      </el-col>
      <el-col :span="12">
        <el-table :data="turnStatusData">
          <el-table-column show-overflow-tooltip prop="EnumType" label="库存状态">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="CodeQty" label="条码数量"></el-table-column>
          <el-table-column show-overflow-tooltip prop="PerFinanceQty" label="占比">
            <template slot-scope="scope">
              <span style="margin-left: 5px">{{ scope.row.PerFinanceQty | absolutely}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="tip">
          <p><b>有效库存：</b>最近销售日期距今少于一年</p>
          <p><b>无效库存：</b>最近销售日期距今超过一年</p>
        </div>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
import {
  FinanceType,
} from '@/enums/stocking'
import {
  STOCKING_API_REPORT_GOODS_STOCK_ANALYSISBYBESTSELL,
} from '@/apis/stocking'
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
      financeTypes: {
      },
      financeType: 0,
      turnData: [],
      turnStatusData: [],
      turnDataPie: {
      },
      turnStatusDataPie: {
      }
    }
  },
  methods: {
    getData() {
      STOCKING_API_REPORT_GOODS_STOCK_ANALYSISBYBESTSELL({
        EnumType: 1,
        FinanceType: this.financeType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          var data1 = []
          // 情况
          this.turnData = res.data.Data.Rows || []
          this.turnData.forEach(item => {
            if (item.CodeQty > 0) {
              item.EnumType = item.EnumType || '空'
              data1.push({
                value: item.CodeQty,
                name: item.EnumType
              })
            }
          })
          this.turnDataPie = this.initPiedata(res.data.Data.CodeQty, data1)
        }
      })
      STOCKING_API_REPORT_GOODS_STOCK_ANALYSISBYBESTSELL({
        EnumType: 2,
        FinanceType: this.financeType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          var data2 = []
          // 状态
          this.turnStatusData = res.data.Data.Rows || []
          this.turnStatusData.forEach(item => {
            if (item.CodeQty > 0) {
              item.EnumType = item.EnumType || '空'
              data2.push({
                value: item.CodeQty,
                name: item.EnumType
              })
            }
          })
          this.turnStatusDataPie = this.initPiedata(res.data.Data.CodeQty, data2)
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
    }
  },
  beforeMount() {
    this.financeTypes = FinanceType
  },
  mounted() {
    this.getData()
  },
  filters: {
    absolutely (value) {
      return (value / 100).toFixed(2) + '%'
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
.tip {
  font-size: 14px;
  p {
    padding-top: 10px;
    b {
      font-weight: 700;
    }
  }
}
</style>
