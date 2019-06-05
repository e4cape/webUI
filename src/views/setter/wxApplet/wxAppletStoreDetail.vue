
<template>
  <div
    class="content-view"
    v-loading="contentLoading"
  >
    <ul class="tabs border-b-1px">
      <li
        name="tab0"
        @click="handleSelect(0)"
        class="tab"
        :class="{'active': menusState0}"
      >基本信息</li>
      <li
        name="tab1"
        @click="handleSelect(1)"
        class="tab"
        :class="{'active': menusState1}"
      >开发者ID</li>
      <li
        name="tab2"
        @click="handleSelect(2)"
        class="tab"
        :class="{'active': menusState2}"
      >服务器域名</li>
      <li
        name="tab3"
        @click="handleSelect(3)"
        class="tab"
        :class="{'active': menusState3}"
      >业务域名</li>
      <li
        name="tab4"
        @click="handleSelect(4)"
        class="tab"
        :class="{'active': menusState4}"
      >小程序体验者</li>
    </ul>
    <div
      class="border-x-1px"
      v-if="menusState0"
    >
      <div class="top-m-25"></div>
      <div class="first-top-box">
        <div class="to-left width-half">
          <div class="first-top-title-l">
            发布状态
          </div>
          <span class="p-x-10">{{WxAppletStatus.Types[userDetail.Status]}}</span>
        </div>
        <div class="to-left width-half">
          <div class="first-top-title-l">
            备注
          </div>
          <span class="p-x-10">{{userDetail.Reason}}</span>
        </div>
      </div>
      <div class="top-m-25"></div>
      <div class="content-box">
        <div class="content-t">
          <div class="content-t-l-100">
            基本信息
          </div>
        </div>
        <div class="content-c">
          <div class="content-l">小程序名称</div>
          <span>{{userDetail.AppletTitle}}</span>
        </div>
        <div class="content-c">
          <div class="content-l">小程序图像</div>
          <img
            :src="userDetail.HeadImgUrl"
            alt=""
            class="m-l-10"
          >
        </div>
        <!-- <div class="content-c">
          <div class="content-l">小程序序码</div>
          <img
            :src="AppletQRCode"
            alt=""
          >
        </div> -->
        <div class="content-c">
          <div class="content-l">介绍</div>
          <span>{{userDetail.Introduces}}</span>
        </div>
        <div class="content-c">
          <div class="content-l">微信认证</div>
          <span>{{userDetail.VerifyTypeInfo}}</span>
        </div>
        <div class="content-c">
          <div class="content-l">主体信息</div>
          <span>{{userDetail.PrincipalName }}</span>
        </div>
        <div
          v-for="(item, index) in CategoriesLists"
          :key="index"
          class="content-c"
        >
          <div class="content-l">{{(index == 0)?'服务类目':''}}</div>
          <span>{{item}}</span>
        </div>
        <div class="content-c">
          <div class="content-l">隐私设置</div>
          <span>{{userDetail.SearchStatus == 0?'允许被搜索':'不允许被搜索'}}</span>
        </div>
        <div class="content-c">
          <div class="content-l">当前版本号</div>
          <span>{{userDetail.CurVersion}}</span>
        </div>
        <div class="content-c">
          <div class="content-l">版本描述</div>
          <span>{{userDetail.Introduces}}</span>
        </div>
      </div>
    </div>
    <div
      class="border-x-1px"
      v-if="menusState1"
    >
      <div class="content-box">
        <div class="content-t">
          <div class="content-t-l">开发者ID</div>
          <div class="content-t-c"></div>
          <div class="content-t-r">操作</div>
        </div>
        <div class="content-c">
          <div class="content-l-150">AppID(小程序ID)</div>
          <div class="content-c-c">{{userDetail.AppId}}</div>
          <div class="content-c-r"></div>
        </div>
      </div>
    </div>
    <div
      class="border-x-1px"
      v-if="menusState2"
    >
      <div class="content-box">
        <el-row class="content-title text-center">
          <el-col
            class="text-left p-l-25"
            :span="20"
          >服务器配置</el-col>
          <el-col :span="4">操作</el-col>
        </el-row>
        <div class="configure-box">
          <el-row class="wrap">
            <el-col :span="20">
              <el-row class="p-t-10">
                <el-col
                  :span="6"
                  class="text-center"
                >
                  <p>request合法域名</p>
                </el-col>
                <el-col :span="18">
                  <p
                    v-for="(item1, index) in requestOpts"
                    :key="index"
                  >{{item1}}</p>
                </el-col>
              </el-row>
              <el-row class="p-t-10">
                <el-col
                  :span="6"
                  class="text-center"
                >
                  <p>socket合法域名</p>
                </el-col>
                <el-col :span="18">
                  <p
                    v-for="(item, index) in socketOpts"
                    :key="index"
                  >{{item}}</p>
                </el-col>
              </el-row>
              <el-row class="p-t-10">
                <el-col
                  :span="6"
                  class="text-center"
                >
                  <p>uploadFile合法域名</p>
                </el-col>
                <el-col :span="18">
                  <p
                    v-for="(item, index) in uploadFileOpts"
                    :key="index"
                  >{{item}}</p>
                </el-col>
              </el-row>
              <el-row class="p-y-10">
                <el-col
                  :span="6"
                  class="text-center"
                >
                  <p>downloadFile合法域名</p>
                </el-col>
                <el-col :span="18">
                  <p
                    v-for="(item, index) in downloadFileOpts"
                    :key="index"
                  >{{item}}</p>
                </el-col>
              </el-row>
            </el-col>
            <el-col
              class="p-t-10 text-center"
              :span="4"
            ><a
                @click="modifyDomain"
                href="javascript:;"
              >修改</a></el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div
      class="border-x-1px"
      v-if="menusState3"
    >
      <div class="content-box">
        <el-row class="content-title text-center">
          <el-col
            class="text-left p-l-25"
            :span="20"
          >域名</el-col>
          <el-col :span="4">操作</el-col>
        </el-row>
        <div class="configure-box">
          <el-row class="wrap">
            <el-col :span="20">
              <el-row
                v-for="(item,index) in domainsData.domainsOpts"
                :key="index"
                class="p-y-10"
              >
                <el-col
                  :span="6"
                  class="p-l-20"
                >
                  <p>域名{{index + 1}}</p>
                </el-col>
                <el-col :span="18">
                  <p>{{item.domainUrl}}</p>
                </el-col>
              </el-row>
            </el-col>
            <el-col
              class="p-t-10 text-center"
              :span="4"
            ><a
                @click="BusinessDomain"
                href="javascript:;"
              >修改</a></el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div
      class="border-x-1px"
      v-if="menusState4"
    >
      <el-button
        name="binding"
        class="btn-sty"
        type="primary"
        @click="dialogVisible = true"
      >绑定</el-button>
      <el-row class="content-title">
        <el-col
          class="text-left p-l-25"
          :span="12"
        >Userstr</el-col>
        <el-col
          class="text-right p-r-25"
          :span="12"
        >操作</el-col>
      </el-row>
      <el-row
        v-for="(item, index) in experiencer"
        :key="index"
        class="text-row"
      >
        <el-col
          class="text-left p-l-25"
          :span="12"
        >{{item.userstr}}</el-col>
        <el-col
          class="text-right p-r-25"
          :span="12"
        ><a
            @click="UntieExperience($event)"
            href="javascript:;"
          >解绑</a></el-col>
      </el-row>
    </div>
    <el-dialog
      title="绑定"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        class="fix-w"
        ref="formData"
        :rules="rule"
        :model="formData"
        label-width="120px"
      >
        <el-form-item
          prop="WechatId"
          label="微信号："
        >
          <el-input
            name="WechatId"
            class="w-238"
            v-model="formData.WechatId"
          ></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="bindingCancel"
          @click="handleClose(0)"
        >取 消</el-button>
        <el-button
          name="bindingSubmit"
          type="primary"
          @click="onSubmit('formData')"
        >确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="配置服务器域名"
      :visible.sync="dialogServerVisible"
      center
      :before-close="handleClose"
    >
      <el-form
        ref="ServerData"
        :model="ServerData"
      >
        <div class="dialog-c-box">
          <p>服务器域名需经过ICP备案，新备案域名需24小时后才可配置，域名格式只支持英文大小写字母、数字及“-”，不支持IP地址及端口号。</p>
          <el-row class="p-t-10">
            <el-col
              :span="6"
              class="text-center"
            >request合法域名</el-col>
            <el-col :span="18">
              <el-form-item
                v-for="(item,index) in ServerData.requestOpts"
                :prop="'requestOpts['+index+'].requestUrl'"
                :key="index"
                :rules="{required: true, message: '域名不能为空', trigger: 'blur'}"
              >
                <el-row class="row-btn">
                  <el-col
                    :span="20"
                    class="m-t-5"
                  >
                    <el-input
                      name="requestUrl"
                      v-model="item.requestUrl"
                    ></el-input>
                  </el-col>
                  <el-col
                    :span="4"
                    class="p-l-30"
                  >
                    <img
                      v-if="index > 0"
                      @click="removeItems(index, 0)"
                      src="/static/images/icon-4.png"
                      alt=""
                    >
                    <img
                      v-if="index == 0&&ServerData.requestOpts.length != 3"
                      @click="addItems(index, 0)"
                      src="/static/images/icon-5.png"
                      alt=""
                    >
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="p-t-10">
            <el-col
              :span="6"
              class="text-center"
            >socket合法域名</el-col>
            <el-col :span="18">
              <el-form-item
                v-for="(item,index) in ServerData.socketOpts"
                :key="index"
                :prop="'socketOpts['+index+'].socketUrl'"
                :rules="{required: true, message: '域名不能为空', trigger: 'blur'}"
              >
                <el-row class="row-btn">
                  <el-col
                    :span="20"
                    class="m-t-5"
                  >
                    <el-input
                      name="socketUrl"
                      v-model="item.socketUrl"
                    ></el-input>
                  </el-col>
                  <el-col
                    :span="4"
                    class="p-l-30"
                  >
                    <img
                      v-if="index > 0"
                      @click="removeItems(index, 1)"
                      src="/static/images/icon-4.png"
                      alt=""
                    >
                    <img
                      v-if="index == 0&&ServerData.socketOpts.length != 3"
                      @click="addItems(index, 1)"
                      src="/static/images/icon-5.png"
                      alt=""
                    >
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="p-t-10">
            <el-col
              :span="6"
              class="text-center"
            >uploadFile合法域名</el-col>
            <el-col :span="18">
              <el-form-item
                v-for="(item,index) in ServerData.uploadFileOpts"
                :key="index"
                :prop="'uploadFileOpts['+index+'].uploadFileUrl'"
                :rules="{required: true, message: '域名不能为空', trigger: 'blur'}"
              >
                <el-row class="row-btn">
                  <el-col
                    :span="20"
                    class="m-t-5"
                  >
                    <el-input
                      name="uploadFileUrl"
                      v-model="item.uploadFileUrl"
                    ></el-input>
                  </el-col>
                  <el-col
                    :span="4"
                    class="p-l-30"
                  >
                    <img
                      v-if="index > 0"
                      @click="removeItems(index, 2)"
                      src="/static/images/icon-4.png"
                      alt=""
                    >
                    <img
                      v-if="index == 0&&ServerData.uploadFileOpts.length != 3"
                      @click="addItems(index, 2)"
                      src="/static/images/icon-5.png"
                      alt=""
                    >
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="p-t-10">
            <el-col
              :span="6"
              class="text-center"
            >downloadFile合法域名</el-col>
            <el-col :span="18">
              <el-form-item
                v-for="(item,index) in ServerData.downloadFileOpts"
                :key="index"
                :prop="'downloadFileOpts['+index+'].downloadFileUrl'"
                :rules="{required: true, message: '域名不能为空', trigger: 'blur'}"
              >
                <el-row class="row-btn">
                  <el-col
                    :span="20"
                    class="m-t-5"
                  >
                    <el-input
                      name="downloadFileUrl"
                      v-model="item.downloadFileUrl"
                    ></el-input>
                  </el-col>
                  <el-col
                    :span="4"
                    class="p-l-30"
                  >
                    <img
                      v-if="index > 0"
                      @click="removeItems(index, 3)"
                      src="/static/images/icon-4.png"
                      alt=""
                    >
                    <img
                      v-if="index == 0&&ServerData.downloadFileOpts.length != 3"
                      @click="addItems(index, 3)"
                      src="/static/images/icon-5.png"
                      alt=""
                    >
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="serverCancel"
          @click="handleClose(1)"
        >取 消</el-button>
        <el-button
          name="serverSubmit"
          type="primary"
          @click="changeDomain('ServerData',0)"
        >提 交</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="配置业务域名"
      width="35%"
      :visible.sync="dialogBusinessVisible"
      :before-close="handleClose"
      center
    >
      <el-form
        ref="domainsData"
        :model="domainsData"
      >
        <div>
          <p>业务域名需经过ICP备案，新备案域名需24小时后才可配置。域名格式只支持英文大小写字母、数字及“- ”，不支持IP地址及端口号</p>
          <el-row class="m-t-10">
            <el-form-item
              class="err-msg-sty"
              v-for="(item, index) in domainsData.domainsOpts"
              :prop="'domainsOpts['+index+'].domainUrl'"
              :key="index"
              :rules="{required: true, message: '域名不能为空', trigger: 'blur'}"
            >
              <el-col
                :span="3"
                class="text-center"
              >
                域名{{index + 1}}：
              </el-col>
              <el-col :span="18">
                <el-input v-model="item.domainUrl"></el-input>
              </el-col>
              <el-col
                :span="3"
                class="p-l-30"
              >
                <img
                  v-if="index > 0"
                  @click="removeDomains(index)"
                  src="/static/images/icon-4.png"
                  alt=""
                >
                <img
                  class="m-t-10"
                  v-if="index == 0&&domainsData.domainsOpts.length != 3"
                  @click="addDomains(index)"
                  src="/static/images/icon-5.png"
                  alt=""
                >
              </el-col>
            </el-form-item>
          </el-row>
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="businessCancel"
          @click="handleClose(2)"
        >取 消</el-button>
        <el-button
          name="businessSubmit"
          type="primary"
          @click="changeDomain('domainsData', 1)"
        >提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  MARKETING_API_WX_APPLET_GETACCOUNTBASICINFO, //  小程序 - 获取帐号基本信息
  MARKETING_API_WX_APPLET_GETMEMBERBINDERS, // 小程序 - 获取体验者列表
  MARKETING_API_WX_APPLET_UNBINDTESTER, // 小程序 - 解除绑定小程序的体验者
  MARKETING_API_WX_APPLET_BINDTESTER, // 小程序 - 绑定微信用户为小程序体验者
  MARKETING_API_WX_APPLET_MODIFYDOMAIN, // 小程序 - 设置服务器域名
  MARKETING_API_WX_APPLET_SETWEBVIEWDOMAIN // 小程序 - 设置业务域名
} from '@/apis/marketing.js'

import { PaymentType } from '@/enums/common.js'
import {
  RechargeOrderResultStatus,
  RechargeOrderStatus
} from '@/enums/marketing.js'
import { WxAppletStatus } from '@/enums/component.js'

import { DOMAIN_APIS } from '@/configs/appSettings.js'
export default {
  data() {
    return {
      formInline: {
        Status: '0'
      },
      formData: {
        WechatId: ''
      },
      rule: {
        WechatId: [
          {
            required: true,
            message: '微信号不能为空',
            trigger: 'blur'
          },
          {
            max: 50,
            message: '长度最多 50 个字符',
            trigger: 'blur'
          }
        ]
      },
      userDetail: {
        HeadImgUrl: ''
      },
      ServerData: {
        requestOpts: [
          {
            requestUrl: 'https://'
          }
        ],
        socketOpts: [
          {
            socketUrl: 'wws://'
          }
        ],
        uploadFileOpts: [
          {
            uploadFileUrl: 'https://'
          }
        ],
        downloadFileOpts: [
          {
            downloadFileUrl: 'https://'
          }
        ]
      },
      requestOpts: [],
      socketOpts: [],
      uploadFileOpts: [],
      downloadFileOpts: [],

      domainsData: {
        domainsOpts: [
          {
            domainUrl: 'https://'
          }
        ]
      },
      CategoriesLists: [],
      AuthorizerId: '',
      menusState0: true,
      menusState1: false,
      menusState2: false,
      menusState3: false,
      menusState4: false,
      dialogServerVisible: false,
      dialogBusinessVisible: false,
      contentLoading: false,
      dialogVisible: false,
      hasPwd: false,
      createTime: [],
      tableData: [{}],
      serMenus: '',
      experiencer: [],
      AuthorizerIds: [],
      WxAppletStatus: WxAppletStatus,
      RechargeOrderStatus: RechargeOrderStatus,
      RechargeOrderResultStatus: RechargeOrderResultStatus,
      PaymentType: PaymentType,
      page: {
        PageIndex: 1,
        PageSize: 10
      },
      isDraft: true,
      AppletQRCode: ''
    }
  },
  mounted() {
    this.AuthorizerId = this.$route.query.authorizerId
    this.getList()
  },
  methods: {
    getList() {
      this.contentLoading = true
      MARKETING_API_WX_APPLET_GETACCOUNTBASICINFO({
        AuthorizerId: this.AuthorizerId
      })
        .then(res => {
          if (res.data.Code == 'CORRECT') {
            this.userDetail = res.data.Data || {}
            // 服务类目
            let lists = []
            let Categories = ''
            lists = JSON.parse(res.data.Data.Categories)
            this.CategoriesLists = []
            if (lists.length > 0) {
              lists.forEach(m => {
                Categories = m.first_class + '>' + m.second_class
                this.CategoriesLists.push(Categories)
              })
            }
            this.AppletQRCode =
              DOMAIN_APIS.Marketing +
              '/api/WxApplet/GetAppletQRCode?AuthorizerId=' +
              this.AuthorizerId

            // 服务器域名
            if (
              this.userDetail.SerDomain != ' ' &&
              this.userDetail.SerDomain != ''
            ) {
              let options = []
              options = res.data.Data.SerDomain.split('|')
              if (options.length > 0) {
                this.requestOpts = options[0].split(',')
                this.socketOpts = options[1].split(',')
                this.uploadFileOpts = options[2].split(',')
                this.downloadFileOpts = options[3].split(',')
              }
            }

            // 业务域名
            if (
              this.userDetail.BusDomain != ' ' &&
              this.userDetail.BusDomain != ''
            ) {
              let arr = []
              this.domainsData.domainsOpts = []
              arr = this.userDetail.BusDomain.split(',')
              arr.forEach(m => {
                this.domainsData.domainsOpts.push({
                  domainUrl: m
                })
              })
            }
          }
          this.contentLoading = false
        })
        .catch(() => {
          this.contentLoading = false
        })
    },
    handleSelect(val) {
      switch (val) {
        case 0: 
          this.menusState0 = true
          this.menusState1 = false
          this.menusState2 = false
          this.menusState3 = false
          this.menusState4 = false
          break
        case 1:
          this.menusState0 = false
          this.menusState1 = true
          this.menusState2 = false
          this.menusState3 = false
          this.menusState4 = false
          break
        case 2:
          this.menusState0 = false
          this.menusState1 = false
          this.menusState2 = true
          this.menusState3 = false
          this.menusState4 = false
          break
        case 3:
          this.menusState0 = false
          this.menusState1 = false
          this.menusState2 = false
          this.menusState3 = true
          this.menusState4 = false
          break
        case 4:
          this.getExperiencer()
          this.menusState0 = false
          this.menusState1 = false
          this.menusState2 = false
          this.menusState3 = false
          this.menusState4 = true
          break
        default: 
          break
      }
    },
    getExperiencer() {
      MARKETING_API_WX_APPLET_GETMEMBERBINDERS({
        AuthorizerId: this.AuthorizerId
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.experiencer = res.data.Data.members || []
        }
      })
    },
    changeDomain(formData, state) {
      // 初始化数组
      this.AuthorizerIds = []

      this.AuthorizerIds.push(this.$route.query.authorizerId)
      this.$refs[formData].validate(valid => {
        if (valid) {
          switch (state) {
            case 0: {
              let arr1 = []
              let arr2 = []
              let arr3 = []
              let arr4 = []
              this.ServerData.requestOpts.forEach(m => {
                arr1.push(m.requestUrl)
              })
              this.ServerData.socketOpts.forEach(m => {
                arr2.push(m.socketUrl)
              })
              this.ServerData.uploadFileOpts.forEach(m => {
                arr3.push(m.uploadFileUrl)
              })
              this.ServerData.downloadFileOpts.forEach(m => {
                arr4.push(m.downloadFileUrl)
              })
              let obj
              obj = Object.assign(
                {},
                {
                  WxaServer_Request: arr1,
                  WxaServer_Socket: arr2,
                  WxaServer_Upload: arr3,
                  WxaServer_Download: arr4
                },
                {
                  AuthorizerIds: this.AuthorizerIds
                }
              )
              MARKETING_API_WX_APPLET_MODIFYDOMAIN(obj).then(res => {
                this.dialogServerVisible = false
                if (res.data.Code == 'CORRECT') {
                  this.$message({
                    type: 'success',
                    message: '修改成功！'
                  })
                  this.getList()
                }
              })
              break
            }
            case 1: {
              let Domain = []
              this.domainsData.domainsOpts.forEach(m => {
                Domain.push(m.domainUrl)
              })
              let obj1 = Object.assign(
                {},
                {
                  Domain: Domain
                },
                {
                  AuthorizerIds: this.AuthorizerIds
                }
              )
              MARKETING_API_WX_APPLET_SETWEBVIEWDOMAIN(obj1).then(res => {
                this.dialogBusinessVisible = false
                if (res.data.Code == 'CORRECT') {
                  this.$message({
                    type: 'success',
                    message: '修改成功！'
                  })
                }
              })
              break
            }
            default:
              break
          }
        }
      })
    },
    removeItems(i, state) {
      switch (state) {
        case 0:
          if (this.ServerData.requestOpts.length > 1) {
            this.ServerData.requestOpts.splice(i, 1)
          }
          break
        case 1:
          if (this.ServerData.socketOpts.length > 1) {
            this.ServerData.socketOpts.splice(i, 1)
          }
          break
        case 2:
          if (this.ServerData.uploadFileOpts.length > 1) {
            this.ServerData.uploadFileOpts.splice(i, 1)
          }
          break
        case 3:
          if (this.ServerData.downloadFileOpts.length > 1) {
            this.ServerData.downloadFileOpts.splice(i, 1)
          }
          break
        default: 
          break
      }
    },
    addItems(i, state) {
      switch (state) {
        case 0:
          if (this.ServerData.requestOpts.length < 3) {
            this.ServerData.requestOpts.push({
              requestUrl: 'https://'
            })
          }
          break
        case 1:
          if (this.ServerData.socketOpts.length < 3) {
            this.ServerData.socketOpts.push({
              socketUrl: 'wws://'
            })
          }
          break
        case 2:
          if (this.ServerData.uploadFileOpts.length < 3) {
            this.ServerData.uploadFileOpts.push({
              uploadFileUrl: 'https://'
            })
          }
          break
        case 3:
          if (this.ServerData.downloadFileOpts.length < 3) {
            this.ServerData.downloadFileOpts.push({
              downloadFileUrl: 'https://'
            })
          }
          break
        default: 
          break
      }
    },
    addDomains() {
      if (this.domainsData.domainsOpts.length < 3) {
        this.domainsData.domainsOpts.push({
          domainUrl: 'https://'
        })
      }
    },
    removeDomains(i) {
      this.domainsData.domainsOpts.splice(i, 1)
    },
    onSubmit(formData) {
      this.$refs[formData].validate(valid => {
        if (valid) {
          let obj = Object.assign(
            {},
            {
              AuthorizerId: this.AuthorizerId
            },
            this.formData
          )
          MARKETING_API_WX_APPLET_BINDTESTER(obj).then(res => {
            this.dialogVisible = false
            // this.$message(res.data.Message)
            if (res.data.Code == 'CORRECT') {
              this.getExperiencer()
              this.$message({
                type: 'success',
                message: '绑定成功！'
              })
            }
          })
        }
      })
    },
    BusinessDomain() {
      this.dialogBusinessVisible = true
    },
    modifyDomain() {
      if (this.requestOpts.length > 0) {
        this.ServerData.requestOpts = []
        this.requestOpts.forEach(m => {
          this.ServerData.requestOpts.push({
            requestUrl: m
          })
        })
      } else {
        this.ServerData.requestOpts = [
          {
            requestUrl: 'https://'
          }
        ]
      }

      if (this.socketOpts.length > 0) {
        this.ServerData.socketOpts = []
        this.socketOpts.forEach(m => {
          this.ServerData.socketOpts.push({
            socketUrl: m
          })
        })
      } else {
        this.ServerData.socketOpts = [
          {
            socketUrl: 'https://'
          }
        ]
      }

      if (this.uploadFileOpts.length > 0) {
        this.ServerData.uploadFileOpts = []
        this.uploadFileOpts.forEach(m => {
          this.ServerData.uploadFileOpts.push({
            uploadFileUrl: m
          })
        })
      } else {
        this.ServerData.uploadFileOpts = [
          {
            uploadFileUrl: 'https://'
          }
        ]
      }

      if (this.downloadFileOpts.length > 0) {
        this.ServerData.downloadFileOpts = []
        this.downloadFileOpts.forEach(m => {
          this.ServerData.downloadFileOpts.push({
            downloadFileUrl: m
          })
        })
      } else {
        this.ServerData.downloadFileOpts = [
          {
            downloadFileUrl: 'https://'
          }
        ]
      }

      this.dialogServerVisible = true
    },
    UntieExperience(e) {
      e.currentTarget.blur()
      this.$confirm('解绑后无法体验小程序，确定要解绑吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let obj = Object.assign(
            {},
            {
              AuthorizerId: this.AuthorizerId
            },
            {
              WechatId: 'wxid_r94qiep6ubb921'
            }
          )
          MARKETING_API_WX_APPLET_UNBINDTESTER(obj).then(res => {
            if (res.data.Code == 'CORRECT') {
              this.getExperiencer()
              this.$message({
                type: 'success',
                message: '解绑成功！'
              })
            }
          })
        })
        .catch(() => {})
    },
    handleClose() {
      if (this.dialogVisible) {
        this.$refs.formData.resetFields()
        this.dialogVisible = false
      } else if (this.dialogServerVisible) {
        this.$refs.ServerData.resetFields()
        this.dialogServerVisible = false
      } else if (this.dialogBusinessVisible) {
        this.$refs.domainsData.resetFields()
        this.dialogBusinessVisible = false
      }
    },
    search() {
      this.page.PageIndex = 1
      let obj = Object.assign({}, this.formInline, this.page)
      this.setRoutes(Object.assign({}, obj))
    },
    handleSizeChange(value) {
      // 切换每页显示数
      this.page.PageSize = value
      this.page.PageIndex = 1
      this.getList()
    },
    handleCurrentChange(value) {
      // 切换当前页
      this.page.PageIndex = value
      this.getList()
    }
  }
}
</script>
<style lang="scss">
.table-box {
  .el-table--border {
    border-top: none;
  }
}
</style>
<style lang="scss" scoped>
.first-top-box {
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  height: 40px;
  .to-left {
    float: left;
  }
  .width-half {
    width: calc(50% - 1px);
    height: 100%;
    line-height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:nth-of-type(1) {
      width: calc(50%-1px);
      border-right: 1px solid #ddd;
    }
    .first-top-title-l {
      display: inline-block;
      width: 100px;
      text-align: center;
      background: #f2f2f2;
      border-right: 1px solid #ddd;
    }
    .first-top-title-r {
      display: inline-block;
      width: calc(100% - 111px);
    }
  }
}
.content-box {
  .content-t {
    height: 40px;
    line-height: 40px;
    text-align: center;
    // padding-left: 25px;
    background: #e4e4e4;
    .content-t-l-100 {
      width: 100px;
    }
    .content-t-l {
      float: left;
      width: 150px;
    }
    .content-t-c {
      float: left;
      height: 100%;
      width: calc(100% - 300px);
    }
    .content-t-r {
      float: left;
      width: 150px;
    }
  }

  .content-c {
    display: block;
    // float: left;
    width: 100%;
    height: 41px;
    line-height: 40px;
    text-align: center;
    vertical-align: middle;
    border-bottom: 1px solid #ddd;
    .content-l {
      float: left;
      width: 100px;
      height: 40px;
    }
    .content-l-150 {
      float: left;
      width: 150px;
      height: 40px;
    }
    span {
      float: left;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      text-align: left;
      box-sizing: border-box;
      width: calc(100% - 120px);
      padding: 0 10px;
    }
    .content-c-c {
      float: left;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding-left: 10px;
      text-align: left;
      width: calc(100% - 310px);
    }
    .content-c-r {
      float: left;
      width: 150px;
      cursor: pointer;
    }
    .span-150 {
      width: calc(100% - 170px);
    }
    img {
      float: left;
      width: 40px;
      height: 40px;
    }
  }
}
.top-m-25 {
  width: 100%;
  height: 25px;
}
.configure-box {
  max-height: 650px;
  border-bottom: 1px solid #ddd;
}
.content-title {
  background: #e4e4e4;
  height: 40px;
}
.content-title .el-col {
  height: 40px !important;
  line-height: 40px;
  box-sizing: border-box;
}
.to-center {
  text-align: center;
}
.text-row .el-col {
  height: 40px !important;
  line-height: 40px;
  border-bottom: 1px solid #ddd;
}
.btn-sty {
  margin: 10px;
}
.h40 {
  height: 40px;
}
.border-b-1px {
  border-bottom: 1px solid #e5e5e5;
}
.p-l-20 {
  padding-left: 20px;
}
</style>

