<template>
  <el-row>
    <div class="tabs">
      <span class="tab" name="inventorBoard" :class="{'active': $route.path.indexOf('inventorBoard') > -1}" @click="$router.push({path:'/information/inventorReport/inventorBoard'})">
        库存看板
      </span>
      <span class="tab" name="inventorStatics" :class="{'active': $route.path.indexOf('inventorStatics') > -1}" @click="$router.push({path:'/information/inventorReport/inventorStatics'})">
        库存汇总
      </span>
      <span class="tab" name="inventorAge" :class="{'active': $route.path.indexOf('inventorAge') > -1}" @click="$router.push({path:'/information/inventorReport/inventorAge'})">
        库龄报表
      </span>
      <span class="tab" name="inventorTurn" :class="{'active': $route.path.indexOf('inventorTurn') > -1}" @click="$router.push({path:'/information/inventorReport/inventorTurn'})" v-if="$store.getters.user_session.CharacterType == characterTypes.Store">
        库存周转报表
      </span>
      <!-- <span class="tab" name="inventorDetail" :class="{'active': $route.path.indexOf('inventorDetail') > -1}" @click="$router.push({path:'/information/inventorReport/inventorDetail'})" v-if="$store.getters.user_session.CharacterType == characterTypes.Company">
        库存明细
      </span> -->
    </div>
    <div class="panel">
      <router-view v-if="$store.getters.materialType.TypeArray.length > 0 && $store.getters.categoryType.TypeArray.length > 0 && $store.getters.goldType.TypeArray.length > 0"></router-view>
    </div>
  </el-row>
</template>

<script>
import {
  CharacterType,
} from '@/enums/common'
export default {
  data() {
    return {
      characterTypes: {
      },
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
    this.characterTypes = CharacterType
  },
  mounted() {},
  watch: {
  },
  components: {
  }
}
</script>

<style lang="scss" scoped>
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
</style>
