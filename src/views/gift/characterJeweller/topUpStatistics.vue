<template>
  <div>
    <el-form :inline="true" :model="queryForm" class="item-lh-26 p10" label-width="80px">
      <el-row class="search-box no-border" type="flex">
        <el-col>
          <el-form-item label="时间：">
            <el-date-picker  name="dateTime" v-model="queryForm.dateTime" type="daterange" :picker-options="$root.datePickerOptions" unlink-panels :clearable="false" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" value-format="yyyy-MM-dd HH:mm:dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="公司编码：">
            <el-input  name="companyCode" :maxlength="50" v-model="queryForm.companyCode" @keyup.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item label="公司名称：">
            <el-input  name="companyName" :maxlength="50" v-model="queryForm.companyName" @keyup.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item label="门店编码：">
            <el-input  name="storeCode" :maxlength="50" v-model="queryForm.storeCode" @keyup.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item label="门店名称：">
            <el-input  name="storeName" :maxlength="50" v-model="queryForm.storeName" @keyup.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item label="商户类型：">
            <el-select  name="characterType" filterable v-model="queryForm.characterType" placeholder="全部">
              <el-option label="全部" value></el-option>
              <el-option label="珠宝公司" :value="characterType.Company"></el-option>
              <el-option label="珠宝门店" :value="characterType.Store"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select  name="status" filterable v-model="queryForm.status" placeholder="全部">
              <el-option label="全部" :value="''"></el-option>
              <el-option v-for="(item, index) in storeRechargeOrderStatus.Types" :key="index" :label="item.title" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button  name="btnSearch" type="primary" @click="search">搜索</el-button>
          <el-button  name="btnReset" @click="reset">重置</el-button>
          <el-button  name="btnExport" @click="exportVisible=true">导出</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="20" class="total-panel m-b-10" v-loading="$store.getters.tb_loading">
      <el-col :span="6">
        <div class="total qty">
          <div class="number">{{numInfo.merchantCount || '-'}}</div>
          <div class="name">充值单位</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="total weight">
          <div class="number">{{numInfo.count || '-'}}</div>
          <div class="name">充值次数</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="total price">
          <div class="number">￥{{Math.abs(numInfo.price) || '-'}}</div>
          <div class="name">充值金额</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="total cashier">
          <div class="number">￥{{parseFloat(numInfo.givePrice).toFixed(2) || '-'}}</div>
          <div class="name">赠送金额</div>
        </div>
      </el-col>
    </el-row>
    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="characterTypeText" fixed label="商户类型" sortable min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.characterType == characterType.Store ? '珠宝门店' : scope.row.characterType == characterType.Company ? '珠宝公司' : ''}}
        </template>
      </el-table-column>
      <el-table-column prop="companyCode" label="公司编码" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="companyName" label="公司名称" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="storeCode" label="门店编码" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="storeName" label="门店名称" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="count" label="充值次数" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="price" label="充值金额" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="givePrice" label="赠送金额" min-width="100" show-overflow-tooltip></el-table-column>
    </el-table>
    <export-filed-setter title="导出" :visible.sync="exportVisible" :api="filedsApi" :apiKey="apiKey" @submit="exportData"></export-filed-setter>
    <pagination :total="total" :pg="queryForm.pageIndex" :size="queryForm.pageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>

<script>
import pagination from '@/components/pagination.vue'
import ExportFiledSetter from '@/components/exportFieldSetter'
import {
  GIFTING_API_ORDERRECHARGE_GETSTORETOTALLIST,
  GIFTING_API_ORDERRECHARGE_GETTOTAL,
  GIFTING_API_STOREEXPORTER_EXPORTTOFILE,
  GIFTING_API_STOREEXPORTER_GETEXPORTFIELDS
} from '@/apis/gifting'
import {
  StoreRechargeOrderStatus
} from '@/enums/gifting'
import { CharacterType } from '@/enums/common'
export default {
  data() {
    return {
      characterType: CharacterType,
      storeRechargeOrderStatus: StoreRechargeOrderStatus,
      queryForm: {
        companyCode: '' ,
        companyName: '' ,
        storeCode: '' ,
        storeName: '' ,
        characterType: '',
        status: '',
        createTimeStart: '',
        dateTime: [
          new Date(new Date().getFullYear() , new Date().getMonth(), 1),
          new Date()
        ],
        createTimeEnd: '',
        pageIndex: 1,
        pageSize: 20
      },
      data: [],
      total: 0,
      numInfo: [],
      exportVisible: false,
      filedsApi: GIFTING_API_STOREEXPORTER_GETEXPORTFIELDS, // 查询数据的api名称
      apiKey: 'ORDERRECHARGE_GETSTORETOTALLIST',
      parameters: {
      }
    }
  },
  methods: {
    init () {
      let query = this.$route.query || {
      }
      this.queryForm = Object.assign(this.queryForm, {
        companyCode: '' ,
        companyName: '' ,
        storeCode: '' ,
        dateTime: [
          new Date(new Date().getFullYear() , new Date().getMonth(), 1),
          new Date()
        ],
        storeName: '' ,
        characterType: '',
        status: '',
        createTimeStart: '',
        createTimeEnd: '',
        pageIndex: 1,
        pageSize: 20
      }, query, {
        dateTime: query.dateTime ? [ new Date(query.dateTime[0]), new Date(query.dateTime[1]) ] : [
          new Date(new Date().getFullYear() , new Date().getMonth(), 1),
          new Date()
        ]
      })
      this.getData()
      this.getPeriodBalance()
    },
    getData() {
      this.queryForm.createTimeStart = this.queryForm.dateTime[0]
      this.queryForm.createTimeEnd = this.queryForm.dateTime[1]
      this.$store.commit('SET_TB_LOADING', true)
      GIFTING_API_ORDERRECHARGE_GETSTORETOTALLIST(this.queryForm).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.$store.commit('SET_TB_LOADING', false)
            this.data = res.data.Data.rows
            this.total = res.data.Data.total
          }
        }
      )
    },
    getPeriodBalance() {
      this.queryForm.createTimeStart = this.queryForm.dateTime[0]
      this.queryForm.createTimeEnd = this.queryForm.dateTime[1]
      GIFTING_API_ORDERRECHARGE_GETTOTAL(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.numInfo = res.data.Data
        }
      })
    },
    search () {
      this.queryForm.pageIndex = 1
      this.parameters = Object.assign({
      }, this.queryForm)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
        this.getPeriodBalance()
      } else {
        this.initRoute()
      }
      this.initRoute()
    },
    reset () {
      this.queryForm = {
        companyCode: '' ,
        dateTime: [
          new Date(new Date().getFullYear() , new Date().getMonth(), 1),
          new Date()
        ],
        companyName: '' ,
        storeCode: '' ,
        storeName: '' ,
        characterType: '',
        status: '',
        createTimeStart: '',
        createTimeEnd: '',
        pageIndex: 1,
        pageSize: 20
      }
      this.search()
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.pageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.pageIndex = 1
      this.parameters.pageSize = val
      this.initRoute()
    },
    exportData(fields) {
      GIFTING_API_STOREEXPORTER_EXPORTTOFILE({
        apiKey: this.apiKey,
        exportFields: fields,
        exportType: 1,
        apiParameter: this.queryForm
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.exportVisible = false
          this.$message.success('导出成功！')
          window.open(this.$root.settings.DOMAIN_TEMP + res.data.Data)
        }
      })
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path, query: JSON.parse(JSON.stringify(this.parameters)) 
      })
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination,
    ExportFiledSetter
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/sass/report.scss';
</style>