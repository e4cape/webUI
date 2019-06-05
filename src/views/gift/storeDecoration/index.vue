<template>
  <el-row>
    <el-col :span="10" class="left">
      <div class="left-fixed">
        <div class="phone clearfix">
          <div class="header-bar">礼品商城</div>
          <div class="main">
            <div class="search-btn">
              <div class="search-gift">
                <i class="el-icon-search"></i> 搜索礼品
              </div>
            </div>
            <el-tabs name="activeName" v-model="activeName">
              <el-tab-pane label="推荐" name="first">
                <div v-if="recommendCategoty.length">
                  <div class="title">{{categorySetting.name}}</div>
                  <el-row class="layout" :gutter="10">
                    <el-col :span="12" v-for="(item, index) in recommendCategoty" :key="index">
                      <div></div>
                    </el-col>
                  </el-row>
                </div>
                <div v-for="(item, index) in columns" :key="index">
                  <div class="title title-bro">{{item.name}}</div>
                  <el-row class="layout" :gutter="10">
                    <el-col :span="8" v-for="value in xRank" :key="value">
                      <div style="height:106px;"></div>
                    </el-col>
                  </el-row>
                </div>
                <div class="recommend-gift">—— 推荐礼品 ——</div>
                <div v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
                  <div class="clearfix">
                    <div class="data-list" :class="{'list-show':recommendSetting.layout === 20}" ref="scrollContainer">
                      <div class="item" :class="recommendSetting.layout === 20 ? 'list' : 'box'" v-for="(item,index) in recommendPerch" :key="index"></div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="我能兑换" name="second" disabled>我能兑换</el-tab-pane>
              <el-tab-pane label="鞋帽服装" name="third" disabled>鞋帽服装</el-tab-pane>
              <el-tab-pane label="箱包手表" name="fourth" disabled>箱包手表</el-tab-pane>
              <el-tab-pane label="数码家电" name="fifth" disabled>数码家电</el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :span="13" class="right">
      <div class="box find-product">
        <el-input name="name" v-if="editTitle" v-model="categorySetting.name" @keyup.enter.native="isEditTitle" maxlength="8"></el-input>
        <span v-else class="box-title">{{categorySetting.name}}</span>
        <el-button name="btnEditName" type="text" v-if="!editTitle" @click="editTitle = true">
          <i class="el-icon-edit"></i>修改名称
        </el-button>
        <span v-else class="m-l-10">
          <el-button name="btnEditTitle" type="text" @click="isEditTitle">确定</el-button>
          <el-button name="btnCancelTitle" type="text" @click="cancelEdit">取消</el-button>
        </span>
        <div>
          <el-button type="text" @click="showCategory" class="m-t-10">
            <i class="el-icon-plus"></i>选择分类
          </el-button>
          <span class="gray">(最多6个，建议4个)</span>
        </div>
        <el-row class="classify" :gutter="20">
          <el-col :span="6" class="classify-item" v-for="item in recommendCategoty" :key="item.categoryId">
            <img :src="$root.settings.DOMAIN_IMAGE + item.imageUrl">
            <i name="btnDeleteCategory" class="el-icon-circle-close" @click="deleteCategory(item.storeCategoryId)"></i>
          </el-col>
        </el-row>
      </div>
      <div class="box custom-fields">
        <div class="fields-top">
          <span class="box-title">自定义栏目</span>
          <el-button name="btnColumnVisible" type="text" class="column" @click="columnVisible = true">
            <i class="icon-set"></i> 栏目管理
          </el-button>
        </div>
        <el-tabs v-model="columnsTabName" @tab-click="handleClick">
          <el-tab-pane :label="item.name" :name="item.settingOptionId" v-for="item in columns" :key="item.settingOptionId" v-loading="columnsLoading">
            <div class="m-b-10 gray">
              <el-button type="text" @click="recommendGiftByColumn">
                <i class="el-icon-plus"></i>添加推荐礼品
              </el-button>(最多10个，实际显示前6个)
            </div>
            <div class="data-list list-show" v-if="item.recommendData.length">
              <div class="item" v-for="(item,index) in item.recommendData" :key="index">
                <div class="offShelves">
                  <span class="el-tag el-tag--info-61a9da el-tag--mini" v-if="item.onlineStatus >= onlineStatus.OffShelves">已下架</span>
                </div>
                <div class="img-box">
                  <img :src="$root.settings.DOMAIN_IMAGE + item.imageUrl" v-if="item.imageUrl" style="background-color:#fff">
                  <img src="@/assets/images/pic.jpg" v-else>
                </div>
                <p class="gift-title" :title="item.giftName">
                  <span class="el-tag el-tag--info-61a9da el-tag--mini" v-if="item.giftType == giftTypes.Self">{{item.giftTypeText}}</span>
                  {{item.giftName}}
                </p>
                <p class="mkt-title">{{item.mktTitle}}</p>
                <div class="price">
                  <p v-if="item.score">
                    <el-tag type="info">积分</el-tag>
                    <span class="num">{{item.score}}</span>
                  </p>
                  <p v-if="item.goldenRice">
                    <el-tag type="info">礼金</el-tag>
                    <span class="num">{{item.goldenRice}}</span>
                  </p>
                </div>
                <div class="operation">
                  <el-button name="btnRemoveGiftByColumn" type="text" @click="removeGiftByColumn(item, 'column')">取消推荐</el-button>
                  <el-button name="btnToTopByColumn" type="text" v-if="index != 0" @click="toTopByColumn(item.settingOptionGiftId, 'column')">置顶</el-button>
                </div>
              </div>
            </div>
            <div class="tc" v-else>- 暂无数据 -</div>
            <p class="explain p-t-10">推荐的礼品按顺序排在前面，不足自动补充其他礼品。下架自动隐藏</p>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="box recommend-gift">
        <div class="box-title">推荐礼品</div>
        <div class="m-t-10">
          <span class="item">内容布局：</span>
          <el-radio-group name="layout" class="check-group" v-model="recommendSetting.layout" @change="layoutChange">
            <el-radio-button :label="10">
              <i class="icon-image m-r-5"></i>大图
            </el-radio-button>
            <el-radio-button :label="20">
              <i class="icon-list m-r-5"></i>列表
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="m-t-10 gray">
          <el-button type="text" @click="recommendGiftBySelf">
            <i class="el-icon-plus"></i>添加推荐礼品
          </el-button>(最多50个)
        </div>
        <div class="data-list list-show m-t-10">
          <div class="item" v-for="(item,index) in recommendGift" :key="index">
            <div class="offShelves">
              <span class="el-tag el-tag--info-61a9da el-tag--mini" v-if="item.onlineStatus >= onlineStatus.OffShelves">已下架</span>
            </div>
            <div class="img-box" v-if="recommendGift.length">
              <img :src="$root.settings.DOMAIN_IMAGE + item.imageUrl" v-if="item.imageUrl" style="background-color:#fff">
              <img src="@/assets/images/pic.jpg" v-else>
            </div>
            <p class="gift-title">
              <span class="el-tag el-tag--info-61a9da el-tag--mini" v-if="item.giftType == giftTypes.Self">{{item.giftTypeText}}</span>
              {{item.giftName}}
            </p>
            <p class="mkt-title">{{item.mktTitle}}</p>
            <div class="price">
              <p v-if="item.score">
                <el-tag type="info">积分</el-tag>
                <span class="num">{{item.score}}</span>
              </p>
              <p v-if="item.goldenRice">
                <el-tag type="info">礼金</el-tag>
                <span class="num">{{item.goldenRice}}</span>
              </p>
            </div>
            <div class="operation">
              <el-button name="btnRemoveGift" type="text" @click="removeGiftByColumn(item, 'self')">取消推荐</el-button>
              <el-button name="btnToTop" type="text" v-if="index != 0" @click="toTopByColumn(item.settingOptionGiftId, 'self')">置顶</el-button>
            </div>
          </div>
          <div class="tc" v-if="!recommendGift.length">- 暂无数据 -</div>
          <p class="explain p-t-10">推荐的礼品按顺序排在前面，不足自动补充其他礼品。下架自动隐藏</p>
        </div>
      </div>
    </el-col>
    <!-- 添加分类 -->
    <el-dialog title="选择分类" :visible.sync="categoryVisible" width="500px">
      <el-table ref="categoryTable" :data="categoryData" @selection-change="handleCateSelection">
        <el-table-column type="selection" width="55" :selectable="isEnabled"></el-table-column>
        <el-table-column property="giftCategoryName" label="分类名称" width="100"></el-table-column>
        <el-table-column property="giftCategoryImageUrl" label="图片" min-width="140">
          <template slot-scope="scope">
            <img :src="$root.settings.DOMAIN_IMAGE + scope.row.giftCategoryImageUrl" style="width: 100px;">
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnAddCategory" type="primary" @click="addCategory">确定</el-button>
        <el-button name="btnCancel" @click="categoryVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- End -->
    <!-- 添加推荐礼品 -->
    <el-dialog title="添加推荐礼品" :visible.sync="giftVisible" width="1050px">
      <el-form :model="recommendForm" :inline="true">
        <el-form-item label="分类：" prop="categoryId">
          <el-cascader
            name="selectedCategory"
            :options="[allCategory, ...categoryList]"
            v-model="selectedCategory"
            :props="{value:'categoryId',label:'categoryName',children:'items'}"
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item label="货号/条码：" prop="barCode">
          <el-input name="barCode" v-model="recommendForm.barCode" maxlength="30" @keyup.enter.native="search"></el-input>
        </el-form-item>
        <el-form-item label="礼品名称：" prop="giftName">
          <el-input name="giftName" v-model="recommendForm.giftName" maxlength="30" @keyup.enter.native="search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button name="btnSearch" type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="giftData" @sort-change="sortChange" @selection-change="handleColumnSelection">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column property="giftName" label="礼品名称" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="gift-info-cell">
              <img :src="$root.settings.DOMAIN_IMAGE + scope.row.imageUrl" class="m-r-5">
              <div>
                <span class="el-tag el-tag--info-61a9da el-tag--mini" v-if="scope.row.giftType == giftTypes.Self">{{scope.row.giftTypeText}}</span>
                {{scope.row.giftName}}
              </div>
              <div>{{scope.row.barCode}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="categoryPathText" label="分类" min-width="120"></el-table-column>
        <el-table-column property="retailPrice" label="零售价" min-width="70"></el-table-column>
        <el-table-column property="scoreTypes" label="兑换方式" min-width="100">
          <template slot-scope="scope">
            <div v-for="item in scope.row.scoreTypes" :key="item.scoreType">{{item.scoreTypeText + '：' + item.salePrice}}</div>
          </template>
        </el-table-column>
        <el-table-column property="orderQty" label="销量" sortable="custom" min-width="70"></el-table-column>
        <el-table-column property="stamp" label="创建时间" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column property="lastTime" label="最后操作时间" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="p10">
        <pagination :pg="parameter.pageIndex" :size="parameter.pageSize" :total="giftTotal" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      </div>
      <!-- End 分页 -->
      <div slot="footer" class="dialog-footer">
        <el-button name="btnAddGift" type="primary" @click="addGiftByColumn(true)" :loading="$store.getters.is_loading">添加</el-button>
        <el-button name="btnAddClose" @click="addGiftByColumn(false)" :loading="$store.getters.is_loading">添加并关闭</el-button>
        <el-button name="btnClose" @click="giftVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- End -->
    <dict-manage
      v-if="columnVisible"
      :dictDialog="columnVisible"
      :dicts="columns.slice()"
      :dialogTitle="'栏目管理'"
      :dictType="settingOptionTypes.StoreColumn"
      @listenDictDialog="listenDictDialog"
      @listenDictSave="listenDictSave"
    ></dict-manage>
  </el-row>
</template>

<script>
import {
  SettingOptionTypes, GiftTypes, OnlineStatus
} from '@/enums/gifting.js'
import {
  YNStatus
} from '@/enums/common'
import dictManage from './dictManage'
import pagination from '@/components/pagination.vue'
import {
  GIFTING_API_CATEGORY_SEARCH,
  GIFTING_API_STORESETTING_GETCATEGORIES,
  GIFTING_API_STORESETTING_GETSETTINGS,
  GIFTING_API_STORESETTING_GETOPTIONALCATEGORY,
  GIFTING_API_STORESETTING_ADDCATEGORY,
  GIFTING_API_STORESETTING_GETCUSTOMCOLUMNS,
  GIFTING_API_STORESETTING_SETCATEGORYTITLE,
  GIFTING_API_STORESETTING_GETSETTINGOPTIONGIFT,
  GIFTING_API_STORESETTING_SEARCHOPTIONALGIFT,
  GIFTING_API_STORESETTING_DELETECATEGORY,
  GIFTING_API_STORESETTING_ADDCUSTOMCOLUMNGIFT,
  GIFTING_API_STORESETTING_REMOVEGIFT,
  GIFTING_API_STORESETTING_SETGIFTTOP,
  GIFTING_API_STORESETTING_SETRECOMMENDSLAYOUT,
  GIFTING_API_STORESETTING_ADDRECOMMENDGIFT
} from '@/apis/gifting'
export default {
  data() {
    return {
      settingOptionTypes: SettingOptionTypes,
      giftTypes: GiftTypes,
      onlineStatus: OnlineStatus,
      activeName: 'first',
      recommendGift: [], // 推荐礼品数据
      showType: 1, // 显示大图/列表
      categorySetting: '', // 发现好品栏目
      recommendCategoty: [], // 推荐的分类
      editTitle: false, // 是否修改名称
      categoryVisible: false, // 分类弹窗
      categoryData: [],
      selectedCateId: [], // 选择的分类id
      columns: [], // 自定义栏目
      columnsTabName: '',
      columnsIndex: 0,
      xRank: [1, 2, 3, 4, 5, 6], // 人气榜
      columnVisible: false, // 栏目管理弹窗
      columnName: '栏目管理',
      columnsLoading: false,
      selectedColumnGiftId: [], // 栏目选择的礼品id
      selectedColumnGift: [],
      giftVisible: false, // 推荐礼品弹窗
      recommendPerch: [1, 2, 3, 4],
      recommendSetting: '', // 推荐礼品栏目ID
      giftData: [],
      giftTotal: 0,
      recommendForm: {
        categoryId: '',
        barCode: '',
        giftName: '',
        orderField: 'stamp',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 10
      },
      allCategory: {
        categoryId: '',
        categoryName: '所有分类',
        items: ''
      },
      categoryList: [],
      selectedCategory: [''], // 添加礼品选择的分类
      flag: 'column',
      columnArray: [],
      selfArray: [],
      parameter: {},
    }
  },
  methods: {
    isEnabled(row) {
      return !row.selected
    },
    getSettings() {
      // 获取页面中的栏目
      this.$store.commit('SET_FULL_LOADING', true)
      GIFTING_API_STORESETTING_GETSETTINGS().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$store.commit('SET_FULL_LOADING', false)
          this.categorySetting = res.data.Data.category
          this.recommendSetting = res.data.Data.recommend
          this.getRecommendGift()
        }
      })
    },
    getCategories() {
      // 获取发现好品下的分类
      GIFTING_API_STORESETTING_GETCATEGORIES().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.recommendCategoty = res.data.Data
        }
      })
    },
    async getCategory() {
      let data = await GIFTING_API_CATEGORY_SEARCH()
      this.categoryList = data.data.Data
    },
    handleCateSelection(val) {
      // 批量选择分类
      this.selectedCateId = []
      val.forEach(item => {
        this.selectedCateId.push(item.giftCategoryId)
      })
    },
    isEditTitle() {
      // 确定修改名称
      this.editTitle = false
      GIFTING_API_STORESETTING_SETCATEGORYTITLE({
        settingOptionId: this.categorySetting.settingOptionId,
        title: this.categorySetting.name
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.getSettings()
        }
      })
    },
    cancelEdit() {
      this.editTitle = false
      this.getSettings()
    },
    showCategory() {
      // 显示添加分类弹窗
      this.categoryVisible = true
      // 获取所有分类
      GIFTING_API_STORESETTING_GETOPTIONALCATEGORY().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.categoryData = res.data.Data
          this.categoryData.forEach(i => {
            if (i.selected) {
              setTimeout(() => {
                this.$refs.categoryTable.toggleRowSelection(i, true)
              }, 1)
            }
          })
        }
      })
    },
    addCategory() {
      // 确定添加分类
      if (this.selectedCateId.length > 6) {
        return this.$message.error('最多推荐6个分类')
      }
      GIFTING_API_STORESETTING_ADDCATEGORY({
        giftCategoryIds: this.selectedCateId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('添加分类成功')
          this.getCategories()
        }
      })
      this.categoryVisible = false
    },
    deleteCategory(id) {
      // 删除分类
      this.$confirm('是否取消推荐分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        GIFTING_API_STORESETTING_DELETECATEGORY({
          storeCategoryId: id
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              type: 'success', message: '删除成功!'
            })
            this.getCategories()
          }
        })
      }).catch(() => {
      })
    },
    getColumns() {
      // 获取所有自定义栏目
      GIFTING_API_STORESETTING_GETCUSTOMCOLUMNS().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.columns = res.data.Data
          this.columnsTabName = res.data.Data[this.columnsIndex].settingOptionId
          this.columns.forEach(item => {
            item.recommendData = []
          })
          this.getSettingOptionGift()
        }
      })
    },
    getSettingOptionGift() {
      // 获取某自定义栏目下已选商品
      this.columnsLoading = true
      GIFTING_API_STORESETTING_GETSETTINGOPTIONGIFT({
        settingOptionId: this.columnsTabName
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.columnsLoading = false
          this.columns[this.columnsIndex].recommendData = res.data.Data
        }
      })
    },
    handleClick(tab) {
      this.columnsTabName = tab.name
      this.columnsIndex = tab.index
      this.columnsLoading = true
      GIFTING_API_STORESETTING_GETSETTINGOPTIONGIFT({
        settingOptionId: this.columnsTabName
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.columnsLoading = false
          this.columns[tab.index].recommendData = res.data.Data
          this.columnArray = []
        }
      })
    },
    listenDictDialog() {
      // 关闭栏目管理弹窗
      this.columnVisible = false
      this.getColumns()
    },
    listenDictSave() {
      this.getColumns()
    },
    search() {
      // 推荐礼品搜索
      this.recommendForm.pageIndex = 1
      if (!this.selectedCategory[0]) {
        this.recommendForm.categoryId = ''
      } else if (!this.selectedCategory[1]) {
        this.recommendForm.categoryId = this.selectedCategory[0]
      } else {
        this.recommendForm.categoryId = this.selectedCategory[1]
      }
      this.parameter = Object.assign({
      }, this.recommendForm)
      if (this.flag === 'column') {
        this.searchOptionalGift(this.columnsTabName)
      } else {
        this.searchOptionalGift(this.recommendSetting.settingOptionId)
      }
    },
    currentChange(val) {
      // 切换当前页
      this.parameter.pageIndex = val
      if (this.flag === 'column') {
        this.searchOptionalGift(this.columnsTabName)
      } else {
        this.searchOptionalGift(this.recommendSetting.settingOptionId)
      }
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameter.pageIndex = 1
      this.parameter.pageSize = val
      if (this.flag === 'column') {
        this.searchOptionalGift(this.columnsTabName)
      } else {
        this.searchOptionalGift(this.recommendSetting.settingOptionId)
      }
    },
    sortChange(sort) {
      // 选择礼品排序
      this.recommendForm.orderField = sort.prop
      this.recommendForm.orderType = sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.search()
    },
    searchOptionalGift(id) {
      this.recommendForm.settingOptionId = id
      GIFTING_API_STORESETTING_SEARCHOPTIONALGIFT(this.parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.giftData = res.data.Data.rows
          this.giftTotal = res.data.Data.total
        }
      })
    },
    recommendGiftByColumn() {
      // 获取对应栏目下待选的商品
      if (this.columns[this.columnsIndex].recommendData.length >= 10) {
        return this.$message.error('最多推荐10个礼品')
      }
      this.flag = 'column'
      this.recommendForm.pageIndex = 1
      this.recommendForm.categoryId = ''
      this.recommendForm.barCode = ''
      this.recommendForm.giftName = ''
      this.selectedCategory = []
      this.parameter = Object.assign({
      }, this.recommendForm)
      this.giftVisible = true
      this.searchOptionalGift(this.columnsTabName)
    },
    handleColumnSelection(val) {
      // 栏目选择添加的礼品
      this.selectedColumnGiftId = []
      this.selectedColumnGift = val
      val.forEach(item => {
        if (!item.selected) {
          this.selectedColumnGiftId.push(item.giftId)
        }
      })
    },
    addGiftByColumn(flag) {
      // 确定添加礼品
      if (this.selectedColumnGiftId.length === 0) {
        if (this.selectedColumnGift.length === 0) {
          return this.$message.error('请选择添加的礼品')
        } else {
          return this.$message.error('礼品已经添加')
        }
      }
      if (this.flag === 'column') {
        if (this.selectedColumnGiftId.length + this.columns[this.columnsIndex].recommendData.length > 10) {
          return this.$message.error('最多推荐10个礼品')
        }
        if ((this.columnArray.toString() === this.selectedColumnGiftId.toString() || this.columnArray.toString().indexOf(this.selectedColumnGiftId.toString()) !== -1) && this.selectedColumnGiftId.length !== 0) {
          return this.$message.error('礼品已经添加')
        }
        if (flag && this.columnArray.length !== 0) {
          this.selectedColumnGiftId = this.selectedColumnGiftId.filter((item) => {
            return this.columnArray.indexOf(item) == -1
          })
        }
        this.$store.commit('SET_BTN_LOADING', true)
        GIFTING_API_STORESETTING_ADDCUSTOMCOLUMNGIFT({
          settingOptionId: this.columnsTabName,
          giftIds: this.selectedColumnGiftId
        }).then(res => {
          this.$store.commit('SET_BTN_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.columnArray = this.selectedColumnGiftId
            this.giftVisible = flag
            this.$message.success('添加成功')
            this.getSettingOptionGift()
          }
        })
      } else {
        if (this.selectedColumnGiftId.length + this.recommendGift.length > 50) {
          return this.$message.error('最多推荐50个礼品')
        }
        if (this.selfArray.toString() === this.selectedColumnGiftId.toString() || this.selfArray.toString().indexOf(this.selectedColumnGiftId.toString()) !== -1) {
          return this.$message.error('礼品已经添加')
        }
        if (flag && this.selfArray.length !== 0) {
          this.selectedColumnGiftId = this.selectedColumnGiftId.filter((item) => {
            return this.selfArray.indexOf(item) == -1
          })
        }
        this.$store.commit('SET_BTN_LOADING', true)
        GIFTING_API_STORESETTING_ADDRECOMMENDGIFT({
          settingOptionId: this.recommendSetting.settingOptionId,
          giftIds: this.selectedColumnGiftId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$store.commit('SET_BTN_LOADING', false)
            this.selfArray = this.selectedColumnGiftId
            this.giftVisible = flag
            this.$message.success('添加成功')
            this.getRecommendGift()
          }
        })
      }
    },
    removeGiftByColumn(item, name) {
      // 栏目取消推荐
      this.flag = name
      this.$confirm('是否取消推荐?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.flag === 'column' ? this.columnArray.splice(this.columnArray.indexOf(item.giftId), 1) : this.selfArray.splice(this.selfArray.indexOf(item.giftId), 1)
        GIFTING_API_STORESETTING_REMOVEGIFT({
          settingOptionGiftIds: [item.settingOptionGiftId]
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('取消成功')
            if (this.flag === 'column') {
              this.getSettingOptionGift()
            } else {
              this.getRecommendGift()
            }
          }
        })
      }).catch(() => {
      })
    },
    toTopByColumn(id, name) {
      // 栏目置顶
      this.flag = name
      GIFTING_API_STORESETTING_SETGIFTTOP({
        settingOptionGiftId: id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (this.flag === 'column') {
            this.getSettingOptionGift()
          } else {
            this.getRecommendGift()
          }
        }
      })
    },
    layoutChange() {
      // 改变推荐礼品布局
      GIFTING_API_STORESETTING_SETRECOMMENDSLAYOUT({
        settingOptionId: this.recommendSetting.settingOptionId,
        layout: this.recommendSetting.layout
      })
    },
    getRecommendGift() {
      // 获取推荐礼品
      GIFTING_API_STORESETTING_GETSETTINGOPTIONGIFT({
        settingOptionId: this.recommendSetting.settingOptionId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.recommendGift = res.data.Data
        }
      })
    },
    recommendGiftBySelf() {
      // 推荐礼品
      if (this.recommendGift.length >= 50) {
        return this.$message.error('最多推荐50个礼品')
      }
      this.flag = 'self'
      this.recommendForm.pageIndex = 1
      this.recommendForm.categoryId = ''
      this.recommendForm.barCode = ''
      this.recommendForm.giftName = ''
      this.selectedCategory = []
      this.parameter = Object.assign({
      }, this.recommendForm)
      this.searchOptionalGift(this.recommendSetting.settingOptionId)
      this.giftVisible = true
    },
  },
  created() {
    this.getColumns()
  },
  mounted() {
    this.getSettings()
    this.getCategories()
    this.getCategory()
  },
  components: {
    dictManage,
    pagination
  }
}
</script>

<style lang="scss" scoped>
.data-list {
  > .item {
    border: 1px solid #ddd;
    display: inline-block;
    width: 49%;
    padding: 10px;
    &:nth-child(2n) {
      margin-left: 6px;
    }
    > .img-box {
      width: 100%;
      height: 0px;
      padding-bottom: 100%;
      position: relative;
      background: #cfe1eb url('~@/assets/images/pic.jpg') center center
        no-repeat;
      > img {
        width: 100%;
        height: 100%;
        position: absolute;
      }
    }
    > .gift-title,
    .mkt-title {
      margin: 5px 0;
      height: 20px;
      color: #333;
      font-size: 16px;
      font-weight: 700;
      word-wrap: break-word;
    }
    > .price {
      // position: relative;
      p {
        color: #333;
        display: inline-block;
        > .num {
          font-size: 14px;
          color: #090;
        }
        &:nth-child(2) {
          margin-left: 2px;
        }
      }
    }
  }
  &.list-show {
    > .item {
      width: 100%;
      position: relative;
      border-right: 0;
      min-height: 80px;
      &:nth-child(2n) {
        margin-left: 0;
      }
      > .img-box {
        width: 80px;
        height: 80px;
        padding: 0;
        position: static;
        background-size: cover;
        > img {
          width: 100%;
          height: 100%;
          position: static;
        }
      }
      > .gift-title {
        position: absolute;
        right: 0;
        left: 110px;
        top: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        min-width: 270px;
        padding-right: 50px;
      }
      .mkt-title {
        position: absolute;
        right: 55px;
        left: 110px;
        top: 35px;
        font-size: 12px;
        font-weight: normal;
        overflow-wrap: break-word;
      }
      > .price {
        border: 0;
        position: absolute;
        bottom: 10px;
        left: 110px;
        width: 260px;
        p:nth-child(2) {
          margin-left: 10px;
        }
      }
    }
  }
}
.left {
  width: 450px;
  height: 862px;
  .left-fixed {
    position: relative;
    width: 450px;
    height: 862px;
    background: url('~@/assets/images/iphone6.jpg') no-repeat;
  }
  .el-tabs /deep/ .el-tabs__nav-wrap.is-scrollable {
    padding: 0;
  }
  .el-tabs /deep/ .el-tabs__header {
    margin: 0;
  }
  .el-tabs /deep/ .el-tabs__nav-next,
  .el-tabs__nav-prev {
    display: none;
  }
  .el-tabs /deep/ .el-tabs__nav-prev {
    display: none;
  }
  .phone {
    position: absolute;
    top: 130px;
    left: 31px;
    width: 367px;
    height: 628px;
    overflow: auto;
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    &::-webkit-scrollbar {
      width: 6px;
      background-color: #f5f5f5;
    }
    /*定义滚动条轨道 内阴影+圆角*/
    &::-webkit-scrollbar-track {
      border-radius: 5px;
    }
    /*定义滑块 内阴影+圆角*/
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background: rgba(144, 147, 153, 0.3);
    }
    .header-bar {
      height: 35px;
      line-height: 35px;
      text-align: center;
      font-size: 18px;
      color: #fff;
      background-color: #666;
    }
    .main {
      padding: 10px 5px;
      .search-btn {
        padding: 0 10px;
        .search-gift {
          text-align: center;
          padding: 5px 0;
          width: 100%;
          border: 1px solid #ccc;
          border-radius: 20px;
          font-size: 14px;
          color: #999;
          i {
            vertical-align: text-bottom;
          }
        }
        .el-icon-search {
          font-size: 18px;
          font-weight: 700;
        }
      }
      .title {
        font-size: 16px;
        color: #333;
        margin-top: 15px;
      }
      .title-bro {
        margin-top: 20px;
      }
      .layout {
        .el-col {
          margin-top: 10px;
          div {
            width: 100%;
            height: 90px;
            background-color: #ccc;
          }
        }
      }
      .recommend-gift {
        text-align: center;
        color: #666;
        font-size: 14px;
        margin: 15px 0;
      }
    }
    .data-list > .item {
      background-color: #ccc;
      margin-top: 3px;
    }
    .data-list > .box {
      height: 235px;
    }
    .data-list.list-show > .list {
      height: 140px;
    }
  }
}
.right {
  width: calc(100% - 450px);
  padding: 0 10px 10px 20px;
  height: 862px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-track {
    border-radius: 5px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(144, 147, 153, 0.3);
  }
  .el-tabs /deep/ .el-tabs__active-bar {
    display: none;
  }
  .box {
    border: 1px solid #ccc;
    margin-bottom: 10px;
    padding: 15px 20px;
    min-width: 550px;
    .box-title {
      color: #090;
      font-size: 16px;
      margin-right: 10px;
    }
  }
  .find-product {
    .el-input {
      width: 50%;
    }
    .classify {
      .classify-item {
        position: relative;
        width: 210px;
        height: 120px;
        margin-top: 10px;
        text-align: center;
        img {
          height: 120px;
        }
        i {
          font-size: 24px;
          position: absolute;
          top: -10px;
          right: 6px;
          cursor: pointer;
        }
      }
    }
  }
  .custom-fields {
    .fields-top {
      margin-bottom: 5px;
      .el-button {
        padding: 0 15px;
      }
      .column {
        font-size: 14px;
        float: right;
        padding: 0;
      }
    }
  }
  .operation {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    .el-button {
      display: block;
    }
  }
  .data-list.list-show > .item {
    border: none;
    border-bottom: 1px solid #ccc;
  }
  .data-list.list-show > .item:first-child {
    border-top: 1px solid #ccc;
  }
  .recommend-gift {
    .data-list.list-show > .item:first-child {
      border-top: 1px solid #ccc;
    }
  }
  .explain {
    text-align: left;
    color: #999;
  }
  .offShelves {
    position: absolute;
    top: 10px;
    left: 6px;
  }
}
.gray {
  color: #999;
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

/* tag标签 */
.el-tag {
  height: 16px;
  line-height: 16px;
  padding: 1px 5px;
  margin: 0 4px;
  border-radius: 0;
  box-sizing: content-box;
}
/* end tag标签 */

.el-tag--info-61a9da {
  color: #fff;
  background: #61a9da;
}

.el-tag--info-b1 {
  color: #fff;
  background: #b1b1b1;
  position: relative;
}

.el-tag--info-b1b1b1 {
  color: #fff;
  background: #b1b1b1;
  position: relative;
  padding-left: 25px;
}

.el-tag--info-b1b1b1:after {
  content: '-';
  border-radius: 50%;
  background: #fff;
  width: 14px;
  height: 14px;
  text-align: center;
  line-height: 14px;
  color: #b1b1b1;
  position: absolute;
  left: 5px;
  top: 1px;
}

.el-tag--info---555 {
  color: #fff;
  background: #555;
}
</style>
