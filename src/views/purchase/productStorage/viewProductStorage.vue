<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title fl">查看成品进货入库（{{detail.KindTypeEv}}）</span>
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
                <td>{{detail.IntakeCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}} {{detail.CreateTime | filterDateTime}}</td>
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
                <td class="tit">进货方式</td>
                <td>{{purchaseType.Types[detail.PurchaseType]}}</td>
                <td class="tit">货品类别</td>
                <td :colspan="$store.getters.user_session.CharacterType === characterType.Company ? 1 : 3">{{financeType.Types[detail.FinanceType]}}</td>
                <td class="tit" v-if="$store.getters.user_session.CharacterType === characterType.Company">入库位置</td>
                <td v-if="$store.getters.user_session.CharacterType === characterType.Company">{{detail.WarehouseName}}>{{detail.ShelfName}}</td>
              </tr>
              <tr>
                <!-- <td class="tit">订货单号</td>
                <td>{{detail.previousCode}}</td> -->
                <td class="tit">送货单号</td>
                <td>{{detail.ExpressCode}}</td>
                <td class="tit">应付款</td>
                <td :colspan="3">{{$root.toFloat(detail.Preprice)}}</td>
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
        <div
          class="goods-wrapper"
          v-loading="$store.getters.tb_loading"
          element-loading-text="拼命加载中"
        >
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
            <div class="toolsbar">
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
                <span class="fl">数量合计：{{detail.IntakeQty}}</span>
                <span class="fr">
                  成本合计：
                  <b>￥{{$root.toFloat(detail.CostPrice)}}</b>
                </span>
              </div>
              <div class="count-bar">
                <span class="fl">金重合计：{{$root.toFloat(detail.GoldWeight, 3)}}</span>
                <span class="fr">标签价合计：<b>{{$root.toFloat(detail.LabelPrice)}}</b></span>
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
      <el-button
        name="btnShowDetail"
        type="primary"
        v-if="orderBasicState.Draft == detail.State || orderBasicState.Reject == detail.State"
        @click="linkEditPage"
      >编辑</el-button>
      <el-button
        name="btnShowDetail"
        type="primary"
        v-if="orderBasicState.Draft == detail.State || orderBasicState.Reject == detail.State"
        @click="openObsolete"
      >作废</el-button>
      <el-button
        name="btnShowDetail"
        type="primary"
        v-if="orderBasicState.Wait == detail.State"
        @click="showAuditDialog"
      >审核</el-button>
      <el-button
        name="btnShowDetail"
        type="primary"
        v-if="orderBasicState.Audit == detail.State"
        @click="openCancelReview"
      >取消审核</el-button>
      <el-button :loading="$store.getters.is_loading" name="orderSubmit" @click="exportGoodDetail">导出货品详情</el-button>
      <el-button
        name="btnPrintPrintOrdertrue"
        @click="printPrintOrder"
        :loading="$store.getters.is_loading"
      >打印</el-button>
      <!-- <el-button :loading="$store.getters.is_loading" name="printLabel" @click="toPrintLabel">打印标签</el-button> -->
      <el-button @click="$router.back(-1)">返回</el-button>
    </div>
    <!-- 审核 -->
    <review-Dialog
      v-if="auditDialog"
      :auditDialog="auditDialog"
      title="审核"
      :data="reviewData"
      @confirmClick="confirmAudit"
      @cancelClick="cancelAudit"
    ></review-Dialog>
    <!-- 作废 -->
    <obsolete
      v-if="obsoleteVisble"
      @visbleColse="visbleColse"
      @confirmObsolete="confirmObsolete"
      :data="reviewData"
      :visibleObs="obsoleteVisble"
    ></obsolete>
    <!-- 取消审核 -->
    <cancel-Review
      :visibleCan="visibleCan"
      :data="reviewData"
      v-if="visibleCan"
      @confirmCancel="cancelConfirm"
      @visbleColse="cancelColse"
    ></cancel-Review>
    <!-- @module Dialog·打印 -->
    <print-order
      title="打印"
      v-if="printDialog"
      :visible.sync="printDialog"
      :conditions="encodeURIComponent(JSON.stringify({OrderId: purchaseId}))"
      :printingType="storeSettingPrintingTypes.StockingCloudGoodsIntakeOrderBasic"
      @listenPrintDialog="printDialog = false"
    ></print-order>
  </div>
</template>

<script>
import {
  GoodsIntakeOrderBasicState,
  FinanceType,
  SettingCustomizedFieldOrderType,
  SettingCustomizedFieldLargeType,
} from '@/enums/stocking.js'
import { PurchaseType, YNStatus, CharacterType } from '@/enums/common.js'
import {
  SettingPrintingType
} from '@/enums/merchant.js'
import {
  STOCKING_API_GOODS_INTAKE_ORDER_ITEM_GET,
  STOCKING_API_GOODS_INTAKE_ORDER_BASIC_GET,
  STOCKING_API_GOODS_INTAKE_ORDER_ITEM_GETS,
  STOCKING_API_GOODS_INTAKE_ORDER_BASIC_ABANDON,
  STOCKING_API_GOODS_INTAKE_ORDER_BASIC_CANCEL,
  STOCKING_API_GOODS_INTAKE_ORDER_BASIC_AUDIT,
  STOCKING_API_GOODS_INTAKE_ORDER_BASIC_REJECT,
  STOCKING_API_GOODS_INTAKE_ORDER_ITEM_EXPORT,
  STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS
} from '@/apis/stocking.js'
import printOrder from '@/components/erp/printOrder'
import goodsDetails from '@/components/purchase/goodsDetails'
import reviewDialog from '@/components/purchase/reviewDialog'
import obsolete from '@/components/purchase/obsolete'
import cancelReview from '@/components/purchase/cancelReview'
import goodsTable from '@/components/purchase/viewGoodTable'
import pagination from '@/components/pagination'
export default {
  data() {
    return {
      characterType: CharacterType,
      storeSettingPrintingTypes: SettingPrintingType,
      apis: STOCKING_API_GOODS_INTAKE_ORDER_ITEM_GET,
      YNStatus,
      orderBasicState: GoodsIntakeOrderBasicState,
      financeType: FinanceType,
      purchaseType: PurchaseType,
      detail: {}, // 基本信息
      editForm: {}, // 修改表单
      goodsData: [], // 货品数据
      paginationSizes: [10, 15, 20], // 分页数据条数数组
      pageSize: 20, // 分页数据条数
      pageIndex: 1, // 当前页面位置
      totalCount: 0, // 总数据条数
      indexPageSize: 20, // 列表序号，分页数据条数
      indexPageIndex: 1, // 列表序号，当前页面位置
      indexTotalCount: 0, // 列表序号，总数据条数
      purchaseId: '',
      orderType: '',
      goodsId: '', // 选中的货品id
      itemId: '',
      auditDialog: false, // 审核弹窗
      obsoleteVisble: false, // 作废弹窗
      visibleCan: false, // 取消审核弹窗
      reviewData: [], // 弹窗数据
      goodsOption: {
        OrderType:
          SettingCustomizedFieldOrderType.StockingCloudGoodsIntakeOrderBasic,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        SmallType: 0,
        KindTypeEk: 0
      },
      printDialog: false,
      fieldData: [], // 自定义列
      tabTable: 'goods',
    }
  },
  computed: {
    pages() {
      return (
        (this.totalCount % this.pageSize === 0
          ? Math.ceil(this.totalCount / this.pageSize)
          : parseInt(this.totalCount / this.pageSize) + 1) || 1
      )
    }
  },
  methods: {
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
      STOCKING_API_GOODS_INTAKE_ORDER_BASIC_GET({
        IntakeId: this.purchaseId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.goodsOption.KindTypeEk = res.data.Data.KindTypeEk
          this.editForm = Object.assign({}, res.data.Data)
          this.getGoods()
        }
      })
    },
    getGoods() {
      STOCKING_API_GOODS_INTAKE_ORDER_ITEM_GETS({
        IntakeId: this.purchaseId,
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
          this.getField()
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    getField() {
      STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS({...this.goodsOption, IsEnable: YNStatus.Yes}).then(res => {
        this.isLoading = false
        if (res.data.Code === 'CORRECT') {
          this.fieldData = res.data.Data.Rows || []
        }
      })
    },
    rowSelect(goodsId, itemId) {
      this.goodsId = goodsId
      this.itemId = itemId
    },
    printPrintOrder() {
      this.printDialog = true
    },
    prevPage() {
      this.pageIndex-=1
    },
    nextPage() {
      this.pageIndex+=1
    },
    // 跳转编辑
    linkEditPage() {
      this.$router.push({
        path: '/purchase/productStorage/editProductStorage',
        query: { id: this.purchaseId, orderType: this.orderType }
      })
    },
    // 打开审核和批量审核弹窗
    showAuditDialog() {
      this.reviewData = [{ ...this.detail, orderNumber: this.detail.IntakeCode }]
      this.auditDialog = true
    },
    // 关闭审核
    cancelAudit() {
      this.reviewData = []
      this.auditDialog = false
    },
    // 打开作废
    openObsolete() {
      this.reviewData = [{ ...this.detail, orderNumber: this.detail.IntakeCode }]
      this.obsoleteVisble = true
    },
    // 作废关闭
    visbleColse() {
      this.obsoleteVisble = false
    },
    // 作废确认
    confirmObsolete(note) {
      const para = {
        IntakeId: this.reviewData[0].IntakeId,
        CheckNote: note
      }
      STOCKING_API_GOODS_INTAKE_ORDER_BASIC_ABANDON(para).then(res => {
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
      this.reviewData = [{ ...this.detail, orderNumber: this.detail.IntakeCode }]
      this.visibleCan = true
    },
    // 取消审核确定
    cancelConfirm(data) {
      const para = {
        IntakeId: Number(this.reviewData[0].IntakeId),
        CheckNote: data
      }
      STOCKING_API_GOODS_INTAKE_ORDER_BASIC_CANCEL(para).then(res => {
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
        IntakeId: this.reviewData[0].IntakeId,
        CheckNote: data.auditReson
      }
      if (YNStatus.Yes === data.auditType) {
        STOCKING_API_GOODS_INTAKE_ORDER_BASIC_AUDIT(para).then(res => {
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
        STOCKING_API_GOODS_INTAKE_ORDER_BASIC_REJECT(para).then(res => {
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
    // 导出货品详情
    exportGoodDetail() {
      if(this.goodsData.length) {
        this.$store.commit('SET_BTN_LOADING', true)
        STOCKING_API_GOODS_INTAKE_ORDER_ITEM_EXPORT({
          IntakeId: this.purchaseId
        }).then(res => {
          if(res.data.Code === 'CORRECT') {
            if (res.data.Data) {
              setTimeout(() => {
                window.open(
                  this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data
                )
              }, 1000)
            } else {
              this.$router.push('/setter/userConfig/download')
            }
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      } else {
        this.$message.error('请先添加货品信息')
      }
    },
    toPrintLabel() {
      this.$router.push(`/purchase/batchLabel/printing?id=${this.purchaseId}`)
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
  },
  mounted() {
    let query = this.$route.query
    this.purchaseId = Number(query.id)
    this.orderType = query.orderType
    if (!this.purchaseId) {
      this.dataError()
    } else {
      this.getDetail()
    }
    // this.getStoreAllType()
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
    reviewDialog,
    obsolete,
    cancelReview,
    printOrder,
    goodsTable,
    pagination
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/erp/purchase.scss';
.import-purchase-dialog {
  .el-dialog {
    width: 418px;
  }
  .download-modflie {
    margin: 0 auto;
    padding: 10px 0;
    width: 360px;
    text-align: right;
    color: #20a0ff;
  }
  .alert-modflie {
    width: 100%;
    text-align: left;
    margin-bottom: 20px;
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
.goods-right {
  width: 65%;
  flex: 2;
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
.matchup-title {
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;
}
.popover-header {
  display: flex;
  span {
    color: #a89999;
    &.title {
      color: #444;
    }
  }
}
.popver-title {
  font-weight: 700;
}
</style>
