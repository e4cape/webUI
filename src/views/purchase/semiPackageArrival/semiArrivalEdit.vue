<template>
  <el-row>
    <div v-loading="$store.getters.tb_loading">
      <div class="panel">
        <div class="panel-hd">
          <span class="title">编辑半成品入库单({{detail.KindTypeEv}})</span>
          <el-button name="btnEdit" @click="showEdit" class="el-back" type="text">修改</el-button>
        </div>
        <div class="panel-bd">
          <div class="details-info-table">
            <table cellpadding="0" cellspacing="0">
              <tbody>
                <tr>
                  <td class="tit">单号</td>
                  <td>{{detail.IntakeCode}}</td>
                  <td class="tit">创建</td>
                  <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateMinutes}}</td>
                  <td class="tit">审核</td>
                  <td
                    v-if="detail.State === HalfIntakeOrderBasicState.Audit || detail.State === HalfIntakeOrderBasicState.Reject"
                  >{{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime | filterDateMinutes}}</td>
                  <td v-else>-</td>
                </tr>
                <tr>
                  <td class="tit">业务日期</td>
                  <td>{{detail.ActualDate | filterDate}}</td>
                  <td class="tit">供应商</td>
                  <td>{{detail.PartnerName}}</td>
                  <td class="tit">采购员</td>
                  <td>{{detail.ChargeUser}}</td>
                </tr>
                <tr>
                  <td class="tit">包号</td>
                  <td>{{detail.PackageNo}}</td>
                  <td class="tit">送货单号</td>
                  <td>{{detail.ExpressCode}}</td>
                  <td class="tit">入库位置</td>
                  <td>{{detail.WarehouseName}} > {{detail.ShelfName}}</td>
                </tr>
                <tr>
                  <td class="tit">货品类别</td>
                  <td>{{financeTypes.Types[detail.FinanceType]}}</td>
                  <td class="tit">进货方式</td>
                  <td>{{purchaseTypes.Types[detail.PurchaseType]}}</td>
                  <td class="tit">备注</td>
                  <td>{{detail.Note}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- <div class="checkPage-hd">
            <el-button
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
            </el-button>
          </div>-->
          <div class="p-x-10">
            <el-table
              :data="data"
              class="m-b-10 edit-table"
              ref="halfTable"
              element-loading-text="拼命加载中"
              highlight-current-row
              v-scrollshow="handelScrollshow"
              :row-class-name="setEditRow"
              height="600"
            >
              <el-table-column label="序号" type="index" width="50"></el-table-column>
              <el-table-column label="半成品名称" min-width="100">
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
              <el-table-column prop="Quantity" label="数量" min-width="100">
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
                    @blur="handleBlur(scope.row)"
                    maxlength="8"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="Weight" label="重量" min-width="80">
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
                    @blur="handleBlur(scope.row)"
                    maxlength="10"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="GoldPrice" label="金价(元/克)" min-width="80">
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
                    @blur="handleBlur(scope.row)"
                    maxlength="10"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="CraftFee1" label="工费①计价(元/克)" min-width="120">
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
                    @blur="handleBlur(scope.row)"
                    maxlength="10"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="CraftFee2" label="工费②计件(元/件)" min-width="120">
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
                    @blur="handleBlur(scope.row)"
                    maxlength="10"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="OtherFee" label="其他费用" min-width="80">
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
                    @blur="handleBlur(scope.row)"
                    maxlength="10"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="CostPrice" label="成本" min-width="80">
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
              <el-table-column prop="Note" label="备注" min-width="80">
                <template
                  slot-scope="scope"
                  v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
                >
                  <el-input
                    v-model="scope.row.Note"
                    @input="handleFocus(scope.row)"
                    :maxlength="200"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" fixed>
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
        <el-button name="save" type="primary" @click="save" v-if="isSaved" :loading="saveLoading">保存</el-button>
        <el-button name="btnSubmit" type="primary" @click="submit" v-else>提交审核</el-button>
        <el-button name="btnBack" @click="$router.back()">返回</el-button>
      </el-row>
      <!-- 修改 -->
      <el-dialog :title="`编辑(${detail.KindTypeEv})`" :visible.sync="editVisible" width="500px">
        <el-form :model="detail" label-width="100px" :rules="editRules" ref="editForm">
          <el-form-item label="包号：" prop="PackageNo">
            <el-input name="PackageNo" v-model="detail.PackageNo" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="供应商：" prop="PartnerId">
            <el-select filterable name="PartnerId" v-model="detail.PartnerId">
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
          <el-form-item label="采购员：" prop="ChargeUserId">
            <el-select
              filterable
              name="ChargeUserId"
              v-model="detail.ChargeUserId"
              @change="ChargeUserChange"
            >
              <el-option
                v-for="item in $store.getters.users"
                :key="item.UserId"
                :label="item.TrueName || item.AliasName"
                :value="item.UserId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="进货方式：" prop="PurchaseType">
            <el-radio-group
              name="PurchaseType"
              v-model="detail.PurchaseType"
              @change="purchaseChange"
            >
              <template v-for="item in purchaseTypes.TypeArray">
                <el-radio
                  :label="parseInt(item.KeyId)"
                  v-if="item.KeyId < purchaseTypes.WeiwGoods"
                  :key="item.KeyId"
                >{{item.Value}}</el-radio>
              </template>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="货品类别：" prop="FinanceType">
            <el-radio-group name="FinanceType" v-model="detail.FinanceType">
              <el-radio :label="financeTypes.Self">{{financeTypes.Types[financeTypes.Self]}}</el-radio>
              <el-radio
                :label="financeTypes.Take"
                v-if="detail.PurchaseType == purchaseTypes.Purchase"
              >{{financeTypes.Types[financeTypes.Take]}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="送货单号：" prop="ExpressCode">
            <el-input name="ExpressCode" v-model="detail.ExpressCode" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="入库位置：" prop="WarehouseId" class="location">
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
          <el-form-item label="业务日期：" prop="ActualDate">
            <el-date-picker
              name="ActualDate"
              v-model="detail.ActualDate"
              value-format="yyyy-MM-dd HH:mm:ss"
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
        :root="$root.filePaths.STOCKING_PURCHASE + '/halfIntakeOut/'"
      ></template-import>
      <!-- End 导入货品 -->
      <!-- End 智能导入货品 -->
      <smart-import
        :visible.sync="smartVisible"
        :option="importOption"
        :root="$root.filePaths.STOCKING_PURCHASE + '/halfIntakeOut/'"
      ></smart-import>
      <!-- @module 智能导入货品 -->
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
      <el-dialog
        title="复制当前行"
        :visible.sync="copyVisible"
        width="450px"
        :before-close="cancelClose"
      >
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
    </div>
  </el-row>
</template>

<script>
import {
  PurchaseType,
  YNStatus,
  EnableState,
  PartnerType
} from '@/enums/common'
import { SecurityUserState } from '@/enums/merchant'
import {
  HalfIntakeOrderBasicState,
  FinanceType,
  SettingAiimportTempletOrderType,
  SettingCustomizedFieldLargeType,
  SettingCustomizedFieldSmallType
} from '@/enums/stocking'
import {
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_GET,
  STOCKING_API_HALF_INTAKE_ORDER_ITEM_GETS,
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_UPDATE,
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_WAIT,
  STOCKING_API_HALF_BASIC_GETS,
  STOCKING_API_HALF_INTAKE_ORDER_ITEM_UPDATE,
  STOCKING_API_HALF_INTAKE_ORDER_ITEM_CREATE,
  STOCKING_API_HALF_INTAKE_ORDER_ITEM_DELETE
} from '@/apis/stocking'
import pagination from '@/components/pagination'
import templateImport from '@/components/erp/templateImport'
import smartImport from '@/components/erp/smartImport'

export default {
  data() {
    return {
      HalfIntakeOrderBasicState,
      YNStatus,
      partnerType: PartnerType,
      financeTypes: FinanceType,
      purchaseTypes: PurchaseType,
      detail: {},
      data: [],
      templateVisible: false,
      smartVisible: false,
      editVisible: false,
      parameters: {
        IntakeId: '',
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      halfData: [], // 半成品
      shelf: [],
      props: {
        value: 'Id',
        label: 'Value',
        children: 'Childrens'
      },
      editRules: {
        PartnerId: {
          required: true,
          message: '请选择供应商',
          trigger: 'change'
        },
        ChargeUserId: {
          required: true,
          message: '请选择采购员',
          trigger: 'change'
        },
        PurchaseType: {
          required: true,
          message: '请输入进货方式',
          trigger: 'change'
        },
        WarehouseId: {
          required: true,
          message: '请选择入库位置',
          trigger: 'change'
        },
        ShelfId: {
          required: true,
          message: '请选择货架位置',
          trigger: 'change'
        },
        ActualDate: {
          required: true,
          message: '请选择业务日期',
          trigger: 'change'
        }
      },
      createHalfForm: {},
      importOption: {
        OrderType:
          SettingAiimportTempletOrderType.StockingCloudHalfIntakeOrderBasic,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        SmallType: SettingCustomizedFieldSmallType.Basic,
        KindTypeEk: 0
      },
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
    getData() {
      // 入库单明细
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_HALF_INTAKE_ORDER_BASIC_GET({
        IntakeId: this.parameters.IntakeId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data || {}
          this.detail.Preprice = this.$root.toFloat(this.detail.Preprice)
          this.getHalf()
        }
      })
    },
    getItems() {
      // 货品列表
      STOCKING_API_HALF_INTAKE_ORDER_ITEM_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          if (this.data.length === 0) {
            for (let i = this.data.length; i < 10; i++) {
              this.data.push({
                IntakeId: this.parameters.IntakeId,
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
          this.total = res.data.Data.Count || 0
        }
      })
    },
    showEdit() {
      this.editVisible = true
      let shelf = this.$store.getters.wareHouses.find(
        item => item.Id === this.detail.WarehouseId
      )
      this.detail.WarehouseName = shelf.Value
      this.shelf = shelf ? shelf.Childrens : []
    },
    purchaseChange() {
      if (this.detail.PurchaseType === this.purchaseTypes.WeiwStuff) {
        this.detail.FinanceType = this.financeTypes.Self
      }
    },
    ChargeUserChange() {
      this.$store.getters.users.map(item => {
        if (item.UserId === this.detail.ChargeUserId) {
          this.detail.ChargeUser = item.TrueName || item.AliasName
        }
      })
    },
    saveDetail(formName) {
      // 保存编辑明细
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.detail.ShelfName = this.shelf.find(
            item => item.Id === this.detail.ShelfId
          ).Value
          STOCKING_API_HALF_INTAKE_ORDER_BASIC_UPDATE({
            ...this.detail,
            Preprice: this.$root.toInt(this.detail.Preprice)
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.editVisible = false
              this.$message.success('修改成功')
              this.getData()
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
    getHalf() {
      // 获取半成品
      STOCKING_API_HALF_BASIC_GETS({
        PageIndex: 1,
        PageSize: 10000,
        OrderBy: 0,
        KindTypeEk: this.detail.KindTypeEk,
        IsAsced: YNStatus.No,
        State: EnableState.Enable
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.halfData = res.data.Data.Rows || []
        }
      })
    },
    importTmp(val) {
      if (val === 'template') {
        this.templateVisible = true
      } else {
        this.smartVisible = true
      }
      this.importOption.KindTypeEk = this.detail.KindTypeEk
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.getItems()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.getItems()
    },
    handleFocus(row) {
      this.$refs.halfTable.setCurrentRow(row)
      row.isEdit = true
      row.isError = false
      this.isSaved = true
    },
    handleBlur(row) {
      row.CostPrice =
        row.Weight * row.GoldPrice +
        row.CraftFee1 * row.Weight +
        row.CraftFee2 * row.Quantity +
        row.OtherFee * 1
      row.CostPrice = row.CostPrice === 0 ? '' : row.CostPrice.toFixed(2)
      if (row.CostPrice > 9999999999) {
        this.$message.error('成本不能大于9999999999')
        row.CostPrice = 9999999999
      }
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
              res = await STOCKING_API_HALF_INTAKE_ORDER_ITEM_UPDATE(param)
            } else {
              res = await STOCKING_API_HALF_INTAKE_ORDER_ITEM_CREATE(param)
            }
            this.saveLoading = false
            if (res.data.Code === 'CORRECT') {
              // this.$message.success('保存成功')
              this.data[i].isEdit = false
              if (!this.data[i].ItemId) {
                this.total += 1
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
      STOCKING_API_HALF_INTAKE_ORDER_BASIC_WAIT({
        IntakeId: this.parameters.IntakeId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$router.push('/purchase/semiPackageArrival/index')
        }
      })
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
          IntakeId: this.parameters.IntakeId,
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
              this.getItems()
            }
          } else {
            STOCKING_API_HALF_INTAKE_ORDER_ITEM_DELETE({
              ItemId: scope.row.ItemId,
              IntakeId: scope.row.IntakeId
            }).then(res => {
              if (res.data.Code === 'CORRECT') {
                // this.getItems()
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
                    this.data.push({
                      IntakeId: this.parameters.IntakeId,
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
    cancelClose() {
      this.copyVisible = false
      this.addVisible = false
      this.copyLineForm.local = this.addLineForm.local = '1'
      this.copyLineForm.rowsNum = this.copyLineForm.current = this.addLineForm.rowsNum = 1
    },
    getStoreAllType() {
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', {
        HasShelf: YNStatus.Yes,
        State: YNStatus.Yes
      })
      this.$store.dispatch('GET_SUPPLIERS_DROPLIST', {
        PartnerType: 0,
        State: YNStatus.Yes
      })
      this.$store.dispatch('GET_USERS_DROPLIST', {
        UserState: SecurityUserState.Audit,
        CashierType: 0
      })
    }
  },
  created() {
    this.parameters.IntakeId = parseInt(this.$route.query.id)
    this.getStoreAllType()
    this.getData()
  },
  mounted() {
    this.getItems()
    this.$store.dispatch('GET_SETTLE_DATE')
  },
  components: {
    pagination,
    templateImport,
    smartImport
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/erp/purchase.scss';
.el-input-number--mini {
  width: 100%;
}
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
