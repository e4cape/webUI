<template>
  <div class="content">
    <div class="panel-tag">
      <span>查看结算单</span>
    </div>
    <el-form :model="settleDetail" label-position="right" lable-width="100px">
      <el-row class="total-panel">
        <el-col :span="8">
          <el-form-item label="单据编号：" prop="billCode">{{settleDetail.billCode}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建：" prop="createTime">{{settleDetail.createUser + settleDetail.createTime}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="审核：" prop="checkTime" v-if="settleDetail.status == financeMonthlyBillStatus.Pending">-</el-form-item>
          <el-form-item label="审核：" prop="checkTime" v-else>{{settleDetail.checkUser}}&nbsp;&nbsp;{{settleDetail.checkTime}}</el-form-item>
        </el-col>
        <el-col :span="8" v-if="$store.getters.user_session.CharacterType == characterType.Lingcb">
          <el-form-item label="礼品供应商：" prop="supplierName">{{settleDetail.supplierName}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结算账期：">{{settleDetail.btime | filterDate }}至{{ settleDetail.etime | filterDate }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="货品批发金额：" prop="price">{{settleDetail.wholesalePrice}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="平台提点比率：" prop="price">{{settleDetail.rateText}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="平台提点金额：" prop="price">{{settleDetail.ratePrice.toFixed(2)}}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结算金额：" prop="price">{{settleDetail.price.toFixed(2)}}</el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注：" prop="remark">{{settleDetail.remark}}</el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="panel-tag">
      <span>对账单</span>
    </div>
    <!-- @module 数据表格 -->
    <el-table :data="data" class="table" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" @sort-change="sortChange">
      <el-table-column prop="receiveTime" sortable="custom" label="收货时间" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="wholesalePrice" label="批发金额" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="orderCode" label="礼品订单" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <router-link name="btnLink" :to="{path:'/gift/giftOrder/orderCheck',query:{orderId:scope.row.orderId}}" class="btn-link el-button el-button--text">{{scope.row.orderCode}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="supplierCode" label="供应商编码" min-width="100" show-overflow-tooltip v-if="$store.getters.user_session.CharacterType == characterType.Lingcb"></el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" min-width="100" show-overflow-tooltip v-if="$store.getters.user_session.CharacterType == characterType.Lingcb"></el-table-column>
      <el-table-column prop="characterTypeM" label="商户类型" min-width="140" show-overflow-tooltip v-if="$store.getters.user_session.CharacterType == characterType.Lingcb">
        <template slot-scope="scope">
          {{scope.row.characterTypeM == characterType.Store ? '珠宝门店' : scope.row.characterTypeM == characterType.Company ? '珠宝公司' : ''}}
        </template>
      </el-table-column>
      <el-table-column prop="companyCode" label="公司编码" min-width="100" show-overflow-tooltip v-if="$store.getters.user_session.CharacterType == characterType.Lingcb"></el-table-column>
      <el-table-column prop="companyName" label="公司名称" min-width="100" show-overflow-tooltip v-if="$store.getters.user_session.CharacterType == characterType.Lingcb"></el-table-column>
      <el-table-column prop="storeCode" label="门店编码" min-width="100" show-overflow-tooltip v-if="$store.getters.user_session.CharacterType == characterType.Lingcb"></el-table-column>
      <el-table-column prop="storeName" label="门店名称" min-width="100" show-overflow-tooltip v-if="$store.getters.user_session.CharacterType == characterType.Lingcb"></el-table-column>
      <el-table-column prop="expressTypeText" label="快递公司 " min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="expressCode" label="快递单号" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="expressNote" label="发货备注" min-width="220" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <!-- 分页 -->
    <pagination :pg="queryForm.pageIndex" :size="queryForm.pageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- End 分页 -->
    <export-filed-setter title="导出" :visible.sync="exportVisible" :api="filedsApi" :apiKey="apiKey" @submit="exportData"></export-filed-setter>
    <el-row style="margin: 20px; text-align: left; border: 0;">
      <el-button name="btnExport" type="primary" @click="exportVisible=true" :loading="$store.getters.is_loading">导出</el-button>
    </el-row>
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import ExportFiledSetter from '@/components/exportFieldSetter'
import { CharacterType, YNStatus } from '@/enums/common'
import { FinanceMonthlyBillStatus } from '@/enums/gifting'
import {
  GIFTING_API_FINANCEMONTHLYBILL_GETFINANCEMONTHLYBILL,
  GIFTING_API_FINANCEMONTHLYBILL_GETFINANCEMONTHLYBILLDETAILS,
  GIFTING_API_STOREEXPORTER_GETEXPORTFIELDS,
  GIFTING_API_STOREEXPORTER_EXPORTTOFILE
} from '@/apis/gifting'
export default {
  data() {
    return {
      financeMonthlyBillStatus: FinanceMonthlyBillStatus,
      characterType: CharacterType,
      monthlyBillId: 0,
      data: [],
      total: 0,
      queryForm: {
        monthlyBillId: this.$route.query.monthlyBillId || 0,
        orderField: 'receiveTime',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 10
      },
      settleDetail: {
        ratePrice: '',
        price: '',
      },
      exportVisible: false,
      filedsApi: GIFTING_API_STOREEXPORTER_GETEXPORTFIELDS, // 查询数据的api名称
      apiKey: 'FINANCEMONTHLYBILL_GETFINANCEMONTHLYBILLDETAILS'
    }
  },
  methods: {
    getDetail() {
      if (this.monthlyBillId !== 0) {
        GIFTING_API_FINANCEMONTHLYBILL_GETFINANCEMONTHLYBILL({
          monthlyBillId: this.monthlyBillId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.settleDetail = res.data.Data
          }
        })
      }
    },
    getData() {
      GIFTING_API_FINANCEMONTHLYBILL_GETFINANCEMONTHLYBILLDETAILS(
        this.queryForm
      ).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows
          this.total = res.data.Data.total
        }
      })
    },
    sortChange(sort) {
      // 表单排序
      this.queryForm.orderField = sort.prop
      this.queryForm.orderType = sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getData()
    },
    currentChange(val) {
      // 切换当前页
      this.queryForm.pageIndex = val
      this.getData()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.queryForm.pageIndex = 1
      this.queryForm.pageSize = val
      this.getData()
    },
    exportData(fields) {
      this.$store.commit('SET_BTN_LOADING', true)
      GIFTING_API_STOREEXPORTER_EXPORTTOFILE({
        apiKey: this.apiKey,
        exportFields: fields,
        exportType: 1,
        apiParameter: this.queryForm
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          window.open(this.$root.settings.DOMAIN_TEMP + res.data.Data)
          this.$store.commit('SET_BTN_LOADING', false)
          this.$message.success('导出成功！')
          this.exportVisible = false
        }
      })
    }
  },
  mounted() {
    this.monthlyBillId = this.$route.query.monthlyBillId || 0
    this.getDetail()
    this.getData()
  },
  components: {
    pagination,
    ExportFiledSetter
  }
}
</script>