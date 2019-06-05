import Vue from 'vue'
import Router from 'vue-router'

import first from './home'
import cluster from './cluster.js'
// import finance from './finance.js'
import market from './market.js'
// import member from './member.js'
// import message from './message.js'
// import gift from './gift.js'
// import order from './order.js'
// import performance from './performance.js'
// import report from './report.js'
// import setter from './setter.js'
// import spread from './spread.js'
// import depot from './depot.js'
// import sales from './sales.js'
// import science from './science'
// import purchase from './purchase'
// import information from './information'
import alliance from './alliance'
import fmis from './fmis'

// layout;
const layout = () => import('@/views/layout') // 显示菜单、头部系统切换的路由组件
// login;
const login = () => import('@/views/login') // 登录页
// home;
const home = () => import('@/views/home') // 进入本系统默认主页显示的内容
// noauthorized;
const noauthorized = () => import('@/views/noauthorized') // 无权限页面
// 404;
const notfound = () => import('@/views/404') // 404页面
// 介绍页
const introduction = () => import('@/views/introduction')
// 系统到期
const atMaturity = () => import('@/views/atMaturity')
Vue.use(Router)

let routes = new Set([
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: layout,
    children: [
      {
        path: '',
        component: home,
        name: '首页'
      },
      ...first,
      ...cluster,
      // ...finance,
      ...market,
      // ...member,
      // ...message,
      // ...gift,
      // ...order,
      // ...performance,
      // ...report,
      // ...setter,
      // ...spread,
      // ...depot,
      // ...science,
      // ...purchase,
      // ...information,
      // ...sales,
      ...alliance,
      ...fmis,
      {
        path: '/introduction/:id',
        component: introduction,
        name: '系统介绍'
      },
      {
        path: '/noauthorized',
        component: noauthorized,
        name: '没有权限'
      },
      {
        path: '/atmaturity',
        component: atMaturity,
        name: '系统功能受限'
      }
    ]
  },
  // 404;
  {
    path: '*',
    component: notfound,
    name: '404'
  }
])

export default new Router({
  mode: 'history',
  routes
})
