<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看半成品调拨入库单</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0" v-loading="detailLoading">
            <tbody>
              <tr>
                <td rowspan="6" class="tc">
                  <!-- <img src="../../assets/images/draft.png" v-if="detail.State === HalfAllotOrderIntakeState.Draft"> -->
                  <img src="@/assets/images/auditing.png" v-if="detail.State === HalfAllotOrderIntakeState.Wait">
                  <img src="@/assets/images/audited.png" v-if="detail.State === HalfAllotOrderIntakeState.Audit">
                  <img src="@/assets/images/auditBack.png" v-if="detail.State === HalfAllotOrderIntakeState.Reject">
                  <!-- <img src="../../assets/images/abandon.png" v-if="detail.State === HalfAllotOrderIntakeState.Abandon"> -->
                  <div>{{HalfAllotOrderIntakeState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.OutakeCode}}</td>
                <td class="tit">发货：</td>
                <td>{{detail.SendTime | filterDateMinutes}}</td>
                <td class="tit">收货：</td>
                <td>
                  <template v-if=" detail.State === HalfAllotOrderIntakeState.Audit">{{detail.ReceiveUser | addStr }}{{detail.IntakeTime | filterDateMinutes}}</template>
                </td>
              </tr>
              <tr>
                <td class="tit">来源：</td>
                <td>{{detail.UnitedName1}}</td>
                <td class="tit">调拨原因：</td>
                <td>{{detail.ReasonTypeDv}}</td>
                <td class="tit">入库位置：</td>
                <td>{{detail.UnitedName2}}</td>
              </tr>
              <tr>
                <td class="tit">业务日期：</td>
                <td>{{detail.ActualDate | filterDate}}</td>
                <td class="tit">备注：</td>
                <td class="note" colspan="5">{{detail.CheckNote}}</td>
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
                <b class="num">￥{{$root.toFloat(detail.Preprice)}}</b>
              </span>
            </el-col>
          </el-row>
        </div>
        <div class="p-x-10">
          <!-- @module 数据表格 -->
          <el-table :data="goodsData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" class="m-b-10">
            <el-table-column type="index" label="序号" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="HalfName" label="半成品名称" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight" label="重量(g)" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Quantity" label="数量" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoldPrice" label="金价(元/克)" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Price" label="金额" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
          </el-table>
          <!-- End 数据表格 -->
          <!-- Pagination -->
          <pagination :pg="parameters.PageIndex" :size="parameters.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange" class="p-l-10"></pagination>
        </div>
      </div>
    </div>
    <div class="buttons">
      <template v-if="HalfAllotOrderIntakeState.Wait === detail.State">
        <el-button type="primary" @click="orderIntakeVisible = true" name="btnReceivedAppropIn">收货入库</el-button>
        <el-button @click="rejectDialog = true">退回</el-button>
      </template>
      <el-button type="default" @click="$router.back()" name="btnBack">返回</el-button>
    </div>

    <!-- @module Dialog·退回 -->
    <approp-in-reject :visible.sync="rejectDialog" :data="[detail]" @listenRejectDialog="getDetail"></approp-in-reject>
    <!-- End Dialog·退回 -->
    <order-intake :visible.sync="orderIntakeVisible" :data="[detail]" @listenOrderIntakeVisible="getDetail"></order-intake>
  </div>
</template>

<script>
import { YNStatus } from '@/enums/common.js'
import { HalfAllotOrderIntakeState } from '@/enums/stocking.js'
import {
  STOCKING_API_HALF_ALLOT_ORDER_INTAKE_REQ,
  STOCKING_API_HALF_ALLOT_ORDER_ITEM_GETS
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
import appropInReject from './appropInReject'
import orderIntake from './orderIntake'

export default {
  data() {
    return {
      HalfAllotOrderIntakeState,
      detail: {}, // 明细
      goodsData: [], // 货品数据
      parameters: {
        OutakeId: '',
        IntakeId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      rejectDialog: false,
      orderIntakeVisible: false,
      detailLoading: false
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
      this.parameters.IntakeId = parseInt(this.$route.query.id)
      if (!this.parameters.IntakeId) {
        this.dataError()
      } else {
        this.getDetail()
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
      STOCKING_API_HALF_ALLOT_ORDER_INTAKE_REQ({
        IntakeId: this.parameters.IntakeId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.parameters.OutakeId = res.data.Data.OutakeId
          this.getGoods()
        }
        this.detailLoading = false
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_HALF_ALLOT_ORDER_ITEM_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    currentChange(val) {
      this.parameters.PageIndex = val
      this.getGoods()
    },
    sizeChange(val) {
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.getGoods()
    }
  },
  filters: {
    addStr(value) {
      return value ? value + ' - ' : ''
    }
  },
  mounted() {
    this.init()
  },
  components: {
    pagination,
    appropInReject,
    orderIntake
  }
}
</script>
