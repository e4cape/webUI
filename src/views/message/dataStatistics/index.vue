<template>
  <el-row>
    <div class="tabs">
      <span class="tab" :class="{'active': activeIndex === 0}" name="btnPlatformRecharge" @click="changeIndex(0)">
        平台充值
      </span>
      <span class="tab" :class="{'active': activeIndex === 1}" name="btnMerchantRecharge" @click="changeIndex(1)">
        商家充值
      </span>
      <span class="tab" :class="{'active': activeIndex === 2}" name="btnSendStatistics" @click="changeIndex(2)">
        发送统计
      </span>
    </div>
    <div class="panel">
      <keep-alive>
        <statistics-station v-if="activeIndex === 0"></statistics-station>
        <statistics-store v-if="activeIndex === 1"></statistics-store>
        <statistics-send v-if="activeIndex === 2"></statistics-send>
      </keep-alive>
    </div>
  </el-row>
</template>
<script>
import statisticsStation from './statisticsStation'
import statisticsStore from './statisticsStore'
import statisticsSend from './statisticsSend'
export default {
  data() {
    return {
      activeIndex: 0
    }
  },
  methods: {
    changeIndex (v) {
      this.activeIndex = v
      this.$router.replace({
        path: '/message/dataStatistics/index', query: {
          activeIndex: v
        } 
      })
    }
  },
  mounted () {
    try{
      this.activeIndex = parseInt(this.$route.query.activeIndex) || 0
    } catch(e) {
      this.activeIndex = 0
    }

  },
  watch: {
  },
  components: {
    statisticsStation,
    statisticsStore,
    statisticsSend
  }
}
</script>

<style lang="scss" scoped>

  .panel{
    min-width: 1145px ;
  }
</style>
