<template>
  <div class="content">
    <el-form
      :model="queryForm"
      ref="search"
      lable-width="120px"
      class="item-lh-26"
      :rules="queryRules"
      :inline="true"
    >
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item prop="MaterialType">
            <el-select
              name="MaterialType"
              v-model="queryForm.MaterialType"
              placeholder="所有材质"
              :filterable="true"
            >
              <el-option label="所有材质" :value="''"></el-option>
              <el-option
                v-for="(item,index) in $store.getters.materialType.TypeArray"
                :key="index"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="CategoryType">
            <el-select
              name="CategoryType"
              v-model="queryForm.CategoryType"
              placeholder="所有品类"
              :filterable="true"
            >
              <el-option label="所有品类" :value="''"></el-option>
              <el-option
                v-for="(item,index) in $store.getters.categoryType.TypeArray"
                :key="index"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="GoldType">
            <el-select
              name="GoldType"
              v-model="queryForm.GoldType"
              placeholder="所有成色"
              :filterable="true"
            >
              <el-option label="所有成色" :value="''"></el-option>
              <el-option
                v-for="(item,index) in $store.getters.goldType.TypeArray"
                :key="index"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="BarCode">
            <el-input
              name="BarCode"
              v-model="queryForm.BarCode"
              placeholder="条码"
              @keyup.enter.native="onSearch"
            >
              <el-button name="btnonSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="BarCode" label="条码：">
            <el-input
              name="BarCode"
              v-model="queryForm.BarCode"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item prop="StyleCode" label="款号：">
            <el-input
              name="StyleCode"
              v-model="queryForm.StyleCode"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item prop="GoodsName" label="货品名称：">
            <el-input
              name="GoodsName"
              v-model="queryForm.GoodsName"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item prop="PriceCode" label="调价单：">
            <el-input
              name="PriceCode"
              v-model="queryForm.PriceCode"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="调价幅度：">
            <el-row :gutter="0">
              <el-col :span="11">
                <el-form-item prop="Range1" class="inline no-margin">
                  <el-input name="Range1" v-model="queryForm.Range1" @keyup.enter.native="onSearch"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" class="tc">-</el-col>
              <el-col :span="11">
                <el-form-item prop="Range2" class="inline no-margin">
                  <el-input name="Range2" v-model="queryForm.Range2" @keyup.enter.native="onSearch"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="CheckTime" label="调价时间：">
            <el-date-picker
              name="CheckTime"
              v-model="queryForm.CheckTime"
              :unlink-panels="true"
              type="daterange"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="$root.datePickerOptions"
            ></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- @module 数据表格 -->
    <el-table
      :data="data"
      @sort-change="sortChange"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column
        prop="CheckTime"
        label="调价时间"
        min-width="120"
        sortable="custom"
        show-overflow-tooltip
        fixed
      >
        <template slot-scope="scope">{{ scope.row.CheckTime | filterDateTime }}</template>
      </el-table-column>
      <el-table-column prop="BarCode" label="条码" min-width="80" show-overflow-tooltip fixed>
        <template slot-scope="scope">
          <span
            name="showDetailDialog"
            @click="showDetailDialog(scope.row.GoodsId)"
            class="init-button-text"
          >{{scope.row.BarCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="StyleCode" label="款号" min-width="70" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoodsName" label="货品名称" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="RetailType1" label="调价前零售方式" min-width="140">
        <template slot-scope="scope">{{retailTypes.Types[scope.row.RetailType1]}}</template>
      </el-table-column>
      <el-table-column prop="RetailType2" label="调价后零售方式" min-width="140">
        <template slot-scope="scope">{{retailTypes.Types[scope.row.RetailType2]}}</template>
      </el-table-column>
      <el-table-column prop="RetailPrice1" label="调价前销售价/工费" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.RetailPrice1)}}</template>
      </el-table-column>
      <el-table-column prop="RetailPrice2" label="调价后销售价/工费" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.RetailPrice2)}}</template>
      </el-table-column>
      <el-table-column prop="Range" label="调价幅度" min-width="100" show-overflow-tooltip>
        <template
          slot-scope="scope"
        >{{ (scope.row.Range > 0 ? '+' : '') + $root.toFloat(scope.row.Range)}}</template>
      </el-table-column>
      <el-table-column
        prop="PriceCode"
        label="调价单"
        min-width="160"
        show-overflow-tooltip
        fixed="right"
      >
        <template slot-scope="scope">
          <router-link
            :to="{path:'/sales/adjust/adjustCheck',query:{id: scope.row.PriceId}}"
            class="btn-link el-button el-button--text"
            name="btnDetail"
          >{{scope.row.PriceCode}}</router-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <pagination
      :pg="queryForm.PageIndex"
      :size="queryForm.PageSize"
      :total="total"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>

    <!-- dialog 货品详情 -->
    <good-detail :visible.sync="goodDetailDialog.visible" :goodsId="goodDetailDialog.goodsId"></good-detail>
    <!-- end 货品详情-->
  </div>
</template>

<script>
import { YNStatus, RangeType } from '@/enums/common.js'
import { RetailType } from '@/enums/stocking.js'
import { STOCKING_API_GOODS_PRICE_ORDER_ITEM_REQS } from '@/apis/stocking.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import goodDetail from '@/components/erp/goodDetail'
export default {
  data() {
    return {
      YNStatus,
      retailTypes: RetailType,
      queryAll: false,
      queryForm: {
        // 查询表单数据
        OrderBy: 1,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20,
        PriceCode: '',
        RangeType: 1,
        CheckTime: [],
        MaterialType: '',
        CategoryType: '',
        GoldType: '',
        BarCode: '',
        StyleCode: '',
        GoodsName: '',
        Range1: '',
        Range2: ''
      },
      data: [],
      total: 0,
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      queryRules: {
        Range1: [
          {
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (
                value &&
                !/^-?(\d+|\d+.?\d+)$/.test(value) &&
                parseInt(value) !== 0
              ) {
                callback(new Error('请输入数字'))
              } else if (
                value &&
                this.queryForm.Range2 &&
                this.queryForm.Range2 &&
                parseFloat(value) > parseFloat(this.queryForm.Range2)
              ) {
                callback(new Error())
              }
              callback()
            }
          }
        ],
        Range2: [
          {
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (
                value &&
                !/^-?(\d+|\d+.?\d+)$/.test(value) &&
                parseInt(value) !== 0
              ) {
                callback(new Error('请输入数字'))
              } else if (
                value &&
                this.queryForm.Range1 &&
                this.queryForm.Range1 &&
                parseFloat(value) < parseFloat(this.queryForm.Range1)
              ) {
                callback(new Error())
              }
              callback()
            }
          }
        ]
      },
      parameters: {}
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.parameters.CheckTime = query.CheckTime || []
      this.parameters.GoodsName = query.GoodsName || ''
      this.parameters.StyleCode = query.StyleCode || ''
      this.parameters.BarCode = query.BarCode || ''
      this.parameters.PriceCode = query.PriceCode || ''
      this.parameters.MaterialType = query.MaterialType || ''
      this.parameters.CategoryType = query.CategoryType || ''
      this.parameters.GoldType = query.GoldType || ''
      this.parameters.RangeType = query.RangeType || 1
      this.parameters.Range1 = query.Range1 || ''
      this.parameters.Range2 = query.Range2 || ''
      this.parameters.OrderBy = query.OrderBy || 1
      this.parameters.IsAsced = query.IsAsced || YNStatus.No
      this.parameters.PageIndex = query.PageIndex || 1
      this.parameters.PageSize = query.PageSize || 20
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let parameter = Object.assign(this.queryForm, this.parameters, {
        CheckTime1: this.parameters.CheckTime[0],
        CheckTime2: this.parameters.CheckTime[1]
      })
      STOCKING_API_GOODS_PRICE_ORDER_ITEM_REQS({
        ...parameter,
        Range1: this.$root.toInt(parameter.Range1),
        Range2: this.$root.toInt(parameter.Range2)
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
          this.$store.commit('SET_TB_LOADING', false) // table loading
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    sortChange(sort) {
      this.IsAsced = sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    showDetailDialog(goodsId) {
      this.goodDetailDialog = {
        goodsId: goodsId,
        visible: true
      }
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.queryForm.isSenior = true
      if (this.queryForm.Range1 == '' && this.queryForm.Range2 == '') {
        this.queryForm.RangeType = RangeType.All
      } else if (this.queryForm.Range1 != '' && this.queryForm.Range2 == '') {
        this.queryForm.RangeType = RangeType.Over
      } else if (this.queryForm.Range1 == '' && this.queryForm.Range2 != '') {
        this.queryForm.RangeType = RangeType.Less
      } else {
        this.queryForm.RangeType = RangeType.Range
      }
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      this.initRoute()
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.initRoute()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: this.parameters
      })
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
    }
  },
  created() {
    this.getStoreAllType()
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init',
    'queryForm.MaterialType': 'onSearch',
    'queryForm.CategoryType': 'onSearch',
    'queryForm.GoldType': 'onSearch'
  },
  components: {
    searchPanel,
    pagination,
    goodDetail
  }
}
</script>
<style lang="scss" scoped>
.el-input-number {
  width: 100%;
}
.list-query-form {
  padding-bottom: 15px;
}
.el-row /deep/ .el-form-item__error {
  display: none !important;
}
</style>
