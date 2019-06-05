<template>
  <div>
    <el-container :class="themeName">
      <el-header height="50px">
        <header-bar></header-bar>
      </el-header>
      <el-container>
        <el-aside :width="sideBarWidth+'px;overflow:inherit'">
          <side-bar @isShow="flexWidth" @isFlex="flexWidthSys"></side-bar>
        </el-aside>
        <el-scrollbar>
          <el-main>
            <router-view></router-view>
          </el-main>
        </el-scrollbar>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import headerBar from '@/components/headerBar.vue'
import sideBar from '@/components/sideBar.vue'
export default {
  data() {
    return {
      sideBarWidth: 180,
      themeName: this.$store.state.themeName
    }
  },
  components: {
    headerBar,
    sideBar
  },
  methods: {
    flexWidth(data) {
      if (data) {
        this.sideBarWidth = this.sideBarWidth + 140
      } else {
        this.sideBarWidth = this.sideBarWidth - 140
      }
    },
    flexWidthSys(data) {
      if (data) {
        this.sideBarWidth = this.sideBarWidth - 100
      } else {
        this.sideBarWidth = this.sideBarWidth + 100
      }
    }
  },
  created() {
    this.$store.dispatch('GET_MENUS_DROPLIST')
  },
  watch: {
    sideBarWidth() {
      this.$store.state.menuWidth = this.sideBarWidth
    },
    '$store.state.themeName'() {
      this.themeName = this.$store.state.themeName
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'compass/css3';

.header-content {
  height: 50px;
}

.el-header {
  padding: 0;
}

.el-aside {
  overflow: inherit;
}

.el-main {
  padding: 10px;
}
@-moz-document url-prefix() {
  .el-main {
    padding-bottom: 60px !important;
  }
}

.el-scrollbar {
  width: 100%;
  height: 100%;

  .el-scrollbar__wrap {
    overflow: hidden;
    overflow-y: scroll;
  }
}
</style>
