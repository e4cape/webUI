<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-dropdown @command="multiAudit">
            <el-button type="primary">
              新建
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="stuffType.Gold">金料报溢</el-dropdown-item>
              <el-dropdown-item :command="stuffType.Stone">石料报溢</el-dropdown-item>
              <el-dropdown-item :command="stuffType.Part">配件报溢</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-dropdown @command="handleClick">
            <el-button>
              批量操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="text">批量审核</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select v-model="queryForm.State" placeholder="所有状态" name="state">
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="(item, index) in stuffCountReportBasicState.TypeArray" :key="index" :label="item.Value" :value="String(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ReportCode">
            <el-input v-model="queryForm.ReportCode" :maxlength="50" placeholder="单据编号" @keyup.enter.native="onSearch" name="reportCode">
              <el-button slot="append" icon="el-icon-search" @click="onSearch" name="btnSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="ReportCode" label="单据编号：">
            <el-input v-model="queryForm.ReportCode" :maxlength="50" @keyup.enter.native="onSearch" name="reportCode"></el-input>
          </el-form-item>
          <el-form-item prop="CreateTime" label="创建时间：">
            <el-date-picker v-model="queryForm.CreateTime" value-format="yyyy-MM-dd hh:MM:ss" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" name="createTime"></el-date-picker>
          </el-form-item>
          <el-form-item prop="CreateUserId" label="创建人：">
            <el-select v-model="queryForm.CreateUserId" :filterable="true" placeholder="全部" name="createUserId">
              <el-option label="全部" value="0"></el-option>
              <template v-for="(item, index) in $store.getters.users">
                <el-option
                  v-if="item.UserState === securityUserStates.Audit && item.TrueName"
                  :key="index"
                  :label="item.TrueName"
                  :value="String(item.UserId)"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="SourceType" label="所有来源：">
            <el-select v-model="queryForm.SourceType" placeholder="所有来源" :filterable="true" name="sourceType">
              <el-option label="所有来源" value="0"></el-option>
              <el-option v-for="(item,index) in stuffCountReportBasicSourceType.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="CountCode" label="来源单号：">
            <el-input v-model="queryForm.CountCode" :maxlength="50" @keyup.enter.native="onSearch" name="CountCode"></el-input>
          </el-form-item>
          <el-form-item prop="WarehouseId" label="所有位置：">
            <!-- <el-cascader expand-trigger="hover" :options="houseOptions" v-model="selectedOptions" @change="handleChange"></el-cascader> -->
            <el-select v-model="queryForm.WarehouseId" placeholder="所有仓库" :filterable="true" name="WarehouseId">
              <el-option label="所有仓库" value="0"></el-option>
              <template v-for="(item,index) in $store.getters.wareHouses">
                <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="StuffType" label="所有类别：">
            <el-select v-model="queryForm.StuffType" placeholder="所有类别" :filterable="true" name="StuffType">
              <el-option label="所有类别" value="0"></el-option>
              <el-option v-for="(item,index) in stuffType.TypeArray" :key="index" :label="item.Value" :value="String(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="CheckTime" label="最后操作时间：">
            <el-date-picker v-model="queryForm.CheckTime" value-format="yyyy-MM-dd hh:MM:ss" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" name="checkTime"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- @module 数据表格 -->
    <el-table :data="dataTable" @sort-change="sortChange" @selection-change="selectionChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <!-- <el-table-column type="selection" fixed width="55"></el-table-column> -->
      <el-table-column prop="ReportCode" label="单据编号" min-width="160" sortable="custom" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="WarehouseName" label="位置" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.WarehouseName || '仓库'}}</template>
      </el-table-column>
      <el-table-column prop="WarehouseName" label="类别" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{stuffType.Types[scope.row.StuffType]}}</template>
      </el-table-column>
      <el-table-column prop="SourceType" label="来源" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{stuffCountReportBasicSourceType.Types[scope.row.SourceType]}}</template>
      </el-table-column>
      <el-table-column prop="CountCode" label="来源单号" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <router-link v-if="scope.row.CountCode" :to="{path:'/depot/taking/check',query:{id:scope.row.CountId,StuffType: scope.row.StuffType}}" class="btn-link el-button el-button--text" name="btnCheck">{{scope.row.CountCode}}</router-link>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" min-width="120" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.CreateTime | filterDateMinutes }}</template>
      </el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Quantity" label="数量" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Weight" label="重量" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          {{$root.toFloat(scope.row.Weight, 3)}}{{scope.row.StuffType == stuffType.Stone?'ct':'g'}}
        </template>
      </el-table-column>
      <el-table-column prop="CostPrice" label="金额" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          ￥{{$root.toFloat(scope.row.CostPrice)}}
        </template>
      </el-table-column>
      <el-table-column prop="CheckTime" label="最后操作时间" min-width="140" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.CheckTime | filterDateMinutes }}</template>
      </el-table-column>
      <el-table-column prop="State" label="状态" min-width="100" fixed="right">
        <template slot-scope="scope">
          <template
            v-if="(scope.row.State === stuffCountReportBasicState.Abandon || scope.row.State === stuffCountReportBasicState.Reject || scope.row.State === stuffCountReportBasicState.Cancel)&&scope.row.CheckNote"
          >
            <el-tooltip class="item" :content="scope.row.CheckNote" placement="top" effect="light">
              <span :class="scope.row.State | findKey(stuffCountReportBasicState)">{{stuffCountReportBasicState.Types[scope.row.State]}}</span>
            </el-tooltip>
          </template>
          <template v-else>
            <span :class="scope.row.State | findKey(stuffCountReportBasicState)">{{stuffCountReportBasicState.Types[scope.row.State]}}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="160" fixed="right">
        <template slot-scope="scope">
          <router-link :to="{path:'/depot/stockover/check',query:{id:scope.row.ReportId,StuffType: scope.row.StuffType}}" class="btn-link el-button el-button--text" name="btnCheck">查看</router-link>
          <template
            v-if="scope.row.State === stuffCountReportBasicState.Reject || scope.row.State === stuffCountReportBasicState.Draft && scope.row.SourceType !== stuffCountReportBasicSourceType.Taking"
          >
            <router-link
              :to="{path:'/depot/stockover/edit',query:{id: scope.row.ReportId, deskId:scope.row.DeskId, StuffType: scope.row.StuffType}}"
              class="btn-link el-button el-button--text"
              name="btnEdit"
            >编辑</router-link>
            <el-button type="text" @click="openDialog(scope.row, 'abandonDialog')" name="btnStocklosssAbandon">作废</el-button>
          </template>
          <el-button type="text" @click="openDialog(scope.row, 'auditDialog')" v-if="scope.row.State === stuffCountReportBasicState.Wait" name="btnAuditStockloss">审核</el-button>
          <el-button type="text" @click="openDialog(scope.row, 'cancelDialog')" v-if="scope.row.State === stuffCountReportBasicState.Audit" name="btnStocklossCancel">取消审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->

    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- @module 新建 -->
    <el-dialog title="新建报损单" :visible.sync="createDialogVisible" @close="resetForm">
      <el-form :model="createForm" label-position="right" label-width="100px" :rules="rules" ref="createForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="报损位置：" prop="WarehouseId">
              <el-select class="m-r-10" v-model="createForm.WarehouseId" @change="chooseHouse" placeholder="请选择" :filterable="true" name="StuffType">
                <template v-for="(item,index) in $store.getters.wareHouses">
                  <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="Number(item.Id)"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item v-if="Shelfs.length>0" class="shelf-box" prop="ShelfId">
              <el-select v-model="createForm.ShelfId" placeholder="请选择" label-width="0" :filterable="true" name="StuffType">
                <el-option v-for="(item,index) in Shelfs" :key="index" :label="item.Value" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：" prop="Note">
              <el-input type="textarea" :rows="2" v-model="createForm.Note" :maxlength="200" name="note"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer tc">
        <el-button type="primary" @click="createOver" :loading="$store.getters.is_loading" name="createOver">确 定</el-button>
        <el-button @click="createDialogVisible = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 新建 -->

    <!-- @module Dialog·审核 -->
    <auditDialog title="审核" v-if="auditDialog" :auditDialog="auditDialog" :data="selections" @listenAuditDialog="listenDialog"></auditDialog>
    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <abandonDialog title="作废" v-if="abandonDialog" :abandonDialog="abandonDialog" :data="selections" @listenAbandonDialog="listenDialog"></abandonDialog>
    <!-- End Dialog·作废 -->

    <!-- @module Dialog·取消审核 -->
    <cancelDialog title="取消审核" v-if="cancelDialog" :cancelDialog="cancelDialog" :data="selections" @listenCancelDialog="listenDialog"></cancelDialog>
    <!-- End Dialog·取消审核 -->
  </div>
</template>

<script>
import { SecurityUserState } from '@/enums/merchant.js'
import {
  StuffCountReportBasicSourceType,
  StuffCountReportBasicState,
  StuffCountReportBasicReportType
} from '@/enums/stocking.js'
import { YNStatus, StuffType } from '@/enums/common.js'
import {
  STOCKING_API_STUFF_COUNT_REPORT_BASIC_GETS1,
  STOCKING_API_STUFF_COUNT_REPORT_BASIC_CREATE1
} from '@/apis/stocking.js'
// import { MERCHANT_API_SECURITY_USER_GETS } from '@/apis/merchant.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import auditDialog from './audit'
import abandonDialog from './abandon'
import cancelDialog from './cancel'
export default {
  data() {
    return {
      YNStatus,
      stuffType: StuffType,
      stuffCountReportBasicSourceType: StuffCountReportBasicSourceType,
      stuffCountReportBasicState: StuffCountReportBasicState,
      stuffCountReportBasicReportType: StuffCountReportBasicReportType,
      securityUserStates: SecurityUserState,
      currType: StuffType.Gold,
      queryForm: {
        // 查询表单数据
        ReportType: StuffCountReportBasicReportType.Over,
        ReportCode: '',
        CountCode: '',
        WarehouseId: '0',
        ShelfId: '0',
        StuffType: '0',
        CreateUserId: '',
        SourceType: '0',
        State: '0',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20,
        CreateTime: [],
        CheckTime: []
      },
      dataTable: [],
      total: 0,
      createDialogVisible: false, // 新建对话框
      createForm: {
        ReportType: '',
        StuffType: '',
        WarehouseId: '',
        ShelfId: '',
        Note: ''
      },
      rules: {
        WarehouseId: [
          {
            required: true,
            message: '请选择报损仓库',
            trigger: 'change'
          }
        ],
        ShelfId: [
          {
            required: true,
            message: '请选择报损货架',
            trigger: 'change'
          }
        ]
      },
      auditDialog: false, // 审核对话框
      abandonDialog: false, // 作废对话框
      abandonStockLoss: {},
      cancelDialog: false, // 作废对话框
      cancelStockLoss: {},
      selections: [],
      parameters: {},
      houseOptions: [],
      selectedOptions: [],
      selectedOptions1: [],
      Shelfs: [] // 货架列表
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            ReportType: this.stuffCountReportBasicReportType.Over,
            ReportCode: '',
            CountCode: '',
            WarehouseId: '0',
            ShelfId: '0',
            StuffType: '0',
            CreateUserId: '',
            SourceType: '0',
            State: '0',
            OrderBy: 0,
            IsAsced: YNStatus.No,
            PageIndex: 1,
            PageSize: 20,
            CreateTime: [],
            CheckTime: []
          }
      this.parameters = Object.assign({}, query)
      this.parameters.CreateTime = query.CreateTime || []
      this.parameters.CheckTime = query.CheckTime || []
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let createTime = this.parameters.CreateTime.length
        ? this.parameters.CreateTime
        : ['', '']
      let checkTime = this.parameters.CheckTime.length
        ? this.parameters.CheckTime
        : ['', '']
      let param = {
        CreateTime1: createTime[0],
        CreateTime2: createTime[1],
        CheckTime1: checkTime[0],
        CheckTime2: checkTime[1]
      }

      this.queryForm = Object.assign(this.queryForm, this.parameters, param)
      STOCKING_API_STUFF_COUNT_REPORT_BASIC_GETS1(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.dataTable = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    chooseHouse(e) {
      this.Shelfs = this.$store.getters.wareHouses.find(item => {
        return item.Id == e
      }).Childrens.filter(item => item.State === YNStatus.Yes)

      this.createForm.ShelfId = this.Shelfs.length == 1?this.Shelfs[0].Id:''
    },
    multiAudit(command) {
      this.currType = command
      this.createDialogVisible = true
      // 单个仓库时默认选中
      // if(this.$store.getters.wareHouses.filter(item => item.State == this.YNStatus.Yes).length === 1){
      //   this.createForm.WarehouseId = this.$store.getters.wareHouses[0].Id
      //   this.chooseHouse(this.createForm.WarehouseId)
      // }
    },
    handleClick(){
      if(this.selections.length>0&&this.selections.every(item => {return item.State == this.stuffCountReportBasicState.Wait})){
        this.auditDialog = true
      }else{
        this.$message.error('状态必须是待审核状态')
      }
    },
    handleChange1(e) {
      this.createForm.WarehouseId = e[0]
      this.createForm.ShelfId = e[1]
    },
    handleChange(e) {
      this.queryForm.WarehouseId = e[0]
      this.queryForm.ShelfId = e[1]
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'CheckTime':
          this.queryForm.OrderBy = 1
          break
        case 'ReportCode':
          this.queryForm.OrderBy = 2
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.onSearch()
    },
    selectionChange(selection) {
      this.selections = selection
    },
    createOver() {
      console.log(this.$store.getters.wareHouses)
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.createForm.ReportType = this.stuffCountReportBasicReportType.Over
          this.createForm.StuffType = this.currType
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_STUFF_COUNT_REPORT_BASIC_CREATE1(this.createForm).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                this.createDialogVisible = false
                this.$router.push({
                  path: '/depot/stockover/edit',
                  query: {
                    id: res.data.Data,
                    StuffType: this.createForm.StuffType
                  }
                })
              } else {
                this.$message.error(res.data.Message)
              }
              this.$store.commit('SET_BTN_LOADING', false)
            }
          )
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    openDialog(row, type){
      this.selections = [row]
      this[type] = true
    },
    listenDialog(type, success) {
      if (success) {
        this.selections = []
        this.getData()
      }
      this[type] = false
    },
    resetForm() {
      this.$refs.createForm.resetFields()
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.queryForm.isSenior = true
      // let param = {
      //   PositionType:
      //     this.queryForm.StuffType == -1
      //       ? 0
      //       : this.queryForm.StuffType == 0
      //       ? this.stuffCountReportBasicState.Stock
      //       : this.stuffCountReportBasicState.Desk,
      //   DeskId: this.queryForm.StuffType == -1 ? 0 : this.queryForm.StuffType
      // }
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
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
    },
    getEnums(){
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', {HasShelf: this.YNStatus.Yes, State: this.YNStatus.Yes})
      this.$store.dispatch('GET_USERS_DROPLIST')
    }
  },
  beforeMount(){
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init',
    'queryForm.State': 'onSearch'
  },
  components: {
    searchPanel,
    pagination,
    auditDialog,
    abandonDialog,
    cancelDialog
  }
}
</script>