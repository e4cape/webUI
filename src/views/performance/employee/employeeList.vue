<template>
  <div class="content">
    <el-form :inline="true" class="item-lh-26" ref="form" :model="form" @keyup.enter.native="onSearch">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="simpleSearch">
          <el-form-item prop="DepartmentId1">
            <el-select name="DepartmentId1" v-model="form.DepartmentId1" @change="onSearch">
              <el-option value label="所有部门"></el-option>
              <el-option v-for="(item, index) in dropDownDepartments" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="UserName">
            <el-input name="UserName" v-model="form.UserName" :maxlength="20" placeholder="请输入姓名">
              <el-button name="btnSearch" slot="append" :disabled="isDisabled" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="入职日期：" prop="timeArr">
            <el-date-picker name="timeArr" class="date-picker" :unlink-panels="true" v-model="timeArr" :editable="false" type="daterange" @change="setTime" placeholder="选择日期范围"></el-date-picker>
          </el-form-item>
          <el-form-item label="部门：" prop="DepartmentId1">
            <el-select name="DepartmentId1" v-model="form.DepartmentId1" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option v-for="(item, index) in dropDownDepartments" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职位：" prop="PositionId1">
            <el-select name="PositionId1" v-model="form.PositionId1" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option v-for="item in jobOption" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" v-loading="loading">
      <el-table-column prop="UserId" label="ID" type="index">
        <template slot-scope="scope">{{scope.$index+1+(form.PageIndex-1)*form.PageSize}}</template>
      </el-table-column>
      <el-table-column prop="UserName" label="姓名" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="name" :title="scope.row.UserName">{{scope.row.UserName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="DepartmentId1" label="部门" show-overflow-tooltip>
        <template slot-scope="scope">{{dropDownDepartments.find(v => v.Id === scope.row.DepartmentId1) ? dropDownDepartments.find(v => v.Id === scope.row.DepartmentId1).Value : '-'}}</template>
      </el-table-column>
      <el-table-column prop="Position1" label="职位" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-bind:class="{unset: !scope.row.Position1}">
            {{scope.row.Position1 || '未设置'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="职级">
        <template slot-scope="scope">
          <span v-bind:class="{unset: !scope.row.LevelTitle1}">{{scope.row.LevelTitle1 || '未设置'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="VitaStatus" label="在职状态" show-overflow-tooltip>
        <template slot-scope="scope">{{securityUserVitaState.Types[scope.row.VitaStatus] || '-'}}</template>
      </el-table-column>
      <el-table-column prop="SignedTime" label="入职日期" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.SignedTime | filterDate}}</template>
      </el-table-column>
      <el-table-column prop="OfficialTime" label="转正日期" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.OfficialTime | filterDate}}</template>
      </el-table-column>
      <el-table-column prop="LeavedTime" label="离职日期" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.LeavedTime | filterDate}}</template>
      </el-table-column>
      <el-table-column prop="UserState" label="账户状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="scope.row.UserState | findKey(SecurityUserState)">{{SecurityUserState.Types[scope.row.UserState]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="RatioTitle" label="提成方案" width="120">
        <template slot-scope="scope">
          <el-button name="btnShowRatio" v-if="scope.row.RatioTitle" @click.native.prevent="showRatio(scope.row)" type="text" size="small">{{scope.row.RatioTitle}}</el-button>
          <span v-else class="unset">未设置提成方案</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button name="btnSetting" @click.native.prevent="editRatioPlan(scope.row)" type="text" size="small">设置</el-button>
          <router-link name="btnLink" class="el-button el-button--text el-button--mini" :to="{path:'/performance/employee/employeedetail/'+scope.row.UserId}">
            <el-button type="text" size="small">详情</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- 展示提成方案 -->
    <el-dialog title="提成方案" :visible.sync="dialogFormVisible" width="20%">
      <ul class="ratio-content">
        <li>
          <span>提成方案：</span>
          <p>{{formPlan.RatioTitle}}</p>
        </li>
        <li v-if="formPlan.RatioTitle!=='导购'">
          <span>销售额来源部门：</span>
          <div class="department">
            <p v-for="(item, index) in formPlan.Depts" :key="index">{{item}}</p>
          </div>
        </li>
        <li v-else>
          <span>销售额来源：</span>
          <p>个人</p>
        </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnClose" type="primary" @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 设置提成方案组件 -->
    <el-dialog title="设置提成方案" :visible.sync="dialogEditRatio" width="600px" @close="close('ratioForm')">
      <p class="tips">注意：职位设置若修改，次月方可生效</p>
      <el-form :model="formRatio" ref="ratioForm" :label-width="formLabelWidth" :rules="rules">
        <el-form-item label="职位：" prop="Position2">
          <el-select name="PositionId2" v-model="formRatio.PositionId2" @change="getPosition2">
            <el-option v-for="item in jobOption" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职级：" prop="LevelTitle2">
          <el-select name="LevelIndex2" v-model="formRatio.LevelIndex2" @change="getLevelTitle2">
            <el-option v-for="item in levelOption" :key="item.LevelIndex" :label="item.LevelTitle" :value="item.LevelIndex"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提成方案：">
          <span>{{formRatio.Position2}}</span>
        </el-form-item>
        <el-form-item v-if="formRatio.Position2!=='导购'" label="销售额来源部门：" prop="DeptIds">
          <el-checkbox-group name="DeptIds" v-model="formRatio.DeptIds" @change="getDepts">
            <el-checkbox class="checkboxes" v-for="item in dropDownDepartments" :key="item.Id" :label="item.Id">{{item.Value}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnSetPlan" type="primary" @click="setPlan('ratioForm')">确 定</el-button>
        <el-button name="btnCancel" @click="dialogEditRatio = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import searchPanel from '@/components/searchPanel'
import pagination from '@/components/pagination'
import { SecurityUserVitaState, SecurityUserState } from '@/enums/merchant'
import { EnableState } from '@/enums/common'
import {
  KPIS_API_EMPLOYEE_GETS,
  KPIS_API_SETTING_POSITION_SALARY_ITEM_REQS,
  KPIS_API_EMPLOYEE_UPDATEBYRATIO
} from '@/apis/performance'
import {
  MERCHANT_API_DROPDOWN_POSITIONLIST
} from '@/apis/merchant'
export default {
  data() {
    return {
      securityUserVitaState: SecurityUserVitaState,
      SecurityUserState,
      // 搜索表单对象
      form: {
        SignedTime1: '',
        SignedTime2: '',
        DepartmentId1: '',
        PositionId1: '',
        UserName: '',
        timeArr: [],
        PageSize: 20,
        PageIndex: 1
      },
      parameter: {
        SignedTime1: '',
        SignedTime2: '',
        DepartmentId1: 0,
        PositionId1: 0,
        UserName: '',
        PageSize: 20,
        PageIndex: 1
      },
      total: 0,
      isDisabled: false,
      loading: true,
      // 搜索条件：起始结束日期
      timeArr: [],
      // 搜索条件：职位枚举
      jobOption: [],
      // 设置提成方案对象
      formRatio: {
        UserId: '',
        PositionId2: '',
        Position2: '',
        LevelIndex2: '',
        LevelTitle2: '',
        DeptIds: [],
        Depts: [],
        timeArr: []
      },
      tableData: [],
      // 职级默认枚举
      levelOption: [],
      // 弹窗默认隐藏
      dialogFormVisible: false,
      dialogEditRatio: false,
      // 设置form label 宽度
      formLabelWidth: '140px',
      // 提成方案表单对象
      formPlan: {},
      rules: {
        Position2: [
          {
            required: true,
            message: '请选择职位',
            trigger: 'change'
          }
        ],
        LevelTitle2: [
          {
            required: true,
            message: '请选择职级',
            trigger: 'change'
          }
        ],
        DeptIds: [
          {
            required: true,
            message: '请至少选择一个部门',
            trigger: 'change'
          }
        ]
      },
    }
  },
  components: {
    searchPanel,
    pagination
  },
  methods: {
    loadAllEnums() {
      // 部门列表
      this.$store.dispatch('GET_DEPARTMENTS_DROPLIST', { State: EnableState.Enable, CharacterId: this.$store.getters.user_session.CharacterId })
      // 职位列表
      MERCHANT_API_DROPDOWN_POSITIONLIST().then(res => {
        if (res.data.Code === 'CORRECT' && res.data.Data.Count > 0) {
          this.jobOption = res.data.Data.Rows
        }
      })
    },
    // 获取SignedTime1，SignedTime2
    setTime(timeArr) {
      if (timeArr) {
        this.form.SignedTime1 = dayjs(timeArr[0]).format('YYYY-MM-DD')
        this.form.SignedTime2 = dayjs(timeArr[1]).format('YYYY-MM-DD')
      } else {
        this.form.SignedTime1 = ''
        this.form.SignedTime2 = ''
      }
    },
    initRoute() {
      this.$router.replace({
        path: this.$route.path,
        query: this.parameter
      })
    },
    init() {
      const query = this.$route.query
      this.parameter.SignedTime1 = query.SignedTime1 || ''
      this.parameter.SignedTime2 = query.SignedTime2 || ''
      this.timeArr = query.SignedTime1
        ? [query.SignedTime1, query.SignedTime2]
        : []
      this.parameter.DepartmentId1 = parseInt(query.DepartmentId1) || ''
      this.parameter.PositionId1 = parseInt(query.PositionId1) || ''
      this.parameter.UserName = query.UserName || ''
      this.parameter.PageSize = query.PageSize || 20
      this.parameter.PageIndex = query.PageIndex || 1
      this.form = Object.assign(this.form, this.parameter)
      this.getData()
    },
    getData() {
      this.loading = true
      KPIS_API_EMPLOYEE_GETS(Object.assign({
        CharacterId: this.$store.getters.user_session.CharacterId,
        UserState: this.SecurityUserState.Audit
      }, this.form)).then(res => {
        this.tableData = res.data.Data.Rows
        this.total = res.data.Data.Count
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
      this.form.isSenior = true
      this.parameter = Object.assign({}, this.form)
      this.initRoute()
    },
    onReset() {
      this.timeArr = []
      this.form.SignedTime1 = ''
      this.form.SignedTime2 = ''
      this.$refs.form.resetFields()
      this.onSearch()
    },
    // 显示 提成方案
    showRatio(user) {
      this.dialogFormVisible = true
      this.formPlan.RatioTitle = user.RatioTitle
      this.formPlan.Depts = []
      const DeptIds = user.DeptIds !== '' ? user.DeptIds.split(',') : []
      DeptIds.forEach(item => {
        const curDepartment = this.dropDownDepartments.find(v => v.Id == item)
        curDepartment && this.formPlan.Depts.push(curDepartment.Value)
      })
    },
    // 显示 设置提成方案 弹窗
    editRatioPlan(user) {
      this.dialogEditRatio = true
      this.formRatio.UserId = user.UserId
      if (user.RatioTitle !== '') {
        this.formRatio.Position2 = user.Position1
        this.formRatio.PositionId2 = user.PositionId1
        this.formRatio.LevelTitle2 = user.LevelTitle1
        this.formRatio.LevelIndex2 = user.LevelIndex1
        let DeptIds = user.DeptIds !== '' ? user.DeptIds.split(',') : []
        DeptIds.forEach(item => {
          this.formRatio.DeptIds.push(parseInt(item))
        })
        this.getDepts(DeptIds)
        KPIS_API_SETTING_POSITION_SALARY_ITEM_REQS({
          CharacterId: this.$store.getters.user_session.CharacterId,
          PositionId: this.formRatio.PositionId2
        }).then(res => {
          this.levelOption = res.data.Data.Rows
        })
      }
    },
    // 获取职位
    getPosition2(value) {
      this.formRatio.Position2 = this.jobOption.find(
        item => item.Id == value
      ).Value
      // 获取职级列表
      KPIS_API_SETTING_POSITION_SALARY_ITEM_REQS({
        CharacterId: this.$store.getters.user_session.CharacterId,
        PositionId: value
      }).then(res => {
        this.levelOption = res.data.Data.Rows
      })
      this.formRatio.LevelIndex2 = ''
      this.formRatio.LevelTitle2 = ''
    },
    // 获取职级
    getLevelTitle2(value) {
      this.formRatio.LevelTitle2 = this.levelOption.find(
        item => item.LevelIndex == value
      ).LevelTitle
    },
    getDepts(value) {
      this.formRatio.Depts = []
      value.forEach(item => {
        this.formRatio.Depts.push(
          this.dropDownDepartments.find(v => v.Id == item).Value
        )
      })
    },
    // 更新提成方案
    setPlan(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var submitForm = JSON.parse(JSON.stringify(this.formRatio))
          submitForm.Depts = submitForm.Depts.join(',')
          submitForm.DeptIds = submitForm.DeptIds.join(',')
          if (submitForm.Position2 === '导购') {
            submitForm.Depts = ''
            submitForm.DeptIds = ''
          }
          KPIS_API_EMPLOYEE_UPDATEBYRATIO(submitForm).then(res => {
            if (res.data.Code == 'CORRECT') {
              this.getData()
            } else {
              this.$message.warning(res.data.Message)
            }
            this.dialogEditRatio = false
          })
        }
      })
    },
    close(formName) {
      this.$refs[formName].resetFields()
      this.formRatio = {
        UserId: '',
        PositionId2: '',
        Position2: '',
        LevelIndex2: '',
        LevelTitle2: '',
        DeptIds: [],
        Depts: []
      }
      this.levelOption = []
    },
  },
  mounted() {
    this.loadAllEnums()
    this.init()
  },
  watch: {
    $route: 'init'
  },
  computed: {
    dropDownDepartments() {
      return this.$store.getters.departments
    }
  }
}
</script>
<style lang="scss" scoped>
.unset {
  color: #f56c6c;
}

.ratio-content {
  li {
    display: flex;
    span {
      width: 130px;
      text-align: right;
    }
  }
}

.checkboxes {
  margin: 0;
  margin-right: 30px;
}

.name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tips {
  color: #fa5555;
  margin-bottom: 20px;
}
</style>
<style lang="scss">
.date-picker {
  .el-range-input {
    vertical-align: bottom;
  }
}
</style>
