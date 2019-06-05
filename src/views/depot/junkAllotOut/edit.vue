<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">编辑旧货调拨出库单</span>
        <span class="fr title">
          <el-button type="text" @click="editJunk">
            修改
          </el-button>
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
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime|filterDateTime}}</td>
                <td class="tit">审核：</td>
                <td v-if="detail.State === junkAllotOrderOutakeState.Audit || detail.State === junkAllotOrderOutakeState.Reject">
                  {{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime|filterDateTime}}
                </td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">发货位置：</td>
                <!-- <td class="note" v-if="detail.StoreName1" colspan="1">{{detail.StoreName1}}</td> -->
                <td class="note" v-if="characterType != CharacterType.Store" colspan="1">{{detail.WarehouseName1}} > {{detail.ShelfName1}}</td>
                <td class="note" v-else colspan="1">{{detail.StoreName1}}</td>
                <td class="tit">调拨原因：</td>
                <td class="note" colspan="1">{{detail.ReasonTypeDv}}</td>
                <td class="tit">收货单位：</td>
                <td v-if="detail.StoreName2">{{detail.StoreName2}}</td>
                <td v-else class="note" colspan="3">{{detail.WarehouseName2 == 0?'总部仓库':(detail.WarehouseName2 + '&nbsp;&gt;&nbsp;' + detail.ShelfName2)}}</td>
              </tr>
              <tr>
                <td class="tit">收货方式：</td>
                <td class="note" colspan="1">{{ShippingType.Types[detail.ShippingType]}}</td>
                <td class="tit">发货人：</td>
                <td class="note" colspan="1">{{detail.SendUser}}</td>
                <td class="tit">发货人电话：</td>
                <td class="note" colspan="3">{{detail.SendPhone}}</td>
              </tr>
              <tr>
                <td class="tit">收货人：</td>
                <td class="note" colspan="1">{{detail.ReceiptUser}}</td>
                <td class="tit">收货人电话：</td>
                <td class="note" colspan="1">{{detail.ReceiptPhone}}</td>
                <td class="tit">发快递公司：</td>
                <td class="note" colspan="3">{{ExpressType.Types[detail.ExpressType]}}</td>
              </tr>
              <tr>
                <td class="tit">快递单号：</td>
                <td class="note">{{detail.ExpressCode}}</td>
                <td class="tit">业务日期：</td>
                <td class="note" colspan="3">{{detail.ActualDate|filterDate}}</td>
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
            <el-col :span="12">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-input placeholder="录入/扫描条码" prefix-icon="el-icon-search" v-model="searchJunkCode" @keyup.enter.native="searchCode" :maxlength="50" name="searchJunkCode"></el-input>
                </el-col>
                <el-col :span="12">
                  <el-button type="primary" @click="createDialog = true" name="btnCreate">选择旧货</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12" class="tr">
              <span class="detail-info-num-item">
                总件数：<b class="num">{{detail.Quantity}}</b>
              </span>
              <span class="detail-info-num-item">
                总金重：<b class="num">{{ $root.toFloat(detail.GoldWeight, 3) }}g</b>
              </span>
              <span class="detail-info-num-item">
                结算金额：<b class="num">￥{{ $root.toFloat(detail.Preprice) }}元</b>
              </span>
            </el-col>
          </el-row>
        </div>
        <div class="p-x-10">
          <!-- 表格 -->
          <el-table 
            :data="goodsData" 
            @sort-change="sortChange" 
            v-loading="$store.getters.tb_loading" 
            element-loading-text="拼命加载中">
            <el-table-column prop="JunkCode" label="旧货编号" min-width="140" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="init-button-text" @click="checkJunk({type:scope.row.IsGold,id:scope.row.JunkId})">{{scope.row.JunkCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="JunkName" label="旧货名称" min-width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="IsGold" label="类型" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.IsGold == YNStatus.Yes ?'素金':'非素'}}
              </template>
            </el-table-column>
            <el-table-column prop="MaterialType" label="材质" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$store.getters.materialType.Types[scope.row.MaterialType]}}
              </template>
            </el-table-column>
            <el-table-column prop="CategoryType" label="品类" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$store.getters.categoryType.Types[scope.row.CategoryType]}}
              </template>
            </el-table-column>
            <el-table-column prop="GoldType" label="成色" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$store.getters.goldType.Types[scope.row.GoldType]}}
              </template>
            </el-table-column>
            <el-table-column prop="GoldWeight" label="金重" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column prop="RecallGoldPrice" label="回收金价(元/g)" min-width="90" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallGoldPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="RecallPrice" label="回收金额(元)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="RecallFee" label="回收工费(元)" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.RecallFee)}}
              </template>
            </el-table-column>
            <el-table-column prop="CreateTime" label="回收时间" min-width="120" sortable="custom" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.CreateTime|filterDateTime}}
              </template>
            </el-table-column>
            <el-table-column prop="Price" label="结算金额" min-width="150">
              <template slot-scope="scope">
                <el-input v-model="scope.row.Price" :maxlength="10" @keyup.native="scope.row.Price=$root.toFixed(scope.row.Price,2)" @blur="saveData(scope.row)" name="RecallFee" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="State" label="操作" min-width="80">
              <template slot-scope="scope">
                <el-button type="text" @click="removeItem($event, scope.row)" name="btnRemoveItem">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- end  表格 -->
          <!-- 分页 -->
          <!-- <div class="p-10"> -->
          <pagination :pg="pageIndex" :size="pageSize" :total="totalCount" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
          <!-- </div> -->
          <!-- 分页 end -->
        </div>
      </div>
    </div>

    <div class="buttons">
      <el-button type="primary" @click="orderSubmit" :loading="$store.getters.is_loading" name="btnOrderSubmit">提交审核</el-button>
      <el-button @click="$router.back(-1)">返回</el-button>
    </div>

    <!-- 选择旧货 -->
    <junkCreate v-if="createDialog" :createDialog="createDialog" :detail="detail" :OutakeId="OutakeId" @listenCreateDialog="listenCreateDialog"></junkCreate>
    <!-- end 选择旧货 -->

    <!-- @module Dialog·新建退货原因 -->
    <dict-manage v-if="reasonDialog" :visible.sync="reasonDialog" :dicts="reasonData" :dialogTitle="dialogTitle" :dictType="settingDictionaryDictType.JunkAllotOrderOutakeReasonType" @listenDictSave="listenDictSave"></dict-manage>
    <!-- End Dialog·新建退货原因  -->

    <!-- @module 修改旧货出库单 -->
    <el-dialog title="编辑旧货出库单" :visible.sync="editDialog">
      <el-form label-position="right" label-width="100px" :model="editForm" :rules="rules" ref="editForm">
        <el-row v-if="characterType != CharacterType.Store">
          <el-col :span="9">
            <el-form-item label="发货位置：" prop="WarehouseId1">
              <el-select class="m-r-10" v-model="editForm.WarehouseId1" disabled placeholder="请选择" :filterable="true" name="StuffType">
                <template v-for="(item,index) in $store.getters.wareHouses">
                  <el-option :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item class="shelf-box" prop="ShelfId1">
              <el-select v-model="editForm.ShelfId1" placeholder="请选择" disabled label-width="0" :filterable="true" name="StuffType">
                <template v-for="(item,index) in Shelfs1">
                  <el-option :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="调拨原因：" prop="ReasonTypeDk">
          <el-select v-model="editForm.ReasonTypeDk" placeholder="请选择" name="ReasonTypeDk">
            <el-option v-for="(item, index) in reasonData" :key="index" :label="item.Value" :value="Number(item.Id)"></el-option>
          </el-select>
          <span class="icon-set-item" @click="reasonDialog=true">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item v-if="editForm.StoreName2" label="收货单位：" prop="WarehouseId2">
          <el-select class="m-r-10" v-model="editForm.StorechterId2" disabled placeholder="请选择" :filterable="true" name="StuffType">
            <el-option v-for="(item,index) in $store.getters.stores" :key="index" :label="item.Value" :value="item.CharacterId"></el-option>
          </el-select>
        </el-form-item>
        <el-row v-else>
          <el-col :span="9">
            <el-form-item label="收货单位：" prop="WarehouseId2">
              <el-select class="m-r-10" v-model="editForm.WarehouseId2" disabled placeholder="请选择" :filterable="true" name="StuffType">
                <el-option label="总部仓库" :value="0"></el-option>
                <template v-for="(item,index) in $store.getters.wareHouses">
                  <el-option :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="editForm.WarehouseId2" :span="15">
            <el-form-item class="shelf-box" prop="ShelfId2">
              <el-select v-model="editForm.ShelfId2" placeholder="请选择" disabled label-width="0" :filterable="true" name="StuffType">
                <template v-for="(item,index) in Shelfs2">
                  <el-option :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="业务日期：" prop="ActualDate">
          <el-date-picker
            v-model="editForm.ActualDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="$store.getters.businessDate">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="收货方式：" prop="ShippingType">
          <el-radio-group v-model="editForm.ShippingType" name="ShippingType">
            <el-radio :label="ShippingType.PickedUp">{{ShippingType.Types[ShippingType.PickedUp]}}</el-radio>
            <el-radio :label="ShippingType.Express">{{ShippingType.Types[ShippingType.Express]}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="快递公司：" prop="ExpressType">
          <el-select v-model="editForm.ExpressType" placeholder="请选择" name="ExpressType">
            <el-option label="请选择" :value="0"></el-option>
            <el-option v-for="(item, index) in ExpressType.TypeArray" :key="index" :label="item.Value" :value="Number(item.KeyId)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号：" prop="ExpressCode">
          <el-input v-model="editForm.ExpressCode" :maxlength="50" name="ExpressCode"></el-input>
        </el-form-item>
        <el-form-item label="发货人：" prop="SendUser">
          <el-input v-model="editForm.SendUser" :maxlength="50" name="SendUser"></el-input>
        </el-form-item>
        <el-form-item label="发货人电话：" prop="SendPhone">
          <el-input v-model="editForm.SendPhone" :maxlength="50" name="SendPhone"></el-input>
        </el-form-item>
        <el-form-item label="收货人：" prop="ReceiptUser">
          <el-input v-model="editForm.ReceiptUser" :maxlength="50" name="ReceiptUser"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话：" prop="ReceiptPhone">
          <el-input v-model="editForm.ReceiptPhone" :maxlength="50" name="ReceiptPhone"></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" v-model="editForm.Note" :maxlength="200" name="note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editJunkOut" :loading="$store.getters.is_loading" name="btnEditJunkOut">保 存</el-button>
        <el-button @click="editDialog = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End 修改旧货出库单 -->

    <!-- 查看素金 & 非素 -->
    <goldCheck v-if="checkDialog" :checkDialog="checkDialog" v-on:closeDialog=" checkDialog = !checkDialog " :checkInfo="checkParams"></goldCheck>
    <!-- end 查看素金 & 非素 -->

  </div>
</template>

<script>
import dayjs from 'dayjs'
import {
  JunkAllotOrderOutakeState,
  SettingDictionaryDictType
} from '@/enums/stocking.js'
import {
  YNStatus,
  ExpressType,
  ShippingType,
  CharacterType
} from '@/enums/common.js'
import {
  STOCKING_API_JUNK_ALLOT_ORDER_ITEM_CREATE,
  STOCKING_API_JUNK_ALLOT_ORDER_ITEM_DELETE,
  STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_UPDATE,
  STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_GET,
  STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_WAIT,
  STOCKING_API_JUNK_ALLOT_ORDER_ITEM_GETS,
  STOCKING_API_JUNK_ALLOT_ORDER_ITEM_UPDATE
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST
} from '@/apis/merchant.js'

import goodsDetails from '@/components/erp/goodsDetails'
import pagination from '@/components/pagination'
import dictManage from '@/components/erp/dictManage'
import junkCreate from './create'
import goldCheck from '@/components/erp/goldCheck.vue'

export default {
  data() {
    return {
      YNStatus,
      ExpressType,
      CharacterType,
      ShippingType,
      junkAllotOrderOutakeState: JunkAllotOrderOutakeState,
      settingDictionaryDictType: SettingDictionaryDictType,
      data: [],
      detail: {
        GoldWeight: 0,
        Price: 0,
        RecallFee: 0
      }, // 基本信息
      editForm: {
      }, // 修改表单
      goodsData: [], // 货品数据
      reasonData: [], // 原因下拉数据
      pageSize: 20, // 分页数据条数
      pageIndex: 1, // 当前页面位置
      totalCount: 0, // 总数据条数
      searchJunkCode: '', // 搜索旧货code
      OutakeId: '',
      editDialog: false, // 修改基本信息对话框
      goodsId: '', // 选中的货品id
      itemId: '',
      isAsc: YNStatus.No,
      filePath: '',
      fileList: [],
      Shelfs1: [],
      Shelfs2: [],
      dialogVisible: true,
      createDialog: false, // 新建
      reviseDialog: false, // 修改
      reviseForm: {
      },
      rules: {
        ReasonTypeDk: [
          {
            type: 'number',
            required: true,
            message: '请选择修改原因',
            trigger: 'change'
          }
        ],
        ActualDate: [
          {
            required: true,
            message: '请选择业务日期',
            trigger: 'change'
          }
        ]
      },
      reasonDialog: false,
      dialogTitle: '旧货调拨出库原因',
      checkDialog: false,
      checkParams: {
        type: false,
        id: ''
      },
      parameters: {
      }
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.pageSize = this.$route.query.size || 20
      this.pageIndex = this.$route.query.pg || 1
      this.OutakeId = Number(query.id) || 0
      if (!this.OutakeId) {
        this.dataError()
      } else {
        this.getDetail()
        this.getGoods()
        this.getReasons()
      }
    },
    dataError(msg) {
      // 错误回退
      this.$confirm(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },
    getDetail() {
      // 获取旧货出库单列表
      STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_GET({
        OutakeId: this.OutakeId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.editForm = Object.assign({
          }, res.data.Data)
        }
      })
    },
    getShelfs(){
      let obj = {}
      if(this.editForm.WarehouseId1 != 0){
        obj = this.$store.getters.wareHouses.find(item => {
          return item.Id == this.editForm.WarehouseId1
        })
        this.Shelfs1 = obj.Childrens
        console.log('this.Shelfs1', this.Shelfs1)
      }
      if(this.editForm.WarehouseId2 != 0){
        obj = this.$store.getters.wareHouses.find(item => {
          return item.Id == this.editForm.WarehouseId2
        })
        this.Shelfs2 = obj.Childrens
        console.log('this.Shelfs2', this.Shelfs2)
      }
    },
    searchCode() {
      // 搜索旧货出库货物
      this.searchJunkCode = this.searchJunkCode.trim()
      STOCKING_API_JUNK_ALLOT_ORDER_ITEM_CREATE({
        OutakeId: Number(this.$route.query.id)||0,
        JunkCode: this.searchJunkCode
      }).then(res => {
        this.searchJunkCode = ''
        if (res.data.Code === 'CORRECT') {
          this.$message.success('提交成功！')
          this.getDetail()
          this.getGoods()
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getGoods() {
      // 获取列表
      STOCKING_API_JUNK_ALLOT_ORDER_ITEM_GETS({
        OutakeId: this.OutakeId,
        IsAsced: this.YNStatus.No,
        OrderBy: 0,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.goodsData.forEach(item => {
            item.Price = this.$root.toFloat(item.Price,2)
          })
          this.totalCount = res.data.Data.Count || 0
          this.goodsId =
            this.goodsData && this.goodsData.length && this.goodsData[0].GoodsId
          this.itemId =
            this.goodsData && this.goodsData.length && this.goodsData[0].ItemId
          this.indexPageSize = this.pageSize
          this.indexPageIndex = this.pageIndex
          this.indexTotalCount = this.totalCount
          if (this.goodsData.length === 0) {
            this.$router.replace(
              '/depot/junkAllotOut/edit?id=' + this.$route.query.id
            )
          }
        } else {
          this.$message.error(res.data.Message)
          this.goodsData = []
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    sortChange(sort) {
      // 排序
      switch (sort.prop) {
        case 'CreateTime':
          this.orderBy = 0
          break
        case 'OutCode':
          this.orderBy = 1
          break
        default:
          this.orderBy = 3
          break
      }
      this.isAsc =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.init()
    },
    editJunk(){
      this.editDialog = true
      this.editForm = {...this.detail}
      this.getShelfs()
    },
    saveData(data){
      if((Number(data.Price)&&data.Price.toFixed(2))||data.Price==0){
        data.Price = Number(data.Price.toFixed(2))
        let obj = {...data}
        console.log('data', data)
        STOCKING_API_JUNK_ALLOT_ORDER_ITEM_UPDATE({
          ItemId: data.ItemId,
          OutakeId: data.OutakeId,
          Price: this.$root.toInt(obj.Price)
        }).then(res => {
          if(res.data.Code == 'CORRECT'){
            this.$message.success('提交成功！')
            this.getDetail()
          }
        })
      }else{
        data.Price = ''
        this.$message.error('请输入正确的金额！')
      }
    },
    removeItem($event, data) {
      // 删除
      $event.currentTarget.blur()
      this.$confirm('确实要删除这条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_JUNK_ALLOT_ORDER_ITEM_DELETE({
            ItemId: data.ItemId,
            OutakeId: data.OutakeId	
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.init()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    orderSubmit() {
      // 旧货出库单-提交审核
      STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_WAIT({
        OutakeId: this.OutakeId,
        CheckNote: this.detail.Note
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success(res.data.Message)
          this.$router.push('/depot/junkAllotOut/index')
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    listenCreateDialog(success) {
      if (success) {
        this.getDetail()
        this.getGoods()
      }
      this.createDialog = false
    },
    listenDictSave() {
      this.getReasons()
    },
    editJunkOut() {
      // 修改表格信息
      console.log('this.editForm', this.editForm)
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_JUNK_ALLOT_ORDER_OUTAKE_UPDATE({
            OutakeId: this.editForm.OutakeId,
            ReasonTypeDk: this.editForm.ReasonTypeDk,
            ReasonTypeDv: this.editForm.ReasonTypeDk?this.getReasonsName(this.editForm.ReasonTypeDk):'',
            ActualDate: this.editForm.ActualDate = dayjs(this.editForm.ActualDate).format('YYYY-MM-DD'),
            ShippingType: this.editForm.ShippingType,
            ExpressType: this.editForm.ExpressType,
            ExpressCode: this.editForm.ExpressCode,
            SendUser: this.editForm.SendUser,
            SendPhone: this.editForm.SendPhone,
            ReceiptUser: this.editForm.ReceiptUser,
            ReceiptPhone: this.editForm.ReceiptPhone,
            Note: this.editForm.Note
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.$store.commit('SET_BTN_LOADING', false)
              this.getDetail()
              this.editDialog = false
            } else {
              this.$message.error('修改失败')
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    getReasonsName(id){
      let obj = this.reasonData.find(item => {
        return item.Id == id
      })
      return obj.Value
    },
    checkJunk(obj) {
      this.checkDialog = true
      if (obj.type === this.YNStatus.Yes) {
        obj.type = true
        this.checkParams = obj
      } else {
        obj.type = false
        this.checkParams = obj
      }
    },
    getEnums() {
      this.$store.dispatch('GET_STORES_DROPLIST')
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', {HasShelf: this.YNStatus.Yes, State: this.YNStatus.Yes})
      // 业务日期
      this.$store.dispatch('GET_SETTLE_DATE')
    },
    getReasons(){
      // this.$store.dispatch('GET_REASONS_DROPLIST', {DictType: this.settingDictionaryDictType.JunkAllotOrderOutakeReasonType, State: this.YNStatus.Yes})
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: this.settingDictionaryDictType.JunkAllotOrderOutakeReasonType,
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
    },
    pageChange(val) {
      this.pageIndex = val
      this.getGoods()
    },
    pageSizeChange(val) {
      this.pageIndex = 1
      this.pageSize = val
      this.getGoods()
    }
  },
  beforeMount() {
    this.getEnums()
    this.getReasons()
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init',
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  components: {
    goodsDetails,
    dictManage,
    junkCreate,
    pagination,
    goldCheck
  }
}
</script>

<style lang="scss" scoped>
</style>

