<template>
  <div>
    <el-dialog title="选择成品" :visible.sync="visible">
      <div class="cj_head">
        <el-row :gutter="2">
          <el-col :span="3">
            <el-select v-model="StockCompareType" placeholder="所有库存" :filterable="true" name="StockCompareType">
              <el-option label="所有库存" value="0"></el-option>
              <el-option v-for="(item, index) in stockCompareType.TypeArray" :key="index" :label="item.Value" :value="String(item.KeyId)"> </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="MaterialType" placeholder="所有材质" :filterable="true" name="MaterialType">
              <el-option label="所有材质" value="0"> </el-option>
              <el-option v-for="(item,index) in $store.getters.materialType.TypeArray" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="CategoryType" placeholder="所有品类" :filterable="true" name="CategoryType"> 
              <el-option label="所有品类" value="0"> </el-option>
              <el-option v-for="(item, index) in $store.getters.categoryType.TypeArray" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="GoldType" placeholder="所有成色" :filterable="true" name="GoldType">
              <el-option label="所有成色" value="0"> </el-option>
              <el-option v-for="(item, index) in $store.getters.goldType.TypeArray" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="FinanceType" placeholder="所有类别" :filterable="true" name="FinanceType">
              <el-option label="所有类别" value="0"></el-option>
              <el-option v-for="(item, index) in financeType.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input width="100%" placeholder="条码" v-model="queryForm.BarCode" :maxlength="50" @keyup.enter.native="search" name="BarCode">
              <el-button slot="append" @click="search" icon="el-icon-search" name="btnSearch"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>
      <div class="m-10"></div>
      <div class="panel-bd">
        <!-- 表格 -->
        <el-table :data="junkList" @row-click="selectionChange" ref="multipleTable" @selection-change="handleSelectionChange" @sort-change="sortChange" highlight-current-row v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="BarCode" label="条码" min-width="140" show-overflow-tooltip></el-table-column>
          <el-table-column prop="StyleCode" label="款号" min-width="140" show-overflow-tooltip></el-table-column>
          <el-table-column prop="GoodsName" label="货品名称" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="MaterialType" label="类别" min-width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              {{financeType.Types[scope.row.FinanceType]}}
            </template>
          </el-table-column>
          <el-table-column prop="Weight" label="货重" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="GoldWeight" label="净金重" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="FinanceQty" label="账面库存" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="AvailableQty" label="可用库存" min-width="100" show-overflow-tooltip></el-table-column>
        </el-table>
        <!-- end  表格 -->

        <!-- 分页 -->
        <div class="p-10">
          <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="detailPageChange" @sizeChange="detailPageSizeChange"></pagination>
        </div>
        <!-- 分页 end -->
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button type="primary btn" @click.native="selectAddJunk" name="btnSelectAddJunk">确认</el-button>
        <el-button @click="closeDialog" name="btnCancel">取消</el-button> -->
        <el-button type="primary" :loading="$store.getters.is_loading" @click.native="selectAddJunk(false)" name="btnSelectAddJunk">添加</el-button>
        <el-button type="primary" :loading="$store.getters.is_loading" @click.native="selectAddJunk(true)" name="btnSelectAddJunkAndClose">添加并关闭</el-button>
        <el-button @click="closeDialog" name="btnClose">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  JunkTraceState,
  StockCompareType,
  FinanceType
} from '@/enums/stocking.js'
import {
  YNStatus
} from '@/enums/common.js'
import {
  STOCKING_API_GOODS_STOCK_SHELF_REQS,
  STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_CREATE 
} from '@/apis/stocking.js'

import pagination from '@/components/pagination'

export default {
  props: ['selectDialog', 'listenSelectDialog', 'data'],
  data() {
    return {
      YNStatus,
      financeType: FinanceType,
      stockCompareType: StockCompareType,
      visible: this.selectDialog,
      junkTraceState: JunkTraceState,
      junkList: [],
      selections: [],
      queryForm: {
        WarehouseId: this.data.WarehouseId, // 仓库序号
        ShelfId: this.data.ShelfId, // 货架
        FinanceType: '0', // 货品类别(枚举)
        GoodsType: '0', // 货品类型(枚举)
        MaterialType: '0', // 材质类型(枚举)
        CategoryType: '0', // 品类(枚举)
        GoldType: '0', // 成色(枚举)
        BarCode: '', // 条码
        StyleId: '', // 款式序号
        StyleCode: '', // 款号
        StockCompareType: '1', // 库存类型
        OrderBy: '0', // 排序字段(0=创建时间)
        IsAsced: YNStatus.No, // 是否升序
        PageIndex: '1', // 当前页码
        PageSize: '20' // 每页?条
      },
      StockCompareType: '1',
      FinanceType: '0', // 货品类别(枚举)
      MaterialType: '0', // 材质类型(枚举)
      CategoryType: '0', // 品类(枚举)
      GoldType: '0', // 成色(枚举)
      pg: 1,
      size: 10,
      total: 0,

      parameters: {
      }
    }
  },
  methods: {
    init() {
      if (JSON.stringify(this.parameters) === '{}') {
        this.reset()
      } else {
        this.queryForm = Object.assign({}, this.queryForm, this.parameters)
        this.getJunkList()
      }
    },
    getJunkList() {
      this.queryForm.StockCompareType = this.StockCompareType
      this.queryForm.FinanceType = this.FinanceType
      this.queryForm.MaterialType = this.MaterialType
      this.queryForm.CategoryType = this.CategoryType
      this.queryForm.GoldType = this.GoldType
      console.log('this.queryForm', this.queryForm)
      STOCKING_API_GOODS_STOCK_SHELF_REQS(this.queryForm).then(res => {
        let result = res.data
        if (result.Code === 'CORRECT') {
          this.junkList = result.Data.Rows || []
          this.junkList.forEach(item => {
            item.Weight = this.$root.toFloat(item.Weight,3)
            item.GoldWeight = this.$root.toFloat(item.GoldWeight,3)
          })
          this.total = result.Data.Count
        }
      })
    },
    search() {
      this.queryForm.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      this.getJunkList()
    },
    selectAddJunk(flag) {
      if(this.selections.length>0){
        this.$store.commit('SET_BTN_LOADING', true)
        for(let i=0; i<this.selections.length; i++){
          STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_CREATE({
            SplitId: Number(this.$route.query.id),
            GoodsId: this.selections[i].GoodsId,
            Quantity: 1
          }).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if(res.data.Code == 'CORRECT'){
              if(flag){
                this.$emit('listenSelectDialog')
              }else{
                this.$refs.multipleTable.clearSelection()
              }
            }
          }).catch(()=> {
            this.$store.commit('SET_BTN_LOADING', false)
          })
        }
      }else{
        this.$message.error('请选择一条数据')
      }
    },
    handleSelectionChange(val){
      this.selections = val
    },
    selectionChange(row) {
      this.selections = [row]
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.orderBy = 0
          break
        default:
          this.orderBy = 1
          break
      }
      this.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.init()
    },
    closeDialog() {
      this.$emit('listenSelectDialog', false)
    },
    detailPageChange(val) {
      this.queryForm.PageIndex = val
      this.getJunkList()
    },
    detailPageSizeChange(val) {
      if (this.queryForm.PageSize !== val) {
        this.queryForm.PageSize = val
        this.queryForm.PageIndex = 1
        this.getJunkList()
      }
    },
    reset() {
      this.queryForm = {
        WarehouseId: this.data.WarehouseId, // 仓库序号
        ShelfId: this.data.ShelfId, // 货架
        FinanceType: '0', // 货品类别(枚举)
        GoodsType: '0', // 货品类型(枚举)
        MaterialType: '0', // 材质类型(枚举)
        CategoryType: '0', // 品类(枚举)
        GoldType: '0', // 成色(枚举)
        BarCode: '', // 条码
        StyleId: '', // 款式序号
        StyleCode: '', // 款号
        StockCompareType: '1', // 库存类型
        OrderBy: '0', // 排序字段(0=创建时间)
        IsAsced: YNStatus.No, // 是否升序
        PageIndex: '1', // 当前页码
        PageSize: '20' // 每页?条
      }
      this.StockCompareType = ''
      this.MaterialType = ''
      this.CategoryType = ''
      this.GoldType = ''
      this.FinanceType = ''

      this.getJunkList()
    },
    getEnums(){
      this.$store.dispatch('GET_GOLD_TYPE')
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
    }
  },
  created() {
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  watch: {
    StockCompareType: 'search',
    MaterialType: 'search',
    CategoryType: 'search',
    GoldType: 'search',
    FinanceType: 'search',
    visible() {
      this.$emit('listenSelectDialog', false)
    }
  },
  components: {
    pagination
  }
}
</script>

<style lang="scss" scoped>
.cj_head {
  width: 100%;
}
</style>
