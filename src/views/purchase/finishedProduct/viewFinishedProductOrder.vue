<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title fl">查看到货单（{{detail.KindTypeEv}}）</span>
        <el-button type="text" @click="$router.back(-1)" class="returnBack" >返回</el-button>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="6" colspan="1" class="state-img">
                  <img
                    src="@/assets/images/draft.png"
                    v-if="detail.State === orderBasicState.Draft"
                  >
                  <img
                    src="@/assets/images/auditing.png"
                    v-if="detail.State === orderBasicState.Wait"
                  >
                  <img
                    src="@/assets/images/audited.png"
                    v-if="detail.State === orderBasicState.Audit"
                  >
                  <img
                    src="@/assets/images/auditBack.png"
                    v-if="detail.State === orderBasicState.Reject"
                  >
                  <img
                    src="@/assets/images/abandon.png"
                    v-if="detail.State === orderBasicState.Abandon || detail.State === orderBasicState.Cancel"
                  >
                  <div>{{orderBasicState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.ArriveCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateTime}}</td>
                <td class="tit">审核</td>
                <td v-if="detail.State === orderBasicState.Audit || detail.State === orderBasicState.Reject">{{detail.CheckUser}} {{detail.CheckTime | filterDateTime}}</td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">供应商</td>
                <td>{{detail.PartnerName}}</td>
                <td class="tit">采购员</td>
                <td>{{detail.ChargeUser}}</td>
                <td class="tit">业务日期</td>
                <td>{{detail.ActualDate | filterDate}}</td>
              </tr>
              <tr>
                <!-- <td class="tit">入库位置</td>
                <td>{{detail.WarehouseName}}>{{detail.ShelfName}}</td> -->
                <td class="tit">进货方式</td>
                <td>{{purchaseType.Types[detail.PurchaseType]}}</td>
                <td class="tit">货品类别</td>
                <td>{{financeTypes.Types[detail.FinanceType]}}</td>
                <td class="tit">订货单号</td>
                <td>{{detail.PurchaseCode}}</td>
              </tr>
              <tr>
                
                <td class="tit">送货单号</td>
                <td>{{detail.ExpressCode}}</td>
                <td class="tit">应付款</td>
                <td colspan="3">{{$root.toFloat(detail.Preprice)}}</td>
              </tr>
              <tr>
                <td class="tit">备注</td>
                <td class="note" colspan="5">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="checkPage-hd">
          <el-row>
            <el-col>
              <i class="icon-list"></i>
              <span class="title">货品列表</span>
            </el-col>
          </el-row>
        </div>
        <div class="goods-wrapper">
          <div class="goods-left">
            <!-- 货品列表 -->
            <table class="goods-table" cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>条码</th>
                  <th>货品名称</th>
                  <th>数量</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  name="rowSelect"
                  v-for="(item, index) in goodsData"
                  :key="item.index"
                  :class="{active:item.ItemId == itemId}"
                  @click="rowSelect(item.GoodsId, item.ItemId)"
                >
                  <td>{{indexTotalCount - indexPageSize * (indexPageIndex - 1) - index}}</td>
                  <td :title="item.BarCode">{{item.BarCode}}</td>
                  <td :title="item.GoodsName">{{item.GoodsName}}</td>
                  <td>{{item.Quantity}}</td>
                </tr>
              </tbody>
            </table>
            <!-- 工具栏 -->
            <div class="toolsbar" style="height: 64px;">
              <div class="myPagination-bar">
                <el-select filterable v-model="pageSize" placeholder="20" name="pageSize">
                  <el-option v-for="(item, index) in paginationSizes" :key="index" :value="item"></el-option>
                </el-select>
                <div class="pagination-controller">
                  <button
                    name="btnPrev"
                    class="prev-btn"
                    @click="prevPage"
                    :disabled="pageIndex === 1"
                    :class="{'isDisabled': pageIndex === 1}"
                  >
                    <i class="el-icon-arrow-left"></i>
                  </button>
                  <span class="current-page">{{pageIndex}}/{{pages}}</span>
                  <button
                    name="btnNext"
                    class="next-btn"
                    @click="nextPage"
                    :disabled="pageIndex === pages"
                    :class="{'isDisabled': pageIndex === pages}"
                  >
                    <i class="el-icon-arrow-right"></i>
                  </button>
                </div>
                <span class="total">共{{totalCount}}条</span>
              </div>
              <div class="count-bar">
                <span class="fl">数量合计：{{detail.ArriveQty}}</span>
                <span class="fr">
                  成本合计：
                  <b>￥{{$root.toFloat(detail.CostPrice)}}</b>
                </span>
              </div>
            </div>
          </div>
          <div class="goods-right">
            <!-- 货品详情 -->
            <div class="panel">
              <div class="panel-hd">
                <span class="title">货品详情</span>
              </div>
              <div class="panel-bd">
                <goods-details v-if="itemId && itemId != ''" :itemId="itemId" :apis="apis" :option="goodsOption"></goods-details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <template
        v-if="(detail.State === orderBasicState.Reject || detail.State === orderBasicState.Draft)"
      >
        <router-link
          :to="{path:'/purchase/finishedProduct/editFinishedProductOrder',query:{id: detail.ArriveId}}"
          name="btnEdit"
        >
          <el-button type="primary">编辑</el-button>
        </router-link>
        <el-button @click="openObsolete" name="btnAbandon">作废</el-button>
      </template>
      <el-button
        type="primary"
        v-if="detail.State === orderBasicState.Wait"
        name="btnAudit"
        @click="showAuditDialog"
      >审核</el-button>
      <el-button
        @click="openCancelReview"
        v-if="detail.State === orderBasicState.Audit"
        name="btnCancelAudit"
      >取消审核</el-button>
      <el-button style="width:120px;" name="btnDownloadData" @click="downLoadGoods">导出货品信息</el-button>
      <!-- <el-button @click="printDialog = true" name="btnPrint">打印</el-button> -->
      <el-button name="btnOperation" @click="showOperationRecords = true">操作日志</el-button>
    </div>
    <!-- @module 操作记录 -->
    <el-dialog title="操作日志" :visible.sync="showOperationRecords" width="640px">
      <el-table :data="detail.Logs">
        <el-table-column property="CheckTime" label="操作时间" min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.CheckTime | filterDateTime}}
          </template>
        </el-table-column>
        <el-table-column property="CheckUser" label="操作人" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column property="CheckState" label="操作类型" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            {{orderBasicState.Types[scope.row.CheckState]}}
          </template>
        </el-table-column>
        <el-table-column property="CheckNote" label="备注" min-width="150" show-overflow-tooltip></el-table-column>
      </el-table>
    </el-dialog>
    <!-- End 操作记录 -->
    <!-- 审核 -->
    <review-Dialog
      title="审核"
      :auditDialog="auditDialog"
      :data="reviewData"
      v-if="auditDialog"
      @confirmClick="confirmAudit"
      @cancelClick="cancelAudit"
    ></review-Dialog>
    <!-- 取消审核 -->
    <cancel-Review
      :visibleCan="visibleCan"
      :data="reviewData"
      v-if="visibleCan"
      @confirmCancel="cancelConfirm"
      @visbleColse="cancelColse"
    ></cancel-Review>
    <!-- 作废 -->
    <obsolete
      v-if="obsoleteVisble"
      @visbleColse="visbleColse"
      @confirmObsolete="confirmObsolete"
      :data="reviewData"
      :visibleObs="obsoleteVisble"
    ></obsolete>
  </div>
</template>

<script>
import {
  GoodsArriveOrderBasicState,
  FinanceType,
  SettingCustomizedFieldOrderType,
  SettingCustomizedFieldLargeType
} from '@/enums/stocking.js'
import { CharacterType, PurchaseType, YNStatus } from '@/enums/common.js'
import {
  STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_EXPORT,
  STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_GET,
  STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_GETS,
  STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_GET,
  STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_ABANDON,
  STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_CANCEL,
  STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_AUDIT,
  STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_REJECT
} from '@/apis/stocking.js'
import goodsTable from '@/components/purchase/viewGoodTable'
import goodsDetails from '@/components/purchase/goodsDetails'
import reviewDialog from '@/components/purchase/reviewDialog'
import obsolete from '@/components/purchase/obsolete'
import cancelReview from '@/components/purchase/cancelReview'
import pagination from '@/components/pagination'

export default {
  data() {
    return {
      apis: STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_GET,
      characterTypes: CharacterType,
      goodsData: [], // 货品数据
      orderBasicState: GoodsArriveOrderBasicState,
      purchaseType: PurchaseType,
      financeTypes: FinanceType,
      paginationSizes: [10, 15, 20], // 分页数据条数数组
      pageSize: 20, // 分页数据条数
      pageIndex: 1, // 当前页面位置
      totalCount: 0, // 总数据条数
      indexPageSize: 20, // 列表序号，分页数据条数
      indexPageIndex: 1, // 列表序号，当前页面位置
      indexTotalCount: 0, // 列表序号，总数据条数
      purchaseId: '',
      itemId: '',
      detail: {
        PurchaseId: '',
        SupplierId: '',
        ArrivalCode: '',
        FinanceType: '',
        Note: ''
      },
      goodsId: '', // 选中的货品id
      printDialog: false,
      tabTable: 'goods',
      auditDialog: false, // 审核弹窗
      arrivalVisible: false, // 到货入库弹窗
      obsoleteVisble: false, // 作废弹窗
      visibleCan: false, // 取消审核弹窗
      reviewData: [], // 审核数据
      showOperationRecords: false, // 操作日志
      goodsOption: {
        OrderType:
          SettingCustomizedFieldOrderType.StockingCloudGoodsArriveOrderBasic,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        SmallType: 0,
        KindTypeEk: 0
      },
      fieldData: [], // 自定义列
    }
  },
  computed: {
    pages() {
      return (
        (this.totalCount % this.pageSize === 0
          ? this.totalCount / this.pageSize
          : parseInt(this.totalCount / this.pageSize) + 1) || 1
      )
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.purchaseId = Number(query.id)
      if (!this.purchaseId) {
        this.dataError()
      } else {
        this.getDetail()
      }
    },
    dataError(msg) {
      this.$confirm(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },
    getDetail() {
      STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_GET({
        ArriveId: this.purchaseId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.goodsOption.KindTypeEk = res.data.Data.KindTypeEk
          this.detail.Logs = JSON.parse(res.data.Data.Logs)
          this.getGoods()
        }
      })
    },
    getGoods() {
      STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_GETS({
        ArriveId: this.purchaseId,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.totalCount = res.data.Data.Count || 0
          this.goodsId =
            this.goodsData && this.goodsData.length && this.goodsData[0].GoodsId
          this.itemId =
            this.goodsData && this.goodsData.length && this.goodsData[0].ItemId
          this.indexPageSize = this.pageSize
          this.indexPageIndex = this.pageIndex
          this.indexTotalCount = this.totalCount
        } else {
          this.$message.error(res.data.Message)
          this.goodsData = []
        }
      })
    },
    currentChange(val) {
      // 切换当前页
      this.pageIndex = val
      this.getGoods()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.pageSize = val
      this.pageIndex = 1
      this.getGoods()
    },
    rowSelect(goodsId, itemId) {
      this.goodsId = goodsId
      this.itemId = itemId
    },
    prevPage() {
      this.pageIndex-=1
    },
    nextPage() {
      this.pageIndex+=1
    },
    // 打开审核和批量审核弹窗
    showAuditDialog() {
      this.reviewData = this.detail
        ? [{ ...this.detail, orderNumber: this.detail.ArriveCode }]
        : []
      this.auditDialog = true
    },
    // 打开作废
    openObsolete() {
      this.reviewData = [
        { ...this.detail, orderNumber: this.detail.ArriveCode }
      ]
      this.obsoleteVisble = true
    },
    // 作废关闭
    visbleColse() {
      this.obsoleteVisble = false
    },
    // 作废确认
    confirmObsolete(note) {
      const para = {
        ArriveId: this.reviewData[0].ArriveId,
        CheckNote: note
      }
      STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_ABANDON(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '作废成功',
            type: 'success'
          })
          this.obsoleteVisble = false
          this.reviewData = []
          this.getDetail()
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    // 打开取消审核
    openCancelReview() {
      this.reviewData = [
        { ...this.detail, orderNumber: this.detail.ArriveCode }
      ]
      this.visibleCan = true
    },
    // 取消审核确定
    cancelConfirm(data) {
      const para = {
        ArriveId: Number(this.reviewData[0].ArriveId),
        CheckNote: data
      }

      STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_CANCEL(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '取消审核成功',
            type: 'success'
          })
          this.cancelColse()
          this.getDetail()
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    // 取消审核关闭
    cancelColse() {
      this.reviewData = []
      this.visibleCan = false
    },
    // 审核确定
    confirmAudit(data) {
      const para = {
        ArriveId: Number(this.reviewData[0].ArriveId),
        CheckNote: data.auditReson
      }
      if (YNStatus.Yes === data.auditType) {
        STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_AUDIT(para).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: '审核通过成功',
              type: 'success'
            })
            this.cancelAudit()
            this.getDetail()
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      } else if (YNStatus.No === data.auditType) {
        STOCKING_API_GOODS_ARRIVE_ORDER_BASIC_REJECT(para).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: '审核退回成功',
              type: 'success'
            })
            this.cancelAudit()
            this.getDetail()
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }
    },
    cancelAudit(data) {
      this.reviewData = []
      this.reviewTitle = ''
      this.auditDialog = data
    },
    downLoadGoods() {
      if(this.goodsData.length) {
        STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_EXPORT({
          ArriveId: this.purchaseId
        }).then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            if (res.data.Data) {
              setTimeout(() => {
                window.open(this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data)
              }, 1000)
            }
          }
          this.goodsExportVisible = false
        })
      } else {
        this.$message.error('请先添加货品信息')
      }
      
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    pageIndex: 'getGoods',
    pageSize() {
      this.pageIndex = 1
      this.getGoods()
    }
  },
  components: {
    goodsDetails,
    goodsTable,
    reviewDialog,
    obsolete,
    cancelReview,
    pagination
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/erp/purchase.scss';
</style>

<style lang="scss" scoped>
.import-purchase-dialog {
  .download-modflie {
    margin: 0 auto;
    padding: 10px 0;
    width: 360px;
    text-align: right;
    color: #20a0ff;
  }
  .el-dialog__body {
    padding: 10px 30px;
    .el-upload-dragger {
      margin: 0 0 20px;
    }
    .el-upload__tip {
      text-align: left;
    }
  }
}

.goods-wrapper .goods-left .toolsbar {
  height: 98px;
}
.goods-wrapper .goods-left .toolsbar .count-bar {
  border-bottom: 1px solid #ddd;
}
.goods-wrapper .goods-left .toolsbar .count-bar:nth-child(3) {
  border: none;
}
.returnBack {
  float: right;
  height: 40px;
  width: 40px;
}
</style>
