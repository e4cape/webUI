
<template>
  <div class="statement">
    <el-form
      :model="form"
      ref="search"
      label-width="120px"
      class="item-lh-26"
      :inline="true"
    >
      <el-row class="search-box no-border" type="flex">
        <el-col>
          <el-form-item
            label="时间："
            prop="CreateTime"
          >
            <el-date-picker
              name="CreateTime"
              type="daterange"
              v-model="form.CreateTime"
              value-format="yyyy-MM-dd"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :unlink-panels="true"
              :picker-options="$root.datePickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            name="storeCode"
            label="门店编码："
            :maxlength="50"
            prop="storeCode"
            @keyup.native.enter="onSearch"
          >
            <el-input
              name="inputStoreCode"
              v-model="form.storeCode"
            ></el-input>
          </el-form-item>
          <el-form-item
            name="storeName"
            label="门店名称："
            :maxlength="50"
            prop="storeName"
            @keyup.native.enter="onSearch"
          >
            <el-input
              name="inputStoreName"
              v-model="form.storeName"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="门店类型："
            prop="storeType"
          >
            <el-select
              name="storeType"
              v-model="form.storeType"
            >
              <el-option
                label="全部"
                value=""
              ></el-option>
              <el-option
                v-for="item in EnumStoreType.TypeArray"
                :key="item.KeyId"
                :label="item.Value"
                :value="item.KeyId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="来源："
            prop="logType"
          >
            <el-select
              name="logType"
              v-model="form.logType"
            >
              <el-option
                label="全部"
                value=""
              ></el-option>
              <el-option
                v-for="item in EnumScoreRecordTypes.Types"
                :key="item.key"
                :label="item.title"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="变动类型："
            prop="scoreType"
          >
            <el-select
              name="scoreType"
              v-model="form.scoreType"
            >
              <el-option
                label="全部"
                value=""
              ></el-option>
              <el-option
                v-for="item in EnumScoreTypes.Types"
                :key="item.key"
                :label="item.title"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="变动情况："
            prop="changeWay"
          >
            <el-select
              name="changeWay"
              v-model="form.changeWay"
            >
              <el-option
                label="全部"
                value=""
              ></el-option>
              <el-option
                v-for="item in EnumChangeWay.Types"
                :key="item.key"
                :label="item.title"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col class="search-btn">
          <el-button name="btnonSearch" type="primary" @click="onSearch">搜索</el-button>
          <el-button name="btnonReset" type="default" @click="onReset">重置</el-button>
          <el-button
            name="btnExport"
            @click="eOpen = true"
          >导出</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="total">
      <ul
        class="clearfix"
        v-loading="loadingTop"
      >
        <li
          v-for="(item,index) in cardDataTotal"
          :key="index"
        >
          <card
            :name="item.name"
            :num="item.num"
          ></card>
        </li>
      </ul>
    </div>
    <el-table
      :data="tableData"
      @sort-change="sortChange"
      v-loading="$store.getters.tb_loading"
    >
      <el-table-column
        label="时间"
        prop="createTime"
        min-width="120"
        show-overflow-tooltip
        sortable
      >
        <template slot-scope="scope">{{ scope.row.createTime | filterDateTime }}</template>
      </el-table-column>
      <el-table-column
        label="门店编码"
        prop="storeCode"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="门店名称"
        prop="storeName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="门店类型"
        prop="storeTypeText"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="来源"
        prop="logTypeText"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="变动类型"
        prop="scoreTypeText"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="变动情况"
        prop="changeWayText"
        min-width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="数量"
        prop="amount"
        min-width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scope">{{(scope.row.amount > 0 ? '+' : '') + scope.row.amount}}</template>
      </el-table-column>
      <el-table-column
        label="会员姓名"
        prop="memberName"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="会员手机"
        prop="memberPhone"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="相关单据"
        prop="prevOrderCode"
        min-width="200"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
    <pagination
      :total="total"
      :pg="form.PageIndex"
      :size="form.PageSize"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
    <export-field-setter @submit="handleSubmit" :visible.sync="eOpen" :apiKey="apiKey" :api="eApi" :uploading="uploading"/>
  </div>
</template>
<script>
import {
  MEMBERSHIP_API_REPORTMEMBERBALANCELOG_SEARCH, // 列表
  MEMBERSHIP_API_REPORTMEMBERBALANCELOG_SEARCHSUMMARY, // 汇总
  MEMBERSHIP_API_STOREEXPORTER_EXPORTTOFILE, // 导出
  MEMBERSHIP_API_STOREEXPORTER_GETEXPORTFIELDS,
} from '@/apis/membership'

import { StoreType, YNStatus } from '@/enums/common'
import { DOMAIN_TEMP } from '@/configs/appSettings'
import { ScoreRecordTypes, ScoreTypes, ChangeWay } from '@/enums/membership'

import card from '../templateCard'
import pagination from '@/components/pagination'
import ExportFieldSetter from '@/components/exportFieldSetter'
let date = new Date()
export default {
  data() {
    return {
      loadingTop: false,
      cardDataTotal: [
        {
          name: '增加积分',
          num: ''
        },
        {
          name: '增加礼金',
          num: ''
        },
        {
          name: '扣减积分',
          num: ''
        },
        {
          name: '扣减礼金',
          num: ''
        }
      ],
      // 表格分页相关
      form: {
        CreateTime: [],
        storeCode: '', // 门店编码
        storeName: '', // 门店名称
        storeType: '', // 门店类型
        logType: '', // 来源
        scoreType: '', // 变动类型
        changeWay: '', // 变动情况
        orderField: 'createTime',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 20
      },
      parameter: {},
      tableData: [],
      total: 0,
      apiKey: 'REPORTMEMBERBALANCELOG_SEARCH',
      eOpen: false,
      eApi: MEMBERSHIP_API_STOREEXPORTER_GETEXPORTFIELDS,
      uploading: false
    }
  },
  computed: {
    EnumStoreType() {
      return StoreType
    },
    EnumScoreRecordTypes() {
      return ScoreRecordTypes
    },
    EnumScoreTypes() {
      return ScoreTypes
    },
    EnumChangeWay() {
      return ChangeWay
    }
  },
  watch: {
    $route: 'init'
  },
  mounted() {
    this.init()
  },
  methods: {
    handleSubmit(exportFields) {
      const apiParameter = this.parameter
      const para = {
        exportFields,
        apiKey: this.apiKey,
        exportType: 1,
        apiParameter
      }
      MEMBERSHIP_API_STOREEXPORTER_EXPORTTOFILE(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          setTimeout(() => {
            const downloadUrl = `${DOMAIN_TEMP}${res.data.Data}`
            window.location.href = downloadUrl
            this.eOpen = false
          }, 1000)
        }
      })
    },
    // 表格分页相关
    init() {
      const { query } = this.$route
      this.parameter.CreateTime = query.CreateTime || [this.$options.filters.filterAllDate(`${date.getFullYear()}-${date.getMonth()+1}-01`), this.$options.filters.filterAllDate(Date.parse(`${date.getFullYear()}-${date.getMonth()+2}-01`)-24*3600*1000)]
      this.parameter.storeCode = query.storeCode || ''
      this.parameter.storeName = query.storeName || ''
      this.parameter.storeType = query.storeType || ''
      this.parameter.logType = query.logType || ''
      this.parameter.scoreType = query.scoreType || ''
      this.parameter.changeWay = query.changeWay || ''
      this.parameter.PageIndex = query.PageIndex || 1
      this.parameter.PageSize = query.PageSize || 20
      this.getData()
      this.getSummary()
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
    sortChange({ prop, order }) {
      this.form.orderField = prop || ''
      this.form.orderType = order == 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    onSearch() {
      this.form.PageIndex = 1
      this.parameter = Object.assign({}, this.form)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
        this.getSummary()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      this.$refs['search'].resetFields()
      this.form.CreateTime = [this.$options.filters.filterAllDate(`${date.getFullYear()}-${date.getMonth()+1}-01`), this.$options.filters.filterAllDate(Date.parse(`${date.getFullYear()}-${date.getMonth()+2}-01`)-24*3600*1000)]
      this.form.storeType = ''
      this.onSearch()
    },
    getSummary() {
      this.loadingTop = true
      const { CreateTime } = this.parameter
      const param = Object.assign(this.form, this.parameter, {
        timeStart: CreateTime[0] || '',
        timeEnd: CreateTime[1] || ''
      })
      MEMBERSHIP_API_REPORTMEMBERBALANCELOG_SEARCHSUMMARY(param)
        .then(res => {
          if (res.data.Code == 'CORRECT') {
            const data = res.data.Data
            // 统计总
            const totalArr = [
              data.scoreIncrease,
              data.goldenRiceIncrease,
              data.scoreDecrease,
              data.goldenRiceDecrease
            ]
            this.cardDataTotal.map((item, i) => {
              item.num = totalArr[i]
            })
            this.loadingTop = false
          }
        })
        .catch(() => (this.loadingTop = false))
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      const { CreateTime } = this.parameter
      const param = Object.assign(this.form, this.parameter, {
        timeStart: CreateTime[0] || '',
        timeEnd: CreateTime[1] || ''
      })
      MEMBERSHIP_API_REPORTMEMBERBALANCELOG_SEARCH(param).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.rows
          this.total = res.data.Data.total
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    onSimpleSearch(e) {
      this.parameter.storeType = e
      this.onSearch()
    }
  },
  components: {
    card,
    pagination,
    ExportFieldSetter
  }
}
</script>

<style lang="scss" scoped>
.statement {
  .total {
    padding: 10px 0;
    ul {
      li {
        float: left;
        width: 24.25%;
        margin-left: 1%;
        background: $bg-color;
        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
}
.item-lh-26 .search-btn {
  width: 240px;
}
</style>