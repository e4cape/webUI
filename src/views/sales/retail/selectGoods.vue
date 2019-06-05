<template>
  <el-dialog title="选择货品" width="1000px" :visible="visible" @update:visible="$emit('update:visible', $event)" @close="resetForm" custom-class="select-dialog">
    <el-form :model="queryForm" ref="queryForm">
      <el-row :gutter="2">
        <el-col :span="3">
          <el-form-item prop="StockCompareType">
            <el-select v-model="queryForm.StockCompareType" @change="search" filterable name="stockCompareType">
              <el-option label="所有库存" :value="0"></el-option>
              <el-option v-for="(item,index) in StockCompareType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="FinanceType">
            <el-select v-model="queryForm.FinanceType" @change="search" :filterable="true" name="financeType">
              <el-option label="所有类别" :value="0"></el-option>
              <el-option v-for="(item,index) in FinanceType.Types" :key="index" :label="item" :value="parseInt(index)">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="MaterialType">
            <el-select v-model="queryForm.MaterialType" @change="search" filterable name="materialType">
              <el-option label="所有材质" :value="0"></el-option>
              <el-option v-for="(item,index) in $store.getters.materialType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="CategoryType">
            <el-select v-model="queryForm.CategoryType" @change="search" filterable name="categoryType">
              <el-option label="所有品类" :value="0"></el-option>
              <el-option v-for="(item,index) in $store.getters.categoryType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="GoldType">
            <el-select v-model="queryForm.GoldType" @change="search" filterable name="goldType">
              <el-option label="所有成色" :value="0"></el-option>
              <el-option v-for="(item,index) in $store.getters.goldType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item prop="GoodsType">
            <el-select v-model="queryForm.GoodsType" @change="search" filterable name="goodsType">
              <el-option label="所有类型" :value="0"></el-option>
              <el-option v-for="(item,index) in GoodsType.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item prop="BarCode">
            <el-input v-model="queryForm.BarCode" placeholder="条码" type="text" prefix-icon="el-icon-search" @keydown.enter.native="search" name='BarCode'></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="data" @selection-change="selectChange" v-loading="$store.getters.tb_loading" @row-click="toggleSelection" ref="selectGoods" element-loading-text="拼命加载中">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="DeskName" label="位置" show-overflow-tooltip></el-table-column>
      <el-table-column prop="BarCode" label="条码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="StyleCode" label="款号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoodsName" label="货品名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="FinanceType" label="货品类别" :formatter="formatter" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Weight" label="货重" :formatter="formatter"></el-table-column>
      <el-table-column prop="GoldWeight" label="净金重" :formatter="formatter"></el-table-column>
      <el-table-column prop="FinanceQty" label="账面库存"></el-table-column>
      <el-table-column prop="AvailableQty" label="可用库存"></el-table-column>
      <!-- <el-table-column prop="LastTime" label="可用库存"></el-table-column> -->
    </el-table>
    <!-- @module 分页组件 -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- End 分页组件 -->
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addGoods(false)" :loading="$store.getters.is_loading" name="btnAddGoods">添加</el-button>
      <el-button type="primary" @click="addGoods(true)" :loading="$store.getters.is_loading" name="btnAddGoodsAndClose">添加并关闭</el-button>
      <el-button @click="$emit('update:visible', false)" name="btnClose">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { StockCompareType, FinanceType, GoodsType } from '@/enums/stocking.js'
import { STOCKING_API_GOODS_STOCK_DESK_QRIES } from '@/apis/stocking.js'
import pagination from '@/components/pagination'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    barCode: {
      type: String,
      default: ''
    },
    goodsData: {
      type: Object,
      default() {
        return {
          Rows: [],
          Count: 0
        }
      }
    }
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
        BarCode: '',
        IsAsced: 1,
        OrderBy: 2,
        PageIndex: 1,
        PageSize: 10
      },
      data: [],
      total: 0,
      selectData: [],
      close: false,
      checked: false
    }
  },

  methods: {
    formatter(row, column, val) {
      switch (column.property) {
        case 'FinanceType':
          return FinanceType.Types[val]
      
        default:
          return this.$root.toFloat(val ,3)
      }
    },
    resetForm() {
      if (this.$refs.queryForm) {
        this.$refs.queryForm.resetFields()
      }

    },
    addGoods(flag) {
      if (!this.selectData.length) {
        this.$message('请选择添加的货品', 'error')
      } else {
        let result = []
        this.selectData.forEach(item => {
          if (this.checked) {
            result.push(item)
          } else {
            result.push(item)
          }
        })
        this.$emit('listenAddGoods', result)
        if (flag) {
          this.$emit('update:visible', false)
        } else {
          this.$refs.selectGoods.clearSelection()
        }
      }
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading

      STOCKING_API_GOODS_STOCK_DESK_QRIES(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    search() {
      this.queryForm.PageIndex = 1
      this.getData()
    },
    currentChange(val) {
      this.queryForm.PageIndex = val
      this.getData()
    },
    sizeChange(val) {
      this.queryForm.PageIndex = 1
      this.queryForm.PageSize = val
      this.getData()
    },
    selectChange(selection) {
      this.selectData = selection
    },
    toggleSelection(row) {
      this.$refs.selectGoods.toggleRowSelection(row)
    },

  },
  watch: {
    visible(val) {
      if (val) {
        if (this.goodsData.Count > 0) {
          this.queryForm.BarCode = this.barCode
          this.data = this.goodsData.Rows.map(item => item)
        } else {
          this.search()
        }
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
  