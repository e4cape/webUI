<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-button type="primary" @click="$router.push({path: '/alliance/allianceCardManage/cardCreate'})">新建</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select name="State" v-model="queryForm.State" placeholder="全部" @change="onSearch">
              <el-option label="全部" :value="'0'"></el-option>
              <el-option v-for="(item, index) in ticketBasicState.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="TicketName">
            <el-input name="TicketName" v-model="queryForm.TicketName" placeholder="卡卷名称" @keyup.enter.native="onSearch">
              <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="TicketCode" label="卡卷ID：">
            <el-input name="TicketCode" v-model="queryForm.TicketCode" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="TicketName" label="卡卷名称：">
            <el-input name="TicketName" v-model="queryForm.TicketName" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>

          <el-form-item label="联盟券类型：" prop="TicketType">
            <el-select name="TicketType" v-model="queryForm.TicketType" clearable placeholder="请选择" filterable>
              <el-option label="全部" :value="'0'"></el-option>
              <el-option v-for="(item, index) in ticketBasicTicketType.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：" prop="State">
            <el-select name="State" v-model="queryForm.State" placeholder="全部" filterable>
              <el-option label="全部" :value="'0'"></el-option>
              <el-option v-for="(item, index) in ticketBasicState.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <el-table :data="tableData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column show-overflow-tooltip prop="TicketCode" label="卡券ID" width="170" fixed></el-table-column>
      <el-table-column show-overflow-tooltip prop="TicketName" label="卡券名称" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="Expiree" label="投放日期" min-width="120">
        <template slot-scope="scope">{{scope.row.Expireb | filterDate}}~{{scope.row.Expiree | filterDate}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="PrepareQty" label="投放数量" width="80">
        <template slot-scope="scope">{{scope.row.PrepareQty == 0 ? '不限' : scope.row.PrepareQty }}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="TicketType" label="卡券类型" width="80">
        <template slot-scope="scope">{{ticketBasicTicketType.Types[scope.row.TicketType]}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="ActiveDays" label="有效期" width="100">
        <template slot-scope="scope">{{scope.row.ActiveDays == 0 ? '即时生效': '领取后' + scope.row.ActiveDays + '天生效'}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="NeiborAmt" label="联盟商数" width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="State" label="审核状态" width="80">
        <template slot-scope="scope">{{ticketBasicState.Types[scope.row.State]}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="SettleSharedTime" label="推广可结算日期" width="120">
        <template slot-scope="scope">{{scope.row.SettleSharedTime | filterDate}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="SettleTransfTime" label="转化可结算日期" width="120">
        <template slot-scope="scope">{{scope.row.SettleTransfTime | filterDate}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="CompanyCode" v-if="isOneNumberManyShopCompany || isOneNumberManyShop || isOneNumberOneStore" label="操作" :width="isOneNumberManyShop ? '70' : '220'">
        <template slot-scope="scope">
          <el-button type="text">详情</el-button>
          <template v-if="isOneNumberManyShopCompany || isOneNumberOneStore">
            <el-button type="text" v-if="scope.row.State === ticketBasicState.Wait">审核</el-button>
            <el-button type="text">绑定联盟商</el-button>
            <el-button type="text">终止发放</el-button>
            <el-button type="text">创建结算单</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>

<script>
import { TicketBasicState, TicketBasicTicketType } from '@/enums/alliance'
import { YNStatus } from '@/enums/common.js'
import { ALLIANCE_API_TICKETBASIC_GETS } from '@/apis/alliance'
import pagination from '@/components/pagination'
import searchPanel from '@/components/searchPanel.vue'
export default {
  beforeMount() { },
  data() {
    return {
      ticketBasicState: TicketBasicState,
      ticketBasicTicketType: TicketBasicTicketType,
      queryForm: {
        TicketCode: '',
        TicketName: '',
        TicketType: '0',
        State: '0',
        IsAsced: YNStatus.No,
        Orderby: 0,
        PageIndex: 1,
        PageSize: 20
      },
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
          TicketCode: '',
          TicketName: '',
          TicketType: '0',
          State: '0',
          IsAsced: YNStatus.No,
          Orderby: 0,
          PageIndex: 1,
          PageSize: 20
        },
        query
      )
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      ALLIANCE_API_TICKETBASIC_GETS(this.queryForm).then(res => {
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
        TicketCode: '',
        TicketName: '',
        TicketType: '0',
        State: '0',
        IsAsced: YNStatus.No,
        Orderby: 0,
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
    searchPanel
  }
}
</script>
