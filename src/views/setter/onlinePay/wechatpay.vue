<template>
  <div class="content">
    <el-form ref="form" :model="form" class="fix-w" label-width="180px" label-position="right" :rules="rules" v-loading="$store.getters.is_loading">
      <el-form-item label="授权公众号的appId：" prop="WxMchAppId">
        <el-input name="WxMchAppId" v-model="form.WxMchAppId" :minlength="30"></el-input>
      </el-form-item>
      <el-form-item label="商户号：" prop="WxMchId">
        <el-input name="WxMchId" v-model="form.WxMchId" :minlength="30"></el-input>
      </el-form-item>
      <el-form-item label="商户秘钥：" prop="WxMchKey">
        <el-input name="WxMchKey" v-model="form.WxMchKey" :minlength="30"></el-input>
      </el-form-item>
      <el-form-item label="证书路径：" prop="WxMchCert">
        <el-input name="WxMchCert" disabled v-model="form.WxMchCert" :minlength="30"></el-input>
        <el-upload
          class="upload"
          :action="WxMchCertUp"
          :on-error="handleAvatarError"
          :on-progress="handleProgress"
          :on-success="handleAvatarSuccess"
          :before-upload="handleBeforeUpload"
          :show-file-list="false"
          :headers="{'access-token': $store.getters.access_token}"
          :data="uploadData"
          accept="application/x-pkcs12"
        >
          <el-button name="uploadWxMchCert" type="primary">上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label>
        <el-button name="wechartUpdate" type="primary" :loading="$store.getters.is_loading" @click="wechartUpdate($event)">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  PAYMENT_API_WXH5_GET,
  PAYMENT_API_WXH5_AUTH_BYWX
} from '@/apis/payment'
export default {
  data() {
    return {
      loading: '',
      fullLoading: false,
      WxMchCertUp:
        this.$root.settings.DOMAIN_APIS.Common + '/Upload/File/UploadToMount/',
      form: {},
      uploadData:{
        Root: this.$root.filePaths.SETTING_WXPAY + this.$store.getters.user_session.CharacterId,
        Name: ''
      },
      rules: {
        WxMchAppId: [
          {
            required: true,
            message: '请输入授权公众号的appId',
            trigger: 'blur'
          }
        ],
        WxMchId: [
          {
            required: true,
            message: '请输入商户号',
            trigger: 'blur'
          }
        ],
        WxMchKey: [
          {
            required: true,
            message: '请输入商户秘钥',
            trigger: 'blur'
          }
        ],
        WxMchCert: [
          {
            required: true,
            message: '请输入证书路径',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    getWechartDetail() {
      this.$store.commit('SET_BTN_LOADING', true)
      PAYMENT_API_WXH5_GET({
        CharacterId: this.$store.getters.user_session.CharacterId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.form = res.data.Data
        } else {
          this.$message.error(res.data.Message)
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    wechartUpdate(e) {
      e.currentTarget.blur()
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$confirm('是否保存微信授权信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$store.commit('SET_BTN_LOADING', true)
            this.form.WxMchAppId = this.form.WxMchAppId.replace(/ /g, '')
            this.form.WxMchId = this.form.WxMchId.replace(/ /g, '')
            this.form.WxMchKey = this.form.WxMchKey.replace(/ /g, '')
            PAYMENT_API_WXH5_AUTH_BYWX({
              CharacterId: this.$store.getters.user_session.CharacterId,
              WxMchAppId: this.form.WxMchAppId,
              WxMchCert: this.form.WxMchCert,
              WxMchId: this.form.WxMchId,
              WxMchKey: this.form.WxMchKey
            })
              .then(res => {
                if (res.data.Code === 'CORRECT') {
                  this.$message({
                    type: 'success',
                    message: '保存成功'
                  })
                } else {
                  this.$message.error(res.data.Message)
                }
                this.$store.commit('SET_BTN_LOADING', false)
              })
              .catch(() => {
                this.$store.commit('SET_BTN_LOADING', false)
              })
          })
        }
      })
    },
    handleAvatarSuccess(res) {
      this.loading.close()
      if (res.Code === 'CORRECT') {
        this.$message.success('上传成功')
        if (res.Data.Path) {
          this.$set(
            this.form,
            'WxMchCert',
            res.Data.Path
          )
        }
      } else {
        this.$message.error(res.Message)
      }
    },
    handleAvatarError() {
      this.$message.error('网络连接失败，请稍后再试！！！')
      this.loading.close()
    },
    handleProgress() {
      this.loading = this.$loading({
        lock: true,
        text: '正在努力上传中...',
        background: 'rgba(255, 255, 255, 0.7)'
      })
    },
    handleBeforeUpload(file){
      const ext = file.name.slice(file.name.length - [...file.name].reverse().join('').indexOf('.') -1)
      if(ext !== '.p12'){
        this.$message.error('请上传正确的格式')
        return false
      }
      this.uploadData.Name = file.name
    }
  },
  mounted() {
    this.getWechartDetail()
  }
}
</script>
<style lang="scss">
.upload {
  display: inline-block;
  button {
    span {
      color: #fff;
    }
  }
}
</style>
