<template>
  <div class="content">
    <el-alert type="info" :closable="false">
      <slot>
        <div class="alert-info-box">
          <h5>
            <span class="el-button--text" style="font-size:18px;">微信红包开通说明：</span>
            <span>（开通微信红包需要登录微信商户后台操作，按说明完成操作即可在本系统内创建并发放微信红包）</span>
          </h5>
          <h5>1、开通现金红包</h5>
          <p>
            <span>登录微信商户平台 > 产品中心 > 运营工具 > 现金红包 > 开通。登录</span>
            <a class="el-btn-text" target="brank" href="https://pay.weixin.qq.com/index.php/core/home/login?return_url=%2F">微信商户平台。</a>
          </p>
          <h5>2、基本账户充值</h5>
          <p>
            <span>1）进入首页 > 基本账户 > 充值</span>
          </p>
          <p>
            <span>2）若已开通运营账户，则需要运营账户有相应资金。若已开通运营账户，但账户内无资金，则需要给运营账户内转入相应资金即可。（操作： 进入交易中心>资金管理>提现/转出：收款账户选择“运营账户”后完成操作即可)</span>
          </p>
        </div>
      </slot>
    </el-alert>
    <el-form :model="form" ref="search" class="m-t-10">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-button name="btnRedPacketCreate" v-if="!isOneNumberManyShop" type="primary" icon="el-icon-plus" @click="$router.push({path: '/market/redPacket/redPacketCreate'})">新建微信红包</el-button>
          <el-button name="btnSendLog" type="primary" @click="$router.push({path: '/market/sendLog/index'})">发放记录</el-button>
        </el-col>
        <el-col :span="12">
          <el-col :span="8">
            <el-form-item prop="ActivityName">
              <el-input name="btnActivityName" v-model="form.ActivityName" placeholder="活动名称" @keyup.enter.native="search"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="CheckStatus">
              <el-select name="selectCheckStatus" v-model="form.CheckStatus" placeholder="状态">
                <el-option label="全部" :value="0"></el-option>
                <el-option v-for="(item, index) in paymentRedPacketAuditStatus.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button name="btnSearch" type="primary" @click="search">搜索</el-button>
            <el-button name="btnReset" @click="reset">重置</el-button>
          </el-col>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="tableData" v-loading="$store.getters.tb_loading">
      <el-table-column prop="PacketId" label="ID" width="60" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.IsBalanceEnough == YNStatus.No && scope.row.CheckStatus == paymentRedPacketAuditStatus.Audit " class="item" content=" 余额不足，请尽快去微信充值！" placement="bottom">
            <span class="red">{{scope.row.PacketId}}</span>
          </el-tooltip>
          <span v-else>{{scope.row.PacketId}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="GrantStart" label="发放日期" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.IsBalanceEnough == YNStatus.No && scope.row.CheckStatus == paymentRedPacketAuditStatus.Audit" class="item" content=" 余额不足，请尽快去微信充值！" placement="bottom">
            <span class="red">
              {{scope.row.GrantStart | filterDate}} 至 {{scope.row.GrantStop === '2100-01-01 00:00:00'
              ? '不限结束时间'
              : $options.filters.filterDate(scope.row.GrantStop)}}
            </span>
          </el-tooltip>
          <span v-else>
            {{scope.row.GrantStart | filterDate}} 至 {{scope.row.GrantStop === '2100-01-01 00:00:00'
            ? '不限结束时间'
            : $options.filters.filterDate(scope.row.GrantStop)}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="ActivityName" label="活动名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.IsBalanceEnough == YNStatus.No && scope.row.CheckStatus == paymentRedPacketAuditStatus.Audit" class="item" content=" 余额不足，请尽快去微信充值！" placement="bottom">
            <span class="red">{{scope.row.ActivityName}}</span>
          </el-tooltip>
          <span v-else>{{scope.row.ActivityName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Qty" label="红包总数(个)" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.IsBalanceEnough == YNStatus.No && scope.row.CheckStatus == paymentRedPacketAuditStatus.Audit" class="item" content=" 余额不足，请尽快去微信充值！" placement="bottom">
            <span class="red">{{scope.row.Qty}}</span>
          </el-tooltip>
          <span v-else>{{scope.row.Qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Price" label="金额(元)" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.IsBalanceEnough == YNStatus.No && scope.row.CheckStatus == paymentRedPacketAuditStatus.Audit" class="item" content=" 余额不足，请尽快去微信充值！" placement="bottom">
            <span
              class="red"
            >{{paymentRedPacketPriceType.Types[scope.row.PriceType]}} ￥{{scope.row.PriceType == paymentRedPacketPriceType.Fixed ? $root.toFloat(scope.row.Price) : $root.toFloat(scope.row.MinPrice) + ' ~ ￥' + $root.toFloat(scope.row.MaxPrice) }}</span>
          </el-tooltip>
          <span
            v-else
          >{{paymentRedPacketPriceType.Types[scope.row.PriceType]}} ￥{{scope.row.PriceType == paymentRedPacketPriceType.Fixed ? $root.toFloat(scope.row.Price) : $root.toFloat(scope.row.MinPrice) + ' ~ ￥' + $root.toFloat(scope.row.MaxPrice) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="EventType" label="触发事件" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.IsBalanceEnough == YNStatus.No && scope.row.CheckStatus == paymentRedPacketAuditStatus.Audit" class="item" content=" 余额不足，请尽快去微信充值！" placement="bottom">
            <span class="red">{{paymentRedPacketEventType.Types[scope.row.EventType]}}</span>
          </el-tooltip>
          <span v-else>{{paymentRedPacketEventType.Types[scope.row.EventType]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.IsBalanceEnough == YNStatus.No && scope.row.CheckStatus == paymentRedPacketAuditStatus.Audit " class="item" content=" 余额不足，请尽快去微信充值！" placement="bottom">
            <span class="red">{{scope.row.CreateTime | filterDate}}</span>
          </el-tooltip>
          <span v-else>{{scope.row.CreateTime | filterDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="CheckStatus" label="状态" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <span
            v-if="scope.row.CheckStatus == paymentRedPacketAuditStatus.Abandon || scope.row.CheckStatus == paymentRedPacketAuditStatus.Terminal"
            class="red"
          >{{paymentRedPacketAuditStatus.Types[scope.row.CheckStatus]}}</span>
          <span v-else>{{paymentRedPacketAuditStatus.Types[scope.row.CheckStatus]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120">
        <template slot-scope="scope">
          <div v-if="isOneNumberManyShop">
            <el-button name="btnRedPacketCheck" type="text" @click="$router.push({path: '/market/redpacket/redPacketCheck', query:{id: scope.row.PacketId}})">详情</el-button>
          </div>
          <div v-else>
            <el-button name="btnRedPacketChecks" type="text" @click="$router.push({path: '/market/redpacket/redPacketCheck', query:{id: scope.row.PacketId}})">详情</el-button>
            <el-button
              name="btnRedPacketEdit"
              v-if="scope.row.CheckStatus == paymentRedPacketAuditStatus.Origin"
              type="text"
              @click="$router.push({path: '/market/redpacket/redPacketEdit', query:{id: scope.row.PacketId}})"
            >修改</el-button>
            <el-button name="btnAuditRedPacket" v-if="scope.row.CheckStatus == paymentRedPacketAuditStatus.Origin" type="text" @click="auditRedPacket(scope.row)">审核</el-button>
            <el-button name="btnStopSend" v-if="scope.row.CheckStatus == paymentRedPacketAuditStatus.Audit" type="text" @click="stopSend(scope.row)">终止发放</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- @module Dialog·审核 -->
    <redPacketAudit title="审核" v-if="auditDialog" :auditDialog="auditDialog" :data="selection" @listenAuditDialog="listenAuditDialog"></redPacketAudit>
    <!-- End Dialog·审核 -->
  </div>
</template>
<script>
import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'
import redPacketAudit from './redPacketAudit.vue'

import {
  YNStatus
} from '@/enums/common.js'
import {
  PaymentRedPacketAuditStatus,
  PaymentRedPacketEventType,
  PaymentRedPacketPriceType
} from '@/enums/payment'
import {
  PAYMENT_API_RED_PACKET_BASIC_GETS,
  PAYMENT_API_RED_PACKET_BASIC_TERMINAL
} from '@/apis/payment1.js'

export default {
  components: {
    pagination,
    searchPanel,
    redPacketAudit
  },
  data() {
    return {
      YNStatus,
      paymentRedPacketAuditStatus: PaymentRedPacketAuditStatus,
      paymentRedPacketEventType: PaymentRedPacketEventType,
      paymentRedPacketPriceType: PaymentRedPacketPriceType,
      form: {
        ActivityName: '',
        CheckStatus: 0,
        IsAsced: YNStatus.No,
        OrderBy: 0,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      parameter: {
      },
      tableData: [],
      selection: {},
      auditDialog: false
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  methods: {
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      PAYMENT_API_RED_PACKET_BASIC_GETS(this.parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.total = res.data.Data.Count
          this.tableData = res.data.Data.Rows
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    init() {
      let query = this.$route.query
      this.form.ActivityName = query.ActivityName || ''
      this.form.CheckStatus = parseInt(query.CheckStatus || '0')
      this.form.PageIndex = query.PageIndex || 1
      this.form.PageSize = query.PageSize || 20
      this.parameter = {
        ...this.form
      }
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: '/market/redPacket/index',
        query: this.parameter
      })
    },
    search() {
      this.form.PageIndex = 1
      this.parameter = {
        ...this.form
      }
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    reset() {
      this.$refs['search'].resetFields()
      this.search()
    },
    currentChange(val) {
      this.parameter.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      this.parameter.PageIndex = 1
      this.parameter.PageSize = val
      this.initRoute()
    },
    auditRedPacket(row) {
      this.selection = row
      this.auditDialog = true
    },
    listenAuditDialog() {
      this.selection = {}
      this.getData()
      this.auditDialog = false
    },
    stopSend(row) {
      this.$confirm('终止发放后，红包将停止发放，确定要终止吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          PAYMENT_API_RED_PACKET_BASIC_TERMINAL({
            PacketId: row.PacketId,
            CheckNote: ''
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                type: 'success',
                message: '已终止发放'
              })
              this.search()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消终止发放'
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.alert-info-box {
  h5 {
    line-height: 24px;
    font-size: 14px;
  }
  p {
    text-indent: 2em;
  }
}
</style>
