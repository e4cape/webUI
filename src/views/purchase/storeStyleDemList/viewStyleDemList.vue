<template>
  <div class="content" v-loading="$store.getters.tb_loading">
    <div class="panel">
      <div class="panel-hd">
        <span class="title fl">查看款式需求单({{detail.KindTypeEv}})</span>
      </div>
      <div class="panel-bd gift-info-cell">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="4" colspan="1" class="state-img">
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
                <td>{{detail.RequireCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateTime}}</td>
                <td class="tit">审核</td>
                <td v-if="detail.State === orderBasicState.Audit || detail.State === orderBasicState.Reject">{{detail.CheckUser}} {{detail.CheckTime | filterDateTime}}</td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">门店</td>
                <td>{{detail.StoreName}}</td>
                <td class="tit">门店类型</td>
                <td>{{storeType.Types[detail.StoreType]}}</td>
                <td class="tit">货品类型</td>
                <td>{{detail.KindTypeEv}}</td>
              </tr>
              <tr>
                <td class="tit">业务日期</td>
                <td>{{detail.ActualDate | filterDate}}</td>
                <td class="tit">期望到货日期</td>
                <td>{{detail.ForwdDate | filterDate}}</td>
                <td class="tit">备注</td>
                <td class="note">{{detail.Note}}</td>
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
            <el-col :span="12" class="tr" style="padding-right: 10px;">
            <span class="detail-info-num-item">
              数量：
              <b class="num">{{detail.ItemQty}}</b>
            </span>
          </el-col>
          </el-row>
        </div>
        <el-table
          :data="goodData"
          v-loading="$store.getters.tb_loading"
          element-loading-text="拼命加载中"
        >
          <el-table-column label="图片" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <img :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl" alt="" class="m-r-5" v-if="scope.row.ImageUrl != ''">
              <img src="@/assets/images/pic.jpg" width="60" height="60" v-else class="m-r-5 fl item-img">
            </template>
          </el-table-column>
          <el-table-column prop="StyleCode" label="款号" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="StyleName" label="款式名称" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="CategoryTypeEv" label="材质" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="KindTypeEv" label="品类" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="GoldWeight" label="金重(g)" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="StoneWeight" label="主石" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Size" label="尺寸" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Note" label="备注" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Quantity" label="数量" min-width="80" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="buttons">
      <template
        v-if="(detail.State == orderBasicState.Reject || detail.State == orderBasicState.Draft)"
      >
        <router-link
          :to="{path:'/purchase/storeStyleDemList/editStyleDemList',query: {id: $route.query.id}}"
          name="btnEdit"
        >
          <el-button type="primary">编辑</el-button>
        </router-link>
        <el-button @click="openObsolete" name="btnAbandon">作废</el-button>
      </template>
      <el-button
        type="primary"
        @click="reviewStyleOrder"
        v-if="$store.getters.user_session.CharacterType === characterType.Company && detail.State === orderBasicState.Wait"
        name="btnAudit"
      >审核</el-button>
      <el-button
        @click="openCancelReview"
        v-if="$store.getters.user_session.CharacterType === characterType.Company && detail.State === orderBasicState.Audit"
        name="btnCancelAudit"
      >取消审核</el-button>
      <el-button @click="$router.back(-1)" name="returnBack">返回</el-button>
    </div>
    <!-- 审核 -->
    <review-Dialog
      :auditDialog="auditDialog"
      title="审核"
      :data="operatingData"
      v-if="auditDialog"
      @confirmClick="confirmAudit"
      @cancelClick="cancelAudit"
    ></review-Dialog>
    <!-- 作废 -->
    <obsolete
      v-if="obsoleteVisble"
      @visbleColse="visbleColse"
      @confirmObsolete="confirmObsolete"
      :data="operatingData"
      :visibleObs="obsoleteVisble"
    ></obsolete>
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
import { StoreType, CharacterType, YNStatus } from '@/enums/common.js'
import { StyleRequireOrderBasicState } from '@/enums/stocking.js'
import {
  STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_GET,
  STOCKING_API_STYLE_REQUIRE_ORDER_ITEM_GETS,
  STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_ABANDON,
  STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_AUDIT,
  STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_REJECT,
  STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_CANCEL
} from '@/apis/stocking.js'
import obsolete from '@/components/purchase/obsolete'
import reviewDialog from '@/components/purchase/reviewDialog'
import cancelReview from '@/components/purchase/cancelReview'
export default {
  data() {
    return {
      characterType: CharacterType,
      orderBasicState: StyleRequireOrderBasicState, // 状态
      storeType: StoreType, // 门店枚举
      detail: {},
      operatingData: [],
      goodData: [],
      obsoleteVisble: false, // 作废弹窗
      auditDialog: false, // 审核弹窗
      visibleCan: false // 取消审核弹窗
    }
  },
  methods: {
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_GET({
        RequireId: Number(this.$route.query.id)
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.operatingData = [
            { ...res.data.Data, orderNumber: res.data.Data.RequireCode }
          ]
          this.getGoodData()
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    getGoodData() {
      this.$store.commit('SET_TB_LOADING', true)
      const para = {
        RequireId: Number(this.$route.query.id),
        PageIndex: 1,
        PageSize: 999999
      }
      STOCKING_API_STYLE_REQUIRE_ORDER_ITEM_GETS(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodData = res.data.Data.Rows || []
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    // 打开作废
    openObsolete() {
      this.obsoleteVisble = true
    },
    // 作废关闭
    visbleColse() {
      this.obsoleteVisble = false
    },
    // 作废确认
    confirmObsolete(note) {
      const para = {
        RequireId: this.operatingData[0].RequireId,
        CheckNote: note
      }
      STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_ABANDON(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '作废成功',
            type: 'success'
          })
          this.obsoleteVisble = false
          this.$store.commit('SET_BTN_LOADING', false)
          this.getData()
        }
      })
    },
    // 审核弹窗打开
    reviewStyleOrder() {
      this.auditDialog = true
    },
    // 审核确定
    confirmAudit(data) {
      const para = {
        RequireId: Number(this.operatingData[0].RequireId),
        CheckNote: data.auditReson
      }
      if (YNStatus.Yes === data.auditType) {
        STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_AUDIT(para).then(res => {
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
      } else if (YNStatus.No === data.auditType) {
        STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_REJECT(para).then(res => {
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
      this.auditDialog = false
    },
    // 打开取消审核
    openCancelReview() {
      this.visibleCan = true
    },
    // 取消审核确定
    cancelConfirm(data) {
      const para = {
        RequireId: Number(this.operatingData[0].RequireId),
        CheckNote: data
      }
      STOCKING_API_STYLE_REQUIRE_ORDER_BASIC_CANCEL(para).then(res => {
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
      this.visibleCan = false
    }
  },
  mounted() {
    this.getData()
  },
  components: {
    obsolete,
    reviewDialog,
    cancelReview
  }
}
</script>

<style lang="scss" scoped>
.gift-info-cell img {
  width: 50px;
  height: 50px;
  vertical-align: top;
}
</style>
