<template>
  <el-dialog class="orderCheck" style="margin-top: -0.11px;" width="1000px" title="订单详情" :visible.sync="visible">
    <el-tabs v-model="activeName" class="c-unset m-t-10" type="card">
      <el-tab-pane label="退款单" name="return" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <el-alert v-if="!returnDetail.ReturnCode" title="温馨提示：因未发订单，无退款单！" type="warning" center :closable="false"></el-alert>
        <div v-else>
          <div class="panel-tag init-tag">
            <span>退款单信息</span>
          </div>
          <table v-if="returnDetail.ReturnCode" class="details-table" cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">退款单号</td>
                <td>{{returnDetail.ReturnCode}}</td>
                <td class="tit">创建时间</td>
                <td>{{returnDetail.CreateTime}}</td>
                <td class="tit">创建人</td>
                <td>{{returnDetail.CreateUser}}</td>
              </tr>
              <tr>
                <td class="tit">状态</td>
                <td>{{spreadReturnOrderBasicState.Types[returnDetail.State]}}</td>
                <td class="tit">订单号</td>
                <td>{{returnDetail.OrderCode}}</td>
                <td class="tit">订单来源</td>
                <td>{{returnDetail.SpreadTitle}}</td>
              </tr>
              <tr>
                <td class="tit">应退金额</td>
                <td>￥{{returnDetail.OrderPrice}}</td>
                <td class="tit">实退金额</td>
                <td><template v-if="returnDetail.State == spreadReturnOrderBasicState.Audit">￥{{returnDetail.ReturnPrice}}</template></td>
                <td class="tit">退货/退款原因</td>
                <td>{{returnDetail.Note}}</td>
              </tr>
            </tbody>
          </table>

          <div class="panel-tag init-tag">
            <span>售后处理</span>
          </div>

          <el-table :data="afterSaleData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
            <el-table-column prop="CheckTime" label="时间" width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="CheckUser" label="操作人" width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="CheckState" label="结果" show-overflow-tooltip>
              <template slot-scope="scope">
                {{spreadReturnOrderBasicState.Types[scope.row.CheckState]}}
              </template>
            </el-table-column>
            <el-table-column prop="CheckNote" label="备注" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>

      </el-tab-pane>
      <el-tab-pane label="订单" name="order" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
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
              <td>￥{{details.OrderPrice}}</td>
              <td class="tit">支付方式</td>
              <td>{{paymentType.Types[details.PaymentType]}}</td>
              <td class="tit">支付单号</td>
              <td>{{details.PayNo}}</td>
            </tr>
            <tr>
              <td class="tit">会员ID</td>
              <td>{{details.MemberId}}</td>
              <td class="tit">姓名</td>
              <!-- 兼容老数据 -->
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
              <td >{{ details.AddrName}}</td>
              <td class="tit">备注</td>
              <td colspan="3">{{details.Note}}</td>
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
            <template slot-scope="scope">
              ￥{{scope.row.LabelPrice}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="SalePrice" label="售价" min-width="80">
            <template slot-scope="scope">
              ￥{{scope.row.SalePrice}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="Quantity" label="数量" min-width="50"></el-table-column>
          <el-table-column show-overflow-tooltip prop="MktPrice" label="活动价" min-width="80">
            <template slot-scope="scope">
              ￥{{scope.row.MktPrice}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="ShipFee" label="运费" min-width="50">
            <template slot-scope="scope">
              ￥{{scope.row.ShipFee}}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="OrderPrice" label="订单金额" min-width="80">
            <template slot-scope="scope">
              ￥{{scope.row.OrderPrice}}
            </template>
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
        <div class="panel-tag init-tag"  v-if="details.Ship && details.Ship.ShippingType == shippingType.Express">
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
        <el-table :data="logData" class="m-b-10" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
          <el-table-column prop="LogTime" label="时间" width="140" show-overflow-tooltip></el-table-column>
          <el-table-column prop="UserName" label="操作人" width="140" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Operation" label="操作描述" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Note" label="备注" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button name="btnClose" @click="visible =  false">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  SpreadReturnOrderBasicState,
  SpreadSaleOrderBasicState,
  PaymentType,
  SpreadType,
  ShippingType,
  ExpressType,
  PickType
} from '@/enums/spread'
import { YNStatus } from '@/enums/common'
import {
  SPREAD_API_SPRORDER_DETAIL,
  SPREAD_API_SPRORDER_RETURNDETAIL
} from '@/apis/spread'
export default {
  props: {
    checkId: {
      type: String
    },
    checkVisible: {
      type: Boolean,
      default: false
    },
    returnId: {
      type: String
    }
  },
  data() {
    return {
      pickType: PickType,
      expressType: ExpressType,
      shippingType: ShippingType,
      spreadType: SpreadType,
      yNStatus: YNStatus,
      paymentType: PaymentType,
      spreadReturnOrderBasicState: SpreadReturnOrderBasicState,
      spreadSaleOrderBasicState: SpreadSaleOrderBasicState,
      id: this.checkId,
      visible: this.checkVisible,
      activeName: 'return',
      details: {
      },
      afterSaleData: [],
      logData: [],
      returnDetail: {
        Reason: 'ww'
      }
    }
  },
  methods: {
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_SPRORDER_DETAIL({
        orderId: this.id
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
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
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_SPRORDER_RETURNDETAIL({
        returnId: this.returnId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.returnDetail = res.data.Data
          let afterSaleData = res.data.Data.Logs.length
            ? JSON.parse(res.data.Data.Logs)
            : []
          afterSaleData.sort((a, b) => {
            return new Date(b.CreateTime) - new Date(a.CreateTime)
          })
          this.afterSaleData = afterSaleData
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
    visible: function() {
      this.$emit('listenCheckVisible', this.visible)
    }
  }
}
</script>
<style lang="scss">
@import '~@/assets/sass/spreadActive.scss';
.c-unset .el-tabs__nav-scroll .el-tabs__nav {
  border-radius: 0;
  .el-tabs__item {
    border-bottom: 1px solid #f5f5f5;
  }
}
.details-table .tit,
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
  .el-dialog__body {
    padding: 0;
  }
  .panel-tag span {
    width: 110px;
  }
}
</style>

