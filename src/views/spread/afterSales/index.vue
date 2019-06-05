<template>
  <el-row>
    <div class="tabs">
      <span name="activeIndex0" class="tab" :class="{'active': activeIndex == 0}" @click="activeIndex = 0">
        退款单
      </span>
      <span name="activeIndex1" class="tab" :class="{'active': activeIndex == 1}" @click="activeIndex = 1">
        退款设置
      </span>
    </div>
    <div class="panel">
      <returnOrder v-if="activeIndex == 0"></returnOrder>
      <returnSet v-if="activeIndex == 1"></returnSet>
    </div>
  </el-row>
</template>

<script>
import returnOrder from './returnOrder'
import returnSet from './returnSet'
export default {
  data () {
    return {
      activeIndex: 0
    }
  },
  methods: {
    init () {
      let query = JSON.parse(JSON.stringify(this.$route.query || {
      }))
      query.activeIndex = this.activeIndex
      this.$router.replace({
        path: this.$router.path, query: query 
      })
    }
  },
  beforeMount () {
    let query = JSON.parse(JSON.stringify(this.$route.query || {
    }))
    this.activeIndex = query.activeIndex || 0
  },
  watch: {
    activeIndex: 'init'
  },
  components: {
    returnOrder,
    returnSet
  }
}
</script>
