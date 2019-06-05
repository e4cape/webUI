<template>
  <el-row>
    <div class="m-10 top-line-search">
      <!-- <el-cascader placeholder="所有位置" :options="$store.getters.classify_and_desks" change-on-select name="characterId" v-model="characterId" @change="queryChange"></el-cascader> -->
      <el-select name="financeType" v-model="financeType" placeholder="所有类别" @change="queryChange">
        <el-option label="所有类别" :value="0"></el-option>
        <el-option v-for="(item,index) in enums.FinanceType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
      </el-select>
      <el-date-picker name="dateTime" v-model="dateTime" :clearable="false" @change="queryChange" :unlink-panels="true" type="daterange" placeholder="选择日期范围" :picker-options="$root.datePickerOptions"></el-date-picker>
    </div>
    <el-row :gutter="20" class="total-panel">
      <el-col :span="6">
        <div class="total qty">
          <div class="number">{{summary.TotalSaleNum || 0}}</div>
          <div class="name">到货</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="total weight">
          <div class="number">{{summary.TotalGoldWeight || 0}}</div>
          <div class="name">到货入库</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="total price">
          <div class="number">{{summary.TotalApplyAmount || 0}}</div>
          <div class="name">次品</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="total cashier">
          <div class="number">{{summary.TotalCashAmount || 0}}</div>
          <div class="name">良品待入库</div>
        </div>
      </el-col>
    </el-row>
    <div class="m-10">
      <span>汇总项：</span>
      <el-select name="columnValue" v-model="columnValue" multiple placeholder="请选择汇总项" style="width: 400px;">
        <el-option v-for="(item, index) in enums.SaleOrderCollectType.Types" :key="index" :label="item" :value="index" v-if="($store.getters.user_session.CharacterType == enums.CharacterType.Store && index != enums.SaleOrderCollectType.CharacterId) || ($store.getters.user_session.CharacterType == enums.CharacterType.Group && index != enums.SaleOrderCollectType.DeskId && index != enums.SaleOrderCollectType.ClassifyId && index != enums.SaleOrderCollectType.DeskIds) || ($store.getters.user_session.CharacterType == enums.CharacterType.Company && index != enums.SaleOrderCollectType.DeskId && index != enums.SaleOrderCollectType.CompanyId && index != enums.SaleOrderCollectType.ClassifyId && index != enums.SaleOrderCollectType.DeskIds)" :disabled="(columnValue.length === 3 && columnValue.indexOf(index) === -1) || (index == enums.SaleOrderCollectType.CreateTime && timeEnable)  || ((columnValue.indexOf(enums.SaleOrderCollectType.CashierUserId + '') > -1) && (index == enums.SaleOrderCollectType.AssistUserId || index == enums.SaleOrderCollectType.MainUserId)) || ((columnValue.indexOf(enums.SaleOrderCollectType.AssistUserId + '') > -1) && (index == enums.SaleOrderCollectType.CashierUserId || index == enums.SaleOrderCollectType.MainUserId)) || ((columnValue.indexOf(enums.SaleOrderCollectType.MainUserId + '') > -1) && (index == enums.SaleOrderCollectType.CashierUserId || index == enums.SaleOrderCollectType.AssistUserId))"></el-option>
      </el-select>
      <span>（最多可以选择3项）</span>
      <el-button name="btnprintCollect" type="primary" size="mini" @click="printCollect" class="m-l-20">打印当前页</el-button>
    </div>
    <div id="printCollect">
      <el-table :data="data" show-summary  border :summary-method="getSummaries" :row-style="({row, rowIndex}) => { return row.rows > 1 ? {color: row.index === 0 ? '#000' : row.index === 1 ? 'blue' : '#888', 'font-weight': 'bold'} : {}}" :span-method="rowSpanMethod" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-table-column style="line-align: top;" v-for="(item, index) in columns" :key="index" :prop="item.Name" :label="item.Text"></el-table-column>
        <el-table-column prop="SaleNum" label="数量" width="60"></el-table-column>
        <el-table-column prop="Weight" label="货重">
          <template slot-scope="scope">
            {{scope.row.Weight.toFixed(3)}}
          </template>
        </el-table-column>
        <el-table-column prop="GoldWeight" label="销售金重">
          <template slot-scope="scope">
            {{scope.row.GoldWeight.toFixed(3)}}
          </template>
        </el-table-column>
        <el-table-column prop="LabelPrice" label="标签价">
          <template slot-scope="scope">
            ￥{{scope.row.LabelPrice.toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column prop="ApplyAmount" label="应付金额">
          <template slot-scope="scope">
            {{scope.row.ApplyAmount.toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column prop="CashAmount" label="实付金额">
          <template slot-scope="scope">
            {{scope.row.CashAmount.toFixed(2)}}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-row>
</template>

<script>
let date = new Date()

import {
  SaleOrderCollectType,
  FinanceType,
} from '@/enums/merchant'
import { CharacterType, YNStatus } from '@/enums/common'
import {
  STOCKING_API_REPORT_BYSUMMARY,
  STOCKING_API_REPORT_BYSALECOLLECTIONS,
} from '@/apis/stocking'
export default {
  data() {
    return {
      enums: {
        YNStatus,
        CharacterType,
        SaleOrderCollectType,
        FinanceType
      },
      financeType: 0,
      characterId: '',
      dateTime: [
        new Date(Date.parse(date) - 6 * 24 * 60 * 60 * 1000),
        new Date(date)
      ],
      timeEnable: false, // 如果选择日期超过7天，则不能根据销售时间汇总,
      columnValue: [],
      columns: [],
      summary: {
      }, // 销售汇总 统计数据
      data: [],
      toDayTime: '',
      columnsJunk: [
        {
          Name: 'IsGold',
          Text: '类型'
        },
        {
          Name: 'MaterialType',
          Text: '材质'
        },
        {
          Name: 'GoldType',
          Text: '成色'
        }
      ]
    }
  },
  computed: {
    totalPrice() {
      let total = 0
      this.data.forEach(item => {
        if (item.rows === 1) {
          total += item.CashAmount
        }
      })
      this.junkManualData.forEach(item => {
        if (item.rows === 1) {
          total -= item.DeductibleFee
        }
      })
      return total.toFixed(2)
    }
  },
  methods: {
    // 获取销售汇总的数据
    getSummary(parameter) {
      STOCKING_API_REPORT_BYSUMMARY(
        Object.assign(
          {
            ClassifyId: 0,
            DeskId: -1,
            FinanceType: 0
          },
          parameter
        )
      ).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.summary = res.data.Data
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getData(parameter) {
      if (!this.columns.length) {
        this.data = []
        return false
      }
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_REPORT_BYSALECOLLECTIONS(
        Object.assign(
          {
            items: this.columnValue.join(',')
          },
          parameter
        )
      ).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = this.filterCollect(res.data.Data, this.columns, 0)
        } else {
          this.data = []
          this.$message.error(res.data.Message)
        }
      })
    },
    filterCollect(filterData, columns, index, parent) {
      let map = {
      }
      let data = []
      let result = []
      let name = columns[index].Name
      filterData.forEach(item => {
        let flag =
          index === 0
            ? true
            : index === 1
              ? parent[0] === item[columns[index - 1].Name]
              : index === 2
                ? parent[0] === item[columns[index - 2].Name] &&
                  parent[1] === item[columns[index - 1].Name]
                : parent[0] === item[columns[index - 3].Name] &&
                  parent[1] === item[columns[index - 2].Name] &&
                  parent[2] === item[columns[index - 1].Name]
        if (flag) {
          if (map[item[name]] !== item[name]) {
            data.push(
              Object.assign({
              }, item, {
                name: item[name],
                txt:
                  name === 'CreateTime'
                    ? item[name]
                    : name === 'DeskId'
                      ? item['DeskName'] || '仓库'
                      : name === 'ClassifyId'
                        ? item.ClassifyName || '未分组'
                        : name === 'CompanyId'
                          ? item['CompanyName']
                          : name === 'CharacterId'
                            ? item.StoreName
                            : name === 'MainUserId'
                              ? item['MainUser']
                              : name === 'AssistUserId'
                                ? item['AssistUser']
                                : name === 'CashierUserId'
                                  ? item['CashierUser']
                                  : name === 'StoreBarCode'
                                    ? item['StoreBarCode']
                                    : name === 'JunkCode'
                                      ? item['JunkCode']
                                      : name === 'IsGold'
                                        ? item['IsGold'] ===
                                          this.enums.YNStatus.Yes
                                          ? '素金'
                                          : '非素'
                                        : (this.enums[name] &&
                                            this.enums[name].Types[
                                              item[name]
                                            ]) ||
                                          '空',
                data: [item],
                parent:
                  index === 0
                    ? [item[name]]
                    : index === 1
                      ? [item[columns[index - 1].Name], item[name]]
                      : [
                        item[columns[index - 2].Name],
                        item[columns[index - 1].Name],
                        item[name]
                      ]
              })
            )
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
        columns.forEach((c, i) => {
          obj[c.Name] =
            c.Name === name ? item.txt : i === index + 1 ? '合计' : ''
        })
        let children = []
        if (index < columns.length - 1) {
          children = this.filterCollect(
            filterData,
            columns,
            index + 1,
            item.parent
          )
        }
        obj.rows = children.length + 1
        result.push(Object.assign(item, obj, this.getCount(item.data)))
        result = result.concat(children)
      })
      return result
    },
    getCount(data) {
      let obj = {
        SaleNum: 0,
        ApplyAmount: 0,
        CashAmount: 0,
        GoldWeight: 0,
        Weight: 0,
        LabelPrice: 0,
        Quantity: 0,
        RecallGoldPrice: 0,
        RecallPrice: 0,
        RecallFee: 0,
        DeductibleFee: 0
      }
      data.forEach(item => {
        obj.SaleNum += item.SaleNum
        obj.ApplyAmount += item.ApplyAmount
        obj.CashAmount += item.CashAmount
        obj.GoldWeight += item.GoldWeight
        obj.Weight += item.Weight
        obj.LabelPrice += item.LabelPrice
        obj.Quantity += item.Quantity
        obj.RecallGoldPrice += item.RecallGoldPrice
        obj.RecallPrice += item.RecallPrice
        obj.RecallFee += item.RecallFee
        obj.DeductibleFee += item.DeductibleFee
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
    getSummaries(param) {
      const {
        columns, data 
      } = param
      const sums = []
      let len = this.columns.length
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return false
        } else if (index < len) {
          sums[index] = ''
          return false
        }
        const values = data.map(
          item => item.rows === 1 && Number(item[column.property])
        )
        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)
        if (index > len && index < len + 3) {
          sums[index] = sums[index].toFixed(3)
        } else if (index > len) {
          sums[index] = sums[index].toFixed(2)
        }
      })
      return sums
    },
    printCollect() {
      var headstr = `<div style="width: 990px; margin: 0;">
        <div style=" padding-top: 15px; line-height: 28px; font-size: 18px; text-align:center;">销售汇总</div>
        <div style=" font-size: 12px; text-align: center;">销售日期：${this.dateTime[0].getFullYear()}年${this.dateTime[0].getMonth() +
        1}月${this.dateTime[0].getDate()}日--${this.dateTime[1].getFullYear()}年${this.dateTime[1].getMonth() +
        1}月${this.dateTime[1].getDate()}日</div>
        <div style="font-size: 12px;  line-height: 24px; text-align:right;">打印日期：${this.toDayTime.getFullYear()}年${this.toDayTime.getMonth() +
        1}月${this.toDayTime.getDate()}日</div>`
      var footstr = `<style>
      body{
          page-break-before: auto;
          page-break-after: always;
      }
      .el-table{width: 100%; border: 1px solid #ebeef5;}
      .el-table td{font-size: 14px;}
      .collect-tb{width: 990px;}
      .collect-tb .top-tip{border: 1px solid #ebeef5; border-width: 0 1px;}
      .collect-tb .top-tip:first-child{border-width: 1px 1px 0;}
      .collect-tb .top-tip:last-child{border-width: 0 1px 1px;}</style></div>`
      var printData = document.getElementById('printCollect').outerHTML
      document.body.innerHTML = headstr + printData + footstr
      window.print()
      window.location.reload()
    },
    queryChange() {
      let start = Date.parse(this.dateTime[0])
      let end = Date.parse(this.dateTime[1])
      this.timeEnable = parseInt((end - start) / 1000 / 60 / 60 / 24 + 1) > 7
      if (
        this.timeEnable &&
        this.columnValue.indexOf(
          this.enums.SaleOrderCollectType.CreateTime + ''
        ) > -1
      ) {
        this.$message.warning('根据销售时间汇总的日期不能超过7天')
        let date = new Date()
        date =
          date.getFullYear() +
          '/' +
          (date.getMonth() + 1) +
          '/' +
          date.getDate()
        this.dateTime = [
          new Date(Date.parse(date) - 6 * 24 * 60 * 60 * 1000),
          new Date(date)
        ] // 汇总的时间
        return false
      }
      let parameter = {
        CharacterId: this.characterId,
        FinanceType: this.financeType,
        CreateTime1: this.dateTime[0] || '1900-01-01',
        CreateTime2: this.dateTime[1] || '1900-01-01'
      }
      this.getSummary(parameter)
      this.getData(parameter)
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
  beforeMount() {
    var date = new Date()
    this.toDayTime = date
    date =
      date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
    this.dateTime = [
      new Date(Date.parse(date) - 6 * 24 * 60 * 60 * 1000),
      new Date(date)
    ] // 统计的时间
  },
  async mounted() {
    let type = this.enums.SaleOrderCollectType
    await this.getAllType()
    this.columnValue = localStorage.sales
      ? JSON.parse(localStorage.sales)
      : [type.CreateTime + '', type.MaterialType + '', type.GoldType + '']
  },
  watch: {
    columnValue(value) {
      let str = []
      for (let i = 0; i < value.length; i++) {
        let name = Object.keys(this.enums.SaleOrderCollectType).find(
          k => this.enums.SaleOrderCollectType[k] === parseInt(value[i])
        )
        str.push({
          Name: name === 'DeskIds' ? 'DeskId' : name,
          Text: this.enums.SaleOrderCollectType.Types[value[i]]
        })
      }
      this.columns = str
      localStorage.sales = value.length ? JSON.stringify(value) : ''
      this.queryChange()
      // if (this.dateTime && this.dateTime.length) {
      //   let start = Date.parse(this.dateTime[0])
      //   let end = Date.parse(this.dateTime[1])
      //   this.timeEnable = parseInt((end - start) / 1000 / 60 / 60 / 24 + 1) > 7
      // }
    }
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/sass/report.scss';
</style>
