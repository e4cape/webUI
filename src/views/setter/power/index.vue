<template>
  <div class="content">
    <el-row style="margin-bottom: 10px;">
      <el-button name="powerCreateLink" type="primary" @click="createVisible = true">新建</el-button>
    </el-row>
    <el-table :data="tableData" v-loading="$store.getters.tb_loading">
      <el-table-column prop="RoleName" label="角色名称" show-overflow-tooltip width="200"></el-table-column>
      <el-table-column prop="Note" label="角色描述" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Note" label="货品权限" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.CanViewPrivateField == yNStatus.No ? '不允许查看私密数据' : '允许查看私密数据'}}</template>
      </el-table-column>
      <el-table-column prop="Note" label="授权登录" show-overflow-tooltip>        
        <template slot-scope="scope">{{scope.row.AuthType == securityRoleAuthType.None ? '不启用' : '验证码授权'}}</template>
      </el-table-column>
      <el-table-column prop="Note" label="客户权限" show-overflow-tooltip>        
        <template slot-scope="scope">{{scope.row.CanViewPhone == yNStatus.No ? '不允许查看手机号码' : '允许查看手机号码'}}</template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <router-link name="powerDetailLink" class="el-button el-button--text el-button--small" :to="{path:'/setter/power/powerDetail',query:{id:scope.row.RoleId}}">查看</router-link>
          <router-link
            name="powerEditLink"
            class="el-button el-button--text el-button--small"
            v-if="scope.row.IsDefault === yNStatus.No"
            :to="{path:'/setter/power/powerEdit',query:{id:scope.row.RoleId, name: scope.row.RoleName}}"
          >修改</router-link>
          <el-button name="deleteRoleLink" type="text" v-if="scope.row.State === enableState.Enable && scope.row.IsDefault === yNStatus.No" @click="deleteRole($event,scope.row.RoleId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Pagination -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <el-dialog title="新建权限与角色" :visible.sync="createVisible" custom-class="department-dialog">
      <el-form label-width="110px" :rules="rules" :model="form" ref="powerFrom">
        <el-form-item label="角色名称：" prop="RoleName">
          <el-input name="RoleName" @blur="form.RoleName=form.RoleName.trim()" v-model="form.RoleName" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：">
          <el-input name="Note" v-model="form.Note" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="货品权限：" class="is-required" prop="CanViewPrivateField">
          <el-radio-group name="AuthType" v-model="form.CanViewPrivateField">
            <el-radio :label="yNStatus.No">不允许查看私密数据</el-radio>
            <el-radio :label="yNStatus.Yes">允许查看私密数据</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="授权登录：" class="is-required">
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
        <el-form-item label="授权人：" v-if="form.AuthType == securityRoleAuthType.Message || form.AuthType == securityRoleAuthType.Wechat" class="is-required">
          <el-select name="users" v-model="users" multiple filterable allow-create default-first-option placeholder="请选择授权人" style="width: 80%;">
            <el-option v-for="item in allUsers" :disabled="!item.Mobile" :key="item.value" :label="item.TrueName + item.Mobile" :value="item.UserId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="客户权限："
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
        <el-button name="submit" type="primary" :loading="$store.getters.is_loading" @click="createData">确定</el-button>
        <el-button name="cancel" @click="createVisible =  false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  MERCHANT_API_SECURITY_ROLE_GETS,
  MERCHANT_API_DROPDOWN_USERLIST,
  MERCHANT_API_SECURITY_ROLE_CREATE,
  MERCHANT_API_SECURITY_ROLE_DISABLE
} from '@/apis/merchant'
import { EnableState, YNStatus, CharacterType } from '@/enums/common.js'
import { SecurityRoleAuthType } from '@/enums/merchant'
import pagination from '@/components/pagination'
export default {
  data() {
    return {
      yNStatus: YNStatus,
      createVisible: false,
      enableState: EnableState,
      securityRoleAuthType: SecurityRoleAuthType,
      tableData: [],
      total: 0,
      characterType: CharacterType,
      form: {
        RoleName: '',
        CanViewPhone: '',
        roleDescription: '',
        CanViewPrivateField: YNStatus.No,
        CanViewCostPrice: '',
        AuthType: SecurityRoleAuthType.None,
        AuthInfos: [],
        pcPermission: [], // pc端权限列表
        wapPermission: [] // 移动端权限列表
      },
      users: [],
      allUsers: [],
      rules: {
        RoleName: {
          required: true,
          message: '请选择角色名称',
          trigger: 'change'
        },
        CanViewPrivateField: {
          required: true,
          message: '请选择货品权限',
          trigger: 'change'
        }
      },
      queryForm: {
        PageIndex: 1,
        PageSize: 20
      },
      parameters: {}
    }
  },
  methods: {
    init() {
      let query = this.$route.query || {}
      this.queryForm = Object.assign(
        {},
        this.queryForm,
        {
          PageIndex: 1,
          PageSize: 20
        },
        query
      )
      this.getSecurityRole()
    },
    onSearch() {
      this.queryForm.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getSecurityRole()
      } else {
        this.initRoute()
      }
    },
    getUsersList() {
      MERCHANT_API_DROPDOWN_USERLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.allUsers = res.data.Data.Rows
        }
      })
    },
    createData() {
      this.$refs['powerFrom'].validate(valid => {
        if (valid) {
          if (
            this.form.AuthType == SecurityRoleAuthType.Message &&
            !this.users.length
          ) {
            this.$message.error('请选择授权人！')
            return
          }
          this.updateData()
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    updateData() {
      // 修改数据
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
      MERCHANT_API_SECURITY_ROLE_CREATE({
        RoleName: this.form.RoleName.replace(/^\s+|\s+$/g, ''),
        AuthType: this.form.AuthType,
        CanViewPhone: this.form.CanViewPhone || YNStatus.No,
        CanViewPrivateField: this.form.CanViewPrivateField || YNStatus.No,
        CanViewCostPrice: this.form.CanViewCostPrice || YNStatus.No,
        AuthUsers: JSON.stringify(AuthInfos),
        Note: this.form.Note
      })
        .then(res => {
          this.createVisible = false
          if (res.data.Code === 'CORRECT') {
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            this.$router.push({
              path: '/setter/power/powerEdit?id=' + res.data.Data + '&name=' + this.form.RoleName.replace(/^\s+|\s+$/g, '')
            })
          } else {
            this.$message.error(res.data.Message)
          }
        }).catch(() => {
          this.createVisible = false
        })
    },
    getSecurityRole() {
      this.$store.commit('SET_TB_LOADING', true)
      MERCHANT_API_SECURITY_ROLE_GETS({
        RoleName: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: this.queryForm.PageIndex,
        PageSize: this.queryForm.PageSize
      })
        .then(res => {
          this.$store.commit('SET_TB_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.tableData = res.data.Data.Rows
            this.total = res.data.Data.Count
          } else {
            this.$message.error(res.data.Message)
          }
        })
        .catch(() => {
          this.$store.commit('SET_TB_LOADING', false)
        })
    },
    deleteRole(e, id) {
      e.currentTarget.blur()
      this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MERCHANT_API_SECURITY_ROLE_DISABLE({
            RoleId: id
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.getSecurityRole()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {})
    },
    currentChange(val) {
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.initRoute()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: this.parameters
      })
    }
  },
  mounted() {
    this.getUsersList()
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination
    // searchPanel
  }
}
</script>
