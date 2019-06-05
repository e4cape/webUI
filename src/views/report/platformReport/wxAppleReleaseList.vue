<template>
  <div class="content">
    <el-form class="item-lh-26" :inline="true" ref="search" :model="form" @keyup.enter.native="onSearch" @submit.native.prevent>
      <search-panel @onSearch="onSearch('false')" @onReset="onReset">
        <template slot="simpleSearch">
          <el-form-item>
            <el-select name="Status" v-model="form.Status" @change="onSearch('true')" placeholder="请选择">
              <el-option label="全部" :value="-1"></el-option>
              <el-option v-for="item in WxAppletStatus.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="AppletTitle">
            <el-input name="AppletTitle" v-model="form.AppletTitle" placeholder="小程序名称">
              <el-button name="btnonSearch" @click="onSearch" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="小程序名称：" prop="AppletTitle">
            <el-input name="AppletTitle" v-model="form.AppletTitle"></el-input>
          </el-form-item>
          <el-form-item label="AppID：" prop="AppId">
            <el-input name="AppId" v-model="form.AppId"></el-input>
          </el-form-item>
          <el-form-item label="门店编码：" prop="EnglishID">
            <el-input name="EnglishID" v-model="form.EnglishID"></el-input>
          </el-form-item>
          <el-form-item label="门店名称：" prop="StoreTitle">
            <el-input name="StoreTitle" v-model="form.StoreTitle"></el-input>
          </el-form-item>
          <el-form-item label="公司编码：" prop="CompanyCode">
            <el-input name="CompanyCode" v-model="form.CompanyCode"></el-input>
          </el-form-item>
          <el-form-item label="公司名称：" prop="CompanyTitle">
            <el-input name="CompanyTitle" v-model="form.CompanyTitle"></el-input>
          </el-form-item>
          <el-form-item label="版本号：" prop="CurVersion">
            <el-input name="CurVersion" v-model="form.CurVersion"></el-input>
          </el-form-item>
          <el-form-item label="审核ID：" prop="Auditid">
            <el-input name="Auditid" v-model="form.Auditid"></el-input>
          </el-form-item>
          <el-form-item label="发布状态：" prop="Status">
            <el-select name="Status" v-model="form.Status" placeholder="请选择">
              <el-option label="全部" :value="-1"></el-option>
              <el-option v-for="item in WxAppletStatus.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" v-loading="$store.getters.tb_loading">
      <el-table-column label="小程序名称" prop="AppletTitle" show-overflow-tooltip width="150" fixed></el-table-column>
      <el-table-column label="小程序AppID" prop="AppId" show-overflow-tooltip width="150" fixed></el-table-column>
      <el-table-column label="公司编码" prop="CompanyCode" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="公司名称" prop="CompanyTitle" show-overflow-tooltip></el-table-column>
      <el-table-column label="门店编码" prop="EnglishID" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="门店名称" prop="StoreTitle" show-overflow-tooltip></el-table-column>
      <el-table-column label="版本号" prop="CurVersion" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="提交时间" prop="CreateTime" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column label="审核ID" prop="Auditid" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" prop="Status" width="80" :formatter="formatData" show-overflow-tooltip></el-table-column>
      <el-table-column label="备注" prop="Reason" show-overflow-tooltip>
        <template slot-scope="scoped">
          <div v-html="scoped.row.Reason"></div>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>
<script>
import { YNStatus } from '@/enums/common'
import { WxAppletStatus } from '@/enums/component'

import { MARKETING_API_WX_APPLET_GETLOGWXAPPLETLIST } from '@/apis/marketing'

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
        AppletTitle: '',
        AppId: '',
        EnglishID: '',
        StoreTitle: '',
        CompanyCode: '',
        CompanyTitle: '',
        CurVersion: '',
        Auditid: '',
        Status: -1,
        PageIndex: 1,
        PageSize: 20,
        IsAsced: YNStatus.No
      },
      parameter: {},
      total: 0,
      tableData: [],
      cashierStatusList: [],
      createTime: [],
      WxAppletStatus: WxAppletStatus
    }
  },
  watch: {
    $route: 'init'
  },
  mounted() {
    this.init()
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: '/report/platformreport/index',
        query: this.parameter
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.AppletTitle = query.AppletTitle || ''
      this.parameter.AppId = query.AppId || ''
      this.parameter.orderId = query.orderId || ''
      this.parameter.EnglishID = query.EnglishID || ''
      this.parameter.StoreTitle = query.StoreTitle || ''
      this.parameter.CompanyCode = query.CompanyCode || ''
      this.parameter.CompanyTitle = query.CompanyTitle || ''
      this.parameter.CurVersion = query.CurVersion || ''
      this.parameter.Auditid = query.Auditid || ''
      this.parameter.Status = query.Status > -1 ? query.Status : -1

      this.parameter.PageSize = query.PageSize || 20
      this.parameter.PageIndex = query.PageIndex || 1
      this.getData()
    },
    onSearch(flag) {
      // 搜索相关
      if (flag == 'true') {
        this.form.isSenior = true
      } else {
        this.form.isSenior = false
      }
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
      this.onSearch('true')
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      this.form = Object.assign(this.form, this.parameter)
      MARKETING_API_WX_APPLET_GETLOGWXAPPLETLIST(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    formatData(row, column) {
      switch (column.property) {
        case 'Status':
          return WxAppletStatus.Types[row[column.property]]
        default:
      }
    },
    sizeChange(value) {
      // 切换每页显示数
      this.parameter.PageIndex = 1
      this.parameter.PageSize = value
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

