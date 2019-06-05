<template>
  <el-dialog class="orderCheck" style="margin-top: -0.11px;" width="1000px" title="订单详情" :visible.sync="visible">
    <div class="panel-tag init-tag">
      <span>订单信息</span>
    </div>
    <table v-if="details.OrderCode" class="details-table" cellpadding="0" cellspacing="0">
      <tbody>
        <tr>
          <td class="tit">订单号</td>
          <td>{{details.OrderCode}}</td>
          <td class="tit">提交时间</td>
          <td>{{details.CreateTime}}</td>
          <td class="tit">订单状态</td>
          <td>{{spreadSaleOrderBasicState.Types[details.State]}}</td>
        </tr>
        <tr>
          <td class="tit">支付金额</td>
          <td>￥{{details.MktPrice}}</td>
          <td class="tit">支付方式</td>
          <td>{{paymentType.Types[details.PaymentType]}}</td>
          <td class="tit">支付单号</td>
          <td>{{details.PayNo}}</td>
        </tr>
        <tr>
          <td class="tit">会员ID</td>
          <td>{{details.MemberId}}</td>
          <td class="tit">姓名</td>
          <td>{{details.MemName && details.MemName != '' ? details.MemName : details.Share.TrueName1}}</td>
          <td class="tit">手机</td>
          <td>{{details.MemPhone && details.MemPhone != '' ? details.MemPhone : details.Share.Mobile1}}</td>
        </tr>
        <tr>
          <td class="tit">订单来源</td>
          <td>{{details.SpreadTitle}}</td>
          <td class="tit">订单类型</td>
          <td>{{ details.IsDirected == yNStatus.No ? spreadType.Types[details.SpreadType] : '普通订单'}}</td>
          <td class="tit">提货码</td>
          <td>{{details.State != spreadSaleOrderBasicState.WaitShip && details.Ship && details.Ship.ReceiptState > 0 ? details.ShipCode : ''}}</td>
        </tr>
        <tr>
          <td class="tit">提货门店</td>
          <td>{{ details.AddrName}}</td>
          <td class="tit">备注</td>
          <td colspan="3">{{ details.Note}}</td>
        </tr>
      </tbody>
    </table>
    <div class="panel-tag init-tag">
      <span>商品信息</span>
    </div>
    <el-table v-if="details.OrderCode" :data="[details]">
      <el-table-column show-overflow-tooltip prop="ProductId" label="商品编码" min-width="70"></el-table-column>
      <el-table-column show-overflow-tooltip prop="ProductName" label="商品名称" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="LabelPrice" label="原价" min-width="100">
        <template slot-scope="scope">￥{{scope.row.LabelPrice}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="SalePrice" label="售价" min-width="80">
        <template slot-scope="scope">￥{{scope.row.SalePrice}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="Quantity" label="数量" min-width="50"></el-table-column>
      <el-table-column show-overflow-tooltip prop="MktPrice" label="活动价" min-width="80">
        <template slot-scope="scope">￥{{scope.row.MktPrice}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="ShipFee" label="运费" min-width="50">
        <template slot-scope="scope">￥{{scope.row.ShipFee}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="OrderPrice" label="订单金额" min-width="80">
        <template slot-scope="scope">￥{{scope.row.OrderPrice}}</template>
      </el-table-column>
    </el-table>
    <div class="panel-tag init-tag" v-if="details.Ship && details.Ship.ShippingType == shippingType.PickedUp">
      <span>提货信息</span>
    </div>
    <table v-if="details.Ship && details.Ship.ShippingType == shippingType.PickedUp" class="details-table" cellpadding="0" cellspacing="0">
      <tbody>
        <tr>
          <td class="tit">提货人姓名</td>
          <td>{{details.MemName && details.MemName != '' ? details.MemName : details.Share.TrueName1}}</td>
          <td class="tit">提货人手机</td>
          <td>{{details.MemPhone && details.MemPhone != '' ? details.MemPhone : details.Share.Mobile1}}</td>
          <td class="tit">提货时间</td>
          <td>{{details.Ship.PickTime == '1900/01/01 00:00:00' ? '-' : details.Ship.PickTime}}</td>
        </tr>
        <tr>
          <td class="tit">商品来源</td>
          <td>{{(details.IsErped === yNStatus.Yes ? '' : '非') + 'ERP'}}</td>
          <td class="tit">商品条码</td>
          <td>{{details.StoreBarCode}}</td>
          <td class="tit">备注</td>
          <td>{{pickType.Types[details.Ship.PickType]}}</td>
        </tr>
      </tbody>
    </table>
    <div class="panel-tag init-tag" v-if="details.Ship && details.Ship.ShippingType == shippingType.Express">
      <span>邮寄信息</span>
    </div>
    <table v-if="details.Ship && details.Ship.ShippingType == shippingType.Express" class="details-table" cellpadding="0" cellspacing="0">
      <tbody>
        <tr>
          <td class="tit">物流名称</td>
          <td>{{expressType.Types[details.Ship.ExpressType]}}</td>
          <td class="tit">物流单号</td>
          <td>{{details.Ship.ExpressCode}}</td>
          <td class="tit">物流备注</td>
          <td>{{details.Ship.ExpressNote}}</td>
        </tr>
        <tr>
          <td class="tit">收货人</td>
          <td>{{details.Ship.ReceiptName}}</td>
          <td class="tit">手机</td>
          <td>{{details.Ship.ReceiptMobile}}</td>
          <td class="tit">地址</td>
          <td>{{details.Ship.ReceiptAddr}}</td>
        </tr>
      </tbody>
    </table>
    <div class="panel-tag init-tag">
      <span>订单操作记录</span>
    </div>
    <el-table class="m-b-10" :data="logData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="LogTime" label="时间" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="UserName" label="操作人" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Operation" label="操作描述" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Note" label="备注" show-overflow-tooltip></el-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button name="btnClose" @click="visible =  false">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  SPREAD_API_SPRORDER_DETAIL, SPREAD_API_SPRORDER_RETURNDETAIL
} from '@/apis/spread'
import {
  YNStatus
} from '@/enums/common'
import {
  SpreadSaleOrderBasicState, PaymentType, SpreadType, ShippingType, ExpressType, PickType, SpreadReturnOrderBasicState
} from '@/enums/spread'
export default {
  props: {
    checkVisible: {
      type: Boolean,
      default: false
    },
    checkId: {
      type: String,
      default: ''
    },
    returnId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      paymentType: PaymentType,
      spreadType: SpreadType,
      shippingType: ShippingType,
      pickType: PickType,
      yNStatus: YNStatus,
      expressType: ExpressType,
      spreadReturnOrderBasicState: SpreadReturnOrderBasicState,
      spreadSaleOrderBasicState: SpreadSaleOrderBasicState,
      id: this.checkId,
      visible: this.checkVisible,
      activeName: 'order',
      details: {
        Reason: 'ww'
      },
      returnDetail: {
      },
      returnLogs: [],
      logData: []
    }
  },
  methods: {
    getData() {
      SPREAD_API_SPRORDER_DETAIL({
        orderId: this.id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.details = res.data.Data
          let logData = res.data.Data.Logs.length
            ? JSON.parse(res.data.Data.Logs)
            : []
          logData.sort((a, b) => {
            return new Date(b.LogTime) - new Date(a.LogTime)
          })
          this.logData = logData
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getReturnDetail() {
      if (!this.returnId) {
        return false
      }
      SPREAD_API_SPRORDER_RETURNDETAIL({
        returnId: this.returnId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.returnDetail = res.data.Data
          let returnLogs = res.data.Data.Logs.length
            ? JSON.parse(res.data.Data.Logs)
            : []
          returnLogs.sort((a, b) => {
            return new Date(b.CheckTime) - new Date(a.CheckTime)
          })
          this.returnLogs = returnLogs
        } else {
          this.$message.error(res.data.Message)
        }
      })
    }
  },
  mounted() {
    this.getData()
    this.getReturnDetail()
  },
  watch: {
    visible: function () {
      this.$emit('listenCheckVisible', this.visible)
    }
  }
}
</script>
<style lang="scss">
@import '~@/assets/sass/spreadActive.scss';
.details-table.center td {
  text-align: center;
}
.orderCheck {
  .el-tabs {
    padding: 0;
    .el-tabs__header {
      border: none;
    }
    .el-tabs__content {
      border: none;
    }
  }
  .panel-tag span {
    width: 110px;
  }
}
</style>

