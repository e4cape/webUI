<template>
  <div class="content">
    <h2 style="text-align:center;font-size:18px">{{titleDate}}员工考勤</h2>
    <table class="table m-t-10">
      <tr>
        <td>状态：
          <span :class="Attendance.Status | findKey(auditStatus)">{{auditStatus.Types[Attendance.Status]}}</span>
          <template v-if="Attendance.Status===auditStatus.Reject||Attendance.Status===auditStatus.Abandon">{{Attendance.CheckNote? `(${Attendance.CheckNote})` : ''}}</template>
        </td>
        <td>考勤月份：{{Attendance.SettleDate}}</td>
        <td>考勤天数：{{Attendance.AttendanceDays}}</td>
        <td>创建时间：{{Attendance.CreateTime}}</td>
        <td>创建人：{{Attendance.CreateUser}}</td>
      </tr>
    </table>
    <el-table :data="tableData" class="m-t-10" fit>
      <el-table-column prop="UserName" label="姓名">
        <template slot-scope="scope">
          <div class="name" :title="scope.row.UserName">{{scope.row.UserName}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="VitaStatus" label="在职状态">
        <template slot-scope="scope">
          {{vitaStatus.Types[scope.row.VitaStatus]}}
        </template>
      </el-table-column>
      <!-- <el-table-column  prop="LeavedTime" label="离职时间"></el-table-column> -->
      <el-table-column prop="WorkDays" label="应出勤天数" width="140"></el-table-column>
      <el-table-column prop="OffpunchCount" label="缺卡（次）"></el-table-column>
      <el-table-column prop="LateCount" label="迟到（次）"></el-table-column>
      <el-table-column prop="LeaveCount" label="早退（次）"></el-table-column>
      <el-table-column prop="AbsenceDays" label="旷工（天）"></el-table-column>
      <el-table-column prop="AffairDays" label="事假（天）"></el-table-column>
      <el-table-column prop="SickDays" label="病假（天）"></el-table-column>
      <!-- <el-table-column  prop="FuneralDays" label="丧假（天）"></el-table-column> -->
      <el-table-column prop="TravelCount" label="出差（天）"></el-table-column>
      <!-- <el-table-column  prop="MarriageDays" label="婚假（天）"></el-table-column> -->
      <el-table-column prop="OrdinaryDays" label="普通加班（天）" width="140"></el-table-column>
      <el-table-column prop="HolidayDays" label="节假日加班（天）" width="150"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import {
  EmployeeVitaStatus
} from '@/enums/performance'
import {
  JunkInnOrderBasicState
} from '@/enums/marketing'
import {
  KPIS_API_SETTLE_ATTENDANCE_BASIC_GET,
  KPIS_API_SETTLE_ATTENDANCE_ITEM_GETS
} from '@/apis/performance'
export default {
  data() {
    return {
      titleDate: '',
      vitaStatus: EmployeeVitaStatus,
      tableData: [],
      Attendance: {
      },
      auditStatus: JunkInnOrderBasicState
    }
  },
  methods: {
    getList() {
      this.$store.commit('SET_TB_LOADING', true)
      KPIS_API_SETTLE_ATTENDANCE_BASIC_GET({
        SettleId: this.$route.params.id 
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if(res.data.Code === 'CORRECT'){
          this.Attendance = res.data.Data
          this.Attendance.SettleDate = dayjs(new Date(this.Attendance.SettleDate)).format('YYYY-MM')
          this.titleDate = dayjs(new Date(this.Attendance.SettleDate)).format('YYYY年MM月')
        }
      })
      KPIS_API_SETTLE_ATTENDANCE_ITEM_GETS ({
        SettleId: this.$route.params.id,
        PageSize:99999,
        PageIndex:1
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if(res.data.Code === 'CORRECT'){
          this.tableData = res.data.Data.Rows
        }
      })
    },
  },
  mounted() {
    this.getList()
  }
}

</script>
<style lang="scss" scoped>
.table {
  border-top: 1px #e5e5e5 solid;
  border-bottom: 1px #e5e5e5 solid;
  width: 100%;
  table-layout: fixed;
  td {
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
}

.name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
