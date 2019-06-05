<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">编辑报损单({{StuffType.Types[$route.query.StuffType]}})</span>
        <span class="title fr">
          <el-button type="text" @click="updateData">修改</el-button>
        </span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.ReportCode}}</td>
                <td class="tit">创建：</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime|filterDateTime}}</td>
                <td class="tit">审核：</td>
                <td>{{detail.State === stuffCountReportBasicState.Audit || detail.State === stuffCountReportBasicState.Reject ? detail.CheckUser + ' ' + detail.CheckTime : '-'}}</td>
              </tr>
              <tr>
                <td class="tit">位置：</td>
                <td>{{detail.WarehouseName || '仓库'}} > {{detail.ShelfName}}</td>
                <td class="tit">来源：</td>
                <td colspan="3">{{stuffCountReportBasicSourceType.Types[detail.SourceType] || '仓库'}}</td>
              </tr>
              <tr>
                <td class="tit">备注：</td>
                <td class="note" colspan="5">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="checkPage-hd">
          <el-row>
            <!-- <el-col :span="16">
              <el-button type="primary" @click="templateVisible=true" name="btnMultiCode">+ 按模板导入</el-button>
              <el-button  @click="smartVisible=true" name="btnSelectGoods">+ 智能导入</el-button>
            </el-col> -->
            <el-col :span="24" class="tr">
              <span class="detail-info-num-item">
                数量：<b class="num">{{detail.Quantity}}</b>
              </span>
              <span class="detail-info-num-item">
                重量：<b class="num">{{$root.toFloat(detail.Weight,3)}}{{$route.query.StuffType == StuffType.Stone?'ct':'g'}}</b>
              </span>
              <span class="detail-info-num-item">
                金额：￥<b class="num">{{$root.toFloat(detail.CostPrice)}}</b>
              </span>
            </el-col>
          </el-row>
        </div>
        <div class="p-x-10">
          <!-- @module 数据表格 -->
          <el-table 
            v-scrollshow="handelScrollshow"
            class="fixed-tr edit-table" 
            :data="data" 
            ref="halfTable" 
            v-loading="$store.getters.tb_loading" 
            element-loading-text='拼命加载中' 
            highlight-current-row
            :row-class-name="setEditRow"
            height="600">
            <el-table-column type="index" label="序号" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == StuffType.Gold" key="20" prop="GoldType" min-width="80" show-overflow-tooltip>
              <template slot="header">
                <p>
                  <span style="color: red">*</span>
                  <span>成色</span>
                </p>
              </template>
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-select v-model="scope.row.GoldType" placeholder="请选择" @change="handlechange(scope.row)">
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option v-for="item in $store.getters.goldType.TypeArray" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="30" prop="StoneClassTypeEk" min-width="100">
              <template slot="header">
                <p>
                  <span style="color: red">*</span>
                  <span>石类</span>
                </p>
              </template>
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-select v-model="scope.row.StoneClassTypeEk" placeholder="请选择" @change="handlechange(scope.row)">
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option v-for="item in $store.getters.stone.TypeArray" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="31" prop="StonePackageNo" min-width="100">
              <template slot="header">
                <p>
                  <span style="color: red">*</span>
                  <span>石号/包号</span>
                </p>
              </template>
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.StonePackageNo" :maxlength="30" @blur="scope.row.StonePackageNo = scope.row.StonePackageNo.trim()" @input="handlechange(scope.row)"></el-input>
              </template>
            </el-table-column>

            <el-table-column v-if="currTabs == StuffType.Part" key="40" prop="PartTypeEk" min-width="130">
              <template slot="header">
                <p>
                  <span style="color: red">*</span>
                  <span>配件名称</span>
                </p>
              </template>
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-select v-model="scope.row.PartTypeEk" placeholder="请选择" @change="handlechange(scope.row)">
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option v-for="item in $store.getters.part.TypeArray" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="Weight" :label="currTabs == StuffType.Stone?'重量(ct)':'重量(g)'" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.Weight" :maxlength="10" @keyup.native="scope.row.Weight=$root.toFixed(scope.row.Weight,3)" @blur="getPrice(scope.row)" @input="handlechange(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" label="数量" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.Quantity" :maxlength="8" @keyup.native="scope.row.Quantity=$root.toFixed(scope.row.Quantity,0)" @blur="getPrice(scope.row)" @input="handlechange(scope.row)"></el-input>
              </template>
            </el-table-column>
            
            <el-table-column v-if="currTabs == StuffType.Stone" key="33" prop="StonePrice2" label="重单价" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.StonePrice2" :maxlength="10" @keyup.native="scope.row.StonePrice2=$root.toFixed(scope.row.StonePrice2,2)" @blur="getPrice(scope.row)" @input="handlechange(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="32" prop="StonePrice1" label="数单价" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.StonePrice1" :maxlength="10" @keyup.native="scope.row.StonePrice1=$root.toFixed(scope.row.StonePrice1,2)" @blur="getPrice(scope.row)" @input="handlechange(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Part" key="42" prop="PartPrice2" label="重单价" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.PartPrice2" :maxlength="10" @keyup.native="scope.row.PartPrice2=$root.toFixed(scope.row.PartPrice2,2)" @blur="getPrice(scope.row)" @input="handlechange(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Part" key="41" prop="PartPrice1" label="数单价" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.PartPrice1" :maxlength="10" @keyup.native="scope.row.PartPrice1=$root.toFixed(scope.row.PartPrice1,2)" @blur="getPrice(scope.row)" @input="handlechange(scope.row)"></el-input>
              </template>
            </el-table-column>
            
            <el-table-column v-if="currTabs == StuffType.Gold" key="21" prop="GoldPrice" label="金价(元/克)" min-width="80" show-overflow-tooltip>
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.GoldPrice" :maxlength="10" @keyup.native="scope.row.GoldPrice=$root.toFixed(scope.row.GoldPrice,2)" @blur="getPrice(scope.row)" @input="handlechange(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="CostPrice" label="金额" min-width="130">
              <template slot-scope="scope">
                <el-input v-model="scope.row.CostPrice" :maxlength="10" @keyup.native="scope.row.CostPrice=$root.toFixed(scope.row.CostPrice,2)" @input="handlechange(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed>
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <div class="handle-btn">
                  <i name="addShow" class="icon-add1 handel-icon" @click="addShow(scope)" style="color: #1f91df" title="新增一行"></i>
                  <i name="deleteShow" class="icon-reduce1 handel-icon" @click="deleteShow($event, scope)" style="color: #d74040" title="删除此行"></i>
                  <i name="copyShow" class="icon-copy1 handel-icon" @click="copyShow(scope)" style="color: #7798af" title="复制此行"></i>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- End 数据表格 -->
          <pagination :pg="PageIndex" :size="PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
        </div>
      </div>
    </div>
    <div class="buttons">
      <!-- v-if="detail.SourceType === stuffCountReportBasicSourceType.Manual" -->
      <el-button type="primary" @click="orderSubmit" :loading="$store.getters.is_loading" name="btnStockOverAudit">{{ enableSubmit ? '提交审核': '保存'}}</el-button>
      <el-button @click="$router.back(-1)" name="btnGoBack">返回</el-button>
    </div>

    <!-- dialog 批量录入条码 -->
    <template v-if="multiCodeVisible">
      <multi-code-enter :multiCodeVisible="multiCodeVisible" @listenMultiCodeEnter="listenMultiCodeEnter"></multi-code-enter>
    </template>
    <!-- End 批量录入条码 -->

    <!-- @module 修改报损单 -->
    <el-dialog title="修改报损单" :visible.sync="editDialog" @close="resetForm">
      <el-form :model="editForm" label-position="right" label-width="100px"  ref="editForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="报损位置：" prop="WarehouseId">
              <el-select class="m-r-10" v-model="editForm.WarehouseId" disabled placeholder="请选择" :filterable="true" name="StuffType">
                <el-option v-for="(item,index) in $store.getters.wareHouses" :key="index" :label="item.Value" :value="Number(item.Id)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item class="shelf-box" prop="ShelfId">
              <el-select v-model="editForm.ShelfId" placeholder="请选择" disabled label-width="0" :filterable="true" name="StuffType">
                <el-option v-for="(item,index) in Shelfs" :key="index" :label="item.Value" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注：" prop="Note">
              <el-input type="textarea" :rows="2" v-model="editForm.Note" :maxlength="200" name="note"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer tc">
        <el-button type="primary" @click="editPurchase" :loading="$store.getters.is_loading" name="editPurchase">确 定</el-button>
        <el-button @click="editDialog = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 修改报损单 -->

    <!-- 按模板导入 -->
    <el-dialog :visible.sync="templateVisible" title="导入货品">
      <div class="dialog-title">
        <p>请选择导入的文件：</p>
        <el-button type="text">下载模板文件</el-button>
      </div>
      <el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip dialog-upload-tip" slot="tip">
          <p>1、仅支持.xls和.xlsx的Excel文件。</p>
          <p>2、仅支持Excel文件中第一个表格的数据导入。</p>
          <p>3、根据表格第一行标题自动匹配数据，第一行作为标题不导入数据。</p>
          <p>4、请先下载模板文件填写后再导入。</p>
        </div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="templateVisible = false">确 定</el-button>
        <el-button @click="templateVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 智能导入 -->
    <el-dialog :visible.sync="smartVisible" title="智能导入货品">
      <div class="dialog-title">
        <p class="m-b-10">请选择导入的文件，根据表格标题自动匹配导入：</p>
      </div>
      <el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip dialog-upload-tip" slot="tip">
          <p>1、仅支持.xls和.xlsx的Excel文件。</p>
          <p>2、仅支持Excel文件中第一个表格的数据导入。</p>
          <p>3、根据表格第一行标题自动匹配数据，第一行作为标题不导入数据。</p>
        </div>
      </el-upload>
      <div class="dialog-title">
        <p class="m-b-10">请选择导入的文件，根据表格标题自动匹配导入：</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="smartVisible = false">确 定</el-button>
        <el-button @click="smartVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 增加行数 -->
    <el-dialog title="插入空白行" :visible.sync="addVisible" width="450px">
      <el-form :model="addLineForm" @keyup.enter.native="addSure" @submit.native.prevent>
        <el-form-item label="行数：">
          <el-input-number name="rowsNum" v-model="addLineForm.rowsNum" :min="1" :max="50" :controls="false" style="width: 200px"></el-input-number>
          <span style="color: #999; margin-left: 10px;">(最多50行)</span>
        </el-form-item>
        <!-- <el-form-item label="位置：">
          <el-radio-group name="local" v-model="addLineForm.local">
            <el-radio label="1">向下插入</el-radio>
            <el-radio label="2">向上插入</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnAdd" type="primary" @click="addSure">确定</el-button>
        <el-button name="btnClose" @click="addVisible=false">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 增加行数 -->

    <!-- 复制行 -->
    <el-dialog title="复制当前行" :visible.sync="copyVisible" width="450px">
      <el-form :model="copyLineForm" @keyup.enter.native="copySure" @submit.native.prevent>
        <el-form-item label="行数：">
          <!-- <el-input name="rowsNum" v-model="addLineForm.rowsNum"></el-input> -->
          <el-input-number name="rowsNum" v-model="copyLineForm.rowsNum" :min="1" :max="50" :controls="false" style="width: 200px"></el-input-number>
          <span style="color: #999; margin-left: 10px;">(最多50行)</span>
        </el-form-item>
        <!-- <el-form-item label="位置：">
          <el-radio-group name="local" v-model="copyLineForm.local">
            <el-radio label="1">向下复制</el-radio>
            <el-radio label="2">复制到第 <el-input-number name="rowsNum" v-model="copyLineForm.current" :min="1" :max="data.length" :controls="false" style="width: 50px"></el-input-number> 行</el-radio>
          </el-radio-group>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btnCopy" type="primary" @click="copySure">确定</el-button>
        <el-button name="btnClose" @click="copyVisible=false">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 复制行 -->
  </div>
</template>

<script>
import {
  StuffType,
  YNStatus
} from '@/enums/common.js'
import {
  GoldType,
  StoneColor,
  StoneClarity,
  StuffCountReportBasicState,
  StuffCountReportBasicSourceType,
  StuffCountReportBasicReportType
} from '@/enums/stocking.js'
import { 
  STOCKING_API_STUFF_COUNT_REPORT_BASIC_GET,
  STOCKING_API_STUFF_COUNT_REPORT_ITEM_GETS,
  STOCKING_API_STUFF_COUNT_REPORT_BASIC_UPDATE,
  STOCKING_API_STUFF_COUNT_REPORT_BASIC_WAIT,
  STOCKING_API_STUFF_COUNT_REPORT_ITEM_CREATE,
  STOCKING_API_STUFF_COUNT_REPORT_ITEM_UPDATE,
  STOCKING_API_STUFF_COUNT_REPORT_ITEM_DELETE,
} from '@/apis/stocking.js'

import pagination from '@/components/pagination.vue'
import multiCodeEnter from '@/components/erp/multiCodeEnter'

export default {
  data () {
    return {
      YNStatus,
      StoneColor,
      StoneClarity,
      stuffCountReportBasicState: StuffCountReportBasicState,
      stuffCountReportBasicSourceType: StuffCountReportBasicSourceType,
      stuffCountReportBasicReportType: StuffCountReportBasicReportType,
      StuffType,
      GoldType,
      ReportId: '',
      PageIndex: 1,
      PageSize: 20,
      detail: {
      },
      data: [],
      currTabs: 1,
      pg: 1,
      size: 20,
      total: 0,
      code: '',
      editForm: { // 原料损溢单 - 更新
        ReportType: '',
        StuffType: '',
        WarehouseId: null,
        ShelfId: null,
        Note: ''
      },
      Shelfs: [],
      multiCodeVisible: false, // 批量录入条码弹窗
      editDialog: false,
      currentRow: 0,
      enableSubmit: true, // 控制请求一个一个提交
      templateVisible: false,
      smartVisible: false,
      addVisible: false,
      addLineForm: {
        rowsNum: 1,
        local: '1'
      }, // 空白行参数
      copyVisible: false,
      copyLineForm: {
        rowsNum: 1,
        local: '1',
        current: 1
      }, // 复制行参数
      handleRow: {},
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
    init () {
      let query = this.$route.query
      // query中的数据刷新后数据类型发生变化
      this.currTabs = Number(query.StuffType)
      this.ReportId = Number(query.id)||0
      if (!this.ReportId) {
        this.dataError()
      } else {
        this.getDetail()
        this.getGoods()
      }
    },
    dataError (msg) {
      this.$confirm(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },
    getDetail () {
      STOCKING_API_STUFF_COUNT_REPORT_BASIC_GET({
        ReportId: this.ReportId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.editForm = Object.assign({
          }, res.data.Data)
        }
      })
    },
    getGoods () {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      STOCKING_API_STUFF_COUNT_REPORT_ITEM_GETS({
        ReportId: this.ReportId,
        OrderBy: 0,
        IsAsced: this.YNStatus.Yes,
        PageIndex: this.pg,
        PageSize: this.size
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          console.log('res.data', res.data)
          this.data = res.data.Data.Rows || []
          this.data.forEach(item => {
            item.GoldPrice = this.$root.toFloat(item.GoldPrice)
            item.StonePrice1 = this.$root.toFloat(item.StonePrice1)
            item.StonePrice2 = this.$root.toFloat(item.StonePrice2)
            item.PartPrice1 = this.$root.toFloat(item.PartPrice1)
            item.PartPrice2 = this.$root.toFloat(item.PartPrice2)
            item.Weight = this.$root.toFloat(item.Weight,3)
            item.CostPrice = this.$root.toFloat(item.CostPrice)
          })
          this.total = res.data.Data.Count || 0
          // 进入时默认显示10行空白数据
          if(this.data.length == 0){
            for (let i=0; i<10; i++) {
              this.data.push({
                ReportId: this.ReportId,
                ItemId: '',
                GoldType: 0,
                GoldPrice: '',
                PartTypeEk: 0,
                PartTypeEv: '',
                PartPrice1: '',
                PartPrice2: '',
                StonePackageNo: '',
                StoneClassTypeEk: 0,
                StoneClassTypeEv: '',
                StonePrice1: '',
                StonePrice2: '',
                Quantity: '',
                Weight: '',
                CostPrice: '',
                Stamp:'',
                State: 0,
                isEdit: false,
                isError: false
              })
            }
          }
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    editPurchase(){
      STOCKING_API_STUFF_COUNT_REPORT_BASIC_UPDATE({ReportId: this.detail.ReportId, Note: this.editForm.Note}).then(res => {
        if(res.data.Code == 'CORRECT'){
          this.editDialog = false
          this.getDetail()
          this.$message({
            type: 'success',
            message: '提交成功！'
          })
        }
      })
    },
    updateData(){
      this.editForm.WarehouseId = this.detail.WarehouseId
      this.editForm.ShelfId = this.detail.ShelfId
      this.editForm.Note = this.detail.Note
      this.Shelfs = this.$store.getters.wareHouses.find(item => {
        return item.Id == this.detail.WarehouseId
      }).Childrens
      this.editDialog = true
    },
    addShow(scope) {
      // 插入空白行弹窗
      this.addVisible = true
      this.handleRow = scope
      this.addLineForm = {
        rowsNum: 1,
        local: '1'
      }
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
          ReportId: this.ReportId,
          ItemId: '',
          GoldType: 0,
          GoldPrice: '',
          PartTypeEk: 0,
          PartTypeEv: '',
          PartPrice1: '',
          PartPrice2: '',
          StonePackageNo: '',
          StoneClassTypeEk: 0,
          StoneClassTypeEv: '',
          StonePrice1: '',
          StonePrice2: '',
          Quantity: '',
          Weight: '',
          CostPrice: '',
          Stamp:'',
          State: 0,
          isEdit: false,
          isError: false
        })
      }
      this.addVisible = false
    },
    deleteShow($event, scope) {
      if (this.data.length <= 1 && !scope.row.ItemId && this.PageIndex === 1) {
        this.$message.warning('至少保留一行')
        return false
      }
      $event.currentTarget.blur()
      this.$confirm('是否删除当前行?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (!scope.row.ItemId) { // 删除空白行
          this.data.splice(scope.$index, 1)
          if(this.data.length == 0){
            this.PageIndex = 1
            this.init()
          }
        } else { // 删除有数据的行
          STOCKING_API_STUFF_COUNT_REPORT_ITEM_DELETE({
            ItemId: scope.row.ItemId,
            ReportId: scope.row.ReportId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              // this.getGoods()
              this.total = Math.max(0,this.total-1)
              this.data.splice(scope.$index, 1)
              this.getDetail()
              this.$message({
                type: 'success', message: '删除成功!' 
              })
              if(this.data.length == 0){
                if(this.PageIndex > 1){
                  this.PageIndex = 1
                  this.init()
                }else{
                  this.data.push({
                    ReportId: this.ReportId,
                    ItemId: '',
                    GoldType: 0,
                    GoldPrice: '',
                    PartTypeEk: 0,
                    PartTypeEv: '',
                    PartPrice1: '',
                    PartPrice2: '',
                    StonePackageNo: '',
                    StoneClassTypeEk: 0,
                    StoneClassTypeEv: '',
                    StonePrice1: '',
                    StonePrice2: '',
                    Quantity: '',
                    Weight: '',
                    CostPrice: '',
                    Stamp:'',
                    State: 0,
                    isEdit: false,
                    isError: false,
                  })
                }
              }
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info', message: '已取消删除' 
        })
      })
    },
    copyShow(scope) {
      this.copyVisible = true
      this.handleRow = scope
      this.copyLineForm = {
        rowsNum: 1,
        local: '1',
        current: 1
      }
    },
    copySure() {
      // 确定复制
      let local
      if (this.copyLineForm.local == 1) {
        local = this.handleRow.$index + 1
      } else {
        local = this.copyLineForm.current - 1
      }
      for (let i = 0; i < this.copyLineForm.rowsNum; i++) {
        let item = {...this.handleRow.row}
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
    resetForm() {
      this.$refs.editForm.resetFields()
    },
    currentChange (val) {
      this.PageIndex = val
      this.getGoods()
    },
    sizeChange (val) {
      this.PageIndex = 1
      this.PageSize = val
      this.getGoods()
    },
    // 批量录入条码
    listenMultiCodeEnter (codes) {
      if (codes.length) {
        this.addGood(codes)
      } else {
        this.multiCodeVisible = false
      }
    },
    // 修改报溢单基本信息
    listenEditDialog (form, flag) {
      if (flag) {
        this.detail = Object.assign(this.detail, form)
        this.getGoods()
      } else {
        this.editForm = Object.assign({
        }, this.detail)
      }
      this.editDialog = false
    },
    async orderSubmit () {
      if(this.enableSubmit){
        this.$store.commit('SET_BTN_LOADING', true)
        STOCKING_API_STUFF_COUNT_REPORT_BASIC_WAIT({
          ReportId: this.ReportId,
          CheckNote: this.detail.Note
        }).then(res => {
          this.$store.commit('SET_BTN_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            this.$router.push({
              path: '/depot/stockloss/index'
            })
          } else {
            this.$message.error(res.data.Message)
          }
          
        })
      }else {
        // let oldRow = { ...this.currentRow }
        this.handleCurrentChange()
      }
    },
    getPrice(row){
      // 石料和配件中，重单价*重量 的优先级大于 数单价*数量
      let currPrice = 0
      if(this.currTabs == this.StuffType.Gold){
        currPrice = row.GoldPrice * row.Weight
      }else if(this.currTabs == this.StuffType.Stone){
        let p1 = row.StonePrice2 * row.Weight
        let p2 = row.StonePrice1 * row.Quantity
        currPrice = p1 ? p1 : p2
      }else if(this.currTabs == this.StuffType.Part){
        let p3 = row.PartPrice2 * row.Weight
        let p4 = row.PartPrice1 * row.Quantity
        currPrice = p3 ? p3 : p4
      }
      if(currPrice > 999999999){
        this.$message.warning('金额不能超过999999999')
        row.CostPrice = 999999999
      }else{
        row.CostPrice = currPrice.toFixed(2)
      }
    },
    handlechange(row) {
      this.$refs.halfTable.setCurrentRow(row)
      row.isEdit = true
      row.isError = false
      this.currentRow = row
      this.enableSubmit = false
    },
    async handleCurrentChange(){
      let haveEdit = false
      let haveError = false
      let errorlist = []
      this.$store.commit('SET_BTN_LOADING', true)
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i].isEdit) {
          haveEdit = true
        }
        if (this.data[i].isError) {
          haveError = true
        }
        if(this.data[i].isEdit || this.data[i].isError){
          if((this.data[i].Quantity == 0 && this.data[i].Weight == 0)||(!this.data[i].Quantity&&!this.data[i].Weight)){
            this.data[i].isEdit = false
            this.data[i].isError = true
            this.$store.commit('SET_BTN_LOADING', false)
            errorlist.push(`序号${i + 1}：重量或数量输入错误<br>`)
            continue
          }
          if (this.currTabs == this.StuffType.Gold) {
            if(!this.data[i].GoldType){
              // return this.$message.error('请选择成色')
              this.data[i].isEdit = false
              this.data[i].isError = true
              this.$store.commit('SET_BTN_LOADING', false)
              errorlist.push(`序号${i + 1}：请选择成色<br>`)
              continue
            }
          }else if (this.currTabs == this.StuffType.Stone) {
            if(!this.data[i].StoneClassTypeEk){
              // return this.$message.error('请选择石类')
              this.data[i].isEdit = false
              this.data[i].isError = true
              this.$store.commit('SET_BTN_LOADING', false)
              errorlist.push(`序号${i + 1}：请选择石类<br>`)
              continue
            }
            if(!this.data[i].StonePackageNo){
              // return this.$message.error('请选择石号/包号')
              this.data[i].isEdit = false
              this.data[i].isError = true
              this.$store.commit('SET_BTN_LOADING', false)
              errorlist.push(`序号${i + 1}：请选择石号/包号<br>`)
              continue
            }
            // 石类
            if(this.$store.getters.stone&&this.data[i].StoneClassTypeEk){
              this.data[i].StoneClassTypeEv = this.$store.getters.stone.TypeArray.find(item => {
                return item.Id == this.data[i].StoneClassTypeEk
              }).Value
            }
            // 石重范围
            if(this.$store.getters.stoneWeight && this.data[i].StoneWeightEk){
              this.data[i].StoneWeightEv = this.$store.getters.stoneWeight.TypeArray.find(item => {
                return item.Id == this.data[i].StoneWeightEk
              }).Value
            }
          }else if (this.currTabs == this.StuffType.Part) {
            if(!this.data[i].PartTypeEk){
              // return this.$message.error('请选择配件名称')
              this.data[i].isEdit = false
              this.data[i].isError = true
              this.$store.commit('SET_BTN_LOADING', false)
              errorlist.push(`序号${i + 1}：请选择配件名称<br>`)
              continue
            }
            // 配件名称
            if(this.$store.getters.part&&this.data[i].PartTypeEk){
              this.data[i].PartTypeEv = this.$store.getters.part.TypeArray.find(item => {
                return item.Id == this.data[i].PartTypeEk
              }).Value
            }
          }
        }
        
        if (this.data[i].isEdit || this.data[i].isError) {
          let res
          let obj = {...this.data[i]}
          obj.GoldPrice = this.$root.toInt(obj.GoldPrice)
          obj.StonePrice1 = this.$root.toInt(obj.StonePrice1)
          obj.StonePrice2 = this.$root.toInt(obj.StonePrice2)
          obj.PartPrice1 = this.$root.toInt(obj.PartPrice1)
          obj.PartPrice2 = this.$root.toInt(obj.PartPrice2)
          obj.Quantity = Number(obj.Quantity)||0
          obj.Weight = this.$root.toInt(obj.Weight,3)
          obj.CostPrice = this.$root.toInt(obj.CostPrice)

          if (this.data[i].ItemId) {
            res = await STOCKING_API_STUFF_COUNT_REPORT_ITEM_UPDATE(obj)
          } else {
            res = await STOCKING_API_STUFF_COUNT_REPORT_ITEM_CREATE(obj)
          }
          
          this.$store.commit('SET_BTN_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.data[i].isEdit = false
            if (!this.data[i].ItemId) {
              this.$set(this.data[i], 'ItemId', res.data.Data)
            }
          }else{
            this.data[i].isEdit = false
            this.data[i].isError = true
            errorlist.push(`序号${i + 1}：${res.data.Message}<br>`)
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
          this.getDetail()
          this.enableSubmit = true
        }
      }
      this.$store.commit('SET_BTN_LOADING', false)
    },
    getEnums() {
      this.$store.dispatch('GET_STONE_TYPE', this.YNStatus.Yes)
      this.$store.dispatch('GET_PART_TYPE', this.YNStatus.Yes)
      this.$store.dispatch('GET_GOLD_TYPE', this.YNStatus.Yes)
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', {HasShelf: this.YNStatus.Yes, State: this.YNStatus.Yes})
    },
  },
  beforeMount () {
    this.getEnums()
  },
  mounted () {
    this.init()
  },
  components: {
    pagination,
    multiCodeEnter,
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/erp/purchase.scss';
.fixed-tr .el-form-item{
  margin-bottom: 0px;
}
.fixed-tr .el-form-item--mini{
  margin-bottom: 0px;
}
.shelf-box{
  .el-form-item__content{
    margin-left: 0px!important;
  }
}
</style>
<style lang="scss" scoped>
.dialog-title {
  display: flex;
  justify-content: space-between;
  align-items: center
}
.dialog-upload-tip p {
  padding-top: 5px;
}
.icon {
  font-size: 16px;
  font-weight: bold;
  color: #1f91df;
  vertical-align: middle;
  &.el-icon-minus {
    color: #da0000;
  }
}
.code-input {
  width: 250px;
  margin-right: 10px;
  vertical-align: middle;
}
.count {
  padding-right: 15px;
  line-height: 36px;
  text-align: right;
  font-size: 14px;
}
.details-table .tit {
  width: 100px;
}
</style>
