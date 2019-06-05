<template>
  <div class="p-t-10">
    <el-form :inline="true" name="btnStatisticsStaionForm" :model="queryForm" ref="search" class="demo-form-inline" label-width="80px">
      <el-form-item label="下单时间：" prop="dateTime">
        <el-date-picker name="btnOrderTime" v-model="dateTime" type="daterange" range-separator="-" align="left" :picker-options="$root.datePickerOptions" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" value-format="yyyy-MM-dd" :clearable="true">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="订单号：" prop="orderNo">
        <el-input name="btnOrderNumber" v-model="queryForm.orderNo"  maxlength="20" placeholder="订单号" @keyup.enter.native="onSearch"></el-input>
      </el-form-item>
      <el-form-item class="m-l-10" >
        <el-button name="btnOnSearch" type="primary" @click="onSearch">查询</el-button>
        <el-button name="btnOnReset" @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="total-num-show" v-loading="$store.getters.tb_loading">
      <el-col :span="12">
        <span>充值金额：</span>
        <span class="fw-b text-danger">{{numInfo.totalAmount || '-'}}</span>
      </el-col>
      <el-col :span="12">
        <span>购买短信：</span>
        <span class="fw-b text-warning">{{numInfo.smsCount || '-'}}</span>
      </el-col>
    </el-row>
    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="orderNo" label="订单号" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="goodsName" label="产品名称" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="orderPrice" label="订单金额" show-overflow-tooltip></el-table-column>
      <el-table-column prop="discountPrice" label="优惠金额" show-overflow-tooltip></el-table-column>
      <el-table-column prop="actualPrice" label="实际金额" show-overflow-tooltip></el-table-column>
      <el-table-column prop="orderType" label="订单类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="smsCount" label="产品数量" show-overflow-tooltip></el-table-column>
      <el-table-column prop="payType" label="支付方式" show-overflow-tooltip></el-table-column>
      <el-table-column prop="orderTime" label="下单时间" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="订单状态" show-overflow-tooltip></el-table-column>
      <el-table-column prop="invoice" label="是否开票" show-overflow-tooltip></el-table-column>
    </el-table>
    <pagination :total="total" :pg="queryForm.pageIndex" :size="queryForm.pageSize" @currentChange="currentChange" @sizeChange="sizeChange">

    </pagination>
  </div>
</template>

<script>
import pagination from '@/components/pagination.vue'
import {
  MESSAGE_API_PLATFORMRECHARGE_GETSUMMARY 
} from '@/apis/message'

export default {
  data() {
    return {
      activeIndex: 0,
      queryForm: {
        orderNo: '',
        startTime: '',
        endTime: '',
        pageIndex: 1,
        pageSize: 20
      },
      dateTime: '',
      data: [],
      total: 0,
      numInfo: []
    }
  },
  methods: {
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      let createTime = this.dateTime || ['', '']
      this.queryForm = Object.assign(this.queryForm, {
        startTime: createTime[0],
        endTime: createTime[1],
      })

      MESSAGE_API_PLATFORMRECHARGE_GETSUMMARY(this.queryForm).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows
          this.total = res.data.Data.total
          this.numInfo.totalAmount = res.data.Data.totalAmount
          this.numInfo.smsCount = res.data.Data.smsCount
        }
      })
    },
    currentChange(val) {
      // 切换当前页
      this.queryForm.pageIndex = val
      this.getData()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.queryForm.pageSize = val
      this.queryForm.pageIndex = 1
      this.getData()
    },
    onSearch() {
      this.queryForm.pageIndex = 1
      this.getData()
    },
    onReset () {
      // 重置表单
      this.$refs['search'].resetFields()
      this.dateTime = ''
      this.onSearch()
    },
  },
  mounted() {
    this.getData()
  },
  components: {
    pagination
  }
}
</script>
