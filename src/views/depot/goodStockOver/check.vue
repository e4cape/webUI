<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看报溢单</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="4" class="state-img">
                  <img src="@/assets/images/draft.png" v-if="detail.State === GoodsCountReportBasicState.Draft">
                  <img src="@/assets/images/auditing.png" v-if="detail.State === GoodsCountReportBasicState.Wait">
                  <img src="@/assets/images/audited.png" v-if="detail.State === GoodsCountReportBasicState.Audit">
                  <img src="@/assets/images/auditBack.png" v-if="detail.State === GoodsCountReportBasicState.Reject">
                  <img src="@/assets/images/abandon.png" v-if="detail.State === GoodsCountReportBasicState.Abandon || detail.State === GoodsCountReportBasicState.Cancel">
                  <div>{{GoodsCountReportBasicState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.ReportCode}}</td>
                <td class="tit">创建：</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateMinutes}}</td>
                <td class="tit">审核：</td>
                <td v-if="detail.State === GoodsCountReportBasicState.Audit || detail.State === GoodsCountReportBasicState.Reject">{{detail.CheckUser + ' '}}{{detail.CheckTime|filterDateMinutes}}</td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">位置：</td>
                <td>{{detail.ObjectType === GoodsCountOrderBasicObjectType.Company ? `${detail.WarehouseName} > ${detail.ShelfName}`:detail.DeskName}}</td>
                <td class="tit">备注：</td>
                <td class="note" colspan="3">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="checkPage-hd">
          <el-row>
            <el-col :span="12">
              <span class="title">货品列表</span>
            </el-col>
            <el-col :span="12" class="tr">
              <span class="detail-info-num-item">
                条码数量：
                <b class="num">{{detail.ItemQty}}</b>
              </span>
              <span class="detail-info-num-item">
                货品总数：
                <b class="num">{{detail.Quantity}}</b>
              </span>
            </el-col>
          </el-row>
        </div>
        <div class="p-x-10">
          <!-- @module 数据表格 -->
          <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" class="m-b-10">
            <el-table-column prop="BarCode" label="条码" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <span @click="showDetailDialog(scope.row.GoodsId)" class="init-button-text">{{scope.row.BarCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="StyleCode" label="款号" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoodsName" label="货品名称" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="MaterialType" label="材质" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="CategoryType" label="品类" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoldType" label="成色" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight" label="货重（g）" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoldWeight" label="净金重（g）" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Stone1Name" label="主石名称" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Stone1Weight" label="主石重（ct）" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Quantity" label="数量" min-width="90" show-overflow-tooltip></el-table-column>
          </el-table>
          <!-- End 数据表格 -->
          <!-- Pagination -->
          <pagination :pg="pg" :size="size" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
        </div>
      </div>
    </div>
    <div class="buttons">
      <template v-if="detail.State === GoodsCountReportBasicState.Reject || detail.State === GoodsCountReportBasicState.Draft">
        <router-link :to="{path:`/depot/goodstockover/edit`,query:{id:detail.ReportId}}" name="btnEdit">
          <el-button type="primary">编辑</el-button>
        </router-link>
        <el-button @click="abandonDialog = true" name="btnAbandon">作废</el-button>
      </template>
      <el-button type="primary" @click="auditDialog = true" v-if="detail.State === GoodsCountReportBasicState.Wait" name="btnAudit">审核</el-button>
      <el-button type="primary" @click="cancelDialog = true" v-if="detail.State === GoodsCountReportBasicState.Audit" name="btnCancelAudit">取消审核</el-button>
      <el-button @click="printDialog = true" name="print">打印</el-button>
      <el-button @click="$router.back()" name="btnPrint">返回</el-button>
    </div>

    <!-- @module Dialog·审核 -->
    <audit :visible.sync="auditDialog" :data="[detail]" @listenAuditDialog="getDetail"></audit>

    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <abandon :visible.sync="abandonDialog" :data="detail" @listenAbandonDialog="getDetail"></abandon>
    <!-- End Dialog·作废 -->

    <!-- @module Dialog·取消审核 -->

    <cancel :visible.sync="cancelDialog" :data="detail" @listenCancelDialog="getDetail"></cancel>
    <!-- End Dialog·取消审核 -->

    <!-- dialog 货品详情 -->
    <good-detail :visible.sync="goodDetailDialog.visible" :goodsId="goodDetailDialog.goodsId"></good-detail>
    <!-- end 货品详情-->
    <print-order :visible.sync="printDialog" :conditions="encodeURIComponent(JSON.stringify({OrderId: detail.ReportId }))" :printingType="SettingPrintingType.StockingCloudGoodsCountReportBasic3"></print-order>
  </div>
</template>

<script>
import { SettingPrintingType } from '@/enums/merchant.js'
import { YNStatus } from '@/enums/common'
import {
  GoodsCountReportBasicState,
  GoodsCountOrderBasicObjectType,
  GoodsCountReportBasicReportType
} from '@/enums/stocking.js'
import {
  STOCKING_API_GOODS_COUNT_REPORT_BASIC_GET2,
  STOCKING_API_GOODS_COUNT_REPORT_ITEM_GETS
} from '@/apis/stocking.js'
import audit from './audit'
import abandon from './abandon'
import cancel from './cancel'
import pagination from '@/components/pagination.vue'
import goodDetail from '@/components/erp/goodDetail'
import printOrder from '@/components/erp/printOrder'

export default {
  data() {
    return {
      SettingPrintingType,
      GoodsCountReportBasicState,
      GoodsCountOrderBasicObjectType,
      GoodsCountReportBasicReportType,
      reportId: '',
      detail: {},
      data: [],
      pg: 1,
      size: 20,
      total: 0,
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      abandonDialog: false, // 作废对话框
      cancelDialog: false, // 取消审核对话框
      auditDialog: false, // 审核对话框
      printDialog: false,
    }
  },
  methods: {
    formatter(row, column, val) {
      switch (column.property) {
        case 'MaterialType':
          return this.$store.getters.materialType.Types[val]
        case 'CategoryType':
          return this.$store.getters.categoryType.Types[val]
        case 'GoldType':
          return this.$store.getters.goldType.Types[val]
        case 'Stone1Weight':
          return this.$root.toFloat(val, 3) + 'ct'
        default:
          return this.$root.toFloat(val, 3) + 'g'
      }
    },
    init() {
      let query = this.$route.query
      this.reportId = query.id
      if (!this.reportId) {
        this.dataError()
      } else {
        this.getDetail()
        this.getGoods()
      }
    },
    dataError(msg) {
      this.$alert(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },
    getDetail() {
      STOCKING_API_GOODS_COUNT_REPORT_BASIC_GET2({
        ReportId: this.reportId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_GOODS_COUNT_REPORT_ITEM_GETS({
        ReportId: this.reportId,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: this.pg,
        PageSize: this.size
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    pageChange(val) {
      this.pg = val
      this.getGoods()
    },
    pageSizeChange(val) {
      this.pg = 1
      this.size = val
      this.getGoods()
    },
    showDetailDialog(goodsId) {
      this.goodDetailDialog = {
        goodsId: goodsId,
        visible: true
      }
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
    }
  },
  created() {
    this.getStoreAllType()
  },
  mounted() {
    this.init()
  },
  components: {
    pagination,
    goodDetail,
    audit,
    abandon,
    cancel,
    printOrder
  }
}
</script>

<style lang="scss" scoped>
.code-input {
  width: 250px;
  margin-right: 10px;
  vertical-align: middle;
}
.count {
  padding-right: 15px;
  line-height: 36px;
  text-align: right;
  font-size: 14px;
}
.details-table .tit {
  width: 100px;
}
</style>
