<template>
  <!-- @module 修正实盘数量 -->
  <el-dialog title="修正实盘数量" :visible="visible" @update:visible="$emit('update:visible', $event)" class="get-return-log-dialog taking-change" width="800px">
    <el-row class="tl">
      <p class="m-b-10">因为在盘点的过程中货品出入库，可能造成货品盘点时漏盘或错盘，所以提供修正数据的功能。</p>
      <p class="m-b-10">以下货品在盘点的过程中有销售、退货、调拨等出入库的操作，并且实盘数量与应盘不一致。</p>
      <p class="m-b-10">请勾选需要修正实盘数量的条码，修正后实盘数量与应盘一致。</p>
    </el-row>
    <div class="m-b-10">
      <!-- <div class="panel-hd"><span class="title">一码一货</span></div> -->

      <div class="title">一码一货</div>
      <el-table :data="singleData" @selection-change="singleSelectChange" v-loading="singleLoading" element-loading-text="拼命加载中">
        <el-table-column type="selection" min-width="55"></el-table-column>
        <el-table-column prop="BarCode" label="条码" sortable="custom" min-wdith="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="StyleCode" label="款号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoodsName" label="货品名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="FinanceQty" label="账面库存" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Quantity2" label="盘点数量" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ChangeStockQty" label="盘点期间库存变化" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.ChangeStockQty > 0 ? '+'+ scope.row.ChangeStockQty : scope.row.ChangeStockQty}}</template>
        </el-table-column>
      </el-table>
      <!-- Pagination -->
      <pagination :pg="single.PageIndex" :size="single.PageSize" :total="singleTotal" @currentChange="singlePageChange" @sizeChange="singlePageSizeChange"></pagination>
    </div>
    <div>
      <div class="title">一码多货</div>
      <el-table :data="multiData" @selection-change="multiSelectChange" v-loading="multiLoading" element-loading-text="拼命加载中">
        <el-table-column type="selection" min-width="55"></el-table-column>
        <el-table-column prop="BarCode" label="条码" sortable="custom" min-wdith="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="StyleCode" label="款号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoodsName" label="货品名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="FinanceQty" label="账面库存" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Quantity2" label="盘点数量" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ChangeStockQty" label="盘点期间库存变化" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.ChangeStockQty > 0 ? '+'+ scope.row.ChangeStockQty : scope.row.ChangeStockQty}}</template>
        </el-table-column>
      </el-table>
      <!-- Pagination -->
      <pagination :pg="multi.PageIndex" :size="multi.PageSize" :total="multiTotal" @currentChange="multiPageChange" @sizeChange="multiPageSizeChange"></pagination>
    </div>
    <div class="p-10 red tl">注：请确认库存中数量无误再修正。请在所有货品都盘点后再修正，避免修正后重复盘点。</div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="$store.getters.is_loading" @click="amendTaking" name="btnAmendTaking">修正实盘数量</el-button>
      <el-button @click="$emit('update:visible', false)" name="btnClose">关闭</el-button>
    </div>
  </el-dialog>
  <!-- End 修正实盘数量 -->
</template>

<script>
import { YNStatus } from '@/enums/common.js'
import { GoodsType } from '@/enums/stocking.js'
import {
  STOCKING_API_GOODS_COUNT_ORDER_ITEM_DIFFQTYLIST,
  STOCKING_API_GOODS_COUNT_ORDER_ITEM_SAVEDIFFQTY
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
export default {
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
  data() {
    return {
      YNStatus,
      GoodsType,
      single: {
        CountId: '',
        DelfId: '',
        GoodsType: GoodsType.Single,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 10
      },
      multi: {
        CountId: '',
        DelfId: '',
        GoodsType: GoodsType.Multi,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 10
      },
      singleData: [],
      singleTotal: 0,
      multiData: [],
      multiTotal: 0,
      singleLoading: false,
      multiLoading: false,
      singleSelections: [],
      multiSelections: []
    }
  },
  methods: {
    amendTaking() {
      let items = []
      if (!this.singleSelections.length && !this.multiSelections.length) {
        this.$message.error('请勾选需要修正实盘数量的条码')
        return false
      }
      this.singleSelections.forEach(item => {
        items.push(item.ItemId)
      })
      this.multiSelections.forEach(item => {
        items.push(item.ItemId)
      })
      this.$store.commit('SET_BTN_LOADING', true) // table loading
      STOCKING_API_GOODS_COUNT_ORDER_ITEM_SAVEDIFFQTY({
        CountId: this.countId,
        Items: items
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false) // table loading
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
            type: 'success'
          })
          this.$emit('update:visible', false)
          this.$emit('listenTakingAmend')
        }
      })
    },
    getSingle() {
      this.singleSelections = []
      this.singleLoading = true
      STOCKING_API_GOODS_COUNT_ORDER_ITEM_DIFFQTYLIST(this.single).then(res => {
        this.singleLoading = false
        if (res.data.Code === 'CORRECT') {
          this.singleData = res.data.Data.Rows
          this.singleTotal = res.data.Data.Count
        }
      })
    },
    getMulti() {
      this.multiSelections = []
      this.multiLoading = true
      STOCKING_API_GOODS_COUNT_ORDER_ITEM_DIFFQTYLIST(this.multi).then(res => {
        this.multiLoading = false
        if (res.data.Code === 'CORRECT') {
          this.multiData = res.data.Data.Rows
          this.multiTotal = res.data.Data.Count
        }
      })
    },

    singlePageChange(val) {
      this.single.PageIndex = val
      this.getSingle()
    },
    singlePageSizeChange(val) {
      this.single.PageIndex = 1
      this.single.PageSize = val
      this.getSingle()
    },
    multiPageChange(val) {
      this.multi.PageIndex = val
      this.getMulti()
    },
    multiPageSizeChange(val) {
      this.multi.PageIndex = 1
      this.multi.PageSize = val
      this.getMulti()
    },
    multiSelectChange(value) {
      this.multiSelections = value
    },
    singleSelectChange(value) {
      this.singleSelections = value
    }
  },
  beforeMount() { },
  watch: {
    visible(val) {
      if (val) {
        this.single.PageIndex = 1
        this.single.CountId = this.countId || 0
        this.single.DelfId = this.delfId || 0
        this.multi.CountId = this.countId || 0
        this.multi.DelfId = this.delfId || 0
        this.multi.PageIndex = 1
        this.getSingle()
        this.getMulti()
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
</style>

