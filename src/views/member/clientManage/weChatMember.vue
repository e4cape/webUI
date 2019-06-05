<template>
  <div class="content" v-loading="tableLoading">
    <el-form :model="formData" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item v-if="$store.getters.user_session.CharacterType == characterType.Store">
            <el-dropdown name="dropBatchOperation" @command="batchOperation">
              <el-button name="btnBatchOperate" type="primary" size="mini">
                批量操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :disabled="batchAbled" command="1">批量设置分组</el-dropdown-item>
                <el-dropdown-item :disabled="batchAbled" command="2">批量设置等级</el-dropdown-item>
                <el-dropdown-item :disabled="batchAbled" command="3">批量设置标签</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item>
            <member-Export :records="selectTable" :apiParameter="parameter" :apiKey="apiKey"></member-Export>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="status">
            <el-select name="selectStatus" v-model="formData.status" @change="onSearch">
              <el-option label="所有状态" value=""></el-option>
              <el-option v-for="(item,index) in memberAccountStatus.Types" :key="index" :label="item.title" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="visitBookId">
            <el-input name="inputVipCardNo" v-model="formData.vipCardNo" placeholder="卡号" @keyup.enter.native="onSearch">
              <el-button name="btnOnSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="等级：" prop="levelId">
            <el-select name="selectLevelId" size="mini" v-model="formData.levelId" placeholder="请选择">
              <el-option label="所有等级" value></el-option>
              <el-option v-for="item in level" :key="item.settingOptionId" :label="item.displayName" :value="item.settingOptionId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分组：" prop="groupId">
            <el-select name="selectGroupId" size="mini" v-model="formData.groupId" placeholder="请选择">
              <el-option label="所有分组" value></el-option>
              <el-option v-for="item in grade" :key="item.settingOptionId" :label="item.displayName" :value="item.settingOptionId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有类型" prop="memberType">
            <el-select name="memberType" size="mini" v-model="formData.memberType">
              <el-option label="所有类型" value></el-option>
              <template v-for="item in memberTypes.Types">
                <el-option v-if="item.key == memberTypes.AppletVip || item.key == memberTypes.WeChatVip" :key="item.key" :label="item.title" :value="item.key"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="客户ID：" prop="memberId">
            <el-input name="inputMemberId" size="mini" v-model="formData.memberId" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="trueName">
            <el-input name="inputTrueName" size="mini" v-model="formData.trueName" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="手机：" prop="mobile">
            <el-input name="inputMobile" size="mini" v-model="formData.mobile" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="会员卡号：" prop="vipCardNo">
            <el-input name="inputVipCardNos" size="mini" v-model="formData.vipCardNo" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="sexyType">
            <el-select name="selectSexyType" size="mini" v-model="formData.sexyType" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option label="男" value="1"></el-option>
              <el-option label="女" value="3"></el-option>
              <el-option label="无" value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item name="datePickerBirthday" label="出生日期：" prop="birthday">
            <el-date-picker
              v-model="formData.birthday"
              type="daterange"
              align="center"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              :picker-options="$root.datePickerOptions"
              @change="birthdayChange"
            ></el-date-picker>
          </el-form-item>
          <el-form-item name="datePickerDateOfBirth" label="生日：" prop="dateOfBirth">
            <el-date-picker
              v-model="formData.dateOfBirth"
              type="daterange"
              align="center"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              @change="dateOfBirthChange"
              format="MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="生日类型：" prop="lunarCalendar">
            <el-select name="selectLunarCalendar" size="mini" v-model="formData.lunarCalendar" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option label="公历" value="0"></el-option>
              <el-option label="农历" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item name="formItemArea" label="地区" prop="areaArr">
            <el-cascader :options="area" change-on-select v-model="formData.areaArr" size="mini" @change="areaChange"></el-cascader>
          </el-form-item>
          <el-form-item name="datePickerSubscrTime" label="关注时间：" prop="subscrTime">
            <el-date-picker
              v-model="formData.subscrTime"
              type="daterange"
              align="center"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              :picker-options="$root.datePickerOptions"
              @change="subscrTimeChange"
            ></el-date-picker>
          </el-form-item>
          <el-form-item name="datePickerJoinTime" label="入会时间：" prop="joinTime">
            <el-date-picker
              v-model="formData.joinTime"
              type="daterange"
              align="center"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              :picker-options="$root.datePickerOptions"
              @change="joinTimeChange"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="标签：" prop="memberTagId">
            <el-select name="selectMemberTagId" size="mini" v-model="formData.memberTagId" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option v-for="item in multipleOptions" :key="item.settingMemberTagId" :label="item.name" :value="item.settingMemberTagId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="粉丝归属：" prop="storeName" v-if="$store.getters.user_session.CharacterType != characterType.Store">
            <el-select name="selectStoreName" size="mini" v-model="formData.storeName" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option label="公司" value="0"></el-option>
              <el-option v-for="item in fanAttribution" :key="item.CharacterId" :label="item.Value" :value="item.Value"/>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" size="mini" @selection-change="handleSelectionChange" @sort-change="sortChange">
      <el-table-column type="selection" fixed width="30"></el-table-column>
      <el-table-column label="基本信息" fixed min-width="320" style="position: relative">
        <template slot-scope="scope">
          <user-Info :scope="scope.row"></user-Info>
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="dateOfBirthText" label="生日" show-overflow-tooltip></el-table-column>
      <el-table-column prop="subscrTime" sortable="custom" min-width="100" label="关注时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="storeName" label="粉丝归属" v-if="$store.getters.user_session.CharacterType != characterType.Store" show-overflow-tooltip></el-table-column>
      <el-table-column prop="joinTime" sortable="custom" min-width="100" label="入会时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="area" label="地区" show-overflow-tooltip></el-table-column>
      <el-table-column prop="statusText" fixed="right" label="状态"></el-table-column>
      <el-table-column label="操作" fixed="right" min-width="280">
        <template slot-scope="scope">
          <el-button name="btnCheck" type="text" @click="onClickUser(scope.row.memberId)">查看</el-button>

          <template v-if="isOperable">
            <el-button name="btnEdit" type="text" @click="handleCommand(scope.row, 1)">编辑</el-button>
            <el-button name="btnUse" type="text" @click="handleCommand(scope.row, 2)" v-if="scope.row.status == enableState.Enable">停用</el-button>
            <el-button name="btnEnable" type="text" @click="handleCommand(scope.row, 3)" v-if="scope.row.status == enableState.Disable">启用</el-button>
            <el-button name="btnEnter" type="text" @click="handleCommand(scope.row, 4)">进店记录</el-button>
            <el-button name="btnVisit" type="text" @click="handleCommand(scope.row, 5)" v-if="$store.getters.wechatSettingType != companyBasicMountType.Company">回访记录</el-button>
            <el-button name="btnAddNote" type="text" @click="handleCommand(scope.row, 6)">添加备注</el-button>
          </template>
          <!-- <span class="lookOver el-button el-button--text" @click="onClickUser(scope.row.memberId)">查看</span>
          <el-dropdown @command="handleCommand(scope.row, $event)">
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">编辑</el-dropdown-item>
              <el-dropdown-item command="2" v-if="scope.row.status">停用</el-dropdown-item>
              <el-dropdown-item command="3" v-if="!scope.row.status">启用</el-dropdown-item>
              <el-dropdown-item command="4">进店记录</el-dropdown-item>
              <el-dropdown-item command="5">回访记录</el-dropdown-item>
              <el-dropdown-item command="6">添加备注</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="page.total" :pg="formData.pageIndex" :size="formData.pageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- 编辑个人资料 -->
    <edit-Profile
      :currUserInfo="currUserInfo"
      :editClientVisible="editClientModal"
      v-on:openLevel="openLevelModal"
      v-on:openGroup="openGroupsModal"
      v-on:openLabel="openLabelModal"
      :level="level"
      :grade="grade"
      :multipleOptions="multipleOptions"
      v-on:confirmClick="confirmEditData"
      v-on:closeClick="colseEditData"
    ></edit-Profile>
    <!-- 进店记录 -->
    <entry-Record :currUserInfo="currUserInfo" :recordVisible="recordModal" v-on:closeClick="closeRecordModal"></entry-Record>
    <!-- 添加备注 -->
    <add-Notes :currUserInfo="currUserInfo" :addRemarkVisible="addRemarkModal" v-on:closeClick="closeAddNotesModal"></add-Notes>
    <!-- 回访记录 -->
    <return-Record :currUserInfo="currUserInfo" :returnRecordVisible="returnRecordModal" v-on:closeClick="closeReturnVisitModal"></return-Record>
    <!-- 设置 -->
    <popup-Table
      :memberTagIds="currUserInfo.memberTagIds"
      :gradeVisible="gradeVisible"
      :title="settingTitle"
      :leftTitle="leftTitle"
      :rightTitle="rightTitle"
      :settingData="settingData"
      v-on:confirmClick="confirmClick"
      v-on:closeClick="closeClick"
      :type="modalType"
    />
    <!-- 批量设置 -->
    <batch-Operation
      v-if="batchVisible"
      :batchVisible="batchVisible"
      :title="batchTitle"
      :batchOption="batchOption"
      :selected="selectsTableData"
      v-on:closeClick="closeBatchModal"
      v-on:batchConfirm="batchConfirmModal"
      :type="batchType"
    ></batch-Operation>
  </div>
</template>

<script>
import {
  MEMBERSHIP_API_SETTINGOPTION_GETMEMBERLEVELS,
  MEMBERSHIP_API_SETTINGOPTION_GETMEMBERGROUPS,
  MEMBERSHIP_API_SETTINGAREA_GETAREAS,
  MEMBERSHIP_API_MEMBER_GETWXMEMBERLIST,
  MEMBERSHIP_API_MEMBER_GETMEMBERTAGS,
  MEMBERSHIP_API_SETTINGMEMBERTAG_GETSETTINGMEMBERTAGS,
  MEMBERSHIP_API_MEMBER_DISABLEMEMBER,
  MEMBERSHIP_API_MEMBER_ENABLEMEMBER
} from '@/apis/membership.js'
import {
  MERCHANT_API_DROPDOWN_STORELIST
} from '@/apis/merchant.js'
import {
  EnableState
} from '@/enums/common.js'
import {
  MemberAccountStatus,
  MemberTypes
} from '@/enums/membership'
import { CompanyBasicMountType } from '@/enums/merchant'
import { CharacterType } from '@/enums/common'
import searchPanel from '@/components/searchPanel.vue'
import userInfo from '@/components/scrm/userInfo.vue'
import popupTable from '@/components/scrm/popupTable.vue'
import batchOperation from '@/components/scrm/batchOperation.vue'
import pagination from '@/components/pagination.vue'
import entryRecord from '@/components/scrm/entryRecord.vue'
import addNotes from '@/components/scrm/addNotes.vue'
import returnRecord from '@/components/scrm/returnVisitRecord.vue'
import editProfile from '@/components/scrm/editProfile.vue'
import memberExport from '@/components/scrm/memberExport'
import dayjs from 'dayjs'
import {
  mixin
} from './common'

export default {
  mixins: [mixin],
  components: {
    searchPanel,
    userInfo,
    popupTable,
    pagination,
    batchOperation,
    entryRecord,
    addNotes,
    returnRecord,
    editProfile,
    memberExport
  },
  data() {
    return {
      characterType: CharacterType,
      memberAccountStatus: MemberAccountStatus,
      companyBasicMountType: CompanyBasicMountType,
      memberTypes: MemberTypes,
      enableState: EnableState,
      apiKey: 'MEMBER_GETWXMEMBERLIST',
      tableData: [], // 表格数据
      page: {
        total: 0
      },
      formData: {
        levelId: '',
        groupId: '',
        memberId: '',
        trueName: '',
        mobile: '',
        vipCardNo: '',
        sexyType: '',
        birthday: [],
        birthdayStart: '',
        birthdayEnd: '',
        dateOfBirth: [],
        dateOfBirthStartArray: [],
        dateOfBirthEndArray: [],
        lunarCalendar: '',
        areaArr: [''],
        provinceId: '',
        cityId: '',
        townId: '',
        subscrTime: [],
        subscrTimeStart: '',
        subscrTimeEnd: '',
        joinTime: [],
        joinTimeStart: '',
        joinTimeEnd: '',
        memberTagId: '',
        memberType: '',
        storeName: '',
        status: '',
        orderField: 'joinTime',
        orderType: 1
      },
      currUserInfo: {
      },
      grade: [], // 分组
      level: [], // 等级
      area: [], // 地区
      multipleOptions: [], // 标签下拉
      batchAbled: true, // 批量操作禁止操作
      recordModal: false, // 进店记录弹窗
      editClientModal: false, // 编辑客户资料弹窗
      returnRecordModal: false, // 添加回访记录弹窗
      addRemarkModal: false, // 添加备注弹窗
      gradeVisible: false, // 设置会员等级弹窗
      batchVisible: false, // 批量设置弹窗
      parameter: {
      }, // 用于传给后台接口做数据帅选
      settingTitle: '', // 设置弹窗标题
      settingData: {
      }, // 弹窗数据
      modalType: 0, // 弹窗类型
      leftTitle: '', // 表格左边标题
      rightTitle: '', // 表格右边标题
      tableLoading: false, // 列表loading
      batchTitle: '', // 批量设置标题
      batchOption: [], // 批量设置下拉
      batchType: null, // 批量设置类型
      fanAttribution: [], // 粉丝归属下拉
      selectsTableData: [], // 表格的选中项
      selectTable: []
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.parameter.status = query.status || ''
      this.parameter.pageSize = query.pageSize || 10
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.memberId = query.memberId || ''
      this.parameter.memberType = query.memberType || ''
      this.parameter.trueName = query.trueName || ''
      this.parameter.vipCardNo = query.vipCardNo || ''
      this.parameter.levelId = query.levelId || ''
      this.parameter.groupId = query.groupId || ''
      this.parameter.memberType = query.memberType || ''
      // this.parameter.subscrTimeStart = query.subscrTimeStart || ''
      // this.parameter.subscrTimeEnd = query.subscrTimeEnd || ''
      // this.parameter.unsubscrTimeStart = query.unsubscrTimeStart || ''
      this.parameter.mobile = query.mobile || ''
      this.parameter.sexyType = query.sexyType || ''
      this.parameter.memberTagId = query.memberTagId || ''
      this.parameter.lunarCalendar = query.lunarCalendar || ''
      this.parameter.characterId = query.characterId
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: '/member/clientManage/wechatmember',
        query: JSON.parse(JSON.stringify(this.parameter))
      })
    },
    // 批量操作
    batchOperation(command) {
      this.batchVisible = true
      this.batchType = command
      if (command == 1) {
        this.batchTitle = '批量设置分组'
        const [...arr] = this.grade
        this.batchOption = arr
      }
      if (command == 2) {
        this.batchTitle = '批量设置等级'
        const [...arr] = this.level
        this.batchOption = arr
      }
      if (command == 3) {
        this.batchTitle = '批量设置标签'
        const [...arr] = this.multipleOptions
        this.batchOption = arr
      }
    },
    // 表格排序
    sortChange(val) {
      this.formData.orderField = val.prop
      this.formData.orderType = val.order == 'ascending' ? 0 : 1
      this.onSearch()
    },
    // 切换当前页
    currentChange(val) {
      this.parameter.pageIndex = val
      this.selectTable = []
      this.initRoute()
    },
    // 切换每页显示条数
    sizeChange(val) {
      this.parameter.pageIndex = 1
      this.parameter.pageSize = val
      this.selectTable = []
      this.initRoute()
    },
    // 点击查看用户信息
    onClickUser(id) {
      this.$router.push({
        path: '/member/clientManage/viewcustomer',
        query: {
          memberId: id
        }
      })
    },
    // 重置
    onReset() {
      this.formData.birthdayStart = ''
      this.formData.birthdayStart = ''
      this.formData.subscrTimeStart = ''
      this.formData.subscrTimeEnd = ''
      this.formData.joinTimeStart = ''
      this.formData.joinTimeEnd = ''
      this.formData.dateOfBirthStartArray = []
      this.formData.dateOfBirthEndArray = []
      this.formData.provinceId = ''
      this.formData.cityId = ''
      this.formData.townId = ''
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    onSearch() {
      this.formData.pageIndex = 1
      this.parameter = Object.assign({
      }, this.formData)
      if (JSON.stringify(this.$route.query) === JSON.stringify(this.formData)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    // 打开会员等级设置弹窗
    openLevelModal() {
      const [...arr] = this.level
      const obj = {
        data: arr
      }
      this.settingData = obj
      this.settingTitle = '会员等级'
      this.leftTitle = '会员等级'
      this.rightTitle = '等级名称'
      this.modalType = 1
      this.gradeVisible = true
    },
    openGroupsModal() {
      const [...arr] = this.grade
      const obj = {
        data: arr
      }
      this.settingData = obj
      this.settingTitle = '会员分组'
      this.leftTitle = '分组编号'
      this.rightTitle = '分组名称'
      this.modalType = 2
      this.gradeVisible = true
    },
    openLabelModal() {
      const [...arr] = this.multipleOptions
      const obj = {
        data: arr
      }
      this.settingData = obj
      this.settingTitle = '标签设置'
      this.leftTitle = '项目'
      this.rightTitle = '操作'
      this.modalType = 3
      this.gradeVisible = true
    },
    // 获取地址下拉
    getAreaList() {
      MEMBERSHIP_API_SETTINGAREA_GETAREAS().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.area = res.data.Data
        }
      })
    },
    // 获取客户分组下拉列表
    getClientGroupList() {
      MEMBERSHIP_API_SETTINGOPTION_GETMEMBERGROUPS().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.grade = res.data.Data
        }
      })
    },
    // 获取会员等级下拉列表
    getMemberLevels() {
      MEMBERSHIP_API_SETTINGOPTION_GETMEMBERLEVELS().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.level = res.data.Data
        }
      })
    },
    // 获取客户标签下拉列表
    getClientLabelOptionList() {
      MEMBERSHIP_API_SETTINGMEMBERTAG_GETSETTINGMEMBERTAGS().then(res => {
        if (res.data.Code === 'CORRECT') {
          const arr = []
          res.data.Data.forEach(item => {
            const obj = {}; (obj.name = item.name), (obj.settingMemberTagId = item.settingMemberTagId)
            arr.push(obj)
          })
          this.multipleOptions = arr
        }
      })
    },
    // 表格操作
    handleCommand(userInfo, command) {
      const areaArr = []
      if (userInfo.provinceId) {
        areaArr.push(userInfo.provinceId, userInfo.cityId, userInfo.townId)
      }
      const info = {
        ...userInfo,
        lunarCalendar: userInfo.lunarCalendar ? true : false,
        areaArr,
        memberTagIds: []
      }
      this.currUserInfo = info
      // 打开编辑资料
      if (command == 1) {
        this.editClientModal = true
        MEMBERSHIP_API_MEMBER_GETMEMBERTAGS({
          memberId: userInfo.memberId
        }).then(res => {
          if (res.data.Code == 'CORRECT') {
            if (res.data.Data.memberTags.length != 0) {
              this.currUserInfo.memberTagIds = res.data.Data.memberTags.map(
                item => item.settingMemberTagId
              )
            }
          }
        })
      }
      // 停用
      if (command == 2) {
        MEMBERSHIP_API_MEMBER_DISABLEMEMBER({
          memberId: userInfo.memberId
        }).then(res => {
          if (res.data.Code == 'CORRECT') {
            this.$message({
              showClose: true,
              message: '停用成功',
              type: 'success'
            })
            this.init()
          }
        })
      }
      // 启用
      if (command == 3) {
        MEMBERSHIP_API_MEMBER_ENABLEMEMBER({
          memberId: userInfo.memberId
        }).then(res => {
          if (res.data.Code == 'CORRECT') {
            this.$message({
              showClose: true,
              message: '启用成功',
              type: 'success'
            })
            this.init()
          }
        })
      }
      // 打开进店记录
      if (command == 4) {
        this.recordModal = true
      }
      // 打开回访任务
      if (command == 5) {
        this.returnRecordModal = true
      }
      // 打开添加备注
      if (command == 6) {
        this.addRemarkModal = true
      }
    },
    // 生日日期
    birthdayChange(val) {
      if (val) {
        this.formData.birthdayStart = dayjs(val[0]).format('YYYY-MM-DD')
        this.formData.birthdayEnd = dayjs(val[1]).format('YYYY-MM-DD')
      } else {
        this.formData.birthdayStart = ''
        this.formData.birthdayEnd = ''
      }
    },
    // 关注时间
    subscrTimeChange(val) {
      if (val) {
        this.formData.subscrTimeStart = dayjs(val[0]).format('YYYY-MM-DD')
        this.formData.subscrTimeEnd = dayjs(val[1]).format('YYYY-MM-DD')
      } else {
        this.formData.subscrTimeStart = ''
        this.formData.subscrTimeEnd = ''
      }
    },
    // 入会时间
    joinTimeChange(val) {
      if (val) {
        this.formData.joinTimeStart = dayjs(val[0]).format('YYYY-MM-DD')
        this.formData.joinTimeEnd = dayjs(val[1]).format('YYYY-MM-DD')
      } else {
        this.formData.joinTimeStart = ''
        this.formData.joinTimeEnd = ''
      }
    },
    // 生日
    dateOfBirthChange(val) {
      if (val) {
        const startMonth = dayjs(val[0]).format('MM')
        const startDay = dayjs(val[0]).format('DD')
        const startArr = []
        const endArr = []
        const endMonth = dayjs(val[1]).format('MM')
        const endDay = dayjs(val[1]).format('DD')
        startArr.push(startMonth, startDay)
        endArr.push(endMonth, endDay)
        this.formData.dateOfBirthStartArray = startArr
        this.formData.dateOfBirthEndArray = endArr
      } else {
        this.formData.dateOfBirthStartArray = []
        this.formData.dateOfBirthEndArray = []
      }
    },
    // 地址发生改变
    areaChange(val) {
      if (val[0] != '') {
        this.formData.provinceId = val[0]
        this.formData.cityId = val[1]
        this.formData.townId = val[2]
      } else {
        this.formData.provinceId = ''
        this.formData.cityId = ''
        this.formData.townId = ''
      }
    },
    // getCascaderObj(val,opt) {
    //   return val.map((value) => {
    //     for (var itm of opt) {
    //       if (itm.value == value) {
    //         opt = itm.children;
    //         return itm;
    //       }
    //     }
    //     return null;
    //   });
    // },
    // 获取列表数据
    getData() {
      this.tableLoading = true
      this.formData = Object.assign(this.formData, this.parameter)
      MEMBERSHIP_API_MEMBER_GETWXMEMBERLIST(this.formData).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.tableLoading = false
          this.tableData = res.data.Data.rows
          this.page.total = res.data.Data.total
        }
      })
    },
    confirmClick(val) {
      this.settingData = {
      }
      this.gradeVisible = val
      if (this.modalType == 1) {
        this.getMemberLevels()
      }
      if (this.modalType == 2) {
        this.getClientGroupList()
      }
      if (this.modalType == 3) {
        this.getClientLabelOptionList()
      }
    },
    // 选择表格行
    handleSelectionChange(val) {
      this.selectsTableData = val
      if (val.length) {
        this.selectTable = val.map(item => item.memberId)
        this.batchAbled = false
      } else {
        this.selectTable = []
        this.batchAbled = true
      }
    },
    batchConfirmModal(val) {
      this.batchVisible = val
      this.getData()
    },
    // 编辑资料确认
    confirmEditData(val) {
      this.editClientModal = val
      this.getData()
    },
    // 关闭设置弹窗
    closeClick(val) {
      this.settingData = {
      }
      this.gradeVisible = val
    },
    closeBatchModal(val) {
      this.batchVisible = val
    },
    colseEditData(val) {
      this.editClientModal = val
    },
    // 关闭添加备注
    closeAddNotesModal(val) {
      this.addRemarkModal = val
    },
    // 关闭进店记录
    closeRecordModal(val) {
      this.recordModal = val
    },
    closeReturnVisitModal(val) {
      this.returnRecordModal = val
    },
    // 获取粉丝归属下拉列表
    getStorList() {
      MERCHANT_API_DROPDOWN_STORELIST({
        characterId: this.$store.getters.user_session.CharacterId
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.fanAttribution = res.data.Data.Rows
        }
      })
    }
  },
  mounted() {
    this.init()
    this.getMemberLevels()
    this.getClientLabelOptionList()
    this.getClientGroupList()
    this.getAreaList()
    this.getStorList()
  },
  watch: {
    multipleOptions(val) {
      const [...arr] = val
      const obj = {
        data: arr
      }
      this.settingData = obj
    },
    $route: 'init'
  }
}
</script>
<style lang="scss" scoped>
</style>

