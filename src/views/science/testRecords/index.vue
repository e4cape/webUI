
<template>
  <div class="content">
    <el-form :model="queryForm" ref="onSearch" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <span class="red">默认查询近一周的记录</span>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-input name="CourseTitle" v-model="queryForm.CourseTitle" placeholder="请输入搜索标题" @keyup.enter.native="onSearch">
              <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="分类：">
            <el-cascader name="category" change-on-select :options="dectionarys" class="m-r-10" v-model="queryForm.category" filterable placeholder="所有分类">
            </el-cascader>
          </el-form-item>
          <el-form-item label="员工：">
            <el-select name="UserId" placeholder="所有员工" v-model="queryForm.UserId" filterable>
              <el-option label="所有员工" :value="'0'"></el-option>
              <template v-for="(item, index) in $store.getters.users">
                <el-option v-if="item.UserState === securityUserStates.Audit && item.TrueName" :key="index" :label="item.TrueName" :value="item.UserId.toString()"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="成绩：">
            <el-select name="PassState" placeholder="所有成绩" v-model="queryForm.PassState" :filterable="true">
              <el-option label="所有成绩" value="0"></el-option>
              <el-option label="不合格" :value="employeeExamPaperPassState.Unpass + ''"></el-option>
              <el-option label="合格" :value="employeeExamPaperPassState.Passed + ''"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题：">
            <el-input name="CourseTitle" v-model="queryForm.CourseTitle" @keyup.enter.native="onSearch" placeholder="请输入搜索标题"></el-input>
          </el-form-item>
          <el-form-item label="考试时间：">
            <el-date-picker name="CreateTime" :picker-options="$root.datePickerOptions" :unlink-panels="true" type="daterange" v-model="queryForm.CreateTime"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <el-table class="tabs-tb" :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="CreateTime" label="考试时间"  show-overflow-tooltip fixed>
        <template slot-scope="scope">
          {{scope.row.CreateTime | filterDateTime}}
        </template>
      </el-table-column>
      <el-table-column prop="CourseTitle" label="标题" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ChannelType" label="栏目" show-overflow-tooltip>
        <template slot-scope="scope">
          {{infrastCourseChannelType.Types[scope.row.ChannelType]}}
        </template>
      </el-table-column>
      <el-table-column prop="SmallName" label="分类" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.LargeName + (scope.row.SmallName ? '>' + scope.row.SmallName : '')}}
        </template>
      </el-table-column>
      <el-table-column prop="TotalScore" label="试卷分数" show-overflow-tooltip></el-table-column>
      <el-table-column prop="TrueName" label="考试员工" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Score" label="考试成绩" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ProductName" label="是否合格" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :class="{red: (scope.row.PassState == employeeExamPaperPassState.Unpass || scope.row.PassState == employeeExamPaperPassState.Cancel) }">{{employeeExamPaperPassState.Types[scope.row.PassState]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ProductName" label="操作" show-overflow-tooltip>
        <template slot-scope="scope">
          <router-link :to="{path:'/science/testRecords/testCheck?id=' + scope.row.PaperId}" class="btn-link el-button--text">查看考卷</router-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- @module 分页组件 -->
    <div class="p10">
      <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </div>
    <!-- End 分页组件 -->
  </div>
</template>
<script>
import pagination from '@/components/pagination'
import searchPanel from '@/components/searchPanel.vue'
import {
  EmployeeExamPaperPassState,
  InfrastCourseChannelType
} from '@/enums/science'
import {
  SecurityUserState
} from '@/enums/merchant'
import dayjs from 'dayjs'
import {
  COLLEGE_API_EMPLOYEEEXAMPAPER_GETS, COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYCOLLEGE,
  COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYSYSTEM
} from '@/apis/science'
import { Promise } from 'q'
export default {
  data() {
    return {
      securityUserStates: SecurityUserState,
      infrastCourseChannelType: InfrastCourseChannelType,
      employeeExamPaperPassState: EmployeeExamPaperPassState,
      aaa: '',
      queryForm: {
        CourseTitle: '',
        category: ['0'],
        UserId: '0',
        ChannelType: '0',
        SmallId: 0,
        LargeId: '0',
        CreateTime: [
          new Date() - 7 * 24 * 60 * 60 * 1000,
          new Date()
        ],
        PassState: '0',
        PageIndex: 1,
        PageSize: 20,
        Orderby: 0,
        IsAsced: 0
      },
      parameters: {
      },
      dectionarys: [],
      data: [],
      total: 0
    }
  },
  methods: {
    init() {
      let query = this.$route.query || {
      }
      this.queryForm = Object.assign(
        this.queryForm,
        {
          CourseTitle: '',
          UserId: '0',
          ChannelType: '0',
          category: ['0'],
          SmallId: 0,
          LargeId: 0,
          CreateTime: [
            new Date() - 7 * 24 * 60 * 60 * 1000,
            new Date()
          ],
          PassState: '0',
          PageIndex: 1,
          PageSize: 20,
          Orderby: 0,
          IsAsced: 0
        },
        query
      )
      this.getData()
    },
    currentChange (val) {
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange (val) {
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.initRoute()
    },
    getData () {
      let category = this.queryForm.category.length ? this.queryForm.category : [0, 0]
      let param = JSON.parse(JSON.stringify(Object.assign(this.queryForm, {
        CreateTime1: dayjs(this.queryForm.CreateTime[0]).format('YYYY-MM-DD HH:mm:ss'),
        CreateTime2: dayjs(this.queryForm.CreateTime[1]).format('YYYY-MM-DD HH:mm:ss'),
        ChannelType: category[0],
        SmallId: category[2],
        LargeId: category[1]
      })))
      this.$store.commit('SET_TB_LOADING', true)
      delete param.CreateTime // 不删会导致后台服务报错
      delete param.category // 不删会导致后台服务报错
      COLLEGE_API_EMPLOYEEEXAMPAPER_GETS(param).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Subset
          this.total = res.data.Data.Count
        }
      })
    },
    async getDictionary () {
      var ress = await Promise.all([COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYCOLLEGE(), COLLEGE_API_SETTINGDICTIONARY_DROPDOWNLISTBYSYSTEM()])
      let arr = [
        {
          value: '0',
          label: '所有分类',
          disabled: false
        }
      ]
      ress.forEach((item, index) => {
        arr.push( {
          value: index ? InfrastCourseChannelType.System : InfrastCourseChannelType.College,
          label: index ? '系统培训' : '珠宝学院',
          disabled: false,
          children: []
        })
        let children = []
        item.data.Data.Subset.forEach(item => {
          if (item.ParentId == 0) {
            children.push(Object.assign({
              value: item.DictId + '',
              label: item.DictName,
              disabled: false
            }, item))
          }
        })
        let dectionarys = this.initDectionry(children, item.data.Data.Subset)
        if (index == 0) {
          for(let i = 0; i < dectionarys.length; i++) {
            if (!dectionarys[i].children && dectionarys[i].value != '0') {
              dectionarys.splice(i,1)
              i -= 1
            }
          }
        }
        arr[index + 1].children = dectionarys
      })
      this.dectionarys = arr
    },
    initDectionry(arr, oldArr) {
      arr.forEach(item => {
        let objs = []
        oldArr.forEach(a => {
          if(item.DictId === a.ParentId) {
            objs.push(Object.assign({
              value: a.DictId + '',
              label: a.DictName,
              disabled: false
            }, a))
          }
        })
        if (objs.length) {
          item.children = this.initDectionry(objs, oldArr)
        }
      })
      return arr
    },
    onSearch() {
      this.queryForm.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      this.initRoute()
    },
    onReset () {
      this.queryForm = {
        CourseTitle: '',
        UserId: '0',
        category: ['0'],
        SmallId: 0,
        LargeId: 0,
        CreateTime: [
          new Date() - 7 * 24 * 60 * 60 * 1000,
          new Date()
        ],
        PassState: '0',
        PageIndex: 1,
        PageSize: 20,
        Orderby: 0,
        IsAsced: 0
      }
      this.onSearch()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: JSON.parse(JSON.stringify(this.parameters))
      })
    }
  },
  mounted() {
    this.$store.dispatch('GET_USERS_DROPLIST')
    this.init()
    this.getDictionary()
  },
  watch: {
    $route: 'init',
  },
  components: {
    pagination,
    searchPanel
  }
}
</script>
<style lang="scss" scoped>
  .red {
    color: red;
  }
</style>

