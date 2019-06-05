<template>
  <el-dialog title="邮寄" width="800px" :visible.sync="visible" custom-class="orderMail">
    <div class="panel-tag init-tag">
      <span>商品</span>
    </div>
    <el-table v-if="details.OrderCode" :data="[details]">
      <el-table-column show-overflow-tooltip  prop="ProductId" label="商品编码" min-width="70"></el-table-column>
      <el-table-column show-overflow-tooltip  prop="ProductName" label="商品名称" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip  prop="LabelPrice" label="原价" min-width="100">
        <template slot-scope="scope">
          ￥{{scope.row.LabelPrice}}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip  prop="SalePrice" label="售价" min-width="80">
        <template slot-scope="scope">
          ￥{{scope.row.SalePrice}}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip  prop="Quantity" label="数量" min-width="50"></el-table-column>
      <el-table-column show-overflow-tooltip  prop="MktPrice" label="活动价" min-width="80">
        <template slot-scope="scope">
          ￥{{scope.row.MktPrice}}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip  prop="ShipFee" label="运费" min-width="50">
        <template slot-scope="scope">
          ￥{{scope.row.ShipFee}}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip  prop="OrderPrice" label="订单金额" min-width="80">
        <template slot-scope="scope">
          ￥{{scope.row.OrderPrice}}
        </template>
      </el-table-column>
    </el-table>
    
    <div class="panel-tag init-tag">
      <span>核销</span>
    </div>

    <table class="details-table" cellpadding="0" cellspacing="0">
      <tbody>
        <tr>
          <td class="tit">
            <span class="required">提货码</span>
          </td>
          <td>
            <el-input name="shipCode" class="input-init m-r-5" :maxlength="50" v-model="shipCode"></el-input>
            <span class="tag">输入用户提供的提货码</span>
          </td>
        </tr>
        <tr>
          <td class="tit ">
            <span class="required">商品来源</span>
          </td>
          <td>
            <el-radio-group name="isErped" v-model="isErped">
              <el-radio :label="yNStatus.No">非ERP</el-radio>
              <el-radio :label="yNStatus.Yes">ERP</el-radio>
            </el-radio-group>
          </td>
        </tr>
        <tr>
          <td class="tit">
            <span :class="{'required' : isErped === yNStatus.Yes}">商品条码</span>
          </td>
          <td>
            <el-input name="storeBarCode" class="input-init" :maxlength="50" v-model="storeBarCode"></el-input>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="panel-tag init-tag">
      <span>收货人</span>
    </div>

    <table class="details-table" cellpadding="0" cellspacing="0">
      <tbody>
        <tr>
          <td class="tit">
            <span class="required">姓名</span>
          </td>
          <td>
            <el-input name="receiptName" class="input-init" :maxlength="50" v-model="receiptName"></el-input>
          </td>
        </tr>
        <tr>
          <td class="tit ">
            <span class="required">手机</span>
          </td>
          <td>
            <el-input name="receiptMobile" class="input-init" :maxlength="11" v-model="receiptMobile"></el-input>
          </td>
        </tr>
        <tr>
          <td class="tit">
            <span class="required">收货地址</span>
          </td>
          <td>
            <el-input name="receiptAddr" class="input-init" :maxlength="100" v-model="receiptAddr"></el-input>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="panel-tag init-tag">
      <span>物流</span>
    </div>

    <table class="details-table" cellpadding="0" cellspacing="0">
      <tbody>
        <tr>
          <td class="tit">物流名称</td>
          <td>
            <el-select name="expressType" v-model="expressType" :filterable="true">
              <el-option v-for="(item, index) in expressTypeTypes.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td class="tit">物流单号</td>
          <td>
            <el-input name="expressCode" class="input-init" :maxlength="50" v-model="expressCode"></el-input>
          </td>
        </tr>
        <tr>
          <td class="tit">备注</td>
          <td>
            <el-input name="expressNote" class="input-init" :maxlength="200" v-model="expressNote"></el-input>
          </td>
        </tr>
      </tbody>
    </table>

    <div slot="footer" class="dialog-footer">
      <el-button name="btnMailGoods" type="primary" :loading="$store.getters.is_loading" @click="mailGood">确 定</el-button>
      <el-button name="btnClose" @click="visible =  false">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  SPREAD_API_SPRORDER_DETAIL, SPREAD_API_SPRORDER_SHIP
} from '@/apis/spread'
import {
  ShippingType, ExpressType
} from '@/enums/spread'
import { YNStatus } from '@/enums/common'
export default {
  props: {
    mailVisible: {
      type: Boolean,
      default: false
    },
    mailId: {
      type: [Number,String],
      default: ''
    }
  },
  data () {
    return {
      expressTypeTypes: ExpressType,
      yNStatus: YNStatus,
      id: this.mailId,
      visible: this.mailVisible,
      details: {
      },
      shipCode: '',
      isErped: '',
      storeBarCode: '',
      pickType: '',
      expressNote: '',
      expressCode: '',
      expressType: '',
      receiptAddr: '',
      receiptMobile: '',
      receiptName: ''
    }
  },
  methods: {
    getData () {
      SPREAD_API_SPRORDER_DETAIL({
        orderId: this.id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.details = res.data.Data
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    mailGood () {
      if (!this.shipCode) {
        this.$message.error('请输入提货码')
        return false
      } else if (!this.isErped) {
        this.$message.error('请输入商品来源')
        return false
      } else if (!this.receiptName) {
        this.$message.error('请输入姓名')
        return false
      } else if (!this.receiptMobile) {
        this.$message.error('请输入手机')
        return false
      } else if (!this.receiptAddr) {
        this.$message.error('请输入收货地址')
        return false
      } else if (
        this.isErped === YNStatus.Yes &&
        !this.storeBarCode
      ) {
        this.$message.error('请输入商品条码')
        return false
      }
      this.$store.commit('SET_BTN_LOADING', true)
      SPREAD_API_SPRORDER_SHIP({
        OrderId: this.id,
        ShipCode: this.shipCode,
        IsErped: this.isErped,
        StoreBarCode: this.storeBarCode,
        PickType: this.pickType,
        ExpressNote: this.expressNote,
        ExpressCode: this.expressCode,
        ExpressType: this.expressType,
        ReceiptAddr: this.receiptAddr,
        ReceiptMobile: this.receiptMobile,
        ReceiptName: this.receiptName,
        ShippingType: ShippingType.Express
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.$message.success(res.data.Message)
          this.visible = false
        } else {
          this.$message.error(res.data.Message)
        }
      })
    }
  },
  mounted () {
    this.getData()
  },
  watch: {
    visible: function () {
      this.$emit('listenMailVisible', this.visible)
    }
  }
}
</script>
<style lang="scss">
.orderMail .tit {
  width: 100px;
}
.orderMail .tag {
  color: #ddd;
}

.orderMail .center td {
  text-align: center;
}
.orderMail .input-init {
  width: 200px;
}
.orderMail .details-table th,
.orderMail .details-table td {
  height: 40px;
}
.orderMail {
  .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>

