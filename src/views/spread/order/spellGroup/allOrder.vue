<template>
  <div class="content">
    <el-form :model="queryForm" label-position="right" label-width="100px" :inline="true" class="item-lh-26 p10">
      <el-row class="search-box no-border" type="flex">
        <el-col>
          <el-form-item label="提交时间：">
            <el-date-picker name="CreateTime" :picker-options="$root.datePickerOptions" :unlink-panels="true" type="daterange" v-model="queryForm.CreateTime"  ></el-date-picker>
          </el-form-item>
          <el-form-item label="订单号：">
            <el-input name="OrderCode" :maxlength="50" v-model="queryForm.OrderCode" @keyup.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input name="TrueName" :maxlength="50" v-model="queryForm.TrueName" @keyup.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item label="手机：">
            <el-input name="Mobile" :maxlength="50" v-model="queryForm.Mobile" @keyup.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item label="角色：">
            <el-select name="OrderType" v-model="queryForm.OrderType" placeholder="全部" :filterable="true">
              <el-option label="全部" :value="0"></el-option>
              <el-option v-for="(item, index) in spreadSaleOrderBasicOrderType.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="成团人数/团：">
            <el-input name="MembAmt" :maxlength="50" v-model="queryForm.MembAmt" @keyup.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item label="订单状态：">
            <el-select name="State" v-model="queryForm.State" placeholder="全部" :filterable="true">
              <el-option label="全部" :value="'0'"></el-option>
              <template v-for="(item, index) in spreadSaleOrderBasicState.Types">
                <el-option v-if="index != spreadSaleOrderBasicState.Deleted" :key="index" :label="item" :value="index + ''"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="拼团状态：">
            <el-select name="TeamState" v-model="queryForm.TeamState" placeholder="全部" :filterable="true">
              <el-option label="全部" :value="0"></el-option>
              <el-option v-for="(item, index) in collageTeamState.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单类型：">
            <el-select name="IsDirected" v-model="queryForm.IsDirected" placeholder="全部" :filterable="true">
              <el-option label="全部" :value="0"></el-option>
              <el-option label="普通订单" :value="yNStatus.Yes"></el-option>
              <el-option label="拼团" :value="yNStatus.No"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="search-btn">
          <el-button name="btnSearch" type="primary" @click="search">搜索</el-button>
          <el-button name="btnAllImport" type="text" @click="allImport">导出Excel</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- END 搜索条件 -->
    <div class="p10"></div>
    <!-- Data Table -->
    <el-table :data="allData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="CreateTime" label="提交时间"  show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="OrderCode" label="订单号"  show-overflow-tooltip width="80" fixed></el-table-column>
      <el-table-column prop="ProductId" label="商品编码" show-overflow-tooltip width="80"></el-table-column>
      <el-table-column prop="ProductName" label="商品名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="MktPrice" label="活动价" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Quantity" label="数量" show-overflow-tooltip width="60"></el-table-column>
      <el-table-column prop="OrderPrice" label="订单金额" show-overflow-tooltip></el-table-column>
      <el-table-column prop="SpreadType" label="订单类型" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.IsDirected === yNStatus.No ? spreadType.Types[scope.row.SpreadType] : '普通订单'}}
        </template>
      </el-table-column>
      <el-table-column prop="MemberId" label="会员ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="MemName" label="姓名" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.MemName && scope.row.MemName != '' ? scope.row.MemName : scope.row.TrueName1}}
        </template>
      </el-table-column>
      <el-table-column prop="MemPhone" label="手机" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.MemPhone && scope.row.MemPhone != '' ? scope.row.MemPhone : scope.row.Mobile1}}
        </template>
      </el-table-column>
      <el-table-column prop="PickType" label="商品领取" show-overflow-tooltip width="80">
        <template slot-scope="scope">
          {{pickType.Types[scope.row.PickType]}}
        </template>
      </el-table-column>
      <el-table-column prop="State" label="角色" show-overflow-tooltip width="120">
        <template slot-scope="scope">
          {{spreadSaleOrderBasicOrderType.Types[scope.row.OrderType]}}
        </template>
      </el-table-column>
      <el-table-column prop="MembAmt" label="成团人数/团" show-overflow-tooltip width="120">
        <template slot-scope="scope">
          {{scope.row.MembAmt}}人团
        </template>
      </el-table-column>
      <el-table-column prop="TeamId" label="团号" show-overflow-tooltip width="120"></el-table-column>
      <el-table-column prop="AddrName" label="提货门店" show-overflow-tooltip></el-table-column>
      <el-table-column prop="State" label="订单状态" show-overflow-tooltip width="120">
        <template slot-scope="scope">
          {{spreadSaleOrderBasicState.Types[scope.row.State]}}
        </template>
      </el-table-column>
      <el-table-column prop="State" label="拼团状态" show-overflow-tooltip width="120">
        <template slot-scope="scope">
          {{scope.row.State == spreadSaleOrderBasicState.Cancel ? '' : collageTeamState.Types[scope.row.TeamState]}}
        </template>
      </el-table-column>
      <el-table-column prop="Note" label="备注" show-overflow-tooltip width="120"></el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button name="btnCheck" type="text" @click="check(scope.row)">详情</el-button>
          <template v-if="$store.getters.user_session.CharacterType == characterType.Store">
            <el-button name="btnPickUp" type="text" v-if="(scope.row.TeamState == collageTeamState.Succeed || scope.row.IsDirected === yNStatus.Yes) && scope.row.State === spreadSaleOrderBasicState.WaitShip && scope.row.ReturnState == spreadSaleOrderBasicReturnState.None" @click="pickUp(scope.row.OrderId)">提货</el-button>
            <el-button name="btnMail" type="text" v-if="(scope.row.TeamState == collageTeamState.Succeed || scope.row.IsDirected === yNStatus.Yes) && scope.row.State === spreadSaleOrderBasicState.WaitShip && scope.row.ReturnState == spreadSaleOrderBasicReturnState.None" @click="mail(scope.row.OrderId)">邮寄</el-button>
            <el-button name="btnCheckReason" type="text" v-if="scope.row.ReturnState == spreadSaleOrderBasicReturnState.Returned" @click="checkReason(scope.row.OrderId)">查看原因</el-button>
            <el-button name="btnCheckMail" type="text" v-if="scope.row.ShippingType === shippingType.Express && (!scope.row.ShipCharacterId || scope.row.ShipCharacterId === $store.getters.user_session.CharacterId)" @click="checkMail(scope.row)">查看物流</el-button>
            <el-button name="btnCreditOrder"  type="text" v-if="(scope.row.TeamState == collageTeamState.Succeed || scope.row.TeamState == collageTeamState.Failed || scope.row.IsDirected === yNStatus.Yes) && scope.row.ReturnState == spreadSaleOrderBasicReturnState.None && scope.row.State >= spreadSaleOrderBasicState.WaitShip && (!scope.row.ShipCharacterId || scope.row.ShipCharacterId === $store.getters.user_session.CharacterId)" @click="creditOrder(scope.row.OrderId)">创建退款单</el-button>
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
import {
  SpreadType,
  ShippingType,
  ExpressType,
  SaleOrderBasicReturnState,
  SpreadSaleOrderBasicOrderType,
  SpreadSaleOrderBasicState,
  CollageTeamState,
  SpreadSaleOrderBasicReturnState,
  PickType
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
      spreadType: SpreadType,
      yNStatus: YNStatus,
      pickType: PickType,
      characterType: CharacterType,
      shippingType: ShippingType,
      collageTeamState: CollageTeamState,
      spreadSaleOrderBasicReturnState: SpreadSaleOrderBasicReturnState,
      spreadSaleOrderBasicOrderType: SpreadSaleOrderBasicOrderType,
      spreadSaleOrderBasicState: SpreadSaleOrderBasicState,
      allData: [],
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
        OrderType: '',
        SpreadTitle: '',
        ProductId: '',
        ProductName: '',
        MembAmt: '',
        TeamState: '',
        CreateTime: '',
        State: '0',
        AliasName: '',
        TrueName: '',
        Mobile: '',
        IsAsc: YNStatus.No,
        OrderBy: 0,
        PageIndex: 1,
        PageSize: 10,
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
      this.queryForm = Object.assign(this.queryForm, {
        OrderId: '',
        OrderCode: '',
        OrderType: '',
        SpreadTitle: '',
        ProductId: '',
        ProductName: '',
        MembAmt: '',
        TeamState: '',
        CreateTime: '',
        State: '0',
        AliasName: '',
        TrueName: '',
        Mobile: '',
        IsAsc: YNStatus.No,
        OrderBy: 0,
        PageIndex: 1,
        PageSize: 10,
        IsDirected: 0
      }, query)
      this.getAllData()
    },
    search() {
      this.queryForm.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getAllData()
      } else {
        this.initRoute()
      }
    },
    getAllData() {
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
      SPREAD_API_SPRORDER_SEARCH(Object.assign({
      }, this.queryForm, {
        CreateTime1: createTime[0],
        CreateTime2: createTime[1],
        MembAmt: this.queryForm.MembAmt.length ? this.queryForm.MembAmt : -1,
        SpreadType: SpreadType.Collage,
        SpreadId: this.spreadId,
      })).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.allData = res.data.Data.rows
          this.total = res.data.Data.total
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    allImport() {
      this.$store.commit('SET_TB_LOADING', true)
      let createTime = this.queryForm.CreateTime || [
        '1900-01-01 0:00:00',
        '1900-01-01 0:00:00'
      ]
      SPREAD_API_SPRORDER_EXPORT({
        OrderId: this.queryForm.OrderId,
        OrderCode: this.queryForm.OrderCode,
        SpreadId: this.spreadId,
        MembAmt: this.queryForm.MembAmt.length ? this.queryForm.MembAmt : -1,
        TeamState: this.queryForm.TeamState,
        OrderType: this.queryForm.OrderType,
        SpreadType: SpreadType.Collage,
        IsDirected: this.queryForm.IsDirected,
        SpreadTitle: this.queryForm.SpreadTitle,
        ProductName: this.queryForm.ProductName,
        CreateTime1: createTime[0],
        CreateTime2: createTime[1],
        State: this.queryForm.State,
        AliasName: this.queryForm.AliasName,
        TrueName: this.queryForm.TrueName,
        Mobile: this.queryForm.Mobile,
        OrderBy: this.orderBy,
        IsAsc: this.isAsc,
        PageIndex: this.queryForm.PageIndex,
        PageSize: this.queryForm.PageSize
      }).then(res => {
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
      SPREAD_API_SPRORDER_RETURNCREATE({
        OrderId: this.creditOrderId,
        Note: this.text
      }).then(res => {
        this.text = ''
        if (res.data.Code === 'CORRECT') {
          this.getAllData()
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
    listenCheckVisible(flg) {
      if (!flg) {
        this.checkVisible = false
      }
    },
    listenPickUpVisible(flg) {
      if (!flg) {
        this.pickUpVisible = false
        this.getAllData()
      }
    },
    listenMailVisible(flg) {
      if (!flg) {
        this.mailVisible = false
        this.getAllData()
      }
    },
    currentChange(val) {
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      this.parameters.PageSize = val
      this.parameters.PageIndex = 1
      this.initRoute()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path, query: JSON.parse(JSON.stringify(Object.assign(this.parameters, {
          spreadId: this.spreadId
        }))) 
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
    pickUp,
    mail
  }
}
</script>
