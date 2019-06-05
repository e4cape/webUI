<template>
  <el-row>
    <div class="tabs">
      <span name="topUpStatistics" class="tab" :class="{'active': activeIndex == 0}" @click="$router.push({path: '/gift/characterJeweller/topUpStatistics'})">
        充值统计
      </span>
      <span name="rechargeStatement" class="tab" :class="{'active': activeIndex == 1}" @click="$router.push({path: '/gift/characterJeweller/rechargeStatement'})">
        充值对账单
      </span>
    </div>
    <div class="panel">
      <router-view></router-view>
    </div>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: 0
    }
  },
  methods: {
    init () {
      this.activeIndex = this.$route.path.indexOf('topUpStatistics') > 0 ? 0 : 1
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    $route: 'init'
  },
}
</script>