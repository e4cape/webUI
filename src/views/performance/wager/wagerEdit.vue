<template>
  <div class="content">
    <el-form ref="form" class="fix-w" :model="form" :rules="rules" label-width="94px">
      <el-form-item label="对赌类型">
        <span>{{WagerType.Types[form.WagerType]}}</span>
      </el-form-item>
      <el-form-item label="姓名">
        <span>{{form.UserName}}</span>
      </el-form-item>
      <el-form-item label="职位">
        <span>{{form.Position}}</span>
      </el-form-item>
      <el-form-item label="对赌业绩团队" prop="DepartmentId" v-if="form.WagerType=='3'">
        <el-select name="DepartmentId" v-model="form.DepartmentId" filterable @change="DeptChange" placeholder="请选择">
          <el-option v-for="item in dropDownDepartments" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业绩目标" prop="TargetPrice">
        <el-input name="TargetPrice" v-model.number="form.TargetPrice"></el-input>
      </el-form-item>
      <el-form-item label="对赌金额" prop="BasicPrice">
        <el-input name="BasicPrice" v-model.number="form.BasicPrice"></el-input>
      </el-form-item>
      <el-form-item label="奖励金额" prop="RewardPrice">
        <el-input name="RewardPrice" v-model.number="form.RewardPrice"></el-input>
      </el-form-item>
      <el-form-item label="业绩周期" prop="CycleMonths">
        <el-input name="CycleMonths" v-model.number="form.CycleMonths" :maxlength="2">
          <template slot="append">个月</template>
        </el-input>
      </el-form-item>
      <el-form-item label="每月扣减" prop="DecredPrice">
        <el-input name="DecredPrice" v-model.number="form.DecredPrice">
          <template slot="append">扣完即止</template>
        </el-input>
      </el-form-item>
      <el-form-item label="开始日期" prop="Expireb" required>
        <el-date-picker name="Expireb" type="month" placeholder="选择日期" :picker-options="pickerOptions" :editable="false" v-model="form.Expireb" style="width: 100%;"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button name="btnSaveSubmit" type="primary" @click="update(auditStatus.Wait)">保存并提交</el-button>
        <el-button name="btnSubmit" type="default" @click="update(auditStatus.Draft)">保存草稿</el-button>
        <el-button name="btnCancel" type="info" plain @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { JunkInnOrderBasicState } from '@/enums/marketing'
import { WagerType } from '@/enums/performance'
import { EnableState } from '@/enums/common'
import {
  KPIS_API_WAGER_GET,
  KPIS_API_WAGER_UPDATE
} from '@/apis/performance'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      auditStatus: JunkInnOrderBasicState,
      WagerType,
      form: {
        WagerType: '',
        position: '',
        UserId: '',
        UserName: '',
        PositionId: '',
        MaterialTypes: [],
        TargetPrice: '',
        RewardPrice: '',
        BasicPrice: '',
        CycleMonths: '',
        DecredPrice: '',
        DepartmentId: '',
        Expireb: ''
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      rules: {
        UserName: [
          {
            required: true, message: '参与人员', trigger: 'change'
          }
        ],
        DepartmentId: [
          {
            required: true, type: 'number', message: '请选择部门', trigger: 'change'
          }
        ],
        MaterialTypes: [
          {
            required: true, type: 'array', message: '请选择品类', trigger: 'change'
          }
        ],
        TargetPrice: [
          {
            required: true, message: '不能为空！'
          },
          {
            validator: this.SelfValidateSale
          },
        ],
        Expireb: [
          {
            required: true, type: 'date', message: '请选择开始日期', trigger: 'change'
          }
        ],
        RewardPrice: [
          {
            required: true, message: '不能为空！'
          },
          {
            validator: this.SelfValidateSale
          },
        ],
        BasicPrice: [
          {
            required: true, message: '不能为空！'
          },
          {
            validator: this.SelfValidateSale
          },
        ],
        DecredPrice: [
          {
            required: true, message: '不能为空！'
          },
          {
            validator: this.SelfValidateSale
          },
        ],
        CycleMonths: [
          {
            required: true, message: '不能为空！'
          },
          {
            validator: this.cycleMonthsValid
          },
        ],
      },
      NameList: [],
      MaterialList: []
    }
  },
  computed: {
    dropDownDepartments() {
      return this.$store.getters.departments
    }
  },
  mounted() {
    // 部门
    this.$store.dispatch('GET_DEPARTMENTS_DROPLIST', { State: EnableState.Enable, CharacterId: this.$store.getters.user_session.CharacterId })
    // 详情数据
    KPIS_API_WAGER_GET({
      WagerId: this.$route.params.id
    }).then(res => {
      if (res.data.Code === 'CORRECT') {
        let $data = res.data.Data
        if ($data.Status == this.auditStatus.Audit || $data.Status == this.auditStatus.Abandon) {
          this.$message({
            message: '已经审核过或已作废的对赌信息不可编辑！',
            type: 'warning'
          })
          this.$router.push('/wager/wagerlist')
        }
        this.form = $data
        for (let key in this.form) {
          if (key.indexOf('Price') !== -1) {
            this.form[key] = this.$root.toFloat(this.form[key])
          }
        }
        this.form.Expireb = new Date(res.data.Data.Expireb)
        // /this.form.DepartmentId = res.data.Data.DepartmentId.toString()
      }
    })
    // this.CompeteType = this.TypeList.find(m=>m.Value = this.form.CompeteType).Name
  },
  methods: {
    DeptChange(value) {
      this.form.Department = this.DepartList.find(m => m.Value == value).Name

    },
    SelfValidateSale(rule, value, callback) {
      const reg = /^(?!(0[0-9]|^(0\.[0]+)$))[+]?(([\d]{1,9}[.]{1}[\d]{1,2})|([1-9][0-9]{0,8}))$/g
      const flag = reg.test(value)
      if (value === '') {
        callback(new Error('不能为空！'))
      } else if (!flag) {
        callback(new Error('请正确输入'))
      } else {
        callback()
      }
    },
    SelfValidateSaleInt(rule, value, callback) {
      const reg = /^[1-9]{1}[0-9]{0,8}$/g
      const flag = reg.test(value)
      if (value === '') {
        callback(new Error('不能为空！'))
      } else if (!flag) {
        callback(new Error('请正确输入1'))
      } else {
        callback()
      }
    },
    cycleMonthsValid(rule, value, callback) {
      const reg = /^[1-9]{1}[0-9]?$/g
      const flag = reg.test(value)
      if (value === '') {
        callback(new Error('不能为空！'))
      } else if (!flag || parseInt(value) > 12) {
        callback(new Error('请正确输入！'))
      } else {
        callback()
      }
    },
    MaterialTypeManage(val) {
      if (val.indexOf(0) !== -1) {
        this.form.MaterialTypes = []
        this.MaterialList.forEach(m => {
          if (m.Value !== 0) {
            this.form.MaterialTypes.push(m.Value)
          }
        })
      }
    },
    update(status) {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let params = Object.assign({
          }, this.form, {
            Status: status
          })
          if (this.form.CycleMonths == 1 && this.form.DecredPrice * this.form.CycleMonths != this.form.BasicPrice) {
            this.$message({
              message: '当对赌业绩周期为1个月的时候，每月扣减金额必须等于“对赌金额÷对赌业绩周期”的值',
              type: 'warning'
            })
            return
          }
          if (this.form.DecredPrice * this.form.CycleMonths > this.form.BasicPrice) {
            this.$message({
              message: '每月扣减金额大于或等于“对赌金额÷对赌业绩周期”的值',
              type: 'warning'
            })
            return
          }
          for (let key in params) {
            if (key.indexOf('Price') !== -1) {
              params[key] = this.$root.toInt(params[key])
            }
          }
          params.Expireb = params.Expireb ? dayjs(new Date(params.Expireb)).format('YYYY-MM-DD') : ''
          KPIS_API_WAGER_UPDATE(params).then(data => {
            if (data.data.Code === 'CORRECT') {
              this.$message({
                message: '创建成功！',
                type: 'success'
              })
              this.$router.go(-1)
            }
          })
        }
      })
    },
    onCancel() {
      this.$router.go(-1)
    }
  }
}

</script>
<style scoped>
.w-400 {
  width: 520px;
}
</style>
