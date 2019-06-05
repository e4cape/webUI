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
              <el-option v-for="(item,index) in weiwGjunkSplitBasicState.Types" :key="index" :label="item" :value="String(index)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="SplitCode">
            <el-input v-model="queryForm.SplitCode" :maxlength="50" placeholder="单据编号" @keyup.enter.native="onSearch">
              <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="单据编号：" prop="SplitCode">
            <el-input v-model="queryForm.SplitCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
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
          <el-form-item label="创建人：" prop="CreateUserId">
            <el-select v-model="queryForm.CreateUserId" placeholder="全部" :filterable="true">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in $store.getters.users" :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="最后操作时间：" prop="CheckTime">
            <el-date-picker v-model="queryForm.CheckTime" type="daterange" value-format="yyyy-MM-dd" :picker-options="$root.datePickerOptions"></el-date-picker>
          </el-form-item>
          <el-form-item label="所有仓库：" prop="WarehouseId">
            <el-select v-model="queryForm.WarehouseId" placeholder="全部" :filterable="true">
              <el-option label="全部" value="0"></el-option>
              <template v-for="(item, index) in $store.getters.wareHouses">
                <el-option v-if="item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="所有原因：" prop="ReasonTypeDk">
            <el-select v-model="queryForm.ReasonTypeDk" placeholder="全部" :filterable="true">
              <el-option label="全部" value="0"></el-option>
              <el-option v-for="(item, index) in reasonData" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>

    <!-- @module 数据表格 -->
    <el-table 
      :data="tableData" 
      ref="tableData"
      @sort-change="sortChange" 
      @selection-change="selectionChange" 
      v-loading="$store.getters.tb_loading" 
      element-loading-text="拼命加载中">
      <el-table-column type="selection" width="55" fixed="left"></el-table-column>
      <el-table-column prop="SplitCode" label="单据编号" min-width="160" sortable="custom" show-overflow-tooltip fixed="left"></el-table-column>
      <el-table-column prop="WarehouseName" label="仓库" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="PartnerName" label="供应商" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ReasonTypeDv" label="拆卸原因" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" min-width="120" sortable="custom" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.CreateTime | filterDateMinutes }}
        </template>
      </el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Quantity" label="成品数量" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="GoldWeight" label="成品金重" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{$root.toFloat(scope.row.GoldWeight,3)}}g
        </template>
      </el-table-column>
      <!-- <el-table-column prop="Quantity" label="结算单" min-width="100" show-overflow-tooltip></el-table-column> -->
      <el-table-column prop="CheckTime" label="最后操作时间" min-width="160" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.CheckTime | filterDateMinutes }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" min-width="100" fixed="right">
        <template slot-scope="scope">
          <template v-if="(scope.row.State === weiwGjunkSplitBasicState.Abandon || scope.row.State === weiwGjunkSplitBasicState.Reject || scope.row.State === weiwGjunkSplitBasicState.Cancel)&&scope.row.CheckNote">
            <el-tooltip class="item" :content="scope.row.CheckNote" placement="top" effect="light">
              <span :class="scope.row.State | findKey(weiwGjunkSplitBasicState)">{{weiwGjunkSplitBasicState.Types[scope.row.State]}}</span>
            </el-tooltip>
          </template>
          <template v-else>
            <span :class="scope.row.State | findKey(weiwGjunkSplitBasicState)">{{weiwGjunkSplitBasicState.Types[scope.row.State]}}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150" fixed="right">
        <template slot-scope="scope">
          <router-link :to="{path:'/depot/outSDismount/check',query:{id:scope.row.SplitId}}" class="btn-link el-button el-button--text">查看</router-link>
          <template v-if="scope.row.State == weiwGjunkSplitBasicState.Draft||scope.row.State == weiwGjunkSplitBasicState.Reject">
            <router-link :to="{path:'/depot/outSDismount/edit',query:{id:scope.row.SplitId}}" class="btn-link el-button el-button--text">编辑</router-link>
            <el-button type="text" @click="openDialog(scope.row, 'abandonDialog')">作废</el-button>
          </template>
          <el-button v-if="scope.row.State == weiwGjunkSplitBasicState.Wait" type="text" @click="openDialog(scope.row, 'auditDialog')">审核</el-button>
          <el-button v-if="scope.row.State == weiwGjunkSplitBasicState.Audit" type="text" @click="openDialog(scope.row, 'cancelDialog')">取消审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- End 数据表格 -->

    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>

    <!-- @module Dialog·新建委派单 -->
    <el-dialog title="新建" :visible.sync="createDialog" @close="resetForm">
      <el-form :model="createForm" label-position="right" label-width="100px" :rules="rules" ref="createForm">
        <el-row>
          <el-col :span="9">
            <el-form-item label="仓库：" prop="WarehouseId">
              <el-select class="m-r-10" v-model="createForm.WarehouseId" @change="chooseHouse" placeholder="请选择" :filterable="true" name="StuffType">
                <template v-for="(item,index) in $store.getters.wareHouses">
                  <el-option v-if=" item.State == YNStatus.Yes" :key="index" :label="item.Value" :value="item.Id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="Shelfs.length>0" key="002" :span="15">
            <el-form-item class="shelf-box" prop="ShelfId">
              <el-select v-model="createForm.ShelfId" placeholder="请选择" label-width="0" :filterable="true" name="StuffType">
                <el-option v-for="(item,index) in Shelfs" :key="index" :label="item.Value" :value="item.Id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="供应商：" prop="PartnerId">
          <el-select v-model="createForm.PartnerId" placeholder="请选择" :filterable="true">
            <el-option v-for="(item, index) in $store.getters.suppliers.filter(item => {return((item.PartnerType == PartnerType.Merchant||item.PartnerType == PartnerType.Supplier)&&item.State==YNStatus.Yes)})" :key="index" :label="item.Value" :value="item.Id" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成品拆卸原因：" prop="ReasonTypeDk">
          <el-select v-model="createForm.ReasonTypeDk" placeholder="请选择" :filterable="true">
            <el-option label="请选择" :value="0"></el-option>
            <el-option v-for="(item, index) in reasonData" :key="index" :label="item.Value" :value="item.Id"></el-option>
          </el-select>
          <span class="icon-set-item" @click="dictDialog=true">
            <i class="icon-set"></i>
          </span>
        </el-form-item>
        <el-form-item label="备注：" >
          <el-input type="textarea" row="2" v-model="createForm.Note" :maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createPurchase" :loading="$store.getters.is_loading">确 定</el-button>
        <el-button @click="createDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- End Dialog·新建委派单 -->

    <!-- @module Dialog·编辑委派单原因 -->
    <dictManage v-if="dictDialog" :visible.sync="dictDialog" @listenDictSave="listenDictSave" :dialogTitle="dialogTitle" :dictType="settingDictionaryDictType.WeiwGoodsSplitBasicReasonType" :dicts="reasonData"></dictManage>
    <!-- @module Dialog·编辑委派单结束  -->

    <!-- @module Dialog·审核 -->
    <auditDialog title="审核" v-if="auditDialog" :auditDialog="auditDialog" :data="selections" @listenAuditDialog="listenDialog"></auditDialog>
    <!-- End Dialog·审核 -->

    <!-- @module Dialog·作废 -->
    <abandonDialog title="作废" v-if="abandonDialog" :abandonDialog="abandonDialog" :data="selections" @listenAbandonDialog="listenDialog"></abandonDialog>
    <!-- End Dialog·作废 -->

    <!-- @module Dialog·取消审核 -->
    <cancelDialog title="取消审核" v-if="cancelDialog" :visible.sync="cancelDialog" :data="selections" @listenCancelDialog="getData"></cancelDialog>
    <!-- End Dialog·取消审核 -->
  </div>
</template>

<script>
import {
  YNStatus,
  PartnerType
} from '@/enums/common.js'
import {
  WeiwGjunkSplitBasicSplitType,
  WeiwGjunkSplitBasicState,
  SettingDictionaryDictType
} from '@/enums/stocking.js'
import {
  STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_GETS,
  STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_CREATE
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST 
} from '@/apis/merchant.js'

import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import dictManage from '@/components/erp/dictManage'
import abandonDialog from './abandon'
import auditDialog from './audit'
import cancelDialog from './cancel'

export default {
  data() {
    return {
      PartnerType,
      YNStatus,
      WeiwGjunkSplitBasicSplitType,
      settingDictionaryDictType: SettingDictionaryDictType,
      weiwGjunkSplitBasicState: WeiwGjunkSplitBasicState,
      queryForm: {
        // 查询表单数据
        SplitCode: '',
        SplitType: WeiwGjunkSplitBasicSplitType.Goods,
        WarehouseId: '0',
        ShelfId: '0',
        PartnerId: '0',
        PartnerName: '',
        ReasonTypeDk: '0',
        ReasonTypeDv: '',
        CreateUserId: '0',
        ArrivalCode: '',
        PurchaseUserId: '',
        CreateTime1: '',
        CreateTime2: '',
        CheckTime1: '',
        CreateTime: [],
        CheckTime2: '',
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
      reasonData: [], // 货架下拉
      total: 0,
      selections: [], // 选中的数据
      auditDialog: false,
      createForm: {
        WarehouseId: '',
        ShelfId: '',
        PartnerId: '',
        ReasonTypeDk: 0,
        ReasonTypeDv: '',
        Note: ''
      },
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
        WarehouseId: [
          {
            type: 'number',
            required: true,
            message: '请选择仓库',
            trigger: 'change'
          }
        ],
        ShelfId: [
          {
            type: 'number',
            required: true,
            message: '请选择货架'
          }
        ]
      },
      Shelfs: [],
      dictDialog: false,
      dialogTitle: '成品委外拆卸出库原因',
      createDialog: false, // 创建对话框
      createOutSource: {
      }, // 创建采购单
      abandonDialog: false, // 作废对话框
      abandonPurchase: {
      }, // 作废采购单
      cancelDialog: false, // 取消审核对话框
      cancelPurchase: {
      } // 取消审核采购单
    }
  },
  methods: {
    init() {
      let query = JSON.stringify(this.$route.query) !== '{}' ? this.$route.query : {
        SplitCode: '',
        SplitType: this.WeiwGjunkSplitBasicSplitType.Goods,
        WarehouseId: '0',
        ShelfId: '0',
        PartnerId: '0',
        PartnerName: '',
        ReasonTypeDk: '0',
        ReasonTypeDv: '',
        CreateUserId: '0',
        ArrivalCode: '',
        PurchaseUserId: '',
        CreateTime1: '',
        CreateTime2: '',
        CheckTime1: '',
        CreateTime: [],
        CheckTime2: '',
        CheckTime: [],
        State: '0',
        OrderBy: 0,
        IsAsced: YNStatus.No,
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
      STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_GETS(this.queryForm).then(res => {
        this.$store.commit('SET_TB_LOADING', false)
        if(res.data.Code == 'CORRECT'){
          this.tableData = res.data.Data.Rows||[]
          this.total = res.data.Data.Count||0
        }
      })
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
    chooseHouse(e) {
      this.Shelfs = this.$store.getters.wareHouses.find(item => {
        return item.Id == e
      }).Childrens.filter(item => item.State === YNStatus.Yes)

      this.createForm.ShelfId = this.Shelfs.length == 1?this.Shelfs[0].Id:''
    },
    createPurchase() {
      this.$refs['createForm'].validate(valid => {
        if (valid) {
          this.createForm = Object.assign({}, this.createForm, {
            SplitType: this.WeiwGjunkSplitBasicSplitType.Goods, 
            ReasonTypeDv: this.createForm.ReasonTypeDk?this.getReasonName(this.createForm.ReasonTypeDk):''
          })
          
          this.$store.commit('SET_BTN_LOADING', true)
          STOCKING_API_WEIW_GJUNK_SPLIT_BASIC_CREATE(this.createForm).then(res => {
            this.$store.commit('SET_BTN_LOADING', false)
            if(res.data.Code == 'CORRECT'){
              this.$message.success('提交成功！')
              this.$router.push({
                path: '/depot/outSDismount/edit',
                query: {
                  id: res.data.Data
                }
              })
            }else{
              this.$message.error(res.data.Message)
            }
          }).catch(() => {
            this.$store.commit('SET_BTN_LOADING', false)
          })
        } else {
          this.$message.error('请完善信息！')
        }
      })
    },
    getReasonName(id){
      let result = this.reasonData.find(item => {
        return item.Id == id
      })
      return result.Value
    },
    resetForm(){
      this.Shelfs = []
      this.$refs.createForm.resetFields()
    },
    openDialog(row, type){
      this.selections = [row]
      this[type] = true
    },
    multiAudit() {
      if (
        !this.selections.length ||
        this.selections.filter(item => {
          if (item.State !== this.weiwGjunkSplitBasicState.Wait) {
            return item
          }
        }).length > 0
      ) {
        this.$message.error('请选择待审核的单据')
      } else {
        this.auditDialog = true
      }
    },
    listenDialog(type, success){
      this[type] = false
      this.selections = []
      this.$refs.tableData.clearSelection()
      if (success) {
        this.getData()
      }
    },
    listenDictSave(){
      this.getReasons()
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
    getEnums(){
      this.$store.dispatch('GET_WAREHOUSES_DROPLIST', {HasShelf: this.YNStatus.Yes, State: this.YNStatus.Yes})
      this.$store.dispatch('GET_SUPPLIERS_DROPLIST')
      this.$store.dispatch('GET_USERS_DROPLIST')
    },
    // getHouse(){
    //   let house = []
    //   house = this.$store.getters.wareHouses.filter(item => {return item.State == YNStatus.Yes})
    //   if(house&&house.length == 1){
    //     this.createForm.WarehouseId = house[0].Id
    //     this.Shelfs = house[0].Childrens
    //     this.createForm.ShelfId = house[0].Childrens[0].Id
    //   }
    // },
    getReasons(){
      // this.$store.dispatch('GET_REASONS_DROPLIST', {DictType: this.settingDictionaryDictType.WeiwGoodsSplitBasicReasonType, State: 0})
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        DictType: this.settingDictionaryDictType.WeiwGoodsSplitBasicReasonType,
        State: this.YNStatus.Yes
      }).then(res => {
        if(res.data.Code == 'CORRECT'){
          this.reasonData = res.data.Data.Rows||[]
          if(!this.reasonData.some(item => item.Id === this.createForm.ReasonTypeDk)){
            this.createForm.ReasonTypeDk = 0
            this.createForm.ReasonTypeDv = ''
          }
        }
      })
    },
  },
  beforeMount() {
    this.getEnums()
    this.getReasons()
  },
  mounted() {
    this.init()
  },
  watch: {
    $route: 'init',
    'queryForm.State' () {
      this.onSearch()
    },
  },
  components: {
    pagination,
    searchPanel,
    abandonDialog,
    auditDialog,
    cancelDialog,
    dictManage
  }
}
</script>
