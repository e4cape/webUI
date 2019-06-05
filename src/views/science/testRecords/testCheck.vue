
<template>
  <div class="content">
    <div class="exam-title">
      <div class="title">{{resultDetail.CourseTitle}}</div>
      <div class="message">（总分{{resultDetail.TotalScore}}，合格{{resultDetail.PassScore}}，单选每题{{resultDetail.SingleScore}}分，多选每题{{resultDetail.MultiScore}}分）</div>
      <div class="action" v-if="resultDetail.CreateTime">
        <span>考试成绩：{{resultDetail.Score}}分 （{{employeeExamPaperPassState.Types[resultDetail.PassState]}}）</span>
        <span>答错题目：{{resultDetail.WrongQty}} 题</span>
        <span>答对题目：{{resultDetail.RightQty}} 题</span>
        <span>考试时间：{{resultDetail.CreateTime | filterDateTime}}</span>
        <span>考试用时：{{parseInt((resultDetail.TakeTime - resultDetail.TakeTime % 60) / 60) + '分' + parseInt(resultDetail.TakeTime % 60) + '秒'}}</span>
      </div>
    </div>
    <div class="topics">
      <div class="topic" v-for="(item,index) in examinations" :key="index">
        <p>
          <span class="error m-r-5" v-if="item.IsRight == yNStatus.No">(✘)</span>
          <span class="success m-r-5" v-else>(✔)</span>
          {{index + 1}}.&nbsp;{{infrastCourseQuesType.Multi == item.QuesType ? '（多选）' : ''}}{{item.Title}}
        </p>
        <img :src="$root.settings.DOMAIN_IMG_FILE + item.ImageUrl" alt v-if="item.ImageUrl">
        <el-radio-group disabled v-model="item.Answers2" class="m-t-10 m-b-10" v-if="infrastCourseQuesType.Single == item.QuesType">
          <!-- 单选框 -->
          <el-radio :label="opt.OptionId.toString()" v-for="(opt, index) in item.Options" :key="index">{{opt.Title}}</el-radio>
        </el-radio-group>
        <el-checkbox-group disabled v-model="item.Answers2" class="m-t-10 m-b-10" v-else>
          <!-- 多选框 -->
          <el-checkbox :label="opt.OptionId.toString()" v-for="(opt, index) in item.Options" :key="index">{{opt.Title}}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>
<script>
import {
  COLLEGE_API_EMPLOYEEEXAMQUES_GETS, COLLEGE_API_EMPLOYEEEXAMPAPER_GET
} from '@/apis/science'
import {
  InfrastCourseQuesType,
  EmployeeExamPaperPassState
} from '@/enums/science'
import {
  YNStatus
} from '@/enums/common'
export default {
  data() {
    return {
      radio2: '',
      resultDetail: {
      },
      yNStatus: YNStatus,
      employeeExamPaperPassState: EmployeeExamPaperPassState,
      infrastCourseQuesType: InfrastCourseQuesType,
      examinations: [],
      checkList: []
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      if (query.id && query.id != 'undefined') {
        this.getDetails(query.id)
        this.getDetail(query.id)
      } else {
        this.$message.error('参数错误')
        setTimeout(() => {
          this.$router.back()
        }, 1000)
      }
    },
    getDetails(id) {
      COLLEGE_API_EMPLOYEEEXAMQUES_GETS({
        PaperId: id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          let examinations = res.data.Data
          examinations.map(item => {
            item.Options = JSON.parse(item.Options)
            if (item.QuesType === InfrastCourseQuesType.Multi) {
              item.Answers2 = item.Answers2.split(',')
            }
          })
          this.examinations = examinations
        }
      })
    },
    getDetail(id) {
      COLLEGE_API_EMPLOYEEEXAMPAPER_GET({
        PaperId: id
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.resultDetail = res.data.Data
        }
      })
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
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
    display: flex;
    flex-direction: column;
    right: 10px;
    top: 76px;
    padding: 10px 16px;
    background-color: #399fe5;
    border-radius: 2px;
    span {
      line-height: 22px;
      color: #fff;
    }
  }
}
.topics {
  width: 960px;
  margin: 0 auto;
  .topic {
    .error {
      color: #da0000;
    }
    .success {
      color: #ffa200;
    }
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

/deep/ .el-radio {
  margin: 0 0 10px 15px;
}
/deep/ .el-checkbox {
  margin: 0 0 10px 15px;
}
</style>

