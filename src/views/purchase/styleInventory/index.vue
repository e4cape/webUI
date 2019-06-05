<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-button
              name="createShop"
              @click="openGenerate"
              type="primary"
              icon="fa fa-plus"
              :disabled="selectRows.length ? false : true"
              v-if="$store.getters.user_session.CharacterType === characterType.Company"
            >生成订货单</el-button>
            <span style="margin-left: 15px;" v-if="$store.getters.user_session.CharacterType === characterType.Company">根据列表中库存状态自动生成款式订货单</span>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="SafeState">
            <el-select filterable v-model="queryForm.SafeState" placeholder="所有" @change="onSearch">
              <el-option label="所有" value="0"></el-option>
              <el-option v-for="(item, index) in safeState.TypeArray" :key="index" :label="item.Value" :value="String(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="StyleName">
            <el-input v-model="queryForm.StyleName" :maxlength="50" @keyup.enter.native="onSearch" placeholder="款式名称">
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="位置：" v-if="$store.getters.user_session.CharacterType === characterType.Company">
            <el-cascader v-model="Position" :options="options" change-on-select @visible-change="cascaderChange"></el-cascader>
          </el-form-item>
          <el-form-item label="种类：" prop="KindTypeEk">
            <el-select filterable v-model="queryForm.KindTypeEk" placeholder="所有种类">
              <el-option label="所有种类" value="0"></el-option>
              <el-option v-for="(item,index) in kind" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="品类：" prop="CategoryTypeEk">
            <el-select filterable v-model="queryForm.CategoryTypeEk" placeholder="所有品类">
              <el-option label="所有品类" value="0"></el-option>
              <el-option v-for="(item, index) in category" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="StyleCode" label="款号：">
            <el-input v-model="queryForm.StyleCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item prop="StyleName" label="款式名称：">
            <el-input v-model="queryForm.StyleName" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="模版来源：" prop="TemplateType">
            <el-select filterable v-model="queryForm.TemplateType" placeholder="全部">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in styleBasicTemplateType.TypeArray" :key="index" :label="item.Value" :value="String(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="新款日期：" prop="UpperTime">
            <el-date-picker
              v-model="queryForm.UpperTime"
              @change="dateChange"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- Data Table -->
    <el-table
      :data="data"
      v-loading="$store.getters.tb_loading"
      row-key="RowIndex"
      element-loading-text="拼命加载中"
      @sort-change="querySort"
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed min-width="10" type="selection"></el-table-column>
      <el-table-column label="款式" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="gift-info-cell" @click="toLinkViewStyle(scope.row.StyleId)">
            <el-popover popper-class="big-img" placement="right" trigger="hover" v-if="scope.row.ImageUrl !== ''">
              <img :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl" alt class="m-r-5">
              <div class="fl item-img" slot="reference">
                <img :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl" alt class="m-r-5">
              </div>
            </el-popover>
            <img src="@/assets/images/pic.jpg" width="60" height="60" v-else class="m-r-5 fl item-img">
            <div v-text="scope.row.StyleName" class="btn-link el-button--text butHand"></div>
            <div v-text="scope.row.StyleCode" class="btn-link el-button--text butHand"></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="KindTypeEv" label="货品种类" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CategoryTypeEv" label="品类" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="位置" prop="Positon" min-width="120" show-overflow-tooltip v-if="$store.getters.user_session.CharacterType === characterType.Company"></el-table-column>
      <el-table-column prop="AvailableQty" :render-header="privateHeader" label="可用库存" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="FinanceQty" label="账面库存" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="OutwaitQty" label="待出库存" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="AllotQty" :render-header="privateHeader" label="调拨在途" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Safety" label="安全库存" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.SafeQty1}}~{{scope.row.SafeQty2}}</template>
      </el-table-column>
      <el-table-column label="状态" :render-header="privateHeader" min-width="80" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">{{safeState.Types[scope.row.SafeState]}}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="200" fixed="right" v-if="$store.getters.user_session.CharacterType === characterType.Store">
        <template slot-scope="scope">
          <el-button type="text" @click="showDetailDialog(scope.row)">设置安全库存</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Pagination -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- end 货品详情-->
    <!-- 生成到货订单 -->
    <generate-Order v-if="generateOrderDialog" title="生成订货单" :selectArr="selectRows" :generateOrder="generateOrderDialog" @colseGenerateOrder="colseGenOrder" types="styleInventory"></generate-Order>
    <!-- end 生成到货订单 -->
    <el-dialog title="设置安全库存" :visible.sync="setSafety" width="600px" :before-close="setSafetyDialogColse">
      <el-form :model="setSafetyData" ref="setSafety" lable-width="120px" class="item-lh-26" :inline="true">
        <el-form-item label="款式：">
          <div class="gift-info-cell" @click="toLinkViewStyle(setSafetyData.StyleId)" style="width: 400px;">
            <el-popover popper-class="big-img" placement="right" trigger="hover" v-if="setSafetyData.ImageUrl !== ''">
              <img :src="$root.settings.DOMAIN_IMG_FILE + setSafetyData.ImageUrl" alt class="m-r-5">
              <div class="fl item-img" slot="reference">
                <img :src="$root.settings.DOMAIN_IMG_FILE + setSafetyData.ImageUrl" alt class="m-r-5">
              </div>
            </el-popover>
            <div v-text="setSafetyData.StyleName" class="btn-link el-button--text butHand"></div>
            <div v-text="setSafetyData.StyleCode" class="btn-link el-button--text butHand"></div>
          </div>
        </el-form-item>
        <el-form-item label="设置安全库存：">
          <el-row :gutter="20">
            <el-col :span="9">
              <el-form-item prop="SafeQty1" style="margin-bottom: 0px;" :rules="rules.SafeQty1">
                <el-input name="SafeQty1" v-model="setSafetyData.SafeQty1" :maxlength="9"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <span class="inputSpan">~</span>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="SafeQty2" style="margin-bottom: 0px;" :rules="rules.SafeQty2">
                <el-input name="SafeQty2" v-model="setSafetyData.SafeQty2" :maxlength="9"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setSafetyConfirm('setSafety')">保 存</el-button>
        <el-button @click="setSafetyColse">取 消</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import {
  SettingEnumeratorEnumeratorType,
  StyleStockWarehouseSafeState,
  StyleStockWarehousePositionType,
  StyleBasicTemplateType
} from '@/enums/stocking.js'
import { CharacterType, YNStatus } from '@/enums/common.js'
import {
  STOCKING_API_STYLE_STOCK_WAREHOUSE_GETS,
  STOCKING_API_STYLE_STOCK_SHELF_GETS,
  STOCKING_API_STYLE_STOCK_WAREHOUSE_SETSTORE
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST,
  MERCHANT_API_DROPDOWN_STORELIST,
  MERCHANT_API_DROPDOWN_WAREHOUSEBASICLIST
} from '@/apis/merchant.js'
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import generateOrder from '../totalInventory/generateOrder'
export default {

  data() {
    var SafeQty1 = (r, v, callback) => {
      if (
        v &&
        !/^(\d+|\d+.?\d+)$/.test(v) &&
        parseInt(v) !== 0
      ) {
        callback(new Error('请输入非负数字'))
      } else if (!/^\d+$/.test(v)) {
        callback(new Error('请输入正整数'))
      } else if (
        this.setSafetyData.SafeQty2 !== '' &&
        parseFloat(v) > parseFloat(this.setSafetyData.SafeQty2)
      ) {
        callback(new Error('起始值不能大于结束值'))
      }
      callback()
    }
    var SafeQty2 = (r, v, callback) => {
      if (
        v &&
        !/^(\d+|\d+.?\d+)$/.test(v) &&
        parseInt(v) !== 0
      ) {
        callback(new Error('请输入非负数字'))
      } else if (v && !/^\d+$/.test(v)) {
        callback(new Error('请输入正整数'))
      } else if (
        this.setSafetyData.SafeQty1 &&
        parseFloat(v) < parseFloat(this.setSafetyData.SafeQty1)
      ) {
        callback(new Error('结束值不能小于起始值'))
      }
      callback()
    }
    return {
      characterType: CharacterType,
      category: [], // 品类下拉
      kind: [], // 种类下拉
      safeState: StyleStockWarehouseSafeState, // 库存下拉
      styleBasicTemplateType: StyleBasicTemplateType, // 模版来源下拉
      positionType: StyleStockWarehousePositionType, // 位置枚举
      isDisabled: true,
      queryForm: {
        // 查询表单数据
        PositionType: 0,
        SafeState: '0',
        KindTypeEk: '0',
        CategoryTypeEk: '0',
        StyleCode: '',
        StyleName: '',
        TemplateType: '0',
        UpperTime: [],
        UpperTime1: '',
        UpperTime2: '',
        PageIndex: 1,
        PageSize: 20,
        OrderBy: 1,
        IsAsced: YNStatus.No,
        StorechterId: '',
        WarehouseId: ''
      },
      Position: [0],
      data: [],
      total: 0,
      goodsLogDialog: false, // 出入库记录对话框
      generateOrderDialog: false, // 生成订货单对话框
      goodsLog: {
        pg: 1,
        size: 20,
        total: 0,
        data: [],
        totalData: []
      },
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      allInventoryData: [], // 所有待出库存弹窗数据list
      showInventoryDialog: false, // 待出库存弹窗
      showInventoryDataLoading: false, // 待出库存弹窗loading
      showInventoryData: [], // 待出库存弹窗数据list
      dialogSize: 20, // 待出库存弹窗数据Size
      dialogPg: 1, // 待出库存弹窗数据pg
      dialogtotal: 0, // total
      expandRows: [],
      selectRows: [],
      parameters: {},
      printDialog: false,
      goodsId: '',
      options: [
        {
          label: '所有位置',
          value: 0
        },
        {
          label: '所有总部仓库',
          value: StyleStockWarehousePositionType.Warehouse
        },
        {
          label: '所有门店',
          value: StyleStockWarehousePositionType.Store
        }
      ],
      setSafety: false,
      setSafetyData: {
        SafeQty1: '',
        SafeQty2: '',
      },
      rules: {
        SafeQty1: [
          {
            trigger: 'blur',
            validator: SafeQty1
          }
        ],
        SafeQty2: [
          {
            trigger: 'blur',
            validator: SafeQty2,
          }
        ]
      }
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}' ? {
          ...this.$route.query,
          PositionType: Number(this.$route.query.PositionType),
          StorechterId:
            this.$route.query.StorechterId == ''
              ? ''
              : Number(this.$route.query.StorechterId),
          WarehouseId:
            this.$route.query.WarehouseId == ''
              ? ''
              : Number(this.$route.query.WarehouseId),
          PageSize: Number(this.$route.query.PageSize)
        } : {
          PositionType: 0,
          StorechterId: '',
          WarehouseId: '',
          SafeState: '0',
          KindTypeEk: '0',
          CategoryTypeEk: '0',
          StyleCode: '',
          StyleName: '',
          TemplateType: '0',
          UpperTime1: '',
          UpperTime2: '',
          OrderBy: 1,
          IsAsced: YNStatus.No,
          PageIndex: 1,
          PageSize: 20
        }
      let Position = [query.PositionType]
      if (
        query.PositionType == StyleStockWarehousePositionType.Store &&
        query.StorechterId != ''
      ) {
        Position = [query.PositionType, query.StorechterId]
      } else if (
        query.PositionType == StyleStockWarehousePositionType.Warehouse &&
        query.WarehouseId != ''
      ) {
        Position = [query.PositionType, query.WarehouseId]
      }
      this.Position = Position
      this.parameters = Object.assign({}, query)
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      this.queryForm = Object.assign(this.queryForm, this.parameters)
      this.expandRows = []
      STOCKING_API_STYLE_STOCK_WAREHOUSE_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = (res.data.Data.Rows || []).map((item, index) => {
            item.RowIndex = index
            return item
          })
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    openGenerate() {
      for (let i = 0; i < this.selectRows.length; i++) {
        if(this.selectRows[i].SafeState !== StyleStockWarehouseSafeState.Low){
          return this.$message.error('请选择状态为库存太低的单据生成订货单')
        }
        for (let o = 1; o < this.selectRows.length; o++) {
          if (this.selectRows[i].KindTypeEk !== this.selectRows[o].KindTypeEk) {
            return this.$message.error('只能选择相同货品种类的单据生成订货单')
          }
        }
      }
      this.generateOrderDialog = true
    },
    dateChange(value) {
      if (value) {
        this.queryForm.UpperTime1 = value[0]
        this.queryForm.UpperTime2 = value[1]
      } else {
        this.queryForm.UpperTime1 = ''
        this.queryForm.UpperTime2 = ''
      }
    },
    cascaderChange(value) {
      if (!value) {
        this.queryForm.PositionType = this.Position[0]
        this.queryForm.StorechterId = ''
        this.queryForm.WarehouseId = ''
        if (
          this.Position[0] == StyleStockWarehousePositionType.Warehouse &&
          this.Position.length == 2
        ) {
          this.queryForm.WarehouseId = this.Position[1]
        } else if (
          this.Position[0] == StyleStockWarehousePositionType.Store &&
          this.Position.length == 2
        ) {
          this.queryForm.StorechterId = this.Position[1]
        }
      }
    },
    handleSelectionChange(val) {
      this.selectRows = val
    },
    expandRow(row, a) {
      if (row.WarehouseId) {
        this.expandRows = []
        if (a.some(item => item.RowIndex === row.RowIndex)) {
          this.expandRows.push(row.RowIndex)
          if (!row.Children) {
            STOCKING_API_STYLE_STOCK_SHELF_GETS({
              WarehouseId: row.WarehouseId,
              StyleId: row.StyleId,
              IsAsced: YNStatus.No,
              PageIndex: 1,
              PageSize: 50
            }).then(res => {
              if (res.data.Code === 'CORRECT') {
                this.$set(this.data, row.RowIndex, Object.assign({}, row, { Children: res.data.Data.Rows }))
              }
            })
          }
        }
      } else {
        this.expandRows = []
      }
    },
    showDetailDialog(row) {
      this.setSafetyData = {
        ...row,
      }
      this.setSafety = true
    },
    setSafetyConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const para = {
            StyleId: this.setSafetyData.StyleId,
            SafeQty1: Number(this.setSafetyData.SafeQty1),
            SafeQty2: Number(this.setSafetyData.SafeQty2),
          }
          STOCKING_API_STYLE_STOCK_WAREHOUSE_SETSTORE(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.setSafetyColse()
              this.onSearch()
            }
          })
        }
      })
    },
    setSafetyColse() {
      this.$refs['setSafety'].resetFields()
      this.setSafety = false
    },
    setSafetyDialogColse() {
      this.setSafety = false
    },
    toLinkViewStyle(id) {
      this.$router.push({
        path: '/purchase/styleManagement/viewStyles',
        query: {
          StyleId: id
        }
      })
    },
    querySort(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.queryForm.OrderBy = 0
          break
        case 'UpperTime':
          this.queryForm.OrderBy = 1
          break
        case 'CheckTime':
          this.queryForm.OrderBy = 2
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    colseGenOrder() {
      this.generateOrderDialog = false
    },
    privateHeader(createElement, { column }) {
      let header, content
      if (column.label === '可用库存') {
        header = column.label
        content = '可用库存 = 账面库存 - 待出库存'
      } else if (column.label === '调拨在途') {
        header = column.label
        content =
          '门店提交款式需求单，并通过审核，自动增加调拨在途数量。当总部调拨该款式到门店，门店收货后自动扣减调拨在途数量。'
      } else if (column.label === '状态') {
        header = column.label
        content =
          '正常：可用库存+调拨在途，在安全库存范围内; 库存太低：可用库存+调拨在途，小于安全库存最低值; 库存太高：可用库存+调拨在途，大于安全库存最高值'
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
    // 获取门店列表
    getAllStoreList() {
      MERCHANT_API_DROPDOWN_STORELIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.options[2].children = res.data.Data.Rows.map(item => {
            const obj = {
              ...item,
              label: item.Value,
              value: item.CharacterId
            }
            return obj
          })
        }
      })
    },
    // 获取仓库列表
    getAllDepotList() {
      MERCHANT_API_DROPDOWN_WAREHOUSEBASICLIST({ HasShelf: YNStatus.No }).then(
        res => {
          if (res.data.Code === 'CORRECT' && res.data.Data.Rows.length) {
            this.options[1].children = res.data.Data.Rows.map(item => {
              const obj = {
                ...item,
                label: item.Value,
                value: item.Id
              }
              return obj
            })
          }
        }
      )
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
      this.Position = [0]
      this.queryForm.PositionType = 0
      this.queryForm.WarehouseId = ''
      this.queryForm.StorechterId = ''
      this.queryForm.UpperTime1 = ''
      this.queryForm.UpperTime2 = ''
      this.queryForm.UpperTime = []
      // 重置表单
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
        path: this.$router.path,
        query: this.parameters
      })
    }
  },
  created() { },
  mounted() {
    this.getAllStoreList()
    this.getAllDepotList()
    this.getKind()
    this.getCategory()
    this.init()
  },
  watch: {
    $route: 'init',
    // 'queryForm.PositionType'(newVal, oldVal) {
    //   if (newVal !== oldVal && this.Position.length == 1) {
    //     this.onSearch()
    //   }
    // },
    // 'queryForm.WarehouseId'(newVal, oldVal) {
    //   if (newVal !== oldVal && newVal !== '') {
    //     this.onSearch()
    //   }
    // },
    // 'queryForm.StorechterId'(newVal, oldVal) {
    //   if (newVal !== oldVal && newVal !== '') {
    //     this.onSearch()
    //   }
    // },
    // 'queryForm.KindTypeEk': 'onSearch',
    // 'queryForm.CategoryTypeEk': 'onSearch',
    // 'queryForm.SafeState': 'onSearch',
    // 'queryForm.TemplateType': 'onSearch'
  },
  components: {
    searchPanel,
    pagination,
    generateOrder
  }
}
</script>

<style lang="scss" scoped>
.expand-talble {
  width: 600px;
  margin: 0 auto;
  padding: 0 140px;
  border-top: 1px solid #dfe6ec;
  border-left: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
  text-align: center;
  border-collapse: collapse;
  line-height: 26px;
  th,
  td {
    text-align: center;
  }
}
.gift-info-cell img {
  width: 50px;
  height: 50px;
  vertical-align: top;
}
.butHand {
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
