<template>
  <div class="content">
    <el-form :label-position="'right'" label-width="130px" :model="form">
      <el-row v-loading="$store.getters.is_loading">
        <div class="panel-tag">
          <span>基本资料</span>
        </div>
        <div style="padding-top: 10px;"></div>
        <el-col :span="12">
          <el-form-item label="姓名：">
            <span>{{form.TrueName}}</span>
          </el-form-item>
          <el-form-item label="工号：">
            <span>{{form.JobCode}}</span>
          </el-form-item>
          <el-form-item label="在职状态：">
            <span>{{form.VitaStateName}}</span>
          </el-form-item>
          <el-form-item label="部门：" v-if="$store.getters.user_session.CharacterType == characterType.Store">
            <span>{{form.Department}}</span>
          </el-form-item>
          <el-form-item label="微信权限：" v-if="$store.getters.user_session.CharacterType == characterType.Store">
            <span>{{form.BerthTypeName}}</span>
          </el-form-item>
          <el-form-item label="收银权限：" v-if="$store.getters.user_session.CharacterType == characterType.Store">
            <span>{{form.CashierTypeName}}</span>
          </el-form-item>
          <el-form-item label="角色：">
            <span>{{form.RoleName}}</span>
          </el-form-item>
          <el-form-item label="用户名：">
            <span>{{form.LoginId}}</span>
          </el-form-item>
          <el-form-item label="出生日期：">
            <span>{{form.Birthday | filterDate}}</span>
          </el-form-item>
          <el-form-item label="性别：">
            <span>{{form.SexyTypeName}}</span>
          </el-form-item>
          <el-form-item label="入职日期：">
            <span>{{form.SignedTime | filterDate}}</span>
          </el-form-item>
          <el-form-item label="转正日期：">
            <span>{{form.OfficialTime | filterDate}}</span>
          </el-form-item>
          <el-form-item label="离职日期：">
            <span>{{form.LeavedTime | filterDate}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="first-right tc">
          <div class="logoImg">
            <img v-if="logoImg" :src="logoImg" alt style="max-width:240px;">
          </div>
        </el-col>
      </el-row>
      <el-row v-loading="$store.getters.is_loading">
        <div class="panel-tag">
          <span>联系方式</span>
        </div>
        <div style="padding-top: 10px;"></div>
        <el-form-item label="手机号码：">
          <span>{{form.Mobile}}</span>
        </el-form-item>
        <el-form-item label="QQ：">
          <span>{{form.QQ}}</span>
        </el-form-item>
        <el-form-item label="邮箱：">
          <span>{{form.Email}}</span>
        </el-form-item>
        <el-form-item label="紧急联系人  ：">
          <span>{{form.Contact}}</span>
        </el-form-item>
        <el-form-item label="紧急联系人电话：">
          <span>{{form.Phone}}</span>
        </el-form-item>
        <el-form-item label="身份证号码：">
          <span>{{form.CardIdentity}}</span>
        </el-form-item>
        <el-form-item label="身份证地址：">
          <span>{{form.CardAddr}}</span>
        </el-form-item>
        <el-form-item label="户口所在地：">
          <span>{{form.NativeAddr}}</span>
        </el-form-item>
        <el-form-item label="现住址：">
          <span>{{form.CurrAddr}}</span>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import {
  MERCHANT_API_SECURITY_USER_REQ,
  MERCHANT_API_DROPDOWN_DEPARTLIST
} from '@/apis/merchant'
import { CharacterType, SexyType } from '@/enums/common.js'
import {
  SecurityUserVitaState,
  SecurityUserBerthType,
  SecurityUserCashierType
} from '@/enums/merchant'
// import { FORM_RULES } from '@/rules/systemValidation'
export default {
  data() {
    return {
      characterType: CharacterType,
      form: {},
      logoImg: '', // logo展示图片
      rules: {}, // 接收表单验证的规则
      Departments: [] // 所有部门信息
    }
  },
  methods: {
    dataError(msg) {
      this.$confirm(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: true,
        type: 'warning'
      }).then(() => {
        this.$router.push({
          path: '/setter/staff/index'
        })
      })
    },
    getData(id) {
      this.$store.commit('SET_BTN_LOADING', true)
      MERCHANT_API_SECURITY_USER_REQ({
        UserId: id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.form = res.data.Data
          this.form.VitaStateName =
            SecurityUserVitaState.Types[this.form.VitaState + '']
          this.form.BerthTypeName =
            SecurityUserBerthType.Types[this.form.BerthType + '']
          this.form.CashierTypeName =
            SecurityUserCashierType.Types[this.form.CashierType + '']
          this.form.SexyTypeName = SexyType.Types[this.form.SexyType + '']
          this.$store.commit('SET_BTN_LOADING', false)
          this.getDepartmentList(res.data.Data.DepartmentId)
          if (
            this.form.ImageUrl.indexOf('http://') >= 0 ||
            this.form.ImageUrl.indexOf('https://') >= 0
          ) {
            this.logoImg = this.form.ImageUrl
          } else {
            this.logoImg = this.$root.settings.DOMAIN_IMG_FILE + this.form.ImageUrl
          }
        }
      })
    },
    getDepartmentList(id) {
      MERCHANT_API_DROPDOWN_DEPARTLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          res.data.Data.Rows.forEach(item => {
            if (item.Id === id) {
              this.$set(this.form, 'DepartmentName', item.Department)
            }
          })
        }
      })
    }
  },
  beforeMount() {
    // this.rules = FORM_RULES
  },
  mounted() {
    let id = this.$route.query.id
    if (id) {
      this.getData(this.$route.query.id)
    } else {
      this.dataError()
    }
  },
  filters: {
    computa(value) {
      if (value) {
        return '(' + value + ')'
      }
      return ''
    },
    initDate(value) {
      if (value === '1900/01/01 00:00:00' || value === '9999/12/31 23:59:59') {
        return ''
      }
      if (value) {
        return value.split(' ')[0]
      }
      return value
    }
  }
}
</script>
