<template>
  <el-row class="p-10" v-loading="$store.getters.tb_loading">
    <el-row class="m-10 top-line-search">
      <el-cascader :options="locationData" change-on-select name="characterId" v-model="characterId" @change="queryChange" :props="props"></el-cascader>
      <el-select name="FinanceType" v-model="financeType" placeholder="所有类别" :filterable="true" @change="queryChange">
        <el-option label="所有类别" :value="0"></el-option>
        <el-option v-for="item in financeTypes.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId"></el-option>
      </el-select>
      <el-select name="terminalType" v-model="terminalType" placeholder="所有销售来源" @change="queryChange">
        <el-option label="所有销售来源" :value="0"></el-option>
        <el-option v-for="item in terminalTypes.TypeArray" :key="item.KeyId" :label="item.Value" :value="parseInt(item.KeyId)"></el-option>
      </el-select>
      <el-select name="SourceType" v-model="sourceType" placeholder="所有货品来源" @change="queryChange">
        <el-option label="所有货品来源" :value="0"></el-option>
        <el-option v-for="item in retailOrderSellProductSourceTypes.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId"></el-option>
      </el-select>
      <el-date-picker name="dateTime" v-model="dateTime" :clearable="false" @change="queryChange" :unlink-panels="true" value-format="yyyy-MM-dd" type="daterange" placeholder="选择日期范围" :picker-options="$root.datePickerOptions"></el-date-picker>
    </el-row>
    <el-row>
      <el-col :span="12">
        <ECharts :options="pieData" autoResize></ECharts>
      </el-col>
      <el-col :span="12">
        <el-table :data="data">
          <el-table-column show-overflow-tooltip prop="EnumTypeName" label="支付方式">
            <template slot-scope="scope">
              {{scope.row.EnumTypeName || '空'}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="Price" label="金额">
            <template slot-scope="scope">
              {{'￥' + $root.toFloat(scope.row.Price)}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="PerPrice" label="占比">
            <template slot-scope="scope">
              <span style="margin-left: 5px">{{ scope.row.PerPrice | absolutely}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
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
  FinanceType,
  StockPositionTypeType
} from '@/enums/stocking'
import {
  STOCKING_API_REPORT_SALE_ANALYSISBYSALEBOARD,
} from '@/apis/stocking'
import dayjs from 'dayjs'
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
      dateTime: '',
      characterTypes: {
      },
      characterId: [0],
      financeTypes: {
      },
      financeType: 0,
      terminalTypes: {
      },
      terminalType: 0,
      retailOrderSellProductSourceTypes: {
      },
      sourceType: 0,
      pieData: {
      },
      data: [],
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
    getData(parameter) {
      STOCKING_API_REPORT_SALE_ANALYSISBYSALEBOARD(parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          let data = []
          this.data.forEach(res => {
            if (res.Price > 0) {
              data.push({
                value: this.$root.toFloat(res.Price),
                name: res.EnumTypeName
              })
            }
          })
          this.pieData = this.initPiedata(res.data.Data, data)
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
      if (result.Price === 0) {
        pieData.title.text = '暂无数据'
      } else {
        pieData.title.text = '总金额'
      }
      pieData.title.subtext = '￥' + ((result.Price ? this.$root.toFloat(result.Price) : 0))
      return pieData
    },
    queryChange() {
      let parameter = {
        FinanceType: this.financeType,
        SourceType: this.sourceType,
        TerminalType: this.terminalType,
        BeginTime: this.dateTime[0],
        EndTime: this.dateTime[1],
        CompchterId: 0,
        StorechterId: 0,
        ClassifyId: -1,
        DeskId: 0
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
      this.getData({...parameter, EnumType: 4})
    }
  },
  beforeMount() {
    this.characterTypes = CharacterType
    this.financeTypes = FinanceType
    this.terminalTypes = TerminalType
    this.retailOrderSellProductSourceTypes = RetailOrderSellProductSourceType
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
  },
  components: {
    ECharts
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
