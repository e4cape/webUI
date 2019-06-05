<template>
  <div class="content">
    <div class="tabs">
      <div :name="'tab' + item.KeyId" class="tab" :class="{active: isActive == item.KeyId}" @click="isActive = item.KeyId" v-for="item in couponType.TypeArray" :key="item.KeyId">{{item.Value}}</div>
    </div>
    <div v-show="isActive == couponType.Agrece" class="border-box p-20">
      <el-form class="input-w120" :model="form1" ref="form1" :rules="rules1" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <table>
          <tr>
            <td>收益比率(%)：</td>
            <td>
              <el-form-item prop="CouponRate1">
                <el-input name="CouponRate1" :disabled="Encouraging" v-model="form1.CouponRate1"></el-input>
                <span>&nbsp;&nbsp;最高不可超过本金，即100%</span>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>收益天数(天)：</td>
            <td>
              <el-form-item prop="Days1">
                <el-input name="Days1" :disabled="Encouraging" v-model="form1.Days1"></el-input>
                <span>&nbsp;&nbsp;天</span>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>返还金额：</td>
            <td>
              <el-form-item>
                <span>按天返还</span>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>赠送递减：</td>
            <td>
              <el-form-item prop="SubtractDays1">
                <div class="flex">
                  <span>收益赠送完&nbsp;&nbsp;</span>
                  <el-form-item class="padding-left-none" style="display: inline-block" prop="SubtractDays1">
                    <el-input name="SubtractDays1" :disabled="Encouraging" v-model="form1.SubtractDays1"></el-input>
                    <span>&nbsp;&nbsp;天后按天开始递减</span>
                  </el-form-item>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>可换购商品类别：</td>
            <td>
              <el-form-item>
                <span>{{MaterialType1}}</span>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>换购计算金额：</td>
            <td>
              <el-form-item>
                <span>今日金价*重量（克）+鼓励金</span>
              </el-form-item>
            </td>
          </tr>
        </table>
        <el-form-item>
          <el-button name="tab0Encouraging" v-if="Encouraging" class="m-t-15" type="primary" @click="Encouraging = false">编辑</el-button>
          <el-button name="tab0onSubmit" v-else class="m-t-15" type="primary" @click="onSubmit">保存</el-button>
          <el-button name="tab0editCancel" v-if="!Encouraging" class="m-t-15" @click="editCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-show="isActive == couponType.Agitate" class="border-box p-20">
      <el-form class="input-w120" :model="form3" ref="form3" :rules="rules3" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <table>
          <tr>
            <td>收益比率(%)：</td>
            <td>
              <el-form-item prop="CouponRate3">
                <el-input name="CouponRate3" :disabled="Replacement" v-model="form3.CouponRate3"></el-input>
                <span>&nbsp;&nbsp;最高不可超过本金，即100%</span>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>收益天数(天)：</td>
            <td>
              <el-form-item prop="Days3">
                <el-input name="Days3" :disabled="Replacement" v-model="form3.Days3"></el-input>
                <span>&nbsp;&nbsp;天</span>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>返还金额：</td>
            <td>
              <el-form-item>
                <span>按天返还</span>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>赠送递减：</td>
            <td>
              <el-form-item>
                <div class="flex">
                  <span>收益赠送完&nbsp;&nbsp;</span>
                  <el-form-item style="display: inline-block" prop="SubtractDays3">
                    <el-input name="SubtractDays3" :disabled="Replacement" v-model="form3.SubtractDays3"></el-input>
                    <span>&nbsp;&nbsp;天后按天开始递减</span>
                  </el-form-item>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>可换购商品类别：</td>
            <td>
              <el-form-item>
                <span>{{MaterialType3}}</span>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>换购计算金额：</td>
            <td>
              <div class="flex">
                <el-form-item>
                  <div class="flex">
                    <span>换购新品价格小于等于旧品价格(购价+置换金)的&nbsp;&nbsp;</span>
                    <el-form-item style="display: inline-block" prop="Cpmultiple3">
                      <el-input name="Cpmultiple3" :disabled="Replacement" v-model="form3.Cpmultiple3"></el-input>
                      <span>&nbsp;&nbsp;倍时，则商户额外收取旧品价格的 &nbsp;&nbsp;</span>
                    </el-form-item>
                  </div>
                </el-form-item>
                <el-form-item class="margin-l-no" prop="CpfeeRate3">
                  <el-input name="CpfeeRate3" :disabled="Replacement" v-model="form3.CpfeeRate3"></el-input>
                  <span>&nbsp;&nbsp;%折旧工费；换购商品差价大于旧品价格（购价+置换金）的 {{form3.Cpmultiple3}} 倍时不收取手续费</span>
                </el-form-item>
              </div>
            </td>
          </tr>
        </table>
        <el-form-item>
          <el-button name="tab1Edit" v-if="Replacement" class="m-t-15" type="primary" @click="Replacement = false">编辑</el-button>
          <el-button name="tab1Submit" v-else class="m-t-15" type="primary" @click="onSubmit">保存</el-button>
          <el-button name="tabEditCancel" v-if="!Replacement" class="m-t-15" @click="editCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-show="isActive == couponType.Gond" class="border-box p-20">
      <el-form class="input-w120" :model="form5" ref="form5" :rules="rules5" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <table>
          <tr>
            <td>收益比率(%)：</td>
            <td>
              <el-form-item prop="CouponRate5" style="display:inline-block">
                <el-input name="CouponRate5" :disabled="Shopping" v-model="form5.CouponRate5"></el-input>
                <span>&nbsp;&nbsp;最高不可超过本金，即100%</span>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>收益天数(天)：</td>
            <td>
              <el-form-item prop="Days5">
                <el-input name="Days5" :disabled="Shopping" v-model="form5.Days5"></el-input>
                <span>&nbsp;&nbsp;天</span>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>返还金额：</td>
            <td>
              <el-form-item>
                <span>按天返还</span>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>赠送递减：</td>
            <td>
              <el-form-item>
                <div class="flex">
                  <span>收益赠送完&nbsp;&nbsp;</span>
                  <el-form-item style="display: inline-block" prop="SubtractDays5">
                    <el-input name="SubtractDays5" :disabled="Shopping" v-model="form5.SubtractDays5"></el-input>
                    <span>&nbsp;&nbsp;天后按天开始递减</span>
                  </el-form-item>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>可抵扣商品类别：</td>
            <td>
              <el-form-item>
                <span>{{MaterialType5}}</span>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>抵扣计算金额：</td>
            <td>
              <div class="flex">
                <el-form-item>
                  <div class="flex">
                    <span>素金&nbsp;&nbsp;</span>
                    <el-form-item style="display: inline-block" prop="MaxiRate15">
                      <el-input name="MaxiRate15" :disabled="Shopping" v-model="form5.MaxiRate15"></el-input>
                      <span>&nbsp;&nbsp; % 非素金 &nbsp;&nbsp;</span>
                    </el-form-item>
                  </div>
                </el-form-item>
                <el-form-item class="margin-l-no" prop="MaxiRate25">
                  <el-input name="MaxiRate25" :disabled="Shopping" v-model="form5.MaxiRate25"></el-input>
                  <span>&nbsp;&nbsp;%</span>
                </el-form-item>
              </div>
            </td>
          </tr>
        </table>
        <el-form-item>
          <el-button name="tab2Edit" v-if="Shopping" class="m-t-15" type="primary" @click="Shopping = false">编辑</el-button>
          <el-button name="tab2Save" v-else class="m-t-15" type="primary" @click="onSubmit">保存</el-button>
          <el-button name="tab3Cancel" v-if="!Shopping" class="m-t-15" @click="editCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-show="isActive == couponType.Equiv" class="border-box p-20">
      <el-form class="input-w120" :model="form7" ref="form7" :rules="rules7" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <table>
          <tr>
            <td>收益比率(%)：</td>
            <td>
              <el-form-item prop="CouponRate7">
                <el-input name="CouponRate7" :disabled="Against" v-model="form7.CouponRate7"></el-input>
                <span>&nbsp;&nbsp;最高不可超过本金，即100%</span>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>收益天数(天)：</td>
            <td>
              <el-form-item prop="Days7">
                <el-input name="Days7" :disabled="Against" v-model="form7.Days7"></el-input>
                <span>&nbsp;&nbsp;天</span>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>赠送数量：</td>
            <td>
              <el-form-item prop="CardAmt7">
                <el-input name="CardAmt7" :disabled="Against" v-model="form7.CardAmt7"></el-input>
                <span>&nbsp;&nbsp;张(最多5张)</span>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>赠送递减：</td>
            <td>
              <el-form-item>
                <div class="flex">
                  <span>收益赠送完&nbsp;&nbsp;</span>
                  <el-form-item style="display: inline-block" prop="SubtractDays7">
                    <el-input name="SubtractDays7" :disabled="Against" v-model="form7.SubtractDays7"></el-input>
                    <span>&nbsp;&nbsp;天后按天开始递减</span>
                  </el-form-item>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>返还金额：</td>
            <td>
              <el-form-item>
                <span>按天返还</span>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>可抵扣商品类别：</td>
            <td>
              <el-form-item>
                <span>{{MaterialType7}}</span>
              </el-form-item>
            </td>
          </tr>
        </table>
        <el-form-item>
          <el-button name="tab3Edit" v-if="Against" class="m-t-15" type="primary" @click="Against = false">编辑</el-button>
          <el-button name="tab3Save" v-else class="m-t-15" type="primary" @click="onSubmit">保存</el-button>
          <el-button name="tabCancel" v-if="!Against" class="m-t-15" @click="editCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { MaterialType, CouponType } from '@/enums/marketing.js'
import {
  MARKETING_API_SETTING_COUPON_GET,
  MARKETING_API_SETTING_COUPON_UPDATE
} from '@/apis/marketing.js'
export default {
  data() {
    var validCouponRate = (rule, value, callback) => {
      const reg = new RegExp(
        /^(?!(^0[0-9])$)[1-9][0-9]?(\.[0-9]{1})?$|^(100|100\.0{1}|0\.[0-9]{1})$/,
        'g'
      )
      if (!reg.test(value)) {
        callback(new Error('请输入0-100的小数'))
      } else {
        callback()
      }
    }
    var validDays = (rule, value, callback) => {
      const reg = new RegExp(
        /^(?!(^0[0-9])$)[+]?(([1-9][\d]{0,8}|([1-9][0-9]{0,8})))$/,
        'g'
      )
      if (!reg.test(value)) {
        callback(new Error('请正确输入'))
      } else {
        if (value > 1200) {
          callback(new Error('不可以超过1200'))
        } else {
          callback()
        }
      }
    }
    var validCardAmt = (rule, value, callback) => {
      const reg = new RegExp(
        /^(?!(^0[0-9])$)[+]?(([1-9][\d]{0,8}|([1-9][0-9]{0,8})))$/,
        'g'
      )
      if (value > 5) {
        callback(new Error('最多不能超过5张'))
      } else if (!reg.test(value)) {
        callback(new Error('请正确输入'))
      } else {
        callback()
      }
    }
    var CouponRate = [
      {
        required: true,
        message: '不能为空',
        trigger: 'blur'
      },
      {
        validator: validCouponRate,
        trigger: 'blur'
      }
    ]
    var Days = [
      {
        required: true,
        message: '不能为空',
        trigger: 'blur'
      },
      {
        validator: validDays,
        trigger: 'blur'
      }
    ]
    var SubtractDays = [
      {
        required: true,
        message: '不能为空',
        trigger: 'blur'
      },
      {
        validator: validDays,
        trigger: 'blur'
      }
    ]
    var CardAmt = [
      {
        required: true,
        message: '不能为空',
        trigger: 'blur'
      },
      {
        validator: validCardAmt,
        trigger: 'blur'
      }
    ]
    return {
      couponType: CouponType,
      form1: {
        CouponRate1: '',
        Days1: '',
        SubtractDays1: ''
      },
      rules1: {
        CouponRate1: CouponRate,
        Days1: Days,
        SubtractDays1: SubtractDays
      },
      form3: {
        CouponRate3: '',
        SubtractDays3: '',
        MaterialType3: '',
        Days3: '',
        CpfeeRate3: '',
        Cpmultiple3: ''
      },
      rules3: {
        CouponRate3: CouponRate,
        Days3: Days,
        SubtractDays3: SubtractDays,
        CpfeeRate3: CouponRate,
        Cpmultiple3: CouponRate
      },
      form5: {
        CouponRate5: '',
        Days5: '',
        SubtractDays5: '',
        MaxiRate15: '',
        MaxiRate25: ''
      },
      rules5: {
        CouponRate5: CouponRate,
        Days5: Days,
        SubtractDays5: SubtractDays,
        MaxiRate15: CouponRate,
        MaxiRate25: CouponRate
      },
      form7: {
        CouponRate7: '',
        Days7: '',
        SubtractDays7: '',
        CardAmt7: ''
      },
      rules7: {
        CouponRate7: CouponRate,
        Days7: Days,
        SubtractDays7: SubtractDays,
        CardAmt7: CardAmt
      },
      trpForm: {
        form1: {},
        form3: {},
        form5: {},
        form7: {}
      },
      formInline: {},
      departments: [
        {
          id: 1,
          name: '21'
        },
        {
          id: 2,
          name: '22'
        },
        {
          id: 3,
          name: '23'
        }
      ],
      Encouraging: true,
      Replacement: true,
      Shopping: true,
      Against: true,
      MaterialType1: '',
      MaterialType3: '',
      MaterialType5: '',
      MaterialType7: '',
      isActive: 0
    }
  },
  created() {
    this.isActive = this.couponType.Agrece
    this.getList()
  },
  methods: {
    editCancel() {
      const i = parseInt(this.isActive)
      switch (i) {
        case this.couponType.Agrece:
          this.Encouraging = true
          break
        case this.couponType.Agitate:
          this.Replacement = true
          break
        case this.couponType.Gond:
          this.Shopping = true
          break
        case this.couponType.Equiv:
          this.Against = true
          break
        default:
          break
      }
      this.$refs['form' + i].resetFields()
      this['form' + i] = Object.assign({}, this.trpForm['form' + i])
    },
    getList() {
      this.$store.commit('SET_TB_LOADING', true)
      MARKETING_API_SETTING_COUPON_GET().then(res => {
        if (res.data.Code == 'CORRECT') {
          const dataAll = res.data.Data
          this['form' + this.couponType.Agitate][
            'CpfeeRate' + this.couponType.Agitate
          ] = this.$root.toFloat(
            dataAll['CpfeeRate' + this.couponType.Agitate],
            1,100
          )
          this['form' + this.couponType.Agitate][
            'Cpmultiple' + this.couponType.Agitate
          ] = this.$root.toFloat(dataAll['Cpmultiple' + this.couponType.Agitate], 1)
          this['form' + this.couponType.Gond][
            'MaxiRate1' + this.couponType.Gond
          ] = this.$root.toFloat(dataAll['MaxiRate1' + this.couponType.Gond], 1,100)
          this['form' + this.couponType.Gond][
            'MaxiRate2' + this.couponType.Gond
          ] = this.$root.toFloat(dataAll['MaxiRate2' + this.couponType.Gond], 1,100)
          this['form' + this.couponType.Equiv][
            'CardAmt' + this.couponType.Equiv
          ] = dataAll['CardAmt' + this.couponType.Equiv]
          this.couponType.TypeArray.forEach(item => {
            const i = item.KeyId
            const formName = 'form' + i
            this[formName]['CouponRate' + i] = this.$root.toFloat(
              dataAll['CouponRate' + i],
              1,100
            )
            this[formName]['CouponType' + i] = dataAll['CouponType' + i]
            this[formName]['Days' + i] = dataAll['Days' + i]
            this[formName]['MaterialType' + i] = dataAll['MaterialType' + i]
            this[formName]['SubtractDays' + i] = dataAll['SubtractDays' + i]
            this.getMaterialTypes(
              this[formName]['MaterialType' + i],
              'MaterialType' + i
            )
            this.trpForm[formName] = Object.assign({}, this[formName])
          })
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    onSubmit() {
      const formName = 'form' + this.isActive
      let params = {}
      params['CouponRate'] = this.$root.toInt(
        this[formName]['CouponRate' + this.isActive]
      )/100
      params['Days'] = parseInt(this[formName]['Days' + this.isActive])

      params['SubtractDays'] = parseInt(
        this[formName]['SubtractDays' + this.isActive]
      )
      switch (parseInt(this.isActive)) {
        case this.couponType.Agitate:
          params['Cpmultiple'] = this.$root.toInt(
            this[formName]['Cpmultiple' + this.isActive]
          )
          params['CpfeeRate'] = this.$root.toInt(
            this[formName]['CpfeeRate' + this.isActive]
          )/100
          break
        case this.couponType.Gond:
          params['MaxiRate1'] = this.$root.toInt(
            this[formName]['MaxiRate1' + this.isActive]
          )/100
          params['MaxiRate2'] = this.$root.toInt(
            this[formName]['MaxiRate2' + this.isActive]
          )/100
          break
        case this.couponType.Equiv:
          params['CardAmt'] = parseInt(
            this[formName]['CardAmt' + this.isActive]
          )
          break
        default:
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          params['CouponType'] = parseInt(this.isActive)
          params['MaterialType'] = 0
          MARKETING_API_SETTING_COUPON_UPDATE(params).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '保存成功！'
              })
              switch (parseInt(this.isActive)) {
                case this.couponType.Agrece:
                  this.Encouraging = true
                  break
                case this.couponType.Agitate:
                  this.Replacement = true
                  break
                case this.couponType.Gond:
                  this.Shopping = true
                  break
                case this.couponType.Equiv:
                  this.Against = true
                  break
                default:
              }
            }
          })
        }
      })
    },
    getMaterialTypes(types, name) {
      let arr = types.split(',')
      let current = []
      arr.forEach(m => {
        current.push(MaterialType.Types[m])
        this[name] = current.join('、')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.border-box {
  border: 1px solid #e5e5e5;
  tr {
    border-bottom: 1px solid #e5e5e5;
    &:nth-of-type(1) {
      border-top: 1px solid #e5e5e5;
    }
    td {
      font-size: 12px;
      color: #333333;
      padding-left: 20px;
      &:nth-of-type(1) {
        width: 200px;
        color: #777777;
        background: #f5f5f5;
        border-right: 1px solid #e5e5e5;
      }
    }
  }
}
.flex {
  display: flex;
}
.input-w120 .el-input {
  width: 120px;
}
.m-t-15 {
  margin-top: 15px;
}
</style>
<style lang="scss">
.border-box tr td .el-form-item {
  margin-bottom: 0px !important;
}
.border-box .el-form-item__error {
  position: static;
}
.margin-l-no .el-form-item__content {
  margin-left: 0px !important;
}

.border-box .el-form > .el-form-item > .el-form-item__content {
  padding-left: 20px;
}
.border-box .el-form-item .el-form-item__content {
  border: none;
  font-size: 12px;
  .el-input__inner {
    height: 24px;
  }
}
</style>

