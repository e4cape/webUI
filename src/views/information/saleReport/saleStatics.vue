<template>
  <el-row>
    <div class="m-10 top-line-search">
      <el-select name="TerminalType" v-model="terminalType" placeholder="所有销售来源" @change="queryChange">
        <el-option label="所有销售来源" :value="0"></el-option>
        <el-option v-for="item in enums.TerminalType.TypeArray" :key="item.KeyId" :label="item.Value" :value="parseInt(item.KeyId)"></el-option>
      </el-select>
      <el-select name="SourceType" v-model="sourceType" placeholder="所有货品来源" @change="queryChange">
        <el-option label="所有货品来源" :value="0"></el-option>
        <el-option v-for="item in enums.RetailOrderSellProductSourceType.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId"></el-option>
      </el-select>
      <el-date-picker name="dateTime" v-model="dateTime" :clearable="false" @change="queryChange" :unlink-panels="true" value-format="yyyy-MM-dd" type="daterange" placeholder="选择日期范围" :picker-options="$root.datePickerOptions"></el-date-picker>
      <span style="font-size: 12px; color: red; margin-left: 10px;">选择了销售日期汇总项后日期不能超过7天</span>
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
      <el-button name="btnprintCollect" type="primary" size="mini" @click="printCollect" class="m-l-20">打印当前页</el-button>
    </div>
    <div id="printCollect">
      <el-row class="p-10">
        <el-col :span="12" class="tl"><b>成品销售</b></el-col>
        <el-col :span="12" class="tr">注：负数表示有退货</el-col>
      </el-row>
      <el-table :data="data" show-summary  border :summary-method="getSummaries" :row-style="({row, rowIndex}) => { return row.rows > 1 ? {color: row.index === 0 ? '#000' : row.index === 1 ? 'blue' : '#888', 'font-weight': 'bold'} : {}}" :span-method="rowSpanMethod" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-table-column style="line-align: top;" v-for="(item, index) in columns" :key="index" :prop="item.Name" :label="item.Text"></el-table-column>
        <el-table-column prop="Quantity" label="数量" width="60"></el-table-column>
        <el-table-column prop="Weight" label="货重">
          <template slot-scope="scope">
            {{$root.toFloat(scope.row.Weight, 3)}}g
          </template>
        </el-table-column>
        <el-table-column prop="GoldWeight" label="销售金重">
          <template slot-scope="scope">
            {{$root.toFloat(scope.row.GoldWeight, 3)}}g
          </template>
        </el-table-column>
        <el-table-column prop="LabelPrice" label="标签价">
          <template slot-scope="scope">
            ￥{{$root.toFloat(scope.row.LabelPrice)}}
          </template>
        </el-table-column>
        <el-table-column prop="Price" label="应付金额">
          <template slot-scope="scope">
            ￥{{$root.toFloat(scope.row.Price)}}
          </template>
        </el-table-column>
        <el-table-column prop="CashPrice" label="实付金额">
          <template slot-scope="scope">
            ￥{{$root.toFloat(scope.row.CashPrice)}}
          </template>
        </el-table-column>
      </el-table>
      <el-row class="p-10">
        <el-col :span="12" class="tl"><b>旧货换购（卡券换购）</b></el-col>
        <el-col :span="12" class="tr">注：卡券换购的旧货金额已抵扣在成品实付金额中，总计不再累加</el-col>
      </el-row>
      <el-table :data="junkCouponsData" border show-summary :summary-method="getJunkCouponsSummaries" :row-style="({row, rowIndex}) => { return row.rows > 1 ? {color: row.index === 0 ? '#000' : row.index === 1 ? 'blue' : '#888', 'font-weight': 'bold'} : {}}" :span-method="rowSpanJunkMethod" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-table-column style="line-align: top;" v-for="(item, index) in columnsJunk" :key="index" :prop="item.Name" :label="item.Text"></el-table-column>
        <el-table-column prop="Quantity" label="数量" width="60"></el-table-column>
        <el-table-column prop="Weight" label="货重">
          <template slot-scope="scope">
            {{$root.toFloat(scope.row.Weight, 3)}}g
          </template>
        </el-table-column>
        <el-table-column prop="GoldWeight" label="金重">
          <template slot-scope="scope">
            {{$root.toFloat(scope.row.GoldWeight, 3)}}g
          </template>
        </el-table-column>
        <el-table-column prop="RecallGoldPrice" label="换购金价">
          <template slot-scope="scope">
            {{scope.row.rows > 1 ? '' : '￥' + $root.toFloat(scope.row.RecallGoldPrice)}}
          </template>
        </el-table-column>
        <el-table-column prop="RecallPrice" label="换购金额">
          <template slot-scope="scope">
            ￥{{$root.toFloat(scope.row.RecallPrice)}}
          </template>
        </el-table-column>
        <el-table-column prop="RecallFee" label="折旧工费">
          <template slot-scope="scope">
            ￥{{$root.toFloat(scope.row.RecallFee)}}
          </template>
        </el-table-column>
        <el-table-column prop="DeductibleFee" label="抵扣金额">
          <template slot-scope="scope">
            ￥{{$root.toFloat(scope.row.DeductibleFee)}}
          </template>
        </el-table-column>
      </el-table>
      <el-row class="p-10">
        <el-col :span="12" class="tl"><b>旧货回收（手工添加）</b></el-col>
        <el-col :span="12" class="tr">注：包括收银台添加的旧货和ERP手工添加的旧货</el-col>
      </el-row>
      <el-table :data="junkManualData" show-summary border :summary-method="getJunkManualSummaries" :row-style="({row, rowIndex}) => { return row.rows > 1 ? {color: row.index === 0 ? '#000' : row.index === 1 ? 'blue' : '#888', 'font-weight': 'bold'} : {}}" :span-method="rowSpanJunkMethod" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-table-column style="line-align: top;" v-for="(item, index) in columnsJunk" :key="index" :prop="item.Name" :label="item.Text"></el-table-column>
        <el-table-column prop="Quantity" label="数量" width="60"></el-table-column>
        <el-table-column prop="Weight" label="货重">
          <template slot-scope="scope">
            {{$root.toFloat(scope.row.Weight, 3)}}g
          </template>
        </el-table-column>
        <el-table-column prop="GoldWeight" label="金重">
          <template slot-scope="scope">
            {{$root.toFloat(scope.row.GoldWeight, 3)}}g
          </template>
        </el-table-column>
        <el-table-column prop="RecallGoldPrice" label="回收金价">
          <template slot-scope="scope">
            {{scope.row.rows > 1 ? '' : '￥' + $root.toFloat(scope.row.RecallGoldPrice)}}
          </template>
        </el-table-column>
        <el-table-column prop="RecallPrice" label="回收金额">
          <template slot-scope="scope">
            ￥{{$root.toFloat(scope.row.RecallPrice)}}
          </template>
        </el-table-column>
        <el-table-column prop="RecallFee" label="回收工费">
          <template slot-scope="scope">
            ￥{{$root.toFloat(scope.row.RecallFee)}}
          </template>
        </el-table-column>
        <el-table-column prop="DeductibleFee" label="抵扣金额">
          <template slot-scope="scope">
            ￥{{$root.toFloat(scope.row.DeductibleFee)}}
          </template>
        </el-table-column>
      </el-table>
      <el-row class="p-10">
        <el-col :span="12" class="tl red"><b>总计（成品实付金额－旧货回收抵扣金额）：</b></el-col>
        <el-col :span="12" class="tr red"><b>￥{{totalPrice}}</b></el-col>
      </el-row>
    </div>
  </el-row>
</template>

<script>
let date = new Date()

import {
  CharacterType,
  TerminalType,
  YNStatus
} from '@/enums/common'
import {
  RetailOrderSellProductSourceType
} from '@/enums/order'
import {
  RetailType,
  FinanceType,
  JunkBasicSourceType,
  SettingEnumeratorEnumeratorType
} from '@/enums/stocking'
import {
  STOCKING_API_REPORT_SALE_CHARTBYSALESUMMARYFORSALE,
  STOCKING_API_REPORT_SALE_CHARTBYSALESUMMARYFORJUNK
} from '@/apis/stocking'
import {
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST
} from '@/apis/merchant'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      enums: {
        YNStatus,
        CharacterType,
        RetailOrderSellProductSourceType,
        TerminalType,
        JunkBasicSourceType,
        RetailType,
        FinanceType
      },
      terminalType: 0,
      sourceType: 0,
      dateTime: [
        new Date(Date.parse(date) - 6 * 24 * 60 * 60 * 1000).toJSON().substr(0, 10),
        new Date().toJSON().substr(0, 10)
      ],
      timeEnable: false, // 如果选择日期超过7天，则不能根据销售时间汇总,
      columnValue: [],
      columns: [],
      data: [],
      toDayTime: '',
      junkCouponsData: [], // 汇总旧货换购
      junkManualData: [], // 汇总旧货手工
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
      ],
      GoupBys: {
        'OrderTime': 'OrderTime',
        'GroupTypeDv': 'GroupTypeDv',
        'DeskName': 'DeskName',
        'MaterialType': 'MaterialType',
        'LargeClassTypeEv': 'LargeClassTypeEv',
        'SmallClassTypeEv': 'SmallClassTypeEv',
        'FinanceClassTypeEv': 'FinanceClassTypeEv',
        'CategoryType': 'CategoryType',
        'GoldType': 'GoldType',
        'SeriesTypeEv': 'SeriesTypeEv',
        'StoneClassTypeEv': 'StoneClassTypeEv',
        'RetailType': 'RetailType',
        'FinanceType': 'FinanceType',
        'CashierUser': 'CashierUser',
        'MainUser': 'MainUser',
        'AssistUser': 'AssistUser',
        'CompanyName': 'CompanyName',
        'StoreName': 'StoreName',
        Types: {
          'OrderTime': '销售日期',
          'GroupTypeDv': '柜台分组',
          'DeskName': '柜台',
          'MaterialType': '材质',
          'LargeClassTypeEv': '大类',
          'SmallClassTypeEv': '小类',
          'FinanceClassTypeEv': '财务分类',
          'CategoryType': '品类',
          'GoldType': '成色',
          'SeriesTypeEv': '系列',
          'StoneClassTypeEv': '石类',
          'RetailType': '销售方式',
          'FinanceType': '入库类别',
          'CashierUser': '收银员',
          'MainUser': '主销人员',
          'AssistUser': '辅销人员',
          'CompanyName': '公司',
          'StoreName': '门店',
        }
      },
      smallType: []
    }
  },
  computed: {
    totalPrice() {
      let total = 0
      this.data.forEach(item => {
        if (item.rows === 1) {
          total += item.CashPrice
        }
      })
      this.junkManualData.forEach(item => {
        if (item.rows === 1) {
          total -= item.DeductibleFee
        }
      })
      return this.$root.toFloat(total)
    }
  },
  methods: {
    getData(parameter) {
      if (!this.columns.length) {
        this.data = []
        return false
      }
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_REPORT_SALE_CHARTBYSALESUMMARYFORSALE(
        Object.assign(
          {
            GoupBys: this.columnValue.join(',')
          },
          parameter
        )
      ).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = this.filterCollect(res.data.Data.Rows || [], this.columns, 0)
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
                  name === 'OrderTime'
                    ? item[name]
                    : name === 'DeskName'
                      ? item['DeskName'] || '仓库'
                      : name === 'GroupTypeDv'
                        ? item.GroupTypeDv || '未分组'
                        : name === 'CompanyName'
                          ? item['CompanyName']
                          : name === 'StoreName'
                            ? item['StoreName']
                            : name === 'SeriesTypeEv'
                              ? item['SeriesTypeEv'] || '空'
                              : name === 'StoneClassTypeEv'
                                ? item['StoneClassTypeEv'] || '空'
                                : name === 'LargeClassTypeEv'
                                  ? item['LargeClassTypeEv'] || '空'
                                  : name === 'SmallClassTypeEv'
                                    ? item['SmallClassTypeEv'] || (this.smallType.find(val => val.Id === item['SmallClassTypeEk'])
                                      ? this.smallType.find(val => val.Id === item['SmallClassTypeEk']).Value
                                      : '空')
                                    : name === 'FinanceClassTypeEv'
                                      ? item['FinanceClassTypeEv'] || '空'
                                      : name === 'MainUser'
                                        ? item['MainUser']
                                        : name === 'AssistUser'
                                          ? item['AssistUser']
                                          : name === 'CashierUser'
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
        Quantity: 0,
        Price: 0,
        Weight: 0,
        CashPrice: 0,
        GoldWeight: 0,
        LabelPrice: 0,
        RecallGoldPrice: 0,
        RecallPrice: 0,
        RecallFee: 0,
        DeductibleFee: 0
      }
      data.forEach(item => {
        obj.Quantity += item.Quantity
        obj.Price += item.Price
        obj.Weight += item.Weight
        obj.CashPrice += item.CashPrice
        obj.GoldWeight += item.GoldWeight
        obj.LabelPrice += item.LabelPrice
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
          sums[index] = '成品合计'
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
          sums[index] = this.$root.toFloat(sums[index], 3)
        } else if (index > len) {
          sums[index] = this.$root.toFloat(sums[index], 2)
        }
      })
      return sums
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
    getJunkCouponsSummaries(param) {
      return this.getJunkSummaries(param, '换购合计')
    },
    getJunkManualSummaries(param) {
      return this.getJunkSummaries(param, '回收合计')
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
        } else if (index < 3) {
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
          sums[index] = this.$root.toFloat(sums[index], 3)
        } else if (index > 3) {
          sums[index] = this.$root.toFloat(sums[index], 2)
        }
      })
      return sums
    },
    getJunkData(parameter) {
      // 传参的 sourceType 是 固定的旧货枚举
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_REPORT_SALE_CHARTBYSALESUMMARYFORJUNK(
        parameter
      ).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          // 旧货换购（卡券换购）
          this.junkCouponsData = this.filterCollect(res.data.Data.SwapRows || [], this.columnsJunk, 0)
          // 旧货回收（手工添加）
          this.junkManualData = this.filterCollect(res.data.Data.JunkRows || [], this.columnsJunk, 0)
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    printCollect() {
      var headstr = `<div style="width: 990px; margin: 0;">
        <div style=" padding-top: 15px; line-height: 28px; font-size: 18px; text-align:center;">销售汇总</div>
        <div style=" font-size: 12px; text-align: center;">销售日期：${new Date(this.dateTime[0]).getFullYear()}年${new Date(this.dateTime[0]).getMonth() +
        1}月${new Date(this.dateTime[0]).getDate()}日--${new Date(this.dateTime[1]).getFullYear()}年${new Date(this.dateTime[1]).getMonth() +
        1}月${new Date(this.dateTime[1]).getDate()}日</div>
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
          this.GoupBys.OrderTime + ''
        ) > -1
      ) {
        this.$message.warning('根据销售日期汇总的日期不能超过7天')
        let date = new Date()
        this.dateTime = [
          dayjs(new Date(Date.parse(date) - 6 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD'),
          dayjs(date).format('YYYY-MM-DD')
        ] // 汇总的时间
        return false
      }
      let parameter = {
        SourceType: this.sourceType,
        TerminalType: this.terminalType,
        ClassifyId: -1,
        BeginTime: this.dateTime[0] || '1900-01-01',
        EndTime: this.dateTime[1] || '1900-01-01'
      }
      this.getData(parameter)
      this.getJunkData(parameter)
    },
    async getAllType() {
      await this.setEnumsType('GoldType', 'goldType')
      await this.setEnumsType('MaterialType', 'materialType')
      await this.setEnumsType('CategoryType', 'categoryType')
      await MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({EnumeratorType: SettingEnumeratorEnumeratorType.SmallClassType}).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.smallType = res.data.Data.Rows || []
        }
      })
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
    this.dateTime = [
      dayjs(new Date(Date.parse(date) - 6 * 24 * 60 * 60 * 1000)).format('YYYY-MM-DD'),
      dayjs(date).format('YYYY-MM-DD')
    ] // 统计的时间
  },
  async mounted() {
    let type = this.GoupBys
    await this.getAllType()
    this.columnValue = localStorage.sales
      ? JSON.parse(localStorage.sales)
      : [type.OrderTime, type.MaterialType, type.GoldType]
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
</style>
