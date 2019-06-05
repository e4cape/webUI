<template>
  <div class="login">
    <div class="header">
      <div class="logo">
        <img src="@/assets/images/logo.png">
      </div>
    </div>
    <div class="login-wrapper">
      <div class="form-left">
        <img src="@/assets/images/plane.png" alt>
        <span class="text">向未来前进·让改变发声</span>
      </div>
      <el-form ref="form" :model="userInfo" @keyup.enter.native="beforeSubmit" label-width="0px" class="login-form" :rules="rules">
        <div class="title">珠宝云登录</div>
        <template v-if="loginShow == 'password'">
          <el-form-item prop="companycode">
            <el-input v-model="userInfo.companycode" :maxlength="50"
             placeholder="公司代码"></el-input>
            <i class="icon-company"></i>
          </el-form-item>
          <el-form-item prop="loginId">
            <input type="text" style="width: 0; height:0; display:none;" disabled>
            <el-input v-model="userInfo.loginId" autocomplete="new-password" :maxlength="50" placeholder="请输入账户名"></el-input>
            <i class="icon-user"></i>
          </el-form-item>
          <el-form-item prop="password">
            <input type="password" style="width: 0; height:0; display:none;" disabled>
            <el-input v-model="userInfo.password" autocomplete="new-password" type="password" :maxlength="50" placeholder="请输入密码"></el-input>
            <i class="icon-password"></i>
          </el-form-item>
          <el-form-item v-if="isError">
            <div class="mykeylock">
              <el-slider @change="sliderValueChange" :disabled="sliderValue === 100" v-model="sliderValue" :show-tooltip="false"></el-slider>
              <div class="text" :style="'background-color:' + (sliderValue == 100 ? '#f6f4e5' : '#fff') + ';'">{{sliderValue == 100 ? '验证成功' : '向右滑动到尾部'}}</div>
            </div>
          </el-form-item>
          <div class="form-item" style="padding-top: 10px;">
            <el-button type="primary" class="btn-login" :loading="$store.getters.is_loading" @click="beforeSubmit">登 录</el-button>
          </div>
        </template>
        <template v-else-if="loginShow == 'code'">
          <div class="login-code-lable">请输入验证码：</div>
          <el-input size="medium" placeholder="请输入内容" v-model="loginCode">
            <template slot="append">
              <el-button @click="getLoginCode">{{showTime ? '请' + showTime + '秒后重试' : '获取验证码'}}</el-button>
            </template>
          </el-input>
          <div class="form-item" style="padding-top: 20px;">
            <el-button type="primary" class="btn-login" :loading="$store.getters.is_loading" @click="checkLoginCode">确 定</el-button>
          </div>
          <div class="messages"></div>
          <div class="login-again" @click="loginShow = 'password'">重新登录</div>
        </template>
      </el-form>
    </div>
    <div class="footer">零成本科技有限公司版权所有 © 2012-{{thisYear}} lingcb.com All Rights Reserved 粤ICP备16062269号 · 热线：0755-2292 8883</div>
  </div>
</template>

<script>
import * as appSetting from '@/configs/appSettings'
import {
  MERCHANT_API_SECURITY_USER_LOGIN,
  MERCHANT_API_SECURITY_SESSION_GET,
  MERCHANT_API_SECURITY_USER_SEND,
  MERCHANT_API_SECURITY_USER_VERIFY
} from '@/apis/merchant'

import { CharacterType } from '@/enums/common'
import { SecurityRoleAuthType } from '@/enums/merchant'
import dayjs from 'dayjs'
import { JSEncrypt } from 'jsencrypt'
export default {
  data() {
    return {
      thisYear: dayjs().format('YYYY'),
      loginShow: 'password',
      loginCode: '',
      authCodeImg: '',
      userInfo: {
        equipid: '',
        companycode: '',
        loginId: '',
        password: '',
        sessionId: ''
      },
      isError: false,
      mouseflg: false,
      sliderValue: 0,
      rules: {
        companycode: {
          validator(rule, value, callback) {
            if (!value) {
              return callback(new Error('请输入公司代码'))
            }
            callback()
          },
          trigger: 'change'
        },
        loginId: {
          required: true,
          message: '请输入账户名',
          trigger: 'blur'
        },
        password: {
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        },
        validCode: {
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }
      },
      showTime: 0,
      codeId: '',
      timer: '',
      keyId: ''
    }
  },
  methods: {
    // 生成GUID
    getGuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
        c
      ) {
        var r, v
        r = (Math.random() * 16) | 0
        v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    // 登录
    beforeSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (!this.isError || this.sliderValue === 100) {
            this.doLogin()
          } else {
            this.$message.error('请滑动解锁')
          }
        }
      })
    },
    doLogin() {
      var parameters = JSON.parse(JSON.stringify(this.userInfo))
      parameters.loginId = encodeURIComponent(this.userInfo.loginId)
      parameters.password = encodeURIComponent(this.userInfo.password)
      let encryptor = new JSEncrypt() // 新建JSEncrypt对象
      encryptor.setPublicKey(
        `-----BEGIN PUBLIC KEY-----
      MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDbyCHzLib6UaKbEhaiqgbrC/Fs
      HsCb/Qj0ZVglxyYUHg0xttEqoPoUpFjcYieUkCWOWUPg6wpmSY+QsXGUAB7dH631
      lAozreWDecppc3O0ENvFm32YMr1i3EQ9ih8yryOnXuKWsqhKo7nvKPWtJj32UARc
      aOnwRH6gICbIEO8uhQIDAQAB
      -----END PUBLIC KEY-----`
      ) // 设置公钥
      // 登录信息加密后提交到后台
      this.$store.commit('SET_BTN_LOADING', true)
      MERCHANT_API_SECURITY_USER_LOGIN({
        CompanyCode: encryptor.encrypt(parameters.companycode),
        LoginId: encryptor.encrypt(parameters.loginId),
        Password: encryptor.encrypt(parameters.password),
        SessionId: parameters.sessionId
      }).then(response => {
        var data = response.data
        if (data.Code === 'ERROR') {
          this.isError = true
          this.sliderValue = 0
          this.$store.commit('SET_BTN_LOADING', false)
        } else {
          /* 登录成功：跳转到系统页面 */
          if (data.Data.AuthType === SecurityRoleAuthType.Message) {
            this.loginId = data.Data.access_token
            this.keyId = data.Data.KeyId
            this.$store.commit('SET_BTN_LOADING', false)
            this.loginShow = 'code'
          } else {
            localStorage.companyCode = this.userInfo.companycode
            this.loginSuccess(data.Data)
          }
        }
      })
    },
    loginSuccess(data) {
      this.$store
        .dispatch('ACCESS_TOKEN_AUTHORIZE', {
          return_code: 'OK',
          access_token: data.Token,
          expires_in: data.ExpiresIn, // data.ExpiresIn
          characterType: data.CharacterType,
          wechatSettingType: data.MountWechat, // 区分一号多店和一号一点的门店
          stage: 1001,
          message: ''
        })
        .then(() => {
          // 登录成功之后获取用户信息，存到local
          MERCHANT_API_SECURITY_SESSION_GET().then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              localStorage.userInfo = encodeURIComponent(
                JSON.stringify(res.data.Data)
              )
              this.$store.dispatch('USER_SESSION_INIT', res.data.Data)
              let path = '/home'
              switch (data.CharacterType) {
                case CharacterType.Lingcb: // 平台端首页
                  path = '/home/platform'
                  break
                case CharacterType.Group: // 集团端首页
                  path = '/home/group'
                  break
                case CharacterType.Company: // 商户端首页
                  path = '/home/company'
                  break
                case CharacterType.Supplier: // 礼品供应商供应商端首页
                  path = '/home/supplier'
                  break
                case CharacterType.Provider: // 供应链首页
                  path = '/home/provider'
                  break
                default:
                  break
              }
              this.$router.replace({
                path: path
              })
            }
          })
        })
    },
    getLoginCode() {
      // 发送短信
      if (this.showTime) {
        return false
      }
      this.showTime = 60
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.showTime <= 1) {
          clearInterval(this.timer)
        }
        this.showTime = this.showTime - 1
      }, 1000)
      MERCHANT_API_SECURITY_USER_SEND({
        KeyId: this.keyId
      }).then(res => {
        res.data.Message && this.$message.warning(res.data.Message)
      })
    },
    checkLoginCode() {
      if (!this.loginCode) {
        this.$message.error('请输入验证码')
        return
      }
      this.$store.commit('SET_BTN_LOADING', true)
      MERCHANT_API_SECURITY_USER_VERIFY({
        KeyId: this.keyId,
        RandCode: this.loginCode
      }).then(res => {
        this.$store.commit('SET_BTN_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.loginSuccess(res.data.Data)
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    sliderValueChange(value) {
      if (value > 80) {
        this.sliderValue = 100
      } else {
        this.sliderValue = 0
      }
    },
    getAutoCode() {
      this.authCodeImg = this.authCodeImg.split('?')[0] + '?v=' + Date.now()
    },
    initCompanycode() {
      if (this.$route.params.companycode) {
        this.userInfo.companycode = this.$route.params.companycode
      }
    }
  },
  created() {
    document.title = '珠宝云SaaS-向未来前进·让改变发声'
  },
  mounted() {
    this.userInfo.companycode = localStorage.companyCode || ''
    this.userInfo.sessionId = this.getGuid()
    this.authCodeImg =
      appSetting.DOMAIN_APIS + '/api/security/code/' + this.userInfo.sessionId
    this.initCompanycode()
  },
  watch: {
    $route: 'initCompanycode'
  }
}
</script>
<style lang="scss">
/* @module Container */
.login {
  height: 100%;
  background: url(../assets/images/background.jpg) center no-repeat;
  overflow: hidden;
  .header {
    background-color: #1e2f45;
    height: 60px;
    border-bottom: solid 1px #283b53;
    .logo {
      display: flex;
      margin: 0 auto;
      padding: 11px 10px;
      width: 70%;
      max-width: 1200px;
    }
  }
}
/* End Container */

/* @module Login Wrapper */
.login-wrapper {
  position: absolute;
  display: flex;
  justify-content: space-between;
  width: 70%;
  top: 38%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1);
  transition: all 0.2s;
  text-align: center;
  .form-left {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img {
      margin-top: 40px;
      max-height: 164px;
    }
    .text {
      font-size: 16px;
      margin-top: 40px;
      word-spacing: 20px;
      letter-spacing: 21px;
      color: #fff;
    }
  }
}
/* End Login Wrapper */

/* @module Login Form */
.login-form {
  position: relative;
  padding: 26px 50px 40px;
  width: 380px;
  background: #fff;
  border-radius: 2px;
  .title {
    font-size: 18px;
    color: #333;
    padding-bottom: 26px;
  }
  .el-form-item {
    position: relative;
    margin-bottom: 20px;
    text-align: left;
    &.is-success .el-input__inner {
      border: solid 0.5px #e5e5e5;
    }
    &.is-error .el-input__inner {
      border: solid 0.5px #e5e5e5;
    }
    .el-form-item__content {
      .el-input {
        input {
          padding-left: 12px;
          width: 100%;
          height: 38px;
          font-size: 14px;
          color: #333;
          background: #f5f5f5;
          border-radius: 2px;
          :active {
            border-color: #84c0ea !important;
          }
        }
      }
      & > i {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        font-size: 16px;
      }
      & > .help {
        position: absolute;
        top: 100%;
        right: 0;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
      }
    }
  }
  .btn-login {
    width: 100%;
    height: 40px;
    font-size: 14px;
    color: #fff;
    background: #006db8;
    border: 0;
    border-radius: 2px;
    outline: 0;
    cursor: pointer;
    &:hover {
      background: #007ed5;
    }
    &:active {
      background: #004777;
    }
  }
  .auth-code {
    display: block;
    width: 100%;
    height: 50px;
    // border: solid 1px #e5e5e5;
    border-radius: 2px;
  }
}
/* End Login Form */

/* @module 媒体查询 */
@media screen and (min-width: 1921px) {
  .container {
    background-size: 100% 100%;
  }
}
@media screen and (max-width: 1360px) {
  .form-left {
    transform: scale(0.8);
  }
}

@media screen and (max-width: 1440px) {
  .login-wrapper {
    transform: scale(0.9) translate(-50%, -50%);
  }
  .error-box {
    transform: scale(0.9) translate(-50%, 0);
  }
}
@media screen and (max-width: 1280px) {
  .login-wrapper .form-left img {
    width: 85%;
  }
  .login-form {
    width: 340px;
  }
}
@media screen and (max-width: 1110px) {
  .login-wrapper .form-left .text {
    letter-spacing: 15px;
  }
}
@media screen and (max-width: 1000px) {
  .login-wrapper .form-left img {
    width: 100%;
  }
  .login-form {
    width: 320px;
  }
}
/* End 媒体查询 */

/* @module 选择系统 */
.wrapper {
  width: 100%;
  height: 100%;
  .header {
    margin: 0 auto;
    width: 70%;
    max-width: 1200px;
    height: 60px;
    background-color: #006db8;
  }
}
/* End 选择系统 */
.footer {
  position: fixed;
  height: 60px;
  line-height: 60px;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #8b9baf;
  font-size: 12px;
  background-color: #1e2f45;
  border-top: 1px solid #283b53;
}
.mykeylock {
  position: relative;
  width: 100%;
  height: 42px;
  border-radius: 2px;
  border: 1px solid #dddddd;
  .text {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    text-align: center;
    line-height: 42px;
    color: #555555;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .el-slider {
    padding: 0 18px;
    margin-top: -1px;
  }
  .el-slider__button {
    width: 40px;
    height: 40px;
    border-radius: 0;
    border: none;
    background: url('../assets/images/slideblock.png') center no-repeat;
  }
}
.login-code-lable {
  text-align: left;
  margin-bottom: 10px;
  color: #666;
}
.login-again {
  text-align: right;
  margin-top: 35px;
  color: #0094ff;
  cursor: pointer;
}
.img-login-wx {
  width: 100%;
  img {
    width: 100%;
  }
}
.messages {
  position: absolute;
  bottom: 65px;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  color: #999;
  width: 300px;
}
</style>
