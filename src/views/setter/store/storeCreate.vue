<template>
  <div class="content">
    <el-row>
      <el-col :span="14">
        <el-form label-position="right" label-width="113px" :model="form" :rules="rules" ref="createForm" show-message class="fix-w">
          <el-form-item label="归属公司：" prop="CompanyId" v-if="$store.getters.user_session.CharacterType != characterType.Company">
            <el-select name="CompanyId" v-model="form.CompanyId" filterable disabled>
              <template v-for="item in $store.getters.company_and_stores">
                <el-option v-if="item.CharacterId != 0" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="门店名称：" prop="StoreName">
            <el-input name="StoreName" v-model="form.StoreName" @blur="form.StoreName=form.StoreName.trim()" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="门店简称：" prop="ShortName" class="is-required">
            <el-input name="ShortName" v-model="form.ShortName" @blur="form.ShortName=form.ShortName.trim()" :maxlength="24"></el-input>
          </el-form-item>
          <el-form-item label="门店类型：" prop="StoreType">
            <el-radio-group name="StoreType" v-model="form.StoreType" class="init-margin">
              <el-radio v-for="(item,index) in storeType.Types" :key="index" :label="index">{{item}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="PartnerId" v-if="form.StoreType > storeType.Direct" label="所属加盟商：">
            <el-select name="PartnerId" v-model="form.PartnerId" filterable>
              <template v-for="(item, index) in $store.getters.suppliers">
                <el-option :key="index" :label="item.Value" :value="item.Id"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="类型/套餐：" class="is-required">
            <el-select name="PackId" v-model="form.PackId" filterable>
              <template v-for="(item, index) in packBasicList">
                <el-option :key="index" v-if="item.MultiType == multiType" :label="item.Value" :value="item.Id"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="系统版本：" class="is-required">
            <el-radio-group name="PackageType" v-model="form.PackageType" class="init-margin">
              <el-radio disabled :label="storePackageType.Flow">
                <span>{{storePackageType.Types[storePackageType.Flow]}}</span>
              </el-radio>
              <el-radio :label="storePackageType.Date">
                <span class="m-r-5">{{storePackageType.Types[storePackageType.Date]}}</span>
                <template v-if="form.PackageType == storePackageType.Date">
                  <el-date-picker type="daterange" style="width: 200px!important;" start-placeholder="开始时间" end-placeholder="结束时间" v-model="form.sysPackTime" :picker-options="pickerOptions"></el-date-picker>
                  <span class="m-r-5 m-l-5">金额</span>
                  <el-input v-model="form.Price" @keyup.native="form.Price = $root.toFixed(form.Price, 0)" style="width: 60px!important;" :maxlength="10"></el-input>
                </template>
              </el-radio>
              <el-radio :label="storePackageType.Try">
                <span>{{storePackageType.Types[storePackageType.Try]}}</span>
                <el-date-picker
                  class="m-l-5"
                  v-if="form.PackageType == storePackageType.Try"
                  type="daterange"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  v-model="form.sysPackTime"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-radio>
              <el-radio :label="storePackageType.Free">{{storePackageType.Types[storePackageType.Free]}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="开店时间：" prop="OpenTime">
            <el-date-picker name="OpenTime" format="yyyy-MM-dd" type="date" placeholder="选择时间" v-model="form.OpenTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="管理员账户：" prop="AdministratorId">
            <el-input name="AdministratorId" v-model="form.AdministratorId" @blur="form.AdministratorId=form.AdministratorId.trim()" class="short" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="初始密码：" prop="Password">
            <el-input name="Password" type="password" v-model="form.Password" @blur="form.Password=form.Password.trim()" class="short" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="所属区域：" prop="AreaData" class="is-required">
            <el-cascader name="AreaData" filterable :options="$store.getters.areas" ref="cascader" v-model="form.AreaData" placeholder="选择地区" @change="citiChange"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址：" prop="Address">
            <el-input name="Address" v-model="form.Address" @blur="form.Address=form.Address.trim()" :maxlength="150"></el-input>
          </el-form-item>
          <el-form-item label="营业执照：" prop="BusinessLicense">
            <el-input name="BusinessLicense" v-model="form.BusinessLicense" @blur="form.BusinessLicense=form.BusinessLicense.trim()" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="主营品类：" prop="FlagshipType">
            <el-checkbox-group name="FlagshipType" v-model="form.FlagshipType">
              <el-checkbox v-for="(item,index) in storeBasicFlagshipType.Types" :key="index" :label="item"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="销售方式：">
            <el-radio-group name="BusinessType" v-model="form.BusinessType" class="init-margin">
              <el-radio v-for="(item,index) in storeBasicBusinessType.Types" :key="index" :label="index">{{item}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="门店电话：" prop="Phone">
            <el-input name="Phone" v-model="form.Phone" @blur="form.Phone=form.Phone.trim()" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="联系人：" prop="Contact">
            <el-input name="Contact" v-model="form.Contact" @blur="form.Contact=form.Contact.trim()" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="联系人手机：" prop="Mobile">
            <el-input name="Mobile" v-model="form.Mobile" @blur="form.Mobile=form.Mobile.trim()" :maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="QQ：">
            <el-input name="QQ" v-model="form.QQ" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="微信：">
            <el-input name="Wechart" v-model="form.Wechart" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：">
            <el-input name="Email" v-model="form.Email" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="银行账号：">
            <el-input name="AccountCode" v-model="form.AccountCode" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="开户行：">
            <el-input name="BankName" v-model="form.BankName" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="开户人：">
            <el-input name="Surname" v-model="form.Surname" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="门店简介：">
            <el-input name="WxNote" type="textarea" v-model="form.WxNote" :maxlength="150"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="10" style="text-align: center;">
        <div class="logoImg">
          <img v-if="form.ImageUrl" :src="DOMAIN_IMG_FILE + form.ImageUrl" width="240" height="120" class="m-b-10">
        </div>
        <uploadImgByBtn :uploadImageUrl="form.ImageUrl" :Root="SETTING_STORE" @uploadSucc="(url) => {this.form.ImageUrl = url}" :type="'primary'">
          <slot>上传门店logo</slot>
        </uploadImgByBtn>

        <p class="fontred" style="color: red;line-height: 30px;">为保证整体视觉效果，请建议上传透明底的PNG格式logo，尺寸为240px120px，大小为2MB</p>
        <template v-if="multiType == companyBasicMountType.Store">
          <div class="logoImg">
            <img v-if="form.CSWXUrl" :src="DOMAIN_IMG_FILE + form.CSWXUrl" width="200">
          </div>

          <uploadImgByBtn :uploadImageUrl="form.CSWXUrl" :Root="SETTING_STORE" @uploadSucc="(url) => {this.form.CSWXUrl = url}" :type="'primary'">
            <slot>上传客服二维码</slot>
          </uploadImgByBtn>
        </template>
      </el-col>
    </el-row>
    <div class="buttons">
      <el-button name="save" type="primary" @click="createStore" :loading="$store.getters.is_loading">保存</el-button>
    </div>
  </div>
</template>

<script>
import { DOMAIN_IMG_FILE } from '@/configs/appSettings.js'
import { SETTING_STORE } from '@/configs/filePaths.js'
import { CharacterType, YNStatus, StoreType, PartnerType } from '@/enums/common'
import { StorePackageType } from '@/enums/marketing'
import {
  StoreBasicBusinessType,
  StoreBasicFlagshipType,
  SecurityPackBasicMultiType,
  CompanyBasicMountType
} from '@/enums/merchant'
import {
  MERCHANT_API_STORE_BASIC_CREATE, // 门店基本资料 - 创建
  MERCHANT_API_DROPDOWN_PACKBASICLIST // 套餐 - 列表(下拉)
} from '@/apis/merchant'
import storeRules from '@/rules/setter/store'
import dayjs from 'dayjs'

import uploadImgByBtn from '@/components/common/uploadImgByBtn.vue'
export default {
  data () {
    return {
      YNStatus,
      DOMAIN_IMG_FILE,
      SETTING_STORE,
      storeType: StoreType,
      characterType: CharacterType,
      companyBasicMountType: CompanyBasicMountType,
      securityPackBasicMultiType: SecurityPackBasicMultiType,
      storePackageType: StorePackageType,
      storeBasicBusinessType: StoreBasicBusinessType, // 销售方式
      storeBasicFlagshipType: StoreBasicFlagshipType, // 主营品类
      storeId: '',
      multiType: '',
      packBasicList: [],
      form: {
        // 接收表单里面的参数
        PartnerId: '',
        StoreType: '',
        PackId: '',
        PackageType: '',
        Price: '',
        StoreName: '',
        ShortName: '',
        BusinessLicense: '',
        OpenTime: '',
        ImageUrl: '/default/store/240x120.jpg',
        CSWXUrl: '',
        BusinessType: '10',
        FlagshipType: [],
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
        WxNote: '',
        AdministratorId: '',
        Password: '',
        sysPackTime: [],
        AreaData: []
      },
      pickerOptions: {
        disabledDate (date) {
          let now = new Date()
          return (
            Date.parse(date) <
            Date.parse(
              now.getFullYear() +
              '/' +
              (now.getMonth() + 1) +
              '/' +
              now.getDate()
            )
          )
        }
      },
      rules: {} // 接收表单验证的规则
    }
  },
  components: {
    uploadImgByBtn
  },
  methods: {
    getPackBasicList () {
      MERCHANT_API_DROPDOWN_PACKBASICLIST({
        CharacterType: CharacterType.Store
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.packBasicList = res.data.Data.Rows
          res.data.Data &&
            res.data.Data.Rows.forEach(item => {
              if (
                item.IsDefault === YNStatus.Yes &&
                item.MultiType == this.multiType
              ) {
                this.form.PackId = item.Id
              }
            })
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    // 上传图片校验
    beforeAvatarUpload (file) {
      this.btnLoading = true
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        this.btnLoading = false
        return false
      }
      if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) === -1) {
        this.$message.error('请上传正确文件')
        this.btnLoading = false
        return false
      }
    },
    // 选择城市
    citiChange () {
      // 选择省市区后执行将cityname赋值给form
      var cityName = this.$refs.cascader.currentLabels
      this.form.ProvinceName = cityName[0]
      this.form.CityName = cityName[1]
      this.form.TownName = cityName[2]
    },
    // 新建门店
    createStore () {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          if (!this.form.PackageType) {
            this.$message.error('请选择系统版本')
            return false
          } else if (
            (this.form.PackageType == StorePackageType.Date ||
              this.form.PackageType == StorePackageType.Try) &&
            (!this.form.sysPackTime || !this.form.sysPackTime.length)
          ) {
            this.$message.error('请选择版本时间')
            return false
          } else if (
            this.form.PackageType == StorePackageType.Date &&
            (parseInt(this.form.Price) <= 0 || !this.form.Price)
          ) {
            this.$message.error('请输入按期付费金额')
            return false
          }
          let time1 = this.form.sysPackTime[0]
            ? new Date(
              Date.parse(this.form.sysPackTime[0]) + 1000 * 60 * 60 * 8
            )
              .toJSON()
              .replace('T', ' ')
              .replace('.000Z', '')
            : '1900-01-01'
          let time2 = this.form.sysPackTime[0]
            ? new Date(
              Date.parse(this.form.sysPackTime[1]) + 1000 * 60 * 60 * 8
            )
              .toJSON()
              .replace('T', ' ')
              .replace('.000Z', '')
            : '1900-01-01'
          this.$store.commit('SET_BTN_LOADING', true)
          let openTime = this.form.OpenTime
            ? dayjs(new Date(this.form.OpenTime)).format('YYYY-MM-DD HH:mm:ss')
            : ''
          MERCHANT_API_STORE_BASIC_CREATE({
            PackageType: this.form.PackageType,
            Expireb: time1,
            Expiree: time2,
            Price: this.$root.toInt(this.form.Price - 0),
            CompanyId: this.form.CompanyId - 0,
            PackId: this.form.PackId,
            StoreType: this.form.StoreType - 0,
            PartnerId: this.form.PartnerId - 0,
            StoreName: this.form.StoreName,
            ShortName: this.form.ShortName,
            OpenTime: openTime,
            AdministratorId: this.form.AdministratorId,
            Password: this.form.Password,
            ImageUrl: this.form.ImageUrl,
            CSWXUrl: this.form.ImageUrlwx,
            BusinessLicense: this.form.BusinessLicense,
            BusinessType: this.form.BusinessType - 0,
            FlagshipType: this.form.FlagshipType.join(','),
            ProvinceId: this.form.AreaData[0] - 0,
            ProvinceName: this.form.ProvinceName,
            CityId: this.form.AreaData[1] - 0,
            CityName: this.form.CityName,
            TownId: this.form.AreaData[2] - 0,
            TownName: this.form.TownName,
            Address: this.form.Address,
            Contact: this.form.Contact,
            Mobile: this.form.Mobile,
            Phone: this.form.Phone,
            Email: this.form.Email,
            QQ: this.form.QQ,
            Wechart: this.form.Wechart,
            BankName: this.form.BankName,
            AccountCode: this.form.AccountCode,
            Surname: this.form.Surname,
            WxNote: this.form.WxNote
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              // this.$message.success(res.data.Message)
              this.$message.success('新建门店成功')
              this.$router.push({
                path: '/setter/store/index'
              })
            } else {
              this.$message.error(res.data.Message)
              // this.form.OpenTime = new Date(this.form.OpenTime)
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    marketChange () {
      this.form.Price = ''
      this.form.sysPackTime = []
    }
  },
  created () {
    this.rules = storeRules
  },
  beforeMount () {
    this.$store.dispatch('GET_SUPPLIERS_DROPLIST', {
      PartnerType: PartnerType.Franchiser,
      State: YNStatus.Yes,
      CharacterId: Number(this.$route.query.characterId)
    })
    this.getPackBasicList()
    this.$store.dispatch('GET_AREAS_DROPLIST')
    this.$store.getters.user_session.CharacterType == CharacterType.Lingcb &&
      this.$store.dispatch('GET_COMPANYS_DROPLIST')
  },
  mounted () {
    this.$set(this.form, 'CompanyId', +this.$route.query.id)
    this.multiType =
      this.$route.query.type - 0 > 0
        ? this.$route.query.type == this.companyBasicMountType.Company
          ? this.securityPackBasicMultiType.More
          : this.securityPackBasicMultiType.One
        : this.$route.query.type
  },
  watch: {
    'form.PackageType': 'marketChange'
  }
}
</script>
<style lang="scss" scoped>
.el-checkbox {
  margin-right: 10px;
}
.fontred {
  line-height: 30px;
  color: #9e9e9e;
}
.init-margin /deep/ .el-radio + .el-radio {
  margin-left: 10px;
}
.logoImg {
  margin-top: 40px;
}
</style>
