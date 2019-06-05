<template>
  <el-row>
    <div class="tabs">
      <span class="tab active" name="saleBoard">
        成品进销存
      </span>
    </div>
    <div class="panel">
      <div class="m-10 top-line-search">
        <el-cascader placeholder="所有位置" :options="$store.getters.classify_and_desks" change-on-select name="characterId" v-model="characterId" @change="queryChange" v-if="$store.getters.user_session.CharacterType == enums.CharacterType.Store"></el-cascader>
        <el-select name="financeType" v-model="financeType" placeholder="所有类别" @change="queryChange">
          <el-option label="所有类别" :value="0"></el-option>
          <el-option v-for="(item,index) in enums.FinanceType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
        </el-select>
        <el-date-picker name="dateTime" v-model="dateTime" :clearable="false" @change="queryChange" :unlink-panels="true" type="daterange" placeholder="选择时间范围" :picker-options="$root.datePickerOptions"></el-date-picker>
      </div>
      <el-row :gutter="20" class="total-panel">
        <el-col :span="8">
          <div class="total qty">
            <div class="number">{{summary.TotalSaleNum || 0}}</div>
            <div class="name">期末结存数量</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="total weight">
            <div class="number">{{summary.TotalGoldWeight || 0}}g</div>
            <div class="name">期末结存金重</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="total price">
            <div class="number">￥{{summary.TotalApplyAmount || 0}}</div>
            <div class="name">期末结存金额(标签价)</div>
          </div>
        </el-col>
      </el-row>
      <div class=" title m-10 m-t-20">
        进销存明细
      </div>
      <el-table :data="junkManualData" show-summary border :summary-method="getJunkManualSummaries" :row-style="({row, rowIndex}) => { return row.rows > 1 ? {color: row.index === 0 ? '#000' : row.index === 1 ? 'blue' : '#888', 'font-weight': 'bold'} : {}}" :span-method="rowSpanJunkMethod" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-table-column style="line-align: top;" v-for="(item, index) in columnsJunk" :key="index" :prop="item.Name" :label="item.Text"></el-table-column>
        <el-table-column label="期初库存">
          <el-table-column prop="Quantity" label="数量" width="60"></el-table-column>
          <el-table-column prop="GoldWeight" label="金重" width="70">
            <template slot-scope="scope">
              {{scope.row.GoldWeight.toFixed(3)}}
            </template>
          </el-table-column>
          <el-table-column prop="Quantity" label="标签价" width="60"></el-table-column>
        </el-table-column>
        <el-table-column label="本期入库">
          <el-table-column label="采购入库">
            <el-table-column prop="Quantity" label="数量" width="60"></el-table-column>
            <el-table-column prop="GoldWeight" label="金重" width="70">
              <template slot-scope="scope">
                {{scope.row.GoldWeight.toFixed(3)}}
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" label="标签价" width="60"></el-table-column>
          </el-table-column>
          <el-table-column label="售后退货">
            <el-table-column prop="Quantity" label="数量" width="60"></el-table-column>
            <el-table-column prop="GoldWeight" label="金重" width="70">
              <template slot-scope="scope">
                {{scope.row.GoldWeight.toFixed(3)}}
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" label="标签价" width="60"></el-table-column>
          </el-table-column>
          <el-table-column label="调拨入库">
            <el-table-column prop="Quantity" label="数量" width="60"></el-table-column>
            <el-table-column prop="GoldWeight" label="金重" width="70">
              <template slot-scope="scope">
                {{scope.row.GoldWeight.toFixed(3)}}
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" label="标签价" width="60"></el-table-column>
          </el-table-column>
          <el-table-column label="旧货转成成品">
            <el-table-column prop="Quantity" label="数量" width="60"></el-table-column>
            <el-table-column prop="GoldWeight" label="金重" width="70">
              <template slot-scope="scope">
                {{scope.row.GoldWeight.toFixed(3)}}
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" label="标签价" width="60"></el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本期出库">
          <el-table-column label="零售">
            <el-table-column prop="Quantity" label="数量" width="60"></el-table-column>
            <el-table-column prop="GoldWeight" label="金重" width="70">
              <template slot-scope="scope">
                {{scope.row.GoldWeight.toFixed(3)}}
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" label="标签价" width="60"></el-table-column>
          </el-table-column>
          <el-table-column label="采购退货">
            <el-table-column prop="Quantity" label="数量" width="60"></el-table-column>
            <el-table-column prop="GoldWeight" label="金重" width="70">
              <template slot-scope="scope">
                {{scope.row.GoldWeight.toFixed(3)}}
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" label="标签价" width="60"></el-table-column>
          </el-table-column>
          <el-table-column label="调拨出库">
            <el-table-column prop="Quantity" label="数量" width="60"></el-table-column>
            <el-table-column prop="GoldWeight" label="金重" width="70">
              <template slot-scope="scope">
                {{scope.row.GoldWeight.toFixed(3)}}
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" label="标签价" width="60"></el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本期调整">
          <el-table-column label="报损">
            <el-table-column prop="Quantity" label="数量" width="60"></el-table-column>
            <el-table-column prop="GoldWeight" label="金重" width="70">
              <template slot-scope="scope">
                {{scope.row.GoldWeight.toFixed(3)}}
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" label="标签价" width="60"></el-table-column>
          </el-table-column>
          <el-table-column label="报溢">
            <el-table-column prop="Quantity" label="数量" width="60"></el-table-column>
            <el-table-column prop="GoldWeight" label="金重" width="70">
              <template slot-scope="scope">
                {{scope.row.GoldWeight.toFixed(3)}}
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" label="标签价" width="60"></el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="库存结余">
          <el-table-column prop="Quantity" label="数量" width="60"></el-table-column>
          <el-table-column prop="GoldWeight" label="金重" width="70">
            <template slot-scope="scope">
              {{scope.row.GoldWeight.toFixed(3)}}
            </template>
          </el-table-column>
          <el-table-column prop="Quantity" label="标签价" width="60"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </el-row>
</template>

<script>
let date = new Date()

import {
  YNStatus,
  SaleOrderCollectType,
  RetailOrderMasterTerminalType,
  RetailType,
  FinanceType,
  JunkBasicSourceType
} from '@/enums/merchant'
import {
  CharacterType
} from '@/enums/common'
import {
  STOCKING_API_REPORT_BYSALECOLLECTIONS,
  STOCKING_API_REPORT_GETJUNKBASICCOLLECTIONS,
  STOCKING_API_REPORT_BYPROFITSUMMARY
} from '@/apis/stocking'
export default {
  data() {
    return {
      enums: {
        YNStatus,
        CharacterType,
        SaleOrderCollectType,
        RetailOrderMasterTerminalType,
        RetailType,
        FinanceType
      },
      financeType: 0,
      terminalType: 0,
      characterId: '',
      productSourceType: 0,
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
      junkManualData: [], // 汇总旧货手工
      columnsJunk: [
        {
          Name: 'IsGold',
          Text: '类型'
        },
        {
          Name: 'MaterialType',
          Text: '材质'
        }
      ]
    }
  },
  methods: {
    returnDeskId(id, id2) {
      if (arguments.length === 1) {
        return id <= 0 ? 0 : id
      } else {
        return id <= 0 && !arguments[1] ? id : !id2 ? -1 : id2
      }
    },
    getSummary(parameter) {
      // 利润概括
      STOCKING_API_REPORT_BYPROFITSUMMARY(parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.summary = res.data.Data
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
                                          : '镶嵌'
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
          obj[c.Name] = item.txt
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
    rowSpanJunkMethod({
      row, columnIndex 
    }) {
      if (columnIndex < this.columnsJunk.length) {
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
    getJunkManualSummaries(param) {
      return this.getJunkSummaries(param, '合计')
    },
    getJunkSummaries(param, text) {
      const {
        columns, data 
      } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = text
          return false
        } else if (index < 2) {
          sums[index] = ''
          return false
        } else if (index === 6) {
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
        if (index > 3 && index < 6) {
          sums[index] = sums[index].toFixed(3)
        } else if (index > 3) {
          sums[index] = sums[index].toFixed(2)
        }
      })
      return sums
    },
    getJunkData(parameter, sourceType, name) {
      // 传参的 sourceType 是 固定的旧货枚举
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_REPORT_GETJUNKBASICCOLLECTIONS(
        Object.assign(
          {
            ProductSourceType: sourceType
          },
          parameter
        )
      ).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this[name] = this.filterCollect(res.data.Data, this.columnsJunk, 0)
        } else {
          this.$message.error(res.data.Message)
        }
      })
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
        SourceType: this.productSourceType,
        TerminalType: this.terminalType,
        CreateTime1: this.dateTime[0] || '1900-01-01',
        CreateTime2: this.dateTime[1] || '1900-01-01'
      }
      this.getSummary(parameter)
      this.getData(parameter)
      this.getJunkData(parameter, JunkBasicSourceType.Manual, 'junkManualData') // 手工添加
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
  created() {
    this.$store.dispatch('GET_MATERIAL_TYPE')
    this.$store.dispatch('GET_CLASSIFY_DESKS')
  },
  beforeMount() {
    var date = new Date()
    date = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
    if (this.$store.getters.user_session.CharacterType == CharacterType.Company) {
      this.dateTime = [
        new Date(date),
        new Date(date)
      ]
    } else {
      this.dateTime = [
        new Date(Date.parse(date) - 6 * 24 * 60 * 60 * 1000),
        new Date(date)
      ] // 明细的时间
    }
    this.characterId = [-1]
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
      if (this.dateTime && this.dateTime.length) {
        let start = Date.parse(this.dateTime[0])
        let end = Date.parse(this.dateTime[1])
        this.timeEnable = parseInt((end - start) / 1000 / 60 / 60 / 24 + 1) > 7
      }
    }
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/sass/report.scss';
.title {
  font-size: 16px;
  font-weight: 700;
  color: #169BD5;
}
</style>
