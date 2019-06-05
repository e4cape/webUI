<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" @keyup.enter.native="onSearch" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-dropdown class="multi-operation" @command="multiOperation" v-if="data.length">
            <el-button type="primary">
              批量操作
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="Received" v-if="characterType === CharacterType.Store">批量收货</el-dropdown-item>
              <el-dropdown-item command="Reject">批量退回</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select v-model="queryForm.State" @change="onSearch" name="State">
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="(item,index) in GoodsAllotOrderIntakeState.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="OutakeCode">
            <el-input v-model="queryForm.OutakeCode" :maxlength="50" placeholder="单据编号" name="OutakeCode">
              <el-button slot="append" icon="el-icon-search" @click="onSearch" name="btnSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="调拨类型：" prop="SourceType" v-if="characterType === CharacterType.Store">
            <el-select v-model="queryForm.SourceType">
              <el-option label="所有方式" value="0"></el-option>
              <el-option v-for="(item, index) in GoodsAllotOrderOutakeSourceType.Types" :key="index" :value="index" :label="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收货方式：" prop="ShippingType">
            <el-select v-model="queryForm.ShippingType" placeholder="所有方式" :filterable="true" name="ShippingType">
              <el-option label="所有方式" value="0"></el-option>
              <el-option v-for="(item,index) in ShippingType.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单据编号：" prop="OutakeCode">
            <el-input v-model="queryForm.OutakeCode" :maxlength="50" name="OutakeCode"></el-input>
          </el-form-item>
          <el-form-item label="快递单号：" prop="ExpressCode">
            <el-input v-model="queryForm.ExpressCode" :maxlength="50" name="ExpressCode"></el-input>
          </el-form-item>
          <el-form-item label="收货人：" prop="CheckUserId">
            <el-select v-model="queryForm.CheckUserId">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.users" :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="来源：" prop="UnitedName1">
            <el-input v-model="queryForm.UnitedName1" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="发货时间：" prop="SendTime" name="createTime">
            <el-date-picker v-model="queryForm.SendTime" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="收货时间：" prop="IntakeTime" name="receiveTime">
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
      <el-table-column prop="UnitedName1" label="来源" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoodsQty" label="数量" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ReasonTypeDv" label="调拨原因" min-width="100" show-overflow-tooltip></el-table-column>
      <template v-if="characterType === CharacterType.Store">
        <el-table-column prop="SourceType" label="调拨类型" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PreviousCode" label="门店分货单" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="SplitQty" label="分货数量" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoodsQty" label="调拨数量" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Preprice" label="结算金额" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
      </template>
      <el-table-column prop="ShippingType" label="收货方式" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ExpressCode" label="快递单号" min-width="110" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ActualDate" label="业务日期" :formatter="formatter" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="SendTime" label="发货时间" :formatter="formatter" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="IntakeTime" label="收货时间" :formatter="formatter" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ReceiveUser" label="收货人" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="UnitedName2" label="收货仓库" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.WarehouseName2? `${scope.row.WarehouseName2}` : scope.row.UnitedName2 }}</template>
      </el-table-column>
      <el-table-column prop="IntakeState" label="状态" min-width="90" fixed="right">
        <template slot-scope="scope">
          <el-tooltip :disabled="!scope.row.CheckNote" class="item" :content="scope.row.CheckNote" placement="top" effect="light">
            <span>{{GoodsAllotOrderIntakeState.Types[scope.row.State]}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <router-link :to="{path:'/depot/goodsappropin/check',query:{id: scope.row.IntakeId}}" class="btn-link el-button el-button--text" name="btnShow">查看</router-link>
          <!-- && scope.row.WarehouseId2 -->
          <template v-if="scope.row.IntakeState === GoodsAllotOrderIntakeState.Wait">
            <el-button type="text" @click="receiveAppropIn($event, scope.row)" name="btnReceiveAppropIn">收货入库</el-button>
            <el-button type="text" @click="rejectAppropIn(scope.row)" name="btnRejectAppropIn">退回</el-button>
            <router-link :to="{path:'/depot/goodsappropin/edit',query:{id: scope.row.IntakeId}}" class="btn-link el-button el-button--text" name="btnAppropInEdit">核对</router-link>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- @module Dialog·退回 -->
    <approp-in-reject :visible.sync="rejectDialog" :data="selections" @listenRejectDialog="listenRejectDialog"></approp-in-reject>
    <!-- End Dialog·退回 -->
    <!-- 收货入库 -->
    <receive :visible.sync="appropInDialog" :data="selections[0]" @appropInReceived="appropInReceived"></receive>
  </div>
</template>

<script>
import {
  GoodsAllotOrderIntakeState,
  GoodsAllotOrderOutakeSourceType
} from '@/enums/stocking.js'
import { CharacterType, YNStatus, ShippingType } from '@/enums/common.js'
import {
  STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_GETS,
  STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_RECEIVE,
  STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_RECEIVES
} from '@/apis/stocking.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import appropInReject from './appropInReject'
import receive from './receive'

export default {
  data() {
    return {
      CharacterType,
      YNStatus,
      ShippingType,
      GoodsAllotOrderIntakeState,
      GoodsAllotOrderOutakeSourceType,
      appropInDialog: false,
      appropInForm: {
        WarehouseId2: '',
        ShelfId2: '',
        Items: [],
        IntakeId: ''
      },
      queryForm: {
        // 查询表单数据
        State: '0',
        SourceType: '0',
        ShippingType: '0',
        CheckUserId: '0',
        OrderBy: 2,
        IsAsced: String(YNStatus.No),
        OutakeCode: '',
        UnitedName1: '',
        IntakeTime1: '',
        IntakeTime2: '',
        ExpressCode: '',
        SendTime1: '',
        SendTime2: '',
        ActualDate1: '',
        ActualDate2: '',
        SendTime: [],
        IntakeTime: [],
        ActualDate: [],
        PageIndex: 1,
        PageSize: 20
      },
      data: [],
      total: 0,
      selections: [], // 选中的单据
      rejectDialog: false, // 退回对话框
      parameters: {}
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  methods: {

    selectionChange(selection) {
      this.selections = selection
    },
    multiOperation(command) {
      if (
        !this.selections.length ||
        this.selections.filter(item => {
          if (item.IntakeState !== this.GoodsAllotOrderIntakeState.Wait) {
            return item
          }
        }).length > 0
      ) {
        this.$message.error('请选择待收货的调拨入库单')
      } else {
        if (command === 'Reject') {
          this.rejectDialog = true
        } else {
          this.appropInForm.Items = this.selections.map(item => {
            return {
              IntakeId: item.IntakeId
            }
          })
          if (this.characterType === CharacterType.Company) {
            this.appropInDialog = true
          } else {
            this.appropInReceived()
          }
        }
      }
    },
    rejectAppropIn(row) {
      this.rejectDialog = true
      this.selections = [row]
    },
    listenRejectDialog(v) {
      this.selections = []
      this.$refs.tableData.clearSelection()
      if (v) {
        this.getData()
      }
    },
    receiveAppropIn($event, row) {
      
      this.appropInForm.IntakeId = row.IntakeId
      if (this.characterType === CharacterType.Company) {
        this.selections = [row]
        this.appropInDialog = true
      } else {
        $event.currentTarget.blur()
        this.appropInReceived()
      }
    },
    appropInReceived(form) {
      if (form) {
        this.appropInForm = { ...this.appropInForm, ...form }
      }
      
      this.$confirm(
        '您正在进行收货入库操作，入库后不可撤销！确定收货入库？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        let result
        if (this.appropInForm.Items.length > 0 && this.appropInForm.IntakeId) {
          result = STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_RECEIVES({
            Items: this.appropInForm.Items,
            WarehouseId2: this.appropInForm.WarehouseId2 || 0,
            ShelfId2: this.appropInForm.ShelfId2 || 0
          })
        } else {
          result = STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_RECEIVE({
            IntakeId: this.appropInForm.IntakeId,
            WarehouseId2: this.appropInForm.WarehouseId2 || 0,
            ShelfId2: this.appropInForm.ShelfId2 || 0
          })
        }
        result.then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success(res.data.Message)
            this.appropInForm.Items = []
            this.appropInForm.IntakeId = ''
            this.appropInDialog = false
            this.selctions = []
            this.getData()
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }).catch(() => {})
    },
    formatter(row, column, val) {
      switch (column.property) {
        case 'IntakeState':
          return GoodsAllotOrderIntakeState.Types[val]
        case 'ShippingType':
          return ShippingType.Types[val]
        case 'SourceType':
          return GoodsAllotOrderOutakeSourceType.Types[val]
        case 'SendTime':
        case 'IntakeTime':
          return this.$options.filters.filterDateMinutes(val)
        case 'ActualDate':
          return this.$options.filters.filterDate(val)
        default:
          return '￥' + this.$root.toFloat(val)
      }
    },
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            State: '0',
            SourceType: '0',
            ShippingType: '0',
            CheckUserId: '0',
            OrderBy: 2,
            IsAsced: String(YNStatus.No),
            OutakeCode: '',
            UnitedName1: '',
            IntakeTime1: '',
            IntakeTime2: '',
            ExpressCode: '',
            SendTime1: '',
            SendTime2: '',
            ActualDate1: '',
            ActualDate2: '',
            SendTime: [],
            IntakeTime: [],
            ActualDate: [],
            PageIndex: 1,
            PageSize: 20
          }
      query.PageIndex = parseInt(query.PageIndex)
      query.PageSize = parseInt(query.PageSize)
      query.SendTime = query.SendTime || []
      query.IntakeTime = query.IntakeTime || []
      if (query.isSenior) {
        query.isSenior = query.isSenior === 'true' ? true : false
      }
      this.parameters = Object.assign({}, query)
      this.queryForm = {
        ...this.parameters
      }
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
          if(this.parameters.PageIndex !== 1 && this.data.length === 0) {
            this.onSearch()
          }
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'OutakeCode':
          this.parameters.OrderBy = 0
          break
        case 'IntakeTime':
          this.parameters.OrderBy = 1
          break
        case 'SendTime':
          this.parameters.OrderBy = 2
          break
        default:
          this.parameters.OrderBy = 2
          break
      }
      this.parameters.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.initRoute()
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      if (this.queryForm.SendTime) {
        this.queryForm.SendTime1 = this.queryForm.SendTime[0]
        this.queryForm.SendTime2 = this.queryForm.SendTime[1]
      } else {
        this.queryForm.SendTime1 = ''
        this.queryForm.SendTime2 = ''
      }
      if (this.queryForm.IntakeTime) {
        this.queryForm.IntakeTime1 = this.queryForm.IntakeTime[0]
        this.queryForm.IntakeTime2 = this.queryForm.IntakeTime[1]
      } else {
        this.queryForm.IntakeTime1 = ''
        this.queryForm.IntakeTime2 = ''
      }
      if (this.queryForm.ActualDate) {
        this.queryForm.ActualDate1 = this.queryForm.ActualDate[0]
        this.queryForm.ActualDate2 = this.queryForm.ActualDate[1]
      } else {
        this.queryForm.ActualDate1 = ''
        this.queryForm.ActualDate2 = ''
      }
      this.queryForm.isSenior = true
      if (JSON.stringify(this.parameters) === JSON.stringify(this.queryForm)) {
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
  created() {
    this.$store.dispatch('GET_USERS_DROPLIST')
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init',
    appropInDialog(val) {
      if (!val) {
        this.$refs.tableData.clearSelection()
        this.selections = []
      }
    }
  },
  components: {
    searchPanel,
    pagination,
    appropInReject,
    receive
  }
}
</script>

