<template>
  <div class="content">
    <div class="panel">
      <div class="panel-hd">
        <div class="title">基本信息</div>
      </div>
      <div class="panel-bd">
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">ID：</td>
                <td>{{detail.PacketId}}</td>
              </tr>
              <tr>
                <td class="tit">发放日期：</td>
                <td>{{detail.GrantStart | filterDate1}} 至 {{detail.GrantStop | filterDate1}}</td>
              </tr>
              <tr>
                <td class="tit">活动名称：</td>
                <td>{{detail.ActivityName}}</td>
              </tr>
              <tr>
                <td class="tit">祝福语：</td>
                <td>{{detail.Blessings}}</td>
              </tr>
              <tr>
                <td class="tit">红包总数(个)：</td>
                <td>{{detail.Qty}}</td>
              </tr>
              <tr>
                <td class="tit">金额(元)：</td>
                <td>
                  <span v-if="detail.PriceType == paymentRedPacketPriceType.Fixed">固定金额：￥{{$root.toFloat(detail.Price)}}</span>
                  <span v-else>随机金额：￥{{$root.toFloat(detail.MinPrice)}} ~ ￥{{$root.toFloat(detail.MaxPrice)}}</span>
                </td>
              </tr>
              <tr>
                <td class="tit">备注：</td>
                <td>{{detail.Note}}</td>
              </tr>
              <tr>
                <td class="tit">触发事件：</td>
                <td>
                  <div>触发事件：{{paymentRedPacketEventType.Types[detail.EventType]}}</div>
                  <div v-if="detail.EventType === paymentRedPacketEventType.Buy">
                    <div>
                      <span>消费材质：</span>
                      <span>{{detail.MaterialTypesText || '-'}}</span>
                    </div>
                    <div>
                      <span>消费金额：</span>
                      <span v-if="detail.CashType == paymentRedPacketOrderCashType.CashPrice">消费满: ￥{{$root.toFloat(detail.CashPrice)}}</span>
                      <span v-else>{{paymentRedPacketOrderCashType.Types[detail.CashType]}}</span>
                    </div>
                    <div>
                      <span>单据来源：</span>
                      <span>{{detail.TerminalTypesText || '-'}}</span>
                    </div>
                    <div>
                      <span>补录发放设置：</span>
                      <span>{{detail.IsSend == YNStatus.No ? '不发放红包' : '发放红包'}}</span>
                    </div>
                  </div>
                  <table class="m-10 w90" cellpadding="0" cellspacing="0" v-else-if="detail.EventType === paymentRedPacketEventType.Included && eventTableList.length">
                    <tbody>
                      <tr>
                        <td class="tit">卡券ID</td>
                        <td class="tit">卡券名称</td>
                        <td class="tit">卡券面额</td>
                        <td class="tit">赠送规则</td>
                        <td class="tit">投放时间</td>
                        <td class="tit">审核状态</td>
                      </tr>
                      <tr v-for="(item, index) in eventTableList" :key="index">
                        <td>{{item.CouponId}}</td>
                        <td>{{item.CouponName}}</td>
                        <td>{{$root.toFloat(item.Price)}}</td>
                        <td>{{eventType.Types[item.EventType]}}</td>
                        <td>{{item.Expireb | filterDate1}} - {{item.Expiree | filterDate1}}</td>
                        <td>{{ couponAuditStatus.Types[item.CheckStatus]}}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-else-if="detail.EventType === paymentRedPacketEventType.Scan && detail.CheckStatus == paymentRedPacketAuditStatus.Audit">
                    <p>
                      <img ref="qrCode" style="max-width:300px;" :src="detail.QrcodeUrl && ('data:image/jpeg;base64,'+ detail.QrcodeUrl)">
                    </p>
                    <el-button name="btnDownloadImage" type="primary" @click="downloadImage">下载二维码</el-button>
                    <a ref="download"></a>
                    <p>请下载二维码并置于店内引导客户扫码领红包！</p>
                  </div>
                  <!-- <div v-else>
                    {{paymentRedPacketEventType.Types[detail.EventType]}}
                  </div>-->
                </td>
              </tr>
              <tr>
                <td class="tit">创建时间：</td>
                <td>{{detail.CreateTime}}</td>
              </tr>
              <tr>
                <td class="tit">创建人：</td>
                <td>{{detail.CreateUser}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="details-info-table">
          <table cellpadding="0" cellspacing="0">
            <tbody>
              <tr>
                <td class="tit">状态：</td>
                <td>
                  {{paymentRedPacketAuditStatus.Types[detail.CheckStatus]}}
                  <span class="red" v-if="detail.CheckStatus == paymentRedPacketAuditStatus.Abandon">（{{detail.CheckNote}}）</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel-hd">
        <div class="title">发放记录</div>
      </div>
      <div class="panel-bd">
        <el-form :model="form" label-width="80px" class="m-t-10">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-col :span="19">
                <el-col :span="6">
                  <el-form-item label="发放时间" prop="CreateTime" style="width:100%;" name="datePickerCreateTime">
                    <el-date-picker style="width:100%;" v-model="form.CreateTime" :unlink-panels="true" type="daterange" :picker-options="$root.datePickerOptions"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="微信昵称" prop="AliasName">
                    <el-input name="inputAliasName" v-model="form.AliasName" placeholder="微信昵称" @keyup.enter.native="search"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="红包状态" prop="Status">
                    <el-select name="selectStatus" v-model="form.Status">
                      <el-option :value="0" label="所有状态"></el-option>
                      <el-option v-for="(item, index) in paymentRedPacketStatus.Types" :key="index" :label="item" :value="index"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="$store.getters.user_session.CharacterType === characterTypes.Company">
                  <el-form-item label="领取门店" prop="characterId">
                    <el-select name="selectCharacterId" v-model="form.CharacterId">
                      <el-option :value="0" label="所有门店"></el-option>
                      <el-option v-for="item in storeList" :key="item.CharacterId" :value="item.CharacterId" :label="item.Value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="5">
                <el-button name="btnSearch" type="primary" @click="search">搜索</el-button>
                <el-button name="btnReset" @click="reset">重置</el-button>
                <el-button name="btnExportData" type="text" @click="exportData">导出Excel</el-button>
              </el-col>
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="sendLogList">
          <el-table-column prop="CreateTime" label="发放时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="AliasName" label="微信昵称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Price" label="红包金额（元）" show-overflow-tooltip>
            <template slot-scope="scope">{{$root.toFloat(scope.row.Price)}}</template>
          </el-table-column>
          <el-table-column prop="Status" label="红包状态" show-overflow-tooltip>
            <template slot-scope="scope">{{paymentRedPacketStatus.Types[scope.row.Status]}}</template>
          </el-table-column>
          <el-table-column prop="ReceiveTime" label="领取时间" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.ReceiveTime | filterDateMinutes}}</template>
          </el-table-column>
          <el-table-column v-if="$store.getters.user_session.CharacterType === characterTypes.Company" prop="StoreName" label="领取门店" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.StoreName || '无'}}</template>
          </el-table-column>
          <el-table-column prop="Note" label="备注" show-overflow-tooltip></el-table-column>
          <el-table-column prop="State" label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button
                name="btnSendAgain"
                type="text"
                v-if="scope.row.Status == paymentRedPacketStatus.Error && scope.row.Code == 'ERROR' && !isOneNumberManyShop"
                @click="sendAgain(scope.row)"
              >重新发送</el-button>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="pageInfo.total" :pg="pageInfo.PageIndex" :size="pageInfo.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  CouponAuditStatus,
  EventType
} from '@/enums/scoring'
import {
  PaymentRedPacketStatus,
  PaymentRedPacketOrderSourceType,
  PaymentRedPacketOrderCashType,
  PaymentRedPacketAuditStatus,
  PaymentRedPacketEventType,
  PaymentRedPacketPriceType
} from '@/enums/payment'
import { CharacterType, YNStatus } from '@/enums/common.js'
import {
  PAYMENT_API_RED_PACKET_BASIC_GET,
  PAYMENT_API_RED_PACKET_ITEM_GETS,
  PAYMENT_API_RED_PACKET_ITEM_ITEMEXPORT,
  PAYMENT_API_RED_PACKET_ITEM_RETRY
} from '@/apis/payment1'
import { SCORING_API_COUPON_BASIC_GETS } from '@/apis/scoring'
import { MERCHANT_API_DROPDOWN_STORELIST } from '@/apis/merchant'

import pagination from '@/components/pagination.vue'

export default {
  data () {
    return {
      YNStatus,
      paymentRedPacketAuditStatus: PaymentRedPacketAuditStatus,
      paymentRedPacketStatus: PaymentRedPacketStatus,
      couponAuditStatus: CouponAuditStatus,
      paymentRedPacketEventType: PaymentRedPacketEventType,
      paymentRedPacketOrderSourceType: PaymentRedPacketOrderSourceType,
      paymentRedPacketOrderCashType: PaymentRedPacketOrderCashType,
      eventType: EventType,
      paymentRedPacketPriceType: PaymentRedPacketPriceType,
      characterTypes: CharacterType,
      packetId: '',
      total: 0,
      pageIndex: 1,
      pageSize: '20',
      eventTableList: [],
      storeList: [],
      sendLogList: [],
      detail: {
        CashPrice: 0,
        Price: 0,
        MinPrice: 0,
        MaxPrice: 0,
        MaterialTypesText: '',
        TerminalTypesText: ''
      },
      form: {
        CharacterId: 0,
        PacketId: '',
        StoreName: '',
        ActivityName: '',
        CreateTime: [],
        CreateTime1: '',
        CreateTime2: '',
        AliasName: '',
        Status: '',
        PageIndex: '1',
        PageSize: '20'
      },
      pageInfo: {
        PageIndex: 1,
        PageSize: 20,
        total: 0
      },
      parameter: {}
    }
  },
  created () {
    this.getStoreList()
  },
  beforeMount () {
    this.packetId = this.$route.query.id || ''
    if (!this.packetId) {
      this.dataError()
    }
  },
  mounted () {
    this.$store.dispatch('GET_MATERIAL_TYPE').then(() => {
      this.getDetail()
      this.getData()
    })
  },
  methods: {
    getStoreList () {
      MERCHANT_API_DROPDOWN_STORELIST().then(res => {
        if (res.data.Code == 'CORRECT') {
          this.storeList = res.data.Data.Rows
        }
      })
    },
    dataError (msg) {
      this.$confirm(msg || '数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    },
    getDetail () {
      PAYMENT_API_RED_PACKET_BASIC_GET({
        PacketId: this.packetId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
          res.data.Data.CouponIds.split(',').forEach(res => {
            this.getEventTableItem(res)
          })
          this.detail.MaterialTypesText = this.detail.MaterialTypes.split(',').map(m => this.$store.getters.materialType.Types[m]).join('，')
          this.detail.TerminalTypesText = this.detail.TerminalTypes.split(',').map(m => this.paymentRedPacketOrderSourceType.Types[m]).join('，')
        }
      })
    },
    getData () {
      var storeName = this.storeList.filter((res) => {
        return res.CharacterId == this.form.CharacterId
      })
      var params = {
        CharacterId: this.form.CharacterId,
        PacketId: this.packetId,
        ActivityName: '',
        CreateTime1: this.form.CreateTime[0] || '',
        CreateTime2: this.form.CreateTime[1] || '',
        AliasName: this.form.AliasName,
        Status: this.form.Status,
        OrderBy: 0,
        IsAsced: this.YNStatus.No,
        PageIndex: this.pageInfo.PageIndex,
        PageSize: this.pageInfo.PageSize,
        StoreName: storeName.length ? storeName[0]['Value'] : ''
      }
      PAYMENT_API_RED_PACKET_ITEM_GETS(params).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.sendLogList = res.data.Data.Rows
          this.pageInfo.total = res.data.Data.Count
        }
      })
    },
    search () {
      this.pageInfo.PageIndex = 1
      this.parameter = Object.assign({}, this.parameter, this.form)
      this.getData()
    },
    reset () {
      this.form = {
        CharacterId: 0,
        PacketId: this.packetId,
        ActivityName: '',
        StoreName: '',
        CreateTime: [],
        CreateTime1: '',
        CreateTime2: '',
        AliasName: '',
        Status: ''
      }
      this.pageInfo = {
        PageIndex: 1,
        PageSize: 20,
        total: 0
      }
      this.parameter = Object.assign({}, this.parameter, this.form)
      this.getData()
    },
    currentChange (val) {
      this.pageInfo.PageIndex = val
      if (JSON.stringify(this.parameter) === '{}') {
        this.form = {
          CharacterId: '',
          PacketId: this.packetId,
          ActivityName: '',
          StoreName: '',
          CreateTime: [],
          CreateTime1: '',
          CreateTime2: '',
          AliasName: '',
          Status: ''
        }
      } else {
        this.form = Object.assign({}, this.form, this.parameter)
      }
      this.getData()
    },
    sizeChange (val) {
      if (this.pageInfo.PageSize != val) {
        this.pageInfo.PageIndex = 1
        this.pageInfo.PageSize = val
        if (JSON.stringify(this.parameter) === '{}') {
          this.form = {
            CharacterId: '',
            PacketId: this.packetId,
            ActivityName: '',
            StoreName: '',
            CreateTime: [],
            CreateTime1: '',
            CreateTime2: '',
            AliasName: '',
            Status: ''
          }
        } else {
          this.form = Object.assign({}, this.form, this.parameter)
        }
      }
      this.getData()
    },
    getEventTableItem (id) {
      SCORING_API_COUPON_BASIC_GETS({
        couponSaleType: 0,
        characterId: '',
        CheckStatus: this.couponAuditStatus.Audit,
        CouponId: id,
        CouponName: '',
        CouponType: 1,
        EventType: this.eventType.Included,
        Expireb: '',
        Expiree: '',
        pageIndex: 1,
        pageSize: 1000
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data.Rows > 0) {
            this.eventTableList.push(res.data.Data.Rows[0])
          }
        }
      })
    },
    downloadImage () {
      let canvas = document.createElement('canvas')
      canvas.width = this.$refs.qrCode.width
      canvas.height = this.$refs.qrCode.height
      canvas.getContext('2d').drawImage(this.$refs.qrCode, 0, 0)
      this.$refs.download.href = canvas.toDataURL('image/png')
      this.$refs.download.download = 'qrCode.png'
      this.$refs.download.click()
    },
    exportData () {
      this.$store.commit('SET_FULL_LOADING', true)
      PAYMENT_API_RED_PACKET_ITEM_ITEMEXPORT({
        PacketId: this.packetId,
        ActivityName: this.form.ActivityName,
        CharacterId: this.form.CharacterId,
        CreateTime1: this.form.CreateTime[0] || '',
        CreateTime2: this.form.CreateTime[1] || '',
        AliasName: '',
        Status: this.form.Status,
        PageIndex: '1',
        PageSize: '20'
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          window.open(res.data.Data.FilePath)
          this.$message.success('导出Excel成功')
        }
      })
      this.$store.commit('SET_FULL_LOADING', false)
    },
    sendAgain (row) {
      this.$confirm(
        '确定要重新发送红包吗！ 重发前，请确认微信帐户有足够的余额！',
        '重新发送红包',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          PAYMENT_API_RED_PACKET_ITEM_RETRY({
            ItemId: row.ItemId
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success(res.data.Message)
              this.getData()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消重新发放!'
          })
        })
    }
  },
  filters: {
    filterDate1: function (value) {
      return !value ||
        value === '1900-01-01 00:00:00' ||
        value === '1900-01-01 23:59:59' ||
        value === '9999-12-31 00:00:00' ||
        value === '9999-12-31 23:59:59'
        ? '-'
        : value === '2100-01-01 00:00:00'
          ? '不限结束时间'
          : value.substring(0, value.length - 9).replace(/\//g, '-')
    }
  },
  components: {
    pagination
  }
}
</script>

<style lang="scss">
.tit {
  max-width: 25% !important;
}
.w90 {
  width: 95% !important;
}
</style>
