<template>
  <div class="content">
    <div class="zt-title">
      <div class="img">
        <img v-if="detail.ImageUrl" :src="(detail.ImageUrl.indexOf('http') > -1 ? '' : $root.settings.DOMAIN_IMG_FILE) + detail.ImageUrl" alt>
        <img v-else src="@/assets/images/nopage.jpg" alt>
      </div>
      <div class="right">
        <div class="title">{{detail.Title}}</div>
        <div class="cont">{{detail.Note}}</div>
      </div>
    </div>
    <div class="dy-title">
      <span>专题课程</span>
    </div>

    <div class="wai-scroll">
      <div class="nei-video" ref="scrollContainer" id="gift-dynamics">
        <div v-if="!datas.length && !loadingsIf" class="no-data">暂无数据</div>
        <router-link
          v-else
          class="video"
          :to="'/science/videoCheck?id=' + item.CourseId + '&name=' + (item.CourseType == infrastCourseType.Video ? '视频' : '文章')"
          v-for="(item,index) in datas"
          :key="index"
        >
          <div class="img">
            <div
              class="back-img"
              :style="`background-image: url(${item.ImageUrl ? (item.ImageUrl.indexOf('http') > -1 ? '' :  $root.settings.DOMAIN_IMG_FILE) + item.ImageUrl : '@/assets/images/nopage.jpg'});`"
            ></div>
            <i class="icon-play" v-if="item.CourseType == infrastCourseType.Video"></i>
            <span v-if="selfPower.PackId < item.PackId">{{item.PackName}}</span>
          </div>
          <div class="title">
            <i class="icon-video" v-if="item.CourseType == infrastCourseType.Video"></i>
            <span>{{item.CourseTitle}}</span>
          </div>
          <div class="times">
            <span class="category">{{item.LargeName + (item.SmallName ? '>' + item.SmallName : '')}}</span>
            <span>{{item.CreateTime | filterDate}}</span>
          </div>
        </router-link>

        <mugen-scroll :handler="getDatas" :should-handle="!scrollIf" scroll-container="scrollContainer">
          <div v-if="loadingsIf" class="loadings">
            <i class="el-icon-loading"></i>正在努力加载，请稍候...
          </div>
        </mugen-scroll>
      </div>
    </div>
  </div>
</template>
<script>
import {
  InfrastCourseType
} from '@/enums/science'
import {
  COLLEGE_API_INFRASTSUBJECTBASIC_GETBYSTORE, COLLEGE_API_INFRASTSUBJECTITEM_CACHES, COLLEGE_API_CHARACTERPACK_GETBYSTORE
} from '@/apis/science'
import MugenScroll from 'vue-mugen-scroll'
export default {
  data() {
    return {
      infrastCourseType: InfrastCourseType,
      datas: [],
      detail: {
      },
      selfPower: {}, // 用户套餐信息
      pg: 1,
      size: 20,
      total: 0,
      scrollIf: false, // 是否滚动状态
      loadingsIf: false, // 是否显示加载中
      scrollContainer: true // 滚动加载容器
    }
  },
  methods: {
    getDetail() {
      COLLEGE_API_INFRASTSUBJECTBASIC_GETBYSTORE({
        SubjectId: this.$route.query.id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
      })
    },
    getDatas() {
      this.scrollIf = true
      this.loadingsIf = true
      if (this.datas.length >= this.total && this.total != 0) {
        this.loadingsIf = false
        return
      }
      COLLEGE_API_INFRASTSUBJECTITEM_CACHES({
        SubjectId: this.$route.query.id,
        PageIndex: this.pg,
        PageSize: this.size
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.total = res.data.Data.Count
          this.datas = this.datas.concat(res.data.Data.Subset)
          this.scrollIf = false
          if (this.datas.length >= this.total) {
            this.loadingsIf = false
            this.scrollIf = false
          } else {
            this.pg += 1
          }
        }
      }).catch(() => {
        this.loadingsIf = false
        this.scrollIf = false
      })
    },
    getSelfPower() {
      COLLEGE_API_CHARACTERPACK_GETBYSTORE().then(res => {
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data) {
            this.selfPower = res.data.Data
          }
        }
      })
    }
  },
  mounted() {
    this.getDetail()
    this.getSelfPower()
    const h = document.body.clientHeight - 210
    document.getElementById('gift-dynamics').style.height = h + 'px'
    document.getElementsByClassName('wai-scroll')[0].style.height = h + 'px'
  },
  watch: {
  },
  components: {
    MugenScroll
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/college/videoCard.scss';
</style>
<style lang="scss" scoped>
.zt-title {
  display: flex;
  .img {
    width: 160px;
    height: 90px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .right {
    width: calc(100% - 170px);
    overflow: hidden;
    .title {
      font-size: 18px;
      font-weight: 500;
      line-height: 30px;
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .cont {
      line-height: 24px;
      color: #999;
      white-space: normal !important;
      text-overflow: ellipsis;
      word-wrap: break-word;
      display: -webkit-box;
      -webkit-line-clamp: 7;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}
</style>

