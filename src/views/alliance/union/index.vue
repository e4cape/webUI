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
              <el-option v-for="(item, index) in settleTicketBillBasicBillType.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="TicketName">
            <el-input name="TicketName" v-model="queryForm.TicketName" placeholder="卡卷名称" @keyup.enter.native="onSearch">
              <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="TicketCode" label="关键字：" v-if="$store.getters.user_session.CharacterType == characterType.Store">
            <el-input name="TicketCode" placeholder="珠宝商编码/名称" v-model="queryForm.TicketCode" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="HasTicket" label="联盟券统计：" v-if="$store.getters.user_session.CharacterType == characterType.Store">
            <el-select name="State" v-model="queryForm.HasTicket" placeholder="全部" @change="onSearch">
              <el-option label="全部" :value="'0'"></el-option>
              <el-option v-for="(item, index) in settleTicketBillBasicBillType.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="TicketId" label="卡卷ID：">
            <el-input name="TicketCode" v-model="queryForm.TicketCode" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="TicketName" label="卡卷名称：">
            <el-input name="TicketName" v-model="queryForm.TicketName" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <el-table :data="tableData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column show-overflow-tooltip prop="TicketCode" label="珠宝商编码" min-width="120" v-if="$store.getters.user_session.CharacterType == characterType.Store"></el-table-column>
      <el-table-column show-overflow-tooltip prop="TicketCode" label="珠宝商名称" min-width="120" v-if="$store.getters.user_session.CharacterType == characterType.Store"></el-table-column>
      <el-table-column show-overflow-tooltip prop="TicketCode" label="珠宝商类型" min-width="120" v-if="$store.getters.user_session.CharacterType == characterType.Store"></el-table-column>
      <el-table-column show-overflow-tooltip prop="TicketId" label="卡券ID" min-width="60" fixed></el-table-column>
      <el-table-column show-overflow-tooltip prop="TicketName" label="卡券名称" min-width="120" fixed></el-table-column>
      <el-table-column show-overflow-tooltip prop="NeiborAmt" label="联盟商数" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="SharedQty" sortable="custom" label="推广数" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="UnusedQty" sortable="custom" label="未使用" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="LockedQty" sortable="custom" label="已锁定" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="TransfQty" sortable="custom" label="已使用" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="ReturnQty" sortable="custom" label="已退货" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="ExpiredQty" sortable="custom" label="已过期" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="Rate" sortable="custom" label="转化率" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="SharedBillPrice" label="推广结算金额" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="TransfBillPrice" label="转化结算金额" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="CompanyCode" label="操作" min-width="220">
        <template>
          <el-button type="text" @click="$router.push({path:'/alliance/union/couponDetail'})">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>

<script>
import { SettleTicketBillBasicBillType } from '@/enums/alliance'
import { CharacterType, YNStatus } from '@/enums/common.js'
import {

  ALLIANCE_API_TICKETBASIC_LISTBYSTORE,
  ALLIANCE_API_TICKETBASIC_EXPORT1,

} from '@/apis/alliance'
import pagination from '@/components/pagination'
import searchPanel from '@/components/searchPanel.vue'
export default {
  beforeMount() { },
  data() {
    return {
      settleTicketBillBasicBillType: SettleTicketBillBasicBillType,
      characterType: CharacterType,
      yNStatus: YNStatus,
      queryForm: {
        MultiType: '0',
        TicketCode: '',
        TicketName: '',
        UniteNote: '',
        IsAsced: 1,
        Orderby: '0',
        PageIndex: 1,
        PageSize: 20,

      },
      total: 0,

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
          MultiType: '0',
          TicketCode: '',
          TicketName: '',
          UniteNote: '',
          IsAsced: 1,

          Orderby: '0',
          PageIndex: 1,
          PageSize: 20,

        },
        query
      )
      this.getData()
    },

    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      ALLIANCE_API_TICKETBASIC_LISTBYSTORE(this.queryForm).then(res => {
        console.log(res)
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Subset
          this.total = res.data.Data.Count
        }
      })
    },
    exportData() {
      this.exprotLoading = true
      ALLIANCE_API_TICKETBASIC_EXPORT1(this.queryForm)
        .then(res => {
          console.log(res)
          this.exprotLoading = false
          if (res.data.Code === 'CORRECT') {
            this.tableData = res.data.Data.Rows
            this.total = res.data.Data.Total
          }
        })
        .catch(() => {
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
        MultiType: '0',
        TicketCode: '',
        TicketName: '',
        UniteNote: '',
        IsAsced: 1,

        Orderby: '0',
        PageIndex: 1,
        PageSize: 20,

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
