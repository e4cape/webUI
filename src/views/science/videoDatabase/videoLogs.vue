
<template>
  <div class="content">
    <el-form :model="queryForm" ref="onSearch" lable-width="50px" class="item-lh-26" :inline="true">
      <el-row class="search-box no-border" type="flex">
        <el-col>
          <el-form-item label="操作人：">
            <el-select name="CreateUserId" v-model="queryForm.CreateUserId" placeholder="全部" filterable >
              <el-option label="全部" value="0"> </el-option>
              <template v-for="(item, index) in $store.getters.users">
                <el-option :label="item.TrueName" :value="item.UserId" v-if="item.UserState === securityUserState.Audit && item.TrueName" :key="index"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="操作类型：">
            <el-select name="State" v-model="queryForm.State" placeholder="所有状态" filterable>
              <el-option label="所有状态" value="0"> </el-option>
              <el-option :label="item.Value" :key="index" :value="item.KeyId" v-for="(item, index) in infrastCourseVideoLogState.TypeArray"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作时间：">
            <el-date-picker name="CreateTime" v-model="queryForm.CreateTime" :unlink-panels="true" type="daterange"> </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="search-btn">
          <el-button name="btnSearch" type="primary" @click="onSearch">搜索</el-button>
          <el-button name="btnReset" @click="onReset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table class="tabs-tb" :data="data" v-loading="$store.getters.tb_loading" @sort-change="sortChange" element-loading-text="拼命加载中">
      <el-table-column prop="CreateTime" sortable="custom" label="操作时间" width="150" show-overflow-tooltip fixed>
        <template slot-scope="scope">
          {{scope.row.CreateTime | filterDateTime}}
        </template>
      </el-table-column>
      <el-table-column prop="CreateUser" label="操作人" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="State" label="操作类型" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{infrastCourseVideoLogState.Types[scope.row.State]}}
        </template>
      </el-table-column>
      <el-table-column prop="VideoName" label="视频名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="VideoSize" label="视频大小" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          {{parseInt(scope.row.VideoSize / 1024 / 1024) > 1024 ? parseFloat(scope.row.VideoSize / 1024 / 1024 / 1024).toFixed(2) + 'GB' :  parseFloat(scope.row.VideoSize / 1024 / 1024).toFixed(2) + 'MB'}}
        </template>
      </el-table-column>
      <el-table-column prop="VideoTime" label="视频时长" width="120" show-overflow-tooltip></el-table-column>
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
import {
  SecurityUserState 
} from '@/enums/merchant'
import { YNStatus } from '@/enums/common'
import {
  InfrastCourseVideoLogState
} from '@/enums/science'
import {
  COLLEGE_API_INFRASTCOURSEVIDEOLOG_GETS 
} from '@/apis/science'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      securityUserState: SecurityUserState,
      infrastCourseVideoLogState: InfrastCourseVideoLogState,
      queryForm: {
        CreateUserId: '0',
        CreateTime: null,
        CreateTime1: '',
        CreateTime2: '',
        State: '0',
        PageIndex: 1,
        PageSize: 20,
        Orderby: 0,
        IsAsced: 0
      },
      parameters: {
      },
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
          CreateUserId: '0',
          CreateTime: null,
          CreateTime1: '',
          CreateTime2: '',
          State: '0',
          PageIndex: 1,
          PageSize: 20,
          Orderby: 0,
          IsAsced: 1
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
    sortChange(sort) {
      if (!sort.order) {
        this.queryForm.IsAsced = YNStatus.No
      } else {
        this.queryForm.IsAsced = sort.order === 'ascending' ? YNStatus.No : YNStatus.Yes
      }
      this.onSearch()
    },
    getData () {
      this.$store.commit('SET_TB_LOADING', true)
      console.log(this.queryForm.CreateTime)
      let CreateTime = this.queryForm.CreateTime ? this.queryForm.CreateTime : ['1900-01-01', '1900-01-01']
      let param = JSON.parse(JSON.stringify(Object.assign({
      }, this.queryForm, {
        CreateTime1: dayjs(CreateTime[0]).format('YYYY-MM-DD HH:mm:ss'),
        CreateTime2: dayjs(CreateTime[1]).format('YYYY-MM-DD HH:mm:ss'),
      })))
      delete param.CreateTime
      COLLEGE_API_INFRASTCOURSEVIDEOLOG_GETS(param).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          res.data.Data.Subset.map(item => {
            // 计算时分秒
            item.VideoTime = (item.VideoTime > 3600 ? parseInt((item.VideoTime - item.VideoTime % 3600)/3600 % 3600) + '时' : '') + (item.VideoTime > 60 ? parseInt((item.VideoTime - item.VideoTime % 60) / 60 % 60 ) + '分' : '') + parseInt(item.VideoTime % 60) + '秒'
          })
          this.data = res.data.Data.Subset
          this.total = res.data.Data.Count
        }
      })
    },
    onSearch() {
      this.queryForm.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      this.initRoute()
    },
    onReset() {
      this.queryForm = {
        CreateUserId: '0',
        CreateTime: null,
        CreateTime1: '',
        CreateTime2: '',
        State: '0',
        PageIndex: 1,
        PageSize: 20,
        Orderby: 0,
        IsAsced: 1
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
  },
  watch: {
    $route: 'init',
  },
  components: {
    pagination
  }
}
</script>
<style lang="scss" scoped>
</style>
