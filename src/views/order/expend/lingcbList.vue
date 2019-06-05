
<template  >
  <div>
    <el-form :model="form" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="search" @onReset="reset">
        <template slot="btnBox">
          <el-form-item prop="marproId">
            <el-radio-group v-model="form.marproId" @change="search" name="marproId">
              <el-radio-button :label="0">全部</el-radio-button>
              <el-radio-button :label="item.MarproId" v-for="(item,index) in marketProduct" :key="index">{{item.MarproTitle}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="default" @click="exportList" name="btn-export">导出Excel</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-button type="primary" name="btn-createByManual" @click="$router.push('/order/expend/createbymanual')">补录消费单</el-button>
          </el-form-item>
          <el-form-item prop="state">
            <el-select v-model="form.state" @change="search" name="state">
              <el-option label="所有状态" :value="0"></el-option>
              <el-option v-for="item in stateOpt" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="消费单号/条码/商品全称">
              <el-button slot="append" name="btn-search" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </el-form-item>
          <!--  <el-form-item>
            <el-button type="text">普通搜索</el-button>
          </el-form-item>-->
        </template>
        <template slot="seniorSearch" prop="sellCode">
          <el-form-item label="创建日期：" prop="createTimeRange">
            <el-date-picker
              v-model="form.createTimeRange"
              @change="dateChange"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions2"
              value-format="yyyy-MM-dd"
              name="createTimeRange"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="createTime1" v-show="false">
            <el-input v-model="form.createTime1" name="createTime1"></el-input>
          </el-form-item>
          <el-form-item prop="createTime2" v-show="false">
            <el-input v-model="form.createTime2" name="createTime2"></el-input>
          </el-form-item>
          <el-form-item prop="companyCode" label="公司编码">
            <el-input v-model="form.companyCode" name="companyCode"></el-input>
          </el-form-item>
          <el-form-item prop="companyName" label="公司名称">
            <el-input v-model="form.companyName" name="companyName"></el-input>
          </el-form-item>
          <el-form-item prop="storeCode" label="门店编号">
            <el-input v-model="form.storeCode" name="storeCode"></el-input>
          </el-form-item>
          <el-form-item prop="storeName" label="门店名称">
            <el-input v-model="form.storeName" name="storeName"></el-input>
          </el-form-item>
          <el-form-item label="卡券类型：" prop="couponType">
            <el-select v-model="form.couponType" name="couponType">
              <el-option :value="0" label="全部"></el-option>
              <el-option v-for="item in couponTypeOpt" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门店名称：" v-if="characterType == CharacterType.Company" prop="characterId">
            <el-select v-model="form.characterId" name="characterId">
              <el-option :value="0" label="全部"></el-option>
              <el-option v-for="(item, index) in dropDownStoreList" :key="index" :label="item.Value" :value="item.CharacterId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="来源：" prop="terminalType">
            <el-select v-model="form.terminalType" name="terminalType">
              <el-option :value="0" label="全部"></el-option>
              <el-option v-for="item in sourceOpt" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="uniteNote" label="关键字">
            <el-input v-model="form.uniteNote" name="uniteNote"></el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" v-loading="isLoading">
      <el-table-column prop="SellCode" label="消费单号" width="160"></el-table-column>
      <el-table-column prop="CouponType" :formatter="formatter" label="卡券类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="PayingType" :formatter="formatter" label="支付类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CompanyCode" label="公司编码" v-if="characterType == CharacterType.Lingcb" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CompanyName" label="公司名称" v-if="characterType == CharacterType.Lingcb" show-overflow-tooltip></el-table-column>
      <el-table-column prop="StoreCode" label="门店编号" v-if="characterType == CharacterType.Company||characterType == CharacterType.Lingcb" show-overflow-tooltip></el-table-column>
      <el-table-column prop="StoreName" label="门店名称" v-if="characterType == CharacterType.Company||characterType == CharacterType.Lingcb" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ProductNO" width="100" label="条码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ProductTitle" label="商品名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ProductPrice" :formatter="formatter" label="商品售价" min-width="100"></el-table-column>
      <el-table-column prop="CouponPrice" :formatter="formatter" label="卡券支付" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CashPrice" :formatter="formatter" label="补付总额" min-width="100"></el-table-column>
      <el-table-column prop="SettlePrice" :formatter="formatter" label="提点总额" show-overflow-tooltip></el-table-column>
      <el-table-column prop="TourPrice" :formatter="formatter" label="旅游基金" show-overflow-tooltip></el-table-column>
      <el-table-column prop="TourPrice" :formatter="formatter" label="利润总额" show-overflow-tooltip></el-table-column>
      <el-table-column prop="OrderTime" :formatter="formatter" label="创建时间" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="TerminalType" :formatter="formatter" label="来源" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="State" :formatter="formatter" label="状态" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scoped">
          <el-button type="text" @click="$router.push('/expend/orderlist/orderdetail/'+scoped.row.SellCode)" name="btn-detail">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.pageIndex" :size="form.pageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination.vue'
import {
  RetailOrderMasterState,
  RetailOrderMasterPayState,
  CouponType,
  ExpendOrderPayingType,
  RetailOrderMasterTerminalType,
  RetailOrderSellProductSourceType,
  StorePackageType,
  YNStatus,
  CompanyBasicWechatSettingType
} from '@/enums/marketing.js'
import { CharacterType } from '@/enums/common'
import {
  MARKETING_API_EXPEND_LIST,
  MARKETING_API_COMMON_MARKETPRODUCT,
  MARKETING_API_EXPEND_ORDERLISTEXPROT,
} from '@/apis/marketing'
import {
  MERCHANT_API_DROPDOWN_STORELIST
} from '@/apis/merchant'
export default {
  components: {
    searchPanel,
    pagination
  },
  data() {
    return {
      CharacterType,
      marketProduct: '',
      form: {
        createTimeRange: [],
        marproId: 0,
        sellCode: '',
        state: 0,
        mainUser: '',
        assistUser: '',
        productNO: '',
        productTitle: '',
        couponType: 0,
        terminalType: 0,
        sourceType: 0,
        createTime1: '',
        createTime2: '',
        characterId: 0,
        pageSize: 20,
        pageIndex: 1
      },
      parameter: {
      },
      total: 0,
      tableData: [],
      isLoading: false,
      stateOpt: [],
      couponTypeOpt: [],
      sourceOpt: [],
      psourceOpt: [],
      dropDownStoreList: [],
      YNStatus,
      RetailOrderMasterState,
      pickerOptions2: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  created() {
    this.getEnums()
    this.init()
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    },
    wechatSettingType() {
      return this.$store.getters.wechatSettingType
    }
  },
  watch: {
    $route: 'init'
  },
  methods: {
    exportList() {
      MARKETING_API_EXPEND_ORDERLISTEXPROT(this.form).then(res => {
        if (res.data.Code === 'CORRECT') {
          location.href = res.data.Data.FilePath
        }
      })
    },
    getData() {
      this.isLoading = true
      MARKETING_API_EXPEND_LIST(this.parameter).then(res => {
        this.isLoading = false
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data
          if (res.data.Data.length > 0) {
            this.total = res.data.Data[0].TOTALCOUNT
          } else {
            this.total = 0
          }
        }
      })
    },
    init() {
      let query = this.$route.query
      this.form.marproId = parseInt(query.marproId) || 0
      this.form.sellCode = query.sellCode || ''
      this.form.state = parseInt(query.state) || 0
      this.form.mainUser = query.mainUser || ''
      this.form.assistUser = query.assistUser || ''
      this.form.assistUser = query.assistUser || ''
      this.form.productNO = query.productNO || ''
      this.form.productTitle = query.productTitle || ''
      this.form.couponType = parseInt(query.couponType) || 0
      this.form.terminalType = parseInt(query.terminalType) || 0
      this.form.sourceType = parseInt(query.sourceType) || 0
      this.form.createTime1 = query.createTime1 || ''
      this.form.createTime2 = query.createTime2 || ''
      this.form.createTimeRange = query.createTimeRange || []
      this.form.pageIndex = query.pageIndex || 1
      this.form.pageSize = query.pageSize || 20
      this.parameter = {
        ...this.form
      }
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: '/order/expend/index',
        query: this.parameter
      })
    },
    search() {
      this.form.pageIndex = 1
      this.parameter = {
        ...this.form
      }
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    reset() {
      this.$refs['search'].resetFields()
      this.search()
    },
    currentChange(val) {
      this.parameter.pageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      this.parameter.pageIndex = 1
      this.parameter.pageSize = val
      this.initRoute()
    },
    dateChange(value) {
      if (value && value.length > 0) {
        this.form.createTime1 = value[0]
        this.form.createTime2 = value[1]
      } else {
        this.form.createTime1 = ''
        this.form.createTime2 = ''
      }
    },
    formatter() {
      switch (arguments[1].property) {
        case 'OrderTime':
          return this.$options.filters.filterDateMinutes(arguments[2])
        case 'State':
          return RetailOrderMasterState.Types[arguments[2]]
        case 'PayState':
          return RetailOrderMasterPayState.Types[arguments[2]]
        case 'ProductPrice':
          return `￥${this.$root.toFloat(arguments[2])}`
        case 'CouponPrice':
          return `￥${this.$root.toFloat(arguments[2])}`
        case 'CashPrice':
          return `￥${this.$root.toFloat(arguments[2])}`
        case 'SettlePrice':
        case 'TourPrice':
          if (StorePackageType.Date == arguments[0].PackageType) {
            return '￥0.00'
          } else {
            return `￥${this.$root.toFloat(arguments[2])}`
          }
        case 'CouponType':
          if (
            arguments[0].PayingType == ExpendOrderPayingType.Card &&
            arguments[2] == 0
          ) {
            return '优惠券'
          } else {
            return CouponType.Types[arguments[2]] || '-'
          }
        case 'PayingType':
          return ExpendOrderPayingType.Types[arguments[2]]
        case 'TerminalType':
          return RetailOrderMasterTerminalType.Types[arguments[2]]
        case 'SourceType':
          return RetailOrderSellProductSourceType.Types[arguments[2]]
        case 'IsProfited':
          return YNStatus.Types[arguments[2]]
        default:
      }
    },
    getEnums() {
      for (let item in RetailOrderMasterState.Types) {
        this.stateOpt.push({
          label: RetailOrderMasterState.Types[item],
          value: parseInt(item)
        })
      }
      for (let item in CouponType.Types) {
        this.couponTypeOpt.push({
          label: CouponType.Types[item],
          value: parseInt(item)
        })
      }
      for (let item in RetailOrderMasterTerminalType.Types) {
        this.sourceOpt.push({
          label: RetailOrderMasterTerminalType.Types[item],
          value: parseInt(item)
        })
      }
      for (let item in RetailOrderSellProductSourceType.Types) {
        this.psourceOpt.push({
          label: RetailOrderSellProductSourceType.Types[item],
          value: parseInt(item)
        })
      }
      MARKETING_API_COMMON_MARKETPRODUCT().then(res => {
        this.marketProduct = res.data.Data
      })
      MERCHANT_API_DROPDOWN_STORELIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.dropDownStoreList = res.data.Data.Rows
        }
      })
    }
  }
}
</script>