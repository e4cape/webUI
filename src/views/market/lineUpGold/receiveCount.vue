<template>
  <div>
    <header v-loading="detailLoading">
      <el-row :gutter="10" type="flex">
        <el-col :span="8" tag="div" class="head-item">
          <p>{{$root.toFloat(detail.ValidGram,3)}}g</p>
          <p>当前奖金池</p>
        </el-col>
        <el-col :span="8" tag="div" class="head-item">
          <p>{{$root.toFloat(detail.GrantGram||0,3)}}g</p>
          <p>累计发放黄金</p>
        </el-col>
        <el-col :span="8" tag="div" class="head-item">
          <p>{{$root.toFloat(detail.GrantTotalGram||0,3)}}g</p>
          <p>预计总赠送黄金</p>
        </el-col>
      </el-row>
      <div class="m-y-10 tab">
        <el-radio-group name="radioGroupStatus" v-model="form.Status" size="small" @change="search">
          <el-radio-button v-for="(value, key) in QueueReceiveGoldItemStatus.Types" :key="key" :label="parseInt(key)">
            <i :class="{'icon-head':parseInt(key) === QueueReceiveGoldItemStatus.NotReceive, 'icon-correct': parseInt(key) === QueueReceiveGoldItemStatus.Receive}"></i>
            <span>{{key==QueueReceiveGoldItemStatus.NotReceive? value+`(${detail.NotReceiveQry})`:value + `(${detail.ReceiveQry})`}}</span>
          </el-radio-button>
          <el-radio-button :label="0">
            <i class="icon-people"></i>
            <span>总参与({{detail.NotReceiveQry + detail.ReceiveQry}})</span>
          </el-radio-button>
        </el-radio-group>
      </div>
    </header>
    <el-form inline :model="form" v-if="form.Status === 0" ref="search" class="item-lh-26" @keyup.enter.native="search">
      <div class="flex-box search-box no-border no-padding">
        <div class="search-form">
          <el-form-item name="datePickerOrderTimeRange" label="消费时间">
            <el-date-picker
              v-model="form.orderTimeRange"
              @change="hanldeOrderTime"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickrOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
            <el-tooltip effect="light" content="可查询指定时间段参与活动的客户" placement="bottom-start">
              <i class="el-icon-question icon"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item name="datePickerReceiveTimeRange" label="领取时间">
            <el-date-picker
              v-model="form.receiveTimeRange"
              @change="hanldeReceiveTime"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickrOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
            <el-tooltip effect="light" content="可查询指定时间段已领取的客户" placement="bottom-start">
              <i class="el-icon-question icon"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="form.AliasName"></el-input>
          </el-form-item>
        </div>
        <div class="search-btn">
          <el-button name="btnSearch" type="primary" @click="search">搜索</el-button>
          <el-button ame="btnExportList" type="info" @click="exportList">导出Excel</el-button>
        </div>
      </div>
    </el-form>
    <el-table :data="tableData" v-loading="tableLoading">
      <el-table-column prop="AliasName" label="会员信息" min-width="200" class-name="member-info" fixed show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="member-box">
            <i v-if="scope.row.PRanking === 0 && scope.row.Status!==QueueReceiveGoldItemStatus.Receive && scope.row.OrderStatus === QueueReceiveGoldOrderStatus.Audit" class="receiving">正在领取</i>
            <i
              v-if="scope.row.Status == QueueReceiveGoldItemStatus.NotReceive &&(detail.CheckStatus == QueueReceiveGoldStatus.End || detail.CheckStatus == QueueReceiveGoldStatus.Terminal) || scope.row.OrderStatus !== QueueReceiveGoldOrderStatus.Audit "
              class="abandon"
            >已作废</i>
            <div class="img">
              <img :src="scope.row.ImageUrl&&(scope.row.ImageUrl.substr(0,4) === 'http'?scope.row.ImageUrl:$root.settings.DOMAIN_IMAGE + scope.row.ImageUrl)" alt>
            </div>
            <div class="name">
              <p>{{scope.row.AliasName}}</p>
              <p>微信会员</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="单号/消费时间" min-width="180">
        <template slot-scope="scope">
          <div>
            <p>{{scope.row.OrderId}}</p>
            <p style="color: #999">{{scope.row.OrderTime | filterDateTime}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="StoreName" label="消费门店" show-overflow-tooltip min-width="150"></el-table-column>
      <el-table-column prop="SalePrice" label="消费金额" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Contribution" label="贡献黄金" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Should" label="应领黄金" :formatter="formatter" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Ranking" label="排名" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <p>
            <i style="font-size:18px; font-weight:bold;font-style: italic;">{{scope.row.Ranking}}</i>
            <span v-if="scope.row.OrderStatus !== QueueReceiveGoldOrderStatus.Audit" class="m-l-5">({{QueueReceiveGoldOrderStatus.Types[scope.row.OrderStatus]}})</span>
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="PRanking" label="前面还有人数" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Still" label="距离领取还差" min-width="140" :formatter="formatter" show-overflow-tooltip v-if="form.Status !== QueueReceiveGoldItemStatus.Receive" key="Still"></el-table-column>
      <el-table-column prop="Receive" label="已领黄金" :formatter="formatter" min-width="100" v-if="form.Status !== QueueReceiveGoldItemStatus.NotReceive" key="Receive" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ReceiveTime" label="领取时间" :formatter="formatter" show-overflow-tooltip v-if="form.Status !== QueueReceiveGoldItemStatus.NotReceive" key="ReceiveTime"></el-table-column>
      <el-table-column label="操作" v-if="form.status !== QueueReceiveGoldItemStatus.NotReceive" key="action" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button name="btnDialogLoglist" v-if="scope.row.Status===QueueReceiveGoldItemStatus.Receive" type="text" @click="dialogLoglist = true;logListForm.ItemId = scope.row.ItemId">查看贡献者</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <el-dialog title="查看贡献者" :visible.sync="dialogLoglist" @open="getLogList">
      <el-table :data="logList" v-loading="logListLoading">
        <el-table-column prop="OrderTime" label="消费日期" :formatter="formatter" width="140" show-overflow-tooltip></el-table-column>
        <el-table-column prop="AliasName" label="昵称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="OrderId" label="消费单号" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="SalePrice" label="消费金额" width="100" :formatter="formatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Status" label="订单状态" :formatter="formatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Gold" label="贡献黄金" :formatter="formatter" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ROrderId" label="退货单号" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ROrederTime" label="退货日期" :formatter="formatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="RGold" label="退贡黄金" :formatter="formatter" width="100" show-overflow-tooltip></el-table-column>
      </el-table>
      <pagination :total="logListTotal" :pg="logListForm.PageIndex" :size="logListForm.PageSize" @currentChange="currentChangeLogList" @sizeChange="sizeChangeLogList"></pagination>

      <span slot="footer" class="dialog-footer">
        <el-button name="btnCancel" @click="dialogLoglist = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  QueueReceiveGoldStatus,
  QueueReceiveGoldItemStatus,
  QueueReceiveGoldOrderStatus
} from '@/enums/marketing.js'
import {
  CharacterType
} from '@/enums/common'
import {
  MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_ITEMLIST,
  MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_GET,
  // MARKETING_API_QUEUERECEIVEGOLD_LOGLIST,
  MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_LOGLIST,
  MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_ITEMLISTEXPORT
} from '@/apis/marketing'
import pagination from '@/components/pagination.vue'
export default {
  components: {
    pagination
  },
  data() {
    return {
      CharacterType,
      QueueReceiveGoldStatus,
      QueueReceiveGoldItemStatus,
      QueueReceiveGoldOrderStatus,
      total: 0,
      logListTotal: 0,
      tableData: [],
      tableLoading: true,
      detailLoading: true,
      dialogLoglist: false,
      logList: [],
      logListLoading: false,
      detail: {
      },
      form: {
        QueueId: '',
        AliasName: '',
        OrderTime1: '',
        OrderTime2: '',
        ReceiveTime1: '',
        ReceiveTime2: '',
        Status: QueueReceiveGoldItemStatus.NotReceive,
        PageIndex: 1,
        PageSize: 10
      },
      logListForm: {
        ItemId: 0,
        PageIndex: 1,
        PageSize: 10
      }
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    }
  },
  created() {
    this.form.QueueId = this.$route.params.id
    this.getData()
    this.getDetail()
  },
  methods: {
    hanldeOrderTime(val) {
      if (val) {
        this.form.OrderTime1 = val[0]
        this.form.OrderTime2 = val[1]
      } else {
        this.form.OrderTime1 = ''
        this.form.OrderTime2 = ''
      }
    },
    hanldeReceiveTime(val) {
      if (val) {
        this.form.ReceiveTime1 = val[0]
        this.form.ReceiveTime2 = val[1]
      } else {
        this.form.ReceiveTime1 = ''
        this.form.ReceiveTime2 = ''
      }
    },
    exportList() {
      MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_ITEMLISTEXPORT(this.form).then(res => {
        if (res.data.Code === 'CORRECT') {
          location.href = res.data.Data.FilePath
        }
      })
    },
    getLogList() {
      this.logListLoading = true
      MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_LOGLIST(this.logListForm).then(res => {
        this.logListLoading = false
        if (res.data.Code === 'CORRECT') {
          this.logList = res.data.Data.Rows
          this.logListTotal = res.data.Data.Count
        }
      })
    },
    currentChangeLogList(val) {
      this.logListForm.PageIndex = val
      this.getLogList()
    },
    sizeChangeLogList(val) {
      this.logListForm.PageIndex = 1
      this.logListForm.PageSize = val
      this.getLogList()
    },
    getDetail() {
      this.detailLoading = true
      MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_GET({
        QueueId: this.$route.params.id
      }).then(
        res => {
          this.detailLoading = false
          if (res.data.Code === 'CORRECT') {
            this.detail = res.data.Data.Basic
          }
        }
      )
    },
    getData() {
      this.tableLoading = true
      MARKETING_API_QUEUE_RECEIVE_GOLD_BASIC_ITEMLIST(this.form).then(res => {
        this.tableLoading = false
        if (res.data.Code === 'CORRECT') {
          this.total = res.data.Data.Count
          this.tableData = res.data.Data.Rows || []
        }
      })
    },
    search() {
      this.form.PageIndex = 1
      this.getData()
      this.getDetail()
    },
    currentChange(val) {
      this.form.PageIndex = val
      this.getData()
    },
    sizeChange(val) {
      this.form.PageIndex = 1
      this.form.PageSize = val
      this.getData()
    },
    formatter(row, column, cellValue) {
      switch (column.property) {
        case 'ReceiveTime':
          return this.$options.filters.filterDate(cellValue)
        case 'OrderTime':
          return this.$options.filters.filterDate(cellValue)
        case 'ROrederTime':
          return this.$options.filters.filterDate(cellValue)
        case 'Status':
          return QueueReceiveGoldOrderStatus.Types[cellValue]
        case 'Still':
          return `${this.$root.toFloat(row.PRanking === 0 &&
            row.Status !== QueueReceiveGoldItemStatus.Receive &&
            row.OrderStatus === QueueReceiveGoldOrderStatus.Audit
            ? cellValue - this.detail.ValidGram < 0
              ? row.Should
              : (cellValue - this.detail.ValidGram)
            : cellValue, 3)}g`
        case 'Contribution':
        case 'Should':
        case 'Receive':
          return `${this.$root.toFloat(cellValue, 3)}g`
        case 'Gold':
          return `${this.$root.toFloat(cellValue, 3)}g`
        case 'RGold':
          return cellValue == 0 ? '-' : `${this.$root.toFloat(cellValue, 3)}g`
        case 'SalePrice':
          return `￥${this.$root.toFloat(cellValue)}`
        default:
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.head-item {
  p {
    padding-bottom: 11px;
    background-color: #f5f5f5;
    text-align: center;
    line-height: 16px;
    color: #333;
    &:first-child {
      padding-top: 11px;
      padding-bottom: 0;
      font-size: 16px;
      font-weight: bold;
      line-height: 22px;
    }
  }
}
.tab {
  text-align: center;
  i {
    margin-right: 15px;
    font-size: 24px;
    vertical-align: middle;
  }
}
.flex-box {
  display: flex;
  .search-btn {
    width: auto;
    text-align: right;
    white-space: nowrap;
  }
  .search-form {
    width: 1%;
    flex: 1;
    .icon {
      position: absolute;
      right: -20px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 18px;
    }
  }
}
.member-info {
  .member-box {
    padding: 10px 0;
    position: relative;
    display: flex;
    display: -ms-flexbox;
    align-items: center;
    .receiving,
    .abandon {
      position: absolute;
      top: 0;
      left: -30px;
      width: 20px;
      height: 64px;
      background-color: #399fe5;
      color: #fff;
      writing-mode: vertical-rl;
      line-height: 20px;
      text-align: center;
    }
    .abandon {
      background-color: #bbb;
    }
    .img {
      margin-right: 10px;
      width: 44px;
      height: 44px;
      background-color: #ddd;
      img {
        width: 100%;
      }
    }
    .name {
      width: 1%;
      flex: 1;
      p {
        line-height: 1;
        &:first-child {
          padding-bottom: 5px;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        &:last-child {
          width: 64px;
          height: 18px;
          text-align: center;
          line-height: 18px;
          color: #fff;
          background-color: #ffa200;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.tab {
  .el-radio-button__inner {
    display: flex;
    padding: 0;
    width: 240px;
    height: 40px;
    align-items: center;
    justify-content: center;
    color: #333;
    border: 1px solid #e5e5e5;
  }
}
.member-info {
  padding: 0 !important;
  .cell {
    padding: 0 30px;
  }
}
.search-form {
  .el-form-item {
    margin-right: 28px !important;
  }
}
</style>
