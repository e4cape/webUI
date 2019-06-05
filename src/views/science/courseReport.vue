<template>
  <section>
    <div>
      <el-form :model="queryForm" ref="search" label-width="120px" class="item-lh-26" :inline="true">
        <search-panel @onSearch="onSearch" @onReset="onReset">
          <template slot="simpleSearch">
            <el-form-item>
              <el-input name="inputOnSearch" v-model="queryForm.CourseTitle" placeholder="标题" @keyup.native.enter="onSearch">
                <el-button name="btnOnSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
              </el-input>
            </el-form-item>
          </template>
          <template slot="seniorSearch">
            <el-form-item label="分类：" prop="ChannelType">
              <categories-cascader :value.sync="queryForm.categoryId" />
            </el-form-item>
            <el-form-item label="类型：" prop="CourseType">
              <el-select v-model="queryForm.CourseType" placeholder="请选择">
                <el-option label="全部" value="0"></el-option>
                <el-option v-for="option in infrastCourseType.TypeArray" :key="option.KeyId" :label="option.Value" :value="option.KeyId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标题：" prop="CourseTitle">
              <el-input v-model="queryForm.CourseTitle" @keyup.native.enter="onSearch" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item name="datePickerCreateTime" label="创建时间：">
              <el-date-picker
                v-model="queryForm.CreateTime"
                value-format="yyyy-MM-dd"
                type="daterange"
                align="left"
                unlink-panels
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="$root.datePickerOptions"
              ></el-date-picker>
            </el-form-item>
          </template>
        </search-panel>
      </el-form>
    </div>
    <div>
      <el-table :data="tableData" @sort-change="onSortChange" v-loading="$store.getters.tb_loading" :default-sort="defaultSort" style="width: 100%" max-height="780">
        <el-table-column show-overflow-tooltip width="50" fixed prop="CourseId" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="CourseTitle" fixed min-width="180" label="标题"></el-table-column>
        <el-table-column show-overflow-tooltip prop="CreateTime" sortable min-width="120" label="创建时间">
          <template slot-scope="scope">
            {{scope.row.CreateTime | filterDateTime}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ChannelType" min-width="80" label="栏目">
          <template slot-scope="scope">
            {{infrastCourseChannelType.Types[scope.row.ChannelType]}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="CategoryStr" min-width="180" label="分类">
          <template slot-scope="scope">
            {{scope.row.LargeName + (scope.row.SmallName ? '>' + scope.row.SmallName : '')}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="CourseTypeStr" min-width="50" label="类型">
          <template slot-scope="scope">
            {{infrastCourseType.Types[scope.row.CourseType]}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="HitsAmt" width="80" sortable label="点击量"></el-table-column>
        <el-table-column show-overflow-tooltip prop="ViewAmt" width="100" sortable label="浏览人数"></el-table-column>
        <el-table-column show-overflow-tooltip prop="LikeAmt" width="80" sortable label="点赞"></el-table-column>
        <el-table-column show-overflow-tooltip prop="ExamAmt" width="100" sortable label="考试次数"></el-table-column>
        <el-table-column show-overflow-tooltip prop="PassAmt" width="100" sortable label="合格次数"></el-table-column>
        <el-table-column show-overflow-tooltip prop="PassRank" min-width="80" sortable label="合格率">
          <template slot-scope="scope">
            {{(scope.row.PassRank / 10000).toFixed(2)}}%
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"/>
  </section>
</template>

<script>
import { COLLEGE_API_INFRASTCOURSEBASIC_REPORTLIST } from '@/apis/science'
import { InfrastCourseType, InfrastCourseChannelType } from '@/enums/science'
import { YNStatus } from '@/enums/common'
import pagination from '@/components/pagination'
import searchPanel from '@/components/searchPanel'
import dayjs from 'dayjs'
import categoriesCascader from './template/categoriesCascader'

function dateFormat(dayjsInstance) {
  return dayjsInstance.format('YYYY-MM-DD HH:mm:ss')
}

export default {
  components: {
    pagination,
    searchPanel,
    categoriesCascader
  },
  data() {
    return this.originData()
  },
  methods: {
    originData() {
      const defaultDate = dayjs('1900-01-01')
      return {
        categories: [],
        allCategory: {
          DictId: 0,
          DictName: '所有分类'
        },
        infrastCourseType: InfrastCourseType,
        infrastCourseChannelType: InfrastCourseChannelType,
        categoryList: [],
        tableData: [],
        queryForm: {
          PageIndex: 1,
          PageSize: 20,
          ChannelType: 0,
          CourseType: '0',
          CourseTitle: '',
          categoryId: [0],
          CreateTime1: dateFormat(defaultDate.startOf('day')),
          CreateTime2: dateFormat(defaultDate.endOf('day')),
          LargeId: 0,
          SmallId: 0,
          Orderby: 0,
          IsAsced: YNStatus.No
        },
        total: 0
      }
    },
    onReset() {
      this.queryForm = this.originData().queryForm
      this.onSearch()
    },
    onSearch() {
      this.queryForm.PageIndex = 1
      this.getData()
    },
    onSortChange(sort) {
      this.queryForm.order = sort.order
      this.queryForm.prop = sort.prop
      this.onSearch()
    },
    currentChange(val) {
      this.queryForm.PageIndex = val
      this.getData()
    },
    sizeChange(val) {
      this.queryForm.PageIndex = 1
      this.queryForm.PageSize = val
      this.getData()
    },
    getDataFromUrl() {
      if (Object.keys(this.$route.query).length > 0) {
        this.queryForm = {
          ...this.$route.query
        }
        this.queryForm.categoryId = [
          +this.queryForm.ChannelType || 0,
          +this.queryForm.LargeId || 0,
          +this.queryForm.SmallId || 0
        ]
      }
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      let parameter = {
        ...this.queryForm
      }

      if (parameter.CreateTime) {
        parameter = {
          ...parameter,
          CreateTime1: dateFormat(
            dayjs(parameter.CreateTime[0]).startOf('day')
          ),
          CreateTime2: dateFormat(dayjs(parameter.CreateTime[1]).endOf('day'))
        }

        delete parameter.CreateTime
      }

      if (parameter.prop) {
        let result
        // 排序字段(0=创建时间, 1=点击次数, 2=浏览人数, 3=点赞, 4=考试次数, 5=合格次数, 6=合格人数, 7=合格率);
        switch (parameter.prop) {
          case 'CreateTime':
            result = 0
            break
          case 'HitsAmt':
            result = 1
            break
          case 'ViewAmt':
            result = 2
            break
          case 'LikeAmt':
            result = 3
            break
          case 'ExamAmt':
            result = 4
            break
          case 'PassAmt':
            result = 5
            break
          // 合格人数 case
          case 'PassRank':
            result = 7
            break
          default:
            result = 0
            break
        }
        parameter = {
          ...parameter,
          IsAsced: parameter.order === 'ascending' ? YNStatus.Yes : YNStatus.No,
          Orderby: result
        }
      } else {
        parameter = {
          ...parameter,
          IsAsced: YNStatus.No,
          Orderby: 0
        }
      }
      delete parameter.categoryId
      delete parameter.order
      delete parameter.prop
      COLLEGE_API_INFRASTCOURSEBASIC_REPORTLIST(parameter).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.tableData = res.data.Data.Subset
          this.total = res.data.Data.Count
        }
      })
    }
  },
  computed: {
    defaultSort() {
      return this.queryForm
    }
  },
  watch: {
    'queryForm.categoryId': {
      deep: true,
      handler(selection) {
        const props = ['ChannelType', 'LargeId', 'SmallId']
        const self = this
        props.forEach((item, index) => {
          self.queryForm[item] = selection[index] || 0
        })
      }
    }
  },
  created() {
    this.getDataFromUrl()
  },
  mounted() {
    this.getData()
  }
}
</script>

