<template>
  <el-dialog title="新建供应商" :visible.sync="visible" custom-class="supplier-dialog">
    <el-form :model="createForm" label-width="110px" :rules="rules" ref="FROM">
      <el-row>
        <el-col :span="12">
          <el-form-item label="供应商名称：" prop="PartnerName">
            <el-input v-model="createForm.PartnerName" @blur="createForm.PartnerName=createForm.PartnerName.trim()"  :maxlength="50" name="PartnerName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商编码：" prop="PartnerCode">
            <el-input v-model="createForm.PartnerCode" :maxlength="50" name="PartnerCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所在地区：" prop="ProvinceName">
            <el-cascader filterable ref="cascader" :options="$store.getters.areas" v-model="areaData" @change="citiChange" name="areaData"></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="详细地址：" prop="Address">
            <el-input v-model="createForm.Address" :maxlength="50" name="address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="税率：" prop="Taxes">
            <el-input v-model="createForm.Taxes" @keyup.native="createForm.Taxes = $root.toFixed(createForm.Taxes, 4)" name="taxes">
              <template slot="append">0-1小数</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司电话：">
            <el-input v-model="createForm.Phone" :maxlength="20" name="phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开户银行：">
            <el-input v-model="createForm.BankName" :maxlength="50" name="bankName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行账号：">
            <el-input v-model="createForm.AccountCode" :maxlength="50" name="accountCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="账户姓名：">
            <el-input v-model="createForm.Surname" :maxlength="50" name="surname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="微信：">
            <el-input v-model="createForm.Wechart" :maxlength="50" name="wechart"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人姓名：">
            <el-input v-model="createForm.Contact" :maxlength="30" name="contact"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人手机：">
            <el-input v-model="createForm.Mobile" :maxlength="11" name="mobile"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人邮箱：" prop="Email">
            <el-input v-model="createForm.Email" :maxlength="50" name="email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人QQ：">
            <el-input v-model="createForm.QQ" :maxlength="50" name="QQ"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="createForm.Note" :maxlength="200" name="Note"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="$store.getters.is_loading" @click="createSubmit('FROM')" name="createSubmit">确 定</el-button>
      <el-button @click="visible =  false" name="btnCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { PartnerType } from '@/enums/common.js'
import { PartnerBasicSettleType } from '@/enums/stocking.js'
import { FORM_RULES } from '@/rules/erp/supplier.js'
import { STOCKING_API_PARTNER_BASIC_CREATE } from '@/apis/stocking.js'

export default {
  props: {
    dialogCreateVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isEdit: false,
      areaData: [],
      createForm: {
        PartnerType: PartnerType.Supplier, //	int32	往来供应商类型(枚举)	required
        PartnerCode: '', //	string	往来供应商编码	required,max=50
        PartnerName: '', //	string	往来供应商名称	required,max=50
        ShortName: '', //	string	往来供应商简称	max=50
        AuthorizeCode: '', //	string	授权码	max=50
        SettleType: PartnerBasicSettleType.Should, //	int32	结算方式(枚举)	gte=0
        Taxes: '', //	float32	税率(0-1)	gte=0
        ProvinceId: '', //	int32	省份序号	gte=0
        ProvinceName: '', //	string	省份名称	max=50
        CityId: '', //	int32	城市序号	gte=0
        CityName: '', //	string	城市名称	max=50
        TownId: '', //	int32	区县序号	gte=0
        TownName: '', //	string	区县名称	max=50
        Address: '', //	string	详细地址	max=200
        Contact: '', //	string	联系人	max=50
        Mobile: '', //	string	联系人手机	max=50
        Phone: '', //	string	来往供应商电话	max=50
        QQ: '', //	string	QQ	max=50
        Wechart: '', //	string	微信	max=50
        Email: '', //	string	邮箱	max=50
        BankName: '', //	string	银行名称(开户银行)	max=50
        AccountCode: '', //	string	银行账户	max=50
        Surname: '', //	string	账户姓名(开户名称)	max=50
        Note: '' //	string	简介(备注)	max=200
      },
      visible: this.dialogCreateVisible,
      rules: {},
      success: false
    }
  },
  methods: {
    createSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.createData()
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    createData() {
      this.createForm.ProvinceId = Number(this.areaData[0]) || 0
      this.createForm.CityId = Number(this.areaData[1]) || 0
      this.createForm.TownId = Number(this.areaData[2]) || 0
      this.createForm.Taxes = this.$root.toInt(this.createForm.Taxes || 0)
      let param = Object.assign({}, this.createForm)
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_PARTNER_BASIC_CREATE(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
          this.$store.commit('SET_BTN_LOADING', false)
          this.success = true
          this.visible = false
        } else {
          this.$message.error(res.data.Message)
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    citiChange() {
      let cityName = this.$refs.cascader.currentLabels
      this.createForm.ProvinceName = cityName[0]
      this.createForm.CityName = cityName[1]
      this.createForm.TownName = cityName[2]
    },
    getAreaData() {
      this.$store.dispatch('GET_AREAS_DROPLIST')
    }
  },
  watch: {
    visible: function() {
      this.$emit('listenCreateVisible', this.success)
    }
  },
  created() {
    this.getAreaData()
  },
  beforeMount() {
    this.rules = FORM_RULES
  }
}
</script>
<style>
</style>

