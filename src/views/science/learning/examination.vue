
<template>
  <div class="content">
    <div class="exam-title">
      <div class="title" v-if="resultDetail.CourseTitle">{{resultDetail.CourseTitle}}</div>
      <div
        class="message"
      >（总分{{resultDetail.TotalScore}}，合格{{resultDetail.PassScore}}{{resultDetail.SingleScore > 0 ? `，单选每题${resultDetail.SingleScore}分` : ''}}{{resultDetail.MultiScore > 0 ? `，多选每题${resultDetail.MultiScore}分` : ''}}）</div>
      <div class="action">
        <div class="times">
          <span>剩余时间：</span>
          <span class="p-t-10" v-if="timeRemaining">{{timeRemaining}}</span>
        </div>
        <el-button type="primary" class="end-paper" :loading="subminLoading" @click="beforeSubminExam('before')">交卷</el-button>
      </div>
    </div>
    <div class="topics" v-loading="$store.getters.tb_loading">
      <div class="topic" v-for="(item,index) in data" :key="index">
        <p>{{index+1}}.&nbsp;{{ infrastCourseQuesType.Multi == item.QuesType ? '（多选）' : ''}}{{item.Title}}</p>
        <img @click="bigImg(item.ImageUrl)" :src="(item.ImageUrl.indexOf('http') > -1 ? '' : $root.settings.DOMAIN_IMG_FILE) + item.ImageUrl" alt v-if="item.ImageUrl">
        <el-radio-group v-model="item.Answers2" @change="saveLocal" class="m-t-10 m-b-10" v-if="infrastCourseQuesType.Single == item.QuesType">
          <!--单选框-->
          <el-radio :label="opt.OptionId + ''" v-for="(opt, index) in item.Options" :key="index">{{opt.Title}}</el-radio>
        </el-radio-group>
        <el-checkbox-group v-model="item.Answers2" @change="saveLocal" class="m-t-10 m-b-10" v-else>
          <!--多选框-->
          <el-checkbox :label="opt.OptionId + ''" v-for="(opt, index) in item.Options" :key="index">{{opt.Title}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <el-dialog title="考试结果" width="500px" :visible.sync="gradeDialog" :show-close="false" :close-on-click-modal="false">
      <template element-loading-text="拼命加载中">
        <div class="grade-detail">
          <div class="smile" v-if="resultDetail.PassState == employeeExamPaperPassState.Passed">
            <img src="@/assets/images/smile.png" alt>
            <span class="m-l-20">{{resultDetail.Score}}分</span>
          </div>
          <div class="cry" v-else>
            <img src="@/assets/images/cry.png" alt>
            <span class="m-l-20">{{resultDetail.Score}}分</span>
          </div>
          <div class="message" v-if="resultDetail.PassState == employeeExamPaperPassState.Passed">恭喜你，通过了考试</div>
          <div class="message" v-else>本次考试成绩不合格，加油！</div>
          <div class="time">考试用时{{useTime}}</div>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button name="btnAddGoods" :loading="$store.getters.is_loading" @click="examAgain">{{resultDetail.PassState == employeeExamPaperPassState.Passed ? '不满意，再考一次' : '重新考试'}}</el-button>
          <el-button @click="$router.push({path: '/science/testRecords/testCheck?id=' + paperId})" type="primary" :loading="$store.getters.is_loading">查看试卷</el-button>
          <el-button
            @click="$router.push({path: '/science/videoCheck?id=' + resultDetail.CourseId + '&name=' + (resultDetail.CourseType == infrastCourseType.Video ? '视频' : '文章')})"
            :loading="$store.getters.is_loading"
          >关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="提示" width="500px" :visible.sync="timeEndViseble" :show-close="false" :close-on-click-modal="false">
      <template element-loading-text="拼命加载中">
        <span>时间到了，您还有{{timeEndDetail.num}}道题未做，是否交卷？</span>
        <div class="gray">(十分钟后不交卷，将视为放弃考试)</div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="subminExam" :loading="subminLoading" type="primary">交卷</el-button>
          <el-button @click="cancelExam">放弃考试</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="提示" width="500px" :visible.sync="beforeViseble" :show-close="false">
      <template element-loading-text="拼命加载中">
        <span>您有未做完的题目，确定交卷？</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="subminExam" :loading="subminLoading" type="primary">确定交卷</el-button>
          <el-button @click="beforeViseble = false">继续考试</el-button>
        </div>
      </template>
    </el-dialog>
    <imgCheck v-if="checkImgVisible" :checkImgVisible="checkImgVisible" :url="url" @listenUrlCheck="checkImgVisible = false"></imgCheck>
  </div>
</template>
<script>
import {
  InfrastCourseQuesType,
  InfrastCourseType,
  EmployeeExamPaperPassState
} from '@/enums/science'
import { YNStatus } from '@/enums/common'
import {
  COLLEGE_API_EMPLOYEEEXAMQUES_GETS,
  COLLEGE_API_EMPLOYEEEXAMPAPER_HAND,
  COLLEGE_API_EMPLOYEEEXAMPAPER_GET,
  COLLEGE_API_EMPLOYEEEXAMPAPER_EXAM,
  COLLEGE_API_EMPLOYEEEXAMPAPER_CANCEL
} from '@/apis/science'
import { setInterval, clearInterval } from 'timers'
import imgCheck from '@/components/common/imgCheck'
export default {
  data() {
    return {
      paperId: '',
      yNStatus: YNStatus,
      infrastCourseType: InfrastCourseType,
      employeeExamPaperPassState: EmployeeExamPaperPassState,
      infrastCourseQuesType: InfrastCourseQuesType,
      radio2: '',
      data: [],
      checkList: [],
      resultDetail: {}, // 考试结果等信息
      gradeDialog: false,
      timeRemaining: '00:00',
      timer: null,
      timeEndViseble: false,
      beforeViseble: false,
      timeEndDetail: {
        title: '',
        num: 0
      },
      subminLoading: false, // 交卷loading
      checkImgVisible: false,
      url: '',
      useTime: '' // 考试用时
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      if (query.id) {
        let examData = JSON.parse(localStorage.examData || '{}')
        if (examData && examData.queryId && query.id == examData.queryId) {
          this.paperId = query.id
          this.data = examData.dataArr
        } else if (query.id != examData.queryId) {
          this.paperId = query.id
          this.getExamQues()
        }
        this.getDetail()
      } else {
        this.$router.back()
      }
      this.gradeDialog = false
      this.timeEndViseble = false
    },
    saveLocal() {
      localStorage.examData = JSON.stringify(
        Object.assign(
          {},
          {
            queryId: this.$route.query.id,
            resultDetail: this.resultDetail,
            dataArr: this.data
          }
        )
      )
    },
    getExamQues() {
      this.$store.commit('SET_TB_LOADING', true)
      COLLEGE_API_EMPLOYEEEXAMQUES_GETS({
        PaperId: this.$route.query.id
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          let arr = res.data.Data
          arr.map(item => {
            item.Options = JSON.parse(item.Options)
            if (item.QuesType === InfrastCourseQuesType.Multi) {
              item.Answers2 = []
            }
            item.Options.sort(() => {
              return Math.random() > 0.4 ? -1 : 1
            })
          })
          this.data = arr
        }
      })
    },
    getDetail(flg) {
      // flg 是否交卷查询成绩
      COLLEGE_API_EMPLOYEEEXAMPAPER_GET({
        PaperId: this.$route.query.id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.resultDetail = res.data.Data
          this.resultDetail.beGinTime = res.headers['Last-Stamp']
          if (flg) {
            // 交卷后
            this.gradeDialog = true
            let t = this.resultDetail.TakeTime
            this.useTime =
              (t > 3600 ? Math.floor(t / 3600) + '个小时' : '') +
              (t > 60 ? Math.floor((t % 3600) / 60) + '分钟' : '') +
              Math.floor(t % 60) +
              '秒'
          } else {
            this.countDown()
          }
        }
      })
    },
    bigImg(src) {
      this.checkImgVisible = true
      this.url = src
    },
    beforeSubminExam(type) {
      let arr = JSON.parse(JSON.stringify(this.data))
      let answers = []
      arr.forEach(item => {
        if (item.Answers2 && item.Answers2.length) {
          answers.push(item.Answers2)
        }
      })
      if (type != 'timeEnd' && answers.length === arr.length) {
        this.subminExam()
      } else {
        this.timeEndDetail.num = arr.length - answers.length || 0
        this[type + 'Viseble'] = true
      }
    },
    subminExam() {
      clearInterval(this.timer)
      this.subminLoading = true
      let arr = JSON.parse(JSON.stringify(this.data))
      let answers = []
      arr.forEach(item => {
        item.Options = JSON.stringify(item.Options)
        if (item.QuesType === InfrastCourseQuesType.Multi) {
          answers.push({
            Answers: item.Answers2.join(','),
            QuesNO: item.QuesNO
          })
        } else {
          answers.push({
            Answers: item.Answers2,
            QuesNO: item.QuesNO
          })
        }
      })
      COLLEGE_API_EMPLOYEEEXAMPAPER_HAND({
        PaperId: this.$route.query.id,
        Answers: answers
      })
        .then(res => {
          this.subminLoading = false
          this.timeEndViseble = false
          this.beforeViseble = false
          if (res.data.Code === 'CORRECT') {
            this.getDetail(true)
            localStorage.removeItem('examData') // 清除本地考试记录
          }
        })
        .catch(() => {
          this.subminLoading = false
        })
    },
    cancelExam() {
      COLLEGE_API_EMPLOYEEEXAMPAPER_CANCEL({ PaperId: this.$route.query.id }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$router.push({
            path: `/science/videoCheck?id=${this.resultDetail.CourseId}&name=${
              this.resultDetail.CourseType == InfrastCourseType.Video
                ? '视频'
                : '文章'
            }`
          })
        }
      })
    },
    examAgain() {
      // 重新考试
      COLLEGE_API_EMPLOYEEEXAMPAPER_EXAM({ CourseId: this.resultDetail.CourseId }).then(
        res => {
          if (res.data.Code === 'CORRECT') {
            this.$router.replace({
              path: this.$router.path,
              query: {
                id: res.data.Data,
                rand: parseInt(Math.random() * 100)
              }
            })
          }
        }
      )
    },
    countDown() {
      clearInterval(this.timer)
      let haveDate = parseInt((Date.parse(this.resultDetail.Expiree) - Date.parse(this.resultDetail.NowTime)) / 1000)
      this.timer = setInterval(() => {
        if (haveDate <= 0 || isNaN(haveDate)) {
          this.timeRemaining = '00:00'
          this.beforeSubminExam('timeEnd')
          clearInterval(this.timer)
          return
        }
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
        haveDate = new Date(haveDate - 1)
      }, 1000)
    }
  },
  mounted() {
    this.init()
  },
  components: {
    imgCheck
  },
  watch: {
    $route: 'init'
  }
}
</script>
<style lang="scss" scoped>
.end-paper {
  width: 160px;
}
.exam-title {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 48px 0px 42px;
  border-bottom: 1px solid #e5e5e5;
  .title {
    height: 48px;
    line-height: 48px;
    font-size: 30px;
    font-weight: 600;
    color: #333;
  }
  .message {
    font-size: 14px;
    color: #777;
  }
  .action {
    position: fixed;
    right: 10px;
    top: 80px;
    .times {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 80px;
      background-color: #aa5050;
      color: #fff;
      margin-bottom: 10px;
      padding-top: 8px;
      span {
        display: inline-block;
        width: 140px;
        font-size: 14px;
        &:nth-child(2) {
          text-align: center;
          font-size: 36px;
          font-weight: 600;
        }
      }
    }
  }
}
.topics {
  width: 960px;
  margin: 0 auto;
  .topic {
    p {
      font-size: 12px;
      color: #333;
      letter-spacing: 1px;
      font-weight: 600;
      line-height: 20px;
      margin: 6px 0 6px;
      word-wrap: break-word;
      word-break: break-all;
    }
    img {
      display: block;
      max-width: 500px;
      max-height: 200px;
      margin-left: 15px;
    }
  }
}
.grade-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px;
  .smile {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    span {
      font-size: 60px;
      color: #ffa200;
    }
  }
  .cry {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    span {
      font-size: 60px;
      color: #999;
    }
  }
  .message {
    font-size: 30px;
    font-weight: 550;
    line-height: 80px;
  }
  .time {
    font-size: 18px;
    color: #777;
    margin-bottom: 20px;
  }
}
/deep/ .el-radio {
  margin: 0 0 10px 15px;
}
/deep/ .el-checkbox {
  margin: 0 0 10px 15px;
}
</style>

