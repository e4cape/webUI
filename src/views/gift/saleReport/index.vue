<template>
  <el-row>
    <div class="tabs">
      <span class="tab" name="btnSaleTrend" :class="{'active': $route.path.indexOf('saleTrend') > -1}" @click="$router.push({path:'/gift/saleReport/index/saleTrend'})">
        礼品兑换统计
      </span>
      <span class="tab" name="btnSaleDetail" :class="{'active': $route.path.indexOf('saleDetail') > -1}" @click="$router.push({path:'/gift/saleReport/index/saleDetail'})">
        礼品兑换明细
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
