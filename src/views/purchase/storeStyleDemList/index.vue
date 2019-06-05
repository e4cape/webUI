<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item v-if="$store.getters.user_session.CharacterType === characterType.Store">
            <el-button type="primary" :disabled="newKind.length == 0 ? true : false" v-if="newKind.length <= 1" @click="openDemandList(newKind[0].Id)">新建</el-button>
            <el-dropdown @command="openDemandList" type="primary" v-if="newKind.length > 1">
              <el-button name="btnmultiCheckPrint" type="primary">
                新建
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in newKind"
                  :key="index"
                  :command="item.Id"
                  style="width: 80px; text-align: center;"
                >{{item.Value}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item v-if="$store.getters.user_session.CharacterType === characterType.Company">
            <el-button
              name="createShop"
              @click="openGenerate"
              type="primary"
              icon="fa fa-plus"
              :disabled="expandRows.length ? false : true"
              v-if="$store.getters.user_session.CharacterType === characterType.Company"
            >生成订货单</el-button>
            <el-dropdown @command="reviewStyleOrder('批量审核')" type="primary">
              <el-button name="btnmultiCheckPrint" type="primary">
                批量操作
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1" :disabled="!expandRows.length">批量审核</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item v-if="$store.getters.user_session.CharacterType === characterType.Company">
            <el-dropdown @command="openExport" type="primary">
              <el-button name="btnmultiCheckPrint" type="primary">
                导出
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item :command="1">导出所有</el-dropdown-item> -->
                <el-dropdown-item :command="2">导出查询结果</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select name="State" v-model="queryForm.State" placeholder="所有" filterable>
              <el-option label="所有" :value="0"></el-option>
              <el-option
                v-for="item in orderBasicState.TypeArray"
                :key="item.value"
                :label="item.Value"
                :value="Number(item.KeyId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="RequireCode">
            <el-input
              name="RequireCode"
              v-model="queryForm.RequireCode"
              :maxlength="50"
              @keyup.enter.native="onSearch"
              placeholder="单据编号"
            >
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item
            label="所有门店："
            prop="StoreArr"
            v-if="$store.getters.user_session.CharacterType === characterType.Company"
          >
            <el-cascader
              v-model="queryForm.StoreArr"
              :options="storeTypeList"
              change-on-select
              @visible-change="cascaderChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="所有种类：" prop="KindTypeEk">
            <el-select name="KindTypeEk" v-model="queryForm.KindTypeEk" placeholder="所有种类" filterable>
              <el-option label="所有种类" :value="0"></el-option>
              <el-option
                v-for="(item,index) in kind"
                :key="index"
                :label="item.Value"
                :value="Number(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="RequireCode" label="单据编号：">
            <el-input
              name="RequireCode"
              v-model="queryForm.RequireCode"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建日期：" prop="CreateTime">
            <el-date-picker
              name="CreateTime"
              v-model="queryForm.CreateTime"
              @change="createChange"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="最后操作日期：" prop="CheckTime">
            <el-date-picker
              name="CheckTime"
              v-model="queryForm.CheckTime"
              @change="checkChange"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="下单情况：" prop="PurchaseXpState">
            <el-select name="PurchaseXpState" v-model="queryForm.PurchaseXpState" placeholder="全部">
              <el-option label="全部" :value="0"></el-option>
              <el-option
                v-for="(item, index) in orderBasicPurchase.TypeArray"
                :key="index"
                :label="item.Value"
                :value="Number(item.KeyId)"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="分货情况：" prop="SplitXpState">
            <el-select name="SplitXpState" v-model="queryForm.SplitXpState" placeholder="全部" filterable>
              <el-option label="全部" :value="0"></el-option>
              <el-option
                v-for="(item, index) in splitXpState.TypeArray"
                :key="index"
                :label="item.Value"
                :value="Number(item.KeyId)"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- Data Table -->
    <el-table
      :data="data"
      @sort-change="querySort"
      @selection-change="expandRow"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column type="selection" fixed></el-table-column>
      <el-table-column
        prop="RequireCode"
        label="单据编号"
        min-width="140"
        show-overflow-tooltip
        sortable="custom"
        fixed
      ></el-table-column>
      <el-table-column prop="StoreName" label="门店" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="门店类型" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{storeType.Types[scope.row.StoreType]}}</template>
      </el-table-column>
      <el-table-column prop="KindTypeEv" label="货品种类" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" min-width="120" show-overflow-tooltip sortable="custom">
        <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime }}</template>
      </el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="ItemQty"
        label="需求量"
        min-width="80"
        show-overflow-tooltip
        sortable="custom"
      ></el-table-column>
      <!-- <el-table-column label="下单情况" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{orderBasicPurchase.Types[scope.row.PurchaseXpState]}}</template>
      </el-table-column> -->
      <el-table-column label="分货情况" min-width="80" show-overflow-tooltip prop="SplitQtyName">
        <!-- <template slot-scope="scope">{{scope.row.SplitQtyName}}</template> -->
      </el-table-column>
      <el-table-column label="最后操作时间" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.CheckTime | filterDateTime }}</template>
      </el-table-column>
      <el-table-column label="状态" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip placement="top" v-if="(scope.row.State === orderBasicState.Reject || scope.row.State === orderBasicState.Abandon|| scope.row.State === orderBasicState.Cancel) && scope.row.CheckNote">
            <div slot="content">{{scope.row.CheckNote}}</div>
            <span
              :class="scope.row.State | findKey(orderBasicState)">
              {{orderBasicState.Types[scope.row.State] || '-'}}
            </span>
          </el-tooltip>
          <span
            :class="scope.row.State | findKey(orderBasicState)"
            v-else>
            {{orderBasicState.Types[scope.row.State] || '-'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <el-button name="viewStyle" type="text" @click="viewStyleOrder(scope.row.RequireId)">查看</el-button>
          <el-button
            name="editStyle"
            type="text"
            v-if="scope.row.State == orderBasicState.Draft || scope.row.State == orderBasicState.Reject"
            @click="editStyleOrder(scope.row.RequireId)"
          >编辑</el-button>
          <el-button
            name="obsoleteStyle"
            type="text"
            v-if="scope.row.State == orderBasicState.Draft || scope.row.State == orderBasicState.Reject"
            @click="openObsolete(scope.row)"
          >作废</el-button>
          <el-button
            name="reviewStyle"
            type="text"
            v-if="$store.getters.user_session.CharacterType === characterType.Company && scope.row.State == orderBasicState.Wait"
            @click="reviewStyleOrder('审核',scope.row)"
          >审核</el-button>
          <el-button
            name="cancelReview"
            type="text"
            v-if="$store.getters.user_session.CharacterType === characterType.Company && scope.row.State == orderBasicState.Audit"
            @click="openCancelReview(scope.row)"
          >取消审核</el-button>
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
    <!-- end 货品详情-->
    <!-- 新建款式需求单 -->
    <demand-List
      title="新建款式需求单"
      v-if="demandListDialog"
      :demandListVisible="demandListDialog"
      @colseDemandList="colseDemList"
      @confirmCreate="newStyleOrder"
    ></demand-List>
    <!-- end 新建款式需求单 -->
    <!-- 作废 -->
    <obsolete
      v-if="obsoleteVisble"
      @visbleColse="visbleColse"
      @confirmObsolete="confirmObsolete"
      :data="operatingData"
      :visibleObs="obsoleteVisble"
    ></obsolete>
    <!-- 审核 -->
    <review-Dialog
      :auditDialog="auditDialog"
      :title="reviewTitle"
      :data="operatingData"
      v-if="auditDialog"
      @confirmClick="confirmAudit"
      @cancelClick="cancelAudit"
    ></review-Dialog>
    <!-- 取消审核 -->
    <cancel-Review
      :visibleCan="visibleCan"
      :data="operatingData"
      v-if="visibleCan"
      @confirmCancel="cancelConfirm"
      @visbleColse="cancelColse"
    ></cancel-Review>
    <!-- 导出 -->
    <base-export-field-setter @submit="downLoadData" title="导出" :visible.sync="ExportVisible" :items="ExportColumns" :props="{key: 'FieldEnName', label: 'FieldCnName'}" />
    <!-- 生成到货订单 -->
    <generate-order
      v-if="generateOrderDialog"
      title="生成订货单"
      :selectArr="expandRows"
      :generateOrder="generateOrderDialog"
      @colseGenerateOrder="colseGenOrder"
      :types="'styleDemList'"
    ></generate-order>
    <!-- end 生成到货订单 -->
  </el-row>
</template>

<script>
import { YNStatus, StoreType, CharacterType } from '@/enums/common.js'
import {
  SettingEnumeratorEnumeratorType,
  StyleRequireOrderBasicSplitXpState,
  StyleRequireOrderBasicState,
  StyleRequireOrderBasicPurchaseXpState
} from '@/enums/stocking.js'
import {
  STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_GETS,
  STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_CREATE,
  STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_ABANDON,
  STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_AUDIT,
  STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_REJECT,
  STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_AUDITS,
  STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_REJECTS,
  STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_CANCEL,
  STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_EXPORT
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST,
  MERCHANT_API_DROPDOWN_STORELIST
} from '@/apis/merchant.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import demandList from './demandList'
import obsolete from '@/components/purchase/obsolete'
import reviewDialog from '@/components/purchase/reviewDialog'
import cancelReview from '@/components/purchase/cancelReview'
import baseExportFieldSetter from '@/components/baseExportFieldSetter'
import generateOrder from '../totalInventory/generateOrder'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      characterType: CharacterType,
      YNStatus,
      kind: [], // 种类
      newKind: [],
      splitXpState: StyleRequireOrderBasicSplitXpState, // 分货情况下拉
      orderBasicState: StyleRequireOrderBasicState, // 状态
      orderBasicPurchase: StyleRequireOrderBasicPurchaseXpState, // 下单状态
      storeType: StoreType, // 门店类型
      storeTypeList: [], // 门店级联
      desks: [], // 所有来源
      queryForm: {
        // 查询表单数据
        StoreArr: [0],
        StoreType: 0,
        StorechterId: 0,
        State: 0,
        KindTypeEk: 0,
        RequireCode: '',
        CreateTime: [],
        CreateTime1: '',
        CreateTime2: '',
        CheckTime: [],
        CheckTime1: '',
        CheckTime2: '',
        PurchaseXpState: 0,
        SplitXpState: 0,
        OrderBy: YNStatus.No,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      data: [],
      total: 0,
      demandListDialog: false, // 款式需求单对话框
      obsoleteVisble: false, // 作废弹窗
      auditDialog: false, // 审核弹窗
      visibleCan: false, // 取消审核弹窗
      expandRows: [],
      parameters: {},
      reviewTitle: '', // 审核标题
      KindTypeEk: '',
      operatingData: [],
      ExportVisible: false,
      exportType: 0, // 导出类型
      generateOrderDialog: false, // 生成订货单对话框
      ExportColumns: [
        {
          FieldEnName: 'RequireCode',
          FieldCnName: '单据编号',
        },
        {
          FieldEnName: 'StoreName',
          FieldCnName: '门店名称',
        },
        {
          FieldEnName: 'StoreTypeName',
          FieldCnName: '门店类型',
        },
        {
          FieldEnName: 'KindTypeEv',
          FieldCnName: '货品种类',
        },
        {
          FieldEnName: 'CreateTime',
          FieldCnName: '创建时间',
        },
        {
          FieldEnName: 'CreateUser',
          FieldCnName: '创建人员',
        },
        {
          FieldEnName: 'ItemQty',
          FieldCnName: '需求量',
        },
        // {
        //   FieldEnName: 'PurchaseXpState',
        //   FieldCnName: '下单情况',
        // },
        {
          FieldEnName: 'SplitQtyName',
          FieldCnName: '分货情况',
        },
        {
          FieldEnName: 'CheckTime',
          FieldCnName: '最后操作时间',
        },
        {
          FieldEnName: 'StateName',
          FieldCnName: '状态',
        },
      ],
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? {
            ...this.$route.query,
            StoreType: Number(this.$route.query.StoreType),
            StorechterId: Number(this.$route.query.StorechterId),
            State: Number(this.$route.query.State),
            KindTypeEk: Number(this.$route.query.KindTypeEk),
            PurchaseXpState: Number(this.$route.query.PurchaseXpState),
            SplitXpState: Number(this.$route.query.SplitXpState),
            IsAsced: Number(this.$route.query.IsAsced),
            OrderBy: Number(this.$route.query.OrderBy),
            PageIndex: Number(this.$route.query.PageIndex),
            PageSize: Number(this.$route.query.PageSize),
          } : {
            StoreType: 0,
            StorechterId: 0,
            State: 0,
            KindTypeEk: 0,
            RequireCode: '',
            CreateTime1: '',
            CreateTime2: '',
            CheckTime1: '',
            CheckTime2: '',
            PurchaseXpState: 0,
            SplitXpState: 0,
            IsAsced: YNStatus.No,
            OrderBy: 0,
            PageIndex: 1,
            PageSize: 20
          }
      query.StoreArr = [Number(query.StoreType)]
      if (query.StorechterId != '') {
        query.StoreArr.push(Number(query.StorechterId))
      }
      this.parameters = Object.assign({}, query)
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      this.queryForm = Object.assign(this.queryForm, this.parameters)
      STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    // 新建需求单
    newStyleOrder(data) {
      const para = {
        ...data,
        ActualDate: dayjs(data.ActualDate).format('YYYY-MM-DD'),
        ForwdDate:
          data.ForwdDate == ''
            ? ''
            : dayjs(data.ForwdDate).format('YYYY-MM-DD'),
        KindTypeEk: Number(this.KindTypeEk)
      }
      const obj = this.kind.find(item => item.Id == this.KindTypeEk)
      para.KindTypeEv = obj.Value
      STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_CREATE(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '新建款式需求单成功',
            type: 'success'
          })
          this.KindTypeEv = ''
          this.demandListDialog = false
          this.editStyleOrder(res.data.Data)
        }
      })
    },
    // 门店筛选变化
    cascaderChange(value) {
      if (!value) {
        this.queryForm.StoreType = this.queryForm.StoreArr[0]
        if (this.queryForm.StoreArr.length === 2) {
          this.queryForm.StorechterId = this.queryForm.StoreArr[1]
        } else {
          this.queryForm.StorechterId = 0
        }
      }
    },
    // 创建时间
    createChange(value) {
      if (value) {
        this.queryForm.CreateTime1 = value[0]
        this.queryForm.CreateTime2 = value[1]
      } else {
        this.queryForm.CreateTime1 = ''
        this.queryForm.CreateTime2 = ''
      }
    },
    // 最后操作时间
    checkChange(value) {
      if (value) {
        this.queryForm.CheckTime1 = value[0]
        this.queryForm.CheckTime2 = value[1]
      } else {
        this.queryForm.CheckTime1 = ''
        this.queryForm.CheckTime2 = ''
      }
    },
    expandRow(row) {
      this.expandRows = row
    },
    // 排序
    querySort(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.queryForm.OrderBy = 0
          break
        case 'RequireCode':
          this.queryForm.OrderBy = 2
          break
        case 'ItemQty':
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
    // 查看
    viewStyleOrder(id) {
      this.$router.push(`/purchase/storeStyleDemList/viewStyleDemList?id=${id}`)
    },
    editStyleOrder(id) {
      this.$router.push(`/purchase/storeStyleDemList/editStyleDemList?id=${id}`)
    },
    // 打开作废
    openObsolete(obj) {
      this.operatingData = [{ ...obj, orderNumber: obj.RequireCode }]
      this.obsoleteVisble = true
    },
    // 作废关闭
    visbleColse() {
      this.obsoleteVisble = false
    },
    // 作废确认
    confirmObsolete(note) {
      const para = {
        RequireId: this.operatingData[0].RequireId,
        CheckNote: note
      }
      STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_ABANDON(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '作废成功',
            type: 'success'
          })
          this.obsoleteVisble = false
          this.operatingData = []
          this.onSearch()
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    // 审核弹窗打开
    reviewStyleOrder(title, obj) {
      this.operatingData = obj ? [{ ...obj, orderNumber: obj.RequireCode }] : []
      this.reviewTitle = title || ''
      if(title === '批量审核') {
        if (this.expandRows.filter(item => {
          if (item.State !== this.orderBasicState.Wait) {
            return item
          }
        }).length > 0) {
          return this.$message.error('请选择待审核的单据')
        }
      }
      this.auditDialog = true
    },
    // 审核确定
    confirmAudit(data) {
      if (this.reviewTitle == '审核') {
        const para = {
          RequireId: Number(this.operatingData[0].RequireId),
          CheckNote: data.auditReson
        }
        if (YNStatus.Yes === data.auditType) {
          STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_AUDIT(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '审核通过成功',
                type: 'success'
              })
              this.cancelAudit()
              this.onSearch()
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        } else if (YNStatus.No === data.auditType) {
          STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_REJECT(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '审核退回成功',
                type: 'success'
              })
              this.cancelAudit()
              this.onSearch()
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        }
      } else if (this.reviewTitle == '批量审核') {
        const para = {
          Items: [],
          CheckNote: data.auditReson
        }
        this.expandRows.map(item => {
          if(item.State === StyleRequireOrderBasicState.Wait) {
            const obj = {
              RequireId: item.RequireId
            }
            para.Items.push(obj)
          }
        })
        if(para.Items.length === 0) {
          this.$store.commit('SET_BTN_LOADING', false)
          return this.$message.error('请选择待审核的单据')
        }
        if (YNStatus.Yes === data.auditType) {
          STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_AUDITS(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '批量审核通过成功',
                type: 'success'
              })
              this.cancelAudit()
              this.onSearch()
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        } else if (YNStatus.No === data.auditType) {
          STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_REJECTS(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '批量审核退回成功',
                type: 'success'
              })
              this.cancelAudit()
              this.onSearch()
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        }
      }
    },
    // 关闭审核
    cancelAudit() {
      this.operatingData = []
      this.reviewTitle = ''
      this.auditDialog = false
    },
    // 打开取消审核
    openCancelReview(obj) {
      this.operatingData = obj ? [{ ...obj, orderNumber: obj.RequireCode }] : []
      this.visibleCan = true
    },
    // 取消审核确定
    cancelConfirm(data) {
      const para = {
        RequireId: Number(this.operatingData[0].RequireId),
        CheckNote: data
      }
      STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_CANCEL(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '取消审核成功',
            type: 'success'
          })
          this.cancelColse()
          this.onSearch()
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    // 取消审核关闭
    cancelColse() {
      this.operatingData = []
      this.visibleCan = false
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.queryForm.CreateTime1 = ''
      this.queryForm.CreateTime2 = ''
      this.queryForm.CheckTime1 = ''
      this.queryForm.CheckTime2 = ''
      this.$refs['search'].resetFields()
      this.queryForm.StoreArr = [0]
      this.queryForm.StoreType = ''
      this.queryForm.StorechterId = ''
      this.onSearch()
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageSize = val
      this.parameters.PageIndex = 1
      this.initRoute()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: this.parameters
      })
    },
    openDemandList(e) {
      this.KindTypeEk = e
      this.demandListDialog = true
    },
    colseDemList() {
      this.KindTypeEk = ''
      this.demandListDialog = false
    },
    // 获取种类
    getKind() {
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.KindType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.kind = res.data.Data.Rows
          this.newKind = res.data.Data.Rows.filter(item => item.State === YNStatus.Yes)
        }
      })
    },
    // 获取门店级联
    getStoreList() {
      const storeList = [
        {
          label: '所有位置',
          value: 0
        }
      ]
      StoreType.TypeArray.map(item => {
        const objs = {
          label: item.Value,
          value: Number(item.KeyId)
        }
        storeList.push(objs)
      })
      MERCHANT_API_DROPDOWN_STORELIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          res.data.Data.Rows.map(item => {
            storeList.map(val => {
              if (val.value == item.StoreType) {
                const obj = {
                  ...item,
                  value: Number(item.CharacterId),
                  label: item.Value
                }
                if (!val.children) {
                  val.children = []
                }
                val.children.push(obj)
              }
            })
          })
          this.storeTypeList = storeList
        }
      })
    },
    openExport(command) {
      this.exportType = command
      this.ExportVisible = true
      // STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_EXPORT(this.queryForm).then(res => {
      //   if(res.data.Code === 'CORRECT') {
      //     console.log(res.data.Data)
      //     // window.open(res.data.Data)
      //   }
      // })
    },
    downLoadData(column) {
      let param = { ...this.queryForm }
      if(this.exportType == 2) {
        param.PageSize = 0
      }
      param.ExportColumns = column
      STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_EXPORT(param).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data) {
            setTimeout(() => {
              window.open(
                this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data
              )
            }, 1000)
          }
        }
        this.ExportVisible = false
      })
    },
    openGenerate() {
      for(let i = 0; i < this.expandRows.length; i++) {
        for(let o = 1; o < this.expandRows.length; o++) {
          if(this.expandRows[i].KindTypeEk !== this.expandRows[o].KindTypeEk) {
            return this.$message.error('只能选择相同货品种类的单据生成订货单')
          }
        }
      }
      const isAudit = this.expandRows.filter(item => item.State !== StyleRequireOrderBasicState.Audit)
      if(isAudit.length) {
        return this.$message.error('只能生成审核通过的需求单')
      }
      this.generateOrderDialog = true
    },
    colseGenOrder() {
      this.generateOrderDialog = false
    },
  },
  created() {},
  mounted() {
    this.init()
    this.getKind()
    this.getStoreList()
  },
  watch: {
    $route: 'init',
    'queryForm.State': 'onSearch',
    // 'queryForm.KindTypeEk': 'onSearch',
    // 'queryForm.PurchaseXpState': 'onSearch',
    // 'queryForm.SplitXpState': 'onSearch'
  },
  components: {
    searchPanel,
    pagination,
    demandList,
    obsolete,
    reviewDialog,
    cancelReview,
    baseExportFieldSetter,
    generateOrder
  }
}
</script>

<style lang="scss" scoped>
.reject {
  color: red;
}
</style>
