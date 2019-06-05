<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" @keyup.enter.native="onSearch" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset" :isSenior="true">
        <template slot="btnBox">
          <el-form-item prop="StuffType">
            <el-radio-group v-model="queryForm.StuffType" @change="changeTabs">
              <el-radio-button v-for="(item, index) in StuffType.Types" :label="Number(index)" :key="index">{{item}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-button @click="ExportVisible=true" class="m-r-5">导出</el-button>
          <el-form-item prop="PartnerId">
            <el-select v-model="queryForm.PartnerId" @change="onSearch" :filterable="true" name="PartnerId">
              <el-option label="所有供应商" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.suppliers.filter(item => {return(item.PartnerType == PartnerType.Merchant||item.PartnerType == PartnerType.Supplier)})" :key="index" :label="item.Value" :value="String(item.Id)"> </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="成色：" prop="GoldType" v-show="queryForm.StuffType == StuffType.Gold" :key="0">
            <el-select v-model="queryForm.GoldType" name="goldType">
              <el-option label="全部" value="0"> </el-option>
              <el-option v-for="(item, index) in $store.getters.goldType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="queryForm.StuffType == StuffType.Stone" :key="1" label="石料名称：">
            <el-select v-model="queryForm.StoneClassTypeEk">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in stoneClassList" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="queryForm.StuffType == StuffType.Stone" :key="2" prop="StonePackageNo" label="包号/石号：">
            <el-input v-model="queryForm.StonePackageNo" :maxlength="50" name="StonePackageNo"></el-input>
          </el-form-item>
          <el-form-item v-show="queryForm.StuffType == StuffType.Part" :key="3" label="配件名称：" prop="PartTypeEk">
            <el-select v-model="queryForm.PartTypeEk" name="PartTypeEk">
              <el-option label="全部" value="0"> </el-option>
              <el-option v-for="(item, index) in partTypeList" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="供应商：" prop="PartnerId">
            <el-select v-model="queryForm.PartnerId" placeholder="全部" :filterable="true">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.suppliers.filter(item => {return(item.PartnerType == PartnerType.Merchant||item.PartnerType == PartnerType.Supplier)})" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="库存：" prop="StockCompareType">
            <el-select v-model="queryForm.StockCompareType" placeholder="所有库存" :filterable="true" name="StockCompareType">
              <el-option label="所有库存" value="0"> </el-option>
              <el-option v-for="(item, index) in StockCompareType.Types" :key="index" :label="item" :value="String(index)"> </el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="data" @sort-change="sortChange" show-summary :summary-method="getSummaries" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="GoldType" label="成色" :formatter="formatter" min-width="100" fixed show-overflow-tooltip v-if="queryForm.StuffType == StuffType.Gold"></el-table-column>
      <template v-if="queryForm.StuffType == StuffType.Stone">
        <el-table-column prop="StoneClassTypeEv" label="石料名称" min-width="100" fixed show-overflow-tooltip key="StoneClassTypeEv"></el-table-column>
        <el-table-column prop="StonePackageNo" label="石号/包号" min-width="100" fixed show-overflow-tooltip key="StonePackageNo"></el-table-column>
      </template>
      <el-table-column prop="PartnerName" label="供应商" min-width="100" fixed show-overflow-tooltip></el-table-column>
      <el-table-column v-if="queryForm.StuffType == StuffType.Part" prop="PartTypeEv" label="配件名称" min-width="100" fixed show-overflow-tooltip></el-table-column>
      <el-table-column label="库存数量">
        <el-table-column prop="AvailableQty" min-width="100" show-overflow-tooltip>
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
        <el-table-column prop="AvailableWgt" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.AvailableWgt}}{{queryForm.StuffType == StuffType.Stone?'ct':'g'}}
          </template>
          <template slot="header">
            可用库存
            <el-tooltip effect="light" content="可用库存=账面库存-待出库存" placement="bottom-start">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="FinanceWgt" label="账面库存" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.FinanceWgt}}{{queryForm.StuffType == StuffType.Stone?'ct':'g'}}
          </template>
        </el-table-column>
        <el-table-column prop="OutwaitWgt" label="待出库存">
          <template slot-scope="scope">
            {{scope.row.OutwaitWgt}}{{queryForm.StuffType == StuffType.Stone?'ct':'g'}}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="LastTime" label="最后操作时间" :formatter="formatter" sortable="custom" min-width="120" show-overflow-tooltip=""></el-table-column>
      <el-table-column label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="showGoodsLog(scope.row)" name="btnShowGoodsLog">出入库记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Pagination -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- dialog 出入库记录 -->
    <el-dialog title="出入库记录" :visible.sync="goodsLogDialog" class="log-dialog" @close="logParam.PageIndex = 1">
      <div class="panel">
        <div class="panel-bd">
          <el-table :data="logData" v-loading="logLoading" element-loading-text="拼命加载中">
            <el-table-column prop="CreateTime" label="操作时间" :formatter="formatter" min-width="140" show-overflow-tooltip fixed>
            </el-table-column>
            <el-table-column prop="OrderType" label="操作类型" :formatter="formatter" min-width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="PreviousCode" label="来源单号" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column prop="CreateUser" label="操作人" min-width="110" show-overflow-tooltip></el-table-column>

            <el-table-column prop="AvailableQty1" :formatter="formatter" min-width="120" label="可用库存变化" show-overflow-tooltip></el-table-column>
            <el-table-column prop="AvailableQty2" :formatter="formatter" min-width="120" label="可用库存结存" show-overflow-tooltip></el-table-column>
            <el-table-column prop="FinanceQty1" :formatter="formatter" min-width="120" label="账面库存变化" show-overflow-tooltip></el-table-column>
            <el-table-column prop="FinanceQty2" :formatter="formatter" min-width="120" label="账面库存结存" show-overflow-tooltip></el-table-column>
            <el-table-column prop="OutwaitWgt1" :formatter="formatter" min-width="120" label="待出库存变化" show-overflow-tooltip></el-table-column>
            <el-table-column prop="OutwaitWgt2" :formatter="formatter" min-width="120" label="待出库存结存" show-overflow-tooltip></el-table-column>

            <el-table-column prop="Note" label="备注" min-width="100" show-overflow-tooltip></el-table-column>
          </el-table>
          <!-- Pagination -->
          <pagination :pg="logParam.PageIndex" :size="logParam.PageSize" :total="logTotal" @currentChange="goodsLogPageChange" @sizeChange="goodsLogPageSizeChange"></pagination>
        </div>
      </div>
    </el-dialog>
    <!-- end 出入库记录 -->

    <!-- 导出 -->
    <base-export-field-setter @submit="downLoadData" title="导出" :visible.sync="ExportVisible" :items="queryForm.StuffType== StuffType.Gold?ExportColumns1:(queryForm.StuffType== StuffType.Stone?ExportColumns3:ExportColumns5)" :props="{key: 'FieldEnName', label: 'FieldCnName'}"/>
    <!-- end 导出 -->
  </el-row>
</template>

<script>
import { YNStatus, StuffType, PartnerType } from '@/enums/common.js'
import {
  StockCompareType,
  WeiwStuffStockLogOrderType,
  SettingEnumeratorEnumeratorType,
  WeiwStuffStockLogEventType
} from '@/enums/stocking.js'
import {
  STOCKING_API_WEIW_STUFF_STOCK_GETS,
  STOCKING_API_WEIW_STUFF_STOCK_LOG_GETS,
  STOCKING_API_WEIW_STUFF_STOCK_EXPORT,
  STOCKING_API_WEIW_STUFF_STOCK_GETSTOTAL
} from '@/apis/stocking.js'
import { MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST } from '@/apis/merchant.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import baseExportFieldSetter from '@/components/baseExportFieldSetter'
import dayjs from 'dayjs'
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
      PartnerType,
      StockCompareType,
      WeiwStuffStockLogEventType,
      partTypeList: [], // 配件列表
      stoneClassList: [], // 石类列表
      parameters: {},
      queryForm: {
        PartnerId: '0',
        StuffType: 1,
        GoldType: '0',
        PartTypeEk: '0',
        StonePackageNo: '',
        StoneClassTypeEk: '0',
        StockCompareType: '0',
        CreateUserId: 0,
        CreateUser: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      data: [],
      detail: {},
      total: 0,
      expandTable: [],
      expandTableLoading: false,
      goodsLogDialog: false, // 出入库记录对话框
      ExportVisible: false,
      ExportColumns1: [
        {
          FieldEnName: 'GoldTypeName',
          FieldCnName: '成色',
        },
        {
          FieldEnName: 'PartnerName',
          FieldCnName: '供应商',
        },
        {
          FieldEnName: 'AvailableQty',
          FieldCnName: '可用库存(数量)',
        },
        {
          FieldEnName: 'FinanceQty',
          FieldCnName: '账面库存(数量)',
        },
        {
          FieldEnName: 'OutwaitQty',
          FieldCnName: '待出库存(数量)',
        },
        {
          FieldEnName: 'AvailableWgt',
          FieldCnName: '可用库存(重量)',
          Precision: 3,
        },
        {
          FieldEnName: 'FinanceWgt',
          FieldCnName: '账面库存(重量)',
          Precision: 3,
        },
        {
          FieldEnName: 'OutwaitWgt',
          FieldCnName: '待出库存(重量)',
          Precision: 3,
        },
        {
          FieldEnName: 'LastTime',
          FieldCnName: '最后操作时间',
          Precision: 3,
        }
      ],
      ExportColumns3: [
        {
          FieldEnName: 'StoneClassTypeEv',
          FieldCnName: '石料',
        },
        {
          FieldEnName: 'StonePackageNo',
          FieldCnName: '石号/包号',
        },
        {
          FieldEnName: 'PartnerName',
          FieldCnName: '供应商',
        },
        {
          FieldEnName: 'AvailableQty',
          FieldCnName: '可用库存(数量)',
        },
        {
          FieldEnName: 'FinanceQty',
          FieldCnName: '账面库存(数量)',
        },
        {
          FieldEnName: 'OutwaitQty',
          FieldCnName: '待出库存(数量)',
        },
        {
          FieldEnName: 'AvailableWgt',
          FieldCnName: '可用库存(重量)',
          Precision: 3,
        },
        {
          FieldEnName: 'FinanceWgt',
          FieldCnName: '账面库存(重量)',
          Precision: 3,
        },
        {
          FieldEnName: 'OutwaitWgt',
          FieldCnName: '待出库存(重量)',
          Precision: 3,
        },
        {
          FieldEnName: 'LastTime',
          FieldCnName: '最后操作时间',
          Precision: 3,
        }
      ],
      ExportColumns5: [
        {
          FieldEnName: 'PartTypeEv',
          FieldCnName: '配件名称',
        },
        {
          FieldEnName: 'PartnerName',
          FieldCnName: '供应商',
        },
        {
          FieldEnName: 'AvailableQty',
          FieldCnName: '可用库存(数量)',
        },
        {
          FieldEnName: 'FinanceQty',
          FieldCnName: '账面库存(数量)',
        },
        {
          FieldEnName: 'OutwaitQty',
          FieldCnName: '待出库存(数量)',
        },
        {
          FieldEnName: 'AvailableWgt',
          FieldCnName: '可用库存(重量)',
          Precision: 3,
        },
        {
          FieldEnName: 'FinanceWgt',
          FieldCnName: '账面库存(重量)',
          Precision: 3,
        },
        {
          FieldEnName: 'OutwaitWgt',
          FieldCnName: '待出库存(重量)',
          Precision: 3,
        },
        {
          FieldEnName: 'LastTime',
          FieldCnName: '最后操作时间',
          Precision: 3,
        }
      ],
      logData: [],
      logTotal: 0,
      logParam: {
        HalfId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 10
      },
      logLoading: false,
      summary: {}
    }
  },
  watch: {
    $route: 'init'
  },
  beforeMount() {
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            PartnerId: '0',
            StuffType: 1,
            GoldType: '0',
            PartTypeEk: '0',
            StonePackageNo: '',
            StoneClassTypeEk: '0',
            StockCompareType: '0',
            CreateUserId: 0,
            CreateUser: '',
            OrderBy: 0,
            IsAsced: this.YNStatus.No,
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
      console.log(110, this.curr)
      this.$store.commit('SET_TB_LOADING', true) // table loading
      this.queryForm = Object.assign(this.queryForm, this.parameters)
      STOCKING_API_WEIW_STUFF_STOCK_GETS(this.queryForm).then(res => {
        if (res.data.Code == 'CORRECT') {
          console.log('res.data', res.data)
          this.data = res.data.Data.Rows || []
          this.data.forEach(item => {
            item.FinanceWgt = this.$root.toFloat(item.FinanceWgt, 3)
            item.AvailableWgt = this.$root.toFloat(item.AvailableWgt, 3)
            item.OutwaitWgt = this.$root.toFloat(item.OutwaitWgt, 3)
          })
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    getTotal(){
      STOCKING_API_WEIW_STUFF_STOCK_GETSTOTAL(this.queryForm).then(res => {
        if(res.data.Code == 'CORRECT'){
          this.detail = res.data.Data
        }
      })
    },
    changeTabs() {
      this.parameters.StuffType = this.queryForm.StuffType
      this.getData()
      this.getTotal()
    },
    sortChange(sort) {
      console.log(111)
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.onSearch()
    },
    downLoadData(column){ // 导出
      let obj = {...this.queryForm}
      obj.ExportColumns = column
      obj.StuffType = parseInt(obj.StuffType) || 0
      obj.GoldType = parseInt(obj.GoldType) || 0
      obj.PartnerId = parseInt(obj.PartnerId) || 0
      obj.StoneClassTypeEk = parseInt(obj.StoneClassTypeEk) || 0
      obj.PartTypeEk = parseInt(obj.PartTypeEk) || 0
      obj.StockCompareType = parseInt(obj.StockCompareType) || 0
      obj.OrderBy = parseInt(obj.OrderBy) || 0
      obj.IsAsced = parseInt(obj.IsAsced) || 0
      obj.PageIndex = 1
      obj.PageSize = 0
      this.$store.commit('SET_FULL_LOADING', true)
      STOCKING_API_WEIW_STUFF_STOCK_EXPORT(obj).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
        if(res.data.Code == 'CORRECT'){
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
      }).catch(() => {
        this.ExportVisible = false
        this.$store.commit('SET_FULL_LOADING', false)
      })
    },
    formatter(row, column, val) {
      // 表格格式化
      let i, j
      switch (column.property) {
        case 'GoldType':
          return this.$store.getters.goldType.Types[val]
        case 'PartnerId':
          return this.$store.getters.suppliers.forEach(item => {
            if (item.Id == val) {
              return item.Value
            }
          })
        case 'LastTime':
        case 'CreateTime':
          return val.substr(0, 4) === '1900'
            ? '-'
            : dayjs(new Date(val)).format('YYYY-MM-DD HH:mm:ss')
        case 'OrderType':
          return WeiwStuffStockLogOrderType.Types[val] + '('+ this.WeiwStuffStockLogEventType.Types[row.EventType] +')'
        case 'AvailableQty1':
          i = row.AvailableQty2 > row.AvailableQty1 ? '+' : ''
          j = row.AvailableWgt2 > row.AvailableWgt1 ? '+' : ''
          return (
            i +
            (row.AvailableQty2 - row.AvailableQty1).toFixed(0) +
            '/' +
            j +
            this.$root.toFloat(row.AvailableWgt2 - row.AvailableWgt1, 3) +
            'g'
          )
        case 'AvailableQty2':
          return (
            row.AvailableQty2 +
            '/' +
            this.$root.toFloat(row.AvailableWgt2, 3) +
            'g'
          )
        case 'FinanceQty1':
          i = row.FinanceQty2 > row.FinanceQty1 ? '+' : ''
          j = row.FinanceWgt2 > row.FinanceWgt1 ? '+' : ''
          return (
            i +
            (row.FinanceQty2 - row.FinanceQty1).toFixed(0) +
            '/' +
            j +
            this.$root.toFloat(row.FinanceWgt2 - row.FinanceWgt1, 3) +
            'g'
          )
        case 'FinanceQty2':
          return (
            row.FinanceQty2 + '/' + this.$root.toFloat(row.FinanceWgt2, 3) + 'g'
          )
        case 'OutwaitWgt1':
          i = row.OutwaitQty2 > row.OutwaitQty1 ? '+' : ''
          j = row.OutwaitWgt2 > row.OutwaitWgt1 ? '+' : ''
          return (
            i +
            (row.OutwaitQty2 - row.OutwaitQty1).toFixed(0) +
            '/' +
            j +
            this.$root.toFloat(row.OutwaitWgt2 - row.OutwaitWgt1, 3) +
            'g'
          )
        case 'OutwaitWgt2':
          return (
            row.OutwaitQty2 + '/' + this.$root.toFloat(row.OutwaitWgt2, 3) + 'g'
          )
        default:
          break
      }
    },
    getSummaries(param) {
      // const { columns, data } = param
      const { columns } = param
      let sums = []
      columns.forEach((column, index) => {
        if (index === 1) {
          sums[1] = ''
          return
        }
        // if (index === 0) {
        //   sums[0] = '合计'
        // }
        // if (index > 1) {
        //   const values = data.map(item => Number(item[column.property]))
        //   if (!values.every(value => isNaN(value))) {
        //     sums[index] = values.reduce((prev, curr) => {
        //       const value = Number(curr)
        //       if (!isNaN(value)) {
        //         return prev + curr
        //       }
        //     }, 0)
        //     if(this.queryForm.StuffType == StuffType.Gold || this.queryForm.StuffType == StuffType.Part){
        //       if(index > 4){
        //         sums[index] = sums[index].toFixed(3)
        //       }
        //     }else if(this.queryForm.StuffType == StuffType.Stone){
        //       if(index > 5){
        //         sums[index] = sums[index].toFixed(3)
        //       }
        //     }
        //     console.log('sums[index]', sums[index], 'index', index, this.queryForm.StuffType, 'sums', sums)
        //   }
        // }
        if(this.queryForm.StuffType == StuffType.Gold || this.queryForm.StuffType == StuffType.Part){
          sums = [
            '合计', 
            '', 
            this.detail.AvailableQty, 
            this.detail.FinanceQty, 
            this.detail.OutwaitQty, 
            this.$root.toFloat(this.detail.AvailableWgt,3) + 'g', 
            this.$root.toFloat(this.detail.FinanceWgt,3) + 'g', 
            this.$root.toFloat(this.detail.OutwaitWgt,3) + 'g']
        }else{
          sums = [
            '合计', 
            '', 
            '', 
            this.detail.AvailableQty, 
            this.detail.FinanceQty, 
            this.detail.OutwaitQty, 
            this.$root.toFloat(this.detail.AvailableWgt,3) + 'ct', 
            this.$root.toFloat(this.detail.FinanceWgt,3) + 'ct', 
            this.$root.toFloat(this.detail.OutwaitWgt,3) + 'ct']
        }
      })
      return sums
    },
    showGoodsLog(row) {
      this.goodsLogDialog = true
      this.logParam.PageIndex = 1
      this.logParam = { ...this.logParam, ...row }
      this.getLogData()
    },
    getLogData() {
      // 出入库记录
      this.logLoading = true
      STOCKING_API_WEIW_STUFF_STOCK_LOG_GETS(this.logParam).then(res => {
        console.log(res.data)
        if (res.data.Code === 'CORRECT') {
          this.logData = res.data.Data.Rows || []
          this.logTotal = res.data.Data.Count
        }
        this.logLoading = false
      })
    },
    onSearch() {
      this.queryForm.PageIndex = 1
      this.queryForm.isSenior = true
      if (
        JSON.stringify(this.$route.query) === JSON.stringify(this.queryForm)
      ) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: this.queryForm
      })
    },
    onReset() {
      this.queryForm = {
        PartnerId: '0',
        StuffType: this.queryForm.StuffType,
        GoldType: '0',
        PartTypeEk: '0',
        StonePackageNo: '',
        StoneClassTypeEk: '0',
        StockCompareType: '0',
        CreateUserId: 0,
        CreateUser: '',
        OrderBy: 0,
        IsAsced: this.YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    currentChange(val) {
      // 切换当前页
      this.queryForm.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.queryForm.PageSize = val
      this.queryForm.PageIndex = 1
      this.initRoute()
    },
    getEnums() {
      this.$store.dispatch('GET_GOLD_TYPE')
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST')
      this.$store.dispatch('GET_SUPPLIERS_DROPLIST')
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.PartType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          // this.partTypeList = res.data.Data.Rows.filter(
          //   item => item.State === YNStatus.Yes
          // )
          this.partTypeList = res.data.Data.Rows
        }
      })
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.StoneClassType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          // this.stoneClassList = res.data.Data.Rows.filter(
          //   item => item.State === YNStatus.Yes
          // )
          this.stoneClassList = res.data.Data.Rows
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
.expand-talble {
  // width: 400px;
  margin: 0 auto;
  padding-left: 140px;
  padding-right: 200px;
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
