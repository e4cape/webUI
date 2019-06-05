<template>
  <div>
    <el-form :model="queryForm" label-width="100px" ref="queryForm" :inline="true" class="item-lh-26 p10">
      <el-row class="search-box no-border" type="flex">
        <el-col>
          <el-form-item label="模板ID：" prop="templateId">
            <el-input name="btnTemplateId" :maxlength="20" v-model="queryForm.templateId" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="模板名称：" prop="templateName">
            <el-input name="btnTemplateName" v-model="queryForm.templateName" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="模板类型：" prop="templateType">
            <el-select name="btnTemplateType" v-model="queryForm.templateType">
              <el-option label="全部" value></el-option>
              <el-option v-for="item in templateTypes.Types" :key="item.key" :value="item.key" :label="item.title"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="search-btn">
          <el-button name="btnOnSearch" type="primary" @click="onSearch">搜索</el-button>
          <el-button name="btnOnReset" type="default" @click="onReset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="m-10">
      <el-button name="btnAddTemplate" type="primary" @click="$router.push({path:'/message/messageTemplate/templateCreate'})">新增模板</el-button>
    </el-row>
    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="ispId" label="模板ID" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="templateTypeText" label="模板类型" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="templateName" label="模板名称" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="templateContent" label="模板内容" show-overflow-tooltip></el-table-column>
      <el-table-column prop="signature" label="短信签名" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="90" fixed="right">
        <template slot-scope="scope">
          <el-button name="btnDeleteTemlate" type="text" v-if="scope.row.isStatic == 0" @click="deleteTemplate(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="queryForm.pageIndex" :size="queryForm.pageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>
<script>
import pagination from '@/components/pagination.vue'
import { TemplateTypes } from '@/enums/message'
import {
  MESSAGE_API_SETTINGTEMPLATE_SEARCHPLATFORMTEMPLATES,
  MESSAGE_API_SETTINGTEMPLATE_DELETE
} from '@/apis/message'
export default {
  data() {
    return {
      templateTypes: TemplateTypes,
      queryForm: {
        templateId: '',
        templateName: '',
        templateType: '',
        pageIndex: 1,
        pageSize: 10
      }, // 用于搜索条件双向数据绑定的数据变化
      parameter: {}, // 用于传给后台接口做数据帅选
      total: 0,
      data: []
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: '/message/messageTemplate/index',
        query: this.parameter
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.templateId = query.templateId || ''
      this.parameter.templateName = query.templateName || ''
      this.parameter.templateType = query.templateType || ''
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.pageSize = query.pageSize || 10
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      MESSAGE_API_SETTINGTEMPLATE_SEARCHPLATFORMTEMPLATES(
        Object.assign(this.queryForm, this.parameter)
      ).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows
          this.total = res.data.Data.total
        }
      })
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
    /**
     *
     * @param item object
     * @param item.templateId String - 请求的参数
     *
     */
    deleteTemplate(item) {
      this.$confirm('确定删除这条模板？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MESSAGE_API_SETTINGTEMPLATE_DELETE({
            id: item.templateId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('删除成功！')
              this.getData()
            }
          })
        })
        .catch(() => { })
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination
  }
}
</script>
