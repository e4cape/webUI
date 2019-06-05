<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button name="btnEopen" type="primary" @click="eOpen = true">导出</el-button>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="status">
            <el-select name="selectStatus" v-model="queryForm.status" placeholder="所有状态" @change="onStatusChange">
              <el-option label="所有状态" value></el-option>
              <el-option v-for="(item,index) in giveScoreStatus.Types" :key="index" :label="item.title" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="orderNo">
            <el-input name="inputOrderNo" v-model="queryForm.orderNo" placeholder="相关单号" @keyup.enter.native="onSearch">
              <el-button name="btnOnSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="赠送方式：" prop="expireType">
            <el-select name="selectExpireType" v-model="queryForm.expireType" placeholder="赠送方式">
              <el-option label="所有方式" value></el-option>
              <el-option v-for="(item,index) in scoreExpireTypes.Types" :key="index" :label="item.title" :value="item.key"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="赠送类型: " prop="scoreType">
            <el-select name="selectScoreType" v-model="queryForm.scoreType" placeholder="赠送类型">
              <el-option label="所有类型" value></el-option>
              <el-option v-for="(item,index) in scoreTypes.Types" :key="index" :label="item.title" :value="item.key"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item name="datePickerGiveTime" label="赠送时间:" prop="giveTime">
            <el-date-picker v-model="queryForm.giveTime" :unlink-panels="true" type="daterange" format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>

          <el-form-item name="datePickerExpireTime" label="到期时间:" prop="expireTime">
            <el-date-picker v-model="queryForm.expireTime" :unlink-panels="true" type="daterange" format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>

          <!-- <el-form-item label="相关单号:" prop="orderNo">
            <el-input v-model="queryForm.orderNo" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>-->
          <el-form-item label="会员编号:" prop="memberId">
            <el-input name="inputMemberId" v-model="queryForm.memberId" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>

          <el-form-item label="会员手机号:" prop="mobile">
            <el-input name="inputMobile" v-model="queryForm.mobile" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="会员姓名:" prop="memberName">
            <el-input name="inputMemberName" v-model="queryForm.memberName" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>

          <el-form-item label="赠送数量:">
            <el-col :span="11">
              <el-form-item prop="giveAmtMin" class="inline no-margin">
                <el-input name="inptGiveAmtMin" v-model="queryForm.giveAmtMin" :maxlength="9" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="giveAmtMax" class="inline no-margin">
                <el-input name="inputGiveAmtMax" v-model="queryForm.giveAmtMax" :maxlength="9" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="已用数量:">
            <el-col :span="11">
              <el-form-item prop="alreadyUsedAmtMin" class="inline no-margin">
                <el-input name="inputAlreadyUsedAmtMin" v-model="queryForm.alreadyUsedAmtMin" :maxlength="9" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="alreadyUsedAmtMax" class="inline no-margin">
                <el-input name="inputAlreadyUsedAmtMax" v-model="queryForm.alreadyUsedAmtMax" :maxlength="9" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="可用数量:">
            <el-col :span="11">
              <el-form-item prop="usableAmtMin" class="inline no-margin">
                <el-input name="inputUsableAmtMin" v-model="queryForm.usableAmtMin" :maxlength="9" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="usableAmtMax" class="inline no-margin">
                <el-input name="inputUsableAmtMax" v-model="queryForm.usableAmtMax" :maxlength="9" @keyup.enter.native="onSearch"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="门店:" prop="storeName" v-if="isOneNumberManyShopCompany">
            <el-select name="selectStoreName" v-model="queryForm.storeName">
              <el-option label="全部" value></el-option>
              <el-option v-for="(item, index) in $store.getters.stores" :key="index" :label="item.Value" :value="item.CharacterId"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- @module 数据表格  @selection-change="selectionChange" -->
    <el-table :data="data" @sort-change="sortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <!-- <el-table-column type="selection" width="55" fixed="left"></el-table-column> -->
      <el-table-column prop="createTime" label="赠送时间" min-width="160" sortable="custom" show-overflow-tooltip fixed="left"></el-table-column>
      <el-table-column v-if="isOneNumberManyShopCompany" prop="storeName" label="门店" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.storeName || '公司' }}</template>
      </el-table-column>
      <el-table-column prop="expireTypeText" label="赠送方式" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="scoreTypeText" label="赠送类型" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="expireTimeText" label="到期日期" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="giveAmt" label="赠送数量" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="usedAmt" label="已用数量" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="validAmt" label="可用数量" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="trueName" label="会员姓名" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="mobile" label="会员手机" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="prevOrderCode" label="相关单号" min-width="220" show-overflow-tooltip></el-table-column>
      <el-table-column prop="statusText" label="状态" min-width="80" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <pagination :pg="queryForm.pageIndex" :size="queryForm.pageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <export-field-setter @submit="handleSubmit" :visible.sync="eOpen" :apiKey="apiKey" :api="eApi"/>
  </div>
</template>

<script>
import {
  GiveScoreStatus,
  SettingOptionTypes,
  ScoreExpireTypes,
  ScoreTypes
} from '@/enums/membership'
import { YNStatus } from '@/enums/common'
import {
  MEMBERSHIP_API_SCORERECORD_GETGIVESCORE,
  MEMBERSHIP_API_STOREEXPORTER_GETEXPORTFIELDS,
  MEMBERSHIP_API_STOREEXPORTER_EXPORTTOFILE
} from '@/apis/membership'
import {
  DOMAIN_TEMP
} from '@/configs/appSettings'
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import ExportFieldSetter from '@/components/exportFieldSetter'

export default {
  data() {
    return {
      apiKey: 'SCORERECORD_GETGIVESCORE',
      eOpen: false,
      scoreExpireTypes: ScoreExpireTypes,
      giveScoreStatus: GiveScoreStatus,
      settingOptionTypes: SettingOptionTypes,
      scoreTypes: ScoreTypes,
      queryForm: {
        characterId: '',
        giveTime: '',
        giveTimeStart: '',
        giveTimeEnd: '',
        expireTime: '',
        expireTimeStart: '',
        expireTimeEnd: '',
        orderNo: '',
        memberId: '',
        mobile: '',
        memberName: '',
        giveAmtMin: '',
        giveAmtMax: '',
        alreadyUsedAmtMin: '',
        alreadyUsedAmtMax: '',
        usableAmtMin: '',
        usableAmtMax: '',
        expireType: '',
        scoreType: '',
        status: '',
        orderField: '',
        orderType: YNStatus.No,
        pageIndex: 1,
        pageSize: 20,
        storeName: ''
      },
      parameters: {
      },
      data: [],
      total: 0,
      eApi: MEMBERSHIP_API_STOREEXPORTER_GETEXPORTFIELDS
    }
  },
  methods: {
    init() {
      let query = this.$route.query || {
      }
      this.queryForm = Object.assign(this.queryForm, query)
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      this.queryForm = Object.assign(this.queryForm, this.parameters)
      MEMBERSHIP_API_SCORERECORD_GETGIVESCORE(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.rows || []
          this.total = res.data.Data.total || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.queryForm.OrderBy = 1
          break
        case 'PurchaseCode':
          this.queryForm.OrderBy = 2
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsc =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.onSearch()
    },
    onSearch() {
      // 搜索相关
      this.queryForm.pageIndex = 1
      this.queryForm.isSenior = true
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      this.initRoute()
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.pageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.pageIndex = 1
      this.parameters.pageSize = val
      this.initRoute()
    },
    onStatusChange() {
      this.queryForm.pageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      this.initRoute()
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path, query: this.parameters
      })
      this.getData()
    },
    async handleSubmit(exportFields) {
      try {
        const apiParameter = this.parameters
        const para = {
          exportFields,
          apiKey: this.apiKey,
          exportType: 1,
          apiParameter
        }
        const res = await MEMBERSHIP_API_STOREEXPORTER_EXPORTTOFILE(para)
        const tempPath = DOMAIN_TEMP
        if (res.data.Data) {
          setTimeout(() => {
            const downloadUrl = `${tempPath}${res.data.Data}`
            window.location.href = downloadUrl
            this.eOpen = false
          }, 3000)
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.uploading = false
      }
    }
  },
  components: {
    searchPanel,
    pagination,
    ExportFieldSetter
  },
  mounted() {
    this.init()
    this.$store.dispatch('GET_STORES_DROPLIST')
  },
  filters: {
    filterGivingClazz(value) {
      const v = String(value)
      const result = ScoreTypes.Types.find(
        ({
          key
        }) => String(key) === String(v)
      )
      return result ? result.title : ''
    },
    valueFilter(val) {
      return val
    },
    labelFilter(val) {
      return Object.entries(val)
        .map(([k]) => k)
        .shift()
    }
  },
  watch: {
    'queryForm.expireTime': {
      immediate: true,
      handler(newVal = []) {
        this.queryForm.expireTimeStart = newVal[0]
        this.queryForm.expireTimeEnd = newVal[1]
      }
    },
    'queryForm.giveTime': {
      immediate: true,
      handler(newVal = []) {
        this.queryForm.giveTimeStart = newVal[0]
        this.queryForm.giveTimeEnd = newVal[1]
      }
    }
  }
}
</script>

<style>
</style>
