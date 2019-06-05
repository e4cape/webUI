
<template>
  <div class="content">
    <div class="science-search">
      <el-input style="width: 300px!important;" v-model="queryForm.Title" class="m-r-10" placeholder="请输入内容回车进行搜索" @keyup.enter.native="onSearch"></el-input>
      <span :class="'group m-r-10 ' + (queryForm.Orderby == 0 ? 'active': '')" @click="orderbyChange(true)">最新</span>
      <span :class="'group ' + (queryForm.Orderby == 1 ? 'active': '')" @click="orderbyChange(false)">最火</span>
    </div>
    <div class="wai-scroll">
      <div class="zt-content" ref="scrollContainer" id="gift-dynamics">
        <div v-if="!datas.length && !loadingsIf" class="no-data">暂无数据</div>
        <router-link v-else :to="'/science/lively/livelyCheck?id=' + item.SubjectId" class="zt" v-for="(item,index) in datas" :key="index">
          <div class="img">
            <img v-if="item.ImageUrl" :src="item.ImageUrl.indexOf('http') > -1 ? item.ImageUrl : $root.settings.DOMAIN_IMG_FILE + item.ImageUrl" alt="">
            <img v-else src="@/assets/images/nopage.jpg" alt="">
          </div>
          <div class="context">
            <div class="title">{{item.Title}}</div>
            <div class="text">{{item.Note}}</div>
          </div>
        </router-link>
        <!-- <span>111</span> -->
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
  COLLEGE_API_INFRASTSUBJECTBASIC_CACHES 
} from '@/apis/science'
import MugenScroll from 'vue-mugen-scroll'
export default {
  data() {
    return {
      datas: [],
      queryForm: {
        Title: '',
        Orderby: 0,
        PageIndex: 1,
        PageSize: 20
      },
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
      this.scrollIf = true
      this.loadingsIf = true
      if (this.datas.length >= this.total && this.total != 0) {
        this.loadingsIf = false
        return
      }
      COLLEGE_API_INFRASTSUBJECTBASIC_CACHES(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.datas = this.datas.concat(res.data.Data.Subset)
          this.total = res.data.Data.Count
          this.scrollIf = false
          if (this.datas.length >= this.total) {
            this.loadingsIf = false
          } else {
            this.queryForm.PageIndex += 1
          }
        }
      }).catch(() => {
        this.loadingsIf = false
        // this.scrollIf = false
      })
    }
  },
  mounted() {
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
.no-data {
  width: 100%;
  text-align: center;
  line-height: 30px;
  color: #999;
}
.content {
  padding-bottom: 0 !important;
}
.science-search {
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e5e5;
  .group {
    padding: 4px 8px;
    font-size: 12px;
    color: #333;
    cursor: pointer;
    background-color: #f5f5f5;
    &.active {
      color: #fff;
      background-color: #ffa200;
    }
  }
}
.zt-content {
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  overflow: hidden;
  .zt {
    margin-bottom: 10px;
    display: flex;
    height: 174px;
    overflow: hidden;
    width: calc(50% - 10px);
    &:nth-child(2n-1) {
      margin-right: 10px;
      .context .text {
        width: calc(100% - 10px);
      }
    }
    background-color: #f5f5f5;
    overflow: hidden;
    .img {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 310px;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
    .context {
      padding: 12px;
      width: calc(100% - 310px);
      height: 174px;
      overflow: hidden;
      .title {
        color: #333;
        width: 100%;
        font-weight: 800;
        font-size: 14px;
        height: 28px;
        line-height: 28px;
        white-space: nowrap;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .text {
        margin-top: 3px;
        // height: 22px;
        text-indent:2em;
        line-height: 22px;
        color: #777;
        text-overflow:ellipsis; 
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 6;
      }
    }
  }
}
.mugen-scroll {
  width: 100%;
  .loadings {
    display: block;
    height: 60px;
    line-height: 60px;
    width: 100%;
    text-align: center;
  }
}
.wai-scroll {
  width: 100%;
  overflow: hidden;
  height: calc(100% - 400px);
  margin-top: 10px;
}
#gift-dynamics {
  overflow-y: auto;
  overflow-x: hidden;
  margin-right: -26px;
}

@media screen and (max-width: 1440px) {
  .zt-content {
    .zt {
      width: 100%;
      &:nth-child(2n-1) {
        margin-right: 0px;
        .context .text {
          width: 100%;
        }
      }
    }
  }
}
</style>

