<template>
  <el-row>
    <div class="tabs">
      <span class="tab" name="saleBoard" :class="{'active': $route.path.indexOf('arrivalProduct') > -1}" @click="$router.push({path:'/information/purchaseReport/arrivalProduct'})">
        成品到货汇总
      </span>
      <span class="tab" name="saleDay" :class="{'active': $route.path.indexOf('semiProduct') > -1}" @click="$router.push({path:'/information/purchaseReport/semiProduct'})">
        半成品采购汇总
      </span>
      <span class="tab" name="saleTrend" :class="{'active': $route.path.indexOf('inventoryProduct') > -1}" @click="$router.push({path:'/information/purchaseReport/inventoryProduct'})">
        成品进货库存明细
      </span>
    </div>
    <div class="panel">
      <router-view></router-view>
    </div>
  </el-row>
</template>

<script>
import { CharacterType } from '@/enums/common'
export default {
  data() {
    return {
    }
  },
  methods: {
  },
  created() {
    this.$store.dispatch('GET_MATERIAL_TYPE')
    this.$store.dispatch('GET_CATEGORY_TYPE')
    this.$store.dispatch('GET_GOLD_TYPE')
    this.$store.getters.user_session.CharacterType == CharacterType.Company &&
      this.$store.dispatch('GET_STORES_DROPLIST')
    this.$store.getters.user_session.CharacterType == CharacterType.Group &&
      this.$store.dispatch('GET_COMPANYS_DROPLIST')
  },
  beforeMount() {},
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
