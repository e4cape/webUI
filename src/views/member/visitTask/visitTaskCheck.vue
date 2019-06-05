<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看任务</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="6" class="tc state-img">
                  <img src="../../../assets/images/draft.png" v-if="detail.status == visitTaskStatus.Draft">
                  <img src="../../../assets/images/auditing.png" v-if="detail.status == visitTaskStatus.Pending">
                  <img src="../../../assets/images/audited.png" v-if="detail.status == visitTaskStatus.Pass">
                  <img src="../../../assets/images/auditBack.png" v-if="detail.status == visitTaskStatus.Returned">
                  <img src="../../../assets/images/abandon.png" v-if="detail.status == visitTaskStatus.Cancel || detail.status == visitTaskStatus.Invalid">
                  <div>{{visitTaskStatus.Types.find(v => v.key == detail.status) && visitTaskStatus.Types.find(v => v.key == detail.status).title}}</div>
                </td>
              </tr>
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
        </el-table>
        <!-- End 数据表格 -->
        <!-- Pagination -->
        <pagination :pg="pg" :size="size" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
      </div>
    </div>
    <div class="buttons">
      <template v-if="detail.status == visitTaskStatus.Returned || detail.status == visitTaskStatus.Draft">
        <el-button name="btnEdit" type="primary" @click="$router.push({path:'/member/visitTask/visitTaskEdit',query:{id: detail.visitTaskId}})">编辑</el-button>
        <el-button name="btnInvalid" @click="visitTaskAbandon">作废</el-button>
      </template>
      <el-button name="btnAudit" type="primary" @click="auditDialog = true" v-if="detail.status === visitTaskStatus.Wait">审核</el-button>
    </div>
    <!-- @module Dialog·审核 -->

    <!-- 审核 -->
    <visitTaskAudit v-if="auditDialog" :auditDialog="auditDialog" :data="detail" @listenAllDialog="listenAllDialog"></visitTaskAudit>
    <!-- end 审核 -->

    <!-- 取消审核 -->
    <visitTaskCancel v-if="cancelDialog" :cancelDialog="cancelDialog" :data="detail" @listenAllDialog="listenAllDialog"></visitTaskCancel>
    <!-- end 取消审核 -->
  </div>
</template>

<script>
import {
  VisitTaskStatus
} from '@/enums/membership'
import {
  MEMBERSHIP_API_VISITTASK_GETDETAIL,
  MEMBERSHIP_API_VISITTASK_GETVISITMEMBERLIST,
  MEMBERSHIP_API_VISITTASK_INVALID
} from '@/apis/membership'

import pagination from '@/components/pagination.vue'
import userInfo from '@/components/scrm/userInfo.vue'
import visitTaskAudit from './visitTaskAudit.vue'
import visitTaskCancel from './visitTaskCancel.vue'

export default {
  data() {
    return {
      visitTaskStatus: VisitTaskStatus,
      labelPosition: 'right',
      visitTaskId: '',
      detail: {
        status: 0
      }, // 明细
      memberData: [], // 会员数据
      pg: 1,
      size: 20,
      total: 0,
      dictsDialog: false,
      auditDialog: false, // 审核
      cancelDialog: false // 取消审核
    }
  },
  methods: {
    visitTaskAbandon() {
      this.$confirm('您正在进行作废操作，作废后不可恢复？', '确定作废？', {
        distinguishCancelAndClose: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          MEMBERSHIP_API_VISITTASK_INVALID({
            visitTaskId: this.detail.visitTaskId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.getDetail()
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
          this.detail = Object.assign({
          }, res.data.Data)
        }
      })
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      MEMBERSHIP_API_VISITTASK_GETVISITMEMBERLIST({
        visitTaskId: this.visitTaskId,
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
    }
  },
  mounted() {
    this.init()
  },
  components: {
    pagination,
    userInfo,
    visitTaskAudit,
    visitTaskCancel
  }
}
</script>
