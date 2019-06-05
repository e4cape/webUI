<template>
  <div class="content">
    <div class="panel" v-loading="$store.getters.tb_loading">
      <div class="panel-hd">
        <span class="title">编辑分秤单({{detail.KindTypeEv}})</span>
        <el-button name="btnEdit" @click="editDetail" class="el-back" type="text">修改</el-button>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.ChangeCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateMinutes}}</td>
                <td class="tit">审核</td>
                <td
                  v-if="detail.State === HalfChangeOrderBasicState.Audit || detail.State === HalfChangeOrderBasicState.Reject"
                >{{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime | filterDateMinutes}}</td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">供应商</td>
                <td>{{detail.PartnerName}}</td>
                <td class="tit">半成品数量</td>
                <td>{{detail.Quantity1}}</td>
                <td class="tit">半成品重量</td>
                <td>{{$root.toFloat(detail.Weight1, 3)}}g</td>
              </tr>
              <tr>
                <td class="tit">业务日期</td>
                <td>{{detail.ActualDate | filterDate}}</td>
                <td class="tit">半成品位置</td>
                <td>{{detail.WarehouseName}} > {{detail.ShelfName}}</td>
                <td class="tit">备注</td>
                <td>{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="checkPage-hd">
          <span class="order-list-text">
            <el-button name="btnAddProduct" type="primary" @click="showAddHalf">添加半成品</el-button>
          </span>
          <div class="fr">
            <span class="detail-info-num-item">
              分秤总数量：
              <b class="num">{{detail.Quantity2}}</b>
            </span>
            <span class="detail-info-num-item">
              分秤总重量：
              <b class="num">{{$root.toFloat(detail.Weight2, 3)}}g</b>
            </span>
            <span class="detail-info-num-item">
              分秤差异：
              <b
                class="num"
              >{{detail.Quantity3 > 0 ? '+' + detail.Quantity3 : detail.Quantity3}}件/{{detail.Weight3 > 0 ? '+' + $root.toFloat(detail.Weight3, 3) : $root.toFloat(detail.Weight3, 3)}}g</b>
            </span>
          </div>
        </div>
        <div
          class="goods-wrapper"
          v-loading="$store.getters.tb_loading"
          element-loading-text="拼命加载中"
        >
          <div class="goods-left">
            <!-- 货品列表 -->
            <table class="goods-table" cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th>半成品名称</th>
                  <th>选货数量</th>
                  <th>选货重量</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  name="rowSelect"
                  v-for="(item, index) in goodsData"
                  :key="index"
                  :class="{active:item.HalfItid === halfForm.HalfItid}"
                  @click="rowSelect(item)"
                >
                  <td :title="item.StoreBarCode">{{item.HalfName}}</td>
                  <td :title="item.GoodsName">{{item.Quantity1}}</td>
                  <td>{{$root.toFloat(item.Weight1, 3)}}g</td>
                  <td>
                    <el-button
                      size="small"
                      type="text"
                      :key="item.HalfItid"
                      @click.prevent="goodsDel($event, item)"
                      name="btnGoodsDel"
                    >删除</el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- 工具栏 -->
            <div class="toolsbar">
              <div class="myPagination-bar">
                <el-select
                  filterable
                  v-model="parameters.PageSize"
                  placeholder="20"
                  name="pageSize"
                  @change="paginationSizesChange"
                >
                  <el-option v-for="(item, index) in paginationSizes" :key="index" :value="item"></el-option>
                </el-select>
                <div class="pagination-controller">
                  <button
                    name="btnPrev"
                    class="prev-btn"
                    @click="prevPage"
                    :disabled="parameters.PageIndex === 1"
                    :class="{'isDisabled': parameters.PageIndex === 1}"
                  >
                    <i class="el-icon-arrow-left"></i>
                  </button>
                  <span class="current-page">{{parameters.PageIndex}}/{{pages}}</span>
                  <button
                    name="btnNext"
                    class="next-btn"
                    @click="nextPage"
                    :disabled="parameters.PageIndex === pages"
                    :class="{'isDisabled': parameters.PageIndex === pages}"
                  >
                    <i class="el-icon-arrow-right"></i>
                  </button>
                </div>
                <span class="total">共{{totalCount}}条</span>
              </div>
              <div class="count-bar">
                <span class="fl">总数量：{{detail.Quantity1}}</span>
                <span class="fr">
                  总重量：
                  <b>{{$root.toFloat(detail.Weight1, 3)}}g</b>
                </span>
              </div>
            </div>
          </div>
          <div class="goods-right">
            <!-- 货品详情 -->
            <div class="p-10">
              <el-button name="btnImport" type="primary" @click="importTmp('template')">按模板导入</el-button>
              <el-button name="btnImportSmart" type="primary" @click="importTmp('smart')">智能导入</el-button>
            </div>
            <goods-table
              v-if="halfForm.HalfItid"
              :goodsData="data"
              :option="option"
              :loading="isLoading"
              :fieldData="fieldData"
              @delete="deleteShow"
              @changeSave="changeSave"
              ref="goodsTable"
            ></goods-table>
            <pagination
              :pg="halfForm.PageIndex"
              :size="halfForm.PageSize"
              :total="total"
              @currentChange="currentChange"
              @sizeChange="sizeChange"
            ></pagination>
            <div class="check-page">
              <span class="detail-info-num-item">
                分秤数量：
                <b class="num">{{orderInfo.Quantity2}}</b>
              </span>
              <span class="detail-info-num-item">
                分秤重量：
                <b class="num">{{$root.toFloat(orderInfo.Weight2, 3)}}g</b>
              </span>
              <span class="detail-info-num-item">
                分秤差异：
                <b
                  class="num"
                >{{orderInfo.Quantity3 > 0 ? ' +' + orderInfo.Quantity3 : orderInfo.Quantity3}}件/{{orderInfo.Weight3 > 0 ? '+' + $root.toFloat(orderInfo.Weight3, 3) : $root.toFloat(orderInfo.Weight3, 3)}}g</b>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-button name="save" type="primary" @click="save" v-if="isSaved" :loading="saveLoading">保存</el-button>
      <el-button type="primary" v-else @click="submit">提交审核</el-button>
      <el-button @click="$router.back()" name="btnBack">返回</el-button>
      <span class="end-right">注：分秤后货品将转换为成品入库</span>
    </div>
    <!-- 修改 -->
    <el-dialog :title="'编辑(' + detail.KindTypeEv + ')'" :visible.sync="editVisible" width="500px">
      <el-form :model="detail" label-width="100px" :rules="editRules" ref="editForm">
        <el-form-item label="半成品位置：" prop="WarehouseId" class="location">
          <el-select filterable name="WarehouseId" v-model="detail.WarehouseId" :disabled="true">
            <template v-for="item in $store.getters.wareHouses">
              <el-option
                v-if="item.State === YNStatus.Yes"
                :key="item.Id"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="ShelfId" class="location shelf">
          <el-select filterable name="ShelfId" v-model="detail.ShelfId" :disabled="true">
            <template v-for="item in shelf">
              <el-option
                v-if="item.State === YNStatus.Yes"
                :key="item.Id"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商：" prop="PartnerId">
          <el-select filterable name="PartnerId" v-model="detail.PartnerId">
            <template v-for="item in $store.getters.suppliers">
              <el-option
                v-if="(item.PartnerType == partnerType.Merchant || item.PartnerType == partnerType.Supplier)"
                :key="item.Id"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="业务日期：" prop="ActualDate">
          <el-date-picker
            name="ActualDate"
            v-model="detail.ActualDate"
            value-format="yyyy-MM-dd"
            :picker-options="$store.getters.businessDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注：" prop="Note">
          <el-input name="Note" type="textarea" v-model="detail.Note" maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnSave" type="primary" @click="saveEdit('editForm')">保存</el-button>
        <el-button name="btnCancel" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
    <!-- End 修改 -->
    <!-- 添加半成品 -->
    <el-dialog
      title="添加半成品"
      :visible.sync="addProductVisible"
      width="1050px"
      :before-close="closeAdd"
    >
      <el-form :model="addForm" :inline="true" ref="addForm">
        <el-form-item>
          <el-select
            filterable
            name="StockCompareType"
            v-model="addForm.StockCompareType"
            @change="addSearch"
          >
            <el-option label="所有库存" :value="0"></el-option>
            <el-option
              v-for="item in StockCompareType.TypeArray"
              :key="item.KeyId"
              :label="item.Value"
              :value="item.KeyId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            filterable
            name="HalfClassDk"
            v-model="addForm.HalfClassDk"
            @change="addSearch"
          >
            <el-option label="所有分类" :value="0"></el-option>
            <el-option
              v-for="item in halfClassify"
              :key="item.Id"
              :label="item.Value"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            filterable
            name="CategoryType"
            v-model="addForm.CategoryType"
            @change="addSearch"
          >
            <el-option label="所有品类" :value="0"></el-option>
            <el-option
              v-for="item in $store.getters.categoryType.TypeArray"
              :key="item.Id"
              :label="item.Value"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select filterable name="GoldType" v-model="addForm.GoldType" @change="addSearch">
            <el-option label="所有成色" :value="0"></el-option>
            <el-option
              v-for="item in $store.getters.goldType.TypeArray"
              :key="item.Id"
              :label="item.Value"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            name="HalfName"
            v-model="addForm.HalfName"
            placeholder="名称"
            @keyup.enter.native="addSearch"
          >
            <el-button name="btnSearch" slot="append" class="el-icon-search" @click="addSearch"></el-button>
          </el-input>
        </el-form-item>
        <el-table
          :data="halfData"
          element-loading-text="拼命加载中"
          ref="halfData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column
            prop="HalfName"
            fixed
            label="半成品名称"
            min-width="120"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="HalfClassDv" label="半成品分类" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="AvailableQty" label="库存数量" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="AvailableWgt" label="库存重量" min-width="80" show-overflow-tooltip>
            <template slot-scope="scope">{{$root.toFloat(scope.row.AvailableWgt, 3)}}</template>
          </el-table-column>
          <el-table-column prop="Quantity" label="选货数量" min-width="80">
            <template slot-scope="scope">
              <!-- <el-input-number v-model="scope.row.Quantity" :precision="0" @focus="$refs.halfData.toggleRowSelection(scope.row, true)" :controls="false" style="width: 120px"></el-input-number> -->
              <el-input
                name="Quantity"
                v-model="scope.row.Quantity"
                @focus="$refs.halfData.toggleRowSelection(scope.row, true)"
                @keyup.native="scope.row.Quantity = $root.toFixed(scope.row.Quantity, 0)"
                style="width: 120px"
                maxlength="8"
              ></el-input>
            </template>
            <el-form-item></el-form-item>
          </el-table-column>
          <el-table-column prop="Weight" label="选货重量" min-width="80">
            <template slot-scope="scope">
              <!-- <el-input-number v-model="scope.row.Weight" :precision="2" @focus="$refs.halfData.toggleRowSelection(scope.row, true)" :controls="false" style="width: 120px"></el-input-number> -->
              <el-input
                name="Weight"
                v-model="scope.row.Weight"
                @focus="$refs.halfData.toggleRowSelection(scope.row, true)"
                @keyup.native="scope.row.Weight = $root.toFixed(scope.row.Weight, 3)"
                style="width: 120px"
                maxlength="10"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <!-- 分页 -->
      <pagination
        :pg="addForm.PageIndex"
        :size="addForm.PageSize"
        :total="addTotal"
        @currentChange="addCurrentChange"
        @sizeChange="addSizeChange"
      ></pagination>
      <!-- End 分页 -->
      <div slot="footer" class="dialog-footer">
        <el-button name="btnAdd" type="primary" @click="addProduct(true)">添加</el-button>
        <el-button name="btnAddClose" @click="addProduct(false)">添加并关闭</el-button>
        <el-button name="btnClose" @click="closeAdd">关闭</el-button>
      </div>
    </el-dialog>
    <!-- End 添加半成品 -->
    <!-- @module 导入货品 -->
    <template-import
      :visible.sync="templateVisible"
      :option="importOption"
      :root="$root.filePaths.STOCKING_PURCHASE + '/halfChangeOut'"
      @submit="importSubmit"
    ></template-import>
    <!-- End 导入货品 -->
    <!-- End 智能导入货品 -->
    <smart-import
      :visible.sync="smartVisible"
      :option="importOption"
      :root="$root.filePaths.STOCKING_PURCHASE + 'halfChangeOut'"
      @submit="submits"
      :smartImportOrderType="SettingAiimportTempletOrderType.StockingCloudHalfChangeOrderBasic"
    ></smart-import>
    <!-- @module 智能导入货品 -->
    <!-- End 智能导入货品 -->
    <import-error-table v-if="errorVisible" :visible.sync="errorVisible" :errorInfo="errorInfo"></import-error-table>
  </div>
</template>

<script>
import {
  StockCompareType,
  SettingAiimportTempletOrderType,
  SettingDictionaryDictType,
  SettingCustomizedFieldType,
  SettingCustomizedFieldSmallType,
  SettingCustomizedFieldOrderType,
  SettingCustomizedFieldLargeType,
  HalfChangeOrderBasicState
} from '@/enums/stocking'
import { YNStatus, EnableState, PartnerType } from '@/enums/common'
import {
  STOCKING_API_HALF_CHANGE_ORDER_BASIC_GET,
  STOCKING_API_HALF_CHANGE_ORDER_HALF_GETS,
  STOCKING_API_HALF_STOCK_SHELF_REQS,
  STOCKING_API_HALF_CHANGE_ORDER_GOODS_GETS,
  STOCKING_API_HALF_CHANGE_ORDER_BASIC_UPDATE,
  STOCKING_API_HALF_CHANGE_ORDER_HALF_CREATE,
  STOCKING_API_HALF_CHANGE_ORDER_BASIC_WAIT,
  STOCKING_API_HALF_CHANGE_ORDER_HALF_DELETE,
  STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS,
  STOCKING_API_HALF_CHANGE_ORDER_GOODS_CREATE,
  STOCKING_API_HALF_CHANGE_ORDER_GOODS_UPDATE,
  STOCKING_API_HALF_CHANGE_ORDER_GOODS_DELETE,
  STOCKING_API_HALF_CHANGE_ORDER_GOODS_TIMPORT,
  STOCKING_API_HALF_CHANGE_ORDER_GOODS_AIMPORT
} from '@/apis/stocking.js'
import { MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST } from '@/apis/merchant'
import pagination from '@/components/pagination'
import templateImport from '@/components/erp/templateImport'
import smartImport from '@/components/erp/smartImport'
import goodsTable from '@/components/purchase/goodsTable'
import importErrorTable from '@/components/erp/importErrorTable'

export default {
  data() {
    return {
      HalfChangeOrderBasicState,
      StockCompareType,
      YNStatus,
      SettingCustomizedFieldOrderType,
      SettingAiimportTempletOrderType,
      SettingCustomizedFieldLargeType,
      partnerType: PartnerType,
      goodsData: [], // 货品数据
      paginationSizes: [10, 15, 20], // 分页数据条数数组
      parameters: {
        ChangeId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageSize: 20, // 分页数据条数
        PageIndex: 1 // 当前页面位置
      },
      totalCount: 0, // 总数据条数
      halfForm: {
        HalfItid: '',
        ChangeId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageSize: 20, // 分页数据条数
        PageIndex: 1 // 当前页面位置
      },
      total: 0,
      purchaseId: '',
      detail: {},
      orderInfo: {},
      editVisible: false,
      shelf: [],
      editRules: {
        WarehouseId: {
          required: true,
          message: '请选择入库位置',
          trigger: 'change'
        },
        ShelfId: {
          required: true,
          message: '请选择货架位置',
          trigger: 'change'
        },
        PartnerId: {
          required: true,
          message: '请选择供应商',
          trigger: 'change'
        },
        ActualDate: {
          required: true,
          message: '请选择业务日期',
          trigger: 'change'
        }
      },
      props: {
        value: 'Id',
        label: 'Value',
        children: 'Childrens'
      },
      data: [],
      halfData: [], // 半成品
      templateVisible: false,
      smartVisible: false,
      addProductVisible: false,
      addForm: {
        StockCompareType: StockCompareType.AvailableQtyThanZero,
        HalfName: '',
        WarehouseId: 0,
        ShelfId: 0,
        KindTypeEk: 0,
        HalfClassDk: 0,
        CategoryType: 0,
        GoldType: 0,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      importOption: {
        OrderType:
          SettingCustomizedFieldOrderType.StockingCloudHalfChangeOrderBasic,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        SmallType: SettingCustomizedFieldSmallType.Basic,
        KindTypeEk: 1,
        IsEnable: EnableState.Enable
      },
      option: {
        OrderType:
          SettingCustomizedFieldOrderType.StockingCloudHalfChangeOrderBasic,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        SmallType: SettingCustomizedFieldSmallType.Basic,
        KindTypeEk: 1,
        IsEnable: EnableState.Enable
      },
      addTotal: 0,
      addVisible: false, // 插入空白行弹窗
      selectedHalf: [],
      addLineForm: {
        rowsNum: 1,
        local: '1'
      }, // 空白行参数
      copyVisible: false, // 删除当前行弹窗
      copyLineForm: {
        rowsNum: 1,
        local: '1',
        current: 1
      }, // 复制行参数
      halfClassify: [], // 分类
      handleRow: {}, // 操作的数据
      selectedRule: true, // 选择验证
      currentRow: {},
      isLoading: false, // 自定义列loading
      fieldData: [], // 自定义列
      ntime: '', // 当前时间
      btime: '', // 月结开始时间
      etime: '', // 月结结束时间
      isSaved: false,
      saveLoading: false,
      isRet: true,
      errorVisible: false,
      errorInfo: ''
    }
  },
  computed: {
    pages() {
      return (
        (this.totalCount % this.parameters.PageSize === 0
          ? this.totalCount / this.parameters.PageSize
          : parseInt(this.totalCount / this.parameters.PageSize) + 1) || 1
      )
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.parameters.ChangeId = this.halfForm.ChangeId = query.id * 1
      if (!this.parameters.ChangeId) {
        this.dataError()
      } else {
        this.getDetail()
      }
    },
    editDetail() {
      this.editVisible = true
      let shelf = this.$store.getters.wareHouses.find(
        item => item.Id === this.detail.WarehouseId
      )
      this.shelf = shelf ? shelf.Childrens : []
    },
    dataError(msg) {
      this.$confirm(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },
    saveEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          STOCKING_API_HALF_CHANGE_ORDER_BASIC_UPDATE(this.detail).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.getDetail()
              this.$message.success('修改成功')
              this.editVisible = false
            }
          })
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.$refs.editForm.resetFields()
      this.editVisible = false
    },
    getDetail() {
      STOCKING_API_HALF_CHANGE_ORDER_BASIC_GET({
        ChangeId: this.parameters.ChangeId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data || {}
          this.option.KindTypeEk = this.detail.KindTypeEk
          this.importOption.KindTypeEk = this.detail.KindTypeEk
          this.getGoods()
        }
      })
    },
    getGoods() {
      STOCKING_API_HALF_CHANGE_ORDER_HALF_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.totalCount = res.data.Data.Count || 0
          this.halfForm.HalfItid =
            this.goodsData &&
            this.goodsData.length &&
            this.goodsData[0].HalfItid
          this.orderInfo =
            this.goodsData && this.goodsData.length && this.goodsData[0]
          if (this.halfForm.HalfItid) {
            this.getHalfData()
          }
        } else {
          this.$message.error(res.data.Message)
          this.goodsData = []
        }
      })
    },
    getHalfData() {
      this.isLoading = true
      STOCKING_API_HALF_CHANGE_ORDER_GOODS_GETS(this.halfForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
          this.getField()
        }
      })
    },
    getField() {
      STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS(this.option).then(res => {
        this.isLoading = false
        if (res.data.Code === 'CORRECT') {
          this.fieldData = res.data.Data.Rows || []
        }
      })
    },
    rowSelect(item) {
      this.halfForm.HalfItid = item.HalfItid
      this.orderInfo = item
      this.getHalfData(item)
    },
    paginationSizesChange() {
      this.parameters.PageIndex = 1
      this.getGoods()
    },
    prevPage() {
      this.parameters.PageIndex -= 1
      this.getGoods()
    },
    nextPage() {
      this.parameters.PageIndex += 1
      this.getGoods()
    },
    handleSelectionChange(val) {
      this.selectedHalf = val
    },
    currentChange(val) {
      // 切换当前页
      this.halfForm.PageIndex = val
      this.getHalfData()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.halfForm.PageIndex = 1
      this.halfForm.PageSize = val
      this.getHalfData()
    },
    goodsDel($event, item) {
      $event.currentTarget.blur()
      this.$confirm('确定删除此货品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          STOCKING_API_HALF_CHANGE_ORDER_HALF_DELETE({
            HalfItid: item.HalfItid,
            ChangeId: item.ChangeId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.getDetail()
            } else {
              this.$message.error(res.data.Message)
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
    showAddHalf() {
      this.addProductVisible = true
      this.getHalfClass()
      this.getAddHalf()
    },
    getAddHalf() {
      this.addForm.WarehouseId = this.detail.WarehouseId
      this.addForm.ShelfId = this.detail.ShelfId
      this.addForm.KindTypeEk = this.detail.KindTypeEk
      STOCKING_API_HALF_STOCK_SHELF_REQS(this.addForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          var arr = res.data.Data.Rows || []
          arr.forEach(item => {
            item.Quantity = ''
            item.Weight = ''
          })
          this.halfData = arr
          this.addTotal = res.data.Data.Count
        }
      })
    },
    addSearch() {
      this.addForm.PageIndex = 1
      this.getAddHalf()
    },
    addCurrentChange(val) {
      // 切换当前页
      this.addForm.PageIndex = val
      this.getAddHalf()
    },
    addSizeChange(val) {
      // 切换每页显示条数
      this.addForm.PageIndex = 1
      this.addForm.PageSize = val
      this.getAddHalf()
    },
    addProduct(flag) {
      let selectForm = []
      this.selectedRule = true
      if (this.selectedHalf.length === 0) {
        return this.$message.error('请选择添加的半成品')
      } else {
        this.selectedHalf.forEach(item => {
          if (item.Quantity == 0 && item.Weight == 0) {
            this.selectedRule = false
            return this.$message.error('选货数量和选货重量不能同时为0')
          }
          if (item.Quantity > item.AvailableQty) {
            this.selectedRule = false
            return this.$message.error('选货数量不能大于库存数量')
          }
          if (item.Weight * 1 > this.$root.toFloat(item.AvailableWgt, 3)) {
            this.selectedRule = false
            return this.$message.error('选货重量不能大于库存重量')
          }
          selectForm.push({
            HalfId: item.HalfId,
            Quantity: parseInt(item.Quantity),
            Weight: this.$root.toInt(item.Weight)
          })
        })
        if (this.selectedRule) {
          STOCKING_API_HALF_CHANGE_ORDER_HALF_CREATE({
            ChangeId: this.parameters.ChangeId,
            Items: selectForm
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('添加成功')
              this.addProductVisible = flag
              this.getDetail()
            }
          })
        }
      }
    },
    closeAdd() {
      this.addForm = {
        StockCompareType: StockCompareType.AvailableQtyThanZero,
        HalfName: '',
        HalfClassDk: 0,
        CategoryType: 0,
        GoldType: 0,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }
      this.addProductVisible = false
    },
    importTmp(val) {
      if (this.goodsData.length === 0) {
        return this.$message.error('请添加半成品')
      }
      if (val === 'template') {
        this.templateVisible = true
      } else {
        this.smartVisible = true
      }
      this.importOption.KindTypeEk = this.detail.KindTypeEk
    },
    changeSave(save) {
      this.isSaved = save.isSaved
      this.data = save.goodsData
    },
    async save() {
      let haveEdit = false
      let haveError = false
      let errorlist = []
      let tableData = this.$refs.goodsTable.tableData
      this.isRet = true
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i].isEdit) {
          haveEdit = true
        }
        if (this.data[i].isError) {
          haveError = true
        }
        if (this.data[i].isEdit || this.data[i].isError) {
          tableData.some(item => {
            if (
              item.IsRequired == YNStatus.Yes &&
              this.data[i][item.FieldEnName] == 0
            ) {
              this.data[i].isEdit = false
              this.data[i].isError = true
              errorlist.push(
                `序号${i + 1}：${
                  item.FieldType === SettingCustomizedFieldType.SelectOfEnums
                    ? '请选择'
                    : '请输入'
                }${item.FieldCnName}<br>`
              )
            }
          })
          if (this.data[i].isEdit) {
            let res
            let param = { ...this.data[i] }
            tableData.forEach(item => {
              if (item.Precision > 0) {
                param[item.FieldEnName] = this.$root.toInt(
                  param[item.FieldEnName]
                )
              } else if (
                item.FieldType === SettingCustomizedFieldType.TextOfInteger
              ) {
                param[item.FieldEnName] = parseInt(param[item.FieldEnName])
              }
            })
            param.HalfItid = this.halfForm.HalfItid
            param.ChangeId = this.parameters.ChangeId
            this.saveLoading = true
            if (this.data[i].GoodsItid) {
              res = await STOCKING_API_HALF_CHANGE_ORDER_GOODS_UPDATE(param)
            } else {
              res = await STOCKING_API_HALF_CHANGE_ORDER_GOODS_CREATE(param)
            }
            this.saveLoading = false
            if (res.data.Code === 'CORRECT') {
              // this.$message.success('保存成功')
              this.data[i].isEdit = false
              if (!this.data[i].GoodsItid) {
                this.$set(this.data[i], 'GoodsItid', res.data.Data)
              }
              STOCKING_API_HALF_CHANGE_ORDER_HALF_GETS(this.parameters).then(
                res => {
                  if (res.data.Code === 'CORRECT') {
                    let data = res.data.Data.Rows || []
                    this.orderInfo = data && data.length && data[0]
                  }
                }
              )
              STOCKING_API_HALF_CHANGE_ORDER_BASIC_GET({
                ChangeId: this.parameters.ChangeId
              }).then(res => {
                if (res.data.Code === 'CORRECT') {
                  this.detail = res.data.Data || {}
                }
              })
            } else {
              this.data[i].isEdit = false
              this.data[i].isError = true
              errorlist.push(`序号${i + 1}：${res.data.Message}<br>`)
            }
          }
        }
      }
      if (errorlist.length) {
        this.$alert(errorlist.join(''), '错误提示', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true
        })
      } else {
        if (haveEdit || !haveError) {
          this.$message.success('保存成功')
          this.isSaved = false
        }
      }
    },
    submit() {
      if (this.goodsData.length === 0) {
        return this.$message.error('请添加半成品')
      } else {
        STOCKING_API_HALF_CHANGE_ORDER_GOODS_GETS(this.halfForm).then(res => {
          if (res.data.Code === 'CORRECT') {
            let data = res.data.Data.Rows || []
            if (data.length === 0) {
              return this.$message.error('请分秤后再提交审核')
            } else {
              STOCKING_API_HALF_CHANGE_ORDER_BASIC_WAIT({
                ChangeId: this.parameters.ChangeId
              }).then(res => {
                if (res.data.Code === 'CORRECT') {
                  this.$router.push('/purchase/pointsBalance/index')
                }
              })
            }
          }
        })
      }
    },
    deleteShow(scope) {
      if (
        this.data.length <= 1 &&
        !scope.row.GoodsItid &&
        this.parameters.PageIndex === 1
      ) {
        this.$message.warning('至少保留一行')
        return false
      }
      this.$confirm('是否删除当前行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (!scope.row.GoodsItid) {
            this.data.splice(scope.$index, 1)
            if (this.data.length === 0) {
              this.parameters.PageIndex = 1
              this.getGoods()
            }
            this.isSaved = false
          } else {
            STOCKING_API_HALF_CHANGE_ORDER_GOODS_DELETE({
              ChangeId: scope.row.ChangeId,
              HalfItid: scope.row.HalfItid,
              GoodsItid: scope.row.GoodsItid
            }).then(res => {
              if (res.data.Code === 'CORRECT') {
                this.data.splice(scope.$index, 1)
                if (this.data.length === 0) {
                  if (this.parameters.PageIndex > 1) {
                    this.parameters.PageIndex = 1
                    this.getGoods()
                  } else {
                    let obj = { isEdit: false, isError: false }
                    this.fieldData.forEach(item => {
                      if (item.IsRequired === YNStatus.Yes) {
                        obj[item.FieldEnName] = ''
                      }
                    })
                    this.data.push(obj)
                  }
                }
                STOCKING_API_HALF_CHANGE_ORDER_HALF_GETS(this.parameters).then(
                  res => {
                    if (res.data.Code === 'CORRECT') {
                      let data = res.data.Data.Rows || []
                      this.orderInfo = data && data.length && data[0]
                    }
                  }
                )
                STOCKING_API_HALF_CHANGE_ORDER_BASIC_GET({
                  ChangeId: this.parameters.ChangeId
                }).then(res => {
                  if (res.data.Code === 'CORRECT') {
                    this.detail = res.data.Data || {}
                  }
                })
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              }
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    cancelClose() {
      this.copyVisible = false
      this.addVisible = false
      this.copyLineForm.local = this.addLineForm.local = '1'
      this.copyLineForm.rowsNum = this.copyLineForm.current = this.addLineForm.rowsNum = 1
    },
    // 获取半成品分类下拉
    getHalfClass() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: SettingDictionaryDictType.HalfBasicHalfClass,
        State: EnableState.Enable
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.halfClassify = res.data.Data.Rows || []
        }
      })
    },
    getStoreAllType() {
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', {
        HasShelf: YNStatus.Yes,
        State: YNStatus.Yes
      })
      this.$store.dispatch('GET_SUPPLIERS_DROPLIST', {
        PartnerType: 0,
        State: YNStatus.Yes
      })
      this.$store.dispatch('GET_GOLD_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
    },
    importSubmit(key) {
      STOCKING_API_HALF_CHANGE_ORDER_GOODS_TIMPORT({
        ChangeId: this.parameters.ChangeId,
        HalfItid: this.halfForm.HalfItid,
        FilePath: key
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.templateVisible = false
          this.$message({
            message: '导入模版成功',
            type: 'success'
          })
          this.getDetail()
        } else if (
          res.data.Code === 'ERROR' &&
          res.data.Data &&
          Array.isArray(JSON.parse(res.data.Data))
        ) {
          this.errorInfo = res.data.Data
          this.errorVisible = true
        }
      })
    },
    submits(key) {
      const para = {
        ChangeId: this.parameters.ChangeId,
        HalfItid: this.halfForm.HalfItid,
        Fields: key.Fields,
        FilePath: key.FilePath
      }
      STOCKING_API_HALF_CHANGE_ORDER_GOODS_AIMPORT(para).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.smartVisible = false
          this.$message({
            message: '导入货品成功',
            type: 'success'
          })
          this.getDetail()
        } else if (
          res.data.Code === 'ERROR' &&
          res.data.Data &&
          Array.isArray(JSON.parse(res.data.Data))
        ) {
          this.errorInfo = res.data.Data
          this.errorVisible = true
        }
      })
    }
  },
  created() {
    this.getStoreAllType()
  },
  mounted() {
    this.init()
    this.$store.dispatch('GET_SETTLE_DATE')
  },
  watch: {
    pageIndex: 'getGoods',
    pageSize() {
      this.parameters.PageIndex = 1
      this.getGoods()
    }
  },
  components: {
    pagination,
    templateImport,
    smartImport,
    goodsTable,
    importErrorTable
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/erp/purchase.scss';
</style>

<style lang="scss" scoped>
.el-back {
  height: 100%;
  float: right;
}
.location {
  display: inline-block;
  /deep/ .el-select > .el-input {
    width: 140px;
  }
}
.shelf {
  /deep/ .el-form-item__content {
    margin-left: 10px !important;
  }
}
.handle-btn {
  font-size: 16px;
  color: #1f91df;
  i {
    margin-right: 8px;
    &:hover {
      color: blue;
      cursor: pointer;
    }
  }
}
.el-table .el-input-number--mini {
  width: 100%;
}
.check-page {
  font-size: 12px;
  text-align: right;
  padding-right: 5px;
}
.goods-wrapper .goods-left .goods-table tr > :first-child {
  padding-left: 2%;
}
.goods-wrapper .goods-right {
  overflow: auto;
}
.goods-wrapper .goods-left .toolsbar .count-bar:nth-child(3) {
  border: none;
}
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
.end-right {
  float: right;
  color: #999;
}
</style>
