<template>
  <div class="content">
    <el-form :model="queryForm" label-position="right" label-width="100px" :inline="true" class="item-lh-26 p10">
      <el-row class="search-box no-border" type="flex">
        <el-col>
          <el-form-item label="活动时间：">
            <el-date-picker name="CreateTime" :picker-options="$root.datePickerOptions" :unlink-panels="true" type="daterange" v-model="queryForm.CreateTime"  ></el-date-picker>
          </el-form-item>
          <el-form-item label="活动名称：">
            <el-input name="CollageTitle" :maxlength="50" v-model="queryForm.CollageTitle" @keyup.enter.native="spellGroupSearch"></el-input>
          </el-form-item>
          <el-form-item label="活动状态：">
            <el-select name="State" v-model="queryForm.State" placeholder="全部" :filterable="true">
              <el-option label="全部" :value="'0'"></el-option>
              <template v-for="(item, index) in collageBasicState.Types">
                <el-option v-if="index != seckillBasicState.Deleted" :key="index" :label="item" :value="index"></el-option>
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button name="btnSearch" type="primary" @click="spellGroupSearch">搜索</el-button>
          <el-button name="btnReset" @click="spellGroupReset">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- END 搜索条件 -->
    <div class="p10"></div>
    <!-- Data Table -->
    <el-table :data="spellGroupData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="CollageId" label="ID" width="80" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="CollageTitle" label="活动名称"  show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="BtimeEtime" label="活动时间" show-overflow-tooltip width="300">
        <template slot-scope="scope">
          {{scope.row.Btime + '~' + scope.row.Etime}}
        </template>
      </el-table-column>
      <el-table-column prop="State" label="活动状态"  show-overflow-tooltip width="80">
        <template slot-scope="scope">
          {{collageBasicState.Types[scope.row.State]}}
        </template>
      </el-table-column>
      <el-table-column prop="TeamNum" label="开团数" show-overflow-tooltip width="80"></el-table-column>
      <el-table-column prop="MemberNum" label="参团数" show-overflow-tooltip width="80"></el-table-column>
      <el-table-column prop="WaitNum" label="待成团数" show-overflow-tooltip width="80"></el-table-column>
      <el-table-column prop="SucceedNum" label="已成团数" show-overflow-tooltip width="80"></el-table-column>
      <el-table-column prop="FailedNum" label="未成团数" show-overflow-tooltip width="80"></el-table-column>
      <el-table-column prop="DirectedNum" label="普通订单" show-overflow-tooltip width="80"></el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <router-link name="allOrder" :to="{path:'/spread/order/spellGroup/allOrder?spreadId=' + scope.row.CollageId}" type="text">处理订单</router-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- end Table -->
    <!-- 分页 -->
    <div class="p10 m-r-10 m-l-10">
      <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="spellGroupTotal" @currentChange="spellGroupPageChange" @sizeChange="spellGroupPageSizeChange"></pagination>
    </div>
    <!-- 分页 end -->
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import {
  SPREAD_API_COLLAGE_ORDERLIST 
} from '@/apis/spread'
import {SeckillBasicState, CollageBasicState, BargainBasicState} from '@/enums/spread'
import {
  YNStatus
} from '@/enums/common'
export default {
  data () {
    return {
      seckillBasicState: SeckillBasicState,
      collageBasicState: CollageBasicState,
      bargainBasicState: BargainBasicState,
      yNStatus: YNStatus,
      queryForm: {
        CollageTitle: '',
        CreateTime: '',
        State: '0',
        OrderBy: 0,
        IsAsc: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      parameters: {
      },
      spellGroupData: [],
      spellGroupTotal: 0,
      orderBy: 0,
      isAsc: '',
      pg: 1,
      size: 10
    }
  },
  methods: {
    init() {
      let query = this.$route.query || {
      }
      this.queryForm = Object.assign(this.queryForm, {
        CollageTitle: '',
        CreateTime: '',
        State: '0',
        OrderBy: 0,
        IsAsc: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }, query)
      this.getData()
    },
    spellGroupReset () {
      this.queryForm = {
        CollageTitle: '',
        CreateTime: '',
        State: '0',
        OrderBy: 0,
        IsAsc: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }
      this.spellGroupSearch()
    },
    spellGroupSearch () {
      this.queryForm.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    getData () {
      this.parameters.CreateTime = this.parameters
        .CreateTime
        ? this.parameters.CreateTime
        : ''
      this.queryForm = Object.assign(
        this.queryForm,
        this.parameters,
        {
          CreateTime1: this.parameters.CreateTime[0] || '1900-01-01',
          CreateTime2: this.parameters.CreateTime[1] || '1900-01-01'
        }
      )
      this.$store.commit('SET_TB_LOADING', true)
      SPREAD_API_COLLAGE_ORDERLIST(this.queryForm).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.spellGroupData = res.data.Data.rows
          this.spellGroupTotal = res.data.Data.total
        }
      })
    },
    spellGroupPageChange (val) {
      this.parameters.PageIndex = val
      this.initRoute()
    },
    spellGroupPageSizeChange (val) {
      this.parameters.PageSize = val
      this.parameters.PageIndex = 1
      this.initRoute()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path, query: JSON.parse(JSON.stringify(this.parameters)) 
      })
    }
  },
  beforeMount () {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    pagination
  }
}
</script>
