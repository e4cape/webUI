<template>
  <div class="content">
    <ul class="tabs">
      <router-link
        name="linkInfo"
        class="tab"
        tag="li"
        :to="{path:'/market/coupon/'+(path=='couponitem'?'couponbasic':(path=='giftcouponitem'?'giftcouponbasic':(path=='salecardsonlineitem'?'salecardsonlinebasic':'salecardsunlinebasic')))+'/'+$route.params.id}"
      >卡券信息</router-link>
      <router-link
        name="linkSale"
        class="tab"
        tag="li"
        v-if="path=='salecardsonlineitem'||path=='salecardsunlineitem'"
        :to="{path:'/market/coupon/'+(path=='salecardsonlineitem'?'couponorderonlinelist':'couponorderunlinelist')+'/'+$route.params.id}"
      >卡券销售</router-link>
      <router-link
        name="linkUse"
        class="tab  active"
        to=""
      >{{/(salecards)/.test($route.path)? '使用统计' : '投放与使用'}}</router-link>
    </ul>
    <div
      class="p-10"
      style="border:1px #e5e5e5 solid;"
    >
      <el-table
        :stripe="true"
        :data="analysisData"
        :show-header="false"
        style="margin-bottom: 10px"
        v-loading="loadingTop"
      >
        <el-table-column>
          <template slot-scope="scoped">
            <span>{{/(salecards)/.test($route.path)? '销售总数' : '赠送总数'}}：</span>
            <span class="text-danger">{{scoped.row.TotalAmt}}</span>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scoped">
            <span>未使用：</span>
            <span class="text-danger">{{scoped.row.NoUseAmt}}</span>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scoped">
            <span>已使用：</span>
            <span class="text-danger">{{scoped.row.UseAmt}}</span>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scoped">
            <span>已锁定：</span>
            <span class="text-danger">{{scoped.row.LockedAmt}}</span>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scoped">
            <span>已过期：</span>
            <span class="text-danger">{{scoped.row.ExpiredAmt}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-form
        :model="form"
        inline
        class="item-lh-26"
      >
        <el-form-item
          name="datePickerCreateTime"
          :label="/(salecards)/.test($route.path)? '销售时间' : '赠送时间'"
        >
          <el-date-picker
            v-model="createTime"
            type="daterange"
            unlink-panels
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="$root.datePickerOptions"
            value-format="yyyy-MM-dd"
            @change="dateChange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="卡券状态:">
          <el-select
            name="selectStatus"
            v-model="form.Status"
          >
            <el-option
              label="全部"
              :value="0"
            ></el-option>
            <el-option
              v-for="item in CouponStatusOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领取方式：">
          <el-select
            name="selectReceiveType"
            v-model="form.ReceiveType"
            placeholder="请选择"
          >
            <el-option
              label="全部"
              :value="0"
            ></el-option>
            <el-option
              v-for="(item, key) in ReceiveType.Types"
              :key="key"
              :label="item"
              :value="parseInt(key)"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="$store.getters.user_session.CharacterType==CharacterType.Group||$store.getters.user_session.CharacterType==CharacterType.Company"
          label="领取门店："
        >
          <el-select
            name="selectCharacterId"
            v-model="form.CharacterId "
          >
            <el-option
              :value="0"
              label="全部"
            ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.CharacterId"
              :value="item.CharacterId"
              :label="item.Value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="$store.getters.user_session.CharacterType==CharacterType.Group||$store.getters.user_session.CharacterType==CharacterType.Company"
          label="使用门店："
        >
          <el-select
            name="selectUserCharacterId"
            v-model="form.UserCharacterId"
          >
            <el-option
              :value="0"
              label="全部"
            ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.CharacterId"
              :value="item.CharacterId"
              :label="item.Value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input
            name="selectUniteNote"
            v-model="form.UniteNote"
            placeholder="会员昵称/姓名/手机/卡券编号"
            style="min-width: 200px"
            @keyup.enter.native="onSearch"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            name="btnOnSearch"
            type="primary"
            icon="el-icon-search"
            @click="onSearch"
          >查询</el-button>
          <el-button
            name="btnExportList"
            type="primary"
            @click="exportList"
          >导出Excel</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        v-loading="$store.getters.tb_loading"
      >
        <el-table-column
          width="200px"
          prop="ItemId"
          label="卡券编号"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="Price"
          :formatter="formatter"
          label="券面金额"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="CreateTime"
          :label="/(salecards)/.test($route.path)? '销售时间' : '赠送时间'"
          :formatter="formatter"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="领取方式"
          prop="ReceiveType"
          :formatter="formatter"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="Expiree"
          :formatter="formatter"
          label="有效期至"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="StoreName"
          v-if="$store.getters.user_session.CharacterType==CharacterType.Group||$store.getters.user_session.CharacterType==CharacterType.Company"
          label="领取门店"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="AliasName"
          label="会员昵称"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="TrueName"
          label="姓名"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="Mobile"
          label="手机"
          show-overflow-tooltip
        ></el-table-column>
        <!-- <el-table-column  prop="Address" label="地址"></el-table-column> -->
        <el-table-column
          label="使用时间"
          prop="CheckTime"
          :formatter="formatter"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="抵扣金额"
          prop="DeductPrice"
          show-overflow-tooltip
        >
          <template slot-scope="scoped">
            {{scoped.row.DeductPrice==0?'': $root.toFloat(scoped.row.DeductPrice)}}
          </template>
        </el-table-column>
        <el-table-column
          label="赠送人昵称"
          prop="GiveAliasName"
          show-overflow-tooltip
          v-if="$route.path.split('/')[3] == 'giftcouponitem'"
          key="GiveAliasName"
        ></el-table-column>
        <el-table-column
          prop="UserStoreName"
          v-if="$store.getters.user_session.CharacterType==CharacterType.Group||
$store.getters.user_session.CharacterType==CharacterType.Company"
          label="使用门店"
          show-overflow-tooltip
        ></el-table-column>
        <!-- <el-table-column label="使用单号"  prop="PrevOrderId"></el-table-column> -->
        <el-table-column
          prop="UserOrder"
          label="备注"
          width="240"
          show-overflow-tooltip
        >
          <template slot-scope="scoped">
            <router-link
              name="linkUserOrder"
              :to="'/order/expend/detail/' + scoped.row.UserOrder "
              v-if="scoped.row.Status === CouponStatus.Finish || scoped.row.Status === CouponStatus.Locked"
            >{{scoped.row.UserOrder}}</router-link>
            <span v-else>{{scoped.row.Note+' '+scoped.row.UserOrder}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="Status"
          :formatter="formatter"
          label="卡券状态"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <pagination
        :total="total"
        :pg="form.PageIndex"
        :size="form.PageSize"
        @currentChange="currentChange"
        @sizeChange="sizeChange"
      ></pagination>
    </div>
  </div>
</template>
<script>
import {
  SCORING_API_COUPON_ITEM_ITEMLISTEXPORT, // 零售单的退货子单(导出)
  SCORING_API_COUPON_ITEM_GETS, // 卡券 - 检索
  SCORING_API_COUPON_ITEM_GETANALYSIS // 卡券 - 统计
} from '@/apis/scoring'
import { MERCHANT_API_DROPDOWN_STORELIST } from '@/apis/merchant'

import { CharacterType, YNStatus } from '@/enums/common'
import { CouponStatus, ReceiveType } from '@/enums/scoring'

import pagination from '@/components/pagination.vue'

export default {
  components: {
    pagination
  },
  data() {
    return {
      loadingTop: false,
      path: this.$route.path.split('/')[3],
      CouponStatus,
      ReceiveType,
      CharacterType,
      form: {
        CharacterId: 0,
        CouponId: this.$route.params.id.split('&')[0],
        Status: 0,
        CreateTime1: '',
        CreateTime2: '',
        UniteNote: '',
        ReceiveType: 0,
        PageIndex: 1,
        PageSize: 20,
        UserCharacterId: 0,
        IsAsced: YNStatus.No
      },
      parameter: {},
      createTime: [],
      activeIndex: '2',
      CouponStatusOpt: [],
      tableData: [],
      analysisData: [],
      storeList: [],
      total: 0
    }
  },
  created() {
    this.getCouponStatusOpt()
  },

  beforeMount() {
    this.init()
    this.getStoreList()
    this.getAnalysis()
  },
  watch: {
    $route: 'init'
  },
  methods: {
    getAnalysis() {
      this.loadingTop = true
      const param = {
        CouponId: this.$route.params.id.split('&')[0]
      }
      SCORING_API_COUPON_ITEM_GETANALYSIS(param)
        .then(res => {
          if (res.data.Code == 'CORRECT') {
            this.analysisData = [res.data.Data]
          }
          this.loadingTop = false
        })
        .catch(() => (this.loadingTop = false))
    },
    getStoreList() {
      MERCHANT_API_DROPDOWN_STORELIST().then(res => {
        if (res.data.Code == 'CORRECT') {
          this.storeList = res.data.Data.Rows
        }
      })
    },
    note(item) {
      if (
        item.CouponStatus == CouponStatus.Locked ||
        item.CouponStatus == CouponStatus.Finish
      ) {
        window.location.href =
          this.$store.state.BASE_SITE.storeSite +
          '/expend/orderlist/orderdetail/' +
          item.UserOrder
      }
      if (item.CouponStatus == CouponStatus.Abandon && item.UserOrder != '') {
        window.location.href =
          this.$store.state.BASE_SITE.storeSite +
          '/return/orderlist/orderdetail/' +
          item.UserOrder
      }
    },
    exportList() {
      let params = Object.assign({}, this.form, this.page, {
        CouponId: this.$route.params.id.split('&')[0]
      })
      SCORING_API_COUPON_ITEM_ITEMLISTEXPORT(params).then(res => {
        if (res.data.Code === 'CORRECT') {
          location.href = res.data.Data.FilePath
        }
      })
    },
    getCouponStatusOpt() {
      for (let key in CouponStatus.Types) {
        this.CouponStatusOpt.push({
          label: CouponStatus.Types[key],
          value: parseInt(key)
        })
      }
    },
    dateChange(value) {
      if (value) {
        this.form.CreateTime1 = this.createTime[0]
        this.form.CreateTime2 = this.createTime[1]
      } else {
        this.form.CreateTime1 = ''
        this.form.CreateTime2 = ''
      }
    },
    formatter(row, column, val) {
      let tpr
      switch (column.property) {
        case 'Price':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'CheckTime':
          tpr =
            row.Status != CouponStatus.Finish
              ? '-'
              : this.$options.filters.filterDate(val)
          break
        case 'CreateTime':
          tpr = this.$options.filters.filterDate(val)
          break
        case 'Expiree':
          tpr =
            val.substring(0, 4) == '2100'
              ? '长期'
              : this.$options.filters.filterDate(val)
          break
          
        case 'Status':
          tpr = CouponStatus.Types[val]
          break
        case 'ReceiveType':
          tpr = ReceiveType.Types[val]
          break
        default:
          break
      }
      return tpr
    },
    initRoute() {
      this.$router.replace({
        path: this.$route.path,
        query: this.parameter
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.Status = parseInt(query.Status) || 0
      this.parameter.CharacterId = parseInt(query.CharacterId) || 0
      this.parameter.CreateTime1 = query.CreateTime1 || ''
      this.parameter.CreateTime2 = query.CreateTime2 || ''
      this.createTime = query.CreateTime1
        ? [query.CreateTime1, query.CreateTime2]
        : []
      this.parameter.UniteNote = query.UniteNote || ''
      this.parameter.ReceiveType = parseInt(query.ReceiveType) || 0
      this.parameter.CouponId = this.$route.params.id.split('&')[0]
      this.parameter.PageIndex = query.PageIndex || 1
      this.parameter.PageSize = query.PageSize || 20
      this.parameter.UserCharacterId = parseInt(query.UserCharacterId) || 0
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      this.form = Object.assign(this.form, this.parameter)
      SCORING_API_COUPON_ITEM_GETS(this.form).then(res => {
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
      if (JSON.stringify(this.parameter) == JSON.stringify(this.$route.query)) {
        this.getData()
      } else {
        this.initRoute(this.parameter)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.text-danger {
  color: #a94442;
}
</style>
