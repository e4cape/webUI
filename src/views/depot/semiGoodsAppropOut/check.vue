<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看调拨出库单</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="6" class="tc">
                  <img src="@/assets/images/draft.png" v-if="detail.State === HalfAllotOrderOutakeState.Draft">
                  <img src="@/assets/images/auditing.png" v-if="detail.State === HalfAllotOrderOutakeState.Wait">
                  <img src="@/assets/images/audited.png" v-if="detail.State === HalfAllotOrderOutakeState.Audit">
                  <img src="@/assets/images/auditBack.png" v-if="detail.State === HalfAllotOrderOutakeState.Reject">
                  <img src="@/assets/images/abandon.png" v-if="detail.State === HalfAllotOrderOutakeState.Abandon">
                  <div>{{HalfAllotOrderOutakeState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.OutakeCode}}</td>
                <td class="tit">创建：</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateMinutes}}</td>
                <td class="tit">审核：</td>
                <td>
                  <template v-if="detail.State === HalfAllotOrderOutakeState.Audit || detail.State === HalfAllotOrderOutakeState.Reject">{{detail.CheckUser}} {{detail.CheckTime | filterDateMinutes}}</template>
                </td>
              </tr>
              <tr>
                <td class="tit">发货位置：</td>
                <td>{{detail.UnitedName1}}</td>
                <td class="tit">收货位置：</td>
                <td>{{detail.UnitedName2}}</td>
                <td class="tit">调拨原因：</td>
                <td>{{detail.ReasonTypeDv}}</td>
              </tr>
              <tr>
                <td class="tit">业务日期：</td>
                <td>{{detail.ActualDate | filterDate}}</td>
                <td class="tit">备注：</td>
                <td class="note" colspan="5">{{detail.Note}}</td>
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
                <b class="num">{{detail.AllotQty}}</b>
              </span>
              <span class="detail-info-num-item">
                重量：
                <b class="num">{{$root.toFloat(detail.AllotWgt,3)}}g</b>
              </span>
              <span class="detail-info-num-item">
                金额：
                <b class="num">{{$root.toFloat(detail.Preprice)}}</b>
              </span>
            </el-col>
          </el-row>
        </div>
        <div class="p-x-10">
          <!-- @module 数据表格 -->
          <el-table :data="goodsData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" class="m-b-10">
            <el-table-column type="index" label="序号" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="HalfName" label="半成品名称" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight" label="重量(g)" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="Quantity" label="数量" min-width="120"></el-table-column>
            <el-table-column prop="GoldPrice" label="金价(元/克)" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="Price" label="金额" min-width="120" :formatter="formatter" show-overflow-tooltip></el-table-column>
          </el-table>
          <!-- End 数据表格 -->
          <!-- Pagination -->
          <pagination :pg="pg" :size="size" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
        </div>
      </div>
    </div>
    <div class="buttons">
      <template v-if="detail.State === HalfAllotOrderOutakeState.Reject || detail.State === HalfAllotOrderOutakeState.Draft">
        <router-link :to="{path:'/depot/semiappropout/edit',query:{id: detail.OutakeId}}" name="btnEdit">
          <el-button type="primary">编辑</el-button>
        </router-link>
        <el-button @click="abandonDialog = true" name="btnAbandon">作废</el-button>
      </template>
      <el-button type="primary" @click="auditDialog = true" v-if="detail.State === HalfAllotOrderOutakeState.Wait" name="btnAudit">审核</el-button>
      <el-button type="default" @click="$router.back()" name="btnBack">返回</el-button>
    </div>
    <!-- @module Dialog·审核 -->
    <appropOut-audit :visible.sync="auditDialog" :data="[detail]" @listenAuditDialog="getDetail"></appropOut-audit>
    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <appropOut-abandon :visible.sync="abandonDialog" :data="detail" @listenAbandonDialog="getDetail"></appropOut-abandon>
    <!-- End Dialog·作废 -->
  </div>
</template>

<script>

import { YNStatus } from '@/enums/common.js'
import { HalfAllotOrderOutakeState } from '@/enums/stocking.js'
import {
  STOCKING_API_HALF_ALLOT_ORDER_OUTAKE_GET,
  STOCKING_API_HALF_ALLOT_ORDER_ITEM_GETS
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
import appropOutAudit from './appropOutAudit'
import appropOutAbandon from './appropOutAbandon'

export default {
  data() {
    return {
      HalfAllotOrderOutakeState,
      outakeId: '',
      detail: {}, // 明细
      goodsData: [], // 货品数据
      pg: 1,
      size: 20,
      total: 0,
      auditDialog: false,
      abandonDialog: false
    }
  },
  methods: {
    formatter(row, column, val) {
      switch (column.property) {
        case 'Weight':
          return this.$root.toFloat(val, 3) + 'g'
        default:
          return '￥' + this.$root.toFloat(val)
      }
    },
    init() {
      let query = this.$route.query
      this.outakeId = parseInt(query.id)
      if (!this.outakeId) {
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
      STOCKING_API_HALF_ALLOT_ORDER_OUTAKE_GET({
        OutakeId: this.outakeId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_HALF_ALLOT_ORDER_ITEM_GETS({
        OutakeId: this.outakeId,
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

    listenAuditDialog(success) {
      if (success) {
        this.getDetail()
      }
      this.auditDialog = false
    },
    listenAbandonDialog(success) {
      if (success) {
        this.getDetail()
      }
      this.abandonDialog = false
    }
  },
  mounted() {
    this.init()
  },
  components: {
    pagination,
    appropOutAudit,
    appropOutAbandon
  }
}
</script>
