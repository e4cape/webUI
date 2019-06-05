<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title fl">查看旧货委外拆卸单</span>
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
                总件数：<b class="num">{{detail.Quantity}}</b>
              </span>
              <span class="detail-info-num-item">
                总金重：<b class="num">{{ $root.toFloat(detail.GoldWeight, 3) }}g</b>
              </span>
              <span class="detail-info-num-item">
                总金额：<b class="num">￥{{ $root.toFloat(detail.Preprice) }}元</b>
              </span>
            </el-col>
          </el-row>
          <el-table :data="tableData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
            <el-table-column prop="JunkCode" label="旧货编号" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="text-btn" @click="checkGold({'type':scope.row.IsGold === YNStatus.Yes ? true : false , id: scope.row.JunkId})">{{scope.row.JunkCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="JunkName" label="旧货名称" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="IsGold" label="类型" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.IsGold == YNStatus.Yes?'素金':'非素'}}
              </template>
            </el-table-column>
            <el-table-column prop="MaterialType" label="材质" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$store.getters.materialType.Types[scope.row.MaterialType]}}
              </template>
            </el-table-column>
            <el-table-column prop="CategoryType" label="品类" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$store.getters.categoryType.Types[scope.row.CategoryType]}}
              </template>
            </el-table-column>
            <el-table-column prop="GoldType" label="成色" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$store.getters.goldType.Types[scope.row.GoldType]}}
              </template>
            </el-table-column>
            <el-table-column prop="GoldWeight" label="金重(g)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column prop="RecallGoldPrice" label="回收金价(元/g)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallGoldPrice)}}
              </template></el-table-column>
            <el-table-column prop="RecallPrice" label="回收金额(元)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="CreateTime" label="回收时间" min-width="80"  show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.CreateTime|filterDateTime}}
              </template>
            </el-table-column>
          </el-table>
          <pagination :pg="page.PageIndex" :size="page.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
        </div>
      </div>
    </div>
    <div class="buttons">
      <template v-if="detail.State === weiwGjunkSplitBasicState.Draft || detail.State === weiwGjunkSplitBasicState.Reject">
        <router-link :to="{path:'/depot/oldOutSDismount/edit',query:{id:detail.SplitId}}">
          <el-button type="primary">编辑</el-button>
        </router-link>
      </template>
      <el-button v-if="detail.State === weiwGjunkSplitBasicState.Wait" type="primary" @click="auditDialog = true">审核</el-button>
      <el-button v-if="detail.State === weiwGjunkSplitBasicState.Audit" @click="cancelDialog = true">取消审核</el-button>
      <el-button v-if="detail.State === weiwGjunkSplitBasicState.Draft || detail.State === weiwGjunkSplitBasicState.Reject" @click="abandonDialog = true">作废</el-button>
      <el-button @click="$router.back(-1)">返回</el-button>
    </div>

    <!-- @module Dialog·审核 -->
    <auditDialog title="审核" v-if="auditDialog" :auditDialog="auditDialog" :data="[detail]" @listenAuditDialog="listenDialog"></auditDialog>
    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <abandonDialog title="作废" v-if="abandonDialog" :abandonDialog="abandonDialog" :data="[detail]" @listenAbandonDialog="listenDialog"></abandonDialog>
    <!-- End Dialog·作废 -->

    <!-- @module Dialog·取消审核 -->
    <cancelDialog title="取消审核" v-if="cancelDialog" :cancelDialog="cancelDialog" :data="[detail]" @listenCancelDialog="listenDialog"></cancelDialog>
    <!-- End Dialog·取消审核 -->

    <!-- 查看素金 & 非素 -->
    <goldCheck v-if="checkDialog" :checkDialog="checkDialog" v-on:closeDialog=" checkDialog = !checkDialog " :checkInfo="checkParams"></goldCheck>
    <!-- end 查看素金 & 非素 -->
  </div>
</template>

<script>
import {
  YNStatus
} from '@/enums/common.js'
import {
  WeiwGjunkSplitBasicState
} from '@/enums/stocking.js'
import {
  STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_GET2,
  STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_GETSBYJUNK
} from '@/apis/stocking.js'

import auditDialog from './audit'
import cancelDialog from './cancel'
import abandonDialog from './abandon'
import goldCheck from '@/components/erp/goldCheck'
import pagination from '@/components/pagination'
export default {
  data() {
    return {
      YNStatus,
      goodsData: [], // 货品数据
      weiwGjunkSplitBasicState: WeiwGjunkSplitBasicState,
      SplitId: '',
      detail: {},
      total: 0,
      page: {
        PageIndex: 1,
        PageSize: 20
      },
      tableData: [],
      checkParams: {
        type: false,
        id: ''
      },
      goodsId: '', // 选中的货品id
      editDialog: false,
      auditDialog: false,
      abandonDialog: false,
      cancelDialog: false,
      printDialog: false,
      checkDialog: false
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
      STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_GET2({SplitId: this.SplitId}).then(res => {
        if(res.data.Code == 'CORRECT'){
          this.detail = res.data.Data
        }
      })
    },
    getGoods() {
      STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_GETSBYJUNK({
        SplitId: this.SplitId,
        OrderBy: 0,
        IsAsced: this.YNStatus.No,
        PageIndex: this.page.PageIndex,
        PageSize: this.page.PageSize,
      }).then(res => {
        if(res.data.Code == 'CORRECT'){
          this.tableData = res.data.Data.Rows||[]
          this.total = res.data.Data.Count||0
        }
      })
    },
    listenDialog(type, success) {
      if (success) {
        this.getDetail()
      }
      this[type] = false
    },
    checkGold(obj){
      // 查看素金
      this.checkParams = obj
      this.checkDialog = true
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
    getEnums() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
    },
  },
  created() {
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  components: {
    auditDialog,
    cancelDialog,
    abandonDialog,
    goldCheck,
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
.m-b-1{
  margin-bottom: 1px;
}
</style>
