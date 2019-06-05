// 默认的框架
import Vue from 'vue'
// ui框架
import elementui from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 字体图标;
import './assets/fonts/icon.css'
import App from '@/App'

// 路由
import router from '@/router/index'
// 全局状态
import store from '@/store/index'
// 过滤器
import * as filters from '@/filters/index'
// 域名配置
import * as appSetting from '@/configs/appSettings'
// 文件路径配置
import * as filePath from '@/configs/filePaths'

import { CompanyBasicMountType } from '@/enums/merchant'
import { CharacterType } from '@/enums/common'

import scrollshow from '@/directives/scrollshow'

Vue.config.productionTip = false

Vue.use(elementui, {
  size: 'mini'
})

Vue.directive('scrollshow', scrollshow)

router.beforeEach((to, from, next) => {
  // Has ACCESS_TOKEN ?
  if (
    (!store.getters.user_session.UserId || !store.getters.access_token) &&
    to.path !== '/login'
  ) {
    // No?
    router.push({
      path: '/login'
    })
  } else if (
    to.path.indexOf('/home') > -1 &&
    ((store.getters.user_session.CharacterType === CharacterType.Company &&
      to.path !== '/home/company') ||
      (store.getters.user_session.CharacterType === CharacterType.Group &&
        to.path !== '/home/group') ||
      (store.getters.user_session.CharacterType === CharacterType.Lingcb &&
        to.path !== '/home/platform') ||
      (store.getters.user_session.CharacterType === CharacterType.Supplier &&
        to.path !== '/home/supplier') ||
      (store.getters.user_session.CharacterType === CharacterType.Store &&
        to.path !== '/home'))
  ) {
    // 进入首页根据不同的角色重定向
    switch (store.getters.user_session.CharacterType) {
      case CharacterType.Lingcb:
        router.replace({
          path: '/home/platform'
        })
        break
      case CharacterType.Group:
        router.replace({
          path: '/home/group'
        })
        break
      case CharacterType.Company:
        router.replace({
          path: '/home/company'
        })
        break
      case CharacterType.Supplier:
        router.replace({
          path: '/home/supplier'
        })
        break
      default:
        break
    }
  } else {
    // Yes;
    next()
  }
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.mixin({
  computed: {
    // 一号多店总部
    isOneNumberManyShopCompany() {
      const { user_session, wechatSettingType } = this.$store.getters
      return (
        wechatSettingType == CompanyBasicMountType.Company &&
        user_session.CharacterType == CharacterType.Company
      )
    },
    // 一号多店门店
    isOneNumberManyShop() {
      const { user_session, wechatSettingType } = this.$store.getters
      return (
        wechatSettingType == CompanyBasicMountType.Company &&
        user_session.CharacterType == CharacterType.Store
      )
    },
    // 一号一店门店
    isOneNumberOneStore() {
      const { user_session, wechatSettingType } = this.$store.getters
      return (
        wechatSettingType == CompanyBasicMountType.Store &&
        user_session.CharacterType == CharacterType.Store
      )
    },
    // 一号一店公司
    isOneStoreCompany() {
      const { user_session, wechatSettingType } = this.$store.getters
      return (
        wechatSettingType == CompanyBasicMountType.Store &&
        user_session.CharacterType == CharacterType.Company
      )
    },
    // 集团
    ifGroup() {
      const { user_session } = this.$store.getters
      return user_session.CharacterType === CharacterType.Group
    },
    // 零成本平台
    ifLingcb() {
      const { user_session } = this.$store.getters
      return user_session.CharacterType === CharacterType.Lingcb
    },
    // 零成本分公司
    ifLbranch() {
      const { user_session } = this.$store.getters
      return user_session.CharacterType === CharacterType.Lbranch
    }
  }
})

new Vue({
  data() {
    return {
      settings: appSetting,
      filePaths: filePath,
      allVideoUpList: [],
      datePickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              let start = new Date()
              start = `${start.getFullYear()}/${start.getMonth() +
                1}/${start.getDate()}`
              picker.$emit('pick', [new Date(start), new Date(start)])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              let start = new Date()
              start = `${start.getFullYear()}/${start.getMonth() +
                1}/${start.getDate()}`
              const yestoday = new Date(Date.parse(start) - 1000 * 60 * 60 * 24)
              picker.$emit('pick', [yestoday, yestoday])
            }
          },
          {
            text: '近7天',
            onClick(picker) {
              let start = new Date()
              start = `${start.getFullYear()}/${start.getMonth() +
                1}/${start.getDate()}`
              picker.$emit('pick', [
                new Date(Date.parse(start) - 6 * 24 * 60 * 60 * 1000),
                new Date(start)
              ])
            }
          },
          {
            text: '近30天',
            onClick(picker) {
              let start = new Date()
              start = `${start.getFullYear()}/${start.getMonth() +
                1}/${start.getDate()}`
              picker.$emit('pick', [
                new Date(Date.parse(start) - 29 * 24 * 60 * 60 * 1000),
                new Date(start)
              ])
            }
          },
          {
            text: '本月',
            onClick(picker) {
              const newDate = new Date()
              const start = `${newDate.getFullYear()}/${newDate.getMonth() +
                1}/${1}`
              const end = `${newDate.getFullYear()}/${newDate.getMonth() +
                2}/${1}`
              if (newDate.getMonth() === 11) {
                picker.$emit('pick', [
                  new Date(start),
                  new Date(`${newDate.getFullYear()}/12/31`)
                ])
              } else {
                picker.$emit('pick', [
                  new Date(start),
                  new Date(Date.parse(end) - 24 * 60 * 60 * 1000)
                ])
              }
            }
          },
          {
            text: '上月',
            onClick(picker) {
              const newDate = new Date()
              const start = `${newDate.getFullYear()}/${newDate.getMonth()}/${1}`
              const end = `${newDate.getFullYear()}/${newDate.getMonth() +
                1}/${1}`
              if (newDate.getMonth() === 0) {
                picker.$emit('pick', [
                  new Date(`${newDate.getFullYear() - 1}/12/1`),
                  new Date(Date.parse(end) - 24 * 60 * 60 * 1000)
                ])
              } else {
                picker.$emit('pick', [
                  new Date(start),
                  new Date(Date.parse(end) - 24 * 60 * 60 * 1000)
                ])
              }
            }
          },
          {
            text: '今年',
            onClick(picker) {
              const newDate = new Date()
              const start = `${newDate.getFullYear()}/${1}/${1}`
              const end = `${newDate.getFullYear() + 1}/${1}/${1}`
              picker.$emit('pick', [
                new Date(start),
                new Date(Date.parse(end) - 24 * 60 * 60 * 1000)
              ])
            }
          },
          {
            text: '去年',
            onClick(picker) {
              const newDate = new Date()
              const start = `${newDate.getFullYear() - 1}/${1}/${1}`
              const end = `${newDate.getFullYear()}/${1}/${1}`
              picker.$emit('pick', [
                new Date(start),
                new Date(Date.parse(end) - 24 * 60 * 60 * 1000)
              ])
            }
          }
        ]
      }
    }
  },
  mounted() {
    // 取消浏览器对页面滚动条位置的记录
    if ('scrollRestoration' in history) {
      // 默认值为'auto'
      history.scrollRestoration = 'manual'
    }
    // 重写tofixed 方法处理 为5的小数不入只舍的兼容问题
    Number.prototype.toFixed = function(s) {
      if (this === Infinity || isNaN(Number(this))) {
        // 拦截 Infinity  与 NaN  如  (0 / 0).toFixed(2)
        console.warn('Infinity || NaN ==> [转换为Number失败]')
        return 0
      }
      s = s || 0
      let pow = Math.pow(10, s)
      let tprNum = '0'
      if (this !== 0) {
        tprNum =
          this > 0
            ? (parseInt(this * pow + 0.5) / pow).toString()
            : (tprNum = (parseInt(this * pow - 0.5) / pow).toString())
      }

      let index = tprNum.indexOf('.')
      if (index < 0 && s > 0) {
        tprNum = tprNum + '.'
        for (let i = 0; i < s; i++) {
          tprNum = tprNum + '0'
        }
      } else {
        index = tprNum.length - index
        for (let i = 0; i < s - index + 1; i++) {
          tprNum = tprNum + '0'
        }
      }
      return tprNum
    }
    // 转换纯数字的字符串尾部添加小数点的Number;   例 '123.123456'.toFixed(2)
    String.prototype.toFixed = function(s) {
      if (!isNaN(Number(this)) && this !== null && this !== Infinity) {
        return Number(this).toFixed(s)
      } else {
        console.warn(this + ' ==> [转换为Number失败]')
        return 0
      }
    }
    // 去掉字符串首尾空格
    if (!String.prototype.trim) {
      String.prototype.trim = function() {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
      }
    }
    /* eslint-enable */
  },
  methods: {
    // select选项无匹配项时清空model;
    clearSelectModel(value, key, selects) {
      return selects.find(s => s[key] === value) ? value : ''
    },
    // 时间格式封装
    doubleNum(value) {
      return value >= 10 ? value : '0' + value
    },
    toFixed(value, fixed, minus) {
      // minus 允许负数，true允许
      value = value.toString()
      if (value.length > 1 && /^0/.test(value) && value[1] != '.') {
        // 过滤以00,01,02,03,04,05....开头的东西
        return parseInt(value) || 0
      }
      if (fixed && value === `0.${'0'.repeat(fixed)}`) {
        // 保留两位小数，输入0.00就自动变成0
        return 0
      }
      if (minus && /^-/.test(value)) {
        if (fixed) {
          if (/^\./.test(value)) {
            return '-' + '0.'
          }
          if (value.split('.').length > 2) {
            return (
              '-' + `${parseInt(value.split('.')[0])}.${value.split('.')[1]}`
            )
          }
          return (
            '-' +
            value
              .replace(/[^\d.]*/g, '')
              .replace(
                new RegExp(`([0-9]+.[0-9]{${fixed}})[0-9]*`, 'gim'),
                '$1'
              )
          )
        }
        return '-' + value.replace(/[^\d.]*/g, '').split('.')[0]
      } else if (value) {
        if (fixed) {
          if (/^\./.test(value)) {
            return '0.'
          }
          if (value.split('.').length > 2) {
            return `${parseInt(value.split('.')[0])}.${value.split('.')[1]}`
          }
          return value
            .replace(/[^\d.]*/g, '')
            .replace(new RegExp(`([0-9]+.[0-9]{${fixed}})[0-9]*`, 'gim'), '$1')
        }
        return value.replace(/[^\d.]*/g, '').split('.')[0]
      }
      return value
    },
    toInt(value) {
      if (isNaN(value)) {
        return 0
      }
      return parseInt((value * 10000).toFixed(2))
    },
    toFloat(value, fixed = 2,rate=10000) {
      if (isNaN(value)) {
        value = 0
      }
      return parseFloat(value / rate).toFixed(fixed)
    }
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
