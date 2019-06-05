<template>
  <div>
    <div class="report-t">
      <h2>充值及赠送统计报表</h2>
      <p v-if="!form.checkTime1==''">{{form.checkTime1}} 至 {{form.checkTime2}}</p>
    </div>
    <el-table :stripe="true" :data="[summary]" :show-header="false">
      <el-table-column align="center">
        <template>
          充值次数合计：
          <span class="text-warning fw-b">{{summary.TotalOrderCount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template>
          充值总额：
          <span class="text-danger fw-b">{{$root.toFloat(summary.TotalOrderPrice)}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template>
          <p>
            赠送次数合计：
            <span class="text-warning fw-b">{{summary.SplitFreeCount}}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template>
          <p>
            赠送总额：
            <span class="text-danger fw-b">{{$root.toFloat(summary.SplitFreePrice)}}</span>
          </p>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="summary.Details" class="m-t-10">
      <el-table-column :formatter="formatter" prop="CheckTime" label="时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="OrderId" label="订单号" width="180" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" prop="BalanceType" label="账户类型" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" prop="RechargePrice" label="充值金额" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" prop="GiftPrice" label="赠送金额" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" prop="PaymentType" label="支付方式" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CheckUser" label="操作人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="BriefNote" label="备注" show-overflow-tooltip></el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  numFixed
} from '@/filters'
import {
  BalanceType, PaymentType
} from '@/enums/marketing.js'
export default {
  data() {
    return {
      numFixed
    }
  },
  props: {
    summary: {
      type: Object
    },
    form: {
      type: Object,
      default: function () {
        return {

        }
      }
    }
  },
  methods: {
    formatter() {
      let tpr
      switch (arguments[1].property) {
        case 'PaymentType':
          tpr = PaymentType.Types[arguments[2]]
          break
        case 'BalanceType':
          tpr = BalanceType.Types[arguments[2]]
          break
        case 'RechargePrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'GiftPrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'CheckTime':
          tpr = this.$options.filters.filterDate(arguments[2])
          break
        default:
          break
      }
      return tpr
    }
  }
}
</script>
