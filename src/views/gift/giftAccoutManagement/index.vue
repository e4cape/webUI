<template>
  <div class="content">
    <!-- @module 筛选条件 -->
    <el-form :model="searchForm" lable-width="120px" class="item-lh-26" :inline="true" ref="search">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button type="primary" @click="eOpen = true" :disabled="!dataList.length">导出</el-button>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-input name="companyCodes" v-model="searchForm.companyCode" :maxlength="25" @keyup.enter.native="onSearch" placeholder="公司编码">
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="商户类型：" prop="characterType">
            <el-select name="characterType" filterable v-model="searchForm.characterType" placeholder="商户类型" @change="onSearch">
              <el-option label="全部" :value="''"></el-option>
              <el-option label="珠宝公司" :value="characterType.Company"></el-option>
              <el-option label="珠宝门店" :value="characterType.Store"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公司编码：" prop="companyCode">
            <el-input name="companyCode" v-model="searchForm.companyCode" :maxlength="25" @keyup.enter.native="onSearch" placeholder="公司编码"></el-input>
          </el-form-item>
          <el-form-item label="公司名称：" prop="companyName">
            <el-input name="companyName" v-model="searchForm.companyName" :maxlength="25" @keyup.enter.native="onSearch" placeholder="公司名称"></el-input>
          </el-form-item>
          <el-form-item label="门店编码：" prop="storeCode">
            <el-input name="storeCode" v-model="searchForm.storeCode" :maxlength="25" @keyup.enter.native="onSearch" placeholder="门店编码"></el-input>
          </el-form-item>
          <el-form-item label="门店名称：" prop="storeName">
            <el-input name="storeName" v-model="searchForm.storeName" :maxlength="25" @keyup.enter.native="onSearch" placeholder="门店名称"></el-input>
          </el-form-item>
          <el-form-item label="账户余额：">
            <el-col :span="11">
              <el-form-item prop="balanceMin" class="inline no-margin">
                <el-input name="inputBalanceMin " v-model="searchForm.balanceMin" :maxlength="9" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="balanceMax" class="inline no-margin">
                <el-input name="inputBalanceMax" v-model="searchForm.balanceMax " :maxlength="9" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="累计充值金额：">
            <el-col :span="11">
              <el-form-item prop="rechargeMin" class="inline no-margin">
                <el-input name="inputRechargeMin" v-model="searchForm.rechargeMin" :maxlength="9" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="rechargeMax" class="inline no-margin">
                <el-input name="inputRechargeMax" v-model="searchForm.rechargeMax" :maxlength="9" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="累计充值次数：">
            <el-col :span="11">
              <el-form-item prop="rechargeQtyMin" class="inline no-margin">
                <el-input name="inputRechargeQtyMin" v-model="searchForm.rechargeQtyMin" :maxlength="9" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="rechargeQtyMax" class="inline no-margin">
                <el-input name="inputRechargeQtyMax" v-model="searchForm.rechargeQtyMax" :maxlength="9" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="最近充值时间：" prop="recharge">
            <el-date-picker name="recharge" type="daterange" unlink-panels :picker-options="$root.datePickerOptions" v-model="searchForm.recharge" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- End 筛选条件 -->
    <!-- @module 数据表格 -->
    <el-table :data="dataList" class="no-border" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" @sort-change="sortChange">
      <el-table-column prop="characterTypeText" label="商户类型" min-width="120" fixed show-overflow-tooltip></el-table-column>
      <el-table-column prop="companyCode" label="公司编码" width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="companyName" label="公司名称" width="210" show-overflow-tooltip></el-table-column>
      <el-table-column prop="storeCode" label="门店编码" width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="storeName" label="门店名称" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="balance" label="账户余额" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="rechargeSum" label="累计充值金额" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="rechargeQty" label="累计充值次数" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="lastRecharge" label="最近充值金额" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="lastRechargeDate" label="最近充值时间" width="140" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.lastRechargeDate | filterDateMinutes}}</template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="240">
        <template slot-scope="scope">
          <el-button name="btnCheck" type="text" @click="viewAccountFlow(scope.row.characterId)">账户流水</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pg="searchForm.pageIndex" :size="searchForm.pageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <el-dialog title="账户流水" :visible.sync="dialogVisible" width="1000px" :before-close="closeReset">
      <el-form :model="accountForm" lable-width="120px" class="item-lh-26" :inline="true" ref="accountSearch">
        <el-form-item label="时间：" prop="time">
          <el-date-picker :clearable="false" name="createTime" type="daterange" v-model="accountForm.createTime" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="操作类型：" prop="storeBalanceLogTypes">
          <el-select name="storeBalanceLogTypes" v-model="accountForm.storeBalanceLogTypes" placeholder="商户类型" @change="getAccountFlow">
            <el-option label="全部" :value="''"></el-option>
            <el-option v-for="item in storeBalanceLogTypes.Types" :key="item.key" :label="item.title" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchAccount">搜索</el-button>
          <el-button @click="onDialogReset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="accountData" class="no-border" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" @sort-change="sortDialogChange">
        <el-table-column prop="createTime" label="操作时间" sortable="custom" width="140" fixed show-overflow-tooltip></el-table-column>
        <el-table-column prop="logTypeText" label="操作类型" width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="typeText" label="收入/支出" width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="price" label="金额" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="balance" label="礼品帐户余额" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="prevText" label="相关单据" width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createUser" label="操作人" width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="备注" width="160" show-overflow-tooltip fixed="right"></el-table-column>
      </el-table>
      <pagination :pg="accountForm.pageIndex" :size="accountForm.pageSize" :total="accountTotal" @currentChange="currChange" @sizeChange="flowSizeChange"></pagination>
    </el-dialog>
    <export-field-setter @submit="exportData" :visible.sync="eOpen" :api="filedsApi" :apiKey="apiKey"/>
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import searchPanel from '@/components/searchPanel.vue'
import ExportFieldSetter from '@/components/exportFieldSetter'
import {
  StoreBalanceLogTypes
} from '@/enums/gifting.js'
import { CharacterType, YNStatus } from '@/enums/common'
import {
  GIFTING_API_ACCOUNT_SEARCH,
  GIFTING_API_ACCOUNT_GETACCOUNTITEMS,
  GIFTING_API_STOREEXPORTER_GETEXPORTFIELDS,
  GIFTING_API_STOREEXPORTER_EXPORTTOFILE
} from '@/apis/gifting'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      characterType: CharacterType,
      storeBalanceLogTypes: StoreBalanceLogTypes,
      parameter: {
      },
      dataList: [],
      accountData: [],
      searchForm: {
        characterType: '',
        companyCode: '',
        companyName: '',
        storeCode: '',
        storeName: '',
        balanceMin: '',
        balanceMax: '',
        rechargeMin: '',
        rechargeMax: '',
        rechargeQtyMin: '',
        rechargeQtyMax: '',
        recharge: [
          `${dayjs().format('YYYY-MM')}-01`,
          dayjs().format('YYYY-MM-DD'),
        ],
        orderField: 'lastRechargeDate',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 20
      },
      accountForm: {
        storeBalanceLogTypes: '',
        createTime: [
          `${dayjs().format('YYYY-MM')}-01`,
          dayjs().format('YYYY-MM-DD'),
        ],
        orderField: 'createTime',
        createTimeStart: '',
        createTimeEnd: '',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 10
      },
      dialogVisible: false,
      dialogLoading: false,
      eOpen: false,
      total: 0,
      accountTotal: 0,
      characterId: '',
      filedsApi: GIFTING_API_STOREEXPORTER_GETEXPORTFIELDS, // 查询导出数据的可选列
      apiKey: 'ACCOUNT_SEARCH',
      exportType: 1,
      selectionsId: [],
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: '/gift/giftAccoutManagement/index',
        query: this.parameter
      })
    },
    init() {
      let query = this.$route.query || {
      }
      this.parameter.characterType = query.characterType || ''
      this.parameter.companyCode = query.companyCode || ''
      this.parameter.companyName = query.companyName || ''
      this.parameter.storeCode = query.storeCode || ''
      this.parameter.storeName = query.storeName || ''
      this.parameter.balanceMin = query.balanceMin || ''
      this.parameter.balanceMax = query.balanceMax || ''
      this.parameter.rechargeMin = query.rechargeMin || ''
      this.parameter.rechargeMax = query.rechargeMax || ''
      this.parameter.rechargeQtyMin = query.rechargeQtyMin || ''
      this.parameter.rechargeQtyMax = query.rechargeQtyMax || ''
      this.parameter.recharge = query.recharge || [`${dayjs().format('YYYY-MM')}-01`, dayjs().format('YYYY-MM-DD')]
      this.parameter.rechargeStart = query.rechargeStart || `${dayjs().format('YYYY-MM')}-01`
      this.parameter.rechargeEnd = query.rechargeEnd || dayjs().format('YYYY-MM-DD')
      this.parameter.orderField = query.orderField || 'lastRechargeDate'
      this.parameter.orderType = query.orderType || YNStatus.No
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.pageSize = query.pageSize || 20
      this.searchForm = Object.assign({}, this.parameter)
      this.getData()
    },
    getData() {
      let parameter = Object.assign({}, this.searchForm, this.parameter, { rechargeStart: this.parameter.recharge[0], rechargeEnd: this.parameter.recharge[1] })
      this.$store.commit('SET_TB_LOADING', true)
      GIFTING_API_ACCOUNT_SEARCH(parameter).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.dataList = res.data.Data.rows
          this.total = res.data.Data.total
        }
      })
    },
    currentChange(val) {
      // 切换当前页
      this.parameter.pageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameter.pageIndex = 1
      this.parameter.pageSize = val
      this.initRoute()
    },
    onSearch() {
      this.searchForm.pageIndex = 1
      this.searchForm.isSenior = true
      this.parameter = JSON.parse(JSON.stringify(this.searchForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.searchForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    searchStateChange(v, k) {
      this.parameter.pageIndex = 1
      this.parameter[k] = v
      this.initRoute()
    },
    sortChange(v) {
      this.parameter.orderType = v.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.parameter.orderField = v.prop || 'lastRechargeDate'
      this.initRoute()
    },
    viewAccountFlow(id) {
      this.dialogVisible = true
      if (id) {
        this.characterId = id
      }
      this.getAccountFlow()
    },
    searchAccount() {
      this.accountForm.pageIndex = 1
      this.getAccountFlow()
    },
    getAccountFlow() {
      const para = this.accountForm
      para.characterId = this.characterId
      para.createTimeStart = this.accountForm.createTime && this.accountForm.createTime.length ? this.accountForm.createTime[0] : ''
      para.createTimeEnd = this.accountForm.createTime && this.accountForm.createTime.length ? this.accountForm.createTime[1] : ''
      GIFTING_API_ACCOUNT_GETACCOUNTITEMS(para).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.accountData = res.data.Data.rows
          this.accountTotal = res.data.Data.total
        }
      })
    },
    exportData(fields) {
      const para = {
        ...this.searchForm,
        rechargeStart: this.searchForm.recharge[0],
        rechargeEnd: this.searchForm.recharge[1],
      }
      GIFTING_API_STOREEXPORTER_EXPORTTOFILE({
        apiKey: this.apiKey,
        exportFields: fields,
        exportType: this.exportType,
        apiParameter: para,
        records: this.selectionsId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.eOpen = false
          this.$message.success('导出成功！')
          window.open(this.$root.settings.DOMAIN_TEMP + res.data.Data)
        }
      })
    },
    onDialogReset() {
      this.$refs['accountSearch'].resetFields()
      this.accountForm.createTime = [`${dayjs().format('YYYY-MM')}-01`, dayjs().format('YYYY-MM-DD')]
      this.getAccountFlow()
    },
    closeReset() {
      this.$refs['accountSearch'].resetFields()
      this.accountForm.createTime = [`${dayjs().format('YYYY-MM')}-01`, dayjs().format('YYYY-MM-DD')]
      this.accountData = []
      this.accountTotal = 0
      this.accountForm.pageIndex = 1
      this.accountForm.pageSize = 10
      this.dialogVisible = false
    },
    searchDialogChange(v, k) {
      this.accountForm.pageIndex = 1
      this.accountForm[k] = v
      this.getAccountFlow()
    },
    sortDialogChange(v) {
      this.accountForm.orderType = v.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.accountForm.orderField = v.prop || 'createTime'
      this.getAccountFlow()
    },
    currChange(val) {
      // 切换当前页
      this.accountForm.pageIndex = val
      this.getAccountFlow()
    },
    flowSizeChange(val) {
      // 切换每页显示条数
      this.accountForm.pageIndex = 1
      this.accountForm.pageSize = val
      this.getAccountFlow()
    },
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination,
    searchPanel,
    ExportFieldSetter
  }
}
</script>
