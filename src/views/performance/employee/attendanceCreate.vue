<template>
  <div class="content">
    <div v-if="$route.path.indexOf('create')>0">
      <el-alert class="m-b-10" description="因当前未对接考勤机，员工考勤需要手工填写。" title="温馨提示" type="error" :closable="false"></el-alert>
    </div>
    <el-form :model="Attendance" class="fix-w" ref="tableForm">
      <el-form-item label="考勤月份：" label-width="80px">
        <div>{{this.Attendance.SettleDate}}</div>
      </el-form-item>
      <el-form-item label="考勤天数：" label-width="80px" prop="AttendanceDays" :rules="{validator:selfValidateRage}">
        <el-input name="AttendanceDays" @blur="editWorkDays('tableForm')" v-model="Attendance.AttendanceDays">
          <template slot="append">天</template>
        </el-input>
      </el-form-item>
      <el-table :data="Attendance.Items" v-loading="loading" style="width: 100%" cell-class-name="input-box">
        <el-table-column prop="UserName" label="姓名">
          <template slot-scope="scope">
            <div class="name" :title="scope.row.UserName">{{scope.row.UserName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="VitaStatus" label="在职状态">
          <template slot-scope="scope">
            {{EmployeeVitaStatus.Types[scope.row.VitaStatus]}}
          </template>
        </el-table-column>
        <el-table-column label="出勤天数" min-width="140">
          <template slot-scope="scope">
            <el-form-item style="margin:0" :prop="'Items.' + scope.$index + '.WorkDays'" :rules="{ validator: validateDays, trigger: 'blur'}">
              <el-input name="WorkDays" @focus="resetValidate(scope.$index)" v-model="scope.row.WorkDays"></el-input>
            </el-form-item>
          </template>
        </el-table-column> -->
        <el-table-column label="缺卡（次）">
          <template slot-scope="scope">
            <el-form-item style="margin:0" :prop="'Items.' + scope.$index + '.OffpunchCount'" :rules="{ validator: validateTimes, trigger: 'blur'}">
              <el-input name="OffpunchCount" v-model="scope.row.OffpunchCount"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="迟到（次）">
          <template slot-scope="scope">
            <el-form-item style="margin:0" :prop="'Items.' + scope.$index + '.LateCount'" :rules="{ validator: validateTimes, trigger: 'blur'}">
              <el-input name="LateCount" v-model="scope.row.LateCount"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="早退（次）">
          <template slot-scope="scope">
            <el-form-item style="margin:0" :prop="'Items.' + scope.$index + '.LeaveCount'" :rules="{ validator: validateTimes, trigger: 'blur'}">
              <el-input name="LeaveCount" v-model="scope.row.LeaveCount"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="旷工（天）">
          <template slot-scope="scope">
            <el-form-item :class="{'error': scope.row.isPass}" style="margin:0" :prop="'Items.' + scope.$index + '.AbsenceDays'" :rules="{validator:  validateDays, trigger: 'blur'}">
              <el-input name="AbsenceDays" @focus="resetValidate(scope.$index)" v-model="scope.row.AbsenceDays"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="出差（天）">
          <template slot-scope="scope">
            <el-form-item :class="{'error': scope.row.isPass}" style="margin:0" :prop="'Items.' + scope.$index + '.TravelCount'" :rules="{validator: validateDays, trigger: 'blur'}">
              <el-input name="TravelCount" @focus="resetValidate(scope.$index)" v-model="scope.row.TravelCount"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column  label="事假（天）">
          <template slot-scope="scope">
            <el-form-item :class="{'error': scope.row.isPass}" style="margin:0" :prop="'Items.' + scope.$index + '.AffairDays'" :rules="{validator: validateDays, trigger: 'blur'}">
              <el-input name="AffairDays" @focus="resetValidate(scope.$index)" v-model="scope.row.AffairDays"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="病假（天）">
          <template slot-scope="scope">
            <el-form-item :class="{'error': scope.row.isPass}" style="margin:0" :prop="'Items.' + scope.$index + '.SickDays'" :rules="{validator: validateDays, trigger: 'blur'}">
              <el-input name="SickDays" @focus="resetValidate(scope.$index)" v-model="scope.row.SickDays"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="丧假（天）">
          <template slot-scope="scope">
            <el-form-item style="margin:0" :prop="'Items.' + scope.$index + '.FuneralDays'" :rules="{validator: validateDays, trigger: 'blur'}">
              <el-input v-model="scope.row.FuneralDays"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="婚假（天）">
          <template slot-scope="scope">
            <el-form-item style="margin:0" :prop="'Items.' + scope.$index + '.MarriageDays'" :rules="{validator: validateDays, trigger: 'blur'}">
              <el-input  v-model="scope.row.MarriageDays"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="普通加班（天）" min-width="110">
          <template slot-scope="scope">
            <el-form-item style="margin:0" :prop="'Items.' + scope.$index + '.OrdinaryDays'" :rules="{validator: validateExtraDays, trigger: 'blur'}">
              <el-input name="OrdinaryDays" v-model="scope.row.OrdinaryDays"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="节假日加班（天）" min-width="120">
          <template slot-scope="scope">
            <el-form-item style="margin:0" :prop="'Items.' + scope.$index + '.HolidayDays'" :rules="{validator: validateExtraDays, trigger: 'blur'}">
              <el-input name="HolidayDays" v-model="scope.row.HolidayDays"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <br>
    <el-button name="btnAudit" type="primary" @click="update('tableForm',3)">提交审核</el-button>
    <el-button name="btnSave" type="primary" @click="update('tableForm',1)">保存草稿</el-button>
    <el-button name="btnCancel" type="primary" @click="back">取消</el-button>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { EmployeeVitaStatus } from '@/enums/performance'
import { JunkInnOrderBasicState } from '@/enums/marketing'
import {
  KPIS_API_SETTLE_ATTENDANCE_BASIC_UPDATE,
  KPIS_API_SETTLE_ATTENDANCE_BASIC_GET,
  KPIS_API_SETTLE_ATTENDANCE_ITEM_GETS
} from '@/apis/performance'
export default {
  data() {
    return {
      EmployeeVitaStatus,
      auditStatus: JunkInnOrderBasicState,
      Attendance: {},
      tableData: [],
      updateAttendance: {},
      loading: true
    }
  },
  methods: {
    // 获取考勤详情
    async getData() {
      let res1 = await KPIS_API_SETTLE_ATTENDANCE_BASIC_GET({
        SettleId: this.$route.params.id
      })
      if (
        res1.data.Data.Status === this.auditStatus.Audit ||
        res1.data.Data.Status === this.auditStatus.Abandon
      ) {
        this.$router.go(-1)
      } else {
        this.Attendance = res1.data.Data
        this.Attendance.SettleDate = dayjs(
          new Date(this.Attendance.SettleDate)
        ).format('YYYY-MM')
      }
      let res2 = await KPIS_API_SETTLE_ATTENDANCE_ITEM_GETS({
        SettleId: this.$route.params.id,
        PageSize: 99999,
        PageIndex: 1
      })
      if (res2.data.Code === 'CORRECT') {
        this.$set(this.Attendance,'Items',res2.data.Data.Rows)
        this.tableData = res2.data.Data.Rows
        this.tableData.forEach(item => {
          this.$set(item, 'isPass', false)
        })
      }
      this.loading = false
    },
    editWorkDays() {
      let date = new Date(this.Attendance.SettleDate)
      let curMonthDays = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDate()
      if (this.Attendance.AttendanceDays > curMonthDays) {
        return false
      }
      this.tableData.forEach(item => {
        item.WorkDays = this.Attendance.AttendanceDays
      })
    },
    // 验证重置
    resetValidate(index) {
      this.tableData[index].isPass = false
    },
    // 验证出勤天数
    flag() {
      let flag = true
      this.tableData.forEach(item => {
        if (
          parseFloat(item.WorkDays) <
          parseFloat(item.AbsenceDays) +
            parseFloat(item.AffairDays) +
            parseFloat(item.SickDays) +
            parseFloat(item.TravelCount)
        ) {
          item.isPass = true
          flag = false
        }
      })
      return flag
    },
    // 提交
    update(formName, status) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.flag()) {
            this.updateAttendance.SettleId = this.Attendance.SettleId
            this.updateAttendance.AttendanceDays = parseInt(this.Attendance.AttendanceDays)
            this.updateAttendance.Status = status
            this.updateAttendance.UpdateItems = this.tableData.map(item => {
              let res = {}
              for (var key in item) {
                if (
                  key !== 'LeavedTime' &&
                  key !== 'UserName' &&
                  key != 'VitaStatus'
                ) {
                  res[key] = item[key]
                }
              }
              return res
            })
            this.attendanceUpdate()
          }
        } else {
          return false
        }
      })
    },
    // 更新考勤接口
    attendanceUpdate() {
      let params = Object.assign({},this.updateAttendance)
      params.UpdateItems.forEach(item => {
        for(let key in item){
          if(key.indexOf('Days') !== -1 || key.indexOf('Count') !== -1 ){
            item[key] = parseInt(item[key])
          }
          delete item.isPass
        }
      })
      KPIS_API_SETTLE_ATTENDANCE_BASIC_UPDATE(params).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (this.$route.path.indexOf('create') > 0) {
            this.$router.push('/performance/employee/attendancelist')
          } else {
            this.$router.go(-1)
          }
        }
      })
    },
    // 返回
    back() {
      this.$router.go(-1)
    },
    selfValidateRage(rule, value, callback) {
      let date = new Date(this.Attendance.SettleDate)
      let curMonthDays = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDate()
      const reg = /^[1-9]{1}[0-9]*$/g
      const flag = reg.test(value)
      if (value === '') {
        callback()
      } else if (!flag || value > curMonthDays) {
        callback(new Error('请正确输入！'))
      } else {
        callback()
      }
    },
    validateTimes(rule, value, callback) {
      var reg = new RegExp(/^([1-9]\d*|[0]{1,1})$/)
      if (value === '') {
        callback()
      }
      if (!reg.test(value)) {
        callback(new Error())
      } else {
        callback()
      }
    },
    validateDays(rule, value, callback) {
      var reg = new RegExp(/^([1-9]\d*|[0]{1,1})$/)
      if (value == '') {
        callback()
      }
      if (!reg.test(value) || value > this.Attendance.AttendanceDays) {
        callback(new Error())
      } else {
        callback()
      }
    },
    validateExtraDays(rule, value, callback) {
      var reg = new RegExp(
        /^([1-9]\d*|[0]{1,1}|([1-9]\d*|[0]{1})[.]{1}[0-9]{1})$/
      )
      if (value == '') {
        callback()
      }
      if (!reg.test(value) || value > this.Attendance.AttendanceDays) {
        callback(new Error())
      } else {
        callback()
      }
    }
  },
  mounted() {
    this.getData()
  }
}
</script>
<style lang="scss" scoped>
.bb-1 {
  padding-bottom: 20px;
  border-bottom: 1px #ddd solid;
}

.list {
  vertical-align: middle;
  line-height: 40px;
  margin-bottom: 20px;
  .days {
    width: 200px;
    display: flex;
    white-space: nowrap;
  }
}

.name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
<style lang="scss">
.error .el-input__inner {
  border-color: #fa5555 !important;
}
.input-box {
  .el-input {
    width: 100% !important;
  }
}
</style>
