<template>
  <div class="content">
    <el-row>
      <el-col :span="12">
        <el-form label-position="right" label-width="113px" :model="form">
          <el-form-item class="my-form-item" label="公司编码：">
            <span>{{form.CompanyCode}}</span>
          </el-form-item>
          <el-form-item class="my-form-item" label="公司名称：">
            <span>{{form.CompanyName}}</span>
          </el-form-item>
          <el-form-item class="my-form-item" label="公司简称：">
            <span>{{form.ShortName}}</span>
          </el-form-item>
          <el-form-item class="my-form-item" label="管理员账号：">
            <span>{{form.AdministratorId}}</span>
          </el-form-item>
          <el-form-item class="my-form-item" label="初始密码：">
            <span>{{form.Password}}</span>
          </el-form-item>
          <el-form-item class="my-form-item" label="微信管理：">
            <span v-if="form.MountWechat === companyBasicMountType.Company">在总部统一设置<span class="const">（所有门店使用同一个公众号）</span></span>
            <span v-else-if="form.MountWechat === companyBasicMountType.Store">在门店设置</span>
            <span v-else></span>
          </el-form-item>
          <el-form-item class="my-form-item" label="支付授权：">
            <span v-if="form.MountPayment === companyBasicMountType.Company">在总部统一设置<span class="const">（所有门店使用同一个支付接口）</span></span>
            <span v-else-if="form.MountPayment === companyBasicMountType.Store">在门店设置</span>
            <span v-else></span>
          </el-form-item>
          <el-form-item label="类型/套餐：">
            <span>{{PackName}}</span>
          </el-form-item>
          <el-form-item class="my-form-item" label="所属区域：">
            <span>{{form.ProvinceName + form.CityName + form.TownName}}</span>
          </el-form-item>
          <el-form-item class="my-form-item" label="详细地址：">
            <span>{{form.Address}}</span>
          </el-form-item>
          <el-form-item class="my-form-item" label="营业执照：">
            <span>{{form.BusinessLicense}}</span>
          </el-form-item>
          <el-form-item class="my-form-item" label="公司电话：">
            <span>{{form.Phone}}</span>
          </el-form-item>
          <el-form-item class="my-form-item" label="联系人：">
            <span>{{form.Contact}}</span>
          </el-form-item>
          <el-form-item class="my-form-item" label="联系人手机：">
            <span>{{form.Mobile}}</span>
          </el-form-item>
          <el-form-item class="my-form-item" label="QQ：">
            <span>{{form.QQ}}</span>
          </el-form-item>
          <el-form-item class="my-form-item" label="微信：">
            <span>{{form.Wechart}}</span>
          </el-form-item>
          <el-form-item class="my-form-item" label="邮箱：">
            <span>{{form.Email}}</span>
          </el-form-item>
          <el-form-item class="my-form-item" label="银行账号：">
            <span>{{form.AccountCode}}</span>
          </el-form-item>
          <el-form-item class="my-form-item" label="开户行：">
            <span>{{form.BankName}}</span>
          </el-form-item>
          <el-form-item class="my-form-item" label="开户人：">
            <span>{{form.Surname}}</span>
          </el-form-item>
          <el-form-item class="my-form-item" label="公司简介：">
            <span>{{form.Introduction}}</span>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <div class="logoImg">
          <img v-if='form.ImageUrl' :src="$root.settings.DOMAIN_IMG_FILE + form.ImageUrl.replace('{0}', '1080x0')" style="width: 240px;">
        </div>
      </el-col>
    </el-row>    
  </div>
</template>

<script>
import {
  CharacterType 
} from '@/enums/common'
import {
  CompanyBasicMountType
} from '@/enums/merchant'
import {
  MERCHANT_API_COMPANY_BASIC_REQ, MERCHANT_API_DROPDOWN_PACKBASICLIST
} from '@/apis/merchant'
export default {
  data () {
    return {
      companyBasicMountType: CompanyBasicMountType,
      imgurlup: this.$root.settings.DOMAIN_APIS.Merchant + '/api/Upload/File?id=' + 'UploadFileType.StoreBasicImageUrl',
      flagshipType: [],
      companyId: '',
      packBasicList: [],
      form: {
      }, // 接收表单里面的参数
      rules: {
      }, // 接收表单验证的规则
      options: [],
      PackName: ''
    }
  },
  methods: {
    init () {
      let query = this.$route.query
      this.companyId = query.id
      if (!this.companyId) {
        this.dataError()
      } else {
        this.getDetail()
      }
    },
    dataError () {
      this.$confirm('数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: true,
        type: 'warning'
      }).then(() => {
        this.$router.push({
          path: '/setter/store/index'
        })
      })
    },
    getPackBasicList () {
      MERCHANT_API_DROPDOWN_PACKBASICLIST({
        CharacterType: CharacterType.Company
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.PackName = res.data.Data.Rows.find(item => { return item.Id == this.form.PackId}).Value
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getDetail () {
      MERCHANT_API_COMPANY_BASIC_REQ({
        CompanyId: this.companyId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.form = res.data.Data
          this.getPackBasicList()
        } else {
          this.$message.error(res.data.Message)
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss">
.logoImg {
  margin-top: 40px;
}
</style>
