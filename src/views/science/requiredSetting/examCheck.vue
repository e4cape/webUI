
<template>
    <el-dialog title="成绩排名" width="700px" :visible.sync="visible">
      <div v-if="detail.TotalScore">考卷总分：{{detail.TotalScore}}，合格分数：{{detail.PassScore}}</div>
      <el-table :data="data" class="m-t-20 m-b-10" v-loading="dialogLoading" element-loading-text="拼命加载中">
        <el-table-column prop="AddressId" label="排名" width="50" show-overflow-tooltip>
          <template slot-scope="scope">
            {{parseInt(scope.$index - 0 + 1) + size * (pg - 1) }}
          </template>
        </el-table-column>
        <el-table-column prop="TrueName" label="姓名" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Score" label="成绩" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PaperAmt" label="考试次数" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="PassState" label="是否通过" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="{red: scope.row.PassState != employeeExamPaperPassState.Passed}">{{employeeExamPaperPassState.Types[scope.row.PassState]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="LastTime" label="最后考试时间" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.LastTime | filterDateTime }}
          </template>
        </el-table-column>
      </el-table>
      <div>注：如果考试多次，按最后一次成绩排名。</div>
      <pagination :pg="pg" :size="size" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </el-dialog>
</template>
<script>
import {
  EmployeeExamPaperPassState 
} from '@/enums/science'
import pagination from '@/components/pagination'
import {
  COLLEGE_API_EMPLOYEEEXAMBASIC_GETS,
  COLLEGE_API_INFRASTCOURSEBASIC_CACHE
} from '@/apis/science'
export default {
  props: {
    checkVisible: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: String,
      required: true,
      default: ''
    },
    detail: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      visible: this.checkVisible,
      employeeExamPaperPassState: EmployeeExamPaperPassState,
      title: '',
      radio: '珠宝学院',
      size: 10,
      pg: 1,
      dialogLoading: false,
      total: 0,
      data: []
    }
  },
  methods: {
    getDetail() {
      COLLEGE_API_INFRASTCOURSEBASIC_CACHE({
        CourseId: this.detail.CourseId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.detail = res.data.Data
        }
      })
    },
    getData () {
      this.dialogLoading = true
      COLLEGE_API_EMPLOYEEEXAMBASIC_GETS({
        CourseId: this.detail.CourseId,
        PageIndex: this.pg,
        PageSize: this.size
      }).then(res => {
        this.dialogLoading = false
        if (res.data.Code === 'CORRECT') {
          this.total = res.data.Data.Count
          this.data = res.data.Data.Subset
        }
      }).catch(() => {
        this.dialogLoading = false
      })
    },
    currentChange (val) {
      this.pg = val
    },
    sizeChange (val) {
      this.pg = 1
      this.size = val
    }
  },
  mounted() {
    this.getData()
    // this.getDetail()
  },
  watch: {
    visible () {
      this.$emit('listenCheckVisible')
    }
  },
  components: {
    pagination
  }
}
</script>
<style lang="scss" scoped>
.second {
  display: flex;
  margin-top: 10px;
}
</style>