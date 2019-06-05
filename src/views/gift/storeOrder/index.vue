<template>
  <div class="content">
    <el-form :model="queryForm" ref="queryForm" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-dropdown name="handleOperation" trigger="hover" @command="handleOperation">
            <el-button type="primary">
              批量操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="delivery" :disabled="selections.length == 0">批量发货</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown  name="handleOrder" trigger="hover" @command="handleOrder">
            <el-button class="m-l-10">
              导出订单<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="selected" :disabled="selections.length == 0">导出已选</el-dropdown-item>
              <el-dropdown-item command="result">导出查询结果</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown name="handleInfo" trigger="hover" @command="handleInfo">
            <el-button class="m-l-10">
              导出收货人信息<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="selected" :disabled="selections.length == 0">导出已选</el-dropdown-item>
              <el-dropdown-item command="result">导出查询结果</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
            <el-button name="btnAudit" class="m-l-10" @click="auditRulesFlg = true">
              审核规则
            </el-button>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="orderStatus">
            <el-dropdown name="selectstatus" @command="selectstatus">
              <el-button type="default" style="width: 100px">
                {{activeState}}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="''">所有状态</el-dropdown-item>
                <el-dropdown-item v-for="item in orderStatus.Types" :key="item.key" :command="item.key">{{item.title}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item>
            <el-input placeholder="单据编号" v-model="queryForm.orderCode" maxlength="30" @keyup.enter.native="onSearch">
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="类型：" prop="giftOrderType">
            <el-select name="giftOrderType" filterable v-model="queryForm.giftOrderType" placeholder="所有类型">
              <el-option label="所有类型" :value="''"></el-option>
              <el-option v-for="item in giftTypes.Types" :key="item.key" :label="item.title" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单据编号：" prop="orderCode">
            <el-input name="orderCode" maxlength="30" v-model="queryForm.orderCode" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="下单时间：" prop="createTime">
            <el-date-picker name="createTime" type="daterange" v-model="queryForm.createTime" unlink-panels :picker-options="$root.datePickerOptions" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="支付时间：" prop="payTime">
            <el-date-picker name="payTime" type="daterange" v-model="queryForm.payTime" unlink-panels :picker-options="$root.datePickerOptions" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="发货时间：" prop="expressTime">
            <el-date-picker name="expressTime" type="daterange" v-model="queryForm.expressTime" unlink-panels :picker-options="$root.datePickerOptions" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="下单人手机：" prop="mobile">
            <el-input name="mobile" v-model="queryForm.mobile" maxlength="11" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="收货人手机：" prop="receiveMobile">
            <el-input name="receiveMobile" v-model="queryForm.receiveMobile" maxlength="11" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <div v-loading="$store.getters.tb_loading">
      <table class="retail-table" cellspacing="0" cellpadding="0" border="0" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <tbody>
          <tr class="table-hd">
            <th>
              <label name="allChecked" role="checkbox" class="el-checkbox is-checked fl p-l-10 p-r-10" aria-checked="true">
                <span aria-checked="mixed" :class="['el-checkbox__input', allChecked ? 'is-checked': '', data.length ? '' : 'is-disabled']">
                  <span class="el-checkbox__inner"></span>
                  <input type="checkbox" class="el-checkbox__original" v-model="allChecked" :disabled="!data.length"/> 
                </span>
              </label>
              礼品信息
            </th>
            <th>数量</th>
            <th>单价</th>
            <th>兑换情况</th>
            <th>时间</th>
            <th>操作</th>
          </tr>
          <tr v-for="(item, index) in data" :key="index">
            <td colspan="7">
              <div :ref='"table_item_"+index' class="item-show-some item-warpper">
                <div class="info-head">
                  <el-row class="cell">
                    <div style="margin:0;width:28px;">
                      <label name="allCheckedItem"  role="checkbox" class="el-checkbox is-checked " aria-checked="true">
                        <span aria-checked="mixed" :class="['el-checkbox__input', allCheckedList[index]['checked'] ? ' is-checked': '']">
                          <span class="el-checkbox__inner"></span>
                          <input type="checkbox" :checked="allCheckedList[index]['checked']" class="el-checkbox__original" @change="changeChecked(item, index)" />
                        </span>
                      </label>
                    </div>
                    <div>
                      <el-tooltip placement="top" effect="light">
                        <div slot="content" ref="copyTip">点击复制</div>
                        <span name="btnCopyText" class="copyBTN order-code" @click="copyCode(index)" :data-clipboard-text="item.orderCode">{{item.orderCode}}</span>
                      </el-tooltip>
                      <span style="margin-left:5px;" class="el-tag el-tag--info-61a9da el-tag--mini" >{{item.orderStatusText}}</span>
                      <span style="margin-left:5px;" class="el-tag el-tag--info-61a9da el-tag--mini" >{{item.orderTypeText}}</span>
                    </div>
                    <div class="text">
                      <span style="margin-right:0;">下单人：{{item.trueName || item.aliasName}}</span>
                      <span>{{item.mobile}}</span>
                    </div>
                    <div class="text">
                      <span style="margin-right:0;">收货人：{{item.receiveName}}</span>
                      <span>{{item.receiveMobile}}</span>
                    </div>
                  </el-row>
                </div>    
                <table class="retail-table-inline" cellspacing="0" cellpadding="0" >
                  <tbody>
                    <tr v-for="(val, key) in item.orderItems" :key="key" >
                      <td :rowspan="1" :colspan="1"  class="clearfix">
                        <template>
                          <div>
                            <el-popover popper-class="big-img" placement="right" trigger="hover">
                              <img :src="val.imageUrl ? $root.settings.DOMAIN_IMAGE + val.imageUrl : $root.settings.DOMAIN_IMAGE +  '/default/goods/150x150.jpg'" alt="" />
                              <div class="fl item-img" slot="reference">
                                <img :src="val.imageUrl ? $root.settings.DOMAIN_IMAGE + val.imageUrl : $root.settings.DOMAIN_IMAGE +  '/default/goods/150x150.jpg'" alt="" @click="giftDetail(val.giftId)"/>
                              </div>
                            </el-popover>
                          </div>
                          <div class=" tl fl " style="width:calc(100% - 70px); ">
                            <div class="show2line text-overflow">
                              <p>
                                <b name="btnGetDetail" class="init-button-text" @click="giftDetail(val.giftId)">{{val.giftName}}</b>
                              </p>
                              <p>
                                <span style="color:#999;" v-for="(i, j) in val.attributes" :key="j">{{i.name + ':' + i.val}}&emsp;</span>
                              </p>
                            </div>
                          </div>
                        </template>
                      </td>
                      <td :rowspan="1" :colspan="1">
                        <template class="tc" width="90%">
                          <div>
                            <span class="text-overflow">{{val.quantity}}</span>
                          </div>
                        </template>
                      </td>
                      <td :rowspan="1" :colspan="1">
                        <template>
                          <div>
                            <span class="text-overflow">建议零售价：{{val.retailPrice}}</span>
                          </div>
                        </template>
                      </td>
                      <td :rowspan="1" :colspan="1">
                        <template>
                          <div>
                            <span class="text-overflow">{{val.exchangeInfo}}</span>
                          </div>
                        </template>
                      </td>
                      <td :rowspan="item.$length" :colspan="1" v-if="key < 1">
                        <div :class="[item.$length >= 4 ? 'top4 top' : 'top' + item.$length]">
                          <template>
                            <div class="show3line">
                              <span class="text-overflow">下单：{{data[index].createTime}}</span>
                              <span class="text-overflow" v-if="data[index].orderStatus > orderStatus.PendingPay && data[index].checkTime">审核：{{data[index].checkTime}}</span>
                              <span class="text-overflow" v-if="data[index].orderStatus == orderStatus.PendingReceive || data[index].orderStatus == orderStatus.Complete">发货：{{data[index].expressTime}}</span>
                              <span class="text-overflow" v-if="data[index].orderStatus == orderStatus.Cancel">取消：{{data[index].cancelTime}}</span>
                              <span class="text-overflow" v-if="data[index].orderStatus == orderStatus.Invalid">作废：{{data[index].invalidTime}}</span>
                            </div>
                          </template>
                        </div>
                      </td>
                      <td :rowspan="item.$length" :colspan="1" v-if="key < 1">
                        <template>
                          <div :class="[item.$length >= 4 ? 'top4 top' : 'top' + item.$length]" >
                            <div>
                              <router-link name="btnLink" class="el-button el-button--text el-button--mini"  :to="{path: '/gift/storeOrder/storeOrderCheck',query:{orderId: data[index].orderId}}" >详情</router-link>
                              <template v-if="data[index].orderType == giftTypes.Self">
                                <el-button name="btnAudit"  v-if="data[index].orderStatus == orderStatus.PendingAudit" type="text" @click="audit(data[index].orderId)">审核</el-button>
                                <el-button name="btnSendThing"  v-if="data[index].orderStatus == orderStatus.PendingDelivery" type="text" @click="showDelivery(data[index].orderId)">发货</el-button>
                                <el-button name="btnSendThingAngin"  v-if="data[index].orderStatus == orderStatus.PendingReceive" type="text" @click="showDelivery(data[index].orderId)">重新发货</el-button>
                                <el-button name="btnNullify"  v-if="data[index].orderStatus < orderStatus.PendingReceive" type="text" @click="invalid(data[index].orderId)">作废</el-button>
                              </template>
                              <template v-else>
                                <el-button name="btnAudit2" v-if="data[index].orderStatus == orderStatus.PendingAudit" type="text" @click="audit(data[index].orderId)">审核</el-button>
                                <el-button name="btnNullify2" v-if="data[index].orderStatus == orderStatus.PendingAudit" type="text" @click="invalid(data[index].orderId)">作废</el-button>
                              </template>
                            </div>
                          </div>
                        </template>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="more-list-query" name="btnOpen" v-if="data[index].orderItems.length > 4"  @click="tableShowAll(index)"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!data.length && !$store.getters.tb_loading" class="el-table__empty-block" style="width: 100%; border-bottom: 1px solid #e5e5e5"><span class="el-table__empty-text">暂无数据</span></div>
    </div>
    <pagination :total="total" :pg="queryForm.pageIndex" :size="queryForm.pageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- @module 导出 -->
    <export-filed-setter title="导出" :visible.sync="exportVisible" :api="filedsApi" :apiKey="apiKey" @submit="exportData"></export-filed-setter>
    <!-- End 导出 -->
    <!-- @module Dialog·打印订单 -->
    <print-order title="打印" v-if="printDialog" :visible.sync="printDialog" :conditions="encodeURIComponent(JSON.stringify({OrderId: selectionsId }))" :printingType="printingTypes" @listenPrintDialog="printDialog = false"></print-order>
    <!-- End Dialog·打印订单 -->
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
            <p>{{detail.payTime}}</p>
          </div>
        </el-step>
        <el-step title="审核">
          <div slot="description" v-if="active > 2">
            <p>{{detail.checkUser}}</p>
            <p>{{detail.checkTime}}</p>
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
        <el-form-item label="收货方式：" prop="receiveType">
          <el-radio-group name="receiveType" v-model="deliveryParams.receiveType">
            <el-radio v-for="item in receiveTypes.Types" :label="parseInt(item.key)" :key="item.key">{{item.title}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="快递公司：" prop="expressType" v-if="deliveryParams.receiveType == 0">
          <el-select  name="expressType" filterable v-model="deliveryParams.expressType" placeholder="请选择">
            <el-option v-for="item in expressTypes.Types" :key="item.key" :label="item.title" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号：" prop="expressCode" v-if="deliveryParams.receiveType == 0">
          <el-input  name="expressCode" v-model="deliveryParams.expressCode" placeholder="20个英文字符以内" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="发货备注：">
          <el-input  name="expressNote" type="textarea" v-model="deliveryParams.expressNote" :maxlength="50" placeholder="50字以内"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnSave" type="primary" @click="delivery">保 存</el-button>
        <el-button name="btnClose" @click="showDeliveryDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- @module 发货 -->
    
    <!-- @module 审核规则 -->
    <el-dialog title="审核规则" :visible.sync="auditRulesFlg" width="555px">
      <div class="m-b-10">代理礼品订单审核规则：</div>
      <el-radio-group name="auditRulesType" class="m-b-10" v-model="auditRulesType">
        <el-radio :label="parseInt(orderAuditRuleTypes.Auto)">自动审核</el-radio>
        <el-radio :label="parseInt(orderAuditRuleTypes.Manual)">人工审核</el-radio>
      </el-radio-group>
      <br/>
      <span style="color: #aaa;">注：自营礼品订单自动审核</span>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnSaveAudit" type="primary" @click="auditRules">保 存</el-button>
        <el-button name="btnCloseAudit" @click="auditRulesFlg = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- @end 审核规则 -->
  </div>
</template>

<script>
import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
import exportFiledSetter from '@/components/exportFieldSetter'
import printOrder from '@/components/erp/printOrder'
import showDetail from '@/components/gifting/showDetail.vue'
import Clipboard from 'clipboard'
import {
  OrderStatus, GiftTypes, StoreSettingPrintingType, ExpressTypes, ReceiveTypes, OrderAuditRuleTypes
} from '@/enums/gifting'
import { CharacterType } from '@/enums/common'
import {
  GIFTING_API_GIFTSALEORDER_SEARCH,
  GIFTING_API_STOREEXPORTER_GETEXPORTFIELDS,
  GIFTING_API_STOREEXPORTER_EXPORTTOFILE,
  GIFTING_API_GIFT_GETDETAILBYSTORE,
  GIFTING_API_GIFTSALEORDER_INVALID,
  GIFTING_API_GIFTSALEORDER_DELIVERY,
  GIFTING_API_GIFTSALEORDER_GETORDER,
  GIFTING_API_RULE_GETORDERAUDITRULE,
  GIFTING_API_RULE_SAVEORDERAUDITRULE,
  GIFTING_API_GIFTSALEORDER_AUDIT
} from '@/apis/gifting'
export default {
  data () {
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
      orderAuditRuleTypes: OrderAuditRuleTypes,
      auditRulesType: 0,
      giftTypes: GiftTypes,
      storeSettingPrintingType: StoreSettingPrintingType,
      expressTypes: ExpressTypes,
      receiveTypes: ReceiveTypes,
      characterType: CharacterType,
      activeState: '所有状态', // 显示状态
      queryForm: {
        createTime: '',
        payTime: '',
        expressTime: '',
        storeName: '',
        supplierName: '',
        orderStatus: '',
        giftOrderType: '',
        orderCode: '',
        mobile: '',
        receiveMobile: '',
        pageIndex: 1,
        pageSize: 10,
      },
      auditRulesFlg: false,
      allChecked: false,
      allCheckedList: [],
      selections: [], // 选择条目
      selectionsId: [], // 选择条目的id
      selectionsCode: [], // 选择条目的orderCode
      data:[],
      total: 0,
      storeMenus: [], // 门店下拉
      supplierMenus: [], // 供应商下拉
      parameter: {
      },
      exportVisible: false, // 导出弹窗
      filedsApi: GIFTING_API_STOREEXPORTER_GETEXPORTFIELDS, // 查询导出数据的可选列
      apiKey: 'GIFTSALEORDERFORC_GETORDERITEMSFOREXPORT',
      exportType: 1, // 导出方式
      printingTypes: '', // 打印内容
      printDialog: false, // 打印弹窗
      detailShow: false, // 礼品详情弹窗
      detailInfo: {
      }, // 礼品详情
      activeTab: '1', // tab切换显示
      detail: {
      }, // 订单详情
      deliveryParams: {
        receiveType: 0,
        expressCode: '',
        expressNote: '',
      },
      showDeliveryDialog: false,
      rules: {
        receiveType: [
          {
            required: true, message: '请选择收货方式', trigger: 'change' 
          }
        ],
        expressCode: [
          {
            required: true, validator: checkExpressCode, trigger: 'change' 
          }
        ],
        expressType: [
          {
            required: true, message: '请选择快递公司', trigger: 'change' 
          }
        ]
      },
      isBatch: true,
      active: 0,
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: this.$router.path, query: JSON.parse(JSON.stringify(this.parameter)) 
      })
    },
    init() {
      let query = this.$route.query || {
      }
      this.parameter.storeName = query.storeName || ''
      this.parameter.supplierName = query.supplierName || ''
      this.parameter.orderStatus = query.orderStatus || ''
      this.parameter.orderCode = query.orderCode || ''
      this.parameter.mobile = query.mobile || ''
      this.parameter.receiveMobile = query.receiveMobile || ''
      this.parameter.createTime = query.createTime || ['', '']
      this.parameter.payTime = query.payTime || ['', '']
      this.parameter.expressTime = query.expressTime || ['', '']
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.pageSize = query.pageSize || 10
      this.activeState = !query.orderStatus ? '所有状态' : this.orderStatus.Types.filter(item => item.key == query.orderStatus)[0].title
      this.getData()
    },
    getData () {
      let parameter = Object.assign(this.queryForm, this.parameter, {
        createTimeStart: this.parameter.createTime[0],
        createTimeEnd: this.parameter.createTime[1],
        payTimeStart: this.parameter.payTime[0],
        payTimeEnd: this.parameter.payTime[1],
        expressTimeStart: this.parameter.expressTime[0],
        expressTimeEnd: this.parameter.expressTime[1],
      })
      this.$store.commit('SET_TB_LOADING', true)
      GIFTING_API_GIFTSALEORDER_SEARCH(parameter).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        this.data = res.data.Data.rows
        this.total = res.data.Data.total
        this.allCheckedList = res.data.Data.rows
        this.data.map((item, index) => {
          item.$length = item.orderItems.length
          item.$index = index
          this.$set(
            this.allCheckedList,
            index,
            Object.assign(item, {
              checked: false 
            })
          )
          return item
        })
      })
      this.allChecked = false
    },
    currentChange (val) {
      // 切换当前页
      this.parameter.pageIndex = val
      this.initRoute()
    },
    sizeChange (val) {
      // 切换每页显示条数
      this.parameter.pageIndex = 1
      this.parameter.pageSize = val
      this.initRoute()
    },
    onSearch () {
      // 搜索相关
      this.queryForm.pageIndex = 1
      this.parameter = Object.assign({
      }, this.queryForm)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset () {
      // 重置表单
      this.$refs['queryForm'].resetFields()
      this.onSearch()
    },
    selectstatus (v) {
      this.parameter.pageIndex = 1
      this.parameter.orderStatus = v
      this.initRoute()
    },
    handleOperation (command) {
      // 批量操作
      if (command === 'delivery') {
        this.isBatch = true
        this.selections.forEach(item => {
          if (item.orderStatus != this.orderStatus.PendingDelivery) {
            this.isBatch = false
            return this.$message.error('请选择待发货的订单')
          }
          if (item.orderType == this.giftTypes.Agent) {
            this.isBatch = false
            return this.$message.error('只能批量发货自营礼品订单')
          }
        })
        if (this.isBatch) {
          this.$router.push({
            path: '/gift/storeOrder/storeBatchShip', query: {
              orderIds: JSON.stringify(this.selectionsId)
            }
          })
        }
      }
    },
    handleOrder (command) {
      // 导出订单
      if (command === 'selected') {
        this.exportType = 0
      } else {
        this.exportType = 1
      }
      this.apiKey = 'GIFTSALEORDERFORC_GETORDERITEMSFOREXPORT'
      this.exportVisible = true
    },
    handleInfo (command) {
      // 导出收货信息
      if (command === 'selected') {
        this.exportType = 0
      } else {
        this.exportType = 1
      }
      this.apiKey = 'GIFTSALEORDERFORC_GETRECEIVERINFOFOREXPORT'
      this.exportVisible = true
    },
    changeChecked(item, index){
      this.$set(this.allCheckedList, index, Object.assign(item, {
        checked: !this.allCheckedList[index].checked 
      }))
      this.getCheckedList()
    },
    getCheckedList() {
      this.selections = []
      this.selectionsId = []
      this.selectionsCode = []
      this.allCheckedList.forEach((item) => {
        item.checked && this.selections.push(item)
        item.checked && this.selectionsId.push(item.orderId)
        item.checked && this.selectionsCode.push(item.orderCode)
      })
    },
    tableShowAll (index) {
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
    exportData (fields) {
      GIFTING_API_STOREEXPORTER_EXPORTTOFILE({
        apiKey: this.apiKey,
        exportFields: fields,
        exportType: this.exportType,
        apiParameter: this.queryForm,
        records: this.selectionsId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.exportVisible = false
          this.$message.success('导出成功！')
          window.open(this.$root.settings.DOMAIN_TEMP + res.data.Data)
        }
      })
    },
    detailShowCancel(done){
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
    audit (id) {
      // 审核
      this.$confirm('确定审核？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(id)
        GIFTING_API_GIFTSALEORDER_AUDIT({
          orderId: id 
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('审核成功')
            this.getData()
          } else {
            this.$message.error(res.data.Message)
            this.getData()
          }
        })
      })
        .catch(() => {})
    },
    invalid (id) {
      // 作废
      this.$confirm('确定作废？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        GIFTING_API_GIFTSALEORDER_INVALID({
          orderId: id
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('作废成功')
            this.getData()
          }
        })
      }).catch(() => {})
    },
    showDelivery (id) {
      // 发货
      GIFTING_API_GIFTSALEORDER_GETORDER({
        orderId: id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.deliveryParams.orderId = res.data.Data.orderId
          this.deliveryParams.orderCode = res.data.Data.orderCode
          this.deliveryParams.expressCode = res.data.Data.expressCode
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
          this.showDeliveryDialog = true
        }
      })
    },
    delivery () {
      this.$refs['deliveryForm'].validate(valid => {
        if (valid) {
          GIFTING_API_GIFTSALEORDER_DELIVERY(this.deliveryParams).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('发货成功')
              this.showDeliveryDialog = false
              this.getData()
            }
          })
        }
      })
    },
    getAuditRulesType() {
      GIFTING_API_RULE_GETORDERAUDITRULE().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.auditRulesType = res.data.Data
        }
      })
    },
    auditRules () {
      GIFTING_API_RULE_SAVEORDERAUDITRULE(this.auditRulesType).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('保存成功')
          this.auditRulesFlg = false
        }
      })
    },
    copyCode (index) {
      // 点击复制
      this.$refs.copyTip[index].innerHTML = '复制成功'
      setTimeout(() => {
        this.$refs.copyTip[index].innerHTML = '点击复制'
      }, 800)
    }
  },
  mounted() {
    this.init()
    this.getAuditRulesType()
    this.$nextTick(() => {
      this.Clipboard = new Clipboard('.copyBTN')
    })
  },
  watch: {
    $route: 'init',
    'allChecked' (to) {
      this.allCheckedList.forEach((item) => {
        item.checked = to
      })
      this.getCheckedList()
    },
    'auditRulesFlg': 'getAuditRulesType'
  },
  components: {
    pagination,
    exportFiledSetter,
    searchPanel,
    printOrder,
    showDetail
  }
}
</script>

<style lang="scss" >
@import '../../../assets/sass/erp/retail.scss';
.order-code {
  cursor: pointer;
  color: #1f91df;
}
.retail-table-inline .show2line span{
  max-width: 40%;
  overflow:hidden;
}
</style>