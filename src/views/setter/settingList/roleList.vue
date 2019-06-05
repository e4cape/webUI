<template>
  <div class="content">
    <el-form
      ref="search"
      lable-width="120px"
      class="item-lh-26"
      :inline="true"
    >
      <search-panel
        @onSearch="onSearch"
        @onReset="onReset"
        :isSenior="false"
      >
        <template slot="btnBox">
          <el-form-item>
            <el-button
              name="roleCreate"
              type="primary"
              @click="$router.push('/security/rolelist/rolecreate')"
            >添加</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-input
              name="roleName"
              v-model="roleName"
            >
              <label slot="prepend">角色名称</label>
              <el-button
                name="prepend"
                slot="append"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData">
      <el-table-column
        label="角色序号"
        prop="RoleId"
      ></el-table-column>
      <el-table-column
        label="角色名称"
        prop="RoleName"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        prop="CreateTime"
      ></el-table-column>
      <el-table-column
        label="创建人"
        prop="CreateUser"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scpoe">
          <el-button
            name="roleDetail"
            type="text"
            @click="$router.push('/security/rolelist/roledetail/'+scpoe.row.RoleId)"
          >详情</el-button>
          <el-button
            name="roleEdit"
            type="text"
            @click="$router.push('/security/rolelist/roleedit/'+scpoe.row.RoleId)"
          >修改</el-button>
          <el-button
            name="roleDelete"
            type="text"
            @click="del($event,scpoe.row.RoleId)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="page.total"
      :pg="page.pageIndex"
      :size="page.pageSize"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
  </div>
</template>

<script>
import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
export default {
  components: {
    pagination,
    searchPanel
  },
  data() {
    return {
      roleName: '',
      tableData: [],
      page: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  methods: {
    onSearch() {
      // 搜索相关
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
    },
    getList(flag) {
      this.loading = true
      let params
      if (!flag) {
        params = Object.assign({}, this.$route.query, this.page)
      } else {
        this.page.PageIndex = 1
        params = Object.assign(
          {},
          {
            RoleName: this.roleName
          },
          this.page
        )
      }
      // let params = Object.assign({},{RoleName: this.roleName}, this.page)
      this.API_SECURITY_ROLELIST(params).then(res => {
        this.loading = false
        this.page.total = res.data.Data.TotalItemCount
        this.tableData = res.data.Data.Subset
        this.$router.push({
          path: '/security/rolelist',
          query: params
        })
      })
    },
    init() {
      this.getList()
    },
    search() {
      this.getList(true)
    },
    del(e, id) {
      e.currentTarget.blur()
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.API_SECURITY_ROLEREMOVE({
            roleId: id
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: res.data.Message
              })
              this.init()
            }
          })
        })
        .catch(() => {})
    },
    sizeChange(val) {
      this.page.pageSize = parseInt(val)
      this.page.pageIndex = 1
      this.getList()
    },
    currentChange(val) {
      this.page.pageIndex = parseInt(val)
      this.getList()
    }
  },
  mounted() {
    // this.init()
  }
}
</script>

<style lang="scss" scoped>
</style>

