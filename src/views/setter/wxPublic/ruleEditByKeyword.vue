<template>
  <div>
    <el-form class="fix-w" label-width="120px" :model="form" :rules="rules" ref="form" v-loading="isLoading">
      <el-form-item label="规则名称：" prop="RuleTitle">
        <el-input name="RuleTitle" v-model="form.RuleTitle"></el-input>
      </el-form-item>
      <el-form-item label="触发事件：" prop="EventType">
        <el-select name="EventType" v-if="EventTypeOpt.length > 1" v-model="form.EventType" class="w-238">
          <el-option v-for="(item,index) in EventTypeOpt" :key="index" :value="item.value" :label="item.label"></el-option>
        </el-select>
        <el-input v-else :disabled="true" v-model="WxEventType.Types[form.EventType]"></el-input>
      </el-form-item>
      <el-form-item label="关键词：" prop="Keywords">
        <el-input name="Keywords" v-model="form.Keywords"></el-input>
      </el-form-item>
      <el-form-item label="匹配模式：" required>
        <el-radio-group name="MatchType" v-model="form.MatchType">
          <el-radio :label="WxMatchType.AllOf">完全匹配</el-radio>
          <el-radio :label="WxMatchType.PartOf">部分匹配</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="回复模式：" required>
        <el-radio-group name="ModeType" v-model="form.ModeType">
          <el-radio :label="WxModeType.Random">随机回复</el-radio>
          <el-radio :label="WxModeType.AllOf">全部回复</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="回复类型：" required>
        <el-radio-group name="ReplyType" v-model="form.ReplyType">
          <el-radio :label="WxReplyType.AutoRpl">自动回复</el-radio>
          <el-radio :label="WxReplyType.Keyword">关键字回复</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="内容类型：" required>
        <el-radio-group name="NoteType" v-model="form.NoteType" @change="openDialog">
          <el-radio :label="WxNoteType.Text">文字</el-radio>
          <el-radio :label="WxNoteType.News">图文</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.NoteType==WxNoteType.News" prop="ArticlesList">
        <ul class="w-500">
          <el-row tag="li" v-for="(item,index) in form.ArticlesList" :key="index" :gutter="5">
            <el-col :span="5">
              <img :src="item.PicUrlSuccess||$root.settings.DOMAIN_IMG_FILE+item.PicUrl.replace('{0}','150x0')" width="100px" height="100px" alt>
            </el-col>
            <el-col :span="19">
              <div class="detail">
                <h2>{{item.Title}}</h2>
                <p>{{item.Description}}</p>
                <el-button name="articleEdit" type="text" icon="fa fa-cog" @click="current=index;dialogVisible=true;handleReplyList(index)">修改</el-button>
                <el-button name="articleDelete" type="text" icon="fa fa-edit" @click="deleteReplyList(index)">删除</el-button>
              </div>
            </el-col>
          </el-row>
        </ul>
      </el-form-item>
      <el-form-item v-if="form.NoteType==WxNoteType.Text" key="1" prop="TextContent">
        <el-input name="TextContent" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" class="w-500 m-t-5" v-model="form.TextContent"></el-input>
      </el-form-item>
      <el-form-item label>
        <el-button name="saveForm" :loading="btnLoading" type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
    <!-- 设置图文回复 -->
    <el-dialog :visible.sync="dialogVisible" :close-on-press-escape="false" :close-on-click-modal="false" width="800px">
      <el-row :gutter="20">
        <el-col :span="8">
          <ul class="list">
            <li v-for="(item,index) in replyList" :key="index" :class="current == index?'cur':''" @click="handleReplyList(index)" :name="'reply'">
              <el-row :gutter="5">
                <el-col :span="11">
                  <img :src="item.PicUrlSuccess" width="100px" height="100px" alt>
                </el-col>
                <el-col :span="13">
                  <div class="detail">
                    <h2>{{item.Title}}</h2>
                    <p>{{item.Description}}</p>
                  </div>
                </el-col>
              </el-row>
            </li>
          </ul>
          <!-- <el-button type="primary" plain style="width:100%" icon="el-icon-plus" @click="addReply">添加</el-button> -->
        </el-col>
        <el-col :span="16">
          <el-form label-width="120px" :model="dialogFom" :rules="rules" ref="dialogFom">
            <el-form-item label="标题名称：" prop="Title">
              <el-input name="Title" v-model="dialogFom.Title" @change="formChange" class="w-238" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="上传图片：" prop="PicUrl">
              <!-- <el-upload
                class="upload-demo"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <el-button
                  name="uploadImg"
                  type="primary"
                  icon="fa fa-cloud-upload-alt"
                > 点击上传</el-button>
              </el-upload>-->
              <uploadImgByBtn :Root="$root.filePaths.SETTING_WXPUBLIC" type="primary" size="mini" @uploadSucc="uploadSucc">点击上传</uploadImgByBtn>
            </el-form-item>
            <el-form-item label="链接地址：" prop="Url">
              <el-input name="Url" v-model="dialogFom.Url" @change="formChange" class="w-238"></el-input>
            </el-form-item>
            <el-form-item label="内容：" prop="Description">
              <el-input name="Description" v-model="dialogFom.Description" @change="formChange" class="m-t-5" type="textarea" maxlength="200"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button name="cancel" @click="cancel">取 消</el-button>
        <el-button name="confirm" type="primary" @click="setList">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  MARKETING_API_WEB_CHAT_RULEBYKEYWORDDETAIL, // 微信管理 - 关键字回复(详细)
  MARKETING_API_WEB_CHAT_RULEUPDATEBYKEYWORD //  微信管理 - 关键字自动回复(更新)
} from '@/apis/marketing.js'

import { CharacterType } from '@/enums/common'
import {
  WxEventType,
  WxReplyType,
  WxMatchType,
  WxModeType,
  WxNoteType
} from '@/enums/component.js'

import {
  DOMAIN_APIS,
  DOMAIN_IMAGE
} from '@/configs/appSettings.js'
import uploadImgByBtn from '@/components/common/uploadImgByBtn'

export default {
  data() {
    return {
      DOMAIN_IMAGE,
      isLoading: false,
      uploadUrl:
        DOMAIN_APIS.Marketing +
        '/api/Utility/ImageUpload?DestMapPath=' +
        encodeURI('/wx/') +
        '&sizes=150x0,Max|1080x0,Max',
      form: {
        NoteType: 1,
        ReplyType: 1,
        MatchType: 1,
        ModeType: 1,
        RuleTitle: '',
        ArticlesByCreate: [],
        ArticlesByUpdate: [],
        ArticlesByRemove: []
      },
      current: 0,
      replyList: [],
      WxEventType: WxEventType,
      WxReplyType: WxReplyType,
      WxMatchType: WxMatchType,
      WxModeType: WxModeType,
      WxNoteType: WxNoteType,
      CharacterType,
      dialogFom: {
        ArticleId: '',
        Title: '',
        Description: '',
        Url: '',
        PicUrl: '',
        PicUrlSuccess: ''
      },
      dialogVisible: false,
      btnLoading: false,
      EventTypeOpt: [],
      NoteList: [],
      rules: {
        Title: [
          {
            required: true,
            message: '不能为空！'
          }
        ],
        PicUrl: [
          {
            required: true,
            message: '不能为空！'
          }
        ],
        Url: [
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
        Description: [
          {
            required: true,
            message: '不能为空！'
          }
        ],
        ArticlesByCreate: [
          {
            required: true,
            type: 'array',
            mesage: '不能为空'
          }
        ],
        EventType: [
          {
            required: true,
            message: '不能为空！'
          }
        ],
        TextContent: [
          {
            required: true,
            message: '不能为空！'
          },
          {
            min: 1,
            max: 300,
            message: '字数必须在1-300之间！'
          }
        ],
        RuleTitle: [
          {
            required: true,
            message: '不能为空！'
          },
          {
            min: 1,
            max: 30,
            message: '字数必须在1-30之间！'
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
            message: '字数必须在1-100之间！'
          }
        ]
      }
    }
  },
  // 菜单高亮
  beforeRouteEnter(to, from, next) {
    let character = JSON.parse(decodeURIComponent(localStorage.userInfo))
      .CharacterType
    if (character == CharacterType.Lingcb) {
      to.meta.parentPath = '/setter/wxpublic/index'
    } else {
      to.meta.parentPath = '/setter/wxpublic/replyedit'
    }
    next()
  },
  mounted() {
    this.getEnums()
    this.getDetail()
  },
  methods: {
    formChange() {
      this.$set(
        this.replyList,
        this.current,
        Object.assign({}, this.replyList[this.current], this.dialogFom)
      )
    },
    uploadSucc(ImageUrl) {
      this.dialogFom.PicUrl = ImageUrl
      this.dialogFom.PicUrlSuccess = ImageUrl
      this.$set(
        this.replyList[this.current],
        'PicUrlSuccess',
        this.dialogFom.PicUrlSuccess
      )
      this.$set(this.replyList[this.current], 'PicUrl', this.dialogFom.PicUrl)
      this.$refs['dialogFom'].validateField('PicUrl')
      this.$message({
        type: 'success',
        message: '上传成功！'
      })
    },
    /* handleAvatarSuccess(res, file, fileList) {
      if (res.Code == 'CORRECT') {
        this.dialogFom.PicUrlSuccess =
          DOMAIN_TEMP + res.Data.url.replace('{0}', '150x0')
        this.dialogFom.PicUrl = res.Data.url
        this.$set(
          this.replyList[this.current],
          'PicUrlSuccess',
          this.dialogFom.PicUrlSuccess
        )
        this.$set(this.replyList[this.current], 'PicUrl', this.dialogFom.PicUrl)
        this.$refs['dialogFom'].validateField('PicUrl')
        this.$message({
          type: 'success',
          message: '上传成功！'
        })
      }
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === 'image/jpeg' ||
        'image/png' ||
        'image/gif' ||
        'image/bmp' ||
        'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('只能上传"jpeg,png,gif,bmp,gif"')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }, */
    deleteReplyList(i) {
      if (this.form.ArticlesList[i].ArticleId) {
        this.form.ArticlesByRemove.push(Object.assign({}, this.replyList[i]))
      }

      this.form.ArticlesList.splice(i, 1)

      this.replyList.splice(i, 1)
      this.form.ArticlesByCreate = []
      this.form.ArticlesByUpdate = []
      this.form.ArticlesList.forEach(item => {
        if (item.isCreate) {
          this.form.ArticlesByCreate.push(item)
        } else {
          this.form.ArticlesByUpdate.push(item)
        }
      })
      if (this.replyList.length <= 0) {
        this.form.NoteType = WxNoteType.Text
      }
    },
    handleReplyList(i) {
      this.current = i
      this.replyList[i].PicUrlSuccess =
        DOMAIN_IMAGE + this.replyList[i].PicUrl.replace('{0}', '150x0')
      this.dialogFom = this.replyList[i]
    },
    cancel() {
      this.dialogVisible = false
      this.replyList = []
      this.form.ArticlesList.forEach(item => {
        this.replyList.push(Object.assign({}, item))
      })
      this.dialogFom = {
        ArticleId: '',
        Title: '',
        Description: '',
        Url: '',
        PicUrl: '',
        PicUrlSuccess: ''
      }
      if (this.form.ArticlesList[0] !== undefined) {
        if (this.form.ArticlesList[0].Title == '') {
          this.form.NoteType = WxNoteType.Text
        }
      } else {
        this.form.NoteType = WxNoteType.Text
      }
    },
    openDialog() {
      if (this.form.NoteType === WxNoteType.News) {
        this.setFlag = false
        this.dialogVisible = true
        if (this.form.ArticlesList.length <= 0) {
          this.replyList.push({
            ArticleId: '',
            Title: '',
            Description: '',
            Url: '',
            PicUrl: '',
            PicUrlSuccess: '',
            isCreate: true
          })
        } else {
          this.replyList = []
          this.form.ArticlesList.forEach(item => {
            this.replyList.push(Object.assign({}, item))
          })
        }
      }
    },
    setList() {
      this.$refs['dialogFom'].validate(valid => {
        if (valid) {
          this.setFlag = true
          this.dialogVisible = false
          setTimeout(() => {
            this.dialogFom = {
              ArticleId: '',
              Title: '',
              Description: '',
              Url: '',
              PicUrl: '',
              PicUrlSuccess: ''
            }
          }, 50)
          this.$refs['dialogFom'].clearValidate()
          this.form.ArticlesList = []
          this.form.ArticlesByCreate = []
          this.form.ArticlesByUpdate = []
          this.replyList.forEach(item => {
            this.form.ArticlesList.push(Object.assign({}, item))
            if (item.isCreate) {
              this.form.ArticlesByCreate.push(item)
            } else {
              this.form.ArticlesByUpdate.push(item)
            }
          })
        }
      })
    },
    getEnums() {
      for (let item in WxEventType.Types) {
        this.EventTypeOpt.push({
          label: WxEventType.Types[item],
          value: parseInt(item)
        })
      }
    },
    onSubmit() {
      const { authorizerId, RuleId } = this.$route.query
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          const obj = Object.assign({}, this.form, {
            AuthorizerId: authorizerId + '',
            RuleId
          })
          MARKETING_API_WEB_CHAT_RULEUPDATEBYKEYWORD(obj)
            .then(res => {
              if (res.data.Code == 'CORRECT') {
                this.$message.success('保存成功！')
                this.btnLoading = false
                this.$router.push(
                  '/setter/wxpublic/replyedit?authorizerId=' + authorizerId
                )
              }
            })
            .catch(() => (this.btnLoading = false))
        }
      })
    },
    getDetail() {
      MARKETING_API_WEB_CHAT_RULEBYKEYWORDDETAIL(this.$route.query).then(
        res => {
          if (res.data.Code == 'CORRECT') {
            this.form = Object.assign({}, res.data.Data, {
              ArticlesByCreate: [],
              ArticlesByUpdate: [],
              ArticlesByRemove: []
            })
            this.replyList = []
            res.data.Data.ArticlesList &&
              res.data.Data.ArticlesList.forEach(item => {
                this.replyList.push(
                  Object.assign({}, item, {
                    PicUrlSuccess:
                      this.$root.DOMAIN_IMG_FILE +
                      item.PicUrl.replace('{0}', '150x0')
                  })
                )
              })
          }
          this.isLoading = false
        }
      )
    }
  },
  components: {
    uploadImgByBtn
  }
}
</script>
<style lang="scss" scoped>
.w-500 {
  width: 500px;
}

.list {
  .cur {
    background: #f2f2f2;
  }
}

.detail {
  padding-right: 5px;
  h2 {
    font-size: 14px;
    font-weight: bold;
    word-break: break-all;
  }
  p {
    color: #888;
    word-wrap: break-word;
    word-break: normal;
  }
  line-height: 1.5;
}
.w-238 {
  width: 238px;
}
</style>
