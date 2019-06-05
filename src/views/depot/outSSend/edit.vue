<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title fl">编辑委外加工发料单</span>
        <span @click="editDialog = true,getShelfs()" class="title text-btn fr">修改</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.SendCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime | filterDateTime}}</td>
                <td class="tit">审核</td>
                <td v-if="detail.State === weiwStuffSendBasicState.Audit || detail.State === weiwStuffSendBasicState.Reject">
                  {{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime | filterDateMinutes}}
                </td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">仓库</td>
                <td>{{detail.WarehouseName}}{{detail.ShelfName?'>'+detail.ShelfName:''}}</td>
                <td class="tit">加工原因</td>
                <td>{{detail.ReasonTypeDv}}</td>
                <td class="tit">供应商</td>
                <td>{{detail.PartnerName}}</td>
              </tr>
              <tr>
                <td class="tit">备注</td>
                <td class="note" colspan="5">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="m-10">
          <ul class="tabs m-b-1">
            <li class="tab" :class="{active: currTabs == StuffType.Gold}" @click="changeTabs(StuffType.Gold)">金料</li>
            <li class="tab" :class="{active: currTabs == StuffType.Stone}" @click="changeTabs(StuffType.Stone)">石料</li>
            <li class="tab" :class="{active: currTabs == StuffType.Part}" @click="changeTabs(StuffType.Part)">配件</li>
          </ul>
          <!--  -->
          <el-table
            class="tabs-input edit-table"
            v-scrollshow="handelScrollshow"
            :data="data" 
            ref="halfTable" 
            v-loading="$store.getters.tb_loading" 
            element-loading-text="拼命加载中" 
            highlight-current-row
            :row-class-name="setEditRow"
            height="600">
            <el-table-column type="index" label="序号" width="50" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="currTabs == StuffType.Gold" prop="GoldType" key="100" min-width="100">
              <template slot="header">
                <p>
                  <span style="color: red">*</span>
                  <span>成色</span>
                </p>
              </template>
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-select v-model="scope.row.GoldType" placeholder="请选择" @change="handleFocus(scope.row)">
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option v-for="item in $store.getters.goldType.TypeArray" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column v-if="currTabs == StuffType.Stone" key="201" prop="StoneClassTypeEk" min-width="100">
              <template slot="header">
                <p>
                  <span style="color: red">*</span>
                  <span>石类</span>
                </p>
              </template>
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-select v-model="scope.row.StoneClassTypeEk" placeholder="请选择" @change="handleFocus(scope.row)">
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option v-for="item in $store.getters.stone.TypeArray" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="202" prop="StonePackageNo" min-width="100">
              <template slot="header">
                <p>
                  <span style="color: red">*</span>
                  <span>石号/包号</span>
                </p>
              </template>
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.StonePackageNo" @blur="scope.row.StonePackageNo = scope.row.StonePackageNo.trim()" :maxlength="30" @change="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="203" prop="StoneWeightEk" label="石重范围" min-width="100">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-select v-model="scope.row.StoneWeightEk" placeholder="请选择" @change="handleFocus(scope.row)">
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option v-for="item in $store.getters.stoneWeight.TypeArray" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="204" prop="StoneColor" label="颜色" min-width="100">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-select v-model="scope.row.StoneColor" placeholder="请选择" @change="handleFocus(scope.row)">
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option v-for="item in StoneColor.TypeArray" :key="item.Id" :label="item.Value" :value="item.KeyId"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="205" prop="StoneClarity" label="净度" min-width="100">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-select v-model="scope.row.StoneClarity" placeholder="请选择" @change="handleFocus(scope.row)">
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option v-for="item in StoneClarity.TypeArray" :key="item.Id" :label="item.Value" :value="item.KeyId"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="206" prop="StoneCut" label="切工" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <!-- <el-input-number v-model="scope.row.StoneCut" :precision="0" @change="handleFocus(scope.row)" :controls="false"></el-input-number> -->
                <el-select v-model="scope.row.StoneCut" placeholder="请选择" @change="handleFocus(scope.row)">
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option v-for="(item, index) in StoneCut.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="207" prop="StoneSpec" label="规格" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.StoneSpec" :maxlength='20' @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            
            <el-table-column v-if="currTabs == StuffType.Part" key="300" prop="PartTypeEk" min-width="130">
              <template slot="header">
                <p>
                  <span style="color: red">*</span>
                  <span>配件名称</span>
                </p>
              </template>
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-select v-model="scope.row.PartTypeEk" placeholder="请选择" @change="handleFocus(scope.row)">
                  <el-option label="请选择" :value="0"></el-option>
                  <el-option v-for="item in $store.getters.part.TypeArray" :key="item.Id" :label="item.Value" :value="item.Id"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="Weight" :label="currTabs == StuffType.Stone?'重量(ct)':'重量(g)'" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.Weight" :maxlength="10" @keyup.native="scope.row.Weight = $root.toFixed(scope.row.Weight, 3)" @blur="getPrice(scope.row)"  @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" label="数量" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.Quantity" :maxlength="8" @keyup.native="scope.row.Quantity = $root.toFixed(scope.row.Quantity,0)" @blur="getPrice(scope.row)" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>

            <el-table-column v-if="currTabs == StuffType.Stone" key="209" prop="StonePrice2" label="重单价" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.StonePrice2" @blur="getPrice(scope.row)" :maxlength='10' @keyup.native="scope.row.StonePrice2 = $root.toFixed(scope.row.StonePrice2, 2)" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Stone" key="208" prop="StonePrice1" label="数单价" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.StonePrice1" @blur="getPrice(scope.row)" :maxlength='10' @keyup.native="scope.row.StonePrice1 = $root.toFixed(scope.row.StonePrice1, 2)" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Part"  key="302" prop="PartPrice2" label="重单价" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.PartPrice2" :maxlength='10' @keyup.native="scope.row.PartPrice2 = $root.toFixed(scope.row.PartPrice2, 2)" @blur="getPrice(scope.row)" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column v-if="currTabs == StuffType.Part" key="301" prop="PartPrice1" label="数单价" min-width="130">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.PartPrice1" :maxlength='10' @keyup.native="scope.row.PartPrice1 = $root.toFixed(scope.row.PartPrice1, 2)" @blur="getPrice(scope.row)" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            
            <el-table-column v-if="currTabs == StuffType.Gold" key="101" prop="GoldPrice" label="金价(元/克)" min-width="80">
              <template v-if="scope.$index >= currentStartIndex && scope.$index <= currentEndIndex" slot-scope="scope">
                <el-input v-model="scope.row.GoldPrice" @blur="getPrice(scope.row)" :maxlength='10' @keyup.native="scope.row.GoldPrice = $root.toFixed(scope.row.GoldPrice, 2)" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="Price" label="金额" min-width="130">
              <template slot-scope="scope">
                <el-input v-model="scope.row.Price" :maxlength="10" @keyup.native="scope.row.Price = $root.toFixed(scope.row.Price, 2)" @input="handleFocus(scope.row)"></el-input>
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
      <el-button type="primary" @click="orderSubmit" :loading="$store.getters.is_loading" name="btnSaveMaterial">{{ enableSubmit ? '提交审核': '保存'}}</el-button>
      <template>
      <el-button @click="$router.back(-1)">返回</el-button>
      </template>
    </div>

    <!-- @module Dialog·修改委派单 -->
    <el-dialog title="修改" :visible.sync="editDialog">
      <el-form :model="editForm" label-position="right" :rules="rules" label-width="100px" ref="editForm">
        <el-row>
          <el-col :span="9">
            <el-form-item label="仓库：" prop="WarehouseId" required>
              <el-select class="m-r-10" v-model="editForm.WarehouseId" disabled placeholder="请选择" :filterable="true" name="StuffType">
                <template  v-for="(item,index) in $store.getters.wareHouses">
                  <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item class="shelf-box" prop="ShelfId">
              <el-select v-model="editForm.ShelfId" disabled placeholder="请选择" label-width="0" :filterable="true" name="StuffType">
                <el-option v-for="(item,index) in Shelfs" :key="index" :label="item.Value" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="供应商：" prop="PartnerId" required>
          <el-select v-model="editForm.PartnerId" placeholder="请选择" :filterable="true">
            <template v-for="(item, index) in $store.getters.suppliers">
              <el-option v-if="(item.PartnerType == PartnerType.Merchant||item.PartnerType == PartnerType.Supplier)&&item.State==YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id" ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="加工原因：" prop="ReasonTypeDk">
          <el-select v-model="editForm.ReasonTypeDk" placeholder="请选择" :filterable="true">
            <el-option label="请选择" :value="0"></el-option>
            <el-option v-for="(item, index) in reasonData" :key="index" :label="item.Value" :value="item.Id"></el-option>
          </el-select>
          <span class="icon-set-item" @click="dictDialog=true">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item label="备注：" >
          <el-input type="textarea" row="2" v-model="editForm.Note" :maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editPurchase" :loading="$store.getters.is_loading">确 定</el-button>
        <el-button @click="editDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·修改委派单 -->

    <!-- @module Dialog·编辑委派单原因 -->
    <dictManage v-if="dictDialog" :visible.sync="dictDialog" @listenDictSave="listenDictSave" :dialogTitle="dialogTitle" :dictType="settingDictionaryDictType.WeiwStuffSendBasicReasonType" :dicts="reasonData"></dictManage>
    <!-- @module Dialog·编辑委派单结束  -->

    <!-- 增加行数 -->
    <el-dialog title="插入空白行" :visible.sync="addVisible" width="450px">
      <el-form :model="addLineForm" @keyup.enter.native="addSure" @submit.native.prevent>
        <el-form-item label="行数：">
          <el-input-number name="rowsNum" v-model="addLineForm.rowsNum" :min="1" :max="50" :precision="0" :controls="false" style="width: 200px"></el-input-number>
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
        <el-button name="btnAdd" type="primary" :loading="$store.getters.is_loading" @click="addSure">确定</el-button>
        <el-button name="btnClose" @click="addVisible=false">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 增加行数 -->
    <!-- 复制行 -->
    <el-dialog title="复制当前行" :visible.sync="copyVisible" width="450px">
      <el-form :model="copyLineForm" @keyup.enter.native="copySure" @submit.native.prevent>
        <el-form-item label="行数：">
          <!-- <el-input name="rowsNum" v-model="addLineForm.rowsNum"></el-input> -->
          <el-input-number name="rowsNum" v-model="copyLineForm.rowsNum" :min="1" :max="50" :precision="0" :controls="false" style="width: 200px"></el-input-number>
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
        <el-button name="btnCopy" type="primary" :loading="$store.getters.is_loading" @click="copySure">确定</el-button>
        <el-button name="btnClose" @click="copyVisible=false">取消</el-button>
      </span>
    </el-dialog>
    <!-- End 复制行 -->
  </div>
</template>

<script>
import {
  WeiwStuffSendBasicState,
  SettingDictionaryDictType,
  SettingEnumeratorEnumeratorType,
  StoneColor,
  StoneClarity,
  StoneCut
} from '@/enums/stocking.js'
import {
  CharacterType,
  StuffType,
  YNStatus,
  PartnerType
} from '@/enums/common.js'
import {
  STOCKING_API_WEIW_STUFF_SEND_BASIC_GET,
  STOCKING_API_WEIW_STUFF_SEND_BASIC_WAIT,
  STOCKING_API_WEIW_STUFF_SEND_ITEM_GETS,
  STOCKING_API_WEIW_STUFF_SEND_ITEM_CREATE,
  STOCKING_API_WEIW_STUFF_SEND_ITEM_UPDATE,
  STOCKING_API_WEIW_STUFF_SEND_ITEM_DELETE,
  STOCKING_API_WEIW_STUFF_SEND_BASIC_UPDATE
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST 
} from '@/apis/merchant.js'

import pagination from '@/components/pagination'
import dictManage from '@/components/erp/dictManage'

export default {
  data() {
    return {
      PartnerType,
      YNStatus,
      StoneColor,
      StoneClarity,
      StoneCut,
      SettingEnumeratorEnumeratorType,
      characterTypes: CharacterType,
      goodsData: [], // 货品数据
      reasonData: [], // 原因下拉
      weiwStuffSendBasicState: WeiwStuffSendBasicState,
      settingDictionaryDictType: SettingDictionaryDictType,
      StuffType,
      pageSize: 20, // 分页数据条数
      pageIndex: 1, // 当前页面位置
      totalCount: 0, // 总数据条数
      SendId: '',
      dialogTitle: '委外加工发料原因',
      currTabs: StuffType.Gold, // 当前选中的tabs
      enableSubmit: true, // 控制请求一个一个提交
      currentRow: 0,
      detail: {},
      data: [],
      parameters: {
        SendId: '',
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      rules: {
        WarehouseId: [{required: true}],
        PartnerId: [{required: true}]
      },
      editForm: {},
      Shelfs: [],
      value: '',
      dictDialog: false,
      editDialog: false,
      visible: false,
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
  // computed: {
  //   pages() {
  //     return (
  //       (this.totalCount % this.pageSize === 0
  //         ? this.totalCount / this.pageSize
  //         : parseInt(this.totalCount / this.pageSize) + 1) || 1
  //     )
  //   }
  // },
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
    init() {
      let query = this.$route.query
      this.SendId = Number(query.id)||0
      if (!this.SendId) {
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
      STOCKING_API_WEIW_STUFF_SEND_BASIC_GET({
        SendId: this.SendId
      }).then(res => {
        if(res.data.Code === 'CORRECT'){
          this.detail = res.data.Data
          this.editForm = Object.assign({}, this.detail)
        }
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_WEIW_STUFF_SEND_ITEM_GETS({
        SendId: this.SendId, 
        StuffType: this.currTabs,
        OrderBy: 0,
        IsAsced: this.YNStatus.Yes,
        PageIndex: this.parameters.PageIndex,
        PageSize: this.parameters.PageSize
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if(res.data.Code == 'CORRECT'){
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count||0
          this.data.forEach(item => {
            item.GoldPrice = this.$root.toFloat(item.GoldPrice)
            item.StonePrice1 = this.$root.toFloat(item.StonePrice1)
            item.StonePrice2 = this.$root.toFloat(item.StonePrice2)
            item.PartPrice1 = this.$root.toFloat(item.PartPrice1)
            item.PartPrice2 = this.$root.toFloat(item.PartPrice2)
            item.Weight = this.$root.toFloat(item.Weight,3)
            item.Price = this.$root.toFloat(item.Price)
          })

          if(this.data.length == 0){
            for (let i = this.data.length; i < 10; i++) {
              this.data.push({
                SendId: this.SendId,
                GoldType: 0,
                StuffType: this.currTabs,
                ItemId: '',
                GoldPrice: '',
                CostPrice: '',
                PartTypeEk: 0,
                PartTypeEv: '',
                PartPrice1: '',
                PartPrice2: '',
                StonePackageNo: '',
                StoneClassTypeEk: 0,
                StoneClassTypeEv: '',
                StoneWeightEk: 0,
                StoneWeightEv: '',
                StoneColor: 0,
                StoneClarity: 0,
                StoneCut: 0,
                StonePrice1: '',
                StonePrice2: '',
                Quantity: '',
                Weight: '',
                Price: '',
                Note: '',
                isEdit: false,
                isError: false
              })
              this.$store.commit('SET_BTN_LOADING', false)
            }
          }
        }
      })
    },
    changeTabs(type){
      this.currTabs = type
      this.data = []
      this.parameters.PageIndex = 1
      this.parameters.PageSize = 20
      this.total = 0
      this.enableSubmit = true
      this.getGoods()
    },
    getShelfs(){
      this.Shelfs = this.$store.getters.wareHouses.find(item => {
        return item.Id == this.detail.WarehouseId
      }).Childrens
    },
    orderSubmit(){
      // this.$store.commit('SET_BTN_LOADING', true)
      if(this.enableSubmit){
        STOCKING_API_WEIW_STUFF_SEND_BASIC_WAIT({
          SendId: this.detail.SendId, CheckNote: this.detail.Note
        }).then(res => {
          if(res.data.Code === 'CORRECT'){
            this.$router.push({
              path: '/depot/outSSend/index'
            })
          }
          this.$store.commit('SET_BTN_LOADING', false)
        }).catch(() => {
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }else {
        // let oldRow = { ...this.currentRow }
        this.handleCurrentChange()
      }
    },
    editPurchase(){
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_WEIW_STUFF_SEND_BASIC_UPDATE({
            SendId: this.SendId,
            PartnerId: this.editForm.PartnerId,
            ReasonTypeDk: this.editForm.ReasonTypeDk,
            ReasonTypeDv: this.editForm.ReasonTypeDk?this.getReasonName(this.editForm.ReasonTypeDk):'',
            Note: this.editForm.Note,
          }).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if(res.data.Code == 'CORRECT'){
              this.$message.success('提交成功！')
              this.editDialog = false
              this.getDetail()
            }else{
              this.$message.error(res.data.Message)
            }
          })
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    getReasonName(id){
      let result = this.reasonData.find(item => {
        return item.Id == id
      })
      return result.Value
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
      if(this.addLineForm.rowsNum>50){
        this.$message.error('最多插入50行')
        return
      }
      let local
      local = this.addLineForm.local == 1 ? 1 : 0
      for (let i = 0; i < this.addLineForm.rowsNum; i++) {
        this.data.splice(this.handleRow.$index + local, 0, {
          SendId: this.SendId,
          GoldType: 0,
          StuffType: this.currTabs,
          ItemId: '',
          GoldPrice: '',
          CostPrice: '',
          PartTypeEk: 0,
          PartTypeEv: '',
          PartPrice1: '',
          PartPrice2: '',
          StonePackageNo: '',
          StoneClassTypeEk: 0,
          StoneClassTypeEv: '',
          StoneWeightEk: 0,
          StoneWeightEv: '',
          StoneColor: 0,
          StoneClarity: 0,
          StoneCut: 0,
          StonePrice1: '',
          StonePrice2: '',
          Quantity: '',
          Weight: '',
          Price: '',
          Note: '',
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
      }).then(() => {
        console.log('scope.row', scope.row)
        if (!scope.row.ItemId) { // 删除空白行
          this.data.splice(scope.$index, 1)
          if(this.data.length == 0){
            this.PageIndex = 1
            this.init()
          }
        } else { // 删除有数据的行
          STOCKING_API_WEIW_STUFF_SEND_ITEM_DELETE({
            ItemId: scope.row.ItemId,
            SendId: scope.row.SendId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.total=Math.max(0,this.total-1)
              this.data.splice(scope.$index, 1)
              this.getDetail()
              this.$message({
                type: 'success', message: '删除成功!' 
              })
              if(this.data.length == 0){
                if(this.parameters.PageIndex > 1){
                  this.parameters.PageIndex = 1
                  this.init()
                }else{
                  this.data.push({
                    SendId: this.SendId,
                    GoldType: 0,
                    StuffType: this.currTabs,
                    ItemId: '',
                    GoldPrice: '',
                    CostPrice: '',
                    PartTypeEk: '',
                    PartTypeEv: '',
                    PartPrice1: '',
                    PartPrice2: '',
                    StonePackageNo: '',
                    StoneClassTypeEk: 0,
                    StoneClassTypeEv: '',
                    StoneWeightEk: 0,
                    StoneWeightEv: '',
                    StoneColor: 0,
                    StoneClarity: 0,
                    StoneCut: 0,
                    StonePrice1: '',
                    StonePrice2: '',
                    Quantity: '',
                    Weight: '',
                    Price: '',
                    Note: '',
                    isEdit: false,
                    isError: false
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
        this.enableSubmit = false
        this.copyVisible = false
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
        row.Price = 999999999
      }else{
        row.Price = currPrice.toFixed(2)
      }
    },
    handleFocus(row) {
      this.$refs.halfTable.setCurrentRow(row)
      row.isEdit = true
      row.isError = false
      this.currentRow = row
      this.enableSubmit = false
    },
    async handleCurrentChange() {
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
          if(this.currTabs == this.StuffType.Gold){
            // 验证金料
            if(!this.data[i].GoldType){
              // return this.$message.error('请选择成色')
              this.data[i].isEdit = false
              this.data[i].isError = true
              this.$store.commit('SET_BTN_LOADING', false)
              errorlist.push(`序号${i + 1}：请选择成色<br>`)
              continue
            }
          }else if(this.currTabs == this.StuffType.Stone){
            // 验证石料
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
            if(this.data[i].StoneWeightEk){
              this.data[i].StoneWeightEv = this.$store.getters.stoneWeight.TypeArray.find(item => {
                return item.Id == this.data[i].StoneWeightEk
              }).Value
            }
          }else{
            // 验证配件
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
          obj.Price = this.$root.toInt(obj.Price)
          if (this.data[i].ItemId) {
            res = await STOCKING_API_WEIW_STUFF_SEND_ITEM_UPDATE(obj)
          } else {
            res = await STOCKING_API_WEIW_STUFF_SEND_ITEM_CREATE(obj)
          }
          this.$store.commit('SET_BTN_LOADING', true)
          
          this.$store.commit('SET_BTN_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.data[i].isEdit = false
            if (!this.data[i].ItemId) {
              this.total=Math.max(0,this.total+1)
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
      }else {
        if (haveEdit || !haveError) {
          this.$message.success('保存成功')
          this.getDetail()
          this.enableSubmit = true
        }
      }
      this.$store.commit('SET_BTN_LOADING', false)
    },
    listenDictSave(){
      this.getReasons()
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.getGoods()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.getGoods()
    },
    getEnums(){
      this.$store.dispatch('GET_GOLD_TYPE', this.YNStatus.Yes)
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', {HasShelf: this.YNStatus.Yes, State: this.YNStatus.Yes})
      this.$store.dispatch('GET_SUPPLIERS_DROPLIST')
      this.$store.dispatch('GET_STONE_TYPE', this.YNStatus.Yes)
      this.$store.dispatch('GET_PART_TYPE', this.YNStatus.Yes)
      this.$store.dispatch('GET_STONEWEIGHT', this.YNStatus.Yes)
    },
    getReasons(){
      // this.$store.dispatch('GET_REASONS_DROPLIST', {DictType: this.settingDictionaryDictType.WeiwStuffSendBasicReasonType, State: this.YNStatus.Yes})
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: this.settingDictionaryDictType.WeiwStuffSendBasicReasonType,
        State: this.YNStatus.Yes
      }).then(res => {
        if(res.data.Code == 'CORRECT'){
          this.reasonData = res.data.Data.Rows||[]
          if(!this.reasonData.some(item => item.Id === this.editForm.ReasonTypeDk)){
            this.editForm.ReasonTypeDk = ''
            this.editForm.ReasonTypeDv = ''
          }
        }
      })
    }
  },
  beforeMount(){
    this.getEnums()
    this.getReasons()
  },
  mounted() {
    this.init() 
  },
  watch: {
    pageIndex: 'getGoods',
    pageSize() {
      this.pageIndex = 1
      this.getGoods()
    }
  },
  components: {
    pagination,
    dictManage
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
</style>

<style lang="scss" scoped>
.import-purchase-dialog {
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

.goods-wrapper .goods-left .toolsbar {
  height: 98px;
}
.goods-wrapper .goods-left .toolsbar .count-bar {
  border-bottom: 1px solid #ddd;
}
.goods-wrapper .goods-left .toolsbar .count-bar:nth-child(3) {
  border: none;
}
.m-b-1{
  margin-bottom: 1px;
}
.icon-btn{
  margin-right: 5px;
  font-size: 16px;
  vertical-align: middle;
  cursor: pointer;
}
.reduce-c{
  color: #D04848;
}
.add-c{
  color: #40A2E5;
}
</style>
