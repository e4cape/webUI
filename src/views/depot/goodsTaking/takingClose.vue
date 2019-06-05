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
          <p class="m-b-10">本次盘点盘亏{{data.Quantity3}}，盘盈{{data.Quantity4}}，确定结束？</p>
        </div>
        <div>
          <el-button type="primary" :loading="$store.getters.is_loading" @click="takingClose" name="btnTakingClose">确定</el-button>
          <el-button @click="$emit('update:visible', false)" :disabled="$store.getters.is_loading" name="btnCancel">取消</el-button>
        </div>
      </div>
    </div>
    <div>
      <div>
        <span class="title">盘亏货品：{{data.Quantity3}}</span>
      </div>
      <div class="panel-bd no-padding">
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
    </div>
    <div class="m-t-10">
      <div>
        <span class="title">盘盈货品：{{data.Quantity4}}</span>
      </div>
      <div>
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
    </div>
  </el-dialog>
  <!-- End 结束盘点 -->
</template>

<script> 
import { CharacterType } from '@/enums/common'
import {
  STOCKING_API_GOODS_COUNT_ORDER_BASIC_FINISH,
  STOCKING_API_GOODS_COUNT_ORDER_ITEM_FINISHLOSSGETS,
  STOCKING_API_GOODS_COUNT_ORDER_ITEM_FINISHOVERGETS
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'

export default {
  // props: ['takingCloseVisible', 'countId', 'lossQty', 'overQty', 'delfId'],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    countId: {
      type: Number,
      default: 0
    },
    delfId: {
      type: Number,
      default: 0
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
        DelfId: '',
        PageIndex: 1,
        PageSize: 10
      },
      overData: [],
      overTotal: 0,
      overLogs: {
        CountId: '',
        DelfId: '',
        PageIndex: 1,
        PageSize: 10
      },
      lossLoading: false,
      overLoading: false,
    }
  },
  methods: {
    takingClose() {
      this.$store.commit('SET_BTN_LOADING', true) // table loading
      STOCKING_API_GOODS_COUNT_ORDER_BASIC_FINISH({
        CountId: this.countId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
            type: 'success'
          })
          this.$emit('update:visible', false)
          this.$emit('listenTakingClose')
        }
        this.$store.commit('SET_BTN_LOADING', false) // table loading
      })
    },
    getLossLogs() {
      this.lossLoading = true
      STOCKING_API_GOODS_COUNT_ORDER_ITEM_FINISHLOSSGETS(this.lossLogs).then(res => {
        this.lossLoading = false
        if (res.data.Code === 'CORRECT') {
          this.lossData = res.data.Data.Rows || []
          this.lossTotal = res.data.Data.Count
        }
      })
    },
    getOverLogs() {
      this.overLoading = true
      STOCKING_API_GOODS_COUNT_ORDER_ITEM_FINISHOVERGETS(this.overLogs).then(res => {
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
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.overLogs.PageIndex = 1
        this.overLogs.CountId = this.countId
        this.overLogs.DelfId = this.delfId
        this.lossLogs.PageIndex = 1
        this.lossLogs.CountId = this.countId
        this.lossLogs.DelfId = this.delfId
        this.getOverLogs()
        this.getLossLogs()
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

