<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="simpleSearch">
          <el-form-item prop="QualityState">
            <el-select
              name="QualityState"
              v-model="queryForm.QualityState"
              placeholder="所有状态"
              @change="onSearch"
              :filterable="true"
            >
              <el-option label="所有状态" :value="''"></el-option>
              <el-option
                v-for="item in GoodsQualityOrderBasicStepState.TypeArray"
                :key="item.KeyId"
                :label="item.Value"
                :value="String(item.KeyId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="PreviousCode">
            <el-input
              name="PreviousCode"
              v-model="queryForm.PreviousCode"
              placeholder="来源单号"
              maxlength="30"
              @keyup.enter.native="onSearch"
            >
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="来源：" prop="QualityType">
            <el-select name="QualityType" v-model="queryForm.QualityType" :filterable="true">
              <el-option label="所有来源" :value="''"></el-option>
              <el-option
                v-for="item in GoodsQualityOrderBasicQualityType.TypeArray"
                :key="item.KeyId"
                :label="item.Value"
                :value="String(item.KeyId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="种类：" prop="KindTypeEk">
            <el-select name="KindTypeEk" v-model="queryForm.KindTypeEk" :filterable="true">
              <el-option label="所有种类" :value="''"></el-option>
              <el-option
                v-for="item in $store.getters.kindType.TypeArray"
                :key="item.Id"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="来源单号：" prop="PreviousCode">
            <el-input
              name="PreviousCode"
              v-model="queryForm.PreviousCode"
              maxlength="30"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="送货单号：" prop="ExpressCode">
            <el-input
              name="ExpressCode"
              v-model="queryForm.ExpressCode"
              maxlength="30"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="完成时间：" prop="QualityTime">
            <el-date-picker
              name="QualityTime"
              type="daterange"
              v-model="queryForm.QualityTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="$root.datePickerOptions"
              :unlink-panels="true"
            ></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- @module 数据表格 -->
    <el-table
      :data="data"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column prop="QualityType" fixed label="来源" min-width="100" show-overflow-tooltip>
        <template
          slot-scope="scope"
        >{{GoodsQualityOrderBasicQualityType.Types[scope.row.QualityType]}}</template>
      </el-table-column>
      <el-table-column
        prop="PreviousCode"
        label="来源单号"
        min-width="120"
        sortable="custom"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span
            name="btnLink"
            v-if="scope.row.QualityType === GoodsQualityOrderBasicQualityType.GoodsArriveOrderBasic"
            class="btn-link el-button--text"
            style="cursor: pointer;"
            @click="$router.push(`/purchase/finishedProduct/viewFinishedProductOrder?id=${scope.row.PreviousId}`)"
          >{{scope.row.PreviousCode}}</span>
          <span
            name="btnLink"
            v-if="scope.row.QualityType === GoodsQualityOrderBasicQualityType.HalfChangeOrderBasic"
            class="btn-link el-button--text"
            style="cursor: pointer;"
            @click="$router.push(`/purchase/pointsBalance/pointsBalanceCheck?id=${scope.row.PreviousId}`)"
          >{{scope.row.PreviousCode}}</span>
          <span
            name="btnLink"
            v-if="scope.row.QualityType === GoodsQualityOrderBasicQualityType.JunkChangeOrderBasic"
            class="btn-link el-button--text"
            style="cursor: pointer;"
            @click="$router.push(`/depot/junkChange/check?id=${scope.row.PreviousId}`)"
          >{{scope.row.PreviousCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ExpressCode" label="送货单号" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.ExpressCode || '-'}}</template>
      </el-table-column>
      <el-table-column prop="KindTypeEv" label="货品种类" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ArriveQty" label="货品数量" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="WeekQty" label="次品数量" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="QualityTime"
        label="完成时间"
        min-width="120"
        sortable="custom"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{scope.row.QualityTime | filterDateMinutes}}</template>
      </el-table-column>
      <el-table-column
        prop="QualityState"
        fixed="right"
        label="状态"
        min-width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span
            :class="scope.row.QualityState | findKey(GoodsQualityOrderBasicStepState)"
          >{{GoodsQualityOrderBasicStepState.Types[scope.row.QualityState] || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="160">
        <template slot-scope="scope">
          <router-link
            name="btnCheck"
            :to="{path:'/purchase/inspectionProduct/inspectionCheck',query:{id: scope.row.QualityId}}"
            class="btn-link el-button el-button--text"
          >查看</router-link>
          <router-link
            name="btnEdit"
            :to="{path:'/purchase/inspectionProduct/qualityInspection',query:{id: scope.row.QualityId}}"
            class="btn-link el-button el-button--text"
            v-if="scope.row.QualityState == GoodsQualityOrderBasicStepState.Wait"
          >质检</router-link>
          <el-button
            name="btnComplete"
            type="text"
            @click="markComplete($event, 'completed', scope.row)"
            :key="scope.row.QualityId"
            v-if="scope.row.QualityState == GoodsQualityOrderBasicStepState.Wait"
          >标记已完成</el-button>
          <el-button
            name="btnUnfinished"
            type="text"
            :key="scope.row.QualityId"
            @click="markComplete($event, 'unfinished', scope.row)"
            v-if="scope.row.QualityState == GoodsQualityOrderBasicStepState.Finish"
          >标记未完成</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <!-- 分页 -->
    <pagination
      :pg="queryForm.PageIndex"
      :size="queryForm.PageSize"
      :total="total"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
    <!-- End 分页 -->
  </el-row>
</template>

<script>
import {
  GoodsQualityOrderBasicStepState,
  GoodsQualityOrderBasicQualityType
} from '@/enums/stocking'
import { YNStatus } from '@/enums/common'
import {
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GETS,
  STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH
} from '@/apis/stocking'
import searchPanel from '@/components/searchPanel'
import pagination from '@/components/pagination'

export default {
  data() {
    return {
      GoodsQualityOrderBasicStepState,
      GoodsQualityOrderBasicQualityType,
      queryForm: {
        QualityState: '',
        QualityType: '',
        KindTypeEk: '',
        PreviousCode: '',
        ExpressCode: '',
        QualityTime: '',
        OrderBy: 7,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      total: 0,
      data: [],
      selectedProductId: [],
      parameter: {}
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: JSON.parse(JSON.stringify(this.parameter))
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.QualityState = query.QualityState || ''
      this.parameter.QualityType = query.QualityType || ''
      this.parameter.QualityTime = query.QualityTime || []
      this.parameter.KindTypeEk = query.KindTypeEk || ''
      this.parameter.PreviousCode = query.PreviousCode || ''
      this.parameter.ExpressCode = query.ExpressCode || ''
      this.parameter.OrderBy = query.OrderBy || 7
      this.parameter.IsAsced = query.IsAsced || YNStatus.No
      this.parameter.PageIndex = query.PageIndex || 1
      this.parameter.PageSize = query.PageSize || 20
      this.getData()
    },
    getData() {
      let parameter = Object.assign(this.queryForm, this.parameter, {
        QualityTime1: this.parameter.QualityTime[0],
        QualityTime2: this.parameter.QualityTime[1]
      })
      this.$store.commit('SET_TB_LOADING', true)
      STOCKING_API_GOODS_QUALITY_ORDER_BASIC_GETS(parameter).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count
        }
      })
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.queryForm.isSenior = true
      this.parameter = Object.assign({}, this.queryForm)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    currentChange(val) {
      // 切换当前页
      this.parameter.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameter.PageIndex = 1
      this.parameter.PageSize = val
      this.initRoute()
    },
    sortChange(sort) {
      // 表单排序
      switch (sort.prop) {
        case 'QualityTime':
          this.queryForm.OrderBy = 1
          break
        case 'PreviousCode':
          this.queryForm.OrderBy = 0
          break
        default:
          this.queryForm.OrderBy = 7
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    handleSelectionChange(val) {
      val.forEach(item => {
        this.selectedProductId.push(item)
      })
    },
    markComplete($event, compt, row) {
      // 是否标记完成
      $event.currentTarget.blur()
      let str, qualityState
      if (compt === 'completed') {
        str = '完成'
        qualityState = GoodsQualityOrderBasicStepState.Finish
      } else {
        str = '未完成'
        qualityState = GoodsQualityOrderBasicStepState.Wait
      }
      this.$confirm(`是否标记${str}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          STOCKING_API_GOODS_QUALITY_ORDER_BASIC_FINISH({
            QualityId: row.QualityId,
            QualityState: qualityState
          }).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.getData()
              this.$message({
                type: 'success',
                message: `标记${str}成功!`
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消标记'
          })
        })
    }
  },
  created() {
    this.$store.dispatch('GET_KIND_TYPE')
  },
  mounted() {
    this.init()
  },
  components: {
    searchPanel,
    pagination
  },
  watch: {
    $route: 'init'
  }
}
</script>
