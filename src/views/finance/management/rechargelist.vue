<template>
  <div class="content">
    <el-form :model="form" name="btnRechargeListForm" ref="search" class="item-lh-26" :inline="true">
      <el-row type="flex" class="search-box">
        <el-col>
          <el-form-item label="日期：" prop="CreateTimeRange">
            <el-date-picker
              name="btnCreateRechargeListTime"
              v-model="form.CreateTimeRange"
              @change="dateChange"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item name="btnRechargeListFirst" prop="CreateTime1" v-show="false">
            <el-input v-model="form.CreateTime1"></el-input>
          </el-form-item>
          <el-form-item name="btnRechargeListSecond" prop="CreateTime2" v-show="false">
            <el-input v-model="form.CreateTime2"></el-input>
          </el-form-item>
          <el-form-item label="充值单号：" prop="prevOrderId">
            <el-input name="btnRechargeOrderNum" v-model="form.prevOrderId" @keyup.enter.native="search"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="search-btn">
          <el-button type="primary" name="btnSearchRechargeList" @click="advancedSearch">搜索</el-button>
          <el-button type="default" name="btnResetRechargeList" @click="reset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="tableData">
      <el-table-column prop="PrevOrderId" label="充值单号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ChangeType" label="变化类型" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column prop="BalanceType" label="账户类型" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column prop="UsedPrice" label="本次变化总额" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ValidPrice" label="当前可用总额" show-overflow-tooltip></el-table-column>
      <el-table-column prop="LogNote" label="日志备注" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateUser" label="创建人员" show-overflow-tooltip></el-table-column>
      <template v-if="characterType == CharacterType.Company">
        <el-table-column prop="EnglishID" label="门店编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="StoreTitle" label="门店名称" show-overflow-tooltip></el-table-column>
      </template>
      <el-table-column prop="CreateTime" label="创建日期" :formatter="formatter" show-overflow-tooltip></el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>
<script>
import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
import { CharacterType, YNStatus } from '@/enums/common'
import { LogBalanceStoreChangeType, BalanceType } from '@/enums/marketing.js'
import { MARKETING_API_LOG_BALANCE_STORE_GETS } from '@/apis/marketing'
export default {
  components: {
    pagination,
    searchPanel
  },
  data() {
    return {
      CharacterType,
      form: {
        CreateTimeRange: [],
        CreateTime1: '',
        CreateTime2: '',
        prevOrderId: '',
        OfferUser: '',
        BalanceType: 0,
        ChangeType: 0,
        ExpelBlanceTypes: 0,
        CharacterId: this.$route.params.id || '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      parameter: {},
      total: 0,
      tableData: [],
      isLoading: true
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
      this.isLoading = true
      MARKETING_API_LOG_BALANCE_STORE_GETS(this.parameter).then(res => {
        this.isLoading = false
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
      })
    },
    init() {
      let query = this.$route.query
      this.form.prevOrderId = query.prevOrderId || ''
      this.form.characterId = this.$route.params.id || 0
      this.form.CreateTime1 = query.CreateTime1 || ''
      this.form.CreateTime2 = query.CreateTime2 || ''
      this.form.CreateTimeRange = query.CreateTimeRange || []
      this.form.PageIndex = query.PageIndex || 1
      this.form.PageSize = query.PageSize || 20
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
    getEnums() {
      this.$store.dispatch('GET_STORES_DROPLIST')
    },
    formatter() {
      let tpr

      switch (arguments[1].property) {
        case 'ChangeType':
          tpr = LogBalanceStoreChangeType.Types[arguments[2]]
          break
        case 'BalanceType':
          tpr = BalanceType.Types[arguments[2]]
          break
        case 'UsedPrice':
          tpr = '￥+' + `${this.$root.toFloat(arguments[2])}`
          break
        case 'ValidPrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'CreateTime':
          tpr = this.$options.filters.filterDate(arguments[2])
          break
        default:
          break
      }
      return tpr
    }
  }
}
</script>
<style lang="scss" scoped>
.search-box {
  border: none;
  padding: 0;
  margin: 0;
}
</style>