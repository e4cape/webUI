<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">编辑调价单</span>
        <span class="title fr">
          <el-button type="text" @click="editDialog = true" name="btnEdit">修改</el-button>
        </span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.PriceCode}}</td>
                <td class="tit">创建：</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateTime}}</td>
                <td class="tit">审核：</td>
                <td>{{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime | filterDateTime}}</td>
              </tr>
              <tr>
                <td class="tit">调价原因：</td>
                <td>{{detail.ReasonTypeDv}}</td>
                <td class="tit">备注：</td>
                <td class="note" colspan="3">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <el-row class="p-10">
          <el-col :span="16">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-input
                  placeholder="录入/扫描条码"
                  v-model="code"
                  @keyup.enter.native="codeEnter"
                  :maxlength="50"
                  name="code"
                ></el-input>
              </el-col>
              <el-col :span="16">
                <el-button type="primary" @click="multiCodeVisible=true" name="btnMultiCode">批量录入</el-button>
                <el-button @click="dialogSelectGoodsVisible=true" name="btnDialogSelectGoods">选择货品</el-button>
                <el-dropdown class="multi-operation" @command="takeOrder" name="takeOrder">
                  <el-button>
                    提单
                    <i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="purchase">成品进货入库</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8" class="tr">
            <el-button type="primary" @click="downLoadData" name="btnDownloadData">导出调价信息</el-button>
            <el-button type="primary" @click="templateVisible=true" name="btnImportAdjust">导入调价信息</el-button>
          </el-col>
        </el-row>
        <!-- @module 数据表格 -->
        <el-table
          :data="goodsData"
          v-loading="$store.getters.tb_loading"
          element-loading-text="拼命加载中"
        >
          <el-table-column prop="BarCode" label="条码" min-width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              <span
                @click="showDetailDialog(scope.row.GoodsId)"
                class="init-button-text"
                name="btnShowDetail"
              >{{scope.row.BarCode}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="StyleCode" label="款号" min-width="80" show-overflow-tooltip></el-table-column>
          <el-table-column prop="GoodsName" label="货品名称" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="RetailType1" label="调价前零售方式" min-width="120" show-overflow-tooltip>
            <template slot-scope="scope">{{retailTypes.Types[scope.row.RetailType1 + '']}}</template>
          </el-table-column>
          <el-table-column
            prop="RetailPrice1"
            label="调价前零售价/工费"
            min-width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">￥{{$root.toFloat(scope.row.RetailPrice1)}}</template>
          </el-table-column>
          <el-table-column prop="RetailType2" label="调价后零售方式" min-width="120">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.RetailType2"
                @change="updateItem(scope.row)"
                :filterable="true"
                :key="scope.row.GoodsId"
                name="RetailType2"
              >
                <el-option
                  v-for="(item,index) in retailTypes.Types"
                  :key="index"
                  :label="item"
                  :value="parseInt(index)"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="RetailPrice2" label="调价后零售价/工费" min-width="120">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.RetailPrice2"
                @blur="updateItem(scope.row)"
                @focus="focusItem(scope.row)"
                maxlength="12"
                @keyup.native="scope.row.RetailPrice2 = $root.toFixed(scope.row.RetailPrice2, 2)"
                name="RetailPrice2"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="delGood($event, scope.row)" name="btnDelete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- End 数据表格 -->
        <!-- Pagination -->
        <pagination
          :pg="pg"
          :size="size"
          :total="total"
          @currentChange="pageChange"
          @sizeChange="pageSizeChange"
        ></pagination>
      </div>
    </div>
    <div class="buttons">
      <el-button
        type="primary"
        @click="orderSubmit"
        :loading="$store.getters.is_loading"
        name="btnOrderSubmit"
      >{{enableSubmit?'提交审核':'保存'}}</el-button>
      <el-button name="btnBack" @click="$router.back()">返回</el-button>
    </div>

    <!-- @module Dialog·修改成品调价单 -->
    <basic-edit
      v-if="editDialog"
      :editDialog="editDialog"
      :editForm="editForm"
      @listenEditDialog="listenEditDialog"
    ></basic-edit>
    <!-- End Dialog·修改成品调价单 -->

    <!-- dialog 批量录入条码 -->
    <multi-code-enter :visible.sync="multiCodeVisible" @listenMultiCodeEnter="listenMultiCodeEnter"></multi-code-enter>
    <!-- End 批量录入条码 -->

    <!-- 选择货品 -->
    <select-goods
      :visible.sync="dialogSelectGoodsVisible"
      @listenAddGoods="listenAddGoods"
      :isAvailable="false"
    ></select-goods>
    <!-- End 选择货品 -->

    <!-- dialog 货品详情 -->
    <good-detail :visible.sync="goodDetailDialog.visible" :goodsId="goodDetailDialog.goodsId"></good-detail>
    <!-- end 货品详情-->

    <!-- dialog 提取成品采购入库单 -->
    <adjust-take
      v-if="adjustTakeVisible"
      :adjustTakeVisible="adjustTakeVisible"
      @listenAdjustTakeDialog="listenAdjustTakeDialog"
    ></adjust-take>
    <!-- end 提取成品采购入库单-->

    <!-- @module 导入调价信息 -->
    <adjust-import
      :visible.sync="templateVisible"
      :option="importOption"
      :root="$root.filePaths.STOCKING_SALE + 'goodsPrice/'"
      @submit="importSubmit"
      @exportAdjustInfo="downLoadData"
    ></adjust-import>
    <!-- End 导入调价信息 -->
    <import-error-table v-if="errorVisible" :visible.sync="errorVisible" :errorInfo="errorInfo"></import-error-table>
  </div>
</template>

<script>
import { YNStatus } from '@/enums/common.js'
import {
  GoodsPriceOrderBasicState,
  RetailType,
  SettingAiimportTempletOrderType,
  SettingCustomizedFieldLargeType
} from '@/enums/stocking.js'
import {
  STOCKING_API_GOODS_PRICE_ORDER_BASIC_GET,
  STOCKING_API_GOODS_PRICE_ORDER_ITEM_GETS,
  STOCKING_API_GOODS_PRICE_ORDER_ITEM_CREATE,
  STOCKING_API_GOODS_PRICE_ORDER_ITEM_DELETE,
  STOCKING_API_GOODS_PRICE_ORDER_ITEM_UPDATE,
  STOCKING_API_GOODS_PRICE_ORDER_ITEM_EXPORTITEM,
  STOCKING_API_GOODS_PRICE_ORDER_ITEM_SELECTINTAKECREATE,
  STOCKING_API_GOODS_PRICE_ORDER_BASIC_WAIT,
  STOCKING_API_GOODS_PRICE_ORDER_ITEM_IMPORTITEM
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
import SelectGoods from './selectGoods'
import MultiCodeEnter from './multiCodeEnter'
import goodDetail from '@/components/erp/goodDetail'
import basicEdit from './adjustBasicEdit'
import AdjustTake from './adjustTake'
import importErrorTable from '@/components/erp/importErrorTable'
import adjustImport from './adjustImport'

export default {
  data() {
    return {
      goodsPriceOrderBasicStates: GoodsPriceOrderBasicState,
      retailTypes: RetailType,
      labelPosition: 'right',
      adjustReasons: [], // 调价原因
      adjustId: '',
      detail: {}, // 明细
      editDialog: false, // 新建对话框
      editForm: {},
      rules: {
        ReasonId: [
          {
            type: 'number',
            required: true,
            message: '请选择',
            trigger: 'change'
          }
        ]
      },
      goodsData: [], // 货品数据
      pg: 1,
      size: 20,
      total: 0,
      code: '',
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      multiCodeVisible: false, // 批量录入条码弹窗
      dialogSelectGoodsVisible: false, // 选择货品对话框
      enableSubmit: true, // 控制请求一个一个提交
      adjustTakeVisible: false, // 提取成品采购入库单
      templateVisible: false,
      importOption: {
        OrderType:
          SettingAiimportTempletOrderType.StockingCloudGoodsIntakeOrderBasic,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        KindTypeEk: 0,
        SmallType: 0
      },
      filePath: '',
      fileList: [],
      ExportVisible: false, // 导出弹窗
      ExportColumns: [
        {
          FieldEnName: 'BarCode',
          FieldCnName: '条码'
        },
        {
          FieldEnName: 'StyleCode',
          FieldCnName: '款号'
        },
        {
          FieldEnName: 'GoodsName',
          FieldCnName: '货品名称'
        },
        {
          FieldEnName: 'RetailType1Name',
          FieldCnName: '调价前零售方式'
        },
        {
          FieldEnName: 'RetailPrice1',
          FieldCnName: '调价前零售价/工费',
          Precision: 2
        },
        {
          FieldEnName: 'RetailType2Name',
          FieldCnName: '调价后零售方式'
        },
        {
          FieldEnName: 'RetailPrice2',
          FieldCnName: '调价后零售价/工费',
          Precision: 2
        }
      ],
      currentRow: {},
      errorVisible: false
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.adjustId = parseInt(query.id)
      if (!this.adjustId) {
        this.dataError()
      } else {
        this.getDetail()
        this.getGoods()
      }
    },
    dataError(msg) {
      this.$confirm(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },
    getDetail() {
      STOCKING_API_GOODS_PRICE_ORDER_BASIC_GET({
        PriceId: this.adjustId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.editForm = res.data.Data
          this.detail = Object.assign({}, res.data.Data)
        }
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_GOODS_PRICE_ORDER_ITEM_GETS({
        PriceId: this.adjustId,
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: this.pg,
        PageSize: this.size
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.goodsData.forEach(item => {
            item.RetailPrice2 = this.$root.toFloat(item.RetailPrice2)
          })
          this.total = res.data.Data.Count
        }
        this.enableSubmit = true
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    pageChange(val) {
      this.pg = val
      this.getGoods()
    },
    pageSizeChange(val) {
      this.pg = 1
      this.size = val
      this.getGoods()
    },
    listenSelectGoods() {
      this.dialogSelectGoodsVisible = false
    },
    listenAddGoods(data, isClose) {
      let codes = []
      data.forEach(item => {
        codes.push(item.BarCode)
      })
      this.dialogSelectGoodsVisible = !isClose
      this.addGoods(codes)
    },
    listenMultiCodeEnter(codes) {
      if (codes.length) {
        this.addGoods(codes)
      } else {
        this.multiCodeVisible = false
      }
    },
    listenEditDialog(form, flag) {
      if (flag) {
        this.detail = Object.assign(this.detail, form)
      } else {
        this.editForm = Object.assign({}, this.detail)
      }
      this.editDialog = false
    },
    codeEnter() {
      this.addGoods([this.code])
    },
    addGoods(items) {
      STOCKING_API_GOODS_PRICE_ORDER_ITEM_CREATE({
        PriceId: this.adjustId,
        BarCodes: items
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: res.data.Message,
            type: 'success'
          })
          this.getGoods()
          this.multiCodeVisible = false
        } else {
          this.$confirm(res.data.Message, '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'error'
          })
        }
        this.code = ''
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    delGood($event, row) {
      $event.currentTarget.blur()
      this.$confirm('确定删除此货品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        STOCKING_API_GOODS_PRICE_ORDER_ITEM_DELETE({
          PriceId: row.PriceId,
          ItemId: row.ItemId
        }).then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            if (this.goodsData.length === 1) {
              this.pg = 1
            }
            this.getGoods()
          } else {
            this.$message.error(res.data.Message)
          }
        })
      })
    },
    updateItem(row) {
      if (!/^(\d+|\d+.\d+)$/.test(row.RetailPrice2)) {
        this.$message({
          message: '请输入数字',
          type: 'warning'
        })
      } else {
        STOCKING_API_GOODS_PRICE_ORDER_ITEM_UPDATE({
          PriceId: row.PriceId,
          ItemId: row.ItemId,
          RetailType2: row.RetailType2,
          RetailPrice2: this.$root.toInt(row.RetailPrice2)
        }).then(res => {
          if (res.data.Code === 'ERROR') {
            this.$message.error(res.data.Message)
          } else {
            this.$message.success(res.data.Message)
            this.enableSubmit = true
          }
        })
      }
    },
    focusItem(row) {
      this.currentRow = row
      this.enableSubmit = false
    },
    orderSubmit() {
      if (!this.goodsData.length) {
        this.$message('请添加需要调价的货品', 'error')
      } else if (this.enableSubmit) {
        this.$store.commit('SET_BTN_LOADING', true)
        STOCKING_API_GOODS_PRICE_ORDER_BASIC_WAIT({
          PriceId: this.adjustId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success(res.data.Message)
            this.$store.commit('SET_BTN_LOADING', false)
            this.$router.push({
              path: '/sales/adjust/index'
            })
          } else {
            this.$message.error(res.data.Message)
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      } else {
        this.updateItem(this.currentRow)
        this.enableSubmit = true
      }
    },
    showDetailDialog(goodsId) {
      this.goodDetailDialog = {
        goodsId: goodsId,
        visible: true
      }
    },
    takeOrder(command) {
      if (command === 'purchase') {
        this.adjustTakeVisible = true
      }
    },
    listenAdjustTakeDialog(data) {
      if (data) {
        STOCKING_API_GOODS_PRICE_ORDER_ITEM_SELECTINTAKECREATE({
          PriceId: this.adjustId,
          IntakeId: data
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.pg = 1
            this.getGoods()
            this.adjustTakeVisible = false
          } else {
            this.$alert(res.data.Message, '错误', {
              dangerouslyUseHTMLString: true
            })
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      } else {
        this.adjustTakeVisible = false
      }
    },
    importSubmit(key) {
      STOCKING_API_GOODS_PRICE_ORDER_ITEM_IMPORTITEM({
        PriceId: this.adjustId,
        FilePath: key
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '导入调价信息成功',
            type: 'success'
          })
          this.templateVisible = false
          this.getGoods()
        } else if (
          res.data.Code === 'ERROR' &&
          res.data.Data != '' &&
          Array.isArray(JSON.parse(res.data.Data))
        ) {
          this.errorInfo = res.data.Data
          this.errorVisible = true
        }
      })
      this.$store.commit('SET_BTN_LOADING', false)
    },
    downLoadData() {
      STOCKING_API_GOODS_PRICE_ORDER_ITEM_EXPORTITEM({
        PriceId: this.adjustId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          window.open(this.$root.settings.DOMAIN_EXCEL + '/' + res.data.Data)
          this.ExportVisible = false
        } else {
          this.$message.error(res.data.Data)
        }
      })
    }
  },
  mounted() {
    this.init()
  },
  components: {
    pagination,
    SelectGoods,
    MultiCodeEnter,
    basicEdit,
    goodDetail,
    AdjustTake,
    adjustImport,
    importErrorTable
  }
}
</script>

<style lang="scss">
.import-purchase-dialog {
  .el-dialog {
    width: 418px;
  }
  .download-modflie {
    margin: 0 auto;
    padding: 10px 0;
    width: 360px;
    text-align: right;
    color: #20a0ff;
  }
  .el-dialog__body {
    padding: 10px 30px;
    .el-upload-dragger {
      margin: 0 0 20px;
    }
    .el-upload__tip {
      text-align: left;
    }
  }
}
</style>
<style lang="scss" scoped>
.code-input {
  margin-right: 10px;
  vertical-align: middle;
}
.el-input-number {
  width: 100%;
}
</style>
