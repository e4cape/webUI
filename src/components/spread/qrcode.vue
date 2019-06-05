<template>
  <el-dialog title="二维码" :visible.sync="visible" top="10vh" width="500px" :before-close="handleClose">
    <el-row v-if="first">
      <el-col :span="6">
        <i class="el-icon-success" style="color: green; font-size: 50px; margin-top: 16px;"></i>
      </el-col>
      <el-col :span="18" class="tl">
        <p>你已成功创建该活动！</p>
        <p>活动二维码：</p>
      </el-col>
    </el-row>
    <el-row v-if="appletMsg.length" class="tc">
      <span>{{appletMsg}}</span>
    </el-row>
    <el-row v-else class="tc">
      <div>
        <img :src="codeUrl" style="width: 220px; padding: 10px; border: 1px solid #ddd; border-radius: 10px;">
      </div>
      <p v-if="!first">扫一扫马上参与活动</p>
      <p>
        <el-button name="btnDown" type="text" class="btn-link el-button el-button--text" @click="down">下载</el-button>
      </p>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button name="btnClose" type="primary" @click="closeVisible">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  WxAppletStatus
} from '@/enums/spread'
import {
  SPREAD_API_SPR_UPDATEIMAGE, SPREAD_API_SPR_GETAPPLETSTATUS
} from '@/apis/spread'
export default {
  props: {
    qrcodeVisible: {
      default: false,
      type: Boolean
    },
    data: {
      default: new Object(),
      type: Object
    },
    first: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      visible: this.qrcodeVisible,
      codeUrl: '',
      appletMsg: ''
    }
  },
  methods: {
    getQrcode() {
      if (this.data.url && this.data.url.length) {
        this.codeUrl = this.$root.settings.DOMAIN_IMAGE + this.data.url
        return false
      }
      this.$store.commit('SET_FULL_LOADING', true)
      SPREAD_API_SPR_UPDATEIMAGE({
        Updated: true,
        SpreadId: this.data.id,
        SpreadType: this.data.type,
        ItemId: 0, // 目前没有单个商品的二维码
        Width: 220
      }).then(res => {
        this.$store.commit('SET_FULL_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.qrcodeVisible = true
          this.codeUrl =
            res.data.Data.Path.indexOf('http') > -1
              ? res.data.Data.Path
              : this.$root.settings.DOMAIN_IMAGE + res.data.Data.Path
        } else {
          this.$message.error('二维码生成失败！')
        }
      })
    },
    GetAppletStatus() {
      SPREAD_API_SPR_GETAPPLETSTATUS().then(res => {
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data === WxAppletStatus.PublishedSuccess) {
            this.getQrcode()
            this.appletMsg = ''
          } else {
            this.appletMsg = '小程序没发布'
          }
        }
      })
    },
    down() {
      window.open(this.$root.settings.DOMAIN_APIS.Spread + '/api/Spr/DownloadFile?url=' + this.codeUrl + '&name=活动二维码.jpg')
    },
    handleClose() {
      this.$emit('qrcodeClose', false)
      this.visible = false
    },
    closeVisible() {
      this.$emit('qrcodeClose', true)
      this.visible = false
    }
  },
  beforeMount() {
    this.GetAppletStatus()
  }
}
</script>
