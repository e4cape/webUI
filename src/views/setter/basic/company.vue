<template>
  <div class="content">
    <el-row v-loading="$store.getters.tb_loading">
      <el-col :span="12">
        <el-form label-position="right" label-width="110px" ref="formName" class="fix-w" :model="form" :rules="rules" show-message>
          <template v-if="$store.getters.user_session.CharacterType == characterType.Company">
            <el-form-item label="公司编码：" class="is-required">
              <el-input name="CompanyCode" v-model="form.CompanyCode" disabled></el-input>
            </el-form-item>
            <el-form-item label="公司名称：" class="is-required">
              <el-input name="CompanyName" v-model="form.CompanyName" disabled></el-input>
            </el-form-item>
          </template>
          <template v-else-if="$store.getters.user_session.CharacterType == characterType.Group">
            <el-form-item label="公司编码：" class="is-required">
              <el-input name="GroupCode" v-model="form.GroupCode" disabled></el-input>
            </el-form-item>
            <el-form-item label="公司名称：" class="is-required">
              <el-input name="GroupName" v-model="form.GroupName" disabled></el-input>
            </el-form-item>
          </template>
          <template v-else-if="$store.getters.user_session.CharacterType == characterType.Supplier">
            <el-form-item label="公司编码：" class="is-required">
              <el-input name="SupplierCode" v-model="form.SupplierCode" disabled></el-input>
            </el-form-item>
            <el-form-item label="公司名称：" class="is-required">
              <el-input name="SupplierName" v-model="form.SupplierName" disabled></el-input>
            </el-form-item>
          </template>
          <el-form-item label="公司简称：" prop="ShortName" class="is-required">
            <el-input name="ShortName" :maxlength="24" @blur="form.ShortName = form.ShortName.trim()" v-model="form.ShortName"></el-input>
          </el-form-item>
          <el-form-item label="所属区域：" prop="AreaData" class="is-required">
            <el-cascader :options="$store.getters.areas" ref="cascader" v-model="form.AreaData" placeholder="选择地区" @change="citiChange"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址：" prop="Address">
            <el-input name="Address" v-model="form.Address" :maxlength="40"></el-input>
          </el-form-item>
          <el-form-item label="营业执照：" prop="BusinessLicense">
            <el-input name="BusinessLicense" v-model="form.BusinessLicense" :maxlength="40"></el-input>
          </el-form-item>
          <el-form-item label="公司电话：" prop="Phone">
            <el-input name="Phone" v-model="form.Phone" :maxlength="40"></el-input>
          </el-form-item>
          <el-form-item label="联系人：" prop="Contact">
            <el-input name="Contact" v-model="form.Contact" :maxlength="40"></el-input>
          </el-form-item>
          <el-form-item label="联系人手机：" prop="Mobile">
            <el-input name="Mobile" v-model="form.Mobile" :maxlength="40"></el-input>
          </el-form-item>
          <el-form-item label="QQ：">
            <el-input name="QQ" v-model="form.QQ" :maxlength="40"></el-input>
          </el-form-item>
          <el-form-item label="微信：">
            <el-input name="Wechart" v-model="form.Wechart" :maxlength="40"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：">
            <el-input name="Email" v-model="form.Email" :maxlength="40"></el-input>
          </el-form-item>
          <el-form-item label="银行账号：">
            <el-input name="AccountCode" v-model="form.AccountCode" :maxlength="40"></el-input>
          </el-form-item>
          <el-form-item label="开户行：">
            <el-input name="BankName" v-model="form.BankName" :maxlength="40"></el-input>
          </el-form-item>
          <el-form-item label="开户人：">
            <el-input name="Surname" v-model="form.Surname" :maxlength="40"></el-input>
          </el-form-item>
          <el-form-item label="公司简介：">
            <el-input name="Introduction" type="textarea" v-model="form.Introduction" :maxlength="400"></el-input>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="12" style="text-align: center;" class="tc">
        <div class="logoImg">
          <img v-if="form.ImageUrl" :src="DOMAIN_IMG_FILE + form.ImageUrl.replace('{0}', '1080x0')" style="width: 240px;">
        </div>
        <uploadImgByBtn :uploadImageUrl="form.ImageUrl" :Root="SETTING_COMPANY" @uploadSucc="(url) => {this.form.ImageUrl = url}" :type="'primary'">
          <slot>上传公司logo</slot>
        </uploadImgByBtn>
        <p class="fontred" style="color: red;line-height: 30px;">为保证整体视觉效果，请建议上传透明底的PNG格式logo，尺寸为240px120px，大小为2MB</p>

        <template v-if="$store.getters.user_session.MountWechat == companyBasicMountType.Company">
          <div class="logoImg">
            <img v-if="form.CSWXUrl" :src="DOMAIN_IMG_FILE + form.CSWXUrl.replace('{0}', '300x300')" style="width: 190px;">
          </div>
          <uploadImgByBtn :uploadImageUrl="form.CSWXUrl" :Root="SETTING_COMPANY" @uploadSucc="(url) => {this.form.CSWXUrl = url}" :type="'primary'">
            <slot>上传客服二维码</slot>
          </uploadImgByBtn>
        </template>
      </el-col>
    </el-row>

    <div class="buttons" style="margin-left: 110px;">
      <el-button name="save" type="primary" @click="editData($event)" :loading="$store.getters.is_loading">保存</el-button>
    </div>
  </div>
</template>

<script>
import { DOMAIN_IMG_FILE } from '@/configs/appSettings.js'
import { SETTING_COMPANY } from '@/configs/filePaths.js'
import companyRules from '@/rules/setter/company.js'
import { CharacterType } from '@/enums/common'
import { StorePackageType } from '@/enums/marketing'
import {
  CompanyBasicMountType,
  StoreBasicBusinessType,
  StoreBasicFlagshipType
} from '@/enums/merchant'
import {
  MERCHANT_API_DROPDOWN_PACKBASICLIST,
  MERCHANT_API_COMPANY_BASIC_DETAIL,
  MERCHANT_API_COMPANY_BASIC_UPDATEINFO,
  MERCHANT_API_GROUP_BASIC_DETAIL,
  MERCHANT_API_GROUP_BASIC_UPDATEINFO,
  MERCHANT_API_SUPPLIER_BASIC_DETAIL,
  MERCHANT_API_SUPPLIER_BASIC_UPDATEINFO
} from '@/apis/merchant'

import uploadImgByBtn from '@/components/common/uploadImgByBtn.vue'
export default {
  data() {
    return {
      DOMAIN_IMG_FILE,
      SETTING_COMPANY,
      companyBasicMountType: CompanyBasicMountType,
      characterType: CharacterType,
      storePackageType: StorePackageType,
      btnLoading: false,
      serviceBtnLoading: false,
      radio: '零售',
      form: {
        FlagshipType: [],
        AreaData: [],
        PackId: '',
        Address: '',
        BusinessLicense: '',
        Phone: '',
        Contact: '',
        ShortName: '',
        Mobile: ''
      },
      rules: {}, // 接收表单验证的规则
      packBasicList: [],
      storeBasicBusinessType: StoreBasicBusinessType,
      storeBasicFlagshipType: StoreBasicFlagshipType
    }
  },
  components: {
    uploadImgByBtn
  },
  methods: {
    // 获取类型/套餐数据
    getPackList() {
      MERCHANT_API_DROPDOWN_PACKBASICLIST({
        CharacterType: this.$store.getters.user_session.CharacterType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.packBasicList = res.data.Data.Rows
        }
      })
    },
    getStoreData() {
      // 获取门店信息
      this.$store.commit('SET_TB_LOADING', true)
      let api =
        this.$store.getters.user_session.CharacterType == CharacterType.Company
          ? MERCHANT_API_COMPANY_BASIC_DETAIL
          : this.$store.getters.user_session.CharacterType ==
            CharacterType.Group
            ? MERCHANT_API_GROUP_BASIC_DETAIL
            : MERCHANT_API_SUPPLIER_BASIC_DETAIL
      api().then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.form = Object.assign({}, this.form, res.data.Data)
          if (
            this.$store.getters.user_session.CharacterType ==
            CharacterType.Store
          ) {
            this.form.FlagshipType =
              res.data.Data.FlagshipType === ''
                ? []
                : res.data.Data.FlagshipType.split(',')
            this.radio = this.storeBasicBusinessType.Types[
              res.data.Data.BusinessType
            ]
          }
          this.form.OpenTime =
            this.form.OpenTime === '' ? '' : new Date(this.form.OpenTime)
          if (this.form.ProvinceId || this.form.CityId || this.form.TownId) {
            // 解决地区必选无法验证的问题
            this.$set(this.form, 'AreaData', [
              this.form.ProvinceId + '',
              this.form.CityId + '',
              this.form.TownId + ''
            ])
          } else {
            this.$set(this.form, 'AreaData', [])
          }
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    editData(e) {
      e.currentTarget.blur()
      this.$refs['formName'].validate(valid => {
        if (!this.form.AreaData.length) {
          this.$message.error('请输入地区')
        } else if (valid) {
          this.updateData()
        } else {
          this.$message.error('请完善信息')
        }
      })
    },
    updateData() {
      // 保存门店信息
      this.$confirm('是否保存修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var FlagshipType = this.form.FlagshipType.join(',')
          var param = Object.assign({}, this.form, {
            FlagshipType
          })
          param.ProvinceId = Number(this.form.AreaData[0])
          param.CityId = Number(this.form.AreaData[1])
          param.TownId = Number(this.form.AreaData[2])
          var list = Object.assign({}, this.storeBasicBusinessType.Types)
          for (var o in list) {
            if (list[o] === this.radio + '') {
              param.BusinessType = o - 0
            }
          }
          this.$store.commit('SET_BTN_LOADING', true)
          let api =
            this.$store.getters.user_session.CharacterType ==
              CharacterType.Company
              ? MERCHANT_API_COMPANY_BASIC_UPDATEINFO
              : this.$store.getters.user_session.CharacterType == CharacterType.Group
                ? MERCHANT_API_GROUP_BASIC_UPDATEINFO
                : MERCHANT_API_SUPPLIER_BASIC_UPDATEINFO
          api(param).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.getStoreData()
            } else {
              this.$message.error(res.data.Message)
              this.form.OpenTime = new Date(this.form.OpenTime)
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已经取消保存'
          })
        })
    },
    // 选择省市区后执行将cityname赋值给form
    citiChange() {
      var cityName = this.$refs.cascader.currentLabels
      this.form.ProvinceName = cityName[0]
      this.form.CityName = cityName[1]
      this.form.TownName = cityName[2]
    }
  },
  beforeMount() {
    this.rules = companyRules
  },
  mounted() {
    this.$store.dispatch('GET_AREAS_DROPLIST')
    this.getStoreData()
    this.getPackList()
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
