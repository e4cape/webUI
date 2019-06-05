import cookies from 'js-cookie'

const session = {
  state: {
    // 令牌状态;
    access_token: cookies.get('access-token'),
    // 会话状态;
    user_session: JSON.parse(decodeURIComponent(localStorage.userInfo || '{}')),
    // 区分一号多店,一号一点的门店
    wechatSettingType: cookies.get('wechatSettingType')
  },
  mutations: {
    // SET_ACCESS_TOKEN;
    SET_ACCESS_TOKEN: (state, token) => {
      state.access_token = token
    },
    // SET_USER_SESSION;
    SET_USER_SESSION: (state, session) => {
      state.user_session = session
    },
    // SET_WECHATSETTING_TYPE;
    SET_WECHATSETTING_TYPE: (state, type) => {
      state.wechatSettingType = type
    }
  },
  actions: {
    // 令牌授权;
    ACCESS_TOKEN_AUTHORIZE({ commit }, parameters) {
      return new Promise((resolve) => {
        let domain = ''
        if (location.hostname !== 'localhost') {
          domain = `.${location.hostname
            .split('.')
            .slice(-2)
            .join('.')}`
        }
        cookies.set('access-token', parameters.access_token, {
          path: '/',
          domain
        })
        cookies.set('wechatSettingType', parameters.wechatSettingType, {
          path: '/',
          domain
        })
        commit('SET_ACCESS_TOKEN', parameters.access_token)
        commit('SET_WECHATSETTING_TYPE', parameters.wechatSettingType)
        resolve()
      })
    },
    // 令牌退除;
    ACCESS_TOKEN_LOGOUT({ commit }) {
      return new Promise(resolve => {
        let domain = ''
        if (location.hostname !== 'localhost') {
          domain = `.${location.hostname
            .split('.')
            .slice(-2)
            .join('.')}`
        }
        cookies.remove('access-token', {
          path: '/',
          domain
        })
        commit('SET_BTN_LOADING', false) // 按钮提交loading;
        commit('SET_TB_LOADING', false) // 内容loading;
        commit('SET_FULL_LOADING', false) // 全屏loading
        commit('SET_ACCESS_TOKEN', '') // ACCESS_TOKEN
        commit('SET_USER_SESSION', {}) // 用户信息
        commit('SET_WECHATSETTING_TYPE', '') // WECHATSETTING_TYPE
        commit('SET_AREAS', []) // 地区List
        commit('SET_MATERIALTYPE', {Types: {},TypeArray: []}) // 材质
        commit('SET_CATEGORYTYPE', { Types: {}, TypeArray: [] })  // 品类
        commit('SET_GOLDTYPE', { Types: {}, TypeArray: [] })  // 成色
        commit('SET_PAYMENTTYPE', { Types: {}, TypeArray: [] }) // 支付方式
        commit('SET_SERIESTYPE', { Types: {}, TypeArray: [] })  // 系列
        commit('SET_KINDTYPE', {Types: {},TypeArray: []}) // 种类
        commit('SET_DESKS', []) //  柜台下拉
        commit('SET_STORES', [])  //  门店下拉
        commit('SET_USERS', []) // 用户下拉
        commit('SET_DEPARTMENTS', []) // 部门下拉
        commit('SET_COMPANYANDSTORE', []) // 公司&门店下拉
        commit('SET_ROLES', []) // 角色下拉
        commit('SET_SUPPLIERS', []) // 供应商下拉
        commit('SET_REASONS', []) //  原因下拉
        commit('SET_WAREHOUSES', []) //  仓库下拉
        commit('SET_STONE', []) //  石类下拉
        commit('SET_PART', []) //  配件下拉
        commit('SET_STONEWEIGHT', []) //  石类范围

        const companyCode = window.localStorage.getItem('companyCode')
        sessionStorage.clear()
        localStorage.clear()
        window.localStorage.setItem('companyCode', companyCode)
        resolve()
      })
    },
    // 会话初始化;
    USER_SESSION_INIT({ commit }, parameters) {
      return new Promise(resolve => {
        commit('SET_USER_SESSION', parameters)
        resolve()
      })
    }
  }
}

export default session
