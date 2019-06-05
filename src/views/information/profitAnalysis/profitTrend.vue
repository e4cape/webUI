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
        <ECharts :options="pieMaterial" autoResize></ECharts>
        <p class="top-title">材质分布</p>
        <template>
          <el-table :data="materialData">
            <el-table-column show-overflow-tooltip prop="EnumTypeName" label="材质">
              <template slot-scope="scope">
                {{scope.row.EnumTypeName || '空'}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="ProfitPrice" label="毛利">
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.ProfitPrice)}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="占比">
              <template slot-scope="scope">
                <span style="margin-left: 5px">{{ scope.row.PerProfitPrice | absolutely}}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-col>
      <el-col :span="8">
        <ECharts :options="pieCategory" autoResize></ECharts>
        <p class="top-title">品类分布</p>
        <template>
          <el-table :data="categoryData">
            <el-table-column show-overflow-tooltip prop="EnumTypeName" label="品类">
              <template slot-scope="scope">
                {{scope.row.EnumTypeName || '空'}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="ProfitPrice" label="毛利">
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.ProfitPrice)}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="PerProfitPrice" label="占比">
              <template slot-scope="scope">
                <span style="margin-left: 5px">{{ scope.row.PerProfitPrice | absolutely}}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-col>
      <el-col :span="8">
        <ECharts :options="pieGlod" autoResize></ECharts>
        <p class="top-title">成色分布</p>
        <template>
          <el-table :data="goldData">
            <el-table-column show-overflow-tooltip prop="EnumTypeName" label="成色">
              <template slot-scope="scope">
                {{scope.row.EnumTypeName || '空'}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="ProfitPrice" label="毛利">
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.ProfitPrice)}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="PerProfitPrice" label="占比" min-width="">
              <template slot-scope="scope">
                <span style="margin-left: 5px">{{ scope.row.PerProfitPrice | absolutely}}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
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
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import {
  pie 
} from '@/datas/echart/pie'

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
      pieMaterial: {
      },
      pieCategory: {
      },
      pieGlod: {
      },
      materialData: [],
      categoryData: [],
      goldData: [],
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
          this.materialData = res.data.Data.Rows || []
          let data = []
          this.materialData.forEach(res => {
            if (res.ProfitPrice > 0) {
              data.push({
                value:  this.$root.toFloat(res.ProfitPrice),
                name: res.EnumTypeName || '空'
              })
            }
          })
          this.pieMaterial = this.initPiedata(res.data.Data, data)
        }
      })
    },

    getCategoryData(parameter) {
      STOCKING_API_REPORT_SALE_ANALYSISBYSALEBOARD3(parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.categoryData = res.data.Data.Rows || []
          let data = []
          this.categoryData.forEach(res => {
            if (res.ProfitPrice > 0) {
              data.push({
                value: this.$root.toFloat(res.ProfitPrice),
                name: res.EnumTypeName || '空'
              })
            }
          })
          this.pieCategory = this.initPiedata(res.data.Data, data)
        }
      })
    },

    getGoldData(parameter) {
      STOCKING_API_REPORT_SALE_ANALYSISBYSALEBOARD3(parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goldData = res.data.Data.Rows || []
          let data = []
          this.goldData.forEach(res => {
            if (res.ProfitPrice > 0) {
              data.push({
                value: this.$root.toFloat(res.ProfitPrice),
                name: res.EnumTypeName || '空'
              })
            }
          })
          this.pieGlod = this.initPiedata(res.data.Data, data)
        }
      })
    },
    // 渲染图表
    initPiedata(result, data) {
      let pieData = JSON.parse(JSON.stringify(pie))
      if (data.length === 0) {
        pieData.series[0].data = [
          {
            value: 0,
            name: '暂无数据'
          }
        ]
      } else {
        pieData.series[0].data = data
      }
      if (result.ProfitPrice === 0) {
        pieData.title.text = '暂无数据'
      } else {
        pieData.title.text = '总毛利'
      }
      pieData.title.subtext = this.$root.toFloat(result.ProfitPrice)
      return pieData
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
  height: 300px;
  line-height: 250px;
  margin: 0 auto;
}
</style>
