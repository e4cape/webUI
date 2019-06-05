<template>
  <div class="content">
    <good-Add v-if="id" @saveData="saveData" :OrderType="orderType" :KindTypeEk="kindTypeEk" :LargeType="2" :SmallType="4" ></good-Add>
  </div>
</template>

<script>
import {
  STOCKING_API_GOODS_INTAKE_ORDER_ITEM_CREATE
} from '@/apis/stocking.js'
import goodAdd from '@/components/purchase/goodAdd.vue'
export default {
  data() {
    return {
      id: null,
      orderType: 0,
      KindTypeEk:0,
    }
  },
  methods: {
    saveData(form) {
      const para = {
        ...form,
        IntakeId: Number(this.id),
        // CategoryType: Number(this.form.CategoryType),
        // GoldType: Number(this.form.GoldType)
      }
      STOCKING_API_GOODS_INTAKE_ORDER_ITEM_CREATE(para).then(res => {
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
    this.id = this.$route.query.id
    this.orderType = Number(this.$route.query.orderType)
    this.kindTypeEk = Number(this.$route.query.KindTypeEk)
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
