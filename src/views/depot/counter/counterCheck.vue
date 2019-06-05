<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <div class="title">基本信息</div>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">柜台名称：</td>
                <td>{{data.DeskName}}</td>
                <td class="tit">负责人：</td>
                <td>{{data.ChargeUser}}</td>
                <td class="tit">货品总数：</td>
                <td>{{data.Quantity}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="m-t-10 p-x-10">
        <!-- <div class="tabs">
          <div class="tab" :class="{active: activeName === 'first'}" @click="activeName = 'first'">当前货品明细</div>
          <div class="tab" :class="{active: activeName === 'second'}" @click="activeName = 'second'">领退货记录</div>
        </div> -->
        <el-radio-group v-model="activeName" class="m-b-10">
          <el-radio-button label="first">当前货品明细</el-radio-button>
          <el-radio-button label="second">领退货记录</el-radio-button>
        </el-radio-group>
        <div v-if="activeName === 'first'">
          <el-table :data="detailData" v-loading="$store.getters.tb_loading" key="detailData" class="m-b-10">
            <el-table-column prop="BarCode" label="条码" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <span @click="showDetailDialog(scope.row.GoodsId)" class="init-button-text" name="btnShowDetail">{{scope.row.BarCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="StyleCode" label="款号" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoodsName" label="货品名称" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="MaterialType" label="材质" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="CategoryType" label="品类" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoldType" label="成色" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight" label="货重（g）" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoldWeight" label="净金重（g）" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Stone1Name" label="主石名称" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Stone1Weight" label="主石重（ct）" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="FinanceQty" label="数量" min-width="120" show-overflow-tooltip></el-table-column>
          </el-table>
          <!-- Pagination -->
          <pagination :pg="detailParam.PageIndex" :size="detailParam.PageSize" :total="detailTotal" @currentChange="detailPageChange" @sizeChange="detailPageSizeChange"></pagination>
        </div>
        <div  v-if="activeName === 'second'">
          <div class="tab-border">
             <el-form :model="recordParam" ref="recordParam" label-width="100px" class="item-lh-26" inline>
            <el-form-item label="货品信息：" prop="BarCode">
              <el-input v-model="recordParam.BarCode" :maxlength="50" placeholder="条码" @keyup.enter.native="searchRecordData" name="BarCode"></el-input>
            </el-form-item>
            <el-form-item label="操作类型：" prop="PickretType">
              <el-select v-model="recordParam.PickretType" placeholder="所有" :filterable="true" name="orderType">
                <el-option label="所有" :value="0"></el-option>
                <el-option v-for="(item, index) in DeskPickretOrderBasicPickretType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="操作时间：" prop="CreateTime" class="fix-w">
              <el-date-picker v-model="recordParam.CreateTime" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-button type="primary" @click.prevent="searchRecordData" name="btnSearchRecordData">查询</el-button>
            <el-button @click.prevent="resetRecordParam" name="btnReset">重置</el-button>
          </el-form>
          </div>
          <el-table :data="recordData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" class="m-b-10" key="recordData">
            <el-table-column prop="CreateTime" label="操作时间" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="CreateUser" label="操作人" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="PickretType" label="类型" :formatter="formatter" min-width="80"></el-table-column>
            <!-- <el-table-column prop="PickretCode" label="单号" min-width="80" show-overflow-tooltip></el-table-column> -->
            <el-table-column prop="BarCode" label="条码" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <span @click="showDetailDialog(scope.row.GoodsId)" class="init-button-text" name="btnShowDetail">{{scope.row.BarCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="StyleCode" label="款号" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoodsName" label="货品名称" min-width="180" show-overflow-tooltip></el-table-column>
            <el-table-column prop="MaterialType" label="材质" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="CategoryType" label="品类" :formatter="formatter" min-width="100" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="GoldType" label="成色" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Weight" label="货重（g）" :formatter="formatter" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="GoldWeight" label="净金重（g）" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Stone1Name" label="主石名称" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Stone1Weight" label="主石重（ct）" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="Quantity" label="数量" min-width="80" show-overflow-tooltip></el-table-column>
          </el-table>
          <!-- Pagination -->
          <pagination :pg="recordParam.PageIndex" :size="recordParam.PageSize" :total="recordTotal" @currentChange="recordPageChange" @sizeChange="recordPageSizeChange"></pagination>
        </div>
      </div>
    </div>
    <el-button class="m-t-10" type="default" @click="$router.back()">返回</el-button>
    <!-- dialog 货品详情 -->
    <good-detail :visible.sync="goodDetailDialog.visible" :goodsId="goodDetailDialog.goodsId"></good-detail>
    <!-- end 货品详情-->
  </div>
</template>

<script>
import { YNStatus } from '@/enums/common.js'
import { DeskPickretOrderBasicPickretType } from '@/enums/stocking.js'
import {
  STOCKING_API_DESK_BASIC_GET,
  STOCKING_API_DESK_PICKRET_ORDER_ITEM_GETSGOODSSTOCK,
  STOCKING_API_DESK_PICKRET_ORDER_ITEM_REQS
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
import goodDetail from '@/components/erp/goodDetail'

export default {
  data() {
    return {
      DeskPickretOrderBasicPickretType,
      activeName: 'first',
      data: {}, // 柜台详情
      detailData: [], // 当前货品明细
      detailTotal: 0,
      detailParam: {
        PageIndex: 1,
        PageSize: 20,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        DeskId: '',
      },
      recordData: [], // 领退货记录
      recordTotal: 0,
      recordParam: {
        DeskId: '',
        PickretType: 0,
        CreateTime1: '',
        CreateTime2: '',
        BarCode: '',
        CreateTime: [],
        PageIndex: 1,
        PageSize: 20,
        OrderBy: 0,
        IsAsced: YNStatus.No
      },
      goodDetailDialog: {
        GoodsId: 0,
        visible: false // 货品详情对话框
      },
    }
  },
  methods: {
    formatter(row, column, val) {
      switch (column.property) {
        case 'MaterialType':
          return this.$store.getters.materialType.Types[val]
        case 'CategoryType':
          return this.$store.getters.categoryType.Types[val]
        case 'GoldType':
          return this.$store.getters.goldType.Types[val]
        case 'CreateTime':
          return this.$options.filters.filterDateMinutes(val)
        case 'PickretType':
          return DeskPickretOrderBasicPickretType.Types[val]
        case 'Stone1Weight':
          return this.$root.toFloat(val, 3) + 'ct'
        default:
          return this.$root.toFloat(val, 3) + 'g'
      }
    },
    getEnums() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
    },
    init() {
      this.detailParam.DeskId = parseInt(this.$route.query.id)
      this.recordParam.DeskId = parseInt(this.$route.query.id)
      if (!this.$route.query.id) {
        this.dataError()
      } else {
        this.getData()
        this.getDetailData()
      }
    },
    getData() {
      STOCKING_API_DESK_BASIC_GET({
        DeskId: parseInt(this.$route.query.id)
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data || {}
        }
      })
    },
    dataError(msg) {
      this.$alert(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        type: 'warning'
      })
        .then(() => {
          this.$router.back()
        })
        .catch(() => {
          this.$router.back()
        })
    },
    getDetailData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_DESK_PICKRET_ORDER_ITEM_GETSGOODSSTOCK(
        this.detailParam
      ).then(res => {
        this.$store.commit('SET_TB_LOADING', false) // table loading
        if (res.data.Code === 'CORRECT') {
          this.detailData = res.data.Data.Rows || []
          this.detailTotal = res.data.Data.Count
        }
      })
    },
    detailPageChange(val) {
      this.detailParam.PageIndex = val
      this.getDetailData()
    },
    detailPageSizeChange(val) {
      this.detailParam.PageIndex = 1
      this.detailParam.PageSize = val
      this.getDetailData()
    },
    getRecordData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_DESK_PICKRET_ORDER_ITEM_REQS(this.recordParam).then(res => {
        this.$store.commit('SET_TB_LOADING', false) // table loading
        if (res.data.Code === 'CORRECT') {
          this.recordData = res.data.Data.Rows || []
          this.recordTotal = res.data.Data.Count
        }
      })
    },
    searchRecordData() {
      this.recordParam.PageIndex = 1
      if (this.recordParam.CreateTime.length > 0) {
        this.recordParam.CreateTime1 = this.recordParam.CreateTime[0]
        this.recordParam.CreateTime2 = this.recordParam.CreateTime[1]
      } else {
        this.recordParam.CreateTime1 = ''
        this.recordParam.CreateTime2 = ''
      }
      this.getRecordData()
    },
    resetRecordParam() {
      this.$refs.recordParam.resetFields()
      this.recordParam.CreateTime = []
      this.searchRecordData()
    },
    recordPageChange(val) {
      this.recordParam.PageIndex = val
      this.getRecordData()
    },
    recordPageSizeChange(val) {
      this.recordParam.PageSize = val
      this.recordParam.PageIndex = 1
      this.getRecordData()
    },
    showDetailDialog(goodsId) {
      this.goodDetailDialog = {
        goodsId: goodsId,
        visible: true
      }
    }

  },
  created() {
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  watch: {
    activeName() {
      if (this.activeName === 'second') {
        this.recordParam.PageIndex = 1
        this.getRecordData()
      } else {
        this.detailParam.PageIndex = 1
        this.getDetailData()
      }
    }
  },
  components: {
    pagination,
    goodDetail
  }
}
</script>

<style lang="scss" scoped>
.tab-border {
  margin-bottom: 10px;
  padding: 10px;
  padding-bottom: 0;
  border: 1px solid #e5e5e5;
}
</style>
