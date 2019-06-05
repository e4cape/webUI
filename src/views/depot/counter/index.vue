<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" @keyup.enter.native="onSearch" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel :isSenior="false">
        <template slot="btnBox">
          <el-button type="primary" @click="createDialogVisible = true" name="btnCreateDialog">新建</el-button>
          <el-button @click="reasonDialog = true" name="btnReason">分组管理</el-button>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select v-model="queryForm.State" @change="onSearch">
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="(item, index) in EnableState.Types" :key="index" :value="index" :label="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="DeskName">
            <el-input v-model="queryForm.DeskName" placeholder="柜台名称" :maxlength="50">
              <el-button slot="append" icon="el-icon-search" @click="onSearch" name="btnSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-row :gutter="20">
      <el-col :span="4" v-loading="loading1">
        <el-radio-group v-model="queryForm.GroupTypeDk" @change="onSearch" class="month-check">
          <el-radio-button :label="-1">全部</el-radio-button>
          <el-radio-button :label="0">未分组</el-radio-button>
          <el-radio-button v-for="(item, index ) in deskClassData" :key="index" :label="item.Id">{{item.Value}}</el-radio-button>
        </el-radio-group>
      </el-col>
      <el-col :span="20">
        <!-- Data Table -->
        <template>
          <el-table :data="data" @sort-change="sortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
            <el-table-column prop="DeskName" label="柜台名称" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column prop="ChargeUser" label="负责人" min-width="90" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GroupTypeDv" label="所属分组" :formatter="formatter" min-width="90" show-overflow-tooltip></el-table-column>
            <el-table-column prop="LastPickupTime" label="最后领货时间" :formatter="formatter" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column prop="LastReturnTime" label="最后退货时间" :formatter="formatter" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
            <el-table-column prop="State" label="状态" show-overflow-tooltip width="80">
              <template slot-scope="scope">
                <el-tooltip :disabled="!scope.row.CheckNote" class="item" :content="scope.row.CheckNote" placement="top" effect="light">
                  <span :class="scope.row.State | findKey(EnableState)">{{EnableState.Types[scope.row.State]}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="200" fixed="right">
              <template slot-scope="scope">
                <router-link :to="{path:'/depot/counter/check',query:{id:scope.row.DeskId}}" class="el-button el-button--text btn-link" name="btnCheck">查看</router-link>
                <template v-if="scope.row.IsDefault !== YNStatus.Yes">
                  <template v-if="scope.row.State === EnableState.Enable">
                    <el-button type="text" @click="editDeskBefore(scope.row)" name="btnEditDeskBefore">修改</el-button>
                    <el-button type="text" @click="getAction(DeskPickretOrderBasicPickretType.Pickup,scope.row)" name="btnGetGoods">领货</el-button>
                    <el-button type="text" @click="getAction(DeskPickretOrderBasicPickretType.Return,scope.row)" name="btnReturnGoods">退货</el-button>
                    <el-button type="text" @click="disableDesk($event, scope.row.DeskId)" name="btnReturnGoods">停用</el-button>
                  </template>
                  <el-button type="text" @click="enableDesk($event, scope.row.DeskId)" v-else name="btnReturnGoods">启用</el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
          <!-- Pagination -->
          <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
        </template>
      </el-col>
    </el-row>

    <!-- @module 新建柜台 -->
    <el-dialog title="新建柜台" :visible.sync="createDialogVisible" @close="resetForm">
      <el-form label-position="right" label-width="100px" :model="createForm" :rules="editRules" ref="createForm">
        <el-form-item label="柜台名称" prop="DeskName">
          <el-input v-model="createForm.DeskName" @blur="editForm.DeskName = editForm.DeskName.trim()" :maxlength="50" name="DeskName"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="ChargeUserId">
          <el-select v-model="createForm.ChargeUserId" @change="getChargeUser" :filterable="true" name="ChargeUserId">
            <template v-for="(item, index) in $store.getters.users">
              <el-option v-if="item.UserState === SecurityUserState.Audit && item.TrueName" :key="index" :label="item.TrueName" :value="item.UserId"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="所属分组" prop="GroupTypeDk">
          <el-select v-model="createForm.GroupTypeDk" @change="getGroupTypeDV" :filterable="true" name="GroupTypeDk">
            <el-option v-for="(item, index) in deskClassData" :key="index" :value="item.Id" :label="item.Value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.prevent="createDesk" :loading="$store.getters.is_loading" name="btnCreateDesk">确 定</el-button>
        <el-button @click.prevent="createDialogVisible = false" name="btnCreateCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 新建柜台 -->

    <!-- @module 修改柜台 -->
    <el-dialog title="修改柜台" :visible.sync="editDialogVisible">
      <el-form label-position="right" label-width="100px" :model="editForm" :rules="editRules" ref="editForm">
        <el-form-item label="柜台名称" prop="DeskName">
          <el-input v-model="editForm.DeskName" @blur="editForm.DeskName = editForm.DeskName.trim()" :maxlength="50" name="deskName"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="ChargeUserId">
          <el-select v-model="editForm.ChargeUserId" @change="getChargeUser" :filterable="true" name="ChargeUserId">
            <template v-for="(item, index) in $store.getters.users">
              <el-option v-if="item.UserState === SecurityUserState.Audit && item.TrueName" :key="index" :label="item.TrueName" :value="item.UserId"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="所属分组" prop="GroupTypeDk">
          <el-select v-model="editForm.GroupTypeDk" @change="getGroupTypeDV" :filterable="true" name="GroupTypeDk">
            <el-option v-for="(item, index) in deskClassData" :key="index" :value="item.Id" :label="item.Value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click.prevent="editDesk" :loading="$store.getters.is_loading" name="btnEditDesk">确 定</el-button>
        <el-button @click.prevent="editDialogVisible = false" name="btnEditCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 新建柜台 -->

    <!-- @module 领货/退货 登录 -->
    <el-dialog
      :title="deskName + '[' + (employeeForm.PickretType === DeskPickretOrderBasicPickretType.Pickup ? '领货':'退货') + ']'"
      :visible.sync="getReturnLogVisible"
      @close="resetEmpoyee"
      class="get-return-log-dialog"
    >
      <template>
        <el-tabs class="counterTabs" v-model="activeName" type="border-card" name="activeName">
          <el-tab-pane label="账户验证" name="first">
            <el-form label-position="right" :model="employeeForm" ref="employeeForm">
              <el-form-item prop="LoginId">
                <el-input
                  v-model="employeeForm.LoginId"
                  :maxlength="50"
                  :placeholder="'请输入'+ (employeeForm.PickretType === DeskPickretOrderBasicPickretType.Pickup ? '领货':'退货') + '人账号'"
                  @keyup.enter.native="getReturnLog"
                  name="loginIdOrOpenId"
                ></el-input>
              </el-form-item>
              <el-form-item prop="Password">
                <el-input
                  type="password"
                  v-model="employeeForm.Password"
                  :maxlength="50"
                  :placeholder="'请输入'+ (employeeForm.PickretType === DeskPickretOrderBasicPickretType.Pickup ? '领货':'退货') + '人密码'"
                  @keyup.enter.native="getReturnLog"
                  name="password"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="扫码验证" name="second">
            <el-form @submit.native.prevent label-position="right" :model="employeeForm">
              <el-form-item prop="LoginId">
                <el-input
                  class="sweepCode"
                  type="password"
                  v-model="employeeForm.LoginId"
                  :maxlength="300"
                  :placeholder="'请扫描'+ (employeeForm.PickretType === DeskPickretOrderBasicPickretType.Pickup ? '领货':'退货') + '人二维码'"
                  @keyup.enter.native="getReturnLog"
                  name="LoginId"
                ></el-input>
              </el-form-item>
              <span style="font-size: 15px;">请扫描{{employeeForm.PickretType === DeskPickretOrderBasicPickretType.Pickup ? '领货':'退货'}}人的二维码</span>
              <div style="font-size: 12px;">（{{employeeForm.PickretType === DeskPickretOrderBasicPickretType.Pickup ? '领货':'退货'}}人打开小程序，选择：我的--领货/退货验证）</div>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <span slot="footer" v-if="activeName === 'first'" class="dialog-footer">
          <el-button type="primary" @click="getReturnLog" :loading="$store.getters.is_loading" name="btnGetReturnLog">确 定</el-button>
          <el-button @click="getReturnLogVisible = false" name="btnGetReturnLogCancel">取 消</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- End 领货/退货 登录 -->

    <!-- @module Dialog·新建分组 -->
    <dict-manage :visible.sync="reasonDialog" :dicts="deskClassData" dialogTitle="柜台分组" :dictType="SettingDictionaryDictType.DeskBasicGroupType" @listenDictSave="getCounterList"></dict-manage>
    <!-- End Dialog·新建分组  -->
  </el-row>
</template>

<script>
import {
  STOCKING_API_DESK_BASIC_GETS,
  STOCKING_API_DESK_BASIC_CREATE,
  STOCKING_API_DESK_BASIC_UPDATE,
  STOCKING_API_DESK_BASIC_DISABLE,
  STOCKING_API_DESK_BASIC_ENABLE,
  STOCKING_API_DESK_PICKRET_ORDER_BASIC_CREATE
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST,
  MERCHANT_API_SETTING_PARAMETER_GET
} from '@/apis/merchant.js'
import { SettingParameterValidateType, SecurityUserState } from '@/enums/merchant.js'
import { YNStatus, EnableState } from '@/enums/common.js'
import {
  DeskPickretOrderBasicPickretType,
  SettingDictionaryDictType
} from '@/enums/stocking.js'
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination.vue'
import dictManage from '@/components/erp/dictManage'
export default {
  data() {
    return {
      YNStatus,
      EnableState,
      SecurityUserState,
      SettingDictionaryDictType,
      DeskPickretOrderBasicPickretType,
      activeName: 'first',
      data: [],
      queryForm: {
        DeskName: '',
        GroupTypeDk: -1,
        OrderBy: 3,
        IsAsced: YNStatus.No,
        State: String(EnableState.Enable),
        PageIndex: 1,
        PageSize: 20
      },
      parameters: {},
      total: 0,
      createDialogVisible: false, // 新建柜台弹窗
      createForm: {
        DeskName: '',
        ChargeUserId: '',
        ChargeUser: '',
        GroupTypeDk: '',
        GroupTypeDv: ''
      },
      deskClassData: [], // 柜台表格数据
      editRules: {
        DeskName: [
          {
            required: true,
            message: '请输入柜台名称',
            trigger: 'blur'
          }
        ],
        ChargeUserId: [
          {
            type: 'number',
            required: true,
            message: '请选择负责人',
            trigger: 'change'
          }
        ],
        // GroupTypeDk: [
        //   {
        //     type: 'number',
        //     required: true,
        //     message: '请选择分组',
        //     trigger: 'change'
        //   }
        // ]
      }, // 新建或修改表单验证
      editDialogVisible: false, // 修改柜台弹窗
      editForm: {},
      getReturnLogVisible: false, // 领退货员工登录
      employeeForm: {
        DeskId: '',
        PickretType: '', // 领退货类型 1代表领货，3代表退货
        LoginId: '',
        Password: ''
      },
      needValidate: true, // 领退货是否需要验证
      deskName: '',
      reasonDialog: false, // 新建柜台
      loading1: false
    }
  },
  methods: {
    enableDesk($event, id) {
      // 柜台启用
      $event.currentTarget.blur()
      this.$confirm('确定要启用当前柜台吗？', '停用', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_DESK_BASIC_ENABLE({ DeskId: id }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.getData()
            }
          })
        })
        .catch(() => { })
    },
    disableDesk($event, id) {
      // 停用
      $event.currentTarget.blur()
      this.$confirm('确定要停用当前柜台吗？', '停用', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_DESK_BASIC_DISABLE({ DeskId: id }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.getData()
            }
          })
        })
        .catch(() => { })
    },
    getChargeUser(id) {
      this.createForm.ChargeUser = this.$store.getters.users.find(
        item => item.UserId === id
      ).TrueName
      this.editForm.ChargeUser = this.$store.getters.users.find(
        item => item.UserId === id
      ).TrueName
    },
    getGroupTypeDV(id) {
      this.createForm.GroupTypeDv = this.deskClassData.find(
        item => item.Id === id
      ).Value
      this.editForm.GroupTypeDv = this.deskClassData.find(
        item => item.Id === id
      ).Value
    },
    createDesk() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          let param = JSON.parse(JSON.stringify(this.createForm))
          param.GroupTypeDk = param.GroupTypeDk || 0
          STOCKING_API_DESK_BASIC_CREATE(param).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('创建成功')
              this.queryForm.GroupTypeDk = -1
              this.onSearch()
              this.createDialogVisible = false
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        }
      })
    },
    resetForm() {
      this.$refs['createForm'].resetFields()
    },
    editDeskBefore(row) {
      this.editForm = { ...row }
      this.editForm.GroupTypeDk = this.editForm.GroupTypeDk || ''
      this.editDialogVisible = true
    },
    editDesk() {
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          let param = { ...this.editForm }
          param.GroupTypeDk = param.GroupTypeDk || 0
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_DESK_BASIC_UPDATE(param).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.getData()
              this.editDialogVisible = false
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        }
      })
    },
    formatter(row, column, val) {
      switch (column.property) {
        case 'GroupTypeDv':
          return val || '未分组'
        case 'LastPickupTime':
        case 'LastReturnTime':
          return this.$options.filters.filterDateMinutes(val)
        default:
          return EnableState.Types[val]
      }
    },
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            DeskName: '',
            GroupTypeDk: -1,
            OrderBy: 3,
            IsAsced: YNStatus.No,
            State: String(EnableState.Enable),
            PageIndex: 1,
            PageSize: 20
          }
      query.GroupTypeDk = parseInt(query.GroupTypeDk)
      query.PageIndex = parseInt(query.PageIndex)
      query.PageSize = parseInt(query.PageSize)
      this.parameters = { ...query }
      this.queryForm = { ...query }
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_DESK_BASIC_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
          if(this.parameters.PageIndex !== 1 && this.data.length === 0) {
            this.onSearch()
          }
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'DeskName':
          this.parameters.OrderBy = 0
          break
        case 'LastPickupTime':
          this.parameters.OrderBy = 1
          break
        case 'LastReturnTime':
          this.parameters.OrderBy = 2
          break
        default:
          this.parameters.OrderBy = 3
          break
      }
      this.parameters.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.initRoute()
    },
    isNeedValidate() {
      MERCHANT_API_SETTING_PARAMETER_GET({
        CharacterId: this.$store.getters.user_session.CharacterId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.needValidate =
            res.data.Data.ValidateType === SettingParameterValidateType.Password
        }
      })
    },
    getAction(type, row) {
      this.employeeForm.PickretType = type
      this.employeeForm.DeskId = row.DeskId
      this.deskName = row.DeskName
      if (this.needValidate) {
        this.getReturnLogVisible = true
      } else {
        this.getReturnLog()
      }
    },
    getReturnLog() {
      if (this.needValidate) {
        if (this.activeName === 'second') {
          if (!this.employeeForm.LoginId) {
            this.$message.error('请扫描二维码')
            return false
          }
        } else {
          if (!this.employeeForm.LoginId || !this.employeeForm.Password) {
            this.$message.error('请填写账号和密码')
            return false
          }
        }
      }
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_DESK_PICKRET_ORDER_BASIC_CREATE(this.employeeForm).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.$router.push({
              path:
                this.employeeForm.PickretType ===
                  DeskPickretOrderBasicPickretType.Pickup
                  ? '/depot/counter/take'
                  : '/depot/counter/return',
              query: {
                pickretId: res.data.Data.PickretId,
                deskName: this.deskName
              }
            })
          }
          this.$store.commit('SET_BTN_LOADING', false)
        }
      )
    },
    resetEmpoyee() {
      this.$refs.employeeForm.resetFields()
      this.activeName = 'first'
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      if (JSON.stringify(this.parameters) === JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.parameters = { ...this.queryForm }
        this.initRoute()
      }
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.initRoute()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: this.parameters
      })
    },
    listenDictSave() {
      this.getCounterList()
    },
    getCounterList() {
      // 获取柜台分组列表
      this.loading1 = true
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: SettingDictionaryDictType.DeskBasicGroupType,
        State: YNStatus.Yes
      }).then(res => {
        this.loading1 = false
        if (res.data.Code === 'CORRECT') {
          this.deskClassData = res.data.Data.Rows || []
        }
      })
    },
    getUserlist() {
      this.$store.dispatch('GET_USERS_DROPLIST')
    }
  },
  beforeMount() {
    this.getCounterList()
    this.getUserlist()
    this.isNeedValidate()
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init',
    activeName(value) {
      this.employeeForm.LoginId = ''
      this.employeeForm.Password = ''
      if (value === 'second') {
        setTimeout(() => {
          document.getElementsByClassName('sweepCode')[0].children[0].focus()
        }, 1)
      }
    }
  },
  components: {
    searchPanel,
    pagination,
    dictManage
  }
}
</script>

<style  lang="scss">
.month-check {
  width: 100%;
  .el-radio-button {
    width: 100%;
    .el-radio-button__inner {
      width: 100%;
      padding: 15px;
      border: 1px solid #ebeef5;
      border-bottom: 0;
      border-radius: 0 !important;
      box-shadow: none;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &:last-child {
      .el-radio-button__inner {
        border-bottom: 1px solid #ebeef5;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.counterTabs {
  padding: 0 !important;
  box-shadow: none;
  .el-tabs__header {
    border: none !important;
  }
  .el-tabs .el-tabs__header {
    border: none;
  }
  .el-tabs__nav-wrap {
    margin-bottom: -2px;
  }
}
.sweepCode {
  input {
    ime-mode: disabled;
  }
}
.borderBottom {
  border-bottom: 1px solid #ededed;
}
.tabke-tb tr.current-row > td {
  color: #fff;
  background-color: #20a0ff !important;
}
</style>
