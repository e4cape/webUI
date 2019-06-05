<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <!-- <el-tooltip :content="'盘点（位置：'+(detail.DeskName || '仓库') + '，范围：' + arroundType +'）'" v-if="arroundType.length > 50" placement="bottom" effect="light">
          <span class="title">盘点（位置：{{detail.DeskName || '仓库'}}，范围：{{arroundType}}）</span>
        </el-tooltip>
        <span class="title" v-else>盘点（位置：{{detail.DeskName || '仓库'}}，范围：{{arroundType}}）</span>-->
        <span class="title">查看盘点单</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="3" class="state-img">
                  <img src="@/assets/images/taking.png" v-if="detail.State === GoodsCountOrderBasicState.Taking">
                  <img src="@/assets/images/audited.png" v-if="detail.State === GoodsCountOrderBasicState.Finish">
                  <img src="@/assets/images/abandon.png" v-if="detail.State === GoodsCountOrderBasicState.Cancel">
                  <div>{{GoodsCountOrderBasicState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.CountCode}}</td>
                <td class="tit">创建：</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime|filterDateMinutes}}</td>
                <td class="tit">结束：</td>
                <td v-if="detail.State !== GoodsCountOrderBasicState.Taking">{{ detail.CheckUser + ' '}}{{ detail.CheckTime|filterDateMinutes}}</td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">盘点位置：</td>
                <td>{{(detail.WarehouseName ? detail.WarehouseName + ' > ' : '') + detail.PositionNote}}</td>
                <td class="tit">盘点范围：</td>
                <td>{{detail.FilterNote||'全部'}}</td>
                <td class="tit"></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
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
              <tbody>
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
                <div class="p-10">
                  <el-row type="flex" justify="space-between" align="middle">
                    <el-col>
                      <span class="title">货品列表</span>
                      <el-button @click="abnormalCodeVisible = true" type="text" icon="el-icon-info" style="color:#da0000" v-if="orderTipsData.length">{{orderTipsData.length}}</el-button>
                    </el-col>
                    <el-col>
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
                    </el-col>
                  </el-row>
                </div>
                <div class="p-x-10">
                  <el-table :data="data" v-loading="$store.getters.tb_loading" class="m-b-10">
                    <el-table-column prop="BarCode" label="条码" min-width="120" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span @click="showDetailDialog(scope.row.GoodsId)" class="init-button-text" name="btnShowDetail">{{scope.row.BarCode}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="StyleCode" label="款号" min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="GoodsName" label="货品名称" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="MaterialType" label="材质" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="CategoryType" label="品类" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="GoldType" label="成色" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="Weight" label="货重（g）" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="GoldWeight" label="净金重（g）" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="Quantity1" label="应盘数量" min-width="80" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="Quantity2" label="实盘数量" min-width="80" show-overflow-tooltip></el-table-column>
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
    <el-row class="buttons">
      <el-col>
        <template v-if="detail.State === GoodsCountOrderBasicState.Taking">
          <router-link :to="{path:'/depot/goodstaking/edit',query:{id:goodForm.CountId}}" name="btnTakingEdit">
            <el-button type="primary">继续盘点</el-button>
          </router-link>
          <el-button @click="takingCancel($event)" name="btnTakingCancel">取消盘点</el-button>
        </template>
        <el-button type="primary" @click="takingLogVisible = true" v-if="detail.State === GoodsCountOrderBasicState.Finish" name="btnReport">盘点报告</el-button>
         <el-button @click="printDialog = true" name="print">打印</el-button>
        <el-button @click="$router.back()" name="back">返回</el-button>
        <!-- <el-button @click="printDialog = true" name="btnPrint">打印</el-button> -->
      </el-col>
      <!-- <el-col :span="13">
        <span class="red tr">
          注：“应盘数量”是创建盘点单时的账面库存数量，盘点的过程中出入库不改变该数量。
        </span>
      </el-col>-->
    </el-row>
    <!-- @module 盘点报告 -->
    <taking-log :visible.sync="takingLogVisible" :data="detail"></taking-log>
    <!-- End 盘点报告 -->

    <!-- dialog 货品详情 -->
    <good-detail :visible.sync="goodDetailDialog.visible" :goodsId="goodDetailDialog.goodsId"></good-detail>
    <!-- end 货品详情-->

    <print-order :visible.sync="printDialog" :conditions="encodeURIComponent(JSON.stringify({OrderId: detail.CountId }))" :printingType="SettingPrintingType.StockingCloudGoodsCountOrderBasic"></print-order>

    <el-dialog title="异常条码" :visible.sync="abnormalCodeVisible">
      <p class="m-b-10">以下一码一货的条码不在本盘点位置，自动为您盘点到对应的位置中：</p>
      <el-table :data="orderTipsData">
        <el-table-column prop="BarCode" label="条码"></el-table-column>
        <el-table-column prop="StyleCode" label="款号"></el-table-column>
        <el-table-column prop="GoodsName" label="货品名称"></el-table-column>
        <el-table-column prop="Note" label="实盘位置"></el-table-column>
        <el-table-column prop="Note" label="应盘位置"></el-table-column>
      </el-table>
      <span slot="footer">
        <el-button @click="abnormalCodeVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { SettingPrintingType } from '@/enums/merchant.js'
import { CharacterType, YNStatus } from '@/enums/common.js'
import {
  GoodsCountOrderBasicState,
  GoodsCountOrderBasicObjectType
} from '@/enums/stocking.js'
import {
  STOCKING_API_GOODS_COUNT_ORDER_BASIC_GET,
  STOCKING_API_GOODS_COUNT_ORDER_DELF_GETS,
  STOCKING_API_GOODS_COUNT_ORDER_ITEM_GETS,
  STOCKING_API_GOODS_COUNT_ORDER_BASIC_CANCEL,
  STOCKING_API_GOODS_COUNT_ORDER_ITEM_GETSTIPS
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
import takingLog from './takingLog'
import goodDetail from '@/components/erp/goodDetail'
import printOrder from '@/components/erp/printOrder'

export default {
  data() {
    return {
      CharacterType,
      SettingPrintingType,
      GoodsCountOrderBasicState,
      GoodsCountOrderBasicObjectType,
      abnormalCodeVisible: false,
      detail: {},
      data: [],
      total: 0,
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      takingLogVisible: false, // 盘点报告弹窗
      printDialog: false,
      orderDelfData: [],
      orderDelfDetail: {},
      goodForm: {
        DelfId: '',
        CountId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      orderTipsData: [],
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    },
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
    getOrderTips() {
      STOCKING_API_GOODS_COUNT_ORDER_ITEM_GETSTIPS({
        CountId: this.goodForm.CountId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.orderTipsData = res.data.Data.Rows || 0
        }
      })
    },
    getOrderDelfData() {
      // 成品盘点单位置明细
      return STOCKING_API_GOODS_COUNT_ORDER_DELF_GETS({
        CountId: this.goodForm.CountId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.orderDelfData = res.data.Data.Rows
          this.goodForm.DelfId = this.orderDelfData[0].DelfId
          this.orderDelfDetail = this.orderDelfData[0]
        }
      })
    },
    orderDelfSelect(item) {
      this.goodForm.DelfId = item.DelfId
      this.orderDelfDetail = item
      this.getGoods()
      this.getOrderTips()
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
    init() {
      let query = this.$route.query
      this.goodForm.PageIndex = query.PageIndex || '1'
      this.goodForm.PageSize = query.PageSize || '20'
      this.goodForm.CountId = query.id
      if (!this.goodForm.CountId) {
        this.dataError()
      } else {
        this.getDetail()
        this.getOrderTips()
        this.getOrderDelfData().then(() => {
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
    getDetail() {
      STOCKING_API_GOODS_COUNT_ORDER_BASIC_GET({
        CountId: this.goodForm.CountId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_GOODS_COUNT_ORDER_ITEM_GETS(this.goodForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    listenLogDialog() {
      this.takingLogVisible = false
    },
    takingCancel($event) {
      $event.currentTarget.blur()
      this.$confirm('确定取消盘点？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_GOODS_COUNT_ORDER_BASIC_CANCEL({
            CountId: this.goodForm.CountId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.init()
            }
          })
        })
        .catch(() => { })
    },
    showDetailDialog(goodsId) {
      this.goodDetailDialog = {
        goodsId: goodsId,
        visible: true
      }
    },
    listenGoodDetailDialog() {
      this.goodDetailDialog.visible = false
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
    },
    pageChange(val) {
      this.goodForm.PageIndex = val
      this.getGoods()
    },
    pageSizeChange(val) {
      this.goodForm.PageIndex = 1
      this.goodForm.PageSize = val
      this.getGoods()
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
    takingLog,
    goodDetail,
    printOrder
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/erp/purchase.scss';
</style>
<style lang="scss" scoped>
// .goods-table tbody {
//   display: block;
//   height: 500px;
//   overflow-y: auto;
//   overflow-x: visible;
// }
// .goods-table tbody::-webkit-scrollbar {
//     display: none; // 隐藏滚动条
// }
// .goods-table thead,
// .goods-table tbody tr {
//   display: table;
//   width: 100%;
//   table-layout: fixed;
// }

// .goods-table thead, {
//   width: calc(100% - 16px);

// }

.goods-wrapper {
  font-size: 12px;
  .goods-left {
    padding-bottom: 0;
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
    .panel-bd {
      padding: 0;
    }
    .panel-bd {
      .title {
        font-weight: bold;
        color: #777;
        margin-left: 10px;
      }
      .table-total-items {
        .table-total-item {
          text-align: center;
          div:first-child {
            padding-bottom: 5px;
            font-weight: bold;
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
}
</style>
