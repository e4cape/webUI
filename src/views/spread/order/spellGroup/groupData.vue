<template>
  <div class="content">
    <!-- @module Panel -->
    <el-form :model="queryForm" label-position="right" label-width="110px" :inline="true" class="item-lh-26 p10">
      <el-row class="search-box no-border" type="flex">
        <el-col>
          <el-form-item label="开团时间：">
            <el-date-picker name="CreateTime" :picker-options="$root.datePickerOptions" :unlink-panels="true" type="daterange" v-model="queryForm.CreateTime"  ></el-date-picker>
          </el-form-item>
          <el-form-item label="商品名称：">
            <el-input name="ProductName" :maxlength="50" v-model="queryForm.ProductName" @keyup.enter.native="search"></el-input>
          </el-form-item>
          <el-form-item label="拼团状态：">
            <el-select name="State" v-model="queryForm.State" placeholder="全部" :filterable="true">
              <el-option label="全部" :value="0"></el-option>
              <el-option v-for="(item, index) in collageTeamState.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="search-btn">
          <el-button name="btnSearch" type="primary" @click="search">搜索</el-button>
          <el-button name="btnGroupImport" type="text" @click="groupImport">导出Excel</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="p10"></div>
    <el-table :data="groupData" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="CreateTime" label="开团时间"  show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="TeamId" label="团号"  show-overflow-tooltip width="80" fixed></el-table-column>
      <el-table-column prop="ProductId" label="商品编码" show-overflow-tooltip width="80"></el-table-column>
      <el-table-column prop="ProductName" label="商品名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="MktPrice" label="成团人数/团" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.MembAmt}}人团
        </template>
      </el-table-column>
      <el-table-column prop="Quantity" label="距成团人数" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.MembAmt - scope.row.CurrAmt}}人
        </template>
      </el-table-column>
      <el-table-column prop="State" label="拼团状态" show-overflow-tooltip>
        <template slot-scope="scope">
          {{collageTeamState.Types[scope.row.State]}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button name="btnGroupCheck" type="text" @click="$router.push({path: '/spread/order/groupCheck?spreadId=' + spreadId + '&teamId=' + scope.row.TeamId})">查看订单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- end Table -->
    <!-- 分页 -->
    <div class="p10">
      <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    </div>
  </div>
</template>

<script>
import pagination from '@/components/pagination'
import { YNStatus } from '@/enums/common'
import {
  CollageTeamState,
} from '@/enums/spread'
import {
  SPREAD_API_COLLAGE_QRIES,
  SPREAD_API_COLLAGE_EXPORT
} from '@/apis/spread'
export default {
  data() {
    return {
      yNStatus: YNStatus,
      collageTeamState: CollageTeamState,
      groupData: [],
      queryForm: {
        OrderId: '',
        OrderCode: '',
        OrderType: '',
        SpreadTitle: '',
        ProductId: '',
        ProductName: '',
        MembAmt: '',
        TeamState: '',
        CreateTime: '',
        State: 0,
        AliasName: '',
        TrueName: '',
        Mobile: '',
        IsDirected: 0,
        PageIndex: 1,
        PageSize: 10
      },
      parameters: {
      },
      total: 0,
      text: ''
    }
  },
  methods: {
    init() {
      let query = this.$route.query
      this.spreadId = query.spreadId
      this.queryForm = Object.assign(this.queryForm, {
        OrderId: '',
        OrderCode: '',
        OrderType: '',
        SpreadTitle: '',
        ProductId: '',
        ProductName: '',
        MembAmt: '',
        TeamState: '',
        CreateTime: '',
        State: 0,
        AliasName: '',
        TrueName: '',
        Mobile: '',
        IsDirected: 0,
        PageIndex: 1,
        PageSize: 10
      }, query)
      this.getGroupData()
    },
    search() {
      this.queryForm.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getGroupData()
      } else {
        this.initRoute()
      }
    },
    getGroupData() {
      this.parameters.CreateTime = this.parameters.CreateTime
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
      SPREAD_API_COLLAGE_QRIES({
        ProductName: this.queryForm.ProductName,
        CreateTime1: this.queryForm.CreateTime1,
        CreateTime2: this.queryForm.CreateTime2,
        State: this.queryForm.State,
        OrderBy: 0,
        CollageId: this.spreadId,
        IsAsc: YNStatus.No,
        PageIndex: this.queryForm.PageIndex,
        PageSize: this.queryForm.PageSize
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.groupData = res.data.Data.rows
          this.total = res.data.Data.total
        } else {
          this.$message.error(res.data.Message)
        }
      })
    },
    groupImport() {
      this.parameters.CreateTime = this.parameters.CreateTime
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
      SPREAD_API_COLLAGE_EXPORT({
        ProductName: this.queryForm.ProductName,
        CreateTime1: this.queryForm.CreateTime1,
        CreateTime2: this.queryForm.CreateTime2,
        State: this.queryForm.State,
        OrderBy: 0,
        CollageId: this.spreadId,
        IsAsc: YNStatus.No,
        PageIndex: this.queryForm.PageIndex,
        PageSize: this.queryForm.PageSize
      }).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          setTimeout(() => {
            window.open(
              this.$root.settings.DOMAIN_TEMP + res.data.Data.FilePath
            )
          }, 1000)
        }
      })
    },
    currentChange(val) {
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      this.parameters.PageSize = val
      this.parameters.PageIndex = 1
      this.initRoute()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path, query: JSON.parse(JSON.stringify(Object.assign(this.parameters, {
          spreadId: this.spreadId
        }))) 
      })
    }
  },
  mounted() {
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
