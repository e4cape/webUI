<template>
  <!-- @module 结束盘点 -->
  <el-dialog title="结束盘点" :visible.sync="visible" class="get-return-log-dialog close-dialog-box">
    <el-row>
      <el-col :span="4" class="p-10">
        <i class="icon el-icon-warning"></i>
      </el-col>
      <el-col :span="20">
        <div class="tl">
          <p class="m-b-10">结束后盘亏的货品自动生成报损单，盘盈的货品自动生成报溢单。</p>
          <p class="m-b-10">本次盘点盘亏{{totalCount.Quantity3}}，盘盈{{totalCount.Quantity4}}，确定结束？</p>
        </div>
        <div class="m-b-10">
          <el-button type="primary" c:loading="$store.getters.is_loading" @click="takingClose()" name="btnTakingClose">确定</el-button>
          <el-button @click="visible = false" :disabled="$store.getters.is_loading" name="btnCancel">取消</el-button>
        </div>
      </el-col>
    </el-row>
    <div class="panel m-b-10">
      <div class="panel-hd">
        <span class="title">盘亏货品：{{totalCount.Quantity3}}</span>
      </div>
      <div class="panel-bd no-padding">
        <el-table :data="lossLogs.data" v-loading="lossLoading" element-loading-text="拼命加载中" border>
          <el-table-column v-if="$route.query.StuffType == stuffType.Gold" prop="GoldType" label="成色" min-wdith="160" show-overflow-tooltip>
            <template slot-scope="scope">{{$store.getters.goldType.Types[scope.row.GoldType]}}</template>
          </el-table-column>
          <el-table-column v-if="$route.query.StuffType == stuffType.Stone" prop="StoneClassTypeEv" label="石类" min-wdith="160" show-overflow-tooltip></el-table-column>
          <el-table-column v-if="$route.query.StuffType == stuffType.Stone" prop="StonePackageNo" label="包号/石号" min-wdith="160" show-overflow-tooltip></el-table-column>
          <el-table-column v-if="$route.query.StuffType == stuffType.Part" prop="PartTypeEv" label="配件名称" min-wdith="160" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ShelfName" label="盘点位置" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Quantity1" label="账面库存" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.Quantity1 + '/' + $root.toFloat(scope.row.Weight1, 3)}}{{$route.query.StuffType == stuffType.Stone?'ct':'g'}}</template>
          </el-table-column>
          <el-table-column prop="Quantity2" label="盘点" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.Quantity2 + '/' + $root.toFloat(scope.row.Weight2, 3)}}{{$route.query.StuffType == stuffType.Stone?'ct':'g'}}</template>
          </el-table-column>
          <el-table-column prop="Quantity3" label="盘亏" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.Quantity3 + '/' + $root.toFloat(scope.row.Weight3, 3)}}{{$route.query.StuffType == stuffType.Stone?'ct':'g'}}</template>
          </el-table-column>
        </el-table>
        <!-- Pagination -->
        <pagination :pg="lossLogs.pg" :size="lossLogs.size" :total="lossLogs.total" @currentChange="lossPageChange" @sizeChange="lossPageSizeChange"></pagination>
      </div>
    </div>
    <div class="panel m-b-10">
      <div class="panel-hd">
        <span class="title">盘盈货品：{{totalCount.Quantity4}}</span>
      </div>
      <div class="panel-bd no-padding">
        <el-table :data="overLogs.data" v-loading="overLoading" element-loading-text="拼命加载中" border>
          <el-table-column v-if="$route.query.StuffType == stuffType.Gold" prop="GoldType" label="成色" min-wdith="160" show-overflow-tooltip>
            <template slot-scope="scope">{{$store.getters.goldType.Types[scope.row.GoldType]}}</template>
          </el-table-column>
          <el-table-column v-if="$route.query.StuffType == stuffType.Stone" :key="11" prop="StoneClassTypeEv" label="石类" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column v-if="$route.query.StuffType == stuffType.Stone" :key="12" prop="StonePackageNo" label="包号/石号" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column v-if="$route.query.StuffType == stuffType.Part" :key="13" prop="PartTypeEv" label="配件名称" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ShelfName" label="盘点位置" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Quantity1" label="账面库存" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.Quantity1 + '/' + $root.toFloat(scope.row.Weight1, 3)}}{{$route.query.StuffType == stuffType.Stone?'ct':'g'}}</template>
          </el-table-column>
          <el-table-column prop="Quantity2" label="盘点" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.Quantity2 + '/' + $root.toFloat(scope.row.Weight2, 3)}}{{$route.query.StuffType == stuffType.Stone?'ct':'g'}}</template>
          </el-table-column>
          <el-table-column prop="Quantity4" label="盘盈" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.Quantity4 + '/' + $root.toFloat(scope.row.Weight4, 3)}}{{$route.query.StuffType == stuffType.Stone?'ct':'g'}}</template>
          </el-table-column>
        </el-table>
        <!-- Pagination -->
        <pagination :pg="overLogs.pg" :size="overLogs.size" :total="overLogs.total" @currentChange="overPageChange" @sizeChange="overPageSizeChange"></pagination>
      </div>
    </div>
  </el-dialog>
  <!-- End 结束盘点 -->
</template>

<script>
import { YNStatus, StuffType } from '@/enums/common.js'
import {
  STOCKING_API_STUFF_COUNT_ORDER_ITEM_FINISHLOSSGETS,
  STOCKING_API_STUFF_COUNT_ORDER_ITEM_FINISHOVERGETS,
  STOCKING_API_STUFF_COUNT_ORDER_BASIC_FINISH
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'

export default {
  // props: ['takingCloseVisible', 'lossQty'],
  props: {
    takingCloseVisible: {
      default: false,
      type: Boolean
    },
    lossQty:{
      default(){
        return {}
      },
      type: Object
    }
  },
  data() {
    return {
      YNStatus,
      stuffType: StuffType,
      visible: this.takingCloseVisible,
      detail: this.lossQty,
      lossLogs: {
        pg: 1,
        size: 10,
        total: 0,
        data: []
      },
      overLogs: {
        pg: 1,
        size: 10,
        total: 0,
        data: []
      },
      success: false,
      lossLoading: false,
      overLoading: false,
      totalCount: {
        TotalGoodsQty: '',
        TotalFinanceQty: '',
        TotalTakingQty: '',
        TotalLossQty: '',
        TotalOverQty: ''
      }
    }
  },
  methods: {
    takingClose() {
      this.$store.commit('SET_BTN_LOADING', true) // table loading
      STOCKING_API_STUFF_COUNT_ORDER_BASIC_FINISH({
        CountId: this.detail.CountId,
        CheckNote: this.detail.Note
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false) // table loading
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
            type: 'success'
          })
          this.success = true
          this.visible = false
        }
      })
    },
    getLossLogs() {
      this.lossLoading = true
      STOCKING_API_STUFF_COUNT_ORDER_ITEM_FINISHLOSSGETS({
        CountId: this.detail.CountId,
        State: this.detail.State,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: this.lossLogs.pg,
        PageSize: this.lossLogs.size
      }).then(res => {
        this.lossLoading = false
        if (res.data.Code === 'CORRECT') {
          this.lossLogs.data = res.data.Data.Rows || []
          this.lossLogs.total = res.data.Data.Count || 0
        }
      })
    },
    getOverLogs() {
      this.overLoading = true
      STOCKING_API_STUFF_COUNT_ORDER_ITEM_FINISHOVERGETS({
        CountId: this.detail.CountId,
        State: this.detail.State,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: this.overLogs.pg,
        PageSize: this.overLogs.size
      }).then(res => {
        this.overLoading = false
        if (res.data.Code === 'CORRECT') {
          this.overLogs.data = res.data.Data.Rows || []
          this.overLogs.total = res.data.Data.Count || 0
        }
      })
    },
    lossPageChange(val) {
      this.lossLogs.pg = val
      this.getLossLogs()
    },
    lossPageSizeChange(val) {
      this.lossLogs.pg = 1
      this.lossLogs.size = val
      this.getLossLogs()
    },
    overPageChange(val) {
      this.overLogs.pg = val
      this.getOverLogs()
    },
    overPageSizeChange(val) {
      this.overLogs.pg = 1
      this.overLogs.size = val
      this.getOverLogs()
    },
    getEnums() {
      this.$store.dispatch('GET_GOLD_TYPE')
    }
  },
  beforeMount() {
    this.getEnums()
    this.getLossLogs()
    this.getOverLogs()
  },
  watch: {
    visible() {
      this.$emit('listenTakingClose', 'takingCloseVisible', this.success)
    }
  },
  components: {
    pagination
  }
}
</script>
<style lang="scss" scoped>
.panel {
  margin-top: 0;
}
.el-icon-warning {
  font-size: 50px;
  color: #f7ba2a;
}
.close-dialog-box {
  .panel {
    border: none !important;
    .panel-hd {
      border: 1px solid #e5e5e5;
      border-bottom: none !important;
    }
  }
}
</style>

