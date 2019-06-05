<template>
  <el-dialog title="修改供应商" :visible.sync="visible" custom-class="supplier-dialog">
    <el-form :model="editForm" label-width="110px" :rules="rules" ref="editForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="供应商名称：" prop="PartnerName">
            <el-input v-model="editForm.PartnerName" @blur="editForm.PartnerName=editForm.PartnerName.trim()"  :maxlength="50" name="PartnerName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商编码：" prop="PartnerCode">
            <el-input v-model="editForm.PartnerCode" :maxlength="50" name="PartnerCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所在地区：" prop="ProvinceName">
            <el-cascader filterable ref="cascader" :options="$store.getters.areas" v-model="editForm.AreaData" @change="citiChange" name="areaData"></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="详细地址：" prop="Address">
            <el-input v-model="editForm.Address" :maxlength="50" name="address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="税率：" prop="Taxes">
            <el-input v-model="editForm.Taxes" @keyup.native="editForm.Taxes = $root.toFixed(editForm.Taxes, 4)" name="taxes">
              <template slot="append">0-1小数</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司电话：">
            <el-input v-model="editForm.Phone" :maxlength="20" name="phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开户银行：">
            <el-input v-model="editForm.BankName" :maxlength="50" name="bankName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行账号：">
            <el-input v-model="editForm.AccountCode" :maxlength="50" name="accountCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="账户姓名：">
            <el-input v-model="editForm.Surname" :maxlength="50" name="surname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="微信：">
            <el-input v-model="editForm.Wechart" :maxlength="50" name="wechart"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人姓名：">
            <el-input v-model="editForm.Contact" :maxlength="30" name="contact"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人手机：">
            <el-input v-model="editForm.Mobile" :maxlength="11" name="mobile"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人邮箱：" prop="Email">
            <el-input v-model="editForm.Email" :maxlength="50" name="email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人QQ：">
            <el-input v-model="editForm.QQ" :maxlength="50" name="QQ"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注：">
            <el-input type="textarea" v-model="editForm.Note" :maxlength="200" name="Note"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="$store.getters.is_loading" @click="editData()" name="editSubmit">确 定</el-button>
      <el-button @click="visible =  false" name="btnCancel">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { FORM_RULES } from '@/rules/erp/supplier.js'
import {
  STOCKING_API_PARTNER_BASIC_UPDATE,
  STOCKING_API_PARTNER_BASIC_GET
} from '@/apis/stocking.js'

import { PartnerType } from '@/enums/common.js'
import { PartnerBasicSettleType } from '@/enums/stocking.js'

export default {
  props: {
    dialogEditVisible: {
      type: Boolean,
      default: false
    },
    partnerId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      partnerType: PartnerType,
      partnerBasicSettleType: PartnerBasicSettleType,
      success: false,
      editForm: {
        AreaData: []
      },
      visible: this.dialogEditVisible,
      rules: {}
    }
  },
  methods: {
    getDetail() {
      STOCKING_API_PARTNER_BASIC_GET({
        PartnerId: this.partnerId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.editForm = res.data.Data
          this.$set(this.editForm, 'AreaData', [
            this.editForm.ProvinceId + '',
            this.editForm.CityId + '',
            this.editForm.TownId + ''
          ])

          this.editForm.Taxes  = this.$root.toFloat(res.data.Data.Taxes) + ''
        }
      })
    },
    editData() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_PARTNER_BASIC_UPDATE(
            Object.assign(this.editForm, {
              Taxes: this.$root.toInt(this.editForm.Taxes || 0),
              ProvinceId: Number(this.editForm.AreaData[0]),
              CityId: Number(this.editForm.AreaData[1]),
              TownId: Number(this.editForm.AreaData[2])
            })
          ).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '修改成功',
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
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    citiChange() {
      // 选择省市区后执行将cityname赋值给editForm
      let cityName = this.$refs.cascader.currentLabels
      this.editForm.ProvinceName = cityName[0]
      this.editForm.CityName = cityName[1]
      this.editForm.TownName = cityName[2]
    },
    getAreaData() {
      this.$store.dispatch('GET_AREAS_DROPLIST')
    }
  },
  created() {
    this.getAreaData()
  },
  beforeMount() {
    this.rules = FORM_RULES
    this.getDetail()
  },
  watch: {
    visible: function() {
      this.$emit('listenEditVisible', this.success)
    }
  }
}
</script>
