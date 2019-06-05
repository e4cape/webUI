<template>
  <div class="stone-bd">
    <el-form label-position="right" label-width="113px" :model="affForm" :rules="rules" ref="createForm" show-message class="fix-w">
      <el-form-item label="账号：" prop="CompanyCode" class="is-required">
        <el-input name="CompanyCode" v-model="affForm.CompanyCode" @blur="affForm.CompanyCode=affForm.CompanyCode.trim()" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="联盟商：" prop="CompanyName">
        <el-input name="CompanyName" v-model="affForm.CompanyName" @blur="affForm.CompanyName=affForm.CompanyName.trim()" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="简称：" prop="ShortName" class="is-required">
        <el-input name="ShortName" v-model="affForm.ShortName" @blur="affForm.ShortName=affForm.ShortName.trim()" :maxlength="24"></el-input>
      </el-form-item>
      <el-form-item label="类型：" prop="AdministratorId">
        <el-input name="LoginId" v-model="affForm.AdministratorId" @blur="affForm.AdministratorId=affForm.AdministratorId.trim()" class="short" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="所属区域：" prop="AreaData" class="is-required">
        <el-cascader filterable :options="$store.getters.areas" ref="cascader" v-model="affForm.AreaData" placeholder="选择地区" @change="citiChange"></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址：" prop="Address">
        <el-input name="Address" v-model="affForm.Address" @blur="affForm.Address=affForm.Address.trim()" :maxlength="150"></el-input>
      </el-form-item>
      <el-form-item label="营业执照：" prop="BusinessLicense">
        <el-input name="BusinessLicense" v-model="affForm.BusinessLicense" @blur="affForm.BusinessLicense=affForm.BusinessLicense.trim()" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="门店数：" prop="Phone">
        <el-input name="Phone" v-model="affForm.Phone" @blur="affForm.Phone=affForm.Phone.trim()" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="固定电话：" prop="Contact">
        <el-input name="Contact" v-model="affForm.Contact" @blur="affForm.Contact=affForm.Contact.trim()" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="联系人：" prop="Mobile">
        <el-input name="Mobile" v-model="affForm.Mobile" @blur="affForm.Mobile=affForm.Mobile.trim()" :maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="联系人手机：" prop="Mobile">
        <el-input name="Mobile" v-model="affForm.Mobile" @blur="affForm.Mobile=affForm.Mobile.trim()" :maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="QQ：">
        <el-input name="QQ" v-model="affForm.QQ" :maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="微信：">
        <el-input name="Wechart" v-model="affForm.Wechart" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：">
        <el-input name="Email" v-model="affForm.Email" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="银行账号：">
        <el-input name="AccountCode" v-model="affForm.AccountCode" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="开户行：">
        <el-input name="BankName" v-model="affForm.BankName" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="开户人：">
        <el-input name="Surname" v-model="affForm.Surname" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="简介：">
        <el-input name="Introduction" type="textarea" style="margin-bottom: 5px;" v-model="affForm.Introduction" :maxlength="500"></el-input>
      </el-form-item>
    </el-form>

    <div class="buttons">
      <el-button name="createAff" type="primary" @click="createAff" :loading="$store.getters.is_loading">保存</el-button>
      <el-button name="cancel" @click="$router.push({path: '/alliance/affiliateManage/index'})" :loading="$store.getters.is_loading">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      affForm: {},
      rules: {
        CompanyId: [
          {
            type: 'number',
            required: true,
            message: '请选择归属公司',
            trigger: 'change'
          }
        ],
        CompanyCode: [
          {
            required: true,
            message: '请输入公司编码',
            trigger: 'change'
          }
        ],
        CompanyName: [
          {
            required: true,
            message: '请输入公司名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    citiChange() {
      // 选择省市区后执行将cityname赋值给form
      var cityName = this.$refs.cascader.currentLabels
      this.affForm.ProvinceName = cityName[0]
      this.affForm.CityName = cityName[1]
      this.affForm.TownName = cityName[2]
    },
    createAff() {
    }
  },
  mounted() {
    this.$store.dispatch('GET_AREAS_DROPLIST')
  }
}
</script>
<style lang="scss" scoped>
</style>
