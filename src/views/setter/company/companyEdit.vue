<template>
  <div class="content">
    <el-row>
      <el-col :span="12">
        <el-form
          label-position="right"
          label-width="113px"
          :model="form"
          :rules="rules"
          ref="editForm"
          show-message
          class="fix-w"
        >
          <el-form-item
            label="公司编码："
            prop="CompanyCode"
          >
            <el-input
              name="CompanyCode"
              disabled
              v-model="form.CompanyCode"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="公司名称："
            prop="CompanyName"
          >
            <!-- <el-input
              name="CompanyName"
              :disabled="$store.getters.user_session.CharacterType != characterType.Lingcb"
              v-model="form.CompanyName"
              :maxlength="17"
            ></el-input> -->
            <el-input
              name="CompanyName"
              v-model="form.CompanyName"
              :maxlength="17"
              disabled
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
              disabled
              class="short"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="微信管理："
            prop="MountWechat"
          >
            <el-radio-group
              disabled
              class="radio-group-dialog"
              name="MountWechat"
              v-model="form.MountWechat"
            >
              <el-radio :label="companyBasicMountType.Store">在门店设置</el-radio>
              <el-radio :label="companyBasicMountType.Company">在总部统一设置</el-radio>
              <span>（所有门店使用同一个公众号）</span>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="支付授权："
            prop="MountPayment"
          >
            <el-radio-group
              disabled
              class="radio-group-dialog"
              name="MountPayment"
              v-model="form.MountPayment"
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
              :disabled="$store.getters.user_session.CharacterType != characterType.Lingcb"
              filterable
            >
              <template v-for="(item, index) in packBasicList">
                <el-option
                  v-if="
              (form.MountWechat == companyBasicMountType.Store && item.MultiType == securityPackBasicMultiType.One ) ||  (form.MountWechat == companyBasicMountType.Company && item.MultiType == securityPackBasicMultiType.More )
              "
                  :key="index"
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
        class="tc"
      >
        <div class="logoImg">
          <img
            v-if="form.ImageUrl"
            :src="$root.settings.DOMAIN_IMG_FILE+ form.ImageUrl.replace('{0}', '1080x0')"
            width="240"
            height="120"
            class="m-b-10"
          >
        </div>
        <uploadImgByBtn
          :uploadImageUrl="form.ImageUrl"
          :Root="SETTING_COMPANY"
          @uploadSucc="(url) => {this.form.ImageUrl = url}"
          type="primary"
        >
          <slot>上传公司logo</slot>
        </uploadImgByBtn>
        <p
          class="fontred"
          style="color: red;line-height: 30px;"
        >为保证整体视觉效果，请建议上传透明底的PNG格式logo，尺寸为240px120px，大小为2MB</p>

        <template v-if="form.MountWechat == companyBasicMountType.Company">
          <div class="logoImg">
            <img
              v-if="form.CSWXUrl"
              :src="$root.settings.DOMAIN_IMG_FILE+ form.CSWXUrl.replace('{0}', '1080x0')"
              width="200"
            >
          </div>
          <uploadImgByBtn
            :uploadImageUrl="form.CSWXUrl"
            :Root="SETTING_COMPANY"
            @uploadSucc="(url) => {this.form.CSWXUrl = url}"
            type="primary"
          >
            <slot>上传客服二维码</slot>
          </uploadImgByBtn>
        </template>
      </el-col>
    </el-row>
    <div class="buttons">
      <el-button
        name="updateStore"
        type="primary"
        @click="updateStore"
        :loading="$store.getters.is_loading"
      >保存</el-button>
    </div>
  </div>
</template>

<script>
import { SETTING_COMPANY } from '@/configs/filePaths.js'
import companyRules from '@/rules/setter/company.js'
import { CharacterType } from '@/enums/common'
import {
  CompanyBasicMountType,
  SecurityPackBasicMultiType
} from '@/enums/merchant'
import {
  MERCHANT_API_COMPANY_BASIC_REQ,
  MERCHANT_API_COMPANY_BASIC_UPDATE,
  MERCHANT_API_DROPDOWN_PACKBASICLIST
} from '@/apis/merchant'

import uploadImgByBtn from '@/components/common/uploadImgByBtn.vue'
export default {
  data() {
    return {
      SETTING_COMPANY,
      characterType: CharacterType,
      companyBasicMountType: CompanyBasicMountType,
      securityPackBasicMultiType: SecurityPackBasicMultiType,
      companyId: '',
      packBasicList: [],
      serviceBtnLoading: false,
      form: {
        PackId: ''
      }, // 接收表单里面的参数
      rules: {} // 接收表单验证的规则
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.companyId = query.id
      if (!this.companyId) {
        this.dataError()
      } else {
        this.getDetail()
      }
    },
    dataError() {
      this.$confirm('数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: true,
        type: 'warning'
      }).then(() => {
        this.$router.replace('/setter/company/index')
      })
    },
    getDetail() {
      MERCHANT_API_COMPANY_BASIC_REQ({
        CompanyId: this.companyId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.form = Object.assign({}, this.form, res.data.Data)
          this.form.AdministratorId = res.data.Data.AdministratorId
          this.form.PackId = ''
          this.$set(this.form, 'AreaData', [
            this.form.ProvinceId + '',
            this.form.CityId + '',
            this.form.TownId + ''
          ])
          this.logoImg =
            this.$root.settings.DOMAIN_IMAGE +
            res.data.Data.ImageUrl.replace('{0}', '240x120')
          this.logoImgwx = res.data.Data.CSWXUrl
            ? this.$root.settings.DOMAIN_IMAGE +
              res.data.Data.CSWXUrl.replace('{0}', '300x300')
            : null
          this.getPackBasicList(res.data.Data.PackId)
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getPackBasicList(id) {
      MERCHANT_API_DROPDOWN_PACKBASICLIST({
        CharacterType: CharacterType.Company
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.packBasicList = res.data.Data.Rows
          this.form.PackId = id
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    citiChange() {
      // 选择省市区后执行将cityname赋值给form
      var cityName = this.$refs.cascader.currentLabels
      this.form.ProvinceName = cityName[0]
      this.form.CityName = cityName[1]
      this.form.TownName = cityName[2]
    },
    // 修改公司
    updateStore() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          MERCHANT_API_COMPANY_BASIC_UPDATE(
            Object.assign({}, this.form, {
              ProvinceId: Number(this.form.AreaData[0]),
              CityId: Number(this.form.AreaData[1]),
              TownId: Number(this.form.AreaData[2])
            })
          ).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('修改成功')
              this.$router.push({
                path: '/setter/company/index'
              })
            } else {
              this.form.OpenTime = new Date(this.form.OpenTime)
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        } else {
          this.$message.error('请完善信息！')
        }
      })
    }
  },
  created() {
    this.rules = companyRules
  },
  beforeMount() {
    this.rules = companyRules
    this.$store.dispatch('GET_AREAS_DROPLIST')
    delete this.rules['Password']
  },
  mounted() {
    this.init()
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
