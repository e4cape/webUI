<template>
  <el-row class="p-10">
    <div class="m-10 top-line-search">
      <el-cascader :options="locationData" change-on-select name="characterId" v-model="characterId" @change="queryChange" :props="props"></el-cascader>
      <el-select name="financeType" v-model="financeType" placeholder="所有类别" :filterable="true" @change="queryChange">
        <el-option label="所有类别" :value="0"></el-option>
        <el-option v-for="(item,index) in financeTypes.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
      </el-select>
    </div>
    <el-row :gutter="20">
      <el-col :span="8">
        <ECharts :options="pieMaterial" autoResize></ECharts>
        <p class="top-title">材质分布</p>
        <template>
          <el-table :data="materialData">
            <el-table-column show-overflow-tooltip prop="MaterialTypeName" label="材质"></el-table-column>
            <el-table-column show-overflow-tooltip prop="GoldWeight" label="库存">
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3) + 'g'}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="占比">
              <template slot-scope="scope">
                <span style="margin-left: 5px">{{ scope.row.PerGoldWeight | absolutely}}</span>
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
            <el-table-column show-overflow-tooltip prop="CategoryTypeName" label="品类"></el-table-column>
            <el-table-column show-overflow-tooltip prop="GoldWeight" label="库存">
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3) + 'g'}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="PerGoldWeight" label="占比">
              <template slot-scope="scope">
                <span style="margin-left: 5px">{{ scope.row.PerGoldWeight | absolutely}}</span>
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
            <el-table-column show-overflow-tooltip prop="GoldTypeName" label="成色">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="GoldWeight" label="库存">
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3) + 'g'}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="PerGoldWeight" label="占比" min-width="">
              <template slot-scope="scope">
                <span style="margin-left: 5px">{{ scope.row.PerGoldWeight | absolutely}}</span>
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
  GoodsStockWarehousePositionType
} from '@/enums/stocking'
import {
  STOCKING_API_REPORT_GOODS_STOCK_ANALYSISBYGOODSQTY,
} from '@/apis/stocking'
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
      STOCKING_API_REPORT_GOODS_STOCK_ANALYSISBYGOODSQTY(parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.materialData = res.data.Data.Rows || []
          let data = []
          this.materialData.forEach(item => {
            item.MaterialTypeName =
              this.$store.getters.materialType.Types[item.MaterialType] || '空'
            if (item.GoldWeight > 0) {
              data.push({
                value: this.$root.toFloat(item.GoldWeight, 3),
                name: item.MaterialTypeName
              })
            }
          })
          this.pieMaterial = this.initPiedata(res.data.Data, data)
        }
      })
    },

    getCategoryData(parameter) {
      STOCKING_API_REPORT_GOODS_STOCK_ANALYSISBYGOODSQTY(parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.categoryData = res.data.Data.Rows || []
          let data = []
          this.categoryData.forEach(item => {
            item.CategoryTypeName =
              this.$store.getters.categoryType.Types[item.CategoryType] || '空'
            if (item.GoldWeight > 0) {
              data.push({
                value: this.$root.toFloat(item.GoldWeight, 3),
                name: item.CategoryTypeName
              })
            }
          })
          this.pieCategory = this.initPiedata(res.data.Data, data)
        }
      })
    },

    getGoldData(parameter) {
      STOCKING_API_REPORT_GOODS_STOCK_ANALYSISBYGOODSQTY(parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goldData = res.data.Data.Rows || []
          let data = []
          this.goldData.forEach(item => {
            item.GoldTypeName =
              this.$store.getters.goldType.Types[item.GoldType] || '空'
            if (item.GoldWeight > 0) {
              data.push({
                value: this.$root.toFloat(item.GoldWeight, 3),
                name: item.GoldTypeName
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
        pieData.title.text = '暂无数据'
        pieData.series[0].data = [
          {
            value: 0,
            name: '暂无数据'
          }
        ]
      } else {
        pieData.title.text = '总库存'
        pieData.series[0].data = data
      }
      pieData.title.subtext = this.$root.toFloat(result.GoldWeight, 3) + 'g'
      return pieData
    },
    queryChange() {
      let parameter = {
        FinanceType: this.financeType,
        PositionType: 0,
        CompchterId: 0,
        StorechterId: 0,
        WarehouseId: 0,
        ShelfId: 0,
        GroupTypeDk: -1,
        DeskId: 0
      }
      switch (this.characterId[0]) {
        case 0:
          parameter.CompchterId = 0
          parameter.StorechterId = 0
          parameter.WarehouseId = 0
          parameter.ShelfId = 0
          parameter.GroupTypeDk = -1
          parameter.DeskId = 0
          break
        case GoodsStockWarehousePositionType.Warehouse:
          parameter.PositionType = this.characterId[0]
          parameter.WarehouseId = this.characterId[1] ? this.characterId[1] : 0
          parameter.ShelfId = this.characterId[2] ? this.characterId[2] : 0
          parameter.CompchterId = 0
          parameter.StorechterId = 0
          parameter.GroupTypeDk = -1
          parameter.DeskId = 0
          break
        case GoodsStockWarehousePositionType.Store:
          parameter.PositionType = this.characterId[0]
          parameter.StorechterId = this.characterId[1] ? this.characterId[1] : 0
          parameter.CompchterId = 0
          parameter.WarehouseId = 0
          parameter.ShelfId = 0
          parameter.GroupTypeDk = -1
          parameter.DeskId = 0
          break
        case 2:
          parameter.PositionType = GoodsStockWarehousePositionType.Store
          parameter.GroupTypeDk = 0
          parameter.DeskId = this.characterId[1] ? this.characterId[1] : 0
          parameter.CompchterId = 0
          parameter.StorechterId = 0
          parameter.WarehouseId = 0
          parameter.ShelfId = 0
          break
        default:
          if (this.$store.getters.user_session.CharacterType == CharacterType.Group) {
            parameter.StorechterId = this.characterId[1] ? this.characterId[1] : 0
            parameter.CompchterId = this.characterId[0] ? this.characterId[0] : 0
            parameter.PositionType = parameter.StorechterId === 0 ? GoodsStockWarehousePositionType.Warehouse : GoodsStockWarehousePositionType.Store
            parameter.WarehouseId = 0
          } else {
            parameter.PositionType = GoodsStockWarehousePositionType.Store
            parameter.GroupTypeDk = this.characterId[0] ? this.characterId[0] : 0
            parameter.DeskId = this.characterId[1] ? this.characterId[1] : 0
            parameter.CompchterId = 0
            parameter.StorechterId = 0
            parameter.WarehouseId = 0
            parameter.ShelfId = 0
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
