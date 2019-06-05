<template>
  <div>
    <div class="report-t">
      <h2>消费统计报表</h2>
      <p v-if="form.checkTime1">{{form.checkTime1}} 至 {{form.checkTime2}}</p>
    </div>
    <el-table :stripe="true" :data="[summary]" :show-header="false">
      <el-table-column align="center">
        <template>
          消费单合计:
          <span class="text-warning fw-b">{{summary.TotalSettleCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template>
          消费单金额合计:
          <span class="text-danger fw-b">{{$root.toFloat(summary.TotalSettlePrice)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="summary.Details" class="m-t-10">
      <el-table-column :formatter="formatter" prop="CheckTime" label="时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="SellCode" label="订单号" width="160" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" prop="PayingType" label="消费类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ProductNO" label="条码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ProductTitle" label="商品名称" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" prop="ProductPrice" label="商品售价" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" prop="CouponPrice" label="卡券金额" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" prop="RecyclePrice" label="折扣后本金金额" width="150"></el-table-column>
      <el-table-column :formatter="formatter" prop="CashPrice" label="实付金额" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" prop="SettlePrice" label="扣费金额" show-overflow-tooltip></el-table-column>
      <el-table-column prop="BalanceName" label="扣费帐户" show-overflow-tooltip></el-table-column>
      <el-table-column prop="AccountID" label="会员帐号" width="230" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateUser" label="员工账号" show-overflow-tooltip></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ExpendOrderPayingType } from '@/enums/marketing.js'
export default {
  props: {
    summary: {
      type: Object,
      default: new Object()
    },
    form: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  methods: {
    formatter() {
      let tpr
      switch (arguments[1].property) {
        case 'PayingType':
          tpr = ExpendOrderPayingType.Types[arguments[2]]
          break
        case 'ProductPrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'CouponPrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'RecyclePrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'CashPrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'SettlePrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'CheckTime':
          tpr = this.$options.filters.filterDateMinutes(arguments[2])
          break
        default:
          break
      }
      return tpr
    }
  }
}
</script>
