
<template>
  <div class>
    <panel v-if="character == CharacterType.Lingcb" :border="true" CustmerClass="fix-panel fix-size">
      <template slot="header">积分商城</template>
      <template slot="body">
        <div class="list">
          <p>礼品换购商城：/pages/shop/index</p>
        </div>
      </template>
    </panel>
    <panel v-if="character == CharacterType.Lingcb" :border="true" CustmerClass="fix-panel fix-size m-t-10">
      <template slot="header">尊享服务</template>
      <template slot="body">
        <div class="list">
          <p>以旧换新：{{DOMAIN_BASE.vip}}/market/productdetail?authorizerid={{authorizerId}}</p>
          <p>特惠活动：/pages/index/index</p>
          <p>我的卡券：{{DOMAIN_BASE.vip}}/UserCard/cardlist?authorizerid={{authorizerId}}</p>
        </div>
      </template>
    </panel>
    <panel v-if="character == CharacterType.Lingcb" :border="true" CustmerClass="fix-panel fix-size m-t-10 m-b-10">
      <template slot="header">VIP中心</template>
      <template slot="body">
        <div class="list">
          <!-- <p>犒赏一下：{{DOMAIN_BASE.vip}}/assess/employeelist?authorizerId={{$authorizerId}}</p> -->
          <p>会员中心：{{DOMAIN_BASE.vip}}/home/index?authorizerid={{authorizerId}}</p>
          <p>联系客服：{{DOMAIN_BASE.vip}}/home/contact?authorizerid={{authorizerId}}</p>
          <p>领会员卡：{{WxCardUrl || '未创建会员卡'}}</p>
        </div>
      </template>
    </panel>
    <el-row>
      <el-col :sm="24" :lg="8" class="p-r-10">
        <panel CustmerClass="fix-panel fix-size fix-p left-menu" :border="true">
          <template slot="header">
            <el-button type="text" @click="createFirstMenu" class="m-l-10">创建一级菜单</el-button>
          </template>
          <template slot="body">
            <div class="menu-list" v-loading="isLoading">
              <div class="h-auto" v-for="item in firstMenus" :key="item.MenuId">
                <div class="clear-fix">
                  <i :class="item.openMenu ? 'icon-shrink': 'icon-Open'" @click="item.openMenu = !item.openMenu" class="m-r-5 left-btn"></i>
                  <span class="title">{{item.MenuTitle}}</span>
                  <span class="fr">
                    <i class="icon-add1" title="创建下一级菜单" @click="createSecondMenu(item.MenuId)"></i>
                    <i
                      class="icon-reduce1"
                      title="删除"
                      @click="deleteMenu($event,item.MenuId)"
                      v-if="character == CharacterType.Lingcb || item.IsDefault == YNStatus.No && (character == CharacterType.Store || character == CharacterType.Company)"
                    ></i>
                    <i
                      class="icon-edit"
                      title="编辑"
                      @click="edidtMenu(item)"
                      v-if="character == CharacterType.Lingcb || item.IsDefault == YNStatus.No && (character == CharacterType.Store || character == CharacterType.Company)"
                    ></i>
                  </span>
                </div>
                <ul v-if="item.openMenu">
                  <template v-for="subItem in secondMenus">
                    <li v-if="subItem.ParentId == item.MenuId" :key="subItem.MenuId" class="clear-fix">
                      <span class="fl">{{subItem.MenuTitle}}</span>
                      <span class="fr">
                        <i
                          class="icon-reduce1"
                          title="删除"
                          @click="deleteMenu($event,subItem.MenuId)"
                          v-if="character == CharacterType.Lingcb || subItem.IsDefault == YNStatus.No && (character == CharacterType.Store || character == CharacterType.Company)"
                        ></i>
                        <i
                          class="icon-edit"
                          title="编辑"
                          @click="edidtMenu(subItem)"
                          v-if="character == CharacterType.Lingcb || subItem.IsDefault == YNStatus.No && (character == CharacterType.Store || character == CharacterType.Company)"
                        ></i>
                      </span>
                    </li>
                  </template>
                </ul>
              </div>
            </div>
          </template>
        </panel>
      </el-col>
      <el-col :sm="24" :lg="16">
        <Panel CustmerClass="fix-panel fix-size fix-p " :border="true">
          <template slot="header">{{level}}级菜单</template>
          <template slot="body">
            <el-form class="fix-w form p-t-10" label-width="160px" :model="form" :validate-on-rule-change="false" :rules="rules" ref="form" v-loading="formLoading">
              <!-- <el-form-item label="菜单名称：" prop="MenuTitle">
                <el-input name="MenuTitle" v-model="form.MenuTitle" class="w-238 t">
                  <el-button name="MenuTitleBtn" slot="append" :class="'fz-16'+(EmojiVisible?'active':'')" @click="showEmoji"><i class="icon-face"></i></el-button>
                </el-input>
              </el-form-item>
              <Emoji @listenIconVisible="listenIconVisible" v-show="EmojiVisible"></Emoji>-->
              <el-form-item class="box-icon" prop="MenuTitle" label="菜单名称：">
                <el-input name="MenuTitle" id="input" v-model="form.MenuTitle" :maxlength="level == '二' ? 16 : 8" @focus="EmojiVisible = false">
                  <el-button name="MenuTitleBtn" slot="append" @click.stop="EmojiVisible = !EmojiVisible">
                    <i class="icon-face" style="font-size: 16px;"></i>
                  </el-button>
                </el-input>
                <div class="all-icons" v-if="EmojiVisible">
                  <emoji @listenIconVisible="listenIconVisible"></emoji>
                </div>
              </el-form-item>
              <el-form-item>注：主菜单按钮文字不超过4个汉字或8个字母，子菜单标题最多不得超过8个汉字或16个字母</el-form-item>
              <el-form-item label="触发方式：" prop="MenuType">
                <el-radio-group name="MenuType" v-model="form.MenuType" @change="exchangeType">
                  <template v-for="item in WxMenuType.TypeArray.filter(item=>item.KeyId<10)">
                    <el-radio v-if="item.KeyId != WxMenuType.Type2" :key="parseInt(item.KeyId)" :value="parseInt(item.KeyId)" :label="parseInt(item.KeyId)">{{item.Value}}</el-radio>
                  </template>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="form.MenuType !== 7" label="消息关键词Key：" prop="Keywords">
                <el-input name="Keywords" onkeyup="this.value=this.value.replace(/\s+/g,'')" v-model="form.Keywords" class="w-238"></el-input>
              </el-form-item>
              <el-form-item v-if="form.MenuType == 9" label="消息类型：" prop="ClickType">
                <el-radio-group name="ClickType" v-model="form.ClickType" @change="exClickType">
                  <el-radio v-for="item in ClickType.TypeArray" :key="item.KeyId" :value="item.KeyId" :label="item.KeyId">{{item.Value}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="form.ClickType == ClickType.Text && form.MenuType === WxMenuType.Type5" label="消息内容：" prop="MsgCont">
                <el-input name="MsgCont" class="w-238" type="textarea" :rows="2" placeholder="请输入内容" v-model="form.MsgCont"></el-input>
              </el-form-item>
              <el-form-item v-if="form.ClickType == ClickType.Image && form.MenuType == WxMenuType.Type5" label="消息内容：" prop="MsgCont">
                <img v-if="form.MsgCont" width="360px" height="200px" :src="$root.settings.DOMAIN_IMG_FILE + form.MsgCont" class="avatar">
                <input name="MsgContHidden" type="hidden" v-model="form.MsgCont">
                <uploadImgByBtn :Root="$root.filePaths.SETTING_WXPUBLIC" @uploadSucc="uploadSucc" type="primary" size="mini">点击上传</uploadImgByBtn>
                <div class="el-upload__tip">图片尺寸建议:360像素*200像素</div>
              </el-form-item>
              <el-form-item label="appId：" prop="AppletId" v-if="form.MenuType==WxMenuType.Type4">
                <el-input name="AppletId" v-model="form.AppletId" class="w-238"></el-input>
              </el-form-item>
              <el-form-item v-if="form.ClickType != ClickType.Image" label="跳转链接：" prop="LinkUrl">
                <el-input name="LinkUrl" v-model="form.LinkUrl" @change="form.LinkUrl = trim(form.LinkUrl)" class="w-238"></el-input>
              </el-form-item>
              <el-form-item label="排列序号：" prop="SortID">
                <el-input nam="SortID" v-model.number="form.SortID" class="w-238"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button name="OnSave" type="primary" v-if="!form.menuEdit" @click="OnSave('form')">保存</el-button>
                <el-button name="OnUpdate" type="primary" v-if="form.menuEdit" @click="OnUpdate('form')">保存</el-button>
                <el-button name="OnRelease" type="info" @click="OnRelease('form')">发布到公众号</el-button>
              </el-form-item>
            </el-form>
          </template>
        </Panel>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  MARKETING_API_WEB_CHAT_GETCARDCODE, // 微信管理 - 菜单(会员卡号)
  MARKETING_API_WEB_CHAT_MENULIST, //  微信管理 - 菜单(列表)
  MARKETING_API_WEB_CHAT_MENUCREATE, // 微信管理 - 微信菜单(创建)
  MARKETING_API_WEB_CHAT_MENUUPDATE, // 微信管理 - 微信菜单(更新)
  MARKETING_API_WEB_CHAT_MENUDETELE, // 微信管理 - 菜单(删除)
  MARKETING_API_WEB_CHAT_MENURELEASE, // 微信管理 - 菜单(发布)
  MARKETING_API_WEB_CHAT_GETAUTHORIZERID
} from '@/apis/marketing.js'

import { CharacterType, YNStatus } from '@/enums/common'
import { WxMenuType, ClickType, WxAppletUnStatus } from '@/enums/component'
import { PaymentAuthorizerType } from '@/enums/payment'

import {
  DOMAIN_BASE,
  DOMAIN_IMAGE,
  DOMAIN_APIS,
  DOMAIN_TEMP
} from '@/configs/appSettings.js'

import Panel from '@/components/panel.vue'
import Emoji from './emoji'
import uploadImgByBtn from '@/components/common/uploadImgByBtn'

export default {
  data() {
    return {
      authorizerId: '',
      isLoading: false,
      formLoading: false,
      uploadUrl:
        DOMAIN_APIS.Marketing +
        '/api/Utility/ImageUpload?DestMapPath=' +
        encodeURI('/wx/') +
        '&sizes=240x120,Crop|480x240,Crop|360x200,Crop',
      form: {
        menuEdit: false,
        ParentId: 0,
        AuthorizerId: '',
        MenuTitle: '',
        MenuType: WxMenuType.Type1,
        ClickType: ClickType.Text + '',
        MsgCont: '',
        Keywords: '',
        LinkUrl: '',
        SortUrl: '',
        MediaID: '',
        SortID: '',
        IsDefault: '',
        AppletId: ''
      },
      DOMAIN_BASE,
      MsgCont: '',
      CharacterType: CharacterType,
      character: '',
      YNStatus,
      PaymentAuthorizerType,
      ClickType: ClickType,
      WxMenuType: WxMenuType,
      WxAppletUnStatus,
      MenuList: [],
      firstMenus: [],
      secondMenus: [],
      WxCardUrl: '',
      EmojiVisible: false,
      level: '一',
      rules: {
        LinkUrl: [
          {
            required: true,
            message: '不能为空！'
          },
          {
            max: 200,
            message: '链接长度不能超过200个字符'
          },
          {
            validator: this.validateFullUrl
          }
        ],
        Keywords: [
          {
            required: true,
            message: '不能为空！'
          },
          {
            min: 1,
            max: 100,
            message: '不可超过100个字！'
          }
        ],
        AppletId: [
          {
            required: false,
            message: 'a不能为空！'
          }
        ],
        MenuTitle: [
          {
            required: true,
            message: '不能为空！'
          },
          {
            validator: this.validateTitle
          }
        ],
        SortID: [
          {
            required: true,
            message: '不能为空！'
          },
          {
            type: 'number',
            min: 0,
            max: 999999999,
            message: '请输入正整数且大于等于0并小于99999999'
          },
          {
            validator: this.intTest
          }
        ],
        MsgCont: [
          {
            required: true,
            message: '消息内容不能为空！',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  components: {
    Panel,
    Emoji,
    uploadImgByBtn
  },
  // 菜单高亮
  beforeRouteEnter(to, from, next) {
    let character = JSON.parse(decodeURIComponent(localStorage.userInfo))
      .CharacterType
    if (character == CharacterType.Lingcb) {
      to.meta.parentPath = '/setter/wxpublic/index'
    }
    next()
  },
  created() {
    this.character = this.$store.getters['user_session'].CharacterType
  },
  mounted() {
    this.authorizerId = this.$route.query.authorizerId || ''
    this.getAuthorizerId().then(() => {
      if (this.authorizerId) {
        this.getWxCardCode()
        this.init()
      }
    })
  },
  methods: {
    async getAuthorizerId() {
      const res = await MARKETING_API_WEB_CHAT_GETAUTHORIZERID()
      if (res.data.Code === 'CORRECT') {
        if (
          this.$store.getters.user_session.CharacterType !==
          this.CharacterType.Lingcb
        ) {
          this.authorizerId = res.data.Data.AuthorizerId || ''
        }
      }
    },
    exClickType() {
      this.MsgCont = ''
      this.form.MsgCont = ''
      this.$refs['form'].clearValidate(['MsgCont'])
    },
    listenIconVisible(icon) {
      // 输入表情
      var textDom = document.getElementById('input')
      if (document.selection) {
        // IE Support
        textDom.focus()
        var selectRange = document.selection.createRange()
        selectRange.text = icon
        textDom.focus()
      } else if (textDom.selectionStart || textDom.selectionStart === 0) {
        // not IE
        let startPos = textDom.selectionStart
        let endPos = textDom.selectionEnd
        let scrollTop = textDom.scrollTop
        this.form.MenuTitle =
          this.form.MenuTitle.substring(0, startPos) +
          icon +
          this.form.MenuTitle.substring(startPos, this.form.MenuTitle.length)
        textDom.focus()
        textDom.selectionStart = startPos + icon.length
        textDom.selectionEnd = endPos + icon.length
        textDom.scrollTop = scrollTop
      } else {
        // all
        this.form.MenuTitle += icon
      }
      this.EmojiVisible = false
    },
    showEmoji() {
      if (this.EmojiVisible) {
        this.EmojiVisible = false
      } else {
        this.EmojiVisible = true
      }
    },
    hideEmoji() {
      this.EmojiVisible = false
    },
    exchangeType(value) {
      switch (value) {
        case 1:
          this.rules = {
            LinkUrl: [
              {
                required: true,
                message: '不能为空！'
              },
              {
                max: 200,
                message: '链接长度不能超过200个字符'
              },
              {
                validator: this.validateFullUrl
              }
            ],
            Keywords: [
              {
                required: true,
                message: '不能为空！'
              },
              {
                min: 1,
                max: 100,
                message: '不可超过100个字！'
              }
            ],
            AppletId: [
              {
                required: false,
                message: '不能为空！'
              }
            ],
            MenuTitle: [
              {
                required: true,
                message: '不能为空！'
              },
              {
                validator: this.validateTitle
              }
            ],
            SortID: [
              {
                required: true,
                message: '不能为空！'
              },
              {
                type: 'number',
                min: 0,
                max: 999999999,
                message: '请输入正整数且大于等于0并小于99999999'
              },
              {
                validator: this.intTest
              }
            ],
            MsgCont: [
              {
                required: true,
                message: '消息内容不能为空！'
              }
            ]
          }
          break
        case 3:
          this.rules = {
            Keywords: [
              {
                required: true,
                message: '消息关键词Key不能为空！'
              },
              {
                min: 1,
                max: 100,
                message: '不可超过100个字！'
              }
            ],
            LinkUrl: [
              {
                max: 200,
                message: '链接长度不能超过200个字符'
              },
              {
                required: false,
                validator: this.validateFullUrl2
              }
            ],
            AppletId: [
              {
                required: false,
                message: '不能为空！'
              }
            ],
            SortID: [
              {
                required: true,
                message: '不能为空！'
              },
              {
                type: 'number',
                min: 0,
                max: 999999999,
                message: '请输入正整数且大于等于0并小于99999999'
              },
              {
                validator: this.intTest
              }
            ],
            MenuTitle: [
              {
                required: true,
                message: '不能为空！'
              },
              {
                validator: this.validateTitle
              }
            ],
            MsgCont: [
              {
                required: true,
                message: '消息内容不能为空！'
              }
            ]
          }
          break
        case 5:
          this.rules = {
            LinkUrl: [
              {
                max: 200,
                message: '链接长度不能超过200个字符'
              },
              {
                required: false,
                validator: this.validateFullUrl2
              }
            ],
            Keywords: [
              {
                required: true,
                min: 0,
                max: 100,
                message: '不可超过100个字！'
              }
            ],
            MenuTitle: [
              {
                required: true,
                message: '不能为空！'
              },
              {
                validator: this.validateTitle
              }
            ],
            AppletId: [
              {
                required: false,
                min: 0,
                max: 100,
                message: '不可超过100个字！'
              }
            ],
            SortID: [
              {
                required: true,
                message: '不能为空！'
              },
              {
                type: 'number',
                min: 0,
                max: 999999999,
                message: '请输入正整数且大于等于0并小于99999999'
              },
              {
                validator: this.intTest
              }
            ]
          }
          break
        case 7:
          this.rules = {
            LinkUrl: [
              {
                required: true,
                message: '跳转链接不能为空！'
              },
              {
                max: 200,
                message: '链接长度不能超过200个字符'
              },
              {
                validator: this.validateUrl
              }
            ],
            AppletId: [
              {
                required: true,
                message: '不能为空！'
              }
            ],
            Keywords: [
              {
                required: false,
                min: 0,
                max: 100,
                message: '不可超过100个字！'
              }
            ],
            MenuTitle: [
              {
                required: true,
                message: '不能为空！'
              },
              {
                validator: this.validateTitle
              }
            ],
            SortID: [
              {
                required: true,
                message: '不能为空！'
              },
              {
                type: 'number',
                min: 0,
                max: 999999999,
                message: '请输入正整数且大于等于0并小于99999999'
              },
              {
                validator: this.intTest
              }
            ]
          }
          break
        case 9:
          this.form.ClickType = this.form.ClickType + ''
          this.rules = {
            LinkUrl: [
              {
                required: true,
                message: '跳转链接不能为空！'
              },
              {
                max: 200,
                message: '链接长度不能超过200个字符'
              },
              {
                validator: this.validateFullUrl
              }
            ],
            AppletId: [
              {
                required: false,
                message: '不能为空！'
              }
            ],
            Keywords: [
              {
                required: true,
                min: 0,
                max: 100,
                message: '不可超过100个字！'
              }
            ],
            MenuTitle: [
              {
                required: true,
                message: '不能为空！'
              },
              {
                validator: this.validateTitle
              }
            ],
            SortID: [
              {
                required: true,
                message: '不能为空！'
              },
              {
                type: 'number',
                min: 0,
                max: 999999999,
                message: '请输入正整数且大于等于0并小于99999999'
              },
              {
                validator: this.intTest
              }
            ],
            MsgCont: [
              {
                required: true,
                message: '消息内容不能为空！'
              }
            ]
          }
          break
        default:
      }
      setTimeout(() => {
        this.$refs['form'].clearValidate()
      }, 50)
    },

    OnSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.formLoading = true
          const { MenuType, ClickType } = this.form
          const obj = Object.assign({}, this.form, {
            AuthorizerId: this.authorizerId,
            IsDefault:
              this.character == CharacterType.Lingcb
                ? this.YNStatus.Yes
                : this.YNStatus.No,
            MenuType: +MenuType,
            ClickType: +ClickType
          })
          MARKETING_API_WEB_CHAT_MENUCREATE(obj)
            .then(res => {
              this.formLoading = false
              if (res.data.Code == 'CORRECT') {
                this.$message.success('保存成功！')
                this.MenuList.push(Object.assign({}, this.form))
                this.$refs['form'].resetFields()
                this.firstMenus = []
                this.secondMenus = []
                this.form.MsgCont = ''
                this.form.MenuType = 1
                this.MsgCont = ''
                this.form.Keywords = ''
                this.init()
                this.exchangeType(1)
              }
            })
            .catch(() => {
              this.formLoading = false
            })
        }
      })
    },
    OnUpdate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.formLoading = true
          const { MenuType, ClickType } = this.form
          let params = Object.assign({}, this.form, {
            AuthorizerId: this.authorizerId,
            IsDefault:
              this.character == CharacterType.Lingcb
                ? this.YNStatus.Yes
                : this.YNStatus.No,
            MenuType: +MenuType,
            ClickType: +ClickType
          })
          delete params.Data
          delete params.Message
          delete params.openMenu
          delete params.menuEdit
          MARKETING_API_WEB_CHAT_MENUUPDATE(params)
            .then(res => {
              if (res.data.Code == 'CORRECT') {
                this.$message.success('保存成功！')
                const ary = Object.assign({}, this.form)
                this.MenuList.forEach((item, index) => {
                  if (item.MenuId == ary.MenuId) {
                    this.$set(this.MenuList, index, ary)
                  }
                })
                this.$refs['form'].resetFields()
                this.firstMenus = []
                this.secondMenus = []
                this.form.MsgCont = ''
                this.form.MenuType = 1
                this.MsgCont = ''
                this.form.Keywords = ''
                this.init()
              }
              this.formLoading = false
            })
            .catch(() => (this.formLoading = false))
        }
      })
    },
    OnRelease() {
      this.formLoading = true
      MARKETING_API_WEB_CHAT_MENURELEASE({
        CharacterType: this.$store.getters.user_session.CharacterType,
        CharacterId: this.$store.getters.user_session.CharacterId,
        AuthorizerType:
          this.$store.getters.user_session.CharacterType ==
            CharacterType.Store
            ? this.PaymentAuthorizerType.Store
            : this.PaymentAuthorizerType.Company,
        AuthorizerId: this.authorizerId
      }).then(res => {
        this.formLoading = false
        if (res.data.Code == 'CORRECT') {
          this.$message.success('发布成功！')
        }
      })
    },
    createFirstMenu() {
      if(this.firstMenus&&this.firstMenus.length>=3){
        this.$message.error('自定义菜单最多包括3个一级菜单')
        return
      }
      this.level = '一'
      this.form.ParentId = 0
      this.$refs['form'].resetFields()
      this.form.menuEdit = false
      this.form.MenuType = 1
      this.exchangeType(1)
      this.form.Keywords = ''
      this.form.LinkUrl = ''
      this.form.MsgCont = ''
      this.form.AppletId = ''
      this.MsgCont = ''
    },
    createSecondMenu(id) {
      const theSecondMenus = this.secondMenus && this.secondMenus.filter(item=>item.ParentId == id) || []
      if(theSecondMenus.length>=5){
        this.$message.error('每个一级菜单最多包含5个二级菜单')
        return
      }
      this.level = '二'
      this.form.ParentId = id
      this.$refs['form'].resetFields()
      this.form.Keywords = ''
      this.form.LinkUrl = ''
      this.form.menuEdit = false
      this.form.MenuType = 1
      this.exchangeType(1)
      this.form.AppletId = ''
      this.form.MsgCont = ''
      this.MsgCont = ''
    },
    edidtMenu(data) {
      if (data.ParentId == 0) {
        this.level = '一'
      } else {
        this.level = '二'
      }
      this.form = Object.assign({}, data, {
        menuEdit: true
      })
      if (this.form.ClickType == ClickType.Image) {
        this.MsgCont =
          DOMAIN_IMAGE + this.form.MsgCont.replace('{0}', '360x200')
      }
      this.exchangeType(this.form.MenuType)
    },
    deleteMenu(e, id) {
      e.currentTarget.blur()
      this.$confirm('确定要删除菜单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.isLoading = true
          MARKETING_API_WEB_CHAT_MENUDETELE({
            MenuId: id
          }).then(() => {
            this.isLoading = false
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.firstMenus.forEach((item, index) => {
              if (item.MenuId == id) {
                this.firstMenus.splice(index, 1)
              }
            })
            this.secondMenus.forEach((item, index) => {
              if (item.MenuId == id) {
                this.secondMenus.splice(index, 1)
              }
            })
            this.createFirstMenu()
          })
        })
        .catch(() => { })
    },
    validateUrl(rule, value, callback) {
      const reg = new RegExp('^(/pages)(/[a-zA-Z0-9&%_./-~-]*)+', 'g')
      if (reg.test(value) || value === '') {
        callback()
      } else {
        callback(new Error('链接地址输入有误！'))
      }
    },
    validateFullUrl(rule, value, callback) {
      const reg = new RegExp(
        '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]'
      )
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('链接地址输入有误！'))
      }
    },
    validateFullUrl2(rule, value, callback) {
      const reg = new RegExp(
        '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]'
      )
      if (reg.test(value) || value == '' || value == undefined) {
        callback()
      } else {
        callback(new Error('链接地址输入有误！'))
      }
    },
    intTest(rule, value, callback) {
      const reg = /^((?!(0[0-9]$))[+]?[1-9]{1}[0-9]{0,8})||0$/g
      if (reg.test(value) && value >= 0) {
        callback()
      } else {
        callback(new Error('请输入正整数且大于等于0并小于99999999'))
      }
    },
    validateTitle(rule, value, callback) {
      let flag = true
      const $val = this.form.MenuTitle
      if (this.level === '二') {
        let len = $val.length
        let len1 =
          $val.match(/[\u4e00-\u9fa5]/g) !== null
            ? $val.match(/[\u4e00-\u9fa5]/g).length
            : 0
        let len2 =
          $val.match(/[a-zA-Z0-9]/g) !== null
            ? $val.match(/[a-zA-Z0-9]/g).length
            : 0
        let len3 = len - len1 - len2
        if (len1 * 2 + len2 + len3 * 2 > 16) {
          flag = false
        }
      } else if (this.level === '一') {
        let len = $val.length
        let len1 =
          $val.match(/[\u4e00-\u9fa5]/g) !== null
            ? $val.match(/[\u4e00-\u9fa5]/g).length
            : 0
        let len2 =
          $val.match(/[a-zA-Z0-9]/g) !== null
            ? $val.match(/[a-zA-Z0-9]/g).length
            : 0
        let len3 = len - len1 - len2

        if (len1 * 2 + len2 + len3 * 2 > 8) {
          flag = false
        }
      }
      if (!flag) {
        callback(new Error('输入有误'))
      } else {
        callback()
      }
    },
    handleAvatarSuccess(res) {
      if (res.Code == 'CORRECT') {
        this.MsgCont = DOMAIN_TEMP + res.Data.url.replace('{0}', '360x200')
        // this.MsgCont = file.url
        this.form.MsgCont = res.Data.url
        this.$message({
          type: 'success',
          message: '上传成功！'
        })
      }
    },
    getWxCardCode() {
      // 领取会员卡
      MARKETING_API_WEB_CHAT_GETCARDCODE({
        AuthorizerId: this.authorizerId
      }).then(res => {
        this.WxCardUrl = res.data.Data.ToUrl
      })
    },
    async init() {
      const res = await MARKETING_API_WEB_CHAT_MENULIST({
        AuthorizerId: this.authorizerId
      })
      this.isLoading = false
      if (res.data.Code === 'CORRECT') {
        this.MenuList = res.data.Data || []
        res.data.Data.forEach(m => {
          if (m.ParentId == 0) {
            this.$set(m, 'openMenu', true)
            this.firstMenus.push(m)
          } else {
            this.secondMenus.push(m)
          }
        })
      }
    },
    // 去左右空格;
    trim(m) {
      if (m) {
        return m.replace(/(^\s*)|(\s*$)/g, '')
      }
    },
    uploadSucc(ImageUrl) {
      this.MsgCont = DOMAIN_TEMP + ImageUrl
      this.form.MsgCont = ImageUrl
      this.$message({
        type: 'success',
        message: '上传成功！'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.panel {
  background-color: transparent;
  border: 1px solid #e5e5e5;
  /deep/ .panel-body {
    padding: 0;
  }
}
.list {
  line-height: 2;
  p {
    padding-left: 10px;
  }
}
.left-menu {
  border-bottom: none;
  /deep/ .panel-header {
    padding: 0;
    height: 35px;
    line-height: 35px;
  }
}
.menu-list {
  > div {
    border-bottom: 1px solid #e5e5e5;
    > div {
      height: 30px;
      line-height: 20px;
      padding: 5px 10px;
      box-sizing: border-box;
      > .title {
        font-size: 14px;
      }
      > .left-btn {
        color: #666666;
        font-size: 11px;
      }
    }
    .fr i {
      font-size: 18px;
      margin: 0 5px;
      &.icon-add1 {
        color: #399fe5;
      }
      &.icon-reduce1 {
        color: #e06161;
      }
      &.icon-edit {
        color: #666666;
      }
    }
    i {
      cursor: pointer;
    }
    &.h-auto {
      height: auto;
    }
    > ul {
      width: 100%;
      > li {
        padding: 5px 10px 5px 30px;
        width: 100%;
        height: 28px;
        line-height: 18px;
        box-sizing: border-box;
        > .fl {
          font-size: 14px;
          color: #666666;
        }
      }
    }
  }
}

.avatar {
  width: 360px;
  height: 200px;
}

.avatar-uploader .el-button {
  display: block;
}

.fix-size {
  .panel-header {
    font-size: 14px !important;
  }
}

.fz-16 {
  font-size: 16px !important;
  color: #aec9db !important;
}

.form {
  .active {
    color: #006db8 !important;
  }
}
</style>
