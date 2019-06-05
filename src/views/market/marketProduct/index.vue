<template>
  <div class="content">
    <el-table :data="data" class="m-b-10" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="MarproId" label="产品序号"></el-table-column>
      <el-table-column prop="MarproTitle" label="产品名称"></el-table-column>
      <el-table-column prop="CouponNote" label="卡券类型"></el-table-column>
      <el-table-column prop="Status" label="状态" :formatter="formatter"></el-table-column>
      <el-table-column prop="CreateTime" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scoped">
          <el-button
            v-if="scoped.row.Status === States.Origin || scoped.row.Status === States.Offline"
            type="text"
            @click="$router.push({path: `/market/marketproduct/edit?MarproId=${scoped.row.MarproId}&state=1`})"
            name="btnEdit"
          >修改</el-button>
          <el-button
            type="text"
            v-if="scoped.row.Status === States.Offline || scoped.row.Status === States.Audit || scoped.row.Status === States.Origin"
            @click="toOnline(scoped.row.MarproId, scoped.$index)"
            class="table-tool"
            name="btnToOnline"
          >上架</el-button>
          <el-button type="text" v-if="scoped.row.Status === States.Online" @click="toOffline(scoped.row.MarproId, scoped.$index)" class="table-tool" name="btnToOffLine">下架</el-button>
          <el-button type="text" @click="$router.push({path: `/market/marketproduct/detail?MarproId=${scoped.row.MarproId}&state=1`})" name="btnDetail">详情</el-button>
        </template>
      </el-table-column>
      <pagination :total="total" :pg="queryForm.PageIndex" :size="queryForm.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </el-table>
  </div>
</template>
<script>
import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
import { YNStatus } from '@/enums/common.js'
import { MarproStatus } from '@/enums/marketing.js'
import {
  MARKETING_API_MARKET_PRODUCT_GETS,
  MARKETING_API_MARKET_PRODUCT_ONLINE,
  MARKETING_API_MARKET_PRODUCT_OFFLINE
} from '@/apis/marketing.js'
export default {
  components: {
    pagination,
    searchPanel
  },
  data() {
    return {
      data: [],
      dialogFormVisible: false,
      States: MarproStatus,
      total: 0,
      queryForm: {
        MarproTitle: '', // 	string	产品标题
        Status: 0, //	int32	产品状态(枚举)
        OrderBy: 0, //	int32	排序字段(0=创建时间)
        IsAsced: YNStatus.No, //	int32	是否升序(枚举)
        PageIndex: 1, //	int32	当前页码
        PageSize: 20 //	int32	每页?条
      },
      loading: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      MARKETING_API_MARKET_PRODUCT_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.loading = false
      })
    },
    addDepartment() {
      this.$router.push('/provider/providerlist/providercreate')
    },
    sizeChange(value) {
      // 切换每页显示数
      this.queryForm.PageSize = value
      this.queryForm.PageIndex = 1
      this.getList()
    },
    currentChange(value) {
      // 切换当前页
      this.queryForm.PageIndex = value
      this.getList()
    },
    formatter(row) {
      let current = this.States.Types[row.Status]
      return current
    },
    // toExamine(id, i) {
    //   this.$confirm('是否确认审核?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       // this.isLoading = true
    //       this.API_MARKET_AUDIT({
    //         MarproId: id,
    //         CheckNote: ''
    //       }).then(res => {
    //         // this.isLoading = false
    //         if (res.data.Code === 'CORRECT') {
    //           this.$message({
    //             type: 'success',
    //             message: '审核通过!'
    //           })
    //           this.form[i].Status = MarproStatus.Audit

    //           this.$set(this.form[i], 'Status', this.form[i].Status)
    //         }
    //       })
    //     })
    //     .catch(() => {})
    // },
    // toRefuse(id, i) {
    //   this.$confirm('是否确认拒绝?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       // this.isLoading = true
    //       this.API_MARKET_REJECT({
    //         MarproId: id
    //       }).then(res => {
    //         // this.isLoading = false
    //         if (res.data.Code === 'CORRECT') {
    //           this.$message({
    //             type: 'success',
    //             message: '拒绝成功!'
    //           })
    //           this.form[i].Status = MarproStatus.Reject

    //           this.$set(this.form[i], 'Status', this.form[i].Status)
    //         }
    //       })
    //     })
    //     .catch(() => {})
    // },
    // toVoid(id, i) {
    //   this.$confirm('是否确认作废?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       // this.isLoading = true
    //       this.API_MARKET_ABANDON({
    //         MarproId: id
    //       }).then(res => {
    //         // this.isLoading = false
    //         if (res.data.Code === 'CORRECT') {
    //           this.$message({
    //             type: 'success',
    //             message: '作废成功!'
    //           })
    //           this.form[i].Status = MarproStatus.Abandon

    //           this.$set(this.form[i], 'Status', this.form[i].Status)
    //         }
    //       })
    //     })
    //     .catch(() => {})
    // },
    toOnline(id, i) {
      this.$confirm('是否确认上架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.isLoading = true
          MARKETING_API_MARKET_PRODUCT_ONLINE({
            MarproId: id
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '上架成功!'
              })
              this.data[i].Status = MarproStatus.Online

              this.$set(this.data[i], 'Status', this.data[i].Status)
            }
            this.isLoading = false
          })
        })
        .catch(() => {})
    },
    toOffline(id, i) {
      this.$confirm('是否确认下架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.isLoading = true
          MARKETING_API_MARKET_PRODUCT_OFFLINE({
            MarproId: id
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '下架成功!'
              })
              this.data[i].Status = MarproStatus.Offline

              this.$set(this.data[i], 'Status', this.data[i].Status)
            }
            this.isLoading = false
          })
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-input .el-input {
  width: 248px;
}
.border-b-1px {
  border-bottom: 1px solid #ddd;
}
</style>
<style lang="scss">
.el-form-item {
  margin-bottom: 10px;
}
.el-tabs__nav-scroll {
  padding-left: 20px;
}
.el-tabs__item {
  padding: 0 20px !important;
}
.el-checkbox + .el-checkbox {
  margin-left: 20px !important;
}
.mk-open {
  width: 180px;
  .el-input {
    width: 120px !important;
  }
}
</style>

