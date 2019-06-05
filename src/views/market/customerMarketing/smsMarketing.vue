
<template>
  <div>
    <el-form :model="form" ref="search" label-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-button name="btnVisiblemsgMarketingModal" type="primary" @click="visiblemsgMarketingModal = true">新建</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="status">
            <el-select name="selectStatus" v-model="form.status" @change="onSimpleSearch">
              <el-option label="所有状态" value></el-option>
              <el-option v-for="item in EnumMessageTaskStatus.Types" :key="item.key" :label="item.title" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="发送类型：" prop="sendType">
            <el-select name="selectSendType" v-model="form.sendType">
              <el-option label="所有类型" value></el-option>
              <el-option v-for="item in EnumSendTypes.Types" :key="item.key" :label="item.title" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="短信模板：" prop="templateId">
            <el-select name="selectTemplateId" v-model="form.templateId">
              <el-option label="所有模板" value></el-option>
              <el-option v-for="item in templateArr" :key="item.templateId" :label="item.templateName" :value="item.templateId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item name="datePickerCreateTime" label="创建时间：" prop="createTime">
            <el-date-picker
              v-model="createTime"
              @change="dateChange('createTime',$event)"
              value-format="yyyy-MM-dd"
              type="daterange"
              align="left"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item name="datePickerSendTime" label="发送时间：" prop="sendTime">
            <el-date-picker
              v-model="sendTime"
              @change="dateChange('sendTime',$event)"
              value-format="yyyy-MM-dd"
              type="daterange"
              align="left"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
            ></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" @sort-change="sortChange" v-loading="$store.getters.tb_loading">
      <el-table-column label="短信模板" prop="templateName" min-width="100" show-overflow-tooltip fixed></el-table-column>
      <el-table-column label="短信内容" prop="templateContent" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="客户数" prop="memberCount" min-width="50" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" prop="createTime" min-width="100" show-overflow-tooltip sortable></el-table-column>
      <el-table-column label="发送时间" prop="sendTime" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.sendTypeText}} {{scope.row.sendTime}}</template>
      </el-table-column>
      <el-table-column label="状态" prop="statusText" width="100" fixed="right"></el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button name="btnLook" @click="$router.push(`/market/customerMarketing/smsMarketingLook?id=${scope.row.messageTaskId}`)" type="text" size="small">查看</el-button>
          <el-button name="btnAudit" v-if="scope.row.status == EnumMessageTaskStatus.Pending" type="text" size="small" @click="audit(scope.row)">审核</el-button>
          <template v-if="scope.row.status == EnumMessageTaskStatus.Draft || scope.row.status == EnumMessageTaskStatus.Returned">
            <el-button name="btnEdit" type="text" size="small" @click="$router.push(`/market/customerMarketing/smsMarketingEdit?id=${scope.row.messageTaskId}`)">编辑</el-button>
            <el-button name="btnInvalid" type="text" size="small" @click="invalid(scope.row.messageTaskId)">作废</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.pageIndex" :size="form.pageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <msgMarketingModal title="新建营销短信" v-if="visiblemsgMarketingModal" :visiblemsgMarketingModal="visiblemsgMarketingModal" @listenVisiblemsgMarketingModal="listenVisiblemsgMarketingModal"/>
    <auditModal v-if="visibleAuditModal" :visibleAuditModal="visibleAuditModal" :auditInfo="auditInfo" @listenVisibleAuditModal="visibleAuditModal=false" @auditFinish="getData"></auditModal>
  </div>
</template>
<script>
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination.vue'
import msgMarketingModal from '@/components/scrm/msgMarketingModal'
import auditModal from './auditModal'
import {
  MEMBERSHIP_API_MESSAGETASK_GETMESSAGETASKLIST,
  MEMBERSHIP_API_MESSAGETASK_INVALID
} from '@/apis/membership'
import {
  MESSAGE_API_SETTINGTEMPLATE_GETTEMPLATELIST
} from '@/apis/message'
import {
  MessageTaskStatus, SendTypes
} from '@/enums/membership'
import { YNStatus } from '@/enums/common'
export default {
  data() {
    return {
      visiblemsgMarketingModal: false, // 新建营销短信显隐
      visibleAuditModal: false, // 审核显隐
      auditInfo: {}, // 审核信息
      // 表格分页相关
      form: {
        status: '', // 短信营销任务状态
        sendType: '', // 发送类型
        templateId: '', // 模板Id
        createTimeStart: '',
        createTimeEnd: '',
        sendTimeStart: '',
        sendTimeEnd: '',
        orderField: '',
        orderType: YNStatus.No,
        pageIndex: 0,
        pageSize: 0
      },
      createTime: [], // 创建时间
      sendTime: [], // 发送时间
      parameter: {
      },
      tableData: [],
      total: 0,
      templateArr: [] // 短信模版下拉
    }
  },
  computed: {
    EnumMessageTaskStatus() {
      return MessageTaskStatus
    },
    EnumSendTypes() {
      return SendTypes
    }
  },
  watch: {
    $route: 'init'
  },
  beforeMount() {
    this.getTemplateList()
  },
  mounted() {
    this.init()
  },
  methods: {
    // 表格分页相关
    init() {
      const { query } = this.$route
      this.parameter.status = query.status || ''
      this.parameter.sendType = query.sendType || ''
      this.parameter.templateId = query.templateId || ''
      this.parameter.createTimeStart = query.createTimeStart || ''
      this.parameter.createTimeEnd = query.createTimeEnd || ''
      this.parameter.sendTimeStart = query.sendTimeStart || ''
      this.parameter.sendTimeEnd = query.sendTimeEnd || ''
      this.parameter.pageSize = query.pageSize || 10
      this.parameter.pageIndex = query.pageIndex || 1
      this.createTime = this.parameter.createTimeStart
        ? [this.parameter.createTimeStart, this.parameter.createTimeEnd]
        : []
      this.sendTime = this.parameter.sendTimeStart
        ? [this.parameter.sendTimeStart, this.parameter.sendTimeEnd]
        : []
      this.getData()
    },
    initRoute() {
      this.$router.replace({ query: this.parameter })
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
    onSearch() {
      this.form.pageIndex = 1
      this.parameter = Object.assign({}, this.form)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.parameter)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      this.$refs['search'].resetFields()
      this.form.createTimeStart = ''
      this.form.createTimeEnd = ''
      this.form.sendTimeStart = ''
      this.form.sendTimeEnd = ''
      this.createTime = ''
      this.sendTime = ''
      this.onSearch()
    },
    dateChange(n, v) {
      if (n == 'createTime') {
        if (v && v.length > 0) {
          this.form.createTimeStart = v[0]
          this.form.createTimeEnd = v[1]
        } else {
          this.form.createTimeStart = ''
          this.form.createTimeEnd = ''
        }
      }
      if (n == 'sendTime') {
        if (v && v.length > 0) {
          this.form.sendTimeStart = v[0]
          this.form.sendTimeEnd = v[1]
        } else {
          this.form.sendTimeStart = ''
          this.form.sendTimeEnd = ''
        }
      }
    },
    // -获取短信任务列表
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      this.form = Object.assign(this.form, this.parameter)
      MEMBERSHIP_API_MESSAGETASK_GETMESSAGETASKLIST(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.rows
          this.total = res.data.Data.total
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    // -排序
    sortChange({
      prop, order
    }) {
      this.form.orderField = prop || ''
      this.form.orderType = order == 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getData()
    },
    // -简单搜索
    onSimpleSearch(e) {
      this.parameter.status = e
      this.onSearch()
    },
    // -作废
    invalid(messageTaskId) {
      this.$confirm('您正在进行作废操作，作废后不可恢复！确定作废?', '作废', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        MEMBERSHIP_API_MESSAGETASK_INVALID(messageTaskId).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('已作废！')
            this.getData()
          }
          this.$store.commit('SET_FULL_LOADING', false)
        })
      })
    },
    // 新建营销短信
    // -关闭
    listenVisiblemsgMarketingModal() {
      this.visiblemsgMarketingModal = false
      this.getData()
    },
    // 审核弹窗
    audit(row) {
      this.visibleAuditModal = true
      this.auditInfo = row
    },
    // -获取短信模板
    getTemplateList() {
      const param = {
        templateType: ''
      }
      MESSAGE_API_SETTINGTEMPLATE_GETTEMPLATELIST(param).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.templateArr = res.data.Data
        }
      })
    }
  },
  components: {
    searchPanel,
    pagination,
    msgMarketingModal,
    auditModal
  }
}
</script>

