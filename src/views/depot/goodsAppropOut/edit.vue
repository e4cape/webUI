<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">编辑调拨出库单({{detail.KindTypeEv}})</span>
        <span class="title fr">
          <el-button type="text" @click="editDialog = true">修改</el-button>
        </span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.OutakeCode}}</td>
                <td class="tit">创建：</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime|filterDateMinutes}}</td>
                <td class="tit">审核：</td>
                <td v-if="detail.State === GoodsAllotOrderOutakeState.Audit || detail.State === GoodsAllotOrderOutakeState.Reject">{{detail.CheckUser + ' ' }}{{detail.CheckTime|filterDateMinutes}}</td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">发货位置：</td>
                <td>{{detail.UnitedName1==='总部'? `${detail.WarehouseName1} > ${detail.ShelfName1}` : detail.UnitedName1 }}</td>
                <td class="tit">调拨原因：</td>
                <td>{{detail.ReasonTypeDv}}</td>
                <td class="tit">收货单位：</td>
                <td>{{detail.WarehouseName2? `${detail.WarehouseName2} > ${detail.ShelfName2}` : detail.UnitedName2 }}</td>
              </tr>
              <tr>
                <td class="tit">收货方式：</td>
                <td>{{ShippingType.Types[detail.ShippingType]}}</td>
                <td class="tit">门店分货单：</td>
                <td>{{detail.PreviousCode}}</td>
                <td class="tit">发货人：</td>
                <td>{{detail.SendUser}}</td>
              </tr>
              <tr>
                <td class="tit">发货人电话：</td>
                <td>{{detail.SendPhone}}</td>
                <td class="tit">收货人：</td>
                <td>{{detail.ReceiptUser}}</td>
                <td class="tit">收货人电话：</td>
                <td>{{detail.ReceiptPhone}}</td>
              </tr>
              <tr>
                <td class="tit">快递公司：</td>
                <td>{{ExpressType.Types[detail.ExpressType]}}</td>
                <td class="tit">快递单号：</td>
                <td>{{detail.ExpressCode}}</td>
                <td class="tit">业务日期：</td>
                <td class="note">{{detail.ActualDate | filterDate}}</td>
              </tr>
              <tr>
                <td class="tit">备注：</td>
                <td class="note" colspan="5">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="goods-wrapper" v-loading="$store.getters.tb_loading">
          <div class="goods-left" v-if="detail.SourceType === GoodsAllotOrderOutakeSourceType.Split">
            <!-- 货品列表 -->
            <table class="goods-table" cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>款式</th>
                  <th>分货</th>
                  <th>已选</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in orderStyleData" :key="index" :class="{active:item.StyleItid === goodForm.StyleItid}" @click="orderStyleSelect(item.StyleItid)">
                  <td>{{(index+1 + (orderStyleForm.PageIndex - 1) * orderStyleForm.PageSize).toFixed(0)}}</td>
                  <td>
                    <div class="goods-style">
                      <el-popover trigger="hover" class="img-box">
                        <img
                          :src="item.ImageUrl.indexOf('http') > -1 ? item.ImageUrl : $root.settings.DOMAIN_IMG_FILE + (item.ImageUrl ? item.ImageUrl.replace('{0}', '150x150') : '/default/goods/150x150.jpg')"
                        >
                        <img
                          slot="reference"
                          :src="item.ImageUrl.indexOf('http') > -1 ? item.ImageUrl : $root.settings.DOMAIN_IMG_FILE + (item.ImageUrl ? item.ImageUrl.replace('{0}', '150x150') : '/default/goods/150x150.jpg')"
                        >
                      </el-popover>
                      <!-- <img :src="item.ImageUrl ? " alt> -->
                      <div class="goods-info">
                        <p>{{item.StyleCode}}</p>
                        <p>{{item.StyleName}}</p>
                      </div>
                    </div>
                  </td>
                  <td>{{item.SplitQty}}</td>
                  <td>{{item.GoodsQty}}</td>
                </tr>
              </tbody>
            </table>
            <!-- 工具栏 -->
            <div class="toolsbar">
              <div class="myPagination-bar">
                <el-select v-model="orderStyleForm.PageSize" placeholder="20" name="PageSize">
                  <el-option v-for="(item, index) in paginationSizes" :key="index" :value="item"></el-option>
                </el-select>
                <div class="pagination-controller">
                  <button class="prev-btn" @click="prevPage" :disabled="orderStyleForm.PageIndex === 1" :class="{'isDisabled': orderStyleForm.PageIndex === 1}">
                    <i class="el-icon-arrow-left"></i>
                  </button>
                  <span class="current-page">{{orderStyleForm.PageIndex}}/{{pages}}</span>
                  <button class="next-btn" @click="nextPage" :disabled="orderStyleForm.PageIndex === pages" :class="{'isDisabled': orderStyleForm.PageIndex === pages}">
                    <i class="el-icon-arrow-right"></i>
                  </button>
                </div>
                <span class="total">共{{totalCount}}条</span>
              </div>
            </div>
          </div>
          <div class="goods-right">
            <div class="handle-box">
              <div class="handle-left">
                <el-input class="code-input" placeholder="录入/扫描条码" v-model="barCode" @keyup.enter.native="codeEnter" :maxlength="50" name="code"></el-input>
                <el-button type="primary" @click="multiCodeVisible=true" name="btnMultiCode">批量录入</el-button>
                <el-button @click="dialogSelectGoodsVisible=true" name="btnSelectGoods">选择货品</el-button>
                <el-dropdown class="multi-operation" @command="takeOrder" v-if="detail.SourceType !== GoodsAllotOrderOutakeSourceType.Split">
                  <el-button>
                    提单
                    <i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="purchase">成品进货入库单</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div class="handle-right">
                <span class="detail-info-num-item">
                  条码数量：
                  <b class="num">{{total}}</b>
                </span>
                <span class="detail-info-num-item">
                  货品总数：
                  <b class="num">{{detail.GoodsQty||0}}</b>
                </span>
                <span class="detail-info-num-item">
                  结算金额：
                  <b class="num">￥{{$root.toFloat(detail.Preprice)}}</b>
                </span>
              </div>
            </div>
            <!-- @module 数据表格 -->
            <el-table :data="goodsData" @current-change="updateItem" ref="goodTable" highlight-current-row class="m-y-10 edit-table">
              <el-table-column prop="BarCode" label="条码" min-width="80" show-overflow-tooltip fixed>
                <template slot-scope="scope">
                  <el-button type="text" @click="showDetailDialog(scope.row.GoodsId)">{{scope.row.BarCode}}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="StyleCode" label="款号" min-width="80" show-overflow-tooltip fixed></el-table-column>
              <el-table-column prop="GoodsName" label="货品名称" min-width="100" show-overflow-tooltip fixed></el-table-column>
              <el-table-column prop="GoldWeight" label="金重（g）" show-overflow-tooltip min-width="100"></el-table-column>
              <el-table-column prop="Weight" label="货重（g）" min-width="120"></el-table-column>
              <el-table-column prop="Stone1Weight" label="主石重（ct）" show-overflow-tooltip min-width="100"></el-table-column>
              <!-- <el-table-column prop label="主石颜色" min-width="120"></el-table-column>
              <el-table-column prop label="主石净度" min-width="120"></el-table-column> -->
              <el-table-column prop="LabelPrice" label="标签价" show-overflow-tooltip></el-table-column>
              <el-table-column prop="AbaseFee" label="基础工费" min-width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.AbaseFee" @input="handleFocus(scope.row)" :maxlength="10" @keyup.native="scope.row.AbaseFee = $root.toFixed(scope.row.AbaseFee,2)" @blur="getUnitPrice(scope.row)" name="AbaseFee"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="AattaFee" label="附加工费" min-width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.AattaFee" @input="handleFocus(scope.row)" :maxlength="10" @keyup.native="scope.row.AattaFee = $root.toFixed(scope.row.AattaFee,2)" @blur="getUnitPrice(scope.row)" name="AattaFee"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="AbrandFee" label="品牌费" min-width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.AbrandFee" @input="handleFocus(scope.row)" :maxlength="10" @keyup.native="scope.row.AbrandFee = $root.toFixed(scope.row.AbrandFee,2)" @blur="getUnitPrice(scope.row)" name="AbrandFee"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="ApartFee" label="配件价格" min-width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.ApartFee" @input="handleFocus(scope.row)" :maxlength="10" @keyup.native="scope.row.ApartFee = $root.toFixed(scope.row.ApartFee,2)" @blur="getUnitPrice(scope.row)" name="ApartFee"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="AllianFee" label="证盟费" min-width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.AllianFee" @input="handleFocus(scope.row)" :maxlength="10" @keyup.native="scope.row.AllianFee = $root.toFixed(scope.row.AllianFee,2)" @blur="getUnitPrice(scope.row)" name="AllianFee"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="Discount" label="结算折扣" min-width="120">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.Discount"
                    @input="handleFocus(scope.row)"
                    :maxlength="5"
                    @keyup.native="scope.row.Discount = scope.row.Discount * 1 > 1 ? 1 : $root.toFixed(scope.row.Discount,2)"
                    @blur="getUnitPrice(scope.row)"
                    name="Discount"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="AservFee" label="服务费" min-width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.AservFee" @input="handleFocus(scope.row)" :maxlength="10" @keyup.native="scope.row.AservFee = $root.toFixed(scope.row.AservFee,2)" @blur="getUnitPrice(scope.row)" name="AservFee"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="UnitPrice" label="结算价" min-width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.UnitPrice" @input="handleFocus(scope.row)" :maxlength="10" @keyup.native="scope.row.UnitPrice = $root.toFixed(scope.row.UnitPrice,2)" name="UnitPrice"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="Quantity" label="数量" min-width="120">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.Quantity" @input="handleFocus(scope.row)" :maxlength="8" @keyup.native="scope.row.Quantity = $root.toFixed(scope.row.Quantity) * 1" name="Quantity"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="金额" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.UnitPrice*(scope.row.Quantity || 0) > 9999999999 ? 9999999999 : (scope.row.UnitPrice*(scope.row.Quantity || 0)).toFixed(2) }}</template>
              </el-table-column>
              <el-table-column label="操作" min-width="80" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" @click="delGood($event, scope.row)" name="btnDelGood">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- End 数据表格 -->
            <!-- Pagination -->
            <pagination :pg="goodForm.PageIndex" :size="goodForm.PageSize" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-col :span="12">
        <el-button type="primary" @click="orderSubmit" :loading="sureLoading" name="btnOrderSubmit">{{goodsData.every(item => item.canAudit)?'提交审核':'保存'}}</el-button>
        <router-link :to="{path:'/depot/goodsappropout/index'}" name="btnGoBack">
          <el-button>返回</el-button>
        </router-link>
      </el-col>
      <el-col :span="12" class="tr">
        <p>注：结算金额用于加盟商与总部之间的结算，从加盟商账户中结算。</p>
      </el-col>
    </div>

    <!-- @module Dialog·修改成品调拨出库单 -->
    <basic-edit :visible.sync="editDialog" :data="detail" @listenEditDialog="getDetail"></basic-edit>
    <!-- End Dialog·修改成品调拨出库单 -->

    <!-- dialog 批量录入条码 -->
    <multi-code-enter :visible.sync="multiCodeVisible" @listenMultiCodeEnter="listenMultiCodeEnter"></multi-code-enter>
    <!-- End 批量录入条码 -->

    <!-- 选择货品 -->
    <select-goods :visible.sync="dialogSelectGoodsVisible" :warehouseId="detail.WarehouseId1" :shelfId="detail.ShelfId1" :deskId="$store.getters.user_session.DeskId" @listenAddGoods="listenAddGoods"></select-goods>
    <!-- End 选择货品 -->

    <!-- dialog 货品详情 -->
    <good-detail :visible.sync="goodDetailDialog.visible" :goodsId="goodDetailDialog.goodsId" :kindType="detail.KindTypeEk"></good-detail>
    <!-- end 货品详情-->

    <!-- dialog 提取成品采购入库单 -->
    <purchase-take :visible.sync="purchaseTakeVisible" @listenPurchaseTakeDialog="listenPurchaseTakeDialog"></purchase-take>
    <!-- end 提取成品采购入库单-->
  </div>
</template>

<script>
import { YNStatus, ShippingType, ExpressType } from '@/enums/common.js'
import {
  GoodsAllotOrderOutakeState,
  GoodsAllotOrderOutakeSourceType,
  GoodsIntakeOrderBasicState,
} from '@/enums/stocking.js'
import {
  STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_GET,
  STOCKING_API_GOODS_ALLOT_ORDER_GOODS_GETS,
  STOCKING_API_GOODS_ALLOT_ORDER_GOODS_CREATE,
  STOCKING_API_GOODS_ALLOT_ORDER_GOODS_UPDATE,
  STOCKING_API_GOODS_ALLOT_ORDER_GOODS_DELETE,
  STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_WAIT,
  STOCKING_API_GOODS_ALLOT_ORDER_GOODS_SELECTINTAKECREATE,
  STOCKING_API_GOODS_ALLOT_ORDER_STYLE_GETS,
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
import SelectGoods from '@/components/erp/selectGoods'
import MultiCodeEnter from '@/components/erp/multiCodeEnter'
import goodDetail from '@/components/erp/goodDetail'
import basicEdit from './appropOutBasicEdit'
import PurchaseTake from './purchaseTake'

export default {
  data() {
    return {
      YNStatus,
      ShippingType,
      ExpressType,
      GoodsIntakeOrderBasicState,
      GoodsAllotOrderOutakeState,
      GoodsAllotOrderOutakeSourceType,
      barCode: '', // 手动录入条码
      multiCodeVisible: false, // 批量录入条码弹窗
      dialogSelectGoodsVisible: false, // 选择货品对话框
      // enableSubmit: true, // 控制请求一个一个提交
      purchaseTakeVisible: false, // 提取成品采购入库单
      paginationSizes: [10, 15, 20], // 分页数据条数数组
      totalCount: 0, // 总数据条数
      orderStyleData: [],
      appropOutReasons: [], // 调拨出库原因
      detail: {}, // 明细
      editDialog: false, // 新建对话框
      goodsData: [], // 货品数据
      total: 0,
      numberInputProps: {
        min: 0,
        max: 999999999,
        precision: 2
      },
      orderStyleForm: {
        OutakeId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 10
      },
      goodForm: {
        OutakeId: this.$route.query.id,
        StyleItid: 0,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      currentRow: {},
      sureLoading: false,
    }
  },
  components: {
    pagination,
    SelectGoods,
    MultiCodeEnter,
    basicEdit,
    goodDetail,
    PurchaseTake
  },
  computed: {
    pages() {
      return Math.ceil(this.totalCount / this.orderStyleForm.PageSize)
    }
  },
  watch: {
    'orderStyleForm.PageIndex'() {
      this.getOrderStyleData().then(() => {
        this.goodForm.PageIndex = 1
        this.getGoods()
      })
    },
    'orderStyleForm.PageSize'() {
      this.orderStyleForm.PageIndex = 1
      this.getOrderStyleData().then(() => {
        this.goodForm.PageIndex = 1
        this.getGoods()
      })
    }
  },
  mounted() {
    this.init()
  },

  methods: {
    // 计算结算价
    getUnitPrice(row) {
      row.UnitPrice = ((row.LabelPrice * 1 + row.AbaseFee * 1 + row.AattaFee * 1  + row.AbrandFee * 1  + row.ApartFee * 1  + row.AllianFee * 1 ) * row.Discount* 1  + row.AservFee * 1 ).toFixed(2)
    },
    codeEnter() {
      // 手动录入
      if (!this.barCode) {
        this.$message.warning('请输入货品条码')
        return
      }
      this.addGoods([
        {
          BarCode: this.barCode,
          Quantity: 1
        }
      ])
    },
    listenMultiCodeEnter(codes) {
      // 批量录入
      if (codes.length) {
        this.addGoods(codes)
      } else {
        this.multiCodeVisible = false
      }
    },
    listenAddGoods(data) {
      // 选择录入
      const codes = []
      data.forEach(item => {
        codes.push({
          BarCode: item.BarCode,
          Quantity: item.Quantity
        })
      })
      this.addGoods(codes)
    },
    addGoods(items) {
      // 录入货品
      STOCKING_API_GOODS_ALLOT_ORDER_GOODS_CREATE({
        OutakeId: this.detail.OutakeId,
        Items: items
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
            type: 'success'
          })
          this.code = ''
          this.multiCodeVisible = false
          if (items.some(item => this.goodsData.every(val => val.BarCode !== item.BarCode))) {
            this.goodForm.PageIndex = 1
          }

          this.init()
        } else {
          this.$alert(res.data.Message, '错误', {
            dangerouslyUseHTMLString: true
          })
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    takeOrder(command) {
      if (command === 'purchase') {
        this.purchaseTakeVisible = true
      }
    },
    listenPurchaseTakeDialog(data) {
      // 提单创建
      STOCKING_API_GOODS_ALLOT_ORDER_GOODS_SELECTINTAKECREATE({
        OutakeId: parseInt(this.$route.query.id),
        IntakeId: data.IntakeId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodForm.PageIndex = 1
          this.init()
          this.purchaseTakeVisible = false
        } else {
          this.$alert(res.data.Message, '错误', {
            dangerouslyUseHTMLString: true
          })
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },

    // getCustonFileds() {
    //   // 获取自定义列
    //   STOCKING_API_SETTING_CUSTOMIZED_FIELD_GETS({
    //     OrderType: GoodsStockLogOrderType.GoodsAllotOrderOutake,
    //     LargeType: SettingCustomizedFieldLargeType.Goods,
    //     KindTypeEk: this.detail.KindTypeEk
    //   }).then(res => {})
    // },

    delGood($event, row) {
      $event.currentTarget.blur()
      this.$confirm('确定删除此货品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        STOCKING_API_GOODS_ALLOT_ORDER_GOODS_DELETE({
          OutakeId: row.OutakeId,
          GoodsItid: row.GoodsItid
        }).then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            if (this.total <= this.goodForm.PageSize * (this.goodForm.PageIndex - 1) + 1) {
              this.goodForm.PageIndex = 1
            }
            this.init()
          }
        })
      })
    },
    handleFocus(row) { // 选择当前行
      this.$refs.goodTable.setCurrentRow(row)
      this.currentRow = row
      // this.enableSubmit = false
      row.canAudit = false
    },
    updateItem(currentRow, oldCurrentRow) {
      if (!oldCurrentRow) {
        return false
      }
      if (!oldCurrentRow.Quantity) {
        this.$message.warning('请正确输入数量')
        return false
      }
      
      if (!oldCurrentRow.canAudit) {
        this.sureLoading = true
        let item = { ...oldCurrentRow }
        item.GoldWeight = this.$root.toInt(item.GoldWeight)
        item.Stone1Weight = this.$root.toInt(item.Stone1Weight)
        item.LabelPrice = this.$root.toInt(item.LabelPrice)
        item.AbaseFee = this.$root.toInt(item.AbaseFee)
        item.AattaFee = this.$root.toInt(item.AattaFee)
        item.AbrandFee = this.$root.toInt(item.AbrandFee)
        item.ApartFee = this.$root.toInt(item.ApartFee)
        item.AllianFee = this.$root.toInt(item.AllianFee)
        item.Discount = this.$root.toInt(item.Discount)
        item.AservFee = this.$root.toInt(item.AservFee)
        item.UnitPrice = this.$root.toInt(item.UnitPrice)
        item.Quantity = parseInt(item.Quantity)
        STOCKING_API_GOODS_ALLOT_ORDER_GOODS_UPDATE(item).then(res => {
          if (res.data.Code === 'CORRECT') {
            // this.enableSubmit = true
            oldCurrentRow.canAudit = true
            this.getDetail()
            this.getOrderStyleData()
          }
          this.sureLoading = false
        })
      }
    },
    orderSubmit() {
      if (this.goodsData.every(item => item.canAudit)) {
        this.sureLoading = true
        STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_WAIT({
          OutakeId: this.detail.OutakeId,
          CheckNote: ''
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success(res.data.Message)
            this.$store.commit('SET_BTN_LOADING', false)
            this.$router.push({
              path: '/depot/goodsappropout/index'
            })
          } else {
            const mArr = res.data.Message.split('<br/>')
            if (mArr.length > 1) {
              const h = this.$createElement
              const message = []
              mArr.forEach(item => {
                message.push(h('p', null, item))
              })
              this.$msgbox({
                title: '消息',
                message: h('div', null, message),
                confirmButtonText: '确定'
              })
            }
          }
          this.sureLoading = false
        })
      } else {
        this.updateItem(this.currentRow, this.currentRow)
      }
    },
    init() {
      if (!this.$route.query.id) {
        this.dataError()
      } else {
        this.$store.commit('SET_TB_LOADING', true)
        this.getDetail().then(() => {
          if (
            this.detail.SourceType === GoodsAllotOrderOutakeSourceType.Split
          ) {
            this.getOrderStyleData().then(() => {
              this.getGoods()
            })
          } else {
            this.getGoods()
          }
        })
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
      this.$store.commit('SET_FULL_LOADING', true)
      return STOCKING_API_GOODS_ALLOT_ORDER_OUTAKE_GET({
        OutakeId: this.$route.query.id
      })
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.detail = res.data.Data
          }
          this.$store.commit('SET_FULL_LOADING', false)
        })
        .catch(() => {
          this.$store.commit('SET_FULL_LOADING', false)
        })
    },
    getOrderStyleData() {
      // 调拨出库单位置列表
      this.orderStyleForm.OutakeId = parseInt(this.$route.query.id)
      return STOCKING_API_GOODS_ALLOT_ORDER_STYLE_GETS(
        this.orderStyleForm
      ).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.orderStyleData = res.data.Data.Rows
          this.totalCount = res.data.Data.Count
          this.goodForm.StyleItid = this.goodForm.StyleItid || (res.data.Data.Rows
            ? res.data.Data.Rows[0].StyleItid
            : 0)
        }
      })
    },
    prevPage() {
      this.orderStyleForm.PageIndex -= 1
    },
    nextPage() {
      this.orderStyleForm.PageIndex += 1
    },
    orderStyleSelect(val) {
      // 切换位置
      this.goodForm.StyleItid = val
      this.goodForm.PageIndex = 1
      this.getGoods()
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_GOODS_ALLOT_ORDER_GOODS_GETS(this.goodForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.goodsData.forEach(item => {
            item.GoldWeight = this.$root.toFloat(item.GoldWeight, 3)
            item.Weight = this.$root.toFloat(item.Weight, 3)
            item.Stone1Weight = this.$root.toFloat(item.Stone1Weight, 3)
            item.LabelPrice = this.$root.toFloat(item.LabelPrice)
            item.AbaseFee = this.$root.toFloat(item.AbaseFee)
            item.AattaFee = this.$root.toFloat(item.AattaFee)
            item.AbrandFee = this.$root.toFloat(item.AbrandFee)
            item.ApartFee = this.$root.toFloat(item.ApartFee)
            item.AllianFee = this.$root.toFloat(item.AllianFee)
            item.Discount = this.$root.toFloat(item.Discount)
            item.AservFee = this.$root.toFloat(item.AservFee)
            item.UnitPrice = this.$root.toFloat(item.UnitPrice)
            item.SumPrice = this.$root.toFloat(item.SumPrice)
            this.$set(item, 'canAudit', true) // 控制所有货品都是已保存状态再提交
          })
          this.total = res.data.Data.Count
        }
        // this.enableSubmit = true
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    pageChange(val) {
      this.goodForm.PageIndex = val
      this.getGoods()
    },
    pageSizeChange(val) {
      this.goodForm.PageIndex = 1
      this.goodForm.PageSize = val
      this.getGoods()
    },
    showDetailDialog(goodsId) {
      this.goodDetailDialog = {
        goodsId: goodsId,
        visible: true
      }
    },

  }
}
</script>
<style lang="scss">
@import '@/assets/sass/erp/purchase.scss';
</style>

<style lang="scss" scoped>
.goods-style {
  display: flex;
  align-items: center;
  padding: 10px 0;
  .img-box {
    margin-right: 10px;
    width: 40px;
    height: 40px;
    img {
      width: 100%;
    }
  }
  .goods-info {
    width: 1%;
    flex: 1;
    p {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.goods-wrapper {
  font-size: 12px;
  padding-bottom: 0;
  .goods-left {
    .goods-table {
      margin-bottom: 34px;
      tr {
        th,
        td {
          padding: 0 8px;
          width: auto;
          &:nth-of-type(2) {
            width: 50%;
          }
          &:last-child::after {
            top: 50%;
            transform: translateY(-50%) rotateZ(45deg);
          }
        }
      }
    }
    .toolsbar {
      height: 33px;
      .myPagination-bar {
        border-bottom: 0 none;
      }
    }
  }
  .goods-right {
    display: block;
    width: 1%;
    border: 0 none;
    .handle-box {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      .handle-left {
        display: flex;
        align-items: cneter;
        flex: 1;
        width: 1%;
        min-width: 400px;
      }
      .handle-right {
        .detail-info-num-item:first-child {
          margin-left: 0;
        }
      }
    }
  }
}
.code-input {
  margin-right: 10px;
  vertical-align: middle;
}
.el-input-number {
  width: 100%;
}
.count {
  padding-right: 15px;
  line-height: 36px;
  text-align: right;
  font-size: 14px;
  white-space: nowrap;
}
</style>
