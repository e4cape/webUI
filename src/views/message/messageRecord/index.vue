<template>
  <div>
    <el-form
      :model="queryForm"
      ref="queryForm"
      label-width="120px"
      class="item-lh-26"
      :inline="true"
      name="btnMessageRecordForm"
    >
      <search-panel
        @onSearch="onSearch"
        @onReset="onReset"
        name="btnOnSearch"
      >
        <template slot="simpleSearch">
          <el-form-item>
            <el-input
              name="btnEnterMobile"
              v-model="queryForm.mobile"
              placeholder="手机号"
              @keyup.native.enter="onSearch"
            >
              <el-button
                name="btnClickSearch"
                slot="append"
                icon="el-icon-search"
                @click="onSearch"
              ></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item
            label="时间："
            prop="sendTime"
          >
            <el-date-picker
              v-model="queryForm.sendTime"
              name="btnSendTime"
              type="daterange"
              :unlink-panels="true"
              placeholder="选择日期范围"
              value-format="yyyy-MM-dd"
              :picker-options="$root.datePickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            label="模板类型："
            prop="templateType"
          >
            <el-select
              name="btnTemplateType"
              v-model="queryForm.templateType"
            >
              <el-option
                label="全部"
                value
              ></el-option>
              <el-option
                v-for="item in templateTypes.Types"
                :key="item.key"
                :value="item.key"
                :label="item.title"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            name="btnSearchPhone"
            label="手机号："
            prop="mobile"
            @keyup.native.enter="onSearch"
          >
            <el-input
              name="btnEnterPhone"
              v-model="queryForm.mobile"
            ></el-input>
          </el-form-item>
          <el-form-item
            name="btnSearchNote"
            label="备注："
            prop="remark"
            @keyup.native.enter="onSearch"
          >
            <el-input
              name="btnEnterRemark"
              v-model="queryForm.remark"
            ></el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-row class="m-y-10">
      <el-table
        class="fz-14"
        :stripe="true"
        border
        :data="totalCount"
        :show-header="false"
      >
        <el-table-column align="center">
          <template slot-scope="scope">
            <p class="text-warning fw-b">{{total }}</p>
            <p>当前发送条数</p>
          </template>
        </el-table-column>
        <el-table-column align="center">
          <template slot-scope="scope">
            <p class="text-danger fw-b">{{scope.row.totalCount }}</p>
            <p>累计发送条数</p>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-table
      :data="data"
      v-loading="$store.getters.tb_loading"
      element-loading-text="拼命加载中"
    >
      <el-table-column
        prop="sendTime"
        label="时间"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="templateTypeText"
        label="模板类型"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="templateName"
        label="模板名称"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="smsContent"
        label="短信内容"
        min-width="200"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="storeAdministratorId"
        label="门店账号"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="storeName"
        label="门店名称"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
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
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination.vue'
import { TemplateTypes } from '@/enums/message'
import {
  MESSAGE_API_SENDLOG_SEARCHLIST,
  MESSAGE_API_SENDLOG_SEARCHTOTAL
} from '@/apis/message'
import dayjs from 'dayjs'
export default {
  data() {
    return {
      templateTypes: TemplateTypes,
      queryForm: {
        templateType: '',
        storeAdministratorId: '',
        storeName: '',
        mobile: '',
        remark: '',
        sendTime: [
          dayjs()
            .subtract(6, 'days')
            .format('YYYY-MM-DD'),
          dayjs().format('YYYY-MM-DD')
        ],
        pageIndex: 1,
        pageSize: 20
      }, // 用于搜索条件双向数据绑定的数据变化
      parameter: {}, // 用于传给后台接口做数据帅选
      total: 0,
      data: [],
      totalCount: [
        {
          rangeCount: 0,
          totalCount: 0
        }
      ]
    }
  },
  methods: {
    initRoute() {
      this.$router.replace({
        path: '/message/messageRecord/index',
        query: JSON.parse(JSON.stringify(this.parameter))
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.templateId = query.templateId || ''
      this.parameter.templateType = query.templateType || ''
      this.parameter.mobile = query.mobile || ''
      this.parameter.remark = query.remark || ''
      this.parameter.sendTime = query.sendTime || [
        dayjs()
          .subtract(6, 'days')
          .format('YYYY-MM-DD'),
        dayjs().format('YYYY-MM-DD')
      ]
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.pageSize = query.pageSize || 20
      this.getData()
      this.getTotal()
    },
    getData() {
      let sendTime = this.parameter.sendTime || ['', '']
      this.$store.commit('SET_TB_LOADING', true)
      let parameter = Object.assign(this.queryForm, this.parameter, {
        startTime: sendTime[0],
        endTime: sendTime[1]
      })
      this.$store.commit('SET_TB_LOADING', true)
      MESSAGE_API_SENDLOG_SEARCHLIST(parameter).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows
          this.total = res.data.Data.total
        }
      })
    },
    currentChange(val) {
      // 切换当前页
      this.parameter.pageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameter.pageIndex = 1
      this.parameter.pageSize = val
      this.initRoute()
    },
    onSearch() {
      // 搜索相关
      this.queryForm.pageIndex = 1
      this.parameter = Object.assign({}, this.queryForm)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
        this.getTotal()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs['queryForm'].resetFields()
      this.queryForm.sendTime = [
        dayjs()
          .subtract(6, 'days')
          .format('YYYY-MM-DD'),
        dayjs().format('YYYY-MM-DD')
      ]
      this.onSearch()
    },
    getTotal() {
      let sendTime = this.parameter.sendTime || ['', '']
      this.$store.commit('SET_TB_LOADING', true)
      let parameter = Object.assign(this.queryForm, this.parameter, {
        startTime: sendTime[0],
        endTime: sendTime[1]
      })
      MESSAGE_API_SENDLOG_SEARCHTOTAL(parameter).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.totalCount = [res.data.Data]
        }
      })
    }
  },
  beforeMount() {
    this.init()
  },
  mounted() {},
  watch: {
    $route: 'init'
  },
  components: {
    searchPanel,
    pagination
  }
}
</script>
