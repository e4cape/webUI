<template>
  <div class="contents">
    <el-form :model="form" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="advancedSearch" @onReset="reset">
        <template slot="btnBox">
          <el-form-item>
            <el-button name="btnexportReport" type="default" @click="exportReport">导出Excel</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="TrueName">
            <el-input name="TrueName" v-model="form.TrueName" placeholder="请输入姓名">
              <el-button name="btnsearch" slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <!-- 公共搜索项 -->
          <el-form-item label="统计日期" prop="CreateTimeRange">
            <el-date-picker name="CreateTimeRange" v-model="form.CreateTimeRange" @change="dateChange" type="daterange" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="$root.datePickerOptions" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="CreateTime1" v-show="false">
            <el-input name="CreateTime1" v-model="form.CreateTime1"></el-input>
          </el-form-item>
          <el-form-item prop="CreateTime2" v-show="false">
            <el-input name="CreateTime2" v-model="form.CreateTime2"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="TrueName">
            <el-input name="TrueName" v-model="form.TrueName"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="AliasName">
            <el-input name="AliasName" v-model="form.AliasName"></el-input>
          </el-form-item>
          <el-form-item label="注册时间" prop="MemberCreateTimeRange">
            <el-date-picker name="MemberCreateTimeRange" v-model="form.MemberCreateTimeRange" @change="memberDateChange" type="daterange" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="$root.datePickerOptions" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="MemberCreateTime1" v-show="false">
            <el-input name="MemberCreateTime1" v-model="form.MemberCreateTime1"></el-input>
          </el-form-item>
          <el-form-item prop="MemberCreateTime1" v-show="false">
            <el-input name="MemberCreateTime2" v-model="form.MemberCreateTime2"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="Mobile">
            <el-input name="Mobile" v-model="form.Mobile"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="SexyType">
            <el-select name="SexyType" v-model="form.SexyType">
              <el-option label="全部" :value="0"></el-option>
              <el-option v-for="(item, key) in SexyType.Types" :key="key" :value="parseInt(key)" :label="item"></el-option>
            </el-select>
          </el-form-item>
          <!-- 门店总部搜索项 -->
          <el-form-item label="门店名称：" v-if="characterType == CharacterType.Company" prop="CharacterId">
            <el-select name="CharacterId" v-model="form.CharacterId">
              <el-option v-for="(item, index) in $store.getters.stores" :key="index" :label="item.Value" :value="item.CharacterId"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" v-loading="isLoading">
      <template v-if="characterType == CharacterType.Company">
        <el-table-column label="门店编号" prop="StoreCode" fixed show-overflow-tooltip></el-table-column>
        <el-table-column label="门店名称" prop="StoreName" width="150" show-overflow-tooltip></el-table-column>
      </template>
      <el-table-column label="姓名" prop="TrueName" width="150" fixed></el-table-column>
      <el-table-column label="昵称" prop="AliasName" width="150"></el-table-column>
      <el-table-column label="性别" prop="SexyType" :formatter="formatter"></el-table-column>
      <el-table-column label="手机" prop="Mobile" width="100"></el-table-column>
      <el-table-column label="注册时间" prop="MemberCreateTime" :formatter="formatter" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="累计消费总额" prop="CashPrice" :formatter="formatter" width="150"></el-table-column>
      <el-table-column label="累计收益应收总额" prop="TotalPrice" :formatter="formatter" width="150"></el-table-column>
      <el-table-column label="累计收益已用总额" prop="UsedPrice" :formatter="formatter" width="150"></el-table-column>
      <el-table-column label="累计收益剩余总额" prop="RestPrice" :formatter="formatter" width="150"></el-table-column>
      <el-table-column label="鼓励金累计应收益总额" prop="AgreceTotalPrice" :formatter="formatter" width="150"></el-table-column>
      <el-table-column label="鼓励金累计已用总额" prop="AgreceUsedPrice" :formatter="formatter" width="150"></el-table-column>
      <el-table-column label="鼓励金累计剩余总额" prop="AgreceRestPrice" :formatter="formatter" width="150"></el-table-column>
      <el-table-column label="置换金累计应收益总额" prop="AgitateTotalPrice" :formatter="formatter" width="150"></el-table-column>
      <el-table-column label="置换金累计已用总额" prop="AgitateUsedPrice" :formatter="formatter" width="150"></el-table-column>
      <el-table-column label="置换金累计剩余总额" prop="AgitateRestPrice" :formatter="formatter" width="150"></el-table-column>
      <el-table-column label="购物金累计应收益总额" prop="GondTotalPrice" :formatter="formatter" width="150"></el-table-column>
      <el-table-column label="购物金累计已用总额" prop="GondUsedPrice" :formatter="formatter" width="150"></el-table-column>
      <el-table-column label="购物金累计剩余总额" prop="GondRestPrice" :formatter="formatter" width="150"></el-table-column>
      <el-table-column label="抵用金累计应收益总额" prop="EquivTotalPrice" :formatter="formatter" width="150"></el-table-column>
      <el-table-column label="抵用金累计已用总额" prop="EquivUsedPrice" :formatter="formatter" width="150"></el-table-column>
      <el-table-column label="抵用金累计剩余总额" prop="EquivRestPrice" :formatter="formatter" width="150"></el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>

<script>
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination.vue'
import {
  MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYCOUPONPROFIT,
  MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYCOUPONPROFITEXPORT
} from '@/apis/marketing.js'

import {CharacterType,SexyType} from '@/enums/common'
export default {
  components: {
    searchPanel,
    pagination
  },
  data() {
    return {
      CharacterType,
      SexyType,
      form: {
        IsSenior: false,
        CreateTimeRange: [],
        CreateTime1: '',
        CreateTime2: '',
        TrueName: '',
        AliasName: '',
        MemberCreateTimeRange: [],
        MemberCreateTime1: '',
        MemberCreateTime2: '',
        Mobile: '',
        SexyType: 0,
        CharacterId: 0,
        OrderBy: 1,
        IsAsced: 1,
        PageIndex: 1,
        PageSize: 20
      },
      parameter: {},
      total: 0,
      tableData: [],
      isLoading: true
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  watch: {
    $route: 'init'
  },
  created() {
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  methods: {
    getEnums() {
      this.$store.dispatch('GET_STORES_DROPLIST')
    },
    getData() {
      this.isLoading = true
      MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYCOUPONPROFIT(
        this.parameter
      ).then(res => {
        this.isLoading = false
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
      })
    },
    init() {
      let query = this.$route.query
      this.form.IsSenior = query.IsSenior === 'true' ? true : false
      this.form.CreateTimeRange = query.CreateTimeRange || []
      this.form.CreateTime1 = query.CreateTime1 || ''
      this.form.CreateTime2 = query.CreateTime2 || ''
      this.form.TrueName = query.TrueName || ''
      this.form.AliasName = query.AliasName || ''
      this.form.MemberCreateTimeRange = query.MemberCreateTimeRange || []
      this.form.MemberCreateTime1 = query.MemberCreateTime1 || ''
      this.form.MemberCreateTime2 = query.MemberCreateTime2 || ''
      this.form.Mobile = query.Mobile || ''
      this.form.SexyType = parseInt(query.SexyType) || 0
      this.form.CharacterId = parseInt(query.CharacterId) || 0
      this.form.OrderBy = query.OrderBy
      this.form.IsAsced = query.IsAsced
      this.form.PageIndex = query.PageIndex || 1
      this.form.PageSize = query.PageSize || 20
      this.parameter = {
        ...this.form
      }
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: '/report/memberincomereport/index',
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
      this.form.IsSenior = true
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
    memberDateChange(value) {
      if (value) {
        this.form.MemberCreateTime1 = value[0]
        this.form.MemberCreateTime2 = value[1]
      } else {
        this.form.MemberCreateTime1 = ''
        this.form.MemberCreateTime2 = ''
      }
    },
    formatter() {
      switch (arguments[1].property) {
        case 'SexyType':
          return SexyType.Types[arguments[2]]
        case 'MemberCreateTime':
          return this.$options.filters.filterDate(arguments[2])
        default:
          return this.$root.toFloat(arguments[2])
      }
    },
    exportReport() {
      MARKETING_API_MARKET_REPORT_GETEXPENDSUMMARYBYCOUPONPROFITEXPORT(
        this.parameter
      ).then(res => {
        if (res.data.Code === 'CORRECT') {
          window.open(res.data.Data.FilePath, '_blank')
        }
      })
    }
  }
}
</script>