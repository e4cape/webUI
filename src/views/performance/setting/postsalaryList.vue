<template>
  <div class="content">
    <el-form :inline="true" :model="form" class="item-lh-26" @keyup.enter.native="onSearch">
      <search-panel @onSearch="onSearch" @onReset="onReset"  :isSenior="false">
        <template slot="btnBox">
          <el-form-item>
            <el-button name="btnAdd" type="primary" @click="btn_Add">新增</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
         <el-form-item prop="userState">
            <el-select name="Status" v-model="form.Status" @change="onSearch">
              <el-option value="" label="所有状态"></el-option>
              <el-option v-for="item in auditStatus.TypeArray" :key="item.KeyId" :value="parseInt(item.KeyId)" :label="item.Value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="PositionId">
            <el-select name="PositionId" v-model="form.PositionId" @change="onSearch">
              <el-option value="" label="所有职位"></el-option>
              <el-option v-for="item in positionOpt" :key="item.Id" :value="item.Id" :label="item.Value"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
     
    </el-form>
    <el-table :data="tableData" v-loading="loading">
      <el-table-column prop="Position" label="职位" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="CreateUser" label="创建人" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.CreateTime | filterDateTime}}
        </template>
      </el-table-column>
      <el-table-column prop="Status" label="状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="scope.row.Status | findKey(auditStatus)">
            {{auditStatus.Types[scope.row['Status']]? auditStatus.Types[scope.row['Status']]:'未知'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button name="btnDetail" type="text" @click="getDetail(scope.row.PositionSalaryId)">详情</el-button>
          <router-link name="btnEdit" class="el-button el-button--text el-button--mini" v-if="scope.row.Status === auditStatus.Draft || scope.row.Status === auditStatus.Reject ||scope.row.Status=== auditStatus.Audit" :to="{path:'/performance/setting/postSalaryedit/'+scope.row.PositionSalaryId}">修改</router-link>
          <el-button name="btnAudit" type="text" v-if="scope.row.Status=== auditStatus.Wait" to="" @click="btnAudit(scope.row.PositionSalaryId)">审核</el-button>
          <el-button name="btnInvalid" type="text" v-if="scope.row.Status== auditStatus.Wait||scope.row.Status == auditStatus.Draft" @click="btnAbandon($event,scope.row.PositionSalaryId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <el-dialog title="审核" :visible.sync="DialogAudit" @close="cancel('auditForm','DialogAudit')" width="400px">
      <el-form :model="auditForm" ref="auditForm" :rules="rules">
        <el-form-item prop="Audit">
          <el-radio-group name="Audit" v-model="auditForm.Audit">
            <el-radio :label="auditStatus.Audit">审核通过</el-radio>
            <el-radio :label="auditStatus.Reject">审核退回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="auditForm.Audit === auditStatus.Reject" prop="CheckNote">
          <el-input name="CheckNote" type="textarea" v-model="auditForm.CheckNote" :maxlength="20" placeholder="退回原因" @blur="checkNoteTrim"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnEnterAudit" type="primary" @click="Audit">确 定</el-button>
        <el-button name="btnCancel" @click="DialogAudit=false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="职位工资详情" :visible.sync="DetailFlag" width="1120px">
      <div class="detail">
        <el-row :gutter="10">
          <el-col :span="3" style="text-align:right">职位：</el-col>
          <el-col :span="21">{{Detail.Position}}</el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="3" style="text-align:right">职位工资：</el-col>
          <el-col :span="21">
            <el-table :data="Detail.Items" >
              <el-table-column  prop="LevelTitle" label="职级" width="55px">
              </el-table-column>
              <el-table-column  prop="BasicPrice" label="基本工资" :formatter="priceFormatter">
              </el-table-column>
              <el-table-column  prop="SubsPrice" label="职位津贴" :formatter="priceFormatter">
              </el-table-column>
              <el-table-column  prop="AttendPrice" label="出勤补贴" :formatter="priceFormatter">
              </el-table-column>
              <el-table-column  prop="MealPrice" label=" 餐补(月)" :formatter="priceFormatter">
              </el-table-column>
              <el-table-column  prop="TrafficPrice" label="交通补贴" :formatter="priceFormatter">
              </el-table-column>
              <el-table-column  prop="HotelPrice" label="住宿补贴" :formatter="priceFormatter">
              </el-table-column>
              <el-table-column  prop="OtherPrice" label="其它" :formatter="priceFormatter">
              </el-table-column>
              <el-table-column  prop="PositionPrice" label="合计" :formatter="priceFormatter">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="3" style="text-align:right">创建日期：</el-col>
          <el-col :span="21">{{Detail.CreateTime | filterDateTime}}</el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="3" style="text-align:right">创建人：</el-col>
          <el-col :span="21">{{Detail.CreateUser}}</el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="3" style="text-align:right">状态：</el-col>
          <el-col :span="21">
            <span :class="Detail.Status | findKey(auditStatus)">{{auditStatus.Types[Detail.Status]}}</span>
            <span v-if="Detail.CheckNote!==''&&(Detail.Status == auditStatus.Reject || Detail.Status == auditStatus.Abandon)">({{Detail.CheckNote}})</span>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnClose" type="primary" @click="DetailFlag=false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  JunkInnOrderBasicState
} from '@/enums/marketing'
import searchPanel from '@/components/searchPanel'
import pagination from '@/components/pagination'
import {
  MERCHANT_API_DROPDOWN_POSITIONLIST,
} from '@/apis/merchant'
import {
  KPIS_API_SETTING_POSITION_SALARY_BASIC_GETS,
  KPIS_API_SETTING_POSITION_SALARY_BASIC_GET,
  KPIS_API_SETTING_POSITION_SALARY_BASIC_REJECT,
  KPIS_API_SETTING_POSITION_SALARY_BASIC_AUDIT,
  KPIS_API_SETTING_POSITION_SALARY_BASIC_ABANDON,
  KPIS_API_SETTING_POSITION_SALARY_ITEM_GETS
} from '@/apis/performance'
export default {
  data() {
    return {
      form: {
        PositionId: '',
        Status: '',
        PageIndex: 1,
        PageSize: 10,
      },
      total:1,
      formLabelWidth: '120px',
      positionOpt: [],
      auditStatus: '',
      tableData: [],
      detailData: [],
      tableDetail: [],
      Detail: {
      },
      expands: [],
      DialogAudit: false,
      DetailFlag: false,
      loading: true,
      auditForm: {
        Audit: '1',
        CheckNote: ''
      },
      parameter:{
      },
      rules: {
        CheckNote: [
          {
            required: true, message: '审核回退原因是必填项', trigger: 'blur' 
          },
          {
            max: 200, message: '字数不可以超过200字！', trigger: 'blur' 
          }
        ],
        Abandon: [
          {
            required: true, message: '作废原因是必填项', trigger: 'blur' 
          },
          {
            max: 200, message: '字数不可以超过200字！', trigger: 'blur' 
          }
        ]
      }
    }
  },
  created() {
    let tmpArr = [...JunkInnOrderBasicState.TypeArray].filter(item => item.KeyId != JunkInnOrderBasicState.Abandon)
    this.auditStatus = Object.assign({},JunkInnOrderBasicState)
    this.auditStatus.TypeArray = tmpArr
    MERCHANT_API_DROPDOWN_POSITIONLIST().then(res => {
      if (res.data.Code === 'CORRECT' && res.data.Data.Count > 0) {
        this.positionOpt = res.data.Data.Rows
      }
    })
  },
  mounted(){
    this.init()
  },
  components: {
    searchPanel,
    pagination
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: this.$route.path, query: this.parameter 
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.PositionId = parseInt(query.PositionId) || ''
      this.parameter.Status = parseInt(query.Status) || ''
      this.parameter.PageSize = query.PageSize || 20
      this.parameter.PageIndex = query.PageIndex || 1
      this.form = Object.assign({},this.parameter)
      this.getData()
    },
    getData() {
      this.form = Object.assign(this.form, this.parameter)
      this.loading = true
      KPIS_API_SETTING_POSITION_SALARY_BASIC_GETS(Object.assign({IsAsced:1},this.form)).then((resp) => {
        this.loading = false
        if (resp.data.Code === 'CORRECT') {
          this.tableData = resp.data.Data.Rows
          this.total = resp.data.Data.Count
        }

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
      this.parameter= Object.assign({
      }, this.form)
      this.initRoute(this.parameter)
    },
    onReset() {
      this.$refs.form.resetFields()
      this.timeArr = []
      this.onSearch()
    },
    async getDetail(PositionSalaryId) {
      this.DetailFlag = true
      const resAll = await Promise.all([KPIS_API_SETTING_POSITION_SALARY_BASIC_GET({PositionSalaryId}),KPIS_API_SETTING_POSITION_SALARY_ITEM_GETS({PositionSalaryId})])
      this.DetailFlag = true
      if(resAll[0].data.Code === 'CORRECT'){
        this.Detail = resAll[0].data.Data
      }
      if(resAll[1].data.Code === 'CORRECT'){
        this.Detail.Items = resAll[1].data.Data.Rows
      }
    },
    btn_Add() {
      this.$router.push('/performance/setting/postsalarycreate')
    },
    btnAudit(id){
      this.auditForm.Audit = this.auditStatus.Audit
      this.DialogAudit = true
      this.AuditData = id
    },
    Audit() {
      if (this.auditForm.Audit === this.auditStatus.Reject) {
        this.$refs['auditForm'].validate((valid) => {
          if (valid) {
            this.DialogAudit = false
            KPIS_API_SETTING_POSITION_SALARY_BASIC_REJECT({
              CheckNote: this.auditForm.CheckNote,
              PositionSalaryId: this.AuditData
            })
              .then((res) => {
                if (res.data.Code === 'CORRECT') {
                  this.dialogFormVisible = true
                  this.CallBack(res)
                } else {
                  this.$message.warning(res.data.Message)
                }
              })
          } else {
            return false
          }
        })
      } else {
        KPIS_API_SETTING_POSITION_SALARY_BASIC_AUDIT({
          PositionSalaryId: this.AuditData
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.DialogAudit = false
            this.CallBack(res)
          } else {
            this.$message.warning(res.data.Message)
          }
        })
      }
    },
    // 重置表单
    cancel(formName) {
      this.$refs[formName].resetFields()
    },
    btnAbandon($event,id){
      $event.currentTarget.blur()
      this.$confirm('确定要删除该职位工资吗', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.Abandon(id)
      }).catch(()=>{
      })
    },
    Abandon(id) {
      KPIS_API_SETTING_POSITION_SALARY_BASIC_ABANDON({PositionSalaryId: id}).then(res => {
        this.CallBack(res)
      })
    },
    CallBack(res) {
      if (res.data.Code === 'CORRECT') {
        this.dialogFormVisible = true
        this.getData()
        this.$message({
          type: 'success',
          message: res.data.Message
        })
      }
    },
    getRowKeys(row) {
      return row.PositionId
    },
    priceFormatter(row, column, value) {
      return '￥' + this.$root.toFloat(value)
    },
    checkNoteTrim(){
      if(this.auditForm.CheckNote && this.auditForm.CheckNote.length > 0){
        this.auditForm.CheckNote = this.auditForm.CheckNote.trim()
      }
    }
  },
  watch:{
    $route:'init'
  }
}

</script>
<style scoped lang="scss">
.detail .el-row {
  margin-bottom: 15px;
  .el-col-2 {
    text-align: right;
  }
}
</style>
