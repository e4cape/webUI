import cookies from 'js-cookie'
import axios from 'axios'
import store from '@/store/index'
import * as appSetting from '@/configs/appSettings'
import router from '@/router/index'
import { Message } from 'element-ui'

// 创建AXIOS实例;
const service = axios.create({
  timeout: 600000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// REQUEST拦截器;
service.interceptors.request.use(
  config => {
    config.url = appSetting.DOMAIN_APIS[config.cloud] + config.url
    if (config.method === 'post') {
      config.data = JSON.stringify(config.data)
    }
    config.headers.common = {
      'access-token': cookies.get('access-token'),
      'last-stamp': store.state.lastStamp
    }
    return config
  },
  error => {
    console.log(error)
    Promise.reject(error)
  }
)

// RESPONSE拦截器;
service.interceptors.response.use(
  response => {
    const code = response.data.Code
    if (code === 'ERROR') {
      if (
        response.data.Command === 'NotAuthorized' ||
        response.data.Command === 'AUTHDENY'
      ) {
        // 无权限
        store.commit('SET_TB_LOADING', false) // table loading
        store.commit('SET_BTN_LOADING', false) // btn loading
        store.commit('SET_FULL_LOADING', false) // full loading
        router.replace({
          path: '/noauthorized'
        })
      } else if (response.data.Command === 'NotEdition') {
        // 系统过期
        store.commit('SET_TB_LOADING', false) // table loading
        store.commit('SET_BTN_LOADING', false) // btn loading
        store.commit('SET_FULL_LOADING', false) // full loading
        router.replace({
          path: '/atmaturity',
          query: {
            Message: encodeURI(response.data.Message)
          }
        })
      } else if (response.data.Command) {
        // 错误异常跳转到登录
        store.dispatch('ACCESS_TOKEN_LOGOUT').then(() => {
          router.replace({
            path: '/login'
          })
        })
      } else {
        response.data.Message &&
          !/<[^>]+>/g.test(response.data.Message) &&
          Message.error(response.data.Message)
      }
    } else {
      response.data.Message && Message.success(response.data.Message)
      if (response.headers['last-stamp']) {
        store.state.lastStamp = response.headers['last-stamp'] // 更新时间戳
      }
    }
    return response
  },
  error => {
    store.commit('SET_TB_LOADING', false) // table loading
    store.commit('SET_BTN_LOADING', false) // btn loading
    store.commit('SET_FULL_LOADING', false) // full loading
    Message.error('服务器错误')
    console.log(error)
    return Promise.reject(error)
  }
)

export default service
