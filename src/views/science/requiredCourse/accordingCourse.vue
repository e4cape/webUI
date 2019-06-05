<template>
  <div class="content">
    <div class="perform">

      <div class="left" v-loading="leftLoading">
        <div class="title">课程</div>
        <div class="search">
          <el-input placeholder="输入标题搜索" :maxlength="50" v-model="courseTitle" @input="titleSearch"></el-input>
        </div>
        <div class="staff" :class="{'active': queryForm.CourseId == item.CourseId}" v-for="(item, index) in titleData" :key="index" @click="selectId(item.CourseId)">{{item.CourseTitle}}</div>
      </div>
      <div class="right" v-loading="leftLoading || $store.getters.tb_loading">
        <div class="header-detail">
          <div class="detail-left">
            <router-link :to="'/science/videoCheck?id=' + courseDetail.CourseId + '&name=' + (courseDetail.CourseType == infrastCourseType.Video ? '视频' : '文章')" class="img">
              <img :src="$root.settings.DOMAIN_IMG_FILE + courseDetail.ImageUrl" v-if="courseDetail.ImageUrl" alt="">
              <img v-else src="@/assets/images/nopage.jpg" alt>
            </router-link>
            <div class="title">
              <span>{{courseDetail.CourseTitle}}</span>
              <span>{{courseDetail.CourseNote}}</span>
            </div>
          </div>
          <div class="detail-right">
            <span>{{courseDetail.IsPaper == yNStatus.Yes ? '需要考试' : '暂无考试'}}</span>
            <span v-if="courseDetail.IsPaper == yNStatus.Yes">总分{{courseDetail.TotalScore}}，合格{{courseDetail.PassScore}}</span>
          </div>
        </div>
        <div class="search-header">
          <el-radio-group v-model="queryForm.State" @change="onSearch" class="m-r-10" style="margin-top: -1px;">
            <el-radio-button label="0">全部（{{allTotals.TotalAmt || 0}}）</el-radio-button>
            <el-radio-button :label="employeeExamBasicState.Finish">已完成（{{allTotals.FinishAmt || 0}}）</el-radio-button>
            <el-radio-button :label="employeeExamBasicState.Notyet">未开始（{{allTotals.NotYetAmt || 0}}）</el-radio-button>
            <el-radio-button :label="employeeExamBasicState.Ongoing">进行中（{{allTotals.OnGoingAmt || 0}}）</el-radio-button>
          </el-radio-group>
          <el-input style="width: 300px;" v-model="queryForm.TrueName" placeholder="请输入姓名回车进行搜索" @keyup.native.enter="onSearch"></el-input>
        </div>

        <el-table :data="data" element-loading-text="拼命加载中">
          <el-table-column prop="TrueName" label="姓名" min-width="100" show-overflow-tooltip fixed></el-table-column>
          <el-table-column prop="AliasName" label="昵称" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="JobCode" label="工号" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Department" label="部门" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Score" label="考试成绩"  min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>{{scope.row.Score}}</div>
              <div class="message">{{employeeExamPaperPassState.Types[scope.row.PassState]}}</div>
              <!-- <span>-</span> -->
            </template>
          </el-table-column>
          <el-table-column prop="LastTime" label="考试时间" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.LastTime | filterDateTime}}
            </template>
          </el-table-column>
          <el-table-column prop="Mobile" label="状态"  min-width="100" show-overflow-tooltip fixed="right">
            <template slot-scope="scope">
              <span v-if="scope.row.State == employeeExamBasicState.Finish" class="finish">已完成</span>
              <span v-else-if="scope.row.State == employeeExamBasicState.Notyet" class="notbegun">未开始</span>
              <span v-else-if="scope.row.State == employeeExamBasicState.Ongoing" class="going">进行中</span>
            </template>
          </el-table-column>
        </el-table>

        <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="secondCurrentChange" @sizeChange="secondSizeChange"></pagination>
      </div>
    </div>
  </div>
</template>
<script>
import {
  YNStatus 
} from '@/enums/common'
import pagination from '@/components/pagination'
import {
  EmployeeExamBasicState,
  EmployeeExamPaperPassState,
  InfrastCourseType
} from '@/enums/science'
import {
  COLLEGE_API_EMPLOYEEEXAMBASIC_GETSBYCOURSE, COLLEGE_API_CHARACTERSOLUTIONITEM_GETSBYMINE, COLLEGE_API_INFRASTCOURSEBASIC_CACHE, COLLEGE_API_EMPLOYEEEXAMBASIC_SUMMARY
} from '@/apis/science'
import {
  Promise 
} from 'q'
import { setTimeout } from 'timers'
export default {
  data() {
    return {
      yNStatus: YNStatus,
      infrastCourseType: InfrastCourseType,
      employeeExamPaperPassState: EmployeeExamPaperPassState,
      employeeExamBasicState: EmployeeExamBasicState,
      data: [],
      courseId: '',
      titleData: [],
      leftLoading: false,
      courseDetail: {
      },
      courseTitle: '',
      allTotals: {},
      queryForm: {
        CourseId: '',
        State: 0,
        TrueName: '',
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      timer: null
    }
  },
  methods: {
    selectId(id) {
      this.queryForm.CourseId = id
      this.getTotals(id)
      this.onSearch()
    },
    onSearch() {
      this.queryForm.PageIndex = 1
      this.getData()
      // this.getDetail()
    },
    async getData() {
      this.$store.commit('SET_TB_LOADING', true)
      try {
        let getAlls = await Promise.all([
          COLLEGE_API_INFRASTCOURSEBASIC_CACHE({
            CourseId: this.queryForm.CourseId
          }), COLLEGE_API_EMPLOYEEEXAMBASIC_GETSBYCOURSE(this.queryForm)
        ])
        if (getAlls[1].data.Code === 'CORRECT') {
          if (getAlls[0].data) {
            this.courseDetail = getAlls[0].data.Data
          }
          this.data = getAlls[1].data.Data.Subset
          this.total = getAlls[1].data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      } catch(e){
        console.log(e)
      } finally {
        this.$store.commit('SET_TB_LOADING', false)
      }
    },
    getTotals(id) {
      COLLEGE_API_EMPLOYEEEXAMBASIC_SUMMARY({
        CourseId: id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.allTotals = res.data.Data
        }
      })
    },
    secondCurrentChange (val) {
      this.queryForm.PageIndex = val
      this.getData()
    },
    secondSizeChange (val) {
      this.queryForm.PageIndex = 1
      this.queryForm.PageSize = val
      this.getData()
    },
    titleSearch() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.getTitleDown()
      }, 300)
    },
    getTitleDown () {
      this.leftLoading = true
      COLLEGE_API_CHARACTERSOLUTIONITEM_GETSBYMINE({
        CourseTitle: this.courseTitle,
        State: 0,
        PageIndex: 1,
        PageSize: 9999
      }).then(res => {
        this.leftLoading = false
        if (res.data.Code === 'CORRECT') {
          this.titleData = res.data.Data.Subset
          res.data.Data.Count > 0 && this.selectId(res.data.Data.Subset[0].CourseId)
        }
      }).catch(() => {
        this.leftLoading = false
      })
    }
  },
  mounted() {
    this.getTitleDown()
  },
  watch: {
  },
  components: {
    pagination
  }
}
</script>
<style lang="scss" scoped>
.perform {
  display: flex;
  width: 100%;
  padding: 10px;
  .left {
    width: 200px;
    border-top: 1px solid #e5e5e5;
    margin-right: 10px;
    &>div {
      height: 32px;
      line-height: 26px;
      border: 1px solid #e5e5e5;
      border-top: none;
      padding: 4px;
    }
    .search {
      height: 34px;
      /deep/ .el-input__inner {
        height: 24px;
        line-height: 24px;
      }
      /deep/ .el-input {
        height: 24px;
      }
    }
    .staff {
      width: 100%;
      white-space:nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      cursor: pointer;
      &.active {
        background-color: #399fe5;
        color: #fff;
      }
    }
    .title {
      background-color: #f5f5f5;
      color: #777;
      font-weight: 600;
    }
  }
  .right {
    width: calc(100% - 210px);
  }
}
.search-header {
  margin-bottom: 10px;
}
.course {
  display: flex;
  .course-img {
    padding-right: 10px;
    img {
      max-width: 240px;
      max-height: 135px;
    }
  }
  .course-message {
    width: calc(100% - 260px);
    max-height: 135px;
    .title {
      width: 100%;
      font-size: 14px;
      font-weight: 600;
      overflow: hidden;
      white-space:nowrap;
      color: #333;
      text-overflow: ellipsis;
    }
    .message {
      width: 100%;
      margin-top: 2px;
      color: #777;
      word-break:break-all;
      word-break: break-word; /* IE */
      word-wrap: break-word; /* IE */
      white-space: pre-wrap; /* css-3 */
      white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
      white-space: -pre-wrap; /* Opera 4-6 */
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}
.notbegun {
  color: #da0000;
}
.going {
  color: #ffa200;
}
.finish {
  color: #399fe5;
}
.strong {
  font-weight: 600;
}
.header-detail {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .detail-left {
    display: flex;
    .img {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 240px;
      height: 135px;
      overflow: hidden;
      margin-right: 10px;
      img {
        max-width: 100%;
      }
    }
    .title {
      display: flex;
      flex-direction: column;
      span {
        display: inline-block;
        width: 422px;
        line-height: 20px;
        word-break:break-all;
        word-break: break-word; /* IE */
        word-wrap: break-word; /* IE */
        white-space: pre-wrap; /* css-3 */
        white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
        white-space: -pre-wrap; /* Opera 4-6 */
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
        color: #777;
        &:first-child {
          line-height: 30px;
          font-weight: 600;
          color: #333;
        }
      }
    }
  }
}
.detail-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100px;
  padding: 20px 10px;
  justify-content: space-around;
  span {
    &:first-child{
      color: green;
    }
  }
}
</style>
