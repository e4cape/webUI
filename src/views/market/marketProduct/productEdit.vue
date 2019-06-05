<template>
  <div>
    <el-form class="fix-w" :model="form" :rules="rules" ref="form" label-width="150px">
      <div class="border-1px font-12">
        <el-form-item label="产品名称：" prop="MarproTitle">
          <el-input v-model="form.MarproTitle" name="marproTitle" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item class="check-wrap" label="参与条件：" prop="MaterialType">
          <el-checkbox-group v-model="MaterialType" name="MaterialType">
            <el-checkbox v-for="item in CategoryTypes" :label="item.Value" :key="item.Value">{{ item.Name }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="卡券类型：" prop="CouponType">
          <el-checkbox-group v-model="CouponType" name="coupomType">
            <el-checkbox v-for="(item, index) in CouponTypes" :checked="checked[index]" @change="changeBox(index)" :disabled="isDisabled[index]" :label="item.Value" :key="item.Value">{{item.Name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="收益对应跳转：" prop="JumpType">
          <el-select v-model="form.JumpType" placeholder="请选择" name="junpType">
            <el-option v-for="item in CouponTypes" :key="item.Value" :label="item.Name" :value="item.Value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动规则：" prop="Note">
          <el-input :rows="7" type="textarea" v-model="form.Note" name="note"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="formSubmit('form')" name="btnFormSubmit">保存</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import { MaterialType } from '@/enums/stocking.js'
import { CouponType } from '@/enums/marketing.js'
import {
  MARKETING_API_MARKET_PRODUCT_GET,
  MARKETING_API_MARKET_PRODUCT_UPDATE
} from '@/apis/marketing.js'
export default {
  data() {
    return {
      form: {
        Checks1: [],
        MarproTitle: '',
        Note: '',
        cardRadio: []
      },
      cardRadio: '',
      value: '',
      editorText: '',
      rules: {
        MarproTitle: [
          {
            required: true,
            message: '产品名称不能为空！',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 200,
            message: '长度在 1 到 200 个字符',
            trigger: 'blur'
          }
        ],
        Checks1: [
          {
            required: true,
            message: '参与条件为必填！',
            trigger: 'change'
          }
        ],
        cardRadio: [
          {
            required: true,
            message: '卡券类型为必填项！'
          }
        ],
        JumpType: [
          {
            required: true,
            message: '收益对应跳转为必填项！',
            trigger: 'blur'
          }
        ],
        Note: [
          {
            required: true,
            message: '活动规则不能为空！',
            trigger: 'blur'
          }
        ]
      },
      MaterialType: [],
      CouponType: [],
      CategoryTypes: [],
      CouponTypes: [],
      isDisabled: [false, false, false, false],
      checked: [false, false, false, false],
      isCreate: false,
      marketing: true
    }
  },
  created() {
    this.getList()
    this.getEnums()
  },
  methods: {
    getEnums() {
      for (let item in MaterialType.Types) {
        this.CategoryTypes.push({
          Value: parseInt(item),
          Name: MaterialType.Types[item]
        })
      }
      for (let item in CouponType.Types) {
        this.CouponTypes.push({
          Value: parseInt(item),
          Name: CouponType.Types[item]
        })
      }
    },
    getList() {
      MARKETING_API_MARKET_PRODUCT_GET({
        MarproId: this.$route.query.MarproId
      }).then(res => {
        this.form = res.data.Data
        this.form.MaterialTypes.split(',').forEach(m => {
          this.MaterialType.push(parseInt(m))
        })
        this.form.CouponTypes.split(',').forEach(m => {
          this.CouponType.push(parseInt(m))
        })
        this.$refs.form.clearValidate()
      })
    },
    formSubmit(formName) {
      this.form.CouponTypes = this.CouponType.join(',')
      let arr = []
      this.CouponTypes.forEach(m => {
        this.CouponType.forEach(n => {
          if (m.Value === n) {
            arr.push(m.Name)
          }
        })
      })
      this.form.CouponNote = arr.join(',')
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isCreate) {
            this.API_MARKET_CREATE(this.form).then(res => {
              if (res.data.Code === 'CORRECT') {
                this.$message.success('保存成功！')
                this.$router.back()
              }
            })
          } else {
            MARKETING_API_MARKET_PRODUCT_UPDATE(this.form).then(res => {
              if (res.data.Code === 'CORRECT') {
                this.$message.success('保存成功！')
                this.$router.back()
              }
            })
          }
        }
      })
    },
    changeBox(index) {
      if (index === 0) {
        let index1 = this.CouponType.indexOf(3)
        if (index1 > -1) {
          this.CouponType.splice(index1, 1)
        }
      } else if (index === 1) {
        let index1 = this.CouponType.indexOf(1)
        if (index1 > -1) {
          this.CouponType.splice(index1, 1)
        }
      } else if (index === 2) {
        let index1 = this.CouponType.indexOf(7)
        if (index1 > -1) {
          this.CouponType.splice(index1, 1)
        }
      } else {
        let index1 = this.CouponType.indexOf(5)
        if (index1 > -1) {
          this.CouponType.splice(index1, 1)
        }
      }
    }
  }
}
</script>
<style lang="scss">
.w-750 {
  width: 100px;
}
.check-wrap .el-checkbox + .el-checkbox {
  margin-left: 20px;
}
.w-e-toolbar {
  height: 35px;
  background-color: #f5f5f5 !important;
  border: 1px solid #e5e5e5 !important;
}
.w-e-text-container {
  height: 165px !important;
  border: 1px solid #e5e5e5 !important;
  border-top: none !important;
}
</style>
<style lang="scss" scoped>
.checkbox-inline {
  margin-right: 10px;
}
.font-12 {
  font-size: 12px;
}
.fix-w .el-select,
.el-textarea {
  width: 500px !important;
}
</style>
