<template>
  <div class="content">
    <el-form :model="form" ref="form" :rules="formRules" label-width="20px" class="fix-w create-form">
      <table class="table" v-loading="formLoading">
        <tr>
          <td>
            <span>*</span>活动时间
          </td>
          <td>
            <div class="flex-box">
              <el-form-item name="datePickerActivityTimeRange" prop="activityTimeRange" :show-message="false" v-if="!noLimitActivityStop" key="createTimeRange">
                <el-date-picker
                  v-model="form.activityTimeRange"
                  @change="activityTimeChange"
                  :picker-options="pickerOption"
                  :default-value="new Date()"
                  type="daterange"
                  :editable="false"
                  value-format="yyyy-MM-dd"
                  :unlink-panels="true"
                ></el-date-picker>
              </el-form-item>
              <el-form-item name="datePickerActivityStart" prop="ActivityStart" v-else :show-message="false" key="ActivityStart">
                <el-date-picker v-model="form.ActivityStart" :picker-options="pickerOption" type="date" :editable="false" placeholder="选择开始日期" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
              <el-checkbox name="checkboxNoLimitActivityStop" class="m-l-10" v-model="noLimitActivityStop" @change="limitActivityStopChange">不限结束时间</el-checkbox>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <span>*</span>参与条件
          </td>
          <td>
            <div>
              <p class="p-l-20 m-b-10">消费指定材质商品可参与：</p>
              <el-form-item prop="MaterialTypes">
                <el-checkbox-group name="checkboxGroupMaterialTypes" v-model="form.MaterialTypes">
                  <template v-for="(value, key) in $store.getters.materialType.Types">
                    <el-checkbox :key="key" :label="parseInt(key)" v-if="parseInt(key) !== MaterialType.Goldlion">{{value}}</el-checkbox>
                  </template>
                </el-checkbox-group>
              </el-form-item>
              <p class="p-l-20 m-t-15 m-b-5">消费金额限制：</p>
              <el-form-item :show-message="false">
                <el-radio name="radioLimitType" v-model="form.LimitType" :label="QueueCashType.NotFullPrice" @change="isLimitExpendPrice">不限消费金额</el-radio>
                <el-radio name="radioLimitTypes" v-model="form.LimitType" :label="QueueCashType.FullPrice" @change="isLimitExpendPrice">
                  <div style="display:inline">
                    <span class="tip-color">消费</span>
                    <el-form-item label-width="10px" style="display: inline-block;">
                      <el-select name="selectCashType" v-model="form.CashType" :disabled="form.LimitType === QueueCashType.NotFullPrice">
                        <el-option v-for="(value,key) in QueueActivityType.Types" :key="key" :value="parseInt(key)" :label="value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item prop="CashPrice" :show-message="false" label-width="10px" style="display: inline-block;">
                      <el-input name="inputCashPrice" v-model="form.CashPrice" :disabled="form.LimitType === QueueCashType.NotFullPrice">
                        <template slot="prepend">满</template>
                        <i slot="append">元可参与</i>
                      </el-input>
                    </el-form-item>
                  </div>
                </el-radio>
              </el-form-item>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <span>*</span>领取黄金成色
          </td>
          <td>
            <el-form-item prop="CategoryType">
              <el-select name="selectCategoryType" v-model="form.CategoryType" placeholder="请选择领取黄金成色">
                <el-option v-for="item in categoryList" :key="item.Id" :value="item.Id" :label="item.Value"></el-option>
              </el-select>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>
            <span>*</span>活动黄金总数
          </td>
          <td>
            <div class="flex-box">
              <el-form-item prop="QryGram" :show-message="false">
                <el-input name="inputQryGram" v-model="form.QryGram" :disabled="isLimitGoldWeight">
                  <i slot="append">克</i>
                </el-input>
              </el-form-item>
              <el-checkbox name="checkboxIsLimitGoldWeight" v-model="isLimitGoldWeight" @change="limitGoldWeightChange" class="m-l-10">不限</el-checkbox>
              <span class="m-l-10 tip-color">黄金总数领完时，不再接受顾客参与活动</span>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <span>*</span>活动金池设置
          </td>
          <td>
            <div class="flex-box">
              <span class="p-l-20 tip-color">提取参与活动销售单每单</span>
              <el-form-item label-width="10px">
                <el-select name="selectActivityType1" v-model="form.ActivityType1" @change="activityTypeChange">
                  <el-option v-for="(value,key) in QueueActivityType.Types" :key="key" :value="parseInt(key)" :label="value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="Scale1" :show-message="false" label-width="10px">
                <el-input name="inputScale1" v-model="form.Scale1">
                  <i slot="append">% 投入奖池，</i>
                </el-input>
              </el-form-item>
              <el-form-item prop="LimitGram" label-width="10px">
                <el-input name="inputLimitGram" v-model="form.LimitGram" style="width:280px !important">
                  <i slot="prepend">每单提取上限</i>
                  <i slot="append">克</i>
                </el-input>
              </el-form-item>
            </div>
            <div class="p-l-20 m-t-10 tip-color">指从参与活动销售单中拿出多少比例累积进入黄金池，用于发放给正在排队领取的顾客。</div>
          </td>
        </tr>
        <tr>
          <td>
            <span>*</span>顾客领取设置
          </td>
          <td>
            <div class="flex-box">
              <span class="p-l-20 tip-color">按顾客参与活动销售单</span>
              <el-form-item label-width="10px">
                <el-select name="selectActivityType2" v-model="form.ActivityType2" @change="activityTypeChange">
                  <el-option v-for="(value,key) in QueueActivityType.Types" :key="key" :value="parseInt(key)" :label="value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="Scale2" :show-message="false" label-width="10px">
                <el-input name="inputScale2" v-model="form.Scale2">
                  <i slot="append">% 计算</i>
                </el-input>
              </el-form-item>
              <span class="tip-color p-l-10">指按顾客消费金额多少比例奖励給顾客黄金</span>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <span>*</span>领取折算金价
          </td>
          <td>
            <div class="flex-box">
              <el-form-item prop="GoldPrice" :show-message="false">
                <el-input name="inputGoldPrice" v-model="form.GoldPrice" placeholder="请输入金价">
                  <i slot="append">元/g</i>
                </el-input>
              </el-form-item>
              <span class="p-l-10 tip-color">参与活动时，按此金价计算顾客可领多少黄金</span>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <span>*</span>单人领取上限
          </td>
          <td>
            <div class="flex-box">
              <el-form-item prop="ReceiveLimit">
                <el-input name="inputReceiveLimit" v-model="form.ReceiveLimit" placeholder="请输入输入黄金克重">
                  <i slot="append">克/人/单</i>
                </el-input>
              </el-form-item>
              <span class="p-l-10 tip-color">设置每位顾客每单最高奖励上限，超过上限的，按上限奖励</span>
            </div>
          </td>
        </tr>
        <tr>
          <td>领取规则</td>
          <td>
            <p class="p-l-20 m-y-5 tip-color">按顾客购买时间排队领取，先消费先领取，活动结束或终止则排队结束,未领完的排队者作废。</p>
          </td>
        </tr>
        <tr>
          <td>发放规则</td>
          <td>
            <p class="p-l-20 m-y-5 tip-color">金池黄金数等于待领取顾客应领黄金数时自动发放</p>
          </td>
        </tr>
        <tr>
          <td>
            <span>*</span>使用有效期
          </td>
          <td>
            <div class="flex-box">
              <el-form-item prop="Validity">
                <el-input name="inputValidity" v-model="form.Validity" :disabled="isLimitValidity">
                  <i slot="append">天</i>
                </el-input>
              </el-form-item>
              <el-checkbox name="checkboxIsLimitValidity" v-model="isLimitValidity" @change="limitValidityChange" class="m-l-10">不限</el-checkbox>
              <span class="m-l-10 tip-color">从领取成功后开始计算有效期，过期后领取的黄金不能兑换和抵扣使用</span>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <span>*</span>使用设置
          </td>
          <td>
            <div>
              <el-form-item prop="MaterialTypes1">
                <el-checkbox-group name="checkboxGroupMaterialTypes1" v-model="form.MaterialTypes1">
                  <el-checkbox v-for="(value, key) in $store.getters.materialType.Types" :key="key" :label="parseInt(key)" :disabled="parseInt(key) === MaterialType.Goldlion">{{value}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <span>*</span>使用折算金价
          </td>
          <td>
            <el-form-item>
              <el-radio-group name="radioGroupGoldType" v-model="form.GoldType">
                <el-radio v-for="(value, key) in QueueGoldType.Types" :key="key" :label="parseInt(key)">{{value}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </td>
        </tr>
        <tr v-if="form.CharacterType === CharacterType.Company">
          <td>
            <span>*</span>参与门店
          </td>
          <td>
            <el-form-item>
              <el-button name="btnDialogStoreList" type="primary" @click="dialogStoreList = true">选择门店</el-button>
            </el-form-item>
            <div class="p-x-20 m-t-10">
              <el-table :data="form.StoreItem">
                <el-table-column prop="StoreName" label="门店名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="StoreAdd" label="地址" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="100">
                  <template slot-scope="scope">
                    <div>
                      <el-button name="btnStoreItem" type="text" @click="form.StoreItem.splice(scope.$index, 1)">删除</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </td>
        </tr>
        <tr>
          <td>使用说明</td>
          <td>
            <el-form-item>
              <el-input name="inputNote" v-model="form.Note" type="textarea" :autosize="{ minRows: 4, maxRows: 4}" :maxlength="500"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <div class="p-l-20 p-y-10">
              <el-button name="btnSubmit" type="primary" @click="submit">提交</el-button>
              <el-button name="btnBack" @click="$router.go(-1)">取消</el-button>
            </div>
          </td>
        </tr>
      </table>
    </el-form>
    <el-dialog title="选择门店" :visible.sync="dialogStoreList" @open="getStoreList" @close="colseDialogStore" width="70%">
      <el-form :model="formStore" ref="formStore" class="item-lh-26" inline @keyup.enter.native="getStoreList">
        <el-form-item prop="StoreName" label="门店名称">
          <el-input name="inputStoreName" v-model="formStore.StoreName"></el-input>
        </el-form-item>
        <el-form-item prop="area" label="区域" name="formItemArea">
          <el-cascader v-model="formStore.area" :options="areas" @change="areaChange" change-on-select></el-cascader>
        </el-form-item>
        <el-form-item prop="ProvinceId" v-show="false">
          <el-input name="inputProvinceId" v-model="formStore.ProvinceId"></el-input>
        </el-form-item>
        <el-form-item prop="CityId" v-show="false">
          <el-input name="inputCityId" v-model="formStore.CityId"></el-input>
        </el-form-item>
        <el-form-item prop="TownId" v-show="false">
          <el-input name="inputTownId" v-model="formStore.TownId"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button name="btnGetStoreList" type="primary" @click="getStoreList">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="storeList" ref="storeList" v-loading="storeLoading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="StoreName" label="门店名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop label="区域" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.ProvinceName + (scope.row.CityName && '/') + scope.row.CityName + (scope.row.TownName && '/') + scope.row.TownName}}</template>
        </el-table-column>
        <el-table-column prop="Address" label="地址" show-overflow-tooltip></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnSubmitSelectedStores" type="primary" @click="submitSelectedStores">确 定</el-button>
        <el-button name="btnCancel" @click="dialogStoreList = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  MaterialType,
  QueueCashType,
  QueueActivityType,
  QueueGoldType
} from '@/enums/marketing'
import { YNStatus, CharacterType } from '@/enums/common'
import { MERCHANT_API_STORE_BASIC_GETS } from '@/apis/merchant'
import {
  MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_GET,
  MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_CREATE,
  MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_UPDATE
} from '@/apis/marketing'
import { twoDecNumValid, percentValid } from '@/rules/formValidate'
export default {
  data() {
    const cashPriceValid = (rule, value, callback) => {
      if (parseFloat(value) < 1) {
        callback(new Error('输入有误'))
      } else {
        twoDecNumValid(rule, value, callback)
      }
    }
    const scaleValid = (rule, value, callback) => {
      if (parseFloat(value) < 1) {
        callback(new Error('输入有误'))
      } else {
        percentValid(rule, value, callback)
      }
    }
    const qryGramValid = (rule, value, callback) => {
      let flag = /^(?!0(\.0{1,3})?$)(([1-9]\d{0,8})|0)(\.\d{1,3})?$/.test(value)
      if (!flag && value !== '') {
        callback(new Error('输入有误'))
      } else {
        callback()
        if (this.form.ReceiveLimit !== '') {
          this.$refs.form.validateField('ReceiveLimit')
          this.$refs.form.validateField('LimitGram')
        }
      }
    }
    const limitGramValid = (rule, value, callback) => {
      let flag = /^(?!0(\.0{1,3})?$)(([1-9]\d{0,8})|0)(\.\d{1,3})?$/.test(value)
      if (!flag) {
        callback(new Error('输入有误'))
      } else if (parseFloat(value) > parseFloat(this.form.QryGram)) {
        callback(new Error('不能大于已设置的活动黄金总数'))
      } else {
        callback()
        if (this.form.ReceiveLimit !== '') {
          this.$refs.form.validateField('ReceiveLimit')
        }
      }
    }
    const receiveLimitValid = (rule, value, callback) => {
      let flag = /^(?!0(\.0{1,3})?$)(([1-9]\d{0,8})|0)(\.\d{1,3})?$/.test(value)
      if (!flag) {
        callback(new Error('输入有误'))
      } else if (
        // parseFloat(value) > parseFloat(this.form.LimitGram) ||
        parseFloat(value) > parseFloat(this.form.QryGram)
      ) {
        callback(new Error('不能大于已设置的活动黄金总数'))
      } else {
        callback()
      }
    }
    const validityValid = (rule, value, callback) => {
      let flag = /^\d+$/.test(value)
      if (!flag && value !== '') {
        callback(new Error('输入有误'))
      } else if (parseInt(value) < 7) {
        callback(new Error('有效期不能小于 7 天'))
      } else {
        callback()
      }
    }
    return {
      YNStatus,
      MaterialType,
      CharacterType,
      QueueCashType,
      QueueGoldType,
      QueueActivityType,
      noLimitActivityStop: false,
      isLimitGoldWeight: true,
      isLimitValidity: false,
      categoryList: [],
      dialogStoreList: false,
      storeList: [],
      selectedStorelist: [{'StoreId':636352,'CompanyId':40945,'StoreCode':'xc-2','StoreName':'xcmd2','ShortName':'xcmd2','StoreType':3,'CharacterId':124946,'PackId':'9D8D7640-697A-4457-AD0E-0CF450C1FA17','AdministratorId':'xc2','BusinessLicense':'asdsda','OpenTime':'2019-05-14 00:00:00.000000','ImageUrl':'/temp/20190523/Setting/Store/f8409670-d733-459b-8617-87a6da33b4d5.jpg','CSWXUrl':'/default/barcode/{0}.jpg','BusinessType':10,'FlagshipType':'钻石','ProvinceId':130000,'ProvinceName':'河北省','CityId':130200,'CityName':'唐山市','TownId':130203,'TownName':'路北区','Address':'asdad','Contact':'dsfdsf','Mobile':'sdfsdf','Phone':'ddsg','QQ':'','Wechart':'','Email':'','BankName':'','AccountCode':'','Surname':'','WxNote':'','CashierAmount':2,'WxAuthorizerStatus':1,'UniteNote':'xc-2,xcmd2,xcmd2,dsfdsf,ddsg,sdfsdf','CreateUserId':1,'CreateUser':'莫今维','CreateTime':'2019-05-14 09:55:28.110914','LastUserId':282154,'LastUser':'超级管理员','LastTime':'2019-05-23 18:47:04.345970','State':3,'PackName':'多店*生产预配n（勿改）','CompanyCode':'xc','CompanyName':'奥术大师','MountWechat':1,'MountPayment':1,'GroupId':0,'MapType':0,'PackageType':7,'Expireb':'2019-05-22 00:00:00.000000','Expiree':'2019-06-28 00:00:00.000000','Price':20000000}],
      storeLoading: false,
      formLoading: false,
      formStore: {
        OpenTime1: '1900-01-01',
        OpenTime2: '1900-01-01',
        State: 3,
        PageIndex: 1,
        PageSize: 1000,
        StoreName: '',
        ProvinceId: '',
        CityId: '',
        TownId: '',
        area: ['']
      },
      form: {
        CharacterId: 0,
        CharacterType: 0,
        ActivityStart: '',
        ActivityStop: '',
        activityTimeRange: [],
        LimitType: QueueCashType.NotFullPrice,
        CashType: QueueActivityType.ActualPrice,
        CashPrice: '',
        CategoryType: '',
        QryGram: '',
        ActivityType1: QueueActivityType.ActualPrice,
        Scale1: 20,
        LimitGram: '',
        ActivityType2: QueueActivityType.ActualPrice,
        Scale2: 100,
        GoldPrice: '',
        ReceiveLimit: '',
        Validity: 7,
        GoldType: QueueGoldType.TodayGoldPrice,
        Note: '',
        MaterialTypes: [],
        MaterialTypes1: [MaterialType.Goldlion],
        StoreItem: []
      },
      formRules: {
        activityTimeRange: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        ActivityStart: [
          {
            required: true,
            trigger: 'change'
          }
        ],
        CategoryType: [
          {
            required: true,
            message: '请选择领取黄金成色',
            trigger: 'change'
          }
        ],
        MaterialTypes: [
          {
            required: true,
            message: '消费指定材质商品不能为空',
            trigger: 'change'
          }
        ],
        CashPrice: [
          {
            required: false,
            trigger: 'blur'
          },
          {
            validator: cashPriceValid,
            trigger: 'blur'
          }
        ],
        QryGram: [
          {
            required: false,
            trigger: 'blur'
          },
          {
            validator: qryGramValid,
            trigger: 'blur'
          }
        ],
        Scale1: [
          {
            required: true,
            trigger: 'blur'
          },
          {
            validator: scaleValid,
            trigger: 'blur'
          }
        ],
        LimitGram: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            validator: limitGramValid,
            trigger: 'blur'
          }
        ],
        Scale2: [
          {
            required: true,
            trigger: 'blur'
          },
          {
            validator: scaleValid,
            trigger: 'blur'
          }
        ],
        GoldPrice: [
          {
            required: true,
            trigger: 'blur'
          },
          {
            validator: twoDecNumValid,
            trigger: 'blur'
          }
        ],
        ReceiveLimit: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            validator: receiveLimitValid,
            trigger: 'blur'
          }
        ],
        Validity: [
          {
            required: true,
            message: '不能为空',
            trigger: 'blur'
          },
          {
            validator: validityValid,
            trigger: 'blur'
          }
        ]
      },
      pickerOption: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 60 * 60 * 24 * 1000
        }
      }
    }
  },
  computed: {
    areas() {
      return this.$store.getters.areas
    }
  },
  created() {
    this.$store.dispatch('GET_MATERIAL_TYPE')
    this.getEnums()
  },
  methods: {
    init() {
      // 获取详情
      this.formLoading = true
      if (this.$route.params.id) {
        MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_GET({
          QueueId: this.$route.params.id
        })
          .then(res => {
            this.formLoading = false
            if (res.data.Code === 'CORRECT') {
              for (let key in this.form) {
                if (key === 'StoreItem') {
                  this.form[key] = res.data.Data.StoreItem || []
                } else if (
                  key === 'MaterialTypes' ||
                  key === 'MaterialTypes1'
                ) {
                  this.form[key] = res.data.Data.Basic[
                    key[0].toUpperCase() + key.slice(1)
                  ]
                    .split(',')
                    .map(value => parseInt(value))
                } else if (key === 'activityTimeRange') {
                  this.form[key] = []
                } else {
                  this.form[key] =
                    res.data.Data.Basic[key[0].toUpperCase() + key.slice(1)]
                }
              }
              this.$set(this.form, 'QueueId', res.data.Data.Basic.QueueId)
              if (res.data.Data.Basic.ActivityStop.substr(0, 4) === '2100') {
                this.noLimitActivityStop = true
              } else {
                this.form.activityTimeRange = [
                  res.data.Data.Basic.ActivityStart,
                  res.data.Data.Basic.ActivityStop
                ]
              }
              this.isLimitGoldWeight = !res.data.Data.Basic.QryGram
              this.isLimitValidity = !res.data.Data.Basic.Validity
              this.form['CashPrice'] = this.$root.toFloat(this.form['CashPrice'])
              this.form['QryGram'] = this.$root.toFloat(this.form['QryGram'])
              this.form['Scale1'] = this.$root.toFloat(this.form['Scale1'] * 100,1)
              this.form['LimitGram'] = this.$root.toFloat(this.form['LimitGram'],3)
              this.form['Scale2'] = this.$root.toFloat(this.form['Scale2'] * 100,1)
              this.form['GoldPrice'] = this.$root.toFloat(this.form['GoldPrice'])
              this.form['ReceiveLimit'] = this.$root.toFloat(this.form['ReceiveLimit'],3)
              this.limitGoldWeightChange(this.isLimitGoldWeight)
              this.limitValidityChange(this.isLimitValidity)
              this.isLimitExpendPrice(this.form.LimitType)
            }
          })
          .catch(() => {
            this.formLoading = false
          })
      } else {
        this.formLoading = false
      }
    },
    getEnums() {
      this.formLoading = true
      this.form.CharacterId = this.$store.getters.user_session.CharacterId
      this.form.CharacterType = this.$store.getters.user_session.CharacterType
      for (var key in this.$store.getters.materialType.Types) {
        if (parseInt(key) !== MaterialType.Goldlion) {
          this.form.MaterialTypes.push(parseInt(key))
        }
      }
      this.$store
        .dispatch('GET_GOLD_TYPE')
        .then(() => {
          this.categoryList = this.$store.getters.goldType.TypeArray
          this.form.CategoryType = this.categoryList.length && this.categoryList[0].Id || ''
        })
        .then(() => {
          this.init()
        })
      this.$store.dispatch('GET_AREAS_DROPLIST')
    },
    limitActivityStopChange(val) {
      // 是否限制结束时间
      this.form.ActivityStop = val ? '' : this.form.activityTimeRange[1]
    },
    activityTypeChange(val) {
      // 活动金池和顾客领取联动
      this.form.ActivityType1 = val
      this.form.ActivityType2 = val
    },
    limitGoldWeightChange(val) {
      // 是否限制黄金总数
      if (val) {
        this.formRules.QryGram[0].required = false
        this.form.QryGram = ''
      } else {
        this.formRules.QryGram[0].required = true
      }
      this.$refs.form.validateField('QryGram')
    },
    limitValidityChange(val) {
      // 是否限制有效期
      if (val) {
        this.formRules.Validity[0].required = false
        this.form.Validity = ''
      } else {
        this.formRules.Validity[0].required = true
      }
      this.$refs.form.validateField('Validity')
    },
    getStoreList() {
      this.storeLoading = true
      MERCHANT_API_STORE_BASIC_GETS(this.formStore).then(res => {
        this.storeLoading = false
        if (res.data.Code === 'CORRECT') {
          this.storeList = res.data.Data.Rows
          this.$nextTick(()=>{
            this.form.StoreItem.forEach(row=>{
              this.$refs.storeList.toggleRowSelection(this.storeList.find(m=>m.CharacterId==row.CharacterId),true)
            })
          })
        }
      })
    },
    handleSelectionChange(val) {
      this.selectedStorelist = val
    },
    areaChange(area) {
      this.formStore.ProvinceId = area[0]
      this.formStore.CityId = area[1]
      this.formStore.TownId = area[2]
    },
    colseDialogStore() {
      this.$refs.formStore.resetFields()
      this.$refs.storeList.clearSelection()
    },
    submitSelectedStores() {
      if (this.selectedStorelist.length > 0) {
        this.form.StoreItem = this.selectedStorelist.map(item => {
          return {
            CompanyCode: item.CompanyCode,
            CompanyName: item.CompanyName,
            StoreCode: item.StoreCode,
            StoreName: item.StoreName,
            StoreAdd:
              item.ProvinceName + item.CityName + item.TownName + item.Address,
            CharacterId: item.CharacterId
          }
        })
        this.dialogStoreList = false
      } else {
        this.$message.warning('请选择门店')
      }
    },
    activityTimeChange(value) {
      if (value) {
        this.form.ActivityStart = value[0]
        this.form.ActivityStop = value[1]
      } else {
        this.form.ActivityStart = ''
        this.form.ActivityStop = ''
      }
    },
    isLimitExpendPrice(value) {
      if (value === QueueCashType.FullPrice) {
        this.formRules.CashPrice[0].required = true
      } else {
        this.formRules.CashPrice[0].required = false
        this.form.CashPrice = ''
      }
      this.$refs.form.validateField('CashPrice')
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (
            this.form.CharacterType === this.CharacterType.Company 
            && this.form.StoreItem.length === 0
          ) {
            this.$message.warning('请选择参与门店')
            return false
          }
          this.formLoading = true
          let apiName = this.$route.params.id
            ? MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_UPDATE
            : MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_CREATE
          let params = Object.assign({}, this.form)
          params.MaterialTypes = params.MaterialTypes.join(',')
          params.MaterialTypes1 = params.MaterialTypes1.join(',')
          params.GoldPrice = this.$root.toInt(params.GoldPrice)
          params.LimitGram = this.$root.toInt(params.LimitGram)
          params.CashPrice = this.$root.toInt(params.CashPrice)
          params.Scale1 = this.$root.toInt(params.Scale1) / 100
          params.Scale2 = this.$root.toInt(params.Scale2) / 100
          params.ReceiveLimit = this.$root.toInt(params.ReceiveLimit)
          params.Validity = parseInt(params.Validity)
          params.CreateUserId = this.$store.getters.user_session.UserId
          delete params.activityTimeRange
          if (!params.StoreItem || !params.StoreItem.length) {
            delete params.StoreItem
          }
          if (!params.QryGram) {
            delete params.QryGram
          }else{
            params.QryGram = this.$root.toInt(params.QryGram)
          }
          apiName(params)
            .then(res => {
              this.formLoading = false
              if (res.data.Code === 'CORRECT') {
                this.$message.success(res.data.Message || '')
                this.$router.back()
              }
            })
            .catch(() => {
              this.formLoading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.flex-box {
  display: flex;
  align-items: center;
}
.tip-color {
  color: #999;
}
.table {
  width: 100%;
  // border: 1px solid #e5e5e5;
  border-collapse: collapse;
  & > tr {
    & > td {
      padding: 5px 0;
      color: #333;
      border: 1px solid #e5e5e5;

      &:first-child {
        padding: 0 20px;
        text-align: center;
        white-space: nowrap;
        & > span {
          color: #f56c6c;
        }
      }
    }
    & > tr:last-child {
      td {
        border: none;
      }
    }
  }
}
</style>
<style lang="scss">
.create-form {
  .el-form-item.el-form-item--mini {
    margin: 0;
  }
  .el-checkbox-group {
    line-height: 20px;
    .el-checkbox {
      margin-left: 0;
      margin-right: 10px;
      // margin-bottom: 10px;
    }
  }
  .el-form-item__content .el-input-group {
    margin-top: -1px;
  }
  .el-select {
    width: 160px !important;
    .el-input {
      width: 100% !important;
    }
  }
  .el-form-item__error {
    position: relative;
  }
}
</style>

