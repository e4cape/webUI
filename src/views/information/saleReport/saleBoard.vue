<template>
  <el-row>
    <div class="m-10 top-line-search">
      <el-cascader :options="locationData" change-on-select name="characterId" v-model="characterId" @change="queryChange" :props="props"></el-cascader>
      <el-select name="FinanceType" v-model="financeType" placeholder="所有类别" :filterable="true" @change="queryChange">
        <el-option label="所有类别" :value="0"></el-option>
        <el-option v-for="item in financeTypes.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId"></el-option>
      </el-select>
      <el-select name="TerminalType" v-model="terminalType" placeholder="所有销售来源" @change="queryChange">
        <el-option label="所有销售来源" :value="0"></el-option>
        <el-option v-for="item in terminalTypes.TypeArray" :key="item.KeyId" :label="item.Value" :value="parseInt(item.KeyId)"></el-option>
      </el-select>
      <el-select name="SourceType" v-model="sourceType" placeholder="所有货品来源" @change="queryChange">
        <el-option label="所有货品来源" :value="0"></el-option>
        <el-option v-for="item in retailOrderSellProductSourceTypes.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId"></el-option>
      </el-select>
      <el-date-picker name="dateTime" v-model="dateTime" :clearable="false" @change="queryChange" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker>
      <el-button name="btnprintCurrentPage" type="primary" size="mini" @click="printCurrentPage">打印当前页</el-button>
    </div>
    <div id="printId">
      <el-row :gutter="10" v-loading="dayTotalLoading" class="total-panel">
        <el-col style="width: 44px;">
          <div class="sale-tag sale">
            <span>销售</span>
          </div>
        </el-col>
        <el-col style="width: calc(100% - 44px);">
          <el-row :gutter="10">
            <el-col :span="6">
              <div class="total qty">
                <div class="number">{{saleTotal.Quantity || 0}}</div>
                <div class="name">销量</div>
                <div class="more">
                  <span>销售&nbsp;{{saleTotal.SaleQty || 0}}</span>
                  <span class="line">|</span>
                  <span>退货&nbsp;{{saleTotal.ReturnQty || 0}}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="total weight">
                <div class="number">{{$root.toFloat(saleTotal.GoldWeight, 3) || 0}}g</div>
                <div class="name">销售金重</div>
                <div class="more">
                  <span>销售&nbsp;{{$root.toFloat(saleTotal.SaleGoldWeight, 3) || 0}}g</span>
                  <span class="line">|</span>
                  <span>退货&nbsp;{{$root.toFloat(saleTotal.ReturnGoldWeight, 3) || 0}}g</span>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="total price">
                <div class="number">￥{{$root.toFloat(saleTotal.Price) || 0}}</div>
                <div class="name">销售额（应付）</div>
                <div class="more">
                  <span>销售&nbsp;￥{{$root.toFloat(saleTotal.SalePrice) || 0}}</span>
                  <span class="line">|</span>
                  <span>退货&nbsp;￥{{$root.toFloat(saleTotal.ReturnPrice) || 0}}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="total cashier">
                <div class="number">￥{{$root.toFloat(saleTotal.CashPrice) || 0}}</div>
                <div class="name">销售额（实付）</div>
                <div class="more">
                  <span>销售&nbsp;￥{{$root.toFloat(saleTotal.SaleCashPrice) || 0}}</span>
                  <span class="line">|</span>
                  <span>退货&nbsp;￥{{$root.toFloat(saleTotal.ReturnCashPrice) || 0}}</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-row :gutter="10" v-loading="junkSourceLoading" class="total-panel m-t-10">
        <el-col style="width: 44px;">
          <div class="sale-tag junk">
            <span>旧货回收</span>
          </div>
        </el-col>
        <el-col style="width: calc(100% - 44px);">
          <el-row :gutter="10">
            <el-col :span="6">
              <div class="total qty">
                <div class="number">{{junkTotal.TotalNum || 0}}</div>
                <div class="name">旧货回收件数</div>
                <div class="more">
                  <span>换购&nbsp;{{junkTotal.ChangeNum || 0}}</span>
                  <span class="line">|</span>
                  <span>手工&nbsp;{{junkTotal.ManualNum || 0}}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="total price">
                <div class="number">￥{{$root.toFloat(junkTotal.TotalPrice) || 0}}</div>
                <div class="name">旧货回收金额</div>
                <div class="more">
                  <span>换购&nbsp;￥{{$root.toFloat(junkTotal.ChangePrice) || 0}}</span>
                  <span class="line">|</span>
                  <span>手工&nbsp;￥{{$root.toFloat(junkTotal.ManualPrice) || 0}}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="total weight">
                <div class="number">{{$root.toFloat(junkTotal.TotalWeight, 3) || 0}}g</div>
                <div class="name">旧货回收金重</div>
                <div class="more">
                  <span>换购&nbsp;{{$root.toFloat(junkTotal.ChangeWeight, 3) || 0}}g</span>
                  <span class="line">|</span>
                  <span>手工&nbsp;{{$root.toFloat(junkTotal.ManualWeight, 3) || 0}}g</span>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="total cashier">
                <div class="number">￥{{$root.toFloat(junkTotal.TotalFee) || 0}}</div>
                <div class="name">旧货回收工费</div>
                <div class="more">
                  <span>换购&nbsp;￥{{$root.toFloat(junkTotal.ChangeFee) || 0}}</span>
                  <span class="line">|</span>
                  <span>手工&nbsp;￥{{$root.toFloat(junkTotal.ManualFee) || 0}}</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="twoDaysData">
        <el-col :span="12">
          <div class="top-title">销售分布</div>
          <el-table :data="salesData" v-loading="fianaceLoading">
            <el-table-column prop="RetailType" label="类别" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.RetailType === retailTypes.PieceOf ? '计件' : (scope.row.RetailType > retailTypes.PieceOf ? '计价' : '未知')}}
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" label="销量" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Price" label="销售额(应付)" min-width="80px" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.Price)}}
              </template>
            </el-table-column>
            <el-table-column prop="CashPrice" label="销售额(实付)" min-width="80px" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.CashPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="GoldWeight" label="销售金重" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3)}}g
              </template>
            </el-table-column>
          </el-table>

          <el-table :data="saleMaterialData" v-loading="materialLoading">
            <el-table-column prop="MaterialType" label="材质" min-width="90px" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                {{($store.getters.materialType.Types[scope.row.MaterialType] || '空') + (scope.row.RetailType === retailTypes.PieceOf ? '(计件)' : scope.row.RetailType > retailTypes.PieceOf ? '(计价)' : '(未知)')}}
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" label="销量" min-width="70px" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="Price" label="销售额(应付)" min-width="120px" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.Price)}}
              </template>
            </el-table-column>
            <el-table-column prop="CashPrice" label="销售额(实付)" min-width="120px" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.CashPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="GoldWeight" label="销售金重" min-width="100px" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3)}}g
              </template>
            </el-table-column>
          </el-table>
          <!-- 收银分布 -->
          <div class="top-title m-t-10" v-if="$store.getters.user_session.CharacterType !== characterTypes.Group">收款分布</div>
          <el-table v-if="$store.getters.user_session.CharacterType !== characterTypes.Group" :data="saleCashierData" show-summary :summary-method="getPaymentTotal" v-loading="cashierLoading">
            <el-table-column prop="CashierUser" label="收银员" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.CashierUser ? scope.row.CashierUser : '未知'}}
              </template>
            </el-table-column>
            <el-table-column v-for="(item, index) in  paymentTypes" :key="index" :prop="item.CategoryCode" :label="item.CategoryName" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row[item.CategoryCode])}}
              </template>
            </el-table-column>
          </el-table>
        </el-col>

        <!-- 旧货分布 -->
        <el-col :span="12">
          <div class="top-title">旧货回收分布</div>
          <!-- 类别 -->
          <el-table :data="junkReturnData" v-loading="junkLoading">
            <el-table-column label="类别" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.IsGold === YNStatus.Yes ? '素金' : '非素'}}
              </template>
            </el-table-column>
            <el-table-column prop="JunkNum" label="数量" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoldWeight" label="金重" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column prop="RecallPrice" label="金额" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="RecallFee" label="工费" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallFee)}}
              </template>
            </el-table-column>
          </el-table>
          <!-- 来源 -->
          <el-table :data="junkSourceData" v-loading="junkSourceLoading">
            <el-table-column label="来源" show-overflow-tooltip>
              <template slot-scope="scope">
                {{junkBasicSourceTypes.Types[scope.row.SourceType]}}
              </template>
            </el-table-column>
            <el-table-column prop="JunkNum" label="数量" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoldWeight" label="金重" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column prop="RecallPrice" label="金额" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="RecallFee" label="工费" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallFee)}}
              </template>
            </el-table-column>
          </el-table>
          <!-- 材质 -->
          <el-table :data="junkMaterialData" v-loading="junkMetrialLoading">
            <el-table-column prop="MaterialType" label="材质" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                {{($store.getters.materialType.Types[scope.row.MaterialType] || '空') + (scope.row.IsGold === YNStatus.Yes ? '(按克)' : '(按件)')}}
              </template>
            </el-table-column>
            <el-table-column prop="JunkNum" label="数量" sortable show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoldWeight" label="金重" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column prop="RecallPrice" label="金额" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="RecallFee" label="工费" sortable show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallFee)}}
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </el-row>
</template>

<script>
import {
  CharacterType,
  TerminalType,
  YNStatus,
  PaymentType
} from '@/enums/common'
import {
  FinanceType,
  RetailType,
  StockPositionTypeType,
  JunkBasicSourceType
} from '@/enums/stocking'
import {
  RetailOrderSellProductSourceType
} from '@/enums/order'
import {
  STOCKING_API_REPORT_SALE_CHARTBYSALEBOARD,
  STOCKING_API_REPORT_SALE_CHARTBYJUNKBOARD,
  STOCKING_API_REPORT_SALE_CHARTBYCASHIERUSERBOARD
} from '@/apis/stocking'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      YNStatus,
      dayTotalLoading: false,
      materialLoading: false,
      fianaceLoading: false,
      junkLoading: false,
      junkMetrialLoading: false,
      cashierLoading: false,
      junkSourceLoading: false,
      characterTypes: {
      },
      financeTypes: {
      },
      retailTypes: {
      },
      terminalTypes: {
      },
      junkBasicSourceTypes: {
      },
      retailOrderSellProductSourceTypes: {
      },
      characterId: [0],
      financeType: 0,
      terminalType: 0,
      sourceType: 0,
      dateTime: '',
      toDayTime: '',
      paymentTypes: [],
      saleTotal: {
      },
      junkData: {
      },
      salesData: [],
      saleCashierData: [],
      saleMaterialData: [],
      saleMaterialSort: {
        IsAsced: YNStatus.No,
        OrderBy: 0
      },
      junkTotal: {
        TotalNum: 0,
        TotalPrice: 0,
        TotalWeight: 0,
        TotalFee: 0,
        ChangeNum: 0,
        ChangePrice: 0,
        ChangeWeight: 0,
        ChangeFee: 0,
        ManualNum: 0,
        ManualPrice: 0,
        ManualWeight: 0,
        ManualFee: 0,
      },
      junkMaterialData: [],
      junkSourceData: [],
      junkReturnData: [],
      junkMaterialSort: {
        IsAsced: YNStatus.No,
        OrderBy: 0
      },
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
    returnDeskId(id, id2) {
      // id是分组id,  id2是柜台id
      if (arguments.length === 1) {
        return id <= 0 ? 0 : id
      } else {
        return id <= 0 && !arguments[1] ? id : !id2 ? -1 : id2
      }
    },
    queryChange() {
      let parameter = this.getParameter()
      this.getSale({...parameter, EnumType: 1})
      this.getJunk({...parameter, EnumType: 2})
      this.getJunkData({...parameter, EnumType: 5})
      this.getJunkSourceData({...parameter, EnumType: 6})
      this.getJunkMaterialData({...parameter, EnumType: 7})
      this.getPaymentData({...parameter, EnumType: 8}) // 收款分布
    },
    // 销售
    getSale(parameter) {
      this.materialLoading = true
      STOCKING_API_REPORT_SALE_CHARTBYSALEBOARD(parameter)
        .then(res => {
          this.materialLoading = false
          if (res.data.Code === 'CORRECT') {
            // 材质(销售分布)
            this.saleMaterialData = this.initSaleMaterialData(res.data.Data.Rows1 || [])
            // 类别(销售分布)
            // this.salesData = this.initSalesData(res.data.Data.Rows2 || [])
            this.salesData = res.data.Data.Rows2 || []
            // 销售看板的销售
            this.saleTotal = res.data.Data.Total
          }
        })
        .catch(() => {
          this.materialLoading = false
        })
    },
    // 销售看板的旧货回收
    getJunk(parameter) {
      this.junkSourceLoading = true
      STOCKING_API_REPORT_SALE_CHARTBYJUNKBOARD(parameter)
        .then(res => {
          this.junkSourceLoading = false
          if (res.data.Code === 'CORRECT') {
            let array = res.data.Data.Rows || []
            this.junkTotal.TotalNum = 0
            this.junkTotal.TotalPrice = 0
            this.junkTotal.TotalWeight = 0
            this.junkTotal.TotalFee = 0
            array.forEach(item => {
              this.junkTotal.TotalNum += item.JunkNum
              this.junkTotal.TotalPrice += item.RecallPrice
              this.junkTotal.TotalWeight += item.GoldWeight
              this.junkTotal.TotalFee += item.RecallFee
            })
          }
        })
        .catch(() => {
          this.junkSourceLoading = false
        })
    },
    getJunkData(parameter) {
      // 旧货回收(类别)
      this.junkLoading = true
      STOCKING_API_REPORT_SALE_CHARTBYJUNKBOARD(parameter)
        .then(res => {
          this.junkLoading = false
          if (res.data.Code === 'CORRECT') {
            this.junkReturnData = res.data.Data.Rows || []
          } else {
            this.$message.error(res.data.Message)
          }
        })
        .catch(() => {
          this.junkLoading = false
        })
    },
    getJunkSourceData(parameter) {
      // 旧货回收(来源)
      this.junkSourceLoading = true
      STOCKING_API_REPORT_SALE_CHARTBYJUNKBOARD(parameter)
        .then(res => {
          this.junkSourceLoading = false
          if (res.data.Code === 'CORRECT') {
            this.junkSourceData = res.data.Data.Rows || []
            this.junkTotal.ChangeNum = 0
            this.junkTotal.ChangePrice = 0
            this.junkTotal.ChangeWeight = 0
            this.junkTotal.ChangeFee = 0
            this.junkTotal.ManualNum = 0
            this.junkTotal.ManualPrice = 0
            this.junkTotal.ManualWeight = 0
            this.junkTotal.ManualFee = 0
            this.junkSourceData.forEach(item => {
              if (item.SourceType === this.junkBasicSourceTypes.Coupon) {
                this.junkTotal.ChangeNum += item.JunkNum
                this.junkTotal.ChangePrice += item.RecallPrice
                this.junkTotal.ChangeWeight += item.GoldWeight
                this.junkTotal.ChangeFee += item.RecallFee
              } else if (item.SourceType === this.junkBasicSourceTypes.Manual) {
                this.junkTotal.ManualNum += item.JunkNum
                this.junkTotal.ManualPrice += item.RecallPrice
                this.junkTotal.ManualWeight += item.GoldWeight
                this.junkTotal.ManualFee += item.RecallFee
              }
            })
          }
        })
        .catch(() => {
          this.junkSourceLoading = false
        })
    },
    getJunkMaterialData(parameter) {
      // 旧货回收(材质)
      this.junkMetrialLoading = true
      STOCKING_API_REPORT_SALE_CHARTBYJUNKBOARD(parameter)
        .then(res => {
          this.junkMetrialLoading = false
          if (res.data.Code === 'CORRECT') {
            this.junkMaterialData = res.data.Data.Rows || []
          }
        })
        .catch(() => {
          this.junkMetrialLoading = false
        })
    },
    async getPaymentData(parameter) {
      // 收款分布
      this.paymentTypes = await this.getPaymentTypes()
      this.cashierLoading = true
      STOCKING_API_REPORT_SALE_CHARTBYCASHIERUSERBOARD(parameter)
        .then(async res => {
          this.cashierLoading = false
          if (res.data.Code === 'CORRECT') {
            this.saleCashierData = await this.resetCashierData(res.data.Data.Rows || [])
          }
        })
        .catch(() => {
          this.cashierLoading = false
        })
    },
    resetCashierData(list) {
      return new Promise((resolve) => {
        let arr = []
        let map = []
        list.forEach((item) => {
          if (map.indexOf(item.CashierUserId) < 0) {
            // 如果不存在 创建
            let itemData = {
              CashierUserId: item.CashierUserId,
              all: 0
            }
            map.push(item.CashierUserId)
            itemData.CashierUser = item.CashierUser
            this.paymentTypes.forEach((val) => {
              if (
                item.CategoryName === val.CategoryName &&
                val.CategoryName !== '合计'
              ) {
                itemData[val.CategoryName] = Number(item.CashPrice)
                itemData.all += Number(item.CashPrice)
              } else if (val.CategoryName !== '合计') {
                itemData[val.CategoryName] = 0.00
              }
            })
            arr.push(itemData)
          } else {
            // 存在 修改
            arr.map((res) => {
              if (item.CashierUserId === res.CashierUserId) {
                res.CashierUser = item.CashierUser
                res[item.CategoryName] += Number(item.CashPrice)
                res.all += Number(item.CashPrice)
              }
              return res
            })
          }
        })
        resolve(arr)
      })
    },
    getPaymentTypes() {
      let parameter = this.getParameter()
      return new Promise((resolve) => {
        STOCKING_API_REPORT_SALE_CHARTBYCASHIERUSERBOARD(parameter).then(res => {
          if (res.data.Code === 'CORRECT') {
            let array = res.data.Data.Rows || []
            let paymentType = []
            array.forEach(i => {
              switch (i.PaymentType) {
                case PaymentType.BankPay:
                  if (paymentType.filter(item => {
                    return item.CategoryCode === i.CategoryName
                  }).length !== 0) {
                    break
                  }
                  paymentType.push({
                    CategoryCode: '银行转账',
                    CategoryName: i.CategoryName
                  })
                  break
                case PaymentType.AliPay:
                  if (paymentType.filter(item => {
                    return item.CategoryCode === i.CategoryName
                  }).length !== 0) {
                    break
                  }
                  paymentType.push({
                    CategoryCode: '支付宝',
                    CategoryName: i.CategoryName
                  })
                  break
                case PaymentType.WechatPay:
                  if (paymentType.filter(item => {
                    return item.CategoryCode === i.CategoryName
                  }).length !== 0) {
                    break
                  }
                  paymentType.push({
                    CategoryCode: '微信',
                    CategoryName: i.CategoryName
                  })
                  break
                case PaymentType.UnionPay:
                  if (paymentType.filter(item => {
                    return item.CategoryCode === i.CategoryName
                  }).length !== 0) {
                    break
                  }
                  paymentType.push({
                    CategoryCode: '银联',
                    CategoryName: i.CategoryName
                  })
                  break
                case PaymentType.CashPay:
                  if (paymentType.filter(item => {
                    return item.CategoryCode === i.CategoryName
                  }).length !== 0) {
                    break
                  }
                  paymentType.push({
                    CategoryCode: '现金',
                    CategoryName: i.CategoryName
                  })
                  break
                case PaymentType.CreditPay:
                  if (paymentType.filter(item => {
                    return item.CategoryCode === i.CategoryName
                  }).length !== 0) {
                    break
                  }
                  paymentType.push({
                    CategoryCode: '花呗分期',
                    CategoryName: i.CategoryName
                  })
                  break
                case PaymentType.SysPay:
                  if (paymentType.filter(item => {
                    return item.CategoryCode === i.CategoryName
                  }).length !== 0) {
                    break
                  }
                  paymentType.push({
                    CategoryCode: '系统',
                    CategoryName: i.CategoryName
                  })
                  break
                default:
                  break
              }
            })
            paymentType.push({
              CategoryCode: 'all',
              CategoryName: '合计'
            })
            resolve(paymentType)
          }
        })
      })
    },
    getPaymentTotal(param) {
      // 收银合计
      const {
        columns, data 
      } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }

        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              var num = Number(prev) + Number(curr)
              return parseFloat(num)
            } else {
              return prev
            }
          }, 0)
          sums[index] = this.$root.toFloat(sums[index])
        } else {
          return false
        }
      })
      return sums
    },
    initSaleMaterialData(data) {
      let map = {
      }
      var newData = []
      data.forEach(item => {
        if (
          map[
            this.$store.getters.materialType.Types[item.MaterialType] +
              (item.RetailType === this.retailTypes.PieceOf ? 1 : 3)
          ] &&
          item.RetailType > this.retailTypes.PieceOf
        ) {
          newData.map((res) => {
            if (
              item.MaterialType === res.MaterialType &&
              res.RetailType > this.retailTypes.PieceOf
            ) {
              res.Quantity = parseInt(res.Quantity + item.Quantity)
              res.GoldWeight = res.GoldWeight + item.GoldWeight
              res.Price = res.Price + item.Price
              res.CashPrice = res.CashPrice + item.CashPrice
            }
          })
        } else if (
          map[this.$store.getters.materialType.Types[item.MaterialType] + 0] &&
          item.RetailType === 0
        ) {
          newData.map((res) => {
            if (
              item.MaterialType === res.MaterialType &&
              res.RetailType === 0
            ) {
              res.Quantity = parseInt(res.Quantity + item.Quantity)
              res.GoldWeight = res.GoldWeight + item.GoldWeight
              res.Price = res.Price + item.Price
              res.CashPrice = res.CashPrice + item.CashPrice
            }
          })
        } else {
          newData.push(item)
          map[
            this.$store.getters.materialType.Types[item.MaterialType] +
              (item.RetailType === this.retailTypes.PieceOf
                ? 1
                : item.RetailType > this.retailTypes.PieceOf
                  ? 3
                  : 0)
          ] = 1
        }
      })
      return newData
    },
    saleMaterialSortChange(sort) {
      // 销售分布材质排序
      switch (sort.prop) {
        case 'MaterialType':
          this.saleMaterialSort.OrderBy = 0
          break
        case 'Quantity':
          this.saleMaterialSort.OrderBy = 1
          break
        case 'Price':
          this.saleMaterialSort.OrderBy = 2
          break
        case 'CashPrice':
          this.saleMaterialSort.OrderBy = 3
          break
        case 'GoldWeight':
          this.saleMaterialSort.OrderBy = 4
          break
        default:
          this.saleMaterialSort.OrderBy = 0
          break
      }
      this.saleMaterialSort.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      let parameter = this.getParameter(this.saleMaterialSort)
      this.getSale({...parameter, EnumType: 1})
    },
    junkMaterialSortChange(sort) {
      // 旧货回收分布材质排序
      switch (sort.prop) {
        case 'MaterialType':
          this.junkMaterialSort.OrderBy = 0
          break
        case 'JunkNum':
          this.junkMaterialSort.OrderBy = 1
          break
        case 'GoldWeight':
          this.junkMaterialSort.OrderBy = 2
          break
        case 'RecallPrice':
          this.junkMaterialSort.OrderBy = 3
          break
        case 'RecallFee':
          this.junkMaterialSort.OrderBy = 4
          break
        default:
          this.junkMaterialSort.OrderBy = 0
          break
      }
      this.junkMaterialSort.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      let parameter = this.getParameter(this.junkMaterialSort)
      this.getJunkMaterialData({...parameter, EnumType: 7})
    },
    getParameter(val = {}) {
      let parameter = {
        FinanceType: this.financeType,
        SourceType: this.sourceType,
        TerminalType: this.terminalType,
        BeginTime: this.dateTime,
        EndTime: this.dateTime,
        CompchterId: 0,
        StorechterId: 0,
        ClassifyId: -1,
        DeskId: 0,
        ...val
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
      return parameter
    },
    printCurrentPage() {
      var headstr = `<html><head><title></title></head>
        <style type="text/css">
        body{
          overflow: auto;
        }
        .total-panel{
          width: 1055px;
          margin: 10px 0;
          padding: 0 !important;
        }
        .total-panel .total, .sale-tag {
          border: 1px solid #000;
          color: #000;
        }
        .total-panel .total div , .sale-tag span{
          color: #000;
        }
        .el-table{
          border-bottom: 1px solid #ededed;
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
        <div style="width:1045px; margin: 0;">
          <div style=" padding-top: 15px; line-height: 28px; font-size: 18px; text-align:center;">销售看板</div>
          <div style=" font-size: 12px; text-align: center;">销售日期：${new Date(this.dateTime).getFullYear()}年${new Date(this.dateTime).getMonth() +
          1}月${new Date(this.dateTime).getDate()}日</div>
          <div style="font-size: 12px; line-height: 24px; text-align:right;">
            打印日期：${this.toDayTime.getFullYear()}年${this.toDayTime.getMonth() + 1}月${this.toDayTime.getDate()}日
          </div>
        </div>
      `
      var footstr = '</body>'
      var printData = document.getElementById('printId').innerHTML
      document.body.innerHTML =
        headstr +
        printData
          .replace(/<colgroup>.*?<\/colgroup>/g, '') +
        footstr
      window.print()
      window.location.reload()
    }
  },
  created() {
  },
  beforeMount() {
    this.financeTypes = FinanceType
    this.retailTypes = RetailType
    this.characterTypes = CharacterType
    this.terminalTypes = TerminalType
    this.junkBasicSourceTypes = JunkBasicSourceType
    this.retailOrderSellProductSourceTypes = RetailOrderSellProductSourceType
  },
  mounted() {
    this.dateTime = dayjs(new Date()).format('YYYY-MM-DD')
    this.toDayTime = new Date()
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

