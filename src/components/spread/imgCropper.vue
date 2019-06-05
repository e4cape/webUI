<template>
  <el-dialog title="裁剪图片" top="5vh" class="imgcropper" :width="this.cropWidth + 110 + 'px'" :visible.sync="visible">
    <template>
      <div class="wap-cropper" :style="`width:${this.cropWidth + 50}px; height:${this.cropheight + 50}px;`">
        <vueCropper
          ref="cropper"
          @imgLoad="setFull"
          :img="option.img"
          :outputSize="option.size"
          :autoCrop="true"
          :autoCropWidth="cropWidth"
          :full="true"
          :original="false"
          :infoTrue="true"
          :autoCropHeight="cropheight"
          :canMoveBox="false"
          :fixedBox="true"
          :info="false"
          :canScale="true"
          :outputType="option.outputType"
        ></vueCropper>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="img-action">
          <img src="@/assets/images/big.png" alt @click="changeScale(1)">
          <img src="@/assets/images/small.png" alt @click="changeScale(-1)">
          <img src="@/assets/images/rotate.png" alt @click="rotateRight">
        </div>
        <el-button name="btnSubmit" type="primary" @click="submitImg" :loading="$store.getters.is_loading">确定</el-button>
        <el-button name="btnCancel" @click="visible =  false">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import {
  VueCropper
} from 'vue-cropper'
export default {
  props: {
    cropperVisible: {
      type: Boolean
    },
    url: {
      type: String
    },
    imgSize: {
      type: Object
    }
  },
  data() {
    return {
      visible: this.cropperVisible,
      cropWidth: (this.imgSize && this.imgSize.width) || 750,
      cropheight: (this.imgSize && this.imgSize.height) || 300,
      option: {
        img: '',
        size: 1,
        full: false,
        outputType: 'png',
        canMove: true,
        fixedBox: false,
        original: false,
        canMoveBox: false
      }
    }
  },
  methods: {
    submitImg() {
      this.$refs.cropper.getCropData(data => {
        this.$emit('listenCropper', data, this.imgSize)
      })
    },
    changeScale(num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    // 坐旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft()
    },
    // 右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight()
    },
    setFull() {
      let box = document.querySelectorAll('.cropper-view-box')[0]
      let scale = box.firstChild.style.transform
        .split('scale(')[1]
        .split(',')[0]
      let height = box.firstChild.height * scale
      let width = box.firstChild.width * scale
      scale = Math.ceil(
        Math.max(this.cropWidth - width, this.cropheight - height) / 20
      )
      this.$refs.cropper.changeScale(scale)
      setTimeout(() => {
        scale = box.firstChild.style.transform.split('scale(')[1].split(',')[0]
        height = box.firstChild.height * scale
        width = box.firstChild.width * scale
        if (height < this.cropheight || width < this.cropWidth) {
          this.setFull()
        }
      })
    }
  },
  beforeMount() { },
  mounted() {
    this.option.img = this.url
  },
  watch: {
    visible() {
      this.$emit('listenCropper', false)
    }
  },
  components: {
    VueCropper
  }
}
</script>
<style lang="scss" scoepd>
.wap-cropper {
  .cropper-view-box > img {
    display: block !important;
  }
}
.i-click {
  font-size: 20px;
}
.dialog-footer {
  position: relative;
  .img-action {
    position: absolute;
    display: flex;
    left: 0;
    top: 0;
    img {
      display: block;
      padding-right: 10px;
    }
  }
}
.imgcropper {
  .el-dialog__header {
    display: none;
  }
}
</style>
