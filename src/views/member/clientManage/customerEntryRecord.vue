<template>
  <div class="content" v-loading="tableLoading">
    <el-form :model="formData" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <member-Export :records="selectTable" :apiParameter="parameter" :apiKey="apiKey"></member-Export>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="visitBookId">
            <el-input name="inputvipCardNo" v-model="formData.vipCardNo" placeholder="卡号" @keyup.enter.native="onSearch">
              <el-button name="btnOnSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="客户ID：" prop="memberId">
            <el-input name="inputMemberId" v-model="formData.memberId" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="trueName">
            <el-input name="inputTrueName" v-model="formData.trueName" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="手机：" prop="mobile">
            <el-input name="inputMobile" v-model="formData.mobile" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="会员卡号：" prop="vipCardNo">
            <el-input name="inputVipCardNo" v-model="formData.vipCardNo" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="昵称：" prop="aliasName">
            <el-input name="inputAliasName" v-model="formData.aliasName" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item name="datePickerSubscrTime" label="进店时间：" prop="enterStoreTime">
            <el-date-picker
              v-model="formData.subscrTime"
              type="daterange"
              align="center"
              unlink-panels
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              @change="timeChange"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="门店：" prop="characterId">
            <el-select name="selectCharacterId" size="mini" v-model="formData.characterId" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option v-for="item in fanAttribution" :key="item.CharacterId" :label="item.Value" :value="item.CharacterId"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" @selection-change="handleSelectionChange" @sort-change="sortChange">
      <el-table-column type="selection" width="30"></el-table-column>
      <el-table-column prop="entryTime" label="进店时间" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column prop="storeName" label="门店" v-if="$store.getters.user_session.CharacterType != characterType.Store" show-overflow-tooltip></el-table-column>
      <el-table-column label="基本信息" width="400" style="position: relative">
        <template slot-scope="scope">
          <user-Info :scope="scope.row.memberBasicInfo || {}"></user-Info>
        </template>
      </el-table-column>
      <el-table-column prop="stayMinute" label="停留时间" min-width="120" sortable="custom" show-overflow-tooltip></el-table-column>
      <el-table-column label="意向商品" show-overflow-tooltip>
        <template slot-scope="scope">
          <p>{{ scope.row.goodsMaterial1 }}{{ scope.row.goodsCategory1 }}</p>
          <p>{{ scope.row.goodsMaterial2 }}{{ scope.row.goodsCategory2 }}</p>
        </template>
      </el-table-column>
      <el-table-column label="预算价格" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.budgetStart }} ~ {{ scope.row.budgetEnd }}</template>
      </el-table-column>
      <el-table-column label="意向商品价格" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.goodsPriceStart }} ~ {{ scope.row.goodsPriceEnd }}</template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
    </el-table>
    <pagination :total="page.total" :pg="formData.pageIndex" :size="formData.pageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>
<script>
import searchPanel from '@/components/searchPanel.vue'
import userInfo from '@/components/scrm/userInfo.vue'
import pagination from '@/components/pagination.vue'
import memberExport from '@/components/scrm/memberExport'
import dayjs from 'dayjs'
import { CharacterType, YNStatus } from '@/enums/common'
import {
  MEMBERSHIP_API_MEMBERENTERSTORE_SEARCH
} from '@/apis/membership.js'
import {
  MERCHANT_API_DROPDOWN_STORELIST
} from '@/apis/merchant.js'
import {
  mixin
} from './common'

export default {
  mixins: [mixin],
  data() {
    return {
      characterType: CharacterType,
      apiKey: 'MEMBERENTERSTORE_SEARCH', // 导出api
      page: {
        total: 0
      },
      formData: {
        memberId: '', // 会员id
        trueName: '', // 姓名
        mobile: '', // 手机号码
        vipCardNo: '', // 卡号
        aliasName: '', // 昵称
        subscrTime: [], // 关注时间
        pageSize: 10,
        pageIndex: 1,
        orderField: 'entryTime',
        orderType: YNStatus.No,
        characterId: ''
      }, // 高级搜索
      parameter: {
      }, // 用于传给后台接口做数据帅选
      tableData: [], // 表格数据
      selectsTableData: [], // 表格的选中项
      batchAbled: true, // 批量操作禁止操作
      tableLoading: false, // 列表loading
      fanAttribution: [], // 粉丝归属下拉
      selectTable: []
    }
  },
  components: {
    searchPanel,
    userInfo,
    pagination,
    memberExport
  },
  methods: {
    // 表格排序
    sortChange(val) {
      this.formData.orderType = val.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.formData.orderField = val.prop || ''
      this.onSearch()
    },
    timeChange(val) {
      if (val) {
        this.formData.enterStoreTimeStart = dayjs(val[0]).format('YYYY-MM-DD')
        this.formData.enterStoreTimeEnd = dayjs(val[1]).format('YYYY-MM-DD')
      } else {
        this.formData.enterStoreTimeStart = ''
        this.formData.enterStoreTimeEnd = ''
      }
    },
    init() {
      let query = this.$route.query
      this.parameter.pageSize = query.pageSize || 10
      this.parameter.pageIndex = query.pageIndex || 1
      this.parameter.memberId = query.memberId || ''
      this.parameter.trueName = query.trueName || ''
      this.parameter.aliasName = query.aliasName || ''
      this.parameter.vipCardNo = query.vipCardNo || ''
      this.parameter.orderField = query.orderField || 'entryTime'
      this.parameter.orderType = query.orderType || YNStatus.No
      this.parameter.enterStoreTimeStart = query.enterStoreTimeStart || ''
      this.parameter.enterStoreTimeEnd = query.enterStoreTimeEnd || ''
      this.parameter.mobile = query.mobile || ''
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: '/member/clientManage/customerEntryRecord',
        query: this.parameter
      })
    },
    // 切换当前页
    currentChange(val) {
      this.parameter.pageIndex = val
      this.selectTable = []
      this.initRoute()
    },
    // 切换每页显示条数
    sizeChange(val) {
      this.parameter.pageIndex = 1
      this.parameter.pageSize = val
      this.selectTable = []
      this.initRoute()
    },
    // 重置
    onReset() {
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    onSearch() {
      this.formData.pageIndex = 1
      this.parameter = JSON.parse(JSON.stringify(this.formData))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.formData)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    // 获取列表数据
    getData() {
      this.tableLoading = true
      this.formData = Object.assign(this.formData, this.parameter)
      MEMBERSHIP_API_MEMBERENTERSTORE_SEARCH(this.formData).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.tableLoading = false
          this.tableData = res.data.Data.rows
          this.page.total = res.data.Data.total
        }
      })
    },
    // 选择表格行
    handleSelectionChange(val) {
      this.selectsTableData = val
      if (val.length) {
        this.selectTable = val.map(item => item.memberId)
      } else {
        this.selectTable = []
      }
    },
    getStorList() {
      MERCHANT_API_DROPDOWN_STORELIST({
        characterId: this.$store.getters.user_session.CharacterId
      }).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.fanAttribution = res.data.Data.Rows
        }
      })
    }
  },
  mounted() {
    this.init()
    this.getStorList()
  },
  watch: {
    $route: 'init'
  }
}
</script>
<style lang="scss" scoped>
$d: #ddd;
$w: #fff;
.lookOver {
  color: #409eff;
  cursor: pointer;
}
.record_body {
  padding: 0;
}
.elDialog {
  /deep/ .el-dialog__body {
    padding: 0 !important;
  }
  /deep/ .el-dialog {
    min-width: 750px;
  }
}
.icon-set {
  font-size: 17px;
  position: absolute;
  top: 6px;
  margin-left: 7px;
  color: #399fe5;
  cursor: pointer;
}
</style>
