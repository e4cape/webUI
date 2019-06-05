<template>
  <el-row>
    <div class="tabs">
      <span class="tab" name="active0" :class="{'active': this.$route.path.indexOf('cardDetail') > -1}" @click="$router.push({path: '/alliance/cardCheck/cardDetail'})">
        卡券信息
      </span>
      <span class="tab" name="active1" :class="{'active': this.$route.path.indexOf('proAndTrans') > -1}" @click="$router.push({path: '/alliance/cardCheck/proAndTrans'})">
        推广与转化
      </span>
    </div>
    <div class="panel">
      <router-view></router-view>
    </div>
  </el-row>
</template>

<script>
export default {
  beforeMount() {},
  data() {
    return {
      activeIndex: 0,
      nick: ''
    }
  }
}
</script>
