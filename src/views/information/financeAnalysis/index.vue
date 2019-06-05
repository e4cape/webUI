<template>
  <el-row>
    <div class="tabs">
      <span class="tab" name="1" :class="{'active': activeIndex == 1}" @click="activeIndex = 1">
        收支项目分析
      </span>
    </div>
    <div class="panel">
      <finance-in-out v-if="activeIndex == 1"></finance-in-out>
    </div>
  </el-row>
</template>

<script>
import FinanceInOut from './financeInOut'
export default {
  data() {
    return {
      activeIndex: 1
    }
  },
  methods: {
  },
  created() {},
  beforeMount() {},
  mounted() {},
  watch: {
  },
  components: {
    FinanceInOut
  }
}
</script>

<style lang="scss" scoped>
</style>

