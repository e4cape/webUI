<template>
  <div class="content">
    <el-form
      :model="queryForm"
      ref="search"
      lable-width="120px"
      class="item-lh-26"
      :inline="true"
    >
      <search-panel
        @onSearch="onSearch"
        @onReset="onReset"
      >
        <template slot="btnBox">
          <el-form-item>
            <el-button
              name="dialogCreate"
              type="primary"
              @click="dialogCreateVisible = true"
            >新建</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-dropdown @command="selectState">
              <el-button
                type="default"
                name="StateActive"
              >
                {{enableState.Types[queryForm.State] || '所有状态'}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu
                slot="dropdown"
                name="State"
              >
                <el-dropdown-item command="0">所有状态</el-dropdown-item>
                <el-dropdown-item
                  v-for="(item, index) in enableState.Types"
                  :key="index"
                  :command="index"
                >{{item}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item>
            <el-input
              name="Department"
              v-model="queryForm.Department"
              placeholder="请输入部门名称"
              @keyup.enter.native="onSearch"
            >
              <el-button
                name="search"
                slot="append"
                icon="el-icon-search"
                @click="onSearch"
              ></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item
            label="部门名称："
            prop="orderId"
          >
            <el-input
              name="Department"
              v-model="queryForm.Department"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建日期：">
            <el-date-picker
              name="datePicker"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="$root.datePickerOptions"
              :editable="false"
              v-model="queryForm.CreateTime"
              style="width:230px;"
              :unlink-panels="true"
              type="daterange"
            ></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- @module 数据表格 -->
    <el-table
      :data="tableData"
      v-loading="$store.getters.is_loading"
      @sort-change="sortChange"
    >
      <el-table-column
        prop="Department"
        label="部门名称"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建日期"
        prop="CreateTime"
        sortable="custom"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span style="margin-left: 5px">{{ scope.row.CreateTime | filterDateMinutes}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        min-width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{enableState.Types[scope.row.State]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            name="supplierEdit"
            @click="supplierEdit(scope.row.DepartmentId)"
          >修改</el-button>
          <el-button
            type="text"
            size="small"
            name="supplierOff"
            v-if="scope.row.State === enableState.Enable"
            @click="supplierOff($event,scope.row.DepartmentId)"
          >停用</el-button>
          <el-button
            type="text"
            size="small"
            name="supplierOn"
            v-if="scope.row.State === enableState.Disable"
            @click="supplierOn($event,scope.row.DepartmentId)"
          >启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <!-- Pagination -->
    <pagination
      :pg="queryForm.PageIndex"
      :size="queryForm.PageSize"
      :total="total"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>

    <!-- 新建供应商 -->
    <template v-if="dialogCreateVisible">
      <department-create
        :dialogCreateVisible="dialogCreateVisible"
        @listenCreateVisible="listenCreateVisible"
      ></department-create>
    </template>
    <!-- End 新建供应商 -->
    <!-- 修改供应商 -->
    <template v-if="dialogEditVisible">
      <department-edit
        :dialogEditVisible="dialogEditVisible"
        @listenEditVisible="listenEditVisible"
        :data="EditData"
      ></department-edit>
    </template>
    <!-- End 查看供应商 -->
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { EnableState, YNStatus } from '@/enums/common.js'
import {
  MERCHANT_API_CHARACTER_DEPART_GETS,
  MERCHANT_API_CHARACTER_DEPART_DISABLE,
  MERCHANT_API_CHARACTER_DEPART_ENABLE
} from '@/apis/merchant'
import pagination from '@/components/pagination'
import searchPanel from '@/components/searchPanel.vue'
import departmentCreate from './departmentCreate'
import departmentEdit from './departmentEdit'
export default {
  data() {
    return {
      selectData: 'Department',
      enableState: EnableState,
      queryForm: {
        State: 0,
        Department: '',
        CreateTime: '',
        PageIndex: 1,
        PageSize: 20,
        OrderBy: 0,
        IsAsced: YNStatus.No
      },
      tableData: [], // 模拟表格数据
      total: 0,
      supplierId: 1,
      dialogCreateVisible: false, // 新建供应商弹窗
      dialogEditVisible: false, // 修改供应商弹窗
      EditData: null,
      parameters: {},
      timer: null
    }
  },
  methods: {
    // 初始化数据
    init() {
      let query = this.$route.query || {}
      this.queryForm = Object.assign(
        this.queryForm,
        {
          State: '0',
          Department: '',
          CreateTime: '',
          PageIndex: 1,
          PageSize: 20,
          IsAsced: YNStatus.No
        },
        query
      )
      this.getData()
    },
    onSearch() {
      this.queryForm.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      this.initRoute()
    },
    onReset() {
      this.queryForm = {
        State: '0',
        Department: '',
        CreateTime: '',
        PageIndex: 1,
        PageSize: 20,
        IsAsced: YNStatus.No
      }
      this.onSearch()
    },
    getData() {
      this.$store.commit('SET_BTN_LOADING', true)
      this.queryForm = Object.assign(this.queryForm, this.parameters)
      let createTime = this.queryForm.CreateTime || ['', '']
      MERCHANT_API_CHARACTER_DEPART_GETS({
        PageIndex: this.queryForm.PageIndex,
        PageSize: this.queryForm.PageSize,
        Department: this.queryForm.Department,
        State: this.queryForm.State,
        CreateTime1: createTime[0]
          ? dayjs(createTime[0]).format('YYYY-MM-DD HH:mm:ss')
          : '1900-01-01 00:00:00',
        CreateTime2: createTime[0]
          ? dayjs(createTime[1]).format('YYYY-MM-DD HH:mm:ss')
          : '',
        IsAsced: this.queryForm.IsAsced
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
      })
    },
    selectState(value) {
      this.queryForm.State = value
      this.onSearch()
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.queryForm.orderBy = 0
          break
        default:
          this.queryForm.orderBy = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    supplierOff(e, key) {
      e.currentTarget.blur()
      this.$confirm('是否停用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MERCHANT_API_CHARACTER_DEPART_DISABLE({
            DepartmentId: key
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.getData()
              this.$message({
                type: 'success',
                message: '停用成功'
              })
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消停用'
          })
        })
    },
    supplierOn(e, key) {
      e.currentTarget.blur()
      this.$confirm('是否启用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MERCHANT_API_CHARACTER_DEPART_ENABLE({
            DepartmentId: key
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.getData()
              this.$message({
                type: 'success',
                message: '启用成功'
              })
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消启用'
          })
        })
    },
    supplierEdit(id) {
      this.dialogEditVisible = true
      this.EditData = id
    },
    listenCreateVisible(flag) {
      if (flag) {
        this.getData()
      }
      this.dialogCreateVisible = false
    },
    listenEditVisible(flag) {
      if (flag) {
        this.getData()
      }
      this.dialogEditVisible = false
    },
    supplierCheck(id) {
      this.dialogCheckVisible = true
      this.supplierId = id
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.initRoute()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: this.parameters
      })
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
    departmentCreate,
    departmentEdit,
    searchPanel
  }
}
</script>
<style lang="scss">
.department-dialog {
  width: 500px;
  .el-input-group__append {
    padding: 0;
  }
  .del-group {
    margin: 0;
    padding: 0 10px;
  }
  .group-item {
    margin-bottom: 10px;
  }
}
</style>
