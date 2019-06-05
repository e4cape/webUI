<template>
  <div class="content">
    <el-row>
      <el-col :span="12">
        <el-form
          label-position="right"
          label-width="113px"
          :model="form"
          :rules="rules"
          ref="createForm"
          show-message
          class="fix-w"
        >
          <el-form-item
            label="公司编码："
            prop="CompanyCode"
          >
            <el-input
              name="CompanyCode"
              v-model="form.CompanyCode"
              @blur="form.CompanyCode=form.CompanyCode.trim()"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="公司名称："
            prop="CompanyName"
          >
            <el-input
              name="CompanyName"
              v-model="form.CompanyName"
              @blur="form.CompanyName=form.CompanyName.trim()"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="公司简称："
            prop="ShortName"
            class="is-required"
          >
            <el-input
              name="ShortName"
              v-model="form.ShortName"
              @blur="form.ShortName=form.ShortName.trim()"
              :maxlength="24"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="管理员账号："
            prop="AdministratorId"
          >
            <el-input
              name="LoginId"
              v-model="form.AdministratorId"
              @blur="form.AdministratorId=form.AdministratorId.trim()"
              class="short"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="初始密码："
            prop="Password"
          >
            <el-input
              name="Password"
              type="password"
              v-model="form.Password"
              @blur="form.Password=form.Password.trim()"
              class="short"
              :maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="微信管理："
            prop="WechatSettingType"
          >
            <el-radio-group
              name="WechatSettingType"
              class="radio-group-dialog"
              v-model="form.WechatSettingType"
            >
              <el-radio :label="companyBasicMountType.Store">在门店设置</el-radio>
              <el-radio :label="companyBasicMountType.Company">在总部统一设置</el-radio>
              <span>（所有门店使用同一个公众号）</span>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="支付授权："
            prop="WechatSettingType"
          >
            <el-radio-group
              name="WechatSettingType"
              class="radio-group-dialog"
              v-model="form.WechatSettingType"
            >
              <el-radio :label="companyBasicMountType.Store">在门店设置</el-radio>
              <el-radio :label="companyBasicMountType.Company">在总部统一设置</el-radio>
              <span>（所有门店使用同一个支付接口）</span>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="类型/套餐："
            prop="PackId"
            class="is-required"
          >
            <el-select
              name="PackId"
              v-model="form.PackId"
              filterable
            >
              <template v-for="item in packBasicList">
                <el-option
                  v-if="
              (form.WechatSettingType == companyBasicMountType.Store && item.MultiType == securityPackBasicMultiType.One ) ||  (form.WechatSettingType == companyBasicMountType.Company && item.MultiType == securityPackBasicMultiType.More )"
                  :key="item.Id"
                  :label="item.Value"
                  :value="item.Id"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item
            label="所属区域："
            prop="AreaData"
            class="is-required"
          >
            <el-cascader
              filterable
              :options="$store.getters.areas"
              ref="cascader"
              v-model="form.AreaData"
              placeholder="选择地区"
              @change="citiChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            label="详细地址："
            prop="Address"
          >
            <el-input
              name="Address"
              v-model="form.Address"
              @blur="form.Address=form.Address.trim()"
              :maxlength="150"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="营业执照："
            prop="BusinessLicense"
          >
            <el-input
              name="BusinessLicense"
              v-model="form.BusinessLicense"
              @blur="form.BusinessLicense=form.BusinessLicense.trim()"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="公司电话："
            prop="Phone"
          >
            <el-input
              name="Phone"
              v-model="form.Phone"
              @blur="form.Phone=form.Phone.trim()"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="联系人："
            prop="Contact"
          >
            <el-input
              name="Contact"
              v-model="form.Contact"
              @blur="form.Contact=form.Contact.trim()"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="联系人手机："
            prop="Mobile"
          >
            <el-input
              name="Mobile"
              v-model="form.Mobile"
              @blur="form.Mobile=form.Mobile.trim()"
              :maxlength="11"
            ></el-input>
          </el-form-item>
          <el-form-item label="QQ：">
            <el-input
              name="QQ"
              v-model="form.QQ"
              :maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="微信：">
            <el-input
              name="Wechart"
              v-model="form.Wechart"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱：">
            <el-input
              name="Email"
              v-model="form.Email"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="银行账号：">
            <el-input
              name="AccountCode"
              v-model="form.AccountCode"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="开户行：">
            <el-input
              name="BankName"
              v-model="form.BankName"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="开户人：">
            <el-input
              name="Surname"
              v-model="form.Surname"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label="公司简介：">
            <el-input
              name="Introduction"
              type="textarea"
              v-model="form.Introduction"
              :maxlength="150"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col
        :span="12"
        style="text-align: center;"
        class="tc"
      >
        <div class="logoImg">
          <img
            v-if="form.ImageUrl"
            :src="DOMAIN_IMG_FILE + form.ImageUrl"
            style="width: 240px;"
          >
        </div>
        <uploadImgByBtn
          :uploadImageUrl="form.ImageUrl"
          :Root="SETTING_COMPANY"
          @uploadSucc="(url) => {this.form.ImageUrl = url}"
          :type="'primary'"
        >
          <slot>上传公司logo</slot>
        </uploadImgByBtn>

        <p
          class="fontred"
          style="color: red;line-height: 30px;"
        >为保证整体视觉效果，请建议上传透明底的PNG格式logo，尺寸为240px120px，大小为2MB</p>

        <template v-if="form.wechatSettingType == companyBasicMountType.Company">
          <div class="logoImg">
            <img
              v-if="form.CSWXUrl"
              :src="DOMAIN_IMG_FILE + form.CSWXUrl"
              style="width: 190px;"
            >
          </div>

          <uploadImgByBtn
            :uploadImageUrl="form.CSWXUrl"
            :Root="SETTING_COMPANY"
            @uploadSucc="(url) => {this.form.CSWXUrl = url}"
            :type="'primary'"
          >
            <slot>上传客服二维码</slot>
          </uploadImgByBtn>
        </template>
      </el-col>
    </el-row>
    <div class="buttons">
      <el-button
        name="createCompany"
        type="primary"
        @click="createCompany"
        :loading="$store.getters.is_loading"
      >保存</el-button>
    </div>
  </div>
</template>

<script>
import { DOMAIN_IMG_FILE } from '@/configs/appSettings.js'
import { SETTING_COMPANY } from '@/configs/filePaths.js'
import {
  CompanyBasicSourceType,
  CompanyBasicMountType,
  SecurityPackBasicMultiType
} from '@/enums/merchant'
import { YNStatus, CharacterType } from '@/enums/common.js'
import storeRules from '@/rules/setter/company.js'
import {
  MERCHANT_API_COMPANY_BASIC_CREATE,
  MERCHANT_API_DROPDOWN_PACKBASICLIST
} from '@/apis/merchant'

import uploadImgByBtn from '@/components/common/uploadImgByBtn.vue'
export default {
  data() {
    return {
      DOMAIN_IMG_FILE,
      SETTING_COMPANY,
      companyBasicMountType: CompanyBasicMountType,
      securityPackBasicMultiType: SecurityPackBasicMultiType,
      packBasicList: [],
      serviceBtnLoading: false,
      logoImgwx: '', // 二维码展示图片
      form: {
        // 接收表单里面的参数
        CompanyCode: '',
        CompanyName: '',
        ShortName: '',
        PackId: '',
        CSWXUrl: '',
        WechatSettingType: '',
        MountPayment: '',
        MountWechat: '',
        SourceType:
          this.$store.getters.user_session.CharacterType === CharacterType.Group
            ? CompanyBasicSourceType.Group
            : CompanyBasicSourceType.Lcb,
        BusinessLicense: '',
        ImageUrl: '/default/store/240x120.jpg',
        BusinessType: '10',
        ProvinceId: '',
        ProvinceName: '',
        CityId: '',
        CityName: '',
        TownId: '',
        TownName: '',
        Address: '',
        Contact: '',
        Mobile: '',
        Phone: '',
        QQ: '',
        Wechart: '',
        Email: '',
        BankName: '',
        AccountCode: '',
        Surname: '',
        Introduction: '',
        CreateUserId: '',
        CreateUser: '',
        AdministratorId: '',
        Password: '',
        AreaData: []
      },
      rules: {} // 接收表单验证的规则
    }
  },
  methods: {
    // 选择城市
    citiChange() {
      // 选择省市区后执行将cityname赋值给form
      var cityName = this.$refs.cascader.currentLabels
      this.form.ProvinceName = cityName[0]
      this.form.CityName = cityName[1]
      this.form.TownName = cityName[2]
    },
    getPackBasicList() {
      MERCHANT_API_DROPDOWN_PACKBASICLIST({
        CharacterType: CharacterType.Company
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.packBasicList = res.data.Data.Rows
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    // 新建公司
    createCompany() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          const { WechatSettingType, AreaData } = this.form
          if (this.form.CompanyCode.indexOf('@') > -1) {
            this.$message.error('新建公司，公司编码不能包含@符号')
            return
          }
          this.$store.commit('SET_BTN_LOADING', true)
          MERCHANT_API_COMPANY_BASIC_CREATE(
            Object.assign(this.form, {
              MountPayment: WechatSettingType,
              MountWechat: WechatSettingType,
              PaymentSettingType: WechatSettingType,
              ProvinceId: +AreaData[0],
              CityId: +AreaData[1],
              TownId: +AreaData[2]
            })
          ).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$router.push('/setter/company/index')
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    selectPack() {
      let PackId = ''
      this.packBasicList.forEach(item => {
        if (item.IsDefault == YNStatus.Yes) {
          if (
            (this.form.WechatSettingType == this.companyBasicMountType.Store &&
              item.MultiType == SecurityPackBasicMultiType.One) ||
            (this.form.WechatSettingType ==
              this.companyBasicMountType.Company &&
              item.MultiType == SecurityPackBasicMultiType.More)
          ) {
            PackId = item.Id
          }
        }
      })
      this.form.PackId = PackId
      this.$refs.createForm.validateField('PackId')
    }
  },
  created() {
    this.rules = storeRules
  },
  beforeMount() {
    this.$store.dispatch('GET_AREAS_DROPLIST')
    this.getPackBasicList()
  },
  watch: {
    'form.WechatSettingType': 'selectPack'
  },
  components: {
    uploadImgByBtn
  }
}
</script>

<style lang="scss">
.fontred {
  line-height: 30px;
  color: #9e9e9e;
}
.logoImg {
  margin-top: 40px;
}
</style>
