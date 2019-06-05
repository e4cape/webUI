<template>
  <el-row>
    <div class="tabs">
      <span class="tab" name="active0" :class="{'active': this.$route.path.indexOf('orderSeckill') > -1}" @click="$router.push({path: '/spread/order/orderSeckill/index'})">
        秒杀
      </span>
      <span class="tab" name="active1" :class="{'active': this.$route.path.indexOf('orderSpellGroup') > -1}" @click="$router.push({path: '/spread/order/orderSpellGroup/index'})">
        拼团
      </span>
      <span class="tab" name="active2" :class="{'active': this.$route.path.indexOf('orderBargain') > -1}" @click="$router.push({path: '/spread/order/orderBargain/index'})">
        砍价
      </span>
    </div>
    <div class="panel">
      <router-view></router-view>
    </div>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  },
  mounted () {
  },
  watch: {
  },
}
</script>
