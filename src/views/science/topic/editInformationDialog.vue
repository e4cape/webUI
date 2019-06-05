<template>
  <el-dialog
    width="600px"
    class="edit-info-dialog"
    :visible.sync="visible"
    :title="title"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
    >
      <el-form-item
        label="专题封面"
        prop="ImageUrl"
      >
        <uploadImg
          :uploadImgLoading="uploadImgLoading"
          :uploadImageUrl="uploadImageUrl"
          :Root="$root.filePaths.COLLEGE_INFAST"
          @uploadSucc="uploadSucc"
          @uploadImgLoadingChange="uploadImgLoadingChange"
        />
        <span class="gray">图片格式仅支持JPG／PNG格式，不超过2M大小，建议640*360</span>
      </el-form-item>
      <el-form-item
        label="专题名称"
        prop="Title"
      >
        <el-input
          maxlength="50"
          style="width: 200px;"
          v-model="ruleForm.Title"
           @keyup.native="ruleForm.Title = mytrim(ruleForm.Title)"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="专题简介"
        prop="Note"
      >
        <el-input
          type="textarea"
          maxlength="200"
          v-model="ruleForm.Note"
        ></el-input>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="primary"
        :loading="$store.getters.is_loading"
        @click="btnSave"
      >保存</el-button>
      <el-button @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  COLLEGE_API_INFRASTSUBJECTBASIC_CREATE,
  COLLEGE_API_INFRASTSUBJECTBASIC_UPDATE
} from '@/apis/science'

import uploadImg from '@/components/common/uploadImg'
import sortItem from '../template/sortOrderItem'

export default {
  props: {
    visibleInfomationDialog: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    infoObj: {
      type: Object,
      value: null
    }
  },
  data() {
    return {
      visible: this.visibleInfomationDialog,
      uploadImgLoading: false,
      theTitle: this.title,
      uploadImageUrl: '',
      ruleForm: {
        Title: '',
        ImageUrl: '',
        Note: ''
      },
      rules: {
        ImageUrl: [
          {
            required: true,
            message: '请选择专题封面图片!'
          }
        ],
        Title: [
          {
            required: true,
            message: '请输入专题名称!'
          }
        ]
      },
      succ: false
    }
  },
  watch: {
    visible() {
      this.$emit('listenVisibleInfomationDialog', this.succ)
    }
  },
  beforeMount() {
    if (this.infoObj) {
      const { ImageUrl, Title, Note } = this.infoObj
      Object.assign(this.ruleForm, {
        ImageUrl,
        Title,
        Note
      })
      this.uploadImageUrl = this.$root.settings.DOMAIN_IMG_FILE + ImageUrl
    }
  },
  methods: {
    btnSave() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.$store.commit('SET_BTN_LOADING', true)
          this.ruleForm.Title = this.ruleForm.Title.replace(/\s/g, '')
          if (this.infoObj) {
            const param = Object.assign({}, this.ruleForm, {
              SubjectId: this.infoObj.SubjectId
            })
            // 更新专题
            COLLEGE_API_INFRASTSUBJECTBASIC_UPDATE(param).then(res => {
              if (res.data.Code == 'CORRECT') {
                this.succ = true
                this.visible = false
              }
              this.$store.commit('SET_BTN_LOADING', false)
            })
          } else {
            // 新建专题
            COLLEGE_API_INFRASTSUBJECTBASIC_CREATE(this.ruleForm).then(res => {
              if (res.data.Code == 'CORRECT') {
                this.succ = true
                this.visible = false
                this.$router.push({
                  path:
                    '/science/topic/edit?id=' +
                    res.data.Data.SubjectId
                })
              }
              this.$store.commit('SET_BTN_LOADING', false)
            })
          }
        }
      })
    },
    mytrim(value) {
      return value.replace(/\s/g, '')
    },
    // 图片上传
    uploadSucc(Key) {
      this.uploadImageUrl = this.$root.settings.DOMAIN_IMG_FILE + Key
      this.ruleForm.ImageUrl = Key
    },
    uploadImgLoadingChange(v) {
      this.uploadImgLoading = v
    }
  },
  components: {
    sortItem,
    uploadImg
  }
}
</script>
<style lang="scss" scoped>
.edit-info-dialog {
  /deep/ .el-form-item__error {
    padding-top: 3px;
  }
}
.gray {
  color: #999;
}
</style>
