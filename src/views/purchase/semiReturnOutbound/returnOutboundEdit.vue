<template>
  <el-row>
    <div class="panel" v-loading="$store.getters.tb_loading">
      <div class="panel-hd">
        <span class="title">编辑退货出库单({{detail.KindTypeEv}})</span>
        <el-button name="btnEdit" @click="showEdit" class="el-back" type="text">修改</el-button>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.ReturnCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}}&nbsp;{{detail.CreateTime | filterDateMinutes}}</td>
                <td class="tit">审核</td>
                <td
                  v-if="detail.State === HalfReturnOrderBasicState.Audit || detail.State === HalfReturnOrderBasicState.Reject"
                >{{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime | filterDateMinutes}}</td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">业务日期</td>
                <td>{{detail.ActualDate | filterDate}}</td>
                <td class="tit">供应商</td>
                <td>{{detail.PartnerName}}</td>
                <td class="tit">退货位置</td>
                <td>{{detail.WarehouseName}} > {{detail.ShelfName}}</td>
              </tr>
              <tr>
                <td class="tit">退货原因</td>
                <td>{{detail.ReasonTypeDv}}</td>
                <td class="tit">应付款</td>
                <td>￥{{detail.Preprice}}</td>
                <td class="tit">备注</td>
                <td colspan="3">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="checkPage-hd">
          <!-- <el-button
            type="primary"
            @click="importTmp('template')"
            name="btnImportant">
            按模板导入
          </el-button>
          <el-button
            type="primary"
            @click="importTmp('smart')"
            name="btnSmartImport">
            智能导入
          </el-button>-->
          <el-dropdown name="handleCommand" @command="showAddProduct">
            <span class="el-dropdown-link">
              <el-button>
                提单
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="audit">半成品入库单</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="p-x-10">
          <el-table
            :data="data"
            class="m-b-10 edit-table"
            ref="halfTable"
            highlight-current-row
            height="600"
            :row-class-name="setEditRow"
            v-scrollshow="handelScrollshow"
          >
            <el-table-column label="操作" width="100" fixed="left">
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
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
                    :key="scope.row.ItemId"
                    @click="deleteShow($event, scope)"
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
            <el-table-column prop="HalfId" label="半成品名称" min-width="100">
              <template slot="header">
                <span class="red">*</span>半成品名称
              </template>
              <template slot-scope="scope">
                <el-select
                  filterable
                  v-model="scope.row.HalfId"
                  placeholder="请选择"
                  @change="handleFocus(scope.row)"
                >
                  <el-option
                    v-for="item in halfData"
                    :key="item.HalfId"
                    :label="item.HalfName"
                    :value="item.HalfId"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" label="数量" min-width="100" show-overflow-tooltip>
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <!-- <el-input-number v-model="scope.row.Quantity" :precision="0" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
                <el-input
                  name="Quantity"
                  v-model="scope.row.Quantity"
                  @keyup.native="scope.row.Quantity = $root.toFixed(scope.row.Quantity, 0)"
                  @input="handleFocus(scope.row)"
                  maxlength="8"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Weight" label="重量" min-width="100" show-overflow-tooltip>
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <!-- <el-input-number v-model="scope.row.Weight" :precision="3" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
                <el-input
                  name="Weight"
                  v-model="scope.row.Weight"
                  @keyup.native="scope.row.Weight = $root.toFixed(scope.row.Weight, 3)"
                  @input="handleFocus(scope.row)"
                  maxlength="10"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="GoldPrice" label="金价(元/克)" min-width="100" show-overflow-tooltip>
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <!-- <el-input-number v-model="scope.row.GoldPrice" :precision="2" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
                <el-input
                  name="GoldPrice"
                  v-model="scope.row.GoldPrice"
                  @keyup.native="scope.row.GoldPrice = $root.toFixed(scope.row.GoldPrice, 2)"
                  @input="handleFocus(scope.row)"
                  maxlength="10"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="CraftFee1"
              label="工费①计价(元/克)"
              min-width="120"
              show-overflow-tooltip
            >
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <!-- <el-input-number v-model="scope.row.CraftFee1" :precision="2" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
                <el-input
                  name="CraftFee1"
                  v-model="scope.row.CraftFee1"
                  @keyup.native="scope.row.CraftFee1 = $root.toFixed(scope.row.CraftFee1, 2)"
                  @input="handleFocus(scope.row)"
                  maxlength="10"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              prop="CraftFee2"
              label="工费②计件(元/件)"
              min-width="120"
              show-overflow-tooltip
            >
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <!-- <el-input-number v-model="scope.row.CraftFee2" :precision="2" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
                <el-input
                  name="CraftFee2"
                  v-model="scope.row.CraftFee2"
                  @keyup.native="scope.row.CraftFee2 = $root.toFixed(scope.row.CraftFee2, 2)"
                  @input="handleFocus(scope.row)"
                  maxlength="10"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="OtherFee" label="其他费用" min-width="100" show-overflow-tooltip>
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <!-- <el-input-number v-model="scope.row.OtherFee" :precision="2" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
                <el-input
                  name="OtherFee"
                  v-model="scope.row.OtherFee"
                  @keyup.native="scope.row.OtherFee = $root.toFixed(scope.row.OtherFee, 2)"
                  @input="handleFocus(scope.row)"
                  maxlength="10"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="CostPrice" label="成本" min-width="100" show-overflow-tooltip>
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <!-- <el-input-number v-model="scope.row.CostPrice" :precision="2" @focus="handleFocus(scope.row)" :controls="false"></el-input-number> -->
                <el-input
                  name="CostPrice"
                  v-model="scope.row.CostPrice"
                  @keyup.native="scope.row.CostPrice = $root.toFixed(scope.row.CostPrice, 2)"
                  @input="handleFocus(scope.row)"
                  maxlength="10"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Note" label="备注" min-width="100" show-overflow-tooltip>
              <template
                slot-scope="scope"
                v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
              >
                <el-input v-model="scope.row.Note" @input="handleFocus(scope.row)" :maxlength="200"></el-input>
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
        </div>
      </div>
    </div>
    <el-row style="margin-top: 10px; text-align: left; border: 0;">
      <el-button
        name="btnSave"
        type="primary"
        @click="save"
        v-if="isSaved"
        :loading="saveLoading"
      >保存</el-button>
      <el-button name="btnSubmit" type="primary" @click="submit" v-else>提交审核</el-button>
      <el-button name="btnBack" @click="$router.back()">返回</el-button>
    </el-row>
    <!-- 修改 -->
    <el-dialog :title="`编辑(${detail.KindTypeEv})`" :visible.sync="editVisible" width="500px">
      <el-form :model="detail" label-width="100px" :rules="editRules" ref="editForm">
        <el-form-item label="供应商：" prop="PartnerId">
          <el-select filterable name="PartnerId" v-model="detail.PartnerId">
            <template v-for="item in $store.getters.suppliers">
              <el-option
                v-if="item.State === YNStatus.Yes && (item.PartnerType == partnerType.Merchant || item.PartnerType == partnerType.Supplier)"
                :key="item.Id"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="退货位置：" prop="WarehouseId" class="location">
          <el-select filterable name="WarehouseId" v-model="detail.WarehouseId" :disabled="true">
            <template v-for="item in $store.getters.wareHouses">
              <el-option
                v-if="item.State === YNStatus.Yes"
                :key="item.Id"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="ShelfId" class="location shelf">
          <el-select filterable name="ShelfId" v-model="detail.ShelfId" :disabled="true">
            <template v-for="item in shelf">
              <el-option
                v-if="item.State === YNStatus.Yes"
                :key="item.Id"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="退货原因：" prop="ReasonTypeDk">
          <el-select filterable name="ReasonTypeDk" v-model="detail.ReasonTypeDk">
            <el-option label="请选择" :value="0"></el-option>
            <el-option
              v-for="item in resonType"
              :key="item.Id"
              :label="item.Value"
              :value="item.Id"
            ></el-option>
          </el-select>
          <el-button
            name="btnColumnVisible"
            type="text"
            class="return-reason"
            @click="returnVisible = true"
          >
            <i class="icon-set"></i>
          </el-button>
        </el-form-item>
        <el-form-item label="业务日期：" prop="ActualDate">
          <el-date-picker
            name="ActualDate"
            v-model="detail.ActualDate"
            value-format="yyyy-MM-dd"
            :picker-options="$store.getters.businessDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="应付款：" prop="Preprice">
          <el-input
            name="Preprice"
            v-model="detail.Preprice"
            @keyup.native="detail.Preprice = $root.toFixed(detail.Preprice, 2, true)"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="Note">
          <el-input name="Note" type="textarea" v-model="detail.Note" maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnSave" type="primary" @click="saveDetail('editForm')">保存</el-button>
        <el-button name="btnClose" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
    <!-- End 修改 -->
    <!-- @module 导入货品 -->
    <template-import
      :visible.sync="templateVisible"
      :option="importOption"
      :root="$root.filePaths.STOCKING_PURCHASE + '/halfReturnOut/'"
    ></template-import>
    <!-- End 导入货品 -->
    <!-- End 智能导入货品 -->
    <smart-import
      :visible.sync="smartVisible"
      :option="importOption"
      :root="$root.filePaths.STOCKING_PURCHASE + '/halfReturnOut/'"
    ></smart-import>
    <!-- @module 智能导入货品 -->
    <!-- 添加半成品 -->
    <el-dialog
      title="添加半成品"
      :visible.sync="addProductVisible"
      width="1050px"
      :before-close="cancelAdd"
    >
      <el-form :model="addForm" :inline="true" ref="addForm">
        <el-form-item prop="PartnerId">
          <el-select
            filterable
            name="PartnerId"
            v-model="addForm.PartnerId"
            @change="showAddProduct"
          >
            <el-option label="所有供应商" :value="0"></el-option>
            <template v-for="item in $store.getters.suppliers">
              <el-option
                v-if="(item.PartnerType == partnerType.Merchant || item.PartnerType == partnerType.Supplier)"
                :key="item.Id"
                :label="item.Value"
                :value="item.Id"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="IntakeCode">
          <el-input
            name="IntakeCode"
            v-model="addForm.IntakeCode"
            placeholder="单据编号"
            @keyup.enter.native="showAddProduct"
            maxlength="30"
          >
            <el-button
              name="btnSearch"
              slot="append"
              class="el-icon-search"
              @click="showAddProduct"
            ></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <el-table
        :data="addData"
        v-loading="$store.getters.tb_loading"
        element-loading-text="拼命加载中"
        highlight-current-row
        @current-change="selectCurrentChange"
        @sort-change="sortChange"
      >
        <el-table-column
          prop="IntakeCode"
          fixed
          label="单据编号"
          sortable="custom"
          min-width="140"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="PackageNo" label="包号" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PartnerName" label="供应商" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="CreateTime"
          label="创建时间"
          sortable="custom"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{scope.row.CreateTime | filterDateMinutes}}</template>
        </el-table-column>
        <el-table-column prop="ChargeUser" label="采购员" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ItemQty" label="采购数量" min-width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Weight" label="采购重量(g)" min-width="80" show-overflow-tooltip>
          <template slot-scope="scope">{{$root.toFloat(scope.row.Weight, 3)}}g</template>
        </el-table-column>
        <el-table-column
          prop="CheckTime"
          label="最后操作时间"
          sortable="custom"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{scope.row.CheckTime | filterDateMinutes}}</template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination
        :pg="addForm.PageIndex"
        :size="addForm.PageSize"
        :total="addTotal"
        @currentChange="addCurrentChange"
        @sizeChange="addSizeChange"
      ></pagination>
      <!-- End 分页 -->
      <div slot="footer" class="dialog-footer">
        <el-button name="btnAddProduct" type="primary" @click="addProduct">确定</el-button>
        <el-button name="btnClose" @click="cancelAdd">取消</el-button>
      </div>
    </el-dialog>
    <!-- End 添加半成品 -->
    <!-- 增加行数 -->
    <el-dialog title="插入空白行" :visible.sync="addVisible" width="450px" :before-close="cancelClose">
      <el-form :model="addLineForm" @submit.native.prevent>
        <el-form-item label="行数：">
          <el-input
            name="rowsNum"
            v-model="addLineForm.rowsNum"
            @keyup.native="addLineForm.rowsNum = $root.toFixed(addLineForm.rowsNum, 0)"
            style="width: 200px"
          ></el-input>
          <!-- <el-input-number name="rowsNum" v-model="addLineForm.rowsNum" :controls="false" :min="1" :max="50" style="width: 200px"></el-input-number> -->
          <span style="color: #999; margin-left: 10px;">(最多50行)</span>
        </el-form-item>
        <!-- <el-form-item label="位置：">
          <el-radio-group name="local" v-model="addLineForm.local">
            <el-radio label="1">向下插入</el-radio>
            <el-radio label="2">向上插入</el-radio>
          </el-radio-group>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnAdd" type="primary" @click="addSure">确定</el-button>
        <el-button name="btnClose" @click="cancelClose">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 增加行数 -->
    <!-- 复制行 -->
    <el-dialog title="复制当前行" :visible.sync="copyVisible" width="450px" :before-close="cancelClose">
      <el-form :model="copyLineForm" @submit.native.prevent>
        <el-form-item label="行数：">
          <el-input
            name="rowsNum"
            v-model="copyLineForm.rowsNum"
            @keyup.native="copyLineForm.rowsNum = $root.toFixed(copyLineForm.rowsNum, 0)"
            style="width: 200px"
          ></el-input>
          <!-- <el-input-number name="rowsNum" v-model="copyLineForm.rowsNum" :controls="false" :min="1" :max="10" style="width: 200px"></el-input-number> -->
          <span style="color: #999; margin-left: 10px;">(最多50行)</span>
        </el-form-item>
        <!-- <el-form-item label="位置：">
          <el-radio-group name="local" v-model="copyLineForm.local">
            <el-radio label="1">向下复制</el-radio>
            <el-radio label="2">复制到第 <el-input name="rowsNum" v-model="copyLineForm.current" @keyup.native="copyLineForm.current = $root.toFixed(addLineForm.current, 0)" style="width: 50px"></el-input> 行</el-radio>
          </el-radio-group>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnCopy" type="primary" @click="copySure">确定</el-button>
        <el-button name="btnClose" @click="cancelClose">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 复制行 -->
    <dict-manage
      v-if="returnVisible"
      :visible.sync="returnVisible"
      :dicts="resonType"
      :dialogTitle="'退货原因'"
      :dictType="SettingDictionaryDictType.HalfReturnOrderBasicReasonType"
      @listenDictSave="getReasonType"
    ></dict-manage>
  </el-row>
</template>

<script>
import {
  HalfReturnOrderBasicState,
  SettingDictionaryDictType,
  HalfIntakeOrderBasicState,
  StockCompareType,
  SettingAiimportTempletOrderType,
  SettingCustomizedFieldSmallType,
  SettingCustomizedFieldLargeType
} from '@/enums/stocking'
import {
  STOCKING_API_HALF_RETURN_ORDER_BASIC_GET,
  STOCKING_API_HALF_RETURN_ORDER_ITEM_GETS,
  STOCKING_API_HALF_RETURN_ORDER_BASIC_WAIT,
  STOCKING_API_HALF_RETURN_ORDER_ITEM_CREATE,
  STOCKING_API_HALF_RETURN_ORDER_ITEM_UPDATE,
  STOCKING_API_HALF_RETURN_ORDER_ITEM_DELETE,
  STOCKING_API_HALF_RETURN_ORDER_BASIC_UPDATE,
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_GETS,
  STOCKING_API_HALF_RETURN_ORDER_ITEM_SELECTINTAKECREATE,
  STOCKING_API_HALF_STOCK_SHELF_REQS
} from '@/apis/stocking'
import { MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST } from '@/apis/merchant'
import { EnableState, YNStatus, PartnerType } from '@/enums/common'
import dictManage from '@/components/erp/dictManage'
import pagination from '@/components/pagination'
import templateImport from '@/components/erp/templateImport'
import smartImport from '@/components/erp/smartImport'

export default {
  data() {
    return {
      HalfReturnOrderBasicState,
      SettingDictionaryDictType,
      HalfIntakeOrderBasicState,
      EnableState,
      YNStatus,
      partnerType: PartnerType,
      detail: {},
      data: [],
      templateVisible: false,
      smartVisible: false,
      editVisible: false,
      editForm: {
        PartnerId: '',
        KindTypeEk: 0,
        ReasonTypeDk: '',
        ReasonTypeDv: '',
        WarehouseId: '',
        ShelfId: '',
        ActualDate: '',
        Note: ''
      },
      props: {
        value: 'Id',
        label: 'Value',
        children: 'Childrens'
      },
      resonType: [], // 退货原因
      shelf: [], // 货架位置
      editRules: {
        PartnerId: {
          required: true,
          message: '请选择供应商',
          trigger: 'change'
        },
        ActualDate: {
          required: true,
          message: '请选择业务日期',
          trigger: 'change'
        },
        WarehouseId: {
          required: true,
          message: '请选择退货位置',
          trigger: 'change'
        },
        ShelfId: {
          required: true,
          message: '请选择货架位置',
          trigger: 'change'
        }
      },
      parameters: {
        ReturnId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      halfData: [],
      returnVisible: false,
      returnReason: [],
      addProductVisible: false,
      addData: [],
      addForm: {
        IntakeCode: '',
        PartnerId: 0,
        OrderBy: 1,
        KindTypeEk: 0,
        IsAsced: YNStatus.No,
        State: HalfIntakeOrderBasicState.Audit,
        PageIndex: 1,
        PageSize: 20
      },
      importOption: {
        OrderType:
          SettingAiimportTempletOrderType.StockingCloudHalfIntakeOrderBasic,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        KindTypeEk: 0,
        SmallType: SettingCustomizedFieldSmallType.Basic
      },
      addTotal: 0,
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
      addCurrent: '', // 要添加的Id
      isSaved: false,
      saveLoading: false,
      currentStartIndex: 0,
      currentEndIndex: 20
    }
  },
  methods: {
    // 设置选中样式
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
    getDetail() {
      STOCKING_API_HALF_RETURN_ORDER_BASIC_GET({
        ReturnId: this.parameters.ReturnId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.detail.Preprice = this.$root.toFloat(res.data.Data.Preprice)
          this.getHalf()
        }
      })
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_HALF_RETURN_ORDER_ITEM_GETS(this.parameters).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          if (this.data.length === 0) {
            for (let i = this.data.length; i < 10; i++) {
              this.data.push({
                ReturnId: this.parameters.ReturnId,
                HalfId: '',
                Quantity: '',
                Weight: '',
                GoldPrice: '',
                CraftFee1: '',
                CraftFee2: '',
                OtherFee: '',
                CostPrice: '',
                Note: '',
                isEdit: false,
                isError: false
              })
            }
          } else {
            this.data = this.data.map(item => {
              let newItem = { ...item }
              newItem.Weight = this.$root.toFloat(newItem.Weight, 3)
              newItem.GoldPrice = this.$root.toFloat(newItem.GoldPrice)
              newItem.CraftFee1 = this.$root.toFloat(newItem.CraftFee1)
              newItem.CraftFee2 = this.$root.toFloat(newItem.CraftFee2)
              newItem.OtherFee = this.$root.toFloat(newItem.OtherFee)
              newItem.CostPrice = this.$root.toFloat(newItem.CostPrice)
              this.$set(newItem, 'isEdit', false)
              this.$set(newItem, 'isError', false)
              return newItem
            })
          }
          this.total = res.data.Data.Count
        }
      })
    },
    showEdit() {
      this.editVisible = true
      let shelf = this.$store.getters.wareHouses.find(
        item => item.Id === this.detail.WarehouseId
      )
      this.shelf = shelf ? shelf.Childrens : []
      this.getReasonType()
    },
    saveDetail(formName) {
      // 保存编辑明细
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.detail.ReasonTypeDk === '') {
            this.detail.ReasonTypeDk = 0
          } else {
            this.resonType.some(item => {
              if (this.detail.ReasonTypeDk === item.Id) {
                this.detail.ReasonTypeDv = item.Value
              }
            })
          }
          STOCKING_API_HALF_RETURN_ORDER_BASIC_UPDATE({
            ...this.detail,
            Preprice: this.$root.toInt(this.detail.Preprice)
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.editVisible = false
              this.$message.success('修改成功')
              this.getDetail()
            }
          })
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.$refs.editForm.resetFields()
      this.editVisible = false
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.getData()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.getData()
    },
    handleFocus(row) {
      this.$refs.halfTable.setCurrentRow(row)
      row.isEdit = true
      row.isError = false
      this.isSaved = true
    },
    async save() {
      let haveEdit = false
      let haveError = false
      let errorlist = []
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i].isEdit) {
          haveEdit = true
        }
        if (this.data[i].isError) {
          haveError = true
        }
        if (this.data[i].isEdit || this.data[i].isError) {
          if (this.data[i].HalfId === '') {
            this.data[i].isEdit = false
            this.data[i].isError = true
            errorlist.push(`序号${i + 1}：半成品名称不能为空<br>`)
          } else {
            this.halfData.some(item => {
              if (item.HalfId === this.data[i].HalfId) {
                this.data[i].HalfName = item.HalfName
                this.data[i].HalfClassDk = item.HalfClassDk
                this.data[i].HalfClassDv = item.HalfClassDv
              }
            })
          }
          if (
            this.$root.toInt(this.data[i].Weight) == '' &&
            this.data[i].Quantity == 0
          ) {
            this.data[i].isEdit = false
            this.data[i].isError = true
            errorlist.push(`序号${i + 1}：数量和重量不能同时为空<br>`)
          }
          if (this.data[i].isEdit) {
            let res
            let param = { ...this.data[i] }
            param.Quantity = parseInt(param.Quantity)
            param.Weight = this.$root.toInt(param.Weight)
            param.GoldPrice = this.$root.toInt(param.GoldPrice)
            param.CraftFee1 = this.$root.toInt(param.CraftFee1)
            param.CraftFee2 = this.$root.toInt(param.CraftFee2)
            param.OtherFee = this.$root.toInt(param.OtherFee)
            param.CostPrice = this.$root.toInt(param.CostPrice)

            this.saveLoading = true
            if (this.data[i].ItemId) {
              res = await STOCKING_API_HALF_RETURN_ORDER_ITEM_UPDATE(param)
            } else {
              res = await STOCKING_API_HALF_RETURN_ORDER_ITEM_CREATE(param)
            }
            this.saveLoading = false
            if (res.data.Code === 'CORRECT') {
              // this.$message.success('保存成功')
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
      }
    },
    submit() {
      STOCKING_API_HALF_RETURN_ORDER_BASIC_WAIT({
        ReturnId: this.parameters.ReturnId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$router.push('/purchase/semiReturnOutbound/index')
        }
      })
    },
    getHalf() {
      // 获取半成品
      STOCKING_API_HALF_STOCK_SHELF_REQS({
        StockCompareType: StockCompareType.AvailableQtyThanZero,
        WarehouseId: this.detail.WarehouseId,
        ShelfId: this.detail.ShelfId,
        KindTypeEk: this.detail.KindTypeEk,
        PageIndex: 1,
        PageSize: 10000,
        OrderBy: 0,
        IsAsced: YNStatus.No
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.halfData = res.data.Data.Rows || []
        }
      })
    },
    showAddProduct() {
      this.addProductVisible = true
      this.addForm.KindTypeEk = this.detail.KindTypeEk
      STOCKING_API_HALF_INTAKE_ORDER_BASIC_GETS(this.addForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.addData = res.data.Data.Rows || []
          this.addTotal = res.data.Data.Count
        }
      })
    },
    selectCurrentChange(val) {
      this.addCurrent = val.IntakeId
    },
    addProduct() {
      console.log(this.addCurrent)
      if (this.addCurrent == '') {
        return this.$message.error('请选择要添加的半成品')
      }
      STOCKING_API_HALF_RETURN_ORDER_ITEM_SELECTINTAKECREATE({
        ReturnId: this.parameters.ReturnId,
        IntakeId: this.addCurrent
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.getData()
          this.addProductVisible = false
        }
      })
    },
    cancelAdd() {
      this.$refs.addForm.resetFields()
      this.addProductVisible = false
    },
    importTmp(val) {
      if (val === 'template') {
        this.templateVisible = true
      } else {
        this.smartVisible = true
      }
      this.importOption.KindTypeEk = this.detail.KindTypeEk
    },
    sortChange(sort) {
      // 表单排序
      this.addForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
    },
    addCurrentChange(val) {
      // 切换当前页
      this.addForm.PageIndex = val
      this.showAddProduct()
    },
    addSizeChange(val) {
      // 切换每页显示条数
      this.addForm.PageIndex = 1
      this.addForm.PageSize = val
      this.showAddProduct()
    },
    numberChange(val) {
      console.log(val)
    },
    addShow(scope) {
      // 插入空白行弹窗
      this.addVisible = true
      this.handleRow = scope
    },
    addSure() {
      // 确定插入空白行
      if (this.addLineForm.rowsNum > 50) {
        return this.$message.warning('最多50行')
      }
      let local
      local = this.addLineForm.local == 1 ? 1 : 0
      for (let i = 0; i < this.addLineForm.rowsNum; i++) {
        this.data.splice(this.handleRow.$index + local, 0, {
          ReturnId: this.parameters.ReturnId,
          HalfId: '',
          Quantity: '',
          Weight: '',
          GoldPrice: '',
          CraftFee1: '',
          CraftFee2: '',
          OtherFee: '',
          CostPrice: '',
          Note: '',
          isEdit: false,
          isError: false
        })
      }
      this.addVisible = false
    },
    deleteShow($event, scope) {
      if (
        this.data.length <= 1 &&
        !scope.row.ItemId &&
        this.parameters.PageIndex === 1
      ) {
        this.$message.warning('至少保留一行')
        return false
      }
      $event.currentTarget.blur()
      this.$confirm('是否删除当前行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (!scope.row.ItemId) {
            this.data.splice(scope.$index, 1)
            if (this.data.length === 0) {
              this.parameters.PageIndex = 1
              this.getData()
            }
            this.isSaved = false
          } else {
            STOCKING_API_HALF_RETURN_ORDER_ITEM_DELETE({
              ItemId: scope.row.ItemId,
              ReturnId: this.detail.ReturnId
            }).then(res => {
              if (res.data.Code === 'CORRECT') {
                this.data.splice(scope.$index, 1)
                if (this.data.length === 0) {
                  if (this.parameters.PageIndex > 1) {
                    this.parameters.PageIndex = 1
                    this.getData()
                  } else {
                    this.data.push({
                      ReturnId: this.parameters.ReturnId,
                      HalfId: '',
                      Quantity: '',
                      Weight: '',
                      GoldPrice: '',
                      CraftFee1: '',
                      CraftFee2: '',
                      OtherFee: '',
                      CostPrice: '',
                      Note: '',
                      isEdit: false,
                      isError: false
                    })
                  }
                }
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              }
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    copyShow(scope) {
      this.copyVisible = true
      this.handleRow = scope
    },
    copySure() {
      // 确定复制
      if (this.copyLineForm.rowsNum > 50) {
        return this.$message.warning('最多50行')
      }
      if (
        this.copyLineForm.local == 2 &&
        this.copyLineForm.current > this.data.length
      ) {
        return this.$message.warning('正确输入行数')
      }
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
      this.isSaved = true
      this.copyVisible = false
    },
    listenDictDialog() {
      // 关闭栏目管理弹窗
      this.semiClassifyVisible = false
      this.getReasonType()
    },
    // 获取半成品退货原因
    getReasonType() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: SettingDictionaryDictType.HalfReturnOrderBasicReasonType,
        State: EnableState.Enable
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.resonType = res.data.Data.Rows || []
        }
      })
    },
    getStoreAllType() {
      this.$store
        .dispatch('GET_WAREHOUSES_DROPLIST', {
          HasShelf: YNStatus.Yes,
          State: YNStatus.Yes
        })
        .then(res => {
          this.wareHouses = [
            {
              Id: '',
              Value: '所有位置',
              Childrens: null
            },
            ...res
          ]
        })
      this.$store.dispatch('GET_SUPPLIERS_DROPLIST')
      this.$store.dispatch('GET_USERS_DROPLIST')
    },
    cancelClose() {
      this.copyVisible = false
      this.addVisible = false
      this.copyLineForm.local = this.addLineForm.local = '1'
      this.copyLineForm.rowsNum = this.copyLineForm.current = this.addLineForm.rowsNum = 1
    }
  },
  created() {
    this.parameters.ReturnId = parseInt(this.$route.query.id)
    this.getStoreAllType()
    this.getDetail()
  },
  mounted() {
    this.getData()
    this.$store.dispatch('GET_SETTLE_DATE')
  },
  components: {
    dictManage,
    pagination,
    templateImport,
    smartImport
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/erp/purchase.scss';
.el-back {
  height: 100%;
  float: right;
}
.location {
  display: inline-block;
  /deep/ .el-select > .el-input {
    width: 140px;
  }
}
.shelf {
  /deep/ .el-form-item__content {
    margin-left: 10px !important;
  }
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
.el-table .el-input-number--mini {
  width: 100%;
}
.return-reason {
  font-size: 18px;
  vertical-align: -webkit-baseline-middle;
  padding-top: 2px;
  padding-left: 5px;
}
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
  .alert-modflie {
    width: 100%;
    text-align: left;
    margin-bottom: 20px;
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
