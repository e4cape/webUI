<template>
  <el-row class="content">
    <div class="panel">
      <div class="panel-hd">
        <el-tooltip effect="light" :content="detail.FilterNote" :disabled="detail.FilterNote && detail.FilterNote.length <= 50">
          <span class="title">盘点（{{ detail.WarehouseName ? '仓库：' + detail.WarehouseName + '，':'' }}范围：{{detail.FilterNote|| '全部'}}）</span>
        </el-tooltip>
      </div>
      <div class="panel-bd p-t-10">
        <div class="goods-wrapper">
          <div class="goods-left">
            <table class="goods-table" cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th>盘点位置</th>
                  <th>应盘</th>
                  <th>实盘</th>
                </tr>
              </thead>
              <tbody v-loading="orderDelfLoading">
                <tr v-for="(item, index) in orderDelfData" :key="index" :class="{active:item.DelfId === goodForm.DelfId}" @click="orderDelfSelect(item)">
                  <td>{{ item.ObjectType === GoodsCountOrderBasicObjectType.Company ? item.ShelfName : item.DeskName}}</td>
                  <td>{{item.Quantity1}}</td>
                  <td>{{item.Quantity2}}</td>
                </tr>
              </tbody>
            </table>
            <div class="toolsbar">
              <div class="count-bar">
                <span class="fl">
                  <b>盘点汇总</b>
                </span>
              </div>
              <div class="count-bar">
                <span class="fl">条码：{{detail.ItemQty}}</span>
              </div>
              <div class="count-bar">
                <span class="fl">应盘：{{detail.Quantity1}}</span>
                <span class="fr">实盘：{{detail.Quantity2}}</span>
              </div>
              <div class="count-bar">
                <span class="fl">盘亏：{{detail.Quantity3}}</span>
                <span class="fr">盘盈：{{detail.Quantity4}}</span>
              </div>
            </div>
          </div>
          <div class="goods-right">
            <div class="panel">
              <div class="panel-hd">
                <span class="title">{{orderDelfDetail.DeskName || orderDelfDetail.ShelfName}}</span>
              </div>
              <div class="panel-bd">
                <div class="handle-box">
                  <div class="handle-left">
                    <el-row :gutter="10">
                      <el-col :span="8">
                        <el-input class="code" v-model="code" placeholder="录入/扫描条码" :maxlength="50" @keyup.enter.native="codeEnter" name="code"></el-input>
                      </el-col>
                      <el-col :span="16" class="tl">
                        <el-button type="primary" @click="multiCodeVisible=true" name="btnMultiCode">批量录入</el-button>
                        <el-button type="primary" @click="takingAmendVisible=true" name="btnTakingAmend">修正实盘数量</el-button>
                        <el-button type="text" @click="abnormalCodeVisible = true" icon="el-icon-info" style="color:#da0000" v-if="orderTipsData.length">{{orderTipsData.length}}</el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="handle-right">
                    <el-row type="flex" class="table-total-items">
                      <el-col class="table-total-item">
                        <div>{{orderDelfDetail.ItemQty}}</div>
                        <div>条码</div>
                      </el-col>
                      <el-col class="table-total-item">
                        <div>{{orderDelfDetail.Quantity1}}</div>
                        <div>应盘</div>
                      </el-col>
                      <el-col class="table-total-item">
                        <div>{{orderDelfDetail.Quantity2}}</div>
                        <div>实盘</div>
                      </el-col>
                      <el-col class="table-total-item">
                        <div>{{orderDelfDetail.Quantity3}}</div>
                        <div>盘亏</div>
                      </el-col>
                      <el-col class="table-total-item">
                        <div>{{orderDelfDetail.Quantity4}}</div>
                        <div>盘盈</div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <div class="p-x-10">
                  <!-- Data Table -->
                  <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" class="m-b-10">
                    <el-table-column prop="BarCode" label="条码" min-width="120" show-overflow-tooltip fixed>
                      <template slot-scope="scope">
                        <span @click="showDetailDialog(scope.row.GoodsId)" class="init-button-text" name="btnShowDetail">{{scope.row.BarCode}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="StyleCode" label="款号" min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="GoodsName" label="货品名称" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="MaterialType" label="材质" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="CategoryType" label="品类" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="GoldType" label="成色" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="Weight" label="货重（g）" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="GoldWeight" label="净金重（g）" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="Quantity1" label="应盘数量" min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="Quantity2" label="实盘数量" min-width="80" show-overflow-tooltip fixed="right">
                      <template slot-scope="scope">
                        <el-input
                          v-model="scope.row.Quantity2"
                          @input="selectCurrentRow(scope.row)"
                          @keyup.enter.native="updateQty(scope.row)"
                          @change="selectCurrentRow(scope.row), updateQty(scope.row)"
                          @keyup.native="scope.row.Quantity2 = $root.toFixed(scope.row.Quantity2, 0)"
                          name="Quantity2"
                          :maxlength="8"
                        ></el-input>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!-- Pagination -->
                  <pagination :pg="goodForm.PageIndex" :size="goodForm.PageSize" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-button type="primary" @click="closeTaking" :loading="$store.getters.is_loading" name="btnCloseTaking">{{enableSubmit ? '结束盘点' : '保存'}}</el-button>
      <!-- <el-button type="primary"  @click="takingCancel">取消</el-button> -->
      <el-button type="primary" @click="takingReset($event)" name="takingReset">重新盘点</el-button>
      <el-button @click="$router.back()" name="back">返回</el-button>
    </div>
    <!-- dialog 结束盘点 -->
    <taking-close :visible.sync="takingCloseVisible" :countId="goodForm.CountId" :delfId="goodForm.DelfId" :data="detail" @listenTakingClose="$router.push('/depot/goodstaking/index')"></taking-close>
    <!-- End 结束盘点 -->

    <!-- dialog 修正盘点数量 -->
    <taking-amend :visible.sync="takingAmendVisible" :countId="goodForm.CountId" :delfId="goodForm.DelfId" @listenTakingAmend="listenTakingAmend"></taking-amend>
    <!-- End 修正盘点数量 -->

    <!-- dialog 批量录入条码 -->
    <multi-code-enter :visible.sync="multiCodeVisible" @listenMultiCodeEnter="listenMultiCodeEnter"></multi-code-enter>
    <!-- End 批量录入条码 -->

    <!-- dialog 货品详情 -->
    <good-detail :visible.sync="goodDetailDialog.visible" :goodsId="goodDetailDialog.goodsId"></good-detail>
    <!-- end 货品详情-->
    <el-dialog title="异常条码" :visible.sync="abnormalCodeVisible">
      <p class="m-b-10">以下一码一货的条码不在本盘点位置，自动为您盘点到对应的位置中：</p>
      <el-table>
        <el-table-column label="条码"></el-table-column>
        <el-table-column label="款号"></el-table-column>
        <el-table-column label="货品名称"></el-table-column>
        <el-table-column label="实盘位置"></el-table-column>
        <el-table-column label="应盘位置"></el-table-column>
      </el-table>
    </el-dialog>
  </el-row>
</template>

<script>
import {
  STOCKING_API_GOODS_COUNT_ORDER_BASIC_GET,
  STOCKING_API_GOODS_COUNT_ORDER_DELF_GETS,
  STOCKING_API_GOODS_COUNT_ORDER_ITEM_GETS,
  STOCKING_API_GOODS_COUNT_ORDER_ITEM_CREATE,
  STOCKING_API_GOODS_COUNT_ORDER_BASIC_RETAKE,
  STOCKING_API_GOODS_COUNT_ORDER_ITEM_UPDATE,
  STOCKING_API_GOODS_COUNT_ORDER_ITEM_GETSTIPS
} from '@/apis/stocking.js'
import { YNStatus } from '@/enums/common.js'
import { GoodsCountOrderBasicObjectType } from '@/enums/stocking.js'

import pagination from '@/components/pagination.vue'
import MultiCodeEnter from '@/components/erp/multiCodeEnter'
import goodDetail from '@/components/erp/goodDetail'
import takingClose from './takingClose'
import takingAmend from './takingAmend'
export default {
  data() {
    return {
      GoodsCountOrderBasicObjectType,
      abnormalCodeVisible: false,
      detail: {},
      code: '',
      data: [],
      total: 0,
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      takingCloseVisible: false, // 结束盘点对话框
      multiCodeVisible: false, // 批量录入条码弹窗
      takingAmendVisible: false, // 结束盘点对话框
      enableSubmit: true, // 控制请求一个一个提交
      orderDelfData: [],
      orderDelfDetail: {},
      orderDelfLoading: false,
      goodForm: {
        DelfId: 0,
        CountId: 0,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      orderTipsData: [],
      curRow: {}
    }
  },
  computed: {
    arroundType() {
      let result = []
      let arr = []
      if (this.detail.MaterialTypes) {
        arr = this.detail.MaterialTypes.split(',')
        arr.forEach(a => {
          result.push(this.$store.getters.materialType.Types[a])
        })
      }
      if (this.detail.CategoryTypes) {
        arr = this.detail.CategoryTypes.split(',')
        arr.forEach(a => {
          result.push(this.$store.getters.categoryType.Types[a])
        })
      }
      if (this.detail.GoldTypes) {
        let arr = this.detail.GoldTypes.split(',')
        arr.forEach(a => {
          result.push(this.$store.getters.goldType.Types[a])
        })
      }
      return result.join(',') || '全部'
    }
  },
  methods: {
    orderDelfSelect(item) { // 选择货架
      this.goodForm.DelfId = item.DelfId
      this.orderDelfDetail = item
      this.getGoods()
      this.getOrderTips()
    },
    codeEnter() {
      if (!this.code) {
        this.$message.warning('请输入货品条码')
        return
      }
      this.addGood([
        {
          BarCode: this.code,
          Quantity: 1
        }
      ])
    },
    listenMultiCodeEnter(codes) {
      if (codes.length) {
        this.addGood(codes)
      } else {
        this.multiCodeVisible = false
      }
    },
    addGood(items) { // 录入
      STOCKING_API_GOODS_COUNT_ORDER_ITEM_CREATE({
        CountId: parseInt(this.goodForm.CountId),
        DelfId: this.goodForm.DelfId,
        Items: items
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
            type: 'success'
          })

          this.getGoods()
          this.getDetail()
          this.getOrderTips()
          this.getOrderDelfData().then(() => {
            this.orderDelfDetail = this.orderDelfData.find(
              item => item.DelfId === this.goodForm.DelfId
            )
          })
          this.code = ''
          this.multiCodeVisible = false
        } else {
          this.$alert(res.data.Message, '提示', {
            confirmButtonText: '确定',
            type: 'error'
          })
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    listenTakingAmend() {
      // 修正盘点数量
      this.getDetail()
      this.getOrderTips()
      this.getGoods()
      this.getOrderDelfData().then(() => {
        this.orderDelfDetail = this.orderDelfData.find(
          item => item.DelfId === this.goodForm.DelfId
        )
      })
    },
    selectCurrentRow(row) {
      this.enableSubmit = false
      this.curRow = row
    },
    updateQty(row) {
      // 更新
      this.$store.commit('SET_BTN_LOADING', true)
      if (!this.enableSubmit) {
        STOCKING_API_GOODS_COUNT_ORDER_ITEM_UPDATE({
          DelfId: this.goodForm.DelfId,
          CountId: parseInt(this.goodForm.CountId),
          ItemId: row.ItemId,
          Quantity2: parseInt(row.Quantity2)
        }).then(res => {
          this.$store.commit('SET_BTN_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.getDetail()
            this.getOrderDelfData().then(() => {
              this.orderDelfDetail = this.orderDelfData.find(
                item => item.DelfId === this.goodForm.DelfId
              )
            })
            this.enableSubmit = true
            this.getOrderTips()
          }

        })
      }
    },
    closeTaking() {
      // 结束盘点
      if (this.enableSubmit) {
        this.takingCloseVisible = true
      } else {
        this.updateQty(this.curRow)
      }
    },
    takingReset($event) { // 重新盘点
      $event.currentTarget.blur()
      this.$confirm(
        '重新盘点，所有的盘点数量将清空，确定要重新盘点？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          STOCKING_API_GOODS_COUNT_ORDER_BASIC_RETAKE({
            CountId: this.goodForm.CountId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: res.data.Message,
                type: 'success'
              })
              this.init()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重新盘点'
          })
        })
    },

    init() {
      this.goodForm.CountId = parseInt(this.$route.query.id)
      if (!this.goodForm.CountId) {
        this.dataError()
      } else {
        this.getDetail()
        this.getOrderTips()
        this.getOrderDelfData().then(() => {
          this.goodForm.DelfId = this.orderDelfData[0].DelfId
          this.orderDelfDetail = this.orderDelfData[0]
          this.getGoods()
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
    getDetail() { // 盘点单明细
      this.$store.commit('SET_FULL_LOADING', true)
      STOCKING_API_GOODS_COUNT_ORDER_BASIC_GET({
        CountId: this.goodForm.CountId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
        this.$store.commit('SET_FULL_LOADING', false)
      })
    },
    getOrderTips() {
      // 获取提示
      STOCKING_API_GOODS_COUNT_ORDER_ITEM_GETSTIPS({
        CountId: this.goodForm.CountId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.orderTipsData = res.data.Data.Rows || []
        }
      })
    },
    getOrderDelfData() {
      // 成品盘点单位置明细
      this.orderDelfLoading = true
      return STOCKING_API_GOODS_COUNT_ORDER_DELF_GETS({
        CountId: this.goodForm.CountId
      }).then(res => {
        this.orderDelfLoading = false
        if (res.data.Code === 'CORRECT') {
          this.orderDelfData = res.data.Data.Rows || []
        }
      })
    },
    getGoods() { // 货品明细
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_GOODS_COUNT_ORDER_ITEM_GETS(this.goodForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
          console.log(this.data)
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
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

    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
    },

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
    showDetailDialog(goodsId) {
      this.goodDetailDialog = {
        goodsId: goodsId,
        visible: true
      }
    }
  },
  created() {
    this.getStoreAllType()
  },
  mounted() {
    this.init()
  },
  components: {
    pagination,
    MultiCodeEnter,
    goodDetail,
    takingClose,
    takingAmend
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/erp/purchase.scss';
</style>
<style lang="scss" scoped>
.goods-wrapper {
  font-size: 12px;
  .goods-left {
    flex: 1;
    .goods-table {
      margin-bottom: 131px;
      tr {
        th,
        td {
          padding: 0 8px;
          width: auto;
          &:first-child {
            width: 60%;
          }
        }
      }
    }
    .toolsbar {
      height: 131px;
      .count-bar {
        border-bottom: 1px solid #ddd;
        &:last-child {
          border-bottom: 0 none;
        }
        b {
          color: #333;
        }
      }
    }
  }
  .goods-right {
    width: 1%;
    flex: 3;
    .panel-bd {
      padding: 0 !important;
      .handle-box {
        padding: 10px 10px 0 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        .handle-left {
          padding-bottom: 10px;
          display: flex;
          align-items: cneter;
          flex: 1;
          width: 1%;
          min-width: 400px;
        }
        .handle-right {
          padding-bottom: 10px;
          .detail-info-num-item:first-child {
            margin-left: 0;
          }
        }
      }
    }
  }
}
.count {
  padding-right: 15px;
  line-height: 36px;
  text-align: right;
  font-size: 14px;
  white-space: nowrap;
}
.el-input-number {
  width: 100%;
}
.el-table tr.info-row > td,
.el-table tr.info-row {
  background-color: red !important;
}
.table-total-items {
  .table-total-item {
    padding: 0 5px;
    text-align: center;
    div:first-child {
      padding-bottom: 5px;
      font-weight: bold;
    }
  }
}
</style>
