<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-button type="primary" v-loading="exprotLoading" @click="exportData">导出</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select name="State" v-model="queryForm.State" placeholder="全部" @change="onSearch">
              <el-option label="全部" :value="'0'"></el-option>
              <el-option v-for="(item, index) in settleTicketBillBasicBillType.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="TicketName">
            <el-input name="TicketName" v-model="queryForm.TicketName" placeholder="联盟商" @keyup.enter.native="onSearch">
              <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="TicketCode" label="卡卷ID：">
            <el-input name="TicketCode" v-model="queryForm.TicketCode" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="TicketName" label="卡卷名称：">
            <el-input name="TicketName" v-model="queryForm.TicketName" @keyup.enter.native="onSearch" :maxlength="50"></el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" show-summary :summary-method="getSummaries" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column show-overflow-tooltip prop="neiborCode" label="联盟商编码" min-width="80" fixed></el-table-column>
      <el-table-column show-overflow-tooltip prop="neiborName" label="联盟商" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="sharedQty" sortable="custom" label="推广数" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="unusedQty" sortable="custom" label="未使用" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="lockedQty" sortable="custom" label="已锁定" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="transfQty" sortable="custom" label="已使用" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="returnQty" sortable="custom" label="已退货" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="expiredQty" sortable="custom" label="已过期" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="rate" sortable="custom" label="转化率" min-width="80">
    
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="sharedBillPrice" label="推广结算金额" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="transfBillPrice" label="转化结算金额" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="CompanyCode" label="结算明细" min-width="220">
        <template>
          <el-button type="text" @click="$router.push({path:'/alliance/union/detailList'})">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ALLIANCE_API_TICKETNEIBOR_QRYSBYSTORE, ALLIANCE_API_TICKETNEIBOR_EXPORT1 } from '@/apis/alliance'
import searchPanel from '@/components/searchPanel.vue'
import { YNStatus } from '@/enums/common.js'
export default {
  data() {
    return {

      yNStatus: YNStatus,
      queryForm: {
        TicketId: 1,
        IsAsced: YNStatus.No,
        Orderby: 0
      },
      tableData: [],
      total: 0,
      exprotLoading: false
    }
  },
  methods: {
    init() {
      let query = this.$store.query || {}
      this.queryForm = Object.assign(
        this.queryForm,
        {
          TicketId: 1,
          IsAsced: YNStatus.No,
          Orderby: 0
        },
        query
      )
      this.getDetail()
    },

    getDetail() {
      ALLIANCE_API_TICKETNEIBOR_QRYSBYSTORE(this.queryForm).then(res => {
        console.log(res)

        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Subset
          this.total = res.data.Data.Count
        }
      })
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] += ''
        } else {
          sums[index] = ''
        }
      })

      return sums
    },

    exportData() {
      this.exprotLoading = true
      ALLIANCE_API_TICKETNEIBOR_EXPORT1(this.queryForm)
        .then(res => {
          this.exprotLoading = false
          if (res.data.Code === 'CORRECT') {
            this.tableData = res.data.Data.Rows
            this.total = res.data.Data.Total
          }
        })
        .catch(() => {
          this.exprotLoading = false
        })
    },
    onSearch() {
      this.queryForm.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getDetail()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      this.queryForm = {
        TicketId: 1,
        IsAsced: YNStatus.No,
        Orderby: 0
      }
      this.onSearch()
    },
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    searchPanel
  }

}
</script>

<style lang="scss" scoped>
.top {
  height: 30px;
  width: 100%;
}
</style>
