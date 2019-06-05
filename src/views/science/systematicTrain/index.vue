
<template>
  <div class="content">
    <div class="science-search">
      <el-select name="PrimeType" class="sys-select" placeholder="所有分类" v-model="queryForm.LargeId" :filterable="true" @change="onSearch">
        <el-option label="所有分类" value="0"></el-option>
        <el-option v-for="(item,index) in allSys" :key="index" :label="item.DictName" :value="item.DictId"></el-option>
      </el-select>
      <el-input style="width: 300px!important;" class="m-r-10" placeholder="请输入内容回车进行搜索" v-model="queryForm.CourseTitle" @keyup.enter.native="onSearch"></el-input>
      <span :class="'group m-r-10 ' + (queryForm.Orderby == 0? 'active': '')" @click="orderbyChange(true)">最新</span>
      <span :class="'group ' + (queryForm.Orderby == 1? 'active': '')" @click="orderbyChange(false)">最火</span>
    </div>
    <div class="wai-scroll">
      <div class="nei-video" ref="scrollContainer" id="gift-dynamics">
        <div v-if="!datas.length && !loadingsIf" class="no-data">暂无数据</div>
        <router-link v-else class="video" :to="'/science/videoCheck?id=' + item.CourseId + '&name=' + (item.CourseType == infrastCourseType.Video ? '视频' : '文章')" v-for="(item,index) in datas" :key="index">
          <div class="img">
            <div class="back-img" :style="`background-image: url(${item.ImageUrl ? $root.settings.DOMAIN_IMG_FILE + item.ImageUrl : '@/assets/images/nopage.jpg'});`"></div>
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
  COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYSYSTEM, COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMLISTBYSTORE, COLLEGE_API_CHARACTERPACK_GETBYSTORE
} from '@/apis/science'
import MugenScroll from 'vue-mugen-scroll'
export default {
  data() {
    return {
      infrastCourseType: InfrastCourseType,
      datas: [],
      total: 0,
      queryForm: {
        LargeId: '0',
        CourseTitle: '',
        SmallId: 0,
        Orderby: 0,
        PageIndex: 1,
        PageSize: 20,
      },
      selfPower: {},
      allSys: [],
      scrollIf: false, // 是否滚动状态
      loadingsIf: false, // 是否显示加载中
      scrollContainer: true // 滚动加载容器
    }
  },
  methods: {
    getDatas() {
      if (this.datas.length >= this.total && this.total) {
        return
      }
      this.scrollIf = true
      this.loadingsIf = true
      let param = JSON.parse(JSON.stringify(this.queryForm))
      delete param.category
      COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMLISTBYSTORE(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.total = res.data.Data.Count
          this.datas = this.datas.concat(res.data.Data.Subset)
          this.scrollIf = false
          if (this.datas.length >= this.total) {
            this.loadingsIf = false
          } else {
            this.queryForm.PageIndex += 1
          }
        }
      }).catch(() => {
        this.loadingsIf = false
        this.scrollIf = false
      })
    },
    orderbyChange(flg) {
      this.queryForm.Orderby = flg ? 0 : 1 // 排序字段(0=创建时间, 1=点击次数, 2=点击量, 3=浏览人数, 4=点赞, 5=考试次数, 6=合格次数, 7=合格人数, 8=合格率)	
      this.onSearch()
    },
    onSearch () {
      this.queryForm.PageIndex = 1
      this.datas = []
      this.getDatas()
    },
    getSystemDrown () {
      COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYSYSTEM().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.allSys = res.data.Data.Subset
        }
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
    this.getSystemDrown()
    this.getSelfPower()
    const h = document.body.clientHeight - 120
    document.getElementById('gift-dynamics').style.height = h + 'px'
    document.getElementsByClassName('wai-scroll')[0].style.height = h + 'px'
  },
  components: {
    MugenScroll
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/sass/college/videoCard.scss';
</style>