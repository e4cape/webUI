<template>
  <el-row class="content">
    <div class="tabs">
      <div v-for="(item, index) in StuffType.Types" :key="index" class="tab" :class="{active: queryForm.StuffType === index}" @click="handleStuffType(index)">{{item}}</div>
    </div>
    <div class="tab-border">
      <el-form :model="queryForm" ref="search" @keyup.enter.native="onSearch" lable-width="120px" class="item-lh-26 search-box" :inline="true">
        <div class="search-item">
          <el-form-item prop="WarehouseId" label="位置：">
            <el-select v-model="queryForm.WarehouseId" :filterable="true" name="WarehouseId">
              <el-option label="所有位置" value="0"></el-option>
              <template v-for="(item, index) in $store.getters.wareHouses">
                <el-option v-if="item.State === YNStatus.Yes" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="成色：" prop="GoldType" v-show="queryForm.StuffType == StuffType.Gold">
            <el-select v-model="queryForm.GoldType" name="goldType">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.goldType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="石料名称：" prop="StoneClassTypeEk" v-show="queryForm.StuffType == StuffType.Stone">
            <el-select v-model="queryForm.StoneClassTypeEk">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in stoneClassList" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="StonePackageNo" label="包号/石号：" v-show="queryForm.StuffType == StuffType.Stone">
            <el-input v-model="queryForm.StonePackageNo" :maxlength="50" name="StonePackageNo"></el-input>
          </el-form-item>
          <el-form-item label="配件名称：" prop="PartTypeEk" v-show="queryForm.StuffType == StuffType.Part">
            <el-select v-model="queryForm.PartTypeEk" name="PartTypeEk">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in partTypeList" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库存重量：" prop="StockWgtCompareType">
            <el-select v-model="queryForm.StockWgtCompareType" placeholder="所有库存" :filterable="true" name="StockWgtCompareType">
              <el-option label="所有库存" value="0"></el-option>
              <el-option v-for="(item, index) in StockCompareType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="库存数量：" prop="StockCompareType">
            <el-select v-model="queryForm.StockCompareType" placeholder="所有库存" :filterable="true" name="StockCompareType">
              <el-option label="所有库存" value="0"></el-option>
              <el-option v-for="(item, index) in StockCompareType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="search-btn">
          <el-button type="primary" @click="onSearch">搜索</el-button>
          <el-button type="default" @click="onReset">重置</el-button>
          <el-button @click="exportVisible = true">导出</el-button>
        </div>
      </el-form>
      <el-table
        :data="data"
        @sort-change="sortChange"
        row-key="Index"
        :expand-row-keys="expandedId"
        @expand-change="expandRow"
        v-loading="$store.getters.tb_loading"
        show-summary
        :summary-method="getSummaries"
        element-loading-text="拼命加载中"
      >
        <el-table-column type="expand" fixed>
          <template slot-scope="scope">
            <div class="expand-table">
              <el-table :data="expandTable" v-loading="expandTableLoading">
                <el-table-column prop="ShelfName" label="位置" show-overflow-tooltip></el-table-column>
                <el-table-column label="库存数量" show-overflow-tooltip>
                  <el-table-column prop="AvailableQty" min-width="100">
                    <template slot="header">
                      可用库存
                      <el-tooltip effect="light" content="可用库存=账面库存-待出库存" placement="bottom-start">
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="FinanceQty" label="账面库存" min-width="100" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="OutwaitQty" label="待出库存" min-width="100" show-overflow-tooltip></el-table-column>
                </el-table-column>
                <el-table-column label="库存重量" show-overflow-tooltip>
                  <el-table-column prop="AvailableWgt" :formatter="formatter" min-width="120">
                    <template slot="header">
                      可用库存
                      <el-tooltip effect="light" content="可用库存=账面库存-待出库存" placement="bottom-start">
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="FinanceWgt" label="账面库存" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="OutwaitWgt" label="待出库存" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="GoldTypeName" label="成色" width="100" fixed show-overflow-tooltip v-if="queryForm.StuffType == StuffType.Gold"></el-table-column>
        <template v-else-if="queryForm.StuffType == StuffType.Stone">
          <el-table-column prop="StoneClassTypeEv" label="石料名称" width="100" fixed show-overflow-tooltip key="StoneClassTypeEv"></el-table-column>
          <el-table-column prop="StonePackageNo" label="石号/包号" width="100" fixed show-overflow-tooltip key="StonePackageNo"></el-table-column>
        </template>
        <el-table-column prop="PartTypeEv" label="配件名称" width="100" fixed show-overflow-tooltip v-else></el-table-column>
        <el-table-column label="库存数量">
          <el-table-column prop="AvailableQty" min-width="100" show-overflow-tooltip>
            <template slot="header">
              可用库存
              <el-tooltip effect="light" content="可用库存=账面库存-待出库存" placement="bottom-start">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="FinanceQty" label="账面库存" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="OutwaitQty" label="待出库存" min-width="100" show-overflow-tooltip></el-table-column>
        </el-table-column>
        <el-table-column label="库存重量">
          <el-table-column prop="AvailableWgt" :formatter="formatter" min-width="120" show-overflow-tooltip>
            <template slot="header">
              可用库存
              <el-tooltip effect="light" content="可用库存=账面库存-待出库存" placement="bottom-start">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="FinanceWgt" label="账面库存" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="OutwaitWgt" label="待出库存" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
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
    </div>

    <!-- dialog 出入库记录 -->
    <el-dialog title="出入库记录" :visible.sync="goodsLogDialog" class="log-dialog" @close="logParam.PageIndex = 1">
      <div class="panel">
        <div class="panel-bd">
          <el-table :data="logData" v-loading="logLoading" element-loading-text="拼命加载中">
            <el-table-column prop="CreateTime" label="操作时间" :formatter="formatter" min-width="140" show-overflow-tooltip fixed></el-table-column>
            <el-table-column prop="OrderType" label="操作类型" :formatter="formatter" min-width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="PreviousCode" label="来源单号" min-width="180" show-overflow-tooltip></el-table-column>
            <el-table-column prop="CreateUser" label="操作人" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="AvailableQty1" label="可用库存变化" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="AvailableQty2" label="可用库存结存" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="FinanceQty1" label="账面库存变化" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="FinanceQty2" label="账面库存结存" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="OutwaitQty1" label="待出库存变化" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="OutwaitQty2" label="待出库存结存" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Note" label="备注" min-width="100" show-overflow-tooltip></el-table-column>
          </el-table>
          <!-- Pagination -->
          <pagination :pg="logParam.PageIndex" :size="logParam.PageSize" :total="logTotal" @currentChange="goodsLogPageChange" @sizeChange="goodsLogPageSizeChange"></pagination>
        </div>
      </div>
    </el-dialog>
    <!-- end 出入库记录 -->
    <base-export-field-setter @submit="downLoadData" title="导出" :visible.sync="exportVisible" :items="ExportColumns" :props="{key: 'FieldEnName', label: 'FieldCnName'}"/>
  </el-row>
</template>

<script>
import { YNStatus, StuffType } from '@/enums/common.js'
import {
  StockCompareType,
  StuffStockLogOrderType,
  SettingEnumeratorEnumeratorType,
  StuffStockLogPositionType,
  StuffStockLogEventType
} from '@/enums/stocking.js'
import {
  STOCKING_API_STUFF_STOCK_WAREHOUSE_GETS,
  STOCKING_API_STUFF_STOCK_SHELF_GETS,
  STOCKING_API_STUFF_STOCK_LOG_GETS,
  STOCKING_API_STUFF_STOCK_WAREHOUSE_EXPORT,
  STOCKING_API_STUFF_STOCK_WAREHOUSE_GETSTOTAL
} from '@/apis/stocking.js'
import { MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST } from '@/apis/merchant.js'

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
      StuffType,
      StockCompareType,
      partTypeList: [], // 配件列表
      stoneClassList: [], // 石类列表
      parameters: {},
      queryForm: {
        StuffType: '1',
        WarehouseId: '0',
        ShelfId: '0',
        GoldType: '0',
        PartTypeEk: '0',
        StoneClassTypeEk: '0',
        StockCompareType: '0',
        StockWgtCompareType: '0',
        StonePackageNo: '',
        OrderBy: 0,
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
      logData: [],
      logTotal: 0,
      logParam: {
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 10
      },
      logLoading: false,
      summary: {},
      exportVisible: false,
      exportColumns: [{
        FieldEnName: 'GoldTypeName',
        FieldCnName: '成色',
      },
      {
        FieldEnName: 'StoneClassTypeEv',
        FieldCnName: '石料名称',
      },
      {
        FieldEnName: 'StonePackageNo',
        FieldCnName: '包号/石号',
      },
      {
        FieldEnName: 'PartTypeEv',
        FieldCnName: '配件名称',
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
  computed: {
    ExportColumns() {
      if (this.queryForm.StuffType * 1 === StuffType.Gold) {
        return this.exportColumns.filter(item => item.FieldEnName !== 'StoneClassTypeEv' && item.FieldEnName !== 'StonePackageNo' && item.FieldEnName !== 'PartTypeEv')
      } else if (this.queryForm.StuffType * 1 === StuffType.Stone) {
        return this.exportColumns.filter(item => item.FieldEnName !== 'GoldTypeName' && item.FieldEnName !== 'PartTypeEv')
      } else {
        return this.exportColumns.filter(item => item.FieldEnName !== 'StoneClassTypeEv' && item.FieldEnName !== 'StonePackageNo' && item.FieldEnName !== 'GoldTypeName')
      }
    }
  },
  created() {
    this.getEnums()
  },
  mounted() {
    this.init()
  },

  methods: {
    handleStuffType(type) {
      this.queryForm.StuffType = type
      this.$refs['search'].resetFields()
      this.onSearch()
    },

    downLoadData(column) {
      this.$store.commit('SET_FULL_LOADING', true)
      let param = { ...this.queryForm }
      param.PageIndex = 1
      param.PageSize = 0
      param.ExportColumns = column
      param.WarehouseId = parseInt(param.WarehouseId) || 0
      param.StuffType = parseInt(param.StuffType) || 0
      param.GoldType = parseInt(param.GoldType) || 0
      param.PartTypeEk = parseInt(param.PartTypeEk) || 0
      param.StoneClassTypeEk = parseInt(param.StoneClassTypeEk) || 0
      param.StockCompareType = parseInt(param.StockCompareType) || 0
      param.StockWgtCompareType = parseInt(param.StockWgtCompareType) || 0
      param.OrderBy = parseInt(param.OrderBy) || 0
      param.IsAsced = parseInt(param.IsAsced) || 0
      STOCKING_API_STUFF_STOCK_WAREHOUSE_EXPORT(param).then(res => {
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
        case 'GoldType':
          return this.$store.getters.goldType.Types[val]
        case 'LastTime':
        case 'CreateTime':
          return this.$options.filters.filterDateMinutes(val)
        case 'AvailableQty1':
          i = row.AvailableQty2 > row.AvailableQty1 ? '+' : ''
          j = row.AvailableWgt2 > row.AvailableWgt1 ? '+' : ''
          return i + (row.AvailableQty2 - row.AvailableQty1).toFixed(0) + '/' + j + this.$root.toFloat(row.AvailableWgt2 - row.AvailableWgt1, 3) + (row.StuffType === StuffType.Stone ? 'ct' : 'g')
        case 'AvailableQty2':
          return row.AvailableQty2 + '/' + this.$root.toFloat(row.AvailableWgt2, 3) + (row.StuffType === StuffType.Stone ? 'ct' : 'g')
        case 'FinanceQty1':
          i = row.FinanceQty2 > row.FinanceQty1 ? '+' : ''
          j = row.FinanceWgt2 > row.FinanceWgt1 ? '+' : ''
          return i + (row.FinanceQty2 - row.FinanceQty1).toFixed(0) + '/' + j + this.$root.toFloat(row.FinanceWgt2 - row.FinanceWgt1, 3) + (row.StuffType === StuffType.Stone ? 'ct' : 'g')
        case 'FinanceQty2':
          return row.FinanceQty2 + '/' + this.$root.toFloat(row.FinanceWgt2, 3) + (row.StuffType === StuffType.Stone ? 'ct' : 'g')
        case 'OutwaitQty1':
          i = row.OutwaitQty2 > row.OutwaitQty1 ? '+' : ''
          j = row.OutwaitWgt2 > row.OutwaitWgt1 ? '+' : ''
          return i + (row.OutwaitQty2 - row.OutwaitQty1).toFixed(0) + '/' + j + this.$root.toFloat(row.OutwaitWgt2 - row.OutwaitWgt1, 3) + (row.StuffType === StuffType.Stone ? 'ct' : 'g')
        case 'OutwaitQty2':
          return row.OutwaitQty2 + '/' + this.$root.toFloat(row.OutwaitWgt2, 3) + (row.StuffType === StuffType.Stone ? 'ct' : 'g')
        case 'OrderType':
          return StuffStockLogOrderType.Types[val] + '(' + StuffStockLogEventType.Types[row.EventType] + ')'
        default:
          return this.$root.toFloat(val, 3) + (row.StuffType === StuffType.Stone ? 'ct' : 'g')
      }
    },
    showGoodsLog(row) {
      this.goodsLogDialog = true
      this.logParam.PageIndex = 1
      let param = {}
      param.PositionType = StuffStockLogPositionType.Warehouse
      param.WarehouseId = row.WarehouseId
      param.StuffType = this.queryForm.StuffType
      param.GoldType = row.GoldType
      param.PartTypeEk = row.PartTypeEk
      // param.PartTypeEv = row.PartTypeEv
      param.StonePackageNo = row.StonePackageNo
      param.StoneClassTypeEk = row.StoneClassTypeEk
      // param.StoneClassTypeEv = row.StoneClassTypeEv
      this.logParam = { ...this.logParam, ...param }
      this.getLogData()
    },
    getLogData() {
      // 出入库记录
      this.logLoading = true
      STOCKING_API_STUFF_STOCK_LOG_GETS(this.logParam).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.logData = res.data.Data.Rows || []
          this.logTotal = res.data.Data.Count
        }
        this.logLoading = false
      })
    },
    expandRow(row, expandedRows) {
      // 展开行
      this.expandTableLoading = true
      this.expandedId = []
      if (expandedRows.some(item => item.Index === row.Index)) {
        this.expandedId.push(row.Index)
        this.expandTable = [{}]
        STOCKING_API_STUFF_STOCK_SHELF_GETS({ ...row, StuffType: this.queryForm.StuffType }).then(res => {

          if (res.data.Code === 'CORRECT') {
            this.expandTable = res.data.Data.Rows
          }
          this.expandTableLoading = false

        })
      }
    },
    getTotal() {
      STOCKING_API_STUFF_STOCK_WAREHOUSE_GETSTOTAL(this.parameters).then(res => {
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
            sums[index] = this.$root.toFloat(this.summary[column.property], 3) + (this.queryForm.StuffType === StuffType.Stone ? 'ct' : 'g')
            break
          default:
            sums[index] = ''
            break
        }
      })
      return sums
    },
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            StuffType: '1',
            WarehouseId: '0',
            GoldType: '0',
            PartTypeEk: '0',
            StoneClassTypeEk: '0',
            StockCompareType: '0',
            StockWgtCompareType: '0',
            StonePackageNo: '',
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
      STOCKING_API_STUFF_STOCK_WAREHOUSE_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.expandedId = [] // 重新请求数据时，重置展开行
          this.data = res.data.Data.Rows && res.data.Data.Rows.map((item, index) => {
            return { Index: index + (this.parameters.PageIndex - 1) * this.parameters.PageSize, ...item }
          })
          this.total = res.data.Data.Count
          if (this.parameters.PageIndex !== 1 && this.data.length === 0) {
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
      this.expandedId = []
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
      this.queryForm.WarehouseId1 = '0'
      this.queryForm.ShelfId1 = '0'
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

    getEnums() {
      this.$store.dispatch('GET_GOLD_TYPE')
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', { HasShelf: YNStatus.Yes, State: YNStatus.Yes })
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({ EnumeratorType: SettingEnumeratorEnumeratorType.PartType }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.partTypeList = res.data.Data.Rows.filter(
            item => item.State === YNStatus.Yes
          )
        }

      })
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({ EnumeratorType: SettingEnumeratorEnumeratorType.StoneClassType }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.stoneClassList = res.data.Data.Rows.filter(
            item => item.State === YNStatus.Yes
          )
        }
      })

    },
    goodsLogPageChange(val) {
      this.logParam.PageIndex = val
      this.getLogData()
    },
    goodsLogPageSizeChange(val) {
      this.logParam.PageIndex = 1
      this.logParam.PageSize = val
      this.getLogData()
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-border {
  padding: 10px;
  border: 1px solid #e5e5e5;
  .search-box {
    display: flex;
    justify-content: space-between;
    border: none;
    padding: 0;
    .search-item {
      width: 1%;
      flex: 1;
    }
    .search-btn {
      width: 190px;
    }
  }
}
.expand-table {
  // width: 400px;
  margin: 0 auto;
  padding-left: 200px;
  padding-right: 100px;
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
