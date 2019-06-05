<template>
  <div v-loading="loading">
    <div class="title">
      <i class="icon-list icon-title"></i>充值单信息
    </div>
    <el-table :data="[Detail]">
      <el-table-column show-overflow-tooltip :width="180" prop="OrderId" label="充值单号"></el-table-column>
      <el-table-column show-overflow-tooltip :formatter="formartter" prop="PaymentType" label="支付方式"></el-table-column>
      <el-table-column show-overflow-tooltip :formatter="formartter" prop="BalanceType" label="账户类型"></el-table-column>
      <el-table-column show-overflow-tooltip prop="EnglishID" label="门店编号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="StoreTitle" label="门店名称"></el-table-column>
      <el-table-column show-overflow-tooltip prop="BriefNote" label="单据备注"></el-table-column>
      <el-table-column show-overflow-tooltip prop="CreateUser" label="下单员工"></el-table-column>
      <el-table-column show-overflow-tooltip :formatter="formartter" prop="CreateTime" label="提交日期"></el-table-column>
      <el-table-column show-overflow-tooltip :formatter="formartter" prop="ResultStatus" label="结果状态"></el-table-column>
      <el-table-column show-overflow-tooltip :formatter="formartter" prop="Status" label="充值单状态"></el-table-column>
    </el-table>
    <div class="title">
      <i class="icon-list icon-title"></i>结算信息
    </div>
    <el-table :data="[Detail]">
      <el-table-column show-overflow-tooltip :formatter="formartter" prop="RechargePrice" label="充值金额"></el-table-column>
      <el-table-column show-overflow-tooltip :formatter="formartter" prop="GiftPrice" label="赠送金额"></el-table-column>
      <el-table-column show-overflow-tooltip :formatter="formartter" prop="DeptPrice" label="部门提成总额"></el-table-column>
      <el-table-column show-overflow-tooltip :formatter="formartter" prop="UserPrice" label="员工提成总额"></el-table-column>
      <el-table-column show-overflow-tooltip :formatter="formartter" prop="RechargeType" label="充值类型"></el-table-column>
      <el-table-column show-overflow-tooltip :formatter="formartter" prop="Rate" label="赠送比率(%)"></el-table-column>
      <el-table-column show-overflow-tooltip :width="160" prop="Months" label="赠送金额有效期(月)"></el-table-column>
      <el-table-column show-overflow-tooltip :formatter="formartter" prop="Expireb" label="有效日期(起始)"></el-table-column>
      <el-table-column show-overflow-tooltip :formatter="formartter" prop="Expiree" label="有效日期(截止)"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  PaymentType,
  BalanceType,
  RechargeOrderResultStatus,
  RechargeOrderStatus,
  SettingRechargeType
} from '@/enums/marketing.js'
import { MARKETING_API_ORDER_RECHARGE_BASIC_GET } from '@/apis/marketing.js'
export default {
  data() {
    return {
      Detail: '',
      loading: false
    }
  },
  methods: {
    getDetail() {
      this.loading = true
      MARKETING_API_ORDER_RECHARGE_BASIC_GET({
        OrderId: this.$route.query.OrderId
      })
        .then(res => {
          if (res.data.Code == 'CORRECT') {
            this.loading = false
            this.Detail = res.data.Data
          } else {
            this.$router.back()
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    formartter() {
      let tpr
      switch (arguments[1].property) {
        case 'RechargePrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'DeptPrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'GiftPrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'UserPrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'Rate':
          tpr = `${this.$root.toFloat(arguments[2]) * 100}%`
          break
        case 'PaymentType':
          tpr = PaymentType.Types[arguments[2]]
          break
        case 'BalanceType':
          tpr = BalanceType.Types[arguments[2]]
          break
        case 'Expireb':
        case 'Expiree':
        case 'CreateTime':
          tpr = this.$options.filters.filterDate(arguments[2])
          break
        case 'ResultStatus':
          tpr = RechargeOrderResultStatus.Types[arguments[2]]
          break
        case 'Status':
          tpr = RechargeOrderStatus.Types[arguments[2]]
          break
        case 'RechargeType':
          tpr = SettingRechargeType.Types[arguments[2]]
          break
        default:
          break
      }
      return tpr
    }
  },
  mounted() {
    this.getDetail()
  }
}
</script>
<style lang="scss" scoped>
.title {
  height: 36px;
  color: #333;
  line-height: 36px;
  font-size: 12px;
  font-weight: bold;
  .icon-title {
    margin-right: 5px;
    color: #399fe5;
  }
}
.m-t-20 {
  margin-top: 20px;
}
</style>

