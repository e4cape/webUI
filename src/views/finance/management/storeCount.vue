<template>
  <div v-loading="isLoading">
    <el-row :gutter="10" type="flex">
      <el-col :span="18" tag="div">
        <div class="panel-tag">
          <span>我的余额</span>
        </div>
        <div class="p-x-10 m-t-10" style="padding-bottom:10px;border-bottom:1px solid #e5e5e5">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="expend-cash">
                <span>
                  <i class="icon-cash"></i>
                  消费余额
                </span>
                <span>
                  <i>{{$root.toFloat(balanceDetail.ValidCash)}}</i>元
                </span>
              </div>
              <div class="locked-cash">
                <span>
                  <i class="icon-locked"></i>
                  锁定余额
                </span>
                <span>
                  <i>{{$root.toFloat(balanceDetail.LockCash)}}</i>元
                </span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="expend-cash">
                <span>
                  <i class="icon-cash"></i>
                  赠送余额
                  <el-button type="text" name="btnGiftBalance" style="margin-left:2px;color: #ebea5e" @click="freeExpirtRecord">[详情]</el-button>
                </span>
                <span>
                  <i>{{$root.toFloat(balanceDetail.ValidFree)}}</i>元
                </span>
              </div>
              <div class="locked-cash">
                <span>
                  <i class="icon-locked"></i>
                  锁定余额
                </span>
                <span>
                  <i>{{$root.toFloat(balanceDetail.LockFree)}}</i>元
                </span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="6" tag="div">
        <div class="balance-box">
          <div class="top">
            <span>余额预警</span>
            <i class="icon-set" name="btnBalanceAlarm" @click="openDialog"></i>
          </div>
          <div class="contain">
            <div class="cash">
              <p>
                <span>{{ $root.toFloat(balanceDetail.AlertCash)}}</span>元
              </p>
              <p>预警限额（消费）</p>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div style="padding-bottom:20px;border-bottom:1px solid #e5e5e5">
      <div class="panel-tag m-t-10" style="justify-content:space-between">
        <span>我要充值</span>
        <el-button name="btnStoreRechargeRecord" type="text" @click="rechargeRecord">充值记录</el-button>
      </div>
      <el-form :model="form" label-width="100px" ref="form" :rules="rules" label-position="right" class="fix-w m-t-10">
        <el-form-item label="充值类型：">
          <el-radio name="btnConsumptionType" v-model="form.BalanceType" :label="BalanceType.ValidCash">消费</el-radio>
        </el-form-item>
        <el-form-item label="充值金额：" prop="rechargePrice">
          <el-input name="btnRechargePrice" v-model="form.rechargePrice" @blur="getRechargeByGift"></el-input>
          元，只能充值整数，最低充值金额为{{balanceDetail.Minimum}}元
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="form.rechargePrice" name="btnSelectRechargeSum" @change="getRechargeByGift">
            <el-radio label="10000">10000</el-radio>
            <el-radio label="20000">20000</el-radio>
            <el-radio label="30000">30000</el-radio>
            <el-radio label="50000">50000</el-radio>
            <el-radio label="100000">100000</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="赠送有效期：">{{balanceDetail.Months}} 个月</el-form-item>
        <el-form-item label="赠送金额：">{{$root.toFloat(giftPrice)}} 元</el-form-item>
        <el-form-item label="赠送方式：">
          <el-radio name="btnGiftMethod" :label="PaymentType.WechatPay" v-model="form.PaymentType">
            <img src="/static/images/payment_way_wx.png" style="vertical-align: middle" alt>微信
          </el-radio>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="reachage" :loading="rechargeLoading">马上充值</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { BalanceType, PaymentType } from '@/enums/marketing.js'
import {
  MARKETING_API_BALANCE_STORE_GET,
  MARKETING_API_RECHARGE_RECHARGEBYGIFT,
  MARKETING_API_RECHARGE_WXNEWPAY
} from '@/apis/marketing'
import { integerValid } from '@/rules/formValidate'
export default {
  data() {
    return {
      BalanceType,
      PaymentType,
      balanceDetail: {},
      isLoading: true,
      rechargeLoading: false,
      giftPrice: 0,
      form: {
        CharacterId: 0,
        PaymentType: PaymentType.WechatPay,
        BalanceType: BalanceType.ValidCash,
        rechargePrice: ''
      },
      rules: {
        rechargePrice: [
          {
            required: true,
            message: '不能为空！',
            trriger: 'blur'
          },
          {
            validator: integerValid,
            trriger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getBalanceDetail()
  },
  methods: {
    rechargeRecord() {
      this.$router.push('/finance/management/rechargelist')
    },
    freeExpirtRecord() {
      this.$router.push('/finance/management/freeexpirelist')
    },
    getRechargeByGift() {
      this.$refs.form.validateField('rechargePrice', err => {
        if (err == '') {
          MARKETING_API_RECHARGE_RECHARGEBYGIFT(this.form.rechargePrice).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                this.giftPrice = res.data.Data
              }
            }
          )
        }
      })
    },
    getBalanceDetail() {
      this.isLoading = true
      MARKETING_API_BALANCE_STORE_GET({
        CharacterId: this.$store.getters.user_session.CharacterId
      }).then(res => {
        this.isLoading = false
        if (res.data.Code === 'CORRECT') {
          this.balanceDetail = res.data.Data
        }
      })
    },
    reachage() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.rechargeLoading = true
          MARKETING_API_RECHARGE_WXNEWPAY(this.form).then(res => {
            this.rechargeLoading = false
            if (res.data.Code === 'CORRECT') {
              this.$emit('showQrcode', 'data:image/jpg;base64,' + res.data.Data)
            }
          })
        }
      })
    },
    openDialog() {
      this.$emit('openDialog', true)
    }
  }
}
</script>
<style scoped lang="scss">
.expend-cash,
.locked-cash {
  margin-bottom: 1px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  background-color: #399fe5;
  span {
    display: flex;
    align-items: center;
    font-weight: 700;
    color: #fff;
    &:first-child {
      i {
        margin-right: 20px;
        font-size: 24px;
        color: #aedeff;
      }
    }
    &:last-child {
      i {
        margin-right: 2px;
        font-size: 24px;
      }
    }
  }
}
.locked-cash {
  background-color: #ededed;
  span {
    &:first-child {
      color: #333;
      i {
        color: #9ccaea;
      }
    }
    &:last-child {
      color: #bbb;
    }
  }
}
.balance-box {
  // height: 176px;
  height: 100%;
  border: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;

  .top {
    padding: 8px 0px;
    padding-left: 20px;
    padding-right: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      font-size: 14px;
      font-weight: 700;
      color: #777;
    }
    i {
      font-size: 16px;
      color: #5388ac;
      cursor: pointer;
    }
  }
  .contain {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    .cash {
      flex: 1;
      p {
        padding: 10px 0;
        color: #333;
        text-align: center;
        &:first-child {
          font-weight: 700;
          span {
            margin-right: 2px;
            font-size: 24px;
            color: #ffa200;
          }
        }
      }
    }
  }
}
</style>
