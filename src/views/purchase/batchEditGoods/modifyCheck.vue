<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看货品修改单（{{detail.KindTypeEv}}）</span>
        <el-button type="text" @click="$router.back(-1)" class="returnBack">返回</el-button>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="4" class="state-img">
                  <img src="@/assets/images/draft.png" v-if="detail.State === orderBasicState.Draft">
                  <img src="@/assets/images/auditing.png" v-if="detail.State === orderBasicState.Wait">
                  <img src="@/assets/images/audited.png" v-if="detail.State === orderBasicState.Audit">
                  <img src="@/assets/images/auditBack.png" v-if="detail.State === orderBasicState.Reject">
                  <img src="@/assets/images/abandon.png" v-if="detail.State === orderBasicState.Abandon || detail.State === orderBasicState.Cancel">
                  <div>{{orderBasicState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.ModifyCode}}</td>
                <td class="tit">创建：</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateTime}}</td>
                <td class="tit">审核：</td>
                <td v-if="detail.State === orderBasicState.Audit || detail.State === orderBasicState.Reject">{{detail.CheckUser}} {{detail.CheckTime | filterDateTime}}</td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">修改原因：</td>
                <td>{{detail.ReasonTypeDv}}</td>
                <td class="tit">备注：</td>
                <td class="note" colspan="3">{{detail.Note}}</td>
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
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in goodsData" :key="item.index" :class="{active:item.GoodsId === goodsId}" @click="rowSelect(item.GoodsId)">
                  <td>{{indexTotalCount - indexPageSize * (indexPageIndex - 1) - index}}</td>
                  <td :title="item.BarCode">{{item.BarCode}}</td>
                  <td :title="item.GoodsName">{{item.GoodsName}}</td>
                </tr>
              </tbody>
            </table>
            <!-- 工具栏 -->
            <div class="toolsbar">
              <div class="myPagination-bar">
                <el-select v-model="pageSize" placeholder="20" name="pageSize" filterable>
                  <el-option v-for="(item, index) in paginationSizes" :key="index" :value="item"></el-option>
                </el-select>
                <div class="pagination-controller">
                  <button name="btnPrev" class="prev-btn" @click="prevPage" :disabled="pageIndex === 1" :class="{'isDisabled': pageIndex === 1}"><i class="el-icon-arrow-left"></i></button>
                  <span class="current-page">{{pageIndex}}/{{pages}}</span>
                  <button name="btnNext" class="next-btn" @click="nextPage" :disabled="pageIndex === pages" :class="{'isDisabled': pageIndex === pages}"><i class="el-icon-arrow-right"></i></button>
                </div>
                <span class="total">共{{totalCount}}条</span>
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
                <goods-details v-if="goodsId && goodsId != '' && goodsOption.KindTypeEk" :goodsId="goodsId" :option="goodsOption" :modifyId="purchaseId" :apis="apis" ></goods-details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="buttons">
      <template v-if="detail.State === orderBasicState.Reject || detail.State === orderBasicState.Draft">
        <router-link :to="{path:'/purchase/batchEditGoods/modifyEdit',query:{id:detail.ModifyId}}" name="btnEdit"> 
          <el-button type="primary">
            编辑
          </el-button>
        </router-link>
      </template>
      <el-button
        name="btnShowDetail"
        v-if="orderBasicState.Draft == detail.State || orderBasicState.Reject == detail.State"
        @click="openObsolete"
      >作废</el-button>
      <el-button
        name="btnShowDetail"
        v-if="orderBasicState.Wait == detail.State"
        @click="showAuditDialog"
      >审核</el-button>
      <el-button
        name="downLoadGoods"
        @click="downLoadGoods"
      >导出货品详情</el-button>
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
    <!-- @module Dialog·审核 -->
    <!-- <modify-audit title="审核" v-if="auditDialog" :auditDialog="auditDialog" :data="[detail]" @listenAuditDialog="listenAuditDialog"></modify-audit> -->
    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <!-- <modify-abandon title="作废" v-if="abandonDialog" :abandonDialog="abandonDialog" :abandonModify="detail" @listenAbandonDialog="listenAbandonDialog"></modify-abandon> -->
    <!-- End Dialog·作废 -->

  </div>
</template>

<script>
import {
  GoodsModifyOrderBasicState,
  SettingCustomizedFieldOrderType,
  SettingCustomizedFieldLargeType,
  GoodsModifyOrderItemType,
} from '@/enums/stocking.js'
import {
  STOCKING_API_GOODS_MODIFY_ORDER_BASIC_GET,
  STOCKING_API_GOODS_MODIFY_ORDER_ITEM_GETS,
  STOCKING_API_GOODS_MODIFY_ORDER_ITEM_REQS,
  STOCKING_API_GOODS_MODIFY_ORDER_BASIC_ABANDON,
  STOCKING_API_GOODS_MODIFY_ORDER_BASIC_AUDIT,
  STOCKING_API_GOODS_MODIFY_ORDER_BASIC_REJECT,
  STOCKING_API_GOODS_MODIFY_ORDER_ITEM_EXPORT
} from '@/apis/stocking.js'
import {
  CharacterType,YNStatus
} from '@/enums/common.js'

import goodsDetails from '@/components/purchase/goodDetail'
import reviewDialog from '@/components/purchase/reviewDialog'
import obsolete from '@/components/purchase/obsolete'
// import modifyAudit from './modifyAudit'
// import modifyAbandon from './modifyAbandon'
export default {
  data() {
    return {
      itemType: GoodsModifyOrderItemType,
      YNStatus,
      orderBasicState: GoodsModifyOrderBasicState,
      detail: {
      },
      goodsData: [], // 货品数据
      paginationSizes: [5, 10, 15, 20], // 分页数据条数数组
      pageSize: 20, // 分页数据条数
      pageIndex: 1, // 当前页面位置
      totalCount: 0, // 总数据条数
      purchaseId: '',
      itemId: '',
      goodsId: '', // 选中的货品id
      auditDialog: false, // 审核对话框
      abandonDialog: false, // 作废对话框
      printDialog: false,
      characterType: CharacterType,
      apis: STOCKING_API_GOODS_MODIFY_ORDER_ITEM_REQS,
      goodsOption: {
        OrderType: SettingCustomizedFieldOrderType.StockingCloudGoodsIntakeOrderBasic,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        SmallType: 0,
        KindTypeEk: 0
      },
      reviewData: [], // 弹窗数据
      obsoleteVisble: false,
    }
  },
  computed: {
    pages() {
      return Math.ceil(this.totalCount / this.pageSize) || 1
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
      STOCKING_API_GOODS_MODIFY_ORDER_BASIC_GET({
        ModifyId: this.purchaseId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.goodsOption.KindTypeEk = res.data.Data.KindTypeEk
        }
      })
    },
    getGoods() {
      STOCKING_API_GOODS_MODIFY_ORDER_ITEM_GETS({
        ModifyId: this.purchaseId,
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
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    rowSelect(itemId) {
      this.goodsId = itemId
    },
    prevPage() {
      this.pageIndex-=1
    },
    nextPage() {
      this.pageIndex+=1
    },
    listenAbandonDialog(success) {
      if (success) {
        this.getDetail()
      }
      this.abandonDialog = false
    },
    listenCancelDialog(success) {
      if (success) {
        this.getDetail()
      }
      this.cancelDialog = false
    },
    listenAuditDialog(success) {
      if (success) {
        this.getDetail()
        this.getGoods()
      }
      this.auditDialog = false
    },
    // 打开审核和批量审核弹窗
    showAuditDialog() {
      this.reviewData = [{ ...this.detail, orderNumber: this.detail.ModifyCode }]
      this.auditDialog = true
    },
    // 关闭审核
    cancelAudit() {
      this.reviewData = []
      this.reviewTitle = ''
      this.auditDialog = false
    },
    // 打开作废
    openObsolete() {
      this.reviewData = [{ ...this.detail, orderNumber: this.detail.ModifyCode }]
      this.obsoleteVisble = true
    },
    // 作废关闭
    visbleColse() {
      this.obsoleteVisble = false
    },
    // 作废确认
    confirmObsolete(note) {
      const para = {
        ModifyId: this.reviewData[0].ModifyId,
        CheckNote: note
      }
      STOCKING_API_GOODS_MODIFY_ORDER_BASIC_ABANDON(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '作废成功',
            type: 'success'
          })
          this.obsoleteVisble = false
          this.reviewData = []
          this.getDetail()
          this.getGoods()
        }
      })
    },
    // 审核确定
    confirmAudit(data) {
      const para = {
        ModifyId: this.reviewData[0].ModifyId,
        CheckNote: data.auditReson
      }
      if (YNStatus.Yes === data.auditType) {
        STOCKING_API_GOODS_MODIFY_ORDER_BASIC_AUDIT(para).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: '审核通过成功',
              type: 'success'
            })
            this.cancelAudit()
            this.getDetail()
            this.getGoods()
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      } else if (YNStatus.No === data.auditType) {
        STOCKING_API_GOODS_MODIFY_ORDER_BASIC_REJECT(para).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: '审核退回成功',
              type: 'success'
            })
            this.cancelAudit()
            this.getDetail()
            this.getGoods()
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }
    },
    downLoadGoods() {
      STOCKING_API_GOODS_MODIFY_ORDER_ITEM_EXPORT({
        ModifyId: this.purchaseId
      }).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
        if (res.data.Code === 'CORRECT') {
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
        this.goodsExportVisible = false
      })
    },
  },
  beforeMount() {},
  mounted() {
    let query = this.$route.query
    this.purchaseId = Number(query.id)
    if (!this.purchaseId) {
      this.dataError()
    } else {
      this.getDetail()
      this.getGoods()
    }
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
    obsolete
  }
}
</script>

<style lang="scss">
@import '@/assets/sass/erp/purchase.scss';
</style>
<style lang="scss" scoped>
.code-input {
  margin-right: 10px;
  vertical-align: middle;
}
.good-num {
  width: 32px;
}
.toolsbar {
  height: 32px !important;
}
.returnBack {
  float: right;
  height: 40px;
  width: 40px;
}
</style>
