
<template>
  <div class="content">
    <div class="scheme">
      <span class="strong">当前培训方案：</span>
      <el-tooltip class="my-tooltip" effect="light" :content="solutionBasic.Note" :disabled="!solutionBasic.Note" placement="bottom-start">
        <div class="default m-l-20" @click="getSolutionDetail(solutionBasic.SolutionId)">
          <span>{{solutionBasic.SolutionId == 0 ? '空' : solutionBasic.SolutionId}}</span>
          <span>方案</span>
        </div>
      </el-tooltip>
      <span class="m-l-40 strong">其他培训方案：</span>
      <div class="other-plan">
        <template v-for="(item, index) in solutions">
          <el-tooltip
            v-if="solutionBasic.SolutionId != item.SolutionId && item.PackId <= selfPower.PackId"
            :key="index"
            class="my-tooltip"
            effect="light"
            :disabled="!item.Note"
            :content="item.Note"
            placement="bottom-start"
          >
            <div class="m-l-20" @click="getSolutionDetail(item.SolutionId)">
              <span>{{item.SolutionId}}</span>
              <span>方案</span>
            </div>
          </el-tooltip>
        </template>
      </div>
      <el-button class="m-l-20" type="text" @click="moreScheme=true">更多方案</el-button>
    </div>
    <div class="buttons">
      <el-button type="primary" @click="addClassVisible = true">添加课程</el-button>
      <el-button @click="addClassTopicVisible = true">从专题选课</el-button>
    </div>

    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="CourseTitle" label="课程标题" min-width="120" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="LargeName" label="分类" show-overflow-tooltip min-width="120">
        <template slot-scope="scope">{{scope.row.LargeName + (scope.row.SmallName ? '>' + scope.row.SmallName : '')}}</template>
      </el-table-column>
      <el-table-column prop="CourseType" label="类型" show-overflow-tooltip min-width="100">
        <template slot-scope="scope">{{infrastCourseType.Types[scope.row.CourseType]}}</template>
      </el-table-column>
      <el-table-column prop="IsPaper" label="是否有考试" min-width="100">
        <template slot-scope="scope">{{scope.row.IsPaper == yNStatus.Yes ? '是' : '否'}}</template>
      </el-table-column>
      <el-table-column prop="TotalScore" label="考试分数" min-width="120">
        <template slot-scope="scope">{{scope.row.IsPaper == yNStatus.Yes ? '总分'+ scope.row.TotalScore +'，合格' + scope.row.PassScore : '-'}}</template>
      </el-table-column>
      <el-table-column prop="CreateTime" label="添加时间" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column prop="CreateUser" label="添加人" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.IsMine == yNStatus.Yes ? scope.row.CreateUser : '-'}}</template>
      </el-table-column>
      <el-table-column prop="PackName" label="考试结果" min-width="80" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.IsPaper == yNStatus.Yes" @click="checkExam(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="PackName" label="操作" min-width="80" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.IsMine == yNStatus.Yes" class="row-delete" @click="deleteItem($event,scope.row.ItemId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="方案列表" width="820px" :visible.sync="moreScheme">
      <template v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
        <div class="scheme-dialog">
          <div class="my-tooltip m-l-20 m-b-10" :class="{'default': 0 == solutionBasic.SolutionId}" @click="whitePlan($event)">
            <span></span>
            <span>空方案</span>
          </div>
          <template v-for="(item, index) in solutions">
            <el-tooltip v-if="item.PackId <= selfPower.PackId" :key="index" class="my-tooltip m-b-10" effect="light" :disabled="!item.Note" :content="item.Note" placement="bottom-start">
              <div class="m-l-20" :class="{'default': item.SolutionId == solutionBasic.SolutionId}" @click="getSolutionDetail(item.SolutionId)">
                <span>{{item.SolutionId}}</span>
                <span>方案</span>
              </div>
            </el-tooltip>
          </template>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="方案详情" width="900px" :visible.sync="schemeDetailDialog">
      <template v-loading="suloItemsLoading">
        <div class="scheme-detail">
          <div class="left">
            <span>{{solutionDetail.SolutionId}}</span>
            <span>方案</span>
          </div>
          <div class="right">
            <div class="title">{{solutionDetail.Title}}</div>
            <div class="message">
              <span class="label-sch">培训目标：</span>
              <span class="value">{{solutionDetail.Target}}</span>
            </div>
            <div class="message">
              <span class="label-sch">培训范围：</span>
              <span class="value">{{solutionDetail.Scope}}</span>
            </div>
            <div class="message">
              <span class="label-sch">计划天数：</span>
              <span class="value">{{solutionDetail.Days}}</span>
            </div>
            <div class="message">
              <span class="label-sch">方案介绍：</span>
              <p>{{solutionDetail.Note}}</p>
            </div>
          </div>
        </div>
        <el-table :data="sulotionItem" class="m-t-20 m-b-10">
          <el-table-column prop="CourseId" label="序号" min-width="100" show-overflow-tooltip>
            <template slot-scope="{$index}">{{$index + 1}}</template>
          </el-table-column>
          <el-table-column prop="CourseTitle" label="名称" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="SmallName" label="所属" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.LargeName + (scope.row.SmallName ? '>' + scope.row.SmallName : '')}}</template>
          </el-table-column>
          <el-table-column prop="IsPaper" label="是否有考卷" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.IsPaper == yNStatus.Yes ? '是' : '否'}}</template>
          </el-table-column>
          <el-table-column prop="CourseType" label="类型" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">{{infrastCourseType.Types[scope.row.CourseType]}}</template>
          </el-table-column>
        </el-table>

        <div slot="footer" class="dialog-footer">
          <el-button name="btnAddGoods" type="primary" v-if="detailId != solutionBasic.SolutionId" :loading="$store.getters.is_loading" @click="chooseSolution(detailId)">选择该方案</el-button>
          <el-button name="btnAddGoods" type="primary" v-else :loading="$store.getters.is_loading" @click="schemeDetailDialog=false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
    <addClass v-if="addClassVisible" :addClassVisible="addClassVisible" @listenVisibleChange="listenVisibleChange"></addClass>

    <addClassTopic v-if="addClassTopicVisible" :addClassTopicVisible="addClassTopicVisible" @listenViTopicChange="listenViTopicChange"></addClassTopic>

    <examCheck v-if="checkVisible" :checkVisible="checkVisible" :detail="selectRow" @listenCheckVisible="listenCheckVisible"></examCheck>
  </div>
</template>
<script>
import pagination from '@/components/pagination'
import addClass from './addClass'
import addClassTopic from './addClassTopic'
import examCheck from './examCheck'
import { InfrastCourseType } from '@/enums/science'
import { YNStatus } from '@/enums/common'
import {
  COLLEGE_API_CHARACTERSOLUTIONBASIC_GET,
  COLLEGE_API_SETTINGSOLUTIONBASIC_GETSBYSTORE,
  COLLEGE_API_CHARACTERSOLUTIONITEM_GETS,
  COLLEGE_API_CHARACTERSOLUTIONITEM_DELETE,
  COLLEGE_API_SETTINGSOLUTIONITEM_GETSBYSTORE,
  COLLEGE_API_CHARACTERSOLUTIONBASIC_CHOOSE,
  COLLEGE_API_SETTINGSOLUTIONBASIC_GETBYSTORE,
  COLLEGE_API_CHARACTERPACK_GETBYSTORE
} from '@/apis/science'
export default {
  data() {
    return {
      yNStatus: YNStatus,
      infrastCourseType: InfrastCourseType,
      moreScheme: false,
      solutions: [],
      selectRow: {},
      detailId: '',
      selfPower: {
        Days: '',
        DiffPrice: '',
        PerPrice: ''
      },
      checkVisible: false,
      addClassVisible: false,
      addClassTopicVisible: false,
      schemeDetailDialog: false,
      suloItemsLoading: false,
      solutionBasic: {},
      sulotionItem: [],
      sulotionTotal: 0,
      solutionDetail: {},
      data: []
    }
  },
  methods: {
    chooseSolution(id) {
      COLLEGE_API_CHARACTERSOLUTIONBASIC_CHOOSE({ SolutionId: id }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.schemeDetailDialog = false
          this.moreScheme = false
          this.getBasic()
        }
      })
    },
    async getSolutionDetail(id) {
      if (id) {
        // 空方案不能继续点击
        this.detailId = id
        this.schemeDetailDialog = true
        this.suloItemsLoading = true
        try {
          let results = await Promise.all([
            COLLEGE_API_SETTINGSOLUTIONBASIC_GETBYSTORE({
              SolutionId: id
            }),
            COLLEGE_API_SETTINGSOLUTIONITEM_GETSBYSTORE({
              SolutionId: id
            })
          ])
          if (results[0].data.Code === 'CORRECT') {
            this.solutionDetail = results[0].data.Data
            console.log(results[0].data.Data)
          }
          this.suloItemsLoading = false
          if (results[1].data.Code === 'CORRECT') {
            this.sulotionItem = results[1].data.Data.Subset
            this.sulotionTotal = results[1].data.Data.Count
          }
        } catch (e) {
          console.log(e)
        } finally {
          this.suloItemsLoading = false
        }
      }
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
    getBasics() {
      COLLEGE_API_SETTINGSOLUTIONBASIC_GETSBYSTORE({
        PageIndex: 1,
        PageSize: 9999
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.solutions = res.data.Data.Subset
          this.soTotal = res.data.Data.Count
        }
      })
    },
    getBasic() {
      COLLEGE_API_CHARACTERSOLUTIONBASIC_GET().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.solutionBasic = res.data.Data
          this.getData()
        }
      })
    },
    getData() {
      COLLEGE_API_CHARACTERSOLUTIONITEM_GETS({
        SolutionId: this.solutionBasic.SolutionId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          let data = res.data.Data
          // data.sort((a, b) => {
          //   return b.ItemId - a.ItemId
          // })
          this.data = data
        }
      })
    },
    whitePlan(e) {
      e.currentTarget.blur()
      if (this.solutionBasic.SolutionId == '0') {
        this.$message.error('已经是空方案')
        return
      }
      this.$confirm('确定使用空白方案?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.chooseSolution(0)
      })
    },
    deleteItem(e, id) {
      e.currentTarget.blur()
      this.$confirm('确实要删除这条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          COLLEGE_API_CHARACTERSOLUTIONITEM_DELETE({ ItemId: id }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message.success('删除成功')
              this.getData()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    checkExam(row) {
      this.checkVisible = true
      this.selectRow = row
    },
    listenVisibleChange() {
      this.addClassVisible = false
      this.getData()
    },
    listenViTopicChange() {
      this.addClassTopicVisible = false
      this.getData()
    },
    listenCheckVisible() {
      this.checkVisible = false
    }
  },
  mounted() {
    this.getBasic()
    this.getBasics()
    this.getSelfPower()
  },
  watch: {},
  components: {
    pagination,
    addClassTopic,
    examCheck,
    addClass
  }
}
</script>
<style lang="scss" scoped>
.scheme {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e5e5;
}
.scheme-dialog {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 20px;
  .my-tooltip:first-child > span:first-child {
    margin: 0;
  }
}
.my-tooltip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border: 1px solid #e5e5e5;
  cursor: pointer;
  span {
    color: #999;
    &:first-child {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
      width: 100%;
      white-space: nowrap;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  &.default {
    background-color: #399fe5;
    border: 1px solid #399fe5;
    span {
      color: #fff;
    }
  }
}
.strong {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}
.row-delete {
  color: #da0000;
}
.scheme-detail {
  display: flex;
  line-height: 24px;
  .left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 64px;
    width: 64px;
    margin-right: 10px;
    background-color: #399fe5;
    color: #fff;
    span {
      &:first-child {
        font-size: 20px;
        font-weight: 600;
        width: 100%;
        white-space: nowrap;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .right {
    // flex: 1;
    width: calc(100% - 70px);
    .title {
      font-weight: 600;
      font-size: 14px;
      color: #333;
    }
    .message {
      color: #777;
      display: flex;
      .label-sch {
        display: block;
        width: 70px;
        vertical-align: middle;
        color: #333;
        font-size: 12px;
      }
      .value {
        display: block;
        width: calc(100% - 70px);
      }
      p {
        display: block;
        width: calc(100% - 70px);
        word-break: break-all;
        word-break: break-word; /* IE */
        word-wrap: break-word; /* IE */
        vertical-align: middle;
      }
    }
  }
}
.dialog-footer {
  display: flex;
  justify-content: center;
}
.other-plan {
  display: flex;
  flex-wrap: wrap;
  max-width: 336px;
  height: 64px;
  overflow: hidden;
}
</style>