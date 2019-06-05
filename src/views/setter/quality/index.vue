<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" class="item-lh-26" :inline="true">
      <search-panel @onSearch="advancedSearch" @onReset="reset">
        <template slot="btnBox">
          <el-form-item v-if="characterType == CharacterType.Company">
            <el-button name="QualityListExport" type="default" @click="qualityListExport">导出Excel</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="Status">
            <el-select name="Status" v-model="queryForm.Status" @change="search" filterable>
              <el-option :value="0" label="全部"></el-option>
              <el-option v-for="item in statusOpt" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="OrderId">
            <el-input name="OrderId" v-model="queryForm.OrderId" placeholder="请输入质保单号" @keyup.enter.native="search">
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="创建日期：" prop="createTimeRange">
            <el-date-picker
              name="createTimeRange"
              v-model="queryForm.createTimeRange"
              @change="createTimeChange"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item v-show="false" prop="CreateTime1">
            <el-input name="createTime1" v-model="queryForm.CreateTime1"></el-input>
          </el-form-item>
          <el-form-item v-show="false" prop="CreateTime2">
            <el-input name="createTime2" v-model="queryForm.CreateTime2"></el-input>
          </el-form-item>
          <el-form-item label="质保单号：" prop="OrderId">
            <el-input name="orderId" v-model="queryForm.OrderId" @keyup.enter.native="advancedSearch"></el-input>
          </el-form-item>
          <el-form-item label="条码：" prop="ProductNO">
            <el-input name="productNO" v-model="queryForm.ProductNO" @keyup.enter.native="advancedSearch"></el-input>
          </el-form-item>
          <el-form-item label="商品名称：" prop="ProductTitle">
            <el-input name="productTitle" v-model="queryForm.ProductTitle" @keyup.enter.native="advancedSearch"></el-input>
          </el-form-item>
          <el-form-item label="会员昵称：" prop="AliasName">
            <el-input name="aliasName" v-model="queryForm.AliasName" @keyup.enter.native="advancedSearch"></el-input>
          </el-form-item>
          <el-form-item label="会员手机：" prop="Mobile">
            <el-input name="mobile" v-model="queryForm.Mobile" @keyup.enter.native="advancedSearch"></el-input>
          </el-form-item>
          <el-form-item label="会员姓名：" prop="TrueName">
            <el-input name="trueName" v-model="queryForm.TrueName" @keyup.enter.native="advancedSearch"></el-input>
          </el-form-item>
          <el-form-item label="门店名称：" v-if="characterType == CharacterType.Company" prop="CharacterId">
            <el-select name="characterId" v-model="queryForm.CharacterId" filterable>
              <el-option v-for="(item, index) in $store.getters.stores" :key="index" :label="item.Value" :value="item.CharacterId"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" v-loading="$store.getters.tb_loading">
      <el-table-column label="质保单号" prop="OrderId" width="160"></el-table-column>
      <el-table-column label="条码" prop="ProductNO" show-overflow-tooltip></el-table-column>
      <el-table-column label="证书号" prop="CertSeriesID" show-overflow-tooltip></el-table-column>
      <el-table-column label="商品名称" prop="ProductTitle" show-overflow-tooltip></el-table-column>
      <el-table-column label="商品原价" prop="OriginPrice" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column label="商品折后价" prop="SalePrice" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column label="会员帐号" prop="AccountID" width="230" show-overflow-tooltip></el-table-column>
      <el-table-column label="会员姓名" prop="TrueName" show-overflow-tooltip></el-table-column>
      <el-table-column label="会员昵称" prop="AliasName" show-overflow-tooltip></el-table-column>
      <el-table-column label="会员手机" prop="Mobile" show-overflow-tooltip></el-table-column>
      <el-table-column label="销售日期" prop="OrderTime" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建日期" prop="CreateTime" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <template v-if="characterType == CharacterType.Company">
        <el-table-column label="门店编号" prop="EnglishID" show-overflow-tooltip></el-table-column>
        <el-table-column label="门店名称" prop="StoreTitle" show-overflow-tooltip></el-table-column>
      </template>
      <el-table-column label="单据状态" prop="Status" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="140px">
        <template slot-scope="scoped">
          <el-button name="showDetail" type="text" @click="showDetail(scoped.row.OrderId)">详情</el-button>
          <el-button name="QualityPrint" type="text" v-if="scoped.row.Status==QualityOrderStatus.Audit" @click="qualityPrint(scoped.row.OrderId)">打印质保单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="queryForm.PageIndex" :size="queryForm.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- @module Dialog·打印 -->
    <print-order
      title="打印"
      v-if="printDialog"
      :visible.sync="printDialog"
      :conditions="encodeURIComponent(JSON.stringify({OrderId: paidId}))"
      :printingType="StoreSettingPrintingType.MarketingCloudPaperQuality"
      @listenPrintDialog="printDialog = false"
    ></print-order>
    <!-- End Dialog·打印 -->
    <el-dialog title="质保单详情" :visible.sync="dialogDetailVisible">
      <div v-loading="qualityImgLoading">
        <img class="quality" :src="templateUrl" alt>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
import printOrder from '@/components/erp/printOrder'
import {
  MARKETING_API_ORDER_QUALITY_GETS,
  MARKETING_API_ORDER_QUALITY_GET,
  MARKETING_API_ORDER_QUALITY_QUALITYLISTEXPORT
} from '@/apis/marketing.js'

import { QualityOrderStatus, StoreSettingPrintingType } from '@/enums/marketing'
import { CharacterType, YNStatus } from '@/enums/common'
export default {
  components: {
    pagination,
    searchPanel,
    printOrder
  },

  data() {
    return {
      StoreSettingPrintingType,
      CharacterType,
      QualityOrderStatus,
      paidId: '',
      printDialog: false,
      queryForm: {
        IsSenior: false,
        CreateTimeRange: [],
        Status: 0,
        ProductNO: '',
        ProductTitle: '',
        AliasName: '',
        Mobile: '',
        CreateTime1: '',
        CreateTime2: '',
        TrueName: '',
        CharacterId: 0,
        PageIndex: 1,
        PageSize: 20,
        IsAsced: YNStatus.No
      },
      templateUrl: '',
      total: 0,
      parameters: {},
      tableData: [],
      qualityImgLoading: false,
      dialogDetailVisible: false,
      statusOpt: [],
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  created() {
    this.getEnum()
    this.init()
  },
  mounted() { },
  watch: {
    $route: 'init'
  },
  methods: {
    getEnum() {
      for (let item in QualityOrderStatus.Types) {
        this.statusOpt.push({
          value: parseInt(item),
          label: QualityOrderStatus.Types[item]
        })
      }
      this.$store.dispatch('GET_STORES_DROPLIST')
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      MARKETING_API_ORDER_QUALITY_GETS(this.parameters).then(res => {
        this.$store.commit('SET_TB_LOADING', false) // table loading
        if (res.data.Code === 'CORRECT') {
          this.total = res.data.Data.Count || 10
          this.tableData = res.data.Data.Rows
        }
      })
    },
    init() {
      let query = this.$route.query
      this.queryForm.IsSenior = query.IsSenior === 'true' ? true : false
      this.queryForm.Status = parseInt(query.Status) || 0
      this.queryForm.ProductNO = query.ProductNO || ''
      this.queryForm.ProductTitle = query.ProductTitle || ''
      this.queryForm.AliasName = query.AliasName || ''
      this.queryForm.Mobile = query.Mobile || ''
      this.queryForm.TrueName = query.TrueName || ''
      this.queryForm.CharacterId = parseInt(query.CharacterId) || 0
      this.queryForm.CreateTime1 = query.CreateTime1 || ''
      this.queryForm.CreateTime2 = query.CreateTime2 || ''
      this.queryForm.CreateTimeRange = query.CreateTimeRange || []
      this.queryForm.PageIndex = query.PageIndex || 1
      this.queryForm.PageSize = query.PageSize || 20
      this.parameters = {
        ...this.queryForm
      }
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: '/setter/quality/index',
        query: JSON.parse(JSON.stringify(this.parameters))
      })
    },
    search() {
      this.queryForm.PageIndex = 1
      this.parameters = {
        ...this.queryForm
      }
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    advancedSearch() {
      this.queryForm.isSenior = true
      this.search()
    },
    reset() {
      this.$refs['search'].resetFields()
      this.search()
    },
    currentChange(val) {
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.initRoute()
    },

    createTimeChange(value) {
      if (value) {
        this.queryForm.CreateTime1 = value[0]
        this.queryForm.CreateTime2 = value[1]
      } else {
        this.queryForm.CreateTime1 = ''
        this.queryForm.CreateTime2 = ''
      }
    },
    showDetail(id) {
      this.dialogDetailVisible = true
      this.qualityImgLoading = true
      MARKETING_API_ORDER_QUALITY_GET({
        OrderId: id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data.TemplateUrl != '') {
            this.templateUrl =
              this.$root.settings.DOMAIN_IMG_FILE + res.data.Data.TemplateUrl + '?time=' + Date.now()
            let newImg = new Image()
            newImg.src = this.templateUrl
            newImg.onload = () => {
              this.qualityImgLoading = false
            }
          } else {
            this.qualityImgLoading = false
          }
        }
      })
    },
    qualityPrint(id) {
      this.paidId = id
      this.printDialog = true
    },
    formatter(row, column) {
      switch (column.property) {
        case 'OriginPrice':
          return `￥${this.$root.toFloat(row[column.property])}`
        case 'SalePrice':
          return `￥${this.$root.toFloat(row[column.property])}`
        case 'OrderTime':
          return this.$options.filters.filterDateMinutes(row[column.property])
        case 'CreateTime':
          return this.$options.filters.filterDateMinutes(row[column.property])
        case 'Status':
          return QualityOrderStatus.Types[row[column.property]]
        default:
          break
      }
    },
    qualityListExport() {
      MARKETING_API_ORDER_QUALITY_QUALITYLISTEXPORT(this.queryForm).then(res => {
        if (res.data.Code == 'CORRECT') {
          location.href = res.data.Data.FilePath
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.quality {
  width: 100%;
}
.print-model {
  .el-radio {
    line-height: 28px;
  }
}
</style>

