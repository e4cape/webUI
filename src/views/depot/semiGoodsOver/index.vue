<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" @keyup.enter.native="onSearch" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button type="primary" @click="showCreateDialog" name="btnCreate">新建</el-button>
          <!-- <el-dropdown @command="multiAudit">
            <el-button>
              批量操作
              <i class="el-icon-arrow-down el-icon--right"></i>
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
            <el-select v-model="queryForm.State" @change="onSearch" name="State">
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="(item,index) in HalfCountReportBasicState.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ReportCode">
            <el-input v-model="queryForm.ReportCode" :maxlength="50" placeholder="单据编号" name="ReportCode">
              <el-button slot="append" icon="el-icon-search" @click="onSearch" name="btnSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="SourceType" label="来源：">
            <el-select v-model="queryForm.SourceType" placeholder="所有来源" :filterable="true" name="SourceType">
              <el-option label="所有来源" value="0"></el-option>
              <el-option v-for="(item,index) in HalfCountReportBasicSourceType.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="位置：" prop="Position">
            <el-cascader v-model="queryForm.Position" :options="[{Id: 0, Value:'所有位置'}, ...$store.getters.wareHouses]" :props="positionArrProps" change-on-select name="Position"></el-cascader>
          </el-form-item>
          <el-form-item prop="ReportCode" label="单据编号：">
            <el-input v-model="queryForm.ReportCode" :maxlength="50" name="ReportCode"></el-input>
          </el-form-item>
          <el-form-item prop="CountCode" label="来源单号：">
            <el-input v-model="queryForm.CountCode" :maxlength="50" name="CountCode"></el-input>
          </el-form-item>
          <el-form-item prop="CreateTime" label="创建时间：">
            <el-date-picker v-model="queryForm.CreateTime" unlink-panels type="daterange" :picker-options="$root.datePickerOptions" name="createTime" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item prop="CreateUserId" label="创建人：">
            <el-select v-model="queryForm.CreateUserId" filterable name="CreateUserId">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.users" :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="CheckTime" label="最后操作时间：">
            <el-date-picker v-model="queryForm.CheckTime" unlink-panels type="daterange" :picker-options="$root.datePickerOptions" name="checkTime" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- @module 数据表格 -->
    <el-table :data="data" @sort-change="sortChange" @selection-change="selectionChange" ref="tableData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column prop="ReportCode" label="单据编号" min-width="160" sortable="custom" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="WarehouseName" label="位置" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="SourceType" label="来源" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CountCode" label="来源单号" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <router-link :to="{path: '/depot/semitaking/check', query: {id:scope.row.CountId}}" v-if="scope.row.SourceType === HalfCountReportBasicSourceType.Taking">{{scope.row.CountCode}}</router-link>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" :formatter="formatter" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Quantity" label="数量" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Weight" label="重量" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CostPrice" label="金额" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CheckTime" label="最后操作时间" :formatter="formatter" min-width="140" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="State" label="状态" min-width="100" fixed="right">
        <template slot-scope="scope">
          <el-tooltip :disabled="!scope.row.CheckNote" class="item" :content="scope.row.CheckNote" placement="top" effect="light">
            <span :class="scope.row.State | findKey(HalfCountReportBasicState)">{{HalfCountReportBasicState.Types[scope.row.State]}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="160" fixed="right">
        <template slot-scope="scope">
          <router-link :to="{path:`/depot/semistockover/check`,query:{id:scope.row.ReportId}}" class="btn-link el-button el-button--text" name="btnCheck">查看</router-link>
          <template
            v-if="scope.row.State === HalfCountReportBasicState.Reject || scope.row.State === HalfCountReportBasicState.Draft && scope.row.SourceType !== HalfCountReportBasicSourceType.Taking"
          >
            <router-link :to="{path:`/depot/semistockover/edit`,query:{id:scope.row.ReportId, deskId:scope.row.DeskId}}" class="btn-link el-button el-button--text" name="btnEdit">编辑</router-link>
            <el-button type="text" @click="abandon(scope.row)" name="btnAbandon">作废</el-button>
          </template>
          <el-button type="text" @click="audit(scope.row)" v-if="scope.row.State === HalfCountReportBasicState.Wait" name="btnAudit">审核</el-button>
          <el-button type="text" @click="cancel(scope.row)" v-if="scope.row.State === HalfCountReportBasicState.Audit" name="btnCancel">取消审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->

    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- @module 新建 -->
    <el-dialog title="新建半成品报溢单" :visible.sync="createDialogVisible" @close="resetForm">
      <el-form :model="createForm" label-position="right" label-width="100px" :rules="rules" ref="createForm">
        <el-row>
          <el-col :span="24">
            <el-form-item label="报溢位置" required>
              <div class="position">
                <el-form-item prop="WarehouseId" class="item">
                  <el-select v-model="createForm.WarehouseId" @change="getShelfIdList">
                    <template v-for="(item, index) in $store.getters.wareHouses">
                      <el-option v-if="item.State === YNStatus.Yes" :key="index" :value="item.Id" :label="item.Value"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
                <el-form-item prop="ShelfId" class="item">
                  <el-select v-model="createForm.ShelfId">
                    <el-option v-for="(item, index) in shelfIdList" :key="index" :value="item.Id" :label="item.Value"></el-option>
                  </el-select>
                </el-form-item>
              </div>
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
        <el-button type="primary" @click="create" :loading="$store.getters.is_loading" name="create">确 定</el-button>
        <el-button @click="createDialogVisible = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 新建 -->

    <!-- @module Dialog·审核 -->
    <audit :visible.sync="auditDialog" :data="selections" @listenAuditDialog="listenAuditDialog"></audit>
    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <abandon :visible.sync="abandonDialog" :data="abandonStock" @listenAbandonDialog="getData"></abandon>
    <!-- End Dialog·作废 -->

    <!-- @module Dialog·取消审核 -->
    <cancel :visible.sync="cancelDialog" :data="cancelStock" @listenCancelDialog="getData"></cancel>
    <!-- End Dialog·取消审核 -->
  </div>
</template>

<script>
import {
  HalfCountReportBasicSourceType,
  HalfCountReportBasicState,
  HalfCountReportBasicReportType,
} from '@/enums/stocking.js'
import { YNStatus } from '@/enums/common.js'
import {
  STOCKING_API_HALF_COUNT_REPORT_BASIC_GETS2,
  STOCKING_API_HALF_COUNT_REPORT_BASIC_CREATE2
} from '@/apis/stocking.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import audit from './audit'
import abandon from './abandon'
import cancel from './cancel'
export default {
  data() {
    return {
      YNStatus,
      HalfCountReportBasicSourceType,
      HalfCountReportBasicState,
      HalfCountReportBasicReportType,
      sourceType: '0',
      desks: {}, // 所有位置
      queryForm: {
        // 查询表单数据
        ReportType: HalfCountReportBasicReportType.Over,
        SourceType: '0',
        WarehouseId: '0',
        ShelfId: '0',
        CreateUserId: '0',
        State: '0',
        OrderBy: 1,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20,
        CreateTime: [],
        CheckTime: [],
        Position: [0],
        ReportCode: '',
        CountCode: '',
        CreateTime1: '',
        CreateTime2: '',
        CheckTime1: '',
        CheckTime2: ''
      },
      data: [],
      total: 0,
      createDialogVisible: false, // 新建对话框
      createForm: {
        ReportType: '',
        WarehouseId: '',
        ShelfId: '',
        Note: ''
      },
      rules: {
        WarehouseId: [{ required: true, message: '请选择仓库' }],
        ShelfId: [{ required: true, message: '请选择货架' }]
      },
      auditDialog: false, // 审核对话框
      abandonDialog: false, // 作废对话框
      abandonStock: {},
      cancelDialog: false, // 作废对话框
      cancelStock: {},
      selections: [],
      parameters: {},
      positionArrProps: {
        value: 'Id',
        label: 'Value',
        children: 'Childrens'
      },
      shelfIdList: []
    }
  },

  methods: {
    getEnums() {
      // 获取创建人
      this.$store.dispatch('GET_USERS_DROPLIST')
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', {HasShelf: YNStatus.Yes, State: YNStatus.Yes})
    },
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            ReportType: HalfCountReportBasicReportType.Over,
            SourceType: '0',
            WarehouseId: '0',
            ShelfId: '0',
            CreateUserId: '0',
            State: '0',
            OrderBy: 1,
            IsAsced: YNStatus.No,
            PageIndex: 1,
            PageSize: 10,
            CreateTime: [],
            CheckTime: [],
            Position: [0],
            ReportCode: '',
            CountCode: '',
            CreateTime1: '',
            CreateTime2: '',
            CheckTime1: '',
            CheckTime2: ''
          }
      query.PageIndex = parseInt(query.PageIndex)
      query.PageSize = parseInt(query.PageSize)
      query.CreateTime = query.CreateTime || []
      query.CheckTime = query.CheckTime || []
      query.Position = [parseInt(query.WarehouseId1), parseInt(query.ShelfId1)]
      query.WarehouseId = parseInt(query.WarehouseId)
      query.ShelfId = parseInt(query.ShelfId)
      if (query.isSenior) {
        query.isSenior = query.isSenior === 'true' ? true : false
      }
      this.parameters = { ...query }
      this.queryForm = { ...query }
      this.getData()
    },

    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading

      STOCKING_API_HALF_COUNT_REPORT_BASIC_GETS2(this.parameters).then(res => {
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
      if (this.queryForm.CreateTime) {
        this.queryForm.CreateTime1 = this.queryForm.CreateTime[0]
        this.queryForm.CreateTime2 = this.queryForm.CreateTime[1]
      } else {
        this.queryForm.CreateTime1 = ''
        this.queryForm.CreateTime2 = ''
      }
      if (this.queryForm.CheckTime) {
        this.queryForm.CheckTime1 = this.queryForm.CheckTime[0]
        this.queryForm.CheckTime2 = this.queryForm.CheckTime[1]
      } else {
        this.queryForm.CheckTime1 = ''
        this.queryForm.CheckTime2 = ''
      }
      this.queryForm.WarehouseId = this.queryForm.Position[0] || 0
      this.queryForm.ShelfId = this.queryForm.Position[1] || 0
      this.queryForm.isSenior = true
      if (JSON.stringify(this.queryForm) === JSON.stringify(this.parameters)) {
        this.getData()
      } else {
        this.parameters = { ...this.queryForm }
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.queryForm.CreateTime1 = ''
      this.queryForm.CreateTime2 = ''
      this.queryForm.CheckTime1 = ''
      this.queryForm.CheckTime2 = ''
      this.queryForm.WarehouseId = '0'
      this.queryForm.ShelfId = '0'
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
    sortChange(sort) {
      switch (sort.prop) {
        case 'ReportCode':
          this.parameters.OrderBy = 0
          break
        case 'CheckTime':
          this.parameters.OrderBy = 2
          break
        default:
          this.parameters.OrderBy = 1
          break
      }
      this.parameters.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.initRoute()
    },
    getShelfIdList(val) {
      // 发货位置货架下拉
      this.shelfIdList = this.$store.getters.wareHouses.find(
        item => item.Id === val
      ).Childrens.filter(item => item.State === YNStatus.Yes)
      this.createForm.ShelfId =
        this.shelfIdList.length === 1 ? this.shelfIdList[0].Id : ''
    },
    // 弹出新建弹窗
    showCreateDialog() {
      this.createDialogVisible = true
      this.createForm.ReportType = HalfCountReportBasicReportType.Over
    },
    create() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_HALF_COUNT_REPORT_BASIC_CREATE2(this.createForm).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                this.createDialogVisible = false
                this.$router.push({
                  path: '/depot/semistockover/edit',
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
    resetForm() {
      this.$refs.createForm.resetFields()
    },
    selectionChange(selection) {
      this.selections = selection
    },
    multiAudit() {
      if (
        this.selections.length > 0 &&
        this.selections.every(
          item => item.State === HalfCountReportBasicState.Wait
        )
      ) {
        this.auditDialog = true
      } else {
        this.$message.warning('请选择待审核状态的半成品报溢单')
      }
    },
    audit(row) {
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
    abandon(row) {
      this.abandonDialog = true
      this.abandonStock = row
    },
    cancel(row) {
      this.cancelDialog = true
      this.cancelStock = row
    },
    formatter(row, column, val) {
      switch (column.property) {
        case 'CheckTime':
        case 'CreateTime':
          return this.$options.filters.filterDateMinutes(val)
        case 'WarehouseName':
          return `${val}（${row.ShelfName}）`
        case 'SourceType':
          return HalfCountReportBasicSourceType.Types[val]
        case 'Weight':
          return this.$root.toFloat(val, 3) + 'g'
        default:
          return '￥' + this.$root.toFloat(val)
      }
    }
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
    audit,
    abandon,
    cancel
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

