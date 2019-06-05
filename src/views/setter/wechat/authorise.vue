<template>
  <div class="content">
    <div
      v-if="!isWxAuth"
      class="center-show"
    >
      <span class="m-r-10">您尚未进行微信授权，请立即授权</span>
      <el-button
        name="authorise"
        type="primary"
        :loading="btnLoading"
        @click="authorise"
      >一键授权</el-button>
    </div>
    <div
      v-else
      class="center-show"
    >
      <i class="el-icon-success"></i>
      <div class="message">
        <span class="m-r-10">您已经成功授权！若您有修改公众号名称，请点击更新</span>
        <el-button
          name="updateName"
          type="primary"
          :loading="btnLoading"
          @click="updateName"
        >立即更新</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  MARKETING_API_WEB_CHAT_ISWXAUTHORIZER, // 微信管理 - 微信授权 - 详情
  MARKETING_API_WEB_CHAT_UPDATENICKNAME // 微信管理 - 微信公众号设置(刷新公众号昵称)
} from '@/apis/marketing'
export default {
  data() {
    return {
      winOpen: null,
      timer: null,
      isWxAuth: false,
      url: '',
      btnLoading: false
    }
  },

  methods: {
    authorise() {
      // 一键授权
      this.btnLoading = true
      var winOpen = window.open(
        this.url,
        'newWindow',
        'height=800,width=1100',
        '_blank'
      )
      this.timer = setInterval(() => {
        if (winOpen.closed === true) {
          this.btnLoading = false
          this.getWechartDetail()
          window.clearInterval(this.timer)
        }
      }, 1000)
    },
    updateName() {
      MARKETING_API_WEB_CHAT_UPDATENICKNAME().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('更新成功')
          if (res.data.Data.IsWxAuth) {
            this.isWxAuth = res.data.Data.IsWxAuth
          } else {
            this.url = res.data.Data.AuthUrl
            this.isWxAuth = res.data.Data.IsWxAuth
          }
        }
      })
    },
    getWechartDetail() {
      MARKETING_API_WEB_CHAT_ISWXAUTHORIZER().then(res => {
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data.IsWxAuth) {
            this.isWxAuth = res.data.Data.IsWxAuth
          } else {
            this.url = res.data.Data.AuthUrl
            this.isWxAuth = res.data.Data.IsWxAuth
          }
        } else {
          this.$message.error(res.data.Message)
        }
      })
    }
  },
  mounted() {
    this.getWechartDetail()
  }
}
</script>
<style lang="scss" scoped>
.center-show {
  display: flex;
  height: 200px;
  justify-content: center;
  align-items: center;
  .message {
    display: flex;
    flex-direction: column;
    height: 56px;
    justify-content: space-between;
    // align-items: center;
    .el-button {
      width: 80px;
    }
  }
  .el-icon-success {
    font-size: 64px;
    color: #ffa200;
    margin-right: 30px;
  }
}
</style>

