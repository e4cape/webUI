<template>
  <el-dialog title="播放视频" :visible.sync="visible" width="700px">
    <div v-loading="loadingIf" style="min-height: 300px;">
      <aliPlayer v-if="option.playauth" :vid="option.vid" :playauth="option.playauth" :cover="option.cover" width="640px" height="360px" autoplay></aliPlayer>
    </div>
  </el-dialog>
</template>
<script>
import { COMMON_API_VOD_PLAY } from '@/apis/common' // 获取(播放凭证)
import aliPlayer from './video'
export default {
  props: {
    visibleVideoPlayModal: {
      type: Boolean,
      default: false
    },
    videoId: {
      // 视频Id
      type: String
    },
    coverUrl: {
      // 视频Id
      type: String
    }
  },
  data() {
    return {
      loadingIf: false,
      visible: this.visibleVideoPlayModal,
      theVideoId: this.videoId,
      option: {
        vid: '',
        playauth: '',
        cover: this.coverUrl
      }
    }
  },
  watch: {
    visible() {
      this.$emit('listenVisibleVideoPlayModal')
    }
  },
  mounted() {
    if (this.theVideoId) {
      this.vodplay()
    }
  },
  methods: {
    vodplay() {
      this.loadingIf = true
      COMMON_API_VOD_PLAY({ VideoId: this.theVideoId })
        .then(res => {
          if (res.data.Code == 'CORRECT') {
            this.option.playauth = res.data.Data.PlayAuth
            this.option.vid = res.data.Data.VedioId
          }
          this.loadingIf = false
        })
        .catch(() => {
          this.loadingIf = false
        })
    }
  },
  components: {
    aliPlayer
  }
}
</script>
