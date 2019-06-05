<template>
  <div class="content">
    <el-form label-position="right" label-width="113px" show-message v-loading="$store.getters.tb_loading">
      <el-row>
        <el-col :span="12">
          <el-form-item label="公司编码：">
            <span>{{detail.SupplierCode}}</span>
          </el-form-item>
          <el-form-item label="公司名称：">
            <span>{{detail.SupplierName}}</span>
          </el-form-item>
          <el-form-item label="公司简称：">
            <span>{{detail.ShortName}}</span>
          </el-form-item>
          <el-form-item label="类型/套餐：">
            <span>{{packName}}</span>
          </el-form-item>
          <el-form-item label="提点比率：">
            <span>{{$root.toFloat(detail.Taxes * 100)}}</span>
            <i class="icon-per"></i>
          </el-form-item>
          <el-form-item label="管理员账号：">
            <span>{{detail.AdministratorId}}</span>
          </el-form-item>
          <el-form-item label="初始密码：" prop="password">
            <span>{{detail.Password}}</span>
          </el-form-item>
          <el-form-item label="所属区域：" prop="area">
            <span>{{detail.ProvinceName + detail.CityName+ detail.TownName}}</span>
          </el-form-item>
          <el-form-item label="详细地址：" prop="address">
            <span>{{detail.Address}}</span>
          </el-form-item>
          <el-form-item label="营业执照：" prop="businessLicense">
            <span>{{detail.BusinessLicense}}</span>
          </el-form-item>
          <el-form-item label="公司电话：" prop="phone">
            <span>{{detail.Phone}}</span>
          </el-form-item>
          <el-form-item label="联系人：" prop="contact">
            <span>{{detail.Contact}}</span>
          </el-form-item>
          <el-form-item label="联系人手机：" prop="mobile">
            <span>{{detail.Mobile}}</span>
          </el-form-item>
          <el-form-item label="QQ：" prop="qq">
            <span>{{detail.QQ}}</span>
          </el-form-item>
          <el-form-item label="微信：" prop="wechart">
            <span>{{detail.Wechart}}</span>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <span>{{detail.Email}}</span>
          </el-form-item>
          <el-form-item label="银行账号：" prop="accountCode">
            <span>{{detail.AccountCode}}</span>
          </el-form-item>
          <el-form-item label="开户行：" prop="bankName">
            <span>{{detail.BankName}}</span>
          </el-form-item>
          <el-form-item label="开户人：" prop="surname">
            <span>{{detail.Surname}}</span>
          </el-form-item>
          <el-form-item label="公司简介：" prop="introduction">
            <span>{{detail.Introduction}}</span>
          </el-form-item>
        </el-col>
        <el-col style="width: 360px;" class="tc">
          <el-form-item label prop="imageUrl">
            <div>
              <img :src="$root.settings.DOMAIN_IMG_FILE +  detail.ImageUrl" style="width: 240px;">
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row style="margin: 20px; margin-left: 33px; text-align: left; border: 0;">
      <el-button name="btnBack" @click="$router.back()">返回</el-button>
    </el-row>
  </div>
</template>

<script>
import { CharacterType } from '@/enums/common'
import {
  MERCHANT_API_SUPPLIER_BASIC_GET, // 珠宝供应商服务 - 检索
  MERCHANT_API_DROPDOWN_PACKBASICLIST // 套餐 - 列表(下拉)
} from '@/apis/merchant'
export default {
  data() {
    return {
      detail: {},
      characterType: CharacterType,
      packName: ''
    }
  },
  methods: {
    getDetail() {
      this.$store.commit('SET_TB_LOADING', true)
      MERCHANT_API_SUPPLIER_BASIC_GET({
        SupplierId: this.detail.SupplierId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$store.commit('SET_TB_LOADING', false)
          this.detail = res.data.Data
          this.detail.imageUrl = this.detail.imageUrl
            ? this.detail.imageUrl.replace('{0}', '240x120')
            : '/default/store/240x120.jpg'
          this.getPackages()
        } else {
          this.$router.back()
        }
      })
    },
    getPackages() {
      MERCHANT_API_DROPDOWN_PACKBASICLIST({
        CharacterType: this.characterType.Supplier
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.packName = res.data.Data.Rows.filter(
            item => item.Id == this.detail.PackId
          )[0].Value
        }
      })
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.detail.SupplierId = this.$route.query.id
      this.getDetail()
    } else {
      this.$message.error('数据错误！')
      this.$router.back()
    }
  }
}
</script>
