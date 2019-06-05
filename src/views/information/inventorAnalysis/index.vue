<template>
  <el-row>
    <div class="tabs">
      <span class="tab" name="inventorQuantity" :class="{'active': $route.path.indexOf('inventorQuantity') > -1}" @click="$router.push({path:'/information/inventorAnalysis/inventorQuantity'})">
        库存分析（件数）
      </span>
      <span class="tab" name="inventorWeight" :class="{'active': $route.path.indexOf('inventorWeight') > -1}" @click="$router.push({path:'/information/inventorAnalysis/inventorWeight'})">
        库存分析（金重）
      </span>
      <span class="tab" name="inventorStuff" :class="{'active': $route.path.indexOf('inventorStuff') > -1}" @click="$router.push({path:'/information/inventorAnalysis/inventorStuff'})">
        库存分析（标签价）
      </span>
      <span class="tab" name="inventorTurn" :class="{'active': $route.path.indexOf('inventorTurn') > -1}" @click="$router.push({path:'/information/inventorAnalysis/inventorTurn'})" v-if="this.$store.getters.user_session.CharacterType == characterTypes.Store">
        库存周转分析
      </span>
      <!-- <span class="tab" name="inventorRational" :class="{'active': $route.path.indexOf('inventorRational') > -1}" @click="$router.push({path:'/information/inventorAnalysis/inventorRational'})" v-if="this.$store.getters.user_session.CharacterType == characterTypes.Store">
        库存合理性分析
      </span> -->
    </div>
    <div class="panel">
      <router-view v-if="$store.getters.materialType.TypeArray.length > 0 && $store.getters.categoryType.TypeArray.length > 0 && $store.getters.goldType.TypeArray.length > 0" :locationData="locationData"></router-view>
    </div>
  </el-row>
</template>

<script>
import {
  CharacterType,
  YNStatus
} from '@/enums/common'
import {
  SettingDictionaryDictType,
  GoodsStockWarehousePositionType
} from '@/enums/stocking'
import {
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST
} from '@/apis/merchant.js'
export default {
  data() {
    return {
      characterTypes: {
      },
      locationData: [
      ],
    }
  },
  methods: {
  },
  created() {
    this.$store.dispatch('GET_MATERIAL_TYPE')
    this.$store.dispatch('GET_CATEGORY_TYPE')
    this.$store.dispatch('GET_GOLD_TYPE')
  },
  beforeMount() {
    this.locationData = [{'KeyId': 0, 'Value': '所有位置'}].concat(GoodsStockWarehousePositionType.TypeArray)
    this.locationData.map(item => {
      item['Id'] = item['KeyId']
      return item
    })
    if (this.$store.getters.user_session.CharacterType == CharacterType.Company) {
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST').then(res => {
        this.locationData.forEach(item => {
          if (item.Id === GoodsStockWarehousePositionType.Warehouse) {
            console.log(item)
            item.Value = '所有总部仓库'
            item.Childrens = res
          }
        })
      })
      this.$store.dispatch('GET_STORES_DROPLIST').then(res => {
        let store = res, tmp
        store.map(item => {
          tmp = item['CharacterId']
          item['CharacterId'] = item['Id']
          item['Id'] = tmp
          return item
        })
        this.locationData.forEach(item => {
          if (item.Id === GoodsStockWarehousePositionType.Store) {
            item.Value = '所有门店'
            item.Childrens = store
          }
        })
      })
    }
    if (this.$store.getters.user_session.CharacterType == CharacterType.Group) {
      this.locationData = this.locationData.filter(item => {
        return item.Id === 0
      })
      this.$store.dispatch('GET_COMPANYS_DROPLIST', {HasStore: YNStatus.Yes, State: 0}).then(res => {
        let company = res, tmp, childTmp
        company.map(val => {
          tmp = val['CharacterId']
          val['CharacterId'] = val['Id']
          val['Id'] = tmp
          if (val.Childrens) {
            val.Childrens.map(item => {
              childTmp = item['CharacterId']
              item['CharacterId'] = item['Id']
              item['Id'] = childTmp
            })
          }
        })
        this.locationData = this.locationData.concat(company)
      })
    }
    if (this.$store.getters.user_session.CharacterType == CharacterType.Store) {
      this.locationData = this.locationData.filter(item => {
        return item.Id === 0
      })
      this.$store.dispatch('GET_DESKS_DROPLIST', {GroupTypeDk: 0, State: 0}).then(res => {
        this.locationData({'Id': 2, 'Value': '未分组柜台'})
        this.locationData.forEach(item => {
          if (item.Id === 2) {
            item.Childrens = res
          }
        })
      })
      let desks
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: SettingDictionaryDictType.DeskBasicGroupType,
        State: YNStatus.Yes
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          desks = res.data.Data.Rows
          desks.forEach(item => {
            this.$store.dispatch('GET_DESKS_DROPLIST', {GroupTypeDk: item.Id, State: 0}).then(response => {
              item.Childrens = response.length === 0 ? null : response
            })
          })
          this.locationData.splice(this.locationData.length - 1, 0, ...desks)
        }
      })
    }
    this.characterTypes = CharacterType
  },
  mounted() {
  },
  watch: {
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
</style>

