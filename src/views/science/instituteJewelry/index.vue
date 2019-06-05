
<template>
  <div class="content">
    <div class="science-search">
      <el-cascader :options="collegeDrown" change-on-select class="m-r-10" v-model="queryForm.category" @change="onSearch" filterable placeholder="所有分类"></el-cascader>

      <el-input style="width: 300px!important;" class="m-r-10" placeholder="请输入内容回车进行搜索" v-model="queryForm.CourseTitle" @keyup.enter.native="onSearch"></el-input>

      <span :class="'group m-r-10 ' + (queryForm.Orderby == 0? 'active': '')" @click="orderbyChange(true)">最新</span>
      <span :class="'group ' + (queryForm.Orderby == 1? 'active': '')" @click="orderbyChange(false)">最火</span>
    </div>
    <div class="wai-scroll">
      <div class="nei-video" ref="scrollContainer" id="gift-dynamics">
        <div v-if="!datas.length && !loadingsIf" class="no-data">暂无数据</div>
        <router-link v-else class="video" :to="'/science/videoCheck?id=' + item.CourseId + '&name=' + (item.CourseType == infrastCourseType.Video ? '视频' : '文章')" v-for="(item,index) in datas" :key="index">
          <div class="img">
            <div class="back-img" :style="`background-image: url(${item.ImageUrl ? (item.ImageUrl.indexOf('http') > -1 ? '' :  $root.settings.DOMAIN_IMG_FILE) + item.ImageUrl : '@/assets/images/nopage.jpg'});`"></div>
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
import MugenScroll from 'vue-mugen-scroll'
import {
  InfrastCourseType 
} from '@/enums/science'
import {
  COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYCOLLEGE, COLLEGE_API_INFRASTCOURSEBASIC_COLLEGELISTBYSTORE,
  COLLEGE_API_CHARACTERPACK_GETBYSTORE
} from '@/apis/science'
export default {
  data() {
    return {
      infrastCourseType: InfrastCourseType,
      datas: [],
      queryForm: {
        category: ['0'],
        CourseTitle: '',
        SmallId: 0,
        LargeId: 0,
        Orderby: 0,
        PageIndex: 1,
        PageSize: 20,
      },
      total: 0,
      selfPower: {},
      collegeDrown: [],
      scrollIf: false, // 是否滚动状态
      loadingsIf: false, // 是否显示加载中
      scrollContainer: true // 滚动加载容器
    }
  },
  methods: {
    orderbyChange(flg) {
      this.queryForm.Orderby = flg ? 0 : 1 // 排序字段(0=创建时间, 1=点击次数, 2=点击量, 3=浏览人数, 4=点赞, 5=考试次数, 6=合格次数, 7=合格人数, 8=合格率)	
      this.onSearch()
    },
    onSearch() {
      this.queryForm.PageIndex = 1
      this.datas = []
      this.getDatas()
    },
    getDatas() {
      if (this.datas.length >= this.total && this.total) {
        this.loadingsIf = false
        return
      }
      this.scrollIf = true
      this.loadingsIf = true
      let category = this.queryForm.category
      let param = JSON.parse(JSON.stringify(this.queryForm))
      param.LargeId = category[0] || 0
      param.SmallId = category[1] || 0
      delete param.category
      COLLEGE_API_INFRASTCOURSEBASIC_COLLEGELISTBYSTORE(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.total = res.data.Data.Count
          this.datas = this.datas.concat(res.data.Data.Subset)
          this.scrollIf = false
          if (this.datas.length >= res.data.Data.Count) {
            this.loadingsIf = false
            this.scrollIf = false
          } else {
            this.queryForm.PageIndex += 1
          }
        }
      }).catch(() => {
        this.loadingsIf = false
        this.scrollIf = false
      })
    },
    getCollegeDrown () {
      COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYCOLLEGE().then(res => {
        if (res.data.Code === 'CORRECT') {
          let arr = [
            {
              value: '0',
              label: '所有分类',
              disabled: false
            }
          ]
          res.data.Data.Subset.forEach(item => {
            if (item.ParentId == 0) {
              arr.push(Object.assign({
                value: item.DictId + '',
                label: item.DictName,
                disabled: false
              }, item))
            }
          })
          let collegeDrown = this.initCollegeDrown(arr, res.data.Data.Subset)    
          for(let i = 0; i < collegeDrown.length; i++) {
            if (!collegeDrown[i].children && collegeDrown[i].value != '0') {
              collegeDrown.splice(i,1)
              i -= 1
            }
          }
          this.collegeDrown = collegeDrown
        }
      })
    },
    initCollegeDrown(arr, oldArr) {
      arr.forEach(item => {
        let objs = []
        oldArr.forEach(a => {
          if(item.DictId === a.ParentId) {
            objs.push(Object.assign({
              value: a.DictId + '',
              label: a.DictName,
              disabled: false
            }, a))
          }
        })
        if (objs.length) {
          item.children = this.initCollegeDrown(objs, oldArr)
        }
      })
      return arr
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
    this.getCollegeDrown()
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