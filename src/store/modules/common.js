import {
  MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST,
  MERCHANT_API_DROPDOWN_STORELIST,
  MERCHANT_API_DROPDOWN_USERLIST,
  MERCHANT_API_DROPDOWN_DEPARTLIST,
  MERCHANT_API_DROPDOWN_COMPANYLIST,
  MERCHANT_API_DROPDOWN_ROLELIST,
  MERCHANT_API_DROPDOWN_PARTNERBASICLIST,
  MERCHANT_API_DROPDOWN_WAREHOUSEBASICLIST,
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST,
  MERCHANT_API_SECURITY_PACK_MENU_GETSMYMENU,
  MERCHANT_API_SETTING_PARAMETER_NOTSETTLEDDATE,
  MERCHANT_API_DROPDOWN_DESKBASICLIST
} from '@/apis/merchant.js'
import { MEMBERSHIP_API_SETTINGAREA_GETAREAS } from '@/apis/membership.js'
import { YNStatus, PaymentType } from '@/enums/common.js'
import { SecurityTerminalType } from '@/enums/merchant'
import {
  SettingEnumeratorEnumeratorType,
  MaterialType,
  CategoryType,
  GoldType
} from '@/enums/stocking.js'

const common = {
  state: {
    // 菜单宽度--用于echart reset
    menuWidth: 180,

    // 按钮loading
    is_loading: false,

    // 数据列表loading
    tb_loading: false,

    // 全屏幕loading
    full_loading: false,
    // 品类
    categoryType: {
      Types: {},
      TypeArray: []
    },

    // 成色
    goldType: {
      Types: {},
      TypeArray: []
    },

    // 材质
    materialType: {
      Types: {},
      TypeArray: []
    },

    // 系列
    seriesType: {
      Types: {},
      TypeArray: []
    },

    // 支付方式
    paymentType: {
      Types: {},
      TypeArray: []
    },

    // 种类
    kindType: {
      Types: {},
      TypeArray: []
    },

    // 柜台分组&柜台下拉列表数据
    desks: [],

    // 地区数据
    areas: [],

    // 门店下拉
    stores: [],

    // 用户下拉
    users: [],

    // 部门下拉
    departments: [],

    // 公司&门店下拉列表数据
    company_and_stores: [],

    // 角色下拉
    roles: [],

    // 供应商下拉
    suppliers: [],

    // 仓库下拉
    wareHouses: [],

    // 原因下拉
    reasons: [],
    // 左侧菜单与门店首页菜单
    menus: [],
    businessDate: {}, // 业务日期
    // 石类
    stone: [],

    // 配件
    part: [],

    // 石重范围
    stoneWeight: []
  },
  mutations: {
    // 按钮提交loading;
    SET_BTN_LOADING: (state, flag) => {
      state.is_loading = flag
    },
    // 内容loading;
    SET_TB_LOADING: (state, flag) => {
      state.tb_loading = flag
    },
    // 全屏loading;
    SET_FULL_LOADING: (state, flag) => {
      state.full_loading = flag
    },
    // 地区;
    SET_AREAS: (state, data) => {
      state.areas = data
    },
    // 材质
    SET_MATERIALTYPE: (state, data) => {
      state.materialType = data
    },
    // 品类
    SET_CATEGORYTYPE: (state, data) => {
      state.categoryType = data
    },
    // 成色
    SET_GOLDTYPE: (state, data) => {
      state.goldType = data
    },
    // 支付方式
    SET_PAYMENTTYPE: (state, data) => {
      state.paymentType = data
    },
    // 系列
    SET_SERIESTYPE: (state, data) => {
      state.seriesType = data
    },
    // 种类
    SET_KINDTYPE: (state, data) => {
      state.kindType = data
    },
    // 柜台下拉
    SET_DESKS: (state, data) => {
      state.desks = data
    },
    // 门店下拉
    SET_STORES: (state, data) => {
      state.stores = data
    },
    // 门店下拉
    SET_USERS: (state, data) => {
      state.users = data
    },
    // 部门下拉
    SET_DEPARTMENTS: (state, data) => {
      state.departments = data
    },
    // 公司&门店
    SET_COMPANYANDSTORE: (state, data) => {
      state.company_and_stores = data
    },
    // 角色下拉
    SET_ROLES: (state, data) => {
      state.roles = data
    },
    // 供应商下拉
    SET_SUPPLIERS: (state, data) => {
      state.suppliers = data
    },
    // 仓库下拉
    SET_WAREHOUSES: (state, data) => {
      state.wareHouses = data
    },
    // 原因下拉
    SET_REASONS: (state, data) => {
      state.reasons = data
    },
    // 左侧菜单与门店首页菜单
    SET_MENUS: (state, data) => {
      state.menus = data
    },
    SET_BUSINESSDATE: (state, data) => {
      state.businessDate = {
        disabledDate: time => {
          if (data.Etime == '1900-01-01 00:00:00') {
            return time.getTime() > new Date(data.Ntime.replace(/-/g, '/'))
          }
          return (
            time.getTime() > new Date(data.Ntime.replace(/-/g, '/')) ||
            (time.getTime() <= new Date(data.Etime.replace(/-/g, '/') + ' 23:59:59') &&
              time.getTime() >= new Date(data.Btime.replace(/-/g, '/') + ' 00:00:00'))
          )
        }
      }
    },

    // 石类
    SET_STONE: (state, data) => {
      state.stone = data
    },

    // 配件
    SET_PART: (state, data) => {
      state.part = data
    },
    // 石重范围
    SET_STONEWEIGHT: (state, data) => {
      state.stoneWeight = data
    }
  },
  actions: {
    GET_AREAS_DROPLIST({ commit }) {
      if (this.state.common.areas.length) {
        return false
      }
      return MEMBERSHIP_API_SETTINGAREA_GETAREAS().then(res => {
        if (res.data.Code === 'CORRECT') {
          commit('SET_AREAS', res.data.Data || [])
          return res
        }
      })
    },
    GET_MATERIAL_TYPE({ commit }, state = 0) {
      // 获取材质
      return MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.MaterialType,
        IsEnable: state
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data.Rows.length > 0) {
            const types = {}
            res.data.Data.Rows.forEach(item => {
              types[item.Id] = item.Value
            })
            const obj = {
              Types: types,
              TypeArray: res.data.Data.Rows || []
            }
            commit('SET_MATERIALTYPE', obj)
          } else {
            commit('SET_MATERIALTYPE', MaterialType)
          }
        }
      })
    },
    GET_CATEGORY_TYPE({ commit }, state = 0) {
      // 获取品类
      return MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.CategoryType,
        IsEnable: state
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data.Rows.length > 0) {
            const types = {}
            res.data.Data.Rows.forEach(item => {
              types[item.Id] = item.Value
            })
            const obj = {
              Types: types,
              TypeArray: res.data.Data.Rows || []
            }
            commit('SET_CATEGORYTYPE', obj)
            return obj
          } else {
            commit('SET_CATEGORYTYPE', CategoryType)
          }
        }
      })
    },
    GET_GOLD_TYPE({ commit }, state = 0) {
      // 获取成色
      return MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.GoldType,
        IsEnable: state
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data.Rows.length > 0) {
            const types = {}
            res.data.Data.Rows.forEach(item => {
              types[item.Id] = item.Value
            })
            const obj = {
              Types: types,
              TypeArray: res.data.Data.Rows || []
            }
            commit('SET_GOLDTYPE', obj)
            return obj
          }
          commit('SET_GOLDTYPE', GoldType)
        }
      })
    },
    GET_PAYMENT_TYPE({ commit }, state = 0) {
      // 获取支付方式
      return MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.PaymentType,
        IsEnable: state
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data.Rows.length > 0) {
            const types = {}
            res.data.Data.Rows.forEach(item => {
              types[item.Id] = item.Value
            })
            const obj = {
              Types: types,
              TypeArray: res.data.Data.Rows || []
            }
            commit('SET_PAYMENTTYPE', obj)
          } else {
            commit('SET_PAYMENTTYPE', PaymentType)
          }
        }
      })
    },
    GET_SERIES_TYPE({ commit }, state = 0) {
      // 获取系列
      return MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.SeriesType,
        IsEnable: state
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          const types = {}
          res.data.Data.Rows.forEach(item => {
            types[item.Id] = item.Value
          })
          const obj = {
            Types: types,
            TypeArray: res.data.Data.Rows || []
          }
          commit('SET_SERIESTYPE', obj)
        }
      })
    },
    GET_KIND_TYPE({ commit }, state = 0) {
      // 获取种类
      return MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.KindType,
        IsEnable: state
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          const types = {}
          res.data.Data.Rows.forEach(item => {
            types[item.Id] = item.Value
          })
          const obj = {
            Types: types,
            TypeArray: res.data.Data.Rows || []
          }
          commit('SET_KINDTYPE', obj)
          return res.data.Data.Rows || []
        }
      })
    },
    GET_STONE_TYPE({ commit }, state = 0) {
      // 获取石类
      return MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.StoneClassType,
        IsEnable: state
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          const types = {}
          res.data.Data.Rows.forEach(item => {
            types[item.Id] = item.Value
          })
          const obj = {
            Types: types,
            TypeArray: res.data.Data.Rows || []
          }
          commit('SET_STONE', obj)
        }
      })
    },
    GET_PART_TYPE({ commit }, state = 0) {
      // 获取配件
      return MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.PartType,
        IsEnable: state
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          const types = {}
          res.data.Data.Rows.forEach(item => {
            types[item.Id] = item.Value
          })
          const obj = {
            Types: types,
            TypeArray: res.data.Data.Rows || []
          }
          commit('SET_PART', obj)
        }
      })
    },
    GET_STONEWEIGHT({ commit }, state = 0) {
      // 石重范围
      return MERCHANT_API_DROPDOWN_SETTINGENUMERATORLIST({
        EnumeratorType: SettingEnumeratorEnumeratorType.StoneWeight,
        IsEnable: state
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          const types = {}
          res.data.Data.Rows.forEach(item => {
            types[item.Id] = item.Value
          })
          const obj = {
            Types: types,
            TypeArray: res.data.Data.Rows || []
          }
          commit('SET_STONEWEIGHT', obj)
        }
      })
    },
    GET_DESKS_DROPLIST(
      { commit },
      param = {
        GroupTypeDk: -1,
        State: 0
      }
    ) {
      // 获取柜台下拉
      return MERCHANT_API_DROPDOWN_DESKBASICLIST(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          commit('SET_DESKS', res.data.Data.Rows || [])
        }
        return res.data.Data.Rows || []
      })
    },
    GET_STORES_DROPLIST({ commit }, state = 0) {
      return MERCHANT_API_DROPDOWN_STORELIST({
        State: state
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          commit('SET_STORES', [
            {
              CharacterId: 0,
              Id: 0,
              Value: '所有门店'
            },
            ...(res.data.Data.Rows || [])
          ])
        }
        return res.data.Data.Rows || []
      })
    },
    GET_USERS_DROPLIST(
      { commit },
      param = {
        UserState: 0,
        CashierType: 0
      }
    ) {
      return MERCHANT_API_DROPDOWN_USERLIST(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          commit('SET_USERS', res.data.Data.Rows || [])
          return res.data.Data.Rows || []
        }
      })
    },
    GET_DEPARTMENTS_DROPLIST(
      { commit },
      param = {
        State: 0,
        CharacterId: 0
      }
    ) {
      return MERCHANT_API_DROPDOWN_DEPARTLIST(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          commit('SET_DEPARTMENTS', res.data.Data.Rows || [])
        }
        return res.data.Data.Rows || []
      })
    },
    GET_COMPANYS_DROPLIST(
      { commit },
      param = {
        HasStore: YNStatus.No,
        state: 0
      }
    ) {
      return MERCHANT_API_DROPDOWN_COMPANYLIST(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          commit('SET_COMPANYANDSTORE', [
            {
              CharacterId: 0,
              Id: 0,
              Value: '所有公司',
              Childrens: []
            },
            ...(res.data.Data.Rows || [])
          ])
        }
        return (res.data.Data && res.data.Data.Rows) || []
      })
    },
    GET_ROLES_DROPLIST({ commit }) {
      MERCHANT_API_DROPDOWN_ROLELIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          commit('SET_ROLES', res.data.Data.Rows || [])
        }
      })
    },
    GET_SUPPLIERS_DROPLIST(
      { commit },
      param = {
        PartnerType: 0,
        State: 0,
        CharacterId: false
      }
    ) {
      if (!param['CharacterId']) {
        delete param['CharacterId']
      }
      return MERCHANT_API_DROPDOWN_PARTNERBASICLIST(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          commit('SET_SUPPLIERS', res.data.Data.Rows || [])
          return res.data.Data.Rows || []
        }
      })
    },
    GET_WAREHOUSES_DROPLIST({ commit }, param = {
      HasShelf: YNStatus.No,
      State: 0,
    }) {
      // 仓库下拉
      return MERCHANT_API_DROPDOWN_WAREHOUSEBASICLIST(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          commit('SET_WAREHOUSES', res.data.Data.Rows || [])
          return res.data.Data.Rows || []
        }
      })
    },
    // , state = EnableState.Enable
    GET_REASONS_DROPLIST(
      { commit },
      param = {
        DictType: '',
        State: 0
      }
    ) {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          commit('SET_REASONS', res.data.Data.Rows || [])
          return res.data.Data.Rows || []
        }
      })
    },
    GET_MENUS_DROPLIST({ commit }) {
      MERCHANT_API_SECURITY_PACK_MENU_GETSMYMENU({
        TerminalType: SecurityTerminalType.Web
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          commit('SET_MENUS', res.data.Data.Systems || [])
        }
      })
    },
    GET_SETTLE_DATE({ commit }) {
      MERCHANT_API_SETTING_PARAMETER_NOTSETTLEDDATE().then(res => {
        if (res.data.Code === 'CORRECT') {
          commit('SET_BUSINESSDATE', res.data.Data || {})
          return res.data.Data || {}
        }
      })
    }
  }
}

export default common
