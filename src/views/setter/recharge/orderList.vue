<template>
  <div class="content">
    <el-form
      @keyup.enter.native="onSearch"
      :model="form"
      ref="search"
      lable-width="120px"
      class="item-lh-26"
      :inline="true"
    >
      <search-panel
        @onSearch="onSearch"
        @onReset="onReset"
      >
        <template slot="simpleSearch">
          <el-form-item>
            <el-select
              name="Status"
              @change="onSearch"
              v-model="form.Status"
            >
              <el-option
                label="所有状态"
                :value="0"
              ></el-option>
              <el-option
                v-for="item in statusLists"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              name="OrderId"
              v-model="form.OrderId"
              placeholder="充值单号"
            >
              <el-button
                @click="onSearch"
                slot="append"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template
          slot="seniorSearch"
          prop="CreateTime"
        >
          <el-form-item label="创建日期：">
            <el-date-picker
              name="datePicker"
              v-model="CreateTime"
              @change="dateChange"
              type="daterange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :unlink-panels="true"
              :picker-options="$root.datePickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            v-show="false"
            prop="CreateTime1"
          >
            <el-input
              name="CreateTime1"
              v-model="form.CreateTime1"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-show="false"
            prop="CreateTime2"
          >
            <el-input
              name="CreateTime2"
              v-model="form.CreateTime2"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="充值单号："
            prop="OrderId"
          >
            <el-input
              name="OrderId"
              v-model="form.OrderId"
              placeholder="充值单号"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="门店编号："
            prop="EnglishID"
          >
            <el-input
              name="EnglishID"
              v-model="form.EnglishID"
              placeholder="门店编号"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="门店名称："
            prop="StoreTitle"
          >
            <el-input
              name="StoreTitle"
              v-model="form.StoreTitle"
              placeholder="门店名称"
            ></el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="isLoading"
    >
      <el-table-column
        show-overflow-tooltip
        width="200"
        prop="OrderId"
        label="充值单号"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        :formatter="formatter"
        prop="BalanceType"
        label="账户类型"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        :formatter="formatter"
        prop="PaymentType"
        label="支付方式"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="EnglishID"
        label="门店编号"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="StoreTitle"
        label="门店名称"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        :formatter="formatter"
        prop="RechargePrice"
        label="充值金额"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        :formatter="formatter"
        prop="GiftPrice"
        label="赠送金额"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="BriefNote"
        label="充值备注"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="CreateUser"
        label="创建人"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        :formatter="formatter"
        prop="CreateTime"
        label="创建时间"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        :formatter="formatter"
        prop="ResultStatus"
        label="充值结果"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        :formatter="formatter"
        prop="Status"
        label="状态"
      ></el-table-column>
      <el-table-column
        label="操作"
        :width="120"
      >
        <template slot-scope="scoped">
          <el-button
            name="orderDetail"
            @click="$router.push({path: `/setter/recharge/orderdetail?OrderId=${scoped.row.OrderId}`})"
            type="text"
          >查看</el-button>
          <el-button
            type="text"
            name="Audit"
            v-if="scoped.row.Status==RechargeOrderStatus.Origin&&scoped.row.PaymentType==PaymentType.SysPay"
            @click="Audit($event,scoped.row.OrderId,scoped.$index)"
          >审核</el-button>
          <el-button
            type="text"
            name="Abandon"
            v-if="scoped.row.Status==RechargeOrderStatus.Origin"
            @click="Abandon($event,scoped.row.OrderId,scoped.$index)"
          >作废</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :pg="form.PageIndex"
      :size="form.PageSize"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
import {
  BalanceType,
  PaymentType,
  RechargeOrderResultStatus,
  RechargeOrderStatus
} from '@/enums/marketing.js'
import {
  MARKETING_API_ORDER_RECHARGE_BASIC_GETS,
  MARKETING_API_ORDER_RECHARGE_BASIC_AUDIT,
  MARKETING_API_ORDER_RECHARGE_BASIC_ABANDON
} from '@/apis/marketing.js'
export default {
  components: {
    pagination,
    searchPanel
  },
  data() {
    return {
      form: {
        CreateTime1: '',
        CreateTime2: '',
        Status: 0,
        PageIndex: 1,
        PageSize: 20
      },
      CreateTime: [],
      parameter: {},
      total: 0,
      tableData: [],
      statusLists: [],
      RechargeOrderStatus,
      RechargeOrderResultStatus,
      PaymentType,
      isLoading: false
    }
  },
  watch: {
    $route: 'init'
  },
  mounted() {
    this.init()
    this.getEnums()
  },
  methods: {
    getEnums() {
      for (let m in RechargeOrderStatus.Types) {
        if (m != RechargeOrderStatus.Reject) {
          this.statusLists.push({
            value: parseInt(m),
            label: RechargeOrderStatus.Types[m]
          })
        }
      }
    },
    initRoute() {
      this.$router.replace({
        path: '/setter/recharge/index',
        query: this.parameter
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.Status = parseInt(query.Status) || 0
      this.parameter.CreateTime1 = query.CreateTime1 || ''
      this.parameter.CreateTime2 = query.CreateTime2 || ''
      this.createTime = query.CreateTime2
        ? [query.CreateTime1, query.CreateTime2]
        : []
      this.parameter.PageSize = query.PageSize || 20
      this.parameter.PageIndex = query.PageIndex || 1
      this.getData()
    },
    onSearch() {
      // 搜索相关
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
      this.CreateTime = ''
      this.onSearch()
    },
    getData() {
      this.isLoading = true
      this.form = Object.assign({}, this.form, this.parameter)
      MARKETING_API_ORDER_RECHARGE_BASIC_GETS(this.form)
        .then(res => {
          if (res.data.Code == 'CORRECT') {
            this.tableData = res.data.Data.Rows || []
            this.total = res.data.Data.Count || 0
            this.isLoading = false
          }
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    formatter() {
      let tpr
      switch (arguments[1].property) {
        case 'BalanceType':
          tpr = BalanceType.Types[arguments[2]]
          break
        case 'PaymentType':
          tpr = PaymentType.Types[arguments[2]]
          break
        case 'RechargePrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'GiftPrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'ResultStatus':
          tpr = RechargeOrderResultStatus.Types[arguments[2]]
          break
        case 'Status':
          tpr = RechargeOrderStatus.Types[arguments[2]]
          break
        case 'CreateTime':
          tpr = dayjs(new Date([arguments[2]])).format('YYYY-MM-DD')
          break
        default:
          break
      }
      return tpr
    },
    dateChange(value) {
      if (value) {
        this.form.CreateTime1 = dayjs(new Date(value[0])).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        this.form.CreateTime2 = dayjs(new Date(value[1])).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      } else {
        this.form.CreateTime1 = ''
        this.form.CreateTime2 = ''
      }
    },
    Audit(e, id) {
      e.currentTarget.blur()
      this.$confirm('是否确认审核?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isLoading = true
        MARKETING_API_ORDER_RECHARGE_BASIC_AUDIT({
          OrderId: id
        }).then(res => {
          this.isLoading = false
          if (res.data.Code === 'CORRECT') {
            this.$message({
              type: 'success',
              message: '审核成功!'
            })
            this.getData()
          }
        })
      })
    },
    Abandon(e, id) {
      e.currentTarget.blur()
      this.$confirm('是否确认作废?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isLoading = true
        MARKETING_API_ORDER_RECHARGE_BASIC_ABANDON({
          OrderId: id
        }).then(res => {
          this.isLoading = false
          if (res.data.Code === 'CORRECT') {
            this.$message({
              type: 'success',
              message: '作废成功!'
            })
            this.getData()
          }
        })
      })
    },
    sizeChange(value) {
      // 切换每页显示数
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
<style lang="scss">
.table-box {
  .el-table--border {
    border-top: none;
  }
}
</style>
