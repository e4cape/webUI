<template>
  <div class="content">
    <!-- @module Panel -->
    <!-- 搜索条件 -->
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="search" @onReset="reset">
        <template slot="btnBox">
          <el-form-item>
            <el-button name="btnAllImport" type="primary" @click="allImport" style="width:100px;">导出Excel</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-input name="ProductId" placeholder="商品编码" v-model="queryForm.ProductId" @keyup.enter.native="search">
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="search"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="提交时间：">
            <el-date-picker name="CreateTime" :picker-options="$root.datePickerOptions" :unlink-panels="true" type="daterange" v-model="queryForm.CreateTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="订单状态：">
            <el-select name="State" v-model="queryForm.State" placeholder="全部" :filterable="true">
              <el-option label="全部" :value="0"></el-option>
              <template v-for="(item, index) in spreadSaleOrderBasicState.Types">
                <el-option v-if="index != spreadSaleOrderBasicState.Deleted" :key="index" :label="item" :value="index"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="商品编码：">
            <el-input name="ProductId" :maxlength="50" v-model="queryForm.ProductId" @keyup.native="queryForm.ProductId = $root.toFixed(queryForm.ProductId, 0)" @keyup.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item label="订单类型：">
            <el-select name="IsDirected" v-model="queryForm.IsDirected" placeholder="全部" :filterable="true">
              <el-option label="全部" :value="0"></el-option>
              <el-option label="普通订单" :value="yNStatus.Yes"></el-option>
              <el-option label="秒杀" :value="yNStatus.No"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单号：">
            <el-input name="OrderCode" :maxlength="20" v-model="queryForm.OrderCode" @keyup.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item label="商品名称：">
            <el-input name="ProductName" :maxlength="20" v-model="queryForm.ProductName" @keyup.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input name="TrueName" :maxlength="20" v-model="queryForm.TrueName" @keyup.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item label="手机号：">
            <el-input name="Mobile" :maxlength="20" v-model="queryForm.Mobile" @keyup.enter.native="search"></el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- END 搜索条件 -->
    <div class="p10"></div>
    <!-- Data Table -->
    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="CreateTime" label="提交时间" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="OrderCode" label="订单号" show-overflow-tooltip width="80" fixed></el-table-column>
      <el-table-column prop="ProductId" label="商品编码" show-overflow-tooltip width="80"></el-table-column>
      <el-table-column prop="ProductName" label="商品名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="MktPrice" label="活动价" show-overflow-tooltip>
        <template slot-scope="scope">￥{{scope.row.MktPrice}}</template>
      </el-table-column>
      <el-table-column prop="Quantity" label="数量" show-overflow-tooltip width="60"></el-table-column>
      <el-table-column prop="OrderPrice" label="订单金额" show-overflow-tooltip>
        <template slot-scope="scope">￥{{scope.row.OrderPrice}}</template>
      </el-table-column>
      <el-table-column prop="OrderPrice" label="订单类型" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.IsDirected === yNStatus.No ? spreadType.Types[scope.row.SpreadType] : '普通订单'}}</template>
      </el-table-column>
      <el-table-column prop="MemberId" label="会员ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="MemName" label="姓名" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.MemName && scope.row.MemName != '' ? scope.row.MemName : scope.row.TrueName1}}</template>
      </el-table-column>
      <el-table-column prop="MemPhone" label="手机" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.MemPhone && scope.row.MemPhone != '' ? scope.row.MemPhone : scope.row.Mobile1}}</template>
      </el-table-column>
      <el-table-column prop="PickType" label="商品领取" show-overflow-tooltip width="80">
        <template slot-scope="scope">{{pickType.Types[scope.row.PickType]}}</template>
      </el-table-column>
      <el-table-column prop="AddrName" label="提货门店" show-overflow-tooltip></el-table-column>
      <el-table-column prop="State" label="订单状态" show-overflow-tooltip width="120" fixed="right">
        <template slot-scope="scope">{{spreadSaleOrderBasicState.Types[scope.row.State]}}</template>
      </el-table-column>
      <el-table-column prop="Note" label="备注" show-overflow-tooltip width="120"></el-table-column>
      <!-- <el-table-column prop="State" label="退款状态" show-overflow-tooltip width="120" fixed="right">
        <template slot-scope="scope">
          {{scope.row.ReturnState == spreadSaleOrderBasicReturnState.None ? '--' : spreadSaleOrderBasicReturnState.Types[scope.row.ReturnState].replace('货', '款')}}
        </template>
      </el-table-column>-->
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button name="btnCheck" type="text" @click="check(scope.row)">详情</el-button>
          <template v-if="$store.getters.user_session.CharacterType == characterType.Store">
            <el-button
              name="btnPickUp"
              type="text"
              v-if="scope.row.State === spreadSaleOrderBasicState.WaitShip && scope.row.ReturnState == spreadSaleOrderBasicReturnState.None"
              @click="pickUp(scope.row.OrderId)"
            >提货</el-button>
            <el-button
              name="btnMail"
              type="text"
              v-if="scope.row.State === spreadSaleOrderBasicState.WaitShip && scope.row.ReturnState == spreadSaleOrderBasicReturnState.None"
              @click="mail(scope.row.OrderId)"
            >邮寄</el-button>
            <el-button name="btnCheckReason" type="text" v-if="scope.row.ReturnState == spreadSaleOrderBasicReturnState.Returned" @click="checkReason(scope.row.OrderId)">查看原因</el-button>
            <el-button
              name="btnCheckMail"
              type="text"
              v-if="scope.row.ShippingType === shippingType.Express && (!scope.row.ShipCharacterId || scope.row.ShipCharacterId === $store.getters.user_session.CharacterId)"
              @click="checkMail(scope.row)"
            >查看物流</el-button>
            <el-button
              name="btnCreditOrder"
              type="text"
              v-if="scope.row.ReturnState == spreadSaleOrderBasicReturnState.None && scope.row.State >= spreadSaleOrderBasicState.WaitShip && (!scope.row.ShipCharacterId || scope.row.ShipCharacterId === $store.getters.user_session.CharacterId)"
              @click="creditOrder(scope.row.OrderId)"
            >创建退款单</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- end Table -->
    <!-- 分页 -->
    <div class="p10">
      <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </div>
    <!-- 分页 end -->
    <order-check v-if="checkVisible" :returnId="returnId" :checkId="checkId" :checkVisible="checkVisible" @listenCheckVisible="listenCheckVisible"></order-check>

    <pick-up v-if="pickUpVisible" :pickUpVisible="pickUpVisible" :pickUpId="pickUpId" @listenPickUpVisible="listenPickUpVisible"></pick-up>

    <mail v-if="mailVisible" :mailVisible="mailVisible" :mailId="mailId" @listenMailVisible="listenMailVisible"></mail>

    <el-dialog v-if="creditOrderVisible" :visible.sync="creditOrderVisible" width="550px" title="创建退款单">
      <span class="required">退款原因:</span>
      <el-input name="text" v-model="text" :maxlength="200" style="width: calc(100% - 100px);"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnReturnCreate" :loading="$store.getters.is_loading" @click="returnCreate">确定</el-button>
        <el-button name="btnCancel" @click="creditOrderVisible =  false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="reasonVisible" width="550px" title="查看原因">
      <span class="reason" style="word-break:break-all; width: 100%;">{{reasons}}</span>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnReason" @click="reasonVisible =  false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import orderCheck from '../orderCheck'
import pickUp from '../pickUp'
import mail from '../mail'
import searchPanel from '@/components/searchPanel.vue'
import {
  SpreadSaleOrderBasicState,
  SpreadType,
  SaleOrderBasicReturnState,
  ExpressType,
  PickType,
  SpreadSaleOrderBasicReturnState,
  ShippingType
} from '@/enums/spread'
import { YNStatus, CharacterType } from '@/enums/common'
import {
  SPREAD_API_SPRORDER_SEARCH,
  SPREAD_API_SPRORDER_EXPORT,
  SPREAD_API_SPRORDER_RETURNCREATE,
  SPREAD_API_SPRORDER_SEARCHREASON,
  SPREAD_API_SPRORDER_CHECKCOUPON
} from '@/apis/spread'
export default {
  data() {
    return {
      pickType: PickType,
      shippingType: ShippingType,
      characterType: CharacterType,
      spreadSaleOrderBasicState: SpreadSaleOrderBasicState,
      spreadSaleOrderBasicReturnState: SpreadSaleOrderBasicReturnState,
      yNStatus: YNStatus,
      spreadType: SpreadType,
      data: [],
      checkVisible: false,
      creditOrderVisible: false,
      pickUpVisible: false,
      mailVisible: false,
      reasonVisible: false,
      reasons: '',
      creditOrderId: '',
      checkId: '',
      pickUpId: '',
      mailId: '',
      returnId: '',
      queryForm: {
        OrderId: '',
        OrderCode: '',
        SpreadId: '',
        SpreadType: 0,
        SpreadTitle: '',
        ProductId: '',
        ProductName: '',
        CreateTime: '',
        State: 0,
        AliasName: '',
        TrueName: '',
        KeyValues: '',
        Mobile: '',
        OrderBy: 0,
        IsAsc: '',
        PageIndex: 1,
        PageSize: 20,
        IsDirected: 0
      },
      parameters: {
      },
      total: 0,
      text: ''
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.spreadId = query.spreadId
      this.queryForm = Object.assign(
        this.queryForm,
        {
          OrderId: '',
          OrderCode: '',
          SpreadId: this.spreadId,
          SpreadType: 0,
          SpreadTitle: '',
          ProductId: '',
          ProductName: '',
          CreateTime: '',
          State: 0,
          AliasName: '',
          TrueName: '',
          Mobile: '',
          OrderBy: 0,
          IsAsc: '',
          PageIndex: 1,
          PageSize: 20,
          IsDirected: 0
        },
        query
      )
      this.getData()
    },
    search() {
      this.parameters.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      this.initRoute()
    },
    reset() {
      this.queryForm = {
        // 查询表单数据
        OrderId: '',
        OrderCode: '',
        SpreadId: this.spreadId,
        SpreadType: 0,
        SpreadTitle: '',
        ProductId: '',
        ProductName: '',
        CreateTime: '',
        State: 0,
        AliasName: '',
        TrueName: '',
        Mobile: '',
        OrderBy: 0,
        IsAsc: '',
        PageIndex: 1,
        PageSize: 20,
        IsDirected: 0
      }
      this.search()
    },
    getData() {
      let ProductId = this.$root.toFixed(this.queryForm.ProductId, 0)
      if (ProductId && this.queryForm.ProductId !== ProductId) {
        this.$message.error('请输入正确的商品编号')
        return false
      }
      let createTime = this.queryForm.CreateTime || [
        '1900-01-01 0:00:00',
        '1900-01-01 0:00:00'
      ]
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_SPRORDER_SEARCH(
        Object.assign({
        }, this.queryForm, {
          SpreadId: this.spreadId,
          SpreadType: SpreadType.Seckill,
          CreateTime1: createTime[0],
          CreateTime2: createTime[1]
        })
      ).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows
          this.total = res.data.Data.total
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    allImport() {
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_SPRORDER_EXPORT(
        Object.assign({
        }, this.queryForm, {
          SpreadId: this.spreadId,
          SpreadType: SpreadType.Seckill,
          CreateTime1: this.queryForm.CreateTime[0],
          CreateTime2: this.queryForm.CreateTime[1]
        })
      ).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          setTimeout(() => {
            window.open(
              this.$root.settings.DOMAIN_TEMP + res.data.Data.FilePath
            )
          }, 1000)
        }
      })
    },
    returnCreate() {
      this.$store.commit('SET_BTN_LOADING', true)
      SPREAD_API_SPRORDER_RETURNCREATE({
        OrderId: this.creditOrderId,
        Note: this.text
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        this.text = ''
        if (res.data.Code === 'CORRECT') {
          this.getData()
          this.creditOrderVisible = false
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    checkReason(id) {
      SPREAD_API_SPRORDER_SEARCHREASON({
        orderId: id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.reasons = res.data.Data.Note
          this.reasonVisible = true
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    check(row) {
      this.checkId = row.OrderId
      this.returnId =
        row.ReturnState === SaleOrderBasicReturnState.No ? false : row.ReturnId
      this.checkVisible = true
    },
    pickUp(id) {
      this.pickUpId = id
      this.pickUpVisible = true
    },
    mail(id) {
      this.mailId = id
      this.mailVisible = true
    },
    checkMail(row) {
      this.$alert(
        '快递单号：' + row.ExpressCode,
        ExpressType.Types[row.ExpressType],
        {
          confirmButtonText: '确定'
          // callback: action => {}
        }
      )
    },
    creditOrder(id) {
      SPREAD_API_SPRORDER_CHECKCOUPON({
        orderId: id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.creditOrderId = id
          this.creditOrderVisible = true
        }
      })
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.initRoute()
    },
    listenCheckVisible(flg) {
      if (!flg) {
        this.checkVisible = false
      }
    },
    listenPickUpVisible(flg) {
      if (!flg) {
        this.pickUpVisible = false
        this.getData()
      }
    },
    listenMailVisible(flg) {
      if (!flg) {
        this.mailVisible = false
        this.getData()
      }
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: Object.assign(this.parameters, {
          spreadId: this.spreadId
        })
      })
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination,
    orderCheck,
    searchPanel,
    pickUp,
    mail
  }
}
</script>
