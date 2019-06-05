<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-button type="primary" @click="$router.push({path: '/alliance/affiliateManage/affCreate'})">导出Excel</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select name="State" v-model="queryForm.State" placeholder="全部" @change="onSearch">
              <el-option label="全部" :value="'0'"></el-option>
              <el-option v-for="(item, index) in settleTicketBillBasicState.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="TicketName">
            <el-input name="TicketName" v-model="queryForm.TicketName" placeholder="结算单号" @keyup.enter.native="onSearch">
              <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="TicketCode" label="创建日期：">
            <el-date-picker v-model="queryForm.CheckTime" type="daterange" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item prop="TicketName" label="结算单号：">
            <el-input name="TicketName" v-model="queryForm.TicketName" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="TicketName" label="联盟商：">
            <el-select name="TicketType" v-model="queryForm.TicketType" clearable placeholder="请选择" filterable>
              <el-option label="全部" :value="'0'"></el-option>
              <el-option v-for="(item, index) in settleTicketBillBasicState.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="TicketName" label="卡券名称：">
            <el-input name="TicketName" v-model="queryForm.TicketName" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>

          <el-form-item prop="TicketCode" label="创建日期：">
            <el-date-picker v-model="queryForm.CheckTime" type="daterange" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item prop="TicketName" label="支付单号：">
            <el-input name="TicketName" v-model="queryForm.TicketName" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>

          <el-form-item label="结算状态：" prop="State">
            <el-select name="State" v-model="queryForm.State" placeholder="全部" filterable>
              <el-option label="全部" :value="'0'"></el-option>
              <el-option v-for="(item, index) in settleTicketBillBasicState.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结算单类型：" prop="State">
            <el-select name="State" v-model="queryForm.State" placeholder="全部" filterable>
              <el-option label="全部" :value="'0'"></el-option>
              <el-option v-for="(item, index) in settleTicketBillBasicBillType.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <el-table :data="tableData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column show-overflow-tooltip prop="CreateTime" label="创建时间" width="110" fixed>
        <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="BillCode" label="结算单号" min-width="160"></el-table-column>
      <el-table-column show-overflow-tooltip prop="BillType" label="结算单类型" width="100">
        <template slot-scope="scope">{{settleTicketBillBasicBillType.Types[scope.row.BillType]}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="NeiborCode" label="联盟商编号" width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="NeiborName" label="联盟商" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="TicketCode" label="卡券ID" min-width="180"></el-table-column>
      <el-table-column show-overflow-tooltip prop="TicketName" label="卡券名称" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="BillPrice" label="应结算金额" width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="State" label="结算状态" width="70">
        <template slot-scope="scope">{{settleTicketBillBasicState.Types[scope.row.State]}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="PaidPrice" label="实际计算金额" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="ActualDate" label="计算时间" width="110">
        <template slot-scope="scope">{{scope.row.ActualDate | filterDateTime}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="CompanyCode" label="操作" width="160">
        <template slot-scope="scope">
          <el-button type="text" @click="showDetail(scope.row.BillId)">详情</el-button>
          <el-button type="text" v-if="scope.row.State === settleTicketBillBasicState.Wait">审核</el-button>
          <el-button type="text" v-if="scope.row.State === settleTicketBillBasicState.Audit">取消审核</el-button>
          <el-button type="text" v-if="scope.row.State === settleTicketBillBasicState.Audit">结算</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <bonusDetail :visible.sync="detailVisible" :id="showDetailId"></bonusDetail>
  </div>
</template>

<script>
import { SettleTicketBillBasicBillType, SettleTicketBillBasicState } from '@/enums/alliance'
import { YNStatus } from '@/enums/common.js'
import { ALLIANCE_API_SETTLETICKETBILLBASIC_GETS } from '@/apis/alliance'
import pagination from '@/components/pagination'
import searchPanel from '@/components/searchPanel.vue'
import bonusDetail from './bonusDetail'
export default {
  beforeMount() { },
  data() {
    return {
      settleTicketBillBasicBillType: SettleTicketBillBasicBillType,
      settleTicketBillBasicState: SettleTicketBillBasicState,
      queryForm: {
        BillCode: '',
        BillType: 0,
        ActualDate1: '',
        ActualDate2: '',
        NeiborCode: '',
        NeiborName: '',
        TicketCode: '',
        TicketName: '',
        PaidNo: '',
        CreateTime1: '',
        CreateTime2: '',
        State: '0',
        Orderby: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      showDetailId: '',
      detailVisible: false,
      total: 0,
      parameters: {},
      tableData: []
    }
  },
  methods: {
    init() {
      let query = this.$route.query || {}
      this.queryForm = Object.assign(
        this.queryForm,
        {
          BillCode: '',
          BillType: 0,
          ActualDate1: '1900-01-01',
          ActualDate2: '1900-01-01',
          NeiborCode: '',
          NeiborName: '',
          TicketCode: '',
          TicketName: '',
          PaidNo: '',
          CreateTime1: '1900-01-01',
          CreateTime2: '1900-01-01',
          State: '0',
          Orderby: 0,
          IsAsced: YNStatus.No,
          PageIndex: 1,
          PageSize: 20
        },
        query
      )
      this.getData()
    },
    showDetail(id) {
      this.showDetailId = id
      console.log(2222)
      this.detailVisible = true
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      ALLIANCE_API_SETTLETICKETBILLBASIC_GETS(this.queryForm).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Subset
          this.total = res.data.Data.Count
        }
      })
    },
    onSearch() {
      this.queryForm.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }

    },
    onReset() {
      this.queryForm = {
        BillCode: '',
        BillType: 0,
        ActualDate1: '',
        ActualDate2: '',
        NeiborCode: '',
        NeiborName: '',
        TicketCode: '',
        TicketName: '',
        PaidNo: '',
        CreateTime1: '',
        CreateTime2: '',
        State: 0,
        Orderby: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }
      this.onSearch()
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.initRoute()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: this.parameters
      })
    }
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
    bonusDetail
  }
}
</script>
