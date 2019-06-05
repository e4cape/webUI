<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title fl">查看配货计划</span>
      </div>
      <div class="details-info-table">
        <table cellpadding="0" cellspacing="0">
          <tbody>
            <tr>
              <td rowspan="6" colspan="1" class="state-img">
                <img src="@/assets/images/draft.png" v-if="tableData.State === orderBasicState.Draft">
                <img src="@/assets/images/auditing.png" v-if="tableData.State === orderBasicState.Wait">
                <img src="@/assets/images/audited.png" v-if="tableData.State === orderBasicState.Audit">
                <img src="@/assets/images/auditBack.png" v-if="tableData.State === orderBasicState.Reject">
                <img src="@/assets/images/abandon.png" v-if="tableData.State === orderBasicState.Abandon || tableData.State === orderBasicState.Cancel">
                <div>{{orderBasicState.Types[tableData.State]}}</div>
              </td>
            </tr>
            <tr>
              <td class="tit">单号</td>
              <td>{{tableData.PlanCode}}</td>
              <td class="tit">创建</td>
              <td>{{tableData.CreateUser}}&nbsp;&nbsp;{{tableData.CreateTime | filterDateTime}}</td>
              <td class="tit">审核</td>
              <td>{{tableData.CheckUser}}&nbsp;&nbsp;{{tableData.CheckTime | filterDateTime}}</td>
            </tr>
            <tr>
              <td class="tit">计划名称</td>
              <td colspan="5">{{tableData.PlanName}}</td>
            </tr>
            <tr>
              <td class="tit">备注</td>
              <td colspan="5">{{tableData.Note}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="panel-bd">
        <div class="checkPage-hd mt">
          <el-row>
            <el-col :span="12">
              <i class="icon-list"></i>
              <span class="title">货品列表</span>
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
          <el-table-column min-width="80" label="图片">
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
          <el-table-column prop="PartnerBcode" label="供应商条码" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="PartnerScode" label="供应商款号" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="LastIntakeTime" label="入库日期" sortable="custom" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.LastIntakeTime | filterDate}}</template>
          </el-table-column>
          <el-table-column prop="LastSaleTime" label="最近销售日期" sortable="custom" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.LastSaleTime | filterDate}}</template>
          </el-table-column>
          <el-table-column prop="Quantity" label="配货数量" min-width="100"></el-table-column>
          <el-table-column prop="Price" label="预估金额" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">￥{{$root.toFloat(scope.row.Price)}}</template>
          </el-table-column>
        </el-table>
        <!-- End 数据表格 -->
        <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
      </div>
    </div>
    <div class="buttons">
      <template v-if="tableData.State == orderBasicState.Draft  ||tableData.State == orderBasicState.Reject">
        <router-link :to="{path:'/purchase/distributionPlan/editDistributionPlan',query:{id: planId}}" name="btnEdit">
          <el-button type="primary">编辑</el-button>
        </router-link>
      </template>
      <el-button @click="showAuditDialog" name="btnAudit" v-if="tableData.State == orderBasicState.Wait">审核</el-button>
      <el-button @click="openCancelReview" name="btnCancelAudit" v-if="tableData.State == orderBasicState.Audit">取消审核</el-button>
      <el-button @click="openObsolete" name="btnAbandon" v-if="tableData.State == orderBasicState.Draft || tableData.State == orderBasicState.Reject">作废</el-button>
      <el-button @click="exportData" name="btnAbandon" >导出货品</el-button>
      <el-button @click="printDialog = true" name="btnAbandon" >打印</el-button>
      <el-button @click="$router.back(-1)">返回</el-button>
    </div>
    <dialog-Good-Detail v-if="goodDetailVisible" :visible="goodDetailVisible" :goodsId="goodsId" @visbleColse="closeGoodDetail"></dialog-Good-Detail>
    <!-- 审核 -->
    <review-Dialog :auditDialog="auditDialog" :title="'审核'" :data="reviewData" v-if="auditDialog" @confirmClick="confirmAudit" @cancelClick="cancelAudit"></review-Dialog>
    <!-- 取消审核 -->
    <cancel-Review :visibleCan="visibleCan" :data="reviewData" v-if="visibleCan" @confirmCancel="cancelConfirm" @visbleColse="cancelColse"></cancel-Review>
    <!-- 作废 -->
    <obsolete v-if="obsoleteVisble" @visbleColse="visbleColse" @confirmObsolete="confirmObsolete" :data="reviewData" :visibleObs="obsoleteVisble"></obsolete>

    <!-- @module Dialog·打印 -->
    <print-order title="打印" v-if="printDialog" :visible.sync="printDialog" :conditions="encodeURIComponent(JSON.stringify(Object.assign({OrderId: tableData.PlanId})))"
      :printingType="storeSettingPrintingTypes.StockingCloudGoodsReinfPlanBasic" ></print-order>
    <!-- End Dialog·打印 -->
  </div>
</template>

<script>
import { YNStatus } from '@/enums/common.js'
import {
  SettingPrintingType
} from '@/enums/merchant.js'
import {
  STOCKING_API_GOODS_REINF_PLAN_ITEM_UPDATE,
  STOCKING_API_GOODS_REINF_PLAN_BASIC_AUDIT,
  STOCKING_API_GOODS_REINF_PLAN_ITEM_DELETE,
  STOCKING_API_GOODS_REINF_PLAN_BASIC_GET,
  STOCKING_API_GOODS_REINF_PLAN_ITEM_GETS,
  STOCKING_API_REPORT_GOODS_STOCK_CHARTBYBESTSELL,
  STOCKING_API_GOODS_REINF_PLAN_ITEM_CREATE,
  STOCKING_API_GOODS_REINF_PLAN_BASIC_UPDATE,
  STOCKING_API_GOODS_REINF_PLAN_BASIC_ABANDON,
  STOCKING_API_GOODS_REINF_PLAN_BASIC_CANCEL,
  STOCKING_API_GOODS_REINF_PLAN_BASIC_REJECT,
  STOCKING_API_GOODS_REINF_PLAN_ITEM_EXPORT
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
import pagination from '@/components/pagination'
import selectGoods from '@/components/erp/selectReinfGoods'
import dialogGoodDetail from '@/components/purchase/dialogGoodDetail'
import reviewDialog from '@/components/purchase/reviewDialog'
import obsolete from '@/components/purchase/obsolete'
import cancelReview from '@/components/purchase/cancelReview'
import dayjs from 'dayjs'
import printOrder from '@/components/erp/printOrder'

export default {
  data() {
    return {
      YNStatus,
      orderBasicState: GoodsReinfPlanBasicState, // 计划单状态
      stockTurnType: ReportStockTurnType, // 周转情况
      stockTurnStatus: ReportStockTurnStatus, // 周转状态
      materialType: MaterialType, // 材质
      categoryType: CategoryType, // 品类
      goldType: GoldType, // 成色
      goodsType: GoodsType, // 货品类型
      financeType: FinanceType, // 货品类别
      stockCompareType: StockCompareType, // 库存类型
      storeSettingPrintingTypes: SettingPrintingType,
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
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0, // 明细总数
      selectVisible: false, // 选择货品
      selectData: [], // 选择货品数据
      selectTotal: 0, // 选择货品数据总数
      selectForm: {
        TurnType: '0',
        TurnStatus: '0',
        MaterialType: 0,
        CategoryType: 0,
        GoldType: 0,
        GoodsType: 0,
        FinanceType: 0,
        StockCompareType: 0,
        BarCode: '',
        StyleCode: '',
        GoodsName: '',
        FinanceQty1: 0,
        FinanceQty2: 0,
        // CreateTime: [],
        CreateTime1: '',
        CreateTime2: '',
        // LastRetailTime: [],
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
      auditDialog: false, // 审核弹窗
      arrivalVisible: false, // 到货入库弹窗
      obsoleteVisble: false, // 作废弹窗
      visibleCan: false, // 取消审核弹窗
      reviewData: [], // 审核数据
      printDialog: false, // 打印弹出
      ExportColumns: [
        {
          FieldEnName: 'BarCode',
          FieldCnName: '条码'
        },
        {
          FieldEnName: 'StyleCode',
          FieldCnName: '款号'
        },
        {
          FieldEnName: 'GoodsName',
          FieldCnName: '货品名称'
        },
        {
          FieldEnName: 'GoodsTypeName',
          FieldCnName: '货品类型'
        },
        {
          FieldEnName: 'GoodsQty',
          FieldCnName: '入库数量',
        },
        {
          FieldEnName: 'FinanceQty',
          FieldCnName: '账面库存',
        },
        {
          FieldEnName: 'CostPrice',
          FieldCnName: this.isOneNumberManyShopCompany ||  this.isOneNumberOneStore ? '采购价': '批发价',
          Precision: 2
        },
        {
          FieldEnName: 'PartnerName',
          FieldCnName: '供应商'
        },
        {
          FieldEnName: 'PartnerBcode',
          FieldCnName: '供应商条码'
        },
        {
          FieldEnName: 'PartnerScode',
          FieldCnName: '供应商款号'
        },
        {
          FieldEnName: 'LastIntakeTime',
          FieldCnName: '入库日期'
        },
        {
          FieldEnName: 'LastSaleTime',
          FieldCnName: '最近销售日期'
        },
        {
          FieldEnName: 'Quantity',
          FieldCnName: '配货数量',
        },
        {
          FieldEnName: 'Price',
          FieldCnName: '预估金额',
          Precision: 2
        },
      ]
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
        this.$router.back()
      })
    },
    getDetail() {
      STOCKING_API_GOODS_REINF_PLAN_BASIC_GET({
        PlanId: this.planId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data
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
    // 打开选择货品
    addGoods() {
      this.selectVisible = true
      this.onSearch()
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
      console.log(para)
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
            this.$message(res.data.Message, 'success')
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
      this.selectForm.PageIndex = 1
      this.onGetaData()
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
      this.onSearch()
    },
    openGoodDetail(id) {
      this.goodDetailVisible = true
      this.goodsId = id
    },
    closeGoodDetail() {
      this.goodDetailVisible = false
    },
    // 打开审核和批量审核弹窗
    showAuditDialog() {
      this.reviewData = [
        { ...this.tableData, orderNumber: this.tableData.PlanCode }
      ]
      this.auditDialog = true
    },
    // 打开作废
    openObsolete() {
      this.reviewData = [
        { ...this.tableData, orderNumber: this.tableData.PlanCode }
      ]
      this.obsoleteVisble = true
    },
    // 作废关闭
    visbleColse() {
      this.obsoleteVisble = false
    },
    // 作废确认
    confirmObsolete(note) {
      const para = {
        PlanId: this.reviewData[0].PlanId,
        CheckNote: note
      }
      STOCKING_API_GOODS_REINF_PLAN_BASIC_ABANDON(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '作废成功',
            type: 'success'
          })
          this.obsoleteVisble = false
          this.reviewData = []
          this.getDetail()
          this.getGoods()
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    // 打开取消审核
    openCancelReview() {
      this.reviewData = [
        { ...this.tableData, orderNumber: this.tableData.PlanCode }
      ]
      this.visibleCan = true
    },
    // 取消审核确定
    cancelConfirm(data) {
      const para = {
        PlanId: Number(this.reviewData[0].PlanId),
        CheckNote: data
      }

      STOCKING_API_GOODS_REINF_PLAN_BASIC_CANCEL(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '取消审核成功',
            type: 'success'
          })
          this.cancelColse()
          this.getDetail()
          this.getGoods()
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    // 取消审核关闭
    cancelColse() {
      this.reviewData = []
      this.visibleCan = false
    },
    // 审核确定
    confirmAudit(data) {
      const para = {
        PlanId: Number(this.reviewData[0].PlanId),
        CheckNote: data.auditReson
      }
      if (YNStatus.Yes === data.auditType) {
        STOCKING_API_GOODS_REINF_PLAN_BASIC_AUDIT(para).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: '审核通过成功',
              type: 'success'
            })
            this.getDetail()
            this.getGoods()
            this.cancelAudit()
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      } else if (YNStatus.No === data.auditType) {
        STOCKING_API_GOODS_REINF_PLAN_BASIC_REJECT(para).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: '审核退回成功',
              type: 'success'
            })
            this.getDetail()
            this.getGoods()
            this.cancelAudit()
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }
    },
    cancelAudit(data) {
      this.reviewData = []
      this.reviewTitle = ''
      this.auditDialog = data
    },
    exportData() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_GOODS_REINF_PLAN_ITEM_EXPORT(Object.assign({},this.queryForm, {PlanId: Number(this.queryForm.PlanId)}, {ExportColumns: this.ExportColumns}  )).then(res => {
        if (res.data.Code === 'CORRECT') {
          window.open(this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data)
        } else {
          this.$message({
            type: 'info',
            message: res.data.Message
          })
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    printData() {

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
    pagination,
    selectGoods,
    tabulation,
    dialogGoodDetail,
    reviewDialog,
    obsolete,
    cancelReview,
    printOrder
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
</style>
