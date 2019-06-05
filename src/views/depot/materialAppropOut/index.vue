<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" @keyup.enter.native="onSearch" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-dropdown @command="showCreateDialog" class="m-r-10">
            <el-button type="primary">
              新建
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, index) in  StuffType.Types" :key="index" :command="index">{{item}}调拨</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown @command="multiAudit">
            <el-button type="default">
              批量操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>批量审核</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select v-model="queryForm.State" @change="onSearch" name="State">
              <el-option label="所有状态" value="0"></el-option>
              <template v-for="(item,index) in StuffAllotOrderOutakeState.Types">
                <el-option v-if="parseInt(index) !== StuffAllotOrderOutakeState.Cancel" :key="index" :label="item" :value="String(index)"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="OutakeCode">
            <el-input v-model="queryForm.OutakeCode" :maxlength="50" name="OutakeCode" placeholder="单据编号">
              <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="发货仓库：" prop="Position">
            <el-cascader v-model="queryForm.Position" :options="[{Id: 0, Value:'所有位置'}, ...$store.getters.wareHouses]" :props="positionArrProps" change-on-select name="Position"></el-cascader>
          </el-form-item>
          <el-form-item label="调拨原因：" prop="ReasonTypeDk">
            <el-select v-model="queryForm.ReasonTypeDk">
              <el-option label="所有原因" value="0"></el-option>
              <el-option v-for="(item,index) in appropOutReasons" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item prop="ShippingType" label="收货方式：">
            <el-select v-model="queryForm.ShippingType" :filterable="true" name="shippingType">
              <el-option label="所有方式" value="0"></el-option>
              <el-option v-for="(item,index) in ShippingType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item prop="IntakeState" label="收货情况：">
            <el-select v-model="queryForm.IntakeState" :filterable="true" name="IntakeState">
              <el-option label="所有情况" value="0"></el-option>
              <el-option v-for="(item,index) in StuffAllotOrderIntakeState.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="OutakeCode" label="单据编号：">
            <el-input v-model="queryForm.OutakeCode" :maxlength="50" name="OutakeCode"></el-input>
          </el-form-item>
          <el-form-item prop="UnitedName2" label="收货位置：">
            <el-input v-model="queryForm.UnitedName2" :maxlength="50" name="UnitedName2"></el-input>
          </el-form-item>
          <el-form-item prop="CreateTime" label="创建时间：" name="createTime">
            <el-date-picker v-model="queryForm.CreateTime" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item prop="CreateUserId" label="创建人：">
            <el-select v-model="queryForm.CreateUserId" :filterable="true" name="CreateUserId">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.users" :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="CheckTime" label="最后操作时间：" name="checkTime">
            <el-date-picker v-model="queryForm.CheckTime" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
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
      <el-table-column prop="OutakeCode" label="单据编号" min-width="160" sortable="custom" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="WarehouseName1" label="发货位置" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="WarehouseName2" label="收货位置" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ActualDate" label="业务日期" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" :formatter="formatter" min-width="160" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="AllotQty" label="数量" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="AllotWgt" label="重量" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Preprice" label="金额" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ReasonTypeDv" label="调拨原因" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CheckTime" label="最后操作时间" :formatter="formatter" min-width="160" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="State" label="状态" min-width="100" fixed="right">
        <template slot-scope="scope">
          <el-tooltip :disabled="!scope.row.CheckNote" class="item" :content="scope.row.CheckNote" placement="top" effect="light">
            <span :class="scope.row.State | findKey(StuffAllotOrderOutakeState)">{{StuffAllotOrderOutakeState.Types[scope.row.State]}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="IntakeState" label="收货情况" min-width="160" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <el-tooltip
            :disabled="!(scope.row.IntakeCheckNote && scope.row.IntakeState === StuffAllotOrderIntakeState.Reject || scope.row.IntakeTime && scope.row.IntakeState === StuffAllotOrderIntakeState.Audit)"
            class="item"
            :content="scope.row.IntakeState === StuffAllotOrderIntakeState.Reject ? scope.row.IntakeCheckNote : $options.filters.filterDateMinutes(scope.row.IntakeTime)"
            placement="top"
            effect="light"
          >
            <span>{{StuffAllotOrderIntakeState.Types[scope.row.IntakeState]||'--'}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="160" fixed="right">
        <template slot-scope="scope">
          <router-link :to="{path:'/depot/materialappropout/check',query:{id:scope.row.OutakeId}}" class="btn-link el-button el-button--text" name="btnShowDetail">查看</router-link>
          <template v-if="scope.row.State === StuffAllotOrderOutakeState.Reject || scope.row.State === StuffAllotOrderOutakeState.Draft">
            <router-link :to="{path:'/depot/materialappropout/edit',query:{id:scope.row.OutakeId}}" class="btn-link el-button el-button--text" name="btnAppropOutEdit">编辑</router-link>
            <el-button type="text" @click="appropOutAbandon(scope.row)" name="btnAppropOutAbandon">作废</el-button>
          </template>
          <el-button type="text" @click="appropOutAudit(scope.row)" v-if="scope.row.State === StuffAllotOrderOutakeState.Wait" name="btnAppropOutAudit">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- @module 新建原料调拨出库单 -->
    <el-dialog title="新建原料调拨出库单" :visible.sync="createDialog" @close="resetForm">
      <el-form label-position="right" label-width="100px" :model="createForm" :rules="createRules" ref="createForm">
        <el-form-item label="发货位置" required>
          <div class="position">
            <el-form-item prop="WarehouseId1" class="item">
              <el-select v-model="createForm.WarehouseId1" @change="getShelfId1List">
                <template v-for="(item, index) in $store.getters.wareHouses">
                  <el-option v-if="item.State === YNStatus.Yes" :key="index" :value="item.Id" :label="item.Value"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item prop="ShelfId1" class="item">
              <el-select v-model="createForm.ShelfId1">
                <el-option v-for="(item, index) in shelfId1List" :key="index" :value="item.Id" :label="item.Value"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="收货位置" required>
          <div class="position">
            <el-form-item prop="WarehouseId2" class="item">
              <el-select v-model="createForm.WarehouseId2" @change="getShelfId2List">
                <template v-for="(item, index) in $store.getters.wareHouses">
                  <el-option v-if="item.State === YNStatus.Yes" :key="index" :value="item.Id" :label="item.Value"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item prop="ShelfId2" class="item">
              <el-select v-model="createForm.ShelfId2">
                <el-option v-for="(item, index) in shelfId2List" :key="index" :value="item.Id" :label="item.Value"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="调拨原因" prop="ReasonTypeDk">
          <el-select v-model="createForm.ReasonTypeDk" @change="getReasonTypeDv" name="ReasonTypeDk">
            <template v-for="(item, index) in appropOutReasons">
              <el-option v-if="item.State === YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </template>
          </el-select>
          <span class="icon-set-item" @click="reasonDialog=true" name="iconSetItem">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item label="业务日期" prop="ActualDate">
          <el-date-picker v-model="createForm.ActualDate" :picker-options="$store.getters.businessDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="Note">
          <el-input type="textarea" v-model="createForm.Note" :maxlength="200" name="Note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createappropOut" :loading="$store.getters.is_loading" name="btnCreateappropOut">确 定</el-button>
        <el-button @click="createDialog = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·新建成品调拨出库单 -->

    <!-- @module Dialog·新建调拨出库原因 -->
    <dict-manage
      :visible.sync="reasonDialog"
      :dicts="appropOutReasons"
      dialogTitle="原料调拨出库原因类型"
      :dictType="SettingDictionaryDictType.HalfAllotOrderOutakeReasonType"
      @listenDictSave="getappropOutReason"
    ></dict-manage>
    <!-- End Dialog·新建调拨出库原因  -->

    <!-- @module Dialog·审核 -->
    <appropOut-audit :visible.sync="auditDialog" :data="selections" @listenAuditDialog="listenAuditDialog"></appropOut-audit>
    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <appropOut-abandon :visible.sync="abandonDialog" :data="abandonAppropOut" @listenAbandonDialog="getData"></appropOut-abandon>
    <!-- End Dialog·作废 -->
  </div>
</template>

<script>
import { YNStatus, StuffType } from '@/enums/common.js'
import {
  StuffAllotOrderOutakeState,
  SettingDictionaryDictType,
  StuffAllotOrderIntakeState
} from '@/enums/stocking.js'
import { MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST } from '@/apis/merchant.js'
import {
  STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_GETS,
  STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_CREATE
} from '@/apis/stocking.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import dictManage from '@/components/erp/dictManage'
import appropOutAbandon from './appropOutAbandon'
import appropOutAudit from './appropOutAudit'
import dayjs from 'dayjs'

export default {
  data() {
    return {
      YNStatus,
      StuffType,
      StuffAllotOrderIntakeState,
      StuffAllotOrderOutakeState,
      SettingDictionaryDictType,
      queryForm: {
        // 查询表单数据
        Position: [0],
        WarehouseId1: '0',
        ShelfId1: '0',
        ReasonTypeDk: '0',
        ShippingType: '0',
        CreateUserId: '0',
        IntakeState: '0',
        State: '0',
        OrderBy: '0',
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20,
        CreateTime: [],
        CheckTime: [],
        ActualDate: [],
        CreateTime1: '',
        CreateTime2: '',
        CheckTime1: '',
        CheckTime2: '',
        ActualDate1: '',
        ActualDate2: '',
        OutakeCode: '',
        UnitedName2: ''
      },
      appropOutReasons: [], // 调拨出库原因
      data: [],
      total: 0,
      selections: [], // 选中的单据
      createDialog: false, // 新建对话框
      auditDialog: false, // 审核对话框
      abandonDialog: false, // 作废对话框
      abandonAppropOut: {}, // 作废调拨出库单
      reasonDialog: false, // 新建调拨出库原因对话框
      createForm: {
        StuffType: '',
        WarehouseId1: '',
        ShelfId1: '',
        WarehouseId2: '',
        ShelfId2: '',
        ReasonTypeDk: '',
        ReasonTypeDv: '',
        Note: '',
        ActualDate: ''
      },
      createRules: {
        ReasonTypeDk: [
          {
            required: true,
            message: '请选择调拨原因',
            trigger: 'change'
          }
        ],
        WarehouseId1: [
          {
            required: true,
            message: '请选择发货仓库',
            trigger: 'change'
          }
        ],
        ShelfId1: [
          {
            required: true,
            message: '请选择发货货架',
            trigger: 'change'
          }
        ],
        WarehouseId2: [
          {
            required: true,
            message: '请选择收货仓库',
            trigger: 'change'
          }
        ],
        ShelfId2: [
          {
            required: true,
            message: '请选择收货货架',
            trigger: 'change'
          }
        ],
        ActualDate: [
          {
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ],
      },
      parameters: {},
      positionArrProps: {
        value: 'Id',
        label: 'Value',
        children: 'Childrens'
      },
      shelfId1List: [],
      shelfId2List: []
    }
  },
  methods: {
    formatter(row, column, val) {
      // 表格格式化
      switch (column.property) {
        case 'CheckTime':
        case 'CreateTime':
          return this.$options.filters.filterDateMinutes(val)
        case 'AllotWgt':
          return this.$root.toFloat(val, 3) + (row.StuffType === StuffType.Stone ? 'ct' : 'g')
        case 'ActualDate':
          return this.$options.filters.filterDate(val)
        default:
          return '￥' + this.$root.toFloat(val)
      }
    },

    getEnums() {
      // 获取创建人
      this.$store.dispatch('GET_SETTLE_DATE')
      this.$store.dispatch('GET_USERS_DROPLIST')
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', { HasShelf: YNStatus.Yes, State: YNStatus.Yes })
    },
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            Position: [0],
            WarehouseId1: '0',
            ShelfId1: '0',
            ReasonTypeDk: '0',
            ShippingType: '0',
            CreateUserId: '0',
            IntakeState: '0',
            State: '0',
            OrderBy: '0',
            IsAsced: YNStatus.No,
            PageIndex: 1,
            PageSize: 20,
            CreateTime: [],
            CheckTime: [],
            ActualDate: [],
            CreateTime1: '',
            CreateTime2: '',
            CheckTime1: '',
            CheckTime2: '',
            ActualDate1: '',
            ActualDate2: '',
            OutakeCode: '',
            UnitedName2: ''
          }
      query.PageIndex = parseInt(query.PageIndex)
      query.PageSize = parseInt(query.PageSize)
      query.CreateTime = query.CreateTime || []
      query.CheckTime = query.CheckTime || []
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

      STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
          if (this.parameters.PageIndex !== 1 && this.data.length === 0) {
            this.onSearch()
          }
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      if (this.queryForm.CreateTime) {
        this.queryForm.CreateTime1 = this.queryForm.CreateTime[0] || ''
        this.queryForm.CreateTime2 = this.queryForm.CreateTime[1] || ''
      } else {
        this.queryForm.CreateTime1 = ''
        this.queryForm.CreateTime2 = ''
      }
      if (this.queryForm.CheckTime) {
        this.queryForm.CheckTime1 = this.queryForm.CheckTime[0] || ''
        this.queryForm.CheckTime2 = this.queryForm.CheckTime[1] || ''
      } else {
        this.queryForm.CheckTime1 = ''
        this.queryForm.CheckTime2 = ''
      }
      if (this.queryForm.ActualDate) {
        this.queryForm.ActualDate1 = this.queryForm.ActualDate[0] || ''
        this.queryForm.ActualDate2 = this.queryForm.ActualDate[1] || ''
      } else {
        this.queryForm.ActualDate1 = ''
        this.queryForm.ActualDate1 = ''
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
          this.parameters.OrderBy = 2
          break
        case 'CheckTime':
          this.parameters.OrderBy = 1
          break
        default:
          this.parameters.OrderBy = 0
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
    showCreateDialog(command) {
      this.createForm.StuffType = parseInt(command)
      this.createForm.ActualDate = this.$options.filters.filterAllDate(new Date())
      this.createDialog = true
    },
    getShelfId1List(val) {
      // 发货位置货架下拉
      this.shelfId1List = this.$store.getters.wareHouses.find(
        item => item.Id === val
      ).Childrens.filter(item => item.State === YNStatus.Yes)
      this.createForm.ShelfId1 =
        this.shelfId1List.length === 1 ? this.shelfId1List[0].Id : ''
    },
    getShelfId2List(val) {
      // 收货位置货架下拉
      this.shelfId2List = this.$store.getters.wareHouses.find(
        item => item.Id === val
      ).Childrens.filter(item => item.State === YNStatus.Yes)
      this.createForm.ShelfId2 =
        this.shelfId2List.length === 1 ? this.shelfId2List[0].Id : ''
    },
    getReasonTypeDv(val) {
      // 获取原因类型名称
      this.createForm.ReasonTypeDv = this.appropOutReasons.find(
        item => (item.Id === val)
      ).Value
    },
    resetForm() {
      // 重置新建表单
      this.$refs.createForm.resetFields()
    },
    createappropOut() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          if (
            this.createForm.WarehouseId1 === this.createForm.WarehouseId2 &&
            this.createForm.ShelfId1 === this.createForm.ShelfId2
          ) {
            this.$message.warning('收货位置和发货位置不能相同')
            return false
          }
          this.createForm.ActualDate = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_CREATE(this.createForm).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                this.$message({
                  type: 'success',
                  message: '提交成功'
                })
                this.$store.commit('SET_BTN_LOADING', false)
                this.$router.push({
                  path: '/depot/materialappropout/edit',
                  query: {
                    id: res.data.Data
                  }
                })
              }
              this.$store.commit('SET_BTN_LOADING', false)
            }
          )
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    selectionChange(selection) {
      // 获取选中的条目
      this.selections = selection
    },
    multiAudit() {
      // 批量审核
      if (
        this.selections.length === 0 ||
        this.selections.some(
          item => item.State !== StuffAllotOrderOutakeState.Wait
        )
      ) {
        this.$message.error('请选择待审核的调拨出库单')
      } else {
        this.auditDialog = true
      }
    },
    appropOutAudit(row) {
      // 单个审核
      this.selections = [row]
      this.auditDialog = true
    },
    listenAuditDialog(v) {
      this.selections = []
      this.$refs.tableData.clearSelection()
      if (v) {
        this.getData()
      }
    },
    appropOutAbandon(row) {
      // 作废
      this.abandonAppropOut = row
      this.abandonDialog = true
    },

    getappropOutReason() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: SettingDictionaryDictType.HalfAllotOrderOutakeReasonType,
        State: YNStatus.Yes
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.appropOutReasons = res.data.Data.Rows || []
          if (!this.appropOutReasons.some(item => item.Id === this.createForm.ReasonTypeDk)) {
            this.createForm.ReasonTypeDk = ''
            this.createForm.ReasonTypeDv = ''
          }
        }
      })
    }
  },

  beforeMount() {
    this.getappropOutReason()
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
    dictManage,
    appropOutAudit,
    appropOutAbandon
  }
}
</script>
<style lang="scss" scoped>
.position {
  display: flex;
  .item {
    margin-bottom: 0 !important;
    &:first-child {
      margin-right: 10px;
    }
  }
}
</style>

