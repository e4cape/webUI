<template>
  <div
    class="chart-bd clearfix"
    v-loading="loadingChartBd"
  >
    <div class="left">
      <chart
        v-if="chartPieIf"
        :options="chartOptions"
        :totalName="chartTotalName"
        ref="chartPie"
        auto-resize
        style="width:100%"
      />
      <slot></slot>
    </div>
    <div class="right">
      <el-table :data="tableData">
        <el-table-column
          v-for="(item,index) in tableColumn.filter(i=> i.type != 'proportion')"
          :label="item.label"
          :prop="item.type"
          :key="index"
        >
        </el-table-column>
        <el-table-column label="占比">
          <template slot-scope="scope">
            {{ scope.row.proportion + '%' }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import chart from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/graphic'

export default {
  data() {
    return {
      // 图表配置
      chartOptions: {
        // 提示框
        tooltip: {
          formatter: '{b}: ({d}%)'
        },
        // 图例-位置标题
        legend: {
          type: 'scroll',
          orient: 'vertical',
          x: 'left',
          icon: 'stack',
          pageIconSize: 10,
          data: []
        },
        // 图形元素-中间内容
        graphic: {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: '',
            fill: '#353535',
            font: '16px \'Microsoft YaHei\'',
            textAlign: 'center'
          }
        },
        // 系列-饼图
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            data: []
          }
        ]
      }
    }
  },
  props: {
    // 图形数据
    tableData: {
      type: Array
    },
    // 表格数据
    tableColumn: {
      type: Array
    },
    // 总计名字
    chartTotalName: {
      type: String,
      default: '客户总数'
    },
    // 饼图否
    chartPieIf: {
      type: Boolean,
      default: true
    },
    loadingChartBd: {
      type: Boolean,
      default: false
    }
  },
  updated() {
    const tableDataArr = Array.from(this.tableData) // 返回的用于图表的data
    let legendDataArr = [] // 标题名数组
    let seriesDataArr = [] // 渲染图表数组
    let totalNum = 0 // 总计
    for (let i = 0; i < tableDataArr.length; i += 1) {
      legendDataArr.push(tableDataArr[i].labelString || tableDataArr[i].label)
      seriesDataArr.push({
        name: tableDataArr[i].labelString || tableDataArr[i].label,
        value: tableDataArr[i].proportion
      })
      totalNum += tableDataArr[i].counts
    }
    this.chartOptions.legend.data = legendDataArr
    this.chartOptions.series[0].data = seriesDataArr
    this.chartOptions.graphic.style.text = `${
      this.chartTotalName
    }\n\n${totalNum}`
  },
  components: {
    chart
  }
}
</script>

<style lang="scss" scoped>
.echarts {
  height: 300px;
}
.chart-bd {
  padding: 20px 0;
  & > div {
    float: left;
    &.left {
      width: 60%;
    }
    &.right {
      width: 40%;
      padding-right: 10%;
    }
  }
}
</style>
