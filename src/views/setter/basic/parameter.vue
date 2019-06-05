<template>
  <div class="content">
    <el-row class="parameter">
      <div
        class="panel-tag"
        style="margin-top: 0;"
      >
        <span>零售抹零</span>
      </div>
      <el-form
        ref="form"
        label-width="120px"
        class="m-t-20"
      >
        <el-form-item label="保留位数：">
          <el-select
            name="minUnit"
            v-model="minUnit"
            placeholder="请选择"
            class="m-r-5"
            filterable
          >
            <el-option
              v-for="(item,index) in settingParameterIgnoreUnit.Types"
              :key="index"
              :label="item"
              :value="parseInt(index)"
            ></el-option>
          </el-select>
          <el-select
            name="saveRule"
            v-model="saveRule"
            placeholder="请选择"
            class="m-r-5"
            filterable
          >
            <el-option
              v-for="(item,index) in settingParameterIgnoreType.Types"
              :key="index"
              :label="item"
              :value="parseInt(index)"
            ></el-option>
          </el-select>
          <span>示例：100.888抹零后为{{maLing}}</span>
        </el-form-item>
      </el-form>

      <div class="panel-tag">
        <span>柜台领货/退货</span>
      </div>
      <div class="init-margin el-form-item__content">
        <el-radio-group
          name="resource"
          v-model="resource"
        >
          <el-radio
            v-for="(item,index) in settingParameterValidateType.Types"
            :key="index"
            :label="parseInt(index)"
          >{{item}}</el-radio>
        </el-radio-group>
      </div>
      <template v-if="$store.getters.wechatSettingType != companyBasicMountType.Company">
        <div class="panel-tag">
          <span>销售商品数据来源</span>
        </div>
        <div class="init-margin el-form-item__content">
          <el-radio-group
            name="dataSource"
            v-model="dataSource"
          >
            <el-radio
              v-for="(item,index) in settingParameterGoodsSourceType.Types"
              :key="index"
              :label="parseInt(index)"
            >{{item}}</el-radio>
          </el-radio-group>
        </div>
      </template>
      <div class="panel-tag">
        <span>犒赏及评分设置</span>
      </div>
      <div class="init-margin el-form-item__content">
        <div class="initReward">
          <div class="label-setting">评分及犒赏启用设置：</div>
          <el-radio-group
            name="rewardType"
            v-model="rewardType"
          >
            <el-radio
              v-for="(item,index) in settingParameterRewardType.Types"
              :key="item"
              :label="parseInt(index)"
            >{{item.replace('打赏', '犒赏').replace('都', '均')}}</el-radio>
          </el-radio-group>
        </div>
        <div
          class="initReward"
          v-if="rewardType != settingParameterRewardType.Score && rewardType != settingParameterRewardType.None"
        >
          <div class="label-setting">固定犒赏金额设置：</div>
          <span>犒赏金额1：</span>
          <el-input
            :maxlength="10"
            name="reward1"
            v-model="reward1"
            @keyup.native="reward1 = toFixed(reward1, 2)"
            @blur="valueFixed(reward1,'reward1')"
          ></el-input>
          <span>元 &nbsp; &nbsp; &nbsp;犒赏金额2：</span>
          <el-input
            :maxlength="10"
            name="reward2"
            v-model="reward2"
            @keyup.native="reward2 = toFixed(reward2, 2)"
            @blur="valueFixed(reward2,'reward2')"
          ></el-input>
          <span>元 &nbsp; &nbsp; &nbsp;犒赏金额3：</span>
          <el-input
            :maxlength="10"
            name="reward3"
            v-model="reward3"
            @keyup.native="reward3 = toFixed(reward3, 2)"
            @blur="valueFixed(reward3,'reward3')"
          ></el-input>
          <span>元 &nbsp; &nbsp; &nbsp;犒赏金额4：</span>
          <el-input
            :maxlength="10"
            name="reward4"
            v-model="reward4"
            @keyup.native="reward4 = toFixed(reward4, 2)"
            @blur="valueFixed(reward4,'reward4')"
          ></el-input>
          <span>元</span>
        </div>
        <div
          class="initReward"
          v-if="rewardType != settingParameterRewardType.Score && rewardType != settingParameterRewardType.None"
        >
          <div class="label-setting">其他犒赏金额设置：</div>
          <el-radio-group
            name="isCustomReward"
            v-model="isCustomReward"
          >
            <el-radio
              v-for="(item,index) in ynStatus.Types"
              :key="item"
              :label="parseInt(index)"
            >{{index == ynStatus.No ? '关闭' : '启用'}}</el-radio>
          </el-radio-group>
        </div>
      </div>

      <div class="panel-tag">
        <span>零售修改</span>
      </div>
      <div class="init-margin el-form-item__content">
        <div class="initReward">
          <div class="label-setting">折扣：</div>
          <el-radio-group
            name="discountType"
            v-model="discountType"
          >
            <el-radio :label="parseInt(settingParameterEditType.Unable)">{{settingParameterEditType.Types[settingParameterEditType.Unable]}}</el-radio>
            <el-radio :label="parseInt(settingParameterEditType.Unlimited)">{{settingParameterEditType.Types[settingParameterEditType.Unlimited]}}</el-radio>
          </el-radio-group>
        </div>
        <div class="initReward">
          <div class="label-setting">金价：</div>
          <el-radio-group
            name="goldPriceType"
            v-model="goldPriceType"
          >
            <el-radio :label="parseInt(settingParameterEditType.Unable)">{{settingParameterEditType.Types[settingParameterEditType.Unable]}}</el-radio>
            <el-radio :label="parseInt(settingParameterEditType.Unlimited)">{{settingParameterEditType.Types[settingParameterEditType.Unlimited]}}</el-radio>
          </el-radio-group>
        </div>
        <div class="initReward">
          <div class="label-setting">金重：</div>
          <el-radio-group
            name="goldWeightType"
            v-model="goldWeightType"
          >
            <el-radio :label="parseInt(settingParameterEditType.Unable)">{{settingParameterEditType.Types[settingParameterEditType.Unable]}}</el-radio>
            <el-radio :label="parseInt(settingParameterEditType.Unlimited)">{{settingParameterEditType.Types[settingParameterEditType.Unlimited]}}</el-radio>
          </el-radio-group>
        </div>
        <div class="initReward">
          <div class="label-setting">工费：</div>
          <el-radio-group
            name="craftFeeType"
            v-model="craftFeeType"
          >
            <el-radio :label="parseInt(settingParameterEditType.Unable)">{{settingParameterEditType.Types[settingParameterEditType.Unable]}}</el-radio>
            <el-radio :label="parseInt(settingParameterEditType.Unlimited)">{{settingParameterEditType.Types[settingParameterEditType.Unlimited]}}</el-radio>
          </el-radio-group>
        </div>
        <div class="initReward">
          <div class="label-setting">销售价：</div>
          <el-radio-group
            name="salePriceType"
            v-model="salePriceType"
          >
            <el-radio :label="parseInt(settingParameterEditType.Unable)">{{settingParameterEditType.Types[settingParameterEditType.Unable]}}</el-radio>
            <el-radio :label="parseInt(settingParameterEditType.Unlimited)">{{settingParameterEditType.Types[settingParameterEditType.Unlimited]}}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <template v-if="$store.getters.wechatSettingType != companyBasicMountType.Company">
        <div class="panel-tag">
          <span>每月结账日期</span>
        </div>
        <div class="init-margin el-form-item__content">
          <el-radio-group
            name="invoicing"
            v-model="invoicing"
          >
            <el-radio :label="SettleDate">
              <span class="evey-mouth m-r-5">次月</span>
              <el-input
                name="SettleDate"
                :disabled="!invoicing"
                class="min-input m-r-5"
                :maxlength="2"
                v-model="SettleDate"
                @keyup.native="checkSettleDate"
                @blur="checkSettleDate"
              ></el-input>
              <span>号</span>
              <span class="alertS">（结账后，不允许取消审核当月审核的单据）</span>
            </el-radio>
            <el-radio :label="0">
              <span>不结账</span>
              <span class="alertS">(历史单据可以任意取消审核，不推荐，财务无法对账)</span>
            </el-radio>
          </el-radio-group>
        </div>
      </template>
      <div class="panel-tag">
        <span>花呗分期设置</span>
      </div>
      <div class="init-margin el-form-item__content">
        <div class="initReward">
          <div class="label-setting">手续费承担方设置：</div>
          <el-radio-group
            name="creditPayType"
            v-model="creditPayType"
          >
            <el-radio
              v-for="(item, index) in chargeType.Types"
              :key="index"
              :label="parseInt(index)"
            >{{item}}</el-radio>
          </el-radio-group>
        </div>
      </div>

      <div class="panel-tag">
        <span>零售退货设置</span>
      </div>
      <div class="init-margin el-form-item__content">
        <div class="initReward">
          <div class="label-setting">退货期限：</div>
          <span>从销售日起，</span>
          <el-input
            :maxlength="20"
            name="returnDays"
            v-model="returnDays"
            @keyup.native="returnDayChange"
            @blur="returnDayChange"
          ></el-input>
          <span>天内，可以退货</span>
          <span class="alertS">（最长三十天）</span>
        </div>
      </div>

      <!-- <div class="panel-tag">
        <span>成品调拨设置</span>
      </div>
      <div class="init-margin el-form-item__content">
        <div class="initReward">
          <div class="label-setting">是否结算：</div>
          <el-radio-group name="appropSettleType" v-model="appropSettleType">
            <el-radio :label="parseInt(ynStatus.Yes)">
              <span>结算</span>
              <span class="alertS">（产生应收款）</span>
            </el-radio>
            <el-radio :label="parseInt(ynStatus.No)">
              <span>不结算</span>  
              <span class="alertS">（不产生应收款）</span>
            </el-radio>
          </el-radio-group>
        </div>
      </div>-->
    </el-row>

    <div class="buttons">
      <el-button
        name="saveData"
        type="primary"
        @click="saveData($event)"
        :loading="$store.getters.is_loading"
      >保存</el-button>
    </div>
  </div>
</template>

<script>
import {
  CompanyBasicMountType,
  SettingParameterGoodsSourceType,
  SettingParameterIgnoreType,
  SettingParameterIgnoreUnit,
  SettingParameterRewardType,
  SettingParameterEditType,
  SettingParameterValidateType
} from '@/enums/merchant'
import { YNStatus, ChargeType } from '@/enums/common'
import {
  MERCHANT_API_SETTING_PARAMETER_GET,
  MERCHANT_API_SETTING_PARAMETER_UPDATE
} from '@/apis/merchant.js'
export default {
  data() {
    return {
      companyBasicMountType: CompanyBasicMountType,
      settingParameterIgnoreUnit: SettingParameterIgnoreUnit,
      settingParameterIgnoreType: SettingParameterIgnoreType,
      settingParameterValidateType: SettingParameterValidateType,
      settingParameterGoodsSourceType: SettingParameterGoodsSourceType,
      settingParameterRewardType: SettingParameterRewardType,
      settingParameterEditType: SettingParameterEditType,
      chargeType: ChargeType,
      ynStatus: YNStatus,
      dataSource: null, // 数据来源
      resource: null, // 领退货验证方式
      minUnit: 1, // 单位
      minUnits: {},
      saveRule: 1, // 四舍五入
      saveRules: {},
      reward1: 0,
      reward2: 0,
      reward3: 0,
      reward4: 0,
      discountType: null,
      goldPriceType: null,
      goldWeightType: null,
      craftFeeType: null,
      salePriceType: null,
      rewardType: null,
      SettleDate: 10,
      invoicing: 1,
      creditPayType: ChargeType.Customer,
      returnDays: 0, // 退货期限
      appropSettleType: '', // 是否结算
      isCustomReward: null, // 自定义犒赏
      validateType: {}, // 验证方式
      goodsSourceType: {} // 来源系统
    }
  },
  methods: {
    getData() {
      MERCHANT_API_SETTING_PARAMETER_GET({
        CharacterId: this.$store.getters.user_session.CharacterId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.minUnit = res.data.Data.IgnoreUnit || ''
          this.saveRule = res.data.Data.IgnoreType
          this.resource = res.data.Data.ValidateType
          this.dataSource = res.data.Data.GoodsSourceType
          this.rewardType = res.data.Data.RewardType
          this.reward1 = this.$root.toFloat(res.data.Data.Reward1)
          this.reward2 = this.$root.toFloat(res.data.Data.Reward2)
          this.reward3 = this.$root.toFloat(res.data.Data.Reward3)
          this.reward4 = this.$root.toFloat(res.data.Data.Reward4)
          this.isCustomReward = res.data.Data.IsCustomReward
          this.goodsSourceType = res.data.Data.GoodsSourceType
          this.discountType = res.data.Data.DiscountType
          this.goldPriceType = res.data.Data.GoldPriceType
          this.goldWeightType = res.data.Data.GoldWeightType
          this.craftFeeType = res.data.Data.CraftFeeType
          this.salePriceType = res.data.Data.SalePriceType
          this.creditPayType = res.data.Data.ChargeType
          this.returnDays = res.data.Data.ReturnDays
          this.appropSettleType = res.data.Data.AppropSettleType
          if (res.data.Data.SettleDate) {
            this.SettleDate = res.data.Data.SettleDate
            this.invoicing = res.data.Data.SettleDate
          } else {
            this.SettleDate = 10 // 默认值
            this.invoicing = res.data.Data.SettleDate
          }
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    saveData(e) {
      e.currentTarget.blur()
      this.$confirm('是否保存参数设置修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (!this.SettleDate) {
            this.$message.error('请输入结账日期')
            return false
          }
          this.$store.commit('SET_BTN_LOADING', true)
          MERCHANT_API_SETTING_PARAMETER_UPDATE({
            ValidateType: this.resource,
            IgnoreUnit: this.minUnit,
            IgnoreType: this.saveRule,
            RewardType: this.rewardType,
            Reward1: this.$root.toInt(this.reward1) - 0,
            Reward2: this.$root.toInt(this.reward2) - 0,
            Reward3: this.$root.toInt(this.reward3) - 0,
            Reward4: this.$root.toInt(this.reward4) - 0,
            IsCustomReward: this.isCustomReward,
            GoodsSourceType: this.dataSource,
            DiscountType: this.discountType,
            GoldPriceType: this.goldPriceType,
            GoldWeightType: this.goldWeightType,
            CraftFeeType: this.craftFeeType,
            SalePriceType: this.salePriceType,
            SettleDate: parseInt(this.invoicing),
            ChargeType: this.creditPayType,
            ReturnDays: this.returnDays,
            AppropSettleType: this.appropSettleType
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
            } else {
              this.$message.error(res.data.Message)
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        })
        .catch(() => {})
    },
    valueFixed(value, reward) {
      // 判断系统设置的犒赏金额
      let number = parseFloat(value).toFixed(2)
      if (isNaN(number)) {
        number = '0.00'
      }
      this[reward] = number - 0
    },
    toFixed(value, fixed) {
      if (value && value !== '0') {
        let number = JSON.parse(JSON.stringify(value))
        if ((value + '').indexOf('.') > -1) {
          number =
            (value.split('.')[0] === '' ? '0' : value.split('.')[0]) +
            '.' +
            value.split('.')[1]
        }
        let result = (number + '')
          .replace(/[^\d.]*/g, '')
          .replace(
            new RegExp('([0-9]+.[0-9]{' + fixed + '})[0-9]*', 'gim'),
            '$1'
          )
        return result < 1 ? 1 : result
      }
      return value - 0 < 1 ? 1 : value - 0
    },
    checkSettleDate() {
      if (!this.SettleDate.length) {
        return false
      }
      this.SettleDate = parseInt(this.SettleDate)
      this.invoicing = this.SettleDate
      if (parseInt(this.SettleDate) > 25 || parseInt(this.SettleDate) <= 0) {
        this.$message.error('请输入1到25的结账日期')
        this.getData()
      }
    },
    returnDayChange() {
      if (!this.returnDays.length) {
        return false
      }
      this.returnDays = parseInt(this.returnDays)
      if (parseInt(this.returnDays) > 30 || parseInt(this.returnDays) <= 0) {
        this.$message.error('请输入1到30的退货期限')
        this.getData()
      }
    }
  },
  computed: {
    maLing: function() {
      let result = 0
      switch (this.minUnit) {
        case this.settingParameterIgnoreUnit.Unit1:
          switch (this.saveRule) {
            case this.settingParameterIgnoreType.Type1:
              result = 100
              break
            case this.settingParameterIgnoreType.Type3:
              result = 101
              break
            case this.settingParameterIgnoreType.Type5:
              result = 101
              break
            default:
              break
          }
          break
        case this.settingParameterIgnoreUnit.Unit3:
          switch (this.saveRule) {
            case this.settingParameterIgnoreType.Type1:
              result = 100.8
              break
            case this.settingParameterIgnoreType.Type3:
              result = 100.9
              break
            case this.settingParameterIgnoreType.Type5:
              result = 100.9
              break
            default:
              break
          }
          break
        case this.settingParameterIgnoreUnit.Unit5:
          switch (this.saveRule) {
            case this.settingParameterIgnoreType.Type1:
              result = 100.88
              break
            case this.settingParameterIgnoreType.Type3:
              result = 100.89
              break
            case this.settingParameterIgnoreType.Type5:
              result = 100.89
              break
            default:
              break
          }
          break
        default:
          break
      }
      return result
    }
  },
  mounted() {
    this.getData()
  }
}
</script>
<style lang="scss">
.parameter {
  width: 100%;
  .main-title {
    height: 30px;
    border-bottom: 1px solid #c59b01;
    text-align: left;
    margin: 10px 20px;
    span {
      display: block;
      height: 30px;
      width: 120px;
      text-align: center;
      line-height: 20px;
      padding: 5px;
      border: 1px solid #c59b01;
      border-bottom: none;
      border-radius: 2px;
    }
  }
}
.init-margin {
  margin: 20px;
  margin-left: 51px;
}
.init-tag {
  margin: 20px;
  span {
    display: inline;
    padding: 7px;
  }
}
.initReward {
  .label-setting {
    width: 140px;
    display: inline-block;
  }
  .el-input {
    width: 80px;
    text-align: right;
    input {
      height: 30px;
      text-align: right;
    }
  }
}
.el-form-item__content {
  .alertS {
    font-size: 12px;
    color: #d1d1d1;
  }
  .min-input {
    width: 45px;
    input {
      height: 30px;
      text-align: right;
    }
  }
}
.evey-mouth::before {
  content: '*';
  color: #ff4949;
  margin-right: 4px;
}
</style>

