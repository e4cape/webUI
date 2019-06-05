<template>
  <div class="content">
    <el-form :model="formInline" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel :isSenior="false">
        <template slot="btnBox">
          <el-form-item>
            <el-button name="btnonSubmit" type="primary" @click="onSubmit">导出报表</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-date-picker name="year" v-model="formInline.year" align="right" :editable="false" :clearable="false" type="year" placeholder="选择日期" @change="GetQuarter"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-select name="userId" v-model="formInline.userId" @change="GetQuarter" placeholder="请选择">
              <el-option v-for="item in userobj" :label="item.TrueName||item.AliasName" :value="item.UserId" :key="item.UserId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select name="view" v-model="formInline.view" @change="ExChangeShow" placeholder="请选择">
              <el-option label="图表" value="1"></el-option>
              <el-option label="表格" value="3"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <div class="bd-t-1 p-t-20">
      <chart :options="polar" v-if="isShow==1" ref="bar" :auto-resize="true" class="w-100"></chart>
    </div>
    <template v-if="isShow==3">
      <h2 class="list-t">{{polar.series[0].name}}</h2>
      <el-table :data="MonthReport" stripe style="width: 100%" v-if="formInline.isCollapse==1">
        <el-table-column v-if="formInline.userId==0" label="项目" prop="name"></el-table-column>
        <el-table-column v-else label="姓名" prop="name"></el-table-column>
        <el-table-column label="1月" prop="Month1"></el-table-column>
        <el-table-column label="2月" prop="Month2"></el-table-column>
        <el-table-column label="3月" prop="Month3"></el-table-column>
        <el-table-column label="4月" prop="Month4"></el-table-column>
        <el-table-column label="5月" prop="Month5"></el-table-column>
        <el-table-column label="6月" prop="Month6"></el-table-column>
        <el-table-column label="7月" prop="Month7"></el-table-column>
        <el-table-column label="8月" prop="Month8"></el-table-column>
        <el-table-column label="9月" prop="Month9"></el-table-column>
        <el-table-column label="10月" prop="Month10"></el-table-column>
        <el-table-column label="11月" prop="Month11"></el-table-column>
        <el-table-column label="12月" prop="Month12"></el-table-column>
      </el-table>
    </template>
  </div>
</template>
<script>
import chart from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/polar'
import dayjs from 'dayjs'
import searchPanel from '@/components/searchPanel.vue'
import {
  MERCHANT_API_DROPDOWN_USERLIST
} from '@/apis/merchant'
// import {
//   PERFORMANCE_API_REPORT_RATIOLIST,
//   PERFORMANCE_API_REPORT_RATIOEXPORT
// } from '@/apis/performance'
export default {
  data() {
    return {
      formInline: {
        isCollapse: 1,
        year: parseInt(dayjs(new Date()).format('YYYY')),
        view: '图表',
        userId: '0'
      },
      Name: '',
      userobj: [],
      polar: {},
      isShow: 1,
      MonthReport: [],
      isLoading: true
    }
  },
  components: {
    chart,
    searchPanel
  },
  methods: {
    initDate() {
      const _date = parseInt(dayjs(new Date()).format('YYYY'))
      this.formInline.year = _date.toString()
    },
    getUser() {
      MERCHANT_API_DROPDOWN_USERLIST({
        signedTime: dayjs(new Date()).format('YYYY-MM-DD')
      }).then(res => {
        let _data = res.data.Data
        _data.unshift({
          TrueName: '全部', UserId: '0'
        })
        this.userobj = _data
      })
    },
    onSubmit() {
      // PERFORMANCE_API_REPORT_RATIOEXPORT({
      //   Year: this.formInline.year, UserId: this.formInline.userId
      // }).then(res => {
      //   window.open(res.data.Data.FilePath)
      // })
    },
    GetQuarter() {
      let _data = this.formInline
      _data.year = dayjs(new Date(this.formInline.year)).format('YYYY')
      let bar = this.$refs.bar
      bar.showLoading({
        text: '拼命加载中',
        color: '#409eff',
        maskColor: 'rgba(255, 255, 255, 0.8)'
      })
      // let report = {
      //   'tooltip': {
      //     'trigger': 'axis',
      //     'axisPointer': {
      //       'type': 'cross',
      //       'label': {
      //         'backgroundColor': '#006db8'
      //       }
      //     }
      //   },
      //   'legend': {
      //     'data': ['提成报表']
      //   },
      //   'toolbox': {
      //   },
      //   'grid': {
      //     'left': '3%',
      //     'right': '4%',
      //     'bottom': '3%',
      //     'containLabel': true
      //   },
      //   'xAxis': [
      //     {
      //       'type': 'category',
      //       'boundaryGap': false,
      //       'data': [
      //         '1月',
      //         '2月',
      //         '3月',
      //         '4月',
      //         '5月',
      //         '6月',
      //         '7月',
      //         '8月',
      //         '9月',
      //         '10月',
      //         '11月',
      //         '12月'
      //       ]
      //     }
      //   ],
      //   'yAxis': [
      //     {
      //       'type': 'value'
      //     }
      //   ],
      //   'series': [
      //     {
      //       'name': '提成报表',
      //       'user': '全部',
      //       'type': 'line',
      //       'stack': '总量',
      //       itemStyle: {
      //         normal: {
      //           color: '#006db8',
      //           'lineStyle': {
      //             'color': '#006db8'
      //           },
      //           'fillStyle': {
      //             'color': '#006db8'
      //           }
      //         }
      //       },
      //       'areaStyle': {
      //         'normal': {
      //           'lineStyle': {
      //             'color': '#006db8'
      //           }
      //         }
      //       },
      //       'data': [
      //         0,
      //         0,
      //         0,
      //         0,
      //         0,
      //         0,
      //         0,
      //         0,
      //         0,
      //         0,
      //         0,
      //         0
      //       ]
      //     }
      //   ]
      // }
      // PERFORMANCE_API_REPORT_RATIOLIST({
      //   userId: _data.userId, year: _data.year
      // }).then(res => {
      //   const _data = res.data.Data
      //   if (_data.length > 0) {
      //     _data.forEach(m => {
      //       report.series[0].data[dayjs(new Date(m.EventDate)).format('M') - 1] = m.RatioPrice.toFixed(2)
      //     })
      //   }
      //   this.polar = report
      //   let ary = {
      //   }
      //   this.polar.series[0].data.forEach((item, index) => {
      //     ary['Month' + (index + 1)] = item
      //   })
      //   if (this.formInline.userId === '0') {
      //     ary.name = '奖金金额'
      //     this.Name = '项目'
      //   } else {
      //     ary.name = this.userobj.find(m => m.Value === this.formInline.userId).Name
      //     this.Name = '姓名'
      //   }

      //   this.$set(this.MonthReport, 0, ary)
      //   bar.hideLoading()
      // })

    },
    ExChangeShow() {
      let ary = {
      }
      this.polar.series[0].data.forEach((item, index) => {
        ary['Month' + (index + 1)] = item
      })
      if (this.formInline.userId === '0') {
        ary.name = '提成金额'
        this.Name = '项目'
      } else {
        ary.name = this.userobj.find(m => m.Value === this.formInline.userId).Name
        this.Name = '姓名'
      }
      this.MonthReport[0] = ary
      this.$data.isShow = this.$data.formInline.view
    }
  },
  mounted() {
    this.initDate()
    this.getUser()
    this.GetQuarter()
  },
  watch: {
    '$store.state.menuWidth'() {
      setTimeout(() => {
        this.$refs.bar.resize()
      }, 400)
    }
  }
}

</script>
<style scoped>
.el-radio-button__orig-radio:checked + .el-radio-button__inner {
  background-color: #006db8;
  border-color: #006db8;
  box-shadow: -1px 0 0 0 #006db8;
}

.echarts {
  width: 100%;
  overflow: hidden;
}

.list-t {
  font-size: 14px;
  margin-bottom: 15px;
}
.bd-t-1 {
  border-top: 1px #ddd solid;
}
</style>
