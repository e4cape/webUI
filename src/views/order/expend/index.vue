
<template  >
  <div>
    <el-form :model="form" ref="search" lable-width="120px" @keyup.enter.native="advancedSearch" class="item-lh-26" :inline="true">
      <search-panel @onSearch="advancedSearch" @onReset="reset">
        <template slot="btnBox">
          <el-form-item prop="MarproId">
            <el-radio-group v-model="form.MarproId" @change="search" name="MarproId">
              <el-radio-button :label="'0'">全部</el-radio-button>
              <el-radio-button :label="item.MarproId" v-for="(item,index) in marketProduct" :key="index">{{item.MarproTitle}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="characterType == CharacterType.Store">
            <el-button type="primary" name="btn-createByManual" @click="$router.push('/order/expend/createbymanual')">补录消费单</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="default" @click="exportList" name="btn-export">导出Excel</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select v-model="form.State" @change="search" name="State">
              <el-option label="所有状态" :value="0"></el-option>
              <el-option v-for="item in stateOpt" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="SellCode">
            <el-input v-model="form.SellCode" placeholder="请输入消费单号" name="SellCode">
              <el-button slot="append" name="btn-search" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <!--  公共搜索项  -->
          <template>
            <el-form-item label="销售日期：" prop="CreateTimeRange">
              <el-date-picker
                v-model="form.CreateTimeRange"
                @change="dateChange"
                type="daterange"
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="$root.datePickerOptions"
                value-format="yyyy-MM-dd"
                name="CreateTimeRange"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="CreateTime1" v-show="false">
              <el-input v-model="form.CreateTime1" name="CreateTime1"></el-input>
            </el-form-item>
            <el-form-item prop="CreateTime2" v-show="false">
              <el-input v-model="form.CreateTime2" name="CreateTime2"></el-input>
            </el-form-item>
            <el-form-item label="卡券类型：" prop="CouponType">
              <el-select v-model="form.CouponType" name="CouponType">
                <el-option :value="0" label="全部"></el-option>
                <el-option v-for="item in couponTypeOpt" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="消费单来源：" prop="TerminalType">
              <el-select v-model="form.TerminalType" name="TerminalType">
                <el-option :value="0" label="全部"></el-option>
                <el-option v-for="item in sourceOpt" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <!--  门店总部搜索项  -->
          <template v-if="characterType==CharacterType.Company||characterType==CharacterType.Store">
            <el-form-item label="商品来源：" prop="SourceType">
              <el-select v-model="form.SourceType" name="SourceType">
                <el-option :value="0" label="全部"></el-option>
                <el-option v-for="item in psourceOpt" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="消费单号：" prop="SellCode">
              <el-input v-model="form.SellCode" name="SellCode"></el-input>
            </el-form-item>
            <el-form-item label="条码：" prop="ProductNO">
              <el-input v-model="form.ProductNO" name="ProductNO"></el-input>
            </el-form-item>
            <el-form-item label="商品名称：" prop="ProductTitle">
              <el-input v-model="form.ProductTitle" name="ProductTitle"></el-input>
            </el-form-item>
            <el-form-item label="主销导购：" prop="MainUser">
              <el-input v-model="form.MainUser" name="MainUser"></el-input>
            </el-form-item>
            <el-form-item label="辅销导购：" prop="AssistUser">
              <el-input v-model="form.AssistUser" name="AssistUser"></el-input>
            </el-form-item>
          </template>
          <!--  平台搜索项  -->
          <template v-if="characterType==CharacterType.Lingcb">
            <el-form-item prop="CompanyCode" label="公司编码">
              <el-input v-model="form.CompanyCode" name="CompanyCode"></el-input>
            </el-form-item>
            <el-form-item prop="CompanyName" label="公司名称">
              <el-input v-model="form.CompanyName" name="CompanyName"></el-input>
            </el-form-item>
          </template>
          <template v-if="characterType==CharacterType.Company||characterType==CharacterType.Lingcb">
            <el-form-item prop="StoreCode" label="门店编号">
              <el-input v-model="form.StoreCode" name="StoreCode"></el-input>
            </el-form-item>
            <el-form-item prop="StoreName" label="门店名称">
              <el-input v-model="form.StoreName" name="StoreName"></el-input>
            </el-form-item>
          </template>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" v-loading="$store.getters.tb_loading">
      <el-table-column prop="SellCode" label="消费单号" width="160" fixed show-overflow-tooltip></el-table-column>
      <el-table-column prop="CouponType" :formatter="formatter" label="卡券类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="PayingType" :formatter="formatter" label="支付" show-overflow-tooltip></el-table-column>
      <template v-if="characterType == CharacterType.Lingcb">
        <el-table-column prop="CompanyCode" label="公司编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CompanyName" label="公司名称" width="200" show-overflow-tooltip></el-table-column>
      </template>
      <template v-if="characterType == CharacterType.Company || characterType == CharacterType.Lingcb">
        <el-table-column prop="StoreCode" label="门店编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="StoreName" label="门店名称" width="200" show-overflow-tooltip></el-table-column>
      </template>
      <el-table-column prop="ProductNO" width="100" label="条码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ProductTitle" label="商品名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="LabelPrice" label="标签价" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ProductPrice" :formatter="formatter" label="商品售价" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CouponPrice" :formatter="formatter" label="卡券支付" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CashPrice" :formatter="formatter" label="实付金额" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="SettlePrice" :formatter="formatter" label="提点总额" show-overflow-tooltip></el-table-column>
      <el-table-column prop="TourPrice" :formatter="formatter" label="旅游基金" show-overflow-tooltip></el-table-column>
      <el-table-column prop="EarnPrice" :formatter="formatter" label="利润总额" v-if="characterType == CharacterType.Lingcb" show-overflow-tooltip></el-table-column>
      <template v-if="characterType == CharacterType.Company||characterType == CharacterType.Store">
        <el-table-column prop="MainUser" label="主销导购" show-overflow-tooltip></el-table-column>
        <el-table-column prop="AssistUser" label="辅销导购" show-overflow-tooltip></el-table-column>
      </template>
      <el-table-column prop="OrderTime" :formatter="formatter" label="销售日期" min-width="100" show-overflow-tooltip></el-table-column>
      <template v-if="characterType == CharacterType.Company||characterType == CharacterType.Store">
        <el-table-column prop="PayState" :formatter="formatter" label="支付状态" show-overflow-tooltip></el-table-column>
        <el-table-column prop="SourceType" :formatter="formatter" label="商品来源" show-overflow-tooltip></el-table-column>
      </template>
      <el-table-column prop="TerminalType" :formatter="formatter" label="消费单来源" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="State" :formatter="formatter" label="状态" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="$router.push({path:`/order/expend/detail/${scope.row.SellCode}`})" name="btn-detail">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>
<script>
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination.vue'
import {
  CouponType,
  ExpendOrderPayingType,
  StorePackageType,
  MarproStatus
} from '@/enums/marketing.js'
import {
  YNStatus,
  CharacterType
} from '@/enums/common'
import {
  RetailOrderMasterPayState,
  RetailOrderSellProductSourceType,
  RetailOrderMasterTerminalType,
  RetailOrderMasterState
} from '@/enums/order'
import {
  MARKETING_API_MARKET_PRODUCT_GETS
} from '@/apis/marketing'
import {
  ORDER_API_RETAIL_ORDER_SELL_BASIC_GETS,
  ORDER_API_RETAIL_ORDER_SELL_BASIC_ORDERLISTEXPROT
} from '@/apis/order'
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
        SellCode: '',
        MarproId: '0',
        CharacterId: 0,
        ProductNO: '',
        ProductTitle: '',
        CouponType: 0,
        TerminalType: 0,
        SourceType: 0,
        MainUser: '',
        StoreCode: '',
        StoreName: '',
        CompanyCode: '',
        CompanyName: '',
        AssistUser: '',
        UniteNote: '',
        NoneOfState: '',
        CreateTime1: '',
        CreateTime2: '',
        State: 0,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      parameter: {
      },
      total: 0,
      tableData: [],
      stateOpt: [],
      couponTypeOpt: [],
      sourceOpt: [],
      psourceOpt: [],

      YNStatus,
      RetailOrderMasterState
    }
  },
  created() {
    this.getEnums()
  },
  mounted() {
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
      let param = Object.assign({}, this.parameter, {
        MarproId: parseInt(this.parameter.MarproId || 0),
        CharacterId: parseInt(this.parameter.CharacterId || 0),
        CouponType: parseInt(this.parameter.CouponType || 0),
        TerminalType: parseInt(this.parameter.TerminalType || 0),
        SourceType: parseInt(this.parameter.SourceType || 0),
        OrderBy: parseInt(this.parameter.OrderBy || 0)
      })
      ORDER_API_RETAIL_ORDER_SELL_BASIC_ORDERLISTEXPROT(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          setTimeout(() => {
            location.href = res.data.Data.FilePath
          }, 3000)
        }
      })
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      let param = Object.assign({}, this.parameter, {
        MarproId: parseInt(this.parameter.MarproId || 0),
        CharacterId: parseInt(this.parameter.CharacterId || 0),
        CouponType: parseInt(this.parameter.CouponType || 0),
        TerminalType: parseInt(this.parameter.TerminalType || 0),
        SourceType: parseInt(this.parameter.SourceType || 0),
        OrderBy: parseInt(this.parameter.OrderBy || 0)
      })
      ORDER_API_RETAIL_ORDER_SELL_BASIC_GETS(param).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
      })
    },
    init() {
      let query = this.$route.query
      this.form.isSenior = query.isSenior === 'true' ? true : false
      this.parameter = Object.assign(this.form, {
        State: '0',
        SellCode: '',
        MarproId: '0',
        CharacterId: 0,
        ProductNO: '',
        ProductTitle: '',
        CouponType: '0',
        TerminalType: '0',
        SourceType: '0',
        MainUser: '',
        StoreCode: '',
        StoreName: '',
        CompanyCode: '',
        CompanyName: '',
        AssistUser: '',
        UniteNote: '',
        NoneOfState: '',
        CreateTime1: '',
        CreateTime2: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20,
        Stamp: ''
      }, query)
      this.parameter.State = parseInt(this.parameter.State)
      this.parameter.CouponType = parseInt(this.parameter.CouponType)
      this.parameter.TerminalType = parseInt(this.parameter.TerminalType)
      this.parameter.SourceType = parseInt(this.parameter.SourceType)
      this.getData()
    },
    initRoute() {
      this.$router.replace({ path: '/order/expend/index', query: this.parameter })
    },
    search() {
      this.form.PageIndex = 1
      this.parameter = { ...this.form }
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    advancedSearch() {
      this.form.isSenior = true
      this.search()
    },
    reset() {
      this.$refs['search'].resetFields()
      this.search()
    },
    currentChange(val) {
      this.parameter.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      this.parameter.PageIndex = 1
      this.parameter.PageSize = val
      this.initRoute()
    },
    dateChange(value) {
      if (value && value.length > 0) {
        this.form.CreateTime1 = value[0]
        this.form.CreateTime2 = value[1]
      } else {
        this.form.CreateTime1 = ''
        this.form.CreateTime2 = ''
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
        case 'LabelPrice':
        case 'CouponPrice':
        case 'CashPrice':
          return `￥${this.$root.toFloat(arguments[2])}`
        case 'SettlePrice':
          if (
            StorePackageType.Date == arguments[0].PackageType &&
            this.characterType != CharacterType.Lingcb
          ) {
            return '-'
          }
          return `￥${this.$root.toFloat(arguments[2])}`
        case 'EarnPrice':
          if (
            StorePackageType.Date == arguments[0].PackageType &&
            this.characterType != CharacterType.Lingcb
          ) {
            return '-'
          }
          return `￥${this.$root.toFloat(arguments[2])}`
        case 'TourPrice':
          if (
            StorePackageType.Date == arguments[0].PackageType &&
            this.characterType != CharacterType.Lingcb
          ) {
            return '-'
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
          return ''
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
      MARKETING_API_MARKET_PRODUCT_GETS({
        Status: MarproStatus.Online,
        PageIndex: 1,
        PageSize: 9999
      }).then(res => {
        this.marketProduct = res.data.Data.Rows
      })
      this.$store.dispatch('GET_STORES_DROPLIST')
    }
  }
}
</script>