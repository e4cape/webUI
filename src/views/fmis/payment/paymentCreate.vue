<template>
  <div class="content">
    <!-- @module Panel -->
    <div class="panel">
      <div class="panel-hd">
        <span class="title">创建付款单</span>
      </div>
      <div class="panel-bd" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.BillCode}}</td>
                <td class="tit">创建时间：</td>
                <td>{{detail.CreateTime}}</td>
                <td class="tit">应付对象：</td>
                <td>{{settleIOBillBasicObjectType.Types[detail.ObjectType]}}</td>
              </tr>
              <tr>
                <td class="tit">来源单号：</td>
                <td>{{detail.PreviousCode}}</td>
                <td class="tit">应付金额：</td>
                <td>{{detail.BillPrice | initPrice}}</td>
                <td class="tit">已付金额：</td>
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
        <div class="p-10">
          <div class="checkPage-hd">
            <el-row>
              <el-col :span="12">
                <i class="icon-list"></i>
                <span class="title">付款情况</span>
              </el-col>
              <el-col :span="12" class="tr"></el-col>
            </el-row>
          </div>
          <el-form :model="createForm" label-width="110px" class="p10 init-form" :rules="rules" ref="createForm">
            <el-form-item label="付款金额：" prop="PaidPrice">
              <el-input name="btnPaidCreateAmount" v-model="createForm.PaidPrice" @keyup.native="createForm.PaidPrice = $root.toFixed(createForm.PaidPrice, 2, true)"></el-input>
            </el-form-item>
            <el-form-item label="付款账户：" prop="BankTypeDk">
              <el-select name="btnPaidCreateAccNum" v-model="createForm.BankTypeDk" placeholder="请选择付款账户" :filterable="true">
                <el-option v-for="(item,index) in surnames" :key="index" :label="item.Value" :value="item.Id"></el-option>
              </el-select>
              <span name="btnShowSurname" class="icon-set-item" @click="surnameDialog=true">
                <i class="icon-set"></i>
              </span>
            </el-form-item>
            <el-form-item label="付款方式：" prop="PaymentTypeEk">
              <el-select name="btnSelectPaidTheWay" v-model="createForm.PaymentTypeEk" placeholder="请选择付款方式" :filterable="true">
                <el-option v-for="(item,index) in payments" :key="index" :label="item.Value" :value="item.Id"></el-option>
              </el-select>
              <span class="icon-set-item" name="btnShowPayment" @click="paymentDialog=true">
                <i class="icon-set"></i>
              </span>
            </el-form-item>
            <el-form-item label="收款账号：" prop="AccountCode">
              <el-input name="AccountCode" v-model="createForm.AccountCode" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="收款账户名：" prop="Surname">
              <el-input name="Surname" v-model="createForm.Surname" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="收款银行：" prop="BankName">
              <el-input name="BankName" v-model="createForm.BankName" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="备注：" prop="Note">
              <el-input type="textarea" name="Note" v-model="createForm.Note" :maxlength="200"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!-- End panel -->
    <div class="buttons">
      <el-button type="primary" name="btnPaidSave" @click="createPaid" :loading="$store.getters.is_loading">保存</el-button>
      <router-link name="btnLinkPaidIndex" :to="{path:'/fmis/payment/index'}">
        <el-button name="btnCancel">取消</el-button>
      </router-link>
    </div>
    <!-- @module Dialog·新建付款账户 -->
    <dict-manage
      v-if="surnameDialog"
      :visible.sync="surnameDialog"
      :dicts="surnames"
      :dialogTitle="surnameName"
      :dictType="settingDictionaryDictTypes.SettleIOBillPaidBankType"
      @listenDictSave="listenDictSave"
    ></dict-manage>
    <!-- End Dialog·新建付款账户  -->
    <!-- @module Dialog·新建支收方式 -->
    <dict-manage
      v-if="paymentDialog"
      :visible.sync="paymentDialog"
      :dicts="payments"
      :dialogTitle="paymentName"
      :dictType="settingDictionaryDictTypes.SettleIOBillPaidPaymentType"
      @listenDictSave="listenDictSave"
    ></dict-manage>
    <!-- End Dialog·新建支收方式  -->
  </div>
</template>

<script>
import { MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST } from '@/apis/merchant'
import {
  SettleIOBillPaidType,
  SettingDictionaryDictType,
  SettleIOBillBasicObjectType
} from '@/enums/stocking'
import {
  STOCKING_API_SETTLE_IO_BILL_BASIC_GET,
  STOCKING_API_SETTLE_IO_BILL_PAID_CREATE
} from '@/apis/stocking'
import { EnableState } from '@/enums/common'

import pagination from '@/components/pagination'
import dictManage from '@/components/erp/dictManage'
export default {
  data() {
    return {
      $store: this.$store,
      settingDictionaryDictTypes: SettingDictionaryDictType,
      settleIOBillBasicObjectType: SettleIOBillBasicObjectType,
      billId: '',
      detail: {},
      createForm: {
        PaidType: SettleIOBillPaidType.Paid,
        PaidPrice: '',
        BankTypeDk: '',
        PaymentTypeEk: '',
        BankName: '',
        AccountCode: '',
        Surname: '',
        Note: ''
      },
      maxPrice: 0,
      rules: {
        PaidPrice: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (
                !value ||
                (!/(^\d||^-\d)\d+$/.test(value) && !/(^\d||^-\d)+\.\d+$/.test(value))
              ) {
                callback(new Error('请输入付款金额'))
              } else if (parseFloat(value) > this.maxPrice) {
                callback(new Error('最大值不能超过应付金额'))
              }
              callback()
            }
          }
        ]
      },
      surnameDialog: false,
      surnames: [], // 付款账户
      surnameName: '付款账户',
      paymentDialog: false,
      payments: [], // 支收方式
      paymentName: '付款方式'
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
      }
    },
    dataError() {
      this.$confirm('数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },
    getDetail() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_SETTLE_IO_BILL_BASIC_GET({
        BillId: this.billId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.maxPrice = parseFloat(((this.detail.BillPrice - this.detail.PaidPrice) / 10000).toFixed(2))
          this.createForm.PaidPrice = this.maxPrice
          this.getSurnames()
          this.getPayments()
        }
      })
    },
    createPaid() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          let param = Object.assign(
            {
              BillId: parseInt(this.billId),
              PaymentTypeEv: this.createForm.PaymentTypeEk ? this.payments.find(
                p => p.Id === this.createForm.PaymentTypeEk
              ).Value : '',
              BankTypeDv: this.createForm.BankTypeDk ? this.surnames.find(
                p => p.Id === this.createForm.BankTypeDk
              ).Value : ''
            },
            this.createForm
          )
          param.PaidPrice = this.$root.toInt(param.PaidPrice)
          param.BankTypeDk = parseFloat(param.BankTypeDk || 0)
          param.PaymentTypeEk = parseFloat(param.PaymentTypeEk || 0)
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_SETTLE_IO_BILL_PAID_CREATE(param).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message.success('创建成功')
              this.$router.back()
            }
          })
        }
      })
    },
    getSurnames() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: this.settingDictionaryDictTypes.SettleIOBillPaidBankType,
        State: EnableState.Enable
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.surnames = res.data.Data.Rows
          this.createForm.BankTypeDk = this.$root.clearSelectModel(
            this.createForm.BankTypeDk,
            'Id',
            this.surnames
          )
        }
      })
    },
    getPayments() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: this.settingDictionaryDictTypes.SettleIOBillPaidPaymentType,
        State: EnableState.Enable
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.payments = res.data.Data.Rows
          this.createForm.PaymentTypeEk = this.$root.clearSelectModel(
            this.createForm.PaymentTypeEk,
            'Id',
            this.payments
          )
        }
      })
    },
    listenDictSave() {
      this.getSurnames()
      this.getPayments()
    }
  },
  beforeMount() {},
  mounted() {
    this.init()
  },
  components: {
    pagination,
    dictManage
  }
}
</script>
<style lang="scss" scoped>
.init-form {
  border: none;
  .el-input {
    max-width: 193px;
  }
  .el-textarea {
    max-width: 500px;
  }
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
</style>
