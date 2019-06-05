<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title fl">编辑成品拆卸单</span>
        <span @click="editDialog=true,getShelfs()" class="title text-btn fr">修改</span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.SplitCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime|filterDateTime}}</td>
                <td class="tit">审核</td>
                <!-- <td>{{detail.State === weiwGjunkSplitBasicState.Audit || detail.State === weiwGjunkSplitBasicState.Reject ? detail.CheckUser + ' ' + detail.CheckTime : '-'}}</td> -->
                <td v-if="detail.State === weiwGjunkSplitBasicState.Audit || detail.State === weiwGjunkSplitBasicState.Reject">
                  {{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime|filterDateTime}}
                </td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">仓库</td>
                <td>{{detail.WarehouseName}}{{detail.ShelfName?'>'+detail.ShelfName:''}}</td>
                <td class="tit">供应商</td>
                <td>{{detail.PartnerName}}</td>
                <td class="tit">拆卸原因</td>
                <td>{{detail.ReasonTypeDv}}</td>
              </tr>
              <tr>
                <td class="tit">备注</td>
                <td class="note" colspan="5">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="m-10">
          <!-- <div class="table-title">
            <span class="title">货品列表</span>
          </div> -->
          <el-row class="m-b-10">
            <el-col :span="12">
              <el-col :span="8">
                <el-input class="code-input" placeholder="录入/扫描条码" v-model="barCode" @keyup.enter.native="codeEnter" :maxlength="50" name="code"></el-input>
              </el-col>
              <el-col class="m-l-10" :span="8">
                <el-button type="primary" @click="multiCodeVisible=true" name="btnMultiCode">批量录入</el-button>
                <el-button @click="dialogSelectGoodsVisible = true" name="btnCreate">选择货品</el-button>
              </el-col>
            </el-col>
            <el-col :span="12" class="tr">
              <span class="detail-info-num-item">
                条码数量：<b class="num">{{total}}</b>
              </span>
              <span class="detail-info-num-item">
                货品总数：<b class="num">{{detail.Quantity}}</b>
              </span>
            </el-col>
          </el-row>
          <el-table 
            :data="data" 
            ref="halfTable" 
            v-loading="$store.getters.tb_loading" 
            element-loading-text="拼命加载中" 
            height="600">
            <el-table-column type="index" label="序号" width="50" show-overflow-tooltip></el-table-column>
            <el-table-column prop="BarCode" key="100" label="条码" min-width="130">
              <template slot-scope="scope">
                <el-button type="text" @click="showDetailDialog(scope.row.GoodsId)">{{scope.row.BarCode}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="GoodsName" label="货品名称" min-width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.GoodsName}}
              </template>
            </el-table-column>
            <el-table-column prop="Weight" label="货重" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.Weight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column prop="GoldWeight" label="金重" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column prop="Stone1Weight" label="主石重" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.Stone1Weight, 3)}}ct
              </template>
            </el-table-column>
            <el-table-column prop="Stone1Qty" label="主石数" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.Stone1Qty}}
              </template>
            </el-table-column>
            <el-table-column prop="Stone1Color" label="主石颜色" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{StoneColor.Types[scope.row.Stone1Color]}}
              </template>
            </el-table-column>
            <el-table-column prop="Stone1Clarity" label="主石净度" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{StoneClarity.Types[scope.row.Stone1Clarity]}}
              </template>
            </el-table-column>
            <el-table-column prop="Stone1Cut" label="主石切工" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{StoneCut.Types[scope.row.Stone1Cut]}}
              </template>
            </el-table-column>
            <el-table-column prop="Quantity" min-width="130">
              <template slot="header">
                <p>
                  <span style="color: red">*</span>
                  <span>数量</span>
                </p>
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.Quantity" :maxlength="8" @keyup.native="scope.row.Quantity=$root.toFixed(scope.row.Quantity,0)" @input="handleFocus(scope.row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="delGood($event, scope.row)" name="btnDelGood">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination :pg="PageIndex" :size="PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-button type="primary" @click="orderSubmit" :loading="$store.getters.is_loading" name="btnSubmitAudit">{{ enableSubmit ? '提交审核': '保存'}}</el-button>
      <el-button @click="$router.back(-1)">返回</el-button>
    </div>

    <!-- @module Dialog·编辑委派单 -->
    <el-dialog title="编辑" :visible.sync="editDialog">
      <el-form :model="editForm" label-position="right" label-width="100px" :rules="rules" ref="createForm">
        <el-row>
          <el-col :span="9">
            <el-form-item label="仓库：" prop="WarehouseId" required>
              <el-select class="m-r-10" v-model="editForm.WarehouseId" disabled @change="chooseHouse" placeholder="请选择" :filterable="true" name="StuffType">
                <el-option v-for="(item,index) in $store.getters.wareHouses.filter(item => {return item.State == YNStatus.Yes})" :key="index" :label="item.Value" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="Shelfs.length>0" key="002" :span="15">
            <el-form-item class="shelf-box" prop="ShelfId">
              <el-select v-model="editForm.ShelfId" disabled placeholder="请选择" label-width="0" :filterable="true" name="StuffType">
                <el-option v-for="(item,index) in Shelfs" :key="index" :label="item.Value" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="供应商：" prop="PartnerId" required>
          <el-select v-model="editForm.PartnerId" placeholder="请选择" :filterable="true">
            <el-option v-for="(item, index) in $store.getters.suppliers.filter(item => {return((item.PartnerType == PartnerType.Merchant||item.PartnerType == PartnerType.Supplier)&&item.State==YNStatus.Yes)})" :key="index" :label="item.Value" :value="item.Id" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成品拆卸原因：" prop="ReasonTypeDk">
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
    <!-- End Dialog·编辑委派单 -->

    <!-- @module Dialog·编辑委派单原因 -->
    <dictManage v-if="dictDialog" :visible.sync="dictDialog" @listenDictSave="listenDictSave" :dialogTitle="dialogTitle" :dictType="settingDictionaryDictType.WeiwGoodsSplitBasicReasonType" :dicts="reasonData"></dictManage>
    <!-- @module Dialog·编辑委派单结束  -->

    <!-- 选择旧货 -->
    <junkCreate v-if="selectDialog" :data="detail" :selectDialog="selectDialog" @listenSelectDialog="listenSelectDialog"></junkCreate>
    <!-- end 选择旧货 -->

    <!-- dialog 批量录入条码 -->
    <multi-code-enter :visible.sync="multiCodeVisible" @listenMultiCodeEnter="listenMultiCodeEnter"></multi-code-enter>
    <!-- End 批量录入条码 -->

    <!-- 选择货品 -->
    <select-goods :visible.sync="dialogSelectGoodsVisible" :warehouseId="detail.WarehouseId1" :shelfId="detail.ShelfId1" :deskId="$store.getters.user_session.DeskId" @listenAddGoods="listenAddGoods"></select-goods>
    <!-- End 选择货品 -->

    <!-- dialog 货品详情 -->
    <good-detail :visible.sync="goodDetailDialog.visible" :goodsId="goodDetailDialog.goodsId" :kindType="detail.KindTypeEk"></good-detail>
    <!-- end 货品详情-->
  </div>
</template>

<script>
import {
  StoneColor,
  StoneClarity,
  StoneCut,
  WeiwGjunkSplitBasicState,
  SettingDictionaryDictType
} from '@/enums/stocking.js'
import {
  YNStatus,
  PartnerType
} from '@/enums/common.js'
import {
  STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_GET,
  STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_UPDATE,
  STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_CREATE,
  STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_UPDATE,
  STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_DELETE,
  STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_WAIT,
  STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_GETSBYGOODS,
  STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_CREATEBATCH
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST 
} from '@/apis/merchant.js'

import junkCreate from './create'
import SelectGoods from '@/components/erp/selectGoods'
import dictManage from '@/components/erp/dictManage'
import pagination from '@/components/pagination'
import MultiCodeEnter from '@/components/erp/multiCodeEnter'
import goodDetail from '@/components/erp/goodDetail'

export default {
  data() {
    return {
      PartnerType,
      YNStatus,
      StoneColor,
      StoneCut,
      StoneClarity,
      form: {
        region: '1'
      },
      PageIndex: 1,
      PageSize: 20,
      total: 0,
      settingDictionaryDictType: SettingDictionaryDictType,
      weiwGjunkSplitBasicState: WeiwGjunkSplitBasicState,
      SplitId: '',
      detail: {},
      enableSubmit: true, // 控制请求一个一个提交
      goodsVisible: false,
      barCode: '', // 手动录入条码
      multiCodeVisible: false, // 批量录入条码弹窗
      dialogSelectGoodsVisible: false, // 选择货品对话框
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      Shelfs: [],
      reasonData: [], // 原因下拉
      editForm: {},
      rules: {
        WarehouseId: [{required: true}],
        PartnerId: [{required: true}]
      },
      dialogTitle: '成品委外拆卸出库原因',
      dictDialog: false,
      editDialog: false,
      auditDialog: false,
      abandonDialog: false,
      cancelDialog: false,
      data: [],
      selectDialog: false,
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
      currentRow: 0,
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.SplitId = Number(query.id)||0
      if (!this.SplitId) {
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
      STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_GET({
        SplitId: this.SplitId
      }).then(res => {
        if(res.data.Code == 'CORRECT'){
          this.detail = res.data.Data
          this.editForm = Object.assign({}, this.detail)
        }
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_GETSBYGOODS({
        SplitId: this.SplitId,
        OrderBy: 0,
        IsAsced: this.YNStatus.No,
        PageIndex: this.PageIndex,
        PageSize: this.PageSize
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if(res.data.Code == 'CORRECT'){
          this.data = res.data.Data.Rows||[]
          this.total = res.data.Data.Count||0
        }
      })
    },
    orderSubmit(){
      if(this.enableSubmit){
        this.$store.commit('SET_BTN_LOADING', true)
        STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_WAIT({
          SplitId: this.SplitId, CheckNote: this.detail.Note
        }).then(res => {
          this.$store.commit('SET_BTN_LOADING', false)
          if(res.data.Code == 'CORRECT'){
            this.$router.push({
              path: '/depot/outSDismount/index'
            })
          }
        }).catch(() => {
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }else {
        this.handleCurrentChange()
      }
    },
    chooseHouse(e){
      if(this.$store.getters.wareHouses&&e){
        this.Shelfs = this.$store.getters.wareHouses.find(item => {
          return item.Id == e
        }).Childrens
      }
      if(this.Shelfs.length == 1){
        this.editForm.ShelfId = this.Shelfs[0].Id
      }
    },
    editPurchase(){
      STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_UPDATE({
        SplitId: this.SplitId,
        PartnerId: this.editForm.PartnerId,
        ReasonTypeDk: this.editForm.ReasonTypeDk,
        ReasonTypeDv: this.editForm.ReasonTypeDk?this.getReasonName(this.editForm.ReasonTypeDk):'',
        Note: this.editForm.Note
      }).then(res => {
        if(res.data.Code == 'CORRECT'){
          this.editDialog = false
          this.getDetail()
          this.getReasons()
        }
      })
    },
    getShelfs(){
      this.Shelfs = this.$store.getters.wareHouses.find(item => {
        return item.Id == this.detail.WarehouseId
      }).Childrens
    },
    getReasonName(id){
      let result = this.reasonData.find(item => {
        return item.Id == id
      })
      return result.Value
    },
    delGood($event, row) {
      $event.currentTarget.blur()
      this.$confirm('确定删除此货品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_DELETE({
          ItemId: row.ItemId,
          SplitId: this.SplitId
        }).then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            if (this.total <= this.PageSize * (this.PageIndex - 1) + 1) {
              this.PageIndex = 1
            }
            this.init()
          }
        })
      })
    },
    handleFocus(row) {
      row.isEdit = true
      row.isError = false
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
        if (this.data[i].isEdit || this.data[i].isError) {
          if (!this.data[i].SplitId) {
            this.data[i].isEdit = false
            this.data[i].isError = true
            errorlist.push(`序号${i + 1}：条码不能为空<br>`)
            continue
          }
          if (!this.data[i].Quantity||this.data[i].Quantity==0) {
            this.data[i].isEdit = false
            this.data[i].isError = true
            errorlist.push(`序号${i + 1}：数量不能为零或空<br>`)
            continue
          }
        }
        if (this.data[i].isEdit || this.data[i].isError) {
          let res
          this.data[i].Quantity = Number(this.data[i].Quantity)||0
          if (this.data[i].ItemId) {
            res = await STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_UPDATE(this.data[i])
          } else {
            res = await STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_CREATE(this.data[i])
          }

          this.$store.commit('SET_TB_LOADING', false)
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
      } else {
        if (haveEdit || !haveError) {
          this.$message.success('保存成功')
          this.getDetail()
          this.enableSubmit = true
        }

      }
      this.$store.commit('SET_BTN_LOADING', false)
      this.getDetail()
    },
    codeEnter() {
      // 手动录入
      if (!this.barCode) {
        this.$message.warning('请输入货品条码')
        return
      }
      this.barCode = this.barCode.trim()
      this.addGoods([
        {
          BarCode: this.barCode,
          Quantity: 1
        }
      ])
    },
    showDetailDialog(goodsId) {
      this.goodDetailDialog = {
        goodsId: goodsId,
        visible: true
      }
    },
    addGoods(items) {
      console.log('items', items)
      // 录入货品
      STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_CREATEBATCH({
        SplitId: this.SplitId,
        Items: items
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        this.barCode = ''
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '提交成功！',
            type: 'success'
          })
          this.multiCodeVisible = false
          if (items.some(item => this.data.every(val => val.BarCode !== item.BarCode))) {
            this.PageIndex = 1
          }
          this.init()
        } else {
          this.$alert(res.data.Message, '错误', {
            dangerouslyUseHTMLString: true
          })
        }
      })
    },
    listenSelectDialog(){
      this.selectDialog = false
      this.getGoods()
      this.getDetail()
    },
    listenDictSave(){
      this.getReasons()
    },
    listenMultiCodeEnter(codes){
      // 批量录入
      if (codes.length) {
        this.addGoods(codes)
      } else {
        this.multiCodeVisible = false
      }
    },
    listenAddGoods(data) {
      // 选择录入
      const codes = []
      data.forEach(item => {
        codes.push({
          BarCode: item.BarCode,
          Quantity: item.Quantity
        })
      })
      this.addGoods(codes)
    },
    currentChange(val){
      this.PageIndex = val
      this.getGoods()
    },
    sizeChange(val){
      this.PageIndex = 1
      this.PageSize = val
      this.getGoods()
    },
    getEnums(){
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', {HasShelf: this.YNStatus.Yes, State: this.YNStatus.Yes})
      this.$store.dispatch('GET_SUPPLIERS_DROPLIST')
      this.$store.dispatch('GET_USERS_DROPLIST')
    },
    getReasons(){
      // this.$store.dispatch('GET_REASONS_DROPLIST', {DictType: this.settingDictionaryDictType.WeiwGoodsSplitBasicReasonType, State: this.YNStatus.Yes})
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: this.settingDictionaryDictType.WeiwGoodsSplitBasicReasonType,
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
    formatter(row, column, val){
      switch(column.property){
        case 'Stone1Color':
          return this.StoneColor.Types[val]
        case 'Stone1Clarity':
          return this.StoneClarity.Types[val]
        default:
          return this.$root.toFloat(val, 3)
      }
    }
  },
  beforeMount(){
    this.getEnums()
    this.getReasons()
  },
  mounted() {
    this.init()
  },
  components: {
    pagination,
    dictManage,
    junkCreate,
    MultiCodeEnter,
    goodDetail,
    SelectGoods
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
.table-title{
  margin-bottom: 10px;
  .title{
    margin-left: 5px;
  }
}
.more-c{
  color: #5388ac;
  cursor: pointer;
}
.input-box-sty{
  border: 1px solid #e5e5e5;
  padding: 0 5px;
  height: 28px;
  line-height: 28px;
  .code{
    width: 80%;
    height: 28px;
    overflow: hidden;
  }
  i{
    height: 28px;
    line-height: 28px;
    font-size: 18px;
  }
}
</style>
