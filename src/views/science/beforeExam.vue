<template>
  <el-dialog title="确定考试" width="500px" :visible.sync="visible">
    <template>
      <div class="message">
        <span>本次考试共</span>
        <span class="b">{{examDetail.QuesQty}}</span>
        <span>道题，共</span>
        <span class="b">{{examDetail.TotalScore}}</span>
        <span>分，</span>
        <span class="b">{{examDetail.PassScore}}</span>
        <span>分合格</span>
      </div>
      <div class="message">
        <span>限时</span>
        <span class="b">{{examDetail.ExamTime}}</span>
        <span>分钟</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnAddGoods" type="primary" :loading="$store.getters.is_loading" @click="checkExam($event)">开始考试</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
// 考试前确定组件
import { COLLEGE_API_EMPLOYEEEXAMPAPER_EXAM } from '@/apis/science'
export default {
  props: {
    examVisble: {
      type: Boolean
    },
    examDetail: {
      type: Object
    },
    haveExam: {
      type: Object
    }
  },
  data() {
    return {
      visible: this.examVisble
    }
  },
  methods: {
    checkExam(e) {
      e.currentTarget.blur()
      if (this.haveExam && this.haveExam.haveDate > -600) {
        this.$confirm('您有未完成的考试，请先完成后再参加新的考试。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$router.push({
              path: '/science/examination?id=' + this.haveExam.nowPaperId
            })
          })
          .catch(() => {
            this.visible = false
          })
      } else {
        this.beginExam()
      }
    },
    beginExam() {
      this.visible = false
      COLLEGE_API_EMPLOYEEEXAMPAPER_EXAM({ CourseId: this.examDetail.CourseId }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.visible = false
          this.$router.push({
            path: '/science/examination?id=' + res.data.Data
          })
        }
      })
    }
  },
  mounted() { },
  watch: {
    visible() {
      this.$emit('listenVisible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.message {
  width: 100%;
  text-align: center;
  font-size: 12px;
  color: #777;
  line-height: 40px;
  padding: 0 30px;
  .b {
    font-weight: 700;
  }
  span {
    &:nth-child(2n) {
      color: #333;
      padding: 0 5px;
    }
  }
}
</style>

