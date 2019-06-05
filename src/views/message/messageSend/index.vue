<template>
  <div class="content">
    <el-form
      name="btnMessageSendForm"
      :model="queryForm"
      ref="queryForm"
      lable-width="120px"
      class="item-lh-26"
      :inline="true"
    >
      <search-panel
        @onSearch="onSearch"
        @onReset="onReset"
        name="btnOnSearch"
      >
        <template slot="btnBox">
          <el-form-item>
            <el-button
              name="btnLinkTaskCreate"
              type="primary"
              @click="$router.push({path: '/message/messageSend/taskCreate'})"
            >新增任务</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="auditStatus">
            <el-select
              name="btnAuditStaus"
              v-model="queryForm.auditStatus"
              @change="onSimpleSearch"
            >
              <el-option
                label="所有状态"
                value=""
              ></el-option>
              <el-option
                v-for="item in auditStatus.Types"
                :key="item.key"
                :label="item.title"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="templateName">
            <el-input
              name="btnTemplateName"
              v-model="queryForm.templateName"
              placeholder="模板名称"
              @keyup.native.enter="onSearch"
            >
              <el-button
                name="btnTemplateSearch"
                slot="append"
                icon="el-icon-search"
                @click="onSearch"
              ></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template
          slot="seniorSearch"
          prop=""
        >
          <el-form-item
            label="模板名称："
            prop="templateName"
          >
            <el-input
              name="btnEnterTemlateName"
              v-model="queryForm.templateName"
              @keyup.native.enter="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="模板类型："
            prop="templateType"
          >
            <el-select
              name="btnSelectTemplateType"
              v-model="queryForm.templateType"
            >
              <el-option
                label="全部"
                value=""
              ></el-option>
              <el-option
                v-for="item in templateTypes.Types"
                :key="item.key"
                :value="item.key"
                :label="item.title"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="发送类型："
            prop="sendType"
          >
            <el-select
              name="btnSendType"
              v-model="queryForm.sendType"
            >
              <el-option
                label="全部"
                value=""
              ></el-option>
              <el-option
                v-for="item in sendTypes.Types"
                :key="item.key"
                :value="item.key"
                :label="item.title"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table
      :data="data"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column
        prop="templateTypeText"
        label="模板类型"
        width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="templateName"
        label="模板名称"
        width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="templateContent"
        label="模板内容"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="signature"
        label="模板签名"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="sendTypeText"
        label="发送类型"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="sendGroupTypeText"
        label="发送对象"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="smsCount"
        label="短信条数"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="sendStatusText"
        label="发送状态"
        width="90"
        fixed="right"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="auditStatusText"
        label="审核状态"
        width="90"
        fixed="right"
        show-overflow-tooltip
      ></el-table-column>
      <!-- <el-table-column prop="remark" label="备注" width="120" fixed="right" show-overflow-tooltip></el-table-column> -->
      <el-table-column
        label="操作"
        width="140"
        fixed="right"
      >
        <template slot-scope="scope">
          <router-link
            name="btnLinkTaskDetail"
            :to="{path:'/message/messageSend/taskDetail',query:{id:scope.row.taskId}}"
            class="btn-link el-button el-button--text"
          >详情</router-link>
          <template v-if="scope.row.auditStatus == auditStatus.Pending">
            <el-button
              name="btnAuditMessage"
              type="text"
              @click="auditMessage(scope.row.taskId)"
            >审核</el-button>
            <el-button
              name="btnAbandonMessage"
              type="text"
              @click="abandonMessage(scope.row.taskId)"
            >作废</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :pg="queryForm.pageIndex"
      :size="queryForm.pageSize"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
  </div>
</template>
<script>
import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
import { TemplateTypes, SendTypes, AuditStatus } from '@/enums/message'
import {
  MESSAGE_API_MESSAGETASK_SEARCH,
  MESSAGE_API_MESSAGETASK_AUDIT
} from '@/apis/message'
export default {
  data() {
    return {
      templateTypes: TemplateTypes,
      sendTypes: SendTypes,
      auditStatus: AuditStatus,
      queryForm: {
        templateName: '',
        templateType: '',
        sendType: '',
        auditStatus: '',
        pageIndex: 1,
        pageSize: 20
      }, // 用于搜索条件双向数据绑定的数据变化
      parameter: {}, // 用于传给后台接口做数据帅选
      total: 0,
      data: []
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: '/message/messageSend/index',
        query: this.parameter
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.templateName = query.templateName || ''
      this.parameter.templateType = query.templateType || ''
      this.parameter.sendType = query.sendType || ''
      this.parameter.auditStatus = query.auditStatus || ''
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.pageSize = query.pageSize || 20
      this.getData()
    },
    getData() {
      MESSAGE_API_MESSAGETASK_SEARCH(
        Object.assign(this.queryForm, this.parameter)
      ).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows
          this.total = res.data.Data.total
        }
      })
    },
    // -简单搜索
    onSimpleSearch(e) {
      this.parameter.auditStatus = e
      this.onSearch()
    },
    currentChange(val) {
      // 切换当前页
      this.parameter.pageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameter.pageIndex = 1
      this.parameter.pageSize = val
      this.initRoute()
    },
    onSearch() {
      // 搜索相关
      this.queryForm.pageIndex = 1
      this.parameter = Object.assign({}, this.queryForm)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs['queryForm'].resetFields()
      this.onSearch()
    },
    auditMessage(id) {
      this.$confirm('确定要审核通过吗？', '审核', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          MESSAGE_API_MESSAGETASK_AUDIT({
            taskId: id,
            auditStatus: AuditStatus.Pass
          }).then(res => {
            this.$store.commit('SET_FULL_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message.success('审核通过成功')
              this.getData()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {})
    },
    abandonMessage(id) {
      this.$confirm('作废后不能恢复，确定要作废吗？', '作废', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          MESSAGE_API_MESSAGETASK_AUDIT({
            taskId: id,
            auditStatus: AuditStatus.Invalid
          }).then(res => {
            this.$store.commit('SET_FULL_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message.success('作废成功')
              this.getData()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {})
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination,
    searchPanel
  }
}
</script>
