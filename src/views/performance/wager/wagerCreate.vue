<template>
  <div class="content-view p-20">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="type" label="对赌类型" width="200"></el-table-column>
      <el-table-column prop="note" label="说明"></el-table-column>
    </el-table>
    <div class="m-y-20">
      <el-form ref="form" class="w-400" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="对赌类型">
          <el-radio-group name="WagerType" v-model="form.WagerType">
            <el-radio-button :label="WagerType.Pers">个人</el-radio-button>
            <el-radio-button :label="WagerType.Team">团队</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="姓名" prop="EmployeeId">
          <el-select name="UserId" v-model="form.UserId" filterable @change="NameChange" placeholder="请选择">
            <el-option v-for="item in NameList" :key="item.Value" :label="item.Name" :value="item.Value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="Job">
          <span>{{form.Position}}</span>
        </el-form-item>
        <el-form-item label="对赌业绩团队" prop="DepartmentId" v-if="form.WagerType==WagerType.Team">
          <el-select name="DepartmentId" v-model="form.DepartmentId" filterable @change="DeptChange" placeholder="请选择">
            <el-option v-for="item in $store.getters.departments" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="对赌业绩目标" prop="TargetPrice">
          <el-input name="TargetPrice" v-model="form.TargetPrice"></el-input>
        </el-form-item>
        <el-form-item label="对赌金额" prop="BasicPrice">
          <el-input name="BasicPrice" v-model="form.BasicPrice"></el-input>
        </el-form-item>
        <el-form-item label="业绩完成奖励金额" prop="RewardPrice">
          <el-input name="RewardPrice" v-model="form.RewardPrice"></el-input>
        </el-form-item>
        <el-form-item label="对赌业绩周期" prop="CycleMonths">
          <el-input name="CycleMonths" v-model="form.CycleMonths" :maxlength="2" type="text">
            <template slot="append">个月</template>
          </el-input>
        </el-form-item>
        <el-form-item label="每月扣减金额" prop="DecredPrice">
          <el-input name="DecredPrice" v-model="form.DecredPrice">
            <template slot="append">扣完即止</template>
          </el-input>
        </el-form-item>
        <el-form-item label="开始年月" prop="Expireb">
          <el-date-picker name="Expireb" type="month" placeholder="选择日期" :picker-options="pickerOptions" :editable="false" v-model="form.Expireb" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button name="btnSaveSubmit" type="primary" @click="onSubmit(auditStatus.Wait)">保存并提交</el-button>
          <el-button name="btnSubmit" type="default" @click="onSubmit(auditStatus.Draft)">保存草稿</el-button>
          <el-button name="btnCancel" type="info" plain @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { JunkInnOrderBasicState } from '@/enums/marketing'
import { WagerType } from '@/enums/performance'
import { EnableState } from '@/enums/common'
import {
  KPIS_API_WAGER_CREATE,
  KPIS_API_EMPLOYEE_EMPLOYEELIST
} from '@/apis/performance'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      tableData: [
        {
          type: '个人',
          note: '对赌类型个人，指个人对赌个人在一定期限内完成规定的业绩，业绩完成，获得奖励，业绩未完成，没有奖励，同时不退还对赌金额。'
        }, {
          type: '团队',
          note: '对赌类型团队，指个人对赌一个团队在一定期限内完成规定的业绩，业绩完成，获得奖励，业绩未完成，没有奖励，同时不退还对赌金额。'
        }
      ],
      auditStatus: JunkInnOrderBasicState,
      WagerType,
      form: {
        WagerType: 1,
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
        Department: '',
        Expireb: '',
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
        ]
      },
      NameList: [],
      DepartList: [],
      MaterialList: []
    }
  },
  mounted() {
    this.$store.dispatch('GET_DEPARTMENTS_DROPLIST', { State: EnableState.Enable, CharacterId: this.$store.getters.user_session.CharacterId })
    KPIS_API_EMPLOYEE_EMPLOYEELIST({
      SignedTime: dayjs(new Date).format('YYYY-HH') + '-01'
    }).then(res => {
      if (res.data.Code === 'CORRECT') {
        this.NameList = res.data.Data
      }
    })
  },
  methods: {
    DeptChange(value) {
      this.form.Department = this.$store.getters.departments.find(m => m.Id == value).Value
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
    NameChange(val) {
      const NameCur = this.NameList.find(m => m.Value === val)
      this.form.Position = NameCur.Position
      this.form.PositionId = NameCur.PositionId
      this.form.UserName = NameCur.Name
    },
    SelfValidateSale(rule, value, callback) {
      const reg = /^(?!(0[0-9]|^(0\.[0]+)$))[+]?(([\d]{1,9}[.]{1}[\d]{1,2})|([1-9][0-9]{0,8}))$/g
      const flag = reg.test(value)
      if (value === '') {
        callback(new Error('不能为空！'))
      } else if (!flag) {
        callback(new Error('请正确输入！'))
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
        callback(new Error('请正确输入！'))
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
    onSubmit(Status) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let params = Object.assign({ Status }, this.form)
          params.MaterialTypes = params.MaterialTypes.join(',')
          params.Expireb = dayjs(params.Expireb).format('YYYY-MM-DD')
          for (let key in params) {
            if (key.indexOf('Price') !== -1) {
              params[key] = this.$root.toInt(params[key])
            }
          }
          params.CycleMonths = parseInt(params.CycleMonths)
          if (this.form.CycleMonths == 1 && this.form.DecredPrice * this.form.CycleMonths != this.form.BasicPrice) {
            this.$message({
              message: '当对赌业绩周期为1个月的时候，每月扣减金额必须等于“对赌金额÷对赌业绩周期”的值',
              type: 'warning'
            })
            return
          }
          if (this.form.DecredPrice * this.form.CycleMonths > this.form.BasicPrice) {
            this.$message({
              message: '每月扣减金额等于或小于“对赌金额÷对赌业绩周期”的值',
              type: 'warning'
            })
            return
          }
          if (params.WagerType === this.WagerType.Pers) {
            delete params.Department
            delete params.DepartmentId
          }
          KPIS_API_WAGER_CREATE(params).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '创建成功！',
                type: 'success'
              })
              this.$router.push('/performance/wager/wagerlist')
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
