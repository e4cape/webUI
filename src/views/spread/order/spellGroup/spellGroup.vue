<template>
  <el-row>
    <div class="tabs">
      <span class="tab" name="active0" :class="{'active': activeIndex == 0}" @click="$router.push({path: '/spread/order/spellGroup/allOrder?spreadId=' + spreadId})">
        全部订单
      </span>
      <span class="tab" name="active1" :class="{'active': activeIndex == 1}" @click="$router.push({path: '/spread/order/spellGroup/groupData?spreadId=' + spreadId})">
        开团数据
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
      activeIndex: 0,
      spreadId: ''
    }
  },
  methods: {
    init () {
      this.activeIndex = this.$route.path.indexOf('allOrder') > 0 ?  0 : 1
    }
  },
  beforeMount () {
    this.spreadId = this.$route.query.spreadId
    this.init()
  },
  watch: {
    $route: 'init'
  }
}
</script>
