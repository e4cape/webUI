<template>
  <div class="content-view border-1px">
    <el-form class="fix-w" :model="rechargeData" ref="rechargeData" :rules="rechargeRules" label-width="150px" label-position="right">
      <el-form-item label="平台最低充值金额：" prop="Minimum">
        <el-input
          name="Minimum"
          style="width: 200px"
          v-model="rechargeData.Minimum"
          @blur="rechargeData.Minimum = $root.toFixed(rechargeData.Minimum,2)"
          @keyup.native="rechargeData.Minimum = $root.toFixed(rechargeData.Minimum,2)"
        >
          <span slot="append">元</span>
        </el-input>
      </el-form-item>
      <el-form-item label="充值赠送类型：" prop="RechargeType">
        <el-radio-group name="RechargeType" v-model="rechargeData.RechargeType" @change="resetField">
          <template v-for="(value, key) in rechargeType.Types">
            <el-radio :label="key" :key="key" v-if="key!=rechargeType.Else">{{value}}</el-radio>
          </template>
        </el-radio-group>
      </el-form-item>
      <template v-for="(item, index) in rechargeData.Steps">
        <el-form-item :key="index" label="充值：" v-if="rechargeData.RechargeType == rechargeType.Step">
          <el-row>
            <el-col :span="4">
              <el-form-item
                :prop="`Steps[${index}].Priceb`"
                :rules="[
                { required: true, message: '请输入金额！', trigger: 'blur' },
                { validator: giveValidate, trigger: 'blur' }
              ]"
              >
                <el-input name="Priceb" v-model="item.Priceb"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" style="padding-left: 20px;">-</el-col>
            <el-col :span="4">
              <el-form-item
                :prop="`Steps[${index}].Pricee`"
                :rules="[
                { required: true, message: '请输入金额！', trigger: 'blur' },
                { validator: giveValidate, trigger: 'blur' }
              ]"
              >
                <el-input name="Pricee" v-model="item.Pricee"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" style="text-align: left">元，送</el-col>
            <el-col :span="4">
              <el-form-item
                :prop="`Steps[${index}].Gift`"
                :rules="[
                { required: true, message: '请输入金额！', trigger: 'blur' },
                { validator: giveValidate, trigger: 'blur' }
              ]"
              >
                <el-input name="Gift" v-model="item.Gift"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" style="text-align: left">
              元。 &nbsp;
              <el-button type="text" @click="delSteps(index)">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </template>
      <template v-for="(item, index) in rechargeData.StepsByCreate">
        <el-form-item :key="rechargeData.Steps.length + index" label="充值：" v-if="rechargeData.RechargeType == rechargeType.Step">
          <el-row>
            <el-col :span="4">
              <el-form-item
                :prop="`StepsByCreate[${index}].Priceb`"
                :rules="[
                { required: true, message: '请输入金额！', trigger: 'blur' },
                { validator: giveValidate, trigger: 'blur' }
              ]"
              >
                <el-input name="Priceb" v-model="item.Priceb"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" style="padding-left: 20px;">-</el-col>
            <el-col :span="4">
              <el-form-item
                :prop="`StepsByCreate[${index}].Pricee`"
                :rules="[
                { required: true, message: '请输入金额！', trigger: 'blur' },
                { validator: giveValidate, trigger: 'blur' }
              ]"
              >
                <el-input name="Pricee" v-model="item.Pricee"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" style="text-align: left">元，送</el-col>
            <el-col :span="4">
              <el-form-item
                :prop="`StepsByCreate[${index}].Gift`"
                :rules="[
                { required: true, message: '请输入金额！', trigger: 'blur' },
                { validator: giveValidate, trigger: 'blur' }
              ]"
              >
                <el-input name="Gift" v-model="item.Gift"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" style="text-align: left">
              元
              <el-button type="text" @click="delCreate(index)">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </template>
      <el-form-item v-if="rechargeData.RechargeType == rechargeType.Step">
        <el-row>
          <el-button name="createSteps" type="text" icon="el-icon-plus" @click="createSteps">添加</el-button>
        </el-row>
      </el-form-item>
      <el-form-item label="赠送金额比例：" prop="Rate" v-if="rechargeData.RechargeType == rechargeType.Rate">
        <el-input name="Rate" style="width: 200px" v-model="rechargeData.Rate">
          <span slot="append">%</span>
        </el-input>
      </el-form-item>
      <el-form-item label="充值策略有效期：" prop="dateRange" v-if="rechargeData.RechargeType != rechargeType.None">
        <el-date-picker v-model="rechargeData.dateRange" type="daterange" name="dateRange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="赠送金额有效期：" prop="Months" v-if="rechargeData.RechargeType != rechargeType.None">
        <el-select name="Months" v-model="rechargeData.Months" placeholder="请选择" filterable>
          <el-option v-for="item in months" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button name="saveSettings" type="primary" @click="saveSettings">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { SettingRechargeType } from '@/enums/marketing.js'
import {
  MARKETING_API_SETTING_RECHARGE_GET,
  MARKETING_API_SETTING_RECHARGE_UPDATE
} from '@/apis/marketing.js'
export default {
  data() {
    return {
      rechargeType: SettingRechargeType,
      dateRange: [],
      rechargeData: {},
      rechargeSteps: [],
      months: [
        {
          name: '1个月',
          value: 1
        },
        {
          name: '2个月',
          value: 2
        },
        {
          name: '3个月',
          value: 3
        },
        {
          name: '4个月',
          value: 4
        },
        {
          name: '5个月',
          value: 5
        },
        {
          name: '6个月',
          value: 6
        },
        {
          name: '7个月',
          value: 7
        },
        {
          name: '8个月',
          value: 8
        },
        {
          name: '9个月',
          value: 9
        },
        {
          name: '10个月',
          value: 10
        },
        {
          name: '11个月',
          value: 11
        },
        {
          name: '12个月',
          value: 12
        }
      ],
      rechargeRules: {
        Minimum: [
          {
            required: true,
            message: '请输入金额！',
            trigger: 'blur'
          },
          {
            validator: this.moneyValidate,
            trigger: 'blur'
          }
        ],
        RechargeType: [
          {
            required: true,
            message: '请选择充值赠送类型！',
            trigger: 'change'
          }
        ],
        Rate: [
          {
            required: true,
            message: '请输入比例！',
            trigger: 'blur'
          },
          {
            validator: this.rateValidate,
            trigger: 'blur'
          }
        ],
        dateRange: [
          {
            required: true,
            message: '请选择充值策略有效期！',
            trigger: 'change'
          }
        ],
        Months: [
          {
            required: true,
            message: '请选择赠送金额有效期！',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    init() {
      this.loading = true
      MARKETING_API_SETTING_RECHARGE_GET().then(res => {
        let data = res.data.Data
        this.rechargeData = data.Recharge
        this.rechargeSteps = data.RechargeStep || []
        this.$set(this.rechargeData, 'dateRange', [
          new Date(data.Expireb),
          new Date(data.Expiree)
        ])
        this.$set(this.rechargeData, 'StepsByCreate', [])
        this.$set(this.rechargeData, 'StepsByRemove', [])
        this.loading = false
      })
    },
    update() {
      let params = {}
      params.RechargeType = this.rechargeData.RechargeType
      params.Minimum = this.rechargeData.Minimum
      params.Rate = this.rechargeData.Rate
      params.Expireb = this.rechargeData.dateRange[0]
      params.Expiree = this.rechargeData.dateRange[1]
      params.Months = this.rechargeData.Months
      params.StepsByCreate = this.rechargeData.StepsByCreate
      params.StepsByUpdate = this.rechargeSteps
      params.StepsByRemove = this.rechargeData.StepsByRemove
      MARKETING_API_SETTING_RECHARGE_UPDATE(params)
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            this.resetField()
          }
        })
        .then(() => {
          this.init()
        })
    },
    saveSettings() {
      this.$refs.rechargeData.validate(valid => {
        if (valid) {
          let arr = this.rechargeSteps
          arr = arr.concat(this.rechargeData.StepsByCreate)
          if (this.rechargeData.RechargeType == this.rechargeType.Step) {
            let flag = arr.every((item, index) => {
              if (index == arr.length - 1) {
                return (
                  parseFloat(this.rechargeData.Minimum) <=
                  parseFloat(item.Priceb) &&
                  parseFloat(item.Priceb) < parseFloat(item.Pricee)
                )
              } else {
                return (
                  parseFloat(this.rechargeData.Minimum) <=
                  parseFloat(item.Priceb) &&
                  parseFloat(item.Priceb) < parseFloat(item.Pricee) &&
                  parseFloat(item.Pricee) < parseFloat(arr[index + 1].Priceb) &&
                  parseFloat(item.Gift) < parseFloat(arr[index + 1].Gift)
                )
              }
            })

            if (flag) {
              this.update()
            } else {
              this.$message({
                message: '请正确输入阶梯赠送金额！',
                type: 'warning'
              })
            }
          } else {
            this.update()
          }
        } else {
          return false
        }
      })
    },
    createSteps() {
      this.rechargeData.StepsByCreate.push({
        StepId: 0,
        Priceb: '',
        Pricee: '',
        Gift: ''
      })
    },
    delSteps(index) {
      if (this.rechargeData.Steps.length === 1) {
        this.$message({
          message: '至少保留一条数据！',
          type: 'warning'
        })
      } else {
        this.rechargeData.StepsByRemove.push(this.rechargeData.Steps[index])
        this.rechargeData.Steps.splice(index, 1)
      }
    },
    delCreate(index) {
      this.rechargeData.StepsByCreate.splice(index, 1)
    },
    resetField() {
      this.$refs.rechargeData.clearValidate()
    },

    moneyValidate(rule, value, callback) {
      let reg = /^([1-9]\d*[0]{2})(\.0{1,2})?$/
      if (isNaN(value)) {
        callback(new Error('请正确输入金额！'))
      } else if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('充值金额必须是100的倍数！'))
      }
    },
    rateValidate(rule, value, callback) {
      let reg = /(^([1-9]\d?)(\.\d{1})?$)|(^(0{1})(\.[1-9]{1})$)|(^(100)(\.0{1})?$)/
      if (isNaN(value)) {
        callback(new Error('请正确输入比例！'))
      } else if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('请正确输入比例！'))
      }
    },
    giveValidate(rule, value, callback) {
      let reg = /(^([1-9]\d*)(\.\d{1,2})?$)|(^(0{1})(\.\d{1,2})?$)/
      if (isNaN(value)) {
        callback(new Error('请正确输入金额！'))
      } else if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('请正确输入金额！'))
      }
    }
  },
  mounted() {
    this.init()
  }
}
</script>

<style scoped>
</style>