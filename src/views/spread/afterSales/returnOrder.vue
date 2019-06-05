<template>
  <div class="content">
    <el-form :model="queryForm" label-position="right" label-width="100px" :inline="true" class="item-lh-26 p10">
      <el-row class="search-box no-border" type="flex">
        <el-col>
          <el-form-item label="创建时间：">
            <el-date-picker name="CreateTime" :picker-options="$root.datePickerOptions" :unlink-panels="true" type="daterange" v-model="queryForm.CreateTime"  ></el-date-picker>
          </el-form-item>
          <el-form-item label="退款单号：">
            <el-input name="ReturnCode" :maxlength="50" v-model="queryForm.ReturnCode" @keyup.enter.native="returnGoodsSearch"></el-input>
          </el-form-item>
          <el-form-item label="订单号：">
            <el-input name="OrderCode" :maxlength="50" v-model="queryForm.OrderCode" @keyup.enter.native="returnGoodsSearch"></el-input>
          </el-form-item>
          <el-form-item label="商品编码：">
            <el-input name="ProductId" :maxlength="50" v-model="queryForm.ProductId" @keyup.native="queryForm.ProductId = $root.toFixed(queryForm.ProductId, 0)" @keyup.enter.native="returnGoodsSearch"></el-input>
          </el-form-item>
          <el-form-item label="商品名称：">
            <el-input name="ProductName" :maxlength="50" v-model="queryForm.ProductName" @keyup.enter.native="returnGoodsSearch"></el-input>
          </el-form-item>
          <el-form-item label="会员ID：">
            <el-input name="MemberId" :maxlength="50" v-model="queryForm.MemberId" @keyup.enter.native="returnGoodsSearch"></el-input>
          </el-form-item>
          <el-form-item label="状态：">
            <el-select name="State" placeholder="全部" v-model="queryForm.State" :filterable="true">
              <el-option label="全部" :value="'0'"></el-option>
              <el-option v-for="(item,index) in spreadReturnOrderBasicState.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单来源：">
            <el-input name="SpreadTitle" :maxlength="50" v-model="queryForm.SpreadTitle" @keyup.enter.native="returnGoodsSearch"></el-input>
          </el-form-item>
        </el-col>
        <el-col class="search-btn">
          <el-button name="btnSearch" type="primary" @click="returnGoodsSearch">搜索</el-button>
          <el-button name="btnReset" @click="onReset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- END 搜索条件 -->
    <div class="p10"></div>
    <!-- Data Table -->
    <el-table class="tabs-tb" :data="returnGoodsData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="CreateTime" label="创建时间"  show-overflow-tooltip width="90" fixed>
        <template slot-scope="scope">{{scope.row.CreateTime | filterDateMinutes}}</template>
      </el-table-column>
      <el-table-column prop="ReturnCode" label="退款单号" width="156" show-overflow-tooltip></el-table-column>
      <el-table-column prop="OrderCode" label="订单号" width="156" show-overflow-tooltip></el-table-column>
      <el-table-column prop="MemberId" label="会员ID" min-width="180" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ProductId" label="商品编码" show-overflow-tooltip width="68"></el-table-column>
      <el-table-column prop="ProductName" label="商品名称" show-overflow-tooltip width="68"></el-table-column>
      <el-table-column prop="OrderPrice" label="订单金额" show-overflow-tooltip width="68">
        <template slot-scope="scope">
          ￥{{scope.row.OrderPrice}}
        </template>
      </el-table-column>
      <el-table-column prop="PaymentType" label="支付方式" show-overflow-tooltip width="68">
        <template slot-scope="scope">
          {{paymentType.Types[scope.row.PaymentType]}}
        </template>
      </el-table-column>
      <el-table-column prop="OrderPrice" label="应退金额" show-overflow-tooltip width="68">
        <template slot-scope="scope">
          ￥{{scope.row.OrderPrice}}
        </template>
      </el-table-column>
      <el-table-column prop="ReturnPrice" label="实退金额" show-overflow-tooltip width="68">
        <template slot-scope="scope">
          ￥{{scope.row.ReturnPrice}}
        </template>
      </el-table-column>
      <el-table-column prop="CreateUser" label="创建人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="SpreadTitle" label="订单来源" show-overflow-tooltip width="68"></el-table-column>
      <el-table-column prop="State" label="状态" show-overflow-tooltip width="68" fixed="right">
        <template slot-scope="scope">
          {{spreadReturnOrderBasicState.Types[scope.row.State]}}
        </template>
      </el-table-column>
      <el-table-column prop="Note" label="备注" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button name="btnDetail" type="text" @click="check(scope.row)">详情</el-button>
          <el-button name="btnAudit" type="text" v-if="scope.row.State === spreadReturnOrderBasicState.Wait && (!scope.row.ShipCharacterId || scope.row.ShipCharacterId === $store.getters.user_session.CharacterId)" @click="auditReturn(scope.row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- end Table -->
    <!-- 分页 -->
    <div class="p10">
      <pagination1 :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="returnGoodsPageChange" @sizeChange="returnGoodsPageSizeChange"></pagination1>
    </div>

    <return-check v-if="checkVisible" :returnId="returnId" :checkId="checkId" :checkVisible="checkVisible" @listenCheckVisible="listenCheckVisible"></return-check>

    <!-- @module Dialog·审核 -->
    <return-audit title="审核" v-if="auditDialog" :auditDialog="auditDialog" :data="selection" @listenAuditDialog="listenAuditDialog"></return-audit>
    <!-- End Dialog·审核 -->
  </div>
</template>

<script>
import pagination1 from '@/components/pagination'
import returnCheck from './returnCheck'
import returnAudit from './returnAudit'
import {
  RefundType, SpreadReturnOrderBasicState, PaymentType, CollageTeamState
} from '@/enums/spread'
import { CharacterType } from '@/enums/common.js'
import { YNStatus } from '@/enums/common'
import {
  SPREAD_API_SPR_SETTINGDETAIL, SPREAD_API_SPR_SETTINGUPDATE, SPREAD_API_SPRORDER_RETURNLIST
} from '@/apis/spread'
export default {
  data () {
    return {
      paymentType: PaymentType,
      spreadReturnOrderBasicState: SpreadReturnOrderBasicState,
      refundTypes: RefundType,
      collageTeamState: CollageTeamState,
      characterType: CharacterType,
      returnType: RefundType.Auto,
      editFlg: true,
      auditDialog: false,
      total: 0,
      queryForm: {
        ReturnCode: '',
        OrderCode: '',
        ProductId: '',
        ProductName: '',
        MemberId: '',
        SpreadTitle: '',
        State: '0',
        CreateTime: '',
        orderBy: 0,
        IsAsc: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      parameters: {
      },
      selection: {
      },
      checkId: '',
      returnId: '',
      checkVisible: false,
      returnGoodsData: []
    }
  },
  methods: {
    init () {
      let query = JSON.parse(JSON.stringify(this.$route.query || {
      }))
      this.queryForm = Object.assign(this.queryForm, {
        ReturnCode: '',
        OrderCode: '',
        ProductId: '',
        ProductName: '',
        MemberId: '',
        SpreadTitle: '',
        State: '0',
        CreateTime: '',
        orderBy: 0,
        IsAsc: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }, query)
      this.getData()
    },
    returnGoodsSearch () {
      this.queryForm.PageIndex = 1
      this.parameters = Object.assign({
      }, this.queryForm)
      this.initRoute()
    },
    onReset () {
      this.queryForm = {
        ReturnCode: '',
        OrderCode: '',
        ProductId: '',
        ProductName: '',
        MemberId: '',
        SpreadTitle: '',
        State: '0',
        CreateTime: '',
        orderBy: 0,
        IsAsc: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }
      this.parameters = Object.assign({
      }, this.queryForm)
      this.initRoute()
    },
    getSettingDetail () {
      SPREAD_API_SPR_SETTINGDETAIL().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.returnType = res.data.Data.RefundType
        }
      })
    },
    saveReturnSetter () {
      this.$store.commit('SET_BTN_LOADING', true)
      SPREAD_API_SPR_SETTINGUPDATE(this.returnType).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.getSettingDetail()
          this.editFlg = true
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getData () {
      let ProductId = this.$root.toFixed(this.queryForm.ProductId, 0)
      if (ProductId && this.queryForm.ProductId !== ProductId) {
        this.$message.error('请输入正确的商品编号')
        return false
      }
      let createTime = this.queryForm.CreateTime || ['1900-01-01 0:00:00', '1900-01-01 0:00:00']
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_SPRORDER_RETURNLIST({
        ReturnCode: this.queryForm.ReturnCode,
        OrderCode: this.queryForm.OrderCode,
        ProductId: this.queryForm.ProductId,
        ProductName: this.queryForm.ProductName,
        MemberId: this.queryForm.MemberId,
        SpreadTitle: this.queryForm.SpreadTitle,
        State: this.queryForm.State,
        CreateTime1: createTime[0],
        CreateTime2: createTime[1],
        OrderBy: this.queryForm.OrderBy,
        IsAsc: this.queryForm.IsAsc,
        PageIndex: this.queryForm.PageIndex,
        PageSize: this.queryForm.PageSize
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.returnGoodsData = res.data.Data.rows
          this.total = res.data.Data.total
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    check (row) {
      this.checkId = row.OrderId
      this.returnId = row.ReturnId
      this.checkVisible = true
    },
    auditReturn (row) {
      this.selection = row
      this.auditDialog = true
    },
    listenCheckVisible (flg) {
      if (!flg) {
        this.checkVisible = false
      }
    },
    listenAuditDialog () {
      this.selection = []
      this.getData()
      this.auditDialog = false
    },
    returnGoodsPageChange (val) {
      this.parameters.PageIndex = val
      this.initRoute()
    },
    returnGoodsPageSizeChange (val) {
      if (this.queryForm.PageSize !== val) {
        this.parameters.PageSize = val
        this.parameters.PageIndex = 1
        this.initRoute()
      }
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path, query: JSON.parse(JSON.stringify(this.parameters)) 
      })
    }
  },
  mounted () {
    this.init()
    this.getSettingDetail()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination1,
    returnCheck,
    returnAudit
  }
}
</script>
<style lang="scss">
.return-setter {
  padding: 20px; 
  text-align: left;
}
</style>
