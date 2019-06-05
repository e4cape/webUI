<template>
  <div class="panel">
    <div class="p-10 clearfix">
      <div class="fl" v-if="data.imageUrl" style="height:125px;display: flex;align-items: center">
        <img :src="$root.settings.DOMAIN_IMAGE + data.imageUrl" alt="" width="80" height="80">
      </div>
      <el-form label-width="110px" class="fl p-l-10" style="width: 800px;">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="类型:">{{data.characterTypeText}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="ID:">{{data.characterId}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="名称:">{{data.storeName}}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="联系人：">
              {{data.contact}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人手机：">
              {{data.mobile}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属地区：">
              {{data.areaName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="详细地址：">
              {{data.address}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button name="btnExportToExcel" @click="exportToExcel" class="fr m-b-10 m-x-10" v-if="total > 0">导出Excel表</el-button>
      <el-button name="btnToBack" type="primary" icon="el-icon-arrow-left" class="fr" @click="$router.back(-1)">返回</el-button>
    </div>
    <el-row class="total-num-show" v-loading="$store.getters.tb_loading">
      <el-col :span="12">
        <span>充值金额：</span>
        <span class="fw-b text-danger">{{data.totalAmount !== undefined ? data.totalAmount : '-'}}</span>
      </el-col>
      <el-col :span="12">
        <span>购买短信条数：</span>
        <span class="fw-b text-warning">{{data.smsCount !== undefined ? data.smsCount : '-'}}</span>
      </el-col>
    </el-row>
    <el-table :data="data.rows" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="createTime" label="下单时间" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="orderId" label="订单号" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="goodsName" label="商品名称" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="smsCount" label="购买条数" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="price" label="单价（元）" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="amount" label="金额（元）" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="statusText" label="状态" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="payTypeText" label="支付方式" width="140" show-overflow-tooltip></el-table-column>
      <el-table-column prop="orderId" label="支付单号" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column prop="payTime" label="支付时间" width="140" show-overflow-tooltip></el-table-column>
    </el-table>
    <pagination :total="total" :pg="searchForm.pageIndex" :size="searchForm.pageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>

<script>
import pagination from '@/components/pagination.vue'
import {
  MESSAGE_API_ORDERRECHARGE_GETSTORERECHARGEDETAILS,
  MESSAGE_API_STOREEXPORTER_EXPORTTOFILE
} from '@/apis/message'

export default {
  data() {
    return {
      data: {
        characterId: '',
        storeName: '',
        rangeCount: '',
        imageUrl: '',
        totalCount: '',
        rows: []
      },
      searchForm: {
        startTime: '',
        endTime: '',
        pageIndex: 1,
        pageSize: 20
      },
      total: 0,
      parameter: {
      }
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: '/message/dataStatistics/statisticsStoreDetail',
        query: this.parameter
      })
    },
    initData() {
      let query = this.$route.query || {
      }
      if (!query.characterId) {
        return
      }
      this.parameter.characterId = query.characterId || ''
      this.parameter.mobile = query.mobile || ''
      this.parameter.startTime = query.startTime || ''
      this.parameter.endTime = query.endTime || ''
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.pageSize = query.pageSize || 20
      this.$store.commit('SET_TB_LOADING', true)
      this.getData()
    },
    getData() {
      MESSAGE_API_ORDERRECHARGE_GETSTORERECHARGEDETAILS(
        Object.assign(this.searchForm, this.parameter)
      ).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data
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
    exportToExcel() {
      MESSAGE_API_STOREEXPORTER_EXPORTTOFILE({
        apiKey: 'ORDERRECHARGE_GETSTORERECHARGEDETAILS',
        apiParameter: Object.assign(this.searchForm, this.parameter),
        exportFields: [
          'createTime',
          'orderId',
          'goodsName',
          'smsCount',
          'price',
          'amount',
          'statusText',
          'payTypeText',
          'payNo',
          'payTime'
        ],
        exportType: 1
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          window.open(this.$root.settings.DOMAIN_TEMP + res.data.Data)
        }
      })
    }
  },
  mounted() {
    this.initData()
  },
  watch: {
    $route: 'initData'
  },
  components: {
    pagination
  }
}
</script>
