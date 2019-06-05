<template>
  <div class="content">
    <el-form :inline="true" :model="queryForm" class="form-inline" label-width="80px">
      <el-form-item>
        <el-date-picker name="dateTime" v-model="dateTime" type="daterange" :picker-options="$root.datePickerOptions" unlink-panels :clearable="false" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" value-format="yyyy-MM-dd HH:mm:dd" @change="dateChange">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="fr">
        <el-button name="btnExport" type="primary" @click="exportVisible=true">导出</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="20" class="total-panel m-b-10" v-loading="$store.getters.tb_loading">
      <el-col :span="6">
        <div class="total qty">
          <div class="number">￥{{numInfo.openingBalance || '-'}}</div>
          <div class="name">期初账户余额
            <el-popover placement="bottom" trigger="hover">
              <div>所选时间之前的账户余额</div>
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="total weight">
          <div class="number">￥{{numInfo.periodIncome || '-'}}</div>
          <div class="name">本期收入
            <el-popover placement="bottom" trigger="hover">
              <div>所选时间范围内的收入</div>
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </div>

        </div>
      </el-col>
      <el-col :span="6">
        <div class="total price">
          <div class="number">￥{{Math.abs(numInfo.periodExpend).toFixed(2)}}</div>
          <div class="name">本期支出 <el-popover placement="bottom" trigger="hover">
              <div>所选时间范围内的支出</div>
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </div>

        </div>
      </el-col>
      <el-col :span="6">
        <div class="total cashier">
          <div class="number">￥{{numInfo.closingBalance || '-'}}</div>
          <div class="name">期末账户余额
            <el-popover placement="bottom" trigger="hover">
              <div>截止所选时间的账户余额</div>
              <i slot="reference" class="el-icon-question"></i>
            </el-popover>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" @sort-change="sortChange" :default-sort="{prop: 'createTime', order: 'descending'}">
      <el-table-column prop="createTime" fixed label="操作时间" sortable min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="logTypeText" label="操作类型" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="balanceTypeText" label="收入/支出" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="price" label="金额" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="balance" label="礼品帐户余额" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="prevOrder" label="相关单据" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <router-link name="btnLink" v-if="scope.row.logType != storeBalanceLogTypes.Recharge" class="el-button el-button--text el-button--mini" :to="{path: '/gift/storeOrder/storeOrderCheck',query:{orderId: scope.row.prevId}}">{{scope.row.prevOrder}}</router-link>
          <span v-else>{{scope.row.prevOrder}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createUser" label="操作人" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="remark" label="备注" min-width="250" show-overflow-tooltip></el-table-column>
    </el-table>
    <export-filed-setter title="导出" :visible.sync="exportVisible" :api="filedsApi" :apiKey="apiKey" @submit="exportData"></export-filed-setter>
    <pagination :total="total" :pg="queryForm.pageIndex" :size="queryForm.pageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>

<script>
import pagination from '@/components/pagination.vue'
import ExportFiledSetter from '@/components/exportFieldSetter'
import {
  StoreBalanceLogTypes 
} from '@/enums/gifting'
import {
  YNStatus
} from '@/enums/common'
import {
  GIFTING_API_STOREBALANCE_GETPERIODBALANCELOGS,
  GIFTING_API_STOREBALANCE_GETPERIODBALANCE,
  GIFTING_API_STOREEXPORTER_EXPORTTOFILE,
  GIFTING_API_STOREEXPORTER_GETEXPORTFIELDS
} from '@/apis/gifting'
export default {
  data() {
    return {
      storeBalanceLogTypes: StoreBalanceLogTypes,
      queryForm: {
        periodStart: '',
        periodEnd: '',
        orderField: 'createTime',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 20
      },
      dateTime: [
        new Date(Date.parse(new Date()) - 6 * 24 * 60 * 60 * 1000),
        new Date()
      ],
      data: [],
      total: 0,
      numInfo: [],
      period: {
        periodStart: '',
        periodEnd: ''
      },
      exportVisible: false,
      filedsApi: GIFTING_API_STOREEXPORTER_GETEXPORTFIELDS, // 查询数据的api名称
      apiKey: 'STOREBALANCE_GETPERIODBALANCELOGS'
    }
  },
  methods: {
    getData() {
      this.queryForm.periodStart = this.dateTime[0]
      this.queryForm.periodEnd = this.dateTime[1]
      this.$store.commit('SET_TB_LOADING', true)
      GIFTING_API_STOREBALANCE_GETPERIODBALANCELOGS(this.queryForm).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.$store.commit('SET_TB_LOADING', false)
            this.data = res.data.Data.rows
            this.total = res.data.Data.total
          }
        }
      )
    },
    getPeriodBalance() {
      this.period.periodStart = this.dateTime[0]
      this.period.periodEnd = this.dateTime[1]
      GIFTING_API_STOREBALANCE_GETPERIODBALANCE(this.period).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.numInfo = res.data.Data
        }
      })
    },
    currentChange(val) {
      // 切换当前页
      this.queryForm.pageIndex = val
      this.getData()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.queryForm.pageIndex = 1
      this.queryForm.pageSize = val
      this.getData()
    },
    dateChange() {
      this.getData()
      this.getPeriodBalance()
    },
    sortChange(sort) {
      // 表单排序
      this.queryForm.orderField = sort.prop
      this.queryForm.orderType = sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getData()
    },
    exportData(fields) {
      GIFTING_API_STOREEXPORTER_EXPORTTOFILE({
        apiKey: this.apiKey,
        exportFields: fields,
        exportType: 1,
        apiParameter: this.queryForm
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.exportVisible = false
          this.$message.success('导出成功！')
          window.open(this.$root.settings.DOMAIN_TEMP + res.data.Data)
        }
      })
    }
  },
  mounted() {
    this.getData()
    this.getPeriodBalance()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination,
    ExportFiledSetter
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/sass/report.scss';
</style>