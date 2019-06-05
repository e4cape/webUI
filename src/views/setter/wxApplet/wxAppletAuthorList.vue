<template>
  <div>
    <el-form
      @keyup.enter.native="onSearch"
      :model="form"
      ref="search"
      lable-width="120px"
      class="item-lh-26"
      :inline="true"
    >
      <search-panel
        @onSearch="onSearch"
        @onReset="onReset"
      >
        <template slot="simpleSearch">
          <el-form-item prop="AuthStatus">
            <el-select
              name="AuthStatus"
              @change="onSearch"
              v-model="form.AuthStatus"
            >
              <el-option
                label="全部"
                :value="-1"
              ></el-option>
              <el-option
                v-for="item in WxAuthorizerStatus.TypeArray"
                :key="item.KeyId"
                :label="item.Value"
                :value="item.KeyId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="CompanyCode">
            <el-input
              name="CompanyCode"
              v-model="form.CompanyCode"
              placeholder="公司编码"
            >
              <el-button
                @click="onSearch"
                slot="append"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item
            label="公司编码："
            prop="CompanyCode"
          >
            <el-input
              name="CompanyCode"
              v-model="form.CompanyCode"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="公司名称："
            prop="CompanyTitle"
          >
            <el-input
              name="CompanyTitle"
              v-model="form.CompanyTitle"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="门店编码："
            prop="EnglishID"
          >
            <el-input
              name="EnglishID"
              v-model="form.EnglishID"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="门店名称："
            prop="StoreTitle"
          >
            <el-input
              name="StoreTitle"
              v-model="form.StoreTitle"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="最近更新时间："
            prop="CreateTime"
          >
            <el-date-picker
              v-model="form.CreateTime"
              name="CreateTime"
              type="daterange"
              :unlink-panels="true"
              @change="dateChange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="$root.datePickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item
            v-show="false"
            prop="CheckTime1"
          >
            <el-input
              name="CheckTime1"
              v-model="form.CheckTime1"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-show="false"
            prop="CheckTime2"
          >
            <el-input
              name="CheckTime2"
              v-model="form.CheckTime2"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="授权状态："
            prop="AuthStatus"
          >
            <el-select
              name="AuthStatus"
              v-model="form.AuthStatus"
              placeholder="请选择"
            >
              <el-option
                label="全部"
                :value="-1"
              ></el-option>
              <el-option
                v-for="item in WxAuthorizerStatus.TypeArray"
                :key="item.KeyId"
                :label="item.Value"
                :value="item.KeyId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="关联公众号："
            prop="UnStatus"
          >
            <el-select
              name="UnStatus"
              v-model="form.UnStatus"
              placeholder="请选择"
            >
              <el-option
                label="全部"
                :value="-1"
              ></el-option>
              <!-- <el-option
                v-for="(item, index) in WxAppletUnStatus.TypeArray"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option> -->
              <el-option
                v-for="item in WxAppletUnStatus.TypeArray"
                :key="item.KeyId"
                :label="item.Value"
                :value="item.KeyId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="公众号昵称："
            prop="NickName"
          >
            <el-input
              name="NickName"
              v-model="form.NickName"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="绑定平台："
            prop="PlatformBind"
          >
            <el-select
              name="PlatformBind"
              v-model="form.PlatformBind"
              placeholder="请选择"
            >
              <el-option
                label="全部"
                :value="-1"
              ></el-option>
              <el-option
                v-for="item in PlatformBind.TypeArray"
                :key="item.KeyId"
                :label="item.Value"
                :value="item.KeyId"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table
      :data="tableData"
      v-loading="$store.getters.tb_loading"
    >
      <el-table-column
        label="授权序号"
        :formatter="formatData"
        prop="AuthorizerId"
        min-width="150"
        show-overflow-tooltip
        fixed
      ></el-table-column>
      <el-table-column
        label="公司编码"
        prop="CompanyCode"
        min-width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        align="center"
        label="公司名称"
        min-width="100"
        prop="CompanyTitle"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="门店编码"
        prop="EnglishID"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="门店名称"
        prop="StoreTitle"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="授权状态"
        prop="AuthStatus"
        :formatter="formatData"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="最近更新时间"
        prop="CheckTime"
        :formatter="formatData"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{scope.row.CheckTime | filterDateTime}}
        </template>
      </el-table-column>
      <el-table-column
        label="关联公众号"
        prop="UnStatus"
        :formatter="formatData"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="关联公众号昵称"
        prop="NickName"
        min-width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="绑定平台"
        prop="PlatformBind"
        :formatter="formatData"
        min-width="80"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="微信平台ID"
        prop="OpenAppId"
        min-width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="操作"
        show-overflow-tooltip
        min-width="100"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            name="bindAccount"
            v-if="scope.row.PlatformBind == PlatformBind.No && scope.row.AuthStatus == WxAuthorizerStatus.Auth"
            type="text"
            @click="bindAccount(scope.row.AppId, scope.row.AuthorizerAppId)"
          >绑定平台</el-button>
          <el-button
            name="cancelAuth"
            v-if="scope.row.AuthStatus == WxAuthorizerStatus.Auth"
            type="text"
            @click="cancelAuth(scope.row)"
          >取消授权</el-button>
          <span
            v-else
            type="text"
          >-</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :pg="form.PageIndex"
      :size="form.PageSize"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
  </div>
</template>
<script>
import dayjs from 'dayjs'

import {
  MARKETING_API_WX_APPLET_APPLETLIST, // 小程序 - 小程序授权列表
  MARKETING_API_WX_APPLET_UNBINDAPPLET, // 小程序 - 小程序取消授权
  MARKETING_API_WX_APPLET_BINDOPENACCOUNT //  小程序 - 绑定平台
} from '@/apis/marketing.js'

import { WxAuthorizerStatus, CharacterType } from '@/enums/common'
import {
  WxAppletStatus,
  PlatformBind,
  WxAppletUnStatus
} from '@/enums/component'

import pagination from '@/components/pagination.vue'
import searchPanel from '@/components/searchPanel.vue'

export default {
  components: {
    pagination,
    searchPanel
  },
  data() {
    return {
      form: {
        CompanyCode: '',
        CompanyTitle: '',
        StoreTitle: '',
        EnglishID: '',
        NickName: '',
        CheckTime1: '',
        CheckTime2: '',
        CreateTime: [],
        AuthStatus: -1,
        UnStatus: -1,
        PlatformBind: -1,
        PageIndex: 1,
        PageSize: 20
      },
      parameter: {},
      CharacterType,
      total: 0,
      tableData: [],
      PlatformBind: PlatformBind,
      WxAuthorizerStatus: WxAuthorizerStatus,
      WxAppletStatus: WxAppletStatus,
      WxAppletUnStatus: WxAppletUnStatus
    }
  },
  watch: {
    $route: 'init'
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let query = this.$route.query
      this.parameter.CompanyCode = query.CompanyCode || ''
      this.parameter.CompanyTitle = query.CompanyTitle || ''
      this.parameter.EnglishID = query.EnglishID || ''
      this.parameter.StoreTitle = query.StoreTitle || ''
      this.parameter.AuthStatus = query.AuthStatus > -1 ? query.AuthStatus : -1
      this.parameter.UnStatus = query.UnStatus > -1 ? query.UnStatus : -1
      this.parameter.NickName = query.NickName || ''
      this.parameter.PlatformBind =
        query.PlatformBind > -1 ? query.PlatformBind : -1
      this.parameter.CheckTime1 = query.CheckTime1 || ''
      this.parameter.CheckTime2 = query.CheckTime2 || ''
      this.parameter.CreateTime = query.CreateTime || []

      this.parameter.PageSize = query.PageSize || 20
      this.parameter.PageIndex = query.PageIndex || 1
      this.getData()
    },
    initRoute() {
      this.$router.replace({
        path: '/setter/wxapplet/wxappletauthorlist',
        query: this.parameter
      })
    },
    onSearch() {
      this.form.PageIndex = 1
      this.parameter = JSON.parse(JSON.stringify(this.form))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.$refs['search'].resetFields()
      this.form.AuthStatus = -1
      this.onSearch('true')
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      const { CreateTime } = this.parameter
      const parameter = Object.assign(this.form, this.parameter, {
        CreateTime1: CreateTime[0],
        CreateTime2: CreateTime[1]
      })
      MARKETING_API_WX_APPLET_APPLETLIST(parameter).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    bindAccount(AppId, AuthorizerAppId) {
      MARKETING_API_WX_APPLET_BINDOPENACCOUNT(
        Object.assign(
          {},
          {
            AppId: AppId
          },
          {
            AuthorizerAppId: AuthorizerAppId
          }
        )
      ).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.$message({
            type: 'success',
            message: '绑定平台成功！'
          })
          this.getData()
        }
      })
    },
    cancelAuth(data) {
      let obj = Object.assign(
        {},
        {
          CompanyId: data.CompanyId,
          CharacterId: data.CharacterId,
          AppId: data.AppId
        }
      )
      MARKETING_API_WX_APPLET_UNBINDAPPLET(obj).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.$message({
            type: 'success',
            message: '取消授权成功！'
          })
          this.getData()
        }
      })
    },
    dateChange(value) {
      if (value) {
        this.form.CheckTime1 = dayjs(new Date(value[0])).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        this.form.CheckTime2 = dayjs(new Date(value[1])).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      } else {
        this.form.CheckTime1 = ''
        this.form.CheckTime2 = ''
      }
    },
    sizeChange(value) {
      // 切换每页显示数
      this.parameter.PageSize = value
      this.parameter.PageIndex = 1
      this.initRoute()
    },
    currentChange(value) {
      // 切换当前页
      this.parameter.PageIndex = value
      this.initRoute()
    },
    formatData(row, column) {
      switch (column.property) {
        case 'AuthStatus':
          return WxAuthorizerStatus.Types[row[column.property]]
        case 'PlatformBind':
          return this.PlatformBind.Types[row[column.property]]
        case 'UnStatus':
          return this.WxAppletUnStatus.Types[row[column.property]]
        case 'AuthorizerId':
          return row.CharacterType == this.CharacterType.Company
            ? row[column.property] + ' (总部授权)'
            : row[column.property] + ' (门店授权)'
        default:
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-input .el-input {
  width: 248px;
}
</style>

