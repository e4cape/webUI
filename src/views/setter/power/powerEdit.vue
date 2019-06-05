<template>
  <div class="content">
    <el-row class="permission-list" v-loading="bodyLoading">
      <div class="tabs position">
        <span name="tab0" class="tab" :class="{'active': terminalType == securityTerminalType.Web}" @click="terminalType = securityTerminalType.Web">PC端权限</span>
        <span
          name="tab1"
          class="tab"
          v-if="$store.getters.user_session.CharacterType == characterType.Store"
          :class="{'active': terminalType == securityTerminalType.App}"
          @click="terminalType = securityTerminalType.App"
        >手机端权限</span>
        <el-button type="text" class="p-r" @click="upDateVisible = true">修改基本信息</el-button>
      </div>
      <div class="panel">
        <powerSet v-if="terminalType == securityTerminalType.Web" :terminalType="terminalType.Web" :menus="pcMenus" :allPowers="allPowers" :myPowers="myPowers" @powerChange="powerChange"></powerSet>
        <powerSet v-if="terminalType == securityTerminalType.App" :terminalType="terminalType.App" :menus="phoneMenus" :allPowers="allPowers" :myPowers="myPowers" @powerChange="powerChange"></powerSet>
      </div>
    </el-row>

    <div class="buttons">
      <el-button name="saveEdit" type="primary" @click="updateData" :loading="bodyLoading">保存修改</el-button>
    </div>

    <el-dialog title="修改基本信息" :visible.sync="upDateVisible" custom-class="department-dialog">
      <el-form :label-position="'left'" label-width="100px" ref="form" :model="form" :rules="rules" show-message>
        <el-form-item label="角色名称：" prop="RoleName">
          <el-input name="RoleName" v-model="form.RoleName" @blur="form.RoleName=form.RoleName.trim()" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：">
          <el-input name="Note" v-model="form.Note" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="货品权限：" class="is-required">
          <el-radio-group name="AuthType" v-model="form.CanViewPrivateField">
            <el-radio :label="yNStatus.No">不允许查看私密数据</el-radio>
            <el-radio :label="yNStatus.Yes">允许查看私密数据</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="授权登录：" class="is-required" v-if="$store.getters.user_session.CharacterType == characterType.Store || $store.getters.user_session.CharacterType == characterType.Company">
          <el-radio-group name="AuthType" v-model="form.AuthType">
            <el-radio :label="parseInt(securityRoleAuthType.None)">不启用</el-radio>
            <el-radio :label="parseInt(securityRoleAuthType.Message)">
              验证码授权
              <el-popover placement="bottom-right" trigger="hover" content="登录时系统向授权人发送短信验证码，输入正确的验证码可进入系统。">
                <i class="el-icon-question" slot="reference"></i>
              </el-popover>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="授权人：" class="is-required" v-if="form.AuthType == securityRoleAuthType.Message">
          <el-select name="users" v-model="users" multiple filterable allow-create default-first-option placeholder="请选择授权人" style="width: 80%;">
            <el-option v-for="item in allUsers" :disabled="!item.Mobile" :key="item.value" :label="item.TrueName + item.Mobile" :value="item.UserId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="客户权限："
          class="is-required"
          v-if="$store.getters.user_session.CharacterType == characterType.Store || $store.getters.user_session.CharacterType == characterType.Group || $store.getters.user_session.CharacterType == characterType.Company"
        >
          <el-checkbox name="CanViewPhone" v-model="form.CanViewPhone" :true-label="yNStatus.Yes" :false-label="yNStatus.No">
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
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button name="submit" type="primary" :loading="$store.getters.is_loading" @click="upDateVisible = false">确定</el-button>
        <el-button name="cancel" @click="upDateVisible =  false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { CharacterType, YNStatus } from '@/enums/common.js'
import { SecurityRoleAuthType, SecurityTerminalType } from '@/enums/merchant'
import {
  MERCHANT_API_SECURITY_PACK_MENU_REQS,
  MERCHANT_API_SECURITY_MENU_POWER_GETS,
  MERCHANT_API_DROPDOWN_USERLIST,
  MERCHANT_API_SECURITY_ROLE_UPDATE,
  MERCHANT_API_SECURITY_ROLE_GET
} from '@/apis/merchant'
import powerSet from './powerSet'
export default {
  data () {
    return {
      yNStatus: YNStatus,
      characterType: CharacterType,
      securityTerminalType: SecurityTerminalType,
      securityRoleAuthType: SecurityRoleAuthType,
      form: {
        AuthType: SecurityRoleAuthType.None,
        CanViewPhone: '',
        CanViewPrivateField: '',
        CanViewCostPrice: ''
      },
      rules: {
        RoleName: {
          required: true,
          message: '请选择角色名称',
          trigger: 'change'
        }
      },
      phoneMenus: [],
      pcMenus: [],
      myPowers: [],
      allUsers: [],
      users: [],
      upDateVisible: false,
      bodyLoading: false,
      activeIndex: 0,
      terminalType: SecurityTerminalType.Web,
      updatePowers: [],
      allPowers: []
    }
  },
  watch: {
    terminalType () {
      this.getRoleData()
    }
  },
  methods: {
    getRoleData () {
      MERCHANT_API_SECURITY_ROLE_GET({
        RoleId: this.$route.query.id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          let users = []
          var AuthUsers = JSON.parse(res.data.Data.AuthUsers)
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
        TerminalType: 1
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
    updateData () {
      // 修改数据
      if (
        this.form.AuthType == SecurityRoleAuthType.Message &&
        !this.users.length
      ) {
        this.$message.error('请选择授权人！')
        return
      }
      this.bodyLoading = true
      let AuthInfos = []
      this.users.forEach(item => {
        this.allUsers.forEach(children => {
          if (children.UserId === item) {
            AuthInfos.push({
              AuthUserId: item,
              AuthUser: children.TrueName,
              Phone: children.Mobile
            })
          }
        })
      })
      MERCHANT_API_SECURITY_ROLE_UPDATE({
        RoleId: Number(this.$route.query.id),
        RoleName: this.form.RoleName.replace(/^\s+|\s+$/g, ''),
        AuthType: this.form.AuthType,
        CanViewPhone: this.form.CanViewPhone || YNStatus.No,
        CanViewPrivateField: this.form.CanViewPrivateField || YNStatus.No,
        CanViewCostPrice: this.form.CanViewCostPrice || YNStatus.No,
        AuthUsers: JSON.stringify(AuthInfos),
        Note: this.form.Note,
        PowerIds: [...this.updatePowers]
      })
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            // this.$root.getMenus() 修改完权限之后重新获取权限信息
            this.$router.push({
              path: '/setter/power/index'
            })
            this.$store.commit('SET_BTN_LOADING', false)
          } else {
            this.$message.error(res.data.Message)
          }
          this.bodyLoading = false
        })
        .catch(() => {
          this.bodyLoading = false
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
        item.children.length &
          item.children.forEach((sub, subIndex) => {
            sub.id = sub.SubId
            sub.children.length &
              sub.children.forEach((menu, menuIndex) => {
                let children = []
                menu.id = menu.MenuId
                allPower.map(power => {
                  if (power.MenuId === menu.MenuId) {
                    if (RolePowers.indexOf(power.PowerId) > -1) {
                      myPowers.push(fristIndex + '' + subIndex + '' + menuIndex + '&' + power.PowerId)
                    }
                    allPowers.push(fristIndex + '' + subIndex + '' + menuIndex + '&' + power.PowerId)
                    children.push(
                      Object.assign({}, power, {
                        label: power.PowerTitle,
                        id: fristIndex + '' + subIndex + '' + menuIndex + '&' + power.PowerId,
                        isLeaf: true
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
      this.allPowers = allPowers
      this.myPowers = myPowers
      this.pcMenus = pc
      this.phoneMenus = phone
    },
    powerChange (data) {
      this.updatePowers = data.Powers
    },
    getUsersList () {
      MERCHANT_API_DROPDOWN_USERLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.allUsers = res.data.Data.Rows
        }
      })
    },
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
<style lang="scss" scoped>
.position {
  position: relative;
}
.p-r {
  position: absolute;
  right: 10px;
}
</style>

