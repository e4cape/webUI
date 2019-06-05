<template>
  <el-row>
    <div class="m-10 top-line-search">
      <el-cascader :options="locationData" change-on-select name="characterId" v-model="characterId" @change="queryChange" :props="props"></el-cascader>
      <el-select name="financeType" v-model="financeType" placeholder="所有类别" @change="queryChange">
        <el-option label="所有类别" :value="0"></el-option>
        <el-option v-for="(item,index) in financeTypes.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
      </el-select>
      <el-date-picker name="dateTime" v-model="dateTime" :clearable="false" @change="queryChange" value-format="yyyy-MM-dd" :unlink-panels="true" type="daterange" placeholder="选择时间范围" :picker-options="$root.datePickerOptions"></el-date-picker>
    </div>
    <el-row :gutter="20" class="total-panel">
      <el-col :span="6">
        <div class="total qty">
          <div class="number">￥{{$root.toFloat(summary.Price)}}</div>
          <div class="name">应付金额</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="total price">
          <div class="number">￥{{$root.toFloat(summary.CostPrice)}}</div>
          <div class="name">成本金额</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="total weight">
          <div class="number">￥{{$root.toFloat(summary.ProfitPrice)}}</div>
          <div class="name">毛利</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="total cashier">
          <div class="number">{{(summary.RateProfit / 100).toFixed(2)}}%</div>
          <div class="name">毛利率</div>
        </div>
      </el-col>
    </el-row>
    <div class="panel-tag m-10">
      <span>毛利趋势</span>
    </div>
    <el-row class="m-20">
      <el-radio-group name="profitType" v-model="profitType">
        <el-radio-button :label="1" name="1">毛利</el-radio-button>
        <el-radio-button :label="2" name="2">毛利率</el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row class="chart" v-loading="canvasLoading">
      <ECharts :options="options" autoResize></ECharts>
    </el-row>
  </el-row>
</template>

<script>
import {
  CharacterType
} from '@/enums/common'
import {
  FinanceType,
  StockPositionTypeType,
} from '@/enums/stocking'
import {
  STOCKING_API_REPORT_SALE_ANALYSISBYSALEBOARD2,
} from '@/apis/stocking'
import {
  RetailOrderSellProductSourceType
} from '@/enums/order'
import {
  profitBar 
} from '@/datas/echart/bar'
import dayjs from 'dayjs'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legendScroll'
export default {
  data() {
    return {
      characterTypes: {
      },
      characterId: [0],
      financeTypes: {
      },
      financeType: 0,
      profitType: 1,
      dateTime: '',
      summary: {
      },
      canvasLoading: false,
      options: {
      },
      props: {
        value: 'Id',
        label: 'Value',
        children: 'Childrens'
      },
    }
  },
  props: {
    locationData: {
      type: Array
    }
  },
  methods: {
    // 毛利概况
    getGrossProfit(parameter) {
      // 利润概括
      this.canvasLoading = true
      STOCKING_API_REPORT_SALE_ANALYSISBYSALEBOARD2(parameter).then(res => {
        this.canvasLoading = false
        if (res.data.Code === 'CORRECT') {
          this.summary = res.data.Data
          // this.summary.RateProfit = this.summary.Price === 0 ? 0 : (this.summary.ProfitPrice / this.summary.Price * 100).toFixed(2)
          this.initOptions(res.data.Data.Rows || [])
        }
      }).catch(() => {
        this.canvasLoading = false
      })
    },
    initOptions(data) {
      let options = JSON.parse(JSON.stringify(profitBar))
      let xAxis = []
      let seriesData = []
      let dateArr = []
      let dates = {
      }
      let dates1 = {
      } // 销售额分两条统计线
      let start = Date.parse(this.dateTime[0])
      let end = Date.parse(this.dateTime[1])
      for (let d = start; d <= end; d += 24 * 60 * 60 * 1000) {
        dateArr.push(new Date(d + 1000 * 60 * 60 * 8).toJSON().split('T')[0])
        dates[new Date(d + 1000 * 60 * 60 * 8).toJSON().split('T')[0]] = 0
        dates1[new Date(d + 1000 * 60 * 60 * 8).toJSON().split('T')[0]] = 0
      }
      data.forEach(res => {
        switch (this.profitType) {
          case 1:
            dates[res.EnumTypeName] = this.$root.toFloat(res.ProfitPrice)
            break
          case 2:
            dates[res.EnumTypeName] = (res.RateProfit / 100).toFixed(2)
            break
          default:
            break
        }
      })

      console.log(dates)
      dateArr.forEach((item) => {
        xAxis.push(item.substr(5))
        seriesData.push(dates[item])
      })
      options.xAxis.data = xAxis
      options.series[0].data = seriesData
      options.series[0].name = this.profitType === 1 ? '毛利趋势' : '毛利率趋势'
      options.legend.data =
        this.profitType === 1 ? ['毛利趋势'] : ['毛利率趋势']
      if (this.profitType === 2) {
        options.tooltip = {
          trigger: 'axis',
          formatter: '{a} <br/>{b}: {c} %'
        }
      }
      this.options = options
    },
    queryChange() {
      let parameter = {
        EnumType: 5,
        FinanceType: this.financeType,
        BeginTime: this.dateTime[0],
        EndTime: this.dateTime[1],
        CompchterId: 0,
        StorechterId: 0,
        ClassifyId: -1,
        DeskId: 0,
        SourceType: RetailOrderSellProductSourceType.Stocking
      }
      switch (this.characterId[0]) {
        case StockPositionTypeType.All:
          parameter.CompchterId = 0
          parameter.StorechterId = 0
          parameter.ClassifyId = -1
          parameter.DeskId = 0
          break
        case StockPositionTypeType.Store:
          parameter.StorechterId = this.characterId[1] ? this.characterId[1] : 0
          parameter.CompchterId = 0
          parameter.ClassifyId = -1
          parameter.DeskId = 0
          break
        case StockPositionTypeType.UnGroupTypeDk:
          parameter.ClassifyId = 0
          parameter.DeskId = this.characterId[1] ? this.characterId[1] : 0
          parameter.CompchterId = 0
          parameter.StorechterId = 0
          break
        default:
          if (this.$store.getters.user_session.CharacterType == CharacterType.Group) {
            parameter.CompchterId = this.characterId[0] ? this.characterId[0] : 0
            parameter.StorechterId = this.characterId[1] ? this.characterId[1] : 0
            parameter.ClassifyId = -1
            parameter.DeskId = 0
          } else if (this.$store.getters.user_session.CharacterType == CharacterType.Company) {
            parameter.CompchterId = 0
            parameter.StorechterId = this.characterId[0] ? this.characterId[0] : 0
            parameter.ClassifyId = -1
            parameter.DeskId = 0
          } else {
            parameter.CompchterId = 0
            parameter.StorechterId = 0
            parameter.ClassifyId = this.characterId[0] ? this.characterId[0] : -1
            parameter.DeskId = this.characterId[1] ? this.characterId[1] : 0
          }
          break
      }
      this.getGrossProfit(parameter)
    }
  },
  beforeMount() {
    this.characterTypes = CharacterType
    this.financeTypes = FinanceType
    var date = new Date()
    this.dateTime = [
      dayjs(new Date(Date.parse(date) - 6 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD'),
      dayjs(date).format('YYYY-MM-DD')
    ] // 明细的时间
  },
  mounted() {
    this.queryChange()
  },
  watch: {
    profitType() {
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
