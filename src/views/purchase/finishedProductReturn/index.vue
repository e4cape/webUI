<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button type="primary" @click="newEndProduct">新建</el-button>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select filterable name="State" v-model="queryForm.State" placeholder="所有状态">
              <el-option label="所有状态" value="0"></el-option>
              <el-option
                v-for="item in orderBasicState.TypeArray"
                :key="item.value"
                :label="item.Value"
                :value="String(item.KeyId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ReturnCode">
            <el-input
              name="ReturnCode"
              v-model="queryForm.ReturnCode"
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
            label="位置："
            v-if="$store.getters.user_session.CharacterType === characterType.Company"
          >
            <el-cascader
              v-model="Position"
              :options="positionList"
              change-on-select
              @visible-change="cascaderChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="退货原因：" prop="ReasonTypeDk">
            <el-select filterable name="ReasonTypeDk" v-model="queryForm.ReasonTypeDk" placeholder="所有原因">
              <el-option label="所有原因" value="0"></el-option>
              <el-option
                v-for="(item, index) in reasonsList"
                :key="index"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类别：" prop="FinanceType">
            <el-select filterable name="FinanceType" v-model="queryForm.FinanceType" placeholder="所有类别">
              <el-option label="所有类别" value="0"></el-option>
              <el-option
                v-for="(item, index) in financeType.TypeArray"
                :key="index"
                :label="item.Value"
                :value="String(item.KeyId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ReturnCode" label="单据编号：">
            <el-input
              name="ReturnCode"
              v-model="queryForm.ReturnCode"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item prop="PartnerName" label="供应商：">
            <el-input
              name="PartnerName"
              v-model="queryForm.PartnerName"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建时间：" prop="CreateTime">
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
          <el-form-item label="创建人：" prop="CreateUserId">
            <el-select filterable name="CreateUserId" v-model="queryForm.CreateUserId" placeholder="全部">
              <el-option label="全部" value="0"></el-option>
              <template v-for="(item, index) in buyerList">
                <el-option
                  v-if="item.UserState === SecurityUserState.Audit"
                  :key="index"
                  :label="item.TrueName"
                  :value="String(item.UserId)"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="最后操作时间：" prop="CheckTime">
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
        prop="ReturnCode"
        label="单据编号"
        sortable="custom"
        min-width="140"
        show-overflow-tooltip
        fixed
      ></el-table-column>
      <el-table-column prop="PartnerName" label="供应商" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ItemQty" label="退货数量" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CostPrice" label="退货成本" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          {{$root.toFloat(scope.row.CostPrice)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="WarehouseName"
        v-if="$store.getters.user_session.CharacterType === characterType.Company"
        label="退货仓库"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="Preprice"
        label="应付款"
        min-width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{$root.toFloat(scope.row.Preprice)}}
        </template>
      </el-table-column>
      <el-table-column prop="ReasonTypeDv" label="退货原因" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="货品类别" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{financeType.Types[scope.row.FinanceType]}}</template>
      </el-table-column>
      <el-table-column
        prop="ActualDate"
        label="业务日期"
        min-width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{scope.row.ActualDate | filterDate}}
        </template>
      </el-table-column>
      <el-table-column
        prop="CreateTime"
        label="创建时间"
        sortable="custom"
        min-width="120"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{scope.row.CreateTime | filterDateTime}}
        </template>
      </el-table-column>
      <el-table-column
        prop="CheckTime"
        label="最后操作时间"
        min-width="120"
        sortable="custom"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{scope.row.CheckTime | filterDateTime}}
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="80" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <el-tooltip placement="top" v-if="(scope.row.State === orderBasicState.Reject || scope.row.State === orderBasicState.Abandon || scope.row.State === orderBasicState.Cancel) && scope.row.CheckNote">
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
          <el-button
            name="btnShowDetail"
            type="text"
            @click="viewArrivalOrder(scope.row.ReturnId)"
          >查看</el-button>
          <el-button
            name="btnShowDetail"
            type="text"
            v-if="orderBasicState.Draft == scope.row.State || orderBasicState.Reject == scope.row.State"
            @click="linkEditPage(scope.row.ReturnId)"
          >编辑</el-button>
          <el-button
            name="btnShowDetail"
            type="text"
            v-if="orderBasicState.Draft == scope.row.State || orderBasicState.Reject == scope.row.State"
            @click="openObsolete(scope.row)"
          >作废</el-button>
          <el-button
            name="btnShowDetail"
            type="text"
            v-if="orderBasicState.Wait == scope.row.State"
            @click="showAuditDialog(scope.row)"
          >审核</el-button>
          <el-button
            name="btnShowDetail"
            type="text"
            v-if="orderBasicState.Audit == scope.row.State"
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
    <el-dialog
      v-if="newVisible"
      title="新建退货单"
      :visible.sync="newVisible"
      width="600px"
      :before-close="newOrderDialogColse"
    >
      <el-form
        :model="newPurchaseOrder"
        :rules="newOrderRules"
        ref="newOrder"
        lable-width="120px"
        class="item-lh-26"
        :inline="true"
      >
        <div v-if="$store.getters.user_session.CharacterType === characterType.Company">
          <el-form-item label="退货仓库：" prop="WarehouseId">
            <el-select
              filterable
              name="WarehouseId"
              v-model="newPurchaseOrder.WarehouseId"
              placeholder="请选择"
              @change="warehouseChange"
            >
            <template v-for="(item, index) in newPositionList">
              <el-option
                v-if="item.State === YNStatus.Yes"
                :key="index"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="ShelfId">
            <el-select filterable name="ShelfId" v-model="newPurchaseOrder.ShelfId" :disabled="shelfList.length == 0">
              <el-option
                v-for="(item, index) in shelfList"
                :key="index"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="退货原因：" prop="ReasonTypeDk">
          <el-select
            filterable
            name="ReasonTypeDk"
            v-model="newPurchaseOrder.ReasonTypeDk"
            placeholder="请选择"
            @change="reasonTypeChange"
          >
            <el-option
              v-for="(item, index) in reasonsList"
              :key="index"
              :label="item.Value"
              :value="String(item.Id)"
            ></el-option>
          </el-select>
          <span class="icon-set-item" @click="reasonDialog=true" name="iconSetItem">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item label="业务日期：" prop="ActualDate">
          <el-date-picker
            :clearable="false"
            type="date"
            placeholder="选择日期"
            v-model="newPurchaseOrder.ActualDate"
            style="width: 100%;"
            :picker-options="$store.getters.businessDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="Preprice" label="应付款：">
          <el-input
            name="Preprice"
            v-model="newPurchaseOrder.Preprice"
            @keyup.native="newPurchaseOrder.Preprice = $root.toFixed(newPurchaseOrder.Preprice, 2, true)"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <div>
          <el-form-item label="备注" prop="Note">
            <el-input type="textarea" v-model="newPurchaseOrder.Note" @blur="newPurchaseOrder.Note = newPurchaseOrder.Note.trim()" style="width: 300px" :maxlength="200"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="$store.getters.is_loading"  @click="newDialogConfirm('newOrder')">确 定</el-button>
        <el-button  @click="newOrderDialogColse">取 消</el-button>
      </span>
    </el-dialog>

     <el-dialog
      title="审核"
      :visible.sync="auditDialog"
      width="750px"
      @close="cancelAudit"
      v-if="auditDialog"
    >
      <el-form :label-position="'right'" label-width="100px">
        <el-row v-if="reviewData.length === 1">
          <el-col :span="10">
            <el-form-item label="单据编号：">
              <span :title="reviewData[0].ReturnCode" class="ReturnCode">{{reviewData[0].ReturnCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="创建：">
              <span class="ReturnCode">{{reviewData[0].CreateUser}} {{reviewData[0].CreateTime | filterDateTime}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="审核结果：">
          <el-radio-group v-model="returnInfo.auditType" name="auditType">
            <el-row :gutter="10">
              <el-col :span="24">
                <el-radio :label="YNStatus.Yes">审核通过</el-radio>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <el-radio :label="YNStatus.No" style="padding-top: 10px;">审核退回</el-radio>
              </el-col>
              <el-col :span="16" v-show="returnInfo.auditType === YNStatus.No">
                <el-input
                  v-model="returnInfo.auditReson"
                  @blur="returnInfo.auditReson = returnInfo.auditReson.trim()"
                  placeholder="退回原因备注"
                  :maxlength="200"
                  name="auditReson"
                ></el-input>
              </el-col>
            </el-row>
          </el-radio-group>
        </el-form-item>
        <div
          v-if="returnInfo.auditType == YNStatus.Yes && supplierList.length > 1 && reviewData[0].Preprice"
        >
          <div class="colorRed">
            <div>该单需要按供应商拆成多个单据，请为每个供应商设置应付款：</div>
            <div>
              总共应付款为：
              <span>{{$root.toFloat(reviewData[0].Preprice)}}</span>
            </div>
          </div>
          <el-form-item
            v-for="(item,index) in supplierList"
            :label="item.name +'(' + financeType.Types[item.FinanceType] + ')：'"
            label-width="100"
            :key="index"
            style="margin-left: 30px;"
          >
            <el-input
              v-model="item.Preprice"
              name="auditReson"
              @keyup.native="item.Preprice = $root.toFixed(item.Preprice, 2, true)"
              maxlength="10"
              style="width: 120px;"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="confirmAudit"
          :loading="$store.getters.is_loading"
          name="btnAuditStockloss"
        >确 定</el-button>
        <el-button @click="cancelAudit" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 作废 -->
    <obsolete
      v-if="obsoleteVisble"
      @visbleColse="visbleColse"
      @confirmObsolete="confirmObsolete"
      :data="reviewData"
      :visibleObs="obsoleteVisble"
    ></obsolete>
    <!-- 取消审核 -->
    <cancel-Review
      :visibleCan="visibleCan"
      :data="reviewData"
      v-if="visibleCan"
      @confirmCancel="cancelConfirm"
      @visbleColse="cancelColse"
    ></cancel-Review>
    <!-- @module Dialog·新建退货原因 -->
    <dict-manage
      :visible.sync="reasonDialog"
      :dicts="reasonsList"
      dialogTitle="退货原因"
      :dictType="SettingDictionaryDictType.GoodsReturnOrderBasicReasonType"
      @listenDictSave="getReturn"
    ></dict-manage>
    <!-- End Dialog·新建退货原因  -->
  </el-row>
</template>

<script>
import {
  GoodsReturnOrderBasicState,
  SettingEnumeratorEnumeratorType,
  FinanceType,
  GoodsIntakeOrderBasicIntakeType,
  SettingCustomizedFieldOrderType,
  SettingDictionaryDictType
} from '@/enums/stocking.js'
import {
  PurchaseType,
  CharacterType,
  YNStatus,
  EnableState
} from '@/enums/common.js'
import {
  STOCKING_API_GOODS_RETURN_ORDER_BASIC_CANCEL,
  STOCKING_API_GOODS_RETURN_ORDER_BASIC_ABANDON,
  STOCKING_API_GOODS_RETURN_ORDER_BASIC_REJECT,
  STOCKING_API_GOODS_RETURN_ORDER_BASIC_AUDIT,
  STOCKING_API_GOODS_RETURN_ORDER_BASIC_GETS,
  STOCKING_API_GOODS_RETURN_ORDER_BASIC_CREATE
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST,
  MERCHANT_API_DROPDOWN_USERLIST,
  MERCHANT_API_DROPDOWN_WAREHOUSEBASICLIST,
  MERCHANT_API_DROPDOWN_PARTNERBASICLIST,
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST,
} from '@/apis/merchant.js'
import { SecurityUserState } from '@/enums/merchant.js'
import dayjs from 'dayjs'
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import reviewDialog from '@/components/purchase/reviewDialog'
import obsolete from '@/components/purchase/obsolete'
import cancelReview from '@/components/purchase/cancelReview'
import dictManage from '@/components/erp/dictManage'
export default {
  data() {
    return {
      SecurityUserState,
      YNStatus,
      SettingDictionaryDictType,
      characterType: CharacterType,
      orderType:
        SettingCustomizedFieldOrderType.StockingCloudGoodsIntakeOrderBasic,
      orderBasicState: GoodsReturnOrderBasicState, // 入库状态
      purchaseType: PurchaseType, // 进货方式拉下
      financeType: FinanceType, // 货品类别
      orderBasicIntakeType: GoodsIntakeOrderBasicIntakeType, // 来源拉下
      kind: [], // 种类
      buyerList: [], // 采购员下拉
      positionList: [{
        label: '所有位置',
        value: 0
      }], // 位置仓库下拉
      newPositionList: [],
      shelfList: [], // 货架下拉
      supplierRow: [], // 供应商下拉
      supplierList: [], // 审核时供应商列表
      reasonsList: [], // 退货原因下拉
      queryForm: {
        // 查询表单数据
        WarehouseId: '',
        ShelfId: '',
        State: '0',
        ReasonTypeDk: '0',
        FinanceType: '0',
        ReturnCode: '',
        PartnerName: '',
        CreateTime: [],
        CreateTime1: '',
        CreateTime2: '',
        CreateUserId: '0',
        CheckTime: [],
        CheckTime1: '',
        CheckTime2: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      arrivalOrderForm: {
        PreviousCode: '',
        PartnerId: '0',
        KindTypeEk: '0',
        IsAsced: YNStatus.No,
        OrderBy: 0,
        PageIndex: 1,
        PageSize: 20
      }, // 质检单筛选
      arrivalOrderData: [], // 质检单数据
      arrivalTotal: 0, // 质检单总数
      selectQualityCheck: [], // 选中质检单
      data: [],
      total: 0,
      newVisible: false, // 新建弹窗
      auditDialog: false, // 审核弹窗
      arrivalVisible: false, // 到货入库弹窗
      obsoleteVisble: false, // 作废弹窗
      visibleCan: false, // 取消审核弹窗
      newPurchaseOrder: {
        WarehouseId: '',
        ShelfId: '',
        ReasonTypeDk: '',
        ActualDate: dayjs().format('YYYY-MM-DD'),
        Preprice: 0,
        Note: ''
      }, // 新建成品入库单
      Position: [0], // 位置筛选
      expandRows: [],
      parameters: {},
      newOrderTitle: '', // 入库弹窗标题  "新建成品入库单、到货入库、分秤入库、旧货转成品入库"
      arrivalTitle: '', // 质检单弹窗标题 "新建成品入库单 到货入库、分秤入库、旧货转成品入库"
      reviewTitle: '', // 审核弹窗标题
      reviewData: [], // 弹窗数据
      newOrderRules: {
        WarehouseId: [
          { required: true, message: '请选择退货仓库', trigger: 'change' }
        ],
        ReasonTypeDk: [
          { required: true, message: '请选择退货原因', trigger: 'change' }
        ],
        ShelfId: [{ required: true, message: '请选择货架', trigger: 'change' }],
        ActualDate: [
          { required: true, message: '请选择业务日期', trigger: 'change' }
        ],
      },
      reasonDialog: false, // 设置退货原因弹窗
      SettleDate: '',
      returnInfo: {
        auditType: YNStatus.Yes, // 审核状态 1代表通过 3代表不通过
        auditReson: '' // 审核不通过理由
      }, // 审核信息
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query : {
            WarehouseId: '',
            ShelfId: '',
            State: '0',
            ReasonTypeDk: '0',
            FinanceType: '0',
            ReturnCode: '',
            PartnerName: '',
            CreateTime: [],
            CreateTime1: '',
            CreateTime2: '',
            CreateUserId: '0',
            CheckTime: [],
            CheckTime1: '',
            CheckTime2: '',
            OrderBy: 0,
            IsAsced: YNStatus.No,
            PageIndex: 1,
            PageSize: 20
          }
      this.parameters = Object.assign({}, query)
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      this.queryForm = Object.assign(this.queryForm, this.parameters)
      STOCKING_API_GOODS_RETURN_ORDER_BASIC_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    createChange(value) {
      if (value) {
        this.queryForm.CreateTime1 = value[0]
        this.queryForm.CreateTime2 = value[1]
      } else {
        this.queryForm.CreateTime1 = ''
        this.queryForm.CreateTime2 = ''
      }
    },
    checkChange(value) {
      if (value) {
        this.queryForm.CheckTime1 = value[0]
        this.queryForm.CheckTime2 = value[1]
      } else {
        this.queryForm.CheckTime1 = ''
        this.queryForm.CheckTime2 = ''
      }
    },
    expandRow(val) {
      this.expandRows = val
    },
    querySort(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.queryForm.OrderBy = 0
          break
        case 'CheckTime':
          this.queryForm.OrderBy = 1
          break
        case 'ReturnCode':
          this.queryForm.OrderBy = 2
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
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
      this.queryForm.WarehouseId = ''
      this.queryForm.ShelfId = ''
      this.Position = [0]
      this.$refs['search'].resetFields()
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
    arrivalCurrentChange(val) {
      // 切换当前页
      this.arrivalOrderForm.PageIndex = val
      this.initRoute()
    },
    arrivalSizeChange(val) {
      // 切换每页显示条数
      this.arrivalOrderForm.PageSize = val
      this.arrivalOrderForm.PageIndex = 1
    },
    initRoute() {
      this.$router.replace({ path: this.$router.path, query: this.parameters })
    },
    // 查看到货单
    viewArrivalOrder(id) {
      this.$router.push({
        path: '/purchase/finishedProductReturn/viewFinishedProductReturn',
        query: { id }
      })
    },
    // 跳转编辑
    linkEditPage(id) {
      this.$router.push({
        path: '/purchase/finishedProductReturn/editFinishedProductReturn',
        query: { id }
      })
    },
    // 位置筛选
    cascaderChange(value) {
      if (!value) {
        this.queryForm.WarehouseId = this.Position.length
          ? this.Position[0]
          : ''
        this.queryForm.ShelfId =
          this.Position.length >= 2 ? this.Position[1] : ''
      }
    },
    // 获取种类
    getKind() {
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.KindType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.kind = res.data.Data.Rows
        }
      })
    },
    // 获取采购员
    getBuyerList() {
      MERCHANT_API_DROPDOWN_USERLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.buyerList = res.data.Data.Rows
        }
      })
    },
    // 获取供应商
    getSupplierList() {
      MERCHANT_API_DROPDOWN_PARTNERBASICLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.supplierRow = res.data.Data.Rows
        }
      })
    },
    // 获取入库位置
    getPositionList() {
      MERCHANT_API_DROPDOWN_WAREHOUSEBASICLIST({ HasShelf: YNStatus.Yes }).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            res.data.Data.Rows.map(item => {
              const obj = {
                ...item,
                label: item.Value,
                value: item.Id
              }
              if (obj.Childrens.length && obj.Childrens.length != 1) {
                obj.children = item.Childrens.map(val => {
                  return {
                    ...val,
                    label: val.Value,
                    value: val.Id
                  }
                })
              }
              this.positionList.push(obj)
              this.newPositionList.push(obj)
            })
          }
        }
      )
    },
    // 获取退货原因
    getReturn() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        State: EnableState.Enable,
        DictType: SettingDictionaryDictType.GoodsReturnOrderBasicReasonType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.reasonsList = res.data.Data.Rows
        }
      })
    },
    // 打开新建弹窗
    newEndProduct() {
      this.newVisible = true
    },
    // 打开审核和批量审核弹窗
    showAuditDialog(obj) {
      const arr = obj.SplitPartnerIds.split(',')
      this.supplierList = arr.map(item => {
        const str = item.split(':')
        return { Preprice: 0, name: str[1], PartnerId: str[0], FinanceType: str[2] }
      })
      this.reviewData = obj ? [{ ...obj, orderNumber: obj.ReturnCode }] : []
      this.auditDialog = true
      console.log(this.supplierList)
    },
    // 关闭审核
    cancelAudit() {
      this.reviewData = []
      this.reviewTitle = ''
      this.returnInfo = {
        auditType: YNStatus.Yes, // 审核状态 1代表通过 3代表不通过
        auditReson: '' // 审核不通过理由
      },
      this.auditDialog = false
    },
    // 打开作废
    openObsolete(obj) {
      this.reviewData = [{ ...obj, orderNumber: obj.ReturnCode }]
      this.obsoleteVisble = true
    },
    // 作废关闭
    visbleColse() {
      this.obsoleteVisble = false
    },
    // 作废确认
    confirmObsolete(note) {
      const para = {
        ReturnId: this.reviewData[0].ReturnId,
        CheckNote: note
      }
      STOCKING_API_GOODS_RETURN_ORDER_BASIC_ABANDON(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '作废成功',
            type: 'success'
          })
          this.obsoleteVisble = false
          this.reviewData = []
          this.onSearch()
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    // 打开取消审核
    openCancelReview(obj) {
      this.reviewData = obj ? [{ ...obj, orderNumber: obj.ReturnCode }] : []
      this.visibleCan = true
    },
    // 取消审核确定
    cancelConfirm(data) {
      const para = {
        ReturnId: Number(this.reviewData[0].ReturnId),
        CheckNote: data
      }
      STOCKING_API_GOODS_RETURN_ORDER_BASIC_CANCEL(para).then(res => {
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
      this.reviewData = []
      this.visibleCan = false
    },
    // 新建弹窗确定
    newDialogConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          const para = {
            ...this.newPurchaseOrder,
            WarehouseId: Number(this.newPurchaseOrder.WarehouseId),
            ActualDate: dayjs(this.newPurchaseOrder.ActualDate).format(
              'YYYY-MM-DD'
            ),
            ReasonTypeDk: Number(this.newPurchaseOrder.ReasonTypeDk),
            ShelfId: Number(this.newPurchaseOrder.ShelfId),
            Preprice: this.$root.toInt(Number(this.newPurchaseOrder.Preprice)),
          }
          STOCKING_API_GOODS_RETURN_ORDER_BASIC_CREATE(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$refs[formName].resetFields()
              this.shelfList = []
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              this.selectQualityCheck = []
              this.newVisible = false
              setTimeout(() => {
                this.linkEditPage(res.data.Data)
              }, 500)
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        }
      })
    },
    // 新建选择订货单
    selectOrderForm() {
      this.arrivalTitle = this.newOrderTitle
      this.arrivalVisible = true
      this.getQualityCheck()
    },
    // 新建弹窗关闭
    newOrderDialogColse() {
      this.$refs['newOrder'].resetFields()
      this.shelfList = []
      this.newVisible = false
    },
    // 退货原因
    reasonTypeChange() {
      this.reasonsList.map(item => {
        if (item.Id == this.newPurchaseOrder.ReasonTypeDk) {
          this.newPurchaseOrder.ReasonTypeDv = item.Value
        }
      })
    },
    // 新建进货单选择仓库后
    warehouseChange() {
      const Shelf = this.positionList.find(item => {
        return item.Id == this.newPurchaseOrder.WarehouseId
      })
      this.newPurchaseOrder.ShelfId =
        Shelf.Childrens.length == 1 ? String(Shelf.Childrens[0].Id) : ''
      this.shelfList = Shelf.Childrens
    },
    // 审核确定
    confirmAudit() {
      const para = {
        ReturnId: this.reviewData[0].ReturnId,
        CheckNote: this.returnInfo.auditReson
      }
      if (
        this.returnInfo.auditType === YNStatus.Yes &&
        this.supplierList.length > 1 &&
        this.supplierList[0].name != '' &&
        this.reviewData[0].Preprice
      ) {
        this.supplierList.map(item => {
          this.supplierRow.map(val => {
            if (item.name == val.Value) {
              item.PartnerId = val.Id
            }
          })
        })
        let preprice = 0
        para.Items = this.supplierList.map(item => {
          preprice = preprice + this.$root.toInt(item.Preprice)
          return { Preprice: this.$root.toInt(item.Preprice), PartnerId: Number(item.PartnerId), FinanceType: Number(item.FinanceType) }
        })
        if(preprice != this.reviewData[0].Preprice) {
          return this.$message.error('供应商的总额必须等于应付款')
        }
      } else if(
        this.returnInfo.auditType === YNStatus.Yes &&
        this.supplierList.length > 1 &&
        this.supplierList[0].name != '' &&
        this.reviewData[0].Preprice == 0
      ) {
        this.supplierList.map(item => {
          this.supplierRow.map(val => {
            if (item.name == val.Value) {
              item.PartnerId = Number(val.Id)
            }
          })
        })
        para.Items = this.supplierList.map(item => {
          return { Preprice: 0, PartnerId: Number(item.PartnerId) }
        })
      }
      console.log(para)
      if (YNStatus.Yes === this.returnInfo.auditType) {
        STOCKING_API_GOODS_RETURN_ORDER_BASIC_AUDIT(para).then(res => {
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
      } else if (YNStatus.No === this.returnInfo.auditType) {
        STOCKING_API_GOODS_RETURN_ORDER_BASIC_REJECT(para).then(res => {
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
    },
  },
  mounted() {
    this.getKind()
    this.getBuyerList()
    this.getPositionList()
    this.getSupplierList()
    this.getReturn()
    this.init()
    this.$store.dispatch('GET_SETTLE_DATE')
  },
  watch: {
    $route: 'init',
    'queryForm.State': 'onSearch',
  },
  components: {
    searchPanel,
    pagination,
    reviewDialog,
    obsolete,
    cancelReview,
    dictManage
  }
}
</script>

<style lang="scss" scoped>
.colorRed {
  color: red;
  margin-left: 29px;
  line-height: 23px;
  margin-bottom: 10px;
  span {
    font-weight: bold;
  }
}
.el-form-item{
  margin-bottom: 15px;
}
</style>
