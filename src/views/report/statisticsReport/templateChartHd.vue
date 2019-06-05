<template>
  <div class="chart-hd">
    <slot></slot>
  </div>
</template>
<style lang="scss" scoped>
.chart-hd {
  height: 34px;
  line-height: 34px;
  padding: 0 10px;
  background: $bg-color;
  &:after {
    content: '';
    display: table;
    clear: both;
  }
  .bold {
    font-weight: bold;
    font-size: $base-font;
    span {
      font-weight: normal;
    }
  }
  .item {
    position: relative;
    margin-left: 10px;
    /deep/ .el-input__inner {
      height: 24px;
      line-height: 24px;
    }
    &.radiogroup {
      /deep/ .el-radio-button__inner {
        position: relative;
        top: -1px;
        padding: 5px 25px;
      }
    }
    &.daterange {
      position: relative;
      top: 3px;
      /deep/ .el-icon-date {
        position: relative;
        top: -2px;
      }
      /deep/ .el-range-separator {
        position: relative;
        top: -2px;
      }
      /deep/ .el-range__close-icon {
        position: relative;
        top: -2px;
      }
    }
  }
  & > span {
    margin-left: 10px;
  }
  .range-set {
    color: $light-blue;
    cursor: pointer;
  }
}
</style>
