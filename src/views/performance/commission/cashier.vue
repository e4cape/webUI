
<template>
  <div class="content">
    <Create v-if="positionName != ''" :positionName="positionName"></Create>
  </div>
</template>
<script>
import Create from './create.vue'
export default {
  data () {
    return {
      positionName: ''
    }
  },
  components: {
    Create
  },
  mounted () {
    this.positionName = this.$route.path.split('/')[3]
  }
}
</script>
<style scoped>
  .content-view{position: relative}
</style>
