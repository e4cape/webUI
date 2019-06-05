<template>
  <div class="content">
    <!-- @module Panel -->
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看应收款单</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table" v-loading="$store.getters.is_loading" element-loading-text="拼命加载中">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="4" class="state-img">
                  <img src="@/assets/images/draft.png" v-if="detail.PaidState === settleIOBillBasicPaidState.None">
                  <img src="@/assets/images/auditing.png" v-if="detail.PaidState === settleIOBillBasicPaidState.Part">
                  <img src="@/assets/images/audited.png" v-if="detail.PaidState === settleIOBillBasicPaidState.All">
                  <div>{{settleIOBillBasicPaidState.Types[detail.PaidState] + '收款'}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.BillCode}}</td>
                <td class="tit">创建时间：</td>
                <td>{{detail.CreateTime | filterDateTime}}</td>
                <td class="tit">应收对象：</td>
                <td>{{detail.ObjectNote}}</td>
              </tr>
              <tr>
                <td class="tit">来源单号：</td>
                <td>{{detail.PreviousCode}}</td>
                <td class="tit">应收金额：</td>
                <td>{{detail.BillPrice | initPrice}}</td>
                <td class="tit">已收金额：</td>
                <td>{{detail.PaidPrice | initPrice}}</td>
              </tr>
              <tr>
                <td class="tit">业务日期：</td>
                <td>{{detail.ActualDate | filterDate}}</td>
                <td class="tit">备注：</td>
                <td colspan="3">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
          <!-- End table -->
        </div>

        <div class="checkPage-hd">
          <el-row>
            <el-col :span="12">
              <i class="icon-list"></i>
              <span class="title">收款记录</span>
            </el-col>
            <el-col :span="12" class="tr"></el-col>
          </el-row>
        </div>

        <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
          <el-table-column prop="PaidCode" label="收款单号" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="PaidPrice" label="金额" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.PaidPrice | initPrice}}</template>
          </el-table-column>
          <el-table-column prop="CreateUser" label="创建人" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="CreateTime" label="创建时间" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.CreateTime | filterDateMinutes}}</template>
          </el-table-column>
          <el-table-column prop="PaymentTypeEk" label="收款方式" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">{{paymentsObj[scope.row.PaymentTypeEk +'']}}</template>
          </el-table-column>
          <el-table-column prop="BankTypeDv" label="收款账户" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="State" label="状态" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <span :class="{'red':scope.row.State === SettleIOBillPaidState.Abandon}">{{SettleIOBillPaidState.Types[scope.row.State]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Note" label="备注" min-width="100" show-overflow-tooltip></el-table-column>
        </el-table>
        <!-- End 数据表格 -->
        <div class="m-x-10">
          <pagination :pg="pageIndex" :size="pageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
        </div>
      </div>
    </div>

    <!-- End panel -->
    <div class="buttons">
      
      <el-button @click="$router.push({path: '/fmis/receipt/receiptCreate', query: {id: detail.BillId}})" v-if="detail.PaidState !== settleIOBillBasicPaidState.All">创建付款单</el-button>
      <el-button @click="del" v-if="detail.PreviousType == settleIOBillBasicPreviousType.Manual && detail.PaidState == settleIOBillBasicPaidState.None">删除</el-button>
      <el-button name="btnReceiptCheckPrint" @click="printDialog = true">打印</el-button>
    </div>

    <!-- @module Dialog·打印 -->
    <print-order
      title="打印"
      v-if="printDialog"
      :visible.sync="printDialog"
      :conditions="encodeURIComponent(JSON.stringify({OrderId: billId}))"
      :printingType="settingPrintingTypes.StockingCloudSettleIOBillBasic1"
    ></print-order>
    <!-- End Dialog·打印 -->
  </div>
</template>

<script>
import {
  SettleIOBillBasicPaidState,
  SettleIOBillPaidState,
  SettleIOBillPaidType,
  SettleIOBillBasicObjectType,
  SettingDictionaryDictType,
  SettleIOBillBasicPreviousType
} from '@/enums/stocking.js'
import {
  SettingPrintingType
} from '@/enums/merchant.js'
import {
  STOCKING_API_SETTLE_IO_BILL_BASIC_GET,
  STOCKING_API_SETTLE_IO_BILL_PAID_GETS,
  STOCKING_API_SETTLE_IO_BILL_BASIC_ABANDON
} from '@/apis/stocking.js'
import { EnableState } from '@/enums/common'

import pagination from '@/components/pagination'
import printOrder from '@/components/erp/printOrder'
import { MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST } from '@/apis/merchant'
export default {
  data() {
    return {
      SettleIOBillPaidState,
      settleIOBillBasicPreviousType: SettleIOBillBasicPreviousType,
      settleIOBillBasicObjectType: SettleIOBillBasicObjectType,
      settleIOBillBasicPaidState: SettleIOBillBasicPaidState,
      settingPrintingTypes: SettingPrintingType,
      billId: '',
      detail: {},
      paymentsObj: {},
      data: [],
      total: 0,
      pageIndex: 1,
      pageSize: 20,
      printDialog: false
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.billId = query.id
      if (!this.billId) {
        this.dataError()
      } else {
        this.getDetail()
        this.getData()
        this.getPayments()
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
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_SETTLE_IO_BILL_BASIC_GET({
        BillId: this.billId
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
      })
    },
    del() {
      this.$confirm('确定将此单据删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        STOCKING_API_SETTLE_IO_BILL_BASIC_ABANDON({ BillId: this.billId }).then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.$message.success('已删除')
            this.$router.replace({ path: '/fmis/receipt/index' })
          }
        })
      })
    },
    getPayments() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: SettingDictionaryDictType.SettleIOBillPaidPaymentType,
        State: EnableState.Enable
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          let paymentsObj = {}
          res.data.Data.Rows.forEach(item => {
            paymentsObj[item.Id] = item.Value
          })
          this.paymentsObj = paymentsObj
        }
      })
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_SETTLE_IO_BILL_PAID_GETS({
        PaidType: SettleIOBillPaidType.Receipt,
        BillId: this.billId,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false) // table loading
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
      })
    },
    currentChange(val) {
      // 切换当前页
      this.pageIndex = val
      this.getData()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.pageIndex = 1
      this.pageSize = val
      this.getData()
    }
  },
  beforeMount() { },
  mounted() {
    this.init()
  },
  components: {
    pagination,
    printOrder
  }
}
</script>
