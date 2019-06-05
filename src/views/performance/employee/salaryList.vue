<template>
  <div class="content">
    <el-form :model="form" ref="search" label-width="120px" class="item-lh-26" :inline="true" @keyup.enter.native="onSearch">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-button name="btnCreate" type="primary" @click="iShow = true">生成工资表</el-button>
            <el-button name="btnExport" @click="exportSheet">导出报表</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="Status">
            <el-select name="Status" v-model="form.Status" @change="onSearch">
              <el-option label="所有状态" value=""></el-option>
              <el-option v-for="item in auditStatus.TypeArray" :key="parseInt(item.KeyId)" :label="item.Value" :value="parseInt(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="工资年份：" prop="Year">
            <el-date-picker name="Year" v-model="form.Year" type="year" placeholder="选择年" value-format="yyyy"></el-date-picker>
          </el-form-item>
          <el-form-item label="工资月份：" prop="Month">
            <el-select name="Month" v-model="form.Month" placeholder="请选择">
              <el-option label="全部" :value="0"></el-option>
              <el-option v-for="value in months" :key="value" :label="value" :value="value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select name="Status" v-model="form.Status" placeholder="请选择">
              <el-option label="所有状态" value=""></el-option>
              <el-option v-for="item in auditStatus.TypeArray" :key="parseInt(item.KeyId)" :label="item.Value" :value="parseInt(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" v-loading="loading" style="width: 100%">
      <el-table-column prop="SettleDate" label="工资月份" show-overflow-tooltip>
        <template slot-scope="scope">
         {{scope.row.SettleDate | filterMonth}}
        </template>
      </el-table-column>
      <el-table-column prop="ItemAmt" label="员工数量" show-overflow-tooltip></el-table-column>
      <el-table-column prop="WaitPrice" label="应发工资总额" :formatter="priceFormatter" show-overflow-tooltip></el-table-column>
      <el-table-column prop="WithholdPrice" label="代扣代缴总额" :formatter="priceFormatter" show-overflow-tooltip></el-table-column>
      <el-table-column prop="RealPrice" label="实发工资总额" :formatter="priceFormatter" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Status" label="状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="scope.row.Status | findKey(auditStatus)">{{auditStatus.Types[scope.row.Status]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <router-link name="btnDetail" class="el-button el-button--text el-button--mini" :to="{path:'/performance/employee/salarydetail/'+scope.row.SettleId}">详情</router-link>
          <el-button name="btnAudit" type="text" v-if="scope.row.Status === auditStatus.Wait" @click="popupDialog(scope.row.SettleId)">审核</el-button>
          <router-link
            name="btnEdit"
            class="el-button el-button--text el-button--mini"
            v-if="scope.row.Status===auditStatus.Draft||scope.row.Status===auditStatus.Reject"
            :to="{path:'/performance/employee/salaryedit/'+scope.row.SettleId}"
          >修改</router-link>
          <el-button name="btnInvalid" type="text" v-if="scope.row.Status === auditStatus.Wait" @click="popupAbandonDialog(scope.row.SettleId)">作废</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- 创建工资表 -->
    <el-dialog title="创建工资表" :visible.sync="iShow" width="400px" @close="resetForm('createForm')">
      <div style="margin-bottom: 10px;color:#F56C6C">注意：未设置职级的员工不能新增工资结算！</div>
      <el-form :model="createForm" ref="createForm" :rules="dateRules">
        <el-form-item label="日期：" prop="SettleDate">
          <el-date-picker name="SettleDate" v-model="createForm.SettleDate" type="month" placeholder="选择日期" :editable="false"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnEnterCreate" type="primary" v-loading.fullscreen.lock="fullscreenLoading" @click="enterCreate('createForm')">确定</el-button>
        <el-button name="btnCancel" @click="iShow = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 审核 start -->
    <el-dialog title="审核" :visible.sync="auditDialog" width="400px" @close="resetForm('auditForm')">
      <el-form :model="auditForm" :rules="rules" ref="auditForm">
        <el-form-item prop="Audit">
          <el-radio-group name="Audit" v-model="auditForm.Audit">
            <el-radio label="1">审核通过</el-radio>
            <el-radio label="2">审核退回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="auditForm.Audit==='2'" prop="CheckNote">
          <el-input name="CheckNote" type="text" v-model="auditForm.CheckNote" placeholder="退回原因" :maxlength="20" @blur="checkNoteTrim('auditForm')">
            <template slot="suffix">{{auditForm.CheckNote?auditForm.CheckNote.length:0}}/20</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnEnterAudit" type="primary" @click="audit('auditForm')">确 定</el-button>
        <el-button name="btnCancel" @click="auditDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 审核 end -->
    <!-- 作废 -->
    <el-dialog title="作废" :visible.sync="abandonDialog" width="400px" @close="resetForm('abandonForm')">
      <el-form :model="abandonForm" ref="abandonForm" :rules="abandonRules">
        <el-form-item prop="CheckNote">
          <el-input name="CheckNote" type="textarea" v-model="abandonForm.CheckNote" placeholder="作废原因" :maxlength="200" @blur="checkNoteTrim('abandonForm')"></el-input>
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
import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
import { JunkInnOrderBasicState } from '@/enums/marketing'
import {
  KPIS_API_SETTLE_SALARY_BASIC_GETS,
  KPIS_API_SETTLE_SALARY_BASIC_CREATE,
  KPIS_API_SETTLE_SALARY_BASIC_SALARYEXPORT,
  KPIS_API_SETTLE_SALARY_BASIC_AUDIT,
  KPIS_API_SETTLE_SALARY_BASIC_REJECT,
  KPIS_API_SETTLE_SALARY_BASIC_ABANDON
} from '@/apis/performance'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      auditStatus: JunkInnOrderBasicState,
      form: {
        Year: '',
        Month: 0,
        Status: '',
        PageSize: 20,
        PageIndex: 1
      },
      parameter: {},
      total: 0,
      loading: true,
      options: {
        disabledDate(date) {
          return date.getTime() > Date.now()
        }
      },
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      auditForm: {
        Audit: '1'
      },
      abandonDialog: false,
      abandonForm: {
        CheckNote: ''
      },
      createForm: {
        SettleDate: ''
      },
      formatterDate: '',
      auditDialog: false,
      settleId: '',
      tableData: [],
      iShow: false,
      fullscreenLoading: false,
      rules: {
        Audit: [
          {
            required: true,
            message: '请选择审核结论',
            trigger: 'change'
          }
        ],
        CheckNote: [
          {
            required: true,
            message: '审核退回原因是必填项',
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
        SettleDate: [
          {
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ]
      },
      abandonRules: {
        CheckNote: [
          {
            required: true,
            message: '作废原因是必填项！',
            trigger: 'blur'
          },
          {
            max: 200,
            message: '字数不可以超过200字！',
            trigger: 'blur'
          }
        ]
      },
      ExportColumns: [
        {
          FieldEnName: 'SettleDate',
          FieldCnName: '工资月份',
        },
        {
          FieldEnName: 'ItemAmt',
          FieldCnName: '员工数量',
        },
        {
          FieldEnName: 'WaitPrice',
          FieldCnName: '应发工资总额',
          Precision: 2
        },
        {
          FieldEnName: 'WithholdPrice',
          FieldCnName: '代扣代交总额',
          Precision: 2
        },
        {
          FieldEnName: 'RealPrice',
          FieldCnName: '实发工资总额',
          Precision: 2
        },
        {
          FieldEnName: 'Status',
          FieldCnName: '状态',
        },
      ]
    }
  },

  methods: {
    initRoute() {
      this.$router.replace({
        path: '/performance/employee/salarylist',
        query: this.parameter
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.Status = parseInt(query.Status) || ''
      this.parameter.Month = parseInt(query.Month) || 0
      this.parameter.Year = query.Year || ''
      this.parameter.PageSize = query.PageSize || 10
      this.parameter.PageIndex = query.PageIndex || 1
      this.getData()
    },
    getData() {
      this.form = Object.assign(this.form, this.parameter)
      KPIS_API_SETTLE_SALARY_BASIC_GETS(this.form).then(res => {
        if (res.data.Code === 'CORRECT') {
          let tmpArr = res.data.Data.Rows
          this.tableData = tmpArr
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
      this.parameter = Object.assign({}, this.form)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    // 创建工资表
    getPreMonth() {
      var month = new Date().getMonth() === 0 ? 12 : new Date().getMonth()
      var year =
        new Date().getMonth() === 0
          ? new Date().getFullYear() - 1
          : new Date().getFullYear()
      this.createForm.SettleDate = new Date(year, month - 1)
    },
    enterCreate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.createForm.SettleDate = dayjs(this.createForm.SettleDate).format(
            'YYYY-MM-DD HH:mm:ss'
          )
          this.fullscreenLoading = true
          KPIS_API_SETTLE_SALARY_BASIC_CREATE({
            SettleDate:this.createForm.SettleDate,
            CreateUserId: this.$store.getters.user_session.UserId,
            CreateUser:this.$store.getters.user_session.AliasName,
            CharacterId:this.$store.getters.user_session.CharacterId
          }).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                setTimeout(() => {
                  this.fullscreenLoading = false
                  this.$router.push(
                    '/performance/employee/salarycreate/' + res.data.Data
                  )
                }, 500)
              }else{
                this.fullscreenLoading = false
              }
            }
          )
        } else {
          return false
        }
      })
    },
    // 导出报表
    exportSheet() {
      this.form.Year = this.form.Year
        ? dayjs(new Date(this.form.Year)).format('YYYY')
        : ''
      let params = Object.assign(
        {
          CharacterId: this.$store.getters.user_session.CharacterId,
          ExportColumns: this.ExportColumns
        },
        this.form,
        {
          PageSize: 100000,
          PageIndex: 1
        },
      )
      !params.Status && delete params.Status
      !params.Year && delete params.Year
      KPIS_API_SETTLE_SALARY_BASIC_SALARYEXPORT(params).then(res => {
        if (res.data.Code === 'CORRECT') {
          window.open(this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data.FilePath)
        } else {
          this.$message({
            type: 'info',
            message: res.data.Message
          })
        }
      })
    },
    // 审核工资表
    popupDialog(settleId) {
      this.auditDialog = true
      this.settleId = settleId
    },
    audit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let result
          if (this.auditForm.Audit === '1') {
            result = KPIS_API_SETTLE_SALARY_BASIC_AUDIT({
              DataId: this.settleId + '',
              CharacterId:this.$store.getters.user_session.CharacterId
            })
          } else {
            result = KPIS_API_SETTLE_SALARY_BASIC_REJECT({
              CheckNote: this.auditForm.CheckNote,
              DataId: this.settleId + '',
              CharacterId:this.$store.getters.user_session.CharacterId
            })
          }
          result.then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.getData()
            }
            this.auditDialog = false
          })
        }
      })
    },
    resetForm(name) {
      this.$refs[name].resetFields()
    },
    // 作废
    popupAbandonDialog(id) {
      this.abandonDialog = true
      this.settleId = id
    },
    abandon(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          KPIS_API_SETTLE_SALARY_BASIC_ABANDON({
            DataId: this.settleId + '',
            CheckNote: this.abandonForm.CheckNote,
            CharacterId:this.$store.getters.user_session.CharacterId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: res.data.Message
              })
              this.getData()
            }
            this.abandonDialog = false
          })
        }
      })
    },
    priceFormatter(row, column, value) {
      return '￥' + this.$root.toFloat(value)
    },
    checkNoteTrim(formName){
      if(this[formName].CheckNote && this[formName].CheckNote.length > 0){
        this[formName].CheckNote = this[formName].CheckNote.trim()
      }
    }
  },
  mounted() {
    this.init()
    this.getPreMonth()
  },
  components: {
    pagination,
    searchPanel
  },
  watch: {
    $route: 'init'
  }
}
</script>
