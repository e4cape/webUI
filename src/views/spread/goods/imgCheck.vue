<template>
  <el-dialog title="查看图片" class="imgcropper" width="800px" :visible.sync="visible">
    <template>
      <img class="bigimg" :src="imgUrl" alt="">
      <div slot="footer" class="dialog-footer">
        <el-button name="btnConfirm" type="primary" @click="visible =  false" :loading="$store.getters.is_loading">确定</el-button>
        <el-button name="btnCancel" @click="visible =  false">取消</el-button>   
      </div>
    </template>
  </el-dialog>
</template>
<script>
import vueCropper from 'vue-cropper'
export default {
  props: {
    checkImgVisible: {
      type: Boolean,
      default: false
    },
    url: {
      type: String
    }
  },
  data () {
    return {
      visible: this.checkImgVisible,
      imgUrl: this.url
    }
  },
  methods: {
  },
  mounted () {
  },
  watch: {
    visible () {
      this.$emit('listenUrlCheck', false)
    }
  },
  components: {
    vueCropper
  }
}
</script>
<style lang="scss">
.wap-cropper {
  width: 850px;
  height: 790px;
  .cropper-view-box > img {
    display: block !important;
  }
}
.i-click {
  font-size: 20px;
}
.dialog-footer {
  position: relative;
  .actions {
    position: absolute;
    display: flex;
    left: 0;
    top: 0;
    img {
      display: block;
      width: 34px;
      height: 34px;
      padding-right: 10px; 
      padding-top: 10px; 
    }
  }
}
.imgcropper {
  .el-dialog__header {
    display: none;
  }
}
.bigimg {
  display: block;
  height: 750px;
  width: 750px;
  font-size: 0;
}
</style>
