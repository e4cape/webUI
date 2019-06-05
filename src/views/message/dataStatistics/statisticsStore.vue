<template>
  <div class="p-t-10 container">
    <el-form
      :inline="true"
      name="btnStatisticsStoreForm"
      :model="queryForm"
      ref="search"
      :rules="rules"
      class="demo-form-inline"
      label-width="80px"
    >
      <el-form-item label="下单时间：">
        <el-date-picker
          v-model="dateTime"
          name="btnOrderTime"
          type="daterange"
          range-separator="-"
          align="left"
          :picker-options="$root.datePickerOptions"
          unlink-panels
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd"
          :clearable="false"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="ID："
        prop="characterId"
      >
        <el-input
          name="btnOrderId"
          v-model="queryForm.characterId"
          maxlength="8"
          @keyup.native="queryForm.characterId = $root.toFixed(queryForm.characterId, 0)"
          placeholder="ID"
          @keyup.enter.native="onSearch"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="名称："
        prop="storeName"
      >
        <el-input
          name="btnStroeName"
          v-model="queryForm.storeName"
          maxlength="20"
          placeholder="名称"
          @keyup.enter.native="onSearch"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="类型："
        prop="characterType"
      >
        <el-select
          name="btnOrderType"
          v-model="queryForm.characterType"
          value=""
        >
          <el-option
            label="全部"
            value=""
          ></el-option>
          <el-option
            v-for="item in  characterTypes"
            :key="item.key"
            :value="item.key"
            :label="item.title"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="m-l-10">
        <el-button
          name="btnOnSearch"
          type="primary"
          @click="onSearch"
        >查询</el-button>
        <el-button
          name="btnOnReset"
          @click="onReset"
        >重置</el-button>
        <el-button
          name="btnExportToExcel"
          type="primary"
          @click="exportToExcel"
        >导出Excel表</el-button>
      </el-form-item>
    </el-form>
    <el-row class="total-num-show">
      <el-col :span="12">
        <span>充值金额：</span>
        <span class="fw-b text-danger">{{numInfo.totalAmount || '-'}}</span>
      </el-col>
      <el-col :span="12">
        <span>购买短信：</span>
        <span class="fw-b text-warning">{{numInfo.smsCount || '-'}}</span>
      </el-col>
    </el-row>
    <el-table
      :data="data"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column
        prop="characterTypeText"
        label="类型"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="characterId"
        label="ID"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="storeName"
        label="名称"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="amount"
        label="充值金额"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="smsCount"
        label="购买短信"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="templateTypeText"
        label="操作"
        width="80"
      >
        <template slot-scope="scope">
          <router-link
            name="btnLinkStatisticsStoreDetail"
            :to="{path:'/message/dataStatistics/statisticsStoreDetail',query: JSON.parse(JSON.stringify({characterId:scope.row.characterId,startTime:queryForm.startTime,endTime:queryForm.endTime}))}"
            class="btn-link el-button el-button--text"
          >详情</router-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :pg="queryForm.pageIndex"
      :size="queryForm.pageSize"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
  </div>
</template>

<script>
import pagination from '@/components/pagination.vue'
import {
  MESSAGE_API_ORDERRECHARGE_GETSUMMARY,
  MESSAGE_API_STOREEXPORTER_EXPORTTOFILE
} from '@/apis/message'
import { storeEnum } from './common'
export default {
  data() {
    return {
      activeIndex: 1,
      characterTypes: storeEnum,
      queryForm: {
        characterId: '',
        characterType: '',
        storeName: '',
        startTime: '',
        endTime: '',
        pageIndex: 1,
        pageSize: 20
      },
      dateTime: [
        new Date(Date.parse(new Date()) - 6 * 24 * 60 * 60 * 1000),
        new Date()
      ],
      data: [],
      total: 0,
      numInfo: {},
      rangeTime: '',
      rules: {
        characterId: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value && !/^\d+$/.test(value) && parseInt(value) !== 0) {
                callback(new Error('请输入正整数'))
                this.queryForm.characterId = ''
              }
              callback()
            }
          }
        ]
      }
    }
  },
  methods: {
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      let createTime = this.dateTime || [
        new Date(Date.parse(new Date()) - 6 * 24 * 60 * 60 * 1000),
        new Date()
      ]

      MESSAGE_API_ORDERRECHARGE_GETSUMMARY(
        Object.assign(this.queryForm, {
          startTime: createTime[0],
          endTime: createTime[1]
        })
      ).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows
          this.total = res.data.Data.total
          this.numInfo.totalAmount = res.data.Data.totalAmount
          this.numInfo.smsCount = res.data.Data.smsCount
        }
      })
    },
    currentChange(val) {
      // 切换当前页
      this.queryForm.pageIndex = val
      this.getData()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.queryForm.pageIndex = 1
      this.queryForm.pageSize = val
      this.getData()
    },
    onSearch() {
      // 搜索相关
      this.queryForm.pageIndex = 1
      this.getData()
    },
    exportToExcel() {
      MESSAGE_API_STOREEXPORTER_EXPORTTOFILE({
        apiKey: 'ORDERRECHARGE_GETSUMMARY',
        apiParameter: this.queryForm,
        exportFields: [
          'characterTypeText',
          'characterId',
          'storeName',
          'amount',
          'smsCount'
        ],
        exportType: 1
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          window.open(this.$root.settings.DOMAIN_TEMP + res.data.Data)
        }
      })
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.dateTime = [
        new Date(Date.parse(new Date()) - 6 * 24 * 60 * 60 * 1000),
        new Date()
      ]
      this.onSearch()
    }
  },
  mounted() {
    this.getData()
  },
  watch: {},
  components: {
    pagination
  }
}
</script>

<style lang="scss" scoped>
.custom-query {
  display: inline-flex;
  > :global(label) {
    min-width: 80px;
  }
}
</style>
