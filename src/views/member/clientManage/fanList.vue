<template>
  <div class="content">
    <el-form :model="formData" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item v-if="$store.getters.user_session.CharacterType == characterType.Store">
            <el-dropdown name="dropdownBatchOperation" @command="batchOperation">
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
          <el-form-item prop="isSubscribe">
            <el-select name="selectIsSubscribe" v-model="formData.isSubscribe" @change="onSearch">
              <el-option label="所有状态" value></el-option>
              <el-option v-for="(item,index) in subscribeTypes.Types" :key="index" :label="item.title" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="visitBookId">
            <el-input name="inputVipCardNo" v-model="formData.vipCardNo" placeholder="卡号" @keyup.enter.native="onSearch">
              <el-button name="btnOnSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="来源：" prop="subscrFrom">
            <el-select name="selectSubscrFrom" v-model="formData.subscrFrom" placeholder="请选择活动区域">
              <el-option label="所有来源" value></el-option>
              <el-option label="扫码关注" value="1"></el-option>
              <el-option label="分享关注" value="2"></el-option>
              <el-option label="支付关注" value="3"></el-option>
              <el-option label="活动关注" value="4"></el-option>
              <el-option label="其它" value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="身份：" prop="memberType">
            <el-select name="selectMemberType" v-model="formData.memberType" placeholder="请选择">
              <el-option label="所有身份" value></el-option>
              <el-option label="非会员" value="1"></el-option>
              <el-option label="会员" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="等级：" prop="levelId">
            <el-select name="selectLevelId" v-model="formData.levelId" placeholder="请选择">
              <el-option label="所有等级" value></el-option>
              <el-option v-for="item in level" :key="item.settingOptionId" :label="item.displayName" :value="item.settingOptionId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分组：" prop="groupId">
            <el-select name="selectGroupId" v-model="formData.groupId" placeholder="请选择">
              <el-option label="所有分组" value></el-option>
              <el-option v-for="item in grade" :key="item.settingOptionId" :label="item.displayName" :value="item.settingOptionId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有类型" prop="appType">
            <el-select name="appType" size="mini" v-model="formData.appType">
              <el-option label="所有类型" value></el-option>
              <el-option label="公众号粉丝" :value="memberTypes.WeChat"></el-option>
              <el-option label="小程序粉丝" :value="memberTypes.Applet"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户ID：" prop="memberId">
            <el-input name="inputMemberId" v-model="formData.memberId" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="trueName">
            <el-input name="inputTrueName" v-model="formData.trueName" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="手机：" prop="mobile">
            <el-input name="inputMobile" v-model="formData.mobile" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="会员卡号：" prop="vipCardNo">
            <el-input name="inputVipCardNos" v-model="formData.vipCardNo" @keyup.enter.native="onSearch"></el-input>
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
              :picker-options="$root.datePickerOptions"
              @change="subscrTimeChange"
            ></el-date-picker>
          </el-form-item>
          <el-form-item name="datePickerUnsubscrTime" label="取消关注时间：" prop="unsubscrTime">
            <el-date-picker
              v-model="formData.unsubscrTime"
              type="daterange"
              align="center"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              @change="unsubscrTimeChange"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="粉丝归属：" prop="storeName" v-if="$store.getters.wechatSettingType != companyBasicMountType.Store">
            <el-select name="selectStoreName" size="mini" v-model="formData.storeName" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option label="公司" value="0"></el-option>
              <el-option v-for="item in fanAttribution" :key="item.CharacterId" :label="item.Value" :value="item.Value"/>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" @selection-change="handleSelectionChange" @sort-change="sortChange" v-loading="$store.getters.tb_loading">
      <el-table-column type="selection" fixed width="30"></el-table-column>
      <el-table-column label="基本信息" fixed min-width="400" style="position: relative" show-overflow-tooltip>
        <template slot-scope="scope">
          <user-Info :scope="scope.row"></user-Info>
        </template>
      </el-table-column>
      <el-table-column prop="area" label="地区" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="subscrFromText" label="粉丝来源" show-overflow-tooltip></el-table-column>
      <el-table-column prop="storeName" label="粉丝归属" v-if="$store.getters.wechatSettingType != companyBasicMountType.One" show-overflow-tooltip></el-table-column>
      <el-table-column prop="subscrTime" sortable="custom" min-width="100" label="关注时间" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.subscrTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column prop="unsubscrTime" sortable="custom" min-width="120" label="取消关注时间" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.unsubscrTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column prop="isSubscribeText" fixed="right" label="状态"></el-table-column>
      <el-table-column label="操作" fixed="right" min-width="265">
        <template slot-scope="scope">
          <el-button name="btnOnClickUser" type="text" @click="onClickUser(scope.row)">查看</el-button>
          <template v-if="isOperable">
            <el-button name="btnEdit" type="text" @click="handleCommand(scope.row, 1)">编辑</el-button>
            <el-button name="btnEnter" type="text" @click="handleCommand(scope.row, 4)">进店记录</el-button>
            <el-button name="btnVisit" type="text" v-if="$store.getters.wechatSettingType != companyBasicMountType.Company" @click="handleCommand(scope.row, 5)">回访记录</el-button>
            <el-button name="btnAddRemark" type="text" @click="handleCommand(scope.row, 6)">添加备注</el-button>
          </template>
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
  MEMBERSHIP_API_MEMBER_GETFANSLIST,
  MEMBERSHIP_API_SETTINGOPTION_GETMEMBERGROUPS,
  MEMBERSHIP_API_SETTINGOPTION_GETMEMBERLEVELS,
  MEMBERSHIP_API_SETTINGMEMBERTAG_GETSETTINGMEMBERTAGS
} from '@/apis/membership.js'
import {
  MERCHANT_API_DROPDOWN_STORELIST
} from '@/apis/merchant.js'
import {
  SubscribeTypes,
  MemberTypes,
  AppTypes
} from '@/enums/membership'
import {
  CompanyBasicMountType
} from '@/enums/merchant'
import {
  CharacterType,
  YNStatus
} from '@/enums/common'
import {
  mixin
} from './common'

export default {
  mixins: [mixin],
  data() {
    return {
      subscribeTypes: SubscribeTypes,
      characterType: CharacterType,
      memberTypes: MemberTypes,
      appType: AppTypes,
      companyBasicMountType: CompanyBasicMountType,
      apiKey: 'MEMBER_GETFANSLIST', // 导出api
      page: {
        total: 0
      },
      formData: {
        memberId: '', // 会员id
        trueName: '', // 姓名
        mobile: '', // 手机号码
        vipCardNo: '', // 卡号
        subscrTime: [], // 关注时间
        unsubscrTime: [], // 取消关注时间
        levelId: '', // 等级
        groupId: '', // 分组
        memberType: '', // 会员身份
        subscrFrom: '', // 来源
        appType: '',
        pageSize: 10,
        pageIndex: 1,
        orderField: 'subscrTime',
        orderType: YNStatus.No,
        isSubscribe: '',
        storeName: ''
      }, // 高级搜索
      parameter: {
      }, // 用于传给后台接口做数据帅选
      tableData: [], // 表格数据
      level: [], // 等级下拉数据
      grade: [], // 分组下来数据
      selectsTableData: [], // 表格的选中项
      batchAbled: true, // 批量操作禁止操作
      recordModal: false, // 进店记录弹窗
      editClientModal: false, // 编辑客户资料弹窗
      returnRecordModal: false, // 添加回访记录弹窗
      addRemarkModal: false, // 添加备注弹窗
      gradeVisible: false, // 设置会员等级弹窗
      batchVisible: false, // 批量设置弹窗
      exportVisible: false, // 导出弹窗
      currUserInfo: {
        vipCardNo: '',
        trueName: '',
        mobile: '',
        aliasName: '',
        sexyType: '',
        pcd: '',
        birthday: '',
        dateOfBirthArray: '',
        lunarCalendar: false,
        joinTime: '',
        settingOptionLevelId: '',
        settingOptionGroupId: '',
        remark: '',
        memberTagIds: [],
        areaArr: [],
        provinceName: '',
        cityName: '',
        townName: '',
        settingMemberTags: []
      }, // 操作当前用户的信息
      multipleOptions: [], // 标签下拉列表
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
      selectTable: []
    }
  },
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
  methods: {
    // 表格排序
    sortChange(val) {
      this.formData.orderField = val.prop || ''
      this.formData.orderType = val.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    // 点击用户信息
    onClickUser(user) {
      const {
        memberId: id, upgradeMemberId
      } = user

      this.$router.push({
        path: '/member/clientManage/viewcustomer',
        query: {
          memberId: upgradeMemberId || id
        }
      })
    },
    getMemberTagObj(val, opt) {
      return val.map(value => {
        for (var itm of opt) {
          if (itm.settingMemberTagId == value) {
            return itm
          }
        }
        return null
      })
    },
    subscrTimeChange(val) {
      if (val) {
        this.formData.subscrTimeStart = dayjs(val[0]).format('YYYY-MM-DD')
        this.formData.subscrTimeEnd = dayjs(val[1]).format('YYYY-MM-DD')
      } else {
        this.formData.subscrTimeStart = ''
        this.formData.subscrTimeEnd = ''
      }
    },
    unsubscrTimeChange(val) {
      if (val) {
        this.formData.unsubscrTimeStart = dayjs(val[0]).format('YYYY-MM-DD')
        this.formData.unsubscrTimeEnd = dayjs(val[1]).format('YYYY-MM-DD')
      } else {
        this.formData.unsubscrTimeStart = ''
        this.formData.unsubscrTimeEnd = ''
      }
    },

    // modal关闭前重置form的值
    // resetForm(formName) {
    //   if(this.$refs[formName]) {
    //     this.$refs[formName].resetFields();
    //     if(formName == 'returnRecordForm') {
    //       this.speechForm = {
    //         settingOptionId: '_ALL',
    //         keyword: '',
    //       }
    //     }
    //   }
    // },
    init() {
      let query = this.$route.query
      this.parameter.status = query.status || ''
      this.parameter.pageSize = query.pageSize || 10
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.memberId = query.memberId || ''
      this.parameter.trueName = query.trueName || ''
      this.parameter.vipCardNo = query.vipCardNo || ''
      this.parameter.levelId = query.levelId || ''
      this.parameter.groupId = query.groupId || ''
      this.parameter.memberType = query.memberType || ''
      this.parameter.subscrFrom = query.subscrFrom || ''
      this.parameter.orderField = query.orderField || 'subscrTime'
      this.parameter.orderType = query.orderType || YNStatus.No
      this.parameter.appType = query.appType || ''
      this.parameter.subscrTimeStart = query.subscrTimeStart || ''
      this.parameter.subscrTimeEnd = query.subscrTimeEnd || ''
      this.parameter.unsubscrTimeStart = query.unsubscrTimeStart || ''
      this.parameter.unsubscrTimeEnd = query.unsubscrTimeEnd || ''
      this.parameter.mobile = query.mobile || ''
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: '/member/clientManage/fanlist',
        query: JSON.parse(JSON.stringify(this.parameter))
      })
      // this.onSearch()
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
    // 重置
    onReset() {
      this.formData.subscrTimeStart = ''
      this.formData.subscrTimeEnd = ''
      this.formData.unsubscrTimeStart = ''
      this.formData.unsubscrTimeEnd = ''
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    onSearch() {
      this.formData.pageIndex = 1
      this.parameter = JSON.parse(JSON.stringify(this.formData))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.formData)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    // 获取列表数据
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      this.formData = Object.assign(this.formData, this.parameter)
      MEMBERSHIP_API_MEMBER_GETFANSLIST(this.formData).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.rows
          this.page.total = res.data.Data.total
        }
      })
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
    // 编辑资料确认
    confirmEditData(val) {
      this.editClientModal = val
      this.getData()
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
    cancelEditClient() {
      this.editClientModal = false
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
      this.getData()
    },
    // 关闭设置弹窗
    closeClick(val) {
      this.settingData = {
      }
      this.gradeVisible = val
    },
    batchConfirmModal(val) {
      this.batchVisible = val
      this.getData()
    },
    closeBatchModal(val) {
      this.batchVisible = val
    },
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
    this.getClientGroupList()
    this.getClientLabelOptionList()
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
$d: #ddd;
$w: #fff;
.record_body {
  padding: 0;
}
.elDialog {
  /deep/ .el-dialog__body {
    padding: 0 !important;
  }
  /deep/ .el-dialog {
    min-width: 750px;
  }
}
.icon-set {
  font-size: 17px;
  position: absolute;
  top: 6px;
  margin-left: 7px;
  color: #399fe5;
  cursor: pointer;
}
</style>
