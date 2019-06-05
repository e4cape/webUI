<template>
  <div class="content" v-html="note"></div>
</template>
<script>
import {
  MERCHANT_API_SECURITY_PACK_SYS_GET
} from '@/apis/merchant'
export default {
  data() {
    return {
      note: ''
    }
  },
  methods: {
    getIntro() {
      MERCHANT_API_SECURITY_PACK_SYS_GET({
        SystemId: this.$route.params.id
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.note = res.data.Data && res.data.Data.Note
        }
      })
    }
  },
  mounted() {
    this.getIntro()
  }
}

</script>
