<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title fl">查看门店分货单({{detail.KindTypeEv}})</span>
        <!-- <span class="title float-r edit">修改</span> -->
        <!-- <el-button name="btnEdit" @click="openDividend" class="el-back" type="text">修改</el-button> -->
      </div>
      <div class="hd">
        <table>
          <tbody>
            <tr>
              <th rowspan="3" class="sp">
                <img
                  v-if="detail.State == orderBasicState.Draft || detail.State == orderBasicState.Wait"
                  src="../../../assets/images/status1.png"
                >
                <img
                  v-if="detail.State == orderBasicState.Audit"
                  src="../../../assets/images/status2.png"
                >
                <img
                  v-if="detail.State == orderBasicState.Reject"
                  src="../../../assets/images/status3.png"
                >
                <img
                  v-if="detail.State == orderBasicState.Cancel"
                  src="../../../assets/images/status4.png"
                >
                <img
                  v-if="detail.State == orderBasicState.Abandon"
                  src="../../../assets/images/status5.png"
                >
                {{orderBasicState.Types[detail.State]}}
              </th>
              <th>单号</th>
              <td>{{detail.SplitCode}}</td>
              <th>创建</th>
              <td>{{detail.CreateUser}} {{detail.CreateTime | filterDateTime}}</td>
              <th>审核</th>
              <td v-if="detail.State === orderBasicState.Audit || detail.State === orderBasicState.Reject">{{detail.CheckUser}} {{detail.CheckTime | filterDateTime}}</td>
              <td v-else>-</td>
            </tr>
            <tr>
              <th>位置</th>
              <td>{{detail.WarehouseName}} > {{detail.ShelfName}}</td>
              <th>备注</th>
              <td>{{detail.Note}}</td>
              <th></th>
              <td></td>
            </tr>
            <tr>
              <th></th>
              <td></td>
              <th></th>
              <td></td>
              <th></th>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
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
        <table class="goods-table" cellpadding="1" cellspacing="0">
          <thead>
            <tr>
              <th>序号</th>
              <th>款式</th>
              <th>可用库存</th>
              <th>本次分货</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in goodsData"
              :key="item.index"
              :class="{active:item.StyleId === StyleId}"
              @click="rowSelect(item)"
            >
              <td>{{indexTotalCount - indexPageSize * (indexPageIndex - 1) - index}}</td>
              <td style="padding: 4px 0;">
                <span class="float-l styleImg">
                  <img
                    :src="$root.settings.DOMAIN_IMG_FILE + item.ImageUrl"
                    style="width: 30px; height: 30px;"
                  >
                </span>
                <span class="float-l styleTitle">
                  <p class="width100" :title="item.model">{{item.StyleCode}}</p>
                  <p class="width100" :title="item.title">{{item.StyleName}}</p>
                </span>
              </td>
              <td>{{item.AvailableQty}}</td>
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
                class="prev-btn"
                @click="prevPage"
                :disabled="pageIndex === 1"
                :class="{'isDisabled': pageIndex === 1}"
              >
                <i class="el-icon-arrow-left"></i>
              </button>
              <span class="current-page">{{pageIndex}}/{{pages}}</span>
              <button
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
        </div>
      </div>
      <div class="goods-right" style="width: 57%;">
        <!-- 货品详情 -->
        <div class="panel">
          <div class="panel-hd">
            <span class="title">门店列表</span>
          </div>
          <div class="panel-bd" v-if="totalCount">
            <div>
              <el-select
                filterable
                v-model="storeGoodsDetail.StoreType"
                placeholder="请选择"
                @change="getGoodsDetail"
              >
                <el-option label="所有门店" :value="0"></el-option>
                <el-option
                  v-for="item in storeType.TypeArray"
                  :key="item.KeyId"
                  :label="item.Value"
                  :value="item.KeyId"
                ></el-option>
              </el-select>
              <el-select
                filterable
                v-model="storeGoodsDetail.SplitXpState"
                placeholder="请选择"
                @change="getGoodsDetail"
              >
                <el-option label="所有分货" :value="0"></el-option>
                <el-option
                  v-for="item in splitXpState.TypeArray"
                  :key="item.KeyId"
                  :label="item.Value"
                  :value="item.KeyId"
                ></el-option>
              </el-select>
            </div>
            <!-- @module 数据表格 -->
            <el-table
              :data="tableData"
              :span-method="objectSpanMethod"
              style="width: 100%; margin-top: 20px;"
              border
            >
              <el-table-column prop="StoreName" label="门店信息" width="100" show-overflow-tooltip>
                <template
                  slot-scope="scope"
                >【{{storeType.Types[scope.row.StoreType]}}】{{scope.row.StoreName}}</template>
              </el-table-column>
              <el-table-column label="库存情况" width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>
                    <div>可用库存：{{scope.row.OutwaitQty}}</div>
                    <div>调拨在途：{{scope.row.AllotQty}}</div>
                    <div>安全库存：{{scope.row.SafeQty1}} ~ {{scope.row.SafeQty2}}</div>
                  </div>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="stockTime" label="库存时间" width="80" show-overflow-tooltip></el-table-column> -->
              <el-table-column label="需求时间" show-overflow-tooltip>
                <template slot-scope="scope">{{scope.row.RequireTime | filterDateTime }}</template>
              </el-table-column>
              <el-table-column prop="SpecNote" width="130" label="需求规格" show-overflow-tooltip></el-table-column>
              <el-table-column prop="RequireQty" label="需求量" show-overflow-tooltip></el-table-column>
              <el-table-column prop="SplitQty" label="已分" show-overflow-tooltip></el-table-column>
              <el-table-column prop="SurpQty" label="未分" show-overflow-tooltip></el-table-column>
              <el-table-column prop="Quantity" label="本次分货"></el-table-column>
            </el-table>
            <!-- End 数据表格 -->
          </div>
          <div class="panel-bd" v-else style="font-size: small; text-align: center;">暂无数据</div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-button
        name="btnCancelAudit"
        type="primary"
        v-if="detail.State == orderBasicState.Draft ||detail.State == orderBasicState.Reject"
        @click="editStoreDividend"
      >编辑</el-button>
      <el-button
        name="btnCancelAudit"
        type="primary"
        v-if="detail.State == orderBasicState.Wait"
        @click="reviewStyleOrder"
      >审核</el-button>
      <el-button
        name="btnCancelAudit"
        type="primary"
        v-if="detail.State == orderBasicState.Audit"
        @click="openCancelReview"
      >取消审核</el-button>
      <el-button
        name="btnCancelAudit"
        type="primary"
        v-if="detail.State == orderBasicState.Draft || detail.State == orderBasicState.Reject"
        @click="openObsolete"
      >作废</el-button>
      <el-button name="btnCancelAudit" @click="$router.back()">返回</el-button>
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
  </div>
</template>

<script>
import { YNStatus, StoreType } from '@/enums/common.js'
import {
  StyleSplitOrderBasicState,
  StyleSplitOrderRequireSplitXpState
} from '@/enums/stocking.js'
import {
  STOCKING_API_STYLE_SPLIT_ORDER_BASIC_GET,
  STOCKING_API_STYLE_SPLIT_ORDER_REQUIRE_GETS,
  STOCKING_API_STYLE_SPLIT_ORDER_STYLE_GETS,
  STOCKING_API_STYLE_SPLIT_ORDER_BASIC_ABANDON,
  STOCKING_API_STYLE_SPLIT_ORDER_BASIC_CANCEL,
  STOCKING_API_STYLE_SPLIT_ORDER_BASIC_AUDIT,
  STOCKING_API_STYLE_SPLIT_ORDER_BASIC_REJECT
} from '@/apis/stocking.js'
import dayjs from 'dayjs'

// import goodsDetails from '@/components/erp/goodsDetails'
import pagination from '@/components/pagination'
import reviewDialog from '@/components/purchase/reviewDialog'
import obsolete from '@/components/purchase/obsolete'
import cancelReview from '@/components/purchase/cancelReview'

export default {
  data() {
    return {
      YNStatus,
      orderBasicState: StyleSplitOrderBasicState,
      goodsData: [], // 货品数据
      paginationSizes: [10, 15, 20], // 分页数据条数数组
      pageSize: 20, // 分页数据条数
      pageIndex: 1, // 当前页面位置
      totalCount: 0, // 总数据条数
      indexPageSize: 20, // 列表序号，分页数据条数
      indexPageIndex: 1, // 列表序号，当前页面位置
      indexTotalCount: 0, // 列表序号，总数据条数
      SplitId: '',
      detail: {
        SplitId: '',
        SupplierId: '',
        ArrivalCode: '',
        FinanceType: '',
        Note: ''
      },
      StyleId: '', // 选中的货品id
      storeType: StoreType,
      splitXpState: StyleSplitOrderRequireSplitXpState,
      tableData: [],
      spanArr: [],
      // 右边商品列表
      storeGoodsList: {
        SplitId: this.$route.query.id,
        State: 0,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      // 右边商品分货明细
      storeGoodsDetail: {
        SplitId: this.$route.query.id,
        StyleItid: 0,
        StoreType: 0,
        SplitXpState: 0,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 1000
      },
      obsoleteVisble: false, // 作废弹窗
      visibleCan: false, // 取消审核弹窗
      auditDialog: false, // 审核弹窗
      reviewData: [] // 弹窗数据
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
      this.SplitId = query.id
      if (!this.SplitId) {
        this.dataError()
      } else {
        this.getDetail()
        this.getGoods()
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
      STOCKING_API_STYLE_SPLIT_ORDER_BASIC_GET({
        SplitId: this.SplitId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
      })
    },
    getGoods() {
      this.storeGoodsList.PageIndex = this.pageIndex
      this.storeGoodsList.PageSize = this.pageSize
      STOCKING_API_STYLE_SPLIT_ORDER_STYLE_GETS(this.storeGoodsList).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.goodsData = res.data.Data.Rows || []
            this.totalCount = res.data.Data.Count || 0
            this.StyleId =
              this.goodsData &&
              this.goodsData.length &&
              this.goodsData[0].StyleId
            this.storeGoodsDetail.StyleItid =
              res.data.Data.Count && this.goodsData[0].StyleItid
            this.indexPageSize = this.pageSize
            this.indexPageIndex = this.pageIndex
            this.indexTotalCount = this.totalCount
            res.data.Data.Count &&
              res.data.Data.Rows.map(item => {
                this.stockTotal = item.AvailableQty + this.stockTotal
                this.alreadyTotal = item.Quantity + this.alreadyTotal
              })
            if (res.data.Data.Count) {
              this.getGoodsDetail()
            }
          }
        }
      )
    },
    getGoodsDetail() {
      STOCKING_API_STYLE_SPLIT_ORDER_REQUIRE_GETS(this.storeGoodsDetail).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.tableData = res.data.Data.Rows
            let contactDot = 0
            this.spanArr = []
            this.tableData.sort((a,b) => {
              if(a.CharacterId === b.CharacterId) {
                return new Date(b.RequireTime.replace(/-/g, '/')) - new Date(a.RequireTime.replace(/-/g, '/'))
              } else {
                return a.CharacterId === b.CharacterId
              }
            })
            this.tableData.map((item, index) => {
              item.index = index
              if (index === 0) {
                this.spanArr.push(1)
              } else {
                if (
                  item.CharacterId === this.tableData[index - 1].CharacterId
                ) {
                  this.spanArr[contactDot] += 1
                  this.spanArr.push(0)
                } else {
                  this.spanArr.push(1)
                  contactDot = index
                }
              }
            })
          }
        }
      )
    },
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    expandRow(row) {
      this.expandRows = row
    },
    // 格式化时间日期
    schemeDate(data) {
      const ignore = ['1900', '9999']
      if (!data || ignore.indexOf(dayjs(data).format('YYYY')) > -1) {
        return '-'
      }
      return dayjs(data).format('YYYY-MM-DD HH:mm:ss')
    },
    rowSelect(item) {
      this.StyleId = item.StyleId
      this.storeGoodsDetail.StyleItid = item.StyleItid
      this.getGoodsDetail()
    },
    prevPage() {
      this.pageIndex-=1
    },
    nextPage() {
      this.pageIndex+=1
    },
    // 编辑
    editStoreDividend() {
      this.$router.push(`/purchase/storeDividend/editStoreStyleDem?id=${this.SplitId}`)
    },
    // 打开审核和批量审核弹窗
    reviewStyleOrder() {
      this.reviewData = [{ ...this.detail, orderNumber: this.detail.SplitCode }]
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
      this.reviewData = [{ ...this.detail, orderNumber: this.detail.SplitCode }]
      this.obsoleteVisble = true
    },
    // 作废关闭
    visbleColse() {
      this.obsoleteVisble = false
    },
    // 作废确认
    confirmObsolete(note) {
      const para = {
        SplitId: this.reviewData[0].SplitId,
        CheckNote: note
      }
      STOCKING_API_STYLE_SPLIT_ORDER_BASIC_ABANDON(para).then(res => {
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
      this.reviewData = [{ ...this.detail, orderNumber: this.detail.SplitCode }]
      this.visibleCan = true
    },
    // 取消审核确定
    cancelConfirm(data) {
      const para = {
        SplitId: Number(this.reviewData[0].SplitId),
        CheckNote: data
      }

      STOCKING_API_STYLE_SPLIT_ORDER_BASIC_CANCEL(para).then(res => {
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
        SplitId: this.reviewData[0].SplitId,
        CheckNote: data.auditReson
      }
      if (YNStatus.Yes === data.auditType) {
        STOCKING_API_STYLE_SPLIT_ORDER_BASIC_AUDIT(para).then(res => {
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
        STOCKING_API_STYLE_SPLIT_ORDER_BASIC_REJECT(para).then(res => {
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
    // goodsDetails,
    pagination,
    reviewDialog,
    obsolete,
    cancelReview
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/erp/purchase.scss';
</style>

<style lang="scss" scoped>
.panel {
  border-bottom: none;
  margin-bottom: 10px;
  .hd {
    table {
      // border: 1px solid $border-color;
      tr {
        border-bottom: 1px solid $border-color;
        height: 32px;
        th {
          min-width: 120px;
          border-left: 1px solid $border-color;
          border-right: 1px solid $border-color;
          background: $bg-color;
          text-align: center;
          &.sp {
            width: 100px;
            background: $white;
            border-left: none;
            img {
              display: block;
              margin: 0 auto 10px;
            }
          }
        }
        td {
          min-width: 200px;
          padding-left: 10px;
          word-break:break-all;
        }
      }
    }
  }
  .md {
    height: 34px;
    line-height: 34px;
    padding: 0 10px;
    .fl {
      font-weight: bold;
    }
  }
  .bd {
    padding: 5px 0 45px;
  }
}
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
  height: 32px;
}
.goods-wrapper .goods-left .toolsbar .count-bar {
  border-bottom: 1px solid #ddd;
}
.goods-wrapper .goods-left .toolsbar .count-bar:nth-child(3) {
  border: none;
}
.float-l {
  float: left;
}
.float-r {
  float: right;
}
.edit {
  cursor: pointer;
  color: blue;
}
.styleImg {
  width: 29%;
}
.styleTitle {
  width: 66% !important;
  padding-top: 3px !important;
  p {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.width100 {
  width: 100% !important;
  padding: 0 !important;
}
.gift-info-cell img {
  width: 50px;
  height: 50px;
  vertical-align: top;
}
.el-back {
  position: absolute;
  width: 50px;
  height: 40px;
  right: 25px;
  z-index: 10;
}
.el-setting {
  position: absolute;
  height: 32px;
  right: 10px;
  z-index: 10;
}
.right-text {
  position: absolute;
  height: 32px;
  right: 10px;
  z-index: 10;
  line-height: 32px;
  font-size: 14px;
  span {
    margin-right: 10px;
  }
}
</style>
