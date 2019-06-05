
<template>
  <div class="content">
    <div class="perform">
      <div class="left">
        <div class="title">员工</div>
        <div class="search">
          <el-input :maxlength="50" placeholder="输入姓名搜索" v-model="trueName" @input="userSearch"></el-input>
        </div>
        <template v-for="(item, index) in $store.getters.users">
          <div
            class="staff"
            :class="{'active': queryForm.UserId == item.UserId}"
            @click="selectUser(item.UserId)"
            v-if="item.UserState === securityUserState.Audit && item.TrueName"
            :key="index"
          >{{item.TrueName}}</div>
        </template>
      </div>

      <div class="right">
        <div class="search-header">
          <el-radio-group v-model="queryForm.State" @change="getData" class="m-r-10" style="margin-top: -1px;">
            <el-radio-button label="0">全部（{{allTotals.TotalAmt || 0}}）</el-radio-button>
            <el-radio-button :label="employeeExamBasicState.Finish">已完成（{{allTotals.FinishAmt || 0}}）</el-radio-button>
            <el-radio-button :label="employeeExamBasicState.Notyet">未开始（{{allTotals.NotYetAmt || 0}}）</el-radio-button>
            <el-radio-button :label="employeeExamBasicState.Ongoing">进行中（{{allTotals.OnGoingAmt || 0}}）</el-radio-button>
          </el-radio-group>
          <el-input style="width: 300px;" :maxlength="50" v-model="queryForm.CourseTitle" placeholder="请输入内容回车进行搜索" @keyup.native.enter="getData"></el-input>
        </div>
        <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
          <el-table-column prop="AddressId" label="课程" width="650" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="course">
                <router-link :to="'/science/videoCheck?id=' + scope.row.CourseId + '&name=' + (scope.row.CourseType == infrastCourseType.Video ? '视频' : '文章')" class="course-img">
                  <img v-if="scope.row.ImageUrl" :src="$root.settings.DOMAIN_IMG_FILE + scope.row.ImageUrl" alt>
                  <img v-else src="@/assets/images/nopage.jpg" alt>
                  <span v-if="selfPower.PackId < scope.row.PackId">{{scope.row.PackName}}</span>
                </router-link>
                <div class="course-message">
                  <div class="title">{{scope.row.CourseTitle}}</div>
                  <div class="message">{{scope.row.CourseNote}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="Name" label="是否需要考试" width="140" show-overflow-tooltip>
            <template slot-scope="scope">
              <strong class="strong">{{scope.row.IsPaper == yNStatus.Yes ? '是' : '否'}}</strong>
              <div class="message" v-if="scope.row.IsPaper == yNStatus.Yes">总分{{scope.row.TotalScore}}，合格{{scope.row.PassScore}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="PaperAmt" label="考试次数" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="Score" label="考试成绩" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="force-wrap" v-if="scope.row.IsPaper == yNStatus.Yes">
                <div>{{scope.row.Score}}</div>
                <div class="message">{{employeeExamPaperPassState.Types[scope.row.PassState]}}</div>
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="State" label="状态" min-width="100" show-overflow-tooltip fixed="right">
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
  SecurityUserState
} from '@/enums/merchant'
import {
  EmployeeExamBasicState,
  EmployeeExamPaperPassState,
  InfrastCourseType
} from '@/enums/science'
import { YNStatus } from '@/enums/common'
import pagination from '@/components/pagination'
import {
  COLLEGE_API_CHARACTERSOLUTIONITEM_GETSBYUSER,
  COLLEGE_API_CHARACTERPACK_GETBYSTORE,
  COLLEGE_API_CHARACTERSOLUTIONITEM_SUMMARYBYUSER
} from '@/apis/science'
export default {
  data() {
    return {
      yNStatus: YNStatus,
      employeeExamPaperPassState: EmployeeExamPaperPassState,
      infrastCourseType: InfrastCourseType,
      securityUserState: SecurityUserState,
      employeeExamBasicState: EmployeeExamBasicState,
      selfPower: {}, // 当前套餐
      queryForm: {
        UserId: 0,
        State: 0,
        CourseTitle: '',
        PageIndex: 1,
        PageSize: 20,
        Orderby: 0,
        IsAsced: 0
      },
      allTotals: {},
      trueName: '',
      total: 0,
      data: [],
      timer: '',
      users: []
    }
  },
  methods: {
    userSearch() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        let users = JSON.parse(JSON.stringify(this.$store.getters.users))
        if (this.trueName == '') {
          this.users = users
        }
        let needArr = []
        users.forEach(item => {
          if (item.TrueName.indexOf(this.trueName) > -1) {
            needArr.push(item)
          }
        })
        this.users = needArr
      }, 300)
    },
    getSelfPower() {
      COLLEGE_API_CHARACTERPACK_GETBYSTORE().then(res => {
        if (res.data.Code === 'CORRECT') {
          if (res.data.Data) {
            this.selfPower = res.data.Data
          }
        }
      })
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      COLLEGE_API_CHARACTERSOLUTIONITEM_GETSBYUSER(this.queryForm).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Subset
          this.total = res.data.Data.Count
        }
      })
    },
    selectUser(id) {
      this.queryForm.UserId = id
      this.queryForm.PageIndex = 1
      this.getData()
      this.getTotals(id)
    },
    getTotals(id) {
      COLLEGE_API_CHARACTERSOLUTIONITEM_SUMMARYBYUSER({
        UserId: id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.allTotals = res.data.Data
        }
      })
    },
    secondCurrentChange(val) {
      this.queryForm.PageIndex = val
      this.getData()
    },
    secondSizeChange(val) {
      this.queryForm.PageIndex = 1
      this.queryForm.PageSize = val
      this.getData()
    }
  },
  mounted() {
    this.getSelfPower()
    this.$store.dispatch('GET_USERS_DROPLIST').then(() => {
      this.selectUser(this.$store.getters.users[0].UserId)
      this.getTotals(this.$store.getters.users[0].UserId)
    })
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
    & > div {
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
      padding-left: 10px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
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
      padding: 4px 10px;
    }
  }
  .right {
    width: calc(100% - 210px);
  }
}
.search-header {
  margin-bottom: 10px;
}

.force-wrap {
  display: flex;
  height: 70px;
  flex-direction: column;
  justify-content: center;
  .el-button {
    margin: 0;
    width: 80px;
    &:last-child {
      margin-top: 10px;
    }
  }
}
.course {
  display: flex;
  .course-img {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 240px;
    height: 135px;
    padding-right: 10px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
    span {
      position: absolute;
      top: 0;
      right: 20px;
      padding: 4px 10px;
      color: #fff;
      background-color: #ffa200;
      border-radius: 0 0 2px 2px;
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
      white-space: nowrap;
      color: #333;
      text-overflow: ellipsis;
    }
    .message {
      width: 100%;
      margin-top: 2px;
      color: #777;
      word-break: break-all;
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
</style>

