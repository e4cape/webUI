<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-button type="primary" @click="newEndProduct">新建</el-button>
          <el-dropdown @command="showAuditDialog()" name="btnMultiAudit">
            <el-button type="default">
              批量操作
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="expandRows == 0">批量标记已打印</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select filterable name="status" v-model="queryForm.State" placeholder="所有状态">
              <el-option label="所有状态" value="0"></el-option>
              <el-option v-for="item in orderBasicState.TypeArray" :key="item.value" :label="item.Value" :value="String(item.KeyId)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="PrintCode">
            <el-input
              name="PrintCode"
              v-model="queryForm.PrintCode"
              :maxlength="50"
              @keyup.enter.native="onSearch"
              placeholder="单据编号"
            >
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="所有原因：" prop="ReasonTypeDk" >
            <el-select filterable name="ReasonTypeDk" v-model="queryForm.ReasonTypeDk" placeholder="所有原因">
              <el-option label="所有原因" value="0"></el-option>
              <el-option v-for="(item, index) in reasonsList" :key="index" :label="item.Value" :value="String(item.Id)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="PrintCode" label="单据编号：">
            <el-input name="PrintCode" v-model="queryForm.PrintCode" :maxlength="50" @keyup.enter.native="onSearch"></el-input>
          </el-form-item>
          <el-form-item label="创建人：" prop="CreateUserId">
            <el-select filterable name="CreateUserId" v-model="queryForm.CreateUserId" placeholder="全部">
              <el-option label="全部" value="0"></el-option>
              <template v-for="(item, index) in buyerList">
                <el-option v-if="item.UserState === SecurityUserState.Audit" :key="index" :label="item.TrueName" :value="String(item.UserId)"></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间：" prop="CreateTime">
            <el-date-picker
              name="CreateTime"
              v-model="queryForm.CreateTime"
              @change="createChange"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </template>
      </search-panel>
    </el-form>
    <!-- Data Table -->
    <el-table :data="data" @sort-change="querySort" @selection-change="expandRow" v-loading="$store.getters.tb_loading" element-loading-text="拼命加载中">
      <el-table-column type="selection" fixed></el-table-column>
      <el-table-column prop="PrintCode" label="单据编号" sortable="custom" width="120" show-overflow-tooltip fixed></el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" sortable="custom" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column prop="CreateUser" label="创建人" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ReasonTypeDv" label="打印原因" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ItemQty" label="条码数量" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="PrintQty" label="打印数量" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="Note" label="备注" min-width="80" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" min-width="80" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">{{orderBasicState.Types[scope.row.State]}}</template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button name="btnShowDetail" type="text" @click="viewArrivalOrder(scope.row.PrintId)">查看</el-button>
          <el-button name="btnShowDetail" type="text" v-if="orderBasicState.Printing == scope.row.State" @click="linkEditPage(scope.row.PrintId)">编辑</el-button>
          <el-button name="btnShowDetail" type="text" @click="$router.push({path:'/purchase/batchLabel/printing',query:{id: scope.row.PrintId}})">打印</el-button>
          <el-button name="btnShowDetail" type="text" v-if="orderBasicState.Printing == scope.row.State" @click="setPrinted(scope.row.PrintId)">标记已打印</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Pagination -->
    <pagination :pg="queryForm.PageIndex" :size="queryForm.PageSize" :total="total" @currentChange="currentChange" @sizeChange="sizeChange"></pagination>
    <el-dialog v-if="newVisible" title="新建打印单" :visible.sync="newVisible" width="600px" :before-close="newOrderDialogColse">
      <el-form :model="newPurchaseOrder" :rules="newOrderRules" ref="newOrder" lable-width="120px" class="item-lh-26" :inline="true">
        <div>
          <el-form-item label="打印原因：" prop="ReasonTypeDk" class="m-b-20">
            <el-select filterable name="ReasonTypeDk" v-model="newPurchaseOrder.ReasonTypeDk" placeholder="请选择" @change="reasonTypeChange">
              <el-option v-for="(item, index) in reasonsList" :key="index" :label="item.Value" :value="Number(item.Id)"></el-option>
            </el-select>
            <span class="icon-set-item" @click="reasonDialog=true" name="iconSetItem">
              <i class="icon-set"></i>
            </span>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="备注" prop="Note">
            <el-input type="textarea" @blur="newPurchaseOrder.Note = newPurchaseOrder.Note.trim()" v-model="newPurchaseOrder.Note" style="width: 300px" :maxlength="200"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="newDialogConfirm('newOrder')">确 定</el-button>
        <el-button @click="newOrderDialogColse">取 消</el-button>
      </span>
    </el-dialog>
    <!-- @module Dialog·新建修改原因 -->
    <dict-manage :visible.sync="reasonDialog" :dicts="reasonsList" dialogTitle="打印原因" :dictType="SettingDictionaryDictType.GoodsPrintOrderBasicReasonType" @listenDictSave="getReturn"></dict-manage>
    <!-- End Dialog·新建修改原因  -->
  </el-row>
</template>
<script>
import {
  GoodsPrintOrderBasicState,
  SettingCustomizedFieldOrderType,
  SettingDictionaryDictType
} from '@/enums/stocking.js'
import { CharacterType, YNStatus, EnableState } from '@/enums/common.js'
import {
  STOCKING_API_GOODS_PRINT_ORDER_BASIC_GETS,
  STOCKING_API_GOODS_PRINT_ORDER_BASIC_CREATE,
  STOCKING_API_GOODS_PRINT_ORDER_BASIC_AUDIT,
  STOCKING_API_GOODS_PRINT_ORDER_BASIC_AUDITS
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_USERLIST,
  MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST
} from '@/apis/merchant.js'
import {
  SecurityUserState
} from '@/enums/merchant.js'
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import reviewDialog from '@/components/purchase/reviewDialog'
import obsolete from '@/components/purchase/obsolete'
import dictManage from '@/components/erp/dictManage'
export default {
  data() {
    return {
      SecurityUserState,
      SettingDictionaryDictType,
      characterType: CharacterType,
      orderType:
        SettingCustomizedFieldOrderType.StockingCloudGoodsIntakeOrderBasic,
      orderBasicState: GoodsPrintOrderBasicState, // 状态
      buyerList: [], // 采购员下拉
      reasonsList: [], // 原因下拉
      queryForm: {
        // 查询表单数据
        State: '0',
        ReasonTypeDk: '0',
        PrintCode: '',
        CreateUserId: '0',
        CreateTime: [],
        CreateTime1: '',
        CreateTime2: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      data: [],
      total: 0,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date() - 8.64e7
        }
      },
      newVisible: false, // 新建弹窗
      auditDialog: false, // 审核弹窗
      obsoleteVisble: false, // 作废弹窗
      newPurchaseOrder: {
        ReasonTypeDk: '',
        ReasonTypeDv: '',
        Note: ''
      }, // 新建成品入库单
      expandRows: [],
      parameters: {},
      reviewTitle: '', // 审核弹窗标题
      reviewData: [], // 弹窗数据
      newOrderRules: {
        ReasonTypeDk: [
          { required: true, message: '请选择打印原因', trigger: 'change' }
        ],
        Note: [
          {
            validator: (rule, value, callback) => {
              if (value.length >= 200) {
                callback(new Error('备注过长'))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      },
      reasonDialog: false // 新建修改原因弹窗
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query
          : {
            State: '0',
            ReasonTypeDk: '0',
            PrintCode: '',
            CreateUserId: '0',
            CreateTime1: '',
            CreateTime2: '',
            OrderBy: 0,
            IsAsced: YNStatus.No,
            PageIndex: 1,
            PageSize: 20
          }
      this.parameters = Object.assign({}, query)
      this.getData()
    },
    getData() {
      this.$store.commit('SET_TB_LOADING', true) // table loading
      this.queryForm = Object.assign(this.queryForm, this.parameters)
      STOCKING_API_GOODS_PRINT_ORDER_BASIC_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    createChange(value) {
      if (value) {
        this.queryForm.CreateTime1 = value[0]
        this.queryForm.CreateTime2 = value[1]
      } else {
        this.queryForm.CreateTime1 = ''
        this.queryForm.CreateTime2 = ''
      }
      this.onSearch()
    },
    checkChange(value) {
      if (value) {
        this.queryForm.CheckTime1 = value[0]
        this.queryForm.CheckTime2 = value[1]
      } else {
        this.queryForm.CheckTime1 = ''
        this.queryForm.CheckTime2 = ''
      }
      this.onSearch()
    },
    expandRow(val) {
      this.expandRows = val
    },
    querySort(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.queryForm.OrderBy = 0
          break
        case 'CheckTime':
          this.queryForm.OrderBy = 1
          break
        case 'PrintId':
          this.queryForm.OrderBy = 3
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    onSearch() {
      // 搜索相关
      this.queryForm.PageIndex = 1
      this.parameters = JSON.parse(JSON.stringify(this.queryForm))
      if (JSON.stringify(this.$route.query) == JSON.stringify(this.queryForm)) {
        this.getData()
      } else {
        this.initRoute()
      }
    },
    onReset() {
      // 重置表单
      this.queryForm.CreateTime1 = ''
      this.queryForm.CreateTime2 = ''
      this.queryForm.CheckTime1 = ''
      this.queryForm.CheckTime2 = ''
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
      this.parameters.PageSize = val
      this.parameters.PageIndex = 1
      this.initRoute()
    },
    initRoute() {
      this.$router.replace({ path: this.$router.path, query: this.parameters })
    },
    // 查看到货单
    viewArrivalOrder(id) {
      this.$router.push({
        path: '/purchase/batchLabel/batchLabelCheck',
        query: { id }
      })
    },
    // 跳转编辑
    linkEditPage(id) {
      this.$router.push({
        path: '/purchase/batchLabel/batchLabelEdit',
        query: { id }
      })
    },
    setPrinted(id) {
      this.$confirm(
        '确定标记为已打印？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        const para = {
          PrintId: id,
          CheckNote: ''
        }
        STOCKING_API_GOODS_PRINT_ORDER_BASIC_AUDIT(para).then(res => {
          if (res.data.Code === 'CORRECT') {
            this.onSearch()
          }
        })
      }).catch(() => {})
    },
    // 获取创建人
    getBuyerList() {
      MERCHANT_API_DROPDOWN_USERLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.buyerList = res.data.Data.Rows
        }
      })
    },
    // 获取修改原因
    getReturn() {
      MERCHANT_API_DROPDOWN_SETTINGDICTIONARYLIST({
        State: EnableState.Enable,
        DictType: SettingDictionaryDictType.GoodsPrintOrderBasicReasonType
      }).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.reasonsList = res.data.Data.Rows
        }
      })
    },
    // 打开新建弹窗
    newEndProduct() {
      this.newVisible = true
    },
    // 打开审核和批量审核弹窗
    showAuditDialog() {
      for (let i = 0; i < this.expandRows.length; i += 1) {
        if (this.expandRows[i].State === 3) {
          return this.$message.error('请选择未标记打印的打印单')
        }
      }
      const arr = this.expandRows.map(item => {
        return item.PrintId
      })
      const para = {
        PrintIds: arr,
        CheckNote: ''
      }
      STOCKING_API_GOODS_PRINT_ORDER_BASIC_AUDITS(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '批量标记成功',
            type: 'success'
          })
          this.onSearch()
        }
      })
    },
    // 新建弹窗确定
    newDialogConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const para = {
            ...this.newPurchaseOrder,
            ReasonTypeDk: Number(this.newPurchaseOrder.ReasonTypeDk)
          }
          STOCKING_API_GOODS_PRINT_ORDER_BASIC_CREATE(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$refs[formName].resetFields()
              this.shelfList = []
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              this.newVisible = false
              this.$router.push({
                path: '/purchase/batchLabel/batchLabelEdit?id=' + res.data.Data
              })
            }
          })
        }
      })
    },
    // 打印原因
    reasonTypeChange() {
      this.reasonsList.map(item => {
        if (item.Id == this.newPurchaseOrder.ReasonTypeDk) {
          this.newPurchaseOrder.ReasonTypeDv = item.Value
        }
      })
    },
    // 新建弹窗关闭
    newOrderDialogColse() {
      this.$refs['newOrder'].resetFields()
      this.newVisible = false
    }
  },
  created() {},
  mounted() {
    this.getReturn()
    this.getBuyerList()
    this.init()
  },
  watch: {
    $route: 'init',
    'queryForm.State': 'onSearch',
    'queryForm.IntakeType': 'onSearch',
    'queryForm.ChargeUserId': 'onSearch'
  },
  components: {
    searchPanel,
    pagination,
    reviewDialog,
    obsolete,
    dictManage
  }
}
</script>

<style lang="scss" scoped>
.el-dialog__body .item-lh-26 .m-b-20 {
  margin-bottom: 16px!important;
}
</style>
