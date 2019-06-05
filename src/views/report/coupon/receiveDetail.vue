<template>
  <div class="content">
    <el-form
      :model="form"
      ref="search"
      class="item-lh-26 card-summary"
      :inline="true"
    >
      <search-panel
        @onSearch="onSearch"
        @onReset="onReset"
      >
        <template slot="btnBox">
          <el-form-item>
            <el-button
              name="btnHandleExpord"
              type="primary"
              @click="HandleExpord"
            >导出Excel</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="Status">
            <el-select
              name="Status"
              v-model="form.Status"
              @change="onSearch"
            >
              <el-option
                :value="0"
                label="所有状态"
              ></el-option>
              <el-option
                v-for="item in CouponStatus.TypeArray"
                :key="item.KeyId"
                :value="+item.KeyId"
                :label="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ItemId">
            <el-input
              name="ItemId"
              v-model="form.ItemId"
              placeholder="请输入卡券编码"
              @keyup.enter.native="onSearch"
            >
              <el-button
                name="btnonSearch"
                slot="append"
                icon="el-icon-search"
                @click="onSearch"
              ></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item
            label="卡券编码："
            prop="ItemId"
            @keyup.enter.native="onSearch"
          >
            <el-input
              name="ItemId"
              v-model="form.ItemId"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="卡券名称："
            prop="CouponName"
            @keyup.enter.native="onSearch"
          >
            <el-input
              name="CouponName"
              v-model="form.CouponName"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="卡券类型："
            prop="CouponType"
          >
            <el-select
              name="CouponType"
              v-model="form.CouponType"
            >
              <el-option
                :value="0"
                label="全部"
              ></el-option>
              <el-option
                v-for="item in CouponSettingType.TypeArray"
                :key="item.KeyId"
                :value="+item.KeyId"
                :label="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="状态："
            prop="Status"
          >
            <el-select
              name="Status"
              v-model="form.Status"
            >
              <el-option
                :value="0"
                label="所有状态"
              ></el-option>
              <el-option
                v-for="item in CouponStatus.TypeArray"
                :key="item.KeyId"
                :value="+item.KeyId"
                :label="item.Value"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <div>
      <table class="member">
        <tr>
          <td>会员ID</td>
          <td nowrap>{{Detail.MemberId}}</td>
          <td>会员昵称</td>
          <td>{{Detail.AliasName}}</td>
          <td>姓名</td>
          <td>{{Detail.TrueName}}</td>
          <td>手机</td>
          <td>{{Detail.Mobile}}</td>
        </tr>
      </table>
    </div>
    <el-table
      :data="Detail.Items"
      v-loading="$store.getters.tb_loading"
    >
      <el-table-column
        label="领取时间"
        prop="CreateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="卡券编码"
        prop="ItemId"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="卡券名称"
        prop="CouponName"
        show-overflow-tooltip
      >
        <template slot-scope="scoped">
          <router-link
            v-if="scoped.row.CouponType==CouponSettingType.Universal"
            :to="{path:'/market/coupon/couponbasic/'+scoped.row.CouponId}"
          >{{scoped.row.CouponName}}</router-link>
          <router-link
            v-else-if="scoped.row.CouponType==CouponSettingType.Voucher"
            :to="{path:'/market/coupon/giftcouponbasic/'+scoped.row.CouponId}"
          >{{scoped.row.CouponName}}</router-link>
          <router-link
            v-else-if="scoped.row.CouponType==CouponSettingType.Sale && scoped.row.CouponSaleType == CouponSaleType.Online"
            :to="{path:'/market/coupon/salecardsonlinebasic/'+scoped.row.CouponId}"
          >{{scoped.row.CouponName}}</router-link>
          <router-link
            v-else-if="scoped.row.CouponType==CouponSettingType.Sale && scoped.row.CouponSaleType == CouponSaleType.Offline"
            :to="{path:'/market/coupon/salecardsunlinebasic/'+scoped.row.CouponId}"
          >{{scoped.row.CouponName}}</router-link>
          <span v-else>{{scoped.row.CouponName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="卡券类型"
        prop="CouponType"
      >
        <template slot-scope="scoped">
          {{CouponSettingType.Types[scoped.row.CouponType]}}
        </template>
      </el-table-column>
      <el-table-column
        label="卡券面额"
        prop="Price"
      >
        <template slot-scope="scope">
          {{$root.toFloat(scope.row.Price)}}
        </template>
      </el-table-column>
      <el-table-column
        label="赠送规则"
        prop="EventType"
        show-overflow-tooltip
        min-width="100"
      >
        <template slot-scope="scoped">
          {{CouponSettingType.Voucher==scoped.row.CouponType?'购买指定材质达指定金额自动赠送':EventType.Types[scoped.row.EventType]}}
        </template>
      </el-table-column>
      <el-table-column
        label="有效期"
        prop="Expireb"
        show-overflow-tooltip
      >
        <template slot-scope="scoped">
          {{scoped.row.Expireb}} 至 {{scoped.row.Expiree.substring(0,4)=='2100'?'长期': scoped.row.Expiree}}
        </template>
      </el-table-column>
      <el-table-column label="领取数量">
        1
      </el-table-column>
      <el-table-column
        label="使用时间"
        prop="CheckTime"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{scope.row.CheckTime | filterDate}}
        </template>
      </el-table-column>
      <el-table-column
        label="抵扣金额"
        prop="DeductPrice"
      >
        <template slot-scope="scope">
          {{$root.toFloat(scope.row.DeductPrice)}}
        </template>
      </el-table-column>
      <el-table-column
        label="备注"
        prop="UserOrder"
        show-overflow-tooltip
      >
        <!-- <template slot-scope="scoped">
            {{scoped.row.UserOrder}}
        </template> -->
        <template slot-scope="scoped">
          <span v-if="scoped.row.UserOrder.indexOf('XF')>=0">{{scoped.row.Note?scoped.row.Note+'，':''}}{{scoped.row.UserOrder}}</span>
          <span v-else-if="scoped.row.UserOrder.indexOf('TH')>=0">{{scoped.row.Note?scoped.row.Note+'，':''}}{{scoped.row.UserOrder}}</span>
          <span v-else>{{scoped.row.Note?scoped.row.Note:''}}{{scoped.row.UserOrder?','+scoped.row.UserOrder:''}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        prop="Status"
      >
        <template slot-scope="scoped">
          {{CouponStatus.Types[scoped.row.Status]}}
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
import dayjs from 'dayjs'

import { YNStatus } from '@/enums/common'
import {
  CardStatus,
  EventType,
  CouponStatus,
  CouponSettingType,
  CouponSaleType
} from '@/enums/scoring'

import {
  SCORING_API_COUPON_ITEM_SUMMARYITEMLISTEXPORT, // 领取统计详情(导出)
  SCORING_API_COUPON_ITEM_GETSSUMMARYBYMEMBER // 卡券 - 检索
} from '@/apis/scoring'

import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
export default {
  components: {
    pagination,
    searchPanel
  },
  data() {
    return {
      CouponSaleType,
      EventType,
      CardStatus,
      CouponStatus,
      dayjs,
      CouponSettingType,
      form: {
        ItemId: '',
        Status: 0,
        CouponType: 0,
        MemberId: this.$route.params.id,
        CouponName: '',
        PageIndex: 1,
        PageSize: 20,
        IsAsced: YNStatus.No
      },
      parameter: {},
      isLoading: true,
      tableData: [],
      Detail: {
        MemberId: '',
        AliasName: '',
        TrueName: '',
        Mobile: '',
        Items: []
      },
      CurrenDetail: {},
      total: 0,
      detailVisble: false
    }
  },
  watch: {
    $route: 'init'
  },
  mounted() {
    this.init()
  },
  methods: {
    HandleExpord() {
      const loading = this.$loading({
        background: 'rgba(255, 255, 255, 0.7)'
      })
      let obj = Object.assign({}, this.form, {
        MemberId: this.$route.params.id
      })
      SCORING_API_COUPON_ITEM_SUMMARYITEMLISTEXPORT(obj).then(res => {
        loading.close()
        if (res.data.Code == 'CORRECT') {
          window.open(res.data.Data.FilePath, '_blank').location
        }
      })
    },
    initRoute() {
      this.$router.replace({
        path: this.$route.path,
        query: this.parameter
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.ItemId = query.ItemId || ''
      this.parameter.Status = +query.Status || 0
      this.parameter.CouponType = +query.CouponType || 0
      this.parameter.MemberId = query.MemberId || this.$route.params.id
      this.parameter.CouponName = query.CouponName || ''
      this.parameter.UniteNote = query.UniteNote || ''
      this.parameter.PageIndex = query.PageIndex || 1
      this.parameter.PageSize = query.PageSize || 20

      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      this.form = Object.assign(this.form, this.parameter)
      SCORING_API_COUPON_ITEM_GETSSUMMARYBYMEMBER(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.Detail = res.data.Data
          this.total = res.data.Data.Count || 0
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
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.parameter)) {
        this.getData()
      } else {
        this.initRoute()
      }
      // this.initRoute(this.parameter)
    },
    onReset() {
      this.$refs.search.resetFields()
      this.timeArr = []
      this.onSearch()
    }
  }
}
</script>
<style lang="scss" scoped>
.member {
  // border: 1px solid #ddd
  margin-bottom: 10px;

  td {
    color: #777;
    height: 32px;
    line-height: 32px;
    border: 1px solid #ddd;
    text-align: center;
    width: calc(100% / 8);
    padding: 0 15px;

    &:nth-of-type(odd) {
      background-color: #f5f5f5;
    }
  }
}
</style>
<style lang="scss">
.item-lh-26.card-summary {
  .search-btn {
    width: 150px;
  }
}
</style>

