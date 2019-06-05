<template>
  <div class="content">
    <ul class="tabs">
      <router-link
        name="linkInfo"
        class="tab"
        tag="li"
        :to="{path:`${$route.query.couponSaleType === CouponSaleType.Online ? '/market/coupon/salecardsonlinebasic/':'/market/coupon/salecardsunlinebasic/'}${$route.params.id}`}"
      >卡券信息</router-link>
      <router-link
        name="linkSale"
        class="tab active"
        tag="li"
        v-if="path=='couponrewardstatics'"
        :to="{query:$route.query}"
      >卡券销售</router-link>
      <router-link
        name="linkUse"
        class="tab"
        :to="{path: `${$route.query.couponSaleType === CouponSaleType.Online ? '/market/coupon/salecardsonlineitem/':'/market/coupon/salecardsunlineitem/'}${$route.params.id}`}"
      >使用统计</router-link>
    </ul>
    <div
      class="p-20"
      style="border:1px #e5e5e5 solid;"
    >
      <ul class="link-tabs">
        <router-link
          name="linkOrderManage"
          tag="li"
          :to="{path: `${$route.query.couponSaleType == CouponSaleType.Online ? '/market/coupon/couponorderonlinelist/':'/market/coupon/couponorderunlinelist/'}${$route.params.id}`}"
        >订单管理</router-link>
        <router-link
          name="linkPrize"
          tag="li"
          class="active"
          :to="{query:$route.query}"
        >奖励统计</router-link>
      </ul>
      <el-form
        inline
        :model="form"
        ref="search"
        class="item-lh-26"
        @submit.native.prevent
      >
        <el-row
          class="search-box m-t-10"
          type="flex"
        >
          <el-col class="search-form">
            <el-form-item
              label="销售人"
              prop="UserName"
            >
              <el-input
                name="inputUserName"
                v-model="form.UserName"
                placeholder="销售人姓名"
                @keyup.enter.native="onSearch"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="门店："
              v-if="characterType === CharacterType.Company"
              prop="CharacterId"
            >
              <el-select
                name="selectCharacterId"
                v-model="form.CharacterId"
              >
                <el-option
                  v-for="(item, index) in $store.getters.stores"
                  :key="index"
                  :label="item.Value"
                  :value="item.CharacterId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="search-btn">
            <el-button
              name="btnOnSearch"
              type="primary"
              @click="onSearch"
            >搜索</el-button>
            <el-button
              name="btnOnReset"
              type="default"
              @click="onReset"
            >重置</el-button>
            <el-button
              name="btnExportData"
              type="info"
              @click="exportData"
            >导出Excel</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        class="m-t-10"
        :data="tableData"
        v-loading="tableLoading"
      >
        <el-table-column
          prop="UserName"
          label="销售人"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="StoreName"
          label="门店"
          show-overflow-tooltip
          v-if="characterType === CharacterType.Company"
        ></el-table-column>
        <!-- <el-table-column prop="SaleCode" v-if="$route.query.couponSaleType === CouponSaleType.Online" label="销售代码" show-overflow-tooltip></el-table-column> -->
        <el-table-column
          prop="OrderAmt"
          label="已成交订单数"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="OrderCouponAmt"
          label="已成交卡券数"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="UnOrderAmt"
          label="已退款订单数"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="UnOrderCouponAmt"
          label="已退款卡券数"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="RewardUnitPrice"
          label="奖励单价"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{$root.toFloat(scope.row.RewardUnitPrice)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="RewardPrice"
          label="奖励金额"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{$root.toFloat(scope.row.RewardPrice)}}
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
  </div>
</template>
<script>
import {
  SCORING_API_COUPON_EMPLOYEE_REWARDLISTEXPORT, // 奖励统计(导出)
  SCORING_API_COUPON_EMPLOYEE_GETS // 优惠券销售人员- 检索
} from '@/apis/scoring'

import { CharacterType } from '@/enums/common'
import { CouponSaleType } from '@/enums/scoring'

import pagination from '@/components/pagination.vue'
export default {
  data() {
    return {
      CharacterType,
      CouponSaleType,
      path: this.$route.path.split('/')[3],
      tableLoading: true,
      form: {
        UserName: '',
        CouponId: this.$route.params.id,
        CharacterId: 0,
        PageIndex: 1,
        PageSize: 20
      },
      parameter: {},
      total: 0,
      tableData: []
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: this.$route.path,
        query: this.parameter
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.couponSaleType = parseInt(query.couponSaleType)
      this.parameter.UserName = query.UserName || ''
      this.parameter.CharacterId = parseInt(query.CharacterId) || 0
      this.parameter.PageSize = query.PageSize || 20
      this.parameter.PageIndex = query.PageIndex || 1
      this.getData()
    },
    getData() {
      this.tableLoading = true
      this.form = Object.assign(this.form, this.parameter)
      SCORING_API_COUPON_EMPLOYEE_GETS(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
        this.tableLoading = false
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
    },
    exportData() {
      this.form = Object.assign(this.form, this.parameter)
      SCORING_API_COUPON_EMPLOYEE_REWARDLISTEXPORT(this.form).then(res => {
        if (res.data.Code === 'CORRECT') {
          window.open(res.data.Data.FilePath, '_blank')
        }
      })
    }
  },
  beforeMount() {
    this.$store.dispatch('GET_STORES_DROPLIST')
  },

  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination
  }
}
</script>
<style scoped lang="scss">
@import 'compass/css3';

.link-tabs {
  border-bottom: 1px #ddd solid;

  li {
    position: relative;
    cursor: pointer;
    @include display-flex(inline-flex);

    padding: 10px 15px;

    &:after {
      font-size: 0;
      content: '';
      display: none;
      height: 2px;
      width: 100%;
      line-height: 0;
      position: absolute;
      background: #399fe5;
      bottom: -1px;
      left: 0;
    }

    &.active {
      color: #399fe5;

      &:after {
        display: block;
      }
    }
  }
}
.search-btn {
  width: 254px !important;
}
.search-form {
  width: 1%;
  flex: 1;
}
</style>
