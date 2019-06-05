<template>
  <div class="content">
    <el-form :label-position="'right'" label-width="130px" :model="form" :rules="rules" show-message ref="form" class="fix-w">
      <el-row v-loading="$store.getters.is_loading">
        <div class="panel-tag">
          <span>基本资料</span>
        </div>
        <div style="padding-top: 10px;"></div>
        <el-col :span="12">
          <el-form-item label="姓名：" prop="TrueName">
            <el-input name="TrueName" v-model="form.TrueName" @blur="form.TrueName=form.TrueName.trim()"     :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="工号：" prop="JobCode">
            <el-input name="JobCode" v-model="form.JobCode" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="在职状态：" prop="VitaState" class="is-required">
            <el-radio-group name="VitaState" v-model="form.VitaState">
              <el-radio v-for="(item,index) in securityUserVitaState.Types" :label="index" :key="index">{{item}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="部门：" prop="DepartmentId" v-if="$store.getters.user_session.CharacterType == characterType.Store">
            <el-select name="DepartmentId" v-model="form.DepartmentId" placeholder="请选择" filterable>
              <template v-for="(item,index) in $store.getters.departments">
                <el-option :label="item.Value" :value="item.Id" :key="index" v-if="item.State === enableState.Enable"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="微信权限：" v-if="$store.getters.user_session.CharacterType == characterType.Store">
            <el-select name="BerthType" v-model="form.BerthType" placeholder="请选择" filterable>
              <el-option v-for="(item,index) in securityUserBerthType.Types" :label="item" name="securityUserBerthTypes" :key="index" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色：" prop="RoleId">
            <el-select name="RoleId" v-model="form.RoleId" placeholder="请选择" filterable>
              <el-option v-for="item in RoleList" :key="item.Id" :label="item.Value" :value="parseInt(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收银权限：" v-if="$store.getters.user_session.CharacterType == characterType.Store">
            <el-select name="CashierType" v-model="form.CashierType" prop="securityUserCashierTypes" placeholder="请选择" filterable>
              <el-option v-for="(item,index) in securityUserCashierType.Types" :label="item" name="securityUserCashierTypes" :key="index" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户名：" prop="LoginId">
            <el-input name="LoginId" disabled v-model="form.LoginId" @blur="form.LoginId=form.LoginId.trim()"  :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="初始密码：" :prop="pwdRequired.length ? '' : 'Password'">
            <el-input name="Password" v-model="form.Password" @blur="form.Password=form.Password.trim()"   type="Password" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="出生日期：">
            <el-date-picker name="Birthday" :editable="false" format="yyyy-MM-dd" v-model="form.Birthday" type="date" class="date-picker"></el-date-picker>
          </el-form-item>
          <el-form-item label="性别：">
            <el-select name="SexyType" v-model="form.SexyType" prop="Sex" placeholder="请选择" filterable>
              <el-option v-for="(item, index) in sexyType.Types" :label="item" name="Sex" :value="index" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入职日期：" prop="SignedTime">
            <el-date-picker name="SignedTime" :editable="false" format="yyyy-MM-dd" v-model="form.SignedTime" type="date" class="date-picker"></el-date-picker>
          </el-form-item>
          <el-form-item label="转正时间：" :prop="form.VitaState == securityUserVitaState.Official?'OfficialTime':''">
            <el-date-picker name="OfficialTime" :editable="false" v-model="form.OfficialTime" type="date" class="date-picker"></el-date-picker>
          </el-form-item>
          <el-form-item label="离职时间：" disabled :prop="form.VitaState == securityUserVitaState.Leaved?'LeavedTime':''">
            <el-date-picker name="LeavedTime" :editable="false" v-model="form.LeavedTime" type="date" class="date-picker"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="first-right tc">
          <div class="logoImg">
            <img v-if="form.ImageUrl" :src="DOMAIN_IMG_FILE + form.ImageUrl.replace('{0}', '1080x0')" style="width: 240px;">
          </div>
          <uploadImgByBtn :uploadImageUrl="form.ImageUrl" :Root="SETTING_STAFF" @uploadSucc="(url) => {this.form.ImageUrl = url}" :type="'primary'">
            <slot>上传员工照片</slot>
          </uploadImgByBtn>
        </el-col>
      </el-row>
      <el-row v-loading="$store.getters.is_loading">
        <div class="panel-tag">
          <span>联系方式</span>
        </div>
        <div style="padding-top: 10px;"></div>
        <el-form-item label="手机号码：">
          <el-input name="Mobile" v-model="form.Mobile" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="QQ：">
          <el-input name="QQ" v-model="form.QQ" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="Email">
          <el-input name="Email" v-model="form.Email" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人  ：">
          <el-input name="Contact" v-model="form.Contact" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人电话：">
          <el-input name="Phone" v-model="form.Phone" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码：">
          <el-input name="CardIdentity" v-model="form.CardIdentity" :minlength="18" :maxlength="18"></el-input>
        </el-form-item>
        <el-form-item label="身份证地址：">
          <el-input name="CardAddr" v-model="form.CardAddr" :maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="户口所在地：">
          <el-input name="NativeAddr" v-model="form.NativeAddr" :maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="现住址：">
          <el-input name="CurrAddr" v-model="form.CurrAddr" :maxlength="30"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="buttons">
      <el-button name="save" type="primary" @click="createData" :loading="$store.getters.is_loading">保存</el-button>
      <el-button name="cancel" type="primary" @click="$router.go(-1)">取消</el-button>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { DOMAIN_IMG_FILE } from '@/configs/appSettings.js'
import { SETTING_STAFF } from '@/configs/filePaths.js'
import { rules } from '@/rules/setter/staffValidate'
import { CharacterType, EnableState, SexyType } from '@/enums/common.js'
import {
  SecurityUserVitaState,
  SecurityUserBerthType,
  SecurityUserCashierType
} from '@/enums/merchant'
import {
  MERCHANT_API_SECURITY_USER_REQ,
  MERCHANT_API_DROPDOWN_DEPARTLIST,
  MERCHANT_API_SECURITY_USER_UPDATE,
  MERCHANT_API_DROPDOWN_ROLELIST
} from '@/apis/merchant'

import uploadImgByBtn from '@/components/common/uploadImgByBtn.vue'
export default {
  data() {
    return {
      SETTING_STAFF,
      DOMAIN_IMG_FILE,
      characterType: CharacterType,
      securityUserVitaState: SecurityUserVitaState,
      securityUserBerthType: SecurityUserBerthType,
      securityUserCashierType: SecurityUserCashierType,
      sexyType: SexyType,
      enableState: EnableState,
      activeName: 'first', // tab切换里面显示的tab名称
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now()
        }
      },
      form: {
        Name: '',
        EmployeeStatus: '',
        CompanyCode: '',
        CompanyName: '',
        AppletId: '',
        LoginId: '', // 登录账户
        Password: '', // 登录密码
        OpenId: '', // OpenId
        BerthType: 0, // 微信端角色类型
        CashierType: 0, // 收银台角色类型
        RoleId: '', // 角色序号
        DepartmentId: '',
        PositionId: 0,
        GroupId: '',
        RankId: '',
        CreateUserId: '',
        CreateUser: '',
        VitaState: '',
        UserState: 0,
        JobCode: '',
        AliasName: '',
        TrueName: '',
        ImageUrl: '',
        SexyType: '',
        Birthday: '',
        CardIdentity: '',
        CardAddr: '',
        NativeAddr: '',
        CurrAddr: '',
        Mobile: '',
        QQ: '',
        Wechart: '',
        Email: '',
        Contact: '',
        Phone: '',
        SignedTime: '',
        OfficialTime: '',
        LeavedTime: ''
      },
      btnLoading: false,
      pwdRequired: '',
      logoImg: '', // logo展示图片
      rules: {}, // 接收表单验证的规则
      Departments: [], // 所有的部门信息
      DeptGroups: [], // 所有的部门分组信息
      RoleList: [] // 角色下拉
    }
  },
  components: {
    uploadImgByBtn
  },
  methods: {
    dataError(msg) {
      this.$confirm(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: true,
        type: 'warning'
      })
        .then(() => {
          this.$router.push({
            path: '/setter/staff/index'
          })
        })
        .catch(() => {})
    },
    filterDate(value) {
      // 用于js中过滤时间格式
      let date = new Date(value)
      
      var reg = /1900(-|\/)?01(-|\/)?01/g
      return !value ||
        value === '1900/01/01 00:00:00' ||
        value === '9999/12/31 23:59:59' || reg.test(value)
        ? ''
        : date
    },
    getData(id) {
      this.$store.commit('SET_BTN_LOADING', true)
      MERCHANT_API_SECURITY_USER_REQ({
        UserId: id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.form = JSON.parse(JSON.stringify(res.data.Data))
          this.pwdRequired = res.data.Data.LoginId
          this.getRoleList(res.data.Data.RoleId)
          this.form.Birthday = this.filterDate(this.form.Birthday)
          this.form.SignedTime = this.filterDate(this.form.SignedTime)
          this.form.OfficialTime = this.filterDate(this.form.OfficialTime)
          this.form.LeavedTime = this.filterDate(this.form.LeavedTime)
          this.form.BerthType =
            res.data.Data.BerthType === 0 ? '' : res.data.Data.BerthType + ''
          this.form.CashierType =
            this.form.CashierType === 0 ? null : this.form.CashierType + ''
          this.form.VitaState = this.form.VitaState + ''
          this.form.UserState = this.form.UserState + ''
          this.form.SexyType =
            this.form.SexyType === 0 ? null : this.form.SexyType + ''
          this.form.DepartmentId =
            this.form.DepartmentId === 0 ? '' : this.form.DepartmentId
          if (
            this.form.ImageUrl.indexOf('http://') >= 0 ||
            this.form.ImageUrl.indexOf('https://') >= 0
          ) {
            this.logoImg = this.form.ImageUrl
          } else {
            this.logoImg =
              this.$root.settings.DOMAIN_IMAGE +
              this.form.ImageUrl.replace('{0}', '150x150')
          }
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    createData() {
      this.$refs['form'].validate(valid => {
        if (
          !this.form.OfficialTime &&
          parseInt(this.form.VitaState) === SecurityUserVitaState.Official
        ) {
          this.$message.error('请输入转正日期！')
          return false
        }
        if (
          !this.form.LeavedTime &&
          parseInt(this.form.VitaState) === SecurityUserVitaState.Leaved
        ) {
          this.$message.error('请输入离职日期！')
          return false
        }
        if (valid) {
          this.addDepartment()
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    getDepartmentList() {
      MERCHANT_API_DROPDOWN_DEPARTLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.Departments = res.data.Data.Rows
        }
      })
    },
    addDepartment() {
      this.form.Birthday = this.form.Birthday
        ? new Date(this.form.Birthday - 0 + 8 * 3600000)
        : ''
      this.form.SignedTime = this.form.SignedTime
        ? new Date(this.form.SignedTime - 0 + 8 * 3600000)
        : ''
      this.form.OfficialTime = this.form.OfficialTime
        ? new Date(this.form.OfficialTime - 0 + 8 * 3600000)
        : ''
      this.form.LeavedTime = this.form.LeavedTime
        ? new Date(this.form.LeavedTime - 0 + 8 * 3600000)
        : ''
      let param = JSON.parse(JSON.stringify(this.form))
      param.SignedTime = param.SignedTime
        ? dayjs(param.SignedTime).format('YYYY-MM-DD HH:mm:ss')
        : '1900/01/01 00:00:00'
      param.OfficialTime = param.OfficialTime
        ? dayjs(param.OfficialTime).format('YYYY-MM-DD HH:mm:ss')
        : '1900/01/01 00:00:00'
      param.LeavedTime = param.LeavedTime
        ? dayjs(param.LeavedTime).format('YYYY-MM-DD HH:mm:ss')
        : '1900/01/01 00:00:00'
      param.Birthday = param.Birthday
        ? dayjs(param.Birthday).format('YYYY-MM-DD HH:mm:ss')
        : '1900/01/01 00:00:00'
      param.BerthType = param.BerthType - 0
      param.SexyType = param.SexyType - 0
      param.DepartmentId = param.DepartmentId - 0
      param.SexyType = param.SexyType - 0
      this.$store.commit('SET_BTN_LOADING', true)
      MERCHANT_API_SECURITY_USER_UPDATE({
        UserId: param.UserId,
        LoginId: param.LoginId,
        Password: param.Password,
        BerthType: param.BerthType,
        CashierType: param.CashierType - 0,
        RoleId: param.RoleId,
        DepartmentId: param.DepartmentId,
        GroupId: param.GroupId,
        RankId: param.RankId,
        CreateUser: param.CreateUser,
        VitaState: param.VitaState - 0,
        JobCode: param.JobCode,
        AliasName: param.AliasName,
        TrueName: param.TrueName,
        ImageUrl: param.ImageUrl,
        SexyType: param.SexyType,
        Birthday: param.Birthday,
        CardIdentity: param.CardIdentity,
        CardAddr: param.CardAddr,
        NativeAddr: param.NativeAddr,
        CurrAddr: param.CurrAddr,
        Mobile: param.Mobile,
        QQ: param.QQ,
        Wechart: param.Wechart,
        Email: param.Email,
        Contact: param.Contact,
        Phone: param.Phone,
        SignedTime: param.SignedTime,
        OfficialTime: param.OfficialTime,
        LeavedTime: param.LeavedTime
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$router.push({
            path: '/setter/staff/index'
          })
        } else {
          this.$message.error(res.data.Message)
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    getRoleList(id) {
      MERCHANT_API_DROPDOWN_ROLELIST({}).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.RoleList = res.data.Data.Rows
          this.form.RoleId = ''
          res.data.Data.Rows.forEach(item => {
            if (item.Id === id) {
              this.form.RoleId = item.Id
            }
          })
        } else {
          this.$message.error(res.data.Message)
        }
      })
    }
  },
  mounted() {
    let id = this.$route.query.id
    if (id) {
      this.getDepartmentList()
      this.getData(this.$route.query.id)
    } else {
      this.dataError()
    }
  },
  created() {
    this.$store.dispatch('GET_DEPARTMENTS_DROPLIST')
    this.$store.dispatch('GET_USERS_DROPLIST')
  },
  beforeMount() {
    this.rules = rules
  },
  filters: {
    computa(value) {
      if (value) {
        return '(' + value + ')'
      }
      return ''
    }
  }
}
</script>

<style lang="scss">
span.sweep {
  color: #0099ff;
  cursor: pointer;
}
span.is-sweep {
  color: #555;
}
.ul-sweep {
  margin: 0;
  text-align: left;
  padding-bottom: 10px;
}
.date-picker {
  width: 200px !important;
}
</style>
