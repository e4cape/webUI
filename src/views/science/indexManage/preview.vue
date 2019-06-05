<template>
  <div class="preview">
    <div class="hd">
      <span>专题</span>
    </div>
    <ul
      v-if="subjectArr.length>0"
      class="subject"
    >
      <li
        v-for="(item, index) in subjectArr"
        :key="index"
      >
        <img
          v-if="item.SubjectImageUrl.startsWith('http')"
          :src="item.SubjectImageUrl"
          alt
        >
        <img
          v-else-if="item.SubjectImageUrl"
          :src="$root.settings.DOMAIN_IMG_FILE+item.SubjectImageUrl"
          alt
        >
        <img
          v-else
          src="@/assets/images/nopage.jpg"
          alt
        >
        <h6>{{item.SubjectTitle}}</h6>
        <p>{{item.SubjectNote}}</p>
      </li>
    </ul>
    <div
      v-else-if="subjectLoading"
      v-loading="subjectLoading"
      class="data-loading"
    >
    </div>
    <div
      v-else
      class="no-data"
    >暂无数据</div>
    <div class="hd">
      <span>珠宝学院</span>
    </div>
    <ul
      v-if="collegeArr.length>0"
      class="system-college"
    >
      <li
        v-for="item in collegeArr"
        :key="item.CourseId"
      >
        <div class="pic">
          <img
            v-if="item.CourseImageUrl.startsWith('http')"
            :src="item.CourseImageUrl"
            class="img"
            alt
          >
          <img
            v-else-if="item.CourseImageUrl"
            :src="$root.settings.DOMAIN_IMG_FILE+item.CourseImageUrl"
            class="img"
            alt
          >
          <img
            v-else
            src="@/assets/images/nopage.jpg"
            class="img"
            alt
          >
          <img
            v-if="item.State!=EnumInfrastCourseState.Audit"
            src="@/assets/images/canceled.png"
            class="imgCancel"
          >
          <i
            class="icon-play"
            v-if="item.CourseType==EnumInfrastCourseType.Video"
          ></i>
        </div>
        <div class="cont">
          <div class="title">
            <i
              class="icon-video"
              v-if="item.CourseType==EnumInfrastCourseType.Video"
            ></i>
            {{item.CourseTitle}}
          </div>
          <b>{{item.LargeName + (item.SmallName ? '>' + item.SmallName : '')}}</b>
          <span>{{item.CreateTime}}</span>
        </div>
      </li>
    </ul>
    <div
      v-else-if="subjectLoading"
      v-loading="subjectLoading"
      class="data-loading"
    >
    </div>
    <div
      v-else
      class="no-data"
    >暂无数据</div>
    <div class="hd">
      <span>系统培训</span>
    </div>
    <ul
      v-if="systemArr.length>0"
      class="system-college"
    >
      <li
        v-for="item in systemArr"
        :key="item.CourseId"
      >
        <div class="pic">
          <img
            v-if="item.CourseImageUrl.startsWith('http')"
            :src="item.CourseImageUrl"
            class="img"
            alt
          >
          <img
            v-else-if="item.CourseImageUrl"
            :src="$root.settings.DOMAIN_IMG_FILE+item.CourseImageUrl"
            class="img"
            alt
          >
          <img
            v-else
            src="@/assets/images/nopage.jpg"
            class="img"
            alt
          >
          <img
            v-if="item.State!=EnumInfrastCourseState.Audit"
            src="@/assets/images/canceled.png"
            class="imgCancel"
          >
          <i
            class="icon-play"
            v-if="item.CourseType==EnumInfrastCourseType.Video"
          ></i>
        </div>
        <div class="cont">
          <div class="title">
            <i
              class="icon-video"
              v-if="item.CourseType==EnumInfrastCourseType.Video"
            ></i>
            {{item.CourseTitle}}
          </div>
          <b>{{item.LargeName + (item.SmallName ? '>' + item.SmallName : '')}}</b>
          <span>{{item.CreateTime}}</span>
        </div>
      </li>
    </ul>
    <div
      v-else-if="subjectLoading"
      v-loading="subjectLoading"
      class="data-loading"
    >
    </div>
    <div
      v-else
      class="no-data"
    >暂无数据</div>
  </div>
</template>
<script>
import {
  COLLEGE_API_SUSTAINRECMT_GETSBYVIEW // 列表(专题推荐/系统培训/珠宝学院)
} from '@/apis/science'

import {
  InfrastCourseType,
  SustainRecmtType,
  InfrastCourseState
} from '@/enums/science'

export default {
  data() {
    return {
      subjectLoading: true,
      collegeLoading: false,
      systemLoading: false,
      subjectArr: [], // 专题
      collegeArr: [], // 珠宝显示
      systemArr: [], // 系统显示
      collegeArrBasic: [], // 珠宝列表
      systemArrBasic: [], // 系统列表
      screenWidth: document.body.clientWidth // 可视区宽度
    }
  },
  computed: {
    EnumSustainRecmtType() {
      return SustainRecmtType
    },
    EnumInfrastCourseType() {
      return InfrastCourseType
    },
    EnumInfrastCourseState() {
      return InfrastCourseState
    }
  },

  mounted() {
    this.getSubject()
    this.getCollege()
    this.getSystem()

    this.screenWidthChange()
    window.onresize = () => {
      this.screenWidth = document.body.clientWidth
      this.screenWidthChange()
    }
  },
  methods: {
    // 为了限制学院和系统只占两行，进行适配
    screenWidthChange() {
      if (this.screenWidth < 1680) {
        this.collegeArr = this.collegeArrBasic.slice(0, 8)
        this.systemArr = this.systemArrBasic.slice(0, 8)
      } else {
        this.collegeArr = this.collegeArrBasic.slice(0, 10)
        this.systemArr = this.systemArrBasic.slice(0, 10)
      }
    },
    // 专题列表
    getSubject() {
      this.subjectLoading = true
      COLLEGE_API_SUSTAINRECMT_GETSBYVIEW({
        RecmtType: SustainRecmtType.Subject
      })
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.subjectArr = res.data.Data.Subset.slice(0, 2)
          }
          this.subjectLoading = false
        })
        .catch(() => {
          this.subjectLoading = false
        })
    },
    // 珠宝列表
    getCollege() {
      this.collegeLoading = true
      COLLEGE_API_SUSTAINRECMT_GETSBYVIEW({
        RecmtType: SustainRecmtType.College
      })
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.collegeArrBasic = res.data.Data.Subset.slice(0, 10)
            this.screenWidthChange()
          }
          this.collegeLoading = false
        })
        .catch(() => {
          this.collegeLoading = false
        })
    },
    // 系统列表
    getSystem() {
      this.systemLoading = true
      COLLEGE_API_SUSTAINRECMT_GETSBYVIEW({
        RecmtType: SustainRecmtType.System
      })
        .then(res => {
          if (res.data.Code === 'CORRECT') {
            this.systemArrBasic = res.data.Data.Subset.slice(0, 10)
            this.screenWidthChange()
          }
          this.systemLoading = false
        })
        .catch(() => {
          this.systemLoading = false
        })
    }
  },
  watch: {
    $route: 'init'
  }
}
</script>
<style lang="scss" scoped>
.preview {
  .hd {
    padding-top: 10px;
    border-bottom: 1px solid $border-color;
    span {
      display: inline-block;
      padding: 0px 12px 8px;
      margin-bottom: -3px;
      border-bottom: 3px solid #1f91df;
      color: #777;
      font-weight: 800;
    }
  }
}
.subject {
  margin-top: 10px;
  overflow: auto;
  li {
    position: relative;
    float: left;
    width: 50%;
    height: 180px;
    padding-left: 330px;
    margin-bottom: 10px;
    background: #f9f9f9;
    overflow: hidden;
    &:nth-child(2n) {
      border-left: 5px solid $white;
    }
    &:nth-child(2n + 1) {
      border-right: 5px solid $white;
    }
    img {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 320px;
      height: 180px;
    }
    h6 {
      padding: 15px 0 5px;
      font-weight: bold;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    p {
      line-height: 24px;
      color: #777;
      font-size: $small-font;
    }
  }
}
@media screen and (max-width: 1440px) {
  .subject {
    li {
      width: 100%;
      border: none !important;
    }
  }
}
.system-college {
  padding-top: 10px;
  overflow: auto;
  li {
    float: left;
    width: 19%;
    margin-right: 1.25%;
    margin-bottom: 10px;
    background: #f9f9f9;
    &:nth-child(5n) {
      margin-right: 0;
    }
    .pic {
      position: relative;
      padding-top: 56.25%;
      overflow: hidden;
      .img {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        width: 100%;
        height: 100%;
        transition: all 0.5s;
      }
      .imgCancel {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
      }
      i {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 999;
        color: $white;
        font-size: 60px;
        opacity: 0;
        transition: all 0.5s;
        transform: translate(-50%, -50%);
      }
    }
    &:hover {
      .pic {
        .img {
          transform: scale(1.1);
        }
        i {
          opacity: 1;
        }
      }
    }
    .cont {
      position: relative;
      padding: 12px 10px 0;
      height: 60px;
      .title {
        margin-bottom: 12px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        i {
          margin-right: 5px;
          vertical-align: middle;
          color: #ffa200;
          font-size: $base-font;
        }
      }
      b {
        color: $light-gray;
      }
      span {
        position: absolute;
        right: 10px;
        bottom: 12px;
        color: $light-gray;
      }
    }
  }
}
@media (max-width: 1680px) {
  .system-college {
    li {
      width: 24%;
      &:nth-child(5n) {
        margin-right: 1.333333333%;
      }
      margin-right: 1.333333333%;
      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
}
.data-loading {
  text-align: center;
  height: 50px;
  line-height: 50px;
}
.no-data {
  @extend .data-loading;
  color: $light-gray;
}
</style>

