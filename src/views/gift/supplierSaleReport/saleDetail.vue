<template>
  <el-row>
    <el-form :model="queryForm" label-width="100px" ref="queryForm" :inline="true" class="item-lh-26 p10" style="padding:10px 10px 0">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-button name="btnDownLoad" type="primary" @click="downLoadData" :disabled="!data.length">导出</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="status">
            <el-select name="orderStatus" filterable v-model="queryForm.orderStatus" @change="onSimpleSearch">
              <el-option label="所有状态" value></el-option>
              <template v-for="item in orderStatus.Types">
                <el-option v-if="item.key!=orderStatus.PendingPay&&item.key!=orderStatus.Cancel&&item.key!=orderStatus.Invalid" :key="item.key" :label="item.title" :value="item.key"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input name="giftName" v-model="queryForm.giftName" placeholder="礼品名称" @keyup.enter.native="onSearch">
              <el-button name="btnSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-row class="search-box no-border" type="flex">
            <el-col>
              <el-form-item label="单据编号：" prop="orderCode">
                <el-input name="orderCode" v-model="queryForm.orderCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
              <el-form-item label="礼品名称：" prop="giftName">
                <el-input name="giftName" v-model="queryForm.giftName" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
              <el-form-item label="货号/条码：" prop="barCode">
                <el-input name="barCode" v-model="queryForm.barCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
              <el-form-item label="下单时间：" prop="createTime">
                <el-date-picker
                  name="createTime"
                  v-model="queryForm.createTime"
                  type="daterange"
                  :clearable="false"
                  :unlink-panels="true"
                  placeholder="选择日期范围"
                  :picker-options="$root.datePickerOptions"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="支付时间：" prop="payTime">
                <el-date-picker name="payTime" v-model="queryForm.payTime" type="daterange" :clearable="false" :unlink-panels="true" placeholder="选择日期范围" :picker-options="$root.datePickerOptions"></el-date-picker>
              </el-form-item>
              <el-form-item label="发货时间：" prop="expressTime">
                <el-date-picker
                  name="expressTime"
                  v-model="queryForm.expressTime"
                  type="daterange"
                  :clearable="false"
                  :unlink-panels="true"
                  placeholder="选择日期范围"
                  :picker-options="$root.datePickerOptions"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="下单人手机：" prop="mobile">
                <el-input name="mobile" v-model="queryForm.mobile" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
              <el-form-item label="收货人手机：" prop="receiveMobile">
                <el-input name="receiveMobile" v-model="queryForm.receiveMobile" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="data" @sort-change="sortChange" :loading="$store.getters.tb_loading">
      <el-table-column prop="createTime" label="下单时间" min-width="120" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.createTime | filterDateMinutes}}</template>
      </el-table-column>
      <el-table-column prop="payTime" label="支付时间" min-width="120" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.payTime | filterDateMinutes}}</template>
      </el-table-column>
      <el-table-column prop="expressTime" label="发货时间" min-width="120" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.expressTime | filterDateMinutes}}</template>
      </el-table-column>
      <el-table-column prop="receiveTime" label="收货时间" min-width="120" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.receiveTime | filterDateMinutes}}</template>
      </el-table-column>
      <el-table-column prop="orderStatusText" label="状态" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="giftName" label="礼品名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="attributeTexts" label="礼品规格" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="barCode" label="货号/条码" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="quantity" label="数量" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="scoreTypeText" label="兑换类型" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="exchangeQuantity" label="兑换量" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="orderCode" label="礼品订单号" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="trueName" label="下单人姓名" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="mobile" label="下单人手机" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="receiveName" label="收货人姓名" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="receiveMobile" label="收货人手机" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="receiveArea" label="收货人地区" min-width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="receiveAddress" label="收货地址(不含地区)" min-width="130" show-overflow-tooltip></el-table-column>
      <el-table-column prop="receiveFullAddress" label="收货地址(含地区)" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="remark" label="订单备注" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="expressTypeText" label="快递公司" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="expressCode" label="快递单号" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="expressNote" label="发货备注" min-width="120" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- Pagination -->
    <pagination :pg="queryForm.pageIndex" :size="queryForm.pageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <export-filed-setter title="导出" :visible.sync="exportVisible" :api="filedsApi" apiKey="GIFTSALEORDERFORC_GETEXCHANGEDETAILS" @submit="exportData"></export-filed-setter>
  </el-row>
</template>
<script>
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import ExportFiledSetter from '@/components/exportFieldSetter.vue'
import {
  OrderStatus, GiftTypes
} from '@/enums/gifting'
import {
  YNStatus
} from '@/enums/common'
import {
  GIFTING_API_GIFTSALEORDERFORC_GETEXCHANGEDETAILS,
  GIFTING_API_STOREEXPORTER_GETEXPORTFIELDS,
  GIFTING_API_STOREEXPORTER_EXPORTTOFILE
} from '@/apis/gifting'
export default {
  data() {
    return {
      orderStatus: OrderStatus,
      giftTypes: GiftTypes,
      queryForm: {
        orderStatus: '',
        giftOrderType: '',
        orderCode: '',
        giftName: '',
        barCode: '',
        createTime: '',
        payTime: '',
        expressTime: '',
        mobile: '',
        receiveMobile: '',
        supplierId: '',
        orderField: 'createTime',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 20
      },
      parameter: {
      },
      total: 0,
      data: [],
      exportVisible: false,
      filedsApi: GIFTING_API_STOREEXPORTER_GETEXPORTFIELDS
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.parameter.orderStatus = query.orderStatus || ''
      this.parameter.giftOrderType = query.giftOrderType || ''
      this.parameter.orderCode = query.orderCode || ''
      this.parameter.giftName = query.giftName || ''
      this.parameter.barCode = query.barCode || ''
      this.parameter.mobile = query.mobile || ''
      this.parameter.receiveMobile = query.receiveMobile || ''
      this.parameter.pageSize = query.pageSize || 10
      this.parameter.pageIndex = query.pageIndex || 1
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: JSON.parse(JSON.stringify(this.parameter))
      })
    },
    getData() {
      let createTime = this.parameter.createTime || ['', '']
      let payTime = this.parameter.payTime || ['', '']
      let expressTime = this.parameter.expressTime || ['', '']
      let parameter = Object.assign(this.queryForm, this.parameter, {
        createTimeStart: createTime[0],
        createTimeEnd: createTime[1],
        payTimeStart: payTime[0],
        payTimeEnd: payTime[1],
        expressTimeStart: expressTime[0],
        expressTimeEnd: expressTime[1]
      })
      this.$store.commit('SET_TB_LOADING', true)
      GIFTING_API_GIFTSALEORDERFORC_GETEXCHANGEDETAILS(parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows
          this.total = res.data.Data.total
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    sortChange(sort) {
      this.queryForm.orderField = sort.prop
      this.queryForm.orderType = sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    currentChange(val) {
      this.parameter.pageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      this.parameter.pageIndex = 1
      this.parameter.pageSize = val
      this.initRoute()
    },
    onSearch() {
      this.queryForm.pageIndex = 1
      this.parameter = Object.assign({
      }, this.queryForm)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onSimpleSearch(e) {
      this.parameter.status = e
      this.onSearch()
    },
    onReset() {
      this.$refs['queryForm'].resetFields()
      this.queryForm.orderStatus = ''
      this.onSearch()
    },
    // 导出数据
    downLoadData() {
      this.exportVisible = true
    },
    exportData(fields) {
      let createTime = this.parameter.createTime || ['', '']
      let payTime = this.parameter.payTime || ['', '']
      let expressTime = this.parameter.expressTime || ['', '']
      const {
        orderStatus,
        orderCode,
        giftName,
        barCode,
        mobile,
        receiveMobile,
        orderField,
        orderType,
        pageIndex,
        pageSize
      } = this.queryForm
      const apiParameter = {
        orderStatus,
        orderCode,
        giftName,
        barCode,
        mobile,
        receiveMobile,
        orderField,
        orderType,
        pageIndex,
        pageSize,
        createTimeStart: createTime[0],
        createTimeEnd: createTime[1],
        payTimeStart: payTime[0],
        payTimeEnd: payTime[1],
        expressTimeStart: expressTime[0],
        expressTimeEnd: expressTime[1]
      }
      this.$store.commit('SET_FULL_LOADING', true)
      GIFTING_API_STOREEXPORTER_EXPORTTOFILE({
        apiKey: 'GIFTSALEORDERFORC_GETEXCHANGEDETAILS',
        exportFields: fields,
        exportType: 1,
        apiParameter
      }).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.exportVisible = false
          this.$message.success('导出成功！')
          window.open(this.$root.settings.DOMAIN_TEMP + res.data.Data)
        } else {
          this.$message.error(res.data.Message)
        }
      })
    }
  },
  watch: {
    $route: 'init'
  },
  mounted() {
    this.init()
  },
  components: {
    searchPanel,
    pagination,
    ExportFiledSetter
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/sass/report.scss';
</style>
