<template>
  <el-row class="p-10">
    <div class="m-10 top-line-search">
      <el-cascader :options="locationData" change-on-select name="characterId" v-model="characterId" @change="queryChange" :props="props"></el-cascader>
      <el-select name="financeType" v-model="financeType" placeholder="所有类别" @change="queryChange">
        <el-option label="所有类别" :value="0"></el-option>
        <el-option v-for="(item,index) in financeTypes.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
      </el-select>
      <el-date-picker name="dateTime" v-model="dateTime" :clearable="false" @change="queryChange" :unlink-panels="true" value-format="yyyy-MM-dd" type="daterange" placeholder="选择日期范围" :picker-options="$root.datePickerOptions"></el-date-picker>
    </div>
    <el-row :gutter="20">
      <el-col :span="8">
        <p class="m-10 tc">毛利率（按材质）</p>
        <div class="noData" v-if="!barMaterial.yAxis || !barMaterial.yAxis.data.length">暂 无 数 据</div>
        <ECharts v-else :options="barMaterial" ref="barRateMaterial" :style="'height:'+ barMaterial.yAxis.data.length * 60 +'px'" autoResize></ECharts>
      </el-col>
      <el-col :span="8">
        <p class="m-10 tc">毛利率（按品类）</p>
        <div class="noData" v-if="!barCategory.yAxis || !barCategory.yAxis.data.length">暂 无 数 据</div>
        <ECharts v-else :options="barCategory" ref="barRateCategory" :style="'height:'+ barCategory.yAxis.data.length * 60 +'px'" autoResize></ECharts>
      </el-col>
      <el-col :span="8">
        <p class="m-10 tc">毛利率（按成色）</p>
        <div class="noData" v-if="!barGlod.yAxis || !barGlod.yAxis.data.length">暂 无 数 据</div>
        <ECharts v-else :options="barGlod" ref="barRateGold" :style="'height:'+ barGlod.yAxis.data.length * 60 +'px'" autoResize></ECharts>
      </el-col>
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
  STOCKING_API_REPORT_SALE_ANALYSISBYSALEBOARD3
} from '@/apis/stocking'
import {
  RetailOrderSellProductSourceType
} from '@/enums/order'
import dayjs from 'dayjs'
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import {
  profitRate 
} from '@/datas/echart/bar'

export default {
  components: {
    ECharts
  },
  data() {
    return {
      dateTime: '',
      characterTypes: {
      },
      characterId: [0],
      financeTypes: {
      },
      financeType: 0,
      barMaterial: {
      },
      barCategory: {
      },
      barGlod: {
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
    getMaterialData(parameter) {
      STOCKING_API_REPORT_SALE_ANALYSISBYSALEBOARD3(parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.barMaterial = this.initPiedata(res.data.Data.Rows || [], 1)
          setTimeout(() => {
            this.$refs['barRateMaterial'] &&
              this.$refs['barRateMaterial'].resize()
          }, 300)
        }
      })
    },

    getCategoryData(parameter) {
      STOCKING_API_REPORT_SALE_ANALYSISBYSALEBOARD3(parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.barCategory = this.initPiedata(res.data.Data.Rows || [], 2)
          setTimeout(() => {
            this.$refs['barRateCategory'] &&
              this.$refs['barRateCategory'].resize()
          }, 300)
        }
      })
    },

    getGoldData(parameter) {
      STOCKING_API_REPORT_SALE_ANALYSISBYSALEBOARD3(parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.barGlod = this.initPiedata(res.data.Data.Rows || [], 3)
          setTimeout(() => {
            this.$refs['barRateGold'] && this.$refs['barRateGold'].resize()
          }, 300)
        }
      })
    },
    // 渲染图表
    initPiedata(data, type) {
      // 柱状图
      let options = JSON.parse(JSON.stringify(profitRate))
      if (!data.length) {
        return options
      }
      var colors = [
        '#0099cc',
        '#cccccc',
        '#ffcc33',
        '#666699',
        '#009999',
        '#cc0066',
        '#cc6600',
        '#ff6666',
        '#990033',
        '#74c052'
      ]
      if (data.length > colors.length) {
        for (var j = 0; j < data.length / 9; j++) {
          colors = colors.concat(colors, colors)
        }
      }
      let yAxis = []
      let dates = {
        type: 'bar',
        itemStyle: {
          normal: {
            color: function(params) {
              var colorList = colors
              return colorList[params.dataIndex]
            }
          }
        },
        barWidth: 30,
        data: []
      }
      data.forEach((res) => {
        switch (type) {
          case 1:
            dates.name = '按材质'
            dates.data.push((res.PerProfitPrice / 100).toFixed(2))
            yAxis.push(
              res.EnumTypeName || '空'
            )
            break
          case 2:
            dates.name = '按品类'
            dates.data.push((res.PerProfitPrice / 100).toFixed(2))
            yAxis.push(
              res.EnumTypeName || '空'
            )
            break
          case 3:
            dates.name = '按成色'
            dates.data.push((res.PerProfitPrice / 100).toFixed(2))
            yAxis.push(
              res.EnumTypeName || '空'
            )
            break
          default:
            break
        }
      })
      options.yAxis.data = yAxis
      options.series = dates
      return options
    },
    queryChange() {
      let parameter = {
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
      this.getMaterialData({...parameter, EnumType: 1})
      this.getCategoryData({...parameter, EnumType: 2})
      this.getGoldData({...parameter, EnumType: 3})
    }
  },
  beforeMount() {
    this.characterTypes = CharacterType
    this.financeTypes = FinanceType
    var date = new Date()
    this.dateTime = [
      dayjs(new Date(Date.parse(date) - 6 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD'),
      dayjs(date).format('YYYY-MM-DD')
    ] // 统计的时间
  },
  mounted() {
    this.queryChange()
  },
  filters: {
    absolutely(value) {
      if (value < 0) {
        return 0 + '%'
      } else {
        return (value / 100).toFixed(2) + '%'
      }
    }
  },
  watch: {
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/sass/report.scss';
.echarts {
  width: 80% !important;
  min-height: 300px;
  line-height: 250px;
  margin: 0 auto;
}
.noData {
  line-height: 200px;
  height: 200px;
  font-size: 16px;
  color: #181818;
  text-align: center;
  font-weight: bold;
}
</style>
