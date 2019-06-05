<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title fl">编辑成品进货入库（{{detail.KindTypeEv}}）</span>
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
                <td>{{detail.IntakeCode}}</td>
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
                <td class="tit">进货方式</td>
                <td>{{purchaseType.Types[detail.PurchaseType]}}</td>
                <td class="tit">货品类别</td>
                <td :colspan="$store.getters.user_session.CharacterType === characterType.Company ? 1 : 3">{{financeType.Types[detail.FinanceType]}}</td>
                <td class="tit" v-if="$store.getters.user_session.CharacterType === characterType.Company">入库位置</td>
                <td v-if="$store.getters.user_session.CharacterType === characterType.Company">{{detail.WarehouseName}}>{{detail.ShelfName}}</td>
              </tr>
              <tr>
                <!-- <td class="tit">订货单号</td>
                <td>{{detail.previousCode}}</td> -->
                <td class="tit">送货单号</td>
                <td>{{detail.ExpressCode}}</td>
                <td class="tit">应付款</td>
                <td :colspan="3">{{$root.toFloat(detail.Preprice)}}</td>
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

        <div class="m-10" v-if="orderBasicIntakeType.Manual == detail.IntakeType">
          <el-button
            type="primary"
            style="width: 130px;"
            @click="toCreateGoods"
            name="btnToCreateGoods"
            v-if="tabTable == 'goods'"
          >添加货品</el-button>
          <el-button style="width: 130px;" name="btnImportant" @click="templateVisible = true">按模板导入货品</el-button>
          <el-button style="width: 120px;" name="btnSmartImport" @click="smartVisible = true">智能导入货品</el-button>
        </div>
        <div
          class="goods-wrapper"
          v-loading="$store.getters.tb_loading"
          element-loading-text="拼命加载中"
          style="margin-top: 15px;"
        >
          <div class="goods-left" >
            <!-- 货品列表 -->
            <table class="goods-table" cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>条码</th>
                  <th>货品名称</th>
                  <th>数量</th>
                  <th v-if="orderBasicIntakeType.Manual == detail.IntakeType">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in goodsData"
                  :key="item.index"
                  :class="{active:item.ItemId == itemId}"
                  @click="rowSelect(item.GoodsId, item.ItemId)"
                >
                  <td>{{indexTotalCount - indexPageSize * (indexPageIndex - 1) - index}}</td>
                  <td :title="item.BarCode">{{item.BarCode}}</td>
                  <td :title="item.GoodsName">{{item.GoodsName}}</td>
                  <td>{{item.Quantity}}</td>
                  <td v-if="orderBasicIntakeType.Manual == detail.IntakeType">
                    <span
                      class="btn-link el-button--text"
                      @click.prevent="goodsDel(item.ItemId)"
                      name="btnGoodsDel"
                      style="cursor: pointer; color: #da0000;"
                    >删除</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- 工具栏 -->
            <div class="toolsbar">
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
                <span class="fl">数量合计：{{detail.IntakeQty}}</span>
                <span class="fr">
                  成本合计：
                  <b>￥{{$root.toFloat(detail.CostPrice)}}</b>
                </span>
              </div>
              <div class="count-bar">
                <span class="fl">金重合计：{{$root.toFloat(detail.GoldWeight, 3)}}</span>
                <span class="fr">标签价合计：<b>{{$root.toFloat(detail.LabelPrice)}}</b></span>
              </div>
            </div>
          </div>
          <div class="goods-right">
            <!-- 货品详情 -->
            <div class="panel">
              <div class="panel-hd">
                <span class="title">货品详情</span>
                <router-link
                  v-if="itemId"
                  class="el-button btn-edit el-button--text el-button--mini"
                  :to="{path: '/purchase/finishedProduct/arrivalGoodEdit', query:{id: purchaseId, itemId: itemId, apis: 'INTAKE', OrderType: OrderType.StockingCloudGoodsIntakeOrderBasic, KindTypeEk: detail.KindTypeEk}}"
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
        name="save"
        type="primary"
        @click="save"
        v-if="isSaved"
        :loading="saveLoading">
        保存
      </el-button>
      <el-button
        v-else-if="orderBasicState.Draft == detail.State || orderBasicState.Reject == detail.State"
        type="primary"
        @click="orderSubmit"
        :loading="$store.getters.is_loading"
        name="orderSubmit"
      >提交审核</el-button>
      <el-button @click="$router.back(-1)">返回</el-button>
    </div>
    <!-- 修改 -->
    <el-dialog
      v-if="newVisible"
      :title="newOrderTitle"
      :visible.sync="newVisible"
      width="600px"
      :before-close="newOrderDialogColse"
    >
      <el-form
        :model="editData"
        :rules="newOrderRules"
        ref="newOrder"
        lable-width="120px"
        class="item-lh-26"
        :inline="true"
      >
        <div>
          <el-form-item label="供应商：" prop="PartnerId">
            <el-select filterable name="PartnerId" v-model="editData.PartnerId" placeholder="请选择">
              <template v-for="(item, index) in supplierList">
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
              v-model="editData.ChargeUserId"
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
            <el-radio-group v-model="editData.PurchaseType" @change="purchaseTypeChange">
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
            <el-radio-group v-model="editData.FinanceType">
              <el-radio
                v-for="(item, index) in financeType.TypeArray"
                :key="index"
                :label="item.KeyId"
                :disabled="editData.PurchaseType != purchaseType.Purchase ? item.KeyId == financeType.Take ? true : false : false"
              >{{item.Value}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <!-- <div>
          <el-form-item prop="PreviousId" label="订货单号：">
            <el-row>
              <el-col :span="20">
                <el-input name="PreviousId" v-model="editData.PreviousId" disabled :maxlength="50">
                  <el-button name="btnSearch" slot="append" class="el-icon-more iconMores" @click="selectOrderForm"></el-button> 
                </el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </div> -->
        <div>
          <el-form-item prop="ExpressCode" label="送货单号：">
            <el-input name="ExpressCode" v-model="editData.ExpressCode" :maxlength="50"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item v-if="$store.getters.user_session.CharacterType === characterType.Company">
            <el-form-item label="入库位置：" prop="WarehouseId">
              <el-select filterable v-model="editData.WarehouseId" @change="warehouseChange" :disabled="true">
                <el-option
                  v-for="(item, index) in positionList"
                  :key="index"
                  :label="item.label"
                  :value="Number(item.Id)"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="ShelfId">
              <el-select filterable v-model="editData.ShelfId" :disabled="true">
                <el-option
                  v-for="(item, index) in shelfList"
                  :key="index"
                  :label="item.Value"
                  :value="Number(item.Id)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="业务日期：" prop="ActualDate">
            <el-date-picker
              :clearable="false"
              type="date"
              placeholder="选择日期"
              v-model="editData.ActualDate"
              style="width: 100%;"
              :picker-options="$store.getters.businessDate"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div>
          <el-form-item prop="Preprice" label="应付款：">
            <el-input name="Preprice" v-model="editData.Preprice" @keyup.native="editData.Preprice = $root.toFixed(editData.Preprice, 2, true)" maxlength="10"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="备注" prop="Note">
            <el-input type="textarea" @blur="editData.Note = editData.Note.trim()" v-model="editData.Note" style="width: 300px" :maxlength="200"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newOrderDialogColse">取 消</el-button>
        <el-button type="primary" @click="newDialogConfirm('newOrder')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 质检单 -->
    <el-dialog
      v-if="arrivalVisible"
      title="选择成品入库单"
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
        <el-form-item prop="PartnerId">
          <el-select filterable name="PartnerId" v-model="arrivalOrderForm.PartnerId" placeholder="请选择">
            <el-option label="所有供应商" value="0"></el-option>
            <el-option
              v-for="(item, index) in supplierList"
              :key="index"
              :label="item.Value"
              :value="String(item.Id)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="KindTypeEk">
          <el-select filterable name="KindTypeEk" v-model="arrivalOrderForm.KindTypeEk" placeholder="请选择">
            <el-option label="所有种类" value="0"></el-option>
            <el-option
              v-for="(item,index) in kind"
              :key="index"
              :label="item.Value"
              :value="String(item.Id)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="QualityCode">
          <el-input
            name="QualityCode"
            v-model="arrivalOrderForm.QualityCode"
            placeholder="请输入单据编号"
            :maxlength="50"
            @keyup.enter.native="getQualityCheck"
          ></el-input>
        </el-form-item>
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
          prop="QualityCode"
          label="单据编号"
          sortable="custom"
          min-width="140"
          show-overflow-tooltip
          fixed
        ></el-table-column>
        <el-table-column prop="PartnerName" label="供应商" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="KindTypeEv" label="货品种类" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PurchaseType" label="进货方式" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">{{purchaseType.Types[scope.row.PurchaseType]}}</template>
        </el-table-column>
        <el-table-column label="货品类别" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{financeType.Types[scope.row.FinanceType]}}</template>
        </el-table-column>
        <el-table-column label="业务日期" sortable="custom" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.ActualDate | filterDateTime}}</template>
        </el-table-column>
        <el-table-column label="创建时间" sortable="custom" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime}}</template>
        </el-table-column>
        <el-table-column
          prop="CreateUser"
          label="创建人"
          sortable="custom"
          min-width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="ArriveQty" label="数量" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoldWeight" label="金重(g)" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="LabelPrice" label="标签价" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{$root.toFloat(scope.row.LabelPrice)}}</template>
        </el-table-column>
        <el-table-column label="成本" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{$root.toFloat(scope.row.CostPrice)}}</template>
        </el-table-column>
        <el-table-column label="应付款" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{$root.toFloat(scope.row.Preprice)}}</template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="arrivalClose">取 消</el-button>
        <el-button type="primary" @click="arrivalConfirm">确 定</el-button>
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
  GoodsIntakeOrderBasicState,
  FinanceType,
  SettingEnumeratorEnumeratorType,
  SettingCustomizedFieldOrderType,
  SettingCustomizedFieldLargeType,
  SettingCustomizedFieldType,
  GoodsIntakeOrderBasicIntakeType
} from '@/enums/stocking.js'
import { CharacterType, PurchaseType, YNStatus, PartnerType } from '@/enums/common.js'
import {
  STOCKING_API_GOODS_INTAKE_ORDER_ITEM_DELETE,
  STOCKING_API_GOODS_INTAKE_ORDER_ITEM_GET,
  STOCKING_API_GOODS_INTAKE_ORDER_BASIC_UPDATE,
  STOCKING_API_GOODS_INTAKE_ORDER_BASIC_GET,
  STOCKING_API_GOODS_INTAKE_ORDER_ITEM_GETS,
  STOCKING_API_GOODS_INTAKE_ORDER_BASIC_WAIT,
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GETS,
  STOCKING_API_GOODS_INTAKE_ORDER_ITEM_UPDATE,
  STOCKING_API_GOODS_INTAKE_ORDER_ITEM_CREATE,
  STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS,
  STOCKING_API_GOODS_INTAKE_ORDER_ITEM_TIMPORT,
  STOCKING_API_GOODS_INTAKE_ORDER_ITEM_AIMPORT
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST,
  MERCHANT_API_DROPDOWN_USERLIST,
  MERCHANT_API_DROPDOWN_WAREHOUSEBASICLIST,
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
      orderBasicIntakeType: GoodsIntakeOrderBasicIntakeType,
      SecurityUserState,
      partnerType: PartnerType,
      OrderType: SettingCustomizedFieldOrderType,
      apis: STOCKING_API_GOODS_INTAKE_ORDER_ITEM_GET,
      characterType: CharacterType,
      YNStatus,
      financeType: FinanceType,
      orderBasicState: GoodsIntakeOrderBasicState,
      purchaseType: PurchaseType,
      detail: {}, // 基本信息
      editForm: {}, // 修改表单
      goodsData: [], // 货品数据
      goodsTable: [],
      paginationSizes: [10, 15, 20], // 分页数据条数数组
      pageSize: 10, // 分页数据条数
      pageIndex: 1, // 当前页面位置
      totalCount: 0, // 总数据条数
      indexPageSize: 10, // 列表序号，分页数据条数
      indexPageIndex: 1, // 列表序号，当前页面位置
      indexTotalCount: 0, // 列表序号，总数据条数
      purchaseId: '',
      goodsId: '', // 选中的货品id
      tabTable: 'goods',
      itemId: '',
      newOrderTitle: '', // 编辑弹窗标题
      newVisible: false, // 编辑弹窗
      editData: {}, // 编辑验证信息
      kind: [], // 种类
      buyerList: [], // 采购员下拉
      positionList: [], // 位置仓库下拉
      shelfList: [], // 货架下拉
      supplierList: [], // 供应商下拉
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
        WarehouseId: [
          { required: true, message: '请选择仓库', trigger: 'change' }
        ],
        ShelfId: [{ required: true, message: '请选择货架', trigger: 'change' }],
        ActualDate: [
          { required: true, message: '请选择业务日期', trigger: 'change' }
        ],
      },
      arrivalOrderForm: {
        PreviousCode: '',
        PartnerId: '0',
        KindTypeEk: '0',
        IsAsced: YNStatus.No,
        OrderBy: 0,
        PageIndex: 1,
        PageSize: 10
      }, // 质检单筛选
      arrivalVisible: false, // 到货入库弹窗
      arrivalOrderData: [], // 质检单数据
      arrivalTotal: 0, // 质检单总数
      selectQualityCheck: [], // 选中质检单
      goodsOption: {
        OrderType:
          SettingCustomizedFieldOrderType.StockingCloudGoodsIntakeOrderBasic,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        SmallType: 0,
        KindTypeEk: 0,
        IsEnable: YNStatus.Yes
      },
      importOption: {
        OrderType: SettingCustomizedFieldOrderType.StockingCloudGoodsIntakeOrderBasic,
        KindTypeEk: 0,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        SmallType: 0
      },
      api: {
        update: STOCKING_API_GOODS_INTAKE_ORDER_ITEM_UPDATE,
        create: STOCKING_API_GOODS_INTAKE_ORDER_ITEM_CREATE
      },
      isLoading: false, // 自定义列loading
      fieldData: [], // 自定义列
      isSaved: false,
      orderType: SettingCustomizedFieldOrderType.StockingCloudGoodsIntakeOrderBasic,
      templateVisible: false,
      smartVisible: false,
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
      STOCKING_API_GOODS_INTAKE_ORDER_BASIC_GET({
        IntakeId: this.purchaseId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.editData = {
            ...res.data.Data,
            Preprice: this.$root.toFloat(res.data.Data.Preprice)
          }
          this.goodsOption.KindTypeEk = res.data.Data.KindTypeEk
          this.importOption.KindTypeEk = res.data.Data.KindTypeEk
          this.editForm = Object.assign({}, res.data.Data)
          this.getGoods()
        }
      })
    },
    getGoods() {
      STOCKING_API_GOODS_INTAKE_ORDER_ITEM_GETS({
        IntakeId: this.purchaseId,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsAsced: YNStatus.No,
        OrderBy: 1,
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.goodsTable = res.data.Data.Rows || []
          this.totalCount = res.data.Data.Count || 0
          this.goodsId =
            this.goodsData && this.goodsData.length && this.goodsData[0].GoodsId
          this.itemId =
            this.goodsData && this.goodsData.length && this.goodsData[0].ItemId
          this.indexPageSize = this.pageSize
          this.indexPageIndex = this.pageIndex
          this.indexTotalCount = this.totalCount
          this.getField()
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    getField() {
      STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS(this.goodsOption).then(res => {
        this.isLoading = false
        if (res.data.Code === 'CORRECT') {
          this.fieldData = res.data.Data.Rows || []
        }
      })
    },
    tabChange(val) {
      if(val == 'table') {
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
      this.pageIndex -= 1
    },
    nextPage() {
      this.pageIndex += 1
    },
    toCreateGoods() {
      if (!this.purchaseId) {
        return false
      }
      this.$router.push({
        path: '/purchase/productStorage/purchaseGoodAdd',
        query: {
          id: this.purchaseId,
          orderType: this.goodsOption.OrderType,
          KindTypeEk: this.detail.KindTypeEk
        }
      })
    },
    // 提交审核
    orderSubmit() {
      if (this.goodsData.length) {
        this.$store.commit('SET_BTN_LOADING', true)
        STOCKING_API_GOODS_INTAKE_ORDER_BASIC_WAIT({
          IntakeId: Number(this.purchaseId),
          CheckNote: ''
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            this.$store.commit('SET_BTN_LOADING', false)
            setTimeout(() => {
              this.$router.back(-1)
            },1500)
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
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        STOCKING_API_GOODS_INTAKE_ORDER_ITEM_DELETE({
          ItemId: itemId,
          IntakeId: this.purchaseId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getDetail()
          }
          this.$store.commit('SET_FULL_LOADING', false)
        })
      })
    },
    // 打开修改弹窗
    newEndProduct() {
      this.newOrderTitle = '修改成品入库单'
      this.newVisible = true
    },
    // 获取供应商
    getSupplierList() {
      MERCHANT_API_DROPDOWN_PARTNERBASICLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.supplierList = res.data.Data.Rows
        }
      })
    },
    // 新建弹窗关闭
    newOrderDialogColse() {
      this.$refs['newOrder'].resetFields()
      this.shelfList = []
      this.newVisible = false
    },
    // 新建弹窗确定
    newDialogConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const para = {
            ...this.editData,
            PartnerId: Number(this.editData.PartnerId),
            ChargeUserId: Number(this.editData.ChargeUserId),
            PreviousId: this.selectQualityCheck.length
              ? this.selectQualityCheck[0].QualityId
              : Number(this.editData.PreviousId),
            WarehouseId: Number(this.editData.WarehouseId),
            ShelfId: Number(this.editData.ShelfId),
            PurchaseType: Number(this.editData.PurchaseType),
            ActualDate: dayjs(this.editData.ActualDate).format('YYYY-MM-DD'),
            Preprice: this.$root.toInt(this.editData.Preprice)
          }
          STOCKING_API_GOODS_INTAKE_ORDER_BASIC_UPDATE(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$refs[formName].resetFields()
              this.shelfList = []
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.selectQualityCheck = []
              this.newVisible = false
              this.getDetail()
            }
          })
        }
      })
    },
    // 新建选择订货单
    selectOrderForm() {
      this.arrivalVisible = true
      this.getQualityCheck()
    },
    // 新建采购员
    ChargeUserChange() {
      this.buyerList.map(item => {
        if (item.UserId == this.editData.ChargeUserId) {
          this.editData.ChargeUser = item.TrueName
        }
      })
    },
    // 新建进货方式发生变化
    purchaseTypeChange() {
      if (this.editData.PurchaseType != PurchaseType.Purchase) {
        this.editData.FinanceType = FinanceType.TypeArray[0].KeyId
      }
    },
    // 新建进货单选择仓库后
    warehouseChange() {
      const Shelf = this.positionList.find(item => {
        return item.Id == this.editData.WarehouseId
      })
      this.editData.ShelfId =
        Shelf.Childrens.length == 1 ? Number(Shelf.Childrens[0].Id) : ''
      this.shelfList = Shelf.Childrens.length && Shelf.Childrens
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
    // 获取入库位置
    getPositionList() {
      MERCHANT_API_DROPDOWN_WAREHOUSEBASICLIST({ HasShelf: YNStatus.Yes }).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.positionList = res.data.Data.Rows.map(item => {
              const obj = {
                ...item,
                label: item.Value,
                value: item.Id
              }
              if (obj.Childrens.length && obj.Childrens.length != 1) {
                obj.Childrens = item.Childrens.map(val => {
                  return {
                    ...val,
                    label: val.Value,
                    value: val.Id
                  }
                })
              }
              return obj
            })
            const Shelf =
              res.data.Data.Rows.length &&
              res.data.Data.Rows.find(item => {
                return item.Id == this.editForm.WarehouseId
              })
            this.shelfList = Shelf.Childrens.length && Shelf.Childrens
          }
        }
      )
    },
    // 获取质检单数据
    getQualityCheck() {
      STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GETS(this.arrivalOrderForm).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.arrivalOrderData = res.data.Data.Rows || []
            this.arrivalTotal = res.data.Data.Count || 0
          }
        }
      )
    },
    // 质检单排序
    arrivalSort(sort) {
      switch (sort.prop) {
        case 'ActualDate':
          this.arrivalOrderForm.OrderBy = 2
          break
        case 'CreateTime':
          this.arrivalOrderForm.OrderBy = 0
          break
        case 'CheckTime':
          this.arrivalOrderForm.OrderBy = 1
          break
        case 'IntakeId':
          this.arrivalOrderForm.OrderBy = 3
          break
        default:
          this.arrivalOrderForm.OrderBy = 0
          break
      }
      this.arrivalOrderForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getQualityCheck()
    },
    // 选择质检单
    qualityCheckChange(val) {
      this.selectQualityCheck = [val]
    },
    arrivalConfirm() {
      this.arrivalVisible = false
      this.editData.PreviousId = this.selectQualityCheck[0].QualityCode
    },
    arrivalClose() {
      this.selectQualityCheck = []
      this.arrivalVisible = false
      this.$refs['arrivalSearch'].resetFields()
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
    deleteShow(scope) {
      if (this.goodsTable.length <= 1 && !scope.row.ItemId && this.PageIndex === 1) {
        this.$message.warning('至少保留一行')
        return false
      }
      this.$confirm('是否删除当前行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {goodsTable
        if (!scope.row.ItemId) {
          this.goodsTable.splice(scope.$index, 1)
          if (this.goodsTable.length === 0) {
            this.PageIndex = 1
            this.getGoods()
          }
        } else {
          STOCKING_API_GOODS_INTAKE_ORDER_ITEM_DELETE({
            ItemId: scope.row.ItemId,
            IntakeId: this.purchaseId,
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.goodsTable.splice(scope.$index, 1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              if (this.goodsTable.length === 0) {
                if (this.PageIndex > 1) {
                  this.PageIndex = 1
                  this.getGoods()
                }
              } else {
                this.getGoods()
              }
            }
          })
        }
      
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
            api = STOCKING_API_GOODS_INTAKE_ORDER_ITEM_CREATE
          } else {
            api = STOCKING_API_GOODS_INTAKE_ORDER_ITEM_UPDATE
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
    importSubmit(key) {
      STOCKING_API_GOODS_INTAKE_ORDER_ITEM_TIMPORT({
        IntakeId: this.purchaseId,
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
        IntakeId: this.purchaseId,
        Fields: fields,
        FilePath: key.FilePath
      }
      STOCKING_API_GOODS_INTAKE_ORDER_ITEM_AIMPORT(para).then(res => {
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
    currentChange(val) {
      // 切换当前页
      this.pageIndex = val
      this.getGoods()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.pageSize = val
      this.pageIndex = 1
      this.getGoods()
    },
  },
  mounted() {
    let query = this.$route.query
    this.purchaseId = Number(query.id)
    this.orderType = query.orderType
    if (!this.purchaseId) {
      this.dataError()
    } else {
      this.getKind()
      this.getBuyerList()
      this.getPositionList()
      this.getSupplierList()
      this.getDetail()
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
    pagination,
    goodsTable,
    templateImport,
    smartImport,
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
.iconMores {
  background-color: #fff !important;
  width: 32px;
  border: 1px solid #DCDFE6 !important;
  padding: 7px;
}
.el-form-item{
  margin-bottom: 15px;
}
</style>
