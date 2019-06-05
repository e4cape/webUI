<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看调拨入库单</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="7" class="tc">
                  <!-- <img src="../../assets/images/draft.png" v-if="detail.State === GoodsAllotOrderIntakeState.Draft"> -->
                  <img src="@/assets/images/auditing.png" v-if="detail.State === GoodsAllotOrderIntakeState.Wait">
                  <img src="@/assets/images/audited.png" v-if="detail.State === GoodsAllotOrderIntakeState.Audit">
                  <img src="@/assets/images/auditBack.png" v-if="detail.State === GoodsAllotOrderIntakeState.Reject">
                  <!-- <img src="../../assets/images/abandon.png" v-if="detail.State === GoodsAllotOrderIntakeState.Abandon"> -->
                  <div>{{GoodsAllotOrderIntakeState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.OutakeCode}}</td>
                <td class="tit">发货：</td>
                <td>{{detail.SendTime | filterDateMinutes}}</td>
                <td class="tit">收货：</td>
                <td>
                  <template v-if="detail.State === GoodsAllotOrderIntakeState.Audit">{{detail.ReceiveUser | addStr }}{{detail.IntakeTime | filterDateMinutes}}</template>
                </td>
              </tr>
              <tr>
                <td class="tit">来源：</td>
                <td>{{detail.UnitedName1}}</td>
                <td class="tit">来源单号：</td>
                <td>{{detail.OutakeCode}}</td>
                <td class="tit">调拨原因：</td>
                <td>{{detail.ReasonTypeDv}}</td>
              </tr>
              <tr>
                <td class="tit">收货方式：</td>
                <td>{{ShippingType.Types[detail.ShippingType]}}</td>
                <td class="tit">发货人：</td>
                <td>{{detail.SendUser}}</td>
                <td class="tit">发货人电话：</td>
                <td>{{detail.SendPhone}}</td>
              </tr>
              <tr>
                <td class="tit">快递单号：</td>
                <td>{{detail.ExpressCode}}</td>
                <td class="tit">快递公司：</td>
                <td>{{ExpressType.Types[detail.ExpressType]}}</td>
                <template v-if="characterType === CharacterType.Store">
                  <td class="tit">业务日期：</td>
                  <td class="note">{{detail.ActualDate | filterDate}}</td>
                </template>
                <template v-else>
                  <td class="tit">入库仓库：</td>
                  <td>{{detail.WarehouseName2? `${detail.WarehouseName2} > ${detail.ShelfName2}` : detail.UnitedName2 }}</td>
                </template>
              </tr>
              <tr>
                <template  v-if="characterType === CharacterType.Company">
                  <td class="tit">业务日期：</td>
                  <td class="note">{{detail.ActualDate | filterDate}}</td>
                </template>
                
                <td class="tit">备注：</td>
                <td class="note" colspan="5">{{detail.Note2}}</td>
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
                <b class="num">{{total}}</b>
              </span>
              <span class="detail-info-num-item">
                货品总数：
                <b class="num">{{detail.GoodsQty}}</b>
              </span>
              <span class="detail-info-num-item">
                结算金额：
                <b class="num">￥{{$root.toFloat(detail.Preprice)}}</b>
              </span>
            </el-col>
          </el-row>
        </div>

        <!-- @module 数据表格 -->
        <div class="p-x-10">
          <el-table :data="goodsData" v-loading="$store.getters.tb_loading" class="m-b-10">
            <el-table-column prop="BarCode" label="条码" min-width="80" show-overflow-tooltip fixed>
              <template slot-scope="scope">
                <span @click="showDetailDialog(scope.row.GoodsId)" class="init-button-text" name="btnShowDetail">{{scope.row.BarCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="StyleCode" label="款号" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoodsName" label="货品名称" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoldWeight" label="金重（g）" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="Weight" label="货重（g）" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="Stone1Weight" label="主石重（ct）" :formatter="formatter" min-width="120"></el-table-column>
            <!-- <el-table-column prop="" label="主石颜色" min-width="120"></el-table-column>
            <el-table-column prop="" label="主石净度" min-width="120"></el-table-column> -->
            <el-table-column prop="LabelPrice" label="标签价" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="AbaseFee" label="基础工费" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="AattaFee" label="附加工费" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="AbrandFee" label="品牌费" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="ApartFee" label="配件价格" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="AllianFee" label="证盟费" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="Discount" label="结算折扣" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="AservFee" label="服务费" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="UnitPrice" label="结算价" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Quantity" label="数量" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="SumPrice" label="金额" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
          </el-table>
          <!-- End 数据表格 -->
          <!-- Pagination -->
          <pagination :pg="goodsParam.PageIndex" :size="goodsParam.PageSize" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
        </div>
      </div>
    </div>
    <div class="buttons">
      <template v-if="detail.State === GoodsAllotOrderIntakeState.Wait">
        <el-button type="primary" @click="receiveAppropIn($event)" name="btnReceivedAppropIn">收货入库</el-button>
        <router-link :to="{path:'/depot/goodsappropin/edit',query: this.$route.query}" name="btnAppropInEdit">
          <el-button>核对</el-button>
        </router-link>
      </template>
      <el-button @click="$router.back()" name="back">返回</el-button>
    </div>

    <!-- dialog 货品详情 -->
    <good-detail :visible.sync="goodDetailDialog.visible" :goodsId="goodDetailDialog.goodsId" :kindType="detail.KindTypeEk"></good-detail>
    <!-- end 货品详情-->
    <!-- 收货入库 -->
    <receive :visible.sync="appropInDialog" :data="detail" @appropInReceived="appropInReceived"></receive>
  </div>
</template>

<script>
import { CharacterType, ShippingType, ExpressType, YNStatus } from '@/enums/common.js'
import { GoodsAllotOrderIntakeState } from '@/enums/stocking.js'
import {
  STOCKING_API_GOODS_ALLOT_ORDER_GOODS_GETS,
  STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_RECEIVE,
  STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_REQ
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
import goodDetail from '@/components/erp/goodDetail'
import receive from './receive'

export default {
  data() {
    return {
      CharacterType,
      GoodsAllotOrderIntakeState,
      ShippingType,
      ExpressType,
      detail: {}, // 明细
      goodsData: [], // 货品数据
      goodsParam: {
        OutakeId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      appropInDialog: false,
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  methods: {
    formatter(row, column, val) {
      switch (column.property) {
        case 'GoldWeight':
        case 'Weight': 
          return this.$root.toFloat(val, 3) + 'g'
        case 'Stone1Weight':
          return this.$root.toFloat(val, 3) + 'ct'
        case 'Discount':
          return this.$root.toFloat(val)
        default:
          return '￥' + this.$root.toFloat(val)
      }
    },
    receiveAppropIn($event) { // 收货入库
      if (this.characterType === CharacterType.Company) {
        this.appropInDialog = true
      } else {
        $event.currentTarget.blur()
        this.appropInReceived()
      }
    },

    appropInReceived( form) {
      let params
      if (form) {
        params = { IntakeId: this.detail.IntakeId, ...form }
      } else {
        params = {
          IntakeId: this.detail.IntakeId
        }
      }
      this.$confirm(
        '您正在进行收货入库操作，入库后不可撤销！确定收货入库？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_RECEIVE(params).then(
          res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.appropInDialog = false
              this.getDetail()
            }
            this.$store.commit('SET_BTN_LOADING', false)
          }
        )
      }).catch(() => {})
    },
    init() {
      if (!this.$route.query.id) {
        this.dataError()
      } else {
        this.getDetail().then(() => {this.getGoods()})
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
      this.$store.commit('SET_FULL_LOADING', true)
      return STOCKING_API_GOODS_ALLOT_ORDER_INTAKE_REQ({
        IntakeId: this.$route.query.id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.goodsParam.OutakeId = this.detail.OutakeId
        }
        this.$store.commit('SET_FULL_LOADING', false)
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_GOODS_ALLOT_ORDER_GOODS_GETS(this.goodsParam).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    pageChange(val) {
      this.goodsParam.PageIndex = val
      this.getGoods()
    },
    pageSizeChange(val) {
      this.goodsParam.PageIndex = 1
      this.goodsParam.PageSize = val
      this.getGoods()
    },
    showDetailDialog(goodsId) {
      this.goodDetailDialog = {
        goodsId: goodsId,
        visible: true
      }
    },

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
    goodDetail,
    receive
  }
}
</script>
