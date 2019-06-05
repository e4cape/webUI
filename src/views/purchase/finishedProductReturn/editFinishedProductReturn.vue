<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title fl">编辑成品退货出库</span>
        <span class="title fr">
          <el-button type="text" @click="newEndProduct" name="btnEdit">修改</el-button>
        </span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.ReturnCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}} {{detail.CreateTime | filterDateTime}}</td>
                <td class="tit">审核</td>
                <td v-if="detail.State === orderBasicState.Audit || detail.State === orderBasicState.Reject">{{detail.CheckUser}} {{detail.CheckTime | filterDateTime}}</td>
                <td v-else>-</td>
              </tr>
              <tr>
                
                <td class="tit">应付款</td>
                <td>{{detail.Preprice}}</td>
                <td class="tit">退货原因</td>
                <td>{{detail.ReasonTypeDv}}</td>
                <td class="tit">业务日期</td>
                <td>{{detail.ActualDate | filterDate}}</td>
              </tr>
              <tr>
                <td class="tit" v-if="$store.getters.user_session.CharacterType === characterType.Company">退货仓库</td>
                <td v-if="$store.getters.user_session.CharacterType === characterType.Company">{{detail.WarehouseName}} > {{detail.ShelfName}}</td>
                <td class="tit">备注</td>
                <td class="note" :colspan="$store.getters.user_session.CharacterType === characterType.Company ? 3 : 5">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="panel-hd">
          <span class="title">编辑采购入库单</span>
        </div>
        <div class="m-10">
          <el-input name="BarCode" v-model="enterCode" :maxlength="50" @keyup.enter.native="enterBarCode" style="width: 200px; margin-right: 10px;" placeholder="录入/扫描条码"></el-input>
          <el-button type="primary" name="btnEntry" @click="multiCodeVisible = true">批量录入</el-button>
          <el-button type="primary" @click="selectGoods" name="selectGoods">选择货品</el-button>
          <el-dropdown @command="openReiseDialog" name="btnMultiAudit">
            <el-button type="default">
              提单
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>成品进货入库</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <el-button
            name="btnImportant"
          >按模板导入货品</el-button>-->
        </div>
        <div class="goods-wrapper" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
          <div class="goods-left">
            <!-- 货品列表 -->
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
                <tr v-for="(item, index) in goodsData" :key="item.index" :class="{active:item.ItemId == itemId}" @click="rowSelect(item.GoodsId, item.ItemId)">
                  <td>{{indexTotalCount - indexPageSize * (indexPageIndex - 1) - index}}</td>
                  <td :title="item.BarCode">{{item.BarCode}}</td>
                  <td :title="item.GoodsName">{{item.GoodsName}}</td>
                  <td class="table-input">
                    <el-input-number v-model="item.Quantity" :controls="false" @blur="goodsQuantity(item)" style="width: 42px; text-align: center;"></el-input-number>
                  </td>
                  <td>
                    <span class="btn-link el-button--text" style="cursor: pointer; color: #da0000;" @click.prevent="goodsDel(item.ItemId)" name="btnGoodsDel">删除</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- 工具栏 -->
            <div class="toolsbar">
              <div class="myPagination-bar">
                <el-select filterable v-model="pageSize" placeholder="20" name="pageSize" style="height: 28px;">
                  <el-option v-for="(item, index) in paginationSizes" :key="index" :value="item"></el-option>
                </el-select>
                <div class="pagination-controller">
                  <button name="btnPrev" class="prev-btn" @click="prevPage" :disabled="pageIndex === 1" :class="{'isDisabled': pageIndex === 1}">
                    <i class="el-icon-arrow-left"></i>
                  </button>
                  <span class="current-page">{{pageIndex}}/{{pages}}</span>
                  <button name="btnNext" class="next-btn" @click="nextPage" :disabled="pageIndex === pages" :class="{'isDisabled': pageIndex === pages}">
                    <i class="el-icon-arrow-right"></i>
                  </button>
                </div>
                <span class="total">共{{totalCount}}条</span>
              </div>
              <div class="count-bar">
                <span class="fl">数量合计：{{detail.ItemQty}}</span>
                <span class="fr">
                  成本合计：
                  <b>￥{{$root.toFloat(detail.CostPrice)}}</b>
                </span>
              </div>
            </div>
          </div>
          <div class="goods-right">
            <!-- 货品详情 -->
            <div class="panel">
              <div class="panel-hd">
                <span class="title">货品详情</span>
              </div>
              <div class="panel-bd">
                <goods-details v-if="goodsId && goodsId != ''" :goodsId="goodsId" :ItemId="itemId" :apis="apis" :option="goodsOption" :modifyId="purchaseId" :isGoodsType="'String'"></goods-details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-button v-if="orderBasicState.Draft == detail.State || orderBasicState.Reject == detail.State" type="primary" @click="orderSubmit" :loading="$store.getters.is_loading" name="orderSubmit">提交审核</el-button>
      <el-button @click="$router.back(-1)">返回</el-button>
      <span class="end-right">
        <div>注：如果包含多个供应商或货品类别的条码，审核时根据供应商和货品类别自动拆成多个单据。</div>
        <div>注：一码一货的货品退货出库后将从库存中移除，条码可以在采购时重复使用。</div>
      </span>
    </div>
    <!-- 修改 -->
    <el-dialog v-if="newVisible" title="修改退货单" :visible.sync="newVisible" width="600px" :before-close="newOrderDialogColse">
      <el-form :model="editData" :rules="newOrderRules" ref="newOrder" lable-width="120px" class="item-lh-26" :inline="true">
        <div v-if="$store.getters.user_session.CharacterType === characterType.Company">
          <el-form-item label="退货仓库：" prop="WarehouseId">
            <el-select filterable name="WarehouseId" v-model="editData.WarehouseId" placeholder="请选择" @change="warehouseChange" :disabled="true">
              <el-option v-for="(item, index) in positionList" :key="index" :label="item.Value" :value="Number(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ShelfId">
            <el-select filterable v-model="editData.ShelfId" :disabled="true">
              <el-option v-for="(item, index) in shelfList" :key="index" :label="item.Value" :value="Number(item.Id)"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="退货原因：" prop="ReasonTypeDk">
          <el-select filterable name="ReasonTypeDk" v-model="editData.ReasonTypeDk" placeholder="请选择" @change="reasonTypeChange" :rules="rule">
            <el-option v-for="(item, index) in reasonsList" :key="index" :label="item.Value" :value="Number(item.Id)"></el-option>
          </el-select>
          <span class="icon-set-item" @click="reasonDialog=true" name="iconSetItem">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item label="业务日期：" prop="ActualDate">
          <el-date-picker :clearable="false" type="date" placeholder="选择日期" v-model="editData.ActualDate" style="width: 100%;" :picker-options="$store.getters.businessDate"></el-date-picker>
        </el-form-item>
        <el-form-item prop="Preprice" label="应付款：">
          <el-input name="Preprice" v-model="editData.Preprice" @keyup.native="editData.Preprice = $root.toFixed(editData.Preprice, 2, true)" maxlength="10"></el-input>
        </el-form-item>
        <div>
          <el-form-item label="备注" prop="Note">
            <el-input type="textarea" @blur="editData.Note = editData.Note.trim()" v-model="editData.Note" style="width: 300px" :maxlength="200"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="newDialogConfirm('newOrder')">确 定</el-button>
        <el-button @click="newOrderDialogColse">取 消</el-button>
      </span>
    </el-dialog>
    <!-- @module Dialog·新建分组 -->
    <dict-manage :visible.sync="reasonDialog" :dicts="reasonsList" dialogTitle="退货原因" :dictType="SettingDictionaryDictType.GoodsReturnOrderBasicReasonType" @listenDictSave="getReturn"></dict-manage>
    <!-- End Dialog·新建分组  -->
    <!-- 选择货品 -->
    <el-dialog v-if="selectGoodsVisible" title="选择货品" :visible.sync="selectGoodsVisible" width="1200px" :before-close="selectGoodsColse">
      <el-form :model="selectForm" ref="selectGoods" lable-width="120px" class="item-lh-26" :inline="true">
        <el-row class="search-box m-b-10" type="flex">
          <el-col>
            <el-form-item prop="StockCompareType">
              <el-select filterable name="StockCompareType" v-model="selectForm.StockCompareType" placeholder="所有库存" @change="onSearch">
                <el-option label="所有库存" :value="0"></el-option>
                <el-option v-for="(item, index) in stockCompareType.TypeArray" :key="index" :label="item.Value" :value="Number(item.KeyId)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="MaterialType">
              <el-select filterable name="MaterialType" v-model="selectForm.MaterialType" placeholder="所有材质" @change="onSearch">
                <el-option label="所有材质" :value="0"></el-option>
                <el-option v-for="(item, index) in materialType.TypeArray" :key="index" :label="item.Value" :value="Number(item.KeyId)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="CategoryType">
              <el-select filterable name="CategoryType" v-model="selectForm.CategoryType" placeholder="所有品类" @change="onSearch">
                <el-option label="所有品类" :value="0"></el-option>
                <el-option v-for="(item, index) in categoryType.TypeArray" :key="index" :label="item.Value" :value="Number(item.KeyId)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="GoldType">
              <el-select filterable name="GoldType" v-model="selectForm.GoldType" placeholder="所有成色" @change="onSearch">
                <el-option label="所有成色" :value="0"></el-option>
                <el-option v-for="(item, index) in goldType.TypeArray" :key="index" :label="item.Value" :value="Number(item.KeyId)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="FinanceType">
              <el-select filterable name="FinanceType" v-model="selectForm.FinanceType" placeholder="所有类别" @change="onSearch">
                <el-option label="所有类别" :value="0"></el-option>
                <el-option v-for="(item, index) in financeType.TypeArray" :key="index" :label="item.Value" :value="Number(item.KeyId)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="BarCode">
              <el-input name="BarCode" v-model="selectForm.BarCode" :maxlength="50" @keyup.enter.native="onSearch" placeholder="请输入条码">
                <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="selectData" element-loading-text="拼命加载中" @selection-change="selectGoodsCurrChange" v-loading="$store.getters.tb_loading">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="BarCode" label="条码" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="StyleCode" label="款号" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoodsName" label="货品名称" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="FinanceType" label="类别" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            {{financeType.Types[scope.row.FinanceType]}}
          </template>
        </el-table-column>
        <el-table-column label="货重" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{$root.toFloat(scope.row.Weight)}}</template>
        </el-table-column>
        <el-table-column label="净金重" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{$root.toFloat(scope.row.GoldWeight)}}</template>
        </el-table-column>
        <el-table-column prop="FinanceQty" label="账面库存" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="AvailableQty" label="可用库存" min-width="80" show-overflow-tooltip></el-table-column>
      </el-table>
      <pagination :pg="selectForm.PageIndex" :size="selectForm.PageSize" :total="selecTotal" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
      <span slot="footer" class="dialog-footer">
        <el-checkbox name="checked" class="fl" v-model="checked">带入可用库存</el-checkbox>
        <el-button type="primary" @click="confirmSelectGoods" :disabled="this.currentRow.length ? false : true">添 加</el-button>
        <el-button type="primary" @click="confirmSelectGoods('close')" :disabled="this.currentRow.length ? false : true">添加并关闭</el-button>
        <el-button @click="selectGoodsColse">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 提单 -->
    <el-dialog v-if="reiseVisible" title="选择成品采购单" :visible.sync="reiseVisible" width="1200px" :before-close="colseReise">
      <el-form :model="raiseForm" ref="selectReise" lable-width="120px" class="item-lh-26" :inline="true">
        <el-row class="search-box m-b-10" type="flex">
          <el-col>
            <el-form-item prop="PartnerName">
              <el-select filterable name="PartnerName" v-model="raiseForm.PartnerName" placeholder="所有供应商" @change="getReiseData">
                <el-option label="所有供应商" value></el-option>
                <template v-for="(item, index) in supplierList">
                <el-option
                  v-if="item.PartnerType == partnerType.Merchant || item.PartnerType == partnerType.Supplier"
                  :key="index"
                  :label="item.Value"
                  :value="String(item.Value)"
                ></el-option>
                </template>
              </el-select>
            </el-form-item>
            <el-form-item prop="IntakeCode">
              <el-input name="IntakeCode" v-model="raiseForm.IntakeCode" :maxlength="50" @keyup.enter.native="getReiseData" placeholder="请输入单据编号">
                <el-button name="btnSearch" slot="append" class="el-icon-search" @click="getReiseData"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="raiseData" element-loading-text="拼命加载中" highlight-current-row @current-change="handleCurrentChange" v-loading="$store.getters.tb_loading">
        <el-table-column prop="IntakeCode" label="单据编号" min-width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PartnerName" label="供应商" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime}}</template>
        </el-table-column>
        <el-table-column prop="ChargeUser" label="采购员" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="IntakeQty" label="采购数量" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="最后操作时间" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CheckTime | filterDateTime}}</template>
        </el-table-column>
      </el-table>
      <pagination :pg="raiseForm.PageIndex" :size="raiseForm.PageSize" :total="raiseTotal" @currentChange="resisePageChange" @sizeChange="resisePageSizeChange"></pagination>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmReise">确 定</el-button>
        <el-button @click="colseReise">取 消</el-button>
      </span>
    </el-dialog>
    <multi-code-enter :visible.sync="multiCodeVisible" @listenMultiCodeEnter="listenMultiCodeEnter"></multi-code-enter>
  </div>
</template>

<script>
import {
  GoodsIntakeOrderBasicState,
  FinanceType,
  SettingEnumeratorEnumeratorType,
  SettingDictionaryDictType,
  StockCompareType,
  MaterialType,
  CategoryType,
  GoldType,
  GoodsReturnOrderBasicState,
  SettingCustomizedFieldOrderType,
  SettingCustomizedFieldLargeType,
  GoodsBasicState
} from '@/enums/stocking.js'
import {
  CharacterType,
  PurchaseType,
  YNStatus,
  EnableState,
  PartnerType
} from '@/enums/common.js'
import {
  STOCKING_API_GOODS_RETURN_ORDER_ITEM_DELETE,
  STOCKING_API_GOODS_BASIC_GET,
  STOCKING_API_GOODS_RETURN_ORDER_BASIC_GET,
  STOCKING_API_GOODS_RETURN_ORDER_ITEM_GETS,
  STOCKING_API_GOODS_RETURN_ORDER_BASIC_WAIT,
  STOCKING_API_GOODS_RETURN_ORDER_BASIC_UPDATE,
  STOCKING_API_GOODS_RETURN_ORDER_ITEM_CREATE,
  STOCKING_API_GOODS_INTAKE_ORDER_BASIC_GETS,
  STOCKING_API_GOODS_STOCK_SHELF_REQS,
  STOCKING_API_GOODS_STOCK_DESK_REQS,
  STOCKING_API_GOODS_RETURN_ORDER_ITEM_SELECTINTAKECREATE,
  STOCKING_API_GOODS_RETURN_ORDER_ITEM_UPDATE
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST,
  MERCHANT_API_DROPDOWN_USERLIST,
  MERCHANT_API_DROPDOWN_WAREHOUSEBASICLIST,
  MERCHANT_API_DROPDOWN_PARTNERBASICLIST,
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST
} from '@/apis/merchant.js'
import pagination from '@/components/pagination'
import goodsDetails from '@/components/purchase/goodsDetails'
import dayjs from 'dayjs'
import dictManage from '@/components/erp/dictManage'
import multiCodeEnter from '@/components/erp/multiCodeEnter'
export default {
  data() {
    return {
      partnerType: PartnerType,
      materialType: MaterialType,
      categoryType: CategoryType,
      goldType: GoldType,
      stockCompareType: StockCompareType,
      SettingDictionaryDictType,
      apis: STOCKING_API_GOODS_BASIC_GET,
      characterType: CharacterType,
      YNStatus,
      financeType: FinanceType,
      orderBasicState: GoodsReturnOrderBasicState,
      purchaseType: PurchaseType,
      detail: {}, // 基本信息
      editData: {}, // 修改表单
      goodsData: [], // 货品数据
      paginationSizes: [10, 15, 20], // 分页数据条数数组
      pageSize: 10, // 分页数据条数
      pageIndex: 1, // 当前页面位置
      totalCount: 0, // 总数据条数
      indexPageSize: 10, // 列表序号，分页数据条数
      indexPageIndex: 1, // 列表序号，当前页面位置
      indexTotalCount: 0, // 列表序号，总数据条数
      purchaseId: '',
      orderType: '',
      goodsId: '', // 选中的货品id
      tabTable: 'goods',
      itemId: '',
      newOrderTitle: '', // 编辑弹窗标题
      newVisible: false, // 编辑弹窗
      kind: [], // 种类
      buyerList: [], // 采购员下拉
      positionList: [], // 位置仓库下拉
      shelfList: [], // 货架下拉
      supplierList: [], // 供应商下拉
      reasonsList: [], // 退货原因下拉
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
      selectGoodsVisible: false, // 选择货品弹窗
      selectForm: {
        State: GoodsBasicState.Audit,
        WarehouseId: 0,
        StockCompareType: StockCompareType.AvailableQtyThanZero,
        MaterialType: 0,
        CategoryType: 0,
        GoldType: 0,
        FinanceType: 0,
        BarCode: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }, // 选择货品
      selecTotal: 0, // 选择货品总数
      selectData: [], // 选择货品数据
      currentRow: [], // 选中的货品
      reiseVisible: false, // 提单弹窗
      raiseData: [], // 提单数据
      raiseTotal: 0, // 提单数据总数
      raiseForm: {
        PartnerName: '',
        IntakeCode: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        State: GoodsIntakeOrderBasicState.Audit,
        PageIndex: 1,
        PageSize: 20
      },
      raiseOrderRow: null, // 提单选中
      enterCode: '',
      multiCodeVisible: false, // 批量录入弹窗
      goodsOption: {
        OrderType:
          SettingCustomizedFieldOrderType.StockingCloudGoodsIntakeOrderBasic,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        SmallType: 0,
        KindTypeEk: 1,
        IsEnable: YNStatus.Yes
      },
      checked: true
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
      STOCKING_API_GOODS_RETURN_ORDER_BASIC_GET({
        ReturnId: this.purchaseId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.editData = res.data.Data
          this.detail.Preprice = Number(this.$root.toFloat(res.data.Data.Preprice))
          if (
            this.$store.getters.user_session.CharacterType ===
            CharacterType.Company
          ) {
            this.selectForm.WarehouseId = res.data.Data.WarehouseId
            this.selectForm.ShelfId = res.data.Data.ShelfId
          }
          this.editData = Object.assign({}, res.data.Data)
        }
      })
    },
    getGoods() {
      STOCKING_API_GOODS_RETURN_ORDER_ITEM_GETS({
        ReturnId: this.purchaseId,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsAsced: YNStatus.No,
        OrderBy: 0,
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.totalCount = res.data.Data.Count || 0
          this.goodsId = res.data.Data.Count && res.data.Data.Rows[0].GoodsId
          this.itemId = res.data.Data.Count && res.data.Data.Rows[0].ItemId
          this.indexPageSize = this.pageSize
          this.indexPageIndex = this.pageIndex
          this.indexTotalCount = this.totalCount
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    rowSelect(goodsId, itemId) {
      this.goodsId = goodsId
      this.itemId = itemId
    },
    goodsQuantity(data) {
      const para = {
        Quantity: data.Quantity,
        ReturnId: data.ReturnId,
        ItemId: data.ItemId
      }
      STOCKING_API_GOODS_RETURN_ORDER_ITEM_UPDATE(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.getDetail()
          this.getGoods()
        }
      })
    },
    prevPage() {
      this.pageIndex -= 1
    },
    nextPage() {
      this.pageIndex += 1
    },
    // 打开选择货品弹窗
    selectGoods() {
      if (!this.purchaseId) {
        return false
      }
      this.selectGoodsVisible = true
      this.onSearch()
    },
    // 获取选择货品数据
    onSearch() {
      if (
        this.$store.getters.user_session.CharacterType === CharacterType.Company
      ) {
        STOCKING_API_GOODS_STOCK_SHELF_REQS(this.selectForm).then(res => {
          if (res.data.Code == 'CORRECT') {
            this.selectData = res.data.Data.Rows
            this.selecTotal = res.data.Data.Count
          }
        })
      }
      if (
        this.$store.getters.user_session.CharacterType === CharacterType.Store
      ) {
        STOCKING_API_GOODS_STOCK_DESK_REQS({...this.selectForm, DeskId: this.$store.getters.user_session.DeskId}).then(res => {
          if (res.data.Code == 'CORRECT') {
            this.selectData = res.data.Data.Rows
            this.selecTotal = res.data.Data.Count
          }
        })
      }
    },
    // 选中货品
    selectGoodsCurrChange(val) {
      this.currentRow = val
    },
    // 关闭选择货品
    selectGoodsColse() {
      this.$refs['selectGoods'].resetFields()
      this.selectGoodsVisible = false
      this.checked = true
      this.currentRow = []
    },
    // 确定添加货品
    confirmSelectGoods(close) {
      if (this.currentRow.length) {
        const item = this.currentRow.map(item => {
          return { BarCode: item.BarCode, Quantity: this.checked ? item.AvailableQty : 1}
        })
        const para = {
          ReturnId: this.purchaseId,
          Items: item
        }
        this.createOrder(para, close)
      } else {
        this.$message.error('请选择货品')
      }
    },
    listenMultiCodeEnter(data) {
      if (data.length) {
        const para = {
          ReturnId: this.purchaseId,
          items: data
        }
        this.createOrder(para)
      }
    },
    enterBarCode() {
      if (!this.enterCode) {
        return
      }
      const arr = [{ BarCode: this.enterCode, Quantity: 1 }]
      const para = {
        ReturnId: this.purchaseId,
        Items: arr
      }
      this.createOrder(para)
    },
    createOrder(para, close) {
      STOCKING_API_GOODS_RETURN_ORDER_ITEM_CREATE(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.enterCode = ''
          this.getGoods()
          this.getDetail()
          this.multiCodeVisible = false
          if (close == 'close') {
            this.selectGoodsColse()
          }
        }
        this.enterCode = ''
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    pageChange(val) {
      // 切换当前页
      this.selectForm.PageIndex = val
      this.onSearch()
    },
    pageSizeChange(val) {
      // 切换每页显示条数
      this.selectForm.PageSize = val
      this.selectForm.PageIndex = 1
      this.onSearch()
    },
    resisePageChange(val) {
      // 切换当前页
      this.raiseForm.PageIndex = val
      this.getReiseData()
    },
    resisePageSizeChange(val) {
      // 切换每页显示条数
      this.raiseForm.PageSize = val
      this.raiseForm.PageIndex = 1
      this.getReiseData()
    },
    openReiseDialog() {
      this.reiseVisible = true
      this.getReiseData()
    },
    handleCurrentChange(val) {
      this.raiseOrderRow = val
    },
    // 获取成品采购单数据
    getReiseData() {
      STOCKING_API_GOODS_INTAKE_ORDER_BASIC_GETS(this.raiseForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.raiseData = res.data.Data.Rows
          this.raiseTotal = res.data.Data.Count
        }
      })
    },
    // 提单成功
    confirmReise() {
      if (this.raiseOrderRow) {
        const para = {
          ReturnId: this.purchaseId,
          IntakeId: this.raiseOrderRow.IntakeId
        }
        STOCKING_API_GOODS_RETURN_ORDER_ITEM_SELECTINTAKECREATE(para).then(
          res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '提单成功',
                type: 'success'
              })
              this.getDetail()
              this.getGoods()
              this.colseReise()
            }
          }
        )
      } else {
        this.$message.error('请选择成品采购单')
      }
    },
    colseReise() {
      this.raiseForm.PageIndex = 1
      this.raiseForm.PageSize = 20
      this.$refs['selectReise'].resetFields()
      this.reiseVisible = false
      this.raiseOrderRow = null
    },
    // 提交审核
    orderSubmit() {
      if (this.goodsData.length) {
        this.$store.commit('SET_BTN_LOADING', true)
        STOCKING_API_GOODS_RETURN_ORDER_BASIC_WAIT({
          ReturnId: this.purchaseId,
          CheckNote: ''
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            this.$store.commit('SET_BTN_LOADING', false)
            this.$router.push('/purchase/finishedProductReturn/index')
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
          STOCKING_API_GOODS_RETURN_ORDER_ITEM_DELETE({
            ItemId: itemId,
            ReturnId: this.purchaseId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getGoods()
              this.getDetail()
            }
            this.$store.commit('SET_FULL_LOADING', false)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 打开修改弹窗
    newEndProduct() {
      this.newOrderTitle = '编辑成品入库单'
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
      this.selectForm.PageIndex = 1
      this.selectForm.PageSize = 20
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
            WarehouseId: Number(this.editData.WarehouseId),
            ActualDate: dayjs(this.editData.ActualDate).format('YYYY-MM-DD'),
            ReasonTypeDk: Number(this.editData.ReasonTypeDk),
            ShelfId: Number(this.editData.ShelfId),
            Preprice: this.$root.toInt(this.editData.Preprice)
          }
          STOCKING_API_GOODS_RETURN_ORDER_BASIC_UPDATE(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$refs[formName].resetFields()
              this.shelfList = []
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.newVisible = false
              this.getDetail()
            }
          })
        }
      })
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
        Shelf.Childrens.length == 1 ? String(Shelf.Childrens[0].Id) : ''
      this.shelfList = Shelf.Childrens
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
      MERCHANT_API_DROPDOWN_WAREHOUSEBASICLIST({ HasShelf: this.YNStatus.Yes }).then(
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
                return item.Id == this.editData.WarehouseId
              })
            this.shelfList = Shelf.Childrens.length && Shelf.Childrens
          }
        }
      )
    },
    // 退货原因
    reasonTypeChange() {
      this.reasonsList.map(item => {
        if (item.Id == this.editData.ReasonTypeDk) {
          this.editData.ReasonTypeDv = item.Value
        }
      })
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
    }
  },
  mounted() {
    let query = this.$route.query
    this.purchaseId = Number(query.id)
    if (!this.purchaseId) {
      this.dataError()
    } else {
      this.getKind()
      this.getBuyerList()
      this.getPositionList()
      this.getSupplierList()
      this.getReturn()
      this.getDetail()
      this.getGoods()
    }
    this.$store.dispatch('GET_SETTLE_DATE')
    // this.getStoreAllType()
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
    dictManage,
    multiCodeEnter
  }
}
</script>

<style lang="scss" >
.table-input {
  .el-input {
    .el-input__inner {
      padding: 5px !important;
    }
  }
}
</style>

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
  height: 65px;
}
.el-input--mini .el-input__inner {
  height: 28px;
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
.search-box {
  padding: 0;
  border: none;
}
.end-right {
  float: right;
  color: #999;
  line-height: 18px;
  text-align: right;
}
.el-form-item{
  margin-bottom: 15px;
}
</style>
