<template>
  <el-dialog :title="title" width="550px" :visible.sync="visible" center>
    <div class="strong">您正在进行科技院升级操作</div>
    <el-form :model="form" ref="form" label-width="100px" label-position="right" v-loading="isPulling">
      <el-form-item label="门店编码:" prop="StoreCode">{{ order.StoreCode }}</el-form-item>
      <el-form-item label="门店名称:" prop="StoreName">{{ order.StoreName }}</el-form-item>
      <el-form-item v-if="isRenewal" label="当前套餐:">
        <el-tag type="success">{{detail.PackName}}</el-tag>
      </el-form-item>
      <template v-if="!isRenewal">
        <el-form-item label="升级套餐:">
          <el-radio-group v-model="selected">
            <template v-for="(item, index) in packs">
              <el-radio-button :label="item" :key="index">{{item.PackName}}</el-radio-button>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="套餐说明:">{{ selected.Note }}</el-form-item>
      </template>
      <el-form-item label="续费时长:" style="margin-bottom: 0px">
        <el-radio-group v-model="form.year">
          <el-radio-button v-for="option in prices" :label="option" :key="option.Year">{{ option.Year }}年</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label>
        <div class="hint">时间越长越优惠越多</div>
      </el-form-item>
      <el-form-item label="套餐金额:">
        <div class="price" style="min-height: 20px;">
          <div>
            <span :class="
                `origin-price ${form.year.CouponPrice > 0 ? 'strike' : ''}`
              ">￥{{ parseFloat(form.year.Price).toFixed(2) }}</span>
            <span v-if="form.year.CouponPrice > 0" style="font-weight: bold;">￥{{ (parseFloat(form.year.Price) - parseFloat(form.year.CouponPrice)).toFixed(2) }}</span>
          </div>
          <span class="couponInfo green" v-if="form.year.CouponPrice > 0">{{ form.year.Rank }}折, 节省￥{{ form.year.CouponPrice }}</span>
        </div>
      </el-form-item>
      <el-form-item v-if="!isRenewal && surplusPrice > 0" label="原套餐抵扣:">
        <div>
          <span class="price">￥{{surplusPrice}}</span>
          <span>(根据当前在用套餐按天折算的金额)</span>
        </div>
      </el-form-item>

      <el-form-item label="应付金额:">
        <div class="green price">
          ￥
          <span>{{ shouldPay }}</span>
        </div>
      </el-form-item>
      <el-form-item label="实付金额:" prop="CashPrice">
        <el-input :maxLength="50" style="width: 220px;" v-model="form.CashPrice" @keyup.native="form.CashPrice = $root.toFixed(form.CashPrice, 2, true)"></el-input>
      </el-form-item>

      <el-form-item label="支付方式:" v-if="form.CashPrice != 0">
        <el-radio-group v-model="form.PaymentType">
          <el-radio-button v-for="option in paymentMethods" :label="option.value" :key="option.value">{{ option.text }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="支付流水号:" v-if="form.CashPrice != 0">
        <el-input :maxLength="50" style="width: 300px;" v-model="form.PaidNO" @keyup.native="form.PaidNO = $root.toFixed(form.PaidNO)" @blur="form.PaidNO = $root.toFixed(form.PaidNO)"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button type="primary" :loading="btnLoading" @click="onConfirm">确定</el-button>
      <el-button @click="onCancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  COLLEGE_API_SETTINGPACK_GET,
  COLLEGE_API_PACKORDERBASIC_RENEW,
  COLLEGE_API_PACKORDERBASIC_PROMOTE,
  COLLEGE_API_CHARACTERPACK_GETBYCHARACTER
} from '@/apis/science'
import { PackOrderBasicOrderType } from '@/enums/science'
import { PaymentType } from '@/enums/common'

export default {
  props: {
    isManualRenewal: {
      type: Boolean,
      value: false
    },
    isRenewal: true,
    allPacks: {
      type: Array
    },
    order: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        year: {},
        CashPrice: 0,
        PaymentType: PaymentType.AliPay
      },
      visible: this.isManualRenewal,
      btnLoading: false,
      detail: {},
      surplusPrice: 0, // 抵扣价格
      paymentMethods: [
        PaymentType.AliPay,
        PaymentType.WechatPay,
        PaymentType.BankPay
      ].map(type => {
        return {
          value: type,
          text: PaymentType.Types[type]
        }
      }),
      prices: [],
      isPulling: false,
      packs: [],
      selected: {}
    }
  },
  computed: {
    title() {
      return this.isRenewal ? '手工续费' : '手工升级'
    },
    shouldPay() {
      const { form } = this
      if (this.isRenewal) {
        let price = form.year.Price - form.year.CouponPrice
        return parseFloat(price).toFixed(2)
      } else {
        let price = form.year.Price - form.year.CouponPrice - (this.surplusPrice || 0)
        return parseFloat(price).toFixed(2)
      }
    }
  },
  methods: {
    async initDetail() {
      this.btnLoading = false
      this.isPulling = true
      if (!this.isRenewal) {
        this.packs = this.allPacks.filter(item => {
          return item.PackId > this.order.PackId
        }).sort((a, b) => a.PackId - b.PackId)
        if (this.packs && this.packs.length) {
          this.selected = this.packs[0]
        } else {
          this.$message.error('当前套餐等级已经是最高级')
          this.onCancel()
        }
      } else {

        const response = await COLLEGE_API_SETTINGPACK_GET({
          PackId: this.order.PackId
        })
        if (response.data.Code === 'CORRECT') {
          this.detail = {
            ...response.data.Data
          }
          let prices = JSON.parse(response.data.Data.Prices)
          prices.map(child => {
            child.CouponPrice = (child.CouponPrice / 10000).toFixed(2)
            child.Price = (child.Price / 10000).toFixed(2)
          })
          this.prices = prices
          this.form.year = this.prices[0]
          let price = this.prices[0].Price - this.prices[0].CouponPrice
          this.form.CashPrice = parseFloat(price).toFixed(2)
        }
      }
      this.isPulling = false
    },
    onCancel() {
      this.form = {
        year: {},
        CashPrice: 0,
        PaymentType: PaymentType.AliPay
      }
      this.visible = false
    },
    async onConfirm() {
      if (this.form.PaymentType == '') {
        this.$message.error('请选择支付方式')
        return
      } else if (this.form.CashPrice - 0 < 0) {
        this.$message.error('实付金额必须大于等于0')
        return
      }
      this.btnLoading = true
      this.isPulling = true
      const { year, ...rest } = this.form
      const OrderType = this.isRenewal
        ? PackOrderBasicOrderType.Renew
        : PackOrderBasicOrderType.Upgrade
      if (this.isRenewal) {
        COLLEGE_API_PACKORDERBASIC_RENEW({
          ...rest,
          Years: year.Year,
          CashPrice: this.$root.toFixed(this.form.CashPrice * 10000),
          PackId: this.order.PackId,
          CharacterId: this.order.CharacterId,
          OrderType
        })
          .then(res => {
            this.isPulling = false
            if (res.data.Code === 'CORRECT') {
              this.$emit('confirm')
              this.$message.success('提交成功')
              this.onCancel()
            } else {
              this.btnLoading = false
            }
          })
          .catch(() => {
            this.btnLoading = false
            this.isPulling = false
          })
      } else {
        COLLEGE_API_PACKORDERBASIC_PROMOTE({
          ...rest,
          Years: year.Year,
          CashPrice: this.$root.toFixed(this.form.CashPrice * 10000),
          PackId: this.selected.PackId,
          CharacterId: this.order.CharacterId,
          OrderType
        })
          .then(res => {
            this.isPulling = false
            if (res.data.Code === 'CORRECT') {
              this.$emit('confirm')
              this.$message.success('提交成功')
              this.onCancel()
            } else {
              this.btnLoading = false
            }
          })
          .catch(() => {
            this.btnLoading = false
            this.isPulling = false
          })
      }
    },
    shouldPayChange(value) {
      this.$set(this.form, 'CashPrice', value)
    },
    getDetail() {
      COLLEGE_API_CHARACTERPACK_GETBYCHARACTER({
        CharacterId: this.order.CharacterId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.surplusPrice = ((res.data.Data.SurplusPrice || 0) / 10000).toFixed(2)
        }
      })
    }
  },
  mounted() {
    this.initDetail()
    this.getDetail()
  },
  watch: {
    'shouldPay': 'shouldPayChange',
    'form.year': {
      handler() {
        // TODO: 修改 应付金额
        // new Intl.NumberFormat('zh-Hans-CN', { style: 'currency', currency: 'CNY', useGrouping: false }).format(number)
      },
      immediate: true
    },
    order: {
      handler() { },
      immediate: true
    },
    selected(val) {
      if (val && !this.isRenewal && this.packs) {
        try {
          this.prices = JSON.parse(this.packs.find(item => item === val).Prices)
          this.form.year = this.prices[0]
        } catch (e) {
          console.error(e)
        }
      }
    },
    async visible(val) {
      if (!val) {
        this.$emit('confirm', false)
        return
      }
      this.btnLoading = false
      this.isPulling = true
    }
  }
}
</script>

<style lang="scss" scoped>
.strong {
  font-weight: 600;
  font-size: 14px;
  width: 100%;
  line-height: 30px;
  text-align: center;
  color: #ffa200;
  margin: 10px;
}
.green {
  font-weight: bold;
  color: #009900;
}
.price {
  font-size: 18px;
  .strike {
    text-decoration: line-through;
    color: #d9d9d9;
  }
  .couponInfo {
    font-size: 12px;
    color: #00cc00;
  }
  .hint {
    color: #999999;
    font-size: 12px;
  }
}
</style>
