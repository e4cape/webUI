<template>
  <div class="sms-marketing-look">
    <div class="hd" v-loading="loadindTop">
      <table>
        <tbody>
          <tr>
            <th rowspan="3" class="sp">
              <img v-if="smsMarketingInfo.status == EnumMessageTaskStatus.Draft" src="../../../assets/images/status1.png">
              <img v-if="smsMarketingInfo.status == EnumMessageTaskStatus.Pending" src="../../../assets/images/status3.png">
              <img v-if="smsMarketingInfo.status == EnumMessageTaskStatus.Pass" src="../../../assets/images/status2.png">
              <img v-if="smsMarketingInfo.status == EnumMessageTaskStatus.Returned" src="../../../assets/images/status4.png">
              <img v-if="smsMarketingInfo.status == EnumMessageTaskStatus.Invalid" src="../../../assets/images/status5.png">
              {{smsMarketingInfo.statusText}}
            </th>
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
      <div class="fl">客户列表</div>
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
    </el-table>
    <pagination :total="total" :pg="form.pageIndex" :size="form.pageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <div class="bd">
      <el-button type="primary" name="btnAudit" v-if="smsMarketingInfo.status == EnumMessageTaskStatus.Pending" @click="visibleAuditModal = true">审核</el-button>
      <template v-if="smsMarketingInfo.status == EnumMessageTaskStatus.Draft || smsMarketingInfo.status == EnumMessageTaskStatus.Returned">
        <el-button name="btnEdit" type="primary" @click="$router.push(`/market/customerMarketing/smsMarketingEdit?id=${form.messageTaskId}`)">编辑</el-button>
        <el-button name="btnInvalid" @click="invalid">作废</el-button>
      </template>
      <member-Export mode="no" :apiParameter="form" :apiKey="apiKey" class="m-l-10">
        <template slot-scope="{ toggle }">
          <el-button name="btnExport" @click="() => toggle(1)">导出客户列表</el-button>
        </template>
      </member-Export>
    </div>
    <auditModal v-if="visibleAuditModal" :visibleAuditModal="visibleAuditModal" :auditInfo="smsMarketingInfo" @listenVisibleAuditModal="listenVisibleAuditModal" @auditFinish="getData"></auditModal>
  </div>
</template>
<script>
import pagination from '@/components/pagination.vue'
import userInfo from '@/components/scrm/userInfo'
import auditModal from './auditModal'
import memberExport from '@/components/scrm/memberExport'
import {
  MEMBERSHIP_API_MESSAGETASK_GETMESSAGETASK,
  MEMBERSHIP_API_MESSAGEITEM_GETMESSAGEMEMBERS,
  MEMBERSHIP_API_MESSAGETASK_INVALID
} from '@/apis/membership'
import {
  MessageTaskStatus
} from '@/enums/membership'
export default {
  data() {
    return {
      loadindTop: false,
      smsMarketingInfo: {}, // 短信任务数据
      visibleAuditModal: false, // 审核显隐
      apiKey: 'MESSAGEITEM_GETMESSAGEMEMBERS', // 导出api
      // 表格分页相关
      form: {
        messageTaskId: this.$route.query.id,
        pageIndex: 0,
        pageSize: 0
      },
      parameter: {
      },
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
            this.smsMarketingInfo.messageTaskId = this.$route.query.id
          }
          this.loadindTop = false
        }
      )
    },
    // 表格分页相关
    init() {
      const {
        query
      } = this.$route
      this.parameter.pageSize = query.pageSize || 10
      this.parameter.pageIndex = query.pageIndex || 1
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: `/market/customerMarketing/smsMarketingLook?id=${this.$route.query.id}`,
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
    // -关闭
    listenVisibleAuditModal() {
      this.visibleAuditModal = false
      this.getMessageTask()
      this.init()
    },
    // 作废
    invalid() {
      this.$confirm('您正在进行作废操作，作废后不可恢复！确定作废?', '作废', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        MEMBERSHIP_API_MESSAGETASK_INVALID(this.$route.query.id).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('已作废！')
            this.getMessageTask()
            this.getData()
          }
          this.$store.commit('SET_FULL_LOADING', false)
        })
      })
    }
  },
  components: {
    pagination,
    userInfo,
    auditModal,
    memberExport
  }
}
</script>
<style lang="scss" scoped>
.sms-marketing-look {
  .hd {
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
    height: 34px;
    line-height: 34px;
    padding: 0 10px;
    .fl {
      font-weight: bold;
    }
  }
  .bd {
    padding: 5px 0 45px;
  }
}
</style>
