<template>
  <div class="content">
    <good-Add v-if="id" @saveData="saveData" :OrderType="OrderType" :LargeType="2" :KindTypeEk="KindTypeEk" :SmallType="4"></good-Add>
  </div>
</template>

<script>
import {
  STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_CREATE
} from '@/apis/stocking.js'
import goodAdd from '@/components/purchase/goodAdd.vue'
export default {
  data() {
    return {
      id: null,
      OrderType: 1,
      KindTypeEk:0,
    }
  },
  methods: {
    saveData(form) {
      const para = {
        ...form,
        ArriveId: Number(this.id),
        // CategoryType: Number(this.form.CategoryType),
        // GoldType: Number(this.form.GoldType)
      }
      STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_CREATE(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$store.commit('SET_BTN_LOADING', false)
          this.$router.back(-1)
        } else {
          this.$message.error(res.data.Message)
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
  },
  created() {
  },
  beforeMount() {
  },
  async mounted() {
    this.id = parseInt(this.$route.query.id)
    this.OrderType = parseInt(this.$route.query.orderType)
    this.KindTypeEk = parseInt(this.$route.query.KindTypeEk)
    if (!this.id) {
      this.$confirm('数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    }
  },
  watch: {
  },
  components: {
    goodAdd
  }
}
</script>
