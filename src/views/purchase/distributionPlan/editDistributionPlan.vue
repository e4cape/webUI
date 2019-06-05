<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title fl">配货计划</span>
        <!-- <span class="title float-r edit">修改</span> -->
        <el-button name="btnEdit" class="el-back" type="text" @click="openPlanDialog">修改</el-button>
      </div>
      <tabulation :data="item"></tabulation>
      <div class="panel-bd">
        <div class="checkPage-hd mt">
          <el-row>
            <el-col :span="12">
              <el-button type="primary" @click="addGoods" name="btnSelectGoods">添加货品</el-button>
            </el-col>
            <el-col :span="12" class="tr">
              <span class="detail-info-num-item">
                数量：
                <b class="num">{{tableData.ItemQty}}</b>
              </span>
              <span class="detail-info-num-item">
                预估金额：
                <b class="num">￥{{$root.toFloat(tableData.Price)}}</b>
              </span>
            </el-col>
          </el-row>
        </div>
        <!-- @module 数据表格 -->
        <el-table :data="goodsData" @sort-change="sortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
          <el-table-column min-width="80" show-overflow-tooltip label="图片">
            <template slot-scope="scope">
              <div class="gift-info-cell">
                <el-popover popper-class="big-img" placement="right" trigger="hover">
                  <img :src="$root.settings.DOMAIN_IMG_FILE + (scope.row.ImageUrl ? scope.row.ImageUrl.replace('{0}', '150x150') : '/default/goods/150x150.jpg')" alt>
                  <div class="fl item-img" slot="reference">
                    <img :src="$root.settings.DOMAIN_IMG_FILE + (scope.row.ImageUrl ? scope.row.ImageUrl.replace('{0}', '150x150') : '/default/goods/150x150.jpg')" alt>
                  </div>
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="条码" min-width="80" sortable="custom" show-overflow-tooltip>
            <template slot-scope="scope">
              <span name="showDetail" @click="openGoodDetail(scope.row.GoodsId)" class="init-button-text">{{scope.row.BarCode}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="StyleCode" label="款号" min-width="80" sortable="custom" show-overflow-tooltip></el-table-column>
          <el-table-column prop="GoodsName" label="货品名称" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column label="货品类型" min-width="80" show-overflow-tooltip>
            <template slot-scope="scope">{{goodsType.Types[scope.row.GoodsType]}}</template>
          </el-table-column>
          <el-table-column prop="GoodsQty" label="入库数量" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="FinanceQty" label="账面库存" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="CostPrice" :label="isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价': '批发价'" min-width="80" show-overflow-tooltip>
            <template slot-scope="scope">￥{{$root.toFloat(scope.row.CostPrice)}}</template>
          </el-table-column>
          <el-table-column prop="PartnerName" label="供应商" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="LastIntakeTime" label="入库日期" sortable="custom" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.LastIntakeTime | filterDate}}</template>
          </el-table-column>
          <el-table-column prop="LastSaleTime" label="最近销售日期" sortable="custom" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.LastSaleTime | filterDate}}</template>
          </el-table-column>
          <el-table-column prop="Quantity" label="配货数量" min-width="100">
            <template slot-scope="scope">
              <el-input
                name="quantity"
                v-model="scope.row.Quantity"
                :maxlength="9"
                @input="enableSubmit=false"
                @keyup.enter.native="updateItem(scope.row)"
                @blur="updateItem(scope.row)"
                @keyup.native="scope.row.Quantity = $root.toFixed(scope.row.Quantity, 0)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="Price" label="预估金额" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">￥{{$root.toFloat(scope.row.Price)}}</template>
          </el-table-column>
          <el-table-column label="操作" min-width="150">
            <template slot-scope="scope">
              <el-button name="goodsDel" type="text" @click="goodsDel(scope.row.ItemId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- End 数据表格 -->
        <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
      </div>
    </div>
    <div class="buttons">
      <el-button type="primary" @click="orderSubmit" :loading="$store.getters.is_loading" name="btnOrderSubmit" v-if="basicState.Draft == tableData.State || basicState.Reject == tableData.State">提交审核</el-button>
      <el-button @click="$router.push('/purchase/distributionPlan/index')">返回</el-button>
      <span class="end-right">注：如果包含多个供应商的条码，审核时根据供应商自动拆成多个单据。</span>
    </div>
    <el-dialog v-if="selectVisible" title="选择货品" :visible.sync="selectVisible" width="1200px" :before-close="colseSelectGoods">
      <el-form :model="selectForm" ref="selectGoods" lable-width="120px" class="item-lh-26" :inline="true" :rules="queryRules">
        <el-row class="search-box m-b-10" type="flex">
          <el-col>
            <el-form-item label="情况：" prop="TurnType">
              <el-select filterable name="TurnType" v-model="selectForm.TurnType" placeholder="所有情况" @change="onSearch">
                <el-option v-for="(item, index) in stockTurnType.TypeArray" :key="index" :label="item.Value" :value="String(item.Value)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态：" prop="TurnStatus">
              <el-select filterable name="TurnStatus" v-model="selectForm.TurnStatus" placeholder="所有状态" @change="onSearch">
                <el-option v-for="(item, index) in stockTurnStatus.TypeArray" :key="index" :label="item.Value" :value="String(item.Value)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="材质：" prop="MaterialType">
              <el-select filterable name="MaterialType" v-model="selectForm.MaterialType" placeholder="所有材质" @change="onSearch">
                <el-option label="所有材质" :value="0"></el-option>
                <el-option v-for="(item, index) in materialType.TypeArray" :key="index" :label="item.Value" :value="Number(item.KeyId)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="品类：" prop="CategoryType">
              <el-select filterable name="CategoryType" v-model="selectForm.CategoryType" placeholder="所有品类" @change="onSearch">
                <el-option label="所有品类" :value="0"></el-option>
                <el-option v-for="(item, index) in categoryType.TypeArray" :key="index" :label="item.Value" :value="Number(item.KeyId)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="成色：" prop="GoldType">
              <el-select filterable name="GoldType" v-model="selectForm.GoldType" placeholder="所有成色" @change="onSearch">
                <el-option label="所有成色" :value="0"></el-option>
                <el-option v-for="(item, index) in goldType.TypeArray" :key="index" :label="item.Value" :value="Number(item.KeyId)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类型：" prop="GoodsType">
              <el-select filterable name="GoodsType" v-model="selectForm.GoodsType" placeholder="所有类型" @change="onSearch">
                <el-option label="所有类型" :value="0"></el-option>
                <el-option v-for="(item, index) in goodsType.TypeArray" :key="index" :label="item.Value" :value="Number(item.KeyId)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类别：" prop="FinanceType">
              <el-select filterable name="FinanceType" v-model="selectForm.FinanceType" placeholder="所有类别" @change="onSearch">
                <el-option label="所有类别" :value="0"></el-option>
                <el-option v-for="(item, index) in financeType.TypeArray" :key="index" :label="item.Value" :value="Number(item.KeyId)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="库存：" prop="StockCompareType">
              <el-select filterable name="StockCompareType" v-model="selectForm.StockCompareType" placeholder="所有库存" @change="onSearch">
                <el-option label="所有库存" :value="0"></el-option>
                <el-option v-for="(item, index) in stockCompareType.TypeArray" :key="index" :label="item.Value" :value="Number(item.KeyId)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="BarCode" label="条码：">
              <el-input name="BarCode" v-model="selectForm.BarCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
            </el-form-item>
            <el-form-item prop="StyleCode" label="款号：">
              <el-input name="StyleCode" v-model="selectForm.StyleCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
            </el-form-item>
            <el-form-item prop="GoodsName" label="货品名称：">
              <el-input name="GoodsName" v-model="selectForm.GoodsName" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
            </el-form-item>
            <el-form-item label="账面库存：">
              <el-col :span="11">
                <el-form-item prop="FinanceQty1" class="inline no-margin">
                  <el-input style="width: 100%;" name="FinanceQty1" v-model="selectForm.FinanceQty1" @keyup.enter.native="onSearch"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="tc">-</el-col>
              <el-col :span="11">
                <el-form-item prop="FinanceQty2" class="inline no-margin">
                  <el-input style="width: 100%;" name="FinanceQty2" v-model="selectForm.FinanceQty2" @keyup.enter.native="onSearch"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="入库日期：" prop="CreateTime">
              <el-date-picker
                name="CreateTime"
                v-model="selectForm.CreateTime"
                @change="createTimeChange"
                type="daterange"
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="$root.datePickerOptions"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="最近销售日期：" prop="LastRetailTime">
              <el-date-picker
                name="LastRetailTime"
                v-model="selectForm.LastRetailTime"
                @change="checkTimeChange"
                type="daterange"
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="$root.datePickerOptions"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="search-btn">
            <el-button name="btnSearch" type="primary" @click="onSearch">搜索</el-button>
            <el-button name="btnReset" type="default" class="m-l-10" @click="onReset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="selectData" element-loading-text="拼命加载中" @selection-change="expandRow" v-loading="$store.getters.tb_loading">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="条码" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            <span name="showDetail" @click="openGoodDetail(scope.row.GoodsId)" class="init-button-text">{{scope.row.BarCode}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="StyleCode" label="款号" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoodsName" label="货品名称" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="货品类型" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">{{goodsType.Types[scope.row.GoodsType]}}</template>
        </el-table-column>
        <el-table-column prop="Quantity" label="入库数量" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="FinanceQty" label="账面库存" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="成本价" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{$root.toFloat(scope.row.CostPrice)}}</template>
        </el-table-column>
        <el-table-column label="入库日期" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime}}</template>
        </el-table-column>
        <el-table-column prop="LastRetailTime" label="最近销售日期" min-width="120" show-overflow-tooltip sortable="custom">
          <template slot-scope="scope">{{scope.row.LastRetailTime | filterDateTime}}</template>
        </el-table-column>
        <el-table-column prop="SellStock" label="周转情况" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ValidStock" label="库存状态" min-width="80" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- Pagination -->
      <pagination :pg="selectForm.PageIndex" :size="selectForm.PageSize" :total="selectTotal" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="$store.getters.is_loading" name="btnAuditStockloss" @click="confirmSelectGoods">确 定</el-button>
        <el-button name="btnCancel" @click="colseSelectGoods">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 新建 -->
    <el-dialog title="修改配货计划" :visible.sync="newVisible" width="500px" @close="colseNewPlan">
      <el-form :model="planForm" ref="planForm" :rules="rule">
        <el-form-item prop="PlanName" label="计划名称：（20字以内）">
          <el-input v-model.trim="planForm.PlanName" name="PlanName" style="width:100%;" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item prop="Note" label="备注：">
          <el-input v-model="planForm.Note" name="Note" type="textarea" style="width:100%;" resize="none" maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="$store.getters.is_loading" name="btnAuditStockloss" @click="confirmNewPlan('planForm')">确 定</el-button>
        <el-button name="btnCancel" @click="colseNewPlan">取 消</el-button>
      </span>
    </el-dialog>
    <dialog-Good-Detail v-if="goodDetailVisible" :visible="goodDetailVisible" :goodsId="goodsId" @visbleColse="closeGoodDetail"></dialog-Good-Detail>
  </div>
</template>

<script>
import { YNStatus } from '@/enums/common.js'
import {
  STOCKING_API_GOODS_REINF_PLAN_ITEM_UPDATE,
  STOCKING_API_GOODS_REINF_PLAN_BASIC_WAIT,
  STOCKING_API_GOODS_REINF_PLAN_ITEM_DELETE,
  STOCKING_API_GOODS_REINF_PLAN_BASIC_GET,
  STOCKING_API_GOODS_REINF_PLAN_ITEM_GETS,
  STOCKING_API_REPORT_GOODS_STOCK_CHARTBYBESTSELL,
  STOCKING_API_GOODS_REINF_PLAN_ITEM_CREATE,
  STOCKING_API_GOODS_REINF_PLAN_BASIC_UPDATE
} from '@/apis/stocking.js'
import {
  GoodsReinfPlanBasicState,
  ReportStockTurnType,
  ReportStockTurnStatus,
  MaterialType,
  CategoryType,
  GoldType,
  GoodsType,
  FinanceType,
  StockCompareType
} from '@/enums/stocking.js'
import tabulation from '@/components/scrm/tabulation'
import goodsDetails from '@/components/erp/goodsDetails'
import pagination from '@/components/pagination'
import selectGoods from '@/components/erp/selectReinfGoods'
import dialogGoodDetail from '@/components/purchase/dialogGoodDetail'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      YNStatus,
      basicState: GoodsReinfPlanBasicState, // 计划单状态
      stockTurnType: ReportStockTurnType, // 周转情况
      stockTurnStatus: ReportStockTurnStatus, // 周转状态
      materialType: MaterialType, // 材质
      categoryType: CategoryType, // 品类
      goldType: GoldType, // 成色
      goodsType: GoodsType, // 货品类型
      financeType: FinanceType, // 货品类别
      stockCompareType: StockCompareType, // 库存类型
      item: [], // 配货数据
      tableData: {}, // 基本信息
      newVisible: false, // 修改弹窗
      planForm: {
        PlanName: '',
        Note: ''
      }, // 编辑验证
      rule: {
        PlanName: [
          { required: true, message: '请输入计划名称', trigger: 'blur' }
        ]
      },
      goodsData: [], // 商品明细数据
      planId: null, // 计划id
      queryForm: {
        PlanId: this.$route.query.id,
        OrderBy: 4,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0, // 明细总数
      selectVisible: false, // 选择货品
      selectData: [], // 选择货品数据
      selectTotal: 0, // 选择货品数据总数
      selectForm: {
        TurnType: '所有情况',
        TurnStatus: '所有状态',
        MaterialType: 0,
        CategoryType: 0,
        GoldType: 0,
        GoodsType: 0,
        FinanceType: 0,
        StockCompareType: StockCompareType.FinanceQtyThanZero,
        BarCode: '',
        StyleCode: '',
        GoodsName: '',
        FinanceQty1: '',
        FinanceQty2: '',
        CreateTime: [],
        CreateTime1: '',
        CreateTime2: '',
        LastRetailTime: [],
        LastRetailTime1: '',
        LastRetailTime2: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }, // 选择货品
      expandRows: [], // 选中的货品
      goodDetailVisible: false,
      goodsId: null,
      enableSubmit: true,
      queryRules: {
        FinanceQty1: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^\d+$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入正整数'))
              } else if (
                this.queryForm.FinanceQty2 &&
                parseFloat(value) > parseFloat(this.queryForm.FinanceQty2)
              ) {
                callback(new Error('不能大于结束值'))
              }
              callback()
            }
          }
        ],
        FinanceQty2: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^\d+$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入正整数'))
              } else if (
                this.queryForm.FinanceQty1 &&
                parseFloat(value) < parseFloat(this.queryForm.FinanceQty1)
              ) {
                callback(new Error('不能小于起始值'))
              }
              callback()
            }
          }
        ]
      },
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.planId = Number(query.id)
      if (!this.planId) {
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
        this.$router.back(-1)
      })
    },
    getDetail() {
      STOCKING_API_GOODS_REINF_PLAN_BASIC_GET({
        PlanId: this.planId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          const detail = res.data.Data
          this.tableData = res.data.Data
          this.item = [
            [
              {
                title: '单号',
                content: detail.PlanCode
              },
              {
                title: '创建',
                content: `${detail.CreateUser} ${this.schemeDate(
                  detail.CreateTime
                )}`
              },
              {
                title: '审核',
                content: `${detail.CheckUser} ${this.schemeDate(
                  detail.CheckTime
                )}`
              }
            ],
            [
              {
                title: '计划名称',
                content: detail.PlanName,
                colspan: 5
              }
            ],
            [
              {
                title: '备注',
                content: detail.Note,
                colspan: 5
              }
            ]
          ]
        }
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_GOODS_REINF_PLAN_ITEM_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    schemeDate(data) {
      const ignore = ['1900', '9999']
      if (!data || ignore.indexOf(dayjs(data).format('YYYY')) > -1) {
        return '-'
      }
      return dayjs(data).format('YYYY-MM-DD HH:mm:ss')
    },
    updateItem(row) {
      if (!/^[0-9]+$/.test(row.Quantity) || parseInt(row.Quantity) === 0) {
        this.$message({
          message: '请输入大于零数字',
          type: 'warning'
        })
      } else {
        STOCKING_API_GOODS_REINF_PLAN_ITEM_UPDATE({
          PlanId: this.planId,
          ItemId: row.ItemId,
          Quantity: Number(row.Quantity)
        }).then(res => {
          if (res.data.Code === 'ERROR') {
            this.$message.error(res.data.Message)
          } else {
            this.enableSubmit = true
            this.getGoods()
          }
          this.getDetail()
        })
      }
    },
    createTimeChange(value) {
      if (value) {
        this.selectForm.CreateTime1 = value[0]
        this.selectForm.CreateTime2 = value[1]
      } else {
        this.selectForm.CreateTime1 = ''
        this.selectForm.CreateTime2 = ''
      }
    },
    checkTimeChange(value) {
      if (value) {
        this.selectForm.LastRetailTime1 = value[0]
        this.selectForm.LastRetailTime2 = value[1]
      } else {
        this.selectForm.LastRetailTime1 = ''
        this.selectForm.LastRetailTime2 = ''
      }
    },
    // 修改
    openPlanDialog() {
      this.newVisible = true
      this.planForm.PlanName = this.tableData.PlanName
      this.planForm.Note = this.tableData.Note
    },
    // 确定修改
    confirmNewPlan(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const para = {
            ...this.planForm,
            PlanId: this.planId
          }
          STOCKING_API_GOODS_REINF_PLAN_BASIC_UPDATE(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '新建成功',
                type: 'success'
              })
              this.getDetail()
              this.colseNewPlan()
            }
          })
        }
      })
    },
    // 关闭修改
    colseNewPlan() {
      this.$refs['planForm'].resetFields()
      this.newVisible = false
    },
    expandRow(val) {
      this.expandRows = val
    },
    orderSubmit() {
      if (!this.goodsData.length) {
        this.$message.error('请先添加货品')
      } else if (this.enableSubmit) {
        this.$store.commit('SET_BTN_LOADING', true)
        STOCKING_API_GOODS_REINF_PLAN_BASIC_WAIT({
          PlanId: this.planId,
          CheckNote: ''
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            this.$store.commit('SET_BTN_LOADING', false)
            this.$router.push('/purchase/distributionPlan/index')
          } else {
            this.$message({
              message: res.data.Message,
              type: 'error'
            })
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }
    },
    showDetailDialog(goodsId) {
      this.goodDetailDialog = {
        goodsId: goodsId,
        visible: true
      }
    },
    // 打开选择货品
    addGoods() {
      this.selectVisible = true
      this.onGetaData()
    },
    //
    confirmSelectGoods() {
      if (this.expandRows.length == 0) {
        this.$message({
          message: '请选择货品',
          type: 'error'
        })
        return
      }
      const para = {
        PlanId: this.planId,
        GoodsIds: this.expandRows.map(item => item.GoodsId)
      }
      STOCKING_API_GOODS_REINF_PLAN_ITEM_CREATE(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.getGoods()
          this.colseSelectGoods()
        }
      })
    },
    // 关闭货品弹窗
    colseSelectGoods() {
      this.$refs['selectGoods'].resetFields()
      this.selectForm.CreateTime1 = ''
      this.selectForm.CreateTime2 = ''
      this.selectForm.LastRetailTime1 = ''
      this.selectForm.LastRetailTime2 = ''
      this.selectVisible = false
      this.expandRows = []
    },
    goodsDel(itemId) {
      this.$confirm('确定删除此货品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        STOCKING_API_GOODS_REINF_PLAN_ITEM_DELETE({
          PlanId: this.planId,
          ItemId: itemId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getGoods()
            this.getDetail()
          }
          this.$store.commit('SET_FULL_LOADING', false)
        })
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'BarCode':
          this.queryForm.OrderBy = 0
          break
        case 'StyleCode':
          this.queryForm.OrderBy = 1
          break
        case 'LastIntakeTime':
          this.queryForm.OrderBy = 3
          break
        case 'LastSaleTime':
          this.queryForm.OrderBy = 4
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.getGoods()
    },
    pageChange(val) {
      this.queryForm.PageIndex = val
      this.getGoods()
    },
    pageSizeChange(val) {
      this.queryForm.PageSize = val
      this.queryForm.PageIndex = 1
      this.getGoods()
    },
    currentChange(val) {
      // 切换当前页
      this.selectForm.PageIndex = val
      this.onGetaData()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.selectForm.PageSize = val
      this.selectForm.PageIndex = 1
      this.onGetaData()
    },
    onSearch() {
      // 搜索相关
      this.$refs['selectGoods'].validate(valid => {
        if (valid) {
          this.selectForm.PageIndex = 1
          this.onGetaData()
        }
      })
    },
    onGetaData() {
      STOCKING_API_REPORT_GOODS_STOCK_CHARTBYBESTSELL(this.selectForm).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.selectData = res.data.Data.Rows
            this.selectTotal = res.data.Data.Count
          }
        }
      )
    },
    onReset() {
      // 重置表单
      this.$refs['selectGoods'].resetFields()
      this.selectForm.CreateTime1 = ''
      this.selectForm.CreateTime2 = ''
      this.selectForm.LastRetailTime1 = ''
      this.selectForm.LastRetailTime2 = ''
      this.onSearch()
    },
    openGoodDetail(id) {
      this.goodDetailVisible = true
      this.goodsId = id
    },
    closeGoodDetail() {
      this.goodDetailVisible = false
    }
  },
  beforeMount() {},
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    goodsDetails,
    pagination,
    selectGoods,
    tabulation,
    dialogGoodDetail
  }
}
</script>

<style lang="scss" scoped>
.panel {
  border: none;
  border-bottom: none;
  margin-bottom: 10px;
  .panel-hd {
    margin-bottom: 10px;
  }
  .hd {
    table {
      // border: 1px solid $border-color;
      tr {
        border-bottom: 1px solid $border-color;
        height: 32px;
        th {
          width: 120px;
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
.el-back {
  position: absolute;
  width: 50px;
  height: 40px;
  right: 25px;
  z-index: 10;
}
.mt {
  margin-top: 10px;
}
.search-box {
  padding: 0;
  border: none;
}
.dataImage {
  width: 50px;
  height: 50px;
  vertical-align: top;
}
.gift-info-cell img {
  width: 50px;
  height: 50px;
  vertical-align: top;
}
.end-right {
  color: #999;
  float: right;
}
</style>
