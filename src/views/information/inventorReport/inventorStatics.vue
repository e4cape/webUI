<template>
  <el-row>
    <div id="printCollect1">
      <el-row :gutter="20" class="total-panel m-t-10">
        <el-col :span="6">
          <div class="total qty">
            <div class="number">{{summary.FinanceQty || 0}}</div>
            <div class="name">总件数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total weight">
            <div class="number">{{$root.toFloat(summary.Weight, 3) || 0}}g</div>
            <div class="name">总货重</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total weight">
            <div class="number">{{$root.toFloat(summary.GoldWeight, 3) || 0}}g</div>
            <div class="name">总金重</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total cashier">
            <div class="number">￥{{$root.toFloat(summary.LabelPrice) || 0}}</div>
            <div class="name">标签价总金额</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="m-10">
      <span>汇总项：</span>
      <el-select name="columnValue" v-model="columnValue" multiple placeholder="请选择汇总项" style="width: 400px;">
        <el-option
          v-for="(item, index) in GoupBys.Types"
          :key="index"
          :label="item"
          :value="index"
          v-if="($store.getters.user_session.CharacterType == enums.CharacterType.Store && index != 'CompanyName' && index != 'StoreName') || ($store.getters.user_session.CharacterType == enums.CharacterType.Group && index != 'WarehouseName' && index != 'ShelfName' && index != 'GroupTypeDv' && index != 'DeskName') || ($store.getters.user_session.CharacterType == enums.CharacterType.Company && index != 'CompanyName' && index != 'GroupTypeDv' && index != 'DeskName')"
          :disabled="(columnValue.length === 3 && columnValue.indexOf(index) === -1) || (columnValue.indexOf(GoupBys.GroupTypeDv) > -1 && (index == GoupBys.DeskName)) || ((columnValue.indexOf(GoupBys.DeskName) > -1) && index == GoupBys.GroupTypeDv)">
        </el-option>
      </el-select>
      <span>（最多可以选择3项）</span>
      <el-button name="btnprintCollect" size="mini" type="primary" @click="printCollect" class="m-l-20">打印当前页</el-button>
    </div>
    <div class="p-10" id="printCollect2">
      <el-table :data="data" :row-style="({row, rowIndex}) => { return row.rows > 1 ? {color: row.index === 0 ? '#000' : row.index === 1 ? 'blue' : '#888', 'font-weight': 'bold'} : {}}" :span-method="rowSpanMethod" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.Name" :label="item.Text" show-overflow-tooltip></el-table-column>
        <el-table-column prop="FinanceQty" label="件数" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Weight" label="货重" show-overflow-tooltip>
          <template slot-scope="scope">
            {{$root.toFloat(scope.row.Weight, 3)}}g
          </template>
        </el-table-column>
        <el-table-column prop="GoldWeight" label="金重" show-overflow-tooltip>
          <template slot-scope="scope">
            {{$root.toFloat(scope.row.GoldWeight, 3)}}g
          </template>
        </el-table-column>
        <el-table-column prop="LabelPrice" label="标签价" show-overflow-tooltip>
          <template slot-scope="scope">
            ￥{{$root.toFloat(scope.row.LabelPrice)}}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-row>
</template>

<script>
import {
  CharacterType,
} from '@/enums/common'
import {
  RetailType,
  FinanceType
} from '@/enums/stocking'
import {
  STOCKING_API_REPORT_GOODS_STOCK_CHARTBYSTOCKSUMMARY,
} from '@/apis/stocking'
export default {
  data() {
    return {
      enums: {
        CharacterType,
        RetailType,
        FinanceType
      },
      GoupBys: {
        'DeskName': 'DeskName',
        'GroupTypeDv': 'GroupTypeDv',
        'MaterialType': 'MaterialType',
        'CategoryType': 'CategoryType',
        'GoldType': 'GoldType',
        'LargeClassTypeEv': 'LargeClassTypeEv',
        'SmallClassTypeEv': 'SmallClassTypeEv',
        'FinanceClassTypeEv': 'FinanceClassTypeEv',
        'RetailType': 'RetailType',
        'FinanceType': 'FinanceType',
        'CompanyName': 'CompanyName',
        'StoreName': 'StoreName',
        'WarehouseName': 'WarehouseName',
        'ShelfName': 'ShelfName',
        'StoneClassTypeEv': 'StoneClassTypeEv',
        'SeriesTypeEv': 'SeriesTypeEv',
        Types: {
          'DeskName': '柜台',
          'GroupTypeDv': '柜台分组',
          'MaterialType': '材质',
          'CategoryType': '品类',
          'GoldType': '成色',
          'LargeClassTypeEv': '大类',
          'SmallClassTypeEv': '小类',
          'FinanceClassTypeEv': '财务分类',
          'RetailType': '销售方式',
          'FinanceType': '入库类别',
          'CompanyName': '公司',
          'StoreName': '门店',
          'WarehouseName': '仓库',
          'ShelfName': '货架',
          'StoneClassTypeEv': '石类',
          'SeriesTypeEv': '系列',
        }
      },
      columnValue: [],
      columns: [],
      summary: {
      }, // 销售汇总 统计数据
      data: []
    }
  },
  methods: {
    getData() {
      if (!this.columns.length) {
        this.data = []
        return false
      }
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_REPORT_GOODS_STOCK_CHARTBYSTOCKSUMMARY({
        GoupBys: this.columnValue.join(',')
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.summary = res.data.Data
          this.data = this.filterCollect(res.data.Data.Rows || [], 0)
        } else {
          this.data = []
          this.$message.error(res.data.Message)
        }
      })
    },
    filterCollect(filterData, index, parent) {
      let map = {
      }
      let data = []
      let result = []
      let name = this.columns[index].Name
      filterData.forEach(item => {
        let flag =
          index === 0
            ? true
            : index === 1
              ? parent[0] === item[this.columns[index - 1].Name]
              : parent[0] === item[this.columns[index - 2].Name] &&
                parent[1] === item[this.columns[index - 1].Name]
        if (flag) {
          if (map[item[name]] !== item[name]) {
            data.push({
              name: item[name],
              txt:
                name === 'CompanyName'
                  ? item['CompanyName']
                  : name === 'StoreName'
                    ? item['StoreName']
                    : name === 'DeskName'
                      ? item['DeskName'] || '仓库'
                      : name === 'WarehouseName'
                        ? item['WarehouseName']
                        : name === 'ShelfName'
                          ? item['ShelfName']
                          : name === 'GroupTypeDv'
                            ? item['GroupTypeDv'] || '空'
                            : name === 'DeskName'
                              ? item['DeskName']
                              : name === 'SeriesTypeEv'
                                ? item['SeriesTypeEv'] || '空'
                                : name === 'StoneClassTypeEv'
                                  ? item['StoneClassTypeEv'] || '空'
                                  : name === 'LargeClassTypeEv'
                                    ? item['LargeClassTypeEv'] || '空'
                                    : name === 'SmallClassTypeEv'
                                      ? item['SmallClassTypeEv'] || '空'
                                      : name === 'FinanceClassTypeEv'
                                        ? item['FinanceClassTypeEv'] || '空'
                                        : (this.enums[name] &&
                                            this.enums[name].Types[item[name]]) ||
                                          '空',
              data: [item],
              parent:
                index === 0
                  ? [item[name]]
                  : index === 1
                    ? [item[this.columns[index - 1].Name], item[name]]
                    : [
                      item[this.columns[index - 2].Name],
                      item[this.columns[index - 1].Name],
                      item[name]
                    ]
            })
            map[item[name]] = item[name]
          } else {
            data.forEach(d => {
              if (d.name === item[name]) {
                d.data.push(item)
              }
            })
          }
        }
      })
      data.forEach(item => {
        let obj = {
          index: index
        }
        this.columns.forEach((c, i) => {
          obj[c.Name] =
            c.Name === name ? item.txt : i === index + 1 ? '合计' : ''
        })
        let children = []
        if (this.columns.length - 1 > index) {
          children = this.filterCollect(filterData, index + 1, item.parent)
        }
        obj.rows = children.length + 1
        result.push(Object.assign(obj, this.getCount(item.data)))
        result = result.concat(children)
      })
      return result
    },
    getCount(data) {
      let obj = {
        FinanceQty: 0,
        LabelPrice: 0,
        Weight: 0,
        GoldWeight: 0,
      }
      data.forEach(item => {
        obj.FinanceQty += item.FinanceQty
        obj.LabelPrice += item.LabelPrice
        obj.Weight += item.Weight
        obj.GoldWeight += item.GoldWeight
      })
      return obj
    },
    rowSpanMethod({
      row, columnIndex 
    }) {
      if (columnIndex < this.columns.length) {
        if (columnIndex < row.index) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } else {
          if (row.index === columnIndex) {
            return {
              rowspan: row.rows,
              colspan: 1
            }
          } else {
            return {
              rowspan: 1,
              colspan: 1
            }
          }
        }
      }
    },
    printCollect() {
      let date = new Date()
      var headstr = `<html><head><title></title></head>
        <style type="text/css">
        body{
          overflow: auto;
        }
        .total-panel{
          width: 1064px;
          margin: 10px 0;
          padding: 0 !important;
        }
        .total-panel .total {
          border: 1px solid #000;
          color: #000;
        }
        .total-panel .total div{
          color: #000;
        }
        .el-table{
          width: 1064px !important;
        }
        .twoDaysData {
          width: 1075px;
          margin: 0 !important;
        }
        .twoDaysData .el-col {
          display: block;
          width: 100%;
          padding: 0 !important;
        }
        .el-table__empty-block {
          width: 100% !important;
          text-align: center;
        }
        table {
          width: 100% !important;
        }
        .print-title{
          width: 1075px;
          padding: 20px 0;
          font-size: 16px;
          text-align:center;
        }
        </style>
        <body>
        <div class="print-title">库存汇总&nbsp;&nbsp;&nbsp;${date.getFullYear()}-${date.getMonth() +
        1}-${date.getDate()}</div>`
      var footstr = '</body>'
      var printData1 = document.getElementById('printCollect1').innerHTML
      var printData2 = document.getElementById('printCollect2').innerHTML
      document.body.innerHTML =
        headstr +
        printData1.replace(/<colgroup>.*?<\/colgroup>/g, '') +
        printData2.replace(/<colgroup>.*?<\/colgroup>/g, '') +
        footstr
      window.print()
      window.location.reload()
    },
    async getAllType() {
      await this.setEnumsType('GoldType', 'goldType')
      await this.setEnumsType('MaterialType', 'materialType')
      await this.setEnumsType('CategoryType', 'categoryType')
    },
    setEnumsType(type1, type2) {
      return new Promise((resolve) => {
        let count = 0
        let fn = () => {
          if (this.$store.getters[type2].TypeArray.length || count == 20) {
            this.$set(this.enums, type1, this.$store.getters[type2])
            resolve()
          } else {
            setTimeout(() => {
              count += 1
              fn()
            }, 100)
          }
        }
        fn()
      })
    }
  },
  async mounted() {
    let type = this.GoupBys
    await this.getAllType()
    this.columnValue = localStorage.inventors
      ? JSON.parse(localStorage.inventors)
      : [type.MaterialType, type.CategoryType, type.GoldType]
    this.getData()
  },
  watch: {
    columnValue(value) {
      let str = []
      for (let i = 0; i < value.length; i++) {
        let name = Object.keys(this.GoupBys.Types).find(
          k => k === value[i]
        )
        str.push({
          Name: name === 'DeskIds' ? 'DeskId' : name,
          Text: this.GoupBys.Types[value[i]]
        })
      }
      this.columns = str
      this.data = []
      localStorage.inventors = value.length ? JSON.stringify(value) : ''
      this.getData()
    }
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/sass/report.scss';
</style>
