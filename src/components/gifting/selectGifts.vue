<template>
  <!-- @module 选择礼品 -->
  <el-dialog title="选择礼品" :visible.sync="visible" width="1120px">
    <el-form :model="searchForm" ref="searchForm" label-width="70px" :inline="true">
      <el-form-item label="分类" prop="categoryId" label-width="40px">
        <el-cascader name="selectedCategory" :options="[allCategory, ...categoryList]" v-model="selectedCategory" :props="{value:'categoryId',label:'categoryName',children:'items'}" change-on-select></el-cascader>
      </el-form-item>
      <el-form-item label="供应商" prop="supplierName" label-width="50px">
        <el-select v-model="searchForm.supplierName" placeholder="请选择">
          <el-option label="全部" :value="''"></el-option>
          <el-option v-for="item in suppliers" :key="item.supplierId" :label="item.supplierName" :value="item.supplierName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="货号/条码" prop="barCode">
        <el-input name="barCode" v-model="searchForm.barCode" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item label="礼品名称" prop="giftName">
        <el-input name="giftName" v-model="searchForm.giftName" @keyup.enter.native="search"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button name="btnSearch" type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- @module 数据表格 -->
    <el-table
      :data="giftData"
      v-loading="$store.getters.tb_loading"
      @sort-change="sortChange"
      @row-click="toggleSelection"
      ref="selectGoods"
      element-loading-text="拼命加载中"
      :default-sort="{prop: 'grossMargin', order: 'descending'}"
      @selection-change="selectChange"
    >
      <el-table-column type="selection" fixed width="30"></el-table-column>
      <el-table-column prop="style" fixed label="礼品名称" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="gift-info-cell">
            <img :src="$root.settings.DOMAIN_IMAGE + scope.row.imageUrl">
            <div>{{scope.row.giftName}}</div>
            <div>{{scope.row.barCode}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="categoryText" label="分类" min-width="110" show-overflow-tooltip></el-table-column>
      <el-table-column prop="supplierName" label="供应商" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="价格" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <p>
            {{isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价：': '批发价：'}}
            <span>￥{{scope.row.wholesalePrice || '-'}}</span>
          </p>
          <p>
            建议零售价：
            <span>￥{{scope.row.retailPrice || '-'}}</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="margin" label="毛利" sortable="custom" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="grossMargin" label="毛利率" sortable="custom" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{(scope.row.grossMarginPercent || 0) + '%'}}</span>
        </template>
      </el-table-column>
      <el-table-column name="orderQty" prop="orderQty" label="销量" sortable="custom" min-width="60" show-overflow-tooltip></el-table-column>
      <el-table-column name="createTime" prop="createTime" label="创建时间" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="p10">
      <pagination :pg="searchForm.pageIndex" :size="searchForm.pageSize" :total="giftTotal" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </div>
    <!-- End 分页 -->
    <!-- End 数据表格 -->
    <span slot="footer" class="dialog-footer">
      <el-button name="btnAdd" type="primary" @click="selectGift(false)" :loading="$store.getters.is_loading">添加</el-button>
      <el-button name="btnAddAndClose" type="primary" @click="selectGift(true)" :loading="$store.getters.is_loading">添加并关闭</el-button>
      <el-button name="close" @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
  <!-- End 选择礼品 -->
</template>

<script>
import {
  GIFTING_API_ADVBASIC_SEARCHOPTIONALGIFT,
  GIFTING_API_CATEGORY_SEARCH,
  GIFTING_API_MERCHANTSERVICE_GETALLSUPPLIERS
} from '@/apis/gifting'
import {
  YNStatus
} from '@/enums/common'
import pagination from '@/components/pagination.vue'
export default {
  props: {
    selectGiftDialog: {
      type: Boolean,
      default: false
    },
    advBasicId: {
      type: String
    }
  },
  data() {
    return {
      searchForm: {
        categoryId: '',
        barCode: '',
        giftName: '',
        supplierName: '',
        pageIndex: 1,
        orderField: 'grossMargin',
        orderType: YNStatus.No,
        pageSize: 10
      },
      categoryList: [],
      selectedCategory: [''],
      allCategory: {
        categoryId: '',
        categoryName: '所有分类',
        items: ''
      },
      visible: this.selectGiftDialog,
      giftTotal: 0,
      giftData: [],
      selectData: [],
      suppliers: [],
    }
  },
  methods: {
    getGift() {
      GIFTING_API_ADVBASIC_SEARCHOPTIONALGIFT(Object.assign({
        advBasicId: this.advBasicId
      }, this.searchForm)).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.giftData = res.data.Data.rows
          this.giftTotal = res.data.Data.total
        }
      })
    },
    sortChange(sort) {
      // 选择礼品排序
      this.searchForm.orderField = sort.prop
      this.searchForm.orderType = sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.search()
    },
    async getCategory() {
      let data = await GIFTING_API_CATEGORY_SEARCH()
      this.categoryList = data.data.Data
    },
    search() {
      this.searchForm.pageIndex = 1
      if (!this.selectedCategory[0]) {
        this.searchForm.categoryId = ''
      } else if (!this.selectedCategory[1]) {
        this.searchForm.categoryId = this.selectedCategory[0]
      } else {
        this.searchForm.categoryId = this.selectedCategory[1]
      }
      this.getGift()
    },
    selectGift(flag) {
      this.$store.commit('SET_BTN_LOADING', true)
      if (!this.selectData.length) {
        this.$message('请选择添加的货品', 'error')
      } else {
        let result = []
        this.selectData.forEach(item => {
          result.push(item.giftId)
        })
        this.$emit('listenSelectGifts', result)
        if (flag) {
          this.$store.commit('SET_BTN_LOADING', false)
          this.visible = false
        } else {
          this.$refs.selectGoods.clearSelection()
        }
      }
      this.$store.commit('SET_BTN_LOADING', false)
    },
    currentChange(val) {
      // 切换当前页
      this.searchForm.pageIndex = val
      this.getGift()
    },
    toggleSelection(row) {
      this.$refs.selectGoods.toggleRowSelection(row)
    },
    selectChange(selection) {
      this.selectData = selection
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.searchForm.pageIndex = 1
      this.searchForm.pageSize = val
      this.getGift()
    },
    getSuppliers() {
      GIFTING_API_MERCHANTSERVICE_GETALLSUPPLIERS().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.suppliers = res.data.Data
        }
      })
    }
  },
  mounted() {
    this.getCategory()
    this.getSuppliers()
    this.getGift()
  },
  components: {
    pagination
  },
  watch: {
    visible() {
      this.$emit('listenSelectGifts', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.gift-info-cell {
  position: relative;
  padding-left: 60px;
  height: 50px;
  line-height: 25px;
  > img {
    position: absolute;
    left: 0;
    top: 0;
    width: 50px;
    height: 50px;
  }
}
</style>
