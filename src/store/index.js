import Vue from 'vue'
import Vuex from 'vuex'
import session from '@/store/modules/session'
import common from '@/store/modules/common'
import getters from '@/store/getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    themeName: sessionStorage.themeName || 'blue-theme',
    curSys: 0,
    lastStamp: '1900-01-01 00:00:00',
  },
  mutations: {},
  actions: {},
  modules: {
    session,
    common
  },
  getters
})

export default store