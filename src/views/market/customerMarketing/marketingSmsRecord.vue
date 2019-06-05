<template>
  <div>
    <el-form :model="form" ref="search" label-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <member-Export :records="selectTable" :apiParameter="parameter" :apiKey="apiKey"></member-Export>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="mobile">
            <el-input name="inputMobile" v-model="form.mobile" placeholder="手机" @keyup.native.enter="onSearch">
              <el-button name="btnOnSearch" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="短信模板：" prop="templateId">
            <el-select name="selectTemplateId" v-model="form.templateId">
              <el-option label="所有模板" value></el-option>
              <el-option v-for="item in templateArr" :key="item.templateId" :label="item.templateName" :value="item.templateId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客户ID：" prop="memberId">
            <el-input name="inputMemberId" v-model="form.memberId " @keyup.native.enter="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="trueName">
            <el-input name="inputTrueName" v-model="form.trueName" @keyup.native.enter="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="手机：" prop="mobile">
            <el-input name="inputMobiles" v-model="form.mobile" @keyup.native.enter="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="会员卡号：" prop="vipCardNo">
            <el-input name="inputVipCardNo" v-model="form.vipCardNo" @keyup.native.enter="onSearch"></el-input>
          </el-form-item>
          <el-form-item name="datePickerSendTime" label="发送日期：" prop="sendTime">
            <el-date-picker
              v-model="sendTime"
              @change="dateChange"
              value-format="yyyy-MM-dd"
              type="daterange"
              align="left"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
            ></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" @sort-change="sortChange" @selection-change="handleSelectionChange" v-loading="$store.getters.tb_loading">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="发送时间" prop="sendTime" min-width="100" show-overflow-tooltip sortable></el-table-column>
      <el-table-column label="基本信息" min-width="400">
        <template slot-scope="scope">
          <user-Info :scope="scope.row"></user-Info>
        </template>
      </el-table-column>
      <el-table-column label="短信模板" prop="templateName" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="短信内容" prop="templateContent" min-width="200" show-overflow-tooltip></el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.pageIndex" :size="form.pageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>
<script>
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination.vue'
import userInfo from '@/components/scrm/userInfo'
import memberExport from '@/components/scrm/memberExport'
import {
  MEMBERSHIP_API_MESSAGEITEM_GETMESSAGELOGS
} from '@/apis/membership'
import {
  MESSAGE_API_SETTINGTEMPLATE_GETTEMPLATELIST
} from '@/apis/message'
import {
  MessageTaskStatus, SendTypes
} from '@/enums/membership'
import { YNStatus } from '@/enums/common'

export default {
  data() {
    return {
      apiKey: 'MESSAGEITEM_GETMESSAGELOGS', // 导出api
      selectTable: [], // 导出列
      // 表格分页相关
      form: {
        templateId: '', // 模板Id
        memberId: '', // 会员序号
        trueName: '', // 真实姓名
        mobile: '', // 手机号码
        vipCardNo: '', // 会员卡号
        sendTimeStart: '',
        sendTimeEnd: '',
        orderField: '',
        orderType: YNStatus.No,
        pageIndex: 0,
        pageSize: 0
      },
      templateArr: [], // 短信模板数据
      sendTime: [], // 发送时间
      parameter: {
      },
      tableData: [],
      total: 0
    }
  },
  computed: {
    EnumMessageTaskStatus() {
      return MessageTaskStatus
    },
    EnumSendTypes() {
      return SendTypes
    }
  },
  watch: {
    $route: 'init'
  },
  beforeMount() {
    this.getTemplateList()
  },
  mounted() {
    this.init()
  },
  methods: {
    // 表格分页相关
    init() {
      const {
        query
      } = this.$route
      this.parameter.templateId = query.templateId || ''
      this.parameter.memberId = query.memberId || ''
      this.parameter.trueName = query.trueName || ''
      this.parameter.mobile = query.mobile || ''
      this.parameter.vipCardNo = query.vipCardNo || ''
      this.parameter.sendTimeStart = query.sendTimeStart || ''
      this.parameter.sendTimeEnd = query.sendTimeEnd || ''
      this.parameter.pageSize = query.pageSize || 10
      this.parameter.pageIndex = query.pageIndex || 1
      this.sendTime = this.parameter.sendTimeStart
        ? [this.parameter.sendTimeStart, this.parameter.sendTimeEnd]
        : []
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: '/market/customerMarketing/marketingSmsRecord',
        query: this.parameter
      })
    },
    currentChange(val) {
      this.parameter.pageIndex = val
      this.selectTable = []
      this.initRoute()
    },
    sizeChange(val) {
      this.parameter.pageIndex = 1
      this.parameter.pageSize = val
      this.selectTable = []
      this.initRoute()
    },
    onSearch() {
      this.form.pageIndex = 1
      this.parameter = Object.assign({}, this.form)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.parameter)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      this.$refs['search'].resetFields()
      this.form.sendTimeStart = ''
      this.form.sendTimeEnd = ''
      this.sendTime = ''
      this.onSearch()
    },
    dateChange(v) {
      if (v && v.length > 0) {
        this.form.sendTimeStart = v[0]
        this.form.sendTimeEnd = v[1]
      } else {
        this.form.sendTimeStart = ''
        this.form.sendTimeEnd = ''
      }
    },
    // 选择表格行
    handleSelectionChange(val) {
      if (val.length) {
        this.selectTable = val.map(item => item.messageItemId)
      } else {
        this.selectTable = []
      }
    },
    // -获取短信模板
    getTemplateList() {
      const param = {
        templateType: ''
      }
      MESSAGE_API_SETTINGTEMPLATE_GETTEMPLATELIST(param).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.templateArr = res.data.Data
        }
      })
    },
    // -获取短信任务列表
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      this.form = Object.assign(this.form, this.parameter)
      MEMBERSHIP_API_MESSAGEITEM_GETMESSAGELOGS(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.rows
          this.total = res.data.Data.total
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    // -排序
    sortChange({
      prop, order
    }) {
      this.form.orderField = prop || ''
      this.form.orderType = order == 'ascending' ? YNStatus.Yes : YNStatus.No
      this.getData()
    }
  },
  components: {
    searchPanel,
    pagination,
    userInfo,
    memberExport
  }
}
</script>

