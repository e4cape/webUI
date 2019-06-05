<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button type="primary" name="btnCreate" @click="createVisible = true">新建</el-button>
        </template>
        <template slot="simpleSearch">
          <el-form-item>
            <el-select name="paidState" v-model="queryForm.PaidState" placeholder="所有状态" :filterable="true" @change="onSearch">
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="(item,index) in settleIOBillBasicPaidStates.Types" :key="index" :label="item + '付款'" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="BillCode">
            <el-input name="billCode" v-model="queryForm.BillCode" placeholder="单据编号" @keyup.enter.native="onSearch">
              <el-button name="btnPaidConfirm" slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item prop="PreviousType" label="所有来源：">
            <el-select name="previoursType" v-model="queryForm.PreviousType" placeholder="所有来源" :filterable="true">
              <el-option label="所有来源" value="0"></el-option>
              <el-option v-for="(item,index) in settleIOBillBasicPreviousTypes.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ObjectType" label="所有对象：">
            <el-select name="objectType" v-model="queryForm.ObjectType" placeholder="所有对象">
              <el-option label="所有对象" value="0"></el-option>
              <el-option v-for="(item,index) in settleIOBillBasicObjectTypes.Types" :key="index" :label="item" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="ReasonTypeDk" label="所有原因：">
            <el-select name="ReasonTypeDk" v-model="queryForm.ReasonTypeDk" placeholder="所有原因">
              <el-option label="所有原因" value="0"></el-option>
              <el-option v-for="(item,index) in paymentReasons" :key="index" :label="item.Value" :value="item.Id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="BillCode" label="单据编号：">
            <el-input name="billCode" v-model="queryForm.BillCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item prop="ObjectNote" label="应付对象：">
            <el-input name="objectNote" v-model="queryForm.ObjectNote" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item prop="CreateTime" label="创建时间：">
            <el-date-picker v-model="queryForm.CreateTime" :unlink-panels="true" type="daterange"></el-date-picker>
          </el-form-item>
          <el-form-item prop="PreviousCode" label="来源单号：">
            <el-input name="previousCode" v-model="queryForm.PreviousCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- @module 数据表格 -->
    <el-table :data="data" @sort-change="sortChange" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column prop="BillCode" label="单据编号" min-width="160" sortable="custom" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="ObjectNote" label="应付对象" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ObjectType" label="对象类型" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="$store.getters.user_session.CharacterType == characterType.Store">{{settleIOBillBasicObjectTypes.Types[scope.row.ObjectType].replace('往来单位', '供应商')}}</span>
          <span v-else>{{settleIOBillBasicObjectTypes.Types[scope.row.ObjectType]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ActualDate" label="业务日期" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.ActualDate | filterDate}}</template>
      </el-table-column>
      <el-table-column prop="ReasonTypeDv" label="付款原因" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="PreviousType" label="来源" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{settleIOBillBasicPreviousTypes.Types[scope.row.PreviousType]}}</template>
      </el-table-column>
      <el-table-column prop="PreviousCode" label="来源单号" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.PreviousType == settleIOBillBasicPreviousTypes.Manual">-</span>
          <router-link v-else :to="{path: previousTypeLink[scope.row.PreviousType],query:{id:scope.row.PreviousId}}" class="text-blue" name="btnLinkPreviousType">{{scope.row.PreviousCode}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="BillPrice" label="应付金额" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.BillPrice | initPrice}}</template>
      </el-table-column>
      <el-table-column prop="PaidPrice" label="已付金额" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.PaidPrice | initPrice}}</template>
      </el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" min-width="100" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.CreateTime | filterDateMinutes }}</template>
      </el-table-column>
      <el-table-column prop="PaidState" label="状态" min-width="100" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <span>
            {{settleIOBillBasicPaidStates.Types[scope.row.PaidState]}}付款
          </span>
      </template>
      </el-table-column>
      <el-table-column label="操作" min-width="180" fixed="right">
        <template slot-scope="scope">
          <el-button @click="$router.push({path: '/fmis/payment/paymentCheck', query: {id: scope.row.BillId}})" type="text">查看</el-button>
          <el-button @click="$router.push({path: '/fmis/payment/paymentCreate', query: {id: scope.row.BillId}})" type="text" v-if="scope.row.PaidState !== settleIOBillBasicPaidStates.All">创建付款单</el-button>
          <el-button @click="del(scope.row.BillId)" type="text" v-if="scope.row.PreviousType == settleIOBillBasicPreviousTypes.Manual && scope.row.PaidState == settleIOBillBasicPaidStates.None">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <!-- End panel -->

    <!-- @module Dialog·新建应付款单 -->
    <el-dialog title="新建应付款单" width="620px" :visible.sync="createVisible" @close="resetForm">
      <el-form label-position="right" label-width="100px" :model="createForm" :rules="rules" ref="createForm">
        <el-form-item prop="ActualDate" label="业务日期">
          <el-date-picker v-model="createForm.ActualDate" :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
        <el-form-item label="应付对象" prop="ObjectType">
          <el-select name="objectType" v-model="createForm.ObjectType" placeholder="请选择">
            <template v-for="(item,index) in settleIOBillBasicObjectTypes.Types">
              <el-option v-if="$store.getters.user_session.CharacterType == characterType.Store" :key="index" :label="item.replace('往来单位', '供应商')" :value="parseInt(index)"></el-option>
              <el-option v-else-if="item != '总部'" :key="index" :label="item" :value="parseInt(index)"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="对象名称" prop="PartnerId" v-if="createForm.ObjectType == settleIOBillBasicObjectTypes.Partner">
          <el-select name="partnerId" v-model="createForm.PartnerId" placeholder="请选择">
            <template v-for="(item,index) in $store.getters.suppliers">
              <el-option :key="index" :label="item.Value" v-if="item.State == EnableState.Enable" :value="item.Id"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="对象名称" prop="StorechterId" v-if="createForm.ObjectType == settleIOBillBasicObjectTypes.Store">
          <el-select name="storechterId" v-model="createForm.StorechterId" placeholder="请选择">
            <template v-for="(item,index) in $store.getters.stores">
              <el-option v-if="item.CharacterId && item.CharacterId != $store.getters.user_session.CharacterId" :key="index" :label="item.Value" :value="item.CharacterId"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="对象名称" prop="MemberId" v-if="createForm.ObjectType == settleIOBillBasicObjectTypes.Member">
          <el-row>
            <el-col :span="14">
              <el-input :maxlength="50" placeholder="输入/扫描会员" @keyup.enter.native="searchVip" v-model="memberSN" name="memberSN">
                <el-button slot="append" icon="el-icon-search" name="btnSearchMember" @click.native="vipDialog = true"></el-button>
              </el-input>
            </el-col>
            <el-col :span="10">
              <div class="member-info">
                <img v-if="vipInfo.imageUrl" :src="vipInfo.imageUrl.indexOf('http') > -1 ? vipInfo.imageUrl : $root.settings.DOMAIN_IMAGE + vipInfo.imageUrl">
                <span>
                  <em>{{vipInfo.mobile}}</em>
                  <em>{{vipInfo.aliasName}}{{vipInfo.trueName ? '('+vipInfo.trueName+')' : ''}}</em>
                </span>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="付款原因" prop="ReasonTypeDk">
          <el-select v-model="createForm.ReasonTypeDk" filterable placeholder="请选择" name="reasonTypeDk">
            <el-option v-for="(item, index) in paymentReasons" :key="index" :label="item.Value" :value="item.Id"></el-option>
          </el-select>
          <span class="icon-set-item" @click="reasonDialog=true" name="btnSetItem">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item label="应付金额：" prop="BillPrice">
          <el-input name="billPrice" :maxlength="9" v-model="createForm.BillPrice" @keyup.native="createForm.BillPrice = $root.toFixed(createForm.BillPrice, 2)"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="createForm.Note" :maxlength="200" name="note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createPaid" :loading="$store.getters.is_loading" name="btnCreateReturn">确 定</el-button>
        <el-button @click="createVisible = false" name="btnCancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·新建应付款单 -->

    <!-- @module Dialog·新建付款原因 -->
    <dict-manage
      v-if="reasonDialog"
      :visible.sync="reasonDialog"
      :dicts="paymentReasons"
      dialogTitle="付款原因"
      :dictType="settingDictionaryDictTypes.SettleIOBillBasicPayReasonType"
      @listenDictSave="getPaidReasons"
    ></dict-manage>
    <!-- End Dialog·新建付款原因  -->

    <!--  @module 会员选择  -->
    <menber-select v-if="vipDialog" :visible.sync="vipDialog" @getVipInfo="getVipInfo"></menber-select>
    <!--  end 会员选择  -->
  </div>
</template>

<script>
import { YNStatus, EnableState, CharacterType } from '@/enums/common'
import { MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST } from '@/apis/merchant'
import {
  SettleIOBillBasicPreviousType,
  SettleIOBillBasicObjectType,
  SettleIOBillBasicBillType,
  SettleIOBillBasicPaidState,
  SettingDictionaryDictType
} from '@/enums/stocking'
import {
  STOCKING_API_SETTLE_IO_BILL_BASIC_GETS,
  STOCKING_API_SETTLE_IO_BILL_BASIC_ABANDON,
  STOCKING_API_SETTLE_IO_BILL_BASIC_CREATE
} from '@/apis/stocking'
import { MEMBERSHIP_API_MEMBER_GETS } from '@/apis/membership'

import dayjs from 'dayjs'
import searchPanel from '@/components/searchPanel'
import pagination from '@/components/pagination'
import dictManage from '@/components/erp/dictManage'
import MenberSelect from '@/components/erp/menberSelect.vue'
import previousTypeLink from '@/datas/previous/previousTypeLink'
export default {
  data() {
    return {
      EnableState,
      YNStatus,
      characterType: CharacterType,
      settleIOBillBasicPaidStates: SettleIOBillBasicPaidState,
      settleIOBillBasicPreviousTypes: SettleIOBillBasicPreviousType,
      settleIOBillBasicObjectTypes: SettleIOBillBasicObjectType,
      settingDictionaryDictTypes: SettingDictionaryDictType,
      paymentReasons: [],
      previousTypeLink: previousTypeLink,
      queryAll: false,
      queryForm: {
        // 查询表单数据
        BillType: SettleIOBillBasicBillType.Paid,
        PreviousType: '0',
        ObjectType: '0',
        ReasonTypeDk: '0',
        ObjectNote: '',
        PaidState: '0',
        OrderBy: 1,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20,
        BillCode: '',
        PreviousCode: '',
        CreateTime: [],
        CreateTime1: '',
        CreateTime2: ''
      },
      data: [],
      total: 0,
      parameters: {},
      reasonDialog: false,
      createVisible: false,
      createForm: {
        BillType: SettleIOBillBasicBillType.Paid,
        ObjectType: '',
        StorechterId: '',
        PartnerId: '',
        MemberId: '',
        BillPrice: '',
        ReasonTypeDk: '',
        ActualDate: new Date(),
        Note: ''
      },
      rules: {
        ReasonTypeDk: [
          {
            type: 'number',
            required: true,
            message: '请选择付款原因',
            trigger: 'change'
          }
        ],
        ObjectType: [
          {
            type: 'number',
            required: true,
            message: '请选择应付对象',
            trigger: 'change'
          }
        ],
        StorechterId: [
          {
            type: 'number',
            required: true,
            message: '请选择对象名称',
            trigger: 'change'
          }
        ],
        MemberId: [
          {
            required: true,
            message: '请搜索选择会员',
            trigger: 'change'
          }
        ],
        PartnerId: [
          {
            type: 'number',
            required: true,
            message: '请选择对象名称',
            trigger: 'change'
          }
        ],
        ActualDate: [
          {
            required: true,
            message: '请选择业务日期',
            trigger: 'change'
          }
        ],
        BillPrice: [
          {
            required: true,
            message: '请输入应付金额',
            trigger: 'change'
          }
        ]
      },
      pickerOptions: {
        disabledDate(date) {
          let now = new Date()
          return (
            Date.parse(date) >
            Date.parse(
              now.getFullYear() +
              '/' +
              (now.getMonth() + 1) +
              '/' +
              now.getDate()
            )
          )
        }
      },
      vipDialog: false,
      vipInfo: {},
      memberSN: ''
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            BillType: SettleIOBillBasicBillType.Paid,
            PreviousType: '0',
            PaidState: '0',
            ObjectType: '0',
            ObjectNote: '',
            OrderBy: 1,
            IsAsced: YNStatus.No,
            PageIndex: 1,
            PageSize: 20,
            BillCode: '',
            PreviousCode: '',
            CreateTime: [],
            CreateTime1: '',
            CreateTime2: ''
          }
      this.parameters = Object.assign({}, query)
      this.parameters.CreateTime = query.CreateTime || []
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let createTime = this.parameters.CreateTime.length
        ? this.parameters.CreateTime
        : ['1900-01-01 0:00:00', '1900-01-01 0:00:00']
      let param = {
        CreateTime1: createTime[0]
          ? dayjs(createTime[0]).format('YYYY-MM-DD')
          : dayjs('1900-1-1').format('YYYY-MM-DD'),
        CreateTime2: createTime[1]
          ? dayjs(createTime[1]).format('YYYY-MM-DD')
          : dayjs('1900-1-1').format('YYYY-MM-DD')
      }
      this.queryForm = Object.assign(this.queryForm, this.parameters, param)
      STOCKING_API_SETTLE_IO_BILL_BASIC_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'BillCode':
          this.queryForm.OrderBy = 0
          break
        case 'CreateTime':
          this.queryForm.OrderBy = 1
          break
        default:
          this.queryForm.OrderBy = 1
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.onSearch()
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.queryForm.isSenior = true
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
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
    del(id) {
      this.$confirm('确定将此单据删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('SET_FULL_LOADING', true)
        STOCKING_API_SETTLE_IO_BILL_BASIC_ABANDON({ BillId: id }).then(res => {
          this.$store.commit('SET_FULL_LOADING', false)
          if (res.data.Code === 'CORRECT') {
            this.$message.success('已删除')
            this.getData()
          }
        })
      })
    },
    resetForm() {
      // 重置表单
      this.$refs['createForm'].resetFields()
    },
    createPaid() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          let param = Object.assign(
            {
              ReasonTypeDv: this.paymentReasons.find(
                p => p.Id === this.createForm.ReasonTypeDk
              ).Value
            },
            this.createForm
          )
          switch (param.ObjectType) {
            case SettleIOBillBasicObjectType.Company:
              param.StorechterId = 0
              param.PartnerId = 0
              param.MemberId = ''
              break
            case SettleIOBillBasicObjectType.Store:
              param.PartnerId = 0
              param.MemberId = ''
              break
            case SettleIOBillBasicObjectType.Member:
              param.StorechterId = 0
              param.PartnerId = 0
              break
            case SettleIOBillBasicObjectType.Partner:
              param.StorechterId = 0
              param.MemberId = ''
              break
            default:
              break
          }
          param.BillPrice = parseInt(this.$root.toFixed(param.BillPrice * 10000))
          param.ActualDate = dayjs(param.ActualDate).format('YYYY-MM-DD')
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_SETTLE_IO_BILL_BASIC_CREATE(param).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if (res.data.Code === 'CORRECT') {
              this.$message.success('创建成功')
              this.createVisible = false
              this.getData()
            }
          })
        }
      })
    },
    getPaidReasons() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: SettingDictionaryDictType.SettleIOBillBasicPayReasonType,
        State: EnableState.Enable
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.paymentReasons = res.data.Data.Rows || []
        }
      })
    },
    searchVip() {
      // 搜索vip
      if (!this.memberSN) {
        this.vipInfo = {}
        return false
      }
      let vipParams = {
        PageIndex: 1,
        PageSize: 10,
        Mobile: '',
        AliasName: '',
        MemberId: this.memberSN,
        SexyType: '',
        TrueName: ''
      }
      MEMBERSHIP_API_MEMBER_GETS(vipParams).then(res => {
        if (res.data.Code === 'CORRECT') {
          if (!res.data.Data.rows.length) {
            this.$message.error('该会员不存在!')
            this.createForm.MemberId = ''
            this.vipInfo = {}
            this.$refs['createForm'].clearValidate()
          } else {
            this.createForm.TrueName = res.data.Data.rows[0].trueName
            this.createForm.MemberId = res.data.Data.rows[0].memberId
          }
        } else {
          this.createForm.MemberId = ''
          this.vipInfo = {}
          this.$message.error(res.Message)
          this.$refs['createForm'].clearValidate()
        }
      })
    },
    getVipInfo(data) {
      // 获取vip信息
      this.createForm.TrueName = data.trueName
      this.createForm.MemberId = data.memberId
      this.memberSN = data.memberId
      this.vipInfo = data
      this.$refs['createForm'].clearValidate()
      this.vipDialog = false
    }
  },
  created() {
    this.$store.dispatch('GET_SUPPLIERS_DROPLIST')
    this.$store.dispatch('GET_STORES_DROPLIST')
  },
  beforeMount() {
    this.getPaidReasons()
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init'
  },
  components: {
    searchPanel,
    pagination,
    dictManage,
    MenberSelect
  }
}
</script>

<style lang="scss" scoped>
.member-info {
  display: flex;
  align-content: center;
  line-height: 16px;
  margin-left: 10px;
  img {
    width: 28px;
    height: 28px;
  }
  span {
    display: flex;
    flex-direction: column;
    margin-left: 5px;
  }
}
</style>

