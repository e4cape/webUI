<template>
  <section>
    <el-form
      :model="form"
      ref="search"
      label-width="120px"
      class="item-lh-26"
      :inline="true"
      @submit.native.prevent
    >
      <search-panel
        @onSearch="onSearch"
        :isSenior="false"
      >
        <template slot="btnBox">
          <el-form-item>
            <el-button
              type="primary"
              @click="visibleInfomationDialog = true"
            >新建</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-input
              name="inputOnSearch"
              v-model="form.Title"
              placeholder="标题"
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
    <section>
      <el-table
        :data="tableData"
        v-loading="$store.getters.tb_loading"
      >
        <el-table-column
          label="序号"
          fixed
          min-width="50"
          prop="SolutionId"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="标题"
          fixed
          min-width="200"
          prop="Title"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="适用套餐"
          min-width="200"
          prop="Title"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{packObj[scope.row.PackId]}}</template>
        </el-table-column>
        <el-table-column
          min-width="100"
          label="课程数量"
          prop="ItemQty"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          min-width="150"
          label="创建时间"
          prop="CreateTime"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.CreateTime | filterDateTime }}</template>
        </el-table-column>

        <el-table-column
          min-width="150"
          label="创建人"
          prop="CreateUser"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              name="btnEdit"
              type="text"
              @click="$router.push({path: `/science/plan/detail?id=${scope.row.SolutionId}`})"
            >详情</el-button>
            <el-button
              name="btnEdit"
              type="text"
              @click="$router.push({path: `/science/plan/edit?id=${scope.row.SolutionId}`})"
            >编辑</el-button>
            <el-button
              type="text"
              name="btnDel"
              @click="del($event,scope.row.SolutionId)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :pg="form.PageIndex"
        :size="form.PageSize"
        :total="total"
        @currentChange="currentChange"
        @sizeChange="sizeChange"
      />
    </section>
    <editInformationDialog
      v-if="visibleInfomationDialog"
      title="新建方案"
      :visibleInfomationDialog="visibleInfomationDialog"
      @listenVisibleInfomationDialog="listenVisibleInfomationDialog"
    />
  </section>
</template>

<script>
import {
  COLLEGE_API_SETTINGSOLUTIONBASIC_GETSBYLCB, // 管控平台 - 方案管理 - 检索
  COLLEGE_API_SETTINGSOLUTIONBASIC_DELETE, // 管控平台 - 方案管理 - 删除
  COLLEGE_API_SETTINGPACK_DROPDOWNLIST // 套餐下拉框
} from '@/apis/science'

import searchPanel from '@/components/searchPanel'
import pagination from '@/components/pagination'
import editInformationDialog from './editInformationDialog'

export default {
  data() {
    return {
      visibleInfomationDialog: false,
      packObj: null, // 套餐数组格式转化为{id：Name}形式的对象
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
  async mounted() {
    this.$store.commit('SET_TB_LOADING', true)
    const packObj = await COLLEGE_API_SETTINGPACK_DROPDOWNLIST().then(res => {
      if (res.data.Code == 'CORRECT') {
        let obj = {}
        for (let item of res.data.Data.Subset) {
          obj[item.PackId] = item.PackName
        }
        return obj
      }
    })
    if (packObj) {
      this.packObj = packObj
      this.init()
    } else {
      this.$store.commit('SET_TB_LOADING', true)
    }
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
      this.form = Object.assign(this.form, this.parameter)
      COLLEGE_API_SETTINGSOLUTIONBASIC_GETSBYLCB(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Subset
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    // 删除
    del(e, SolutionId) {
      e.currentTarget.blur()
      this.$confirm('您正在进行删除操作，删除后不可恢复！确定删除?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        COLLEGE_API_SETTINGSOLUTIONBASIC_DELETE({SolutionId}).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('已删除！')
            this.getData()
          }
          this.$store.commit('SET_FULL_LOADING', false)
        })
      })
    },
    listenVisibleInfomationDialog(succ, id) {
      if (succ) {
        this.$router.push(`/science/plan/edit?id=${id}`)
      }
      this.visibleInfomationDialog = false
    }
  },
  components: {
    searchPanel,
    pagination,
    editInformationDialog
  }
}
</script>
