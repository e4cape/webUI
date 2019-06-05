<template>
  <div class="content">
    <el-form
      :model="queryForm"
      ref="search"
      lable-width="120px"
      class="item-lh-26"
      :inline="true"
    >
      <search-panel
        @onSearch="onSearch"
        @onReset="onReset"
      >
        <template slot="btnBox">
          <el-form-item>
            <el-button
              name="staffCreate"
              type="primary"
              @click="$router.push({path: '/setter/staff/staffCreate'})"
              style="width:100px;"
            >新建员工</el-button>
            <el-button
              name="deriVation"
              type="primary"
              @click="deriVation"
              style="width:130px;"
            >导出员工信息</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-dropdown @command="selectState">
              <el-button
                name="UserState"
                type="default"
              >
                {{securityUserState.Types[queryForm.UserState] || '所有状态'}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">所有状态</el-dropdown-item>
                <el-dropdown-item
                  v-for="(item, index) in securityUserState.Types"
                  :key="index"
                  :command="index"
                >{{item}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item>
            <el-input
              name="TrueName"
              v-model="queryForm.TrueName"
              placeholder="请输入员工姓名"
              @keyup.enter.native="onSearch"
            >
              <el-button
                name="search"
                slot="append"
                icon="el-icon-search"
                @click="onSearch"
              ></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item
            label="姓名："
            prop="orderId"
          >
            <el-input
              name="TrueName"
              v-model="queryForm.TrueName"
              @keyup.enter.native="onSearch"
              :maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号码：">
            <el-input
              name="Mobile"
              v-model="queryForm.Mobile"
              @keyup.enter.native="onSearch"
              :maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="入职日期：">
            <el-date-picker
              name="SignedTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="$root.datePickerOptions"
              :editable="false"
              v-model="queryForm.SignedTime"
              :unlink-panels="true"
              type="daterange"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="用户名：">
            <el-input
              name="LoginId"
              v-model="queryForm.LoginId"
              @keyup.enter.native="onSearch"
              :maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="在职状态：">
            <el-select
              name="VitaState"
              v-model="queryForm.VitaState"
              filterable
              placeholder="全部"
            >
              <el-option
                label="全部"
                :value="'0'"
              ></el-option>
              <el-option
                v-for="(item,index) in securityUserVitaState.Types"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="部门："
            v-if="$store.getters.user_session.CharacterType == characterType.Store"
          >
            <el-select
              name="DepartmentId"
              v-model="queryForm.DepartmentId"
              filterable
              placeholder="全部"
            >
              <el-option
                v-for="item in DepartmentDropList"
                :key="item.Id"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="微信权限："
            v-if="$store.getters.user_session.CharacterType == characterType.Store"
          >
            <el-select
              name="BerthType"
              v-model="queryForm.BerthType"
              filterable
              placeholder="全部"
            >
              <el-option
                label="全部"
                :value="'0'"
              ></el-option>
              <el-option
                v-for="(item,index) in securityUserBerthType.Types"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色：">
            <el-select
              name="RoleId"
              v-model="queryForm.RoleId"
              filterable
              placeholder="全部"
            >
              <el-option
                label="全部"
                :value="'0'"
              ></el-option>
              <el-option
                v-for="item in RoleList"
                :key="item.Id"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="收银权限："
            v-if="$store.getters.user_session.CharacterType == characterType.Store"
          >
            <el-select
              name="CashierType"
              v-model="queryForm.CashierType"
              filterable
              placeholder="全部"
            >
              <el-option
                label="全部"
                :value="'0'"
              ></el-option>
              <el-option
                v-for="(item,index) in securityUserCashierType.Types"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="转正日期：">
            <el-date-picker
              name="OfficialTimes"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="$root.datePickerOptions"
              :editable="false"
              v-model="queryForm.OfficialTimes"
              :unlink-panels="true"
              type="daterange"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="离职日期：">
            <el-date-picker
              name="LeavedTimes"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="$root.datePickerOptions"
              :editable="false"
              v-model="queryForm.LeavedTimes"
              :unlink-panels="true"
              type="daterange"
            ></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- Data Table -->

    <div
      class="checkPage-hd tr"
      v-if="$store.getters.user_session.CharacterType == characterType.Store"
    >
      <span>注：员工需要绑定微信才能接收打赏</span>
    </div>
    <el-table
      :data="tableData"
      v-loading="$store.getters.is_loading"
      @sort-change="sortChange"
    >
      <el-table-column
        prop="TrueName"
        label="姓名"
        show-overflow-tooltip
        fixed
      ></el-table-column>
      <el-table-column
        prop="AliasName"
        label="昵称"
        show-overflow-tooltip
        v-if="$store.getters.user_session.CharacterType == characterType.Store"
      ></el-table-column>
      <el-table-column
        prop="JobCode"
        label="工号"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="Mobile"
        label="手机号码"
        min-width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="LoginId"
        label="用户名"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="Department"
        label="部门"
        show-overflow-tooltip
        v-if="$store.getters.user_session.CharacterType == characterType.Store"
      ></el-table-column>
      <el-table-column
        prop="BerthType"
        label="微信权限"
        show-overflow-tooltip
        v-if="$store.getters.user_session.CharacterType == characterType.Store"
      >
        <template slot-scope="scope">
          <span>{{securityUserBerthType.Types[scope.row.BerthType + '']}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="RoleName"
        label="角色"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="CashierType"
        label="收银权限"
        show-overflow-tooltip
        v-if="$store.getters.user_session.CharacterType == characterType.Store"
      >
        <template slot-scope="scope">
          <span>{{securityUserCashierType.Types[scope.row.CashierType + '']}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="入职日期"
        prop="SignedTime"
        min-width="101"
        sortable="custom"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.SignedTime | filterDate}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="转正日期"
        prop="OfficialTime"
        min-width="101"
        sortable="custom"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.OfficialTime | filterDate}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="离职日期"
        prop="LeavedTime"
        min-width="101"
        sortable="custom"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.LeavedTime | filterDate}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="UserState"
        label="微信绑定"
        v-if="$store.getters.user_session.CharacterType == characterType.Store"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{scope.row.OpenId ? '已绑定' : '未绑定'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="VitaState"
        label="在职状态"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{securityUserVitaState.Types[scope.row.VitaState]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="UserState"
        label="账户状态"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span :class="scope.row.UserState | findKey(securityUserState)">{{securityUserState.Types[scope.row.UserState]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="300"
        fixed="right"
      >
        <template slot-scope="scope">
          <router-link
            name="staffDetailLink"
            :to="{path:'/setter/staff/staffDetail',query:{id:scope.row.UserId}}"
            class="btn-link el-button el-button--text"
          >查看</router-link>
          <router-link
            name="staffEditLink"
            v-if="scope.row.UserState != securityUserState.Abandon && scope.row.IsDefault === ynStatus.No"
            :to="{path:'/setter/staff/staffEdit',query:{id:scope.row.UserId}}"
            class="btn-link el-button el-button--text"
          >修改</router-link>
          <el-button
            name="staffAudit"
            type="text"
            v-if="scope.row.UserState === securityUserState.Wait"
            @click="staffAudit($event,scope.row)"
          >审核</el-button>
          <el-button
            name="staffCancelAudit"
            type="text"
            v-if="scope.row.UserState === securityUserState.Audit && scope.row.IsDefault === ynStatus.No"
            @click="staffCancelAudit($event,scope.row, '取消审核')"
          >取消审核</el-button>
          <el-button
            name="staffCancelAudit"
            type="text"
            v-if="scope.row.UserState === securityUserState.Abandon"
            @click="staffCancelAudit($event,scope.row, '恢复账户')"
          >恢复账户</el-button>
          <el-button
            name="staffNullify"
            type="text"
            v-if="scope.row.UserState === securityUserState.Wait && scope.row.IsDefault === ynStatus.No"
            @click="staffNullify($event,scope.row)"
          >作废</el-button>
          <el-button
            name="toStaff"
            type="text"
            v-if="scope.row.VitaState === securityUserVitaState.Try"
            @click="toStaff(scope.row.UserId)"
          >转正</el-button>
          <el-button
            name="toLeave"
            type="text"
            v-if="scope.row.VitaState === securityUserVitaState.Official && scope.row.IsDefault === ynStatus.No"
            @click="toLeave(scope.row.UserId)"
          >离职</el-button>
          <el-button
            v-if="$store.getters.user_session.CharacterType == characterType.Store && !scope.row.OpenId"
            name="staffAudit"
            type="text"
            @click="bindStaffWx(scope.row)"
          >绑定微信</el-button>
          <el-button
            v-if="$store.getters.user_session.CharacterType == characterType.Store && scope.row.OpenId"
            name="staffAudit"
            type="text"
            @click="unBindStaffWx($event,scope.row)"
          >解绑微信</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Pagination -->
    <pagination
      :pg="queryForm.PageIndex"
      :size="queryForm.PageSize"
      :total="total"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
    <!-- End Pagination -->

    <!-- 转正离职弹窗 -->
    <el-dialog
      v-if="sweepTimer"
      width="500px"
      :title="sweepTimerType ? '转正' : '离职'"
      v-loading="$store.getters.is_loading"
      :visible.sync="sweepTimer"
    >
      <el-form
        @submit.native.prevent
        label-width="110px"
        :rules="sweerRules"
        :model="sweep"
        ref="form"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item
              :label="sweepTimerType ? '转正时间：':'离职时间：'"
              prop="inputTime"
            >
              <el-date-picker
                name="inputTime"
                :editable="false"
                v-model="sweep.inputTime"
                type="date"
                :picker-options="sweepTimerType ? '' : pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="submitSweep"
          type="primary"
          :loading="$store.getters.is_loading"
          @click="submit"
        >确定</el-button>
        <el-button
          name="cancelSweep"
          @click="sweepTimer =  false"
        >取消</el-button>
      </div>
    </el-dialog>
    <!-- END 转正离职弹窗 -->
    <!-- End Panel -->

    <!-- 弹窗扫码 -->
    <el-dialog
      title="关联微信"
      width="400px"
      v-loading="$store.getters.is_loading"
      :visible.sync="sweepVisible"
    >
      <ul class="ul-sweep">
        <li>1、请员工先关注本店微信公众号;</li>
        <li>2、请员工用微信扫一扫以下二维码即可绑定微信;</li>
        <li>3、扫码成功后请关闭该窗口;</li>
      </ul>
      <div class="staff-erweima">
        <img
          :src="sweepCodeUrl"
          alt
        >
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="closeWx"
          type="primary"
          @click="() => {this.sweepVisible = false; this.getData()}"
        >关闭</el-button>
      </span>
    </el-dialog>
    <!-- END 弹窗扫码 -->
  </div>
</template>

<script>
import dayjs from 'dayjs'
import pagination from '@/components/pagination'
import searchPanel from '@/components/searchPanel.vue'
import { CharacterType, YNStatus } from '@/enums/common.js'
import {
  SecurityUserState,
  SecurityUserBerthType,
  SecurityUserCashierType,
  SecurityUserVitaState
} from '@/enums/merchant.js'
import {
  MERCHANT_API_DROPDOWN_ROLELIST,
  MERCHANT_API_DROPDOWN_POSITIONLIST,
  MERCHANT_API_SECURITY_USER_EXPORT,
  MERCHANT_API_SECURITY_USER_GETS,
  MERCHANT_API_SECURITY_USER_AUDIT,
  MERCHANT_API_SECURITY_USER_UNAUDIT,
  MERCHANT_API_SECURITY_USER_ABANDON,
  MERCHANT_API_DROPDOWN_DEPARTLIST,
  MERCHANT_API_SECURITY_USER_BINDQRCODE,
  MERCHANT_API_SECURITY_USER_UNBIND,
  MERCHANT_API_SECURITY_USER_LEAVED,
  MERCHANT_API_SECURITY_USER_OFFICIAL
} from '@/apis/merchant'
export default {
  data() {
    return {
      characterType: CharacterType,
      securityUserState: SecurityUserState,
      ynStatus: YNStatus,
      status: '0',
      selectData: 'TrueName',
      sweepCodeUrl: '',
      sweepVisible: false,
      sweepTimer: false,
      securityUserBerthType: SecurityUserBerthType, // 微信权限
      securityUserCashierType: SecurityUserCashierType, // 收银台权限
      securityUserVitaState: SecurityUserVitaState, // 在职状态
      pickerOptions: {
        disabledDate(time) {
          let mouth = new Date(
            new Date().getFullYear() +
              '/' +
              parseInt(new Date().getMonth() + 1) +
              '/1'
          ).getTime()
          return time.getTime() >= Date.now() || time.getTime() < mouth
        }
      },
      queryForm: {
        TrueName: '',
        Mobile: '',
        UserState: '0',
        SignedTime: '',
        LoginId: '',
        PositionId: '',
        DepartmentId: '',
        BerthType: '',
        CashierType: '',
        VitaState: '',
        RoleId: '',
        OfficialTimes: '',
        LeavedTimes: '',
        PageIndex: 1,
        PageSize: 20,
        OrderBy: 0,
        IsAsced: YNStatus.No
      },
      parameters: {},
      tableData: [], // 模拟表格数据
      total: 0,
      staffId: 1,
      dialogCreateVisible: false, // 新建供应商弹窗
      dialogEditVisible: false, // 新建供应商弹窗
      dialogCheckVisible: false, // 查看供应商弹窗
      DepartmentDropList: [], // 部门列表下拉
      RoleList: [], // 角色下拉
      PositionList: [], // 岗位下拉
      sweep: {
        inputTime: ''
      },
      sweerRules: {
        inputTime: {
          type: 'date',
          required: true,
          message: '请输入转正时间',
          trigger: 'blur'
        }
      },
      sweepTimerType: 0,
      userId: '',
      ExportColumns: [
        {
          FieldEnName: 'TrueName',
          FieldCnName: '姓名'
        },
        {
          FieldEnName: 'AliasName',
          FieldCnName: '昵称'
        },
        {
          FieldEnName: 'JobCode',
          FieldCnName: '工号'
        },
        {
          FieldEnName: 'Mobile',
          FieldCnName: '手机号码'
        },
        {
          FieldEnName: 'LoginId',
          FieldCnName: '用户名'
        },
        {
          FieldEnName: 'Department',
          FieldCnName: '部门'
        },
        {
          FieldEnName: 'BerthTypeName',
          FieldCnName: '微信权限'
        },
        {
          FieldEnName: 'RoleName',
          FieldCnName: '角色'
        },
        {
          FieldEnName: 'CashierTypeName',
          FieldCnName: '收银权限'
        },
        {
          FieldEnName: 'SignedTime',
          FieldCnName: '入职日期'
        },
        {
          FieldEnName: 'OfficialTime',
          FieldCnName: '转正日期'
        },
        {
          FieldEnName: 'LeavedTime',
          FieldCnName: '离职日期'
        },
        {
          FieldEnName: 'OpenIdName',
          FieldCnName: '微信绑定'
        },
        {
          FieldEnName: 'VitaStateName',
          FieldCnName: '在职状态'
        },
        {
          FieldEnName: 'UserStateName',
          FieldCnName: '账户状态'
        }
      ]
    }
  },
  methods: {
    init() {
      let query = this.$route.query || {}
      this.queryForm = Object.assign(
        this.queryForm,
        {
          TrueName: '',
          Mobile: '',
          UserState: '0',
          SignedTime: '',
          LoginId: '',
          PositionId: '',
          DepartmentId: '',
          BerthType: '',
          CashierType: '',
          VitaState: '',
          RoleId: '',
          OfficialTimes: '',
          LeavedTimes: '',
          PageIndex: 1,
          PageSize: 20,
          OrderBy: 0,
          IsAsced: YNStatus.No
        },
        query
      )
      this.getData()
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
    selectState(value) {
      this.queryForm.UserState = value
      this.onSearch()
    },
    deriVation() {
      let createTime = this.queryForm.SignedTime || ['1900-01-01', '']
      let leavedTime = this.queryForm.LeavedTimes || ['1900-01-01', '']
      let officialTime = this.queryForm.OfficialTimes || ['1900-01-01', '']
      let params = {
        LoginId: this.queryForm.LoginId,
        PositionId: this.queryForm.PositionId || 0,
        VitaState: this.queryForm.VitaState || 0,
        IsLeaved: this.queryForm.IsLeaved || 0,
        UserState: parseInt(this.queryForm.UserState),
        BerthType: this.queryForm.BerthType || 0,
        CashierType: this.queryForm.CashierType || 0,
        DepartmentId: this.queryForm.DepartmentId || 0,
        AliasName: this.queryForm.AliasName,
        TrueName: this.queryForm.TrueName,
        RoleId: this.queryForm.RoleId || 0,
        Mobile: this.queryForm.Mobile,
        SignedTime1: createTime[0] || '1900-01-01 0:00:00',
        SignedTime2: createTime[1] || '',
        LeavedTime1: leavedTime[0] || '1900-01-01 0:00:00',
        LeavedTime2: leavedTime[1] || '',
        OfficialTime1: officialTime[0] || '1900-01-01 0:00:00',
        OfficialTime2: officialTime[1] || '',
        OrderBy: this.queryForm.OrderBy - 0,
        PageIndex: this.queryForm.PageIndex - 0,
        PageSize: this.queryForm.PageSize - 0,
        IsAsced: this.queryForm.IsAsced - 0
      }
      for (let key in params) {
        if (!params[key] && params[key] !== 0) {
          delete params[key]
        }
      }
      params.ExportColumns = this.ExportColumns
      MERCHANT_API_SECURITY_USER_EXPORT(params).then(res => {
        if (res.data.Code === 'CORRECT') {
          window.open(this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data)
        } else {
          this.$message({
            type: 'info',
            message: res.data.Message
          })
        }
      })
    },
    onSearch() {
      this.queryForm.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      this.queryForm = {
        TrueName: '',
        Mobile: '',
        SignedTime: '',
        LoginId: '',
        UserState: '',
        PositionId: '',
        DepartmentId: '',
        BerthType: '',
        CashierType: '',
        VitaState: '',
        RoleId: '',
        OfficialTimes: '',
        LeavedTimes: '',
        PageIndex: 1,
        PageSize: 20,
        OrderBy: 0,
        IsAsced: YNStatus.No
      }
      this.onSearch()
    },
    sortChange(sort) {
      // 0==创建时间,1=入职时间SignedTime,2=转正时间OfficialTime, 3=离职时间LeavedTime
      switch (sort.prop) {
        case 'SignedTime':
          this.queryForm.OrderBy = 1
          break
        case 'OfficialTime':
          this.queryForm.OrderBy = 2
          break
        case 'LeavedTime':
          this.queryForm.OrderBy = 3
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    getData() {
      this.$store.commit('SET_BTN_LOADING', true)
      let createTime = this.queryForm.SignedTime || ['1900-01-01', '']
      let leavedTime = this.queryForm.LeavedTimes || ['1900-01-01', '']
      let officialTime = this.queryForm.OfficialTimes || ['1900-01-01', '']
      MERCHANT_API_SECURITY_USER_GETS({
        LoginId: this.queryForm.LoginId,
        PositionId: this.queryForm.PositionId,
        VitaState: this.queryForm.VitaState,
        IsLeaved: this.queryForm.IsLeaved,
        UserState: this.queryForm.UserState,
        BerthType: this.queryForm.BerthType,
        CashierType: this.queryForm.CashierType,
        DepartmentId: this.queryForm.DepartmentId,
        AliasName: this.queryForm.AliasName,
        TrueName: this.queryForm.TrueName,
        RoleId: this.queryForm.RoleId,
        Mobile: this.queryForm.Mobile,
        SignedTime1: createTime[0] || '1900-01-01 0:00:00',
        SignedTime2: createTime[1] || '',
        LeavedTime1: leavedTime[0] || '1900-01-01 0:00:00',
        LeavedTime2: leavedTime[1] || '',
        OfficialTime1: officialTime[0] || '1900-01-01 0:00:00',
        OfficialTime2: officialTime[1] || '',
        OrderBy: this.queryForm.OrderBy,
        PageIndex: this.queryForm.PageIndex,
        PageSize: this.queryForm.PageSize,
        IsAsced: this.queryForm.IsAsced
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        } else {
          this.$message({
            type: 'info',
            message: res.data.Message
          })
        }
      })
    },
    // 审核操作
    staffAudit(e, row) {
      e.currentTarget.blur()
      if (
        (row.Department ||
          this.$store.getters.user_session.CharacterType !=
            CharacterType.Store) &&
        row.LoginId &&
        row.TrueName
      ) {
        this.$confirm('是否提交审核?', '提交审核', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            MERCHANT_API_SECURITY_USER_AUDIT({
              UserId: row.UserId
            }).then(res => {
              if (res.data.Code === 'CORRECT') {
                this.getData()
                this.$message({
                  type: 'success',
                  message: '提交成功'
                })
              } else {
                this.$message.error(res.data.Message)
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消提交'
            })
          })
      } else {
        this.$message.error('请先完善员工信息再来审核')
      }
    },
    // 取消审核
    staffCancelAudit(e, obj, message) {
      e.currentTarget.blur()
      this.$confirm('是否' + message, message, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MERCHANT_API_SECURITY_USER_UNAUDIT({
            UserId: obj.UserId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.getData()
              this.$message({
                type: 'success',
                message: message + '成功'
              })
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提交'
          })
        })
    },
    // 作废操作
    staffNullify(e, obj) {
      e.currentTarget.blur()
      this.$confirm('是否作废?', '作废', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MERCHANT_API_SECURITY_USER_ABANDON({
            UserId: obj.UserId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.getData()
              this.$message({
                type: 'success',
                message: '作废成功'
              })
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消作废'
          })
        })
    },
    // 绑定微信
    bindStaffWx(r) {
      this.$store.commit('SET_BTN_LOADING', true)
      let params = {
        UserId: r.UserId
      }
      if (this.isOneNumberOneStore) {
        params['CharacterId'] = this.$store.getters.user_session.CharacterId
      } else if (this.isOneNumberManyShop) {
        params['CharacterId'] = this.$store.getters.user_session.CompchterId
      }
      MERCHANT_API_SECURITY_USER_BINDQRCODE(params)
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.sweepCodeUrl = 'data:image/png;base64,'
            this.sweepCodeUrl += res.data.Data
            this.sweepVisible = true
            this.getData()
          } else {
            this.$message.error(res.data.Message)
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
        .catch(() => {
          this.$message.error('网络连接失败')
        })
    },
    unBindStaffWx(e, r) {
      e.currentTarget.blur()
      this.$confirm('解绑后，将无法接收打赏，确定要解绑？', '解绑微信', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MERCHANT_API_SECURITY_USER_UNBIND({
            UserId: r.UserId
          })
            .then(res => {
              if (res.data.Code === 'CORRECT') {
                this.$message({
                  type: 'success',
                  message: '解绑成功!'
                })
                this.getData()
              } else {
                this.$message.error(res.data.Message)
              }
              this.$store.commit('SET_BTN_LOADING', false)
            })
            .catch(() => {
              this.$message.error('网络连接失败')
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消解绑'
          })
        })
    },
    getDepartmentDropList() {
      MERCHANT_API_DROPDOWN_DEPARTLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.DepartmentDropList = res.data.Data.Rows
          this.DepartmentDropList.unshift({
            Id: '0',
            Value: '全部'
          })
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getRoleList() {
      MERCHANT_API_DROPDOWN_ROLELIST({}).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.RoleList = res.data.Data.Rows
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getPositionList() {
      MERCHANT_API_DROPDOWN_POSITIONLIST({}).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.PositionList = res.data.Data.Rows
          this.PositionList.unshift({
            KeyId: '0',
            Value: '全部'
          })
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    toStaff(id) {
      this.sweepTimer = true
      this.sweepTimerType = 1
      this.userId = id
      this.sweerRules.inputTime.message = '请输入转正时间'
    },
    toLeave(id) {
      this.sweepTimer = true
      this.sweepTimerType = 0
      this.userId = id
      this.sweerRules.inputTime.message = '请输入离职时间'
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          this.sweepTimer = false
          let pathApi = MERCHANT_API_SECURITY_USER_LEAVED
          let param = {
            UserId: this.userId
          }
          let inputTime = new Date(this.sweep.inputTime - 0 + 8 * 3600000)
          if (this.sweepTimerType) {
            pathApi = MERCHANT_API_SECURITY_USER_OFFICIAL
            param.OfficialTime = dayjs(inputTime).format('YYYY-MM-DD HH:mm:ss')
          } else {
            param.LeavedTime = dayjs(inputTime).format('YYYY-MM-DD HH:mm:ss')
          }
          pathApi(param).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.getData()
              this.$message.success(res.data.Message)
            } else {
              this.$message.error(res.data.Message)
            }
          })
        } else {
          this.$message.error(this.sweerRules.inputTime.message)
        }
      })
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: this.parameters
      })
    }
  },
  mounted() {
    this.getRoleList()
    this.getPositionList()
    this.getDepartmentDropList()
    this.init()
    if (
      this.$store.getters.user_session.CharacterType != this.characterType.Store
    ) {
      this.ExportColumns = this.ExportColumns.filter(
        item =>
          item.FieldEnName != 'AliasName' &&
          item.FieldEnName != 'Department' &&
          item.FieldEnName != 'BerthTypeName' &&
          item.FieldEnName != 'CashierTypeName' &&
          item.FieldEnName != 'OpenIdName'
      )
    }
  },
  watch: {
    $route: 'init'
    // sweepVisible(value) {
    //   if (!value) {
    //     this.getData()
    //   }
    // }
  },
  components: {
    pagination,
    searchPanel
  }
}
</script>
<style lang="scss">
.staff-erweima {
  img {
    margin: 0 auto;
    width: 100%;
  }
}
.ul-sweep {
  li {
    text-align: left;
  }
}
</style>

