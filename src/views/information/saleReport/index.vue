<template>
  <el-row>
    <div class="tabs">
      <span class="tab" name="saleBoard" :class="{'active': $route.path.indexOf('saleBoard') > -1}" @click="$router.push({path:'/information/saleReport/saleBoard'})">
        销售看板
      </span>
      <span class="tab" name="saleDay" :class="{'active': $route.path.indexOf('saleDay') > -1}" @click="$router.push({path:'/information/saleReport/saleDay'})">
        销售日报
      </span>
      <span class="tab" name="saleTrend" :class="{'active': $route.path.indexOf('saleTrend') > -1}" @click="$router.push({path:'/information/saleReport/saleTrend'})">
        销售趋势
      </span>
      <span class="tab" name="saleDetail" :class="{'active': $route.path.indexOf('saleDetail') > -1}" @click="$router.push({path:'/information/saleReport/saleDetail'})">
        销售明细
      </span>
      <span class="tab" name="saleStatics" :class="{'active': $route.path.indexOf('saleStatics') > -1}" @click="$router.push({path:'/information/saleReport/saleStatics'})">
        销售汇总
      </span>
    </div>
    <div class="panel">
      <router-view :locationData="locationData"></router-view>
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
  StockPositionTypeType
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
    this.locationData = StockPositionTypeType.TypeArray
    this.locationData.map(item => {
      item['Id'] = item['KeyId']
      return item
    })
    if (this.$store.getters.user_session.CharacterType == CharacterType.Company) {
      this.locationData = this.locationData.filter(item => {
        return item.Id === StockPositionTypeType.All
      })
      this.$store.dispatch('GET_STORES_DROPLIST').then(res => {
        let store = res, tmp
        store.map(item => {
          tmp = item['CharacterId']
          item['CharacterId'] = item['Id']
          item['Id'] = tmp
          return item
        })
        this.locationData = this.locationData.concat(store)
      })
    }
    if (this.$store.getters.user_session.CharacterType == CharacterType.Group) {
      this.locationData = this.locationData.filter(item => {
        return item.Id === StockPositionTypeType.All
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
        return item.Id === StockPositionTypeType.All || item.Id === StockPositionTypeType.UnGroupTypeDk
      })
      this.$store.dispatch('GET_DESKS_DROPLIST', {GroupTypeDk: 0, State: 0}).then(res => {
        this.locationData.forEach(item => {
          if (item.Id === StockPositionTypeType.UnGroupTypeDk) {
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
  mounted() {},
  watch: {
  },
  components: {
  }
}
</script>

<style lang="scss">
.twoDaysData {
  margin: 10px 0 !important;
  .title {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    border-top: 1px solid #e5e5e5;
    background-color: #fff;
    text-align: center;
  }
}
#printCollect {
  width: 990px;
}
</style>
