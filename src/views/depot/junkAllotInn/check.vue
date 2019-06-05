<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <span class="title">查看旧货调拨入库单</span>
        <!-- <span class="fr title">
          <el-button type="text" @click="$router.back(-1)">
            返回
          </el-button>
        </span> -->
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td rowspan="6" class="state-img">
                  <img src="@/assets/images/auditing.png" v-if="detail.State === junkAllotOrderIntakeState.Wait">
                  <img src="@/assets/images/audited.png" v-if="detail.State === junkAllotOrderIntakeState.Audit">
                  <img src="@/assets/images/auditBack.png" v-if="detail.State === junkAllotOrderIntakeState.Reject">
                  <div>{{junkAllotOrderIntakeState.Types[detail.State]}}</div>
                </td>
              </tr>
              <tr>
                <td class="tit">单号</td>
                <td>{{detail.OutakeCode}}</td>
                <td class="tit">发货</td>
                <td>{{detail.CreateUser}}&nbsp;&nbsp;{{detail.CreateTime|filterDateTime}}</td>
                <td class="tit">收货</td>
                <td v-if="detail.State === junkAllotOrderIntakeState.Audit || detail.State === junkAllotOrderIntakeState.Reject">
                  {{detail.CheckUser}}&nbsp;&nbsp;{{detail.CheckTime|filterDateTime}}
                </td>
                <td v-else>-</td>
              </tr>
              <tr>
                <td class="tit">来源</td>
                <td>{{detail.UnitedName1}}</td>
                <td class="tit">调拨原因</td>
                <td>{{detail.ReasonTypeDv}}</td>
                <td class="tit">收货方式</td>
                <td>{{ShippingType.Types[detail.ShippingType]}}</td>
              </tr>
              <tr>
                <td class="tit">发货人</td>
                <td>{{detail.SendUser}}</td>
                <td class="tit">发货人电话</td>
                <td>{{detail.SendPhone}}</td>
                <td class="tit">快递供公司</td>
                <td>{{ExpressType.Types[detail.ExpressType]}}</td>
              </tr>
              <tr>
                <td class="tit">快递单号</td>
                <td>{{detail.ExpressCode}}</td>
                <td v-if="characterType == this.CharacterType.Company" class="tit">入库仓库</td>
                <td v-if="characterType == this.CharacterType.Company">{{detail.WarehouseName2+ '&nbsp;>&nbsp;'+ detail.ShelfName2}}</td>
                <td class="tit">业务日期：</td>
                <td class="note" :colspan="3">{{detail.ActualDate|filterDate}}</td>
              </tr>
              <tr>
                <td class="tit">备注</td>
                <td class="note" colspan="5">{{detail.OutakeNote}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="checkPage-hd">
          <el-row>
            <el-col :span="12">
              <!-- <i class="icon-list"></i> -->
              <span class="title">货品列表</span>
            </el-col>
            <el-col :span="12" class="tr">
              <span class="detail-info-num-item">
                总件数：<b class="num">{{detail.Quantity}}</b>
              </span>
              <span class="detail-info-num-item">
                总金重：<b class="num">{{ $root.toFloat(detail.GoldWeight,3)}}g</b>
              </span>
              <span class="detail-info-num-item">
                结算金额：<b class="num">￥{{ $root.toFloat(detail.Preprice) }}元</b>
              </span>
            </el-col>
          </el-row>
        </div>
        <!-- @module 数据表格 -->
        <div class="p-x-10">
          <el-table 
            :data="goodsData" 
            v-loading="$store.getters.tb_loading" 
            element-loading-text="拼命加载中">
            <el-table-column prop="JunkCode" label="旧货编号" min-width="140" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="init-button-text" @click="checkGold(scope.row.JunkId,scope.row.IsGold)" name="btnCheckGold">{{scope.row.JunkCode}}</span>
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
            <el-table-column prop="RecallPrice" label="回收金额(元)" min-width="80" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.RecallPrice)}}
              </template>
            </el-table-column>
            <el-table-column prop="CreateTime" label="回收时间" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.CreateTime | filterDateTime}}
              </template>
            </el-table-column>
            <el-table-column prop="Price" label="结算金额(元)" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                ￥{{$root.toFloat(scope.row.Price)}}
              </template>
            </el-table-column>
          </el-table>
          <!-- End 数据表格 -->
          <!-- Pagination -->
          <pagination :pg="pageIndex" :size="pageSize" :total="totalCount" @currentChange="pageChange" @sizeChange="pageSizeChange"></pagination>
          <!-- end Pagination -->
        </div>
      </div>
    </div>
    <div class="buttons">
      <el-button v-if="detail.State == junkAllotOrderIntakeState.Wait" type="primary" @click="junkOutAudit" name="btnJunkOutAudit">收货入库</el-button>
      <el-button v-if="detail.State == junkAllotOrderIntakeState.Wait" @click="junkOutReject" name="junkOutReject">退回</el-button>
      <el-button @click="$router.back(-1)">返回</el-button>
    </div>

    <!-- @module 查看素金 -->
    <goldCheck v-if="checkDialog" :checkDialog="checkDialog" v-on:closeDialog=" checkDialog = !checkDialog " :checkInfo="checkParams"></goldCheck>
    <!-- end -->

    <!-- 收货入库 -->
    <el-dialog title="收货入库" :visible.sync="auditDialog" @close="auditDialog=false,$refs['queryForm'].resetFields()">
      <el-form :model="queryForm" ref="queryForm" :rules="rules" :label-position="'right'" label-width="100px">
        <el-row>
          <el-col :span="9">
            <el-form-item label="入库仓库" prop="WarehouseId2">
              <el-select class="m-r-10" v-model="queryForm.WarehouseId2" @change="chooseHouse" placeholder="请选择" :filterable="true" name="StuffType">
                <template v-for="(item,index) in $store.getters.wareHouses">
                  <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item class="shelf-box" prop="ShelfId2">
              <el-select v-model="queryForm.ShelfId2" placeholder="请选择" label-width="0" :filterable="true" name="StuffType">
                <template v-for="(item,index) in Shelfs">
                  <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="junkInn" :loading="$store.getters.is_loading" name="btnMakeAbandon">确 定</el-button>
        <el-button @click="auditDialog = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End-收货入库 -->

    <!-- 退回 -->
    <el-dialog title="退回" :visible.sync="cancelDialog">
      <el-form :label-position="'right'" @submit.native.prevent label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="单据编号：">
              <span>{{detail.OutakeCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创发货：">
              <span>{{detail.CreateUser + '&nbsp;&nbsp;&nbsp;' + detail.ActualDate}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="回退原因：">
            <el-input v-model="abandonReson" placeholder="作回退原因备注" :maxlength="200" name="abandonReason"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          退回后该单据回退到调拨出库的门店，并且不在本店显示，确定退回？
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="makeAbandon" :loading="$store.getters.is_loading" name="btnMakeAbandon">确 定</el-button>
        <el-button @click="cancelDialog = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End-退回 -->
  </div>
</template>

<script>
import {
  JunkAllotOrderIntakeState
} from '@/enums/stocking.js'
import {
  YNStatus,
  ShippingType,
  ExpressType,
  CharacterType
} from '@/enums/common.js'
import {
  STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_REQ,
  STOCKING_API_JUNK_ALLOT_ORDER_ITEM_GETS,
  STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_RECEIVE,
  STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_RETURN
} from '@/apis/stocking.js'

import goodsDetails from '@/components/erp/goodsDetails'
import GoldCheck from '@/components/erp/goldCheck'
import pagination from '@/components/pagination'

export default {
  data() {
    return {
      YNStatus,
      ShippingType,
      ExpressType,
      CharacterType,
      junkAllotOrderIntakeState: JunkAllotOrderIntakeState,
      data: [],
      goodsData: [], // 货品数据
      pageSize: 20, // 分页数据条数
      pageIndex: 1, // 当前页面位置
      totalCount: 0, // 总数据条数
      IntakeId: '',
      checkParams: {
      },
      checkDialog: false,
      queryForm: {
        WarehouseId2: null,
        ShelfId2: null,
      },
      returnForm: {},
      Shelfs: [],
      abandonReson: '',
      detail: {
        GoldWeight: 0,
        Price: 0,
        RecallFee: 0,
        IntakeId: '',
        SupplierId: '',
        ArrivalCode: '',
        Note: ''
      },
      rules: {
        WarehouseId2: [
          {
            required: true,
            message: '请选择仓库',
            trigger: 'change'
          }
        ],
        ShelfId2: [
          {
            required: true,
            message: '请选择货架',
            trigger: 'change'
          }
        ]
      },
      auditDialog: false,
      cancelDialog: false,
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.pageSize = this.$route.query.size || 20
      this.pageIndex = this.$route.query.pg || 1
      this.IntakeId = Number(query.id)||0
      if (!this.IntakeId) {
        this.dataError()
      } else {
        this.getDetail()
      }
    },
    dataError(msg) {
      // 错误返回
      this.$confirm(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },
    getDetail() {
      // 获取基本信息
      STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_REQ({
        IntakeId: this.IntakeId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          this.queryForm.WarehouseId2 = this.detail.WarehouseId2||''
          this.queryForm.ShelfId2 = this.detail.ShelfId2||''
          this.getGoods()
        }
      })
    },
    getGoods() {
      // 获取表单list
      STOCKING_API_JUNK_ALLOT_ORDER_ITEM_GETS({
        OutakeId: this.detail.OutakeId,
        OrderBy: 0,
        IsAsced: this.YNStatus.No,
        PageIndex: this.pageIndex,
        PageSize: this.pageSize
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.goodsData = res.data.Data.Rows || []
          this.totalCount = res.data.Data.Count || 0
        } else {
          this.$message.error(res.data.Message)
          this.goodsData = []
        }
      })
    },
    checkGold(id, type) {
      // 查看素金
      this.checkParams = {
        type: type,
        id: id
      }
      this.checkDialog = !this.checkDialog
    },
    listenAllDialog(type, success) {
      // 监听全部窗口关闭
      if (success) {
        this.getDetail()
      }
      this[type] = false
    },
    chooseHouse(e) {
      if(this.$store.getters.wareHouses&&this.$store.getters.wareHouses.length>0&&e){
        this.Shelfs = this.$store.getters.wareHouses.find(item => {
          return item.Id == e
        }).Childrens.filter(item => {return item.State == this.YNStatus.Yes})
        if(this.Shelfs.length == 1){
          this.queryForm.ShelfId2 = this.Shelfs[0].Id
        }else{
          this.queryForm.ShelfId2 = ''
        }
      }
    },
    junkOutAudit() {
      // 入库
      if(this.characterType !== this.CharacterType.Store){
        this.auditDialog = true
        this.chooseHouse(this.queryForm.WarehouseId2) // 获取货架数据
      }else{
        this.junkInn()
      }
    },
    junkOutReject() {
      // 回退
      this.cancelDialog = true
      this.abandonReson = ''
    },
    junkInn(){
      let obj = {}
      if(this.characterType !== this.CharacterType.Store){
        obj = Object.assign({}, this.queryForm, {IntakeId: this.IntakeId, CheckNote: this.detail.Note})
        this.$refs['queryForm'].validate((valid) => {
          if (valid){
            STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_RECEIVE(obj).then(res => {
              if(res.data.Code == 'CORRECT'){
                this.$message.success('提交成功！')
                this.$router.push('/depot/junkAllotInn/index')
              }
            })
          }
        })
      }else{
        obj = {IntakeId: this.IntakeId, CheckNote: this.detail.Note}
        STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_RECEIVE(obj).then(res => {
          if(res.data.Code == 'CORRECT'){
            this.$message.success('提交成功！')
            this.$router.push('/depot/junkAllotInn/index')
          }
        })
      }
    },
    makeAbandon(){
      STOCKING_API_JUNK_ALLOT_ORDER_INTAKE_RETURN({ 
        IntakeId: this.IntakeId, CheckNote: this.abandonReson 
      }).then(res => {
        if(res.data.Code == 'CORRECT'){
          this.$message.success('提交成功！')
          this.$router.push('/depot/junkAllotInn/index')
        }
      })
    },
    getEnums() {
      this.$store.dispatch('GET_MATERIAL_TYPE')
      this.$store.dispatch('GET_CATEGORY_TYPE')
      this.$store.dispatch('GET_GOLD_TYPE')
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', {HasShelf: this.YNStatus.Yes, State: 0})
    },
    pageChange(val) {
      this.pageIndex = val
      this.getGoods()
    },
    pageSizeChange(val) {
      this.pageIndex = 1
      this.pageSize = val
      this.getGoods()
    },
  },
  created() {
    this.getEnums()
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
    pagination,
    GoldCheck,
  }
}
</script>

<style lang="scss">
</style>
