<template>
  <div class="content">
    <el-form :model="form" ref="search" label-width="60px" class="m-t-10">
      <el-row :gutter="10" type="flex" justify="start">
        <el-col :span="20">
          <el-col :span="6">
            <el-form-item name="datePickerCreateTime" label="发放时间" prop="CreateTime">
              <el-date-picker style="width:100%;" v-model="form.CreateTime" :unlink-panels="true" type="daterange" format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="活动名称" prop="ActivityName">
              <el-input name="inputActivityName" v-model="form.ActivityName" placeholder="活动名称" @keyup.enter.native="search"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="微信昵称" prop="AliasName">
              <el-input name="inputAliasName" v-model="form.AliasName" placeholder="微信昵称" @keyup.enter.native="search"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="Status">
              <el-select name="selectStatus" v-model="form.Status" placeholder="状态">
                <el-option label="全部" :value="0"></el-option>
                <el-option v-for="(item, index) in paymentRedPacketStatus.Types" :key="index" :label="item" :value="parseInt(index)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="4">
          <div style="min-width:200px;">
            <el-button name="btnSearch" type="primary" @click="search">搜索</el-button>
            <el-button @click="reset">重置</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row :span="24">
        <el-col :span="20" v-if="$store.getters.user_session.CharacterType === characterTypes.Company">
          <el-col :span="6">
            <el-form-item label="领取门店" prop="CharacterId">
              <el-select name="selectCharacterId" v-model="form.CharacterId">
                <el-option v-for="item in $store.getters.stores" :key="item.CharacterId" :value="item.CharacterId" :label="item.Value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
    </el-form>

    <div class="checkPage-hd">
      <el-row>
        <el-col :span="12">
          <i class="icon-list"></i>
          <span class="title">数据统计</span>
        </el-col>
        <el-col :span="12" class="tr"></el-col>
      </el-row>
    </div>

    <el-row :gutter="10" class="m-b-10">
      <el-col :span="12">
        <div class="detail-box">
          <div class="detail-box-item">
            <b>{{totalCount.TotalAmt}}</b>
            <span>发放总数(个)</span>
          </div>
          <div class="detail-box-item">
            <b>{{totalCount.ReceiveAmt}}</b>
            <span>已领取(个)</span>
          </div>
          <div class="detail-box-item">
            <b>{{totalCount.NoReceiveAmt}}</b>
            <span>未领取(个)</span>
          </div>
          <div class="detail-box-item">
            <b>{{totalCount.ErrorAmt}}</b>
            <span>失败(个)</span>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="detail-box">
          <div class="detail-box-item">
            <b>￥{{$root.toFloat(totalCount.TotalPrice)}}</b>
            <span>发放总额(元)</span>
          </div>
          <div class="detail-box-item">
            <b>￥{{$root.toFloat(totalCount.ReceivePrice)}}</b>
            <span>已领取总额(元)</span>
          </div>
          <div class="detail-box-item">
            <b>￥{{$root.toFloat(totalCount.NoReceivePrice)}}</b>
            <span>未领取总额(元)</span>
          </div>
          <div class="detail-box-item">
            <b>￥{{$root.toFloat(totalCount.ErrorPrice)}}</b>
            <span>发送失败总额(元)</span>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="checkPage-hd">
      <el-row>
        <el-col :span="12">
          <i class="icon-list"></i>
          <span class="title">发放记录</span>
        </el-col>
        <el-col :span="12" class="tr">
          <el-button name="btnExportData" type="text" @click="exportData">导出Excel</el-button>
        </el-col>
      </el-row>
    </div>

    <el-table :data="data">
      <el-table-column prop="GrantStart" label="发放时间" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.CreateTime | filterDateMinutes}}</template>
      </el-table-column>
      <el-table-column prop="ActivityName" label="活动名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="AliasName" label="微信昵称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Price" label="红包金额（元）" show-overflow-tooltip>
        <template slot-scope="scope">
          {{$root.toFloat(scope.row.Price)}}
        </template>
      </el-table-column>
      <el-table-column prop="Status" label="红包状态" show-overflow-tooltip>
        <template slot-scope="scope">{{paymentRedPacketStatus.Types[scope.row.Status]}}</template>
      </el-table-column>
      <el-table-column prop="ProductNO" label="领取时间" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.ReceiveTime | filterDateMinutes}}</template>
      </el-table-column>
      <el-table-column v-if="$store.getters.user_session.CharacterType === characterTypes.Company" prop="StoreName" label="领取门店" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Note" label="备注" show-overflow-tooltip></el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>

<script>
import pagination from '@/components/pagination.vue'
import {
  PAYMENT_API_RED_PACKET_ITEM_GETS,
  PAYMENT_API_RED_PACKET_ITEM_GETANALYSIS,
  PAYMENT_API_RED_PACKET_ITEM_ITEMEXPORT
} from '@/apis/payment1'
import { CharacterType } from '@/enums/common'
import {
  PaymentRedPacketStatus
} from '@/enums/payment'

export default {
  data() {
    return {
      paymentRedPacketStatus: PaymentRedPacketStatus,
      characterTypes: CharacterType,
      form: {
        CreateTime: [],
        CharacterId: 0,
        ActivityName: '',
        CreateTime1: '',
        CreateTime2: '',
        AliasName: '',
        Status: 0,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      data: [],
      totalCount: {}
    }
  },
  beforeMount() {
    this.$store.dispatch('GET_STORES_DROPLIST')
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            CreateTime: [],
            CharacterId: '0',
            ActivityName: '',
            CreateTime1: '',
            CreateTime2: '',
            AliasName: '',
            Status: '0',
            PageIndex: 1,
            PageSize: 20
          }
      this.parameter = Object.assign({}, query)
      this.parameter.CharacterId = parseInt(this.parameter.CharacterId)
      this.parameter.Status = parseInt(this.parameter.Status)
      this.parameter.CreateTime = query.CreateTime || []
      this.getData()
      this.getTotal()
    },
    getTotal() {
      var params = {
        CreateTime1: this.parameter.CreateTime[0] || '',
        CreateTime2: this.parameter.CreateTime[1] || ''
      }
      this.form = Object.assign(this.form, this.parameter, params)
      PAYMENT_API_RED_PACKET_ITEM_GETANALYSIS(this.form).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.totalCount = res.data.Data
        }
      })
    },
    getData() {
      var params = {
        CreateTime1: this.parameter.CreateTime[0] || '',
        CreateTime2: this.parameter.CreateTime[1] || ''
      }
      this.form = Object.assign(this.form, this.parameter, params)
      PAYMENT_API_RED_PACKET_ITEM_GETS(this.form).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows
          this.total = res.data.Data.Count
        }
      })
    },
    search() {
      this.form.PageIndex = 1
      this.parameter = JSON.parse(JSON.stringify(this.form))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
        this.getTotal()
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
    initRoute() {
      this.$router.replace({
        path: '/market/sendLog/index',
        query: this.parameter
      })
    },
    exportData() {
      this.$store.commit('SET_FULL_LOADING', true)
      PAYMENT_API_RED_PACKET_ITEM_ITEMEXPORT(this.form).then(res => {
        if (res.data.Code === 'CORRECT') {
          window.open(res.data.Data.FilePath)
          this.$message.success('导出Excel成功')
        }
      })
      this.$store.commit('SET_FULL_LOADING', false)
    }
  },
  components: {
    pagination
  },
  watch: {
    $route() {
      this.init()
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-box {
  text-align: center;
  background: #f5f5f5;
  padding: 15px 0;
  display: flex;
  .detail-box-item {
    border-right: 1px solid #e5e5e5;
    flex: 1;
    width: 25%;
    b,
    span {
      display: block;
    }
    b {
      color: #333;
      line-height: 22px;
      font-size: 18px;
      font-weight: bold;
    }
    span {
      color: #777;
      line-height: 20px;
      font-size: 14px;
    }
  }
  > :last-child {
    border: none;
  }
}
</style>

