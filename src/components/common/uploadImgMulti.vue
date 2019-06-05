<template>
  <el-upload
    name="Files"
    ref="uploadImgMulti"
    :action="$root.settings.DOMAIN_APIS.Common + '/Upload/Image/UploadToOss/'"
    :headers="{'access-token': $store.getters.access_token}"
    :data="{'Root': Root}"
    accept="image/png,image/jpeg,image/jpg"
    multiple
    :limit="limit"
    :before-upload="beforeUpload"
    :on-success="onSucc"
    :on-error="onErr"
    :on-exceed="onExceed"
    :on-remove="onRemove"
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
      default: 'primary'
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
    limit: {
      // 一次限制上传数量的限制
      type: Number,
      default: 10
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
    }
  },
  data() {
    return {
      theRoot: this.Root,
      theType: this.type,
      theLimit: this.limit,
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
    onSucc(res, file, fileList) {
      if (res.Code == 'CORRECT') {
        // 为了确保都上传完，用户才能提交
        if (
          fileList.length ==
          fileList.filter(item => item.status == 'success').length
        ) {
          const Keys = fileList.map(
            item => item.response && item.response.Data.Path[0]
          )
          this.$emit('uploadSucc', Keys)
        }
      } else {
        this.$message.error(res.Message)
      }
      this.loadingChange(false)
    },
    onErr() {
      this.loadingChange(false)
      this.$message.error('上传失败，请稍后重试!')
    },
    onExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.theLimit} 张图片，本次选择了 ${
          files.length
        } 张图片，共选择了 ${files.length + fileList.length} 张图片`
      )
    },
    onRemove(file, fileList) {
      if (file.status == 'success') {
        const Keys = fileList.map(
          item => item.response && item.response.Data.Path[0]
        )
        this.$emit('uploadSucc', Keys)
      }
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