
<template  >
  <div class="retail_content">
    <el-dialog title="新建退货单" width="1200px" :visible.sync="visible">
      <div class="panel-bd" v-if="active === 1">
        <!--      @module 筛选条件      -->
        <el-form
          :model="queryItems"
          :style="'min-width:800px;'"
          label-position="right"
          label-width="110px"
          class="list-query-form all"
        >
          <el-row :gutter="10">
            <el-col :span="7" class="fix-w">
              <el-form-item label="单据编号：">
                <el-input
                  v-model="queryItems.UniteNote"
                  :maxlength="50"
                  @keyup.enter.native="search"
                  name="UniteNote"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="条码：">
                <el-input
                  v-model="queryItems.ProductNO"
                  :maxlength="50"
                  @keyup.enter.native="search"
                  name="ProductNO"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="货品名称：">
                <el-input
                  v-model="queryItems.ProductTitle"
                  :maxlength="50"
                  @keyup.enter.native="search"
                  name="ProductTitle"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" @click="search" name="btn-search">搜索</el-button>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="7">
              <el-form-item label="销售时间：" class="fix-w">
                <el-date-picker
                  v-model="queryItems.OrderTime"
                  :unlink-panels="true"
                  type="daterange"
                  :picker-options="$root.datePickerOptions"
                  name="OrderTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="会员ID：">
                <el-input
                  v-model="queryItems.MemberId"
                  :maxlength="50"
                  @keyup.enter.native="search"
                  name="MemberId"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="会员手机：">
                <el-input
                  v-model="queryItems.Mobile"
                  :maxlength="11"
                  @keyup.enter.native="search"
                  name="Mobile"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button @click="reset" name="btn-reset">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
        <div v-loading="$store.getters.tb_loading">
          <div v-if="data.length">
            <table
              class="retail-table"
              cellspacing="0"
              cellpadding="0"
              border="0"
              element-loading-text="拼命加载中"
            >
              <tbody>
                <tr class="table-hd">
                  <th>货品信息</th>
                  <th>金额</th>
                  <th>参与活动</th>
                  <th>消费单号</th>
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
                              <span
                                style="margin-left:5px;"
                                class="el-tag el-tag--info-61a9da el-tag--mini"
                              >{{retailOrderMasterTerminalTypes.Types[item.TerminalType]}}</span>
                            </span>
                          </div>
                          <div class="text w200">
                            <span>销售时间: {{item.OrderTime}}</span>
                          </div>
                          <div class="text">
                            <span style="margin-right:0;">会员:{{item.TrueName?item.TrueName:item.AliasName}}</span>
                            <span>{{item.Mobile && '('+ item.Mobile +')'}}</span>
                          </div>
                          <!-- <div class="text">
                            <span>收银: {{item.CashierUser || '未知'}}</span>
                            <span>主销导购: {{item.MainUser}}</span>
                            <span>{{item.AssistUser && '辅销导购:'+ item.AssistUser}}</span>
                          </div> -->
                        </el-row>
                      </div>
                      <table class="retail-table-inline" cellspacing="0" cellpadding="0">
                        <tbody>
                          <tr v-for="(val, key) in item.OrderItem" :key="key">
                            <td :rowspan="1" :colspan="1" class="clearfix">
                              <template>
                                <div>
                                  <el-popover
                                    popper-class="big-img"
                                    placement="right"
                                    trigger="hover"
                                  >
                                    <img
                                      :src="val.ImageUrl ? $root.settings.DOMAIN_IMG_FILE + val.ImageUrl.replace('{0}', '150x150') : $root.settings.DOMAIN_IMG_FILE +  '/default/goods/1080x0.jpg'"
                                      alt
                                    >
                                    <div class="fl item-img" slot="reference">
                                      <img
                                        :src="val.ImageUrl ? $root.settings.DOMAIN_IMG_FILE + val.ImageUrl.replace('{0}', '150x150') : $root.settings.DOMAIN_IMG_FILE +  '/default/goods/150x150.jpg'"
                                        alt
                                      >
                                    </div>
                                  </el-popover>
                                </div>
                                <div class="tl fl" style="width:calc(100% - 70px); ">
                                  <div
                                    class="show2line text-overflow no-cur"
                                    v-if="val.IsJunk !== YNStatus.Yes"
                                  >
                                    <p>
                                      <span>{{val.StoreBarCode}}</span>
                                      <span
                                        class="el-tag el-tag--info-b1b1b1 el-tag--mini"
                                        v-if="val.ReturnState == retailOrderSellBasicReturnStates.ReturnOrder"
                                      >已退货</span>
                                    </p>
                                    <p>
                                      <span style="color:#999;">{{val.GoodsName}}</span>
                                    </p>
                                  </div>
                                  <div class="show2line text-overflow no-cur" v-else>
                                    <p>
                                      <span>{{val.JunkCode}}</span>
                                      <span
                                        class="el-tag el-tag--555 el-tag--mini"
                                      >{{val.JunkSourceType === retailOrderBackProductSourceTypes.Coupon ? '卡券换购' : '旧货抵扣'}}</span>
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
                                <div
                                  v-if="val.IsJunk === YNStatus.No && val.ProductPrice === val.CashPrice"
                                >
                                  <span class="text-overflow">￥{{$root.toFloat(val.CashPrice)}}</span>
                                </div>
                                <div
                                  :class="val.ProductPrice !== val.CashPrice ? 'show2line text-overflow' : 'text-overflow'"
                                  v-else-if="val.IsJunk === YNStatus.No && val.ProductPrice !== val.CashPrice"
                                >
                                  <span>应付:￥{{$root.toFloat(val.ProductPrice)}}</span>
                                  <br>
                                  <span>实付:￥{{$root.toFloat(val.CashPrice)}}</span>
                                </div>
                                <div
                                  class="show2line text-overflow"
                                  v-else-if="val.JunkSourceType !== retailOrderBackProductSourceTypes.Coupon"
                                >
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
                            <td>
                              <template>
                                <div>
                                  <el-tooltip
                                    placement="bottom"
                                    effect="light"
                                    v-if="val.MarproTitle && val.GiftType !== giftTypes.Gift"
                                  >
                                    <div slot="content">消费单(点击复制):
                                      <br>
                                      {{val.SellCode}}
                                    </div>
                                    <el-button
                                      type="text"
                                      class="copyBTN"
                                      name="btn-copyBTN"
                                      :data-clipboard-text="val.SellCode"
                                    >{{val.MarproTitle}}</el-button>
                                  </el-tooltip>
                                  <span
                                    v-else-if="val.IsJunk === YNStatus.No && val.GiftType !== giftTypes.Gift"
                                    class="red"
                                  >无</span>
                                  <span v-else>-</span>
                                </div>
                              </template>
                            </td>
                            <td>
                              <template>{{val.IsJunk === YNStatus.No ? val.SellCode : '-'}}</template>
                            </td>
                            <td>
                              <template>
                                <div v-if="val.IsJunk !== YNStatus.Yes && val.SellType === retailOrderSellBasicSellTypes.RetailOrder && val.ReturnState === retailOrderSellBasicReturnStates.NoneOfRma">
                                  <el-button
                                    v-if="data[item.$index].IsForce === YNStatus.No"
                                    type="text"
                                    @click="createMaterial(val, index)"
                                    name="btn-createMaterial"
                                  >创建退货单</el-button>
                                  <el-button
                                    v-else-if="data[item.$index].IsForce === YNStatus.Yes"
                                    type="text"
                                    @click="createForceMaterial(val, index)"
                                    name="btn-createForceMaterial"
                                  >强制创建退货单</el-button>
                                </div>
                                <span
                                  v-else-if=" val.ReturnState === retailOrderSellBasicReturnStates.ReturnOrder "
                                >已创建退货单</span>
                                <el-button
                                  type="text"
                                  name="btn-createRetailOrder"
                                  @click="$message.error('活动订单请在营销活动中退货!')"
                                  v-else-if="val.IsJunk !== YNStatus.Yes && val.SellType !== retailOrderSellBasicSellTypes.RetailOrder"
                                >创建退货单</el-button>
                                <span v-else>-</span>
                              </template>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div
                        class="more-list-query"
                        v-if="item.OrderItem&&item.OrderItem.length > 4"
                        @click="tableShowAll(item.$index)"
                      ></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <pagination
              :pg="pg"
              :size="size"
              :total="total"
              @currentChange="currentChange"
              @sizeChange="sizeChange"
            ></pagination>
          </div>
          <div
            v-if="!data.length && !$store.getters.tb_loading"
            class="el-table__empty-block"
            style="width: 100%; border-bottom: 1px solid #e5e5e5;  border-top: 1px solid #e5e5e5"
          >
            <span class="el-table__empty-text">暂无数据</span>
          </div>
        </div>
      </div>
      <!--      表格      -->
      <div v-if="active === 2">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">销售单号：</td>
                <td class="note" colspan="1">{{MasterCode}}</td>
                <td class="tit">消费单号：</td>
                <td class="note" colspan="1">{{SellCode}}</td>
                <td class="tit">会员：</td>
                <td class="note" colspan="1">{{detail.TrueName?detail.TrueName:detail.AliasName}} {{detail.Mobile}}</td>
              </tr>
              <tr>
                <td class="tit">条码：</td>
                <td class="note" colspan="1">{{detail.StoreBarCode}}</td>
                <td class="tit">款号：</td>
                <td class="note" colspan="1">{{detail.StoreStyleNumber}}</td>
                <td class="tit">货品名称：</td>
                <td class="note" colspan="1">{{detail.GoodsName}}</td>
              </tr>
              <tr>
                <td class="tit">金重：</td>
                <td class="note" colspan="1">{{$root.toFloat(detail.GoldWeight, 3)}}</td>
                <td class="tit">金价：</td>
                <td class="note" colspan="1">￥{{$root.toFloat(detail.GoldPrice)}}</td>
                <td class="tit">零售方式：</td>
                <td class="note" colspan="1">{{retailTypes.Types[detail.RetailType]}}</td>
              </tr>
              <tr>
                <td class="tit">标签价：</td>
                <td class="note" colspan="1">￥{{$root.toFloat(detail.LabelPrice)}}</td>
                <td class="tit">折扣：</td>
                <td class="note" colspan="1">{{$root.toFloat(detail.Discount*100) + '%'}}</td>
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
                <td class="note" colspan="1">￥{{$root.toFloat(detail.RecyclePrice)}}</td>
                <td class="tit">旧货折旧工费：</td>
                <td class="note" colspan="1">￥{{$root.toFloat(detail.CpfeePrice)}}</td>
                <td class="tit">实付金额：</td>
                <td class="note" colspan="1">￥{{$root.toFloat(detail.CashPrice)}}</td>
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
          <div class="tl p-10">
            应退金额:
            <b
              style="font-size: 16px; font-weight: bold; color: rgb(255, 162, 0);"
            >￥{{queryForm.AwaitPrice}}</b>
            <span>(含旧货折现:￥{{$root.toFloat(detail.RecyclePrice - detail.CpfeePrice)}})</span>
          </div>
          <el-form
            :model="queryForm"
            ref="createForm"
            label-position="right"
            label-width="110px"
            class="p10"
            :rules="rules"
          >
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="实退金额：" prop="ReturnPrice">
                  <el-input
                    v-model="queryForm.ReturnPrice"
                    @keyup.native="queryForm.ReturnPrice = $root.toFixed(queryForm.ReturnPrice, 2)"
                    :maxlength="9"
                    @keyup.enter.native="search"
                    name="ReturnPrice"
                  ></el-input>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                <el-form-item label="退款方式：" prop="PaymentType">
                  <el-select v-model="queryForm.PaymentType" placeholder="请选择">
                    <el-option v-for="(item,index) in PaymentType.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->
              <el-col :span="12">
                <el-form-item label="备注：">
                  <el-input v-model="queryForm.Note" :maxlength="50" name="Note"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="tr p-t-10">
            <el-button
              type="primary"
              @click="saveMaterial"
              :loading="$store.getters.is_loading"
              name="btn-confirm"
            >确定</el-button>
            <el-button @click="visible = false" name="btn-close">关闭</el-button>
          </div>
        </div>
      </div>
      <!--      end 表格      -->
    </el-dialog>
  </div>
</template>
<script>
import {
  YNStatus,
  PaymentType
} from '@/enums/common.js'
import {
  GiftType,
} from '@/enums/marketing.js'
import { RetailType } from '@/enums/stocking.js'
import {
  RetailOrderMasterState,
  RetailOrderSellSettleCouponType,
  RetailOrderMasterTerminalType,
  RetailOrderSellBasicReturnState,
  RetailOrderSellBasicSellType,
  RetailOrderBackProductSourceType
} from '@/enums/order.js'

import {
  ORDER_API_RETAIL_ORDER_SELL_BASIC_GET,
  ORDER_API_RETAIL_ORDER_MASTER_GETS,
  ORDER_API_RETAIL_ORDER_RETURN_CREATEBYSELF
} from '@/apis/order.js'

import pagination from '@/components/pagination'
import Clipboard from 'clipboard'

export default {
  data() {
    return {
      YNStatus,
      PaymentType,
      retailOrderMasterState: RetailOrderMasterState,
      retailOrderMasterTerminalTypes: RetailOrderMasterTerminalType,
      retailOrderSellBasicReturnStates: RetailOrderSellBasicReturnState,
      retailOrderBackProductSourceTypes: RetailOrderBackProductSourceType,
      retailOrderSellBasicSellTypes: RetailOrderSellBasicSellType,
      giftTypes: GiftType,
      retailTypes: RetailType,
      retailOrderSellSettleCouponTypes: RetailOrderSellSettleCouponType,
      visible: this.materialDialog,
      returnDays: 1,
      active: 1,
      success: false,
      queryItems: {
      },
      queryForm: {
      },
      queryAll: false,
      queryAll2: false,
      pg: 1,
      size: 10,
      total: 0,
      Clipboard: '',
      copyCode: '',
      data: [],
      MasterCode: '',
      SellCode: '',
      rules: {
        ReturnPrice: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === '' || value < 0) {
                callback(new Error('请输入大于0的金额'))
              } else if (!/^(\d+|\d+.\d+)$/.test(value) && value !== '0') {
                callback(new Error('必须为数字'))
              }
              callback()
            }
          }
        ],
        // 这期不做
        // PaymentType: [
        //   {
        //     required: true,
        //     message: '退款方式不能为空！'
        //   }
        // ]
      }
    }
  },
  props: {
    materialDialog:{
      type: Boolean,
      default: false
    }
  },
  computed: {
  },
  mounted() {
    this.getDataList()
    this.$nextTick(() => {
      this.Clipboard = new Clipboard('.copyBTN')
    })
  },
  methods: {
    getDataList() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let orderTime = this.queryItems.OrderTime || ['', '']
      let param = {
        State: RetailOrderMasterState.Audit,
        UniteNote: '', // 单据编号
        ProductNO: '', // 条码
        ProductTitle: '', // 货品名称
        ReturnState: '', // 退货状态
        MemberId: '', // 会员ID
        Mobile: '', // 会员手机
        OrderTime1: orderTime[0], // DateTime 销售时间开始
        OrderTime2: orderTime[1], // DateTime 销售时间结束
        PageIndex: this.pg, // Int32 当前页码
        PageSize: this.size // Int32 每页?条
      }
      param = Object.assign({}, param, this.parameters)
      console.log('this.parameters', this.parameters, 'param', param)

      ORDER_API_RETAIL_ORDER_MASTER_GETS(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows||[]
          this.data.map((item, index) => {
            let now = new Date().getTime()
            let expTime = new Date(item.Expiree).getTime()
            if (now > expTime) {
              item.IsForce = this.YNStatus.Yes
            } else {
              item.IsForce = this.YNStatus.No
            }
            item.$length = item.OrderItem?item.OrderItem.length:0
            item.$index = index
            return item
          })
          
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    getMaterialData() {
      console.log(222, this.SellCode)
      this.$store.commit('SET_TB_LOADING', true) // table loading
      ORDER_API_RETAIL_ORDER_SELL_BASIC_GET({
        SellCode: this.SellCode
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.active = 2
          this.detail = res.data.Data
          this.queryForm.AwaitPrice = this.$root.toFloat(
            res.data.Data.CashPrice +
            res.data.Data.RecyclePrice -
            res.data.Data.CpfeePrice
          )
          
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    search() {
      this.pg = 1
      this.parameters = Object.assign({
      }, this.queryItems)
      this.getDataList()
    },
    reset() {
      this.pg = 1
      this.queryItems = {
        PreviousId: '',
        StoreBarCode: '',
        GoodsName: '',
        CreateTime: '',
        MemberId: '',
        Mobile: ''
      }
      this.search()
    },
    currentChange(val) {
      this.pg = val
      this.getDataList()
    },
    sizeChange(val) {
      this.pg = 1
      this.size = val
      this.getDataList()
    },
    selectChange(selection) {
      this.selectData = selection
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
    copyTheCode(val) {
      this.copyCode = val
    },
    createMaterial(row, index) {
      // 普通创建
      this.MasterCode = this.data[index].MasterCode
      this.SellCode = row.SellCode
      this.getMaterialData()
    },
    createForceMaterial(row, index) {
      // 强制创建
      this.$confirm('确定强制创建退货单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(111333)
          this.MasterCode = this.data[index].MasterCode
          this.SellCode = row.SellCode
          this.getMaterialData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    // objectSpanMethod({
    //   row, column, rowIndex, columnIndex 
    // }) {
    //   if (columnIndex === 0) {
    //     return {
    //       rowspan: 1,
    //       colspan: 5
    //     }
    //   } else if (columnIndex > 0) {
    //     return {
    //       rowspan: 0,
    //       colspan: 0
    //     }
    //   }
    // },
    saveMaterial() {
      this.$refs['createForm'].validate(valid => {
        if (!valid) {
          return false
        }
        if (parseFloat(this.queryForm.AwaitPrice) < parseFloat(this.queryForm.ReturnPrice)) {
          this.$message.error('实退金额大于应退金额')
          return false
        }
        this.$store.commit('SET_BTN_LOADING', true) // btn loading
        ORDER_API_RETAIL_ORDER_RETURN_CREATEBYSELF({
          SellCode: this.SellCode, // String  新品子单号
          AwaitPrice: this.$root.toInt(this.queryForm.AwaitPrice), // Decimal  应退金额
          ReturnPrice: this.$root.toInt(this.queryForm.ReturnPrice), // Decimal  实退金额
          Note: this.queryForm.Note // String  备注(退货原因)
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            if (res.data.Data&&res.data.Data.IsForce == YNStatus.Yes){ // 积分退货
              this.$confirm(res.data.Data.ForceMessage, '提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                ORDER_API_RETAIL_ORDER_RETURN_CREATEBYSELF({
                  SellCode: this.SellCode, // String  新品子单号
                  AwaitPrice: this.$root.toInt(this.queryForm.AwaitPrice), // Decimal  应退金额
                  ReturnPrice: this.$root.toInt(this.queryForm.ReturnPrice), // Decimal  实退金额
                  Note: this.queryForm.Note, // String  备注(退货原因)
                  IsForce: YNStatus.Yes
                }).then(res => {
                  if(res.data.Code === 'CORRECT'){
                    this.$message.success('提交成功！')
                    this.success = true
                    this.$emit('listenmaterialDialog', 'materialDialog', this.success)
                    this.$store.commit('SET_BTN_LOADING', false) // btn loading
                  }else {
                    this.$store.commit('SET_BTN_LOADING', false) // btn loading
                    this.$message.error(res.data.Message)
                  }
                })
              }).catch(() => {
                this.$store.commit('SET_BTN_LOADING', false)
              })
            }else{
              this.$message.success('提交成功！')
              this.success = true
              this.$emit('listenmaterialDialog', 'materialDialog', this.success)
              this.$store.commit('SET_BTN_LOADING', false) // btn loading
            }
          } else {
            this.$store.commit('SET_BTN_LOADING', false) // btn loading
            this.$message.error(res.data.Message)
          }
        })
      })
    }
  },
  components: {
    pagination
  },
  watch: {
    visible() {
      this.$emit('listenmaterialDialog', 'materialDialog', this.success)
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/sass/erp/retail.scss";
.info-head .cell .text {
  margin-left: 0;
  margin-right: 25px;
}
.w200{
  width: 200px;
}
</style>