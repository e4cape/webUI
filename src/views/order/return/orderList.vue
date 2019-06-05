
<template  >
  <div class="content">
    <el-form :model="form" ref="search" lable-width="120px" @keyup.enter.native="advancedSearch" class="item-lh-26" :inline="true">
      <search-panel @onSearch="advancedSearch" @onReset="reset">
        <template slot="btnBox">
          <el-form-item>
            <el-button type="default" @click="exportList" :loading="loadingExport" name="btn-export">导出Excel</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select v-model="form.State" @change="search" name="State">
              <el-option label="所有状态" :value="0"></el-option>
              <el-option v-for="item in StateOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ReturnCode">
            <el-input v-model="form.ReturnCode" @click="search" placeholder="请输入退货单号" name="ReturnCode">
              <el-button slot="append" icon="el-icon-search" name="btn-search" @click="search"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <!--  公共搜索项  -->
          <template>
            <el-form-item label="销售日期：" prop="CreateTimeRange">
              <el-date-picker
                v-model="form.CreateTimeRange"
                @change="dateChange"
                type="daterange"
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                name="CreateTimeRange"
              ></el-date-picker>
            </el-form-item>
            <el-form-item prop="CreateTime1" v-show="false">
              <el-input v-model="form.CreateTime1" name="CreateTime1"></el-input>
            </el-form-item>
            <el-form-item prop="CreateTime2" v-show="false">
              <el-input v-model="form.CreateTime2" name="CreateTime2"></el-input>
            </el-form-item>
            <el-form-item label="退货单号：" prop="ReturnCode">
              <el-input v-model="form.ReturnCode" name="ReturnCode"></el-input>
            </el-form-item>
            <el-form-item label="消费单号：" prop="SellCode">
              <el-input v-model="form.SellCode" name="SellCode"></el-input>
            </el-form-item>
          </template>
          <!--  门店总部搜索项  -->
          <template v-if="characterType==CharacterType.Company||characterType==CharacterType.Store">
            <el-form-item label="条码：" prop="StoreBarCode">
              <el-input v-model="form.StoreBarCode" name="StoreBarCode"></el-input>
            </el-form-item>
            <el-form-item label="商品名称：" prop="GoodsName">
              <el-input v-model="form.GoodsName" name="GoodsName"></el-input>
            </el-form-item>
            <el-form-item label="商品来源：" prop="PSourceType">
              <el-select v-model="form.PSourceType" name="PSourceType">
                <el-option label="全部" :value="0"></el-option>
                <el-option v-for="item in sellOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <template v-if="characterType==CharacterType.Company">
            <el-form-item label="退货单来源：" prop="SourceType">
              <el-select v-model="form.SourceType" name="SourceType">
                <el-option label="全部" :value="0"></el-option>
                <el-option v-for="item in returnOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <!--  平台搜索项  -->
          <template v-if="characterType==CharacterType.Lingcb">
            <el-form-item prop="CompanyCode" label="公司编码">
              <el-input v-model="form.CompanyCode" name="CompanyCode"></el-input>
            </el-form-item>
            <el-form-item prop="CompanyName" label="公司名称">
              <el-input v-model="form.CompanyName" name="CompanyName"></el-input>
            </el-form-item>
          </template>
          <template v-if="characterType==CharacterType.Company||characterType==CharacterType.Lingcb">
            <el-form-item prop="StoreCode" label="门店编号">
              <el-input v-model="form.StoreCode" name="StoreCode"></el-input>
            </el-form-item>
            <el-form-item prop="StoreName" label="门店名称">
              <el-input v-model="form.StoreName" name="StoreName"></el-input>
            </el-form-item>
          </template>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" v-loading="isLoading">
      <el-table-column :formatter="formatter" prop="CreateTime" label="日期" show-overflow-tooltip></el-table-column>
      <el-table-column width="160" prop="ReturnCode" label="退货单号" show-overflow-tooltip></el-table-column>
      <el-table-column width="160" prop="SellCode" label="消费单号" show-overflow-tooltip></el-table-column>
      <template v-if="characterType == CharacterType.Lingcb">
        <el-table-column prop="CompanyCode" label="公司编码" show-overflow-tooltip></el-table-column>
        <el-table-column prop="CompanyName" label="公司名称" show-overflow-tooltip></el-table-column>
      </template>
      <template v-if="characterType == CharacterType.Lingcb || characterType == CharacterType.Company">
        <el-table-column prop="StoreCode" label="门店编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="StoreName" label="门店名称" show-overflow-tooltip></el-table-column>
      </template>
      <el-table-column prop="StoreBarCode" label="条码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoodsName" label="商品名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ProductPrice" label="商品售价" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CashPrice" label="实付金额" :formatter="formatter" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" prop="AwaitPrice" label="应退金额" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" prop="ReturnPrice" label="实退金额" show-overflow-tooltip></el-table-column>
      <el-table-column :formatter="formatter" prop="State" label="状态" show-overflow-tooltip></el-table-column>
      <template v-if="characterType == CharacterType.Company||characterType == CharacterType.Store">
        <el-table-column :formatter="formatter" label="退货单来源" prop="SourceType" show-overflow-tooltip></el-table-column>
        <el-table-column :formatter="formatter" label="商品来源" prop="PSourceType" show-overflow-tooltip></el-table-column>
      </template>
      <el-table-column label="操作">
        <template slot-scope="scoped">
          <el-button type="text" @click="$router.push({path:'/order/return/orderdetail',query:{ReturnCode:scoped.row.ReturnCode,SellCode:scoped.row.SellCode}})" name="btn-detail">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>
<script>
import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
import {
  RetailOrderReturnState,
  RetailOrderReturnSourceType,
  RetailOrderSellProductSourceType
} from '@/enums/order.js'
import { CharacterType } from '@/enums/common'
import {
  ORDER_API_RETAIL_ORDER_RETURN_GETS,
  ORDER_API_RETAIL_ORDER_RETURN_RETURNEXPORT
} from '@/apis/order'
export default {
  components: {
    pagination,
    searchPanel
  },
  data() {
    return {
      CharacterType,
      form: {
        isSenior: false,
        CreateTimeRange: [],
        CreateTime1: '',
        CreateTime2: '',
        ReturnCode: '',
        SellCode: '',
        State: 0,
        StoreBarCode: '',
        GoodsName: '',
        SourceType: 0,
        PSourceType: 0,
        CharacterId: 0,
        CompanyCode: '',
        CompanyName: '',
        StoreCode: '',
        StoreName: '',
        OrderBy: 0,
        IsAsced: 1,
        PageSize: 20,
        PageIndex: 1
      },
      parameter: {
      },
      total: 0,
      StateOpt: [],
      returnOpt: [],
      sellOpt: [],
      tableData: [],
      isLoading: false,
      loadingExport: false
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    },
    wechatSettingType() {
      return this.$store.getters.wechatSettingType
    }
  },
  created() {
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  methods: {
    exportList() {
      this.loadingExport = true
      ORDER_API_RETAIL_ORDER_RETURN_RETURNEXPORT(this.parameter).then(res => {
        this.loadingExport = false
        if (res.data.Code === 'CORRECT') {
          location.href = res.data.Data.FilePath
        }
      })
    },
    getData() {
      this.isLoading = true
      ORDER_API_RETAIL_ORDER_RETURN_GETS(this.parameter).then(res => {
        this.isLoading = false
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
      })
    },
    init() {
      let query = this.$route.query
      this.form.isSenior = query.isSenior === 'true' ? true : false
      this.form.CreateTime1 = query.CreateTime1 || ''
      this.form.CreateTime2 = query.CreateTime2 || ''
      this.form.CreateTimeRange = query.CreateTimeRange || []
      this.form.ReturnCode = query.ReturnCode || ''
      this.form.SellCode = query.SellCode || ''
      this.form.State = parseInt(query.State) || 0
      this.form.StoreBarCode = query.StoreBarCode || ''
      this.form.SourceType = parseInt(query.SourceType) || 0
      this.form.PSourceType = parseInt(query.PSourceType) || 0
      this.form.CharacterId = parseInt(query.CharacterId) || 0
      this.form.CompanyCode = query.CompanyCode || ''
      this.form.CompanyName = query.CompanyName || ''
      this.form.StoreCode = query.StoreCode || ''
      this.form.StoreName = query.StoreName || ''
      this.form.OrderBy = query.OrderBy || 0
      this.form.IsAsced = query.IsAsced || 1
      this.form.PageIndex = query.PageIndex || 1
      this.form.PageSize = query.PageSize || 20
      this.parameter = {
        ...this.form
      }
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: '/order/return/index',
        query: this.parameter
      })
    },
    search() {
      this.form.PageIndex = 1
      this.parameter = {
        ...this.form
      }
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    advancedSearch() {
      this.form.isSenior = true
      this.search()
    },
    reset() {
      this.$refs['search'].resetFields()
      this.search()
    },
    currentChange(val) {
      this.parameter.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      this.parameter.PageIndex = 1
      this.parameter.PageSize = val
      this.initRoute()
    },
    dateChange(value) {
      if (value && value.length > 0) {
        this.form.CreateTime1 = value[0]
        this.form.CreateTime2 = value[1]
      } else {
        this.form.CreateTime1 = ''
        this.form.CreateTime2 = ''
      }
    },
    getEnums() {
      // 退货单状态
      for (let item in RetailOrderReturnState.Types) {
        this.StateOpt.push({
          label: RetailOrderReturnState.Types[item],
          value: parseInt(item)
        })
      }
      // 退货单来源
      for (let item in RetailOrderReturnSourceType.Types) {
        this.returnOpt.push({
          label: RetailOrderReturnSourceType.Types[item],
          value: parseInt(item)
        })
      }
      // 商品来源
      for (let item in RetailOrderSellProductSourceType.Types) {
        this.sellOpt.push({
          label: RetailOrderSellProductSourceType.Types[item],
          value: parseInt(item)
        })
      }
      // 门店下拉列表
      this.$store.dispatch('GET_STORES_DROPLIST')
    },
    formatter() {
      let tpr
      switch (arguments[1].property) {
        case 'State':
          tpr = RetailOrderReturnState.Types[arguments[2]]
          break
        case 'CreateTime':
          tpr = this.$options.filters.filterDateMinutes(arguments[2])
          break
        case 'SourceType':
          tpr = RetailOrderReturnSourceType.Types[arguments[2]]
          break
        case 'PSourceType':
          tpr = RetailOrderSellProductSourceType.Types[arguments[2]]
          break
        case 'AwaitPrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'ReturnPrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'CashPrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        case 'ProductPrice':
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
        default:
          tpr = parseFloat(arguments[2]).toFixed(2)
          break
      }
      return tpr
    }
  }
}
</script>