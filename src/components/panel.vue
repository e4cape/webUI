<template>
  <div :class="'panel' + (CustmerClass!=undefined?(' '+CustmerClass):'')">
    <div :class="'panel-header'+ (border?' bd-b':'') ">
      <slot name="header"></slot>
    </div>
    <div class="panel-body">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.panel {
  background: #f5f5f5;
  // border: 1px #ddd solid;
  border: none;
  color: #333;
  .panel-header {
    font-size: 14px;
    font-weight: 600;
    color: #777777;
    padding: 10px 15px;
    border-bottom: 1px solid transparent;
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;
  }
  .panel-body {
    padding: 15px;
    position: relative;
  }
  .bd-b {
    border-bottom: 1px #ddd solid;
  }
}
</style>

<script>
export default {
  props: {
    border: {
      type: Boolean
    },
    CustmerClass: {
      type: String
    }
  }
}
</script>