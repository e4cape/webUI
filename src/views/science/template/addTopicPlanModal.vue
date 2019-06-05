
<template>
  <el-dialog
    :title="title"
    width="760px"
    :visible.sync="visible"
  >
    <template
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
    >
      <div class="first">
        <el-radio-group
          v-model="channelType"
          @change="onSearchSp"
        >
          <el-radio-button :label="infrastCourseChannelType.College">珠宝学院</el-radio-button>
          <el-radio-button :label="infrastCourseChannelType.System">系统培训</el-radio-button>
        </el-radio-group>
      </div>
      <div class="second">
        <el-cascader
          v-if="channelType == infrastCourseChannelType.College"
          :options="collegeDrown"
          class="m-r-10"
          v-model="category"
          filterable
          placeholder="所有课程"
          change-on-select
        ></el-cascader>
        <el-select
          v-else
          name="selectclass"
          class="sys-select m-r-10"
          placeholder="所有系统"
          v-model="category[0]"
          filterable
        >
          <el-option
            label="所有系统"
            :value="'0'"
          ></el-option>
          <el-option
            v-for="(item,index) in allSys"
            :key="index"
            :label="item.DictName"
            :value="item.DictId"
          ></el-option>
        </el-select>
        <el-input
          style="width: 150px;"
          class="m-r-5"
          placeholder="标题"
          v-model="queryForm.CourseTitle"
          @keyup.enter.native="onSearch"
        ></el-input>
        <el-button
          name="btnAddGoods"
          type="primary"
          :loading="$store.getters.is_loading"
          @click="onSearch"
        >搜索</el-button>
      </div>

      <el-table
        :data="data"
        @selection-change="selectChange"
        ref="addTopicPlan"
        class="m-t-10 m-b-10"
        v-loading="bodyLoading"
        @row-click="toggleSelection"
        element-loading-text="拼命加载中"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column
          prop="CourseTitle"
          label="标题"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="AddressId"
          label="分类"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{scope.row.LargeName + (scope.row.SmallName ? '>' + scope.row.SmallName : '')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="IsPaper"
          label="是否有考试"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{scope.row.IsPaper == yNStatus.Yes ? '是' : '否'}}</template>
        </el-table-column>
        <el-table-column
          label="适用套餐"
          prop="PackName"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="CourseType"
          label="类型"
          min-width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ infrastCourseType.Types[scope.row.CourseType + ''] }}</template>
        </el-table-column>
        <el-table-column
          prop="CreateTime"
          label="创建时间"
          min-width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">{{ scope.row.CreateTime | filterDateTime }}</template>
        </el-table-column>
      </el-table>

      <pagination
        :pg="queryForm.PageIndex"
        :size="queryForm.PageSize"
        :total="total"
        @currentChange="currentChange"
        @sizeChange="sizeChange"
      ></pagination>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          name="btnAddGoods"
          type="primary"
          :loading="$store.getters.is_loading"
          @click="saveData"
        >保存</el-button>
        <el-button
          name="btnAddGoods"
          :loading="$store.getters.is_loading"
          @click="visible = false"
        >取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import {
  InfrastCourseChannelType,
  InfrastCourseType,
  InfrastCourseState
} from '@/enums/science'
import { YNStatus } from '@/enums/common'
import {
  COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMLISTBYLCB, // 系统列表
  COLLEGE_API_INFRASTCOURSEBASIC_COLLEGELISTBYLCB, // 学院列表
  COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYCOLLEGE, // 珠宝学院(课程分类) - 下拉框
  COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYSYSTEM, // 系统培训(所属系统) - 下拉框
  COLLEGE_API_INFRASTSUBJECTITEM_CREATE, // 管控中心 - 专题管理 - 添加专题
  COLLEGE_API_SETTINGSOLUTIONITEM_CREATE // 管控平台 - 方案管理明细 - 创建
} from '@/apis/science'
import pagination from '@/components/pagination'
export default {
  props: {
    title: {
      type: String,
      default: '增加文章'
    },
    topicIf: {
      type: Boolean,
      default: true
    },
    id: {
      type: [Number, String]
    },
    visibleAddTopicPlan: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      theTopicIf: this.topicIf,
      theId: this.id,
      succ: false,
      yNStatus: YNStatus,
      infrastCourseType: InfrastCourseType,
      infrastCourseChannelType: InfrastCourseChannelType,
      InfrastCourseState: InfrastCourseState,
      visible: this.visibleAddTopicPlan,
      bodyLoading: false,
      collegeDrown: [],
      allSys: [],
      category: ['0', '0'],
      queryForm: {
        CourseTitle: '',
        LargeId: '',
        SmallId: '',
        PageSize: 20,
        PageIndex: 1
      },
      selectData: [],
      channelType: InfrastCourseChannelType.College,
      total: 0,
      data: []
    }
  },
  watch: {
    visible() {
      this.$emit('listenVisibleAddTopicPlan', this.succ)
    }
  },
  mounted() {
    this.getCollegeDrown()
    this.getSystemDrown()
    this.onSearch()
  },
  methods: {
    getData(obj) {
      this.bodyLoading = true
      if (this.channelType == InfrastCourseChannelType.College) {
        COLLEGE_API_INFRASTCOURSEBASIC_COLLEGELISTBYLCB(
          Object.assign(
            {},
            {
              State: InfrastCourseState.Audit,
              CourseTitle: this.queryForm.CourseTitle,
              PageIndex: this.queryForm.PageIndex,
              PageSize: this.queryForm.PageSize
            },
            obj
          )
        )
          .then(res => {
            this.bodyLoading = false
            if (res.data.Code === 'CORRECT') {
              this.data = res.data.Data.Subset
              this.total = res.data.Data.Count
            }
          })
          .catch(() => {
            this.bodyLoading = false
          })
      } else {
        COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMLISTBYLCB(
          Object.assign(
            {},
            {
              State: InfrastCourseState.Audit,
              CourseTitle: this.queryForm.CourseTitle,
              PageIndex: this.queryForm.PageIndex,
              PageSize: this.queryForm.PageSize
            },
            obj
          )
        )
          .then(res => {
            this.bodyLoading = false
            if (res.data.Code === 'CORRECT') {
              this.data = res.data.Data.Subset
              this.total = res.data.Data.Count
            }
          })
          .catch(() => {
            this.bodyLoading = false
          })
      }
    },
    saveData() {
      if (this.selectData.length === 0) {
        this.$message.error('请先选择课程')
        return
      }
      this.$store.commit('SET_BTN_LOADING', true)
      let arr = []
      this.selectData.forEach(item => {
        arr.push(item.CourseId)
      })
      if (this.theTopicIf) {
        COLLEGE_API_INFRASTSUBJECTITEM_CREATE({
          SubjectId: this.theId,
          CourseIds: arr.join(',')
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.succ = true
            this.visible = false
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      } else {
        COLLEGE_API_SETTINGSOLUTIONITEM_CREATE({
          SolutionId: this.theId,
          CourseIds: arr.join(',')
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.succ = true
            this.visible = false
          }
          this.$store.commit('SET_BTN_LOADING', false)
        })
      }
    },
    selectChange(selection) {
      this.selectData = selection
    },
    toggleSelection(row) {
      this.$refs.addTopicPlan.toggleRowSelection(row)
    },
    channelTypeChange() {
      if (this.channelType == InfrastCourseChannelType.College) {
        this.getData({
          SmallId: this.category[1] || 0,
          LargeId: this.category[0] || 0
        })
      } else {
        this.getData({
          LargeId: this.category[0] || 0,
          SmallId: 0
        })
      }
    },
    onSearchSp() {
      this.queryForm.PageIndex = 1
      this.queryForm.PageSize = 20
      this.queryForm.CourseTitle = ''
      if (this.channelType == InfrastCourseChannelType.College) {
        this.category[0] = '0'
        this.category[1] = '0'
      } else {
        this.category[0] = '0'
      }
      this.channelTypeChange()
    },
    onSearch() {
      this.queryForm.PageIndex = 1
      this.channelTypeChange()
    },
    currentChange(val) {
      this.queryForm.PageIndex = val
      this.channelTypeChange()
    },
    sizeChange(val) {
      this.queryForm.PageIndex = 1
      this.queryForm.PageSize = val
      this.channelTypeChange()
    },
    getCollegeDrown() {
      COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYCOLLEGE().then(res => {
        if (res.data.Code === 'CORRECT') {
          let arr = [
            {
              value: '0',
              label: '所有课程',
              disabled: false
            }
          ]
          res.data.Data.Subset.forEach(item => {
            if (item.ParentId == 0) {
              arr.push(
                Object.assign(
                  {
                    value: item.DictId + '',
                    label: item.DictName,
                    disabled: false
                  },
                  item
                )
              )
            }
          })
          let collegeDrown = this.initCollegeDrown(arr, res.data.Data.Subset)
          for (let i = 0; i < collegeDrown.length; i++) {
            if (!collegeDrown[i].children && collegeDrown[i].value != '0') {
              collegeDrown.splice(i, 1)
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
          if (item.DictId === a.ParentId) {
            objs.push(
              Object.assign(
                {
                  value: a.DictId + '',
                  label: a.DictName,
                  disabled: false
                },
                a
              )
            )
          }
        })
        if (objs.length) {
          item.children = this.initCollegeDrown(objs, oldArr)
        }
      })
      return arr
    },
    getSystemDrown() {
      COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYSYSTEM().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.allSys = res.data.Data.Subset
        }
      })
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