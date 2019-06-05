<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-button type="primary" @click="$router.push({path: '/alliance/affiliateManage/affCreate'})">新建</el-button>
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
            <el-input name="TicketName" v-model="queryForm.TicketName" placeholder="联盟商编码" @keyup.enter.native="onSearch">
              <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="TicketCode" label="联盟商编码：">
            <el-input name="TicketCode" v-model="queryForm.TicketCode" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="TicketName" label="账号：">
            <el-input name="TicketName" v-model="queryForm.TicketName" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="TicketName" label="联盟商：">
            <el-input name="TicketName" v-model="queryForm.TicketName" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>

          <el-form-item label="类型：" prop="TicketType">
            <el-select name="TicketType" v-model="queryForm.TicketType" clearable placeholder="请选择" filterable>
              <el-option label="全部" :value="'0'"></el-option>
              <el-option v-for="(item, index) in ticketBasicTicketType.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="TicketName" label="联系人：">
            <el-input name="TicketName" v-model="queryForm.TicketName" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="TicketName" label="联系人手机：">
            <el-input name="TicketName" v-model="queryForm.TicketName" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="State">
            <el-select name="State" v-model="queryForm.State" placeholder="全部" filterable>
              <el-option label="全部" :value="'0'"></el-option>
              <el-option v-for="(item, index) in ticketBasicState.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <el-table :data="tableData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column show-overflow-tooltip prop="TicketCode" label="联盟商编码" min-width="120" fixed></el-table-column>
      <el-table-column show-overflow-tooltip prop="TicketName" label="账号" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="Expiree" label="联盟商" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="PrepareQty" label="类型" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="PrepareQty" label="联系人手机" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="PrepareQty" label="固定电话" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="TicketType" label="地址" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="ActiveDays" label="状态" min-width="120"></el-table-column>
      <el-table-column show-overflow-tooltip prop="CompanyCode" label="操作" min-width="160">
        <template slot-scope="scope">
          <el-button type="text">详情</el-button>
          <el-button type="text" v-if="scope.row.State === ticketBasicState.Wait">审核</el-button>
          <el-button type="text">停用</el-button>
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
