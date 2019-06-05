<template>
  <div class="content">
    <el-row v-loading.body="$store.getters.tb_loading">
      <el-col :span="12">
        <el-form
          label-position="right"
          label-width="110px"
          ref="formName"
          class="fix-w"
          :model="form"
          :rules="rules"
          show-message
        >
          <el-form-item label="门店编码：">
            <el-input
              name="StoreCode"
              v-model="form.StoreCode"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item
            label="门店名称："
            prop="StoreName"
          >
            <el-input
              name="StoreName"
              :disabled="$store.getters.user_session.CharacterType != characterType.Store"
              v-model="form.StoreName"
              :maxlength="17"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="门店简称："
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
            label="开店日期："
            prop="OpenTime"
          >
            <el-col :span="24">
              <el-date-picker
                disabled
                name="datePicker"
                :editable="false"
                type="date"
                :picker-options="$root.datePickerOptions"
                placeholder="选择日期"
                v-model="form.OpenTime"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item
            label="所属区域："
            prop="AreaData"
            class="is-required"
          >
            <el-cascader
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
              :maxlength="40"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="营业执照："
            prop="BusinessLicense"
          >
            <el-input
              name="BusinessLicense"
              v-model="form.BusinessLicense"
              :maxlength="40"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="主营品类："
            prop="FlagshipType"
          >
            <el-checkbox-group
              name="FlagshipType"
              v-model="form.FlagshipType"
            >
              <el-checkbox
                v-for="(item,index) in storeBasicFlagshipType.Types"
                :label="item"
                :name="index"
                :key="index"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="销售方式：">
            <el-radio-group
              name="storeBasicBusinessType"
              v-model="radio"
            >
              <el-radio
                v-for="(item,index) in storeBasicBusinessType.Types"
                :label="item"
                :name="index"
                :key="index"
              ></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="门店电话："
            prop="Phone"
          >
            <el-input
              name="Phone"
              v-model="form.Phone"
              :maxlength="40"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="联系人："
            prop="Contact"
          >
            <el-input
              name="Contact"
              v-model="form.Contact"
              :maxlength="40"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="联系人手机："
            prop="Mobile"
          >
            <el-input
              name="Mobile"
              v-model="form.Mobile"
              :maxlength="40"
            ></el-input>
          </el-form-item>
          <el-form-item label="QQ：">
            <el-input
              name="QQ"
              v-model="form.QQ"
              :maxlength="40"
            ></el-input>
          </el-form-item>
          <el-form-item label="微信：">
            <el-input
              name="Wechart"
              v-model="form.Wechart"
              :maxlength="40"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱：">
            <el-input
              name="Email"
              v-model="form.Email"
              :maxlength="40"
            ></el-input>
          </el-form-item>
          <el-form-item label="银行账号：">
            <el-input
              name="AccountCode"
              v-model="form.AccountCode"
              :maxlength="40"
            ></el-input>
          </el-form-item>
          <el-form-item label="开户行：">
            <el-input
              name="BankName"
              v-model="form.BankName"
              :maxlength="40"
            ></el-input>
          </el-form-item>
          <el-form-item label="开户人：">
            <el-input
              name="Surname"
              v-model="form.Surname"
              :maxlength="40"
            ></el-input>
          </el-form-item>
          <el-form-item label="门店简介：">
            <el-input
              name="WxNote"
              type="textarea"
              v-model="form.WxNote"
              :maxlength="400"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col
        :span="12"
        style="text-align: center;"
      >
        <div class="logoImg">
          <img
            v-if="form.ImageUrl"
            :src="DOMAIN_IMG_FILE + form.ImageUrl.replace('{0}', '1080x0')"
            style="width: 240px;"
          >
        </div>
        <uploadImgByBtn
          :uploadImageUrl="form.ImageUrl"
          :Root="SETTING_STORE"
          @uploadSucc="(url) => {this.form.ImageUrl = url}"
          :type="'primary'"
        >
          <slot>上传门店logo</slot>
        </uploadImgByBtn>

        <p
          class="fontred"
          style="color: red;line-height: 30px;"
        >为保证整体视觉效果，请建议上传透明底的PNG格式logo，尺寸为240px120px，大小为2MB</p>

        <template v-if="$store.getters.wechatSettingType == companyBasicMountType.Store">
          <div class="logoImg">
            <img
              v-if="form.CSWXUrl"
              :src="DOMAIN_IMG_FILE + form.CSWXUrl.replace('{0}', '300x300')"
              style="width: 190px;"
            >
          </div>
          <uploadImgByBtn
            :uploadImageUrl="form.CSWXUrl"
            :Root="SETTING_STORE"
            @uploadSucc="(url) => {this.form.CSWXUrl = url}"
            :type="'primary'"
          >
            <slot>上传客服二维码</slot>
          </uploadImgByBtn>
        </template>
      </el-col>
    </el-row>

    <div
      class="buttons"
      style="margin-left: 110px;"
    >
      <el-button
        name="editData"
        type="primary"
        @click="editData($event)"
        :loading="$store.getters.is_loading"
      >保存</el-button>
    </div>
  </div>
</template>

<script>
import { DOMAIN_IMG_FILE } from '@/configs/appSettings.js'
import { SETTING_STORE } from '@/configs/filePaths.js'
import storeRules from '@/rules/setter/store'
import { CharacterType } from '@/enums/common'
import { StorePackageType } from '@/enums/marketing'
import {
  CompanyBasicMountType,
  StoreBasicBusinessType,
  StoreBasicFlagshipType
} from '@/enums/merchant'
import {
  MERCHANT_API_STORE_BASIC_GET, // 门店基本资料 - 加载
  MERCHANT_API_STORE_BASIC_UPDATEINFO, // 门店基本资料 - 更新(门店端)
  MERCHANT_API_DROPDOWN_PACKBASICLIST // 套餐 - 列表(下拉)
} from '@/apis/merchant'

import uploadImgByBtn from '@/components/common/uploadImgByBtn.vue'
export default {
  data() {
    return {
      DOMAIN_IMG_FILE,
      SETTING_STORE,
      storePackageType: StorePackageType,
      companyBasicMountType: CompanyBasicMountType,
      characterType: CharacterType,
      btnLoading: false,
      serviceBtnLoading: false,
      radio: '零售',
      form: {
        StoreName: '',
        FlagshipType: [],
        AreaData: [],
        sysPackTime: []
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
      MERCHANT_API_STORE_BASIC_GET({
        StoreId: this.$store.getters.user_session.StoreId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.form = Object.assign({}, this.form, res.data.Data)
          this.form.sysPackTime = [res.data.Data.Expireb, res.data.Data.Expiree]
          this.form.FlagshipType =
            res.data.Data.FlagshipType === ''
              ? []
              : res.data.Data.FlagshipType.split(',')

          if (
            this.$store.getters.user_session.CharacterType ==
            CharacterType.Store
          ) {
            this.radio = this.storeBasicBusinessType.Types[
              res.data.Data.BusinessType
            ]
          }
          // this.form.OpenTime = this.$root.filterDate(this.form.OpenTime)
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
          this.form.OpenTime = this.form.OpenTime
            ? new Date(this.form.OpenTime - 0 + 8 * 3600000)
            : ''
          var param = Object.assign({}, this.form, {
            FlagshipType
          })
          param.ProvinceId = parseInt(this.form.AreaData[0]) || 0
          param.CityId = parseInt(this.form.AreaData[1]) || 0
          param.TownId = parseInt(this.form.AreaData[2]) || 0
          param.Phone = param.Phone + ''
          var list = Object.assign({}, this.storeBasicBusinessType.Types)
          for (var o in list) {
            if (list[o] === this.radio + '') {
              param.BusinessType = o - 0
            }
          }
          this.$store.commit('SET_BTN_LOADING', true)
          MERCHANT_API_STORE_BASIC_UPDATEINFO(param).then(res => {
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
      this.form.ProvinceName = cityName[0] || ''
      this.form.CityName = cityName[1] || ''
      this.form.TownName = cityName[2] || ''
    }
  },
  created() {
    this.rules = storeRules
  },
  mounted() {
    this.$store.dispatch('GET_AREAS_DROPLIST')
    this.getStoreData()
    this.getPackList()
  }
}
</script>
