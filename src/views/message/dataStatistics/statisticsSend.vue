<template>
  <div class="p-t-10">
    <el-form :inline="true" name="btnStatistcsSendForm" :model="queryForm" ref="search" :rules="rules" class="demo-form-inline" label-width="80px">
      <el-form-item label="发送时间：" prop="dateTime">
        <el-date-picker name="btnSendTime" v-model="dateTime" type="daterange" range-separator="-" align="left" :picker-options="$root.datePickerOptions" unlink-panels start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" value-format="yyyy-MM-dd HH:mm:dd" :clearable="false" >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="ID：" prop="characterId">
        <el-input name="btnEnterId" v-model="queryForm.characterId"  maxlength="8" placeholder="ID" @keyup.native ="queryForm.characterId = $root.toFixed(queryForm.characterId, 0)" @keyup.enter.native="onSearch" ></el-input>
      </el-form-item>
      <el-form-item label="名称：" prop="storeName">
        <el-input name="btnStoreName" v-model="queryForm.storeName"  maxlength="20" placeholder="名称" @keyup.enter.native="onSearch"></el-input>
      </el-form-item>
      <el-form-item label="类型：" prop="characterType">
        <el-select name="btnSelectType" v-model="queryForm.characterType" value="">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in characterTypes" :key="item.key" :value="item.key" :label="item.title"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="m-l-10">
        <el-button name="btnOnSearch" type="primary" @click="onSearch">查询</el-button>
        <el-button name="btnOnReset" @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row class="total-num-show" v-loading="$store.getters.tb_loading">
      <el-col :span="12">
        <span>发送条数：</span>
        <span class="fw-b text-warning">{{numInfo.rangeCount !== undefined ? numInfo.rangeCount : '-'}}</span>
      </el-col>
      <el-col :span="12">
        <span>累积发送条数：</span>
        <span class="fw-b text-warning">{{numInfo.totalCount || '-'}}</span>
      </el-col>
    </el-row>
    <el-table :data="data" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="characterTypeText" label="类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="characterId" label="ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="storeName" label="名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="rangeCount" label="当前发送条数" show-overflow-tooltip></el-table-column>
      <el-table-column prop="totalCount" label="累积发送条数" show-overflow-tooltip></el-table-column>
      <el-table-column prop="templateTypeText" label="操作" width="80">
        <template slot-scope="scope">
          <router-link name="btnLinkStatisticsSendDetail" :to="{path:'/message/dataStatistics/statisticsSendDetail',query: JSON.parse(JSON.stringify({characterId:scope.row.characterId,startTime:queryForm.startTime,endTime:queryForm.endTime}))}" class="btn-link el-button el-button--text">详情</router-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="queryForm.pageIndex" :size="queryForm.pageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>

<script>
import pagination from '@/components/pagination.vue'
import {
  MESSAGE_API_SENDLOG_SEARCHSTORETOTALLIST,
  MESSAGE_API_SENDLOG_SEARCHTOTAL
} from '@/apis/message'
import {
  sendEnum 
} from './common'

export default {
  data() {
    return {
      activeIndex: 2,
      queryForm: {
        characterId: '',
        templateType: '',
        characterType: '',
        storeName: '',
        startTime: '',
        endTime: '',
        pageIndex: 1,
        pageSize: 20
      },
      characterTypes: sendEnum,
      dateTime: [new Date(Date.parse(new Date()) - 6 * 24 * 60 * 60 * 1000), new Date()],
      total: 0,
      numInfo: [],
      data: [],
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
    init() {
      const query = this.$route.query || {
      }
      this.queryForm.startTime = query.startTime || ''
      this.queryForm.endTime = query.endTime || ''
      this.dateTime =
        query.startTime && query.endTime ? [query.startTime, query.endTime] : [new Date(Date.parse(new Date()) - 6 * 24 * 60 * 60 * 1000), new Date()]
      this.getData()
    },
    async getData() {
      this.$store.commit('SET_TB_LOADING', true)
      let createTime = this.dateTime || [new Date(Date.parse(new Date()) - 6 * 24 * 60 * 60 * 1000), new Date()]

      let dataAll = await Promise.all([
        MESSAGE_API_SENDLOG_SEARCHSTORETOTALLIST(Object.assign(this.queryForm, {
          startTime: createTime[0],
          endTime: createTime[1],
        })),
        MESSAGE_API_SENDLOG_SEARCHTOTAL(Object.assign(this.queryForm, {
          startTime: createTime[0],
          endTime: createTime[1],
        }))
      ])
      this.data = dataAll[0].data.Data.rows
      this.total = dataAll[0].data.Data.total
      this.numInfo.rangeCount = dataAll[1].data.Data.rangeCount
      this.numInfo.totalCount = dataAll[1].data.Data.totalCount
      this.$store.commit('SET_TB_LOADING', false)
    },
    currentChange(val) {
      // 切换当前页
      this.queryForm.pageIndex = val
      this.getData()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.queryForm.pageSize = val
      this.queryForm.pageIndex = 1
      this.getData()
    },
    onSearch() {
      // 搜索相关
      this.queryForm.pageIndex = 1
      this.getData()
    },
    onReset () {
      // 重置表单
      this.$refs['search'].resetFields()
      this.dateTime = [new Date(Date.parse(new Date()) - 6 * 24 * 60 * 60 * 1000), new Date()]
      this.onSearch()
    }
  },
  mounted() {
    this.init()
  },
  components: {
    pagination
  }
}
</script>
