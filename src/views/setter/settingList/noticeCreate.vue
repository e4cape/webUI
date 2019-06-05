<template>
  <div class="content-view border-1px p-40" v-loading="loading">
    <el-form label-width="80px" class="fix-w" :model="form" ref="notice" :rules="noticeRules">
      <el-form-item label="公告标题" prop="NoticeTitle">
        <el-input name="NoticeTitle" @blur="form.NoticeTitle=form.NoticeTitle.trim()" v-model="form.NoticeTitle"></el-input>
      </el-form-item>
      <el-form-item label="发送范围" prop="RangeIds">
        <el-checkbox-group name="RangeIds" v-model="form.RangeIds">
          <el-checkbox v-for="item in Options" :label="item.value.toString()" :key="item.value">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="公告内容" prop="NoticeNote">
        <textarea name="xheditor" id="xheditor"></textarea>
      </el-form-item>
      <el-form-item>
        <el-button name="save" type="primary" :loading="btnLoading" @click="save">保存</el-button>
        <el-button name="back" :loading="btnLoading" @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { SETTING_NOTICENOTE } from '@/configs/filePaths'
import {
  MARKETING_API_SETTING_NOTICE_GET,
  MARKETING_API_SETTING_NOTICE_UPDATE,
  MARKETING_API_SETTING_NOTICE_CREATE
} from '@/apis/marketing.js'
import { CharacterType } from '@/enums/common'
export default {
  data() {
    return {
      form: {
        NoticeTitle: '',
        NoticeNote: '',
        RangeIds: []
      },
      loading: false,
      noticeRules: {
        NoticeTitle: [
          {
            required: true,
            message: '请输入公告标题！',
            trigger: 'change'
          },
          {
            max: 100,
            message: '公告标题不能超过100个字符',
            trigger: 'change'
          }
        ],
        NoticeNote: [
          {
            required: true,
            message: '请输入公告内容！',
            trigger: 'blur'
          }
        ],
        RangeIds: [
          {
            required: true,
            message: '发送范围不能为空！',
            trigger: 'change'
          }
        ]
      },
      btnLoading: false,
      editor: '',
      Options: []
    }
  },
  created() {
    for (let m in CharacterType.Types) {
      if (m != 1101 && m != 1001) {
        this.Options.push({
          value: parseInt(m),
          label: CharacterType.Types[m]
        })
      }
    }
  },
  mounted() {
    this.init()
    this.editor = $('#xheditor').xheditor({
      tools: 'Link,Img',
      width: '800',
      height: '400',
      upImgUrl: this.$root.settings.DOMAIN_APIS.Common + '/Upload/Image/UploadToOss/',
      upImgExt: 'jpg,jpeg,gif,png',
      beforeSetSource: ubb2html,
      beforeGetSource: html2ubb,
      root: SETTING_NOTICENOTE,
    })
  },
  methods: {
    init() {
      if (this.$route.query.NoticeId) {
        (this.loading = true),
        MARKETING_API_SETTING_NOTICE_GET({
          NoticeId: parseInt(this.$route.query.NoticeId)
        }).then(res => {
          this.loading = false
          this.form.NoticeTitle = res.data.Data.NoticeTitle
          this.form.RangeIds = res.data.Data.RangeIds.split(',')
          this.editor.setSource(res.data.Data.NoticeNote)
        })
      }
    },
    update() {
      this.btnLoading = true
      let params = Object.assign({}, this.form, {
        NoticeId: parseInt(this.$route.query.NoticeId),
        RangeIds: this.form.RangeIds.join(',')
      })
      MARKETING_API_SETTING_NOTICE_UPDATE(params)
        .then(res => {
          this.btnLoading = false
          if (res.data.Code === 'CORRECT') {
            this.$message({
              type: 'success',
              message: res.data.Message
            })
            this.$router.go(-1)
          }
        })
        .catch(() => {
          this.btnLoading = false
        })
    },
    create() {
      this.btnLoading = true
      this.form.RangeIds = this.form.RangeIds.join(',')
      let params = Object.assign({}, this.form)
      params.CreateUserId = this.$store.getters.user_session.UserId
      params.CreateUser = this.$store.getters.user_session.TrueName
      MARKETING_API_SETTING_NOTICE_CREATE(params).then(res => {
        this.btnLoading = false
        if (res.data.Code === 'CORRECT') {
          this.$message({
            type: 'success',
            message: res.data.Message
          })
          this.$router.go(-1)
        }
      })
    },
    save() {
      this.form.NoticeNote = this.editor.getSource()
      this.$refs.notice.validate(valid => {
        if (valid) {
          this.btnLoading = true
          if (this.$route.query.NoticeId) {
            this.update()
          } else {
            this.create()
          }
        }
      })
    },
    insertUpload(arrMsg) {
      var i, msg
      for (i = 0; i < arrMsg.length; i++) {
        msg = arrMsg[i]
        $('#uploadList').append(
          '<option value="' + msg.id + '">' + msg.localname + '</option>'
        )
      }
    }
  }
}
</script>

<style lang="scss">
.notice {
  .el-form-item {
    margin-bottom: 20px;
  }
}
.w-e-toolbar {
  height: 35px;
  background-color: #f5f5f5 !important;
  border: 1px solid #e5e5e5 !important;
}
.w-e-text-container {
  height: 165px !important;
  border: 1px solid #e5e5e5 !important;
  border-top: none !important;
}
</style>
