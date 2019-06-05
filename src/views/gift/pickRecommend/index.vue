<template>
  <el-row>
    <div class="tabs">
      <span
        name="tab"
        class="tab"
        v-for="(item, index) in columns"
        :key="item.settingOptionId"
        :class="{'active': tabIndex === index}"
        @click="handleClick(index, item.settingOptionId)">
        {{item.name}}
      </span>
      <el-button name="btnColumnVisible" type="text" class="columns" @click="columnVisible = true"><i class="icon-set"></i> 推荐栏目管理</el-button>
    </div>
    <div class="panel">
      <div class="p-10" v-if="columns.length !== 0">
        <el-button name="btnShowAddGift" type="primary" @click="showAddGift">选择礼品</el-button>
        <el-dropdown name="handleCommand" @command="handleCommand">
          <span class="el-dropdown-link">
            <el-button type="primary">批量操作<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="cancel" :disabled="selectedRecommendId.length === 0">批量取消</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-table :data="data" v-loading="$store.getters.tb_loading" @selection-change="handleRecommendSelection">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="createTime" label="礼品名称" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="gift-info-cell">
              <img name="btnShowGiftDetail" :src="$root.settings.DOMAIN_IMAGE + scope.row.imageUrl" class="m-r-5 curter" @click="giftDetail(scope.row.giftId)">
              <p><el-button name="btnShowGiftDetail" type="text" @click="giftDetail(scope.row.giftId)">{{scope.row.giftName}}</el-button></p>
              <p><el-button name="btnShowGiftDetail" type="text" @click="giftDetail(scope.row.giftId)">{{scope.row.barCode}}</el-button></p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="categoryPathText" label="分类" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="supplierName" label="供应商" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="价格" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <p>{{isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价：': '批发价：'}}<span>{{scope.row.wholesalePrice || '-'}}</span></p>
            <p>建议零售价：<span>{{scope.row.retailPrice || '-'}}</span></p>
          </template>
        </el-table-column>
        <el-table-column prop="orderQty" label="销量" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="stamp" label="创建时间" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="onlineStatusText" label="状态" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button name="btnCancelRecommend" type="text" @click="cancelRecommend(scope.row.settingOptionGiftId)">取消推荐</el-button>
            <el-button name="btnToTop"  type="text" v-if="scope.$index !== 0" @click="toTop(scope.row.settingOptionGiftId)">置顶</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-alert title="" type="warning" :closable="false">
        <div slot>
          注：每个栏目最多推荐50个礼品，推荐的礼品按顺序排在前面，如果商家没有上架，将自动隐藏。
        </div>
      </el-alert>
      <!-- @module 选择礼品 -->
      <el-dialog title="选择礼品" :visible.sync="showSelectGift" width="1120px">
        <el-form :model="searchForm" ref="searchForm" :inline="true">
          <el-form-item label="分类" prop="categoryId" label-width="36px">
            <el-cascader name="selectedCategory" :options="[allCategory, ...categoryList]" v-model="selectedCategory" :props="{value:'categoryId',label:'categoryName',children:'items'}" change-on-select>
            </el-cascader>
          </el-form-item>
          <el-form-item label="供应商" prop="supplierName" label-width="48px">
            <el-select name="supplierName"  v-model="searchForm.supplierName" placeholder="所有供应商" filterable>
              <el-option label="所有供应商" :value="''"></el-option>
              <el-option v-for="item in suppliers" :key="item.supplierId" :label="item.supplierName" :value="item.supplierName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="货号/条码" prop="barCode" label-width="64px">
            <el-input name="barCode"  v-model="searchForm.barCode" @keyup.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item label="礼品名称" prop="giftName" label-width="60px">
            <el-input name="giftName" v-model="searchForm.giftName" @keyup.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button name="btnSearch" type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
        <!-- @module 数据表格 -->
        <el-table :data="giftData" v-loading="loading" @sort-change="sortChange" ref="giftData" element-loading-text="拼命加载中" :default-sort = "{prop: 'grossMargin', order: 'descending'}" @selection-change="handleGiftSelection">
          <el-table-column type="selection" fixed width="55"></el-table-column>
          <el-table-column prop="style" fixed label="礼品名称" min-width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="gift-info-cell">
                <img :src="$root.settings.DOMAIN_IMAGE + scope.row.imageUrl">
                <div>{{scope.row.giftName}}</div>
                <div>{{scope.row.barCode}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="categoryPathText" label="分类" min-width="110" show-overflow-tooltip></el-table-column>
          <el-table-column prop="supplierName" label="供应商" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="价格" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <p>{{isOneNumberManyShopCompany || isOneNumberOneStore ? '采购价：': '批发价：'}}<span>{{scope.row.wholesalePrice || '-'}}</span></p>
              <p>建议零售价：<span>{{scope.row.retailPrice || '-'}}</span></p>
            </template>
          </el-table-column>
          <el-table-column prop="margin" label="毛利" sortable="custom" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="grossMarginPercent" label="毛利率" sortable="custom" min-width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.grossMarginPercent + '%'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderQty" label="销量" sortable="custom" min-width="60" show-overflow-tooltip></el-table-column>
          <el-table-column prop="stamp" label="创建时间" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="p10">
          <pagination :pg="searchForm.pageIndex" :size="searchForm.pageSize" :total="giftTotal" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
        </div>
        <!-- End 分页 -->
        <!-- End 数据表格 -->
        <span slot="footer" class="dialog-footer">
          <el-button name="btnSelectGift" type="primary" @click="selectGift(1)" :loading="$store.getters.is_loading">添加</el-button>
          <el-button name="btnSelectClose" @click="selectGift(2)">添加并关闭</el-button>
          <el-button name="btnCLose" @click="showSelectGift = false">关闭</el-button>
        </span>
      </el-dialog>
      <!-- End 选择礼品 -->
      <!-- @module 查看礼品 -->
      <el-dialog title="查看礼品" :visible.sync="detailShow" :before-close="detailShowCancel" width="458px" v-loading="dialogLoading" element-loading-text="拼命加载中">
        <show-detail :data="detailInfo" ref="showDetail"></show-detail>
      </el-dialog>
      <!-- @module 查看礼品 -->
    </div>
    <dict-manage
      v-if="columnVisible"
      :dictDialog="columnVisible"
      :dicts="columns.slice()"
      :dialogTitle="'推荐栏目管理'"
      :dictType="SettingOptionTypes.PlatformRecommendToStore"
      @listenDictDialog="listenDictDialog"
      @listenDictSave="listenDictSave">
    </dict-manage>
  </el-row>
</template>

<script>
import {
  SettingOptionTypes 
} from '@/enums/gifting.js'
import {
  YNStatus 
} from '@/enums/common.js'
import dictManage from './dictManage'
import pagination from '@/components/pagination.vue'
import showDetail from '@/components/gifting/showDetail.vue'
import {
  GIFTING_API_PLATFORMRECOMMEND_GETSETTINGS,
  GIFTING_API_PLATFORMSETTING_SEARCHOPTIONALGIFT,
  GIFTING_API_CATEGORY_SEARCH,
  GIFTING_API_GIFT_GETDETAILBYSTORE,
  GIFTING_API_PLATFORMSETTING_GETSETTINGOPTIONGIFT,
  GIFTING_API_PLATFORMRECOMMEND_ADDGIFT,
  GIFTING_API_MERCHANTSERVICE_GETALLSUPPLIERS,
  GIFTING_API_PLATFORMSETTING_SETGIFTTOP,
  GIFTING_API_PLATFORMSETTING_REMOVEGIFT
} from '@/apis/gifting'
export default {
  data() {
    return {
      SettingOptionTypes,
      columns: [],
      tabIndex: 0,
      tabSettingId: '',
      columnVisible: false,
      data: [],
      selectedRecommendId: [],
      giftData: [],
      giftTotal: 0,
      searchForm: {
        settingOptionId: '',
        supplierName: '',
        categoryId: '',
        barCode: '',
        giftName: '',
        orderField: 'stamp',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 10
      },
      categoryList: [],
      selectedCategory: [''],
      allCategory: {
        categoryId: '',
        categoryName: '所有分类',
        items: ''
      },
      showSelectGift: false, // 选择礼品弹窗
      selectedGiftId: [], // 选择的礼品id
      selectedGift: [],
      suppliers: [], // 供应商
      detailShow: false, // 查看礼品弹窗
      dialogLoading: false,
      detailInfo: {
      },
      recommendArray: [],
      loading: false,
    }
  },
  methods: {
    getColumns() {
      GIFTING_API_PLATFORMRECOMMEND_GETSETTINGS().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.columns = res.data.Data
          this.searchForm.settingOptionId = this.columns.length === 0 ? '' : this.columns[this.tabIndex].settingOptionId
          this.getRecommendGift(this.searchForm.settingOptionId)
        }
      })
    },
    listenDictDialog () {
      // 关闭栏目管理弹窗
      this.columnVisible = false
      this.getColumns()
    },
    listenDictSave () {
      this.getColumns()
    },
    handleClick(index, settingOptionId) {
      this.tabIndex = index
      this.searchForm.settingOptionId = settingOptionId
      this.getRecommendGift(this.searchForm.settingOptionId)
    },
    getGift () {
      // 获取添加礼品列表
      this.loading = true
      GIFTING_API_PLATFORMSETTING_SEARCHOPTIONALGIFT(this.searchForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.loading = false
          this.giftData = res.data.Data.rows
          this.giftTotal = res.data.Data.total
        }
      })
    },
    async getCategory() {
      // 获取分类列表
      let data = await GIFTING_API_CATEGORY_SEARCH()
      this.categoryList = data.data.Data
    },
    async getSupplier () {
      let data = await GIFTING_API_MERCHANTSERVICE_GETALLSUPPLIERS()
      this.suppliers = data.data.Data
    },
    getRecommendGift (settingOptionId) {
      // 获取推荐礼品列表
      this.$store.commit('SET_TB_LOADING', true)
      GIFTING_API_PLATFORMSETTING_GETSETTINGOPTIONGIFT({
        settingOptionId: settingOptionId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data
        }
      })
    },
    handleCommand (command) {
      if (command === 'cancel') {
        this.$confirm('是否批量取消推荐?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          GIFTING_API_PLATFORMSETTING_REMOVEGIFT({
            settingOptionGiftIds: this.selectedRecommendId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('取消推荐成功')
              this.getRecommendGift(this.searchForm.settingOptionId)
              this.selectedRecommendId.forEach(item => {
                this.recommendArray.splice(this.recommendArray.indexOf(item), 1)
              })
            }
          })
        })
      }
    },
    showAddGift () {
      this.showSelectGift = true
      this.searchForm.pageIndex = 1
      this.getGift()
    },
    selectGift (val) {
      // 推荐礼品
      if (this.selectedGiftId.length === 0) {
        if (this.selectedGift.length === 0) {
          return this.$message.error('请选择添加的礼品')
        } else {
          return this.$message.error('礼品已经添加')
        }
      }
      if (this.data.length + this.selectedGiftId.length > 50) {
        return this.$message.error('最多推荐50个礼品')
      }
      if ((this.recommendArray.toString() === this.selectedGiftId.toString() || this.recommendArray.toString().indexOf(this.selectedGiftId.toString()) !== -1) && this.selectedGiftId.length !== 0) {
        return this.$message.error('礼品已经添加')
      }
      if (val === 1 && this.recommendArray.length !== 0) {
        this.selectedGiftId = this.selectedGiftId.filter((item) => {
          return this.recommendArray.indexOf(item) == -1
        })
      }
      this.$store.commit('SET_BTN_LOADING', true)
      GIFTING_API_PLATFORMRECOMMEND_ADDGIFT({
        settingOptionId: this.searchForm.settingOptionId,
        giftIds: this.selectedGiftId
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.$message.success('添加成功')
          this.recommendArray = this.selectedGiftId
          this.getRecommendGift(this.searchForm.settingOptionId)
        }
      })
      this.showSelectGift = val === 1 ? true : false
    },
    handleRecommendSelection (val) {
      // 批量选择推荐礼品
      this.selectedRecommendId = []
      val.forEach(item => {
        this.selectedRecommendId.push(item.settingOptionGiftId)
      })
    },
    handleGiftSelection (val) {
      // 批量选择礼品
      this.selectedGift = val
      this.selectedGiftId = []
      val.forEach(item => {
        if (!item.selected) {
          this.selectedGiftId.push(item.giftId)
        }
      })
    },
    search () {
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
    currentChange (val) {
      // 切换当前页
      this.searchForm.pageIndex = val
      this.getGift()
    },
    sizeChange (val) {
      // 切换每页显示条数
      this.searchForm.pageIndex = 1
      this.searchForm.pageSize = val
      this.getGift()
    },
    sortChange (sort) {
      // 选择礼品排序
      this.searchForm.orderField = sort.prop
      this.searchForm.orderType = sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.search()
    },
    detailShowCancel(done) {
      // 关闭查看礼品
      this.$refs['showDetail'].initActiveTab()
      done()
      this.detailInfo = {
      }
    },
    giftDetail(id) {
      this.dialogLoading = true
      this.detailShow = true
      GIFTING_API_GIFT_GETDETAILBYSTORE(id).then(res => {
        this.dialogLoading = false
        if (res.data.Code === 'CORRECT') {
          this.detailInfo = res.data.Data
        }
      })
    },
    cancelRecommend (id) {
      // 取消推荐
      this.$confirm('是否取消推荐?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        GIFTING_API_PLATFORMSETTING_REMOVEGIFT({
          settingOptionGiftIds: [id]
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('取消成功')
            this.recommendArray.splice(this.recommendArray.indexOf(id), 1)
            this.getRecommendGift(this.searchForm.settingOptionId)
          }
        })
      }).catch(() => {
      })
    },
    toTop (id) {
      // 置顶
      GIFTING_API_PLATFORMSETTING_SETGIFTTOP({
        settingOptionGiftId: id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('置顶成功')
          this.getRecommendGift(this.searchForm.settingOptionId)
        }
      })
    }
  },
  mounted() {
    this.getColumns()
    this.getCategory()
    this.getSupplier()
  },
  components: {
    dictManage,
    pagination,
    showDetail
  }
}
</script>

<style lang="scss" scoped>
.columns {
  font-size: 14px;
  padding: 0;
  position: absolute;
  right: 5px;
}
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
.curter {
  cursor: pointer;
}
</style>
