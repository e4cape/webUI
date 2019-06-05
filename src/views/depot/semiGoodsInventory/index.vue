<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" @keyup.enter.native="onSearch" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button @click="exportVisible = true">导出</el-button>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="WarehouseId">
            <el-select v-model="queryForm.WarehouseId" @change="onSearch" :filterable="true" name="WarehouseId">
              <el-option label="所有位置" value="0"></el-option>
              <template v-for="(item, index) in $store.getters.wareHouses">
                <el-option v-if="item.State === YNStatus.Yes" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="HalfName">
            <el-input v-model="queryForm.HalfName" :maxlength="50" placeholder="名称" name="HalfName">
              <el-button slot="append" icon="el-icon-search" @click="onSearch" name="btnSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="半成品分类：" prop="HalfClassDk">
            <el-select v-model="queryForm.HalfClassDk">
              <el-option label="所有分类" value="0"></el-option>
              <el-option v-for="(item, index) in halfClassList" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品类：" prop="CategoryType">
            <el-select v-model="queryForm.CategoryType" name="categoryType">
              <el-option label="所有品类" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.categoryType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成色：" prop="GoldType">
            <el-select v-model="queryForm.GoldType" name="goldType">
              <el-option label="所有成色" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.goldType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="重量库存：" prop="StockWgtCompareType">
            <el-select v-model="queryForm.StockWgtCompareType" placeholder="所有库存" :filterable="true" name="StockWgtCompareType">
              <el-option label="所有库存" value="0"></el-option>
              <el-option v-for="(item, index) in StockCompareType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数量库存：" prop="StockCompareType">
            <el-select v-model="queryForm.StockCompareType" placeholder="所有库存" :filterable="true" name="StockCompareType">
              <el-option label="所有库存" value="0"></el-option>
              <el-option v-for="(item, index) in StockCompareType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="HalfName" label="名称：">
            <el-input v-model="queryForm.HalfName" :maxlength="50" name="HalfName"></el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table
      :data="data"
      @sort-change="sortChange"
      :row-key="row => `${row.HalfId}-${row.WarehouseId}`"
      :expand-row-keys="expandedId"
      @expand-change="expandRow"
      show-summary
      :summary-method="getSummaries"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column type="expand" fixed>
        <template slot-scope="scope">
          <div class="expand-table">
            <el-table :data="expandTable" v-loading="expandTableLoading">
              <el-table-column prop="ShelfName" label="位置" show-overflow-tooltip></el-table-column>
              <el-table-column label="库存数量" :formatter="formatter">
                <el-table-column prop="AvailableQty" min-width="100">
                  <template slot="header">
                    可用库存
                    <el-tooltip effect="light" content="可用库存=账面库存-待出库存" placement="bottom-start">
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="FinanceQty" label="账面库存" show-overflow-tooltip></el-table-column>
                <el-table-column prop="OutwaitQty" label="待出库存" show-overflow-tooltip></el-table-column>
              </el-table-column>
              <el-table-column label="库存重量">
                <el-table-column prop="AvailableWgt" :formatter="formatter" min-width="100">
                  <template slot="header">
                    可用库存
                    <el-tooltip effect="light" content="可用库存=账面库存-待出库存" placement="bottom-start">
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="FinanceWgt" label="账面库存" :formatter="formatter"></el-table-column>
                <el-table-column prop="OutwaitWgt" label="待出库存" :formatter="formatter"></el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="HalfName" label="名称" width="100" fixed show-overflow-tooltip></el-table-column>
      <el-table-column label="库存数量">
        <el-table-column prop="AvailableQty" min-width="100">
          <template slot="header">
            可用库存
            <el-tooltip effect="light" content="可用库存=账面库存-待出库存" placement="bottom-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="FinanceQty" label="账面库存"></el-table-column>
        <el-table-column prop="OutwaitQty" label="待出库存"></el-table-column>
      </el-table-column>
      <el-table-column label="库存重量">
        <el-table-column prop="AvailableWgt" :formatter="formatter" min-width="100">
          <template slot="header">
            可用库存
            <el-tooltip effect="light" content="可用库存=账面库存-待出库存" placement="bottom-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="FinanceWgt" label="账面库存" :formatter="formatter"></el-table-column>
        <el-table-column prop="OutwaitWgt" label="待出库存" :formatter="formatter"></el-table-column>
      </el-table-column>
      <el-table-column prop="WarehouseName" label="位置" show-overflow-tooltip></el-table-column>
      <el-table-column prop="LastTime" label="最后操作时间" :formatter="formatter" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="showGoodsLog(scope.row)" name="btnShowGoodsLog">出入库记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Pagination -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- dialog 出入库记录 -->
    <el-dialog title="出入库记录" :visible.sync="goodsLogDialog" @close="$refs.logTable.clearSort()" class="log-dialog">
      <div>
        <el-table :data="halfStockLogData" ref="logTable" @sort-change="logSortChange" v-loading="logLoading" element-loading-text="拼命加载中">
          <el-table-column prop="CreateTime" label="操作时间" sortable="custom" :formatter="formatter" min-width="140" show-overflow-tooltip fixed></el-table-column>
          <el-table-column prop="OrderType" label="操作类型" :formatter="formatter" min-width="140" show-overflow-tooltip></el-table-column>
          <el-table-column prop="PreviousCode" label="来源单号" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="CreateUser" label="操作人" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="AvailableQty1" label="可用库存变化" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
          <el-table-column prop="AvailableQty2" label="可用库存结存" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
          <el-table-column prop="FinanceQty1" label="账面库存变化" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
          <el-table-column prop="FinanceQty2" label="账面库存结存" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
          <el-table-column prop="OutwaitQty1" label="待出库存变化" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
          <el-table-column prop="OutwaitQty2" label="待出库存结存" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Note" label="备注" min-width="100" show-overflow-tooltip></el-table-column>
        </el-table>
        <!-- Pagination -->
        <pagination :pg="halfStockLogParam.PageIndex" :size="halfStockLogParam.PageSize" :total="halfStockLogTotal" @currentChange="goodsLogPageChange" @sizeChange="goodsLogPageSizeChange"></pagination>
      </div>
    </el-dialog>
    <!-- end 出入库记录 -->

    <!-- 导出 -->
    <base-export-field-setter @submit="downLoadData" title="导出" :visible.sync="exportVisible" :items="exportColumns" :props="{key: 'FieldEnName', label: 'FieldCnName'}"/>
  </el-row>
</template>

<script>
import { YNStatus } from '@/enums/common.js'
import {
  StockCompareType,
  SettingDictionaryDictType,
  HalfStockLogOrderType,
  HalfStockLogPositionType,
  HalfStockLogEventType
} from '@/enums/stocking.js'
import {
  STOCKING_API_HALF_STOCK_WAREHOUSE_GETS,
  STOCKING_API_HALF_STOCK_WAREHOUSE_GETSTOTAL,
  STOCKING_API_HALF_STOCK_SHELF_GETS,
  STOCKING_API_HALF_STOCK_LOG_GETS,
  STOCKING_API_HALF_STOCK_WAREHOUSE_EXPORT
} from '@/apis/stocking.js'
import { MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST } from '@/apis/merchant.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import baseExportFieldSetter from '@/components/baseExportFieldSetter'

export default {
  components: {
    searchPanel,
    pagination,
    baseExportFieldSetter
  },
  data() {
    return {
      YNStatus,
      StockCompareType,
      HalfStockLogOrderType,
      halfClassList: [], // 半成品分类列表
      parameters: {},
      queryForm: {
        WarehouseId: '0',
        HalfClassDk: '0',
        CategoryType: '0',
        GoldType: '0',
        StockCompareType: '0',
        StockWgtCompareType: '0',
        HalfName: '',
        OrderBy: '0',
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      data: [],
      total: 0,
      expandTable: [],
      expandedId: [],
      expandTableLoading: false,
      goodsLogDialog: false, // 出入库记录对话框
      halfStockLogData: [],
      halfStockLogTotal: 0,
      halfStockLogParam: {
        HalfId: '',
        WarehouseId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PositionType: HalfStockLogPositionType.Shelf,
        PageIndex: 1,
        PageSize: 10,
      },
      logLoading: false,
      summary: {},
      exportVisible: false,
      exportColumns: [{
        FieldEnName: 'HalfName',
        FieldCnName: '名称',
      },
      {
        FieldEnName: 'AvailableQty',
        FieldCnName: '可用库存数量',
      },
      {
        FieldEnName: 'FinanceQty',
        FieldCnName: '账面库存数量',
      },
      {
        FieldEnName: 'OutwaitQty',
        FieldCnName: '待出库存数量',
      },
      {
        FieldEnName: 'AvailableWgt',
        FieldCnName: '可用库存重量',
        Precision: 3
      },
      {
        FieldEnName: 'FinanceWgt',
        FieldCnName: '账面库存重量',
        Precision: 3
      },
      {
        FieldEnName: 'OutwaitWgt',
        FieldCnName: '待出库存重量',
        Precision: 3
      },
      {
        FieldEnName: 'WarehouseName',
        FieldCnName: '位置',
      },
      {
        FieldEnName: 'LastTime',
        FieldCnName: '最后操作时间',
      },]
    }
  },
  watch: {
    $route: 'init'
  },
  created() {
    this.getEnums()
  },
  mounted() {
    this.init()
  },

  methods: {
    downLoadData(column) {
      this.$store.commit('SET_FULL_LOADING', true)
      let param = { ...this.queryForm }
      param.PageIndex = 1
      param.PageSize = 0
      param.ExportColumns = column
      param.WarehouseId = parseInt(param.WarehouseId) || 0
      param.KindTypeEk = parseInt(param.KindTypeEk) || 0
      param.HalfClassDk = parseInt(param.HalfClassDk) || 0
      param.CategoryType = parseInt(param.CategoryType) || 0
      param.GoldType = parseInt(param.GoldType) || 0
      param.StockCompareType = parseInt(param.StockCompareType) || 0
      param.StockWgtCompareType = parseInt(param.StockWgtCompareType) || 0
      param.OrderBy = parseInt(param.OrderBy) || 0
      param.IsAsced = parseInt(param.IsAsced) || 0
      STOCKING_API_HALF_STOCK_WAREHOUSE_EXPORT(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data) {
            setTimeout(() => {
              window.open(
                this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data
              )
            }, 500)
          } else {
            this.$router.push('/setter/userConfig/download')
          }
        }
        this.exportVisible = false
        this.$store.commit('SET_FULL_LOADING', false)
      })
    },
    formatter(row, column, val) {
      // 表格格式化
      let i, j
      switch (column.property) {
        case 'OrderType':
          return HalfStockLogOrderType.Types[val] + '(' + HalfStockLogEventType.Types[row.EventType] + ')'
        case 'LastTime':
        case 'CreateTime':
          return this.$options.filters.filterDateMinutes(val)
        case 'AvailableQty1':
          i = row.AvailableQty2 > row.AvailableQty1 ? '+' : ''
          j = row.AvailableWgt2 > row.AvailableWgt1 ? '+' : ''
          return i + (row.AvailableQty2 - row.AvailableQty1).toFixed(0) + '/' + j + this.$root.toFloat(row.AvailableWgt2 - row.AvailableWgt1, 3) + 'g'
        case 'AvailableQty2':
          return row.AvailableQty2 + '/' + this.$root.toFloat(row.AvailableWgt2, 3) + 'g'
        case 'FinanceQty1':
          i = row.FinanceQty2 > row.FinanceQty1 ? '+' : ''
          j = row.FinanceWgt2 > row.FinanceWgt1 ? '+' : ''
          return i + (row.FinanceQty2 - row.FinanceQty1).toFixed(0) + '/' + j + this.$root.toFloat(row.FinanceWgt2 - row.FinanceWgt1, 3) + 'g'
        case 'FinanceQty2':
          return row.FinanceQty2 + '/' + this.$root.toFloat(row.FinanceWgt2, 3) + 'g'
        case 'OutwaitQty1':
          i = row.OutwaitQty2 > row.OutwaitQty1 ? '+' : ''
          j = row.OutwaitWgt2 > row.OutwaitWgt1 ? '+' : ''
          return i + (row.OutwaitQty2 - row.OutwaitQty1).toFixed(0) + '/' + j + this.$root.toFloat(row.OutwaitWgt2 - row.OutwaitWgt1, 3) + 'g'
        case 'OutwaitQty2':
          return row.OutwaitQty2 + '/' + this.$root.toFloat(row.OutwaitWgt2, 3) + 'g'
        default:
          return this.$root.toFloat(val, 3) + 'g'
      }
    },
    showGoodsLog(row) {
      this.goodsLogDialog = true
      this.halfStockLogParam.PositionType = HalfStockLogPositionType.Shelf
      this.halfStockLogParam.HalfId = row.HalfId
      this.halfStockLogParam.WarehouseId = row.WarehouseId
      this.halfStockLogParam.IsAsced = YNStatus.No
      this.halfStockLogParam.PageIndex = 1
      this.halfStockLogParam.PageSize = 10
      this.getHalfStockLogData()
    },
    getHalfStockLogData() { // 出入库记录
      this.logLoading = true
      STOCKING_API_HALF_STOCK_LOG_GETS(this.halfStockLogParam).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.halfStockLogData = res.data.Data.Rows || []
          this.halfStockLogTotal = res.data.Data.Count
        }
        this.logLoading = false
      })
    },
    logSortChange(sort) {
      this.halfStockLogParam.IsAsced = sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getHalfStockLogData()
    },
    expandRow(row, expandedRows) {
      // 展开行
      this.expandTableLoading = true
      this.expandedId = []
      if (expandedRows.some(item => `${item.HalfId}-${item.WarehouseId}` === `${row.HalfId}-${row.WarehouseId}`)) {
        this.expandedId.push(`${row.HalfId}-${row.WarehouseId}`)
        STOCKING_API_HALF_STOCK_SHELF_GETS({
          WarehouseId: row.WarehouseId,
          HalfId: row.HalfId
        }).then(res => {
          this.expandTableLoading = false
          if (res.data.Code === 'CORRECT') {
            this.expandTable = res.data.Data.Rows
          }
        })
      }
    },
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            WarehouseId: '0',
            HalfClassDk: '0',
            CategoryType: '0',
            GoldType: '0',
            StockCompareType: '0',
            StockWgtCompareType: '0',
            HalfName: '',
            OrderBy: '0',
            IsAsced: YNStatus.No,
            PageIndex: 1,
            PageSize: 20
          }
      if (query.isSenior) {
        query.isSenior = query.isSenior === 'true' ? true : false
      }
      query.PageIndex = parseInt(query.PageIndex)
      query.PageSize = parseInt(query.PageSize)
      this.parameters = { ...query }
      this.queryForm = { ...query }
      this.getData()
      this.getTotal()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_HALF_STOCK_WAREHOUSE_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.expandedId = [] // 重新请求数据时，重置展开行
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
          if(this.parameters.PageIndex !== 1 && this.data.length === 0) {
            this.onSearch()
          }
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    sortChange(sort) {
      this.parameters.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.initRoute()
    },
    onSearch() {
      this.queryForm.PageIndex = 1
      this.queryForm.isSenior = true
      if (JSON.stringify(this.parameters) === JSON.stringify(this.queryForm)) {
        this.getData()
        this.getTotal()
      } else {
        this.parameters = { ...this.queryForm }
        this.initRoute()
      }
    },
    onReset() {
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
      this.parameters.PageSize = val
      this.parameters.PageIndex = 1
      this.initRoute()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: this.parameters
      })
    },
    getTotal() {
      STOCKING_API_HALF_STOCK_WAREHOUSE_GETSTOTAL(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.summary = res.data.Data
        }
      })
    },
    getSummaries(param) {
      // 自定义合计列
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          return (sums[0] = '合计')
        }
        switch (column.property) {
          case 'AvailableQty':
          case 'FinanceQty':
          case 'OutwaitQty':
            sums[index] = this.summary[column.property]
            break
          case 'AvailableWgt':
          case 'FinanceWgt':
          case 'OutwaitWgt':
            sums[index] = this.$root.toFloat(this.summary[column.property], 3) + 'g'
            break
          default:
            sums[index] = ''
            break
        }
      })
      return sums
    },

    getEnums() {
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST')
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: SettingDictionaryDictType.HalfBasicHalfClass
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.halfClassList = res.data.Data.Rows
        }
      })
    },
    goodsLogPageChange(val) {
      this.halfStockLogParam.PageIndex = val
      this.getHalfStockLogData()
    },
    goodsLogPageSizeChange(val) {
      this.halfStockLogParam.PageIndex = 1
      this.halfStockLogParam.PageSize = val
      this.getHalfStockLogData()
    }
  }
}
</script>

<style lang="scss" scoped>
.expand-table {
  // width: 400px;
  margin: 0 auto;
  padding: 0 100px;
}
.log-dialog {
  .panel {
    margin: 0;
    border-top: 0;
    border-color: #ebeef5;
    .panel-bd {
      padding: 0;
      border: 0;
    }
  }
}
</style>
