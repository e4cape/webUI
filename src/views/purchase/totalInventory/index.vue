<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true" name="isForms">
      <search-panel @onSearch="onSearch" @onReset="onReset" name="isSearch">
        <template slot="simpleSearch">
          <el-form-item prop="SafeState">
            <el-select filterable name="SafeState" v-model="queryForm.SafeState" placeholder="所有"  @change="onSearch">
              <el-option label="所有" value="0"></el-option>
              <el-option v-for="(item,index) in styleStockWarehouseSafeState.TypeArray" :key="index" :label="item.Value" :value="String(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="StyleName">
            <el-input name="stylesName" v-model="queryForm.StyleName" :maxlength="50" placeholder="款式名称" @keyup.enter.native="onSearch">
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="所有种类：" prop="KindTypeEk">
            <el-select filterable name="kindTypeEk" v-model="queryForm.KindTypeEk" placeholder="所有种类">
              <el-option label="所有种类" value="0"></el-option>
              <el-option v-for="(item,index) in kind" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所有品类：" prop="CategoryTypeEk">
            <el-select filterable name="categoryTypeEk" v-model="queryForm.CategoryTypeEk" placeholder="所有品类">
              <el-option label="所有品类" value="0"> </el-option>
              <el-option v-for="(item, index) in category" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="StyleCode" label="款号：">
            <el-input name="styleCode" v-model="queryForm.StyleCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item prop="StyleName" label="款式名称：">
            <el-input name="styleName" v-model="queryForm.StyleName" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：" prop="CreateTime">
            <el-date-picker name="createTime" v-model="queryForm.CreateTime" @change="createDateChange" type="daterange" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="$root.datePickerOptions" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="CodeNote" label="供应商款号：">
            <el-input name="codeNode" v-model="queryForm.CodeNote" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="模版来源：" prop="TemplateType">
            <el-select filterable name="templateType" v-model="queryForm.TemplateType" placeholder="全部">
              <el-option label="全部" value="0"> </el-option>
              <el-option v-for="(item, index) in styleBasicTemplateType.TypeArray" :key="index" :label="item.Value" :value="String(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="新款日期：" prop="UpperTime">
            <el-date-picker name="upperTime" v-model="queryForm.UpperTime" @change="upperDateChange" type="daterange" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="$root.datePickerOptions" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="最后操作时间：" prop="CheckTime">
            <el-date-picker name="checkTime" v-model="queryForm.CheckTime" @change="checkDateChange" type="daterange" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="$root.datePickerOptions" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </template>
        <template slot="btnBox">
					<el-form-item>
						<el-button name="createShop" @click="openGenerate" type="primary" icon="fa fa-plus" :disabled="expandRows.length ? false : true">生成订货单</el-button>
            <span style="margin-left: 15px;">根据列表中库存状态自动生成款式订货单</span>
					</el-form-item>
				</template>
      </search-panel>
    </el-form>
    <!-- Data Table -->
    <el-table :data="data" @selection-change="handleSelectionChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="款式" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="gift-info-cell" @click="showDetailDialog(scope.row.StyleId)">
            <el-popover popper-class="big-img" placement="right" trigger="hover" v-if="scope.row.ImageUrl !== ''">
              <img :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl" alt="" class="m-r-5">
              <div class="fl item-img" slot="reference">
                <img :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl" alt="" class="m-r-5">
              </div>
            </el-popover>
            <img src="@/assets/images/pic.jpg" width="60" height="60" v-else class="m-r-5 fl item-img">
            <div v-text="scope.row.StyleName" class="btn-link el-button--text butHand"></div>
            <div v-text="scope.row.StyleCode" class="btn-link el-button--text butHand"></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="KindTypeEv" label="货品种类" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="CategoryTypeEv" label="品类" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="AvailableQty" label="可用库存" min-width="100" :render-header="privateHeader" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="FinanceQty" label="账面库存" min-width="80" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="OutwaitQty" label="待出库存" min-width="80" show-overflow-tooltip>
      </el-table-column>
      <!-- <el-table-column prop="PurchaseQty" label="订货在途" min-width="80" show-overflow-tooltip>
      </el-table-column> -->
      <el-table-column label="安全库存" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.SafeQty1}}~{{scope.row.SafeQty2}}
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="80" show-overflow-tooltip :render-header="privateHeader" fixed="right">
        <template slot-scope="scope">
          {{styleStockWarehouseSafeState.Types[scope.row.SafeState]}}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <el-button name="toLinkView" type="text" @click="toLinkView(scope.row.StyleId)">查看</el-button>
          <el-button name="toLinkEdit" type="text" @click="toLinkEdit(scope.row.StyleId)">设置安全库存</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Pagination -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- end 货品详情-->
    <generate-Order v-if="generateOrderDialog" title="生成订货单" types="totalInventory" :selectArr="expandRows" :generateOrder="generateOrderDialog" @colseGenerateOrder="colseGenOrder"></generate-Order>
  </el-row>
</template>

<script>
import {
  StyleStockWarehouseSafeState,
  StyleBasicTemplateType,
  SettingEnumeratorEnumeratorType
} from '@/enums/stocking.js'
import {
  STOCKING_API_STYLE_STOCK_COMPANY_GETS,
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST
} from '@/apis/merchant.js'
import { YNStatus } from '@/enums/common'
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import generateOrder from './generateOrder'
export default {
  data() {
    return {
      styleStockWarehouseSafeState: StyleStockWarehouseSafeState, // 库存状态下拉
      styleBasicTemplateType: StyleBasicTemplateType, // 模版来源下拉
      category: [], // 品类下拉
      kind: [], // 种类下拉
      queryForm: {
        // 查询表单数据
        SafeState: '0',
        KindTypeEk: '0',
        CategoryTypeEk: '0',
        StyleCode: '',
        StyleName: '',
        CreateTime: [],
        CreateTime1: '',
        CreateTime2: '',
        CodeNote: '',
        TemplateType: '0',
        UpperTime: [],
        UpperTime1: '',
        UpperTime2: '',
        CheckTime: [],
        CheckTime1: '',
        CheckTime2: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      data: [],
      total: 0,
      generateOrderDialog: false, // 生成订货单对话框
      goodsLogDialog: false, // 出入库记录对话框
      goodsLog: {
        pg: 1,
        size: 10,
        total: 0,
        data: [],
        totalData: []
      },
      isDisabled: true,
      expandRows: [],
      parameters: {
      },
      printDialog: false,
      goodsId: ''
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            SafeState: '0',
            KindTypeEk: '0',
            CategoryTypeEk: '0',
            StyleCode: '',
            StyleName: '',
            CreateTime1: '',
            CreateTime2: '',
            CodeNote: '',
            TemplateType: '0',
            UpperTime1: '',
            UpperTime2: '',
            CheckTime1: '',
            CheckTime2: '',
            OrderBy: 0,
            IsAsced: YNStatus.No,
            PageIndex: 1,
            PageSize: 20
          }
      this.parameters = Object.assign({
      }, query)
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      this.queryForm = Object.assign(this.queryForm, this.parameters)
      STOCKING_API_STYLE_STOCK_COMPANY_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    handleSelectionChange(val) {
      this.expandRows = val
    },
    showDetailDialog(id) {
      this.$router.push({
        path: '/purchase/styleManagement/viewStyles',
        query: {
          StyleId: id
        }
      })
    },
    createDateChange(value) {
      if (value) {
        this.queryForm.CreateTime1 = value[0]
        this.queryForm.CreateTime2 = value[1]
      } else {
        this.queryForm.CreateTime1 = ''
        this.queryForm.CreateTime2 = ''
      }
    },
    upperDateChange(value) {
      if (value) {
        this.queryForm.UpperTime1 = value[0]
        this.queryForm.UpperTime2 = value[1]
      } else {
        this.queryForm.UpperTime1 = ''
        this.queryForm.UpperTime2 = ''
      }
    },
    checkDateChange(value) {
      if (value) {
        this.queryForm.CheckTime1 = value[0]
        this.queryForm.CheckTime2 = value[1]
      } else {
        this.queryForm.CheckTime1 = ''
        this.queryForm.CheckTime2 = ''
      }
    },
    // 查看
    toLinkView(id) {
      this.$router.push(`/purchase/totalInventory/viewInventory?id=${id}`)
    },
    // 设置安全库存
    toLinkEdit(id) {
      this.$router.push(`/purchase/totalInventory/editInventory?id=${id}`)
    },
    openGenerate() {
      for(let i = 0; i < this.expandRows.length; i++) {
        if(this.expandRows[i].SafeState !== StyleStockWarehouseSafeState.Low){
          return this.$message.error('请选择状态为库存太低的单据生成订货单')
        }
        for(let o = 1; o < this.expandRows.length; o++) {
          if(this.expandRows[i].KindTypeEv !== this.expandRows[o].KindTypeEv) {
            return this.$message.error('只能选择相同货品种类的单据生成订货单')
          }
        }
      }
      this.generateOrderDialog = true
    },
    colseGenOrder() {
      this.generateOrderDialog = false
    },
    privateHeader(createElement, { column }) {
      let header, content
      if (column.label === '可用库存') {
        header = column.label
        content = '可用库存 = 账面库存 - 待出库存'
      } else if (column.label === '状态') {
        header = column.label
        content = '正常：可用库存在安全库存范围内; 库存太低：可用库存小于安全库存最低值; 库存太高：可用库存大于安全库存最高值'
      }
      return createElement('span', [
        createElement('span', {}, [header]),
        createElement(
          'el-tooltip',
          {
            attrs: {
              placement: 'top',
              effect: 'light',
              class: 'el-icon-question',
              content: content
            }
          },
          [
            createElement(
              'i',
              {
                attrs: { style: 'margin-left:5px;' }
              },
              ['']
            )
          ]
        )
      ])
    },
    // 获取种类
    getKind() {
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.KindType 
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.kind = res.data.Data.Rows
        }
      })
    },
    // 获取品类
    getCategory() {
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.CategoryType 
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.category = res.data.Data.Rows
        }
      })
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.queryForm.CreateTime1 = ''
      this.queryForm.CreateTime2 = ''
      this.queryForm.UpperTime1 = ''
      this.queryForm.UpperTime2 = ''
      this.queryForm.CheckTime1 = ''
      this.queryForm.CheckTime2 = ''
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageSize = val
      this.parameters.PageIndex = 1
      this.initRoute()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path, query: this.parameters 
      })
    },
  },
  created() {
  },
  mounted() {
    this.getCategory()
    this.getKind()
    this.init()
  },
  watch: {
    $route: 'init',
  },
  components: {
    searchPanel,
    pagination,
    generateOrder
  }
}
</script>

<style lang="scss" scoped>
.gift-info-cell img {
  width: 50px;
  height: 50px;
  vertical-align: top;
}
.butHand {
  cursor: pointer;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
</style>
