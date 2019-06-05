<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :rules="rules" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button type="primary" :loading="isExportUploading" @click="onExport">导出</el-button>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-dropdown @command="selectState">
              <el-button name="UserState" type="default">
                {{packOrderBasicState.Types[queryForm.State] || '所有状态'}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0">所有状态</el-dropdown-item>
                <el-dropdown-item v-for="(item, index) in packOrderBasicState.Types" :key="index" :command="index">{{item}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item prop="StoreCode">
            <el-input name="StoreCode" v-model="queryForm.StoreCode" placeholder="门店编码" @keyup.enter.native="onSearch">
              <el-button name="btnOnSearch" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item name="CheckTime" label="交易时间：" prop="CheckTime">
            <el-date-picker v-model="queryForm.CheckTime" type="daterange" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>

          <el-form-item prop="SourceType" label="来源：">
            <el-select name="SourceType" v-model="queryForm.SourceType" placeholder="来源">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in packOrderBasicSourceType.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="OrderType" label="交易类型：">
            <el-select name="OrderType" v-model="queryForm.OrderType" placeholder="交易类型">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in packOrderBasicOrderType.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="PackId" label="交易等级：">
            <el-select name="PackId" v-model="queryForm.PackId" placeholder="来源">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in dicts" :key="index" :label="item.PackName" :value="item.PackId + ''"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop label="购买时长：">
            <el-select name="buyYears" v-model="queryForm.Years" placeholder="全部">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in years" :key="index" :label="item.Year + '年'" :value="item.Year + ''"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="门店编码：" prop="StoreCode">
            <el-input name="StoreCode" v-model="queryForm.StoreCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>

          <el-form-item label="门店名称：" prop="StoreName">
            <el-input name="StoreName" v-model="queryForm.StoreName" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="归属公司：" prop="CompanyName">
            <el-input name="CompanyName" v-model="queryForm.CompanyName" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="公司编码：" prop="CompanyCode">
            <el-input name="CompanyCode" v-model="queryForm.CompanyCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>

          <el-form-item prop="JunkPackState" label="原套餐情况：">
            <el-select name="JunkPackState" v-model="queryForm.JunkPackState" placeholder="全部">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in characterPackState.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="JunkPackId" label="原等级：">
            <el-select name="JunkPackId" v-model="queryForm.JunkPackId" placeholder="全部">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in dicts" :key="index" :label="item.PackName" :value="item.PackId + ''"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="原到期天数：">
            <el-col :span="11">
              <el-form-item prop="JunkDays1" class="inline no-margin">
                <el-input v-model="queryForm.JunkDays1" :maxlength="9" @keyup.enter.native="onSearch" name="JunkDays1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2" class="tc">-</el-col>
            <el-col :span="11">
              <el-form-item prop="JunkDays2" class="inline no-margin">
                <el-input v-model="queryForm.JunkDays2" :maxlength="9" @keyup.enter.native="onSearch" name="JunkDays2"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item prop="PaymentType" label="支付方式：">
            <el-select name="PaymentType" v-model="queryForm.PaymentType" placeholder="全部">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in paymentMethods" :key="index" :label="item.text" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="PaidState" label="支付状态：">
            <el-select name="PaidState" v-model="queryForm.PaidState" placeholder="全部">
              <el-option label="全部" value="0"></el-option>
              <el-option :name="item.Value" v-for="(item, index) in packOrderBasicPaidState.TypeArray" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="State" label="状态：">
            <el-select name="State" v-model="queryForm.State">
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="item in packOrderBasicState.TypeArray" :key="item.KeyId" :label="item.Value" :value="item.KeyId"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- @module 数据表格  -->
    <el-table :data="data" @sort-change="sortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中" max-height="780">
      <el-table-column prop="OrderCode" label="订单号" min-width="160" show-overflow-tooltip fixed="left"></el-table-column>
      <el-table-column prop="CreateTime" label="下单时间" sortable="custom" min-width="110" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column prop="CheckTime" label="交易时间" sortable="custom" min-width="110" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.CheckTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column prop="SourceType" label="来源" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="OrderType" label="交易类型" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="StoreCode" label="门店编码" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="StoreName" label="门店名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CompanyName" label="归属公司" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="JunkPackState" label="原套餐情况" min-width="80">
        <template slot-scope="scope">{{characterPackState.Types[scope.row.JunkPackState]}}</template>
      </el-table-column>
      <el-table-column prop="JunkExpiree" label="原到期时间" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.JunkPackId > 1">{{scope.row.JunkExpiree | filterDate}}</span>
          <span v-if="scope.row.JunkPackId == 1">-</span>
        </template>
      </el-table-column>
      <el-table-column prop="JunkDays" label="原到期天数" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.JunkPackId > 1">{{scope.row.JunkDays}}</span>
          <span v-if="scope.row.JunkPackId == 1">-</span>
        </template>
      </el-table-column>
      <el-table-column prop="JunkPackName" label="原等级" min-width="80"></el-table-column>
      <el-table-column prop="PackName" label="交易等级" min-width="80"></el-table-column>
      <el-table-column prop="Years" label="购买时长" min-width="70">
        <template slot-scope="scope">{{ scope.row.Years }} 年</template>
      </el-table-column>
      <el-table-column sortable="custom" prop="Expiree" label="交易后到期时间" min-width="130">
        <template slot-scope="scope">{{scope.row.Expiree | filterDate}}</template>
      </el-table-column>
      <el-table-column prop="PackPrice" label="套餐金额" min-width="120">
        <template slot-scope="scope">{{scope.row.PackPrice | initPrice}}</template>
      </el-table-column>
      <el-table-column prop="SurplusPrice" label="原套餐抵扣" min-width="120">
        <template slot-scope="scope">{{scope.row.SurplusPrice | initPrice}}</template>
      </el-table-column>
      <el-table-column prop="PaidPrice" label="应付金额" min-width="120">
        <template slot-scope="scope">{{scope.row.PaidPrice | initPrice}}</template>
      </el-table-column>
      <el-table-column prop="CashPrice" label="实付金额" min-width="120">
        <template slot-scope="scope">{{scope.row.CashPrice | initPrice}}</template>
      </el-table-column>
      <el-table-column prop="PaymentType" label="支付方式" min-width="70">
        <template slot-scope="scope">{{scope.row.CashPrice ? scope.row.PaymentType : '无'}}</template>
      </el-table-column>
      <el-table-column prop="PaidNO" label="支付流水号" min-width="220" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.PaidNO == 0 ? '-' : scope.row.PaidNO}}</template>
      </el-table-column>
      <el-table-column prop="PaidState" label="支付状态" min-width="70"></el-table-column>
      <el-table-column prop="State" label="订单状态" min-width="70" fixed="right" show-overflow-tooltip>
        <template slot-scope="scope">
          <template v-if="scope.row.CheckNote">
            <el-tooltip class="item" :content="scope.row.CheckNote" placement="top" effect="light">
              <span class="red">{{packOrderBasicState.Types[scope.row.State]}}</span>
            </el-tooltip>
          </template>
          <template v-else>
            <span>{{packOrderBasicState.Types[scope.row.State]}}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="操作" min-width="90" fixed="right">
        <template slot-scope="scope">
          <div v-if="!scope.row.isManualOrder">-</div>
          <template v-else>
            <el-button type="text" v-if="scope.row.isPassedCheck" @click="onCancelCheck(scope.row)">取消审核</el-button>
            <template v-if="scope.row.isWaitingCheck">
              <el-button type="text" @click="onCheck(scope.row)">审核</el-button>
              <el-button type="text" @click="onInvalid(scope.row)">作废</el-button>
            </template>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <el-dialog :title="cancelName === 'cancel' ? '取消审核' : '作废确认'" :visible.sync="isCancelOpen" width="35%" v-loading="isUploading">
      <el-form label-position="right" label-width="100px" :model="selected">
        <el-form-item label="标题">
          <span>{{ selected.PackName }}</span>
        </el-form-item>
        <el-form-item label="创建：">
          <span>{{ selected.CreateUser || '' + (selected.CreateUser || '-') }}&nbsp;&nbsp;&nbsp;{{selected.CreateTime | filterDateTime}}</span>
        </el-form-item>
        <el-form-item :label="cancelName === 'cancel' ? '取消原因：' : '作废原因：'">
          <el-input v-model="CheckNote" :placeholder="   cancelName === 'cancel' ? '取消原因备注' : '作废原因备注' "></el-input>
        </el-form-item>
        <div style="font-size: 12px; text-align: right;">{{cancelName === 'cancel' ? '取消审核后该单据所产生的库存等业务数据也将回退，确定取消审核？' : '作废后该单据所产生的库存等业务数据也将回退，确定作废？'}}</div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onNegativeDecision">确 定</el-button>
        <el-button @click="isCancelOpen = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="审核" :visible.sync="isCheckOpen" v-loading="isUploading">
      <el-form :label-position="'right'" label-width="100px">
        <el-col :span="8">
          <el-form-item label="标题">
            <span>{{ selected.PackName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="创建：">
            <span>{{ selected.CreateUser + '&nbsp;&nbsp;&nbsp;'}}{{ selected.CreateTime | filterDateTime}}</span>
          </el-form-item>
        </el-col>
        <el-form-item label="审核结果：">
          <el-radio-group v-model="auditType" name="auditType">
            <el-row :gutter="10">
              <el-col :span="24">
                <el-radio :label="YNStatus.Yes">审核通过</el-radio>
              </el-col>
            </el-row>
            <el-row :gutter="10" class="center-second-row">
              <el-col :span="8">
                <el-radio :label="YNStatus.No">作废</el-radio>
              </el-col>
              <el-col :span="16" v-show="auditType === YNStatus.No">
                <el-input v-model="CheckNote" placeholder="作废原因备注" :maxlength="200"></el-input>
              </el-col>
            </el-row>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="auditAdjust" name="btnAuditAdjust">确 定</el-button>
        <el-button @click="isCheckOpen = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <export-field-setter :items="exportFields" :uploading="isExportUploading" :visible.sync="isExportOpen"/>
  </div>
</template>

<script>
import { YNStatus, SettingOptionTypes } from '@/enums/membership'

import {
  COLLEGE_API_PACKORDERBASIC_GETS,
  COLLEGE_API_SETTINGPACK_DROPDOWNLIST,
  COLLEGE_API_SETTINGPACK_GETYEAR,
  COLLEGE_API_PACKORDERBASIC_AUDIT,
  COLLEGE_API_PACKORDERBASIC_ABANDON,
  COLLEGE_API_PACKORDERBASIC_CANCEL,
  COLLEGE_API_PACKORDERBASIC_EXPORT
} from '@/apis/science'
import {
  PackOrderBasicPaidState,
  PackOrderBasicSourceType,
  PackOrderBasicOrderType,
  PackOrderBasicState,
  CharacterPackState
} from '@/enums/science'

import { PaymentType, StoreType } from '@/enums/common'
import _ from 'lodash'
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import userInfo from '@/components/scrm/userInfo.vue'
import dayjs from 'dayjs'
import exportFieldSetter from './template/exportFieldSetter'

export default {
  components: {
    exportFieldSetter,
    searchPanel,
    pagination,
    userInfo
  },
  data() {
    return {
      YNStatus,
      settingOptionTypes: SettingOptionTypes,
      packOrderBasicPaidState: PackOrderBasicPaidState,
      paymentType: PaymentType,
      paymentMethods: [
        PaymentType.AliPay,
        PaymentType.WechatPay,
        PaymentType.BankPay
      ].map(type => {
        return {
          value: type,
          text: PaymentType.Types[type]
        }
      }),
      packOrderBasicSourceType: PackOrderBasicSourceType,
      packOrderBasicOrderType: PackOrderBasicOrderType,
      characterPackState: CharacterPackState,
      packOrderBasicState: PackOrderBasicState,
      // ---
      dicts: [],
      years: [], // 年份
      parameters: {},
      data: [],
      rules: {
        JunkDays1: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (isNaN(value)) {
                callback(new Error('请输入数字'))
              } else if (
                this.queryForm.JunkDays2 &&
                parseFloat(value) > parseFloat(this.queryForm.JunkDays2)
              ) {
                callback(new Error('起始值不能大于结束值'))
              }
              callback()
            }
          }
        ],
        JunkDays2: [
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (isNaN(value)) {
                callback(new Error('请输入数字'))
              } else if (
                this.queryForm.JunkDays1 &&
                parseFloat(value) < parseFloat(this.queryForm.JunkDays1)
              ) {
                callback(new Error('结束值不能小于起始值'))
              }
              callback()
            }
          }
        ],
      },
      total: 0,
      selections: [],
      createUsers: [],
      TaskParams: {
        params: {}
      },
      selectionData: {},
      auditDialog: false, // 审核
      cancelDialog: false, // 取消审核
      queryForm: {
        OrderCode: '',
        CompanyCode: '',
        CompanyName: '',
        StoreCode: '',
        StoreName: '',
        SourceType: '0',
        OrderType: '0',
        PackId: '0',
        Years: '0',
        PaymentType: '0',
        PaidState: '0',
        UniteNote: '0',
        CheckTime: [],
        CheckTime1: '',
        CheckTime2: '',
        State: '0',
        JunkPackId: '0',
        JunkDays1: '',
        JunkDays2: '',
        JunkPackState: '0',
        Orderby: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      apiKey: 'VISITLOG_SEARCH',
      isCancelOpen: false,
      isCheckOpen: false,
      isExportOpen: false,
      selected: {},
      auditType: YNStatus.Yes,
      isUploading: false,
      isExportUploading: false,
      CheckNote: '',
      cancelName: '',
      exportFields: [{}]
    }
  },
  created() { },
  methods: {
    init() {
      let query = this.$route.query || {}
      this.queryForm = Object.assign(this.queryForm, {
        OrderCode: '',
        CompanyCode: '',
        CompanyName: '',
        StoreCode: '',
        StoreName: '',
        SourceType: '0',
        OrderType: '0',
        PackId: '0',
        Years: '0',
        PaymentType: '0',
        PaidState: '0',
        UniteNote: '0',
        CheckTime: [],
        CheckTime1: '',
        CheckTime2: '',
        State: '0',
        JunkPackId: '0',
        JunkDays1: '',
        JunkDays2: '',
        JunkPackState: '0',
        Orderby: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }, query)
      this.getData()
    },
    selectState(value) {
      this.queryForm.State = value
      this.onSearch()
    },
    onExport() {
      this.isExportUploading = true
      let CheckTime = this.queryForm.CheckTime
      let param = {}
      if (CheckTime && CheckTime.length) {
        param = {
          CheckTime1: dayjs(CheckTime[0]).format('YYYY-MM-DD HH:mm:ss'),
          CheckTime2: dayjs(CheckTime[1]).format('YYYY-MM-DD HH:mm:ss')
        }
      } else {
        param = {
          CheckTime1: dayjs('1900-01-01').format('YYYY-MM-DD HH:mm:ss'),
          CheckTime2: dayjs('1900-01-01').format('YYYY-MM-DD HH:mm:ss')
        }
      }
      this.queryForm = Object.assign(this.queryForm, this.parameters, param)
      const uploadForm = {
        ...this.queryForm,
        JunkDays1: this.queryForm.JunkDays1 == '' ? -99999 : this.queryForm.JunkDays1, // +-99999代表搜索所有数据
        JunkDays2: this.queryForm.JunkDays2 == '' ? 99999 : this.queryForm.JunkDays2
      }
      delete uploadForm.CheckTime
      const lodashOriginFind = _.find
      _.find = (...args) => {
        const result = lodashOriginFind(...args)
        return result ? result : {}
      }
      COLLEGE_API_PACKORDERBASIC_EXPORT(uploadForm).then(res => {
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
    operationForOrder(api) {
      let length = this.data.length
      this.isUploading = true
      api({
        OrderId: this.selected.OrderId,
        PaidNO: this.selected.PaidNO,
        CheckNote: this.CheckNote
      }).then(res => {
        this.isUploading = false
        if (res.data.Code === 'CORRECT') {
          this.isCancelOpen = false
          this.isCheckOpen = false
          if (length == 1 && this.parameters.PageIndex > 1) {
            this.parameters.PageIndex -= 1
          }
          this.getData()
        }
      }).catch(() => {
        this.isUploading = false
      })
    },
    onNegativeDecision() {
      let api = COLLEGE_API_PACKORDERBASIC_CANCEL
      if (this.cancelName !== 'cancel') {
        api = COLLEGE_API_PACKORDERBASIC_ABANDON
      }
      this.operationForOrder(api)
    },
    auditAdjust() {
      let api = COLLEGE_API_PACKORDERBASIC_AUDIT
      if (this.auditType === YNStatus.No) {
        api = COLLEGE_API_PACKORDERBASIC_ABANDON
      }
      this.operationForOrder(api)
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let CheckTime = this.queryForm.CheckTime
      let param = {}
      if (CheckTime && CheckTime.length) {
        param = {
          CheckTime1: dayjs(CheckTime[0]).format('YYYY-MM-DD HH:mm:ss'),
          CheckTime2: dayjs(CheckTime[1]).format('YYYY-MM-DD HH:mm:ss')
        }
      } else {
        param = {
          CheckTime1: dayjs('1900-01-01').format('YYYY-MM-DD HH:mm:ss'),
          CheckTime2: dayjs('1900-01-01').format('YYYY-MM-DD HH:mm:ss')
        }
      }
      this.queryForm = Object.assign(this.queryForm, this.parameters, param)
      const uploadForm = {
        ...this.queryForm,
        JunkDays1: this.queryForm.JunkDays1 == '' ? -99999 : this.queryForm.JunkDays1, // +-99999代表搜索所有数据
        JunkDays2: this.queryForm.JunkDays2 == '' ? 99999 : this.queryForm.JunkDays2
      }
      delete uploadForm.CheckTime
      const lodashOriginFind = _.find
      _.find = (...args) => {
        const result = lodashOriginFind(...args)
        return result ? result : {}
      }
      COLLEGE_API_PACKORDERBASIC_GETS(uploadForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = (res.data.Data.Subset || []).map(item => {
            return {
              ...item,
              StoreType: _.find(StoreType.TypeArray, {
                KeyId: item.StoreType + ''
              }).Value,
              SourceType: _.find(PackOrderBasicSourceType.TypeArray, {
                KeyId: item.SourceType + ''
              }).Value,
              OrderType: _.find(PackOrderBasicOrderType.TypeArray, {
                KeyId: item.OrderType + ''
              }).Value,
              PaymentType: _.find(PaymentType.TypeArray, {
                KeyId: item.PaymentType + ''
              }).Value,
              PaidState: _.find(PackOrderBasicPaidState.TypeArray, {
                KeyId: item.PaidState + ''
              }).Value,
              isManualOrder:
                item.SourceType === PackOrderBasicSourceType.Manual,
              isWaitingCheck: item.State === PackOrderBasicState.Wait,
              isPassedCheck: item.State === PackOrderBasicState.Audit
            }
          })
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'CheckTime':
          this.queryForm.Orderby = 1
          break
        case 'Expiree':
          this.queryForm.Orderby = 2
          break
        case 'CreateTime':
          this.queryForm.Orderby = 0
          break
        default:
          this.queryForm.Orderby = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    selectionChange(selection) {
      this.selections = selection
    },
    multiAudit() {
      if (
        !this.selections.length ||
        this.selections.filter(item => {
          if (item.State !== this.visitTaskStatus.Wait) {
            return item
          }
        }).length > 0
      ) {
        this.$message.error('请选择待审核的采购入库单')
      } else {
        this.auditDialog = true
      }
    },
    onSearch() {
      // 搜索相关
      this.$refs['search'].validate(valid => {
        if (valid) {
          this.queryForm.PageIndex = 1
          this.queryForm.isSenior = true
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
        OrderCode: '',
        CompanyCode: '',
        CompanyName: '',
        StoreCode: '',
        StoreName: '',
        SourceType: '0',
        OrderType: '0',
        PackId: '0',
        Years: '0',
        PaymentType: '0',
        PaidState: '0',
        UniteNote: '0',
        CheckTime: [],
        CheckTime1: '',
        CheckTime2: '',
        State: '0',
        JunkPackId: '0',
        JunkDays1: '',
        JunkDays2: '',
        JunkPackState: '0',
        Orderby: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }
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
    initRoute() {
      this.$router.replace({
        path: this.$router.path,
        query: JSON.parse(JSON.stringify(this.parameters))
      })
    },

    getOptions() {
      COLLEGE_API_SETTINGPACK_DROPDOWNLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.dicts = res.data.Data.Subset
        }
      })
      COLLEGE_API_SETTINGPACK_GETYEAR().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.years = res.data.Data
        }
      })
    },
    onCancelCheck(selected) {
      this.selected = selected
      this.cancelName = 'cancel'
      this.isCancelOpen = true
    },
    onCheck(selected) {
      this.selected = selected
      this.isCheckOpen = true
    },
    onInvalid(selected) {
      this.selected = selected
      this.cancelName = 'invalid'
      this.isCancelOpen = true
    },
    resetDialogData(val) {
      if (val === false) {
        this.selected = {}
        this.CheckNote = ''
      }
    }
  },
  mounted() {
    this.getOptions()
    this.init()
  },
  watch: {
    $route: 'init',
    'queryForm.State': 'onSearch',
    isCheckOpen: 'resetDialogData',
    isCancelOpen: 'resetDialogData'
  },
  computed: {
    selectionsKeys() {
      return this.selections.map(sel => sel.visitLogId)
    }
  }
}
</script>

<style lang="scss" scoped>
.center-second-row {
  margin-top: 10px;
  display: flex;
  align-items: center;
}
</style>
