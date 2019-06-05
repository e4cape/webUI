<template>
  <div class="content otherB p-30">
    <el-form ref="formInline" :rules="rules" v-loading="loading" :disabled="isDisabled" style="width: 50%" :model="formInline" label-width="150px">
      <el-form-item label="单一商品金额超过" class="padding-b-10" prop="MinxPrice">
        <el-input name="MinxPrice" v-model="formInline.MinxPrice" @keyup.native="formInline.MinxPrice=$root.toFixed(formInline.MinxPrice, 2)">{{formInline.MinxPrice}}</el-input>
      </el-form-item>
      <el-form-item label="奖励金额" prop="LargarPrice">
        <el-input name="LargarPrice" v-model="formInline.LargarPrice" @keyup.native="formInline.LargarPrice=$root.toFixed(formInline.LargarPrice, 2)">{{formInline.LargarPrice}}</el-input>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-radio-group name="radio" v-model="radio">
          <el-radio :label="EnableState.Enable">是</el-radio>
          <el-radio :label="EnableState.Disable">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button name="btnSave" type="primary" @click="saveSbumit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { BonusType } from '@/enums/performance'
import { EnableState } from '@/enums/common'
import { MaterialType } from '@/enums/marketing'
import {
  KPIS_API_BONUS_BASIC_GET,
  KPIS_API_BONUS_BASIC_UPDATE
} from '@/apis/performance'
export default {
  data() {
    return {
      BonusType,
      EnableState,
      MaterialType,
      formInline: {
        BonusId: '',
        MinxPrice: '',
        LargarPrice: '',
        IsEnabled: '',
        isDisabled:false,
        Items: []
      },
      isDisabled:false,
      rules: {
        MinxPrice: [
          {
            required: true, message: '不能为空！' 
          },
          {
            validator: this.selfValidateSale 
          }
        ],
        LargarPrice: [
          {
            required: true, message: '不能为空！' 
          },
          {
            validator: this.selfValidateSale 
          }
        ]
      },
      dialogFormVisible: false,
      dialogRewardPriceVisible: false,
      radio: '3',
      value: '',
      loading: true
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      KPIS_API_BONUS_BASIC_GET({
        BonusType: BonusType.Largar
      }).then((resp) => {
        if (resp.data.Code == 'CORRECT') {
          this.formInline = resp.data.Data
          this.radio = this.formInline.IsEnabled
          this.formInline.LargarPrice = this.$root.toFloat(this.formInline.LargarPrice)
          this.formInline.MinxPrice = this.$root.toFloat(this.formInline.MinxPrice)
        }else{
          this.isDisabled=true
        }
        this.loading = false
      })
    },
    selfValidateSale(rule, value, callback) {
      const reg = /^(?!(0[0-9]|^(0\.[0]+)$))[+]?(([\d]{1,9}[.]{1}[\d]{1,2})|([1-9][0-9]{0,8}))$/g
      const flag = reg.test(value)
      if (value === 3) {
        callback(new Error('不能为空！'))
      } else if (!flag) {
        callback(new Error('请正确输入'))
      } else {
        callback()
      }
    },
    saveSbumit() {
      this.formInline.IsEnabled = this.radio
      this.$refs['formInline'].validate((valid) => {
        if (valid) {
          let params = Object.assign({},this.formInline)
          delete params.Items
          params.LargarPrice = this.$root.toInt(params.LargarPrice)
          params.MinxPrice = this.$root.toInt(params.MinxPrice)
          KPIS_API_BONUS_BASIC_UPDATE(params).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
            } else {
              this.$message.warning(res.data.Message)
            }
          }).catch(() => {})
        } else {
          return false
        }
      })
    }
  }
}

</script>
<style scoped>
.el-form-item {
  margin-bottom: 10px;
}

.page {
  float: right;
  margin-top: 10px;
}

.el-form-item {
  width: 500px;
}

.padding-b-10 {
  padding-bottom: 10px
}

</style>
<style>
.otherB .el-form-item__error {
  display: none;
}

</style>
