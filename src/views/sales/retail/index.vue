<template  >
  <el-row class="content">
    <el-form :model="queryForm" ref="search" @keyup.enter.native="onSearch" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button v-if="isStore" type="primary" @click="toCreate" name="btn-create">新建</el-button>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-select v-model="queryForm.State" placeholder="所有状态" name="State">
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="(item,index) in RetailOrderMasterState.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="UniteNote">
            <el-input v-model="queryForm.UniteNote" :maxlength="50" placeholder="单据编号" name="UniteNote">
              <el-button slot="append" icon="el-icon-search" name="btn-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="TerminalType" label="来源：">
            <el-select v-model="queryForm.TerminalType" placeholder="所有来源" :filterable="true" name="TerminalType">
              <el-option label="所有来源" value="0"></el-option>
              <el-option v-for="(item,index) in RetailOrderMasterTerminalType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="UniteNote" label="单据编号：">
            <el-input v-model="queryForm.UniteNote" :maxlength="50" name="UniteNote"></el-input>
          </el-form-item>
          <el-form-item prop="ProductNO" label="条码：">
            <el-input v-model="queryForm.ProductNO" :maxlength="50" name="ProductNO"></el-input>
          </el-form-item>
          <el-form-item prop="ProductTitle" label="货品名称：">
            <el-input v-model="queryForm.ProductTitle" :maxlength="50" name="ProductTitle"></el-input>
          </el-form-item>
          <el-form-item prop="CashierUserId" label="收银员：" v-if="isStore">
            <el-select v-model="queryForm.CashierUserId" filterable placeholder="全部" name="CashierUserId">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.users" :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="MainUserId" label="主销导购：" v-if="isStore">
            <el-select v-model="queryForm.MainUserId" filterable placeholder="全部" name="MainUserId">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.users" :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="AssistUserId" label="辅销导购：" v-if="isStore">
            <el-select v-model="queryForm.AssistUserId" filterable placeholder="全部" name="AssistUserId">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.users" :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="MemberId" label="会员ID：">
            <el-input v-model="queryForm.MemberId" :maxlength="50" name="MemberId"></el-input>
          </el-form-item>
          <el-form-item prop="Mobile" label="会员手机：">
            <el-input v-model="queryForm.Mobile" :maxlength="11" name="Mobile"></el-input>
          </el-form-item>
          <el-form-item prop="PaymentType" label="支付方式：">
            <el-select v-model="queryForm.PaymentType" filterable placeholder="全部" name="PaymentType">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in  $store.getters.paymentType.TypeArray" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ReturnState" label="退货情况：">
            <el-select v-model="queryForm.ReturnState" filterable placeholder="全部" name="ReturnState">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in RetailOrderSellBasicReturnState.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="IsJunk" label="旧货回收情况：">
            <el-select v-model="queryForm.IsJunk" filterable placeholder="全部" name="IsJunk">
              <el-option label="全部" value="0"></el-option>
              <el-option label="包含旧货" :value="String(YNStatus.Yes)"></el-option>
              <el-option label="不包含旧货" :value="String(YNStatus.No)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="OrderTime" label="销售时间：">
            <el-date-picker v-model="queryForm.OrderTime" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" name="OrderTime"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <div v-loading="$store.getters.tb_loading">
      <table class="retail-table" cellspacing="0" cellpadding="0" border="0" element-loading-text="拼命加载中">
        <tbody>
          <tr class="table-hd">
            <th>货品信息</th>
            <th>金额</th>
            <th>参与活动</th>
            <th>付款情况</th>
            <th>销售时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
          <tr v-for="(item, index) in data" :key="index">
            <td colspan="7">
              <div :ref="'table_item_'+item.$index" class="item-show-some item-warpper">
                <div class="info-head">
                  <el-row class="cell">
                    <div>
                      <span>
                        {{item.MasterCode}}
                        <span style="margin-left:5px;" class="el-tag el-tag--info-61a9da el-tag--mini">{{RetailOrderMasterTerminalType.Types[item.TerminalType]}}</span>
                      </span>
                    </div>
                    <div class="text">
                      <span style="margin-right:0;">
                        会员:
                        <router-link v-if="!isOneStoreCompany" :to="{'path':'/member/clientManage/viewcustomer', query:{memberId: item.MemberId}}">
                          <i>{{item.AliasName}}</i>
                          <i>{{ item.AliasName && item.TrueName ? '('+ item.TrueName +')' : item.TrueName}}</i>
                          <i>{{item.Mobile && item.Mobile }}</i>
                        </router-link>
                        <b v-else>
                          <i>{{item.AliasName}}</i>
                          <i>{{ item.AliasName && item.TrueName ? '('+ item.TrueName +')' : item.TrueName}}</i>
                          <i>{{item.Mobile && item.Mobile }}</i>
                        </b>
                      </span>
                    </div>
                    <div class="text">
                      <span>收银: {{item.CashierUser || '未知'}}</span>
                      <span>主销导购: {{item.MainUser}}</span>
                      <span>{{item.AssistUser && '辅销导购:'+ item.AssistUser}}</span>
                    </div>
                    <div class="text" v-if="!isStore">
                      <span>销售单位： {{item.StoreName}}</span>
                    </div>
                  </el-row>
                </div>
                <table class="retail-table-inline" cellspacing="0" cellpadding="0">
                  <tbody>
                    <tr v-for="(val, key) in item.OrderItem" :key="key">
                      <td :rowspan="1" :colspan="1" class="clearfix">
                        <template>
                          <div>
                            <el-popover popper-class="big-img" placement="right" trigger="hover">
                              <img :src="val.ImageUrl.slice(0,4) === 'http' ? val.ImageUrl : $root.settings.DOMAIN_IMG_FILE + (val.ImageUrl ? val.ImageUrl.replace('{0}', '150x150') : '/default/goods/150x150.jpg')" alt>
                              <div class="fl item-img" slot="reference">
                                <img :src="val.ImageUrl.slice(0,4) === 'http' ? val.ImageUrl : $root.settings.DOMAIN_IMG_FILE + (val.ImageUrl ? val.ImageUrl.replace('{0}', '50x50') : '/default/goods/50x50.jpg')" alt>
                              </div>
                            </el-popover>
                          </div>
                          <div class="tl fl" @click="selectDetailDialog(val, index)" style="width:calc(100% - 70px); ">
                            <div class="show2line text-overflow" v-if="val.IsJunk !== YNStatus.Yes">
                              <p>
                                <span class="init-button-text">{{val.StoreBarCode}}</span>
                                <span class="el-tag el-tag--info-b1b1b1 el-tag--mini" v-if="val.ReturnState == RetailOrderSellBasicReturnState.ReturnOrder">已退货</span>
                              </p>
                              <p>
                                <span style="color:#999;">{{val.GoodsName}}</span>
                              </p>
                            </div>
                            <div class="show2line text-overflow" v-else>
                              <p>
                                <span class="init-button-text">{{val.JunkCode}}</span>
                                <span class="el-tag el-tag--555 el-tag--mini">{{val.JunkSourceType == RetailOrderBackProductSourceType.Coupon ? '卡券换购' : '旧货抵扣'}}</span>
                              </p>
                              <p>
                                <span style="color:#999;">{{val.GoodsName}}</span>
                              </p>
                            </div>
                          </div>
                        </template>
                      </td>
                      <td :rowspan="1" :colspan="1">
                        <template class="tc" width="90%">
                          <div v-if="val.IsJunk === YNStatus.No && val.ProductPrice === val.CashPrice">
                            <span class="text-overflow">￥{{$root.toFloat(val.CashPrice)}}</span>
                          </div>
                          <div :class="val.ProductPrice !== val.CashPrice ? 'show2line text-overflow' : 'text-overflow'" v-else-if="val.IsJunk === YNStatus.No && val.ProductPrice !== val.CashPrice">
                            <span>应付:￥{{$root.toFloat(val.ProductPrice)}}</span>
                            <br>
                            <span>实付:￥{{$root.toFloat(val.CashPrice)}}</span>
                          </div>
                          <div class="show2line text-overflow" v-else-if="val.JunkSourceType !== RetailOrderBackProductSourceType.Coupon">
                            <span>回收金额:￥{{$root.toFloat(val.RecallPrice)}}</span>
                            <br>
                            <span>回收工费:￥{{$root.toFloat(val.RecallFee)}}</span>
                          </div>
                          <div class="show2line text-overflow" v-else>
                            <span>回收金额:￥{{$root.toFloat(val.RecallPrice)}}</span>
                            <br>
                            <span>折旧工费:￥{{$root.toFloat(val.RecallFee)}}</span>
                          </div>
                        </template>
                      </td>
                      <td :rowspan="1" :colspan="1">
                        <template class="tc" width="90%">
                          <div>
                            <el-tooltip placement="bottom" effect="light" v-if="val.MarproTitle && val.GiftType !== GiftType.Gift">
                              <div slot="content">
                                消费单(点击复制):
                                <br>
                                {{val.SellCode}}
                              </div>
                              <el-button type="text" name="btn-sellCode" class="copyBTN" :data-clipboard-text="val.SellCode">{{val.MarproTitle}}</el-button>
                            </el-tooltip>
                            <span v-else-if="val.IsJunk === YNStatus.No && val.GiftType !== GiftType.Gift" class="red">无</span>
                            <span v-else>-</span>
                          </div>
                        </template>
                      </td>
                      <td :rowspan="item.$length" :colspan="1" v-if="key < 1">
                        <template>
                          <div :class="[ item.$length >= 4 ? 'top4 top' : 'top' + item.$length ]">
                            <div class="price-list">
                              <div v-if="data[item.$index].ProductPrice === data[item.$index].CashPrice">
                                <p>￥{{$root.toFloat(data[item.$index].CashPrice)}}</p>
                              </div>
                              <div v-else-if="data[item.$index].ProductPrice !== data[item.$index].CashPrice">
                                <p>
                                  <span class="tr">应付：</span>
                                  <span class="tl">￥{{$root.toFloat(data[item.$index].ProductPrice)}}</span>
                                </p>
                                <p>
                                  <span class="tr">实付：</span>
                                  <span class="tl">￥{{$root.toFloat(data[item.$index].CashPrice)}}</span>
                                </p>
                              </div>
                              <div class="pay-type" v-if="item.PaymentItem.length">
                                <span
                                  style="max-width:40%;"
                                  v-for="(price, priceIndex) in item.PaymentItem"
                                  :key="priceIndex"
                                >{{ item.PaymentItem.length > 1 && priceIndex === 0 ? price.CategoryName + "，" : price.CategoryName}}</span>
                              </div>
                            </div>
                          </div>
                        </template>
                      </td>
                      <td :rowspan="item.$length" :colspan="1" v-if="key < 1">
                        <template>
                          <div :class="[item.$length >= 4 ? 'top4 top' : 'top' + item.$length ]">
                            <p>{{data[item.$index].OrderTime | filterDateMinutes}}</p>
                          </div>
                        </template>
                      </td>
                      <td :rowspan="item.$length" :colspan="1" v-if="key < 1">
                        <template>
                          <div :class="[item.$length >= 4 ? 'top4 top' : 'top' + item.$length ]">
                            <el-tooltip
                              v-if="(data[item.$index].State === RetailOrderMasterState.Abandon || data[item.$index].State === RetailOrderMasterState.Cancel)  && data[item.$index].Note "
                              class="item"
                              :content="data[item.$index].Note"
                              placement="top"
                              effect="light"
                            >
                              <span class="red">{{RetailOrderMasterState.Types[[data[item.$index].State]]}}</span>
                            </el-tooltip>
                            <p v-else>{{RetailOrderMasterState.Types[data[item.$index].State]}}</p>
                          </div>
                        </template>
                      </td>
                      <td :rowspan="item.$length" :colspan="1" v-if="key < 1">
                        <template>
                          <div :class="[item.$length >= 4 ? 'top4 top' : 'top' + item.$length ]">
                            <router-link class="btn-link el-button el-button--text el-button--mini" :to="{path: '/sales/retail/retailBigCheck',query:{code: data[item.$index].MasterCode}}">详情</router-link>
                            <template v-if="isStore">
                              <el-button v-if="data[item.$index].State < RetailOrderMasterState.Audit" type="text" @click="retailAudit(item)" name="btn-check">审核</el-button>
                              <el-button
                                v-if="data[item.$index].State === RetailOrderMasterState.Audit && data[item.$index].TerminalType !== RetailOrderMasterTerminalType.WxApplet"
                                type="text"
                                @click="retailCancel(item)"
                                name="btn-check"
                              >取消审核</el-button>
                              <el-button v-if="data[item.$index].State === RetailOrderMasterState.Wait" type="text" @click="retailAbandon(item)" name="btn-abandon">作废</el-button>
                              <el-button type="text" name="btn-print" @click="showPrint(item)">打印</el-button>
                            </template>
                          </div>
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="more-list-query" v-if="item.OrderItem.length > 4" @click="tableShowAll(item.$index)"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!data.length && !$store.getters.tb_loading" class="el-table__empty-block" style="width: 100%; border-bottom: 1px solid #e5e5e5">
        <span class="el-table__empty-text">暂无数据</span>
      </div>
    </div>
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!--  @module Dialog·打印大单  -->
    <print-order :visible.sync="printDialog" :conditions="encodeURIComponent(JSON.stringify({OrderId: masterCode }))" :printingType="SettingPrintingType.OrderCloudRetailOrderMaster"></print-order>
    <!--  End Dialog·打印大单  -->
    <!--  @module Dialog·审核  -->
    <retailAudit title="审核" :visible.sync="auditDialog" :selectRetail="selectRetail" @listenAuditDialog="getData"></retailAudit>
    <!--  End Dialog·审核  -->
    <!--  @module Dialog·取消审核  -->
    <retailcancel title="取消审核" :visible.sync="cancelDialog" :selectRetail="selectRetail" @listenCancelDialog="getData"></retailcancel>
    <!--  End Dialog·取消审核  -->
    <!--  module 作废 Dialog  -->
    <retailAbandon title="作废" :visible.sync="abandonDialog" :selectRetail="selectRetail" @listenAbandonDialog="getData"></retailAbandon>
    <!--  End Dialog·作废  -->
    <!--  dialog 货品详情  -->
    <good-detail :visible.sync="goodDetailDialog.visible" :goodsId="goodDetailDialog.goodsId"></good-detail>
    <!--  end 货品详情 -->
    <!--  dialog 货品详情2  -->
    <good-detail2 :visible.sync="goodDetailDialog2.visible" :sellCode="goodDetailDialog2.sellCode"></good-detail2>
    <!--  end 货品详情2 -->
    <!--  查看素金 & 非素  -->
    <goldCheck2 :visible.sync="checkJunkDialog" :checkInfo="checkParams"></goldCheck2>
    <!--  end 查看素金 & 非素  -->
  </el-row>
</template>
<script>
import {
  RetailOrderMasterTerminalType,
  RetailOrderSellBasicReturnState,
  RetailOrderBackProductSourceType,
  RetailOrderMasterState,
  RetailOrderSellProductSourceType,
} from '@/enums/order.js'
import { YNStatus, CharacterType } from '@/enums/common.js'
import { SettingPrintingType } from '@/enums/merchant.js'
import { GiftType } from '@/enums/stocking.js'
import { ORDER_API_RETAIL_ORDER_MASTER_GETS } from '@/apis/order.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination.vue'
import printOrder from '@/components/erp/printOrder'
import retailAbandon from './retailAbandon.vue'
import retailAudit from './retailAudit.vue'
import retailcancel from './retailCancel.vue'
import goodDetail from '@/components/erp/goodDetail'
import goodDetail2 from './goodDetail2.vue'
import goldCheck2 from './goldCheck2.vue'

import Clipboard from 'clipboard'

export default {
  data() {
    return {
      YNStatus,
      SettingPrintingType,
      RetailOrderMasterTerminalType,
      RetailOrderMasterState,
      RetailOrderSellBasicReturnState,
      RetailOrderBackProductSourceType,
      GiftType,
      RetailOrderSellProductSourceType,
      stateIndex: '0',
      terminalType: 0, // this.$root.RetailOrderMasterTerminalType.Website
      data: [],
      total: 0,
      queryForm: {
        TerminalType: '0', // Int32 消费单来源
        UniteNote: '', // String 零售单号/消费单号
        ProductNO: '', // String 门店条码
        ProductTitle: '', // String 货品名称
        MemberId: '', // String 会员序号
        Mobile: '', // String 会员手机号码
        CashierUserId: '0', // Int64 收银人员序号
        MainUserId: '0', // Int64导购人员序号
        AssistUserId: '0',
        PaymentType: '0', // Int32 支付方式(枚举)
        OrderTime1: '', // DateTime 销售时间开始
        OrderTime2: '', // DateTime 销售时间结束
        OrderTime: [],
        ReturnState: '0', // Int32 退货状态(枚举)
        State: '0', // Int32 零售单状态(枚举)
        IsJunk: '0',
        PageIndex: 1, // Int32 当前页码
        PageSize: 20, // Int32 每页?条
      },
      masterCode: '',
      users: [],
      printDialog: false,
      printDialog2: false,
      abandonDialog: false,
      auditDialog: false,
      parameters: {},
      selectGoodsId: '',
      goodDetailDialog: {
        goodsId: '',
        visible: false
      },
      goodDetailDialog2: {
        sellCode: '',
        visible: false
      },
      checkJunkDialog: false,
      checkParams: {},
      cancelDialog: false,
      selectRetail: {},
    }
  },
  computed: {
    isStore() {
      return this.$store.getters.user_session.CharacterType === CharacterType.Store
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            TerminalType: '0', // Int32 消费单来源
            UniteNote: '', // String 零售单号/消费单号
            ProductNO: '', // String 门店条码
            ProductTitle: '', // String 货品名称
            MemberId: '', // String 会员序号
            Mobile: '', // String 会员手机号码
            CashierUserId: '0', // Int64 收银人员序号
            MainUserId: '0', // Int64导购人员序号
            AssistUserId: '0',
            PaymentType: '0', // Int32 支付方式(枚举)
            OrderTime1: '', // DateTime 销售时间开始
            OrderTime2: '', // DateTime 销售时间结束
            OrderTime: [],
            ReturnState: '0', // Int32 退货状态(枚举)
            State: '0', // Int32 零售单状态(枚举)
            IsJunk: '0',
            PageIndex: 1, // Int32 当前页码
            PageSize: 20, // Int32 每页?条
          }
      this.parameters = Object.assign({}, query)
      this.parameters.OrderTime = query.OrderTime || []
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let orderTime = this.parameters.OrderTime.length
        ? this.parameters.OrderTime
        : ['', '']
      let param = {
        OrderTime1: orderTime[0], // DateTime 销售时间开始
        OrderTime2: orderTime[1], // DateTime 销售时间结束
        CreateTime1: '', // DateTime 销售时间开始
        CreateTime2: '' // DateTime 销售时间结束
      }
      this.queryForm = Object.assign(this.queryForm, this.parameters, param)

      ORDER_API_RETAIL_ORDER_MASTER_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.data.map((item, index) => {
            item.OrderItem = item.OrderItem || []
            item.PaymentItem = item.PaymentItem || []
            item.$length = item.OrderItem.length
            item.$index = index
            return item
          })
          this.total = res.data.Data.Count
        }
        setTimeout(() => {
          this.$store.commit('SET_TB_LOADING', false) // table loading
        }, 1)
      })
    },
    tableShowAll(index) {
      this.$refs['table_item_' + index][0].className ===
        'item-show-all item-warpper'
        ? this.$refs['table_item_' + index][0].setAttribute(
          'class',
          'item-show-some item-warpper'
        )
        : this.$refs['table_item_' + index][0].setAttribute(
          'class',
          'item-show-all item-warpper'
        )
    },
    getPurchase() {
      this.$store.dispatch('GET_USERS_DROPLIST')
    },
    showPrint(row) {
      this.masterCode = row.MasterCode
      this.printDialog = true
    },
    retailAbandon(row) {
      this.selectRetail = row
      this.abandonDialog = true
    },
    retailAudit(row) {
      this.selectRetail = row
      this.auditDialog = true
    },
    retailCancel(row) {
      this.selectRetail = row
      this.cancelDialog = true
    },
    toCreate() {
      this.$router.push('/sales/retail/retailCreate')
    },
    checkGold(obj) {
      // 查看
      this.checkParams = obj
      this.checkJunkDialog = true
    },
    selectDetailDialog(row, index) {
      if (row.IsJunk === this.YNStatus.No) {
        // 非旧货
        switch (row.ProductSourceType) {
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
      } else {
        this.checkGold({
          type: row.IsGold === YNStatus.Yes ? Boolean(true) : false,
          id: row.SequentialId,
          vipDetail: {
            MemberId: this.data[index].MemberId,
            Mobile: this.data[index].Mobile
          }
        })
      }
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.queryForm.isSenior = true
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.initRoute()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: this.parameters
      })
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
      this.$store.dispatch('GET_PAYMENT_TYPE')
      this.$store.dispatch('GET_SERIES_TYPE')
    }
  },
  beforeMount() {
    this.getStoreAllType()
  },
  mounted() {
    this.getPurchase()
    this.init()
    this.$nextTick(() => {
      this.Clipboard = new Clipboard('.copyBTN')
    })
  },
  watch: {
    $route: 'init',
    'queryForm.State': 'onSearch'
  },
  components: {
    searchPanel,
    pagination,
    printOrder,
    retailAbandon,
    retailAudit,
    retailcancel,
    goodDetail,
    goodDetail2,
    goldCheck2
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/erp/retail.scss';

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