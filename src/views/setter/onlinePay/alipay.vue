<template>
  <div class="content">
    <div class="panel">
      <!-- <div class="panel-hd">
        <span class="title">支付宝支付授权</span>
      </div> -->
      <div class="panel-bd">
        <div class="alipay">
          <span>支付宝支付授权</span>
          <el-button name="alipay" v-if="!isAliAuth" type="primary" @click="alipay">一键授权</el-button>
          <p v-else >{{message}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  PAYMENT_API_WXH5_GET,
} from '@/apis/payment'
import {
  YNStatus,
} from '@/enums/common'
export default {
  data () {
    return {
      YNStatus,
      btnLoading: false,
      timer: null,
      url: '',
      message: '',
      isAliAuth: false
    }
  },
  methods: {
    alipay () {
      this.btnLoading = true
      var winOpen = window.open(this.url, 'newWindow', 'height=800,width=1100', '_blank')
      this.timer = setInterval(() => {
        if (winOpen.closed === true) {
          this.btnLoading = false
          this.getAlipayDetail()
          window.clearInterval(this.timer)
        }
      }, 1000)
    },
    getAlipayDetail () {
      this.btnLoading = true
      PAYMENT_API_WXH5_GET({
        CharacterId: this.$store.getters.user_session.CharacterId
      }).then(res => {
        this.btnLoading = false
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data.AliStatus === this.YNStatus.Yes) {
            this.message = '您已经加入第三方授权'
            this.isAliAuth = true
          }
        }
        this.url = this.$root.settings.DOMAIN_APIS.Payment + '/AliAuth/Merchant?characterId=' + this.$store.getters.user_session.CharacterId
      })
    }
  },
  mounted () {
    this.getAlipayDetail()
  }
}
</script>
<style lang="scss">
  .alipay{
    text-align: left;
    margin: 20px;
  }
</style>
