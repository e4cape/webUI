<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" @keyup.enter.native="onSearch" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset" :isSenior="true">
        <template slot="btnBox">
          <el-button type="primary" @click="toCreate" name="btnCreate">新建</el-button>
          <el-dropdown class="multi-operation" @command="downLoad" v-if="repairData.length" name="btnMultiAudit">
            <el-button>
              导出
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="loadAll">导出查询结果</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-select v-model="queryForm.StepState" placeholder="所有状态" name="StepState">
              <el-option label="所有状态" value="0"></el-option>
              <template v-for="(item,index) in GoodsRepairOrderBasicStepState.Types">
                <el-option :key="index" :label="item" :value="String(index)" v-if="parseInt(index) !== GoodsRepairOrderBasicStepState.Abandon"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="RepairCode">
            <el-input v-model="queryForm.RepairCode" :maxlength="50" placeholder="单据编号" name="RepairCode">
              <el-button slot="append" icon="el-icon-search" @click=" onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="PlaceType" label="所有地点：">
            <el-select v-model="queryForm.PlaceType" filterable placeholder="所有地点" name="PlaceType">
              <el-option label="所有地点" value="0"></el-option>
              <el-option v-for="(item, index) in GoodsRepairOrderBasicPlaceType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="RepairTypeDks" label="所有项目：">
            <el-select v-model="queryForm.RepairTypeDks" filterable name="RepairTypeDks">
              <el-option label="所有项目" value></el-option>
              <el-option v-for="(item, index) in returnReasons" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="RepairCode" label="单据编号：">
            <el-input v-model="queryForm.RepairCode" :maxlength="50" name="RepairCode"></el-input>
          </el-form-item>
          <el-form-item prop="SellCode" label="原销售单：">
            <el-input v-model="queryForm.SellCode" :maxlength="50" name="SellCode"></el-input>
          </el-form-item>
          <el-form-item prop="CreateTime" label="创建时间：" name="createTime">
            <el-date-picker v-model="queryForm.CreateTime" :unlink-panels="true" type="daterange" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
          <el-form-item prop="TrueName" label="顾客姓名：">
            <el-input :maxlength="20" v-model="queryForm.TrueName" name="TrueName"></el-input>
          </el-form-item>
          <el-form-item prop="Mobile" label="顾客手机：">
            <el-input :maxlength="20" v-model="queryForm.Mobile" name="Mobile"></el-input>
          </el-form-item>
          <el-form-item prop="MemberId" label="会员ID：">
            <el-input :maxlength="50" v-model="queryForm.MemberId" name="MemberId"></el-input>
          </el-form-item>
          <el-form-item prop="BarCode" label="货品条码：">
            <el-input :maxlength="20" v-model="queryForm.BarCode" name="BarCode"></el-input>
          </el-form-item>
          <el-form-item prop="GoodsName" label="货品名称：">
            <el-input :maxlength="20" v-model="queryForm.GoodsName" name="GoodsName"></el-input>
          </el-form-item>
          <el-form-item prop="PartnerId" label="供应商：">
            <el-select v-model="queryForm.PartnerId">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index ) in $store.getters.suppliers" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ShippingType" label="取货方式：">
            <el-select v-model="queryForm.ShippingType" filterable placeholder="全部" name="ShippingType">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in ShippingType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ReceiptUser" label="收货人姓名：">
            <el-input :maxlength="20" v-model="queryForm.ReceiptUser" name="ReceiptUser"></el-input>
          </el-form-item>
          <el-form-item prop="ReceiptPhone" label="收货人手机：">
            <el-input :maxlength="20" v-model="queryForm.ReceiptPhone" name="ReceiptPhone"></el-input>
          </el-form-item>
          <el-form-item prop="ExpressType" label="快递公司：">
            <el-select v-model="queryForm.ExpressType" filterable placeholder="全部" name="ExpressType">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in ExpressType.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ExpressCode" label="快递单号：">
            <el-input :maxlength="20" v-model="queryForm.ExpressCode" name="ExpressCode"></el-input>
          </el-form-item>
          <el-form-item prop="CheckTime" label="最后操作时间：" name="checkTime">
            <el-date-picker v-model="queryForm.CheckTime" :unlink-panels="true" type="daterange" value-format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- @module 数据表格 -->
    <el-table :data="repairData" @sort-change="sortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column type="selection" width="40" fixed></el-table-column>
      <el-table-column prop="RepairCode" label="单据编号" width="150" sortable="custom" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" :formatter="formatter" width="120" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="PlaceType" label="维修地点" :formatter="formatter" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="PrepairTypeDvs" label="维修项目" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="TrueName" label="顾客姓名" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Mobile" label="顾客手机" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoodsName" label="货品名称" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ShippingType" label="取货方式" :formatter="formatter" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="PrepairPrice" label="预估维修费" :formatter="formatter" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="RepairPrice" label="实际维修费" :formatter="formatter" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CheckTime" label="最后操作时间" :formatter="formatter" width="140" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="StepState" label="状态" :formatter="formatter" width="100" show-overflow-tooltip fixed="right"></el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="toCheck(scope.row)" name="btnToCheck">查看</el-button>
          <template v-if="scope.row.StepState === GoodsRepairOrderBasicStepState.Wait">
            <el-button type="text" size="small" @click="toEdit(scope.row)" name="btnToEdit">修改</el-button>
            <el-button type="text" size="small" @click="repairAbolish(scope.row)" name="btnRepairAbolish">删除</el-button>
            <el-button type="text" size="small" @click="toRepairChange(scope.row)" name="btnToRepairChange">维修处理</el-button>
          </template>
          <template v-else-if="scope.row.StepState === GoodsRepairOrderBasicStepState.Repairing">
            <el-button type="text" size="small" @click="toRepairChange(scope.row)" name="btnToPepairChange">完成维修</el-button>
            <el-button type="text" size="small" @click="repairRevoke(scope.row)" name="btnRepairRevoke">撤回维修处理</el-button>
          </template>
          <template v-else-if="scope.row.StepState === GoodsRepairOrderBasicStepState.Paid">
            <el-button type="text" size="small" @click="toRepairChange(scope.row)" name="btnToRepairChange">收款</el-button>
            <el-button type="text" size="small" @click="repairRevoke(scope.row)" name="btnRepairRevoke">撤回完成维修</el-button>
          </template>
          <template v-else-if="scope.row.StepState === GoodsRepairOrderBasicStepState.Return">
            <el-button type="text" size="small" @click="toRepairChange(scope.row)" name="btnToRepairChange">返还顾客</el-button>
            <el-button type="text" size="small" @click="repairRevoke(scope.row)" name="btnRepairRevoke4">撤回收款</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <!-- @module 分页组件 -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- End 分页组件 -->

    <!-- @module Dialog·步骤 -->
    <repairStage :visible.sync="stageDialog" :repairState="selections" @listenstageDialog="getData"></repairStage>
    <!-- @module Dialog·步骤 -->

    <!-- @module Dialog·删除 -->
    <repair-abandon :visible.sync="abandonDialog" :selections="selections" @listenAbandonDialog="$router.back()"></repair-abandon>
    <!-- End Dialog·删除 -->

    <!-- @module Dialog·撤回 -->
    <repair-revoke :visible.sync="revokeDialog" :selections="selections" @listenrevokeDialog="getData"></repair-revoke>
    <!-- End Dialog·撤回-->

    <!-- 导出 -->
    <base-export-field-setter @submit="downLoadData" title="导出" :visible.sync="ExportVisible" :items="exportColumns" :props="{key: 'FieldEnName', label: 'FieldCnName'}"/>
  </div>
</template>

<script>
import { YNStatus, ShippingType, ExpressType } from '@/enums/common.js'
import {
  GoodsRepairOrderBasicStepState,
  GoodsRepairOrderBasicPlaceType,
  SettingDictionaryDictType
} from '@/enums/stocking.js'
import {
  STOCKING_API_GOODS_REPAIR_ORDER_BASIC_GETS,
  STOCKING_API_GOODS_REPAIR_ORDER_BASIC_EXPORT
} from '@/apis/stocking.js'
import { MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST } from '@/apis/merchant.js'
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import repairStage from './repairStage.vue'
import repairAbandon from './repairAbandon.vue'
import repairRevoke from './repairRevoke.vue'
import baseExportFieldSetter from '@/components/baseExportFieldSetter'

export default {
  data() {
    return {
      YNStatus,
      ShippingType,
      ExpressType,
      GoodsRepairOrderBasicPlaceType,
      GoodsRepairOrderBasicStepState,
      SettingDictionaryDictType,
      returnReasons: [],
      selections: {},
      queryForm: {
        // 查询表单数据
        StepState: '0', // Int32 维修单状态(枚举)
        PlaceType: '0', // Int32 维修地点(枚举)
        RepairTypeDks: '',
        ShippingType: '0', // Int32 取货方式(枚举)
        ExpressType: '0', // Int32快递类型(枚举)
        PartnerId: '0',
        RepairCode: '', // String  维修单号
        SellCode: '', // String 销售单号(营销系统)
        TrueName: '', // String 会员姓名
        Mobile: '', // String 会员手机
        MemberId: '', // String 会员序号
        BarCode: '', // String 条码
        GoodsName: '', // String 货品名称
        SupplierName: '', // Int64 供应商序号
        ReceiptUser: '', // String 收货人
        ReceiptPhone: '', // String 收货人电话
        ExpressCode: '', // String 快递单号
        CreateTime1: '', // DateTime 创建时间1
        CreateTime2: '', // DateTime 创建时间2
        CheckTime1: '', // DateTime 最后操作时间1
        CheckTime2: '', // DateTime 最后操作时间2
        OrderBy: 1, // Int32 排序字段(, 0=单据编号，1=创建时间，2=最后操作时间)
        IsAsced: YNStatus.No, // Int32 是否升序(枚举)
        PageIndex: 1, // Int32/ 当前页码
        PageSize: 20, // Int32 每页?条
        CreateTime: [], // 创建时间
        CheckTime: [] // 最后操作时间
      },
      parameters: {},
      repairData: [],
      total: 0,
      // 弹出框
      abandonDialog: false,
      revokeDialog: false,
      stageDialog: false,
      ExportVisible: false,
      command: '',
      exportColumns: [
        {
          FieldEnName: 'RepairCode',
          FieldCnName: '单据编号'
        },
        {
          FieldEnName: 'CreateTime',
          FieldCnName: '创建时间'
        },
        {
          FieldEnName: 'PlaceTypeName',
          FieldCnName: '维修地点'
        },
        {
          FieldEnName: 'PrepairTypeDvs',
          FieldCnName: '维修项目'
        },
        {
          FieldEnName: 'TrueName',
          FieldCnName: '顾客姓名'
        },
        {
          FieldEnName: 'Mobile',
          FieldCnName: '顾客手机'
        },
        {
          FieldEnName: 'GoodsName',
          FieldCnName: '货品名称'
        },
        {
          FieldEnName: 'ShippingTypeName',
          FieldCnName: '取货方式'
        },
        {
          FieldEnName: 'PrepairPrice',
          FieldCnName: '预估维修费',
          Precision: 2,
        },
        {
          FieldEnName: 'RepairPrice',
          FieldCnName: '实收维修费',
          Precision: 2,
        },
        {
          FieldEnName: 'CheckTime',
          FieldCnName: '最后操作时间'
        },
        {
          FieldEnName: 'StepStateName',
          FieldCnName: '状态'
        }
      ]
    }
  },
  methods: {
    getEnums() {
      this.$store.dispatch('GET_SUPPLIERS_DROPLIST')
    },
    // 表格数据格式化
    formatter(row, column, val) {
      switch (column.property) {
        case 'CreateTime':
        case 'CheckTime':
          return this.$options.filters.filterDateMinutes(val)
        case 'PlaceType':
          return val === 0 ? '-' : GoodsRepairOrderBasicPlaceType.Types[val]
        case 'ShippingType':
          return ShippingType.Types[val]
        case 'StepState':
          return GoodsRepairOrderBasicStepState.Types[val]
        default:
          return '￥' + this.$root.toFloat(val)
      }
    },
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            StepState: '0', // Int32 维修单状态(枚举)
            PlaceType: '0', // Int32 维修地点(枚举)
            RepairTypeDks: '',
            ShippingType: '0', // Int32 取货方式(枚举)
            ExpressType: '0', // Int32快递类型(枚举)
            PartnerId: '0',
            RepairCode: '', // String  维修单号
            SellCode: '', // String 销售单号(营销系统)
            TrueName: '', // String 会员姓名
            Mobile: '', // String 会员手机
            MemberId: '', // String 会员序号
            BarCode: '', // String 条码
            GoodsName: '', // String 货品名称
            SupplierName: '', // Int64 供应商序号
            ReceiptUser: '', // String 收货人
            ReceiptPhone: '', // String 收货人电话
            ExpressCode: '', // String 快递单号
            CreateTime1: '', // DateTime 创建时间1
            CreateTime2: '', // DateTime 创建时间2
            CheckTime1: '', // DateTime 最后操作时间1
            CheckTime2: '', // DateTime 最后操作时间2
            OrderBy: 1, // Int32 排序字段(, 0=单据编号，1=创建时间，2=最后操作时间)
            IsAsced: YNStatus.No, // Int32 是否升序(枚举)
            PageIndex: 1, // Int32/ 当前页码
            PageSize: 20, // Int32 每页?条
            CreateTime: [], // 创建时间
            CheckTime: [] // 最后操作时间
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
        // 查询表单数据
        CreateTime1: createTime[0], // DateTime 创建时间1
        CreateTime2: createTime[1], // DateTime 创建时间2
        CheckTime1: checkTime[0], // DateTime 最后操作时间1
        CheckTime2: checkTime[1] // DateTime 最后操作时间2
      }

      this.queryForm = Object.assign(this.queryForm, this.parameters, param)
      STOCKING_API_GOODS_REPAIR_ORDER_BASIC_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          // .filter(item => item.StepState !== GoodsRepairOrderBasicStepState.Abandon)
          this.repairData = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'RepairCode':
          this.queryForm.OrderBy = 0
          break
        case 'CreateTime':
          this.queryForm.OrderBy = 1
          break
        default:
          this.queryForm.OrderBy = 2
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.onSearch()
    },
    getReturnReason() {
      // 获取原因
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: SettingDictionaryDictType.GoodsRepairOrderBasicPrepairType,
        State: YNStatus.Yes
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.returnReasons = res.data.Data.Rows
        }
      })
    },
    toCreate() {
      this.$router.push('/sales/repair/repairCreate')
    },
    toCheck(row) {
      this.$router.push({
        path: '/sales/repair/repairCheck',
        query: {
          id: row.RepairId
        }
      })
    },
    toEdit(row) {
      this.$router.push({
        path: '/sales/repair/repairCreate',
        query: {
          id: row.RepairId
        }
      })
    },
    repairAbolish(row) {
      // 删除
      this.selections = row
      this.abandonDialog = true
    },

    repairRevoke(row) {
      // 撤回
      this.selections = row
      this.revokeDialog = true
    },

    // changStart
    toRepairChange(row) {
      this.stageDialog = true
      this.selections = row
    },
    downLoad(command) {
      this.ExportVisible = true
      this.command = command
    },
    downLoadData(column) {
      // 导出全部
      let param = { ...this.parameters }
      param.ShippingType = parseInt(param.ShippingType) || 0
      param.ExpressType = parseInt(param.ExpressType) || 0
      param.PlaceType = parseInt(param.PlaceType) || 0
      param.StepState = parseInt(param.StepState) || 0
      param.PartnerId = parseInt(param.PartnerId) || 0
      param.OrderBy = parseInt(param.OrderBy) || 0
      param.IsAsced = parseInt(param.IsAsced) || 0
      param.ExportColumns = column
      if (this.command === 'loadAll') {
        param.PageIndex = 1
        param.PageSize = 0
      }
      this.$store.commit('SET_FULL_LOADING', true)
      STOCKING_API_GOODS_REPAIR_ORDER_BASIC_EXPORT(param).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          if (!res.data.Data) {
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
          window.open(this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data)
          this.ExportVisible = false
        }
        this.$store.commit('SET_FULL_LOADING', false)
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
    this.getEnums()
    this.init()
    this.getReturnReason()
  },
  watch: {
    $route: 'init',
    'queryForm.StepState': 'onSearch'
  },
  components: {
    searchPanel,
    pagination,
    repairAbandon,
    repairRevoke,
    repairStage,
    baseExportFieldSetter
  }
}
</script>
