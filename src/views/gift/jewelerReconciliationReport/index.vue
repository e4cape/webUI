<template>
  <div class="content">
    <!-- @module 筛选条件 -->
    <el-form :model="searchForm" lable-width="120px" class="item-lh-26" :inline="true" ref="search">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button type="primary" @click="eOpen = true">导出</el-button>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-input name="companyCodes" v-model="searchForm.companyCode" :maxlength="25" @keyup.enter.native="onSearch" placeholder="公司编码">
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="时间：" prop="period">
            <el-date-picker name="period" type="daterange" v-model="searchForm.period" unlink-panels :picker-options="$root.datePickerOptions" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
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
        </template>
      </search-panel>
    </el-form>
    <!-- End 筛选条件 -->
    <!-- @module 数据表格 -->
    <el-table :data="dataList" class="no-border" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" @selection-change="selectionChange" @sort-change="sortChange">
      <el-table-column prop="characterTypeText" label="商户类型" min-width="140" fixed show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="companyCode" label="公司编码" width="140" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="companyName" label="公司名称" width="180" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="storeCode" label="门店编码" width="140" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="storeName" label="门店名称" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="openingBalance" label="期初账户余额" width="140" show-overflow-tooltip :render-header="privateHeader">
      </el-table-column>
      <el-table-column show-overflow-tooltip label="本期收入" :render-header="privateHeader">
        <el-table-column prop="recharge" width="100" label="充值" show-overflow-tooltip></el-table-column>
        <el-table-column prop="rechargeGive" width="100" label="充值赠送" show-overflow-tooltip></el-table-column>
        <el-table-column prop="cancelOrder" width="100" label="取消礼品订单" show-overflow-tooltip></el-table-column>
        <el-table-column prop="invalidOrder" width="100" label="作废礼品订单" show-overflow-tooltip></el-table-column>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="本期支出" :render-header="privateHeader">
        <el-table-column prop="exchange" width="100" label="礼品兑换" show-overflow-tooltip></el-table-column>
        <el-table-column prop="giveExpire" width="100" label="赠送到期" show-overflow-tooltip></el-table-column>
      </el-table-column>
      <el-table-column prop="closingBalance" label="期末账户余额" width="140" :render-header="privateHeader" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="240">
        <template slot-scope="scope">
          <el-button name="btnCheck" type="text" @click="viewAccountFlow(scope.row.characterId)">
            账户流水
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pg="searchForm.pageIndex" :size="searchForm.pageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    
    <el-dialog  title="账户流水" :visible.sync="dialogVisible" width="1000px" :before-close="closeReset">
      <el-form :model="accountForm" lable-width="120px" class="item-lh-26" :inline="true" ref="accountSearch">
        <el-form-item label="时间：" prop="time">
          <el-date-picker :clearable="false" name="period" type="daterange" v-model="accountForm.period" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="操作类型：" prop="logType">
          <el-select name="logType" v-model="accountForm.logType" placeholder="商户类型" @change="getAccountFlow">
            <el-option label="全部" :value="''"></el-option>
            <el-option v-for="item in storeBalanceLogTypes.Types" :key="item.key" :label="item.title" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchAccount">搜索</el-button>
          <el-button @click="onDialogReset">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="accountData" class="no-border" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" @selection-change="selectionChange" @sort-change="sortDialogChange">
        <el-table-column prop="createTime" label="操作时间" sortable="custom" width="140" fixed show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="logTypeText" label="操作类型" width="140" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="balanceTypeText" label="收入/支出" width="140" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="price" label="金额" width="100" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="balance" label="礼品帐户余额" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="prevOrder" label="相关单据" width="140" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="createUser" label="操作人" width="140" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="160" show-overflow-tooltip fixed="right">
        </el-table-column>
      </el-table>
      <pagination :pg="accountForm.pageIndex" :size="accountForm.pageSize" :total="accountTotal" @currentChange="currChange" @sizeChange="flowSizeChange"></pagination>
    </el-dialog>
    <export-field-setter
      @submit="exportData"
      :visible.sync="eOpen"
      :api="filedsApi"
      :apiKey="apiKey"
    />
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
  GIFTING_API_STOREBALANCE_GETSTORERECONCILIATIONREPORT,
  GIFTING_API_STOREBALANCE_GETPERIODBALANCELOGSBYSTATION,
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
        period: [
          `${dayjs().format('YYYY-MM')}-01`,
          dayjs().format('YYYY-MM-DD'),
        ],
        periodStart: '',
        periodEnd: '',
        storeName: '',
        companyName: '',
        companyCode: '',
        storeCode: '',
        characterType: '',
        logType: '',
        orderField: '',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 10
      },
      accountForm: {
        logType: '',
        period: [
          `${dayjs().format('YYYY-MM')}-01`,
          dayjs().format('YYYY-MM-DD'),
        ],
        orderField: 'period',
        periodStart: '',
        periodEnd: '',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 10
      },
      dialogVisible: false,
      dialogLoading: false,
      eOpen: false,
      selectedItems: [],
      total: 0,
      accountTotal: 0,
      characterId: '',
      filedsApi: GIFTING_API_STOREEXPORTER_GETEXPORTFIELDS, // 查询导出数据的可选列
      apiKey: 'STOREBALANCE_GETSTORERECONCILIATIONREPORT',
      exportType: 1,
      selectionsId: [],
      thisData: {
        startData: '',
        endData: '',
      }
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: '/gift/jewelerReconciliationReport/index',
        query:  this.parameter
      })
    },
    init() {
      let query = this.$route.query || {
      }
      this.parameter.characterType  = query.characterType || ''
      this.parameter.companyCode = query.companyCode || ''
      this.parameter.companyName = query.companyName || ''
      this.parameter.storeCode = query.storeCode || ''
      this.parameter.storeName = query.storeName || ''
      this.parameter.period = query.period || [`${dayjs().format('YYYY-MM')}-01`,dayjs().format('YYYY-MM-DD')]
      this.parameter.periodStart = query.periodStart || `${dayjs().format('YYYY-MM')}-01`
      this.parameter.periodEnd = query.periodEnd || dayjs().format('YYYY-MM-DD')
      this.parameter.orderField = query.orderField || ''
      this.parameter.orderType = query.orderType || YNStatus.No
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.pageSize = query.pageSize || 10
      this.parameter.logType = query.logType || ''
      this.searchForm = Object.assign({
      }, this.parameter)
      this.getData()
    },
    getData() {
      let parameter = Object.assign({
      }, this.searchForm, this.parameter, {
        periodStart: this.parameter.period[0],
        periodEnd: this.parameter.period[1]
      })
      this.$store.commit('SET_TB_LOADING', true)
      GIFTING_API_STOREBALANCE_GETSTORERECONCILIATIONREPORT(parameter).then(res => {
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
      if (
        JSON.stringify(this.$route.query) == JSON.stringify(this.searchForm)
      ) {
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
    selectionChange(v) {
      this.selectedItems = v
    },
    sortChange(v) {
      this.parameter.orderType = v.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.parameter.orderField = v.prop || ''
      this.initRoute()
    },
    viewAccountFlow(id) {
      this.dialogVisible = true
      if(id) {
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
      para.periodStart = this.accountForm.period && this.accountForm.period.length ? this.accountForm.period[0] : ''
      para.periodEnd = this.accountForm.period && this.accountForm.period.length ? this.accountForm.period[1] : ''
      GIFTING_API_STOREBALANCE_GETPERIODBALANCELOGSBYSTATION(para).then(res => {
        if(res.data.Code == 'CORRECT') {
          this.accountData = res.data.Data.rows
          this.accountTotal = res.data.Data.total
        }
      })
    },
    exportData(fields) {
      const para = {
        ...this.searchForm,
        periodStart: this.searchForm.period[0],
        periodEnd: this.searchForm.period[1],
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
      this.accountForm.period = [`${dayjs().format('YYYY-MM')}-01`, dayjs().format('YYYY-MM-DD')]
      this.accountForm.pageIndex = 1
      this.accountForm.pageSize = 10
      this.getAccountFlow()
    },
    closeReset() {
      this.$refs['accountSearch'].resetFields()
      this.accountForm.period = [`${dayjs().format('YYYY-MM')}-01`, dayjs().format('YYYY-MM-DD')]
      this.accountData = []
      this.accountTotal = 10
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
      this.accountForm.orderField = v.prop || ''
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
    privateHeader(createElement, {
      column
    }) {
      let header, content
      if (column.label === '期初账户余额') {
        header = column.label
        content = '所选时间之前的账户余额'
      } else if (column.label === '本期收入') {
        header = column.label
        content = '所选时间范围内的收入'
      } else if (column.label === '本期支出') {
        header = column.label
        content = '所选时间范围内的支出'
      } else if (column.label === '期末账户余额') {
        header = column.label
        content = '截至所选时间的账户余额'
      }
      return createElement('span', [
        createElement('span', {
        }, [header]),
        createElement(
          'el-tooltip',
          {
            attrs: {
              placement: 'top',
              effect: 'light',
              class: 'el-icon-question',
              content: content
            }
          },
          [
            createElement(
              'i',
              {
                attrs: {
                  style: 'margin-left:5px;' 
                }
              },
              ['']
            )
          ]
        )
      ])
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
