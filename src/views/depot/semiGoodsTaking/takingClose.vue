<template>
  <!-- @module 结束盘点 -->
  <el-dialog title="结束盘点" :visible="visible" @update:visible="$emit('update:visible', $event)" class="get-return-log-dialog" width="800px">
    <div class="handle-box">
      <div class="left">
        <i class="icon el-icon-info"></i>
      </div>
      <div class="info">
        <div class="tl">
          <p class="m-b-10">结束后盘亏的货品自动生成报损单，盘盈的货品自动生成报溢单。</p>
          <p class="m-b-10">本次盘点盘亏{{`${detail.Quantity3}/${$root.toFloat(detail.Weight3, 3)}`}}g，盘盈{{`${detail.Quantity4}/${$root.toFloat(detail.Weight4, 3)}`}}，确定结束？</p>
        </div>
        <div>
          <el-button type="primary" :loading="$store.getters.is_loading" @click="takingClose" name="btnTakingClose">确定</el-button>
          <el-button @click="$emit('update:visible', false)" :disabled="$store.getters.is_loading" name="btnCancel">取消</el-button>
        </div>
      </div>
    </div>
    <div>
      <div>
        <span class="title">盘亏货品:{{`${detail.Quantity3}/${$root.toFloat(detail.Weight3,3)}`}}g</span>
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
        <span class="title">盘盈货品：{{`${detail.Quantity4}/${$root.toFloat(detail.Weight4,3)}`}}g</span>
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
  <!-- End 结束盘点 -->
</template>

<script>
import { YNStatus } from '@/enums/common'
import {
  STOCKING_API_HALF_COUNT_ORDER_BASIC_GET,
  STOCKING_API_HALF_COUNT_ORDER_ITEM_FINISHLOSSGETS,
  STOCKING_API_HALF_COUNT_ORDER_ITEM_FINISHOVERGETS,
  STOCKING_API_HALF_COUNT_ORDER_BASIC_FINISH
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'

export default {
  // props: ['takingCloseVisible', 'countId'],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    countId: [String, Number]
  },
  data() {
    return {
      detail: {},
      detailLoading: false,
      lossData: [],
      lossTotal: 0,
      lossLogs: {
        CountId: this.countId,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 10
      },
      overData: [],
      overTotal: 0,
      overLogs: {
        CountId: this.countId,
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
    takingClose() {
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_HALF_COUNT_ORDER_BASIC_FINISH({ CountId: parseInt(this.countId) }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success(res.data.Message)
          this.$emit('update:visible', false)
          this.$router.push('/depot/semitaking/index')
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
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
.handle-box {
  display: flex;
  align-items: stretch;
  .left {
    margin-right: 20px;
    padding: 0 20px;
    border: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    .el-icon-info {
      font-size: 50px;
      color: #f7ba2a;
    }
  }
}
.title {
  color: #333;
  font-weight: bold;
  line-height: 32px;
}
</style>

