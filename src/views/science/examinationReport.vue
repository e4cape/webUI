
<template>
  <div>
    <el-form
      :model="form"
      ref="search"
      label-width="120px"
      class="item-lh-26"
      :inline="true"
    >
      <search-panel
        @onSearch="onSearch"
        @onReset="onReset"
      >
        <template slot="simpleSearch">
          <el-form-item>
            <el-input
              name="inputOnSearch"
              v-model="form.CourseTitle"
              placeholder="标题"
              @keyup.native.enter="onSearch"
            >
              <el-button
                name="btnOnSearch"
                slot="append"
                icon="el-icon-search"
                @click="onSearch"
              ></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item
            label="分类："
            prop="categoryArrSelect"
          >
            <el-cascader
              name="selectLargeId"
              :options="categoryArr"
              v-model="categoryArrSelect"
              :props="{value:'DictId',label:'DictName',children:'Children'}"
              change-on-select
              filterable
              @change="categoryArrChange"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item
            name="btnTitle"
            label="标题："
            prop="CourseTitle"
            @keyup.native.enter="onSearch"
          >
            <el-input
              name="inputCourseTitle"
              v-model="form.CourseTitle"
            ></el-input>
          </el-form-item>
          <el-form-item
            name="btnTitle"
            label="门店编码："
            prop="StoreCode"
            @keyup.native.enter="onSearch"
          >
            <el-input
              name="inputStoreCode"
              v-model="form.StoreCode"
            ></el-input>
          </el-form-item>
          <el-form-item
            name="btnTitle"
            label="门店名称："
            prop="StoreName"
            @keyup.native.enter="onSearch"
          >
            <el-input
              name="inputStoreName"
              v-model="form.StoreName"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="考试情况："
            prop="PassState"
          >
            <el-select
              name="selectPassState"
              v-model="form.PassState"
            >
              <el-option
                label="所有结果"
                :value="0"
              ></el-option>
              <el-option
                v-for="item in EnumEmployeeExamPaperPassState.TypeArray.filter(item=>item.KeyId == EnumEmployeeExamPaperPassState.Unpass|| item.KeyId == EnumEmployeeExamPaperPassState.Passed)"
                :key="item.KeyId"
                :label="item.Value"
                :value="item.KeyId"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table
      :data="tableData"
      @sort-change="sortChange"
      v-loading="$store.getters.tb_loading"
    >
      <el-table-column
        label="考试时间"
        prop="CreateTime"
        min-width="100"
        show-overflow-tooltip
        sortable
      >
        <template slot-scope="scope">{{ scope.row.CreateTime | filterDateTime }}</template>
      </el-table-column>
      <el-table-column
        label="考试员工"
        prop="TrueName"
        min-width="50"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="标题"
        prop="CourseTitle"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="分类"
        prop="memberCount"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{scope.row.LargeName + (scope.row.SmallName ? '>' + scope.row.SmallName : '')}}
        </template>
      </el-table-column>
      <el-table-column
        label="门店编码"
        prop="StoreCode"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="门店名称"
        prop="StoreName"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="考试分数"
        prop="Score"
        min-width="50"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="考试情况"
        prop="statusText"
        min-width="50"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{EnumEmployeeExamPaperPassState.Types[scope.row.PassState]}}
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :pg="form.PageIndex"
      :size="form.PageSize"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
  </div>
</template>
<script>
import {
  COLLEGE_API_EMPLOYEEEXAMPAPER_GETSBYREPORT, // 考试报表-列表
  COLLEGE_API_SETTINGDICTIONARY_GETS // 分类-下拉框
} from '@/apis/science'

import { YNStatus } from '@/enums/common'
import { EmployeeExamPaperPassState } from '@/enums/science'
import { getTreeSp } from './util'

import searchPanel from '@/components/searchPanel'
import pagination from '@/components/pagination'

export default {
  data() {
    return {
      categoryArr: [], // 所属课程
      categoryArrSelect: [0, 0, 0], // 选中分类，分别对应ChannelType、LargeId、SmallId
      // 表格分页相关
      form: {
        StoreCode: '', // 门店编码
        StoreName: '', // 门店名称
        CourseTitle: '', // 课程标题
        ChannelType: 0, // 频道类型
        SmallId: 0, // 小类序号
        LargeId: 0, // 大类序号
        PassState: '', // 考试结果(枚举)
        IsAsced: YNStatus.No,
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
    EnumEmployeeExamPaperPassState() {
      return EmployeeExamPaperPassState
    }
  },
  watch: {
    $route: 'init'
  },
  mounted() {
    this.init()
  },
  methods: {
    // 所属课程
    getCollegeArr() {
      const channelTypeArr = [
        // 第一级数据
        {
          DictId: 0,
          ParentId: '0',
          DictName: '全部'
        },
        {
          DictId: -1,
          ParentId: '0',
          DictName: '系统培训'
        },
        {
          DictId: -3,
          ParentId: '0',
          DictName: '珠宝学院'
        }
      ]
      COLLEGE_API_SETTINGDICTIONARY_GETS({
        DictType: 0
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          let arrBasic = res.data.Data.Subset.filter(
            // 去掉没有的频道类型数据
            item => !item.DictType == 0
          )
          let sourceArr = [...arrBasic, ...channelTypeArr]
          // 为了去掉珠宝学院里没有子级的项
          let tmpArr = getTreeSp(sourceArr, {
            id: 'DictId',
            parentId: 'ParentId',
            levelOnelVal: '0',
            children: 'Children',
            other: 'DictType'
          })
          let cArr = tmpArr[2].Children.filter(v => v.Children)
          tmpArr[2].Children = cArr
          this.categoryArr = tmpArr
        }
      })
    },
    // 分类change
    categoryArrChange(v) {
      console.log(v)
      this.form.ChannelType = Math.abs(v[0])
      this.form.LargeId = v[1]
      this.form.SmallId = v[2]
    },
    // 表格分页相关
    async init() {
      await this.getCollegeArr()
      const { query } = this.$route
      this.parameter.StoreCode = query.StoreCode || ''
      this.parameter.StoreName = query.StoreName || ''
      this.parameter.CourseTitle = query.CourseTitle || ''
      this.parameter.ChannelType = query.ChannelType || 0
      this.parameter.SmallId = query.SmallId || 0
      this.parameter.LargeId = query.LargeId || 0
      this.parameter.PassState = query.PassState > 0 ? query.PassState : 0
      this.parameter.PageIndex = query.PageIndex || 1
      this.parameter.PageSize = query.PageSize || 20
      if (query.ChannelType > 0) {
        this.categoryArrSelect = [
          -query.ChannelType || 0,
          +query.LargeId || 0,
          +query.SmallId || 0
        ]
      }
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
      this.categoryArrSelect = [0, 0, 0]
      this.form.ChannelType = 0
      this.form.LargeId = 0
      this.form.SmallId = 0
      this.form.PassState = 0
      this.onSearch()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      this.form = Object.assign(this.form, this.parameter)
      COLLEGE_API_EMPLOYEEEXAMPAPER_GETSBYREPORT(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Subset
          this.total = res.data.Data.Count
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    sortChange({ order }) {
      this.form.IsAsced = order == 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getData()
    }
  },
  components: {
    searchPanel,
    pagination
  }
}
</script>

