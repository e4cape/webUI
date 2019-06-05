<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <member-export :records="selectionsKeys" :apiParameter="queryForm" :apiKey="apiKey"/>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="memberId">
            <el-input name="inputMemberId" v-model="queryForm.memberId" placeholder="客户ID" @keyup.enter.native="onSearch">
              <el-button name="btnOnSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="settingOptionTypeId" label="所有类型">
            <el-select name="selectSettingOptionTypeId" v-model="queryForm.settingOptionTypeId" placeholder="所有类型">
              <el-option label="所有类型" value></el-option>
              <el-option v-for="(item, index) in dicts" :key="index" :label="item.name" :value="item.settingOptionId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="settingOptionMethodId" label="所有类型">
            <el-select name="selectSettingOptionMethodId" v-model="queryForm.settingOptionMethodId" placeholder="所有情况">
              <el-option label="所有情况" value></el-option>
              <el-option v-for="(item, index) in methodDicts" :key="index" :label="item.name" :value="item.settingOptionId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户ID" prop="memberId">
            <el-input name="inputMemberId" v-model="queryForm.memberId" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="trueName">
            <el-input name="inputTrueName" v-model="queryForm.trueName" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input name="inputMobile" v-model="queryForm.mobile" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="会员卡号" prop="vipCardNo">
            <el-input name="inputVipCardNo" v-model="queryForm.vipCardNo" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="回访结果" prop="resultText">
            <el-input name="inputResultText" v-model="queryForm.resultText" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item name="datePickerCreateTime" label="回访时间：" prop="createTime">
            <el-date-picker v-model="queryForm.createTime" type="daterange" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- @module 数据表格  -->
    <el-table :data="data" @sort-change="sortChange" @selection-change="selectionChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column type="selection" width="55" fixed="left"></el-table-column>
      <el-table-column prop="createTime" label="回访时间" min-width="100" sortable="custom" show-overflow-tooltip fixed="left"></el-table-column>
      <el-table-column prop="taskName" label="客户信息" min-width="350">
        <template slot-scope="scope">
          <userInfo :scope="scope.row"></userInfo>
        </template>
      </el-table-column>
      <el-table-column prop="settingOptionTypeName" label="任务类型" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="resultText" label="回访结果" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="settingOptionMethodName" label="回访方式" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="content" label="回访记录内容" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- End 数据表格 -->

    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>

<script>
import {
  SettingOptionTypes,
  VisitTaskStatus
} from '@/enums/membership'
import { YNStatus } from '@/enums/common'
import {
  MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS,
  MEMBERSHIP_API_VISITLOG_SEARCH
} from '@/apis/membership'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import userInfo from '@/components/scrm/userInfo.vue'
import MemberExport from '@/components/scrm/memberExport'

export default {
  data() {
    return {
      YNStatus,
      visitTaskStatus: VisitTaskStatus,
      settingOptionTypes: SettingOptionTypes,
      dicts: [],
      methodDicts: [],

      parameters: {
      },
      data: [],
      total: 0,
      selections: [],
      createUsers: [],
      TaskParams: {
        params: {
        }
      },
      selectionData: {
      },
      auditDialog: false, // 审核
      cancelDialog: false, // 取消审核
      queryForm: {
        memberId: '',
        trueName: '',
        mobile: '',
        vipCardNo: '',
        resultText: '',
        settingOptionTypeId: '',
        settingOptionMethodId: '',
        timeStart: '',
        timeEnd: '',
        orderField: '',
        orderType: 0,
        PageIndex: 1,
        PageSize: 20
      },
      apiKey: 'VISITLOG_SEARCH'
    }
  },
  created() { },
  methods: {
    init() {
      let query = this.$route.query || {
      }
      this.queryForm = Object.assign(this.queryForm, query)
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let createTime = this.queryForm.createTime || ['', '']
      let param = {
        timeStart: createTime[0],
        timeEnd: createTime[1]
      }
      this.queryForm = Object.assign(this.queryForm, this.parameters, param)

      MEMBERSHIP_API_VISITLOG_SEARCH(this.queryForm).then(res => {
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
        type: this.settingOptionTypes.VisitTaskType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.dicts = res.data.Data
        }
      })
      MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS({
        type: this.settingOptionTypes.VisitMethod
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.methodDicts = res.data.Data
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
        this.$message.error('请选择待审核的采购入库单')
      } else {
        this.auditDialog = true
      }
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
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
        path: this.$router.path, query: this.parameters
      })
    }
  },
  beforeMount() {
    this.getDicts()
  },
  mounted() {
    this.init()
  },
  components: {
    searchPanel,
    pagination,
    userInfo,
    MemberExport
  },
  watch: {
    $route: 'init',
    'queryForm.status': 'onSearch'
  },
  computed: {
    selectionsKeys() {
      return this.selections.map(sel => sel.visitLogId)
    }
  }
}
</script>

<style>
</style>
