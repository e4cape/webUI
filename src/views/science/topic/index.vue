<template>
  <section>
    <el-form @submit.native.prevent :model="form" ref="search" label-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" :isSenior="false">
        <template slot="btnBox">
          <el-form-item>
            <el-button type="primary" @click="visibleInfomationDialog = true">新建</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-input name="inputOnSearch" v-model="form.Title" placeholder="专题名称" @keyup.native.enter="onSearch">
              <el-button name="btnOnSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <section>
      <el-table :data="tableData" v-loading="$store.getters.tb_loading">
        <el-table-column label="序号" fixed min-width="50" prop="SubjectId" show-overflow-tooltip></el-table-column>

        <el-table-column label="专题名" fixed min-width="200" prop="Title" show-overflow-tooltip></el-table-column>

        <el-table-column min-width="100" label="文档数量" prop="ItemQty" show-overflow-tooltip></el-table-column>

        <el-table-column min-width="150" label="创建时间" prop="CreateTime" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.CreateTime | filterDateTime }}</template>
        </el-table-column>

        <el-table-column min-width="150" label="创建人" prop="CreateUser" show-overflow-tooltip></el-table-column>

        <el-table-column prop="status" fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button name="btnEdit" type="text" @click="$router.push({path: `/science/topic/detail?id=${scope.row.SubjectId}`})">详情</el-button>
            <el-button name="btnEdit" type="text" @click="$router.push({path: `/science/topic/edit?id=${scope.row.SubjectId}`})">编辑</el-button>
            <el-button type="text" name="btnDel" @click="del($event,scope.row.SubjectId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pg="form.PageIndex" :size="form.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"/>
    </section>
    <editInformationDialog v-if="visibleInfomationDialog" title="新建专题" :visibleInfomationDialog="visibleInfomationDialog" @listenVisibleInfomationDialog="listenVisibleInfomationDialog"/>
  </section>
</template>

<script>
import {
  COLLEGE_API_INFRASTSUBJECTBASIC_GETS, // 管控中心 - 专题管理 - 列表
  COLLEGE_API_INFRASTSUBJECTBASIC_DELETE // 管控中心 - 课程专题 - 删除
} from '@/apis/science'

import searchPanel from '@/components/searchPanel'
import pagination from '@/components/pagination'
import editInformationDialog from './editInformationDialog'

export default {
  data() {
    return {
      visibleInfomationDialog: false,
      // 表格分页相关
      form: {
        Title: '',
        PageIndex: 1,
        PageSize: 20
      },
      parameter: {},
      tableData: [],
      total: 0
    }
  },
  watch: {
    $route: 'init'
  },
  mounted() {
    this.init()
  },
  methods: {
    // 表格分页相关
    init() {
      const { query } = this.$route
      this.parameter.Title = query.Title || ''
      this.parameter.PageIndex = query.PageIndex || 1
      this.parameter.PageSize = query.PageSize || 20
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        query: this.parameter
      })
    },
    currentChange(val) {
      this.parameter.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      this.parameter.PageIndex = 1
      this.parameter.PageSize = val
      this.initRoute()
    },
    onSearch() {
      this.form.PageIndex = 1
      this.parameter = Object.assign({}, this.form)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      this.form = Object.assign(this.form, this.parameter)
      COLLEGE_API_INFRASTSUBJECTBASIC_GETS(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Subset
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    // 删除
    del(e, SubjectId) {
      e.currentTarget.blur()
      this.$confirm('您正在进行删除操作，删除后不可恢复！确定删除?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        COLLEGE_API_INFRASTSUBJECTBASIC_DELETE({SubjectId: SubjectId}).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('已删除！')
            this.parameter.PageIndex = 1
            this.getData()
          }
          this.$store.commit('SET_FULL_LOADING', false)
        })
      })
    },
    listenVisibleInfomationDialog(succ) {
      if (succ) {
        this.getData()
      }
      this.visibleInfomationDialog = false
    }
  },
  components: {
    pagination,
    editInformationDialog,
    searchPanel
  }
}
</script>
