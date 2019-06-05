<template>
  <div class="content">
    <el-form
      :model="form"
      ref="search"
      class="item-lh-26"
      :inline="true"
      @submit.native.prevent
    >
      <search-panel :isSenior="false">
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
          <el-form-item prop="UniteNote">
            <el-input
              name="UniteNote"
              v-model="form.UniteNote"
              @keyup.enter.native="onSearch"
              placeholder="请输入昵称/姓名/手机"
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
      </search-panel>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="$store.getters.tb_loading"
    >
      <el-table-column
        label="会员昵称"
        prop="AliasName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="姓名"
        prop="TrueName"
      ></el-table-column>
      <el-table-column
        label="手机"
        prop="Mobile"
      ></el-table-column>
      <el-table-column
        label="已领取数"
        prop="PickedAmt"
      ></el-table-column>
      <el-table-column
        label="已领取总面额"
        width="120"
        prop="PickedPrice"
      ></el-table-column>
      <el-table-column
        label="已使用数"
        prop="UsedAmt"
      ></el-table-column>
      <el-table-column
        label="已使用总面额"
        width="120"
        prop="UsedPrice"
      ></el-table-column>
      <el-table-column
        label="抵扣金额"
        prop="DeductPrice"
      ></el-table-column>
      <el-table-column
        label="未使用数"
        prop="NoUsedAmt"
      ></el-table-column>
      <el-table-column
        label="未使用总面额"
        width="120"
        prop="NoUsedPrice"
      ></el-table-column>
      <el-table-column
        label="已过期数"
        prop="OverAmt"
      ></el-table-column>
      <el-table-column
        label="已过期总面额"
        width="120"
        prop="OverAmtPrice"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scoped">
          <el-button
            name="btnReceiveDetail"
            type="text"
            @click="$router.push('/report/coupon/ReceiveDetail/'+scoped.row.MemberId)"
          >详情</el-button>
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
  SCORING_API_COUPON_ITEM_SUMMARYLISTEXPORT, // 客户领取统计(导出)
  SCORING_API_COUPON_ITEM_GETSSUMMARYBYSTORE // 卡券 - 门店统计
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
      form: {
        UniteNote: '',
        PageIndex: 1,
        PageSize: 20
      },
      parameter: {},
      tableData: [],
      loading: true,
      expordLoading: false,
      total: 0
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  methods: {
    HandleExpord() {
      const loading = this.$loading({
        background: 'rgba(255, 255, 255, 0.7)'
      })
      let obj = this.form
      SCORING_API_COUPON_ITEM_SUMMARYLISTEXPORT(obj).then(res => {
        loading.close()
        if (res.data.Code == 'CORRECT') {
          location.href = res.data.Data.FilePath
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
      this.parameter.UniteNote = query.UniteNote || ''
      this.parameter.PageIndex = query.PageIndex || 1
      this.parameter.PageSize = query.PageSize || 20

      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      this.form = Object.assign(this.form, this.parameter)
      SCORING_API_COUPON_ITEM_GETSSUMMARYBYSTORE(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData =
            res.data.Data.Rows &&
            res.data.Data.Rows.map(item => ({
              AliasName: item.AliasName,
              CharacterId: item.CharacterId,
              DeductPrice: this.$root.toFloat(item.DeductPrice),
              MemberId: item.MemberId,
              Mobile: item.Mobile,
              NoUsedAmt: item.NoUsedAmt,
              NoUsedPrice: this.$root.toFloat(item.NoUsedPrice),
              OverAmt: item.OverAmt,
              OverAmtPrice: this.$root.toFloat(item.OverAmtPrice),
              PickedAmt: item.PickedAmt,
              PickedPrice: this.$root.toFloat(item.PickedPrice),
              RulePrice: this.$root.toFloat(item.RulePrice),
              TrueName: item.TrueName,
              UsedAmt: item.UsedAmt,
              UsedPrice: this.$root.toFloat(item.UsedPrice)
            }))
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
      // this.loading=true
      this.form.PageIndex = 1

      // this.$data.set('parameter',Object.assign(this.parameter, this.form))
      // this.$set(this.$data, 'parameter',)
      this.parameter = Object.assign({}, this.form)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.parameter)) {
        this.getData()
      } else {
        this.initRoute()
      }
      // this.initRoute(this.parameter)
    },
    onReset() {
      this.$refs.form.resetFields()
      this.timeArr = []
      this.onSearch()
    }
  }
}
</script>
