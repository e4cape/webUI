<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看旧货调拨出库单</span>
        <!-- <span class="fr title">
          <el-button type="text" @click="$router.back(-1)">
            返回
          </el-button>
        </span> -->
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="7" class="state-img">
                  <img src="@/assets/images/draft.png" v-if="detail.State === junkAllotOrderOutakeState.Draft">
                  <img src="@/assets/images/auditing.png" v-if="detail.State === junkAllotOrderOutakeState.Wait">
                  <img src="@/assets/images/audited.png" v-if="detail.State === junkAllotOrderOutakeState.Audit">
                  <img src="@/assets/images/auditBack.png" v-if="detail.State === junkAllotOrderOutakeState.Reject">
                  <img src="@/assets/images/abandon.png" v-if="detail.State === junkAllotOrderOutakeState.Abandon || detail.State === junkAllotOrderOutakeState.Cancel">
                  <div>{{junkAllotOrderOutakeState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.OutakeCode}}</td>
                <td class="tit">创建：</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime|filterDateTime}}</td>
                <td class="tit">审核：</td>
                <td v-if="detail.State === junkAllotOrderOutakeState.Audit || detail.State === junkAllotOrderOutakeState.Reject">
                  {{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime|filterDateTime}}
                </td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">发货位置：</td>
                <td class="note" v-if="characterType != CharacterType.Store" colspan="1">{{detail.WarehouseName1}} > {{detail.ShelfName1}}</td>
                <td class="note" v-else colspan="1">{{detail.StoreName1}}</td>
                <td class="tit">调拨原因：</td>
                <td class="note" colspan="1">{{detail.ReasonTypeDv}}</td>
                <td class="tit">收货单位：</td>
                <!-- <td class="note" colspan="3">{{detail.StoreName2}}</td> -->
                <td v-if="detail.StoreName2">{{detail.StoreName2}}</td>
                <!-- <td v-else class="note" colspan="3">{{detail.WarehouseName2 == 0?'总部仓库':(detail.WarehouseName2 + '&nbsp;&gt;&nbsp;' + detail.ShelfName2)}}</td> -->
                <td v-else class="note" colspan="3">{{detail.UnitedName2}}</td>
              </tr>
              <tr>
                <td class="tit">收货方式：</td>
                <td class="note" colspan="1">{{shippingType.Types[detail.ShippingType]}}</td>
                <td class="tit">发货人：</td>
                <td class="note" colspan="1">{{detail.SendUser}}</td>
                <td class="tit">发货人电话：</td>
                <td class="note" colspan="3">{{detail.SendPhone}}</td>
              </tr>
              <tr>
                <td class="tit">收货人：</td>
                <td class="note" colspan="1">{{detail.ReceiptUser}}</td>
                <td class="tit">收货人电话：</td>
                <td class="note" colspan="1">{{detail.ReceiptPhone}}</td>
                <td class="tit">发快递公司：</td>
                <td class="note" colspan="3">{{ExpressType.Types[detail.ExpressType]}}</td>
              </tr>
              <tr>
                <td class="tit">快递单号：</td>
                <td class="note">{{detail.ExpressCode}}</td>
                <td class="tit">业务日期：</td>
                <td class="note" colspan="3">{{detail.ActualDate|filterDate}}</td>
              </tr>
              <tr>
                <td class="tit">备注：</td>
                <td class="note" colspan="5">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="checkPage-hd">
          <el-row>
            <el-col :span="12">
              <i class="icon-list"></i>
              <span class="title">货品列表</span>
            </el-col>
            <el-col :span="12" class="tr">
              <span class="detail-info-num-item">
                总件数：<b class="num">{{detail.Quantity}}</b>
              </span>
              <span class="detail-info-num-item">
                总金重：<b class="num">{{ $root.toFloat(detail.GoldWeight,3)}}g</b>
              </span>
              <span class="detail-info-num-item">
                结算金额：<b class="num">￥{{ $root.toFloat(detail.Preprice) }}元</b>
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
                {{scope.row.IsGold == YNStatus.Yes ?'素金':'非素'}}
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
            <el-table-column prop="RecallPrice" label="回收金额(元)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="RecallFee" label="回收工费(元)" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallFee)}}
              </template>
            </el-table-column>
            <el-table-column prop="CreateTime" label="回收时间" min-width="120" sortable="custom" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.CreateTime | filterDateTime}}
              </template>
            </el-table-column>
            <el-table-column prop="Price" label="结算金额(元)" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.Price)}}
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
      <template v-if="detail.State == junkAllotOrderOutakeState.Reject || detail.State == junkAllotOrderOutakeState.Draft">
        <router-link :to="{path:'/depot/junkAllotOut/edit',query:{id:OutakeId}}" name="btnJunkOutEdit">
          <el-button type="primary">
            编辑
          </el-button>
        </router-link>
      </template>
      <el-button v-if="detail.State == junkAllotOrderOutakeState.Wait"  type="primary" @click="auditDialog = true" name="btnJunkOutAudit">审核</el-button>
      <!-- <el-button v-if="detail.State == junkAllotOrderOutakeState.Audit" @click="junkOutNoAudit" name="btnJunkOutNoAudit">取消审核</el-button> -->
      <el-button v-if="detail.State == junkAllotOrderOutakeState.Draft || detail.State == junkAllotOrderOutakeState.Reject" @click="toDie" name="btnToDie">作废</el-button>
      <el-button @click="$router.back(-1)">返回</el-button>
    </div>

    <!-- @module Dialog·审核 -->
    <junk-audit title="审核" v-if="auditDialog" :auditDialog="auditDialog"  :data="[detail]" @listenAuditDialog="listenDialog"></junk-audit>
    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <junk-abandon title="作废" v-if="abandonDialog" :abandonDialog="abandonDialog" :selections="[detail]" @listenAbandonDialog="listenDialog"></junk-abandon>
    <!-- End Dialog·作废 -->

    <!-- @module 查看素金 -->
    <goldCheck v-if="checkDialog" :checkDialog="checkDialog" v-on:closeDialog=" checkDialog = !checkDialog " :checkInfo="checkParams"></goldCheck>
    <!-- end -->
  </div>
</template>

<script>
import {
  YNStatus,
  ExpressType,
  ShippingType,
  CharacterType
} from '@/enums/common.js'
import {
  JunkAllotOrderOutakeState
} from '@/enums/stocking.js'
import {
  STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_GET,
  STOCKING_API_JUNK_ALLOT_ORDER_ITEM_GETS
} from '@/apis/stocking.js'

import goodsDetails from '@/components/erp/goodsDetails'
import GoldCheck from '@/components/erp/goldCheck'
import junkAudit from './audit'
import junkAbandon from './abandon'
import pagination from '@/components/pagination'

export default {
  data() {
    return {
      YNStatus,
      ExpressType,
      CharacterType,
      shippingType: ShippingType,
      junkAllotOrderOutakeState: JunkAllotOrderOutakeState,
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
      this.OutakeId = query.id
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
      STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_GET({
        OutakeId: this.OutakeId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
      })
    },
    getGoods() {
      // 获取表单list
      STOCKING_API_JUNK_ALLOT_ORDER_ITEM_GETS({
        OutakeId: this.OutakeId,
        IsAsced: this.YNStatus.No,
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
    listenDialog(type, success) {
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
  watch: {
    $route: 'init'
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  components: {
    goodsDetails,
    junkAudit,
    junkAbandon,
    pagination,
    GoldCheck
  }
}
</script>

<style lang="scss">
</style>
