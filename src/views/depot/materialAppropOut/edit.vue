<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">编辑调拨出库单({{StuffType.Types[detail.StuffType]}})</span>
        <span class="title fr">
          <el-button type="text" @click="editDialog = true">修改</el-button>
        </span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.OutakeCode}}</td>
                <td class="tit">创建：</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateMinutes}}</td>
                <td class="tit">审核：</td>
                <td>
                  <template v-if="detail.State === StuffAllotOrderOutakeState.Audit || detail.State === StuffAllotOrderOutakeState.Reject">{{detail.CheckUser}} {{detail.CheckTime | filterDateMinutes}}</template>
                </td>
              </tr>
              <tr>
                <td class="tit">发货位置：</td>
                <td>{{detail.UnitedName1}}</td>
                <td class="tit">收货位置：</td>
                <td>{{detail.UnitedName2}}</td>
                <td class="tit">调拨原因：</td>
                <td>{{detail.ReasonTypeDv}}</td>
              </tr>
              <tr>
                <td class="tit">业务日期：</td>
                <td>{{detail.ActualDate | filterDate}}</td>
                <td class="tit">备注：</td>
                <td class="note" colspan="5">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="checkPage-hd">
          <el-row>
            <!-- <el-col :span="16">
              <el-button name="templateImport" type="primary" @click="templateVisible = true">按模板导入</el-button>
              <el-button name="smartImport" type="primary" @click="smartVisible = true">智能导入</el-button>
            </el-col>-->
            <el-col :span="24" class="tr">
              <span class="detail-info-num-item">
                数量：
                <b class="num">{{detail.AllotQty}}</b>
              </span>
              <span class="detail-info-num-item">
                重量：
                <b class="num">{{$root.toFloat(detail.AllotWgt,3)}}</b>
              </span>
              <span class="detail-info-num-item">
                金额：
                <b class="num">￥{{$root.toFloat(detail.Preprice)}}</b>
              </span>
            </el-col>
          </el-row>
        </div>
        <!-- @module 数据表格 -->
        <div class="p-x-10">
          <el-table
            v-scrollshow="handelScrollshow"
            :data="data"
            ref="table"
            element-loading-text="拼命加载中"
            highlight-current-row
            v-loading="tableLoading"
            :row-class-name="setEditRow"
            class="m-b-10 edit-table"
            height="600"
          >
            <el-table-column type="index" label="序号" show-overflow-tooltip></el-table-column>
            <template v-if="detail.StuffType === StuffType.Gold">
              <el-table-column prop="GoldType" min-width="100" key="GoldType">
                <template slot="header" slot-scope>
                  <p>
                    <span style="color: red">*</span>
                    <span>成色</span>
                  </p>
                </template>
                <template slot-scope="scope">
                  <el-select v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" v-model="scope.row.GoldType" placeholder="请选择" @change="handleFocus(scope.row)">
                    <el-option v-for="item in $store.getters.goldType.TypeArray" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
                  </el-select>
                </template>
              </el-table-column>
            </template>
            <template v-if="detail.StuffType === StuffType.Stone">
              <el-table-column prop="StoneClassTypeEk" min-width="100" key="StoneClassTypeEk">
                <template slot="header">
                  <p>
                    <span style="color: red">*</span>
                    <span>石料</span>
                  </p>
                </template>
                <template slot-scope="scope">
                  <el-select
                    v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
                    v-model="scope.row.StoneClassTypeEk"
                    placeholder="请选择"
                    @change="handleStoneClassType(scope.row)"
                  >
                    <el-option v-for="item in stoneClassList" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="StonePackageNo" min-width="100" key="StonePackageNo">
                <template slot="header" slot-scope>
                  <p>
                    <span style="color: red">*</span>
                    <span>石号/包号</span>
                  </p>
                </template>
                <template slot-scope="scope">
                  <el-input v-model="scope.row.StonePackageNo" @change="handleFocus(scope.row)"></el-input>
                </template>
              </el-table-column>
            </template>
            <template v-if="detail.StuffType === StuffType.Part">
              <el-table-column prop="PartTypeEk" min-width="100" key="PartTypeEk">
                <template slot="header" slot-scope>
                  <p>
                    <span style="color: red">*</span>
                    <span>配件名称</span>
                  </p>
                </template>
                <template slot-scope="scope">
                  <el-select v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" v-model="scope.row.PartTypeEk" placeholder="请选择" @change="handlePartType(scope.row)">
                    <el-option v-for="item in partTypeList" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
                  </el-select>
                </template>
              </el-table-column>
            </template>

            <el-table-column prop="Weight" :label="`重量(${detail.StuffType === StuffType.Stone ? 'ct' : 'g'})`" min-width="100">
              <template slot-scope="scope">
                <el-input
                  v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
                  v-model="scope.row.Weight"
                  @change="handleFocus(scope.row)"
                  @blur="getPrice(scope.row)"
                  @keyup.enter.native="getPrice(scope.row)"
                  @keyup.native="scope.row.Weight = $root.toFixed(scope.row.Weight, 3)"
                  :maxlength="8"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" label="数量" min-width="80">
              <template slot-scope="scope">
                <el-input
                  v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
                  v-model="scope.row.Quantity"
                  @change="handleFocus(scope.row)"
                  @blur="getPrice(scope.row)"
                  @keyup.enter.native="getPrice(scope.row)"
                  @keyup.native="scope.row.Quantity = $root.toFixed(scope.row.Quantity, 0)"
                  :maxlength="8"
                ></el-input>
              </template>
            </el-table-column>
            <template v-if="detail.StuffType === StuffType.Gold">
              <el-table-column prop="GoldPrice" label="金价(元/克)" min-width="80" key="GoldPrice">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
                    v-model="scope.row.GoldPrice"
                    @change="handleFocus(scope.row)"
                    @blur="getPrice(scope.row)"
                    @keyup.enter.native="getPrice(scope.row)"
                    @keyup.native="scope.row.GoldPrice = $root.toFixed(scope.row.GoldPrice, 2)"
                    :maxlength="10"
                  ></el-input>
                </template>
              </el-table-column>
            </template>
            <template v-if="detail.StuffType === StuffType.Stone">
              <el-table-column prop="StonePrice1" label="数单价" min-width="80" key="StonePrice1">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
                    v-model="scope.row.StonePrice1"
                    :precision="2"
                    @change="handleFocus(scope.row)"
                    @blur="getPrice(scope.row)"
                    @keyup.enter.native="getPrice(scope.row)"
                    @keyup.native="scope.row.StonePrice1 = $root.toFixed(scope.row.StonePrice1, 2)"
                    :maxlength="10"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="StonePrice2" label="重单价" min-width="80" key="StonePrice2">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
                    v-model="scope.row.StonePrice2"
                    @change="handleFocus(scope.row)"
                    @blur="getPrice(scope.row)"
                    @keyup.enter.native="getPrice(scope.row)"
                    @keyup.native="scope.row.StonePrice2 = $root.toFixed(scope.row.StonePrice2, 2)"
                    :maxlength="10"
                  ></el-input>
                </template>
              </el-table-column>
            </template>
            <template v-if="detail.StuffType === StuffType.Part">
              <el-table-column prop="PartPrice1" label="数单价" min-width="80" key="PartPrice1">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
                    v-model="scope.row.PartPrice1"
                    @change="handleFocus(scope.row)"
                    @blur="getPrice(scope.row)"
                    @keyup.enter.native="getPrice(scope.row)"
                    @keyup.native="scope.row.PartPrice1 = $root.toFixed(scope.row.PartPrice1, 2)"
                    :maxlength="10"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="PartPrice2" label="重单价" min-width="80" key="PartPrice2">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex"
                    v-model="scope.row.PartPrice2"
                    @change="handleFocus(scope.row)"
                    @blur="getPrice(scope.row)"
                    @keyup.enter.native="getPrice(scope.row)"
                    @keyup.native="scope.row.PartPrice2 = $root.toFixed(scope.row.PartPrice2, 2)"
                    :maxlength="10"
                  ></el-input>
                </template>
              </el-table-column>
            </template>
            <el-table-column prop="Price" label="金额" min-width="80">
              <template slot-scope="scope">
                <el-input v-model="scope.row.Price" @change="handleFocus(scope.row)" @keyup.native="scope.row.Price = $root.toFixed(scope.row.Price, 2)" :maxlength="10"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed>
              <template slot-scope="scope">
                <div class="handle-btn" v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex">
                  <i name="addShow" class="icon-add1 handel-icon" @click="addShow(scope)" style="color: #1f91df" title="新增一行"></i>
                  <i name="deleteShow" class="icon-reduce1 handel-icon" @click="deleteShow($event, scope)" style="color: #d74040" title="删除此行"></i>
                  <i name="copyShow" class="icon-copy1 handel-icon" @click="copyShow(scope)" style="color: #7798af" title="复制此行"></i>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <pagination :pg="parameters.PageIndex" :size="parameters.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-col :span="12">
        <el-button type="primary" @click="orderSubmit" :loading="$store.getters.is_loading" name="btnOrderSubmit">{{enableSubmit?'提交审核':'保存'}}</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </el-col>
    </div>
    <!-- 插入空白行 -->
    <el-dialog title="插入空白行" :visible.sync="addVisible" width="450px">
      <el-form :model="addLineForm" @submit.native.prevent>
        <el-form-item label="行数：">
          <el-input name="rowsNum" v-model="addLineForm.rowsNum" @keyup.native="addLineForm.rowsNum = $root.toFixed(addLineForm.rowsNum, 0)" style="width: 200px"></el-input>
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
        <el-button name="btnClose" @click="addVisible=false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 复制当前行 -->
    <el-dialog title="复制当前行" :visible.sync="copyVisible" width="450px">
      <el-form :model="copyLineForm" @submit.native.prevent>
        <el-form-item label="行数：">
          <!-- <el-input name="rowsNum" v-model="addLineForm.rowsNum"></el-input> -->
          <el-input name="rowsNum" v-model="copyLineForm.rowsNum" @keyup.native="copyLineForm.rowsNum = $root.toFixed(copyLineForm.rowsNum, 0)" style="width: 200px"></el-input>
          <span style="color: #999; margin-left: 10px;">(最多50行)</span>
        </el-form-item>
        <!-- <el-form-item label="位置：">
          <el-radio-group name="local" v-model="copyLineForm.local">
            <el-radio label="1">向下复制</el-radio>
            <el-radio label="2">
              复制到第
              <el-input name="rowsNum" v-model="copyLineForm.current" @keyup.native="copyLineForm.current = $root.toFixed(copyLineForm.current, 0)" style="width: 50px"></el-input>行
            </el-radio>
          </el-radio-group>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnCopy" type="primary" @click="copySure">确定</el-button>
        <el-button name="btnClose" @click="copyVisible=false">取消</el-button>
      </span>
    </el-dialog>

    <!-- @module Dialog·修改成品调拨出库单 -->
    <basic-edit :visible.sync="editDialog" :editForm="editForm" @listenEditDialog="getDetail"></basic-edit>
    <!-- End Dialog·修改成品调拨出库单 -->

    <template-import :visible.sync="templateVisible" :option="importOption" :root="`${$root.filePaths.STOCKING_DEPOT}/MaterialAppropOut`"></template-import>
    <smart-import :visible.sync="smartVisible" :option="importOption" :root="`${$root.filePaths.STOCKING_DEPOT}/MaterialAppropOut`"></smart-import>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { YNStatus, StuffType } from '@/enums/common.js'
import {
  StuffAllotOrderOutakeState,
  SettingEnumeratorEnumeratorType,
  SettingAiimportTempletOrderType,
  SettingCustomizedFieldLargeType
} from '@/enums/stocking.js'
import { MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST } from '@/apis/merchant.js'
import {
  STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_GET,
  STOCKING_API_STUFF_ALLOT_ORDER_ITEM_GETS,
  // STOCKING_API_HALF_ALLOT_ORDER_ITEM_SELECTINTAKECREATE,
  STOCKING_API_STUFF_ALLOT_ORDER_ITEM_DELETE,
  STOCKING_API_STUFF_ALLOT_ORDER_ITEM_CREATE,
  STOCKING_API_STUFF_ALLOT_ORDER_ITEM_UPDATE,
  STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_WAIT,
  // STOCKING_API_HALF_STOCK_SHELF_REQS
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
import basicEdit from './appropOutBasicEdit'
import templateImport from '@/components/erp/templateImport'
import smartImport from '@/components/erp/smartImport'

export default {
  data() {
    return {
      YNStatus,
      StuffType,
      StuffAllotOrderOutakeState,
      detail: {}, // 明细
      editDialog: false, // 新建对话框
      editForm: {},
      data: [], // 货品数据
      total: 0,
      templateVisible: false,
      smartVisible: false,
      parameters: {
        OutakeId: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      enableSubmit: true,
      dropData: [],
      addVisible: false,
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
      tableLoading: false,
      submitLoading: false,
      partTypeList: [],
      stoneClassList: [],
      importOption: {
        OrderType: SettingAiimportTempletOrderType.StockingCloudStuffIntakeOrderBasic,
        LargeType: SettingCustomizedFieldLargeType.Goods,
        KindTypeEk: 0,
        SmallType: 0
      },
      currentStartIndex: 0,
      currentEndIndex: 20,
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
    // 表格懒加载
    handelScrollshow(currentStartIndex, currentEndIndex) {
      this.currentStartIndex = currentStartIndex
      this.currentEndIndex = currentEndIndex
    },
    getEnums() {
      this.$store.dispatch('GET_GOLD_TYPE', YNStatus.Yes)
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.PartType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.partTypeList = res.data.Data.Rows.filter(
            item => item.State === YNStatus.Yes
          )
        }

      })
      MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.StoneClassType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.stoneClassList = res.data.Data.Rows.filter(
            item => item.State === YNStatus.Yes
          )
        }

      })
    },
    init() {
      this.parameters.OutakeId = parseInt(this.$route.query.id)
      if (!this.parameters.OutakeId) {
        this.dataError()
      } else {
        this.getDetail()
        this.getGoods()
      }
    },
    dataError(msg) {
      this.$alert(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        type: 'warning'
      })
        .then(() => {
          this.$router.back()
        })
        .catch(() => {
          this.$router.back()
        })
    },
    getDetail() {
      this.$store.commit('SET_FULL_LOADING', true)
      return STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_GET({
        OutakeId: this.parameters.OutakeId,
        Stamp: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.editForm = res.data.Data
          this.detail = Object.assign({}, res.data.Data)
        }
        this.$store.commit('SET_FULL_LOADING', false)
      })
    },
    getGoods() {
      this.tableLoading = true
      STOCKING_API_STUFF_ALLOT_ORDER_ITEM_GETS(this.parameters).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          if (this.data.length === 0) {
            for (let i = this.data.length; i < 10; i++) {
              this.data.push({
                OutakeId: this.parameters.OutakeId,
                GoldType: '',
                PartTypeEk: '',
                PartTypeEv: '',
                StoneClassTypeEk: '',
                StoneClassTypeEv: '',
                Quantity: '',
                Weight: '',
                GoldPrice: '',
                PartPrice1: '',
                PartPrice2: '',
                StonePrice1: '',
                StonePrice2: '',
                Price: '',
                isEdit: false,
                isError: false,
              })
            }
          } else {
            this.data = this.data.map(item => {
              let newItem = { ...item }
              newItem.Weight = this.$root.toFloat(newItem.Weight, 3)
              newItem.GoldPrice = this.$root.toFloat(newItem.GoldPrice)
              newItem.PartPrice1 = this.$root.toFloat(newItem.PartPrice1)
              newItem.PartPrice2 = this.$root.toFloat(newItem.PartPrice2)
              newItem.StonePrice1 = this.$root.toFloat(newItem.StonePrice2)
              newItem.Price = this.$root.toFloat(newItem.Price)
              this.$set(newItem, 'isEdit', false)
              this.$set(newItem, 'isError', false)
              return newItem
            })
          }
          this.total = res.data.Data.Count || 0
          this.tableLoading = false
        }
      })
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
    addShow(scope) {
      // 插入空白行弹窗
      this.addLineForm.rowsNum = 1
      this.addLineForm.local = '1'
      this.addVisible = true
      this.handleRow = scope
    },
    addSure() {
      // 确定插入空白行
      if (parseFloat(this.addLineForm.rowsNum) > 50) {
        this.$message.warning('最多新增50行')
        return false
      }
      let local
      local = this.addLineForm.local == 1 ? 1 : 0
      for (let i = 0; i < this.addLineForm.rowsNum; i++) {
        this.data.splice(this.handleRow.$index + local, 0, {
          OutakeId: this.parameters.OutakeId,
          GoldType: '',
          PartTypeEk: '',
          PartTypeEv: '',
          StoneClassTypeEk: '',
          StoneClassTypeEv: '',
          Quantity: '',
          Weight: '',
          GoldPrice: '',
          PartPrice1: '',
          PartPrice2: '',
          StonePrice1: '',
          StonePrice2: '',
          Price: '',
          isEdit: false,
          isError: false
        })
      }
      this.addVisible = false
    },
    deleteShow($event, scope) {
      if (this.data.length <= 1 && !scope.row.ItemId && this.parameters.PageIndex === 1) {
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
          if (scope.row.ItemId) {
            this.tableLoading = true
            STOCKING_API_STUFF_ALLOT_ORDER_ITEM_DELETE({
              ItemId: scope.row.ItemId,
              OutakeId: scope.row.OutakeId
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
                    this.init()
                  } else {
                    this.data.push({
                      OutakeId: this.parameters.OutakeId,
                      GoldType: '',
                      PartTypeEk: '',
                      PartTypeEv: '',
                      StoneClassTypeEk: '',
                      StoneClassTypeEv: '',
                      Quantity: '',
                      Weight: '',
                      GoldPrice: '',
                      PartPrice1: '',
                      PartPrice2: '',
                      StonePrice1: '',
                      StonePrice2: '',
                      Price: '',
                      isEdit: false,
                      isError: false,
                    })
                  }

                }
              }
              this.tableLoading = false
            })
          } else {
            this.data.splice(scope.$index, 1)
            if (this.data.length === 0) {
              this.parameters.PageIndex = 1
              this.init()
            }
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
      this.copyLineForm.rowsNum = 1
      this.copyLineForm.local = '1'
      this.copyLineForm.current = 1
      this.copyVisible = true
      this.handleRow = scope
    },
    copySure() {
      // 确定复制
      if (parseFloat(this.copyLineForm.rowsNum) > 50) {
        this.$message.warning('最多50行')
        return false
      }
      if ((!Number(this.copyLineForm.current) || parseFloat(this.copyLineForm.current) > this.data.length) && this.copyLineForm.local === '2') {
        this.$message.warning('正确输入行数')
        return false
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
      this.enableSubmit = false
      this.copyVisible = false
    },
    handleFocus(row) {
      row.isEdit = true
      row.isError = false
      this.enableSubmit = false
    },
    // 获取配件名称
    handlePartType(row) {
      row.PartTypeEv = this.partTypeList.find(item => item.Id === row.PartTypeEk).Value
      this.handleFocus(row)
    },
    // 获取石类名称
    handleStoneClassType(row) {
      row.StoneClassTypeEv = this.stoneClassList.find(item => item.Id === row.StoneClassTypeEk).Value
      this.handleFocus(row)
    },
    getPrice(row) {

      if (this.detail.StuffType === StuffType.Gold) {
        row.Price = row.Weight * row.GoldPrice
      } else if (this.detail.StuffType === StuffType.Stone) {
        row.Price = row.StonePrice2 * row.Weight || row.StonePrice1 * row.Quantity
      } else {
        row.Price = row.PartPrice2 * row.Weight || row.PartPrice1 * row.Quantity
      }
      if (row.Price > 9999999999) {
        this.$message.warning('金额不能超过9999999999')
        row.Price = 9999999999
      }

    },
    async orderSubmit() {
      if (!this.enableSubmit) {
        this.$store.commit('SET_BTN_LOADING', true)
        let errorlist = []
        for (var i = 0; i < this.data.length; i++) {
          if (this.data[i].isEdit || this.data[i].isError) {
            if (this.detail.StuffType === StuffType.Gold && this.data[i].GoldType === '') {
              this.data[i].isEdit = false
              this.data[i].isError = true
              errorlist.push(`序号${i + 1}：成色不能为空<br>`)
              continue
            }
            if (this.detail.StuffType === StuffType.Stone && this.data[i].StoneClassTypeEk === '') {
              this.data[i].isEdit = false
              this.data[i].isError = true
              errorlist.push(`序号${i + 1}：石料不能为空<br>`)
              continue
            }
            if (this.detail.StuffType === StuffType.Stone && this.data[i].StonePackageNo === '') {
              this.data[i].isEdit = false
              this.data[i].isError = true
              errorlist.push(`序号${i + 1}：石号/包号不能为空<br>`)
              continue
            }
            if (this.detail.StuffType === StuffType.Part && this.data[i].PartTypeEk === '') {
              this.data[i].isEdit = false
              this.data[i].isError = true
              errorlist.push(`序号${i + 1}：配件不能为空<br>`)
              continue
            }
            if (!parseFloat(this.data[i].Weight) && !parseFloat(this.data[i].Quantity)) {
              this.data[i].isEdit = false
              this.data[i].isError = true
              errorlist.push(`序号${i + 1}：重量或者数量输入错误<br>`)
              continue
            }
            if (this.data[i].isEdit || this.data[i].isError) {
              let res
              let param = { ...this.data[i] }
              param.GoldType = param.GoldType || 0
              param.PartTypeEk = param.PartTypeEk || 0
              param.StoneClassTypeEk = param.StoneClassTypeEk || 0
              param.Weight = this.$root.toInt(param.Weight, 3)
              param.GoldPrice = this.$root.toInt(param.GoldPrice)
              param.PartPrice1 = this.$root.toInt(param.PartPrice1)
              param.PartPrice2 = this.$root.toInt(param.PartPrice2)
              param.StonePrice1 = this.$root.toInt(param.StonePrice1)
              param.StonePrice2 = this.$root.toInt(param.StonePrice2)
              param.Price = this.$root.toInt(param.Price)
              param.Quantity = parseInt(param.Quantity)

              if (this.data[i].ItemId) {
                res = await STOCKING_API_STUFF_ALLOT_ORDER_ITEM_UPDATE(param)
              } else {
                res = await STOCKING_API_STUFF_ALLOT_ORDER_ITEM_CREATE(param)
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
        if (errorlist.length) {
          this.$alert(errorlist.join(''), '错误提示', {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true
          })
        } else {
          this.$message.success('保存成功')
          this.enableSubmit = true

        }
        this.$store.commit('SET_BTN_LOADING', false)
        this.getDetail()
      } else {

        this.$store.commit('SET_BTN_LOADING', true)
        STOCKING_API_STUFF_ALLOT_ORDER_OUTAKE_WAIT({
          OutakeId: this.parameters.OutakeId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$router.push('/depot/materialappropout/index')
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }
    }
  },
  created() {
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  components: {
    pagination,
    basicEdit,
    templateImport,
    smartImport
  }
}
</script>
<style lang="scss" scoped>
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
.el-input-number {
  width: 100%;
}
</style>
