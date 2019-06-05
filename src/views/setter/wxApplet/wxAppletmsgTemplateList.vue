<template>
  <div class="content-view">
    <el-form
      class="item-lh-26"
      :inline="true"
      ref="search"
      :model="form"
    >
      <search-panel
        @onSearch="onSearch"
        @onReset="onReset"
      >
        <template slot="simpleSearch">
          <el-form-item prop="CompanyCode">
            <el-input
              name="CompanyCode"
              v-model="form.CompanyCode"
              placeholder="公司编码"
              @keyup.native.enter="onSearch"
            >
              <el-button
                name="companyCodeSearch"
                @click="onSearch"
                slot="append"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item
            label="公司编码："
            prop="CompanyCode"
          >
            <el-input
              name="CompanyCode"
              v-model="form.CompanyCode"
              @keyup.native.enter="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="公司名称："
            prop="CompanyTitle"
          >
            <el-input
              name="CompanyTitle"
              v-model="form.CompanyTitle"
              @keyup.native.enter="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="门店编码："
            prop="EnglishID"
          >
            <el-input
              name="EnglishID"
              v-model="form.EnglishID"
              @keyup.native.enter="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="门店名称："
            prop="StoreTitle"
          >
            <el-input
              name="StoreTitle"
              v-model="form.StoreTitle"
              @keyup.native.enter="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="小程序名称："
            prop="AppletTitle"
          >
            <el-input
              name="AppletTitle"
              v-model="form.AppletTitle"
              @keyup.native.enter="onSearch"
            ></el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="$store.getters.tb_loading"
    >
      <el-table-column
        show-overflow-tooltip
        label="公司编码"
        prop="CompanyCode"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="公司名称"
        prop="CompanyTitle"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="门店编码"
        prop="EnglishID"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="门店名称"
        prop="StoreTitle"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="小程序名称"
        prop="AppletTitle"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        label="模板类型"
        prop="TemplateName"
      ></el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            name="AuthorizerId"
            type="text"
            @click="$router.push({path: `/setter/wxapplet/wxappletmsgtemplatesetting?authorizerId=${scope.row.AuthorizerId}`})"
          >配置模板消息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :pg="form.PageIndex"
      :size="form.PageSize"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
  </div>
</template>
<script>
import {
  MARKETING_API_WX_APPLET_GETWXAPPLETTEMPLATELIST // 小程序 - 商家小程序消息模版列表
} from '@/apis/marketing.js'

import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'

export default {
  components: {
    pagination,
    searchPanel
  },
  data() {
    return {
      form: {
        CompanyCode: '',
        CompanyTitle: '',
        EnglishID: '',
        StoreTitle: '',
        AppletTitle: '',
        PageIndex: 1,
        PageSize: 10
      },
      parameter: {},
      total: 0,
      tableData: []
    }
  },
  watch: {
    $route: 'init'
  },
  mounted() {
    this.init()
  },
  methods: {
    onSearch() {
      // 搜索相关
      this.form.PageIndex = 1
      this.parameter = Object.assign({}, this.form)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    init() {
      let query = this.$route.query
      this.parameter.CompanyCode = query.CompanyCode || ''
      this.parameter.CompanyTitle = query.CompanyTitle || ''
      this.parameter.EnglishID = query.EnglishID || ''
      this.parameter.StoreTitle = query.StoreTitle || ''
      this.parameter.AppletTitle = query.AppletTitle || ''

      this.parameter.PageIndex = query.PageIndex || 1
      this.parameter.PageSize = query.PageSize || 20
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: '/setter/wxapplet/wxappletmsgtemplatelist',
        query: this.parameter
      })
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      this.form = Object.assign(this.form, this.parameter)
      MARKETING_API_WX_APPLET_GETWXAPPLETTEMPLATELIST(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Rows
          // 模板类型用 ‘、’号隔开展示
          this.tableData.forEach(m => {
            if (m.TemplateName) {
              m.TemplateName = m.TemplateName.split(',').join('、')
            }
          })
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    sizeChange(value) {
      // 切换每页显示数
      this.parameter.PageSize = value
      this.parameter.PageIndex = 1
      this.initRoute()
    },
    currentChange(value) {
      // 切换当前页
      this.parameter.PageIndex = value
      this.initRoute()
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-input .el-input {
  width: 248px;
}
</style>

