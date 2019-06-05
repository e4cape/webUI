<template>
  <div class="card-q">
    <p>{{num}}</p>{{name}}
    <el-tooltip :content="tip">
      <i class="el-icon-question"></i>
    </el-tooltip>
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
    },
    tip: {
      type: String
    }
  }
}
</script>
<style lang="scss" scoped>

.card-q {
  height: 100px;
  line-height: 1;
  padding-top: 22px;
  background: $white;
  text-align: center;
  font-size: $base-font;
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
