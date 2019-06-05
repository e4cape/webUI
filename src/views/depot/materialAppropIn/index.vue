<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" @keyup.enter.native="onSearch" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-dropdown class="multi-operation" @command="multiOperation" name="multiOperation">
            <el-button type="primary">
              批量操作
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="Received">
                <!-- <el-button type="text">批量收货</el-button> -->
              </el-dropdown-item>
              <el-dropdown-item command="Reject">
                <el-button type="text">批量退回</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="IntakeState">
            <el-select v-model="queryForm.IntakeState" @change="onSearch" placeholder="所有状态" name="receiveType">
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="(item,index) in StuffAllotOrderIntakeState.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="OutakeCode">
            <el-input v-model="queryForm.OutakeCode" placeholder="单据编号" :maxlength="50" name="OutakeCode">
              <el-button slot="append" icon="el-icon-search" @click="onSearch" name="btnSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="来源：" prop="Position">
            <el-cascader v-model="queryForm.Position" :options="[{Id: 0, Value:'所有位置'}, ...$store.getters.wareHouses]" :props="positionArrProps" change-on-select name="Position"></el-cascader>
          </el-form-item>
          <el-form-item label="单据编号：" prop="OutakeCode">
            <el-input v-model="queryForm.OutakeCode" :maxlength="30" name="appropCode"></el-input>
          </el-form-item>
          <el-form-item prop="CheckUserId" label="收货人：">
            <el-select v-model="queryForm.CheckUserId" :filterable="true" name="CheckUserId">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.users" :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="SendTime" label="发货时间：" name="SendTime">
            <el-date-picker v-model="queryForm.SendTime" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item prop="IntakeTime" label="收货时间：" name="IntakeTime">
            <el-date-picker v-model="queryForm.IntakeTime" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item prop="ActualDate" label="业务日期：" name="ActualDate">
            <el-date-picker v-model="queryForm.ActualDate" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- @module 数据表格 -->
    <el-table :data="data" @sort-change="sortChange" @selection-change="selectionChange" ref="tableData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column type="selection" fixed></el-table-column>
      <el-table-column prop="OutakeCode" label="单据编号" min-width="140" sortable="custom" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="WarehouseName1" label="来源" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="AllotQty" label="数量" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="AllotWgt" label="重量" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Preprice" label="金额" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ReasonTypeDv" label="调拨原因" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ActualDate" label="业务日期" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="SendTime" label="发货时间" :formatter="formatter" min-width="150" show-overflow-tooltip sortable></el-table-column>
      <el-table-column prop="IntakeTime" label="收货时间" :formatter="formatter" sortable="custom" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ReceiveUser" label="收货人" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="WarehouseName2" label="收货位置" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="IntakeState" label="状态" min-width="90" fixed="right">
        <template slot-scope="scope">
          <el-tooltip :disabled="!scope.row.CheckNote2" class="item" :content="scope.row.CheckNote2" placement="top" effect="light">
            <span>{{StuffAllotOrderIntakeState.Types[scope.row.IntakeState]}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <router-link :to="{path:'/depot/materialappropin/check',query:{id:scope.row.IntakeId}}" class="btn-link el-button el-button--text" name="btnShow">查看</router-link>
          <template v-if="scope.row.IntakeState === StuffAllotOrderIntakeState.Wait">
            <el-button type="text" @click="handleOrderIntakeDialog(scope.row)" name="handleOrderIntakeDialog">收货入库</el-button>
            <el-button type="text" @click="rejectAppropIn(scope.row)" name="btnRejectAppropIn">退回</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- @module Dialog·退回 -->
    <approp-in-reject :visible.sync="rejectDialog" :data="selections" @listenRejectDialog="listenRejectDialog"></approp-in-reject>
    <!-- End Dialog·退回 -->

    <order-intake :visible.sync="orderIntakeVisible" :data="selections" @listenOrderIntakeVisible="getData"></order-intake>
  </div>
</template>

<script>
import { YNStatus, StuffType } from '@/enums/common.js'
import { StuffAllotOrderIntakeState } from '@/enums/stocking.js'
import { STOCKING_API_STUFF_ALLOT_ORDER_INTAKE_GETS } from '@/apis/stocking.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import appropInReject from './appropInReject'
import orderIntake from './orderIntake'

export default {
  data() {
    return {
      StuffType,
      YNStatus,
      StuffAllotOrderIntakeState,
      queryForm: {
        // 查询表单数据
        Position: [0],
        WarehouseId1: '0',
        ShelfId1: '0',
        CheckUserId: '0',
        IntakeState: '0',
        OrderBy: '1',
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20,
        SendTime: [],
        IntakeTime: [],
        ActualDate: [],
        SendTime1: '',
        SendTime2: '',
        IntakeTime1: '',
        IntakeTime2: '',
        ActualDate1: '',
        ActualDate2: '',
        OutakeCode: ''
      },
      data: [],
      total: 0,
      selections: [], // 选中的单据
      rejectDialog: false, // 退回对话框
      parameters: {},
      positionArrProps: {
        value: 'Id',
        label: 'Value',
        children: 'Childrens'
      },
      orderIntakeVisible: false // 收货
    }
  },
  methods: {
    formatter(row, column, val) {
      switch (column.property) {
        case 'SendTime':
        case 'IntakeTime':
          return this.$options.filters.filterDateMinutes(val)
        case 'CheckUser':
          return StuffAllotOrderIntakeState.Audit === row.IntakeState ? val : '-'
        case 'AllotWgt':
          return this.$root.toFloat(val, 3) + (row.StuffType === StuffType.Stone ? 'ct' : 'g')
        case 'ActualDate':
          return this.$options.filters.filterDate(val)
        default:
          return '￥' + this.$root.toFloat(val)
      }
    },
    getEnums() {
      this.$store.dispatch('GET_USERS_DROPLIST')
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST',  {HasShelf: YNStatus.Yes, State: YNStatus.Yes})
    },
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            Position: [0],
            WarehouseId1: '0',
            ShelfId1: '0',
            CheckUserId: '0',
            IntakeState: '0',
            OrderBy: '1',
            IsAsced: YNStatus.No,
            PageIndex: 1,
            PageSize: 20,
            SendTime: [],
            IntakeTime: [],
            ActualDate: [],
            SendTime1: '',
            SendTime2: '',
            IntakeTime1: '',
            IntakeTime2: '',
            ActualDate1: '',
            ActualDate2: '',
            OutakeCode: ''
          }
      query.PageIndex = parseInt(query.PageIndex)
      query.PageSize = parseInt(query.PageSize)
      query.SendTime = query.SendTime || []
      query.IntakeTime = query.IntakeTime || []
      query.ActualDate = query.ActualDate || []
      query.Position = [parseInt(query.WarehouseId1), parseInt(query.ShelfId1)]
      if (query.isSenior) {
        query.isSenior = query.isSenior === 'true' ? true : false
      }
      this.parameters = { ...query }
      this.queryForm = { ...query }
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_STUFF_ALLOT_ORDER_INTAKE_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
          if(this.parameters.PageIndex !== 1 && this.data.length === 0) {
            this.onSearch()
          }
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      if (this.queryForm.SendTime) {
        this.queryForm.SendTime1 = this.queryForm.SendTime[0] || ''
        this.queryForm.SendTime2 = this.queryForm.SendTime[1] || ''
      } else {
        this.queryForm.SendTime1 = ''
        this.queryForm.SendTime2 = ''
      }
      if (this.queryForm.IntakeTime) {
        this.queryForm.IntakeTime1 = this.queryForm.IntakeTime[0] || ''
        this.queryForm.IntakeTime2 = this.queryForm.IntakeTime[1] || ''
      } else {
        this.queryForm.IntakeTime1 = ''
        this.queryForm.IntakeTime2 = ''
      }
      if (this.queryForm.ActualDate) {
        this.queryForm.ActualDate1 = this.queryForm.ActualDate[0] || ''
        this.queryForm.ActualDate2 = this.queryForm.ActualDate[1] || ''
      } else {
        this.queryForm.ActualDate1 = ''
        this.queryForm.ActualDate2 = ''
      }
      this.queryForm.WarehouseId1 = this.queryForm.Position[0] || '0'
      this.queryForm.ShelfId1 = this.queryForm.Position[1] || '0'
      this.queryForm.isSenior = true
      if (JSON.stringify(this.queryForm) == JSON.stringify(this.parameters)) {
        this.getData()
      } else {
        this.parameters = { ...this.queryForm }
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'OutakeCode':
          this.parameters.OrderBy = 0
          break
        case 'SendTime':
          this.parameters.OrderBy = 1
          break
        case 'IntakeTime':
          this.parameters.OrderBy = 3
          break
        default:
          this.parameters.OrderBy = 1
          break
      }
      this.parameters.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.initRoute()
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
    },
    selectionChange(selection) {
      this.selections = selection
    },
    multiOperation(command) {
      if (
        this.selections.length > 0 &&
        this.selections.every(
          item => item.IntakeState === StuffAllotOrderIntakeState.Wait
        )
      ) {
        if (command === 'Reject') {
          this.rejectDialog = true
        } else {
          this.orderIntakeVisible = true
        }
      } else {
        this.$message.error('请选择待收货状态的原料调拨入库单')
      }
    },
    handleOrderIntakeDialog(row) {
      this.orderIntakeVisible = true
      this.selections = [row]
    },
    rejectAppropIn(row) {
      this.rejectDialog = true
      this.selections = [row]
    },
    // 监听退回弹窗关闭
    listenRejectDialog(v) {
      this.selections = []
      this.$refs.tableData.clearSelection()
      if (v) {
        this.getData()
      }
    },
  },
  created() {
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    searchPanel,
    pagination,
    appropInReject,
    orderIntake
  }
}
</script>
