<template>
  <div class="content">
    <div class="tabs" v-if="$store.getters.user_session.CharacterType == characterTypes.Lingcb">
      <span class="tab" name="btnSelectTerraceTemplate" :class="{'active': activeIndex == 1}" @click="activeIndex = 1">
        平台用模板
      </span>
      <span class="tab" name="btnSelectStoreTemplate" :class="{'active': activeIndex == 2}" @click="activeIndex = 2">
        门店用模板
      </span>
      <span class="tab" name="btnSelectFirmTemplate" :class="{'active': activeIndex == 3}" @click="activeIndex = 3">
        公司用模板
      </span>
    </div>
    <div class="panel" :class="{'no-border': $store.getters.user_session.CharacterType == characterTypes.Store}">
      <plateform-template v-if="activeIndex == 1"></plateform-template>
      <store-template v-if="activeIndex == 2"></store-template>
      <company-template v-if="activeIndex == 3"></company-template>
    </div>
  </div>
</template>
<script>
import PlateformTemplate from './plateformTemplate'
import StoreTemplate from './storeTemplate'
import CompanyTemplate from './companyTemplate'
import { CharacterType } from '@/enums/common'
export default {
  data() {
    let activeIndex
    switch (this.$store.getters.user_session.CharacterType) {
      case Number(CharacterType.Company):
        activeIndex = 3
        break
      case Number(CharacterType.Store):
        activeIndex = 2
        break
      case Number(CharacterType.Lingcb):
        activeIndex = 1
        break
    }
    return {
      activeIndex,
      characterTypes: CharacterType
    }
  },
  methods: {
    setTabs() {
      let query = JSON.parse(JSON.stringify(this.$route.query || {
      }))
      query.activeIndex = this.activeIndex
      this.$router.replace({
        path: this.$router.path, query: query 
      })
    }
  },
  beforeMount() {},
  mounted() {
    if (this.$route.query.activeIndex) {
      this.activeIndex = this.$route.query.activeIndex
    }
  },
  watch: {
    $route: 'setTabs',
    activeIndex(value) {
      this.$router.replace({
        path: this.$router.path,
        query: {
          activeIndex: value 
        }
      })
    }
  },
  components: {
    PlateformTemplate,
    StoreTemplate,
    CompanyTemplate
  }
}
</script>
