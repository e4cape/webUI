<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title fl">编辑旧货委外拆卸单</span>
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
          <div class="table-title">
            <!-- <i class="icon-list"></i> -->
            <span class="title">货品列表</span>
          </div>
          <el-row class="m-b-10">
            <el-col :span="8">
              <el-col :span="12">
                <el-input placeholder="录入/扫描条码" prefix-icon="el-icon-search" v-model="searchJunkCode" @keyup.enter.native="searchCode" :maxlength="50" name="searchJunkCode"></el-input>
              </el-col>
              <el-col class="m-l-10" :span="10">
                <el-button type="primary" @click="createDialog = true" name="btnCreate">选择旧货</el-button>
              </el-col>
            </el-col>
            <el-col :span="16" class="tr">
              <span class="detail-info-num-item">
                总件数：<b class="num">{{detail.Quantity}}</b>
              </span>
              <span class="detail-info-num-item">
                总金重：<b class="num">{{ $root.toFloat(detail.GoldWeight, 3) }}g</b>
              </span>
              <span class="detail-info-num-item">
                总金额：<b class="num">￥{{ $root.toFloat(detail.Preprice) }}元</b>
              </span>
            </el-col>
          </el-row>
          <el-table :data="tableData" ref="halfTable" element-loading-text="拼命加载中">
            <el-table-column prop="JunkCode" label="旧货编号" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="text-btn" @click="checkGold({'type':scope.row.IsGold === YNStatus.Yes ? true : false , id: scope.row.JunkId})">{{scope.row.JunkCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="JunkName" label="旧货名称" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="IsGold" label="类型" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.IsGold == YNStatus.Yes?'素金':'非素'}}
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
            <el-table-column prop="GoldWeight" label="金重(g)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3)}}g
              </template>
            </el-table-column>
            <el-table-column prop="RecallGoldPrice" label="回收金价(元/g)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallGoldPrice)}}
              </template></el-table-column>
            <el-table-column prop="RecallPrice" label="回收金额(元)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="CreateTime" label="回收时间" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.CreateTime|filterDateTime}}
              </template>
            </el-table-column>
            <el-table-column prop="State" label="操作" min-width="80">
              <template slot-scope="scope">
                <el-button type="text" @click="removeItem($event, scope.row.ItemId, scope.$index)" name="btnRemoveItem">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination :pg="PageIndex" :size="PageSize" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-button type="primary" @click="orderSubmit">提交审核</el-button>
      <el-button @click="$router.back(-1)">返回</el-button>
    </div>

    <!-- @module Dialog·编辑委派单 -->
    <el-dialog title="编辑" :visible.sync="editDialog">
      <el-form :model="editForm" :rules="rules" label-position="right" label-width="100px">
        <el-row>
          <el-col :span="9">
            <el-form-item label="仓库：" prop="WarehouseId" required>
              <el-select class="m-r-10" v-model="editForm.WarehouseId" disabled placeholder="请选择" :filterable="true" name="StuffType">
                <el-option v-for="(item,index) in $store.getters.wareHouses.filter(item => {return item.State == YNStatus.Yes})" :key="index" :label="item.Value" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="Shelfs.length>0" key="002" :span="15">
            <el-form-item class="shelf-box" prop="ShelfId">
              <el-select v-model="editForm.ShelfId" placeholder="请选择" disabled label-width="0" :filterable="true" name="StuffType">
                <el-option v-for="(item,index) in Shelfs" :key="index" :label="item.Value" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="供应商：" prop="PartnerId" required>
          <el-select v-model="editForm.PartnerId" placeholder="请选择" :filterable="true">
            <el-option v-for="(item, index) in $store.getters.suppliers.filter(item => {return((item.PartnerType == PartnerType.Merchant||item.PartnerType == PartnerType.Supplier)&&item.State==YNStatus.Yes)})" :key="index" :label="item.Value" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="旧货拆卸原因：" prop="ReasonTypeDk">
          <el-select v-model="editForm.ReasonTypeDk" placeholder="请选择" :filterable="true">
            <el-option label="请选择" :value="0"></el-option>
            <el-option v-for="(item, index) in reasonData" :key="index" :label="item.Value" :value="item.Id"></el-option>
          </el-select>
          <span class="icon-set-item" @click="dictDialog=true">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" row="2" v-model="editForm.Note" :maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editPurchase" :loading="$store.getters.is_loading">确 定</el-button>
        <el-button @click="editDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·编辑委派单 -->

    <!-- @module Dialog·新建退货原因 -->
    <dict-manage v-if="dictDialog" :visible.sync="dictDialog" :dicts="reasonData" :dialogTitle="dialogTitle" :dictType="settingDictionaryDictType.WeiwJunkSplitBasicReasonType" @listenDictSave="listenDictSave"></dict-manage>
    <!-- End Dialog·新建退货原因  -->

    <!-- 选择旧货 -->
    <junkCreate v-if="createDialog"  :data="detail" :createDialog="createDialog" :SplitId="SplitId" @listenCreateDialog="listenCreateDialog"></junkCreate>
    <!-- end 选择旧货 -->

    <!-- 查看素金 & 非素 -->
    <goldCheck v-if="checkDialog" :checkDialog="checkDialog" v-on:closeDialog=" checkDialog = !checkDialog " :checkInfo="checkParams"></goldCheck>
    <!-- end 查看素金 & 非素 -->
  </div>
</template>

<script>
import { YNStatus,PartnerType } from '@/enums/common.js'
import {
  WeiwGjunkSplitBasicState,
  SettingDictionaryDictType
} from '@/enums/stocking.js'
import {
  STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_GETSBYJUNK,
  STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_UPDATE2,
  STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_CREATE,
  STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_GET2,
  STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_WAIT2,
  STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_DELETE
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST 
} from '@/apis/merchant.js'

import junkCreate from './create'
import dictManage from '@/components/erp/dictManage'
import pagination from '@/components/pagination'
import goldCheck from '@/components/erp/goldCheck'
export default {
  data() {
    return {
      PartnerType,
      YNStatus,
      goodsData: [], // 货品数据
      tableData: [],
      settingDictionaryDictType: SettingDictionaryDictType,
      weiwGjunkSplitBasicState: WeiwGjunkSplitBasicState,
      page: {
        PageIndex: 1,
        PageSize: 20
      },
      PageSize: 20, // 分页数据条数
      PageIndex: 1, // 当前页面位置
      total: 0, // 总数据条数
      SplitId: '',
      searchJunkCode: '',
      detail: {},
      goodsId: '', // 选中的货品id
      createDialog: false,
      reasonData: [], // 原因下拉
      Shelfs: [], // 当前仓库下面的货架
      rules: {
        WarehouseId: [{ required: true }],
        PartnerId: [{ required: true }]
      },
      editForm: {},
      checkParams: {
        type: false,
        id: ''
      },
      checkDialog: false,
      editDialog: false,
      dictDialog: false,
      dialogTitle: '旧货委外拆卸原因'
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.SplitId = Number(query.id) || 0
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
      STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_GET2({ SplitId: this.SplitId }).then(
        res => {
          if (res.data.Code == 'CORRECT') {
            this.detail = res.data.Data
            this.editForm = Object.assign({}, this.detail)
          }
        }
      )
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_GETSBYJUNK({
        SplitId: this.SplitId,
        OrderBy: 0,
        IsAsced: this.YNStatus.No,
        PageIndex: this.PageIndex,
        PageSize: this.PageSize
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
      })
    },
    checkGold(obj){
      // 查看素金
      this.checkParams = obj
      this.checkDialog = true
    },
    pageChange(val) {
      this.PageIndex = val
      this.getGoods()
    },
    pageSizeChange(val) {
      this.PageIndex = 1
      this.PageSize = val
      this.getGoods()
    },
    orderSubmit() {
      STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_WAIT2({
        SplitId: this.SplitId,
        CheckNote: this.detail.Note
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success(res.data.Message)
          this.$router.push('/depot/oldOutSDismount/index')
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    removeItem($event, id, index) {
      $event.currentTarget.blur()
      this.$confirm('确实要删除这条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_DELETE({
            ItemId: id,
            SplitId: this.SplitId
          }).then(res => {
            if (res.data.Code == 'CORRECT') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.tableData.splice(index, 1)
              this.getDetail()
              this.total = Math.max(0,this.total-1)
              if(this.PageIndex != 1){
                this.PageIndex = 1
                this.PageSize = 20
                this.getGoods()
              }
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
    editPurchase() {
      STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_UPDATE2 ({
        SplitId: this.SplitId,
        PartnerId: this.editForm.PartnerId,
        ReasonTypeDk: this.editForm.ReasonTypeDk,
        ReasonTypeDv: this.editForm.ReasonTypeDk
          ? this.getReasonName(this.editForm.ReasonTypeDk)
          : '',
        Note: this.editForm.Note
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.$message.success('提交成功！')
          this.editDialog = false
          this.getReasons()
          this.getDetail()
        }
      })
    },
    getReasonName(id) {
      let result = this.reasonData.find(item => {
        return item.Id == id
      })
      return result.Value
    },
    getShelfs() {
      let obj = {}
      obj = this.$store.getters.wareHouses.find(item => {
        return item.Id == this.editForm.WarehouseId
      })
      this.Shelfs = obj.Childrens
    },
    searchCode() {
      // 搜索旧货出库货物
      this.searchJunkCode = this.searchJunkCode.trim()
      STOCKING_API_WEIW_GJUNK_SPLIT_ITEM_CREATE({
        SplitId: this.SplitId,
        JunkCode: this.searchJunkCode
      }).then(res => {
        this.searchJunkCode = ''
        if (res.data.Code === 'CORRECT') {
          this.$message.success('添加成功！')
          this.init()
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    listenDictSave() {
      this.getReasons()
    },
    listenCreateDialog() {
      this.createDialog = false
      this.getGoods()
      this.getDetail()
    },
    getEnums() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
      this.$store.dispatch('GET_SUPPLIERS_DROPLIST')
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', {HasShelf: this.YNStatus.Yes, State: this.YNStatus.Yes})
    },
    getReasons() {
      // this.$store.dispatch('GET_REASONS_DROPLIST', {
      //   DictType: this.settingDictionaryDictType.WeiwJunkSplitBasicReasonType,
      //   IsEnable: 0
      // })
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: this.settingDictionaryDictType.WeiwJunkSplitBasicReasonType,
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
  beforeMount() {
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
    junkCreate,
    dictManage,
    pagination,
    goldCheck
  }
}
</script>
<style lang="scss">
@import '@/assets/sass/erp/purchase.scss';
.fixed-tr .el-form-item {
  margin-bottom: 0px;
}
.fixed-tr .el-form-item--mini {
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
.m-b-1 {
  margin-bottom: 1px;
}
.table-title {
  margin-bottom: 10px;
  .title {
    margin-left: 5px;
  }
}
.more-c {
  color: #5388ac;
  cursor: pointer;
}
</style>
