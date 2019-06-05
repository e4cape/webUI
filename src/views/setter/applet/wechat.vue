<template>
  <div class="content">
    <!-- @module Panel -->
    <el-alert title="注意：您授权的小程序注册主体和您授权的公众号注册主体需一致(即：同一营业执照) 才能正常使用，否则可能不成功！" type="warning"></el-alert>
    <div class="panel-tag m-t-10">
      <span>授权</span>
    </div>
    <div class="impower">
      <el-button name="authorization" v-if="!isWxAuth" type="primary" :loading="btnLoading" @click="impower">一键授权</el-button>
      <p v-else>{{message}}</p>
    </div>

    <div class="panel-tag">
      <span>我的小程序</span>
    </div>
    <div v-if="!isImpower" class="nodata">未加载到授权小程序信息</div>
    <el-row v-else class="xcx">
      <div class="tabs m-t-10">
        <span name="tab1" class="tab" :class="{'active': activeIndex == 0}" @click="activeIndex = 0">基本信息</span>
        <span name="tab2" class="tab" :class="{'active': activeIndex == 1}" @click="activeIndex = 1">小程序体验者</span>
      </div>
      <template v-if="activeIndex == 0">
        <table class="details-table" cellpadding="0" cellspacing="0">
          <tbody>
            <tr>
              <td class="tit">发布状态</td>
              <td>{{wxAppletStatus.Types[details.Status]}}</td>
              <td class="tit">备注</td>
              <td>{{details.Reason}}</td>
            </tr>
          </tbody>
        </table>
        <div class="panel-tag m-t-10">基本信息</div>
        <div v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
          <div class="twig">
            <div class="tit">小程序名称</div>
            <div class="value">{{details.AppletTitle}}</div>
          </div>
          <div class="twig">
            <div class="tit">小程序头像</div>
            <el-popover placement="right" width="200" trigger="hover">
              <img :src="details.HeadImgUrl" style="width: 100%;" alt>
              <img slot="reference" :src="details.HeadImgUrl" alt>
            </el-popover>
          </div>
          <div class="twig" v-if="details.Status === wxAppletStatus.PublishedSuccess">
            <div class="tit">小程序码</div>
            <el-popover placement="right" width="200" trigger="hover">
              <img :src="wxQrcode" style="width: 100%;" alt>
              <img slot="reference" :src="wxQrcode" alt>
            </el-popover>
          </div>
          <div class="twig">
            <div class="tit">介绍</div>
            <div class="value">{{details.Introduces}}</div>
          </div>
          <div class="twig">
            <div class="tit">微信认证</div>
            <div class="value">{{details.VerifyTypeInfo}}</div>
          </div>
          <div class="twig">
            <div class="tit">主体信息</div>
            <div class="value">{{details.PrincipalName}}</div>
          </div>
          <div class="twig">
            <div class="tit">服务类目</div>
            <div class="value" style="display: block;line-height: 25px;">
              <template v-for="(item,index) in details.CategoriesList">
                <p :key="index" v-if="details.CategoriesList">{{item.first_class + '>' + item.second_class}}</p>
              </template>
            </div>
          </div>
          <div class="twig">
            <div class="tit">隐私设置</div>
            <div class="value">{{details.SearchStatus === 1 ? '不可搜索' : '可搜索'}}</div>
          </div>
          <div class="twig">
            <div class="tit">当前版本号</div>
            <div class="value">{{details.CurVersion}}</div>
          </div>
          <div class="twig">
            <div class="tit">版本描述</div>
            <div class="value">{{details.Introduces}}</div>
          </div>
        </div>

        <div class="panel-tag m-b-10 m-t-10">参数配置</div>
        <el-form ref="form" :model="form" label-width="180px" label-position="left" class="fix-w m-l-10" :rules="rules" v-loading="$store.getters.is_loading">
          <el-form-item label="授权小程序的appId：" prop="WxaMchAppId">
            <el-input name="WxaMchAppId" v-model="form.WxaMchAppId" :maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="商户号：" prop="WxaMchId">
            <el-input name="WxaMchId" v-model="form.WxaMchId" :maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="商户秘钥：" prop="WxaMchKey">
            <el-input name="WxaMchKey" v-model="form.WxaMchKey" :maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="证书路径：" prop="WxaMchCert">
            <el-input name="WxaMchCert" disabled v-model="form.WxaMchCert" :maxlength="30"></el-input>
             <el-upload
              class="upload"
              :action="WxaMchCertUp"
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
        </el-form>
        <div class="buttons" style="margin-left: 178px;">
          <el-button name="submitAuth" type="primary" :loading="$store.getters.is_loading" @click="wechartUpdate($event)">提交</el-button>
        </div>
      </template>
      <template v-if="activeIndex == 1">
        <div class="impower" style="margin-top: 20px;border: none;">
          <el-button name="binding" type="primary" @click="isbindVisible">绑定</el-button>
          <el-button name="qrcode" @click="testQrCodeBtn">体验者二维码</el-button>
        </div>
        <el-table :data="data" style="width: 100%" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
          <el-table-column prop="UserStr" label="Userstr"></el-table-column>
          <!-- 暂时注释下期在做这个功能 -->
          <!-- <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button name="relieve" type="text" size="small" @click="unBindtester(scope.row.UserStr)">解绑</el-button>
            </template>
          </el-table-column>-->
        </el-table>
      </template>
    </el-row>

    <el-dialog title="绑定小程序体验者" width="500px" :visible.sync="bindVisible" custom-class="department-dialog">
      <el-row>
        <el-col :span="4" style="line-height:28px">微信号：</el-col>
        <el-col :span="20">
          <el-input name="wechatId" v-model="wechatId" :maxlength="20"></el-input>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button name="submitBinding" type="primary" :loading="$store.getters.is_loading" @click="bindTester">提交</el-button>
        <el-button name="cancelBinding" @click="bindVisible =  false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="体验者二维码" width="300px" :visible.sync="testVisible" custom-class="department-dialog">
      <img :src="qrCodeImg" style="width: 100%;" alt>
      <div slot="footer" class="dialog-footer">
        <el-button name="closeQrCode" type="primary" @click="testVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import { WxAppletStatus } from '@/enums/component'
import {
  MARKETING_API_WX_APPLET_ISWXAUTHORIZER,
  MARKETING_API_WX_APPLET_GETACCOUNTBASICINFOBYERP,
  MARKETING_API_WX_APPLET_GETMEMBERBINDERSBYERP,
  MARKETING_API_WX_APPLET_BINDTESTERBYERP,
  MARKETING_API_WX_APPLET_UNBINDTESTERBYERP,
  MARKETING_API_WX_APPLET_GETQRCODEBYERP,
  MARKETING_API_WX_APPLET_GETAPPLETQRCODEBYERP
} from '@/apis/marketing'
import {
  PAYMENT_API_AUTHORIZER_WEAPPLETPAYDETAIL,
  PAYMENT_API_AUTHORIZER_WEAPPLETUPDATE
} from '@/apis/payment1'
export default {
  data() {
    return {
      wxAppletStatus: WxAppletStatus,
      bindVisible: false,
      btnLoading: false,
      testVisible: false,
      isImpower: false, // 是否授权，true为授权
      data: [],
      activeIndex: 0,
      tableData: [], // 模拟表格数据
      isWxAuth: '',
      url: '',
      wechatId: '',
      message: '',
      isAsc: null,
      details: {},
      timer: null,
      qrCodeImg: '',
      wxQrcode: '',
      WxaMchCertUp:
        this.$root.settings.DOMAIN_APIS.Common + '/Upload/File/UploadToMount/',
      form: {},
      uploadData:{
        Root: this.$root.filePaths.SETTING_APPLETPAY + this.$store.getters.user_session.CharacterId,
        Name: ''
      },
      rules: {
        WxaMchAppId: [
          {
            required: true,
            message: '请输入授权小程序的appId',
            trigger: 'blur'
          }
        ],
        WxaMchId: [
          {
            required: true,
            message: '请输入商户号',
            trigger: 'blur'
          }
        ],
        WxaMchKey: [
          {
            required: true,
            message: '请输入商户秘钥',
            trigger: 'blur'
          }
        ],
        WxaMchCert: [
          {
            required: true,
            message: '请输入证书路径',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  components: {
    pagination
  },
  methods: {
    impower() {
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
    getWechartDetail() {
      this.btnLoading = true
      MARKETING_API_WX_APPLET_ISWXAUTHORIZER({
        CharacterId: this.$store.getters.user_session.CharacterId,
        CharacterType: this.$store.getters.user_session.CharacterType
      }).then(res => {
        this.btnLoading = false
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data.IsWxAuth) {
            this.message = '您已经加入第三方授权'
            this.isImpower = true
            this.isWxAuth = res.data.Data.IsWxAuth
            this.qrCode()
            this.getAccountBasicInfo()
          } else {
            this.isImpower = false
            this.isWxAuth = res.data.Data.IsWxAuth
            this.url = res.data.Data.AuthUrl
          }
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    getAccountBasicInfo() {
      this.$store.commit('SET_TB_LOADING', true)
      MARKETING_API_WX_APPLET_GETACCOUNTBASICINFOBYERP({
        CharacterId: this.$store.getters.user_session.CharacterId,
        CharacterType: this.$store.getters.user_session.CharacterType
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.details = res.data.Data
          this.details.CategoriesList = this.details.Categories
            ? JSON.parse(this.details.Categories)
            : []
          if (this.details.Status === this.wxAppletStatus.PublishedSuccess) {
            this.appletQrCode()
          }
        }
      })
    },
    getMemberInders() {
      this.$store.commit('SET_TB_LOADING', true)
      MARKETING_API_WX_APPLET_GETMEMBERBINDERSBYERP({
        CharacterId: this.$store.getters.user_session.CharacterId,
        CharacterType: this.$store.getters.user_session.CharacterType
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data || []
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    bindTester() {
      if (!this.wechatId) {
        this.$message.error('请填写正确的微信号')
        return
      }
      MARKETING_API_WX_APPLET_BINDTESTERBYERP({
        WechatId: this.wechatId,
        CharacterId: this.$store.getters.user_session.CharacterId
      }).then(res => {
        this.wechatId = ''
        if (res.data.Code === 'CORRECT') {
          this.$message.success('绑定成功')
          this.bindVisible = false
          this.getMemberInders()
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    isbindVisible() {
      if (this.isWxAuth) {
        this.bindVisible = true
      } else {
        this.$message.error('未加载到授权小程序信息.')
      }
    },
    unBindtester(id) {
      MARKETING_API_WX_APPLET_UNBINDTESTERBYERP({
        WechatId: id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.getMemberInders()
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    activeNameChange(value) {
      if (!this.data.length && value.paneName === 'second') {
        this.getMemberInders()
      }
    },
    getAppletPayDetail() {
      this.$store.commit('SET_BTN_LOADING', true)
      PAYMENT_API_AUTHORIZER_WEAPPLETPAYDETAIL({}).then(res => {
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
          })
            .then(() => {
              this.$store.commit('SET_BTN_LOADING', true)
              this.form.WxaMchAppId = this.form.WxaMchAppId.replace(/ /g, '')
              this.form.WxaMchId = this.form.WxaMchId.replace(/ /g, '')
              this.form.WxaMchKey = this.form.WxaMchKey.replace(/ /g, '')
              PAYMENT_API_AUTHORIZER_WEAPPLETUPDATE({
                WxaMchAppId: this.form.WxaMchAppId,
                WxaMchCert: this.form.WxaMchCert,
                WxaMchId: this.form.WxaMchId,
                WxaMchKey: this.form.WxaMchKey
              })
                .then(res => {
                  if (res.data.Code === 'CORRECT') {
                    this.$message.success('保存成功')
                  } else {
                    this.$message.error(res.data.Message)
                  }
                  this.$store.commit('SET_BTN_LOADING', false)
                })
                .catch(() => {
                  this.$store.commit('SET_BTN_LOADING', false)
                })
            })
            .catch(() => {
              this.$message.info('已取消删除')
            })
        }
      })
    },
    qrCode() {
      this.qrCodeImg = ''
      this.qrCodeImgLoading = true
      MARKETING_API_WX_APPLET_GETQRCODEBYERP().then(res => {
        this.qrCodeImgLoading = false
        if (res.data.Code === 'CORRECT') {
          this.qrCodeImg = res.data.Data
        }
      })
    },
    appletQrCode() {
      MARKETING_API_WX_APPLET_GETAPPLETQRCODEBYERP().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.wxQrcode = res.data.Data
        }
      })
    },
    activeIndexChange() {
      if (!this.data.length && this.activeIndex === 1) {
        this.getMemberInders()
      }
    },
    testQrCodeBtn() {
      if (this.qrCodeImgLoading) {
        this.$message('还未获取完二维码数据，请耐心等待！')
        return
      }
      this.testVisible = true
    },
    handleAvatarSuccess(res) {
      this.loading.close()
      if (res.Code === 'CORRECT') {
        this.$message.success('上传成功')
        if (res.Data.Path) {
          this.$set(
            this.form,
            'WxaMchCert',
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
    this.getAppletPayDetail()
  },
  watch: {
    activeIndex: 'activeIndexChange'
  }
}
</script>
<style lang="scss">
.impower {
  padding: 10px;
}
.card-config {
  margin: 20px;
  &.el-tabs .el-tabs__header {
    background-color: #fff;
    border-top: none;
    border-right: none;
    border-left: none;
    box-sizing: content-box;
    padding-left: 0;
    .el-tabs__nav {
      border: none;
    }
    .el-tabs__item {
      border: none;
      &.is-active {
        background-color: #006db8;
        color: #fff;
      }
    }
  }
  .el-tabs__content {
    border: none;
  }
}
.details-table {
  margin-top: 20px;
  width: 100%;
  tr {
    width: 25%;
  }
  td {
    height: 32px;
    min-width: 200px;
    padding: 0 5px;
    border: 1px solid #e5e5e5;
  }
  .tit {
    text-align: center;
    background-color: #f5f5f5;
    width: 200px;
  }
}
.twig {
  width: 100%;
  display: flex;
  margin-left: 20px;
  line-height: 50px;
  border-bottom: 1px solid #ddd;
  &.qrcode {
    height: 100px;
    line-height: 100px;
  }
  img {
    display: block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .tit {
    width: 170px;
  }
  .value {
    flex: 1;
    text-align: left;
  }
}
.upload {
  display: inline-block;
  button {
    span {
      color: #fff;
    }
  }
}
// .no-impower {
//   height: 50px;
//   line-height: 50px;
//   background-color: #ddd;
// }
.nodata {
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #777;
  border-bottom: 1px solid #e5e5e5;
}
.xcx .tabs .tab {
  border-bottom: 1px solid #e5e5e5;
}
</style>
