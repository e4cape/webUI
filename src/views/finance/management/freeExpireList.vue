<template>
  <div class="content">
    <el-form :model="form" ref="search" lable-width="120px" name="btnFreeExpireListForm" @keyup.enter.native="search" class="item-lh-26" :inline="true">
      <el-row type="flex" class="search-box" style="border: none">
        <el-col>
          <el-form-item prop="creatTimeRange" label="日期">
            <el-date-picker
              name="btnCreatFreeELTime"
              v-model="form.creatTimeRange"
              @change="dateChange"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="CreateTime1" v-show="false">
            <el-input name="btnTimeFreeELFirst" v-model="form.CreateTime1"></el-input>
          </el-form-item>
          <el-form-item prop="CreateTime2" v-show="false">
            <el-input name="btnTimeFreeELSecond" v-model="form.CreateTime2"></el-input>
          </el-form-item>
        </el-col>
        <el-form-item>
          <el-button type="primary" name="btnSearchFree" @click="advancedSearch">搜索</el-button>
          <el-button type="default" name="btnResetFree" @click="reset">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table :data="tableData" v-loading="isLoading">
      <el-table-column width="200" prop="PrevOrderId" label="订单号" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" prop="GiftPrice" label="赠送金额" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" prop="UsedPrice" label="已使用总额" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" :width="100" prop="ValidPrice" label="当前可用金额" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" prop="LockPrice" label="锁定金额" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Months" label="有效月数" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" :width="100" prop="Expireb" label="有效日期(起始)" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" :width="100" prop="Expiree" label="有效日期(截止)" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateUser" label="创建人员" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" prop="CreateTime" label="创建时间" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" prop="ExpendStatus" label="消费状态" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" prop="ExpendStatus" label="期限状态" show-overflow-tooltip></el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>
<script>
import pagination from '@/components/pagination.vue'
import {  BalanceFreeExpireExpendStatus } from '@/enums/marketing.js'
import { MARKETING_API_BALANCE_FREE_EXPIRE_GETS } from '@/apis/marketing'

export default {
  components: {
    pagination
  },
  data() {
    return {
      form: {
        CreateTimeRange: [],
        ExpendStatus: 0,
        CreateTime1: '',
        CreateTime2: '',
        PageIndex: 1,
        PageSize: 20,
        CharacterId: this.$route.params.id || ''
      },
      parameter: {},
      total: 0,
      tableData: [],
      BiStatusOpt: [],
      isLoading: true
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  methods: {
    getData() {
      this.isLoading = true
      MARKETING_API_BALANCE_FREE_EXPIRE_GETS(this.parameter).then(res => {
        this.isLoading = false
        if (res.data.Code === 'CORRECT') {
          this.total = res.data.Data.Count || 0
          this.tableData = res.data.Data.Rows || []
        }
      })
    },
    init() {
      let query = this.$route.query
      this.form.ExpendStatus = query.ExpendStatus || 0
      this.form.CreateTime1 = query.CreateTime1 || ''
      this.form.CreateTime2 = query.CreateTime2 || ''
      this.form.CreateTimeRange = query.CreateTimeRange || []
      this.form.PageIndex = query.PageIndex || 1
      this.form.PageSize = query.PageSize || 20
      this.form.CharacterId = this.$route.params.id || 0
      this.parameter = {
        ...this.form
      }
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: this.$route.path,
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
      let tpr
      switch (arguments[1].property) {
        case 'GiftPrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'UsedPrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'ValidPrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'LockPrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'Expireb':
          tpr = this.$options.filters.filterDate(arguments[2])
          break
        case 'Expiree':
          tpr = this.$options.filters.filterDate(arguments[2])
          break
        case 'CreateTime':
          tpr = this.$options.filters.filterDate(arguments[2])
          break
        case 'ExpendStatus':
          tpr = BalanceFreeExpireExpendStatus.Types[arguments[2]]
          break
        // case 'BiStatus':
        //   tpr = BiStatus.Types[arguments[2]]
        //   break
        default:
          break
      }
      return tpr
    }
  }
}
</script>
