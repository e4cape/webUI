<template>
  <!-- @module 盘点报告 -->
  <el-dialog title="盘点报告" :visible.sync="visible" class="get-return-log-dialog taking-log-box">
    <div class="panel">
      <div class="panel-hd"><span class="title">盘点概况</span></div>
      <div class="panel-bd no-padding">
        <div class="info-table-taking">
          <div class="info-table-th">
            <span class="flex1"></span> <span class="flex1">应盘</span> <span class="flex1">实盘</span> <span class="flex1">盘亏</span><span class="flex1">盘盈</span>
          </div>
          <div class="info-taking-tr">
            <span class="flex1">数量</span>
            <span class="flex1">{{detail.Quantity1}}</span>
            <span class="flex1">{{detail.Quantity2}}</span>
            <span class="flex1">{{detail.Quantity3}}</span>
            <span class="flex1">{{detail.Quantity4}}</span>
          </div>
          <div class="info-taking-tr">
            <span class="flex1">重量</span>
            <span class="flex1">{{$root.toFloat(detail.Weight1, 3)}}{{detail.StuffType == stuffType.Stone?'ct':'g'}}</span>
            <span class="flex1">{{$root.toFloat(detail.Weight2, 3)}}{{detail.StuffType == stuffType.Stone?'ct':'g'}}</span>
            <span class="flex1">{{$root.toFloat(detail.Weight3, 3)}}{{detail.StuffType == stuffType.Stone?'ct':'g'}}</span>
            <span class="flex1">{{$root.toFloat(detail.Weight4, 3)}}{{detail.StuffType == stuffType.Stone?'ct':'g'}}</span>
          </div>
        </div>
        <!-- <div v-else class="noData">暂无数据</div> -->
      </div>
    </div>
    <div class="panel">
      <div class="panel-hd"><span class="title">盘亏货品：{{detail.Quantity3}}/{{$root.toFloat(detail.Weight3, 3)}}{{detail.StuffType == stuffType.Stone?'ct':'g'}}</span></div>
      <div class="panel-bd no-padding">
        <el-table :data="lossLogs.data" v-loading="lossLoading" element-loading-text="拼命加载中">
          <el-table-column v-if="detail.StuffType == stuffType.Gold" :key="10" prop="GoldType" label="成色">
            <template slot-scope="scope">
              {{$store.getters.goldType.Types[scope.row.GoldType]}}
            </template>
          </el-table-column>
          <el-table-column v-if="detail.StuffType == stuffType.Stone" :key="11" prop="StoneClassTypeEv" label="石类"></el-table-column>
          <el-table-column v-if="detail.StuffType == stuffType.Stone" :key="12" prop="StonePackageNo" label="包号/石号"></el-table-column>
          <el-table-column v-if="detail.StuffType == stuffType.Part" :key="13" prop="PartTypeEv" label="配件名称"></el-table-column>
          <el-table-column prop="ShelfName" label="盘点位置" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Quantity1" label="账面库存">
            <template slot-scope="scope">
              {{scope.row.Quantity1}}/{{$root.toFloat(scope.row.Weight1,3)}}{{detail.StuffType == stuffType.Stone?'ct':'g'}}
            </template>
          </el-table-column>
          <el-table-column prop="Quantity2" label="盘点">
            <template slot-scope="scope">
              {{scope.row.Quantity2}}/{{$root.toFloat(scope.row.Weight2,3)}}{{detail.StuffType == stuffType.Stone?'ct':'g'}}
            </template>
          </el-table-column>
          <el-table-column prop="Quantity3" label="盘亏">
            <template slot-scope="scope">
              {{scope.row.Quantity3}}/{{$root.toFloat(scope.row.Weight3,3)}}{{detail.StuffType == stuffType.Stone?'ct':'g'}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- Pagination -->
    <pagination :pg="lossLogs.pg" :size="lossLogs.size" :total="lossLogs.total" @currentChange="lossPageChange" @sizeChange="lossPageSizeChange"></pagination>
    <!-- Pagination-End -->
    <div class="panel">
      <div class="panel-hd"><span class="title">盘盈货品：{{detail.Quantity4}}/{{$root.toFloat(detail.Weight4, 3)}}{{detail.StuffType == stuffType.Stone?'ct':'g'}}</span></div>
      <div class="panel-bd no-padding">
        <el-table :data="overLogs.data" v-loading="overLoading" element-loading-text="拼命加载中">
          <el-table-column v-if="detail.StuffType == stuffType.Gold" :key="20" prop="GoldType" label="成色">
            <template slot-scope="scope">
              {{$store.getters.goldType.Types[scope.row.GoldType]}}
            </template>
          </el-table-column>
          <el-table-column v-if="detail.StuffType == stuffType.Stone" :key="21" prop="StoneClassTypeEv" label="石类"></el-table-column>
          <el-table-column v-if="detail.StuffType == stuffType.Stone" :key="22" prop="StonePackageNo" label="包号/石号"></el-table-column>
          <el-table-column v-if="detail.StuffType == stuffType.Part" :key="23" prop="PartTypeEv" label="配件名称"></el-table-column>
          <el-table-column prop="ShelfName" label="盘点位置" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Quantity1" label="账面库存">
            <template slot-scope="scope">
              {{scope.row.Quantity1}}/{{$root.toFloat(scope.row.Weight1,3)}}{{detail.StuffType == stuffType.Stone?'ct':'g'}}
            </template>
          </el-table-column>
          <el-table-column prop="Quantity2" label="盘点">
            <template slot-scope="scope">
              {{scope.row.Quantity2}}/{{$root.toFloat(scope.row.Weight2,3)}}{{detail.StuffType == stuffType.Stone?'ct':'g'}}
            </template>
          </el-table-column>
          <el-table-column prop="Quantity4" label="盘盈">
            <template slot-scope="scope">
              {{scope.row.Quantity4}}/{{$root.toFloat(scope.row.Weight4,3)}}{{detail.StuffType == stuffType.Stone?'ct':'g'}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- Pagination -->
    <pagination :pg="overLogs.pg" :size="overLogs.size" :total="overLogs.total" @currentChange="overPageChange" @sizeChange="overPageSizeChange"></pagination>
    <!-- Pagination-End -->
  </el-dialog>
  <!-- End 盘点报告 -->
</template>

<script>
import {
  STOCKING_API_STUFF_COUNT_ORDER_BASIC_GET,
  STOCKING_API_STUFF_COUNT_ORDER_ITEM_FINISHLOSSGETS,
  STOCKING_API_STUFF_COUNT_ORDER_ITEM_FINISHOVERGETS
} from '@/apis/stocking.js'
import {
  StuffType,
  YNStatus
} from '@/enums/common.js'
import {
  StuffCountReportBasicReportType 
} from '@/enums/stocking.js'

import pagination from '@/components/pagination.vue'

export default {
  // props: ['takingLogVisible', 'takingData'],
  props: {
    takingLogVisible: {
      default: false,
      type: Boolean
    },
    takingData: {
      default() {
        return {}
      },
      type: Object
    }
  },
  data() {
    return {
      YNStatus,
      stuffType: StuffType,
      stuffCountReportBasicReportType: StuffCountReportBasicReportType,
      visible: this.takingLogVisible,
      detail: this.takingData,
      generlogs: {
        pg: 1,
        size: 10,
        total: 0,
        data: [],
      },
      lossLogs: {
        pg: 1,
        size: 10,
        total: 0,
        data: [],
      },
      overLogs: {
        pg: 1,
        size: 10,
        total: 0,
        data: [],
      },
      generLoading: false,
      lossLoading: false,
      overLoading: false,
    }
  },
  methods: {
    getGenerLogs() {
      this.generLoading = true
      STOCKING_API_STUFF_COUNT_ORDER_BASIC_GET({
        CountId: this.detail.CountId,
      }).then((res) => {
        this.generLoading = false
        if (res.data.Code === 'CORRECT') {
          this.generlogs.data = res.data.Data
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
        PageSize: this.lossLogs.size,
      }).then((res) => {
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
        PageSize: this.overLogs.size,
      }).then((res) => {
        this.overLoading = false
        if (res.data.Code === 'CORRECT') {
          this.overLogs.data = res.data.Data.Rows || []
          this.overLogs.total = res.data.Data.Count || 0
        }
      })
    },
    generPageChange(val) {
      this.generLogs.pg = val
      this.getGenerLogs()
    },
    generPageSizeChange(val) {
      this.generLogs.pg = 1
      this.generLogs.size = val
      this.getGenerLogs()
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
  },
  beforeMount() {
    // this.getGenerLogs()
    this.getLossLogs()
    this.getOverLogs()
  },
  watch: {
    visible() {
      this.$emit('listenLogDialog', false)
    },
  },
  components: {
    pagination,
  },
}
</script>
<style lang="scss" scoped>
.panel {
  margin-top: 0;
}
.noData {
  height: 60px;
  line-height: 60px;
  color: #909399;
}
.info-table-th,
.info-taking-tr {
  display: flex;
  justify-content: space-around;
  span {
    display: block;
    flex: 1;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-top: 1px solid #ebeef5;
    & + span {
      border-left: 1px solid #ebeef5;
    }
  }
}
.info-table-th span {
  border-top: none;
}
.taking-log-box{
  .panel{
    border-bottom: none
  }
  .panel-hd{
    border-bottom: none
  }
}
.no-boder-t{
  border-top: none!important;
}
</style>

