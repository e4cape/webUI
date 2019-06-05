<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title fl">编辑到货单（{{detail.KindTypeEv}}）</span>
        <span class="title fr">
          <el-button type="text" @click="newEndProduct" name="btnEdit">修改</el-button>
        </span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="6" colspan="1" class="state-img">
                  <img
                    src="@/assets/images/draft.png"
                    v-if="detail.State === orderBasicState.Draft"
                  >
                  <img
                    src="@/assets/images/auditing.png"
                    v-if="detail.State === orderBasicState.Wait"
                  >
                  <img
                    src="@/assets/images/audited.png"
                    v-if="detail.State === orderBasicState.Audit"
                  >
                  <img
                    src="@/assets/images/auditBack.png"
                    v-if="detail.State === orderBasicState.Reject"
                  >
                  <img
                    src="@/assets/images/abandon.png"
                    v-if="detail.State === orderBasicState.Abandon || detail.State === orderBasicState.Cancel"
                  >
                  <div>{{orderBasicState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.ArriveCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}} {{detail.CreateTime | filterDateTime}}</td>
                <td class="tit">审核</td>
                <td v-if="detail.State === orderBasicState.Audit || detail.State === orderBasicState.Reject">{{detail.CheckUser}} {{detail.CheckTime | filterDateTime}}</td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">供应商</td>
                <td>{{detail.PartnerName}}</td>
                <td class="tit">采购员</td>
                <td>{{detail.ChargeUser}}</td>
                <td class="tit">业务日期</td>
                <td>{{detail.ActualDate | filterDate}}</td>
              </tr>
              <tr>
                <!-- <td class="tit">入库位置</td>
                <td>{{detail.WarehouseName}}>{{detail.ShelfName}}</td> -->
                <td class="tit">进货方式</td>
                <td>{{purchaseType.Types[detail.PurchaseType]}}</td>
                <td class="tit">货品类别</td>
                <td>{{financeType.Types[detail.FinanceType]}}</td>
                <td class="tit">订货单号</td>
                <td>{{detail.PurchaseCode}}</td>
              </tr>
              <tr>
                <td class="tit">送货单号</td>
                <td>{{detail.ExpressCode}}</td>
                <td class="tit">应付款</td>
                <td colspan="3">{{$root.toFloat(detail.Preprice)}}</td>
              </tr>
              <tr>
                <td class="tit">备注</td>
                <td class="note" colspan="5">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="panel-hd">
          <span class="title">编辑采购入库单</span>
        </div>

        <div class="m-10">
          <el-button
            type="primary"
            style="width: 130px;"
            @click="toCreateGoods"
            name="btnToCreateGoods"
            v-if="tabTable == 'goods'"
          >添加货品</el-button>
          <el-button
            style="width: 130px;"
            @click="templateVisible = true"
            name="btnImportant"
          >按模板导入货品</el-button>
          <el-button style="width: 120px;" @click="smartVisible = true" name="btnSmartImport">智能导入货品</el-button>
        </div>
        <div
          class="goods-wrapper"
          v-loading="$store.getters.tb_loading"
          element-loading-text="拼命加载中"
        >
          <div class="goods-left">
            <table class="goods-table" cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>条码</th>
                  <th>货品名称</th>
                  <th>数量</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in goodsDatas"
                  :key="item.index"
                  :class="{active:item.ItemId == itemId}"
                  @click="rowSelect(item.GoodsId, item.ItemId)"
                >
                  <td>{{indexTotalCount - indexPageSize * (indexPageIndex - 1) - index}}</td>
                  <td :title="item.BarCode">{{item.BarCode}}</td>
                  <td :title="item.GoodsName">{{item.GoodsName}}</td>
                  <td>{{item.Quantity}}</td>
                  <td>
                    <span
                      @click.prevent="goodsDel(item.ItemId)"
                      name="btnGoodsDel"
                      class="btn-link el-button--text"
                      style="cursor: pointer; color: #da0000;"
                    >删除</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="toolsbar" style="height: 64px;">
              <div class="myPagination-bar">
                <el-select filterable v-model="pageSize" placeholder="20" name="pageSize">
                  <el-option v-for="(item, index) in paginationSizes" :key="index" :value="item"></el-option>
                </el-select>
                <div class="pagination-controller">
                  <button
                    name="btnPrev"
                    class="prev-btn"
                    @click="prevPage"
                    :disabled="pageIndex === 1"
                    :class="{'isDisabled': pageIndex === 1}"
                  >
                    <i class="el-icon-arrow-left"></i>
                  </button>
                  <span class="current-page">{{pageIndex}}/{{pages}}</span>
                  <button
                    name="btnNext"
                    class="next-btn"
                    @click="nextPage"
                    :disabled="pageIndex === pages"
                    :class="{'isDisabled': pageIndex === pages}"
                  >
                    <i class="el-icon-arrow-right"></i>
                  </button>
                </div>
                <span class="total">共{{totalCount}}条</span>
              </div>
              <div class="count-bar">
                <span class="fl">数量合计：{{detail.ArriveQty}}</span>
                <span class="fr">
                  成本合计：
                  <b>￥{{$root.toFloat(detail.CostPrice)}}</b>
                </span>
              </div>
            </div>
          </div>
          <div class="goods-right">
            <div class="panel">
              <div class="panel-hd">
                <span class="title">货品详情</span>
                <router-link
                  v-if="itemId && itemId != ''"
                  class="el-button btn-edit el-button--text el-button--mini"
                  :to="{path: '/purchase/finishedProduct/arrivalGoodEdit', query:{id: purchaseId, itemId: itemId, apis: 'ARRIVE', OrderType: OrderType.StockingCloudGoodsArriveOrderBasic, KindTypeEk: detail.KindTypeEk}}"
                  name="btnEdit"
                >
                  <span>修改</span>
                </router-link>
              </div>
              <div class="panel-bd">
                <goods-details v-if="itemId && itemId != ''" :itemId="itemId" :apis="apis" :option="goodsOption"></goods-details>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-button
        v-if="orderBasicState.Draft == detail.State || orderBasicState.Reject == detail.State"
        type="primary"
        @click="orderSubmit"
        :loading="$store.getters.is_loading"
        name="orderSubmit"
      >提交审核</el-button>
      <el-button @click="$router.back(-1)">返回</el-button>
    </div>
    <el-dialog
      v-if="newVisible"
      title="修改成品到货单"
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
        <div>
          <el-form-item label="供应商：" prop="PartnerId">
            <el-select filterable name="PartnerId" v-model="newPurchaseOrder.PartnerId" placeholder="请选择">
              <template v-for="(item,index) in supplierList">
                <el-option
                  v-if="item.State === YNStatus.Yes && (item.PartnerType == partnerType.Merchant || item.PartnerType == partnerType.Supplier)"
                  :key="index"
                  :label="item.Value"
                  :value="Number(item.Id)"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="采购员：" prop="ChargeUserId">
            <el-select
              filterable
              name="ChargeUserId"
              v-model="newPurchaseOrder.ChargeUserId"
              placeholder="请选择"
              @change="ChargeUserChange"
            >
              <template v-for="(item, index) in buyerList">
                <el-option
                  v-if="item.UserState === SecurityUserState.Audit"
                  :key="index"
                  :label="item.TrueName"
                  :value="Number(item.UserId)"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="进货方式：" prop="PurchaseType">
            <el-radio-group v-model="newPurchaseOrder.PurchaseType" @change="purchaseTypeChange">
              <el-radio
                :label="Number(purchaseType.Purchase)"
              >{{purchaseType.Types[purchaseType.Purchase]}}</el-radio>
              <el-radio
                :label="Number(purchaseType.WeiwStuff)"
              >{{purchaseType.Types[purchaseType.WeiwStuff]}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="货品类别：" prop="FinanceType">
            <el-radio-group v-model="newPurchaseOrder.FinanceType">
              <el-radio
                v-for="(item, index) in financeType.TypeArray"
                :key="index"
                :label="item.KeyId"
                :disabled="newPurchaseOrder.PurchaseType != purchaseType.Purchase ? item.KeyId == financeType.Take ? true : false : false"
              >{{item.Value}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div>
          <el-form-item prop="PurchaseCode" label="订货单号：">
            <el-col :span="20">
                <el-input
                  name="PurchaseCode"
                  v-model="newPurchaseOrder.PurchaseCode"
                  disabled
                  :maxlength="50"
                >
                  <el-button name="btnSearch" slot="append" class="el-icon-more iconMores" @click="selectOrderForm"></el-button> 
                </el-input>
              </el-col>
          </el-form-item>
        </div>
        <div>
          <el-form-item prop="ExpressCode" label="送货单号：">
            <el-input name="ExpressCode" v-model="newPurchaseOrder.ExpressCode" :maxlength="50"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="业务日期：" prop="ActualDate">
            <el-date-picker
              :clearable="false"
              type="date"
              placeholder="选择日期"
              v-model="newPurchaseOrder.ActualDate"
              style="width: 100%;"
              :picker-options="$store.getters.businessDate"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div>
          <el-form-item prop="Preprice" label="应付款：">
            <el-input
              name="Preprice"
              v-model="newPurchaseOrder.Preprice"
              @keyup.native="newPurchaseOrder.Preprice = $root.toFixed(newPurchaseOrder.Preprice, 2, true)"
              maxlength="10"
            ></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="备注" prop="Note">
            <el-input type="textarea" @blur="newPurchaseOrder.Note = newPurchaseOrder.Note.trim()" :maxlength="200" v-model="newPurchaseOrder.Note" style="width: 300px"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="newDialogConfirm('newOrder')">确 定</el-button>
        <el-button @click="newOrderDialogColse">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 质检单 -->
    <el-dialog
      v-if="arrivalVisible"
      title="选择订货单"
      :visible.sync="arrivalVisible"
      width="1000px"
      :before-close="arrivalClose"
    >
      <el-form
        :model="arrivalOrderForm"
        ref="arrivalSearch"
        lable-width="120px"
        class="item-lh-26"
        :inline="true"
      >
      </el-form>
      <el-table
        :data="arrivalOrderData"
        @sort-change="arrivalSort"
        highlight-current-row
        @current-change="qualityCheckChange"
        v-loading="$store.getters.tb_loading"
        element-loading-text="拼命加载中"
      >
        <el-table-column
          prop="PurchaseCode"
          label="单据编号"
          sortable="custom"
          min-width="140"
          show-overflow-tooltip
          fixed
        ></el-table-column>
        <el-table-column prop="PartnerName" label="供应商" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PurchaseType" label="进货方式" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">{{purchaseType.Types[scope.row.PurchaseType]}}</template>
        </el-table-column>
        <el-table-column label="货品类别" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{financeType.Types[scope.row.FinanceType]}}</template>
        </el-table-column>
        <el-table-column
          label="业务日期"
          sortable="custom"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{scope.row.ActualDate | filterDate}}</template>
        </el-table-column>
        <el-table-column
          prop="CreateTime"
          label="创建时间"
          sortable="custom"
          min-width="120"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime}}</template>
        </el-table-column>
        <el-table-column
          prop="CreateUser"
          label="创建人"
          sortable="custom"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="ItemQty" label="数量" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Preprice" label="应付款" min-width="80" show-overflow-tooltip>
           <template slot-scope="scope">{{$root.toFloat(scope.row.Preprice)}}</template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="arrivalConfirm" type="primary" :disabled="selectQualityCheck.PurchaseId ? false : true" >确 定</el-button>
        <el-button @click="arrivalClose">取 消</el-button>
      </span>
      <!-- Pagination -->
      <pagination
        :pg="arrivalOrderForm.PageIndex"
        :size="arrivalOrderForm.PageSize"
        :total="arrivalTotal"
        @currentChange="arrivalCurrentChange"
        @sizeChange="arrivalSizeChange"
      ></pagination>
    </el-dialog>
    <!-- 模板导入 -->
    <template-import
      :visible.sync="templateVisible"
      :option="importOption"
      :root="`${$root.filePaths.STOCKING_PURCHASE}ProductOrder`"
      @submit="importSubmit"
    ></template-import>
    <!-- 智能导入 -->
    <smart-import
      :visible.sync="smartVisible"
      :option="importOption"
      :root="`${$root.filePaths.STOCKING_PURCHASE}ProductOrder`"
      @submit="submits"
    ></smart-import>
    <import-error-table v-if="errorVisible" :visible.sync="errorVisible" :errorInfo="errorInfo"></import-error-table>
  </div>
</template>

<script>
import {
  GoodsArriveOrderBasicState,
  SettingEnumeratorEnumeratorType,
  FinanceType,
  SettingCustomizedFieldLargeType,
  SettingCustomizedFieldOrderType,
  SettingCustomizedFieldType,
  StylePurchaseOrderBasicState,
  SettingCustomizedFieldSmallType
} from '@/enums/stocking.js'
import { PurchaseType, YNStatus, PartnerType } from '@/enums/common.js'
import {
  STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_GET,
  STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_GET,
  STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_GETS,
  STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_WAIT,
  STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_DELETE,
  STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_UPDATE,
  STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_TIMPORT,
  STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_UPDATE,
  STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_CREATE,
  STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS,
  STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_AIMPORT,
  STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_GETS
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST,
  MERCHANT_API_DROPDOWN_USERLIST,
  MERCHANT_API_DROPDOWN_PARTNERBASICLIST
} from '@/apis/merchant.js'
import { SecurityUserState } from '@/enums/merchant.js'
import pagination from '@/components/pagination'
import goodsDetails from '@/components/purchase/goodsDetails'
import goodsTable from '@/components/purchase/goodsTable'
import templateImport from '@/components/erp/templateImport'
import smartImport from '@/components/erp/smartImport'
import importErrorTable from '@/components/erp/importErrorTable'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      SecurityUserState,
      partnerType: PartnerType,
      OrderType: SettingCustomizedFieldOrderType,
      apis: STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_GET,
      YNStatus,
      financeType: FinanceType,
      orderBasicState: GoodsArriveOrderBasicState,
      purchaseType: PurchaseType,
      kind: [], // 种类
      buyerList: [], // 采购员下拉
      supplierList: [], // 供应商下拉
      detail: {}, // 基本信息
      editForm: {}, // 修改表单
      goodsDatas: [], // 货品数据
      goodsTables: [],
      paginationSizes: [10, 15, 20], // 分页数据条数数组
      pageSize: 10, // 分页数据条数
      pageIndex: 1, // 当前页面位置
      totalCount: 0, // 总数据条数
      indexPageSize: 10, // 列表序号，分页数据条数
      indexPageIndex: 1, // 列表序号，当前页面位置
      indexTotalCount: 0, // 列表序号，总数据条数
      purchaseId: '',
      visible2: false,
      nextLoading: false,
      createTempLoading: false,
      goBack: false, // 智能导入的返回显示隐藏
      smartTableLoading: false,
      goodsId: '', // 选中的货品id
      tabTable: 'goods',
      itemId: '',
      newVisible: false, // 编辑弹窗
      newPurchaseOrder: {
        KindTypeEk: '',
        KindTypeEv: '',
        PurchaseCode: '',
        ChargeUserId: '',
        ChargeUser: '',
        PurchaseType: PurchaseType.Purchase,
        FinanceType: FinanceType.TypeArray[0].KeyId,
        PreviousId: '',
        ExpressCode: '',
        ActualDate: dayjs().format('YYYY-MM-DD'),
        Preprice: '',
        Note: ''
      }, // 编辑成品入库单
      newOrderRules: {
        PartnerId: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],
        ChargeUserId: [
          { required: true, message: '请选择采购员', trigger: 'change' }
        ],
        PurchaseType: [
          { required: true, message: '请选择进货方式', trigger: 'change' }
        ],
        FinanceType: [
          { required: true, message: '请选择货品类别', trigger: 'change' }
        ],
        ActualDate: [
          { required: true, message: '请选择业务日期', trigger: 'change' }
        ],
      },
      templateVisible: false,
      smartVisible: false,
      goodsExportVisible: false,
      importOption: {
        OrderType: SettingCustomizedFieldOrderType.StockingCloudGoodsArriveOrderBasic,
        KindTypeEk: 0,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        SmallType: 0,
      },
      goodsOption: {
        OrderType:
          SettingCustomizedFieldOrderType.StockingCloudGoodsArriveOrderBasic,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        SmallType: 0,
        KindTypeEk: 0,
      },
      api: {
        update: STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_UPDATE,
        create: STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_CREATE
      },
      isLoading: false, // 自定义列loading
      fieldData: [], // 自定义列
      isSaved: false,
      orderType: SettingCustomizedFieldOrderType.StockingCloudGoodsArriveOrderBasic,
      arrivalOrderForm: {
        State: StylePurchaseOrderBasicState.Audit,
        IsAsced: YNStatus.No,
        OrderBy: 0,
        PageIndex: 1,
        PageSize: 20
      },
      arrivalOrderData: [],
      arrivalTotal: 0, // 质检单总数
      selectQualityCheck: {}, // 选中质检单
      arrivalVisible: false, // 到货入库弹窗
      errorVisible: false,
      errorInfo: '',
    }
  },
  computed: {
    pages() {
      return (
        (this.totalCount % this.pageSize === 0
          ? Math.ceil(this.totalCount / this.pageSize)
          : parseInt(this.totalCount / this.pageSize) + 1) || 1
      )
    }
  },
  methods: {
    dataError(msg) {
      this.$confirm(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },
    getDetail() {
      STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_GET({
        ArriveId: this.purchaseId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.importOption.KindTypeEk = res.data.Data.KindTypeEk
          this.goodsOption.KindTypeEk = res.data.Data.KindTypeEk
          this.newPurchaseOrder = {
            ...res.data.Data,
            Preprice: this.$root.toFloat(res.data.Data.Preprice)
          }
          this.editForm = Object.assign({}, res.data.Data)
          this.getGoods()
        }
      })
    },
    getGoods() {
      STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_GETS({
        ArriveId: this.purchaseId,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsDatas = res.data.Data.Rows || []
          this.goodsTables = res.data.Data.Rows || []
          this.totalCount = res.data.Data.Count || 0
          this.goodsId =
            this.goodsDatas && this.goodsDatas.length && this.goodsDatas[0].GoodsId
          this.itemId =
            this.goodsDatas && this.goodsDatas.length && this.goodsDatas[0].ItemId
          this.indexPageSize = this.pageSize
          this.indexPageIndex = this.pageIndex
          this.indexTotalCount = this.totalCount
          this.getField()
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    getField() {
      STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS({...this.goodsOption, SmallType: SettingCustomizedFieldSmallType.Basic, IsEnable: YNStatus.Yes}).then(res => {
        this.isLoading = false
        if (res.data.Code === 'CORRECT') {
          console.log(res.data.Data.Rows)
          this.fieldData = res.data.Data.Rows || []
        }
      })
    },
    tabChange(val) {
      if(val == 'table') {
        console.log(this.fieldData)
        if(this.fieldData.length > 20) {
          this.tabTable = 'goods'
          return this.$message.error('列数太多，暂时不支持表格模式')
        }
      }
    },
    rowSelect(goodsId, itemId) {
      this.goodsId = goodsId
      this.itemId = itemId
    },
    prevPage() {
      this.pageIndex-=1
    },
    nextPage() {
      this.pageIndex+=1
    },
    toCreateGoods() {
      if (!this.purchaseId) {
        return false
      }
      this.$router.push({
        path: '/purchase/finishedProduct/arrivalGoodAdd',
        query: {
          id: this.purchaseId,
          orderType: this.orderType,
          KindTypeEk: this.detail.KindTypeEk
        }
      })
    },
    orderSubmit() {
      if (this.goodsDatas.length) {
        this.$store.commit('SET_BTN_LOADING', true)
        STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_WAIT({
          ArriveId: Number(this.purchaseId),
          CheckNote: ''
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            this.$store.commit('SET_BTN_LOADING', false)
            this.$router.back(-1)
          } else {
            this.$message({
              message: res.data.Message,
              type: 'error'
            })
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      } else {
        this.$message.error('请先添加货品！')
      }
    },
    b64toBlob(b64Data, contentType, sliceSize) {
      contentType = contentType || ''
      sliceSize = sliceSize || 1024
      let byteCharacters = window.atob(b64Data)
      let byteArrays = []
      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        let slice = byteCharacters.slice(offset, offset + sliceSize)
        let byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }
        let byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }
      let blob = new Blob(byteArrays, {
        type: contentType
      })
      return blob
    },
    goodsDel(itemId) {
      this.$confirm('确定删除此货品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_DELETE({ ItemId: itemId, ArriveId: this.purchaseId }).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                this.$message({
                  message: '成功删除', 
                  type: 'success'
                })
                this.getDetail()
              } else {
                this.$message.error(res.data.Message)
              }
              this.$store.commit('SET_FULL_LOADING', false)
            }
          )
        })
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
          this.supplierList = res.data.Data.Rows
        }
      })
    },
    // 打开编辑弹窗
    newEndProduct() {
      this.newVisible = true
    },
    // 编辑弹窗确定
    newDialogConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const para = {
            ...this.newPurchaseOrder,
            PartnerId: Number(this.newPurchaseOrder.PartnerId),
            ChargeUserId: Number(this.newPurchaseOrder.ChargeUserId),
            PreviousId: Number(this.newPurchaseOrder.PreviousId),
            PurchaseType: Number(this.newPurchaseOrder.PurchaseType),
            Preprice: this.$root.toInt(this.newPurchaseOrder.Preprice)
          }
          STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_UPDATE(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$refs[formName].resetFields()
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              this.newVisible = false
              this.getDetail()
            }
          })
        }
      })
    },
    // 编辑弹窗关闭
    newOrderDialogColse() {
      this.$refs['newOrder'].resetFields()
      this.newVisible = false
    },
    // 编辑采购员
    ChargeUserChange() {
      this.buyerList.map(item => {
        if (item.UserId == this.newPurchaseOrder.ChargeUserId) {
          this.newPurchaseOrder.ChargeUser = item.TrueName
        }
      })
    },
    // 编辑进货方式发生变化
    purchaseTypeChange() {
      if (this.newPurchaseOrder.PurchaseType != PurchaseType.Purchase) {
        this.newPurchaseOrder.FinanceType = FinanceType.TypeArray[0].KeyId
      }
    },
    importSubmit(key) {
      STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_TIMPORT({
        ArriveId: this.purchaseId,
        FilePath: key,
      }).then(res => {
        if(res.data.Code === 'CORRECT') {
          this.$message({
            message: '导入模版成功',
            type: 'success'
          })
          this.templateVisible = false
          this.getDetail()
        } else if(res.data.Code === 'ERROR' && res.data.Data) {
          this.errorInfo = res.data.Data
          this.errorVisible = true
        }
      })
      this.$store.commit('SET_BTN_LOADING', false)
    },
    submits(key) {
      const fields = key.Fields.map(item => {
        const obj = item
        obj.SplitType = obj.SplitType === '' ? 0 : obj.SplitType
        return obj
      })
      const para = {
        ArriveId: this.purchaseId,
        Fields: fields,
        FilePath: key.FilePath
      }
      STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_AIMPORT(para).then(res => {
        if(res.data.Code === 'CORRECT') {
          this.$message({
            message: '导入货品成功',
            type: 'success'
          })
          this.smartVisible = false
          this.getDetail()
        } else if(res.data.Code === 'ERROR' && res.data.Data) {
          this.errorInfo = res.data.Data
          this.errorVisible = true
        }
        this.$store.commit('SET_BTN_LOADING', false)
      }) 
    },
    changeSave(save) {
      this.isSaved = save.isSaved
      this.saveLoading = save.saveLoading
    },
    save() {
      let api, row = this.$refs.goodsTable.currentRow, tableData = this.$refs.goodsTable.tableData
      this.isRet = true
      if (JSON.stringify(row) != '{}') {
        tableData.some(item => {
          if(item.IsRequired == YNStatus.Yes && row[item.FieldEnName] == 0) {
            this.isRet = false
            return this.$message.error(`${item.FieldType === SettingCustomizedFieldType.SelectOfEnums ? '请选择' : '请输入'}${item.FieldCnName}`)
          }
        })
        if (this.isRet) {
          if (row.isNew) {
            api = STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_CREATE
          } else {
            api = STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_UPDATE
          }
          let parameters = {...row}
          tableData.forEach(item => {
            if(item.Precision > 0 && parameters[item.FieldEnName]) {
              parameters[item.FieldEnName] = this.$root.toInt(parameters[item.FieldEnName])
            } else if (item.FieldType === SettingCustomizedFieldType.TextOfInteger) {
              parameters[item.FieldEnName] = parseInt(parameters[item.FieldEnName])
            }
          })
          api(Object.assign(parameters)).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.isSaved = false
              this.$message.success('保存成功')
            }
          })
        }
      }
    },
    deleteShow(scope) {
      STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_DELETE({
        ItemId: scope.row.ItemId,
        ArriveId: this.purchaseId,
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          // this.getItems()
          this.data.splice(scope.$index, 1)
          this.$message({
            type: 'success', message: '删除成功!' 
          })
        }
      })
    },
    // 新建选择订货单
    selectOrderForm() {
      this.arrivalVisible = true
      this.getQualityCheck()
    },
    // 获取质检单数据
    getQualityCheck() {
      STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_GETS(this.arrivalOrderForm).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.arrivalOrderData = res.data.Data.Rows || []
            this.arrivalTotal = res.data.Data.Count || 0
          }
        }
      )
    },
    arrivalCurrentChange(val) {
      // 切换当前页
      this.arrivalOrderForm.PageIndex = val
      this.getQualityCheck()
    },
    arrivalSizeChange(val) {
      // 切换每页显示条数
      this.arrivalOrderForm.PageSize = val
      this.arrivalOrderForm.PageIndex = 1
      this.getQualityCheck()
    },
    currentChange(val) {
      // 切换当前页
      this.PageIndex = val
      this.getQualityCheck()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.PageSize = val
      this.PageIndex = 1
      this.getGoods()
    },
    arrivalClose() {
      this.selectQualityCheck = {}
      this.arrivalVisible = false
      this.$refs['arrivalSearch'].resetFields()
    },
    arrivalConfirm() {
      this.arrivalVisible = false
      this.newPurchaseOrder.PurchaseCode = this.selectQualityCheck.PurchaseCode
      this.newPurchaseOrder.PurchaseId = this.selectQualityCheck.PurchaseId
    },
    // 选择质检单
    qualityCheckChange(val) {
      this.selectQualityCheck = val
    },
    // 质检单排序
    arrivalSort(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.arrivalOrderForm.OrderBy = 0
          break
        case 'SplitCode':
          this.arrivalOrderForm.OrderBy = 2
          break
        case 'ItemQty':
          this.arrivalOrderForm.OrderBy = 4
          break
        case 'CheckTime':
          this.arrivalOrderForm.OrderBy = 1
          break
        default:
          this.arrivalOrderForm.OrderBy = 0
          break
      }
      this.arrivalOrderForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getQualityCheck()
    },
  },
  mounted() {
    let query = this.$route.query
    this.purchaseId = Number(query.id)
    if (!this.purchaseId) {
      this.dataError()
    } else {
      this.getDetail()
      this.getSupplierList()
      this.getKind()
      this.getBuyerList()
    }
    // this.getStoreAllType()
    this.$store.dispatch('GET_SETTLE_DATE')
  },
  watch: {
    pageIndex: 'getGoods',
    pageSize() {
      this.pageIndex = 1
      this.getGoods()
    }
  },
  components: {
    goodsDetails,
    templateImport,
    smartImport,
    goodsTable,
    pagination,
    importErrorTable
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/erp/purchase.scss';
.import-purchase-dialog {
  .el-dialog {
    width: 418px;
  }
  .download-modflie {
    margin: 0 auto;
    padding: 10px 0;
    width: 360px;
    text-align: right;
    color: #20a0ff;
  }
  .alert-modflie {
    width: 100%;
    text-align: left;
    margin-bottom: 20px;
  }
  .el-dialog__body {
    padding: 10px 30px;
    .el-upload-dragger {
      margin: 0 0 20px;
    }
    .el-upload__tip {
      text-align: left;
    }
  }
}
.goods-right {
  width: 65%;
  flex: 2;
}
.goods-wrapper .goods-left .toolsbar {
  height: 98px;
}
.goods-wrapper .goods-left .toolsbar .count-bar {
  border-bottom: 1px solid #ddd;
}
.goods-wrapper .goods-left .toolsbar .count-bar:nth-child(3) {
  border: none;
}
.matchup-title {
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;
}
.popover-header {
  display: flex;
  span {
    color: #a89999;
    &.title {
      color: #444;
    }
  }
}
.popver-title {
  font-weight: 700;
}
.el-form-item {
  margin-bottom: 20px;
}
.iconMores {
  background-color: #fff !important;
  width: 32px;
  border: 1px solid #DCDFE6 !important;
  padding: 7px;
}
</style>
