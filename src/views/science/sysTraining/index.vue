
<template>
  <div class="sys-training">
    <el-form :model="form" ref="search" label-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-button name="btnVisibleDocVideoModal" type="primary" @click="docVideoNew(EnumInfrastCourseType.Article)">新建文档</el-button>
          </el-form-item>
        </template>
        <template slot="btnBox">
          <el-form-item>
            <el-button name="btnVisibleDocVideoModal" type="primary" @click="docVideoNew(EnumInfrastCourseType.Video)">新建视频</el-button>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-select name="selectState" v-model="form.State" @change="onSimpleSearch">
              <el-option label="所有状态" :value="0"></el-option>
              <el-option v-for="item in EnumInfrastCourseState.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input name="inputOnSearch" v-model="form.CourseTitle" placeholder="标题" :maxlength="50" @keyup.native.enter="onSearch">
              <el-button name="btnOnSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item name="btnTitle" label="标题：" :maxlength="50" prop="CourseTitle" @keyup.native.enter="onSearch">
            <el-input name="inputCourseTitle" v-model="form.CourseTitle"></el-input>
          </el-form-item>
          <el-form-item label="所属系统：" prop="LargeId">
            <el-select name="selectLargeId" v-model="form.LargeId">
              <el-option label="全部" :value="0"></el-option>
              <el-option v-for="item in systemArr" :key="item.DictId" :label="item.DictName" :value="item.DictId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：" prop="State">
            <el-select name="selectState" v-model="form.State">
              <el-option label="所有状态" :value="0"></el-option>
              <el-option v-for="item in EnumInfrastCourseState.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" v-loading="$store.getters.tb_loading">
      <el-table-column label="序号" prop="CourseId" min-width="50" show-overflow-tooltip fixed="left"></el-table-column>
      <el-table-column label="标题" prop="CourseTitle" min-width="200" show-overflow-tooltip fixed="left"></el-table-column>
      <el-table-column label="适用套餐" prop="PackName" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{packObj[scope.row.PackId]}}</template>
      </el-table-column>
      <el-table-column label="所属系统" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.LargeName + (scope.row.SmallName ? '>' + scope.row.SmallName : '')}}</template>
      </el-table-column>
      <el-table-column label="类型" prop="CourseType" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{EnumInfrastCourseType.Types[scope.row.CourseType]}}</template>
      </el-table-column>
      <el-table-column label="是否考试" prop="IsPaper" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{EnumYNStatus.Types[scope.row.IsPaper]}}</template>
      </el-table-column>
      <el-table-column label="创建时间" prop="CreateTime" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.CreateTime | filterDateTime }}</template>
      </el-table-column>
      <el-table-column label="创建人" prop="CreateUser" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" prop="State" width="100">
        <template slot-scope="scope">{{EnumInfrastCourseState.Types[scope.row.State]}}</template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button
            name="btnLook"
            v-if="scope.row.CourseType == EnumInfrastCourseType.Article"
            @click="$router.push(`/science/sysTraining/docDetail?id=${scope.row.CourseId}`)"
            type="text"
            size="small"
          >详情</el-button>
          <el-button name="btnLook" v-else @click="$router.push(`/science/sysTraining/videoDetail?id=${scope.row.CourseId}`)" type="text" size="small">详情</el-button>
          <el-button name="btnAudit" v-if="scope.row.State == EnumInfrastCourseState.Wait" type="text" size="small" @click="audit(scope.row)">审核</el-button>
          <el-button name="btnAudit" v-if="scope.row.State == EnumInfrastCourseState.Audit" type="text" size="small" @click="auditCancel(scope.row)">取消审核</el-button>
          <template v-if="scope.row.State == EnumInfrastCourseState.Draft || scope.row.State == EnumInfrastCourseState.Reject || scope.row.State == EnumInfrastCourseState.Cancel">
            <el-button
              name="btnEditDoc"
              v-if="scope.row.CourseType == EnumInfrastCourseType.Article"
              @click="$router.push(`/science/sysTraining/docEdit?id=${scope.row.CourseId}`)"
              type="text"
              size="small"
            >编辑</el-button>
            <el-button name="btnEdiVideo" v-else @click="$router.push(`/science/sysTraining/videoEdit?id=${scope.row.CourseId}`)" type="text" size="small">编辑</el-button>
            <el-button name="btnInvalid" type="text" size="small" @click="invalid(scope.row)">作废</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <docVideoModal v-if="visibleDocVideoModal" :visibleDocVideoModal="visibleDocVideoModal" @listenVisibleDocVideoModal="listenVisibleDocVideoModal" :title="title" :courseType="courseType"/>
    <auditModal
      v-if="visibleAuditModal"
      @listenVisibleAuditModal="listenVisibleAuditModal"
      :channelType="EnumInfrastCourseChannelType.System"
      :visibleAuditModal="visibleAuditModal"
      :auditObj="auditObj"
    ></auditModal>
    <invalidCancelModal
      v-if="visibleInvalidCancelModal"
      :visibleInvalidCancelModal="visibleInvalidCancelModal"
      @listenVisibleInvalidCancelModal="listenVisibleInvalidCancelModal"
      :title="title"
      :apiName="apiName"
      :invalidCancelObj="invalidCancelObj"
    />
  </div>
</template>
<script>
import {
  COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMLISTBYLCB, // 系统列表
  COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYSYSTEM, // 所属系统 - 下拉框
  COLLEGE_API_SETTINGPACK_DROPDOWNLIST // 套餐下拉框
} from '@/apis/science'

import { YNStatus } from '@/enums/common'
import {
  InfrastCourseState,
  InfrastCourseType,
  InfrastCourseChannelType
} from '@/enums/science'

import searchPanel from '@/components/searchPanel'
import pagination from '@/components/pagination'
import docVideoModal from '../template/docVideoModal'
import auditModal from '../template/auditModal'
import invalidCancelModal from '../template/invalidCancelModal'

export default {
  data() {
    return {
      visibleDocVideoModal: false, // 新建文档(基本信息)、新建视频(基本信息)显隐
      courseType: '', // 课程类型
      visibleInvalidCancelModal: false, // 作废或取消审核显隐
      title: '', // 作废或取消审核,或者新建文档(基本信息)、新建视频(基本信息)
      visibleAuditModal: false, // 审核显隐
      auditObj: {}, // 审核信息
      apiName: '', // 调用的接口名字
      invalidCancelObj: {}, // 作废或取消审核弹窗信息
      systemArr: [], // 所属系统
      packObj: null, // 套餐数组格式转化为{id：Name}形式的对象
      // 表格分页相关
      form: {
        CourseTitle: '', // 课程标题
        SmallId: 0, // 小类序号
        LargeId: 0, // 大类序号
        State: 0, // 状态(枚举)
        PageIndex: 1,
        PageSize: 20
      },
      parameter: {},
      tableData: [],
      total: 0
    }
  },
  computed: {
    EnumYNStatus() {
      return YNStatus
    },
    EnumInfrastCourseState() {
      return InfrastCourseState
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
  async mounted() {
    this.$store.commit('SET_TB_LOADING', true)
    const packObj = await COLLEGE_API_SETTINGPACK_DROPDOWNLIST().then(res => {
      if (res.data.Code == 'CORRECT') {
        let obj = {}
        for (let item of res.data.Data.Subset) {
          obj[item.PackId] = item.PackName
        }
        return obj
      }
    })
    if (packObj) {
      this.packObj = packObj
      this.init()
    } else {
      this.$store.commit('SET_TB_LOADING', true)
    }
  },
  methods: {
    // 所属系统
    getSystemArr() {
      COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYSYSTEM().then(res => {
        if (res.data.Code == 'CORRECT') {
          this.systemArr = res.data.Data.Subset
        }
      })
    },
    // 表格分页相关
    async init() {
      await this.getSystemArr()
      const { query } = this.$route
      this.parameter.CourseTitle = query.CourseTitle || ''
      this.parameter.SmallId = +query.SmallId || 0
      this.parameter.LargeId = +query.LargeId || 0
      this.parameter.State = query.State > 0 ? query.State : 0
      this.parameter.PageIndex = query.PageIndex || 1
      this.parameter.PageSize = query.PageSize || 20
      this.getData()
    },
    initRoute() {
      this.$router.replace({
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
    onSearch() {
      this.form.PageIndex = 1
      this.parameter = Object.assign({}, this.form)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      this.$refs['search'].resetFields()
      this.form.State = 0
      this.onSearch()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      this.form = Object.assign(this.form, this.parameter)
      COLLEGE_API_INFRASTCOURSEBASIC_SYSTEMLISTBYLCB(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Subset
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    onSimpleSearch(e) {
      this.parameter.State = e
      this.onSearch()
    },
    // 新建文档、新建视频
    docVideoNew(p) {
      if (p === InfrastCourseType.Article) {
        this.title = '新建文档(基本信息)'
        this.courseType = p
      }
      if (p === InfrastCourseType.Video) {
        this.title = '新建视频(基本信息)'
        this.courseType = p
      }
      this.visibleDocVideoModal = true
    },
    listenVisibleDocVideoModal(succ, id) {
      if (succ) {
        if (this.courseType === InfrastCourseType.Article) {
          this.$router.push(
            `/science/sysTraining/docEdit?id=${id}`
          )
        } else {
          this.$router.push(
            `/science/sysTraining/videoEdit?id=${id}`
          )
        }
      }
      this.visibleDocVideoModal = false
    },
    // 审核
    audit(row) {
      this.visibleAuditModal = true
      this.auditObj = row
    },
    listenVisibleAuditModal(succ) {
      if (succ) {
        this.getData()
      }
      this.visibleAuditModal = false
    },
    // 作废、取消审核
    invalid(row) {
      this.title = '作废'
      this.apiName = 'COLLEGE_API_INFRASTCOURSEBASIC_ABANDONSYSTEM'
      this.invalidCancelObj = row
      this.visibleInvalidCancelModal = true
    },
    auditCancel(row) {
      this.title = '取消审核'
      this.apiName = 'COLLEGE_API_INFRASTCOURSEBASIC_CANCELSYSTEM'
      this.invalidCancelObj = row
      this.visibleInvalidCancelModal = true
    },
    listenVisibleInvalidCancelModal(succ) {
      if (succ) {
        this.getData()
      }
      this.visibleInvalidCancelModal = false
    }
  },
  components: {
    searchPanel,
    pagination,
    docVideoModal,
    auditModal,
    invalidCancelModal
  }
}
</script>

