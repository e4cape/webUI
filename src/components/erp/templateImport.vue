<template>
  <el-dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    @open="init"
    title="导入货品"
  >
    <div class="dialog-title">
      <p class="title">请选择导入的文件：</p>
      <el-button type="text" v-if="isDownLoad" @click="downLoadTemplate">下载模板文件</el-button>
    </div>
    <el-upload
      class="upload-demo"
      drag
      accept=".xls,.xlsx"
      :action="api"
      :data="{ Root: root}"
      :headers="{'access-token': $store.getters.access_token}"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-success="success"
      :on-error="error"
      ref="upLoad"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" slot="tip">
        <p>1、仅支持.xls和.xlsx的Excel文件。</p>
        <p>2、仅支持Excel文件中第一个表格的数据导入。</p>
        <p>3、根据表格第一行标题自动匹配数据，第一行作为标题不导入数据。</p>
        <p>4、请先下载模板文件填写后再导入。</p>
      </div>
    </el-upload>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        @click="submit"
        :disabled="!key||$store.getters.is_loading"
        :loading="$store.getters.is_loading"
      >确定</el-button>
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { STOCKING_API_SETTING_CUSTOMIZED_FIELD_EXPORT } from '@/apis/stocking.js'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    option: {
      type: Object,
      default() {
        return {
          OrderType: 1,
          LargeType: 3,
          SmallType: 1,
          KindTypeEk: 0
        }
      }
    },
    root: {
      type: String,
      default: ''
    },
    isDownLoad: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    api() {
      return this.$root.settings.DOMAIN_APIS.Common + '/Upload/File/UploadToOss/'
    }
  },
  data() {
    return {
      key: '',
      fileList: []
    }
  },
  methods: {
    init() {
      this.key = ''
      if (this.$refs.upLoad) {
        this.$refs.upLoad.clearFiles()
      }
    },
    b64toBlob(b64Data, contentType, sliceSize) {
      contentType = contentType || ''
      sliceSize = sliceSize || 1024
      let byteCharacters = window.atob(b64Data)
      let byteArrays = []
      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        let slice = byteCharacters.slice(offset, offset + sliceSize)
        let byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }
        let byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }
      let blob = new Blob(byteArrays, {
        type: contentType
      })
      return blob
    },
    downLoadTemplate() {
      STOCKING_API_SETTING_CUSTOMIZED_FIELD_EXPORT(this.option).then(res => {
        if (res.data.Code === 'CORRECT') {
          let data = res.data.Data.FileData
          let filename = '导入模板.xlsx'
          let blob = this.b64toBlob(
            data.substr(0, data.length),
            'application/xlsx'
          )
          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, filename)
          } else {
            let btnDownload = document.createElement('a')
            btnDownload.download = filename
            btnDownload.href = URL.createObjectURL(blob)
            if (navigator.userAgent.indexOf('Firefox') > -1) {
              let evt = document.createEvent('MouseEvents')
              evt.initEvent('click', true, true)
              btnDownload.dispatchEvent(evt)
            } else {
              btnDownload.click()
            }
          }
        }
      })
    },
    beforeUpload(file) {
      if (file.name.indexOf('.xls') === -1) {
        this.$message.error('只支持xls和xlsx格式的Excel文件!')
        return false
      } else {
        return true
      }
    },
    success(res, file) {
      if (res.Code === 'CORRECT') {
        this.$message.success('上传成功')
        this.key = res.Data.Path 
        this.fileList = [file]
      }
    },
    error() {
      this.$message.error('上传失败')
    },
    submit() {
      if (this.key && this.visible) {
        this.$store.commit('SET_BTN_LOADING', true)
        this.$emit('submit', this.key)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 360px;
  margin: auto;
}
.el-upload__tip {
  display: block;
}
.el-upload__tip p {
  padding-top: 5px;
}
</style>
<style lang="scss">
.el-upload {
  display: block;
  .el-upload-dragger {
    margin: auto;
  }
}
</style>

