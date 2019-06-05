<template>
  <div class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button type="primary" @click="createDialog = true">新建</el-button>
          <el-dropdown @command="multiAudit">
            <el-button type="default">
              批量操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>批量审核</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select v-model="queryForm.State" placeholder="所有状态">
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="(item,index) in weiwStuffSettleBasicState.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="SettleCode">
            <el-input v-model="queryForm.SettleCode" :maxlength="50" placeholder="单据编号" @keyup.enter.native="onSearch">
              <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="单据编号：" prop="SettleCode">
            <el-input v-model="queryForm.SettleCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="创建时间：" prop="CreateTime">
            <el-date-picker v-model="queryForm.CreateTime" :unlink-panels="true" type="daterange" value-format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item label="供应商：" prop="PartnerId">
            <el-select v-model="queryForm.PartnerId" placeholder="全部" :filterable="true">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.suppliers.filter(item => {return(item.PartnerType == PartnerType.Merchant||item.PartnerType == PartnerType.Supplier)})" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="结算类型：" prop="SourceType">
            <el-select v-model="queryForm.SourceType" placeholder="全部" :filterable="true">
              <el-option label="全部" value="0"></el-option>
              <template v-for="(item, index) in weiwStuffSettleBasicSourceType.TypeArray">
                <el-option v-if="item.KeyId != weiwStuffSettleBasicSourceType.GoodsReturnOrderBasic && item.KeyId != weiwStuffSettleBasicSourceType.HalfReturnOrderBasic" :key="index" :label="item.Value" :value="String(item.KeyId)"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="相关单号：" prop="PreviousCode">
            <el-input v-model="queryForm.PreviousCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="创建人：" prop="CreateUserId">
            <el-select v-model="queryForm.CreateUserId" placeholder="全部" :filterable="true">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.users" :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="最后操作时间：" prop="CheckTime">
            <el-date-picker v-model="queryForm.CheckTime" type="daterange" value-format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- @module 数据表格 -->
    <el-table 
      :data="tableData"
      ref="tableData" 
      v-loading="$store.getters.tb_loading" 
      @sort-change="sortChange" 
      @selection-change="selectionChange" 
      element-loading-text="拼命加载中">
      <el-table-column type="selection" width="55" fixed="left"></el-table-column>
      <el-table-column prop="SettleCode" label="单据编号" min-width="140" sortable="custom" show-overflow-tooltip fixed="left"></el-table-column>
      <el-table-column prop="PartnerName" label="供应商" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="SourceType" label="结算类型" min-width="90" show-overflow-tooltip>
        <template slot-scope="scope">
          {{weiwStuffSettleBasicSourceType.Types[scope.row.SourceType]}}
        </template>
      </el-table-column>
      <el-table-column prop="PreviousCode" label="相关单号" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <router-link :to="{path: getUrl(scope.row),query:{id:scope.row.PreviousId}}" class="btn-link el-button el-button--text">{{scope.row.PreviousCode}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" min-width="100" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.CreateTime | filterDateMinutes }}
        </template>
      </el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="产出" min-width="100" show-overflow-tooltip>
        <el-table-column prop="OutGoodsQty" label="产出数量" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="OutGoldWgt" label="产出金重" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            {{$root.toFloat(scope.row.OutGoldWgt, 3)}}g
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="投入" min-width="100" show-overflow-tooltip>
        <el-table-column prop="InputGoldQty" label="金料数量" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="InputGoldWgt" label="金料重量" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            {{$root.toFloat(scope.row.InputGoldWgt, 3)}}g
          </template>
        </el-table-column>
        <el-table-column prop="InputStoneQty" label="石料数量" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="InputStoneWgt" label="石料重量" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            {{$root.toFloat(scope.row.InputStoneWgt, 3)}}ct
          </template>
        </el-table-column>
        <el-table-column prop="InputPartQty" label="配件数量" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="InputPartWgt" label="配件重量" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            {{$root.toFloat(scope.row.InputPartWgt, 3)}}g
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="CraftFee" label="工费金额" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
            ￥{{$root.toFloat(scope.row.CraftFee)}}
          </template>
      </el-table-column>
      <el-table-column prop="Preprice" label="应付款" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
            ￥{{$root.toFloat(scope.row.Preprice)}}
          </template>
      </el-table-column>
      <el-table-column prop="CheckTime" label="最后操作时间" min-width="120" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.CheckTime | filterDateMinutes }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" min-width="90" fixed="right">
        <template slot-scope="scope">
          <template v-if="(scope.row.State === weiwStuffSettleBasicState.Abandon || scope.row.State === weiwStuffSettleBasicState.Reject || scope.row.State === weiwStuffSettleBasicState.Cancel)&&scope.row.CheckNote">
            <el-tooltip class="item" :content="scope.row.CheckNote" placement="top" effect="light">
              <span :class="scope.row.State | findKey(weiwStuffSettleBasicState)">{{weiwStuffSettleBasicState.Types[scope.row.State]}}</span>
            </el-tooltip>
          </template>
          <template v-else>
            <span :class="scope.row.State | findKey(weiwStuffSettleBasicState)">{{weiwStuffSettleBasicState.Types[scope.row.State]}}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="140" fixed="right">
        <template slot-scope="scope">
          <router-link :to="{path:'/depot/outSBalance/check',query:{id:scope.row.SettleId}}" class="btn-link el-button el-button--text">查看</router-link>
          <span v-if="scope.row.State == weiwStuffSettleBasicState.Draft||scope.row.State == weiwStuffSettleBasicState.Reject">
            <router-link :to="{path:'/depot/outSBalance/edit',query:{id:scope.row.SettleId}}" class="btn-link el-button el-button--text m-l-10">编辑</router-link>
            <el-button type="text" @click="openDialog(scope.row, 'abandonDialog')">作废</el-button>
          </span>
          <el-button v-if="scope.row.State == weiwStuffSettleBasicState.Wait" type="text" @click="openDialog(scope.row, 'auditDialog')">审核</el-button>
          <el-button v-if="scope.row.State == weiwStuffSettleBasicState.Audit" type="text" @click="openDialog(scope.row, 'cancelDialog')">取消审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->

    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- @module Dialog·新建委外加工结算 -->
    <el-dialog title="新建委外加工结算" :visible.sync="createDialog" @close="resetForm" width="500px">
      <el-form label-position="right" label-width="100px" :model="createForm" :rules="rules" ref="createForm">
        <el-form-item label="供应商：" prop="PartnerId">
          <el-select v-model="createForm.PartnerId" placeholder="请选择" :filterable="true">
            <el-option v-for="(item, index) in $store.getters.suppliers.filter(item => {return((item.PartnerType == PartnerType.Merchant||item.PartnerType == PartnerType.Supplier)&&item.State==YNStatus.Yes)})" :key="index" :label="item.Value" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算类型：" prop="SourceType">
          <el-select v-model="createForm.SourceType" placeholder="请选择" :filterable="true">
            <template v-for="(item, index) in weiwStuffSettleBasicSourceType.TypeArray">
              <el-option v-if="item.KeyId != weiwStuffSettleBasicSourceType.GoodsReturnOrderBasic && item.KeyId != weiwStuffSettleBasicSourceType.HalfReturnOrderBasic" :key="index" :label="item.Value" :value="item.KeyId"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="相关单号：" prop="PreviousCode">
          <el-input v-model="createForm.PreviousCode" @blur="createForm.PreviousCode = createForm.PreviousCode.trim()" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="应付款：" prop="Preprice">
          <el-input v-model="createForm.Preprice" :maxlength="10" @keyup.native="createForm.Preprice=$root.toFixed(createForm.Preprice,2)"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="">
          <el-input type="textarea" row="Note" v-model="createForm.Note" :maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createPurchase" :loading="$store.getters.is_loading">保 存</el-button>
        <el-button @click="createDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·新建成品采购入库单 -->

    <!-- @module Dialog·审核 -->
    <auditDialog title="审核" v-if="auditDialog" :auditDialog="auditDialog" :data="selections" @listenAuditDialog="listenDialog"></auditDialog>
    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <abandonDialog title="作废" v-if="abandonDialog" :abandonDialog="abandonDialog" :data="selections" @listenAbandonDialog="listenDialog"></abandonDialog>
    <!-- End Dialog·作废 -->

    <!-- @module Dialog·取消审核 -->
    <cancelDialog title="取消审核" v-if="cancelDialog" :cancelDialog="cancelDialog" :data="selections" @listenCancelDialog="listenDialog"></cancelDialog>
    <!-- End Dialog·取消审核 -->
  </div>
</template>

<script>
import {
  WeiwStuffSettleBasicSourceType,
  WeiwStuffSettleBasicState,
  
} from '@/enums/stocking.js'
import {
  YNStatus,
  PartnerType
} from '@/enums/common.js'
import {
  STOCKING_API_WEIW_STUFF_SETTLE_BASIC_GETS,
  STOCKING_API_WEIW_STUFF_SETTLE_BASIC_CREATE
} from '@/apis/stocking.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import auditDialog from './audit'
import abandonDialog from './abandon'
import cancelDialog from './cancel'

export default {
  data() {
    return {
      PartnerType,
      YNStatus,
      weiwStuffSettleBasicSourceType: WeiwStuffSettleBasicSourceType,
      weiwStuffSettleBasicState: WeiwStuffSettleBasicState,
      queryForm: {
        // 查询表单数据
        SettleCode: '',
        SourceType: '0',
        PreviousCode: '',
        PartnerId: '',
        CreateUserId: '0',
        CreateTime: [],
        CheckTime: [],
        State: '0',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      parameters: {
      },
      tableData: [],
      total: 0,
      rules: {
        // 新建规则
        PartnerId: [
          {
            type: 'number',
            required: true,
            message: '请选择供应商',
            trigger: 'change'
          }
        ],
        SourceType: [
          {
            type: 'number',
            required: true,
            message: '请选择结算类型',
            trigger: 'change'
          }
        ],
        PreviousCode: [
          {
            required: true,
            message: '请输入相关单号',
            trigger: 'change'
          }
        ],
        // Preprice: [
        //   {
        //     type: 'number',
        //     message: '请输入应付款',
        //     trigger: 'change'
        //   }
        // ]
      },
      createDialog: false,
      createForm: {},
      // createD
      selections: [], // 选中的数据
      auditDialog: false,
      abandonDialog: false, // 作废对话框
      abandonPurchase: {
      }, // 作废采购单
      cancelDialog: false, // 取消审核对话框
    }
  },
  methods: {
    init() {
      let query = JSON.stringify(this.$route.query) !== '{}' ? this.$route.query : {
        SettleCode: '',
        SourceType: '0',
        PreviousCode: '',
        PartnerId: '',
        CreateUserId: '0',
        CreateTime: [],
        CheckTime: [],
        State: '0',
        OrderBy: 0,
        IsAsced: this.YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      }
      this.parameters = Object.assign({
      }, query)
      this.parameters.CreateTime = query.CreateTime || []
      this.parameters.CheckTime = query.CheckTime || []
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      let createTime = this.parameters.CreateTime.length ? this.parameters.CreateTime : ['', '']
      let checkTime = this.parameters.CheckTime.length ? this.parameters.CheckTime : ['', '']
      let param = {
        CreateTime1: createTime[0],
        CreateTime2: createTime[1],
        CheckTime1: checkTime[0],
        CheckTime2: checkTime[1]
      }
      this.queryForm = Object.assign(this.queryForm, this.parameters, param)
      STOCKING_API_WEIW_STUFF_SETTLE_BASIC_GETS(this.queryForm).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if(res.data.Code == 'CORRECT'){
          this.tableData = res.data.Data.Rows||[]
          this.total = res.data.Data.Count||0
        }
      }).catch(() => {
        this.$store.commit('SET_TB_LOADING', false)
      })
    },
    getUrl(row){
      let path = ''
      if(row.SourceType == this.weiwStuffSettleBasicSourceType.GoodsIntakeOrderBasic){
        // 成品入库
        path = '/purchase/productStorage/viewProductStorage'
      }else if(row.SourceType == this.weiwStuffSettleBasicSourceType.GoodsReturnOrderBasic){
        // 成品退货
        path = '/purchase/finishedProductReturn/viewFinishedProductReturn'
      }else if(row.SourceType == this.weiwStuffSettleBasicSourceType.HalfIntakeOrderBasic){
        // 半成品入库
        path = '/purchase/semiPackageArrival/semiArrivalCheck'
      }else{
        // 半成品退货
        path = '/purchase/semiReturnOutbound/returnOutboundCheck'
      }
      return path
    },
    sortChange(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.queryForm.OrderBy = 1
          break
        case 'CheckTime':
          this.queryForm.OrderBy = 2
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? this.YNStatus.Yes : this.YNStatus.No
      this.onSearch()
    },
    selectionChange(selection) {
      this.selections = selection
    },
    createPurchase() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          let obj = {...this.createForm}
          obj.Preprice = this.$root.toInt(obj.Preprice)
          STOCKING_API_WEIW_STUFF_SETTLE_BASIC_CREATE(obj).then(res => {
            if(res.data.Code == 'CORRECT'){
              this.$message.success('提交成功')
              this.$router.push({
                path: '/depot/outSBalance/edit',
                query: {
                  id: res.data.Data
                }
              })
            }
          })
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    openDialog(row, type){
      this.selections = [row]
      this[type] = true
    },
    multiAudit() {
      if (
        !this.selections.length ||
        this.selections.filter(item => {
          if (item.State !== this.weiwStuffSettleBasicState.Wait) {
            return item
          }
        }).length > 0
      ) {
        this.$message.error('请选择待审核的单据')
      } else {
        this.auditDialog = true
      }
    },
    listenDialog(type, success) {
      this[type] = false
      this.selections = []
      this.$refs.tableData.clearSelection()
      if (success) {
        this.getData()
      }  
    },
    resetForm() {
      this.createForm = {}
      this.$refs.createForm.resetFields()
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
        path: this.$router.path, query: this.parameters 
      })
    },
    getEnums() {
      this.$store.dispatch('GET_USERS_DROPLIST')
      this.$store.dispatch('GET_SUPPLIERS_DROPLIST')
    },
    // formatter(row, column,val){
    //   switch(column.property){
    //     case 'InputGoldWgt':
    //     case 'InputStoneWgt':
    //     case 'InputPartWgt':
    //     case 'OutGoldWgt':
    //       return this.$root.toFloat(val, 3)
    //     default:
    //       return this.$root.toFloat(val)
    //   }
    // }
  },
  beforeMount() {
    this.getEnums()
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init',
    'queryForm.State' () {
      this.onSearch()
    }
  },
  components: {
    pagination,
    searchPanel,
    auditDialog,
    abandonDialog,
    cancelDialog
  }
}
</script>
