
<template  >
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看退货单 <template v-if="characterType==CharacterType.Company">（{{$route.query.storeName}}）</template></span>
        <!-- <span class="title">查看退货单({{detail.StoreName}})</span> -->
        <!-- <span @click="$router.back(-1)" class="title fr text-btn">返回</span> -->
      </div>
      <div
        class="panel-bd details-table-dialog"
        v-loading="$store.getters.tb_loading"
        element-loading-text="拼命加载中"
      >
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.ReturnCode}}</td>
                <td class="tit">退货时间</td>
                <td v-if="$route.query.State == retailOrderReturnState.Audit">{{detail.RCreateTime | filterDateMinutes}}</td>
                <td v-else>-</td>
                <td class="tit">来源</td>
                <td>{{retailOrderReturnSourceTypes.Types[detail.RSourceType]}}</td>
              </tr>
              <tr>
                <td class="tit">商品售价</td>
                <td>￥{{$root.toFloat(detail.ProductPrice)}}</td>
                <td class="tit">实付金额</td>
                <td>￥{{$root.toFloat(detail.CashPrice)}}</td>
                <td class="tit">应退金额</td>
                <td>￥{{$root.toFloat(detail.RAwaitPrice)}}</td>
              </tr>
              <tr>
                <td class="tit">实退金额</td>
                <td>￥{{$root.toFloat(detail.ReturnPrice)}}</td>
                <td class="tit">原销售单</td>
                <td>{{detail.MasterCode}}</td>
                <td class="tit">原消费单</td>
                <td>{{detail.SellCode}}</td>
              </tr>
              <tr>
                <td class="tit">创建人</td>
                <td>{{detail.RCreateUser}}</td>
                <td class="tit">会员ID</td>
                <td>{{detail.MemberId}}</td>
                <td class="tit">会员手机</td>
                <td>{{detail.Mobile}}</td>
              </tr>
              <tr>
                <td class="tit">备注</td>
                <td class="note" colspan="5">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="checkPage-hd">
          <el-row>
            <el-col :span="12">
              <!-- <i class="icon-list"></i> -->
              <span class="title">销售详情</span>
            </el-col>
          </el-row>
        </div>
        <div class="details-info-table" style="margin-top:0;">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">条码</td>
                <td>{{detail.StoreBarCode}}</td>
                <td class="tit">款号</td>
                <td>{{detail.StoreStyleNumber}}</td>
                <td class="tit">货品名称</td>
                <td>{{detail.GoodsName}}</td>
              </tr>
              <tr>
                <td class="tit">金重：</td>
                <td class="note" colspan="1">{{$root.toFloat(detail.GoldWeight,3)}}</td>
                <td class="tit">金价：</td>
                <td class="note" colspan="1">￥{{$root.toFloat(detail.GoldPrice)}}</td>
                <td class="tit">零售方式：</td>
                <td class="note" colspan="1">{{retailTypes.Types[detail.RetailType]}}</td>
              </tr>
              <tr>
                <td class="tit">标签价：</td>
                <td class="note" colspan="1">￥{{$root.toFloat(detail.LabelPrice)}}</td>
                <td class="tit">折扣：</td>
                <td class="note" colspan="1">{{$root.toFloat(detail.Discount * 100) + '%'}}</td>
                <td class="tit">销售价：</td>
                <td class="note" colspan="1">￥{{$root.toFloat(detail.ProductPrice)}}</td>
              </tr>
              <tr>
                <td class="tit">工费(元/件)：</td>
                <td class="note" colspan="1">￥{{$root.toFloat(detail.WorkPrice)}}</td>
                <td class="tit">应付金额：</td>
                <td
                  class="note"
                  colspan="1"
                >￥{{$root.toFloat(detail.ProductPrice + detail.WorkPrice)}}</td>
                <td class="tit">卡券抵扣金额：</td>
                <td class="note" colspan="1">￥{{$root.toFloat(detail.CouponPrice)}}</td>
              </tr>
              <tr>
                <td class="tit">卡券换购旧货回收金额：</td>
                <td class="note" colspan="1">{{$root.toFloat(detail.RecyclePrice)}}</td>
                <td class="tit">折旧工费：</td>
                <td class="note" colspan="1">{{$root.toFloat(detail.CpfeePrice)}}</td>
                <td class="tit">实付金额：</td>
                <td class="note" colspan="1">{{$root.toFloat(detail.CashPrice)}}</td>
              </tr>
              <tr>
                <td class="tit">卡券类型：</td>
                <td
                  class="note"
                  colspan="1"
                >{{retailOrderSellSettleCouponTypes.Types[detail.CouponType]}}</td>
                <td class="tit">卡券编号：</td>
                <td class="note" colspan="1">{{detail.CouponId}}</td>
                <td class="tit">参与活动：</td>
                <td class="note" colspan="1">{{detail.MarproTitle}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <el-button @click="printDialog=true" class="m-t-10">打印</el-button>
    <el-button @click="$router.back(-1)">返回</el-button>
    <!--  dialog 货品详情  -->
    <good-detail
      v-if="goodDetailDialog.visible"
      :data="goodDetailDialog"
      @listenGoodDetailDialog="listenGoodDetailDialog"
    ></good-detail>
    <!--  end 货品详情 -->

    <!-- @module Dialog·打印 -->
    <print-order title="打印" v-if="printDialog" :visible.sync="printDialog" :conditions="encodeURIComponent(JSON.stringify(Object.assign({OrderId: returnCode})))" :printingType="settingPrintingType.OrderCloudRetailOrderReturn"></print-order>
    <!-- End Dialog·打印 -->
  </div>
</template>
<script>
import {
  CharacterType
} from '@/enums/common.js'
import {
  SettingPrintingType
} from '@/enums/merchant.js'
import {
  RetailOrderReturnState,
  RetailOrderSellSettleCouponType,
  RetailOrderReturnSourceType
} from '@/enums/order.js'
import {
  RetailType
} from '@/enums/stocking.js'
import {
  ORDER_API_RETAIL_ORDER_RETURN_GET 
} from '@/apis/order.js'

import goodDetail from '@/components/erp/goodDetail'
import printOrder from '@/components/erp/printOrder'
export default {
  data() {
    return {
      CharacterType,
      settingPrintingType: SettingPrintingType,
      retailOrderReturnState: RetailOrderReturnState,
      retailOrderReturnSourceTypes: RetailOrderReturnSourceType,
      retailTypes: RetailType,
      retailOrderSellSettleCouponTypes: RetailOrderSellSettleCouponType,
      returnCode: '',
      detail: {
        Discount: 0
      },
      salesDetail: {
      },
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      printDialog: false,
    }
  },
  methods: {
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
      console.log(111)
      this.$store.commit('SET_TB_LOADING', true) // table loading
      ORDER_API_RETAIL_ORDER_RETURN_GET({
        ReturnCode: this.returnCode
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          // this.getSalesDetail()
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    // getSalesDetail () {
    //   this.$store.commit('SET_TB_LOADING', true) // table loading
    //   this.API_SALE_SETTLEDETAIL({
    //     SaleId: this.detail.SaleId
    //   }).then(res => {
    //     this.$store.commit('SET_TB_LOADING', false) // table loading
    //     if (res.data.Code === 'CORRECT') {
    //       this.salesDetail = res.data.Data
    //     } else {
    //       this.$message.error('销售详情加载失败')
    //     }
    //   })
    // },
    showDetailDialog(goodsId) {
      this.goodDetailDialog = {
        goodsId: goodsId,
        visible: true
      }
    },
    listenGoodDetailDialog() {
      this.goodDetailDialog.visible = false
    }
  },
  beforeMount() {
    this.returnCode = this.$route.query.code
    if (!this.returnCode) {
      this.dataError()
    }
  },
  mounted() {
    this.getDetail()
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  components: {
    goodDetail,
    printOrder,
  }
}
</script>
<style lang="scss" scoped="true">
</style>