<template>
  <div class="content-view">
    <div class="p-20">
      <div class="w400">
        <h2>员工业绩</h2>
        <el-row>
          <el-col :span="6">姓名：{{achievement.UserName}}</el-col>
          <el-col :span="6">部门：{{achievement.Department}}</el-col>
          <el-col :span="6">职位：{{achievement.Position}}</el-col>
          <el-col :span="6">时间：{{achievement.SettleDate}}</el-col>
        </el-row>
      </div>
    </div>
    <h2 class="column-label"><span>业绩统计</span></h2>
    <div class="p-20">
      <el-table :data="statisticsList" show-summary :summary-method="getSummaries" v-loading="statisticsListLoading">
        <el-table-column prop="MaterialType" label="商品品类" :formatter="formatter"></el-table-column>
        <el-table-column prop="OrderCount" label="订单数"></el-table-column>
        <el-table-column prop="CashPrice" label="分配销售额" :formatter="formatter"></el-table-column>
      </el-table>
    </div>
    <h2 class="column-label"><span>业绩明细</span></h2>
    <div class="p-20">
      <el-form :inline="true" :model="form">
        <el-form-item label="订单号">
          <el-input name="PreviousCode" v-model="form.PreviousCode"></el-input>
        </el-form-item>
        <el-form-item label="商品品类">
          <el-select name="MaterialType" v-model="form.MaterialType" placeholder="请选择">
            <el-option label="全部" :value="0"></el-option>
            <el-option v-for="(item, key) in MaterialType" :key="key" :label="item" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售类型">
          <el-select name="IsMaster" v-model="form.IsMaster" placeholder="请选择">
            <el-option label="全部" :value="0"></el-option>
            <el-option v-for="(item, key) in MasterOption" :key="item" :label="key === '3' ? '主销' : '辅销'" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button name="btnSearch" type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="SaleId" label="NO." width="55">
          <template slot-scope="scope">
            {{scope.$index+1+(form.PageIndex-1)*form.PageSize}}
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" :formatter="formatter" label="时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PreviousCode" label="订单号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="MaterialType" :formatter="formatter" label="商品品类" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoodsName" label="商品名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ProductPrice" label="商品售价" :formatter="formatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="WorkPrice" label="工费" :formatter="formatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ProductPrice" :formatter="getPayable" label="应付金额" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CashPrice" label="实付金额" :formatter="formatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="IsMaster" :formatter="formatter" label="销售类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GuidePrice" label="分配销售额" :formatter="formatter" show-overflow-tooltip></el-table-column>
      </el-table>
      <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </div>
  </div>
</template>
<script>
import {
  YNStatus 
} from '@/enums/common'
import {
  MaterialType
} from '@/enums/marketing'
import dayjs from 'dayjs'
import {
  KPIS_API_SALE_ORDER_BASIC_GETS ,
  KPIS_API_SETTLE_ACHIEVE_GUIDE_BASIC_GET,
  KPIS_API_SETTLE_ACHIEVE_GUIDE_ITEM_GETS
} from '@/apis/performance'
import pagination from '@/components/pagination'

export default {
  data() {
    return {
      allDepts: [],
      form: {
        PreviousCode: '',
        SettleDate: '',
        MaterialType: 0,
        UserId: '',
        IsMaster: 0,
        PageIndex: 1,
        PageSize: 10,
      },
      total: 0,
      achievement: {
      },
      statisticsList:[],
      tableData: [],
      MasterOption: YNStatus.Types,
      loading: true,
      MaterialType: MaterialType.Types,
      statisticsListLoading: true
    }
  },
  components: {
    pagination
  },
  methods: {
    // 业绩详细
    getAchievement() {
      KPIS_API_SETTLE_ACHIEVE_GUIDE_BASIC_GET({
        SettleId: this.$route.params.id 
      })
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.achievement = res.data.Data
            this.achievement.SettleDate = dayjs(new Date(this.achievement.SettleDate)).format('YYYY-MM')
            this.form.SettleDate = this.achievement.SettleDate
            this.form.UserId = parseInt(this.achievement.UserId)
          }
        })
        .then(() => {
          this.getStatisticsList()
          this.getDetail()
        })
    },
    getStatisticsList(){
      this.statisticsListLoading = true
      KPIS_API_SETTLE_ACHIEVE_GUIDE_ITEM_GETS({
        SettleId: this.$route.params.id
      }).then(res => {
        this.statisticsListLoading = false
        if (res.data.Code === 'CORRECT') {
          this.statisticsList = res.data.Data
        }
      })
    },
    getSummaries(params) {
      const {
        columns, data 
      } = params
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
        } else {
          sums[index] = 0
          data.forEach(item => {
            sums[index] += Number.parseFloat(item[column.property])
          })
          if (index === 2) {
            sums[index] = '￥' + this.$root.toFloat(sums[index])
          }
        }
      })
      return sums
    },
    // 业绩明细表格
    getDetail() {
      this.loading = true
      let params = Object.assign({},this.form)
      params.SettleDate = dayjs(new Date(params.SettleDate)).format('YYYY-MM-DD')
      KPIS_API_SALE_ORDER_BASIC_GETS(params).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
        this.loading = false
      })
    },
    // 查询
    onSearch() {
      this.loading = true
      this.form.PageIndex = 1
      this.form.PageSize = 10
      this.getDetail()
    },
    // 翻页
    currentChange(value) {
      this.form.PageIndex = value
      this.getDetail()
    },
    sizeChange(value) {
      this.form.PageIndex = 1
      this.form.PageSize = value
      this.getDetail()
    },
    formatter(row, column) {
      let current
      switch (column.property) {
        case 'CreateTime':
          current = this.$options.filters.filterDate(row[column.property])
          break
        case 'MaterialType':
          current = MaterialType.Types[row[column.property]]
          break
        case 'IsMaster':
          current = row[column.property] === YNStatus.Yes ? '主销' : '辅销'
          break
        case 'CashPrice':
          current = `￥${this.$root.toFloat(row[column.property])}`
          break
        case 'ProductPrice':
          current = `￥${this.$root.toFloat(row[column.property])}`
          break
        case 'GuidePrice':
          current = `￥${this.$root.toFloat(row[column.property])}`
          break
        case 'WorkPrice':
          current = `￥${this.$root.toFloat(row[column.property])}`
          break
        default:
      }
      return current !== undefined ? current : ''
    },
    getPayable(row, column) {
      let current
      current = this.$root.toFloat(parseFloat(row[column.property]) + parseFloat(row['WorkPrice']))
      return '￥' + current
    },
  },
  created() {
    this.$store.dispatch('GET_CATEGORY_TYPE')
  },
  beforeMount() {
    this.getAchievement()
  }
}

</script>
<style lang="scss" scoped>
.table {
  margin-top: 15px;
  width: 100%;
  border-top: 1px #ddd solid;
  border-right: 1px #ddd solid;

  table-layout: fixed;

  th {
    background: #f5f5f5;
  }

  th,
  td {
    border-bottom: 1px #ddd solid;
    border-left: 1px #ddd solid;
    text-align: center;
    line-height: 40px;
  }
}

.w400 {
  width: 600px;
  margin: 0 auto;
  padding-top: 20px;
  font-size: 14px;
  text-align: center;

  h2 {
    font-size: 18px;
    margin-bottom: 15px;
  }
}

.column-label {
  font-size: 14px;

  border-bottom: 1px #e5e5e5 solid;
  position: relative;
  height: 48px;

  span {
    border-bottom: 5px #a79758 solid;
    position: absolute;
    bottom: -1px;
    padding: 15px 30px 10px
  }
}

</style>
