<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看旧货出库单</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="6" class="state-img">
                  <img src="@/assets/images/draft.png" v-if="detail.State === junkOutakeOrderBasicState.Draft">
                  <img src="@/assets/images/auditing.png" v-if="detail.State === junkOutakeOrderBasicState.Wait">
                  <img src="@/assets/images/audited.png" v-if="detail.State === junkOutakeOrderBasicState.Audit">
                  <img src="@/assets/images/auditBack.png" v-if="detail.State === junkOutakeOrderBasicState.Reject">
                  <img src="@/assets/images/abandon.png" v-if="detail.State === junkOutakeOrderBasicState.Abandon || detail.State === junkOutakeOrderBasicState.Cancel">
                  <div>{{junkOutakeOrderBasicState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.OutakeCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime|filterDateTime}}</td>
                <td class="tit">审核</td>
                <td v-if="detail.State === junkOutakeOrderBasicState.Audit || detail.State === junkOutakeOrderBasicState.Reject">
                  {{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime|filterDateTime}}
                </td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td v-if="characterType != CharacterType.Store" class="tit">出库仓库</td>
                <td v-if="characterType != CharacterType.Store" class="note">{{detail.WarehouseName}} > {{detail.ShelfName}}</td>
                <td class="tit">出库原因</td>
                <td>{{detail.ReasonTypeDv}}</td>
                <td class="tit">出库对象</td>
                <td>{{detail.TargetName}}</td>
                <td v-if="characterType == CharacterType.Store" class="tit">业务日期：</td>
                <td v-if="characterType == CharacterType.Store" class="note">{{detail.ActualDate|filterDate}}</td>
              </tr>
              <tr>
                <td v-if="characterType != CharacterType.Store" class="tit">业务日期：</td>
                <td v-if="characterType != CharacterType.Store" class="note">{{detail.ActualDate|filterDate}}</td>
                <td class="tit">备注</td>
                <td class="note" colspan="5">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="checkPage-hd">
          <el-row>
            <el-col :span="12">
              <!-- <i class="icon-list"></i> -->
              <span class="title">货品列表</span>
            </el-col>
            <el-col :span="12" class="tr">
              <span class="detail-info-num-item">
                总件数：<b class="num">{{detail.Quantity}}</b>
              </span>
              <span class="detail-info-num-item">
                总金重：<b class="num">{{$root.toFloat(detail.GoldWeight, 3)}}(g)</b>
              </span>
              <span class="detail-info-num-item">
                总金额：<b class="num">￥{{ $root.toFloat(detail.Preprice) }}(元)</b>
              </span>
              <span class="detail-info-num-item">
                总工费：<b class="num">￥{{ $root.toFloat(detail.RecallFee) }}(元)</b>
              </span>
            </el-col>
          </el-row>
        </div>
        <div class="p-x-10">
          <!-- @module 数据表格 -->
          <el-table :data="goodsData" @sort-change="sortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
            <el-table-column prop="JunkCode" label="旧货编号" min-width="140" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="init-button-text" @click="checkGold(scope.row.JunkId,scope.row.IsGold)" name="btnCheckGold">{{scope.row.JunkCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="JunkName" label="旧货名称" min-width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="IsGold" label="类型" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.IsGold ?'素金':'非素'}}
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
            <el-table-column prop="GoldWeight" label="金重" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column prop="RecallGoldPrice" label="回收金价(元/g)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallGoldPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="RecallFee" label="回收工费(元)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallFee)}}
              </template>
            </el-table-column>
            <el-table-column prop="RecallPrice" label="回收金额(元)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="CreateTime" label="回收时间" min-width="120" sortable="custom" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.CreateTime|filterDateTime}}
              </template>
            </el-table-column>
          </el-table>
          <!-- End 数据表格 -->
          <!-- Pagination -->
          <pagination :pg="pageIndex" :size="pageSize" :total="totalCount" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
          <!-- end Pagination -->
        </div>
      </div>
    </div>
    <div class="buttons">
      <template v-if="detail.State == junkOutakeOrderBasicState.Reject || detail.State == junkOutakeOrderBasicState.Draft">
        <router-link :to="{path:'/depot/junkOtherOut/edit',query:{id:OutakeId}}" name="btnJunkOutEdit">
          <el-button type="primary">
            编辑
          </el-button>
        </router-link>
      </template>
      <el-button v-if="detail.State == junkOutakeOrderBasicState.Wait" type="primary" @click="junkOutAudit" name="btnJunkOutAudit">审核</el-button>
      <el-button v-if="detail.State == junkOutakeOrderBasicState.Audit" @click="junkOutNoAudit" name="btnJunkOutNoAudit">取消审核</el-button>
      <el-button v-if="detail.State == junkOutakeOrderBasicState.Draft || detail.State == junkOutakeOrderBasicState.Reject" @click="toDie" name="btnToDie">作废</el-button>
      <el-button @click="printJunkChange" name="btnDownloadData">打印</el-button>
      <el-button @click="$router.back(-1)">返回</el-button>
    </div>

    <!-- @module Dialog·审核 -->
    <junk-audit title="审核" v-if="auditDialog" :auditDialog="auditDialog" :data="[detail]" @listenAuditDialog="listenAllDialog"></junk-audit>
    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <junk-abandon title="作废" v-if="abandonDialog" :abandonDialog="abandonDialog" :data="[detail]" @listenAbandonDialog="listenAllDialog"></junk-abandon>
    <!-- End Dialog·作废 -->

    <!-- @module Dialog·取消审核 -->
    <junk-cancel title="取消审核" v-if="cancelDialog" :cancelDialog="cancelDialog" :data="[detail]" @listenCancelDialog="listenAllDialog"></junk-cancel>
    <!-- End Dialog·取消审核 -->

    <!-- @module 查看素金 -->
    <goldCheck v-if="checkDialog" :checkDialog="checkDialog" v-on:closeDialog=" checkDialog = !checkDialog " :checkInfo="checkParams"></goldCheck>
    <!-- end -->

    <!-- @module Dialog·打印 -->
    <print-order title="打印" v-if="printDialog" :visible.sync="printDialog" :conditions="encodeURIComponent(JSON.stringify({OrderId: OutakeId}))" :printingType="settingPrintingType.StockingCloudJunkOutakeOrderBasic"></print-order>
    <!-- End Dialog·打印 -->
  </div>
</template>

<script>
import {
  JunkOutakeOrderBasicState
} from '@/enums/stocking.js'
import {
  SettingPrintingType
} from '@/enums/merchant.js'
import {
  CharacterType,
  YNStatus
} from '@/enums/common.js'
import {
  STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_GET,
  STOCKING_API_JUNK_OUTAKE_ORDER_ITEM_GETS
} from '@/apis/stocking.js'

import goodsDetails from '@/components/erp/goodsDetails'
import GoldCheck from '@/components/erp/goldCheck'
import junkAudit from './audit'
import junkAbandon from './abandon'
import junkCancel from './cancel'
import pagination from '@/components/pagination'
import printOrder from '@/components/erp/printOrder'

export default {
  data() {
    return {
      YNStatus,
      CharacterType,
      settingPrintingType: SettingPrintingType,
      junkOutakeOrderBasicState: JunkOutakeOrderBasicState,
      data: [],
      goodsData: [], // 货品数据
      pageSize: 20, // 分页数据条数
      pageIndex: 1, // 当前页面位置
      totalCount: 0, // 总数据条数
      OutakeId: '',
      checkParams: {
      },
      checkDialog: false,
      detail: {
        GoldWeight: 0,
        Price: 0,
        RecallFee: 0,
        OutakeId: '',
        SupplierId: '',
        ArrivalCode: '',
        Note: ''
      },
      editDialog: false,
      auditDialog: false,
      abandonDialog: false,
      cancelDialog: false,
      printDialog: false
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.pageSize = this.$route.query.size || 20
      this.pageIndex = this.$route.query.pg || 1
      this.OutakeId = Number(query.id)||0
      if (!this.OutakeId) {
        this.dataError()
      } else {
        this.getDetail()
        this.getGoods()
      }
    },
    dataError(msg) {
      // 错误返回
      this.$confirm(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },
    getDetail() {
      // 获取基本信息
      STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_GET({
        OutakeId: this.OutakeId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
      })
    },
    getGoods() {
      // 获取表单list
      STOCKING_API_JUNK_OUTAKE_ORDER_ITEM_GETS({
        OutakeId: this.OutakeId,
        IsAsced	: this.isAsc,
        OrderBy: 0,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.totalCount = res.data.Data.Count || 0
        } else {
          this.$message.error(res.data.Message)
          this.goodsData = []
        }
      })
    },
    sortChange(sort) {
      // 排序
      switch (sort.prop) {
        case 'CreateTime':
          this.orderBy = 0
          break
        case 'OutCode':
          this.orderBy = 1
          break
        default:
          this.orderBy = 3
          break
      }
      this.isAsc =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.init()
    },
    checkGold(id, type) {
      // 查看素金
      this.checkParams = {
        type: type,
        id: id
      }
      this.checkDialog = !this.checkDialog
    },
    printJunkChange(){
      this.printDialog = true
    },
    listenAllDialog(type, success) {
      // 监听全部窗口关闭
      if (success) {
        this.getDetail()
      }
      this[type] = false
    },
    toDie() {
      // 作废
      this.abandonDialog = !this.abandonDialog
    },
    junkOutAudit() {
      // 审核
      this.auditDialog = !this.auditDialog
    },
    junkOutNoAudit() {
      // 取消审核
      this.cancelDialog = !this.cancelDialog
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
    },
    pageChange(val) {
      this.pageIndex = val
      this.getGoods()
    },
    pageSizeChange(val) {
      this.pageIndex = 1
      this.pageSize = val
      this.getGoods()
    },
  },
  created() {
    this.getStoreAllType()
  },
  mounted() {
    this.init()
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  watch: {
    $route: 'init'
  },
  components: {
    goodsDetails,
    junkAudit,
    junkCancel,
    junkAbandon,
    pagination,
    GoldCheck,
    printOrder,
  }
}
</script>

<style lang="scss">
</style>
