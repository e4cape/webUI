<template>
  <el-row>
    <el-col :span="12">
      <div class="p-10">
        <span class="m-r-10 title">{{title}}</span>
        <el-select name="saleWay" v-if="isShow" v-model="saleWay" placeholder="所有销售方式" @change="selectedChange">
          <el-option label="所有销售方式" :value="0"></el-option>
          <el-option v-for="(item,index) in $store.getters.materialType.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
        </el-select>
        <el-select name="materialType" multiple v-model="materialType" placeholder="所有材质" @change="selectedChange">
          <el-option label="所有材质" :value="0"></el-option>
          <el-option v-for="(item,index) in $store.getters.materialType.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
        </el-select>
      </div>
      <el-col :span="12">
        <ECharts :options="saleDataPie" autoResize></ECharts>
        <div class="p-10 tc">销量分布</div>
      </el-col>
      <el-col :span="12">
        <ECharts :options="inventorDataPie" autoResize></ECharts>
        <div class="p-10 tc">库存分布</div>
      </el-col>
    </el-col>
    <el-col :span="12">
      <div name="ReportFigureExpend"
        class="fr range-set m-b-10"
        @click="rangeSet(settingTagTypes)">
        <i class="el-icon-setting"></i> 范围设置
      </div>
      <el-table :data="tableData">
        <el-table-column show-overflow-tooltip prop="StockTurnType" label="金重范围" v-if="title === '金重分析'"></el-table-column>
        <el-table-column show-overflow-tooltip prop="StockTurnStatus" label="主石重范围" v-else-if="title === '主石重分析'"></el-table-column>
        <el-table-column show-overflow-tooltip prop="StockTurnStatus" label="主石颜色" v-else-if="title === '主石颜色分析'"></el-table-column>
        <el-table-column show-overflow-tooltip prop="StockTurnStatus" label="主石净度" v-else-if="title === '主石净度分析'"></el-table-column>
        <el-table-column show-overflow-tooltip prop="StockTurnStatus" label="标签价范围" v-else-if="title === '标签价分析'"></el-table-column>
        <el-table-column show-overflow-tooltip prop="Quantity" label="日均销量"></el-table-column>
        <el-table-column show-overflow-tooltip prop="Quantity" label="当前库存"></el-table-column>
        <el-table-column show-overflow-tooltip prop="Percentage" label="销量占比">
          <template slot-scope="scope">
            <span style="margin-left: 5px">{{ scope.row.Percentage | absolutely}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="Percentage" label="库存占比">
          <template slot-scope="scope">
            <span style="margin-left: 5px">{{ scope.row.Percentage | absolutely}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="Quantity" label="库存评估" :render-header="inventorAssessHeader"></el-table-column>
      </el-table>
    </el-col>
    <settingTagModal
      v-if="visibleSettingTagModal"
      :visibleSettingTagModal="visibleSettingTagModal"
      @listenVisibleSettingTagModal="settingTagModalClose"
      :tagType="tagType"
    />
  </el-row>
</template>

<script>
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import {
  pie 
} from '@/datas/echart/pie'
// import settingTagModal from "@/components/scrm/settingTagModal"
import settingTagModal from './settingTag'
import {
  SettingTagTypes 
} from '@/enums/membership'

export default {
  props: ['title', 'isShow', 'saleDataPie', 'inventorDataPie', 'settingTagTypes', 'tableData'],
  data() {
    return {
      SettingTagTypes,
      materialType: [],
      saleWay: 0,
      visibleSettingTagModal: false, // 范围设置显隐
      tagType: null, // 标签类型
    }
  },
  methods: {
    inventorAssessHeader(createElement, {
      _self 
    }) {
      return createElement('span', [
        createElement('span', {
        }, ['库存评估']),
        createElement(
          'el-tooltip',
          {
            attrs: {
              placement: 'top',
              effect: 'light',
              class: 'icon el-icon-question pre-tip',
              content:
                '如果库存占比超过销量占比，库存评估为合理，否则评估为不合理。'
            }
          },
          [
            createElement(
              'i',
              {
                attrs: {
                  style: 'margin-left:5px;' 
                }
              },
              ['']
            )
          ]
        )
      ])
    },
    onSearch () {

    },
    selectedChange() {

    },
    rangeSet(settingTagType) {
      this.visibleSettingTagModal = true
      this.tagType = settingTagType
    },
    // -关闭
    settingTagModalClose() {
      this.visibleSettingTagModal = false
      switch (this.tagType) {
        case SettingTagTypes.ReportFigureAge:
          // this.getMemberAgeChart();
          break
        case SettingTagTypes.ReportFigureScore:
          // this.getMemberScoreChart();
          break
        case SettingTagTypes.ReportFigureExpend:
          // this.getMemberExpendChart();
          break
        default:
          return
      }
    }
  },
  components: {
    ECharts,
    settingTagModal
  },
  filters: {
    absolutely (value) {
      return (value * 100).toFixed(2) + '%'
    }
  },
}
</script>

<style lang="scss" scoped>
.echarts {
  width: 80% !important;
  height: 300px;
  line-height: 250px;
  margin: 0 auto;
}
.title {
  font-size: 18px;
}
.range-set {
  color: #007ed5;
  cursor: pointer;
}
</style>
