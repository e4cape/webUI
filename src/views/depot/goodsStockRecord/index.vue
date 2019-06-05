<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" @keyup.enter.native="onSearch" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-dropdown class="multi-operation" @command="ExportVisible = true" v-if="data.length">
            <el-button name="btndownLoad">
              导出
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item name="loadData" command="loadData">导出查询结果</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="BarCode">
            <el-input name="BarCode" v-model="queryForm.BarCode" :maxlength="50" placeholder="条码">
              <el-button name="btnonSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="所有位置：" prop="Position" v-if="characterType === CharacterType.Company">
            <el-cascader v-model="queryForm.Position" :options="positionTypeArr" :props="positionArrProps" @change="handlePosition" change-on-select name="Position"></el-cascader>
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
              <el-option v-for="(item, index) in $store.getters.categoryType.TypeArray" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="GoldType" label="成色：">
            <el-select name="GoldType" v-model="queryForm.GoldType" placeholder="所有成色" :filterable="true">
              <el-option label="所有成色" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.goldType.TypeArray" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="FinanceType" label="类别：">
            <el-select name="FinanceType" v-model="queryForm.FinanceType" placeholder="所有类别" :filterable="true">
              <el-option label="所有类别" value="0"></el-option>
              <el-option v-for="(item,index) in FinanceType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="GoodsType" label="类型：">
            <el-select name="GoodsType" v-model="queryForm.GoodsType" placeholder="所有类型" :filterable="true">
              <el-option label="所有类型" value="0"></el-option>
              <el-option v-for="(item, index) in GoodsType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="BarCode" label="条码：">
            <el-input name="BarCode" v-model="queryForm.BarCode" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="StyleCode" label="款号：">
            <el-input name="StyleCode" v-model="queryForm.StyleCode" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="GoodsName" label="货品名称：">
            <el-input name="GoodsName" v-model="queryForm.GoodsName" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item prop="OrderType" label="操作类型：">
            <el-select name="OrderType" v-model="queryForm.OrderType" placeholder="全部" :filterable="true">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in GoodsStockLogOrderType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="CreateTime" label="操作时间：">
            <el-date-picker
              name="CreateTime"
              v-model="queryForm.CreateTime"
              :unlink-panels="true"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- @module 数据表格 -->
    <el-table :data="data" @sort-change="sortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="CreateTime" label="操作时间" min-width="120" sortable="custom" show-overflow-tooltip fixed>
        <template slot-scope="scope">{{ scope.row.CreateTime | filterDateMinutes }}</template>
      </el-table-column>
      <el-table-column prop="BarCode" label="条码" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="StyleCode" label="款号" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoodsName" label="货品名称" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoodsName" label="位置" min-width="140" show-overflow-tooltip v-if="characterType === CharacterType.Company">
        <template slot-scope="scope">{{scope.row.WarehouseName || scope.row.StoreName}}</template>
      </el-table-column>
      <el-table-column prop="OrderType" label="操作类型" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">{{GoodsStockLogOrderType.Types[scope.row.OrderType]}}</template>
      </el-table-column>
      <el-table-column prop="PreviousCode" label="来源单号" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateUser" label="操作人" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="可用库存变化" min-width="100">
        <template slot-scope="scope">{{(scope.row.AvailableQty2 > scope.row.AvailableQty1 ? '+' : '') + (scope.row.AvailableQty2 - scope.row.AvailableQty1).toFixed(0)}}</template>
      </el-table-column>
      <el-table-column prop="AvailableQty2" label="可用库存结存" min-width="100"></el-table-column>
      <el-table-column label="账面库存变化" min-width="100">
        <template slot-scope="scope">{{(scope.row.FinanceQty2 > scope.row.FinanceQty1 ? '+' : '') + (scope.row.FinanceQty2 - scope.row.FinanceQty1).toFixed(0)}}</template>
      </el-table-column>
      <el-table-column prop="FinanceQty2" label="账面库存结存" min-width="100"></el-table-column>
      <el-table-column label="待出库存变化" min-width="100">
        <template slot-scope="scope">{{(scope.row.OutwaitQty2 > scope.row.OutwaitQty1 ? '+' : '') + (scope.row.OutwaitQty2 - scope.row.OutwaitQty1).toFixed(0)}}</template>
      </el-table-column>
      <el-table-column prop="OutwaitQty2" label="待出库存结存" min-width="100"></el-table-column>
      <!-- <el-table-column prop="Quantity" label="库存变化" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.Quantity > 0 ? '+' + scope.row.Quantity : scope.row.Quantity}}</template>
      </el-table-column>
      <el-table-column prop="AvailableQty" label="库存结余" min-width="80" show-overflow-tooltip></el-table-column>-->
      <el-table-column prop="Note" label="备注" min-width="100" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <base-export-field-setter @submit="downLoadData" title="导出" :visible.sync="ExportVisible" :items="ExportColumns" :props="{key: 'FieldEnName', label: 'FieldCnName'}"/>
  </div>
</template>

<script>
import { YNStatus, CharacterType } from '@/enums/common.js'
import {
  FinanceType,
  GoodsType,
  GoodsStockLogOrderType,
  GoodsStockLogPositionType
} from '@/enums/stocking.js'

import {
  STOCKING_API_GOODS_STOCK_LOG_GETS,
  STOCKING_API_GOODS_STOCK_LOG_EXPORTGETSRESULT
} from '@/apis/stocking.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import baseExportFieldSetter from '@/components/baseExportFieldSetter'

export default {
  data() {
    return {
      YNStatus,
      CharacterType,
      FinanceType,
      GoodsType,
      GoodsStockLogOrderType,
      positionTypeArr: [],
      positionArrProps: {
        value: 'Id',
        label: 'Value',
        children: 'children'
      },
      queryForm: {
        Position: [0],
        PositionType: 0,
        StorechterId: 0,
        WarehouseId: 0,
        OrderType: '0',
        CreateTime1: '', // DateTime: '', // 创建时间1
        CreateTime2: '', // DateTime: '', // 创建时间2
        BarCode: '', // String: '', // 门店条码
        StyleCode: '', // String: '', // 门店款号
        GoodsName: '', // String: '', // 货品名称
        FinanceType: '0', // Int32: '', // 货品类别(枚举)
        GoodsType: '0', // Int32: '', // 货品类型(枚举)
        MaterialType: '0', // Int32: '', // 材质类型(枚举)
        CategoryType: '0', // Int32: '', // 品类(枚举)
        GoldType: '0', // Int32: '', // 成色(枚举)
        OrderBy: 0, // Int32: '', // 排序字段(0=最后操作时间,1=条码, 2=款号)
        IsAsced: YNStatus.No, // Int32: '', // 是否升序(枚举)
        PageIndex: 1, // Int32: '', // 当前页码
        PageSize: 20, // Int32: '', // 每页?条
        CreateTime: []
      },
      data: [],
      total: 0,
      parameters: {
      },
      ExportVisible: false,
      ExportColumns: [
        {
          FieldEnName: 'CreateTime',
          FieldCnName: '操作时间',
        },
        {
          FieldEnName: 'BarCode',
          FieldCnName: '条码',
        },
        {
          FieldEnName: 'StyleCode',
          FieldCnName: '款号',
        },
        {
          FieldEnName: 'GoodsName',
          FieldCnName: '货品名称',
        },
        {
          FieldEnName: 'OrderTypeCn',
          FieldCnName: '操作类型',
        },
        {
          FieldEnName: 'PreviousCode',
          FieldCnName: '来源单号',
        },
        {
          FieldEnName: 'CreateUser',
          FieldCnName: '操作人',
        },

        {
          FieldEnName: 'AvailableQtyExport1',
          FieldCnName: '可用库存变化',
        },
        {
          FieldEnName: 'AvailableQty2',
          FieldCnName: '可用库存结存',
        },

        {
          FieldEnName: 'FinanceQtyExport1',
          FieldCnName: '账面库存变化',
        },
        {
          FieldEnName: 'FinanceQty2',
          FieldCnName: '账面库存结存',
        },
        {
          FieldEnName: 'OutwaitQtyExport1',
          FieldCnName: '待出库存变化',
        },
        {
          FieldEnName: 'OutwaitQty2',
          FieldCnName: '待出库存结存'
        },
        {
          FieldEnName: 'Note',
          FieldCnName: '备注',
        },
      ],
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    },
  },
  methods: {
    // 获取位置类型
    handlePosition(val) {
      this.queryForm.PositionType = val[0]
      if (val.length === 2) {
        if (
          this.queryForm.PositionType ===
          GoodsStockLogPositionType.Warehouse
        ) {
          this.queryForm.StorechterId = 0
          this.queryForm.WarehouseId = val[1]
        } else {
          this.queryForm.StorechterId = val[1]
          this.queryForm.WarehouseId = 0
        }
      } else {
        this.queryForm.StorechterId = 0
        this.queryForm.WarehouseId = 0
      }
    },
    init() {
      let query = JSON.stringify(this.$route.query) !== '{}' ? this.$route.query : {
        Position: [0],
        PositionType: 0,
        StorechterId: 0,
        WarehouseId: 0,
        OrderType: '0',
        CreateTime1: '', // DateTime: '', // 创建时间1
        CreateTime2: '', // DateTime: '', // 创建时间2
        BarCode: '', // String: '', // 门店条码
        StyleCode: '', // String: '', // 门店款号
        GoodsName: '', // String: '', // 货品名称
        FinanceType: '0', // Int32: '', // 货品类别(枚举)
        GoodsType: '0', // Int32: '', // 货品类型(枚举)
        MaterialType: '0', // Int32: '', // 材质类型(枚举)
        CategoryType: '0', // Int32: '', // 品类(枚举)
        GoldType: '0', // Int32: '', // 成色(枚举)
        OrderBy: 0, // Int32: '', // 排序字段(0=最后操作时间,1=条码, 2=款号)
        IsAsced: YNStatus.No, // Int32: '', // 是否升序(枚举)
        PageIndex: 1, // Int32: '', // 当前页码
        PageSize: 20, // Int32: '', // 每页?条
        CreateTime: []
      }
      query.PageIndex = parseInt(query.PageIndex)
      query.PageSize = parseInt(query.PageSize)
      this.parameters = Object.assign({
      }, query)
      this.parameters.CreateTime = query.CreateTime || []
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let createTime = this.parameters.CreateTime.length ? this.parameters.CreateTime : [
        '',
        ''
      ]
      let param = {
        CreateTime1: createTime[0] || '',
        CreateTime2: createTime[1] || ''
      }
      this.queryForm = Object.assign(this.queryForm, this.parameters, param)
      STOCKING_API_GOODS_STOCK_LOG_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
          if(this.queryForm.PageIndex !== 1 && this.data.length === 0) {
            this.onSearch()
          }
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    downLoadData(column) {
      let param = { ...this.queryForm }
      param.PageIndex = 1
      param.PageSize = 0
      param.ExportColumns = column
      param.MaterialType = parseInt(param.MaterialType)
      param.CategoryType = parseInt(param.CategoryType)
      param.GoldType = parseInt(param.GoldType)
      param.FinanceType = parseInt(param.FinanceType)
      param.OrderType = parseInt(param.OrderType)
      param.GoodsType = parseInt(param.GoodsType)
      // param. = parseInt(param.MaterialType)
      STOCKING_API_GOODS_STOCK_LOG_EXPORTGETSRESULT(param).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data) {
            setTimeout(() => {
              window.open(
                this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data
              )
            }, 1000)
          } else {
            this.$router.push('/setter/userConfig/download')
          }
        }
        this.ExportVisible = false
      })
    },

    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.queryForm.isSenior = true
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
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
    sortChange(sort) {
      this.parameters.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.initRoute()
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
    // 获取所有位置下拉数据
    getPositionTypeArr() {
      this.positionTypeArr = []
      GoodsStockLogPositionType.TypeArray.forEach(item => {
        if (item.KeyId === GoodsStockLogPositionType.Store || item.KeyId === GoodsStockLogPositionType.Warehouse) {
          this.positionTypeArr.push({
            Id: item.KeyId,
            Value: item.Value,
            children: []
          })
        }
      })
      this.positionTypeArr.unshift({
        Id: 0,
        Value: '所有位置'
      })
      this.$store
        .dispatch('GET_STORES_DROPLIST')
        .then(res => {
          this.positionTypeArr.forEach((item, index) => {
            if (item.Id === GoodsStockLogPositionType.Store) {
              this.positionTypeArr[index].children = res.map(item => {
                return {
                  Id: item.CharacterId,
                  Value: item.Value
                }
              })
            }
          })
        })
        .then(
          this.$store.dispatch('GET_WAREHOUSES_DROPLIST').then(res => {
            this.positionTypeArr.forEach((item, index) => {
              if (item.Id === GoodsStockLogPositionType.Warehouse) {
                this.positionTypeArr[index].children = res.filter(item => item.State === YNStatus.Yes)
              }
            })
          })
        )
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
      this.getPositionTypeArr()
    }
  },
  created() {
    this.getStoreAllType()
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    searchPanel,
    pagination,
    baseExportFieldSetter
  }
}
</script>
