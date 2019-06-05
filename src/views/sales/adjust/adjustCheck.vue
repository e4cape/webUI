<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看调价单</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="4" class="state-img">
                  <img
                    src="@/assets/images/draft.png"
                    v-if="detail.State === goodsPriceOrderBasicStates.Draft"
                  >
                  <img
                    src="@/assets/images/auditing.png"
                    v-if="detail.State === goodsPriceOrderBasicStates.Wait"
                  >
                  <img
                    src="@/assets/images/audited.png"
                    v-if="detail.State === goodsPriceOrderBasicStates.Audit"
                  >
                  <img
                    src="@/assets/images/auditBack.png"
                    v-if="detail.State === goodsPriceOrderBasicStates.Reject"
                  >
                  <img
                    src="@/assets/images/abandon.png"
                    v-if="detail.State === goodsPriceOrderBasicStates.Abandon"
                  >
                  <div>{{goodsPriceOrderBasicStates.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.PriceCode}}</td>
                <td class="tit">创建：</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateTime}}</td>
                <td class="tit">审核：</td>
                <td>{{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime | filterDateTime}}</td>
              </tr>
              <tr>
                <td class="tit">调价原因：</td>
                <td>{{detail.ReasonTypeDv}}</td>
                <td class="tit">备注：</td>
                <td class="note" colspan="3">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="checkPage-hd">
          <el-row>
            <el-col :span="12">
              <i class="icon-list"></i>
              <span class="title">货品列表</span>
            </el-col>
            <el-col :span="12" class="tr">
              <span class="detail-info-num-item">
                条码数量：
                <b class="num">{{total}}</b>
              </span>
            </el-col>
          </el-row>
        </div>

        <div class="padding-table">
          <!-- @module 数据表格 -->
          <el-table
            :data="goodsData"
            v-loading="$store.getters.tb_loading"
            element-loading-text="拼命加载中"
          >
            <el-table-column prop="BarCode" label="条码" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <span
                  @click="showDetailDialog(scope.row.GoodsId)"
                  class="init-button-text"
                  name="btnGoodsID"
                >{{scope.row.BarCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="StyleCode" label="款号" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoodsName" label="货品名称" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column
              prop="RetailType1"
              label="调价前零售方式"
              min-width="120"
              show-overflow-tooltip
            >
              <template slot-scope="scope">{{retailTypes.Types[scope.row.RetailType1]}}</template>
            </el-table-column>
            <el-table-column
              prop="RetailPrice1"
              label="调价前零售价/工费"
              min-width="120"
              show-overflow-tooltip
            >
              <template slot-scope="scope">￥{{$root.toFloat(scope.row.RetailPrice1)}}</template>
            </el-table-column>
            <el-table-column
              prop="RetailType2"
              label="调价后零售方式"
              min-wdith="120"
              show-overflow-tooltip
            >
              <template slot-scope="scope">{{retailTypes.Types[scope.row.RetailType2]}}</template>
            </el-table-column>
            <el-table-column
              prop="RetailPrice2"
              label="调价后零售价/工费"
              min-width="120"
              show-overflow-tooltip
            >
              <template slot-scope="scope">￥{{$root.toFloat(scope.row.RetailPrice2)}}</template>
            </el-table-column>
          </el-table>
          <!-- End 数据表格 -->
          <!-- Pagination -->
          <pagination
            :pg="pg"
            :size="size"
            :total="total"
            @currentChange="pageChange"
            @sizeChange="pageSizeChange"
          ></pagination>
        </div>
      </div>
    </div>
    <div class="buttons">
      <template
        v-if="detail.State === goodsPriceOrderBasicStates.Reject || detail.State === goodsPriceOrderBasicStates.Draft"
      >
        <el-button
          type="primary"
          @click="$router.push({path:'/sales/adjust/adjustEdit',query:{id:detail.PriceId}})"
          name="btnAdjustEdit"
        >编辑</el-button>
        <el-button @click="abandonDialog = true" name="btnAdjustAbandon">作废</el-button>
      </template>
      <el-button
        @click="auditDialog = true"
        v-if="detail.State === goodsPriceOrderBasicStates.Wait"
        name="btnAdjustAudit"
      >审核</el-button>
      <el-button @click="showPrint" name="btnPrint">打印</el-button>
      <el-button name="btnBack" @click="$router.back()">返回</el-button>
    </div>

    <!-- dialog 货品详情 -->
    <good-detail :visible.sync="goodDetailDialog.visible" :goodsId="goodDetailDialog.goodsId"></good-detail>
    <!-- end 货品详情-->

    <!-- @module Dialog·审核 -->
    <adjust-audit
      title="审核"
      v-if="auditDialog"
      :auditDialog="auditDialog"
      :data="detail"
      @listenAuditDialog="listenAuditDialog"
    ></adjust-audit>
    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <adjust-abandon
      title="作废"
      v-if="abandonDialog"
      :abandonDialog="abandonDialog"
      :abandonAdjust="detail"
      @listenAbandonDialog="listenAbandonDialog"
    ></adjust-abandon>
    <!-- End Dialog·作废 -->
    <!--  @module Dialog·打印订单  -->
    <print-order
      :visible.sync="printDialog"
      :conditions="encodeURIComponent(JSON.stringify({OrderId: priceCode }))"
      :printingType="SettingPrintingType.StockingCloudGoodsPriceOrderBasic"
    ></print-order>
    <!--  End Dialog·打印订单  -->
  </div>
</template>

<script>
import { YNStatus } from '@/enums/common.js'
import { GoodsPriceOrderBasicState, RetailType } from '@/enums/stocking.js'
import { SettingPrintingType } from '@/enums/merchant.js'
import {
  STOCKING_API_GOODS_PRICE_ORDER_BASIC_GET,
  STOCKING_API_GOODS_PRICE_ORDER_ITEM_GETS
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
import goodDetail from '@/components/erp/goodDetail'
import printOrder from '@/components/erp/printOrder'
import adjustAbandon from './adjustAbandon'
import adjustAudit from './adjustAudit'

export default {
  data() {
    return {
      SettingPrintingType,
      goodsPriceOrderBasicStates: GoodsPriceOrderBasicState,
      retailTypes: RetailType,
      labelPosition: 'right',
      adjustId: '',
      detail: {}, // 明细
      goodsData: [], // 货品数据
      pg: 1,
      size: 20,
      total: 0,
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      auditDialog: false, // 审核对话框
      abandonDialog: false, // 作废对话框
      printDialog: false,
      priceCode: '',
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.adjustId = parseInt(query.id)
      if (!this.adjustId) {
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
      STOCKING_API_GOODS_PRICE_ORDER_BASIC_GET({
        PriceId: this.adjustId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.editForm = res.data.Data
          this.detail = Object.assign({}, res.data.Data)
        }
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_GOODS_PRICE_ORDER_ITEM_GETS({
        PriceId: this.adjustId,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: this.pg,
        PageSize: this.size
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
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
    adjustAbandon() {
      this.abandonDialog = true
      this.abandonAdjust = this.detail
    },
    listenAbandonDialog(success) {
      if (success) {
        this.getDetail()
      }
      this.abandonDialog = false
    },
    listenAuditDialog(success) {
      if (success) {
        this.getDetail()
      }
      this.auditDialog = false
    },
    showDetailDialog(goodsId) {
      this.goodDetailDialog = {
        goodsId: goodsId,
        visible: true
      }
    },
    showPrint() {
      this.priceCode = this.detail.PriceCode
      this.printDialog = true
    },
  },
  mounted() {
    this.init()
  },
  components: {
    pagination,
    goodDetail,
    printOrder,
    adjustAudit,
    adjustAbandon
  }
}
</script>