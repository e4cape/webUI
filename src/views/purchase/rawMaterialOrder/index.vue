<template>
  <el-row class="content">
    <el-form :model="queryForm" ref="search" lable-width="120px" class="item-lh-26" :inline="true">
      <search-panel @onSearch="onSearch" @onReset="onReset">
        <template slot="btnBox">
          <el-form-item>
            <el-dropdown @command="openNewOrderForm" type="primary" style="margin-right: 10px;" >
              <el-button name="btnmultiCheckPrint" type="primary">
                新建
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in stuffType.TypeArray"
                  :key="index"
                  :command="item.KeyId"
                  style="min-width: 80px; text-align: center;"
                >{{item.Value}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown @command="reviewStyleOrder('批量审核')" name="btnMultiAudit">
              <el-button type="default">
                批量操作
                <i class="el-icon-caret-bottom el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :disabled="expandRows == 0">批量审核</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </template>
        <template slot="simpleSearch">
          <el-form-item prop="State">
            <el-select name="State" v-model="queryForm.State" placeholder="所有" :filterable="true">
              <el-option label="所有" value="0"></el-option>
              <el-option
                v-for="(item,index) in orderBasicState.TypeArray"
                :key="index"
                :label="item.Value"
                :value="String(item.KeyId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="PurchaseCode">
            <el-input
              name="PurchaseCode"
              v-model="queryForm.PurchaseCode"
              :maxlength="50"
              @keyup.enter.native="onSearch"
              placeholder="单据编号"
            >
              <el-button name="btnSearch" slot="append" class="el-icon-search" @click="onSearch"></el-button>
            </el-input>
          </el-form-item>
        </template>
        <template slot="seniorSearch">
          <el-form-item label="类型：" prop="StuffType">
            <el-select filterable name="StuffType" v-model="queryForm.StuffType" placeholder="所有类型">
              <el-option label="所有类型" value="0"></el-option>
              <el-option
                v-for="(item,index) in stuffType.TypeArray"
                :key="index"
                :label="item.Value"
                :value="String(item.KeyId)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="PurchaseCode" label="单据编号：">
            <el-input
              name="PurchaseCode"
              v-model="queryForm.PurchaseCode"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item prop="PartnerName" label="供应商：">
            <el-input
              name="PartnerName"
              v-model="queryForm.PartnerName"
              :maxlength="50"
              @keyup.enter.native="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建时间：" prop="CreateTime">
            <el-date-picker
              name="CreateTime"
              v-model="queryForm.CreateTime"
              @change="createDateChange"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="采购员：" prop="CreateUserId">
            <el-select filterable name="CreateUserId" v-model="queryForm.CreateUserId" placeholder="创建人">
              <el-option label="全部" value="0"></el-option>
              <template v-for="(item,index) in buyerList">
                <el-option
                  v-if="item.UserState === SecurityUserState.Audit"
                  :key="index"
                  :label="item.TrueName"
                  :value="String(item.UserId)"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="业务日期：" prop="ActualDate">
            <el-date-picker
              name="ActualDate"
              v-model="queryForm.ActualDate"
              @change="actualDateChange"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="$root.datePickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="预计到货日期：" prop="ForwdDate">
            <el-date-picker
              name="ForwdDate"
              v-model="queryForm.ForwdDate"
              @change="forwdDateChange"
              type="daterange"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="$root.datePickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="最后操作日期：" prop="CheckTime">
            <el-date-picker
              name="CheckTime"
              v-model="queryForm.CheckTime"
              @change="checkDateChange"
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
    <el-table
      :data="data"
      element-loading-text="拼命加载中"
      @sort-change="querySort"
      @selection-change="expandRow"
      v-loading="$store.getters.tb_loading"
    >
      <el-table-column type="selection" fixed></el-table-column>
      <el-table-column
        prop="PurchaseCode"
        fixed
        label="单据编号"
        min-width="140"
        show-overflow-tooltip
        sortable="custom"
      ></el-table-column>
      <el-table-column prop="PartnerName" label="供应商" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column label="类型" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{stuffType.Types[scope.row.StuffType]}}</template>
      </el-table-column>
      <el-table-column
        prop="ActualDate"
        label="业务日期"
        min-width="100"
        show-overflow-tooltip
        sortable="custom"
      >
        <template slot-scope="scope">{{scope.row.ActualDate | filterDate}}</template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        min-width="100"
        show-overflow-tooltip
        sortable="custom"
      >
        <template slot-scope="scope">{{scope.row.CreateTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column prop="CreateUser" label="采购员" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="ItemQty"
        label="数量"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="ItemWgt"
        label="重量"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{$root.toFloat(scope.row.ItemWgt, 3)}}
        </template>
      </el-table-column>
      <el-table-column label="应付款" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">{{$root.toFloat(scope.row.Preprice)}}</template>
      </el-table-column>
      <el-table-column label="预计到货日期" min-width="120" show-overflow-tooltip sortable="custom">
        <template slot-scope="scope">{{scope.row.ForwdDate | filterDate}}</template>
      </el-table-column>
      <el-table-column label="最后操作时间" min-width="120" show-overflow-tooltip sortable="custom">
        <template slot-scope="scope">{{scope.row.CheckTime | filterDateTime}}</template>
      </el-table-column>
      <el-table-column label="状态" min-width="80" show-overflow-tooltip fixed="right">
        <template slot-scope="scope">
          <el-tooltip placement="top" v-if="(scope.row.State === orderBasicState.Reject || scope.row.State === orderBasicState.Abandon || scope.row.State === orderBasicState.Cancel) && scope.row.CheckNote">
            <div slot="content">{{scope.row.CheckNote}}</div>
            <span
              :class="scope.row.State | findKey(orderBasicState)">
              {{orderBasicState.Types[scope.row.State] || '-'}}
            </span>
          </el-tooltip>
          <span
            :class="scope.row.State | findKey(orderBasicState)"
            v-else>
            {{orderBasicState.Types[scope.row.State] || '-'}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200" fixed="right">
        <template slot-scope="scope">
          <el-button name="btnViewData" type="text" @click="viewOrderForm(scope.row.PurchaseId)">查看</el-button>
          <el-button
            v-if="scope.row.State == orderBasicState.Draft || scope.row.State == orderBasicState.Reject"
            name="editData"
            type="text"
            @click="editOrderForm(scope.row.PurchaseId, scope.row.StuffType)"
          >编辑</el-button>
          <el-button
            v-if="scope.row.State == orderBasicState.Wait"
            name="btnWaitData"
            type="text"
            @click="reviewStyleOrder('审核',scope.row)"
          >审核</el-button>
          <el-button
            v-if="scope.row.State == orderBasicState.Draft || scope.row.State == orderBasicState.Reject"
            name="btnShowDetail"
            type="text"
            @click="openObsolete(scope.row)"
          >作废</el-button>
          <el-button
            v-if="scope.row.State == orderBasicState.Audit"
            name="btncancelAudit"
            type="text"
            @click="openCancelReview(scope.row)"
          >取消审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- Pagination -->
    <pagination
      :pg="queryForm.PageIndex"
      :size="queryForm.PageSize"
      :total="total"
      @currentChange="currentChange"
      @sizeChange="sizeChange"
    ></pagination>
    <!-- end 货品详情-->
    <!-- 新建 -->
    <el-dialog
      :title="`新建原料订货单(${stuffType.Types[newStyleData.StuffType]})`"
      :visible.sync="newVisible"
      width="500px"
      @close="closeNewForm"
    >
      <el-form :model="newStyleData" label-width="120px" :rules="newRules" ref="newForm">
        <el-form-item label="供应商：" prop="PartnerId">
          <el-select
            name="PartnerId"
            v-model="newStyleData.PartnerId"
            placeholder="请选择供应商"
            :filterable="true"
          >
          <template v-for="(item,index) in supplierDown">
            <el-option
              v-if="item.State === YNStatus.Yes && (item.PartnerType == partnerType.Merchant || item.PartnerType == partnerType.Supplier)"
              :key="index"
              :label="item.Value"
              :value="String(item.Id)"
            ></el-option>
          </template>
          </el-select>
        </el-form-item>
        <el-form-item label="业务日期：" prop="ActualDate">
          <el-date-picker
            :clearable="false"
            name="ActualDate"
            v-model="newStyleData.ActualDate"
            value-format="yyyy-MM-dd"
            :picker-options="$store.getters.businessDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="应付款：" prop="Preprice">
          <el-input
            name="Preprice"
            v-model="newStyleData.Preprice"
            @keyup.native="newStyleData.Preprice = $root.toFixed(newStyleData.Preprice, 2, true)"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item label="预计到货日期：" prop="ForwdDate">
          <el-date-picker
            :clearable="false"
            name="ForwdDate"
            v-model="newStyleData.ForwdDate"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注：" prop="Note">
          <el-input name="Note" type="textarea" v-model="newStyleData.Note" @blur="newStyleData.Note = newStyleData.Note.trim()" maxlength="200"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="btnSave" type="primary" @click="newSave('newForm')">保存</el-button>
        <el-button name="btnClose" @click="closeNewForm">取消</el-button>
      </div>
    </el-dialog>
    <!-- 作废 -->
    <obsolete
      v-if="obsoleteVisble"
      @visbleColse="visbleColse"
      @confirmObsolete="confirmObsolete"
      :data="operatingData"
      :visibleObs="obsoleteVisble"
    ></obsolete>
    <!-- 审核 -->
    <review-Dialog
      :auditDialog="auditDialog"
      :title="reviewTitle"
      :data="operatingData"
      v-if="auditDialog"
      @confirmClick="confirmAudit"
      @cancelClick="cancelAudit"
    ></review-Dialog>
    <!-- 取消审核 -->
    <cancel-Review
      :visibleCan="visibleCan"
      :data="operatingData"
      v-if="visibleCan"
      @confirmCancel="cancelConfirm"
      @visbleColse="cancelColse"
    ></cancel-Review>
  </el-row>
</template>

<script>
import { YNStatus, StuffType, PartnerType } from '@/enums/common.js'
import { StuffPurchaseOrderBasicState } from '@/enums/stocking.js'
import {
  STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_GETS,
  STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_CREATE,
  STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_AUDIT,
  STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_REJECT,
  STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_AUDITS,
  STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_REJECTS,
  STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_CANCEL,
  STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_ABANDON
} from '@/apis/stocking.js'
import {
  MERCHANT_API_DROPDOWN_PARTNERBASICLIST,
  MERCHANT_API_DROPDOWN_USERLIST
} from '@/apis/merchant.js'
import { SecurityUserState } from '@/enums/merchant.js'
import searchPanel from '@/components/searchPanel.vue'
import pagination from '@/components/pagination'
import obsolete from '@/components/purchase/obsolete'
import reviewDialog from '@/components/purchase/reviewDialog'
import cancelReview from '@/components/purchase/cancelReview'
import dayjs from 'dayjs'
// import { setTimeout } from 'timers';
export default {
  data() {
    return {
      SecurityUserState,
      partnerType: PartnerType,
      orderBasicState: StuffPurchaseOrderBasicState, // 订货单状态
      stuffType: StuffType, // 原料下拉
      supplierDown: [], // 供应商下拉
      buyerList: [], // 采购员
      YNStatus,
      queryForm: {
        // 查询表单数据
        State: '0',
        StuffType: '0',
        PurchaseCode: '',
        PartnerName: '',
        CreateTime: [],
        CreateTime1: '',
        CreateTime2: '',
        CreateUserId: '0',
        ActualDate: [],
        ActualDate1: '',
        ActualDate2: '',
        ForwdDate: [],
        ForwdDate1: '',
        ForwdDate2: '',
        CheckTime: [],
        CheckTime1: '',
        CheckTime2: '',
        OrderBy: 0,
        IsAsced: YNStatus.No,
        PageIndex: 1,
        PageSize: 20
      },
      data: [], // 数据
      total: 0, // 总数
      expandRows: [],
      parameters: {},
      operatingData: [],
      obsoleteVisble: false, // 作废弹窗
      auditDialog: false, // 审核弹窗
      visibleCan: false, // 取消审核弹窗
      newVisible: false, // 新建
      newStyleData: {
        PartnerId: '',
        StuffType: '',
        Preprice: '',
        ActualDate: dayjs().format('YYYY-MM-DD'),
        ForwdDate: dayjs().format('YYYY-MM-DD'),
        Note: ''
      }, // 新建数据
      newRules: {
        PartnerId: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],
        ActualDate: [
          { required: true, message: '请选择业务日期', trigger: 'change' }
        ],
      }, // 新建验证
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date()
        }
      },
      pickersOptions: {
        disabledDate(time) {
          return time.getTime() < new Date() - 8.64e7
        }
      },
      returnInfo: {
        auditType: YNStatus.Yes, // 审核状态 1代表通过 3代表不通过
        auditReson: '' // 审核不通过理由
      } // 审核信息
    }
  },
  methods: {
    init() {
      let query =
        JSON.stringify(this.$route.query) !== '{}'
          ? this.$route.query : {
            State: '0',
            StuffType: '0',
            PurchaseCode: '',
            PartnerName: '',
            CreateTime1: '',
            CreateTime2: '',
            CreateUserId: '0',
            ActualDate1: '',
            ActualDate2: '',
            ForwdDate1: '',
            ForwdDate2: '',
            CheckTime1: '',
            CheckTime2: '',
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
      STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_GETS(this.queryForm).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.data = res.data.Data.Rows || []
          this.total = res.data.Data.Count || 0
        }
        this.$store.commit('SET_TB_LOADING', false) // table loading
      })
    },
    // 获取供应商下拉
    getSupplierList() {
      MERCHANT_API_DROPDOWN_PARTNERBASICLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          console.log(res)
          this.supplierDown = res.data.Data.Rows
        }
      })
    },
    querySort(sort) {
      switch (sort.prop) {
        case 'CreateTime':
          this.queryForm.OrderBy = 0
          break
        case 'SplitCode':
          this.queryForm.OrderBy = 1
          break
        case 'ActualDate':
          this.queryForm.OrderBy = 2
          break
        case 'ForwdDate':
          this.queryForm.OrderBy = 3
          break
        case 'CheckTime':
          this.queryForm.OrderBy = 4
          break
        default:
          this.queryForm.OrderBy = 0
          break
      }
      this.queryForm.IsAsced =
        sort.order === 'ascending' ? YNStatus.Yes : YNStatus.No
      this.onSearch()
    },
    actualDateChange(value) {
      if (value) {
        this.queryForm.ActualDate1 = value[0]
        this.queryForm.ActualDate2 = value[1]
      } else {
        this.queryForm.ActualDate1 = ''
        this.queryForm.ActualDate2 = ''
      }
    },
    createDateChange(value) {
      if (value) {
        this.queryForm.CreateTime1 = value[0]
        this.queryForm.CreateTime2 = value[1]
      } else {
        this.queryForm.CreateTime1 = ''
        this.queryForm.CreateTime2 = ''
      }
    },
    forwdDateChange(value) {
      if (value) {
        this.queryForm.ForwdDate1 = value[0]
        this.queryForm.ForwdDate2 = value[1]
      } else {
        this.queryForm.ForwdDate1 = ''
        this.queryForm.ForwdDate2 = ''
      }
    },
    checkDateChange(value) {
      if (value) {
        this.queryForm.CheckTime1 = value[0]
        this.queryForm.CheckTime2 = value[1]
      } else {
        this.queryForm.CheckTime1 = ''
        this.queryForm.CheckTime2 = ''
      }
    },
    expandRow(row) {
      this.expandRows = row
    },
    // 新建打开
    openNewOrderForm(command) {
      this.newStyleData.StuffType = command
      this.newVisible = true
    },
    // 新建保存
    newSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const para = {
            ...this.newStyleData,
            ForwdDate: this.newStyleData.ForwdDate ? this.newStyleData.ForwdDate : '1900-01-01',
            PartnerId: Number(this.newStyleData.PartnerId),
            StuffType: Number(this.newStyleData.StuffType),
            Preprice: this.$root.toInt(Number(this.newStyleData.Preprice))
          }
          const type =  this.newStyleData.StuffType
          STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_CREATE(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '新建成功',
                type: 'success'
              })
              this.closeNewForm()
              setTimeout(() => {
                this.editOrderForm(res.data.Data, type)
              }, 500)
            }
          })
        }
      })
    },
    // 新建取消
    closeNewForm() {
      this.$refs['newForm'].resetFields()
      this.newVisible = false
    },
    // 查看
    viewOrderForm(id) {
      this.$router.push(`/purchase/rawMaterialOrder/viewMaterialOrder?id=${id}`)
    },
    editOrderForm(id, type) {
      this.$router.push(`/purchase/rawMaterialOrder/editMaterialOrder?id=${id}&type=${type}`)
    },
    // 打开作废
    openObsolete(obj) {
      this.operatingData = [{ ...obj, orderNumber: obj.PurchaseCode }]
      this.obsoleteVisble = true
    },
    // 作废关闭
    visbleColse() {
      this.obsoleteVisble = false
    },
    // 作废确认
    confirmObsolete(note) {
      const para = {
        PurchaseId: this.operatingData[0].PurchaseId,
        CheckNote: note
      }
      STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_ABANDON(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '作废成功',
            type: 'success'
          })
          this.obsoleteVisble = false
          this.operatingData = []
          this.onSearch()
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    // 关闭审核
    cancelAudit() {
      this.operatingData = []
      this.reviewTitle = ''
      this.auditDialog = false
    },
    // 打开取消审核
    openCancelReview(obj) {
      this.operatingData = obj ? [{ ...obj, orderNumber: obj.PurchaseCode }] : []
      this.visibleCan = true
    },
    // 打开审核和批量审核弹窗
    reviewStyleOrder(title, obj) {
      this.operatingData = obj ? [{ ...obj, orderNumber: obj.PurchaseCode }] : []
      this.reviewTitle = title || ''
      this.auditDialog = true
    },
    // 审核确定
    confirmAudit(data) {
      if (this.reviewTitle == '审核') {
        const para = {
          PurchaseId: Number(this.operatingData[0].PurchaseId),
          CheckNote: data.auditReson
        }
        if (YNStatus.Yes === data.auditType) {
          STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_AUDIT(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '审核通过成功',
                type: 'success'
              })
              this.onSearch()
              this.cancelAudit()
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        } else if (YNStatus.No === data.auditType) {
          STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_REJECT(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '审核退回成功',
                type: 'success'
              })
              this.onSearch()
              this.cancelAudit()
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        }
      } else if (this.reviewTitle == '批量审核') {
        if (this.expandRows.some((res) =>{
          return res.State != this.orderBasicState.Wait
        })) {
          this.$store.commit('SET_BTN_LOADING', false)
          this.$message.error('请选择待审核的原料订货单!')
          return false
        }
        const para = {
          items: this.expandRows,
          CheckNote: data.auditReson
        }
        if (YNStatus.Yes === data.auditType) {
          STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_AUDITS(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '批量审核通过成功',
                type: 'success'
              })
              this.onSearch()
              this.cancelAudit()
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        } else if (YNStatus.No === data.auditType) {
          STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_REJECTS(para).then(res => {
            if (res.data.Code === 'CORRECT') {
              this.$message({
                message: '批量审核退回成功',
                type: 'success'
              })
              this.onSearch()
              this.cancelAudit()
            }
            this.$store.commit('SET_BTN_LOADING', false)
          })
        }
      }
    },
    // 取消审核确定
    cancelConfirm(data) {
      const para = {
        PurchaseId: Number(this.operatingData[0].PurchaseId),
        CheckNote: data
      }
      STOCKING_API_STUFF_PURCHASE_ORDER_BASIC_CANCEL(para).then(res => {
        if (res.data.Code === 'CORRECT') {
          this.$message({
            message: '取消审核成功',
            type: 'success'
          })
          this.cancelColse()
          this.onSearch()
        }
        this.$store.commit('SET_BTN_LOADING', false)
      })
    },
    // 取消审核关闭
    cancelColse() {
      this.operatingData = []
      this.visibleCan = false
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
      this.queryForm.ActualDate1 = ''
      this.queryForm.ActualDate2 = ''
      this.queryForm.CreateTime1 = ''
      this.queryForm.CreateTime2 = ''
      this.queryForm.ForwdDate1 = ''
      this.queryForm.ForwdDate2 = ''
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
      this.$router.replace({
        path: this.$router.path,
        query: this.parameters
      })
    },
    // 获取采购员
    getBuyerList() {
      MERCHANT_API_DROPDOWN_USERLIST().then(res => {
        if (res.data.Code === 'CORRECT') {
          this.buyerList = res.data.Data.Rows
        }
      })
    }
  },
  created() {},
  mounted() {
    this.$store.commit('SET_BTN_LOADING', false)
    this.getSupplierList()
    this.getBuyerList()
    this.init()
    this.$store.dispatch('GET_SETTLE_DATE')
  },
  watch: {
    $route: 'init',
    'queryForm.State': 'onSearch',
  },
  components: {
    searchPanel,
    pagination,
    obsolete,
    reviewDialog,
    cancelReview
  }
}
</script>

<style lang="scss" scoped>
.colorRed {
  color: red;
  margin-left: 29px;
  line-height: 23px;
  margin-bottom: 10px;
  span {
    font-weight: bold;
  }
}
</style>
