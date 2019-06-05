<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-button type="primary" v-loading="exprotLoading" @click="exportData">导出</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select name="State" v-model="queryForm.State" placeholder="全部" @change="onSearch">
              <el-option label="全部" :value="'0'"></el-option>
              <el-option v-for="(item, index) in ticketOrderBasicState.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="TicketName">
            <el-input name="TicketName" v-model="queryForm.TicketName" placeholder="卡卷名称" @keyup.enter.native="onSearch">
              <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="TicketCode" label="销售时间：">
            <el-date-picker v-model="queryForm.createTime" :unlink-panels="true" type="daterange" format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item prop="OrderCode" label="销售单号：">
            <el-input name="OrderCode" v-model="queryForm.OrderCode" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="AliasName" label="会员昵称：">
            <el-input name="AliasName" v-model="queryForm.AliasName" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="TicketCode" label="卡卷ID：">
            <el-input name="TicketCode" v-model="queryForm.TicketCode" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="TicketName" label="卡卷名称：">
            <el-input name="TicketName" v-model="queryForm.TicketName" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="TrueName" label="姓名：">
            <el-input name="TrueName" v-model="queryForm.TrueName" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="Mobile" label="手机：">
            <el-input name="Mobile" v-model="queryForm.Mobile" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="NeiborName" label="来源联盟商：">
            <el-input name="NeiborName" v-model="queryForm.NeiborName" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="交易状态：" prop="State">
            <el-select name="State" v-model="queryForm.State" placeholder="全部" filterable>
              <el-option label="全部" :value="'0'"></el-option>
              <el-option v-for="(item, index) in ticketOrderBasicState.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <el-table :data="tableData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column show-overflow-tooltip prop="TicketCode" label="卡券ID" min-width="120" fixed></el-table-column>
      <el-table-column show-overflow-tooltip prop="TicketName" label="卡券名称" min-width="120">
        <template  slot-scope="scope">
          <el-button type="text" name="TicketName" @click="showTicketDetail(scope.row.TicketId)">{{scope.row.TicketName}}</el-button>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="Expiree" label="投放日期" min-width="120">
        <template slot-scope="scope">{{scope.row.Expireb | filterDate}}~{{scope.row.Expiree | filterDate}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="PrepareQty" label="投放数量" min-width="120">
        <template slot-scope="scope">{{scope.row.PrepareQty == 0 ? '不限' : scope.row.PrepareQty }}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="TicketType" label="卡券类型" min-width="120">
        <template slot-scope="scope">{{ticketBasicTicketType.Types[scope.row.TicketType]}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="ActiveDays" label="有效期" min-width="120">
        <template slot-scope="scope">{{scope.row.ActiveDays == 0 ? '即时生效': '领取后' + scope.row.ActiveDays + '天生效'}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="NeiborAmt" label="联盟商数" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="State" label="审核状态" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="SettleSharedTime" label="推广可结算日期" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="SettleTransfTime" label="转化可结算日期" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="CompanyCode" label="操作" min-width="220">
        <template slot-scope="scope">
          <button type="text" v-if="scope.row.State === ticketOrderBasicState.Wait">退款</button>
          <button type="text">退款详情</button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <card-detail :visible.sync="ticketDetailVisible" :ticketId="ticketId"></card-detail>

    <return-detail :visible.sync="returnDetailVisible" :ticketId="ticketId"></return-detail>
  </div>
</template>

<script>
import { TicketOrderBasicState, TicketBasicTicketType } from '@/enums/alliance'
import { ALLIANCE_API_TICKETORDERBASIC_GETS, ALLIANCE_API_TICKETORDERBASIC_EXPORT } from '@/apis/alliance'
import pagination from '@/components/pagination'
import searchPanel from '@/components/searchPanel.vue'
import cardDetail from '@/components/alliance/cardDetail.vue'
import returnDetail from './returnDetail.vue'
export default {
  beforeMount() { },
  data() {
    return {
      ticketOrderBasicState: TicketOrderBasicState,
      ticketBasicTicketType: TicketBasicTicketType,
      queryForm: {
        OrderCode: '',
        NeiborName: '',
        TrueName: '',
        AliasName: '',
        Mobile: '',
        TicketCode: '',
        TicketName: '',
        createTime: [],
        CheckTime1: '',
        CheckTime2: '',
        State: '0',
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      ticketId: '',
      ticketDetailVisible: false,
      returnDetailVisible: false,
      exprotLoading: false,
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
          OrderCode: '',
          NeiborName: '',
          TrueName: '',
          AliasName: '',
          Mobile: '',
          TicketCode: '',
          TicketName: '',
          createTime: [],
          CheckTime1: '',
          CheckTime2: '',
          State: '0',
          PageIndex: 1,
          PageSize: 20
        },
        query
      )
      this.getData()
    },
    showTicketDetail(id) {
      this.ticketId = id
      this.ticketDetailVisible = true
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      ALLIANCE_API_TICKETORDERBASIC_GETS(this.queryForm).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Total
        }
      })
    },
    exportData() {
      this.exprotLoading = true
      ALLIANCE_API_TICKETORDERBASIC_EXPORT(this.queryForm).then(res => {
        this.exprotLoading = false
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Total
        }
      }).catch(() => {
        this.exprotLoading = false
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
        OrderCode: '',
        NeiborName: '',
        TrueName: '',
        AliasName: '',
        Mobile: '',
        TicketCode: '',
        TicketName: '',
        createTime: [],
        CheckTime1: '',
        CheckTime2: '',
        State: '0',
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
    cardDetail,
    returnDetail
  }
}
</script>
