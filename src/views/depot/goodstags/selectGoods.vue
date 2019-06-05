<template>
  <el-dialog title="选择货品" width="900px" :visible.sync="visible" custom-class="select-dialog">
    <el-form :model="queryForm">
      <el-row :gutter="2">
        <el-col :span="3">
          <el-form-item>
            <el-select name="StockCompareType" v-model="queryForm.StockCompareType" placeholder="所有库存" filterable>
              <el-option label="所有库存" :value="0"></el-option>
              <el-option v-for="(item,index) in stockCompareTypes.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-select name="FinanceType" v-model="queryForm.FinanceType" placeholder="所有类别" :filterable="true">
              <el-option label="所有类别" :value="0"></el-option>
              <el-option v-for="(item,index) in financeTypes.Types" :key="index" :label="item" :value="index">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-select name="MaterialType" v-model="queryForm.MaterialType" placeholder="所有材质" filterable>
              <el-option label="所有材质" :value="0"></el-option>
              <el-option v-for="(item,index) in $store.getters.materialType.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-select name="CategoryType" v-model="queryForm.CategoryType" placeholder="所有品类" filterable>
              <el-option label="所有品类" :value="0"></el-option>
              <el-option v-for="(item,index) in $store.getters.categoryType.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-select name="GoldType" v-model="queryForm.GoldType" placeholder="所有成色" filterable>
              <el-option label="所有成色" :value="0"></el-option>
              <el-option v-for="(item,index) in $store.getters.goldType.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-select name="GoodsType" v-model="queryForm.GoodsType" placeholder="所有类型" filterable>
              <el-option label="所有类型" :value="0"></el-option>
              <el-option v-for="(item,index) in goodsTypes.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item>
            <el-input name="code" v-model="code" placeholder="条码" type="text" @change="search"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-table :data="data" @row-click="selectChange" highlight-current-row>
        <el-table-column prop="StoreBarCode" label="条码" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="StoreStyleNumber" label="款号" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="GoodsName" label="货品名称" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="FinanceType" label="货品类别" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">
            {{financeTypes.Types[scope.row.FinanceType]}}
          </template>
        </el-table-column>
        <el-table-column prop="Weight" label="货重" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="FinanceQty" label="账面库存" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="AvailableQty" label="可用库存" min-width="80" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- @module 分页组件 -->
      <pagination :pg="pg" :size="size" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      <!-- End 分页组件 -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!-- <el-checkbox name="checked" v-if="!showChecked" class="fl" v-model="checked">带入可用库存</el-checkbox> -->
      <!-- <el-button name="addGoods" type="primary" @click="addGoods(false)" :loading="$store.getters.is_loading">添加</el-button> -->
      <el-button name="addGoodsAndClose" type="primary" @click="addGoods(true)" :loading="$store.getters.is_loading">添加并关闭</el-button>
      <el-button name="justClose" @click="visible =  false">关闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  StockCompareType, GoodsType, FinanceType 
} from '@/enums/merchant.js'
import {
  STOCKING_API_GOODS_SEARCH 
} from '@/apis/stocking.js'

import pagination from '@/components/pagination'
export default {
  props: ['dialogSelectGoodsVisible', 'stockType', 'deskId', 'showChecked'],
  data() {
    return {
      stockCompareTypes: StockCompareType,
      goodsTypes: GoodsType,
      financeTypes: FinanceType,
      visible: this.dialogSelectGoodsVisible,
      queryForm: {
        StockCompareType: 0,
        MaterialType: 0,
        FinanceType: 0,
        CategoryType: 0,
        GoldType: 0,
        GoodsType: 0
      },
      code: '',
      data: [],
      total: 0,
      pg: 1,
      size: 10,
      selectData: [],
      close: false,
      goodsTimer: '',
      checked: false
    }
  },
  methods: {
    getData() {
      STOCKING_API_GOODS_SEARCH({
        MaterialType: this.queryForm.MaterialType,
        CategoryType: this.queryForm.CategoryType,
        FinanceType: this.queryForm.FinanceType,
        GoldType: this.queryForm.GoldType,
        GoodsType: this.queryForm.GoodsType,
        Keywords: this.code,
        DeskId: this.deskId,
        StockType: this.stockType,
        StockCompareType: this.queryForm.StockCompareType,
        PageIndex: this.pg,
        PageSize: this.size
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows || []
          this.total = res.data.Data.total || 0
        }
      })
    },
    search() {
      this.pg = 1
      this.getData()
    },
    addGoods(flag) {
      if (!this.selectData) {
        this.$message('请选择添加的货品', 'error')
      } else {
        this.$emit('listenAddGoods', this.selectData)
        if (flag) {
          this.visible = false
        } else {
          this.$store.commit('SET_BTN_LOADING', true)
        }
      }
    },
    currentChange(val) {
      this.pg = val
      this.getData()
    },
    sizeChange(val) {
      this.pg = 1
      this.size = val
      this.getData()
    },
    selectChange(selection) {
      this.selectData = selection
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
      this.$store.dispatch('GET_PAYMENT_TYPE')
      this.$store.dispatch('GET_SERIES_TYPE')
    }
  },
  beforeMount() {
    this.getStoreAllType()
    this.queryForm.StockCompareType = this.stockCompareTypes.AvailableQtyThanZero
  },
  watch: {
    visible() {
      this.$emit('listenSelectGoods', false)
    },
    queryForm: {
      handler: 'search',
      deep: true
    }
  },
  components: {
    pagination
  }
}
</script>
<style lang="scss" scoped>
.el-table {
  border-left: 1px solid #ebeef5;
}
.pagination {
  margin-bottom: 0;
  padding: 0;
}
</style>
