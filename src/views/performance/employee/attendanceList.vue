<template>
  <div class="content">
    <el-form :inline="true" ref="form" class="item-lh-26" :model="form" @keyup.enter.native="onSearch">
      <search-panel @onSearch="onSearch" @onReset="onReset" :isSenior="false">
        <template slot="btnBox">
          <el-form-item>
            <el-button name="btnCreate" type="primary" @click="iShow=true">新建</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-select name="Status" v-model="form.Status" @change="onSearch">
              <el-option label="所有状态" value></el-option>
              <el-option v-for="item in auditStatus.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker name="SettleDate" v-model="form.SettleDate" type="month" @change="onSearch" placeholder="选择月" value-format="yyyy-MM"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" v-loading="loading">
      <el-table-column prop="SettleDate" label="考勤月份" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.SettleDate | filterMonth}}
        </template>
      </el-table-column>
      <el-table-column prop="AttendanceDays" label="考勤天数" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ItemAmt" label="员工数量" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Status" label="状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="scope.row.Status | findKey(auditStatus)">{{auditStatus.Types[scope.row.Status]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <router-link name="btnDetail" class="el-button el-button--text el-button--mini" :to="{path:'/performance/employee/attendancedetail/'+scope.row.SettleId}">详情</router-link>
          <el-button name="btnAudit" v-if="scope.row.Status===auditStatus.Wait" type="text" @click="popupAuditDialog(scope.row.SettleId)">审核</el-button>
          <router-link
            name="btnEdit"
            class="el-button el-button--text el-button--mini"
            v-if="scope.row.Status===auditStatus.Draft||scope.row.Status===auditStatus.Reject"
            :to="{path:'/performance/employee/attendanceedit/'+scope.row.SettleId}"
          >修改</router-link>
          <el-button name="btnInvalid" v-if="scope.row.Status===auditStatus.Wait || scope.row.Status===auditStatus.Draft || scope.row.Status===auditStatus.Reject" type="text" @click="popupAbandonDialog(scope.row.SettleId)">作废</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- 新增考勤 -->
    <el-dialog title="新增考勤" :visible.sync="iShow" width="400px" @close="resetForm('createForm')">
      <div style="margin-bottom: 10px;color:#F56C6C">注意：未设置职级的员工不能新增考勤！</div>
      <el-form :model="createForm" ref="createForm" :rules="dateRules" label-width="90px">
        <el-form-item label="日期：" prop="SettleDate">
          <el-date-picker name="SettleDate" v-model="createForm.SettleDate" type="month" placeholder="选择日期" :editable="false" disabled></el-date-picker>
        </el-form-item>
        <el-form-item label="考勤天数：" prop="AttendanceDays">
          <el-input name="AttendanceDays" v-model="createForm.AttendanceDays" style="width:222px">
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnEnterCearte" type="primary" @click="enterCreate('createForm')">确定</el-button>
        <el-button name="btnCancel" @click="iShow = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 审核 -->
    <el-dialog title="审核" :visible.sync="auditShow" width="400px" @close="resetForm('form')">
      <el-form :model="auditForm" ref="form" :rules="rules">
        <el-form-item prop="res">
          <el-radio-group name="res" v-model="auditForm.res">
            <el-radio label="1">审核通过</el-radio>
            <el-radio label="2">审核退回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="auditForm.res==='2'" prop="CheckNote">
          <el-input name="CheckNote" type="text" v-model="auditForm.CheckNote" placeholder="退回原因" :maxlength="20" @blur="checkNoteTrim('auditForm')">
            <template slot="suffix">{{auditForm.CheckNote?auditForm.CheckNote.length:0}}/20</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnEnterAudit" type="primary" @click="audit('form')">确 定</el-button>
        <el-button name="btnCancel" @click="auditShow = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 作废 -->
    <el-dialog title="作废" :visible.sync="abandonDialog" width="400px" @close="resetForm('abandonForm')">
      <el-form :model="abandonForm" ref="abandonForm" :rules="abandonRules">
        <el-form-item prop="CheckNote">
          <el-input name="CheckNote" type="textarea" v-model="abandonForm.CheckNote" placeholder="作废原因" :maxlength="200" @blur="checkNoteTrim('abandonForm')">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnAbandon" type="primary" @click="abandon('abandonForm')">确 定</el-button>
        <el-button name="btnCancel" @click="abandonDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import searchPanel from '@/components/searchPanel'
import pagination from '@/components/pagination'
import dayjs from 'dayjs'
import { JunkInnOrderBasicState } from '@/enums/marketing'
import {
  KPIS_API_SETTLE_ATTENDANCE_BASIC_CREATE,
  KPIS_API_SETTLE_ATTENDANCE_BASIC_AUDIT,
  KPIS_API_SETTLE_ATTENDANCE_BASIC_REJECT,
  KPIS_API_SETTLE_ATTENDANCE_BASIC_ABANDON,
  KPIS_API_SETTLE_ATTENDANCE_BASIC_GETS
} from '@/apis/performance'
export default {
  data() {
    return {
      // 搜索项
      form: {
        SettleDate: '',
        Status: 0,
        PageIndex: 1,
        PageSize: 20
      },
      parameter: {
        SettleDate: '',
        Status: '0',
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      loading: true,
      // 审核状态枚举
      auditStatus: JunkInnOrderBasicState,
      // 表格数据
      tableData: [],
      // 新增考勤参数
      createForm: {},
      iShow: false,
      // 考勤审核
      settleId: '',
      auditShow: false,
      auditForm: {
        res: '1'
      },
      // 作废
      abandonDialog: false,
      abandonForm: {
        CheckNote: ''
      },
      // 表单验证
      rules: {
        res: [
          {
            required: true,
            message: '请选择审核结果',
            trigger: 'change'
          }
        ],
        CheckNote: [
          {
            required: true,
            message: '审核回退原因是必填项',
            trigger: 'blur'
          },
          {
            max: 20,
            message: '字数不可以超过20字！',
            trigger: 'blur'
          }
        ]
      },
      dateRules: {
        // SettleDate: [
        //   { required: true, message: '请选择日期', trigger: 'change' }
        // ],
        AttendanceDays: [
          {
            required: true,
            validator: this.selfValidateRage
          }
        ]
      },
      abandonRules: {
        CheckNote: [
          {
            required: true, message: '作废原因是必填项！', trigger: 'blur' 
          },
          {
            max: 200, message: '字数不可以超过200字！', trigger: 'blur' 
          }
        ]
      }
    }
  },
  components: {
    searchPanel,
    pagination
  },
  methods: {
    getPreMonth() {
      var month = new Date().getMonth() === 0 ? 12 : new Date().getMonth()
      var year =
        new Date().getMonth() === 0
          ? new Date().getFullYear() - 1
          : new Date().getFullYear()
      this.createForm.SettleDate = new Date(year, month - 1)
    },
    initRoute() {
      this.$router.replace({
        path: '/performance/employee/attendancelist',
        query: this.parameter
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.Status = query.Status || ''
      this.parameter.SettleDate = query.SettleDate ? query.SettleDate + '-01' : ''
      this.parameter.PageIndex = parseInt(query.PageIndex) || 1
      this.parameter.PageSize = parseInt(query.PageSize) || 20
      this.getData()
    },
    getData() {
      this.form = Object.assign(this.form, this.parameter)
      this.loading = true
      KPIS_API_SETTLE_ATTENDANCE_BASIC_GETS(this.form).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
        this.loading = false
      })
    },
    currentChange(val) {
      // 切换当前页
      this.parameter.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameter.PageIndex = 1
      this.parameter.PageSize = val
      this.initRoute()
    },
    onSearch() {
      // 搜索相关
      this.form.PageIndex = 1
      // this.$data.set('parameter',Object.assign(this.parameter, this.form))
      this.parameter = JSON.parse(JSON.stringify(this.form))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      this.$refs.form.resetFields()
      this.onSearch()
    },
    // 新增考勤
    enterCreate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.createForm.SettleDate =
            dayjs(new Date(this.createForm.SettleDate)).format('YYYY-MM') +
            '-01'
          let params = Object.assign(
            { CharacterId: this.$store.getters.user_session.CharacterId },
            this.createForm
          )
          params.AttendanceDays = parseInt(params.AttendanceDays)
          KPIS_API_SETTLE_ATTENDANCE_BASIC_CREATE(params).then(res => {
            if (res.data.Code === 'CORRECT') {
              // TODO: 下期后台再做新建员工并编辑提交
              // this.$router.push({
              //   path: '/performance/employee/attendancecreate/' + res.data.Data
              // })
              this.iShow = false
              this.getData()
            }
          })
        }
      })
    },
    // 表单验证
    selfValidateRage(rule, value, callback) {
      this.createForm.SettleDate = new Date(this.createForm.SettleDate)
      let curMonthDays = new Date(
        this.createForm.SettleDate.getFullYear(),
        this.createForm.SettleDate.getMonth() + 1,
        0
      ).getDate()
      const reg = /^[1-9]{1}[0-9]*$/g
      const flag = reg.test(value)
      if (value === '') {
        callback(new Error('考勤天数是必填项！'))
      } else if (!flag || value > curMonthDays) {
        callback(new Error('请正确输入！'))
      } else {
        callback()
      }
    },
    // 审核功能
    popupAuditDialog(id) {
      this.auditShow = true
      this.settleId = id
    },
    audit(formName) {
      let res
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.auditForm.res === '1') {
            res = KPIS_API_SETTLE_ATTENDANCE_BASIC_AUDIT({
              DataId: this.settleId + ''
            })
          } else {
            res = KPIS_API_SETTLE_ATTENDANCE_BASIC_REJECT({
              DataId: this.settleId + '',
              CheckNote: this.auditForm.CheckNote
            })
          }
          res.then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.getData()
            }
          })
          this.auditShow = false
        }
      })
    },
    // 作废
    popupAbandonDialog(id) {
      this.abandonDialog = true
      this.settleId = id
    },
    abandon(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          KPIS_API_SETTLE_ATTENDANCE_BASIC_ABANDON({
            DataId: this.settleId + '',
            CharacterId: this.$store.getters.user_session.CharacterId,
            CheckNote: this.abandonForm.CheckNote,
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success', message: res.data.Message 
              })
              this.getData()
            }
          })
          this.abandonDialog = false
        }
      })
    },
    resetForm(name) {
      this.$refs[name].resetFields()
    },
    checkNoteTrim(formName){
      if(this[formName].CheckNote && this[formName].CheckNote.length > 0){
        this[formName].CheckNote = this[formName].CheckNote.trim()
      }
    }
  },
  mounted() {
    this.getPreMonth()
    this.init()
  },
  watch: {
    $route: 'init'
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
  line-height: 35px;
}

.radios {
  display: flex;
  height: 40px;
  line-height: 40px;
}
</style>
