<template>
  <div class="content">
    <el-form name="btnMemberIncomeForm" :model="form" ref="search" class="item-lh-26" :inline="true" @keyup.enter.native="advancedSearch">
      <search-panel @onSearch="advancedSearch" @onReset="reset">
        <template slot="simpleSearch">
          <el-form-item prop="CouponStatus">
            <el-select name="btnIncomeCouponStatus" v-model="form.CouponStatus" @change="search">
              <el-option :value="0" label="所有状态"></el-option>
              <el-option v-for="item in StatusOpt" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input name="btnIncomeEnterOrderNum" v-model="form.PrevOrderId" placeholder="请输入消费单号" @keyup.enter.native="search">
              <el-button name="btnIncomeSearchOrderNum" slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="消费单号：" prop="PrevOrderId">
            <el-input name="btnConsumeOrderNum" v-model="form.PrevOrderId" @keyup.enter.native="advancedSearch"></el-input>
          </el-form-item>
          <el-form-item label="日期：" prop="createTimeRange">
            <el-date-picker
              name="btnCreateDateIncome"
              v-model="form.createTimeRange"
              @change="dateChange"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item name="btnIncomeFirst" prop="CreateTime1" v-show="false">
            <el-input v-model="form.CreateTime1"></el-input>
          </el-form-item>
          <el-form-item name="btnincomeSecond" prop="CreateTime2" v-show="false">
            <el-input v-model="form.CreateTime2"></el-input>
          </el-form-item>
          <el-form-item label="卡券类型：" prop="CouponType">
            <el-select name="btnIncomeCardType" v-model="form.CouponType">
              <el-option :value="0" label="全部"></el-option>
              <el-option v-for="(item,key) in CouponType.Types" :key="key" :value="parseInt(key)" :label="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="AliasName" label="会员名称：">
            <el-input name="btnIncomeAliasName" v-model="form.AliasName"></el-input>
          </el-form-item>
          <el-form-item prop="MainUser" label="导购：" v-if="characterType === CharacterType.Store">
            <el-input name="btnIncomeMainUser" v-model="form.MainUser"></el-input>
          </el-form-item>
          <template v-if="characterType === CharacterType.Company">
            <el-form-item prop="EnglishID" label="门店编号：">
              <el-input name="btnIncomeEnglishID" v-model="form.EnglishID"></el-input>
            </el-form-item>
            <el-form-item prop="StoreTitle" label="门店名称：">
              <el-input name="btnIncomeStoreTitle" v-model="form.StoreTitle"></el-input>
            </el-form-item>
          </template>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" v-loading="tableLoading">
      <template v-if="characterType == CharacterType.Company">
        <el-table-column label="门店编号" prop="EnglishID" fixed></el-table-column>
        <el-table-column label="门店名称" prop="StoreTitle" show-overflow-tooltip fixed></el-table-column>
      </template>
      <el-table-column label="卡券序号" prop="CouponId" width="160" fixed></el-table-column>
      <el-table-column label="消费单号" prop="PrevOrderId" width="160"></el-table-column>
      <el-table-column label="卡券类型" prop="CouponType" :formatter="formatter"></el-table-column>
      <el-table-column label="主销导购" prop="MainUser" show-overflow-tooltip></el-table-column>
      <el-table-column label="辅销导购" prop="AssistUser" show-overflow-tooltip></el-table-column>
      <el-table-column label="会员名称" prop="AliasName" show-overflow-tooltip></el-table-column>
      <el-table-column label="手机" prop="Mobile" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="可抵材质" prop="MaterialTypes" :formatter="formatter" width="120">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" width="200">
            <p>{{ ergodicMT(scope.row.MaterialTypes) }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag size="medium" primary="success">查看可抵材质</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="ProductTitle" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="商品售价" :formatter="formatter" prop="ProductPrice" show-overflow-tooltip></el-table-column>
      <el-table-column label="收益比率" :formatter="formatter" prop="CouponRate" show-overflow-tooltip></el-table-column>
      <el-table-column label="收益天数" prop="Days" show-overflow-tooltip></el-table-column>
      <el-table-column label="收益起始" prop="Expireb" :formatter="formatter" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="收益截止" prop="Expiree" :formatter="formatter" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="应收益总额" :formatter="formatter" prop="AwaitPrice" show-overflow-tooltip></el-table-column>
      <el-table-column label="可用总额" :formatter="formatter" prop="ValidPrice" show-overflow-tooltip></el-table-column>
      <el-table-column label="每张金额" :formatter="formatter" prop="PerPrice" show-overflow-tooltip></el-table-column>
      <el-table-column label="已收益张数" prop="TimerAmt" show-overflow-tooltip></el-table-column>
      <el-table-column label="已使用张数" prop="UsedAmt" show-overflow-tooltip></el-table-column>
      <el-table-column label="可用张数" prop="ValidAmt" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" prop="CreateTime" :formatter="formatter" width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="收益状态" prop="ProfitStatus" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column label="消费状态" prop="ExpendStatus" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column label="卡券状态" prop="CouponStatus" :formatter="formatter" show-overflow-tooltip fixed="right"></el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>
<script>
import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
import {
  WalletCouponProfitStatus,
  WalletCouponExpendStatus,
  CouponType,
  WalletCouponStatus
} from '@/enums/marketing.js'
import { CharacterType } from '@/enums/common'
import { MARKETING_API_WALLET_COUPON_GETS } from '@/apis/marketing'
export default {
  components: {
    pagination,
    searchPanel
  },
  data() {
    return {
      CharacterType,
      CouponType,
      WalletCouponStatus,
      form: {
        createTimeRange: [],
        CreateTime1: '',
        CreateTime2: '',
        CouponType: 0,
        CouponStatus: 0,
        EnglishID: '',
        StoreTitle: '',
        PrevOrderId: '',
        AliasName: '',
        MainUser: '',
        OrderBy: 1,
        IsAsced: 1,
        PageIndex: 1,
        PageSize: 20
      },
      parameter: {},
      total: 0,
      tableLoading: false,
      StatusOpt: [],
      tableData: []
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
    }
  },
  watch: {
    $route: 'init'
  },
  methods: {
    getData() {
      this.tableLoading = true
      MARKETING_API_WALLET_COUPON_GETS(this.parameter).then(res => {
        this.tableLoading = false
        if (res.data.Code === 'CORRECT') {
          this.total = res.data.Data.Count
          this.tableData = res.data.Data.Rows
        }
      })
    },
    init() {
      let query = this.$route.query
      this.form.CouponType = parseInt(query.CouponType) || 0
      this.form.CouponStatus = parseInt(query.CouponStatus) || 0
      this.form.EnglishID = query.EnglishID || ''
      this.form.StoreTitle = query.StoreTitle || ''
      this.form.PrevOrderId = query.PrevOrderId || ''
      this.form.AliasName = query.AliasName || ''
      this.form.MainUser = query.MainUser || ''
      this.form.CreateTime1 = query.CreateTime1 || ''
      this.form.CreateTime2 = query.CreateTime2 || ''
      this.form.createTimeRange = query.createTimeRange || []
      this.form.PageIndex = query.OrderBy || 1
      this.form.PageIndex = query.IsAsced || 1
      this.form.PageIndex = query.PageIndex || 1
      this.form.PageSize = query.PageSize || 20
      this.parameter = {
        ...this.form
      }
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: '/finance/member/incomelist',
        query: this.parameter
      })
    },
    search() {
      this.form.PageIndex = 1
      this.parameter = {
        ...this.form
      }
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    advancedSearch() {
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
      if (value) {
        this.form.CreateTime1 = value[0]
        this.form.CreateTime2 = value[1]
      } else {
        this.form.CreateTime1 = ''
        this.form.CreateTime2 = ''
      }
    },
    formatter() {
      switch (arguments[1].property) {
        case 'CouponType':
          return CouponType.Types[arguments[2]]
        case 'CouponRate':
          return `${this.$root.toFloat(arguments[2] * 100, 1)}%`
        case 'ProductPrice':
          return `￥${this.$root.toFloat(arguments[2])}`
        case 'AwaitPrice':
          return `￥${this.$root.toFloat(arguments[2])}`
        case 'ValidPrice':
          return `￥${this.$root.toFloat(arguments[2])}`
        case 'PerPrice':
          return `￥${this.$root.toFloat(arguments[2])}`
        case 'ProfitStatus':
          return WalletCouponProfitStatus.Types[arguments[2]]
        case 'ExpendStatus':
          return WalletCouponExpendStatus.Types[arguments[2]]
        case 'CouponStatus':
          return WalletCouponStatus.Types[arguments[2]]
        case 'Expireb':
          return this.$options.filters.filterDateMinutes(arguments[2])
        case 'Expiree':
          return this.$options.filters.filterDateMinutes(arguments[2])
        case 'CreateTime':
          return this.$options.filters.filterDateMinutes(arguments[2])
        default:
          return ''
      }
    },
    ergodicMT(str) {
      const ary = []
      str.split(',').forEach(item => {
        ary.push(this.$store.getters.materialType.Types[item])
      })
      return ary.join('，')
    },
    getEnums() {
      for (let key in WalletCouponStatus.Types) {
        this.StatusOpt.push({
          label: WalletCouponStatus.Types[key],
          value: parseInt(key)
        })
      }
      this.$store.dispatch('GET_STORES_DROPLIST')
      this.$store.dispatch('GET_MATERIAL_TYPE')
    }
  }
}
</script>