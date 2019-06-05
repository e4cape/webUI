<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">编辑旧货出库单</span>
        <span class="fr title">
          <el-button type="text" @click="editDialog = true,getShelfs()">
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
                <td>{{detail.State === junkOutakeOrderBasicState.Audit || detail.State === junkOutakeOrderBasicState.Reject ? detail.CheckUser + ' ' + detail.CheckTime : '-'}}</td>
              </tr>
              <tr>
                <td v-if="characterType != CharacterType.Store" class="tit">出库仓库：</td>
                <td v-if="characterType != CharacterType.Store" class="note">{{detail.WarehouseName}} > {{detail.ShelfName}}</td>
                <td class="tit">出库原因：</td>
                <td class="note">{{detail.ReasonTypeDv}}</td>
                <td class="tit">出库对象：</td>
                <td class="note">{{detail.TargetName}}</td>
                <td v-if="characterType == CharacterType.Store" class="tit">业务日期：</td>
                <td v-if="characterType == CharacterType.Store" class="note">{{detail.ActualDate|filterDate}}</td>
              </tr>
              <tr>
                <td v-if="characterType != CharacterType.Store" class="tit">业务日期：</td>
                <td v-if="characterType != CharacterType.Store" class="note">{{detail.ActualDate|filterDate}}</td>
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
                总金重：<b class="num">{{ $root.toFloat(detail.GoldWeight, 3) }}(g)</b>
              </span>
              <span class="detail-info-num-item">
                总金额：<b class="num">￥{{ $root.toFloat(detail.Preprice) }}(元)</b>
              </span>
              <span class="detail-info-num-item">
                总工费：<b class="num">￥{{ $root.toFloat(detail.RecallFee) }}(元)</b>
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
            <el-table-column prop="RecallGoldPrice" label="回收金价(元/g)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallGoldPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="RecallFee" label="回收工费(元)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallFee)}}
              </template>
            </el-table-column>
            <el-table-column prop="RecallPrice" label="回收金额(元)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="CreateTime" label="回收时间" min-width="120" sortable="custom" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.CreateTime|filterDateTime}}
              </template>
            </el-table-column>
            <el-table-column prop="State" label="操作" min-width="80">
              <template slot-scope="scope">
                <el-button type="text" @click="removeItem($event, scope.row.ItemId)" name="btnRemoveItem">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- end  表格 -->
          <!-- 分页 -->
          <pagination :pg="pageIndex" :size="pageSize" :total="totalCount" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
          <!-- 分页 end -->
        </div>
      </div>
    </div>

    <div class="buttons">
      <el-button type="primary" @click="orderSubmit" :loading="$store.getters.is_loading" name="btnOrderSubmit">提交审核</el-button>
      <el-button @click="$router.back(-1)">返回</el-button>
    </div>

    <!-- 选择旧货 -->
    <junkOtherOutCreate v-if="createDialog" :detail="detail" :createDialog="createDialog" :OutakeId="OutakeId" @listenCreateDialog="listenCreateDialog"></junkOtherOutCreate>
    <!-- end 选择旧货 -->

    <!-- @module Dialog·新建退货原因 -->
    <dict-manage v-if="reasonDialog" :visible.sync="reasonDialog" :dicts="reasonData" :dialogTitle="dialogTitle" :dictType="settingDictionaryDictType.JunkOutakeOrderBasicReasonType" @listenDictSave="listenDictSave"></dict-manage>    
    <!-- End Dialog·新建退货原因  -->

    <!-- @module 修改旧货出库单 -->
    <el-dialog title="编辑旧货出库单" :visible.sync="editDialog">
      <el-form label-position="right" label-width="100px" :model="editForm" :rules="rules" ref="editForm">
        <el-row v-if="characterType != CharacterType.Store">
          <el-col :span="9">
            <el-form-item label="出库仓库：" prop="WarehouseId">
              <el-select class="m-r-10" v-model="editForm.WarehouseId" disabled placeholder="请选择" :filterable="true" name="WarehouseId">
                <el-option v-for="(item,index) in $store.getters.wareHouses" :key="index" :label="item.Value" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item class="shelf-box" prop="ShelfId">
              <el-select v-model="editForm.ShelfId" placeholder="请选择" disabled label-width="0" :filterable="true" name="ShelfId">
                <el-option v-for="(item,index) in Shelfs" :key="index" :label="item.Value" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="出库原因：" prop="ReasonTypeDk">
          <el-select v-model="editForm.ReasonTypeDk" placeholder="请选择" name="ReasonTypeDk">
            <template v-for="(item, index) in reasonData">
              <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </template>
          </el-select>
          <span class="icon-set-item" @click="reasonDialog=true">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item label="出库对象：">
          <el-input v-model="editForm.TargetName" :maxlength="50" name="targetName"></el-input>
        </el-form-item>
        <el-form-item label="业务日期：" prop="ActualDate">
          <el-date-picker v-model="editForm.ActualDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="$store.getters.businessDate"></el-date-picker>
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
import {
  JunkOutakeOrderBasicState,
  SettingDictionaryDictType
} from '@/enums/stocking.js'
import {
  YNStatus,
  CharacterType
} from '@/enums/common.js'
import {
  STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_GET,
  STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_WAIT,
  STOCKING_API_JUNK_OUTAKE_ORDER_ITEM_CREATE,
  STOCKING_API_JUNK_OUTAKE_ORDER_ITEM_GETS,
  STOCKING_API_JUNK_OUTAKE_ORDER_ITEM_DELETE,
  STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_UPDATE,
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST 
} from '@/apis/merchant.js'

import goodsDetails from '@/components/erp/goodsDetails'
import pagination from '@/components/pagination'
import dictManage from '@/components/erp/dictManage'
import junkOtherOutCreate from './create'
import goldCheck from '@/components/erp/goldCheck.vue'

export default {
  data() {
    return {
      YNStatus,
      CharacterType,
      settingDictionaryDictType: SettingDictionaryDictType,
      junkOutakeOrderBasicState: JunkOutakeOrderBasicState,
      data: [],
      detail: {
        GoldWeight: 0,
        Price: 0,
        RecallFee: 0
      }, // 基本信息
      editForm: {
      }, // 修改表单
      reasonData: [], // 原因下拉
      goodsData: [], // 货品数据
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
        ],
      },
      reasonDialog: false,
      dialogTitle: '旧货其他出库原因',
      returnReasons: {
      },
      Shelfs: [],
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
      this.OutakeId = Number(query.id)||0
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
      STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_GET({
        OutakeId: this.OutakeId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.editForm = Object.assign({
          }, res.data.Data)
        }
      })
    },
    searchCode() {
      // 搜索旧货出库货物
      this.searchJunkCode = this.searchJunkCode.trim()
      STOCKING_API_JUNK_OUTAKE_ORDER_ITEM_CREATE({
        OutakeId: Number(this.$route.query.id)||0,
        JunkCode: this.searchJunkCode
      }).then(res => {
        this.searchJunkCode = ''
        if (res.data.Code === 'CORRECT') {
          this.$message.success('提交成功！')
          this.getGoods()
        } else {
          this.$message.error(res.data.Message)
        }
        this.searchJunkCode = ''
      })
    },
    getGoods() {
      // 获取列表
      STOCKING_API_JUNK_OUTAKE_ORDER_ITEM_GETS({
        OutakeId: this.OutakeId,
        IsAsced	: this.isAsc,
        OrderBy: 0,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.totalCount = res.data.Data.Count || 0
          this.goodsId =
            this.goodsData && this.goodsData.length && this.goodsData[0].GoodsId
          this.itemId =
            this.goodsData && this.goodsData.length && this.goodsData[0].ItemId
          this.indexPageSize = this.pageSize
          this.indexPageIndex = this.pageIndex
          this.indexTotalCount = this.totalCount
          // if (this.goodsData.length === 0) {
          //   this.$router.replace(
          //     '/depot/junkOtherOut/edit?id=' + this.$route.query.id
          //   )
          // }
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
    getShelfs(){
      if(this.editForm.WarehouseId){
        let obj = this.$store.getters.wareHouses.find(item => {
          return item.Id == this.editForm.WarehouseId
        })
        this.Shelfs = obj.Childrens.filter(item => item.State === YNStatus.Yes)
        console.log('this.Shelfs', this.Shelfs)
        this.editForm.ShelfId = this.Shelfs.length == 1?this.Shelfs[0].Id:''
      }
    },
    removeItem($event, id) {
      // 删除
      $event.currentTarget.blur()
      this.$confirm('确实要删除这条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_JUNK_OUTAKE_ORDER_ITEM_DELETE({
            ItemId: id,
            OutakeId: this.OutakeId
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
      STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_WAIT({
        OutakeId: this.OutakeId,
        CheckNote: this.detail.Note
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success(res.data.Message)
          this.$router.push('/depot/junkOtherOut/index')
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    listenCreateDialog(success) {
      console.log(222, success)
      if (success) {
        this.getDetail()
        this.getGoods()
      }
      this.createDialog = false
    },
    getReturnReasonValue(id) {
      let result = ''
      this.returnReasons.forEach(item => {
        if (item.DictId === id) {
          result = item.DictValue
          return false
        }
      })
      return result
    },
    listenDictSave() {
      this.getReasons()
    },
    editJunkOut() {
      // 修改表格信息
      this.$refs['editForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_JUNK_OUTAKE_ORDER_BASIC_UPDATE({
            OutakeId: this.OutakeId,
            TargetName: this.editForm.TargetName,
            ReasonTypeDk: this.editForm.ReasonTypeDk,
            ReasonTypeDv: this.getReasonsName(this.editForm.ReasonTypeDk),
            ActualDate: this.editForm.ActualDate,
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
      if(this.reasonData&&id){
        return this.reasonData.find(item => {
          return item.Id == id
        }).Value
      }
      // return obj.Value
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
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', {HasShelf: this.YNStatus.Yes, State: this.YNStatus.Yes})
    },
    getReasons() {
      // 获取原因
      // this.$store.dispatch('GET_REASONS_DROPLIST', {DictType: this.settingDictionaryDictType.JunkOutakeOrderBasicReasonType, State: this.YNStatus.Yes})
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: this.settingDictionaryDictType.JunkOutakeOrderBasicReasonType,
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
    $route: 'init'
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  components: {
    goodsDetails,
    dictManage,
    junkOtherOutCreate,
    pagination,
    goldCheck
  }
}
</script>

<style lang="scss" scoped>
</style>
