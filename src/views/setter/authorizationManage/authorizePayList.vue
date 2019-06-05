<template>
  <div>
    <el-form :model="form" @keyup.enter.native="onSearch" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="simpleSearch">
          <el-form-item>
            <el-select name="AuthorizerType" @change="onSearch" v-model="form.AuthorizerType">
              <el-option label="所有状态" :value="0"></el-option>
              <el-option v-for="(item, index) in PaymentAuthorizerTypeOpt" :key="index" :label="item.label" :value="+item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="CompanyCode">
            <el-input name="CompanyCode" v-model="form.CompanyCode" placeholder="公司编号">
              <el-button name="search" @click="onSearch" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="公司编号：" prop="CompanyCode">
            <el-input name="CompanyCode" v-model="form.CompanyCode"></el-input>
          </el-form-item>
          <el-form-item label="门店编号：" prop="StoreCode">
            <el-input name="StoreCode" v-model="form.StoreCode"></el-input>
          </el-form-item>
          <el-form-item label="授权类型：" prop="AuthorizerType">
            <el-select name="AuthorizerType" v-model="form.AuthorizerType">
              <el-option label="所有状态" :value="0"></el-option>
              <el-option v-for="(item, index) in PaymentAuthorizerTypeOpt" :key="index" :label="item.label" :value="+item.value"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <el-table :data="tableData" v-loading="$store.getters.tb_loading">
      <el-table-column fixed show-overflow-tooltip label="授权序号" width="150" prop="AuthorizerId"></el-table-column>
      <el-table-column label="授权类型" width="150" :formatter="formatType" prop="AuthorizerType"></el-table-column>
      <el-table-column label="公司编号" width="160" prop="CompanyCode"></el-table-column>
      <el-table-column label="门店编号" width="160" prop="StoreCode"></el-table-column>
      <el-table-column show-overflow-tooltip label="微信AppID" width="160" prop="WxMchAppId"></el-table-column>
      <el-table-column label="微信门店号" width="160" prop="WxMchId"></el-table-column>
      <el-table-column show-overflow-tooltip label="微信门店密钥" width="160" prop="WxMchKey"></el-table-column>
      <el-table-column show-overflow-tooltip label="微信证书" width="160" prop="WxMchCert"></el-table-column>
      <el-table-column show-overflow-tooltip label="阿里AppID" width="160" prop="AliAppId"></el-table-column>
      <el-table-column show-overflow-tooltip width="160" label="阿里门店号" prop="AliUserId"></el-table-column>
      <el-table-column show-overflow-tooltip label="阿里授权令牌" width="160" prop="AliToken"></el-table-column>
      <el-table-column show-overflow-tooltip label="阿里刷新令牌" width="160" prop="AliRefreshToken"></el-table-column>
      <el-table-column show-overflow-tooltip label="阿里令牌有效期" width="160" prop="AliExpiresIn1" :formatter="formatter"></el-table-column>
      <el-table-column show-overflow-tooltip label="阿里刷新令牌有效期" width="160" prop="AliExpiresIn2" :formatter="formatter"></el-table-column>
      <el-table-column show-overflow-tooltip fixed="right" width="210" label="门店支付是否已经开通(微信)" prop="WxIsPay">
        <template slot-scope="scoped">
          <el-button
            name="openWithdrawal"
            type="text"
            v-if="scoped.row.WxIsPay === YNStatus.No && scoped.row.WxMchAppId != '' && scoped.row.WxMchId != '' && scoped.row.WxMchKey != '' && scoped.row.WxMchCert != ''"
            class="table-tool"
            @click="openingComfirm($event,scoped.row.AuthorizerId, scoped.$index)"
          >开通微信提现</el-button>
          <span class="p-r-10" v-if="scoped.row.WxIsPay == YNStatus.Yes">已开通微信提现</span>
          <el-button name="cancelAuthorization" type="text" v-if="scoped.row.AliStatus == YNStatus.Yes" class="table-tool" @click="cancelAuth($event,scoped.row.AuthorizerId)">取消支付宝授权</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :pg="form.PageIndex" :size="form.PageSize" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import {
  PAYMENT_API_AUTHORIZER_GETS, // 检索
  PAYMENT_API_AUTHORIZER_AUTHORIZEWXPAYUPDATE, // 微信支付授权(确定开通)
  PAYMENT_API_AUTHORIZER_ALIPAYAUTHORIZECANCEL // 支付宝取消授权
} from '@/apis/payment1'

import { YNStatus } from '@/enums/common.js'
import { PaymentAuthorizerType } from '@/enums/payment.js'

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
        StoreCode: '',
        AuthorizerType: 0,
        PageIndex: 1,
        PageSize: 20
      },
      parameter: {},
      total: 0,
      YNStatus,
      PaymentAuthorizerType,
      tableData: [],
      PaymentAuthorizerTypeOpt: []
    }
  },
  watch: {
    $route: 'init'
  },
  mounted() {
    this.init()
    this.getEnums()
  },
  methods: {
    getEnums() {
      for (let item in PaymentAuthorizerType.Types) {
        if (
          item == this.PaymentAuthorizerType.Compony ||
          item == this.PaymentAuthorizerType.Store
        ) {
          this.PaymentAuthorizerTypeOpt.push({
            label:
              item == this.PaymentAuthorizerType.Compony
                ? '公司授权'
                : '门店授权',
            value: item
          })
        }
      }
    },
    initRoute() {
      this.$router.replace({
        path: '/setter/authorizationManage/authorizepaylist',
        query: this.parameter
      })
    },
    init() {
      let query = this.$route.query
      this.parameter.AuthorizerType = +query.AuthorizerType || 0
      this.parameter.CompanyCode = query.CompanyCode || ''
      this.parameter.StoreCode = query.StoreCode || ''

      this.parameter.PageSize = query.PageSize || 20
      this.parameter.PageIndex = query.PageIndex || 1
      this.getData()
    },
    onSearch() {
      // 搜索相关
      this.form.PageIndex = 1
      this.parameter = Object.assign({}, this.form)
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.form)) {
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
    getData() {
      this.$store.commit('SET_TB_LOADING', true)
      this.form = Object.assign(this.form, this.parameter)
      PAYMENT_API_AUTHORIZER_GETS(this.form).then(res => {
        if (res.data.Code == 'CORRECT') {
          this.tableData = res.data.Data.Rows
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    formatType(row, col) {
      return this.PaymentAuthorizerType.Compony == row[col.property]
        ? '公司授权'
        : this.PaymentAuthorizerType.Store == row[col.property]
          ? '门店授权'
          : '-'
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
    openingComfirm(e, AuthorizerId) {
      e.currentTarget.blur()
      this.$confirm('是否确定开通?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        PAYMENT_API_AUTHORIZER_AUTHORIZEWXPAYUPDATE({
          AuthorizerId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              type: 'success',
              message: '开通成功!'
            })
            this.getData()
            /* this.tableData[i].WxIsPay = this.YNStatus.Yes
            this.$set(this.tableData[i], 'WxIsPay', this.tableData[i].WxIsPay) */
          }
        })
      })
    },
    cancelAuth(e, AuthorizerId) {
      e.currentTarget.blur()
      this.$confirm('取消授权后无法使用支付宝收款，确定要取消授权吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        PAYMENT_API_AUTHORIZER_ALIPAYAUTHORIZECANCEL({
          AuthorizerId
        }).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.$message({
              type: 'success',
              message: '取消授权成功!'
            })
            this.getData()
          }
        })
      })
    },
    formatter(row, col) {
      let current = dayjs(new Date(row[col.property])).format('YYYY-MM-DD')
      return current
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-input .el-input {
  width: 248px;
}
.p-r-10 {
  padding-right: 10px;
}
</style>

