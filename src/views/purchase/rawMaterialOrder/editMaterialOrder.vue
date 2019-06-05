<template>
  <div class="content" v-loading="$store.getters.tb_loading">
    <div class="mb">
      <div class="title mb">
        <span>编辑原料订货单（{{stuffType.Types[StuffType]}}）</span>
        <el-button name="btnEdit" @click="openEdit" class="el-back" type="text">修改</el-button>
      </div>

      <tabulation :data="item"></tabulation>
    </div>
    <div class="mb">
      <div class="mb">
        <el-row>
          <el-col :span="12">
            <!-- <el-button type="primary" name="btnDialogSelectGoods" @click="templateVisible = true">按模板导入</el-button>
            <el-button type="primary" name="btnDialogSelectGoods" @click="smartVisible = true">智能导入</el-button>-->
          </el-col>
          <el-col :span="12" class="tr" style="padding-right: 10px;"></el-col>
        </el-row>
      </div>
      <!-- @module 数据表格 -->
      <!-- 金料 -->
      <el-table
        :data="data"
        ref="halfTable"
        element-loading-text="拼命加载中"
        :row-class-name="setEditRow"
        v-loading="tableLoading"
        highlight-current-row
        v-if="tableData.StuffType == stuffType.Gold"
        class="m-b-10 edit-table"
        v-scrollshow="handelScrollshow"
        height="600"
      >
        <el-table-column label="操作" width="100" fixed>
          <template slot-scope="scope">
            <div class="handle-btn">
              <i
                name="addShow"
                class="icon-add1 handel-icon"
                @click="addShow(scope)"
                style="color: #1f91df"
                title="新增一行"
              ></i>
              <i
                name="deleteShow"
                class="icon-reduce1 handel-icon"
                @click="deleteShow(scope)"
                style="color: #d74040"
                title="删除此行"
              ></i>
              <i
                name="copyShow"
                class="icon-copy1 handel-icon"
                @click="copyShow(scope)"
                style="color: #7798af"
                title="复制此行"
              ></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="序号" width="50" type="index"></el-table-column>
        <el-table-column label="成色" min-width="100">
          <template slot="header">
            <span class="red">*</span>成色
          </template>
          <template slot-scope="scope">
            <el-select
              filterable
              name="GoldType"
              v-model="scope.row.GoldType"
              @change="handleFocus(scope.row)"
            >
              <el-option label="请选择" :value="0"></el-option>
              <template v-for="(item,index) in majorList">
                <el-option
                  v-if="item.State === YNStatus.Yes"
                  :key="index"
                  :label="item.Value"
                  :value="Number(item.Id)"
                ></el-option>
              </template>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="金重(g)" min-width="100">
          <template slot-scope="scope">
            <el-input
              name="Weight"
              v-model="scope.row.Weight"
              @focus="handleFocus(scope.row)"
              @keyup.native="scope.row.Weight = $root.toFixed(scope.row.Weight, 3)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="件数" min-width="100">
          <template slot-scope="scope">
            <el-input
              name="Quantity"
              v-model="scope.row.Quantity"
              @focus="handleFocus(scope.row)"
              @keyup.native="scope.row.Quantity = $root.toFixed(scope.row.Quantity, 0)"
            ></el-input>
            <!-- <el-input name="Quantity" v-model="scope.row.Quantity" @keyup.native="scope.row.Quantity = toFixed(scope.row.Quantity, 0)" @focus="handleFocus(scope.row)"></el-input> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 石料 -->
      <el-table
        :data="data"
        ref="halfTable"
        element-loading-text="拼命加载中"
        highlight-current-row
        v-else-if="tableData.StuffType == stuffType.Stone"
        class="m-b-10 edit-table"
        v-scrollshow="handelScrollshow"
        :row-class-name="setEditRow"
        v-loading="tableLoading"
        height="600"
      >
        <el-table-column label="操作" width="100" fixed>
          <template slot-scope="scope">
            <div class="handle-btn">
              <i
                name="addShow"
                class="icon-add1 handel-icon"
                @click="addShow(scope)"
                style="color: #1f91df"
                title="新增一行"
              ></i>
              <i
                name="deleteShow"
                class="icon-reduce1 handel-icon"
                @click="deleteShow(scope)"
                style="color: #d74040"
                title="删除此行"
              ></i>
              <i
                name="copyShow"
                class="icon-copy1 handel-icon"
                @click="copyShow(scope)"
                style="color: #7798af"
                title="复制此行"
              ></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column label="*石类" min-width="100">
          <template slot="header">
            <span class="red">*</span>石类
          </template>
          <template slot-scope="scope">
            <el-select
              filterable
              name="StoneClassTypeEk"
              v-model="scope.row.StoneClassTypeEk"
              @change="handleFocus(scope.row, scope.row.StoneClassTypeEk, '石类')"
            >
              <el-option label="请选择" :value="0"></el-option>
              <template v-for="(item,index) in majorList">
                <el-option
                  v-if="item.State === YNStatus.Yes"
                  :key="index"
                  :label="item.Value"
                  :value="Number(item.Id)"
                ></el-option>
              </template>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="石重范围(ct)" min-width="100">
          <template slot-scope="scope">
            <el-select
              filterable
              name="StoneWeightEk"
              v-model="scope.row.StoneWeightEk"
              @change="handleFocus(scope.row, scope.row.StoneWeightEk, '石重范围')"
            >
              <el-option label="请选择" :value="0"></el-option>
              <template v-for="(item,index) in stoneRange">
                <el-option
                  v-if="item.State === YNStatus.Yes"
                  :key="index"
                  :label="item.Value"
                  :value="Number(item.Id)"
                ></el-option>
              </template>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="颜色" min-width="100">
          <template slot-scope="scope">
            <el-select
              filterable
              name="StoneColor"
              v-model="scope.row.StoneColor"
              @change="handleFocus(scope.row)"
            >
              <el-option label="请选择" :value="0"></el-option>
              <el-option
                v-for="(item,index) in stoneColor.TypeArray"
                :key="index"
                :label="item.Value"
                :value="Number(item.KeyId)"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="净度" min-width="100">
          <template slot-scope="scope">
            <el-select
              filterable
              name="StoneClarity"
              v-model="scope.row.StoneClarity"
              @change="handleFocus(scope.row)"
            >
              <el-option label="请选择" :value="0"></el-option>
              <el-option
                v-for="(item,index) in stoneClarity.TypeArray"
                :key="index"
                :label="item.Value"
                :value="Number(item.KeyId)"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="切工" min-width="100">
          <template slot-scope="scope">
            <!-- <el-input v-model="scope.row.StoneCut" @blur="handleFocus(scope.row)"></el-input> -->
            <el-select
              filterable
              name="StoneCut"
              v-model="scope.row.StoneCut"
              @change="handleFocus(scope.row)"
            >
              <el-option label="请选择" :value="0"></el-option>
              <el-option
                v-for="item in StoneCut.TypeArray"
                :key="item.KeyId"
                :label="item.Value"
                :value="Number(item.KeyId)"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="规格" min-width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.StoneSpec" @blur="handleFocus(scope.row)"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="数量" min-width="100">
          <template slot-scope="scope">
            <el-input
              v-model.number="scope.row.Quantity"
              @keyup.native="scope.row.Quantity = $root.toFixed(scope.row.Quantity, 0)"
              @blur="handleFocus(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="重量(ct)" min-width="100">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.Weight"
              @blur="handleFocus(scope.row)"
              @keyup.native="scope.row.Weight = $root.toFixed(scope.row.Weight, 3)"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
      <!-- 配件 -->
      <el-table
        :data="data"
        ref="halfTable"
        element-loading-text="拼命加载中"
        :row-class-name="setEditRow"
        v-loading="tableLoading"
        highlight-current-row
        v-else-if="tableData.StuffType == stuffType.Part"
        class="m-b-10 edit-table"
        v-scrollshow="handelScrollshow"
        height="600"
      >
        <el-table-column label="操作" width="100" fixed>
          <template slot-scope="scope">
            <div class="handle-btn">
              <i
                name="addShow"
                class="icon-add1 handel-icon"
                @click="addShow(scope)"
                style="color: #1f91df"
                title="新增一行"
              ></i>
              <i
                name="deleteShow"
                class="icon-reduce1 handel-icon"
                @click="deleteShow(scope)"
                style="color: #d74040"
                title="删除此行"
              ></i>
              <i
                name="copyShow"
                class="icon-copy1 handel-icon"
                @click="copyShow(scope)"
                style="color: #7798af"
                title="复制此行"
              ></i>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column label="配件名称" min-width="100">
          <template slot="header">
            <span class="red">*</span>配件名称
          </template>
          <template slot-scope="scope">
            <el-select
              filterable
              name="PartTypeEk"
              v-model="scope.row.PartTypeEk"
              @change="handleFocus(scope.row, scope.row.PartTypeEk, '配件名称')"
            >
              <el-option label="请选择" :value="0"></el-option>
              <template v-for="(item,index) in majorList">
                <el-option
                  v-if="item.State === YNStatus.Yes"
                  :key="index"
                  :label="item.Value"
                  :value="Number(item.Id)"
                ></el-option>
              </template>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="数量" min-width="100">
          <template slot-scope="scope">
            <el-input
              name="Quantity"
              @keyup.native="scope.row.Quantity = $root.toFixed(scope.row.Quantity, 0)"
              v-model="scope.row.Quantity"
              @focus="handleFocus(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="重量" min-width="100">
          <template slot-scope="scope">
            <el-input
              name="Weight"
              v-model="scope.row.Weight"
              @keyup.native="scope.row.Weight = $root.toFixed(scope.row.Weight, 3)"
              @focus="handleFocus(scope.row)"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :pg="parameters.PageIndex"
        :size="parameters.PageSize"
        :total="total"
        @currentChange="currentChange"
        @sizeChange="sizeChange"
      ></pagination>
      <!-- End 数据表格 -->
    </div>
    <!-- 增加行数 -->
    <el-dialog title="插入空白行" :visible.sync="addVisible" width="450px">
      <el-form :model="addLineForm" ref="addLineForm">
        <el-form-item label="行数：" prop="rowsNum">
          <el-input
            name="rowsNum"
            v-model="addLineForm.rowsNum"
            @keyup.native="addLineForm.rowsNum = $root.toFixed(addLineForm.rowsNum, 0)"
            style="width: 200px"
          ></el-input>
          <span style="color: #999; margin-left: 10px;">(最多50行)</span>
        </el-form-item>
        <!-- <el-form-item label="位置：" prop="local">
          <el-radio-group name="local" v-model="addLineForm.local">
            <el-radio label="1">向下插入</el-radio>
            <el-radio label="2">向上插入</el-radio>
          </el-radio-group>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnAdd" type="primary" @click="addSure">确定</el-button>
        <el-button name="btnClose" @click="addVisible=false">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 增加行数 -->
    <!-- 复制行 -->
    <el-dialog title="复制当前行" :visible.sync="copyVisible" width="450px">
      <el-form :model="copyLineForm">
        <el-form-item label="行数：">
          <el-input
            name="rowsNum"
            v-model="copyLineForm.rowsNum"
            @keyup.native="copyLineForm.rowsNum = $root.toFixed(copyLineForm.rowsNum, 0)"
            style="width: 200px"
          ></el-input>
          <span style="color: #999; margin-left: 10px;">(最多50行)</span>
        </el-form-item>
        <!-- <el-form-item label="位置：">
          <el-radio-group name="local" v-model="copyLineForm.local">
            <el-radio label="1">向下复制</el-radio>
            <el-radio label="2">
              复制到第
              <el-input-number
                name="rowsNum"
                v-model="copyLineForm.current"
                :controls="false"
                style="width: 50px"
              ></el-input-number>行
            </el-radio>
          </el-radio-group>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnCopy" type="primary" @click="copySure">确定</el-button>
        <el-button name="btnClose" @click="copyVisible=false">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 复制行 -->
    <div class="buttons">
      <el-button
        v-if="isSaved"
        @click="save"
        type="primary"
        name="btnSave"
        :loading="$store.getters.is_loading"
      >保存</el-button>
      <el-button
        v-if="(tableData.State == orderBasicState.Draft || tableData.State == orderBasicState.Reject) && !isSaved"
        @click="orderSubmit"
        type="primary"
        name="btnsubmitAudit"
      >提交审核</el-button>
      <el-button name="btnBack" @click="$router.back(-1)">返回</el-button>
    </div>
    <el-dialog
      :title="`修改原料订货单(${stuffType.Types[tableData.StuffType]})`"
      :visible.sync="newVisible"
      width="500px"
      @close="closeNewForm"
    >
      <el-form :model="newStyleData" label-width="120px" :rules="newRules" ref="newForm">
        <el-form-item label="供应商：" prop="PartnerId">
          <el-select
            name="PartnerId"
            v-model="newStyleData.PartnerId"
            placeholder="请选择供应商"
            :filterable="true"
          >
            <template v-for="(item,index) in supplierDown">
              <el-option
                v-if="item.State === YNStatus.Yes && (item.PartnerType == partnerType.Merchant || item.PartnerType == partnerType.Supplier)"
                :key="index"
                :label="item.Value"
                :value="Number(item.Id)"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="业务日期：" prop="ActualDate">
          <el-date-picker
            :clearable="false"
            name="ActualDate"
            v-model="newStyleData.ActualDate"
            value-format="yyyy-MM-dd"
            :picker-options="$store.getters.businessDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="应付款：" prop="Preprice">
          <el-input
            name="Preprice"
            v-model="newStyleData.Preprice"
            @keyup.native="newStyleData.Preprice = $root.toFixed(newStyleData.Preprice, 2, true)"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="预计到货日期：" prop="ForwdDate">
          <el-date-picker
            :clearable="false"
            name="ForwdDate"
            v-model="newStyleData.ForwdDate"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注：" prop="Note">
          <el-input
            name="Note"
            type="textarea"
            @blur="newStyleData.Note = newStyleData.Note.trim()"
            v-model="newStyleData.Note"
            maxlength="200"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnSave" type="primary" @click="newSave('newForm')">保存</el-button>
        <el-button name="btnClose" @click="closeNewForm">取消</el-button>
      </div>
    </el-dialog>
    <!-- 模板导入 -->
    <!-- <template-import :visible.sync="templateVisible" :option="importOption" :root="`${$root.filePaths.STOCKING_SALE}/MeterialOrder`" @submit="importSubmit"></template-import> -->
    <!-- 智能导入 -->
    <!-- <smart-import :visible.sync="smartVisible" :option="importOption" :root="`${$root.filePaths.STOCKING_SALE}/MeterialOrder`" @submit="importSubmit"></smart-import> -->
  </div>
</template>

<script>
import {
  YNStatus,
  StoreType,
  PurchaseType,
  StuffType,
  PartnerType
} from '@/enums/common.js'
import {
  SettingEnumeratorEnumeratorType,
  StuffPurchaseOrderBasicState,
  SettingCustomizedFieldOrderType,
  GoldType,
  StoneColor,
  StoneClarity,
  StoneCut
} from '@/enums/stocking'
import {
  STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_UPDATE,
  STOCKING_API_STUFF_PURCHASE_ORDER_ITEM_CREATE,
  STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_WAIT,
  STOCKING_API_STUFF_PURCHASE_ORDER_ITEM_UPDATE,
  STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_GET,
  STOCKING_API_STUFF_PURCHASE_ORDER_ITEM_GETS,
  STOCKING_API_STUFF_PURCHASE_ORDER_ITEM_DELETE
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST,
  MERCHANT_API_DROPDOWN_PARTNERBASICLIST,
  MERCHANT_API_DROPDOWN_STORELIST
} from '@/apis/merchant.js'
import tabulation from '@/components/scrm/tabulation.vue'
import pagination from '@/components/pagination'
import templateImport from '@/components/erp/templateImport'
import smartImport from '@/components/erp/smartImport'
import dayjs from 'dayjs'
export default {
  components: {
    tabulation,
    pagination,
    templateImport,
    smartImport
  },
  data() {
    return {
      StoneCut,
      partnerType: PartnerType,
      YNStatus,
      storeType: StoreType, // 门店类型
      purchaseType: PurchaseType, // 进货方式
      goldType: GoldType, // 成色下拉
      stuffType: StuffType, // 原料下拉
      stoneColor: StoneColor, // 颜色
      stoneClarity: StoneClarity,
      orderBasicState: StuffPurchaseOrderBasicState,
      kind: [], // 种类
      storeList: [], // 门店下拉
      item: [],
      tableData: {
        KindTypeEv: ''
      },
      data: [],
      addVisible: false, // 插入空白行弹窗
      addLineForm: {
        rowsNum: 1,
        local: '1'
      }, // 空白行参数
      copyVisible: false, // 删除当前行弹窗
      copyLineForm: {
        rowsNum: 1,
        local: '1',
        current: 1
      }, // 复制行参数
      currentRow: {}, // 当前选中行
      handleRow: {}, // 要进行操作的数据行
      selectGoodsVisible: false, // 选择款式弹窗
      lessVisible: false,
      parameters: {
        PurchaseId: '',
        PageIndex: 1,
        PageSize: 20
      }, // 款式商品筛选
      total: 0,
      selectGoods: {
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }, // 款式样式筛选
      selectGoodsData: [], // 款式弹窗数据
      selectGoodsTotal: 0, // 款式总数
      selectGoodsTitle: '', // 款式标题
      selectGoodsObj: {}, // 选择款式数据
      expandRows: [], // 新增款式数据
      selectRows: null, // 选择行数
      storeStyleVisible: false, // 选择门店款式订货单
      selectStoreOrder: {
        StorechterId: '0',
        RequireCode: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      selectStoreData: [], // 门店需求单数据
      selectStoreTotal: 0, // 门店需求单总数
      selectStoreObj: {}, // 选择门店需求单数据
      newStyleData: {},
      newRules: {
        PartnerId: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],
        ActualDate: [
          { required: true, message: '请选择业务日期', trigger: 'change' }
        ]
      }, // 新建验证
      newVisible: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date()
        }
      },
      pickersOptions: {
        disabledDate(time) {
          return time.getTime() < new Date()
        }
      },
      supplierDown: [], // 供应商下拉
      templateVisible: false,
      smartVisible: false,
      importOption: {
        OrderType:
          SettingCustomizedFieldOrderType.StockingCloudStuffPurchaseOrderBasic,
        KindTypeEk: 0,
        LargeType: 0,
        SmallType: 0
      },
      majorList: [],
      stoneRange: [],
      isSaved: false,
      saveLoading: false,
      currentStartIndex: 0,
      currentEndIndex: 20,
      tableLoading: false,
      StuffType: 0
    }
  },
  methods: {
    setEditRow({ row }) {
      if (row.isEdit) {
        return 'edit-row'
      }
      if (row.isError) {
        return 'error-row'
      }
    },
    handelScrollshow(currentStartIndex, currentEndIndex) {
      this.currentStartIndex = currentStartIndex
      this.currentEndIndex = currentEndIndex
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_GET({
        PurchaseId: this.parameters.PurchaseId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          const detail = res.data.Data
          this.newStyleData = {
            ...res.data.Data,
            Preprice: this.$root.toFloat(res.data.Data.Preprice)
          }
          this.tableData = res.data.Data
          this.importOption.KindTypeEk = res.data.Data.StuffType
          this.item = [
            [
              {
                title: '单号',
                content: detail.PurchaseCode
              },
              {
                title: '创建',
                content: `${detail.CreateUser} ${this.schemeDate(
                  detail.CreateTime
                )}`
              },
              {
                title: '审核',
                content:
                  detail.State === this.orderBasicState.Audit ||
                  detail.State === this.orderBasicState.Reject
                    ? `${detail.CheckUser} ${this.schemeDate(detail.CheckTime)}`
                    : '-'
              }
            ],
            [
              {
                title: '供应商',
                content: detail.PartnerName
              },
              {
                title: '业务日期',
                content: this.filterDate(detail.ActualDate)
              },

              {
                title: '应付款',
                content: this.$root.toFloat(detail.Preprice)
              }
            ],
            [
              {
                title: '预计到货日期',
                content: this.filterDate(detail.ForwdDate)
              },
              {
                title: '备注',
                content: detail.Note
              },
              {
                title: '',
                content: ''
              }
            ]
          ]
          this.getTypeList()
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    getItems() {
      // 货品列表
      this.tableLoading = true
      STOCKING_API_STUFF_PURCHASE_ORDER_ITEM_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          const data = res.data.Data.Rows || []
          if (data.length == 0) {
            for (let i = data.length; i < 10; i++) {
              if (this.StuffType == StuffType.Gold) {
                this.data.push({
                  PurchaseId: this.parameters.PurchaseId,
                  GoldType: 0,
                  Weight: 0,
                  Quantity: '',
                  isEdit: false,
                  isError: false
                })
              } else if (this.StuffType == StuffType.Stone) {
                this.data.push({
                  PurchaseId: this.parameters.PurchaseId,
                  StoneClassTypeEk: 0,
                  StoneClassTypeEv: '',
                  StoneWeightEk: 0,
                  StoneWeightEv: '',
                  StoneColor: 0,
                  StoneClarity: 0,
                  StoneCut: 0,
                  StoneSpec: '',
                  Quantity: '',
                  Weight: '',
                  isEdit: false,
                  isError: false
                })
              } else if (this.StuffType == StuffType.Part) {
                this.data.push({
                  PurchaseId: this.parameters.PurchaseId,
                  PartTypeEk: 0,
                  PartTypeEv: '',
                  Quantity: '',
                  Weight: '',
                  isEdit: false,
                  isError: false
                })
              }
            }
          } else {
            this.data = data.map(item => {
              return {
                ...item,
                Weight: this.$root.toFloat(item.Weight, 3)
              }
            })
          }
          this.total = res.data.Data.Count || 0
        }
        this.tableLoading = false
      })
    },
    schemeDate(data) {
      const ignore = ['1900', '9999']
      if (!data || ignore.indexOf(dayjs(data).format('YYYY')) > -1) {
        return '-'
      }
      if (parseInt(dayjs(data).format('YYYY')) === new Date().getFullYear()) {
        return dayjs(data).format('MM-DD HH:mm:ss')
      }
      return dayjs(data).format('YYYY-MM-DD HH:mm:ss')
    },
    filterDate(value, fomatter = 'YYYY-MM-DD') {
      const ignore = ['1900', '9999']
      if (!value || ignore.indexOf(dayjs(value).format('YYYY')) > -1) {
        return '-'
      }
      if (parseInt(dayjs(value).format('YYYY')) === new Date().getFullYear()) {
        return dayjs(value).format(fomatter.replace('YYYY-', ''))
      }
      return dayjs(value).format(fomatter)
    },
    handleCurrentChange(row, oldRow) {
      this.currentRow = row
      this.isSaved = true
      let api
      if (oldRow) {
        if (row === null) {
          return
        }
        let para = {}
        if (this.tableData.StuffType == StuffType.Gold) {
          if (oldRow.GoldType == '' || oldRow.GoldType == 0) {
            return this.$message.error('请选择成色')
          }
          if (oldRow.Weight == '' || oldRow.Weight == 0) {
            return this.$message.error('请输入金重')
          }
          if (oldRow.Quantity == '' || oldRow.Quantity == 0) {
            return this.$message.error('请输入件数')
          }
          if (!/(^[1-9]\d*$)/.test(oldRow.Quantity)) {
            return this.$message.error('请输入正确件数')
          }
          para = {
            ...oldRow,
            Quantity: parseInt(oldRow.Quantity),
            Weight: this.$root.toInt(oldRow.Weight)
          }
        } else if (this.tableData.StuffType == StuffType.Stone) {
          if (oldRow.StoneClassTypeEk == '' || oldRow.StoneClassTypeEk == 0) {
            return this.$message.error('请选择石类')
          }
          if (oldRow.Quantity == '' || oldRow.Quantity == 0) {
            return this.$message.error('请输入数量')
          }
          if (!/(^[1-9]\d*$)/.test(oldRow.Quantity)) {
            return this.$message.error('请输入正确数量')
          }
          para = {
            ...oldRow,
            StoneCut: Number(oldRow.StoneCut),
            Quantity: parseInt(oldRow.Quantity),
            Weight: this.$root.toInt(oldRow.Weight)
          }
        } else if (this.tableData.StuffType == StuffType.Part) {
          if (oldRow.PartTypeEk == '' || oldRow.PartTypeEk == 0) {
            return this.$message.error('请选择配件名称')
          }
          if (oldRow.Quantity == '' || oldRow.Quantity == 0) {
            return this.$message.error('请输入数量')
          }
          if (!/(^[1-9]\d*$)/.test(oldRow.Quantity)) {
            return this.$message.error('请输入正确数量')
          }
          para = {
            ...oldRow,
            Quantity: parseInt(oldRow.Quantity),
            Weight: this.$root.toInt(oldRow.Weight)
          }
        }
        if (oldRow.isNew) {
          api = STOCKING_API_STUFF_PURCHASE_ORDER_ITEM_CREATE
        } else {
          api = STOCKING_API_STUFF_PURCHASE_ORDER_ITEM_UPDATE
        }

        this.saveLoading = true
        api(para).then(res => {
          this.saveLoading = false
          if (res.data.Code === 'CORRECT') {
            this.$message.success('保存成功')
            if (oldRow.isNew) {
              this.$set(oldRow, 'ItemId', res.data.Data)
              oldRow.isNew = false
            }
          }
        })
      }
    },
    handleFocus(row, value, name) {
      row.isEdit = true
      row.isError = false
      this.isSaved = true
      if (value) {
        if (name == '配件名称') {
          const obj = this.majorList.find(item => item.Id == value)
          row.PartTypeEv = obj.Value
        } else if (name == '石类') {
          const obj = this.majorList.find(item => item.Id == value)
          row.StoneClassTypeEv = obj.Value
        } else if (name == '石重范围') {
          const obj = this.stoneRange.find(item => item.Id == value)
          console.log(obj)
          row.StoneWeightEv = obj.Value
        }
      }
    },
    addShow(scope) {
      // 插入空白行弹窗
      this.addVisible = true
      this.handleRow = scope
    },
    addSure() {
      // 确定插入空白行
      if (parseFloat(this.addLineForm.rowsNum) > 50) {
        this.$message.warning('最多新增50行')
        return false
      }
      const local = this.addLineForm.local == 1 ? 1 : 0
      for (let i = 0; i < this.addLineForm.rowsNum; i++) {
        // this.data.splice(this.handleRow.$index + local, 0, {
        //   PurchaseId: this.parameters.PurchaseId,
        //   GoldType: 0,
        //   Weight: 0,
        //   Quantity: 0,
        //   isEdit: false,
        //   isError: false
        // })
        if (this.tableData.StuffType == StuffType.Gold) {
          this.data.splice(this.handleRow.$index + local, 0, {
            PurchaseId: this.parameters.PurchaseId,
            GoldType: 0,
            Weight: 0,
            Quantity: '',
            isEdit: false,
            isError: false
          })
        } else if (this.tableData.StuffType == StuffType.Stone) {
          this.data.splice(this.handleRow.$index + local, 0, {
            PurchaseId: this.parameters.PurchaseId,
            StoneClassTypeEk: 0,
            StoneClassTypeEv: '',
            StoneWeightEk: 0,
            StoneWeightEv: '',
            StoneColor: 0,
            StoneClarity: 0,
            StoneCut: 0,
            StoneSpec: '',
            Quantity: '',
            Weight: '',
            isEdit: false,
            isError: false
          })
        } else if (this.tableData.StuffType == StuffType.Part) {
          this.data.splice(this.handleRow.$index + local, 0, {
            PurchaseId: this.parameters.PurchaseId,
            PartTypeEk: 0,
            PartTypeEv: '',
            Quantity: '',
            Weight: '',
            isEdit: false,
            isError: false
          })
        }
      }
      this.closeAddSure()
    },
    closeAddSure() {
      this.$refs['addLineForm'].resetFields()
      this.addVisible = false
    },
    deleteShow(scope) {
      if (
        this.data.length <= 1 &&
        !scope.row.ItemId &&
        this.parameters.PageIndex === 1
      ) {
        this.$message.warning('至少保留一行')
        return false
      }
      this.$confirm('是否删除当前行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!scope.row.ItemId) {
          this.data.splice(scope.$index, 1)
          if (this.data.length === 0) {
            this.parameters.PageIndex = 1
            this.getItems()
          }
        } else {
          STOCKING_API_STUFF_PURCHASE_ORDER_ITEM_DELETE({
            ItemId: scope.row.ItemId,
            PurchaseId: scope.row.PurchaseId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.data.splice(scope.$index, 1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              if (this.data.length === 0) {
                if (this.parameters.PageIndex > 1) {
                  this.parameters.PageIndex = 1
                  this.getItems()
                } else {
                  if (this.tableData.StuffType == StuffType.Gold) {
                    this.data.push({
                      PurchaseId: this.parameters.PurchaseId,
                      GoldType: 0,
                      Weight: 0,
                      Quantity: '',
                      isEdit: false,
                      isError: false
                    })
                  } else if (this.tableData.StuffType == StuffType.Stone) {
                    this.data.push({
                      PurchaseId: this.parameters.PurchaseId,
                      StoneClassTypeEk: 0,
                      StoneClassTypeEv: '',
                      StoneWeightEk: 0,
                      StoneWeightEv: '',
                      StoneColor: 0,
                      StoneClarity: 0,
                      StoneCut: 0,
                      StoneSpec: '',
                      Quantity: '',
                      Weight: '',
                      isEdit: false,
                      isError: false
                    })
                  } else if (this.tableData.StuffType == StuffType.Part) {
                    this.data.push({
                      PurchaseId: this.parameters.PurchaseId,
                      PartTypeEk: 0,
                      PartTypeEv: '',
                      Quantity: '',
                      Weight: '',
                      isEdit: false,
                      isError: false
                    })
                  }
                }
              }
            }
          })
        }
      })
    },
    copyShow(scope) {
      this.copyVisible = true
      this.handleRow = scope
    },
    copySure() {
      if (parseFloat(this.copyLineForm.rowsNum) > 50) {
        this.$message.warning('最多50行')
        return false
      }
      if (
        (!Number(this.copyLineForm.current) ||
          parseFloat(this.copyLineForm.current) > this.data.length) &&
        this.copyLineForm.local === '2'
      ) {
        this.$message.warning('正确输入行数')
        return false
      }
      // 确定复制
      let local
      if (this.copyLineForm.local == 1) {
        local = this.handleRow.$index + 1
      } else {
        local = this.copyLineForm.current - 1
      }
      for (let i = 0; i < this.copyLineForm.rowsNum; i++) {
        let item = { ...this.handleRow.row }
        item.isEdit = this.handleRow.row.ItemId || this.handleRow.row.isEdit
        if (item.ItemId) {
          item.ItemId = ''
        }
        if (item.isError) {
          item.isEdit = true
          item.isError = false
        }
        this.data.splice(local, 0, item)
      }
      // if(this.handleRow.row.ItemId) {
      //   let para = {}
      //   if(this.tableData.StuffType == StuffType.Gold) {
      //     para = {
      //       ...this.handleRow.row,
      //       Quantity: parseInt(this.handleRow.row.Quantity),
      //       Weight: this.$root.toInt(this.handleRow.row.Weight)
      //     }
      //   } else if(this.tableData.StuffType == StuffType.Stone) {
      //     para = {
      //       ...this.handleRow.row,
      //       StoneCut: Number(this.handleRow.row.StoneCut),
      //       Quantity: parseInt(this.handleRow.row.Quantity),
      //       Weight: this.$root.toInt(this.handleRow.row.Weight)
      //     }
      //   } else if(this.tableData.StuffType == StuffType.Part) {
      //     para = {
      //       ...this.handleRow.row,
      //       Quantity: parseInt(this.handleRow.row.Quantity),
      //       Weight: this.$root.toInt(this.handleRow.row.Weight)
      //     }
      //   }
      //   for (let i = 0; i < this.copyLineForm.rowsNum; i++) {
      //     this.createData(para).then(res => {
      //       if (res.data.Code === 'CORRECT') {
      //         this.data.splice(local, 0, {...this.handleRow.row, ItemId: res.data.Data})
      //       }
      //     })
      //   }
      // } else {
      //   for (let i = 0; i < this.copyLineForm.rowsNum; i++) {
      //     this.data.splice(local, 0, {
      //       ...this.handleRow.row,
      //       isNew: true
      //     })
      //   }
      // }
      this.isSaved = true
      this.copyVisible = false
    },
    async createData(data) {
      const res = await STOCKING_API_STUFF_PURCHASE_ORDER_ITEM_CREATE(data)
      return res
    },
    // 订货单商品数据分页
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
    },

    // 选择门店款式需求单数据分页
    storeStyleCurrent(val) {
      // 切换当前页
      this.selectStoreOrder.PageIndex = val
      this.getSelectStore()
    },
    storeStyleSize(val) {
      // 切换每页显示条数
      this.selectStoreOrder.PageIndex = 1
      this.selectStoreOrder.PageSize = val
      this.getSelectStore()
    },
    expandRow(val) {
      this.expandRows = val
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
    // 获取门店下拉
    getStoreList() {
      MERCHANT_API_DROPDOWN_STORELIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.storeList = res.data.Data.Rows
        }
      })
    },
    // 获取供应商下拉
    getSupplierList() {
      MERCHANT_API_DROPDOWN_PARTNERBASICLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.supplierDown = res.data.Data.Rows
        }
      })
    },

    async save() {
      // const oldRow = this.currentRow
      // let api
      // let para = {}
      // if (oldRow) {
      //   if(this.tableData.StuffType == StuffType.Gold) {
      //     if (oldRow.GoldType == '' || oldRow.GoldType == 0) {
      //       return this.$message.error('请选择成色')
      //     }
      //     if (oldRow.Weight == '' || oldRow.Weight == 0) {
      //       return this.$message.error('请输入金重')
      //     }
      //     if (oldRow.Quantity == '' || oldRow.Quantity == 0) {
      //       return this.$message.error('请输入件数')
      //     }
      //     if(!(/(^[1-9]\d*$)/.test(oldRow.Quantity))) {
      //       return this.$message.error('请输入正确件数')
      //     }
      //     para = {
      //       ...oldRow,
      //       Quantity: parseInt(oldRow.Quantity),
      //       Weight: this.$root.toInt(oldRow.Weight)
      //     }
      //   } else if(this.tableData.StuffType == StuffType.Stone) {
      //     if (oldRow.StoneClassTypeEk == '' || oldRow.StoneClassTypeEk == 0) {
      //       return this.$message.error('请选择石类')
      //     }
      //     if (oldRow.Quantity == '' || oldRow.Quantity == 0) {
      //       return this.$message.error('请输入数量')
      //     }
      //     if(!(/(^[1-9]\d*$)/.test(oldRow.Quantity))) {
      //       return this.$message.error('请输入正确数量')
      //     }
      //     para = {
      //       ...oldRow,
      //       StoneCut: Number(oldRow.StoneCut),
      //       Quantity: parseInt(oldRow.Quantity),
      //       Weight: this.$root.toInt(oldRow.Weight)
      //     }
      //   } else if(this.tableData.StuffType == StuffType.Part) {
      //     if (oldRow.PartTypeEk == '' || oldRow.PartTypeEk == 0) {
      //       return this.$message.error('请选择配件名称')
      //     }
      //     if (oldRow.Quantity == '' || oldRow.Quantity == 0) {
      //       return this.$message.error('请输入数量')
      //     }
      //     if(!(/(^[1-9]\d*$)/.test(oldRow.Quantity))) {
      //       return this.$message.error('请输入正确数量')
      //     }
      //     para = {
      //       ...oldRow,
      //       Quantity: parseInt(oldRow.Quantity),
      //       Weight: this.$root.toInt(oldRow.Weight)
      //     }
      //   }
      //   if (oldRow.isNew) {
      //     api = STOCKING_API_STUFF_PURCHASE_ORDER_ITEM_CREATE
      //   } else {
      //     api = STOCKING_API_STUFF_PURCHASE_ORDER_ITEM_UPDATE
      //   }

      //   this.saveLoading = true
      //   api(para).then(res => {
      //     this.saveLoading = false
      //     if (res.data.Code === 'CORRECT') {
      //       this.$message.success('保存成功')
      //       this.isSaved = false
      //     }
      //   })
      // }
      let haveEdit = false
      let haveError = false
      this.$store.commit('SET_BTN_LOADING', true)
      let errorlist = []
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i].isEdit) {
          haveEdit = true
        }
        if (this.data[i].isError) {
          haveError = true
        }
        if (this.data[i].isEdit || this.data[i].isError) {
          let param = { ...this.data[i] }
          if (this.tableData.StuffType == StuffType.Gold) {
            param.Quantity = parseInt(this.data[i].Quantity) || 0
            param.Weight = this.$root.toInt(this.data[i].Weight)
            if (this.data[i].GoldType == '' || this.data[i].GoldType == 0) {
              this.data[i].isEdit = false
              this.data[i].isError = true
              errorlist.push(`序号${i + 1}：请选择成色<br>`)
              continue
            }
            if (
              (this.data[i].Weight == '' || this.data[i].Weight == 0) &&
              (this.data[i].Quantity == '' || this.data[i].Quantity == 0)
            ) {
              this.data[i].isEdit = false
              this.data[i].isError = true
              errorlist.push(`序号${i + 1}：金重和件数不能同时为空<br>`)
              continue
            }
            // if (this.data[i].Weight == '' || this.data[i].Weight == 0) {
            //   this.data[i].isEdit = false
            //   this.data[i].isError = true
            //   errorlist.push(`序号${i + 1}：请输入金重<br>`)
            //   continue
            // }
            // if (this.data[i].Quantity == '' || this.data[i].Quantity == 0 || !(/(^[1-9]\d*$)/.test(this.data[i].Quantity))) {
            //   this.data[i].isEdit = false
            //   this.data[i].isError = true
            //   errorlist.push(`序号${i + 1}：请输入正确件数<br>`)
            //   continue
            // }
          } else if (this.tableData.StuffType == StuffType.Stone) {
            param.StoneCut = Number(this.data[i].StoneCut)
            param.Quantity = parseInt(this.data[i].Quantity) || 0
            param.Weight = this.$root.toInt(this.data[i].Weight)
            if (
              this.data[i].StoneClassTypeEk == '' ||
              this.data[i].StoneClassTypeEk == 0
            ) {
              this.data[i].isEdit = false
              this.data[i].isError = true
              errorlist.push(`序号${i + 1}：请选择石类<br>`)
              continue
            }
            if (
              (this.data[i].Weight == '' || this.data[i].Weight == 0) &&
              (this.data[i].Quantity == '' || this.data[i].Quantity == 0)
            ) {
              this.data[i].isEdit = false
              this.data[i].isError = true
              errorlist.push(`序号${i + 1}：重量和数量不能同时为空<br>`)
              continue
            }
            // if (this.data[i].Quantity == '' || this.data[i].Quantity == 0 || !/(^[1-9]\d*$)/.test(this.data[i].Quantity)) {
            //   this.data[i].isEdit = false
            //   this.data[i].isError = true
            //   errorlist.push(`序号${i + 1}：请输入正确数量<br>`)
            //   continue
            // }
          } else if (this.tableData.StuffType == StuffType.Part) {
            param.Quantity = parseInt(this.data[i].Quantity) || 0
            param.Weight = this.$root.toInt(this.data[i].Weight)
            if (this.data[i].PartTypeEk == '' || this.data[i].PartTypeEk == 0) {
              this.data[i].isEdit = false
              this.data[i].isError = true
              errorlist.push(`序号${i + 1}：请选择配件名称<br>`)
              continue
            }
            if (
              (this.data[i].Weight == '' || this.data[i].Weight == 0) &&
              (this.data[i].Quantity == '' || this.data[i].Quantity == 0)
            ) {
              this.data[i].isEdit = false
              this.data[i].isError = true
              errorlist.push(`序号${i + 1}：重量和数量不能同时为空<br>`)
              continue
            }
            // if (this.data[i].Quantity == '' || this.data[i].Quantity == 0 || !/(^[1-9]\d*$)/.test(this.data[i].Quantity)) {
            //   this.data[i].isEdit = false
            //   this.data[i].isError = true
            //   errorlist.push(`序号${i + 1}：请输入正确数量<br>`)
            //   continue
            // }
          }
          if (this.data[i].isEdit || this.data[i].isError) {
            let res
            if (!this.data[i].ItemId) {
              res = await STOCKING_API_STUFF_PURCHASE_ORDER_ITEM_CREATE(param)
            } else {
              res = await STOCKING_API_STUFF_PURCHASE_ORDER_ITEM_UPDATE(param)
            }
            if (res.data.Code === 'CORRECT') {
              this.data[i].isEdit = false
              if (!this.data[i].ItemId) {
                this.$set(this.data[i], 'ItemId', res.data.Data)
              }
            } else {
              this.data[i].isEdit = false
              this.data[i].isError = true
              errorlist.push(`序号${i + 1}：${res.data.Message}<br>`)
            }
            if (res.data.Code === 'CORRECT') {
              this.data[i].isEdit = false
              if (!this.data[i].ItemId) {
                this.$set(this.data[i], 'ItemId', res.data.Data)
              }
            } else {
              this.data[i].isEdit = false
              this.data[i].isError = true
              errorlist.push(`序号${i + 1}：${res.data.Message}<br>`)
            }
          }
        }
      }
      this.$store.commit('SET_BTN_LOADING', false)
      if (errorlist.length) {
        this.$alert(errorlist.join(''), '错误提示', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true
        })
      } else {
        if (haveEdit || !haveError) {
          this.$message.success('保存成功')
          this.isSaved = false
        }
        this.getData()
      }
    },
    // 提交审核
    orderSubmit() {
      this.$store.commit('SET_BTN_LOADING', true)
      STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_WAIT({
        PurchaseId: this.parameters.PurchaseId,
        CheckNote: ''
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '提交审核成功',
            type: 'success'
          })
          setTimeout(() => {
            this.$store.commit('SET_BTN_LOADING', false)
            this.$router.back(-1)
          }, 1000)
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    // 打开编辑弹窗
    openEdit() {
      this.newVisible = true
    },
    // 编辑保存
    newSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const para = {
            ...this.newStyleData,
            ForwdDate: this.newStyleData.ForwdDate
              ? this.newStyleData.ForwdDate
              : '1900-01-01',
            PartnerId: Number(this.newStyleData.PartnerId),
            StuffType: Number(this.newStyleData.StuffType),
            Preprice: this.$root.toInt(Number(this.newStyleData.Preprice))
          }
          STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_UPDATE(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.closeNewForm()
              this.getData()
            }
          })
        }
      })
    },
    // 新建取消
    closeNewForm() {
      this.$refs['newForm'].resetFields()
      this.newVisible = false
    },
    importSubmit(data) {
      console.log(data)
    },
    getTypeList() {
      let enumeratorType
      if (this.tableData.StuffType == StuffType.Gold) {
        enumeratorType = SettingEnumeratorEnumeratorType.GoldType
      }
      if (this.tableData.StuffType == StuffType.Stone) {
        enumeratorType = SettingEnumeratorEnumeratorType.StoneClassType
        MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
          EnumeratorType: SettingEnumeratorEnumeratorType.StoneWeight,
          IsEnable: YNStatus.Yes
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.stoneRange = res.data.Data.Rows
          }
        })
      }
      if (this.tableData.StuffType == StuffType.Part) {
        enumeratorType = SettingEnumeratorEnumeratorType.PartType
      }
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: enumeratorType,
        IsEnable: YNStatus.Yes
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.majorList = res.data.Data.Rows
        }
      })
    }
  },
  mounted() {
    this.parameters.PurchaseId = Number(this.$route.query.id)
    this.StuffType = Number(this.$route.query.type)
    this.getData()
    this.getItems()
    this.getKind()
    this.getSupplierList()
    this.$store.commit('SET_BTN_LOADING', false)
    this.$store.dispatch('GET_SETTLE_DATE')
  }
}
</script>

<style lang="scss" scoped>
.content {
  .title {
    font-size: 14px;
    padding: 10px 15px;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    color: #777777;
    font-weight: 600;
    background: #f5f5f5;
    position: relative;
  }
}
.mb {
  margin-bottom: 15px;
}
.handle-btn {
  font-size: 16px;
  color: #1f91df;
  i {
    margin-right: 8px;
    &:hover {
      color: blue;
      cursor: pointer;
    }
  }
}
.gift-info-cell img {
  width: 50px;
  height: 50px;
  vertical-align: top;
}
.gesture {
  width: 20px;
  height: 27px;
  cursor: pointer;
  padding-top: 8px;
  color: #999;
}
.el-back {
  position: absolute;
  width: 50px;
  top: 0;
  height: 35px;
  right: 25px;
  z-index: 10;
}
</style>

