<template>
  <div class="content">
    <el-form :model="form" ref="search" lable-width="120px" @keyup.enter.native="search" class="item-lh-26" :inline="true">
      <el-row type="flex" class="search-box">
        <el-col>
          <el-form-item label="日期：" prop="createTimeRange">
            <el-date-picker
              name="btnCreateTimeRange"
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
          <el-form-item prop="CreateTime1" v-show="false">
            <el-input name="btnCreateTimeTheFirst" v-model="form.CreateTime1"></el-input>
          </el-form-item>
          <el-form-item prop="CreateTime2" v-show="false">
            <el-input name="btnCreateTimeSecond" v-model="form.CreateTime2"></el-input>
          </el-form-item>
          <el-form-item label="变化类型：" prop="ChangeType">
            <el-select v-model="form.ChangeType" name="btnchangeTypeOpt">
              <el-option :value="0" label="全部"></el-option>
              <el-option v-for="item in changeTypeOpt" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="门店名称：" v-if="characterType == CharacterType.Company">
            <el-select v-model="form.CharacterId" name="btnStoreNameList">
              <template v-for="(item, index) in dropDownStoreList">
                <el-option :key="index" :label="item.Value" :value="item.CharacterId" v-if="index != 0"></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="search-btn">
          <el-button type="primary" name="btnAdvancedSearch" @click="advancedSearch">搜索</el-button>
          <el-button type="default" name="btnResetTerm" @click="reset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="tableData" v-loading="isLoading">
      <el-table-column prop="PrevOrderId" label="消费单号" show-overflow-tooltip></el-table-column>
      <template v-if="characterType == CharacterType.Company">
        <el-table-column prop="EnglishID" label="门店编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="StoreTitle" label="门店名称" show-overflow-tooltip></el-table-column>
      </template>
      <el-table-column prop="ChangeType" label="变化类型" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column prop="BalanceType" label="账户类型" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column prop="UsedPrice" label="本次变化总额" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ValidPrice" label="当前可用总额" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column prop="LogNote" label="日志备注" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateUser" label="创建人员" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" prop="CreateTime" label="创建日期" show-overflow-tooltip></el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>
<script>
import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
import { CharacterType } from '@/enums/common'
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
        createTimeRange: [],
        CreateTime1: '',
        CreateTime2: '',
        BalanceType: BalanceType.ValidCash,
        ChangeType: 0,
        CharacterId: '',
        PageIndex: 1,
        PageSize: 20
      },
      parameter: {},
      total: 0,
      changeTypeOpt: [],
      tableData: [],
      isLoading: true
    }
  },
  created() {
    this.getEnums()
  },
  mounted() {
    this.$store.dispatch('GET_STORES_DROPLIST').then(() => {
      this.init()
    })
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    },
    dropDownStoreList() {
      return this.$store.getters.stores
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
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
      })
    },
    init() {
      let query = this.$route.query
      this.form.ChangeType = parseInt(query.ChangeType) || 0
      this.form.CharacterId =
        parseInt(query.CharacterId) || this.dropDownStoreList[1].CharacterId
      this.form.CreateTime1 = query.CreateTime1 || ''
      this.form.CreateTime2 = query.CreateTime2 || ''
      this.form.createTimeRange = query.createTimeRange || []
      this.form.PageIndex = query.PageIndex || 1
      this.form.PageSize = query.PageSize || 20
      this.parameter = {
        ...this.form
      }
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: '/finance/management/expendlist',
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
      this.form.CharacterId = this.dropDownStoreList[1].CharacterId
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
      for (let item in LogBalanceStoreChangeType.Types) {
        if (
          item == LogBalanceStoreChangeType.ReturnOrder ||
          item == LogBalanceStoreChangeType.ExpendOrder ||
          item == LogBalanceStoreChangeType.GiftingOrder ||
          item == LogBalanceStoreChangeType.CancelOrder
        ) {
          this.changeTypeOpt.push({
            label: LogBalanceStoreChangeType.Types[item],
            value: parseInt(item)
          })
        }
      }
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
          if (
            arguments[0]['ChangeType'] ==
              LogBalanceStoreChangeType.ReturnOrder ||
            arguments[0]['ChangeType'] == LogBalanceStoreChangeType.CancelOrder
          ) {
            tpr = '￥+' + this.$root.toFloat(arguments[2])
          } else {
            tpr = '￥-' + this.$root.toFloat(arguments[2])
          }
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
