<template>
  <el-upload
    :action="$root.settings.DOMAIN_APIS.Common + '/Upload/Image/UploadToOss/'"
    :headers="{'access-token': $store.getters.access_token}"
    :data="{'Root': Root}"
    name="Files"
    accept="image/png,image/jpeg,image/jpg"
    :show-file-list="false"
    :before-upload="beforeUpload"
    :on-success="onSucc"
    :on-error="onErr"
    :multiple="multiple"
    :limit="100"
  >
    <el-button
      :type="type"
      :size="size"
      :loading="uploadBtnLoading"
    >
      <slot></slot>
    </el-button>
  </el-upload>
</template>
<script>
export default {
  props: {
    type: {
      // 按钮类型
      type: String,
      default: 'text'
    },
    size: {
      // 按钮大小
      type: String,
      default: 'small'
    },
    Root: {
      // 上传目录
      type: String
    },
    imgSize: {
      // 图片大小限制
      type: Number,
      default: 2
    },
    byKb: {
      // 图片大小单位
      type: Boolean,
      default: false // 默认不是KB，是M
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      theRoot: this.Root,
      theType: this.type,
      uploadBtnLoading: false,
      theImgSize: this.imgSize,
      theByKb: this.byKb
    }
  },
  methods: {
    beforeUpload(file) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        this.$message.error('请上传正确文件!')
        return false
      }
      let isLt
      if (this.theByKb) {
        isLt = file.size / 1024 < this.theImgSize
        if (!isLt) {
          this.$message.error(`上传图片大小不能超过${this.theImgSize}KB!`)
          return false
        }
      } else {
        isLt = file.size / 1024 / 1024 < this.theImgSize
        if (!isLt) {
          this.$message.error(`上传图片大小不能超过${this.theImgSize}MB!`)
          return false
        }
      }
      this.loadingChange(true)
    },
    onSucc(res) {
      if (res.Code == 'CORRECT') {
        this.$emit('uploadSucc', res.Data.Path && res.Data.Path[0])
      } else {
        this.$message.error(res.Message)
      }
      this.loadingChange(false)
    },
    onErr() {
      this.loadingChange(false)
      this.$message.error('上传失败，请稍后重试!')
    },
    // loading变化,按钮type为text的时候全局loading，type为其它的时候按钮上直接loading
    loadingChange(trueOrFalse) {
      if (this.theType == 'text') {
        this.$store.commit('SET_FULL_LOADING', trueOrFalse)
      } else {
        this.uploadBtnLoading = trueOrFalse
      }
    }
  }
}
</script>