<template>
  <div class="content">
    <el-form :inline="true" ref="form" class="item-lh-26" :model="form" @keyup.enter.native="onSearch">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="simpleSearch">
          <el-form-item prop="DepartmentId">
            <el-select name="DepartmentId" v-model="form.DepartmentId" @change="onSearch">
              <el-option label="全部" value></el-option>
              <el-option v-for="item in dropDownDepartments" :key="item.Id" :value="item.Id" :label="item.Value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="UserName">
            <el-input name="UserName" v-model="form.UserName" :maxlength="20" placeholder="请输入姓名">
              <el-button name="btnSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="日期：" prop="SettleDate">
            <el-date-picker name="SettleDate" v-model="form.SettleDate" type="month" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item label="部门：" prop="DepartmentId">
            <el-select name="DepartmentId" v-model="form.DepartmentId" placeholder="请选择" clearable>
              <el-option label="全部" value></el-option>
              <el-option v-for="item in dropDownDepartments" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名：" prop="UserName">
            <el-input name="UserName" v-model="form.UserName" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="ID">
        <template slot-scope="scope">{{scope.$index+1+(form.PageIndex-1)*form.PageSize}}</template>
      </el-table-column>
      <el-table-column prop="UserName" label="姓名" show-overflow-tooltip></el-table-column>
      <el-table-column prop="DepartmentId" label="部门" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Position" label="职位" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column prop="OrderCount" label="订单数"></el-table-column>
      <el-table-column prop="CashPrice" label="分配销售额" :formatter="formatter"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <router-link name="btnLink" :to="{path:'/performance/employee/achievementdetail/'+scope.row.SettleId}">详情</router-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>
<script>
import searchPanel from '@/components/searchPanel'
import pagination from '@/components/pagination'
import { EnableState } from '@/enums/common'
import {
  KPIS_API_SETTLE_ACHIEVE_GUIDE_BASIC_GETS,
} from '@/apis/performance'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      // 搜索表单
      form: {
        SettleDate: '',
        DepartmentId: '',
        UserName: '',
        PageIndex: 1,
        PageSize: 20
      },
      parameter: {
      },
      EmployeeUserStatusOpt: [],
      tableData: [],
      total: 0,
      loading: false
    }
  },
  components: {
    searchPanel,
    pagination
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: this.$route.path, query: this.parameter
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.UserName = query.UserName || ''
      this.parameter.DepartmentId = parseInt(query.DepartmentId) || ''
      this.parameter.SettleDate = query.SettleDate ? dayjs(new Date(query.SettleDate)).format('YYYY-MM-DD') : dayjs(new Date()).format('YYYY-MM') + '-01'
      this.parameter.PageSize = query.PageSize || 20
      this.parameter.PageIndex = query.PageIndex || 1
      this.getData()
    },
    getData() {
      this.form = Object.assign(this.form, this.parameter)
      this.loading = true
      KPIS_API_SETTLE_ACHIEVE_GUIDE_BASIC_GETS(this.form).then(res => {
        this.loading = false
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
      })
    },
    currentChange(val) {
      // 切换当前页
      this.parameter.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameter.PageIndex = 1
      this.parameter.PageSize = val
      this.initRoute()
    },
    onSearch() {
      // 搜索相关
      this.form.PageIndex = 1
      this.parameter = Object.assign({
      }, this.form)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      this.$refs.form.resetFields()
      this.onSearch()
    },
    formatter(row, column) {
      let current
      switch (column.property) {
        case 'DepartmentId':
          current = this.dropDownDepartments.find(
            v => v.Id === row[column.property]
          )
            ? this.dropDownDepartments.find(v => v.Id === row[column.property])
              .Value
            : ''
          break
        case 'CashPrice':
          current = `￥${this.$root.toFloat(row[column.property])}`
          break
        case 'Position':
          current = row[column.property] || '-'
          break
        default:
          break
      }
      return current !== undefined ? current : ''
    }
  },
  mounted() {
    this.$store.dispatch('GET_DEPARTMENTS_DROPLIST', { State: EnableState.Enable, CharacterId: this.$store.getters.user_session.CharacterId })
    this.init()
  },
  watch: {
    $route: 'init'
  },
  computed: {
    dropDownDepartments() {
      return this.$store.getters.departments
    }
  }
}
</script>
<style lang="scss" scoped>
.name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
