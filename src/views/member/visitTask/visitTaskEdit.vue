<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">编辑任务</span>
        <span class="title fr">
          <el-button name="btnEditTask" type="text" @click="editTask">修改</el-button>
        </span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">任务名称：</td>
                <td>{{detail.taskName}}</td>
                <td class="tit">创建：</td>
                <td>{{detail.checkUser}}&nbsp;&nbsp;{{detail.createTime}}</td>
                <td class="tit">审核：</td>
                <td>{{detail.status == visitTaskStatus.Pass || detail.status == visitTaskStatus.Returned ? detail.checkUser + ' ' + detail.checkTime : '-'}}</td>
              </tr>
              <tr>
                <td class="tit">任务类型：</td>
                <td>{{detail.settingOptionName}}</td>
                <td class="tit">任务结果标记：</td>
                <td>{{detail.markTypeText}}</td>
                <td class="tit">标记选项：</td>
                <td>
                  {{detail.resultText}}
                  <!-- <template v-for="(item, index) in detail.results">
                    <span :key="index" v-if="item">{{item}}{{index > 0 ? ',' : ''}}</span>
                  </template>-->
                </td>
              </tr>
              <tr>
                <td class="tit">执行人：</td>
                <td>{{detail.excutorsText}}</td>
                <td class="tit">备注：</td>
                <td class="note" colspan="4">{{detail.remark}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="checkPage-hd">
          <el-row>
            <el-col :span="18">
              <el-button name="btnUserOpen" type="primary" @click="userOpen = true">选择客户</el-button>
              <el-button name="btnVisibleImportFromTag" type="primary" @click="visibleImportFromTag = true">从数据挖掘中导入</el-button>
              <el-input name="inputKeyword" class="code-input" v-model="keyword" @keyup.enter.native="getData" placeholder="客户ID/会员卡号/姓名/手机号码">
                <el-button name="btnGetData" slot="append" @click="getData">
                  <i class="el-icon-search"></i>
                </el-button>
              </el-input>
            </el-col>
            <el-col :span="6" class="tr">
              <span class="detail-info-num-item">
                客户总数：
                <b class="num">{{total}}</b>
              </span>
            </el-col>
          </el-row>
        </div>

        <!-- @module 数据表格 -->
        <el-table :data="memberData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
          <el-table-column prop="aliasName" label="基本信息" min-width="350">
            <template slot-scope="scope">
              <userInfo :scope="scope.row"></userInfo>
            </template>
          </el-table-column>
          <el-table-column prop="birthday" label="出生日期" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="dateOfBirthText" label="生日" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="subscrTime" label="关注时间" min-width="120"></el-table-column>
          <el-table-column prop="joinTime" label="入会日期" min-width="120"></el-table-column>
          <el-table-column prop="expendLast" label="最近消费日期" min-width="120"></el-table-column>
          <el-table-column prop="expendLast" label="操作" min-width="120">
            <template slot-scope="scope">
              <el-button name="btnRemoveTaskItem" type="text" @click="removeTaskItem(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- End 数据表格 -->
        <!-- Pagination -->
        <pagination :pg="pg" :size="size" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
      </div>
    </div>
    <div class="buttons">
      <el-button name="btnSubmitVisitTask" type="primary" @click="submitVisitTask">提交审核</el-button>
    </div>
    <!-- @module Dialog·审核 -->

    <!-- 审核 -->
    <visitTaskAudit v-if="auditDialog" :auditDialog="auditDialog" :data="detail" @listenAllDialog="listenAllDialog"></visitTaskAudit>
    <!-- end 审核 -->

    <!-- 取消审核 -->
    <visitTaskCancel v-if="cancelDialog" :cancelDialog="cancelDialog" :data="detail" @listenAllDialog="listenAllDialog"></visitTaskCancel>
    <!-- end 取消审核 -->

    <!-- 新建客戶回访 -->
    <createTask v-if="TaskParams.dialog" :TaskParams="TaskParams" @listenVisitTask="listenUpdateVisitTask"></createTask>
    <!-- end 新建客戶回访 -->

    <!-- 数据挖掘导入 -->
    <importFromTag
      v-if="visibleImportFromTag"
      :visibleImportFromTag="visibleImportFromTag"
      @listenConfirmImportFromTag="listenConfirmImportFromTag"
      @listenVisibleImportFromTag="visibleImportFromTag = false"
    />
    <!-- end 数据挖掘导入 -->
    <select-member @listenAddMember="onAddMember" v-if="userOpen" :selectMemberVisible="true" @listenSelectMemDialog="userOpen = $event"/>
  </div>
</template>

<script>
import {
  SettingOptionTypes,
  VisitTaskStatus
} from '@/enums/membership'
import {
  MEMBERSHIP_API_VISITTASK_GETDETAIL,
  MEMBERSHIP_API_VISITTASK_GETVISITMEMBERLIST,
  MEMBERSHIP_API_VISITTASK_SUBMITAUDIT,
  MEMBERSHIP_API_VISITTASK_UPDATEBASIC,
  MEMBERSHIP_API_VISITTASK_DELETEVISITMEMBERS,
  MEMBERSHIP_API_VISITTASK_ADDVISITMEMBESFROMTAGGROUP,
  MEMBERSHIP_API_VISITTASK_ADDVISITMEMBERS
} from '@/apis/membership'
import SelectMember from '@/components/scrm/selectMembers'
import importFromTag from '@/components/scrm/importFromTag.vue'

import pagination from '@/components/pagination.vue'
import userInfo from '@/components/scrm/userInfo.vue'
import createTask from './createTask.vue'

export default {
  data() {
    return {
      visitTaskStatus: VisitTaskStatus,
      settingOptionTypes: SettingOptionTypes,
      labelPosition: 'right',
      visitTaskId: '',
      keyword: '',
      detail: {
        status: 0,
        visitUserList: []
      }, // 明细
      memberData: [], // 会员数据
      pg: 1,
      size: 20,
      total: 0,
      dictsDialog: false,
      auditDialog: false, // 审核
      cancelDialog: false, // 取消审核
      TaskParams: {
        dialog: false,
        params: {
        }
      },
      visibleImportFromTag: false,
      settingTagGroupId: '',
      userOpen: false
    }
  },
  methods: {
    onAddMember(params) {
      this.loading = true
      MEMBERSHIP_API_VISITTASK_ADDVISITMEMBERS({
        visitTaskId: this.visitTaskId,
        members: params.map(p => ({
          ...p,
          visitTaskId: this.visitTaskId
        }))
      }).then(res => {
        const {
          Code
        } = res.data
        if (Code === 'CORRECT') {
          this.$message.success('操作成功!')
          this.getData()
        }
      })
    },
    init() {
      let query = this.$route.query
      this.visitTaskId = query.id
      if (!this.visitTaskId) {
        this.dataError()
      } else {
        this.getDetail()
        this.getData()
      }
    },
    dataError(msg) {
      this.$confirm(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },
    getDetail() {
      MEMBERSHIP_API_VISITTASK_GETDETAIL({
        visitTaskId: this.visitTaskId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.editForm = res.data.Data
          this.detail = Object.assign(
            {
              status: 0,
              visitUserList: []
            },
            res.data.Data
          )
          this.detail.excutors.forEach(item => {
            this.detail.visitUserList.push(item.userId)
          })
        }
      })
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      MEMBERSHIP_API_VISITTASK_GETVISITMEMBERLIST({
        visitTaskId: this.visitTaskId,
        keyword: this.keyword,
        PageIndex: this.pg,
        PageSize: this.size
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.memberData = res.data.Data.rows
          this.total = res.data.Data.total
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    editTask() {
      this.TaskParams = {
        dialog: true,
        params: this.detail
      }
    },
    removeTaskItem(row) {
      MEMBERSHIP_API_VISITTASK_DELETEVISITMEMBERS({
        visitTaskId: this.visitTaskId,
        visitMemberId: row.visitMemberId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.getDetail()
          this.getData()
        }
      })
    },
    listenConfirmImportFromTag(data) {
      this.$store.commit('SET_BTN_LOADING', true)
      MEMBERSHIP_API_VISITTASK_ADDVISITMEMBESFROMTAGGROUP({
        visitTaskId: this.visitTaskId,
        ...data
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.getDetail()
          this.getData()
          this.visibleImportFromTag = false
        }
      })
    },
    listenUpdateVisitTask(data) {
      if (!data) {
        this.TaskParams.dialog = false
        return false
      }
      this.updateVisitTask(data)
    },
    updateVisitTask(data) {
      MEMBERSHIP_API_VISITTASK_UPDATEBASIC(data).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail.visitUserList = []
          this.TaskParams.dialog = false
          this.getDetail()
        }
      })
    },
    pageChange(val) {
      this.pg = val
      this.getData()
    },
    pageSizeChange(val) {
      this.pg = 1
      this.size = val
      this.getData()
    },
    showDetailDialog(goodsId) {
      this.goodDetailDialog = {
        goodsId: goodsId,
        visible: true
      }
    },
    listenGoodDetailDialog() {
      this.goodDetailDialog.visible = false
    },
    listenEditDialog(data) {
      this.detail = data
      this.editDialog = false
    },
    listenAuditDialog(success) {
      if (success) {
        this.getDetail()
      }
      this.auditDialog = false
    },
    listenAbandonDialog(success) {
      if (success) {
        this.getDetail()
      }
      this.abandonDialog = false
    },
    submitVisitTask() {
      MEMBERSHIP_API_VISITTASK_SUBMITAUDIT({
        visitTaskId: this.visitTaskId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$router.replace({
            path: '/member/visitTask/index'
          })
        }
      })
    }
  },
  mounted() {
    this.init()
  },
  components: {
    pagination,
    userInfo,
    createTask,
    SelectMember,
    importFromTag
  }
}
</script>

<style  lang="scss">
.visitTaskTagsTable {
  .el-table__header {
    .el-checkbox {
      display: none;
    }
  }
}
</style>

