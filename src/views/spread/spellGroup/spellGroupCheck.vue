<template>
  <div class="content">
    <!-- @module Panel -->
    <div class="m10">
      <table class="details-table" cellpadding="0" cellspacing="0" style="line-height: 48px;">
        <tbody>
          <tr>
            <td class="tit">
              <div class="tc">状态</div>
            </td>
            <td>
              <div
                class="tc"
              >{{form.State == collageBasicState.Published ? (Date.parse(nowDate) > Date.parse(form.Etime) ? '已结束' : Date.parse(form.Btime) > Date.parse(nowDate) ? '未开始' : '已开始') : bargainBasicState.Types[form.State]}}</div>
            </td>
            <td class="tit">
              <div class="tc">创建时间</div>
            </td>
            <td>
              <div class="tc">{{form.CreateTime}}</div>
            </td>
            <td class="tit">
              <div class="tc">创建人</div>
            </td>
            <td>
              <div class="tc">{{form.CreateUser}}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <el-form label-position="right" class="m-t-20" label-width="133px">
      <el-form-item label="ID：">
        <span>{{form.CollageId}}</span>
      </el-form-item>
      <el-form-item label="活动名称：">
        <span>{{form.CollageTitle}}</span>
      </el-form-item>
      <el-form-item label="活动时间：" prop="CreateTime">
        <span>{{form.Btime}} - {{form.Etime}}</span>
      </el-form-item>
      <el-form-item label="商品列表：" prop="BusinessLicense">
        <el-table :data="activeGoods">
          <el-table-column prop="ProductId" label="商品编码" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ProductName" label="商品名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="LabelPrice" label="商品类型" width="100" show-overflow-tooltip>
            <template slot-scope="scope">{{productType.Types[scope.row.ProductType]}}</template>
          </el-table-column>
          <el-table-column prop="LabelPrice" label="原价" width="80" show-overflow-tooltip>
            <template slot-scope="scope">￥{{scope.row.LabelPrice}}</template>
          </el-table-column>
          <el-table-column prop="SalePrice" label="售价" width="80" show-overflow-tooltip>
            <template slot-scope="scope">￥{{scope.row.SalePrice}}</template>
          </el-table-column>
          <el-table-column prop="TeamQty" label="成团人数/团" width="120">
            <template slot-scope="scope">
              <div>{{scope.row.TeamQty}}</div>
              <div v-if="scope.row.TeamQty1">{{scope.row.TeamQty1}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="MemberPrice" label="成员拼团价" width="120">
            <template slot-scope="scope">
              <div>￥{{scope.row.MemberPrice}}</div>
              <div v-if="scope.row.MemberPrice1">￥{{scope.row.MemberPrice1}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="ChiefPrice" label="团长拼团价" width="120">
            <template slot-scope="scope">
              <div>￥{{scope.row.ChiefPrice}}</div>
              <div v-if="scope.row.ChiefPrice1">￥{{scope.row.ChiefPrice1}}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="组团有效期：">
        <span>{{(form.ValidityMinutes||0) / 60}}小时</span>
      </el-form-item>
      <!-- <el-form-item label="商品限购：">
        <span>{{form.LimitType = limitType.More ? '限购' + form.LimitTimes + '次/人' : limitType.Types[form.LimitType]}}</span>
      </el-form-item>-->
      <el-form-item label="订单自动取消时间：" prop="CancelMinutes">
        <span>{{form.CancelMinutes}}分钟</span>
      </el-form-item>
      <el-form-item label="未成团订单处理：">
        <span>{{collageBasicHandleType.Types[form.HandleType]}}</span>
      </el-form-item>
      <el-form-item label="商品领取地址：" prop="BusinessLicense">
        <el-table :data="activeAddrs">
          <el-table-column prop="Name" label="门店名称" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Mobile" label="联系电话" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Contact" label="联系人" width="90" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Address" label="地址" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag class="after-tag" type="info" v-if="scope.row.RmaType === rmaType.Rma">售后</el-tag>
              <span class="adress-table">{{scope.row.ProvinceName + scope.row.CityName + scope.row.TownName + scope.row.Address}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="活动二维码：" prop="FlagshipType">
        <el-button name="btnShowQrcode" type="text" @click="showQrcode(form.AppletImageUrl, form.CollageId, spreadType.Collage)">二维码</el-button>
      </el-form-item>
    </el-form>

    <div style="height: 60px; padding: 10px;">
      <el-col :span="12" class="tl" style="line-height: 40px;">
        <b>数据概览：</b>
      </el-col>
      <el-col :span="12" class="tr">
        <span class="m-r-5">日期</span>
        <el-date-picker name="activeCreateTime" :picker-options="$root.datePickerOptions" v-model="activeCreateTime" :unlink-panels="true" type="daterange" placeholder="选择日期"></el-date-picker>
      </el-col>
    </div>
    <el-table class="tabs-tb" :summary-method="getSummaries" show-summary :data="trafficData" @sort-change="sortChange">
      <el-table-column prop="ProductName" label="商品名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ViewInnAmt" label="浏览（人次）" width="130" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ViewOrderAmt" label="订单" width="120" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ViewRate" label="订单转化率" width="120" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.ViewRate > 0 ? (parseFloat(scope.row.ViewRate) * 100).toFixed(2) + '%' : '-'}}</template>
      </el-table-column>
      <el-table-column prop="ShareInnAmt" label="分享数（次）" width="140" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ShareOrderAmt" label="分享带来订单数" width="160" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ShareRate" label="分享转化率" width="140" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.ShareRate > 0 ? (parseFloat(scope.row.ShareRate) * 100).toFixed(2) + '%' : '-'}}</template>
      </el-table-column>
    </el-table>
    <div style="height: 60px; padding: 10px;">
      <el-col :span="12" class="tl" style="line-height: 40px;">
        <b>拼团数据：</b>
      </el-col>
    </div>
    <el-form :model="queryForm" label-position="right" label-width="110px" :inline="true" class="item-lh-26 p10">
      <el-row class="search-box no-border" type="flex">
        <el-col>
          <el-form-item label="开团时间：">
            <el-date-picker name="CreateTime" :picker-options="$root.datePickerOptions" :unlink-panels="true" type="daterange" v-model="queryForm.CreateTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="商品名称：">
            <el-input name="ProductName" :maxlength="50" v-model="queryForm.ProductName" @keyup.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item label="拼团状态：">
            <el-select name="State" v-model="queryForm.State" placeholder="全部" :filterable="true">
              <el-option label="全部" :value="0"></el-option>
              <el-option v-for="(item, index) in collageTeamState.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="search-btn">
          <el-button name="btnSearch" type="primary" @click="search">搜索</el-button>
        </el-col>
      </el-row>
    </el-form>

    <div class="p10"></div>
    <el-table :data="groupData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="CreateTime" label="开团时间" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="TeamId" label="团号" show-overflow-tooltip width="80" fixed></el-table-column>
      <el-table-column prop="ProductId" label="商品编码" show-overflow-tooltip width="80"></el-table-column>
      <el-table-column prop="ProductName" label="商品名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="MktPrice" label="成团人数/团" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.MembAmt}}人团</template>
      </el-table-column>
      <el-table-column prop="Quantity" label="距成团人数" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.MembAmt - scope.row.CurrAmt}}人</template>
      </el-table-column>
      <el-table-column prop="State" label="拼团状态" show-overflow-tooltip>
        <template slot-scope="scope">{{collageTeamState.Types[scope.row.State]}}</template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button name="btnGroupCheck" type="text" @click="$router.push({path: '/spread/order/groupCheck?spreadId=' + collageId + '&teamId=' + scope.row.TeamId})">查看订单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- end Table -->
    <!-- 分页 -->
    <div class="p10">
      <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </div>

    <qrcode v-if="qrcodeVisible" :qrcodeVisible="qrcodeVisible" :data="codeData" @qrcodeClose="qrcodeClose"></qrcode>
  </div>
</template>
<script>
import pagination from '@/components/pagination'
import qrcode from '@/components/spread/qrcode'
import { YNStatus } from '@/enums/common'
import {
  CollageBasicState,
  SpreadType,
  SpreadSaleOrderBasicState,
  BargainBasicState,
  CollageBasicHandleType,
  RmaType,
  CollageTeamState,
  ProductType,
  LimitType
} from '@/enums/spread'
import {
  SPREAD_API_COLLAGE_DETAIL,
  SPREAD_API_COLLAGE_SEARCHITEMS,
  SPREAD_API_COLLAGE_SEARCHADDRS,
  SPREAD_API_SPRLOG_TRAFFICLIST,
  SPREAD_API_COLLAGE_QRIES
} from '@/apis/spread'
export default {
  data() {
    return {
      productType: ProductType,
      spreadType: SpreadType,
      limitType: LimitType,
      rmaType: RmaType,
      collageTeamState: CollageTeamState,
      collageBasicHandleType: CollageBasicHandleType,
      bargainBasicState: BargainBasicState,
      spreadSaleOrderBasicState: SpreadSaleOrderBasicState,
      collageBasicState: CollageBasicState,
      collageId: '',
      collageType: '',
      form: {
        BannerUrl: ''
      },
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
        State: 0,
        AliasName: '',
        TrueName: '',
        Mobile: '',
        IsDirected: 0,
        PageIndex: 1,
        PageSize: 10
      },
      activeGoods: [],
      activeAddrs: [],
      activeCreateTime: '',
      activeProductId: '0',
      trafficData: [],
      groupData: [],
      total: 0,
      orderIsAsc: YNStatus.No,
      orderPageIndex: 1,
      orderPageSize: 20,
      nowDate: new Date(),
      qrcodeVisible: false,
      codeData: {
      }
    }
  },
  methods: {
    getDetail() {
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_COLLAGE_DETAIL({
        collageId: this.collageId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          if (!res.data.Data) {
            this.$router.back()
          }
          this.form = res.data.Data
          this.getGoods()
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getGoods() {
      SPREAD_API_COLLAGE_SEARCHITEMS({
        collageId: this.collageId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.activeGoods = res.data.Data.rows.map(item => {
            JSON.parse(item.Teams).forEach((t, index) => {
              item['TeamQty' + (index ? '1' : '')] = t.TeamQty
              item['MemberPrice' + (index ? '1' : '')] = t.MemberPrice
              item['ChiefPrice' + (index ? '1' : '')] = t.ChiefPrice
            })
            return item
          })
          this.getAddrs()
        }
      })
    },
    getGroupData() {
      let createTime = this.queryForm.CreateTime || ['1900-01-01', '1900-01-01']
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_COLLAGE_QRIES({
        ProductName: this.queryForm.ProductName,
        CreateTime1: createTime[0],
        CreateTime2: createTime[1],
        State: this.queryForm.State,
        OrderBy: 0,
        CollageId: this.collageId,
        IsAsc: YNStatus.No,
        PageIndex: this.queryForm.PageIndex,
        PageSize: this.queryForm.PageSize
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.groupData = res.data.Data.rows
          this.total = res.data.Data.total
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getAddrs() {
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_COLLAGE_SEARCHADDRS({
        collageId: this.collageId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.activeAddrs = res.data.Data.rows
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getTraffic() {
      this.$store.commit('SET_TB_LOADING', true)
      let activeCreateTime = this.activeCreateTime || ['1900-01-01', '1900-01-01']
      SPREAD_API_SPRLOG_TRAFFICLIST({
        SpreadId: this.collageId,
        SpreadType: SpreadType.Collage,
        CreateTime1: activeCreateTime[0] || '1900-01-01',
        CreateTime2: activeCreateTime[1] || '1900-01-01',
        OrderBy: 0,
        IsAsc: YNStatus.Yes
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          let trafficData = []
          res.data.Data.forEach(item => {
            trafficData.push({
              ProductName: item.ProductName,
              ViewInnAmt: item.ViewInnAmt,
              ViewOrderAmt:
                parseInt(item.ViewOrderAmt) + parseInt(item.ShareOrderAmt),
              ViewRate: parseFloat(
                (item.ViewOrderAmt + item.ShareOrderAmt) / item.ViewInnAmt
              ),
              ShareInnAmt: item.ShareInnAmt,
              ShareOrderAmt: item.ShareOrderAmt,
              ShareRate: item.ShareRate
            })
          })
          this.trafficData = trafficData
          this.sortChange({
            // 默认排序
            order: 'ascng', // 降序乱写
            prop: 'ViewInnAmt'
          })
        } else {
          this.$message.error(res.data.Message)
        }
      }).catch(() => {
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    sortChange(sort) {
      this.trafficData.sort((a, b) => {
        return sort.order === 'ascending'
          ? parseFloat(a[sort.prop]||0) - parseFloat(b[sort.prop]||0)
          : parseFloat(b[sort.prop]||0) - parseFloat(a[sort.prop]||0)
      })
    },
    showQrcode(url, id, type) {
      this.qrcodeVisible = true
      this.codeData = {
        url: url,
        id: id,
        type: type
      }
    },
    search() {
      this.queryForm.PageIndex = 1
      this.getGroupData()
    },
    currentChange(val) {
      this.queryForm.PageIndex = val
      this.getGroupData()
    },
    sizeChange(val) {
      this.queryForm.PageSize = val
      this.queryForm.PageIndex = 1
      this.getGroupData()
    },
    qrcodeClose() {
      this.qrcodeVisible = false
    },
    getSummaries(param) {
      const {
        columns, data
      } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => parseFloat(item[column.property]))
        sums[index] = values.reduce((prev, curr) => {
          return parseFloat(prev) + parseFloat(curr)
        }, 0)
        sums[index] = sums[index].toFixed(2)
        if (index === 3) {
          sums[index] = ((sums[2] / sums[1]) * 100).toFixed(2) + '%'
        } else if (index === 6) {
          sums[index] = ((sums[5] / sums[4]) * 100).toFixed(2) + '%'
        }
      })
      return sums
    }
  },
  beforeMount() {
    this.collageId = this.$route.query.id || 0
    if (!this.collageId) {
      this.$message.error('数据错误！')
      this.$router.back()
      return false
    }
    this.getDetail()
    this.getTraffic()
    this.getGroupData()
  },
  watch: {
    activeCreateTime: 'getTraffic'
  },
  components: {
    pagination,
    qrcode
  }
}
</script>
<style lang="scss">
@import '~@/assets/sass/spreadActive.scss';
</style>
