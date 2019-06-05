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
            <el-select v-model="queryForm.State" @change="onSearch" placeholder="所有状态" name="State">
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="(item,index) in GoodsCountReportBasicState.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ReportCode">
            <el-input v-model="queryForm.ReportCode" :maxlength="50" placeholder="单据编号" name="reportCReportCodeode">
              <el-button slot="append" icon="el-icon-search" @click="onSearch" name="btnSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="SourceType" label="来源：">
            <el-select v-model="queryForm.SourceType" placeholder="所有来源" :filterable="true" name="sourceType">
              <el-option label="所有来源" value="0"></el-option>
              <el-option v-for="(item,index) in GoodsCountReportBasicSourceType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="DeskId" label="位置：" v-if="characterType === CharacterType.Store">
            <el-select v-model="queryForm.DeskId" placeholder="所有位置" :filterable="true" name="DeskId">
              <el-option label="所有位置" value="0"></el-option>
              <el-option v-for="(item,index) in desks" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="position" label="位置：" v-else>
            <el-cascader :options="positionList" v-model="queryForm.position" :props="positionProp"></el-cascader>
          </el-form-item>
          <el-form-item prop="ReportCode" label="单据编号：">
            <el-input v-model="queryForm.ReportCode" :maxlength="50" name="ReportCode"></el-input>
          </el-form-item>
          <el-form-item prop="CountCode" label="来源单号：">
            <el-input v-model="queryForm.CountCode" :maxlength="50" name="CountCode"></el-input>
          </el-form-item>
          <el-form-item prop="CreateTime" label="创建时间：">
            <el-date-picker v-model="queryForm.CreateTime" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item prop="CreateUserId" label="创建人：">
            <el-select v-model="queryForm.CreateUserId" :filterable="true" name="CreateUserId">
              <el-option label="全部" value="0"></el-option>
              <template v-for="(item, index) in $store.getters.users">
                <el-option v-if="item.UserState === SecurityUserState.Audit && item.TrueName" :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="CheckTime" label="最后操作时间：">
            <el-date-picker v-model="queryForm.CheckTime" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- @module 数据表格 -->
    <el-table :data="data" @sort-change="sortChange" @selection-change="selectionChange" ref="tableData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column type="selection" fixed></el-table-column>
      <el-table-column prop="ReportCode" label="单据编号" min-width="160" sortable="custom" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="DeskName" label="位置" v-if="characterType === CharacterType.Store" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="WarehouseName" label="位置" v-else min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="SourceType" label="来源" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CountCode" label="来源单号" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <router-link :to="{path: '/depot/goodstaking/check', query: {id:scope.row.CountId}}" v-if="scope.row.SourceType === GoodsCountReportBasicSourceType.Taking">{{scope.row.CountCode}}</router-link>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" :formatter="formatter" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Quantity" label="数量" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CheckTime" label="最后操作时间" :formatter="formatter" min-width="140" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="State" label="状态" min-width="100" fixed="right">
        <template slot-scope="scope">
          <el-tooltip :disabled="!scope.row.CheckNote" class="item" :content="scope.row.CheckNote" placement="top" effect="light">
            <span :class="scope.row.State | findKey(GoodsCountReportBasicState)">{{GoodsCountReportBasicState.Types[scope.row.State]}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="160" fixed="right">
        <template slot-scope="scope">
          <router-link :to="{path:'/depot/goodstockover/check',query:{id:scope.row.ReportId}}" class="btn-link el-button el-button--text" name="btnCheck">查看</router-link>
          <template
            v-if="scope.row.State === GoodsCountReportBasicState.Reject || scope.row.State === GoodsCountReportBasicState.Draft && scope.row.SourceType !== GoodsCountReportBasicSourceType.Taking"
          >
            <router-link :to="{path: '/depot/goodstockover/edit',query:{id:scope.row.ReportId}}" class="btn-link el-button el-button--text" name="btnEdit">编辑</router-link>
            <el-button type="text" @click="abandon(scope.row)" name="btnAbandon">作废</el-button>
          </template>
          <el-button type="text" @click="audit(scope.row)" v-if="scope.row.State === GoodsCountReportBasicState.Wait" name="btnAudits">审核</el-button>
          <el-button type="text" @click="cancel(scope.row)" v-if="scope.row.State === GoodsCountReportBasicState.Audit" name="btnCancel">取消审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->

    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- @module 新建 -->
    <el-dialog title="新建报溢单" :visible.sync="createDialogVisible" @close="resetForm">
      <el-form :model="createForm" ref="createForm" label-position="right" label-width="100px" :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="报溢位置" v-if="characterType === CharacterType.Company">
              <el-row>
                <el-col :span="5">
                  <el-form-item prop="WarehouseId" class="m-r-10">
                    <el-select v-model="createForm.WarehouseId" @change="handleShelfs" :filterable="true">
                      <template v-for="(item, index) in $store.getters.wareHouses">
                        <el-option v-if="item.State === YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
                      </template>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item prop="ShelfId">
                    <el-select v-model="createForm.ShelfId" :filterable="true">
                      <el-option v-for="(item, index) in shelfs" :key="index" :label="item.Value" :value="item.Id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="报溢位置" prop="DeskId" v-else>
              <el-select v-model="createForm.DeskId" :filterable="true">
                <template v-for="(item, index) in desks">
                  <el-option v-if="item.State === YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
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
        <el-button type="primary" @click="create" :loading="$store.getters.is_loading" name="create">确 定</el-button>
        <el-button @click="createDialogVisible = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 新建 -->

    <!-- @module Dialog·审核 -->
    <audit :visible.sync="auditDialog" :data="selections" @listenAuditDialog="getData"></audit>
    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <abandon :visible.sync="abandonDialog" :data="abandonData" @listenAbandonDialog="getData"></abandon>
    <!-- End Dialog·作废 -->

    <!-- @module Dialog·取消审核 -->
    <cancel :visible.sync="cancelDialog" :data="cancelData" @listenCancelDialog="getData"></cancel>
    <!-- End Dialog·取消审核 -->
  </div>
</template>

<script>
import { YNStatus, CharacterType } from '@/enums/common.js'
import { SecurityUserState } from '@/enums/merchant.js'
import {
  GoodsCountReportBasicState,
  GoodsCountReportBasicSourceType,
  GoodsCountReportBasicReportType,
  GoodsCountOrderBasicObjectType
} from '@/enums/stocking.js'
import {
  STOCKING_API_GOODS_COUNT_REPORT_BASIC_GETS2,
  STOCKING_API_GOODS_COUNT_REPORT_BASIC_CREATE2
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
      CharacterType,
      GoodsCountReportBasicSourceType,
      GoodsCountReportBasicState,
      GoodsCountReportBasicReportType,
      SecurityUserState,
      desks: {}, // 所有位置
      shelfs: [],
      queryForm: {
        // 查询表单数据
        ReportType: GoodsCountReportBasicReportType.Over,
        SourceType: '0',
        ObjectType: 0,
        WarehouseId: '0',
        ShelfId: '0',
        DeskId: '0',
        CreateUserId: '0',
        State: '0',
        OrderBy: 1,
        IsAsced: YNStatus.No,
        position: [0],
        ReportCode: '',
        CountCode: '',
        CreateTime1: '',
        CreateTime2: '',
        CheckTime1: '',
        CheckTime2: '',
        PageIndex: 1,
        PageSize: 20,
        CreateTime: [],
        CheckTime: []
      },
      data: [],
      total: 0,
      createDialogVisible: false, // 新建对话框
      createForm: {
        ReportType: '',
        WarehouseId: '',
        ShelfId: '',
        DeskId: '',
        Note: ''
      },
      rules: {
        DeskId: [
          {
            type: 'number',
            required: true,
            message: '请选择位置',
            trigger: 'change'
          }
        ],
        WarehouseId: [
          {
            type: 'number',
            required: true,
            message: '请选择位置',
            trigger: 'change'
          }
        ],
        ShelfId: [
          {
            required: true,
            message: '请选择位置',
            trigger: 'change'
          }
        ]
      },
      auditDialog: false, // 审核对话框
      abandonDialog: false, // 作废对话框
      abandonData: {},
      cancelDialog: false, // 作废对话框
      cancelData: {},
      selections: [{}],
      parameters: {},
      positionList: [],
      positionProp: {
        value: 'Id',
        label: 'Value',
        children: 'Childrens'
      }
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  methods: {

    multiAudit() {
      // 批量审核
      if (
        this.selections.length > 0 &&
        this.selections.every(
          item => item.State === GoodsCountReportBasicState.Wait
        )
      ) {
        this.auditDialog = true
      } else {
        this.$message.warning('请选择待审核状态的半成品报溢单')
      }
    },
    handleShelfs(val) {
      //  获取货架
      this.shelfs = this.$store.getters.wareHouses.find(
        item => item.Id === val
      ).Childrens.filter(item => item.State === YNStatus.Yes)
      if (this.shelfs.length === 1) {
        this.createForm.ShelfId = this.shelfs[0].Id
      } else {
        this.createForm.ShelfId = ''
      }
    },

    selectionChange(selection) {
      this.selections = selection
    },
    // 弹出新建弹窗
    showCreateDialog() {
      this.createDialogVisible = true
      this.createForm.ReportType = GoodsCountReportBasicReportType.Over
    },
    create() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)

          if (this.characterType === CharacterType.Company) {
            this.createForm.DeskId = 0
            this.createForm.WarehouseId = this.createForm.WarehouseId || 0
            this.createForm.ShelfId = this.createForm.ShelfId || 0
          } else {
            this.createForm.DeskId = this.createForm.DeskId || 0
            this.createForm.WarehouseId = 0
            this.createForm.ShelfId = 0
          }
          STOCKING_API_GOODS_COUNT_REPORT_BASIC_CREATE2(this.createForm).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                this.createDialogVisible = false
                this.$router.push({
                  path: '/depot/goodstockover/edit',
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
    audit(row) {
      this.selections = [row]
      this.auditDialog = true
    },
    abandon(row) {
      this.abandonDialog = true
      this.abandonData = row
    },
    cancel(row) {
      this.cancelDialog = true
      this.cancelData = row
    },
    resetForm() {
      this.$refs.createForm.resetFields()
    },
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            ReportType: GoodsCountReportBasicReportType.Over,
            SourceType: '0',
            ObjectType: 0,
            WarehouseId: '0',
            ShelfId: '0',
            DeskId: '0',
            CreateUserId: '0',
            State: '0',
            OrderBy: 1,
            IsAsced: YNStatus.No,
            position: [0],
            ReportCode: '',
            CountCode: '',
            CreateTime1: '',
            CreateTime2: '',
            CheckTime1: '',
            CheckTime2: '',
            PageIndex: 1,
            PageSize: 20,
            CreateTime: [],
            CheckTime: []
          }
      query.position = [parseInt(query.WarehouseId), parseInt(query.ShelfId)]
      query.PageIndex = parseInt(query.PageIndex)
      query.PageSize = parseInt(query.PageSize)
      query.CreateTime = query.CreateTime || []
      query.CheckTime = query.CheckTime || []
      if (query.isSenior) {
        query.isSenior = query.isSenior === 'true' ? true : false
      }
      query.ObjectType =
        this.characterType === CharacterType.Company
          ? GoodsCountOrderBasicObjectType.Company
          : GoodsCountOrderBasicObjectType.Store
      this.parameters = Object.assign({}, query)
      this.queryForm = { ...this.parameters }
      this.getData()
    },

    getData() {
      this.parameters.DeskId = this.parameters.DeskId * 1
      STOCKING_API_GOODS_COUNT_REPORT_BASIC_GETS2(this.parameters).then(res => {
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
    sortChange(sort) {
      switch (sort.prop) {
        case 'ReportCode':
          this.parameters.OrderBy = 0
          break
        case 'CreateTime':
          this.parameters.OrderBy = 1
          break
        case 'CheckTime':
          this.parameters.OrderBy = 2
          break
        default:
          this.parameters.OrderBy = 1
          break
      }
      this.parameters.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.initRoute()
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
      this.queryForm.WarehouseId = this.queryForm.position[0] || 0
      this.queryForm.ShelfId = this.queryForm.position[1] || 0
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
      this.$router.replace({ path: this.$router.path, query: this.parameters })
    },
    getStoreAllType() {
      this.$store.dispatch('GET_USERS_DROPLIST')
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST',  {HasShelf: YNStatus.Yes, State: YNStatus.Yes}).then(() => {
        this.positionList = [
          { Value: '所有位置', Id: 0 },
          ...this.$store.getters.wareHouses
        ]
      })
    },
    formatter(row, column, val) {
      switch (column.property) {
        case 'CreateTime':
        case 'CheckTime':
          return this.$options.filters.filterDateMinutes(val)
        case 'SourceType':
          return GoodsCountReportBasicSourceType.Types[val]
        case 'WarehouseName':
          return val && `${val}(${row.ShelfName})`
        default:
          break
      }
    },
    getDeskList() {
      this.$store.dispatch('GET_DESKS_DROPLIST').then(() => {
        this.desks = this.$store.getters.desks
        if (this.desks.length === 1) {
          this.createForm.DeskId = this.desks[0].Id
        }
      })
    }
  },

  mounted() {
    this.getStoreAllType()
    this.getDeskList()
    this.init()
  },
  watch: {
    $route: 'init',
    auditDialog(val) {
      if (!val) {
        this.selections = []
        this.$refs.tableData.clearSelection()
      }
    }
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
