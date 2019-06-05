<template>
  <div class="content">
    <a
      :style="adDetail.LinkUrl?'cursor:point':'cursor:default'"
      :target="adDetail.LinkUrl&&sustainAdvertOpenType.New == adDetail.OpenType ? '_blank': '_self'"
      :href="adDetail.LinkUrl ? adDetail.LinkUrl : 'javascript:'"
      class="ad-img"
      v-if="adDetail.ImageUrl"
    >
      <img :src="$root.settings.DOMAIN_IMG_FILE + adDetail.ImageUrl" alt>
    </a>
    <div class="dy-alert m-b-5 m-t-5" v-if="unFinishAmt">
      <i class="el-icon-warning i-red m-r-5"></i>
      <span class="gray">您有未完成的课程：</span>
      <span class="black m-r-5">{{unFinishAmt}}</span>
      <router-link to="/science/requiredCourse/index" class="blue">进入>></router-link>
    </div>
    <div class="dy-alert m-b-5 m-t-5" v-if="examHave">
      <i class="el-icon-warning i-red m-r-5"></i>
      <span class="yellow">您正在考试中，剩余时间：</span>
      <span class="black m-r-5">{{timeRemaining}}</span>
      <router-link :to="'/science/examination?id=' + paperId || ''" class="blue">继续考试>></router-link>
    </div>

    <div class="dy-title">
      <span>专题</span>
      <router-link to="/science/lively/index" class="blue m-r-20">更多</router-link>
    </div>
    <div class="zt-content" v-loading="subjectLoading">
      <div v-if="!arrZt.length" class="no-data">暂无数据</div>
      <template v-else v-for="(item, index) in arrZt">
        <router-link :to="'/science/lively/livelyCheck?id=' + item.SubjectId" class="zt" :key="index">
          <div class="img">
            <img v-if="item.SubjectImageUrl" :src="(item.SubjectImageUrl.indexOf('http') > -1 ? '' :  $root.settings.DOMAIN_IMG_FILE) + item.SubjectImageUrl" alt>
            <img v-else src="@/assets/images/nopage.jpg" alt>
          </div>
          <div class="context">
            <div class="title">{{item.SubjectTitle}}</div>
            <div class="text">{{item.SubjectNote}}</div>
          </div>
        </router-link>
      </template>
    </div>

    <div class="dy-title">
      <span>珠宝学院</span>
      <router-link to="/science/instituteJewelry/index" class="blue m-r-20">更多</router-link>
    </div>
    <div class="videos p-t-10" v-loading="collegeLoading">
      <div class="nei-video">
        <div v-if="!arrZb.length" class="no-data">暂无数据</div>
        <router-link
          v-else
          class="video"
          :to="'/science/videoCheck?id=' + item.CourseId + '&name=' + (item.CourseType == infrastCourseType.Video ? '视频' : '文章')"
          v-for="(item,index) in arrZb"
          :key="index"
        >
          <div class="img">
            <img v-if="item.State!=EnumInfrastCourseState.Audit" src="@/assets/images/canceled.png" class="imgCancel">
            <div
              class="back-img"
              :style="`background-image: url(${item.CourseImageUrl ? (item.CourseImageUrl.indexOf('http') > -1 ? '' :  $root.settings.DOMAIN_IMG_FILE) + item.CourseImageUrl : '@/assets/images/nopage.jpg'});`"
            ></div>
            <i class="icon-play" v-if="item.CourseType == infrastCourseType.Video"></i>
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
      </div>
    </div>

    <div class="dy-title">
      <span>系统培训</span>
      <router-link to="/science/systematicTrain/index" class="blue m-r-20">更多</router-link>
    </div>
    <div class="videos p-t-10" v-loading="systemLoading">
      <div class="nei-video">
        <div v-if="!arrXt.length" class="no-data">暂无数据</div>
        <router-link
          v-else
          class="video"
          :to="'/science/videoCheck?id=' + item.CourseId + '&name=' + (item.CourseType == infrastCourseType.Video ? '视频' : '文章')"
          v-for="(item,index) in arrXt"
          :key="index"
        >
          <div class="img">
            <img v-if="item.State!=EnumInfrastCourseState.Audit" src="@/assets/images/canceled.png" class="imgCancel">
            <div class="back-img" :style="`background-image: url(${item.CourseImageUrl ? (item.CourseImageUrl.indexOf('http') > -1 ? '' :  $root.settings.DOMAIN_IMG_FILE) + item.CourseImageUrl : '@/assets/images/nopage.jpg'});`"
            ></div>
            <i class="icon-play" v-if="item.CourseType == infrastCourseType.Video"></i>
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
      </div>
    </div>
  </div>
</template>
<script>
import {
  InfrastCourseType,
  SustainAdvertLocationType,
  SustainRecmtType,
  SustainAdvertOpenType,
  InfrastCourseState
} from '@/enums/science'
import {
  COLLEGE_API_EMPLOYEEEXAMPAPER_REQ,
  COLLEGE_API_SUSTAINRECMT_CACHES,
  COLLEGE_API_SUSTAINADVERT_GETSBYSTORE,
  COLLEGE_API_CHARACTERSOLUTIONITEM_GETUNFINISHAMT,
  COLLEGE_API_CHARACTERPACK_GETBYSTORE
} from '@/apis/science'
import { clearInterval } from 'timers'
export default {
  data() {
    return {
      sustainAdvertOpenType: SustainAdvertOpenType,
      infrastCourseType: InfrastCourseType,
      adDetail: {},
      // selfPower: {}, // 用户套餐信息
      paperId: '',
      timeRemaining: '',
      unFinishAmt: '',
      systemLoading: false,
      collegeLoading: false,
      subjectLoading: false,
      examHave: false,
      arrZt: [],
      arrZb: [],
      arrXt: [],
      timer: null
    }
  },
  computed: {
    EnumInfrastCourseState() {
      return InfrastCourseState
    }
  },
  methods: {
    getAd() {
      COLLEGE_API_SUSTAINADVERT_GETSBYSTORE().then(res => {
        if (res.data.Code === 'CORRECT') {
          res.data.Data.Subset.forEach(item => {
            if (item.LocationType === SustainAdvertLocationType.LocationType1) {
              this.adDetail = item
            }
          })
        }
      })
    },
    getUnFinishAmt() {
      COLLEGE_API_CHARACTERSOLUTIONITEM_GETUNFINISHAMT().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.unFinishAmt = res.data.Data.UnFinishAmt
        }
      })
    },
    getKs() {
      // 获取考试信息
      COLLEGE_API_EMPLOYEEEXAMPAPER_REQ().then(res => {
        if (res.data.Code === 'CORRECT') {
          if (!res.data.Data || !res.data.Data.PaperId) {
            return // 没有正在考试的课程
          }
          this.paperId = res.data.Data.PaperId
          let endTime = parseInt(
            (Date.parse(res.data.Data.Expiree) -
              Date.parse(res.data.Data.NowTime)) /
              1000
          )
          if (endTime > -600) {
            this.examHave = true
            this.countDown(endTime)
          }
        }
      })
    },
    countDown(haveDate) {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (haveDate <= -600) {
          this.examHave = false
          clearInterval(this.timer)
          return
        } else if (haveDate > 0) {
          let s =
            parseInt(haveDate / 3600) > 0 ? parseInt(haveDate / 3600) + ':' : ''
          let f =
            parseInt((haveDate % 3600) / 60) > 0
              ? (parseInt((haveDate % 3600) / 60) >= 10
                ? parseInt((haveDate % 3600) / 60)
                : '0' + parseInt((haveDate % 3600) / 60)) + ':'
              : '00:'
          let m =
            parseInt(haveDate % 60) >= 10
              ? parseInt(haveDate % 60)
              : '0' + parseInt(haveDate % 60)
          this.timeRemaining = s + f + m
        } else {
          this.timeRemaining = '00:00'
        }
        haveDate = new Date(haveDate - 1)
      }, 1000)
    },
    getCachesSystem() {
      this.systemLoading = true
      COLLEGE_API_SUSTAINRECMT_CACHES({ RecmtType: SustainRecmtType.System })
        .then(res => {
          this.systemLoading = false
          if (res.data.Code === 'CORRECT') {
            this.arrXt = res.data.Data.Subset
            this.arrXt.length = this.arrXt.length > 12 ? 12 : this.arrXt.length
          }
        })
        .catch(() => {
          this.systemLoading = false
        })
    },
    getCachesCollege() {
      this.collegeLoading = true
      COLLEGE_API_SUSTAINRECMT_CACHES({ RecmtType: SustainRecmtType.College })
        .then(res => {
          this.collegeLoading = false
          if (res.data.Code === 'CORRECT') {
            this.arrZb = res.data.Data.Subset
            this.arrZb.length = this.arrZb.length > 12 ? 12 : this.arrZb.length
          }
        })
        .catch(() => {
          this.collegeLoading = false
        })
    },
    getCachesSubject() {
      this.subjectLoading = true
      COLLEGE_API_SUSTAINRECMT_CACHES({ RecmtType: SustainRecmtType.Subject })
        .then(res => {
          this.subjectLoading = false
          if (res.data.Code === 'CORRECT') {
            this.arrZt = res.data.Data.Subset
            this.arrZt.length = this.arrZt.length > 2 ? 2 : this.arrZt.length
          }
        })
        .catch(() => {
          this.subjectLoading = false
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
    this.getKs()
    this.getCachesSystem()
    this.getCachesCollege()
    this.getCachesSubject()
    this.getAd()
    this.getUnFinishAmt()
    // this.getSelfPower() // 用户套餐信息
  },
  watch: {
    $route: 'init'
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/sass/college/videoCard.scss';
.ad-img {
  display: block;
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 5.23%;
  img {
    position: absolute;
    top: 0;
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>

