
<template  >
  <div class="content" v-loading="isLoading">
    <div class="title">
      <i class="icon-list icon-title"></i>消费单信息
    </div>
    <el-table :data="tableData">
      <el-table-column label="消费单号" prop="SellCode" width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="卡券类型" prop="CouponType" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="支付类型" prop="PayingType" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="会员账号" prop="OpenId" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="会员名称" prop="AliasName" min-width="120" show-overflow-tooltip></el-table-column>
      <template v-if="characterType == CharacterType.Lingcb">
        <el-table-column label="公司编码" prop="CompanyCode" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="公司名称" prop="CompanyName" min-width="120" show-overflow-tooltip></el-table-column>
      </template>
      <el-table-column label="门店编号" prop="StoreCode" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="门店名称" prop="StoreName" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="单据备注" prop="Note" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="套餐类型" prop="PackageNote" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="主销导购" prop="MainUser" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="辅销导购" prop="AssistUser" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="销售日期" prop="OrderTime" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="来源" prop="TerminalType" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="消费单状态" prop="State" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
    </el-table>
    <div class="title">
      <i class="icon-list icon-title"></i>结算信息
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="(使用)卡券序号" prop="CardactitId" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="本金金额" prop="SimplyPrice" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="折旧后本金金额" prop="RecyclePrice" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="卡券支付" prop="CouponPrice" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="折旧工费" prop="CpfeePrice" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="补付金额" prop="OtherPrice" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="补付总额(含折旧工费)" prop="CashPrice" :formatter="formatter" min-width="140" show-overflow-tooltip></el-table-column>
      <template v-if="characterType == CharacterType.Lingcb">
        <el-table-column label="下单提点(元/克)" prop="SettlePerg" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="下单提点(%)" prop="SettleRate" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      </template>
      <el-table-column label="提点总额" prop="SettlePrice" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="旅游基金比率" prop="TourRate" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="旅游基金金额" prop="TourPrice" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="利润总额" prop="EarnPrice" :formatter="formatter" v-if="characterType == CharacterType.Lingcb" min-width="120" show-overflow-tooltip></el-table-column>
    </el-table>
    <div class="title">
      <i class="icon-list icon-title"></i>商品信息
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column label="条码" prop="ProductNO"></el-table-column>
      <el-table-column label="商品名称" prop="ProductTitle" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="证书号" prop="CertSeriesID" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="标签价" prop="LabelPrice" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="材质类型" prop="MaterialType" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="素金品类" prop="GoldType" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="净金重" prop="GoldWeight" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="当日金价(元/克)" prop="GoldPrice" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="计价工费" prop="WorkPrice" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="商品售价" prop="ProductPrice" :formatter="formatter" min-width="120" show-overflow-tooltip></el-table-column>
    </el-table>
    <div v-for="item in couponList" :key="item.CouponType">
      <div class="title">
        <i class="icon-list icon-title"></i>
        {{RetailOrderSellSettleCouponType.Types[item.CouponType]}}
      </div>
      <el-table :data="[item]" style="width: 100%">
        <el-table-column label="可抵用的货品材质类型" prop="MaterialTypes" width="160">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top" width="200">
              <p>{{ ergodicMT(scope.row.MaterialTypes) }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium" primary="success">查看可抵材质</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column :formatter="formatter" label="赠送设置" prop="ProfitType" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column :formatter="formatter" label="收益比率" prop="CouponRate" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="收益天数(天)" prop="Days" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column :formatter="formatter" label="收益日期(起始)" prop="Expireb" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column :formatter="formatter" label="收益日期(截止)" prop="Expiree" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column :formatter="formatter" label="应收益总额" prop="AwaitPrice" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column :formatter="formatter" label="可用总额" prop="ValidPrice" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column :formatter="formatter" label="收益状态" prop="ProfitStatus" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column :formatter="formatter" label="消费状态" prop="ExpendStatus" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column :formatter="formatter" label="卡券状态" prop="CouponStatus" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="item.CouponType==CouponType.Equiv" :formatter="formatter" label="每张金额" prop="PerPrice" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="item.CouponType==CouponType.Equiv" label="已收益张数" prop="TimerAmt" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="item.CouponType==CouponType.Equiv" label="已使用张数" prop="UsedAmt" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column v-if="item.CouponType==CouponType.Equiv" label="当前可用张数" prop="ValidAmt" min-width="120" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-table v-if="item.CouponType==CouponType.Equiv" :data="item.Cards" class="m-t-20" style="width: 100%">
        <el-table-column label="单张序号" prop="ItemId" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column :formatter="formatter" label="单张金额" prop="PagePrice" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column :formatter="formatter" label="已回收总额" prop="RecycPrice" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column :formatter="formatter" label="已使用总额" prop="UsedPrice" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column :formatter="formatter" label="当前可用总额" prop="ValidPrice" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column :formatter="formatter" label="收益状态" prop="ProfitStatus" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column :formatter="formatter" label="消费状态" prop="ExpendStatus" show-overflow-tooltip></el-table-column>
        <el-table-column :formatter="oneStatusformatter" label="单张状态" prop="CouponStatus" min-width="120" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {
  CouponType,
  ExpendOrderPayingType,
  WalletCouponProfitStatus,
  WalletCouponExpendStatus,
  WalletCouponStatus,
  StorePackageType,
  WalletEquivXmlCouponStatus
} from '@/enums/marketing.js'
import { 
  RetailOrderSellSettleCouponType, 
  RetailOrderSellSettleProfitType, 
  RetailOrderMasterState, 
  RetailOrderMasterTerminalType,
  RetailOrderSellSettleTicketType
} from '@/enums/order'
import { CharacterType } from '@/enums/common'
import {
  ORDER_API_RETAIL_ORDER_SELL_BASIC_GETBYSTORE
} from '@/apis/order'
export default {
  data() {
    return {
      CouponType,
      RetailOrderSellSettleCouponType,
      RetailOrderSellSettleTicketType,
      CharacterType,
      tableData: [],
      couponList: [],
      isLoading: false
    }
  },
  computed: {
    characterType() {
      return this.$store.getters.user_session.CharacterType
    },
    wechatSettingType() {
      return this.$store.getters.wechatSettingType
    }
  },
  created() {
    this.$store.dispatch('GET_MATERIAL_TYPE')
    this.$store.dispatch('GET_GOLD_TYPE')
  },
  beforeMount() {
    this.getDetail()
  },
  methods: {
    ergodicMT(str) {
      const ary = []
      str.split(',').forEach(item => {
        ary.push(this.$store.getters.materialType.Types[item])
      })
      return ary.join('，')
    },
    getDetail() {
      this.isLoading = true
      ORDER_API_RETAIL_ORDER_SELL_BASIC_GETBYSTORE({
        SellCode: this.$route.params.id || this.$route.query.SellCode
      }).then(res => {
        this.isLoading = false
        if (res.data.Code === 'CORRECT') {
          this.tableData = [res.data.Data.Detail]
          this.couponList = res.data.Data.CouponList || []
        }
      })
    },
    formatter(row) {
      let tpr
      switch (arguments[1].property) {
        case 'TerminalType':
          tpr = RetailOrderMasterTerminalType.Types[arguments[2]] || '-'
          break
        case 'ProfitType':
          tpr = RetailOrderSellSettleProfitType.Types[arguments[2]] || '-'
          break
        case 'CouponType':
          if (
            arguments[0].PayingType == ExpendOrderPayingType.Card &&
            arguments[2] == 0
          ) {
            tpr = '优惠券'
          } else {
            tpr = RetailOrderSellSettleCouponType.Types[arguments[2]] || '-'
          }
          break
        case 'OrderTime':
          tpr = this.$options.filters.filterDateMinutes(arguments[2])
          break
        case 'PayingType':
          tpr = ExpendOrderPayingType.Types[arguments[2]]
          break
        case 'State':
          tpr = RetailOrderMasterState.Types[arguments[2]]
          break
        case 'CardactitId':
          if(row.TicketType == RetailOrderSellSettleTicketType.WalletCoupon){
            tpr = row.CouponId
          }else if(row.TicketType == RetailOrderSellSettleTicketType.CardActivity){
            tpr = row.CardactitId
          }else if(row.TicketType == RetailOrderSellSettleTicketType.QueueReceiveGold){
            tpr = row.QueueId
          }
          break
        case 'CertSeriesID':
        case 'Note':
          tpr = arguments[2] ? arguments[2] : '-'
          break
        case 'MaterialType':
          tpr = arguments[2] == 0 ? '-' : this.$store.getters.materialType.Types[arguments[2]]
          break
        case 'GoldType':
          tpr =
            arguments[2] == 0 || !this.$store.getters.goldType.Types[arguments[2]]
              ? '-'
              : this.$store.getters.goldType.Types[arguments[2]]
          break
        case 'CouponRate':
          tpr = this.$root.toFloat(arguments[2] * 100, 1) + '%'
          break
        case 'Expireb':
          tpr = this.$options.filters.filterDate(arguments[2])
          break
        case 'Expiree':
          tpr = this.$options.filters.filterDate(arguments[2])
          break
        case 'SettlePrice':
          if (StorePackageType.Date == arguments[0].PackageType &&
            this.characterType != CharacterType.Lingcb) {
            tpr = '-'
          } else {
            tpr = `￥${this.$root.toFloat(arguments[2])}`
          }
          break
        case 'TourRate':
          if (StorePackageType.Date == arguments[0].PackageType &&
            this.characterType != CharacterType.Lingcb) {
            tpr = '-'
          } else {
            tpr = `${this.$root.toFloat(arguments[2] * 100, 1)}%`
          }
          break
        case 'TourPrice':
          if (StorePackageType.Date == arguments[0].PackageType &&
            this.characterType != CharacterType.Lingcb) {
            tpr = '-'
          } else {
            tpr = `￥${this.$root.toFloat(arguments[2])}`
          }
          break
        case 'ProfitStatus':
          tpr = WalletCouponProfitStatus.Types[arguments[2]]
          break
        case 'ExpendStatus':
          tpr = WalletCouponExpendStatus.Types[arguments[2]]
          break
        case 'CouponStatus':
          tpr = WalletCouponStatus.Types[arguments[2]]
          break
        case 'GoldWeight':
          tpr = `${this.$root.toFloat(arguments[2], 3)}g`
          break
        case 'SettleRate':
          tpr = `${this.$root.toFloat(arguments[2],1,100)}`
          break
        
        default:
          tpr = `￥${this.$root.toFloat(arguments[2])}`
          break
      }
      return tpr
    },
    oneStatusformatter() {
      return WalletEquivXmlCouponStatus.Types[arguments[2]]
    }
  }
}
</script>
<style lang="scss" scoped="true">
.content {
  .title {
    height: 36px;
    color: #333;
    line-height: 36px;
    font-size: 14px;
    font-weight: bold;
    .icon-title {
      margin-right: 5px;
      color: #399fe5;
    }
  }
}
</style>