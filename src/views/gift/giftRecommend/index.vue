<template>
  <el-row>
    <div class="tabs">
      <span class="tab" name="btnMainRecommend" :class="{'active': $route.path.indexOf('mainRecommend') > -1}" @click="$router.push('/gift/giftRecommend/mainRecommend')">
        商城首页推荐
      </span>
      <span class="tab" name="btnCartRecommend"  :class="{'active': $route.path.indexOf('cartRecommend') > -1}" @click="$router.push('/gift/giftRecommend/cartRecommend')">
        购物车页面推荐
      </span>
    </div>
    <div class="panel">
      <router-view></router-view>
    </div>
  </el-row>
</template>

<script>
export default {
}
</script>
