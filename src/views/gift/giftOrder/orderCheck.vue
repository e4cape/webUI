<template>
  <div class="content">
    <div v-loading="false">
      <div class="clearfix">
        <span class="order-code1">订单编号：{{detail.orderCode}}</span>
        <div class="fr">
          <el-button name="btnShowLog" type="text" @click="showOperationRecords=true">操作记录</el-button>
          <!-- <el-button name="btnBack" @click="$router.back()" type="text">返回</el-button> -->
        </div>
      </div>
      <el-steps :active="active" align-center finish-status="success">
        <el-step title="提交订单">
          <div slot="description">
            <p>{{detail.createUser}}</p>
            <p>{{detail.createTime}}</p>
          </div>
        </el-step>
        <el-step title="支付">
          <div slot="description" v-if="active > 1">
            <p>{{detail.createUser}}</p>
            <p>{{detail.payTime}}</p>
          </div>
        </el-step>
        <el-step title="审核" v-if="active <= 2 || detail.checkTime">
          <div slot="description" v-if="active > 2">
            <p>{{detail.checkUser}}</p>
            <p>{{detail.checkTime}}</p>
          </div>
        </el-step>
        <el-step title="发货" v-if="active < 6 || detail.expressTime">
          <div slot="description" v-if="active > 3">
            <p>{{detail.expressUser}}</p>
            <p>{{detail.expressTime}}</p>
          </div>
        </el-step>
        <el-step title="收货" v-if="active < 6 || detail.receiveTime">
          <div slot="description" v-if="active > 4">
            <p>{{detail.receiveUser}}</p>
            <p>{{detail.receiveTime}}</p>
          </div>
        </el-step>
        <el-step title="取消" v-if="detail.orderStatus == orderStatus.Cancel">
          <div slot="description">
            <p>{{detail.cancelUser}}</p>
            <p>{{detail.cancelTime}}</p>
          </div>
        </el-step>
        <el-step title="作废" v-if="detail.orderStatus == orderStatus.Invalid">
          <div slot="description">
            <p>{{detail.invalidUser}}</p>
            <p>{{detail.invalidTime}}</p>
          </div>
        </el-step>
      </el-steps>
      <div class="title">基本信息</div>
      <el-form label-position="right" label-width="100px" show-message>
        <el-row>
          <el-col :span="8">
            <el-form-item label="下单人：">
              <span>{{detail.trueName || detail.aliasName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下单人手机：">
              <span>{{detail.mobile}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收货方式：">
              <span>{{detail.receiveTypeText}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收货人姓名：">
              <span>{{detail.receiveName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收货人手机：">
              <span>{{detail.receiveMobile}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收货人地址：">
              <span>{{detail.receiveFullAddress}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="快递公司：">
              <span>{{detail.expressTypeText}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="$store.getters.user_session.CharacterType == characterType.Lingcb ? 8 : 16">
            <el-form-item label="快递单号：">
              <a :href="`https://www.kuaidi100.com/chaxun?nu=${detail.expressCode}&phone=${detail.receiveMobile}`" target="_blank" title="点击查询快递信息">{{detail.expressCode}}</a>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="$store.getters.user_session.CharacterType == characterType.Lingcb">
            <el-form-item label="商户：">
              <span>{{(detail.companyName || '') + ' ' + (detail.storeName || '')}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="$store.getters.user_session.CharacterType == characterType.Lingcb">
            <el-form-item label="礼品供应商：">
              <span>{{detail.supplierName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="16" v-if="$store.getters.user_session.CharacterType == characterType.Lingcb">
            <el-form-item label="备注：">
              <span>{{detail.remark}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="$store.getters.user_session.CharacterType == characterType.Supplier">
            <el-form-item label="订单备注：">
              <span>{{detail.remark}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="16" v-if="$store.getters.user_session.CharacterType == characterType.Supplier">
            <el-form-item label="发货备注：">
              <span>{{detail.expressNote}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="title">礼品列表</div>
      <!-- @module 数据表格 -->
      <el-table :data="detail.orderItems" class="no-border">
        <el-table-column label="礼品信息" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="style-item">
              <el-popover placement="right" v-if="scope.row.imageUrl" trigger="hover">
                <img :src="$root.settings.DOMAIN_IMAGE + scope.row.imageUrl" >
                <img slot="reference" class="small-img" name="btnGetDetailImg" @click="giftDetail(scope.row)" :src="$root.settings.DOMAIN_IMAGE + scope.row.imageUrl">
              </el-popover>
              <div class="text-item">
                <el-button type="text" name="btnGiftDetail" @click="giftDetail(scope.row)">{{scope.row.giftName}}</el-button>
                <p>
                  <span style="color:#999;" v-for="(item, index) in scope.row.attributes" :key="index">{{item.name + ':' + item.val}}&emsp;</span>
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="retailPrice" label="单价" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="$store.getters.user_session.CharacterType == characterType.Lingcb">{{isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价：': '批发价：'}}{{scope.row.wholesalePrice}}</span>
            &emsp;<span>建议零售价：{{scope.row.retailPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="exchangeInfo" label="兑换情况" min-width="100" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- End 数据表格 -->
      <el-row style="margin: 20px; margin-left: 33px; text-align: left; border: 0;" v-if="$store.getters.user_session.CharacterType == characterType.Supplier">
        <el-button name="btnShowDelivery" v-if="detail.orderStatus == orderStatus.PendingDelivery" type="primary" @click="showDelivery">发货</el-button>
        <el-button name="btnShowDeliveryAgain" v-if="detail.orderStatus == orderStatus.PendingReceive" type="primary" @click="showDelivery">重新发货</el-button>
        <el-button name="btnNullify" v-if="detail.orderStatus < orderStatus.PendingReceive" @click="invalid(detail.orderId)">作废</el-button>
        <el-button name="btnPrint" @click="printOrder">打印订单</el-button>
        <el-button name="btnPrintExpress" @click="printExpress">打印快递单</el-button>
      </el-row>
      <!-- @module 操作记录 -->
      <el-dialog title="操作记录" :visible.sync="showOperationRecords">
        <el-table :data="detail.operationLogs" class="no-border" :default-sort="{prop: 'createTime', order: 'descending'}">
          <el-table-column property="createTime" label="操作时间" sortable min-width="120"></el-table-column>
          <el-table-column property="createUser" label="操作人" min-width="100"></el-table-column>
          <el-table-column property="orderLogTypeText" label="操作类型" min-width="100"></el-table-column>
          <el-table-column property="remark" label="备注" min-width="200"></el-table-column>
        </el-table>
      </el-dialog>
      <!-- End 操作记录 -->
      <!-- @module 查看礼品 -->
      <el-dialog title="查看礼品" :visible.sync="detailShow" :before-close="detailShowCancel" width="458px">
        <show-detail :data="detailInfo" ref="showDetail"></show-detail>
      </el-dialog>
      <!-- @module 查看礼品 -->
      <!-- @module 发货 -->
      <el-dialog title="发货" :visible.sync="showDeliveryDialog" width="575px">
        <el-steps :active="active" align-center finish-status="success">
          <el-step title="提交订单">
            <div slot="description">
              <p>{{detail.createUser}}</p>
              <p>{{detail.createTime}}</p>
            </div>
          </el-step>
          <el-step title="支付">
            <div slot="description" v-if="active > 1">
              <p>{{detail.createUser}}</p>
              <p>{{detail.createTime}}</p>
            </div>
          </el-step>
          <el-step title="审核">
            <div slot="description" v-if="active > 2">
              <p>{{detail.createUser}}</p>
              <p>{{detail.createTime}}</p>
            </div>
          </el-step>
          <el-step title="发货">
            <div slot="description" v-if="active > 3">
              <p>{{detail.expressUser}}</p>
              <p>{{detail.expressTime}}</p>
            </div>
          </el-step>
          <el-step title="收货">
            <div slot="description" v-if="active > 4">
              <p>{{detail.receiveName}}</p>
              <p>{{detail.receiveTime}}</p>
            </div>
          </el-step>
          <el-step title="取消" v-if="detail.orderStatus == orderStatus.Cancel">
            <div slot="description">
              <p>{{detail.cancelUser}}</p>
              <p>{{detail.cancelTime}}</p>
            </div>
          </el-step>
          <el-step title="作废" v-if="detail.orderStatus == orderStatus.Invalid">
            <div slot="description">
              <p>{{detail.invalidUser}}</p>
              <p>{{detail.invalidTime}}</p>
            </div>
          </el-step>
        </el-steps>
        <el-form :model="deliveryParams" ref="deliveryForm" label-position="right" label-width="100px" :rules="rules">
          <el-form-item label="订单编号：" prop="orderCode">{{detail.orderCode}}</el-form-item>
          <el-form-item label="下单人：" prop="trueName">{{detail.trueName || detail.aliasName}}</el-form-item>
          <el-form-item label="收货人：" prop="receiveName">{{detail.receiveName }}</el-form-item>
          <el-form-item label="收货人地址：" prop="receiveFullAddress">{{detail.receiveFullAddress}}</el-form-item>
          <el-form-item label="订单备注：">{{detail.remark || '-'}}</el-form-item>
          <el-form-item label="快递公司：" prop="expressType">
            <el-select name="expressType" filterable v-model="deliveryParams.expressType" placeholder="请选择">
              <el-option v-for="item in expressTypes.Types" :key="item.key" :label="item.title" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="快递单号：" prop="expressCode">
            <el-input name="expressCode" v-model="deliveryParams.expressCode" placeholder="20个英文字符以内" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="发货备注：">
            <el-input name="expressNote" type="textarea" v-model="deliveryParams.expressNote" :maxlength="50" placeholder="50字以内"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button name="btnSave" type="primary" @click="delivery">保 存</el-button>
          <el-button name="btnClose" @click="showDeliveryDialog = false">关 闭</el-button>
        </span>
      </el-dialog>
      <!-- @module 发货 -->
      <!-- @module Dialog·打印订单 -->
      <print-order title="打印" v-if="printDialog"  :visible.sync="printDialog" :conditions="encodeURIComponent(JSON.stringify({OrderId: orderId}))" :printingType="printingTypes" @listenPrintDialog="printDialog = false"></print-order>
      <!-- End Dialog·打印订单 -->
    </div>
  </div>
</template>

<script>
import printOrder from '@/components/erp/printOrder'
import showDetail from '@/components/gifting/showDetail.vue'
import {
  OrderStatus,
  ExpressTypes,
  StoreSettingPrintingType
} from '@/enums/gifting'
import { CharacterType } from '@/enums/common'
import {
  GIFTING_API_GIFTSALEORDERFORC_GETORDER,
  GIFTING_API_GIFTSALEORDERFORC_DELIVERY,
  GIFTING_API_GIFT_GETDETAILBYSTORE,
  GIFTING_API_GIFTSALEORDERFORC_INVALID
} from '@/apis/gifting'
export default {
  data() {
    var checkExpressCode = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入快递单号'))
      }
      if (/^[a-zA-Z0-9]{1,20}$/.test(value)) {
        callback()
      } else {
        callback(new Error('格式错误'))
      }
    }
    return {
      orderStatus: OrderStatus,
      expressTypes: ExpressTypes,
      storeSettingPrintingType: StoreSettingPrintingType,
      characterType: CharacterType,
      orderId: 0,
      detail: {
      },
      showOperationRecords: false,
      showDeliveryDialog: false, // 发货
      deliveryParams: {
        receiveType: 0,
        expressCode: ''
      },
      rules: {
        expressType: [
          {
            required: true, message: '请选择快递公司', trigger: 'change' 
          }
        ],
        expressCode: [
          {
            required: true, validator: checkExpressCode, trigger: 'change' 
          }
        ]
      },
      detailShow: false,
      detailInfo: {
      },
      printDialog: false,
      printingTypes: '', // 打印内容
      active: 0,
    }
  },
  methods: {
    getData() {
      this.$store.commit('SET_TB_LOADING', false)
      GIFTING_API_GIFTSALEORDERFORC_GETORDER({
        orderId: this.orderId 
      }).then(
        res => {
          this.$store.commit('SET_TB_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.detail = res.data.Data
            this.orderId = res.data.Data.orderId
            switch (this.detail.orderStatus.toString()) {
              case this.orderStatus.PendingPay:
                this.active = 1
                break
              case this.orderStatus.PendingAudit:
                this.active = 2
                break
              case this.orderStatus.PendingDelivery:
                this.active = 3
                break
              case this.orderStatus.PendingReceive:
                this.active = 4
                break
              case this.orderStatus.Complete:
                this.active = 5
                break
              case this.orderStatus.Cancel:
                this.active = 6
                break
              case this.orderStatus.Invalid:
                this.active = 7
                break
              default:
                this.active = 0
                break
            }
          }
        }
      )
    },
    showDelivery() {
      // 显示发货
      this.deliveryParams.orderId = this.detail.orderId
      this.deliveryParams.orderCode = this.detail.orderCode
      this.deliveryParams.expressCode = this.detail.expressCode
      this.deliveryParams.expressNote = this.detail.expressNote
      this.showDeliveryDialog = true
    },
    delivery() {
      // 发货、重新发货
      this.$refs['deliveryForm'].validate(valid => {
        if (valid) {
          GIFTING_API_GIFTSALEORDERFORC_DELIVERY(this.deliveryParams).then(
            res => {
              if (res.data.Code === 'CORRECT') {
                this.$message.success('发货成功')
                this.showDeliveryDialog = false
                this.$router.push('/gift/giftOrder/index')
              }
            }
          )
        }
      })
    },
    invalid(id) {
      // 作废
      this.$confirm('确定作废？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        GIFTING_API_GIFTSALEORDERFORC_INVALID({
          orderId: id 
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('作废成功')
            this.getData()
          }
        })
      }).catch(() => {})
    },
    detailShowCancel(done) {
      // 关闭礼品弹窗前
      this.$refs['showDetail'].initActiveTab()
      done()
      this.detailInfo = {
      }
    },
    giftDetail(v) {
      // 显示礼品弹窗
      this.detailShow = true
      GIFTING_API_GIFT_GETDETAILBYSTORE(v).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detailInfo = res.data.Data
        }
      })
    },
    printOrder() {
      this.printingTypes = this.storeSettingPrintingType.GiftingCloudGiftSaleOrder
      this.printDialog = true
    },
    printExpress() {
      this.printingTypes = this.storeSettingPrintingType.GiftingCloudGiftExpressOrder
      this.printDialog = true
    }
  },
  mounted() {
    this.orderId = this.$route.query.orderId || 0
    this.getData()
  },
  components: {
    printOrder,
    showDetail
  }
}
</script>

<style lang="scss" scoped>
.order-code1 {
  display: inline-block;
  padding: 8px 0;
}
.title {
  font-size: 16px;
  color: #169bd5;
  font-weight: 700;
  padding: 20px 0;
}
.style-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
  .small-img {
    width: 60px;
    height: 60px;
    vertical-align: bottom;
    cursor: pointer;
  }
  .text-item {
    padding-left: 5px;
    width: calc(100% - 65px);
    font-size: 14px;
    color: #169bd5;
    .btn-link {
      display: block;
    }
  }
}

</style>