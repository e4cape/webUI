<template>
  <section>
    <div class="panel new-panel">
      <div class="panel-hd" style="border-bottom: 0;">
        <span class="title">基本信息</span>
        <span class="title fr">
          <el-button name="btnModify" type="text" @click="visibleInfomationDialog = true">修改</el-button>
        </span>
      </div>
    </div>
    <div class="panel-bd m-b-10" v-loading="basicLoading">
      <div class="details-info-table cus">
        <table cellpadding="0" cellspacing="0">
          <tbody>
            <tr>
              <td class="tit">专题名称</td>
              <td>{{ basicInfo.Title }}</td>
              <td class="tit">创建</td>
              <td>{{ basicInfo.CreateUser }} {{basicInfo.CreateTime | filterDateTime}}</td>
            </tr>
            <tr>
              <td class="tit">专题封面</td>
              <td class="note">
                <img :src="$root.settings.DOMAIN_IMG_FILE+basicInfo.ImageUrl" alt>
              </td>
              <td class="tit">专题介绍</td>
              <td class="note">{{ basicInfo.Note }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="panel">
      <div class="panel-hd">
        <span class="title">专题内容</span>
      </div>
      <div class="p-10">
        <el-button class="m-b-10" type="primary" @click="visibleAddTopicPlan = true">添加</el-button>
        <el-table :data="tableData" v-loading="$store.getters.tb_loading">
          <el-table-column label="序号" prop="ItemId" width="55" show-overflow-tooltip></el-table-column>
          <el-table-column label="名称" prop="CourseTitle" show-overflow-tooltip></el-table-column>
          <el-table-column label="分类" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.LargeName + (scope.row.SmallName ? '>' + scope.row.SmallName : '')}}</template>
          </el-table-column>
          <el-table-column label="适用套餐" prop="PackName" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="类型" min-width="50" show-overflow-tooltip>
            <template slot-scope="scope">{{EnumInfrastCourseType.Types[scope.row.CourseType]}}</template>
          </el-table-column>
          <el-table-column label="创建时间" prop="CreateTime" min-width="100" show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.CreateTime | filterDateTime }}</template>
          </el-table-column>
          <el-table-column label="排序" align="center" width="200">
            <template slot-scope="scope">
              <sort-item :index="scope.$index" :source="tableData" :sort="(...args) => onTableDataSort(scope.row.ItemId, ...args)"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button name="btnDel" @click="del($event,scope.row.ItemId)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
      </div>
    </div>
    <editInformationDialog
      v-if="visibleInfomationDialog"
      title="修改专题"
      :visibleInfomationDialog="visibleInfomationDialog"
      :infoObj="basicInfo"
      @listenVisibleInfomationDialog="listenVisibleInfomationDialog"
    />
    <addTopicPlanModal v-if="visibleAddTopicPlan" :visibleAddTopicPlan="visibleAddTopicPlan" :id="$route.query.id" @listenVisibleAddTopicPlan="listenVisibleAddTopicPlan"/>
  </section>
</template>

<script>
import {
  COLLEGE_API_INFRASTSUBJECTBASIC_GET, // 课程专题 - 详情
  COLLEGE_API_INFRASTSUBJECTITEM_GETS, // 专题管理 - 详情(明细列表)
  COLLEGE_API_INFRASTSUBJECTITEM_SORT, // 专题管理 - 排序
  COLLEGE_API_INFRASTSUBJECTITEM_DELETE // 专题管理 - 删除
} from '@/apis/science'

import { InfrastCourseType, InfrastCourseChannelType } from '@/enums/science'

import editInformationDialog from './editInformationDialog'
import sortItem from '../template/sortOrderItem'
import addTopicPlanModal from '../template/addTopicPlanModal'

import pagination from '@/components/pagination.vue'

export default {
  data() {
    return {
      basicInfo: {}, // 基本信息
      basicLoading: false, // 基本信息loading
      visibleInfomationDialog: false, // 修改显隐
      visibleAddTopicPlan: false,
      isModifying: false,
      isAdding: false,
      isPulling: false,
      // 表格分页相关
      form: {
        SubjectId: this.$route.query.id,
        PageIndex: 1,
        PageSize: 20
      },
      parameter: {},
      tableData: [],
      total: 0
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    EnumInfrastCourseType() {
      return InfrastCourseType
    },
    EnumInfrastCourseChannelType() {
      return InfrastCourseChannelType
    }
  },
  watch: {
    $route: 'init'
  },
  mounted() {
    this.getBasicInfo()
    this.init()
  },
  methods: {
    // 获取基本信息
    getBasicInfo() {
      this.basicLoading = true
      COLLEGE_API_INFRASTSUBJECTBASIC_GET({
        SubjectId: this.$route.query.id
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.basicInfo = res.data.Data
        }
        this.basicLoading = false
      })
    },
    listenVisibleInfomationDialog(succ) {
      if (succ) {
        this.getBasicInfo()
      }
      this.visibleInfomationDialog = false
    },
    listenVisibleAddTopicPlan(succ) {
      if (succ) {
        this.getData()
      }
      this.visibleAddTopicPlan = false
    },
    // 表格分页相关
    init() {
      const { query } = this.$route
      this.parameter.PageIndex = query.PageIndex || 1
      this.parameter.PageSize = query.PageSize || 20
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: `/science/topic/edit?id=${this.$route.query.id}`,
        query: this.parameter
      })
    },
    currentChange(val) {
      this.parameter.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      this.parameter.PageIndex = 1
      this.parameter.PageSize = val
      this.initRoute()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      this.form = Object.assign(this.form, this.parameter)
      COLLEGE_API_INFRASTSUBJECTITEM_GETS(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Subset
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    onTableDataSort(ItemId, sortObj) {
      this.$store.commit('SET_TB_LOADING', true)
      COLLEGE_API_INFRASTSUBJECTITEM_SORT({
        MoveType: sortObj.ope,
        ItemId
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.getData()
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    // 专题删除
    del(e, ItemId) {
      e.currentTarget.blur()
      this.$confirm('您正在进行删除操作，删除后不可恢复！确定删除?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        COLLEGE_API_INFRASTSUBJECTITEM_DELETE({ ItemId: ItemId }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message.success('已删除！')
            this.getData()
          }
          this.$store.commit('SET_FULL_LOADING', false)
        })
      })
    }
  },
  components: {
    pagination,
    editInformationDialog,
    sortItem,
    addTopicPlanModal
  }
}
</script>

<style lang="scss" scoped>
.cus {
  margin: 10px 0;
  .tit {
    min-width: 80px;
  }
  .note {
    min-width: 120px;
  }
  img {
    display: block;
    width: 200px;
    height: 112.5px;
    margin: 10px 0;
  }
}
</style>
