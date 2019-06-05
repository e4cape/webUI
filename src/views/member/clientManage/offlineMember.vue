<template>
  <div
    class="content"
  >
    <el-form
      :model="formData"
      ref="search"
      lable-width="120px"
      :rules="rules"
      class="item-lh-26"
      :inline="true"
    >
      <search-panel
        @onSearch="onSearch"
        @onReset="onReset"
      >
        <template slot="btnBox">
          <el-form-item v-if="$store.getters.user_session.CharacterType == characterType.Store">
            <el-button
              name="btnNewMember"
              type="primary"
              @click="newMember"
            >
              新建线下会员
            </el-button>
          </el-form-item>
          <el-form-item v-if="$store.getters.user_session.CharacterType == characterType.Store">
            <el-button
              name="btnImportMember"
              type="primary"
              @click="importMember"
            >
              导入线下会员
            </el-button>
          </el-form-item>
          <el-form-item v-if="$store.getters.user_session.CharacterType == characterType.Store">
            <el-dropdown
              name="dropdowmBatchOperation"
              @command="batchOperation"
            >
              <el-button
                name="btnBatchOperate"
                type="primary"
              >
                批量操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :disabled="batchAbled"
                  command="1"
                >批量设置分组</el-dropdown-item>
                <el-dropdown-item
                  :disabled="batchAbled"
                  command="2"
                >批量设置等级</el-dropdown-item>
                <el-dropdown-item
                  :disabled="batchAbled"
                  command="3"
                >批量设置标签</el-dropdown-item>
                <el-dropdown-item
                  :disabled="batchAbled"
                  command="4"
                >批量删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item>
            <member-Export
              :records="selectTables"
              :apiParameter="parameter"
              :apiKey="apiKey"
            ></member-Export>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="upgradeStatus">
            <el-select
              name="selectUpgradeStatus"
              v-model="formData.upgradeStatus"
              @change="onSearch"
            >
              <el-option
                label="所有状态"
                value=""
              ></el-option>
              <el-option
                v-for="(item,index) in memberUpgradeStatus.Types"
                :key="index"
                :label="item.title"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="visitBookId">
            <el-input
              name="inputVipCardNo"
              v-model="formData.vipCardNo"
              placeholder="会员卡号"
              @keyup.enter.native="onSearch"
            >
              <el-button
                name="btnOnSearch"
                slot="append"
                icon="el-icon-search"
                @click="onSearch"
              ></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item
            label="等级："
            prop="levelId"
          >
            <el-select
              name="selectLevelId"
              size="mini"
              v-model="formData.levelId"
              placeholder="请选择"
            >
              <el-option
                label="所有等级"
                value=""
              ></el-option>
              <el-option
                v-for="item in level"
                :key="item.settingOptionId"
                :label="item.displayName"
                :value="item.settingOptionId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="分组："
            prop="groupId"
          >
            <el-select
              name="selectGroupId"
              size="mini"
              v-model="formData.groupId"
              placeholder="请选择"
            >
              <el-option
                label="所有分组"
                value=""
              ></el-option>
              <el-option
                v-for="item in grade"
                :key="item.settingOptionId"
                :label="item.displayName"
                :value="item.settingOptionId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="会员卡号："
            prop="vipCardNo"
          >
            <el-input
              name="inputVipCardNos"
              size="mini"
              v-model="formData.vipCardNo"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="姓名："
            prop="trueName"
          >
            <el-input
              name="inputTrueName"
              size="mini"
              v-model="formData.trueName"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="手机："
            prop="mobile"
          >
            <el-input
              name="inputMobile"
              size="mini"
              v-model="formData.mobile"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="历史积分：">
            <el-col :span="11">
              <el-form-item
                prop="historyScoreMin"
                class="inline no-margin"
              >
                <el-input
                  name="inputHistoryScoreMin"
                  v-model="formData.historyScoreMin"
                  :maxlength="9"
                  @keyup.enter.native="onSearch"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="2"
              class="tc"
            >-</el-col>
            <el-col :span="11">
              <el-form-item
                prop="historyScoreMax"
                class="inline no-margin"
              >
                <el-input
                  name="inputHistoryScoreMax"
                  v-model="formData.historyScoreMax"
                  :maxlength="9"
                  @keyup.enter.native="onSearch"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item
            label="性别："
            prop="sexyType"
          >
            <el-select
              name="selectSexyType"
              size="mini"
              v-model="formData.sexyType"
              placeholder="请选择"
            >
              <el-option
                label="全部"
                value=""
              ></el-option>
              <el-option
                v-for="item in sexyTypes.Types"
                :label="item.title"
                :value="item.key"
                :key="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            name="datePickerBirthday"
            label="出生日期："
            prop="birthday"
          >
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
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            name="dateDateOfBirth"
            label="生日："
            prop="dateOfBirth"
          >
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
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="生日类型："
            prop="lunarCalendar"
          >
            <el-select
              name="selectLunarCalendar"
              size="mini"
              v-model="formData.lunarCalendar"
              placeholder="请选择"
            >
              <el-option
                label="全部"
                value=""
              ></el-option>
              <el-option
                v-for="item in lunarCalendarTypes.Types"
                :label="item.title"
                :value="item.key"
                :key="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="地区："
            prop="areaArr"
          >
            <el-cascader
              :options="area"
              v-model="formData.areaArr"
              size="mini"
              @change="areaChange"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item
            name="datePickerJoinTime"
            label="入会时间："
            prop="joinTime"
          >
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
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            name="datePickerCreateTime"
            label="添加时间："
            prop="createTime"
          >
            <el-date-picker
              v-model="formData.createTime"
              type="daterange"
              align="center"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              :picker-options="$root.datePickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            label="标签："
            prop="memberTagId"
          >
            <el-select
              name="selectMemberTagId"
              size="mini"
              v-model="formData.memberTagId"
              placeholder="请选择"
            >
              <el-option
                label="全部"
                value=""
              ></el-option>
              <el-option
                v-for="item in multipleOptions"
                :key="item.settingMemberTagId"
                :label="item.name"
                :value="item.settingMemberTagId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="来源："
            prop="storeName"
            v-if="$store.getters.user_session.CharacterType != characterType.Store"
          >
            <el-select
              name="selectStoreName"
              size="mini"
              v-model="formData.storeName"
              placeholder="请选择"
            >
              <el-option
                label="全部"
                value=""
              ></el-option>
              <el-option
                v-for="item in fanAttribution"
                :key="item.CharacterId"
                :value="item.Value"
                :label="item.Value"
              />
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table
      :data="tableData"
      size="mini"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      v-loading="$store.getters.tb_loading"
    >
      <el-table-column
        type="selection"
        fixed
        width="30"
      >
      </el-table-column>
      <el-table-column
        label="基本信息"
        fixed
        min-width="350"
        style="position: relative"
      >
        <template slot-scope="scope">
          <user-Info :scope="scope.row"></user-Info>
        </template>
      </el-table-column>
      <el-table-column
        prop="age"
        label="年龄"
        width="70"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="dateOfBirthText"
        label="生日"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="joinTime"
        sortable="custom"
        min-width="100"
        label="入会时间"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="createTime"
        sortable="custom"
        min-width="100"
        label="添加时间"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="storeName"
        label="来源"
        v-if="$store.getters.user_session.CharacterType != characterType.Store"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="historyScore"
        min-width="80"
        label="历史积分"
      ></el-table-column>
      <el-table-column
        prop="scoreExpireTime"
        label="积分有效期"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="身份状态"
        min-width="100"
        fixed="right"
        :render-header="renderHeader"
      >
        <template slot-scope="scope">
          <p>{{ scope.row.upgradeStatusText }}</p>
          <p>{{ scope.row.upgradeTime }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        min-width="160"
      >
        <template slot-scope="scope">
          <el-button
            name="btnCheck"
            type="text"
            @click="onClickUser(scope.row, scope.row.upgradeStatus)"
          >查看</el-button>
          <template v-if="scope.row.upgradeStatus != memberUpgradeStatus.Upgrade && isOperable">
            <el-button
              name="btnEdit"
              type="text"
              @click="handleCommand(scope.row, 1)"
            >编辑</el-button>
            <el-button
              name="btnUpdate"
              type="text"
              @click="handleCommand(scope.row, 2)"
              v-if="scope.row.upgradeStatus == memberUpgradeStatus.CanUpgrade"
            >升级</el-button>
            <el-button
              name="btnDel"
              type="text"
              @click="handleCommand(scope.row, 3)"
            >删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="page.total"
      :pg="formData.pageIndex"
      :size="formData.pageSize"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    >
    </pagination>
    <!-- 编辑/新建会员资料 -->
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
      :type="operatingType"
      :isOffline="true"
    >
    </edit-Profile>
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
    >
    </batch-Operation>
    <import-Member
      v-if="importVisible"
      :visible.sync="importVisible"
      @success="importCloseModal"
    ></import-Member>
    <upgrade-Member
      :currUserInfo="currUserInfo"
      :visible="upgradeVisible"
      v-on:closeClick="upgradeMemberClose"
      v-on:upgradeClick="confirmUpgrade"
    ></upgrade-Member>
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
  </div>
</template>

<script>
import {
  MEMBERSHIP_API_SETTINGOPTION_GETMEMBERLEVELS,
  MEMBERSHIP_API_SETTINGOPTION_GETMEMBERGROUPS,
  MEMBERSHIP_API_SETTINGAREA_GETAREAS,
  MEMBERSHIP_API_MEMBER_GETMEMBERLIST,
  MEMBERSHIP_API_SETTINGMEMBERTAG_GETSETTINGMEMBERTAGS,
  MEMBERSHIP_API_MEMBER_DELETEOFFLINEMEMBER,
  MEMBERSHIP_API_MEMBER_BATCHDELETEOFFLINEMEMBER
} from '@/apis/membership.js'
import {
  MERCHANT_API_DROPDOWN_STORELIST 
} from '@/apis/merchant.js'
import {
  SexyTypes,
  LunarCalendarTypes,
  MemberUpgradeStatus
} from '@/enums/membership'
import { CharacterType } from '@/enums/common'
import searchPanel from '@/components/searchPanel.vue'
import userInfo from '@/components/scrm/userInfo.vue'
import popupTable from '@/components/scrm/popupTable.vue'
import batchOperation from '@/components/scrm/batchOperation.vue'
import pagination from '@/components/pagination.vue'
import importMember from '@/components/scrm/importMember.vue'
import editProfile from '@/components/scrm/editProfile.vue'
import upgradeMember from '@/components/scrm/upgradeMember.vue'
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
    editProfile,
    importMember,
    upgradeMember,
    memberExport
  },
  data() {
    return {
      apiKey: 'MEMBER_GETMEMBERLIST', // 导出api
      sexyTypes: SexyTypes, // 性别枚举
      lunarCalendarTypes: LunarCalendarTypes, // 生日类型枚举
      memberUpgradeStatus: MemberUpgradeStatus, // 生日状态枚举
      characterType: CharacterType,
      tableData: [], // 表格数据
      operatingType: 0, // 新建或者编辑会员,0或者不传是编辑,1是新建
      page: {
        total: 0
      },
      formData: {
        vipCardNo: '',
        status: '',
        levelId: '',
        groupId: '',
        memberId: '',
        trueName: '',
        mobile: '',
        sexyType: '',
        birthday: '',
        birthdayStart: '',
        birthdayEnd: '',
        dateOfBirth: [],
        lunarCalendar: '',
        areaArr: [''],
        provinceId: '',
        cityId: '',
        townId: '',
        subscrTimeStart: '',
        subscrTimeEnd: '',
        joinTime: '',
        createTime: '',
        memberTagId: '',
        storeName: '',
        historyScoreMin: '',
        historyScoreMax: '',
        upgradeStatus: ''
      },
      currUserInfo: {
        vipCardNo: '',
        trueName: '',
        mobile: '',
        aliasName: '',
        sexyType: '',
        areaArr: [],
        joinTime: [],
        settingOptionLevelId: '',
        settingOptionGroupId: '',
        historyScore: '',
        scoreExpireTime: [],
        memberTagIds: [],
        remark: '',
        dateOfBirthArray: [],
        lunarCalendar: false,
        birthday: []
      },
      rules: {
        historyScoreMin: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^\d+$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入正整数'))
              } else if (
                this.formData.historyScoreMax &&
                parseFloat(value) > parseFloat(this.formData.historyScoreMax)
              ) {
                callback(new Error())
              }
              callback()
            }
          }
        ],
        historyScoreMax: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^\d+$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入正整数'))
              } else if (
                this.formData.historyScoreMin &&
                parseFloat(value) < parseFloat(this.formData.historyScoreMin)
              ) {
                callback(new Error())
              }
              callback()
            }
          }
        ]
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
      importVisible: false, // 导入会员弹窗
      upgradeVisible: false, // 升级弹窗
      deleteVisible: false, // 单条删除提示框
      parameter: {
      }, // 用于传给后台接口做数据帅选
      settingTitle: '', // 设置弹窗标题
      settingData: {
      }, // 弹窗数据
      modalType: 0, // 弹窗类型
      leftTitle: '', // 表格左边标题
      rightTitle: '', // 表格右边标题
      batchTitle: '', // 批量设置标题
      batchOption: [], // 批量设置下拉
      batchType: null, // 批量设置类型
      fanAttribution: [], // 粉丝归属下拉
      selectsTableData: [], // 表格的选中项
      selectTables: [],
      tishi:
        '当历史会员通过微信验证手机号码后，自动升级为微信会员，并在此标记状态为“已升级”。如果微信会员先验证手机号码，在添加线下会员，在此标记“可升级”，可以点击“升级”手动升级为微信会员'
    }
  },
  methods: {
    init() {
      let query = this.$route.query || {
      }
      this.parameter.status = query.status
      this.parameter.pageSize = query.pageSize || 10
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.memberId = query.memberId || ''
      this.parameter.trueName = query.trueName || ''
      this.parameter.levelId = query.levelId || ''
      this.parameter.groupId = query.groupId || ''
      this.parameter.memberType = query.memberType || ''
      this.parameter.orderField = query.orderField || ''
      this.parameter.orderType = query.orderType
      this.parameter.dateOfBirth = query.dateOfBirth || ['', '']
      this.parameter.birthday = query.birthday || ['', '']
      this.parameter.joinTime = query.joinTime || ['', '']
      this.parameter.createTime = query.createTime || ['', '']
      this.parameter.historyScoreMin = query.historyScoreMin || ''
      this.parameter.historyScoreMax = query.historyScoreMax || ''
      this.parameter.mobile = query.mobile || ''
      this.parameter.sexyType = query.sexyType || ''
      this.parameter.memberTagId = query.memberTagId || ''
      this.parameter.lunarCalendar = query.lunarCalendar
      this.parameter.storeName = query.storeName || ''
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: '/member/clientManage/offlinemember',
        query: JSON.parse(JSON.stringify(this.parameter))
      })
    },
    // renderHeader(h, {column}) {
    //   return (
    //     <el-tooltip class="item" effect="dark" content="Bottom Center 提示文字" placement="bottom">
    //       <span>{column.label} <el-icon class="el-icon-question"></el-icon></span>
    //     </el-tooltip>
    //   )
    // },
    renderHeader(createElement) {
      return createElement('span', [
        createElement('span', {
        }, ['身份状态']),
        createElement(
          'el-tooltip',
          {
            attrs: {
              placement: 'top',
              effect: 'light',
              class: 'icon el-icon-question',
              'popper-class': 'table_headder_tip pre_tip',
              content: this.tishi
            }
          },
          [
            createElement(
              'i',
              {
                attrs: {
                  style: 'margin-left:5px;' 
                }
              },
              ['']
            )
          ]
        )
      ])
    },
    // 批量操作
    batchOperation(command) {
      this.batchType = command
      if (command == 1) {
        this.batchVisible = true
        this.batchTitle = '批量设置分组'
        const [...arr] = this.grade
        this.batchOption = arr
      }
      if (command == 2) {
        this.batchVisible = true
        this.batchTitle = '批量设置等级'
        const [...arr] = this.level
        this.batchOption = arr
      }
      if (command == 3) {
        this.batchVisible = true
        this.batchTitle = '批量设置标签'
        const [...arr] = this.multipleOptions
        this.batchOption = arr
      }
      if (command == 4) {
        this.$confirm('此操作将永久您选中的用户, 是否继续?', '批量删除数据', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            MEMBERSHIP_API_MEMBER_BATCHDELETEOFFLINEMEMBER(
              this.selectTables
            ).then(res => {
              if (res.data.Code == 'CORRECT') {
                this.$message({
                  showClose: true,
                  message: '删除成功',
                  type: 'success'
                })
                this.getData()
              }
            })
          })
          .catch(() => {})
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
      this.selectTables = []
      this.initRoute()
    },
    // 切换每页显示条数
    sizeChange(val) {
      this.parameter.pageIndex = 1
      this.parameter.pageSize = val
      this.selectTables = []
      this.initRoute()
    },
    // 点击查看用户信息
    onClickUser({
      memberId, upgradeMemberId 
    }, upgradeStatus) {
      this.$router.push({
        path: '/member/clientManage/viewcustomer',
        query: {
          memberId: upgradeMemberId || memberId, upgradeStatus 
        }
      })
    },
    // 重置
    onReset() {
      this.$refs['search'].resetFields()
      this.formData.dateOfBirthStartArray = []
      this.formData.dateOfBirthEndArray = []
      this.areaChange(this.formData.areaArr)
      this.onSearch()
    },
    onSearch() {
      this.formData.pageIndex = 1
      this.parameter = Object.assign({
      }, this.formData)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.formData)) {
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
            const obj = {
            }
            ;(obj.name = item.name),
            (obj.settingMemberTagId = item.settingMemberTagId)
            arr.push(obj)
          })
          this.multipleOptions = arr
        }
      })
    },
    // 导入成功
    importCloseModal() {
      this.getData()
    },
    // 打开导入弹窗
    importMember() {
      this.importVisible = true
    },
    // 关闭升级弹窗
    upgradeMemberClose(val) {
      this.upgradeVisible = val
    },
    confirmUpgrade(val) {
      this.upgradeVisible = val
      this.getData()
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
        memberTagIds: [],
        historyScore: userInfo.historyScore == 0 ? 0 : userInfo.historyScore
      }
      this.currUserInfo = info
      // 打开编辑资料
      if (command == 1) {
        this.editClientModal = true
      }
      // 打开升级会员
      if (command == 2) {
        this.upgradeVisible = true
      }
      // 删除
      if (command == 3) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '删除用户', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            MEMBERSHIP_API_MEMBER_DELETEOFFLINEMEMBER({
              memberId: this.currUserInfo.memberId
            }).then(res => {
              if (res.data.Code == 'CORRECT') {
                this.currUserInfo = {
                  vipCardNo: '',
                  trueName: '',
                  mobile: '',
                  aliasName: '',
                  sexyType: '',
                  areaArr: [],
                  joinTime: [],
                  settingOptionLevelId: '',
                  settingOptionGroupId: '',
                  historyScore: '',
                  scoreExpireTime: [],
                  memberTagIds: [],
                  remark: '',
                  dateOfBirthArray: [],
                  lunarCalendar: false,
                  birthday: []
                }
                this.$message({
                  showClose: true,
                  message: '删除成功',
                  type: 'success'
                })
                this.getData()
              }
            })
          })
          .catch(() => {})
      }
    },
    // 删除单条数据
    confirmDelete() {},
    newMember() {
      this.currUserInfo = {
        vipCardNo: '',
        trueName: '',
        mobile: '',
        aliasName: '',
        sexyType: '',
        areaArr: [],
        joinTime: '',
        settingOptionLevelId: '',
        settingOptionGroupId: '',
        historyScore: '',
        scoreExpireTime: '',
        memberTagIds: [],
        remark: '',
        dateOfBirthArray: [],
        lunarCalendar: false,
        birthday: ''
      }
      this.editClientModal = true
      this.operatingType = 1
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
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let parameter = Object.assign(this.formData, this.parameter, {
        birthdayStart: this.parameter.birthday[0],
        birthdayEnd: this.parameter.birthday[1],
        joinTimeStart: this.parameter.joinTime[0],
        joinTimeEnd: this.parameter.joinTime[1],
        createTimeStart: this.parameter.createTime[1],
        createTimeEnd: this.parameter.createTime[1]
      })
      MEMBERSHIP_API_MEMBER_GETMEMBERLIST(parameter).then(res => {
        this.$store.commit('SET_TB_LOADING', false) // table loading
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
        this.selectTables = val.map(item => item.memberId)
        this.batchAbled = false
      } else {
        this.selectTables = []
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
      this.operatingType = 0
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
      this.operatingType = 0
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
        StoreType: 0,
        State: 0,
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
body /deep/ .el-tooltip__popper {
  width: 100px;
}
.formItems {
  margin: 0;
}
.formItems /deep/ .el-form-item__content {
  width: 100%;
}
.formItems /deep/ .el-input-number--mini {
  width: 100%;
  .el-input__inner {
    padding: 0;
  }
}
.wave {
  width: 100%;
  display: inline-block;
  text-align: center;
}
.el-form /deep/ .el-form-item__error {
  display: none !important;
}
</style>

