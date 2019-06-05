<template>
  <el-dialog
    :title="heading"
    :visible.sync="visible"
    width="30%"
  >
  <el-form :label-position="'right'" :rules="rules" label-width="100px" :model="orderForm" ref="orderForm">
    <el-form-item label="业务日期：" prop="ActualDate">
      <el-date-picker
        :clearable="false"
        type="date"
        placeholder="选择日期"
        v-model="orderForm.ActualDate"
        style="width: 100%;"
        :picker-options="$store.getters.businessDate"
        value-format="yyyy-MM-dd"
      ></el-date-picker>
    </el-form-item>
    <el-form-item label="进货方式：" prop="PurchaseType">
      <el-radio-group name="PurchaseType" v-model="orderForm.PurchaseType">
        <el-radio
          :label="Number(purchaseType.Purchase)"
        >{{purchaseType.Types[purchaseType.Purchase]}}</el-radio>
        <el-radio
          :label="Number(purchaseType.WeiwStuff)"
        >{{purchaseType.Types[purchaseType.WeiwStuff]}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="应付款：" prop="Preprice">
      <el-row>
        <el-col :span="12"><el-input type="text" v-model="orderForm.Preprice" name="Preprice" @keyup.native="orderForm.Preprice = $root.toFixed(orderForm.Preprice, 2, true)" maxlength="10"></el-input></el-col>
        <el-col :span="12"><span class="desText">审核后产生应付款</span></el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="预计到货日期：" prop="ForwdDate">
      <el-date-picker
        name="ForwdDate"
        v-model="orderForm.ForwdDate"
        type="date"
        placeholder="选择日期"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="备注：">
      <el-input type="textarea" @blur="orderForm.Note = orderForm.Note.trim()" v-model="orderForm.Note" :maxlength="200" name="note" style="width: 300px"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="saveForm('orderForm')" :loading="$store.getters.is_loading" name="btnEditModify">保存</el-button>
    <el-button @click="visible = false" name="btnCancel">取消</el-button>
  </span>
</el-dialog>
</template>

<script>
import dayjs from 'dayjs'
import {
  PurchaseType 
} from '@/enums/common.js'
import {
  STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_CREATE 
} from '@/apis/stocking.js'
export default {
  props: {
    generateOrder: {
      type: Boolean
    },
    title: {
      type: String
    },
    selectArr: {
      type: Array
    },
    types: {
      type: String,
      default: 'styleInventory'
    }
  },
  data() {
    return {
      visible: this.generateOrder,
      purchaseType: PurchaseType,
      orderForm: {
        ActualDate: dayjs().format('YYYY-MM-DD'),
        ForwdDate: '',
        PurchaseType: PurchaseType.Purchase,
        Note: '',
        Preprice: '',
      },
      heading: this.title,
      rules: {
        ActualDate: [
          {
            required: true, message: '请选择业务日期', trigger: 'change' 
          },
        ],
      }
    }
  },
  methods: {
    saveForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const para = {
            ...this.orderForm,
            ActualDate: dayjs(this.orderForm.ActualDate).format('YYYY-MM-DD'),
            ForwdDate: this.orderForm.ForwdDate === '' ? this.orderForm.ForwdDate : dayjs(this.orderForm.ForwdDate).format('YYYY-MM-DD'),
            Preprice: this.$root.toInt(Number(this.orderForm.Preprice))
          }
          para.KindTypeEv = this.selectArr[0].KindTypeEv
          para.KindTypeEk = this.selectArr[0].KindTypeEk
          if(this.types === 'styleInventory') {
            para.Items = this.selectArr.map((item) => {
              const obj = {
                StyleId: item.StyleId,
                Quantity: item.SafeQty2 - (item.AvailableQty + item.OutwaitQty + item.AllotQty),
              }
              return obj
            })
          } else if(this.types === 'totalInventory') {
            para.Items = this.selectArr.map((item) => {
              const obj = {
                StyleId: item.StyleId,
                Quantity: item.SafeQty2 - (item.AvailableQty + item.OutwaitQty + item.PurchaseQty),
              }
              return obj
            })
          } else if(this.types === 'styleDemList') {
            para.RequireIds = this.selectArr.map((item) => {
              return item.RequireId
            })
          }
          STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_CREATE(para).then(res => {
            if(res.data.Code === 'CORRECT') {
              this.$refs[formName].resetFields()
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.visible = false
              setTimeout(() => {
                this.$router.push(`/purchase/orderManagement/editStyleOrder?id=${res.data.Data}`)
              },500)
            }
          })
        } else {
          return false
        }
      })
    },
  },
  mounted (){
    this.$store.dispatch('GET_SETTLE_DATE')
  },
  watch: {
    visible () {
      this.$emit('colseGenerateOrder')
    }
  }
}
</script>
<style lang="scss" scoped>
.desText {
  padding-left: 5px;
  color: #999;
}
</style>

