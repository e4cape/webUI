<template>
  <div class="content">
    <el-row :gutter="10">
      <!-- 新建门店 -->
      <!-- <el-col :span="24" v-if="totalSummary<=0 && totalSummary !== null">
        <div class="noHas clearfix">
          <div class="fl light">
            <span>
              <img src="@/assets/images/first_open_success.png" alt>
            </span>
          </div>
          <div class="fl title clearfix">
            <div class="fl text">
              <p>您已开通总部管理中心，欢迎您！在这里您可以管理公司旗下的所有门店。</p>
              <p>您尚未创建门店，请前往门店管理创建门店，并建立门店管理账户。您可以为门店免费开通ERP系统、薪酬绩效系统、积分卡券系统等。</p>
            </div>
            <div class="fr create_btn" v-if="!isOneNumberManyShopCompany">
              <el-button type="primary" @click="$router.push({path:'/setter/store/index' })">创建门店</el-button>
            </div>
          </div>
        </div>
      </el-col> -->
      <!--  end 新建门店 -->

      <el-col :span="18">
        <div class="gift" v-if="$store.getters.wechatSettingType == companyBasicMountType.Company">
          <div class="gift-sms">
            <img src="@/assets/images/home-sms.png" alt>
            <div class="balance">
              <div class="balance-item">
                <div class="balance-label">短信余额（条）：</div>
                <div class="balance-value">{{accountSummary.balance || 0}}</div>
              </div>
              <div class="balance-item">
                <div class="balance-label">待发送（条）：</div>
                <div class="balance-value">{{accountSummary.pendingSendCount || 0}}</div>
              </div>
            </div>
            <el-button type="primary" @click="smsShow">充值</el-button>
            <el-button @click="sysLogsVisibleShow">充值记录</el-button>
          </div>
          <div class="gift-sms">
            <img src="@/assets/images/home-gift.png" alt>
            <div class="balance">
              <div class="balance-item">
                <div class="balance-label">礼品余额（元）：</div>
                <div class="balance-value">￥{{balanceStatistic.balance || 0}}</div>
              </div>
              <div class="balance-item">
                <div class="balance-label">近30天日均消费：</div>
                <div class="balance-value">￥{{balanceStatistic.averageExpend || 0}}</div>
              </div>
            </div>
            <el-button type="primary" @click="giftVisible = true">充值</el-button>
            <el-button @click="giftLogsVisibleShow">充值记录</el-button>
          </div>
        </div>
        <!-- <div class="panel home-init" v-if="!(isOneNumberManyShopCompany || isOneNumberManyShop || isOneNumberOneStore)">
          <div class="panel-hd">
            <span class="title">概况</span>
          </div>
          <div class="panel-bd">
            <div class="sale-data pd-between">
              <el-row :gutter="10">
                <el-col :span="14">
                  <el-row :gutter="10">
                    <el-col :span="8">
                      <div class="sale_list">
                        <div class="number">{{storeNum.StoreCount}}</div>
                        <div class="saleName">门店总数</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="sale_pink">
                        <div class="number">{{memberStatistics.fansCount}}</div>
                        <div class="saleName">粉丝总数</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="sale_storeAll">
                        <div class="number">{{memberStatistics.memberCount}}</div>
                        <div class="saleName">会员总数</div>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="10">
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <div class="sale_number">
                        <div class="number">{{saleNum.SaleTotalNum}}</div>
                        <div class="saleName">总销量</div>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="sale_room">
                        <div class="number">{{saleNum.SaleTotalCashPrice}}</div>
                        <div class="saleName">总销量额</div>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </div>
        </div> -->
        <div class="panel home-init">
          <div class="panel-hd">
            <span class="title">昨日新增</span>
          </div>
          <div class="panel-bd">
            <div class="sale-data pd-between">
              <el-row :gutter="10">
                <el-col :span="14">
                  <el-row :gutter="10">
                    <el-col :span="8">
                      <div class="sale_list">
                        <div class="number">{{storeNum.YdayStoreCount}}</div>
                        <div class="saleName">新增门店</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="sale_pink">
                        <div class="number">{{memberStatistics.fansIncrease}}</div>
                        <div class="saleName">新增粉丝</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div class="sale_storeAll">
                        <div class="number">{{memberStatistics.memberIncrease}}</div>
                        <div class="saleName">新增会员</div>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="10">
                  <el-row :gutter="10">
                    <el-col :span="12">
                      <div class="sale_number">
                        <div class="number">{{saleNum.TSaleTotalNum}}</div>
                        <div class="saleName">新增销量</div>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="sale_room">
                        <div class="number">{{$root.toFloat(saleNum.TSaleTotalCashPrice)}}</div>
                        <div class="saleName">新增销量额</div>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div class="panel home-init">
          <div class="panel-hd">
            <span class="title">近15天零售情况</span>
          </div>
          <div class="panel-bd">
            <el-row>
              <div class="home-chart" v-loading="canvasLoading">
                <ECharts :options="chartDatas" autoResize></ECharts>
              </div>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="panel init-panel home-init">
          <div class="panel-hd">
            <span class="title">本月销量排行 TOP10</span>
          </div>
          <div class="panel-bd">
            <ul class="rankings">
              <template v-for="(item,index) in rankings">
                <li v-if="index < 10" :key="index">
                  <i class="number" :class="'number' + (parseInt(index) + 1)">{{index+1}}</i>
                  <span class="store-name">{{item.Value}}</span>
                </li>
              </template>
            </ul>
          </div>
        </div>
        <div class="panel init-panel home-init">
          <div class="panel-hd">
            <span class="title">本月销售额排行 TOP10</span>
          </div>
          <div class="panel-bd">
            <ul class="rankings">
              <template v-for="(item,index) in rankings">
                <li v-if="index < 10" :key="index">
                  <i class="number" :class="'number' + (parseInt(index) + 1)">{{index+1}}</i>
                  <span class="store-name">{{item.Value}}</span>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="充值" :visible.sync="smsVisible" width="600px" custom-class="informs">
      <el-form label-width="130px" style="margin-top: 10px;" :rules="rules" :model="smsForm" ref="form">
        <el-form-item label="商品名称：">
          <span>短信</span>
        </el-form-item>
        <el-form-item label="套餐（条）：" prop="count">
          <el-radio-group v-model="smsForm.count">
            <el-radio @click="countIndex = index + 1" :label="item.count" v-for="(item,index) in storeRechargeSetting" :key="index" border>{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="金额：">
          <span>￥{{price + '（'+ (unitPrice || 0) + '元/条）'}}</span>
        </el-form-item>
        <el-form-item label="支付方式：">
          <span>微信支付</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="$store.getters.is_loading" @click="smsFormSub">确定</el-button>
        <el-button @click="smsVisible =  false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="充值" :visible.sync="giftVisible" width="600px" custom-class="informs">
      <el-form label-width="130px" style="margin-top: 10px;" :model="giftForm" ref="form">
        <el-form-item label="充值金额：">
          <el-input maxlength="9" v-model="giftForm.price" @keyup.native="giftForm.price = $root.toFixed(giftForm.price, 0)" style="width: 150px;"></el-input>
          <span>&nbsp;元&nbsp;只能充值整数，最低充值金额为{{minPrice}}元</span>
        </el-form-item>
        <el-form-item label>
          <el-radio-group v-model="giftForm.price">
            <!-- <el-radio :label="minPrice">{{minPrice}}</el-radio> -->
            <template v-for="(item, index) in allPrices">
              <el-radio v-if="minPrice <= item" :key="index" :label="item">{{item}}</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="支付方式：">
          <span>微信支付</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="$store.getters.is_loading" @click="giftFormSub">确定</el-button>
        <el-button @click="giftVisible =  false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="充值二维码" :visible.sync="qrCodeVisible" width="400px" custom-class="informs">
      <div class="qrcode-box">
        <div class="pay-price">应付金额：￥{{qrCodeInfo.amount}}</div>
        <div class="qrcode">
          <img class="pay" :src="qrCodeInfo.qrCode" alt>
          <img src="@/assets/images/pay1.png" alt>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="$store.getters.is_loading" @click="getQueryOrder">完成支付</el-button>
        <el-button @click="qrCodeVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="短信充值记录" :visible.sync="sysLogsVisible" width="900px" custom-class="select-dialog">
      <el-form :model="smsFormLog" class="fix-w">
        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="下单时间：">
              <el-date-picker :picker-options="$root.datePickerOptions" :editable="false" v-model="smsFormLog.checkTime" :unlink-panels="true" type="daterange"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="订单号：">
              <el-input v-model="smsFormLog.orderId" type="text" @keyup.enter.native="search"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="search">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="sysLogsData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-table-column prop="createTime" label="下单时间" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderId" label="订单号" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="goodsName" label="商品名称" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="smsCount" label="购买条数" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="price" label="单价（元）" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="amount" label="金额（元）" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="statusText" label="状态" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="payTypeText" label="支付方式" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="payTime" label="支付时间" min-width="80" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- @module 分页组件 -->
      <pagination :pg="smsFormLog.pageIndex" :size="smsFormLog.pageSize" :total="smsTotal" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      <!-- End 分页组件 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sysLogsVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog title="礼品充值记录" :visible.sync="giftLogsVisible" width="900px" custom-class="select-dialog">
      <el-form :model="giftFormLog" class="fix-w">
        <el-row :gutter="10">
          <el-col :span="10">
            <el-form-item label="下单时间：">
              <el-date-picker :picker-options="$root.datePickerOptions" :editable="false" v-model="giftFormLog.checkTime" :unlink-panels="true" type="daterange"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="订单号：">
              <el-input v-model="giftFormLog.orderId" type="text" @keyup.enter.native="giftSearch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="giftSearch">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="giftLogsData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-table-column prop="createTime" label="下单时间" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderId" label="订单号" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="price" label="充值金额" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createUser" label="操作人" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="statusText" label="状态" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="payTypeText" label="支付方式" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="payTime" label="支付时间" min-width="80" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- @module 分页组件 -->
      <pagination :pg="giftFormLog.pageIndex" :size="giftFormLog.pageSize" :total="giftTotal" @currentChange="currChange" @sizeChange="pageSizeChange"></pagination>
      <!-- End 分页组件 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="giftLogsVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  GIFTING_API_ORDERRECHARGE_RECHARGE,
  GIFTING_API_STATISTIC_GETBALANCESTATISTIC,
  GIFTING_API_ORDERRECHARGE_QUERYORDER,
  GIFTING_API_ORDERRECHARGE_GETRECHARGESETTING,
  GIFTING_API_ORDERRECHARGE_GETRECHARGEITEMS
} from '@/apis/gifting'
import { CompanyBasicMountType } from '@/enums/merchant'
import { CharacterType } from '@/enums/common'
import {
  MESSAGE_API_STOREBALANCE_GETSTOREACCOUNTSUMMARY,
  MESSAGE_API_SETTINGGLOBAL_GETSTORERECHARGESETTING,
  MESSAGE_API_ORDERRECHARGE_RECHARGE,
  MESSAGE_API_ORDERRECHARGE_SEARCHLIST,
  MESSAGE_API_ORDERRECHARGE_QUERYORDER
} from '@/apis/message'
import {
  MERCHANT_API_STORE_BASIC_GETCOUNT,
  MERCHANT_API_DROPDOWN_STORELIST,
  MERCHANT_API_STORE_BASIC_HOME
} from '@/apis/merchant.js'
import {
  STOCKING_API_REPORT_SALE_ANALYSISBYSALEBOARD4,
} from '@/apis/stocking.js'
import {
  ORDER_API_RETAIL_ORDER_MASTER_SUMMAYBYPERSALE,
} from '@/apis/order.js'
import {
  MEMBERSHIP_API_REPORT_GETMEMBERSTATISTICSFORHOME
} from '@/apis/membership.js'

import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legendScroll'
import pagination from '@/components/pagination.vue'
import dayjs from 'dayjs'

export default {
  components: {
    ECharts,
    pagination
  },
  data() {
    return {
      CharacterType,
      companyBasicMountType: CompanyBasicMountType,
      accountSummary: {
        balance: '',
        pendingSendCount: ''
      },
      rules: {
        count: {
          required: true,
          message: '请选择套餐',
          trigger: 'change'
        }
      },
      giftForm: {
        price: ''
      },
      smsForm: {
        count: '',
        countIndex: 0,
        Department: ''
      },
      smsFormLog: {
        checkTime: [],
        pageSize: 10,
        orderId: '',
        pageIndex: 1
      },
      giftFormLog: {
        checkTime: [],
        pageSize: 10,
        orderId: '',
        pageIndex: 1
      },
      allPrices: [5000, 10000, 20000, 50000, 100000],
      price: 0,
      minPrice: 0,
      unitPrice: 0,
      smsTotal: 0,
      giftTotal: 0,
      smsVisible: false,
      giftVisible: false,
      qrCodeVisible: false,
      giftLogsVisible: false,
      sysLogsVisible: false,
      sysLogsData: [],
      giftLogsData: [],
      qrCodeInfo: {},
      storeRechargeSetting: [],
      balanceStatistic: {},
      hasStore: false,
      chartDatas: {},
      rankings: [],
      totalSummary: null,
      lastSummary: null,
      saleNum: {
        SaleTotalNum: 0,
        SaleTotalCashPrice: 0,
        TSaleTotalNum: 0,
        TSaleTotalCashPrice: 0,
      },
      memberStatistics: {}, // member统计
      storeNum: {}, // 门店统计
      canvasLoading: false,
      homeCompanyCode: '',
      HOME_CHART: {
        color: ['#e66969', '#a1a1a1', '#54aae5', '#e5323e'],
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['销售', '退货', '实销'],
          bottom: '5%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '13%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '销售',
            type: 'bar',
            barWidth: '10%',
            data: []
          },
          {
            name: '退货',
            type: 'bar',
            barWidth: '10%',
            data: []
          },
          {
            name: '实销',
            type: 'bar',
            barWidth: '10%',
            data: []
          }
        ]
      }
    }
  },
  methods: {
    getAccountSummary() {
      MESSAGE_API_STOREBALANCE_GETSTOREACCOUNTSUMMARY().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.accountSummary = res.data.Data
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    async getStoreBasicTotal() {
      let param = {
        OpenTime1: dayjs(new Date()).format('YYYY-MM-DD hh:mm:ss'),
        OpenTime2: dayjs(new Date()).format('YYYY-MM-DD hh:mm:ss')
      }
      let date = dayjs(new Date(new Date() - 24 * 60 * 60 * 1000)).format(
        'YYYY-MM-DD hh:mm:ss'
      )
      let param1 = {
        OpenTime1: date,
        OpenTime2: date
      }
      let results = await Promise.all([
        MERCHANT_API_STORE_BASIC_GETCOUNT(param),
        MERCHANT_API_STORE_BASIC_GETCOUNT(param1)
      ])
      if (results[0].data.Code === 'CORRECT') {
        this.lastSummary = results[1].data.Data
        this.totalSummary = results[0].data.Data
        if (results[0].data.Data <= 0) {
          this.hasStore = true
        }
      }
    },
    getMinPrice() {
      GIFTING_API_ORDERRECHARGE_GETRECHARGESETTING().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.minPrice = res.data.Data.recharge.minimum
        }
      })
    },
    getMemberStatistics() {
      MEMBERSHIP_API_REPORT_GETMEMBERSTATISTICSFORHOME().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.memberStatistics = res.data.Data || {}
        }
      })
    },
    getStoreNum() {
      MERCHANT_API_STORE_BASIC_HOME().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.storeNum = res.data.Data
        }
      })
    },
    getStoreBasicTotal2() {
      ORDER_API_RETAIL_ORDER_MASTER_SUMMAYBYPERSALE().then(res => {
        if (res.data.Code === 'CORRECT') {
          let data = res.data.Data
          this.saleNum = data
          if (data.SaleNum <= 0) {
            this.hasStore = true
          }
        }
      })
    },
    dropDownList() {
      MERCHANT_API_DROPDOWN_STORELIST({}).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.rankings = res.data.Data.Rows
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    initOptions(data) {
      let options = this.HOME_CHART
      let xAxis = []
      let dateArr = []
      let seriesData = [[], [], []]
      let dates = {}
      let dates1 = {} // 销售额分两条统计线
      let start = Date.parse(this.timeSituation[0])
      let end = Date.parse(this.timeSituation[1])
      for (let d = start; d <= end; d += 24 * 60 * 60 * 1000) {
        let key = dayjs(d).format('YYYY-MM-DD')
        dateArr.push(key)
        dates[key] = 0
        dates1[key] = 0
      }
      data.forEach(res => {
        dates[res.EnumTypeName] = res.SaleQty
        dates1[res.EnumTypeName] = res.ReturnQty
      })
      dateArr.forEach(item => {
        xAxis.push(item.substr(5))
        seriesData[0].push(dates[item])
        seriesData[1].push(dates1[item])
        seriesData[2].push(dates[item] - dates1[item])
      })
      // for (let t in dates) {
      //   xAxis.push(t.substr(5))
      //   seriesData[0].push(dates[t])
      //   seriesData[1].push(dates1[t])
      //   seriesData[2].push(dates[t] - dates1[t])
      // }
      options.xAxis.data = xAxis
      options.series[0].data = seriesData[0]
      options.series[1].data = seriesData[1]
      options.series[2].data = seriesData[2]
      this.chartDatas = options
    },
    getSaleData() {
      let date = new Date()
      date = date - (date % (24 * 60 * 60 * 1000))
      this.timeSituation = [
        this.$options.filters.filterAllDate(date - 14 * 24 * 60 * 60 * 1000),
        this.$options.filters.filterAllDate(date)
      ] // 明细的时间
      STOCKING_API_REPORT_SALE_ANALYSISBYSALEBOARD4({
        EnumType: 5, // 销售看板
        TerminalType: 0,
        BeginTime: this.timeSituation[0],
        EndTime: this.timeSituation[1],
        ReturnState: 0,
        ClassifyId: -1,
        SourceType: 0,
        FinanceType: 0
      })
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.initOptions(res.data.Data.Rows || [])
          } else {
            this.$message.error(res.data.Message)
          }
          this.canvasLoading = false
        })
        .catch(() => {
          this.canvasLoading = false
        })
    },
    gethomeCompanyCode() {
      this.homeCompanyCode = window.localStorage.getItem('companyCode')
    },
    sysLogsVisibleShow() {
      this.sysLogsVisible = true
      if (!this.sysLogsData.length) {
        this.getSmsLogs()
      }
    },
    getBalanceStatistic() {
      GIFTING_API_STATISTIC_GETBALANCESTATISTIC().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.balanceStatistic = res.data.Data
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    giftFormSub() {
      if (!this.giftForm.price) {
        this.$message.error('请输入充值金额！')
        return
      } else if (parseFloat(this.giftForm.price) < parseFloat(this.minPrice)) {
        this.$message.error('请输入不小于最低金额的充值金额！')
        return
      }
      this.giftVisible = false
      GIFTING_API_ORDERRECHARGE_RECHARGE({
        price: this.giftForm.price
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.qrCodeInfo = Object.assign(res.data.Data, {
            type: 'gift'
          }) // 区分是短信还是礼品
          this.qrCodeVisible = true
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    smsFormSub() {
      this.smsVisible = false
      MESSAGE_API_ORDERRECHARGE_RECHARGE({
        count: this.smsForm.count
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.qrCodeInfo = Object.assign(res.data.Data, {
            type: 'sms'
          }) // 区分是短信还是礼品
          this.qrCodeVisible = true
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getSmsLogs() {
      let time = this.smsFormLog.checkTime || ['', '']
      MESSAGE_API_ORDERRECHARGE_SEARCHLIST({
        endTime: time[1],
        pageSize: this.smsFormLog.pageSize,
        orderId: this.smsFormLog.orderId,
        pageIndex: this.smsFormLog.pageIndex,
        storeAdministratorId: '',
        storeName: '',
        startTime: time[0]
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.sysLogsData = res.data.Data.rows
          this.smsTotal = res.data.Data.total
        }
      })
    },
    getStoreRechargeSetting() {
      MESSAGE_API_SETTINGGLOBAL_GETSTORERECHARGESETTING().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.storeRechargeSetting = res.data.Data.packages
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getGiftLogs() {
      let time = this.giftFormLog.checkTime || ['', '']
      GIFTING_API_ORDERRECHARGE_GETRECHARGEITEMS({
        createTimeEnd: time[1],
        pageSize: this.giftFormLog.pageSize,
        orderId: this.giftFormLog.orderId,
        pageIndex: this.giftFormLog.pageIndex,
        createTimeStart: time[0]
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.giftLogsData = res.data.Data.rows
          this.giftTotal = res.data.Data.total
        }
      })
    },
    currChange(val) {
      this.giftFormLog.pageIndex = val
      this.getGiftLogs()
    },
    pageSizeChange(val) {
      this.giftFormLog.pageIndex = 1
      this.giftFormLog.pageSize = val
      this.getGiftLogs()
    },
    giftSearch() {
      this.giftFormLog.pageIndex = 1
      this.getGiftLogs()
    },
    currentChange(val) {
      this.smsFormLog.pageIndex = val
      this.getSmsLogs()
    },
    sizeChange(val) {
      this.smsFormLog.pageIndex = 1
      this.smsFormLog.pageSize = val
      this.getSmsLogs()
    },
    search() {
      this.smsFormLog.pageIndex = 1
      this.smsFormLog.pageSize = 10
      this.getSmsLogs()
    },
    smsShow() {
      this.smsVisible = true
      if (!this.storeRechargeSetting.length) {
        this.getStoreRechargeSetting()
      }
    },
    countChange() {
      this.storeRechargeSetting.forEach(item => {
        if (this.smsForm.count == item.count) {
          this.unitPrice = item.unitPrice
          this.price = item.price
        }
      })
    },
    getQueryOrder() {
      this.qrCodeVisible = false
      const isGift = this.qrCodeInfo.type === 'gift'
      let api = isGift
        ? GIFTING_API_ORDERRECHARGE_QUERYORDER
        : MESSAGE_API_ORDERRECHARGE_QUERYORDER
      api({
        orderId: this.qrCodeInfo.orderId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data.status == 1) {
            this.$message.error('待支付')
          } else {
            this.$message.success(
              '支付成功，' +
              (isGift ? res.data.Data.price : res.data.Data.amount) +
              '元'
            )
          }
        } else {
          this.$message.error(res.data.Message)
        }
        isGift ? this.getBalanceStatistic() : this.getAccountSummary()
      })
    },
    giftLogsVisibleShow() {
      this.giftLogsVisible = true
      this.getGiftLogs()
    }
  },
  beforeCreate() {
    const type = this.$store.getters.user_session.CharacterType
    switch (type) {
      case CharacterType.Lingcb:
        this.$router.replace({
          path: '/home/platform'
        })
        break
      case CharacterType.Group:
        this.$router.replace({
          path: '/home/group'
        })
        break
      case CharacterType.Store:
        this.$router.replace({
          path: '/home'
        })
        break
      case CharacterType.Supplier:
        this.$router.replace({
          path: '/home/supplier'
        })
        break
      case CharacterType.Provider:
        this.$router.replace({
          path: '/home/provider'
        })
        break
      default:
    }
  },
  beforeMount() {
    this.dropDownList()
    if (
      this.$store.getters.wechatSettingType ==
      this.companyBasicMountType.Company
    ) {
      this.getAccountSummary()
      this.getBalanceStatistic()
    }
  },
  watch: {
    'smsForm.count': 'countChange'
  },
  mounted() {
    this.gethomeCompanyCode()
    this.getStoreBasicTotal()
    this.getStoreBasicTotal2()
    this.getMemberStatistics()
    this.getStoreNum()
    this.getSaleData()
    this.getMinPrice()
  }
}
</script>

<style lang="scss" spoced>
.panel {
  margin-bottom: 10px;
}
.noHas {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  .light {
    width: 60px;
    height: 60px;
    span {
      width: 100%;
      height: 100%;
      display: block;
      img {
        margin: 6px;
        vertical-align: top;
        width: 48px;
        height: 48px;
      }
    }
  }
  .title {
    width: calc(100% - 80px);
    height: 60px;
    line-height: 30px;
    color: #222;
    font-size: 14px;
    .text {
      max-width: 86%;
      p {
        width: 100%;
        padding-left: 10px;
        text-align: left;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .create_btn {
      overflow: hidden;
      width: 14%;
      height: 60px;
      padding: 9px 0;
      .btn {
        width: 100%;
        height: 42px;
      }
    }
  }
}

.guide-wapper {
  margin-top: 10px;
  p {
    margin: 0;
  }
  .guide {
    width: 100%;
    .title {
      height: 40px;
      padding: 0 10px;
      line-height: 40px;
      border-bottom: solid 1px #ddd;
      background-color: #f5f5f5;
      text-align: left;
    }
    .guide-list {
      padding: 10px;
      overflow: hidden;
      margin: 0 auto;
      background-color: #fff;
      div:nth-child(1) {
        background-image: url('../../assets/images/guide1.png');
      }
      div:nth-child(3) {
        background-image: url('../../assets/images/guide2.png');
      }
      div:nth-child(5) {
        background-image: url('../../assets/images/guide3.png');
      }
      div:nth-child(7) {
        background-image: url('../../assets/images/guide4.png');
      }
      div {
        font-size: 12px;
        border-radius: 5px;
        border: 1px solid #dddddd;
        padding: 14px 0 9px 91px;
        min-height: 90px;
        background: #f5f5f5;
        width: calc(20.5%);
        float: left;
        text-align: center;
        background-repeat: no-repeat;
        background-position: 19px center;
        p {
          max-width: 192px;
        }
        b {
          display: block;
          max-width: 192px;
          color: #222222;
          margin-bottom: 10px;
        }
        span {
          display: block;
          line-height: 22px;
          text-align: left;
        }
      }
      .arrow {
        width: 6%;
        border: none;
        padding: 0;
        background: url('../../assets/images/guide-arrow.png') no-repeat center
          center;
      }
    }
  }
}

.pd-between {
  padding: 15px 0px;
  margin: 0;
}
.home-chart {
  width: 100%;
  .echarts {
    width: 100%;
  }
}
.init-panel {
  min-width: 220px;
}
.rankings {
  text-align: left;
  margin: 0;
  padding-top: 10px;
  padding-bottom: 10px;
  li {
    font-size: 12px;
    padding: 2px 8px;
    line-height: 24px;

    vertical-align: middle;
    .number {
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      font-style: normal;
      text-align: center;
      background-color: #ccc;
      border-radius: 1px;
      color: #fff;
      vertical-align: middle;
      &.number1 {
        background-color: #54aae5;
      }
      &.number2 {
        background-color: #79b8e4;
      }
      &.number3 {
        background-color: #b1cfe3;
      }
    }
    span {
      display: inline-block;
      width: calc(100% - 40px);
      margin-left: 5px;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      overflow: hidden;
      vertical-align: middle;
    }
  }
}

/* @module 表格选择数据样式 */
.sale-data {
  .vertical {
    position: relative;
    top: -1px;
  }

  .el-row {
    border: none;
    .el-col {
      // height: 96px;
      overflow: hidden;

      .sale_room,
      .sale_list,
      .sale_number,
      .init-today,
      .sale_storeAll,
      .sale_pink {
        text-align: center;
        padding: 10px 0;
      }

      & > div {
        border-radius: 2px;
        color: #fff;

        .number {
          font-size: 20px;
          height: 24px;
          line-height: 24px;
        }
        .saleName {
          height: 20px;
          line-height: 20px;
        }
      }

      .sale_storeAll {
        background-color: #6e869e;
      }
      .sale_list {
        background-color: #54aae5;
      }

      .sale_number {
        background-color: #d8b529;
      }

      .sale_room {
        background-color: #e66969;
      }

      .sale_pink {
        background-color: #b6607f;
      }
    }
  }
}

/* End 选择数据样式*/
.gift {
  display: flex;
  .gift-sms {
    display: flex;
    width: 50%;
    margin-bottom: 10px;
    padding: 0 15px;
    align-items: center;
    height: 80px;
    background-color: #f5f5f5;
    & + .gift-sms {
      margin-left: 10px;
    }
    img {
      margin-right: 10px;
    }
    .balance {
      width: calc(100% - 160px);
      .balance-item {
        display: flex;
        width: 100%;
        line-height: 24px;
        .balance-label {
          width: 100px;
          text-align: right;
          white-space: nowrap;
          color: #333333;
        }
        .balance-value {
          color: #ffa200;
          font-weight: 600;
          width: calc(100% - 100px);
          white-space: nowrap;
          text-overflow: ellipsis;
          -o-text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
}
.home-init {
  border: none;
  margin-bottom: 0px;
  .panel-hd {
    border-top: 1px solid #e5e5e5;
    height: 32px;
    .title {
      font-size: 12px;
      font-weight: 900;
      line-height: 32px;
      color: #777;
    }
  }
}
.qrcode-box {
  .pay-price {
    line-height: 30px;
    font-size: 25px;
    font-weight: 900;
    margin-bottom: 10px;
    text-align: center;
  }
  .qrcode {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    img {
      margin-bottom: 10px;
      width: 100%;
    }
  }
}
</style>
