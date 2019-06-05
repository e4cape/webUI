<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <div class="title">查看订单</div>
      </div>
      <div class="panel-bd">
      <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
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
        <el-table-column prop="TeamState" label="拼团状态" show-overflow-tooltip width="120">
          <template slot-scope="scope"><!--订单状态已取消的不显示拼团状态-->
            {{scope.row.State == spreadSaleOrderBasicState.Cancel ? '' : collageTeamState.Types[scope.row.TeamState]}}
          </template>
        </el-table-column>
        <el-table-column prop="Note" label="备注" show-overflow-tooltip width="120"></el-table-column>
        <el-table-column label="操作" min-width="200" fixed="right">
          <template slot-scope="scope">
            <el-button name="btnCheck" type="text" @click="check(scope.row)">详情</el-button>
            <template v-if="$store.getters.user_session.CharacterType == characterType.Store">
              <el-button name="btnpickUp" v-if="scope.row.TeamState == collageTeamState.Succeed && scope.row.State === spreadSaleOrderBasicState.WaitShip && scope.row.ReturnState == spreadSaleOrderBasicReturnState.None" type="text" @click="pickUp(scope.row.OrderId)">提货</el-button>
              <el-button name="btnMail" v-if="scope.row.TeamState == collageTeamState.Succeed && scope.row.State === spreadSaleOrderBasicState.WaitShip && scope.row.ReturnState == spreadSaleOrderBasicReturnState.None" type="text" @click="mail(scope.row.OrderId)">邮寄</el-button>
              <el-button name="btnCheckReason" v-if="scope.row.ReturnState == spreadSaleOrderBasicReturnState.Returned" type="text" @click="checkReason(scope.row.OrderId)">查看原因</el-button>
              <el-button name="btnCheckMail" v-if="scope.row.ShippingType === shippingType.Express && (!scope.row.ShipCharacterId || scope.row.ShipCharacterId === $store.getters.user_session.CharacterId)" type="text" @click="checkMail(scope.row)">查看物流</el-button>
              <el-button name="btnCreditOrder" v-if="(scope.row.TeamState == collageTeamState.Succeed || scope.row.IsDirected === yNStatus.Yes) && scope.row.ReturnState == spreadSaleOrderBasicReturnState.None && scope.row.State >= spreadSaleOrderBasicState.WaitShip && (!scope.row.ShipCharacterId || scope.row.ShipCharacterId === $store.getters.user_session.CharacterId)" type="text" @click="creditOrder(scope.row.OrderId)">
                创建退款单
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    <!-- end Table -->
    <!-- 分页 -->
    <div class="p10">
      <pagination :pg="pg" :size="size" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </div>
    <!-- 分页 end -->
    </div>
  </div>
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
  SpreadSaleOrderBasicState,
  SpreadType,
  SaleOrderBasicReturnState,
  ExpressType,
  SpreadSaleOrderBasicReturnState,
  ShippingType,
  CollageTeamState,
  PickType,
  SpreadSaleOrderBasicOrderType
} from '@/enums/spread'
import { YNStatus, CharacterType } from '@/enums/common'
import {
  SPREAD_API_SPRORDER_SEARCH,
  SPREAD_API_SPRORDER_RETURNCREATE,
  SPREAD_API_SPRORDER_SEARCHREASON,
  SPREAD_API_SPRORDER_CHECKCOUPON
} from '@/apis/spread'
export default {
  data() {
    return {
      yNStatus: YNStatus,
      pickType: PickType,
      characterType: CharacterType,
      spreadType: SpreadType,
      shippingType: ShippingType,
      collageTeamState: CollageTeamState,
      spreadSaleOrderBasicState: SpreadSaleOrderBasicState,
      spreadSaleOrderBasicReturnState: SpreadSaleOrderBasicReturnState,
      spreadSaleOrderBasicOrderType: SpreadSaleOrderBasicOrderType,
      spreadId: '',
      checkVisible: false,
      pickUpVisible: false,
      mailVisible: false,
      creditOrderVisible: false,
      reasonVisible: false,
      reasons: '',
      creditOrderId: '',
      checkId: '',
      pickUpId: '',
      mailId: '',
      returnId: '',
      teamId: '',
      queryForm: {
        OrderId: '',
        OrderCode: '',
        OrderType: '',
        SpreadTitle: '',
        ProductId: '',
        ProductName: '',
        CreateTime: '',
        State: 0,
        AliasName: '',
        TrueName: '',
        Mobile: '',
        IsDirected: 0
      },
      data: [],
      pg: 1,
      size: 10,
      total: 0
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.pg = parseInt(query.pg) || 1
      this.spreadId = query.spreadId
      this.teamId = query.teamId
      this.size = parseInt(query.size) || 20
      this.getData()
    },
    getData() {
      let createTime = this.queryForm.CreateTime || [
        '1900-01-01 0:00:00',
        '1900-01-01 0:00:00'
      ]
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_SPRORDER_SEARCH({
        OrderId: this.queryForm.OrderId,
        OrderCode: this.queryForm.OrderCode,
        SpreadId: this.spreadId,
        MembAmt: -1,
        SpreadType: SpreadType.Collage,
        IsDirected: this.queryForm.IsDirected,
        SpreadTitle: this.queryForm.SpreadTitle,
        ProductName: this.queryForm.ProductName,
        TeamId: this.teamId,
        CreateTime1: createTime[0],
        CreateTime2: createTime[1],
        State: this.queryForm.State,
        AliasName: this.queryForm.AliasName,
        TrueName: this.queryForm.TrueName,
        Mobile: this.queryForm.Mobile,
        OrderBy: this.orderBy,
        IsAsc: this.isAsc,
        PageIndex: this.pg,
        PageSize: this.size
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows
          this.total = res.data.Data.total
        } else {
          this.$message.error(res.data.Message)
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
    currentChange(val) {
      this.pg = val
      this.getData()
    },
    sizeChange(val) {
      if (val != this.size) {
        this.size = val
        this.pg = 1
        this.getData()
      }
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
        this.getData()
      }
    },
    listenMailVisible(flg) {
      if (!flg) {
        this.mailVisible = false
        this.getData()
      }
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
<style lang="scss">
</style>

