<template>
  <!-- @module 盘点报告 -->
  <el-dialog title="盘点报告" :visible="visible" @update:visible="$emit('update:visible', $event)" class="get-return-log-dialog" width="800px">
    <div class="m-b-10">
      <div>
        <span class="title">盘点概况</span>
      </div>
      <div v-loading="detailLoading">
        <div class="info-table-taking" v-if="detail.Quantity1">
          <div class="info-table-th">
            <span class="flex1"></span>
            <span class="flex1">应盘</span>
            <span class="flex1">实盘</span>
            <span class="flex1">盘亏</span>
            <span class="flex1">盘盈</span>
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
            <span class="flex1">{{$root.toFloat(detail.Weight1,3)}}g</span>
            <span class="flex1">{{$root.toFloat(detail.Weight2,3)}}g</span>
            <span class="flex1">{{$root.toFloat(detail.Weight3,3)}}g</span>
            <span class="flex1">{{$root.toFloat(detail.Weight4,3)}}g</span>
          </div>
        </div>
        <div v-else class="noData">暂无数据</div>
      </div>
    </div>
    <div class="m-b-10">
      <div>
        <span class="title">盘亏货品:{{`${detail.Quantity3||0}/${$root.toFloat(detail.Weight3,3)}`}}g</span>
      </div>
      <el-table :data="lossData" v-loading="lossLoading" element-loading-text="拼命加载中">
        <el-table-column prop="HalfName" label="半成品名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ShelfName" label="位置" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Quantity1" label="账面库存" :formatter="formatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Quantity2" label="盘点" :formatter="formatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Quantity3" label="盘亏" :formatter="formatter" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- Pagination -->
      <pagination :pg="lossLogs.PageIndex" :size="lossLogs.PageSize" :total="lossTotal" @currentChange="lossCurrentChange" @sizeChange="lossSizeChange"></pagination>
    </div>
    <div>
      <div>
        <span class="title">盘盈货品：{{`${detail.Quantity4||0}/${$root.toFloat(detail.Weight4,3)}`}}g</span>
      </div>
      <el-table :data="overData" v-loading="overLoading" element-loading-text="拼命加载中">
        <el-table-column prop="HalfName" label="半成品名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ShelfName" label="位置" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Quantity1" label="账面库存" :formatter="formatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Quantity2" label="盘点" :formatter="formatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Quantity4" label="盘盈" :formatter="formatter" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- Pagination -->
      <pagination :pg="overLogs.PageIndex" :size="overLogs.PageSize" :total="overTotal" @currentChange="overCurrentChange" @sizeChange="overSizeChange"></pagination>
    </div>
  </el-dialog>
  <!-- End 盘点报告 -->
</template>

<script>
import { YNStatus } from '@/enums/common'
import {
  STOCKING_API_HALF_COUNT_ORDER_BASIC_GET,
  STOCKING_API_HALF_COUNT_ORDER_ITEM_FINISHLOSSGETS,
  STOCKING_API_HALF_COUNT_ORDER_ITEM_FINISHOVERGETS
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    countId: [Number, String]
  },
  data() {
    return {
      detail: {},
      detailLoading: false,
      lossData: [],
      lossTotal: 0,
      lossLogs: {
        CountId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 10
      },
      overData: [],
      overTotal: 0,
      overLogs: {
        CountId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 10
      },
      lossLoading: false,
      overLoading: false
    }
  },
  methods: {
    getDetail() {
      this.detailLoading = true
      STOCKING_API_HALF_COUNT_ORDER_BASIC_GET({ CountId: this.countId }).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.detail = res.data.Data
          }
          this.detailLoading = false
        }
      )
    },
    getLossLogs() {
      this.lossLoading = true
      this.lossLogs.CountId = this.countId
      STOCKING_API_HALF_COUNT_ORDER_ITEM_FINISHLOSSGETS(this.lossLogs).then(
        res => {
          this.lossLoading = false
          if (res.data.Code === 'CORRECT') {
            this.lossData = res.data.Data.Rows
            this.lossTotal = res.data.Data.Count
          }
        }
      )
    },
    getOverLogs() {
      this.overLoading = true
      this.overLogs.CountId = this.countId
      STOCKING_API_HALF_COUNT_ORDER_ITEM_FINISHOVERGETS(this.overLogs).then(
        res => {
          this.overLoading = false
          if (res.data.Code === 'CORRECT') {
            this.overData = res.data.Data.Rows
            this.overTotal = res.data.Data.Count
          }
        }
      )
    },

    lossCurrentChange(val) {
      this.lossLogs.PageIndex = val
      this.getLossLogs()
    },
    lossSizeChange(val) {
      this.lossLogs.PageIndex = 1
      this.lossLogs.PageSize = val
      this.getLossLogs()
    },
    overCurrentChange(val) {
      this.overLogs.PageIndex = val
      this.getOverLogs()
    },
    overSizeChange(val) {
      this.overLogs.PageIndex = 1
      this.overLogs.PageSize = val
      this.getOverLogs()
    },
    formatter(row, column, val) {
      switch (column.property) {
        case 'Quantity1':
        case 'Quantity2':
        case 'Quantity3':
        case 'Quantity4':
          return `${val}/${this.$root.toFloat(row['Weight' + column.property.slice(-1)], 3)}g`
        default:
          break
      }
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.getLossLogs()
        this.getOverLogs()
        this.getDetail()
      }
    }
  },
  components: {
    pagination
  }
}
</script>
<style lang="scss" scoped>
.title {
  color: #333;
  font-weight: bold;
  line-height: 32px;
}
.noData {
  height: 60px;
  line-height: 60px;
  color: #909399;
  text-align: center;
}
.info-table-taking {
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
}
.info-table-th {
  background-color: #f5f5f5;
}
.info-table-th,
.info-taking-tr {
  display: flex;
  justify-content: space-around;
  span {
    display: block;
    flex: 1;
    height: 32px;
    line-height: 32px;
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
</style>

