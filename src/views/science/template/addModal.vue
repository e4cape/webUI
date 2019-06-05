<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="800px"
      class="add-modal"
    >
      <div class="m-b-10">
        请选择链接内容：
      </div>
      <el-table
        v-if="this.modifyLinkIf"
        v-loading="$store.getters.tb_loading"
        :data="tableData"
        @current-change="handleCurrentChange"
        highlight-current-row
      >
        <template v-if="title=='添加(专题推荐)'">
          <el-table-column
            prop="SubjectId"
            label="ID"
            width="55"
            show-overflow-tooltip
            fixed="left"
          ></el-table-column>
          <el-table-column
            prop="Title"
            label="专题名称"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="ItemQty"
            label="文档数量"
            width="100"
            show-overflow-tooltip
          ></el-table-column>
        </template>
        <template v-else>
          <el-table-column
            prop="CourseId"
            label="ID"
            width="55"
            show-overflow-tooltip
            fixed="left"
          ></el-table-column>
          <el-table-column
            label="标题"
            prop="CourseTitle"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            v-if="title == '添加(系统培训)'"
            label="所属系统"
            width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{scope.row.LargeName + (scope.row.SmallName ? '>' + scope.row.SmallName : '')}}
            </template>
          </el-table-column>
          <el-table-column
            v-else
            label="分类"
            width="180"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{scope.row.LargeName + (scope.row.SmallName ? '>' + scope.row.SmallName : '')}}
            </template>
          </el-table-column>
          <el-table-column
            label="类型"
            prop="CourseType"
            width="80"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{EnumInfrastCourseType.Types[scope.row.CourseType]}}
            </template>
          </el-table-column>
        </template>
        <el-table-column
          prop="CreateTime"
          label="创建时间"
          width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{scope.row.CreateTime | filterDateTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="CreateUser"
          label="创建人"
          width="100"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <el-table
        v-else
        v-loading="$store.getters.tb_loading"
        :data="tableData"
        @selection-change="selectChange"
        @row-click="toggleSelection"
        ref="addModalTb"
      >
        <el-table-column
          type="selection"
          width="40"
        ></el-table-column>
        <template v-if="title=='添加(专题推荐)'">
          <el-table-column
            prop="SubjectId"
            label="ID"
            width="50"
            show-overflow-tooltip
            fixed="left"
          ></el-table-column>
          <el-table-column
            prop="Title"
            label="专题名称"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="ItemQty"
            label="文档数量"
            width="100"
            show-overflow-tooltip
          ></el-table-column>
        </template>
        <template v-else>
          <el-table-column
            prop="CourseId"
            label="ID"
            width="55"
            show-overflow-tooltip
            fixed="left"
          ></el-table-column>
          <el-table-column
            label="标题"
            prop="CourseTitle"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            v-if="title == '添加(系统培训)'"
            label="所属系统"
            width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{scope.row.LargeName + (scope.row.SmallName ? '>' + scope.row.SmallName : '')}}
            </template>
          </el-table-column>
          <el-table-column
            v-else
            label="分类"
            width="180"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{scope.row.LargeName + (scope.row.SmallName ? '>' + scope.row.SmallName : '')}}
            </template>
          </el-table-column>
          <el-table-column
            label="类型"
            prop="CourseType"
            width="80"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{EnumInfrastCourseType.Types[scope.row.CourseType]}}
            </template>
          </el-table-column>
        </template>
        <el-table-column
          prop="CreateTime"
          label="创建时间"
          width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{scope.row.CreateTime | filterDateTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="CreateUser"
          label="创建人"
          width="100"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <pagination
        :pg="PageIndex"
        :size="PageSize"
        :total="total"
        @currentChange="currentChange"
        @sizeChange="sizeChange"
      ></pagination>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          v-if="this.modifyLinkIf"
          name="btnSubmitModify"
          type="primary"
          @click="modifySave"
          :loading="$store.getters.is_loading"
        >确 定</el-button>
        <el-button
          v-else
          name="btnSubmit"
          type="primary"
          @click="addSave"
          :loading="$store.getters.is_loading"
        >确 定</el-button>
        <el-button
          name="btnCancel"
          @click="visible = false"
        >取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  COLLEGE_API_SUSTAINRECMT_CREATE, // 添加(专题推荐/系统培训/珠宝学院)
  COLLEGE_API_SUSTAINADVERT_UPDATE, // 广告管理-修改
  COLLEGE_API_INFRASTSUBJECTBASIC_GETS, // 管控中心 - 专题管理 - 列表
  COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMLISTBYLCB, // 系统列表
  COLLEGE_API_INFRASTCOURSEBASIC_COLLEGELISTBYLCB // 学院列表
} from '@/apis/science'

import {
  InfrastCourseType,
  SustainRecmtType,
  InfrastCourseState
} from '@/enums/science'

import pagination from '@/components/pagination'

export default {
  props: {
    visibleAddModal: {
      type: Boolean,
      default: false
    },
    title: {
      type: String
    },
    modifyLinkIf: {
      // 是否是修改链接用
      type: Boolean
    },
    modifyObj: {
      // 点击下一步时数据
      type: Object
    }
  },
  data() {
    return {
      visible: this.visibleAddModal,
      tableData: [],
      PageIndex: 1,
      PageSize: 20,
      total: 0,
      succ: false,
      selectData: '', // 选中id
      // 修改链接
      currentRow: null, // 选中行
      linkTitle: '', // 链接标题
      linkUrl: '' // 链接网址
    }
  },
  computed: {
    EnumInfrastCourseType() {
      return InfrastCourseType
    },
    EnumSustainRecmtType() {
      return SustainRecmtType
    }
  },
  watch: {
    visible() {
      this.$emit('listenVisibleAddModal', this.succ)
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      const param = {
        PageIndex: this.PageIndex,
        PageSize: this.PageSize
      }
      this.$store.commit('SET_TB_LOADING', true)
      if (this.title == '添加(系统培训)') {
        COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMLISTBYLCB(
          Object.assign({}, param, {
            State: InfrastCourseState.Audit
          })
        ).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.tableData = res.data.Data.Subset
            this.total = res.data.Data.Count
          }
          this.$store.commit('SET_TB_LOADING', false)
        })
      } else if (this.title == '添加(珠宝学院)') {
        COLLEGE_API_INFRASTCOURSEBASIC_COLLEGELISTBYLCB(
          Object.assign({}, param, {
            State: InfrastCourseState.Audit
          })
        ).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.tableData = res.data.Data.Subset
            this.total = res.data.Data.Count
          }
          this.$store.commit('SET_TB_LOADING', false)
        })
      } else {
        COLLEGE_API_INFRASTSUBJECTBASIC_GETS(param).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.tableData = res.data.Data.Subset
            this.total = res.data.Data.Count
          }
          this.$store.commit('SET_TB_LOADING', false)
        })
      }
    },
    addSave() {
      this.$store.commit('SET_BTN_LOADING', true)
      let RecmtType = null,
        SubjectIds = '',
        CourseIds = ''
      if (this.title == '添加(系统培训)') {
        RecmtType = SustainRecmtType.System
        CourseIds = this.selectData
      } else if (this.title == '添加(珠宝学院)') {
        RecmtType = SustainRecmtType.College
        CourseIds = this.selectData
      } else {
        RecmtType = SustainRecmtType.Subject
        SubjectIds = this.selectData
      }
      if (this.selectData.length < 1) {
        this.$message.warning('请最少勾选一个')
        this.$store.commit('SET_BTN_LOADING', false)
        return false
      }
      const param = {
        RecmtType,
        SubjectIds,
        CourseIds
      }
      COLLEGE_API_SUSTAINRECMT_CREATE(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.succ = true
          this.visible = false
        } else {
          this.$message.error(res.data.Message)
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    currentChange(val) {
      this.PageIndex = val
      this.getData()
    },
    sizeChange(val) {
      this.PageIndex = 1
      this.PageSize = val
      this.getData()
    },
    selectChange(selection) {
      if (this.title == '添加(专题推荐)') {
        this.selectData = selection.map(item => item.SubjectId).join()
      } else {
        this.selectData = selection.map(item => item.CourseId).join()
      }
    },
    toggleSelection(row) {
      this.$refs.addModalTb.toggleRowSelection(row)
    },
    // 修改链接
    handleCurrentChange(row) {
      if (this.title == '添加(专题推荐)') {
        this.linkTitle = row.Title
        this.linkUrl = `/science/lively/livelyCheck?id=${row.SubjectId}`
      } else {
        this.linkTitle = row.CourseTitle
        if (row.CourseType == InfrastCourseType.Article) {
          this.linkUrl = `/science/videoCheck?id=${row.CourseId}&name=文章`
        } else {
          this.linkUrl = `/science/videoCheck?id=${row.CourseId}&name=视频`
        }
      }
    },
    modifySave() {
      const { AdvertId, OpenType, LinkType } = this.modifyObj
      this.$store.commit('SET_BTN_LOADING', true)
      const param = {
        AdvertId,
        OpenType,
        LinkType,
        LinkTitle: this.linkTitle,
        LinkUrl: this.linkUrl
      }
      COLLEGE_API_SUSTAINADVERT_UPDATE(param).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.succ = true
          this.visible = false
        } else {
          this.$message.error(res.data.Message)
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    }
  },
  components: {
    pagination
  }
}
</script>
<style lang="scss" scoped>
.add-modal {
  .pagination {
    margin: 15px 0 0 0;
    padding: 0;
  }
}
</style>
