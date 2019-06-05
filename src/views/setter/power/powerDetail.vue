<template>
  <div class="content">
    <el-form :label-position="'left'" label-width="100px" ref="form" :model="form" show-message>
      <el-row>
        <el-col :span="6">
          <el-form-item label="角色名称：">
            <span>{{form.RoleName}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="角色描述：">
            <span>{{form.Note}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="24">
          <el-form-item label="货品权限：" class="is-required">
            <el-radio-group disabled name="AuthType" v-model="form.CanViewPrivateField">
              <el-radio :label="yNStatus.No">不允许查看私密数据</el-radio>
              <el-radio :label="yNStatus.Yes">允许查看私密数据</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col style="width: 420px;">
          <el-form-item label="授权登录：" prop="RoleName">
            <el-radio-group name="AuthType" v-model="form.AuthType">
              <el-radio disabled :label="parseInt(securityRoleAuthType.None)">不启用</el-radio>
              <el-radio disabled :label="parseInt(securityRoleAuthType.Message)">
                验证码授权
                <el-popover placement="bottom-right" trigger="hover" content="登录时系统向授权人发送短信验证码，输入正确的验证码可进入系统。">
                  <i class="el-icon-question" slot="reference"></i>
                </el-popover>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col style="width: calc(100% - 420px);" v-if="form.AuthType == securityRoleAuthType.Message || form.AuthType == securityRoleAuthType.Wechat">
          <el-form-item label="授权人：">
            <el-select name="users" v-model="users" disabled multiple filterable allow-create default-first-option placeholder="请选择授权人" style="width: 80%;">
              <el-option v-for="item in allUsers" :key="item.value" :label="item.TrueName" :value="item.UserId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="客户权限："
        class="is-required"
        v-if="$store.getters.user_session.CharacterType == characterType.Store || $store.getters.user_session.CharacterType == characterType.Group || $store.getters.user_session.CharacterType == characterType.Company"
      >
        <el-checkbox disabled name="CanViewPhone" v-model="form.CanViewPhone" :true-label="yNStatus.Yes" :false-label="yNStatus.No">
          <span class="m-r-5">查看手机号码</span>
          <el-tooltip placement="bottom">
            <div slot="content">
              如果未勾选，客户的手机号码加密显示，
              <br>例如：13812345678显示为13*******78
            </div>
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-checkbox>
      </el-form-item>
      <el-row class="permission-list" v-loading="bodyLoading">
        <div class="tabs">
          <span name="tab0" class="tab" :class="{'active': terminalType == securityTerminalType.Web}" @click="terminalType = securityTerminalType.Web">PC端权限</span>
          <span
            name="tab1"
            class="tab"
            v-if="$store.getters.user_session.CharacterType == characterType.Store"
            :class="{'active': terminalType == securityTerminalType.App}"
            @click="terminalType = securityTerminalType.App"
          >手机端权限</span>
        </div>
        <div class="panel">
          <powerSet v-if="terminalType == securityTerminalType.Web" :terminalType="securityTerminalType.Web" :menus="pcMenus" :allPowers="allPowers" :myPowers="myPowers"></powerSet>
          <powerSet v-if="terminalType == securityTerminalType.App" :terminalType="securityTerminalType.App" :menus="phoneMenus" :allPowers="allPowers" :myPowers="myPowers"></powerSet>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { CharacterType, YNStatus } from '@/enums/common.js'
import { SecurityRoleAuthType, SecurityTerminalType } from '@/enums/merchant'
import {
  MERCHANT_API_SECURITY_PACK_MENU_REQS,
  MERCHANT_API_SECURITY_MENU_POWER_GETS,
  MERCHANT_API_DROPDOWN_USERLIST,
  MERCHANT_API_SECURITY_ROLE_GET
} from '@/apis/merchant'
import powerSet from './powerSet'
export default {
  data () {
    return {
      yNStatus: YNStatus,
      securityRoleAuthType: SecurityRoleAuthType,
      securityTerminalType: SecurityTerminalType,
      characterType: CharacterType,
      terminalType: SecurityTerminalType.Web,
      roleId: '',
      form: {
        AuthType: SecurityRoleAuthType.None
      },
      menusPower: [],
      bodyLoading: false,
      menus: [],
      pcIndex: 0,
      wapIndex: 0,
      phoneMenus: [],
      pcMenus: [],
      powers: [],
      allUsers: [],
      users: [],
      myPowers: [],
      activeIndex: 0,
      allPowers: []
    }
  },
  watch: {
    terminalType () {
      this.getRoleData()
    }
  },
  methods: {
    dataError (msg) {
      this.$confirm(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: true,
        type: 'warning'
      })
        .then(() => {
          this.$router.push({
            path: '/setter/power/index'
          })
        })
        .catch(() => { })
    },
    getRoleData () {
      MERCHANT_API_SECURITY_ROLE_GET({
        RoleId: this.$route.query.id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          let users = []
          var AuthUsers = res.data.Data.AuthUsers
            ? JSON.parse(res.data.Data.AuthUsers)
            : []
          AuthUsers.forEach(item => {
            users.push(item.AuthUserId)
          })
          this.users = users
          this.form = res.data.Data
          this.updatePowers = new Set(res.data.Data.PowerIds)
          this.getSystemsData(res.data.Data.PowerIds || [])
        }
      })
    },
    getSystemsData (myPowers) {
      this.$store.commit('SET_TB_LOADING', true)
      MERCHANT_API_SECURITY_PACK_MENU_REQS({
        RoleId: 0,
        SystemId: 0,
        NeedSystemNote: 0,
        NeedPower: 0,
        PackId: this.$store.getters.user_session.PackId,
        TerminalType: this.terminalType
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.getPackMenusgetPackMenus(res.data.Data.Systems, myPowers)
        }
      })
    },
    getPackMenusgetPackMenus (Systems, myPowers) {
      // 获取系统信息
      this.bodyLoading = true
      MERCHANT_API_SECURITY_MENU_POWER_GETS({
        TerminalType: this.terminalType
      })
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.restTreeMenus(Systems, res.data.Data.Rows, myPowers)
          } else {
            this.$message.error(res.data.Message)
          }
          this.bodyLoading = false
        })
        .catch(() => {
          this.pcMenus = ''
          this.phoneMenus = ''
          this.bodyLoading = false
        })
    },
    getUsersList () {
      MERCHANT_API_DROPDOWN_USERLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.allUsers = res.data.Data.Rows
        }
      })
    },
    restTreeMenus (arry, allPower, RolePowers) {
      let newArry = JSON.parse(
        JSON.stringify(arry)
          .replace(/SystemName|SubName|MenuName/g, 'label')
          .replace(/Subs|Menus/g, 'children')
      )
      let pc = []
      let phone = []
      let myPowers = []
      let allPowers = []

      newArry.forEach((item, fristIndex) => {
        item.disabled = true // 设置禁用
        item.children.length &
          item.children.forEach((sub, subIndex) => {
            sub.disabled = true // 设置禁用
            sub.id = sub.SubId
            sub.children.length &
              sub.children.forEach((menu, menuIndex) => {
                menu.disabled = true // 设置禁用
                let children = []
                menu.id = menu.MenuId
                allPower.map(power => {
                  if (power.MenuId === menu.MenuId) {
                    if (RolePowers.indexOf(power.PowerId) > -1) {
                      myPowers.push(fristIndex +''+ subIndex + '' + menuIndex + '&' + power.PowerId)
                    }
                    allPowers.push(fristIndex +''+ subIndex + '' + menuIndex + '&' + power.PowerId)
                    children.push(
                      Object.assign({}, power, {
                        label: power.PowerTitle,
                        id: fristIndex +''+ subIndex + '' + menuIndex + '&' + power.PowerId,
                        isLeaf: true,
                        disabled: true // 设置禁用
                      })
                    )
                  }
                })
                children.sort((a, b) => {
                  // 排序检索在前面
                  return a.SortId - b.SortId
                })
                menu.children = children
              })
          })
      })

      newArry.forEach(item => {
        if (item.TerminalType === SecurityTerminalType.Web) {
          pc.push(item)
        } else {
          phone.push(item)
        }
      })
      if (this.form.IsDefault == YNStatus.Yes) {
        console.log(allPowers)
        // 超级管理员 默认全部添加
        this.myPowers = allPowers
      } else {
        this.myPowers = myPowers
      }
      this.allPowers = allPowers
      this.pcMenus = pc
      this.phoneMenus = phone
    }
  },
  beforeMount () {
    this.getUsersList()
  },
  mounted () {
    if (this.$route.query.id) {
      this.roleId = this.$route.query.id
      this.getRoleData()
    } else {
      this.dataError()
    }
  },
  components: {
    powerSet
  }
}
</script>
