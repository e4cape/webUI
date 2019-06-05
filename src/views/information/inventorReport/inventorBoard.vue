<template>
  <el-row>
    <div class="m-10 top-line-search">
      <!-- <el-cascader placeholder="所有公司" :options="$store.getters.company_and_stores" change-on-select name="characterId" v-model="characterId" @change="queryChange" v-if="$store.getters.user_session.CharacterType == characterTypes.Group" :props="{value: 'CharacterId', label:'Name', children:'Stores'}"></el-cascader>
      <el-select name="characterId" v-model="characterId" placeholder="所有门店" @change="queryChange" v-if="$store.getters.user_session.CharacterType == characterTypes.Company">
        <el-option v-for="item in $store.getters.stores" :key="item.CharacterId" :label="item.Name" :value="parseInt(item.CharacterId)"> </el-option>
      </el-select> -->
      <el-cascader :options="locationData" change-on-select name="characterId" v-model="characterId" @change="queryChange" :props="props"></el-cascader>
      <el-select name="financeType" v-model="financeType" placeholder="所有类别" @change="queryChange">
        <el-option label="所有类别" :value="0"></el-option>
        <el-option v-for="(item,index) in financeTypes.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
      </el-select>
      <el-button name="btnprintCurrentPage" type="primary" size="mini" @click="printCurrentPage" class="m-l-20">打印当前页</el-button>
    </div>
    <div id="printId">
      <el-row :gutter="20" v-loading="totalLoading" class="total-panel">
        <el-col :span="6">
          <div class="total qty">
            <div class="number">{{total.FinanceQty || 0}}</div>
            <div class="name">总件数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total weight">
            <div class="number">{{$root.toFloat(total.Weight, 3) || 0}}g</div>
            <div class="name">总货重</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total weight">
            <div class="number">{{$root.toFloat(total.GoldWeight, 3) || 0}}g</div>
            <div class="name">总金重</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="total cashier">
            <div class="number">￥{{$root.toFloat(total.LabelPrice) || 0}}</div>
            <div class="name">标签价总金额</div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="twoDaysData p-10">
        <el-col :span="12">
          <div class="p-10 tc top-title">销售方式分布</div>
          <el-table :data="salesData" v-loading="table1Loading">
            <el-table-column prop="RetailType" label="销售方式" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.RetailType === retailTypes.PieceOf ? '计件' : '计价'}}
              </template>
            </el-table-column>
            <el-table-column prop="FinanceQty" label="件数" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight" label="货重(g)" min-width="110" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.Weight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column prop="GoldWeight" label="金重(g)" min-width="110" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column prop="LabelPrice" label="标签价(元)" min-width="110" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.LabelPrice)}}
              </template>
            </el-table-column>
          </el-table>

          <div class="p10"></div>
          <div class="p-10 tc top-title no-border">材质分布</div>
          <el-table :data="materialData" v-loading="table3Loading">
            <el-table-column prop="MaterialType" label="材质" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$store.getters.materialType.Types[scope.row.MaterialType] || '空'}} {{scope.row.RetailType === retailTypes.PieceOf ? '(计件)' : '(计价)'}}
              </template>
            </el-table-column>
            <el-table-column prop="FinanceQty" label="件数" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight" label="货重(g)" min-width="110" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.Weight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column prop="GoldWeight" label="金重(g)" min-width="110" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column prop="LabelPrice" label="标签价(元)" min-width="110" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.LabelPrice)}}
              </template>
            </el-table-column>
          </el-table>

        </el-col>
        <el-col :span="12">
          <div class="p-10 tc top-title">品类分布</div>
          <el-table :data="categoryData" v-loading="table2Loading">
            <el-table-column label="品类" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$store.getters.categoryType.Types[scope.row.CategoryType] || '空'}}
              </template>
            </el-table-column>
            <el-table-column prop="FinanceQty" label="件数" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight" label="货重(g)" min-width="110" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.Weight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column prop="GoldWeight" label="金重(g)" min-width="110" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column prop="LabelPrice" label="标签价(元)" min-width="110" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.LabelPrice)}}
              </template>
            </el-table-column>
          </el-table>

          <div class="p10"></div>
          <div class="p-10 tc top-title no-border">成色分布</div>
          <el-table :data="goldData" v-loading="table4Loading">
            <el-table-column prop="GoldType" label="成色" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$store.getters.goldType.Types[scope.row.GoldType] || '空'}}
              </template>
            </el-table-column>
            <el-table-column prop="FinanceQty" label="件数" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight" label="货重(g)" min-width="110" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.Weight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column prop="GoldWeight" label="金重(g)" min-width="110" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column prop="LabelPrice" label="标签价(元)" min-width="110" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.LabelPrice)}}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div class="p10"></div>
    </div>
  </el-row>
</template>

<script>
import {
  CharacterType,
  YNStatus
} from '@/enums/common'
import {
  FinanceType,
  GoodsStockWarehousePositionType,
  RetailType,
  SettingDictionaryDictType
} from '@/enums/stocking'
import {
  STOCKING_API_REPORT_GOODS_STOCK_CHARTBYSTOCKDISTRIBUTION,
} from '@/apis/stocking'
import {
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST
} from '@/apis/merchant.js'
export default {
  data() {
    return {
      characterTypes: {
      },
      financeTypes: {
      },
      retailTypes: {
      },
      totalLoading: false,
      table1Loading: false,
      table2Loading: false,
      table3Loading: false,
      table4Loading: false,
      characterId: [0],
      financeType: 0,
      total: {
      }, // 合计
      salesData: [],
      categoryData: [],
      materialData: [],
      goldData: [],
      props: {
        value: 'Id',
        label: 'Value',
        children: 'Childrens'
      },
      locationData: [],
    }
  },
  methods: {
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
      this.getStockQtyMaterialDistribution({...parameter, EnumType: 1})
      this.getStockQtyCategoryDistribution({...parameter, EnumType: 2})
      this.getStockQtyGoldDistribution({...parameter, EnumType: 3})
      this.getStockQtyDistributionSummary({...parameter, EnumType: 4})
    },
    // 看板start
    // getTotal(parameter) {
    //   // 上方红蓝绿数据
    //   this.totalLoading = true
    //   STOCKING_API_REPORT_GOODS_STOCK_CHARTBYSTOCKDISTRIBUTION(parameter).then(res => {
    //     if (res.data.Code === 'CORRECT') {
    //       this.total = res.data.Data
    //     } else {
    //       this.$message.error(res.data.Message)
    //     }
    //     this.totalLoading = false
    //   })
    // },
    getStockQtyDistributionSummary(parameter) {
      // 销售方式分析
      this.table1Loading = true
      STOCKING_API_REPORT_GOODS_STOCK_CHARTBYSTOCKDISTRIBUTION(parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.salesData = res.data.Data.Rows || []
          this.total = res.data.Data
        } else {
          this.$message.error(res.data.Message)
        }
        this.table1Loading = false
      })
    },
    getStockQtyMaterialDistribution(parameter) {
      // 材质分析
      this.table3Loading = true
      STOCKING_API_REPORT_GOODS_STOCK_CHARTBYSTOCKDISTRIBUTION(parameter).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.materialData = this.initMaterialData(res.data.Data.Rows || [])
          } else {
            this.$message.error(res.data.Message)
          }
          this.table3Loading = false
        }
      )
    },
    initMaterialData(data) {
      var newData = []
      data.forEach(item => {
        var oldData = newData.filter(function(value) {
          // 获取 某材质个数
          return value.MaterialType === item.MaterialType && value
        })
        var length = oldData.length
        if (length < 2) {
          // 如果是材质第一次添加 type == all
          item.RetailType = item.RetailType
          item.FinanceQty = parseInt(item.FinanceQty)
          item.Weight = parseFloat(item.Weight)
          item.GoldWeight = parseFloat(item.GoldWeight)
          item.LabelPrice = parseFloat(item.LabelPrice)
          if (!oldData[0]) {
            newData.push(item)
          } else if (
            oldData[0].RetailType > this.retailTypes.PieceOf &&
            item.RetailType === this.retailTypes.PieceOf &&
            length === 1
          ) {
            newData.push(item)
          } else if (
            oldData[0].RetailType === this.retailTypes.PieceOf &&
            item.RetailType > this.retailTypes.PieceOf &&
            length === 1
          ) {
            newData.push(item)
          }
        }
        if (length >= 1 && item.RetailType !== this.retailTypes.PieceOf) {
          // 如果第二次添加  且length有2条  类型属于计价 type > 1
          newData.forEach((res) => {
            if (
              res.RetailType !== this.retailTypes.PieceOf &&
              item.MaterialType === res.MaterialType &&
              res !== item
            ) {
              res.RetailType = item.RetailType
              res.FinanceQty = parseInt(res.FinanceQty + item.FinanceQty)
              res.Weight =
                parseFloat(res.Weight) + parseFloat(item.Weight)
              res.GoldWeight =
                parseFloat(res.GoldWeight) + parseFloat(item.GoldWeight)
              res.LabelPrice =
                parseInt(res.LabelPrice) + parseInt(item.LabelPrice)
            }
          })
        }
      })
      return newData
    },
    getStockQtyCategoryDistribution(parameter) {
      // 品类分析
      this.table2Loading = true
      STOCKING_API_REPORT_GOODS_STOCK_CHARTBYSTOCKDISTRIBUTION(parameter).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.categoryData = res.data.Data.Rows || []
          } else {
            this.$message.error(res.data.Message)
          }
          this.table2Loading = false
        }
      )
    },
    getStockQtyGoldDistribution(parameter) {
      // 成色分析
      this.table4Loading = true
      STOCKING_API_REPORT_GOODS_STOCK_CHARTBYSTOCKDISTRIBUTION(parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goldData = res.data.Data.Rows || []
        } else {
          this.$message.error(res.data.Message)
        }
        this.table4Loading = false
      })
    },
    getDeskName(characterId) {
      let DeskName = '', fatherArr = [], sonArr = []
      this.locationData.some(item => {
        if (item.Id === characterId[0]) {
          fatherArr = item.Childrens
        }
      })
      switch (characterId[0]) {
        case 0:
          DeskName = '所有位置'
          break
        case GoodsStockWarehousePositionType.Warehouse:
          DeskName = '所有总部仓库'
          if (characterId[1]) {
            fatherArr.some(item => {
              if (item.Id === characterId[1]) {
                sonArr = item.Childrens
                DeskName += '&nbsp;&nbsp/&nbsp;&nbsp;' + item.Value
              }
            })
            if (characterId[2]) {
              sonArr.some(item => {
                if (item.Id === characterId[2]) {
                  DeskName += '&nbsp;&nbsp/&nbsp;&nbsp;' + item.Value
                }
              })
            }
          }
          break
        case GoodsStockWarehousePositionType.Store:
          DeskName = '门店'
          if (characterId[1]) {
            fatherArr.some(item => {
              if (item.Id === characterId[1]) {
                DeskName += '&nbsp;&nbsp/&nbsp;&nbsp;' + item.Value
              }
            })
          }
          break
        case 2:
          DeskName = '柜台未分组'
          if (characterId[1]) {
            fatherArr.some(item => {
              if (item.Id === characterId[1]) {
                DeskName += '&nbsp;&nbsp/&nbsp;&nbsp;' + item.Value
              }
            })
          }
          break
        default:
          if (this.$store.getters.user_session.CharacterType == CharacterType.Group) {
            DeskName = '公司'
            if (characterId[1]) {
              fatherArr.some(item => {
                if (item.Id === characterId[1]) {
                  DeskName += '&nbsp;&nbsp/&nbsp;&nbsp;' + item.Value
                }
              })
            }
          } else {
            this.locationData.some(item => {
              if (item.Id === characterId[0]) {
                sonArr = item.Childrens
                DeskName = item.Value
              }
            })
            if (characterId[1]) {
              sonArr.some(item => {
                if (item.Id === characterId[1]) {
                  DeskName += '&nbsp;&nbsp/&nbsp;&nbsp;' + item.Value
                }
              })
            }
          }
          break
      }
      return DeskName
    },
    printCurrentPage() {
      let date = new Date()
      let DeskName = this.getDeskName(this.characterId)
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
          width: 100% !important;
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
        <div class="print-title">库存看板&nbsp;&nbsp;&nbsp;${date.getFullYear()}-${date.getMonth() +
        1}-${date.getDate()}</div>
        <div style="font-size: 16px; width: 1075px; text-align: center;">${DeskName ||
          '所有位置'}</div>`
      var footstr = '</body>'
      var printData = document.getElementById('printId').innerHTML
      document.body.innerHTML =
        headstr +
        printData.replace(/<colgroup>.*?<\/colgroup>/g, '') +
        footstr
      window.print()
      window.location.reload()
    },
    getLocation() {
      this.locationData = [{'KeyId': 0, 'Value': '所有位置'}].concat(GoodsStockWarehousePositionType.TypeArray)
      this.locationData.map(item => {
        item['Id'] = item['KeyId']
        return item
      })
      if (this.$store.getters.user_session.CharacterType == CharacterType.Company) {
        this.$store.dispatch('GET_WAREHOUSES_DROPLIST').then(res => {
          this.locationData.forEach(item => {
            if (item.Id === GoodsStockWarehousePositionType.Warehouse) {
              console.log(item)
              item.Value = '所有总部仓库'
              item.Childrens = res
            }
          })
        })
        this.$store.dispatch('GET_STORES_DROPLIST').then(res => {
          let store = res, tmp
          store.map(item => {
            tmp = item['CharacterId']
            item['CharacterId'] = item['Id']
            item['Id'] = tmp
            return item
          })
          this.locationData.forEach(item => {
            if (item.Id === GoodsStockWarehousePositionType.Store) {
              item.Value = '所有门店'
              item.Childrens = store
            }
          })
        })
      }
      if (this.$store.getters.user_session.CharacterType == CharacterType.Group) {
        this.locationData = this.locationData.filter(item => {
          return item.Id === 0
        })
        this.$store.dispatch('GET_COMPANYS_DROPLIST', {HasStore: YNStatus.Yes, State: 0}).then(res => {
          let company = res, tmp, childTmp
          company.map(val => {
            tmp = val['CharacterId']
            val['CharacterId'] = val['Id']
            val['Id'] = tmp
            if (val.Childrens) {
              val.Childrens.map(item => {
                childTmp = item['CharacterId']
                item['CharacterId'] = item['Id']
                item['Id'] = childTmp
              })
            }
          })
          this.locationData = this.locationData.concat(company)
        })
      }
      if (this.$store.getters.user_session.CharacterType == CharacterType.Store) {
        this.locationData = this.locationData.filter(item => {
          return item.Id === 0
        })
        this.$store.dispatch('GET_DESKS_DROPLIST', {GroupTypeDk: 0, State: 0}).then(res => {
          this.locationData({'Id': 2, 'Value': '未分组柜台'})
          this.locationData.forEach(item => {
            if (item.Id === 2) {
              item.Childrens = res
            }
          })
        })
        let desks
        MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
          DictType: SettingDictionaryDictType.DeskBasicGroupType,
          State: YNStatus.Yes
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            desks = res.data.Data.Rows
            desks.forEach(item => {
              this.$store.dispatch('GET_DESKS_DROPLIST', {GroupTypeDk: item.Id, State: 0}).then(response => {
                item.Childrens = response.length === 0 ? null : response
              })
            })
            this.locationData.splice(this.locationData.length - 1, 0, ...desks)
          }
        })
      }
    }
  },
  beforeMount() {
    this.financeTypes = FinanceType
    this.retailTypes = RetailType
    this.characterTypes = CharacterType
    this.getLocation()
  },
  mounted() {
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

