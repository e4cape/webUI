<template>
  <div class="content">
    <!-- @module Panel -->
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看收款单</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="4" class="state-img">
                  <img src="@/assets/images/auditing.png" v-if="detail.State === settleIOBillPaidState.Wait">
                  <img src="@/assets/images/audited.png" v-if="detail.State === settleIOBillPaidState.Audit">
                  <img src="@/assets/images/draft.png" v-if="detail.State === settleIOBillPaidState.Abandon">
                  <img src="@/assets/images/state_cancel.png" v-if="detail.State === settleIOBillPaidState.Cancel">
                  <div>{{settleIOBillPaidState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.PaidCode}}</td>
                <td class="tit">创建：</td>
                <td>{{detail.CreateUser}} {{detail.CreateTime | filterDateTime}}</td>
                <td class="tit">确认：</td>
                <td>
                  <span v-if="detail.State === settleIOBillPaidState.Audit || detail.State === settleIOBillPaidState.Abandon">{{detail.CheckUser}} {{detail.CheckTime | filterDateTime}}</span>
                  <span v-else>-</span>
                </td>
              </tr>
              <tr>
                <td class="tit">收款对象：</td>
                <td>{{detail.ObjectNote}}</td>
                <td class="tit">来源单号：</td>
                <td>{{detail.BillCode}}</td>
                <td class="tit">备注：</td>
                <td colspan="5">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
          <!-- End table -->
        </div>
        <div class="p10">
          <div class="panel-hd init-hd">
            <span class="title">▼收款情况</span>
          </div>
          <el-form label-width="110px" class="p-10 init-form">
            <el-row>
              <el-col :span="12">
                <el-form-item label="收款金额：" prop="PaidPrice">
                  <span>{{detail.PaidPrice | initPrice}}</span>
                </el-form-item>
                <el-form-item label="收款账户：">
                  <span>{{detail.BankTypeDv}}</span>
                </el-form-item>
                <el-form-item label="收款方式：">
                  <span>{{detail.PaymentTypeEv}}</span>
                </el-form-item>
                <el-form-item label="备注：">
                  <span>{{detail.Note}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
    <!-- End panel -->
    <div class="buttons">
      <el-button type="primary" name="btnShowPrint" v-if="detail.State == settleIOBillPaidState.Wait" @click="auditPaid">确定</el-button>
      <el-button name="btnShowPrint" v-if="detail.State == settleIOBillPaidState.Wait" @click="abandonPaid">作废</el-button>
      <el-button name="btnPaidCancel" v-if="detail.State == settleIOBillPaidState.Audit" @click="paidCancel">取消</el-button>
      <el-button name="btnShowPrint" @click="printDialog = true">打印</el-button>
    </div>

    <!-- @module Dialog·打印 -->
    <print-order
      title="打印"
      v-if="printDialog"
      :visible.sync="printDialog"
      :conditions="encodeURIComponent(JSON.stringify({OrderId: paidId}))"
      :printingType="settingPrintingTypes.StockingCloudSettleIOBillPaid1"
    ></print-order>
    <!-- End Dialog·打印 -->
  </div>
</template>

<script>
import { SettleIOBillPaidState } from '@/enums/stocking.js'
import { STOCKING_API_SETTLE_IO_BILL_PAID_REQ, STOCKING_API_SETTLE_IO_BILL_PAID_ABANDONS, STOCKING_API_SETTLE_IO_BILL_PAID_CANCEL, STOCKING_API_SETTLE_IO_BILL_PAID_AUDITS } from '@/apis/stocking.js'
import { SettingPrintingType } from '@/enums/merchant'
import pagination from '@/components/pagination'
import printOrder from '@/components/erp/printOrder'
export default {
  data() {
    return {
      settleIOBillPaidState: SettleIOBillPaidState,
      settingPrintingTypes: SettingPrintingType,
      paidId: '',
      detail: {},
      printDialog: false
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.paidId = query.id
      if (!this.paidId) {
        this.dataError()
      } else {
        this.getDetail()
      }
    },
    abandonPaid() {
      this.$confirm('确定作废所选收款单', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let query = this.$route.query
          let paidIds = [query.id]
          STOCKING_API_SETTLE_IO_BILL_PAID_ABANDONS({
            Items: paidIds
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('提交成功')
              this.$router.replace({ path: '/fmis/receiptorder/index' })
            }
          })
        })
        .catch(() => {
          this.selections = []
        })
    },
    auditPaid() {
      this.$confirm('确定确认所选收款单', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let query = this.$route.query
          let paidIds = [query.id]
          STOCKING_API_SETTLE_IO_BILL_PAID_AUDITS({
            Items: paidIds
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('提交成功')
              this.$router.replace({ path: '/fmis/receiptorder/index' })
            }
          })
        })
        .catch(() => {
          this.selections = []
        })
    },
    paidCancel() {
      this.$confirm('确定取消所选收款单', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          STOCKING_API_SETTLE_IO_BILL_PAID_CANCEL({
            PaidId: this.$route.query.id
          }).then(res => {
            this.$store.commit('SET_FULL_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message.success('取消成功')
              this.$router.replace({ path: '/fmis/receiptorder/index' })
            }
          })
        })
        .catch(() => { })
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
      STOCKING_API_SETTLE_IO_BILL_PAID_REQ({
        PaidId: this.paidId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
      })
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
<style lang="scss" scoped>
.init-hd {
  border: solid 1px #ddd;
}
.init-form {
  border: none;
  .el-form-item__content {
    display: inline-block;
  }
  .el-select {
    display: inline-block;
  }
  i::before {
    color: #007ed5;
    font-size: 16px;
  }
}
.el-form-item {
  margin-bottom: 0;
  line-height: 24px;
  word-break: break-word;
}
</style>
