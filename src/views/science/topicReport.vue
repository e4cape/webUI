<template>
  <div>
    <el-form
      @submit.native.prevent
      :model="form"
      ref="search"
      label-width="120px"
      class="item-lh-26"
      :inline="true"
    >
      <search-panel
        @onSearch="onSearch"
        :isSenior="false"
      >
        <template slot="simpleSearch">
          <el-form-item>
            <el-input
              name="inputOnSearch"
              v-model="form.Title"
              placeholder="专题名"
              @keyup.native.enter="onSearch"
            >
              <el-button
                name="btnOnSearch"
                slot="append"
                icon="el-icon-search"
                @click="onSearch"
              ></el-button>
            </el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="$store.getters.tb_loading"
    >
      <el-table-column
        label="序号"
        prop="SubjectId"
        fixed
        width="55"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="专题名"
        prop="Title"
        fixed
        min-width="150"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="文章数量"
        prop="ItemQty"
        min-width="50"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建人"
        prop="CreateUser"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        prop="CreateTime"
        min-width="150"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="点击量"
        prop="HitsAmt"
        min-width="50"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="浏览人数"
        prop="ViewAmt"
        min-width="50"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
    <pagination
      :pg="form.PageIndex"
      :size="form.PageSize"
      :total="total"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    />
  </div>
</template>

<script>
import { COLLEGE_API_INFRASTSUBJECTBASIC_REPORTLIST } from '@/apis/science'

import searchPanel from '@/components/searchPanel'
import pagination from '@/components/pagination'

export default {
  data() {
    return {
      // 表格分页相关
      form: {
        Title: '', // 课程标题
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
      COLLEGE_API_INFRASTSUBJECTBASIC_REPORTLIST(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Subset
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    }
  },
  components: {
    searchPanel,
    pagination
  }
}
</script>
