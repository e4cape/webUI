<template>
  <div class="content" v-loading="detailLoading">
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
                  <img src="@/assets/images/draft.png" v-if="detail.State === HalfCountReportBasicState.Draft">
                  <img src="@/assets/images/auditing.png" v-if="detail.State === HalfCountReportBasicState.Wait">
                  <img src="@/assets/images/audited.png" v-if="detail.State === HalfCountReportBasicState.Audit">
                  <img src="@/assets/images/auditBack.png" v-if="detail.State === HalfCountReportBasicState.Reject">
                  <img src="@/assets/images/abandon.png" v-if="detail.State === HalfCountReportBasicState.Abandon || detail.State === HalfCountReportBasicState.Cancel">
                  <div>{{HalfCountReportBasicState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.ReportCode}}</td>
                <td class="tit">创建：</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateMinutes}}</td>
                <td class="tit">审核：</td>
                <td>
                  <template v-if="detail.State === HalfCountReportBasicState.Audit || detail.State === HalfCountReportBasicState.Reject">{{detail.CheckUser}} {{detail.CheckTime | filterDateMinutes}}</template>
                </td>
              </tr>
              <tr>
                <td class="tit">位置：</td>
                <td>{{`${detail.WarehouseName}>${detail.ShelfName}`}}</td>
                <td class="tit">来源：</td>
                <td>{{HalfCountReportBasicSourceType.Types[detail.SourceType]}}</td>
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
                数量：
                <b class="num">{{detail.Quantity}}</b>
              </span>
              <span class="detail-info-num-item">
                重量：
                <b class="num">{{$root.toFloat(detail.Weight,3)}}g</b>
              </span>
              <span class="detail-info-num-item">
                金额：
                <b class="num">￥{{$root.toFloat(detail.CostPrice)}}</b>
              </span>
            </el-col>
          </el-row>
        </div>
        <div class="p-x-10">
          <!-- @module 数据表格 -->
          <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" class="m-b-10">
            <el-table-column type="index" label="序号" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="HalfName" label="半成品名称" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight" label="重量(g)" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Quantity" label="数量" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoldPrice" label="金价(元/克)" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="CostPrice" label="金额" :formatter="formatter" min-width="90" show-overflow-tooltip></el-table-column>
          </el-table>
          <!-- End 数据表格 -->
          <!-- Pagination -->
          <pagination :pg="goodsParam.PageIndex" :size="goodsParam.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
        </div>
      </div>
    </div>
    <div class="buttons">
      <template v-if="detail.State === HalfCountReportBasicState.Reject || detail.State === HalfCountReportBasicState.Draft">
        <router-link :to="{path: '/depot/semistockover/edit',query:{id:detail.ReportId}}" name="btnEdit">
          <el-button type="primary">编辑</el-button>
        </router-link>
        <el-button @click="abandonDialog = true" name="btnAbandon">作废</el-button>
      </template>
      <el-button type="primary" @click="auditDialog = true" v-if="detail.State === HalfCountReportBasicState.Wait" name="btnAudit">审核</el-button>
      <el-button type="primary" @click="cancelDialog = true" v-if="detail.State === HalfCountReportBasicState.Audit" name="btnCancelAudit">取消审核</el-button>
      <el-button type="default" @click="$router.back()">返回</el-button>
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
  </div>
</template>

<script>
import { YNStatus } from '@/enums/common'
import {
  HalfCountReportBasicState,
  HalfCountReportBasicSourceType,
  HalfCountReportBasicReportType
} from '@/enums/stocking.js'
import {
  STOCKING_API_HALF_COUNT_REPORT_BASIC_GET2,
  STOCKING_API_HALF_COUNT_REPORT_ITEM_GETS
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
import audit from './audit'
import abandon from './abandon'
import cancel from './cancel'

export default {
  data() {
    return {
      HalfCountReportBasicState,
      HalfCountReportBasicSourceType,
      HalfCountReportBasicReportType,
      detail: {},
      data: [],
      total: 0,
      goodsParam: {
        ReportId: this.$route.query.id,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      abandonDialog: false, // 作废对话框
      cancelDialog: false, // 取消审核对话框
      auditDialog: false, // 审核对话框
      detailLoading: false
    }
  },
  methods: {
    formatter(row, column, val) {
      switch (column.property) {
        case 'Weight':
          return this.$root.toFloat(val, 3)
        case 'GoldPrice':
        case 'CostPrice':
          return this.$root.toFloat(val)
        default:
          break
      }
    },
    init() {
      if (!this.$route.query.id) {
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
      })
        .then(() => {
          this.$router.back()
        })
        .catch(() => {
          this.$router.back()
        })
    },
    getDetail() {
      this.detailLoading = true
      STOCKING_API_HALF_COUNT_REPORT_BASIC_GET2({
        ReportId: this.$route.query.id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
        this.detailLoading = false
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_HALF_COUNT_REPORT_ITEM_GETS(this.goodsParam).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    currentChange(val) {
      // 切换当前页
      this.goodsParam.PageIndex = val
      this.getGoods()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.goodsParam.PageIndex = 1
      this.goodsParam.PageSize = val
      this.getGoods()
    }
  },
  created() { },
  mounted() {
    this.init()
  },
  components: {
    pagination,
    audit,
    abandon,
    cancel
  }
}
</script>
