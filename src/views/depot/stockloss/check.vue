<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看报损单({{StuffType.Types[$route.query.StuffType]}})</span>
        <!-- <span @click="$router.back(-1)" class="title text-btn fr">返回</span> -->
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="4" class="state-img">
                  <img src="@/assets/images/draft.png" v-if="detail.State === stuffCountReportBasicState.Draft">
                  <img src="@/assets/images/auditing.png" v-if="detail.State === stuffCountReportBasicState.Wait">
                  <img src="@/assets/images/audited.png" v-if="detail.State === stuffCountReportBasicState.Audit">
                  <img src="@/assets/images/auditBack.png" v-if="detail.State === stuffCountReportBasicState.Reject">
                  <img src="@/assets/images/abandon.png" v-if="detail.State === stuffCountReportBasicState.Abandon || detail.State === stuffCountReportBasicState.Cancel">
                  <div>{{stuffCountReportBasicState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.ReportCode}}</td>
                <td class="tit">创建：</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime|filterDateTime}}</td>
                <td class="tit">审核：</td>
                <td v-if="detail.State === stuffCountReportBasicState.Audit || detail.State === stuffCountReportBasicState.Reject">
                  {{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime|filterDateTime}}
                </td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">位置：</td>
                <td>{{detail.WarehouseName || '仓库'}} > {{detail.ShelfName}}</td>
                <td class="tit">来源：</td>
                <td colspan="3">{{stuffCountReportBasicSourceType.Types[detail.SourceType] || '仓库'}}</td>
                <!-- <td class="tit">来源单号：</td>
                <td class="note">{{detail.CountCode?detail.CountCode:'-'}}</td> -->
              </tr>
              <tr>
                <td class="tit">备注：</td>
                <td class="note" colspan="5">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="checkPage-hd">
          <el-row>
            <el-col :span="12">
              <!-- <i class="icon-list"></i> -->
              <span class="title">货品列表</span>
            </el-col>
            <el-col :span="12" class="tr">
              <span class="detail-info-num-item">
                数量：<b class="num">{{detail.Quantity}}</b>
              </span>
              <span class="detail-info-num-item">
                重量：<b class="num">{{$root.toFloat(detail.Weight,3)}}{{$route.query.StuffType == StuffType.Stone?'ct':'g'}}</b>
              </span>
              <span class="detail-info-num-item">
                金额：<b class="num">￥{{$root.toFloat(detail.CostPrice)}}</b>
              </span>
            </el-col>
          </el-row>
        </div>
        <div class="p-x-10">
          <!-- @module 数据表格 -->
          <el-table :data="dataTable" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
            <el-table-column key="10" type="index" label="序号" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == StuffType.Gold" key="11" prop="GoldType" label="成色" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$store.getters.goldType.Types[scope.row.GoldType]}}
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="30" prop="StoneClassTypeEv" label="石料" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="31" prop="StonePackageNo" label="石号/包号" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == StuffType.Part" key="50" prop="PartTypeEv" label="配件名称" show-overflow-tooltip></el-table-column>
            <el-table-column key="12" prop="Weight" label="重量" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.Weight}}{{currTabs == StuffType.Stone?'ct':'g'}}
              </template>
            </el-table-column>
            <el-table-column key="13" prop="Quantity" label="数量" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="35" prop="StonePrice2" label="重单价" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="34" prop="StonePrice1" label="数单价" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == StuffType.Part" key="54" prop="PartPrice2" label="重单价" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == StuffType.Part" key="53" prop="PartPrice1" label="数单价" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == StuffType.Gold" key="14" prop="GoldPrice" label="金价(元/克)" show-overflow-tooltip></el-table-column>
            <el-table-column key="15" prop="CostPrice" label="金额" show-overflow-tooltip></el-table-column>
          </el-table>
          <!-- End 数据表格 -->
          <!-- Pagination -->
          <pagination :pg="pg" :size="size" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
          <!-- Pagination -->
        </div>
      </div>
    </div>
    <div class="buttons">
      <template v-if="detail.State == stuffCountReportBasicState.Reject || detail.State == stuffCountReportBasicState.Draft">
        <router-link :to="{path:'/depot/stockloss/edit',query:{id:detail.ReportId, StuffType:$route.query.StuffType}}" name="btnEdit">
          <el-button type="primary">
            编辑
          </el-button>
        </router-link>
        <el-button  @click="abandonDialog = true" name="btnAbandon">作废</el-button>
      </template>
      <el-button type="primary" @click="auditDialog = true" v-if="detail.State == stuffCountReportBasicState.Wait" name="btnAudit">审核</el-button>
      <el-button type="primary" @click="cancelDialog = true" v-if="detail.State == stuffCountReportBasicState.Audit" name="btnAuditCancel">取消审核</el-button>
      <el-button @click="$router.back(-1)">返回</el-button>
    </div>

    <!-- @module Dialog·审核 -->
    <auditDialog title="审核" v-if="auditDialog" :auditDialog="auditDialog" :data="[detail]" @listenAuditDialog="listenAuditDialog"></auditDialog>
    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <abandonDialog title="作废" v-if="abandonDialog" :abandonDialog="abandonDialog" :data="[detail]" @listenAbandonDialog="listenAbandonDialog"></abandonDialog>
    <!-- End Dialog·作废 -->

    <!-- @module Dialog·取消审核 -->
    <cancelDialog title="取消审核" v-if="cancelDialog" :cancelDialog="cancelDialog" :data="[detail]" @listenCancelDialog="listenCancelDialog"></cancelDialog>
    <!-- End Dialog·取消审核 -->

    <!-- @module Dialog·修改报损单基本信息-->
    <basic-edit title="修改报损单基本信息" v-if="editDialog" :editDialog="editDialog" :editForm="detail" @listenEditDialog="listenEditDialog"></basic-edit>
    <!-- End Dialog·修改报损单基本信息 -->

    <!-- dialog 货品详情 -->
    <good-detail v-if="goodDetailDialog.visible" :data="goodDetailDialog" @listenGoodDetailDialog="listenGoodDetailDialog"></good-detail>
    <!-- end 货品详情-->

  </div>
</template>

<script>
import {
  YNStatus,
  StuffType
} from '@/enums/common.js'
import {
  StuffCountReportBasicState,
  StuffCountReportBasicSourceType,
} from '@/enums/stocking.js'
import {
  STOCKING_API_STUFF_COUNT_REPORT_ITEM_GETS,
  STOCKING_API_STUFF_COUNT_REPORT_BASIC_GET
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
import auditDialog from './audit'
import abandonDialog from './abandon'
import cancelDialog from './cancel'
import goodDetail from '@/components/erp/goodDetail'

export default {
  data() {
    return {
      YNStatus,
      StuffType,
      stuffCountReportBasicState: StuffCountReportBasicState,
      stuffCountReportBasicSourceType: StuffCountReportBasicSourceType,
      labelPosition: 'right',
      ReportId: '',
      detail: {
      },
      dataTable: [],
      pg: 1,
      size: 20,
      total: 0,
      currTabs: 1,
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      abandonDialog: false, // 作废对话框
      cancelDialog: false, // 取消审核对话框
      auditDialog: false, // 审核对话框
      editDialog: false,
      printDialog: false,
      goodsCount: 0
    }
  },
  computed: {
    codeCount() {
      return this.dataTable.length
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.currTabs = Number(query.StuffType)
      this.ReportId = query.id
      if (!this.ReportId) {
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
      STOCKING_API_STUFF_COUNT_REPORT_BASIC_GET({
        ReportId: this.ReportId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_STUFF_COUNT_REPORT_ITEM_GETS({
        ReportId: this.ReportId,
        OrderBy: 0,
        IsAsced: this.YNStatus.Yes,
        PageIndex: this.pg,
        PageSize: this.size
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.dataTable = res.data.Data.Rows || []
          this.dataTable.forEach(item => {
            item.GoldPrice = this.$root.toFloat(item.GoldPrice)
            item.StonePrice1 = this.$root.toFloat(item.StonePrice1)
            item.StonePrice2 = this.$root.toFloat(item.StonePrice2)
            item.PartPrice1 = this.$root.toFloat(item.PartPrice1)
            item.PartPrice2 = this.$root.toFloat(item.PartPrice2)
            item.CostPrice = this.$root.toFloat(item.CostPrice)
            item.Weight = this.$root.toFloat(item.Weight, 3)
          })
          this.total = res.data.Data.Count || 0
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
    listenAbandonDialog(success) {
      if (success) {
        this.getDetail()
      }
      this.abandonDialog = false
    },
    listenCancelDialog(success) {
      if (success) {
        this.getDetail()
      }
      this.cancelDialog = false
    },
    listenAuditDialog(success) {
      if (success) {
        this.getDetail()
      }
      this.auditDialog = false
    },
    listenEditDialog() {
      this.editDialog = false
    },
    showDetailDialog(goodsId) {
      this.goodDetailDialog = {
        goodsId: goodsId,
        visible: true
      }
    },
    listenGoodDetailDialog() {
      this.goodDetailDialog.visible = false
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
    auditDialog,
    abandonDialog,
    cancelDialog
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
