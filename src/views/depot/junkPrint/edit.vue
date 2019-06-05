<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">编辑打印单</span>
        <span class="title fr">
          <el-button name="btneditDialog" type="text" @click="editPrintR">修改</el-button>
        </span>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.PrintCode}}</td>
                <td class="tit">创建</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime|filterDateTime}}</td>
                <td class="tit">打印原因</td>
                <td>{{detail.ReasonTypeDv}}</td>
              </tr>
              <tr>
                <td class="tit">备注</td>
                <td class="note" colspan="5">{{detail.Note}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="checkPage-hd">
          <el-row>
            <el-col :span="16">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-input name="code" v-model="code" placeholder="录入/扫描条码" :maxlength="50" @keyup.enter.native="codeEnter"></el-input>
                </el-col>
                <el-col :span="16" class="tl">
                  <el-button name="btnmultiCodeVisible" type="primary" @click="multiCodeVisible=true">批量录入</el-button>
                  <el-button name="btnjunkCreateDialog" type="primary" @click="createDialog=true">选择旧货</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8" class="tr">
              <span class="detail-info-num-item">
                数量：<b class="num">{{total}}</b>
              </span>
            </el-col>
          </el-row>
        </div>
        <div class="p-x-10">
          <!-- @module 数据表格 -->
          <el-table :data="goodsData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
            <el-table-column prop="JunkCode" label="旧货编码" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                <span name="checkGold" class="init-button-text" @click="checkGold({'type':scope.row.IsGold === YNStatus.Yes ? true : false , id: scope.row.JunkId})">{{scope.row.JunkCode}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="JunkName" label="旧货名称" min-width="80" show-overflow-tooltip></el-table-column>
            <el-table-column prop="IsGold" label="旧货类型" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.IsGold == YNStatus.Yes? '素金':'非素'}}
              </template>
            </el-table-column>
            <el-table-column prop="MaterialType" label="材质" min-width="120">
              <template slot-scope="scope">
                {{$store.getters.materialType.Types[scope.row.MaterialType]}}
              </template>
            </el-table-column>
            <el-table-column prop="Weight" label="货重(g)" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.Weight)}}
              </template>
            </el-table-column>
            <el-table-column prop="GoldWeight" label="净金重(g)" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                {{$root.toFloat(scope.row.GoldWeight, 3)}}
              </template>
            </el-table-column>
            <el-table-column prop="RecallGoldPrice" label="回收价" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallGoldPrice)}}
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="80">
              <template slot-scope="scope">
                <el-button name="btndelGood" type="text" @click="delGood($event, scope.row.ItemId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- End 数据表格 -->
          <!-- Pagination -->
          <pagination :pg="pg" :size="size" :total="total" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
          <!-- Pagination -->
        </div>
      </div>
    </div>
    <div class="buttons">
      <router-link :to="{path:'/depot/junkPrint/printing',query:{id:PrintId}}">
        <el-button name="btnprinting" type="primary">
          打印
        </el-button>
      </router-link>
      <router-link :to="{path:'/depot/junkPrint/index'}">
        <el-button name="btnindex">
         返回
        </el-button>
      </router-link>
    </div>

    <!-- @module Dialog·修改打印单 -->
    <el-dialog title="修改旧货打印单" :visible.sync="editDialog">
      <el-form label-position="right" label-width="100px" :model="createForm" ref="createForm" :rules="rules">
        <el-form-item label="打印原因：" prop="ReasonTypeDk">
          <el-select name="ReasonTypeDk" v-model="createForm.ReasonTypeDk" filterable placeholder="请选择">
            <el-option v-for="(item, index) in reasonData" :key="index" :label="item.Value" :value="item.Id"></el-option>
          </el-select>
          <span name="reasonDialog" class="icon-set-item" @click="reasonDialog=true">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" name="Note" v-model="createForm.Note" :maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="btneditPrint" type="primary" @click="editPrint" :loading="$store.getters.is_loading">确 定</el-button>
        <el-button name="btneditDialog" @click="editDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·修改打印单 -->

    <!-- dialog 货品详情 -->
    <good-detail v-if="goodDetailDialog.visible" :data="goodDetailDialog" @listenGoodDetailDialog="listenGoodDetailDialog"></good-detail>
    <!-- end 货品详情-->

    <!-- dialog 批量录入条码 -->
    <multi-code-enter :visible.sync="multiCodeVisible" @listenMultiCodeEnter="listenMultiCodeEnter"></multi-code-enter>
    <!-- End 批量录入条码 -->

    <!-- 查看素金 & 非素 -->
    <goldCheck v-if="checkDialog" :checkDialog="checkDialog" v-on:closeDialog=" checkDialog = !checkDialog " :checkInfo="checkParams"></goldCheck>
    <!-- end 查看素金 & 非素 -->

    <!-- 选择旧货 -->
    <junkCreate v-if="createDialog" :PrintId="PrintId" :visible.sync="createDialog" @listenCreateDialog="listenCreateDialog"></junkCreate>
    <!-- end 选择旧货 -->

    <!-- @module Dialog·新建打印单原因 -->
    <dict-manage v-if="reasonDialog" :visible.sync="reasonDialog" :dicts="reasonData" :dialogTitle="dialogTitle" :dictType="settingDictionaryDictType.JunkPrintOrderBasicReasonType" @listenDictSave="listenDictSave"></dict-manage>
    <!-- End Dialog·新建打印单原因  -->
  </div>
</template>

<script>
import {
  STOCKING_API_JUNK_PRINT_ORDER_BASIC_GET,
  STOCKING_API_JUNK_PRINT_ORDER_ITEM_GETS,
  STOCKING_API_JUNK_PRINT_ORDER_ITEM_CREATE,
  STOCKING_API_JUNK_PRINT_ORDER_ITEM_DELETE,
  STOCKING_API_JUNK_PRINT_ORDER_BASIC_UPDATE,
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST 
} from '@/apis/merchant.js'
import {
  YNStatus
} from '@/enums/common.js'
import {
  SettingDictionaryDictType
} from '@/enums/stocking.js'

import pagination from '@/components/pagination.vue'
import goodDetail from '@/components/erp/goodDetail'
import SelectGoods from '@/components/erp/selectGoods'
import MultiCodeEnter from '@/components/erp/multiCodeEnter'
import junkCreate from './create'
import goldCheck from '@/components/erp/goldCheck'
import dictManage from '@/components/erp/dictManage'

export default {
  data() {
    return {
      YNStatus,
      settingDictionaryDictType: SettingDictionaryDictType,
      goodsData: [], // 货品数据
      size: 20, // 分页数据条数
      pg: 1, // 当前页面位置
      total: 0, // 总数据条数
      PrintId: '',
      detail: {
      },
      editForm: {
      },
      code: '',
      printCounts: 1,
      goodDetailDialog: {
        goodsId: '',
        visible: false // 货品详情对话框
      },
      checkParams: {
        type: false,
        id: ''
      },
      dialogTitle: '旧货标签打印原因',
      reasonData: [], // 原因下拉
      createForm: {},
      rules: {
        ReasonTypeDk: [
          {
            type: 'number',
            required: true,
            message: '请选择打印原因',
            trigger: 'change'
          }
        ]
      },
      editDialog: false,
      multiCodeVisible: false, // 批量录入条码弹窗
      createDialog: false, // 选择旧货货品对话框
      checkDialog: false,
      reasonDialog: false
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.PrintId = Number(query.id)||0
      
      if (!this.PrintId) {
        this.dataError()
      } else {
        this.getDetail()
        this.getGoods()
        this.getReasons()
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
      STOCKING_API_JUNK_PRINT_ORDER_BASIC_GET({
        PrintId: this.PrintId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.editForm = Object.assign({
          }, res.data.Data)
        }
      })
    },
    getGoods() {
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_JUNK_PRINT_ORDER_ITEM_GETS({
        PrintId: this.PrintId,
        MaterialType: 0,
        OrderBy: 0,
        IsAsced: this.YNStatus.No,
        PageIndex: this.pg,
        PageSize: this.size
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.total = res.data.Data.Count||0
        } else {
          this.$message.error('数据请求失败')
          this.goodsData = []
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    editPrintR(){
      this.createForm = Object.assign({}, this.detail)
      this.editDialog = true
    },
    editPrint(){
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_JUNK_PRINT_ORDER_BASIC_UPDATE({
            PrintId: this.createForm.PrintId,
            ReasonTypeDk: this.createForm.ReasonTypeDk,
            ReasonTypeDv: this.getPrintReasonValue(this.createForm.ReasonTypeDk),
            Note: this.createForm.Note,
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: res.data.Message,
                type: 'success'
              })
              this.$store.commit('SET_BTN_LOADING', false)
              this.editDialog = false
              this.getDetail()
            } else {
              this.$message.error(res.data.Message)
            }
          })
        }else{
          this.$message.error('请完善信息！')
        }
      })
    },
    getPrintReasonValue(id) {
      let result = ''
      if(this.reasonData&&id){
        this.reasonData.forEach(item => {
          if (item.Id === id) {
            result = item.Value
            return false
          }
        })
      }
      return result
    },
    pageChange(val) {
      this.pg = val
      this.getGoods()
    },
    pageSizeChange(val) {
      this.pg = 1
      this.size = val
      this.getGoods()
    },
    showDetailDialog(goodsId) {
      this.checkParams = {
        type: false,
        id: goodsId
      }
      this.checkDialog = true
    },
    delGood($event, id) {
      $event.currentTarget.blur()
      this.$confirm('确定删除此货品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.commit('SET_FULL_LOADING', true)
          STOCKING_API_JUNK_PRINT_ORDER_ITEM_DELETE({
            PrintId: this.PrintId,
            ItemId: id
          }).then(res => {
            this.$store.commit('SET_FULL_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: res.data.Message,
                type: 'success'
              })
              if (this.goodsData.length === 1) {
                this.pg = 1
              }
              this.getGoods()
              this.getDetail()
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
    listenCreateDialog(success) {
      if (success) {
        this.getGoods()
      }
      this.createDialog = false
    },
    listenDictSave() {
      this.getReasons()
    },
    listenMultiCodeEnter(codes) {
      console.log('codes', codes)
      if (codes.length) {
        this.addGood(codes)
      } else {
        this.multiCodeVisible = false
      }
    },
    codeEnter() {
      this.code = this.code.trim()
      STOCKING_API_JUNK_PRINT_ORDER_ITEM_CREATE({
        PrintId: this.PrintId,
        Items: [{JunkCode: this.code}]
      }).then(res => {
        this.code = ''
        if(res.data.Code == 'CORRECT'){
          this.$message.success('提交成功！')
          this.getGoods()
        } else {
          this.$message.error(res.data.Message)
        }
        // this.code = ''
      })
    },
    addGood(items) {
      let junks = []
      items.forEach(item => {
        junks.push({JunkCode: item.BarCode})
      })

      STOCKING_API_JUNK_PRINT_ORDER_ITEM_CREATE({
        PrintId: this.PrintId,
        Items: junks
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '提交成功！',
            type: 'success'
          })
          this.getGoods()
          this.code = ''
          this.multiCodeVisible = false
        } else {
          this.$confirm(res.data.Message, '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            type: 'error'
          })
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    listenGoodDetailDialog() {
      this.goodDetailDialog.visible = false
      this.getGoods()
    },
    checkGold(obj) {
      // 查看素金
      this.checkParams = obj
      this.checkDialog = true
    },
    getEnums() {
      this.$store.dispatch('GET_MATERIAL_TYPE', this.YNStatus.Yes)
      this.$store.dispatch('GET_CATEGORY_TYPE', this.YNStatus.Yes)
    },
    getReasons() {
      // this.$store.dispatch('GET_REASONS_DROPLIST', {DictType: this.settingDictionaryDictType.JunkPrintOrderBasicReasonType, State: this.YNStatus.Yes})
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: this.settingDictionaryDictType.JunkPrintOrderBasicReasonType,
        State: this.YNStatus.Yes
      }).then(res => {
        if(res.data.Code == 'CORRECT'){
          this.reasonData = res.data.Data.Rows||[]
          if(!this.reasonData.some(item => item.Id === this.createForm.ReasonTypeDk)){
            this.createForm.ReasonTypeDk = ''
            this.createForm.ReasonTypeDv = ''
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
  components: {
    pagination,
    goodDetail,
    SelectGoods,
    MultiCodeEnter,
    junkCreate,
    goldCheck,
    dictManage
  }
}
</script>
<style lang="scss" scoped>
.count {
  padding-right: 15px;
  line-height: 36px;
  text-align: right;
  font-size: 14px;
}
</style>

