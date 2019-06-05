<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" @keyup.enter.native="onSearch" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-checkbox-group class="m-b-10" v-model="showType" :min="1" name="showType">
            <el-checkbox label="stock" border>查看成本价</el-checkbox>
            <el-checkbox label="gold" border>查看市场价</el-checkbox>
            <el-checkbox label="stuff" border>查看零售价</el-checkbox>
            <el-checkbox label="trade" border>查看批发价</el-checkbox>
            <el-checkbox label="allocation" border>查看调拨价</el-checkbox>
          </el-checkbox-group>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="BarCode">
            <el-input name="BarCode" v-model="queryForm.BarCode" :maxlength="50" placeholder="条码">
              <el-button name="btnonSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="BarCode" label="条码：">
            <el-input name="BarCode" v-model="queryForm.BarCode" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="StyleCode" label="款号：">
            <el-input name="StyleCode" v-model="queryForm.StyleCode" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="GoodsName" label="货品名称：">
            <el-input name="GoodsName" v-model="queryForm.GoodsName" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="RetailType" label="零售方式：">
            <el-select name="RetailType" v-model="queryForm.RetailType">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item,index) in RetailType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="LastRetailTime" label="最近零售时间：">
            <el-date-picker name="LastRetailTime" v-model="queryForm.LastRetailTime" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item prop="MaterialType" label="材质：">
            <el-select name="MaterialType" v-model="queryForm.MaterialType" placeholder="所有材质" :filterable="true">
              <el-option label="所有材质" value="0"></el-option>
              <el-option v-for="(item,index) in $store.getters.materialType.TypeArray" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="CategoryType" label="品类：">
            <el-select name="CategoryType" v-model="queryForm.CategoryType" placeholder="所有品类" :filterable="true">
              <el-option label="所有品类" value="0"></el-option>
              <el-option v-for="(item,index) in $store.getters.categoryType.TypeArray" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="GoldType" label="成色：">
            <el-select name="GoldType" v-model="queryForm.GoldType" placeholder="所有成色" :filterable="true">
              <el-option label="所有成色" value="0"></el-option>
              <el-option v-for="(item,index) in $store.getters.goldType.TypeArray" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- el-radio-group -->

    <!-- END el-radio-group -->
    <!-- @module 数据表格 -->
    <el-table :data="data" @sort-change="sortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="BarCode" label="条码" min-width="100" sortable="custom" show-overflow-tooltip fixed>
        <template slot-scope="scope">
          <span name="showDetailDialog" @click="showDetailDialog(scope.row.GoodsId)" class="init-button-text">{{scope.row.BarCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="StyleCode" label="款号" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoodsName" label="货品名称" min-width="100" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column prop="CostPrice" label="采购成本" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column> -->
      <template v-if="showType.some(item => item === 'stock')">
        <el-table-column prop="GoldPrice" label="采购金价(元)" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="StuffPrice" label="金料价格(元)" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Cert1Fee" label="证书①费用(元)" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Cert2Fee" label="证书②费用(元)" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CraftFee1" label="采购工费①计价(元/克)" :formatter="formatter" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CraftFee2" label="采购工费②计件(元/件)" :formatter="formatter" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CertFee" label="证书费用(元)" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ScraftFee" label="超镶工费(元)" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="OtherFee" label="其他费用(元)" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CostPrice" label="成本价(元)" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      </template>
      <template v-if="showType.some(item => item === 'gold')">
        <el-table-column prop="MktGprice" label="市场金价(元/克)" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="MktStffice" label="市场料价(元)" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="MktCertfee" label="市场证书费用(元)" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="MktCostice" label="市场成本(元)" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      </template>
      <template v-if="showType.some(item => item === 'stuff')">
        <el-table-column prop="LabelPrice" label="标签价(元)" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="RetailType" label="零售方式" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="RetailPrice" label="零售价/工费(元)" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="LastRetailPrice" label="最近零售价(元)" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
      </template>
      <template v-if="showType.some(item => item === 'trade')">
        <el-table-column prop="WholesaleType" label="批发方式" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="WholesalePrice" label="批发价/工费(元)" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      </template>
      <template v-if="showType.some(item => item === 'allocation')">
        <el-table-column prop="AppropRate" label="调拨倍率" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="AppropType" label="调拨方式" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="AppropPrice" label="调拨价/工费(元)" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      </template>

      <!-- <el-table-column v-for="(item, index) in showType" prop="item" :key="index" :label="item" min-width="110" show-overflow-tooltip></el-table-column> -->

      <el-table-column prop="LastRetailTime" label="最近零售时间" :formatter="formatter" min-width="140" sortable="custom" show-overflow-tooltip fixed="right"></el-table-column>
    </el-table>
    <!-- End 数据表格 -->

    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- dialog 货品详情 -->
    <good-detail :visible.sync="goodDetailDialog.visible" :goodsId="goodDetailDialog.goodsId"></good-detail>
    <!-- end 货品详情-->
    <!-- End panel -->
  </div>
</template>

<script>
import { STOCKING_API_GOODS_BASIC_REQS, STOCKING_API_GOODS_STOCK_WAREHOUSE_REQS } from '@/apis/stocking.js'
import { YNStatus, CharacterType } from '@/enums/common.js'
import { GoodsStockWarehousePositionType, RetailType, WholesaleType, AppropType } from '@/enums/stocking.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import goodDetail from '@/components/erp/goodDetail'
export default {
  data() {
    return {
      YNStatus,
      RetailType,
      materialType: '0',
      showType: ['stock', 'gold', 'stuff'],
      categoryType: '0',
      goldType: '0',
      queryAll: false,
      queryForm: {
        // 查询表单数据
        MaterialType: '0',
        CategoryType: '0',
        GoldType: '0',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20,
        BarCode: '',
        StyleCode: '',
        GoodsName: '',
        RetailType: '0',
        LastRetailTime: [],
        LastRetailTime1: '',
        LastRetailTime2: ''
      },
      data: [],
      total: 0,
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      parameters: {
      }
    }
  },
  computed: {
    isStore() {
      return this.$store.getters.user_session.CharacterType === CharacterType.Store
    }
  },
  methods: {
    formatter(row, column, val) {
      switch (column.property) {
        case 'LastRetailTime':
          return this.$options.filters.filterDateMinutes(val)
        case 'RetailType':
          return val === 0 ? '-' : RetailType.Types[val]
        case 'WholesaleType':
          return val === 0 ? '-' : WholesaleType.Types[val]
        case 'AppropType':
          return val === 0 ? '-' : AppropType.Types[val]
        case 'AppropRate':
          return this.$root.toFloat(val)
        default:
          return '￥' + this.$root.toFloat(val)
      }
    },
    init() {
      let query = JSON.stringify(this.$route.query) !== '{}' ? this.$route.query : {
        MaterialType: '0',
        CategoryType: '0',
        GoldType: '0',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20,
        BarCode: '',
        StyleCode: '',
        GoodsName: '',
        RetailType: '0',
        LastRetailTime: [],
        LastRetailTime1: '',
        LastRetailTime2: ''
      }
      this.parameters = Object.assign({
      }, query)
      this.parameters.LastRetailTime = query.LastRetailTime || []
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let lastSaleTime = this.parameters.LastRetailTime.length ? this.parameters.LastRetailTime : [
        '',
        ''
      ]
      let param = {
        LastRetailTime1: lastSaleTime[0],
        LastRetailTime2: lastSaleTime[1]
      }
      this.queryForm = Object.assign(this.queryForm, this.parameters, param)
      let api = this.isStore ? STOCKING_API_GOODS_STOCK_WAREHOUSE_REQS({ ...this.queryForm, PositionType: GoodsStockWarehousePositionType.Store }) : STOCKING_API_GOODS_BASIC_REQS(this.queryForm)
      api.then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'LastRetailTime':
          this.queryForm.OrderBy = 1
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
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
        path: this.$router.path, query: this.parameters
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
  },
  components: {
    searchPanel,
    pagination,
    goodDetail
  }
}
</script>
