<template>
  <el-row>
    <div class="tabs">
      <span class="tab" name="active0" :class="{ active: this.$route.path.indexOf('college') > -1 }" @click="$router.push({path: '/science/categories/college'})">珠宝学院</span>
      <span class="tab" name="active1" :class="{ active: this.$route.path.indexOf('system') > -1 }" @click="$router.push({ path: '/science/categories/system' }) ">系统培训</span>
    </div>
    <div class="panel">
      <router-view></router-view>
    </div>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
    }
  },
  methods: {
  },
  mounted() {},
  watch: {
  }
}
</script>

<style scoped lang="scss">
.panel {
  padding: 10px;
}
</style>
