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
            <el-input name="TrueName" v-model="form.TrueName" @blur="form.TrueName=form.TrueName.trim()"  :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="工号：" prop="JobCode">
            <el-input name="JobCode" v-model="form.JobCode" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="在职状态：" prop="VitaState">
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
              <el-option v-for="(item,index) in securityUserBerthType.Types" :label="item" name="securityUserBerthTypes" :key="index" :value="Number(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色：" prop="RoleId">
            <el-select name="RoleId" v-model="form.RoleId" placeholder="请选择" filterable>
              <el-option v-for="item in roleList" :key="item.KeyId" :label="item.Value" :value="parseInt(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收银权限：" v-if="$store.getters.user_session.CharacterType == characterType.Store">
            <el-select name="CashierType" v-model="form.CashierType" prop="securityUserCashierTypes" placeholder="请选择" filterable>
              <el-option v-for="(item,index) in securityUserCashierType.Types" :label="item" name="securityUserCashierTypes" :key="index" :value="Number(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户名：" prop="LoginId">
            <el-input name="LoginId" v-model="form.LoginId"  @blur="form.LoginId=form.LoginId.trim()"   :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="初始密码：" prop="Password">
            <el-input name="Password" v-model="form.Password" @blur="form.Password=form.Password.trim()"    type="Password" :maxlength="20"></el-input>
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
import { CharacterType, EnableState, SexyType, YNStatus } from '@/enums/common.js'
import {
  SecurityUserVitaState,
  SecurityUserBerthType,
  SecurityUserCashierType
} from '@/enums/merchant'
import {
  MERCHANT_API_SECURITY_USER_CREATE,
  MERCHANT_API_DROPDOWN_ROLELIST
} from '@/apis/merchant'

import uploadImgByBtn from '@/components/common/uploadImgByBtn.vue'
export default {
  data() {
    return {
      SETTING_STAFF,
      DOMAIN_IMG_FILE,
      YNStatus,
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
        BerthType: SecurityUserBerthType.Master, // 微信端角色类型
        CashierType: SecurityUserCashierType.Employee, // 收银台角色类型
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
      roleList: [] // 角色下拉
    }
  },
  components: {
    uploadImgByBtn
  },
  methods: {
    createData() {
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
    addDepartment() {
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
      this.$store.commit('SET_BTN_LOADING', true)
      MERCHANT_API_SECURITY_USER_CREATE({
        LoginId: param.LoginId,
        Password: param.Password,
        BerthType: param.BerthType - 0,
        CashierType: param.CashierType - 0,
        RoleId: param.RoleId || 0,
        DepartmentId: param.DepartmentId || 0,
        CreateUser: param.CreateUser,
        VitaState: param.VitaState - 0,
        JobCode: param.JobCode,
        AliasName: param.AliasName,
        TrueName: param.TrueName,
        ImageUrl: param.ImageUrl,
        SexyType: param.SexyType || 0,
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
            message: '新建成功',
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
    getRoleList() {
      MERCHANT_API_DROPDOWN_ROLELIST({
        State: this.YNStatus.Yes
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.roleList = res.data.Data.Rows
        } else {
          this.$message.error(res.data.Message)
        }
      })
    }
  },
  created() {
    this.$store.dispatch('GET_DEPARTMENTS_DROPLIST')
  },
  beforeMount() {
    this.rules = rules
    this.getRoleList()
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
