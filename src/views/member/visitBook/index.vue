
<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button name="btnCreateBook" type="primary" @click="createBook" style="margin-right: 10px">新建</el-button>
          <member-export :records="selectionsKeys" :apiParameter="queryForm" :apiKey="apiKey"/>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="status">
            <el-select name="selectStatus" v-model="queryForm.status" placeholder="所有状态">
              <el-option label="所有状态" value></el-option>
              <el-option v-for="(item,index) in visitBookStatus.Types" :key="index" :label="item.title" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="visitBookId">
            <el-input name="inputVisitBookId" v-model="queryForm.visitBookId" placeholder="ID" @keyup.enter.native="onSearch">
              <el-button name="btnOnSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="settingOptionId" label="所有类型">
            <el-select name="selectSettingOptionId" v-model="queryForm.settingOptionId" placeholder="所有类型">
              <el-option label="所有类型" value></el-option>
              <el-option v-for="(item, index) in dicts" :key="index" :label="item.name" :value="item.settingOptionId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="ID：" prop="visitBookId">
            <el-input name="inputVisitBookId" v-model="queryForm.visitBookId" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="主题：" prop="subject">
            <el-input name="inputSubject" v-model="queryForm.subject" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item name="datePickerCreateTime" label="创建时间：" prop="createTime">
            <el-date-picker v-model="queryForm.createTime" type="daterange" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item label="创建人：" prop="createUserId">
            <el-select name="selectCreateUser" v-model="queryForm.createUserId" placeholder="全部" :filterable="true">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.users" :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item name="datePickerLastTime" label="最后修改时间：" prop="lastTime">
            <el-date-picker v-model="queryForm.lastTime" type="daterange" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- @module 数据表格  -->
    <el-table :data="data" @sort-change="sortChange" @selection-change="selectionChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column type="selection" width="40" fixed></el-table-column>
      <el-table-column prop="visitBookId" label="ID" width="80" sortable="custom" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="subject" label="	主题" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="settingOptionName" label="话术类型" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="resultText" label="创建" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.createUser && scope.row.createUser}} {{scope.row.createTime && scope.row.createTime}}</template>
      </el-table-column>
      <el-table-column prop="content" label="话术内容	" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="content" label="最后修改" min-width="150" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.lastUser && scope.row.lastUser}} {{scope.row.lastTime && scope.row.lastTime}}</template>
      </el-table-column>
      <el-table-column prop="statusText" label="	状态" width="70" sortable="custom" fixed="right" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button name="btnEdit" type="text" @click="editVisitBooks(scope.row)">编辑</el-button>
          <el-button name="btnDel" type="text" @click="removeVisitBooks(scope.row)">删除</el-button>
          <el-button name="btnStop" type="text" @click="toggleBookStatus(scope.row, false)" v-if="scope.row.status == visitBookStatus.Enable">停用</el-button>
          <el-button name="btnStart" type="text" @click="toggleBookStatus(scope.row, true)" v-if="scope.row.status == visitBookStatus.Disable">启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->

    <pagination :pg="queryForm.pageIndex" :size="queryForm.pageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- 新建修改回访话术 -->
    <createBooks v-if="bookParams.dialog" :bookParams="bookParams" @dicts-change="dicts = $event" :dicts="dicts" @listenVisitBook="listenVisitBook"></createBooks>
  </div>
</template>

<script>
import {
  YNStatus,
  VisitBookStatus,
  SettingOptionTypes
} from '@/enums/membership'

import {
  MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS,
  MEMBERSHIP_API_VISITBOOK_SEARCH,
  MEMBERSHIP_API_VISITBOOK_CREATE,
  MEMBERSHIP_API_VISITBOOK_UPDATE,
  MEMBERSHIP_API_VISITBOOK_DELETE,
  MEMBERSHIP_API_VISITBOOK_SETENABLE
} from '@/apis/membership'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import createBooks from './createBooks.vue'
import MemberExport from '@/components/scrm/memberExport'

export default {
  data() {
    return {
      YNStatus,
      visitBookStatus: VisitBookStatus,
      settingOptionTypes: SettingOptionTypes,
      dicts: [],
      queryForm: {
        visitBookId: '',
        subject: '',
        createUserId: '',
        status: '',
        settingOptionId: '',
        createTime: '',
        createTimeStart: '',
        createTimeEnd: '',
        lastTime: '',
        lastTimeStart: '',
        lastTimeEnd: '',
        orderField: '',
        orderType: '',
        pageIndex: 1,
        pageSize: 20
      },
      parameters: {},
      data: [],
      total: 0,
      selections: [],
      bookParams: {
        dialog: false,
        params: {}
      },
      auditDialog: false, // 审核
      cancelDialog: false, // 取消审核,
      eOpen: false, // 导出
      apiKey: 'VISITBOOK_SEARCH'
    }
  },
  methods: {
    createBook() {
      this.bookParams.params = {}
      this.bookParams.dialog = true
    },
    async toggleBookStatus(d, enable) {
      this.loading = true
      const res = await MEMBERSHIP_API_VISITBOOK_SETENABLE({
        enable,
        visitBookId: d.visitBookId
      })
      const { Code } = res.data
      if (Code === 'CORRECT') {
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        await this.getData()
      }
      this.loading = false
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

      MEMBERSHIP_API_VISITBOOK_SEARCH(this.queryForm).then(res => {
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
        default:
      }
      this.queryForm.IsAsc =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.onSearch()
    },
    getDicts() {
      MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS({
        type: this.settingOptionTypes.VisitBookType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.dicts = res.data.Data
        }
      })
    },
    selectionChange(selection) {
      this.selections = selection
    },
    multiAudit(command) {
      if (
        !command === 'b' &&
        (!this.selections.length ||
          this.selections.filter(item => {
            if (item.State !== this.visitBookStatus.Wait) {
              return item
            }
          }).length > 0)
      ) {
        return this.$message.error('请选择待审核的采购入库单')
      }
      this.eOpen = true
      const self = this
      const cmds = {
        a() {
          // 导出所选
          self.exportType = 0
        },
        b() {
          // 导出所有
          self.exportType = 1
        }
      }
      cmds[command]()
    },
    editVisitBooks(row) {
      this.bookParams.params = row
      this.bookParams.dialog = true
    },
    removeVisitBooks(row) {
      this.$confirm('您正在进行删除操作，删除后不可恢复！', '确定删除？', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          MEMBERSHIP_API_VISITBOOK_DELETE({
            visitBookId: row.visitBookId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('删除成功!')
              this.getData()
            }
          })
        })
        .catch(() => { })
    },
    listenVisitBook(data) {
      if (!data) {
        this.bookParams.dialog = false
        return false
      }
      if (JSON.stringify(this.bookParams.params) === '{}') {
        this.createBooks(data)
      } else {
        this.editBooks(data)
      }
    },
    createBooks(data) {
      MEMBERSHIP_API_VISITBOOK_CREATE(data).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.init()
          this.bookParams.dialog = false
        }
      })
    },
    editBooks(data) {
      MEMBERSHIP_API_VISITBOOK_UPDATE(data).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.init()
          this.bookParams.dialog = false
        }
      })
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
        path: this.$router.path,
        query: this.parameters
      })
      this.getData()
    }
  },
  beforeMount() {
    this.getDicts()
    this.$store.dispatch('GET_USERS_DROPLIST')
  },
  mounted() {
    this.init()
  },
  components: {
    searchPanel,
    pagination,
    createBooks,
    MemberExport
  },
  watch: {
    $route: 'init',
    'queryForm.status': 'onSearch'
  },
  computed: {
    selectionsKeys() {
      return this.selections.map(sel => sel.visitBookId)
    }
  }
}
</script>

<style>
</style>
