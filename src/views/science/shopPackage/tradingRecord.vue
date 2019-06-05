<template>
  <section>
    <h3 style="margin: 10px 0; font-size: 16px;">{{ storeName }}</h3>
    <el-table :data="tableData" @sort-change="sortChange" max-height="800" v-loading="$store.getters.tb_loading">
      <el-table-column label="交易时间" min-width="160" prop="CheckTime" fixed sortable="custom">
        <template slot-scope="scope">{{scope.row.CheckTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column label="交易类型" prop="OrderStr" min-width="80">
        <template slot-scope="scope">{{packOrderBasicOrderType.Types[scope.row.OrderType]}}</template>
      </el-table-column>
      <el-table-column label="原套餐情况" prop="JunkPackName" min-width="120"></el-table-column>
      <el-table-column label="原到期时间" prop="JunkExpiree" min-width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.JunkPackId > 1">{{scope.row.JunkExpiree | filterDate}}</span>
          <span v-if="scope.row.JunkPackId == 1">-</span>
        </template>
      </el-table-column>
      <el-table-column label="原到期天数" prop="JunkDays" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.JunkPackId > 1">{{scope.row.JunkDays}}</span>
          <span v-if="scope.row.JunkPackId == 1">-</span>
        </template>
      </el-table-column>
      <el-table-column label="原等级" prop="JunkPackName" min-width="120"></el-table-column>
      <el-table-column label="交易等级" prop="PackName" min-width="120"></el-table-column>
      <el-table-column label="购买时长" prop="Years" min-width="100">
        <template slot-scope="scope">{{ scope.row.Years }} 年</template>
      </el-table-column>
      <el-table-column label="交易后到期时间" prop="Expiree" min-width="160" sortable="custom">
        <template slot-scope="scope">{{scope.row.Expiree | filterDate}}</template>
      </el-table-column>
      <el-table-column label="套餐金额" prop="PackPrice" min-width="100">
        <template slot-scope="scope">{{scope.row.PackPrice | initPrice}}</template>
      </el-table-column>
      <el-table-column label="原套餐抵扣" prop="SurplusPrice" min-width="100">
        <template slot-scope="scope">{{scope.row.SurplusPrice | initPrice}}</template>
      </el-table-column>
      <el-table-column label="应付金额" prop="PaidPrice" min-width="100">
        <template slot-scope="scope">{{scope.row.PaidPrice | initPrice}}</template>
      </el-table-column>
      <el-table-column label="实付金额" prop="CashPrice" min-width="100">
        <template slot-scope="scope">{{scope.row.CashPrice | initPrice}}</template>
      </el-table-column>
      <el-table-column label="支付方式" prop="PaymentType" min-width="100">
        <template slot-scope="scope">{{scope.row.CashPrice ? paymentType.Types[scope.row.PaymentType] : '无'}}</template>
      </el-table-column>
      <el-table-column label="支付流水号" prop="PaidNO" min-width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.PaidNO != 0">{{scope.row.PaidNO}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="支付状态" prop="PaidState" width="120">
        <template slot-scope="scope">{{packOrderBasicPaidState.Types[scope.row.PaidState]}}</template>
      </el-table-column>
    </el-table>
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </section>
</template>

<script>
import { COLLEGE_API_PACKORDERBASIC_GETSBYCHARACTER } from '@/apis/science'

import {
  PackOrderBasicPaidState,
  PackOrderBasicOrderType,
} from '@/enums/science'

import { PaymentType, YNStatus } from '@/enums/common'
import pagination from '@/components/pagination'

export default {
  components: {
    pagination
  },
  data() {
    return {
      paymentType: PaymentType,
      packOrderBasicOrderType: PackOrderBasicOrderType,
      packOrderBasicPaidState: PackOrderBasicPaidState,
      total: 0,
      tableData: [],
      queryForm: {
        PageIndex: 1,
        PageSize: 20,
        CharacterId: '',
        Orderby: 0,
        IsAsced: YNStatus.No
      }
    }
  },
  methods: {
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      Object.assign(this.queryForm, {
        CharacterId: this.$route.query.id
      })
      COLLEGE_API_PACKORDERBASIC_GETSBYCHARACTER(Object.assign(this.queryForm, {CharacterId: this.$route.query.id})).then(res => {
        this.$store.commit('SET_TB_LOADING', false) // table loading
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Subset
          this.total = res.data.Data.Count
        }
      })
    },
    onSearch() {
      this.queryForm.PageIndex = 1
      this.getData()
    },
    currentChange(val) {
      // 切换当前页
      this.queryForm.PageIndex = val
      this.getData()
    },

    sizeChange(val) {
      // 切换每页显示条数
      this.queryForm.PageIndex = 1
      this.queryForm.PageSize = val
      this.onSearch()
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'CheckTime':
          this.queryForm.Orderby = 1
          break
        case 'Expiree':
          this.queryForm.Orderby = 2
          break
        case 'CreateTime':
          this.queryForm.Orderby = 0
          break
        default:
          this.queryForm.Orderby = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    storeName() {
      if (this.tableData[0]) {
        return this.tableData[0].StoreName
      }
      return ''
    }
  },
  mounted() {
    this.getData()
  }
}
</script>

<style></style>
