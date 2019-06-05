<template>
  <div class="content">
    <ul class="tabs">
      <router-link
        name="linkInfo"
        class="tab active"
        tag="li"
        to=""
      >卡券信息</router-link>
      <router-link
        name="linkSale"
        class="tab"
        tag="li"
        v-if="path=='salecardsunlinebasic'||path=='salecardsonlinebasic'"
        :to="{path:path=='salecardsonlinebasic'?'/market/coupon/couponorderonlinelist/'+$route.params.id:'/market/coupon/couponorderunlinelist/'+$route.params.id}"
      >卡券销售</router-link>
      <router-link
        name="linkUse"
        class="tab"
        :to="{path:'/market/coupon/'+(path=='couponbasic'?'couponitem':(path=='giftcouponbasic')?'giftcouponitem':(path=='salecardsonlinebasic'?'salecardsonlineitem':'salecardsunlineitem'))+'/'+$route.params.id}"
      >{{/(salecards)/.test($route.path)? '使用统计' : '投放与使用'}}</router-link>
    </ul>
    <div
      class="p-20"
      style="border:1px #e5e5e5 solid;"
    >
      <coupon-detail :CouponId="$route.params.id.split('&')[0]"></coupon-detail>
    </div>
  </div>
</template>
<script>
import CouponDetail from './couponDetail.vue'

export default {
  data() {
    return {
      path: this.$route.path.split('/')[3]
    }
  },
  components: {
    CouponDetail
  }
}
</script>
<style lang="scss" scoped>
.code {
  text-align: center;
  line-height: 1.5;

  dl {
    text-align: left;
  }
}

.detail-list {
  li {
    padding: 10px 0;
  }
}
</style>
