<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox"></template>
        <template slot="simpleSearch">
          <el-form-item prop="finishStatus">
            <el-select name="selectFinishStatus" v-model="queryForm.finishStatus" placeholder="所有状态">
              <el-option label="所有状态" value></el-option>
              <el-option v-for="(item,index) in visitTaskFinishStatus.Types" :key="index" :label="item.title" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="taskName">
            <el-input name="inputTaskName" v-model="queryForm.taskName" placeholder="任务名称" @keyup.enter.native="onSearch">
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
          <el-form-item label="执行人：" prop="userId">
            <el-select name="selectUserId" v-model="queryForm.userId" placeholder="全部" :filterable="true">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.users" :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item name="datePickerCreateTime" label="创建时间：" prop="createTime">
            <el-date-picker v-model="queryForm.createTime" type="daterange" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item name="datePickerLastTime" label="最后修改时间：" prop="lastTime">
            <el-date-picker v-model="queryForm.lastTime" type="daterange" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- table -->
    <div class="visitTask-wrapper" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <!-- 左侧 -->
      <div class="goods-left">
        <table class="goods-table" cellpadding="0" cellspacing="0">
          <tbody>
            <tr v-for="(item, index) in leftData" :key="index" @click="selectTask(item, index)">
              <div
                :class="['taskEx-item',
                item.finishStatus == visitTaskFinishStatus.NotStarted ? 'visit-no-start' : item.finishStatus == visitTaskFinishStatus.InComplete ? 'visit-no-finish' : 'visit-start',
                selectTaskId === item.visitTaskId ? 'visitTask-select-active' : '']"
              >
                <div class="item-left">
                  <div class="title">
                    <b>{{item.settingOptionName}}</b>
                    {{item.taskName}}
                  </div>
                  <div class="users">
                    执行人：
                    <span v-for="(val, key) in item.excutors" :key="key">{{val.trueName}}</span>
                  </div>
                </div>
                <div class="item-right">
                  <p class="time">{{item.checkTime}}</p>
                  <div class="btn">
                    <button>{{item.finishStatusText}}</button>
                  </div>
                </div>
              </div>
            </tr>
          </tbody>
        </table>
        <!-- 工具栏 -->
        <div class="toolsbar">
          <div class="myPagination-bar">
            <el-select v-model="queryForm.pageSize" placeholder="20" @change="getData">
              <el-option v-for="(item, index) in paginationSizes" :key="index" :value="item"></el-option>
            </el-select>
            <div class="pagination-controller">
              <button name="btnPrevPage" class="prev-btn" @click="prevPage" :disabled="queryForm.pageIndex === 1" :class="{'isDisabled': queryForm.pageIndex === 1}">
                <i class="el-icon-arrow-left"></i>
              </button>
              <span class="current-page">{{queryForm.pageIndex}}/{{pages}}</span>
              <button name="btnNextPage" class="next-btn" @click="nextPage" :disabled="queryForm.pageIndex === pages" :class="{'isDisabled': queryForm.pageIndex === pages}">
                <i class="el-icon-arrow-right"></i>
              </button>
            </div>
            <span class="total">共{{totalCount}}条</span>
          </div>
          <div class="count-bar">
            <span class="fl">任务合计：{{totalCount}}</span>
            <span class="fr">
              客户合计：
              <b>{{totalMemberCount}}</b>
            </span>
          </div>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="goods-right">
        <div class="panel">
          <div class="panel-hd">
            <span class="title">客户列表</span>
          </div>

          <div class="p-10 tc">
            <el-radio-group name="radioGroupSelectUserId" v-model="selectUserId">
              <el-radio-button v-for="(item, index) in selectUserlist" :label="item.userId" :key="index">{{item.trueName}}</el-radio-button>
            </el-radio-group>
          </div>

          <div class="p-10 buttons-head">
            <el-row>
              <el-col :span="12">
                <el-button name="btnOpenVisitRecord" type="primary" :disabled="selections.length == 0" @click="openVisitRecord">批量记录</el-button>
                <el-button name="btnBatchFinishRate" :disabled="selections.length == 0" @click="batchFinishRate">批量结束</el-button>
                <span class="p-l-10">完成: {{finishRate.finishCount}} / {{finishRate.memberCount}}</span>
              </el-col>
              <el-col :span="12" class="tr">
                <div>
                  <span class="buttons-head-right-item" v-for="(item, index) in finishRate.results" :key="index">
                    <span style="color:#777777">{{item.result}}</span>
                    <span>{{item.count}}</span>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>

          <!-- @module 数据表格  -->
          <el-table :data="rightData" @selection-change="selectionChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
            <el-table-column type="selection" width="55" fixed="left"></el-table-column>
            <el-table-column prop="trueName" label="基本信息" min-width="350" sortable="custom">
              <template slot-scope="scope">
                <userInfo :scope="scope.row" @click="$router.push({path: '/member/viewCustomer/'})"></userInfo>
              </template>
            </el-table-column>
            <el-table-column prop="taskStatusText" label="状态" min-width="80"></el-table-column>
            <el-table-column prop="resultText" label="回访结果" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="resultText" label="操作" min-width="150">
              <template slot-scope="scope">
                <el-button name="btnOpenOneVisitRecord" type="text" @click="openOneVisitRecord(scope.row)">回访记录</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- End 数据表格 -->
        </div>
        <pagination :pg="pageIndex2" :size="pageSize2" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      </div>
    </div>

    <!-- 回访记录 -->
    <visitRecord v-if="recordVisible" :currUserInfoArr="currUserInfoArr" :recordVisible="recordVisible" @closeClick="closeReturnVisitModal" :id="selectTaskId" @logged="onLogged" @close="onClose"/>
  </div>
</template>

<script>
import { debounce } from 'lodash'
import {
  YNStatus,
  VisitTaskFinishStatus,
  SettingOptionTypes
} from '@/enums/membership'

import {
  MEMBERSHIP_API_SETTINGOPTION_GETOPTIONS,
  MEMBERSHIP_API_VISITTASKEXCUTION_SEARCHTASKLIST,
  MEMBERSHIP_API_VISITTASKEXCUTION_SEARCHMEMBERLIST,
  MEMBERSHIP_API_VISITTASKEXCUTION_SEARCHMEMBERFINISHRATE,
  MEMBERSHIP_API_VISITTASKEXCUTION_BATCHFINISH
} from '@/apis/membership'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import userInfo from '@/components/scrm/userInfo.vue'
import visitRecord from './visitRecord.vue'

export default {
  data() {
    return {
      YNStatus,
      visitTaskFinishStatus: VisitTaskFinishStatus,
      settingOptionTypes: SettingOptionTypes,
      dicts: [],
      leftData: [],
      rightData: [],
      queryForm: {
        taskName: '',
        userId: '',
        finishStatus: '',
        settingOptionId: '',
        createTimeStart: '',
        createTimeEnd: '',
        lastTimeStart: '',
        lastTimeEnd: '',
        pageIndex: 1,
        pageSize: 20,
        lastTime: null,
        createTime: null
      },
      queryForm2: {
        visitTaskId: '',
        excutorId: '',
        pageIndex: 1,
        pageSize: 20
      },
      pageIndex2: 1,
      pageSize2: 20,
      parameters: {},
      data: [],
      total: 0,
      selectTaskId: '',
      selections: [],
      createUsers: [],
      // 表格所需
      detail: {},
      totalMemberCount: 0, // 会员总数
      totalCount: 0, // 数量合计
      paginationSizes: [10, 15, 20], // 分页数据条数数组
      selectUserlist: [],
      selectUserId: '',
      finishRate: {},
      // 弹窗所需
      recordVisible: false,
      currUserInfoArr: []
    }
  },
  computed: {
    pages() {
      return (
        (this.totalCount % this.queryForm.pageSize === 0
          ? Math.ceil(this.totalCount / this.queryForm.pageSize)
          : parseInt(this.totalCount / this.queryForm.pageSize) + 1) || 1
      )
    }
  },
  methods: {
    init() {
      let query = this.$route.query || {}
      this.queryForm = Object.assign(this.queryForm, query)
      this.getData()
    },
    onLogged() {
      this.getRightTableData()
    },
    onClose() {
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
      MEMBERSHIP_API_VISITTASKEXCUTION_SEARCHTASKLIST(this.queryForm).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.totalMemberCount = res.data.Data.totalMemberCount || 0
            this.totalCount = res.data.Data.total || 0
            this.leftData = res.data.Data.rows || []
            if (!this.selectTaskId) {
              this.selectTaskId = this.leftData.length
                ? this.leftData[0].visitTaskId
                : ''
              this.selectTask(this.leftData[0], 0)
            }
          }
          this.$store.commit('SET_TB_LOADING', false) // table loading
        }
      )
    },
    getRightTableData() {
      if (!!this.selectTaskId === false) {
        this.rightData = []
        this.total = 0
        return
      }
      MEMBERSHIP_API_VISITTASKEXCUTION_SEARCHMEMBERLIST(
        Object.assign({}, this.queryForm2, {
          excutorId: this.selectUserId,
          visitTaskId: this.selectTaskId,
          pageSize: this.pageSize2,
          pageIndex: this.pageIndex2
        })
      ).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.rightData = res.data.Data.rows
          this.total = res.data.Data.total
          this.getFinishRate()
        }
      })
    },
    getFinishRate() {
      MEMBERSHIP_API_VISITTASKEXCUTION_SEARCHMEMBERFINISHRATE({
        excutorId: this.selectUserId,
        visitTaskId: this.selectTaskId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.finishRate = res.data.Data
        }
      })
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
    openVisitRecord() {
      if (!this.selections.length) {
        this.$message.error('请选择客户')
        return false
      }
      this.currUserInfoArr = this.selections
      this.recordVisible = true
    },
    openOneVisitRecord(record) {
      this.currUserInfoArr = [record]
      this.recordVisible = true
    },
    batchFinishRate() {
      if (!this.selections.length) {
        this.$message.error('请选择客户')
        return false
      }
      let arr = []
      this.selections.forEach(res => {
        arr.push(res.visitMemberId)
      })

      MEMBERSHIP_API_VISITTASKEXCUTION_BATCHFINISH({
        visitMemberIdList: arr
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('操作成功!')
          this.getData()
          this.getRightTableData()
        }
      })
    },
    selectionChange(selection) {
      this.selections = selection
    },
    closeReturnVisitModal(success) {
      if (success) {
        this.getRightTableData()
      }
      this.recordVisible = false
    },
    multiAudit() {
      if (
        !this.selections.length ||
        this.selections.filter(item => {
          if (item.State !== this.visitBookStatus.Wait) {
            return item
          }
        }).length > 0
      ) {
        this.$message.error('请选择待审核的采购入库单')
      } else {
        this.auditDialog = true
      }
    },
    selectTask(item) {
      if (!item) {
        return false
      }
      this.selectUserlist = []
      let arr = item.excutors.slice()
      arr.unshift({
        trueName: '全部',
        userId: ''
      })
      this.selectUserlist = arr
      this.selectTaskId = item.visitTaskId
    },
    prevPage() {
      this.queryForm.pageIndex -= 1
      this.getData()
    },
    nextPage() {
      this.queryForm.pageIndex += 1
      this.getData()
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
      this.pageIndex2 = val
      this.getRightTableData()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.pageIndex2 = 1
      this.pageSize2 = val
      this.getRightTableData()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: this.parameters
      })
    }
  },
  beforeMount() {
    this.getDicts()
    this.$store.dispatch('GET_USERS_DROPLIST')
  },
  mounted() {
    this.getRightTableData = debounce(this.getRightTableData, 500)
    this.init()
  },
  components: {
    searchPanel,
    pagination,
    userInfo,
    visitRecord
  },
  watch: {
    $route: 'init',
    'queryForm.finishStatus': 'onSearch',
    selectUserId() {
      this.getRightTableData()
    },
    selectTaskId() {
      const { UserId } = this.$store.getters.user_session
      if (this.selectUserlist.find(({ userId }) => userId === UserId)) {
        this.selectUserId = UserId
      } else {
        this.selectUserId = ''
      }
      this.getRightTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/sass/scrm/visitTask.scss';
</style>

