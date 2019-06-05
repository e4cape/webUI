<template>
  <el-row>
    <div class="m-10 top-line-search">
      <el-cascader :options="locationData" change-on-select name="characterId" v-model="characterId" @change="queryChange" :props="props"></el-cascader>
      <el-select name="TerminalType" v-model="terminalType" placeholder="所有销售来源" @change="queryChange">
        <el-option label="所有销售来源" :value="0"></el-option>
        <el-option v-for="item in enums.TerminalType.TypeArray" :key="item.KeyId" :label="item.Value" :value="parseInt(item.KeyId)"></el-option>
      </el-select>
      <el-select name="SourceType" v-model="sourceType" placeholder="所有货品来源" @change="queryChange">
        <el-option label="所有货品来源" :value="0"></el-option>
        <el-option v-for="item in enums.RetailOrderSellProductSourceType.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId"></el-option>
      </el-select>
      <el-date-picker name="dateTime" v-model="dateTime" :clearable="false" @change="queryChange" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
      <el-button name="btnprintCollect" size="mini" type="primary" @click="printCollect" >打印当前页</el-button>
    </div>
    <div id="printCollect">
      <el-row class="m-10">
        <el-col :span="12" class="tl"><b>成品销售</b></el-col>
        <el-col :span="12" class="tr">注：负数表示有退货</el-col>
      </el-row>
      <el-table :data="data" show-summary border :summary-method="getSummary" :row-style="({row, rowIndex}) => { return row.rows > 1 ? {color: row.index === 0 ? '#000' : row.index === 1 ? 'blue' : '#888', 'font-weight': 'bold'} : {}}" :span-method="rowSpanMethod" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-table-column style="vertical-align: top;" v-for="(item, index) in columns" :key="index" :prop="item.Name" :label="item.Text"></el-table-column>
        <!-- <el-table-column prop="GoodsName" label="货品名称">
          <template slot-scope="scope">
            {{scope.row.rows === 1 ? scope.row.GoodsName : ''}}
          </template>
        </el-table-column> -->
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
        <el-table-column prop="LabelPrice" label="标签价">
          <template slot-scope="scope">
            ￥{{$root.toFloat(scope.row.LabelPrice)}}
          </template>
        </el-table-column>
        <el-table-column prop="ShouldPrice" label="应付金额">
          <template slot-scope="scope">
            ￥{{$root.toFloat(scope.row.ShouldPrice)}}
          </template>
        </el-table-column>
        <el-table-column prop="CashPrice" label="实付金额">
          <template slot-scope="scope">
            ￥{{$root.toFloat(scope.row.CashPrice)}}
          </template>
        </el-table-column>
      </el-table>
      <el-row class="m-10">
        <el-col :span="12" class="tl"><b>旧货换购（卡券换购）</b></el-col>
        <el-col :span="12" class="tr">注：卡券换购的旧货金额已抵扣在成品实付金额中，总计不再累加</el-col>
      </el-row>
      <el-table :data="collectJunkCouponsData" border show-summary :summary-method="getJunkCouponsSummaries" :row-style="({row, rowIndex}) => { return row.rows > 1 ? {color: row.index === 0 ? '#000' : row.index === 1 ? 'blue' : '#888', 'font-weight': 'bold'} : {}}" :span-method="rowSpanJunkMethod" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-table-column style="vertical-align: top;" v-for="(item, index) in columnsJunk" :key="index" :prop="item.Name" :label="item.Text"></el-table-column>
        <el-table-column prop="JunkName" label="旧货名称">
          <template slot-scope="scope">
            {{scope.row.rows === 1 ? scope.row.JunkName : ''}}
          </template>
        </el-table-column>
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
      <el-row class="m-10">
        <el-col :span="12" class="tl"><b>旧货回收（手工添加）</b></el-col>
        <el-col :span="12" class="tr">注：包括收银台添加的旧货和ERP手工添加的旧货</el-col>
      </el-row>
      <el-table :data="collectJunkManualData" border show-summary :summary-method="getJunkManualSummaries" :row-style="({row, rowIndex}) => { return row.rows > 1 ? {color: row.index === 0 ? '#000' : row.index === 1 ? 'blue' : '#888', 'font-weight': 'bold'} : {}}" :span-method="rowSpanJunkMethod" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-table-column style="vertical-align: top;" v-for="(item, index) in columnsJunk" :key="index" :prop="item.Name" :label="item.Text"></el-table-column>
        <el-table-column prop="JunkName" label="旧货名称">
          <template slot-scope="scope">
            {{scope.row.rows === 1 ? scope.row.JunkName : ''}}
          </template>
        </el-table-column>
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
        <el-col :span="12" class="tr red"><b>￥{{totalDayPrice}}</b></el-col>
      </el-row>
    </div>
  </el-row>
</template>

<script>
import {
  CharacterType,
  TerminalType,
  YNStatus
} from '@/enums/common'
import {
  RetailOrderSellProductSourceType,
} from '@/enums/order'
import {
  StockPositionTypeType,
} from '@/enums/stocking'
import {
  STOCKING_API_REPORT_SALE_CHARTBYSALEDAYLYFORSALE,
  STOCKING_API_REPORT_SALE_CHARTBYSALEDAYLYFORJUNK
} from '@/apis/stocking'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      enums: {
        CharacterType,
        YNStatus,
        TerminalType,
        RetailOrderSellProductSourceType
      },
      characterId: [0],
      dateTime: '',
      terminalType: 0,
      sourceType: 0,
      data: [],
      toDayTime: '',
      columns: [
        {
          Name: 'MaterialType',
          Text: '材质'
        },
        {
          Name: 'GoldType',
          Text: '成色'
        },
        {
          Name: 'CategoryType',
          Text: '品类'
        },
        {
          Name: 'StoreBarCode',
          Text: '条码'
        },
        {
          Name: 'GoodsName',
          Text: '货品名称'
        }
      ],
      collectJunkCouponsData: [], // 日报旧货换购
      collectJunkManualData: [], // 日报旧货手工
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
        },
        {
          Name: 'JunkCode',
          Text: '旧货编码'
        }
      ],
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
  computed: {
    totalDayPrice() {
      let total = 0
      this.data.forEach(item => {
        if (item.rows === 1) {
          total += item.CashPrice
        }
      })
      this.collectJunkManualData.forEach(item => {
        if (item.rows === 1) {
          total -= item.DeductibleFee
        }
      })
      return this.$root.toFloat(total)
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
    queryChange() {
      let parameter = {
        SourceType: this.sourceType,
        TerminalType: this.terminalType,
        BeginTime: this.dateTime,
        EndTime: this.dateTime,
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
            parameter.StorechterId = this.characterId[0] ? this.characterId[0] : 0
            parameter.CompchterId = 0
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
      this.getData(parameter)
      // 成品销售
      this.getJunkBasic(parameter) // 卡券换购、手工添加
    },
    getData(parameter) {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_REPORT_SALE_CHARTBYSALEDAYLYFORSALE(parameter).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = this.filterCollect(res.data.Data.Rows || [], this.columns, 0)
        } else {
          this.data = []
          this.$message.error(res.data.Message)
        }
      })
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
    getSummary(param) {
      const {
        columns, data 
      } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '成品合计'
          return false
        } else if (index < 5) {
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
        if (index > 5 && index < 8) {
          sums[index] = this.$root.toFloat(sums[index], 3)
        } else if (index > 5) {
          sums[index] = this.$root.toFloat(sums[index], 2)
        }
      })
      return sums
    },
    printCollect() {
      var headstr = `<div style="width: 990px; margin: 0;">
        <div style=" padding-top: 15px; line-height: 28px; font-size: 18px; text-align:center;">销售日报</div>
        <div style=" font-size: 12px; text-align: center;">销售日期：${new Date(this.dateTime).getFullYear()}年${new Date(this.dateTime).getMonth() +
        1}月${new Date(this.dateTime).getDate()}日</div>
        <div style="font-size: 12px;  line-height: 24px; text-align:right;">打印日期：${this.toDayTime.getFullYear()}年${this.toDayTime.getMonth() +
        1}月${this.toDayTime.getDate()}日</div>`
      var footstr = `<style>
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
    getJunkBasic(parameter) {
      // 传参的 sourceType 是 固定的旧货枚举
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_REPORT_SALE_CHARTBYSALEDAYLYFORJUNK(parameter).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          // 旧货换购（卡券换购）
          this.collectJunkCouponsData = this.filterCollect(res.data.Data.SwapRows || [], this.columnsJunk, 0)
          // 旧货回收（手工添加）
          this.collectJunkManualData = this.filterCollect(res.data.Data.JunkRows || [], this.columnsJunk, 0)
        } else {
          this.$message.error(res.data.Message)
        }
      })
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
        } else if (index < 5) {
          sums[index] = ''
          return false
        } else if (index === 8) {
          sums[index] = ''
          return false
        }
        const values = data.map(item => item.rows === 1 && Number(item[column.property]))
        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0)
        if (index > 5 && index < 8) {
          sums[index] = this.$root.toFloat(sums[index], 3)
        } else if (index > 5) {
          sums[index] = this.$root.toFloat(sums[index], 2)
        }
      })
      return sums
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
                : index === 3
                  ? parent[0] === item[columns[index - 3].Name] &&
                    parent[1] === item[columns[index - 2].Name] &&
                    parent[2] === item[columns[index - 1].Name]
                  : parent[0] === item[columns[index - 4].Name] &&
                    parent[1] === item[columns[index - 3].Name] &&
                    parent[2] === item[columns[index - 2].Name] &&
                    parent[3] === item[columns[index - 1].Name]
        if (flag) {
          if (map[item[name]] !== item[name]) {
            data.push(
              Object.assign({
              }, item, {
                name: item[name],
                txt:
                  name === 'StoreBarCode'
                    ? item['StoreBarCode']
                    : name === 'GoodsName'
                      ? item['GoodsName']
                      : name === 'JunkCode'
                        ? item['JunkCode']
                        : name === 'IsGold'
                          ? item['IsGold'] === this.enums.YNStatus.Yes
                            ? '素金'
                            : '非素'
                          : this.enums[name] && this.enums[name].Types[item[name]] || '空',
                data: [item],
                parent:
                  index === 0
                    ? [item[name]]
                    : index === 1
                      ? [item[columns[index - 1].Name], item[name]]
                      : index === 2
                        ? [
                          item[columns[index - 2].Name],
                          item[columns[index - 1].Name],
                          item[name]
                        ]
                        : [
                          item[columns[index - 3].Name],
                          item[columns[index - 2].Name],
                          item[columns[index - 1].Name],
                          item[name]
                        ]
              })
            )
            map[item[name]] = item[name]
          } else {
            data.forEach(d => {
              if (d.name === item[name] ) {
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
        ShouldPrice: 0,
        CashPrice: 0,
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
        obj.ShouldPrice += item.ShouldPrice
        obj.CashPrice += item.CashPrice
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
  },
  async mounted() {
    this.dateTime = dayjs(new Date()).format('YYYY-MM-DD')
    this.toDayTime = new Date()
    await this.getAllType()
    this.queryChange()
  },
  watch: {
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/sass/report.scss';
</style>
