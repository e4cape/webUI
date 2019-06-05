<template>
  <div>
    <el-form
      :model="queryForm"
      name="btnPaymentOrderForm"
      ref="queryForm"
      label-width="120px"
      class="item-lh-26"
      :inline="true"
    >
      <search-panel
        @onSearch="onSearch"
        @onReset="onReset"
        name="btnPayMentOrderSearch"
      >
        <template slot="simpleSearch">
          <el-form-item prop="status">
            <el-select
              name="btnSelectStatus"
              v-model="queryForm.status"
              @change="onSimpleSearch"
            >
              <el-option
                label="所有状态"
                value=""
              ></el-option>
              <el-option
                v-for="item in rechargeOrderStatus.Types"
                :key="item.key"
                :value="item.key"
                :label="item.title"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              name="btnEnterName"
              v-model="queryForm.storeName"
              placeholder="名称"
              @keyup.native.enter="onSearch"
            >
              <el-button
                name="btnClickNameSearch"
                slot="append"
                icon="el-icon-search"
                @click="onSearch"
              ></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item
            label="日期："
            prop="createTime"
          >
            <el-date-picker
              name="btnCreateTime"
              v-model="queryForm.createTime "
              type="daterange"
              :editable="false"
              :unlink-panels="true"
              placeholder="选择日期范围"
              :picker-options="$root.datePickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="订单号："
            prop="orderId"
          >
            <el-input
              name="btnEnterOrderNumber"
              v-model="queryForm.orderId"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="帐号："
            prop="storeAdministratorId"
          >
            <el-input
              name="btnEnetrAccoumt"
              v-model="queryForm.storeAdministratorId"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="名称："
            prop="storeName"
          >
            <el-input
              name="btnEnterName"
              v-model="queryForm.storeName"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="类型："
            prop="characterType"
          >
            <el-select
              name="btnSelectType"
              v-model="queryForm.characterType"
            >
              <el-option
                label="全部"
                value=""
              ></el-option>
              <el-option
                :key="EnumCharacterType.Store"
                :value="EnumCharacterType.Store"
                label="门店"
              ></el-option>
              <el-option
                :key="EnumCharacterType.Company"
                :value="EnumCharacterType.Company"
                label="公司"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table
      :data="data"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column
        prop="createTime"
        label="下单时间"
        width="150"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="orderId"
        label="订单号"
        width="180"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="goodsName"
        label="商品名称"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="smsCount"
        label="购买条数（条）"
        width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="price"
        label="单价（元）"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="amount"
        label="金额（元）"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="characterTypeText"
        label="类型"
        width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{scope.row.characterType == EnumCharacterType.Store ? '门店' : '公司'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="storeAdministratorId"
        label="帐号"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="storeName"
        label="名称"
        width="200"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="statusText"
        label="状态"
        width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="payTypeText"
        label="支付方式"
        width="90"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="payNo"
        label="支付单号"
        width="180"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="payTime"
        label="支付时间"
        width="150"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
    <pagination
      :total="total"
      :pg="queryForm.pageIndex"
      :size="queryForm.pageSize"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
  </div>
</template>
<script>
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination.vue'
import { RechargeOrderStatus } from '@/enums/message'
import { CharacterType } from '@/enums/common'
import { MESSAGE_API_ORDERRECHARGE_SEARCHLIST } from '@/apis/message'
export default {
  data() {
    return {
      rechargeOrderStatus: RechargeOrderStatus,
      queryForm: {
        createTime: [
          new Date(Date.parse(new Date()) - 6 * 24 * 60 * 60 * 1000),
          new Date()
        ],
        characterType: '',
        orderId: '',
        storeAdministratorId: '',
        storeName: '',
        endTime: '',
        startTime: '',
        status: '',
        pageIndex: 1,
        pageSize: 20
      }, // 用于搜索条件双向数据绑定的数据变化
      parameter: {}, // 用于传给后台接口做数据帅选
      total: 0,
      data: []
    }
  },
  computed: {
    EnumCharacterType() {
      return CharacterType
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: JSON.parse(JSON.stringify(this.parameter))
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.characterType = query.characterType || ''
      this.parameter.orderId = query.orderId || ''
      this.parameter.storeAdministratorId = query.storeAdministratorId || ''
      this.parameter.storeName = query.storeName || ''
      this.parameter.status = query.status || ''
      this.parameter.createTime = query.createTime || [
        new Date(Date.parse(new Date()) - 6 * 24 * 60 * 60 * 1000),
        new Date()
      ]
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.pageSize = query.pageSize || 20
      this.getData()
    },
    getData() {
      console.log(this.parameter.createTime)
      let createTime = this.parameter.createTime || ['', '']
      this.$store.commit('SET_TB_LOADING', true)
      let parameter = Object.assign(this.queryForm, this.parameter, {
        startTime: createTime[0],
        endTime: createTime[1]
      })
      this.$store.commit('SET_TB_LOADING', true)
      MESSAGE_API_ORDERRECHARGE_SEARCHLIST(parameter).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows
          this.total = res.data.Data.total
        }
      })
    },
    currentChange(val) {
      // 切换当前页
      this.parameter.pageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameter.pageIndex = 1
      this.parameter.pageSize = val
      this.initRoute()
    },
    // -简单搜索
    onSimpleSearch(e) {
      this.parameter.status = e
      this.onSearch()
    },
    onSearch() {
      // 搜索相关
      this.queryForm.pageIndex = 1
      this.parameter = Object.assign({}, this.queryForm)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs['queryForm'].resetFields()
      this.queryForm.createTime = [
        new Date(Date.parse(new Date()) - 6 * 24 * 60 * 60 * 1000),
        new Date()
      ]
      this.onSearch()
    }
  },
  beforeMount() {
    this.init()
  },
  mounted() {},
  watch: {
    $route: 'init'
  },
  components: {
    searchPanel,
    pagination
  }
}
</script>
