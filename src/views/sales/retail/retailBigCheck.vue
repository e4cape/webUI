
<template  >
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看零售单{{!isStore ? '(' + detail.Master.StoreName + ')':''}}</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.Master.MasterCode}}</td>
                <td class="tit">销售时间</td>
                <td>{{detail.Master.OrderTime}}</td>
                <td class="tit">来源</td>
                <td>{{RetailOrderMasterTerminalType.Types[detail.Master.TerminalType]}}</td>
              </tr>
              <tr>
                <td class="tit">收银员</td>
                <td>{{detail.Master.CashierUser}}</td>
                <td class="tit">主销导购</td>
                <td>{{detail.Master.MainUser}}</td>
                <td class="tit">辅销导购</td>
                <td>{{detail.Master.AssistUser}}</td>
              </tr>
              <tr>
                <td class="tit">会员姓名</td>
                <td>{{detail.Master.TrueName || detail.Master.AliasName}}</td>
                <td class="tit">会员手机</td>
                <td>{{detail.Master.Mobile}}</td>
                <td class="tit">支付方式</td>
                <td colspan="2">
                  <span v-for="(item, index) in detail.PaymentItem" :key="index" style="margin-right:10px;">{{item.CategoryName}}{{item.PayPrice && '：￥' + $root.toFloat(item.PayPrice)}}</span>
                </td>
              </tr>
              <tr>
                <td class="tit">备注</td>
                <td class="note" colspan="5">{{detail.Master.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="checkPage-hd">
          <el-row>
            <el-col :span="12">
              <span class="title">货品列表</span>
            </el-col>
          </el-row>
        </div>
        <div class="panel-bd p-x-10 m-b-10">
          <el-table class="sale_table" :data="detail.OrderItem" :show-summary="true" :summary-method="getSummaries" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
            <el-table-column min-width="50">
              <template slot-scope="scope">
                <el-popover popper-class="big-img" placement="right" trigger="hover">
                  <div>
                    <img
                      :src="scope.row.ImageUrl.slice(0,4) === 'http' ? scope.row.ImageUrl : $root.settings.DOMAIN_IMG_FILE + (scope.row.ImageUrl ? scope.row.ImageUrl.replace('{0}', '150x150') : '/default/goods/150x150.jpg')"
                      alt
                    >
                  </div>
                  <div class="fl item-img" slot="reference">
                    <img
                      :src="scope.row.ImageUrl.slice(0,4) === 'http' ? scope.row.ImageUrl : $root.settings.DOMAIN_IMG_FILE + (scope.row.ImageUrl ? scope.row.ImageUrl.replace('{0}', '150x150') : '/default/goods/150x150.jpg')"
                      alt
                    >
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="GoodsName" label="货品名称" min-width="250" show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="clearfix" @click="showDetailDialog(scope.row, scope.$index)">
                  <div class="show2line tl" style="width:calc(100% - 40px)">
                    <div>
                      <span
                        class="init-button-text text-overflow"
                        :style="{'max-width': scope.row.ReturnState === RetailOrderSellBasicReturnState.ReturnOrder ? 'calc(100% - 70px)' : ''}"
                      >{{scope.row.StoreBarCode}}</span>
                      <span class="el-tag el-tag--info-b1b1b1 el-tag--mini" style="margin-left:5px;" v-if="scope.row.ReturnState === RetailOrderSellBasicReturnState.ReturnOrder">已退货</span>
                      <br>
                      <span class="init-button-text text-overflow w-100">{{scope.row.GoodsName}}</span>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="GoldType" label="成色" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoldWeight" label="金重(g)" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoldPrice" label="金价(元/g)" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="RetailType" label="零售方式" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="LabelPrice" label="标签价(元)" :formatter="formatter" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Discount" :formatter="formatter" min-width="100" show-overflow-tooltip>
              <template slot="header">
                <el-tooltip content="折扣 = 销售价 ÷ 标签价" effect="light" placement="top">
                  <span>
                    折扣
                    <i class="el-icon-question"></i>
                  </span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="ProductPrice" label="销售价" :formatter="formatter" min-width="150" show-overflow-tooltip>
              <template slot="header">
                <el-tooltip effect="light" placement="top">
                  <template slot="content">
                    <div>
                      <p>计件: 销售价 = 标签价 * 折扣</p>
                      <p>计价: 销售价 = 金重 * 金价</p>
                    </div>
                  </template>
                  <span>
                    销售价
                    <i class="el-icon-question"></i>
                  </span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="WorkPrice" label="工费(元/件)" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="应付金额" :formatter="formatter" min-width="120" show-overflow-tooltip>
              <template slot="header">
                <el-tooltip effect="light" placement="top">
                  <template slot="content">
                    <div>
                      <p>计件: 应付金额 = 销售价</p>
                      <p>计价(工费按克): 应付金额 = 销售价 + 工费 * 金重</p>
                      <p>计价(工费你按件): 应付金额 = 销售价 + 工费</p>
                    </div>
                  </template>
                  <span>
                    应付金额
                    <i class="el-icon-question"></i>
                  </span>
                </el-tooltip>
              </template>
              <template slot-scope="scope">{{'￥' + $root.toFloat(scope.row.ProductPrice + scope.row.WorkPrice)}}</template>
            </el-table-column>
            <el-table-column prop="CouponPrice" label="卡券抵扣金额" :formatter="formatter" min-width="120"></el-table-column>
            <el-table-column prop="RecyclePrice" label="卡券换购旧货回收金额" :formatter="formatter" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column prop="CpfeePrice" label="折旧工费" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="CashPrice" label="实付金额(元)" :formatter="formatter" min-width="150" show-overflow-tooltip>
              <template slot="header">
                <el-tooltip content="实付金额 = 应付金额 - 卡券抵扣金额 - 卡券换购旧货回收金额 + 折旧工费" effect="light" placement="top">
                  <span>
                    实付金额
                    <i class="el-icon-question"></i>
                  </span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="CouponType" label="卡券类型" :formatter="formatter" min-width="90" show-overflow-tooltip></el-table-column>
            <el-table-column prop="CardactitId" label="卡券编号" :formatter="formatter" min-width="90" show-overflow-tooltip></el-table-column>
            <el-table-column label="参与活动" min-width="140">
              <template slot-scope="scope">
                <el-tooltip placement="bottom" effect="light" v-if="scope.row.MarproTitle && scope.row.SellCode && scope.row.GiftType !== GiftType.Gift">
                  <div slot="content">
                    消费单(点击复制):
                    <br>
                    {{scope.row.SellCode}}
                  </div>
                  <el-button type="text" class="copyBTN" name="btn-copyBTN" :data-clipboard-text="scope.row.SellCode">{{scope.row.MarproTitle}}</el-button>
                </el-tooltip>
                <span v-else-if="scope.row.MarproTitle && scope.row.GiftType !== GiftType.Gift">{{scope.row.MarproTitle}}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="Score" label="赠送积分" min-width="100"></el-table-column>
            <el-table-column prop="GoldenRice" label="赠送礼金" min-width="100"></el-table-column>
          </el-table>
        </div>
        <div class="m-b-10" v-if="detail.JunkItem && detail.JunkItem.length">
          <div class="checkPage-hd">
            <span class="title">旧货列表</span>
            <!-- <div class="title fr" v-if="detail.BackCode">
              旧货回收单:
              <span class="init-button-text" name="backCode" @click="$router.push({path: '/stock/junkInn/junkInnCheck', query: {id: 'none', code: detail.BackCode}})">{{detail.BackCode}}</span>
            </div>-->
          </div>
          <div class="m-x-10">
            <el-table :data="detail.JunkItem" :show-summary="true" :summary-method="getSummaries2" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
              <el-table-column prop="SourceType" label="来源" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
              <el-table-column prop="IsGold" label="类型" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
              <el-table-column prop="JunkCode" label="旧货编号" min-width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span
                    class="init-button-text"
                    @click="checkGold({'type':scope.row.IsGold === YNStatus.Yes ? true : false , 'id': scope.row.SequentialId,vipDetail:{ MemberId: detail.Master.MemberId, Mobile: detail.Master.Mobile}})"
                  >{{scope.row.JunkCode}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="JunkName" label="旧货名称" min-width="100" show-overflow-tooltip></el-table-column>
              <el-table-column prop="IsOurStore" label="是否本店售出" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
              <el-table-column prop="StoreBarCode" label="原条码" min-width="90" show-overflow-tooltip></el-table-column>
              <el-table-column prop="GoldWeight" label="金重(g)" :formatter="formatter" show-summary min-width="120" show-overflow-tooltip></el-table-column>
              <el-table-column prop="RecallGoldPrice" label="回收金价" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
              <el-table-column prop="RecallPrice" label="回收金额" :formatter="formatter" show-summary min-width="120" show-overflow-tooltip></el-table-column>
              <el-table-column prop="RecallFee" label="回收工费" :formatter="formatter" show-summary min-width="120"></el-table-column>
              <el-table-column prop="Note" label="备注" min-width="90" show-overflow-tooltip></el-table-column>
            </el-table>
          </div>
        </div>
        <div class="p10" style="border-top: 1px solid #ededed;">
          <div class="price_info_wapper clearfix">
            <div class="fl">
              <p colspan="2" style="font-size:16px;">
                实付金额：
                <span style="font-size:16px; font-weight:bold; color:#ffa200;">￥{{$root.toFloat(detail.Master.CashPrice)}}</span>
              </p>
              <p>
                <span colspan="1">货品实付金额：￥{{$root.toFloat((detail.Master.CashPrice+detail.Master.RecallPrice))}}</span>
                <span colspan="1">旧货抵扣(不含卡券换购)：￥{{$root.toFloat(detail.Master.RecallPrice)}}</span>
              </p>
            </div>
            <div class="fl payPrice" style="border-left: 1px solid #ededed;">
              <span v-for="(item, index) in detail.PaymentItem" :key="index">{{item.CategoryName}}:{{$root.toFloat(item.PayPrice)}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-button @click="printDialog = true" name="btn-print">打印</el-button>
      <el-button @click="$router.back()" name="btn-print">返回</el-button>
    </div>
    <!--  查看素金 & 非素  -->
    <goldCheck2 :visible.sync="checkJunkDialog" :checkInfo="checkParams"></goldCheck2>
    <!--  end 查看素金 & 非素  -->
    <!--  dialog 货品详情  -->
    <good-detail :visible.sync="goodDetailDialog.visible" :goodsId="goodDetailDialog.goodsId"></good-detail>
    <!--  end 货品详情 -->
    <!--  dialog 货品详情2  -->
    <good-detail2 :visible.sync="goodDetailDialog2.visible" :sellCode="goodDetailDialog2.sellCode"></good-detail2>
    <!--  end 货品详情2 -->
    <!--  @module Dialog·打印大单  -->
    <print-order :visible.sync="printDialog" :conditions="encodeURIComponent(JSON.stringify({OrderId: masterCode }))" :printingType="SettingPrintingType.OrderCloudRetailOrderMaster"></print-order>
    <!--  End Dialog·打印大单  -->
  </div>
</template>
<script>
import { SettingPrintingType } from '@/enums/merchant.js'
import { YNStatus, CharacterType } from '@/enums/common.js'
import { GiftType, RetailType } from '@/enums/stocking.js'
import { ExpendOrderPayingType } from '@/enums/marketing.js'
import {
  RetailOrderSellSettleTicketType,
  RetailOrderMasterTerminalType,
  RetailOrderSellBasicReturnState,
  RetailOrderBackProductSourceType,
  RetailOrderSellSettleCouponType,
  RetailOrderSellProductSourceType,
  // StoreSettingPrintingType
} from '@/enums/order.js'
import { ORDER_API_RETAIL_ORDER_MASTER_GET } from '@/apis/order.js'

import printOrder from '@/components/erp/printOrder'
import goldCheck2 from './goldCheck2.vue'
import goodDetail from '@/components/erp/goodDetail'
import goodDetail2 from './goodDetail2.vue'

export default {
  data() {
    return {
      YNStatus,
      SettingPrintingType,
      GiftType,
      RetailType,
      ExpendOrderPayingType,
      RetailOrderMasterTerminalType,
      RetailOrderSellBasicReturnState,
      RetailOrderSellSettleTicketType,
      RetailOrderBackProductSourceType,
      RetailOrderSellSettleCouponType,
      RetailOrderSellProductSourceType,
      // storeSettingPrintingTypes: StoreSettingPrintingType,
      masterCode: '',
      junkId: '',
      detail: {
        JunkItem: [],
        Master: {},
        PaymentItem: [],
        OrderItem: []
      },
      data: [],
      junkData: [],
      salesDetail: {
      },
      checkParams: {
      },
      goodDetailDialog: {
      },
      goodDetailDialog2: {
        sellCode: '',
        visible: false
      },
      checkJunkDialog: false,
      printDialog: false
    }
  },
  computed: {
    isStore() {
      return this.$store.getters.user_session.CharacterType === CharacterType.Store
    }
  },
  methods: {
    formatter(row, column, val) {
      switch (column.property) {
        case 'GoldType':
          return val === 0 ? '-' : this.$store.getters.goldType.Types[val]
        case 'RetailType':
          return RetailType.Types[val]
        case 'CouponType':
          return val === 0 && row.PayingType === ExpendOrderPayingType.Card ? '优惠券' : RetailOrderSellSettleCouponType.Types[val]
        case 'CardactitId':
          return !row.TicketType ? '-' : row.TicketType === RetailOrderSellSettleTicketType.WalletCoupon ? row.CouponId : row.TicketType === RetailOrderSellSettleTicketType.QueueReceiveGold ? row.QueueId : val
        case 'SourceType':
          return RetailOrderBackProductSourceType.Types[val] || '-'
        case 'IsGold':
          return val === YNStatus.Yes ? '素金' : '非素'
        case 'IsOurStore':
          return val === YNStatus.Yes ? '是' : '否'
        case 'Discount':
          return this.$root.toFloat(val * 100) + '%'
        case 'GoldWeight':
          return this.$root.toFloat(val, 3)
        default:
          return '￥' + this.$root.toFloat(val)
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
      this.$store.commit('SET_TB_LOADING', true) // table loading
      ORDER_API_RETAIL_ORDER_MASTER_GET({
        MasterCode: this.masterCode
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          // this.detail.OrderItem.map(item => {
          //   // item.
          // })
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },

    getSummaries(param) {
      // 合计
      const {
        columns, data
      } = param
      const sums = []
      // (scope.row.ProductPrice - scope.row.WorkPrice).toFixed(2)

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map((item) => {
          var num = 0
          if (index == 10) {
            num = Number(item['ProductPrice'] + item['WorkPrice']).toFixed(2)
          } else {
            num = Number(item[column.property])
          }
          return num
        })

        if (!values.every(value => isNaN(value))) {
          if (index === 6 || (index > 7 && index < 15)) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                let num = Number(prev) + Number(curr)
                return parseFloat(num).toFixed(2)
              } else {
                return prev
              }
            }, 0)
            sums[index] = '￥' + this.$root.toFloat(sums[index])
          }
        } else {
          return false
        }
      })
      return sums
    },
    getSummaries2(param) {
      // 合计
      const {
        columns, data
      } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => isNaN(item[column.property]) ? 0 : Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          if (index > 5 && index < 10) {
            sums[index] = values.reduce((prev, curr) => prev + curr)
            if (index === 6) {
              sums[index] = this.$root.toFloat(sums[index], 3) + 'g'
            } else {
              sums[index] =  '￥' +  this.$root.toFloat(sums[index], 2)
            }
          }
        } else {
          return false
        }
      })
      return sums
    },
    checkGold(obj) {
      // 查看
      this.checkParams = obj
      this.checkJunkDialog = true
    },
    showDetailDialog(row) {
      switch (row.SourceType) {
        case this.RetailOrderSellProductSourceType.Marketing: // 营销
          this.goodDetailDialog2 = {
            sellCode: row.SellCode,
            visible: true
          }
          break
        case this.RetailOrderSellProductSourceType.Manual: // 手工
          this.goodDetailDialog2 = {
            sellCode: row.SellCode,
            visible: true
          }
          break
        case this.RetailOrderSellProductSourceType.Stocking: // erp
          this.selectGoodsId = row.GoodsId
          this.goodDetailDialog = {
            goodsId: row.GoodsId,
            visible: true
          }
          break

        default:
          break
      }
    },
    listenGoodDetailDialog() {
      this.goodDetailDialog.visible = false
    },
    listenGoodDetailDialog2() {
      this.goodDetailDialog2.visible = false
    },
    listenjunkCheck() {
      this.checkJunkDialog = false
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
  beforeMount() {
    this.masterCode = this.$route.query.code
    if (!this.masterCode) {
      this.dataError()
    }
  },
  mounted() {
    this.getDetail()
  },
  components: {
    printOrder,
    goldCheck2,
    goodDetail,
    goodDetail2
  }
}
</script>
<style scoped="true" lang="scss">
.show2line {
  cursor: pointer;
  line-height: 15px !important;
  span {
    vertical-align: middle;
    height: 15px;
    display: inline-block;
    text-align: left;
  }
}

.item-img {
  cursor: pointer;
  width: 30px;
  height: 30px;
  overflow: hidden;
  margin-right: 10px;
  img {
    vertical-align: middle;
    width: 30px;
  }
}
.el-tag--mini {
  line-height: 15px;
  height: 15px;
  font-size: 12px;
}

.price_info_wapper {
  text-align: left;
  height: 56px;
  div {
    height: 100%;
    margin-right: 100px;
    p {
      line-height: 28px;
      margin: 0;
      padding: 0 10px;
      span {
        margin-right: 20px;
      }
    }
  }
  .payPrice {
    line-height: 56px;
    span {
      margin: 0 10px;
    }
  }
}

.w-100 {
  width: 100%;
}
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-tag--info-b1b1b1 {
  color: #fff;
  background: #b1b1b1;
  position: relative;
  padding-left: 25px;
}

.el-tag--info-b1b1b1:after {
  content: '-';
  border-radius: 50%;
  background: #fff;
  width: 14px;
  height: 14px;
  text-align: center;
  line-height: 14px;
  color: #b1b1b1;
  position: absolute;
  left: 5px;
  top: 0px;
}

/* @module 左右结构的数据表格 */
.details-table-double,
.details-table-dialog {
  .panel {
    overflow: hidden;
    margin-top: 0;
    margin-bottom: 20px;
    border: 0;
    .panel-hd {
      overflow: hidden;
      height: 32px;
      line-height: 32px;
      > .title {
        height: 32px;
        line-height: 32px;
      }
      border: 1px solid #ddd;
      border-bottom: 0;
    }
    .panel-bd {
      padding: 0;
    }
  }
  .details-table {
    font-size: 12px;
    border-top: solid 1px $border-color;
    border-left: solid 1px $border-color;

    .note {
      max-width: 300px;
      word-break: break-word;
      word-break: break-all;
    }

    th,
    td {
      height: 25px;
      padding: 0 8px;
      border-right: solid 1px $border-color;
      border-bottom: solid 1px $border-color;
    }

    th,
    .tit {
      background-color: #f5f5f5;
      color: #555;
      text-align: right;
    }

    th {
      font-weight: normal;
      text-align: center;
    }

    td {
      text-align: left;
      color: $font-color;

      img {
        width: 40px;
        height: 40px;
        margin-top: 5px;
      }
    }
  }
}
</style>