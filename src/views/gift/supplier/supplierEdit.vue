<template>
  <div class="content">
    <el-form
      class="fix-w"
      label-position="right"
      label-width="113px"
      :model="editForm"
      :rules="rules"
      ref="form-edit"
      show-message
    >
      <el-row>
        <el-col :span="8">
          <el-form-item
            label="公司编码："
            prop="SupplierCode"
          >
            <el-input
              name="SupplierCode"
              v-model="editForm.SupplierCode"
              @blur="editForm.SupplierCode=editForm.SupplierCode.trim()"
              :disabled="!!$route.query.id"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="公司名称："
            prop="SupplierName"
          >
            <el-input
              name="SupplierName"
              v-model="editForm.SupplierName"
              @blur="editForm.SupplierName=editForm.SupplierName.trim()"
              :disabled="!!$route.query.id"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="公司简称："
            prop="ShortName"
          >
            <el-input
              name="ShortName"
              v-model="editForm.ShortName"
              :maxlength="24"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="类型/套餐"
            prop="PackId"
          >
            <el-select
              name="PackId"
              filterable
              v-model="editForm.PackId"
            >
              <el-option
                v-for="item in packList"
                :key="item.Id"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="提点比率"
            prop="taxesMax"
          >
            <el-input
              name="taxesMax"
              v-model="editForm.taxesMax"
              @keyup.native="editForm.taxesMax = $root.toFixed(editForm.taxesMax, 2)"
              :maxlength="5"
              suffix-icon="icon-per"
            ></el-input>
            <!-- <i class="icon-per pre-pos"></i> -->
          </el-form-item>
          <el-form-item
            label="管理员账号："
            prop="AdministratorId"
          >
            <el-input
              name="AdministratorId"
              v-model="editForm.AdministratorId"
              @blur="editForm.AdministratorId=editForm.AdministratorId.trim()"
              :disabled="!!editForm.SupplierId"
              class="short"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="初始密码："
            prop="Password"
            v-if="!editForm.SupplierId"
          >
            <el-input
              name="Password"
              type="Password"
              v-model="editForm.Password"
              @blur="editForm.Password=editForm.Password.trim()"
              class="short"
              :maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="所属区域："
            prop="Area"
          >
            <el-cascader
              name="Area"
              v-model="editForm.Area"
              :options="$store.getters.areas.slice(1)"
              ref="cascader"
              placeholder="所有地区"
              @change="citiChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            label="详细地址："
            prop="Address"
          >
            <el-input
              name="Address"
              v-model="editForm.Address"
              @blur="editForm.Address=editForm.Address.trim()"
              :maxlength="150"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="营业执照："
            prop="BusinessLicense"
          >
            <el-input
              name="BusinessLicense"
              v-model="editForm.BusinessLicense"
              @blur="editForm.BusinessLicense=editForm.BusinessLicense.trim()"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="公司电话："
            prop="Phone"
          >
            <el-input
              name="Phone"
              v-model="editForm.Phone"
              @blur="editForm.Phone=editForm.Phone.trim()"
              :maxlength="13"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="联系人："
            prop="Contact"
          >
            <el-input
              name="Contact"
              v-model="editForm.Contact"
              @blur="editForm.Contact=editForm.Contact.trim()"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="联系人手机："
            prop="Mobile"
          >
            <el-input
              name="Mobile"
              v-model="editForm.Mobile"
              @blur="editForm.Mobile=editForm.Mobile.trim()"
              :maxlength="11"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="QQ："
            prop="QQ"
          >
            <el-input
              name="QQ"
              v-model="editForm.QQ"
              :maxlength="11"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="微信："
            prop="Wechart"
          >
            <el-input
              name="Wechart"
              v-model="editForm.Wechart"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="邮箱："
            prop="Email"
          >
            <el-input
              name="Email"
              v-model="editForm.Email"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="银行账号："
            prop="AccountCode"
          >
            <el-input
              name="AccountCode"
              v-model="editForm.AccountCode"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="开户行："
            prop="BankName"
          >
            <el-input
              name="BankName"
              v-model="editForm.BankName"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="开户人："
            prop="Surname"
          >
            <el-input
              name="Surname"
              v-model="editForm.Surname"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="公司简介："
            prop="Introduction"
          >
            <el-input
              name="Introduction"
              type="textarea"
              v-model="editForm.Introduction"
              :maxlength="150"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          style="width: 360px;"
          class="tc"
        >
          <el-form-item
            label
            prop="ImageUrl"
          >
            <img
              v-if="editForm.ImageUrl"
              :src="$root.settings.DOMAIN_IMG_FILE +  editForm.ImageUrl"
              width="240"
              height="120"
            >
            <uploadImgByBtn
              type="primary"
              :Root="$root.filePaths.GIFTING_SUPPLIER"
              @uploadSucc="uploadSucc"
            >
              <slot>上传logo</slot>
            </uploadImgByBtn>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label>
        <el-button
          name="btnSave"
          type="primary"
          size="small"
          @click="save"
          :loading="$store.getters.is_loading"
        >保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ImageUploadPaths } from '@/enums/gifting'
import {
  MERCHANT_API_SUPPLIER_BASIC_CREATE, // 珠宝供应商服务 - 创建
  MERCHANT_API_SUPPLIER_BASIC_UPDATE, // 珠宝供应商服务 - 更新
  MERCHANT_API_SUPPLIER_BASIC_GET, // 珠宝供应商服务 - 检索
  MERCHANT_API_DROPDOWN_PACKBASICLIST // 套餐 - 列表(下拉)
} from '@/apis/merchant'

import { YNStatus, CharacterType } from '@/enums/common'

import uploadImgByBtn from '@/components/common/uploadImgByBtn'

export default {
  data() {
    return {
      imageUploadPaths: ImageUploadPaths,
      editForm: {
        AccountCode: '',
        Address: '',
        taxesMax: '',
        Taxes: '',
        AdministratorId: '',
        BankName: '',
        BusinessLicense: '',
        BusinessUrl: '',
        CityId: '',
        CityName: '',
        Contact: '',
        Email: '',
        ImageUrl: '/default/store/240x120.jpg',
        Introduction: '',
        Mobile: '',
        Password: '',
        Phone: '',
        ProvinceId: '',
        ProvinceName: '',
        QQ: '',
        ShortName: '',
        SupplierCode: '',
        SupplierName: '',
        Surname: '',
        TownId: '',
        TownName: '',
        Wechart: '',
        PackId: '',
        Area: []
      },
      areas: [], // 省市区
      rules: {
        SupplierCode: [
          {
            required: true,
            message: '请输入公司编码'
          }
        ],
        SupplierName: [
          {
            required: true,
            message: '请输入公司名称'
          }
        ],
        ShortName: {
          validator: (rule, value, callback) => {
            const reg = /^[\u4e00-\u9fa5]+$/
            const oldValue = value.split('')
            for (let i = 0; i < oldValue.length; i++) {
              if (reg.test(oldValue[i])) {
                oldValue[i] += 'x'
              }
            }
            if (!value) {
              callback('请输入公司简称')
            } else if (oldValue.join('').length > 24) {
              callback('公司简称不得超过12个汉字或者24个字母')
            } else {
              callback()
            }
          },
          trigger: 'change'
        },
        PackId: [
          {
            required: true,
            message: '请类型/套餐'
          }
        ],
        AdministratorId: [
          {
            required: true,
            message: '请输入管理员账号'
          }
        ],
        taxesMax: [
          {
            required: true,
            message: '请输入提点比率'
          },
          {
            validator: (rule, value, callback) => {
              if (value < 0) {
                callback(new Error('请输入不小于0的提点比率'))
              } else if (value > 100) {
                callback(new Error('请输入不大于100的提点比率'))
              }
              callback()
            }
          }
        ],
        Password: [
          {
            required: true,
            message: '请输入初始密码',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 20,
            message: '密码长度为5-20位字符',
            trigger: 'change'
          }
        ],
        Area: [
          {
            type: 'array',
            required: true,
            message: '请选择所属区域'
          }
        ],
        Address: [
          {
            required: true,
            message: '请输入详细地址'
          }
        ],
        BusinessLicense: [
          {
            required: true,
            message: '请输入营业执照'
          }
        ],
        Phone: [
          {
            required: true,
            message: '请输入门店电话'
          }
        ],
        Contact: [
          {
            required: true,
            message: '请输入联系人'
          }
        ],
        Mobile: [
          {
            required: true,
            message: '请输入联系人手机'
          }
        ]
      }, // 接收表单验证的规则
      packList: []
    }
  },
  created() {
    this.$store.dispatch('GET_AREAS_DROPLIST')
  },
  mounted() {
    if (this.$route.query.id) {
      this.editForm.SupplierId = this.$route.query.id
      this.getDetail()
    } else {
      this.getPackList()
    }
  },
  methods: {
    // 选择城市
    citiChange() {
      // 选择省市区后执行将cityname赋值给form
      var CityName = this.$refs.cascader.currentLabels
      this.editForm.ProvinceName = CityName[0]
      this.editForm.CityName = CityName[1]
      this.editForm.TownName = CityName[2]
      this.editForm.ProvinceId = this.editForm.Area[0]
      this.editForm.CityId = this.editForm.Area[1]
      this.editForm.TownId = this.editForm.Area[2]
    },
    save() {
      this.$refs['form-edit'].validate(valid => {
        if (valid) {
          let apiName = MERCHANT_API_SUPPLIER_BASIC_CREATE
          if (this.editForm.SupplierId) {
            apiName = MERCHANT_API_SUPPLIER_BASIC_UPDATE
          }
          this.$store.commit('SET_BTN_LOADING', true)
          /* this.editForm.Taxes = +parseFloat(
            this.editForm.taxesMax / 100
          ).toFixed(4) */
          const { ProvinceId, CityId, TownId, taxesMax } = this.editForm
          apiName(
            Object.assign({}, this.editForm, {
              ProvinceId: +ProvinceId,
              CityId: +CityId,
              TownId: +TownId,
              Taxes: this.$root.toInt(taxesMax) / 100
            })
          ).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message.success('保存成功！')
              this.$router.push({
                path: '/gift/supplier/index'
              })
            } else {
              this.$message.error(res.data.Message)
            }
          })
        }
      })
    },
    getPackList(id) {
      MERCHANT_API_DROPDOWN_PACKBASICLIST({
        CharacterType: CharacterType.Supplier
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.packList = res.data.Data.Rows
          if (id) {
            this.editForm.PackId = id
          } else {
            this.packList.forEach(item => {
              if (item.IsDefault == YNStatus.Yes && !this.editForm.SupplierId) {
                this.editForm.PackId = item.Id
              }
            })
          }
        }
      })
    },
    getDetail() {
      MERCHANT_API_SUPPLIER_BASIC_GET({
        SupplierId: this.editForm.SupplierId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.editForm = Object.assign(this.editForm, res.data.Data)
          this.editForm.Area = [
            this.editForm.ProvinceId + '',
            this.editForm.CityId + '',
            this.editForm.TownId + ''
          ]
          this.editForm.taxesMax = this.$root.toFloat(this.editForm.Taxes * 100)
          this.editForm.PackId = ''
          this.editForm.ImageUrl = this.editForm.ImageUrl
            ? this.editForm.ImageUrl.replace('{0}', '240x120')
            : '/default/store/240x120.jpg'
          this.getPackList(res.data.Data.PackId)
        } else {
          this.$router.back()
        }
      })
    },
    // 修改图片
    uploadSucc(ImageUrl) {
      this.editForm.ImageUrl = ImageUrl
    }
  },
  components: {
    uploadImgByBtn
  }
}
</script>

