<template>
  <div>
    <el-table :data="tableData" v-loading="isLoading">
      <el-table-column label="门店编号" prop="StoreCode" show-overflow-tooltip></el-table-column>
      <el-table-column label="门店名称" prop="StoreName" show-overflow-tooltip></el-table-column>
      <el-table-column label="消费类型" prop="PackageType" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column label="起至日期" prop="Expireb" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column label="消费余额" prop="ValidCash" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column label="赠送余额" prop="ValidFree" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column label="消费余额预警" prop="AlertCash" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scoped">
          <el-button name="btnRechargeRecord" type="text" @click="$router.push('/finance/management/rechargelist/'+scoped.row.CharacterId)">充值记录</el-button>
          <el-button name="btnGiftRecord" type="text" @click="$router.push('/finance/management/freeexpirelist/'+scoped.row.CharacterId)">赠送记录</el-button>
          <el-button name="btnEarlyWarning" type="text" @click="openDialog(scoped.row.CharacterId)">余额预警设置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>
<script>
import pagination from '@/components/pagination.vue'
import { MARKETING_API_BALANCE_STORE_GETSBYCOMPANY } from '@/apis/marketing'
import { StorePackageType } from '@/enums/marketing.js'
export default {
  components: {
    pagination
  },
  data() {
    return {
      tableData: [],
      isLoading: true,
      form: {
        CharacterId: this.$store.getters.user_session.CharacterId,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      characterId: ''
    }
  },
  watch: {
    $route: 'init'
  },
  mounted() {
    this.init()
  },
  methods: {
    openDialog(id) {
      this.$emit('openDialog', true, id)
    },
    getData() {
      this.isLoading = true
      MARKETING_API_BALANCE_STORE_GETSBYCOMPANY(this.form).then(res => {
        this.isLoading = false
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
      })
    },
    init() {
      let query = this.$route.query
      this.form.PageIndex = query.PageIndex || 1
      this.form.PageSize = query.PageSize || 20
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: '/finance/management/balance',
        query: this.form
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
    formatter(row, column) {
      var value = ''
      switch (column.property) {
        case 'PackageType':
          value = StorePackageType.Types[arguments[2]]
          break
        case 'Expireb':
          value = this.$options.filters.filterDate(arguments[2])
            +
            '-' +
            this.$options.filters.filterDate(arguments[0].Expiree)
          break
        case 'ValidCash':
        case 'ValidFree':
        case 'AlertCash':
          value = Number(arguments[2]).toFixed(2)
          break
        default:
          value = row[column.property]
          break
      }
      return value
    }
  }
}
</script>