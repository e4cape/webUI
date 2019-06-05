<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" :rules="rules" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button type="primary" :loading="isExportUploading" @click="onExport">导出</el-button>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="PackState">
            <el-select v-model="queryForm.PackState">
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="item in characterPackState.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId + ''"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="memberId">
            <el-input name="StoreCode" v-model="queryForm.StoreCode" placeholder="门店编码" @keyup.enter.native="onSearch">
              <el-button name="btnOnSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item name="StoreCode" label="门店编码：" prop="StoreCode">
            <el-input v-model="queryForm.StoreCode" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>

          <el-form-item prop="StoreName" label="门店名称：">
            <el-input v-model="queryForm.StoreName" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>

          <el-form-item prop="CompanyName" label="归属公司：">
            <el-input v-model="queryForm.CompanyName" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>

          <el-form-item prop="CompanyCode" label="公司编码：">
            <el-input v-model="queryForm.CompanyCode" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>

          <el-form-item prop="PackId" label="套餐等级：">
            <el-select v-model="queryForm.PackId" placeholder="套餐等级">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="item in dicts" :key="item.PackId" :label="item.PackName" :value="item.PackId + ''"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="到期天数：">
            <el-col :span="11">
              <el-form-item prop="Days1" class="inline no-margin">
                <el-input v-model="queryForm.Days1" :maxlength="6" @keyup.enter.native="onSearch" name="Days1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="Days2" class="inline no-margin">
                <el-input v-model="queryForm.Days2" :maxlength="5" @keyup.enter.native="onSearch" name="Days2"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item name="CreateTime" label="到期时间：" prop="createTime">
            <el-date-picker v-model="queryForm.ExpiredTime" type="daterange" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>

          <el-form-item prop="PackState" label="状态：">
            <el-select v-model="queryForm.PackState">
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="item in characterPackState.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId + ''"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- @module 数据表格  -->
    <el-table :data="data" @sort-change="sortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" max-height="800">
      <el-table-column prop="StoreCode" label="门店编码" min-width="100" sortable="custom" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="StoreName" label="门店名称" type="sortable" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CompanyName" label="归属公司" min-width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="PackName" label="套餐等级" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Expiree" label="到期时间" min-width="110" show-overflow-tooltip sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.PackId > 1">{{scope.row.Expiree | filterDate}}</span>
          <span v-if="scope.row.PackId == 1">-</span>
        </template>
      </el-table-column>
      <el-table-column prop="Days" label="到期天数" min-width="100" show-overflow-tooltip sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.PackId > 1">{{scope.row.Days}}</span>
          <span v-if="scope.row.PackId == 1">-</span>
        </template>
      </el-table-column>
      <el-table-column prop="StatusStr" label="状态" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="content" label="操作" min-width="200" fixed="right" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" @click=" $router.push({ path: `/science/shopPackage/tradingRecord?id=${scope.row.CharacterId}` })">交易记录</el-button>
          <el-button type="text" v-if="scope.row.PackId != 1" @click="onManualRenewal(scope.row)">手工续费</el-button>
          <el-button type="text" @click="onManualUpdating(scope.row)">手工升级</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- 升级续费操作 -->
    <manual-dialog v-if="isManualRenewal" :isManualRenewal="isManualRenewal" :allPacks="allPacks" :order="selected" :isRenewal="!isManualUpdating" @confirm="isManualUpdatingChange"/>
  </div>
</template>

<script>
import {
  YNStatus
} from '@/enums/common'
import {
  COLLEGE_API_CHARACTERPACK_GETS,
  COLLEGE_API_SETTINGPACK_DROPDOWNLIST,
  COLLEGE_API_CHARACTERPACK_EXPORT,
  COLLEGE_API_SETTINGPACK_GETS
} from '@/apis/science'
import {
  CharacterPackState
} from '@/enums/science'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import dayjs from 'dayjs'
import _ from 'lodash'

import manualDialog from './manualDialog'

function dateFormat(dayjsInstance) {
  return dayjsInstance.format('YYYY-MM-DD')
}

// TODO: 导出
//      套餐等级
export default {
  data() {
    return {
      isManualRenewal: false,
      isManualUpdating: false,
      selected: {
      },
      characterPackState: CharacterPackState,
      dicts: [],
      data: [],
      allPacks: [],
      total: 0,
      selections: [],
      createUsers: [],
      queryForm: {
        PageIndex: 1,
        PageSize: 20,
        PackId: '0',
        StoreCode: '',
        StoreName: '',
        CompanyName: '',
        CompanyCode: '',
        Days2: '',
        Days1: '',
        Orderby: 0,
        ExpiredTime: '',
        PackState: '0',
        IsAsced: YNStatus.No
      },
      parameters: {
      },
      rules: {
        Days1: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (isNaN(value)) {
                callback(new Error('请输入数字'))
              } else if (
                this.queryForm.Days2 &&
                parseFloat(value) > parseFloat(this.queryForm.Days2)
              ) {
                callback(new Error('起始值不能大于结束值'))
              }
              callback()
            }
          }
        ],
        Days2: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (isNaN(value)) {
                callback(new Error('请输入数字'))
              } else if (
                this.queryForm.Days1 &&
                parseFloat(value) < parseFloat(this.queryForm.Days1)
              ) {
                callback(new Error('结束值不能小于起始值'))
              }
              callback()
            }
          }
        ],
      },
      isExportUploading: false
    }
  },
  methods: {
    getAllPacks() {
      COLLEGE_API_SETTINGPACK_GETS().then(res => {
        if (res.data.Code === 'CORRECT') {
          var allPacks = res.data.Data.Subset
          allPacks.map(item => {
            let Prices = JSON.parse(item.Prices)
            Prices.map(child => {
              child.CouponPrice = (child.CouponPrice / 10000).toFixed(2)
              child.Price = (child.Price / 10000).toFixed(2)
            })
            item.Prices = JSON.stringify(Prices)
          })
          this.allPacks = allPacks
        }
      })
    },
    onExport() {
      this.isExportUploading = true
      const parameters = {
        ...this.queryForm
      }
      let createTime = this.queryForm.ExpiredTime || ['', '']
      let param = {
        Expiree1: createTime[0]
          ? dateFormat(dayjs(createTime[0]).startOf('day'))
          : dateFormat(dayjs('1900-1-1')),
        Expiree2: createTime[1]
          ? dateFormat(dayjs(createTime[1]).endOf('day'))
          : dateFormat(dayjs('1900-1-1')),
        Days1: this.queryForm.Days1 == '' ? -99999 : this.queryForm.Days1, // +-99999代表搜索所有数据
        Days2: this.queryForm.Days2 == '' ? 99999 : this.queryForm.Days2
      }
      delete parameters.ExpiredTime
      COLLEGE_API_CHARACTERPACK_EXPORT({
        ...parameters,
        ...param
      }).then(res => {
        this.isExportUploading = false
        if (res.data.Code === 'CORRECT') {
          window.open(
            this.$root.settings.DOMAIN_EXCEL + res.data.Data,
            '_blank'
          )
        }
      }).catch(() => {
        this.isExportUploading = false
      })
    },
    onManualRenewal(selected) {
      this.isManualRenewal = true
      this.isManualUpdating = false
      this.selected = selected
    },
    onManualUpdating(selected) {
      this.isManualRenewal = true
      this.isManualUpdating = true
      this.selected = selected
    },
    init() {
      let query = this.$route.query || {}
      this.queryForm = Object.assign(
        this.queryForm,
        {
          PageIndex: 1,
          PageSize: 20,
          PackId: '0',
          StoreCode: '',
          StoreName: '',
          CompanyName: '',
          CompanyCode: '',
          Days2: '',
          Days1: '',
          Orderby: 0,
          ExpiredTime: '',
          PackState: '0',
          IsAsced: YNStatus.No
        },
        query
      )
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      const parameters = {
        ...this.queryForm
      }
      let createTime = this.queryForm.ExpiredTime || ['', '']
      let param = {
        Expiree1: createTime[0]
          ? dateFormat(dayjs(createTime[0]).startOf('day'))
          : dateFormat(dayjs('1900-1-1')),
        Expiree2: createTime[1]
          ? dateFormat(dayjs(createTime[1]).endOf('day'))
          : dateFormat(dayjs('1900-1-1')),
        Days1: this.queryForm.Days1 == '' ? -99999 : this.queryForm.Days1, // +-99999代表搜索所有数据
        Days2: this.queryForm.Days2 == '' ? 99999 : this.queryForm.Days2
      }
      Object.assign(this.parameters, this.queryForm)
      delete parameters.ExpiredTime
      COLLEGE_API_CHARACTERPACK_GETS({
        ...parameters,
        ...param
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = (res.data.Data.Subset || []).map(item => {
            const DeductPrice = (item.Days * item.PerPrice + item.DiffPrice).toFixed(2)
            return {
              ...item,
              StatusStr: _.find(CharacterPackState.TypeArray, {
                KeyId: item.PackState + ''
              }).Value,
              DeductPrice: (DeductPrice / 10000).toFixed(2) > 0 ? (DeductPrice / 10000).toFixed(2) : 0
            }
          })
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.queryForm.Orderby = 0
          break
        case 'StoreCode':
          this.queryForm.Orderby = 1
          break
        case 'Expiree':
          this.queryForm.Orderby = 2
          break
        case 'Days':
          this.queryForm.Orderby = 3
          break
        default:
          this.queryForm.Orderby = 3
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    getOptions() {
      COLLEGE_API_SETTINGPACK_DROPDOWNLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.dicts = res.data.Data.Subset
        }
      })
    },
    onSearch() {
      this.$refs['search'].validate(valid => {
        if (valid) {
          this.queryForm.PageIndex = 1
          this.parameters = JSON.parse(JSON.stringify(this.queryForm))
          if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
            this.getData()
          } else {
            this.initRoute()
          }
        }
      })
    },
    onReset() {
      // 重置表单
      this.queryForm = {
        PageIndex: 1,
        PageSize: 20,
        PackId: '0',
        StoreCode: '',
        StoreName: '',
        CompanyName: '',
        CompanyCode: '',
        Days2: '',
        Days1: '',
        Orderby: 0,
        ExpiredTime: '',
        PackState: '0',
        IsAsced: YNStatus.No
      }
      this.$refs['search'].resetFields()
      this.onSearch()
    },
    currentChange(val) {
      // 切换当前页
      this.parameters.PageIndex = val
      this.initRoute()
    },
    sizeChange(val) {
      // 切换每页显示条数
      this.parameters.PageIndex = 1
      this.parameters.PageSize = val
      this.initRoute()
    },
    isManualUpdatingChange() {
      this.isManualRenewal = false
    },
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: JSON.parse(JSON.stringify(this.parameters))
      })
    }
  },
  mounted() {
    this.getOptions()
    this.getAllPacks()
    this.init()
  },
  components: {
    searchPanel,
    pagination,
    manualDialog
  },
  watch: {
    'queryForm.PackState': 'onSearch',
    $route: 'init'
  }
}
</script>
