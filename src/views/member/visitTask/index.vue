<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button name="btnNew" type="primary" @click="TaskParams.dialog = true">新建</el-button>
          <el-dropdown name="dropdowmMultiAudit" @command="multiAudit">
            <el-button name="btnBatchOperate" type="default">
              批量操作
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>批量审核</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="status">
            <el-select name="selectStatus" v-model="queryForm.status" placeholder="所有状态">
              <el-option label="所有状态" value></el-option>
              <el-option v-for="(item,index) in visitTaskStatus.Types" :key="index" :label="item.title" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="taskName">
            <el-input name="inputTaskName" v-model="queryForm.taskName" placeholder="任务名称" @keyup.enter.native="onSearch">
              <el-button name="btnOnSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="finishStatus" label="所有情况">
            <el-select name="selectFinishStatus" v-model="queryForm.finishStatus" placeholder="所有情况">
              <el-option label="所有情况" value></el-option>
              <el-option v-for="(item,index) in visitTaskFinishStatus.Types" :key="index" :label="item.title" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="settingOptionId" label="所有类型">
            <el-select name="selectSettingOptionId" v-model="queryForm.settingOptionId" placeholder="所有情况">
              <el-option label="所有情况" value></el-option>
              <el-option v-for="(item, index) in dicts" :key="index" :label="item.name" :value="item.settingOptionId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务名称" prop="taskName">
            <el-input name="inputTaskName" v-model="queryForm.taskName" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="创建人：" prop="createUserId">
            <el-select name="selectCreateUser" v-model="queryForm.createUserId" placeholder="全部" :filterable="true">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.users" :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item name="datePickerCreateTime" label="创建时间：" prop="createTime">
            <el-date-picker v-model="queryForm.createTime" :unlink-panels="true" type="daterange" format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item name="datePickerLastTime" label="最后操作时间：" prop="lastTime">
            <el-date-picker v-model="queryForm.lastTime" type="daterange" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- @module 数据表格  -->
    <el-table ref="table" :data="data" @sort-change="sortChange" @selection-change="selectionChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column :selectable="canSelect" type="selection" width="55" fixed="left"></el-table-column>
      <el-table-column prop="taskName" label="任务名称" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="settingOptionName" label="任务类型" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="memberCount" label="客户数" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.createTime | filterDate}}</template>
      </el-table-column>
      <el-table-column prop="createUser" label="创建人" min-width="80" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="finishRate" label="完成进度" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="finishStatusText" label="	完成情况" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="lastTime" label="最后更新" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="状态" min-width="100" fixed="right">
        <template slot-scope="scope">
          <template v-if="scope.row.checkNote && (scope.row.status == visitTaskStatus.Abandon || scope.row.status == visitTaskStatus.Returned || scope.row.status == visitTaskStatus.Cancel)">
            <el-tooltip class="item" :content="scope.row.checkNote" placement="top" effect="light">
              <span class="red">{{scope.row.visitTaskStatusText}}</span>
            </el-tooltip>
          </template>
          <template v-else>
            <span :class="{'red': scope.row.status == visitTaskStatus.Invalid || scope.row.status == visitTaskStatus.Cancel }">{{scope.row.visitTaskStatusText}}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <router-link name="linkCheck" :to="{path:'/member/visitTask/visitTaskCheck',query:{id:scope.row.visitTaskId}}" class="btn-link el-button el-button--text">查看</router-link>
          <template v-if="scope.row.status == visitTaskStatus.Returned || scope.row.status == visitTaskStatus.Draft">
            <router-link name="linkEdit" :to="{path:'/member/visitTask/visitTaskEdit',query:{id:scope.row.visitTaskId}}" class="btn-link el-button el-button--text">编辑</router-link>
            <el-button name="linkInvalid" type="text" @click="visitTaskAbandon(scope.row)">作废</el-button>
          </template>
          <el-button name="linkAudit" type="text" @click="visitTaskAudit(scope.row)" v-if="scope.row.status == visitTaskStatus.Pending">审核</el-button>
          <el-button name="linkAuditCancel" type="text" @click="visitTaskCancel(scope.row)" v-if="scope.row.status == visitTaskStatus.Pass">取消审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->

    <pagination :pg="queryForm.pageIndex" :size="queryForm.pageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- 新建客戶回访 -->
    <createTask v-if="TaskParams.dialog" :TaskParams="TaskParams" :dicts="dicts" @listenVisitTask="listenCreateVisitTask"></createTask>
    <!-- end 新建客戶回访 -->

    <!-- 审核 -->
    <visitTaskAudit v-if="auditDialog" :auditDialog="auditDialog" :data="selections" @listenAllDialog="listenAllDialog"></visitTaskAudit>
    <!-- end 审核 -->

    <!-- 取消审核 -->
    <visitTaskCancel v-if="cancelDialog" :cancelDialog="cancelDialog" :data="selected" @listenAllDialog="listenAllDialog"></visitTaskCancel>
    <!-- end 取消审核 -->
  </div>
</template>

<script>
import {
  YNStatus,
  SettingOptionTypes,
  VisitTaskFinishStatus,
  VisitTaskStatus,
  GiftStatus
} from '@/enums/membership'

import {
  MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS,
  MEMBERSHIP_API_VISITTASK_SEARCH,
  MEMBERSHIP_API_VISITTASK_CREATE,
  MEMBERSHIP_API_VISITTASK_INVALID
} from '@/apis/membership'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import createTask from './createTask.vue'
import visitTaskAudit from './visitTaskAudit.vue'
import visitTaskCancel from './visitTaskCancel.vue'

export default {
  data() {
    return {
      YNStatus,
      visitTaskStatus: VisitTaskStatus,
      visitTaskFinishStatus: VisitTaskFinishStatus,
      settingOptionTypes: SettingOptionTypes,
      dicts: [],
      queryForm: {
        settingOptionId: '',
        finishStatus: '',
        taskName: '',
        createUserId: '',
        status: '',
        createTime: '',
        createTimeStart: '',
        createTimeEnd: '',
        lastTime: '',
        lastTimeStart: '',
        lastTimeEnd: '',
        orderField: 'createTime',
        orderType: 1,
        pageIndex: 1,
        pageSize: 20
      },
      parameters: {},
      data: [],
      total: 0,
      selections: [],
      selected: null,
      TaskParams: {
        dialog: false,
        params: {}
      },
      auditDialog: false, // 审核
      cancelDialog: false // 取消审核
    }
  },
  methods: {
    canSelect(row) {
      const {
        status
      } = row
      return String(status) === GiftStatus.Pending
    },
    init() {
      let query = this.$route.query || {}
      this.queryForm = Object.assign(this.queryForm, query)
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let createTime = this.queryForm.createTime || ['', '']
      let lastTime = this.queryForm.lastTime || ['', '']
      let param = {
        createTimeStart: createTime[0],
        createTimeEnd: createTime[1],
        lastTimeStart: lastTime[0],
        lastTimeEnd: lastTime[1]
      }
      this.queryForm = Object.assign(this.queryForm, this.parameters, param)

      MEMBERSHIP_API_VISITTASK_SEARCH(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows || []
          this.total = res.data.Data.total || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.queryForm.OrderBy = 1
          break
        case 'PurchaseCode':
          this.queryForm.OrderBy = 2
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsc =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.onSearch()
    },
    getDicts() {
      MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS({
        type: this.settingOptionTypes.VisitTaskType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.dicts = res.data.Data
        }
      })
    },
    selectionChange(selection) {
      this.selections = selection
    },
    multiAudit() {
      if (
        !this.selections.length ||
        this.selections.filter(item => {
          if (item.State !== this.visitTaskStatus.Wait) {
            return item
          }
        }).length > 0
      ) {
        this.$message.error('请选择待审核的回访任务')
      } else {
        this.auditDialog = true
      }
    },
    visitTaskAudit(row) {
      this.$refs.table.clearSelection()
      this.selections = [row]
      this.auditDialog = true
    },
    visitTaskCancel(row) {
      this.selected = row
      this.cancelDialog = true
    },
    visitTaskAbandon(row) {
      this.$confirm('您正在进行作废操作，作废后不可恢复？', '确定作废？', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          MEMBERSHIP_API_VISITTASK_INVALID({
            visitTaskId: row.visitTaskId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.getData()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消作废'
          })
        })
    },
    listenCreateVisitTask(data) {
      if (!data) {
        this.TaskParams.dialog = false
        return false
      }
      this.createVisitTask(data)
    },
    createVisitTask(data) {
      MEMBERSHIP_API_VISITTASK_CREATE(data).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.TaskParams.dialog = false
          this.$router.push({
            path: '/member/visitTask/visitTaskEdit',
            query: {
              id: res.data.Data
            }
          })
        }
      })
    },
    removetagOptionItem(index) {
      this.beforeCreateForm.results.splice(index, 1)
    },
    listenAllDialog(success, type) {
      if (success) {
        this.selections = []
        this.getData()
      }
      this[type] = false
    },
    resetForm() {
      this.beforeCreateForm = {
        taskName: '',
        settingOptionId: '',
        settingOptionName: '',
        visitUserList: [],
        markType: 1,
        results: [''],
        remark: ''
      }
    },
    onSearch() {
      // 搜索相关
      this.queryForm.pageIndex = 1
      this.queryForm.isSenior = true
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      this.initRoute()
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.pageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.pageIndex = 1
      this.parameters.pageSize = val
      this.initRoute()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path, query: this.parameters
      })
    }
  },
  computed: {
  },
  created() {
    this.getDicts()
    this.$store.dispatch('GET_USERS_DROPLIST')
  },
  mounted() {
    this.init()
  },
  components: {
    searchPanel,
    pagination,
    createTask,
    visitTaskAudit,
    visitTaskCancel
  },
  watch: {
    $route: 'init',
    'queryForm.status': 'onSearch'
  }
}
</script>

<style>
</style>
