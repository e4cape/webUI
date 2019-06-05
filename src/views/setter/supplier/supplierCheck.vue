<template>
  <el-dialog title="查看供应商" :visible.sync="visible" custom-class="supplier-dialog">
    <el-form :model="form" label-width="110px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="供应商名称：">
            <span>{{form.PartnerName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商编码：">
            <span>{{form.PartnerCode}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所在地区：">
            <span>{{form.areas}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="详细地址：">
            <span>{{form.Address}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="税率：">
            <span>{{form.Taxes ? $root.toFloat(form.Taxes * 100) + '%' : '0%'}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司电话：">
            <span>{{form.Phone}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开户银行：">
            <span>{{form.BankName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="银行账号：">
            <span>{{form.AccountCode}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="账户姓名：">
            <span>{{form.Surname}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="微信：">
            <span>{{form.Wechart}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人姓名：">
            <span>{{form.Contact}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人手机：">
            <span>{{form.Mobile}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人邮箱：">
            <span>{{form.Email}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人QQ：">
            <span>{{form.QQ}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注：">
            <span>{{form.Note}}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
import { STOCKING_API_PARTNER_BASIC_GET } from '@/apis/stocking.js'

export default {
  props: {
    'dialogCheckVisible': {
      type: Boolean,
      default: false
    },
    'partnerId': {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      form: {},
      visible: this.dialogCheckVisible
    }
  },
  watch: {
    visible: function() {
      this.$emit('listenCheckVisible', false)
    }
  },
  methods: {
    getDetail() {
      STOCKING_API_PARTNER_BASIC_GET({
        PartnerId: this.partnerId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.form = res.data.Data
          this.form.areas =
            (this.form.ProvinceName ? this.form.ProvinceName : '') +
            (this.form.CityName ? '/' + this.form.CityName : '') +
            (this.form.TownName ? '/' + this.form.TownName : '')
        } else {
          this.$message.error(res.data.Message)
        }
      })
    }
  },
  beforeMount() {
    this.getDetail()
  }
}
</script>
<style lang="scss" scoped>
.el-form-item__content > span {
  word-break: break-all;
}
</style>
