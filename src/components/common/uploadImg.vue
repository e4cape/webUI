<template>
  <el-upload
    class="upload-img"
    :style="styleObj"
    :disabled="disabled"
    :action="$root.settings.DOMAIN_APIS.Common + '/Upload/Image/UploadToOss/'"
    :headers="{'access-token': $store.getters.access_token}"
    :data="{'Root': Root}"
    name="Files"
    accept="image/png, image/jpeg, image/jpg"
    :show-file-list="false"
    :before-upload="beforeUpload"
    :on-success="onSucc"
    :on-error="onErr"
    v-loading="uploadImgLoading"
  >
    <img
      v-if="uploadImageUrl"
      :src="uploadImageUrl"
      alt
    >
    <i
      v-else
      class="el-icon-plus"
    ></i>
  </el-upload>
</template>
<script>
export default {
  props: {
    uploadImgLoading: {
      // 加载loading
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    Root: {
      // 上传目录
      type: String
    },
    uploadImageUrl: {
      // 图片路径
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
    styleObj: {
      // 样式自定义
      type: Object,
      default: () => ({
        width: '160px',
        height: '90px',
        lineHeight: '90px'
      })
    }
  },
  data() {
    return {
      loading: this.uploadImgLoading,
      theImgSize: this.imgSize,
      theByKb: this.byKb
    }
  },
  watch: {
    loading(newVal) {
      // 图片上传loading监听
      this.$emit('uploadImgLoadingChange', newVal)
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
      this.loading = true
    },
    onSucc(res) {
      if (res.Code == 'CORRECT') {
        this.$emit('uploadSucc', res.Data.Path && res.Data.Path[0])
      } else {
        this.$message.error(res.Message)
      }
      this.loading = false
    },
    onErr() {
      this.loading = false
      this.$message.error('上传失败，请稍后重试!')
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-img {
  position: relative;
  border: 1px dashed $border-color;
  box-sizing: content-box;
  cursor: pointer;
  &:hover {
    border-color: $light-blue;
  }
  border-radius: 6px;
  /deep/ .el-upload {
    width: 100%;
    height: 100%;
    i {
      display: inline-block;
      /*设置元素绝对定位*/
      position: absolute;
      /*top 50%*/
      top: 50%;
      /*left 50%*/
      left: 50%;
      /*css3   transform 实现*/
      transform: translate(-50%, -50%);

      color: #8c939d;
      font-size: $middle-font;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  /deep/ .el-loading-spinner {
    margin-top: -25px;
  }
}
</style>