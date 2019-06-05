<template>
  <div class="clearfix side-bar" v-loading="loading">
    <!-- 系统菜单 start -->
    <ul class="sys-tab" :style="'width:'+firstMenuWidth">
      <li @click="MenuFlex">
        <el-tooltip class="item" effect="dark" content="点击伸缩" :disabled="firstMenuWidth=='140px'" placement="right">
          <div>
            <span>
              <i class="icon-zhankai"></i>
            </span>
            <p class="sys-link" v-if="firstMenuWidth=='140px'">点击伸缩</p>
          </div>
        </el-tooltip>
      </li>
      <li :class="curSys==0?'cur':''" @click="getQuickList">
        <el-tooltip class="item" effect="dark" content="常用功能" :disabled="firstMenuWidth=='140px'" placement="right">
          <div>
            <span>
              <i class="icon-star"></i>
            </span>
            <p class="sys-link" v-if="firstMenuWidth=='140px'">常用功能</p>
          </div>
        </el-tooltip>
      </li>
      <li v-for="(item,index) in $store.getters.menus" :key="index" :class="curSys==index+1?'cur':''" @click="exchangeSys(index+1)">
        <el-tooltip class="item" effect="dark" :content="item.SystemName" :disabled="firstMenuWidth=='140px'" placement="right">
          <div>
            <span>
              <i :class="item.NaviIcon"></i>
            </span>
            <p class="sys-link" v-if="firstMenuWidth=='140px'">{{item.SystemName}}</p>
          </div>
        </el-tooltip>
      </li>
    </ul>
    <!-- 系统菜单 end -->
    <!-- 当前系统菜单 start -->
    <div class="sys-menu" :style="'width:'+SubMenuWidth">
      <h2 class="menu-title" v-show="isShow">
        <span>{{curSys==0?'常用功能':($store.getters.menus[curSys-1]?$store.getters.menus[curSys-1].SystemName:'')}}</span>
        <i name="btnGetPackMenuList" class="icon-set" v-if="curSys==0" @click="editPackMenuVisible = true" title="常用功能菜单设置"></i>
      </h2>
      <el-scrollbar ref="sideScroll" class="lcb-sidBar">
        <el-menu v-show="isShow" :default-active="onRoutes" :default-openeds="subOpens" router style="width:100%">
          <template v-for="item in (!!$store.getters.menus[curSys-1]?$store.getters.menus[curSys-1].Subs:[])">
            <template v-if="curSys!=0 && showFirstMenu(item)">
              <el-submenu v-if="item.SubName != '默认分组'" :key="item.SubId" :index="item.SubId +''">
                <template slot="title">
                  <span>{{item.SubName}}</span>
                </template>
                <template v-for="subItem in item.Menus">
                  <el-menu-item v-if="subItem.HasPower" :key="subItem.LinkUrl" :index="subItem.LinkUrl" :route="{path:subItem.LinkUrl}">{{subItem.MenuName}}</el-menu-item>
                </template>
              </el-submenu>
              <template v-else>
                <template v-for="subItem in item.Menus">
                  <el-menu-item v-if="subItem.HasPower" :key="subItem.LinkUrl" :index="subItem.LinkUrl" :route="{path:subItem.LinkUrl}">{{subItem.MenuName}}</el-menu-item>
                </template>
              </template>
            </template>
          </template>
          <template v-for="item in quickList">
            <el-menu-item v-if="curSys==0" :key="item.LinkUrl" :index="item.LinkUrl||''" :route="{path:item.LinkUrl}">{{item.MenuName}}</el-menu-item>
          </template>
        </el-menu>
      </el-scrollbar>
    </div>
    <div name="btnSysMenuFlex" :class="isShow?'sys-menu-flex  clearfix':'sys-menu-flex sys-menu-rotate  clearfix'" @click="sysMenuFlex">
      <span></span>
      <i class="icon-flex"></i>
    </div>
    <!-- 当前系统菜单 end -->
    <!-- 常用功能管理对话框 start -->
    <menu-setter v-if="editPackMenuVisible" :data="packMenuAllList" :current="packMenuCurrentList" :props="{key: 'MenuId'}" @changed="saveCurrentMenus" :visible.sync="editPackMenuVisible">
      <span slot-scope="scope">{{ scope.option.MenuCode }} - {{ scope.option.MenuName }}</span>
    </menu-setter>
    <!-- 常用功能管理对话框 end -->
  </div>
</template>
<script>
import menuSetter from './menuSetter'
import {
  MERCHANT_API_SECURITY_QUICK_GETS,
  MERCHANT_API_SECURITY_QUICK_UPDATE
} from '@/apis/merchant'
import { YNStatus } from '@/enums/common'
import { SecurityPackType } from '@/enums/merchant'
export default {
  data() {
    return {
      firstMenuWidth: localStorage.getItem('firstMenuWidth') || '140px',
      sysMenuWidth: 140,
      SubMenuWidth: '140px',
      isShow: true,
      isCollapse: false,
      isFast: true,
      editPackMenuVisible: false,
      quickList: [],
      curSys: sessionStorage.getItem('curSys') || 0,
      loading: false,
      storePackDetail: '',
      changeBtn: true,
      menulistParams: {},
    }
  },
  computed: {
    onRoutes() {
      const path = this.$route.meta.parentPath
        ? this.$route.meta.parentPath
        : this.$route.path
      return path
    },
    subOpens() {
      let result = []
      this.$store.getters.menus.forEach(sys => {
        sys.Subs &&
          sys.Subs.forEach(sub => {
            result.push(sub.SubId + '')
          })
      })
      return result
    },
    packMenuAllList() {
      let menus = []
      this.$store.getters.menus.forEach(sys => {
        sys.Subs &&
          sys.Subs.forEach(sub => {
            menus = menus.concat(sub.Menus || [])
          })
      })
      return menus
    },
    packMenuCurrentList() {
      return this.quickList.filter(item => {
        if (
          this.packMenuAllList.findIndex(a => a.MenuId === item.MenuId) > -1
        ) {
          return item
        }
      })
    }
  },
  methods: {
    showFirstMenu(item) {
      let flag = false
      item.Menus = item.Menus ? item.Menus : []
      const tprAry = item.Menus.find(item => item.HasPower == true)
      if (tprAry) {
        flag = true
      }
      return flag
    },
    MenuFlex() {
      if (this.firstMenuWidth == '140px') {
        this.firstMenuWidth = '40px'
        this.$emit('isFlex', true)
      } else {
        this.firstMenuWidth = '140px'
        this.$emit('isFlex', false)
      }
      localStorage.setItem('firstMenuWidth', this.firstMenuWidth)
    },
    sysMenuFlex() {
      if (this.isShow) {
        this.SubMenuWidth = '0'
        this.isShow = false
      } else {
        this.SubMenuWidth = '140px'
        this.isShow = true
      }
      this.$emit('isShow', this.isShow)
    },
    saveCurrentMenus(value) {
      let arr = []
      value.forEach((item, index) => {
        arr.push({
          MenuId: item,
          SortId: index + 1
        })
      })

      this.$store.commit('SET_FULL_LOADING', true)
      MERCHANT_API_SECURITY_QUICK_UPDATE({
        Items: arr
      }).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.$message.success(res.data.Message)
          this.editPackMenuVisible = false
          this.getQuickList()
        }
      })
    },
    getQuickList() {
      this.curSys = 0
      sessionStorage.setItem('curSys', 0)
      this.loading = true
      MERCHANT_API_SECURITY_QUICK_GETS()
        .then(res => {
          this.loading = false
          if (res.data.Code == 'CORRECT') {
            this.quickList = res.data.Data.Rows || []
            if (this.SubMenuWidth == 0) {
              this.sysMenuFlex()
            }
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    exchangeSys(i) {
      this.curSys = i
      sessionStorage.setItem('curSys', i)
      const curSys = this.$store.getters.menus[i - 1]
      if (this.SubMenuWidth == 0) {
        this.sysMenuFlex()
      }
      if (curSys.TerminalType == SecurityPackType.Outer) {
        open(curSys.SystemLinkUrl)
      } else {
        if (curSys.IsAjax == YNStatus.Yes) {
          this.$router.push('/introduction/' + curSys.SystemId)
        }
      }
    },
    forEachList(path) {
      this.$store.getters.menus.forEach((item1, index1) => {
        if (this.$route.params.id == item1.SystemId) {
          this.$store.state.curSys = index1 + 1
          if (this.$route.path) {
            this.exchangeSys(index1 + 1)
          }
        } else {
          if (item1.Subs) {
            item1.Subs.forEach(item2 => {
              if (item2.Menus && item2.Menus.some(val => val.LinkUrl == path)) {
                this.$store.state.curSys = index1 + 1
                this.curSys = index1 + 1
                sessionStorage.setItem('curSys', index1 + 1)
                if (this.SubMenuWidth == 0) {
                  this.sysMenuFlex()
                }
              }
            })
          }
        }
      })
    }
  },
  mounted() {
    window.navigator.userAgent.indexOf('Firefox') > -1
      ? (this.$refs['sideScroll'].$el.style.height = 'calc( 100% - 90px)')
      : (this.$refs['sideScroll'].$el.style.height = 'calc( 100% - 40px)')
    if (this.curSys == 0) {
      this.getQuickList()
    }
  },
  watch: {
    '$route.path'() {
      const path = this.$route.meta.parentPath
        ? this.$route.meta.parentPath
        : this.$route.path
      if (this.curSys != 0) {
        this.forEachList(path)
        return
      } else {
        let flag = false
        this.quickList &&
          this.quickList.forEach(item => {
            if (this.$route.params.id == item.MenuId) {
              this.$store.state.curSys = 0
            } else {
              if (item.LinkUrl == path) {
                flag = true
              }
            }
          })
        if (flag) {
          return
        }
        this.forEachList(path)
      }
    }
  },
  components: {
    menuSetter
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/sass/sidebar.scss';
@import 'compass/css3';

.transfer-box {
  @include justify-content(center);
  @include justify-content(center);
  @include display-flex;

  .transfer-tool {
    width: 80px;
    padding-left: 20px;
    position: relative;

    .el-button + .el-button {
      margin-left: 0;
      margin-top: 12px;
    }

    .btn-box {
      position: absolute;
      top: 50%;
      margin-top: -30px;
    }
  }
}
</style>
<style lang="scss">
.sys-menu {
  .el-menu-item,
  .el-submenu__title {
    font-size: 12px;
  }

  .el-submenu__title {
    padding: 0 0 0 10px !important;
    height: 30px;
    line-height: 30px;
    text-align: left;
  }

  .el-menu-item-group__title {
    padding: 0 !important;
  }

  .el-submenu .el-menu-item,
  .el-menu-item {
    min-width: auto;
    height: 30px;
    line-height: 30px;
    text-align: left;
    padding-left: 10px !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .el-submenu .el-menu .el-menu-item {
    padding: 0 14px 0 26px !important;
  }

  .el-submenu__icon-arrow {
    right: 7px;
  }
}
.lcb-sidBar {
  width: 140px;
  height: calc(100% - 40px);
}
</style>
