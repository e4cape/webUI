<template>
  <div class="content">
    <el-form :model="Attendance" inline ref="Attendance" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <table class="table fix-error">
        <col width="90px">
        <tr>
          <th>考勤类型</th>
          <th>执行方案</th>
        </tr>
        <tr>
          <td>
            缺卡
          </td>
          <td>
            <div :class="'fix-input '+ (isShow?'input-edit':'')">
              <div :class="atitle">按次固定扣罚</div> <span v-text="Attendance.OffpunchPrice" v-if="!isShow"></span>
              <el-form-item prop="OffpunchPrice" class="mb0" :rules="{validator:ValidateSale}">
                <el-input name="OffpunchPrice" v-model="Attendance.OffpunchPrice" v-if="isShow" @keyup.native="Attendance.OffpunchPrice=$root.toFixed(Attendance.OffpunchPrice, 2)"></el-input>
              </el-form-item>元/次
            </div>
          </td>
        </tr>
        <tr>
          <td>
            迟到
          </td>
          <td>
            <div :class="'fix-input '+ (isShow?'input-edit':'')">
              <div :class="atitle">按次固定扣罚</div> <span v-text="Attendance.LatePrice" v-if="!isShow"></span>
              <el-form-item prop="LatePrice" class="mb0" :rules="{validator:ValidateSale}">
                <el-input name="LatePrice" v-model="Attendance.LatePrice" v-if="isShow" @keyup.native="Attendance.LatePrice=$root.toFixed(Attendance.LatePrice, 2)"></el-input>
              </el-form-item>元/次
            </div>
          </td>
        </tr>
        <tr>
          <td>
            早退
          </td>
          <td>
            <div :class="'fix-input '+ (isShow?'input-edit':'')">
              <div :class="atitle">扣罚</div> <span v-text="Attendance.LeaveDays" v-if="!isShow"></span>
              <el-form-item prop="LeaveDays" class="mb0" :rules="{validator:SelfValidateSale}">
                <el-input name="LeaveDays" v-model="Attendance.LeaveDays" v-if="isShow" @keyup.native="Attendance.LeaveDays=$root.toFixed(Attendance.LeaveDays, 1)"></el-input>
              </el-form-item>天职位工资/次
            </div>
          </td>
        </tr>
        <tr>
          <td>
            旷工
          </td>
          <td>
            <div :class="'fix-input '+ (isShow?'input-edit':'')">
              <div :class="atitle">扣罚</div> <span v-text="Attendance.AbsenceDays" v-if="!isShow"></span>
              <el-form-item prop="AbsenceDays" class="mb0" :rules="{validator:SelfValidateSale}">
                <el-input name="AbsenceDays" v-model="Attendance.AbsenceDays" v-if=" isShow" @keyup.native="Attendance.AbsenceDays=$root.toFixed(Attendance.AbsenceDays, 1)"></el-input>
              </el-form-item>天职位工资/次
            </div>
          </td>
        </tr>
        <tr>
          <td>
            事假
          </td>
          <td>
            <div :class="'fix-input '+ (isShow?'input-edit':'')">
              <div :class="atitle">扣罚</div> <span v-text="Attendance.AffairDays" v-if=" !isShow"></span>
              <el-form-item prop="AffairDays" class="mb0" :rules="{validator:SelfValidateSale}">
                <el-input name="AffairDays" v-model="Attendance.AffairDays" v-if="isShow" @keyup.native="Attendance.AffairDays=$root.toFixed(Attendance.AffairDays, 1)"></el-input>
              </el-form-item>天职位工资/次
            </div>
          </td>
        </tr>
        <tr>
          <td>
            病假
          </td>
          <td>
            <div :class="'fix-input '+ (isShow?'input-edit':'')">
              <div :class="atitle">扣罚</div> <span v-text="Attendance.SickDays" v-if="!isShow"></span>
              <el-form-item prop="SickDays" class="mb0" :rules="{validator:SelfValidateSale}">
                <el-input name="SickDays" v-model="Attendance.SickDays" v-if="isShow" @keyup.native="Attendance.SickDays=$root.toFixed(Attendance.SickDays, 1)"></el-input>
              </el-form-item>天职位工资/次
            </div>
          </td>
        </tr>
        <tr>
          <td>
            加班
          </td>
          <td>
            <div :class="'fix-input '+ (isShow?'input-edit':'')">
              <div :class="atitle">普通加班奖励</div> <span v-text="Attendance.OrdinaryDays" v-if="!isShow"></span>
              <el-form-item prop="OrdinaryDays" class="mb0" :rules="{validator:ValidateSale}">
                <el-input name="OrdinaryDays" v-model="Attendance.OrdinaryDays" v-if="isShow" @keyup.native="Attendance.OrdinaryDays=$root.toFixed(Attendance.OrdinaryDays, 1)"></el-input>
              </el-form-item>天职位工资/天 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 节假日加班奖励
              <span v-text="Attendance.HolidayDays" v-if=" !isShow"></span>
              <el-form-item prop="HolidayDays" class="mb0" :rules="{validator:SelfValidateSale}">
                <el-input name="HolidayDays" v-model="Attendance.HolidayDays" v-if="isShow" @keyup.native="Attendance.HolidayDays=$root.toFixed(Attendance.HolidayDays, 1)"></el-input>
              </el-form-item>天职位工资/天
            </div>
          </td>
        </tr>
        <tr>
          <td>
            出差
          </td>
          <td>
            <div :class="'fix-input '+ (isShow?'input-edit':'')">
              <div :class="atitle">出差补助</div><span v-text="Attendance.TravelPrice" v-if="!isShow"></span>
              <el-form-item prop="TravelPrice" class="mb0" :rules="{validator:ValidateSale}">
                <el-input name="TravelPrice" v-model="Attendance.TravelPrice" v-if="isShow" @keyup.native="Attendance.TravelPrice=$root.toFixed(Attendance.TravelPrice, 2)"></el-input>
              </el-form-item>元/天
            </div>
          </td>
        </tr>

      </table>
      <div class="m-y-20">
        <el-button name="btnEdit" type="primary" @click="edit" v-if="!isShow">编辑</el-button>
        <el-button name="btnSave" type="primary" @click="save" v-if="isShow">保存</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import {
  KPIS_API_SETTING_ATTENDANCE_GET, KPIS_API_SETTING_ATTENDANCE_UPDATE 
} from '@/apis/performance'
export default {
  data() {
    return {
      isShow: false,
      atitle: 'atitle',
      Attendance: {
      },
      AttendanceData: [],
      rules: {
        OffpunchPrice: [
          {
            validator: this.SelfValidateSale 
          }
        ]
      }
    }
  },
  methods: {
    ChangeValue(type) {
      this.AttendanceData.push({
        AttendanceType: type, Value: parseInt(this['Attendance' + type]) 
      })
    },
    edit() {
      this.$data.isShow = true
      this.$data.atitle = 'atitleTop'
    },
    save() {
      this.$refs['Attendance'].validate((valid) => {
        let params = Object.assign({},this.Attendance)
        params.AbsenceDays = this.$root.toInt(params.AbsenceDays)
        params.AffairDays = this.$root.toInt(params.AffairDays)
        params.LatePrice = this.$root.toInt(params.LatePrice)
        params.LeaveDays = this.$root.toInt(params.LeaveDays)
        params.OffpunchPrice = this.$root.toInt(params.OffpunchPrice)
        params.SickDays = this.$root.toInt(params.SickDays)
        params.OrdinaryDays = this.$root.toInt(params.OrdinaryDays)
        params.HolidayDays = this.$root.toInt(params.HolidayDays)
        params.TravelPrice = this.$root.toInt(params.TravelPrice)
        params.FuneralDays = this.$root.toInt(params.FuneralDays)
        params.MarriageDays = this.$root.toInt(params.MarriageDays)
        params.LastUserId = parseInt(params.LastUserId)
        params.CharacterId = parseInt(params.CharacterId)
        if (valid) {
          KPIS_API_SETTING_ATTENDANCE_UPDATE(params).then(res => {
            if(res.data.Code === 'CORRECT'){
              this.$message.success('保存成功!')
            }
            this.isShow = false
          })
        } else {
          return false
        }
      })
    },
    SelfValidateSale(rule, value, callback) {
      const reg = /^(?!(0[0-9]))[+]?(([\d]{0,9}[.]{1}[\d]{1})|([0-9]{0,9}))$/g
      const flag = !reg.test(value)
      if (value === '') {
        callback(new Error('不能为空！'))
      } else if (flag) {
        callback(new Error('输入有误'))
      } else {
        callback()
      }
    },
    ValidateSale(rule, value, callback) {
      const reg = /^(?!(0[0-9]))[+]?(([\d]{0,9}[.]{1}[\d]{1,2})|([0-9]{0,9}))$/g
      const flag = !reg.test(value)
      if (value === '') {
        callback(new Error('不能为空！'))
      } else if (flag) {
        callback(new Error('输入有误'))
      } else {
        callback()
      }
    }
  },
  created () {
    this.$store.commit('SET_TB_LOADING', true)
    KPIS_API_SETTING_ATTENDANCE_GET({
      CharacterId: this.$store.getters.user_session.CharacterId
    }).then(res => {
      this.$store.commit('SET_TB_LOADING', false)
      if(res.data.Code === 'CORRECT'){
        this.Attendance = res.data.Data
        for (let key in this.Attendance){
          if(key.indexOf('Price') !== -1){
            this.Attendance[key] = this.$root.toFloat(this.Attendance[key])
          }
          if(key.indexOf('Days') !== -1){
            this.Attendance[key] = this.$root.toFloat(this.Attendance[key],1)
          }
        }
      }
    })
  }
}

</script>
<style scoped lang="scss">
.table {
  border-top: 1px #eef1f6 solid;
  //border-right: 1px #eef1f6 solid;
  width: 100%;
  font-size: 12px;
}

.table tr td,
.table tr th {
  border-bottom: 1px #eef1f6 solid;
  padding: 0 10px;
 // border-left: 1px #eef1f6 solid;

}
.table tr th{height: 32px;}
.table tr td{font-size: 12px;height: 32px;input{font-size: 12px;}.fix-input{font-size: 12px;}}

.el-form--inline .el-form-item{vertical-align: middle;margin:0;}
.input-edit{
  .el-form-item{vertical-align: middle;margin:0 10px;}
}
.table tr:first-child {
  background: #fafafa;
}

.table input {
  width: 100px;
  display: inline-block;
  color: red;
  margin-left: 6px;
  margin-right: 6px;
  vertical-align: middle;
}

.fix-input{
  vertical-align: middle;
}

.fix-input span {
  margin-left: 6px;
  margin-right: 6px;
  color: red;
  line-height: 32px
}

.atitle {
  //text-align: right;
  float: left;
  //width: 100px;
  line-height: 32px;

}

.atitleTop {
  //text-align: right;
  float: left;
  //width: 100px;
  line-height: 32px;
}

</style>

<style>
.fix-error .el-form-item__error {
  display: none;
}
</style>
