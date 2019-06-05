<template>
  <div class="content">
    <div class="panel">
      <div class="stitle mb">
        <span>编辑门店分货单({{detail.KindTypeEv}})</span>
        <el-button name="btnEdit" @click="openDividend" class="el-back" type="text">修改</el-button>
      </div>
      <div class="hd">
        <table>
          <tbody>
            <tr>
              <th rowspan="3" class="sp">
                <img v-if="detail.State == orderBasicState.Draft || detail.State == orderBasicState.Wait" src="../../../assets/images/status1.png">
                <img v-if="detail.State == orderBasicState.Audit" src="../../../assets/images/status2.png">
                <img v-if="detail.State == orderBasicState.Reject" src="../../../assets/images/status3.png">
                <img v-if="detail.State == orderBasicState.Cancel" src="../../../assets/images/status4.png">
                <img v-if="detail.State == orderBasicState.Abandon" src="../../../assets/images/status5.png">
                {{orderBasicState.Types[detail.State]}}
              </th>
              <th>单号</th>
              <td>{{detail.SplitCode}}</td>
              <th>创建</th>
              <td>{{detail.CreateUser}} {{detail.CreateTime | filterDateTime}}</td>
              <th>审核</th>
              <td v-if="detail.State === orderBasicState.Audit || detail.State === orderBasicState.Reject">{{detail.CheckUser}} {{detail.CheckTime | filterDateTime}}</td>
              <td v-else>-</td>
            </tr>
            <tr>
              <th>位置</th>
              <td>{{detail.WarehouseName}} > {{detail.ShelfName}}</td>
              <th>备注</th>
              <td>{{detail.Note}}</td>
              <th></th>
              <td></td>
            </tr>
            <tr>
              <th></th>
              <td></td>
              <th></th>
              <td></td>
              <th></th>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div style="margin-bottom: 10px;">
      <el-row>
        <el-col>
          <el-input v-model="enterCode" @keyup.enter.native="enterBarCode" style="width: 200px; margin-right: 10px;" placeholder="录入/扫描款号"></el-input>
          <el-button type="primary" @click="openSelectGoods">选择款式</el-button>
          <span class="right-text">
            <span class="detail-info-num-item">
              库存：
              <b class="num">{{detail.AvailableQty}}</b>
            </span>
            <span class="detail-info-num-item">
              本次分货：
              <b class="num">{{detail.ItemQty}}</b>
            </span>
          </span>
        </el-col>
      </el-row>
    </div>
    <div class="goods-wrapper">
      <div class="goods-left">
        <!-- 货品列表 -->
        <table class="goods-table" cellpadding="1" cellspacing="0">
          <thead>
            <tr>
              <th>序号</th>
              <th>款式</th>
              <th>可用库存</th>
              <th>本次分货</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in goodsData" :key="item.index" :class="{active:item.StyleId === StyleId}" @click="rowSelect(item)">
              <td>{{indexTotalCount - indexPageSize * (indexPageIndex - 1) - index}}</td>
              <td style="padding: 4px 0;">
                <span class="float-l styleImg">
                  <img :src="$root.settings.DOMAIN_IMG_FILE + item.ImageUrl" style="width: 30px; height: 30px;">
                </span>
                <span class="float-l styleTitle">
                  <p class="width100" :title="item.model">{{item.StyleName}}</p>
                  <p class="width100" :title="item.title">{{item.StyleCode}}</p>
                </span>
              </td>
              <td>{{item.AvailableQty}}</td>
              <td>{{item.Quantity}}</td>
              <td>
                <span class="btn-link el-button--text" style="cursor: pointer; color: #da0000;" @click="deleteItem(item)">删除</span>
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
              <button class="prev-btn" @click="prevPage" :disabled="pageIndex === 1" :class="{'isDisabled': pageIndex === 1}">
                <i class="el-icon-arrow-left"></i>
              </button>
              <span class="current-page">{{pageIndex}}/{{pages}}</span>
              <button class="next-btn" @click="nextPage" :disabled="pageIndex === pages" :class="{'isDisabled': pageIndex === pages}">
                <i class="el-icon-arrow-right"></i>
              </button>
            </div>
            <span class="total">共{{totalCount}}条</span>
          </div>
        </div>
      </div>
      <div class="goods-right" style="width: 57%;">
        <!-- 门店列表 -->
        <div class="panel">
          <div class="panel-hd">
            <span class="title">门店列表</span>
            <!-- <el-button name="btnEdit" @click="openAuot" class="el-setting" type="text">按门店需求自动分货</el-button> -->
          </div>
          <div class="panel-bd" v-if="totalCount" :loading="rightLoading">
            <div>
              <el-select filterable v-model="storeGoodsDetail.StoreType" placeholder="请选择" @change="getGoodsDetail">
                <el-option label="所有门店" :value="0"></el-option>
                <el-option v-for="item in storeType.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId"></el-option>
              </el-select>
              <el-select filterable v-model="storeGoodsDetail.SplitXpState" placeholder="请选择" @change="getGoodsDetail">
                <el-option label="所有分货" :value="0"></el-option>
                <el-option v-for="item in splitXpState.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId"></el-option>
              </el-select>
            </div>
            <!-- @module 数据表格 -->
            <el-table :data="tableData" :span-method="objectSpanMethod" style="width: 100%; margin-top: 20px;" border>
              <el-table-column prop="StoreName" label="门店信息" width="100" show-overflow-tooltip>
                <template slot-scope="scope">【{{storeType.Types[scope.row.StoreType]}}】{{scope.row.StoreName}}</template>
              </el-table-column>
              <el-table-column label="库存情况" width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    <div>可用库存：{{scope.row.AvailableQty}}</div>
                    <div>调拨在途：{{scope.row.AllotQty}}</div>
                    <div>安全库存：{{scope.row.SafeQty1}} ~ {{scope.row.SafeQty2}}</div>
                  </div>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="stockTime" label="库存时间" width="80" show-overflow-tooltip></el-table-column> -->
              <el-table-column label="需求时间" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.RequireTime | filterDateTime }}</template>
              </el-table-column>
              <el-table-column prop="SpecNote" width="130" label="需求规格" show-overflow-tooltip></el-table-column>
              <el-table-column prop="RequireQty" label="需求量" show-overflow-tooltip></el-table-column>
              <el-table-column prop="SplitQty" label="已分" show-overflow-tooltip></el-table-column>
              <el-table-column prop="SurpQty" label="未分" show-overflow-tooltip></el-table-column>
              <el-table-column label="本次分货">
                <template slot-scope="scope">
                  <el-input @blur="inputBlurs(scope.row)" @focus="inputChange" name="rowsNum" v-model="scope.row.Quantity"  @keyup.native="scope.row.Quantity = $root.toFixed(scope.row.Quantity)" @keyup.enter.native="inputBlurs(scope.row)" maxlength="9"></el-input>
                </template>
              </el-table-column>
            </el-table>
            <!-- End 数据表格 -->
          </div>
          <div class="panel-bd" v-else style="font-size: small; text-align: center;">暂无数据</div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-button name="btnSave" @click="saveEnter" v-if="isSave" type="primary">保存</el-button>
      <el-button name="btnSubmit" @click="submitReview" v-else type="primary">提交审核</el-button>
      <el-button name="btnBack" @click="$router.back(-1)">返回</el-button>
      <span class="end-right">注：审核后自动按门店拆单，并且自动产生调拨出库单，请在调拨出库单选择出库条码</span>
    </div>
    <el-dialog title="选择款式" :visible.sync="selectGoodsVisible" width="1000px" v-if="selectGoodsVisible">
      <el-form :model="selectGoods" ref="selectStyle" lable-width="120px" class="item-lh-26" :inline="true">
        <el-form-item prop="StockCompareType">
          <el-select filterable name="StockCompareType" v-model="selectGoods.StockCompareType" placeholder="所有种类" @change="getSelectGoods">
            <el-option label="所有库存" :value="0"></el-option>
            <el-option v-for="(item,index) in stockCompareType.TypeArray" :key="index" :label="item.Value" :value="String(item.KeyId)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="KindTypeEk">
          <el-select filterable name="KindTypeEk" v-model="selectGoods.KindTypeEk" placeholder="所有种类" @change="getSelectGoods">
            <el-option label="所有种类" :value="0"></el-option>
            <el-option v-for="(item,index) in kind" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="CategoryTypeEk">
          <el-select filterable name="CategoryTypeEk" v-model="selectGoods.CategoryTypeEk" placeholder="所有品类" @change="getSelectGoods">
            <el-option label="所有品类" :value="0"></el-option>
            <el-option v-for="(item, index) in category" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="StyleCode">
          <el-input name="StyleCode" placeholder="款号" v-model="selectGoods.StyleCode" :maxlength="50" @keyup.enter.native="getSelectGoods">
            <el-button name="btnSearch" slot="append" class="el-icon-search" @click="getSelectGoods"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <el-table :data="selectGoodsData" @selection-change="expandRow" @sort-change="sortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-table-column type="selection" fixed></el-table-column>
        <el-table-column label="款式" min-width="140" show-overflow-tooltip fixed>
          <template slot-scope="scope">
            <div class="gift-info-cell">
              <el-popover popper-class="big-img" placement="right" trigger="hover" v-if="scope.row.ImageUrl != ''">
                <img :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl" alt class="m-r-5">
                <div class="fl item-img" slot="reference">
                  <img class="m-r-5" :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl">
                </div>
              </el-popover>
              <img src="@/assets/images/pic.jpg" width="60" height="60" v-else class="m-r-5 fl item-img">
              <div v-text="scope.row.StyleName"></div>
              <div v-text="scope.row.StyleCode"></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="KindTypeEv" label="货品种类" min-width="100" sortable="custom" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CategoryTypeEv" label="品类" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CreateTime" label="创建时间" min-width="120" sortable="custom" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime }}</template>
        </el-table-column>
        <el-table-column prop="UpperTime" label="新款日期" min-width="120" sortable="custom" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.UpperTime | filterDateTime }}</template>
        </el-table-column>
        <el-table-column label="模版来源" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{styleBasicTemplateType.Types[scope.row.TemplateType]}}</template>
        </el-table-column>
        <el-table-column prop="AvailableQty" label="可用库存" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="FinanceQty" label="账面库存" min-width="80" show-overflow-tooltip></el-table-column>
      </el-table>
      <pagination :pg="selectGoods.PageIndex" :size="selectGoods.PageSize" :total="selectGoodsTotal" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      <span slot="footer" class="dialog-footer">
        <el-button name="confirmAdd" type="primary" :disabled="expandRows.length ? false : true" @click="addToSelect(false)">添加</el-button>
        <el-button name="confirmAddClose" type="primary" :disabled="expandRows.length ? false : true" @click="addAndClose">添加并关闭</el-button>
        <el-button name="confirmClose" @click="closeSelectGoods">取消</el-button>
      </span>
    </el-dialog>
    <!-- 新建分货单 -->
    <el-dialog title="修改分货单" :visible.sync="dividendVisible" width="600px" @close="colseDividend" v-if="dividendVisible">
      <el-form ref="newDividendOrder" :model="newDividendOrder" :rules="rules" lable-width="120px" class="item-lh-26" :inline="true">
        <!-- <el-form-item label="货品种类：" prop="KindTypeEk">
          <el-select filterable v-model="newDividendOrder.KindTypeEk">
            <template v-for="(item,index) in kind">
              <el-option v-if="item.State === YNStatus.Yes" :key="index" :label="item.Value" :value="Number(item.Id)"></el-option>
            </template>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-form-item label="位置：" prop="WarehouseId">
            <el-select filterable v-model="newDividendOrder.WarehouseId" @change="warehouseChange" :disabled="true">
              <el-option v-for="(item, index) in positionList" :key="index" :label="item.label" :value="Number(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ShelfId">
            <el-select filterable v-model="newDividendOrder.ShelfId" :disabled="true">
              <el-option v-for="(item, index) in shelfList" :key="index" :label="item.Value" :value="Number(item.Id)"></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" @blur="newDividendOrder.Note = newDividendOrder.Note.trim()" v-model="newDividendOrder.Note" :maxlength="200" name="Note" style="width: 300px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveForm('newDividendOrder')" :loading="$store.getters.is_loading" name="btnEditModify">保存</el-button>
        <el-button @click="colseDividend" name="btnCancel">取消</el-button>
      </span>
    </el-dialog>
    <!-- end 新建分货单 -->
    <!-- 按门店需求自动分货 -->
    <el-dialog title="自动分货" :visible.sync="autoDividend" width="600px" @close="colseDividend" v-if="autoDividend">
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="conformAuto" :loading="$store.getters.is_loading" name="btnEditModify">确定</el-button>
        <el-button @click="colseAuto" name="btnCancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { YNStatus, StoreType } from '@/enums/common.js'
import {
  StyleSplitOrderBasicState,
  StockCompareType,
  SettingEnumeratorEnumeratorType,
  StyleBasicTemplateType,
  StyleSplitOrderRequireSplitXpState
} from '@/enums/stocking.js'
import {
  STOCKING_API_STYLE_SPLIT_ORDER_BASIC_GET,
  STOCKING_API_STYLE_SPLIT_ORDER_REQUIRE_GETS,
  STOCKING_API_STYLE_SPLIT_ORDER_STYLE_GETS,
  STOCKING_API_STYLE_SPLIT_ORDER_STYLE_CREATE,
  STOCKING_API_STYLE_SPLIT_ORDER_BASIC_UPDATE,
  STOCKING_API_STYLE_SPLIT_ORDER_BASIC_WAIT,
  STOCKING_API_STYLE_SPLIT_ORDER_REQUIRE_SPLIT,
  STOCKING_API_STYLE_STOCK_SHELF_REQS,
  STOCKING_API_STYLE_SPLIT_ORDER_STYLE_DELETE
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST,
  MERCHANT_API_DROPDOWN_WAREHOUSEBASICLIST
} from '@/apis/merchant.js'

import goodsDetails from '@/components/erp/goodsDetails'
import pagination from '@/components/pagination'

export default {
  data() {
    return {
      YNStatus,
      orderBasicState: StyleSplitOrderBasicState,
      stockCompareType: StockCompareType, // 可用库存下拉
      styleBasicTemplateType: StyleBasicTemplateType, // 模版来源
      kind: [], // 种类下拉
      category: [], // 品类下拉
      positionList: [], // 仓库下拉
      shelfList: [], // 货架下拉
      goodsData: [], // 货品数据
      paginationSizes: [10, 15, 20], // 分页数据条数数组
      pageSize: 10, // 分页数据条数
      pageIndex: 1, // 当前页面位置
      totalCount: 0, // 总数据条数
      indexPageSize: 10, // 列表序号，分页数据条数
      indexPageIndex: 1, // 列表序号，当前页面位置
      indexTotalCount: 0, // 列表序号，总数据条数
      SplitId: '',
      rightLoading: false,
      detail: {
        SplitId: '',
        SupplierId: '',
        ArrivalCode: '',
        FinanceType: '',
        Note: ''
      },
      StyleId: '', // 选中的货品id
      storeType: StoreType,
      splitXpState: StyleSplitOrderRequireSplitXpState,
      storeVal: 0,
      dividendVal: 0,
      tableData: [],
      tableTotal: 0,
      spanArr: [],
      // 右边商品列表
      storeGoodsList: {
        SplitId: Number(this.$route.query.id),
        State: 0,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 10
      },
      // 右边商品分货明细
      storeGoodsDetail: {
        SplitId: Number(this.$route.query.id),
        StyleItid: 0,
        StoreType: 0,
        SplitXpState: 0,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 1000
      },
      selectGoodsVisible: false, // 选择库存弹窗
      // 选择库存筛选条件
      selectGoods: {
        WarehouseId: 0,
        ShelfId: 0,
        StockCompareType: StockCompareType.AvailableQtyThanZero + '',
        KindTypeEk: 0,
        CategoryTypeEk: 0,
        StyleCode: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 10
      },
      selectGoodsTotal: 0, // 款式库存总数
      selectGoodsData: [], // 款式库存数据
      dividendVisible: false, // 修改
      newDividendOrder: {
        KindTypeEk: null,
        WarehouseId: null,
        ShelfId: null,
        Note: ''
      },
      rules: {
        KindTypeEk: [
          { required: true, message: '请选择业务日期', trigger: 'change' }
        ],
        WarehouseId: [
          { required: true, message: '请选择仓库', trigger: 'change' }
        ],
        ShelfId: [{ required: true, message: '请选择货架', trigger: 'change' }]
      },
      autoDividend: false, // 自动分货弹窗
      autoDividData: [], // 自动分货数据
      autoSelectObj: {}, // 选择的自动分货
      stockTotal: 0, // 库存总数
      alreadyTotal: 0, // 已分总数
      expandRows: [],
      enterCode: '',
      isSave: false,
    }
  },
  computed: {
    pages() {
      return (
        (this.totalCount % this.pageSize === 0
          ? this.totalCount / this.pageSize
          : parseInt(this.totalCount / this.pageSize) + 1) || 1
      )
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.SplitId = Number(query.id)
      if (!this.SplitId) {
        this.dataError()
      } else {
        this.getDetail()
        this.getGoods()
      }
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
    getDetail() {
      STOCKING_API_STYLE_SPLIT_ORDER_BASIC_GET({
        SplitId: this.SplitId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.newDividendOrder.KindTypeEk = res.data.Data.KindTypeEk
          this.newDividendOrder.WarehouseId = res.data.Data.WarehouseId
          this.newDividendOrder.ShelfId = res.data.Data.ShelfId
          this.newDividendOrder.Note = res.data.Data.Note
          this.getAllDepotList()
        }
      })
    },
    getGoods(flg) {
      this.storeGoodsList.PageIndex = this.pageIndex
      this.storeGoodsList.PageSize = this.pageSize
      STOCKING_API_STYLE_SPLIT_ORDER_STYLE_GETS(this.storeGoodsList).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.goodsData = res.data.Data.Rows || []
            this.totalCount = res.data.Data.Count || 0
            if (!flg) {
              this.StyleId =
                this.goodsData &&
                this.goodsData.length &&
                this.goodsData[0].StyleId
              this.storeGoodsDetail.StyleItid =
                res.data.Data.Count && this.goodsData[0].StyleItid
            }
            this.indexPageSize = this.pageSize
            this.indexPageIndex = this.pageIndex
            this.indexTotalCount = this.totalCount
            if (res.data.Data.Count) {
              this.getGoodsDetail()
            }
          }
        }
      )
    },
    inputBlurs(row) {
      if (row.Quantity === '') {
        return this.$message.error('请输入分货数量')
      }
      STOCKING_API_STYLE_SPLIT_ORDER_REQUIRE_SPLIT({
        SplitId: row.SplitId,
        StyleItid: row.StyleItid,
        RequireItid: row.RequireItid,
        StoreItid: row.StoreItid,
        Quantity: Number(row.Quantity)
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '分货成功',
            type: 'success'
          })
          this.getDetail()
          this.getGoods(true) // 不刷新到第一个数据
        }
      })
    },
    inputChange() {
      this.isSave = true
    },
    saveEnter() {
      this.isSave = false
    },
    getGoodsDetail() {
      this.rightLoading = true
      STOCKING_API_STYLE_SPLIT_ORDER_REQUIRE_GETS(this.storeGoodsDetail)
        .then(res => {
          this.rightLoading = false
          if (res.data.Code === 'CORRECT') {
            this.tableData = res.data.Data.Rows || []
            this.tableTotal = res.data.Data.Count
            let contactDot = 0
            this.spanArr = []
            this.tableData.sort((a,b) => {
              if(a.CharacterId === b.CharacterId) {
                return  new Date(b.RequireTime.replace(/-/g, '/')) - new Date(a.RequireTime.replace(/-/g, '/'))
              } else {
                return a.CharacterId === b.CharacterId
              }
            })
            this.tableData.map((item, index) => {
              item.index = index
              if (index === 0) {
                this.spanArr.push(1)
              } else {
                if (
                  item.CharacterId === this.tableData[index - 1].CharacterId
                ) {
                  this.spanArr[contactDot] += 1
                  this.spanArr.push(0)
                } else {
                  this.spanArr.push(1)
                  contactDot = index
                }
              }
            })
          }
        })
        .catch(() => {
          this.rightLoading = false
        })
    },
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 打开选择库存弹窗
    openSelectGoods() {
      this.selectGoodsVisible = true
      this.getSelectGoods()
    },
    // 获取库存弹窗数据
    getSelectGoods() {
      this.$store.commit('SET_TB_LOADING', true)
      const para = {
        ...this.selectGoods,
        WarehouseId: this.detail.WarehouseId,
        ShelfId: this.detail.ShelfId
      }
      STOCKING_API_STYLE_STOCK_SHELF_REQS(para).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.selectGoodsData = res.data.Data.Rows
          this.selectGoodsTotal = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.selectGoods.OrderBy = 0
          break
        case 'UpperTime':
          this.selectGoods.OrderBy = 1
          break
        case 'KindTypeEv':
          this.selectGoods.OrderBy = 2
          break
        default:
          this.selectGoods.OrderBy = 0
          break
      }
      this.selectGoods.IsAsced = sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getSelectGoods()
    },
    // 添加选择库存
    addToSelect(isColse) {
      // obj.PurchaseId = this.parameters.PurchaseId,
      const arr = this.expandRows.map(item => {
        const obj = {
          StyleId: item.StyleId,
          StyleCode: item.StyleCode
        }
        return obj
      })
      this.addInStock(arr, isColse)
    },
    enterBarCode() {
      if (!this.enterCode) {
        return
      }
      const arr = [{ StyleCode: this.enterCode }]
      const para = {
        SplitId: Number(this.SplitId),
        Items: arr
      }
      this.createOrder(para)
    },
    addInStock(data, isColse) {
      const para = {
        SplitId: Number(this.SplitId),
        Items: data
      }
      this.createOrder(para, isColse)
    },
    createOrder(para, isColse) {
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_STYLE_SPLIT_ORDER_STYLE_CREATE(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '添加款式成功',
            type: 'success'
          })
          this.getGoods()
          if (isColse) {
            this.closeSelectGoods()
          }
        }
        this.enterCode = ''
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    expandRow(row) {
      this.expandRows = row
    },
    // 添加并关闭选择款式
    addAndClose() {
      this.addToSelect(true)
    },
    // 关闭选择款式
    closeSelectGoods() {
      this.selectGoodsVisible = false
      this.$refs['selectStyle'].resetFields()
      this.selectRows = null
      this.expandRows = []
    },
    // 打开修改
    openDividend() {
      this.dividendVisible = true
    },
    colseDividend() {
      this.$refs['newDividendOrder'].resetFields()
      this.newDividendOrder.Note = ''
      this.dividendVisible = false
    },
    // 修改保存
    saveForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const kindObj = this.kind.find(
            item => item.Id == this.newDividendOrder.KindTypeEk
          )
          const para = {
            ...this.newDividendOrder,
            SplitId: this.SplitId,
            WarehouseId: Number(this.newDividendOrder.WarehouseId),
            ShelfId: Number(this.newDividendOrder.ShelfId),
            KindTypeEk: kindObj.Id,
            KindTypeEv: kindObj.Value
          }
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_STYLE_SPLIT_ORDER_BASIC_UPDATE(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.getDetail()
              this.colseDividend()
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        }
      })
    },
    // 修改分货单选择仓库后
    warehouseChange() {
      const Shelf = this.positionList.find(item => {
        return item.Id == this.newDividendOrder.WarehouseId
      })
      this.newDividendOrder.ShelfId =
        Shelf.Childrens.length == 1 ? Shelf.Childrens[0].Id : ''
      this.shelfList = Shelf.Childrens
    },
    // 打开自动分货
    openAuot() {
      this.autoDividend = true
    },
    // 关闭自动分货
    conformAuto() {
      this.autoDividend = false
    },
    colseAuto() {
      this.autoDividend = false
    },
    rowSelect(item) {
      this.StyleId = item.StyleId
      this.storeGoodsDetail.StyleItid = item.StyleItid
      this.getGoodsDetail()
    },
    prevPage() {
      this.pageIndex -= 1
    },
    nextPage() {
      this.pageIndex += 1
    },
    // 提交审核
    submitReview() {
      if (this.goodsData.length) {
        if(this.detail.ItemQty == 0) {
          this.$message.error('没有门店分货，无法提交审核')
          return
        }
        this.$store.commit('SET_BTN_LOADING', true)
        STOCKING_API_STYLE_SPLIT_ORDER_BASIC_WAIT({
          SplitId: Number(this.SplitId),
          CheckNote: ''
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: '提交审核成功',
              type: 'success'
            })
            setTimeout(() => {
              this.$store.commit('SET_BTN_LOADING', false)
              this.$router.back(-1)
            }, 1000)
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      } else {
        this.$message.error('请先添加款式!')
      }
    },
    // 款式库存分页
    currentChange(val) {
      // 切换当前页
      this.selectGoods.PageIndex = val
      this.getSelectGoods()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.selectGoods.PageIndex = 1
      this.selectGoods.PageSize = val
      this.getSelectGoods()
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
    // 获取品类
    getCategory() {
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.CategoryType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.category = res.data.Data.Rows
        }
      })
    },
    // 获取仓库和货架列表
    getAllDepotList() {
      MERCHANT_API_DROPDOWN_WAREHOUSEBASICLIST({ HasShelf: YNStatus.Yes }).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.positionList =
              res.data.Data.Rows.length &&
              res.data.Data.Rows.map(item => {
                const obj = {
                  ...item,
                  label: item.Value,
                  value: item.Id
                }
                if (item.Childrens.length && item.Childrens.length != 1) {
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
                return item.Id == this.newDividendOrder.WarehouseId
              })
            this.shelfList = Shelf.Childrens.length && Shelf.Childrens
          }
        }
      )
    },
    deleteItem(item) {
      this.$confirm('是否删除该款式？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        STOCKING_API_STYLE_SPLIT_ORDER_STYLE_DELETE({
          SplitId: this.SplitId,
          StyleItid: item.StyleItid
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.getGoods(false)
            this.getDetail()
          }
        })
      }).catch(() => {})
    }
  },
  beforeMount() {
    this.getCategory()
  },
  mounted() {
    this.init()
    this.getKind()
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
    pagination
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/erp/purchase.scss';
</style>

<style lang="scss" scoped>
.panel {
  border-bottom: none;
  margin-bottom: 10px;
  .hd {
    table {
      // border: 1px solid $border-color;
      tr {
        border-bottom: 1px solid $border-color;
        height: 32px;
        th {
          min-width: 120px;
          border-left: 1px solid $border-color;
          border-right: 1px solid $border-color;
          background: $bg-color;
          text-align: center;
          &.sp {
            width: 100px;
            background: $white;
            border-left: none;
            img {
              display: block;
              margin: 0 auto 10px;
            }
          }
        }
        td {
          min-width: 200px;
          padding-left: 10px;
          word-break:break-all;
        }
      }
    }
  }
  .md {
    height: 34px;
    line-height: 34px;
    padding: 0 10px;
    .fl {
      font-weight: bold;
    }
  }
  .bd {
    padding: 5px 0 45px;
  }
}
.content {
  .stitle {
    font-size: 14px;
    padding: 10px 15px;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    color: #777777;
    font-weight: 600;
    background: #f5f5f5;
    position: relative;
  }
}
.import-purchase-dialog {
  .download-modflie {
    margin: 0 auto;
    padding: 10px 0;
    width: 360px;
    text-align: right;
    color: #20a0ff;
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

.goods-wrapper .goods-left .toolsbar {
  height: 32px;
}
.goods-wrapper .goods-left .toolsbar .count-bar {
  border-bottom: 1px solid #ddd;
}
.goods-wrapper .goods-left .toolsbar .count-bar:nth-child(3) {
  border: none;
}
.float-l {
  float: left;
}
.float-r {
  float: right;
}
.edit {
  cursor: pointer;
  color: blue;
}
.styleImg {
  width: 29%;
}
.styleTitle {
  width: 66% !important;
  padding-top: 3px !important;
  p {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.width100 {
  width: 100% !important;
  padding: 0 !important;
}
.gift-info-cell img {
  width: 50px;
  height: 50px;
  vertical-align: top;
}
.el-back {
  position: absolute;
  width: 50px;
  height: 35px;
  top: 0;
  right: 25px;
  z-index: 10;
}
.el-setting {
  position: absolute;
  height: 32px;
  right: 10px;
  z-index: 10;
}
.right-text {
  position: absolute;
  height: 32px;
  right: 10px;
  z-index: 10;
  line-height: 32px;
  font-size: 14px;
  span {
    margin-right: 10px;
  }
}
.el-form-item {
  height: 38px;
}
.end-right {
  float: right;
  color: #999;
}
</style>
