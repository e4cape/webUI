
<template  >
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">新建零售单</span>
      </div>
      <div class="panel-bd">
        <!--  信息  -->
        <div class="p-10">
          <el-form class="retailForm" :rules="rules" :model="queryItems" label-width="110px" ref="retailForm">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="收银员：" prop="CashierUserId">
                  <el-select v-model="queryItems.CashierUserId" filterable clearable name="CashierUserId">
                    <!-- <el-option label="请选择" :value="0"></el-option> -->
                    <el-option v-for="(item, index) in cashierList" :key="index" :label="item.TrueName" :value="item.UserId"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="主销导购：" prop="MainUserId">
                  <el-select v-model="queryItems.MainUserId" filterable clearable name="MainUserId">
                    <el-option v-for="(item, index) in employeeList" :key="index" :label="item.TrueName" :value="item.UserId"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="辅销导购：">
                  <el-select v-model="queryItems.AssistUserId" filterable clearable name="AssistUserId">
                    <el-option v-for="(item, index) in employeeList" :key="index" :label="item.TrueName" :value="item.UserId"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="会员：" prop="MemberId">
                  <el-input style="vertical-align: top;" :maxlength="50" placeholder="输入/扫描会员" @keyup.enter.native="searchVip" v-model="queryItems.MemberId" name="MemberId">
                    <el-button slot="append" icon="el-icon-search" name="btn-searchClick" @click="vipDialog = true"></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <div class="vipInfo clearfix">
                  <img class="fl" v-if="vipInfo.ImageUrl" :src="vipInfo.ImageUrl.indexOf('http') > -1 ? vipInfo.ImageUrl : $root.settings.DOMAIN_IMAGE + vipInfo.ImageUrl">
                  <span class="fl">
                    <em>{{vipInfo.Mobile}}</em>
                    <em>{{vipInfo.AliasName}}{{vipInfo.TrueName ? '('+vipInfo.TrueName+')' : ''}}</em>
                  </span>
                </div>
              </el-col>
              <el-col :span="8"></el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item label="备注：">
                  <el-input placeholder="输入备注" :maxlength="200" v-model="queryItems.Note" name="Note"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="checkPage-hd">
          <el-row>
            <el-col :span="12">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-input placeholder="录入/扫描条码" v-model="searchGoodsCode" @keyup.enter.native="searchGoldCode" :maxlength="30" name="searchGoodsCode">
                    <el-button slot="append" name="btn-searchGoodsCode" icon="el-icon-search" @click="searchGoldCode"></el-button>
                  </el-input>
                </el-col>
                <el-col :span="12">
                  <el-button type="primary" name="btn-selectGoods" @click="dialogSelectGoodsVisible=true, someGoodsData={Rows:[],Count:0}">选择货品</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12" class="tr">
              <span>旧货抵扣 :</span>
              <el-button type="text" name="btn-createSuGold" @click="createSuGold(YNStatus.Yes)">+添加旧货(素金)</el-button>
              <el-button type="text" name="btn-createNotSuGold" @click="createSuGold(YNStatus.No)">+添加旧货(非素)</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="panel-bd p-x-10 m-b-10">
          <el-table class="retail_table" :data="orderData" :show-summary="true" :summary-method="getSummaries" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
            <el-table-column width="50" show-overflow-tooltip>
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
                      :src="scope.row.ImageUrl.slice(0,4) === 'http' ? scope.row.ImageUrl : $root.settings.DOMAIN_IMG_FILE + (scope.row.ImageUrl ? scope.row.ImageUrl.replace('{0}', '50x50') : '/default/goods/50x50.jpg')"
                      alt
                    >
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="GoodsName" label="货品名称" min-width="160" show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="clearfix" @click="showDetailDialog(scope.row)">
                  <div class="show2line fl tl" style="width:calc(100% - 40px)">
                    <div>
                      <span class="init-button-text">{{scope.row.StoreBarCode}}</span>
                      <br>
                      <span class="init-button-text text-overflow">{{scope.row.StoreStyleNumber ? scope.row.StoreStyleNumber + '-' : ''}}{{scope.row.GoodsName}}</span>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="GoldType" label="成色" min-width="70" show-overflow-tooltip>
              <template slot-scope="scope">{{$store.getters.goldType.Types[scope.row.GoldType]}}</template>
            </el-table-column>
            <el-table-column prop="GoldWeight" label="金重(g)" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input
                  :disabled="inputType.GoldWeightType === SettingParameterEditType.Unable"
                  :maxlength="10"
                  v-model="scope.row['GoldWeight']"
                  @keyup.native="scope.row['GoldWeight'] = toFixed(scope.row['GoldWeight'], 3)"
                  @keydown.native="updateQty4(scope.row)"
                  @blur="updateQty4(scope.row)"
                  name="row['GoldWeight']"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="GoldPrice" label="金价(元/g)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-input
                  :disabled="inputType.GoldPriceType === SettingParameterEditType.Unable"
                  maxlength="10"
                  v-model="scope.row['GoldPrice']"
                  @keyup.native="scope.row['GoldPrice']= toFixed(scope.row['GoldPrice'], 3)"
                  @keydown.native="updateQty5(scope.row)"
                  @blur="updateQty5(scope.row)"
                  name="row['GoldPrice']"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="RetailType" label="零售方式" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">{{RetailType.Types[scope.row.RetailType]}}</template>
            </el-table-column>
            <el-table-column prop="LabelPrice" label="标签价(元)" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">￥{{scope.row.LabelPrice}}</template>
            </el-table-column>
            <el-table-column prop="Discount" min-width="120" show-overflow-tooltip>
              <template slot="header">
                <el-tooltip content="折扣 = 销售价 ÷ 标签价" effect="light" placement="top">
                  <span>
                    折扣
                    <i class="el-icon-question"></i>
                  </span>
                </el-tooltip>
              </template>
              <template slot-scope="scope">
                <el-input
                  :disabled="inputType.DiscountType === SettingParameterEditType.Unable"
                  maxlength="10"
                  v-model="scope.row['Discount']"
                  @keyup.native="scope.row['Discount']= toFixed(scope.row['Discount'], 2)"
                  @keydown="updateQty1(scope.row)"
                  @blur="updateQty1(scope.row)"
                  name="row['Discount']"
                >
                  <el-button slot="append" name="btn-percent">%</el-button>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column prop="RetailPrice" min-width="120" show-overflow-tooltip>
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
              <template slot-scope="scope">
                <el-input
                  :disabled="inputType.SalePriceType === SettingParameterEditType.Unable"
                  maxlength="10"
                  v-model="scope.row['RetailPrice']"
                  @keyup.native="scope.row['RetailPrice']= toFixed(scope.row['RetailPrice'], 2)"
                  @keydown="updateQty2(scope.row)"
                  @blur="updateQty2(scope.row)"
                  name="row['RetailPrice']"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="WorkPrice" label="工费(元/件)" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.RetailType === RetailType.FeeOfGram">
                  <!--  /克  -->
                  <el-input
                    style="width: 100%;"
                    :disabled="inputType.GoldWeightType === SettingParameterEditType.Unable"
                    maxlength="10"
                    v-model="scope.row['WorkPrice']"
                    @keydown="updateQty3(scope.row)"
                    @blur="updateQty3(scope.row)"
                    @keyup.native="scope.row['WorkPrice']= toFixed(scope.row['WorkPrice'], 2)"
                    name="row['WorkPrice']"
                  ></el-input>
                </span>
                <span v-else-if="scope.row.RetailType === RetailType.FeeOfPiece">
                  <!--  /件  -->
                  <el-input
                    style="width: 100%;"
                    :disabled="inputType.GoldWeightType === SettingParameterEditType.Unable"
                    maxlength="10"
                    v-model="scope.row['WorkPrice']"
                    @keydown="updateQty3(scope.row)"
                    @blur="updateQty3(scope.row)"
                    @keyup.native="scope.row['WorkPrice']= toFixed(scope.row['WorkPrice'], 2)"
                    name="row['WorkPrice']"
                  ></el-input>
                </span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="ProductPrice" min-width="100" show-overflow-tooltip>
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
              <template slot-scope="scope">￥{{scope.row.ProductPrice}}</template>
            </el-table-column>
            <el-table-column label="操作" min-width="60" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="removeOrderItem(scope.$index)" name="btn-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="checkPage-hd" v-if="junkData.length">
          <span class="title">旧货列表</span>
        </div>
        <div class="panel-bd p-x-10 m-b-10">
          <el-table v-if="junkData.length" :data="junkData" :show-summary="true" :summary-method="getSummaries2" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
            <el-table-column prop="SourceType" label="类型" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.IsGold === YNStatus.Yes ?'素金':'非素'}}</template>
            </el-table-column>
            <el-table-column prop="JunkName" label="旧货名称" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="IsOurStore" label="是否本店售出" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.IsOurStore === YNStatus.Yes ?'是':'否'}}</template>
            </el-table-column>
            <el-table-column prop="StoreBarCode" label="原条码" min-width="90" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoldWeight" label="金重(g)" show-summary min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="RecallGoldPrice" label="回收金价" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.RecallGoldPrice !== undefined ? '￥'+ scope.row.RecallGoldPrice : '-'}}</template>
            </el-table-column>
            <el-table-column prop="RecallPrice" label="回收金额" show-summary min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">￥{{scope.row.RecallPrice}}</template>
            </el-table-column>
            <el-table-column prop="RecallFee" label="回收工费" show-summary min-width="120">
              <template slot-scope="scope">￥{{scope.row.RecallFee}}</template>
            </el-table-column>
            <el-table-column prop="Note" label="备注" min-width="90" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" min-width="140">
              <template slot-scope="scope">
                <div>
                  <el-button type="text" @click="editJunkItem(scope)" name="btn-change">修改</el-button>
                  <el-button type="text" @click="removeJunkItem(scope.$index)" name="btn-delete">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="panel-bd">
          <div class="retailForm retailForm2" style="border-top:1px solid #ededed;">
            <el-form ref="priceForm" :model="queryItems.Payments" :rules="rules2" label-width="110px">
              <el-row :gutter="10" style="border-bottom:none;">
                <el-col :span="12" class="form-item-font14">
                  <el-form-item label=" 实付金额：">
                    <span style="font-size:16px; font-weight:bold; color:#ffa200;">￥{{queryItems.AwaitPrice}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-col :span="12">
                    <el-form-item label="支付方式1：" prop="PaymentType1">
                      <el-select v-model="queryItems.Payments.PaymentType1" placeholder="请选择" name="PaymentType1">
                        <el-option label="请选择" :value="0"></el-option>
                        <el-option v-for="(item, index) in  $store.getters.paymentType.TypeArray" :key="index" :label="item.Value" :value="item.Id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="金额：" prop="PayPrice1">
                      <el-input
                        :maxlength="10"
                        v-model="queryItems.Payments.PayPrice1"
                        @keyup.native="queryItems.Payments.PayPrice1 = toFixed2(queryItems.Payments.PayPrice1, 2)"
                        @blur="sumPrice1(queryItems.Payments.PayPrice1)"
                        name="PayPrice1"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-col :span="12">
                    <el-form-item label=" 货品金额：">
                      <span>￥{{queryItems.ProductPrice}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="旧货抵扣：">
                      <span>￥{{queryItems.RecallPrice}}</span>
                    </el-form-item>
                  </el-col>
                </el-col>
                <el-col :span="12">
                  <el-col :span="12">
                    <el-form-item label="支付方式2：">
                      <el-select v-model="queryItems.Payments.PaymentType2" placeholder="请选择" name="PaymentType2">
                        <el-option label="请选择" :value="0"></el-option>
                        <el-option v-for="(item, index) in  $store.getters.paymentType.TypeArray" :key="index" :label="item.Value" :value="item.Id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="金额：">
                      <el-input
                        :maxlength="10"
                        v-model="queryItems.Payments.PayPrice2"
                        @keyup.native="queryItems.Payments.PayPrice2 = toFixed2(queryItems.Payments.PayPrice2, 2)"
                        @blur="sumPrice2(queryItems.Payments.PayPrice2)"
                        name="PayPrice2"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-button type="primary" :loading="$store.getters.is_loading" @click="toSave()" name="btn-save">保存</el-button>
      <el-button @click="$router.go(-1)" name="btn-back">返回</el-button>
    </div>
    <!--  @module 会员选择  -->
    <MenberSelect :visible.sync="vipDialog" @getVipInfo="getVipInfo"></MenberSelect>
    <!--  end 会员选择  -->
    <!--  选择货品  -->
    <select-goods :visible.sync="dialogSelectGoodsVisible" :barCode="searchGoodsCode" :goodsData="someGoodsData" @listenAddGoods="listenAddGoods"></select-goods>
    <!--  End 选择货品  -->
    <!--  dialog 货品详情  -->
    <good-detail :visible.sync="goodDetailDialog.visible" :goodsId="goodDetailDialog.goodsId"></good-detail>
    <!--  end 货品详情 -->
    <!--  @module 创建编辑旧货  -->
    <goldCreate :visible.sync="createDialog" :isGold="isGold" :junkData="selectJunkData" @closeDialog="createVisible" :inputType="inputType"></goldCreate>
    <!--  end 创建编辑旧货  -->
  </div>
</template>
<script>
import { YNStatus } from '@/enums/common.js'
import {
  SecurityUserCashierType,
  SettingParameterIgnoreUnit,
  SettingParameterIgnoreType,
  SecurityUserState,
  SettingParameterEditType
} from '@/enums/merchant.js'
import { RetailType, StockCompareType, GiftType } from '@/enums/stocking.js'
import { RetailOrderMasterPayState, RetailOrderSellProductSourceType, RetailOrderSellBasicSellType } from '@/enums/order.js'
import {
  MERCHANT_API_SETTING_PARAMETER_GET,
  MERCHANT_API_SETTING_GPRICE_GET,
} from '@/apis/merchant.js'
import { STOCKING_API_GOODS_STOCK_DESK_QRIES } from '@/apis/stocking.js'
import { MEMBERSHIP_API_MEMBER_GETS } from '@/apis/membership.js'
import { ORDER_API_RETAIL_ORDER_MASTER_CREATEBYSELF } from '@/apis/order.js'

import SelectGoods from './selectGoods'
import pagination from '@/components/pagination'
import goldCreate from './goldCreate.vue'
import MenberSelect from '@/components/erp/menberSelect.vue'
import goodDetail from '@/components/erp/goodDetail'

export default {
  data() {
    return {
      YNStatus,
      SecurityUserCashierType,
      SettingParameterIgnoreUnit,
      SettingParameterIgnoreType,
      SecurityUserState,
      StockCompareType,
      RetailType,
      SettingParameterEditType,
      GiftType,
      RetailOrderMasterPayState,
      orderData: [],
      junkData: [],
      queryItems: {

        // MasterId: '',
        // MemberId: '',

        MemberId: '',
        TrueName: '',
        ProductPrice: 0,
        CashPrice: '',
        CouponPrice: '',
        RecallPrice: 0,
        AwaitPrice: 0,
        PayPrice: 0,
        RemainPrice: '',
        PayState: '',
        CashierUserId: '',
        CashierUser: this.$store.getters.user_session.TrueName,
        MainUserId: '',
        MainUser: '',
        AssistUserId: '',
        AssistUser: '',
        Payments: {
          PayPrice1: '',
          PaymentType1: '',
          PayPrice2: '',
          PaymentType2: ''
        },
        // Payments: [],
        Orders: [],
        Junks: [],
      },
      searchGoodsCode: '',
      rules: {
        CashierUserId: [
          {
            type: 'number',
            required: true,
            validator: (rule, value, callback) => {
              if (value === 0 || !value) {
                this.$message.error('请选择收银员')
                callback(new Error())
              }
              callback()
            },
            trigger: 'change'
          }
        ],
        MainUserId: [
          {
            type: 'number',
            required: true,
            validator: (rule, value, callback) => {
              if (value === 0 || !value) {
                this.$message.error('请选择导购员')
                callback(new Error())
              }
              callback()
            },
            trigger: 'change'
          }
        ],
        MemberId: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value) {
                this.$message.error('请输入会员')
                callback(new Error())
              }
              callback()
            }
          }
        ]
      },
      rules2: {
        PaymentType1: [
          {
            type: 'number',
            required: true,
            validator: (rule, value, callback) => {
              if (value === 0 || !value) {
                this.$message.error('请选择支付方式')
                callback(new Error())
              }
              callback()
            },
            trigger: 'change'
          }
        ],
        PayPrice1: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value === '') {
                this.$message.error('请输入金额')
                callback(new Error())
              } else if (!/^(-)?(\d+|\d+.\d+)$/.test(value) && value !== '0') {
                this.$message.error('必须为数字')
                callback(new Error())
              }
              callback()
            }
          }
        ]
      },
      users: {
      }, // 收银员
      checkParams: {
      },
      vipDialog: false,
      vipInfo: {
      },
      selectGoodsId: '',
      checkJunkDialog: false,
      createDialog: false,
      createDialog2: false,
      selectJunkData: {}, // 编辑junk
      selectJunkIndex: '', // 编辑junk的Index
      editDialog: false,
      editDialog2: false,
      dialogSelectGoodsVisible: false,
      goodDetailDialog: {
      },
      inputType: {
      }, // 输入框权限
      dialogSelectGoodsVisible2: false,
      goodDetailDialog2: {
      },
      someGoodsData: {},
      tofixedNumber: 2, // 小数点后几位
      fixedNumber: 100, // 小数点后几位 跟随的 多少倍数 1 10 100
      upOrDown: () => { }, // 四舍五入
      cashierList: [], // 收银员List
      employeeList: [], // 导购员list
      isGold: 0, // 是否素金
    }
  },
  methods: {
    init() {
      this.getUserList()
      this.getInputType()
    },
    getInputType() {
      MERCHANT_API_SETTING_PARAMETER_GET({ CharacterId: this.$store.getters.user_session.CharacterId }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.inputType = res.data.Data
          this.tofixedNumber =
            res.data.Data.IgnoreUnit ===
              SettingParameterIgnoreUnit.Unit1
              ? 0
              : res.data.Data.IgnoreUnit ===
                SettingParameterIgnoreUnit.Unit3
                ? 1
                : 2
          this.fixedNumber =
            res.data.Data.IgnoreUnit ===
              SettingParameterIgnoreUnit.Unit1
              ? 1
              : res.data.Data.IgnoreUnit ===
                SettingParameterIgnoreUnit.Unit3
                ? 10
                : 100
          if (
            res.data.Data.IgnoreType ===
            this.SettingParameterIgnoreType.Type1
          ) {
            // 只舍不入
            this.upOrDown = function (n) {
              let num = n * this.fixedNumber
              return Math.floor(num) / this.fixedNumber
            }
          } else if (
            res.data.Data.IgnoreType ===
            this.SettingParameterIgnoreType.Type3
          ) {
            // 只入不舍
            this.upOrDown = function (n) {
              let num = n * this.fixedNumber
              return Math.ceil(num) / this.fixedNumber
            }
          } else {
            // 四舍五入
            this.upOrDown = function (n) {
              let num = n * this.fixedNumber
              return Math.round(num) / this.fixedNumber
            }
          }
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    toSave() {
      if (this.orderData.length + this.junkData.length > 20) {
        this.$message.error('添加的商品与旧货总和不能超过20条')
        return false
      } else if (!this.orderData.length && !this.junkData.length) {
        this.$message.error('请添加商品')
        return false
      }
      this.$refs['retailForm'].validate(valid => {
        if (!valid) {
          return false
        }
        this.$refs['priceForm'].validate(valid => {
          if (!valid) {
            return false
          }
          if (this.queryItems.MainUserId === this.queryItems.AssistUserId) {
            this.$message.error('主销售与副销售不能为同一人')
            return false
          }
          if (
            this.queryItems.Payments.PaymentType2 ===
            this.queryItems.Payments.PaymentType1
          ) {
            this.$message.error('支付方式不能相同')
            return false
          }
          if (
            this.queryItems.Payments.PaymentType2 ||
            this.queryItems.Payments.PayPrice2
          ) {
            if (!this.queryItems.Payments.PaymentType2) {
              this.$message.error('请选择第二种支付方式')
              return false
            } else if (
              !this.queryItems.Payments.PayPrice2 &&
              this.queryItems.Payments.PaymentType2
            ) {
              this.$message.error('请输入第二种支付金额')
              return false
            }
          }
          if (String(this.queryItems.AwaitPrice).length > 10) {
            this.$message.error('实付金额最多不能超过10位!')
            return false
          }
          if (this.queryItems.PayPrice !== this.queryItems.AwaitPrice) {
            this.$message.error('支付金额相加必须等于实付金额。')
            return false
          }
          let errGoodsName = ''
          let isError = this.orderData.some(item => {
            errGoodsName = item.GoodsName
            return item.GiftType !== GiftType.Gift && Number(item.RetailPrice) === 0
          })
          if (isError) {
            this.$message.error(errGoodsName + '的销售价不能为0')
            return false
          }
          let orderItems = this.orderData.map(item => {
            let newItem = { ...item }
            newItem.CostPrice = this.$root.toInt(newItem.CostPrice)
            newItem.Weight = this.$root.toInt(newItem.Weight)
            newItem.StoneWeight1 = this.$root.toInt(newItem.StoneWeight1)
            newItem.RetailPrice = this.$root.toInt(newItem.RetailPrice)
            newItem.GoldWeight = this.$root.toInt(newItem.GoldWeight)
            newItem.GoldPrice = this.$root.toInt(newItem.GoldPrice)
            newItem.WorkPrice = this.$root.toInt(newItem.WorkPrice)
            newItem.LabelPrice = this.$root.toInt(newItem.LabelPrice)
            newItem.Discount = this.$root.toInt(newItem.Discount) / 100
            newItem.ProductPrice = newItem.RetailPrice
            return newItem
          })
          let junkItems = this.junkData.map(item => {
            let newItem = { ...item }
            newItem.GoldWeight = this.$root.toInt(newItem.GoldWeight)
            newItem.StoneWeight = this.$root.toInt(newItem.StoneWeight)
            newItem.Weight = this.$root.toInt(newItem.Weight)
            newItem.RecallGoldPrice = this.$root.toInt(newItem.RecallGoldPrice)
            newItem.RecallPrice = this.$root.toInt(newItem.RecallPrice)
            newItem.RecallFee = this.$root.toInt(newItem.RecallFee)
            return newItem
          })
          this.$store.commit('SET_BTN_LOADING', true) // btn loading
          let params = {
            MemberId: this.queryItems.MemberId,
            TrueName: this.queryItems.MemberName,
            ProductPrice: this.$root.toInt(this.queryItems.ProductPrice), // 商品总金额
            CashPrice: this.$root.toInt(this.queryItems.PayPrice), // 实付金额
            RecallPrice: this.$root.toInt(this.queryItems.RecallPrice), // 旧货总金额
            AwaitPrice: this.$root.toInt(this.queryItems.AwaitPrice), // 总额 - 旧货
            PayPrice: this.$root.toInt(this.queryItems.PayPrice), // 已付总额
            RemainPrice:
              this.$root.toInt(this.queryItems.AwaitPrice - this.queryItems.RemainPrice), // 未付金额
            PayState: RetailOrderMasterPayState.AllOf,
            CashierUserId: this.queryItems.CashierUserId,
            CashierUser: this.getCashierUser(this.queryItems.CashierUserId),
            MainUserId: this.queryItems.MainUserId,
            MainUser: this.getChargeUser(this.queryItems.MainUserId),
            AssistUserId: this.queryItems.AssistUserId || 0,
            AssistUser: this.getChargeUser(this.queryItems.AssistUserId),
            Note: this.queryItems.Note,
            Orders: orderItems,
            Junks: junkItems,
            Payments: [
              {
                PaymentType: this.queryItems.Payments.PaymentType1,
                CategoryName: this.getPayName(
                  this.queryItems.Payments.PaymentType1
                ),
                // PaymentType: this.getPaymentType(
                //   this.queryItems.Payments.PaymentType1
                // ),
                PayPrice: this.$root.toInt(this.queryItems.Payments.PayPrice1)
              }
            ]
          }
          if (
            this.queryItems.Payments.PaymentType2 &&
            this.queryItems.Payments.PayPrice2
          ) {
            params.Payments.push({
              PaymentType: this.queryItems.Payments.PaymentType2,
              CategoryName: this.getPayName(
                this.queryItems.Payments.PaymentType2
              ),
              // PaymentType: this.getPaymentType(
              //   this.queryItems.Payments.PaymentType2
              // ),
              PayPrice: this.$root.toInt(this.queryItems.Payments.PayPrice2)
            })
          }
          ORDER_API_RETAIL_ORDER_MASTER_CREATEBYSELF(params).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.$router.replace('/sales/retail/index')
            } else {
              this.$message.error(res.data.Message)
            }
            this.$store.commit('SET_BTN_LOADING', false) // btn loading
          })
        })
      })
    },
    removeOrderItem(index) {
      let newArr = []
      newArr = newArr.concat(
        this.orderData.slice(0, index),
        this.orderData.slice(index + 1, this.orderData.length)
      )
      this.orderData = newArr
      if (this.orderData.length === 0) {
        this.queryItems.ProductPrice = 0
        this.queryItems.AwaitPrice =
          this.upOrDown(
            this.queryItems.ProductPrice - this.queryItems.RecallPrice
          ).toFixed(this.tofixedNumber) - 0
      }
    },
    editJunkItem(scope) {

      this.selectJunkData = { ...scope.row }
      this.createDialog = true
      this.isGold = scope.row.IsGold
      this.selectJunkIndex = scope.$index
    },
    removeJunkItem(index) {
      let newArr = []
      newArr = newArr.concat(
        this.junkData.slice(0, index),
        this.junkData.slice(index + 1, this.junkData.length)
      )
      this.junkData = newArr
      if (this.junkData.length === 0) {
        this.queryItems.RecallPrice = 0
        this.queryItems.AwaitPrice =
          this.upOrDown(
            this.queryItems.ProductPrice - this.queryItems.RecallPrice
          ).toFixed(this.tofixedNumber) - 0
      }
    },
    createSuGold(state) {
      // 新建按钮
      this.createDialog = true
      this.isGold = state
      this.selectJunkData = {}
    },
    createVisible(data) {
      // 新建素金关闭
      if (this.orderData.length + this.junkData.length >= 20) {
        this.$message.error('添加的商品与旧货总和不能超过20条')
        return false
      }
      if (JSON.stringify(this.selectJunkData) === '{}') {
        this.junkData.push(data)
      } else {
        this.$set(this.junkData, this.selectJunkIndex, data)
      }

    },
    listenAddGoods(data) {
      if (data.length > 20) {
        this.$message.error('一次性添加的商品不能超过20条')
        return false
      }
      if (data.length + this.junkData.length + this.orderData.length > 20) {
        this.$message.error('添加的商品与旧货总和不能超过20条')
        return false
      }
      data.forEach(item => {
        this.getGoodsData(item)
      })
    },
    getUserList() {
      this.$store.dispatch('GET_USERS_DROPLIST', {
        UserState: SecurityUserState.Audit,
        CashierType: 0
      }).then(data => {
        if (data&&data.length) {
          this.cashierList = data
          this.cashierList.length && this.cashierList.forEach(item => {
            // 需求：当前用户没有收银权限则默认不显示收银员
            if (
              item.UserId === this.$store.getters.user_session.UserId &&
              item.UserState === this.SecurityUserState.Audit
            ) {
              this.queryItems.CashierUserId = this.$store.getters.user_session.UserId
            }
          })
        }
      })
      this.$store.dispatch('GET_USERS_DROPLIST', {
        UserState: SecurityUserState.Audit,
        CashierType: SecurityUserCashierType.Employee
      }).then(data => {
        if (data&&data.length) {
          this.employeeList = data
        }
      })
    },
    searchVip() {
      // 搜索vip
      if (!this.queryItems.MemberId) {
        this.vipInfo = {
        }
        return false
      }
      let vipParams = {
        PageIndex: '1',
        PageSize: '10',
        Mobile: '',
        AliasName: '',
        MemberId: this.queryItems.MemberId,
        SexyType: '',
        TrueName: '',
        CreateTime1: '1900-01-01',
        CreateTime2: '1900-01-01',
        Birthday1: '1900-01-01',
        Birthday2: ' 1900-01-01'
      }
      MEMBERSHIP_API_MEMBER_GETS(vipParams).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (!res.data.Data.total) {
            this.$message.error('该会员不存在!')
            this.queryItems.TrueName = ''
            // this.queryItems.Mobile = ''
            this.queryItems.MemberId = ''
            this.vipInfo = {

            }
            this.$refs['retailForm'].clearValidate()
          } else {
            this.queryItems.TrueName = res.data.Data.rows[0].trueName
            // this.queryItems.Mobile = res.data.Data.rows[0].mobile
            this.queryItems.MemberId = res.data.Data.rows[0].memberId
            this.vipInfo = {
              ImageUrl: res.data.Data.rows[0].imageUrl,
              AliasName: res.data.Data.rows[0].aliasName,
              TrueName: res.data.Data.rows[0].trueName,
              Mobile: res.data.Data.rows[0].mobile,
              MemberId: res.data.Data.rows[0].memberId,
            }
          }
        } else {
          this.queryItems.MemberName = ''
          this.queryItems.Mobile = ''
          this.queryItems.MemberId = ''
          this.queryItems.MemberId = ''
          this.vipInfo = {
          }
          this.$message.error(res.Message)
          this.$refs['retailForm'].clearValidate()
        }
      })
    },
    getVipInfo(data) {
      // 获取vip信息
      // this.queryItems.Mobile = data.Mobile
      this.queryItems.TrueName = data.trueName
      this.queryItems.MemberId = data.memberId
      this.vipInfo = {
        ImageUrl: data.imageUrl,
        AliasName: data.aliasName,
        TrueName: data.trueName,
        Mobile: data.mobile,
        MemberId: data.memberId,
      }
      this.$refs['retailForm'].clearValidate()
      this.vipDialog = false
    },
    updateQty1(row) {
      // 折扣联动
      row.Discount = row.Discount === Infinity ? 0 : row.Discount || 0
      let RetailPrice =
        row.RetailPrice / row.LabelPrice === Infinity
          ? 0
          : Number(((row.Discount * row.LabelPrice) / 100).toFixed(2)) || 0
      row.RetailPrice = Number(RetailPrice.toFixed(2))
      this.updateQty3(row)
    },
    updateQty2(row) {
      // 销售价
      row.RetailPrice = row.RetailPrice === Infinity ? 0 : row.RetailPrice || 0
      let Discount =
        row.RetailPrice / row.LabelPrice === Infinity
          ? 0
          : Number(((row.RetailPrice / row.LabelPrice) * 100).toFixed(2)) || 0
      row.Discount = Number(Discount.toFixed(2))
      this.updateQty3(row)
    },
    updateQty3(row) {
      // 工费 改变应付金额
      row.GoldWeight = row.GoldWeight
      row.WorkPrice = row.WorkPrice || 0
      if (row.RetailType < RetailType.FeeOfGram) {
        row.ProductPrice = Number(row.RetailPrice).toFixed(2) - 0
      } else if (row.RetailType >= RetailType.FeeOfGram) {
        row.ProductPrice =
          (Number(row.WorkPrice) + Number(row.RetailPrice)).toFixed(2) - 0
      }
    },
    updateQty4(row) {
      // 金重 改变折扣 应付 销售价 工费
      row.GoldWeight = row.GoldWeight || 0
      row.WorkPrice = row.WorkPrice
      if (row.RetailType < RetailType.FeeOfGram) {
        row.ProductPrice = Number(row.RetailPrice).toFixed(this.tofixedNumber) - 0
      } else if (row.RetailType === RetailType.FeeOfGram) {
        row.WorkPrice = Number((row.GongPrice * row.GoldWeight).toFixed(2))
        row.RetailPrice = Number((row.GoldWeight * row.GoldPrice).toFixed(2))
        row.Discount = row.LabelPrice ? (row.RetailPrice * 1 / (row.LabelPrice * 1)).toFixed(2) * 1 : 0
        row.ProductPrice = (Number(row.WorkPrice) + Number(row.RetailPrice)).toFixed(2) - 0
      } else if (row.RetailType === RetailType.FeeOfPiece) {
        row.WorkPrice = Number(Number(row.GongPrice).toFixed(2))
        row.RetailPrice = Number(
          (Number(row.GoldWeight) * Number(row.GoldPrice)).toFixed(2)
        )
        row.Discount = row.LabelPrice ? Number(((row.RetailPrice / row.LabelPrice) * 100).toFixed(2)) : 0
        row.ProductPrice =
          (Number(row.WorkPrice) + Number(row.RetailPrice)).toFixed(2) - 0
      }
    },
    updateQty5(row) {
      // 金价  改变折扣 销售价 应付
      row.GoldPrice = row.GoldPrice || 0
      row.GoldWeight = row.GoldWeight
      row.WorkPrice = row.WorkPrice
      if (row.RetailType < RetailType.FeeOfGram) {
        row.ProductPrice =
          Number(row.RetailPrice).toFixed(this.tofixedNumber) - 0
      } else if (row.RetailType === RetailType.FeeOfGram) {
        row.RetailPrice = Number(
          (Number(row.GoldWeight) * Number(row.GoldPrice)).toFixed(2)
        )
        row.Discount = row.LabelPrice ? Number(((row.RetailPrice / row.LabelPrice) * 100).toFixed(2)) : 0
        row.ProductPrice = (Number(row.WorkPrice) + Number(row.RetailPrice)).toFixed(2) - 0
      } else if (row.RetailType === RetailType.FeeOfPiece) {
        row.RetailPrice = Number((Number(row.GoldWeight) * Number(row.GoldPrice)).toFixed(2))
        row.Discount = row.LabelPrice ? Number(((row.RetailPrice / row.LabelPrice) * 100).toFixed(2)) : 0
        row.ProductPrice =
          (Number(row.WorkPrice) + Number(row.RetailPrice)).toFixed(2) - 0
      }
    },
    searchGoldCode() {
      // 搜索货品源码
      this.$store.commit('SET_TB_LOADING', true) // table loading

      STOCKING_API_GOODS_STOCK_DESK_QRIES({
        MaterialType: 0,
        CategoryType: 0,
        FinanceType: 0,
        GoldType: 0,
        GoodsType: 0,
        BarCode: this.searchGoodsCode,
        StockCompareType: StockCompareType.AvailableQtyThanZero,
        IsAsced: 1,
        OrderBy: 2,
        PageIndex: 1,
        PageSize: 10
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (!res.data.Data.Count) {
            this.$message.error(
              `条码[${this.searchGoodsCode}]库存为0或不存在!`
            )
          } else if (res.data.Data.Rows.length > 1) {
            this.someGoodsData = res.data.Data
            this.dialogSelectGoodsVisible = true
          } else if (res.data.Data.Rows.length === 1) {
            this.getGoodsData(res.data.Data.Rows[0])
          }
        }
        this.searchGoodsCode = ''
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    getGoodsData(searchData) {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      if (searchData.GoldType) {
        MERCHANT_API_SETTING_GPRICE_GET({
          // 获取金价
          GoldType: searchData.GoldType
        }).then(value => {
          if (value.data.Code === 'CORRECT') {
            searchData.GoldPrice = value.data.Data.Gprice || 0
          }
          this.pushItem(searchData)
        })
      } else {
        searchData.GoldPrice = 0
        this.pushItem(searchData)
      }
      this.$store.commit('SET_TB_LOADING', false) // table loading
    },
    // 设置货品详情
    pushItem(searchData) {
      let itemData = {
      }

      itemData = {
        SellType: RetailOrderSellBasicSellType.RetailOrder,
        OldImageUrl: searchData.ImageUrl,
        GiftType: searchData.GiftType,
        ClassifyId: searchData.GroupTypeDk,
        DeskId: searchData.DeskId,
        DeskName: searchData.DeskId ? searchData.DeskName : '仓库',
        SourceType: RetailOrderSellProductSourceType.Stocking,
        CertSeriesID: searchData.Stone1CertNumber,
        SpecTitlestring: searchData.Stone1Spec,
        GoodsId: searchData.GoodsId,
        GoodsName: searchData.GoodsName,
        StoreBarCode: searchData.BarCode,
        StoreStyleNumber: searchData.StyleCode,
        ImageUrl: searchData.ImageUrl,
        FinanceType: searchData.FinanceType,
        GoodsType: searchData.GoodsType,
        RetailType: searchData.RetailType,
        CategoryType: searchData.CategoryType,
        PartnerId: searchData.PartnerId,
        PartnerType: searchData.PartnerType,
        PartnerCode: searchData.PartnerCode,
        PartnerName: searchData.PartnerName,
        SeriesTypeEk: searchData.SeriesTypeEk,
        SeriesTypeEv: searchData.SeriesTypeEv,
        StoneClassTypeEk: searchData.StoneClassTypeEk,
        StoneClassTypeEv: searchData.StoneClassTypeEv,
        LargeClassTypeEk: searchData.LargeClassTypeEk,
        LargeClassTypeEv: searchData.LargeClassTypeEv,
        SmallClassTypeEk: searchData.SmallClassTypeEk,
        SmallClassTypeEv: searchData.SmallClassTypeEv,
        FinanceClassTypeEk: searchData.FinanceClassTypeEk,
        FinanceClassTypeEv: searchData.FinanceClassTypeEv,
        CostPrice: this.$root.toFloat(searchData.CostPrice),
        Weight: this.$root.toFloat(searchData.Weight, 3),
        StoneWeight1: this.$root.toFloat(searchData.Stone1Weight, 3),
        StoneColor1: searchData.Stone1Color,
        StoneClarity1: searchData.Stone1Clarity,
        StoneCut1: searchData.Stone1Cut,
        RetailPrice: searchData.RetailType < RetailType.FeeOfGram
          ? this.$root.toFloat(searchData.RetailPrice)
          : Number((this.$root.toFloat(searchData.GoldWeight, 3) * this.$root.toFloat(searchData.GoldPrice)).toFixed(2)),
        MaterialType: searchData.MaterialType,
        GoldType: searchData.GoldType,
        GoldWeight: this.$root.toFloat(searchData.GoldWeight, 3),
        GoldPrice: this.$root.toFloat(searchData.GoldPrice),
        WorkPrice: 0,
        LabelPrice: this.$root.toFloat(searchData.LabelPrice),
        // DiscPrice: searchData.DiscPrice,
        // Discount: searchData.RetailPrice / searchData.LabelPrice !== Infinity &&
        //   !isNaN(searchData.RetailPrice / searchData.LabelPrice)
        //   ? Number(
        //     (
        //       (searchData.RetailPrice / searchData.LabelPrice) *
        //       100
        //     ).toFixed(2)
        //   )
        //   : 0,
        Discount: 0, 
        ProductPrice: 0,
        GongPrice:
          searchData.RetailType < RetailType.FeeOfGram
            ? 0
            : this.$root.toFloat(searchData.RetailPrice), // 联动工费所需参数
      }
      itemData.Discount = parseFloat(itemData.LabelPrice) ?  (itemData.RetailPrice / itemData.LabelPrice * 100).toFixed(2) : 0
      // 零售方式 == 计件 || 计价（工费按克）
      if (itemData.RetailType < RetailType.FeeOfGram) {
        itemData.ProductPrice = itemData.RetailPrice
        itemData.WorkPrice = 0
      } else if (itemData.RetailType === RetailType.FeeOfGram) { // 计价(工费按克)
        itemData.WorkPrice = (itemData.GongPrice * itemData.GoldWeight).toFixed(2) - 0
      } else if (itemData.RetailType === RetailType.FeeOfPiece) { // 计价(工费按件)
        itemData.WorkPrice = this.$root.toFloat(searchData.RetailPrice)
      }
      if (itemData.RetailType > RetailType.PieceOf) { 
        itemData.ProductPrice = Number(
          (itemData.WorkPrice * 1 + itemData.RetailPrice * 1).toFixed(2)
        )
      }
      this.orderData.push(itemData)
    },
    showDetailDialog(row) {
      this.goodDetailDialog = {
        goodsId: row.GoodsId,
        visible: true
      }
    },
    sumPrice1() {
      // 统计支付方式金额
      this.queryItems.Payments.PayPrice1 =
        this.queryItems.Payments.PayPrice1 - 0 || 0
      this.queryItems.PayPrice = Number(
        (
          Number(this.queryItems.Payments.PayPrice2) +
          Number(this.queryItems.Payments.PayPrice1)
        ).toFixed(2)
      )
    },
    sumPrice2() {
      // 统计支付方式金额
      this.queryItems.Payments.PayPrice2 =
        this.queryItems.Payments.PayPrice2 - 0 || 0
      this.queryItems.PayPrice = Number(
        (
          Number(this.queryItems.Payments.PayPrice2) +
          Number(this.queryItems.Payments.PayPrice1)
        ).toFixed(2)
      )
    },
    getCashierUser(id) {
      let name = ''
      this.cashierList.forEach(item => {
        if (id === item.UserId) {
          name = item.TrueName
        }
      })
      return name
    },
    getChargeUser(id) {
      let name = ''
      this.employeeList.forEach(item => {
        if (id === item.UserId) {
          name = item.TrueName
        }
      })
      return name
    },
    getPayName(type) {
      let name = ''
      this.$store.getters.paymentType.TypeArray.forEach(item => {
        if (type === item.Id) {
          name = item.Value
        }
      })
      return name
    },
    getPaymentType(type) {
      let id = ''
      this.$store.getters.paymentType.TypeArray.forEach(item => {
        if (type === item.CategoryId) {
          id = item.KeyId
        }
      })
      return id
    },
    getSummaries(param) {
      // 零售单合计
      const {
        columns, data
      } = param
      const sums = []
      columns.forEach((value, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[value.property]))
        if (!values.every(value => isNaN(value))) {
          // 非工费合计
          if (index === 6 || (index > 7 && index < 11)) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                let num = Number(prev) + Number(curr)
                return parseFloat(num).toFixed(2)
              } else {
                return prev
              }
            }, 0)
            if (index === 10) {
              let num = Number(sums[index])
              this.queryItems.ProductPrice = num.toFixed(2) - 0
              this.getAwaitPrice()
            }
            sums[index]
          }
        } else {
          return false
        }
      })
      return sums
    },
    getSummaries2(param) {
      // 旧货合计
      const {
        columns, data
      } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          if (index === 4 || index === 6 || index === 7) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                let num = Number(prev) + Number(curr)
                return index === 4
                  ? parseFloat(num).toFixed(3)
                  : parseFloat(num).toFixed(2)
              } else {
                return prev
              }
            }, 0)
            sums[index]
            if (index === 6) {
              this.getRecallPrice()
            }
          }
        } else {
          return false
        }
      })
      return sums
    },
    getRecallPrice(fn) {
      if (!this.junkData.length) {
        return false
      }
      let allPrice = 0
      this.junkData.forEach(item => {
        allPrice +=
          (Number(item.RecallPrice) - Number(item.RecallFee)).toFixed(2) - 0
      })
      this.queryItems.RecallPrice = allPrice.toFixed(this.tofixedNumber)
      this.queryItems.AwaitPrice =
        this.upOrDown(this.queryItems.ProductPrice - allPrice).toFixed(
          this.tofixedNumber
        ) - 0
      fn && fn()
    },
    getAwaitPrice() {
      if (!this.orderData.length) {
        return false
      }
      let allPrice = 0
      this.orderData.forEach(item => {
        let price1 = Number(item.RetailPrice) || 0
        let price2 = Number(item.WorkPrice) || 0
        allPrice +=
          this.upOrDown(price1 + price2).toFixed(this.tofixedNumber) - 0
      })
      this.queryItems.AwaitPrice =
        this.upOrDown(allPrice - this.queryItems.RecallPrice).toFixed(
          this.tofixedNumber
        ) - 0
    },
    toFixed2(value, fixed) {
      if (/^00/.test(value) || value === '0.00') {
        return 0
      }
      if (value) {
        return value
          .replace(/[^(\-)?\d.]*/g, '')
          .replace(
            new RegExp('([0-9]+.[0-9]{' + fixed + '})[0-9]*', 'gim'),
            '$1'
          )
      }
    },
    toFixed(value, fixed) {
      if (/^00/.test(value) || value === '0.00') {
        return 0
      }
      if (value) {
        return (
          value
            .replace(/[^\d.]*/g, '')
            .replace(
              new RegExp('([0-9]+.[0-9]{' + fixed + '})[0-9]*', 'gim'),
              '$1'
            ) || 0
        )
      }
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
      this.$store.dispatch('GET_PAYMENT_TYPE', YNStatus.Yes)
      this.$store.dispatch('GET_SERIES_TYPE')
    }
  },
  beforeMount() {
    this.getStoreAllType()
  },
  mounted() {
    this.init()
    this.$nextTick(() => {
      this.queryItems.CashierUser = this.$store.getters.user_session.TrueName
    })
  },
  watch: {
  },
  components: {
    MenberSelect,
    SelectGoods,
    pagination,
    goldCreate,
    goodDetail
  }
}
</script>
<style lang="scss" scoped="true">
.retailForm {
  font-size: 12px;
  border-top: solid 1px $border-color;
  border-left: solid 1px $border-color;

  .el-row {
    min-height: 29px;
    height: 29px;
    background-color: #f5f5f5;
    padding: 0;
    margin: 0 !important;
    border-right: solid 1px $border-color;
    border-bottom: solid 1px $border-color;
    .el-col {
      height: 100%;
      padding: 0 !important;
      border-right: solid 1px $border-color;
    }
  }
  .el-form-item {
    margin-bottom: 0;
    .el-select {
      width: 100%;
    }
  }

  .el-row .el-col:last-child {
    border-right: none;
  }

  .user_select_item .el-select {
    width: 49%;
  }
}
.retailForm2 {
  border-top: none;
  border-bottom: none;
  border-left: none;
  .el-row {
    border-bottom: none;
    border-right: none;
  }
  .el-col {
    border-right: none !important;
  }
}
.el-form-item {
  margin-bottom: 5px;
}
.vipInfo {
  height: 100%;
  img {
    margin: 0 10px;
    width: 30px;
  }
  span {
    display: inline-block;
    text-align: left;
    height: 100%;
    width: calc(100% - 60px);
    max-width: calc(100% - 60px);
    line-height: 28px;
    overflow: hidden;
    em {
      display: inline-block;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      color: #000;
      padding: 0 5px;
      max-width: 50%;
    }
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
.show2line {
  cursor: pointer;
  line-height: 15px !important;
  span {
    text-align: left;
    //  display:block;
  }
}
.retail_table {
  // min-height: 500px;
}
</style>