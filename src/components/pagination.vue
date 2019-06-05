<template>
  <div class="pagination" v-if="total > 0">
    <a href="javascript:;" @click="pg!=1?pgChange(1):''" class="first" :class="{disabled:pg==1}">首页</a>
    <a href="javascript:;" @click="pg!=1?pgChange(pg - 1):''" class="prev" :class="{disabled:pg==1}"><i class="el-icon-arrow-left"></i></a>
    <template v-if="pgCount > max && pg > max / 2 + 1">
      <a href="javascript:;" @click="pgChange(1)" :class="{active:pg == 1}">1</a>
      <span>...</span>
    </template>
    <template v-for="p in pages">
      <a href="javascript:;" :key="p" @click="pgChange(p)" :class="{'active':pg==p}">{{ p }}</a>
    </template>
    <template v-if="pgCount > max && pg < pgCount - max / 2">
      <span>...</span>
      <a href="javascript:;" @click="pgChange(pgCount)" :class="{active:pg == pgCount}">{{ pgCount }}</a>
    </template>
    <a href="javascript:;" @click="pg!=pgCount?pgChange(pg - 0 + 1):''" class="next" :class="{disabled:pg==pgCount}"><i class="el-icon-arrow-right"></i></a>
    <a href="javascript:;" @click="pg!=pgCount?pgChange(pgCount):''" class="last" :class="{disabled:pg==pgCount}">末页</a>
    <div class="dropdown">
      <span >
        {{size}}条
        <i class="el-icon-arrow-down"></i>
      </span>
      <ul class="dropdown-list">
        <li>
          <a href="javascript:;" v-for="(item,index) in sizes" :key="index" @click="pgSizeChange(item)">{{item}}条</a>
        </li>
      </ul>
    </div>
    <span class="txt-count">每页{{size}}条，共{{total}}条</span>
  </div>
</template>

<script>
export default {
  props: {
    pg: {
      type: [Number,String],
      default: 1
    },
    total: {
      type: Number,
      default: 0
    },
    size: {
      type: [Number,String],
      default: 20
    },
    sizes: { // 因为阿里视频限制最大值100，传200查不到所有数据，所以增加这个
      type: Array,
      default: ()=>[10, 20, 50, 100, 200]
    }
  },
  data() {
    return {
      path: '',
      pgCount: 1,
      start: 1,
      last: 1,
      max: 9,
      pages: [],
      num: 1
    }
  },
  methods: {
    init() {
      let vm = this
      vm.pgCount = Math.ceil(vm.total / vm.size) // 计算总页数
      if (vm.pg > vm.pgCount && vm.pgCount !== 0) {
        vm.pg = vm.pgCount
      }
      if (vm.pgCount <= vm.max) {
        vm.start = 1
        vm.last = vm.pgCount + 1
      } else {
        if (vm.pg < vm.max / 2 + 1) {
          // 计算显示的页码
          vm.start = 1
          vm.last = vm.max
        } else if (vm.pg > vm.pgCount - vm.max / 2) {
          vm.start = vm.pgCount - vm.max + 2
          vm.last = vm.pgCount + 1
        } else {
          vm.start = vm.pg - (vm.max - 3) / 2
          vm.last = parseInt(vm.pg) + (vm.max - 1) / 2
        }
      }
      vm.pages = []
      for (let i = vm.start; i < vm.last; i++) {
        // 显示页码
        vm.pages.push(i)
      }
      vm.num =
        parseInt(vm.pg) + 1 > vm.pgCount ? vm.pgCount : parseInt(vm.pg) + 1
    },
    change() {
      if (!/\d+/.test(this.num) || this.num === 0) {
        this.num = this.pg + 1
      } else if (this.num > this.pgCount) {
        this.num = this.pgCount
      }
    },
    pgChange(val) {
      if (!val) {
        val = this.pg === this.pgCount ? this.pgCount : parseInt(this.pg) + 1
      }
      this.$emit('currentChange', val)
    },
    pgSizeChange(val) {
      this.$emit('sizeChange', val)
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    total: 'init',
    pg: 'init',
    size: 'init'
  }
}
</script>
<style lang="scss" scoped>
.pagination {
  margin: 10px 0;
  font-size: 0;
  > a {
    display: inline-block;
    min-width: 30px;
    height: 22px;
    padding: 0 2px;
    line-height: 22px;
    margin-right: 5px;
    text-align: center;
    color: #333;
    font-size: 12px;
    box-sizing: border-box;

    &.active,
    &.disabled {
      cursor: not-allowed;
    }
    &.first,
    &.last {
      width: 48px;
    }
    &.next {
      border-right-width: 1px;
    }
  }
  > span {
    display: inline-block;
    width: 20px;
    height: 20px;

    font-size: 12px;
    vertical-align: top;
    text-align: center;
    &.txt {
      line-height: 30px;
      font-size: 12px;
      border: 0;
      vertical-align: top;
      &:nth-child(1) {
        width: 2px;
      }
    }
    &.txt-count {
      width: auto;
      margin-right: 10px;
      line-height: 22px;
      font-size: 12px;
      border: 0;
      vertical-align: top;
      white-space: nowrap;
      float: right;
    }
  }
  > input.current {
    width: 40px;
    height: 20px;
    vertical-align: top;
    text-align: center;
    font-size: Microsoft YaHei, Airal;
  }
  .dropdown {
    display: inline-block;
    position: relative;
    line-height: 20px;

    border-radius: 2px;
    cursor: pointer;
    vertical-align: top;
    > span {
      display: inline-block;
      padding: 0 20px;
      padding-right: 15px;
      font-size: 12px;
      border: 0;
      vertical-align: middle;
    }
    .dropdown-list {
      display: none;
      position: absolute;
      left: 0;
      right: 0;
      z-index: 100;
      bottom: 19px;

      border-radius: 2px;
      text-align: left;
      a {
        display: block;
        padding-left: 18px;
        font-size: 12px;

        line-height: 2;
      }
    }
    &:hover {
      i {
        transform: rotate(180deg);
      }
      .dropdown-list {
        display: block;
      }
    }
  }
}
</style>

