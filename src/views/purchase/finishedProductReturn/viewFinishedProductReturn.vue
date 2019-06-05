<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title fl">查看成品退货出库</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="6" colspan="1" class="state-img">
                  <img src="@/assets/images/draft.png" v-if="detail.State === orderBasicState.Draft">
                  <img src="@/assets/images/auditing.png" v-if="detail.State === orderBasicState.Wait">
                  <img src="@/assets/images/audited.png" v-if="detail.State === orderBasicState.Audit">
                  <img src="@/assets/images/auditBack.png" v-if="detail.State === orderBasicState.Reject">
                  <img src="@/assets/images/abandon.png" v-if="detail.State === orderBasicState.Abandon || detail.State === orderBasicState.Cancel">
                  <div>{{orderBasicState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.ReturnCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}} {{detail.CreateTime | filterDateTime}}</td>
                <td class="tit">审核</td>
                <td v-if="detail.State === orderBasicState.Audit || detail.State === orderBasicState.Reject">{{detail.CheckUser}} {{detail.CheckTime | filterDateTime}}</td>
              <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">应付款</td>
                <td >{{detail.Preprice}}</td>
                <td class="tit">退货原因</td>
                <td>{{detail.ReasonTypeDv}}</td>
                <td class="tit">业务日期</td>
                <td>{{detail.ActualDate | filterDate}}</td>
              </tr>
              <tr>
                <td class="tit" v-if="$store.getters.user_session.CharacterType === characterType.Company">退货仓库</td>
                <td v-if="$store.getters.user_session.CharacterType === characterType.Company">{{detail.WarehouseName}} > {{detail.ShelfName}}</td>
                <td class="tit">备注</td>
                <td class="note" :colspan="$store.getters.user_session.CharacterType === characterType.Company ? 3 : 5">{{detail.Note}}</td>
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
            <table
              class="goods-table"
              cellpadding="0"
              cellspacing="0"
            >
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
                <el-select
                  filterable
                  v-model="pageSize"
                  placeholder="20"
                  name="pageSize"
                >
                  <el-option
                    v-for="(item, index) in paginationSizes"
                    :key="index"
                    :value="item"
                  ></el-option>
                </el-select>
                <div class="pagination-controller">
                  <button
                    name="btnPrev"
                    class="prev-btn"
                    @click="prevPage"
                    :disabled="pageIndex === 1"
                    :class="{'isDisabled': pageIndex === 1}"
                  ><i class="el-icon-arrow-left"></i></button>
                  <span class="current-page">{{pageIndex}}/{{pages}}</span>
                  <button
                    name="btnNext"
                    class="next-btn"
                    @click="nextPage"
                    :disabled="pageIndex === pages"
                    :class="{'isDisabled': pageIndex === pages}"
                  ><i class="el-icon-arrow-right"></i></button>
                </div>
                <span class="total">共{{totalCount}}条</span>
              </div>
              <div class="count-bar">
                <span class="fl">数量合计：{{detail.ItemQty}}</span>
                <span class="fr">成本合计：<b>￥{{$root.toFloat(detail.CostPrice)}}</b></span>
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
                <goods-details
                  v-if="itemId && itemId != ''"
                  :itemId="itemId"
                  :apis="apis"
                  :option="option"
                ></goods-details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-button name="btnEdit" type="primary" v-if="orderBasicState.Draft == detail.State || orderBasicState.Reject == detail.State"  @click="linkEditPage">编辑</el-button>
      <el-button name="btnoObsolete" v-if="orderBasicState.Draft == detail.State || orderBasicState.Reject == detail.State" @click="openObsolete">作废</el-button>
      <el-button name="btnAudit" type="primary" v-if="orderBasicState.Wait == detail.State" @click="showAuditDialog">审核</el-button>
      <el-button name="btnCancel" v-if="orderBasicState.Audit == detail.State" @click="openCancelReview">取消审核</el-button>
      <el-button name="btnPrint" @click="printDialog = true" :loading="$store.getters.is_loading">打印</el-button>
      <el-button @click="$router.back(-1)">返回</el-button>
    </div>
     <!-- 审核 -->
    <!-- <review-Dialog v-if="auditDialog" :auditDialog="auditDialog" title="审核" :data="reviewData"  @confirmClick="confirmAudit" @cancelClick="cancelAudit"></review-Dialog> -->

     <el-dialog
      title="审核"
      :visible.sync="auditDialog"
      width="750px"
      @close="cancelAudit"
      v-if="auditDialog"
    >
      <el-form :label-position="'right'" label-width="100px">
        <el-row v-if="reviewData.length === 1">
          <el-col :span="10">
            <el-form-item label="单据编号：">
              <span :title="reviewData[0].ReturnCode" class="ReturnCode">{{reviewData[0].ReturnCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="创建：">
              <span class="ReturnCode">{{reviewData[0].CreateUser}} {{reviewData[0].CreateTime | filterDateTime}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="审核结果：">
          <el-radio-group v-model="returnInfo.auditType" name="auditType">
            <el-row :gutter="10">
              <el-col :span="24">
                <el-radio :label="YNStatus.Yes">审核通过</el-radio>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <el-radio :label="YNStatus.No" style="padding-top: 10px;">审核退回</el-radio>
              </el-col>
              <el-col :span="16" v-show="returnInfo.auditType === YNStatus.No">
                <el-input
                  v-model="returnInfo.auditReson"
                  placeholder="退回原因备注"
                  :maxlength="200"
                  name="auditReson"
                ></el-input>
              </el-col>
            </el-row>
          </el-radio-group>
        </el-form-item>
        <div
          v-if="returnInfo.auditType == YNStatus.Yes && supplierList.length > 1 && reviewData[0].Preprice"
        >
          <div class="colorRed">
            <div>该单需要按供应商拆成多个单据，请为每个供应商设置应付款：</div>
            <div>
              总共应付款为：
              <span>{{$root.toFloat(reviewData[0].Preprice)}}</span>
            </div>
          </div>
          <el-form-item
            v-for="(item,index) in supplierList"
            :label="item.name +'(' + financeType.Types[item.FinanceType] + ')：'"
            label-width="100"
            :key="index"
            style="margin-left: 30px;"
          >
            <el-input-number
              v-model="item.Preprice"
              :controls="false"
              placeholder="应付款"
              :min="0"
              :max="9999999"
              name="auditReson"
            ></el-input-number>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="confirmAudit"
          :loading="$store.getters.is_loading"
          name="btnAuditStockloss"
        >确 定</el-button>
        <el-button @click="cancelAudit" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 作废 -->
    <obsolete v-if="obsoleteVisble" @visbleColse="visbleColse" @confirmObsolete="confirmObsolete" :data="reviewData" :visibleObs="obsoleteVisble"></obsolete>
    <!-- 取消审核 -->
    <cancel-Review :visibleCan="visibleCan" :data="reviewData" v-if="visibleCan" @confirmCancel="cancelConfirm" @visbleColse="cancelColse"></cancel-Review>
    <!-- @module Dialog·打印 -->
    <print-order
      title="打印"
      v-if="printDialog"
      :visible.sync="printDialog"
      :conditions="encodeURIComponent(JSON.stringify({OrderId: purchaseId}))"
      :printingType="storeSettingPrintingTypes.StockingCloudGoodsReturnOrderBasic"
      @listenPrintDialog="printDialog = false"
    ></print-order>
    <!-- End Dialog·打印 -->
    <el-dialog
      title="审核"
      :visible.sync="auditDialog"
      width="750px"
      @close="cancelAudit"
      v-if="auditDialog"
    >
      <el-form :label-position="'right'" label-width="100px">
        <el-row v-if="reviewData.length === 1">
          <el-col :span="10">
            <el-form-item label="单据编号：">
              <span :title="reviewData[0].ReturnCode" class="ReturnCode">{{reviewData[0].ReturnCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="创建：">
              <span class="ReturnCode">{{reviewData[0].CreateUser}} {{reviewData[0].CreateTime | filterDateTime}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="审核结果：">
          <el-radio-group v-model="returnInfo.auditType" name="auditType">
            <el-row :gutter="10">
              <el-col :span="24">
                <el-radio :label="YNStatus.Yes">审核通过</el-radio>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8">
                <el-radio :label="YNStatus.No" style="padding-top: 10px;">审核退回</el-radio>
              </el-col>
              <el-col :span="16" v-show="returnInfo.auditType === YNStatus.No">
                <el-input
                  v-model="returnInfo.auditReson"
                  placeholder="退回原因备注"
                  :maxlength="200"
                  name="auditReson"
                ></el-input>
              </el-col>
            </el-row>
          </el-radio-group>
        </el-form-item>
        <div
          v-if="returnInfo.auditType == YNStatus.Yes && supplierList.length > 1 && reviewData[0].Preprice"
        >
          <div class="colorRed">
            <div>该单需要按供应商拆成多个单据，请为每个供应商设置应付款：</div>
            <div>
              总共应付款为：
              <span>{{$root.toFloat(reviewData[0].Preprice)}}</span>
            </div>
          </div>
          <el-form-item
            v-for="(item,index) in supplierList"
            :label="item.name +'(' + financeType.Types[item.FinanceType] + ')：'"
            label-width="100"
            :key="index"
            style="margin-left: 30px;"
          >
            <el-input
              v-model="item.Preprice"
              name="auditReson"
              @keyup.native="item.Preprice = $root.toFixed(item.Preprice, 2, true)"
              maxlength="10"
              style="width: 120px;"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="confirmAudit"
          :loading="$store.getters.is_loading"
          name="btnAuditStockloss"
        >确 定</el-button>
        <el-button @click="cancelAudit" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GoodsReturnOrderBasicState,
  SettingCustomizedFieldOrderType,
  SettingCustomizedFieldLargeType,
  FinanceType
} from '@/enums/stocking.js'
import {
  CharacterType,
  PurchaseType,
  YNStatus
} from '@/enums/common.js'
import {
  STOCKING_API_GOODS_RETURN_ORDER_ITEM_GET,
  STOCKING_API_GOODS_RETURN_ORDER_BASIC_GET,
  STOCKING_API_GOODS_RETURN_ORDER_BASIC_AUDIT,
  STOCKING_API_GOODS_RETURN_ORDER_BASIC_ABANDON,
  STOCKING_API_GOODS_RETURN_ORDER_BASIC_REJECT,
  STOCKING_API_GOODS_RETURN_ORDER_BASIC_CANCEL,
  STOCKING_API_GOODS_RETURN_ORDER_ITEM_GETS
} from '@/apis/stocking.js'

import {
  MERCHANT_API_DROPDOWN_PARTNERBASICLIST
} from '@/apis/merchant.js'
import printOrder from '@/components/erp/printOrder'
import goodsDetails from '@/components/purchase/goodsDetails'
import reviewDialog from '@/components/purchase/reviewDialog'
import obsolete from '@/components/purchase/obsolete'
import cancelReview from '@/components/purchase/cancelReview'
import {
  SettingPrintingType
} from '@/enums/merchant.js'
export default {
  data() {
    return {
      storeSettingPrintingTypes: SettingPrintingType,
      characterType: CharacterType,
      apis: STOCKING_API_GOODS_RETURN_ORDER_ITEM_GET,
      YNStatus,
      orderBasicState: GoodsReturnOrderBasicState,
      financeType: FinanceType,
      purchaseType: PurchaseType,
      detail: {}, // 基本信息
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
      obsoleteVisble: false,  // 作废弹窗
      visibleCan: false, // 取消审核弹窗
      reviewData: [], // 弹窗数据
      supplierRow: [], // 供应商下拉
      supplierList: [], // 审核时供应商列表
      printDialog: false,
      option: {
        OrderType: SettingCustomizedFieldOrderType.StockingCloudGoodsIntakeOrderBasic,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        SmallType: 0,
        KindTypeEk: 1,
        IsEnable: YNStatus.Yes
      },
      returnInfo: {
        auditType: YNStatus.Yes, // 审核状态 1代表通过 3代表不通过
        auditReson: '' // 审核不通过理由
      }, //
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
      STOCKING_API_GOODS_RETURN_ORDER_BASIC_GET({
        ReturnId: this.purchaseId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.detail.Preprice = Number(this.$root.toFloat(res.data.Data.Preprice))
        }
      })
    },
    getGoods() {
      STOCKING_API_GOODS_RETURN_ORDER_ITEM_GETS({
        ReturnId: this.purchaseId,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize,
        IsAsced: YNStatus.No,
        OrderBy: 0,
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.totalCount = res.data.Data.Count || 0
          this.goodsId =
            this.goodsData &&
            this.goodsData.length &&
            this.goodsData[0].GoodsId
          this.itemId =
            this.goodsData && this.goodsData.length && this.goodsData[0].ItemId
          this.indexPageSize = this.pageSize
          this.indexPageIndex = this.pageIndex
          this.indexTotalCount = this.totalCount
        } else {
          this.$message.error('数据请求失败')
          this.goodsData = []
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    rowSelect(goodsId, itemId) {
      console.log(itemId)
      this.goodsId = goodsId
      this.itemId = itemId
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
        path: '/purchase/finishedProductReturn/editFinishedProductReturn',
        query: { id: this.purchaseId }
      })
    },
    // 打开审核和批量审核弹窗
    showAuditDialog() {
      const arr = this.detail.SplitPartnerIds.split(',')
      this.supplierList = arr.map(item => {
        const str = item.split(':')
        return { Preprice: 0, name: str[1], PartnerId: str[0], FinanceType: str[2] }
      })
      this.reviewData = [{...this.detail, orderNumber: this.detail.ReturnCode}]
      this.auditDialog = true
      console.log(this.supplierList)
    },
    // 关闭审核
    cancelAudit() {
      this.reviewData = []
      this.auditDialog = false
    },
    // 打开作废
    openObsolete() {
      this.reviewData = [{...this.detail, orderNumber: this.detail.ReturnCode}]
      this.obsoleteVisble = true
    },
    // 作废关闭
    visbleColse() {
      this.obsoleteVisble = false
    },
    // 作废确认
    confirmObsolete(note) {
      const para = {
        ReturnId: this.reviewData[0].ReturnId,
        CheckNote: note
      }
      STOCKING_API_GOODS_RETURN_ORDER_BASIC_ABANDON(para).then(res => {
        if(res.data.Code === 'CORRECT') {
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
      this.reviewData = [{...this.detail, orderNumber: this.detail.ReturnCode}]
      this.visibleCan = true
    },
    // 取消审核确定
    cancelConfirm(data) {
      const para = {
        ReturnId: Number(this.reviewData[0].ReturnId),
        CheckNote: data
      }
      STOCKING_API_GOODS_RETURN_ORDER_BASIC_CANCEL(para).then(res => {
        if(res.data.Code === 'CORRECT') {
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
      this.returnInfo = {
        auditType: YNStatus.Yes, // 审核状态 1代表通过 3代表不通过
        auditReson: '' // 审核不通过理由
      },
      this.visibleCan = false
    },
    // 审核确定
    // 审核确定
    confirmAudit() {
      const para = {
        ReturnId: this.reviewData[0].ReturnId,
        CheckNote: this.returnInfo.auditReson
      }
      if (
        this.returnInfo.auditType === YNStatus.Yes &&
        this.supplierList.length > 1 &&
        this.supplierList[0].name != '' &&
        this.reviewData[0].Preprice
      ) {
        this.supplierList.map(item => {
          this.supplierRow.map(val => {
            if (item.name == val.Value) {
              item.PartnerId = val.Id
            }
          })
        })
        let preprice = 0
        para.Items = this.supplierList.map(item => {
          preprice = preprice + this.$root.toInt(item.Preprice)
          return { Preprice: this.$root.toInt(item.Preprice), PartnerId: Number(item.PartnerId), FinanceType: Number(item.FinanceType) }
        })
        if(preprice != this.reviewData[0].Preprice) {
          return this.$message.error('供应商的总额必须等于应付款')
        }
      } else if(
        this.returnInfo.auditType === YNStatus.Yes &&
        this.supplierList.length > 1 &&
        this.supplierList[0].name != '' &&
        this.reviewData[0].Preprice == 0
      ) {
        this.supplierList.map(item => {
          this.supplierRow.map(val => {
            if (item.name == val.Value) {
              item.PartnerId = Number(val.Id)
            }
          })
        })
        para.Items = this.supplierList.map(item => {
          return { Preprice: 0, PartnerId: Number(item.PartnerId) }
        })
      }
      if(YNStatus.Yes === this.returnInfo.auditType) {
        STOCKING_API_GOODS_RETURN_ORDER_BASIC_AUDIT(para).then(res => {
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
      } else if (YNStatus.No === this.returnInfo.auditType) {
        STOCKING_API_GOODS_RETURN_ORDER_BASIC_REJECT(para).then(res => {
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
    // 获取供应商
    getSupplierList() {
      MERCHANT_API_DROPDOWN_PARTNERBASICLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.supplierRow = res.data.Data.Rows
        }
      })
    },
  },
  mounted() {
    let query = this.$route.query
    this.purchaseId = query.id
    if (!this.purchaseId) {
      this.dataError()
    } else {
      this.getDetail()
      this.getGoods()
      this.getSupplierList()
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
    printOrder
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/erp/purchase.scss";
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
  height: 65px;
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
.colorRed {
  color: red;
  margin-left: 29px;
  line-height: 23px;
  margin-bottom: 10px;
  span {
    font-weight: bold;
  }
}
</style>
