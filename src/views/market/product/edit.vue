<template>
  <div class="content">
    <div v-loading="productLoading">
      <el-form label-width="125px" :model="form" ref="form" :rules="rules" class="fix-w">
        <el-form-item label="条码：" class="is-required">{{form.ProductNO}}</el-form-item>
        <el-form-item label="商品名称：" class="is-required">{{form.ProductTitle}}</el-form-item>
        <el-form-item label="证书号：">{{form.CertSeriesID}}</el-form-item>
        <el-form-item label="材质类型：" prop="MaterialType">
          <el-select name="selectMaterialType" v-model="form.MaterialType">
            <el-option v-for="item in $store.getters.materialType.TypeArray" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="品类：" v-if="form.MaterialType<=9" prop="GoldType">
          <el-select name="selectGoldType" v-model="form.GoldType">
            <el-option v-for="item in $store.getters.goldType.TypeArray" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金重（克）：" v-if="form.MaterialType<=9" prop="GoldWeight">
          <el-input name="inputGoldWeight" v-model="form.GoldWeight" @keyup.native="form.GoldWeight = $root.toFixed(form.GoldWeight, 3)"></el-input>
        </el-form-item>
        <el-form-item label="规格：" prop="SpecTitle">
          <el-input name="inputSpecTitle" v-model="form.SpecTitle" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="标签价：" prop="LabelPrice">
          <el-input name="inputLabelPrice" v-model="form.LabelPrice" @keyup.native="form.LabelPrice = $root.toFixed(form.LabelPrice, 2)"></el-input>
        </el-form-item>
        <el-form-item label="计价工费（件）：" prop="WorkPrice">
          <el-input name="inputWorkPrice" v-model="form.WorkPrice" @keyup.native="form.WorkPrice = $root.toFixed(form.WorkPrice, 2)"></el-input>
        </el-form-item>
        <el-form-item label="折扣（%）：" prop="Discount">
          <el-input name="inputDiscount" v-model="form.Discount" @keyup.native="form.Discount = $root.toFixed(form.Discount, 1)"></el-input>
        </el-form-item>
        <el-form-item label="商品售价：" prop="ProductPrice">
          <el-input name="inputProductPrice" v-model="form.ProductPrice" @keyup.native="form.ProductPrice = $root.toFixed(form.ProductPrice, 2)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button name="btnOnSubmit" @click="onSubmit" type="primary">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  MARKETING_API_STORE_PRODUCT_BASIC_GET,
  MARKETING_API_STORE_PRODUCT_BASIC_UPDATE
} from '@/apis/marketing'
import { percentValid, twoDecNumValid } from '@/rules/formValidate'
export default {
  data() {
    return {
      form: {
        MaterialType: '',
        GoldType: '',
        GoldWeight: '',
        SpecTitle: '',
        LabelPrice: '',
        WorkPrice: '',
        Discount: '',
        ProductPrice: ''
      },
      productLoading: false,
      rules: {
        MaterialType: [
          {
            type: 'number',
            required: true,
            message: '请选择材质'
          }
        ],
        GoldType: [
          {
            type: 'number',
            required: false,
            message: '请选择素金品类'
          }
        ],
        SpecTitle: [
          {
            min: 1,
            max: 50,
            message: '长度在 1 到 50 个字符'
          }
        ],
        LabelPrice: [
          {
            required: true,
            message: '不能为空'
          },
          {
            validator: twoDecNumValid
          }
        ],
        Discount: [
          {
            required: true,
            message: '不能为空'
          },
          {
            validator: percentValid
          }
        ],
        ProductPrice: [
          {
            required: true,
            message: '不能为空'
          },
          {
            validator: twoDecNumValid
          }
        ]
      }
    }
  },
  created() {
    this.$store.dispatch('GET_MATERIAL_TYPE')
    this.$store.dispatch('GET_GOLD_TYPE')
  },
  beforeMount() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      MARKETING_API_STORE_PRODUCT_BASIC_GET({
        ProductId: this.$route.params.id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.form = res.data.Data
          if (this.form.MaterialType === 0) {
            this.form.MaterialType = ''
          }
          this.form.Discount = this.$root.toFloat(this.form.Discount * 100, 1)
          this.form.LabelPrice = this.$root.toFloat(this.form.LabelPrice)
          this.form.WorkPrice = this.$root.toFloat(this.form.WorkPrice)
          this.form.ProductPrice = this.$root.toFloat(this.form.ProductPrice)
          this.form.GoldWeight = this.$root.toFloat(this.form.GoldWeight)

          this.productLoading = false
        } else {
          this.$router.back()
        }
      })
    },
    onSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          const obj = Object.assign({}, this.form, {
            isLoading: true
          })
          obj.Discount = this.$root.toInt(obj.Discount) / 100
          obj.LabelPrice = this.$root.toInt(obj.LabelPrice)
          obj.WorkPrice = this.$root.toInt(obj.WorkPrice)
          obj.ProductPrice = this.$root.toInt(obj.ProductPrice)
          obj.GoldWeight = this.$root.toInt(obj.GoldWeight)
          obj.GoldType = parseInt(obj.GoldType)
          obj.MaterialType = parseInt(obj.MaterialType)
          MARKETING_API_STORE_PRODUCT_BASIC_UPDATE(obj).then(res => {
            if (res.data.Code == 'CORRECT') {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.$router.push('/market/product/index')
            }
          })
        } else {
          return false
        }
      })
    },
    oneDecValid(rule, value, callback) {
      // 一位小数包含0
      let reg = /^(([1-9]\d{0,8})|\d)(\.\d{1})?$/
      if (!value) {
        callback(new Error('不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('输入有误'))
      } else {
        callback()
      }
    },
    twoDecValid(rule, value, callback) {
      // 两位小数包含0
      let reg = /^(([1-9]\d{0,8})|\d)(\.\d{1,2})?$/
      if (!value) {
        callback(new Error('不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('输入有误'))
      } else {
        callback()
      }
    },

    threeDecValid(rule, value, callback) {
      // 三位小数包含0
      let reg = /^(([1-9]\d{0,8})|\d)(\.\d{1,3})?$/
      if (!value) {
        callback(new Error('不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('输入有误'))
      } else {
        callback()
      }
    }
  }
}
</script>
<style>
.search-title {
  padding-left: 10px;
  height: 32px;
  line-height: 32px;
  color: #333;
  background-color: #f5f5f5;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
}
</style>

