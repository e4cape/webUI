<template>
  <div class="card">
    <p>{{num}}</p>
    {{name}}
  </div>
</template>
<script>
export default {
  props: {
    num: {
      type: [Number, String]
    },
    name: {
      type: String
    }
  }
}
</script>
<style lang="scss" scoped>

.card {
  height: 100px;
  line-height: 1;
  padding-top: 22px;
  text-align: center;
  p {
    height: 24px;
    margin: 0 0 18px;
    font-size: 24px;
  }
  i {
    color: $gray;
  }
}
</style>