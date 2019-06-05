<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">编辑旧货转成品库（{{detail.KindTypeEv}}）</span>
        <span class="title fr">
          <el-button type="text" @click="editJunkChange">
            <span>修改</span>
          </el-button>
        </span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">单号：</td>
                <td>{{detail.ChangeCode}}</td>
                <td class="tit">创建：</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime|filterDateTime}}</td>
                <td class="tit">审核：</td>
                <td>{{detail.State === junkChangeOrderBasicStates.Audit || detail.State === junkChangeOrderBasicStates.Reject ? detail.CheckUser + ' ' + detail.CheckTime : '-'}}</td>
              </tr>
              <tr>
                <td class="tit">旧货位置：</td>
                <td v-if="characterType != CharacterType.Store" class="note">{{detail.WarehouseName1}} > {{detail.ShelfName1}}</td>
                <td v-else class="note">-</td>
                <td class="tit">成品位置：</td>
                <td v-if="characterType != CharacterType.Store" class="note">{{detail.WarehouseName2}} > {{detail.ShelfName2}}</td>
                <td v-else class="note">-</td>
                <td class="tit">转换原因：</td>
                <td class="note" colspan="5">{{detail.ReasonTypeDv}}</td>
              </tr>
              <tr>
                <td class="tit">备注：</td>
                <td class="note" colspan="5">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="checkPage-hd">
          <el-button type="primary" @click="selectDialog = true" name="btnSelect">+ 添加旧货</el-button>
        </div>
        <div class="goods-wrapper" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
          <div class="goods-left">
            <!-- 货品列表 -->
            <table class="goods-table" cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>旧货编号</th>
                  <th>旧货名称</th>
                  <th>操作</th>
                </tr>
              </thead>
              <!-- v-if="goodsData&&goodsData.length" -->
              <tbody>
                <tr v-for="(item, index) in goodsData" :key="item.ItemId" :class="{active:item.ItemId === ItemId}" @click="rowSelect(item,index)">
                  <td>{{indexTotalCount - indexPageSize * (indexPageIndex - 1) - index}}</td>
                  <td :title="item.StoreBarCode">{{item.JunkCode}}</td>
                  <td :title="item.GoodsName">{{item.JunkName}}</td>
                  <td>
                    <el-button size="small" type="text" @click.prevent="goodsDel($event, item, index)">删除</el-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- 工具栏 -->
            <div class="toolsbar">
              <div class="myPagination-bar">
                <el-select v-model="pageSize" placeholder="20">
                  <el-option v-for="(item, index) in paginationSizes" :key="index" :value="item"></el-option>
                </el-select>
                <div class="pagination-controller">
                  <button class="prev-btn" @click="prevPage" :disabled="pageIndex === 1" :class="{'isDisabled': pageIndex === 1}"><i class="el-icon-arrow-left"></i></button>
                  <span class="current-page">{{pageIndex}}/{{pages}}</span>
                  <button class="next-btn" @click="nextPage" :disabled="pageIndex === pages" :class="{'isDisabled': pageIndex === pages}"><i class="el-icon-arrow-right"></i></button>
                </div>
                <span class="total">共{{totalCount}}条</span>
              </div>
              <div class="count-bar">
                <span class="fl">数量合计：{{detail.Quantity}}</span>
                <!-- <span class="fr">成本合计：<b>￥{{$root.toFloat(parseFloat(detail.RecallPrice) + parseFloat(detail.CraftFee))}}</b></span> -->
                <span class="fr">成本合计：<b>￥{{$root.toFloat(detail.CostPrice)}}</b></span>
              </div>
            </div>
          </div>
          <div class="goods-right">
            <!-- 货品详情 -->
            <div class="panel">
              <div class="panel-hd">
                <span class="title">货品详情</span>
                <span v-if="ItemId" class="title fr">
                  <router-link :to="{path: '/depot/junkChange/add', query:{id:GoodsId,ChangeId:ChangeId,JunkId:JunkId,ItemId:ItemId,KindTypeEk:detail.KindTypeEk,type: true}}" name="btnJunkChangeAdd">
                    <el-button type="text">
                      修改
                    </el-button>
                  </router-link>
                </span>
              </div>
              <div class="panel-bd">
                <goods-details v-if="goodsData&&goodsData.length&&detail.KindTypeEk" :JunkId="JunkId" :GoodsId="GoodsId" :KindTypeEk="detail.KindTypeEk" :ItemId="ItemId">
                  <slot>
                    <!-- <tr>
                      <td class="tit">旧货编号：</td>
                      <td>{{goodsData[GoodIndex].JunkCode}}</td>
                      <td class="tit">旧货名称：</td>
                      <td>{{goodsData[GoodIndex].JunkName}}</td>
                    </tr> -->
                    <tr>
                      <td class="tit">加工费：</td>
                      <td>{{goodsData[GoodIndex].CraftFee}}</td>
                      <td class="tit">加工类型：</td>
                      <td>{{junkChangeOrderItemCraftType.Types[goodsData[GoodIndex].CraftType + '']}}</td>
                      <td></td>
                    </tr>
                  </slot>
                </goods-details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-button type="primary" @click="orderSubmit" :loading="$store.getters.is_loading" name="btnOrderSubmit">提交审核</el-button>
      <el-button @click="$router.push({path: '/depot/junkChange/index'})" name="btnGoBack">返回</el-button>
    </div>

    <!-- 修改旧货转成品库 -->
    <el-dialog title="修改旧货转成品库" :visible.sync="createDialog" @close="resetForm" width="500px">
      <el-form label-position="right" label-width="100px" :model="editForm" :rules="rules" ref="editForm">
        <el-row v-if="characterType != CharacterType.Store">
          <el-col :span="15">
            <el-form-item label="旧货位置：" prop="WarehouseId1">
              <el-select class="m-r-10" v-model="editForm.WarehouseId1" disabled placeholder="请选择" :filterable="true" name="StuffType">
                <el-option v-for="(item,index) in $store.getters.wareHouses" :key="index" :label="item.Value" :value="Number(item.Id)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item class="shelf-box" prop="ShelfId1">
              <el-select v-model="editForm.ShelfId1" disabled placeholder="请选择" label-width="0" :filterable="true" name="StuffType">
                <el-option v-for="(item,index) in Shelfs1" :key="index" :label="item.Value" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="characterType != CharacterType.Store">
          <el-col :span="15">
            <el-form-item label="成品位置：" prop="WarehouseId2">
              <el-select class="m-r-10" v-model="editForm.WarehouseId2" disabled placeholder="请选择" :filterable="true" name="StuffType">
                <el-option v-for="(item,index) in $store.getters.wareHouses" :key="index" :label="item.Value" :value="Number(item.Id)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item class="shelf-box" prop="ShelfId2">
              <el-select v-model="editForm.ShelfId2" disabled placeholder="请选择" label-width="0" :filterable="true" name="StuffType">
                <el-option v-for="(item,index) in Shelfs2" :key="index" :label="item.Value" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="转换原因：" prop="ReasonTypeDk">
          <el-select v-model="editForm.ReasonTypeDk" @change="selectReasons" placeholder="请选择" name="ReasonTypeDk">
            <el-option v-for="(item, index) in reasonData" :key="index" :label="item.Value" :value="item.Id"></el-option>
          </el-select>
          <span class="icon-set-item" @click="reasonDialog=true">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" class="font12" v-model="editForm.Note" :maxlength="200" name="note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editJunkList" :loading="$store.getters.is_loading" name="btnCreateJunkList">保 存</el-button>
        <el-button @click="createDialog = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- end 修改旧货转成品库 -->

    <!-- 选择旧货 -->
    <junkCreate v-if="selectDialog" :KindTypeEk="detail.KindTypeEk" :selectDialog="selectDialog" :data="address" v-on:listenSelectDialog="selectDialog = !selectDialog"></junkCreate>
    <!-- end 选择旧货 -->

    <!-- @module Dialog·修改转货原因 -->
    <dict-manage v-if="reasonDialog" :visible.sync="reasonDialog" :dicts="reasonData" :dialogTitle="dialogTitle" :dictType="settingDictionaryDictType.JunkChangeOrderBasicReasonType" @listenDictSave="listenDictSave"></dict-manage>
    <!-- End Dialog·修改转货原因  -->

  </div>
</template>

<script>
import {
  YNStatus,
  CharacterType
} from '@/enums/common.js'
import {
  JunkChangeOrderBasicState,
  SettingDictionaryDictType,
  JunkChangeOrderItemCraftType
} from '@/enums/stocking.js'
import {
  STOCKING_API_JUNK_CHANGE_ORDER_BASIC_UPDATE,
  STOCKING_API_JUNK_CHANGE_ORDER_BASIC_GET,
  STOCKING_API_JUNK_CHANGE_ORDER_ITEM_GETS,
  STOCKING_API_JUNK_CHANGE_ORDER_ITEM_DELETE,
  STOCKING_API_JUNK_CHANGE_ORDER_BASIC_WAIT,
  // STOCKING_API_SETTING_CUSTOMIZED_FIELD_REQS
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST 
} from '@/apis/merchant.js'

import goodsDetails from '@/components/erp/goodsDetails'
import dictManage from '@/components/erp/dictManage'
import junkCreate from './create'

export default {
  data() {
    return {
      YNStatus,
      CharacterType,
      junkChangeOrderBasicStates: JunkChangeOrderBasicState,
      junkChangeOrderItemCraftType: JunkChangeOrderItemCraftType,
      settingDictionaryDictType: SettingDictionaryDictType,
      detail: {
      }, // 基本信息
      goodsData: [], // 货品数据
      reasonData: [], // 原因下拉
      paginationSizes: [10, 15, 20], // 分页数据条数数组
      pageSize: 20, // 分页数据条数
      pageIndex: 1, // 当前页面位置
      totalCount: 0, // 总数据条数
      indexPageSize: 20, // 列表序号，分页数据条数
      indexPageIndex: 1, // 列表序号，当前页面位置
      indexTotalCount: 0, // 列表序号，总数据条数
      ChangeId: '',
      importPurchaseDialog: false, // 导入货品对话框
      reasonDialog: false,
      createDialog: false,
      Shelfs1: [],
      Shelfs2: [],
      editRules: {
      },
      address: {
        WarehouseId: 0,
        ShelfId: 0
      },
      GoodsId: '', // 选中的货品id
      GoodIndex: 0,
      editForm: {
        ChangeId: 0,
        ReasonTypeDk: 0,
        ReasonTypeDv: '',
        Note: ''
      },
      dialogTitle: '旧货转成品原因',
      rules: {
        ReasonTypeDk: [
          {
            type: 'number',
            required: true,
            message: '请选择旧货转成品原因',
            trigger: 'change'
          }
        ]
      },
      ItemId: '',
      JunkCode: '',
      JunkId: '',
      JunkName: '',
      CraftFee: '',
      CraftType: '',
      filePath: '',
      fileList: [],
      selectDialog: false
    }
  },
  computed: {
    pages() {
      return (
        (this.totalCount % this.pageSize === 0
          ? Math.ceil(this.totalCount / this.pageSize)
          : parseInt(this.totalCount / this.pageSize) + 1) || 1
      )
    },
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.ChangeId = Number(query.id)||0
      if (!this.ChangeId) {
        this.dataError()
      } else {
        this.getDetail()
        this.getGoods()
      }
    },
    editJunkList() {
      this.$refs['editForm'].validate(valid => {
        console.log('editForm', this.editForm)
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_JUNK_CHANGE_ORDER_BASIC_UPDATE({
            ChangeId: this.editForm.ChangeId,
            ReasonTypeDk: this.editForm.ReasonTypeDk,
            ReasonTypeDv: this.editForm.ReasonTypeDv,
            Note: this.editForm.Note
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: res.data.Message
              })
              this.$store.commit('SET_BTN_LOADING', false)
              this.createDialog = false
              this.init()
            } else {
              this.$message(res.data.Message, 'error')
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        } else {
          this.$message.error('请完善信息！')
        }
      })
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
      STOCKING_API_JUNK_CHANGE_ORDER_BASIC_GET({
        ChangeId: this.ChangeId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.address.WarehouseId = this.detail.WarehouseId1  
          this.address.ShelfId = this.detail.ShelfId1  
          this.editForm = Object.assign({
          }, res.data.Data)
        }
      })
    },
    resetForm() {
      this.editForm = {
        ReasonId: '',
        Reasons: '',
        TargetName: '',
        Note: ''
      }
    },
    editJunkChange(){
      this.createDialog = true
      this.editForm = {...this.detail}
      if(this.$store.getters.wareHouses&&this.detail.WarehouseId1){
        this.Shelfs1 = this.$store.getters.wareHouses.find(item => {
          return item.Id == this.detail.WarehouseId1
        }).Childrens
      }
      if(this.$store.getters.wareHouses&&this.detail.WarehouseId2){
        this.Shelfs2 = this.$store.getters.wareHouses.find(item => {
          return item.Id == this.detail.WarehouseId2
        }).Childrens
      }
    },
    getGoods() {  // 旧货列表
      STOCKING_API_JUNK_CHANGE_ORDER_ITEM_GETS({
        ChangeId: this.ChangeId,
        OrderBy: 0,
        IsAsced: this.YNStatus.No,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false) // table loading
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.totalCount = res.data.Data.Count || 0
          this.GoodsId = this.goodsData && this.goodsData.length && this.goodsData[0].GoodsId || ''
          this.ItemId = this.goodsData && this.goodsData.length && this.goodsData[0].ItemId
          this.JunkCode = this.goodsData && this.goodsData.length && this.goodsData[0].JunkCode
          this.JunkName = this.goodsData && this.goodsData.length && this.goodsData[0].JunkName
          this.JunkId = this.goodsData && this.goodsData.length && this.goodsData[0].JunkId
          this.CraftFee = this.goodsData && this.goodsData.length && this.goodsData[0].CraftFee
          this.CraftType = this.goodsData && this.goodsData.length && this.goodsData[0].CraftType
          this.indexPageSize = this.pageSize
          this.indexPageIndex = this.pageIndex
          this.indexTotalCount = this.totalCount
        } else {
          this.$message.error(res.data.Message)
          this.goodsData = []
        }
      })
    },
    selectReasons(e) {
      if(this.reasonData&&e){
        this.editForm.ReasonTypeDv = this.reasonData.find(item => {
          return item.Id == e
        }).Value
      }
    },
    prevPage() {
      this.GoodIndex = 0
      this.pageIndex -= 1
    },
    nextPage() {
      this.GoodIndex = 0
      this.pageIndex += 1
    },
    orderSubmit() {
      if (this.goodsData&&this.goodsData.length) {
        this.$store.commit('SET_BTN_LOADING', true)
        STOCKING_API_JUNK_CHANGE_ORDER_BASIC_WAIT({
          ChangeId: this.ChangeId,
          CheckNote: this.detail.Note
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              message: res.data.Message,
              type: 'success'
            })
            this.$store.commit('SET_BTN_LOADING', false)
            this.$router.push({
              path: '/depot/junkChange/index' 
            })
          } else {
            this.$message({
              message: res.data.Message,
              type: 'error'
            })
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      } else {
        this.$message.error('请先添加货品！')
      }
    },    
    rowSelect(item, index) {
      this.GoodsId = item.GoodsId
      this.GoodIndex = index
      this.ItemId = item.ItemId
      this.JunkCode = item.JunkCode
      this.JunkName = item.JunkName
      this.JunkId = item.JunkId
      this.CraftFee = item.CraftFee
      this.CraftType = item.CraftType
    },
    goodsDel($event, data, index) {
      // 删除
      $event.currentTarget.blur()
      this.$confirm('确定删除此货品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$set(this.goodsData, index, this.goodsData[index])
        this.$store.commit('SET_FULL_LOADING', true)
        STOCKING_API_JUNK_CHANGE_ORDER_ITEM_DELETE({
          ItemId: data.ItemId,
          ChangeId: this.ChangeId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success(res.data.Message, 'success')
            this.init()
            this.rowSelect(this.goodsData[0], 0)
          } else {
            this.$message.error(res.data.Message)
          }
          this.$store.commit('SET_FULL_LOADING', false)
        })
      }).catch(() => {

      })
    },
    getReturnReasonValue(id) {
      let result = ''
      this.reasonData.forEach(item => {
        if (item.DictId === id) {
          result = item.DictValue
          return false
        }
      })
      return result
    },
    getReasons() {
      // this.$store.dispatch('GET_REASONS_DROPLIST', {DictType: this.settingDictionaryDictType.JunkChangeOrderBasicReasonType, State: this.YNStatus.Yes})
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: this.settingDictionaryDictType.JunkChangeOrderBasicReasonType,
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
    listenDictSave() {
      this.getReasons()
    },
    getEnums() {
      this.$store.dispatch('GET_MATERIAL_TYPE', this.YNStatus.Yes)
      this.$store.dispatch('GET_CATEGORY_TYPE', this.YNStatus.Yes)
      this.$store.dispatch('GET_GOLD_TYPE', this.YNStatus.Yes)
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', {HasShelf: this.YNStatus.Yes, State: this.YNStatus.Yes})
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
    createDialog(value) {
      if (value) {
        this.getReasons()
      }
    },
    pageIndex: 'getGoods',
    pageSize() {
      this.pageIndex = 1
      this.getGoods()
    }
  },
  components: {
    goodsDetails,
    junkCreate,
    dictManage
  }
}
</script>

<style lang="scss">
@import '@/assets/sass/erp/purchase.scss';
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
<style lang="scss" scoped>
.detail-box{

}
</style>

