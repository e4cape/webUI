<template>
  <el-dialog title="提货" :visible.sync="visible" custom-class="orderCheck">
    <div class="panel-tag init-tag">
      <span>商品</span>
    </div>
    <el-table v-if="details.OrderCode" :data="[details]">
      <el-table-column show-overflow-tooltip  prop="ProductId" label="商品编码" min-width="50"></el-table-column>
      <el-table-column show-overflow-tooltip  prop="ProductName" label="商品名称" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip  prop="LabelPrice" label="原价" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip  prop="SalePrice" label="售价" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip  prop="Quantity" label="数量" min-width="50"></el-table-column>
      <el-table-column show-overflow-tooltip  prop="MktPrice" label="活动价" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip  prop="ShipFee" label="运费" min-width="50"></el-table-column>
      <el-table-column show-overflow-tooltip  prop="OrderPrice" label="订单金额" min-width="80"></el-table-column>
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
            <el-input name="btnShipCode" class="input-init" :maxlength="50" v-model="shipCode"></el-input>
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
        <tr>
          <td class="tit">备注</td>
          <td>
            <el-radio-group name="pickTypeSelect" v-model="pickTypeSelect">
              <el-radio :label="pickType.Self">本人提货</el-radio>
              <el-radio :label="pickType.Other">他人代提</el-radio>
            </el-radio-group>
          </td>
        </tr>
      </tbody>
    </table>

    <div slot="footer" class="dialog-footer">
      <el-button name="btnPickUpGoods" type="primary" :loading="$store.getters.is_loading" @click="pickUpGood">确 定</el-button>
      <el-button name="btnClose" @click="visible =  false">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  SPREAD_API_SPRORDER_DETAIL, SPREAD_API_SPRORDER_SHIP
} from '@/apis/spread'
import {
  ShippingType, PickType
} from '@/enums/spread'
import { YNStatus } from '@/enums/common'
export default {
  props: {
    pickUpVisible: {
      type: Boolean,
      default: false
    },
    pickUpId: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      yNStatus: YNStatus,
      pickType: PickType,
      id: this.pickUpId,
      visible: this.pickUpVisible,
      details: {
      },
      shipCode: '',
      isErped: '',
      storeBarCode: '',
      pickTypeSelect: ''
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
    pickUpGood () {
      if (!this.isErped) {
        this.$message.error('请选择商品来源')
        return false
      } else if (!this.shipCode) {
        this.$message.error('请输入提货码')
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
        PickType: this.pickTypeSelect,
        ShippingType: ShippingType.PickedUp
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
      this.$emit('listenPickUpVisible', this.visible)
    }
  }
}
</script>
<style lang="scss" scoped>
.tit {
  width: 100px;
}
.center td {
  text-align: center;
}
.tag {
  color: #ddd;
}
.input-init {
  width: 200px;
}
.details-table th,
.details-table td {
  height: 40px;
}
.orderCheck /deep/.el-dialog__body {
  padding: 10px 20px!important;
}
</style>

