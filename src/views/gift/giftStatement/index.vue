<template>
  <div class="content">
    <el-form :model="queryForm" ref="queryForm" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-button name="btnExport" type="primary" @click="exportVisible=true">导出</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="status">
            <el-dropdown name="btnCommand" @command="selectstatus">
              <el-button type="default" style="width: 100px">
                {{activeState}}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="''">所有状态</el-dropdown-item>
                <el-dropdown-item v-for="item in financeDailyBillStatus.Types" :key="item.key" :command="item.key">{{item.title}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item>
            <el-input name="orderCode" v-model="queryForm.orderCode" placeholder="礼品订单" @keyup.enter.native="onSearch">
              <el-button  name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="礼品订单：" prop="orderCode">
            <el-input name="orderCode" v-model="queryForm.orderCode" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="供应商编码：" v-if="$store.getters.user_session.CharacterType == characterType.Lingcb" prop="supplierCode">
            <el-input name="supplierCode" v-model="queryForm.supplierCode" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="供应商名称：" v-if="$store.getters.user_session.CharacterType == characterType.Lingcb" prop="supplierName">
            <el-input name="supplierName" v-model="queryForm.supplierName" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="商户类型：" v-if="$store.getters.user_session.CharacterType == characterType.Lingcb" prop="characterTypeM">
            <el-select name="characterTypeM" filterable v-model="queryForm.characterTypeM" placeholder="全部">
              <el-option label="全部" value></el-option>
              <el-option label="珠宝公司" :value="characterType.Company"></el-option>
              <el-option label="珠宝门店" :value="characterType.Store"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公司编码：" v-if="$store.getters.user_session.CharacterType == characterType.Lingcb" prop="characterCode">
            <el-input name="companyCode" v-model="queryForm.companyCode" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="公司名称：" v-if="$store.getters.user_session.CharacterType == characterType.Lingcb" prop="characterName">
            <el-input name="companyName"  v-model="queryForm.companyName" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="门店编码：" v-if="$store.getters.user_session.CharacterType == characterType.Lingcb" prop="characterName">
            <el-input name="storeCode"  v-model="queryForm.storeCode" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="门店名称：" v-if="$store.getters.user_session.CharacterType == characterType.Lingcb" prop="characterName">
            <el-input name="storeName"  v-model="queryForm.storeName" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="收货时间：" prop="receiveTime">
            <el-date-picker  name="receiveTime" type="daterange" v-model="queryForm.receiveTime" unlink-panels :picker-options="$root.datePickerOptions" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="data" class="table m-t-10" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" @sort-change="sortChange">
      <el-table-column prop="receiveTime" fixed sortable label="收货时间" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="wholesalePrice" label="批发金额" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="orderCode" label="礼品订单" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <router-link name="btnLink" :to="{path:'/gift/giftOrder/orderCheck',query:{orderId:scope.row.orderId}}" class="btn-link el-button el-button--text">{{scope.row.orderCode}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="supplierCode" label="供应商编码" min-width="100" show-overflow-tooltip v-if="$store.getters.user_session.CharacterType == characterType.Lingcb"></el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" min-width="100" show-overflow-tooltip v-if="$store.getters.user_session.CharacterType == characterType.Lingcb"></el-table-column>
      <el-table-column prop="characterTypeM" label="商户类型" min-width="140" show-overflow-tooltip v-if="$store.getters.user_session.CharacterType == characterType.Lingcb">
        <template slot-scope="scope">
          {{scope.row.characterTypeM == characterType.Store ? '珠宝门店' : scope.row.characterTypeM == characterType.Company ? '珠宝公司' : ''}}
        </template>
      </el-table-column>
      <el-table-column prop="companyCode" label="公司编码" min-width="100" show-overflow-tooltip v-if="$store.getters.user_session.CharacterType == characterType.Lingcb"></el-table-column>
      <el-table-column prop="companyName" label="公司名称" min-width="100" show-overflow-tooltip v-if="$store.getters.user_session.CharacterType == characterType.Lingcb"></el-table-column>
      <el-table-column prop="storeCode" label="门店编码" min-width="100" show-overflow-tooltip v-if="$store.getters.user_session.CharacterType == characterType.Lingcb"></el-table-column>
      <el-table-column prop="storeName" label="门店名称" min-width="100" show-overflow-tooltip v-if="$store.getters.user_session.CharacterType == characterType.Lingcb"></el-table-column>
      <el-table-column prop="expressTypeText" label="快递公司 " min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="expressCode" label="快递单号" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="expressNote" label="发货备注" min-width="220" show-overflow-tooltip></el-table-column>
      <el-table-column prop="statusText" fixed="right" label="状态" min-width="100" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- @module 导出 -->
    <export-filed-setter title="导出" :visible.sync="exportVisible" :api="filedsApi" :apiKey="apiKey" @submit="exportData"></export-filed-setter>
    <!-- End 导出 -->
    <pagination :total="total" :pg="queryForm.pageIndex" :size="queryForm.pageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>
<script>
import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
import ExportFiledSetter from '@/components/exportFieldSetter'
import {
  FinanceDailyBillStatus
} from '@/enums/gifting'
import { CharacterType, YNStatus } from '@/enums/common'
import {
  GIFTING_API_FINANCEDAILYBILL_SEARCH,
  GIFTING_API_STOREEXPORTER_GETEXPORTFIELDS,
  GIFTING_API_STOREEXPORTER_EXPORTTOFILE
} from '@/apis/gifting'
export default {
  data() {
    return {
      financeDailyBillStatus: FinanceDailyBillStatus,
      characterType: CharacterType,
      activeState: '所有状态', // 显示状态
      queryForm: {
        supplierCode: '',
        supplierName: '',
        storeCode: '',
        storeName: '',
        companyCode: '',
        companyName: '',
        characterCode: '',
        characterName: '',
        characterTypeM: '',
        status: '',
        orderCode: '',
        receiveTime: '',
        orderField: 'receiveTime',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 20
      }, // 用于搜索条件双向数据绑定的数据变化
      parameter: {
      }, // 用于传给后台接口做数据帅选
      total: 0,
      data: [],
      exportVisible: false,
      filedsApi: GIFTING_API_STOREEXPORTER_GETEXPORTFIELDS, // 查询数据的api名称
      apiKey: 'FINANCEDAILYBILL_SEARCH'
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: this.$router.path, query: JSON.parse(JSON.stringify(this.parameter)) 
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.status = query.status || ''
      this.parameter.receiveTime = query.receiveTime || ['', '']
      this.parameter.orderCode = query.orderCode || ''
      this.parameter.orderField = query.orderField || 'receiveTime'
      this.parameter.orderType = query.orderType || YNStatus.No
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.pageSize = query.pageSize || 20
      this.activeState = !query.status ? '所有状态' : this.financeDailyBillStatus.Types.filter(item => item.key == query.status)[0].title
      this.getData()
    },
    getData() {
      let parameter = Object.assign(this.queryForm, this.parameter, {
        receiveTimeStart: this.parameter.receiveTime[0],
        receiveTimeEnd: this.parameter.receiveTime[1]
      })
      this.$store.commit('SET_TB_LOADING', true)
      GIFTING_API_FINANCEDAILYBILL_SEARCH(parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$store.commit('SET_TB_LOADING', false)
          this.data = res.data.Data.rows
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
      // 搜索相关
      this.queryForm.pageIndex = 1
      this.parameter = Object.assign({
      }, this.queryForm)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.queryForm = {
        supplierCode: '',
        supplierName: '',
        storeCode: '',
        storeName: '',
        companyCode: '',
        companyName: '',
        characterCode: '',
        characterName: '',
        characterTypeM: '',
        status: '',
        orderCode: '',
        receiveTime: '',
        orderField: 'receiveTime',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 20
      }
      this.onSearch()
    },
    selectstatus (v) {
      this.parameter.pageIndex = 1
      this.parameter.status = v
      this.initRoute()
    },
    sortChange(sort) {
      // 表单排序
      this.queryForm.orderField = sort.prop
      this.queryForm.orderType = sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    exportData (fields) {
      GIFTING_API_STOREEXPORTER_EXPORTTOFILE({
        apiKey: this.apiKey,
        exportFields: fields,
        exportType: 1,
        apiParameter: this.queryForm
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.exportVisible = false
          this.$message.success('导出成功！')
          window.open(this.$root.settings.DOMAIN_TEMP + res.data.Data)
        }
      })
    }
  },
  created () {
    // if (this.$store.getters.user_session.CharacterType !== this.characterType.Store) {
    //   this.$message.error('账号权限不足')
    //   this.$router.push('/login')
    // }
  },
  mounted() {
    this.init()
  },
  filters: {
    filterCharacterType (value) {
      let title = ''
      CharacterType.Types.forEach(item => {
        if (item.key == value) {
          title = item.title
        }
      })
      console.log(title)
      return title
    }
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination,
    searchPanel,
    ExportFiledSetter
  }
}
</script>