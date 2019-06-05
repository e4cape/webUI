
<template  >
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button type="primary" v-if="characterType!=CharacterType.Company" @click="materialDialog = true" name="btn-create">新建</el-button>
          <el-dropdown class="multi-operation" @command="downLoad">
            <el-button name="btn-export">
              导出
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="loadData">导出查询结果</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select v-model="queryForm.State" placeholder="所有状态" name="State">
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="(item,index) in retailOrderReturnStates.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ReturnCode">
            <el-input v-model="queryForm.ReturnCode" placeholder="单据编号" @keyup.enter.native="onSearch" name="ReturnCode">
              <el-button slot="append" name="btn-search" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="来源：" prop="SourceType">
            <el-select v-model="queryForm.SourceType" placeholder="所有来源" :filterable="true" name="SourceType">
              <el-option label="所有来源" value="0"></el-option>
              <el-option v-for="(item,index) in retailOrderReturnSourceTypes.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单据编号：" prop="ReturnCode">
            <el-input v-model="queryForm.ReturnCode" :maxlength="50" @keyup.enter.native="onSearch" name="ReturnCode"></el-input>
          </el-form-item>
          <el-form-item label="原销售单：" prop="MasterCode">
            <el-input v-model="queryForm.MasterCode" :maxlength="50" @keyup.enter.native="onSearch" name="MasterCode"></el-input>
          </el-form-item>
          <el-form-item label="原消费单：" prop="SellCode">
            <el-input v-model="queryForm.SellCode" :maxlength="50" @keyup.enter.native="onSearch" name="SellCode"></el-input>
          </el-form-item>
          <el-form-item label="会员ID：" prop="MemberId">
            <el-input v-model="queryForm.MemberId" :maxlength="50" @keyup.enter.native="onSearch" name="MemberId"></el-input>
          </el-form-item>
          <el-form-item label="会员手机：" prop="Mobile">
            <el-input v-model="queryForm.Mobile" :maxlength="11" @keyup.enter.native="onSearch" name="Mobile"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：" prop="CreateTime">
            <el-date-picker v-model="queryForm.CreateTime" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" name="CreateTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
          <el-form-item label="货品条码：" prop="StoreBarCode">
            <el-input v-model="queryForm.StoreBarCode" :maxlength="50" @keyup.enter.native="onSearch" name="StoreBarCode"></el-input>
          </el-form-item>
          <el-form-item label="货品名称：" prop="GoodsName">
            <el-input v-model="queryForm.GoodsName" :maxlength="50" @keyup.enter.native="onSearch" name="GoodsName"></el-input>
          </el-form-item>
          <el-form-item label="退货时间：" prop="CheckTime">
            <el-date-picker v-model="queryForm.CheckTime" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" name="CheckTime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!--  @module 数据表格  -->
    <el-table :data="tableData" @sort-change="sortChange" @selection-change="selectionChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column type="selection" fixed></el-table-column>
      <el-table-column prop="ReturnCode" label="单据编号" min-width="160" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="CheckTime" label="退货时间" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.CheckTime | filterDateMinutes }}</template>
      </el-table-column>
      <el-table-column prop="StoreName" label="销售单位" v-if="characterType==CharacterType.Company" show-overflow-tooltip></el-table-column>
      <el-table-column prop="SourceType" label="来源" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{retailOrderReturnSourceTypes.Types[scope.row.SourceType]}}</template>
      </el-table-column>
      <el-table-column prop="MasterCode" label="原销售单" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="SellCode" label="原消费单" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="MemberId" label="会员ID" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ProductNO" label="货品条码" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ProductTitle" label="货品名称" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ProductPrice" label="商品售价" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.ProductPrice)}}</template>
      </el-table-column>
      <el-table-column prop="CashPrice" label="实付金额" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.CashPrice)}}</template>
      </el-table-column>
      <el-table-column prop="AwaitPrice" label="应退金额" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.AwaitPrice)}}</template>
      </el-table-column>
      <el-table-column prop="ReturnPrice" label="实退金额" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">￥{{$root.toFloat(scope.row.ReturnPrice)}}</template>
      </el-table-column>
      <el-table-column prop="State" label="状态" min-width="80" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <span :class="scope.row.State | findKey(retailOrderReturnStates)">{{retailOrderReturnStates.Types[scope.row.State]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="180" fixed="right">
        <template slot-scope="scope">
          <router-link class="btn-link el-button el-button--text" :to="{path:'/sales/material/materialCheck',query:{code:scope.row.ReturnCode,storeName:scope.row.StoreName,State:scope.row.State}}">查看</router-link>
          <span style="padding-left:10px" v-if="characterType == CharacterType.Store">
            <el-button v-if="scope.row.State === retailOrderReturnStates.Wait" type="text" @click="materialAudit(scope.row)" name="btn-check">审核</el-button>
            <el-button v-if="scope.row.State !== retailOrderReturnStates.Abandon && scope.row.State < retailOrderReturnStates.Audit" type="text" @click="materialAbandon(scope.row)" name="btn-abandon">作废</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!--  module 新建  -->
    <materialCreate v-if="materialDialog" :materialDialog="materialDialog" @listenmaterialDialog="listenmaterialDialog"></materialCreate>
    <!--  End 新建  -->
    <!--  @module Dialog·审核  -->
    <material-audit title="审核" v-if="auditDialog" :auditDialog="auditDialog" :data="selections" @listenAuditDialog="listenAuditDialog"></material-audit>
    <!--  End Dialog·审核  -->
    <!--  @module Dialog·作废  -->
    <material-abandon title="作废" v-if="abandonDialog" :abandonDialog="abandonDialog" :data="selections" @listenAbandonDialog="listenAbandonDialog"></material-abandon>
    <!--  End Dialog·作废  -->
  </div>
</template>
<script>
import {
  RetailOrderReturnState,
  RetailOrderReturnSourceType
} from '@/enums/order.js'
import { YNStatus, CharacterType } from '@/enums/common.js'
import {
  ORDER_API_RETAIL_ORDER_RETURN_GETS,
  ORDER_API_RETAIL_ORDER_RETURN_RETURNERPEXPORT
} from '@/apis/order.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import materialCreate from './materialCreate'
import materialAudit from './materialAudit'
import materialAbandon from './materialAbandon'

export default {
  data() {
    return {
      YNStatus,
      CharacterType,
      retailOrderReturnSourceTypes: RetailOrderReturnSourceType,
      retailOrderReturnStates: RetailOrderReturnState,
      queryForm: {
        // 查询表单数据
        SourceType: '', // 退货单来源
        ReturnCode: '', // 单据编号
        MasterCode: '', // 原销售单
        SellCode: '', // 原消费单
        Mobile: '', // 会员手机
        MemberId: '',
        StoreBarCode: '', // 货品条码
        GoodsName: '', // 货品名称
        CreateTime1: '',
        CreateTime2: '',
        CheckTime1: '',
        CheckTime2: '',
        CreateTime: [],
        CheckTime: [],
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      tableData: [],
      total: 0,
      isAsc: YNStatus.No,
      beforeCreateDialog: false,
      rules: {
        supplier: {
          required: true,
          message: '请选择',
          trigger: 'change'
        },
        buyer: {
          required: true,
          message: '请选择',
          trigger: 'change'
        },
        warehouseStore: {
          required: true,
          message: '请选择',
          trigger: 'change'
        }
      },
      selections: [],
      parameters: {},
      materialDialog: false,
      auditDialog: false,
      abandonDialog: false
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            SourceType: '', // 退货单来源
            ReturnCode: '', // 单据编号
            MasterCode: '', // 原销售单
            SellCode: '', // 原消费单
            MemberId: '', // 会员ID
            Mobile: '', // 会员手机
            StoreBarCode: '', // 货品条码
            GoodsName: '', // 货品名称
            CreateTime1: '',
            CreateTime2: '',
            CheckTime1: '',
            CheckTime2: '',
            CreateTime: [],
            CheckTime: [],
            OrderBy: 0,
            IsAsced: YNStatus.No,
            PageIndex: 1,
            PageSize: 20
          }
      this.parameters = Object.assign({}, query)
      this.parameters.CreateTime = query.CreateTime || []
      this.parameters.CheckTime = query.CheckTime || []
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let createTime = this.parameters.CreateTime.length
        ? this.parameters.CreateTime
        : ['', '']
      let checkTime = this.parameters.CheckTime.length
        ? this.parameters.CheckTime
        : ['', '']
      let param = {
        CreateTime1: createTime[0],
        CreateTime2: createTime[1],
        CheckTime1: checkTime[0],
        CheckTime2: checkTime[1]
      }
      console.log(
        'this.queryForm',
        this.queryForm,
        'this.parameters',
        this.parameters,
        'param',
        param
      )
      this.queryForm = Object.assign(this.queryForm, this.parameters, param)
      ORDER_API_RETAIL_ORDER_RETURN_GETS(this.queryForm)
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.tableData = res.data.Data.Rows || []
            this.total = res.data.Data.Count || 0
          }
          this.$store.commit('SET_TB_LOADING', false) // table loading
        })
        .catch(() => {
          this.$store.commit('SET_TB_LOADING', false) // table loading
        })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'PreviousId':
          this.queryForm.OrderBy = 1
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsc =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.onSearch()
    },
    selectionChange(selection) {
      this.selections = selection
    },
    // 新建 start
    listenmaterialDialog(type, success) {
      this[type] = false
      if (success) {
        this.onSearch()
      }
    },
    listenAuditDialog(success) {
      this.selections = []
      if (success) {
        this.getData()
      }
      this.auditDialog = false
    },
    junkInnAbandon(row) {
      this.abandonDialog = true
      this.abandonJunkInn = row
    },
    listenAbandonDialog(success) {
      if (success) {
        this.getData()
      }
      this.abandonDialog = false
    },
    materialAbandon(row) {
      this.selections = row
      this.abandonDialog = true
    },
    materialAudit(row) {
      this.selections = row
      this.auditDialog = true
    },
    downLoad(command) {
      // selectData   loadData
      this.$store.commit('SET_FULL_LOADING', true)
      if (command === 'loadData') {
        this.downLoadData()
      }
    },
    downLoadData() {
      let apiName = ORDER_API_RETAIL_ORDER_RETURN_RETURNERPEXPORT
      // if (this.total > 10000) {
      //   apiName = 'API_STOCK_QUEUERESULT'
      // }
      let createTime = this.queryForm.CreateTime || ['', '']
      let checkTime = this.queryForm.CheckTime || ['', '']
      let param = {
        CreateTime1: createTime[0],
        CreateTime2: createTime[1],
        CheckTime1: checkTime[0],
        CheckTime2: checkTime[1]
      }
      apiName(Object.assign(this.queryForm, this.parameters, param)).then(
        res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            if (this.total > 10000) {
              this.$confirm(
                '数据量较大，导出任务在后台执行，请稍后到“我的下载”去下载',
                '提示',
                {
                  confirmButtonText: '关闭',
                  showCancelButton: false,
                  type: 'warning'
                }
              )
              return false
            }
            setTimeout(() => {
              window.open(
                res.data.Data.FilePath
              )
            }, 1000)
          } else {
            this.$message.error(res.data.Message)
          }
        }
      )
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
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init',
    'queryForm.State': 'onSearch'
  },
  computed: {
    characterType() {
      console.log('121121', this.$store.getters.user_session.CharacterType)
      return this.$store.getters.user_session.CharacterType
    }
  },
  components: {
    searchPanel,
    pagination,
    materialCreate,
    materialAudit,
    materialAbandon
  }
}
</script>