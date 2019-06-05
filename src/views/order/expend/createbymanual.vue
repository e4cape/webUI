
<template  >
  <div class="content">
    <div>
      <!--  <div class="title">补录消费单</div>  -->
      <el-form :model="form" v-loading="isLoading" ref="form" :rules="rules" label-width="120px" label-position="right" class="createxpend fix-w">
        <el-form-item label="消费单类型：">
          <el-radio-group @change="exchangeMarproID" v-model="form.MarproId" name="MarproId">
            <el-radio v-for="(item, index) in marketProduct" :key="index" :label="item.MarproId">{{item.MarproTitle}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="条码：" prop="ProductNO">
          <el-input v-model="form.ProductNO" name="ProductNO" :maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="材质类型：" prop="MaterialType">
          <el-select v-model="form.MaterialType" filterable name="MaterialType">
            <el-option v-for="item in materialTypes" :key="item.Id" :value="item.Id" :label="item.Value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称：" prop="ProductTitle">
          <el-input v-model="form.ProductTitle" name="ProductTitle" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="证书号：" prop="CertSeriesID">
          <el-input v-model="form.CertSeriesID" name="CertSeriesID" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="标签价：" prop="LabelPrice">
          <el-input v-model="form.LabelPrice" name="LabelPrice" :maxlength="9" @keyup.native="form.LabelPrice = $root.toFixed(form.LabelPrice, 2)"></el-input>
        </el-form-item>
        <el-form-item prop="GoldType" label="素金品类：" v-if="isGold">
          <el-select @change="calculating('GoldType')" v-model="form.GoldType" filterable name="GoldType">
            <el-option v-for="(item, index) in $store.getters.goldType.Types" :key="index" :value="parseInt(index)" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="GoldWeight" label="净金重（克）：" v-if="isGold">
          <el-input @change="calculating('GoldWeight')" v-model="form.GoldWeight" name="GoldWeight" @keyup.native="form.GoldWeight = $root.toFixed(form.GoldWeight, 3)"></el-input>
        </el-form-item>
        <el-form-item prop="GoldPrice" label="今日金价：" v-if="isGold">
          <el-input @change="calculating('GoldPrice')" v-model="form.GoldPrice" name="GoldPrice" :maxlength="9" @keyup.native="form.GoldPrice = $root.toFixed(form.GoldPrice, 2)"></el-input>
        </el-form-item>
        <el-form-item label="计价工费：" prop="WorkPrice" required>
          <el-input @change="calculating('WorkPrice')" v-model="form.WorkPrice" name="WorkPrice" :maxlength="9" @keyup.native="form.WorkPrice = $root.toFixed(form.WorkPrice, 2)"></el-input>
        </el-form-item>
        <el-form-item label="商品售价：" prop="ProductPrice">
          <el-input @change="calculating('ProductPrice')" v-model="form.ProductPrice" name="ProductPrice" :maxlength="9" @keyup.native="form.ProductPrice = $root.toFixed(form.ProductPrice, 2)"></el-input>
        </el-form-item>
        <el-form-item label="实付金额：" prop="CashPrice">
          <el-input ref="CashPrice" v-model="form.CashPrice" :disabled="true" name="CashPrice" :maxlength="9" @keyup.native="form.CashPrice = $root.toFixed(form.CashPrice, 2)"></el-input>
        </el-form-item>
        <el-form-item label="支付方式：" required>
          <div style="color: #606266; font-size: 12px">最少选择1种，最多2种</div>
          <div v-for="(item, index) in form.Payments" :key="index" class="payment-item">
            <el-form-item :prop="`Payments[${index}].CategoryId`" class="payment">
              <el-select
                filterable
                v-model="item.CategoryId"
                :clearable="index==1"
                placeholder="请选择"
                @change="paymentsToggle(item.CategoryId, index)"
                :disabled="index==0&&form.Payments[0].CategoryId==cashID&&!!form.Payments[1].CategoryId"
                name="CategoryId"
              >
                <template v-for="ele in $store.getters.paymentType.TypeArray">
                  <el-option v-if="index==1&&form.Payments[0].CategoryId==cashID&&ele.Id!=cashID" :key="ele.Id" :label="ele.Value" :value="ele.Id"></el-option>
                </template>
                <template v-for="ele in $store.getters.paymentType.TypeArray">
                  <el-option v-if="index==1&&form.Payments[0].CategoryId!=cashID&&ele.Id==cashID" :key="ele.Id" :label="ele.Value" :value="ele.Id"></el-option>
                </template>
                <template v-for="ele in $store.getters.paymentType.TypeArray">
                  <el-option v-if="index==0&&form.Payments[1].CategoryId!=ele.Id" :key="ele.Id" :label="ele.Value" :value="ele.Id"></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item :prop="`Payments[${index}].PayPrice`">
              <el-input ref="PayPrice" :disabled="index==1&&!item.CategoryId" v-model="item.PayPrice" :maxlength="9" @blur="calcPayPrice(item.PayPrice,index)" placeholder="请输入金额" name="PayPrice"></el-input>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="会员：" prop="MemberId">
          <el-input v-model="form.MemberId" v-show="false" name="MemberId"></el-input>
          <el-button type="text" @click="memberVisible=true" name="btn-select">选择</el-button>
          <el-table :data="memberData">
            <el-table-column prop="aliasName" label="昵称"></el-table-column>
            <el-table-column prop="trueName" label="真实姓名"></el-table-column>
            <el-table-column prop="sexyType" :formatter="formatter" label="性别"></el-table-column>
            <el-table-column prop="mobile" label="手机"></el-table-column>
            <el-table-column prop="address" label="所在地"></el-table-column>
            <el-table-column prop="joinTime" label="创建时间"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="销售日期：" prop="CreateTime">
          <el-date-picker v-model="form.CreateTime" value-format="yyyy-MM-dd HH:mm:ss" :editable="false" type="datetime" placeholder="选择日期" :picker-options="pickerOptions" name="CreateTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="员工账号：" prop="CreateUserId">
          <el-select v-model="form.CreateUserId" @change="getUser" filterable name="CreateUserId">
            <template v-for="item in $store.getters.users">
              <el-option :key="item.UserId" :value="item.UserId" :label="item.TrueName" v-if="item.UserId!=form.AssistUserId"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="员工密码：" prop="Password">
          <el-input type="Password" v-model="form.Password" name="Password"></el-input>
        </el-form-item>
        <el-form-item label="辅销导购：" prop="AssistUserId">
          <el-select v-model="form.AssistUserId" @change="getAssistName" filterable name="AssistUserId">
            <template v-for="item in $store.getters.users">
              <el-option :key="item.UserId" v-if="item.UserId!=form.CreateUserId" :value="item.UserId" :label="item.TrueName"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="质保单备注：">
          <el-select v-model="qualityNote" @change="getQualityNote" filterable name="qualityNote">
            <el-option v-for="item in qualityNoteList" :key="item.Value" :value="item.Value" :label="item.Name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="BriefNote" style="width:50%">
          <el-input v-model="form.BriefNote" type="textarea" :maxlength="200" :rows="4" placeholder="请输入质保单备注" name="BriefNote"></el-input>
          <span class="note-tip" v-if="qualityNote==1||qualityNote==3||qualityNote==9">请在冒号后输入数据</span>
          <span class="note-tip" v-if="qualityNote==5">请在年月日输入数据</span>
          <span class="note-tip" v-if="qualityNote==7">请选择实际使用的卡券并在冒号处输入金额</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')" name="btn-save">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="选择会员" width="900px" :visible.sync="memberVisible">
      <memberpickup @selectMember="selectMember" :isShow="memberVisible"></memberpickup>
    </el-dialog>
  </div>
</template>
<script>
import memberpickup from './memberpickup.vue'
import dayjs from 'dayjs'
import {
  YNStatus,
  SexyType,
  EnableState
} from '@/enums/common'
import {
  MarproStatus,
  StoreSettingParameterIgnoreUnit,
  StoreSettingParameterIgnoreType
} from '@/enums/marketing.js'
import { RetailOrderSellProductSourceType, RetailOrderMasterTerminalType, RetailOrderSellBasicSellType } from '@/enums/order'
import {
  MARKETING_API_MARKET_PRODUCT_GETS
} from '@/apis/marketing'
import { ORDER_API_RETAIL_ORDER_MASTER_CREATEBYSELF } from '@/apis/order'
import { MERCHANT_API_SETTING_GPRICE_GET, MERCHANT_API_SETTING_PARAMETER_GET } from '@/apis/merchant'
export default {
  components: {
    memberpickup
  },
  data() {
    return {
      YNStatus,
      materialTypes: [],
      paramsSetting: {},
      cashID: '',
      userId: '',
      form: {
        IsMarketing: YNStatus.Yes,
        MarproId: 0,
        ProductNO: '',
        MaterialType: '',
        ProductTitle: '',
        CertSeriesID: '',
        LabelPrice: '',
        GoldType: '',
        GoldWeight: '',
        GoldPrice: '',
        WorkPrice: '',
        ProductPrice: '',
        CashPrice: '',
        MemberId: '',
        CreateTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        CreateUserId: '',
        CreateUser: '',
        Password: '',
        BriefNote: '',
        Payments: [
          {
            CategoryId: '',
            CategoryName: '现金',
            PayPrice: '',
            PaymentType: ''
          },
          {
            CategoryId: '',
            CategoryName: '',
            PayPrice: '',
            PaymentType: ''
          }
        ],
        AssistUserId: '',
        AssistUser: ''
      },
      isGold: true,
      isLoading: false,
      memberData: [],
      memberVisible: false,
      marketProduct: [],
      qualityNote: '',
      qualityNoteList: [
        {
          Value: 1, Name: '黄金以旧换新'
        },
        {
          Value: 3, Name: '珠宝以旧换新'
        },
        {
          Value: 5, Name: '更换备注'
        },
        {
          Value: 7, Name: '抵用备注'
        },
        {
          Value: 9, Name: '礼品备注'
        },
        {
          Value: 11, Name: '收银备注'
        }
      ],
      noteContent: {
        '1': '原克重：   克，金价：   元，商品金额：    元，折旧费：  元，新金：   元，补差：    元',
        '3': '原商品：   元，工费：   元，新商品：   元，补差：  元',
        '5': '票据日期：    年    月    日，老顾客回店更换电子质保单',
        '7': '新品购买，已使用鼓励金/置换金/购物券/现金券：     元',
        '9': '已赠送：',
        '11': '已开发票'
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      rules: {
        ProductNO: [
          {
            required: true, message: '不能为空', trigger: 'blur'
          },
          {
            validator: this.pNvalidate, trigger: 'blur'
          }
        ],
        MaterialType: [
          {
            required: true, message: '不能为空', trigger: 'change'
          }
        ],
        ProductTitle: [
          {
            required: true, message: '不能为空', trigger: 'blur'
          }
        ],
        CertSeriesID: [
          {
            required: false,
            max: '100',
            message: '最多只能输入100个字符',
            trigger: 'blur'
          }
        ],
        GoldType: [
          {
            required: true, message: '不能为空', trigger: 'change'
          }
        ],
        GoldWeight: [
          {
            required: true, message: '不能为空', trigger: 'blur'
          },
          {
            validator: this.thirdValidate, trigger: 'blur'
          }
        ],
        GoldPrice: [
          {
            required: true, message: '不能为空', trigger: 'blur'
          },
          {
            validator: this.twoDecValid, trigger: 'blur'
          }
        ],
        WorkPrice: [
          {
            required: false, message: '不能为空'
          },
          {
            validator: this.twoDecValid
          }
        ],
        ProductPrice: [
          {
            required: true, message: '不能为空'
          },
          {
            validator: this.twoFloatValidate
          }
        ],
        CashPrice: [
          {
            required: true, message: '不能为空'
          }
        ],
        MemberId: [
          {
            required: true, message: '不能为空'
          }
        ],
        CreateTime: [
          {
            required: true, message: '不能为空'
          }
        ],
        Password: [
          {
            required: true, message: '不能为空'
          }
        ],
        CreateUserId: [
          {
            required: true, message: '不能为空'
          }
        ],
        'Payments[0].PayPrice': [
          {
            required: true, message: '不能为空'
          },
          {
            validator: this.payments1Validate
          }
        ],
        'Payments[1].PayPrice': [
          {
            required: false, message: '不能为空'
          },
          {
            validator: this.emptyTowViladate
          }
        ]
      }
    }
  },

  created() {
    this.getEnums()
  },
  methods: {
    getQualityNote(value) {
      // 获取备注内容
      this.form.BriefNote = this.noteContent[value]
    },
    getUser(value) {
      // 获取创建员工姓名
      this.$store.getters.users.forEach(item => {
        if (item.UserId == value) {
          this.form.CreateUser = item.TrueName
        }
      })
    },
    formatter() {
      return SexyType.Types[arguments[2]]
    },
    getMtp() {
      // 获取可用材质
      let supportMaterial = this.marketProduct
        .find(item => item.MarproId == this.form.MarproId)
        .MaterialTypes.split(',')
      this.materialTypes = this.$store.getters.materialType.TypeArray.filter(item => {
        if (supportMaterial.some(ele => ele == item.Id)) {
          return item
        }
      })
      this.form.MaterialType = this.materialTypes[0].Id
    },
    getEnums() {
      // 支付方式item.IsEnable
      this.$store.dispatch('GET_PAYMENT_TYPE', EnableState.Enable).then(() => {
        this.form.Payments[0].CategoryId = this.$store.getters.paymentType.TypeArray.find(
          item => item.Value == '现金'
        ).Id
        this.form.Payments[0].CategoryName = this.$store.getters.paymentType.TypeArray.find(
          item => item.Value == '现金'
        ).Value
        this.form.Payments[0].PaymentType = this.$store.getters.paymentType.TypeArray.find(
          item => item.Value == '现金'
        ).Id
        this.cashID = this.$store.getters.paymentType.TypeArray.find(
          item => item.Value == '现金'
        ).Id
      })
      MARKETING_API_MARKET_PRODUCT_GETS({
        Status: MarproStatus.Online,
        PageIndex: 1,
        PageSize: 999
      })
        .then(res => {
          // 营销活动列表
          if (res.data.Code === 'CORRECT') {
            this.marketProduct = res.data.Data.Rows
            this.form.MarproId = res.data.Data.Rows[0].MarproId
          }
        })
        .then(() => {
          this.$store.dispatch('GET_MATERIAL_TYPE', EnableState.Enable).then(() => {
            this.getMtp()
          })
        })
      // 素金品类
      this.$store.dispatch('GET_GOLD_TYPE', EnableState.Enable)
      this.$store.dispatch('GET_USERS_DROPLIST', { State: EnableState.Enable, CashierType: 0 })
      MERCHANT_API_SETTING_PARAMETER_GET({
        CharacterId: this.$store.getters.user_session.CharacterId
      }).then(res => {
        // 系统设置
        this.paramsSetting = res.data.Data
      })
    },
    exchangeMarproID(value) {
      // 切换营销活动
      this.$refs['form'].resetFields()
      this.getMtp()
      this.memberData = []
      this.qualityNote = ''
      this.form.Payments[0].CategoryId = this.$store.getters.paymentType.TypeArray.find(
        item => item.Value == '现金'
      ).Id
      this.paymentsToggle(this.form.Payments[1].CategoryId, 1)
      if (value != this.marketProduct[0].MarproId) {
        this.isGold = false
      } else {
        this.isGold = true
      }
    },
    selectMember(data) {
      this.memberData = [data]
      this.form.MemberId = data.memberId
      this.memberVisible = false
    },
    calculating(name) {
      const workPrice = isNaN(parseFloat(this.form.WorkPrice))
        ? 0
        : parseFloat(this.form.WorkPrice)

      let productPrice = isNaN(
        parseFloat(this.form.GoldWeight) * parseFloat(this.form.GoldPrice)
      )
        ? 0
        : (
          parseFloat(this.form.GoldWeight) * parseFloat(this.form.GoldPrice)
        ).toFixed(2)
      switch (name) {
        case 'GoldWeight':
          this.form.ProductPrice = productPrice
          this.form.CashPrice = this.cashPriceUnit(
            workPrice * 1 + productPrice * 1
          )
          break
        case 'GoldPrice':
          this.form.ProductPrice = productPrice
          this.form.CashPrice = this.cashPriceUnit(
            workPrice * 1 + productPrice * 1
          )

          break
        case 'WorkPrice':
          var tpr = isNaN(Number(this.form.ProductPrice))
            ? 0
            : Number(this.form.ProductPrice)
          this.form.CashPrice = this.cashPriceUnit(workPrice * 1 + tpr * 1)
          break
        case 'ProductPrice':
          this.form.CashPrice = this.cashPriceUnit(
            isNaN(Number(this.form.ProductPrice))
              ? 0
              : Number(this.form.ProductPrice) + workPrice * 1
          )
          break
        case 'GoldType':
          MERCHANT_API_SETTING_GPRICE_GET({
            GoldType: this.form.GoldType
          }).then(
            res => {
              this.$set(this.form, 'GoldPrice', this.$root.toFloat(res.data.Data.Gprice))
              productPrice = isNaN(
                parseFloat(this.form.GoldWeight) *
                parseFloat(this.form.GoldPrice)
              )
                ? 0
                : (
                  parseFloat(this.form.GoldWeight) *
                  parseFloat(this.form.GoldPrice)
                ).toFixed(2)
              if (this.form.GoldWeight) {
                this.form.ProductPrice = productPrice
                this.form.CashPrice = this.cashPriceUnit(
                  workPrice * 1 + productPrice * 1
                )
              }
            }
          )
          break
        default:
          break
      }
    },
    paymentsToggle(val, i) {
      // 选择支付方式
      const paymentType = this.$store.getters.paymentType.TypeArray.find(item => item.Id == val)
      this.form.Payments[i].CategoryName = paymentType ? paymentType.Value : ''
      this.form.Payments[i].PaymentType = paymentType
        ? paymentType.Id
        : 0
      if (i == 1) {
        if (val) {
          this.rules['Payments[1].PayPrice'] = [
            {
              required: true, message: '不能为空！'
            },
            {
              validator: this.payments2Validate
            }
          ]
          this.calcPayPrice(this.form.Payments[0].PayPrice, 0)
        } else {
          this.rules['Payments[1].PayPrice'] = [
            {
              required: false, message: '不能为空！'
            },
            {
              validator: this.payments2Validate
            }
          ]
          this.form.Payments[1].PayPrice = ''
          this.$refs.form.validateField('Payments[1].PayPrice')
        }
      }
    },
    calcPayPrice(price, i) {
      this.$refs.form.validateField(`Payments[${i}].PayPrice`, errMes => {
        if (!errMes || errMes == '支付金额之和必须等于实付金额！') {
          if (i == 0) {
            if (this.form.Payments[1].CategoryId) {
              this.form.Payments[1].PayPrice = (
                this.form.CashPrice - price
              ).toFixed(2)
            }
          } else {
            this.form.Payments[0].PayPrice = (
              this.form.CashPrice - price
            ).toFixed(2)
          }
        }
      })
    },
    getAssistName(val) {
      // 辅销姓名
      this.form.AssistUser = this.$store.getters.users.find(
        item => item.UserId == val
      ).TrueName
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (dayjs(this.form.CreateTime) <= new Date()) {
            this.isLoading = true
            let params = JSON.parse(JSON.stringify(this.form))
            params.AssistUserId = params.AssistUserId || 0
            params.Payments = params.Payments.filter(item => {
              if (item.PayPrice) {
                item.PayPrice = this.$root.toInt(item.PayPrice)
                return item
              }
            })
            params.Orders = [{
              SourceType: RetailOrderSellProductSourceType.Manual,
              TerminalType: RetailOrderMasterTerminalType.Website,
              ProductNO: params.ProductNO,
              MaterialType: params.MaterialType,
              ProductTitle: params.ProductTitle,
              CertSeriesID: params.CertSeriesID,
              GoldType: params.GoldType || 0,
              LabelPrice: this.$root.toInt(params.LabelPrice),
              GoldWeight: this.$root.toInt(params.GoldWeight),
              GoldPrice: this.$root.toInt(params.GoldPrice),
              WorkPrice: this.$root.toInt(params.WorkPrice),
              ProductPrice: this.$root.toInt(params.ProductPrice),
              CashPrice: this.$root.toInt(params.CashPrice),
              SellType: RetailOrderSellBasicSellType.RetailOrder,
              BriefNote: params.BriefNote
            }]
            ORDER_API_RETAIL_ORDER_MASTER_CREATEBYSELF(params).then(res => {
              if (res.data.Code == 'CORRECT') {
                this.$message({
                  type: 'success',
                  message: '提交成功'
                })
                this.$router.push('/order/expend/index')
              } else {
                this.isLoading = false
              }
            })
          } else {
            this.$message({
              type: 'warning',
              message: '销售时间不能大于当前时间！'
            })
          }
        }
      })
    },
    cashPriceUnit(val) {
      // 抹零单位
      let p
      if (
        this.paramsSetting.IgnoreUnit == StoreSettingParameterIgnoreUnit.Unit1
      ) {
        p = this.cashPriceType(val)
      } else if (
        this.paramsSetting.IgnoreUnit == StoreSettingParameterIgnoreUnit.Unit3
      ) {
        p = this.cashPriceType(val * 10)
        p = p / 10
      } else {
        p = this.cashPriceType(val * 100)
        p = p / 100
      }
      return p.toFixed(2)
    },
    cashPriceType(val) {
      // 抹零舍入
      let price
      if (
        this.paramsSetting.IgnoreType == StoreSettingParameterIgnoreType.Type1
      ) {
        price = Math.floor(val)
      } else if (
        this.paramsSetting.IgnoreType == StoreSettingParameterIgnoreType.Type3
      ) {
        price = Math.ceil(val)
      } else {
        price = Math.round(val)
      }
      return price
    },
    twoDecValid(rule, value, callback) {
      // 两位小数包含0
      let reg = /^(([1-9]\d{0,8})|\d)(\.\d{1,2})?$/
      if (!value) {
        callback(new Error('不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('输入有误'))
      } else {
        callback()
      }
    },
    thirdValidate(rule, value, callback) {
      // 三位非零三位小数验证
      let flag = /^(?!0(\.0{1,3})?$)([1-9]\d{0,8}|\d)(\.\d{1,3})?$/g.test(value)
      if (!flag) {
        callback(new Error('输入有误！'))
      } else {
        callback()
      }
    },
    twoFloatValidate(rule, value, callback) {
      // 两位非零两位小数验证
      let flag = /^(?!0(\.0{1,2})?$)([1-9]\d{0,8}|\d)(\.\d{1,2})?$/g.test(value)
      if (!flag || value == 0) {
        callback(new Error('输入有误！'))
      } else {
        callback()
      }
    },
    payments1Validate(rule, value, callback) {
      let PayPrice1 = parseFloat(value || 0)
      let PayPrice2 = parseFloat(this.form.Payments[1].PayPrice || 0)
      const flag = /^(?!0(\.0{1,2})?$)([1-9]\d{0,8}|\d)(\.\d{1,2})?$/g.test(
        value
      )
      if (value != '') {
        if (!flag) {
          callback(new Error('输入有误！'))
        } else if ((PayPrice1 + PayPrice2).toFixed(2) != this.form.CashPrice) {
          callback(new Error('支付金额之和必须等于实付金额！'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    payments2Validate(rule, value, callback) {
      let PayPrice1 = parseFloat(this.form.Payments[0].PayPrice || 0)
      const flag = /^(?!0(\.0{1,2})?$)([1-9]\d{0,8}|\d)(\.\d{1,2})?$/g.test(
        value
      )
      if (value != '') {
        if (!flag) {
          callback(new Error('输入有误！'))
        } else {
          if (PayPrice1 != '') {
            this.$refs.form.validateField('Payments[0].PayPrice')
          }
          callback()
        }
      } else {
        callback()
      }
    },
    pNvalidate(rule, value, callback) {
      if (!/^\S{1,50}$/.test(value)) {
        callback(new Error('输入有误'))
      } else {
        callback()
      }
    }
  }
}
</script>
<style lang="scss" scoped="true">
.content {
  .title {
    padding-left: 30px;
    height: 34px;
    color: #777;
    line-height: 34px;
    font-size: 12px;
    font-weight: bold;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    background-color: #f5f5f5;
  }
  .createxpend {
    .payment-item {
      display: flex;
      margin-bottom: 14px;
      &:last-of-type {
        margin-bottom: 0;
      }
      .payment {
        margin-right: 10px;
      }
    }
  }
  .note-tip {
    color: #f56c6c;
  }
}
</style>