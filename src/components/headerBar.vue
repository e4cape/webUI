<template>
  <div class="header-main clearfix">
    <router-link
      :to="$store.getters.user_session.CharacterType == CharacterType.Lingcb ? '/home/platform' : $store.getters.user_session.CharacterType == CharacterType.Group ? '/home/group' : $store.getters.user_session.CharacterType == CharacterType.Company ? '/home/company' : $store.getters.user_session.CharacterType == CharacterType.Supplier ? '/home/supplier' : $store.getters.user_session.CharacterType == CharacterType.Provider ? '/home/provider' : '/home'"
      class="logo"
    >{{$store.getters.user_session.CharacterName}}</router-link>
    <div class="header-content">
      <div class="brand-title">
        <span>{{routeName}}</span>
      </div>
      <div class="user-tool">
        <el-dropdown class="user" @command="handleCommand">
          <span class="user-dropdown-link">
            <img
              class="wx-img"
              width="30px"
              height="30px"
              v-if="$store.getters.user_session.ImageUrl && $store.getters.user_session.ImageUrl.indexOf('http') === 0"
              :src="$store.getters.user_session.ImageUrl"
              alt
            >
            <img width="30px" height="30px" v-else :src="$store.getters.user_session.ImageUrl && $root.settings.DOMAIN_IMG_FILE + $store.getters.user_session.ImageUrl.replace('{0}', '1080x0')" alt>
            <span>{{$store.getters.user_session.TrueName?$store.getters.user_session.TrueName:$store.getters.user_session.AliasName}}</span>
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="init-userdrodown">
            <el-dropdown-item command="personal_setting">
              <i class="el-icon-setting p-r-10"></i>
              <span>个人设置</span>
            </el-dropdown-item>
            <el-dropdown-item command="personal_pwd">
              <i class="el-icon-edit-outline p-r-10"></i>
              <span>修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item
              command="personal_download"
              v-if="$store.getters.user_session.CharacterType==CharacterType.Group||$store.getters.user_session.CharacterType==CharacterType.Company||$store.getters.user_session.CharacterType==CharacterType.Store"
            >
              <i class="el-icon-download p-r-10"></i>
              <span>我的下载</span>
            </el-dropdown-item>
            <el-dropdown-item command="access_token_logout">
              <i class="el-icon-circle-close p-r-10"></i>
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="user-tool-link">
          <span name="btnGetNoticeList" v-if="$store.getters.user_session.CharacterType != CharacterType.Lingcb" @click="getNoticeList(true)" :class="isNew?'is-new-note':''">
            <i></i>
            <i class="icon-tixing"></i>
          </span>
          <el-popover placement="bottom" width="340" trigger="hover">
            <span slot="reference">
              <i></i>
              <i class="icon-tips"></i>
            </span>
            <div class="header-help">
              <div class="help-code">
                <el-row type="flex" justify="center">
                  <el-col :span="12">
                    <img src="/static/images/lcb-wechat-1.jpg" width="160" alt="技术客服1">
                    <p>
                      <i class="icon-service service"></i> 技术客服1
                    </p>
                    <p>15920024182</p>
                  </el-col>
                  <el-col :span="12">
                    <img src="/static/images/lcb-wechat-2.jpg" width="160" alt="技术客服2">
                    <p>
                      <i class="icon-service service"></i> 技术客服2
                    </p>
                    <p>13922804544</p>
                  </el-col>
                </el-row>
              </div>
              <span>
                <i class="el-icon-phone"></i>投诉热线：15915302829
              </span>
            </div>
          </el-popover>
          <span @click="showThemeSet">
            <i></i>
            <i class="icon-theme"></i>
          </span>
        </div>
      </div>
    </div>
    <div class="shadow" :style="isShow?'display:block':''" @click="isShow=false">
      <div :class="isShow?'theme-set is-active':'theme-set'" :style="'background: '+ themeList[themeIndex].color">
        <h2 class="slide-title clearfix">
          <i class="el-icon-circle-close" @click="isShow=false"></i>皮肤设置
        </h2>
        <ul class="theme-list">
          <li v-for="(item,index) in themeList" :key="index" :class="item.isDefault?'cur':''" :style="{background:item.color}" @click="selectTheme(index)">
            <i class="icon-gou"></i>
            {{item.themeText}}
          </li>
        </ul>
        <span class="btn-set" @click="setDefault">恢复默认</span>
        <!--   <span class="btn-set" @click="setTheme"><i class="icon-xiaogou"></i></span> -->
      </div>
    </div>
    <el-dialog title="系统通知" :visible.sync="visible" custom-class="informs">
      <el-row type="flex" style="overflow: hidden;">
        <el-col class="informs-left">
          <div class="informs-left-header">
            <i class="icon-list"></i>
            <span>消息列表</span>
          </div>
          <ul class="informs-left-item">
            <li class="item-list" @click="chooseNotice(item.NoticeId)" :class="{active: choose == item.NoticeId}" v-for="(item,index) in noticeList" :key="index">
              <span>{{item.NoticeTitle}}</span>
            </li>
          </ul>
          <div class="left-bottom">
            <a href="javascript:void(0)" class="prev" :class="{disabled:pg==1}" @click="prev">
              <i class="el-icon-caret-left"></i>
            </a>
            <span>{{pg}}/{{pgCount}}</span>
            <a href="javascript:void(0)" class="prev" :class="{disabled:pg==pgCount}" @click="next">
              <i class="el-icon-caret-right"></i>
            </a>
          </div>
        </el-col>
        <el-col class="informs-right" v-loading="noticeLoading">
          <div class="informs-right-item">
            <div class="inform-right-title">{{noticeDetail.NoticeTitle}}</div>
            <div class="info">
              <div class="time">{{noticeDetail.CheckTime}}</div>
              <div class="name">零成本</div>
            </div>
            <div class="inform-right-content" v-html="noticeDetail.NoticeNoteEx"></div>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import cookies from 'js-cookie'
import { CharacterType } from '@/enums/common'
import { SettingHelpStatus } from '@/enums/marketing'
import {
  MERCHANT_API_SECURITY_SESSION_LOGOUT,
  MERCHANT_API_SECURITY_SKIN_GET,
  MERCHANT_API_SECURITY_SKIN_UPDATE
} from '@/apis/merchant'
import {
  MARKETING_API_SETTING_NOTICE_GETS,
  MARKETING_API_SETTING_NOTICE_GET
} from '@/apis/marketing'

export default {
  data() {
    return {
      CharacterType,
      noticeList: [],
      showNoticeList: [], // 用于展示第一页的前三条数据
      noticeDetail: {},
      visible: false,
      isNew: false,
      choose: 0,
      pg: 1,
      size: 10,
      total: 0,
      pgCount: 0,
      needShow: false,
      noticeLoading: false,
      isShow: false,
      routeName: '',
      themeIndex: 0,
      default: 0,
      themeList: [
        {
          isDefault: true,
          themeText: '绀青色',
          color: '#1e2e45',
          themeName: 'blue-theme'
        },
        {
          isDefault: false,
          themeText: '黑色',
          color: '#232c32',
          themeName: 'dark-theme'
        },
        /*        {
                  isDefault: false,
                  themeText: '红色',
                  color: '#9a2c2c',
                  themeName: 'red-theme'
                },*/
        {
          isDefault: false,
          themeText: '深蓝色',
          color: '#104e7d',
          themeName: 'blue-light-theme'
        }
      ]
    }
  },
  methods: {
    selectTheme(i) {
      // this.$store.state.themeName = this.themeList[i].themeName
      if (this.themeList.find(m => m.isDefault == true)) {
        this.themeList.find(m => m.isDefault == true).isDefault = false
      }
      this.themeList[i].isDefault = true
      this.themeIndex = i
      this.setTheme()
    },
    setTheme() {
      const i = this.themeIndex
      MERCHANT_API_SECURITY_SKIN_UPDATE({
        Skin: this.themeList[i].themeName
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          if (this.themeList.find(m => m.isDefault == true)) {
            this.themeList.find(m => m.isDefault == true).isDefault = false
          }
          this.themeList[i].isDefault = true
          sessionStorage.setItem('themeName', this.themeList[i].themeName)
          this.$store.state.themeName = this.themeList[i].themeName
          this.isShow = false
        }
      })
    },
    setDefault() {
      const i = 0
      this.themeIndex = 0
      MERCHANT_API_SECURITY_SKIN_UPDATE({
        Skin: this.themeList[i].themeName
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          if (this.themeList.find(m => m.isDefault == true)) {
            this.themeList.find(m => m.isDefault == true).isDefault = false
          }
          this.themeList[i].isDefault = true
          sessionStorage.setItem('themeName', this.themeList[i].themeName)
          this.$store.state.themeName = this.themeList[i].themeName
          this.isShow = false
        }
      })
    },
    showThemeSet() {
      if (this.isShow) {
        this.isShow = false
      } else {
        this.isShow = true
      }
    },
    handleCommand(method) {
      if (method === 'personal_setting') {
        // 个人设置
        this.$router.push({
          path: '/setter/userConfig/index'
        })
      } else if (method === 'personal_pwd') {
        // 修改密码
        this.$router.push({
          path: '/setter/userConfig/password'
        })
      } else if (method === 'personal_download') {
        // 我的下载
        this.$router.push({
          path: '/setter/userConfig/download'
        })
      } else if (method === 'access_token_logout') {
        // 退出登录
        this.logOut()
      }
    },
    logOut() {
      MERCHANT_API_SECURITY_SESSION_LOGOUT({
        CompanyCode: localStorage.companyCode,
        LoginId: this.$store.getters.user_session.LoginId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$store
            .dispatch('ACCESS_TOKEN_LOGOUT')
            .then(() => {
              this.$router.push({
                path: '/login'
              })
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getNoticeList(pgChange) {
      let obj =
        typeof pgChange == 'object'
          ? pgChange
          : {
            PageIndex: this.pg,
            PageSize: this.size,
            SortBy: 'CheckTime'
          }
      obj = Object.assign({}, obj, {
        Status: SettingHelpStatus.Audit,
        CharacterType: this.$store.getters.user_session.CharacterType,
        NoticeTitle: ''
      })
      MARKETING_API_SETTING_NOTICE_GETS(obj).then(res => {
        if (res.data.Code === 'CORRECT') {
          const noticeList = res.data.Data.Rows
          this.noticeList = noticeList
          this.total = noticeList.length ? res.data.Data.Count : 0
          let NoticeId = cookies.get('firstNews')
          let firstNote = noticeList.length && noticeList[0]

          var today = new Date().getTime()
          var noticeTime =
            new Date(firstNote.CheckTime).getTime() + 24 * 60 * 60 * 1000

          // 第一条公告的CheckTime时间 加上 一天后的时间戳   小于  今天的的时间戳    就显示红点
          if(NoticeId) { // 红点显示24小时
            this.isNew = true
          }
          if (
            !!pgChange &&
            firstNote &&
            noticeTime > today && 
            firstNote.NoticeId != NoticeId
          ) {
            var domain = ''
            if (location.hostname !== 'localhost') {
              domain =
                '.' +
                location.hostname
                  .split('.')
                  .slice(-2)
                  .join('.')
            }
            cookies.set('firstNews', firstNote.NoticeId, {
              path: '/',
              domain: domain,
              expires: 1
            })
            if (NoticeId != firstNote.NoticeId) {
              this.visible = true
            }
          }
          if (typeof pgChange == 'boolean') {
            this.visible = true
          }

          this.pgCount = Math.ceil(this.total / this.size)
          if (noticeList.length) {
            this.choose = firstNote.NoticeId
            this.getNoticeDetail(firstNote.NoticeId)
          }
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    prev() {
      if (this.pg <= 1) {
        return false
      } else {
        this.pg = this.pg - 1
        this.getNoticeList('pgChange')
      }
    },
    next() {
      if (this.pg >= this.pgCount) {
        return false
      } else {
        this.pg = this.pg + 1
        this.getNoticeList('pgChange')
      }
    },
    chooseNotice(index) {
      this.choose = index
      this.getNoticeDetail(index)
    },
    getNoticeDetail(id) {
      this.noticeLoading = true
      MARKETING_API_SETTING_NOTICE_GET({
        NoticeId: id
      }).then(res => {
        this.noticeLoading = false
        if (res.data.Code === 'CORRECT') {
          this.noticeDetail = res.data.Data
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    toHelp() {
      this.$router.push({
        path: '/help/index'
      })
    },
    routeChange() {
      this.routeName = this.$route.name
      if (this.$route.meta.name) {
        this.routeName = this.$route.meta.name
      }
      document.title = '珠宝云SaaS-' + this.routeName
    }
  },
  beforeMount() {
    let themeName = sessionStorage.themeName
    if (!themeName) {
      MERCHANT_API_SECURITY_SKIN_GET().then(res => {
        if (res.data.Code == 'CORRECT') {
          themeName = res.data.Data ? res.data.Data.Skin : 'blue-theme'
          this.themeList.forEach((item, index) => {
            if (item.themeName == themeName) {
              item.isDefault = true
              this.themeIndex = index
              sessionStorage.setItem(
                'themeName',
                this.themeList[index].themeName
              )
              this.$store.state.themeName = this.themeList[index].themeName
            } else {
              item.isDefault = false
            }
          })
        }
      })
    } else {
      this.themeList.forEach((item, index) => {
        if (item.themeName == themeName) {
          item.isDefault = true
          this.themeIndex = index
          this.$store.state.themeName = this.themeList[index].themeName
        } else {
          item.isDefault = false
        }
      })
    }
    if (
      this.$store.getters.user_session.CharacterType !=
      this.CharacterType.Lingcb
    ) {
      this.getNoticeList({
        PageIndex: 1,
        PageSize: 10,
        SortBy: 'CheckTime'
      })
    }
  },
  mounted() {
    console.log(this.$store.getters.user_session)
    this.routeChange()
  },
  watch: {
    $route: 'routeChange'
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/sass/headerbar.scss';
.p-r-10 {
  padding-right: 10px;
}
</style>
<style lang="scss">
.informs {
  .el-dialog__body {
    padding: 0;
  }
}
</style>
