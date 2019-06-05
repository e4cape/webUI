<template>
  <div class="content">
    <lingcb-list v-if="ifLingcb"></lingcb-list>
    <store-list v-else></store-list>
  </div>
</template>

<script>
export default {
  components: {
    'store-list': () => import('./storeList.vue'),
    'lingcb-list': () => import('./couponList.vue')
  }
}
</script>