<template>
  <div class="content" v-loading="$store.getters.is_loading">
    <div class="panel">
      <div class="panel-hd">
        <span class="title fl">查看款式订货单（{{detail.KindTypeEv}}）</span>
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
              <td>{{detail.PurchaseCode}}</td>
              <th>创建</th>
              <td>{{detail.CreateUser}} {{detail.CreateTime | filterDateTime}}</td>
              <th>审核</th>
              <td v-if="detail.State === orderBasicState.Audit || detail.State === orderBasicState.Reject">{{detail.CheckUser}} {{detail.CheckTime | filterDateTime}}</td>
              <td v-else>-</td>
            </tr>
            <tr>
              <th>业务日期</th>
              <td>{{detail.ActualDate | filterDate}}</td>
              <th>进货方式</th>
              <td>{{purchaseType.Types[detail.PurchaseType]}}</td>
              <th>应付款</th>
              <td>{{$root.toFloat(detail.Preprice)}}</td>
            </tr>
            <tr>
              <th>预计到货日期</th>
              <td>{{detail.ForwdDate | filterDate}}</td>
              <th>供应商</th>
              <td>{{detail.PartnerName}}</td>
              <th>备注</th>
              <td>{{detail.Note}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="checkPage-hd">
      <el-row>
        <el-col :span="12">
          <i class="icon-list"></i>
          <span class="title">货品列表</span>
        </el-col>
        <el-col :span="12" class="tr" style="padding-right: 10px;">
            <span class="detail-info-num-item">
              数量：
              <b class="num">{{detail.ItemQty}}</b>
            </span>
          </el-col>
      </el-row>
    </div>
    <div class="goods-wrapper">
      <!-- @module 数据表格 -->
      <el-table :data="tableData" element-loading-text="拼命加载中" @sort-change="querySort">
        <el-table-column prop="storeInfo" label="图片" show-overflow-tooltip>
          <template slot-scope="{row}">
            <div name="rowUpload" class="imgCell">
              <img :src="$root.settings.DOMAIN_IMG_FILE + row.ImageUrl" width="60" height="60" v-if="row.ImageUrl">
              <img src="@/assets/images/pic.jpg" width="60" height="60" v-else>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="StyleCode" label="款号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="StyleName" label="款式名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoldWeight" label="金重(g)" show-overflow-tooltip></el-table-column>
        <el-table-column prop="StoneWeight" label="主石重(ct)" show-overflow-tooltip></el-table-column>
        <el-table-column prop="StoneColor" label="主石颜色" show-overflow-tooltip></el-table-column>
        <el-table-column prop="StoneClarity" label="主石净度" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Size" label="尺寸" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Quantity" label="数量" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PartnerName" label="供应商" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PartnerScode" label="供应商款号" show-overflow-tooltip></el-table-column>
        <el-table-column label="参考进货价/工费" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            {{$root.toFloat(scope.row.ReferPrice)}}
          </template>
        </el-table-column>
        <el-table-column prop="CraftFee1" label="工费①按克" show-overflow-tooltip>
          <template slot-scope="scope">
            {{$root.toFloat(scope.row.CraftFee1)}}
          </template>
        </el-table-column>
        <el-table-column prop="CraftFee2" label="工费②按件" show-overflow-tooltip>
          <template slot-scope="scope">
            {{$root.toFloat(scope.row.CraftFee2)}}
          </template>
        </el-table-column>
        <el-table-column prop="ItemNote" label="备注" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- End 数据表格 -->
    </div>
    <pagination
      :pg="queryForm.PageIndex"
      :size="queryForm.PageSize"
      :total="total"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
    <div class="buttons">
      <template
        v-if="detail.State == orderBasicState.Draft || detail.State == orderBasicState.Reject"
      >
        <router-link
          :to="{path:'/purchase/orderManagement/editStyleOrder',query:{id:detail.PurchaseId}}"
          name="btnEdit"
        >
          <el-button type="primary">编辑</el-button>
        </router-link>
      </template>
      <el-button
        v-if="detail.State == orderBasicState.Wait"
        @click="reviewStyleOrder"
        name="btnAudit"
      >审核</el-button>
      <el-button
        v-if="detail.State == orderBasicState.Audit"
        @click="openCancelReview"
        name="btnCancelAudit"
      >取消审核</el-button>
      <el-button
        v-if="detail.State == orderBasicState.Draft || detail.State == orderBasicState.Reject"
        @click="openObsolete"
        name="btnAbandon"
      >作废</el-button>
      <el-button name="btnBack" @click="$router.back(-1)">返回</el-button>
    </div>
    <!-- 作废 -->
    <obsolete
      v-if="obsoleteVisble"
      @visbleColse="visbleColse"
      @confirmObsolete="confirmObsolete"
      :data="operatingData"
      :visibleObs="obsoleteVisble"
    ></obsolete>
    <!-- 审核 -->
    <!-- <review-Dialog :auditDialog="auditDialog" title="审核" :data="operatingData" v-if="auditDialog"  @confirmClick="confirmAudit" @cancelClick="cancelAudit"></review-Dialog> -->
    <el-dialog title="审核" :visible.sync="auditDialog" width="750px" @close="cancelAudit">
      <el-form :label-position="'right'" label-width="100px">
        <el-row v-if="operatingData.length === 1">
          <el-col :span="10">
            <el-form-item label="单据编号：">
              <span :title="operatingData[0].orderNumber" class="orderNumber">{{operatingData[0].orderNumber}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="创建：">
              <span class="orderNumber">{{operatingData[0].CreateUser}} {{operatingData[0].CreateTime | filterDateTime}}</span>
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
                  @blur="returnInfo.auditReson = returnInfo.auditReson.trim()"
                ></el-input>
              </el-col>
            </el-row>
          </el-radio-group>
        </el-form-item>
        <div
          v-if="returnInfo.auditType == YNStatus.Yes && supplierList.length > 1 && operatingData[0].Preprice"
        >
          <div class="colorRed">
            <div>该单需要按供应商拆成多个单据，请为每个供应商设置应付款：</div>
            <div>
              总共应付款为：
              <span>{{$root.toFloat(operatingData[0].Preprice)}}</span>
            </div>
          </div>
          <el-form-item
            v-for="(item,index) in supplierList"
            :label="item.name + '：'"
            label-width="130"
            :key="index"
            style="margin-left: 30px;"
          >
            <el-input
              v-model="item.Preprice"
              placeholder="应付款"
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
    <!-- 取消审核 -->
    <cancel-Review
      :visibleCan="visibleCan"
      :data="operatingData"
      v-if="visibleCan"
      @confirmCancel="cancelConfirm"
      @visbleColse="cancelColse"
    ></cancel-Review>
  </div>
</template>

<script>
import { YNStatus, PurchaseType } from '@/enums/common.js'
import { StylePurchaseOrderBasicState } from '@/enums/stocking.js'
import {
  STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_GET,
  STOCKING_API_STYLE_PURCHASE_ORDER_ITEM_GETS,
  STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_ABANDON,
  STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_AUDIT,
  STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_REJECT,
  STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_CANCEL
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_PARTNERBASICLIST,
} from '@/apis/merchant.js'
import pagination from '@/components/pagination'
import obsolete from '@/components/purchase/obsolete'
import reviewDialog from '@/components/purchase/reviewDialog'
import cancelReview from '@/components/purchase/cancelReview'
export default {
  data() {
    return {
      YNStatus,
      orderBasicState: StylePurchaseOrderBasicState, // 订货单状态
      purchaseType: PurchaseType, // 进货方式
      loadindTop: false,
      supplierRow: [], // 供应商列表
      goodsData: [
        {
          urlImage:
            'http://pic21.nipic.com/20120519/5454342_154115399000_2.jpg',
          stock: 10,
          mark: 100,
          model: 'A001',
          title: '钻石铂金戒指'
        }
      ], // 货品数据
      queryForm: {
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageSize: 20, // 分页数据条数
        PageIndex: 1 // 当前页面位置
      },
      total: 0, // 总数据条数
      purchaseId: null,
      detail: {},
      tableData: [],
      operatingData: [],
      obsoleteVisble: false, // 作废弹窗
      auditDialog: false, // 审核弹窗
      visibleCan: false, // 取消审核弹窗
      returnInfo: {
        auditType: YNStatus.Yes, // 审核状态 1代表通过 3代表不通过
        auditReson: '' // 审核不通过理由
      }, // 审核信息
      supplierList: [] // 点击审核供应商信息
    }
  },
  computed: {},
  methods: {
    // init() {
    //   let query = this.$route.query
    //   this.purchaseId = query.id
    //   if (!this.purchaseId) {
    //     this.dataError()
    //   } else {
    //     this.getDatail()
    //     this.getGoods()
    //   }
    // },
    dataError(msg) {
      this.$confirm(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },
    getData() {
      this.loadindTop = true
      STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_GET({
        PurchaseId: this.purchaseId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.getGoods()
        }
        this.loadindTop = false
      })
    },
    getGoods() {
      this.loadindTop = true
      STOCKING_API_STYLE_PURCHASE_ORDER_ITEM_GETS({
        ...this.queryForm,
        PurchaseId: this.purchaseId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.loadindTop = false
      })
    },
    currentChange(val) {
      // 切换当前页
      this.queryForm.PageIndex = val
      this.getGoods()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.queryForm.PageSize = val
      this.queryForm.PageIndex = 1
      this.getGoods()
    },
    querySort(sort) {
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getGoods()
    },
    // 打开作废
    openObsolete() {
      this.operatingData = [
        { ...this.detail, orderNumber: this.detail.PurchaseCode }
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
        PurchaseId: this.operatingData[0].PurchaseId,
        CheckNote: note
      }
      STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_ABANDON(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '作废成功',
            type: 'success'
          })
          this.obsoleteVisble = false
          this.operatingData = []
          this.getData()
        }
      })
    },
    // 审核弹窗打开
    reviewStyleOrder() {
      const arr = this.detail.SplitPartnerIds.split(',')
      this.supplierList = arr.map(item => {
        const str = item.split(':')
        return { Preprice: 0, name: str[1], PartnerId: str[0] }
      })
      this.operatingData = this.detail
        ? [{ ...this.detail, orderNumber: this.detail.PurchaseCode }]
        : []
      this.auditDialog = true
    },
    // 审核确定
    confirmAudit() {
      const para = {
        PurchaseId: Number(this.operatingData[0].PurchaseId),
        CheckNote: this.returnInfo.auditReson
      }
      if (
        this.returnInfo.auditType === YNStatus.Yes &&
        this.supplierList.length > 1 &&
        this.supplierList[0].name != '' &&
        this.operatingData[0].Preprice
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
          return {
            Preprice: this.$root.toInt(item.Preprice),
            PartnerId: Number(item.PartnerId)
          }
        })
        if (preprice != this.operatingData[0].Preprice) {
          return this.$message.error('供应商的总额必须等于应付款')
        }
      } else if (
        this.returnInfo.auditType === YNStatus.Yes &&
        this.supplierList.length > 1 &&
        this.supplierList[0].name != '' &&
        this.operatingData[0].Preprice == 0
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
      this.$store.commit('SET_BTN_LOADING', true)
      if (YNStatus.Yes === this.returnInfo.auditType) {
        STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_AUDIT(para).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: '审核通过成功',
              type: 'success'
            })
            this.cancelAudit()
            this.getData()
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      } else if (YNStatus.No === this.returnInfo.auditType) {
        STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_REJECT(para).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: '审核退回成功',
              type: 'success'
            })
            this.cancelAudit()
            this.getData()
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }
    },
    // 关闭审核
    cancelAudit() {
      this.operatingData = []
      this.supplierList = []
      ;(this.returnInfo = {
        auditType: YNStatus.Yes, // 审核状态 1代表通过 3代表不通过
        auditReson: '' // 审核不通过理由
      }),
      (this.auditDialog = false)
    },
    // 打开取消审核
    openCancelReview() {
      this.operatingData = [
        { ...this.detail, orderNumber: this.detail.PurchaseCode }
      ]
      this.visibleCan = true
    },
    // 取消审核确定
    cancelConfirm(data) {
      const para = {
        PurchaseId: Number(this.operatingData[0].PurchaseId),
        CheckNote: data
      }
      STOCKING_API_STYLE_PURCHASE_ORDER_BASIC_CANCEL(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '取消审核成功',
            type: 'success'
          })
          this.cancelColse()
          this.getData()
        }
      })
    },
    // 取消审核关闭
    cancelColse() {
      this.operatingData = []
      this.visibleCan = false
    },
    // 获取供应商下拉
    getSupplierList() {
      MERCHANT_API_DROPDOWN_PARTNERBASICLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.supplierRow = res.data.Data.Rows
        }
      })
    },
  },
  mounted() {
    this.purchaseId = Number(this.$route.query.id)
    this.getData()
    this.getSupplierList()
  },
  watch: {
    // pageIndex: 'getGoods',
    // pageSize() {
    // this.pageIndex = 1
    // this.getGoods()
    // }
  },
  components: {
    pagination,
    obsolete,
    reviewDialog,
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
          width: 120px;
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
.float-l {
  float: left;
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
.orderNumber {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
