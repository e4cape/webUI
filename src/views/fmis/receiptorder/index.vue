<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" name="btnReceiptOrderForm" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel name="btnReceoptOrderSearch" @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-dropdown name="btnReceiptOrderBatch" @command="multiOperation" v-if="data.length">
            <el-button type="primary" name="btnBatchOperating">
              批量操作
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="audit">批量确认</el-dropdown-item>
              <el-dropdown-item command="abandon">批量作废</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-select name="State" v-model="queryForm.State" placeholder="所有状态" @change="onSearch">
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="(item,index) in settleIOBillPaidStates.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="PaidCode">
            <el-input name="PaidCode" v-model="queryForm.PaidCode" placeholder="单据编号" @keyup.enter.native="onSearch">
              <el-button slot="append" icon="el-icon-search" name="btnOnSearch" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="ObjectType" label="所有对象：">
            <el-select name="objectType" v-model="queryForm.ObjectType" placeholder="所有对象">
              <el-option label="所有对象" value="0"></el-option>
              <el-option v-for="(item,index) in settleIOBillBasicObjectTypes.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="PaidCode" label="单据编号：">
            <el-input name="PaidCode" v-model="queryForm.PaidCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item prop="ObjectNote" label="收款对象：">
            <el-input name="ObjectNote" v-model="queryForm.ObjectNote" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item prop="CreateTime" label="创建时间：">
            <el-date-picker v-model="queryForm.CreateTime" :unlink-panels="true" type="daterange"></el-date-picker>
          </el-form-item>
          <el-form-item prop="BillCode" label="来源单号：">
            <el-input name="BillCode" v-model="queryForm.BillCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item prop="BankTypeDk" label="收款账户：">
            <el-select name="BankTypeDk" v-model="queryForm.BankTypeDk" placeholder="全部" :filterable="true">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in surnames" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="PaymentTypeEk" label="收款方式：">
            <el-select name="PaymentTypeEk" v-model="queryForm.PaymentTypeEk" placeholder="全部" :filterable="true">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in payments" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- @module 数据表格 -->
    <el-table :data="data" @sort-change="sortChange" @selection-change="selectionChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column type="selection" fixed></el-table-column>
      <el-table-column prop="PaidCode" label="单据编号" min-width="160" sortable="custom" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="ObjectNote" label="收款对象" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ObjectType" label="对象类型" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{settleIOBillBasicObjectTypes.Types[scope.row.ObjectType]}}</template>
      </el-table-column>
      <el-table-column prop="BillCode" label="来源单号" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <router-link class="text-blue" name="btnLinkPreviousType" :to="{path: '/fmis/receipt/receiptCheck', query: {id: scope.row.BillId}}">{{scope.row.BillCode}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="PaidPrice" label="收款金额" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.PaidPrice | initPrice}}</template>
      </el-table-column>
      <el-table-column prop="BankTypeDv" label="收款账户" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="PaymentTypeEk" label="收款方式" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{paymentsObj[scope.row.PaymentTypeEk]}}</template>
      </el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" min-width="100" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.CreateTime | filterDateTime }}</template>
      </el-table-column>
      <el-table-column prop="State" label="状态" min-width="100" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <span :class="{'red':scope.row.State === settleIOBillPaidStates.Abandon}">{{settleIOBillPaidStates.Types[scope.row.State]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" name="btnReceiptOrderCheck" @click="$router.push({path: '/fmis/receiptorder/receiptorderCheck', query: {id: scope.row.PaidId}})">查看</el-button>
          <el-button type="text" name="btnPaidAudit" v-if="scope.row.State == settleIOBillPaidStates.Wait" @click="paidAudit(scope.row)">确认</el-button>
          <el-button type="text" name="btnPaidAbandon" v-if="scope.row.State == settleIOBillPaidStates.Wait" @click="paidAbandon(scope.row)">作废</el-button>
          <el-button type="text" name="btnPaidCancel" v-if="scope.row.State == settleIOBillPaidStates.Audit" @click="paidCancel(scope.row)">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>

<script>
import { YNStatus, EnableState } from '@/enums/common'
import { MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST } from '@/apis/merchant'
import {
  SettingDictionaryDictType,
  SettleIOBillPaidState,
  SettleIOBillPaidType,
  SettleIOBillBasicObjectType
} from '@/enums/stocking'
import {
  STOCKING_API_SETTLE_IO_BILL_PAID_GETS,
  STOCKING_API_SETTLE_IO_BILL_PAID_AUDITS,
  STOCKING_API_SETTLE_IO_BILL_PAID_ABANDONS,
  STOCKING_API_SETTLE_IO_BILL_PAID_CANCEL
} from '@/apis/stocking'
import dayjs from 'dayjs'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
export default {
  data() {
    return {
      settleIOBillPaidStates: SettleIOBillPaidState,
      settleIOBillBasicObjectTypes: SettleIOBillBasicObjectType,
      queryForm: {
        // 查询表单数据
        PaidType: SettleIOBillPaidType.Receipt,
        ObjectType: '0',
        State: '0',
        OrderBy: 1,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20,
        PaidCode: '',
        BillCode: '',
        BankTypeDk: '0',
        PaymentTypeEk: '0',
        CreateTime: [],
        CreateTime1: '',
        CreateTime2: ''
      },
      selections: [],
      data: [],
      total: 0,
      parameters: {},
      surnames: [], // 收款账户
      paymentsObj: {},
      payments: [] // 支收方式
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            PaidType: SettleIOBillPaidType.Receipt,
            ObjectType: '0',
            State: '0',
            OrderBy: 1,
            IsAsced: YNStatus.No,
            PageIndex: 1,
            PageSize: 20,
            PaidCode: '',
            BillCode: '',
            BankTypeDk: '0',
            PaymentTypeEk: '0',
            CreateTime: [],
            CreateTime1: '',
            CreateTime2: ''
          }
      this.parameters = Object.assign({}, query)
      this.parameters.CreateTime = query.CreateTime || []
      this.getData()
    },
    getData() {
      let createTime = this.parameters.CreateTime.length
        ? this.parameters.CreateTime
        : ['1900-01-01 0:00:00', '1900-01-01 0:00:00']
      let param = {
        CreateTime1: createTime[0]
          ? dayjs(createTime[0]).format('YYYY-MM-DD')
          : dayjs('1900-1-1').format('YYYY-MM-DD'),
        CreateTime2: createTime[1]
          ? dayjs(createTime[1]).format('YYYY-MM-DD')
          : dayjs('1900-1-1').format('YYYY-MM-DD')
      }
      this.queryForm = Object.assign(this.queryForm, this.parameters, param)
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_SETTLE_IO_BILL_PAID_GETS(this.queryForm).then(res => {
        this.$store.commit('SET_TB_LOADING', false) // table loading
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'PaidCode':
          this.queryForm.OrderBy = 0
          break
        case 'CreateTime':
          this.queryForm.OrderBy = 1
          break
        default:
          this.queryForm.OrderBy = 1
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    selectionChange(selection) {
      this.selections = selection
    },
    getSurnames() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: SettingDictionaryDictType.SettleIOBillPaidBankType,
        State: EnableState.Enable
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.surnames = res.data.Data.Rows
        }
      })
    },
    getPayments() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: SettingDictionaryDictType.SettleIOBillPaidPaymentType,
        State: EnableState.Enable
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.payments = res.data.Data.Rows
          let paymentsObj = {}
          res.data.Data.Rows.forEach(item => {
            paymentsObj[item.Id] = item.Value
          })
          this.paymentsObj = paymentsObj
        }
      })
    },
    paidAudit(row) {
      this.selections = [row]
      this.auditPaid()
    },
    auditPaid() {
      this.$confirm('确定确认所选收款单', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let paidIds = []
          this.selections.forEach(item => {
            paidIds.push(item.PaidId)
          })
          STOCKING_API_SETTLE_IO_BILL_PAID_AUDITS({
            Items: paidIds
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('提交成功')
              this.getData()
              this.selections = []
            }
          })
        })
        .catch(() => {
          this.selections = []
        })
    },
    paidAbandon(row) {
      this.selections = [row]
      this.abandonPaid()
    },
    abandonPaid() {
      this.$confirm('确定作废所选收款单', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let paidIds = []
          this.selections.forEach(item => {
            paidIds.push(item.PaidId)
          })
          STOCKING_API_SETTLE_IO_BILL_PAID_ABANDONS({
            Items: paidIds
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('提交成功')
              this.getData()
              this.selections = []
            }
          })
        })
        .catch(() => {
          this.selections = []
        })
    },
    multiOperation(type) {
      if (!this.selections.length) {
        this.$message.warning('请选择待确认的收款单')
      } else if (
        this.selections.filter(
          item => item.State !== this.settleIOBillPaidStates.Wait
        ).length > 0
      ) {
        this.$message.error('请选择待确认的收款单')
      } else {
        if (type === 'audit') {
          this.auditPaid()
        } else {
          this.abandonPaid()
        }
      }
    },
    paidCancel(row) {
      this.$confirm('确定取消所选收款单', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          STOCKING_API_SETTLE_IO_BILL_PAID_CANCEL({
            PaidId: row.PaidId
          }).then(res => {
            this.$store.commit('SET_FULL_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message.success('取消成功')
              this.getData()
            }
          })
        })
        .catch(() => { })
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
        query: JSON.parse(JSON.stringify(this.parameters))
      })
    }
  },
  beforeMount() {
    this.$store.dispatch('GET_SUPPLIERS_DROPLIST')
    this.getPayments()
    this.getSurnames()
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    searchPanel,
    pagination
  }
}
</script>
