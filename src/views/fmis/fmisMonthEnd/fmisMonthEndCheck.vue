<template>
  <div class="content">
    <div class="details-info-table no-margin">
      <table cellpadding="0" cellspacing="0">
        <tbody>
          <tr>
            <td class="tit">结账月份：</td>
            <td>{{detail.SettleMonth | filterMonth}}</td>
            <td class="tit">结账日期：</td>
            <td>{{detail.SettleBtime | filterDate}} 至 {{detail.SettleEtime | filterDate}}</td>
            <td class="tit">操作时间：</td>
            <td>{{detail.LastTime | filterDateMinutes}}</td>
          </tr>
          <tr>
            <td class="tit">操作人：</td>
            <td>{{detail.LastUser}}</td>
            <td class="tit">收款金额：</td>
            <td>{{detail.InputPrice | initPrice}}</td>
            <td class="tit">付款金额：</td>
            <td>{{detail.OutPrice | initPrice}}</td>
          </tr>
          <tr>
            <td class="tit">加盟商结算金额：</td>
            <td>{{detail.JoiningPrice | initPrice}}</td>
            <td class="tit">受托代销结算金额：</td>
            <td>{{detail.AgentPrice | initPrice}}</td>
            <td class="tit"></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
    <el-row class="m-t-10">
      <div class="tabs">
        <span class="tab" name="active0" :class="{'active': activeIndex == 0}" @click="activeIndex = 0">收款</span>
        <span class="tab" name="active1" :class="{'active': activeIndex == 1}" @click="activeIndex = 1">付款</span>
        <span class="tab" name="active2" :class="{'active': activeIndex == 2}" @click="activeIndex = 2">加盟商结算</span>
        <span class="tab" name="active3" :class="{'active': activeIndex == 3}" @click="activeIndex = 3">受托代销结算</span>
        <span class="tab" name="active4" :class="{'active': activeIndex == 4}" @click="activeIndex = 4">操作日志</span>
      </div>
      <div class="panel">
        <keep-alive>
          <receipt v-if="activeIndex == 0" :startTime="detail.SettleBtime" :endTime="detail.SettleEtime"></receipt>
          <payment v-if="activeIndex == 1" :startTime="detail.SettleBtime" :endTime="detail.SettleEtime"></payment>
          <franchisee v-if="activeIndex == 2" :billId="detail.BillId"></franchisee>
          <consignment v-if="activeIndex == 3" :billId="detail.BillId"></consignment>
          <el-table class="no-border-up-d" v-show="activeIndex == 4" :data="logs">
            <el-table-column prop="CheckTime" label="操作时间" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.CheckTime | filterDateTime }}</template>
            </el-table-column>
            <el-table-column prop="CheckUser" label="操作人" min-width="160" show-overflow-tooltip></el-table-column>
            <el-table-column prop="CheckState" label="操作项目" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.CheckState == yNStatus.Yes ? '结账' : '取消结账'}}
              </template>
            </el-table-column>
            <el-table-column prop="CheckNote" label="内容描述" min-width="100" show-overflow-tooltip></el-table-column>
          </el-table>
        </keep-alive>
      </div>
    </el-row>
  </div>
</template>

<script>
import Consignment from './fmisConsignment'
import Franchisee from './fmisFranchisee'
import Payment from './fmisPayment'
import Receipt from './fmisReceipt'
import { YNStatus } from '@/enums/common.js'
import { STOCKING_API_SETTLE_MONTHLY_BILL_BASIC_GET } from '@/apis/stocking.js'

export default {
  data() {
    return {
      activeIndex: 0,
      yNStatus: YNStatus,
      billId: '',
      detail: {
        SettleMonth: '',
        SettleBtime: '',
        SettleEtime: '',
        InputPrice: 0,
        OutPrice: 0,
        JoiningPrice: 0,
        AgentPrice: 0,
        LastUser: '',
        LastTime: ''
      },
      logs: []
    }
  },
  methods: {
    init() {
      this.billId = this.$route.query.id
      if (!this.billId) {
        this.dataError()
      } else {
        this.getDetail()
      }
    },
    dataError(msg) {
      this.$confirm(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },
    getDetail() {
      STOCKING_API_SETTLE_MONTHLY_BILL_BASIC_GET({
        BillId: this.billId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          var logs = JSON.parse(this.detail.Logs)
          logs.sort((a,b) => {
            return new Date(b.CheckTime) - new Date(a.CheckTime)
          })
          this.logs = logs
        }
      })
    }
  },
  beforeMount() {
    this.init()
  },
  mounted() {},
  watch: {},
  components: {
    Consignment,
    Franchisee,
    Payment,
    Receipt
  }
}
</script>
<style lang="scss" scoped>
.no-border-up-d {
  border-top: none;
  border-bottom: none;
}
</style>

