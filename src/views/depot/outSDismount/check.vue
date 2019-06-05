<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title fl">查看成品拆卸单</span>
        <!-- <span @click="$router.back(-1)" class="title text-btn fr">返回</span> -->
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="4" colspan="1" class="state-img">
                  <img src="@/assets/images/draft.png" v-if="detail.State === weiwGjunkSplitBasicState.Draft">
                  <img src="@/assets/images/auditing.png" v-if="detail.State === weiwGjunkSplitBasicState.Wait">
                  <img src="@/assets/images/audited.png" v-if="detail.State === weiwGjunkSplitBasicState.Audit">
                  <img src="@/assets/images/auditBack.png" v-if="detail.State === weiwGjunkSplitBasicState.Reject">
                  <img src="@/assets/images/abandon.png" v-if="detail.State === weiwGjunkSplitBasicState.Abandon || detail.State === weiwGjunkSplitBasicState.Cancel">
                  <div>{{weiwGjunkSplitBasicState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.SplitCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime|filterDateTime}}</td>
                <td class="tit">审核</td>
                <td v-if="detail.State === weiwGjunkSplitBasicState.Audit || detail.State === weiwGjunkSplitBasicState.Reject">
                  {{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime|filterDateTime}}
                </td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">仓库</td>
                <td>{{detail.WarehouseName}}{{detail.ShelfName?'>'+detail.ShelfName:''}}</td>
                <td class="tit">供应商</td>
                <td>{{detail.PartnerName}}</td>
                <td class="tit">拆卸原因</td>
                <td>{{detail.ReasonTypeDv}}</td>
              </tr>
              <tr>
                <td class="tit">备注</td>
                <td class="note" colspan="5">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="m-10">
          <div class="table-title">
            <!-- <i class="icon-list"></i> -->
            <span class="title">货品列表</span>
          </div>
          <el-row class="m-b-10">
            <el-col :span="24" class="tr">
              <span class="detail-info-num-item">
                条码数量：<b class="num">{{total}}</b>
              </span>
              <span class="detail-info-num-item">
                货品总数：<b class="num">{{detail.Quantity}}</b>
              </span>
            </el-col>
          </el-row>
          <el-table :data="tableData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
            <el-table-column prop="ItemId" label="序号" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="BarCode" label="条码" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoodsName" label="货品名称" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight" label="货重" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.Weight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column prop="GoldWeight" label="金重(g)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column prop="Stone1Weight" label="主石重" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.Stone1Weight, 3)}}ct
              </template>
            </el-table-column>
            <el-table-column prop="Stone1Qty" label="主石数" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Stone1Color" label="主石颜色" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{StoneColor.Types[scope.row.Stone1Color]}}
              </template>
            </el-table-column>
            <el-table-column prop="Stone1Clarity" label="主石净度" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{StoneClarity.Types[scope.row.Stone1Clarity]}}
              </template>
            </el-table-column>
            <el-table-column prop="Stone1Cut" label="主石切工" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{StoneCut.Types[scope.row.Stone1Cut]}}
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" label="数量" min-width="80" show-overflow-tooltip></el-table-column>
          </el-table>
          <pagination :pg="page.PageIndex" :size="page.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
        </div>
      </div>
    </div>
    <div class="buttons">
      <template>
        <router-link v-if="detail.State === weiwGjunkSplitBasicState.Draft||detail.State === weiwGjunkSplitBasicState.Reject" :to="{path:'/depot/outSDismount/edit',query:{id:detail.SplitId}}">
          <el-button type="primary">编辑</el-button>
        </router-link>
        <el-button v-if="detail.State === weiwGjunkSplitBasicState.Draft||detail.State === weiwGjunkSplitBasicState.Reject" @click="abandonDialog = true">作废</el-button>
      </template>
      <el-button v-if="detail.State === weiwGjunkSplitBasicState.Wait" type="primary" @click="auditDialog = true">审核</el-button>
      <el-button v-if="detail.State === weiwGjunkSplitBasicState.Audit" @click="cancelDialog = true">取消审核</el-button>
      <el-button @click="$router.back(-1)">返回</el-button> 
    </div>

    <!-- @module Dialog·审核 -->
    <auditDialog title="审核" v-if="auditDialog" :auditDialog="auditDialog" :data="[detail]" @listenAuditDialog="listenDialog"></auditDialog>
    <!-- End Dialog·审核 -->

    <!-- @module Dialog·取消审核 -->
    <cancelDialog title="取消审核" v-if="cancelDialog" :visible.sync="cancelDialog" :data="[detail]"  @listenCancelDialog="listenDialog"></cancelDialog>
    <!-- End Dialog·取消审核 -->

    <!-- @module Dialog·作废 -->
    <abandonDialog title="作废" v-if="abandonDialog" :abandonDialog="abandonDialog" :data="[detail]" @listenAbandonDialog="listenDialog"></abandonDialog>
    <!-- End Dialog·作废 -->
  </div>
</template>

<script>
import {
  YNStatus
} from '@/enums/common.js'
import {
  StoneColor,
  StoneClarity,
  StoneCut,
  WeiwGjunkSplitBasicState
} from '@/enums/stocking.js'
import {
  STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_GET,
  STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_GETSBYGOODS
} from '@/apis/stocking.js'

import pagination from '@/components/pagination'
import abandonDialog from './abandon'
import auditDialog from './audit'
import cancelDialog from './cancel'

export default {
  data() {
    return {
      YNStatus,
      StoneColor,
      StoneCut,
      StoneClarity,
      weiwGjunkSplitBasicState: WeiwGjunkSplitBasicState,
      page: {
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      tableData: [],
      SplitId: '',
      detail: {},
      editDialog: false,
      auditDialog: false,
      abandonDialog: false,
      cancelDialog: false
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.SplitId = Number(query.id)||0
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
      STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_GET({
        SplitId: this.SplitId
      }).then(res => {
        if(res.data.Code == 'CORRECT'){
          this.detail = res.data.Data
        }
      })
    },
    getGoods() {
      STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_GETSBYGOODS({
        SplitId: this.SplitId,
        OrderBy: 0,
        IsAsced: this.YNStatus.No,
        PageIndex: this.page.PageIndex,
        PageSize: this.page.PageSize
      }).then(res => {
        if(res.data.Code == 'CORRECT'){
          this.tableData = res.data.Data.Rows||[]
          this.total = res.data.Data.Count||0
        }
      })
    },
    listenDialog(type, success){
      if(success){
        this.getDetail()
      }
      this[type] = false
    },
    currentChange(val){
      this.page.PageIndex = val
      this.getGoods()
    },
    sizeChange(val){
      this.page.PageIndex = 1
      this.page.PageSize = val
      this.getGoods()
    },
    formatter(row, column, val){
      switch(column.property){
        case 'Stone1Color':
          return this.StoneColor.Types[val]
        case 'Stone1Clarity':
          return this.StoneClarity.Types[val]
        default:
          return this.$root.toFloat(val, 3)
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
    pagination,
    abandonDialog,
    auditDialog,
    cancelDialog
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
.m-b-1{
  margin-bottom: 1px;
}
</style>
