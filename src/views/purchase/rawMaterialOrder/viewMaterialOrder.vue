<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title fl">查看原料订货单（{{stuffType.Types[detail.StuffType]}}）</span>
      </div>
      <div class="hd" v-loading="loadindTop">
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
              <th>供应商</th>
              <td>{{detail.PartnerName}}</td>
              <th>业务日期</th>
              <td>{{detail.ActualDate | filterDate}}</td>
              <th>应付款</th>
              <td>{{this.$root.toFloat(detail.Preprice)}}</td>
            </tr>
            <tr>
              <th>预计到货日期</th>
              <td>{{detail.ForwdDate | filterDate}}</td>
              <th>备注</th>
              <td>{{detail.Note}}</td>
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
      <!-- @module 数据表格 -->
      <el-table :data="tableData" v-if="detail.StuffType == stuffType.Gold">
        <el-table-column label="序号" width="50" type="index"></el-table-column>
        <el-table-column label="成色" width="180">
          <template slot-scope="scope">{{goldType.Types[scope.row.GoldType]}}</template>
        </el-table-column>
        <el-table-column min-width="100" label="金重(g)">
          <template slot-scope="scope">{{$root.toFloat(scope.row.Weight,3)}}</template>
        </el-table-column>
        <el-table-column prop="Quantity" min-width="100" label="件数"></el-table-column>
      </el-table>
      <el-table :data="tableData" v-else-if="detail.StuffType == stuffType.Stone">
        <el-table-column label="序号" width="50" type="index"></el-table-column>
        <el-table-column label="石类" min-width="100" prop="StoneClassTypeEv">
        </el-table-column>
        <el-table-column label="石重范围(ct)" min-width="100" prop="StoneWeightEv">
        </el-table-column>
        <el-table-column label="颜色" min-width="100">
          <template slot-scope="scope">
            {{stoneColor.Types[scope.row.StoneColor]}}
          </template>
        </el-table-column>
        <el-table-column label="净度" min-width="100">
          <template slot-scope="scope">
            {{stoneClarity.Types[scope.row.StoneClarity]}}
          </template>
        </el-table-column>
        <el-table-column label="切工" min-width="100">
          <template slot-scope="scope">
            {{scope.row.StoneCut}}
          </template>
        </el-table-column>
        <el-table-column label="规格" min-width="100" prop="StoneSpec"></el-table-column>
        <el-table-column label="数量" min-width="100" prop="Quantity">
        </el-table-column>
        <el-table-column label="重量(ct)" min-width="100">
          <template slot-scope="scope">{{$root.toFloat(scope.row.Weight, 3)}}</template>
        </el-table-column>
      </el-table>
      <el-table :data="tableData" v-else-if="detail.StuffType == stuffType.Part">
        <el-table-column label="序号" width="50" type="index"></el-table-column>
        <el-table-column label="配件名称" min-width="100" prop="PartTypeEv">
        </el-table-column>
        <el-table-column label="数量" min-width="100" prop="Quantity">
        </el-table-column>
        <el-table-column label="重量" min-width="100">
          <template slot-scope="scope">
            {{$root.toFloat(scope.row.Weight, 3)}}
          </template>
        </el-table-column>
      </el-table>
      <!-- End 数据表格 -->
    </div>
    <div class="buttons">
      <template
        v-if="detail.State == orderBasicState.Draft ||detail.State == orderBasicState.Reject"
      >
        <router-link
          :to="{path:'/purchase/rawMaterialOrder/editMaterialOrder',query:{id:detail.PurchaseId, type: detail.StuffType}}"
          name="btnEdit"
        >
          <el-button type="primary">编辑</el-button>
        </router-link>
      </template>
      <el-button
        @click="reviewStyleOrder"
        name="btnAudit"
        v-if="detail.State == orderBasicState.Wait"
      >审核</el-button>
      <el-button
        @click="openCancelReview"
        name="btnCancelAudit"
        v-if="detail.State == orderBasicState.Audit"
      >取消审核</el-button>
      <el-button
        @click="openObsolete"
        name="btnAbandon"
        v-if="detail.State == orderBasicState.Draft || detail.State == orderBasicState.Reject"
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
    <review-Dialog
      :auditDialog="auditDialog"
      title="审核"
      :data="operatingData"
      v-if="auditDialog"
      @confirmClick="confirmAudit"
      @cancelClick="cancelAudit"
    ></review-Dialog>
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
import {
  YNStatus,
  CharacterType,
  // StoreType,
  // PurchaseType,
  StuffType,
} from '@/enums/common.js'
import {
  StuffPurchaseOrderBasicState,
  GoldType,
  FinanceType,
  StoneCut,
  SettingEnumeratorEnumeratorType,
  StoneClarity,
  StoneColor
} from '@/enums/stocking.js'
import {
  STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_GET,
  STOCKING_API_STUFF_PURCHASE_ORDER_ITEM_GETS,
  STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_AUDIT,
  STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_REJECT,
  STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_CANCEL,
  STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_ABANDON
} from '@/apis/stocking.js'
import { MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST } from '@/apis/merchant.js'
import goodsDetails from '@/components/erp/goodsDetails'
import obsolete from '@/components/purchase/obsolete'
import reviewDialog from '@/components/purchase/reviewDialog'
import cancelReview from '@/components/purchase/cancelReview'

export default {
  data() {
    return {
      StoneCut,
      stoneClarity: StoneClarity,
      loadindTop: false,
      characterTypes: CharacterType,
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
      goldType: GoldType, // 成色
      stuffType: StuffType, // 原料下拉
      stoneColor: StoneColor, // 颜色
      orderBasicState: StuffPurchaseOrderBasicState, // 订货单状态
      financeTypes: FinanceType,
      paginationSizes: [10, 15, 20], // 分页数据条数数组
      pageSize: 20, // 分页数据条数
      pageIndex: 1, // 当前页面位置
      totalCount: 0, // 总数据条数
      indexPageSize: 20, // 列表序号，分页数据条数
      indexPageIndex: 1, // 列表序号，当前页面位置
      indexTotalCount: 0, // 列表序号，总数据条数
      purchaseId: '',
      detail: {},
      goodsId: '', // 选中的货品id
      editDialog: false,
      auditDialog: false,
      abandonDialog: false,
      cancelDialog: false,
      printDialog: false,
      visibleCan: false, // 取消审核弹窗
      obsoleteVisble: false, // 作废弹窗
      operatingData: [],
      storeVal: 0,
      dividendVal: 0,
      tableData: [],
      parameters: {
        PurchaseId: '',
        PageIndex: 1,
        PageSize: 20
      },
      stoneRange: [],
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
      this.parameters.PurchaseId = query.id
      if (!this.parameters.PurchaseId) {
        this.dataError()
      } else {
        this.getData()
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
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_GET({
        PurchaseId: this.parameters.PurchaseId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.getItems()
        }
        this.$store.commit('SET_TB_LOADING', false)
        this.getTypeList()
      })
    },
    getItems() {
      this.$store.commit('SET_TB_LOADING', true)
      // 货品列表
      STOCKING_API_STUFF_PURCHASE_ORDER_ITEM_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
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
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_ABANDON(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '作废成功',
            type: 'success'
          })
          this.obsoleteVisble = false
          this.operatingData = []
          this.getData()
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    // 关闭审核
    cancelAudit() {
      this.operatingData = []
      this.auditDialog = false
    },
    // 打开取消审核
    openCancelReview() {
      this.operatingData = [
        { ...this.detail, orderNumber: this.detail.PurchaseCode }
      ]
      this.visibleCan = true
    },
    // 打开审核和批量审核弹窗
    reviewStyleOrder() {
      this.operatingData = [
        { ...this.detail, orderNumber: this.detail.PurchaseCode }
      ]
      this.auditDialog = true
    },
    // 审核确定
    confirmAudit(data) {
      const para = {
        PurchaseId: Number(this.operatingData[0].PurchaseId),
        CheckNote: data.auditReson
      }
      if (YNStatus.Yes === data.auditType) {
        STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_AUDIT(para).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: '审核通过成功',
              type: 'success'
            })
            this.auditDialog = false
            this.operatingData = []
            this.getData()
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      } else if (YNStatus.No === data.auditType) {
        STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_REJECT(para).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: '审核退回成功',
              type: 'success'
            })
            this.auditDialog = false
            this.operatingData = []
            this.getData()
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }
    },
    // 取消审核确定
    cancelConfirm(data) {
      const para = {
        PurchaseId: Number(this.operatingData[0].PurchaseId),
        CheckNote: data
      }
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_CANCEL(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '取消审核成功',
            type: 'success'
          })
          this.cancelColse()
          this.getData()
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    // 取消审核关闭
    cancelColse() {
      this.operatingData = []
      this.visibleCan = false
    },
    getTypeList() {
      let enumeratorType
      if (this.tableData.StuffType == StuffType.Gold) {
        enumeratorType = SettingEnumeratorEnumeratorType.GoldType
      }
      if (this.tableData.StuffType == StuffType.Stone) {
        enumeratorType = SettingEnumeratorEnumeratorType.StoneClassType
        MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
          EnumeratorType: SettingEnumeratorEnumeratorType.StoneWeight,
          IsEnable: YNStatus.Yes
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.stoneRange = res.data.Data.Rows
          }
        })
      }
      if (this.tableData.StuffType == StuffType.Part) {
        enumeratorType = SettingEnumeratorEnumeratorType.PartType
      }
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: enumeratorType,
        IsEnable: YNStatus.Yes
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.majorList = res.data.Data.Rows
        }
      })
    }
  },
  mounted() {
    this.$store.commit('SET_BTN_LOADING', false)
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
          word-break: break-all;
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
</style>
