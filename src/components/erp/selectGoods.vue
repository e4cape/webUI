<template>
  <el-dialog title="选择货品" width="1000px" :visible="visible" @update:visible="$emit('update:visible', $event)" custom-class="select-dialog" @close="resetForm">
    <el-form :model="queryForm">
      <el-row :gutter="2">
        <el-col :span="3">
          <el-form-item>
            <el-select v-model="queryForm.StockCompareType" @change="search" filterable name="stockCompareType">
              <el-option label="所有库存" :value="0"></el-option>
              <el-option v-for="(item,index) in StockCompareType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-select v-model="queryForm.FinanceType" @change="search" :filterable="true" name="financeType">
              <el-option label="所有类别" :value="0"></el-option>
              <el-option v-for="(item,index) in FinanceType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-select v-model="queryForm.MaterialType" @change="search" filterable name="materialType">
              <el-option label="所有材质" :value="0"></el-option>
              <el-option v-for="(item,index) in $store.getters.materialType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-select v-model="queryForm.CategoryType" @change="search" filterable name="categoryType">
              <el-option label="所有品类" :value="0"></el-option>
              <el-option v-for="(item,index) in $store.getters.categoryType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-select v-model="queryForm.GoldType" @change="search" filterable name="goldType">
              <el-option label="所有成色" :value="0"></el-option>
              <el-option v-for="(item,index) in $store.getters.goldType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-select v-model="queryForm.GoodsType" @change="search" filterable name="goodsType">
              <el-option label="所有类型" :value="0"></el-option>
              <el-option v-for="(item,index) in GoodsType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item>
            <el-input v-model="queryForm.BarCode" placeholder="条码" type="text" prefix-icon="el-icon-search" @keydown.enter.native="search" :maxlength="50" name="BarCode"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="data" @selection-change="selectChange" v-loading="$store.getters.tb_loading" @row-click="toggleSelection" ref="selectGoods" element-loading-text="拼命加载中">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="BarCode" label="条码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="StyleCode" label="款号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoodsName" label="货品名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="FinanceType" label="货品类别" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Weight" label="货重" :formatter="formatter"></el-table-column>
      <el-table-column prop="GoldWeight" label="净金重" :formatter="formatter"></el-table-column>
      <el-table-column prop="FinanceQty" label="账面库存"></el-table-column>
      <el-table-column prop="AvailableQty" label="可用库存"></el-table-column>
    </el-table>
    <!-- @module 分页组件 -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- End 分页组件 -->
    <div slot="footer" class="dialog-footer">
      <el-checkbox class="fl" v-model="checked" name="checked" v-if="isAvailable">带入可用库存</el-checkbox>
      <el-button type="primary" @click="addGoods(false)" :loading="$store.getters.is_loading" name="btnAddGoods">添加</el-button>
      <el-button type="primary" @click="addGoods(true)" :loading="$store.getters.is_loading" name="btnAddGoodsAndClose">添加并关闭</el-button>
      <el-button @click="$emit('update:visible', false)" name="btnClose">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { CharacterType } from '@/enums/common.js'
import { StockCompareType, FinanceType, GoodsType } from '@/enums/stocking.js'
import {
  STOCKING_API_GOODS_STOCK_SHELF_REQS,
  STOCKING_API_GOODS_STOCK_DESK_REQS
} from '@/apis/stocking.js'
import pagination from '@/components/pagination'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    warehouseId: {
      type: Number,
      default: 0
    },
    shelfId: {
      type: Number,
      default: 0
    },
    deskId: {
      type: Number,
      default: 0
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      StockCompareType,
      FinanceType,
      GoodsType,
      queryForm: {
        StockCompareType: StockCompareType.AvailableQtyThanZero,
        MaterialType: 0,
        FinanceType: 0,
        CategoryType: 0,
        GoldType: 0,
        GoodsType: 0,
        WarehouseId: 0,
        ShelfId: 0,
        DeskId: 0,
        BarCode: '',
        IsAsced: 1,
        OrderBy: 0,
        PageIndex: 1,
        PageSize: 10
      },
      params: {},
      data: [],
      total: 0,
      selectData: [],
      close: false,
      checked: true
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  methods: {
    resetForm() { // 初始化弹窗
      this.checked = true
      this.queryForm = {
        StockCompareType: StockCompareType.AvailableQtyThanZero,
        MaterialType: 0,
        FinanceType: 0,
        CategoryType: 0,
        GoldType: 0,
        GoodsType: 0,
        WarehouseId: 0,
        ShelfId: 0,
        DeskId: 0,
        BarCode: '',
        IsAsced: 1,
        OrderBy: 0,
        PageIndex: 1,
        PageSize: 10
      }
    },
    formatter(row, column, val) {
      switch (column.property) {
        case 'FinanceType':
          return FinanceType.Types[val]
        default:
          return this.$root.toFloat(val, 3)
      }
    },
    addGoods(flag) {
      if (!this.selectData.length) {
        this.$message.warning('请选择添加的货品')
      } else {
        this.$store.commit('SET_BTN_LOADING', true)
        let result = []
        this.selectData.forEach(item => {
          if (this.checked) {
            result.push({
              BarCode: item.BarCode,
              Quantity: item.AvailableQty
            })
          } else {
            result.push({
              BarCode: item.BarCode,
              Quantity: 1
            })
          }
        })
        this.$refs.selectGoods.clearSelection()
        this.$emit('listenAddGoods', result)
        if (flag) {
          this.$emit('update:visible', false)
        }
      }
      this.$store.commit('SET_BTN_LOADING', false)
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let api
      if (this.characterType === CharacterType.Company) {
        this.params.DeskId = 0
        api = STOCKING_API_GOODS_STOCK_SHELF_REQS
      } else {
        this.params.WarehouseId = 0
        this.params.ShelfId = 0
        api = STOCKING_API_GOODS_STOCK_DESK_REQS
      }
      this.queryForm = {...this.params}
      api(this.params).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    search() {
      this.queryForm.PageIndex = 1
      this.params = {...this.queryForm}
      this.getData()
    },
    currentChange(val) {
      this.params.PageIndex = val
      this.getData()
    },
    sizeChange(val) {
      this.params.PageIndex = 1
      this.params.PageSize = val
      this.getData()
    },
    selectChange(selection) {
      this.selectData = selection
    },
    toggleSelection(row) {
      this.$refs.selectGoods.toggleRowSelection(row)
    },
    getStoreAllType() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
    }
  },
  beforeMount() {
    this.getStoreAllType()

  },
  watch: {
    visible(val) {
      if (val) {
        this.queryForm.WarehouseId = this.warehouseId
        this.queryForm.ShelfId = this.shelfId
        this.queryForm.DeskId = this.deskId
        
        this.search()
      }
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
