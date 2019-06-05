<template>
  <el-row>
    <div class="tabs">
      <span
        class="tab"
        name="first"
        :class="{ active: $route.path.includes('theStatistics') }"
        @click="$router.push('/report/statisticsReport/scoreReport/theStatistics')"
      >积分统计</span>
      <span
        class="tab"
        name="second"
        :class="{ active: $route.path.includes('statement') }"
        @click="$router.push('/report/statisticsReport/scoreReport/statement') "
      >积分对账单</span>
    </div>
    <div class="panel p-10">
      <router-view></router-view>
    </div>
  </el-row>
</template>
<script>
export default {
  beforeMount() {
    if (this.$route.path.includes('statement')) {
      this.$router.push('/report/statisticsReport/scoreReport/statement')
    } else {
      this.$router.push('/report/statisticsReport/scoreReport/theStatistics')
    }
  }
}
</script>
