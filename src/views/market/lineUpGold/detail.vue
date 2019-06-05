<template>
  <div class="content">
    <div class="tabs">
      <div class="tab" :class="{active: activedItem === 1}" @click="activedItem=1">活动详情</div>
      <div class="tab" :class="{active: activedItem === 2}" @click="activedItem=2">领取统计</div>
      <div class="tab" :class="{active: activedItem === 3}" @click="activedItem=3">使用统计</div>
    </div>
    <main>
      <activity-detail v-if="activedItem === 1"></activity-detail>
      <receive-count v-else-if="activedItem === 2"></receive-count>
      <used-count v-else></used-count>
    </main>
  </div>
</template>

<script>
export default {
  components: {
    'activity-detail': () => import('./activityDetail.vue'),
    'receive-count': () => import('./receiveCount.vue'),
    'used-count': () => import('./usedCount.vue')
  },
  data() {
    return {
      activedItem: 1,
    }
  }
}
</script>
<style lang="scss" scoped>
main {
  display: block;
  padding: 10px;
  border: 1px solid #e5e5e5;
}
</style>
