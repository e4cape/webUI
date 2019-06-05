<template>
  <div class="content">
    <good-Edit v-if="id && forms.ItemId" :forms="forms" @saveData="saveData" :OrderType="OrderType" :LargeType="2" :KindTypeEk="KindTypeEk" :SmallType="4" :source="apis" :StyleId="StyleId"></good-edit>
  </div>
</template>

<script>
import {
  STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_UPDATE,
  STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_GET,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GET,
  STOCKING_API_GOODS_MODIFY_ORDER_ITEM_REQ,
  STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATE,
  STOCKING_API_GOODS_MODIFY_ORDER_ITEM_UPDATE,
  STOCKING_API_GOODS_INTAKE_ORDER_ITEM_GET,
  STOCKING_API_GOODS_INTAKE_ORDER_ITEM_UPDATE
} from '@/apis/stocking.js'
import goodEdit from '@/components/purchase/goodEdit.vue'
export default {
  data() {
    return {
      id: null,
      OrderType: 1,
      KindTypeEk:0,
      forms: {},
      apis: '',
      itemId: '',
      itemType: 0,
      goodsId: '',
      StyleId: 0,
    }
  },
  methods: {
    getData() {
      let api
      if(this.apis == 'ARRIVE') {
        api = STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_GET
      } else if (this.apis == 'QUALITY') {
        api = STOCKING_API_GOODS_QUALITY_ORDER_ITEM_GET
      } else if(this.apis == 'MODIFY') {
        api = STOCKING_API_GOODS_MODIFY_ORDER_ITEM_REQ
      } else if(this.apis == 'INTAKE') {
        api = STOCKING_API_GOODS_INTAKE_ORDER_ITEM_GET
      }
      if(this.apis == 'MODIFY') {
        api({ModifyId: this.id, GoodsId: this.goodsId, ItemType: this.itemType}).then(res => {
          if(res.data.Code === 'CORRECT') {
            this.forms = res.data.Data
          }
        })
      } else {
        api({ ItemId: this.$route.query.itemId }).then(res => {
          if(res.data.Code === 'CORRECT') {
            this.forms = res.data.Data
          }
        })
      }
    },
    saveData(form) {
      if(this.apis == 'ARRIVE') {
        const para = {
          ...form,
          ArriveId: Number(this.id),
          // CategoryType: Number(this.form.CategoryType),
          // GoldType: Number(this.form.GoldType)
        }
        STOCKING_API_GOODS_ARRIVE_ORDER_ITEM_UPDATE(para).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$store.commit('SET_BTN_LOADING', false)
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.$router.back(-1)
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      } else if(this.apis == 'QUALITY') {
        const para = {
          ...form,
          QualityId: Number(this.QualityId),
        }
        STOCKING_API_GOODS_QUALITY_ORDER_ITEM_UPDATE(para).then(res => {
          if(res.data.Code === 'CORRECT') {
            this.$store.commit('SET_BTN_LOADING', false)
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.$router.back(-1)
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      } else if(this.apis == 'MODIFY') {
        const para = {
          ...form,
          ModifyId: Number(this.id),
          // CategoryType: Number(this.form.CategoryType),
          // GoldType: Number(this.form.GoldType)
        }
        STOCKING_API_GOODS_MODIFY_ORDER_ITEM_UPDATE(para).then(res => {
          if(res.data.Code === 'CORRECT') {
            this.$store.commit('SET_BTN_LOADING', false)
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.$router.back(-1)
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      } else if(this.apis == 'INTAKE') {
        const para = {
          ...form,
          IntakeId: Number(this.id),
          // CategoryType: Number(this.form.CategoryType),
          // GoldType: Number(this.form.GoldType)
        }
        STOCKING_API_GOODS_INTAKE_ORDER_ITEM_UPDATE(para).then(res => {
          if(res.data.Code === 'CORRECT') {
            this.$store.commit('SET_BTN_LOADING', false)
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.$router.back(-1)
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }
    },
  },
  created() {
  },
  beforeMount() {
  },
  mounted() {
    this.id = parseInt(this.$route.query.id)
    this.QualityId = parseInt(this.$route.query.QualityId) || 0
    this.itemId = this.$route.query.itemId || ''
    this.goodsId = this.$route.query.goodsId || ''
    this.itemType = Number(this.$route.query.itemType)
    this.apis = this.$route.query.apis
    this.OrderType = parseInt(this.$route.query.OrderType)
    this.KindTypeEk = parseInt(this.$route.query.KindTypeEk)
    this.StyleId = parseInt(this.$route.query.StyleId) || 0
    if (!this.id) {
      this.$confirm('数据错误', '提示', {
        confirmButtonText: '关闭',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        this.$router.back()
      })
    } else {
      this.getData()
    }
  },
  watch: {
  },
  components: {
    goodEdit
  }
}
</script>
