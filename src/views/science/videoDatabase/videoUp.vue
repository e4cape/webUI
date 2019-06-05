<template>
  <div class="content">
    <el-alert title="开始上传后，离开此页面不影响上传任务进行，但请不要刷新或关闭浏览器。视频上传和存储按文件大小和流量计费，请编辑好后再上传！" type="warning" description="视频文件大小建议不超过1G，不超过120分钟，分辨率1920*1080，码率建议3000Kbps，格式建议mp4" show-icon :closable="false"></el-alert>
    <div class="video-action">
      <input type="file" style="display: none;" :id="id" @change="toUpload" placeholder>
      <video src="" style="display: none;" id="video"></video>
      <el-button type="primary" @click="inputVideo">添加视频</el-button>
      <el-button @click="clearUploading">清除失败记录</el-button>
      <router-link type="text" :to="{path:'/science/videoDatabase/index'}" class="btn-link el-button--text ab-right">{{backMessage}}</router-link>
    </div>
    <el-table :data="filesList" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column show-overflow-tooltip prop="fileName" label="名称" min-width="220" fixed></el-table-column>
      <el-table-column show-overflow-tooltip prop="fileType" label="格式" width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="fileSize" label="大小" width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="loadedPercent" label="上传状态" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.state == 1">已取消</span>
          <el-progress :percentage="scope.row.loadedPercent" v-else-if="scope.row.state == 0"></el-progress>
          <span v-else-if="scope.row.state == 9">上传成功</span>
          <span v-else-if="scope.row.state == 2">上传失败</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="PackName" label="操作" width="100" fixed="right">
        <template slot-scope="{row,$index}">
          <el-button  type="text" v-if="row.state == 0" @click="stopUploading($index)">取消</el-button>
          <el-button  type="text" v-else-if="row.state == 1" @click="startUploading($index)">重新上传</el-button>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
// state  正常上传为0,暂停为1，失败为2，删除为3, 超时为4,完成为9
import {
  COMMON_API_VOD_AUTH 
} from '@/apis/common'
import {
  COLLEGE_API_INFRASTCOURSEVIDEOLOG_UPLOAD,
  COLLEGE_API_INFRASTCOURSEVIDEOLOG_CANCEL,
  COLLEGE_API_INFRASTCOURSEVIDEOLOG_UPDATE
} from '@/apis/science'
import {
  setInterval, clearInterval 
} from 'timers'
export default {
  data() {
    return {
      id: 'uploadImage',
      backMessage: '< 返回视频库',
      data: [1,2,3],
      uploadingConfig: {
      },
      srcs: ['/static/libs/aliyun-upload-sdk-1.5.0.min.js', '/static/libs/aliyun-oss-sdk-5.3.1.min.js'],
      uploadfile: [],
      uploader: null,
      filesList: []
    }
  },
  methods: {
    insertScriptTag() {
      if (!window.AliyunUpload) {
        let s = document.getElementsByTagName('head')[0]
        this.srcs.forEach(item => {
          let scriptTag = document.createElement('script')
          scriptTag = document.createElement('script')
          scriptTag.type = 'text/javascript'
          scriptTag.src = item
          s.appendChild(scriptTag)
        })
      }
    },
    clearUploading () { // 清除失败记录
      let filesList = [...this.filesList]
      for (let i = 0; i < filesList.length; i++) {
        if (filesList[i].state === 2) {
          filesList.splice(i, 1)
          i = i -1
        }
      }
      this.filesList = filesList
      this.setAllVideoList()
    },
    inputVideo () {
      document.getElementById(this.id).click()
    },
    async toUpload() {
      let file = document.getElementById(this.id).files[0]
      if (!file) {
        return
      } if (['video/mp4'].indexOf(file.type) < 0) {
        this.$message.error('请选择MP4格式的视频文件')
        document.getElementById(this.id).value = ''
        return
      }
      let flg = false
      this.filesList.forEach(item => {
        if (item.fileName == file.name) {
          flg = true
        }
      })
      if (flg) {
        this.$message.error('请勿上传同名视频')
        return
      }
      let videoDom = document.getElementById('video')
      let duration = ''
      videoDom.src = URL.createObjectURL(file)
      videoDom.addEventListener('canplaythrough', function() {
        duration = videoDom.duration
      })
      let filesList = [...this.filesList]
      let size = parseInt(file.size / 1024 / 1024) > 1024 ? parseFloat(file.size / 1024 / 1024 / 1024).toFixed(2) + 'GB' :  parseFloat(file.size / 1024 / 1024).toFixed(2) + 'MB'
      let obj = await this.initUpload(filesList.length, file)
      filesList.push({
        fileName: file.name,
        fileType: file.type,
        fileSize: size,
        uploader: obj.uploader,
        loadedPercent: 0,
        collegeCode: '',
        videoId: obj.videoId,
        timer: null, // 定时器
        state: 0, // 正常上传为0,暂停为1，失败为2，删除为3, 超时为4,完成为9
      })
      this.filesList = filesList
      this.setAllVideoList()
      obj.uploader.addFile(file)
      obj.uploader.startUpload()
      this.setVideoLogsUp(file, obj.videoId, this.filesList.length - 1, duration)
      document.getElementById(this.id).value = ''
    },
    setVideoLogsUp(file, videoId, index, duration) {
      this.filesList[index].videoId = videoId
      COLLEGE_API_INFRASTCOURSEVIDEOLOG_UPLOAD({
        VideoCode: videoId,
        VideoName: file.name,
        VideoSize: file.size,
        VideoTime: duration
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.filesList[index].collegeCode = res.data.Data
        }
      })
    },

    setAllVideoList () {
      this.$root.allVideoUpList = this.filesList
    },
    stopUploading(index) {
      if (this.filesList[index].state == 0) {
        COLLEGE_API_INFRASTCOURSEVIDEOLOG_CANCEL({
          VideoCode: this.filesList[index].videoId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.filesList[index].uploader.stopUpload() // 暂停取消上传
            this.filesList[index].state = 1
          }
        })
      } else {
        this.$message.error('取消失败')
      }
      this.setAllVideoList()
    },
    startUploading(index) {
      this.filesList[index].uploader.startUpload()
      this.filesList[index].state = 0
    },
    async initUpload(index, file) {
      const self = this
      let aliCode = await Promise.all([
        COMMON_API_VOD_AUTH({
          Title: file.name,
          FileName: file.name
        })
      ])
      let uploader = new window.AliyunUpload.Vod({
        userId: '1882469065467416', // 固定写死，若有变化，需要询问后台或者后台提供接口
        partSize: 5242880, // 分片大小默认5M，不能小于100K
        parallel: 5, // 并行上传分片个数，默认5
        retryCount: 3, // 网络原因失败时，重新上传次数，默认为3
        retryDuration: 2, // 网络原因失败时，重新上传间隔时间，默认为2秒
        onUploadstarted: async (uploadInfo) => {
          if (!uploadInfo.videoId) {
            uploader.setUploadAuthAndAddress(
              uploadInfo,
              aliCode[0].data.Data.UploadAuth,
              aliCode[0].data.Data.UploadAddress,
              aliCode[0].data.Data.VideoId
            )
          } else {
            uploader.setUploadAuthAndAddress(
              uploadInfo,
              aliCode[0].data.Data.UploadAuth,
              aliCode[0].data.Data.UploadAddress,
            )
          }
        },
        onUploadSucceed: () => { // 成功
          this.filesList[index].state = 9
          this.filesList[index].timer = setInterval(() => {
            if (this.filesList[index].collegeCode) {
              clearInterval(this.filesList[index].timer)
              this.successUploading(this.filesList[index].collegeCode)
            }
          }, 300)
          this.setAllVideoList()
        },
        onUploadFailed: () => { // 失败
          this.filesList[index].state = 2
          this.setAllVideoList()
        },
        onUploadProgress: (uploadInfo, totalSize, loadedPercent) => { // 进度
          self.filesList[index].loadedPercent = parseInt(loadedPercent * 100)
        },
        onUploadTokenExpired: async () => { // 超时
          let res = await Promise.all([
            COMMON_API_VOD_AUTH({
              Title: file.name,
              FileName: file.name
            })
          ])
          uploader.resumeUploadWithAuth(res[0].data.Data.UploadAuth)
          this.filesList[index].state = 4
          this.setAllVideoList()
        },
        onUploadEnd: () => { // 上传完成
          this.filesList[index].state = 9
          this.setAllVideoList()
        },
        onUploadCanceled: () => { // 取消上传
        }
      })
      return {
        uploader: uploader,
        videoId: aliCode[0].data.Data.VideoId
      }
    },
    successUploading(collegeCode) {
      COLLEGE_API_INFRASTCOURSEVIDEOLOG_UPDATE({LogId: collegeCode }) // 上传成功回调
    }
  },
  mounted() {
    this.filesList = this.$root.allVideoUpList
    this.insertScriptTag()
  },
  watch: {
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
  .video-action {
    position: relative;
    width: 100%;
    margin: 10px 0;
    .ab-right {
      position: absolute;
      right: 10px;
      top: 8px;
    }
  }
  /deep/ .el-alert--warning .el-alert__description {
    color: #777;
  }
</style>

