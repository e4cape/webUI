<template>
  <div class="content">
    <!-- @module Panel -->
    <div class="m10">
      <table class="details-table" cellpadding="0" cellspacing="0" style="line-height: 32px;">
        <tbody>
          <tr>
            <td class="tit">
              <div class="tc">状态</div>
            </td>
            <td>
              <div class="tc">{{form.State === bargainBasicState.Published ? (Date.parse(nowDate) > Date.parse(form.Etime) ? '已结束' : Date.parse(form.Btime) > Date.parse(nowDate) ? '未开始' : '已开始') : bargainBasicState.Types[form.State]}}</div>
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
        <span>{{form.SeckillId}}</span>
      </el-form-item>
      <el-form-item label="活动名称：">
        <span>{{form.SeckillTitle}}</span>
      </el-form-item>
      <el-form-item label="活动时间：" prop="CreateTime">
        <span>{{form.Btime}} - {{form.Etime}}</span>
      </el-form-item>
      <el-form-item label="商品列表：" prop="BusinessLicense">
        <el-table :data="activeGoods">
          <el-table-column prop="ProductId" label="商品编码" width="130" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ProductName" label="商品名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="LabelPrice" label="商品类型" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              {{productType.Types[scope.row.ProductType]}}
            </template>
          </el-table-column>
          <el-table-column prop="LabelPrice" label="原价" width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              ￥{{scope.row.LabelPrice}}
            </template>
          </el-table-column>
          <el-table-column prop="SalePrice" label="售价" width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              ￥{{scope.row.SalePrice}}
            </template>
          </el-table-column>
          <el-table-column prop="SeckillPrice" label="秒杀价" width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              ￥{{scope.row.SeckillPrice}}
            </template>
          </el-table-column>
          <el-table-column prop="CheckTime" label="秒杀时间" width="260" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.Btime}} - {{scope.row.Etime}}
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="商品限购：">
        <span>{{form.LimitType == limitType.More ? '限购' + form.LimitTimes + '次/人' : limitType.Types[form.LimitType]}}</span>
      </el-form-item>
      <el-form-item label="订单自动取消时间：" prop="CancelMinutes">
        <span>{{form.CancelMinutes}}分钟</span>
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
        <el-button name="btnShowQrcode" type="text" @click="showQrcode(form.AppletImageUrl, form.SeckillId, spreadType.Seckill)">二维码</el-button>
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
    <el-table class="tabs-tb" :data="trafficData" :summary-method="getSummaries" show-summary @sort-change="sortChange">
      <el-table-column prop="ProductName" label="商品名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ViewInnAmt" label="浏览（人次）" width="130" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ViewOrderAmt" label="订单" width="120" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ViewRate" label="订单转化率" width="120" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.ViewRate > 0 ? (parseFloat(scope.row.ViewRate) * 100).toFixed(2) + '%' : '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="ShareInnAmt" label="分享数（次）" width="140" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ShareOrderAmt" label="分享带来订单数" width="160" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ShareRate" label="分享转化率" width="140" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.ShareRate > 0 ? (parseFloat(scope.row.ShareRate) * 100).toFixed(2) + '%' : '-'}}
        </template>
      </el-table-column>
    </el-table>
    <div style="height: 60px; padding: 10px;">
      <el-col :span="12" class="tl" style="line-height: 40px;">
        <b>活动订单：</b>
      </el-col>
      <el-col :span="12" class="tr">
        <span class="m-r-5">筛选</span>
        <el-select name="activeProductId" v-model="activeProductId" filterable>
          <el-option label="全部" value="0"></el-option>
          <el-option v-for="item in activeGoods" :key="item.ProductId" :label="item.ProductName" :value="String(item.ProductId)"></el-option>
        </el-select>
      </el-col>
    </div>
    <el-table class="tabs-tb" :data="orderData" @sort-change="orderSortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="CreateTime" label="日期" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="OrderCode" label="订单号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ProductName" label="商品名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Quantity" label="订单商品数量" show-overflow-tooltip></el-table-column>
      <el-table-column prop="MemberId" label="用户ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="State" label="订单状态" width="110" show-overflow-tooltip>
        <template slot-scope="scope">
          {{spreadSaleOrderBasicState.Types[scope.row.State]}}
        </template>
      </el-table-column>
    </el-table>
    <div class="p10">
      <pagination :pg="orderPageIndex" :size="orderPageSize" :total="orderTotal" @currentChange="orderPageChange" @sizeChange="orderPageSizeChange"></pagination>
    </div>

    <qrcode v-if="qrcodeVisible" :qrcodeVisible="qrcodeVisible" :data="codeData" @qrcodeClose="qrcodeClose"></qrcode>
  </div>
</template>
<script>
import pagination from '@/components/pagination'
import qrcode from '@/components/spread/qrcode'
import { YNStatus } from '@/enums/common'
import {
  BargainBasicState,
  SpreadType,
  LimitType,
  RmaType,
  SpreadSaleOrderBasicState,
  ProductType
} from '@/enums/spread'
import {
  SPREAD_API_SECKILL_DETAIL,
  SPREAD_API_SECKILL_SEARCHITEMS,
  SPREAD_API_SECKILL_SEARCHADDRS,
  SPREAD_API_SPRLOG_TRAFFICLIST,
  SPREAD_API_SPRORDER_ORDERLIST
} from '@/apis/spread'
export default {
  data() {
    return {
      productType: ProductType,
      bargainBasicState: BargainBasicState,
      spreadType: SpreadType,
      spreadSaleOrderBasicState: SpreadSaleOrderBasicState,
      limitType: LimitType,
      rmaType: RmaType,
      seckillId: '',
      seckillType: '',
      form: {
        BannerUrl: ''
      },
      activeGoods: [],
      activeAddrs: [],
      activeCreateTime: '',
      activeProductId: '0',
      trafficData: [],
      orderData: [],
      orderTotal: 0,
      orderIsAsc: YNStatus.No,
      orderPageIndex: 1,
      orderPageSize: 20,
      rewardParameters: {
        OrderCode: '',
        SpreadType: '',
        ProductName: '',
        ShareId: '',
        TrueName2: '',
        Mobile2: '',
        RewardType: '',
        CreateTime: ''
      },
      rewardData: [],
      rewardtotal: 0,
      nowDate: new Date(),
      qrcodeVisible: false,
      codeData: {
      }
    }
  },
  methods: {
    getDetail() {
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_SECKILL_DETAIL({
        seckillId: this.seckillId
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
      SPREAD_API_SECKILL_SEARCHITEMS({
        seckillId: this.seckillId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.activeGoods = res.data.Data.rows
          this.getAddrs()
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getAddrs() {
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_SECKILL_SEARCHADDRS({
        seckillId: this.seckillId
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.activeAddrs = res.data.Data.rows
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    sortChange(sort) {
      this.trafficData.sort((a, b) => {
        return sort.order === 'ascending'
          ? parseFloat(a[sort.prop]||0) - parseFloat(b[sort.prop]||0)
          : parseFloat(b[sort.prop]||0) - parseFloat(a[sort.prop]||0)
      })
    },
    getTraffic() {
      this.$store.commit('SET_TB_LOADING', true)
      let activeCreateTime = this.activeCreateTime || ['1900-01-01', '1900-01-01']
      SPREAD_API_SPRLOG_TRAFFICLIST({
        SpreadId: this.seckillId,
        SpreadType: SpreadType.Seckill,
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
          this.getOrder()
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getOrder() {
      this.$store.commit('SET_TB_LOADING', true)
      let activeCreateTime = this.activeCreateTime || ['1900-01-01', '1900-01-01']
      SPREAD_API_SPRORDER_ORDERLIST({
        SpreadId: this.seckillId,
        SpreadType: SpreadType.Seckill,
        ProductId: this.activeProductId,
        CreateTime1: activeCreateTime[0] || '1900-01-01',
        CreateTime2: activeCreateTime[1] || '1900-01-01',
        OrderBy: 0,
        IsAsc: this.orderIsAsc,
        PageIndex: this.orderPageIndex,
        PageSize: this.orderPageSize
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.orderData = res.data.Data.rows
          this.orderTotal = res.data.Data.total
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    orderSortChange(sort) {
      this.orderIsAsc = sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getOrder()
    },
    orderPageChange(val) {
      this.orderPageIndex = val
      this.getOrder()
    },
    orderPageSizeChange(val) {
      this.orderPageIndex = 1
      this.orderPageSize = val
      this.getOrder()
    },
    showQrcode(url, id, type) {
      this.qrcodeVisible = true
      this.codeData = {
        url: url,
        id: id,
        type: type
      }
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
        sums[index] =  sums[index].toFixed(2)
        if (index === 3) {
          sums[index] = (sums[2] / sums[1] * 100).toFixed(2) + '%'
        } else if (index === 6) {
          sums[index] = (sums[5] / sums[4] * 100).toFixed(2) + '%'
        }
      })
      return sums
    }
  },
  beforeMount() {
    this.seckillId = this.$route.query.id || 0
    if (!this.seckillId) {
      this.$message.error('数据错误！')
      this.$router.back()
      return false
    }
    this.getDetail()
    this.getOrder()
    this.getTraffic()
  },
  watch: {
    activeCreateTime: 'getTraffic',
    activeProductId() {
      this.$store.commit('SET_TB_LOADING', true)
      this.getOrder()
    }
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
