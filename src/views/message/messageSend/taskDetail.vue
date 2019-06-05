<template>
  <el-row>
    <p class="panel-tag"><span>任务信息</span></p>
    <el-form
      label-position="right"
      label-width="100px"
    >
      <el-form-item label="审核状态：">
        <span>{{detail.auditStatusText}}</span>
      </el-form-item>
      <el-form-item label="发送对象：">
        <span>{{detail.sendGroupTypeText}}</span>
      </el-form-item>
      <el-form-item label="模板类型：">
        <span>{{detail.templateTypeText}}</span>
      </el-form-item>
      <el-form-item label="模板签名：">
        <span>{{detail.signature}}</span>
      </el-form-item>
      <el-form-item label="模板名称：">
        <span>{{detail.templateName}}</span>
      </el-form-item>
      <el-form-item label="短信内容：">
        <span>{{detail.templateContent}}</span>
      </el-form-item>
      <el-form-item label="发送类型：">
        <span>{{detail.sendTypeText}} {{detail.sendTime}}</span>
      </el-form-item>
      <el-form-item label="创建时间：">
        <span>{{detail.createTime}}</span>
      </el-form-item>
      <el-form-item label="创建人：">
        <span>{{detail.createUser}}</span>
      </el-form-item>
    </el-form>
    <p class="panel-tag"><span>发送对象</span></p>
    <el-table
      :data="targetsData"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column
        prop="mobile"
        label="手机"
        width="150"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="sexTypeText"
        label="性别"
        width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="birthday"
        label="生日"
        width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{scope.row.birthday | filterDate}}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
    <pagination
      :total="total"
      :pg="queryTargetForm.pageIndex"
      :size="queryTargetForm.pageSize"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
  </el-row>
</template>

<script>
import pagination from '@/components/pagination.vue'
import {
  MESSAGE_API_MESSAGETASK_GETTASKDETAIL,
  MESSAGE_API_MESSAGETASK_GETTARGETLIST
} from '@/apis/message'
export default {
  data() {
    return {
      detail: {},
      queryTargetForm: {
        taskId: '',
        pageIndex: 1,
        pageSize: 20
      },
      targetsData: [],
      total: 0
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: JSON.parse(JSON.stringify(this.queryTargetForm))
      })
    },
    init() {
      const { query } = this.$route
      this.queryTargetForm.pageSize = query.pageSize || 10
      this.queryTargetForm.pageIndex = query.pageIndex || 1
      this.getData()
    },
    getDetail() {
      MESSAGE_API_MESSAGETASK_GETTASKDETAIL({
        taskId: this.$route.query.id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
      })
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      MESSAGE_API_MESSAGETASK_GETTARGETLIST(this.queryTargetForm).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.targetsData = res.data.Data.rows
          this.total = res.data.Data.total
        }
      })
    },
    currentChange(val) {
      // 切换当前页
      this.queryTargetForm.pageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.queryTargetForm.pageIndex = 1
      this.queryTargetForm.pageSize = val
      this.initRoute()
    }
  },
  created() {
    if (!this.$route.query.id) {
      this.$message.warning('数据错误！')
      this.$router.back()
    }
    this.queryTargetForm.taskId = this.$route.query.id
  },
  mounted() {
    this.getDetail()
    this.getData()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination
  }
}
</script>
