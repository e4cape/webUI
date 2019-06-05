<template>
  <!-- @module 盘点报告 -->
  <el-dialog title="盘点报告" :visible="visible" @update:visible="$emit('update:visible', $event)" class="get-return-log-dialog" width="800px">
    <div class="m-b-10">
      <div>
        <span class="title">盘点概况</span>
      </div>
      <div>
        <div class="info-table-taking">
          <div class="info-table-th">
            <span class="flex1"></span>
            <span class="flex1">应盘</span>
            <span class="flex1">实盘</span>
            <span class="flex1">盘亏</span>
            <span class="flex1">盘盈</span>
          </div>
          <div class="info-taking-tr">
            <span class="flex1">数量</span>
            <span class="flex1">{{data.Quantity1}}</span>
            <span class="flex1">{{data.Quantity2}}</span>
            <span class="flex1">{{data.Quantity3}}</span>
            <span class="flex1">{{data.Quantity4}}</span>
          </div>
          <div class="info-taking-tr">
            <span class="flex1">金重</span>
            <span class="flex1">{{$root.toFloat(data.GoldWeight1,3)}}g</span>
            <span class="flex1">{{$root.toFloat(data.GoldWeight2,3)}}g</span>
            <span class="flex1">{{$root.toFloat(data.GoldWeight3,3)}}g</span>
            <span class="flex1">{{$root.toFloat(data.GoldWeight4,3)}}g</span>
          </div>
          <div class="info-taking-tr">
            <span class="flex1">标签价</span>
            <span class="flex1">￥{{$root.toFloat(data.LabelPrice1)}}</span>
            <span class="flex1">￥{{$root.toFloat(data.LabelPrice2)}}</span>
            <span class="flex1">￥{{$root.toFloat(data.LabelPrice3)}}</span>
            <span class="flex1">￥{{$root.toFloat(data.LabelPrice4)}}</span>
          </div>
        </div>
        <!-- <div v-else class="noData">暂无数据</div> -->
      </div>
    </div>
    <div class="m-b-10">
      <div>
        <span class="title">盘亏货品</span>
      </div>
      <el-table :data="lossData" v-loading="lossLoading" element-loading-text="拼命加载中">
        <el-table-column prop="BarCode" label="条码" sortable="custom" show-overflow-tooltip></el-table-column>
        <el-table-column prop="StyleCode" label="款号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoodsName" label="货品名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="DeskName" label="位置" show-overflow-tooltip v-if="isStore"></el-table-column>
        <el-table-column prop="ShelfName" label="位置" show-overflow-tooltip v-else></el-table-column>
        <el-table-column prop="Quantity1" label="账面库存" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Quantity2" label="盘点数量" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Quantity3" label="盘亏数量" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- Pagination -->
      <pagination :pg="lossLogs.PageIndex" :size="lossLogs.PageSize" :total="lossTotal" @currentChange="lossPageChange" @sizeChange="lossPageSizeChange"></pagination>
    </div>
    <div>
      <div>
        <span class="title">盘盈货品</span>
      </div>
      <el-table :data="overData" v-loading="overLoading" element-loading-text="拼命加载中">
        <el-table-column prop="BarCode" label="条码" sortable="custom" show-overflow-tooltip></el-table-column>
        <el-table-column prop="StyleCode" label="款号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoodsName" label="货品名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="DeskName" label="位置" show-overflow-tooltip v-if="isStore"></el-table-column>
        <el-table-column prop="ShelfName" label="位置" show-overflow-tooltip v-else></el-table-column>
        <el-table-column prop="Quantity1" label="账面库存" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Quantity2" label="盘点数量" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Quantity4" label="盘盈数量" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- Pagination -->
      <pagination :pg="overLogs.PageIndex" :size="overLogs.PageSize" :total="overTotal" @currentChange="overPageChange" @sizeChange="overPageSizeChange"></pagination>
    </div>
  </el-dialog>
  <!-- End 盘点报告 -->
</template>

<script>
import { CharacterType } from '@/enums/common'
import {
  STOCKING_API_GOODS_COUNT_ORDER_ITEM_FINISHLOSSGETS,
  STOCKING_API_GOODS_COUNT_ORDER_ITEM_FINISHOVERGETS
} from '@/apis/stocking.js'
import { YNStatus } from '@/enums/common.js'

import pagination from '@/components/pagination.vue'

export default {
  // props: ['takingLogVisible', 'countId', 'data'],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    isStore() {
      return this.$store.getters.user_session.CharacterType === CharacterType.Store
    }
  },
  data() {
    return {
      lossData: [],
      lossTotal: 0,
      lossLogs: {
        CountId: '',
        PageIndex: 1,
        PageSize: 10,
        IsAsced: YNStatus.No,
      },
      overData: [],
      overTotal: 0,
      overLogs: {
        CountId: '',
        PageIndex: 1,
        PageSize: 10,
        IsAsced: YNStatus.No,
      },
      lossLoading: false,
      overLoading: false,
    }
  },
  methods: {
    getLossLogs() {
      this.lossLoading = true
      STOCKING_API_GOODS_COUNT_ORDER_ITEM_FINISHLOSSGETS(this.lossLogs).then((res) => {
        this.lossLoading = false
        if (res.data.Code === 'CORRECT') {
          this.lossData = res.data.Data.Rows || []
          this.lossTotal = res.data.Data.Count

        }
      })
    },
    getOverLogs() {
      this.overLoading = true
      STOCKING_API_GOODS_COUNT_ORDER_ITEM_FINISHOVERGETS(this.overLogs).then((res) => {
        this.overLoading = false
        if (res.data.Code === 'CORRECT') {
          this.overData = res.data.Data.Rows || []
          this.overTotal = res.data.Data.Count
        }
      })
    },
    lossPageChange(val) {
      this.lossLogs.PageIndex = val
      this.getLossLogs()
    },
    lossPageSizeChange(val) {
      this.lossLogs.PageIndex = 1
      this.lossLogs.PageSize = val
      this.getLossLogs()
    },
    overPageChange(val) {
      this.overLogs.PageIndex = val
      this.getOverLogs()
    },
    overPageSizeChange(val) {
      this.overLogs.PageIndex = 1
      this.overLogs.PageSize = val
      this.getOverLogs()
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.lossLogs.CountId = this.data.CountId
        this.lossLogs.PageIndex = 1
        this.lossLogs.PageSize = 10
        this.overLogs.CountId = this.data.CountId
        this.overLogs.PageIndex = 1
        this.overLogs.PageSize = 10
        this.getLossLogs()
        this.getOverLogs()
      }
    },
  },
  components: {
    pagination,
  },
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

