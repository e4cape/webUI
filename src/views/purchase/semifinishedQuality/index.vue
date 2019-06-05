<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-dropdown name="handleCommand" @command="handleCommand">
            <span class="el-dropdown-link">
              <el-button type="primary">
                批量操作
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="done" :disabled="selectedProductId.length === 0">标记已完成</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
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
              <template v-for="item in HalfIntakeOrderBasicQualityState.TypeArray">
                <el-option
                  :key="item.KeyId"
                  :label="item.Value"
                  :value="String(item.KeyId)"
                  v-if="item.KeyId !== HalfIntakeOrderBasicQualityState.Cancel"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item prop="IntakeCode">
            <el-input
              name="IntakeCode"
              v-model="queryForm.IntakeCode"
              placeholder="来源单号"
              maxlength="30"
              @keyup.enter.native="onSearch"
            >
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="种类：" prop="KindTypeEk">
            <el-select filterable name="KindTypeEk" v-model="queryForm.KindTypeEk">
              <el-option label="所有种类" :value="''"></el-option>
              <el-option
                v-for="item in $store.getters.kindType.TypeArray"
                :key="item.Id"
                :label="item.Value"
                :value="String(item.Id)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="来源单号：" prop="IntakeCode">
            <el-input
              name="IntakeCode"
              v-model="queryForm.IntakeCode"
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
      <el-table-column type="selection" width="45" fixed></el-table-column>
      <el-table-column
        prop="PreviousId"
        label="来源单号"
        min-width="110"
        sortable="custom"
        fixed
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span
            name="btnLink"
            class="btn-link el-button--text"
            style="cursor: pointer;"
            @click="$router.push(`/purchase/semiPackageArrival/semiArrivalCheck?id=${scope.row.IntakeId}`)"
          >{{scope.row.IntakeCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ExpressCode" label="送货单号" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.ExpressCode || '-'}}</template>
      </el-table-column>
      <el-table-column prop="KindTypeEv" label="货品种类" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ItemQty" label="入库数量" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="WeekQty" label="次品数量" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Weight" label="入库重量" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{$root.toFloat(scope.row.Weight, 3)}}g</template>
      </el-table-column>
      <el-table-column prop="WeekWgt" label="次品重量" min-width="80" show-overflow-tooltip>
        <template slot-scope="scope">{{$root.toFloat(scope.row.WeekWgt, 3)}}g</template>
      </el-table-column>
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
            :class="scope.row.QualityState | findKey(HalfIntakeOrderBasicQualityState)"
          >{{HalfIntakeOrderBasicQualityState.Types[scope.row.QualityState] || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="160">
        <template slot-scope="scope">
          <router-link
            name="btnCheck"
            :to="{path:'/purchase/semifinishedQuality/semifinishedCheck',query:{id: scope.row.IntakeId}}"
            class="btn-link el-button el-button--text"
          >查看</router-link>
          <router-link
            name="btnInspection"
            :to="{path:'/purchase/semifinishedQuality/semiInspection',query:{id: scope.row.IntakeId}}"
            class="btn-link el-button el-button--text"
            v-if="scope.row.QualityState == HalfIntakeOrderBasicQualityState.Wait"
          >质检</router-link>
          <el-button
            name="btnComplete"
            type="text"
            :key="scope.row.QualityId"
            @click="markComplete($event, 'completed', scope.row)"
            v-if="scope.row.QualityState == HalfIntakeOrderBasicQualityState.Wait"
          >标记已完成</el-button>
          <el-button
            name="btnUnfinished"
            type="text"
            :key="scope.row.QualityId"
            @click="markComplete($event, 'unfinished', scope.row)"
            v-if="scope.row.QualityState == HalfIntakeOrderBasicQualityState.Finish"
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
  HalfIntakeOrderBasicQualityState,
  GoodsQualityOrderBasicQualityType,
  HalfIntakeOrderBasicState
} from '@/enums/stocking'
import { YNStatus } from '@/enums/common'
import {
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_GETS1,
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_FINISHQUALITY,
  STOCKING_API_HALF_INTAKE_ORDER_BASIC_WAITQUALITY
} from '@/apis/stocking'
import searchPanel from '@/components/searchPanel'
import pagination from '@/components/pagination'

export default {
  data() {
    return {
      HalfIntakeOrderBasicQualityState,
      GoodsQualityOrderBasicQualityType,
      YNStatus,
      queryForm: {
        State: HalfIntakeOrderBasicState.Audit,
        QualityState: '',
        IntakeCode: '',
        KindTypeEk: '',
        ExpressCode: '',
        QualityTime: '',
        OrderBy: 0,
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
      this.parameter.State = query.State || HalfIntakeOrderBasicState.Audit
      this.parameter.QualityState = query.QualityState || ''
      this.parameter.IntakeCode = query.IntakeCode || ''
      this.parameter.KindTypeEk = query.KindTypeEk || ''
      this.parameter.ExpressCode = query.ExpressCode || ''
      this.parameter.QualityTime = query.QualityTime || []
      this.parameter.OrderBy = query.OrderBy || 0
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
      STOCKING_API_HALF_INTAKE_ORDER_BASIC_GETS1(parameter).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.total = res.data.Data.Count
          this.data = res.data.Data.Rows || []
        }
      })
    },
    handleCommand(command) {
      if (command === 'done') {
        this.$confirm('是否批量标记完成?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.finishQuality(this.selectedProductId)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消标记'
            })
          })
      }
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
          this.queryForm.OrderBy = 4
          break
        case 'IntakeCode':
          this.queryForm.OrderBy = 3
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    handleSelectionChange(val) {
      this.selectedProductId = []
      val.forEach(item => {
        this.selectedProductId.push({ IntakeId: item.IntakeId })
      })
    },
    finishQuality(ids) {
      STOCKING_API_HALF_INTAKE_ORDER_BASIC_FINISHQUALITY({
        items: ids
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('标记完成成功')
          this.getData()
        }
      })
    },
    waitQuality(ids) {
      STOCKING_API_HALF_INTAKE_ORDER_BASIC_WAITQUALITY({
        items: ids
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message.success('标记未完成成功')
          this.getData()
        }
      })
    },
    markComplete($event, compt, row) {
      // 是否标记完成
      $event.currentTarget.blur()
      let str
      if (compt === 'completed') {
        str = '完成'
      } else {
        str = '未完成'
      }
      this.$confirm(`是否标记${str}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (compt === 'completed') {
            this.finishQuality([{ IntakeId: row.IntakeId }])
          } else {
            this.waitQuality([{ IntakeId: row.IntakeId }])
          }
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
