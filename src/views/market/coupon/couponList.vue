<template>
  <div class="content">
    <el-form
      :model="form"
      ref="search"
      class="item-lh-26"
      @keyup.enter.native="onSearch"
      :inline="true"
    >
      <search-panel
        @onSearch="onSearch"
        @onReset="onReset"
      >
        <template slot="simpleSearch">
          <el-form-item prop="CompanyCode">
            <el-input
              name="inputCompanyCode"
              v-model="form.CompanyCode"
              placeholder="公司编码"
            >
              <el-button
                name="btnOnSearch"
                slot="append"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item
            label="公司编码"
            prop="CompanyCode"
          >
            <el-input
              name="inputCompanyCodes"
              v-model="form.CompanyCode"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="公司名称"
            prop="CompanyName"
          >
            <el-input
              name="inputCompanyName"
              v-model="form.CompanyName"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="门店编号"
            prop="StoreCode"
          >
            <el-input
              name="inputStoreCode"
              v-model="form.StoreCode"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="门店名称："
            prop="StoreName"
          >
            <el-input
              name="inputStoreName"
              v-model="form.StoreName"
            ></el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="$store.getters.tb_loading"
    >
      <el-table-column
        label="公司编码"
        prop="CompanyCode"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="公司名称"
        prop="CompanyName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="门店编码"
        v-if="$store.getters.user_session.wechatSettingType!=CompanyBasicMountType.Store"
        prop="StoreCode"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="门店名称"
        v-if="$store.getters.user_session.wechatSettingType!=CompanyBasicMountType.Store"
        prop="StoreName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="待审核"
        prop="OriginAmt"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="已审核"
        prop="AuditAmt"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="已终止"
        prop="TerminalAmt"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="已作废"
        prop="AbandonAmt"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="未开始"
        prop="LaunchOriginAmt"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="已开始"
        prop="LaunchAuditAmt"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="已结束"
        prop="LaunchFinishAmt"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="已使用数"
        prop="UsedAmt"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="未使用数"
        prop="NoUsedAmt"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="已锁定数"
        prop="LockedAmt"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="已过期数"
        prop="OverAmt"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="操作"
        width="100"
        fixed="right"
      >
        <template slot-scope="scoped">
          <el-button
            name="btnCheckDetail"
            type="text"
            @click="$router.push(`/market/coupon/storelist/${$route.path.slice(15)=='index'?1:$route.path.slice(15)=='giftcoupon'?2:3}?CharacterId=${scoped.row.CharacterId}`)"
          >查看明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :pg="form.PageIndex"
      :size="form.PageSize"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
  </div>
</template>
<script>
import {
  SCORING_API_COUPON_BASIC_GETSBYPF // 优惠券 - 检索(平台端)
} from '@/apis/scoring'

import { CompanyBasicMountType } from '@/enums/merchant'
import { CouponSettingType } from '@/enums/scoring'

import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
export default {
  data() {
    return {
      CompanyBasicMountType,
      parameter: {},
      total: 0,
      createTime: [],
      tableData: [],
      form: {
        CompanyCode: '',
        CompanyName: '',
        StoreCode: '',
        StoreName: '',
        CouponType: '',
        PageIndex: 1,
        PageSize: 10
      }
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        query: this.parameter
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.CompanyCode = query.CompanyCode || ''
      this.parameter.CompanyName = query.CompanyName || ''
      this.parameter.StoreCode = query.StoreCode || ''
      this.parameter.StoreName = query.StoreName || ''
      this.parameter.CouponType =
        this.$route.path == '/market/coupon/index'
          ? CouponSettingType.Universal
          : this.$route.path == '/market/coupon/salecardslist'
            ? CouponSettingType.Sale
            : CouponSettingType.Voucher
      this.parameter.PageSize = query.PageSize || 20
      this.parameter.PageIndex = query.PageIndex || 1
      this.getData()
    },
    getData() {
      // let apiName = ''
      this.$store.commit('SET_TB_LOADING', true)
      this.form = Object.assign(this.form, this.parameter)
      SCORING_API_COUPON_BASIC_GETSBYPF(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    currentChange(val) {
      // 切换当前页
      this.parameter.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameter.PageIndex = 1
      this.parameter.PageSize = val
      this.initRoute()
    },
    onSearch() {
      // 搜索相关
      this.form.PageIndex = 1
      this.parameter = Object.assign({}, this.form)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.onSearch()
    }
  },
  // beforeRouteUpdate (to, from, next){
  //    if (to.params.id == 1) {
  //       to.meta.name = '通用券'
  //     } else if (to.params.id == 2) {
  //       to.meta.name = '人情券'
  //     } else {
  //       to.meta.name = '可售卡券'
  //     }
  //     next()
  // },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination,
    searchPanel
  }
}
</script>
