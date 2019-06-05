<template>
  <el-row class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">领货（{{$route.query.deskName}}）</span>
      </div>
      <div class="panel-bd p-10">
        <el-row :gutter="10" class="m-b-10">
          <el-col :span="16" class="tl">
            <el-row :gutter="10">
              <el-col :span="10">
                <el-input type="normal" v-model="code" :maxlength="50" placeholder="录入/扫描条码" @keyup.enter.native="singleCodeEnter" name="code"></el-input>
              </el-col>
              <el-col :span="14" class="tl">
                <el-button type="primary" @click="multiCodeVisible = true" name="btnMultiCode">批量录入</el-button>
                <el-button @click="dialogSelectGoodsVisible = true" name="btnSelectGoods">选择货品</el-button>
                <el-dropdown class="multi-operation" @command="multiAudit" name="multiAudit">
                  <el-button>
                    提单
                    <i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="1">成品进货入库单</el-dropdown-item>
                    <el-dropdown-item command="2">成品调拨入库单</el-dropdown-item>
                    <el-dropdown-item command="3">柜台退货单</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8" class="count">
            <label>
              条码数量：
              <span class="num">{{total}}</span>
            </label>
            <label>
              货品总数：
              <span class="num">{{quantity}}</span>
            </label>
          </el-col>
        </el-row>
        <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" highlight-current-row>
          <el-table-column prop="BarCode" label="条码" min-width="80" show-overflow-tooltip fixed>
            <template slot-scope="scope">
              <span @click="showDetailDialog(scope.row.GoodsId)" class="init-button-text" name="btnShowDetail">{{scope.row.BarCode}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="StyleCode" label="款号" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="GoodsName" label="货品名称" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="MaterialType" label="材质" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="CategoryType" label="品类" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="GoldType" label="成色" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Weight" label="货重（g）" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="GoldWeight" label="净金重（g）" :formatter="formatter" min-width="130" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Stone1Name" label="主石名称" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Stone1Weight" label="主石重（ct）" :formatter="formatter" min-width="140" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Quantity" label="数量" min-width="120">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.Quantity"
                @focus="enableSubmit = false"
                @keyup.enter.native="itemUpdate(scope.row)"
                @blur="itemUpdate(scope.row)"
                @keyup.native="scope.row.Quantity = $root.toFixed(scope.row.Quantity, 0)"
                name="Quantity"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="delGood($event, scope.row)" name="btnDelGood">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- Pagination -->
        <pagination :pg="goodsParam.PageIndex" :size="goodsParam.PageSize" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
      </div>
    </div>
    <div class="buttons">
      <el-button type="primary" @click="makeTake" name="btnMakeTake" :loading="sureBtnLoading">{{enableSubmit? '确认领货':'保存'}}</el-button>
      <el-button @click="cancelReturn" name="btnCancelReturn">取消</el-button>
    </div>

    <!-- @module 选择货品 -->
    <select-goods :visible.sync="dialogSelectGoodsVisible" :deskId="$store.getters.user_session.DeskId" @listenAddGoods="listenAddGoods"></select-goods>
    <!-- End 选择货品 -->

    <!-- @module 批量录入 -->
    <multi-code-enter :visible.sync="multiCodeVisible" @listenMultiCodeEnter="listenMultiCodeEnter"></multi-code-enter>
    <!-- End 批量录入 -->

    <!-- dialog 货品详情 -->
    <good-detail :visible.sync="goodDetailDialog.visible" :goodsId="goodDetailDialog.goodsId"></good-detail>
    <!-- end 货品详情-->

    <!-- dialog 提取成品采购入库单 -->
    <purchase-take :visible.sync="purchaseTakeVisible" @listenPurchaseTakeDialog="listenPurchaseTakeDialog"></purchase-take>
    <!-- end 提取成品采购入库单-->

    <!-- 退货处领货 -->
    <el-dialog title="退货处领货" :visible.sync="returnGoodsDialog" @open="showGoodsDialog">
      <div class="panel-bd">
        <el-table :data="returnGoods" @sort-change="sortChange" highlight-current-row @row-click="selectionReturnChange" v-loading="returnGoodsTbloading">
          <el-table-column prop="PickretCode" label="退货单" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column prop="CreateTime" label="退货时间" sortable="custom" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column prop="CreateUser" label="操作人" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Quantity" label="退货数量" min-width="120" show-overflow-tooltip></el-table-column>
        </el-table>
        <pagination :pg="returnGoodsParams.PageIndex" :size="returnGoodsParams.PageSize" :total="returnGoodsTotal" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="$store.getters.is_loading" @click.native="receiveReturnGood" name="btnReceiveReturnGood">确定</el-button>
        <el-button @click="returnGoodsDialog = false" name="btnReturnGoodsClose">关闭</el-button>
      </div>
    </el-dialog>
    <!-- end 退货处领货 -->

    <approp-in :visible.sync="appropInVisible" @listenAppropInDialog="listenAppropInDialog"></approp-in>
  </el-row>
</template>
<script>
import { YNStatus } from '@/enums/common.js'
import {
  DeskPickretOrderBasicPickretType,
  GoodsIntakeOrderBasicState
} from '@/enums/stocking.js'
import {
  STOCKING_API_DESK_PICKRET_ORDER_ITEM_GETS,
  STOCKING_API_DESK_PICKRET_ORDER_ITEM_CREATE,
  STOCKING_API_DESK_PICKRET_ORDER_BASIC_AUDIT,
  STOCKING_API_DESK_PICKRET_ORDER_ITEM_DELETE,
  STOCKING_API_DESK_PICKRET_ORDER_ITEM_UPDATE,
  STOCKING_API_DESK_PICKRET_ORDER_BASIC_GETS,
  STOCKING_API_DESK_PICKRET_ORDER_ITEM_SELECTINTAKECREATE,
  STOCKING_API_DESK_PICKRET_ORDER_ITEM_SELECTPICKRETCREATE,
  STOCKING_API_DESK_PICKRET_ORDER_ITEM_SELECTALLOTINTAKECREATE,
  STOCKING_API_DESK_PICKRET_ORDER_BASIC_GET
} from '@/apis/stocking.js'

import SelectGoods from '@/components/erp/selectGoods'
import MultiCodeEnter from '@/components/erp/multiCodeEnter'
import goodDetail from '@/components/erp/goodDetail'
import pagination from '@/components/pagination.vue'
import PurchaseTake from '@/views/depot/goodsAppropOut/purchaseTake'
import appropIn from '@/views/depot/counter/appropIn'

export default {
  data() {
    return {
      GoodsIntakeOrderBasicState,
      pickretId: '',
      data: [],
      goodsParam: {
        PickretId: parseInt(this.$route.query.pickretId),
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      quantity: 0,
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      dialogSelectGoodsVisible: false, // 选择货品窗口
      multiCodeVisible: false, // 批量录入窗口
      code: null,
      enableSubmit: true, // 控制请求一个一个提交,
      returnGoodsDialog: false, // 退货显示,
      returnGoods: [],
      returnGoodsParams: {
        PageIndex: 1,
        PageSize: 10,
        DeskId: 0,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PickretType: DeskPickretOrderBasicPickretType.Return
      },
      returnGoodsTotal: 0,
      selectArr: [],
      purchaseTakeVisible: false,
      appropInVisible: false,
      returnGoodsTbloading: false,
      sureBtnLoading: false,
    }
  },
  methods: {
    formatter(row, column, val) {
      switch (column.property) {
        case 'MaterialType':
          return this.$store.getters.materialType.Types[val]
        case 'CategoryType':
          return this.$store.getters.categoryType.Types[val]
        case 'GoldType':
          return this.$store.getters.goldType.Types[val]
        default:
          return this.$root.toFloat(val, 3)
      }
    },
    singleCodeEnter() {
      if (!this.code) {
        this.$message.warning('请输入货品条码')
        return
      }
      this.itemCreate([{ BarCode: this.code, Quantity: 1 }])
    },
    listenMultiCodeEnter(data) {
      if (data.length) {
        this.itemCreate(data)
      }
    },
    listenAddGoods(data) {
      this.itemCreate(data)
    },
    itemCreate(items) {
      STOCKING_API_DESK_PICKRET_ORDER_ITEM_CREATE({
        PickretId: this.pickretId,
        Items: items
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
            type: 'success'
          })
          if (
            items.some(item =>
              this.data.every(val => val.BarCode !== item.BarCode)
            )
          ) {
            this.goodsParam.PageIndex = 1
          }
          this.code = ''
          this.multiCodeVisible = false
          this.init()
        } else {
          this.$alert(res.data.Message, '提示', {
            confirmButtonText: '确定',
            type: 'error'
          })
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    multiAudit(command) {
      switch (command) {
        case '1':
          this.purchaseTakeVisible = true
          break
        case '2':
          this.appropInVisible = true
          break
        case '3':
          this.returnGoodsDialog = true
          break
        default:
      }
    },
    listenAppropInDialog(id) {
      // 调拨入库单提点创建
      if (id) {
        STOCKING_API_DESK_PICKRET_ORDER_ITEM_SELECTALLOTINTAKECREATE({
          PickretId: this.pickretId,
          OrderId: id
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.appropInVisible = false
            this.goodsParam.PageIndex = 1
            this.init()
          } else {
            this.$alert(res.data.Message, '错误', {
              dangerouslyUseHTMLString: true
            })
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }
    },
    listenPurchaseTakeDialog(data) {
      // 采购入库单提单创建
      if (data.IntakeId) {
        STOCKING_API_DESK_PICKRET_ORDER_ITEM_SELECTINTAKECREATE({
          PickretId: this.pickretId,
          OrderId: data.IntakeId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.goodsParam.PageIndex = 1
            this.init()
          } else {
            this.$alert(res.data.Message, '错误', {
              dangerouslyUseHTMLString: true
            })
          }
          this.purchaseTakeVisible = false
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }
    },
    showGoodsDialog() {
      this.returnGoodsParams.PageIndex = 1
      this.getReturnGoodsList()
    },
    selectionReturnChange(select) {
      this.selectArr = select
    },
    receiveReturnGood() {
      if (!this.selectArr.PickretId) {
        return this.$message.error('请选择一条数据')
      }
      let data = {
        PickretId: this.pickretId,
        OrderId: this.selectArr.PickretId
      }
      this.$store.commit('SET_BTN_LOADING', true) // table loading
      STOCKING_API_DESK_PICKRET_ORDER_ITEM_SELECTPICKRETCREATE(data)
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success(res.data.Message)
            this.selectArr = []
            this.returnGoodsDialog = false
            this.init()
          } else {
            this.$alert(res.data.Message, '错误', {
              dangerouslyUseHTMLString: true
            })
          }
          this.$store.commit('SET_BTN_LOADING', false) // table loading
        })
        .catch(err => {
          this.$message.error(err.data.Message)
        })
    },
    itemUpdate(row) {
      this.sureBtnLoading = true
      STOCKING_API_DESK_PICKRET_ORDER_ITEM_UPDATE({
        ItemId: row.ItemId,
        PickretId: this.pickretId,
        Quantity: parseInt(row.Quantity)
      })
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.enableSubmit = true
            this.getQuantity()
          }
          this.sureBtnLoading = false
        })
        .catch(() => {
          this.sureBtnLoading = false
        })
    },
    delGood($event, row) {
      $event.currentTarget.blur()
      this.$confirm('确定删除此货品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_DESK_PICKRET_ORDER_ITEM_DELETE({
            ItemId: row.ItemId,
            PickretId: this.pickretId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: res.data.Message,
                type: 'success'
              })
              if (
                this.total <=
                this.goodsParam.PageSize * (this.goodsParam.PageIndex - 1) + 1
              ) {
                this.goodsParam.PageIndex = 1
              }

              this.init()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    makeTake() {
      if (!this.data.length) {
        this.$message.warning('请先添加领货数据')
      } else if (this.enableSubmit) {
        this.sureBtnLoading = true
        STOCKING_API_DESK_PICKRET_ORDER_BASIC_AUDIT({
          PickretId: this.pickretId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            this.$router.push({
              path: '/depot/counter/index'
            })
          } else {
            this.$alert(res.data.Message, '提示', {
              confirmButtonText: '关闭',
              type: 'warning'
            })
          }
          this.sureBtnLoading = false
        })
      }
    },
    init() {
      if (!this.$route.query.pickretId) {
        this.dataError()
      } else {
        this.pickretId = parseInt(this.$route.query.pickretId)
        this.getQuantity()
        this.getGoods()
      }
    },
    dataError() {
      this.$alert('数据错误', '提示', {
        confirmButtonText: '关闭',
        type: 'warning'
      })
        .then(() => {
          this.$router.back()
        })
        .catch(() => {
          this.$router.back()
        })
    },
    getQuantity() {
      // 获取货品总数
      this.$store.commit('SET_FULL_LOADING', true)
      STOCKING_API_DESK_PICKRET_ORDER_BASIC_GET({
        PickretId: this.pickretId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.quantity = res.data.Data.Quantity
          this.returnGoodsParams.DeskId = res.data.Data.DeskId
        }
        this.$store.commit('SET_FULL_LOADING', false)
      })
    },
    getGoods() {
      // 柜台货品明细
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_DESK_PICKRET_ORDER_ITEM_GETS(this.goodsParam).then(res => {
        this.$store.commit('SET_TB_LOADING', false) // table loading
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
      })
    },
    pageChange(val) {
      this.goodsParam.PageIndex = val
      this.getGoods()
    },
    pageSizeChange(val) {
      this.goodsParam.PageSize = val
      this.goodsParam.PageIndex = 1
      this.getGoods()
    },
    getReturnGoodsList() {
      this.returnGoodsTbloading = true
      STOCKING_API_DESK_PICKRET_ORDER_BASIC_GETS(this.returnGoodsParams).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.returnGoods = res.data.Data.Rows || []
            this.returnGoodsTotal = res.data.Data.Count || 0
          }
          this.returnGoodsTbloading = false
        }
      )
    },
    sortChange(sort) {
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getReturnGoodsList()
    },
    currentChange(val) {
      this.returnGoodsParams.PageIndex = val
      this.getReturnGoodsList()
    },
    sizeChange(val) {
      this.returnGoodsParams.PageIndex = 1
      this.returnGoodsParams.PageSize = val
      this.getReturnGoodsList()
    },
    getEnums() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
    },
    showDetailDialog(goodsId) {
      this.goodDetailDialog = {
        goodsId: goodsId,
        visible: true
      }
    },
    cancelReturn() {
      this.$confirm('确定取消领货?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.push({
            path: '/depot/counter/index'
          })
        })
        .catch(() => { })
    }
  },
  created() {
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  components: {
    pagination,
    SelectGoods,
    MultiCodeEnter,
    goodDetail,
    PurchaseTake,
    appropIn
  }
}
</script>
<style lang="scss" scoped>
.count {
  padding-right: 10px;
  line-height: 30px;
  text-align: right;
  label {
    margin: 0 10px;
  }
  .num {
    font-size: 16px;
    font-weight: bold;
  }
}
.el-input-number {
  width: 100%;
}
</style>

