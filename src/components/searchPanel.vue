<template>
  <div :class="isSeniors?'search-main is-show':'search-main'">
    <el-row type="flex" class="fix-select">
      <el-col :span="12" class="left">
        <slot name="btnBox"></slot>
      </el-col>
      <el-col :span="12" align="right">
        <slot name="simpleSearch"></slot>
        <el-form-item v-if="isSenior">
          <el-button name="btnSearchToggle" type="text" @click="searchToggle">{{isSeniors?'普通搜索':'高级搜索'}}</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row class="search-box m-b-10" type="flex" v-if="isSenior">
      <el-col>
        <slot name="seniorSearch"></slot>
      </el-col>
      <el-col class="search-btn">
        <el-button name="btnSearch" type="primary" @click="onSearch"> 搜索</el-button>
        <el-button name="btnReset" type="default" class="m-l-10" @click="onReset"> 重置</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isSeniors: this.$route.query.isSenior === 'true' ? true : false
    }
  },
  props: {
    isSenior: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  methods: {
    searchToggle() {
      if (this.isSeniors) {
        this.isSeniors = false
      } else {
        this.isSeniors = true
      }
      this.$emit('exChangeState', this.isSeniors)
    },
    onSearch(e) {
      this.$emit('onSearch', e)
    },
    onReset(e) {
      this.$emit('onReset', e)
    }
  },
  mounted() {
    // console.log(this.isSenior, 'xxx')
  }
}
</script>

<style lang='scss' scoped>
@import 'compass/css3';
.search-main {
  overflow: hidden;
  max-height: 38px;
  will-change: max-height;
  @include transition-property(max-height);
  @include transition-duration(0.5s);
}

.is-show {
  max-height: 600px;
}
.left {
  min-width: 600px;
}
</style>
