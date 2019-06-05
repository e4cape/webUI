<template>
  <div>
    <el-form class="fix-w" label-width="120px" :model="form" :rules="rules" ref="form">
      <el-form-item label="规则名称：" prop="RuleTitle">
        <el-input name="RuleTitle" v-model="form.RuleTitle"></el-input>
      </el-form-item>
      <el-form-item label="触发事件：" prop="EventType">
        <el-select name="EventType" v-if="EventTypeOpt.length > 1" v-model="form.EventType" class="w-238">
          <el-option v-for="(item,index) in EventTypeOpt" :key="index" :value="item.value" :label="item.label"></el-option>
        </el-select>
        <el-input name="WxEventType" v-else :disabled="true" v-model="WxEventType.Types[form.EventType]"></el-input>
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
      <el-form-item v-if="form.NoteType==WxNoteType.News" prop="ArticlesByCreate">
        <ul class="w-500">
          <el-row tag="li" v-for="(item,index) in form.ArticlesByCreate" :key="index" :gutter="5">
            <el-col :span="5">
              <img :src="$root.settings.DOMAIN_IMG_FILE + item.PicUrlSuccess.replace('{0}', '150x0')" width="100px" height="100px" alt>
            </el-col>
            <el-col :span="19">
              <div class="detail">
                <h2>{{item.Title}}</h2>
                <p>{{item.Description}}</p>
                <el-button name="articleModify" type="text" icon="fa fa-cog" @click="current=index;dialogVisible=true;handleReplyList(index)">修改</el-button>
                <el-button name="articleDelete" type="text" icon="fa fa-edit" @click="deleteReplyList(index)">删除</el-button>
              </div>
            </el-col>
          </el-row>
        </ul>
      </el-form-item>
      <el-form-item v-if="form.NoteType==WxNoteType.Text" key="1" prop="TextContent">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" class="w-500 m-t-5" v-model="form.TextContent"></el-input>
      </el-form-item>
      <el-form-item label>
        <el-button name="onSubmit" :loading="btnLoading" type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
    <!-- 设置图文回复 -->
    <el-dialog title="内容类型" :visible.sync="dialogVisible" :before-close="cancel" :close-on-press-escape="false" :close-on-click-modal="false" width="800px">
      <el-row :gutter="20">
        <el-col :span="8">
          <ul class="list">
            <li :name="'reply' + index" v-for="(item,index) in replyList" :key="index" :class="current == index?'cur':''" @click="handleReplyList(index)">
              <el-row :gutter="5">
                <el-col :span="11">
                  <img v-if="item.PicUrl" :src="$root.settings.DOMAIN_IMG_FILE+item.PicUrl.replace('{0}','150x0')" width="100px" height="100px" alt>
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
          <!-- <el-button
            type="primary"
            style="width:100%"
            icon="el-icon-plus"
            @click="addReply"
          >添加</el-button>-->
        </el-col>
        <el-col :span="16">
          <el-form label-width="120px" :model="dialogFom" :rules="rules2" ref="dialogFom">
            <el-form-item label="标题名称：" prop="Title">
              <el-input name="Title" v-model="dialogFom.Title" @change="formChange" class="w-238" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="上传图片：" prop="PicUrl">
              <uploadImgByBtn :Root="$root.filePaths.SETTING_WXPUBLIC" type="primary" size="mini" @uploadSucc="uploadSucc">点击上传</uploadImgByBtn>
            </el-form-item>
            <el-form-item label="链接地址：" prop="Url">
              <el-input name="url" v-model="dialogFom.Url" @change="formChange" class="w-238"></el-input>
            </el-form-item>
            <el-form-item label="内容：" prop="Description">
              <el-input name="Description" v-model="dialogFom.Description" @change="formChange" :autosize="{ minRows: 2, maxRows: 4}" class="m-t-5" type="textarea" maxlength="200"></el-input>
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
import { MARKETING_API_WEB_CHAT_RULECREATEBYKEYWORD } from '@/apis/marketing'
import { CharacterType } from '@/enums/common'
import {
  WxEventType,
  WxReplyType,
  WxMatchType,
  WxModeType,
  WxNoteType
} from '@/enums/component'
import uploadImgByBtn from '@/components/common/uploadImgByBtn'

export default {
  data() {
    return {
      form: {
        NoteType: WxNoteType.Text,
        ReplyType: WxReplyType.Keyword,
        MatchType: WxMatchType.AllOf,
        ModeType: WxModeType.AllOf,
        RuleTitle: '',
        ArticlesByCreate: [],
        EventType: WxEventType.NONEEVENT
      },
      current: 0,
      replyList: [],
      WxEventType: WxEventType,
      WxReplyType: WxReplyType,
      WxMatchType: WxMatchType,
      WxModeType: WxModeType,
      WxNoteType: WxNoteType,
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
      CharacterType,
      showAddBtn: false,
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
      },
      rules2: {
        Description: [
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
        Title: [
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
  },
  methods: {
    formChange() {
      this.$set(this.replyList, this.current, Object.assign({}, this.dialogFom))
    },
    addReply() {
      this.$refs['dialogFom'].validate(valid => {
        if (valid) {
          this.current += 1
          this.$set(this.replyList, this.current, {
            ArticleId: '',
            Title: '',
            Description: '',
            Url: '',
            PicUrl: '',
            PicUrlSuccess: ''
          })

          this.dialogFom = {
            ArticleId: '',
            Title: '',
            Description: '',
            Url: '',
            PicUrl: '',
            PicUrlSuccess: ''
          }
          this.$refs['dialogFom'].resetFields()
        } else {
          this.$message.error('请先完成当前项的编辑再添加！')
        }
      })
    },
    deleteReplyList(i) {
      this.form.ArticlesByCreate.splice(i, 1)
      this.replyList.splice(i, 1)
      // this.$set(this.replyList,i,this.replyList[i])
      if (this.replyList.length <= 0) {
        this.form.NoteType = WxNoteType.Text
      }
    },
    handleReplyList(i) {
      this.current = i
      this.dialogFom = this.replyList[i]
    },
    cancel() {
      this.dialogVisible = false
      this.replyList = []
      this.form.ArticlesByCreate.forEach(item => {
        this.replyList.push(Object.assign({}, item))
      })
      this.$refs.dialogFom.resetFields()
      this.dialogFom = {
        ArticleId: '',
        Title: '',
        Description: '',
        Url: '',
        PicUrl: '',
        PicUrlSuccess: ''
      }
      if (this.form.ArticlesByCreate[0] !== undefined) {
        if (this.form.ArticlesByCreate[0].Title == '') {
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
        if (this.replyList.length <= 0) {
          this.replyList.push({
            ArticleId: '',
            Title: '',
            Description: '',
            Url: '',
            PicUrl: '',
            PicUrlSuccess: ''
          })
        } else {
          this.replyList = []
          this.form.ArticlesByCreate.forEach(item => {
            this.replyList.push(Object.assign({}, item))
          })
        }
        // this.$refs['dialogFom'].validateField('PicUrl')
        // this.replyList[0] = this.form
      }
    },
    setList() {
      this.$refs['dialogFom'].validate(valid => {
        if (valid) {
          this.setFlag = true
          this.dialogVisible = false
          // this.form.ArticlesByCreate = this.replyList
          this.dialogFom = {
            ArticleId: '',
            Title: '',
            Description: '',
            Url: '',
            PicUrl: '',
            PicUrlSuccess: ''
          }
          this.form.ArticlesByCreate = []
          this.replyList.forEach(item => {
            this.form.ArticlesByCreate.push(Object.assign({}, item))
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
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.btnLoading = true
          const obj = Object.assign({}, this.form, this.$route.query)
          MARKETING_API_WEB_CHAT_RULECREATEBYKEYWORD(obj)
            .then(res => {
              if (res.data.Code == 'CORRECT') {
                this.$message.success('保存成功！')

                this.$router.push(`/setter/wxpublic/replyedit?authorizerId=${this.$route.query.authorizerId}`)
              }
              this.btnLoading = false
            })
            .catch(() => (this.btnLoading = false))
        }
      })
    },
    validateFullUrl(rule, value, callback) {
      const reg = new RegExp(
        '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]'
      )
      if (reg.test(value) || value == '' || value == undefined) {
        callback()
      } else {
        callback(new Error('链接地址输入有误！'))
      }
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
  max-height: 450px;
  overflow-y: auto;
  overflow-x: hidden;
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
