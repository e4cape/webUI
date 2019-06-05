<template>
  <div class="sms-marketing-edit">
    <div class="hd" v-loading="loadindTop">
      <div class="top">
        <el-button name="btnVisiblemsgMarketingModal" type="text" @click="visiblemsgMarketingModal = true">修改</el-button>
      </div>
      <table>
        <tbody>
          <tr>
            <th>短信模板</th>
            <td>{{smsMarketingInfo.templateName}}</td>
            <th>创建</th>
            <td>{{smsMarketingInfo.createUser}} {{smsMarketingInfo.createTime}}</td>
            <th>审核</th>
            <td>{{smsMarketingInfo.checkUser}} {{smsMarketingInfo.checkTime}}</td>
          </tr>
          <tr>
            <th>短信内容</th>
            <td>{{smsMarketingInfo.templateContent}}</td>
            <th>发送时间</th>
            <td>{{smsMarketingInfo.sendTime}}</td>
            <th>{{smsMarketingInfo.checkNote ? '退回原因': ''}}</th>
            <td>{{smsMarketingInfo.checkNote}}</td>
          </tr>
          <tr>
            <th>备注</th>
            <td>{{smsMarketingInfo.remark}}</td>
            <th></th>
            <td></td>
            <th></th>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="md clear">
      <div class="fl">
        <el-button name="btnSelectMemberVisible" type="primary" @click="selectMemberVisible=true">选择客户</el-button>
        <el-button name="btnVisibleImportFromTag" type="primary" @click="visibleImportFromTag = true">从数据挖掘中导入</el-button>
      </div>
      <div class="fl m-l-10">
        <el-input name="inputKeyword" v-model="form.keyword" @keyup.enter.native="searchBykeyword" @clear="searchBykeyword" placeholder="会员卡号/姓名/手机号码"></el-input>
      </div>
      <div class="fr">客户总数：{{total}}</div>
    </div>
    <el-table :data="tableData" v-loading="$store.getters.tb_loading">
      <el-table-column label="基本信息" min-width="400" fixed>
        <template slot-scope="scope">
          <user-Info :scope="scope.row"></user-Info>
        </template>
      </el-table-column>
      <el-table-column label="出生日期" prop="birthday" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.birthday | filterDate }}</template>
      </el-table-column>
      <el-table-column label="生日" prop="dateOfBirthText" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="关注时间" prop="subscrTime" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.subsrcTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column label="入会日期" prop="joinTime" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.joinTime | filterDate}}</template>
      </el-table-column>
      <el-table-column label="最近消费日期" prop="expendLast" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.expendLast | filterDateMinutes}}</template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button name="btnDel" type="text" :key="scope.row.messageItemId" @click="del($event,scope.row.messageItemId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.pageIndex" :size="form.pageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <div class="bd">
      <el-button name="btnSubmitAudit" type="primary" @click="submitAudit">提交审核</el-button>
      <el-button name="btnBack" @click="$router.back()">返回</el-button>
    </div>
    <msgMarketingModal
      title="修改营销短信"
      v-if="visiblemsgMarketingModal"
      :visiblemsgMarketingModal="visiblemsgMarketingModal"
      @listenVisiblemsgMarketingModal="listenVisiblemsgMarketingModal"
      :messageTaskId="form.messageTaskId"
      :smsMarketingInfo="smsMarketingInfo"
    />
    <select-members title="选择客户" v-if="selectMemberVisible" :selectMemberVisible="selectMemberVisible" @listenSelectMemDialog="listenSelectMemDialog" @listenAddMember="listenAddMember"></select-members>
    <importFromTag
      v-if="visibleImportFromTag"
      :visibleImportFromTag="visibleImportFromTag"
      @listenConfirmImportFromTag="listenConfirmImportFromTag"
      @listenVisibleImportFromTag="visibleImportFromTag = false"
    />
  </div>
</template>
<script>
import pagination from '@/components/pagination.vue'
import userInfo from '@/components/scrm/userInfo'
import msgMarketingModal from '@/components/scrm/msgMarketingModal'
import selectMembers from '@/components/scrm/selectMembers'
import importFromTag from '@/components/scrm/importFromTag'
import {
  MEMBERSHIP_API_MESSAGETASK_GETMESSAGETASK,
  MEMBERSHIP_API_MESSAGEITEM_GETMESSAGEMEMBERS,
  MEMBERSHIP_API_MESSAGEITEM_DELETE,
  MEMBERSHIP_API_MESSAGETASK_SUBMITAUDIT,
  MEMBERSHIP_API_MESSAGEITEM_ADDMEMBERS,
  MEMBERSHIP_API_MESSAGEITEM_ADDMEMBERSFROMTAGGROUP
} from '@/apis/membership'
import {
  MessageTaskStatus
} from '@/enums/membership'
export default {
  data() {
    return {
      loadindTop: false,
      visiblemsgMarketingModal: false, // 修改营销短信显隐
      smsMarketingInfo: {}, // 短信任务数据
      selectMemberVisible: false, // 选择客户弹窗
      visibleImportFromTag: false, // 从数据挖掘导入显隐
      // 表格分页相关
      form: {
        messageTaskId: this.$route.query.id,
        keyword: '', // 搜索条件
        pageIndex: 0,
        pageSize: 0
      },
      parameter: {},
      tableData: [],
      total: 0
    }
  },
  computed: {
    EnumMessageTaskStatus() {
      return MessageTaskStatus
    }
  },
  watch: {
    $route: 'init'
  },
  mounted() {
    this.getMessageTask()
    this.init()
  },
  methods: {
    // 获取短信任务
    getMessageTask() {
      this.loadindTop = true
      MEMBERSHIP_API_MESSAGETASK_GETMESSAGETASK(this.$route.query.id).then(
        res => {
          if (res.data.Code == 'CORRECT') {
            this.smsMarketingInfo = res.data.Data
          }
          this.loadindTop = false
        }
      )
    },
    // 选择客户
    listenAddMember(data) {
      this.addMember(data)
    },
    listenSelectMemDialog() {
      this.selectMemberVisible = false
    },
    addMember(selectData) {
      const members = selectData.map(item => ({
        memberId: item.memberId,
        mobile: item.mobile,
        trueName: item.trueName,
        expendLast: item.expendLast
      }))
      MEMBERSHIP_API_MESSAGEITEM_ADDMEMBERS({
        messageTaskId: this.$route.query.id,
        members
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: `成功添加${res.data.Data}条记录,已自动过滤存在的记录`,
            type: 'success'
          })
          this.init()
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    // 从数据挖掘中导入
    listenConfirmImportFromTag(p) {
      this.$store.commit('SET_BTN_LOADING', true)
      const param = {
        messageTaskId: this.$route.query.id,
        ...p
      }
      MEMBERSHIP_API_MESSAGEITEM_ADDMEMBERSFROMTAGGROUP(param).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.visibleImportFromTag = false
          this.getData()
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    // 表格分页相关
    init() {
      const { query } = this.$route
      this.parameter.pageSize = query.pageSize || 10
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.keyword = query.keyword || ''
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: `/market/customerMarketing/smsMarketingEdit?id=${this.$route.query.id}`,
        query: this.parameter
      })
    },
    currentChange(val) {
      this.parameter.pageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      this.parameter.pageIndex = 1
      this.parameter.pageSize = val
      this.initRoute()
    },
    searchBykeyword() {
      this.parameter.keyword = this.form.keyword
      this.initRoute()
    },
    // -获取数据挖掘的客户列表
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      this.form = Object.assign(this.form, this.parameter)
      MEMBERSHIP_API_MESSAGEITEM_GETMESSAGEMEMBERS(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.rows
          this.total = res.data.Data.total
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    // 修改营销短信
    // -关闭
    listenVisiblemsgMarketingModal() {
      this.visiblemsgMarketingModal = false
      this.getMessageTask()
    },
    // 删除
    del($event,messageItemId) {
      $event.currentTarget.blur()
      this.$confirm('你确定要删除这个客户吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        MEMBERSHIP_API_MESSAGEITEM_DELETE(messageItemId).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('已删除！')
            this.getData()
          }
          this.$store.commit('SET_FULL_LOADING', false)
        })
      }).catch(() => { })
    },
    // 提交审核
    submitAudit() {
      MEMBERSHIP_API_MESSAGETASK_SUBMITAUDIT(this.form.messageTaskId).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.$router.push('/market/customerMarketing/smsMarketing')
          }
        }
      )
    }
  },
  components: {
    pagination,
    userInfo,
    msgMarketingModal,
    selectMembers,
    importFromTag
  }
}
</script>
<style lang="scss" scoped>
.sms-marketing-edit {
  .hd {
    .top {
      position: relative;
      height: 34px;
      border: 1px solid $border-color;
      border-bottom: 0;
      background: $bg-color;
      button {
        position: absolute;
        top: 2px;
        right: 10px;
      }
    }
    table {
      border: 1px solid $border-color;
      tr {
        border-bottom: 1px solid $border-color;
        height: 32px;
        th {
          width: 120px;
          border-left: 1px solid $border-color;
          border-right: 1px solid $border-color;
          background: $bg-color;
          text-align: center;
          &.sp {
            width: 100px;
            background: $white;
            img {
              display: block;
              margin: 0 auto 10px;
            }
          }
        }
        td {
          min-width: 200px;
          padding-left: 10px;
        }
      }
    }
  }
  .md {
    height: 54px;
    line-height: 54px;
    padding: 0 10px;
  }
  .bd {
    padding: 5px 0 45px;
  }
}
</style>
